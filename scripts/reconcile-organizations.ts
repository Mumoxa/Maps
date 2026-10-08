// Regenerates the canonical organization registry from legacy track datasets
// plus curated research identities.
//
//   npm run intel:reconcile            write files
//   npm run intel:reconcile -- --check fail when committed files are out of date
//
// Outputs (all generated, deterministic, safe to rerun):
//   markets/intelligence/organizations.json
//   markets/intelligence/research/legacy-reconciliation.generated.json
//   markets/intelligence/reconciliation-report.json

import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { reconcileOrganizations, type LegacyIndustryMap } from '../src/data/intelligence/reconcile'
import type { OrganizationRegistryFile, ResearchBatch } from '../src/data/intelligence/types'

const ROOT = join(import.meta.dirname, '..')
const INTEL = join(ROOT, 'markets', 'intelligence')
const RUN_DATE = '2026-10-08'

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, 'utf8')) as T
}

function readJsonl<T>(path: string): T[] {
  return readFileSync(path, 'utf8')
    .split('\n')
    .filter((line) => line.trim())
    .map((line) => JSON.parse(line) as T)
}

export function buildReconciliation() {
  const researchDir = join(INTEL, 'research')
  const curated = readdirSync(researchDir)
    .filter((file) => file.endsWith('.json') && !file.endsWith('.generated.json'))
    .sort()
    .map((file) => readJson<ResearchBatch>(join(researchDir, file)))

  const output = reconcileOrganizations({
    accountants: readJsonl(join(ROOT, 'markets', 'accountants', 'companies.jsonl')),
    creditRisk: readJson(join(ROOT, 'companies.json')),
    financeTargets: readJsonl(join(ROOT, 'markets', 'accountants', 'finance_team_targets.jsonl')),
    identities: curated.flatMap((batch) => batch.identities),
    industryMap: readJson<LegacyIndustryMap>(join(INTEL, 'taxonomy', 'legacy-industry-map.json')),
    runDate: RUN_DATE,
  })

  const researchClassified = new Set(curated.flatMap((batch) => batch.organizationIndustries.map((row) => row.organizationId)))
  output.report.unclassifiedOrganizations = output.report.unclassifiedOrganizations.filter((row) => !researchClassified.has(row.organizationId))

  const registry: OrganizationRegistryFile = {
    schemaVersion: 1,
    generatedBy: 'scripts/reconcile-organizations.ts',
    organizations: output.organizations,
  }
  return {
    files: [
      { path: join(INTEL, 'organizations.json'), body: `${JSON.stringify(registry, null, 2)}\n` },
      { path: join(researchDir, 'legacy-reconciliation.generated.json'), body: `${JSON.stringify(output.legacyBatch, null, 2)}\n` },
      { path: join(INTEL, 'reconciliation-report.json'), body: `${JSON.stringify(output.report, null, 2)}\n` },
    ],
    report: output.report,
  }
}

const isMain = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/').split('/').pop() as string)

if (isMain) {
  const check = process.argv.includes('--check')
  const { files, report } = buildReconciliation()
  let stale = 0
  for (const file of files) {
    let current = ''
    try {
      current = readFileSync(file.path, 'utf8')
    } catch {
      current = ''
    }
    if (current === file.body) continue
    stale++
    if (!check) writeFileSync(file.path, file.body)
  }
  const summary = { ...report.counts, unmappedLabels: report.unmappedIndustryLabels.length, missingLineage: report.missingLineage.length, changedFiles: stale }
  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`)
  if (report.missingLineage.length > 0) {
    process.stderr.write(`Research identities reference unknown legacy records: ${JSON.stringify(report.missingLineage)}\n`)
    process.exit(1)
  }
  if (check && stale > 0) {
    process.stderr.write('Generated intelligence files are out of date. Run npm run intel:reconcile.\n')
    process.exit(1)
  }
}
