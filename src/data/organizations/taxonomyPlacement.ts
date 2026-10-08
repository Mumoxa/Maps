// Placement of the Maps organization model into the national corporate taxonomy.
//
// This module adds no data of its own. It resolves each Maps industry onto the
// national sector tree through `markets/organizations/taxonomy/industry-crosswalk.json`
// and exposes the result as O(1) lookups, so the association explorer can reason
// about sub-industry structure without a second, parallel classification.
//
// The Maps industry list is deliberately flat (every parentId in industries.json
// is null). The hierarchy lives in the taxonomy, reached through the crosswalk,
// rather than being copied into a second tree.

import { getTaxonomyNode, industryCrosswalk, resolveSectorPath } from '../taxonomy/load'
import type { TaxonomyNode } from '../taxonomy/types'
import type { Organization } from './types'

export interface TaxonomyPlacementEntry {
  industryId: string
  /** The national node this Maps industry resolves to. */
  node: TaxonomyNode
  /** L1 macro-sector down to `node`, inclusive. */
  path: TaxonomyNode[]
}

export interface OrganizationTaxonomy {
  entries: TaxonomyPlacementEntry[]
  /** Distinct nodes across every industry the company holds. */
  nodes: TaxonomyNode[]
  /** Macro-sector (L1) ids, de-duplicated. */
  macroSectorIds: string[]
  /** Rendered "Macro-Sector > ... > Niche" labels, one per entry. */
  labels: string[]
}

/** Maps industry id -> national taxonomy nodes. Built once from the crosswalk. */
const nodesByIndustry = new Map<string, TaxonomyNode[]>()
for (const mapping of industryCrosswalk.industryMappings) {
  const node = getTaxonomyNode(mapping.taxonomyNode)
  if (node) {
    const existing = nodesByIndustry.get(mapping.industryId) ?? []
    existing.push(node)
    nodesByIndustry.set(mapping.industryId, existing)
  }
}

export function taxonomyNodesForIndustry(industryId: string): TaxonomyNode[] {
  return nodesByIndustry.get(industryId) ?? []
}

export const EMPTY_TAXONOMY: OrganizationTaxonomy = { entries: [], nodes: [], macroSectorIds: [], labels: [] }

function placementFor(organization: Organization): OrganizationTaxonomy {
  const entries: TaxonomyPlacementEntry[] = []
  const nodes: TaxonomyNode[] = []
  const seenNodes = new Set<string>()
  const macroSectorIds: string[] = []
  const seenMacros = new Set<string>()

  for (const link of organization.industries) {
    for (const node of nodesByIndustry.get(link.industryId) ?? []) {
      const path = resolveSectorPath(node.id)
      entries.push({ industryId: link.industryId, node, path })
      if (!seenNodes.has(node.id)) {
        seenNodes.add(node.id)
        nodes.push(node)
      }
      const macro = path[0]
      if (macro && !seenMacros.has(macro.id)) {
        seenMacros.add(macro.id)
        macroSectorIds.push(macro.id)
      }
    }
  }

  if (entries.length === 0) return EMPTY_TAXONOMY
  return {
    entries,
    nodes,
    macroSectorIds,
    labels: entries.map((entry) => entry.path.map((node) => node.name).join(' > ')),
  }
}

const placementByOrganization = new Map<string, OrganizationTaxonomy>()

/**
 * National taxonomy placement for one company. Curated organizations are
 * resolved once and cached; dataset-only stubs carry no industries and resolve
 * to the shared empty placement rather than being recomputed per call.
 */
export function organizationTaxonomy(organization: Organization): OrganizationTaxonomy {
  const cached = placementByOrganization.get(organization.id)
  if (cached) return cached
  const placement = organization.industries.length === 0 ? EMPTY_TAXONOMY : placementFor(organization)
  placementByOrganization.set(organization.id, placement)
  return placement
}

/** Ancestor ids for a node, including the node itself. */
function ancestorIds(node: TaxonomyNode): string[] {
  return resolveSectorPath(node.id).map((entry) => entry.id)
}

/**
 * The deepest branch two sets of placements share, or null when they share
 * nothing. Level 1 only (a shared macro-sector) is returned as-is; callers
 * decide whether that is strong enough to count as an industry association,
 * because sharing a macro-sector alone is weaker evidence than sharing a
 * sub-industry.
 */
export function sharedTaxonomyBranch(left: TaxonomyNode[], right: TaxonomyNode[]): TaxonomyNode | null {
  if (left.length === 0 || right.length === 0) return null

  const rightAncestors = new Map<string, TaxonomyNode>()
  for (const node of right) {
    for (const ancestor of resolveSectorPath(node.id)) {
      const existing = rightAncestors.get(ancestor.id)
      if (!existing || ancestor.level > existing.level) rightAncestors.set(ancestor.id, ancestor)
    }
  }

  let deepest: TaxonomyNode | null = null
  for (const node of left) {
    for (const id of ancestorIds(node)) {
      const candidate = rightAncestors.get(id)
      if (candidate && (!deepest || candidate.level > deepest.level)) deepest = candidate
    }
  }
  return deepest
}
