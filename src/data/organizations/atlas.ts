// The Industry Atlas: the national taxonomy as the primary organising structure.
//
// This module builds a company-annotated view of `markets/organizations/taxonomy/sector-tree.json`
// and nothing else. It adds no taxonomy of its own: the four-level national tree
// (macro-sector > industry sector > sub-industry > operational niche) already
// exists, the industry crosswalk already binds Maps industries onto it, and a
// second tree would immediately drift from the first.
//
// Three properties matter and are enforced here:
//
//   1. No focal company. The atlas is built from the universe, so no client,
//      assignment or development fixture sits at its centre.
//   2. Multi-industry membership without duplication. A company is registered
//      once and appears under every branch it genuinely operates in.
//   3. Empty branches are visible and empty. A branch with no mapped companies
//      reports zero rather than borrowing companies from a neighbour.

import { getChildren, getTaxonomyNode, resolveSectorPath, sectorTree } from '../taxonomy/load'
import type { TaxonomyNode } from '../taxonomy/types'
import type { OrganizationIndex } from './load'
import { classifyFootprint, FOOTPRINT_BANDS, isEstablishedBand } from './footprint'
import { organizationTaxonomy } from './taxonomyPlacement'
import type { FootprintBand, Organization } from './types'

export interface AtlasNodeCounts {
  /** Companies mapped to this branch, including every descendant. */
  organizations: number
  /** Companies mapped to this exact node, excluding descendants. */
  direct: number
  verified: number
  pendingVerification: number
  withMappedProfessionals: number
  withSourcedScale: number
  /** Companies carrying a defensible indicative footprint band. */
  footprintEstablished: number
  /** Known only from a Maps dataset: no curated company record yet. */
  datasetOnly: number
  /** Companies with no national taxonomy placement at all. */
  unclassified: number
}

export interface AtlasNode {
  id: string
  node: TaxonomyNode
  /** L1 down to this node, inclusive. */
  path: TaxonomyNode[]
  childIds: string[]
  /** Companies placed on this exact node through the crosswalk. */
  directOrganizationIds: string[]
  /** Companies on this node or any descendant, de-duplicated, name-ordered. */
  organizationIds: string[]
  counts: AtlasNodeCounts
  /** Newest verification date anywhere in the branch. */
  lastResearchDate: string | null
}

export interface IndustryAtlas {
  nodes: Map<string, AtlasNode>
  /** Level 1 macro-sectors, name-ordered. */
  roots: AtlasNode[]
  /** Companies with no taxonomy placement, name-ordered. */
  unclassifiedOrganizationIds: string[]
  totals: {
    taxonomyNodes: number
    mappedOrganizations: number
    unclassifiedOrganizations: number
    /** Branches with at least one mapped company. */
    populatedBranches: number
    /** Level 4 niches with at least one mapped company. */
    populatedNiches: number
    nicheCount: number
  }
}

/** Companies in a branch, grouped into indicative footprint bands. */
export interface FootprintGroup {
  band: FootprintBand
  organizationIds: string[]
}

function emptyCounts(): AtlasNodeCounts {
  return {
    organizations: 0,
    direct: 0,
    verified: 0,
    pendingVerification: 0,
    withMappedProfessionals: 0,
    withSourcedScale: 0,
    footprintEstablished: 0,
    datasetOnly: 0,
    unclassified: 0,
  }
}

/**
 * Build the atlas over the supplied universe.
 *
 * `organizations` is the caller's universe (curated records plus dataset-only
 * employers). Counts are computed once here rather than filtered per render,
 * which is what keeps a 731-node tree responsive.
 */
