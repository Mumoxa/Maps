// Role-conditional company assessment. Transparent rules, no numeric score:
// every tier comes with the reasons, gaps and missing evidence that produced it.
// The same company can (and should) land in different tiers for different roles.
// Rules are documented in docs/company-association-explorer.md.

import { CONFIDENCE_RANK, capabilityState, evidenceAge, type IntelligenceGraph } from './graph'
import { expandIndustries } from './taxonomy'
import type { Confidence, RoleContextTemplate, SearchRequirement } from './types'

export type Tier = 'tier-1' | 'tier-2' | 'tier-3' | 'tier-4' | 'unassessed' | 'excluded' | 'not-applicable'

export const TIER_LABELS: Record<Tier, string> = {
  'tier-1': 'Tier 1: direct fit',
  'tier-2': 'Tier 2: strong adjacent',
  'tier-3': 'Tier 3: transferable',
  'tier-4': 'Tier 4: low relevance',
  unassessed: 'Unassessed: not enough facts',
  excluded: 'Excluded',
  'not-applicable': 'No role selected',
}

export const TIER_SHORT: Record<Tier, string> = {
  'tier-1': 'T1',
  'tier-2': 'T2',
  'tier-3': 'T3',
  'tier-4': 'T4',
  unassessed: 'Unassessed',
  excluded: 'Excluded',
  'not-applicable': 'n/a',
}

export const TIER_ORDER: Tier[] = ['tier-1', 'tier-2', 'tier-3', 'tier-4', 'unassessed', 'not-applicable', 'excluded']
export const TIER_RANK: Record<Tier, number> = Object.fromEntries(TIER_ORDER.map((tier, index) => [tier, index])) as Record<Tier, number>

export type CheckStatus = 'met' | 'hypothesis' | 'unknown' | 'gap'

export interface CapabilityCheck {
  capabilityId: string
  status: CheckStatus
  /** Capability the evidence was actually recorded against (a descendant rolls up to its ancestor). */
  via: string | null
  confidence: Confidence
  evidenceIds: string[]
  inferredFromIndustry?: string
}

export type IndustryFit = 'preferred' | 'adjacent' | 'neutral' | 'deprioritised' | 'unclassified'
export type MandatoryOutcome = 'met' | 'partial' | 'hypothesis' | 'unknown' | 'gap' | 'none'
export type GeographyMatch = 'match' | 'no-match' | 'unknown' | 'not-required'

export interface TierOverride {
  tier: Tier
  reason: string
  by: string
  at: string
}

export interface Assessment {
  organizationId: string
  tier: Tier
  computedTier: Tier
  override: TierOverride | null
  industryFit: IndustryFit
  matchedIndustries: string[]
  mandatory: CapabilityCheck[]
  mandatoryOutcome: MandatoryOutcome
  preferred: CapabilityCheck[]
  preferredMatched: number
  reasons: string[]
  gaps: string[]
  missingEvidence: string[]
  /** Weakest confidence among the facts the tier rests on. */
  confidence: Confidence
  geography: GeographyMatch
  evidenceQuality: { confirmed: number; probable: number; hypothesis: number; stale: number; undated: number }
}

export function requirementFromTemplate(template: RoleContextTemplate): SearchRequirement {
  return {
    roleContextId: template.id,
    label: template.label,
    roleFamily: template.roleFamily,
    seniority: template.seniority,
    mandatoryCapabilities: [...template.mandatoryCapabilities],
    preferredCapabilities: [...template.preferredCapabilities],
    preferredIndustries: [...template.preferredIndustries],
    adjacentIndustries: [...template.adjacentIndustries],
    deprioritisedIndustries: [...template.deprioritisedIndustries],
    qualifications: [...template.qualifications],
    geography: [...template.geography],
    excludedOrganizationIds: [],
    excludedIndustryIds: [...template.exclusions],
    notes: '',
  }
}

export function emptyRequirement(): SearchRequirement {
  return {
    roleContextId: null,
    label: 'No role selected',
    roleFamily: '',
    seniority: '',
    mandatoryCapabilities: [],
    preferredCapabilities: [],
    preferredIndustries: [],
    adjacentIndustries: [],
    deprioritisedIndustries: [],
    qualifications: [],
    geography: [],
    excludedOrganizationIds: [],
    excludedIndustryIds: [],
    notes: '',
  }
}

export function hasRoleCriteria(requirement: SearchRequirement): boolean {
  return (
    requirement.mandatoryCapabilities.length +
      requirement.preferredCapabilities.length +
      requirement.preferredIndustries.length +
      requirement.adjacentIndustries.length +
      requirement.deprioritisedIndustries.length >
    0
  )
}

/** Precomputed industry sets for one requirement so assessing many companies stays O(n). */
export interface PreparedRequirement {
  requirement: SearchRequirement
  preferred: Set<string>
  adjacent: Set<string>
  deprioritised: Set<string>
  excludedIndustries: Set<string>
  excludedOrgs: Set<string>
  geography: Set<string>
  active: boolean
}

