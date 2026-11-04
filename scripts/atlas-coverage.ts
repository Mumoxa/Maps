// Coverage ledger for the company atlas.
//
//   npm run atlas:coverage              human summary
//   npm run atlas:coverage -- --json    machine-readable audit
//   npm run atlas:coverage -- --queue   also write the research work queue
//
// The atlas is only trustworthy if its gaps are counted, not estimated. This
// tool measures every organisation in the visible universe against the same
// standard fields as the importer's verification gate
// (`src/data/organizations/verification.ts`), reports the shortfall per field,
// and emits a prioritised research queue.
//
// It asserts nothing: an empty field is reported as missing research, never as
// a negative finding about the company.

import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { buildCompanyIntelligence } from '../src/data/organizations/universe'
import { organizationTaxonomy } from '../src/data/organizations/taxonomyPlacement'
import { classifyFootprint, isEstablishedBand } from '../src/data/organizations/footprint'
import { buildIdentityQueue, summariseIdentityQueue } from '../src/data/organizations/identityReview'
import {
  STALE_AFTER_DAYS,
  STANDARD_FIELDS,
  standardChecks,
  type StandardCheckKey,
} from '../src/data/organizations/verification'
import type { Organization } from '../src/data/organizations/types'

export interface CoverageRow {
  id: string
  name: string
  /** Present in the curated register, not only referenced by a dataset. */
  curated: boolean
  datasets: string[]
  professionals: number
  status: Organization['status']
  checks: Record<StandardCheckKey, boolean>
}

interface UnestablishedEmployer {
  note: string
  datasets: string[]
  professionals: number
}

function buildRows(today: string): {
  rows: CoverageRow[]
  unestablished: UnestablishedEmployer[]
  identityQueue: ReturnType<typeof buildIdentityQueue>
} {
  const intelligence = buildCompanyIntelligence()
  const relatedOrganizations = new Set<string>(intelligence.index.relationshipsByOrg.keys())

  const rows = intelligence.all.map((organization) => {
    const employer = intelligence.index.employersByOrg.get(organization.id)
    const placement = organizationTaxonomy(organization)
    const hasPlacement = placement.entries.length > 0
    return {
      id: organization.id,
      name: organization.name,
      curated: intelligence.index.byId.has(organization.id),
      datasets: employer?.datasets ?? organization.datasets,
      professionals: employer?.professionals ?? 0,
      status: organization.status,
      checks: standardChecks({
        organization,
        hasPlacement,
        footprintEstablished: isEstablishedBand(classifyFootprint(organization).band),
        hasRelationship: relatedOrganizations.has(organization.id),
        today,
      }),
    }
  })

  // Dataset-only names that resemble a curated company. Reported, never merged:
  // see src/data/organizations/identityReview.ts for why similarity is not identity.
  const curated = intelligence.index.organizations.map((organization) => ({
    id: organization.id,
    name: organization.name,
  }))
  const identityQueue = buildIdentityQueue(
    [...intelligence.index.employersByOrg.values()]
      .filter((employer) => !intelligence.index.byId.has(employer.organizationId))
      .map((employer) => ({
        datasetName: employer.canonicalName,
        professionals: employer.professionals,
        curated,
      })),
  )

  return { rows, unestablished: intelligence.unestablishedEmployers, identityQueue }
}

function summarise(rows: CoverageRow[]) {
  return STANDARD_FIELDS.map((field) => {
    const covered = rows.filter((row) => row.checks[field.key]).length
    return {
      key: field.key,
      label: field.label,
      rationale: field.rationale,
      covered,
      total: rows.length,
      shortfall: rows.length - covered,
      percentage: rows.length === 0 ? 0 : Math.round((covered / rows.length) * 1000) / 10,
    }
  })
}

function missingOf(row: CoverageRow): StandardCheckKey[] {
  return STANDARD_FIELDS.filter((field) => !row.checks[field.key]).map((field) => field.key)
}

/**
 * Curated companies carrying the most mapped people matter most: they are the
 * companies a recruiter actually reaches. Dataset-only names come after, with
 * people count breaking ties so the queue is never arbitrary.
 */
function rank(row: CoverageRow): number {
  const peopleWeight = Math.min(row.professionals, 60)
  return (row.curated ? 1000 : 0) + peopleWeight * 4 + missingOf(row).length
}

