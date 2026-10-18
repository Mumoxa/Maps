import { useState } from 'react'
import { MagnifyingGlass } from '@phosphor-icons/react'
import type { OrganizationIndex } from '../../data/organizations/load'
import {
  FOOTPRINT_BANDS,
  FOOTPRINT_SHORT_LABELS,
} from '../../data/organizations/footprint'
import { facetCounts } from '../../data/organizations/universeView'
import type { CompanyView } from '../../data/organizations/universeView'
import { getTaxonomyNode } from '../../data/taxonomy/load'
import { SCALE_BUCKETS } from '../../data/organizations/discovery'
import type { AssociationFilters } from '../../data/organizations/types'

interface Dimension {
  key: keyof AssociationFilters
  label: string
  options: { value: string; label: string; count: number }[]
  hint?: string
}

interface CompanyFiltersProps {
  views: CompanyView[]
  filters: AssociationFilters
  index: OrganizationIndex
  idPrefix: string
  onChange: (next: AssociationFilters) => void
}

const SCALE_LABELS: Record<string, string> = {
  'under-100': 'Under 100 employees',
  '100-to-1000': '100 to 1,000 employees',
  'over-1000': 'Over 1,000 employees',
  unverified: 'Sourced scale, not a headcount',
  unknown: 'No sourced scale',
}

const STATUS_LABELS: Record<string, string> = {
  verified: 'Verified',
  'needs-verification': 'Pending verification',
}

/**
 * The factual company filter panel.
 *
 * Every count comes from the same `views` list the results render, so the panel
 * and the list can never disagree. There is no relevance-tier dimension here:
 * a tier describes one recruitment brief, and an unscoped industry or directory
 * view must not be narrowed by one.
 */
