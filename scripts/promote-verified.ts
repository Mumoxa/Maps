// Promote companies that already pass the verification gate.
//
//   npm run atlas:promote                 dry run: list what would change
//   npm run atlas:promote -- --commit     backfill dates, then verify
//
// Two long-standing inconsistencies are corrected here, and neither loosens the
// standard:
//
//   1. `lastVerified` was empty on records whose own sources carry a checked date.
//      The date a reviewer last read a source is knowable from the record itself,
//      so it is derived from the newest source rather than invented. Records with
//      no dated source keep an empty date and stay unpromoted.
//   2. A company could satisfy every requirement of the verification gate while
//      still carrying `needs-verification`, purely because no batch ever asked.
//      That made the status depend on which batch a company happened to be in
//      rather than on its evidence. Every gate-eligible record is promoted, and
//      the gate remains the only test applied.
//
// Nothing is promoted that the gate rejects, and the gate is not modified here.

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { verificationGate } from '../src/data/organizations/verification'
import type { Organization } from '../src/data/organizations/types'

const FILE = resolve('markets/organizations/organizations.json')

/** The newest checked date across a record's own evidence. */
export function latestSourceDate(organization: Organization): string {
  let latest = ''
  const consider = (date: string | undefined) => {
    if (!date) return
    const normalised = date.slice(0, 10)
    if (/^\d{4}-\d{2}-\d{2}$/.test(normalised) && normalised > latest) latest = normalised
  }
  for (const source of organization.sources) consider(source.checkedOn)
  if (organization.taxonomy) consider(organization.taxonomy.checkedOn)
  for (const link of organization.industries) consider(link.checkedOn)
  for (const link of organization.capabilities) consider(link.checkedOn)
  for (const location of organization.locations) consider(location.checkedOn)
  for (const entry of organization.scale) consider(entry.checkedOn)
  return latest
}

export interface PromotionPlan {
  dated: { organization: Organization; from: string; to: string }[]
  promoted: Organization[]
  refused: { organization: Organization; reasons: string[] }[]
}

/** Pure plan, so the tool can be tested without touching the data files. */
export function planPromotions(organizations: Organization[]): PromotionPlan {
  const dated: PromotionPlan['dated'] = []
  const promoted: Organization[] = []
  const refused: PromotionPlan['refused'] = []

  const withDates = organizations.map((organization) => {
    if (organization.lastVerified) return organization
    const latest = latestSourceDate(organization)
    if (!latest) return organization
    dated.push({ organization, from: '', to: latest })
    return { ...organization, lastVerified: latest }
  })

  const next = withDates.map((organization) => {
    if (organization.status === 'verified') return organization
    const gate = verificationGate({
      organization,
      hasPlacement: organization.industries.length > 0 || Boolean(organization.taxonomy),
    })
    if (gate.eligible) {
      promoted.push(organization)
      return { ...organization, status: 'verified' as const }
    }
    refused.push({ organization, reasons: gate.reasons })
    return organization
  })

  void next
  return { dated, promoted, refused }
}

function main(): void {
  const commit = process.argv.includes('--commit')
  const organizations = JSON.parse(readFileSync(FILE, 'utf8')) as Organization[]
  const plan = planPromotions(organizations)

  const dated = new Set(plan.dated.map((entry) => entry.organization.id))
  const promoted = new Set(plan.promoted.map((organization) => organization.id))

  const summary = {
    mode: commit ? 'commit' : 'dry-run',
    considered: organizations.length,
    datesBackfilled: plan.dated.length,
    promoted: plan.promoted.length,
    stillUnverified: plan.refused.length,
    promotedNames: plan.promoted.map((organization) => organization.name).slice(0, 40),
    refusedSample: plan.refused.slice(0, 5).map((entry) => ({
      name: entry.organization.name,
      reasons: entry.reasons,
    })),
  }

  if (!commit) {
    process.stdout.write(`${JSON.stringify(summary, null, 2)}\n\nNo file was written. Re-run with --commit to apply.\n`)
    return
  }

  const next = organizations.map((organization) => {
    let updated = organization
    if (dated.has(organization.id)) {
      updated = { ...updated, lastVerified: latestSourceDate(organization) }
    }
    if (promoted.has(organization.id)) {
      updated = { ...updated, status: 'verified' as const }
    }
    return updated
  })

  writeFileSync(FILE, `${JSON.stringify(next, null, 2)}\n`, 'utf8')
  process.stdout.write(`${JSON.stringify({ ...summary, wrote: 'markets/organizations/organizations.json' }, null, 2)}\n`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main()
