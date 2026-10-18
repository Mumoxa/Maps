import test from 'node:test'
import assert from 'node:assert/strict'
import type { MarketProfile } from '../src/data/marketData/types'
import { deriveMarketSummary } from '../src/data/marketData/summary'

function profile(id: string, trackSlug: string, company: string): MarketProfile {
  return {
    id,
    track: trackSlug === 'salesforce' ? 'Salesforce' : 'Murex',
    trackSlug,
    name: `Person ${id}`,
    title: 'Technical Lead',
    company,
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
      checkedOn: '2026-08-01',
    }],
    suppliedAsVerified: true,
    supersedesId: null,
    attributes: {},
    provenance: { kind: 'batch', batchId: 'batch-1', sourceProfileId: null },
  }
}

test('derives counts from mixed legacy and batch profiles', () => {
  const profiles = [
    profile('salesforce-a', 'salesforce', 'Company A'),
    profile('salesforce-b', 'salesforce', 'Company A'),
    profile('murex-a', 'murex', 'Company B'),
  ]
  profiles[0].provenance = { kind: 'legacy', batchId: null, sourceProfileId: 'legacy-a' }
  const summary = deriveMarketSummary(profiles)

  assert.equal(summary.totalProfiles, 3)
  assert.equal(summary.byTrack.get('salesforce'), 2)
  assert.equal(summary.byTrack.get('murex'), 1)
  assert.equal(summary.byCompany.get('Company A'), 2)
  assert.equal(summary.byProvenance.get('legacy'), 1)
  assert.equal(summary.sourceCoverage, 3)
})
