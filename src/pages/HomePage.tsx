import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, BriefcaseBusiness, Database, Search, ShieldCheck, Sparkles, Workflow } from 'lucide-react'
import { useData } from '../context/DataContext'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { getTalentProfiles, talentTracks, type TalentTrack } from '../data'

const accentIconMap: Record<TalentTrack['accent'], typeof BriefcaseBusiness> = {
  salesforce: BriefcaseBusiness,
  credit: ShieldCheck,
  sap: Database,
  murex: Workflow,
  calypso: Sparkles,
}

const suggestedSearches = ['Salesforce Architect', 'SAP ERP', 'Credit Risk', 'Murex', 'Calypso', 'Johannesburg']

export function HomePage() {
  const { data, loading } = useData()
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'SA Talent Map'
  }, [])

  const talentProfiles = useMemo(() => {
    if (!data) return []
    return getTalentProfiles(data)
  }, [data])

  const trackCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const profile of talentProfiles) {
      counts.set(profile.trackSlug, (counts.get(profile.trackSlug) ?? 0) + 1)
    }
    return counts
  }, [talentProfiles])

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = query.trim()
    navigate(trimmed ? `/talent-search?q=${encodeURIComponent(trimmed)}` : '/talent-search')
  }

  if (loading) return <LoadingSpinner size="lg" />

  return (
    <div className="page talent-home-page">
      <div className="container">
        <section className="talent-home-search">
          <div>
            <h1>Find South African talent across specialist markets.</h1>
            <p>
              SA Talent Map brings Salesforce, SAP ERP, Credit Risk, Murex, Calypso, and future specialist tracks into one searchable platform.
            </p>
          </div>

          <form className="talent-home-searchbox" onSubmit={handleSearch}>
            <Search size={20} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search people, skills, companies, locations..."
              aria-label="Search people, skills, companies, and locations"
            />
            <button type="submit">
              Search
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="talent-home-suggestions" aria-label="Suggested searches">
            {suggestedSearches.map((suggestion) => (
              <Link key={suggestion} to={`/talent-search?q=${encodeURIComponent(suggestion)}`}>
                {suggestion}
              </Link>
            ))}
          </div>
        </section>

        <section className="talent-home-overview" aria-label="Talent map options">
          {talentTracks.map((track) => {
            const AccentIcon = accentIconMap[track.accent]
            const count = trackCounts.get(track.slug) ?? 0

            return (
              <Link key={track.id} to={`/${track.slug}`} className={`talent-track-card talent-track-card-${track.accent}`}>
                <div className="talent-track-icon">
                  <AccentIcon size={28} />
                </div>
                <div className="talent-track-content">
                  <div className="talent-track-topline">
                    <span className="talent-track-label">{track.shortLabel}</span>
                    <span className={`track-status-badge track-status-${track.status}`}>
                      {track.status === 'live' ? 'Live' : 'Planned'}
                    </span>
                  </div>
                  <h2>{track.name}</h2>
                  <p>{track.summary}</p>
                </div>
                <span className="talent-track-cta">
                  {track.status === 'live' && count > 0
                    ? `${count.toLocaleString()} searchable profile${count === 1 ? '' : 's'}`
                    : track.status === 'live'
                      ? 'Verified market added'
                    : 'Dataset coming next'} <ArrowRight size={18} />
                </span>
              </Link>
            )
          })}
        </section>
      </div>
    </div>
  )
}
