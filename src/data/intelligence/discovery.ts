// Association discovery around a focal company: multidimensional similarity,
// role-conditional assessment, industry pockets and multi-dimension filters.
// No result caps: callers paginate.

import { CONFIDENCE_RANK, parentChain, type IntelligenceGraph } from './graph'
import { assessOrganization, prepareRequirement, TIER_RANK, type Assessment, type IndustryFit, type Tier, type TierOverride } from './targeting'
import type { Confidence, SearchRequirement } from './types'

export type AssociationType =
  | 'same-industry'
  | 'same-sector'
  | 'value-chain'
  | 'shared-process'
  | 'shared-financial'
  | 'shared-technology'
  | 'corporate'
  | 'geography'
  | 'previous-recruitment'
  | 'recruiter-observation'

export const ASSOCIATION_LABELS: Record<AssociationType, string> = {
  'same-industry': 'Same industry',
  'same-sector': 'Same sector',
  'value-chain': 'Value chain',
  'shared-process': 'Shared operational process',
  'shared-financial': 'Shared financial complexity',
  'shared-technology': 'Shared technology',
  corporate: 'Corporate affiliation',
  geography: 'Shared geography',
  'previous-recruitment': 'Previous search target',
  'recruiter-observation': 'Recruiter observation',
}

export interface AssociationDimension {
  type: AssociationType
  detail: string
  /** Taxonomy ids or org ids behind the dimension. */
  items: string[]
  confidence: Confidence
  /** fact = from sourced records; suggestion = recruiter or workspace input. */
  basis: 'fact' | 'suggestion'
}

export interface CuratedAssociation {
  id: string
  fromId: string
  toId: string
  reason: string
  author: string
  createdAt: string
}

export interface DiscoveryOptions {
  focalId: string | null
  requirement: SearchRequirement
  /** associated = related to focal or role relevant (T1 to T3); all = every South African organization. */
  scope: 'associated' | 'all'
  overrides?: Map<string, TierOverride>
  curatedAssociations?: CuratedAssociation[]
  /** org id -> labels of previous searches that targeted it together with the focal company. */
  previousTargets?: Map<string, string[]>
}

export interface DiscoveryRow {
  organizationId: string
  name: string
  role: 'focal' | 'target'
  pocketId: string
  dimensions: AssociationDimension[]
  /** Weakest confidence among non-geographic fact dimensions; unknown when none. */
  associationStrength: Confidence
  assessment: Assessment
  currentPeople: number
  formerPeople: number
  provinces: string[]
}

export interface Pocket {
  id: string
  label: string
  industryId: string | null
  sectorId: string | null
  fit: IndustryFit
  organizationIds: string[]
  tierCounts: Partial<Record<Tier, number>>
  currentPeople: number
  withoutPeople: number
  unassessed: number
}

export interface DiscoveryResult {
  focalId: string | null
  rows: DiscoveryRow[]
  rowById: Map<string, DiscoveryRow>
  pockets: Pocket[]
  universeSize: number
}

const UNCLASSIFIED_POCKET = 'pocket:unclassified'

function minConfidence(a: Confidence, b: Confidence): Confidence {
  return CONFIDENCE_RANK[a] <= CONFIDENCE_RANK[b] ? a : b
}

/** Observed (probable or better) capability ids for an organization, expanded with ancestors. */
function observedCapabilitySet(graph: IntelligenceGraph, orgId: string): Map<string, Confidence> {
  const out = new Map<string, Confidence>()
  for (const row of graph.capabilitiesByOrg.get(orgId)?.values() ?? []) {
    if (row.status !== 'observed' || CONFIDENCE_RANK[row.confidence] < 2) continue
    for (const id of graph.taxonomy.capabilityLineage.get(row.capabilityId) ?? [row.capabilityId]) {
      const current = out.get(id)
      if (!current || CONFIDENCE_RANK[row.confidence] > CONFIDENCE_RANK[current]) out.set(id, row.confidence)
    }
  }
  return out
}

interface FocalProfile {
  id: string
  industries: Map<string, Confidence>
  sectors: Map<string, Confidence>
  valueChain: Map<string, Confidence>
  capabilities: Map<string, Confidence>
  provinces: Set<string>
  group: Set<string>
}

