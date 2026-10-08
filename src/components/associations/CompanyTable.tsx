import { useMemo, useState } from 'react'
import { ASSOCIATION_LABELS, compareRows, type DiscoveryRow } from '../../data/intelligence/discovery'
import type { IntelligenceGraph } from '../../data/intelligence/graph'
import { TIER_RANK } from '../../data/intelligence/targeting'
import { CONFIDENCE_RANK } from '../../data/intelligence/graph'
import { Pagination } from '../ui/Pagination'
import { ConfidenceTag, TierBadge } from '../intelligence/IntelBits'

export const TABLE_PAGE_SIZE = 50

type SortKey = 'default' | 'name' | 'tier' | 'people' | 'confidence' | 'associations'

interface CompanyTableProps {
  graph: IntelligenceGraph
  rows: DiscoveryRow[]
  page: number
  selected: string | null
  compare: Set<string>
  onPage: (page: number) => void
  onSelect: (id: string, additive: boolean) => void
  onSetSelection: (ids: string[]) => void
}

const SORTERS: Record<Exclude<SortKey, 'default'>, (a: DiscoveryRow, b: DiscoveryRow) => number> = {
  name: (a, b) => a.name.localeCompare(b.name),
  tier: (a, b) => TIER_RANK[a.assessment.tier] - TIER_RANK[b.assessment.tier] || a.name.localeCompare(b.name),
  people: (a, b) => b.currentPeople - a.currentPeople || a.name.localeCompare(b.name),
  confidence: (a, b) => CONFIDENCE_RANK[b.assessment.confidence] - CONFIDENCE_RANK[a.assessment.confidence] || a.name.localeCompare(b.name),
  associations: (a, b) => b.dimensions.length - a.dimensions.length || a.name.localeCompare(b.name),
}

export function CompanyTable({ graph, rows, page, selected, compare, onPage, onSelect, onSetSelection }: CompanyTableProps) {
  const [sort, setSort] = useState<SortKey>('default')
  const targets = useMemo(() => {
    const list = rows.filter((row) => row.role !== 'focal')
    return list.sort(sort === 'default' ? compareRows : SORTERS[sort])
  }, [rows, sort])
  const totalPages = Math.max(1, Math.ceil(targets.length / TABLE_PAGE_SIZE))
  const current = Math.min(page, totalPages)
  const slice = targets.slice((current - 1) * TABLE_PAGE_SIZE, current * TABLE_PAGE_SIZE)
  const allSelected = targets.length > 0 && targets.every((row) => compare.has(row.organizationId))

  const header = (key: SortKey, label: string) => (
    <th scope="col" aria-sort={sort === key ? 'ascending' : 'none'}>
      <button type="button" className="ca-sort" onClick={() => setSort(sort === key ? 'default' : key)}>
        {label}
      </button>
    </th>
  )

  return (
    <div className="ca-table">
      <div className="ca-table-meta">
        <span>
          <b>{targets.length.toLocaleString()}</b> companies in view (all shown across pages, nothing truncated)
        </span>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => onSetSelection(allSelected ? [] : targets.map((row) => row.organizationId))}>
          {allSelected ? 'Clear selection' : `Select all ${targets.length}`}
        </button>
      </div>
      <div className="data-table-wrap">
        <table className="data-table">
          <caption className="sr-only">Associated companies with role tier, associations, mandatory capability status and mapped people</caption>
          <thead>
            <tr>
              <th scope="col">
                <span className="sr-only">Select</span>
              </th>
              {header('name', 'Company')}
              {header('tier', 'Tier')}
              <th scope="col">Industry</th>
              {header('associations', 'Associations')}
              <th scope="col">Mandatory</th>
              {header('confidence', 'Confidence')}
              {header('people', 'People')}
            </tr>
          </thead>
          <tbody>
            {slice.map((row) => {
              const industries = graph.industriesByOrg.get(row.organizationId) ?? []
              return (
                <tr key={row.organizationId} className={selected === row.organizationId ? 'is-selected' : undefined}>
                  <td>
                    <input type="checkbox" checked={compare.has(row.organizationId)} onChange={() => onSelect(row.organizationId, true)} aria-label={`Select ${row.name}`} />
                  </td>
                  <td>
                    <button type="button" className="ca-link-button cell-strong" onClick={() => onSelect(row.organizationId, false)}>
                      {row.name}
                    </button>
                  </td>
                  <td>
                    <TierBadge tier={row.assessment.tier} overridden={Boolean(row.assessment.override)} />
                  </td>
                  <td>{industries.length ? industries.map((ind) => graph.taxonomy.industryById.get(ind.industryId)?.name ?? ind.industryId).join(', ') : <span className="intel-muted">Unknown</span>}</td>
                  <td>{row.dimensions.length ? row.dimensions.map((dim) => ASSOCIATION_LABELS[dim.type]).join(', ') : <span className="intel-muted">Role match only</span>}</td>
                  <td>
                    {row.assessment.mandatory.length === 0 ? (
                      <span className="intel-muted">n/a</span>
                    ) : (
                      row.assessment.mandatory.map((check) => (
                        <span key={check.capabilityId} className={`ca-check ca-check-${check.status}`}>
                          {graph.taxonomy.capabilityById.get(check.capabilityId)?.name}: {check.status}
                        </span>
                      ))
                    )}
                  </td>
                  <td>
                    <ConfidenceTag value={row.assessment.confidence} />
                  </td>
                  <td className="ca-num">{row.currentPeople}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <Pagination page={current} totalPages={totalPages} total={targets.length} onChange={onPage} />
    </div>
  )
}