export function prepareRequirement(graph: IntelligenceGraph, requirement: SearchRequirement): PreparedRequirement {
  return {
    requirement,
    preferred: expandIndustries(graph.taxonomy, requirement.preferredIndustries),
    adjacent: expandIndustries(graph.taxonomy, requirement.adjacentIndustries),
    deprioritised: expandIndustries(graph.taxonomy, requirement.deprioritisedIndustries),
    excludedIndustries: expandIndustries(graph.taxonomy, requirement.excludedIndustryIds),
    excludedOrgs: new Set(requirement.excludedOrganizationIds),
    geography: new Set(requirement.geography.map((province) => province.toLowerCase())),
    active: hasRoleCriteria(requirement),
  }
}

function checkCapability(graph: IntelligenceGraph, orgId: string, capabilityId: string): CapabilityCheck {
  const { row, via } = capabilityState(graph, orgId, capabilityId)
  if (!row) return { capabilityId, status: 'unknown', via: null, confidence: 'unknown', evidenceIds: [] }
  let status: CheckStatus = 'unknown'
  if (row.status === 'observed') status = CONFIDENCE_RANK[row.confidence] >= 2 ? 'met' : 'hypothesis'
  else if (row.status === 'not-observed') status = 'gap'
  else status = row.confidence === 'hypothesis' ? 'hypothesis' : 'unknown'
  return {
    capabilityId,
    status,
    via,
    confidence: row.confidence,
    evidenceIds: row.evidenceIds,
    inferredFromIndustry: row.inferredFromIndustry,
  }
}

function capabilityName(graph: IntelligenceGraph, id: string): string {
  return graph.taxonomy.capabilityById.get(id)?.name ?? id
}

function industryName(graph: IntelligenceGraph, id: string): string {
  return graph.taxonomy.industryById.get(id)?.name ?? id
}

function weakest(values: Confidence[]): Confidence {
  if (values.length === 0) return 'unknown'
  return values.reduce((low, value) => (CONFIDENCE_RANK[value] < CONFIDENCE_RANK[low] ? value : low))
}

