// Derive an auditable CA(SA) *research inventory*, not a national membership register.
// Source of truth: markets/accountants/people.jsonl. This script never changes it.
// Run: npm run accountants:casa-export

import { readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { canonicalizeIdentityUrl } from '../src/data/marketData/identity'

type LocationAssessment =
  | 'CONFIRMED_SA_LOCATION'
  | 'HIGH_CONFIDENCE_SA_LOCATION'
  | 'SA_LOCATION_NOT_EVIDENCED'
  | 'OUTSIDE_SA'
  | 'COUNTRY_UNKNOWN'

interface ResearchPerson {
  id: string
  full_name: string
  status: string
  professional_designations?: string[]
  designation_status?: string
  country?: string | null
  location_confidence?: string | null
  province?: string | null
  city?: string | null
  current_title?: string | null
  current_employer?: string | null
  current_industry?: string | null
  current_sub_industry?: string | null
  linkedin_url?: string | null
  primary_source?: string | null
  source_urls?: string[]
  date_last_verified?: string | null
}

export interface CasaInventoryRow {
  researchId: string
  name: string
  designationStatus: string
  recordStatus: string
  locationAssessment: LocationAssessment
  locationConfidence: string
  country: string
  province: string
  city: string
  title: string
  employer: string
  industry: string
  industryBasis: 'PERSON_RECORD' | 'EMPLOYER_CATALOGUE' | 'UNKNOWN'
  industrySourceUrl: string
  subIndustry: string
  linkedinUrl: string
  primarySource: string
  sourceUrls: string[]
  lastVerified: string
  missingFields: string[]
}

export interface CasaInventory {
  rows: CasaInventoryRow[]
  metrics: {
    recorded: number
    saLabelled: number
    industryFromEmployerCatalogue: number
    designationConfirmed: number
    designationNeedsReview: number
    location: Record<LocationAssessment, number>
    missing: Record<'title' | 'employer' | 'industry' | 'linkedin' | 'saLocation', number>
    latestRecordCheck: string
  }
}

const locationAssessments: LocationAssessment[] = [
  'CONFIRMED_SA_LOCATION',
  'HIGH_CONFIDENCE_SA_LOCATION',
  'SA_LOCATION_NOT_EVIDENCED',
  'OUTSIDE_SA',
  'COUNTRY_UNKNOWN',
]

function requiredText(value: unknown, field: string, lineNumber: number): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`line ${lineNumber}: missing ${field}`)
  }
  return value.trim()
}

function optionalText(value: unknown, field: string, lineNumber: number): string {
  if (value == null) return ''
  if (typeof value !== 'string') throw new Error(`line ${lineNumber}: ${field} must be text or null`)
  return value.trim()
}

function httpUrl(value: string, field: string, lineNumber: number): string {
  try {
    const url = new URL(value)
    if (!['http:', 'https:'].includes(url.protocol) || !url.hostname) throw new Error('invalid URL')
    return url.href
  } catch {
    throw new Error(`line ${lineNumber}: invalid ${field}`)
  }
}

/** Public person-profile URL only; used by the export and private roster reconciliation. */
export function linkedinProfileUrl(value: string, lineNumber: number): string {
  const url = httpUrl(value, 'linkedin_url', lineNumber)
  const parsed = new URL(url)
  if (parsed.protocol !== 'https:'
    || !(parsed.hostname === 'linkedin.com' || parsed.hostname.endsWith('.linkedin.com'))
    || parsed.username || parsed.password
    || !/^\/in\/[^/]+\/?$/.test(parsed.pathname)) {
    throw new Error(`line ${lineNumber}: linkedin_url must be a public LinkedIn person profile URL`)
  }
  return url
}

function assessLocation(country: string, confidence: string): LocationAssessment {
  if (!country) return 'COUNTRY_UNKNOWN'
  if (country !== 'South Africa') return 'OUTSIDE_SA'
  if (confidence === 'CONFIRMED') return 'CONFIRMED_SA_LOCATION'
  if (confidence === 'HIGH') return 'HIGH_CONFIDENCE_SA_LOCATION'
  // 'South Africa' is the research DB's default country, NOT proof of residence.
  return 'SA_LOCATION_NOT_EVIDENCED'
}

interface EmployerIndustry {
  industry: string
  sourceUrl: string
}

