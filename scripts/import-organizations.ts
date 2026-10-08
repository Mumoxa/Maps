// CLI: import structured company intelligence into the canonical model.
//
//   npm run organizations:import -- <file> [--type companies] [--commit]
//
// Without --commit this is a dry run: it prints exactly what would change
// (new entities, updated entities, existing relationships, conflicts, missing
// values) and writes nothing. With --commit it writes the data files and an
// audit record of the batch. Re-importing the same file commits nothing new.

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve, basename } from 'node:path'
import {
  applyPlan,
  detectType,
  planImport,
  planSummary,
  readDrop,
  type Dataset,
  type ImportType,
} from './organizations-import'
import { runQualityChecks } from '../src/data/organizations/quality'

const DIR = resolve('markets/organizations')

function readJson<T>(name: string): T {
  return JSON.parse(readFileSync(resolve(DIR, name), 'utf8')) as T
}

function main() {
  const args = process.argv.slice(2)
  const file = args.find((argument) => !argument.startsWith('--'))
  const commit = args.includes('--commit')
  const typeArg = args.find((argument) => argument.startsWith('--type='))?.split('=')[1] as ImportType | undefined

  if (!file) {
    process.stderr.write('usage: npm run organizations:import -- <file.csv|file.json|file.jsonl> [--type companies] [--commit]\n')
    process.exitCode = 1
    return
  }

  const dataset: Dataset = {
    industries: readJson('industries.json'),
    capabilities: readJson('capabilities.json'),
    organizations: readJson('organizations.json'),
    relationships: readJson('corporate-relationships.json'),
    associations: readJson('associations.json'),
    intelligence: readJson('recruiter-intelligence.json'),
  }

  const { rows, format } = readDrop(readFileSync(resolve(file), 'utf8'))
  const type = typeArg ?? detectType(rows.map((row) => Object.fromEntries(
    Object.entries(row).map(([key, value]) => [key.toLowerCase(), String(value)]),
  )) as Record<string, string>[])
  const plan = planImport(rows, type, dataset)
  const summary = planSummary(plan)

  if (!commit) {
    process.stdout.write(`${JSON.stringify({ mode: 'dry-run', format, ...summary }, null, 2)}\n`)
    return
  }

  const next = applyPlan(dataset, plan)
  const outputs: [string, unknown][] = [
    ['organizations.json', next.organizations],
    ['corporate-relationships.json', next.relationships],
    ['associations.json', next.associations],
    ['recruiter-intelligence.json', next.intelligence],
  ]
  const serialised = outputs.map(([name, payload]) => [name, `${JSON.stringify(payload, null, 2)}\n`] as const)
  const changed = serialised.filter(([name, text]) => (
    !existsSync(resolve(DIR, name)) || readFileSync(resolve(DIR, name), 'utf8') !== text
  ))

  // Re-importing a batch that is already recorded writes nothing and creates no
  // audit record: idempotency has to be visible in the output, not implied.
  if (changed.length === 0) {
    process.stdout.write(`${JSON.stringify({
      mode: 'unchanged',
      reason: 'every row in this batch is already recorded; no file was rewritten and no audit record was created',
      ...summary,
    }, null, 2)}\n`)
    return
  }

  for (const [name, text] of serialised) writeFileSync(resolve(DIR, name), text, 'utf8')

  const issues = runQualityChecks({
    organizations: next.organizations,
    industries: next.industries,
    capabilities: next.capabilities,
    relationships: next.relationships,
    associations: next.associations,
    intelligence: next.intelligence,
  })

  const audit = {
    batch: basename(file),
    format,
    importedOn: new Date().toISOString(),
    ...summary,
    qualityAfterCommit: {
      errors: issues.filter((issue) => issue.severity === 'error').length,
      warnings: issues.filter((issue) => issue.severity === 'warning').length,
    },
  }
  mkdirSync(resolve(DIR, 'batches'), { recursive: true })
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  writeFileSync(resolve(DIR, 'batches', `${stamp}-${basename(file)}.audit.json`), `${JSON.stringify(audit, null, 2)}\n`, 'utf8')

  process.stdout.write(`${JSON.stringify({ mode: 'committed', ...summary, qualityAfterCommit: audit.qualityAfterCommit }, null, 2)}\n`)
  if (audit.qualityAfterCommit.errors > 0) {
    process.stderr.write(`committed with ${audit.qualityAfterCommit.errors} data-quality error(s) outstanding; run npm run validate:organizations\n`)
  }
}

main()
