import test from 'node:test'
import assert from 'node:assert/strict'
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { importMarketBatch } from '../scripts/import-market-batch'

const header = 'name,title,company,city,province,country,seniority,skills,sectors,specialisms,summary,linkedinUrl,sourceUrl,sourceType,evidence,checkedOn,supersedesId,attributes'
const row = [
  'Example Person',
  'Salesforce Technical Lead',
  'Example Company',
  'Cape Town',
  'Western Cape',
  'South Africa',
  'Lead / Manager',
  'Salesforce;Apex',
  'Business Platforms',
  'Technical Leadership',
  'Source-backed Salesforce technical leadership experience.',
  'https://www.linkedin.com/in/example-person',
  'https://www.linkedin.com/in/example-person',
  'linkedin',
  'Confirms current role and Salesforce experience.',
  '2026-08-01',
  '',
  '{}',
].map((value) => JSON.stringify(value)).join(',')

function fixture(csv = `${header}\n${row}\n`) {
  const rootDir = mkdtempSync(join(tmpdir(), 'maps-import-test-'))
  const filePath = join(rootDir, 'source.csv')
  writeFileSync(filePath, csv)
  return {
    rootDir,
    filePath,
    trackSlug: 'salesforce',
    batchId: '2026-08-01-salesforce-leads',
    suppliedOn: '2026-08-01',
  }
}

test('converts valid CSV into one immutable batch', async () => {
  const options = fixture()
  const result = await importMarketBatch(options)

  assert.equal(result.status, 'created')
  assert.equal(JSON.parse(readFileSync(result.outputPath, 'utf8')).records.length, 1)
})

test('re-imports identical content without changing the file', async () => {
  const options = fixture()
  const first = await importMarketBatch(options)
  const before = statSync(first.outputPath).mtimeMs
  const second = await importMarketBatch(options)

  assert.equal(second.status, 'unchanged')
  assert.equal(statSync(first.outputPath).mtimeMs, before)
})

test('writes nothing when any row is invalid', async () => {
  const invalidRow = row.replace(
    '"Confirms current role and Salesforce experience."',
    '""',
  )
  const options = fixture(`${header}\n${row}\n${invalidRow}\n`)
  const outputPath = join(
    options.rootDir,
    'markets',
    'salesforce',
    'batches',
    `${options.batchId}.json`,
  )

  await assert.rejects(importMarketBatch(options), /row 3/)
  assert.equal(existsSync(outputPath), false)
})

test('rejects changed content under an existing batch ID', async () => {
  const options = fixture()
  await importMarketBatch(options)
  writeFileSync(options.filePath, `${header}\n${row.replace('Example Company', 'Changed Company')}\n`)

  await assert.rejects(
    importMarketBatch(options),
    /batch ID already exists with different content/,
  )
})
