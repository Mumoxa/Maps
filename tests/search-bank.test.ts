import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  clean,
  candidateId,
  inferSeniority,
  normaliseQualification,
  parseCsvRows,
  parseDrop,
  parseLocation,
  parseRating,
  parseYears,
  searchIdFor,
  splitList,
  splitQualifications,
} from '../src/data/searchBank/normalise'
import { candidatesToCsv, emptyBank, ingestDrop } from '../src/data/searchBank/ingest'
import { importSearchBank } from '../scripts/import-search-bank'
import { filterByFacets, readSelections, toggleValue, writeSelections } from '../src/data/facets'
import {
  bankCandidates,
  bankSearches,
  searchBankFacetDefs,
  searchName,
  searchNameLookup,
  searchBankTextMatcher,
} from '../src/data/searchBank/bank'
import bankRaw from '../markets/search-bank/bank.json'

const TODAY = '2026-10-07'

function ingest(csv: string, bank = emptyBank(TODAY), options: Record<string, string> = {}) {
  return ingestDrop(csv, { bank, today: TODAY, fileName: 'drop.csv', source: 'drop.csv', ...options })
}

/** Resolve a search id to its name inside the bank a test just built. */
function nameOf(bank: { searches: { id: string; name: string }[] }) {
  return searchNameLookup(bank.searches)
}

const TWO_CANDIDATES = [
  'search,client,name,title,company,location,skills,qualifications,experience,availability,rating,status,tags',
  'Credit Risk Manager — FirstRand,FirstRand,Thabo Mokoena,Credit Risk Manager,Example Bank,"Sandton, Gauteng",Credit risk;PD modelling,"BCom (Hons);CA(SA)",8 years,1 month,4,shortlisted,priority',
  'Credit Risk Manager — FirstRand,FirstRand,Sarah van Wyk,Senior Credit Analyst,Example Insurer,"Cape Town, Western Cape",IFRS 9,BSc,5,immediately,3,,',
].join('\n')

// ---------------------------------------------------------------------------
// Normalisation primitives
// ---------------------------------------------------------------------------

test('splitList keeps C# intact, trims, and de-duplicates case-insensitively', () => {
  assert.deepEqual(splitList('Credit risk; PD modelling ; C#, SQL; credit RISK'), [
    'Credit risk',
    'PD modelling',
    'C#',
    'SQL',
  ])
  assert.deepEqual(splitList('A | B\nC • D'), ['A', 'B', 'C', 'D'])
})

test('splitQualifications only splits commas between known qualifications', () => {
  assert.deepEqual(splitQualifications('bcom hons; ca(sa)'), ['BCom (Hons)', 'CA(SA)'])
  assert.deepEqual(splitQualifications('BCom, University of Cape Town'), ['BCom, University of Cape Town'])
  assert.deepEqual(splitQualifications('MBA, ACCA'), ['MBA', 'ACCA'])
})

test('normaliseQualification canonicalises known spellings and passes the rest through', () => {
  assert.equal(normaliseQualification('bcom'), 'BCom')
  assert.equal(normaliseQualification('ca(sa)'), 'CA(SA)')
  assert.equal(normaliseQualification('BCom Honours'), 'BCom (Hons)')
  assert.equal(normaliseQualification('SAP Certified Application Associate'), 'SAP Certified Application Associate')
})

test('parseLocation splits city, province and country', () => {
  assert.deepEqual(parseLocation('Cape Town, Western Cape'), {
    city: 'Cape Town',
    province: 'Western Cape',
    country: 'South Africa',
  })
  assert.deepEqual(parseLocation('Sandton, Gauteng, SA'), {
    city: 'Sandton',
    province: 'Gauteng',
    country: 'South Africa',
  })
  assert.deepEqual(parseLocation('Johannesburg'), { city: 'Johannesburg', province: 'Gauteng', country: 'South Africa' })
  assert.deepEqual(parseLocation('London, UK'), { city: 'London', province: '', country: 'United Kingdom' })
  assert.deepEqual(parseLocation('Durban, KZN'), { city: 'Durban', province: 'KwaZulu-Natal', country: 'South Africa' })
  assert.deepEqual(parseLocation(''), { city: '', province: '', country: 'South Africa' })
})

