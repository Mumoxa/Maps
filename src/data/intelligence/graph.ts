// Builds the in-memory company-intelligence graph from the organization
// registry, research batches and people records. All indexes are Maps so the
// UI and the query API do O(1) lookups.

import { canonicalCompanyName } from '../companyNormalization'
import { organizationKey } from './identity'
import { buildPeople, type AccountantPersonInput, type CreditRiskPersonInput } from './people'
import type { Taxonomy } from './taxonomy'
import type {
  Confidence,
  CoverageRecord,
  EmploymentRecord,
  EvidenceRecord,
  OpenQuestion,
  Organization,
  OrganizationCapability,
  OrganizationIndustry,
  OrganizationLocation,
  OrganizationRelationship,
  PersonRecord,
  ResearchBatch,
  ScaleMetric,
} from './types'

export const LEGACY_BATCH_ID = 'rb-legacy-reconciliation'
export const STALE_AFTER_DAYS = 365

export const CONFIDENCE_RANK: Record<Confidence, number> = { confirmed: 3, probable: 2, hypothesis: 1, unknown: 0 }

export interface BatchSummary {
  batchId: string
  researchedOn: string
  researcher: string
  scope: string
  private: boolean
  evidenceCount: number
  factCount: number
}

export interface IntelligenceGraph {
  asOf: string
  taxonomy: Taxonomy
  organizations: Organization[]
  organizationById: Map<string, Organization>
  evidenceById: Map<string, EvidenceRecord>
  industriesByOrg: Map<string, OrganizationIndustry[]>
  orgsByIndustry: Map<string, string[]>
  /** Resolved capability state, one row per organization + capability, including industry-prior hypotheses. */
  capabilitiesByOrg: Map<string, Map<string, OrganizationCapability>>
  /** Every raw capability statement, kept so conflicting sources stay visible. */
  capabilityStatementsByOrg: Map<string, OrganizationCapability[]>
  relationshipsByOrg: Map<string, OrganizationRelationship[]>
  locationsByOrg: Map<string, OrganizationLocation[]>
  metricsByOrg: Map<string, ScaleMetric[]>
  questionsByOrg: Map<string, OpenQuestion[]>
  coverageByOrg: Map<string, CoverageRecord[]>
  openQuestions: OpenQuestion[]
  persons: PersonRecord[]
  personById: Map<string, PersonRecord>
  employmentsByOrg: Map<string, EmploymentRecord[]>
  employmentsByPerson: Map<string, EmploymentRecord[]>
  unresolvedEmployers: Map<string, number>
  keyIndex: Map<string, string>
  batches: BatchSummary[]
  /** Organization ids that carry at least one private (workspace) fact. */
  privateFactOrgs: Set<string>
}

export interface GraphInput {
  taxonomy: Taxonomy
  organizations: Organization[]
  batches: ResearchBatch[]
  /** Batch ids that came from the private workspace (never bundled). */
  privateBatchIds?: Set<string>
  accountantPeople?: AccountantPersonInput[]
  creditRiskPeople?: CreditRiskPersonInput[]
  asOf: string
}

function push<K, V>(map: Map<K, V[]>, key: K, value: V) {
  const list = map.get(key)
  if (list) list.push(value)
  else map.set(key, [value])
}

function strongest(a: Confidence, b: Confidence): Confidence {
  return CONFIDENCE_RANK[a] >= CONFIDENCE_RANK[b] ? a : b
}

export function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(to) - Date.parse(from)) / 86_400_000)
}

export type EvidenceAge = 'current' | 'stale' | 'undated'

export function evidenceAge(evidence: EvidenceRecord, asOf: string): EvidenceAge {
  if (!evidence.publishedOn) return 'undated'
  return daysBetween(evidence.publishedOn, asOf) > STALE_AFTER_DAYS ? 'stale' : 'current'
}

