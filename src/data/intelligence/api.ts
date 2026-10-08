// Machine-readable query and export contract (schemaVersion 1).
// Used by the UI exports, `npm run intel:query` and any future backend
// endpoint. Documented in docs/intelligence-api.md.

import { csvCell } from '../searchBank/ingest'
import { applyFilters, ASSOCIATION_LABELS, discover, EMPTY_FILTERS, type DiscoveryRow, type ExplorerFilters, type CuratedAssociation } from './discovery'
import { evidenceAge, findOrganization, parentChain, type IntelligenceGraph } from './graph'
import { coverageSummary } from './quality'
import { emptyRequirement, requirementFromTemplate, TIER_LABELS, type TierOverride } from './targeting'
import type { RoleContextTemplate, SearchRequirement } from './types'

export const MAX_PAGE_SIZE = 500

export interface DiscoverRequest {
  /** Organization id or a company name to resolve. */
  focal?: string | null
  roleContextId?: string | null
  /** Overrides applied on top of the role context template. */
  requirement?: Partial<SearchRequirement>
  filters?: Partial<ExplorerFilters>
  scope?: 'associated' | 'all'
  page?: number
  pageSize?: number
  overrides?: Map<string, TierOverride>
  curatedAssociations?: CuratedAssociation[]
  previousTargets?: Map<string, string[]>
}

export const LIMITATIONS = [
  'Coverage is not exhaustive: absence from results does not mean a company is irrelevant.',
  'Unknown capability means no evidence either way; it is never treated as zero.',
  'Industry-typical capabilities are hypotheses only and never count as observed.',
  'Company facts describe companies, not people. Employment at a company does not show what a person did there.',
]

export function resolveRequirement(roleContexts: Map<string, RoleContextTemplate>, roleContextId: string | null | undefined, patch?: Partial<SearchRequirement>): SearchRequirement {
  const template = roleContextId ? roleContexts.get(roleContextId) : undefined
  const base = template ? requirementFromTemplate(template) : emptyRequirement()
  return { ...base, ...(patch ?? {}) }
}

export function rowToResult(graph: IntelligenceGraph, row: DiscoveryRow) {
  const org = graph.organizationById.get(row.organizationId)
  const evidenceFor = (ids: string[]) =>
    ids.map((id) => {
      const evidence = graph.evidenceById.get(id)
      return evidence
        ? { id, url: evidence.url, sourceName: evidence.sourceName, sourceType: evidence.sourceType, publishedOn: evidence.publishedOn, age: evidenceAge(evidence, graph.asOf) }
        : { id, url: null, sourceName: 'missing evidence record', sourceType: null, publishedOn: null, age: 'undated' }
    })
  const capName = (id: string | null) => (id ? graph.taxonomy.capabilityById.get(id)?.name ?? id : null)
  return {
    organizationId: row.organizationId,
    name: row.name,
    role: row.role,
    website: org?.website ?? null,
    identityStatus: org?.identityStatus ?? 'unresolved',
    pocket: row.pocketId,
    industries: (graph.industriesByOrg.get(row.organizationId) ?? []).map((ind) => ({
      industryId: ind.industryId,
      name: graph.taxonomy.industryById.get(ind.industryId)?.name ?? ind.industryId,
      role: ind.role,
      confidence: ind.confidence,
      origin: ind.origin,
    })),
    tier: row.assessment.tier,
    tierLabel: TIER_LABELS[row.assessment.tier],
    computedTier: row.assessment.computedTier,
    override: row.assessment.override,
    industryFit: row.assessment.industryFit,
    knowledge: {
      facts: row.dimensions.filter((dim) => dim.basis === 'fact').map((dim) => ({ type: dim.type, label: ASSOCIATION_LABELS[dim.type], detail: dim.detail, confidence: dim.confidence })),
      inferences: row.assessment.mandatory
        .concat(row.assessment.preferred)
        .filter((check) => check.inferredFromIndustry)
        .map((check) => ({ capability: capName(check.capabilityId), basis: `industry prior: ${check.inferredFromIndustry}` })),
      suggestions: row.dimensions.filter((dim) => dim.basis === 'suggestion').map((dim) => ({ type: dim.type, label: ASSOCIATION_LABELS[dim.type], detail: dim.detail })),
    },
    associationStrength: row.associationStrength,
    mandatory: row.assessment.mandatory.map((check) => ({
      capabilityId: check.capabilityId,
      capability: capName(check.capabilityId),
      status: check.status,
      via: capName(check.via),
      confidence: check.confidence,
      evidence: evidenceFor(check.evidenceIds),
    })),
    preferredMatched: row.assessment.preferred.filter((check) => check.status === 'met').map((check) => capName(check.capabilityId)),
    reasons: row.assessment.reasons,
    gaps: row.assessment.gaps,
    missingEvidence: row.assessment.missingEvidence,
    confidence: row.assessment.confidence,
    geography: row.assessment.geography,
    provinces: row.provinces,
    people: { current: row.currentPeople, former: row.formerPeople },
  }
}

export type DiscoverResult = ReturnType<typeof rowToResult>

