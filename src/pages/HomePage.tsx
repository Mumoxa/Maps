import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Briefcase,
  Calculator,
  Database,
  MagnifyingGlass,
  SealCheck,
  ShieldCheck,
  Sparkle,
  TreeStructure,
  Trophy,
} from '@phosphor-icons/react'
import { useData } from '../context/DataContext'
import { SkeletonPage } from '../components/ui/LoadingSpinner'
import { deriveMarketSummary, getTalentProfiles, talentTracks, type TalentTrack } from '../data'

const accentIconMap: Record<TalentTrack['accent'], typeof Briefcase> = {
  salesforce: Briefcase,
  credit: ShieldCheck,
  sap: Database,
  murex: TreeStructure,
  calypso: Sparkle,
  hackathon: Trophy,
  accounting: Calculator,
}

const suggestedSearches = ['Salesforce architect', 'SAP ERP', 'Credit risk', 'CA(SA)', 'Murex', 'Johannesburg']

export function HomePage() {
  const { data, loading } = useData()
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'SA Talent Map | South African specialist talent intelligence'
  }, [])

  const talentProfiles = useMemo(() => (data ? getTalentProfiles(data) : []), [data])
  const marketSummary = useMemo(() => deriveMarketSummary(talentProfiles), [talentProfiles])
  const populatedTracks = [...marketSummary.byTrack.values()].filter((count) => count > 0).length

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = query.trim()
    navigate(trimmed ? `/talent-search?q=${encodeURIComponent(trimmed)}` : '/talent-search')
  }

  if (loading) return <SkeletonPage variant="grid" cards={3} />

  return (
    <div className="page talent-home-page">
      <div className="container">
        <section className="talent-home-hero">
          <div className="talent-home-hero-inner">
            <p className="track-hero-badge">
              <SealCheck size={14} weight="fill" aria-hidden />
              Evidence-linked South African talent
            </p>
            <h1>Know who is in the South African market before you start the search.</h1>
            <p className="lede">
              Search Salesforce, SAP ERP, credit risk, Murex, Calypso, hackathon and accounting talent
              across South Africa.
            </p>

            <form className="talent-home-searchbox" onSubmit={handleSearch} role="search">
              <MagnifyingGlass size={20} aria-hidden />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search people, skills, companies, locations"
                aria-label="Search people, skills, companies and locations"
              />
              <button type="submit">
                Search
                <ArrowRight size={17} weight="bold" aria-hidden />
              </button>
            </form>

            <div className="talent-home-suggestions" aria-label="Suggested searches">
              {suggestedSearches.map((suggestion) => (
                <Link key={suggestion} to={`/talent-search?q=${encodeURIComponent(suggestion)}`}>
                  {suggestion}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="talent-home-overview" aria-label="Dataset state">
          <div className="talent-home-stat">
            <strong>{marketSummary.totalProfiles.toLocaleString()}</strong>
            <span>Searchable professionals</span>
          </div>
          <div className="talent-home-stat">
            <strong>{populatedTracks}</strong>
            <span>Populated tracks</span>
          </div>
          <div className="talent-home-stat">
            <strong>{data ? data.companies.length.toLocaleString() : '0'}</strong>
            <span>Mapped companies</span>
          </div>
          <div className="talent-home-stat">
            <strong>{talentTracks.length}</strong>
            <span>Registered tracks</span>
          </div>
        </section>

        <section className="talent-home-tracks" aria-label="Talent tracks">
          {talentTracks.map((track) => {
            const AccentIcon = accentIconMap[track.accent]
            const count = marketSummary.byTrack.get(track.slug) ?? 0
            const isLive = count > 0

            return (
              <Link
                key={track.id}
                to={`/${track.slug}`}
                className={`talent-track-card talent-track-card-${track.accent}`}
              >
                <span className="talent-track-icon" aria-hidden>
                  <AccentIcon size={24} weight="duotone" />
                </span>
                <div className="talent-track-content">
                  <div className="talent-track-topline">
                    <span className="talent-track-label">{track.shortLabel}</span>
                    <span className={`track-status-badge track-status-${isLive ? 'live' : 'planned'}`}>
                      {isLive ? 'Live' : 'Open for additions'}
                    </span>
                  </div>
                  <h2>{track.name}</h2>
                  <p>{track.summary}</p>
                </div>
                <span className="talent-track-cta">
                  {isLive
                    ? `${count.toLocaleString()} searchable ${count === 1 ? 'profile' : 'profiles'}`
                    : 'Ready for a verified batch'}
                  <ArrowRight size={15} weight="bold" aria-hidden />
                </span>
              </Link>
            )
          })}
        </section>

        <section className="home-proof" aria-label="How this dataset is kept honest">
          <div className="home-proof-item">
            <ShieldCheck size={22} weight="duotone" aria-hidden />
            <h3>Every record keeps its source</h3>
            <p>
              Profiles carry the public source they came from, so any entry can be checked before it is
              used in a shortlist.
            </p>
          </div>
          <div className="home-proof-item">
            <Database size={22} weight="duotone" aria-hidden />
            <h3>Additions are append-only</h3>
            <p>
              New research enters as a verified batch. Existing records are updated rather than
              silently overwritten, and counts stay derived.
            </p>
          </div>
          <div className="home-proof-item">
            <TreeStructure size={22} weight="duotone" aria-hidden />
            <h3>One structure across tracks</h3>
            <p>
              Every market shares the same profile contract, so search, filtering and export behave
              the same whichever track you work in.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
