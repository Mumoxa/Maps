// Coverage reporting and company comparison.
//
// Coverage never claims completeness: it reports what Maps holds, what is
// verified, what is pending and what has never been researched. Comparison
// separates shared, distinct and unknown characteristics, because missing
// evidence is not evidence of absence.

import { organizations } from './load'
import type { OrganizationIndex } from './load'
import { organizationOrStub } from './discovery'
import type { CoverageReport, Organization, RoleContext } from './types'

export interface UniverseStats {
  organizations: number
  verified: number
  pendingVerification: number
  industriesClassified: number
  capabilitiesObserved: number
  provinces: number
  withMappedProfessionals: number
  mappedProfessionals: number
  withScale: number
  lastResearchDate: string
}

export function universeStats(index: OrganizationIndex): UniverseStats {
  let verified = 0
  let pending = 0
  let withScale = 0
  let lastResearchDate = ''
  const industries = new Set<string>()
  const provinces = new Set<string>()
  let capabilitiesObserved = 0

  for (const organization of organizations) {
    if (organization.status === 'verified') verified += 1
    else pending += 1
    if (organization.scale.length > 0) withScale += 1
    if (organization.lastVerified > lastResearchDate) lastResearchDate = organization.lastVerified
    for (const link of organization.industries) industries.add(link.industryId)
    for (const location of organization.locations) if (location.province) provinces.add(location.province)
    for (const link of organization.capabilities) if (link.status === 'observed') capabilitiesObserved += 1
  }

  let withMappedProfessionals = 0
  let mappedProfessionals = 0
  for (const organization of organizations) {
    const employer = index.employersByOrg.get(organization.id)
    if (employer && employer.professionals > 0) {
      withMappedProfessionals += 1
      mappedProfessionals += employer.professionals
    }
  }

  return {
    organizations: organizations.length,
    verified,
    pendingVerification: pending,
    industriesClassified: industries.size,
    capabilitiesObserved,
    provinces: provinces.size,
    withMappedProfessionals,
    mappedProfessionals,
    withScale,
    lastResearchDate,
  }
}

/** Per-industry coverage, including industries with nothing mapped yet. */
export function coverageByIndustry(index: OrganizationIndex): CoverageReport[] {
  return [...index.industryById.values()].map((industry) => {
    const orgIds = index.industryOrgs.get(industry.id) ?? []
    let verified = 0
    let pending = 0
    let withPeople = 0
    let lastResearch: string | null = null
    for (const orgId of orgIds) {
      const organization = index.byId.get(orgId)
      if (!organization) continue
      if (organization.status === 'verified') verified += 1
      else pending += 1
      if ((index.employersByOrg.get(orgId)?.professionals ?? 0) > 0) withPeople += 1
      if (organization.lastVerified && (!lastResearch || organization.lastVerified > lastResearch)) {
        lastResearch = organization.lastVerified
      }
    }
    const gaps: string[] = []
    if (orgIds.length === 0) gaps.push('No organizations mapped in this industry yet.')
    else {
      if (pending > 0) gaps.push(`${pending} organization(s) pending verification.`)
      if (withPeople === 0) gaps.push('No mapped professionals at any organization in this industry.')
      const withoutCapabilities = orgIds.filter((orgId) => {
        const organization = index.byId.get(orgId)
        return organization ? organization.capabilities.filter((link) => link.status === 'observed').length === 0 : true
      }).length
      if (withoutCapabilities > 0) gaps.push(`${withoutCapabilities} organization(s) have no evidenced operating capability.`)
    }
    return {
      industryId: industry.id,
      industryName: industry.name,
      pocket: index.pocketById.get(industry.pocket)?.name ?? industry.pocket,
      organizations: orgIds.length,
      verified,
      pendingVerification: pending,
      withMappedProfessionals: withPeople,
      requiringEmployeeMapping: Math.max(0, orgIds.length - withPeople),
      lastResearchDate: lastResearch,
      gaps,
    }
  }).sort((left, right) => right.organizations - left.organizations || left.industryName.localeCompare(right.industryName))
}

// ---------------------------------------------------------------------------
// Comparison
// ---------------------------------------------------------------------------

export interface ComparisonRow {
  dimension: string
  left: string
  right: string
  state: 'shared' | 'distinct' | 'unknown'
}

export interface CompanyComparison {
  leftId: string
  rightId: string
  shared: ComparisonRow[]
  distinct: ComparisonRow[]
  unknown: ComparisonRow[]
  implications: string[]
}

/**
 * Placeholder values that mean "no evidence either way". A comparison only calls
 * a dimension unknown when BOTH sides are one of these; one side evidenced and
 * the other not is a real difference, not an unknown. Exported so the UI and the
 * tests share one definition instead of matching on strings.
 */