/** Resolve the state of one capability from all statements about it. */
function resolveCapability(rows: OrganizationCapability[]): OrganizationCapability {
  const observedStrong = rows.filter((row) => row.status === 'observed' && CONFIDENCE_RANK[row.confidence] >= 2)
  const notObserved = rows.filter((row) => row.status === 'not-observed')
  const observedWeak = rows.filter((row) => row.status === 'observed')
  const chosen = observedStrong.length ? observedStrong : notObserved.length ? notObserved : observedWeak.length ? observedWeak : rows
  const base = chosen[0]
  let confidence: Confidence = 'unknown'
  const evidenceIds = new Set<string>()
  for (const row of chosen) {
    confidence = strongest(confidence, row.confidence)
    for (const id of row.evidenceIds) evidenceIds.add(id)
  }
  const reviewed = chosen.find((row) => row.origin === 'recruiter-reviewed')
  return {
    ...base,
    confidence,
    evidenceIds: [...evidenceIds],
    origin: reviewed ? 'recruiter-reviewed' : base.origin,
    summary: chosen.map((row) => row.summary).filter(Boolean).join(' | '),
  }
}

export function buildGraph(input: GraphInput): IntelligenceGraph {
  const { taxonomy, asOf } = input
  const privateBatchIds = input.privateBatchIds ?? new Set<string>()
  const organizations = [...input.organizations]
  const organizationById = new Map<string, Organization>()
  const keyIndex = new Map<string, string>()

  const registerKeys = (org: Organization) => {
    for (const name of [org.name, ...org.aliases, ...org.formerNames, org.legalName ?? '']) {
      const key = organizationKey(name)
      if (key && !keyIndex.has(key)) keyIndex.set(key, org.id)
    }
  }
  for (const org of organizations) {
    organizationById.set(org.id, { ...org, aliases: [...org.aliases], lineage: [...org.lineage] })
    registerKeys(org)
  }

  // Identities introduced by later batches (e.g. a private import adding a new company).
  for (const batch of input.batches) {
    for (const identity of batch.identities) {
      const existing = organizationById.get(identity.id)
      if (existing) {
        if (existing.identityStatus === 'unresolved' && identity.identityStatus !== 'unresolved') existing.identityStatus = identity.identityStatus
        continue
      }
      const org: Organization = {
        id: identity.id,
        name: identity.name,
        aliases: [...identity.aliases],
        formerNames: [...(identity.formerNames ?? [])],
        legalName: identity.legalName,
        website: identity.website,
        domain: null,
        identityStatus: identity.identityStatus,
        southAfrican: identity.southAfrican ?? true,
        lineage: identity.lineage.map((ref) => ({ ref, dataset: ref.split(':')[0], recordId: ref.split(':')[1] ?? ref, sourceName: identity.name })),
        lastVerified: batch.researchedOn,
      }
      organizationById.set(org.id, org)
      registerKeys(org)
    }
  }

  const evidenceById = new Map<string, EvidenceRecord>()
  const industryRows = new Map<string, OrganizationIndustry[]>()
  const capabilityStatementsByOrg = new Map<string, OrganizationCapability[]>()
  const relationshipsByOrg = new Map<string, OrganizationRelationship[]>()
  const locationsByOrg = new Map<string, OrganizationLocation[]>()
  const metricsByOrg = new Map<string, ScaleMetric[]>()
  const questionsByOrg = new Map<string, OpenQuestion[]>()
  const coverageByOrg = new Map<string, CoverageRecord[]>()
  const openQuestions: OpenQuestion[] = []
  const curatedIndustryOrgs = new Set<string>()
  const privateFactOrgs = new Set<string>()
  const batches: BatchSummary[] = []

  for (const batch of input.batches) {
    const isPrivate = privateBatchIds.has(batch.batchId)
    const isLegacy = batch.batchId === LEGACY_BATCH_ID
    for (const evidence of batch.evidence) {
      evidenceById.set(evidence.id, { ...evidence, observedOn: evidence.observedOn ?? batch.researchedOn, batchId: batch.batchId })
    }
    const known = (id: string | null) => Boolean(id && organizationById.has(id))
    const mark = (id: string) => {
      if (isPrivate) privateFactOrgs.add(id)
    }
    for (const row of batch.organizationIndustries) {
      if (!known(row.organizationId) || !taxonomy.industryById.has(row.industryId)) continue
      push(industryRows, row.organizationId, { ...row, batchId: batch.batchId })
      if (!isLegacy) curatedIndustryOrgs.add(row.organizationId)
      mark(row.organizationId)
    }
    for (const row of batch.organizationCapabilities) {
      if (!known(row.organizationId) || !taxonomy.capabilityById.has(row.capabilityId)) continue
      push(capabilityStatementsByOrg, row.organizationId, { ...row, batchId: batch.batchId })
      mark(row.organizationId)
    }
    for (const row of batch.organizationRelationships) {
      if (!known(row.fromId) || !known(row.toId)) continue
      const enriched = { ...row, batchId: batch.batchId }
      push(relationshipsByOrg, row.fromId, enriched)
      push(relationshipsByOrg, row.toId, enriched)
      mark(row.fromId)
    }
    for (const row of batch.locations) if (known(row.organizationId)) push(locationsByOrg, row.organizationId, row)
    for (const row of batch.scaleMetrics) if (known(row.organizationId)) push(metricsByOrg, row.organizationId, row)
    for (const row of batch.openQuestions) {
      openQuestions.push(row)
      if (row.organizationId && known(row.organizationId)) push(questionsByOrg, row.organizationId, row)
    }
    for (const row of batch.coverage ?? []) if (known(row.organizationId)) push(coverageByOrg, row.organizationId, row)
    batches.push({
      batchId: batch.batchId,
      researchedOn: batch.researchedOn,
      researcher: batch.researcher,
      scope: batch.scope,
      private: isPrivate,
      evidenceCount: batch.evidence.length,
      factCount: batch.organizationIndustries.length + batch.organizationCapabilities.length + batch.organizationRelationships.length + batch.scaleMetrics.length,
    })
    for (const identity of batch.identities) {
      const org = organizationById.get(identity.id)
      if (org && (!org.lastVerified || batch.researchedOn > org.lastVerified)) org.lastVerified = batch.researchedOn
    }
  }

  // Industries: merge duplicate statements; curated research decides the primary industry when present.
  const industriesByOrg = new Map<string, OrganizationIndustry[]>()
  const orgsByIndustry = new Map<string, string[]>()
  for (const [orgId, rows] of industryRows) {
    const merged = new Map<string, OrganizationIndustry>()
    const curated = curatedIndustryOrgs.has(orgId)
    for (const row of rows) {
      const fromLegacy = row.batchId === LEGACY_BATCH_ID
      const role = curated && fromLegacy ? 'secondary' : row.role
      const current = merged.get(row.industryId)
      if (!current) {
        merged.set(row.industryId, { ...row, role, evidenceIds: [...row.evidenceIds] })
        continue
      }
      current.confidence = strongest(current.confidence, row.confidence)
      if (role === 'primary') current.role = 'primary'
      for (const id of row.evidenceIds) if (!current.evidenceIds.includes(id)) current.evidenceIds.push(id)
      if (row.origin === 'recruiter-reviewed') current.origin = 'recruiter-reviewed'
    }
    const list = [...merged.values()].sort((a, b) => (a.role === b.role ? a.industryId.localeCompare(b.industryId) : a.role === 'primary' ? -1 : 1))
    industriesByOrg.set(orgId, list)
    for (const row of list) push(orgsByIndustry, row.industryId, orgId)
  }

  // Capabilities: resolve sourced statements, then add industry-prior hypotheses where nothing is sourced.
  const capabilitiesByOrg = new Map<string, Map<string, OrganizationCapability>>()
  for (const [orgId, rows] of capabilityStatementsByOrg) {
    const grouped = new Map<string, OrganizationCapability[]>()
    for (const row of rows) push(grouped, row.capabilityId, row)
    const resolved = new Map<string, OrganizationCapability>()
    for (const [capabilityId, group] of grouped) resolved.set(capabilityId, resolveCapability(group))
    capabilitiesByOrg.set(orgId, resolved)
  }
  for (const [orgId, rows] of industriesByOrg) {
    const resolved = capabilitiesByOrg.get(orgId) ?? new Map<string, OrganizationCapability>()
    for (const row of rows) {
      if (row.role !== 'primary') continue
      const industry = taxonomy.industryById.get(row.industryId)
      for (const capabilityId of industry?.typicalCapabilities ?? []) {
        if (resolved.has(capabilityId)) continue
        resolved.set(capabilityId, {
          organizationId: orgId,
          capabilityId,
          status: 'unknown',
          evidenceIds: [],
          confidence: 'hypothesis',
          origin: 'system-inferred',
          summary: `Typical for ${industry?.name ?? row.industryId}; not observed in any source for this company`,
          inferredFromIndustry: row.industryId,
        })
      }
    }
    if (resolved.size) capabilitiesByOrg.set(orgId, resolved)
  }

  // People and employment, resolved strictly by identity key, then via the talent-search alias table.
  const resolve = (name: string) => {
    const exact = keyIndex.get(organizationKey(name))
    if (exact) return { organizationId: exact, match: 'exact' as const }
    const canonical = keyIndex.get(organizationKey(canonicalCompanyName(name)))
    if (canonical) return { organizationId: canonical, match: 'alias-table' as const }
    return { organizationId: null, match: 'unresolved' as const }
  }
  const { persons, employments } = buildPeople(input.accountantPeople ?? [], input.creditRiskPeople ?? [], resolve)
  const personById = new Map(persons.map((person) => [person.id, person]))
  const employmentsByOrg = new Map<string, EmploymentRecord[]>()
  const employmentsByPerson = new Map<string, EmploymentRecord[]>()
  const unresolvedEmployers = new Map<string, number>()
  for (const employment of employments) {
    push(employmentsByPerson, employment.personId, employment)
    if (employment.organizationId) push(employmentsByOrg, employment.organizationId, employment)
    else if (employment.current) unresolvedEmployers.set(employment.employerName, (unresolvedEmployers.get(employment.employerName) ?? 0) + 1)
  }

  const allOrganizations = [...organizationById.values()].sort((a, b) => a.name.localeCompare(b.name))

  return {
    asOf,
    taxonomy,
    organizations: allOrganizations,
    organizationById,
    evidenceById,
    industriesByOrg,
    orgsByIndustry,
    capabilitiesByOrg,
    capabilityStatementsByOrg,
    relationshipsByOrg,
    locationsByOrg,
    metricsByOrg,
    questionsByOrg,
    coverageByOrg,
    openQuestions,
    persons,
    personById,
    employmentsByOrg,
    employmentsByPerson,
    unresolvedEmployers,
    keyIndex,
    batches,
    privateFactOrgs,
  }
}

