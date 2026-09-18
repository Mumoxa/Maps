import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Building2, ExternalLink, MapPin, Search, SlidersHorizontal, X } from 'lucide-react'
import { Breadcrumb } from '../components/ui/Breadcrumb'
import { EmptyState } from '../components/ui/EmptyState'
import { FacetPanel } from '../components/ui/FacetPanel'
import {
  accountantCandidates,
  accountantFacetDefs,
  accountantTextMatcher,
  accountantUniverse,
  compareAccountants,
  type AccountantCandidate,
} from '../data/accountantsPeople'
import {
  activeFilterCount,
  buildFacetOptions,
  filterByFacets,
  readSelections,
  toggleValue,
  writeSelections,
  type FacetSelections,
} from '../data/facets'
import { canonicalCompanyName } from '../data/companyNormalization'

const PAGE_SIZE = 20

const FACET_LABELS: Record<string, string> = Object.fromEntries(
  accountantFacetDefs.map((def) => [def.key, def.label]),
)

function statusBadge(status: string): { cls: string; label: string; title: string } {
  switch (status) {
    case 'CONFIRMED':
      return { cls: 'acc-badge-confirmed', label: 'Confirmed', title: 'Designation confirmed by evidence' }
    case 'HIGH_CONFIDENCE':
      return { cls: 'acc-badge-high', label: 'High confidence', title: 'Strong evidence, designation not fully confirmed' }
    case 'ARTICLES_CONFIRMED_DESIGNATION_UNVERIFIED':
      return { cls: 'acc-badge-articles', label: 'Articles confirmed', title: 'Training/articles confirmed; designation unverified' }
    case 'CONFLICTING':
      return { cls: 'acc-badge-conflicting', label: 'Conflicting', title: 'Conflicting evidence on designation — under review' }
    default:
      return { cls: '', label: status || 'Recorded', title: 'Record status' }
  }
}

function CandidateCard({ candidate, onToggle }: { candidate: AccountantCandidate; onToggle: (key: string, value: string) => void }) {
  const badge = statusBadge(candidate.status)
  const systems = [...candidate.accountingSystems, ...candidate.erpSystems, ...candidate.analyticsTools]
  const canonicalEmployer = candidate.employer ? canonicalCompanyName(candidate.employer) : ''
  const evidenceUrl = candidate.sourceUrls[0] || candidate.primarySource
  return (
    <article className="hack-candidate-card">
      <header className="hack-candidate-head">
        <div>
          <h3 className="hack-candidate-name">{candidate.fullName}</h3>
          <p className="hack-candidate-sub">
            {candidate.designations.map((designation) => (
              <button
                key={designation}
                type="button"
                className="hack-badge acc-badge-designation"
                title="Filter by this designation"
                onClick={() => onToggle('qualification', designation)}
              >
                {designation}
              </button>
            ))}
            {candidate.professionalRoutes.map((route) => (
              <button
                key={route}
                type="button"
                className="hack-badge acc-badge-route"
                title="Filter by this professional route"
                onClick={() => onToggle('route', route)}
              >
                {route}
              </button>
            ))}
          </p>
        </div>
        <span className={`hack-badge ${badge.cls}`} title={badge.title}>{badge.label}</span>
      </header>

      {candidate.title && <p className="acc-candidate-title">{candidate.title}</p>}

      <div className="hack-candidate-meta">
        {candidate.employer && (
          <button
            type="button"
            className="hack-meta-link"
            title={canonicalEmployer === candidate.employer ? 'Filter by this employer' : `Filter by ${canonicalEmployer} (listed as ${candidate.employer})`}
            onClick={() => onToggle('employer', canonicalEmployer)}
          >
            <Building2 size={14} aria-hidden /> {canonicalEmployer}
          </button>
        )}
        {candidate.roleFamily && (
          <button type="button" className="hack-meta-link" title="Filter by this role family" onClick={() => onToggle('roleFamily', candidate.roleFamily)}>
            {candidate.roleFamily}
          </button>
        )}
        {candidate.industry && (
          <button type="button" className="hack-meta-link" title="Filter by this industry" onClick={() => onToggle('industry', candidate.industry)}>
            {candidate.industry}
          </button>
        )}
        {candidate.province && (
          <button type="button" className="hack-meta-link" title="Filter by this province" onClick={() => onToggle('province', candidate.province)}>
            <MapPin size={14} aria-hidden /> {candidate.province}
          </button>
        )}
      </div>

      {candidate.employer && (
        <div className="hack-crosslinks">
          <Link to={`/talent-search?q=${encodeURIComponent(canonicalEmployer)}`} title="Search this employer across every pool">
            {canonicalEmployer} across all pools
          </Link>
          <Link to={`/contacts?company=${encodeURIComponent(canonicalEmployer)}`} title="Open the contacts directory at this company">
            Contacts at {canonicalEmployer}
          </Link>
        </div>
      )}

      {systems.length > 0 && (
        <p className="acc-systems">
          {systems.map((system) => (
            <button key={system} type="button" className="hack-badge acc-badge-system" title="Filter by this system" onClick={() => onToggle('system', system)}>
              {system}
            </button>
          ))}
        </p>
      )}

      {candidate.qualificationEvidence && <p className="acc-evidence-text">{candidate.qualificationEvidence}</p>}

      <footer className="hack-candidate-foot">
        {evidenceUrl ? (
          <a className="hack-evidence-link" href={evidenceUrl} target="_blank" rel="noreferrer">
            Evidence <ExternalLink size={12} aria-hidden />
          </a>
        ) : (
          <span className="hack-source-note">Evidence recorded in the research database</span>
        )}
        {candidate.sourceUrls.length > 1 && (
          <span className="hack-source-note">+ {candidate.sourceUrls.length - 1} more source{candidate.sourceUrls.length - 1 === 1 ? '' : 's'}</span>
        )}
      </footer>
    </article>
  )
}

