// Search Bank target companies — the write-back path from the Company
// Association Explorer. These tests exist because the whole point of attaching
// a pool to an assignment is that it survives: same company + same search must
// never duplicate, and a candidate drop must never disturb an attached company.

import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { emptyBank, ingestDrop } from '../src/data/searchBank/ingest.ts'
import {
  ingestTargetDrop,
  mergeTargetDrafts,
  normaliseTargetRows,
  parseTargetDrop,
  targetCompanyId,
  targetsForSearch,
} from '../src/data/searchBank/targets.ts'
import { TARGET_STATUSES } from '../src/data/searchBank/types.ts'
import { targetDropPayload, createPool } from '../src/data/organizations/workspace.ts'

const TODAY = '2026-10-08'

function poolWith(entries: { id: string; reason: string; tier: number | null }[], addedOn = TODAY) {
  return createPool({
    name: 'Western Cape cold chain finance sources',
    description: 'Finance talent adjacent to commercial cold storage',
    classification: 'Industry pocket',
    owner: 'Talent Tree',
    kind: 'snapshot',
    entries: entries.map((entry) => ({
      organizationId: entry.id,
      reason: entry.reason,
      tier: entry.tier as 1 | 2 | 3 | 4 | 5 | null,
      addedOn,
    })),
    definition: null,
    searchId: null,
  })
}

const CONTEXTS = new Map([
  ['org-vector-logistics', {
    name: 'Vector Logistics',
    legalName: 'Vector Logistics (Pty) Ltd',
    pocket: 'transport-logistics',
    tierLabel: 'Primary sourcing pocket',
    mappedProfessionals: 4,
    evidenceState: 'known-verified',
    missingEvidence: [] as string[],
  }],
  ['org-nukor-feeds', {
    name: 'Nukor Feeds',
    legalName: '',
    pocket: 'milling-feed',
    tierLabel: 'Weak for this brief',
    mappedProfessionals: 0,
    evidenceState: 'unknown',
    missingEvidence: ['No sourced operating record yet'] as string[],
  }],
])

function explorerDrop() {
  const pool = poolWith([
    { id: 'org-vector-logistics', reason: 'Same industry; shared cold-chain operating processes', tier: 1 },
    { id: 'org-nukor-feeds', reason: 'No operational signal recorded', tier: 5 },
  ])
  return JSON.stringify(targetDropPayload(pool, CONTEXTS, 'Financial Manager — Commercial Cold Storage', 'Commercial Cold Storage', 'Financial Manager'))
}

