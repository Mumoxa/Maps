// Machine-readable research contract.
//
// Everything the UI renders is produced by these functions, so a future research
// agent gets exactly the same structured answer a recruiter sees: identity,
// corporate structure, industries, capabilities, associations, evidence, talent
// coverage, recruitment history and research gaps.
//
// Discovery is paginated but never capped: ranking and shortlisting are separate
// concerns from universe discovery.

import { curatedAssociations, corporateRelationships } from './load'
import { datasetOrganization } from './load'
import type { OrganizationIndex, ResolvedEmployer } from './load'
import { discoverAssociations, filterMatches, organizationOrStub } from './discovery'
import { coverageByIndustry, universeStats } from './analysis'
import { runQualityChecks } from './quality'
import { organizations, industries, capabilities, pockets } from './load'
import { organizationTaxonomy } from './taxonomyPlacement'
import { getTaxonomyNode } from '../taxonomy/load'
import type {
  AssociationFilters,
  AssociationMatch,
  Confidence,
  Organization,
  RoleContext,
} from './types'

/** How strongly a statement about a company is supported right now. */
export type EvidenceState = 'known-verified' | 'recorded-stale' | 'inferred' | 'unknown'

export function evidenceState(organization: Organization, staleAfterDays = 180, today = new Date()): EvidenceState {
  if (!organization.lastVerified || organization.sources.length === 0) return 'unknown'
  const ageDays = Math.round((today.getTime() - new Date(organization.lastVerified).getTime()) / 86_400_000)
  if (Number.isNaN(ageDays)) return 'unknown'
  if (ageDays > staleAfterDays) return 'recorded-stale'
  if (organization.status === 'verified') return 'known-verified'
  return 'inferred'
}

export interface DossierCapability {
  id: string
  name: string
  group: string
  status: string
  confidence: Confidence
  evidence: string
  sourceUrl: string
}

export interface CompanyDossier {
  identity: {
    id: string
    name: string
    legalName: string
    aliases: string[]
    website: string
    status: string
    datasets: string[]
    evidenceState: EvidenceState
    lastVerified: string
  }
  corporateStructure: {
    parent: { id: string; name: string } | null
    subsidiaries: { id: string; name: string }[]
    relationships: { type: string; counterparty: string; evidence: string; sourceUrl: string; confidence: Confidence }[]
  }
  industries: { id: string; name: string; primary: boolean; pocket: string; evidence: string; sourceUrl: string }[]
  /** National taxonomy placement, derived through the industry crosswalk. */
  taxonomy: { industryId: string; industryName: string; macroSector: string; path: string }[]
  macroSectors: string[]
  capabilities: DossierCapability[]
  locations: { city: string; province: string; sourceUrl: string }[]
  scale: { metric: string; value: string; basis: string; asOf: string; sourceUrl: string }[]
  sources: { url: string; type: string; evidence: string; checkedOn: string }[]
  talent: {
    mappedProfessionals: number
    sources: { dataset: string; count: number }[]
    classifications: { dataset: string; value: string }[]
  }
  associations: {
    asFocal: { associatedId: string; name: string; relationshipType: string; narrative: string; confidence: Confidence }[]
    asAssociated: { focalId: string; name: string; relationshipType: string; narrative: string; confidence: Confidence }[]
  }
  recruiterIntelligence: { kind: string; scope: string; observation: string; reviewer: string; recordedOn: string }[]
  researchGaps: string[]
}

