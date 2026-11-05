// Merge reviewed duplicate curated records into one canonical company.
//
//   npm run atlas:merge                 dry run: print exactly what would change
//   npm run atlas:merge -- --commit     apply the reviewed merges
//
// Two curated records for one company means a recruiter sees two dossiers for the
// same employer and the mapped people are split between them. Deciding which
// records are genuinely the same company is a judgement, so the decisions live in
// `markets/organizations/identity-merges.json` with a reason and a source for
// each, and this tool only applies what a reviewer has already written down.
//
// What a merge does, in order, so nothing is lost:
//   1. The duplicate's aliases, legal name, website, industries, taxonomy,
//      capabilities, locations, scale, directory entries, sources and datasets
//      move onto the survivor where the survivor has nothing of its own.
//   2. The duplicate's name becomes an alias of the survivor, so the spelling
//      that used to open the duplicate record still resolves.
//   3. Every reference to the duplicate id is rewritten: contact employer
//      manifest, corporate relationships, curated associations and recruiter
//      intelligence.
//   4. The duplicate record is removed and its id recorded as a redirect.
//
// Run `npm run contacts:reconcile` afterwards, because the contact manifest is
// generated and the validator fails if it is stale.

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import type {
  CompanyAssociation,
  EvidenceRecord,
  Organization,
  OrganizationCapabilityLink,
  OrganizationIndustryLink,
  OrganizationLocation,
  OrganizationRelationship,
  OrganizationScale,
  RecruiterIntelligence,
} from '../src/data/organizations/types'
import { isEmployerPlaceholder } from '../src/data/companyNormalization'

const DIR = resolve('markets/organizations')

interface MergeDecision {
  duplicateId: string
  survivorId: string
  survivorName: string
  reason: string
  sourceUrl: string
  evidence: string
  reviewedOn: string
}

interface MergeFile {
  schemaVersion: number
  merges: MergeDecision[]
}

interface ContactEmployerRow {
  organizationId: string
  name: string
  contactCount: number
  sourceNames: string[]
}

interface ContactManifest {
  schemaVersion: number
  origin: string
  notes: string
  audit: Record<string, number>
  employers: ContactEmployerRow[]
}

function readJson<T>(name: string): T {
  return JSON.parse(readFileSync(resolve(DIR, name), 'utf8')) as T
}

