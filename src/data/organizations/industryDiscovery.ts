// Industry-centred association exploration.
//
// The association engine already works well for "what resembles this one
// company". The defect was that it was the only way in, so the product's
// starting shape was a client's ego network. This module keeps the same evidence
// discipline but derives associations from shared membership of an industry, a
// capability, a geography or a verified corporate relationship - none of which
// requires a focal company.
//
// Every association carries one of five evidence classes, and the class is
// rendered wherever the association is rendered, because a shared industry and a
// verified shareholding are not the same kind of claim:
//
//   1. verified-factual-relationship  a sourced corporate or partnership record
//   2. shared-sourced-attribute       both companies evidence the same attribute
//   3. derived-operational-association inferred from taxonomy or value-chain position
//   4. recruiter-judgement            a reviewed or curated recruiter observation
//   5. unknown-relationship           nothing evidenced either way
//
// An association never implies ownership. Ownership is only ever claimed by a
// `parent-of` / `subsidiary-of` / `acquired` / `joint-venture` record.

import { corporateRelationships, curatedAssociations } from './load'
import { organizationTaxonomy } from './taxonomyPlacement'
import { getTaxonomyNode } from '../taxonomy/load'
import { resolveSectorPath } from '../taxonomy/load'
import type { OrganizationIndex } from './load'
import type { CompanyView } from './universeView'
import type { Confidence, Organization, OrganizationRelationship } from './types'

export type AssociationEvidenceClass =
  | 'verified-factual-relationship'
  | 'shared-sourced-attribute'
  | 'derived-operational-association'
  | 'recruiter-judgement'
  | 'unknown-relationship'

export const EVIDENCE_CLASS_LABELS: Record<AssociationEvidenceClass, string> = {
  'verified-factual-relationship': 'Verified factual relationship',
  'shared-sourced-attribute': 'Shared sourced attribute',
  'derived-operational-association': 'Derived operational association',
  'recruiter-judgement': 'Recruiter judgement or hypothesis',
  'unknown-relationship': 'Unknown relationship',
}

export const EVIDENCE_CLASS_NOTES: Record<AssociationEvidenceClass, string> = {
  'verified-factual-relationship': 'A sourced corporate record states this relationship. It is a fact about the companies, not a sourcing suggestion.',
  'shared-sourced-attribute': 'Both companies have independently evidenced the same attribute. Sharing an attribute does not make them related.',
  'derived-operational-association': 'Inferred from taxonomy or value-chain position. It indicates comparable operating environments, not contact, ownership or similarity of people.',
  'recruiter-judgement': 'A recruiter recorded this as a judgement or hypothesis. It is not verified company data.',
  'unknown-relationship': 'Nothing has been evidenced either way. Unknown is not the same as no relationship.',
}

export type AssociationKind =
  | 'corporate-ownership'
  | 'verified-partnership'
  | 'industry'
  | 'sub-industry'
  | 'value-chain'
  | 'capability'
  | 'technology'
  | 'geography'
  | 'recruiter-observation'

export const ASSOCIATION_KIND_LABELS: Record<AssociationKind, string> = {
  'corporate-ownership': 'Verified corporate ownership',
  'verified-partnership': 'Verified partnership',
  industry: 'Shared industry or sub-industry',
  'sub-industry': 'Shared national sub-industry branch',
  'value-chain': 'Value-chain adjacency',
  capability: 'Shared operating capability',
  technology: 'Shared technology',
  geography: 'Shared operating geography',
  'recruiter-observation': 'Recruiter observation',
}

export interface AssociationCluster {
  /** What the members share, e.g. a taxonomy node id or a capability id. */
  key: string
  label: string
  organizationIds: string[]
  evidence: string
  sourceUrl: string
  confidence: Confidence
}

export interface AssociationEdge {
  id: string
  leftId: string
  rightId: string
  clusterKey: string
  detail: string
}

export interface AssociationGroup {
  kind: AssociationKind
  label: string
  evidenceClass: AssociationEvidenceClass
  description: string
  clusters: AssociationCluster[]
  /** Pairwise edges, derived from the clusters for graph rendering. */
  edges: AssociationEdge[]
  /** Edges not generated because the group exceeded the rendering budget. */
  truncatedEdges: number
}

export interface IndustryAssociationResult {
  groups: AssociationGroup[]
  /** Companies in scope that share nothing evidenced with anything else. */
  unlinkedOrganizationIds: string[]
  coverage: {
    organizationsInScope: number
    clusters: number
    edges: number
    withUnknownRelationship: number
  }
}

