import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'csv-parse/sync'
import { generateMarketProfileId } from '../src/data/marketData/identity'
import type {
  MarketBatch,
  MarketBatchRecord,
  MarketDataIssue,
} from '../src/data/marketData/types'
import { assertValidMarketData } from '../src/data/marketData/validate'
import { loadRepositoryMarketData } from './market-data-repository'

export interface ImportMarketBatchOptions {
  rootDir: string
  trackSlug: string
  filePath: string
  batchId: string
  suppliedOn?: string
}

export interface ImportMarketBatchResult {
  status: 'created' | 'unchanged'
  outputPath: string
  accepted: number
  warnings: MarketDataIssue[]
}

interface CsvRow {
  name: string
  title: string
  company: string
  city: string
  province: string
  country: string
  seniority: string
  skills: string
  sectors: string
  specialisms: string
  summary: string
  linkedinUrl: string
  sourceUrl: string
  sourceType: string
  evidence: string
  checkedOn: string
  supersedesId: string
  attributes: string
}

const requiredColumns = [
  'name',
  'title',
  'company',
  'city',
  'province',
  'country',
  'seniority',
  'skills',
  'sectors',
  'specialisms',
  'summary',
  'linkedinUrl',
  'sourceUrl',
  'sourceType',
  'evidence',
  'checkedOn',
  'supersedesId',
  'attributes',
]

function splitList(value: string) {
  return value.split(';').map((item) => item.trim()).filter(Boolean)
}

function parseAttributes(value: string, rowNumber: number) {
  if (!value.trim()) return {}
  try {
    const parsed = JSON.parse(value) as unknown
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      throw new Error('must be a JSON object')
    }
    return parsed as Record<string, unknown>
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'invalid JSON'
    throw new Error(`row ${rowNumber} attributes: ${reason}`)
  }
}

async function toRecord(row: CsvRow, trackSlug: string, rowNumber: number): Promise<MarketBatchRecord> {
  const identityUrl = row.linkedinUrl.trim() || row.sourceUrl.trim()
  if (!identityUrl) throw new Error(`row ${rowNumber} linkedinUrl: is required`)

  return {
    id: await generateMarketProfileId(trackSlug, identityUrl),
    name: row.name.trim(),
    title: row.title.trim(),
    company: row.company.trim(),
    location: {
      city: row.city.trim(),
      province: row.province.trim(),
      country: row.country.trim(),
    },
    seniority: row.seniority.trim(),
    skills: splitList(row.skills),
    sectors: splitList(row.sectors),
    specialisms: splitList(row.specialisms),
    summary: row.summary.trim(),
    linkedinUrl: identityUrl,
    sources: [{
      url: row.sourceUrl.trim(),
      type: row.sourceType.trim(),
      evidence: row.evidence.trim(),
      checkedOn: row.checkedOn.trim(),
    }],
    suppliedAsVerified: true,
    supersedesId: row.supersedesId.trim() || null,
    attributes: parseAttributes(row.attributes, rowNumber),
  }
}

function parseRows(filePath: string) {
  const csv = readFileSync(filePath, 'utf8')
  const firstLine = csv.split(/\r?\n/, 1)[0]
  const columns = parse(firstLine, { relax_quotes: false })[0] as string[]
  const missing = requiredColumns.filter((column) => !columns.includes(column))
  const unsupported = columns.filter((column) => !requiredColumns.includes(column))
  if (missing.length > 0) throw new Error(`Missing CSV columns: ${missing.join(', ')}`)
  if (unsupported.length > 0) throw new Error(`Unsupported CSV columns: ${unsupported.join(', ')}`)

  return parse(csv, {
    columns: true,
    skip_empty_lines: true,
    trim: false,
  }) as CsvRow[]
}

function formatBatch(batch: MarketBatch) {
  return `${JSON.stringify(batch, null, 2)}\n`
}

export async function importMarketBatch(
  options: ImportMarketBatchOptions,
): Promise<ImportMarketBatchResult> {
  const rootDir = resolve(options.rootDir)
  const rows = parseRows(options.filePath)
  const records: MarketBatchRecord[] = []

  for (const [index, row] of rows.entries()) {
    try {
      records.push(await toRecord(row, options.trackSlug, index + 2))
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'could not map CSV row'
      if (reason.startsWith('row ')) throw error
      throw new Error(`row ${index + 2}: ${reason}`)
    }
  }

  const batch: MarketBatch = {
    schemaVersion: 1,
    batchId: options.batchId,
    trackSlug: options.trackSlug,
    sourceFile: basename(options.filePath),
    suppliedOn: options.suppliedOn ?? new Date().toISOString().slice(0, 10),
    records,
  }
  const outputPath = join(
    rootDir,
    'markets',
    options.trackSlug,
    'batches',
    `${options.batchId}.json`,
  )
  const output = formatBatch(batch)

  if (existsSync(outputPath)) {
    if (readFileSync(outputPath, 'utf8') === output) {
      return { status: 'unchanged', outputPath, accepted: records.length, warnings: [] }
    }
    throw new Error(`batch ID already exists with different content: ${options.batchId}`)
  }

  const repository = await loadRepositoryMarketData(rootDir)
  const issues = await assertValidMarketData({
    legacyProfiles: repository.legacyProfiles,
    batches: [...repository.batches, batch],
    registeredTrackSlugs: repository.registeredTrackSlugs,
  })
  const warnings = issues.filter(({ severity }) => severity === 'warning')
  const temporaryPath = `${outputPath}.${process.pid}.tmp`

  mkdirSync(dirname(outputPath), { recursive: true })
  try {
    writeFileSync(temporaryPath, output, { flag: 'wx' })
    renameSync(temporaryPath, outputPath)
  } finally {
    if (existsSync(temporaryPath)) rmSync(temporaryPath)
  }

  return {
    status: 'created',
    outputPath,
    accepted: records.length,
    warnings,
  }
}

function argument(name: string) {
  const index = process.argv.indexOf(name)
  return index >= 0 ? process.argv[index + 1] : undefined
}

async function runCli() {
  const trackSlug = argument('--track')
  const filePath = argument('--file')
  const batchId = argument('--batch')
  if (!trackSlug || !filePath || !batchId) {
    throw new Error('Usage: --track <slug> --file <csv> --batch <batch-id> [--supplied-on YYYY-MM-DD]')
  }

  const result = await importMarketBatch({
    rootDir: process.cwd(),
    trackSlug,
    filePath,
    batchId,
    suppliedOn: argument('--supplied-on'),
  })
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`)
}

const isCli = process.argv[1]
  && fileURLToPath(import.meta.url) === resolve(process.argv[1])

if (isCli) {
  runCli().catch((error: unknown) => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`)
    process.exitCode = 1
  })
}
