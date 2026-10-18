import { Link } from 'react-router-dom'
import { ShareNetwork } from '@phosphor-icons/react'
import { useData } from '../../context/DataContext'
import { deriveMarketSummary, getTalentProfiles } from '../../data'

/**
 * Footer: the derived state of the dataset, then the ways back into it.
 * Counts come from the data at runtime, never from a hardcoded string.
 */
export function Footer() {
  const { data } = useData()
  const summary = deriveMarketSummary(data ? getTalentProfiles(data) : [])
  const populatedTracks = data ? [...summary.byTrack.values()].filter((count) => count > 0).length : 0

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-about">
          <span className="footer-mark">
            <ShareNetwork size={17} weight="bold" aria-hidden />
            SA Talent Map
          </span>
          <p>
            Multi-track recruitment market intelligence for South African specialist talent.
            Compiled from public professional profiles and published web sources.
          </p>
        </div>

        <div className="footer-figures" aria-label="Dataset state">
          <div className="footer-figure">
            <strong>{summary.totalProfiles.toLocaleString()}</strong>
            <span>Searchable professionals</span>
          </div>
          <div className="footer-figure">
            <strong>{populatedTracks}</strong>
            <span>Populated tracks</span>
          </div>
          {data && (
            <div className="footer-figure">
              <strong>{data.companies.length.toLocaleString()}</strong>
              <span>Mapped companies</span>
            </div>
          )}
        </div>

        <nav className="footer-links" aria-label="Footer">
          <Link to="/talent-search">All candidates</Link>
          <Link to="/map">Interactive map</Link>
          <Link to="/search-bank">Search bank</Link>
          <Link to="/contacts">Contacts</Link>
        </nav>
      </div>
    </footer>
  )
}
