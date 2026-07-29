import test from 'node:test'
import assert from 'node:assert/strict'
import {
  canonicalPersonKey,
  canonicalizeIdentityUrl,
  generateMarketProfileId,
} from '../src/data/marketData/identity'

test('canonicalises equivalent LinkedIn URLs', () => {
  assert.equal(
    canonicalizeIdentityUrl('HTTPS://ZA.LinkedIn.com/in/Example-Person/?trk=public#about'),
    'https://www.linkedin.com/in/example-person',
  )
})

test('rejects non-HTTPS identity URLs', () => {
  assert.throws(
    () => canonicalizeIdentityUrl('http://www.linkedin.com/in/example-person'),
    /HTTPS/,
  )
})

test('generates deterministic track-scoped IDs', async () => {
  const first = await generateMarketProfileId(
    'salesforce',
    'https://www.linkedin.com/in/example-person',
  )
  const second = await generateMarketProfileId(
    'salesforce',
    'https://za.linkedin.com/in/example-person/',
  )

  assert.equal(first, second)
  assert.match(first, /^salesforce-[a-f0-9]{12}$/)
})

test('normalises name company and title for person collision checks', () => {
  assert.equal(
    canonicalPersonKey({
      name: '  Example   Person ',
      company: 'Example & Company',
      title: 'Technical Lead',
    }),
    'example person|example & company|technical lead',
  )
})
