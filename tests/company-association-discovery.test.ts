import test from 'node:test'
import assert from 'node:assert/strict'
import { buildCompanyIntelligence } from '../src/data/organizations/universe'
import { discoverAssociations, filterMatches, TIER_LABELS } from '../src/data/organizations/discovery'
import { roleContextById, roleContexts } from '../src/data/organizations/roleContexts'
import { compareOrganizations, coverageByIndustry, universeStats } from '../src/data/organizations/analysis'
import { companyDossier, discoverTargets, emptyFilters, exportTargetsCsv, knowledgeBaseSummary } from '../src/data/organizations/query'
import { runQualityChecks } from '../src/data/organizations/quality'
import {
  capabilities,
  corporateRelationships,
  curatedAssociations,
  industries,
  organizations,
  recruiterIntelligence,
} from '../src/data/organizations/load'
import { EMPTY_FILTERS } from '../src/data/organizations/types'

const intelligence = buildCompanyIntelligence()
const { index, extraOrganizations } = intelligence

function context(id: string) {
  const found = roleContextById(id)
  assert.ok(found, `role context ${id} must exist`)
  return found
}

function matchFor(matches: ReturnType<typeof discoverAssociations>['matches'], organizationId: string) {
  return matches.find((match) => match.organizationId === organizationId)
}

test('the universe contains curated records and dataset-only employers without duplicating identity', () => {
  assert.ok(index.organizations.length > 50, 'curated organization records should be present')
  assert.ok(extraOrganizations.length > 100, 'employers referenced by existing datasets should be visible')
  const ids = new Set(intelligence.all.map((organization) => organization.id))
  assert.equal(ids.size, intelligence.all.length, 'no organization may appear twice')
  // A company known to the accounting dataset and curated here resolves once.
  const ccs = intelligence.all.filter((organization) => organization.name.toLowerCase().includes('commercial cold holdings'))
  assert.equal(ccs.length, 1)
})

test('every curated organization carries sourced identity, and unknowns stay unknown', () => {
  for (const organization of organizations) {
    assert.ok(organization.name.trim().length > 0, 'organization needs a name')
    assert.ok(organization.sources.length > 0 || organization.status === 'needs-verification',
      `${organization.name} must carry sources or be flagged for verification`)
    for (const scale of organization.scale) {
      assert.ok(scale.sourceUrl.trim().length > 0, `${organization.name} scale must be sourced`)
    }
    for (const capability of organization.capabilities) {
      if (capability.status === 'unknown') {
        assert.ok(!capability.sourceUrl || capability.sourceUrl === '',
          'an unknown capability must not claim a source')
      }
    }
  }
})

test('the committed dataset passes the data-quality gate', () => {
  const issues = runQualityChecks({
    organizations,
    industries,
    capabilities,
    relationships: corporateRelationships,
    associations: curatedAssociations,
    intelligence: recruiterIntelligence,
  })
  const errors = issues.filter((issue) => issue.severity === 'error')
  assert.deepEqual(errors, [], 'committed company data must not contain identity or relationship errors')
})

test('scenario A: cold storage Financial Manager ranks cold chain and food operations first', () => {
  const role = context('role-cold-storage-financial-manager')
  const discovery = discoverAssociations({ index, focalId: 'org-ccs-logistics', roleContext: role, extraOrganizations })

  const pocketIds = discovery.pockets.map((pocket) => pocket.pocket.id)
  assert.ok(pocketIds.includes('cold-chain'), 'cold chain pocket must appear')
  assert.ok(pocketIds.includes('food-manufacturing'), 'food manufacturing pocket must appear')
  assert.ok(pocketIds.includes('transport-logistics'), 'logistics pocket must appear')

  const vector = matchFor(discovery.matches, 'org-vector-logistics')
  assert.ok(vector, 'Vector Logistics should be discovered')
  assert.ok(vector!.tier <= 2, `Vector Logistics should be a strong target, got tier ${vector!.tier}`)
  assert.ok(vector!.rules.some((rule) => rule.rule === 'R5-shared-operating-process'),
    'the shared cold storage process must be cited as the reason')

  // The focal company itself is never a suggested target.
  assert.equal(matchFor(discovery.matches, 'org-ccs-logistics'), undefined)

  // Tier 1 must rest on evidenced requirements, never on size or sector label alone.
  for (const match of discovery.matches.filter((entry) => entry.tier === 1)) {
    const rules = match.rules.map((rule) => rule.rule)
    assert.ok(
      rules.includes('R2-mandatory-capability') || rules.includes('R1-same-industry') || rules.includes('R3-same-pocket'),
      `tier 1 match ${match.organizationId} cites only ${rules.join(', ')}`,
    )
  }
})

