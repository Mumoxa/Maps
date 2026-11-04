// The identity review queue.
//
// Name similarity is the most dangerous signal in a company register: it is
// exactly good enough to look right and exactly bad enough to be wrong. These
// tests pin the three outcomes so a future "improvement" to the matching cannot
// quietly start merging a subsidiary into its parent.

import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  buildIdentityQueue,
  classifyResemblance,
  summariseIdentityQueue,
} from '../src/data/organizations/identityReview'

describe('identity resemblance classification', () => {
  it('treats a legal suffix or spelling difference as the same identity', () => {
    const match = classifyResemblance('Deloitte (South Africa)', 'Deloitte')
    assert.equal(match?.disposition, 'same-identity')
    assert.match(match?.reason ?? '', /spelling or a legal suffix/)
  })

  it('never merges a named division into its parent', () => {
    for (const [dataset, curated] of [
      ['Deloitte Consulting', 'Deloitte'],
      ['Old Mutual iWYZE', 'Old Mutual'],
      ['Sasol Mining', 'Sasol'],
      ['Nedbank CIB', 'Nedbank'],
      ['Pepkor Payments and Lending', 'Pepkor'],
    ]) {
      const match = classifyResemblance(dataset, curated)
      assert.equal(match?.disposition, 'parent-subsidiary', `${dataset} must not be merged into ${curated}`)
    }
  })

  it('never merges a local operating company into its group', () => {
    for (const [dataset, curated] of [
      ['MTN Eswatini', 'MTN'],
      ['Standard Bank Namibia', 'Standard Bank'],
    ]) {
      assert.equal(classifyResemblance(dataset, curated)?.disposition, 'parent-subsidiary')
    }
  })

  it('sends a packed source string to a reviewer instead of guessing', () => {
    for (const name of [
      'Property Partners / Absa (role to verify)',
      'Current employer unconfirmed; former The Building Company',
      'Emira Property Fund / Delta / Grit',
    ]) {
      const match = classifyResemblance(name, name.split(' / ')[0].split('; ')[0])
      assert.equal(match?.disposition, 'needs-decision', `${name} must not be auto-matched`)
      assert.match(match?.reason ?? '', /packs several employers/)
    }
  })

  it('treats a former-employer note as a career statement, not an identity', () => {
    const match = classifyResemblance('Amdec Group (former)', 'Amdec Group')
    assert.equal(match?.disposition, 'needs-decision')
    assert.match(match?.reason ?? '', /career move/)
  })

  it('returns nothing when the names are unrelated', () => {
    assert.equal(classifyResemblance('Woolworths', 'Sasol'), null)
    assert.equal(classifyResemblance('Deloitte', 'Deloitte'), null)
  })

  it('carries the leftover words so the reviewer can see what differed', () => {
    assert.equal(classifyResemblance('Sasol Mining', 'Sasol')?.qualifier, 'mining')
    assert.equal(classifyResemblance('Deloitte (South Africa)', 'Deloitte')?.qualifier, 'south africa')
  })
})

describe('identity queue', () => {
  const curated = [
    { id: 'org-deloitte', name: 'Deloitte' },
    { id: 'org-sasol', name: 'Sasol' },
    { id: 'org-pepkor', name: 'Pepkor' },
  ]

  it('reviews each dataset name once, against the longest curated match', () => {
    const queue = buildIdentityQueue([
      { datasetName: 'Pepkor Payments and Lending', professionals: 4, curated },
      { datasetName: 'Sasol Mining', professionals: 3, curated },
      { datasetName: 'Woolworths', professionals: 9, curated },
    ])
    assert.equal(queue.length, 2)
    assert.deepEqual(queue.map((entry) => entry.datasetName).sort(), ['Pepkor Payments and Lending', 'Sasol Mining'])
  })

  it('orders by the number of mapped people, so the biggest risk is reviewed first', () => {
    const queue = buildIdentityQueue([
      { datasetName: 'Sasol Mining', professionals: 1, curated },
      { datasetName: 'Pepkor NexTech', professionals: 12, curated },
    ])
    assert.equal(queue[0].datasetName, 'Pepkor NexTech')
  })

  it('summarises the backlog by disposition', () => {
    const queue = buildIdentityQueue([
      { datasetName: 'Sasol Mining', professionals: 3, curated },
      { datasetName: 'Deloitte (Pty) Ltd', professionals: 2, curated },
    ])
    const summary = summariseIdentityQueue(queue)
    assert.equal(summary.total, 2)
    assert.equal(summary.professionals, 5)
    assert.equal(summary.byDisposition['parent-subsidiary'], 1)
    assert.equal(summary.byDisposition['same-identity'], 1)
  })

  it('produces an empty queue for unrelated names', () => {
    assert.deepEqual(buildIdentityQueue([{ datasetName: 'Woolworths', professionals: 9, curated }]), [])
  })
})