export function AccountantsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [page, setPage] = useState(0)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const drawerCloseRef = useRef<HTMLButtonElement>(null)

  const query = searchParams.get('q') ?? ''
  const selections = useMemo(() => readSelections(searchParams, accountantFacetDefs), [searchParams])

  const commit = useCallback((next: FacetSelections, nextQuery: string) => {
    setSearchParams((prev) => {
      const written = writeSelections(prev, next)
      if (nextQuery.trim()) written.set('q', nextQuery)
      else written.delete('q')
      return written
    }, { replace: true })
    setPage(0)
  }, [setSearchParams])

  const onToggle = useCallback((key: string, value: string) => {
    commit(toggleValue(selections, key, value), query)
  }, [commit, selections, query])

  const setQuery = (value: string) => commit(selections, value)
  const clearAll = () => {
    const cleared: FacetSelections = {}
    for (const def of accountantFacetDefs) cleared[def.key] = []
    commit(cleared, '')
  }

  const filterInput = useMemo(
    () => ({ records: accountantCandidates, defs: accountantFacetDefs, selections, query, textMatcher: accountantTextMatcher }),
    [selections, query],
  )
  const results = useMemo(() => filterByFacets(filterInput).sort(compareAccountants), [filterInput])
  const optionsFor = useCallback((def: typeof accountantFacetDefs[number]) => buildFacetOptions(filterInput, def), [filterInput])

  const universe = useMemo(() => accountantUniverse(), [])
  const activeCount = activeFilterCount(selections)
  const hasFilters = activeCount > 0 || Boolean(query)

  const activeChips = accountantFacetDefs.flatMap((def) =>
    (selections[def.key] ?? []).map((value) => ({ key: def.key, value, group: FACET_LABELS[def.key] })),
  )

  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount - 1)
  const pageItems = results.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE)

  // Drawer: lock scroll, focus close, close on Escape, basic focus retention.
  useEffect(() => {
    if (!drawerOpen) return
    drawerCloseRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDrawerOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  return (
    <main className="page">
      <Breadcrumb crumbs={[{ label: 'Home', to: '/' }, { label: 'Accounting & Finance' }]} />
      <header className="hack-hero">
        <p className="hack-kicker">SA Talent Pool · Candidates</p>
        <h1>Accounting &amp; Finance professionals</h1>
        <p className="hack-lede">
          Evidence-backed candidates from the SA Qualified Accountant &amp; Finance Skills Intelligence Map. Filter by
          professional designation and by completed training route (SAICA / SAIPA articles, CIMA / ACCA practical
          experience) — these are tracked separately, because holding CA(SA) is not the same as having completed SAICA articles.
        </p>
        <div className="hack-kpis">
          <div className="hack-kpi"><strong>{universe.candidates}</strong><span>Candidates</span></div>
          <div className="hack-kpi"><strong>{universe.confirmed}</strong><span>Confirmed qualified</span></div>
          <div className="hack-kpi"><strong>{universe.caSa}</strong><span>CA(SA)</span></div>
          <div className="hack-kpi"><strong>{universe.employers}</strong><span>Employers mapped</span></div>
          <div className="hack-kpi"><strong>{universe.provinces}</strong><span>Provinces</span></div>
        </div>
      </header>

      <div className="facet-searchbar">
        <div className="hack-control hack-control-search facet-searchbar-input">
          <Search size={15} aria-hidden />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, employer, title, evidence…"
            aria-label="Search candidates"
          />
        </div>
        <button type="button" className="facet-filter-trigger" onClick={() => setDrawerOpen(true)} aria-expanded={drawerOpen} aria-haspopup="dialog">
          <SlidersHorizontal size={15} aria-hidden /> Filters{activeCount ? ` (${activeCount})` : ''}
        </button>
      </div>

      {(activeChips.length > 0 || query) && (
        <div className="facet-active" aria-label="Active filters">
          {query && (
            <button type="button" className="facet-chip" onClick={() => setQuery('')} aria-label={`Remove search: ${query}`}>
              <span>“{query}”</span> <X size={13} aria-hidden />
            </button>
          )}
          {activeChips.map((chip) => (
            <button
              key={`${chip.key}:${chip.value}`}
              type="button"
              className="facet-chip"
              onClick={() => onToggle(chip.key, chip.value)}
              aria-label={`Remove ${chip.group} filter: ${chip.value}`}
            >
              <span className="facet-chip-group">{chip.group}:</span> <span>{chip.value}</span> <X size={13} aria-hidden />
            </button>
          ))}
          <button type="button" className="facet-clear" onClick={clearAll}>Clear all</button>
        </div>
      )}

      <div className="facet-layout">
        <aside className="facet-sidebar" aria-label="Filters">
          <FacetPanel defs={accountantFacetDefs} selections={selections} optionsFor={optionsFor} onToggle={onToggle} idPrefix="acc-side" />
        </aside>

        <div className="facet-results">
          <p className="hack-results-count">
            {results.length} candidate{results.length === 1 ? '' : 's'} match{hasFilters ? ' the current filters' : 'ing the pool'}
          </p>

          {pageItems.length === 0 ? (
            <div className="facet-zero">
              <EmptyState
                title="No candidates match these filters"
                description={
                  activeChips.length
                    ? `Active filters — ${activeChips.map((chip) => `${chip.group}: ${chip.value}`).join('; ')}${query ? `; search “${query}”` : ''}. Remove a filter to widen the results.`
                    : 'Try a different search term.'
                }
              />
              {hasFilters && (
                <button type="button" className="facet-drawer-apply" onClick={clearAll}>Clear all filters</button>
              )}
            </div>
          ) : (
            <div className="hack-candidate-grid">
              {pageItems.map((candidate) => (
                <CandidateCard key={candidate.id} candidate={candidate} onToggle={onToggle} />
              ))}
            </div>
          )}

          {pageCount > 1 && (
            <nav className="hack-pagination" aria-label="Pagination">
              <button disabled={safePage === 0} onClick={() => setPage(safePage - 1)}>Previous</button>
              <span>Page {safePage + 1} of {pageCount}</span>
              <button disabled={safePage >= pageCount - 1} onClick={() => setPage(safePage + 1)}>Next</button>
            </nav>
          )}
        </div>
      </div>

      {drawerOpen && (
        <div className="facet-drawer-root">
          <div className="facet-drawer-backdrop" onClick={() => setDrawerOpen(false)} aria-hidden />
          <div className="facet-drawer" role="dialog" aria-modal="true" aria-label="Filters">
            <div className="facet-drawer-head">
              <strong>Filters{activeCount ? ` (${activeCount})` : ''}</strong>
              <button ref={drawerCloseRef} type="button" className="facet-drawer-close" onClick={() => setDrawerOpen(false)} aria-label="Close filters">
                <X size={18} aria-hidden />
              </button>
            </div>
            <div className="facet-drawer-body">
              <FacetPanel defs={accountantFacetDefs} selections={selections} optionsFor={optionsFor} onToggle={onToggle} idPrefix="acc-drawer" />
            </div>
            <div className="facet-drawer-foot">
              {hasFilters && <button type="button" className="facet-clear" onClick={clearAll}>Clear all</button>}
              <button type="button" className="facet-drawer-apply" onClick={() => setDrawerOpen(false)}>
                Show {results.length} result{results.length === 1 ? '' : 's'}
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="hack-page-foot">
        <p>
          Source: SA Qualified Accountant &amp; Finance Skills Intelligence Map (markets/accountants/). Public professional
          information only. Records are attached to identities on evidence, never on name similarity alone; a professional
          designation does not by itself prove a specific articles/training route.
        </p>
      </footer>
    </main>
  )
}
