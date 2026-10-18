import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  ArrowSquareOut,
  MapPin,
  MagnifyingGlass,
  SlidersHorizontal,
  CheckCircle,
  X,
} from '@phosphor-icons/react'
import { Breadcrumb } from '../components/ui/Breadcrumb'
import { EmptyState } from '../components/ui/EmptyState'
import { FacetPanel } from '../components/ui/FacetPanel'
import { useDialogLayer } from '../hooks/useDialogLayer'
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
import casaInventoryUrl from '../../markets/accountants/ca_sa_inventory.csv?url'

const PAGE_SIZE = 20

const FACET_LABELS: Record<string, string> = Object.fromEntries(
  accountantFacetDefs.map((def) => [def.key, def.label]),
)

function statusBadge(status: string): { cls: string; label: string; title: string } {
  switch (status) {
    case 'CONFIRMED':
      return { cls: 'acc-badge-confirmed', label: 'Confirmed', title: 'Designation confirmed by evidence' }
    case 'FINANCE_ROLE_CONFIRMED':
      return { cls: 'acc-badge-high', label: 'Finance role confirmed', title: 'Current in-scope finance role confirmed; professional designation may be absent or unverified' }
    case 'HIGH_CONFIDENCE':
      return { cls: 'acc-badge-high', label: 'High confidence', title: 'Strong evidence, one or more material fields remain incomplete' }
    case 'ARTICLES_CONFIRMED_DESIGNATION_UNVERIFIED':
      return { cls: 'acc-badge-articles', label: 'Articles confirmed', title: 'Training/articles confirmed; designation unverified' }
    case 'CONFLICTING':
      return { cls: 'acc-badge-conflicting', label: 'Conflicting', title: 'Conflicting evidence on designation, under review' }
    default:
      return { cls: '', label: status || 'Recorded', title: 'Record status' }
  }
}

type CandidateAttributes = {
  search_name?: string
  research_tier?: string
  fit_assessment?: string
  verification_required?: string
}

/** Fit strength parsed from the "HIGH: …" / "MEDIUM: …" prefix the research set carries. */
function fitStrength(attrs: CandidateAttributes): { level: 'high' | 'medium' | 'standard'; label: string; note: string } {
  const raw = (attrs.fit_assessment || '').trim()
  const note = raw.replace(/^(VERY HIGH|HIGH|MEDIUM-HIGH|MEDIUM|LOW)\s*[:-]?\s*/i, '').trim()
  const head = raw.toUpperCase()
  if (head.startsWith('VERY HIGH') || head.startsWith('HIGH') || head.startsWith('MEDIUM-HIGH')) {
    return { level: 'high', label: 'Strong match', note }
  }
  if (head.startsWith('MEDIUM')) return { level: 'medium', label: 'Possible match', note }
  return { level: 'standard', label: raw ? 'Screen' : '', note }
}

/** Human-readable articles/training status; empty string means "do not surface". */
function formatArticlesStatus(raw: string): string {
  const map: Record<string, string> = {
    CONFIRMED_EXPLICIT: 'Articles confirmed',
    PROFESSIONAL_PER_CONFIRMED: 'Practical experience confirmed',
    TRAINING_CONTRACT_CONFIRMED: 'Training contract confirmed',
    TRAINING_ROLE_CONFIRMED_COMPLETION_NOT_ESTABLISHED: 'Training role confirmed; completion not established',
    TRAINING_ROLE_EXPLICIT_COMPLETION_NOT_ESTABLISHED: 'Training role stated; completion not established',
    QUALIFIED_BUT_ARTICLES_NOT_ESTABLISHED: 'Qualified; articles route not recorded',
    NOT_APPLICABLE: '',
    NOT_ESTABLISHED: '',
    'NOT ESTABLISHED IN THIS PASS': '',
    PENDING_ENRICHMENT: '',
    UNKNOWN: '',
  }
  return raw in map ? map[raw] : raw
}

/**
 * Experience value as the research set stored it. A bare calendar year (e.g.
 * "2015+") is a start/qualification year, not a duration, so it renders as
 * "Since 2015" rather than being mis-stated as a count of years. A real
 * duration ("18+") renders as "18+ yrs". Everything else is "Not stated":
 * experience is never inferred.
 */
