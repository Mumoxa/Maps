// Import the supplied Bizcommunity company directory into the canonical
// organization register and the South African Industry Atlas.
//
// The CSV is the source of truth for this batch. This importer does not perform
// web lookups or overwrite source claims with guesses. It keeps every source row
// in the checked-in source-record file and generates compact canonical records,
// while the category-to-taxonomy crosswalk places each company at the broadest
// national branch supported by the supplied label.
//
// Usage:
//   npm run bizcommunity:import
//   npm run bizcommunity:import -- path/to/another.csv
//
// The default input is the checked-in source file named after the user upload.

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { parse } from 'csv-parse/sync'
import organizationsRaw from '../markets/organizations/organizations.json'
import industriesRaw from '../markets/organizations/industries.json'
import pocketsRaw from '../markets/organizations/pockets.json'
import crosswalkRaw from '../markets/organizations/taxonomy/industry-crosswalk.json'
import { canonicalCompanyName } from '../src/data/companyNormalization'
import type {
  BizcommunitySourceRecord,
  BizcommunitySourceRow,
  Organization,
  OrganizationIndustryLink,
  SourceType,
} from '../src/data/organizations/types'

const DEFAULT_INPUT = 'markets/organizations/bizcommunity_companies_verified_2026-10-15a.csv'
const ORGANIZATIONS_FILE = 'markets/organizations/organizations.json'
const INDUSTRIES_FILE = 'markets/organizations/industries.json'
const POCKETS_FILE = 'markets/organizations/pockets.json'
const CROSSWALK_FILE = 'markets/organizations/taxonomy/industry-crosswalk.json'
const SOURCE_RECORDS_FILE = 'markets/organizations/bizcommunity-source-records.json'
const SOURCE_FILE = 'markets/organizations/bizcommunity_companies_verified_2026-10-15a.csv'
const BIZCOMMUNITY_POCKET_ID = 'bizcommunity-directory'

/**
 * A source category is deliberately mapped only as deep as the CSV supports.
 * Composite labels (Energy & Mining) retain both national macro-sector paths;
 * broad labels stay at a macro-sector or L2 branch instead of implying an
 * unverified operational niche.
 */
export const CATEGORY_TARGETS: Record<string, string[]> = {
  Agriculture: ['AGR'],
  Automotive: ['MFG-AUTO'],
  'Construction & Engineering': ['CON'],
  Education: ['EDU'],
  'Energy & Mining': ['ENR', 'MIN'],
  Entrepreneurship: ['PRO'],
  'ESG & Sustainability': ['PRO'],
  Finance: ['FIN'],
  'HR & Management': ['PRO'],
  Healthcare: ['HLC'],
  ICT: ['ICT'],
  Legal: ['PRO-LEGAL'],
  Lifestyle: ['PRO'],
  'Logistics & Transport': ['TRA'],
  Manufacturing: ['MFG'],
  'Marketing & Media': ['PRO-MKT'],
  Property: ['CON-PROP'],
  Retail: ['RTL'],
  'Tourism & Travel': ['TOU'],
}

type RawRow = Record<string, string>

type SourceRowWithNumber = BizcommunitySourceRow & { sourceRowNumber: number }

function slugify(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function tidy(value: string | undefined): string {
  return (value ?? '').trim()
}

function splitList(value: string): string[] {
  return value
    .split(';')
    .map((entry) => entry.trim())
    .filter(Boolean)
}

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))]
}

function dateToIso(value: string): string {
  const match = value.trim().match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/)
  if (!match) return value.trim()
  return `${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}`
}

function sourceRowsFrom(raw: RawRow, sourceRowNumber: number): SourceRowWithNumber {
  return {
    sourceRowNumber,
    companyName: tidy(raw['Company Name']),
    industries: tidy(raw.Industry),
    location: tidy(raw.Location),
    businessDescription: tidy(raw['Business Description']),
    listingType: tidy(raw['Bizcommunity Listing Type']),
    companySizeStaffTier: tidy(raw['Company Size / Staff Tier']),
    sizeTierEvidence: tidy(raw['Size Tier Evidence']),
    profileUrl: tidy(raw['Profile URL']),
    directorySourceUrl: tidy(raw['Directory Source URL']),
    coverageStatus: tidy(raw['Coverage Status']),
    checkedDate: tidy(raw['Checked Date']),
    hasWebsiteOrLinkedInVerified: tidy(raw['Has Website or LinkedIn (Verified)']),
    websiteStatus: tidy(raw['Website Status']),
    websiteUrl: tidy(raw['Website URL']),
    linkedinStatus: tidy(raw['LinkedIn Status']),
    linkedinCompanyUrl: tidy(raw['LinkedIn Company URL']),
    onlinePresenceEvidence: tidy(raw['Online Presence Evidence']),
  }
}

