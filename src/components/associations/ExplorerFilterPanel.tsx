import { useId, useMemo } from 'react'
import { ASSOCIATION_LABELS, type DiscoveryRow, type ExplorerFilters } from '../../data/intelligence/discovery'
import { CONFIDENCE_RANK, type IntelligenceGraph } from '../../data/intelligence/graph'
import { TIER_LABELS, TIER_ORDER } from '../../data/intelligence/targeting'

type ListKey = Exclude<keyof ExplorerFilters, 'q'>

interface Option {
  value: string
  label: string
  count: number
}

interface Group {
  key: ListKey
  label: string
  options: Option[]
}

const PEOPLE_LABELS: Record<string, string> = { 'with-people': 'Has mapped people', 'without-people': 'No mapped people yet' }
const EVIDENCE_LABELS: Record<string, string> = {
  stale: 'Has stale evidence',
  'unverified-identity': 'Identity not verified',
  'open-questions': 'Open research questions',
  'private-facts': 'Includes private workspace facts',
}
const COVERAGE_LABELS: Record<string, string> = {
  'researched-with-people': 'Finance team researched: people found',
  'researched-zero-results': 'Finance team researched: none found',
  'needs-research': 'Finance team: needs research',
  'no-coverage-record': 'No research coverage record',
}

function tally(rows: DiscoveryRow[], keys: (row: DiscoveryRow) => string[]): Map<string, number> {
  const counts = new Map<string, number>()
  for (const row of rows) {
    if (row.role === 'focal') continue
    for (const key of new Set(keys(row))) counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return counts
}

interface ExplorerFilterPanelProps {
  graph: IntelligenceGraph
  rows: DiscoveryRow[]
  filters: ExplorerFilters
  onToggle: (key: ListKey, value: string) => void
  onClear: () => void
}

/** Filter groups: OR within a group, AND across groups. Counts are over the current universe before filtering. */
export function ExplorerFilterPanel({ graph, rows, filters, onToggle, onClear }: ExplorerFilterPanelProps) {
  const baseId = useId()
  const groups = useMemo<Group[]>(() => {
    const toOptions = (counts: Map<string, number>, label: (value: string) => string, order?: string[]): Option[] => {
      const options = [...counts.entries()].map(([value, count]) => ({ value, label: label(value), count }))
      if (order) return options.sort((a, b) => order.indexOf(a.value) - order.indexOf(b.value))
      return options.sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    }
    const industries = tally(rows, (row) => (graph.industriesByOrg.get(row.organizationId) ?? []).map((ind) => ind.industryId))
    const capabilities = tally(rows, (row) =>
      [...(graph.capabilitiesByOrg.get(row.organizationId)?.values() ?? [])]
        .filter((cap) => cap.status === 'observed' && CONFIDENCE_RANK[cap.confidence] >= 2)
        .map((cap) => cap.capabilityId),
    )
    const coverage = tally(rows, (row) => {
      const records = graph.coverageByOrg.get(row.organizationId) ?? []
      return records.length ? records.map((rec) => rec.status) : ['no-coverage-record']
    })
    return [
      { key: 'tiers', label: 'Role tier', options: toOptions(tally(rows, (row) => [row.assessment.tier]), (v) => TIER_LABELS[v as keyof typeof TIER_LABELS], TIER_ORDER) },
      { key: 'industries', label: 'Industry', options: toOptions(industries, (v) => graph.taxonomy.industryById.get(v)?.name ?? v) },
      { key: 'capabilities', label: 'Observed capability', options: toOptions(capabilities, (v) => graph.taxonomy.capabilityById.get(v)?.name ?? v) },
      { key: 'associations', label: 'Association type', options: toOptions(tally(rows, (row) => row.dimensions.map((dim) => dim.type)), (v) => ASSOCIATION_LABELS[v as keyof typeof ASSOCIATION_LABELS]) },
      { key: 'confidence', label: 'Assessment confidence', options: toOptions(tally(rows, (row) => [row.assessment.confidence]), (v) => v, ['confirmed', 'probable', 'hypothesis', 'unknown']) },
      { key: 'provinces', label: 'Province', options: toOptions(tally(rows, (row) => row.provinces), (v) => v) },
      { key: 'people', label: 'People coverage', options: toOptions(tally(rows, (row) => [row.currentPeople > 0 ? 'with-people' : 'without-people']), (v) => PEOPLE_LABELS[v]) },
      {
        key: 'evidence',
        label: 'Evidence status',
        options: toOptions(
          tally(rows, (row) => {
            const out: string[] = []
            if (row.assessment.evidenceQuality.stale > 0) out.push('stale')
            if (graph.organizationById.get(row.organizationId)?.identityStatus !== 'verified') out.push('unverified-identity')
            if ((graph.questionsByOrg.get(row.organizationId) ?? []).length) out.push('open-questions')
            if (graph.privateFactOrgs.has(row.organizationId)) out.push('private-facts')
            return out
          }),
          (v) => EVIDENCE_LABELS[v],
        ),
      },
      { key: 'coverage', label: 'Research coverage', options: toOptions(coverage, (v) => COVERAGE_LABELS[v] ?? v) },
    ]
  }, [graph, rows])

  const activeCount = groups.reduce((sum, group) => sum + filters[group.key].length, 0)

  return (
    <div className="ca-filters">
      <div className="ca-filters-head">
        <h2 className="ca-panel-title">Filters</h2>
        {activeCount > 0 && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClear}>
            Clear {activeCount}
          </button>
        )}
      </div>
      <p className="intel-muted ca-filters-hint">Any option within a group, all groups together.</p>
      {groups.map((group) => {
        const selected = new Set(filters[group.key] as string[])
        if (group.options.length === 0) return null
        return (
          <details key={group.key} className="ca-filter-group" open={selected.size > 0 || group.key === 'tiers' || group.key === 'industries'}>
            <summary>
              {group.label}
              {selected.size > 0 && <span className="ca-filter-count">{selected.size}</span>}
            </summary>
            <fieldset className="ca-filter-options">
              <legend className="sr-only">{group.label}</legend>
              {group.options.map((option) => {
                const inputId = `${baseId}-${group.key}-${option.value}`
                return (
                  <div key={option.value} className="ca-filter-option">
                    <input id={inputId} type="checkbox" checked={selected.has(option.value)} onChange={() => onToggle(group.key, option.value)} />
                    <label htmlFor={inputId}>
                      {option.label}
                      <span className="ca-filter-n">{option.count}</span>
                    </label>
                  </div>
                )
              })}
            </fieldset>
          </details>
        )
      })}
    </div>
  )
}

export type { ListKey }