test('inferSeniority reads the title ladder and defaults to Not stated', () => {
  assert.equal(inferSeniority('Chief Risk Officer'), 'C-suite')
  assert.equal(inferSeniority('VP Credit'), 'VP')
  assert.equal(inferSeniority('Head of Credit Risk'), 'Head')
  assert.equal(inferSeniority('Credit Risk Director'), 'Director')
  assert.equal(inferSeniority('Credit Risk Manager'), 'Lead / Manager')
  assert.equal(inferSeniority('Senior Credit Analyst'), 'Senior')
  assert.equal(inferSeniority('Credit Analyst'), 'Mid')
  assert.equal(inferSeniority('Junior Analyst'), 'Junior')
  assert.equal(inferSeniority('Graduate Analyst'), 'Intern / Graduate')
  assert.equal(inferSeniority('Wizard'), 'Not stated')
})

test('parseYears and parseRating accept the ways recruiters type them', () => {
  assert.equal(parseYears('8 years'), 8)
  assert.equal(parseYears('10+'), 10)
  assert.equal(parseYears('n/a'), null)
  assert.equal(parseRating('4'), 4)
  assert.equal(parseRating('4/5'), 4)
  assert.equal(parseRating('80%'), 4)
  assert.equal(parseRating('9'), null)
  assert.equal(parseRating('good'), null)
})

test('parseCsvRows honours quoting, escaped quotes and embedded newlines', () => {
  const rows = parseCsvRows('a,b\n"one, two","say ""hi"""\n"line1\nline2",x\n')
  assert.deepEqual(rows, [
    ['a', 'b'],
    ['one, two', 'say "hi"'],
    ['line1\nline2', 'x'],
  ])
})

test('stable ids: the same person and search always produce the same candidate id', () => {
  const id = candidateId('search-credit-risk', 'Thabo Mokoena')
  assert.equal(id, candidateId('search-credit-risk', 'thabo  mokoena'))
  assert.notEqual(id, candidateId('search-sap-fico', 'Thabo Mokoena'))
  assert.equal(searchIdFor('Credit Risk Manager — FirstRand'), 'search-credit-risk-manager-firstrand')
})

// ---------------------------------------------------------------------------
// Drop parsing: three formats, one shape
// ---------------------------------------------------------------------------

test('parseDrop reads a CSV drop and maps header aliases', () => {
  const result = parseDrop('Full Name,Job Title\nThabo Mokoena,Credit Risk Manager\n', 'x.csv')
  assert.equal(result.format, 'csv')
  assert.deepEqual(result.rows, [{ fullName: 'Thabo Mokoena', title: 'Credit Risk Manager' }])
})

test('parseDrop reads a JSON drop, including an array-valued field', () => {
  const result = parseDrop('[{"name":"Thabo Mokoena","skills":["Credit risk","PD"]}]', 'x.json')
  assert.equal(result.format, 'json')
  assert.deepEqual(result.rows, [{ fullName: 'Thabo Mokoena', skills: 'Credit risk; PD' }])
})

test('parseDrop reads pasted Key: value blocks, including a bare name line', () => {
  const text = 'Thabo Mokoena\nTitle: Credit Risk Manager\nCompany: Example Bank\nSkills: Credit risk\n  Portfolio management\n\nSarah van Wyk\nTitle: Credit Analyst\n'
  const result = parseDrop(text, 'pasted.txt')
  assert.equal(result.format, 'text')
  assert.equal(result.rows.length, 2)
  assert.equal(result.rows[0].fullName, 'Thabo Mokoena')
  assert.equal(result.rows[0].skills, 'Credit risk Portfolio management')
  assert.equal(result.rows[1].title, 'Credit Analyst')
})

test('parseDrop reads a headerless table positionally as name and title, and says so', () => {
  const result = parseDrop('Thabo Mokoena,Credit Risk Manager\nSarah van Wyk,Senior Credit Analyst\n', 'x.csv')
  assert.equal(result.format, 'csv')
  assert.deepEqual(result.rows, [
    { fullName: 'Thabo Mokoena', title: 'Credit Risk Manager' },
    { fullName: 'Sarah van Wyk', title: 'Senior Credit Analyst' },
  ])
  assert.ok(result.issues.some((issue) => /no header row/.test(issue.reason)))
})

test('parseDrop reads a plain list of names as one record per line', () => {
  const result = parseDrop('Thabo Mokoena\nSarah van Wyk\nLerato Ndlovu\n', 'names.txt')
  assert.equal(result.rows.length, 3)
  assert.deepEqual(result.rows.map((row) => row.fullName), ['Thabo Mokoena', 'Sarah van Wyk', 'Lerato Ndlovu'])
})

test('parseDrop reports an unusable drop instead of returning junk', () => {
  const result = parseDrop('   ', 'empty.csv')
  assert.deepEqual(result.rows, [])
  assert.equal(result.issues.length, 1)
})