export function buildIndustryAtlas(index: OrganizationIndex, organizations: Organization[]): IndustryAtlas {
  const nodes = new Map<string, AtlasNode>()
  for (const node of sectorTree) {
    nodes.set(node.id, {
      id: node.id,
      node,
      path: resolveSectorPath(node.id),
      childIds: [],
      directOrganizationIds: [],
      organizationIds: [],
      counts: emptyCounts(),
      lastResearchDate: null,
    })
  }

  const childrenByParent = new Map<string | null, TaxonomyNode[]>()
  for (const node of sectorTree) {
    const siblings = childrenByParent.get(node.parentId) ?? []
    siblings.push(node)
    childrenByParent.set(node.parentId, siblings)
  }
  for (const node of sectorTree) {
    const atlasNode = nodes.get(node.id)
    if (!atlasNode) continue
    atlasNode.childIds = (childrenByParent.get(node.id) ?? [])
      .map((child) => child.id)
      .filter((childId) => nodes.has(childId))
  }

  // Rollup sets: every company is registered on its exact node and on each
  // ancestor, so a branch's count is the count of its whole subtree.
  const rollup = new Map<string, Set<string>>()
  const add = (nodeId: string, organizationId: string) => {
    const existing = rollup.get(nodeId)
    if (existing) existing.add(organizationId)
    else rollup.set(nodeId, new Set([organizationId]))
  }

  const byId = new Map<string, Organization>()
  const unclassified: string[] = []
  for (const organization of organizations) {
    byId.set(organization.id, organization)
    const placement = organizationTaxonomy(organization)
    if (placement.entries.length === 0) {
      unclassified.push(organization.id)
      continue
    }
    for (const entry of placement.entries) {
      add(entry.node.id, organization.id)
      for (const ancestor of entry.path) add(ancestor.id, organization.id)
    }
  }

  for (const atlasNode of nodes.values()) {
    atlasNode.organizationIds = [...(rollup.get(atlasNode.id) ?? [])]
    atlasNode.directOrganizationIds = atlasNode.organizationIds.filter((organizationId) => {
      const organization = byId.get(organizationId)
      if (!organization) return false
      return organizationTaxonomy(organization).entries.some((entry) => entry.node.id === atlasNode.id)
    })
  }

  // Directness is derived once above; the per-node statistics follow from the
  // same universe so the tree, the bands and the directory can never disagree.
  for (const atlasNode of nodes.values()) {
    const counts = emptyCounts()
    let newest = ''
    for (const organizationId of atlasNode.organizationIds) {
      const organization = byId.get(organizationId)
      if (!organization) continue
      counts.organizations += 1
      const employer = index.employersByOrg.get(organizationId)
      if (organization.status === 'verified') counts.verified += 1
      else counts.pendingVerification += 1
      if ((employer?.professionals ?? 0) > 0) counts.withMappedProfessionals += 1
      if (organization.scale.length > 0) counts.withSourcedScale += 1
      if (isEstablishedBand(classifyFootprint(organization).band)) counts.footprintEstablished += 1
      if (!index.byId.has(organizationId)) counts.datasetOnly += 1
      if (organization.lastVerified && organization.lastVerified > newest) newest = organization.lastVerified
    }
    counts.direct = atlasNode.directOrganizationIds.length
    counts.unclassified = atlasNode.id === UNCLASSIFIED_BRANCH_ID ? unclassified.length : 0
    atlasNode.counts = counts
    atlasNode.lastResearchDate = newest || null
  }

  const sortByName = (left: AtlasNode, right: AtlasNode) => left.node.name.localeCompare(right.node.name)
  const roots = [...nodes.values()]
    .filter((entry) => entry.node.parentId === null)
    .sort(sortByName)

  const populatedBranches = [...nodes.values()].filter((entry) => entry.counts.organizations > 0).length
  const niches = [...nodes.values()].filter((entry) => entry.node.level === 4)
  const sortedUnclassified = unclassified.sort((left, right) =>
    (byId.get(left)?.name ?? left).localeCompare(byId.get(right)?.name ?? right))

  return {
    nodes,
    roots,
    unclassifiedOrganizationIds: sortedUnclassified,
    totals: {
      taxonomyNodes: nodes.size,
      mappedOrganizations: byId.size - unclassified.length,
      unclassifiedOrganizations: unclassified.length,
      populatedBranches,
      populatedNiches: niches.filter((entry) => entry.counts.organizations > 0).length,
      nicheCount: niches.length,
    },
  }
}

/**
 * Pseudo-node id for companies with no national taxonomy placement.
 *
 * These are real companies - largely employers known only from a Maps dataset -
 * and dropping them would silently shrink the universe, so they get an explicit
 * branch of their own instead of being hidden or, worse, invented into a sector.
 */
export const UNCLASSIFIED_BRANCH_ID = '__unclassified__'

export function isUnclassifiedBranch(nodeId: string): boolean {
  return nodeId === UNCLASSIFIED_BRANCH_ID
}

export function atlasNodeTitle(atlas: IndustryAtlas, nodeId: string): string {
  if (isUnclassifiedBranch(nodeId)) return 'Not yet classified into the national taxonomy'
  return atlas.nodes.get(nodeId)?.node.name ?? nodeId
}

/** Companies in one branch, ordered for stable rendering. */
export function companiesAtNode(
  atlas: IndustryAtlas,
  index: OrganizationIndex,
  nodeId: string,
): string[] {
  const ids = isUnclassifiedBranch(nodeId)
    ? atlas.unclassifiedOrganizationIds
    : (atlas.nodes.get(nodeId)?.organizationIds ?? [])
  return [...ids].sort((left, right) =>
    (index.byId.get(left)?.name ?? left).localeCompare(index.byId.get(right)?.name ?? right))
}