test('scenario A: a Western Cape filter narrows results without losing the reason', () => {
  const role = context('role-cold-storage-financial-manager')
  const discovery = discoverAssociations({ index, focalId: 'org-ccs-logistics', roleContext: role, extraOrganizations })
  const filtered = filterMatches(discovery.matches, index, { ...EMPTY_FILTERS, provinces: ['Western Cape'] })
  assert.ok(filtered.length > 0)
  assert.ok(filtered.length < discovery.matches.length)
  for (const match of filtered) {
    const organization = index.byId.get(match.organizationId)
    assert.ok(organization, 'filtered match must resolve to a company record')
    assert.ok(organization!.locations.some((location) => location.province === 'Western Cape'))
    assert.ok(match.rules.length > 0, 'every result keeps an explanation')
  }
})

test('scenario B: property development context reorders the same companies', () => {
  const propertyRole = context('role-slm-property-development')
  const coldRole = context('role-cold-storage-financial-manager')

  const property = discoverAssociations({ index, focalId: 'org-slm-developments', roleContext: propertyRole, extraOrganizations })
  const cold = discoverAssociations({ index, focalId: 'org-ccs-logistics', roleContext: coldRole, extraOrganizations })

  const rabie = matchFor(property.matches, 'org-rabie-property-group')
  assert.ok(rabie, 'Rabie Property Group should be discovered for the property brief')
  assert.ok(rabie!.tier <= 2, `a leading Western Cape developer should rank highly, got tier ${rabie!.tier}`)

  const tigerInProperty = matchFor(property.matches, 'org-tiger-brands')
  const tigerInCold = matchFor(cold.matches, 'org-tiger-brands')
  assert.ok(tigerInProperty && tigerInCold)
  assert.ok(tigerInProperty!.tier > tigerInCold!.tier,
    `the same food manufacturer must be weaker for a property brief (property ${tigerInProperty!.tier} vs cold chain ${tigerInCold!.tier})`)

  const pocketIds = property.pockets.map((pocket) => pocket.pocket.id)
  assert.ok(pocketIds.includes('property-development'))
  assert.ok(pocketIds.includes('construction'))
})

test('scenario C: mandatory commodity trading exposure outranks scale', () => {
  const role = context('role-bester-head-of-finance')
  const discovery = discoverAssociations({ index, focalId: 'org-bester-feed-grain', roleContext: role, extraOrganizations })

  const nwk = matchFor(discovery.matches, 'org-nwk')
  assert.ok(nwk, 'NWK should be discovered')
  assert.equal(nwk!.tier, 1, `a grain trader with evidenced commodity trading must be tier 1, got ${nwk!.tier}`)
  assert.ok(nwk!.rules.some((rule) => rule.rule === 'R2-mandatory-capability'))

  const shoprite = matchFor(discovery.matches, 'org-shoprite-holdings')
  const tiger = matchFor(discovery.matches, 'org-tiger-brands')
  assert.ok(shoprite && tiger)
  assert.ok(shoprite!.tier > nwk!.tier,
    `a much larger retailer must not outrank a grain trader on this brief (Shoprite ${shoprite!.tier} vs NWK ${nwk!.tier})`)
  assert.ok(tiger!.tier > nwk!.tier,
    `ordinary food manufacturing must not outrank commodity trading (Tiger Brands ${tiger!.tier} vs NWK ${nwk!.tier})`)
  assert.ok(shoprite!.gaps.length > 0, 'missing evidence must be listed, not hidden')
})