function formatExperience(raw: string | null | undefined): string {
  const value = (raw || '').trim()
  if (!value || value === 'unknown') return 'Not stated'
  const yearMatch = value.match(/^(19|20)\d{2}\+?$/)
  if (yearMatch) return `Since ${value.replace('+', '')}`
  if (/\d\s*\+?\s*(years|yrs)?$/i.test(value)) {
    const num = value.replace(/\s*(years|yrs)\s*$/i, '').trim()
    return `${num} yrs`
  }
  return value
}

/** Research tier letter (A / B) parsed from "A - CA evidenced" style strings. */
function tierLetter(attrs: CandidateAttributes): string {
  const raw = (attrs.research_tier || '').trim()
  const match = raw.match(/^([ABC])\b/i)
  return match ? match[1].toUpperCase() : ''
}

function CandidateCard({ candidate, onToggle, index }: { candidate: AccountantCandidate; onToggle: (key: string, value: string) => void; index: number }) {
  const badge = statusBadge(candidate.status)
  const systems = [...candidate.accountingSystems, ...candidate.erpSystems, ...candidate.analyticsTools]
  const canonicalEmployer = candidate.employer ? canonicalCompanyName(candidate.employer) : ''
  const evidenceUrl = candidate.sourceUrls[0] || candidate.primarySource
  const isCaSa = candidate.designations.includes('CA(SA)')
  const attrs = ((candidate as unknown as { attributes?: CandidateAttributes }).attributes) || {}
  const fit = fitStrength(attrs)
  const tier = tierLetter(attrs)
  const needsVerification = (attrs.verification_required || '').toLowerCase() === 'yes'
  const experienceLabel = formatExperience(candidate.yearsExperience)
  const locationLabel = [candidate.city, candidate.province].filter(Boolean).join(', ')
  const initials = candidate.fullName.split(/\s+/).map((part) => part[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
  const revealDelay = `${Math.min(index, 7) * 45}ms`

  return (
    <article className="scan-card reveal" style={{ '--reveal-delay': revealDelay } as React.CSSProperties}>
      <header className="scan-card-head">
        <div className="scan-avatar" aria-hidden>{initials}</div>
        <div className="scan-identity">
          <h3 className="scan-name">{candidate.fullName}</h3>
          {candidate.title && <p className="scan-title">{candidate.title}</p>}
        </div>
        {fit.level !== 'standard' && fit.label && (
          <span className={`scan-fit scan-fit-${fit.level}`} title={fit.note || fit.label}>
            {fit.label}
          </span>
        )}
      </header>

      <div className="scan-spine">
        <div className="scan-stat scan-stat-lead">
          <span className="scan-stat-label">Qualification</span>
          <span className="scan-stat-value">
            {isCaSa ? 'CA(SA)' : candidate.designations[0] || 'Not confirmed'}
            {isCaSa && candidate.designationStatus === 'CONFIRMED' && <CheckCircle size={13} weight="fill" className="scan-stat-tick" aria-label="confirmed" />}
          </span>
        </div>
        <button
          type="button"
          className="scan-stat scan-stat-action"
          title={`Filter by ${canonicalEmployer}`}
          onClick={() => candidate.employer && onToggle('employer', canonicalEmployer)}
          disabled={!candidate.employer}
        >
          <span className="scan-stat-label">Employer</span>
          <span className="scan-stat-value scan-stat-text">{canonicalEmployer || 'Not stated'}</span>
        </button>
        <button
          type="button"
          className="scan-stat scan-stat-action"
          title={candidate.industry ? `Filter by ${candidate.industry}` : undefined}
          onClick={() => candidate.industry && onToggle('industry', candidate.industry)}
          disabled={!candidate.industry}
        >
          <span className="scan-stat-label">Industry</span>
          <span className="scan-stat-value scan-stat-text">{candidate.industry || 'Not classified'}</span>
        </button>
        <div className={`scan-stat${experienceLabel === 'Not stated' ? ' scan-stat-muted' : ''}`}>
          <span className="scan-stat-label">Experience</span>
          <span className="scan-stat-value">{experienceLabel}</span>
        </div>
      </div>

      <div className="scan-tags">
        {candidate.designations.map((designation) => (
          <button key={designation} type="button" className="scan-tag scan-tag-accent" title="Filter by this designation" onClick={() => onToggle('qualification', designation)}>
            {designation}
          </button>
        ))}
        {candidate.roleFamily && (
          <button type="button" className="scan-tag" title="Filter by this role family" onClick={() => onToggle('roleFamily', candidate.roleFamily)}>
            {candidate.roleFamily}
          </button>
        )}
        {locationLabel && (
          <button type="button" className="scan-tag" title="Filter by this province" onClick={() => candidate.province && onToggle('province', candidate.province)}>
            <MapPin size={12} aria-hidden /> {locationLabel}
          </button>
        )}
        {tier && (
          <span className={`scan-tag scan-tag-tier scan-tag-tier-${tier.toLowerCase()}`} title={attrs.research_tier}>
            Tier {tier}
          </span>
        )}
        {needsVerification && (
          <span className="scan-tag scan-tag-verify" title="CA(SA) designation needs confirmation before outreach">
            Verify CA(SA)
          </span>
        )}
        <span className={`scan-tag ${badge.cls}`} title={badge.title}>{badge.label}</span>
      </div>

      {isCaSa && candidate.country && candidate.country !== 'South Africa' && (
        <p className="acc-evidence-text">Recorded location: {candidate.country} (outside South Africa)</p>
      )}
      {isCaSa && (!candidate.country || (candidate.country === 'South Africa' && !['CONFIRMED', 'HIGH'].includes(candidate.locationConfidence))) && (
        <p className="acc-evidence-text">South African residence or workplace not independently evidenced.</p>
      )}

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

      {candidate.academicQualifications.length > 0 && (
        <p className="acc-evidence-text"><strong>Academic:</strong> {candidate.academicQualifications.join('; ')}</p>
      )}
      {(() => {
        const statusLabel = formatArticlesStatus(candidate.articlesStatus)
        const parts = [statusLabel, candidate.articlesBody, candidate.articlesEmployer, candidate.articlesPeriod, candidate.articlesLocation].filter(Boolean)
        return parts.length > 0 ? (
          <p className="acc-evidence-text">
            <strong>Articles / training:</strong> {parts.join(' · ')}
          </p>
        ) : null
      })()}
      {candidate.qualificationEvidence && <p className="acc-evidence-text">{candidate.qualificationEvidence}</p>}

      <footer className="hack-candidate-foot">
        {candidate.linkedinUrl && (
          <a className="hack-evidence-link" href={candidate.linkedinUrl} target="_blank" rel="noreferrer">
            LinkedIn <ArrowSquareOut size={12} aria-hidden />
          </a>
        )}
        {evidenceUrl && evidenceUrl !== candidate.linkedinUrl ? (
          <a className="hack-evidence-link" href={evidenceUrl} target="_blank" rel="noreferrer">
            Evidence <ArrowSquareOut size={12} aria-hidden />
          </a>
        ) : null}
        {!evidenceUrl && !candidate.linkedinUrl && (
          <span className="hack-source-note">Evidence recorded in the research database</span>
        )}
        {candidate.sourceUrls.length > 1 && (
          <span className="hack-source-note">+ {candidate.sourceUrls.length - 1} more source{candidate.sourceUrls.length - 1 === 1 ? '' : 's'}</span>
        )}
        {candidate.dateLastVerified && <span className="hack-source-note">Source checked {candidate.dateLastVerified}</span>}
      </footer>
    </article>
  )
}

export function AccountantsPage() {
  useEffect(() => { document.title = 'SA Talent Map | Accounting & Finance' }, [])

  const [searchParams, setSearchParams] = useSearchParams()
  const [page, setPage] = useState(0)
  const [drawerOpen, setDrawerOpen] = useState(false)

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

  // Focus enters the panel, Tab stays inside it, Escape closes, focus returns to the trigger.
  const closeDrawer = useCallback(() => setDrawerOpen(false), [])
  const drawerRef = useDialogLayer<HTMLDivElement>(drawerOpen, closeDrawer)

  return (
    <main className="page">
      <div className="container">
      <Breadcrumb crumbs={[{ label: 'Home', to: '/' }, { label: 'Accounting & Finance' }]} />
      <header className="scan-hero">
        <div className="scan-hero-glow" aria-hidden />
        <div className="scan-hero-body">
          <p className="scan-kicker">SA Talent Pool · Candidate screening</p>
          <h1 className="scan-hero-title">Accounting &amp; Finance professionals</h1>
          <p className="scan-hero-lede">
            Evidence-backed South African finance professionals from bookkeeper-equivalent level through CFO / Finance Director.
            Scan years of experience, professional designation, employer and industry at a glance, then filter by role, location,
            designation and recruitment search. Academic qualifications and articles are recorded separately, never inferred from title.
          </p>
          <div className="scan-kpis">
            <div className="scan-kpi reveal"><strong>{universe.candidates}</strong><span>Candidates</span></div>
            <div className="scan-kpi reveal" style={{ '--reveal-delay': '60ms' } as React.CSSProperties}><strong>{universe.confirmed}</strong><span>Confirmed finance roles</span></div>
            <div className="scan-kpi reveal" style={{ '--reveal-delay': '120ms' } as React.CSSProperties}><strong>{universe.professionallyQualified}</strong><span>Professionally qualified</span></div>
            <div className="scan-kpi reveal" style={{ '--reveal-delay': '180ms' } as React.CSSProperties}><strong>{universe.caSa}</strong><span>CA(SA) recorded</span></div>
            <div className="scan-kpi reveal" style={{ '--reveal-delay': '240ms' } as React.CSSProperties}><strong>{universe.employers}</strong><span>Employers mapped</span></div>
            <div className="scan-kpi reveal" style={{ '--reveal-delay': '300ms' } as React.CSSProperties}><strong>{universe.provinces}</strong><span>Provinces</span></div>
          </div>
          <p className="scan-hero-note">
            The CA(SA) figure is a recorded subset, not a complete national membership register.
            Some locations are unverified or outside South Africa.
            {' '}<Link to="/accounting-finance?qualification=CA%28SA%29">Browse CA(SA) records</Link>
            {' · '}<a href={casaInventoryUrl} download="ca_sa_inventory.csv">Download inventory CSV</a>
          </p>
        </div>
      </header>

      <div className="scan-toolbar">
        <div className="scan-search">
          <MagnifyingGlass size={16} aria-hidden />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, employer, title, evidence…"
            aria-label="Search candidates"
          />
          {query && (
            <button type="button" className="scan-search-clear" onClick={() => setQuery('')} aria-label="Clear search">
              <X size={14} aria-hidden />
            </button>
          )}
        </div>
        <span className="scan-toolbar-count" aria-live="polite">
          <strong>{results.length}</strong> {results.length === 1 ? 'match' : 'matches'}
        </span>
        <button type="button" className="facet-filter-trigger scan-filter-trigger" onClick={() => setDrawerOpen(true)} aria-expanded={drawerOpen} aria-haspopup="dialog">
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
          <div className="facet-sidebar-head">
            <h2 className="facet-heading">Filters{activeCount ? ` (${activeCount})` : ''}</h2>
          </div>
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
                    ? `Active filters: ${activeChips.map((chip) => `${chip.group}: ${chip.value}`).join('; ')}${query ? `; search “${query}”` : ''}. Remove a filter to widen the results.`
                    : 'Try a different search term.'
                }
              />
              {hasFilters && (
                <button type="button" className="facet-drawer-apply" onClick={clearAll}>Clear all filters</button>
              )}
            </div>
          ) : (
            <div className="scan-grid">
              {pageItems.map((candidate, index) => (
                <CandidateCard key={candidate.id} candidate={candidate} onToggle={onToggle} index={index} />
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
          <div className="facet-drawer-backdrop" onClick={closeDrawer} aria-hidden="true" />
          <div className="facet-drawer" role="dialog" aria-modal="true" aria-label="Filters" tabIndex={-1} ref={drawerRef}>
            <div className="facet-drawer-head">
              <h2 className="facet-heading">Filters{activeCount ? ` (${activeCount})` : ''}</h2>
              <button type="button" className="facet-drawer-close" onClick={() => setDrawerOpen(false)} aria-label="Close filters">
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
          Source: SA Accounting &amp; Finance Skills Intelligence Map (markets/accountants/). Public professional information only.
          The published population covers source-verified finance professionals from bookkeeper-equivalent level upward. Records are
          attached to identities on evidence, never on name similarity alone; professional designation, body registration and
          articles / practical-training routes are tracked separately.
        </p>
      </footer>
          </div>
    </main>
  )
}
