import { Link } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'
import { Badge } from './Badge'
import { Tooltip } from './Tooltip'
import type { Profile, ShortlistEntry } from '../../data'

interface ProfileCardProps {
  profile: Profile
  shortlistEntry?: ShortlistEntry
  profileSlug?: string
}

export function ProfileCard({ profile, shortlistEntry, profileSlug }: ProfileCardProps) {
  const isDavidColeman = profile.name === 'David Coleman'
  const needsVerification = profile.company === 'Needs verification'

  return (
    <div className="card profile-card">
      <div className="profile-card-header">
        <div>
          <div className="profile-card-name">
            {profileSlug ? (
              <Link to={`/profiles/${profileSlug}`}>{profile.name}</Link>
            ) : (
              profile.name
            )}
            {shortlistEntry && (
              <span style={{ fontSize: '0.75rem', marginLeft: '0.5rem', color: '#f59e0b' }}>
                #{shortlistEntry.Rank}
              </span>
            )}
          </div>
          {isDavidColeman && (
            <Tooltip content="Two profiles share this name. Both retained for review.">
              <Badge text="Duplicate name — review" variant="duplicate" />
            </Tooltip>
          )}
        </div>
        <Badge
          text={profile.confidence}
          variant="confidence"
          confidence={profile.confidence}
        />
      </div>
      <div className="profile-card-meta">
        <div>
          {needsVerification ? (
            <Link to="/profiles?needs_verification=true">
              <Badge text="Needs verification" variant="verification" />
            </Link>
          ) : (
            <span>{profile.company}</span>
          )}
        </div>
        <div>{profile.title}</div>
        <div>{profile.location}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>Fit: {profile.fit_score}/10</span>
          <span>{profile.seniority}</span>
          {profile.segment && <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{profile.segment}</span>}
        </div>
      </div>
      <div className="profile-card-actions">
        {profile.linkedin_url && profile.linkedin_url !== '#' && (
          <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
            <ExternalLink size={14} /> LinkedIn
          </a>
        )}
        {profile.source_url && profile.source_url !== '#' && profile.source_url !== profile.linkedin_url && (
          <a href={profile.source_url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
            <ExternalLink size={14} /> Source
          </a>
        )}
      </div>
    </div>
  )
}
