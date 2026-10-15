// Apply the Top 500 SA company directory batch (2026-10-15) to the canonical
// organization model.
//
//   node --import tsx scripts/apply-top500-organizations.ts            # report only
//   node --import tsx scripts/apply-top500-organizations.ts --commit   # write
//
// Why a script and not the CSV importer:
//   `scripts/organizations-import.ts` mints new ids as `org-<slug>` and cannot
//   express the curated identity of a company the contact directory already
//   knows under a different key. This batch has to merge listings onto one
//   record per legal entity (Barclays Africa Group is Absa, ADT Security is
//   Fidelity ADT), so identity has to be resolved against the existing curated
//   records and the contact-employer manifest before anything is written.
//
// Rules this batch follows, all of them enforced in the report below:
//   * one record per legal entity; a second listing for the same entity becomes
//     an alias and an extra source, never a second organization
//   * a company already curated keeps its id and gains the listing as a source
//     (`enrich`); its existing sourced placements are never overwritten
//   * a category maps to the national taxonomy through
//     `category-industry-map.json`; nothing is placed by guesswork
//   * every source is the directory listing itself, read on 2026-10-15, and
//     every record stays `needs-verification` — a directory listing does not
//     upgrade a company to verified
//   * identity is checked against `contact-employers.json` so no dataset-only
//     stub survives next to the new record as a duplicate

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { parse } from 'csv-parse/sync'
import { canonicalCompanyName } from '../src/data/companyNormalization'
import { parseLocation } from '../src/data/searchBank/normalise'
import { slugify } from '../src/data/slug'
import type {
  EvidenceRecord,
  Industry,
  Organization,
  OrganizationIndustryLink,
  OrganizationLocation,
} from '../src/data/organizations/types'

const BATCH_DIR = 'markets/organizations/imports/top500-companies-2026-10-15'
const CSV_PATH = resolve(BATCH_DIR, 'source/top500_categorised.csv')
const MAP_PATH = resolve(BATCH_DIR, 'category-industry-map.json')
const OVERLAY_PATH = resolve(BATCH_DIR, 'identity-overlay.json')
const REPORT_PATH = resolve(BATCH_DIR, 'import-report.json')
const ORGANIZATIONS_PATH = 'markets/organizations/organizations.json'
const MANIFEST_PATH = 'markets/organizations/contact-employers.json'
const CROSSWALK_PATH = 'markets/organizations/taxonomy/industry-crosswalk.json'
const TREE_PATH = 'markets/organizations/taxonomy/sector-tree.json'
const INDUSTRIES_PATH = 'markets/organizations/industries.json'

/** The directory was read on this date; it is the checkedOn of every record. */
const CHECKED_ON = '2026-10-15'
/** Directory listings are industry-directory evidence, never a company website. */
const SOURCE_TYPE: EvidenceRecord['type'] = 'industry-directory'

// ---------------------------------------------------------------------------
// Batch inputs
// ---------------------------------------------------------------------------

interface MapEntry {
  category: string
  industryIds: string[]
  note: string
}

interface RowOverride {
  company: string
  category: string
  action: 'reject' | 'redirect'
  industries?: string[]
  /** Evidence sentence for the placement, when the listing itself states it. */
  evidence?: string
  reason: string
  evidenceUrl?: string
}

interface CategoryMap {
  mappings: MapEntry[]
  rowOverrides: RowOverride[]
}

/**
 * Curated identity decisions for the batch. Everything not listed here resolves
 * from the source name itself, so the overlay stays as small as the number of
 * genuine identity exceptions.
 */
interface IdentityEntry {
  /** Display name when the source name is a legal form rather than a brand. */
  name?: string
  legalName?: string
  aliases?: string[]
  /** Fold this listing into another listing's record — same legal entity. */
  mergeInto?: string
  /** Existing curated record that only gains the listing as an extra source. */
  enrich?: string
  /** Record id when it must not be derived from the display name. */
  id?: string
  /** Live listing to cite when the URL in the export no longer resolves. */
  sourceUrl?: string
  sourceUrlReason?: string
  note?: string
}

interface IdentityOverlay {
  companies: Record<string, IdentityEntry>
}

interface SourceRow {
  company: string
  category: string
  locations: string
  url: string
}

interface Crosswalk {
  industryMappings: { industryId: string; taxonomyNode: string }[]
}

interface TaxonomyNode {
  id: string
  level: number
}

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, 'utf8')) as T
}

// ---------------------------------------------------------------------------
// Row preparation
// ---------------------------------------------------------------------------

