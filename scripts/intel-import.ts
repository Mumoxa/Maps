// Review a structured research file (CSV or JSON) against the public graph and,
// when asked, write it as a curated PUBLIC research batch.
//
//   npm run intel:import -- research.csv                 preview only (default)
//   npm run intel:import -- research.csv --write cold-chain-update
//
// --write creates markets/intelligence/research/<date>-<name>.json. That file is
// committed and bundled into the public site, so only import non-confidential
// company facts with public evidence. Client names, candidate assessments and
// recruiter notes belong in the private workspace import (/intelligence/import),
// which stays in the browser.
//
// The same content hash is never written twice, rows without evidence are
// rejected, and rerunning `npm run intel:reconcile` afterwards keeps the
// registry deterministic.

import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { basename, join } from 'node:path'
import { publicGraph, INTELLIGENCE_AS_OF } from '../src/data/intelligence/index'
import { previewImport, validateResearchBatch } from '../src/data/workspace/importer'
import { slugify } from '../src/data/slug'
import type { ResearchBatch } from '../src/data/intelligence/types'

const ROOT = join(import.meta.dirname, '..')
const RESEARCH_DIR = join(ROOT, 'markets', 'intelligence', 'research')
const CONTACT_PATTERN = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|(?:\+27|\b0)[\s-]?\d{2}[\s-]?\d{3}[\s-]?\d{4}\b/i

const argv = process.argv.slice(2)
const file = argv.find((arg) => !arg.startsWith('--'))
const writeIndex = argv.indexOf('--write')
const writeName = writeIndex >= 0 ? argv[writeIndex + 1] : null

if (!file) {
  process.stderr.write('Usage: npm run intel:import -- <file.csv|file.json> [--write <batch-name>]\n')
  process.exit(1)
}

const text = readFileSync(file, 'utf8')
const committedHashes = new Set<string>()
for (const name of readdirSync(RESEARCH_DIR)) {
  if (!name.endsWith('.json')) continue
  const batch = JSON.parse(readFileSync(join(RESEARCH_DIR, name), 'utf8')) as ResearchBatch & { sourceContentHash?: string }
  if (batch.sourceContentHash) committedHashes.add(batch.sourceContentHash)
}

const graph = publicGraph()
const preview = previewImport(graph, text, basename(file), INTELLIGENCE_AS_OF, committedHashes)
process.stdout.write(`${JSON.stringify({ file: basename(file), contentHash: preview.contentHash, alreadyImported: preview.alreadyImported, fatal: preview.fatal, summary: preview.summary }, null, 2)}\n`)
for (const row of preview.rows) {
  if (row.status === 'new') continue
  process.stdout.write(`  line ${row.line} ${row.company || '(no company)'}: ${row.status}${row.issues.length ? ` (${row.issues.join('; ')})` : ''}\n`)
}

if (!writeName) process.exit(preview.fatal ? 1 : 0)
if (preview.fatal) process.exit(1)
if (preview.alreadyImported) {
  process.stderr.write('This file has already been written as a research batch. Nothing to do.\n')
  process.exit(1)
}
if (CONTACT_PATTERN.test(text)) {
  process.stderr.write('The file contains an email address or phone number. Personal contact details must not be committed to the public repository.\n')
  process.exit(1)
}
const problems = validateResearchBatch(graph, preview.batch)
if (problems.length) {
  process.stderr.write(`Batch failed validation:\n  ${problems.join('\n  ')}\n`)
  process.exit(1)
}
const slug = slugify(writeName)
const batchId = `rb-${INTELLIGENCE_AS_OF}-${slug}`
const outPath = join(RESEARCH_DIR, `${INTELLIGENCE_AS_OF}-${slug}.json`)
if (existsSync(outPath)) {
  process.stderr.write(`${outPath} already exists. Choose another batch name.\n`)
  process.exit(1)
}
// Rewrite private-workspace ids into public batch ids.
const body = JSON.stringify({ ...preview.batch, batchId, researcher: 'npm run intel:import', sourceContentHash: preview.contentHash }, null, 2)
  .replaceAll(`ws-import-${preview.contentHash}`, batchId)
writeFileSync(outPath, `${body}\n`)
process.stdout.write(`Wrote ${outPath}.\nNext: import it in src/data/intelligence/index.ts (publicBatches), run npm run intel:reconcile, then npm run validate:intel and npm test.\n`)