/**
 * Edges per group. A graph of a few hundred companies produces tens of thousands
 * of pairs; rendering all of them is unreadable, so the graph is budgeted while
 * every cluster - the complete membership - stays listed in full. The budget is
 * reported, never hidden.
 */
const EDGE_BUDGET_PER_GROUP = 400

function pairs(organizationIds: string[]): [string, string][] {
  const out: [string, string][] = []
  for (let i = 0; i < organizationIds.length; i += 1) {
    for (let j = i + 1; j < organizationIds.length; j += 1) {
      out.push([organizationIds[i], organizationIds[j]])
    }
  }
  return out
}

function buildGroup(input: {
  kind: AssociationKind
  evidenceClass: AssociationEvidenceClass
  description: string
  clusters: AssociationCluster[]
  detailFor: (cluster: AssociationCluster, leftId: string, rightId: string, index: OrganizationIndex) => string
  index: OrganizationIndex
  minMembers?: number
}): AssociationGroup {
  const minimum = input.minMembers ?? 2
  const clusters = input.clusters
    // One company belongs to a cluster once, however many pockets, capabilities
    // or industries put it there: listing it twice would read as two companies.
    .map((cluster) => ({ ...cluster, organizationIds: [...new Set(cluster.organizationIds)] }))
    .filter((cluster) => cluster.organizationIds.length >= minimum)
    .sort((left, right) => (
      right.organizationIds.length - left.organizationIds.length
      || left.label.localeCompare(right.label)
    ))

  const edges: AssociationEdge[] = []
  let truncated = 0
  for (const cluster of clusters) {
    const all = pairs(cluster.organizationIds)
    const remaining = Math.max(0, EDGE_BUDGET_PER_GROUP - edges.length)
    for (const [leftId, rightId] of all.slice(0, remaining)) {
      edges.push({
        id: `${input.kind}:${cluster.key}:${leftId}:${rightId}`,
        leftId,
        rightId,
        clusterKey: cluster.key,
        detail: input.detailFor(cluster, leftId, rightId, input.index),
      })
    }
    truncated += Math.max(0, all.length - remaining)
  }

  return {
    kind: input.kind,
    label: ASSOCIATION_KIND_LABELS[input.kind],
    evidenceClass: input.evidenceClass,
    description: input.description,
    clusters,
    edges,
    truncatedEdges: truncated,
  }
}

function nameOf(index: OrganizationIndex, organizationId: string): string {
  return index.byId.get(organizationId)?.name ?? organizationId
}

// --- Cluster builders -------------------------------------------------------

function taxonomyClusters(
  views: CompanyView[],
  index: OrganizationIndex,
  level: 2 | 3 | 4,
): AssociationCluster[] {
  const byNode = new Map<string, AssociationCluster>()
  for (const view of views) {
    const organization = index.byId.get(view.organizationId)
    if (!organization) continue
    for (const entry of organizationTaxonomy(organization).entries) {
      const link = industryLinkEvidence(organization, entry.industryId)
      for (const node of entry.path) {
        if (node.level !== level) continue
        const existing = byNode.get(node.id)
        if (existing) {
          if (!existing.organizationIds.includes(view.organizationId)) {
            existing.organizationIds.push(view.organizationId)
            // Keep the first sourced line: it is the evidence for the placement,
            // and overwriting it with a later company's source would misattribute it.
            if (!existing.evidence && link.evidence) {
              existing.evidence = link.evidence
              existing.sourceUrl = link.sourceUrl
            }
          }
        } else {
          byNode.set(node.id, {
            key: node.id,
            label: node.name,
            organizationIds: [view.organizationId],
            evidence: `${link.evidence} Placement resolved through the Maps industry crosswalk into the national taxonomy.`,
            sourceUrl: link.sourceUrl,
            confidence: 'confirmed',
          })
        }
      }
    }
  }
  return [...byNode.values()].map((cluster) => ({
    ...cluster,
    organizationIds: cluster.organizationIds.sort((left, right) =>
      nameOf(index, left).localeCompare(nameOf(index, right))),
  }))
}

function industryLinkEvidence(organization: Organization, industryId: string): { evidence: string; sourceUrl: string } {
  const link = organization.industries.find((entry) => entry.industryId === industryId)
  return { evidence: link?.evidence ?? '', sourceUrl: link?.sourceUrl ?? '' }
}

