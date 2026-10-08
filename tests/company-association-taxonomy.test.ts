import test from 'node:test'
import assert from 'node:assert/strict'
import { buildCompanyIntelligence } from '../src/data/organizations/universe'
import { discoverAssociations, filterMatches } from '../src/data/organizations/discovery'
import { roleContextById } from '../src/data/organizations/roleContexts'
import { companyDossier, discoverTargets, emptyFilters, exportTargetsCsv, nationalTaxonomySummary, knowledgeBaseSummary } from '../src/data/organizations/query'
import { organizationTaxonomy, sharedTaxonomyBranch, taxonomyNodesForIndustry } from '../src/data/organizations/taxonomyPlacement'
import { getTaxonomyNode, industryCrosswalk, sectorTree } from '../src/data/taxonomy/load'
import { EMPTY_FILTERS } from '../src/data/organizations/types'
import { industries, organizations } from '../src/data/organizations/load'

const { index, extraOrganizations } = buildCompanyIntelligence()
function context(id: string) {
  const found = roleContextById(id)
  assert.ok(found)
  return found
}

const role = context('role-cold-storage-financial-manager')

const R16 = 'R16-shared-taxonomy-branch'

/** Every pair in the universe that R16 links, de-duplicated in both directions. */
function r16Pairs() {
  const pairs: { focalId: string; organizationId: string; detail: string }[] = []
  const seen = new Set<string>()
  for (const organization of organizations) {
    const discovery = discoverAssociations({ index, focalId: organization.id, roleContext: role })
    for (const match of discovery.matches) {
      const hit = match.rules.find((rule) => rule.rule === R16)
      if (!hit) continue
      const key = [organization.id, match.organizationId].sort().join('|')
      if (seen.has(key)) continue
      seen.add(key)
      pairs.push({ focalId: organization.id, organizationId: match.organizationId, detail: hit.detail })
    }
  }
  return pairs
}

// ---------------------------------------------------------------------------
// The crosswalk is the only bridge, and it must be right
// ---------------------------------------------------------------------------

test('every Maps industry resolves to a real node in the national taxonomy', () => {
  assert.equal(industryCrosswalk.industryMappings.length, industries.length)
  for (const mapping of industryCrosswalk.industryMappings) {
    const nodes = taxonomyNodesForIndustry(mapping.industryId)
    assert.ok(nodes.length > 0, `${mapping.industryId} resolves to nothing`)
    assert.equal(nodes[0].id, mapping.taxonomyNode)
    assert.ok(getTaxonomyNode(mapping.taxonomyNode), `${mapping.taxonomyNode} does not exist`)
  }
})

test('every curated company is placed, so nothing drops out of the macro-sector view', () => {
  const summary = nationalTaxonomySummary(index)
  assert.equal(summary.placed, organizations.length)
  assert.deepEqual(summary.unplaced, [])
  assert.deepEqual(summary.unplacedIndustries, [])
  assert.ok(summary.macroSectors.length >= 5, 'the universe spans several macro-sectors')
}
)

test('the corrected crosswalk mappings hold', () => {
  const targetOf = (id: string) => industryCrosswalk.industryMappings.find((mapping) => mapping.industryId === id)?.taxonomyNode

  // Dockside perishable handling belongs to the port cold chain, not to horticulture.
  assert.equal(targetOf('fresh-produce-export'), 'WHL-COLD-BOND-PERISH')
  const perishable = getTaxonomyNode('WHL-COLD-BOND-PERISH')
  assert.ok(perishable)
  assert.equal(perishable.parentId, 'WHL-COLD-BOND')

  // Development and asset ownership are different business models and must not collapse.
  assert.equal(targetOf('renewable-development'), 'ENR-GEN-IPP-DEV')
  assert.equal(targetOf('independent-power-production'), 'ENR-GEN-IPP')
  assert.notEqual(targetOf('renewable-development'), targetOf('independent-power-production'))

  // "Building and civils" contracting maps to the contracting branch, not to building alone.
  assert.equal(targetOf('construction-contracting'), 'CON-CONTR')
})

// ---------------------------------------------------------------------------
// Placement
// ---------------------------------------------------------------------------

test('placement resolves the full path from macro-sector down to the niche', () => {
  const ccs = index.byId.get('org-ccs-logistics')
  assert.ok(ccs)
  const placement = organizationTaxonomy(ccs)
  assert.ok(placement.entries.length >= 2)
  for (const entry of placement.entries) {
    assert.equal(entry.path[0].level, 1, 'every path starts at a macro-sector')
    assert.equal(entry.path[entry.path.length - 1].id, entry.node.id)
    assert.equal(entry.path.length, entry.node.level)
  }
  assert.ok(placement.labels.every((label) => label.includes(' > ')))
})

