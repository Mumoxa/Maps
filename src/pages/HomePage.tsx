import { useMemo, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Map, Users, Building2, Layers, ListOrdered, Search, Database, ShieldCheck } from 'lucide-react'
import { useData } from '../context/DataContext'
import { StatCard } from '../components/ui/StatCard'
import { ProfileCard } from '../components/ui/ProfileCard'
import { SearchBar } from '../components/ui/SearchBar'
import { Button } from '../components/ui/Button'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { ErrorBoundary } from '../components/ui/ErrorBoundary'
import { buildSlugSets } from '../data'
import { platformConfig, liveMarketArea } from '../config/marketConfig'

export function HomePage() {
  const { data, loading, error } = useData()
  const navigate = useNavigate()

  useEffect(() => { document.title = platformConfig.platformName }, [])

  const slugSets = useMemo(() => {
    if (!data?.profiles) return null
    return buildSlugSets(data)
  }, [data])

  const topSegments = useMemo(() => {
    if (!data?.profiles) return []
    const countMap: Record<string, number> = {}
    for (const p of data.profiles) {
      countMap[p.segment] = (countMap[p.segment] || 0) + 1
    }
    return Object.entries(countMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }, [data])

  const topShortlist = useMemo(() => {
    if (!data?.shortlist) return []
    return data.shortlist.slice(0, 5)
  }, [data])

  if (loading) return <LoadingSpinner size="lg" />
  if (error) return <div className="page container"><p>Error: {error}</p></div>
  if (!data) return null

  const handleSearch = (val: string) => {
    if (val.trim()) navigate(`/profiles?q=${encodeURIComponent(val.trim())}`)
  }

  return (
    <ErrorBoundary>
      <div className="page">
        <div className="container">
          <div className="hero">
            <h1>{platformConfig.platformName}</h1>
            <p>{platformConfig.tagline}</p>
            <div className="flex flex-wrap gap-2" style={{ justifyContent: 'center' }}>
              <Button variant="primary" to="/map">
                <Map size={18} /> Open {liveMarketArea.name}
              </Button>
              <Button variant="secondary" to="/companies">
                <Building2 size={18} /> Explore by Company
              </Button>
            </div>
          </div>


          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <h2>Explore by Scarce Skill Area</h2>
              <span className="text-sm text-secondary">Live map plus planned expansion areas</span>
            </div>
            <div className="grid grid-4">
              {platformConfig.marketAreas.map(area => (
                <div key={area.id} className="card">
                  <div className="flex items-center justify-between mb-1">
                    <h3>{area.name}</h3>
                    <span className={`status-pill status-${area.status}`}>{area.status}</span>
                  </div>
                  <p className="text-sm text-secondary mb-2">{area.summary}</p>
                  {area.status === 'live' ? (
                    <Button variant="ghost" to="/map">Open live speciality map →</Button>
                  ) : (
                    <p className="text-sm"><ShieldCheck size={14} style={{ display: 'inline', marginRight: 4 }} /> Planned — no live data claimed yet.</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <h2 className="mb-2">Company Universe Structure</h2>
            <div className="grid grid-3">
              {platformConfig.companyGroups.map(group => (
                <div key={group.id} className="card">
                  <h3>{group.name}</h3>
                  <p className="text-sm text-secondary">{group.summary}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card mb-3">
            <div className="flex items-center gap-2 mb-1">
              <Database size={22} color="#1a56db" />
              <h2>Repeatable Data-Pack Rules</h2>
            </div>
            <p className="text-sm text-secondary mb-2">Every future speciality map will use the same contract so XLS/XLSX imports can scale cleanly.</p>
            <div className="flex flex-wrap gap-1">
              {platformConfig.dataPackContract.requiredFiles.map(file => <span key={file} className="data-chip">{file}</span>)}
            </div>
          </div>

          <div className="stats-bar">
            <StatCard value={data.summary.total_profiles} label="Profiles" color="#1a56db" />
            <StatCard value={data.companies.length} label="Companies" color="#10b981" />
            <StatCard value={data.segments.length} label="Credit-risk segments" color="#f59e0b" />
            <StatCard value={data.summary.avg_fit_score} label="Avg Fit Score" color="#8b5cf6" />
          </div>

          <div className="mb-3">
            <h2 className="mb-2">Search</h2>
            <SearchBar
              placeholder="Search profiles, companies, segments..."
              onSearch={handleSearch}
              value=""
              global
            />
          </div>

          <div className="mb-3">
            <h2 className="mb-2">Current Live Map: Credit Risk Segments by Profile Count</h2>
            <div className="bar-chart">
              {topSegments.map((seg, i) => {
                const maxCount = topSegments[0]?.count || 1
                const widthPct = Math.max(5, (seg.count / maxCount) * 100)
                return (
                  <div key={i} className="bar-row">
                    <div className="bar-label">
                      <Link to={`/segments/${slugSets ? [...slugSets.segmentSlugs.entries()].find(([,id]) => id === data.segments.find(s => s.name === seg.name)?.id)?.[0] || '' : ''}`}>
                        {seg.name}
                      </Link>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${widthPct}%` }} />
                    </div>
                    <div className="bar-count">{seg.count}</div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <h2>Priority Shortlist — Top 5</h2>
              <Button variant="ghost" to="/shortlist">View all 50 →</Button>
            </div>
            <div className="grid grid-2">
              {topShortlist.map((entry, i) => {
                const profile = data.profiles.find(p => p.name === entry['Full Name'])
                const slug = profile && slugSets ? [...slugSets.profileSlugs.entries()].find(([,id]) => id === profile.id)?.[0] : undefined
                return (
                  <ProfileCard
                    key={i}
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
          </div>

          <div>
            <h2 className="mb-2">Quick Links</h2>
            <div className="grid grid-4">
              <Link to="/map" className="card card-hover" style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center', padding: '2rem 1rem' }}>
                <Map size={32} style={{ margin: '0 auto 0.5rem', color: '#1a56db' }} />
                <div style={{ fontWeight: 600 }}>Interactive Map</div>
                <div className="text-sm text-secondary">Live Credit Risk speciality map</div>
              </Link>
              <Link to="/segments" className="card card-hover" style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center', padding: '2rem 1rem' }}>
                <Layers size={32} style={{ margin: '0 auto 0.5rem', color: '#10b981' }} />
                <div style={{ fontWeight: 600 }}>Segments</div>
                <div className="text-sm text-secondary">{data.segments.length} industry segments</div>
              </Link>
              <Link to="/companies" className="card card-hover" style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center', padding: '2rem 1rem' }}>
                <Building2 size={32} style={{ margin: '0 auto 0.5rem', color: '#f59e0b' }} />
                <div style={{ fontWeight: 600 }}>Companies</div>
                <div className="text-sm text-secondary">{data.companies.length} companies</div>
              </Link>
              <Link to="/profiles" className="card card-hover" style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center', padding: '2rem 1rem' }}>
                <Users size={32} style={{ margin: '0 auto 0.5rem', color: '#8b5cf6' }} />
                <div style={{ fontWeight: 600 }}>Profiles</div>
                <div className="text-sm text-secondary">{data.profiles.length} professionals</div>
              </Link>
              <Link to="/shortlist" className="card card-hover" style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center', padding: '2rem 1rem' }}>
                <ListOrdered size={32} style={{ margin: '0 auto 0.5rem', color: '#ef4444' }} />
                <div style={{ fontWeight: 600 }}>Shortlist</div>
                <div className="text-sm text-secondary">Top 50 priority candidates</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
