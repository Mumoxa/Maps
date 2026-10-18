// Scenario report for the Company Association Explorer.
//
//   npm run scenarios
//
// Prints, for each of the three reference assignments, the companies the
// role-conditional engine puts in tiers 1-3 with the rules behind them, plus the
// coverage numbers the UI shows. It exists so a reviewer can reproduce the
// demonstration from the command line instead of trusting a written summary.
// Read-only: it writes nothing.

import { buildCompanyIntelligence } from '../src/data/organizations/universe'
import { discoverAssociations } from '../src/data/organizations/discovery'
import { coverageByIndustry, universeStats } from '../src/data/organizations/analysis'
import { roleContextById } from '../src/data/organizations/roleContexts'
import type { AssociationTier } from '../src/data/organizations/types'

const { index, extraOrganizations } = buildCompanyIntelligence()

const SCENARIOS: { label: string; focalId: string; roleContextId: string }[] = [
  {
    label: 'A - Financial Manager, commercial cold storage (Commercial Cold Storage (Pty) Ltd)',
    focalId: 'org-ccs-logistics',
    roleContextId: 'role-cold-storage-financial-manager',
  },
  {
    label: 'B - Finance lead, property development (SLM Developments (Pty) Ltd)',
    focalId: 'org-slm-developments',
    roleContextId: 'role-slm-property-development',
  },
  {
    label: 'C - Head of Finance, agri commodity trading (Bester Feed & Grain (Pty) Ltd)',
    focalId: 'org-bester-feed-grain',
    roleContextId: 'role-bester-head-of-finance',
  },
]

function main() {
  const stats = universeStats(index)
  console.log(`Canonical register: ${stats.organizations} researched companies (${stats.verified} verified, ${stats.pendingVerification} pending verification), ${stats.mappedProfessionals} mapped professionals.`)
  console.log(`Discovery scan adds employers named by existing Maps datasets; the per-scenario totals below are the real scanned universe.\n`)

  for (const scenario of SCENARIOS) {
    const focal = index.byId.get(scenario.focalId)
    const roleContext = roleContextById(scenario.roleContextId)
    if (!focal || !roleContext) {
      console.log(`!! ${scenario.label}: focal or role context not found (${scenario.focalId} / ${scenario.roleContextId})`)
      continue
    }
    const discovery = discoverAssociations({ index, focalId: scenario.focalId, roleContext, extraOrganizations })
    console.log(`\n${'='.repeat(100)}`)
    console.log(scenario.label)
    console.log(`Brief: ${roleContext.brief}`)
    if (roleContext.mandatoryCapabilities.length > 0) {
      console.log(`Mandatory exposure: ${roleContext.mandatoryCapabilities.map((id) => index.capabilityById.get(id)?.name ?? id).join(', ')}`)
    }

    const tiers = discovery.matches.reduce<Record<number, number>>((totals, match) => {
      totals[match.tier] = (totals[match.tier] ?? 0) + 1
      return totals
    }, {})
    console.log(`Matched ${discovery.matches.length} companies across ${discovery.pockets.length} pockets: ${
      ([1, 2, 3, 4, 5] as AssociationTier[]).map((tier) => `tier ${tier} = ${tiers[tier] ?? 0}`).join(', ')}`)

    const best = discovery.matches
      .filter((match) => match.tier <= 3)
      .sort((left, right) => left.tier - right.tier || right.rules.length - left.rules.length)
      .slice(0, 8)
    for (const match of best) {
      const organization = index.byId.get(match.organizationId)
      console.log(`  tier ${match.tier} ${organization?.name ?? match.organizationId}`)
      console.log(`        rules: ${match.rules.map((rule) => `${rule.rule} ${rule.label}`).join('; ')}`)
      if (match.gaps.length > 0) console.log(`        missing: ${match.gaps.map((gap) => `${gap.requirement} (${gap.reason})`).join('; ')}`)
    }

    const unknown = discovery.matches.filter((match) => match.rules.some((rule) => rule.rule === 'R14-no-operational-signal')).length
    console.log(`  ${unknown} matched companies carry no operational signal: listed as unclassified/tier 5, never hidden.`)
  }

  console.log(`\n${'='.repeat(100)}`)
  console.log('Coverage by industry (mapped companies / with mapped professionals):')
  for (const row of coverageByIndustry(index).slice(0, 12)) {
    console.log(`  ${row.industryName.padEnd(38)} ${String(row.organizations).padStart(3)} mapped, ${String(row.withMappedProfessionals).padStart(3)} with people, ${row.verified} verified, ${row.pendingVerification} pending`)
  }
  console.log('\nThis is mapped coverage only. It is not a claim that every South African company in a sector has been identified.')
}

main()
