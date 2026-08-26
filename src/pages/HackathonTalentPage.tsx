import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ExternalLink, Filter, GraduationCap, MapPin, Search, Trophy } from 'lucide-react'
import { Breadcrumb } from '../components/ui/Breadcrumb'
import { EmptyState } from '../components/ui/EmptyState'
import {
  filterHackathonCandidates,
  hackathonCandidates,
  hackathonEventNames,
  hackathonProvinces,
  hackathonUniverse,
  hackathonYears,
  type HackathonCandidate,
} from '../data/hackathonPeople'
import { canonicalCompanyName } from '../data/companyNormalization'

const PAGE_SIZE = 20

const TIER_OPTIONS = ['Winner', 'Top 3', 'Top 10', 'Special award', 'Finalist', 'Qualified', 'Participant']

function tierBadgeClass(tier: string): string {
  if (tier === 'Winner') return 'hack-badge hack-badge-gold'
  if (tier === 'Top 3') return 'hack-badge hack-badge-silver'
  if (tier === 'Top 10') return 'hack-badge hack-badge-bronze'
  return 'hack-badge'
}

function ConfidenceBadge({ confidence }: { confidence: string }) {
  const cls =
    confidence === 'High' ? 'hack-confidence-high' : confidence === 'Medium' ? 'hack-confidence-medium' : 'hack-confidence-low'
  return <span className={`hack-badge ${cls}`} title="Identity confidence from the SA Hackathon Census">Confidence: {confidence}</span>
}

