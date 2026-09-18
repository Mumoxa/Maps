import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  Layers,
  MapPin,
  Search,
  SlidersHorizontal,
  UserRound,
  X,
} from 'lucide-react'
import { useData } from '../context/DataContext'
import { canonicalCompanyName } from '../data/companyNormalization'
import { Breadcrumb } from '../components/ui/Breadcrumb'
import { EmptyState } from '../components/ui/EmptyState'
import { FacetPanel } from '../components/ui/FacetPanel'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { ErrorBoundary } from '../components/ui/ErrorBoundary'
import { buildSlugSets, createTalentSearchIndex, getTalentProfiles, searchTalentProfiles, type TalentProfile } from '../data'
import {
  activeFilterCount,
  buildFacetOptions,
  filterByFacets,
  readSelections,
  toggleValue,
  writeSelections,
  type FacetDef,
} from '../data/facets'

const PAGE_SIZE = 15
const SORTS = [
  { key: 'relevance', label: 'Relevance' },
  { key: 'name', label: 'Name A-Z' },
  { key: 'company', label: 'Company' },
  { key: 'seniority', label: 'Seniority' },
] as const

const SENIORITY_ORDER_LIST = [
  'C-Suite',
  'Executive',
  'Principal / Architect',
  'Principal / Director',
  'Lead / Manager',
  'Senior',
  'Mid-Senior',
  'Consultant / Specialist',
  'Professional / Specialist',
  'Professional',
]
const SENIORITY_ORDER = new Map(SENIORITY_ORDER_LIST.map((value, index) => [value, index]))

