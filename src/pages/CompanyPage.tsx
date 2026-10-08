import { useMemo, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  ArrowSquareOut,
} from '@phosphor-icons/react'
import { useData } from '../context/DataContext'
import { buildSlugSets, getProfilesByCompany, getSegmentsByCompany, getUnverifiedProfilesByCompany } from '../data'
import { ProfileCard } from '../components/ui/ProfileCard'
import { Badge } from '../components/ui/Badge'
import { Breadcrumb } from '../components/ui/Breadcrumb'
import { SkeletonPage } from '../components/ui/LoadingSpinner'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorBoundary } from '../components/ui/ErrorBoundary'

export function CompanyPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data, loading } = useData()

  const slugSets = useMemo(() => {
    if (!data) return null
    return buildSlugSets(data)
  }, [data])

  const company = useMemo(() => {
    if (!data || !slugSets || !slug) return undefined
    const id = slugSets.companySlugs.get(slug)
    if (!id) return undefined
    return data.companies.find(c => c.id === id)
  }, [data, slugSets, slug])

  const profiles = useMemo(() => {
    if (!data || !company) return []
    return getProfilesByCompany(data, company.name)
  }, [data, company])

  const segments = useMemo(() => {
    if (!data || !company) return []
    return getSegmentsByCompany(data, company)
  }, [data, company])

  const unverifiedProfiles = useMemo(() => {
    if (!data || !company) return []
    return getUnverifiedProfilesByCompany(data, company.name)
  }, [data, company])

  useEffect(() => {
    if (company) document.title = `${company.name} · Company`
  }, [company])

  if (loading) return <SkeletonPage variant="detail" />
  if (!data || !company) return (
    <div className="page container">
      <EmptyState title="Company not found" description="The company you're looking for doesn't exist." action={{ label: 'Browse companies', to: '/companies' }} />
    </div>
  )

  return (
    <ErrorBoundary>
      <div className="page">
        <div className="container">
          <Breadcrumb crumbs={[
            { label: 'Home', to: '/' },
            { label: 'Companies', to: '/companies' },
            { label: company.name },
          ]} />

          <div className="page-head">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h1>{company.name}</h1>
                <Badge text={company.priority} variant="priority" priority={company.priority} />
              </div>
              <p>
                {segments.map(s => s.name).join(', ')} · {profiles.length} {profiles.length === 1 ? 'profile' : 'profiles'} mapped
              </p>
            </div>
            <div className="page-head-aside">
              {company.website && (
                <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm">
                  <ArrowSquareOut size={14} aria-hidden /> {company.website}
                </a>
              )}
            </div>
          </div>

          {(company.relevance || company.risk_teams) && (
            <div className="grid grid-2 section-block">
              {company.relevance && (
                <section className="card">
                  <h2 className="text-sm mb-1">Why this company matters</h2>
                  <p className="text-sm text-secondary">{company.relevance}</p>
                </section>
              )}
              {company.risk_teams && (
                <section className="card">
                  <h2 className="text-sm mb-1">Risk teams on record</h2>
                  <p className="text-sm text-secondary">{company.risk_teams}</p>
                </section>
              )}
            </div>
          )}

          <section>
            <h2 className="mb-2">Mapped profiles</h2>
            {profiles.length === 0 ? (
              <EmptyState title="No profiles" description="No profiles currently mapped to this company." />
            ) : (
              <div className="grid grid-2">
                {profiles.map(p => {
                  const pSlug = slugSets ? slugSets.profileIdToSlug.get(p.id) : undefined
                  return <ProfileCard key={p.id} profile={p} profileSlug={pSlug} />
                })}
              </div>
            )}
          </section>

          {unverifiedProfiles.length > 0 && (
            <section className="section-block">
              <h2 className="mb-2">Unverified profiles</h2>
              <p className="text-sm text-secondary mb-2">
                These profiles are associated with {company.name} via segment match but have "Needs verification" as their company field.
              </p>
              <div className="grid grid-2">
                {unverifiedProfiles.map(p => {
                  const pSlug = slugSets ? slugSets.profileIdToSlug.get(p.id) : undefined
                  return <ProfileCard key={p.id} profile={p} profileSlug={pSlug} />
                })}
              </div>
            </section>
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}
