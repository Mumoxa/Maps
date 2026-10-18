import test from 'node:test'
import assert from 'node:assert/strict'
import {
  readContactSelections,
  writeContactSelections,
  type ContactSelections,
} from '../src/data/contactDirectory'

test('round-trips selections through the URL', () => {
  const selections: ContactSelections = {
    companies: ['Nedbank', 'Standard Bank'],
    sectors: ['Financial Services'],
  }
  const params = writeContactSelections(new URLSearchParams(), selections)
  const restored = readContactSelections(params)
  assert.deepEqual(restored, selections)
})

test('preserves values that contain commas', () => {
  const selections: ContactSelections = {
    companies: ['Deloitte, LLP', 'PwC'],
  }
  const params = writeContactSelections(new URLSearchParams(), selections)
  // one repeated param per value, so the comma inside a value is not a delimiter
  assert.deepEqual(params.getAll('companies'), ['Deloitte, LLP', 'PwC'])
  assert.deepEqual(readContactSelections(params).companies, ['Deloitte, LLP', 'PwC'])
})

test('drops emptied facets and leaves unrelated params untouched', () => {
  const start = new URLSearchParams()
  start.set('q', 'risk')
  start.append('companies', 'Nedbank')
  const params = writeContactSelections(start, { companies: [], sectors: ['Banking'] })
  assert.equal(params.getAll('companies').length, 0)
  assert.deepEqual(params.getAll('sectors'), ['Banking'])
  assert.equal(params.get('q'), 'risk')
})

test('returns an empty object when no facet params are present', () => {
  const params = new URLSearchParams('q=someone&page=2')
  assert.deepEqual(readContactSelections(params), {})
})
