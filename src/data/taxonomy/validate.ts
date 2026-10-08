// Validation for the taxonomy itself and for company records placed into it.
//
// Two distinct jobs, both run by `npm run validate:taxonomy` and the test suite:
//
//   runTaxonomyIntegrityChecks - is the reference tree internally consistent and
//     does it still cover every industry and pocket in the organization model?
//   validateCompanyProfile - does one company record hold together, and does its
//     declared scale band match what its own numbers produce?
//
// Unknown data is reported as unknown. Nothing here promotes a missing value to
// a clean one.

import { assignScaleBand } from './classify'
import {
  getBeeSectorCode,
  getTaxonomyNode,
  isKnown,
  resolveMunicipality,
  resolveStatutorySector,
  scaleBands,
} from './load'
import type {
  CompanyProfile,
  CrosswalkFile,
  StatutorySchedule,
  TaxonomyIssue,
  TaxonomyNode,
} from './types'

// --- CIPC registration-number rules ----------------------------------------
//
// The last two digits of a South African registration number encode the entity
// type, which makes the number checkable against the declared type. Getting
// this wrong is the most common defect in imported company data.
const CIPC_SUFFIX: Record<string, string> = {
  'pty-ltd': '07',
  'ltd-public': '06',
  'ltd-inc': '07',
  npc: '08',
  cc: '23',
  'co-operative': '24',
  'soc-ltd': '30',
  'foreign-branch': '10',
}

const NO_CIPC_NUMBER: ReadonlySet<string> = new Set([
  'sole-proprietorship',
  'partnership',
  'trust',
  'npo-association',
  'unregistered-informal',
  'provincial-department',
])

const OPTIONAL_CIPC_NUMBER: ReadonlySet<string> = new Set(['public-entity', 'municipal-entity'])

const CIPC_NUMBER_PATTERN = /^\d{4}\/\d{6}\/\d{2}$/

// --- Taxonomy integrity ----------------------------------------------------

export interface IntegrityInput {
  nodes: TaxonomyNode[]
  crosswalk: CrosswalkFile
  industries: { id: string }[]
  pockets: { id: string }[]
  schedules: StatutorySchedule[]
}

