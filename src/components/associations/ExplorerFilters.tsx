import { useMemo, useState } from 'react'
import { MagnifyingGlass } from '@phosphor-icons/react'
import type { OrganizationIndex } from '../../data/organizations/load'
import { SCALE_BUCKETS, observedCapabilityCounts } from '../../data/organizations/discovery'
import type { AssociationFilters, AssociationMatch } from '../../data/organizations/types'

interface FilterDimension {
  key: keyof AssociationFilters
  label: string
  options: { value: string; label: string; count: number }[]
  hint?: string
}

interface ExplorerFiltersProps {
  matches: AssociationMatch[]
  filters: AssociationFilters
  index: OrganizationIndex
  idPrefix: string
  onChange: (next: AssociationFilters) => void
}

const SCALE_LABELS: Record<string, string> = {
  'under-100': 'Under 100 employees',
  '100-to-1000': '100 to 1,000 employees',
  'over-1000': 'Over 1,000 employees',
  unverified: 'Scale reported but unverified',
  unknown: 'No sourced scale',
}

export const TIER_LABELS: Record<string, string> = {
  '1': 'Tier 1 · Primary sourcing pocket',
  '2': 'Tier 2 · Strong adjacent environment',
  '3': 'Tier 3 · Comparable operating processes',
  '4': 'Tier 4 · Contextual or partial overlap',
  '5': 'Tier 5 · Weak for this brief',
}

export const RELATIONSHIP_LABELS: Record<string, string> = {
  'same-industry': 'Same industry',
  'same-value-chain': 'Same value chain',
  'shared-operating-process': 'Shared operating process',
  'shared-financial-complexity': 'Shared financial complexity',
  'shared-technology': 'Shared technology',
  'talent-transferability': 'Talent transferability',
  'geographic-proximity': 'Geographic proximity',
  'corporate-affiliation': 'Corporate affiliation',
  'previous-recruitment-success': 'Previous recruitment success',
}

function countBy(matches: AssociationMatch[], pick: (match: AssociationMatch) => string[]): Map<string, number> {
  const counts = new Map<string, number>()
  for (const match of matches) {
    for (const value of new Set(pick(match))) {
      counts.set(value, (counts.get(value) ?? 0) + 1)
    }
  }
  return counts
}

function scaleOf(organization: { scale: { metric: string; value: string }[] }): string[] {
  if (organization.scale.length === 0) return ['unknown']
  const buckets: string[] = []
  for (const entry of organization.scale) {
    if (entry.metric !== 'employees') continue
    const digits = entry.value.replace(/[^0-9]/g, '')
    if (!digits) { buckets.push('unverified'); continue }
    const value = Number(digits)
    if (value < 100) buckets.push('under-100')
    else if (value < 1000) buckets.push('100-to-1000')
    else buckets.push('over-1000')
  }
  return buckets.length > 0 ? buckets : ['unverified']
}

/**
 * The explorer's filter panel. One filter implementation serves the network,
 * pocket and table views: every count here is derived from the same match list
 * those views render, so the three can never disagree.
 */
