import { useMemo, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowSquareOut,
  ArrowLeft,
} from '@phosphor-icons/react'
import { useData } from '../context/DataContext'
import { buildSlugSets, getCompanyByProfile, getSegmentByProfile, getShortlistByProfile } from '../data'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Breadcrumb } from '../components/ui/Breadcrumb'
import { SkeletonPage } from '../components/ui/LoadingSpinner'
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
    if (profile) document.title = `${profile.name} · Profile`
  }, [profile])

  if (loading) return <SkeletonPage variant="detail" />
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
            <div className="card mb-2 notice-card">
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

          <div className="detail-layout">
            <div>
              <header className="card mb-2">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h1>{profile.name}</h1>
                  <Badge text={profile.confidence} variant="confidence" confidence={profile.confidence} />
                  {shortlistEntry && (
                    <Badge text={`Rank #${shortlistEntry.Rank}`} variant="priority" priority="P1" />
                  )}
                </div>
                <p className="text-secondary">
                  {profile.title}
                  {profile.company && !needsVerification ? ` at ${profile.company}` : ''}
                  {profile.location ? ` · ${profile.location}` : ''}
                </p>
                <div className="detail-inline-links mt-2">
                  {profile.linkedin_url && profile.linkedin_url !== '#' && (
                    <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="btn btn-sm">
                      <ArrowSquareOut size={15} aria-hidden /> LinkedIn profile
                    </a>
                  )}
                  {profile.source_url && profile.source_url !== '#' && profile.source_url !== profile.linkedin_url && (
                    <a href={profile.source_url} target="_blank" rel="noopener noreferrer" className="btn btn-sm">
                      <ArrowSquareOut size={15} aria-hidden /> Source
                    </a>
                  )}
                </div>
              </header>

              {profile.evidence && (
                <section className="card mb-2">
                  <h3 className="mb-1">Evidence</h3>
                  <p className="text-sm">{profile.evidence}</p>
                </section>
              )}

              {profile.notes && profile.notes.trim() && (
                <section className="card mb-2">
                  <h3 className="mb-1">Notes</h3>
                  <p className="text-sm">{profile.notes}</p>
                </section>
              )}

              {shortlistEntry && (
                <section className="card mb-2 shortlist-highlight-card">
                  <h3 className="mb-1">Priority shortlist, rank #{shortlistEntry.Rank}</h3>
                  <p className="text-sm"><strong>Why strong fit:</strong> {shortlistEntry['Why Strong Fit']}</p>
                  <p className="text-sm mt-1"><strong>Recruitment priority:</strong> {shortlistEntry['Recruitment Priority']}</p>
                </section>
              )}
            </div>

            <aside className="detail-aside">
              <div className="panel">
                <div className="panel-head">
                  <h2 className="text-sm">Record</h2>
                </div>
                <div className="panel-body detail-facts">
                  <div className="detail-fact">
                    <span className="detail-label">Company</span>
                    <span>
                      {needsVerification ? (
                        <Link to="/profiles?needs_verification=true">
                          <Badge text="Needs verification" variant="verification" />
                        </Link>
                      ) : companySlug ? (
                        <Link to={`/companies/${companySlug}`}>{profile.company}</Link>
                      ) : (
                        profile.company
                      )}
                    </span>
                  </div>
                  <div className="detail-fact">
                    <span className="detail-label">Segment</span>
                    <span>{segmentSlug ? <Link to={`/segments/${segmentSlug}`}>{profile.segment}</Link> : profile.segment}</span>
                  </div>
                  <div className="detail-fact">
                    <span className="detail-label">Seniority</span>
                    <span>{profile.seniority}</span>
                  </div>
                  <div className="detail-fact">
                    <span className="detail-label">Function</span>
                    <span>{profile.function}</span>
                  </div>
                  <div className="detail-fact">
                    <span className="detail-label">Specialism</span>
                    <span>{profile.specialism}</span>
                  </div>
                  <div className="detail-fact">
                    <span className="detail-label">Category</span>
                    <span>{profile.category}</span>
                  </div>
                  <div className="detail-fact">
                    <span className="detail-label">Fit score</span>
                    <span className="fit-score">
                      <span className="fit-score-value">{profile.fit_score}/10</span>
                      <span className="fit-score-track">
                        <span className="fit-score-fill" style={{ width: `${profile.fit_score * 10}%` }} />
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </aside>
          </div>

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