describe('Search Bank target companies', () => {
  it('files a target pool under its assignment and creates the search when needed', () => {
    const bank = emptyBank(TODAY)
    const result = ingestTargetDrop(explorerDrop(), { bank, today: TODAY, source: 'pool.json' })

    assert.equal(result.report.read, 2)
    assert.equal(result.report.added, 2)
    assert.equal(result.report.updated, 0)
    assert.deepEqual(result.report.searchesCreated, ['Financial Manager — Commercial Cold Storage'])
    assert.equal(result.bank.searches.length, 1)
    assert.equal(result.bank.searches[0].client, 'Commercial Cold Storage')
    assert.equal(result.bank.searches[0].role, 'Financial Manager')
    assert.equal(result.bank.targetCompanies.length, 2)
    // Best relevance tier first, so the recruiter sees the strongest targets first.
    assert.equal(result.bank.targetCompanies[0].name, 'Vector Logistics')
    assert.equal(result.bank.targetCompanies[0].tier, 1)
    assert.equal(result.bank.targetCompanies[1].tier, 5)
  })

  it('is idempotent: re-dropping the same pool updates the same records', () => {
    const bank = emptyBank(TODAY)
    const first = ingestTargetDrop(explorerDrop(), { bank, today: TODAY, source: 'pool.json' })
    const second = ingestTargetDrop(explorerDrop(), { bank: first.bank, today: TODAY, source: 'pool.json' })

    assert.equal(second.report.added, 0)
    assert.equal(second.report.updated, 2)
    assert.equal(second.bank.targetCompanies.length, 2)
    assert.deepEqual(
      second.bank.targetCompanies.map((target) => target.id),
      first.bank.targetCompanies.map((target) => target.id),
    )
    assert.equal(second.bank.searches.length, 1, 'no duplicate search is created')
  })

  it('keeps first-attachment provenance when a target is updated', () => {
    const bank = emptyBank('2026-09-01')
    const pool = poolWith([{ id: 'org-vector-logistics', reason: 'Same industry', tier: 1 }], '2026-09-01')
    const first = ingestTargetDrop(
      JSON.stringify(targetDropPayload(pool, CONTEXTS, 'Financial Manager — Commercial Cold Storage')),
      { bank, today: '2026-09-01', source: 'pool.json' },
    )
    // A later drop restates the date it thinks the company was added; the bank
    // keeps its own first-attachment record and only moves updatedOn.
    // The pool stores a company's rule hits as one '; '-joined string; the
    // importer splits them back into the individual reasons it stores.
    const restated = poolWith([{ id: 'org-vector-logistics', reason: 'Same industry; shared processes', tier: 1 }], TODAY)
    const second = ingestTargetDrop(
      JSON.stringify(targetDropPayload(restated, CONTEXTS, 'Financial Manager — Commercial Cold Storage')),
      { bank: first.bank, today: TODAY, source: 'pool.json' },
    )
    const vector = second.bank.targetCompanies.find((target) => target.name === 'Vector Logistics')!

    assert.equal(vector.addedOn, '2026-09-01')
    assert.equal(vector.updatedOn, TODAY)
    assert.deepEqual(vector.reasons, ['Same industry', 'shared processes'])
  })

  it('keeps the same company under two different searches', () => {
    const bank = emptyBank(TODAY)
    const first = ingestTargetDrop(explorerDrop(), { bank, today: TODAY, source: 'pool.json' })
    const other = JSON.stringify(targetDropPayload(
      poolWith([{ id: 'org-vector-logistics', reason: 'Second client brief', tier: 3 }]),
      CONTEXTS,
      'Financial Manager — Second Client',
    ))
    const second = ingestTargetDrop(other, { bank: first.bank, today: TODAY, source: 'pool-2.json' })

    assert.equal(second.bank.targetCompanies.length, 3)
    assert.equal(second.bank.searches.length, 2)
    const vector = second.bank.targetCompanies.filter((target) => target.name === 'Vector Logistics')
    assert.equal(vector.length, 2)
    assert.notEqual(vector[0].searchId, vector[1].searchId)
  })

  it('never renders unknown evidence as an absence', () => {
    const bank = emptyBank(TODAY)
    const result = ingestTargetDrop(explorerDrop(), { bank, today: TODAY, source: 'pool.json' })
    const nukor = result.bank.targetCompanies.find((target) => target.name === 'Nukor Feeds')!

    assert.equal(nukor.evidenceState, 'unknown')
    assert.equal(nukor.mappedProfessionals, 0)
    assert.deepEqual(nukor.missingEvidence, ['No sourced operating record yet'])
    assert.equal(nukor.legalName, '', 'no legal identity is invented')
  })

  it('reads CSV drops with the same tolerant header handling', () => {
    const csv = [
      // "Tier" and "Relevance tier" are two spellings of one field: the first
      // recognised value must win, not the last column on the row.
      'Company,Legal Name,Organization ID,Pocket,Tier,Relevance tier,Reasons,Mapped professionals,Evidence state,Missing evidence,Status',
      'Vector Logistics,Vector Logistics (Pty) Ltd,org-vector-logistics,transport-logistics,1,Primary sourcing pocket,Same industry; shared processes,4,known-verified,,engaged',
      // A row that carries data but no company name cannot become a target.
      ',,,milling-feed,3,Weak for this brief,No operational signal,0,unknown,No sourced operating record yet,',
    ].join('\n')
    const parsed = parseTargetDrop(csv, 'targets.csv')

    assert.equal(parsed.format, 'csv')
    const { drafts, issues } = normaliseTargetRows(parsed, { today: TODAY, defaultSearch: 'Financial Manager — Commercial Cold Storage' })
    assert.equal(drafts.length, 1)
    assert.equal(drafts[0].name, 'Vector Logistics')
    assert.equal(drafts[0].tier, 1, 'the numeric tier column wins over the label column')
    assert.deepEqual(drafts[0].reasons, ['Same industry', 'shared processes'])
    assert.equal(drafts[0].status, 'engaged')
    assert.equal(issues.length, 1, 'the nameless row is reported, not silently dropped')
    assert.equal(issues[0].field, 'company')

    const merged = mergeTargetDrafts(drafts, { bank: emptyBank(TODAY), today: TODAY })
    assert.equal(merged.report.skipped, 0)
    assert.equal(merged.bank.targetCompanies.length, 1)
  })

  it('rejects a drop that names no search anywhere', () => {
    const parsed = parseTargetDrop('[{"company":"Vector Logistics"}]', 'targets.json')
    const { drafts, issues } = normaliseTargetRows(parsed, { today: TODAY })

    assert.equal(drafts.length, 0)
    assert.equal(issues.length, 1)
    assert.equal(issues[0].field, 'search')
  })

  it('gives the same company under the same search a stable id', () => {
    assert.equal(
      targetCompanyId('search-a', 'org-vector-logistics', 'Vector Logistics'),
      targetCompanyId('search-a', 'org-vector-logistics', 'Vector Logistics (Pty) Ltd'),
    )
    assert.notEqual(
      targetCompanyId('search-a', '', 'Vector Logistics'),
      targetCompanyId('search-b', '', 'Vector Logistics'),
    )
  })

  it('orders targets for a search by relevance tier', () => {
    const bank = emptyBank(TODAY)
    const result = ingestTargetDrop(explorerDrop(), { bank, today: TODAY, source: 'pool.json' })
    const ordered = targetsForSearch(result.bank, result.bank.searches[0].id)

    assert.deepEqual(ordered.map((target) => target.tier), [1, 5])
    assert.deepEqual(targetsForSearch(result.bank, 'search-missing'), [])
  })

  it('leaves attached companies untouched when a candidate drop is imported', () => {
    const bank = emptyBank(TODAY)
    const withTargets = ingestTargetDrop(explorerDrop(), { bank, today: TODAY, source: 'pool.json' }).bank
    const candidateCsv = [
      'Full name,Title,Email,Search',
      'Test Candidate,Financial Manager,test.candidate@example.com,Financial Manager — Commercial Cold Storage',
    ].join('\n')
    const result = ingestDrop(candidateCsv, { bank: withTargets, today: TODAY, source: 'candidates.csv' })

    assert.equal(result.report.added, 1)
    assert.equal(result.bank.targetCompanies.length, 2, 'the candidate drop did not drop the targets')
    assert.deepEqual(
      result.bank.targetCompanies.map((target) => target.id),
      withTargets.targetCompanies.map((target) => target.id),
    )
  })

  it('never records a person-suitability judgement on a company target', () => {
    const bank = emptyBank(TODAY)
    const result = ingestTargetDrop(explorerDrop(), { bank, today: TODAY, source: 'pool.json' })

    for (const target of result.bank.targetCompanies) {
      assert.ok(TARGET_STATUSES.includes(target.status))
      assert.ok(!('candidate' in target), 'a target record carries no person')
      assert.ok(!('suitability' in target))
    }
  })
})