/** Resolve a free-text company name to an organization id, or null. */
export function findOrganization(graph: IntelligenceGraph, name: string): string | null {
  return graph.keyIndex.get(organizationKey(name)) ?? graph.keyIndex.get(organizationKey(canonicalCompanyName(name))) ?? null
}

/** Capability state for an organization, rolling observed descendants up to the requested ancestor. */
export function capabilityState(graph: IntelligenceGraph, orgId: string, capabilityId: string): { row: OrganizationCapability | null; via: string | null } {
  const caps = graph.capabilitiesByOrg.get(orgId)
  if (!caps) return { row: null, via: null }
  const direct = caps.get(capabilityId)
  if (direct && direct.status === 'observed' && CONFIDENCE_RANK[direct.confidence] >= 2) return { row: direct, via: capabilityId }
  let best: OrganizationCapability | null = null
  let via: string | null = null
  for (const descendant of graph.taxonomy.capabilityDescendants.get(capabilityId) ?? []) {
    if (descendant === capabilityId) continue
    const row = caps.get(descendant)
    if (!row || row.status !== 'observed') continue
    if (!best || CONFIDENCE_RANK[row.confidence] > CONFIDENCE_RANK[best.confidence]) {
      best = row
      via = descendant
    }
  }
  if (best && CONFIDENCE_RANK[best.confidence] >= 2) return { row: best, via }
  if (direct) return { row: direct, via: capabilityId }
  return { row: best, via }
}

/** Corporate parent chain ids (subsidiary-of / division-of), nearest first, cycle-safe. */
export function parentChain(graph: IntelligenceGraph, orgId: string): string[] {
  const chain: string[] = []
  const seen = new Set<string>([orgId])
  let cursor = orgId
  for (;;) {
    const parent = (graph.relationshipsByOrg.get(cursor) ?? []).find(
      (rel) => rel.fromId === cursor && (rel.type === 'subsidiary-of' || rel.type === 'division-of'),
    )
    if (!parent || seen.has(parent.toId)) break
    chain.push(parent.toId)
    seen.add(parent.toId)
    cursor = parent.toId
  }
  return chain
}
