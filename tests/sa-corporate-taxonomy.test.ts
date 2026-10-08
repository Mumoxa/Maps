import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import Ajv2020 from 'ajv/dist/2020'
import addFormats from 'ajv-formats'
import { assignScaleBand } from '../src/data/taxonomy/classify'
import {
  getMacroSectors,
  getTaxonomyNode,
  getTaxonomyNodeIds,
  industryCrosswalk,
  resolveSectorPath,
  resolveStatutorySector,
  scaleBands,
  sectorTree,
  statutorySchedules,
  vocabularies,
} from '../src/data/taxonomy/load'
import { runTaxonomyIntegrityChecks, validateCompanyProfile } from '../src/data/taxonomy/validate'
import { renderSectorOutline } from '../src/data/taxonomy/outline'
import type { CompanyProfile, TaxonomyLevel } from '../src/data/taxonomy/types'
import industriesRaw from '../markets/organizations/industries.json'
import pocketsRaw from '../markets/organizations/pockets.json'

const TAXONOMY_DIR = resolve('markets/organizations/taxonomy')
const EXAMPLES_DIR = resolve(TAXONOMY_DIR, 'examples')
const TODAY = '2026-10-08'
const industries = industriesRaw as { id: string }[]
const pockets = pocketsRaw as { id: string }[]
const schedules = statutorySchedules.schedules

function bandFor(employeesFte: number | null, turnover: number | null) {
  return assignScaleBand(
    { employeesFte, fteReported: employeesFte !== null, annualTurnoverZar: turnover },
    scaleBands,
    'NSEA-S1-2019',
    TODAY,
  )
}

// ---------------------------------------------------------------------------
// The reference tree
// ---------------------------------------------------------------------------

test('the sector tree is internally consistent and covers the organization model', () => {
  const issues = runTaxonomyIntegrityChecks({
    nodes: sectorTree,
    crosswalk: industryCrosswalk,
    industries,
    pockets,
    schedules,
  })

  assert.deepEqual(
    issues.map((issue) => `${issue.code}: ${issue.subject}`),
    [],
    'taxonomy integrity must report no issues',
  )
})

test('every industry and pocket in the organization model has a taxonomy mapping', () => {
  const mappedIndustries = new Set(industryCrosswalk.industryMappings.map((mapping) => mapping.industryId))
  const mappedPockets = new Set(industryCrosswalk.pocketMappings.map((mapping) => mapping.pocketId))

  assert.equal(mappedIndustries.size, industries.length, 'industry coverage')
  assert.equal(mappedPockets.size, pockets.length, 'pocket coverage')
  for (const industry of industries) assert.ok(mappedIndustries.has(industry.id), `unmapped industry ${industry.id}`)
  for (const pocket of pockets) assert.ok(mappedPockets.has(pocket.id), `unmapped pocket ${pocket.id}`)
})

test('the four tiers resolve from macro-sector down to operational niche', () => {
  const path = resolveSectorPath('CON-ENG-MECH-PETRO')
  assert.deepEqual(
    path.map((node) => node.id),
    ['CON', 'CON-ENG', 'CON-ENG-MECH', 'CON-ENG-MECH-PETRO'],
  )
  assert.deepEqual(
    path.map((node) => node.level),
    [1, 2, 3, 4] satisfies TaxonomyLevel[],
  )
})

test('a deep niche resolves to the statutory sector that sets its turnover ceiling', () => {
  assert.equal(resolveStatutorySector('CON-ENG-MECH-PETRO'), 'construction')
  assert.equal(resolveStatutorySector('MIN-PGM-MINE-DEEP'), 'mining-and-quarrying')
  assert.equal(resolveStatutorySector('FIN-INFORMAL-STOKVEL-ADMIN'), 'finance-and-business-services')
})

test('the named national sectors are present with level-4 niches', () => {
  const required = [
    'MIN-PGM', 'MIN-GOLD', 'MIN-COAL', 'MIN-IRON', 'MIN-DIAM', 'MIN-PGM-JR-BLACK',
    'FIN-BANK-BIG5', 'FIN-DIGIBANK-CHAL', 'FIN-PAY', 'FIN-INS-FUNERAL-PARLOUR', 'FIN-INFORMAL-STOKVEL',
    'AGR-COMM-COOP-FULL', 'AGR-SMALL-EMERG', 'AGR-HORT-CITRUS', 'AGR-VITI-WINE', 'AGR-FIELD-MAIZE',
    'MFG-AUTO-OEM', 'MFG-AUTO-CAT1-EXH', 'MFG-CHEM-CTL', 'MFG-FOOD',
    'RTL-GROC-HYPER', 'RTL-INFORMAL-SPAZA', 'WHL-FMCG-SPAZA-DEPOT', 'RTL-FRAN-RETAIL',
    'ICT-TELCO-MNO', 'ICT-SI', 'ICT-SW-AGENCY', 'ICT-BPO',
    'ENR-GEN-IPP', 'ENR-SOLAR-RES-INSTALL', 'ENR-WIND', 'ENR-HYDRO',
  ]
  for (const id of required) assert.ok(getTaxonomyNode(id), `missing node ${id}`)

  const l4 = sectorTree.filter((node) => node.level === 4)
  assert.ok(l4.length >= 90, `expected substantial level-4 coverage, found ${l4.length}`)
  assert.equal(getMacroSectors().length, 16, 'macro-sector count')
})