function CandidateCard({ candidate, onFilter }: { candidate: HackathonCandidate; onFilter: (key: string, value: string) => void }) {
  const visibleEvents = candidate.events.slice(0, 3)
  const hidden = candidate.events.length - visibleEvents.length
  return (
    <article className="hack-candidate-card">
      <header className="hack-candidate-head">
        <div>
          <h3 className="hack-candidate-name">{candidate.fullName}</h3>
          <p className="hack-candidate-sub">
            <span className="hack-badge">Candidate</span>
            <span className="hack-badge hack-badge-segment">{candidate.segment}</span>
            <span className={tierBadgeClass(candidate.bestTier)}>{candidate.bestResultLabel}</span>
          </p>
        </div>
        <ConfidenceBadge confidence={candidate.confidence} />
      </header>

      <div className="hack-candidate-meta">
        {candidate.universityAtTime && (
          <button
            type="button"
            className="hack-meta-link"
            title={canonicalCompanyName(candidate.universityAtTime) === candidate.universityAtTime ? 'Show all candidates from this university' : `Show all candidates from ${canonicalCompanyName(candidate.universityAtTime)} (listed as ${candidate.universityAtTime})`}
            onClick={() => onFilter('affiliation', canonicalCompanyName(candidate.universityAtTime!))}
          >
            <GraduationCap size={14} aria-hidden /> {canonicalCompanyName(candidate.universityAtTime!)}
          </button>
        )}
        {candidate.organisationAtTime && (
          <button
            type="button"
            className="hack-meta-link"
            title={canonicalCompanyName(candidate.organisationAtTime) === candidate.organisationAtTime ? 'Show all candidates with this organisation' : `Show all candidates with ${canonicalCompanyName(candidate.organisationAtTime)} (listed as ${candidate.organisationAtTime})`}
            onClick={() => onFilter('affiliation', canonicalCompanyName(candidate.organisationAtTime!))}
          >
            <Trophy size={14} aria-hidden /> {canonicalCompanyName(candidate.organisationAtTime!)}
          </button>
        )}
        {candidate.province && (
          <button type="button" className="hack-meta-link" title="Show all candidates in this province" onClick={() => onFilter('province', candidate.province!)}>
            <MapPin size={14} aria-hidden /> Event province: {candidate.province}
          </button>
        )}
      </div>
      {(candidate.organisationAtTime || candidate.universityAtTime) && (
        <div className="hack-crosslinks">
          {candidate.organisationAtTime && (
            <>
              <Link to={`/talent-search?q=${encodeURIComponent(canonicalCompanyName(candidate.organisationAtTime!))}`} title="Search this organisation across every pool">
                {candidate.organisationAtTime} across all pools
              </Link>
              <Link to={`/contacts?company=${encodeURIComponent(canonicalCompanyName(candidate.organisationAtTime!))}`} title="Open the contacts directory at this company">
                Contacts at {candidate.organisationAtTime}
              </Link>
            </>
          )}
          {candidate.universityAtTime && (
            <Link to={`/talent-search?q=${encodeURIComponent(canonicalCompanyName(candidate.universityAtTime!))}`} title="Search this university across every pool">
              {candidate.universityAtTime} across all pools
            </Link>
          )}
        </div>
      )}

      <ul className="hack-event-list">
        {visibleEvents.map((event, index) => (
          <li key={`${candidate.id}-${index}`}>
            <div className="hack-event-line">
              <button type="button" className="hack-meta-link hack-event-name" title="Show all candidates in this event" onClick={() => onFilter('event', event.event)}>
                {event.event}
              </button>
              <span className="hack-event-when">{[event.edition, event.year].filter(Boolean).join(' · ')}</span>
              <span className={tierBadgeClass(event.tier)}>{event.placement}</span>
              {event.winner && <span className="hack-badge hack-badge-gold">Winner</span>}
            </div>
            <p className="hack-event-detail">
              {[
                event.team && `Team: ${event.team}`,
                event.project,
                event.award,
                event.city && `Venue city: ${event.city}`,
              ].filter(Boolean).join(' · ') || null}
              {event.team && (
                <button type="button" className="hack-meta-link" title="Show all candidates from this team" onClick={() => onFilter('q', event.team!)}>
                  Team: {event.team}
                </button>
              )}
              {event.project ? <span> {event.project}</span> : null}
              {event.award ? <span> · {event.award}</span> : null}
              {event.city ? <span> · Venue city: {event.city}</span> : null}
            </p>
            <a className="hack-evidence-link" href={event.evidenceUrl} target="_blank" rel="noreferrer">
              Evidence <ExternalLink size={12} aria-hidden />
            </a>
          </li>
        ))}
        {hidden > 0 && <li className="hack-event-more">+ {hidden} more participation record{hidden === 1 ? '' : 's'} in the census</li>}
      </ul>

      <footer className="hack-candidate-foot">
        <a className="hack-evidence-link" href={candidate.evidenceUrl} target="_blank" rel="noreferrer">
          Primary evidence <ExternalLink size={12} aria-hidden />
        </a>
        <span className="hack-source-note">{candidate.source}</span>
      </footer>
    </article>
  )
}

