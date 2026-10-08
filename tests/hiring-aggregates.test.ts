import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { planAdzunaEmployerReport, summarizeHistoricalEmployerReports } from '../scripts/hiring-aggregates'
import { privateDataDir } from '../scripts/hiring-storage'
import type { Organization } from '../src/data/organizations/types'

const company: Organization = {
  id: 'org-golden', name: 'Golden Industries', legalName: 'Golden Industries (Pty) Ltd',
  aliases: ['Golden SA'], website: '', status: 'verified', industries: [], capabilities: [],
  locations: [], scale: [], parentId: null, sources: [], datasets: [], lastVerified: '', notes: '',
}
const meta = {
  provider: 'adzuna-intelligence' as const,
  reportId: 'export-2026-10-08-za',
  sourceReference: 'licensed-2026-10-08-export',
  countryCode: 'za', windowStart: '2025-10-08',
  windowEnd: '2026-10-08', receivedOn: '2026-10-08', licensed: true,
}
const source = {
  sample_size: 100,
  data: [
    { company: { id: 7, name: 'Golden Industries' }, industry: { id: 'C', label: 'Manufacturing' }, posting_count: 34 },
    { company: { id: 8, name: 'New Employer' }, industry: { id: 'J', label: 'Information and communication' }, posting_count: 12 },
  ],
}

describe('licensed historical employer aggregates', () => {
  it('parses all provider-returned companies and keeps unverified identities separate', () => {
    const output = planAdzunaEmployerReport(source, meta, [company])
    assert.equal(output.accepted.length, 2)
    assert.equal(output.accepted[0].organizationId, 'org-golden')
    assert.equal(output.accepted[1].organizationId, null)
    assert.equal(output.accepted[1].identityStatus, 'unresolved')
    assert.equal(output.accepted[0].postingCount, 34)
    assert.ok(output.review.some((row) => row.reason.includes('classification proposal')))
  })

  it('never claims that reports are individual job postings or source-proven hires', () => {
    const output = planAdzunaEmployerReport(source, meta, [company])
    assert.equal(output.accepted[0].attribution, 'provider-reported')
    assert.equal(output.accepted[0].periodStart, '2025-10-08')
    assert.equal(output.accepted[0].periodEnd, '2026-10-08')
    assert.equal(output.reportedSampleSize, 100)
  })

  it('does not sum overlapping historical report windows', () => {
    const first = planAdzunaEmployerReport(source, meta, [company])
    const second = planAdzunaEmployerReport(source, {
      ...meta, reportId: 'overlapping-period', windowStart: '2026-01-01',
    }, [company], first.accepted)
    const summary = summarizeHistoricalEmployerReports([...first.accepted, ...second.accepted])
    assert.equal(summary.length, 2)
    const golden = summary.find((r) => r.organizationId === 'org-golden')
    assert.equal(golden?.reports.length, 2)
    assert.deepEqual(golden?.reports.map((r) => r.postingCount), [34, 34])
    assert.equal('postingCount' in (golden ?? {}), false)
  })

  it('is idempotent for the same historical report', () => {
    const first = planAdzunaEmployerReport(source, meta, [company])
    const second = planAdzunaEmployerReport(source, meta, [company], first.accepted)
    assert.equal(second.accepted.length, 0)
    assert.equal(second.unchanged, 2)
  })

  it('refuses reports without explicit import rights, dates or SA scope', () => {
    assert.throws(() => planAdzunaEmployerReport(source, { ...meta, licensed: false }, [company]), /licensed/)
    assert.throws(() => planAdzunaEmployerReport(source, { ...meta, countryCode: 'gb' }, [company]), /South Africa/)
    assert.throws(() => planAdzunaEmployerReport(source, { ...meta, windowStart: '2026-11-01' }, [company]), /invalid/)
  })

  it('rejects malformed provider rows without inventing names or posting counts', () => {
    const data = { data: [
      { company: { name: 'Uncounted' }, posting_count: -1 },
      { company: { name: 'Incomplete' } },
      { company: { name: 'Valid Company', id: 3 }, posting_count: 0 },
    ] }
    const output = planAdzunaEmployerReport(data, meta, [])
    assert.equal(output.rejected.length, 2)
    assert.equal(output.accepted.length, 1)
    assert.equal(output.accepted[0].postingCount, 0)
  })

  it('prevents licensed records being written under public application or markets directories', () => {
    assert.throws(() => privateDataDir('markets/organizations/hiring'), /Git repository/)
    assert.throws(() => privateDataDir('public/hiring'), /Git repository/)
    assert.ok(privateDataDir('.local/hiring').endsWith('/.local/hiring') || privateDataDir('.local/hiring').endsWith('\\.local\\hiring'))
  })
})