// ---------------------------------------------------------------------------
// Merging into the bank
// ---------------------------------------------------------------------------

test('a drop files candidates under searches, creating the searches it names', () => {
  const { bank, report } = ingest(TWO_CANDIDATES)
  assert.equal(report.added, 2)
  assert.deepEqual(report.searchesCreated, ['Credit Risk Manager — FirstRand'])
  assert.equal(bank.searches.length, 1)
  assert.equal(bank.searches[0].client, 'FirstRand')
  assert.equal(bank.searches[0].status, 'active')
  assert.equal(bank.candidates.length, 2)
  assert.equal(nameOf(bank)(bank.candidates[0].searchId), 'Credit Risk Manager — FirstRand')
})

test('a drop transforms every row onto the uniform record shape', () => {
  const { bank } = ingest(TWO_CANDIDATES)
  const thabo = bank.candidates.find((candidate) => candidate.fullName === 'Thabo Mokoena')
  assert.ok(thabo)
  assert.deepEqual(thabo, {
    id: thabo.id,
    searchId: 'search-credit-risk-manager-firstrand',
    fullName: 'Thabo Mokoena',
    title: 'Credit Risk Manager',
    seniority: 'Lead / Manager',
    employer: 'Example Bank',
    location: { city: 'Sandton', province: 'Gauteng', country: 'South Africa' },
    locationLabel: 'Sandton, Gauteng, South Africa',
    skills: ['Credit risk', 'PD modelling'],
    qualifications: ['BCom (Hons)', 'CA(SA)'],
    experienceYears: 8,
    availability: '1 month notice',
    email: '',
    phone: '',
    profileUrl: '',
    rating: 4,
    status: 'shortlisted',
    tags: ['priority'],
    notes: '',
    source: 'drop.csv',
    addedOn: TODAY,
    updatedOn: TODAY,
  })
  const sarah = bank.candidates.find((candidate) => candidate.fullName === 'Sarah van Wyk')
  assert.equal(sarah?.seniority, 'Senior')
  assert.equal(sarah?.availability, 'Immediate')
  assert.equal(sarah?.status, 'new')
  assert.equal(sarah?.rating, 3)
})

test('re-dropping the same candidates updates them in place and never duplicates', () => {
  const first = ingest(TWO_CANDIDATES)
  const second = ingest(TWO_CANDIDATES, first.bank, { today: '2026-10-08' } as Record<string, string>)
  assert.equal(second.report.added, 0)
  assert.equal(second.report.updated, 2)
  assert.equal(second.bank.candidates.length, 2)
  assert.equal(second.bank.searches.length, 1)
  const thabo = second.bank.candidates.find((candidate) => candidate.fullName === 'Thabo Mokoena')
  assert.equal(thabo?.addedOn, TODAY)
  assert.equal(thabo?.updatedOn, '2026-10-08')
})

test('a changed value wins, and blank columns never wipe stored data', () => {
  const first = ingest(TWO_CANDIDATES)
  const changed = [
    'search,name,title,company,skills,rating',
    'Credit Risk Manager — FirstRand,Thabo Mokoena,Head of Credit Risk,,,5',
  ].join('\n')
  const second = ingestDrop(changed, {
    bank: first.bank,
    today: '2026-10-08',
    fileName: 'update.csv',
  })
  const thabo = second.bank.candidates.find((candidate) => candidate.fullName === 'Thabo Mokoena')
  assert.equal(thabo?.title, 'Head of Credit Risk')
  assert.equal(thabo?.seniority, 'Head')
  assert.equal(thabo?.rating, 5)
  assert.equal(thabo?.employer, 'Example Bank')
  assert.equal(thabo?.skills.length, 2)
})

test('the same person filed under two searches is kept under both and flagged', () => {
  const first = ingest(TWO_CANDIDATES)
  const other = [
    'search,name,title',
    'SAP FICO Consultant — Retail,Thabo Mokoena,SAP FICO Consultant',
  ].join('\n')
  const second = ingestDrop(other, { bank: first.bank, today: TODAY, fileName: 'other.csv' })
  assert.equal(second.report.added, 1)
  assert.deepEqual(second.report.crossSearchMatches, ['Thabo Mokoena'])
  assert.equal(second.bank.candidates.length, 3)
  assert.equal(second.bank.searches.length, 2)
})

