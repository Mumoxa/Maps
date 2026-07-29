import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { ArrowRight, BriefcaseBusiness, Database, LayoutTemplate, ShieldCheck, Sparkles, Workflow } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { deriveMarketSummary, getTalentProfiles, getTalentTrackBySlug, type TalentTrack } from '../data'
import { useData } from '../context/DataContext'
import { NotFound } from './NotFound'

const accentIconMap: Record<TalentTrack['accent'], typeof BriefcaseBusiness> = {
  salesforce: BriefcaseBusiness,
  credit: ShieldCheck,
  sap: Database,
  murex: Workflow,
  calypso: Sparkles,
}

interface MarketTrackPageProps {
  trackSlug: string
  extraContent?: ReactNode
}

export function MarketTrackPage({ trackSlug, extraContent }: MarketTrackPageProps) {
  const { data } = useData()
  const track = getTalentTrackBySlug(trackSlug)
  const profiles = useMemo(() => data ? getTalentProfiles(data) : [], [data])
  const summary = useMemo(() => deriveMarketSummary(profiles), [profiles])
  const profileCount = summary.byTrack.get(trackSlug) ?? 0

  useEffect(() => {
    if (track) {
      document.title = `SA Talent Map | ${track.name}`
    }
  }, [track])

  if (!track) return <NotFound />

  const AccentIcon = accentIconMap[track.accent]
  const isLive = profileCount > 0

  return (
    <div className="page">
      <div className="container">
        <section className={`track-hero track-hero-${track.accent}`}>
          <div className="track-hero-badge">
            <AccentIcon size={16} />
            <span>South African {track.name} talent</span>
          </div>
          <h1>{track.name} talent page</h1>
          <p>{track.detail}</p>
          <div className="talent-home-actions">
            <Button variant="primary" to={track.actions.primaryHref}>
              {track.actions.primaryLabel}
            </Button>
            <Button variant="ghost" to={track.actions.secondaryHref}>
              {track.actions.secondaryLabel} <ArrowRight size={18} />
            </Button>
          </div>
        </section>

        <section className="salesforce-next card">
          <div className="track-page-heading">
            <h2 className="mb-2">Buildout status</h2>
            <span className={`track-status-badge track-status-${isLive ? 'live' : 'planned'}`}>
              {isLive ? `${profileCount.toLocaleString()} searchable profiles` : 'Ready for verified additions'}
            </span>
          </div>
          <div className="salesforce-next-grid">
            <div className="salesforce-next-item">
              <LayoutTemplate size={22} />
              <div>
                <h3>Dedicated structure</h3>
                <p>{track.summary}</p>
              </div>
            </div>
            <div className="salesforce-next-item">
              <Workflow size={22} />
              <div>
                <h3>Next implementation steps</h3>
                <ul className="salesforce-step-list">
                  {track.nextSteps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <p className="text-secondary">
            {isLive
              ? 'This track is connected to the shared registry. New verified batches update its search results and counts without page changes.'
              : 'This track is registered and can accept a verified batch through the shared importer without new track-specific code.'}
          </p>
          {!isLive && (
            <p className="mt-2">
              <Link to="/credit-risk">Use the live Credit Risk experience as the current reference implementation.</Link>
            </p>
          )}
        </section>

        {extraContent}
      </div>
    </div>
  )
}
