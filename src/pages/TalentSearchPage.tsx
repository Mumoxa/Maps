import { useEffect, useMemo, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  Filter,
  Layers,
  MapPin,
  Search,
  UserRound,
  X,
} from 'lucide-react'
import { useData } from '../context/DataContext'
import { Breadcrumb } from '../components/ui/Breadcrumb'
import { EmptyState } from '../components/ui/EmptyState'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { ErrorBoundary } from '../components/ui/ErrorBoundary'
import { buildSlugSets, createTalentSearchIndex, getTalentProfiles, searchTalentProfiles, type TalentProfile } from '../data'

type Facet = { value: string; label: string; count: number }
type FacetKey = 'track' | 'company' | 'location' | 'seniority' | 'skill' | 'sector'

const PAGE_SIZE = 15
const SORTS = [
  { key: 'relevance', label: 'Relevance' },
  { key: 'name', label: 'Name A-Z' },
  { key: 'company', label: 'Company' },
  { key: 'seniority', label: 'Seniority' },
] as const

const SENIORITY_ORDER = new Map([
  ['Executive', 0],
  ['C-Suite', 1],
  ['Principal / Architect', 2],
  ['Lead / Manager', 3],
  ['Senior', 4],
  ['Mid-Senior', 5],
  ['Consultant / Specialist', 6],
  ['Professional', 7],
])

export function TalentSearchPage() {
  const { data, loading, error } = useData()
  const [searchParams, setSearchParams] = useSearchParams()
  const talentSearchRef = useRef<ReturnType<typeof createTalentSearchIndex> | null>(null)

  useEffect(() => {
    document.title = 'SA Talent Map | Talent Search'
  }, [])

  const talentProfiles = useMemo(() => {
    if (!data) return []
    return getTalentProfiles(data)
  }, [data])

  useEffect(() => {
    if (!talentSearchRef.current && talentProfiles.length > 0) {
      talentSearchRef.current = createTalentSearchIndex(talentProfiles)
    }
  }, [talentProfiles])

  const params = useMemo(() => ({
    q: searchParams.get('q') || '',
    track: searchParams.get('track') || '',
    company: searchParams.get('company') || '',
    location: searchParams.get('location') || '',
    seniority: searchParams.get('seniority') || '',
    skill: searchParams.get('skill') || '',
    sector: searchParams.get('sector') || '',
    sort: searchParams.get('sort') || 'relevance',
    page: Math.max(1, Number(searchParams.get('page') || '1')),
  }), [searchParams])

  const slugSets = useMemo(() => {
    if (!data) return null
    return buildSlugSets(data)
  }, [data])

  const queryMatchedProfiles = useMemo(() => {
    if (!talentSearchRef.current) return talentProfiles
    return searchTalentProfiles(talentSearchRef.current, talentProfiles, params.q, {})
  }, [params.q, talentProfiles])

  const filteredResults = useMemo(() => {
    const filtered = queryMatchedProfiles.filter((profile) => {
      if (params.track && profile.trackSlug !== params.track) return false
      if (params.company && profile.company !== params.company) return false
      if (params.location && profile.location !== params.location) return false
      if (params.seniority && profile.seniority !== params.seniority) return false
      if (params.skill && !profile.skills.includes(params.skill)) return false
      if (params.sector && !profile.sectors.includes(params.sector)) return false
      return true
    })

    return sortTalentProfiles(filtered, params.sort)
  }, [params.company, params.location, params.sector, params.seniority, params.skill, params.sort, params.track, queryMatchedProfiles])

  const facets = useMemo(() => createFacets(queryMatchedProfiles), [queryMatchedProfiles])
  const totalPages = Math.max(1, Math.ceil(filteredResults.length / PAGE_SIZE))
  const currentPage = Math.min(params.page, totalPages)
  const paginatedResults = filteredResults.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const activeFilters = getActiveFilters(params)

  if (loading) return <LoadingSpinner size="lg" />
  if (error) return <div className="page container"><p>Error: {error}</p></div>
  if (!data) return null

  const updateParam = (key: string, value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (value.trim()) next.set(key, value)
      else next.delete(key)
      if (key !== 'page') next.delete('page')
      return next
    })
  }

  const clearParam = (key: string) => updateParam(key, '')
  const clearAll = () => setSearchParams({})

  return (
    <ErrorBoundary>
      <div className="page talent-search-page">
        <div className="container">
          <Breadcrumb crumbs={[{ label: 'Home', to: '/' }, { label: 'Talent Search' }]} />

          <section className="talent-search-header">
            <div>
              <h1>Talent Search</h1>
              <p>
                Search people by role, skill, company, location, sector, and platform track.
              </p>
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
                value={params.q}
                onChange={(event) => updateParam('q', event.target.value)}
                placeholder="Search names, skills, titles, companies, locations..."
                aria-label="Search talent"
              />
            </div>
            <div className="talent-search-quick-links" aria-label="Suggested searches">
              {['Salesforce', 'Murex', 'Calypso', 'Credit Risk', 'Johannesburg', 'Market Risk'].map((value) => (
                <button key={value} type="button" onClick={() => updateParam('q', value)}>
                  {value}
                </button>
              ))}
            </div>
          </section>

          <div className="talent-search-layout">
            <TalentFilterSidebar
              facets={facets}
              params={params}
              updateParam={updateParam}
              clearParam={clearParam}
              clearAll={clearAll}
            />

            <main>
              <div className="talent-results-toolbar">
                <div>
                  <strong>{filteredResults.length.toLocaleString()}</strong> professional{filteredResults.length === 1 ? '' : 's'}
                  {params.q && <span> for <strong>{params.q}</strong></span>}
                </div>
                <div className="talent-sort-controls" aria-label="Sort results">
                  <span>Sort</span>
                  {SORTS.map((sort) => (
                    <button
                      key={sort.key}
                      type="button"
                      className={params.sort === sort.key ? 'active' : ''}
                      onClick={() => updateParam('sort', sort.key)}
                    >
                      {sort.label}
                    </button>
                  ))}
                </div>
              </div>

              {activeFilters.length > 0 && (
                <div className="talent-active-filters" aria-label="Active filters">
                  {activeFilters.map((filter) => (
                    <button key={filter.key} type="button" onClick={() => clearParam(filter.key)}>
                      {filter.label}
                      <X size={14} />
                    </button>
                  ))}
                  <button type="button" className="clear-all" onClick={clearAll}>Clear all</button>
                </div>
              )}

              {paginatedResults.length === 0 ? (
                <EmptyState
                  title="No matching professionals found"
                  description="Try a broader search term or remove one of the filters."
                  action={{ label: 'Clear search', to: '/talent-search' }}
                />
              ) : (
                <div className="talent-results-list">
                  {paginatedResults.map((profile) => {
                    const creditRiskSlug = profile.sourceProfileId ? slugSets?.profileIdToSlug.get(profile.sourceProfileId) : undefined
                    return <TalentSearchCard key={profile.id} profile={profile} creditRiskSlug={creditRiskSlug} />
                  })}
                </div>
              )}

              {totalPages > 1 && (
                <nav className="talent-pagination" aria-label="Talent search pagination">
                  <button type="button" onClick={() => updateParam('page', String(currentPage - 1))} disabled={currentPage <= 1}>
                    <ChevronLeft size={16} />
                    Prev
                  </button>
                  <span>Page {currentPage} of {totalPages}</span>
                  <button type="button" onClick={() => updateParam('page', String(currentPage + 1))} disabled={currentPage >= totalPages}>
                    Next
                    <ChevronRight size={16} />
                  </button>
                </nav>
              )}
            </main>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}