function valueChainClusters(views: CompanyView[], index: OrganizationIndex): AssociationCluster[] {
  const byStage = new Map<string, AssociationCluster>()
  for (const view of views) {
    for (const pocketId of view.pocketIds) {
      const pocket = index.pocketById.get(pocketId)
      if (!pocket) continue
      const organization = index.byId.get(view.organizationId)
      const firstIndustry = organization?.industries.find(
        (link) => index.industryById.get(link.industryId)?.pocket === pocketId,
      )
      const evidence = organization && firstIndustry
        ? industryLinkEvidence(organization, firstIndustry.industryId)
        : { evidence: '', sourceUrl: '' }
      const existing = byStage.get(pocket.valueChainStage)
      if (existing) existing.organizationIds.push(view.organizationId)
      else {
        byStage.set(pocket.valueChainStage, {
          key: `stage:${pocket.valueChainStage}`,
          label: `${pocket.valueChainStage} stage of the value chain`,
          organizationIds: [view.organizationId],
          evidence: evidence.evidence,
          sourceUrl: evidence.sourceUrl,
          confidence: 'confirmed',
        })
      }
    }
  }
  return [...byStage.values()]
}

function capabilityClusters(
  views: CompanyView[],
  index: OrganizationIndex,
  group: 'operating' | 'commercial' | 'financial' | 'technology',
): AssociationCluster[] {
  const byCapability = new Map<string, AssociationCluster>()
  for (const view of views) {
    const organization = index.byId.get(view.organizationId)
    if (!organization) continue
    for (const link of organization.capabilities) {
      if (link.status !== 'observed') continue
      const capability = index.capabilityById.get(link.capabilityId)
      if (!capability || capability.group !== group) continue
      const existing = byCapability.get(link.capabilityId)
      if (existing) existing.organizationIds.push(view.organizationId)
      else {
        byCapability.set(link.capabilityId, {
          key: link.capabilityId,
          label: capability.name,
          organizationIds: [view.organizationId],
          evidence: link.evidence,
          sourceUrl: link.sourceUrl,
          confidence: link.confidence,
        })
      }
    }
  }
  return [...byCapability.values()]
}

function geographyClusters(views: CompanyView[], index: OrganizationIndex): AssociationCluster[] {
  const byProvince = new Map<string, AssociationCluster>()
  for (const view of views) {
    const organization = index.byId.get(view.organizationId)
    for (const province of view.provinces) {
      const location = organization?.locations.find((entry) => entry.province === province)
      const existing = byProvince.get(province)
      if (existing) existing.organizationIds.push(view.organizationId)
      else {
        byProvince.set(province, {
          key: `province:${province}`,
          label: province,
          organizationIds: [view.organizationId],
          evidence: location ? 'Location recorded from a cited source.' : '',
          sourceUrl: location?.sourceUrl ?? '',
          confidence: 'confirmed',
        })
      }
    }
  }
  return [...byProvince.values()]
}

const OWNERSHIP_TYPES = new Set(['parent-of', 'subsidiary-of', 'acquired', 'joint-venture'])

function relationshipClusters(
  views: CompanyView[],
  index: OrganizationIndex,
  ownership: boolean,
): AssociationCluster[] {
  const inScope = new Set(views.map((view) => view.organizationId))
  const seen = new Set<string>()
  const clusters: AssociationCluster[] = []
  for (const relationship of corporateRelationships) {
    if (ownership !== OWNERSHIP_TYPES.has(relationship.type)) continue
    if (!inScope.has(relationship.fromId) || !inScope.has(relationship.toId)) continue
    const groupKey = ownership ? relationship.type : 'verified-partnership'
    const clusterKey = `${groupKey}:${relationship.id}`
    if (seen.has(clusterKey)) continue
    seen.add(clusterKey)
    clusters.push({
      key: clusterKey,
      label: `${relationship.type.replace(/-/g, ' ')}: ${nameOf(index, relationship.fromId)} / ${nameOf(index, relationship.toId)}`,
      organizationIds: [relationship.fromId, relationship.toId],
      evidence: relationship.evidence,
      sourceUrl: relationship.sourceUrl,
      confidence: relationship.confidence,
    })
  }
  return clusters
}

function recruiterClusters(views: CompanyView[], index: OrganizationIndex): AssociationCluster[] {
  const inScope = new Set(views.map((view) => view.organizationId))
  const clusters: AssociationCluster[] = []
  for (const association of curatedAssociations) {
    if (!inScope.has(association.focalId) || !inScope.has(association.associatedId)) continue
    clusters.push({
      key: `assoc:${association.id}`,
      label: `${nameOf(index, association.focalId)} / ${nameOf(index, association.associatedId)}: ${association.relationshipType.replace(/-/g, ' ')}`,
      organizationIds: [association.focalId, association.associatedId],
      evidence: association.narrative,
      sourceUrl: association.sourceUrl,
      confidence: association.confidence,
    })
  }
  return clusters
}