export function discoverTargets(graph: IntelligenceGraph, roleContexts: Map<string, RoleContextTemplate>, request: DiscoverRequest) {
  const focalId = request.focal ? (graph.organizationById.has(request.focal) ? request.focal : findOrganization(graph, request.focal)) : null
  const requirement = resolveRequirement(roleContexts, request.roleContextId, request.requirement)
  const discovery = discover(graph, {
    focalId,
    requirement,
    scope: request.scope ?? 'associated',
    overrides: request.overrides,
    curatedAssociations: request.curatedAssociations,
    previousTargets: request.previousTargets,
  })
  const filtered = applyFilters(graph, discovery.rows, { ...EMPTY_FILTERS, ...(request.filters ?? {}) })
  const pageSize = Math.min(Math.max(1, request.pageSize ?? 100), MAX_PAGE_SIZE)
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const page = Math.min(Math.max(1, request.page ?? 1), pages)
  const slice = filtered.slice((page - 1) * pageSize, page * pageSize)
  return {
    schemaVersion: 1 as const,
    asOf: graph.asOf,
    focal: focalId ? { id: focalId, name: graph.organizationById.get(focalId)?.name ?? focalId } : null,
    focalQuery: request.focal ?? null,
    focalResolved: Boolean(focalId) || !request.focal,
    requirement,
    scope: request.scope ?? 'associated',
    total: filtered.length,
    universe: discovery.universeSize,
    page,
    pageSize,
    pages,
    pockets: discovery.pockets.map((pocket) => ({
      id: pocket.id,
      label: pocket.label,
      fit: pocket.fit,
      organizations: pocket.organizationIds.length,
      tierCounts: pocket.tierCounts,
      currentPeople: pocket.currentPeople,
      withoutPeople: pocket.withoutPeople,
      unassessed: pocket.unassessed,
    })),
    results: slice.map((row) => rowToResult(graph, row)),
    coverage: coverageSummary(graph),
    limitations: LIMITATIONS,
  }
}

/** Everything known about one organization, separated by knowledge status. */
export function companyDossier(graph: IntelligenceGraph, organizationId: string) {
  const org = graph.organizationById.get(organizationId)
  if (!org) return null
  const evidence = (ids: string[]) => ids.map((id) => graph.evidenceById.get(id)).filter((row) => row !== undefined)
  const caps = [...(graph.capabilitiesByOrg.get(organizationId)?.values() ?? [])]
  const employment = graph.employmentsByOrg.get(organizationId) ?? []
  return {
    schemaVersion: 1 as const,
    organization: org,
    parents: parentChain(graph, organizationId).map((id) => ({ id, name: graph.organizationById.get(id)?.name ?? id })),
    industries: (graph.industriesByOrg.get(organizationId) ?? []).map((row) => ({ ...row, evidence: evidence(row.evidenceIds) })),
    capabilities: {
      observed: caps.filter((row) => row.status === 'observed').map((row) => ({ ...row, evidence: evidence(row.evidenceIds) })),
      notObserved: caps.filter((row) => row.status === 'not-observed').map((row) => ({ ...row, evidence: evidence(row.evidenceIds) })),
      unknownSourced: caps.filter((row) => row.status === 'unknown' && !row.inferredFromIndustry),
      industryHypotheses: caps.filter((row) => row.inferredFromIndustry),
    },
    relationships: (graph.relationshipsByOrg.get(organizationId) ?? []).map((row) => ({ ...row, evidence: evidence(row.evidenceIds) })),
    locations: graph.locationsByOrg.get(organizationId) ?? [],
    scaleMetrics: (graph.metricsByOrg.get(organizationId) ?? []).map((row) => ({ ...row, evidence: evidence(row.evidenceIds) })),
    openQuestions: graph.questionsByOrg.get(organizationId) ?? [],
    coverage: graph.coverageByOrg.get(organizationId) ?? [],
    people: {
      current: employment.filter((row) => row.current).length,
      former: employment.filter((row) => !row.current).length,
      note: 'Public professional profiles only. Employment does not imply experience of any company activity.',
    },
  }
}

export const EXPORT_COLUMNS = [
  'organization_id',
  'name',
  'tier',
  'computed_tier',
  'override_reason',
  'pocket',
  'industries',
  'industry_fit',
  'associations',
  'mandatory_status',
  'reasons',
  'gaps',
  'missing_evidence',
  'confidence',
  'provinces',
  'current_people',
  'former_people',
  'website',
  'identity_status',
] as const

export function rowsToCsv(graph: IntelligenceGraph, rows: DiscoveryRow[]): string {
  const lines = [EXPORT_COLUMNS.join(',')]
  for (const row of rows) {
    const org = graph.organizationById.get(row.organizationId)
    const industries = (graph.industriesByOrg.get(row.organizationId) ?? []).map((ind) => graph.taxonomy.industryById.get(ind.industryId)?.name ?? ind.industryId)
    const values = [
      row.organizationId,
      row.name,
      TIER_LABELS[row.assessment.tier],
      TIER_LABELS[row.assessment.computedTier],
      row.assessment.override?.reason ?? '',
      row.pocketId.replace('pocket:', ''),
      industries.join('; '),
      row.assessment.industryFit,
      row.dimensions.map((dim) => `${ASSOCIATION_LABELS[dim.type]}: ${dim.detail}`).join('; '),
      row.assessment.mandatory.map((check) => `${check.capabilityId}=${check.status}`).join('; '),
      row.assessment.reasons.join('; '),
      row.assessment.gaps.join('; '),
      row.assessment.missingEvidence.join('; '),
      row.assessment.confidence,
      row.provinces.join('; '),
      String(row.currentPeople),
      String(row.formerPeople),
      org?.website ?? '',
      org?.identityStatus ?? '',
    ]
    lines.push(values.map((value) => csvCell(value)).join(','))
  }
  return `${lines.join('\n')}\n`
}