function main() {
  const args = process.argv.slice(2)
  const today = new Date().toISOString().slice(0, 10)
  const { rows, unestablished, identityQueue } = buildRows(today)
  const fields = summarise(rows)

  const fullyCovered = rows.filter((row) => missingOf(row).length === 0)
  const unestablishedPeople = unestablished.reduce((total, entry) => total + entry.professionals, 0)

  const report = {
    generatedOn: today,
    standard: { staleAfterDays: STALE_AFTER_DAYS, fields: STANDARD_FIELDS },
    universe: {
      total: rows.length,
      curated: rows.filter((row) => row.curated).length,
      datasetOnly: rows.filter((row) => !row.curated).length,
      verified: rows.filter((row) => row.status === 'verified').length,
      listedOnly: rows.filter((row) => row.status === 'listed-only').length,
      needsVerification: rows.filter((row) => row.status === 'needs-verification').length,
      withMappedProfessionals: rows.filter((row) => row.professionals > 0).length,
      meetingEveryStandardField: fullyCovered.length,
    },
    coverage: fields,
    /**
     * People whose employer the source never established. Not companies, so they
     * are excluded from the universe, but counted here so the number of mapped
     * professionals still reconciles.
     */
    unestablishedEmployers: {
      notes: unestablished.length,
      professionals: unestablishedPeople,
      detail: unestablished,
    },
    identityReview: summariseIdentityQueue(identityQueue),
    byDataset: Object.fromEntries(
      [...new Set(rows.flatMap((row) => row.datasets))].sort().map((dataset) => {
        const inDataset = rows.filter((row) => row.datasets.includes(dataset))
        return [
          dataset,
          {
            organizations: inDataset.length,
            fullyCovered: inDataset.filter((row) => missingOf(row).length === 0).length,
            professionals: inDataset.reduce((total, row) => total + row.professionals, 0),
          },
        ]
      }),
    ),
    queue: [...rows]
      .sort((left, right) => rank(right) - rank(left) || left.name.localeCompare(right.name))
      .map((row) => ({
        id: row.id,
        name: row.name,
        curated: row.curated,
        professionals: row.professionals,
        missing: missingOf(row),
      })),
  }

  if (args.includes('--queue') || args.includes('--json')) {
    const out = resolve('markets/organizations/research/atlas-coverage.json')
    mkdirSync(resolve('markets/organizations/research'), { recursive: true })
    writeFileSync(out, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
    if (args.includes('--json')) {
      process.stdout.write(`${JSON.stringify(report, null, 2)}\n`)
      return
    }
    process.stdout.write(`wrote ${out}\n\n`)
  }

  const lines: string[] = []
  lines.push('=== ATLAS COVERAGE LEDGER ===')
  lines.push(`generated ${today} · ${report.universe.total} organizations · standard: ${STANDARD_FIELDS.length} evidence fields`)
  lines.push('')
  lines.push(`curated register             ${report.universe.curated}`)
  lines.push(`dataset-only (not curated)   ${report.universe.datasetOnly}`)
  lines.push(`status verified              ${report.universe.verified}`)
  lines.push(`status listed-only           ${report.universe.listedOnly}  (third-party listing confirms the company; nothing on its own domain read)`)
  lines.push(`status needs-verification    ${report.universe.needsVerification}`)
  lines.push(`with mapped professionals    ${report.universe.withMappedProfessionals}`)
  lines.push(`meeting every standard field ${report.universe.meetingEveryStandardField}`)
  lines.push('')
  lines.push(
    `employer not established     ${unestablishedPeople} people across ${unestablished.length} source notes (not companies; excluded from the universe, counted here so no mapped person disappears)`,
  )
  const identity = summariseIdentityQueue(identityQueue)
  lines.push(
    `identity review queue        ${identity.total} dataset names resembling a curated company, ${identity.professionals} people (${identity.byDisposition['parent-subsidiary']} separate entities, ${identity.byDisposition['same-identity']} same identity, ${identity.byDisposition['needs-decision']} need a decision)`,
  )
  lines.push('')
  lines.push('FIELD                              COVERED   TOTAL   GAP    PCT')
  for (const field of fields) {
    const name = field.label.padEnd(33).slice(0, 33)
    lines.push(
      `${name} ${String(field.covered).padStart(7)} ${String(field.total).padStart(7)} ${String(field.shortfall).padStart(6)} ${String(field.percentage).padStart(6)}%`,
    )
  }
  lines.push('')
  lines.push('NEXT IN THE RESEARCH QUEUE (top 25, curated and people-carrying first)')
  for (const entry of report.queue.slice(0, 25)) {
    lines.push(
      `  ${entry.name} [${entry.curated ? 'curated' : 'dataset'}, ${entry.professionals} people] missing: ${entry.missing.join(', ') || 'nothing'}`,
    )
  }
  process.stdout.write(`${lines.join('\n')}\n`)
}

main()
