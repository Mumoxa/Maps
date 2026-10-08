// Association discovery: the explainable, rule-based targeting engine.
//
// Design decisions that matter for recruitment credibility:
//
// 1. Tiers are rule-based and every tier cites the rules that produced it. There
//    is no invented percentage score, because nothing in this repository has
//    been empirically validated against placement outcomes.
// 2. A company fact (capability observed) never becomes a person fact. Matches
//    describe employer environments; candidate suitability is a separate
//    question answered in the candidate records.
// 3. Unknown is not absence. A capability with status `unknown` is reported as
//    missing evidence, while `not-observed` is reported as a checked absence.
// 4. Discovery returns the whole universe. Pagination and shortlisting happen in
//    the presentation layer, never here.

import type { OrganizationIndex } from './load'
import { datasetOrganization } from './load'
import { organizationTaxonomy, sharedTaxonomyBranch } from './taxonomyPlacement'
import type {
  AssociationDiscovery,
  AssociationFilters,
  AssociationGap,
  AssociationMatch,
  AssociationPocket,
  AssociationRuleHit,
  AssociationTier,
  Capability,
  Confidence,
  Organization,
  RoleContext,
  SourcingRelationshipType,
} from './types'

export const TIER_LABELS: Record<AssociationTier, string> = {
  1: 'Primary sourcing pocket',
  2: 'Strong adjacent environment',
  3: 'Comparable operating processes',
  4: 'Contextual or partial overlap',
  5: 'Weak for this brief',
}

const CONFIDENCE_RANK: Record<Confidence, number> = {
  confirmed: 4,
  probable: 3,
  hypothesis: 2,
  unknown: 1,
}

interface CapabilityView {
  observed: Set<string>
  notObserved: Set<string>
  unknown: Set<string>
}

function capabilityView(organization: Organization): CapabilityView {
  const view: CapabilityView = { observed: new Set(), notObserved: new Set(), unknown: new Set() }
  for (const link of organization.capabilities) {
    if (link.status === 'observed') view.observed.add(link.capabilityId)
    else if (link.status === 'not-observed') view.notObserved.add(link.capabilityId)
    else view.unknown.add(link.capabilityId)
  }
  return view
}

function organizationConfidence(organization: Organization): Confidence {
  let best: Confidence = 'unknown'
  for (const link of organization.capabilities) {
    if (link.status !== 'observed') continue
    if (CONFIDENCE_RANK[link.confidence] > CONFIDENCE_RANK[best]) best = link.confidence
  }
  return best
}

function capabilityEvidence(organization: Organization, capabilityId: string): string {
  const link = organization.capabilities.find((entry) => entry.capabilityId === capabilityId)
  return link ? `${link.evidence}${link.sourceUrl ? ` (${link.sourceUrl})` : ''}` : 'No evidence recorded.'
}

interface RuleInput {
  focal: Organization
  organization: Organization
  focalCapabilities: CapabilityView
  organizationCapabilities: CapabilityView
  role: RoleContext
  index: OrganizationIndex
  mappedProfessionals: number
}

type RuleDefinition = {
  rule: string
  label: string
  relationship: SourcingRelationshipType
  test: (input: RuleInput) => AssociationRuleHit | null
}

function sharedList(left: Set<string>, right: Set<string>): string[] {
  return [...left].filter((value) => right.has(value))
}

function capabilityName(index: OrganizationIndex, id: string): string {
  return index.capabilityById.get(id)?.name ?? id
}

/**
 * The rule set. Each rule returns an explanation with the evidence line it used,
 * so the UI can show why a company appeared rather than a bare label.
 */
