import { useMemo, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { buildSlugSets, getProfilesBySegment, normalizeCompanyName } from '../data'
import { ProfileCard } from '../components/ui/ProfileCard'
import { Breadcrumb } from '../components/ui/Breadcrumb'
import { Badge } from '../components/ui/Badge'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorBoundary } from '../components/ui/ErrorBoundary'

export function SegmentPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data, loading } = useData()


  const slugSets = useMemo(() => {
    if (!data) return null
    return buildSlugSets(data)
  }, [data])

  const segment = useMemo(() => {
    if (!data || !slugSets || !slug) return undefined
    const id = slugSets.segmentSlugs.get(slug)
    if (!id) return undefined
    return data.segments.find(s => s.id === id)
  }, [data, slugSets, slug])

  const profiles = useMemo(() => {
    if (!data || !segment) return []
    return getProfilesBySegment(data, segment.name)
  }, [data, segment])

  const companyNames = useMemo(() => {
    if (!data || !segment || !slugSets) return []
    const seen = new Set<string>()
    const result: { name: string; slug: string }[] = []
    for (const p of profiles) {
      if (p.company === 'Needs verification') continue
      const canonical = normalizeCompanyName(p.company, data)
      if (!seen.has(canonical)) {
        seen.add(canonical)
        const company = data.companies.find(c => c.name === canonical)
        if (company) {
          const companySlug = [...slugSets.companySlugs.entries()].find(([, id]) => id === company.id)?.[0]
          if (companySlug) result.push({ name: canonical, slug: companySlug })
        }
      }
    }
    return result
  }, [data, segment, profiles, slugSets])

  useEffect(() => {
    if (segment) document.title = `${segment.name} — Industry Segment`
  }, [segment])

  if (loading) return <LoadingSpinner size="lg" />
  if (!data || !segment) return (
    <div className="page container">
      <EmptyState title="Segment not found" description="The segment you're looking for doesn't exist." action={{ label: 'Browse segments', to: '/segments' }} />
    </div>
  )

  return (
    <ErrorBoundary>
      <div className="page">
        <div className="container">
          <Breadcrumb crumbs={[
            { label: 'Home', to: '/' },
            { label: 'Segments', to: '/segments' },
            { label: segment.name },
          ]} />

          <div className="mb-3">
            <h1>{segment.name}</h1>
            <p className="text-secondary text-lg mt-1">
              {profiles.length} profiles · {companyNames.length} companies
            </p>
          </div>

          {companyNames.length > 0 && (
            <div className="mb-3">
              <h2 className="mb-2">Companies</h2>
              <div className="flex flex-wrap gap-2">
                {companyNames.map(c => (
                  <Link key={c.slug} to={`/companies/${c.slug}`} className="btn btn-sm">
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="mb-2">Profiles</h2>
            {profiles.length === 0 ? (
              <EmptyState title="No profiles" description="No profiles currently mapped to this segment." />
            ) : (
              <div className="grid grid-2">
                {profiles.map(p => {
                  const slug = slugSets ? [...slugSets.profileSlugs.entries()].find(([, id]) => id === p.id)?.[0] : undefined
                  return <ProfileCard key={p.id} profile={p} profileSlug={slug} />
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