export const UNEVIDENCED_VALUES = new Set([
  'Not evidenced', 'Not sourced', 'None evidenced', 'No sourced location', 'Not classified', 'Unknown',
])
const UNEVIDENCED = UNEVIDENCED_VALUES

function describeScale(organization: Organization): string {
  if (organization.scale.length === 0) return 'Not sourced'
  return organization.scale
    .map((entry) => `${entry.metric}: ${entry.value} (${entry.basis}, ${entry.asOf})`)
    .join('; ')
}

function describeLocations(organization: Organization): string {
  if (organization.locations.length === 0) return 'No sourced location'
  return [...new Set(organization.locations.map((location) => `${location.city ? `${location.city}, ` : ''}${location.province}`))].join('; ')
}

function describeGroup(index: OrganizationIndex, organization: Organization): string {
  const parent = organization.parentId ? index.byId.get(organization.parentId)?.name : null
  const children = index.childrenByParent.get(organization.id) ?? []
  const parts: string[] = []
  if (parent) parts.push(`Parent: ${parent}`)
  if (children.length > 0) {
    parts.push(`Subsidiaries: ${children.map((id) => index.byId.get(id)?.name ?? id).join(', ')}`)
  }
  return parts.length > 0 ? parts.join('; ') : 'No documented corporate structure'
}

function describeCapabilityGroup(index: OrganizationIndex, organization: Organization, group: string): string {
  const names = organization.capabilities
    .filter((link) => link.status === 'observed' && index.capabilityById.get(link.capabilityId)?.group === group)
    .map((link) => index.capabilityById.get(link.capabilityId)?.name ?? link.capabilityId)
  if (names.length > 0) return names.join(', ')
  const unknownCount = organization.capabilities.filter((link) => link.status === 'unknown').length
  return unknownCount > 0 ? 'Not evidenced' : 'None evidenced'
}