// --- Public API -------------------------------------------------------------

/**
 * Associations among the supplied companies, with no focal organisation.
 *
 * `views` is the scoped, filtered universe: an atlas branch, a filter result or
 * the whole directory. Nothing here reintroduces a centre.
 */
export function industryAssociations(index: OrganizationIndex, views: CompanyView[]): IndustryAssociationResult {
  const groups: AssociationGroup[] = [
    buildGroup({
      kind: 'corporate-ownership',
      evidenceClass: 'verified-factual-relationship',
      description: 'Ownership, acquisition and joint-venture records held in the corporate relationship register. This is the only group that may imply control.',
      clusters: relationshipClusters(views, index, true),
      index,
      detailFor: (cluster, leftId, rightId) =>
        `${nameOf(index, leftId)} and ${nameOf(index, rightId)}: ${cluster.label}. ${cluster.evidence}`,
    }),
    buildGroup({
      kind: 'verified-partnership',
      evidenceClass: 'verified-factual-relationship',
      description: 'Partnerships evidenced in a cited source. A partnership is not ownership.',
      clusters: relationshipClusters(views, index, false),
      index,
      detailFor: (cluster, leftId, rightId) =>
        `${nameOf(index, leftId)} and ${nameOf(index, rightId)}: ${cluster.evidence || cluster.label}`,
    }),
    buildGroup({
      kind: 'industry',
      evidenceClass: 'shared-sourced-attribute',
      description: 'Companies placed in the same national industry sector. Same industry is not the same business, and never implies a relationship.',
      clusters: taxonomyClusters(views, index, 2),
      index,
      detailFor: (cluster, leftId, rightId) =>
        `${nameOf(index, leftId)} and ${nameOf(index, rightId)} both operate in ${cluster.label}.`,
    }),
    buildGroup({
      kind: 'sub-industry',
      evidenceClass: 'shared-sourced-attribute',
      description: 'Companies placed in the same sub-industry or operational niche, reached through the industry crosswalk.',
      clusters: taxonomyClusters(views, index, 3),
      index,
      detailFor: (cluster, leftId, rightId) =>
        `${nameOf(index, leftId)} and ${nameOf(index, rightId)} both sit in ${cluster.label}.`,
    }),
    buildGroup({
      kind: 'capability',
      evidenceClass: 'shared-sourced-attribute',
      description: 'Companies that have each independently evidenced the same operating capability.',
      clusters: capabilityClusters(views, index, 'operating'),
      index,
      detailFor: (cluster, leftId, rightId) =>
        `${nameOf(index, leftId)} and ${nameOf(index, rightId)} have both evidenced ${cluster.label}.`,
    }),
    buildGroup({
      kind: 'technology',
      evidenceClass: 'shared-sourced-attribute',
      description: 'Companies that have each evidenced the same system or technology.',
      clusters: capabilityClusters(views, index, 'technology'),
      index,
      detailFor: (cluster, leftId, rightId) =>
        `${nameOf(index, leftId)} and ${nameOf(index, rightId)} have both evidenced ${cluster.label}.`,
    }),
    buildGroup({
      kind: 'geography',
      evidenceClass: 'shared-sourced-attribute',
      description: 'Companies with a sourced presence in the same province. Sharing a province is the weakest signal here and is never ranked above operational evidence.',
      clusters: geographyClusters(views, index),
      index,
      detailFor: (cluster, leftId, rightId) =>
        `${nameOf(index, leftId)} and ${nameOf(index, rightId)} both operate in ${cluster.label}.`,
    }),
    buildGroup({
      kind: 'value-chain',
      evidenceClass: 'derived-operational-association',
      description: 'Companies at the same stage of the value chain. This is derived from sourcing-pocket position, not from any observed relationship.',
      clusters: valueChainClusters(views, index),
      index,
      detailFor: (cluster, leftId, rightId) =>
        `${nameOf(index, leftId)} and ${nameOf(index, rightId)} both sit at the ${cluster.label.replace(' stage of the value chain', '')} stage.`,
    }),
    buildGroup({
      kind: 'recruiter-observation',
      evidenceClass: 'recruiter-judgement',
      description: 'Reviewed or curated recruiter observations. These are judgements recorded by a named reviewer, not verified company facts.',
      clusters: recruiterClusters(views, index),
      index,
      detailFor: (cluster, leftId, rightId) =>
        `Recorded observation between ${nameOf(index, leftId)} and ${nameOf(index, rightId)}: ${cluster.evidence}`,
    }),
  ]

  const linked = new Set<string>()
  let edgeTotal = 0
  for (const group of groups) {
    for (const edge of group.edges) {
      linked.add(edge.leftId)
      linked.add(edge.rightId)
    }
    edgeTotal += group.edges.length
  }

  return {
    groups: groups.filter((group) => group.clusters.length > 0),
    unlinkedOrganizationIds: views
      .map((view) => view.organizationId)
      .filter((id) => !linked.has(id))
      .sort((left, right) => nameOf(index, left).localeCompare(nameOf(index, right))),
    coverage: {
      organizationsInScope: views.length,
      clusters: groups.reduce((total, group) => total + group.clusters.length, 0),
      edges: edgeTotal,
      withUnknownRelationship: views.length - linked.size,
    },
  }
}

