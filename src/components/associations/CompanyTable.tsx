import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUp } from '@phosphor-icons/react'
import type { OrganizationIndex } from '../../data/organizations/load'
import type { AssociationMatch } from '../../data/organizations/types'
import { TIER_LABELS } from './ExplorerFilters'

type ColumnKey =
  | 'company'
  | 'parent'
  | 'industry'
  | 'secondary'
  | 'processes'
  | 'similarity'
  | 'relevance'
  | 'scale'
  | 'province'
  | 'professionals'
  | 'sources'
  | 'verified'
  | 'status'

interface Column {
  key: ColumnKey
  label: string
  numeric?: boolean
}

const COLUMNS: Column[] = [
  { key: 'company', label: 'Company' },
  { key: 'parent', label: 'Parent group' },
  { key: 'industry', label: 'Primary industry' },
  { key: 'secondary', label: 'Secondary industries' },
  { key: 'processes', label: 'Core operating processes' },
  { key: 'similarity', label: 'Similarity category' },
  { key: 'relevance', label: 'Search-specific relevance' },
  { key: 'scale', label: 'Reported headcount' },
  { key: 'province', label: 'Province' },
  { key: 'professionals', label: 'Mapped employees' },
  { key: 'sources', label: 'Source quality' },
  { key: 'verified', label: 'Last verified' },
  { key: 'status', label: 'Research status' },
]

const PAGE_SIZE = 25

interface CompanyTableProps {
  index: OrganizationIndex
  matches: AssociationMatch[]
  selectedIds: Set<string>
  onOpenCompany: (organizationId: string) => void
  onToggleSelect: (match: AssociationMatch) => void
  onToggleSelectMany: (matches: AssociationMatch[], selected: boolean) => void
  onExport: () => void
}

function cellValue(index: OrganizationIndex, match: AssociationMatch, key: ColumnKey): { text: string; sort: string | number } {
  const organization = index.byId.get(match.organizationId)
  switch (key) {
    case 'company':
      return { text: organization?.name ?? match.organizationId, sort: organization?.name ?? match.organizationId }
    case 'parent': {
      const parent = organization?.parentId ? index.byId.get(organization.parentId) : null
      return { text: parent?.name ?? 'Not documented', sort: parent?.name ?? 'zzz' }
    }
    case 'industry': {
      const primary = organization?.industries.find((link) => link.primary) ?? organization?.industries[0]
      const name = primary ? index.industryById.get(primary.industryId)?.name ?? primary.industryId : 'Not classified'
      return { text: name, sort: name }
    }
    case 'secondary': {
      const secondary = (organization?.industries ?? []).filter((link) => !link.primary)
        .map((link) => index.industryById.get(link.industryId)?.name ?? link.industryId)
      return { text: secondary.length > 0 ? secondary.join(', ') : 'None recorded', sort: secondary.join(', ') }
    }
    case 'processes': {
      const processes = (organization?.capabilities ?? [])
        .filter((link) => link.status === 'observed' && index.capabilityById.get(link.capabilityId)?.group === 'operating')
        .map((link) => index.capabilityById.get(link.capabilityId)?.name ?? link.capabilityId)
      return { text: processes.length > 0 ? processes.join(', ') : 'None evidenced', sort: processes.join(', ') }
    }
    case 'similarity':
      return { text: index.pocketById.get(match.pocketId)?.name ?? 'Not yet classified', sort: index.pocketById.get(match.pocketId)?.name ?? 'zzz' }
    case 'relevance':
      return { text: match.rules.map((rule) => rule.label).join('; '), sort: `${match.tier}-${match.rules.length}` }
    case 'scale': {
      const entry = organization?.scale.find((scale) => scale.metric === 'employees')
      const digits = entry ? entry.value.replace(/[^0-9]/g, '') : ''
      return {
        text: entry ? `${entry.value} (${entry.basis}, ${entry.asOf})` : 'No sourced headcount',
        sort: digits ? Number(digits) : -1,
      }
    }
    case 'province': {
      const provinces = [...new Set((organization?.locations ?? []).map((location) => location.province))].filter(Boolean)
      return { text: provinces.length > 0 ? provinces.join(', ') : 'No sourced location', sort: provinces.join(', ') || 'zzz' }
    }
    case 'professionals':
      return { text: match.mappedProfessionals > 0 ? String(match.mappedProfessionals) : 'None mapped', sort: match.mappedProfessionals }
    case 'sources': {
      const count = organization?.sources.length ?? 0
      return { text: count > 0 ? `${count} source(s)` : 'No sources recorded', sort: count }
    }
    case 'verified':
      return { text: organization?.lastVerified || 'Not verified', sort: organization?.lastVerified || '' }
    case 'status':
      return {
        text: organization?.status === 'verified' ? 'Verified' : 'Pending verification',
        sort: organization?.status === 'verified' ? '0' : '1',
      }
    default:
      return { text: '', sort: '' }
  }
}