function focalProfile(graph: IntelligenceGraph, focalId: string): FocalProfile {
  const industries = new Map<string, Confidence>()
  const sectors = new Map<string, Confidence>()
  const valueChain = new Map<string, Confidence>()
  for (const row of graph.industriesByOrg.get(focalId) ?? []) {
    industries.set(row.industryId, row.confidence)
    const sector = graph.taxonomy.sectorOf.get(row.industryId)
    if (sector) sectors.set(sector, row.confidence)
    for (const other of graph.taxonomy.valueChain.get(row.industryId) ?? []) valueChain.set(other, row.confidence)
  }
  const chain = parentChain(graph, focalId)
  const group = new Set<string>([focalId, ...chain])
  return {
    id: focalId,
    industries,
    sectors,
    valueChain,
    capabilities: observedCapabilitySet(graph, focalId),
    provinces: new Set((graph.locationsByOrg.get(focalId) ?? []).map((loc) => loc.province)),
    group,
  }
}

export function associationDimensions(
  graph: IntelligenceGraph,
  focal: FocalProfile,
  orgId: string,
  curatedByOrg: Map<string, CuratedAssociation[]>,
  previousTargets: Map<string, string[]>,
): AssociationDimension[] {
  const dims: AssociationDimension[] = []
  const tax = graph.taxonomy
  const industries = graph.industriesByOrg.get(orgId) ?? []

  const sameIndustry: string[] = []
  let sameIndustryConfidence: Confidence = 'confirmed'
  const sameSector = new Set<string>()
  let sectorConfidence: Confidence = 'confirmed'
  const valueChain: string[] = []
  let valueChainConfidence: Confidence = 'confirmed'
  for (const row of industries) {
    const focalConfidence = focal.industries.get(row.industryId)
    if (focalConfidence) {
      sameIndustry.push(row.industryId)
      sameIndustryConfidence = minConfidence(sameIndustryConfidence, minConfidence(focalConfidence, row.confidence))
      continue
    }
    const vcConfidence = focal.valueChain.get(row.industryId)
    if (vcConfidence) {
      valueChain.push(row.industryId)
      valueChainConfidence = minConfidence(valueChainConfidence, minConfidence(vcConfidence, row.confidence))
    }
    const sector = tax.sectorOf.get(row.industryId)
    const sectorFocal = sector ? focal.sectors.get(sector) : undefined
    if (sector && sectorFocal) {
      sameSector.add(sector)
      sectorConfidence = minConfidence(sectorConfidence, minConfidence(sectorFocal, row.confidence))
    }
  }
  const nameOf = (id: string) => tax.industryById.get(id)?.name ?? id
  if (sameIndustry.length) dims.push({ type: 'same-industry', detail: sameIndustry.map(nameOf).join(', '), items: sameIndustry, confidence: sameIndustryConfidence, basis: 'fact' })
  else if (sameSector.size) dims.push({ type: 'same-sector', detail: [...sameSector].map(nameOf).join(', '), items: [...sameSector], confidence: sectorConfidence, basis: 'fact' })
  if (valueChain.length) dims.push({ type: 'value-chain', detail: valueChain.map(nameOf).join(', '), items: valueChain, confidence: valueChainConfidence, basis: 'fact' })

  const caps = observedCapabilitySet(graph, orgId)
  const byKind: Record<'operational' | 'financial' | 'technology', { ids: string[]; confidence: Confidence }> = {
    operational: { ids: [], confidence: 'confirmed' },
    financial: { ids: [], confidence: 'confirmed' },
    technology: { ids: [], confidence: 'confirmed' },
  }
  for (const [id, confidence] of caps) {
    const focalConfidence = focal.capabilities.get(id)
    if (!focalConfidence) continue
    const kind = tax.capabilityById.get(id)?.kind
    const bucket = kind === 'financial' ? byKind.financial : kind === 'technology' ? byKind.technology : byKind.operational
    bucket.ids.push(id)
    bucket.confidence = minConfidence(bucket.confidence, minConfidence(focalConfidence, confidence))
  }
  const capName = (id: string) => tax.capabilityById.get(id)?.name ?? id
  const kindType = { operational: 'shared-process', financial: 'shared-financial', technology: 'shared-technology' } as const
  for (const kind of ['operational', 'financial', 'technology'] as const) {
    const bucket = byKind[kind]
    if (bucket.ids.length) dims.push({ type: kindType[kind], detail: bucket.ids.map(capName).join(', '), items: bucket.ids, confidence: bucket.confidence, basis: 'fact' })
  }

  const chain = parentChain(graph, orgId)
  const sharedGroup = [orgId, ...chain].filter((id) => focal.group.has(id))
  if (sharedGroup.length) {
    const rel = (graph.relationshipsByOrg.get(orgId) ?? []).find((row) => focal.group.has(row.toId) || focal.group.has(row.fromId))
    dims.push({
      type: 'corporate',
      detail: `Same corporate group (${sharedGroup.map((id) => graph.organizationById.get(id)?.name ?? id).join(', ')})`,
      items: sharedGroup,
      confidence: rel?.confidence ?? 'probable',
      basis: 'fact',
    })
  }

  const provinces = [...new Set((graph.locationsByOrg.get(orgId) ?? []).map((loc) => loc.province))].filter((p) => focal.provinces.has(p))
  if (provinces.length) dims.push({ type: 'geography', detail: provinces.join(', '), items: provinces, confidence: 'probable', basis: 'fact' })

  const previous = previousTargets.get(orgId)
  if (previous?.length) dims.push({ type: 'previous-recruitment', detail: `Targeted alongside this company in: ${previous.join(', ')}`, items: previous, confidence: 'probable', basis: 'suggestion' })

  for (const curated of curatedByOrg.get(orgId) ?? []) {
    dims.push({ type: 'recruiter-observation', detail: curated.reason, items: [curated.id], confidence: 'probable', basis: 'suggestion' })
  }
  return dims
}

