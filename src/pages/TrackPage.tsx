import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { ArrowRight, BriefcaseBusiness, LayoutTemplate, ShieldCheck, Sparkles, Workflow } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { getTalentTrackBySlug, type TalentTrack } from '../data'
import { NotFound } from './NotFound'

const accentIconMap: Record<TalentTrack['accent'], typeof BriefcaseBusiness> = {
  salesforce: BriefcaseBusiness,
  credit: ShieldCheck,
  murex: Workflow,
  calypso: Sparkles,
}

interface MarketTrackPageProps {
  trackSlug: string
  extraContent?: ReactNode
}

export function MarketTrackPage({ trackSlug, extraContent }: MarketTrackPageProps) {
  const track = getTalentTrackBySlug(trackSlug)

  useEffect(() => {
    if (track) {
      document.title = `SA Talent Map | ${track.name}`
    }
  }, [track])

  if (!track) return <NotFound />

  const AccentIcon = accentIconMap[track.accent]
  const isLive = track.status === 'live'

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
            <span className={`track-status-badge track-status-${track.status}`}>
              {isLive ? 'Live track' : 'Planned track'}
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
              ? 'This track is already connected to the working interactive experience and remains the base implementation for future branches.'
              : 'As new information lands, this track can be connected to the same high-performance lookup and directory patterns already proven in the credit-risk implementation.'}
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
