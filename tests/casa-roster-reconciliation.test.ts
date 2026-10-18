import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'
import { parse } from 'csv-parse/sync'
import { csvCell } from '../scripts/export-casa-inventory'
import { parseRosterCsv, readCasaResearchPeople, reconcileCasaRoster, reconciliationCsv } from '../scripts/reconcile-casa-roster'

const metadata = { sourceReference: 'approved-test', scope: 'resident-in-sa' as const, asOf: '2026-10-14' }

function research(overrides: Record<string, unknown> = {}) {
  return {
    id: 'acc-0001', fullName: 'A Person', status: 'CONFIRMED', designationStatus: 'CONFIRMED',
    designations: ['CA(SA)'], title: 'Accountant', employer: 'Example Employer',
    industry: 'Accounting', country: 'South Africa', locationConfidence: 'CONFIRMED',
    linkedinUrl: 'https://www.linkedin.com/in/a-person/', dateLastVerified: '2026-09-20',
    ...overrides,
  }
}

test('strict two-column roster parser never accepts IDs/contact details or invalid profile links', () => {
  const csv = '\ufefffull_name,public_profile_url\nA Person,https://za.linkedin.com/in/A-Person/?trk=search\nA Person,\n'
  assert.deepEqual(parseRosterCsv(csv), [
    { rowNumber: 2, fullName: 'A Person', publicProfileUrl: 'https://www.linkedin.com/in/a-person' },
    { rowNumber: 3, fullName: 'A Person', publicProfileUrl: '' },
  ])
  assert.throws(() => parseRosterCsv('full_name,public_profile_url,saica_member_number\nA Person,,012345\n'), /exactly/)
  assert.throws(() => parseRosterCsv('full_name,public_profile_url\nA Person,https://linkedin.com/company/example\n'), /person profile URL/)
  assert.throws(() => parseRosterCsv('full_name,public_profile_url\nA Person,https://linkedin.com/in/a-person\nB Person,https://za.linkedin.com/in/a-person/\n'), /duplicate public profile URL/)
  assert.throws(() => parseRosterCsv('full_name,public_profile_url\nA Person\n'), /Invalid roster CSV/)
  assert.throws(() => parseRosterCsv('full_name,public_profile_url\n'), /no people/)
})

test('every roster row is accounted for, without automatically matching a name alone', () => {
  const roster = parseRosterCsv([
    'full_name,public_profile_url',
    'A Person,https://za.linkedin.com/in/a-person/',
    'A Person,',
    'B Person,https://www.linkedin.com/in/not-their-profile',
    'Unknown Person,',
  ].join('\n'))
  const result = reconcileCasaRoster(roster, [research(), research({ id: 'acc-0002', fullName: 'B Person', linkedinUrl: '' })], metadata)
  assert.equal(result.summary.suppliedRows, 4)
  assert.deepEqual(result.rows.map((row) => row.identityStatus), [
    'PROFILE_AND_NAME_MATCH', 'NAME_ONLY_REVIEW', 'PROFILE_NOT_FOUND_NAME_REVIEW', 'NOT_IN_MAP',
  ])
  assert.deepEqual(result.rows.map((row) => row.researchId), ['acc-0001', '', '', ''])
  assert.deepEqual(result.rows[1].possibleResearchIds, ['acc-0001'])
  assert.deepEqual(result.rows[2].possibleResearchIds, ['acc-0002'])
  assert.equal(result.rows[1].employer, '')
  assert.deepEqual(result.summary.missingAmongLinked, { title: 0, employer: 0, industry: 0 })
  assert.equal(result.summary.linkedByProfileAndName, 1)
  assert.equal(result.summary.needsIdentityReview, 2)
  assert.equal(result.summary.notInMap, 1)
  assert.equal(result.summary.rosterCompletenessVerified, false)
  assert.equal(result.summary.activeMembershipVerifiedByTool, false)
})

test('a LinkedIn match with a different name and a duplicate research profile require manual review', () => {
  const entries = parseRosterCsv('full_name,public_profile_url\nDifferent Person,https://linkedin.com/in/a-person\n')
  const mismatch = reconcileCasaRoster(entries, [research()], metadata)
  assert.equal(mismatch.rows[0].identityStatus, 'PROFILE_NAME_CONFLICT')
  assert.equal(mismatch.rows[0].researchId, '')
  assert.deepEqual(mismatch.rows[0].possibleResearchIds, ['acc-0001'])
  const duplicate = reconcileCasaRoster(entries, [research(), research({ id: 'acc-0002', fullName: 'Second Person' })], metadata)
  assert.equal(duplicate.rows[0].identityStatus, 'PROFILE_COLLISION_REVIEW')
  assert.deepEqual(duplicate.rows[0].possibleResearchIds, ['acc-0001', 'acc-0002'])
})

