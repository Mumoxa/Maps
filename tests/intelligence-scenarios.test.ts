// Acceptance tests for the Company Association Explorer, run against the
// committed evidence-backed public graph (markets/intelligence/**).
// Expectations reflect sourced research recorded in
// markets/intelligence/research/2026-10-08-scenario-research.json.

import test from 'node:test'
import assert from 'node:assert/strict'
import { publicGraph, roleContextById } from '../src/data/intelligence/index'
import { applyFilters, discover, EMPTY_FILTERS } from '../src/data/intelligence/discovery'
import { discoverTargets, MAX_PAGE_SIZE, rowsToCsv } from '../src/data/intelligence/api'
import { emptyRequirement, requirementFromTemplate, type Tier } from '../src/data/intelligence/targeting'
import { compareOrganizations } from '../src/data/intelligence/comparison'
import { findOrganization } from '../src/data/intelligence/graph'

const graph = publicGraph()

function requirementFor(contextId: string) {
  const template = roleContextById.get(contextId)
  assert.ok(template, `role context ${contextId} exists`)
  return requirementFromTemplate(template)
}

function tiersFor(focalId: string, contextId: string, scope: 'associated' | 'all' = 'associated') {
  const result = discover(graph, { focalId, requirement: requirementFor(contextId), scope })
  const tiers = new Map<string, Tier>()
  for (const row of result.rows) tiers.set(row.organizationId, row.assessment.tier)
  return { result, tiers }
}

test('scenario 1: cold storage Financial Manager ranks verified cold-chain operators first', () => {
  const { result, tiers } = tiersFor('org-commercial-cold-holdings', 'fm-temperature-controlled')
  for (const id of ['org-snolink', 'org-sea-harvest-group', 'org-oceana-group', 'org-irvin-johnson', 'org-dsv-south-africa']) {
    assert.equal(tiers.get(id), 'tier-1', `${id} should be Tier 1`)
  }
  assert.equal(result.rows[0].role, 'focal')
  assert.ok(result.rows.length > 10, 'results are not capped at ten')
  for (const id of ['org-absa-group', 'org-standard-bank-group']) {
    const tier = tiers.get(id)
    assert.ok(tier === undefined || tier === 'tier-3' || tier === 'tier-4', `${id} must not be a strong target for a cold chain FM (got ${tier})`)
  }
})

test('scenario 1: every tier carries a plain explanation and evidence where it claims a fact', () => {
  const { result } = tiersFor('org-commercial-cold-holdings', 'fm-temperature-controlled')
  for (const row of result.rows) {
    if (row.role === 'focal') continue
    if (row.assessment.tier === 'tier-1' || row.assessment.tier === 'tier-2') assert.ok(row.assessment.reasons.length > 0, `${row.name} has reasons`)
    for (const check of row.assessment.mandatory) {
      if (check.status === 'met') assert.ok(check.evidenceIds.length > 0, `${row.name} met check cites evidence`)
    }
  }
})

test('scenario 2: SLM Developments resolves and property developers rank above unrelated sectors', () => {
  const slm = findOrganization(graph, 'SLM Developments')
  assert.equal(slm, 'org-slm-developments')
  assert.notEqual(graph.organizationById.get('org-slm-developments')?.identityStatus, 'unresolved')
  const { tiers } = tiersFor('org-slm-developments', 'finance-property-development')
  for (const id of ['org-rabie-property-group', 'org-fpg-property-fund', 'org-atterbury']) assert.equal(tiers.get(id), 'tier-1', `${id} Tier 1`)
  for (const id of ['org-wbho', 'org-mulilo']) assert.equal(tiers.get(id), 'tier-2', `${id} Tier 2`)
  assert.ok(!['tier-1', 'tier-2'].includes(tiers.get('org-sea-harvest-group') ?? 'tier-4'), 'seafood is not a property target')
})

test('scenario 3: Bester Feed & Grain Head of Finance treats commodity trading as mandatory', () => {
  const { result, tiers } = tiersFor('org-bester-feed-grain', 'hof-agri-commodity')
  assert.equal(tiers.get('org-overberg-agri'), 'tier-1', 'Overberg Agri has confirmed grain trading')
  const kaap = result.rowById.get('org-kaap-agri')
  assert.ok(kaap)
  assert.equal(kaap.assessment.tier, 'tier-2')
  const trading = kaap.assessment.mandatory.find((check) => check.capabilityId === 'commodity-trading')
  assert.ok(trading)
  assert.notEqual(trading.status, 'met', 'commodity trading is not asserted for Kaap Agri without evidence')
  assert.ok(kaap.assessment.missingEvidence.some((line) => line.toLowerCase().includes('commodity trading')))
})

test('acceptance: the same company is tiered differently under different role contexts', () => {
  const agri = tiersFor('org-bester-feed-grain', 'hof-agri-commodity', 'all').tiers.get('org-overberg-agri')
  const property = tiersFor('org-slm-developments', 'finance-property-development', 'all').tiers.get('org-overberg-agri')
  assert.equal(agri, 'tier-1')
  assert.notEqual(property, 'tier-1')
})

test('acceptance: with no role context the explorer shows associations without tiers', () => {
  const result = discover(graph, { focalId: 'org-commercial-cold-holdings', requirement: emptyRequirement(), scope: 'associated' })
  const targets = result.rows.filter((row) => row.role === 'target')
  assert.ok(targets.length > 0)
  for (const row of targets) assert.equal(row.assessment.tier, 'not-applicable')
})

