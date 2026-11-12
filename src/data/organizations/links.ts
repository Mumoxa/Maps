// Canonical cross-links between the industry atlas, the company universe, the
// association explorer, the people directories and the industry-body directory.
//
// Every count the product renders names a real set. The defect this module
// exists to prevent is a count that looks interactive and leads nowhere (or
// worse, leads to a list that does not reconcile with the number). One module
// owns the URL for each set, so the atlas, the directory, the dossier and the
// association explorer cannot disagree about where "146 companies" goes.
//
// Nothing here is presentation. It builds hrefs from the same filter contract
// the pages read (`readFilters` / `writeFilters`), which is what makes a link
// and a hand-set filter equivalent.

import { nodeExists } from './atlas'
import { FOOTPRINT_BANDS, isEstablishedBand } from './footprint'
import { writeFilters } from './query'
import { EMPTY_FILTERS } from './types'
import type { AssociationFilters, FootprintBand } from './types'

export interface CompanyUniverseScope {
  /** National taxonomy branch, or the unclassified branch id. */
  nodeId?: string | null
  /** Any factual filter, written through the shared filter contract. */
  filters?: Partial<AssociationFilters>
}

/** Bands that are an actual evidenced classification rather than a gap. */
export const ESTABLISHED_FOOTPRINT_BANDS: FootprintBand[] = FOOTPRINT_BANDS.filter(isEstablishedBand)

/**
 * Statuses the atlas counts as "pending verification". The atlas counts every
 * company that is not `verified`, so a pending drill-down must name both
 * non-verified states or it would land on a smaller set than the count.
 */
export const PENDING_VERIFICATION_STATUSES = ['needs-verification', 'listed-only']

function withNode(params: URLSearchParams, nodeId?: string | null): URLSearchParams {
  if (nodeId) params.set('node', nodeId)
  return params
}

function withQuery(path: string, params: URLSearchParams): string {
  const query = params.toString()
  return query ? `${path}?${query}` : path
}

/** The company universe, optionally scoped to a branch and narrowed by filters. */
export function companyUniverseHref(scope: CompanyUniverseScope = {}): string {
  const filters: AssociationFilters = { ...EMPTY_FILTERS, ...scope.filters }
  const params = withNode(writeFilters(new URLSearchParams(), filters), scope.nodeId)
  return withQuery('/companies', params)
}

/** One industry branch in the atlas. */
export function atlasBranchHref(nodeId: string | null, extra?: Record<string, string>): string {
  const params = new URLSearchParams()
  withNode(params, nodeId)
  for (const [key, value] of Object.entries(extra ?? {})) if (value) params.set(key, value)
  return withQuery('/industry-atlas', params)
}

/** Every company in a branch, unresolved gaps included. */
export function branchCompaniesHref(nodeId: string | null): string {
  return companyUniverseHref({ nodeId })
}

/** Companies in a branch whose identity has been verified. */
export function branchVerifiedHref(nodeId: string | null): string {
  return companyUniverseHref({ nodeId, filters: { status: ['verified'] } })
}

/** Companies in a branch still awaiting verification, in either pending state. */
export function branchPendingHref(nodeId: string | null): string {
  return companyUniverseHref({ nodeId, filters: { status: PENDING_VERIFICATION_STATUSES } })
}

/** Companies in a branch with at least one mapped professional on record. */
export function branchWithProfessionalsHref(nodeId: string | null): string {
  return companyUniverseHref({ nodeId, filters: { hasMappedProfessionals: 'yes' } })
}

/** Companies in a branch with no mapped professional yet (a research gap). */
export function branchWithoutProfessionalsHref(nodeId: string | null): string {
  return companyUniverseHref({ nodeId, filters: { hasMappedProfessionals: 'no' } })
}

/** Companies in a branch in one footprint band, or in any established band. */
export function branchFootprintHref(nodeId: string | null, band?: FootprintBand | null): string {
  return companyUniverseHref({
    nodeId,
    filters: { footprint: band ? [band] : ESTABLISHED_FOOTPRINT_BANDS },
  })
}

export function companiesInProvinceHref(province: string, nodeId?: string | null): string {
  return companyUniverseHref({ nodeId, filters: { provinces: [province] } })
}

export function companiesWithCapabilityHref(capabilityId: string, nodeId?: string | null): string {
  return companyUniverseHref({ nodeId, filters: { capabilities: [capabilityId] } })
}

export function companiesInIndustryHref(industryId: string, nodeId?: string | null): string {
  return companyUniverseHref({ nodeId, filters: { industries: [industryId] } })
}

export function companiesInGroupHref(groupId: string): string {
  return companyUniverseHref({ filters: { groups: [groupId] } })
}

