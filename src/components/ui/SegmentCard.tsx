import { Link } from 'react-router-dom'
import type { Segment } from '../../data'

interface SegmentCardProps {
  segment: Segment
  profileCount: number
  slug?: string
}

export function SegmentCard({ segment, profileCount, slug }: SegmentCardProps) {
  return (
    <div className="card segment-card">
      <div className="segment-card-name">
        {slug ? (
          <Link to={`/segments/${slug}`}>{segment.name}</Link>
        ) : (
          segment.name
        )}
      </div>
      <div className="segment-card-meta">
        <span>{profileCount} {profileCount === 1 ? 'profile' : 'profiles'}</span>
        {segment.companies && <span>· {segment.companies.length} {segment.companies.length === 1 ? 'company' : 'companies'}</span>}
      </div>
    </div>
  )
}
