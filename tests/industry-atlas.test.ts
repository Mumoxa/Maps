import test from 'node:test'
import assert from 'node:assert/strict'
import { buildCompanyIntelligence } from '../src/data/organizations/universe'
import {
  UNCLASSIFIED_BRANCH_ID,
  atlasNodeTitle,
  buildIndustryAtlas,
  childrenWithCounts,
  companiesAtNode,
  descendantNodeIds,
  footprintGroupsAtNode,
  isUnclassifiedBranch,
  searchAtlasNodes,
} from '../src/data/organizations/atlas'
import {
  buildUniverseViews,
  canonicalOrganizationIdForSlug,
  facetCounts,
  filterCompanyViews,
  groupByFootprint,
  paginate,
  summarizeViews,
  viewsAtNode,
} from '../src/data/organizations/universeView'
import { industryAssociations, corporateHierarchy } from '../src/data/organizations/industryDiscovery'
import { discoverRoleTargets } from '../src/data/organizations/discovery'
import { roleContextById, FACTUAL_CONTEXT } from '../src/data/organizations/roleContexts'
import { EMPTY_FILTERS } from '../src/data/organizations/types'
import { sectorTree } from '../src/data/taxonomy/load'

const intelligence = buildCompanyIntelligence()
const atlas = buildIndustryAtlas(intelligence.index, intelligence.all)
const views = buildUniverseViews(intelligence.index, intelligence.all)

test('the atlas is built from the whole universe with no focal company', () => {
  // The single most important structural property: nothing in the atlas model
  // names, ranks or centres a company.
  assert.equal(atlas.nodes.size, sectorTree.length)
  assert.ok(atlas.roots.length > 0)
  const serialised = JSON.stringify(atlas.totals)
  assert.ok(!serialised.includes('focal'), 'the atlas must not carry a focal company')
  for (const key of Object.keys(atlas.totals)) {
    assert.ok(!key.toLowerCase().includes('focal'))
  }
})

test('the atlas reuses the national taxonomy rather than inventing a second one', () => {
  const treeIds = new Set(sectorTree.map((node) => node.id))
  for (const id of atlas.nodes.keys()) {
    assert.ok(treeIds.has(id) || isUnclassifiedBranch(id), `${id} is not a national taxonomy node`)
  }
  assert.equal(atlas.totals.taxonomyNodes, sectorTree.length)
})

test('a company appears in every branch it operates in without being duplicated', () => {
  const ids = new Set(intelligence.all.map((organization) => organization.id))
  assert.equal(ids.size, intelligence.all.length, 'the canonical register holds one record per company')

  let multiBranch = 0
  for (const organization of intelligence.all) {
    const branches = [...atlas.nodes.values()].filter(
      (node) => node.directOrganizationIds.includes(organization.id),
    )
    if (branches.length > 1) multiBranch += 1
  }
  assert.ok(multiBranch > 0, 'at least one company should operate in more than one branch')

  // Rollup sets are de-duplicated: a company counted in an ancestor once.
  for (const node of atlas.nodes.values()) {
    assert.equal(new Set(node.organizationIds).size, node.organizationIds.length,
      `${node.id} lists a company twice`)
  }
})

test('empty branches report zero companies instead of borrowing from a neighbour', () => {
  const empty = [...atlas.nodes.values()].filter((node) => node.counts.organizations === 0)
  assert.ok(empty.length > 0, 'a partial map should have unmapped branches')
  for (const node of empty) {
    assert.equal(companiesAtNode(atlas, intelligence.index, node.id).length, 0)
    assert.equal(node.counts.organizations, 0)
    assert.equal(node.counts.direct, 0)
    for (const group of footprintGroupsAtNode(atlas, intelligence.index, node.id)) {
      assert.equal(group.organizationIds.length, 0, `${node.id} must show an empty landscape`)
    }
  }
})

test('branch rollups add up: a branch holds every company in its descendants', () => {
  for (const root of atlas.roots) {
    const branchIds = new Set(descendantNodeIds(atlas, root.id))
    const union = new Set<string>()
    for (const id of branchIds) {
      for (const organizationId of atlas.nodes.get(id)?.directOrganizationIds ?? []) union.add(organizationId)
    }
    assert.equal(root.counts.organizations, union.size,
      `${root.node.name} rollup ${root.counts.organizations} != direct union ${union.size}`)
  }
})

