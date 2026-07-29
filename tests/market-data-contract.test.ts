import test from 'node:test'
import assert from 'node:assert/strict'
import type { MarketBatch, MarketProfile } from '../src/data/marketData/types'

test('the public profile and batch record share the canonical fields', () => {
  const batch: MarketBatch = {
    schemaVersion: 1,
    batchId: '2026-08-01-salesforce-leads',
    trackSlug: 'salesforce',
    sourceFile: 'salesforce.csv',
    suppliedOn: '2026-08-01',
    records: [],
  }
  const required: (keyof MarketProfile)[] = [
    'id',
    'track',
    'trackSlug',
    'name',
    'title',
    'company',
    'location',
    'locationLabel',
    'seniority',
    'skills',
    'sectors',
    'specialisms',
    'summary',
    'linkedinUrl',
    'sources',
    'suppliedAsVerified',
    'supersedesId',
    'attributes',
    'provenance',
  ]

  assert.equal(batch.schemaVersion, 1)
  assert.equal(required.length, 19)
})