function strengthOf(dims: AssociationDimension[]): Confidence {
  const relevant = dims.filter((dim) => dim.type !== 'geography')
  if (!relevant.length) return 'unknown'
  return relevant.reduce<Confidence>((best, dim) => (CONFIDENCE_RANK[dim.confidence] > CONFIDENCE_RANK[best] ? dim.confidence : best), 'unknown')
}

const FIT_ORDER: Record<IndustryFit, number> = { preferred: 0, adjacent: 1, neutral: 2, deprioritised: 3, unclassified: 4 }

export function compareRows(a: DiscoveryRow, b: DiscoveryRow): number {
  if (a.role !== b.role) return a.role === 'focal' ? -1 : 1
  const tier = TIER_RANK[a.assessment.tier] - TIER_RANK[b.assessment.tier]
  if (tier) return tier
  const mandatoryA = a.assessment.mandatory.filter((check) => check.status === 'met').length
  const mandatoryB = b.assessment.mandatory.filter((check) => check.status === 'met').length
  if (mandatoryA !== mandatoryB) return mandatoryB - mandatoryA
  if (a.assessment.preferredMatched !== b.assessment.preferredMatched) return b.assessment.preferredMatched - a.assessment.preferredMatched
  const confidence = CONFIDENCE_RANK[b.assessment.confidence] - CONFIDENCE_RANK[a.assessment.confidence]
  if (confidence) return confidence
  const dims = b.dimensions.length - a.dimensions.length
  if (dims) return dims
  return a.name.localeCompare(b.name)
}