test('informal operators are representable rather than excluded', () => {
  const informalNodes = sectorTree.filter((node) => node.informalRelevant)
  assert.ok(informalNodes.length >= 25, `expected informal economy coverage, found ${informalNodes.length}`)
  const entityTypes = vocabularies.entityTypes.map((option) => option.id)
  for (const id of ['unregistered-informal', 'sole-proprietorship', 'cc', 'soc-ltd', 'npc', 'co-operative']) {
    assert.ok(entityTypes.includes(id), `missing entity type ${id}`)
  }
})

test('the committed Markdown outline matches the generated outline', () => {
  const committed = readFileSync(resolve(TAXONOMY_DIR, 'sector-tree-outline.md'), 'utf8')
  assert.equal(committed, renderSectorOutline(sectorTree), 'run npm run taxonomy:outline after editing the sector tree')
})

// ---------------------------------------------------------------------------
// Scale bands
// ---------------------------------------------------------------------------

test('employee bands resolve at every threshold', () => {
  const cases: [number, string][] = [
    [1, 'micro'], [10, 'micro'], [11, 'small'], [50, 'small'], [51, 'medium'],
    [250, 'medium'], [251, 'large'], [999, 'large'], [1000, 'tier-1'], [50000, 'tier-1'],
  ]
  for (const [employees, expected] of cases) {
    assert.equal(bandFor(employees, null).band, expected, `${employees} employees`)
  }
})

test('turnover bands resolve at every threshold', () => {
  const cases: [number, string][] = [
    [0, 'micro'], [10_000_000, 'micro'], [10_000_001, 'small'], [50_000_000, 'small'],
    [50_000_001, 'medium'], [250_000_000, 'medium'], [250_000_001, 'large'],
    [1_000_000_000, 'large'], [1_000_000_001, 'tier-1'],
  ]
  for (const [turnover, expected] of cases) {
    assert.equal(bandFor(null, turnover).band, expected, `R${turnover} turnover`)
  }
})

test('disagreeing proxies resolve to the higher band and stay flagged', () => {
  const labourIntensive = bandFor(300, 8_000_000)
  assert.equal(labourIntensive.bandByEmployees, 'large')
  assert.equal(labourIntensive.bandByTurnover, 'micro')
  assert.equal(labourIntensive.band, 'large')
  assert.equal(labourIntensive.bandConflict, true)

  const capitalIntensive = bandFor(12, 4_000_000_000)
  assert.equal(capitalIntensive.band, 'tier-1')
  assert.equal(capitalIntensive.bandConflict, true)
})

test('a company with no size proxy is unclassified rather than called micro', () => {
  const result = assignScaleBand({ employeesFte: null, fteReported: false, annualTurnoverZar: null }, scaleBands, 'NSEA-S1-2019', TODAY)
  assert.equal(result.band, 'unclassified')
  assert.equal(result.statutoryClass, null)
  assert.equal(result.bandConflict, false)
})

test('large and tier-1 carry no statutory SMME class', () => {
  assert.equal(bandFor(400, null).statutoryClass, null)
  assert.equal(bandFor(2000, null).statutoryClass, null)
  assert.equal(bandFor(120, null).statutoryClass, 'medium')
})

test('the superseded statutory schedule fails loudly instead of inventing numbers', () => {
  const replacement = schedules.find((schedule) => schedule.id === 'NSEA-S1-2026')
  assert.ok(replacement, 'the 2026 replacement schedule must be represented')
  assert.deepEqual(replacement.sectorClasses, [], 'an unverified schedule must carry no invented thresholds')
  assert.equal(replacement.verificationStatus, 'existence-verified-values-unverified')
})

// ---------------------------------------------------------------------------
// The generated JSON Schema
// ---------------------------------------------------------------------------

test('the committed JSON Schema stays in step with the taxonomy data', () => {
  const schema = JSON.parse(readFileSync(resolve(TAXONOMY_DIR, 'sa-company-profile.schema.json'), 'utf8')) as {
    $defs: { taxonomyNodeId: { enum: string[] }; scaleBandAssignment: { properties: { band: { enum: string[] } } } }
    allOf: unknown[]
  }

  assert.deepEqual(schema.$defs.taxonomyNodeId.enum, getTaxonomyNodeIds(), 'node id enum must match the sector tree')
  assert.deepEqual(
    schema.$defs.scaleBandAssignment.properties.band.enum,
    [...scaleBands.map((band) => band.id), 'unclassified'],
    'band enum must match the scale bands',
  )
  assert.ok(schema.allOf.length >= 10, `expected the conditional rules to be generated, found ${schema.allOf.length}`)
})

