import test from 'node:test'
import assert from 'node:assert/strict'
import { generateMarketProfileId } from '../src/data/marketData/identity'
import type { MarketBatch, MarketProfile } from '../src/data/marketData/types'
import { assertValidMarketData } from '../src/data/marketData/validate'

async function validBatch(
  overrides: Partial<MarketBatch['records'][number]> = {},
): Promise<MarketBatch> {
  const linkedinUrl = overrides.linkedinUrl ?? 'https://www.linkedin.com/in/example-person'
  return {
    schemaVersion: 1,
    batchId: '2026-08-01-salesforce-leads',
    trackSlug: 'salesforce',
    sourceFile: 'salesforce.csv',
    suppliedOn: '2026-08-01',
    records: [{
      id: await generateMarketProfileId('salesforce', linkedinUrl),
      name: 'Example Person',
      title: 'Technical Lead',
      company: 'Example Company',
      location: { city: 'Cape Town', province: 'Western Cape', country: 'South Africa' },
      seniority: 'Lead / Manager',
      skills: ['Salesforce'],
      sectors: ['Business Platforms'],
      specialisms: ['Technical Leadership'],
      summary: 'Source-backed Salesforce technical leadership experience.',
      linkedinUrl,
      sources: [{
        url: linkedinUrl,
        type: 'linkedin',
        evidence: 'Confirms the current role and Salesforce experience.',
        checkedOn: '2026-08-01',
      }],
      suppliedAsVerified: true,
      supersedesId: null,
      attributes: {},
      ...overrides,
    }],
  }
}

function legacyProfile(overrides: Partial<MarketProfile> = {}): MarketProfile {
  return {
    id: 'salesforce-legacy-1',
    track: 'Salesforce',
    trackSlug: 'salesforce',
    name: 'Legacy Person',
    title: 'Salesforce Developer',
    company: 'Legacy Company',
    location: { city: 'Johannesburg', province: 'Gauteng', country: 'South Africa' },
    locationLabel: 'Johannesburg, Gauteng, South Africa',
    seniority: 'Professional',
    skills: ['Salesforce'],
    sectors: ['Business Platforms'],
    specialisms: ['Development'],
    summary: 'Legacy source evidence.',
    linkedinUrl: 'https://www.linkedin.com/in/legacy-person',
    sources: [{
      url: 'https://www.linkedin.com/in/legacy-person',
      type: 'linkedin',
      evidence: 'Legacy source evidence.',
      checkedOn: null,
    }],
    suppliedAsVerified: true,
    supersedesId: null,
    attributes: {},
    provenance: { kind: 'legacy', batchId: null, sourceProfileId: 'legacy-1' },
    ...overrides,
  }
}

const registeredTrackSlugs = ['credit-risk', 'salesforce', 'sap-erp', 'murex', 'calypso']

test('rejects missing evidence declarations', async () => {
  const batch = await validBatch()
  batch.records[0].sources[0].evidence = ''

  await assert.rejects(
    assertValidMarketData({ legacyProfiles: [], batches: [batch], registeredTrackSlugs }),
    /records\[0\]\.sources\[0\]\.evidence/,
  )
})

test('rejects duplicate canonical LinkedIn identities across legacy and batches', async () => {
  const batch = await validBatch({
    linkedinUrl: 'https://za.linkedin.com/in/legacy-person/',
    sources: [{
      url: 'https://za.linkedin.com/in/legacy-person/',
      type: 'linkedin',
      evidence: 'Confirms the same identity.',
      checkedOn: '2026-08-01',
    }],
  })
  batch.records[0].id = await generateMarketProfileId('salesforce', batch.records[0].linkedinUrl)

  await assert.rejects(
    assertValidMarketData({
      legacyProfiles: [legacyProfile()],
      batches: [batch],
      registeredTrackSlugs,
    }),
    /identity already exists/,
  )
})

test('rejects same normalised name company and title unless it supersedes', async () => {
  const batch = await validBatch({
    name: ' Legacy Person ',
    company: 'LEGACY COMPANY',
    title: 'Salesforce Developer',
  })

  await assert.rejects(
    assertValidMarketData({
      legacyProfiles: [legacyProfile()],
      batches: [batch],
      registeredTrackSlugs,
    }),
    /same name, company and title/,
  )
})

test('rejects a supersedesId from another track', async () => {
  const creditRiskProfile = legacyProfile({
    id: 'credit-risk-legacy-1',
    track: 'Credit Risk',
    trackSlug: 'credit-risk',
  })
  const batch = await validBatch({ supersedesId: creditRiskProfile.id })

  await assert.rejects(
    assertValidMarketData({
      legacyProfiles: [creditRiskProfile],
      batches: [batch],
      registeredTrackSlugs,
    }),
    /belongs to track/,
  )
})

test('rejects an ID that does not match the canonical identity URL', async () => {
  const batch = await validBatch({ id: 'salesforce-000000000000' })

  await assert.rejects(
    assertValidMarketData({ legacyProfiles: [], batches: [batch], registeredTrackSlugs }),
    /stable ID/,
  )
})

test('reports a legacy placeholder URL without blocking new verified batches', async () => {
  const legacy = legacyProfile({
    id: 'credit-risk-legacy-placeholder',
    track: 'Credit Risk',
    trackSlug: 'credit-risk',
    linkedinUrl: 'Search required',
    sources: [],
  })

  const issues = await assertValidMarketData({
    legacyProfiles: [legacy],
    batches: [],
    registeredTrackSlugs,
  })

  assert.equal(issues.length, 1)
  assert.equal(issues[0].severity, 'warning')
  assert.match(issues[0].field, /legacy/)
})

test('rejects duplicate identities inside legacy data', async () => {
  const first = legacyProfile()
  const duplicate = legacyProfile({
    id: 'salesforce-legacy-2',
    name: 'Different Display Name',
    linkedinUrl: 'https://za.linkedin.com/in/legacy-person/',
  })

  await assert.rejects(
    assertValidMarketData({
      legacyProfiles: [first, duplicate],
      batches: [],
      registeredTrackSlugs,
    }),
    /legacy identity already exists/,
  )
})

test('rejects duplicate IDs inside legacy data', async () => {
  const first = legacyProfile()
  const duplicate = legacyProfile({
    name: 'Different Person',
    linkedinUrl: 'https://www.linkedin.com/in/different-person',
  })

  await assert.rejects(
    assertValidMarketData({
      legacyProfiles: [first, duplicate],
      batches: [],
      registeredTrackSlugs,
    }),
    /legacy ID is duplicated/,
  )
})

test('rejects the same name company and title inside legacy data', async () => {
  const first = legacyProfile()
  const duplicate = legacyProfile({
    id: 'salesforce-legacy-2',
    linkedinUrl: 'https://www.linkedin.com/in/different-person',
  })

  await assert.rejects(
    assertValidMarketData({
      legacyProfiles: [first, duplicate],
      batches: [],
      registeredTrackSlugs,
    }),
    /legacy person already exists/,
  )
})
