// QA reviewer 1: data integrity.
//
// Reads markets/organizations/*.json straight off disk. It does not import the
// app's loaders, index builder or discovery engine, so a defect in those cannot
// hide a defect in the data. Every check here is one the shipped dataset is
// claimed to satisfy.

import { readData, Reviewer } from './lib'

interface EvidenceRecord { url: string; type: string; evidence: string; checkedOn: string; confidence?: string }
interface IndustryLink { industryId: string; primary: boolean; confidence: string; evidence: string; sourceUrl: string; checkedOn: string }
interface CapabilityLink { capabilityId: string; status: string; confidence: string; evidence: string; sourceUrl: string; checkedOn: string }
interface Location { city: string; province: string; sourceUrl: string; checkedOn: string }
interface Scale { metric: string; value: string; basis: string; asOf: string; sourceUrl: string; checkedOn: string }
interface Organization {
  id: string; name: string; legalName: string; aliases: string[]; website: string; status: string
  industries: IndustryLink[]; capabilities: CapabilityLink[]; locations: Location[]; scale: Scale[]
  parentId: string | null; sources: EvidenceRecord[]; datasets: string[]; lastVerified: string; notes: string
}
interface Relationship { id: string; type: string; fromId: string; toId: string; evidence: string; sourceUrl: string; confidence: string }
interface Association { id: string; focalId: string; associatedId: string; narrative: string; evidence: string; sourceUrl: string; sharedProcesses: string[] }
interface Taxonomy { id: string; name: string }
interface Intelligence { id: string; organizationId: string; observation: string; reviewer: string; source: string }

const URL = /^https?:\/\/\S+$/

