import { useMemo, useState } from 'react'
import { CaretDown, CaretUp, MagnifyingGlass } from '@phosphor-icons/react'
import type { OrganizationIndex } from '../../data/organizations/load'
import type { AssociationMatch, AssociationPocket } from '../../data/organizations/types'
import { TIER_LABELS, RELATIONSHIP_LABELS } from './ExplorerFilters'

type SortKey = 'relevance' | 'name' | 'professionals' | 'scale'

const PAGE_SIZE = 25

interface PocketViewProps {
  index: OrganizationIndex
  pockets: AssociationPocket[]
  selectedIds: Set<string>
  onOpenCompany: (organizationId: string) => void
  onToggleSelect: (match: AssociationMatch) => void
}

function employeeValue(index: OrganizationIndex, organizationId: string): number | null {
  const organization = index.byId.get(organizationId)
  if (!organization) return null
  const entry = organization.scale.find((scale) => scale.metric === 'employees')
  if (!entry) return null
  const digits = entry.value.replace(/[^0-9]/g, '')
  return digits ? Number(digits) : null
}

function sortMatches(index: OrganizationIndex, matches: AssociationMatch[], sort: SortKey): AssociationMatch[] {
  const sorted = [...matches]
  if (sort === 'name') {
    sorted.sort((left, right) => (index.byId.get(left.organizationId)?.name ?? left.organizationId)
      .localeCompare(index.byId.get(right.organizationId)?.name ?? right.organizationId))
  } else if (sort === 'professionals') {
    sorted.sort((left, right) => right.mappedProfessionals - left.mappedProfessionals || left.tier - right.tier)
  } else if (sort === 'scale') {
    sorted.sort((left, right) => {
      const leftValue = employeeValue(index, left.organizationId)
      const rightValue = employeeValue(index, right.organizationId)
      if (leftValue === null && rightValue === null) return left.tier - right.tier
      if (leftValue === null) return 1
      if (rightValue === null) return -1
      return rightValue - leftValue
    })
  } else {
    sorted.sort((left, right) => left.tier - right.tier || right.rules.length - left.rules.length)
  }
  return sorted
}

