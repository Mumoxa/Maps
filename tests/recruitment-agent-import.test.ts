import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { accountantCandidates, accountantFacetDefs, accountantTextMatcher } from '../src/data/accountantsPeople'
import { adaptAccountantCandidate } from '../src/data/marketData/adapters'
import { buildCompanyIntelligence } from '../src/data/organizations/universe'
import { filterByFacets } from '../src/data/facets'

const batch = 'recruitment-agent-2026-10-24'
const cohort = 'Recruitment Agent 2026-10-23'
const auditPath = `markets/organizations/import-audits/${batch}.json`
function audit() {
  assert.ok(existsSync(auditPath), 'Recruitment Agent research must have an import audit')
  return JSON.parse(readFileSync(auditPath, 'utf8'))
}

test('candidate source rows resolve to eleven unique profiles with six additions and five enrichments', () => {
  const a = audit()
  assert.equal(a.people.length, 11)
  assert.equal(a.people.filter((p: { disposition: string }) => p.disposition === 'added').length, 6)
  assert.equal(a.people.filter((p: { disposition: string }) => p.disposition === 'enriched').length, 5)
  assert.equal(new Set(a.people.map((p: { personId: string }) => p.personId)).size, 11)
  const profiles = accountantCandidates.filter(p => p.attributes?.source_cohorts?.includes(cohort))
  assert.equal(profiles.length, 11)
  const identities = profiles.map(p => new URL(p.linkedinUrl).pathname.replace(/\/$/, '').toLowerCase())
  assert.equal(new Set(identities).size, 11)
  for (const identity of identities) {
    const sameIdentity = accountantCandidates.filter(p => [p.linkedinUrl, ...p.sourceUrls].some(url => {
      try { return new URL(url).hostname.endsWith('linkedin.com') && new URL(url).pathname.replace(/\/$/, '').toLowerCase() === identity }
      catch { return false }
    }))
    assert.equal(sameIdentity.length, 1, `Duplicate public identity: ${identity}`)
  }
})

test('reported qualifications remain attributed and unknown qualifications do not pass the CA filter', () => {
  audit()
  const profiles = accountantCandidates.filter(p => p.attributes?.source_cohorts?.includes(cohort))
  const unknown = new Set(['Ruard Nel', 'Shaun Williams'])
  for (const person of profiles) {
    assert.equal(adaptAccountantCandidate(person).suppliedAsVerified, false)
    assert.match(person.qualificationEvidence, /not independently|not confirmed active/i)
    assert.match(person.dateLastVerified, /^\d{4}-\d{2}-\d{2}$/)
    assert.ok(person.dateLastVerified <= '2026-10-23', 'Transfer date must not masquerade as a fresh external check')
    if (unknown.has(person.fullName)) {
      assert.deepEqual(person.designations, [])
      assert.equal(person.professionallyQualified, 'unknown')
    }
  }
  const selected = filterByFacets({ records: profiles, defs: accountantFacetDefs,
    selections: { sourceCohort: [cohort], qualification: ['CA(SA)'] }, query: '', textMatcher: accountantTextMatcher })
  assert.equal(selected.length, 9)
  assert.ok(selected.every(p => !unknown.has(p.fullName)))
})

test('every employer row resolves to a canonical company and retains attributed source evidence', () => {
  const a = audit()
  const { index } = buildCompanyIntelligence({ accountingFinanceCandidates: accountantCandidates })
  assert.equal(a.companies.length, 27)
  for (const row of a.companies) {
    const company = index.byId.get(row.organizationId)
    assert.ok(company, `Missing employer: ${row.sourceName}`)
    assert.ok(company.sources.some(s => s.type === 'recruiter-supplied' && s.url.includes(batch)))
  }
  for (const row of a.people) {
    const employer = index.employersByOrg.get(row.organizationId)
    assert.ok(employer?.professionalSources.some(s => s.dataset === 'accounting-finance' && s.count > 0))
  }
})

test('public evidence snapshot omits internal contact outcomes and records source structure repairs', () => {
  const a = audit()
  const source = readFileSync(a.sourceArchive, 'utf8')
  assert.doesNotMatch(source, /too expensive|Nico Fourie|Quintin Oosthuizen|To Contact|SLM - Head of Finance|Excluded per instruction/)
  assert.equal(a.sourceCandidateRows, 11)
  assert.equal(a.sourceClaimedCandidateCount, 12)
  assert.equal(a.repairs.candidateRowsMissingScreeningColumn.length, 7)
  assert.equal(a.repairs.companyRowsWithUnquotedCommas.length, 5)
})

test('source-reported geography cannot replace stronger previously confirmed personal geography', () => {
  const a = audit()
  const rows = readFileSync('markets/accountants/people.jsonl', 'utf8').trim().split('\n').map(line => JSON.parse(line))
  const byId = new Map(rows.map(row => [row.id, row]))
  for (const imported of a.people) {
    const row = byId.get(imported.personId)!
    const previous = row.pre_recruitment_agent_record
    if (previous?.location_confidence === 'CONFIRMED') {
      for (const field of ['country', 'province', 'city']) assert.equal(row[field], previous[field])
    }
    assert.ok(row.source_records.every((source: { file: string, sheet: string, row: number }) => source.file && source.sheet && source.row))
  }
})

test('replaying the source import is a no-op', () => {
  audit()
  const result = spawnSync(process.platform === 'win32' ? 'python' : 'python3', ['scripts/import_recruitment_agent.py'], { encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /No changes/)
})