test('child branches are ordered deterministically, largest first then by name', () => {
  for (const root of atlas.roots) {
    const children = childrenWithCounts(atlas, root.id)
    for (let i = 1; i < children.length; i += 1) {
      const previous = children[i - 1]
      const current = children[i]
      const ordered = previous.counts.organizations > current.counts.organizations
        || (previous.counts.organizations === current.counts.organizations
          && previous.node.name.localeCompare(current.node.name) <= 0)
      assert.ok(ordered, `${previous.node.name} / ${current.node.name} is not deterministically ordered`)
    }
  }
})

test('unclassified employers stay discoverable in their own branch', () => {
  assert.ok(atlas.totals.unclassifiedOrganizations > 0,
    'dataset-only employers should form a research backlog')
  const ids = companiesAtNode(atlas, intelligence.index, UNCLASSIFIED_BRANCH_ID)
  assert.equal(ids.length, atlas.totals.unclassifiedOrganizations)
  assert.equal(atlasNodeTitle(atlas, UNCLASSIFIED_BRANCH_ID), 'Not yet classified into the national taxonomy')
  assert.equal(
    atlas.totals.mappedOrganizations + atlas.totals.unclassifiedOrganizations,
    intelligence.all.length,
    'every company is either placed or explicitly unplaced',
  )
})

test('the universe view is factual and complete, with no hidden top-N cap', () => {
  assert.equal(views.length, intelligence.all.length)
  const paged = paginate(views, 1, 24)
  assert.equal(paged.rows.length, 24)
  assert.ok(paged.totalPages > 1)
  // Pagination slices presentation; the underlying list is untouched.
  assert.equal(views.length, intelligence.all.length)

  for (const view of views) {
    assert.ok(!('tier' in view), 'a factual company view must not carry a relevance tier')
  }
})

test('factual filtering never applies a relevance tier or a relationship type', () => {
  const filters = {
    ...EMPTY_FILTERS,
    tiers: ['1'],
    relationshipTypes: ['same-industry'],
  }
  const filtered = filterCompanyViews(views, filters, intelligence.index)
  assert.equal(filtered.length, views.length,
    'unscoped factual browsing ignores brief-specific filters')
})

test('every filter dimension narrows the same underlying universe', () => {
  const withMacro = [...atlas.roots].find((root) => root.counts.organizations > 0)
  assert.ok(withMacro)
  const filtered = filterCompanyViews(
    views,
    { ...EMPTY_FILTERS, macroSectors: [withMacro.id] },
    intelligence.index,
  )
  assert.ok(filtered.length > 0)
  assert.ok(filtered.length < views.length)
  for (const view of filtered) {
    assert.ok(view.macroSectorIds.includes(withMacro.id))
  }

  const footprintFiltered = filterCompanyViews(
    views,
    { ...EMPTY_FILTERS, footprint: ['not-established'] },
    intelligence.index,
  )
  assert.ok(footprintFiltered.length > 0)
  for (const view of footprintFiltered) {
    assert.equal(view.footprint, 'not-established')
  }
})

test('facet counts describe the same list the results render', () => {
  const scoped = viewsAtNode(views, atlas, intelligence.index, atlas.roots[0].id)
  const counts = facetCounts(scoped)
  const total = [...counts.footprint.values()].reduce((sum, value) => sum + value, 0)
  assert.equal(total, scoped.length, 'every scoped company lands in exactly one footprint band')
})

test('footprint bands group a branch with every band rendered, empty ones included', () => {
  const populated = [...atlas.nodes.values()].find((node) => node.counts.organizations > 3)
  assert.ok(populated)
  const groups = footprintGroupsAtNode(atlas, intelligence.index, populated.id)
  assert.equal(groups.length, 5, 'all five bands are rendered so gaps are visible')
  const grouped = groups.reduce((sum, group) => sum + group.organizationIds.length, 0)
  assert.equal(grouped, companiesAtNode(atlas, intelligence.index, populated.id).length)
  for (const group of groups) {
    const names = group.organizationIds.map((id) => intelligence.index.byId.get(id)?.name ?? id)
    assert.deepEqual(names, [...names].sort((left, right) => left.localeCompare(right)),
      'companies inside a band are alphabetical, never ranked on an invented number')
  }
})

