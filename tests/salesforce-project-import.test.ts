import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import type { MarketBatch } from '../src/data/marketData/types'

interface SalesforceImportAudit {
  sourceRecordCount: number
  acceptedRecordCount: number
  excludedRecordCount: number
  exclusions: Array<{
    sourceProjectId: string
    reason: string
  }>
}

const batchPath = new URL(
  '../markets/salesforce/batches/2026-07-29-salesforce-sa-source-verified.json',
  import.meta.url,
)
const auditPath = new URL(
  '../markets/salesforce/import-audits/2026-07-29-salesforce-sa-source-verified.json',
  import.meta.url,
)

test('reconciles the supplied Salesforce project without publishing unsafe records', () => {
  const batch = JSON.parse(readFileSync(batchPath, 'utf8')) as MarketBatch
  const audit = JSON.parse(readFileSync(auditPath, 'utf8')) as SalesforceImportAudit
  const sourceProjectIds = batch.records.map(
    (record) => record.attributes.sourceProjectId as string,
  )
  const canonicalLinkedInUrls = batch.records.map(
    (record) => record.linkedinUrl.toLowerCase().replace(/\/+$/, ''),
  )

  assert.equal(batch.batchId, '2026-07-29-salesforce-sa-source-verified')
  assert.equal(batch.trackSlug, 'salesforce')
  assert.equal(batch.records.length, 851)
  assert.equal(new Set(sourceProjectIds).size, 851)
  assert.equal(new Set(canonicalLinkedInUrls).size, 851)
  assert.ok(canonicalLinkedInUrls.every((url) => (
    url.startsWith('https://www.linkedin.com/in/')
  )))

  assert.equal(audit.sourceRecordCount, 1081)
  assert.equal(audit.acceptedRecordCount, 851)
  assert.equal(audit.excludedRecordCount, 230)
  assert.equal(audit.acceptedRecordCount + audit.excludedRecordCount, audit.sourceRecordCount)
  assert.equal(audit.exclusions.length, audit.excludedRecordCount)
  assert.ok(audit.exclusions.every(({ sourceProjectId, reason }) => (
    sourceProjectId.length > 0 && reason.length > 0
  )))
  assert.equal(sourceProjectIds.includes('sfza-1081'), false)
})