function PocketGroup({
  pocket,
  index,
  selectedIds,
  onOpenCompany,
  onToggleSelect,
  defaultOpen,
}: {
  pocket: AssociationPocket
  index: OrganizationIndex
  selectedIds: Set<string>
  onOpenCompany: (organizationId: string) => void
  onToggleSelect: (match: AssociationMatch) => void
  defaultOpen: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortKey>('relevance')
  const [page, setPage] = useState(1)

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const filtered = needle
      ? pocket.matches.filter((match) => {
        const organization = index.byId.get(match.organizationId)
        const haystack = [
          organization?.name ?? match.organizationId,
          ...match.rules.map((rule) => rule.detail),
          ...(organization?.locations.map((location) => `${location.city} ${location.province}`) ?? []),
        ].join(' ').toLowerCase()
        return haystack.includes(needle)
      })
      : pocket.matches
    return sortMatches(index, filtered, sort)
  }, [pocket.matches, index, query, sort])

  const totalPages = Math.max(1, Math.ceil(matches.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const visible = matches.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
  const groupId = `pocket-${pocket.pocket.id}`

  return (
    <section className="assoc-pocket" aria-labelledby={`${groupId}-title`}>
      <header className="assoc-pocket-head">
        <button type="button" className="assoc-pocket-toggle" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls={`${groupId}-body`}>
          {open ? <CaretUp size={13} aria-hidden /> : <CaretDown size={13} aria-hidden />}
          <h2 id={`${groupId}-title`} className="assoc-pocket-title">{pocket.pocket.name}</h2>
          <span className="assoc-pocket-counts">
            {pocket.matches.length} companies · {pocket.mappedProfessionals} mapped professionals · {pocket.verifiedRelationships} with recruiter notes
          </span>
        </button>
      </header>

      {open && (
        <div className="assoc-pocket-body" id={`${groupId}-body`}>
          <p className="assoc-pocket-desc">{pocket.pocket.description}</p>
          <div className="assoc-pocket-controls">
            <div className="assoc-pocket-search">
              <MagnifyingGlass size={14} aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(event) => { setQuery(event.target.value); setPage(1) }}
                placeholder={`Search ${pocket.pocket.name}`}
                aria-label={`Search companies inside ${pocket.pocket.name}`}
              />
            </div>
            <label className="assoc-pocket-sort">
              <span>Sort</span>
              <select value={sort} onChange={(event) => { setSort(event.target.value as SortKey); setPage(1) }} className="filter-select">
                <option value="relevance">Relevance tier</option>
                <option value="name">Company name</option>
                <option value="professionals">Mapped professionals</option>
                <option value="scale">Reported headcount</option>
              </select>
            </label>
            <span className="assoc-pocket-total">{matches.length} in view</span>
          </div>

          {visible.length === 0 ? (
            <p className="assoc-pocket-empty">No company in this pocket matches that search.</p>
          ) : (
            <ul className="assoc-company-list">
              {visible.map((match) => {
                const organization = index.byId.get(match.organizationId)
                const name = organization?.name ?? match.organizationId
                const provinces = [...new Set((organization?.locations ?? []).map((location) => location.province))].filter(Boolean)
                const headcount = employeeValue(index, match.organizationId)
                return (
                  <li key={match.organizationId} className="assoc-company-item">
                    <label className="assoc-company-check" htmlFor={`pocket-select-${match.organizationId}`}>
                      <input
                        id={`pocket-select-${match.organizationId}`}
                        type="checkbox"
                        className="filter-checkbox"
                        checked={selectedIds.has(match.organizationId)}
                        onChange={() => onToggleSelect(match)}
                      />
                      <span className="visually-hidden">Select {name} for the target pool</span>
                    </label>
                    <button type="button" className="assoc-company-open" onClick={() => onOpenCompany(match.organizationId)}>
                      <span className="cell-strong">{name}</span>
                      <span className="assoc-company-meta">
                        <span className={`assoc-tier assoc-tier-${match.tier}`}>{TIER_LABELS[String(match.tier)]}</span>
                        {provinces.length > 0 && <span>{provinces.join(', ')}</span>}
                        {headcount !== null && <span>{headcount.toLocaleString()} employees (sourced)</span>}
                        <span>{match.mappedProfessionals > 0 ? `${match.mappedProfessionals} mapped professionals` : 'No mapped professionals yet'}</span>
                      </span>
                    </button>
                    <p className="assoc-company-reason">
                      {match.rules.map((rule) => rule.label).join(' · ')}
                      {match.relationshipTypes.length > 0 && (
                        <span className="assoc-company-rel">
                          {' · '}{match.relationshipTypes.map((type) => RELATIONSHIP_LABELS[type] ?? type).join(', ')}
                        </span>
                      )}
                    </p>
                    {match.gaps.length > 0 && (
                      <p className="assoc-company-gaps">
                        Missing evidence: {match.gaps.map((gap) => gap.requirement).join(', ')}
                      </p>
                    )}
                  </li>
                )
              })}
            </ul>
          )}

          {totalPages > 1 && (
            <nav className="assoc-pocket-pager" aria-label={`${pocket.pocket.name} pagination`}>
              <button type="button" className="btn btn-ghost btn-sm" disabled={safePage <= 1} onClick={() => setPage(safePage - 1)}>Previous</button>
              <span>Page {safePage} of {totalPages}</span>
              <button type="button" className="btn btn-ghost btn-sm" disabled={safePage >= totalPages} onClick={() => setPage(safePage + 1)}>Next</button>
            </nav>
          )}
        </div>
      )}
    </section>
  )
}

export function PocketView({ index, pockets, selectedIds, onOpenCompany, onToggleSelect }: PocketViewProps) {
  if (pockets.length === 0) {
    return <p className="assoc-empty">No company matches the current filters in any industry pocket.</p>
  }
  return (
    <div className="assoc-pockets">
      {pockets.map((pocket, pocketIndex) => (
        <PocketGroup
          key={pocket.pocket.id}
          pocket={pocket}
          index={index}
          selectedIds={selectedIds}
          onOpenCompany={onOpenCompany}
          onToggleSelect={onToggleSelect}
          defaultOpen={pocketIndex < 2}
        />
      ))}
    </div>
  )
}
