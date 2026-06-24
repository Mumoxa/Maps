import { useEffect, useMemo, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { MapPin, Search, Sparkles } from 'lucide-react'
import { useData } from '../context/DataContext'
import { Breadcrumb } from '../components/ui/Breadcrumb'
import { EmptyState } from '../components/ui/EmptyState'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { ErrorBoundary } from '../components/ui/ErrorBoundary'
import { buildSlugSets, createTalentSearchIndex, getTalentProfiles, searchTalentProfiles, type TalentProfile } from '../data'

export function TalentSearchPage() {
  const { data, loading, error } = useData()
  const [searchParams, setSearchParams] = useSearchParams()
  const talentSearchRef = useRef<ReturnType<typeof createTalentSearchIndex> | null>(null)

  useEffect(() => {
    document.title = 'Talent Search'
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

  const query = searchParams.get('q') || ''
  const track = searchParams.get('track') || ''
  const location = searchParams.get('location') || ''
  const seniority = searchParams.get('seniority') || ''
  const skill = searchParams.get('skill') || ''

  const slugSets = useMemo(() => {
    if (!data) return null
    return buildSlugSets(data)
  }, [data])

  const results = useMemo(() => {
    if (!talentSearchRef.current) return talentProfiles
    return searchTalentProfiles(talentSearchRef.current, talentProfiles, query, {
      track: track || undefined,
      location: location || undefined,
      seniority: seniority || undefined,
      skill: skill || undefined,
    })
  }, [location, query, seniority, skill, talentProfiles, track])

  const trackOptions = useMemo(() => {
    const trackLabelBySlug = new Map<string, string>()
    for (const profile of talentProfiles) {
      if (!trackLabelBySlug.has(profile.trackSlug)) {
        trackLabelBySlug.set(profile.trackSlug, profile.track)
      }
    }

    return [...trackLabelBySlug.keys()]
      .sort()
      .map((trackSlug) => ({ value: trackSlug, label: trackLabelBySlug.get(trackSlug) ?? trackSlug }))
  }, [talentProfiles])

  const seniorityOptions = useMemo(() => {
    return [...new Set(talentProfiles.map((profile) => profile.seniority))].sort()
  }, [talentProfiles])

  if (loading) return <LoadingSpinner size="lg" />
  if (error) return <div className="page container"><p>Error: {error}</p></div>
  if (!data) return null

  const updateParam = (key: string, value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (value.trim()) next.set(key, value)
      else next.delete(key)
      return next
    })
  }

  return (
    <ErrorBoundary>
      <div className="page">
        <div className="container">
          <Breadcrumb crumbs={[{ label: 'Home', to: '/' }, { label: 'Talent Search' }]} />

          <section className="talent-search-hero">
            <div className="talent-home-kicker">
              <Sparkles size={16} />
              <span>Cross-track candidate discovery</span>
            </div>
            <h1>Talent Search</h1>
            <p>
              Search for skills, location, title, company, and domain signals across the live credit-risk data plus
              manually added Salesforce, Murex, and Calypso profiles.
            </p>
          </section>

          <section className="talent-search-panel card">
            <div className="talent-search-input-wrap">
              <Search size={18} className="talent-search-input-icon" />
              <input
                className="talent-search-input"
                type="text"
                value={query}
                onChange={(event) => updateParam('q', event.target.value)}
                placeholder="Search names, skills, titles, companies, locations..."
                aria-label="Search talent"
              />
            </div>

            <div className="talent-search-filters">
              <select
                className="filter-select"
                value={track}
                onChange={(event) => updateParam('track', event.target.value)}
                aria-label="Filter by track"
              >
                <option value="">All Tracks</option>
                {trackOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>

              <input
                className="talent-search-mini-input"
                type="text"
                value={skill}
                onChange={(event) => updateParam('skill', event.target.value)}
                placeholder="Skill or capability"
                aria-label="Filter by skill"
              />

              <input
                className="talent-search-mini-input"
                type="text"
                value={location}
                onChange={(event) => updateParam('location', event.target.value)}
                placeholder="Location"
                aria-label="Filter by location"
              />

              <select
                className="filter-select"
                value={seniority}
                onChange={(event) => updateParam('seniority', event.target.value)}
                aria-label="Filter by seniority"
              >
                <option value="">All Seniority</option>
                {seniorityOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </section>

          <div className="talent-search-meta">
            <p><strong>{results.length}</strong> people found</p>
            <p className="text-secondary">
              To add more people, update <code>src/data/talentRegistry.ts</code>.
            </p>
          </div>

          {results.length === 0 ? (
            <EmptyState
              title="No people found"
              description="Try broadening the skill, location, or track filters."
              action={{ label: 'Clear search', to: '/talent-search' }}
            />
          ) : (
            <div className="talent-search-results">
              {results.map((profile) => {
                const creditRiskSlug = profile.sourceProfileId ? slugSets?.profileIdToSlug.get(profile.sourceProfileId) : undefined
                return <TalentSearchCard key={profile.id} profile={profile} creditRiskSlug={creditRiskSlug} />
              })}
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}

function TalentSearchCard({ profile, creditRiskSlug }: { profile: TalentProfile; creditRiskSlug?: string }) {
  const profileLink = profile.sourceType === 'bundled' && creditRiskSlug ? `/profiles/${creditRiskSlug}` : undefined

  return (
    <article className="talent-result-card">
      <div className="talent-result-top">
        <div>
          <div className="talent-result-topline">
            <span className={`track-status-badge track-status-${profile.sourceType === 'bundled' ? 'live' : 'planned'}`}>
              {profile.track}
            </span>
            <span className="talent-result-source">{profile.sourceType === 'bundled' ? 'Bundled data' : 'Manual entry'}</span>
          </div>
          <h2>{profile.name}</h2>
          <p className="talent-result-role">{profile.title} at {profile.company}</p>
        </div>
        <div className="talent-result-location">
          <MapPin size={16} />
          <span>{profile.location || 'Location not yet added'}</span>
        </div>
      </div>

      <p className="talent-result-summary">{profile.summary}</p>

      <div className="talent-result-skill-group">
        {profile.skills.map((skill) => (
          <span key={skill} className="talent-result-chip">{skill}</span>
        ))}
      </div>

      <div className="talent-result-footer">
        <span className="text-secondary">{profile.seniority}</span>
        <div className="talent-result-actions">
          {profileLink && <Link to={profileLink}>Open profile</Link>}
          {profile.linkedinUrl && (
            <a href={profile.linkedinUrl} target="_blank" rel="noreferrer">
              View LinkedIn
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