export function compareOrganizations(
  index: OrganizationIndex,
  leftId: string,
  rightId: string,
  role: RoleContext | null,
): CompanyComparison {
  const left = organizationOrStub(index, leftId)
  const right = organizationOrStub(index, rightId)

  const dimensions: { dimension: string; pick: (organization: Organization) => string; setOf: (organization: Organization) => Set<string> }[] = [
    {
      dimension: 'Industry',
      pick: (organization) => organization.industries.map((link) => index.industryById.get(link.industryId)?.name ?? link.industryId).join(', ') || 'Not classified',
      setOf: (organization) => new Set(organization.industries.map((link) => link.industryId)),
    },
    {
      dimension: 'Sourcing pocket',
      pick: (organization) => [...new Set(organization.industries.map((link) => index.pocketById.get(index.industryById.get(link.industryId)?.pocket ?? '')?.name).filter(Boolean))].join(', ') || 'Not classified',
      setOf: (organization) => new Set(organization.industries.map((link) => index.industryById.get(link.industryId)?.pocket ?? '')),
    },
    {
      dimension: 'Operating processes',
      pick: (organization) => describeCapabilityGroup(index, organization, 'operating'),
      setOf: (organization) => new Set(organization.capabilities.filter((link) => link.status === 'observed' && index.capabilityById.get(link.capabilityId)?.group === 'operating').map((link) => link.capabilityId)),
    },
    {
      dimension: 'Commercial activity',
      pick: (organization) => describeCapabilityGroup(index, organization, 'commercial'),
      setOf: (organization) => new Set(organization.capabilities.filter((link) => link.status === 'observed' && index.capabilityById.get(link.capabilityId)?.group === 'commercial').map((link) => link.capabilityId)),
    },
    {
      dimension: 'Finance complexity',
      pick: (organization) => describeCapabilityGroup(index, organization, 'financial'),
      setOf: (organization) => new Set(organization.capabilities.filter((link) => link.status === 'observed' && index.capabilityById.get(link.capabilityId)?.group === 'financial').map((link) => link.capabilityId)),
    },
    {
      dimension: 'Systems',
      pick: (organization) => describeCapabilityGroup(index, organization, 'technology'),
      setOf: (organization) => new Set(organization.capabilities.filter((link) => link.status === 'observed' && index.capabilityById.get(link.capabilityId)?.group === 'technology').map((link) => link.capabilityId)),
    },
    {
      dimension: 'Value-chain position',
      pick: (organization) => [...new Set(organization.industries.map((link) => index.pocketById.get(index.industryById.get(link.industryId)?.pocket ?? '')?.valueChainStage).filter(Boolean))].join(', ') || 'Unknown',
      setOf: (organization) => new Set(organization.industries.map((link) => index.pocketById.get(index.industryById.get(link.industryId)?.pocket ?? '')?.valueChainStage ?? '')),
    },
    {
      dimension: 'Geography',
      pick: describeLocations,
      setOf: (organization) => new Set(organization.locations.map((location) => location.province)),
    },
    {
      dimension: 'Scale',
      pick: describeScale,
      setOf: (organization) => new Set(organization.scale.map((entry) => entry.metric)),
    },
    {
      dimension: 'Corporate structure',
      pick: (organization) => describeGroup(index, organization),
      setOf: () => new Set<string>(),
    },
    {
      dimension: 'Evidence completeness',
      pick: (organization) => organization.status === 'verified'
        ? `Verified ${organization.lastVerified}; ${organization.sources.length} source(s)`
        : `Needs verification; ${organization.sources.length} source(s)`,
      setOf: () => new Set<string>(),
    },
  ]

  const shared: ComparisonRow[] = []
  const distinct: ComparisonRow[] = []
  const unknown: ComparisonRow[] = []

  for (const { dimension, pick, setOf } of dimensions) {
    const leftValue = pick(left)
    const rightValue = pick(right)
    const leftSet = setOf(left)
    const rightSet = setOf(right)
    const row: ComparisonRow = { dimension, left: leftValue, right: rightValue, state: 'distinct' }
    if (leftSet.size === 0 && rightSet.size === 0 && (leftValue.includes('Not') || rightValue.includes('Not') || leftValue === 'Unknown')) {
      unknown.push({ ...row, state: 'unknown' })
      continue
    }
    if (leftSet.size > 0 && rightSet.size > 0) {
      const overlap = [...leftSet].filter((value) => rightSet.has(value))
      if (overlap.length > 0) shared.push({ ...row, state: 'shared' })
      else distinct.push(row)
      continue
    }
    // Both sides unevidenced is genuinely unknown; one side evidenced and the
    // other not is a difference between the records, and the value says so.
    if (UNEVIDENCED.has(leftValue) && UNEVIDENCED.has(rightValue)) {
      unknown.push({ ...row, state: 'unknown' })
      continue
    }
    distinct.push(row)
  }

  const implications: string[] = []
  if (role) {
    const leftObserved = new Set(left.capabilities.filter((link) => link.status === 'observed').map((link) => link.capabilityId))
    const rightObserved = new Set(right.capabilities.filter((link) => link.status === 'observed').map((link) => link.capabilityId))
    const leftSatisfies = role.mandatoryCapabilities.every((id) => leftObserved.has(id))
    const rightSatisfies = role.mandatoryCapabilities.every((id) => rightObserved.has(id))
    const missingLeft = role.mandatoryCapabilities.filter((id) => !leftObserved.has(id))
      .map((id) => index.capabilityById.get(id)?.name ?? id)
    const missingRight = role.mandatoryCapabilities.filter((id) => !rightObserved.has(id))
      .map((id) => index.capabilityById.get(id)?.name ?? id)
    if (leftSatisfies && !rightSatisfies) {
      implications.push(`For ${role.role}: ${left.name} evidences every mandatory requirement; ${right.name} is missing ${missingRight.join(', ') || 'one or more requirements'}.`)
    } else if (rightSatisfies && !leftSatisfies) {
      implications.push(`For ${role.role}: ${right.name} evidences every mandatory requirement; ${left.name} is missing ${missingLeft.join(', ') || 'one or more requirements'}.`)
    } else if (leftSatisfies && rightSatisfies) {
      implications.push(`For ${role.role}: both companies evidence the mandatory requirements, so differentiate on the remaining role priorities.`)
    } else {
      implications.push(`For ${role.role}: neither company evidences the mandatory requirements (${role.mandatoryCapabilities.map((id) => index.capabilityById.get(id)?.name ?? id).join(', ')}). Treat both as research targets, not confirmed sources.`)
    }
    if (role.preferredIndustries.length > 0) {
      const leftPreferred = left.industries.some((link) => role.preferredIndustries.includes(index.industryById.get(link.industryId)?.pocket ?? ''))
      const rightPreferred = right.industries.some((link) => role.preferredIndustries.includes(index.industryById.get(link.industryId)?.pocket ?? ''))
      if (leftPreferred !== rightPreferred) {
        implications.push(`${leftPreferred ? left.name : right.name} sits in a preferred industry pocket for this brief; ${leftPreferred ? right.name : left.name} does not.`)
      }
    }
  } else {
    implications.push('Select a role context to see how this comparison changes sourcing priority.')
  }
  implications.push('Similarity at company level is not evidence that any individual at either company has performed this work.')

  return { leftId, rightId, shared, distinct, unknown, implications }
}