test('an identity link preserves qualification, geography and missing-field uncertainty', () => {
  const entries = parseRosterCsv('full_name,public_profile_url\nA Person,https://linkedin.com/in/a-person\n')
  const notDesignated = reconcileCasaRoster(entries, [research({ designations: [], country: 'Portugal',
    title: 'Not stated in index', employer: '', industry: '', locationConfidence: 'UNCONFIRMED' })], metadata)
  assert.equal(notDesignated.rows[0].identityStatus, 'PROFILE_AND_NAME_MATCH')
  assert.equal(notDesignated.rows[0].designationEvidence, 'NOT_ESTABLISHED')
  assert.equal(notDesignated.summary.recordedDesignationConfirmed, 0)
  assert.equal(notDesignated.summary.recordedSaLocationConfirmed, 0)
  assert.deepEqual(notDesignated.rows[0].missingFields, ['ca_designation', 'sa_location', 'title', 'employer', 'industry'])
  const high = reconcileCasaRoster(entries, [research({ status: 'HIGH_CONFIDENCE', designationStatus: 'HIGH_CONFIDENCE' })], metadata)
  assert.equal(high.rows[0].designationEvidence, 'NEEDS_REVIEW')
  assert.equal(high.summary.recordedDesignationConfirmed, 0)
})

test('private ledger CSV escapes spreadsheet formulas without mutating the research person', () => {
  const entries = parseRosterCsv('full_name,public_profile_url\n"=Formula, Person",\n')
  const result = reconcileCasaRoster(entries, [], metadata)
  const rows = parse(reconciliationCsv(result), { columns: true }) as Array<Record<string, string>>
  assert.equal(rows[0].roster_name, "'=Formula, Person")
  assert.equal(rows[0].identity_status, 'NOT_IN_MAP')
  assert.equal(rows[0].employer, '')
  assert.ok(rows[0].missing_fields.includes('identity'))
})

test('research loader rejects malformed identity fields and omits rejected people', () => {
  assert.throws(() => readCasaResearchPeople('{'), /invalid JSON/)
  assert.throws(() => readCasaResearchPeople(JSON.stringify({ id: 'acc-1', full_name: '', professional_designations: ['CA(SA)'] })), /invalid identity/)
  const rejected = { id: 'acc-1', full_name: 'Rejected Person', status: 'REJECTED', professional_designations: [] }
  assert.deepEqual(readCasaResearchPeople(`${JSON.stringify(rejected)}\n`), [])
})

test('the authoritative research store can be indexed without touching an actual roster', () => {
  const people = readCasaResearchPeople(readFileSync(resolve('markets/accountants/people.jsonl'), 'utf8'))
  const selected = people.filter((person) => person.designations.includes('CA(SA)') && person.linkedinUrl)[0]
  assert.ok(selected)
  const entries = parseRosterCsv(`full_name,public_profile_url\n${csvCell(selected.fullName)},${selected.linkedinUrl}\n`)
  const result = reconcileCasaRoster(entries, people, metadata)
  assert.equal(result.rows[0].identityStatus, 'PROFILE_AND_NAME_MATCH')
  assert.equal(result.rows[0].researchId, selected.id)
  assert.equal(result.summary.linkedByProfileAndName, 1)
})

test('CLI refuses unapproved or tracked roster input before reading any data', () => {
  const args = [resolve('scripts/reconcile-casa-roster.ts'), resolve('templates/ca-sa-roster-reconciliation.csv'),
    '--as-of=2026-10-14', '--scope=resident-in-sa', '--source-reference=approved-test']
  const noRights = spawnSync(process.execPath, ['--import', 'tsx', ...args], { encoding: 'utf8' })
  assert.equal(noRights.status, 1)
  assert.match(noRights.stderr, /rights-confirmed/)
  const trackedInput = spawnSync(process.execPath, ['--import', 'tsx', ...args, '--rights-confirmed'], { encoding: 'utf8' })
  assert.equal(trackedInput.status, 1)
  assert.match(trackedInput.stderr, /Git repository/)
})
