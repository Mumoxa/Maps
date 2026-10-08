// URL state for the Company Association Explorer. Every view, filter,
// selection and expansion is in the query string so a view can be shared,
// bookmarked and restored with the browser back button.

import { EMPTY_FILTERS, type AssociationType, type ExplorerFilters } from '../../data/intelligence/discovery'
import type { Tier } from '../../data/intelligence/targeting'
import type { Confidence } from '../../data/intelligence/types'

export type ExplorerView = 'network' | 'pockets' | 'table'

export interface ExplorerState {
  focus: string | null
  /** `none`, a role-context template id, `custom`, or `search:<assignment id>`. */
  context: string
  view: ExplorerView
  scope: 'associated' | 'all'
  selected: string | null
  expanded: string[]
  compare: string[]
  custom: { mandatory: string[]; preferred: string[]; preferredIndustries: string[]; adjacentIndustries: string[]; deprioritisedIndustries: string[] }
  filters: ExplorerFilters
  page: number
}

const list = (params: URLSearchParams, key: string) => (params.get(key) ?? '').split(',').map((part) => part.trim()).filter(Boolean)

export function readExplorerState(params: URLSearchParams): ExplorerState {
  const view = params.get('view')
  return {
    focus: params.get('focus'),
    context: params.get('context') ?? 'none',
    view: view === 'pockets' || view === 'table' ? view : 'network',
    scope: params.get('scope') === 'all' ? 'all' : 'associated',
    selected: params.get('org'),
    expanded: list(params, 'expanded'),
    compare: list(params, 'compare'),
    custom: {
      mandatory: list(params, 'mand'),
      preferred: list(params, 'pref'),
      preferredIndustries: list(params, 'pind'),
      adjacentIndustries: list(params, 'aind'),
      deprioritisedIndustries: list(params, 'dind'),
    },
    filters: {
      ...EMPTY_FILTERS,
      industries: list(params, 'ind'),
      capabilities: list(params, 'cap'),
      tiers: list(params, 'tier') as Tier[],
      associations: list(params, 'assoc') as AssociationType[],
      confidence: list(params, 'conf') as Confidence[],
      provinces: list(params, 'prov'),
      people: list(params, 'people') as ExplorerFilters['people'],
      evidence: list(params, 'ev') as ExplorerFilters['evidence'],
      coverage: list(params, 'cov') as ExplorerFilters['coverage'],
      q: params.get('q') ?? '',
    },
    page: Math.max(1, parseInt(params.get('page') ?? '1', 10) || 1),
  }
}

export const FILTER_PARAM: Record<Exclude<keyof ExplorerFilters, 'q'>, string> = {
  industries: 'ind',
  capabilities: 'cap',
  tiers: 'tier',
  associations: 'assoc',
  confidence: 'conf',
  provinces: 'prov',
  people: 'people',
  evidence: 'ev',
  coverage: 'cov',
}

/** Returns a new URLSearchParams with the given keys set (empty values remove the key). */
export function patchParams(current: URLSearchParams, patch: Record<string, string | string[] | null>): URLSearchParams {
  const next = new URLSearchParams(current)
  for (const [key, value] of Object.entries(patch)) {
    const text = Array.isArray(value) ? value.join(',') : value
    if (text === null || text === '') next.delete(key)
    else next.set(key, text)
  }
  return next
}
