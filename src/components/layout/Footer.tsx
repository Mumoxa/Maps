import { useData } from '../../context/DataContext'
import { deriveMarketSummary, getTalentProfiles } from '../../data'

export function Footer() {
  const { data } = useData()
  const summary = deriveMarketSummary(data ? getTalentProfiles(data) : [])

  return (
    <footer className="footer">
      <div className="footer-inner">
        <p>SA Talent Map - Multi-track recruitment market intelligence</p>
        <p>Data compiled from public LinkedIn profiles and web research</p>
        {data && (
          <p>
            {summary.totalProfiles.toLocaleString()} searchable professionals · {summary.byTrack.size} populated tracks · {data.companies.length} credit-risk companies
          </p>
        )}
      </div>
    </footer>
  )
}