export function runTaxonomyIntegrityChecks(input: IntegrityInput): TaxonomyIssue[] {
  const issues: TaxonomyIssue[] = []
  const ids = new Set<string>()
  const levelById = new Map<string, number>()

  for (const node of input.nodes) {
    if (ids.has(node.id)) {
      issues.push({ code: 'duplicate-node-id', severity: 'error', subject: node.id, detail: 'Node id appears more than once in the sector tree.' })
    }
    ids.add(node.id)
    levelById.set(node.id, node.level)

    if (node.level < 1 || node.level > 4) {
      issues.push({ code: 'bad-level', severity: 'error', subject: node.id, detail: `Level ${node.level} is outside the four-tier architecture.` })
    }

    if (node.parentId === null) {
      if (node.level !== 1) {
        issues.push({ code: 'bad-level', severity: 'error', subject: node.id, detail: 'A node without a parent must be a level 1 macro-sector.' })
      }
      continue
    }

    if (!input.nodes.some((candidate) => candidate.id === node.parentId)) {
      issues.push({ code: 'orphan-node', severity: 'error', subject: node.id, detail: `Parent ${node.parentId} does not exist in the tree.` })
      continue
    }
    const parentLevel = levelById.get(node.parentId)
    if (parentLevel === undefined) {
      issues.push({ code: 'orphan-node', severity: 'error', subject: node.id, detail: `Parent ${node.parentId} is declared after this node; parents must precede children.` })
    } else if (parentLevel !== node.level - 1) {
      issues.push({ code: 'level-skip', severity: 'error', subject: node.id, detail: `Level ${node.level} node sits under a level ${parentLevel} parent; tiers may not be skipped.` })
    }
    if (!node.id.startsWith(`${node.parentId}-`)) {
      issues.push({ code: 'id-prefix-mismatch', severity: 'error', subject: node.id, detail: 'Node id must start with its parent id so the path is readable from the id alone.' })
    }
  }

  // Every macro-sector must resolve to a real Schedule 1 sector class, otherwise
  // the statutory turnover ceiling cannot be looked up for that branch.
  const sectorClassIds = new Set(input.schedules.flatMap((schedule) => schedule.sectorClasses.map((sector) => sector.id)))
  for (const node of input.nodes) {
    if (node.level !== 1) continue
    if (!node.statutorySector) {
      issues.push({ code: 'unknown-statutory-sector', severity: 'error', subject: node.id, detail: 'Macro-sector has no statutorySector, so no Schedule 1 turnover ceiling can be resolved.' })
    } else if (sectorClassIds.size > 0 && !sectorClassIds.has(node.statutorySector)) {
      issues.push({ code: 'unknown-statutory-sector', severity: 'error', subject: node.id, detail: `statutorySector "${node.statutorySector}" is not a Schedule 1 sector class.` })
    }
  }

  // --- Crosswalk completeness ------------------------------------------------
  const crosswalkTargets = new Set<string>()
  for (const mapping of input.crosswalk.pocketMappings) {
    for (const target of mapping.taxonomyNodes) crosswalkTargets.add(target)
  }
  for (const mapping of input.crosswalk.industryMappings) crosswalkTargets.add(mapping.taxonomyNode)
  for (const target of crosswalkTargets) {
    if (!ids.has(target)) {
      issues.push({ code: 'crosswalk-target-missing', severity: 'error', subject: target, detail: 'Crosswalk points at a taxonomy node that does not exist.' })
    }
  }

  const pocketIds = new Set(input.pockets.map((pocket) => pocket.id))
  const industryIds = new Set(input.industries.map((industry) => industry.id))
  for (const mapping of input.crosswalk.pocketMappings) {
    if (!pocketIds.has(mapping.pocketId)) {
      issues.push({ code: 'crosswalk-source-missing', severity: 'error', subject: mapping.pocketId, detail: 'Crosswalk names a sourcing pocket that does not exist in pockets.json.' })
    }
  }
  for (const mapping of input.crosswalk.industryMappings) {
    if (!industryIds.has(mapping.industryId)) {
      issues.push({ code: 'crosswalk-source-missing', severity: 'error', subject: mapping.industryId, detail: 'Crosswalk names an industry that does not exist in industries.json.' })
    }
  }

  const mappedPockets = new Set(input.crosswalk.pocketMappings.map((mapping) => mapping.pocketId))
  const mappedIndustries = new Set(input.crosswalk.industryMappings.map((mapping) => mapping.industryId))
  for (const pocket of input.pockets) {
    if (!mappedPockets.has(pocket.id)) {
      issues.push({ code: 'unmapped-pocket', severity: 'error', subject: pocket.id, detail: 'Sourcing pocket has no taxonomy mapping, so companies in it cannot be placed nationally.' })
    }
  }
  for (const industry of input.industries) {
    if (!mappedIndustries.has(industry.id)) {
      issues.push({ code: 'unmapped-industry', severity: 'error', subject: industry.id, detail: 'Industry has no taxonomy mapping, so companies in it cannot be placed nationally.' })
    }
  }

  return issues
}

// --- Company profile validation -------------------------------------------

export interface ProfileValidationInput {
  profile: CompanyProfile
  /** Reference date, so tests and reports stay deterministic. */
  today?: string
  /** Schedule the band assignment claims to have been derived from. */
  schedules?: StatutorySchedule[]
}