/** Only exact, unique employer-name matches with a source can supply an industry. */
function employerIndustryLookup(companiesJsonl: string): Map<string, EmployerIndustry | null> {
  const lookup = new Map<string, EmployerIndustry | null>()
  for (const [index, line] of companiesJsonl.split(/\r?\n/).entries()) {
    if (!line.trim()) continue
    let company: Record<string, unknown>
    try {
      company = JSON.parse(line) as Record<string, unknown>
    } catch {
      throw new Error(`company line ${index + 1}: invalid JSON`)
    }
    if (!company || typeof company !== 'object' || Array.isArray(company)) {
      throw new Error(`company line ${index + 1}: expected a company object`)
    }
    const name = typeof company.company_name === 'string' ? company.company_name.trim().toLowerCase() : ''
    if (!name) continue
    // Once a name is ambiguous, never pick a company by position in the JSONL.
    if (lookup.has(name)) {
      lookup.set(name, null)
      continue
    }
    const industry = typeof company.industry === 'string' ? company.industry.trim() : ''
    const sources = Array.isArray(company.source_urls) ? company.source_urls : []
    const source = sources[0]
    const sourceUrl = typeof source === 'string' && /^https?:\/\//i.test(source) ? source.trim() : ''
    lookup.set(name, industry && sourceUrl ? { industry, sourceUrl } : null)
  }
  return lookup
}

function toRow(person: ResearchPerson, lineNumber: number, industries: Map<string, EmployerIndustry | null>): CasaInventoryRow {
  const id = requiredText(person.id, 'id', lineNumber)
  const name = requiredText(person.full_name, 'full_name', lineNumber)
  const lastVerified = requiredText(person.date_last_verified, 'date_last_verified', lineNumber)
  const checkedDate = new Date(`${lastVerified}T00:00:00Z`)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(lastVerified)
    || Number.isNaN(checkedDate.getTime())
    || checkedDate.toISOString().slice(0, 10) !== lastVerified) {
    throw new Error(`line ${lineNumber}: invalid date_last_verified`)
  }
  const primarySource = httpUrl(requiredText(person.primary_source, 'primary_source', lineNumber), 'primary_source', lineNumber)
  if (!Array.isArray(person.source_urls) || person.source_urls.length === 0) {
    throw new Error(`line ${lineNumber}: missing source_urls`)
  }
  const sourceUrls = [...new Set(person.source_urls.map((url) =>
    httpUrl(requiredText(url, 'source_urls item', lineNumber), 'source_urls item', lineNumber),
  ))]
  const linkedin = optionalText(person.linkedin_url, 'linkedin_url', lineNumber)
  const country = optionalText(person.country, 'country', lineNumber)
  const locationConfidence = optionalText(person.location_confidence, 'location_confidence', lineNumber)
  const sourceTitle = optionalText(person.current_title, 'current_title', lineNumber)
  // Early research batches used "Not stated in index/snippet" as a title placeholder.
  // Do not pass that through as though it were a verified job title.
  const title = /\bnot stated\b/i.test(sourceTitle) ? '' : sourceTitle
  const employer = optionalText(person.current_employer, 'current_employer', lineNumber)
  const recordedIndustry = optionalText(person.current_industry, 'current_industry', lineNumber)
  const employerIndustry = !recordedIndustry && employer ? industries.get(employer.toLowerCase()) : null
  const industry = recordedIndustry || employerIndustry?.industry || ''
  const industryBasis = recordedIndustry ? 'PERSON_RECORD' : employerIndustry ? 'EMPLOYER_CATALOGUE' : 'UNKNOWN'
  const industrySourceUrl = employerIndustry ? httpUrl(employerIndustry.sourceUrl, 'employer industry source', lineNumber) : ''
  const locationAssessment = assessLocation(country, locationConfidence)
  const missingFields = [
    !title && 'title',
    !employer && 'employer',
    !industry && 'industry',
    !linkedin && 'linkedin',
    ['SA_LOCATION_NOT_EVIDENCED', 'COUNTRY_UNKNOWN'].includes(locationAssessment) && 'sa_location',
  ].filter((field): field is string => Boolean(field))

  return {
    researchId: id,
    name,
    designationStatus: optionalText(person.designation_status, 'designation_status', lineNumber),
    recordStatus: requiredText(person.status, 'status', lineNumber),
    locationAssessment,
    locationConfidence,
    country,
    province: optionalText(person.province, 'province', lineNumber),
    city: optionalText(person.city, 'city', lineNumber),
    title,
    employer,
    industry,
    industryBasis,
    industrySourceUrl,
    subIndustry: optionalText(person.current_sub_industry, 'current_sub_industry', lineNumber),
    linkedinUrl: linkedin ? linkedinProfileUrl(linkedin, lineNumber) : '',
    primarySource,
    sourceUrls,
    lastVerified,
    missingFields,
  }
}