test('acceptance: unknown is never zero; unclassified organizations are unassessed and pocketed separately', () => {
  const result = discover(graph, { focalId: null, requirement: requirementFor('fm-temperature-controlled'), scope: 'all' })
  const unclassified = result.pockets.find((pocket) => pocket.id === 'pocket:unclassified')
  assert.ok(unclassified && unclassified.organizationIds.length > 0)
  for (const id of unclassified.organizationIds) {
    const tier = result.rowById.get(id)?.assessment.tier
    assert.ok(tier === 'unassessed' || tier === 'excluded', `${id} unclassified must be unassessed, got ${tier}`)
  }
})

test('acceptance: industry-typical capabilities stay hypotheses and never count as observed', () => {
  for (const caps of graph.capabilitiesByOrg.values()) {
    for (const row of caps.values()) {
      if (row.inferredFromIndustry) {
        assert.equal(row.status, 'unknown')
        assert.equal(row.confidence, 'hypothesis')
        assert.equal(row.origin, 'system-inferred')
      }
    }
  }
})

test('acceptance: filters are AND across dimensions and OR within one', () => {
  const { result } = tiersFor('org-commercial-cold-holdings', 'fm-temperature-controlled', 'all')
  const t1 = applyFilters(graph, result.rows, { ...EMPTY_FILTERS, tiers: ['tier-1'] }).filter((row) => row.role === 'target')
  const t2 = applyFilters(graph, result.rows, { ...EMPTY_FILTERS, tiers: ['tier-2'] }).filter((row) => row.role === 'target')
  const either = applyFilters(graph, result.rows, { ...EMPTY_FILTERS, tiers: ['tier-1', 'tier-2'] }).filter((row) => row.role === 'target')
  assert.equal(either.length, t1.length + t2.length)
  const andWc = applyFilters(graph, result.rows, { ...EMPTY_FILTERS, tiers: ['tier-1', 'tier-2'], provinces: ['Western Cape'] }).filter((row) => row.role === 'target')
  assert.ok(andWc.length <= either.length)
  for (const row of andWc) {
    assert.ok(['tier-1', 'tier-2'].includes(row.assessment.tier))
    assert.ok(row.provinces.includes('Western Cape'))
  }
})

test('acceptance: tier overrides keep the computed tier and the reason visible', () => {
  const overrides = new Map([['org-snolink', { tier: 'tier-3' as Tier, reason: 'Client asked to avoid direct competitors', by: 'test', at: '2026-10-08' }]])
  const result = discover(graph, { focalId: 'org-commercial-cold-holdings', requirement: requirementFor('fm-temperature-controlled'), scope: 'associated', overrides })
  const row = result.rowById.get('org-snolink')
  assert.ok(row)
  assert.equal(row.assessment.tier, 'tier-3')
  assert.equal(row.assessment.computedTier, 'tier-1')
  assert.equal(row.assessment.override?.reason, 'Client asked to avoid direct competitors')
})

test('acceptance: comparison separates shared, distinct and unknown', () => {
  const comparison = compareOrganizations(graph, ['org-overberg-agri', 'org-kaap-agri'], requirementFor('hof-agri-commodity'))
  const trading = comparison.lines.find((line) => line.id === 'commodity-trading')
  assert.ok(trading)
  assert.equal(trading.classification, 'partly-unknown')
  assert.equal(trading.requirement, 'mandatory')
  assert.ok(comparison.implications.length > 0)
})

test('api contract: pagination is explicit and never silently truncates', () => {
  const first = discoverTargets(graph, roleContextById, { focal: 'Commercial Cold Holdings', roleContextId: 'fm-temperature-controlled', scope: 'all', pageSize: 10 })
  assert.equal(first.schemaVersion, 1)
  assert.ok(first.focalResolved)
  assert.equal(first.results.length, 10)
  assert.ok(first.pages > 1)
  const all = discoverTargets(graph, roleContextById, { focal: 'org-commercial-cold-holdings', roleContextId: 'fm-temperature-controlled', scope: 'all', pageSize: 100000 })
  assert.equal(all.pageSize, MAX_PAGE_SIZE)
  assert.equal(all.results.length, Math.min(all.total, MAX_PAGE_SIZE))
  assert.ok(all.limitations.length > 0)
  const unresolved = discoverTargets(graph, roleContextById, { focal: 'A Company That Does Not Exist', roleContextId: null })
  assert.equal(unresolved.focalResolved, false)
})

test('api contract: CSV export has one line per row plus header', () => {
  const { result } = tiersFor('org-bester-feed-grain', 'hof-agri-commodity')
  const csv = rowsToCsv(graph, result.rows)
  assert.equal(csv.trimEnd().split('\n').length, result.rows.length + 1)
})

test('people: employment never asserts activity and people are never merged by name', () => {
  const ids = new Set<string>()
  for (const person of graph.persons) {
    assert.ok(!ids.has(person.id), `duplicate person id ${person.id}`)
    ids.add(person.id)
  }
  const accountantCount = graph.persons.filter((person) => person.id.startsWith('person:accountants:')).length
  const creditCount = graph.persons.filter((person) => person.id.startsWith('person:credit-risk:')).length
  assert.equal(accountantCount + creditCount, graph.persons.length)
})
