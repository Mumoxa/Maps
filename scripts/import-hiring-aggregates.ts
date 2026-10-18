// Offline importer for an authorised Adzuna Intelligence employer hiring report.
// Input is the provider JSON payload, never a scraped web page or inferred list.
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { basename, resolve } from 'node:path'
import { planAdzunaEmployerReport, summarizeHistoricalEmployerReports } from './hiring-aggregates'
import type { HistoricalEmployerRow } from './hiring-aggregates'
import { privateDataDir } from './hiring-storage'
import type { Organization } from '../src/data/organizations/types'

function argValue(args: string[], key: string): string | undefined {
  return args.find((item) => item.startsWith(key + '='))?.slice(key.length + 1)
}

function writeAtomic(path: string, data: string): void {
  writeFileSync(path + '.pending', data, 'utf8')
  renameSync(path + '.pending', path)
}

function main(): void {
  const args = process.argv.slice(2)
  const file = args.find((a) => !a.startsWith('--'))
  const start = argValue(args, '--from')
  const end = argValue(args, '--to')
  const reportId = argValue(args, '--report-id')
  const sourceReference = argValue(args, '--source-reference')
  const permission = args.includes('--rights-confirmed')
  const commit = args.includes('--commit')
  if (!file || !start || !end || !reportId || !sourceReference || !permission) {
    process.stderr.write('Usage: npm run hiring:aggregate -- report.json --from=YYYY-MM-DD --to=YYYY-MM-DD --report-id=ID --source-reference=URI --rights-confirmed [--commit] [--data-dir=PRIVATE_PATH]\n')
    process.exitCode = 1
    return
  }
  const root = privateDataDir(argValue(args, '--data-dir') ?? '.local/hiring')
  const observationsPath = resolve(root, 'historic-employer-report-rows.jsonl')
  const candidatePath = resolve(root, 'historic-employer-candidates.json')
  const auditPath = resolve(root, 'import-audits')
  const current = existsSync(observationsPath)
    ? readFileSync(observationsPath, 'utf8').split('\n').filter(Boolean).map((line) => JSON.parse(line) as HistoricalEmployerRow)
    : []
  const meta = {
    provider: 'adzuna-intelligence' as const,
    reportId, sourceReference, countryCode: 'za',
    windowStart: start, windowEnd: end,
    receivedOn: new Date().toISOString().slice(0, 10),
    licensed: permission,
  }
  const payload = JSON.parse(readFileSync(resolve(file), 'utf8')) as unknown
  const organizations = JSON.parse(readFileSync(resolve('markets/organizations/organizations.json'), 'utf8')) as Organization[]
  const plan = planAdzunaEmployerReport(payload, meta, organizations, current)
  const combined = [...current, ...plan.accepted]
  const candidates = summarizeHistoricalEmployerReports(combined)
  const audit = {
    mode: commit ? 'committed' : 'dry-run',
    sourceType: 'historical-employer-aggregate',
    provider: meta.provider,
    reportId, sourceReference, reportedCountry: 'za',
    batch: basename(file), window: plan.window,
    sampleSizeReportedByProvider: plan.reportedSampleSize,
    accepted: plan.accepted.length,
    unchanged: plan.unchanged,
    rejected: plan.rejected,
    review: plan.review,
    combinedReportRows: combined.length,
    distinctEmployerCandidates: candidates.length,
    caveats: [
      'These are period-wide provider-reported posting counts, NOT individual vacancy rows or verified hires.',
      'Counts from overlapping windows or vendors are never summed.',
      'Industry and employer attribution remain provider-reported, pending independent review.',
      'Provider coverage and completeness for South Africa are not proven by importing a report.',
    ],
  }
  if (!commit || plan.accepted.length === 0) {
    process.stdout.write(JSON.stringify({ ...audit, mode: commit && plan.accepted.length === 0 ? 'unchanged' : 'dry-run' }, null, 2) + '\n')
    return
  }
  mkdirSync(root, { recursive: true })
  mkdirSync(auditPath, { recursive: true })
  writeAtomic(observationsPath, combined.map((row) => JSON.stringify(row)).join('\n') + '\n')
  writeAtomic(candidatePath, JSON.stringify(candidates, null, 2) + '\n')
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  writeFileSync(resolve(auditPath, stamp + '-historical-' + basename(file).replace(/[^a-z0-9._-]/gi, '-') + '.json'), JSON.stringify(audit, null, 2) + '\n')
  process.stdout.write(JSON.stringify(audit, null, 2) + '\n')
}

main()