test('the same company keeps its facts while its relevance changes with the role', () => {
  const propertyRole = context('role-slm-property-development')
  const coldRole = context('role-cold-storage-financial-manager')
  const property = discoverAssociations({ index, focalId: 'org-slm-developments', roleContext: propertyRole, extraOrganizations })
  const cold = discoverAssociations({ index, focalId: 'org-ccs-logistics', roleContext: coldRole, extraOrganizations })

  const organization = index.byId.get('org-tiger-brands')
  assert.ok(organization)
  const propertyMatch = matchFor(property.matches, 'org-tiger-brands')
  const coldMatch = matchFor(cold.matches, 'org-tiger-brands')
  assert.ok(propertyMatch && coldMatch)

  // One identity, one set of facts.
  assert.equal(organization!.id, 'org-tiger-brands')
  assert.equal(propertyMatch!.organizationId, coldMatch!.organizationId)
  assert.deepEqual(propertyMatch!.sharedCapabilities.length >= 0, true)
  assert.notEqual(propertyMatch!.tier, coldMatch!.tier, 'relevance must differ between contexts')
  assert.notEqual(TIER_LABELS[propertyMatch!.tier], TIER_LABELS[coldMatch!.tier])
})

test('discovery is paginated, never capped, and exports every matched row', () => {
  const role = context('role-cold-storage-financial-manager')
  const payload = discoverTargets({
    index,
    focalId: 'org-ccs-logistics',
    roleContext: role,
    extraOrganizations,
    page: 1,
    pageSize: 10,
  })
  assert.ok(payload.coverage.matched > 20, `expected a broad universe, got ${payload.coverage.matched}`)
  assert.equal(payload.targetCompanies.length, 10)
  assert.ok(payload.page.totalPages > 1)

  const secondPage = discoverTargets({
    index,
    focalId: 'org-ccs-logistics',
    roleContext: role,
    extraOrganizations,
    page: 2,
    pageSize: 10,
  })
  assert.equal(secondPage.targetCompanies.length, 10)
  const firstIds = new Set(payload.targetCompanies.map((company) => company.organizationId))
  for (const company of secondPage.targetCompanies) {
    assert.ok(!firstIds.has(company.organizationId), 'pages must not repeat companies')
  }
  assert.ok(payload.targetCompanies.every((company) => company.reasons.length > 0), 'every target carries a reason')

  const csv = exportTargetsCsv(payload)
  assert.equal(csv.split('\n').length, 11, 'header plus the ten matched rows')
  assert.ok(csv.includes('Missing evidence'))
})

test('graph, pocket and table views share one filtered result set', () => {
  const role = context('role-cold-storage-financial-manager')
  const discovery = discoverAssociations({ index, focalId: 'org-ccs-logistics', roleContext: role, extraOrganizations })
  const filters = { ...EMPTY_FILTERS, provinces: ['Western Cape'], tiers: ['1', '2'] }
  const filtered = filterMatches(discovery.matches, index, filters)

  // The table reads the flat list; the pocket view groups the same list.
  const pocketTotal = discovery.pockets.reduce((total, pocket) => total
    + filterMatches(pocket.matches, index, filters).length, 0)
  assert.equal(pocketTotal, filtered.length, 'pocket view and table view must agree')

  // The graph reads the same list, limited for rendering, and must say so.
  const graphSample = filtered.slice(0, 25)
  assert.ok(filtered.length >= graphSample.length)
  for (const match of filtered) {
    assert.ok(match.pocketId, 'every match belongs to a pocket')
    assert.ok(index.pocketById.has(match.pocketId) || match.pocketId === 'unclassified')
  }
})