function sourceUrls(rows: SourceRowWithNumber[], field: 'directorySourceUrl' | 'profileUrl' | 'websiteUrl' | 'linkedinCompanyUrl'): string[] {
  return unique(rows.flatMap((row) => field === 'directorySourceUrl' ? splitList(row[field]) : [row[field]]))
}

function sourceRecord(companyName: string, rows: SourceRowWithNumber[], taxonomyIndustryIds: string[]): BizcommunitySourceRecord {
  return {
    sourceFile: SOURCE_FILE,
    companyName,
    sourceRowNumbers: rows.map((row) => row.sourceRowNumber),
    sourceRows: rows,
    sourceIndustryLabels: unique(rows.flatMap((row) => splitList(row.industries))),
    taxonomyIndustryIds,
  }
}

function sourceSummary(record: BizcommunitySourceRecord): BizcommunitySourceRecord {
  const { sourceRows: _sourceRows, ...summary } = record
  return summary
}

function sourceEvidence(record: BizcommunitySourceRecord): string {
  const labels = record.sourceIndustryLabels.join('; ')
  const coverage = unique((record.sourceRows ?? []).map((row) => row.coverageStatus)).join('; ')
  return `Bizcommunity source record. Industry label(s): ${labels}. Coverage status: ${coverage}.`
}

function checkedOnFor(record: BizcommunitySourceRecord): string {
  return (record.sourceRows ?? [])
    .map((row) => dateToIso(row.checkedDate))
    .filter(Boolean)
    .sort()
    .at(-1) ?? ''
}

function buildSources(record: BizcommunitySourceRecord): Organization['sources'] {
  const checkedOn = checkedOnFor(record)
  const rows = record.sourceRows ?? []
  const evidence = sourceEvidence(record)
  const sources: Organization['sources'] = []

  for (const url of sourceUrls(rows, 'directorySourceUrl')) {
    sources.push({
      url,
      type: 'business-directory' satisfies SourceType,
      evidence,
      checkedOn,
      reviewer: '',
      confidence: 'confirmed',
    })
  }
  for (const url of sourceUrls(rows, 'profileUrl')) {
    sources.push({
      url,
      type: 'business-directory' satisfies SourceType,
      evidence: 'Bizcommunity company profile URL retained exactly from the supplied source row.',
      checkedOn,
      reviewer: '',
      confidence: 'confirmed',
    })
  }
  for (const url of sourceUrls(rows, 'websiteUrl')) {
    const status = unique(rows.filter((row) => row.websiteUrl === url).map((row) => row.websiteStatus)).join('; ')
    const presence = unique(rows.filter((row) => row.websiteUrl === url).map((row) => row.onlinePresenceEvidence)).join(' ')
    sources.push({
      url,
      type: 'company-website' satisfies SourceType,
      evidence: `Website status in supplied source: ${status || 'not stated'}. ${presence}`.trim(),
      checkedOn,
      reviewer: '',
      confidence: 'confirmed',
    })
  }
  for (const url of sourceUrls(rows, 'linkedinCompanyUrl')) {
    const status = unique(rows.filter((row) => row.linkedinCompanyUrl === url).map((row) => row.linkedinStatus)).join('; ')
    sources.push({
      url,
      type: 'business-directory' satisfies SourceType,
      evidence: `LinkedIn status in supplied source: ${status || 'not stated'}.`,
      checkedOn,
      reviewer: '',
      confidence: 'confirmed',
    })
  }
  return sources
}

function buildIndustryLinks(record: BizcommunitySourceRecord): OrganizationIndustryLink[] {
  const checkedOn = checkedOnFor(record)
  const rows = record.sourceRows ?? []
  const directoryUrl = sourceUrls(rows, 'directorySourceUrl')[0] ?? sourceUrls(rows, 'websiteUrl')[0] ?? ''
  const links: OrganizationIndustryLink[] = []
  for (const [position, label] of record.sourceIndustryLabels.entries()) {
    links.push({
      industryId: `bizcommunity-${slugify(label)}`,
      primary: position === 0,
      confidence: 'confirmed',
      evidence: `Source category recorded as “${label}” in the supplied Bizcommunity company directory.`,
      sourceUrl: directoryUrl,
      checkedOn,
    })
  }
  return links
}