/** Full dossier for one company, ready to serialize for a research agent. */
export function companyDossier(index: OrganizationIndex, organizationId: string): CompanyDossier | null {
  const employer = index.employersByOrg.get(organizationId)
  // A company reached from the existing datasets has no curated record, but it
  // is still a company the recruiter can click. It gets a dossier built from
  // what is actually known about it, so the inspector never dead-ends — the
  // unknowns are listed as missing research instead.
  const organization = index.byId.get(organizationId) ?? (employer ? datasetOrganization(employer) : null)
  if (!organization) return null
  const parent = organization.parentId ? index.byId.get(organization.parentId) : null
  const subsidiaries = (index.childrenByParent.get(organizationId) ?? [])
    .map((id) => index.byId.get(id))
    .filter((entry): entry is Organization => Boolean(entry))

  const gaps: string[] = []
  if (organization.status !== 'verified') gaps.push('Identity pending verification.')
  if (organization.industries.length === 0) gaps.push('No industry classification recorded.')
  if (organization.capabilities.filter((link) => link.status === 'observed').length === 0) {
    gaps.push('No operating capability evidenced; associations will rest on industry only.')
  }
  for (const link of organization.capabilities) {
    if (link.status === 'unknown') {
      gaps.push(`Capability "${index.capabilityById.get(link.capabilityId)?.name ?? link.capabilityId}" has never been checked.`)
    }
  }
  if (organization.locations.length === 0) gaps.push('No sourced South African location.')
  if (organization.scale.length === 0) gaps.push('No sourced scale measure (headcount, revenue, sites).')
  if (!employer || employer.professionals === 0) gaps.push('No professionals mapped at this company yet.')
  if (organization.website === '') gaps.push('Website not established from the sources read.')

  return {
    identity: {
      id: organization.id,
      name: organization.name,
      legalName: organization.legalName,
      aliases: organization.aliases,
      website: organization.website,
      status: organization.status,
      datasets: organization.datasets,
      evidenceState: evidenceState(organization),
      lastVerified: organization.lastVerified,
    },
    corporateStructure: {
      parent: parent ? { id: parent.id, name: parent.name } : null,
      subsidiaries: subsidiaries.map((entry) => ({ id: entry.id, name: entry.name })),
      relationships: (index.relationshipsByOrg.get(organizationId) ?? []).map((relationship) => {
        const counterpartyId = relationship.fromId === organizationId ? relationship.toId : relationship.fromId
        return {
          type: relationship.type,
          counterparty: index.byId.get(counterpartyId)?.name ?? counterpartyId,
          evidence: relationship.evidence,
          sourceUrl: relationship.sourceUrl,
          confidence: relationship.confidence,
        }
      }),
    },
    industries: organization.industries.map((link) => ({
      id: link.industryId,
      name: index.industryById.get(link.industryId)?.name ?? link.industryId,
      primary: link.primary,
      pocket: index.pocketById.get(index.industryById.get(link.industryId)?.pocket ?? '')?.name ?? '',
      evidence: link.evidence,
      sourceUrl: link.sourceUrl,
    })),
    taxonomy: organizationTaxonomy(organization).entries.map((entry) => ({
      industryId: entry.industryId,
      industryName: index.industryById.get(entry.industryId)?.name ?? entry.industryId,
      macroSector: entry.path[0]?.name ?? '',
      path: entry.path.map((node) => node.name).join(' > '),
    })),
    macroSectors: organizationTaxonomy(organization).macroSectorIds
      .map((id) => getTaxonomyNode(id)?.name ?? id),
    capabilities: organization.capabilities.map((link) => ({
      id: link.capabilityId,
      name: index.capabilityById.get(link.capabilityId)?.name ?? link.capabilityId,
      group: index.capabilityById.get(link.capabilityId)?.group ?? 'operating',
      status: link.status,
      confidence: link.confidence,
      evidence: link.evidence,
      sourceUrl: link.sourceUrl,
    })),
    locations: organization.locations.map((location) => ({
      city: location.city,
      province: location.province,
      sourceUrl: location.sourceUrl,
    })),
    scale: organization.scale.map((entry) => ({
      metric: entry.metric,
      value: entry.value,
      basis: entry.basis,
      asOf: entry.asOf,
      sourceUrl: entry.sourceUrl,
    })),
    sources: organization.sources.map((source) => ({
      url: source.url,
      type: source.type,
      evidence: source.evidence,
      checkedOn: source.checkedOn,
    })),
    talent: {
      mappedProfessionals: employer?.professionals ?? 0,
      sources: employer?.professionalSources ?? [],
      classifications: employer?.classifications ?? [],
    },
    associations: {
      asFocal: (index.associationsByFocal.get(organizationId) ?? []).map((association) => ({
        associatedId: association.associatedId,
        name: index.byId.get(association.associatedId)?.name ?? association.associatedId,
        relationshipType: association.relationshipType,
        narrative: association.narrative,
        confidence: association.confidence,
      })),
      asAssociated: (index.associationsByAssociated.get(organizationId) ?? []).map((association) => ({
        focalId: association.focalId,
        name: index.byId.get(association.focalId)?.name ?? association.focalId,
        relationshipType: association.relationshipType,
        narrative: association.narrative,
        confidence: association.confidence,
      })),
    },
    recruiterIntelligence: (index.intelligenceByOrg.get(organizationId) ?? []).map((record) => ({
      kind: record.kind,
      scope: record.scope,
      observation: record.observation,
      reviewer: record.reviewer,
      recordedOn: record.recordedOn,
    })),
    researchGaps: gaps,
  }
}

export interface TargetCompanyPayload {
  organizationId: string
  name: string
  legalName: string
  tier: number
  tierLabel: string
  pocket: string
  industries: string[]
  /** National macro-sector names, derived through the industry crosswalk. */
  macroSectors: string[]
  matchedRequirements: string[]
  missingEvidence: string[]
  relationshipTypes: string[]
  confidence: Confidence
  evidenceState: EvidenceState
  mappedProfessionals: number
  province: string
  reasons: string[]
  sources: string[]
}

