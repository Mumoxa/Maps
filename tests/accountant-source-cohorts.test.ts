import test from 'node:test'
import assert from 'node:assert/strict'
import {
  accountantFacetDefs,
  accountantTextMatcher,
  type AccountantCandidate,
} from '../src/data/accountantsPeople'
import { filterByFacets } from '../src/data/facets'
import { adaptAccountantCandidate } from '../src/data/marketData/adapters'
import { buildCompanyIntelligence } from '../src/data/organizations/universe'

function candidate(overrides: Partial<AccountantCandidate> = {}): AccountantCandidate {
  return {
    id: 'test-person', fullName: 'Test Finance Person', status: 'RESEARCH_HOLD',
    confidence: 'RESEARCH_HOLD', roleScopeStatus: 'IN_SCOPE', professionallyQualified: 'unknown',
    designationStatus: 'UNCONFIRMED', qualificationConfidence: 'RESEARCH_HOLD',
    academicQualifications: [], designations: [], professionalRoutes: [], bodies: [],
    title: 'Financial Manager', employer: 'Test Primary Employer', currentCompanyAffiliations: [],
    seniority: 'Manager', roleFamily: 'Financial Management', function: 'Finance',
    industry: 'Construction', subIndustry: '', province: '', city: '', country: 'South Africa',
    locationConfidence: 'UNCONFIRMED', skills: [], accountingSystems: [], erpSystems: [],
    analyticsTools: [], yearsExperience: 'unknown', qualificationEvidence: 'Workbook-reported claim.',
    articlesStatus: 'NOT_ESTABLISHED', articlesEmployer: '', articlesBody: '', articlesPeriod: '',
    articlesLocation: '', practicalExperienceFramework: '', qualificationRoute: '', careerHistory: [],
    linkedinUrl: '', primarySource: 'https://example.test/source',
    sourceUrls: ['https://example.test/source'], dateLastVerified: '2026-10-22', notes: '',
    ...overrides,
  }
}

test('source cohort filters combine with CA designation without promoting unconfirmed candidates', () => {
  const records = [
    candidate({ id: 'ca', designations: ['CA(SA)'], attributes: { source_cohorts: ['MBAWC 2026-10-22'] } }),
    candidate({ id: 'not-ca', attributes: { source_cohorts: ['MBAWC 2026-10-22'] } }),
    candidate({ id: 'other-ca', designations: ['CA(SA)'] }),
  ]
  const found = filterByFacets({
    records, defs: accountantFacetDefs,
    selections: { sourceCohort: ['MBAWC 2026-10-22'], qualification: ['CA(SA)'] },
    query: '', textMatcher: accountantTextMatcher,
  })
  assert.deepEqual(found.map((person) => person.id), ['ca'])
})

test('public cohort text finds a person without needing a private client search name', () => {
  const person = candidate({ attributes: { source_cohorts: ['MBAWC 2026-10-22'] } })
  assert.equal(accountantTextMatcher(person, 'mbawc'), true)
})

test('global profile preserves searchable public source metadata and affiliation evidence only', () => {
  const affiliation = {
    company: 'Test Member Company', relationship: 'non-executive director',
    evidence_url: 'https://example.test/board',
  }
  const person = candidate({
    attributes: {
      source_cohorts: ['MBAWC 2026-10-22'], source_batch: 'mbawc-2026-10-22',
      search_name: 'PRIVATE CLIENT SEARCH', private_notes: 'PRIVATE SCREENING',
    },
    currentCompanyAffiliations: [affiliation],
  })
  const profile = adaptAccountantCandidate(person)
  assert.match(profile.summary, /MBAWC 2026-10-22/)
  assert.match(profile.summary, /Test Member Company/)
  assert.match(profile.summary, /non-executive director/)
  assert.deepEqual(profile.attributes.source_cohorts, ['MBAWC 2026-10-22'])
  assert.equal(profile.attributes.source_batch, 'mbawc-2026-10-22')
  assert.deepEqual(profile.attributes.currentCompanyAffiliations, [affiliation])
  assert.doesNotMatch(JSON.stringify(profile), /PRIVATE CLIENT SEARCH|PRIVATE SCREENING/)
})

test('workbook source-reported claims stay unverified and keep an unknown country unknown', () => {
  const profile = adaptAccountantCandidate(candidate({
    country: '',
    attributes: { source_reported: true, source_cohorts: ['MBAWC 2026-10-22'], search_name: 'PRIVATE CLIENT SEARCH' },
  }))
  assert.equal(profile.suppliedAsVerified, false)
  assert.equal(profile.attributes.source_reported, true)
  assert.equal(profile.location.country, '')
  assert.equal(profile.locationLabel, '')
  assert.doesNotMatch(JSON.stringify(profile), /PRIVATE CLIENT SEARCH/)
})

test('older research keeps its existing verification and default-country behavior', () => {
  const profile = adaptAccountantCandidate(candidate({ country: '' }))
  assert.equal(profile.suppliedAsVerified, true)
  assert.equal(profile.attributes.source_reported, undefined)
  assert.equal(profile.location.country, 'South Africa')
  assert.equal(profile.locationLabel, 'South Africa')
})

test('current affiliations resolve aliases and count one person once per organization', () => {
  const first = candidate({
    id: 'first', employer: 'Accelerate Property Fund Limited',
    currentCompanyAffiliations: [
      { company: 'APF', relationship: 'group company', evidence_url: 'https://example.test/group' },
      { company: 'Test Member Company', relationship: 'group finance oversight', evidence_url: 'https://example.test/group' },
      { company: 'Test Former Employer', relationship: 'former CFO', evidence_url: 'https://example.test/history' },
    ],
  })
  const second = candidate({ id: 'second', employer: 'Accelerate' })
  const board = candidate({
    id: 'board', employer: '',
    currentCompanyAffiliations: [
      { company: 'Test Board Company', relationship: 'non-executive director', evidence_url: 'https://example.test/board', employment: false },
      { company: 'Test Current Group Company', relationship: 'chairman; former group CFO', evidence_url: 'https://example.test/board', current: true, employment: false },
      { company: 'Test Explicit Historical Company', relationship: 'director', evidence_url: 'https://example.test/history', current: false },
    ],
  })
  const intelligence = buildCompanyIntelligence({ accountingFinanceCandidates: [first, second, board] })
  const count = (id: string) => intelligence.index.employersByOrg.get(id)
    ?.professionalSources.find((source) => source.dataset === 'accounting-finance')?.count
  assert.equal(count('org-accelerate'), 2)
  assert.equal(count('org-dataset:test member company'), 1)
  assert.equal(count('org-dataset:test board company'), 1)
  assert.equal(count('org-dataset:test current group company'), 1)
  assert.equal(count('org-dataset:test former employer'), undefined)
  assert.equal(count('org-dataset:test explicit historical company'), undefined)
})