export function ExplorerFilters({ matches, filters, index, idPrefix, onChange }: ExplorerFiltersProps) {
  const [capabilitySearch, setCapabilitySearch] = useState('')

  const dimensions = useMemo<FilterDimension[]>(() => {
    const pocketCounts = countBy(matches, (match) => [match.pocketId])
    const tierCounts = countBy(matches, (match) => [String(match.tier)])
    const relationshipCounts = countBy(matches, (match) => match.relationshipTypes)
    // Per-capability counts use the same rule the filter applies: the company must
    // have evidenced the capability, not merely be in an industry that implies it.
    const capabilityCounts = new Map<string, number>()
    for (const match of matches) {
      const organization = index.byId.get(match.organizationId)
      if (!organization) continue
      for (const link of organization.capabilities) {
        if (link.status !== 'observed') continue
        capabilityCounts.set(link.capabilityId, (capabilityCounts.get(link.capabilityId) ?? 0) + 1)
      }
    }
    const industryCounts = new Map<string, number>()
    const provinceCounts = new Map<string, number>()
    for (const match of matches) {
      const organization = index.byId.get(match.organizationId)
      if (!organization) continue
      for (const link of organization.industries) {
        industryCounts.set(link.industryId, (industryCounts.get(link.industryId) ?? 0) + 1)
      }
      for (const location of organization.locations) {
        if (location.province) provinceCounts.set(location.province, (provinceCounts.get(location.province) ?? 0) + 1)
      }
    }

    return [
      {
        key: 'pockets',
        label: 'Industry pocket',
        options: [...pocketCounts.entries()]
          .map(([value, count]) => ({ value, label: index.pocketById.get(value)?.name ?? 'Not yet classified', count }))
          .sort((left, right) => right.count - left.count || left.label.localeCompare(right.label)),
      },
      {
        key: 'industries',
        label: 'Industry',
        options: [...industryCounts.entries()]
          .map(([value, count]) => ({ value, label: index.industryById.get(value)?.name ?? value, count }))
          .sort((left, right) => right.count - left.count || left.label.localeCompare(right.label)),
      },
      {
        key: 'capabilities',
        label: 'Operational capability',
        hint: 'A company must evidence every capability you select.',
        options: observedCapabilityCounts(index)
          .map(({ capability }) => ({
            value: capability.id,
            label: capability.name,
            count: capabilityCounts.get(capability.id) ?? 0,
          }))
          .sort((left, right) => right.count - left.count || left.label.localeCompare(right.label))
          .filter((option) => !capabilitySearch.trim()
            || option.label.toLowerCase().includes(capabilitySearch.trim().toLowerCase())),
      },
      {
        key: 'tiers',
        label: 'Role-specific relevance',
        options: ['1', '2', '3', '4', '5'].map((value) => ({
          value,
          label: TIER_LABELS[value],
          count: tierCounts.get(value) ?? 0,
        })),
      },
      {
        key: 'relationshipTypes',
        label: 'Relationship type',
        options: [...relationshipCounts.entries()]
          .map(([value, count]) => ({ value, label: RELATIONSHIP_LABELS[value] ?? value, count }))
          .sort((left, right) => right.count - left.count),
      },
      {
        key: 'provinces',
        label: 'Geography',
        options: [...provinceCounts.entries()]
          .map(([value, count]) => ({ value, label: value, count }))
          .sort((left, right) => right.count - left.count || left.value.localeCompare(right.value)),
      },
      {
        key: 'scale',
        label: 'Company scale',
        hint: 'Headcount and revenue are never mixed; unknown stays unknown.',
        options: SCALE_BUCKETS.map((value) => ({
          value,
          label: SCALE_LABELS[value] ?? value,
          count: matches.filter((match) => {
            const organization = index.byId.get(match.organizationId)
            return organization ? scaleOf(organization).includes(value) : value === 'unknown'
          }).length,
        })),
      },
      {
        key: 'confidence',
        label: 'Evidence confidence',
        options: ['confirmed', 'probable', 'hypothesis', 'unknown'].map((value) => ({
          value,
          label: value.charAt(0).toUpperCase() + value.slice(1),
          count: matches.filter((match) => match.confidence === value).length,
        })),
      },
      {
        key: 'status',
        label: 'Verification status',
        options: [
          { value: 'verified', label: 'Verified', count: matches.filter((match) => index.byId.get(match.organizationId)?.status === 'verified').length },
          { value: 'needs-verification', label: 'Pending verification', count: matches.filter((match) => index.byId.get(match.organizationId)?.status !== 'verified').length },
        ],
      },
    ]
  }, [matches, index, capabilitySearch])

  const toggle = (key: keyof AssociationFilters, value: string) => {
    const current = filters[key] as string[]
    const next = current.includes(value) ? current.filter((entry) => entry !== value) : [...current, value]
    onChange({ ...filters, [key]: next })
  }

  const activeCount = dimensions.reduce((total, dimension) => total + (filters[dimension.key] as string[]).length, 0)

  return (
    <div className="facet-panel">
      <div className="assoc-filter-search">
        <MagnifyingGlass size={14} aria-hidden />
        <input
          type="search"
          value={filters.query}
          onChange={(event) => onChange({ ...filters, query: event.target.value })}
          placeholder="Search companies, processes, evidence…"
          aria-label={`${idPrefix} search companies, processes and evidence`}
        />
      </div>

      {dimensions.map((dimension) => {
        const selected = filters[dimension.key] as string[]
        if (dimension.options.length === 0) return null
        const groupId = `${idPrefix}-${String(dimension.key)}`
        return (
          <section className="facet-group" key={String(dimension.key)} aria-labelledby={`${groupId}-label`}>
            <h3 className="facet-group-label" id={`${groupId}-label`}>{dimension.label}</h3>
            {dimension.hint && <p className="assoc-filter-hint">{dimension.hint}</p>}
            {dimension.key === 'capabilities' && dimension.options.length > 8 && (
              <div className="facet-search">
                <MagnifyingGlass size={13} aria-hidden />
                <input
                  type="text"
                  value={capabilitySearch}
                  onChange={(event) => setCapabilitySearch(event.target.value)}
                  placeholder="Find a capability"
                  aria-label={`${idPrefix} find a capability`}
                />
              </div>
            )}
            <ul className="facet-options">
              {dimension.options.map((option) => {
                const checked = selected.includes(option.value)
                return (
                  <li key={option.value}>
                    <label className="facet-option" htmlFor={`${groupId}-${option.value}`}>
                      <input
                        id={`${groupId}-${option.value}`}
                        type="checkbox"
                        className="filter-checkbox"
                        checked={checked}
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

      <section className="facet-group" aria-labelledby={`${idPrefix}-people-label`}>
        <h3 className="facet-group-label" id={`${idPrefix}-people-label`}>Mapped professionals</h3>
        <ul className="facet-options">
          {([['any', 'Any'], ['yes', 'Has mapped professionals'], ['no', 'No mapped professionals yet']] as const).map(([value, label]) => (
            <li key={value}>
              <label className="facet-option" htmlFor={`${idPrefix}-people-${value}`}>
                <input
                  id={`${idPrefix}-people-${value}`}
                  type="radio"
                  name={`${idPrefix}-people`}
                  className="filter-checkbox"
                  checked={filters.hasMappedProfessionals === value}
                  onChange={() => onChange({ ...filters, hasMappedProfessionals: value })}
                />
                <span className="facet-option-label">{label}</span>
              </label>
            </li>
          ))}
        </ul>
      </section>

      {activeCount > 0 && (
        <button
          type="button"
          className="facet-clear"
          onClick={() => onChange({
            ...filters,
            pockets: [],
            industries: [],
            capabilities: [],
            provinces: [],
            scale: [],
            confidence: [],
            tiers: [],
            relationshipTypes: [],
            status: [],
          })}
        >
          Clear {activeCount} filter{activeCount === 1 ? '' : 's'}
        </button>
      )}
    </div>
  )
}