const RULES: RuleDefinition[] = [
  {
    rule: 'R1-same-industry',
    label: 'Same industry or subindustry',
    relationship: 'same-industry',
    test: ({ focal, organization, index }) => {
      const shared = organization.industries
        .filter((link) => focal.industries.some((focalLink) => focalLink.industryId === link.industryId))
        .map((link) => index.industryById.get(link.industryId)?.name ?? link.industryId)
      if (shared.length === 0) return null
      const evidence = organization.industries
        .find((link) => focal.industries.some((focalLink) => focalLink.industryId === link.industryId))
      return {
        rule: 'R1-same-industry',
        label: 'Same industry or subindustry',
        detail: `Both operate in ${shared.join(', ')}.`,
        evidence: evidence ? `${evidence.evidence} (${evidence.sourceUrl || 'no source recorded'})` : '',
      }
    },
  },
  {
    // Two companies in different Maps industries can still sit in the same branch
    // of the national taxonomy. R1 owns exact industry overlap; this rule covers
    // only the case R1 cannot see, so the two never report the same thing twice.
    rule: 'R16-shared-taxonomy-branch',
    label: 'Same national sub-industry branch',
    relationship: 'same-industry',
    test: ({ focal, organization }) => {
      const exactOverlap = organization.industries.some((link) =>
        focal.industries.some((focalLink) => focalLink.industryId === link.industryId))
      if (exactOverlap) return null

      const focalPlacement = organizationTaxonomy(focal)
      const organizationPlacement = organizationTaxonomy(organization)
      const shared = sharedTaxonomyBranch(focalPlacement.nodes, organizationPlacement.nodes)
      // Sharing only a macro-sector is weaker evidence than sharing a sub-industry,
      // so level 1 overlap is left to the pocket and value-chain rules.
      if (!shared || shared.level < 2) return null

      const namesUnder = (entries: { node: { id: string; name: string }; path: { id: string }[] }[]) =>
        [...new Set(
          entries
            .filter((entry) => entry.path.some((node) => node.id === shared.id))
            .map((entry) => entry.node.name),
        )]
      const focalNames = namesUnder(focalPlacement.entries)
      const organizationNames = namesUnder(organizationPlacement.entries)
      const branchPath = focalPlacement.entries
        .find((entry) => entry.path.some((node) => node.id === shared.id))?.path
        // Truncated at the shared node: the branch is what both companies share,
        // not the focal company's own deepest niche.
        .slice(0, shared.level)
        .map((node) => node.name) ?? [shared.name]
      return {
        rule: 'R16-shared-taxonomy-branch',
        label: 'Same national sub-industry branch',
        detail: `Both sit in the ${branchPath.join(' > ')} branch of the national taxonomy (level ${shared.level}), in different sub-industries: the focal company in ${focalNames.join(', ')}, this company in ${organizationNames.join(', ')}. Same branch is adjacency, not the same business.`,
        evidence: 'Placement derived from the Maps industry crosswalk into markets/organizations/taxonomy/sector-tree.json; no company-level capability is implied.',
      }
    },
  },
  {
    rule: 'R2-mandatory-capability',
    label: 'Mandatory operational exposure evidenced',
    relationship: 'shared-operating-process',
    test: ({ organization, organizationCapabilities, role, index }) => {
      if (role.mandatoryCapabilities.length === 0) return null
      const satisfied = role.mandatoryCapabilities.filter((id) => organizationCapabilities.observed.has(id))
      if (satisfied.length < role.mandatoryCapabilities.length) return null
      return {
        rule: 'R2-mandatory-capability',
        label: 'Mandatory operational exposure evidenced',
        detail: `All mandatory requirements are evidenced: ${satisfied.map((id) => capabilityName(index, id)).join(', ')}.`,
        evidence: capabilityEvidence(organization, satisfied[0]),
      }
    },
  },
  {
    rule: 'R3-same-pocket',
    label: 'Same sourcing pocket',
    relationship: 'same-industry',
    test: ({ focal, organization, index }) => {
      const focalPockets = new Set(focal.industries.map((link) => index.industryById.get(link.industryId)?.pocket))
      const shared = organization.industries
        .map((link) => index.industryById.get(link.industryId)?.pocket)
        .filter((pocket): pocket is string => Boolean(pocket) && focalPockets.has(pocket as string))
      if (shared.length === 0) return null
      const pocket = index.pocketById.get(shared[0])
      return {
        rule: 'R3-same-pocket',
        label: 'Same sourcing pocket',
        detail: `Both sit in the ${pocket?.name ?? shared[0]} sourcing pocket.`,
        evidence: pocket?.description ?? '',
      }
    },
  },
  {
    rule: 'R4-value-chain',
    label: 'Adjacent value-chain position',
    relationship: 'same-value-chain',
    test: ({ focal, organization, role, index }) => {
      const focalStages = new Set(
        focal.industries
          .map((link) => index.pocketById.get(index.industryById.get(link.industryId)?.pocket ?? '')?.valueChainStage)
          .filter(Boolean) as string[],
      )
      const adjacent = new Set([...role.adjacentValueChainStages, ...focalStages])
      const stages = organization.industries
        .map((link) => index.pocketById.get(index.industryById.get(link.industryId)?.pocket ?? '')?.valueChainStage)
        .filter((stage): stage is string => Boolean(stage) && adjacent.has(stage as string) && !focalStages.has(stage as string))
      if (stages.length === 0) return null
      return {
        rule: 'R4-value-chain',
        label: 'Adjacent value-chain position',
        detail: `Operates at an adjacent value-chain stage (${stages.join(', ')}). Adjacency is not operational equivalence.`,
        evidence: 'Value-chain stage from the Maps industry taxonomy.',
      }
    },
  },
  {
    rule: 'R5-shared-operating-process',
    label: 'Shared operating processes',
    relationship: 'shared-operating-process',
    test: ({ focalCapabilities, organizationCapabilities, organization, index }) => {
      const shared = sharedList(organizationCapabilities.observed, focalCapabilities.observed)
        .filter((id) => (index.capabilityById.get(id)?.group ?? '') === 'operating')
      if (shared.length === 0) return null
      return {
        rule: 'R5-shared-operating-process',
        label: 'Shared operating processes',
        detail: `Shared operating processes with the focal company: ${shared.map((id) => capabilityName(index, id)).join(', ')}.`,
        evidence: capabilityEvidence(organization, shared[0]),
      }
    },
  },
  {
    rule: 'R6-shared-financial-complexity',
    label: 'Shared financial complexity',
    relationship: 'shared-financial-complexity',
    test: ({ focalCapabilities, organizationCapabilities, organization, index }) => {
      const shared = sharedList(organizationCapabilities.observed, focalCapabilities.observed)
        .filter((id) => (index.capabilityById.get(id)?.group ?? '') === 'financial')
      if (shared.length === 0) return null
      return {
        rule: 'R6-shared-financial-complexity',
        label: 'Shared financial complexity',
        detail: `Shared finance complexity: ${shared.map((id) => capabilityName(index, id)).join(', ')}. Company-level evidence only; it does not prove any individual has performed this work.`,
        evidence: capabilityEvidence(organization, shared[0]),
      }
    },
  },
  {
    rule: 'R7-shared-technology',
    label: 'Shared technology',
    relationship: 'shared-technology',
    test: ({ focalCapabilities, organizationCapabilities, organization, index }) => {
      const shared = sharedList(organizationCapabilities.observed, focalCapabilities.observed)
        .filter((id) => (index.capabilityById.get(id)?.group ?? '') === 'technology')
      if (shared.length === 0) return null
      return {
        rule: 'R7-shared-technology',
        label: 'Shared technology',
        detail: `Shared systems: ${shared.map((id) => capabilityName(index, id)).join(', ')}.`,
        evidence: capabilityEvidence(organization, shared[0]),
      }
    },
  },
  {
    rule: 'R8-talent-transferability',
    label: 'Transferable environment (hypothesis)',
    relationship: 'talent-transferability',
    test: ({ organizationCapabilities, role, index }) => {
      const relevant = role.mandatoryCapabilities.filter((id) => organizationCapabilities.observed.has(id))
      if (relevant.length === 0) return null
      return {
        rule: 'R8-talent-transferability',
        label: 'Transferable environment (hypothesis)',
        detail: `Professionals here may reasonably hold transferable ${relevant.map((id) => capabilityName(index, id)).join(', ')} exposure. This is a sourcing hypothesis until validated against individual records.`,
        evidence: 'Employer capability is evidenced; individual experience still requires verification against candidate records.',
      }
    },
  },
  {
    rule: 'R9-geographic-proximity',
    label: 'Geographic proximity',
    relationship: 'geographic-proximity',
    test: ({ focal, organization }) => {
      const focalProvinces = new Set(focal.locations.map((location) => location.province))
      const shared = organization.locations
        .map((location) => location.province)
        .filter((province) => focalProvinces.has(province))
      if (shared.length === 0) return null
      return {
        rule: 'R9-geographic-proximity',
        label: 'Geographic proximity',
        detail: `Operates in ${[...new Set(shared)].join(', ')}, the same province as the focal company. Geography is distinct from operational similarity.`,
        evidence: 'Location recorded from a cited source.',
      }
    },
  },
  {
    rule: 'R10-corporate-affiliation',
    label: 'Documented corporate affiliation',
    relationship: 'corporate-affiliation',
    test: ({ focal, organization, index }) => {
      const relationship = index.relationshipsByOrg.get(focal.id)?.find(
        (entry) => entry.fromId === organization.id || entry.toId === organization.id,
      )
      if (!relationship) return null
      return {
        rule: 'R10-corporate-affiliation',
        label: 'Documented corporate affiliation',
        detail: `${relationship.type} relationship with the focal company.`,
        evidence: `${relationship.evidence} (${relationship.sourceUrl})`,
      }
    },
  },
  {
    rule: 'R11-previous-recruitment-intelligence',
    label: 'Recruiter sourcing intelligence',
    relationship: 'previous-recruitment-success',
    test: ({ organization, role, index }) => {
      const records = index.intelligenceByOrg.get(organization.id) ?? []
      const relevant = records.filter((record) => record.kind !== 'client-preferred'
        && (record.scope === role.id || record.scope === role.role.toLowerCase().replace(/\s+/g, '-')))
      const record = relevant[0] ?? records.find((entry) => entry.kind === 'strong-source')
      if (!record) return null
      return {
        rule: 'R11-previous-recruitment-intelligence',
        label: 'Recruiter sourcing intelligence',
        detail: `Recruiter observation (${record.kind}): ${record.observation}`,
        evidence: `${record.source}; recorded by ${record.reviewer} on ${record.recordedOn}. Recruiter judgment, not a verified company fact.`,
      }
    },
  },
  {
    rule: 'R15-reviewed-association',
    label: 'Reviewed association on record',
    relationship: 'talent-transferability',
    test: ({ focal, organization, index }) => {
      const association = index.associationsByAssociated.get(organization.id)?.find((entry) => entry.focalId === focal.id)
        ?? index.associationsByFocal.get(focal.id)?.find((entry) => entry.associatedId === organization.id)
      if (!association) return null
      return {
        rule: 'R15-reviewed-association',
        label: 'Reviewed association on record',
        detail: association.narrative,
        evidence: `${association.evidence} (${association.sourceUrl}) Status: ${association.status}, confidence ${association.confidence}.`,
      }
    },
  },
  {
    rule: 'R12-required-system',
    label: 'Required system in use',
    relationship: 'shared-technology',
    test: ({ organization, organizationCapabilities, role, index }) => {
      const satisfied = role.requiredSystems.filter((id) => organizationCapabilities.observed.has(id))
      if (satisfied.length === 0) return null
      return {
        rule: 'R12-required-system',
        label: 'Required system in use',
        detail: `Required system evidenced: ${satisfied.map((id) => capabilityName(index, id)).join(', ')}.`,
        evidence: capabilityEvidence(organization, satisfied[0]),
      }
    },
  },
]