export function assessOrganization(graph: IntelligenceGraph, orgId: string, prepared: PreparedRequirement, override: TierOverride | null = null): Assessment {
  const { requirement } = prepared
  const industries = graph.industriesByOrg.get(orgId) ?? []
  const caps = graph.capabilitiesByOrg.get(orgId)
  const sourcedCaps = caps ? [...caps.values()].filter((row) => !row.inferredFromIndustry) : []
  const reasons: string[] = []
  const gaps: string[] = []
  const missingEvidence: string[] = []

  // Industry fit
  const matchedPreferred = industries.filter((row) => prepared.preferred.has(row.industryId))
  const matchedAdjacent = industries.filter((row) => prepared.adjacent.has(row.industryId))
  const matchedDeprioritised = industries.filter((row) => prepared.deprioritised.has(row.industryId))
  let industryFit: IndustryFit = industries.length === 0 ? 'unclassified' : 'neutral'
  let matchedIndustries: string[] = []
  if (matchedPreferred.length) {
    industryFit = 'preferred'
    matchedIndustries = matchedPreferred.map((row) => row.industryId)
  } else if (matchedAdjacent.length) {
    industryFit = 'adjacent'
    matchedIndustries = matchedAdjacent.map((row) => row.industryId)
  } else if (matchedDeprioritised.length) {
    industryFit = 'deprioritised'
    matchedIndustries = matchedDeprioritised.map((row) => row.industryId)
  }
  const fitConfidences = (matchedPreferred.length ? matchedPreferred : matchedAdjacent.length ? matchedAdjacent : matchedDeprioritised).map((row) => row.confidence)

  // Capabilities
  const mandatory = requirement.mandatoryCapabilities.map((id) => checkCapability(graph, orgId, id))
  const preferred = requirement.preferredCapabilities.map((id) => checkCapability(graph, orgId, id))
  const preferredMatched = preferred.filter((check) => check.status === 'met').length

  let mandatoryOutcome: MandatoryOutcome = 'none'
  if (mandatory.length) {
    const met = mandatory.filter((check) => check.status === 'met').length
    if (mandatory.some((check) => check.status === 'gap')) mandatoryOutcome = 'gap'
    else if (met === mandatory.length) mandatoryOutcome = 'met'
    else if (met > 0) mandatoryOutcome = 'partial'
    else if (mandatory.some((check) => check.status === 'hypothesis')) mandatoryOutcome = 'hypothesis'
    else mandatoryOutcome = 'unknown'
  }

  for (const check of mandatory) {
    const name = capabilityName(graph, check.capabilityId)
    const viaText = check.via && check.via !== check.capabilityId ? ` (via ${capabilityName(graph, check.via)})` : ''
    if (check.status === 'met') reasons.push(`Mandatory ${name} observed${viaText} (${check.confidence})`)
    else if (check.status === 'gap') gaps.push(`Mandatory ${name}: sources indicate it is not carried out`)
    else if (check.status === 'hypothesis')
      missingEvidence.push(
        check.inferredFromIndustry
          ? `Mandatory ${name}: plausible for ${industryName(graph, check.inferredFromIndustry)} but not observed for this company`
          : `Mandatory ${name}: only weak evidence (${check.confidence})`,
      )
    else missingEvidence.push(`Mandatory ${name}: no evidence either way`)
  }
  for (const check of preferred) {
    if (check.status === 'met') reasons.push(`Preferred ${capabilityName(graph, check.capabilityId)} observed (${check.confidence})`)
  }
  if (industryFit === 'preferred') reasons.push(`Preferred industry: ${matchedIndustries.map((id) => industryName(graph, id)).join(', ')}`)
  if (industryFit === 'adjacent') reasons.push(`Adjacent industry: ${matchedIndustries.map((id) => industryName(graph, id)).join(', ')}`)
  if (industryFit === 'deprioritised') gaps.push(`Deprioritised industry for this role: ${matchedIndustries.map((id) => industryName(graph, id)).join(', ')}`)
  if (industryFit === 'unclassified') missingEvidence.push('No industry classification recorded')

  // Geography
  let geography: GeographyMatch = 'not-required'
  if (prepared.geography.size) {
    const locations = graph.locationsByOrg.get(orgId) ?? []
    if (!locations.length) geography = 'unknown'
    else geography = locations.some((loc) => prepared.geography.has(loc.province.toLowerCase())) ? 'match' : 'no-match'
    if (geography === 'match') reasons.push('Operates in a requested province')
    if (geography === 'no-match') gaps.push('No recorded operations in the requested provinces')
    if (geography === 'unknown') missingEvidence.push('Operating locations not recorded')
  }

  // Evidence quality over facts used
  const evidenceIds = new Set<string>()
  for (const row of industries) for (const id of row.evidenceIds) evidenceIds.add(id)
  for (const check of [...mandatory, ...preferred]) for (const id of check.evidenceIds) evidenceIds.add(id)
  const evidenceQuality = { confirmed: 0, probable: 0, hypothesis: 0, stale: 0, undated: 0 }
  for (const id of evidenceIds) {
    const evidence = graph.evidenceById.get(id)
    if (!evidence) continue
    const age = evidenceAge(evidence, graph.asOf)
    if (age === 'stale') evidenceQuality.stale++
    if (age === 'undated') evidenceQuality.undated++
  }
  for (const row of industries) evidenceQuality[row.confidence === 'unknown' ? 'hypothesis' : row.confidence]++
  for (const check of [...mandatory, ...preferred]) {
    if (check.status === 'met' || check.status === 'gap') evidenceQuality[check.confidence === 'unknown' ? 'hypothesis' : check.confidence]++
  }

  const usedConfidences = [...fitConfidences, ...mandatory.map((check) => check.confidence), ...preferred.filter((check) => check.status === 'met').map((check) => check.confidence)]
  const confidence = weakest(usedConfidences.length ? usedConfidences : industries.map((row) => row.confidence))

  // Tier rules
  let tier: Tier
  const excludedByIndustry = industries.some((row) => prepared.excludedIndustries.has(row.industryId))
  if (prepared.excludedOrgs.has(orgId) || excludedByIndustry) {
    tier = 'excluded'
    gaps.unshift(prepared.excludedOrgs.has(orgId) ? 'Excluded for this search' : 'Industry excluded for this search')
  } else if (!prepared.active) {
    tier = 'not-applicable'
  } else if (industries.length === 0 && sourcedCaps.length === 0) {
    tier = 'unassessed'
  } else if (mandatory.length) {
    if (mandatoryOutcome === 'met') tier = industryFit === 'preferred' || preferredMatched >= 2 ? 'tier-1' : 'tier-2'
    else if (mandatoryOutcome === 'partial') tier = industryFit === 'preferred' || industryFit === 'adjacent' ? 'tier-2' : 'tier-3'
    else if (mandatoryOutcome === 'gap') tier = 'tier-4'
    else tier = industryFit === 'preferred' ? 'tier-2' : industryFit === 'adjacent' ? 'tier-3' : 'tier-4'
  } else {
    if (industryFit === 'preferred' && preferredMatched >= 2) tier = 'tier-1'
    else if (industryFit === 'preferred' || preferredMatched >= 2) tier = 'tier-2'
    else if (industryFit === 'adjacent' || preferredMatched >= 1) tier = 'tier-3'
    else tier = 'tier-4'
  }
  if (industryFit === 'deprioritised' && mandatoryOutcome !== 'met' && (tier === 'tier-1' || tier === 'tier-2')) tier = 'tier-3'

  return {
    organizationId: orgId,
    tier: override ? override.tier : tier,
    computedTier: tier,
    override,
    industryFit,
    matchedIndustries,
    mandatory,
    mandatoryOutcome,
    preferred,
    preferredMatched,
    reasons,
    gaps,
    missingEvidence,
    confidence,
    geography,
    evidenceQuality,
  }
}
