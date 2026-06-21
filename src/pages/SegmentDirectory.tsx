import { useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { buildSlugSets } from '../data'
import { SegmentCard } from '../components/ui/SegmentCard'
import { SearchBar } from '../components/ui/SearchBar'
import { Pagination } from '../components/ui/Pagination'
import { Breadcrumb } from '../components/ui/Breadcrumb'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorBoundary } from '../components/ui/ErrorBoundary'

export function SegmentDirectory() {
  const { data, loading } = useData()
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => { document.title = 'All Industry Segments'; }, [])

  const slugSets = useMemo(() => {
    if (!data) return null
    return buildSlugSets(data)
  }, [data])

  const query = searchParams.get('q') || ''
  const sort = searchParams.get('sort') || 'name'
  const order = searchParams.get('order') || 'asc'
  const page = parseInt(searchParams.get('page') || '1', 10)
  const pageSize = 24

  const segments = useMemo(() => {
    if (!data) return []
    let result = data.segments.map(s => ({
      ...s,
      profileCount: data.profiles.filter(p => p.segment === s.name).length,
    }))
    if (query) {
      const q = query.toLowerCase()
      result = result.filter(s => s.name.toLowerCase().includes(q))
    }
    result.sort((a, b) => {
      let cmp = 0
      if (sort === 'name') cmp = a.name.localeCompare(b.name)
      else if (sort === 'count') cmp = a.profileCount - b.profileCount
      return order === 'desc' ? -cmp : cmp
    })
    return result
  }, [data, query, sort, order])

  const totalPages = Math.max(1, Math.ceil(segments.length / pageSize))
  const paginated = segments.slice((page - 1) * pageSize, page * pageSize)

  if (loading) return <LoadingSpinner size="lg" />
  if (!data) return null

  return (
    <ErrorBoundary>
      <div className="page">
        <div className="container">
          <Breadcrumb crumbs={[{ label: 'Home', to: '/' }, { label: 'Segments' }]} />

          <div className="flex items-center justify-between mb-2">
            <h1>Industry Segments ({segments.length})</h1>
          </div>

          <div className="flex items-center gap-2 mb-2">
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
              placeholder="Search segments..."
            />
            <select
              value={`${sort}-${order}`}
              onChange={e => {
                const [s, o] = e.target.value.split('-')
                setSearchParams(prev => { const n = new URLSearchParams(prev); n.set('sort', s); n.set('order', o); return n })
              }}
              aria-label="Sort"
              style={{ padding: '0.375rem 0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}
            >
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="count-desc">Most profiles</option>
              <option value="count-asc">Least profiles</option>
            </select>
          </div>

          {paginated.length === 0 ? (
            <EmptyState
              title="No segments found"
              description={query ? `No segments matching "${query}"` : 'No segments available'}
              action={query ? { label: 'Clear search', to: '/segments' } : undefined}
            />
          ) : (
            <>
              <div className="grid grid-3">
                {paginated.map(seg => {
                  const slug = slugSets ? [...slugSets.segmentSlugs.entries()].find(([, id]) => id === seg.id)?.[0] : undefined
                  return (
                    <SegmentCard
                      key={seg.id}
                      segment={seg}
                      profileCount={seg.profileCount}
                      slug={slug}
                    />
                  )
                })}
              </div>
              <Pagination page={page} totalPages={totalPages} total={segments.length} onChange={p => {
                setSearchParams(prev => { const n = new URLSearchParams(prev); n.set('page', String(p)); return n })
              }} />
            </>
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}