function pocketOf(index: OrganizationIndex, organization: Organization): string {
  for (const link of organization.industries) {
    const industry = index.industryById.get(link.industryId)
    if (industry) return industry.pocket
  }
  return 'unclassified'
}

function tierFor(
  role: RoleContext,
  pocket: string,
  rules: AssociationRuleHit[],
  gaps: AssociationGap[],
  organizationCapabilities: CapabilityView,
  sharedCapabilities: string[],
): AssociationTier {
  const ruleIds = new Set(rules.map((rule) => rule.rule))
  if (ruleIds.has('R14-no-operational-signal')) return 5
  const excludedPocket = role.excludedIndustries.includes(pocket)
  const mandatoryExplicitlyAbsent = role.mandatoryCapabilities.some((id) => organizationCapabilities.notObserved.has(id))
  if (excludedPocket || mandatoryExplicitlyAbsent) return 5
  if (ruleIds.has('R2-mandatory-capability')) return 1
  if ((ruleIds.has('R1-same-industry') || ruleIds.has('R3-same-pocket')) && ruleIds.has('R5-shared-operating-process')) return 1
  if (role.preferredIndustries.includes(pocket) && sharedCapabilities.length > 0) return 2
  if (ruleIds.has('R15-reviewed-association')) return 2
  if (ruleIds.has('R10-corporate-affiliation')) return 2
  if (ruleIds.has('R11-previous-recruitment-intelligence') && sharedCapabilities.length > 0) return 2
  if (role.acceptableIndustries.includes(pocket) && (ruleIds.has('R5-shared-operating-process') || ruleIds.has('R6-shared-financial-complexity'))) return 2
  if (sharedCapabilities.length >= 2) return 2
  if (ruleIds.has('R5-shared-operating-process') || ruleIds.has('R6-shared-financial-complexity')) return 3
  if (role.acceptableIndustries.includes(pocket)) return 3
  if (gaps.length > 0 && rules.length === 0) return 5
  return 4
}

