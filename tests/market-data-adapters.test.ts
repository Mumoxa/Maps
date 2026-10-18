import test from 'node:test'
import assert from 'node:assert/strict'
import { resolve } from 'node:path'
import { loadRepositoryMarketData } from '../scripts/market-data-repository'
import { loadData } from '../src/data/loadData'
import {
  adaptCreditRiskProfiles,
  adaptSalesforceProfiles,
} from '../src/data/marketData/adapters'
import { salesforcePeople } from '../src/data/salesforcePeople'

test('retains all legacy Credit Risk and Salesforce records', () => {
  assert.equal(adaptCreditRiskProfiles(loadData()).length, 344)
  assert.equal(adaptSalesforceProfiles(salesforcePeople).length, 88)
})

test('preserves legacy IDs and auditable source provenance', () => {
  const [creditRisk] = adaptCreditRiskProfiles(loadData())
  const [salesforce] = adaptSalesforceProfiles(salesforcePeople)

  assert.equal(creditRisk.provenance.sourceProfileId, 'CRSA-001')
  assert.equal(salesforce.provenance.sourceProfileId, 'sf-0001')
  assert.equal(creditRisk.sources.length > 0, true)
  assert.equal(salesforce.sources.length > 0, true)
})

test('excludes the unverified manual correction from the public registry', async () => {
  const repository = await loadRepositoryMarketData(resolve('.'))
  const names = repository.profiles.map((profile) => profile.name)
  assert.equal(names.includes('Katlego Magnificent Seapi'), false)
})