test('industry associations are derived without a focal company and are labelled by evidence class', () => {
  const scoped = viewsAtNode(views, atlas, intelligence.index, atlas.roots[0].id)
  const result = industryAssociations(intelligence.index, scoped)
  assert.ok(result.groups.length > 0)
  for (const group of result.groups) {
    assert.ok(group.evidenceClass.length > 0, `${group.kind} has no evidence class`)
    assert.ok(group.clusters.length > 0)
    for (const cluster of group.clusters) {
      assert.ok(cluster.organizationIds.length >= 2, 'a cluster needs at least two members')
    }
  }
  // The result carries no focal identifier anywhere.
  assert.ok(!JSON.stringify(result.coverage).includes('focal'))
})

test('an association never claims ownership: only corporate records do', () => {
  const result = industryAssociations(intelligence.index, views.slice(0, 120))
  const ownership = result.groups.find((group) => group.kind === 'corporate-ownership')
  const industry = result.groups.find((group) => group.kind === 'industry')
  if (ownership) {
    assert.equal(ownership.evidenceClass, 'verified-factual-relationship')
  }
  if (industry) {
    assert.equal(industry.evidenceClass, 'shared-sourced-attribute')
    assert.notEqual(industry.evidenceClass, 'verified-factual-relationship',
      'sharing an industry is not a verified relationship')
  }
})

test('the corporate hierarchy is built only from sourced relationship records', () => {
  const withRelationships = intelligence.index.organizations.find(
    (organization) => (intelligence.index.relationshipsByOrg.get(organization.id) ?? []).length > 0
      || organization.parentId,
  )
  assert.ok(withRelationships)
  const hierarchy = corporateHierarchy(intelligence.index, withRelationships.id)
  const all = [
    ...(hierarchy.parent ? [hierarchy.parent.id] : []),
    ...hierarchy.subsidiaries.map((entry) => entry.id),
    ...hierarchy.otherRelationships.map((entry) => entry.counterpartyId),
  ]
  for (const id of all) {
    assert.ok(intelligence.index.byId.has(id), `${id} is not a canonical company`)
  }
  // Ownership is a separate structure: nothing here references an industry.
  assert.ok(!JSON.stringify(hierarchy).includes('taxonomy'))
})

test('a brief can score an industry branch with no focal company at all', () => {
  const role = roleContextById('role-cold-storage-financial-manager')
  assert.ok(role)
  const scoped = viewsAtNode(views, atlas, intelligence.index, atlas.roots[0].id)
  const result = discoverRoleTargets({
    index: intelligence.index,
    roleContext: role,
    organizations: intelligence.all,
    scope: { nodeId: atlas.roots[0].id, organizationIds: scoped.map((entry) => entry.organizationId) },
  })
  assert.ok(result.matches.length > 0)
  for (const match of result.matches) {
    assert.equal(match.focalId, '', 'no focal company may be implied by a brief-only run')
    assert.ok(match.rules.length > 0, 'every result states why it appeared')
  }
  // Focal-comparison rules cannot fire without a focal company.
  const focalRuleIds = ['R1-same-industry', 'R3-same-pocket', 'R5-shared-operating-process', 'R16-shared-taxonomy-branch']
  for (const match of result.matches) {
    for (const rule of match.rules) {
      assert.ok(!focalRuleIds.includes(rule.rule), `${rule.rule} requires a focal company`)
    }
  }
})

test('the factual context is the atlas default: no brief, no mandatory capability', () => {
  assert.equal(FACTUAL_CONTEXT.mandatoryCapabilities.length, 0)
  assert.equal(FACTUAL_CONTEXT.clientId, null)
})

test('taxonomy search finds branches by name and synonym', () => {
  const first = atlas.roots[0]
  const found = searchAtlasNodes(atlas, first.node.name)
  assert.ok(found.some((node) => node.id === first.id))
  assert.equal(searchAtlasNodes(atlas, '   ').length, 0)
})

test('a legacy company slug resolves onto the canonical organization id', () => {
  const ccs = intelligence.index.byId.get('org-ccs-logistics')
  assert.ok(ccs)
  const resolved = canonicalOrganizationIdForSlug('ccs-logistics')
  assert.equal(resolved, 'org-ccs-logistics')
  assert.equal(canonicalOrganizationIdForSlug('definitely-not-a-company'), null)
})

test('summary counts reconcile with the list they summarise', () => {
  const summary = summarizeViews(views)
  assert.equal(summary.organizations, views.length)
  assert.equal(summary.verified + summary.pendingVerification, views.length)
})

test('grouping is stable regardless of the order companies arrive in', () => {
  const forward = groupByFootprint(views)
  const reversed = groupByFootprint([...views].reverse())
  assert.deepEqual(forward, reversed)
})