export interface DiscoverInput {
  index: OrganizationIndex
  focalId: string
  roleContext: RoleContext
  /** Extra organizations (e.g. dataset-only employers) to include in the scan. */
  extraOrganizations?: Organization[]
}

/**
 * Discover associated companies for one focal company under one role context.
 * Returns the complete universe; the caller paginates and shortlists.
 */
export function discoverAssociations({ index, focalId, roleContext, extraOrganizations = [] }: DiscoverInput): AssociationDiscovery {
  const focal = index.byId.get(focalId)
  const emptyView: CapabilityView = { observed: new Set<string>(), notObserved: new Set<string>(), unknown: new Set<string>() }
  const focalCapabilities = focal ? capabilityView(focal) : emptyView
  const focalProvinces = new Set(focal?.locations.map((location) => location.province) ?? [])

  const candidates: Organization[] = [
    ...index.organizations.filter((organization) => organization.id !== focalId),
    ...extraOrganizations,
  ]

  const matches: AssociationMatch[] = []
  const unmappedIndustries = new Set<string>()

  for (const organization of candidates) {
    const organizationCapabilities = capabilityView(organization)
    const shared = sharedList(organizationCapabilities.observed, focalCapabilities.observed)
    const missing = roleContext.mandatoryCapabilities.filter((id) => !organizationCapabilities.observed.has(id))
    const gaps: AssociationGap[] = missing.map((id) => ({
      requirement: capabilityName(index, id),
      reason: organizationCapabilities.notObserved.has(id)
        ? 'Checked and not observed in the sources read.'
        : 'No evidence recorded yet; this is missing research, not a confirmed absence.',
    }))

    const pocket = pocketOf(index, organization)
    if (pocket === 'unclassified') unmappedIndustries.add(organization.name)

    const rules: AssociationRuleHit[] = []
    for (const definition of RULES) {
      const hit = definition.test({
        focal: focal ?? organization,
        organization,
        focalCapabilities,
        organizationCapabilities,
        role: roleContext,
        index,
        mappedProfessionals: index.employersByOrg.get(organization.id)?.professionals ?? 0,
      })
      if (hit) rules.push(hit)
    }

    // Province matching against the role, when the recruiter narrowed geography.
    if (roleContext.provinces.length > 0
      && organization.locations.some((location) => roleContext.provinces.includes(location.province))) {
      rules.push({
        rule: 'R13-role-geography',
        label: 'Inside the required geography',
        detail: `Operates in ${organization.locations.map((location) => location.province).filter((province) => roleContext.provinces.includes(province)).join(', ')}, which the role requires.`,
        evidence: 'Location recorded from a cited source.',
      })
    }

    const relationshipTypes = [...new Set(
      RULES.filter((definition) => rules.some((rule) => rule.rule === definition.rule))
        .map((definition) => definition.relationship),
    )]

    // A company in the focal's own province with no other signal is still useful
    // context, but it must never outrank operational evidence.
    if (rules.length === 0 && focalProvinces.size > 0
      && organization.locations.some((location) => focalProvinces.has(location.province))) {
      rules.push({
        rule: 'R9-geographic-proximity',
        label: 'Geographic proximity',
        detail: 'Only shared signal with the focal company is province. No operational overlap is evidenced.',
        evidence: 'Location recorded from a cited source.',
      })
      relationshipTypes.push('geographic-proximity')
    }

    if (rules.length === 0) {
      // Nothing is silently dropped: a company with no operational signal is
      // still listed, in the lowest tier, with the reason stated.
      rules.push({
        rule: 'R14-no-operational-signal',
        label: 'No operational overlap evidenced',
        detail: organization.capabilities.length === 0 && organization.industries.length === 0
          ? 'Maps holds no industry or capability evidence for this company yet, so no operational similarity can be assessed.'
          : 'No evidenced process, industry, technology or geographic overlap with the focal company.',
        evidence: 'Absence of evidence, not evidence of absence.',
      })
      relationshipTypes.length = 0
    }

    const tier = tierFor(roleContext, pocket, rules, gaps, organizationCapabilities, shared)
    const confidence = organizationConfidence(organization)
    const intelligence = index.intelligenceByOrg.get(organization.id) ?? []
    const override = intelligence.find((record) => record.kind === 'client-excluded')

    matches.push({
      organizationId: organization.id,
      focalId,
      roleContextId: roleContext.id,
      tier: override ? 5 : tier,
      tierLabel: override ? `${TIER_LABELS[5]} (recruiter override)` : TIER_LABELS[tier],
      pocketId: pocket,
      rules,
      gaps,
      sharedCapabilities: shared,
      missingCapabilities: missing,
      relationshipTypes: [...new Set(relationshipTypes)],
      confidence: override ? 'confirmed' : confidence,
      override: override
        ? { tier: 5, reason: override.observation, reviewer: override.reviewer }
        : null,
      mappedProfessionals: index.employersByOrg.get(organization.id)?.professionals ?? 0,
    })
  }

  matches.sort((left, right) => (
    left.tier - right.tier
    || right.rules.length - left.rules.length
    || right.sharedCapabilities.length - left.sharedCapabilities.length
    || left.organizationId.localeCompare(right.organizationId)
  ))

  const pocketGroups = new Map<string, AssociationMatch[]>()
  for (const match of matches) {
    const list = pocketGroups.get(match.pocketId)
    if (list) list.push(match)
    else pocketGroups.set(match.pocketId, [match])
  }

  const pockets: AssociationPocket[] = [...pocketGroups.entries()]
    .map(([pocketId, pocketMatches]) => {
      const tiers: Record<AssociationTier, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      let mappedProfessionals = 0
      let verifiedRelationships = 0
      for (const match of pocketMatches) {
        tiers[match.tier] += 1
        mappedProfessionals += match.mappedProfessionals
        if ((index.intelligenceByOrg.get(match.organizationId) ?? []).length > 0) verifiedRelationships += 1
      }
      return {
        pocket: index.pocketById.get(pocketId) ?? {
          id: pocketId,
          name: 'Unclassified',
          valueChainStage: 'Unknown',
          description: 'Companies referenced by Maps datasets without a curated industry classification yet.',
        },
        matches: pocketMatches,
        tiers,
        mappedProfessionals,
        verifiedRelationships,
      }
    })
    .sort((left, right) => (
      left.tiers[1] === right.tiers[1]
        ? left.matches.length === right.matches.length
          ? left.pocket.name.localeCompare(right.pocket.name)
          : right.matches.length - left.matches.length
        : right.tiers[1] - left.tiers[1]
    ))

  return {
    focalId,
    roleContextId: roleContext.id,
    pockets,
    matches,
    coverage: {
      organizationsScanned: candidates.length,
      matched: matches.length,
      unmappedIndustries: [...unmappedIndustries],
    },
  }
}