export function CompanyFilters({
  views,
  filters,
  index,
  idPrefix,
  onChange,
}: CompanyFiltersProps) {
  const [capabilitySearch, setCapabilitySearch] = useState('')

  const dimensions = useMemoDimensions(views, index, capabilitySearch)

  const toggle = (key: keyof AssociationFilters, value: string) => {
    const current = filters[key] as string[]
    const next = current.includes(value) ? current.filter((entry) => entry !== value) : [...current, value]
    onChange({ ...filters, [key]: next })
  }

  const activeCount = dimensions.reduce(
    (total, dimension) => total + (filters[dimension.key] as string[]).length,
    0,
  )

  return (
    <div className="facet-panel">
      <div className="assoc-filter-search">
        <MagnifyingGlass size={14} aria-hidden />
        <input
          type="search"
          value={filters.query}
          onChange={(event) => onChange({ ...filters, query: event.target.value })}
          placeholder="Search companies, industries, places…"
          aria-label={`${idPrefix} search companies and industries`}
        />
      </div>

      {activeCount > 0 && (
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => onChange({
            ...filters,
            pockets: [],
            industries: [],
            macroSectors: [],
            capabilities: [],
            provinces: [],
            scale: [],
            footprint: [],
            groups: [],
            status: [],
            confidence: [],
          })}
        >
          Clear {activeCount} filter{activeCount === 1 ? '' : 's'}
        </button>
      )}

      {dimensions.map((dimension) => {
        const selected = filters[dimension.key] as string[]
        if (dimension.options.length === 0) return null
        const key = String(dimension.key)
        const labelId = `${idPrefix}-${key}-label`
        return (
          <section key={key} className="facet-group" aria-labelledby={labelId}>
            <h3 className="facet-group-label" id={labelId}>{dimension.label}</h3>
            {dimension.hint && <p className="assoc-filter-hint">{dimension.hint}</p>}
            {dimension.key === 'capabilities' && (
              <div className="facet-search">
                <input
                  type="search"
                  value={capabilitySearch}
                  onChange={(event) => setCapabilitySearch(event.target.value)}
                  placeholder="Filter capabilities"
                  aria-label={`${idPrefix} filter capability list`}
                />
              </div>
            )}
            <ul className="facet-options">
              {dimension.options.map((option) => {
                const inputId = `${idPrefix}-${key}-${option.value}`
                return (
                  <li key={option.value}>
                    <label className="facet-option" htmlFor={inputId}>
                      <input
                        id={inputId}
                        type="checkbox"
                        checked={selected.includes(option.value)}
                        onChange={() => toggle(dimension.key, option.value)}
                      />
                      <span className="facet-option-label">{option.label}</span>
                      <span className="facet-option-count">{option.count}</span>
                    </label>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </div>
  )
}

function useMemoDimensions(
  views: CompanyView[],
  index: OrganizationIndex,
  capabilitySearch: string,
): Dimension[] {
  const counts = facetCounts(views)
  const byCount = (map: Map<string, number>, labelFor: (value: string) => string) =>
    [...map.entries()]
      .map(([value, count]) => ({ value, label: labelFor(value), count }))
      .sort((left, right) => right.count - left.count || left.label.localeCompare(right.label))

  const groupCounts = new Map<string, number>()
  const statusCounts = new Map<string, number>()
  const confidenceCounts = new Map<string, number>()
  const scaleCounts = new Map<string, number>()
  for (const view of views) {
    if (view.groupId && index.byId.has(view.groupId)) {
      groupCounts.set(view.groupId, (groupCounts.get(view.groupId) ?? 0) + 1)
    }
    statusCounts.set(view.status, (statusCounts.get(view.status) ?? 0) + 1)
    confidenceCounts.set(view.confidence, (confidenceCounts.get(view.confidence) ?? 0) + 1)
    for (const bucket of view.scaleBuckets) scaleCounts.set(bucket, (scaleCounts.get(bucket) ?? 0) + 1)
  }

  const search = capabilitySearch.trim().toLowerCase()

  const dimensions: Dimension[] = [
    {
      key: 'macroSectors',
      label: 'National macro-sector',
      hint: 'Level 1 of the national taxonomy, reached through the industry crosswalk.',
      options: byCount(counts.macroSectors, (value) => getTaxonomyNode(value)?.name ?? value),
    },
    {
      key: 'industries',
      label: 'Maps industry',
      options: byCount(counts.industries, (value) => index.industryById.get(value)?.name ?? value),
    },
    {
      key: 'footprint',
      label: 'Indicative market footprint',
      hint: 'Approximate operating reach. Not a headcount, revenue or statutory band.',
      options: FOOTPRINT_BANDS.map((band) => ({
        value: band,
        label: FOOTPRINT_SHORT_LABELS[band],
        count: counts.footprint.get(band) ?? 0,
      })),
    },
    {
      key: 'capabilities',
      label: 'Evidenced operating capability',
      hint: 'A company must evidence every capability you select.',
      options: byCount(counts.capabilities, (value) => index.capabilityById.get(value)?.name ?? value)
        .filter((option) => !search || option.label.toLowerCase().includes(search)),
    },
    {
      key: 'provinces',
      label: 'Province',
      options: byCount(counts.provinces, (value) => value),
    },
    {
      key: 'scale',
      label: 'Sourced scale',
      hint: 'Headcount only. Revenue, sites and sector capacity are never folded in.',
      options: SCALE_BUCKETS.map((bucket) => ({
        value: bucket,
        label: SCALE_LABELS[bucket] ?? bucket,
        count: scaleCounts.get(bucket) ?? 0,
      })),
    },
    {
      key: 'status',
      label: 'Verification status',
      options: [...statusCounts.entries()]
        .map(([value, count]) => ({ value, label: STATUS_LABELS[value] ?? value, count }))
        .sort((left, right) => right.count - left.count),
    },
    {
      key: 'confidence',
      label: 'Evidence confidence',
      options: ['confirmed', 'probable', 'hypothesis', 'unknown']
        .map((value) => ({
          value,
          label: value.charAt(0).toUpperCase() + value.slice(1),
          count: confidenceCounts.get(value) ?? 0,
        })),
    },
  ]

  if (groupCounts.size > 0) {
    dimensions.push({
      key: 'groups',
      label: 'Corporate group',
      hint: 'Companies with a sourced parent relationship.',
      options: byCount(groupCounts, (value) => index.byId.get(value)?.name ?? value),
    })
  }

  return dimensions
}