/** Associations for one company, within an optional scope. */
export function associationsForOrganization(
  index: OrganizationIndex,
  result: IndustryAssociationResult,
  organizationId: string,
): { group: AssociationGroup; cluster: AssociationCluster; counterpartyIds: string[] }[] {
  const out: { group: AssociationGroup; cluster: AssociationCluster; counterpartyIds: string[] }[] = []
  for (const group of result.groups) {
    for (const cluster of group.clusters) {
      if (!cluster.organizationIds.includes(organizationId)) continue
      out.push({
        group,
        cluster,
        counterpartyIds: cluster.organizationIds
          .filter((id) => id !== organizationId)
          .sort((left, right) => nameOf(index, left).localeCompare(nameOf(index, right))),
      })
    }
  }
  return out
}

/**
 * Verified corporate hierarchy for one company, built only from sourced
 * relationship records.
 *
 * This is the ownership view. It is deliberately separate from the industry
 * tree: an industry tree answers "what does this company do", a corporate tree
 * answers "who controls it", and collapsing the two is how a holding company
 * ends up credited with its subsidiary's operating capability.
 */
export function corporateHierarchy(index: OrganizationIndex, organizationId: string): {
  parent: { id: string; name: string; evidence: string; sourceUrl: string } | null
  subsidiaries: { id: string; name: string; evidence: string; sourceUrl: string }[]
  otherRelationships: { id: string; type: string; counterpartyId: string; counterpartyName: string; evidence: string; sourceUrl: string; confidence: Confidence }[]
} {
  const relationships = index.relationshipsByOrg.get(organizationId) ?? []
  let parent: { id: string; name: string; evidence: string; sourceUrl: string } | null = null
  const subsidiaries: { id: string; name: string; evidence: string; sourceUrl: string }[] = []
  const otherRelationships: {
    id: string
    type: string
    counterpartyId: string
    counterpartyName: string
    evidence: string
    sourceUrl: string
    confidence: Confidence
  }[] = []

  const organization = index.byId.get(organizationId)
  if (organization?.parentId) {
    const parentOrg = index.byId.get(organization.parentId)
    if (parentOrg) {
      parent = {
        id: parentOrg.id,
        name: parentOrg.name,
        evidence: 'Canonical parent identifier recorded on the company record.',
        sourceUrl: '',
      }
    }
  }

  for (const relationship of relationships) {
    const counterpartyId = relationship.fromId === organizationId ? relationship.toId : relationship.fromId
    if (relationship.type === 'parent-of' && relationship.fromId === organizationId) {
      subsidiaries.push({
        id: counterpartyId,
        name: nameOf(index, counterpartyId),
        evidence: relationship.evidence,
        sourceUrl: relationship.sourceUrl,
      })
      continue
    }
    if (relationship.type === 'subsidiary-of' && !parent) {
      parent = {
        id: counterpartyId,
        name: nameOf(index, counterpartyId),
        evidence: relationship.evidence,
        sourceUrl: relationship.sourceUrl,
      }
      continue
    }
    otherRelationships.push({
      id: relationship.id,
      type: relationship.type,
      counterpartyId,
      counterpartyName: nameOf(index, counterpartyId),
      evidence: relationship.evidence,
      sourceUrl: relationship.sourceUrl,
      confidence: relationship.confidence,
    })
  }

  return { parent, subsidiaries, otherRelationships }
}

/** The rendered taxonomy path for a node, for breadcrumbs and filters. */
export function taxonomyPathLabel(nodeId: string): string {
  return resolveSectorPath(nodeId).map((node) => node.name).join(' > ')
}

export function taxonomyNodeName(nodeId: string): string {
  return getTaxonomyNode(nodeId)?.name ?? nodeId
}

export type { OrganizationRelationship }
