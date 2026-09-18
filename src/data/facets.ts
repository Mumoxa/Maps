// Reusable, data-driven faceted-filtering engine shared across talent tracks.
//
// A track declares its filterable dimensions as FacetDef[]; this module derives
// options + counts from the actual data (never hardcoded), filters with
// OR-within-a-facet / AND-across-facets semantics, and (de)serialises the
// selection to URL search params. New tracks reuse this rather than
// re-implementing filtering per page.

export interface FacetValue {
  value: string
  label: string
  count: number
}

export interface FacetDef<T> {
  /** URL-safe key, e.g. "qualification". */
  key: string
  /** Human label for the facet group, e.g. "Qualification". */
  label: string
  /** Returns this record's values for the facet (0..n). */
  accessor: (record: T) => string[]
  /** Optional preferred ordering of values; unlisted values fall back to count-desc. */
  order?: string[]
  /** Show an in-facet search box once options exceed this many (default: no search). */
  searchThreshold?: number
}

/** Multi-select selection state: facet key -> chosen values. */
export type FacetSelections = Record<string, string[]>

/** Free-text predicate applied in addition to facet selections. */
export type TextMatcher<T> = (record: T, needle: string) => boolean

function values<T>(def: FacetDef<T>, record: T): string[] {
  // De-duplicate within a single record so one person can't inflate a count.
  return [...new Set(def.accessor(record).filter(Boolean))]
}

function matchesFacet<T>(def: FacetDef<T>, record: T, selected: string[]): boolean {
  if (!selected || selected.length === 0) return true
  const recordValues = new Set(values(def, record))
  // OR within a facet: record matches if it has ANY of the selected values.
  return selected.some((value) => recordValues.has(value))
}

function matchesText<T>(record: T, needle: string, matcher?: TextMatcher<T>): boolean {
  const trimmed = needle.trim().toLowerCase()
  if (!trimmed || !matcher) return true
  return matcher(record, trimmed)
}

export interface FilterInput<T> {
  records: T[]
  defs: FacetDef<T>[]
  selections: FacetSelections
  query?: string
  textMatcher?: TextMatcher<T>
}

/** Records matching every active facet (AND across facets) and the text query. */
export function filterByFacets<T>({ records, defs, selections, query = '', textMatcher }: FilterInput<T>): T[] {
  return records.filter((record) => {
    if (!matchesText(record, query, textMatcher)) return false
    return defs.every((def) => matchesFacet(def, record, selections[def.key] ?? []))
  })
}

function sortOptions(options: FacetValue[], order?: string[]): FacetValue[] {
  return [...options].sort((a, b) => {
    if (order) {
      const ai = order.indexOf(a.value)
      const bi = order.indexOf(b.value)
      if (ai !== -1 || bi !== -1) {
        if (ai === -1) return 1
        if (bi === -1) return -1
        return ai - bi
      }
    }
    return b.count - a.count || a.label.localeCompare(b.label)
  })
}

/**
 * Contextual option counts for one facet: counted over the records that match
 * every OTHER active facet and the text query, so counts reflect what selecting
 * a value would actually yield. Currently-selected values in this facet are
 * always retained (count may be 0) so users can still deselect them.
 */
export function buildFacetOptions<T>(
  input: FilterInput<T>,
  target: FacetDef<T>,
): FacetValue[] {
  const { records, defs, selections, query = '', textMatcher } = input
  const otherDefs = defs.filter((def) => def.key !== target.key)
  const contextRecords = records.filter((record) => {
    if (!matchesText(record, query, textMatcher)) return false
    return otherDefs.every((def) => matchesFacet(def, record, selections[def.key] ?? []))
  })

  const counts = new Map<string, number>()
  for (const record of contextRecords) {
    for (const value of values(target, record)) {
      counts.set(value, (counts.get(value) ?? 0) + 1)
    }
  }
  // Keep selected values visible even when the current context zeroes them out.
  for (const value of selections[target.key] ?? []) {
    if (!counts.has(value)) counts.set(value, 0)
  }

  const options = [...counts.entries()].map(([value, count]) => ({ value, label: value, count }))
  return sortOptions(options, target.order)
}

/** Total number of selected values across all facets (for the mobile "Filters (N)" badge). */
export function activeFilterCount(selections: FacetSelections): number {
  return Object.values(selections).reduce((total, list) => total + (list?.length ?? 0), 0)
}

// ----- URL (de)serialisation: each facet key -> comma-joined values -----

export function readSelections(params: URLSearchParams, defs: { key: string }[]): FacetSelections {
  const selections: FacetSelections = {}
  for (const { key } of defs) {
    const raw = params.get(key)
    selections[key] = raw ? raw.split(',').map((value) => value.trim()).filter(Boolean) : []
  }
  return selections
}

/** Apply selections onto a URLSearchParams copy: empty facets are removed, page reset. */
export function writeSelections(
  params: URLSearchParams,
  selections: FacetSelections,
): URLSearchParams {
  const next = new URLSearchParams(params)
  for (const [key, list] of Object.entries(selections)) {
    if (list && list.length) next.set(key, list.join(','))
    else next.delete(key)
  }
  next.delete('page')
  return next
}

/** Toggle a single value within a facet, returning new selections. */
export function toggleValue(
  selections: FacetSelections,
  key: string,
  value: string,
): FacetSelections {
  const current = selections[key] ?? []
  const next = current.includes(value)
    ? current.filter((entry) => entry !== value)
    : [...current, value]
  return { ...selections, [key]: next }
}