function TalentFilterSidebar({
  facets,
  params,
  updateParam,
  clearParam,
  clearAll,
}: {
  facets: Record<FacetKey, Facet[]>
  params: Record<string, string | number>
  updateParam: (key: string, value: string) => void
  clearParam: (key: string) => void
  clearAll: () => void
}) {
  return (
    <aside className="talent-filter-sidebar">
      <div className="talent-filter-heading">
        <div>
          <Filter size={16} />
          <h2>Filters</h2>
        </div>
        <button type="button" onClick={clearAll}>Clear</button>
      </div>

      <FacetGroup title="Track" paramKey="track" options={facets.track} current={String(params.track)} updateParam={updateParam} clearParam={clearParam} />
      <FacetGroup title="Company" paramKey="company" options={facets.company} current={String(params.company)} updateParam={updateParam} clearParam={clearParam} />
      <FacetGroup title="Location" paramKey="location" options={facets.location} current={String(params.location)} updateParam={updateParam} clearParam={clearParam} />
      <FacetGroup title="Seniority" paramKey="seniority" options={facets.seniority} current={String(params.seniority)} updateParam={updateParam} clearParam={clearParam} />
      <FacetGroup title="Skills" paramKey="skill" options={facets.skill} current={String(params.skill)} updateParam={updateParam} clearParam={clearParam} />
      <FacetGroup title="Sector" paramKey="sector" options={facets.sector} current={String(params.sector)} updateParam={updateParam} clearParam={clearParam} />
    </aside>
  )
}