/** Never match on name or on the letters "CA(SA)" inside a LinkedIn slug. */
export function buildCasaInventory(jsonl: string, companiesJsonl = ''): CasaInventory {
  const rows: CasaInventoryRow[] = []
  const industries = employerIndustryLookup(companiesJsonl)
  const seenIds = new Set<string>()
  const seenLinkedin = new Set<string>()

  jsonl.split(/\r?\n/).forEach((line, index) => {
    if (!line.trim()) return
    let person: ResearchPerson
    try {
      person = JSON.parse(line) as ResearchPerson
    } catch {
      throw new Error(`line ${index + 1}: invalid JSON`)
    }
    if (!person || typeof person !== 'object' || Array.isArray(person)) {
      throw new Error(`line ${index + 1}: expected a person object`)
    }
    const id = requiredText(person.id, 'id', index + 1)
    if (seenIds.has(id)) throw new Error(`line ${index + 1}: duplicate research id ${id}`)
    seenIds.add(id)

    if (person.status === 'REJECTED' || !Array.isArray(person.professional_designations)
      || !person.professional_designations.includes('CA(SA)')) return
    const row = toRow(person, index + 1, industries)
    if (row.linkedinUrl) {
      const identity = canonicalizeIdentityUrl(row.linkedinUrl)
      if (seenLinkedin.has(identity)) throw new Error(`line ${index + 1}: duplicate LinkedIn identity ${identity}`)
      seenLinkedin.add(identity)
    }
    rows.push(row)
  })

  rows.sort((a, b) => a.name.localeCompare(b.name, 'en') || a.researchId.localeCompare(b.researchId))
  const saRows = rows.filter((row) => row.country === 'South Africa')
  const location = Object.fromEntries(locationAssessments.map((assessment) => [assessment, 0])) as Record<LocationAssessment, number>
  for (const row of rows) location[row.locationAssessment] += 1

  return {
    rows,
    metrics: {
      recorded: rows.length,
      saLabelled: saRows.length,
      industryFromEmployerCatalogue: saRows.filter((row) => row.industryBasis === 'EMPLOYER_CATALOGUE').length,
      designationConfirmed: saRows.filter((row) => row.recordStatus === 'CONFIRMED' && row.designationStatus === 'CONFIRMED').length,
      designationNeedsReview: saRows.filter((row) => row.recordStatus !== 'CONFIRMED' || row.designationStatus !== 'CONFIRMED').length,
      location,
      missing: {
        title: saRows.filter((row) => !row.title).length,
        employer: saRows.filter((row) => !row.employer).length,
        industry: saRows.filter((row) => !row.industry).length,
        linkedin: saRows.filter((row) => !row.linkedinUrl).length,
        saLocation: saRows.filter((row) => row.locationAssessment === 'SA_LOCATION_NOT_EVIDENCED').length,
      },
      latestRecordCheck: rows.map((row) => row.lastVerified).sort().at(-1) ?? '',
    },
  }
}