export function HackathonTalentPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const param = (key: string) => searchParams.get(key) ?? ''
  const query = param('q')
  const tier = param('tier')
  const province = param('province')
  const year = param('year')
  const event = param('event')
  const affiliation = param('affiliation')
  const [page, setPage] = useState(0)
  const setParam = (key: string, value: string) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (value) next.set(key, value)
      else next.delete(key)
      next.delete('page')
      return next
    }, { replace: true })
  }

  const universe = useMemo(() => hackathonUniverse(), [])
  const provinces = useMemo(() => hackathonProvinces(), [])
  const years = useMemo(() => hackathonYears(), [])
  const eventNames = useMemo(() => hackathonEventNames(), [])
  const tiers = useMemo(() => {
    const counts = new Map<string, number>()
    for (const candidate of hackathonCandidates) counts.set(candidate.bestTier, (counts.get(candidate.bestTier) ?? 0) + 1)
    return TIER_OPTIONS.filter((option) => counts.has(option)).map((option) => ({ value: option, count: counts.get(option) ?? 0 }))
  }, [])

  const results = useMemo(
    () => filterHackathonCandidates({ query, tier, province, year, event, affiliation }),
    [query, tier, province, year, event, affiliation],
  )
  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount - 1)
  const pageItems = results.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE)


  return (
    <main className="page">
      <Breadcrumb crumbs={[{ label: 'Home', to: '/' }, { label: 'Hackathon Talent' }]} />
      <header className="hack-hero">
        <p className="hack-kicker">SA Talent Pool · Candidates</p>
        <h1>Hackathon contestants</h1>
        <p className="hack-lede">
          Evidence-linked candidates from the SA Hackathon Census — South Africans who competed, placed or won
          hackathons and sprint-format technology competitions. Every record keeps its participation history and a
          source URL; nothing is inferred.
        </p>
        <div className="hack-kpis">
          <div className="hack-kpi"><strong>{universe.candidates}</strong><span>Candidates</span></div>
          <div className="hack-kpi"><strong>{universe.winners}</strong><span>Winners</span></div>
          <div className="hack-kpi"><strong>{universe.top3}</strong><span>Top-3 placements</span></div>
          <div className="hack-kpi"><strong>{universe.editions}</strong><span>Event editions tracked</span></div>
          <div className="hack-kpi"><strong>{universe.provinces}</strong><span>Provinces</span></div>
        </div>
      </header>

      <section className="hack-controls" aria-label="Filters">
        <div className="hack-control hack-control-search">
          <Search size={15} aria-hidden />
          <input
            value={query}
            onChange={(change) => { setParam('q', change.target.value); setPage(0) }}
            placeholder="Search name, team, project, event…"
            aria-label="Search candidates"
          />
        </div>
        <div className="hack-control">
          <Filter size={15} aria-hidden />
          <select value={tier} onChange={(change) => { setParam('tier', change.target.value); setPage(0) }} aria-label="Best result">
            <option value="">Any result</option>
            {tiers.map((option) => (
              <option key={option.value} value={option.value}>{option.value} ({option.count})</option>
            ))}
          </select>
        </div>
        <div className="hack-control">
          <select value={province} onChange={(change) => { setParam('province', change.target.value); setPage(0) }} aria-label="Province">
            <option value="">All provinces</option>
            {provinces.map((option) => (
              <option key={option.value} value={option.value}>{option.label} ({option.count})</option>
            ))}
          </select>
        </div>
        <div className="hack-control">
          <select value={year} onChange={(change) => { setParam('year', change.target.value); setPage(0) }} aria-label="Year">
            <option value="">Any year</option>
            {years.map((option) => (
              <option key={option.value} value={option.value}>{option.label} ({option.count})</option>
            ))}
          </select>
        </div>
        <div className="hack-control">
          <select value={event} onChange={(change) => { setParam('event', change.target.value); setPage(0) }} aria-label="Event">
            <option value="">All events</option>
            {eventNames.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>
        <div className="hack-control hack-control-search">
          <GraduationCap size={15} aria-hidden />
          <input
            value={affiliation}
            onChange={(change) => { setParam('affiliation', change.target.value); setPage(0) }}
            placeholder="University or organisation…"
            aria-label="University or organisation"
          />
        </div>
      </section>

      <p className="hack-results-count">
        {results.length} candidate{results.length === 1 ? '' : 's'} match
        {(query || tier || province || year || event || affiliation) ? ' the current filters' : 'ing the pool'}
        {tier || province || year || event || affiliation || query ? (
          <button className="hack-clear" onClick={() => setSearchParams({}, { replace: true })}>
            Clear filters
          </button>
        ) : null}
      </p>

      {pageItems.length === 0 ? (
        <EmptyState title="No candidates match" description="Try clearing a filter or searching a different event, university or name." />
      ) : (
        <div className="hack-candidate-grid">
          {pageItems.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} onFilter={setParam} />
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

      <footer className="hack-page-foot">
        <p>
          Source: SA Hackathon Census (markets/hackathons + hackathon-census/). Public professional information only;
          pseudonymous and single-name-only census records are excluded from the pool. Event province reflects where
          the person competed, not their residence.
        </p>
      </footer>
    </main>
  )
}
