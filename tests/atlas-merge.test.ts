// Merging duplicate curated records.
//
// A merge is the one operation in this register that deletes a company, so the
// tests care about two things: that nothing the duplicate knew is lost, and that
// the register cannot be left half-merged when one decision is invalid.

import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { mergeOrganization } from '../scripts/merge-organizations'
import { findCuratedPairs } from '../src/data/organizations/identityReview'
import { organization as fixture } from './helpers/organizations'
import type { Organization } from '../src/data/organizations/types'

const TODAY = '2026-11-04'

const DECISION = {
  duplicateId: 'org-spar-group',
  survivorId: 'org-the-spar-group',
  survivorName: 'The SPAR Group',
  reason: 'Both records describe the same grocery group.',
  sourceUrl: 'https://thespargroup.com/about-us/',
  evidence: 'The SPAR Group describes itself as the wholesaler to independently owned SPAR stores.',
  reviewedOn: TODAY,
}

describe('curated duplicate detection', () => {
  it('finds the same company recorded twice', () => {
    const pairs = findCuratedPairs([
      { id: 'org-pwc', name: 'PwC', professionals: 25 },
      { id: 'org-pwc-south-africa', name: 'PwC South Africa', professionals: 84 },
    ])
    assert.equal(pairs.length, 1)
    assert.equal(pairs[0].disposition, 'same-identity')
    assert.equal(pairs[0].canonicalName, 'PwC')
    assert.equal(pairs[0].otherName, 'PwC South Africa')
  })

  it('does not report a group and its separately named operating company as a duplicate', () => {
    // "Old Mutual Finance" is a licensed lender inside the group, not a second
    // spelling of it, so the pair must not reach the duplicate list at all.
    assert.deepEqual(findCuratedPairs([
      { id: 'org-old-mutual', name: 'Old Mutual', professionals: 256 },
      { id: 'org-old-mutual-finance', name: 'Old Mutual Finance', professionals: 8 },
    ]), [])
  })

  it('reports a group and its named division as separate entities, not duplicates', () => {
    const pairs = findCuratedPairs([
      { id: 'org-wbho', name: 'WBHO Construction', professionals: 29 },
      { id: 'org-wbho-cape', name: 'WBHO Construction - Cape Division', professionals: 28 },
    ])
    assert.equal(pairs.length, 1)
    assert.equal(pairs[0].disposition, 'parent-subsidiary')
  })

  it('reports nothing for unrelated companies', () => {
    assert.deepEqual(findCuratedPairs([
      { id: 'org-a', name: 'Sasol', professionals: 1 },
      { id: 'org-b', name: 'Woolworths', professionals: 1 },
    ]), [])
  })
})

describe('mergeOrganization', () => {
  const survivor = fixture({
    id: 'org-the-spar-group',
    name: 'The SPAR Group',
    status: 'needs-verification',
    website: 'https://thespargroup.com/',
    scale: [],
    locations: [],
    sources: [{
      url: 'https://thespargroup.com/about-us/',
      type: 'company-website',
      evidence: 'Describes the group.',
      checkedOn: TODAY,
    }],
    datasets: ['import'],
  })

  const duplicate: Organization = fixture({
    id: 'org-spar-group',
    name: 'SPAR Group',
    status: 'needs-verification',
    website: '',
    industries: [{
      industryId: 'grocery-retail',
      primary: true,
      confidence: 'confirmed',
      evidence: 'Wholesale grocery distribution.',
      sourceUrl: 'https://example.test/spar',
      checkedOn: TODAY,
    }],
    scale: [{
      metric: 'employees',
      value: 'approximately 168,000 employees',
      basis: 'third-party-estimate',
      asOf: '2026',
      sourceUrl: 'https://example.test/spar',
      checkedOn: TODAY,
    }],
    locations: [{ city: 'Cape Town', province: 'Western Cape', sourceUrl: 'https://example.test/spar', checkedOn: TODAY }],
    datasets: ['organizations'],
  })

  it('keeps everything the duplicate knew', () => {
    const merged = mergeOrganization(survivor, duplicate, DECISION)
    assert.equal(merged.industries.length, 1)
    assert.equal(merged.scale.length, 1)
    assert.equal(merged.locations.length, 1)
    assert.deepEqual(merged.datasets, ['import', 'organizations'])
  })

  it('takes the survivor name and turns the old name into an alias', () => {
    const merged = mergeOrganization(survivor, duplicate, DECISION)
    assert.equal(merged.name, 'The SPAR Group')
    assert.ok(merged.aliases.includes('SPAR Group'), 'the duplicate spelling must still resolve')
    assert.ok(!merged.aliases.includes('The SPAR Group'), 'the survivor name is not its own alias')
  })

  it('records the merge itself as evidence on the surviving record', () => {
    const merged = mergeOrganization(survivor, duplicate, DECISION)
    const mergeSource = merged.sources.find((source) => source.url === DECISION.sourceUrl)
    assert.ok(mergeSource, 'a merge without evidence would be an unsourced deletion')
    assert.match(merged.notes, /Merged duplicate record "SPAR Group"/)
  })

  it('never overwrites a fact the survivor already has', () => {
    const merged = mergeOrganization(survivor, duplicate, DECISION)
    assert.equal(merged.website, 'https://thespargroup.com/')
  })

  it('keeps the later verification date', () => {
    const later = fixture({ id: 'org-the-spar-group', name: 'The SPAR Group', lastVerified: '2026-01-01' })
    const earlier = fixture({ id: 'org-spar-group', name: 'SPAR Group', lastVerified: TODAY })
    assert.equal(mergeOrganization(later, earlier, DECISION).lastVerified, TODAY)
  })
})

describe('merge redirects', () => {
  it('resolves a merged-away id to the surviving company', async () => {
    const { resolveOrganizationRedirect, identityRedirects } = await import('../src/data/organizations/load')
    assert.ok(identityRedirects.size > 0, 'the register holds at least one reviewed merge')
    for (const [from, to] of identityRedirects) {
      assert.equal(resolveOrganizationRedirect(from), to)
      assert.notEqual(from, to)
    }
  })

  it('leaves an id that was never merged untouched', async () => {
    const { resolveOrganizationRedirect } = await import('../src/data/organizations/load')
    assert.equal(resolveOrganizationRedirect('org-not-a-real-id'), 'org-not-a-real-id')
  })

  it('every redirect target is a live curated record', async () => {
    const { identityRedirects, organizations } = await import('../src/data/organizations/load')
    const ids = new Set(organizations.map((organization) => organization.id))
    for (const [from, to] of identityRedirects) {
      assert.ok(ids.has(to), `${to} must exist for ${from} to resolve`)
      assert.ok(!ids.has(from), `${from} must no longer exist as its own record`)
    }
  })
})