export interface TargetDiscoveryPayload {
  schemaVersion: 1
  generatedOn: string
  search: {
    id: string
    client: string
    role: string
    mandatoryCapabilities: string[]
    preferredIndustries: string[]
    acceptableIndustries: string[]
    provinces: string[]
    priorities: string[]
    brief: string
  }
  focal: { id: string; name: string } | null
  page: { page: number; pageSize: number; totalMatches: number; totalPages: number }
  targetCompanies: TargetCompanyPayload[]
  coverage: {
    organizationsScanned: number
    matched: number
    mappedProfessionals: number
    companiesWithoutMappedProfessionals: number
    gaps: string[]
  }
  disclaimers: string[]
}

export interface DiscoverTargetsInput {
  index: OrganizationIndex
  focalId: string
  roleContext: RoleContext
  filters?: AssociationFilters
  page?: number
  pageSize?: number
  extraOrganizations?: Organization[]
}

/**
 * Role-specific target discovery as structured data. Ranking (tiers) is returned
 * alongside the universe, but the universe itself is never truncated to a
 * shortlist: the caller pages through everything that matched.
 */
export function discoverTargets(input: DiscoverTargetsInput): TargetDiscoveryPayload {
  const { index, focalId, roleContext } = input
  const filters = input.filters ?? emptyFilters()
  const page = Math.max(1, input.page ?? 1)
  const pageSize = Math.max(1, input.pageSize ?? 50)

  const discovery = discoverAssociations({
    index,
    focalId,
    roleContext,
    extraOrganizations: input.extraOrganizations ?? [],
  })
  const filtered = filterMatches(discovery.matches, index, filters)
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageMatches = filtered.slice((page - 1) * pageSize, page * pageSize)

  const targetCompanies = pageMatches.map((match) => toTargetPayload(index, match))
  const mappedProfessionals = filtered.reduce((total, match) => total + match.mappedProfessionals, 0)

  const gaps: string[] = []
  const tierOne = filtered.filter((match) => match.tier === 1).length
  if (tierOne === 0) gaps.push('No company currently evidences every mandatory requirement; the pocket list is built on partial overlap.')
  const withoutEvidence = filtered.filter((match) => match.gaps.length > 0).length
  if (withoutEvidence > 0) gaps.push(`${withoutEvidence} matched company(ies) carry missing-evidence gaps that must be researched before use.`)
  if (discovery.coverage.unmappedIndustries.length > 0) {
    gaps.push(`${discovery.coverage.unmappedIndustries.length} company(ies) have no industry classification yet.`)
  }
  if (mappedProfessionals === 0) gaps.push('No professionals are mapped at any matched company; candidate research is required.')

  return {
    schemaVersion: 1,
    generatedOn: new Date().toISOString().slice(0, 10),
    search: {
      id: roleContext.id,
      client: roleContext.clientName,
      role: roleContext.role,
      mandatoryCapabilities: roleContext.mandatoryCapabilities,
      preferredIndustries: roleContext.preferredIndustries,
      acceptableIndustries: roleContext.acceptableIndustries,
      provinces: roleContext.provinces,
      priorities: roleContext.priorities,
      brief: roleContext.brief,
    },
    focal: index.byId.get(focalId) ? { id: focalId, name: index.byId.get(focalId)?.name ?? focalId } : null,
    page: { page, pageSize, totalMatches: filtered.length, totalPages },
    targetCompanies,
    coverage: {
      organizationsScanned: discovery.coverage.organizationsScanned,
      matched: filtered.length,
      mappedProfessionals,
      companiesWithoutMappedProfessionals: filtered.filter((match) => match.mappedProfessionals === 0).length,
      gaps,
    },
    disclaimers: [
      'Company-level similarity is not evidence that any individual has the required experience.',
      'Capabilities marked unknown have never been checked; they are not confirmed absences.',
      'Tiers are transparent rule-based groupings, not validated predictive scores.',
    ],
  }
}

