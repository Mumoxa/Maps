// The universal company universe: one flat, factual view of every organisation
// Maps knows about, with no focal company and no recruitment context.
//
// This is the layer the Industry Atlas, the universal company directory and the
// company dossier all read from, so the three can never disagree about what a
// company is. Recruitment relevance is deliberately absent from this module: a
// `CompanyView` is a statement of fact about a company, and a tier is a
// statement about one assignment. Mixing them is what let a client brief shape
// the company universe in the first place.

import { organizations } from './load'
import { slugify } from '../slug'
import type { OrganizationIndex, ResolvedEmployer } from './load'
import { scaleBucket } from './discovery'
import { classifyFootprint, FOOTPRINT_BANDS } from './footprint'
import { organizationTaxonomy } from './taxonomyPlacement'
import type { IndustryAtlas } from './atlas'
import { companiesAtNode, isUnclassifiedBranch } from './atlas'
import type {
  AssociationFilters,
  Confidence,
  FootprintBand,
  FootprintClassification,
  Organization,
  OrganizationStatus,
} from './types'

export interface CompanyView {
  organizationId: string
  name: string
  legalName: string
  aliases: string[]
  status: OrganizationStatus
  /** False for employers known only from a Maps dataset. */
  curated: boolean
  industryIds: string[]
  pocketIds: string[]
  macroSectorIds: string[]
  /** Every taxonomy node on every placement path, including ancestors. */
  taxonomyNodeIds: string[]
  /** Rendered "Macro-Sector > ... > Niche" labels. */
  taxonomyPaths: string[]
  /** Capability ids evidenced as observed. */
  observedCapabilityIds: string[]
  provinces: string[]
  scaleBuckets: string[]
  footprint: FootprintBand
  footprintClassification: FootprintClassification
  mappedProfessionals: number
  datasets: string[]
  /** Canonical parent organization id, where a corporate relationship is recorded. */
  groupId: string | null
  lastVerified: string
  confidence: Confidence
}

const CAPABILITY_RANK: Record<Confidence, number> = {
  confirmed: 4,
  probable: 3,
  hypothesis: 2,
  unknown: 1,
}

function organizationConfidence(organization: Organization): Confidence {
  let best: Confidence = 'unknown'
  for (const link of organization.capabilities) {
    if (link.status !== 'observed') continue
    if (CAPABILITY_RANK[link.confidence] > CAPABILITY_RANK[best]) best = link.confidence
  }
  return best
}

/** Build the factual view of one organisation. */
export function companyView(index: OrganizationIndex, organization: Organization): CompanyView {
  const employer: ResolvedEmployer | undefined = index.employersByOrg.get(organization.id)
  const placement = organizationTaxonomy(organization)
  const taxonomyNodeIds = new Set<string>()
  for (const entry of placement.entries) {
    taxonomyNodeIds.add(entry.node.id)
    for (const ancestor of entry.path) taxonomyNodeIds.add(ancestor.id)
  }
  const pocketIds = new Set<string>()
  for (const link of organization.industries) {
    const pocket = index.industryById.get(link.industryId)?.pocket
    if (pocket) pocketIds.add(pocket)
  }
  return {
    organizationId: organization.id,
    name: organization.name,
    legalName: organization.legalName,
    aliases: organization.aliases,
    status: organization.status,
    curated: index.byId.has(organization.id),
    industryIds: organization.industries.map((link) => link.industryId),
    pocketIds: [...pocketIds],
    macroSectorIds: placement.macroSectorIds,
    taxonomyNodeIds: [...taxonomyNodeIds],
    taxonomyPaths: placement.labels,
    observedCapabilityIds: organization.capabilities
      .filter((link) => link.status === 'observed')
      .map((link) => link.capabilityId),
    provinces: [...new Set(organization.locations.map((location) => location.province).filter(Boolean))],
    scaleBuckets: scaleBucket(organization),
    footprint: classifyFootprint(organization).band,
    footprintClassification: classifyFootprint(organization),
    mappedProfessionals: employer?.professionals ?? 0,
    datasets: employer?.datasets ?? organization.datasets,
    groupId: organization.parentId,
    lastVerified: organization.lastVerified,
    confidence: organizationConfidence(organization),
  }
}

/**
 * The whole universe as factual views, name-ordered.
 *
 * No top-N cap is applied anywhere in this module: pagination is a presentation
 * decision and is the caller's, so the searchable universe is always the full
 * universe.
 */
export function buildUniverseViews(index: OrganizationIndex, organizations: Organization[]): CompanyView[] {
  return organizations
    .map((organization) => companyView(index, organization))
    .sort((left, right) => left.name.localeCompare(right.name))
}

const canonicalSlugToId = new Map<string, string>()

/**
 * Resolve a legacy `/companies/:slug` slug onto a canonical organization id.
 *
 * Existing deep links keep working by redirecting to the canonical dossier
 * rather than forking the record: one company keeps one addressable identity.
 */