/**
 * Every industry placement that arrives from a directory listing is directory
 * evidence, so the strongest confidence it can reach is `probable`. A company
 * whose placements all land on a macro-sector node (a generic label such as
 * "Mining" or "Information Technology") stays `hypothesis`, because the source
 * never established a sub-branch for it. This mirrors `confidenceRule` in the
 * category map rather than inventing a second rule here.
 */
function confidenceFor(levels: number[]): OrganizationIndustryLink['confidence'] {
  if (levels.length === 0) return 'unknown'
  return levels.some((level) => level > 2) ? 'probable' : 'hypothesis'
}

function listingEvidence(company: string, categories: string[]): string {
  const labels = categories.map((category) => `"${category}"`).join(', ')
  return `Top 500 SA company directory listing for ${company}, categorised under ${labels}.`
}

// ---------------------------------------------------------------------------
// Plan
// ---------------------------------------------------------------------------

interface PlannedRecord {
  organization: Organization
  /** Source names folded into this record, for the merge audit. */
  mergedFrom: string[]
  /** Placements with the taxonomy node level, used for the confidence rule. */
  placementLevels: number[]
  categories: string[]
}

interface Plan {
  records: PlannedRecord[]
  enrichments: { id: string; urls: string[]; name: string; aliases: string[] }[]
  rejectedRows: { company: string; category: string; reason: string }[]
  unplaced: { company: string; reason: string }[]
  issues: string[]
  /** Dataset-only employers this batch replaces, keyed by old manifest id. */
  stubReplacements: { from: string; to: string; contacts: number }[]
  stillStubbed: { id: string; name: string; contacts: number; candidate?: string }[]
}

