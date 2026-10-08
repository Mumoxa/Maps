// Validates the public company-intelligence bundle. Runs as part of `npm run build`.
//
// Checks:
//   1. Taxonomy integrity (parents, cycles, value chain, role-context references).
//   2. Every research batch file is registered in src/data/intelligence/index.ts.
//   3. Every research batch passes reference and evidence integrity.
//   4. Generated registry files are up to date (same as `npm run intel:reconcile -- --check`).
//   5. No blocking data-quality errors in the built graph.
//   6. Public-bundle guard: no personal contact details in committed intelligence
//      files or in markets/search-bank/bank.json (which is bundled into the public site).

import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { publicBatches, publicGraph, roleContexts, taxonomy } from '../src/data/intelligence/index'
import { runQualityChecks } from '../src/data/intelligence/quality'
import { validateTaxonomy } from '../src/data/intelligence/taxonomy'
import { validateResearchBatch } from '../src/data/workspace/importer'
import type { ResearchBatch } from '../src/data/intelligence/types'
import { buildReconciliation } from './reconcile-organizations'

const ROOT = join(import.meta.dirname, '..')
const INTEL = join(ROOT, 'markets', 'intelligence')
const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
const PHONE = /(?:\+27|\b0)[\s-]?\d{2}[\s-]?\d{3}[\s-]?\d{4}\b/

const errors: string[] = []

for (const problem of validateTaxonomy(taxonomy, roleContexts)) errors.push(`taxonomy: ${problem}`)

const registered = new Set(publicBatches.map((batch) => batch.batchId))
const researchDir = join(INTEL, 'research')
for (const name of readdirSync(researchDir).filter((file) => file.endsWith('.json'))) {
  const batch = JSON.parse(readFileSync(join(researchDir, name), 'utf8')) as ResearchBatch
  if (!registered.has(batch.batchId)) errors.push(`research/${name}: batch ${batch.batchId} is not registered in publicBatches`)
}

const graph = publicGraph()
for (const batch of publicBatches) {
  for (const problem of validateResearchBatch(graph, batch)) errors.push(`batch ${batch.batchId}: ${problem}`)
}

for (const file of buildReconciliation().files) {
  let current = ''
  try {
    current = readFileSync(file.path, 'utf8')
  } catch {
    current = ''
  }
  if (current !== file.body) errors.push(`${file.path.replace(ROOT, '.')} is out of date; run npm run intel:reconcile`)
}

const blocking = runQualityChecks(graph).filter((issue) => issue.severity === 'error')
for (const issue of blocking) errors.push(`quality ${issue.check}: ${issue.message}`)

function scanFile(path: string) {
  const text = readFileSync(path, 'utf8')
  if (EMAIL.test(text)) errors.push(`${path.replace(ROOT, '.')} contains an email address`)
  if (PHONE.test(text)) errors.push(`${path.replace(ROOT, '.')} contains a phone number`)
}
function scanDir(dir: string) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) scanDir(path)
    else if (entry.name.endsWith('.json')) scanFile(path)
  }
}
scanDir(join(INTEL, 'research'))
scanDir(join(INTEL, 'taxonomy'))

const bank = JSON.parse(readFileSync(join(ROOT, 'markets', 'search-bank', 'bank.json'), 'utf8')) as { candidates?: { id?: string; email?: string; phone?: string }[] }
for (const candidate of bank.candidates ?? []) {
  if (candidate.email || candidate.phone) {
    errors.push(`search-bank/bank.json candidate ${candidate.id ?? '?'} has contact details; bank.json is bundled into the public site, keep contact details out of it`)
  }
}

if (errors.length) {
  process.stderr.write(`Intelligence validation failed (${errors.length}):\n  ${errors.join('\n  ')}\n`)
  process.exit(1)
}
process.stdout.write(`${JSON.stringify({ status: 'ok', batches: publicBatches.length, organizations: graph.organizations.length, evidence: graph.evidenceById.size }, null, 2)}\n`)