// ---------------------------------------------------------------------------
// Filtering: identical results in the graph, pocket and table views
// ---------------------------------------------------------------------------

function scaleBucket(organization: Organization): string[] {
  const buckets: string[] = []
  if (organization.scale.length === 0) return ['unknown']
  for (const entry of organization.scale) {
    if (entry.metric !== 'employees') continue
    const digits = entry.value.replace(/[^0-9]/g, '')
    if (!digits) { buckets.push('unverified'); continue }
    const value = Number(digits)
    if (value < 100) buckets.push('under-100')
    else if (value < 1000) buckets.push('100-to-1000')
    else buckets.push('over-1000')
  }
  return buckets.length > 0 ? [...new Set(buckets)] : ['unverified']
}

export const SCALE_BUCKETS = ['under-100', '100-to-1000', 'over-1000', 'unverified', 'unknown'] as const

/** Look up an organization, falling back to a dataset-only stub with nothing asserted. */
export function organizationOrStub(index: OrganizationIndex, organizationId: string): Organization {
  const curated = index.byId.get(organizationId)
  if (curated) return curated
  const employer = index.employersByOrg.get(organizationId)
  if (employer) return datasetOrganization(employer)
  return datasetOrganization({
    organizationId,
    canonicalName: organizationId,
    datasets: [],
    professionals: 0,
    professionalSources: [],
    classifications: [],
  })
}

