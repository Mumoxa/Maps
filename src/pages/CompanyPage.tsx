import { useMemo, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'
import { useData } from '../context/DataContext'
import { buildSlugSets, getProfilesByCompany, getSegmentsByCompany, getUnverifiedProfilesByCompany } from '../data'
import { ProfileCard } from '../components/ui/ProfileCard'
import { Badge } from '../components/ui/Badge'
import { Breadcrumb } from '../components/ui/Breadcrumb'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
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
    if (company) document.title = `${company.name} — Company`
  }, [company])

  if (loading) return <LoadingSpinner size="lg" />
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

          <div className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <h1>{company.name}</h1>
              <Badge text={company.priority} variant="priority" priority={company.priority} />
            </div>
            <p className="text-secondary">
              {segments.map(s => s.name).join(', ')} · {profiles.length} profiles
            </p>
            {company.website && (
              <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm mt-1">
                <ExternalLink size={14} /> {company.website}
              </a>
            )}
          </div>

          {company.relevance && (
            <div className="card mb-2">
              <h3 className="mb-1">Relevance</h3>
              <p className="text-sm">{company.relevance}</p>
            </div>
          )}

          {company.risk_teams && (
            <div className="card mb-3">
              <h3 className="mb-1">Risk Teams</h3>
              <p className="text-sm">{company.risk_teams}</p>
            </div>
          )}

          <div>
            <h2 className="mb-2">Profiles</h2>
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
          </div>

          {unverifiedProfiles.length > 0 && (
            <div className="mt-3">
              <h2 className="mb-2">Unverified Profiles</h2>
              <p className="text-sm text-secondary mb-2">
                These profiles are associated with {company.name} via segment match but have "Needs verification" as their company field.
              </p>
              <div className="grid grid-2">
                {unverifiedProfiles.map(p => {
                  const pSlug = slugSets ? slugSets.profileIdToSlug.get(p.id) : undefined
                  return <ProfileCard key={p.id} profile={p} profileSlug={pSlug} />
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}