function plan(): Plan {
  const map = readJson<CategoryMap>(MAP_PATH)
  const overlay = readJson<IdentityOverlay>(OVERLAY_PATH)
  const industries = readJson<Industry[]>(INDUSTRIES_PATH)
  const crosswalk = readJson<Crosswalk>(CROSSWALK_PATH)
  const tree = readJson<TaxonomyNode[]>(TREE_PATH)
  const organizations = readJson<Organization[]>(ORGANIZATIONS_PATH)
  const manifest = readJson<{ employers: { organizationId: string; name: string; contactCount: number }[] }>(MANIFEST_PATH)

  const industryById = new Map(industries.map((industry) => [industry.id, industry]))
  const nodeById = new Map(tree.map((node) => [node.id, node]))
  const nodeLevel = new Map<string, number>()
  for (const mapping of crosswalk.industryMappings) {
    const node = nodeById.get(mapping.taxonomyNode)
    if (node) nodeLevel.set(mapping.industryId, node.level)
  }

  const mapByCategory = new Map(map.mappings.map((entry) => [entry.category, entry]))
  const overrideByKey = new Map(map.rowOverrides.map((entry) => [`${entry.company}|${entry.category}`, entry]))
  const key = (name: string) => canonicalCompanyName(name).toLowerCase()

  const rawRows = parse(readFileSync(CSV_PATH, 'utf8'), { columns: true, skip_empty_lines: true, bom: true }) as Record<string, string>[]
  const rows: SourceRow[] = rawRows.map((row) => ({
    company: String(row.Company ?? '').trim(),
    category: String(row.Category ?? '').trim(),
    locations: String(row['Location(s)'] ?? '').trim(),
    url: String(row.URL ?? '').trim(),
  }))

  const issues: string[] = []
  const rejectedRows: Plan['rejectedRows'] = []

  // Resolve each source listing onto the company whose record it belongs to.
  const targetOf = (company: string) => overlay.companies[company]?.mergeInto ?? company
  const groups = new Map<string, SourceRow[]>()
  for (const row of rows) {
    if (!row.company) {
      issues.push(`a source row has no company name (${row.url || 'no url'})`)
      continue
    }
    const override = overrideByKey.get(`${row.company}|${row.category}`)
    if (override?.action === 'reject') {
      rejectedRows.push({ company: row.company, category: row.category, reason: override.reason })
      continue
    }
    const target = targetOf(row.company)
    const list = groups.get(target)
    if (list) list.push(row)
    else groups.set(target, [row])
  }

  const records: PlannedRecord[] = []
  const enrichments: Plan['enrichments'] = []
  const unplaced: Plan['unplaced'] = []

  for (const [target, groupRows] of [...groups.entries()].sort((a, b) => (a[0].toLowerCase() < b[0].toLowerCase() ? -1 : 1))) {
    const entry = overlay.companies[target] ?? {}
    // A row whose directory URL no longer resolves cites the live listing
    // instead, so every source on the record is a page that was actually read.
    const urls = entry.sourceUrl
      ? [entry.sourceUrl]
      : [...new Set(groupRows.map((row) => row.url).filter(Boolean))]
    const urlFor = (row: SourceRow) => entry.sourceUrl ?? row.url

    if (entry.enrich) {
      // Already curated: the listing becomes an extra source and any new name
      // form helps employer resolution, but no sourced placement is touched.
      enrichments.push({
        id: entry.enrich,
        urls,
        name: canonicalCompanyName(target),
        aliases: [...new Set([...(entry.aliases ?? []), canonicalCompanyName(target), target])],
      })
      continue
    }

    const displayName = entry.name ?? canonicalCompanyName(target)
    const id = entry.id ?? `org-${slugify(displayName)}`
    const mergedFrom = Object.entries(overlay.companies)
      .filter(([, value]) => value.mergeInto === target)
      .map(([name]) => name)

    // Aliases carry every name the directory and the contact directory use for
    // the entity, so employer resolution lands on this record and no stub is
    // left behind as a duplicate.
    const aliases = new Set<string>(entry.aliases ?? [])
    for (const name of [target, ...mergedFrom]) {
      if (canonicalCompanyName(name) !== displayName) aliases.add(canonicalCompanyName(name))
      if (name !== displayName) aliases.add(name)
    }
    const legalName = entry.legalName
      ?? (/\b(pty|ltd|limited|soc|inc|cc)\b/i.test(target) ? target : '')

    // Industries: the mapped taxonomy industry for each category the source
    // states for this entity, deduplicated, first placement primary.
    const industries: OrganizationIndustryLink[] = []
    const placementLevels: number[] = []
    const categories: string[] = []
    for (const row of groupRows) {
      const override = overrideByKey.get(`${row.company}|${row.category}`)
      const mapped = override?.industries ?? mapByCategory.get(row.category)?.industryIds ?? null
      if (mapped === null) {
        issues.push(`category "${row.category}" has no mapping in category-industry-map.json`)
        continue
      }
      if (!categories.includes(row.category)) categories.push(row.category)
      for (const industryId of mapped) {
        if (!industryById.has(industryId)) {
          issues.push(`category "${row.category}" maps to unknown industry "${industryId}"`)
          continue
        }
        const level = nodeLevel.get(industryId)
        if (level === undefined) issues.push(`industry "${industryId}" has no crosswalk mapping`)
        if (level !== undefined) placementLevels.push(level)
        if (industries.some((link) => link.industryId === industryId)) continue
        industries.push({
          industryId,
          primary: false,
          confidence: 'probable',
          evidence: override?.evidence ?? listingEvidence(row.company, [row.category]),
          sourceUrl: urlFor(row),
          checkedOn: CHECKED_ON,
        })
      }
    }
    const confidence = confidenceFor(placementLevels)
    for (const link of industries) link.confidence = confidence
    if (industries.length > 0) industries[0].primary = true
    if (industries.length === 0) {
      unplaced.push({ company: target, reason: 'the directory states no sector for this company' })
    }

    // Locations: the listing's own location string through the application's
    // parser, so the record says what the source said and nothing more.
    const locations: OrganizationLocation[] = []
    for (const row of groupRows) {
      if (!row.locations) continue
      const parsed = parseLocation(row.locations)
      if (!parsed.province) continue
      const exists = locations.some((location) => location.province === parsed.province && location.city === parsed.city)
      if (!exists) locations.push({ city: parsed.city, province: parsed.province, sourceUrl: urlFor(row), checkedOn: CHECKED_ON })
    }
    if (locations.length === 0) {
      unplaced.push({ company: target, reason: 'the directory states no province for this company' })
    }

    const sources: EvidenceRecord[] = urls.map((url) => ({
      url,
      type: SOURCE_TYPE,
      evidence: listingEvidence(
        groupRows.find((row) => urlFor(row) === url)?.company ?? displayName,
        [...new Set(groupRows.filter((row) => urlFor(row) === url).map((row) => row.category))],
      ),
      checkedOn: CHECKED_ON,
      reviewer: '',
      confidence: 'probable',
    }))

    const organization: Organization = {
      id,
      name: displayName,
      legalName,
      aliases: [...aliases],
      website: '',
      status: 'needs-verification',
      industries,
      capabilities: [],
      locations,
      // A directory listing states no headcount, revenue or site count, so the
      // record carries no scale entry at all rather than a guess.
      scale: [],
      parentId: null,
      sources,
      datasets: ['organizations'],
      lastVerified: CHECKED_ON,
      notes: [entry.note, entry.sourceUrlReason].filter(Boolean).join(' '),
    }

    records.push({ organization, mergedFrom, placementLevels, categories })
  }

  // Identity guardrails -----------------------------------------------------
  const curatedByKey = new Map<string, string>()
  const curatedById = new Map(organizations.map((organization) => [organization.id, organization]))
  for (const organization of organizations) {
    for (const candidate of [organization.name, organization.legalName, ...organization.aliases]) {
      if (candidate) curatedByKey.set(key(candidate), organization.id)
    }
  }

  const plannedIds = new Map<string, string>()
  for (const record of records) {
    const previous = plannedIds.get(record.organization.id)
    if (previous) issues.push(`two listings resolve to the same record id "${record.organization.id}": ${previous} and ${record.organization.name}`)
    plannedIds.set(record.organization.id, record.organization.name)

    for (const candidate of [record.organization.name, record.organization.legalName, ...record.organization.aliases]) {
      const owner = curatedByKey.get(key(candidate))
      if (owner && owner !== record.organization.id && !curatedById.get(owner)?.id.startsWith('org-dataset:')) {
        issues.push(`"${record.organization.name}" collides with curated record ${owner} on name "${candidate}"; it must enrich that record instead of creating a second one`)
      }
    }
  }

  // Contact-employer reconciliation ----------------------------------------
  // Every dataset-only employer the listing names has to end up resolving to a
  // planned record, otherwise the atlas would show the stub and the curated
  // record as two companies.
  const plannedKeys = new Map<string, string>()
  for (const record of records) {
    for (const candidate of [record.organization.name, record.organization.legalName, ...record.organization.aliases]) {
      if (candidate) plannedKeys.set(key(candidate), record.organization.id)
    }
  }
  for (const enrichment of enrichments) {
    // An enriched record already exists; its own names plus the alias forms the
    // listing adds are how the contact directory resolves onto it.
    const existing = organizations.find((organization) => organization.id === enrichment.id)
    const names = [...(existing ? [existing.name, existing.legalName, ...existing.aliases] : []), ...enrichment.aliases]
    for (const candidate of names) if (candidate) plannedKeys.set(key(candidate), enrichment.id)
  }
  const stubReplacements: Plan['stubReplacements'] = []
  const stillStubbed: Plan['stillStubbed'] = []
  for (const employer of manifest.employers) {
    if (employer.organizationId.startsWith('org-dataset:')) {
      const planned = plannedKeys.get(key(employer.name))
      if (planned) stubReplacements.push({ from: employer.organizationId, to: planned, contacts: employer.contactCount })
      continue
    }
    if (!curatedById.has(employer.organizationId)) issues.push(`manifest references missing curated record ${employer.organizationId}`)
  }
  // A stub is only a problem when a batch company could claim it and did not.
  // Division, subsidiary and group spellings are deliberately left as separate
  // employers, so this list is reviewed rather than treated as an error.
  const tokens = (value: string) => new Set(key(value).split(/[^a-z0-9]+/).filter((token) => token.length > 2))
  const batchKeys = [...plannedKeys.keys(), ...records.map((record) => key(record.organization.name))]
  for (const employer of manifest.employers) {
    if (!employer.organizationId.startsWith('org-dataset:')) continue
    const employerKey = key(employer.name)
    if (plannedKeys.has(employerKey)) continue
    const employerTokens = tokens(employer.name)
    const subset = (a: Set<string>, b: Set<string>) => a.size > 0 && [...a].every((token) => b.has(token))
    const candidate = batchKeys.find((entry) => {
      const entryTokens = tokens(entry)
      return subset(employerTokens, entryTokens) || subset(entryTokens, employerTokens)
    })
    if (candidate) stillStubbed.push({ id: employer.organizationId, name: employer.name, contacts: employer.contactCount, candidate })
  }

  return { records, enrichments, rejectedRows, unplaced, issues, stubReplacements, stillStubbed }
}