function buildLocations(record: BizcommunitySourceRecord): Organization['locations'] {
  const checkedOn = checkedOnFor(record)
  const rows = record.sourceRows ?? []
  const sourceUrl = sourceUrls(rows, 'directorySourceUrl')[0] ?? ''
  return unique(rows.map((row) => row.location)).map((location) => ({
    // The CSV provides a free-text place, not a controlled province. Preserve it
    // as the city/place field and leave province empty rather than guessing.
    city: location,
    province: '',
    sourceUrl,
    checkedOn,
  }))
}

function buildNewOrganization(record: BizcommunitySourceRecord, id: string): Organization {
  const checkedOn = checkedOnFor(record)
  const rows = record.sourceRows ?? []
  const website = sourceUrls(rows, 'websiteUrl')[0] ?? ''
  const categories = record.sourceIndustryLabels.join('; ')
  const coverage = unique(rows.map((row) => row.coverageStatus)).join('; ')
  return {
    id,
    name: record.companyName,
    legalName: '',
    aliases: [],
    website,
    status: 'verified',
    industries: buildIndustryLinks(record),
    capabilities: [],
    locations: buildLocations(record),
    scale: [],
    parentId: null,
    sources: buildSources(record),
    datasets: ['bizcommunity'],
    lastVerified: checkedOn,
    notes: `Source-retained Bizcommunity company directory record. Categories: ${categories}. ${coverage}`,
    bizcommunity: sourceSummary(record),
  }
}

function mergeExistingOrganization(
  organization: Organization,
  record: BizcommunitySourceRecord,
): Organization {
  const incomingLinks = buildIndustryLinks(record)
  const industryIds = new Set(organization.industries.map((link) => link.industryId))
  const incomingLocations = buildLocations(record)
  const locationKeys = new Set(organization.locations.map((location) => `${location.city}|${location.province}`))
  const incomingSources = buildSources(record)
  const sourceUrlsInRecord = new Set(organization.sources.map((source) => source.url))
  const rows = record.sourceRows ?? []
  const website = organization.website || sourceUrls(rows, 'websiteUrl')[0] || ''

  return {
    ...organization,
    website,
    industries: [
      ...organization.industries,
      ...incomingLinks.filter((link) => !industryIds.has(link.industryId)),
    ],
    locations: [
      ...organization.locations,
      ...incomingLocations.filter((location) => !locationKeys.has(`${location.city}|${location.province}`)),
    ],
    sources: [
      ...organization.sources,
      ...incomingSources.filter((source) => !sourceUrlsInRecord.has(source.url)),
    ],
    datasets: unique([...organization.datasets, 'bizcommunity']),
    lastVerified: organization.lastVerified > checkedOnFor(record) ? organization.lastVerified : checkedOnFor(record),
    bizcommunity: sourceSummary(record),
  }
}