export function discover(graph: IntelligenceGraph, options: DiscoveryOptions): DiscoveryResult {
  const prepared = prepareRequirement(graph, options.requirement)
  const overrides = options.overrides ?? new Map<string, TierOverride>()
  const previousTargets = options.previousTargets ?? new Map<string, string[]>()
  const curatedByOrg = new Map<string, CuratedAssociation[]>()
  const focalId = options.focalId && graph.organizationById.has(options.focalId) ? options.focalId : null
  for (const curated of options.curatedAssociations ?? []) {
    if (!focalId) continue
    const other = curated.fromId === focalId ? curated.toId : curated.toId === focalId ? curated.fromId : null
    if (!other) continue
    const list = curatedByOrg.get(other) ?? []
    list.push(curated)
    curatedByOrg.set(other, list)
  }
  const focal = focalId ? focalProfile(graph, focalId) : null

  const rows: DiscoveryRow[] = []
  for (const org of graph.organizations) {
    const isFocal = org.id === focalId
    const dims = focal && !isFocal ? associationDimensions(graph, focal, org.id, curatedByOrg, previousTargets) : []
    const associated = dims.some((dim) => dim.type !== 'geography')
    // Foreign parents are kept only to anchor corporate structure.
    if (!isFocal && !org.southAfrican && !dims.some((dim) => dim.type === 'corporate')) continue
    const assessment = assessOrganization(graph, org.id, prepared, overrides.get(org.id) ?? null)
    const roleRelevant = assessment.tier === 'tier-1' || assessment.tier === 'tier-2' || assessment.tier === 'tier-3'
    // Unassessed companies stay visible (unknown is not the same as irrelevant); T4 drops out of the associated scope.
    const include =
      isFocal ||
      options.scope === 'all' ||
      associated ||
      (prepared.active && (roleRelevant || assessment.tier === 'unassessed')) ||
      (!focal && !prepared.active)
    if (!include) continue
    const employment = graph.employmentsByOrg.get(org.id) ?? []
    let currentPeople = 0
    for (const row of employment) if (row.current) currentPeople++
    const primary = (graph.industriesByOrg.get(org.id) ?? [])[0]
    rows.push({
      organizationId: org.id,
      name: org.name,
      role: isFocal ? 'focal' : 'target',
      pocketId: primary ? `pocket:${primary.industryId}` : UNCLASSIFIED_POCKET,
      dimensions: dims,
      associationStrength: strengthOf(dims),
      assessment,
      currentPeople,
      formerPeople: employment.length - currentPeople,
      provinces: [...new Set((graph.locationsByOrg.get(org.id) ?? []).map((loc) => loc.province))].sort(),
    })
  }
  rows.sort(compareRows)
  return { focalId, rows, rowById: new Map(rows.map((row) => [row.organizationId, row])), pockets: buildPockets(graph, rows, prepared.active ? prepared : null), universeSize: rows.length }
}

export function buildPockets(graph: IntelligenceGraph, rows: DiscoveryRow[], prepared: { preferred: Set<string>; adjacent: Set<string>; deprioritised: Set<string> } | null): Pocket[] {
  const pockets = new Map<string, Pocket>()
  for (const row of rows) {
    if (row.role === 'focal') continue
    let pocket = pockets.get(row.pocketId)
    if (!pocket) {
      const industryId = row.pocketId === UNCLASSIFIED_POCKET ? null : row.pocketId.slice('pocket:'.length)
      let fit: IndustryFit = industryId ? 'neutral' : 'unclassified'
      if (industryId && prepared) {
        if (prepared.preferred.has(industryId)) fit = 'preferred'
        else if (prepared.adjacent.has(industryId)) fit = 'adjacent'
        else if (prepared.deprioritised.has(industryId)) fit = 'deprioritised'
      }
      pocket = {
        id: row.pocketId,
        label: industryId ? graph.taxonomy.industryById.get(industryId)?.name ?? industryId : 'Unclassified (industry not recorded)',
        industryId,
        sectorId: industryId ? graph.taxonomy.sectorOf.get(industryId) ?? null : null,
        fit,
        organizationIds: [],
        tierCounts: {},
        currentPeople: 0,
        withoutPeople: 0,
        unassessed: 0,
      }
      pockets.set(row.pocketId, pocket)
    }
    pocket.organizationIds.push(row.organizationId)
    pocket.tierCounts[row.assessment.tier] = (pocket.tierCounts[row.assessment.tier] ?? 0) + 1
    pocket.currentPeople += row.currentPeople
    if (row.currentPeople === 0) pocket.withoutPeople++
    if (row.assessment.tier === 'unassessed') pocket.unassessed++
  }
  const bestTier = (pocket: Pocket) => Math.min(...Object.keys(pocket.tierCounts).map((tier) => TIER_RANK[tier as Tier]))
  return [...pockets.values()].sort(
    (a, b) => FIT_ORDER[a.fit] - FIT_ORDER[b.fit] || bestTier(a) - bestTier(b) || b.organizationIds.length - a.organizationIds.length || a.label.localeCompare(b.label),
  )
}

