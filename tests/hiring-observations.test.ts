import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { planHiringImport, summarizeHiringEmployers } from '../scripts/hiring-observations'
import type { HiringObservation } from '../scripts/hiring-observations'
import type { Organization } from '../src/data/organizations/types'

const START = '2025-10-08'
const END = '2026-10-08'
const CHECKED = '2026-10-08'

const knownCompany: Organization = {
  id: 'org-example', name: 'Example Logistics', legalName: 'Example Logistics (Pty) Ltd',
  aliases: ['Example Logistics SA'], website: '', status: 'verified',
  industries: [], capabilities: [], locations: [], scale: [], parentId: null,
  sources: [], datasets: [], lastVerified: '', notes: '',
}

function advert(overrides: Record<string, string> = {}): Record<string, string> {
  return {
    source: 'authorised-feed',
    source_url: 'https://example.test/jobs/42',
    source_job_id: '42',
    job_title: 'Financial Manager',
    posted_on: '2026-03-12',
    advertiser_name: 'Example Logistics',
    advertiser_type: 'direct',
    province: 'Western Cape',
    ...overrides,
  }
}

function run(
  rows: Record<string, string>[],
  existing: HiringObservation[] = [],
  organizations: Organization[] = [knownCompany],
) {
  return planHiringImport(rows, organizations, existing, START, END, CHECKED)
}

describe('South African hiring evidence importer', () => {
  it('retains a direct posting with verified existing employer id', () => {
    const plan = run([advert()])
    assert.equal(plan.accepted.length, 1)
    assert.equal(plan.accepted[0].companyKey, 'org-example')
    assert.equal(plan.accepted[0].companyStatus, 'known')
    assert.equal(plan.rejected.length, 0)
  })

  it('does not create an end-employer from an anonymous agency advert', () => {
    const plan = run([advert({
      advertiser_name: 'Recruitment Agency',
      advertiser_type: 'agency',
      employer_name: '',
    })])
    assert.equal(plan.accepted.length, 1)
    assert.equal(plan.accepted[0].companyKey, null)
    assert.equal(plan.accepted[0].companyStatus, 'unattributed')
    assert.equal(summarizeHiringEmployers(plan.accepted).length, 0)
    assert.match(plan.review[0].reason, /end employer unknown/)
  })

  it('requires confirmed sourced attribution before giving an agency job to a company', () => {
    const probable = run([advert({
      advertiser_name: 'External Recruiter',
      advertiser_type: 'agency',
      end_employer_name: 'Example Logistics',
      attribution_confidence: 'probable',
    })])
    assert.equal(probable.accepted[0].companyKey, null)

    const confirmed = run([advert({
      advertiser_name: 'External Recruiter',
      advertiser_type: 'agency',
      end_employer_name: 'Example Logistics',
      attribution_confidence: 'confirmed',
      source_employer_evidence: 'The advertisement names Example Logistics as the hiring business.',
    })])
    assert.equal(confirmed.accepted[0].companyKey, 'org-example')
  })

  it('does not convert a new company name into verified identity', () => {
    const plan = run([advert({ advertiser_name: 'Unknown Engineering Business' })])
    assert.equal(plan.accepted[0].companyStatus, 'provisional')
    assert.match(plan.accepted[0].companyKey ?? '', /^prospect:/)
    assert.ok(plan.review.some((entry) => /verify/.test(entry.reason)))
  })

  it('does not classify a company industry from an occupation or job-board label', () => {
    const plan = run([advert({ industry: 'banking' })])
    assert.equal(plan.accepted[0].proposedIndustry, 'banking')
    assert.ok(plan.review.some((entry) => /industry from advert/.test(entry.reason)))
    assert.deepEqual(knownCompany.industries, [])
  })

  it('is idempotent for the same source job id; different adverts are not lost', () => {
    const first = run([advert()])
    const repeated = run([advert()], first.accepted)
    assert.equal(repeated.accepted.length, 0)
    assert.equal(repeated.duplicateCount, 1)
    const second = run([advert({ source_job_id: '43', source_url: 'https://example.test/jobs/43' })], first.accepted)
    assert.equal(second.accepted.length, 1)
  })

  it('rejects unsupported or missing publication evidence rather than using fetch date', () => {
    const invalid = run([advert({ posted_on: '' }), advert({ posted_on: '2026-02-30', source_job_id: '43' })])
    assert.equal(invalid.accepted.length, 0)
    assert.equal(invalid.rejected.length, 2)
  })

  it('excludes older and future publications from the specified backfill', () => {
    const plan = run([
      advert({ posted_on: '2025-10-07' }),
      advert({ posted_on: '2026-10-09', source_job_id: '43' }),
    ])
    assert.equal(plan.outsideWindow, 2)
    assert.equal(plan.accepted.length, 0)
  })

  it('retains cross-board reposts as distinct observations and flags possible duplicates', () => {
    const plan = run([
      advert(),
      advert({ source: 'another-authorised-feed', source_job_id: 'B-42' }),
    ])
    assert.equal(plan.accepted.length, 2)
    assert.equal(plan.possibleReposts, 1)
  })

  it('separates counts and evidence from proof of a successful hire', () => {
    const imported = run([advert(), advert({ source_job_id: '44', source_url: 'https://example.test/jobs/44', job_title: 'Accountant' })])
    const employers = summarizeHiringEmployers(imported.accepted)
    assert.equal(employers.length, 1)
    assert.equal(employers[0].postingCount, 2)
    assert.deepEqual(employers[0].advertisedTitles, ['Accountant', 'Financial Manager'])
    assert.equal(employers[0].firstPostedOn, '2026-03-12')
  })
})