export function canonicalOrganizationIdForSlug(slug: string): string | null {
  if (canonicalSlugToId.size === 0) {
    for (const organization of organizations) {
      canonicalSlugToId.set(slugify(organization.name), organization.id)
      if (organization.legalName) canonicalSlugToId.set(slugify(organization.legalName), organization.id)
    }
  }
  return canonicalSlugToId.get(slug) ?? null
}

/** Companies placed on one branch of the atlas, including its descendants. */
export function viewsAtNode(
  views: CompanyView[],
  atlas: IndustryAtlas,
  index: OrganizationIndex,
  nodeId: string,
): CompanyView[] {
  if (isUnclassifiedBranch(nodeId)) {
    const ids = new Set(atlas.unclassifiedOrganizationIds)
    return views.filter((view) => ids.has(view.organizationId))
  }
  const ids = new Set(companiesAtNode(atlas, index, nodeId))
  return views.filter((view) => ids.has(view.organizationId))
}

/** Companies placed directly on one node, excluding its descendants. */
export function viewsDirectlyAtNode(views: CompanyView[], nodeId: string): CompanyView[] {
  return views.filter((view) => view.taxonomyNodeIds.includes(nodeId))
}

function searchHaystack(index: OrganizationIndex, view: CompanyView): string {
  const organization = index.byId.get(view.organizationId)
  const parts = [
    view.name,
    view.legalName,
    ...view.aliases,
    ...view.industryIds.map((id) => index.industryById.get(id)?.name ?? ''),
    ...view.taxonomyPaths,
    ...view.observedCapabilityIds.map((id) => index.capabilityById.get(id)?.name ?? ''),
    ...view.provinces,
  ]
  if (organization) {
    for (const location of organization.locations) parts.push(`${location.city} ${location.province}`)
    for (const link of organization.industries) parts.push(link.evidence)
  }
  return parts.join(' ').toLowerCase()
}

/**
 * Factual filtering.
 *
 * Every dimension here describes the company. `tiers` and `relationshipTypes`
 * are intentionally NOT applied: they describe a recruitment brief, and an
 * unscoped factual view must never be narrowed by one.
 */
export function filterCompanyViews(
  views: CompanyView[],
  filters: AssociationFilters,
  index: OrganizationIndex,
): CompanyView[] {
  const query = filters.query.trim().toLowerCase()
  const haystacks = query ? new Map(views.map((view) => [view.organizationId, searchHaystack(index, view)])) : null

  return views.filter((view) => {
    if (filters.pockets.length > 0 && !view.pocketIds.some((id) => filters.pockets.includes(id))) return false
    if (filters.industries.length > 0 && !view.industryIds.some((id) => filters.industries.includes(id))) return false
    if (filters.macroSectors.length > 0 && !view.macroSectorIds.some((id) => filters.macroSectors.includes(id))) return false
    if (filters.capabilities.length > 0 && !filters.capabilities.every((id) => view.observedCapabilityIds.includes(id))) return false
    if (filters.provinces.length > 0 && !view.provinces.some((province) => filters.provinces.includes(province))) return false
    if (filters.scale.length > 0 && !view.scaleBuckets.some((bucket) => filters.scale.includes(bucket))) return false
    if (filters.footprint.length > 0 && !filters.footprint.includes(view.footprint)) return false
    if (filters.confidence.length > 0 && !filters.confidence.includes(view.confidence)) return false
    if (filters.status.length > 0 && !filters.status.includes(view.status)) return false
    if (filters.groups.length > 0 && !(view.groupId && filters.groups.includes(view.groupId))) return false
    if (filters.hasMappedProfessionals === 'yes' && view.mappedProfessionals === 0) return false
    if (filters.hasMappedProfessionals === 'no' && view.mappedProfessionals > 0) return false
    if (query) {
      const haystack = haystacks?.get(view.organizationId) ?? ''
      if (!haystack.includes(query)) return false
    }
    return true
  })
}

/** Facet counts derived from the same views the list renders. */
export function facetCounts(views: CompanyView[]): {
  macroSectors: Map<string, number>
  industries: Map<string, number>
  pockets: Map<string, number>
  provinces: Map<string, number>
  footprint: Map<string, number>
  capabilities: Map<string, number>
} {
  const macroSectors = new Map<string, number>()
  const industries = new Map<string, number>()
  const pockets = new Map<string, number>()
  const provinces = new Map<string, number>()
  const footprint = new Map<string, number>()
  const capabilities = new Map<string, number>()

  const bump = (map: Map<string, number>, key: string) => map.set(key, (map.get(key) ?? 0) + 1)

  for (const view of views) {
    for (const id of view.macroSectorIds) bump(macroSectors, id)
    for (const id of view.industryIds) bump(industries, id)
    for (const id of view.pocketIds) bump(pockets, id)
    for (const province of view.provinces) bump(provinces, province)
    bump(footprint, view.footprint)
    for (const id of view.observedCapabilityIds) bump(capabilities, id)
  }
  return { macroSectors, industries, pockets, provinces, footprint, capabilities }
}