/**
 * The people list for a whole branch.
 *
 * People are addressed by the branch rather than by a list of employer names:
 * a branch can hold hundreds of employers, and a URL that names them all would
 * be unshareable. The contact directory resolves each person's employer onto the
 * canonical company and then onto its taxonomy placement, so the list is derived
 * from the same placement the atlas counts.
 */
export function branchProfessionalsHref(nodeId: string): string {
  return `/contacts?node=${encodeURIComponent(nodeId)}`
}

/** The people list for one company, addressed by its canonical organization id. */
export function companyProfessionalsHref(organizationId: string): string {
  return `/contacts?org=${encodeURIComponent(organizationId)}`
}

/** Human labels for the people datasets the company universe counts. */
export const PEOPLE_DATASET_LABELS: Record<string, string> = {
  contacts: 'contact directory',
  'accounting-finance': 'accounting & finance pool',
  'credit-risk': 'credit-risk candidate profiles',
  'search-bank': 'search bank',
}

/**
 * The page that lists one dataset's people at one company.
 *
 * Only the contact directory resolves people onto the canonical employer, so it
 * is the only source whose count is guaranteed to equal the list it opens. The
 * other datasets keep their own employer spellings, so their links open the pool
 * filtered to the employer and the destination states its own count.
 */
export function peopleDatasetHref(
  dataset: string,
  organizationId: string,
  companyName: string,
): string | null {
  if (dataset === 'contacts') return companyProfessionalsHref(organizationId)
  if (dataset === 'accounting-finance') return `/accounting-finance?employer=${encodeURIComponent(companyName)}`
  if (dataset === 'credit-risk') return `/profiles?company=${encodeURIComponent(companyName)}`
  if (dataset === 'search-bank') return `/search-bank?q=${encodeURIComponent(companyName)}`
  return null
}

/** Industry-evidenced associations for a branch, never centred on one company. */
export function branchAssociationsHref(nodeId: string | null, view?: 'groups' | 'table'): string {
  const params = new URLSearchParams()
  withNode(params, nodeId)
  if (view) params.set('view', view)
  return withQuery('/company-associations', params)
}

/** A company-centred association network, opened only because a reader asked. */
export function companyAssociationsHref(organizationId: string, view?: 'network' | 'pockets' | 'table'): string {
  return withQuery('/company-associations', new URLSearchParams({
    focus: organizationId,
    ...(view ? { view } : {}),
  }))
}

/**
 * The companies behind one association cluster, when the cluster names a set
 * the company universe can filter on.
 *
 * A cluster is only linked when the filter reproduces it exactly: a shared
 * taxonomy branch, a shared evidenced capability or a shared province. An
 * ownership or partnership cluster is a sourced pair, not a filter, so it is
 * deliberately not turned into a link that would return a different set.
 */
export function associationClusterHref(kind: string, key: string): string | null {
  if (kind === 'industry' || kind === 'sub-industry' || kind === 'shared-branch') {
    return nodeExists(key) ? companyUniverseHref({ nodeId: key }) : null
  }
  if (kind === 'capability' || kind === 'technology') {
    return key ? companyUniverseHref({ filters: { capabilities: [key] } }) : null
  }
  if (kind === 'geography' && key.startsWith('province:')) {
    return companyUniverseHref({ filters: { provinces: [key.slice('province:'.length)] } })
  }
  return null
}

export interface IndustryBodiesLinkOptions {
  view?: 'bodies' | 'company-map' | 'members' | 'networks' | 'leadership' | 'coverage'
  query?: string
  bodyId?: string
  /** Evidence status, e.g. Confirmed. */
  status?: string
  /**
   * National taxonomy branch. Bodies are not classified into the tree, so this
   * scopes to the bodies that list a researched member company placed in it.
   */
  node?: string | null
}

/** The industry-body explorer, optionally filtered to one body or search text. */
export function industryBodiesHref(options: IndustryBodiesLinkOptions = {}): string {
  const params = new URLSearchParams()
  if (options.view) params.set('view', options.view)
  if (options.query) params.set('q', options.query)
  if (options.bodyId) params.set('body', options.bodyId)
  if (options.status) params.set('status', options.status)
  withNode(params, options.node)
  return withQuery('/industry-bodies', params)
}

/** The industry bodies that reference one company by name. */
export function companyBodiesHref(companyName: string): string {
  return industryBodiesHref({ view: 'company-map', query: companyName })
}

/** A company dossier, keeping the branch the reader came from. */
export function companyDossierHref(organizationId: string, fromNodeId?: string | null): string {
  const params = new URLSearchParams()
  if (fromNodeId) params.set('from', fromNodeId)
  return withQuery(`/organizations/${encodeURIComponent(organizationId)}`, params)
}