export function CompanyTable({
  index,
  matches,
  selectedIds,
  onOpenCompany,
  onToggleSelect,
  onToggleSelectMany,
  onExport,
}: CompanyTableProps) {
  const [sortKey, setSortKey] = useState<ColumnKey>('similarity')
  const [direction, setDirection] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(1)

  const rows = useMemo(() => {
    const sorted = [...matches].sort((left, right) => {
      const leftValue = cellValue(index, left, sortKey).sort
      const rightValue = cellValue(index, right, sortKey).sort
      const comparison = typeof leftValue === 'number' && typeof rightValue === 'number'
        ? leftValue - rightValue
        : String(leftValue).localeCompare(String(rightValue))
      return direction === 'asc' ? comparison : -comparison
    })
    return sorted
  }, [matches, index, sortKey, direction])

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const visible = rows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
  const allVisibleSelected = visible.length > 0 && visible.every((match) => selectedIds.has(match.organizationId))

  if (matches.length === 0) {
    return <p className="assoc-empty">No company matches the current filters.</p>
  }

  return (
    <div className="assoc-table">
      <div className="assoc-table-toolbar">
        <span className="assoc-table-count">{rows.length} companies · page {safePage} of {totalPages}</span>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => onToggleSelectMany(visible, !allVisibleSelected)}
        >
          {allVisibleSelected ? 'Deselect this page' : 'Select this page'}
        </button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={onExport}>Export filtered CSV</button>
      </div>

      <div className="data-table-wrap">
        <table className="data-table">
          <caption className="visually-hidden">
            Associated companies with the reasons each one appears for the selected role context
          </caption>
          <thead>
            <tr>
              <th scope="col">
                <span className="visually-hidden">Select</span>
                <input
                  type="checkbox"
                  className="filter-checkbox"
                  checked={allVisibleSelected}
                  onChange={(event) => onToggleSelectMany(visible, event.target.checked)}
                  aria-label="Select every company on this page"
                />
              </th>
              {COLUMNS.map((column) => (
                <th scope="col" key={column.key} aria-sort={sortKey === column.key ? (direction === 'asc' ? 'ascending' : 'descending') : 'none'}>
                  <button
                    type="button"
                    className="assoc-th-sort"
                    onClick={() => {
                      if (sortKey === column.key) setDirection((value) => (value === 'asc' ? 'desc' : 'asc'))
                      else {
                        setSortKey(column.key)
                        setDirection('asc')
                      }
                      setPage(1)
                    }}
                    aria-label={`Sort by ${column.label}`}
                  >
                    {column.label}
                    {sortKey === column.key && (direction === 'asc' ? <ArrowUp size={11} aria-hidden /> : <ArrowDown size={11} aria-hidden />)}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((match) => (
              <tr key={match.organizationId} className={`assoc-tier-row tier-${match.tier}`}>
                <td>
                  <input
                    type="checkbox"
                    className="filter-checkbox"
                    checked={selectedIds.has(match.organizationId)}
                    onChange={() => onToggleSelect(match)}
                    aria-label={`Select ${index.byId.get(match.organizationId)?.name ?? match.organizationId} for the target pool`}
                  />
                </td>
                {COLUMNS.map((column) => {
                  const value = cellValue(index, match, column.key)
                  return (
                    <td key={column.key} className={column.key === 'company' ? 'cell-strong' : undefined}>
                      {column.key === 'company' ? (
                        <button type="button" className="assoc-link-button" onClick={() => onOpenCompany(match.organizationId)}>
                          {value.text}
                        </button>
                      ) : (
                        value.text
                      )}
                      {column.key === 'similarity' && (
                        <span className={`assoc-tier assoc-tier-${match.tier}`}>{TIER_LABELS[String(match.tier)]}</span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <nav className="assoc-pocket-pager" aria-label="Company table pagination">
          <button type="button" className="btn btn-ghost btn-sm" disabled={safePage <= 1} onClick={() => setPage(safePage - 1)}>Previous</button>
          <span>Page {safePage} of {totalPages}</span>
          <button type="button" className="btn btn-ghost btn-sm" disabled={safePage >= totalPages} onClick={() => setPage(safePage + 1)}>Next</button>
        </nav>
      )}
    </div>
  )
}