// ---------------------------------------------------------------------------
// Filters: AND across dimensions, OR within a dimension.
// ---------------------------------------------------------------------------

export interface ExplorerFilters {
  industries: string[]
  capabilities: string[]
  tiers: Tier[]
  associations: AssociationType[]
  confidence: Confidence[]
  provinces: string[]
  people: ('with-people' | 'without-people')[]
  evidence: ('stale' | 'unverified-identity' | 'open-questions' | 'private-facts')[]
  coverage: ('researched-with-people' | 'researched-zero-results' | 'needs-research' | 'no-coverage-record')[]
  q: string
}

export const EMPTY_FILTERS: ExplorerFilters = {
  industries: [],
  capabilities: [],
  tiers: [],
  associations: [],
  confidence: [],
  provinces: [],
  people: [],
  evidence: [],
  coverage: [],
  q: '',
}

export function activeFilterCount(filters: ExplorerFilters): number {
  return (
    filters.industries.length +
    filters.capabilities.length +
    filters.tiers.length +
    filters.associations.length +
    filters.confidence.length +
    filters.provinces.length +
    filters.people.length +
    filters.evidence.length +
    filters.coverage.length +
    (filters.q.trim() ? 1 : 0)
  )
}

export function applyFilters(graph: IntelligenceGraph, rows: DiscoveryRow[], filters: ExplorerFilters): DiscoveryRow[] {
  const industrySet = new Set<string>()
  for (const id of filters.industries) {
    const stack = [id]
    while (stack.length) {
      const next = stack.pop() as string
      if (industrySet.has(next)) continue
      industrySet.add(next)
      for (const child of graph.taxonomy.industryChildren.get(next) ?? []) stack.push(child)
    }
  }
  const tiers = new Set(filters.tiers)
  const associations = new Set(filters.associations)
  const confidence = new Set(filters.confidence)
  const provinces = new Set(filters.provinces)
  const needle = filters.q.trim().toLowerCase()

  return rows.filter((row) => {
    if (row.role === 'focal') return true
    const org = graph.organizationById.get(row.organizationId)
    if (!org) return false
    if (needle && ![org.name, ...org.aliases].some((name) => name.toLowerCase().includes(needle))) return false
    if (industrySet.size && !(graph.industriesByOrg.get(row.organizationId) ?? []).some((ind) => industrySet.has(ind.industryId))) return false
    if (filters.capabilities.length) {
      const caps = graph.capabilitiesByOrg.get(row.organizationId)
      const hit = filters.capabilities.some((capId) => {
        for (const id of graph.taxonomy.capabilityDescendants.get(capId) ?? [capId]) {
          const state = caps?.get(id)
          if (state && state.status === 'observed' && CONFIDENCE_RANK[state.confidence] >= 2) return true
        }
        return false
      })
      if (!hit) return false
    }
    if (tiers.size && !tiers.has(row.assessment.tier)) return false
    if (associations.size && !row.dimensions.some((dim) => associations.has(dim.type))) return false
    if (confidence.size && !confidence.has(row.assessment.confidence)) return false
    if (provinces.size && !row.provinces.some((p) => provinces.has(p))) return false
    if (filters.people.length) {
      const ok = filters.people.some((value) => (value === 'with-people' ? row.currentPeople > 0 : row.currentPeople === 0))
      if (!ok) return false
    }
    if (filters.evidence.length) {
      const ok = filters.evidence.some((value) => {
        if (value === 'stale') return row.assessment.evidenceQuality.stale > 0
        if (value === 'unverified-identity') return org.identityStatus !== 'verified'
        if (value === 'open-questions') return (graph.questionsByOrg.get(row.organizationId) ?? []).length > 0
        return graph.privateFactOrgs.has(row.organizationId)
      })
      if (!ok) return false
    }
    if (filters.coverage.length) {
      const records = graph.coverageByOrg.get(row.organizationId) ?? []
      const ok = filters.coverage.some((value) => (value === 'no-coverage-record' ? records.length === 0 : records.some((rec) => rec.status === value)))
      if (!ok) return false
    }
    return true
  })
}