test('unusable rows are skipped with a reason instead of poisoning the bank', () => {
  const messy = [
    'search,name,title,rating,experience',
    'Credit Risk Manager — FirstRand,,No Name,4,5',
    'Credit Risk Manager — FirstRand,Sarah van Wyk,Credit Analyst,nine,soon',
    'Credit Risk Manager — FirstRand,Thabo Mokoena,Credit Risk Manager,4,8',
  ].join('\n')
  const { bank, report } = ingest(messy)
  assert.equal(report.added, 2)
  assert.equal(bank.candidates.length, 2)
  const sarah = bank.candidates.find((candidate) => candidate.fullName === 'Sarah van Wyk')
  assert.equal(sarah?.rating, null)
  assert.equal(sarah?.experienceYears, null)
  assert.ok(report.issues.some((issue) => issue.field === 'fullName'))
  assert.ok(report.issues.some((issue) => issue.field === 'rating'))
  assert.ok(report.issues.some((issue) => issue.field === 'experienceYears'))
})

test('a row with no search anywhere is skipped and explained', () => {
  const { report } = ingest('name,title\nSarah van Wyk,Credit Analyst\n')
  assert.equal(report.added, 0)
  assert.ok(report.issues.some((issue) => issue.field === 'searchName'))
})

// ---------------------------------------------------------------------------
// Retrieval: facets over the bank
// ---------------------------------------------------------------------------

test('candidates are retrievable by search, status, skill and free text', () => {
  const { bank } = ingest(TWO_CANDIDATES)
  const defs = searchBankFacetDefs

  const bySearch = filterByFacets({
    records: bank.candidates,
    defs,
    selections: { search: ['search-credit-risk-manager-firstrand'] },
  })
  assert.equal(bySearch.length, 2)

  const byStatus = filterByFacets({
    records: bank.candidates,
    defs,
    selections: { status: ['shortlisted'] },
  })
  assert.deepEqual(byStatus.map((candidate) => candidate.fullName), ['Thabo Mokoena'])

  const bySkill = filterByFacets({
    records: bank.candidates,
    defs,
    selections: { skill: ['IFRS 9'] },
  })
  assert.deepEqual(bySkill.map((candidate) => candidate.fullName), ['Sarah van Wyk'])

  const byText = filterByFacets({
    records: bank.candidates,
    defs,
    selections: {},
    query: 'example insurer',
    textMatcher: searchBankTextMatcher,
  })
  assert.deepEqual(byText.map((candidate) => candidate.fullName), ['Sarah van Wyk'])

  const byProvince = filterByFacets({
    records: bank.candidates,
    defs,
    selections: { province: ['Western Cape'] },
  })
  assert.deepEqual(byProvince.map((candidate) => candidate.fullName), ['Sarah van Wyk'])
})

test('facet selections round-trip through the URL', () => {
  const params = new URLSearchParams()
  const written = writeSelections(params, { search: ['search-a', 'search-b'], status: [] })
  assert.equal(written.get('search'), 'search-a,search-b')
  assert.equal(written.get('status'), null)
  const readBack = readSelections(written, [{ key: 'search' }, { key: 'status' }])
  assert.deepEqual(readBack.search, ['search-a', 'search-b'])
  assert.deepEqual(readBack.status, [])
  const toggled = toggleValue(readBack, 'search', 'search-a')
  assert.deepEqual(toggled.search, ['search-b'])
})

test('the bank exports back out as the same uniform shape', () => {
  const { bank } = ingest(TWO_CANDIDATES)
  const csv = candidatesToCsv(bank.candidates, nameOf(bank))
  const lines = csv.trim().split('\n')
  assert.equal(lines[0], 'search,fullName,title,seniority,employer,locationLabel,skills,qualifications,experienceYears,availability,email,phone,profileUrl,rating,status,tags,notes,source,addedOn,updatedOn')
  assert.equal(lines.length, 3)
  assert.ok(csv.includes('"Sandton, Gauteng, South Africa"'))
  assert.ok(csv.includes('Credit risk; PD modelling'))
})

// ---------------------------------------------------------------------------
// CLI importer
// ---------------------------------------------------------------------------

function cliFixture() {
  const rootDir = mkdtempSync(join(tmpdir(), 'maps-bank-'))
  const filePath = join(rootDir, 'drop.csv')
  writeFileSync(filePath, `${TWO_CANDIDATES}\n`)
  return { rootDir, filePath }
}

