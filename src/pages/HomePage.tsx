import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BadgeCheck, BriefcaseBusiness, ShieldCheck, Sparkles, Workflow } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { talentTracks, type TalentTrack } from '../data'

const accentIconMap: Record<TalentTrack['accent'], typeof BriefcaseBusiness> = {
  salesforce: BriefcaseBusiness,
  credit: ShieldCheck,
  murex: Workflow,
  calypso: Sparkles,
}

export function HomePage() {
  useEffect(() => {
    document.title = 'SA Talent Maps'
  }, [])

  return (
    <div className="page talent-home-page">
      <div className="container">
        <section className="talent-home-hero">
          <div className="talent-home-kicker">
            <BadgeCheck size={16} />
            <span>SA Talent intelligence platform</span>
          </div>
          <h1>Choose the SA Talent map you want to explore.</h1>
          <p>
            The interactive hub now supports multiple market tracks so Salesforce, Credit Risk, Murex, Calypso,
            and future additions can grow in one structured experience.
          </p>
          <div className="talent-home-actions">
            <Button variant="secondary" to="/talent-search">
              Open Talent Search <ArrowRight size={18} />
            </Button>
            <Button variant="primary" to="/credit-risk">
              Open Credit Risk <ArrowRight size={18} />
            </Button>
            <Button variant="ghost" to="/salesforce">
              Open Salesforce <ArrowRight size={18} />
            </Button>
          </div>
        </section>

        <section className="talent-home-grid" aria-label="Talent map options">
          {talentTracks.map((track) => {
            const AccentIcon = accentIconMap[track.accent]

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
                  Enter {track.name} page <ArrowRight size={18} />
                </span>
              </Link>
            )
          })}
        </section>
      </div>
    </div>
  )
}
