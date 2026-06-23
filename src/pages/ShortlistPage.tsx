import { useMemo, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { buildSlugSets, getShortlistRanked } from '../data'
import { Badge } from '../components/ui/Badge'
import { SearchBar } from '../components/ui/SearchBar'
import { Pagination } from '../components/ui/Pagination'
import { Breadcrumb } from '../components/ui/Breadcrumb'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorBoundary } from '../components/ui/ErrorBoundary'

export function ShortlistPage() {
  const { data, loading } = useData()
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => { document.title = 'Priority Shortlist'; }, [])

  const slugSets = useMemo(() => {
    if (!data) return null
    return buildSlugSets(data)
  }, [data])

  const query = searchParams.get('q') || ''
  const priorityFilter = searchParams.get('priority') || ''
  const seniorityFilter = searchParams.get('seniority') || ''
  const sort = searchParams.get('sort') || 'rank'
  const order = searchParams.get('order') || 'asc'
  const page = parseInt(searchParams.get('page') || '1', 10)
  const pageSize = 25

  const entries = useMemo(() => {
    if (!data) return []
    let result = getShortlistRanked(data.shortlist)
    if (query) {
      const q = query.toLowerCase()
      result = result.filter(e =>
        e['Full Name'].toLowerCase().includes(q) ||
        e['Current Company'].toLowerCase().includes(q) ||
        e.Title.toLowerCase().includes(q)
      )
    }
    if (priorityFilter) {
      const p = priorityFilter === 'P1' ? 'P1' : priorityFilter === 'P2' ? 'P2' : 'P3'
      result = result.filter(e => e['Recruitment Priority']?.startsWith(p))
    }
    if (seniorityFilter) {
      result = result.filter(e => e.Seniority === seniorityFilter)
    }
    const nameToFitScore = new Map<string, number>()
    for (const p of data.profiles) {
      if (!nameToFitScore.has(p.name)) nameToFitScore.set(p.name, p.fit_score)
    }
    result.sort((a, b) => {
      let cmp = 0
      if (sort === 'rank') cmp = parseInt(a.Rank) - parseInt(b.Rank)
      else if (sort === 'fit_score') {
        cmp = (nameToFitScore.get(a['Full Name']) || 0) - (nameToFitScore.get(b['Full Name']) || 0)
      }
      return order === 'desc' ? -cmp : cmp
    })
    return result
  }, [data, query, priorityFilter, seniorityFilter, sort, order])

  const totalPages = Math.max(1, Math.ceil(entries.length / pageSize))
  const paginated = entries.slice((page - 1) * pageSize, page * pageSize)

  const seniorityOptions = useMemo(() => {
    if (!data) return []
    return [...new Set(data.shortlist.map(e => e.Seniority))].sort()
  }, [data])

  const priorityCounts = useMemo(() => {
    if (!data) return { P1: 0, P2: 0, P3: 0 }
    const counts = { P1: 0, P2: 0, P3: 0 }
    for (const e of data.shortlist) {
      if (e['Recruitment Priority']?.startsWith('P1')) counts.P1++
      else if (e['Recruitment Priority']?.startsWith('P2')) counts.P2++
      else if (e['Recruitment Priority']?.startsWith('P3')) counts.P3++
    }
    return counts
  }, [data])

  if (loading) return <LoadingSpinner size="lg" />
  if (!data) return null

  const profileNameToId = new Map<string, string>()
  for (const p of data.profiles) {
    if (!profileNameToId.has(p.name)) profileNameToId.set(p.name, p.id)
  }

  const getProfileSlug = (name: string): string | undefined => {
    if (!slugSets) return undefined
    const id = profileNameToId.get(name)
    if (!id) return undefined
    return slugSets.profileIdToSlug.get(id)
  }

  return (
    <ErrorBoundary>
      <div className="page">
        <div className="container">
          <Breadcrumb crumbs={[{ label: 'Home', to: '/' }, { label: 'Shortlist' }]} />

          <div className="flex items-center justify-between mb-2">
            <h1>Priority Shortlist ({entries.length})</h1>
          </div>

          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <SearchBar
              value={query}
              onChange={(val) => {
                setSearchParams(prev => {
                  const next = new URLSearchParams(prev)
                  if (val) next.set('q', val); else next.delete('q')
                  next.delete('page')
                  return next
                })
              }}
              placeholder="Search shortlist..."
            />
            <select
              value={priorityFilter}
              onChange={e => {
                setSearchParams(prev => {
                  const next = new URLSearchParams(prev)
                  if (e.target.value) next.set('priority', e.target.value); else next.delete('priority')
                  next.delete('page')
                  return next
                })
              }}
              aria-label="Filter by priority"
              className="filter-select"
            >
              <option value="">All Priority</option>
              <option value="P1">P1 ({priorityCounts.P1})</option>
              <option value="P2">P2 ({priorityCounts.P2})</option>
              <option value="P3">P3 ({priorityCounts.P3})</option>
            </select>
            <select
              value={seniorityFilter}
              onChange={e => {
                setSearchParams(prev => {
                  const next = new URLSearchParams(prev)
                  if (e.target.value) next.set('seniority', e.target.value); else next.delete('seniority')
                  next.delete('page')
                  return next
                })
              }}
              aria-label="Filter by seniority"
              className="filter-select"
            >
              <option value="">All Seniority</option>
              {seniorityOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select
              value={`${sort}-${order}`}
              onChange={e => {
                const [s, o] = e.target.value.split('-')
                setSearchParams(prev => { const n = new URLSearchParams(prev); n.set('sort', s); n.set('order', o); return n })
              }}
              aria-label="Sort"
              className="filter-select"
            >
              <option value="rank-asc">Rank 1-50</option>
              <option value="rank-desc">Rank 50-1</option>
              <option value="fit_score-desc">Fit Score (high)</option>
              <option value="fit_score-asc">Fit Score (low)</option>
            </select>
          </div>

          {paginated.length === 0 ? (
            <EmptyState
              title="No entries found"
              description={query ? `No entries matching "${query}"` : 'No entries match your filters'}
              action={query ? { label: 'Clear search', to: '/shortlist' } : undefined}
            />
          ) : (
            <>
              <div className="shortlist-table-wrap">
                <table className="shortlist-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Name</th>
                      <th>Company</th>
                      <th>Title</th>
                      <th>Priority</th>
                      <th>Specialism</th>
                      <th>Seniority</th>
                      <th>Why Strong Fit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map(e => {
                      const pSlug = getProfileSlug(e['Full Name'])
                      const priority = e['Recruitment Priority']?.startsWith('P1') ? 'P1' as const
                        : e['Recruitment Priority']?.startsWith('P2') ? 'P2' as const
                        : 'P3' as const
                      return (
                        <tr key={e.Rank}>
                          <td className="shortlist-rank">#{e.Rank}</td>
                          <td>
                            {pSlug ? (
                              <Link to={`/profiles/${pSlug}`}>{e['Full Name']}</Link>
                            ) : (
                              e['Full Name']
                            )}
                          </td>
                          <td>{e['Current Company']}</td>
                          <td className="shortlist-title truncate">{e.Title}</td>
                          <td><Badge text={priority} variant="priority" priority={priority} /></td>
                          <td className="shortlist-specialism truncate">{e['Credit Risk Specialism']}</td>
                          <td>{e.Seniority}</td>
                          <td className="shortlist-why">
                            {e['Why Strong Fit']}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <Pagination
                page={page}
                totalPages={totalPages}
                total={entries.length}
                onChange={p => {
                  setSearchParams(prev => { const n = new URLSearchParams(prev); n.set('page', String(p)); return n })
                }}
              />
            </>
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}
