import test from 'node:test'
import assert from 'node:assert/strict'
import { resolve } from 'node:path'
import { loadRepositoryMarketData } from '../scripts/market-data-repository'

test('loads every registered track without track-specific importer code', async () => {
  const repository = await loadRepositoryMarketData(resolve('.'))

  assert.deepEqual(
    repository.registeredTrackSlugs,
    ['calypso', 'credit-risk', 'murex', 'salesforce', 'sap-erp'],
  )
})

test('combines the complete legacy registry before any new batches', async () => {
  const repository = await loadRepositoryMarketData(resolve('.'))

  assert.equal(repository.legacyProfiles.length, 432)
  assert.equal(repository.profiles.length, 432)
  assert.equal(repository.batches.length, 0)
})
