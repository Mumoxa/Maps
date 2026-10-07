// Search Bank importer — the write path for the recruiter's candidate bank.
//
//   npm run bank:import -- <file.csv|file.json|file.txt> [options]
//
// Reads a dropped file (CSV, JSON, or pasted `Key: value` blocks), normalises
// every row onto the uniform BankCandidate shape, files each candidate under
// its search (creating the search if the bank does not have it yet), and
// rewrites markets/search-bank/bank.json. Each drop is also kept verbatim under
// markets/search-bank/drops/ so the bank can always be audited.
//
// The normaliser is shared with the in-browser drop panel
// (src/pages/SearchBankPage.tsx), so a candidate stored either way is stored
// identically.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { clean } from '../src/data/searchBank/normalise'
import { emptyBank, ingestDrop } from '../src/data/searchBank/ingest'
import type { SearchBankFile } from '../src/data/searchBank/types'

export interface ImportSearchBankOptions {
  rootDir: string
  filePath: string
  /** Search to file candidates under when a row does not name one. */
  defaultSearch?: string
  /** Client recorded on searches created by this drop. */
  defaultClient?: string
  /** Overrides the source label stored on each candidate (default: file name). */
  source?: string
  /** ISO date stamped as addedOn/updatedOn (default: today). */
  today?: string
  /** Parse and normalise, but write nothing. */
  dryRun?: boolean
}

export interface ImportSearchBankResult {
  status: 'imported' | 'unchanged' | 'dry-run'
  bankPath: string
  dropPath: string | null
  report: ReturnType<typeof ingestDrop>['report']
}

function readBank(bankPath: string, today: string): SearchBankFile {
  if (!existsSync(bankPath)) return emptyBank(today)
  const parsed = JSON.parse(readFileSync(bankPath, 'utf8')) as SearchBankFile
  return {
    schemaVersion: 1,
    generatedOn: parsed.generatedOn ?? today,
    searches: parsed.searches ?? [],
    candidates: parsed.candidates ?? [],
  }
}

function dropPathFor(rootDir: string, fileName: string, today: string): string {
  const stamp = today.replace(/-/g, '')
  const slug = basename(fileName).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'drop'
  return join(rootDir, 'markets', 'search-bank', 'drops', `${stamp}-${slug}.json`)
}

export async function importSearchBank(options: ImportSearchBankOptions): Promise<ImportSearchBankResult> {
  const rootDir = resolve(options.rootDir)
  const filePath = resolve(options.filePath)
  const today = options.today ?? new Date().toISOString().slice(0, 10)
  const text = readFileSync(filePath, 'utf8')
  const bankPath = join(rootDir, 'markets', 'search-bank', 'bank.json')

  const bank = readBank(bankPath, today)
  const result = ingestDrop(text, {
    bank,
    today,
    fileName: basename(filePath),
    defaultSearch: options.defaultSearch,
    defaultClient: options.defaultClient,
    source: options.source ?? basename(filePath),
  })

  const { report } = result
  if (report.read === 0 || (report.added === 0 && report.updated === 0)) {
    const reasons = report.issues.map((issue) => `row ${issue.rowNumber} ${issue.field}: ${issue.reason}`).join('; ')
    throw new Error(`no candidates could be stored from ${basename(filePath)}${reasons ? ` — ${reasons}` : ''}`)
  }

  const output = `${JSON.stringify(result.bank, null, 2)}\n`
  const dropPath = dropPathFor(rootDir, filePath, today)
  const dropRecord = {
    droppedOn: today,
    sourceFile: basename(filePath),
    sourceLabel: options.source ?? basename(filePath),
    defaultSearch: clean(options.defaultSearch ?? '') || null,
    defaultClient: clean(options.defaultClient ?? '') || null,
    format: report.format,
    read: report.read,
    added: report.added,
    updated: report.updated,
    searchesCreated: report.searchesCreated,
    crossSearchMatches: report.crossSearchMatches,
    issues: report.issues,
  }

  if (options.dryRun) {
    return { status: 'dry-run', bankPath, dropPath: null, report }
  }

  if (existsSync(bankPath) && readFileSync(bankPath, 'utf8') === output) {
    return { status: 'unchanged', bankPath, dropPath: null, report }
  }

  mkdirSync(dirname(bankPath), { recursive: true })
  writeFileSync(bankPath, output)
  mkdirSync(dirname(dropPath), { recursive: true })
  writeFileSync(dropPath, `${JSON.stringify(dropRecord, null, 2)}\n`)

  return { status: 'imported', bankPath, dropPath, report }
}

function argument(name: string): string | undefined {
  const index = process.argv.indexOf(name)
  return index >= 0 ? process.argv[index + 1] : undefined
}

function positional(): string | undefined {
  return process.argv.slice(2).find((value) => !value.startsWith('--'))
}

async function runCli() {
  const filePath = positional()
  if (!filePath) {
    throw new Error(
      'Usage: npm run bank:import -- <file.csv|file.json|file.txt> [--search "Search name"] [--client "Client"] [--source label] [--supplied-on YYYY-MM-DD] [--dry-run]',
    )
  }
  const result = await importSearchBank({
    rootDir: process.cwd(),
    filePath,
    defaultSearch: argument('--search'),
    defaultClient: argument('--client'),
    source: argument('--source'),
    today: argument('--supplied-on'),
    dryRun: process.argv.includes('--dry-run'),
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