export async function review(): Promise<Reviewer> {
  const reviewer = new Reviewer('data-integrity', 'markets/organizations/*.json, read raw from disk')
  const organizations = readData<Organization[]>('organizations.json')
  const industries = readData<Taxonomy[]>('industries.json')
  const capabilities = readData<Taxonomy[]>('capabilities.json')
  const pockets = readData<Taxonomy[]>('pockets.json')
  const relationships = readData<Relationship[]>('corporate-relationships.json')
  const associations = readData<Association[]>('associations.json')
  const intelligence = readData<Intelligence[]>('recruiter-intelligence.json')

  const industryIds = new Set(industries.map((entry) => entry.id))
  const capabilityIds = new Set(capabilities.map((entry) => entry.id))
  const pocketIds = new Set(pockets.map((entry) => entry.id))
  const organizationIds = new Set(organizations.map((entry) => entry.id))

  reviewer.check('taxonomy-non-empty', industries.length > 0 && capabilities.length > 0 && pockets.length > 0,
    `industries ${industries.length}, capabilities ${capabilities.length}, pockets ${pockets.length}`)
  reviewer.note('counts', `${organizations.length} organizations, ${relationships.length} relationships, ${associations.length} curated associations, ${intelligence.length} recruiter observations`)

  // --- identity -------------------------------------------------------------
  const canonical = new Map<string, string[]>()
  for (const organization of organizations) {
    const key = organization.name.toLowerCase().replace(/[^a-z0-9]/g, '')
    canonical.set(key, [...(canonical.get(key) ?? []), organization.id])
  }
  const duplicates = [...canonical.entries()].filter(([, ids]) => ids.length > 1)
  reviewer.check('no-duplicate-company', duplicates.length === 0,
    duplicates.map(([name, ids]) => `${name}: ${ids.join(', ')}`).join('; ') || 'none')

  const aliasOwners = new Map<string, Set<string>>()
  for (const organization of organizations) {
    for (const alias of [organization.name, organization.legalName, ...organization.aliases]) {
      if (!alias) continue
      const key = alias.toLowerCase().replace(/[^a-z0-9]/g, '')
      aliasOwners.set(key, new Set([...(aliasOwners.get(key) ?? []), organization.id]))
    }
  }
  const ambiguous = [...aliasOwners.entries()].filter(([, owners]) => owners.size > 1)
  reviewer.check('no-ambiguous-alias', ambiguous.length === 0,
    ambiguous.map(([alias, owners]) => `${alias} -> ${[...owners].join(', ')}`).join('; ') || 'none')

  // --- evidence -------------------------------------------------------------
  const unsourced = organizations.filter((organization) => organization.sources.length === 0)
  reviewer.check('every-company-sourced', unsourced.length === 0,
    unsourced.map((organization) => organization.name).join(', ') || 'none')

  const badSourceUrl = organizations.flatMap((organization) => organization.sources
    .filter((source) => !URL.test(source.url))
    .map((source) => `${organization.name}: "${source.url}"`))
  reviewer.check('every-source-is-a-url', badSourceUrl.length === 0, badSourceUrl.join('; ') || 'none')

  const emptyEvidence = organizations
    .filter((organization) => organization.sources.some((source) => source.evidence.trim().length === 0))
    .map((organization) => organization.name)
  reviewer.check('every-source-says-what-it-supports', emptyEvidence.length === 0, emptyEvidence.join(', ') || 'none')

  const unsourcedScale = organizations.flatMap((organization) => organization.scale
    .filter((entry) => !URL.test(entry.sourceUrl))
    .map((entry) => `${organization.name} ${entry.metric}=${entry.value}`))
  reviewer.check('no-unsourced-scale', unsourcedScale.length === 0, unsourcedScale.join('; ') || 'none')

  const unsourcedLocation = organizations.flatMap((organization) => organization.locations
    .filter((entry) => !URL.test(entry.sourceUrl))
    .map((entry) => `${organization.name} ${entry.city}`))
  reviewer.check('no-unsourced-location', unsourcedLocation.length === 0, unsourcedLocation.join('; ') || 'none')

  // --- the unknown / absent discipline -------------------------------------
  const unknownWithSource = organizations.flatMap((organization) => organization.capabilities
    .filter((link) => link.status === 'unknown' && link.sourceUrl.trim().length > 0)
    .map((link) => `${organization.name}/${link.capabilityId}`))
  reviewer.check('unknown-claims-no-source', unknownWithSource.length === 0,
    unknownWithSource.join(', ') || 'none',
  )

  const notObservedWithoutEvidence = organizations.flatMap((organization) => organization.capabilities
    .filter((link) => link.status === 'not-observed' && link.evidence.trim().length === 0)
    .map((link) => `${organization.name}/${link.capabilityId}`))
  reviewer.check('absence-is-evidenced', notObservedWithoutEvidence.length === 0,
    notObservedWithoutEvidence.join(', ') || 'none')

  const observedWithoutEvidence = organizations.flatMap((organization) => organization.capabilities
    .filter((link) => link.status === 'observed' && (link.evidence.trim().length === 0 || !URL.test(link.sourceUrl)))
    .map((link) => `${organization.name}/${link.capabilityId}`))
  reviewer.check('observed-is-evidenced', observedWithoutEvidence.length === 0,
    observedWithoutEvidence.join(', ') || 'none')

  const statusCounts = organizations.reduce<Record<string, number>>((totals, organization) => {
    for (const link of organization.capabilities) totals[link.status] = (totals[link.status] ?? 0) + 1
    return totals
  }, {})
  reviewer.check('unknowns-are-recorded', (statusCounts.unknown ?? 0) > 0,
    `capability link statuses: ${JSON.stringify(statusCounts)}`)
  reviewer.check('capability-statuses-are-known',
    Object.keys(statusCounts).every((status) => ['observed', 'not-observed', 'unknown'].includes(status)),
    Object.keys(statusCounts).join(', '))

  // --- referential integrity -----------------------------------------------
  const badIndustry = organizations.flatMap((organization) => organization.industries
    .filter((link) => !industryIds.has(link.industryId))
    .map((link) => `${organization.name} -> ${link.industryId}`))
  reviewer.check('industry-ids-resolve', badIndustry.length === 0, badIndustry.join(', ') || 'none')

  const badCapability = organizations.flatMap((organization) => organization.capabilities
    .filter((link) => !capabilityIds.has(link.capabilityId))
    .map((link) => `${organization.name} -> ${link.capabilityId}`))
  reviewer.check('capability-ids-resolve', badCapability.length === 0, badCapability.join(', ') || 'none')

  const badParent = organizations
    .filter((organization) => organization.parentId && !organizationIds.has(organization.parentId))
    .map((organization) => `${organization.name} -> ${organization.parentId}`)
  reviewer.check('parent-ids-resolve', badParent.length === 0, badParent.join(', ') || 'none')

  const badRelationship = relationships
    .filter((relationship) => !organizationIds.has(relationship.fromId) || !organizationIds.has(relationship.toId))
    .map((relationship) => relationship.id)
  reviewer.check('relationship-endpoints-resolve', badRelationship.length === 0, badRelationship.join(', ') || 'none')

  const selfLoop = relationships.filter((relationship) => relationship.fromId === relationship.toId)
  reviewer.check('no-self-referencing-company', selfLoop.length === 0,
    selfLoop.map((relationship) => relationship.id).join(', ') || 'none')

  const badAssociation = associations
    .filter((association) => !organizationIds.has(association.focalId) || !organizationIds.has(association.associatedId))
    .map((association) => association.id)
  reviewer.check('association-endpoints-resolve', badAssociation.length === 0, badAssociation.join(', ') || 'none')

  const badIntelligence = intelligence.filter((record) => !organizationIds.has(record.organizationId))
  reviewer.check('observation-targets-resolve', badIntelligence.length === 0,
    badIntelligence.map((record) => record.id).join(', ') || 'none')

  const unattributed = intelligence.filter((record) => record.reviewer.trim().length === 0)
  reviewer.check('judgement-is-attributed', unattributed.length === 0,
    unattributed.map((record) => record.id).join(', ') || 'none')

  // --- scale of the derived layer ------------------------------------------
  const orderedPairs = organizations.length * (organizations.length - 1)
  reviewer.check('no-all-pairs-table', associations.length < orderedPairs / 100,
    `${associations.length} curated associations against ${orderedPairs} possible ordered pairs`)

  const pocketRefs = industries.filter((industry) => {
    const withPocket = industry as Taxonomy & { pocket?: string }
    return !withPocket.pocket || !pocketIds.has(withPocket.pocket)
  })
  reviewer.check('every-industry-has-a-pocket', pocketRefs.length === 0,
    pocketRefs.map((industry) => industry.id).join(', ') || 'none')

  const verified = organizations.filter((organization) => organization.status === 'verified').length
  reviewer.note('verification-split',
    `${verified} verified, ${organizations.length - verified} pending verification; unknowns are reported separately from absences`)

  return reviewer
}
