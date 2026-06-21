import { Link } from 'react-router-dom'
import { Badge } from './Badge'
import type { Company } from '../../data'
import { useData } from '../../context/DataContext'
import { normalizeSegmentName } from '../../data'

interface CompanyCardProps {
  company: Company
  profileCount: number
  slug?: string
}

export function CompanyCard({ company, profileCount, slug }: CompanyCardProps) {
  const { data } = useData()
  const segmentLabel = data ? normalizeSegmentName(company.segment, data) : company.segment

  return (
    <div className="card company-card">
      <div className="company-card-name">
        {slug ? (
          <Link to={`/companies/${slug}`}>{company.name}</Link>
        ) : (
          company.name
        )}
      </div>
      <div className="company-card-meta">
        <div>{segmentLabel}</div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Badge text={company.priority} variant="priority" priority={company.priority} />
          <span>{profileCount} {profileCount === 1 ? 'profile' : 'profiles'}</span>
        </div>
      </div>
    </div>
  )
}