// ---------------------------------------------------------------------------
// Apply
// ---------------------------------------------------------------------------

function apply(result: Plan, commit: boolean) {
  const organizations = readJson<Organization[]>(ORGANIZATIONS_PATH)
  const byId = new Map(organizations.map((organization) => [organization.id, organization]))
  const next = [...organizations]

  for (const record of result.records) {
    const existing = byId.get(record.organization.id)
    if (existing && existing.name !== record.organization.name) {
      // The id belongs to a different curated record: refuse to overwrite it.
      result.issues.push(`record id ${record.organization.id} already belongs to "${existing.name}"`)
      continue
    }
    if (existing) next[next.indexOf(existing)] = record.organization
    else next.push(record.organization)
  }

  for (const enrichment of result.enrichments) {
    const index = next.findIndex((organization) => organization.id === enrichment.id)
    if (index < 0) {
      result.issues.push(`enrichment target ${enrichment.id} does not exist`)
      continue
    }
    const organization = next[index]
    const sources = [...organization.sources]
    for (const url of enrichment.urls) {
      if (!url || sources.some((source) => source.url === url)) continue
      sources.push({
        url,
        type: SOURCE_TYPE,
        evidence: `Top 500 SA company directory listing for ${organization.name}.`,
        checkedOn: CHECKED_ON,
        reviewer: '',
        confidence: 'probable',
      })
    }
    const aliases = [...organization.aliases]
    for (const alias of enrichment.aliases) {
      if (alias && alias !== organization.name && !aliases.includes(alias)) aliases.push(alias)
    }
    next[index] = { ...organization, sources, aliases }
  }

  if (commit) writeFileSync(ORGANIZATIONS_PATH, `${JSON.stringify(next, null, 2)}\n`)
  return next
}