export function TalentSearchPage() {
  const { data, loading, error } = useData()
  const [searchParams, setSearchParams] = useSearchParams()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const drawerCloseRef = useRef<HTMLButtonElement>(null)
  const talentSearchRef = useRef<ReturnType<typeof createTalentSearchIndex> | null>(null)

  useEffect(() => {
    document.title = 'SA Talent Map | Talent Search'
  }, [])

  const talentProfiles = useMemo(() => (data ? getTalentProfiles(data) : []), [data])

  useEffect(() => {
    if (!talentSearchRef.current && talentProfiles.length > 0) {
      talentSearchRef.current = createTalentSearchIndex(talentProfiles)
    }
  }, [talentProfiles])

  const trackLabels = useMemo(() => {
    const labels = new Map<string, string>()
    for (const profile of talentProfiles) {
      if (!labels.has(profile.trackSlug)) labels.set(profile.trackSlug, profile.track)
    }
    return labels
  }, [talentProfiles])

  const facetDefs = useMemo<FacetDef<TalentProfile>[]>(() => [
    { key: 'track', label: 'Track', accessor: (p) => [p.trackSlug], labelFor: (value) => trackLabels.get(value) ?? value },
    { key: 'seniority', label: 'Seniority', accessor: (p) => (p.seniority ? [p.seniority] : []), order: SENIORITY_ORDER_LIST },
    { key: 'company', label: 'Company', accessor: (p) => (p.company ? [canonicalCompanyName(p.company)] : []), searchThreshold: 8 },
    { key: 'location', label: 'Location', accessor: (p) => (p.locationLabel ? [p.locationLabel] : []), searchThreshold: 8 },
    { key: 'skill', label: 'Skills', accessor: (p) => p.skills, searchThreshold: 10 },
    { key: 'sector', label: 'Sector', accessor: (p) => p.sectors, searchThreshold: 10 },
  ], [trackLabels])

  const q = searchParams.get('q') || ''
  const sort = searchParams.get('sort') || 'relevance'
  const page = Math.max(1, Number(searchParams.get('page') || '1'))
  const selections = useMemo(() => readSelections(searchParams, facetDefs), [searchParams, facetDefs])

  const slugSets = useMemo(() => (data ? buildSlugSets(data) : null), [data])

  const queryMatchedProfiles = useMemo(() => {
    if (!talentSearchRef.current) return talentProfiles
    return searchTalentProfiles(talentSearchRef.current, talentProfiles, q, {})
  }, [q, talentProfiles])

  const facetInput = useMemo(
    () => ({ records: queryMatchedProfiles, defs: facetDefs, selections }),
    [queryMatchedProfiles, facetDefs, selections],
  )
  const filteredResults = useMemo(
    () => sortTalentProfiles(filterByFacets(facetInput), sort),
    [facetInput, sort],
  )
  const optionsFor = useCallback((def: FacetDef<TalentProfile>) => buildFacetOptions(facetInput, def), [facetInput])

  const setParam = useCallback((key: string, value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (value.trim()) next.set(key, value)
      else next.delete(key)
      if (key !== 'page') next.delete('page')
      return next
    })
  }, [setSearchParams])

  const onToggle = useCallback((key: string, value: string) => {
    setSearchParams((prev) => writeSelections(prev, toggleValue(selections, key, value)))
  }, [setSearchParams, selections])

  const clearAll = () => setSearchParams((prev) => {
    const next = new URLSearchParams()
    const query = prev.get('q')
    if (query) next.set('q', query)
    return next
  })

  const activeCount = activeFilterCount(selections)
  const activeChips = facetDefs.flatMap((def) =>
    (selections[def.key] ?? []).map((value) => ({
      key: def.key,
      value,
      group: def.label,
      label: def.labelFor ? def.labelFor(value) : value,
    })),
  )

  const totalPages = Math.max(1, Math.ceil(filteredResults.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginatedResults = filteredResults.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  useEffect(() => {
    if (!drawerOpen) return
    drawerCloseRef.current?.focus()
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setDrawerOpen(false) }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  if (loading) return <LoadingSpinner size="lg" />
  if (error) return <div className="page container"><p>Error: {error}</p></div>
  if (!data) return null

  return (
    <ErrorBoundary>
      <div className="page talent-search-page">
        <div className="container">
          <Breadcrumb crumbs={[{ label: 'Home', to: '/' }, { label: 'Talent Search' }]} />

          <section className="talent-search-header">
            <div>
              <h1>Talent Search</h1>
              <p>Search people by role, skill, company, location, sector, and platform track — combine filters to narrow the market.</p>
            </div>
            <Link to="/credit-risk" className="btn btn-ghost">
              <Layers size={18} />
              Credit Risk track
            </Link>
          </section>

          <section className="talent-search-command">
            <div className="talent-search-input-wrap">
              <Search size={18} className="talent-search-input-icon" />
              <input
                className="talent-search-input"
                type="text"
                value={q}
                onChange={(event) => setParam('q', event.target.value)}
                placeholder="Search names, skills, titles, companies, locations..."
                aria-label="Search talent"
              />
            </div>
            <div className="talent-search-quick-links" aria-label="Suggested searches">
              {['Salesforce', 'Murex', 'Calypso', 'Credit Risk', 'CA(SA)', 'Johannesburg'].map((value) => (
                <button key={value} type="button" onClick={() => setParam('q', value)}>{value}</button>
              ))}
            </div>
          </section>

          <div className="facet-layout">
            <aside className="facet-sidebar" aria-label="Filters">
              <div className="facet-sidebar-head">
                <strong>Filters</strong>
                {activeCount > 0 && <button type="button" className="facet-clear" onClick={clearAll}>Clear all</button>}
              </div>
              <FacetPanel defs={facetDefs} selections={selections} optionsFor={optionsFor} onToggle={onToggle} idPrefix="ts-side" />
            </aside>

            <main className="facet-results">
              <div className="talent-results-toolbar">
                <button type="button" className="facet-filter-trigger" onClick={() => setDrawerOpen(true)} aria-expanded={drawerOpen} aria-haspopup="dialog">
                  <SlidersHorizontal size={15} aria-hidden /> Filters{activeCount ? ` (${activeCount})` : ''}
                </button>
                <div className="talent-results-count">
                  <strong>{filteredResults.length.toLocaleString()}</strong> professional{filteredResults.length === 1 ? '' : 's'}
                  {q && <span> for <strong>{q}</strong></span>}
                </div>
                <div className="talent-sort-controls" aria-label="Sort results">
                  <span>Sort</span>
                  {SORTS.map((option) => (
                    <button key={option.key} type="button" className={sort === option.key ? 'active' : ''} onClick={() => setParam('sort', option.key)}>
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {(activeChips.length > 0 || q) && (
                <div className="facet-active" aria-label="Active filters">
                  {q && (
                    <button type="button" className="facet-chip" onClick={() => setParam('q', '')} aria-label={`Remove search: ${q}`}>
                      <span>“{q}”</span> <X size={13} aria-hidden />
                    </button>
                  )}
                  {activeChips.map((chip) => (
                    <button key={`${chip.key}:${chip.value}`} type="button" className="facet-chip" onClick={() => onToggle(chip.key, chip.value)} aria-label={`Remove ${chip.group} filter: ${chip.label}`}>
                      <span className="facet-chip-group">{chip.group}:</span> <span>{chip.label}</span> <X size={13} aria-hidden />
                    </button>
                  ))}
                  <button type="button" className="facet-clear" onClick={clearAll}>Clear all</button>
                </div>
              )}

              {paginatedResults.length === 0 ? (
                <div className="facet-zero">
                  <EmptyState
                    title="No matching professionals found"
                    description={activeChips.length || q ? 'Try a broader search term or remove one of the filters.' : 'Start typing to search the talent pool.'}
                  />
                  {(activeCount > 0 || q) && <button type="button" className="facet-drawer-apply" onClick={clearAll}>Clear all filters</button>}
                </div>
              ) : (
                <div className="talent-results-list">
                  {paginatedResults.map((profile) => {
                    const sourceProfileId = profile.provenance.sourceProfileId
                    const creditRiskSlug = sourceProfileId ? slugSets?.profileIdToSlug.get(sourceProfileId) : undefined
                    return <TalentSearchCard key={profile.id} profile={profile} creditRiskSlug={creditRiskSlug} onToggle={onToggle} />
                  })}
                </div>
              )}

              {totalPages > 1 && (
                <nav className="talent-pagination" aria-label="Talent search pagination">
                  <button type="button" onClick={() => setParam('page', String(currentPage - 1))} disabled={currentPage <= 1}>
                    <ChevronLeft size={16} /> Prev
                  </button>
                  <span>Page {currentPage} of {totalPages}</span>
                  <button type="button" onClick={() => setParam('page', String(currentPage + 1))} disabled={currentPage >= totalPages}>
                    Next <ChevronRight size={16} />
                  </button>
                </nav>
              )}
            </main>
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
                <FacetPanel defs={facetDefs} selections={selections} optionsFor={optionsFor} onToggle={onToggle} idPrefix="ts-drawer" />
              </div>
              <div className="facet-drawer-foot">
                {activeCount > 0 && <button type="button" className="facet-clear" onClick={clearAll}>Clear all</button>}
                <button type="button" className="facet-drawer-apply" onClick={() => setDrawerOpen(false)}>
                  Show {filteredResults.length.toLocaleString()} result{filteredResults.length === 1 ? '' : 's'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  )
}

function TalentSearchCard({ profile, creditRiskSlug, onToggle }: { profile: TalentProfile; creditRiskSlug?: string; onToggle: (key: string, value: string) => void }) {
  const profileLink = profile.trackSlug === 'credit-risk' && creditRiskSlug
    ? `/profiles/${creditRiskSlug}`
    : profile.trackSlug === 'hackathons'
      ? `/hackathons?q=${encodeURIComponent(profile.name)}`
      : profile.trackSlug === 'accounting-finance'
        ? `/accounting-finance?q=${encodeURIComponent(profile.name)}`
        : undefined
  const skills = profile.skills.slice(0, 5)
  const source = profile.sources[0]

  return (
    <article className="talent-result-row">
      <div className="talent-avatar" aria-hidden="true">{initials(profile.name)}</div>

      <div className="talent-result-main">
        <div className="talent-result-heading">
          <div>
            <div className="talent-result-name-row">
              <h2>{profile.name}</h2>
              <span className="verified-dot" title="Profile supplied with source evidence"><Check size={12} /></span>
              <button type="button" className="track-status-badge track-status-live talent-track-chip" title="Filter by this track" onClick={() => onToggle('track', profile.trackSlug)}>
                {profile.track}
              </button>
            </div>
            <p className="talent-result-role">{profile.title}</p>
          </div>
          <div className="talent-result-actions">
            {profileLink && <Link to={profileLink} className="btn btn-primary btn-sm"><UserRound size={15} /> Profile</Link>}
            {profile.linkedinUrl && (
              <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">LinkedIn</a>
            )}
          </div>
        </div>

        <div className="talent-result-meta">
          {profile.company ? (
            <button
              type="button"
              className="talent-meta-link"
              title={canonicalCompanyName(profile.company) === profile.company ? 'Filter by this company' : `Filter by ${canonicalCompanyName(profile.company)} (listed as ${profile.company})`}
              onClick={() => onToggle('company', canonicalCompanyName(profile.company))}
            >
              <Building2 size={15} /> {canonicalCompanyName(profile.company)}
            </button>
          ) : (
            <span><Building2 size={15} /> Company not added</span>
          )}
          {profile.locationLabel ? (
            <button type="button" className="talent-meta-link" title="Filter by this location" onClick={() => onToggle('location', profile.locationLabel)}>
              <MapPin size={15} /> {profile.locationLabel}
            </button>
          ) : (
            <span><MapPin size={15} /> Location not added</span>
          )}
          {profile.seniority ? (
            <button type="button" className="talent-meta-link" title="Filter by this seniority" onClick={() => onToggle('seniority', profile.seniority)}>
              <BriefcaseBusiness size={15} /> {profile.seniority}
            </button>
          ) : (
            <span><BriefcaseBusiness size={15} /> Seniority not added</span>
          )}
        </div>

        <p className="talent-result-summary">{profile.summary}</p>
        {source && (
          <p className="text-sm text-secondary">
            Evidence: <a href={source.url} target="_blank" rel="noreferrer">{source.type}</a>
            {source.checkedOn ? ` · checked ${source.checkedOn}` : ' · legacy source date not recorded'}
          </p>
        )}

        <div className="talent-result-skill-group">
          {skills.map((skill) => (
            <button key={skill} type="button" className="talent-result-chip" title="Filter by this skill" onClick={() => onToggle('skill', skill)}>
              {skill}
            </button>
          ))}
        </div>
      </div>
    </article>
  )
}

function sortTalentProfiles(profiles: TalentProfile[], sort: string) {
  const sorted = [...profiles]
  if (sort === 'name') return sorted.sort((a, b) => a.name.localeCompare(b.name))
  if (sort === 'company') return sorted.sort((a, b) => a.company.localeCompare(b.company) || a.name.localeCompare(b.name))
  if (sort === 'seniority') {
    return sorted.sort((a, b) => {
      const rankA = SENIORITY_ORDER.get(a.seniority) ?? 99
      const rankB = SENIORITY_ORDER.get(b.seniority) ?? 99
      return rankA - rankB || a.name.localeCompare(b.name)
    })
  }
  return sorted
}

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}