/**
 * Group an arbitrary set of companies into indicative footprint bands.
 *
 * Mirrors `footprintGroupsAtNode` so a filtered result and a whole branch are
 * grouped identically - otherwise the bands would appear to change meaning
 * depending on whether a filter was applied.
 */
export function groupByFootprint(views: CompanyView[]): { band: FootprintBand; organizationIds: string[] }[] {
  const groups = new Map<FootprintBand, CompanyView[]>()
  for (const band of FOOTPRINT_BANDS) groups.set(band, [])
  for (const view of views) {
    const list = groups.get(view.footprint)
    if (list) list.push(view)
  }
  return FOOTPRINT_BANDS.map((band) => ({
    band,
    organizationIds: (groups.get(band) ?? [])
      .sort((left, right) => left.name.localeCompare(right.name))
      .map((view) => view.organizationId),
  }))
}

export interface UniverseSummary {
  organizations: number
  verified: number
  pendingVerification: number
  withMappedProfessionals: number
  withSourcedScale: number
  footprintEstablished: number
  datasetOnly: number
  provinces: string[]
  lastResearchDate: string | null
}

/** Coverage figures for whatever set is on screen. */
export function summarizeViews(views: CompanyView[]): UniverseSummary {
  let verified = 0
  let pendingVerification = 0
  let withMappedProfessionals = 0
  let withSourcedScale = 0
  let footprintEstablished = 0
  let datasetOnly = 0
  let lastResearchDate = ''
  const provinces = new Set<string>()

  for (const view of views) {
    if (view.status === 'verified') verified += 1
    else pendingVerification += 1
    if (view.mappedProfessionals > 0) withMappedProfessionals += 1
    if (view.scaleBuckets.some((bucket) => bucket !== 'unknown')) withSourcedScale += 1
    if (view.footprint !== 'not-established') footprintEstablished += 1
    if (!view.curated) datasetOnly += 1
    for (const province of view.provinces) provinces.add(province)
    if (view.lastVerified > lastResearchDate) lastResearchDate = view.lastVerified
  }

  return {
    organizations: views.length,
    verified,
    pendingVerification,
    withMappedProfessionals,
    withSourcedScale,
    footprintEstablished,
    datasetOnly,
    provinces: [...provinces].sort(),
    lastResearchDate: lastResearchDate || null,
  }
}

/** Slice for presentation. The underlying list is never truncated. */
export function paginate<T>(items: T[], page: number, pageSize: number): { rows: T[]; totalPages: number } {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * pageSize
  return { rows: items.slice(start, start + pageSize), totalPages }
}

function csvCell(value: string | number): string {
  const text = String(value)
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

/**
 * CSV export of the filtered universe.
 *
 * The row count is whatever the caller passes, so an export always reconciles
 * to the result set the reviewer is looking at.
 */
export function exportCompanyViewsCsv(
  views: CompanyView[],
  columns: { header: string; pick: (view: CompanyView) => string | number }[],
): string {
  const header = columns.map((column) => csvCell(column.header)).join(',')
  const rows = views.map((view) => columns.map((column) => csvCell(column.pick(view))).join(','))
  return [header, ...rows].join('\n')
}

/** The columns every company export shares, so exports agree with each other. */
export function companyExportColumns(index: OrganizationIndex) {
  return [
    { header: 'organization_id', pick: (view: CompanyView) => view.organizationId },
    { header: 'company', pick: (view: CompanyView) => view.name },
    { header: 'legal_name', pick: (view: CompanyView) => view.legalName },
    {
      header: 'industries',
      pick: (view: CompanyView) => view.industryIds
        .map((id) => index.industryById.get(id)?.name ?? id)
        .join('; '),
    },
    { header: 'taxonomy_paths', pick: (view: CompanyView) => view.taxonomyPaths.join('; ') },
    { header: 'indicative_footprint', pick: (view: CompanyView) => view.footprint },
    { header: 'footprint_basis', pick: (view: CompanyView) => view.footprintClassification.basis },
    { header: 'footprint_review_status', pick: (view: CompanyView) => view.footprintClassification.reviewStatus },
    { header: 'provinces', pick: (view: CompanyView) => view.provinces.join('; ') },
    { header: 'mapped_professionals', pick: (view: CompanyView) => view.mappedProfessionals },
    { header: 'verification_status', pick: (view: CompanyView) => view.status },
    { header: 'last_verified', pick: (view: CompanyView) => view.lastVerified },
    { header: 'datasets', pick: (view: CompanyView) => view.datasets.join('; ') },
    { header: 'canonical_url', pick: (view: CompanyView) => `/organizations/${encodeURIComponent(view.organizationId)}` },
  ]
}