function toTargetPayload(index: OrganizationIndex, match: AssociationMatch): TargetCompanyPayload {
  const organization = organizationOrStub(index, match.organizationId)
  const employer = index.employersByOrg.get(match.organizationId)
  return {
    organizationId: organization.id,
    name: organization.name,
    legalName: organization.legalName,
    tier: match.tier,
    tierLabel: match.tierLabel,
    pocket: index.pocketById.get(match.pocketId)?.name ?? match.pocketId,
    industries: organization.industries.map((link) => index.industryById.get(link.industryId)?.name ?? link.industryId),
    macroSectors: organizationTaxonomy(organization).macroSectorIds
      .map((id) => getTaxonomyNode(id)?.name ?? id),
    matchedRequirements: match.rules.map((rule) => rule.label),
    missingEvidence: match.gaps.map((gap) => `${gap.requirement}: ${gap.reason}`),
    relationshipTypes: match.relationshipTypes,
    confidence: match.confidence,
    evidenceState: index.byId.has(organization.id) ? evidenceState(organization) : 'unknown',
    mappedProfessionals: employer?.professionals ?? 0,
    province: organization.locations.map((location) => location.province).filter(Boolean)[0] ?? '',
    reasons: match.rules.map((rule) => `${rule.label}: ${rule.detail}`),
    sources: organization.sources.map((source) => source.url),
  }
}

/**
 * How much of the company universe the national taxonomy actually covers, so a
 * gap in the crosswalk is visible instead of silently dropping companies out of
 * the macro-sector view.
 */
export function nationalTaxonomySummary(index: OrganizationIndex) {
  const macroCounts = new Map<string, number>()
  const unplaced: string[] = []
  const unplacedIndustries = new Set<string>()

  for (const organization of index.organizations) {
    const placement = organizationTaxonomy(organization)
    if (placement.macroSectorIds.length === 0) {
      unplaced.push(organization.name)
      for (const link of organization.industries) unplacedIndustries.add(link.industryId)
      continue
    }
    for (const id of placement.macroSectorIds) {
      macroCounts.set(id, (macroCounts.get(id) ?? 0) + 1)
    }
  }

  return {
    macroSectors: [...macroCounts.entries()]
      .map(([id, count]) => ({ id, name: getTaxonomyNode(id)?.name ?? id, organizations: count }))
      .sort((left, right) => right.organizations - left.organizations || left.name.localeCompare(right.name)),
    placed: index.organizations.length - unplaced.length,
    unplaced,
    unplacedIndustries: [...unplacedIndustries],
  }
}

/** Whole-knowledge-base payload: taxonomy, universe, coverage and data quality. */
export function knowledgeBaseSummary(index: OrganizationIndex) {
  const issues = runQualityChecks({
    organizations,
    industries,
    capabilities,
    relationships: corporateRelationships,
    associations: curatedAssociations,
    intelligence: [...index.intelligenceByOrg.values()].flat(),
  })
  return {
    schemaVersion: 1,
    generatedOn: new Date().toISOString().slice(0, 10),
    universe: universeStats(index),
    pockets: pockets.map((pocket) => ({
      id: pocket.id,
      name: pocket.name,
      valueChainStage: pocket.valueChainStage,
      organizations: (index.orgsByPocket.get(pocket.id) ?? []).length,
    })),
    coverage: coverageByIndustry(index),
    nationalTaxonomy: nationalTaxonomySummary(index),
    dataQuality: {
      errors: issues.filter((issue) => issue.severity === 'error').length,
      warnings: issues.filter((issue) => issue.severity === 'warning').length,
      issues,
    },
  }
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

const CSV_ESCAPES = /["\n,]/

function csvCell(value: string): string {
  if (!CSV_ESCAPES.test(value)) return value
  return `"${value.replace(/"/g, '""')}"`
}

/** CSV for the current filtered result set, with the reasons a recruiter needs. */
export function exportTargetsCsv(payload: TargetDiscoveryPayload): string {
  const header = [
    'Company', 'Legal name', 'Tier', 'Tier label', 'Sourcing pocket', 'Industries', 'National macro-sector',
    'Matched requirements', 'Missing evidence', 'Relationship types', 'Confidence',
    'Evidence state', 'Mapped professionals', 'Province', 'Reason', 'Sources',
  ]
  const rows = payload.targetCompanies.map((company) => [
    company.name,
    company.legalName,
    String(company.tier),
    company.tierLabel,
    company.pocket,
    company.industries.join('; '),
    company.macroSectors.join('; '),
    company.matchedRequirements.join('; '),
    company.missingEvidence.join('; '),
    company.relationshipTypes.join('; '),
    company.confidence,
    company.evidenceState,
    String(company.mappedProfessionals),
    company.province,
    company.reasons.join(' | '),
    company.sources.join(' '),
  ].map(csvCell).join(','))
  return [header.join(','), ...rows].join('\n')
}

export function emptyFilters(): AssociationFilters {
  return {
    industries: [],
    macroSectors: [],
    pockets: [],
    capabilities: [],
    provinces: [],
    scale: [],
    confidence: [],
    tiers: [],
    relationshipTypes: [],
    status: [],
    hasMappedProfessionals: 'any',
    query: '',
  }
}

export type { ResolvedEmployer }
