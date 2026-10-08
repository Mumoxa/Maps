// CLI for rights-checked, offline vacancy metadata imports.
// Usage: npm run hiring:import -- exports/approved.csv [--from=2025-10-08] [--to=2026-10-08]
//        npm run hiring:import -- exports/approved.csv --commit --rights-confirmed
// This CLI does not fetch job boards and does not write to organizations.json.

import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { basename, resolve, sep } from 'node:path'
import { readDrop } from './organizations-import'
import { planHiringImport, summarizeHiringEmployers } from './hiring-observations'
import type { HiringObservation } from './hiring-observations'
import type { Organization } from '../src/data/organizations/types'

const COMPANY_PATH = resolve('markets/organizations/organizations.json')
const DEFAULT_DATA_DIR = resolve('.local/hiring')

/** Licensed/raw job data must never be written into the public repository tree. */
export function privateDataDir(input: string): string {
  const target = resolve(input)
  const project = resolve('.')
  const local = resolve('.local')
  const underLocal = target === local || target.startsWith(local + sep)
  const outsideProject = target !== project && !target.startsWith(project + sep)
  if (!underLocal && !outsideProject) {
    throw new Error('Raw hiring observations must be stored in the ignored .local/ directory or outside this Git repository.')
  }
  return target
}

function dateYearEarlier(today: string): string {
  const date = new Date(today + 'T00:00:00.000Z')
  date.setUTCFullYear(date.getUTCFullYear() - 1)
  return date.toISOString().slice(0, 10)
}

function argValue(args: string[], key: string): string | undefined {
  return args.find((arg) => arg.startsWith(key + '='))?.slice(key.length + 1)
}

function writeAtomic(file: string, value: string): void {
  const tmp = file + '.writing'
  writeFileSync(tmp, value, 'utf8')
  renameSync(tmp, file)
}

function run(): void {
  const args = process.argv.slice(2)
  const file = args.find((arg) => !arg.startsWith('--'))
  if (!file) {
    process.stderr.write('Usage: npm run hiring:import -- file.csv [--from=YYYY-MM-DD] [--to=YYYY-MM-DD] [--commit --rights-confirmed]\n')
    process.exitCode = 1
    return
  }

  const ROOT = privateDataDir(argValue(args, '--data-dir') ?? DEFAULT_DATA_DIR)
  const OBSERVATIONS = resolve(ROOT, 'postings.jsonl')
  const EMPLOYERS = resolve(ROOT, 'employers.json')
  const IMPORTS = resolve(ROOT, 'import-audits')

  const now = new Date().toISOString().slice(0, 10)
  const end = argValue(args, '--to') ?? now
  const start = argValue(args, '--from') ?? dateYearEarlier(end)
  const commit = args.includes('--commit')
  if (commit && !args.includes('--rights-confirmed')) {
    process.stderr.write('Refusing commit: confirm you have authority to store/reuse these observations in private staging (--rights-confirmed).\n')
    process.exitCode = 1
    return
  }

  const inputPath = resolve(file)
  const data = readDrop(readFileSync(inputPath, 'utf8'))
  const organizationList = JSON.parse(readFileSync(COMPANY_PATH, 'utf8')) as Organization[]
  const previouslyImported = existsSync(OBSERVATIONS)
    ? readFileSync(OBSERVATIONS, 'utf8').split('\n').filter(Boolean).map((line) => JSON.parse(line) as HiringObservation)
    : []
  const plan = planHiringImport(data.rows, organizationList, previouslyImported, start, end, now)
  const merged = [...previouslyImported, ...plan.accepted]
  const employers = summarizeHiringEmployers(merged)
  const sourceCounts: Record<string, number> = {}
  for (const entry of plan.accepted) sourceCounts[entry.source] = (sourceCounts[entry.source] ?? 0) + 1
  const summary = {
    batch: basename(inputPath),
    mode: commit ? 'committed' : 'dry-run',
    stagingDirectory: ROOT,
    inputFormat: data.format,
    publicationWindow: { start, end },
    reviewedOn: now,
    inputRows: data.rows.length,
    acceptedNew: plan.accepted.length,
    rejected: plan.rejected.length,
    needsReview: plan.review.length,
    duplicateSourceIds: plan.duplicateCount,
    outsideWindow: plan.outsideWindow,
    possibleCrossBoardReposts: plan.possibleReposts,
    employersInCombinedLedger: employers.length,
    recordsInCombinedLedger: merged.length,
    acceptedBySource: sourceCounts,
    issues: [...plan.rejected, ...plan.review].slice(0, 200),
    issuesTruncated: plan.rejected.length + plan.review.length > 200,
    importantLimitations: [
      'Historical coverage is only of the records actually supplied, not all South African vacancies.',
      'A job advertisement is not evidence of a completed hire.',
      'New employer identities and proposed industries require review before canonical promotion.',
    ],
  }

  if (!commit || plan.accepted.length === 0) {
    process.stdout.write(JSON.stringify({
      ...summary,
      mode: plan.accepted.length === 0 && commit ? 'unchanged' : 'dry-run',
    }, null, 2) + '\n')
    return
  }

  mkdirSync(ROOT, { recursive: true })
  mkdirSync(IMPORTS, { recursive: true })
  writeAtomic(OBSERVATIONS, merged.map((record) => JSON.stringify(record)).join('\n') + '\n')
  writeAtomic(EMPLOYERS, JSON.stringify(employers, null, 2) + '\n')
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  writeFileSync(resolve(IMPORTS, stamp + '-' + basename(file).replace(/[^a-z0-9._-]/gi, '-') + '.json'), JSON.stringify(summary, null, 2) + '\n')
  process.stdout.write(JSON.stringify(summary, null, 2) + '\n')
}

run()