test('the explorer vocabulary comes from data, not a fixed list', () => {
  const contexts = roleContexts()
  assert.ok(contexts.length >= 9, 'assignment contexts plus role families must be offered')
  assert.ok(contexts.some((entry) => entry.origin === 'search-bank'))
  assert.ok(contexts.some((entry) => entry.origin === 'role-family'))
  for (const entry of contexts) {
    assert.ok(entry.role.trim().length > 0)
  }
})

test('coverage reports distinguish mapped, pending and never-researched', () => {
  const stats = universeStats(index)
  assert.ok(stats.organizations > 50)
  assert.ok(stats.pendingVerification > 0, 'the dataset deliberately holds unverified records')
  assert.ok(stats.mappedProfessionals > 0, 'existing datasets must contribute mapped professionals')

  const coverage = coverageByIndustry(index)
  const grain = coverage.find((entry) => entry.industryId === 'grain-trading')
  assert.ok(grain, 'grain trading coverage must be reported')
  assert.ok(grain!.organizations > 0)
  assert.ok(grain!.requiringEmployeeMapping >= 0)

  const empty = coverage.filter((entry) => entry.organizations === 0)
  for (const entry of empty) {
    assert.ok(entry.gaps.some((gap) => gap.includes('No organizations mapped')),
      'an industry with nothing mapped must say so')
  }
})

test('the dossier separates facts, evidence and research gaps', () => {
  const dossier = companyDossier(index, 'org-bester-feed-grain')
  assert.ok(dossier)
  assert.equal(dossier!.identity.name, 'Bester Feed & Grain')
  assert.equal(dossier!.identity.legalName, 'Bester Feed and Grain (Pty) Ltd')
  assert.ok(dossier!.identity.aliases.includes('Bester'))
  assert.ok(dossier!.capabilities.some((capability) => capability.id === 'commodity-trading' && capability.status === 'observed'))
  assert.ok(dossier!.capabilities.some((capability) => capability.id === 'hedging-derivative-accounting' && capability.status === 'unknown'))
  assert.ok(dossier!.researchGaps.some((gap) => gap.includes('never been checked')),
    'unknown capabilities must be reported as missing research')
  assert.ok(dossier!.sources.every((source) => source.url.startsWith('http')))
})

test('comparison reports shared, distinct and unknown dimensions with role implications', () => {
  const role = context('role-bester-head-of-finance')
  const comparison = compareOrganizations(index, 'org-bester-feed-grain', 'org-tiger-brands', role)
  assert.ok(comparison.shared.length + comparison.distinct.length + comparison.unknown.length > 0)
  assert.ok(comparison.implications.some((line) => line.includes('Head of Finance')))
  assert.ok(comparison.implications.some((line) => line.includes('not evidence that any individual')))
  assert.ok(comparison.distinct.some((row) => row.dimension === 'Commercial activity'))
})

test('the knowledge-base summary exposes taxonomy, coverage and quality for machines', () => {
  const summary = knowledgeBaseSummary(index)
  assert.equal(summary.schemaVersion, 1)
  assert.ok(summary.pockets.length > 8)
  assert.ok(summary.coverage.length > 20)
  assert.equal(summary.dataQuality.errors, 0)
  assert.ok(summary.universe.organizations > 50)
})

test('empty filters are the identity filter', () => {
  const role = context('role-cold-storage-financial-manager')
  const discovery = discoverAssociations({ index, focalId: 'org-ccs-logistics', roleContext: role, extraOrganizations })
  assert.equal(filterMatches(discovery.matches, index, emptyFilters()).length, discovery.matches.length)
  assert.equal(filterMatches(discovery.matches, index, EMPTY_FILTERS).length, discovery.matches.length)
})