export function validateCompanyProfile(input: ProfileValidationInput): TaxonomyIssue[] {
  const { profile } = input
  const issues: TaxonomyIssue[] = []
  const today = input.today ?? new Date().toISOString().slice(0, 10)
  const subject = profile.id

  const error = (code: TaxonomyIssue['code'], detail: string) =>
    issues.push({ code, severity: 'error', subject, detail })
  const warn = (code: TaxonomyIssue['code'], detail: string) =>
    issues.push({ code, severity: 'warning', subject, detail })

  // --- Taxonomy placement ----------------------------------------------------
  const placementNodes = [profile.taxonomy.primaryNode, ...profile.taxonomy.secondaryNodes]
  for (const nodeId of placementNodes) {
    if (!getTaxonomyNode(nodeId)) {
      error('unknown-node', `Taxonomy node "${nodeId}" does not exist in the sector tree.`)
    }
  }
  if (profile.taxonomy.secondaryNodes.includes(profile.taxonomy.primaryNode)) {
    error('unknown-node', 'primaryNode is also listed in secondaryNodes; a node is placed once.')
  }
  const primary = getTaxonomyNode(profile.taxonomy.primaryNode)
  if (primary && primary.level < 3) {
    warn('unknown-node', `Primary placement is at level ${primary.level}; place the company as deep as the evidence allows (level 3 or 4).`)
  }

  // --- Legal identity --------------------------------------------------------
  const { entityType, cipcRegistrationNumber } = profile.legal
  if (!isKnown('entityType', entityType)) error('unknown-vocabulary-value', `entityType "${entityType}" is not in the controlled vocabulary.`)
  if (!isKnown('cipcStatus', profile.legal.cipcStatus)) error('unknown-vocabulary-value', `cipcStatus "${profile.legal.cipcStatus}" is not in the controlled vocabulary.`)
  if (!isKnown('jseListingStatus', profile.legal.jseListingStatus)) error('unknown-vocabulary-value', `jseListingStatus "${profile.legal.jseListingStatus}" is not in the controlled vocabulary.`)

  if (NO_CIPC_NUMBER.has(entityType) && cipcRegistrationNumber !== '') {
    error('cipc-number-not-applicable', `entityType "${entityType}" never receives a CIPC number, but "${cipcRegistrationNumber}" is recorded.`)
  } else if (CIPC_SUFFIX[entityType] && cipcRegistrationNumber !== '') {
    if (!CIPC_NUMBER_PATTERN.test(cipcRegistrationNumber)) {
      error('cipc-number-mismatch', `CIPC number "${cipcRegistrationNumber}" is not in YYYY/NNNNNN/NN form.`)
    } else if (!cipcRegistrationNumber.endsWith(`/${CIPC_SUFFIX[entityType]}`)) {
      error('cipc-number-mismatch', `CIPC number "${cipcRegistrationNumber}" does not end in /${CIPC_SUFFIX[entityType]}, the suffix for "${entityType}".`)
    }
  } else if (CIPC_SUFFIX[entityType] && cipcRegistrationNumber === '' && profile.status === 'verified') {
    warn('cipc-number-mismatch', `A verified "${entityType}" record should carry its CIPC registration number.`)
  }
  if (OPTIONAL_CIPC_NUMBER.has(entityType) && cipcRegistrationNumber !== '' && !CIPC_NUMBER_PATTERN.test(cipcRegistrationNumber)) {
    error('cipc-number-mismatch', `CIPC number "${cipcRegistrationNumber}" is not in YYYY/NNNNNN/NN form.`)
  }

  // --- Scale band consistency ------------------------------------------------
  const expected = assignScaleBand(
    {
      employeesFte: profile.scale.employeesFte,
      fteReported: profile.scale.fteReported,
      annualTurnoverZar: profile.scale.annualTurnoverZar,
    },
    scaleBands,
    profile.scaleBand.scheduleId,
    today,
  )
  if (
    expected.band !== profile.scaleBand.band ||
    expected.bandByEmployees !== profile.scaleBand.bandByEmployees ||
    expected.bandByTurnover !== profile.scaleBand.bandByTurnover ||
    expected.bandConflict !== profile.scaleBand.bandConflict ||
    expected.statutoryClass !== profile.scaleBand.statutoryClass
  ) {
    error(
      'scale-band-stale',
      `Declared band "${profile.scaleBand.band}" (employees: ${profile.scaleBand.bandByEmployees}, turnover: ${profile.scaleBand.bandByTurnover}) does not match what the record's own numbers produce: "${expected.band}" (employees: ${expected.bandByEmployees}, turnover: ${expected.bandByTurnover}). Scale bands are derived, never hand-entered.`,
    )
  }
  if (!isKnown('scaleBasis', profile.scale.turnoverBasis)) {
    error('unknown-vocabulary-value', `turnoverBasis "${profile.scale.turnoverBasis}" is not in the controlled vocabulary.`)
  }

  // --- B-BBEE ----------------------------------------------------------------
  if (!isKnown('bbbeeCategory', profile.bbbee.category)) error('unknown-vocabulary-value', `B-BBEE category "${profile.bbbee.category}" is not in the controlled vocabulary.`)
  if (!isKnown('bbbeeLevel', profile.bbbee.level)) error('unknown-vocabulary-value', `B-BBEE level "${profile.bbbee.level}" is not in the controlled vocabulary.`)
  if (!isKnown('bbbeeScorecardType', profile.bbbee.scorecardType)) error('unknown-vocabulary-value', `scorecardType "${profile.bbbee.scorecardType}" is not in the controlled vocabulary.`)
  if (!isKnown('bbbeeSectorCode', profile.bbbee.sectorCode)) error('unknown-vocabulary-value', `B-BBEE sectorCode "${profile.bbbee.sectorCode}" is not in the controlled vocabulary.`)
  if (!isKnown('bbbeeEvidenceType', profile.bbbee.evidenceType)) error('unknown-vocabulary-value', `evidenceType "${profile.bbbee.evidenceType}" is not in the controlled vocabulary.`)

  const sectorCode = getBeeSectorCode(profile.bbbee.sectorCode)
  const emeThreshold = sectorCode?.emeThreshold ?? 10_000_000
  const qseThreshold = sectorCode?.qseThreshold ?? 50_000_000
  const turnover = profile.scale.annualTurnoverZar
  if (turnover !== null && profile.bbbee.category !== 'not-verified' && profile.bbbee.category !== 'not-applicable') {
    const expectedCategories =
      turnover <= emeThreshold ? new Set(['eme', 'startup']) : turnover <= qseThreshold ? new Set(['qse']) : new Set(['generic'])
    if (!expectedCategories.has(profile.bbbee.category)) {
      error(
        'bbbee-category-mismatch',
        `Turnover of R${turnover.toLocaleString('en-ZA')} against the ${profile.bbbee.sectorCode} sector code puts this enterprise in the ${turnover <= emeThreshold ? 'EME' : turnover <= qseThreshold ? 'QSE' : 'Generic'} band, not "${profile.bbbee.category}".`,
      )
    }
  }
  if (profile.bbbee.evidenceType === 'sworn-affidavit' && profile.bbbee.category === 'eme' && !['1', '2', '4'].includes(profile.bbbee.level)) {
    error('bbbee-level-invalid-for-evidence', 'An EME on a sworn affidavit is Level 4, or Level 2 at 51%+ and Level 1 at 100% black ownership. No other level is reachable without a scorecard.')
  }
  if (profile.bbbee.evidenceType === 'none' && profile.bbbee.level !== 'not-verified') {
    error('bbbee-level-invalid-for-evidence', 'A level is claimed with no supporting affidavit or certificate on file.')
  }

  // --- Geography -------------------------------------------------------------
  const { province, metropolitanMunicipality, districtMunicipality } = profile.geography
  if (!isKnown('province', province)) error('unknown-vocabulary-value', `province "${province}" is not in the controlled vocabulary.`)
  const metroSet = metropolitanMunicipality !== ''
  const districtSet = districtMunicipality !== ''
  if (metroSet === districtSet) {
    error('geography-inconsistent', 'Exactly one of metropolitanMunicipality and districtMunicipality must be populated; a metro is not inside a district municipality.')
  } else if (resolveMunicipality(province, metropolitanMunicipality, districtMunicipality) === null) {
    error('geography-inconsistent', 'The populated municipality does not belong to the stated province.')
  }
  for (const hub of profile.geography.regionalEconomicHubs) {
    if (!isKnown('regionalEconomicHub', hub)) error('unknown-vocabulary-value', `Regional economic hub "${hub}" is not in the controlled vocabulary.`)
  }
  for (const operatingProvince of profile.geography.operatingProvinces) {
    if (!isKnown('province', operatingProvince)) error('unknown-vocabulary-value', `Operating province "${operatingProvince}" is not in the controlled vocabulary.`)
  }

  // --- Regulatory ------------------------------------------------------------
  if (!isKnown('taxComplianceStatus', profile.regulatory.sarsTaxComplianceStatus)) {
    error('unknown-vocabulary-value', `sarsTaxComplianceStatus "${profile.regulatory.sarsTaxComplianceStatus}" is not in the controlled vocabulary.`)
  }
  if (!isKnown('coidaStatus', profile.regulatory.coidaStatus)) {
    error('unknown-vocabulary-value', `coidaStatus "${profile.regulatory.coidaStatus}" is not in the controlled vocabulary.`)
  }
  if (profile.regulatory.sarsTaxComplianceStatus === 'tcs-valid' && profile.regulatory.sarsTcsPin === '') {
    warn('licence-without-regulator', 'Tax compliance is recorded as a valid PIN but no PIN is stored.')
  }
  if (profile.regulatory.coidaStatus === 'lgs-valid' && profile.regulatory.coidaLgsNumber === '') {
    warn('licence-without-regulator', 'Letter of Good Standing is recorded as valid but no certificate number is stored.')
  }
  for (const licence of profile.regulatory.sectorLicences) {
    if (!isKnown('regulator', licence.regulator)) {
      error('licence-without-regulator', `Licence regulator "${licence.regulator}" is not a known registration authority.`)
    }
    if (licence.licenceType === '') {
      error('licence-without-regulator', 'A sector licence is recorded with no licence type.')
    }
  }

  // --- Status and provenance -------------------------------------------------
  if (profile.illustrativeRecord && profile.status === 'verified') {
    warn('illustrative-not-flagged', 'An illustrative record must not carry verified status.')
  }
  if (profile.scale.provenance.sourceUrl === '' && profile.scale.provenance.confidence !== 'unknown') {
    warn('illustrative-not-flagged', 'Scale provenance has no source URL but claims a confidence above unknown.')
  }
  const statutorySector = resolveStatutorySector(profile.taxonomy.primaryNode)
  if (statutorySector === null && getTaxonomyNode(profile.taxonomy.primaryNode)) {
    error('unknown-statutory-sector', 'Primary taxonomy node resolves to no macro-sector, so no statutory schedule applies.')
  }

  return issues
}
