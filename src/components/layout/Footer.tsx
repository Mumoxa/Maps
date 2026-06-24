import { useData } from '../../context/DataContext'
import { getTalentProfiles } from '../../data'

export function Footer() {
  const { data } = useData()
  const totalTalentProfiles = data ? getTalentProfiles(data).length : 0

  return (
    <footer className="footer">
      <div className="footer-inner">
        <p>SA Talent Map - Multi-track recruitment market intelligence</p>
        <p>Data compiled from public LinkedIn profiles and web research</p>
        {data && (
          <p>
            {totalTalentProfiles.toLocaleString()} searchable professionals · {data.profiles.length} credit risk profiles · {data.companies.length} companies
          </p>
        )}
      </div>
    </footer>
  )
}
