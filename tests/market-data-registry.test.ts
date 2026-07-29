import test from 'node:test'
import assert from 'node:assert/strict'
import type { MarketBatch, MarketProfile } from '../src/data/marketData/types'
import { buildMarketRegistry } from '../src/data/marketData/registry'

function profile(id: string, name: string, trackSlug = 'salesforce'): MarketProfile {
  return {
    id,
    track: trackSlug === 'salesforce' ? 'Salesforce' : 'Murex',
    trackSlug,
    name,
    title: 'Technical Lead',
    company: 'Example Company',
    location: { city: 'Cape Town', province: 'Western Cape', country: 'South Africa' },
    locationLabel: 'Cape Town, Western Cape, South Africa',
    seniority: 'Lead / Manager',
    skills: ['Platform'],
    sectors: ['Technology'],
    specialisms: ['Technical Leadership'],
    summary: 'Verified profile evidence.',
    linkedinUrl: `https://www.linkedin.com/in/${id}`,
    sources: [{
      url: `https://www.linkedin.com/in/${id}`,
      type: 'linkedin',
      evidence: 'Confirms current role.',
      checkedOn: null,
    }],
    suppliedAsVerified: true,
    supersedesId: null,
    attributes: {},
    provenance: { kind: 'legacy', batchId: null, sourceProfileId: id },
  }
}

test('excludes superseded profiles and preserves batch provenance', () => {
  const legacy = profile('salesforce-legacy', 'Old Name')
  const batch: MarketBatch = {
    schemaVersion: 1,
    batchId: '2026-08-01-correction',
    trackSlug: 'salesforce',
    sourceFile: 'correction.csv',
    suppliedOn: '2026-08-01',
    records: [{
      ...legacy,
      id: 'salesforce-corrected',
      name: 'Correct Name',
      supersedesId: legacy.id,
      provenance: undefined,
      track: undefined,
      trackSlug: undefined,
      locationLabel: undefined,
    } as unknown as MarketBatch['records'][number]],
  }

  const result = buildMarketRegistry({
    legacyProfiles: [legacy],
    batches: [batch],
    trackNames: new Map([['salesforce', 'Salesforce']]),
  })

  assert.deepEqual(result.map(({ id }) => id), ['salesforce-corrected'])
  assert.deepEqual(result[0].provenance, {
    kind: 'batch',
    batchId: batch.batchId,
    sourceProfileId: null,
  })
})

test('sorts profiles deterministically by track name and ID', () => {
  const result = buildMarketRegistry({
    legacyProfiles: [
      profile('salesforce-z', 'Zed'),
      profile('murex-a', 'Alpha', 'murex'),
      profile('salesforce-a', 'Alpha'),
    ],
    batches: [],
    trackNames: new Map([['salesforce', 'Salesforce'], ['murex', 'Murex']]),
  })

  assert.deepEqual(result.map(({ id }) => id), ['murex-a', 'salesforce-a', 'salesforce-z'])
})