function loadExamples(): CompanyProfile[] {
  return readdirSync(EXAMPLES_DIR)
    .filter((name) => name.endsWith('.json'))
    .sort()
    .map((name) => JSON.parse(readFileSync(resolve(EXAMPLES_DIR, name), 'utf8')) as CompanyProfile)
}

test('every example profile satisfies the JSON Schema and the semantic rules', () => {
  const schema = JSON.parse(readFileSync(resolve(TAXONOMY_DIR, 'sa-company-profile.schema.json'), 'utf8'))
  const ajv = new Ajv2020({ allErrors: true, strict: false })
  addFormats(ajv)
  const validate = ajv.compile(schema)
  const examples = loadExamples()
  assert.ok(examples.length >= 2, 'expected at least two worked examples')

  for (const profile of examples) {
    const valid = validate(profile)
    assert.ok(valid, `${profile.id}: ${JSON.stringify(validate.errors)}`)
    const issues = validateCompanyProfile({ profile, today: TODAY, schedules })
    assert.deepEqual(
      issues.filter((issue) => issue.severity === 'error').map((issue) => `${issue.code}: ${issue.detail}`),
      [],
      `${profile.id} must validate`,
    )
  }
})

test('the Sasolburg example maps to the taxonomy the brief specifies', () => {
  const profile = loadExamples().find((candidate) => candidate.id === 'za-eng-0001')
  assert.ok(profile)
  assert.equal(profile.taxonomy.primaryNode, 'CON-ENG-MECH-PETRO')
  assert.equal(resolveSectorPath('CON-ENG-MECH-PETRO')[0].id, 'CON')
  assert.equal(profile.bbbee.level, '1')
  assert.equal(profile.geography.districtMunicipality, 'fezile-dabi')
  assert.equal(profile.geography.province, 'FS')
  assert.equal(profile.scaleBand.band, 'medium')
})

// ---------------------------------------------------------------------------
// The rules have to actually fire
// ---------------------------------------------------------------------------

function brokenProfile(mutate: (profile: CompanyProfile) => void): CompanyProfile {
  const base = loadExamples().find((candidate) => candidate.id === 'za-eng-0001')
  assert.ok(base)
  const clone = JSON.parse(JSON.stringify(base)) as CompanyProfile
  mutate(clone)
  return clone
}

function codesOf(profile: CompanyProfile) {
  return new Set(validateCompanyProfile({ profile, today: TODAY, schedules }).map((issue) => issue.code))
}

test('a CIPC number whose suffix contradicts the entity type is rejected', () => {
  const profile = brokenProfile((candidate) => {
    candidate.legal.cipcRegistrationNumber = '2014/128764/06'
  })
  assert.ok(codesOf(profile).has('cipc-number-mismatch'))
})

test('an entity type that never receives a CIPC number cannot carry one', () => {
  const profile = brokenProfile((candidate) => {
    candidate.legal.entityType = 'sole-proprietorship'
    candidate.legal.cipcRegistrationNumber = '2014/128764/07'
  })
  assert.ok(codesOf(profile).has('cipc-number-not-applicable'))
})

test('a hand-edited scale band is caught against the record own numbers', () => {
  const profile = brokenProfile((candidate) => {
    candidate.scaleBand.band = 'small'
    candidate.scaleBand.bandLabel = 'Small'
  })
  assert.ok(codesOf(profile).has('scale-band-stale'))
})

test('B-BBEE category must follow turnover against the applicable sector code', () => {
  const profile = brokenProfile((candidate) => {
    candidate.bbbee.category = 'eme'
  })
  assert.ok(codesOf(profile).has('bbbee-category-mismatch'))
})

test('an EME affidavit cannot support an arbitrary level', () => {
  const spaza = loadExamples().find((candidate) => candidate.id === 'za-spa-0001')
  assert.ok(spaza)
  const clone = JSON.parse(JSON.stringify(spaza)) as CompanyProfile
  clone.bbbee.level = '3'
  assert.ok(codesOf(clone).has('bbbee-level-invalid-for-evidence'))
})

test('a metro and a district municipality cannot both be populated', () => {
  const profile = brokenProfile((candidate) => {
    candidate.geography.districtMunicipality = 'fezile-dabi'
    candidate.geography.metropolitanMunicipality = 'ethekwini'
  })
  assert.ok(codesOf(profile).has('geography-inconsistent'))
})

test('a district municipality outside the stated province is rejected', () => {
  const profile = brokenProfile((candidate) => {
    candidate.geography.province = 'WC'
  })
  assert.ok(codesOf(profile).has('geography-inconsistent'))
})

test('an unknown taxonomy node is rejected', () => {
  const profile = brokenProfile((candidate) => {
    candidate.taxonomy.primaryNode = 'CON-ENG-MECH-NOT-A-REAL-NICHE'
  })
  assert.ok(codesOf(profile).has('unknown-node'))
})