function FacetGroup({
  title,
  paramKey,
  options,
  current,
  updateParam,
  clearParam,
}: {
  title: string
  paramKey: FacetKey
  options: Facet[]
  current: string
  updateParam: (key: string, value: string) => void
  clearParam: (key: string) => void
}) {
  if (options.length === 0) return null

  return (
    <section className="talent-facet-group">
      <h3>{title}</h3>
      <div className="talent-facet-options">
        {options.slice(0, 8).map((option) => {
          const active = current === option.value
          return (
            <button
              key={option.value}
              type="button"
              className={active ? 'active' : ''}
              onClick={() => active ? clearParam(paramKey) : updateParam(paramKey, option.value)}
            >
              <span className="talent-checkbox">{active && <Check size={12} />}</span>
              <span className="talent-facet-label">{option.label}</span>
              <span className="talent-facet-count">{option.count}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

function TalentSearchCard({ profile, creditRiskSlug }: { profile: TalentProfile; creditRiskSlug?: string }) {
  const profileLink = profile.sourceType === 'bundled' && creditRiskSlug ? `/profiles/${creditRiskSlug}` : undefined
  const skills = profile.skills.slice(0, 5)
  const sourceClass = profile.sourceType === 'manual' ? 'planned' : 'live'

  return (
    <article className="talent-result-row">
      <div className="talent-avatar" aria-hidden="true">{initials(profile.name)}</div>

      <div className="talent-result-main">
        <div className="talent-result-heading">
          <div>
            <div className="talent-result-name-row">
              <h2>{profile.name}</h2>
              {profile.sourceType === 'bundled' && <span className="verified-dot" title="Bundled profile source"><Check size={12} /></span>}
              <span className={`track-status-badge track-status-${sourceClass}`}>
                {profile.track}
              </span>
            </div>
            <p className="talent-result-role">{profile.title}</p>
          </div>
          <div className="talent-result-actions">
            {profileLink && <Link to={profileLink} className="btn btn-primary btn-sm"><UserRound size={15} /> Profile</Link>}
            {profile.linkedinUrl && (
              <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">
                LinkedIn
              </a>
            )}
          </div>
        </div>

        <div className="talent-result-meta">
          <span><Building2 size={15} /> {profile.company || 'Company not added'}</span>
          <span><MapPin size={15} /> {profile.location || 'Location not added'}</span>
          <span><BriefcaseBusiness size={15} /> {profile.seniority || 'Seniority not added'}</span>
        </div>

        <p className="talent-result-summary">{profile.summary}</p>

        <div className="talent-result-skill-group">
          {skills.map((skill) => (
            <button key={skill} type="button" className="talent-result-chip">
              {skill}
            </button>
          ))}
        </div>
      </div>
    </article>
  )
}

function createFacets(profiles: TalentProfile[]): Record<FacetKey, Facet[]> {
  const trackLabels = profilesByTrack(profiles)

  return {
    track: countFacet(profiles, (profile) => [profile.trackSlug], (value) => trackLabels.get(value) ?? value),
    company: countFacet(profiles, (profile) => [profile.company]),
    location: countFacet(profiles, (profile) => [profile.location]),
    seniority: countFacet(profiles, (profile) => [profile.seniority]),
    skill: countFacet(profiles, (profile) => profile.skills),
    sector: countFacet(profiles, (profile) => profile.sectors),
  }
}

function countFacet(
  profiles: TalentProfile[],
  getValues: (profile: TalentProfile) => string[],
  getLabel: (value: string) => string = (value) => value,
): Facet[] {
  const counts = new Map<string, number>()
  for (const profile of profiles) {
    for (const value of getValues(profile)) {
      if (!value) continue
      counts.set(value, (counts.get(value) ?? 0) + 1)
    }
  }

  return [...counts.entries()]
    .map(([value, count]) => ({ value, label: getLabel(value), count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
}

function profilesByTrack(profiles: TalentProfile[]) {
  const labels = new Map<string, string>()
  for (const profile of profiles) {
    if (!labels.has(profile.trackSlug)) {
      labels.set(profile.trackSlug, profile.track)
    }
  }
  return labels
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

function getActiveFilters(params: Record<string, string | number>) {
  return ([
    ['track', params.track],
    ['company', params.company],
    ['location', params.location],
    ['seniority', params.seniority],
    ['skill', params.skill],
    ['sector', params.sector],
  ] as [string, string | number][]).filter(([, value]) => Boolean(value)).map(([key, value]) => ({
    key,
    label: String(value),
  }))
}

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}
