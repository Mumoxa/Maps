// Identity review queue for the company atlas.
//
//   npm run atlas:identity            print the queue summary
//   npm run atlas:identity -- --write write markets/organizations/research/atlas-identity-queue.json
//
// Dataset-only employer names that resemble a curated company are classified as
// same-identity, parent-subsidiary or needs-decision, with the reasoning written
// out. Nothing is merged here: the queue exists so a reviewer decides, and the
// decision can then be recorded in config and applied through the importer.
//
// Step 11 of docs/national-employer-intelligence.md requires suspect joins to go
// to a reviewer queue rather than being promoted automatically.

import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { buildCompanyIntelligence } from '../src/data/organizations/universe'
import {
  buildIdentityQueue,
  summariseIdentityQueue,
  type IdentityCandidate,
} from '../src/data/organizations/identityReview'

function main(): void {
  const write = process.argv.includes('--write')
  const intelligence = buildCompanyIntelligence()
  const curated = intelligence.index.organizations.map((organization) => ({
    id: organization.id,
    name: organization.name,
  }))

  const datasetOnly = [...intelligence.index.employersByOrg.values()]
    .filter((employer) => !intelligence.index.byId.has(employer.organizationId))
    .map((employer) => ({
      datasetName: employer.canonicalName,
      professionals: employer.professionals,
      curated,
    }))

  const queue = buildIdentityQueue(datasetOnly)
  const summary = summariseIdentityQueue(queue)

  const report = {
    generatedOn: new Date().toISOString().slice(0, 10),
    summary,
    queue,
  }

  if (write) {
    const out = resolve('markets/organizations/research/atlas-identity-queue.json')
    mkdirSync(resolve('markets/organizations/research'), { recursive: true })
    writeFileSync(out, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
    process.stdout.write(`wrote ${out}\n\n`)
  }

  const lines: string[] = []
  lines.push('=== IDENTITY REVIEW QUEUE ===')
  lines.push(`${summary.total} dataset names resemble a curated company, covering ${summary.professionals} mapped people`)
  lines.push(`  same-identity     ${summary.byDisposition['same-identity']}`)
  lines.push(`  parent-subsidiary ${summary.byDisposition['parent-subsidiary']}`)
  lines.push(`  needs-decision    ${summary.byDisposition['needs-decision']}`)
  lines.push('')

  const sections: { key: IdentityCandidate['disposition']; title: string }[] = [
    { key: 'parent-subsidiary', title: 'SEPARATE ENTITIES (need their own record, never a merge)' },
    { key: 'same-identity', title: 'SAME IDENTITY (safe to alias onto the curated record)' },
    { key: 'needs-decision', title: 'NEEDS A DECISION' },
  ]
  for (const section of sections) {
    const entries = queue.filter((entry) => entry.disposition === section.key)
    if (entries.length === 0) continue
    lines.push(section.title)
    for (const entry of entries.slice(0, 20)) {
      lines.push(`  ${entry.datasetName} -> ${entry.curatedName} [${entry.professionals} people]`)
      lines.push(`    ${entry.reason}`)
    }
    if (entries.length > 20) lines.push(`  ... and ${entries.length - 20} more`)
    lines.push('')
  }
  process.stdout.write(`${lines.join('\n')}\n`)
}

main()