test('a company with no industries has no placement, rather than a guessed one', () => {
  const stub = extraOrganizations.find((organization) => organization.industries.length === 0)
  assert.ok(stub, 'the explorer exposes dataset-only employers without industries')
  const placement = organizationTaxonomy(stub)
  assert.deepEqual(placement.entries, [])
  assert.deepEqual(placement.macroSectorIds, [])
})

test('shared branch resolution is depth-aware', () => {
  const node = (id: string) => {
    const found = getTaxonomyNode(id)
    assert.ok(found, id)
    return found
  }

  // Same sub-industry parent.
  assert.equal(sharedTaxonomyBranch([node('MFG-FOOD-MILL')], [node('MFG-FOOD')])?.id, 'MFG-FOOD')
  // Niche under a shared level-3 branch.
  assert.equal(
    sharedTaxonomyBranch([node('ENR-GEN-IPP-DEV')], [node('ENR-GEN-IPP')])?.id,
    'ENR-GEN-IPP',
  )
  // Only the macro-sector in common - weaker than a sub-industry.
  assert.equal(
    sharedTaxonomyBranch([node('TRA-COLD-MULTI')], [node('TRA-CONTRACT-3PL')])?.level,
    1,
  )
  // Different macro-sectors entirely.
  assert.equal(sharedTaxonomyBranch([node('WHL-COLD-STORE')], [node('RTL-GROC-HYPER')]), null)
  // Nothing to compare.
  assert.equal(sharedTaxonomyBranch([], [node('MFG-FOOD')]), null)
})

// ---------------------------------------------------------------------------
// The association rule
// ---------------------------------------------------------------------------

test('R16 links companies the flat industry list cannot see, and only those', () => {
  const pairs = r16Pairs()
  assert.ok(pairs.length > 100, `expected a substantial set of sub-industry associations, got ${pairs.length}`)

  for (const pair of pairs) {
    const focal = index.byId.get(pair.focalId)
    const other = index.byId.get(pair.organizationId)
    assert.ok(focal && other)

    // Never duplicates R1: an exact industry overlap is R1's evidence, not R16's.
    const exactOverlap = other.industries.some((link) =>
      focal.industries.some((focalLink) => focalLink.industryId === link.industryId))
    assert.equal(exactOverlap, false, `${focal.name} and ${other.name} share an industry, so R1 owns this pair`)

    // The shared branch is a real sub-industry, not merely a shared macro-sector.
    const shared = sharedTaxonomyBranch(
      organizationTaxonomy(focal).nodes,
      organizationTaxonomy(other).nodes,
    )
    assert.ok(shared, `${focal.name} and ${other.name} share no branch`)
    assert.ok(shared.level >= 2, `${focal.name} and ${other.name} share only the ${shared.name} macro-sector`)
  }
})

test('no company reports R1 and R16 for the same association', () => {
  for (const organization of organizations) {
    const discovery = discoverAssociations({ index, focalId: organization.id, roleContext: role })
    for (const match of discovery.matches) {
      const ids = new Set(match.rules.map((rule) => rule.rule))
      assert.ok(
        !(ids.has('R1-same-industry') && ids.has(R16)),
        `${organization.name} -> ${match.organizationId} reports both exact and sub-industry overlap`,
      )
    }
  }
})

test('R16 explains itself in recruiter language and names both sub-industries', () => {
  const pairs = r16Pairs()
  const sample = pairs.find((pair) => pair.detail.includes('Food, Beverage & FMCG Manufacturing'))
  assert.ok(sample, 'food manufacturing companies must associate through the shared sub-industry')
  assert.match(sample.detail, /level \d/)
  assert.match(sample.detail, /Same branch is adjacency, not the same business/)
  assert.ok(sample.detail.length > 80, 'the explanation must carry the branch and both sub-industries')
})