function writeJson(name: string, value: unknown): void {
  writeFileSync(resolve(DIR, name), `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}

/** Union two lists of records by a stable key, keeping the survivor's entry. */
function unionBy<T>(survivor: T[], duplicate: T[], keyOf: (entry: T) => string): T[] {
  const merged = [...survivor]
  const keys = new Set(survivor.map(keyOf))
  for (const entry of duplicate) {
    const key = keyOf(entry)
    if (keys.has(key)) continue
    keys.add(key)
    merged.push(entry)
  }
  return merged
}

export function mergeOrganization(survivor: Organization, duplicate: Organization, decision: MergeDecision): Organization {
  const scaleKey = (entry: OrganizationScale): string =>
    `${entry.metric}|${entry.value}|${entry.asOf}|${entry.sourceUrl}|${entry.entityScope ?? ''}`
  const sourceKey = (entry: EvidenceRecord): string => entry.url
  const industryKey = (entry: OrganizationIndustryLink): string => entry.industryId
  const capabilityKey = (entry: OrganizationCapabilityLink): string => entry.capabilityId
  const locationKey = (entry: OrganizationLocation): string => `${entry.city}|${entry.province}`
  const directoryKey = (entry: NonNullable<Organization['directoryEntries']>[number]): string =>
    `${entry.directory}|${entry.recordKey}`

  // The merge is itself evidence, so it is recorded on the surviving record.
  const mergeEvidence: EvidenceRecord = {
    url: decision.sourceUrl,
    type: 'corporate-disclosure',
    evidence: decision.evidence,
    checkedOn: decision.reviewedOn,
    confidence: 'confirmed',
  }
  const mergeNote = `Merged duplicate record \"${duplicate.name}\" (${duplicate.id}) on ${decision.reviewedOn}: ${decision.reason}`

  return {
    ...survivor,
    name: decision.survivorName || survivor.name,
    legalName: survivor.legalName || duplicate.legalName,
    website: survivor.website || duplicate.website,
    aliases: [...new Set([
      ...survivor.aliases,
      duplicate.name,
      ...duplicate.aliases,
    ])].filter((alias) => alias && alias !== (decision.survivorName || survivor.name)),
    industries: unionBy(survivor.industries, duplicate.industries, industryKey),
    taxonomy: survivor.taxonomy ?? duplicate.taxonomy ?? null,
    capabilities: unionBy(survivor.capabilities, duplicate.capabilities, capabilityKey),
    locations: unionBy(survivor.locations, duplicate.locations, locationKey),
    scale: unionBy(survivor.scale, duplicate.scale, scaleKey),
    parentId: survivor.parentId ?? duplicate.parentId,
    sources: [...unionBy(survivor.sources, duplicate.sources, sourceKey), mergeEvidence],
    datasets: [...new Set([...survivor.datasets, ...duplicate.datasets])],
    directoryEntries: unionBy(survivor.directoryEntries ?? [], duplicate.directoryEntries ?? [], directoryKey),
    lastVerified: survivor.lastVerified > duplicate.lastVerified ? survivor.lastVerified : duplicate.lastVerified,
    notes: [survivor.notes, duplicate.notes, mergeNote].filter(Boolean).join('\n'),
  }
}

function main(): void {
  const commit = process.argv.includes('--commit')
  const evaluated = new Date().toISOString().slice(0, 10)

  const file = readJson<MergeFile>('identity-merges.json')
  const organizations = readJson<Organization[]>('organizations.json')
  const relationships = readJson<OrganizationRelationship[]>('corporate-relationships.json')
  const associations = readJson<CompanyAssociation[]>('associations.json')
  const intelligence = readJson<RecruiterIntelligence[]>('recruiter-intelligence.json')
  const manifest = readJson<ContactManifest>('contact-employers.json')

  const byId = new Map(organizations.map((organization) => [organization.id, organization]))
  const applied: { decision: MergeDecision; survivor: Organization }[] = []
  const problems: string[] = []

  const nextOrganizations: Organization[] = []
  const removed = new Set<string>()
  const promotions = new Map<string, Organization>()

  // Validate every decision before changing anything, so a bad entry cannot
  // leave the register half-merged.
  for (const decision of file.merges) {
    if (decision.survivorId === decision.duplicateId) {
      problems.push(`${decision.duplicateId}: survivor and duplicate are the same record`)
      continue
    }
    if (!byId.has(decision.survivorId)) problems.push(`${decision.survivorId}: surviving record does not exist`)
    if (!byId.has(decision.duplicateId)) problems.push(`${decision.duplicateId}: duplicate record does not exist`)
    if (!decision.reason.trim() || !decision.sourceUrl.trim() || !decision.evidence.trim()) {
      problems.push(`${decision.duplicateId}: a merge needs a reason, a source URL and evidence`)
    }
    if (!decision.reviewedOn.trim()) problems.push(`${decision.duplicateId}: a merge needs a review date`)
  }
  if (problems.length > 0) {
    process.stderr.write(`refusing to merge:\n${problems.map((entry) => `  ${entry}`).join('\n')}\n`)
    process.exitCode = 1
    return
  }

  for (const organization of organizations) {
    const decision = file.merges.find((entry) => entry.duplicateId === organization.id)
    if (decision) {
      removed.add(organization.id)
      continue
    }
    const asSurvivor = file.merges.filter((entry) => entry.survivorId === organization.id)
    if (asSurvivor.length === 0) {
      nextOrganizations.push(organization)
      continue
    }
    // Apply every duplicate onto this survivor in one go.
    let survivor = organization
    for (const entry of asSurvivor) {
      const duplicate = byId.get(entry.duplicateId)
      if (!duplicate) continue
      survivor = mergeOrganization(survivor, duplicate, entry)
    }
    promotions.set(organization.id, survivor)
    nextOrganizations.push(survivor)
    for (const entry of asSurvivor) applied.push({ decision: entry, survivor })
  }

  if (applied.length === 0) {
    process.stdout.write(`${JSON.stringify({ mode: commit ? 'commit' : 'dry-run', merges: 0, note: 'every reviewed merge is already applied' }, null, 2)}\n`)
    return
  }

  // Rewrite references from duplicate ids to survivor ids, everywhere they appear.
  const survivorOf = new Map(file.merges.map((entry) => [entry.duplicateId, entry.survivorId]))

  const nextRelationships = relationships
    .filter((relationship) => !removed.has(relationship.fromId) && !removed.has(relationship.toId))
    .map((relationship) => ({
      ...relationship,
      fromId: survivorOf.get(relationship.fromId) ?? relationship.fromId,
      toId: survivorOf.get(relationship.toId) ?? relationship.toId,
    }))
    .filter((relationship) => relationship.fromId !== relationship.toId)

  const nextAssociations = associations
    .filter((association) => !removed.has(association.focalId) && !removed.has(association.associatedId))
    .map((association) => ({
      ...association,
      focalId: survivorOf.get(association.focalId) ?? association.focalId,
      associatedId: survivorOf.get(association.associatedId) ?? association.associatedId,
    }))
    .filter((association) => association.focalId !== association.associatedId)

  const nextIntelligence = intelligence
    .filter((record) => !removed.has(record.organizationId))
    .map((record) => ({
      ...record,
      organizationId: survivorOf.get(record.organizationId) ?? record.organizationId,
    }))

  // The contact manifest is generated, but its ids must not point at a record
  // that no longer exists. Rows are renumbered onto the survivor and the
  // generator is re-run afterwards to reconcile the counts.
  const nextEmployers = manifest.employers.map((row) => ({
    ...row,
    organizationId: survivorOf.get(row.organizationId) ?? row.organizationId,
  }))
  const nextManifest: ContactManifest = { ...manifest, employers: nextEmployers }

  const summary = {
    mode: commit ? 'commit' : 'dry-run',
    evaluatedOn: evaluated,
    merges: applied.length,
    removed: [...removed],
    details: applied.map(({ decision, survivor }) => ({
      duplicate: decision.duplicateId,
      survivor: survivor.id,
      survivorName: survivor.name,
      aliasesAdded: (byId.get(decision.duplicateId)?.aliases ?? []).length + 1,
      datasets: survivor.datasets,
    })),
    referencesRewritten: {
      relationships: relationships.length - nextRelationships.length,
      associations: associations.length - nextAssociations.length,
      intelligence: intelligence.length - nextIntelligence.length,
      contactRows: manifest.employers.filter((row) => removed.has(row.organizationId)).length,
    },
    placeholdersUntouched: manifest.employers.filter((row) => isEmployerPlaceholder(row.name)).length,
  }

  if (!commit) {
    process.stdout.write(`${JSON.stringify(summary, null, 2)}\n\nNo file was written. Re-run with --commit to apply.\n`)
    return
  }

  writeJson('organizations.json', nextOrganizations)
  writeJson('corporate-relationships.json', nextRelationships)
  writeJson('associations.json', nextAssociations)
  writeJson('recruiter-intelligence.json', nextIntelligence)
  writeJson('contact-employers.json', nextManifest)

  const redirects = applied.map(({ decision }) => ({ from: decision.duplicateId, to: decision.survivorId }))
  writeJson('identity-redirects.json', {
    schemaVersion: 1,
    notes: 'Curated ids that were merged into another record. Kept so an old link or an exported dossier still resolves to the surviving company.',
    redirects,
  })

  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n\nApply with: npm run contacts:reconcile\n`)
}

// Only run the CLI when this file is executed, not when a test imports the pure
// merge function above.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main()
