import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { parse } from 'csv-parse/sync'
import { buildCasaInventory, casaCoverageReport, casaInventoryCsv } from '../scripts/export-casa-inventory'

function person(overrides: Record<string, unknown> = {}) {
  return {
    id: 'acc-0001',
    full_name: 'A Person',
    status: 'CONFIRMED',
    professional_designations: ['CA(SA)'],
    designation_status: 'CONFIRMED',
    country: 'South Africa',
    location_confidence: 'CONFIRMED',
    province: 'Gauteng',
    city: 'Johannesburg',
    current_title: 'Accountant',
    current_employer: 'Employer',
    current_industry: 'Financial Services',
    linkedin_url: 'https://www.linkedin.com/in/a-person/',
    primary_source: 'https://example.org/biography',
    source_urls: ['https://example.org/biography'],
    date_last_verified: '2026-09-18',
    ...overrides,
  }
}

function jsonl(...rows: Record<string, unknown>[]) {
  return rows.map((row) => JSON.stringify(row)).join('\n')
}

test('an inventory distinguishes confirmed designation, geography uncertainty and explicit exclusions', () => {
  const inventory = buildCasaInventory(jsonl(
    person(),
    person({ id: 'acc-0002', full_name: 'B Person', status: 'HIGH_CONFIDENCE', designation_status: 'HIGH_CONFIDENCE',
      location_confidence: 'HIGH', current_title: 'Not stated in snippet', current_employer: null, current_industry: null, linkedin_url: null }),
    person({ id: 'acc-0003', full_name: 'C Person', location_confidence: 'UNCONFIRMED', linkedin_url: null }),
    person({ id: 'acc-0004', full_name: 'D Person', country: 'Portugal', location_confidence: 'HIGH', linkedin_url: null }),
    person({ id: 'acc-0005', full_name: 'E Person', country: null, linkedin_url: null }),
    person({ id: 'acc-0006', full_name: 'Not designated', professional_designations: [],
      linkedin_url: 'https://www.linkedin.com/in/ca-sa-someone/' }),
    person({ id: 'acc-0007', full_name: 'Rejected', status: 'REJECTED' }),
  ))
  assert.equal(inventory.metrics.recorded, 5)
  assert.equal(inventory.metrics.saLabelled, 3)
  assert.equal(inventory.metrics.designationConfirmed, 2)
  assert.equal(inventory.metrics.designationNeedsReview, 1)
  assert.deepEqual(inventory.metrics.location, {
    CONFIRMED_SA_LOCATION: 1,
    HIGH_CONFIDENCE_SA_LOCATION: 1,
    SA_LOCATION_NOT_EVIDENCED: 1,
    OUTSIDE_SA: 1,
    COUNTRY_UNKNOWN: 1,
  })
  assert.deepEqual(inventory.metrics.missing, { title: 1, employer: 1, industry: 1, linkedin: 2, saLocation: 1 })
  assert.equal(inventory.rows[1].title, '')
  assert.equal(inventory.rows[1].linkedinUrl, '')
  assert.ok(inventory.rows[2].missingFields.includes('sa_location'))
  assert.match(casaCoverageReport(inventory), /not a complete register/i)
})

test('CSV is source-linked, escaped, spreadsheet-safe and leaves unknowns blank', () => {
  const source = person({ full_name: 'A, "Person"', current_title: 'Senior\nAccountant',
    current_employer: '=HYPERLINK("https://evil.example")', linkedin_url: null })
  const inventory = buildCasaInventory(jsonl(source))
  const [row] = parse(casaInventoryCsv(inventory), { columns: true }) as Record<string, string>[]
  assert.equal(row.name, 'A, "Person"')
  assert.equal(row.title, 'Senior\nAccountant')
  assert.equal(row.employer, "'=HYPERLINK(\"https://evil.example\")")
  assert.equal(row.industry_basis, 'PERSON_RECORD')
  assert.equal(row.industry_source_url, '')
  assert.equal(row.linkedin_url, '')
  assert.equal(row.primary_source, 'https://example.org/biography')
  assert.equal(row.source_urls, 'https://example.org/biography')
  assert.equal(row.missing_fields, 'linkedin')
  assert.equal(row.last_verified, '2026-09-18')
})

