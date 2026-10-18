import { useMemo, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  MapTrifold as MapIcon,
  Users,
  Buildings,
  Stack,
  ListNumbers,
} from '@phosphor-icons/react'
import { useData } from '../context/DataContext'
import { StatCard } from '../components/ui/StatCard'
import { ProfileCard } from '../components/ui/ProfileCard'
import { SearchBar } from '../components/ui/SearchBar'
import { Button } from '../components/ui/Button'
import { SkeletonPage } from '../components/ui/LoadingSpinner'
import { ErrorBoundary } from '../components/ui/ErrorBoundary'
import { buildSlugSets } from '../data'

export function CreditRiskPage() {
  const { data, loading, error } = useData()
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'SA Talent Map | Credit Risk'
  }, [])

  const slugSets = useMemo(() => {
    if (!data?.profiles) return null
    return buildSlugSets(data)
  }, [data])

  const segmentNameToId = useMemo(() => {
    if (!data?.segments) return new Map<string, string>()
    const map = new Map<string, string>()
    for (const segment of data.segments) {
      map.set(segment.name, segment.id)
    }
    return map
  }, [data])

  const topSegments = useMemo(() => {
    if (!data?.profiles) return []
    const countMap: Record<string, number> = {}
    for (const profile of data.profiles) {
      countMap[profile.segment] = (countMap[profile.segment] || 0) + 1
    }
    return Object.entries(countMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }, [data])

  const profileByName = useMemo(() => {
    if (!data?.profiles) return new Map<string, (typeof data.profiles)[number]>()
    const map = new Map<string, (typeof data.profiles)[number]>()
    for (const profile of data.profiles) {
      map.set(profile.name, profile)
    }
    return map
  }, [data])

  const topShortlist = useMemo(() => {
    if (!data?.shortlist) return []
    return data.shortlist.slice(0, 5)
  }, [data])

  if (loading) return <SkeletonPage variant="grid" cards={4} />
  if (error) return <div className="page container"><p>Error: {error}</p></div>
  if (!data) return null

  const handleSearch = (value: string) => {
    if (value.trim()) navigate(`/profiles?q=${encodeURIComponent(value.trim())}`)
  }

  return (
    <ErrorBoundary>
      <div className="page">
        <div className="container">
          <div className="page-head">
            <div>
              <h1>Credit risk market map</h1>
              <p>
                The reference track in SA Talent Map: {data.summary.total_profiles.toLocaleString()} mapped
                professionals, {data.companies.length.toLocaleString()} companies and{' '}
                {data.segments.length.toLocaleString()} segments, with a ranked shortlist.
              </p>
            </div>
            <div className="page-head-aside">
              <Button variant="primary" to="/map">
                <MapIcon size={17} aria-hidden /> Open the map
              </Button>
            </div>
          </div>

          <div className="stats-bar">
            <StatCard value={data.summary.total_profiles} label="Mapped profiles" />
            <StatCard value={data.companies.length} label="Companies" />
            <StatCard value={data.segments.length} label="Segments" />
            <StatCard value={data.summary.avg_fit_score} label="Average fit score" />
          </div>

          <section className="section-block">
            <h2 className="mb-2">Search the track</h2>
            <SearchBar
              placeholder="Search profiles, companies, segments..."
              onSearch={handleSearch}
              value=""
              global
            />
          </section>

          <section className="section-block">
            <h2 className="mb-2">Largest segments by profile count</h2>
            <div className="bar-chart">
              {topSegments.map((segment) => {
                const maxCount = topSegments[0]?.count || 1
                const widthPct = Math.max(5, (segment.count / maxCount) * 100)
                const segmentId = segmentNameToId.get(segment.name) ?? ''
                const segmentSlug = slugSets?.segmentIdToSlug.get(segmentId) ?? ''

                return (
                  <div key={segment.name} className="bar-row">
                    <div className="bar-label">
                      <Link to={`/segments/${segmentSlug}`}>
                        {segment.name}
                      </Link>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${widthPct}%` }} />
                    </div>
                    <div className="bar-count">{segment.count}</div>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="section-block">
            <div className="section-head">
              <h2>Priority shortlist</h2>
              <Button variant="ghost" to="/shortlist">View the full shortlist</Button>
            </div>
            <div className="grid grid-2">
              {topShortlist.map((entry, index) => {
                const profile = profileByName.get(entry['Full Name'])
                const slug = profile && slugSets ? slugSets.profileIdToSlug.get(profile.id) : undefined

                return (
                  <ProfileCard
                    key={`${entry['Full Name']}-${index}`}
                    profile={profile || {
                      id: '',
                      name: entry['Full Name'],
                      linkedin_url: entry['LinkedIn URL'],
                      location: '',
                      company: entry['Current Company'],
                      title: entry.Title,
                      seniority: entry.Seniority,
                      function: '',
                      segment: '',
                      specialism: entry['Credit Risk Specialism'],
                      category: '',
                      evidence: '',
                      source_url: '',
                      fit_score: 0,
                      confidence: 'High' as const,
                      notes: '',
                    }}
                    shortlistEntry={entry}
                    profileSlug={slug}
                  />
                )
              })}
            </div>
          </section>

          <section>
            <h2 className="mb-2">Where to go next</h2>
            <div className="grid grid-4">
              <Link to="/map" className="card card-hover quick-link-card">
                <MapIcon size={24} weight="duotone" className="quick-link-icon" aria-hidden />
                <span className="quick-link-title">Interactive map</span>
                <span className="text-sm text-secondary">Explore the ecosystem by segment and company</span>
              </Link>
              <Link to="/segments" className="card card-hover quick-link-card">
                <Stack size={24} weight="duotone" className="quick-link-icon" aria-hidden />
                <span className="quick-link-title">Segments</span>
                <span className="text-sm text-secondary">{data.segments.length} industry segments</span>
              </Link>
              <Link to="/companies" className="card card-hover quick-link-card">
                <Buildings size={24} weight="duotone" className="quick-link-icon" aria-hidden />
                <span className="quick-link-title">Companies</span>
                <span className="text-sm text-secondary">{data.companies.length} mapped employers</span>
              </Link>
              <Link to="/profiles" className="card card-hover quick-link-card">
                <Users size={24} weight="duotone" className="quick-link-icon" aria-hidden />
                <span className="quick-link-title">Candidates</span>
                <span className="text-sm text-secondary">{data.profiles.length} candidate profiles</span>
              </Link>
              <Link to="/shortlist" className="card card-hover quick-link-card">
                <ListNumbers size={24} weight="duotone" className="quick-link-icon" aria-hidden />
                <span className="quick-link-title">Shortlist</span>
                <span className="text-sm text-secondary">Ranked priority candidates</span>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </ErrorBoundary>
  )
}
