import test from 'node:test'
import assert from 'node:assert/strict'
import { getDuplicateProfileNames } from '../src/data/hierarchy'
import type { Profile } from '../src/data/types'

function profile(id: string, name: string): Profile {
  return {
    id,
    name,
    linkedin_url: '#',
    location: '',
    company: '',
    title: '',
    seniority: '',
    function: '',
    segment: '',
    specialism: '',
    category: '',
    evidence: '',
    source_url: '',
    fit_score: 0,
    confidence: 'Low',
    notes: '',
  }
}

test('flags names that appear more than once', () => {
  const dups = getDuplicateProfileNames([
    profile('1', 'Jane Doe'),
    profile('2', 'John Smith'),
    profile('3', 'Jane Doe'),
  ])
  assert.equal(dups.has('Jane Doe'), true)
  assert.equal(dups.has('John Smith'), false)
})

test('returns an empty set when all names are unique', () => {
  const dups = getDuplicateProfileNames([
    profile('1', 'Alice'),
    profile('2', 'Bob'),
  ])
  assert.equal(dups.size, 0)
})

test('does not hardcode any specific name', () => {
  const dups = getDuplicateProfileNames([
    profile('1', 'Repeated Person'),
    profile('2', 'Repeated Person'),
  ])
  assert.equal(dups.has('Repeated Person'), true)
  assert.equal(dups.size, 1)
})