export function filterMatches(
  matches: AssociationMatch[],
  index: OrganizationIndex,
  filters: AssociationFilters,
): AssociationMatch[] {
  const query = filters.query.trim().toLowerCase()
  return matches.filter((match) => {
    const organization = organizationOrStub(index, match.organizationId)

    if (filters.pockets.length > 0 && !filters.pockets.includes(match.pocketId)) return false
    if (filters.tiers.length > 0 && !filters.tiers.includes(String(match.tier))) return false
    if (filters.confidence.length > 0 && !filters.confidence.includes(match.confidence)) return false
    if (filters.relationshipTypes.length > 0
      && !match.relationshipTypes.some((type) => filters.relationshipTypes.includes(type))) return false
    if (filters.industries.length > 0
      && !organization.industries.some((link) => filters.industries.includes(link.industryId))) return false
    if (filters.macroSectors.length > 0) {
      const placement = organizationTaxonomy(organization)
      if (!placement.macroSectorIds.some((id) => filters.macroSectors.includes(id))) return false
    }
    if (filters.capabilities.length > 0) {
      const observed = new Set(organization.capabilities.filter((link) => link.status === 'observed').map((link) => link.capabilityId))
      if (!filters.capabilities.every((id) => observed.has(id))) return false
    }
    if (filters.provinces.length > 0
      && !organization.locations.some((location) => filters.provinces.includes(location.province))) return false
    if (filters.scale.length > 0) {
      const buckets = scaleBucket(organization)
      if (!filters.scale.some((bucket) => buckets.includes(bucket))) return false
    }
    if (filters.status.length > 0 && !filters.status.includes(organization.status)) return false
    if (filters.hasMappedProfessionals === 'yes' && match.mappedProfessionals === 0) return false
    if (filters.hasMappedProfessionals === 'no' && match.mappedProfessionals > 0) return false
    if (query) {
      const haystack = [
        organization.name,
        organization.legalName,
        ...organization.aliases,
        ...organization.industries.map((link) => index.industryById.get(link.industryId)?.name ?? ''),
        ...organizationTaxonomy(organization).labels,
        ...organization.capabilities.map((link) => index.capabilityById.get(link.capabilityId)?.name ?? ''),
        ...organization.locations.map((location) => `${location.city} ${location.province}`),
        ...match.rules.map((rule) => rule.detail),
      ].join(' ').toLowerCase()
      if (!haystack.includes(query)) return false
    }
    return true
  })
}

/** Capability ids that actually appear as observed somewhere (for filter options). */
export function observedCapabilityCounts(index: OrganizationIndex): { capability: Capability; count: number }[] {
  return [...index.capabilityOrgs.entries()]
    .map(([capabilityId, orgIds]) => ({
      capability: index.capabilityById.get(capabilityId) as Capability,
      count: orgIds.length,
    }))
    .filter((entry) => Boolean(entry.capability))
    .sort((left, right) => right.count - left.count || left.capability.name.localeCompare(right.capability.name))
}
