import { useMemo, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ExternalLink, ArrowLeft } from 'lucide-react'
import { useData } from '../context/DataContext'
import { buildSlugSets, getCompanyByProfile, getSegmentByProfile, getShortlistByProfile } from '../data'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Breadcrumb } from '../components/ui/Breadcrumb'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorBoundary } from '../components/ui/ErrorBoundary'

export function ProfilePage() {
  const { slug } = useParams<{ slug: string }>()
  const { data, loading } = useData()

  const slugSets = useMemo(() => {
    if (!data) return null
    return buildSlugSets(data)
  }, [data])

  const profile = useMemo(() => {
    if (!data || !slugSets || !slug) return undefined
    const id = slugSets.profileSlugs.get(slug)
    if (!id) return undefined
    return data.profiles.find(p => p.id === id)
  }, [data, slugSets, slug])

  const company = useMemo(() => {
    if (!data || !profile) return undefined
    return getCompanyByProfile(data, profile)
  }, [data, profile])

  const segment = useMemo(() => {
    if (!data || !profile) return undefined
    return getSegmentByProfile(data, profile)
  }, [data, profile])

  const shortlistEntry = useMemo(() => {
    if (!data || !profile) return undefined
    return getShortlistByProfile(data, profile)
  }, [data, profile])

  const otherDavidColeman = useMemo(() => {
    if (!data || !profile || profile.name !== 'David Coleman') return undefined
    return data.profiles.filter(p => p.name === 'David Coleman' && p.id !== profile.id)[0]
  }, [data, profile])

  const otherColemanSlug = useMemo(() => {
    if (!otherDavidColeman || !slugSets) return ''
    return slugSets.profileIdToSlug.get(otherDavidColeman.id) || ''
  }, [otherDavidColeman, slugSets])

  const companySlug = useMemo(() => {
    if (!company || !slugSets) return ''
    return slugSets.companyIdToSlug.get(company.id) || ''
  }, [company, slugSets])

  const segmentSlug = useMemo(() => {
    if (!segment || !slugSets) return ''
    return slugSets.segmentIdToSlug.get(segment.id) || ''
  }, [segment, slugSets])

  useEffect(() => {
    if (profile) document.title = `${profile.name} — Profile`
  }, [profile])

  if (loading) return <LoadingSpinner size="lg" />
  if (!data || !profile) return (
    <div className="page container">
      <EmptyState title="Profile not found" description="The profile you're looking for doesn't exist." action={{ label: 'Browse profiles', to: '/profiles' }} />
    </div>
  )

  const needsVerification = profile.company === 'Needs verification'

  return (
    <ErrorBoundary>
      <div className="page">
        <div className="container">
          <Breadcrumb crumbs={[
            { label: 'Home', to: '/' },
            { label: 'Profiles', to: '/profiles' },
            { label: profile.name },
          ]} />

          {otherDavidColeman && (
            <div className="card mb-2" style={{ background: '#e0e7ff', borderColor: '#6366f1' }}>
              <p className="text-sm">
                Note: Another profile with the same name ('David Coleman') exists at{' '}
                <strong>{otherDavidColeman.company}</strong>.
                Both records are retained pending manual review.
                {otherColemanSlug && (
                  <span> <Link to={`/profiles/${otherColemanSlug}`}>View other profile →</Link></span>
                )}
              </p>
            </div>
          )}

          <div className="card mb-3">
            <div className="flex items-center gap-2 mb-1">
              <h1>{profile.name}</h1>
              <Badge text={profile.confidence} variant="confidence" confidence={profile.confidence} />
              {shortlistEntry && (
                <Badge text={`#${shortlistEntry.Rank}`} variant="priority" priority="P1" />
              )}
            </div>

            <div className="grid grid-2 mt-2" style={{ gap: '1rem' }}>
              <div>
                <div className="text-secondary text-sm">Company</div>
                <div>
                  {needsVerification ? (
                    <Link to="/profiles?needs_verification=true">
                      <Badge text="Needs verification" variant="verification" />
                    </Link>
                  ) : companySlug ? (
                    <Link to={`/companies/${companySlug}`}>{profile.company}</Link>
                  ) : (
                    profile.company
                  )}
                </div>
              </div>
              <div>
                <div className="text-secondary text-sm">Title</div>
                <div>{profile.title}</div>
              </div>
              <div>
                <div className="text-secondary text-sm">Location</div>
                <div>{profile.location}</div>
              </div>
              <div>
                <div className="text-secondary text-sm">Segment</div>
                <div>{segmentSlug ? <Link to={`/segments/${segmentSlug}`}>{profile.segment}</Link> : profile.segment}</div>
              </div>
              <div>
                <div className="text-secondary text-sm">Function</div>
                <div>{profile.function}</div>
              </div>
              <div>
                <div className="text-secondary text-sm">Specialism</div>
                <div>{profile.specialism}</div>
              </div>
              <div>
                <div className="text-secondary text-sm">Category</div>
                <div>{profile.category}</div>
              </div>
              <div>
                <div className="text-secondary text-sm">Seniority</div>
                <div>{profile.seniority}</div>
              </div>
              <div>
                <div className="text-secondary text-sm">Fit Score</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.25rem' }}>{profile.fit_score}/10</span>
                  <div style={{ width: 100, height: 8, background: '#e5e7eb', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${profile.fit_score * 10}%`, height: '100%', background: '#1a56db', borderRadius: 4 }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-2 flex gap-2 flex-wrap">
              {profile.linkedin_url && profile.linkedin_url !== '#' && (
                <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="btn">
                  <ExternalLink size={16} /> LinkedIn Profile
                </a>
              )}
              {profile.source_url && profile.source_url !== '#' && profile.source_url !== profile.linkedin_url && (
                <a href={profile.source_url} target="_blank" rel="noopener noreferrer" className="btn">
                  <ExternalLink size={16} /> Source
                </a>
              )}
            </div>
          </div>

          {profile.evidence && (
            <div className="card mb-2">
              <h3 className="mb-1">Evidence</h3>
              <p className="text-sm">{profile.evidence}</p>
            </div>
          )}

          {profile.notes && profile.notes.trim() && (
            <div className="card mb-2">
              <h3 className="mb-1">Notes</h3>
              <p className="text-sm">{profile.notes}</p>
            </div>
          )}

          {shortlistEntry && (
            <div className="card mb-2" style={{ borderColor: '#f59e0b' }}>
              <h3 className="mb-1">Priority Shortlist — Rank #{shortlistEntry.Rank}</h3>
              <p className="text-sm"><strong>Why Strong Fit:</strong> {shortlistEntry['Why Strong Fit']}</p>
              <p className="text-sm mt-1"><strong>Recruitment Priority:</strong> {shortlistEntry['Recruitment Priority']}</p>
            </div>
          )}

          {otherDavidColeman && otherColemanSlug && (
            <div className="mt-2">
              <Button variant="secondary" to={`/profiles/${otherColemanSlug}`}>
                <ArrowLeft size={16} /> View other David Coleman profile
              </Button>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}