test('the CLI writes the bank and keeps an audit of the drop', async () => {
  const { rootDir, filePath } = cliFixture()
  const result = await importSearchBank({ rootDir, filePath, today: TODAY })

  assert.equal(result.status, 'imported')
  const bank = JSON.parse(readFileSync(result.bankPath, 'utf8'))
  assert.equal(bank.candidates.length, 2)
  assert.equal(bank.searches.length, 1)
  assert.equal(bank.schemaVersion, 1)
  assert.ok(result.dropPath && existsSync(result.dropPath))
  const drop = JSON.parse(readFileSync(result.dropPath, 'utf8'))
  assert.equal(drop.sourceFile, 'drop.csv')
  assert.equal(drop.added, 2)
})

test('the CLI updates the existing bank instead of duplicating candidates', async () => {
  const { rootDir, filePath } = cliFixture()
  await importSearchBank({ rootDir, filePath, today: TODAY })
  const second = await importSearchBank({ rootDir, filePath, today: '2026-10-08' })

  assert.equal(second.status, 'imported')
  assert.equal(second.report.updated, 2)
  const bank = JSON.parse(readFileSync(second.bankPath, 'utf8'))
  assert.equal(bank.candidates.length, 2)
  assert.equal(bank.candidates[0].addedOn, TODAY)
  assert.equal(bank.candidates[0].updatedOn, '2026-10-08')
})

test('the CLI reports an identical drop as unchanged and writes nothing new', async () => {
  const { rootDir, filePath } = cliFixture()
  await importSearchBank({ rootDir, filePath, today: TODAY })
  const second = await importSearchBank({ rootDir, filePath, today: TODAY })
  assert.equal(second.status, 'unchanged')
  assert.equal(second.dropPath, null)
})

test('the CLI dry-run normalises without writing', async () => {
  const { rootDir, filePath } = cliFixture()
  const result = await importSearchBank({ rootDir, filePath, today: TODAY, dryRun: true })
  assert.equal(result.status, 'dry-run')
  assert.equal(existsSync(result.bankPath), false)
  assert.equal(result.report.added, 2)
})

test('the CLI refuses a drop it cannot store', async () => {
  const rootDir = mkdtempSync(join(tmpdir(), 'maps-bank-'))
  const filePath = join(rootDir, 'junk.csv')
  writeFileSync(filePath, 'name,title\n,No name\n')
  await assert.rejects(importSearchBank({ rootDir, filePath, today: TODAY }), /no candidates could be stored/)
  assert.equal(existsSync(join(rootDir, 'markets', 'search-bank', 'bank.json')), false)
})

test('the CLI applies --search to a drop that does not name one', async () => {
  const rootDir = mkdtempSync(join(tmpdir(), 'maps-bank-'))
  const filePath = join(rootDir, 'pasted.txt')
  writeFileSync(filePath, 'Thabo Mokoena\nTitle: Credit Risk Manager\nCompany: Example Bank\n')
  const result = await importSearchBank({
    rootDir,
    filePath,
    today: TODAY,
    defaultSearch: 'Credit Risk Manager — FirstRand',
    defaultClient: 'FirstRand',
  })
  assert.equal(result.report.added, 1)
  const bank = JSON.parse(readFileSync(result.bankPath, 'utf8'))
  assert.equal(bank.searches[0].name, 'Credit Risk Manager — FirstRand')
  assert.equal(bank.searches[0].client, 'FirstRand')
  assert.equal(bank.candidates[0].title, 'Credit Risk Manager')
})

// ---------------------------------------------------------------------------
// The committed bank file
// ---------------------------------------------------------------------------

test('the committed bank file matches the schema the UI loads', () => {
  const bank = bankRaw as { schemaVersion: number; generatedOn: string; searches: unknown[]; candidates: unknown[] }
  assert.equal(bank.schemaVersion, 1)
  assert.match(bank.generatedOn, /^\d{4}-\d{2}-\d{2}$/)
  assert.ok(Array.isArray(bank.searches))
  assert.ok(Array.isArray(bank.candidates))
  assert.equal(bankSearches.length, bank.searches.length)
  assert.equal(bankCandidates.length, bank.candidates.length)
  assert.equal(clean(searchName('search-missing')), 'search-missing')
})

test('every bank facet key is unique and safe on a record with nothing filled in', () => {
  const keys = searchBankFacetDefs.map((def) => def.key)
  assert.equal(new Set(keys).size, keys.length)
  const { bank } = ingest('search,name\nCredit Risk Manager — FirstRand,Skeleton Record\n')
  for (const def of searchBankFacetDefs) {
    for (const value of def.accessor(bank.candidates[0])) {
      assert.equal(typeof value, 'string')
      assert.ok(value.length > 0)
    }
  }
})