function main(): void {
  const inputPath = resolve(process.argv[2] ?? DEFAULT_INPUT)
  const csv = readFileSync(inputPath, 'utf8')
  const parsed = parse(csv, { columns: true, skip_empty_lines: true, bom: true }) as RawRow[]
  if (parsed.length === 0) throw new Error(`No rows found in ${inputPath}`)

  const grouped = new Map<string, { name: string; rows: SourceRowWithNumber[] }>()
  parsed.forEach((raw, index) => {
    const row = sourceRowsFrom(raw, index + 2)
    const name = canonicalCompanyName(row.companyName)
    const key = name.toLowerCase()
    const group = grouped.get(key)
    if (group) group.rows.push(row)
    else grouped.set(key, { name, rows: [row] })
  })

  const organizations = (organizationsRaw as Organization[]).map((organization) => ({
    ...organization,
    industries: [...organization.industries],
    locations: [...organization.locations],
    sources: [...organization.sources],
    datasets: [...organization.datasets],
  }))
  const existingByName = new Map<string, Organization>()
  for (const organization of organizations) {
    for (const name of [organization.name, organization.legalName, ...organization.aliases].filter(Boolean)) {
      existingByName.set(canonicalCompanyName(name).toLowerCase(), organization)
    }
  }
  const usedIds = new Set(organizations.map((organization) => organization.id))
  let mergedExisting = 0
  const newRecords: Organization[] = []
  const sourceRecords: BizcommunitySourceRecord[] = []

  for (const group of grouped.values()) {
    const labels = unique(group.rows.flatMap((row) => splitList(row.industries)))
    const ids = labels.map((label) => `bizcommunity-${slugify(label)}`)
    const record = sourceRecord(group.name, group.rows, ids)
    sourceRecords.push(record)
    const existing = existingByName.get(group.name.toLowerCase())
    if (existing) {
      const merged = mergeExistingOrganization(existing, record)
      const position = organizations.findIndex((entry) => entry.id === existing.id)
      organizations[position] = merged
      existingByName.set(group.name.toLowerCase(), merged)
      mergedExisting += 1
      continue
    }

    let id = `org-bizcommunity-${slugify(group.name)}`
    let suffix = 2
    while (usedIds.has(id)) id = `org-bizcommunity-${slugify(group.name)}-${suffix++}`
    usedIds.add(id)
    newRecords.push(buildNewOrganization(record, id))
  }

  const finalOrganizations = [...organizations, ...newRecords]

  const industries = [...(industriesRaw as unknown[])] as Record<string, unknown>[]
  const existingIndustryIds = new Set(industries.map((industry) => String(industry.id)))
  for (const label of Object.keys(CATEGORY_TARGETS)) {
    const id = `bizcommunity-${slugify(label)}`
    if (existingIndustryIds.has(id)) continue
    industries.push({
      id,
      name: label,
      parentId: null,
      pocket: BIZCOMMUNITY_POCKET_ID,
      description: `Source-reported Bizcommunity directory category: ${label}.`,
      synonyms: [label],
    })
  }

  const pockets = [...(pocketsRaw as unknown[])] as Record<string, unknown>[]
  if (!pockets.some((pocket) => pocket.id === BIZCOMMUNITY_POCKET_ID)) {
    pockets.push({
      id: BIZCOMMUNITY_POCKET_ID,
      name: 'Bizcommunity directory categories',
      valueChainStage: 'Source-reported category',
      description: 'The source categories supplied in the Bizcommunity company directory. These labels are retained separately from operating-process industries.',
    })
  }

  const crosswalk = JSON.parse(JSON.stringify(crosswalkRaw)) as {
    pocketMappings: { pocketId: string; taxonomyNodes: string[]; note: string }[]
    industryMappings: { industryId: string; taxonomyNode: string; note?: string }[]
  }
  if (!crosswalk.pocketMappings.some((mapping) => mapping.pocketId === BIZCOMMUNITY_POCKET_ID)) {
    crosswalk.pocketMappings.push({
      pocketId: BIZCOMMUNITY_POCKET_ID,
      taxonomyNodes: unique(Object.values(CATEGORY_TARGETS).flat()),
      note: 'The source pocket is a directory vocabulary. Company placement is driven by each source category industry mapping; broad categories are not pushed into an invented operational niche.',
    })
  }
  const mappedIndustryIds = new Set(crosswalk.industryMappings.map((mapping) => mapping.industryId))
  for (const [label, nodes] of Object.entries(CATEGORY_TARGETS)) {
    const industryId = `bizcommunity-${slugify(label)}`
    if (mappedIndustryIds.has(industryId)) continue
    for (const node of nodes) {
      crosswalk.industryMappings.push({
        industryId,
        taxonomyNode: node,
        note: 'Mapped from the supplied Bizcommunity category at the broadest taxonomy level supported by that label; no narrower activity is inferred.',
      })
    }
  }

  // Keep the canonical register compact: source-row details stay in the
  // dossier-only source-record file, while the organization summary retains
  // the source row numbers and category links needed by the Atlas.
  writeFileSync(resolve(ORGANIZATIONS_FILE), `${JSON.stringify(finalOrganizations, null, 2)}\n`)
  writeFileSync(resolve(SOURCE_RECORDS_FILE), `${JSON.stringify(sourceRecords, null, 2)}\n`)
  writeFileSync(resolve(INDUSTRIES_FILE), `${JSON.stringify(industries, null, 2)}\n`)
  writeFileSync(resolve(POCKETS_FILE), `${JSON.stringify(pockets, null, 2)}\n`)
  writeFileSync(resolve(CROSSWALK_FILE), `${JSON.stringify(crosswalk, null, 2)}\n`)

  process.stdout.write(`${JSON.stringify({
    input: inputPath,
    sourceRows: parsed.length,
    distinctCompanies: sourceRecords.length,
    mergedWithExistingOrganizations: mergedExisting,
    newOrganizations: newRecords.length,
    finalOrganizations: finalOrganizations.length,
    sourceRecords: sourceRecords.length,
    categories: Object.keys(CATEGORY_TARGETS).length,
  }, null, 2)}\n`)
}

main()