test('only an exact sourced employer supplies a missing industry, never a person specialism', () => {
  const personWithoutIndustry = person({ current_industry: '', current_employer: 'Example Ltd' })
  const catalogue = JSON.stringify({ company_name: 'Example Ltd', industry: 'Manufacturing', source_urls: ['https://example.org/company'] })
  const enriched = buildCasaInventory(jsonl(personWithoutIndustry), catalogue)
  assert.equal(enriched.rows[0].industry, 'Manufacturing')
  assert.equal(enriched.rows[0].industryBasis, 'EMPLOYER_CATALOGUE')
  assert.equal(enriched.rows[0].industrySourceUrl, 'https://example.org/company')
  assert.equal(enriched.metrics.industryFromEmployerCatalogue, 1)
  assert.equal(enriched.metrics.missing.industry, 0)
  const original = buildCasaInventory(jsonl(personWithoutIndustry), JSON.stringify({
    company_name: 'Example Limited', industry: 'Manufacturing', source_urls: ['https://example.org/company'],
  }))
  assert.equal(original.rows[0].industry, '')
  assert.equal(original.rows[0].industryBasis, 'UNKNOWN')
  const unsourced = buildCasaInventory(jsonl(personWithoutIndustry), JSON.stringify({
    company_name: 'Example Ltd', industry: 'Manufacturing', source_urls: [],
  }))
  assert.equal(unsourced.rows[0].industry, '')
  const ambiguous = buildCasaInventory(jsonl(personWithoutIndustry), `${catalogue}\n${catalogue}`)
  assert.equal(ambiguous.rows[0].industry, '')
  const recorded = buildCasaInventory(jsonl(person({ current_industry: 'Accounting', current_employer: 'Example Ltd' })), catalogue)
  assert.equal(recorded.rows[0].industry, 'Accounting')
  assert.equal(recorded.rows[0].industryBasis, 'PERSON_RECORD')
})

test('the export fails closed on duplicate identities and unsupported evidence URLs', () => {
  assert.throws(() => buildCasaInventory(jsonl(person(), person({ id: 'acc-0001' }))), /duplicate research id/)
  assert.throws(() => buildCasaInventory(jsonl(person(), person({ id: 'acc-0002', linkedin_url: 'https:\/\/za.linkedin.com\/in\/a-person' }))), /duplicate LinkedIn identity/)
  assert.throws(() => buildCasaInventory(jsonl(person({ linkedin_url: 'https://linkedin.com/company/not-a-person' }))), /invalid|person profile URL/)
  assert.throws(() => buildCasaInventory(jsonl(person({ source_urls: [] }))), /missing source_urls/)
  assert.throws(() => buildCasaInventory(jsonl(person({ primary_source: 'javascript:alert(1)' }))), /invalid primary_source/)
  assert.throws(() => buildCasaInventory(jsonl(person({ date_last_verified: '2026-02-30' }))), /invalid date_last_verified/)
})

test('committed inventory mirrors the research DB and published accounting pool', () => {
  const base = resolve('markets/accountants')
  const inventory = buildCasaInventory(
    readFileSync(resolve(base, 'people.jsonl'), 'utf8'),
    readFileSync(resolve(base, 'companies.jsonl'), 'utf8'),
  )
  const published = JSON.parse(readFileSync(resolve(base, 'people.json'), 'utf8')) as Array<{
    id: string; designations: string[]
  }>
  const publishedIds = published.filter((row) => row.designations.includes('CA(SA)')).map((row) => row.id).sort()
  assert.deepEqual(inventory.rows.map((row) => row.researchId).sort(), publishedIds)
  assert.equal(readFileSync(resolve(base, 'ca_sa_inventory.csv'), 'utf8'), casaInventoryCsv(inventory))
  assert.equal(readFileSync(resolve(base, 'ca_sa_coverage.md'), 'utf8'), casaCoverageReport(inventory))
})