test('a company that both develops and owns assets keeps two distinct placements', () => {
  const developers = organizations.filter((organization) =>
    organization.industries.some((link) => link.industryId === 'renewable-development'))
  const owners = organizations.filter((organization) =>
    organization.industries.some((link) => link.industryId === 'independent-power-production'))
  assert.ok(developers.length > 0 && owners.length > 0)

  for (const organization of owners) {
    const nodes = organizationTaxonomy(organization).nodes.map((node) => node.id)
    assert.ok(nodes.includes('ENR-GEN-IPP'), `${organization.name} must hold the asset-ownership niche`)
  }

  // Every IPP owner in the current universe is also a developer, so a real
  // developer-to-owner pair does not exist in this dataset yet; the branch
  // relationship between the two niches is covered by the resolution test above.
  const both = owners.filter((organization) =>
    organization.industries.some((link) => link.industryId === 'renewable-development'))
  assert.equal(both.length, owners.length, 'documented: no owner-only company in the current universe')
  for (const organization of both) {
    const nodes = organizationTaxonomy(organization).nodes.map((node) => node.id)
    assert.ok(nodes.includes('ENR-GEN-IPP-DEV'), `${organization.name} must also hold the developer niche`)
  }
})

// ---------------------------------------------------------------------------
// Filters, dossier and export
// ---------------------------------------------------------------------------

test('the macro-sector facet filters on derived placement, not a second classification', () => {
  const discovery = discoverAssociations({ index, focalId: 'org-ccs-logistics', roleContext: role, extraOrganizations })
  const none = filterMatches(discovery.matches, index, { ...EMPTY_FILTERS, macroSectors: ['MIN'] })
  assert.equal(none.length, 0, 'the universe holds no mining companies, so a mining facet must be empty')

  const transport = filterMatches(discovery.matches, index, { ...EMPTY_FILTERS, macroSectors: ['TRA'] })
  assert.ok(transport.length > 0)
  for (const match of transport) {
    const organization = index.byId.get(match.organizationId)
    assert.ok(organization)
    assert.ok(organizationTaxonomy(organization).macroSectorIds.includes('TRA'))
  }

  // Both axes are derived from the same industries, so they must agree.
  const byIndustry = filterMatches(discovery.matches, index, { ...EMPTY_FILTERS, industries: ['refrigerated-transport'] })
  for (const match of byIndustry) {
    const organization = index.byId.get(match.organizationId)
    assert.ok(organization)
    assert.ok(organizationTaxonomy(organization).macroSectorIds.includes('TRA'))
  }
})

test('the search index reaches the national taxonomy vocabulary', () => {
  const discovery = discoverAssociations({ index, focalId: 'org-ccs-logistics', roleContext: role })
  const byNiche = filterMatches(discovery.matches, index, { ...EMPTY_FILTERS, query: 'Cold Chain Storage' })
  assert.ok(byNiche.length > 0, 'a taxonomy branch name must be searchable')
})

test('the dossier carries national placement next to the Maps industries', () => {
  const dossier = companyDossier(index, 'org-ccs-logistics')
  assert.ok(dossier)
  assert.ok(dossier.taxonomy.length > 0)
  for (const entry of dossier.taxonomy) {
    assert.ok(entry.macroSector.length > 0)
    assert.ok(entry.path.startsWith(entry.macroSector))
    assert.ok(dossier.industries.some((industry) => industry.id === entry.industryId))
  }
  assert.ok(dossier.macroSectors.length > 0)
})

test('the export and the knowledge-base contract expose the macro-sector axis', () => {
  const payload = discoverTargets({
    index,
    focalId: 'org-ccs-logistics',
    roleContext: role,
    extraOrganizations,
    page: 1,
    pageSize: 10,
  })
  assert.ok(payload.targetCompanies.every((company) => Array.isArray(company.macroSectors)))
  assert.ok(payload.targetCompanies.some((company) => company.macroSectors.length > 0), 'placed companies must export their macro-sector')

  const csv = exportTargetsCsv(payload)
  assert.ok(csv.split('\n')[0].includes('National macro-sector'))
  assert.ok(csv.split('\n').length === 11, 'header plus ten rows')

  const summary = knowledgeBaseSummary(index)
  assert.ok(summary.nationalTaxonomy.macroSectors.length > 0)
  assert.equal(summary.nationalTaxonomy.placed, organizations.length)
})

test('the new facet does not disturb the identity filter', () => {
  const discovery = discoverAssociations({ index, focalId: 'org-ccs-logistics', roleContext: role })
  assert.equal(filterMatches(discovery.matches, index, emptyFilters()).length, discovery.matches.length)
  assert.deepEqual(emptyFilters().macroSectors, [])
})

test('the sector tree still holds together after the two added niches', () => {
  const ids = new Set(sectorTree.map((node) => node.id))
  assert.equal(ids.size, sectorTree.length)
  for (const id of ['ENR-GEN-IPP-DEV', 'WHL-COLD-BOND-PERISH']) {
    const node = getTaxonomyNode(id)
    assert.ok(node)
    assert.equal(node.level, 4)
  }
})