/**
 * Companies in one branch grouped into indicative footprint bands.
 *
 * Every band is rendered, including the empty ones, so a reader can see which
 * levels of an industry Maps has not reached. Within a band the order is
 * alphabetical: the bands are approximate, so a numeric rank inside one would
 * imply a precision the evidence does not have.
 */
export function footprintGroupsAtNode(
  atlas: IndustryAtlas,
  index: OrganizationIndex,
  nodeId: string,
): FootprintGroup[] {
  const organizationIds = companiesAtNode(atlas, index, nodeId)
  const groups = new Map<FootprintBand, string[]>()
  for (const band of FOOTPRINT_BANDS) groups.set(band, [])
  for (const organizationId of organizationIds) {
    const organization = index.byId.get(organizationId)
    const band = organization ? classifyFootprint(organization).band : 'not-established'
    groups.get(band)?.push(organizationId)
  }
  return FOOTPRINT_BANDS.map((band) => ({
    band,
    organizationIds: (groups.get(band) ?? []).sort((left, right) =>
      (index.byId.get(left)?.name ?? left).localeCompare(index.byId.get(right)?.name ?? right)),
  }))
}

/** Ancestor chain including the node itself, for breadcrumbs. */
export function atlasBreadcrumb(atlas: IndustryAtlas, nodeId: string): AtlasNode[] {
  const node = atlas.nodes.get(nodeId)
  if (!node) return []
  return node.path
    .map((entry) => atlas.nodes.get(entry.id))
    .filter((entry): entry is AtlasNode => Boolean(entry))
}

/** Descendant nodes at a given level, for the level-by-level drill-down. */
export function childrenWithCounts(atlas: IndustryAtlas, nodeId: string | null): AtlasNode[] {
  const ids = nodeId === null
    ? atlas.roots.map((entry) => entry.id)
    : (atlas.nodes.get(nodeId)?.childIds ?? [])
  return ids
    .map((id) => atlas.nodes.get(id))
    .filter((entry): entry is AtlasNode => Boolean(entry))
    .sort((left, right) => (
      right.counts.organizations - left.counts.organizations
      || left.node.name.localeCompare(right.node.name)
    ))
}

/** Every descendant of a node, for "show the whole branch" views. */
export function descendantNodeIds(atlas: IndustryAtlas, nodeId: string): string[] {
  const out: string[] = []
  const stack = [nodeId]
  const seen = new Set<string>()
  while (stack.length > 0) {
    const current = stack.pop() as string
    if (seen.has(current)) continue
    seen.add(current)
    out.push(current)
    for (const childId of atlas.nodes.get(current)?.childIds ?? []) stack.push(childId)
  }
  return out
}

/**
 * Tree search across node names and synonyms. Returns the deepest-first set of
 * matching node ids; callers render each with its full path so a match on
 * "cold chain" is never confused with a match on "logistics".
 */
export function searchAtlasNodes(atlas: IndustryAtlas, query: string, limit = 40): AtlasNode[] {
  const trimmed = query.trim().toLowerCase()
  if (trimmed.length === 0) return []
  const matches: AtlasNode[] = []
  for (const node of atlas.nodes.values()) {
    const haystack = [node.node.name, ...(node.node.synonyms ?? [])].join(' ').toLowerCase()
    if (haystack.includes(trimmed)) matches.push(node)
    if (matches.length >= limit * 4) break
  }
  return matches
    .sort((left, right) => (
      right.counts.organizations - left.counts.organizations
      || left.node.name.length - right.node.name.length
      || left.node.name.localeCompare(right.node.name)
    ))
    .slice(0, limit)
}

/** Macro-sector summary: the atlas landing view. */
export function macroSectorSummary(atlas: IndustryAtlas): AtlasNode[] {
  return atlas.roots
}

export function atlasNodeById(atlas: IndustryAtlas, nodeId: string): AtlasNode | null {
  return atlas.nodes.get(nodeId) ?? null
}

/** Resolve a taxonomy node id from outside the atlas (used by deep links). */
export function nodeExists(nodeId: string): boolean {
  return getTaxonomyNode(nodeId) !== null
}

/** Children of a taxonomy node, taken straight from the taxonomy loader. */
export function taxonomyChildren(nodeId: string | null): TaxonomyNode[] {
  return getChildren(nodeId)
}