// Escape spreadsheet formulas as well as RFC 4180 quotes/newlines. The source
// strings remain unchanged in people.jsonl; only the CSV presentation is safe.
export function csvCell(value: string): string {
  const safe = /^\s*[=+\-@]/.test(value) ? `'${value}` : value
  return /[",\r\n]/.test(safe) ? `"${safe.replaceAll('"', '""')}"` : safe
}

export function casaInventoryCsv(inventory: CasaInventory): string {
  const headers = [
    'research_id', 'name', 'designation', 'designation_status', 'record_status',
    'sa_location_assessment', 'location_confidence', 'country', 'province', 'city',
    'title', 'employer', 'industry', 'industry_basis', 'industry_source_url', 'sub_industry', 'linkedin_url',
    'primary_source', 'source_urls', 'last_verified', 'missing_fields',
  ]
  const lines = [headers.join(',')]
  for (const row of inventory.rows) {
    lines.push([
      row.researchId, row.name, 'CA(SA)', row.designationStatus, row.recordStatus,
      row.locationAssessment, row.locationConfidence, row.country, row.province, row.city,
      row.title, row.employer, row.industry, row.industryBasis, row.industrySourceUrl, row.subIndustry, row.linkedinUrl,
      row.primarySource, row.sourceUrls.join(' | '), row.lastVerified, row.missingFields.join('; '),
    ].map(csvCell).join(','))
  }
  return `${lines.join('\n')}\n`
}

export function casaCoverageReport({ metrics }: CasaInventory): string {
  return `# CA(SA) research inventory — coverage and gaps

**This is not a complete register of all CA(SA)s in South Africa.** It is a derived snapshot of the existing Accounting & Finance research pool (\`people.jsonl\`), which covers in-scope finance roles, not all members or professions. No authoritative SAICA membership roster has been supplied; the total population and coverage percentage are **unknown**. Exporting does not re-check the underlying sources.

- CA(SA)-tagged, non-rejected research records: **${metrics.recorded}** (including records outside South Africa).
- Records labelled South Africa in the research DB: **${metrics.saLabelled}**. This is not a verified resident count: \`country\` may default to South Africa.
- Of SA-labelled records, designation confirmed in the recorded public evidence: **${metrics.designationConfirmed}**; designation needs further confirmation: **${metrics.designationNeedsReview}**. This does **not** establish currently active SAICA membership.
- SA-labelled location assessments: **${metrics.location.CONFIRMED_SA_LOCATION}** confirmed; **${metrics.location.HIGH_CONFIDENCE_SA_LOCATION}** high confidence (may be employer-based); **${metrics.location.SA_LOCATION_NOT_EVIDENCED}** not evidenced. **${metrics.location.OUTSIDE_SA}** additional records are explicitly outside South Africa; **${metrics.location.COUNTRY_UNKNOWN}** have no country.
- Latest recorded per-person source-check date in this subset: **${metrics.latestRecordCheck || 'unknown'}**. Titles and employers may have changed since their individual check dates.
- Industry supplied from an exact, uniquely named employer in the existing sourced company catalogue: **${metrics.industryFromEmployerCatalogue}** SA-labelled records. This is employer-sector context, **not a personally verified specialism**, and the company sources were not rechecked during export. Other industries come from the person research record.

## Missing details among SA-labelled records

| Field not recorded / not established | Records |
|---|---:|
| Title | ${metrics.missing.title} |
| Employer | ${metrics.missing.employer} |
| Industry | ${metrics.missing.industry} |
| LinkedIn profile URL | ${metrics.missing.linkedin} |
| SA location evidence | ${metrics.missing.saLocation} |

See [ca_sa_inventory.csv](./ca_sa_inventory.csv) for one row per recorded person, with a research ID, name, title, employer, industry (with basis and a separate employer source URL when derived), **actual** LinkedIn URL where recorded, sources, last-checked date, designation status and location assessment. Blank cells mean **unknown**, not "unemployed" or "no LinkedIn"; research titles explicitly marked "not stated" are exported as blank. The CSV also retains out-of-scope country rows, explicitly flagged, so they cannot silently inflate the SA total. It contains public professional information only; no contact details, ID numbers or inferred profile URLs.

## To work toward a genuinely complete account

1. Obtain a current, **authorised** SAICA member/registrant roster, with permission for this use and a scope definition (active vs inactive; resident vs employed in SA; reporting date). Do not scrape gated directories or LinkedIn.
2. Use the private \`npm run accountants:casa-reconcile\` workflow on a rights-cleared roster to account for **every supplied row** against the existing research pool. It links only an exact, curator-verified person-profile URL **and** matching name; name-only hits remain for human review. No roster has been supplied or processed here. Keep licensed data out of the public repository. Record unmatched people and ambiguous identities as gaps, not invented records.
3. For each matched person, verify designation, SA location, role, employer, industry and profile URL independently; store field-level sources and check dates. Allow corrections and removal requests, and recheck changing employment details on a defined cadence.
4. Only claim population coverage once the authorised roster, rights, inclusion rules, reconciliation outcomes and unmatched counts have been audited. Missing LinkedIn profiles cannot be manufactured to fill gaps.

Regenerate after updating the research DB with \`npm run accountants:casa-export\`. This report and CSV are derived artifacts; \`people.jsonl\` remains the source of truth.
`
}

function main(): void {
  const directory = join(resolve('.'), 'markets', 'accountants')
  const inventory = buildCasaInventory(
    readFileSync(join(directory, 'people.jsonl'), 'utf8'),
    readFileSync(join(directory, 'companies.jsonl'), 'utf8'),
  )
  writeFileSync(join(directory, 'ca_sa_inventory.csv'), casaInventoryCsv(inventory))
  writeFileSync(join(directory, 'ca_sa_coverage.md'), casaCoverageReport(inventory))
  process.stdout.write(`Exported ${inventory.metrics.recorded} CA(SA)-tagged research records (${inventory.metrics.saLabelled} SA-labelled; not a national register).\n`)
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  try {
    main()
  } catch (error: unknown) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`)
    process.exitCode = 1
  }
}