/**
 * Employer rows the regenerated contact manifest resolves onto this batch's
 * records, so a re-run reports the same identity outcome as the first commit.
 */
function countEmployerRowsFor(result: Plan): number {
  const manifest = readJson<{ employers: { organizationId: string }[] }>(MANIFEST_PATH)
  const ids = new Set<string>([
    ...result.records.map((record) => record.organization.id),
    ...result.enrichments.map((enrichment) => enrichment.id),
  ])
  return manifest.employers.filter((employer) => ids.has(employer.organizationId)).length
}

// ---------------------------------------------------------------------------

function main() {
  const commit = process.argv.includes('--commit')
  const result = plan()
  const next = apply(result, commit)

  const industries = readJson<Industry[]>(INDUSTRIES_PATH)
  const pocketOf = new Map(industries.map((industry) => [industry.id, industry.pocket]))
  const perPocket: Record<string, number> = {}
  const perConfidence: Record<string, number> = {}
  for (const record of result.records) {
    const confidence = record.organization.industries[0]?.confidence ?? 'none'
    perConfidence[confidence] = (perConfidence[confidence] ?? 0) + 1
    for (const link of record.organization.industries) {
      const pocket = pocketOf.get(link.industryId) ?? 'unclassified'
      perPocket[pocket] = (perPocket[pocket] ?? 0) + 1
    }
  }

  const report = {
    date: CHECKED_ON,
    mode: commit ? 'commit' : 'report',
    organizationsBefore: readJson<Organization[]>(ORGANIZATIONS_PATH).length,
    organizationsAfter: next.length,
    organizationRecords: result.records.length,
    // Employer rows that resolved to a dataset-only stub before this batch and now
    // resolve to a curated record. Zero on a re-run, because the stub is gone.
    datasetOnlyEmployersReplaced: new Set(result.stubReplacements.map((entry) => entry.from)).size,
    // Employer rows the contact manifest now resolves onto a record from this
    // batch (the durable figure, stable across re-runs).
    employerRowsResolvingToBatch: countEmployerRowsFor(result),
    mergedListings: result.records.filter((record) => record.mergedFrom.length > 0)
      .map((record) => `${record.mergedFrom.join(' + ')} -> ${record.organization.id}`),
    enrichments: result.enrichments,
    rejectedRows: result.rejectedRows,
    unplacedCompanies: result.unplaced,
    perConfidence,
    perPocket,
    stubReplacements: result.stubReplacements.sort((a, b) => b.contacts - a.contacts),
    stillStubbed: result.stillStubbed,
    issues: result.issues,
    records: result.records.map((record) => ({
      id: record.organization.id,
      name: record.organization.name,
      aliases: record.organization.aliases,
      industries: record.organization.industries.map((link) => link.industryId),
      confidence: record.organization.industries[0]?.confidence ?? 'none',
      locations: record.organization.locations.map((location) => `${location.city}${location.city ? ', ' : ''}${location.province}`),
      sources: record.organization.sources.length,
      mergedFrom: record.mergedFrom,
    })),
  }

  writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`)
  process.stdout.write(`${JSON.stringify({
    mode: report.mode,
    organizationRecords: report.organizationRecords,
    datasetOnlyEmployersReplaced: report.datasetOnlyEmployersReplaced,
    employerRowsResolvingToBatch: report.employerRowsResolvingToBatch,
    enrichments: report.enrichments.length,
    mergedListings: report.mergedListings.length,
    rejectedRows: report.rejectedRows.length,
    unplacedCompanies: report.unplacedCompanies.length,
    perConfidence: report.perConfidence,
    issues: report.issues,
    stillStubbed: report.stillStubbed,
  }, null, 2)}\n`)
}

main()
