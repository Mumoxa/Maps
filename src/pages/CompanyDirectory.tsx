import { useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { buildSlugSets, normalizeCompanyName, normalizeSegmentName } from '../data'
import { CompanyCard } from '../components/ui/CompanyCard'
import { SearchBar } from '../components/ui/SearchBar'
import { Pagination } from '../components/ui/Pagination'
import { Breadcrumb } from '../components/ui/Breadcrumb'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorBoundary } from '../components/ui/ErrorBoundary'

export function CompanyDirectory() {
  const { data, loading } = useData()
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => { document.title = 'All Companies'; }, [])

  const slugSets = useMemo(() => {
    if (!data) return null
    return buildSlugSets(data)
  }, [data])

  const query = searchParams.get('q') || ''
  const priorityFilter = searchParams.get('priority') || ''
  const segmentFilter = searchParams.get('segment') || ''
  const page = parseInt(searchParams.get('page') || '1', 10)
  const pageSize = 24

  const companies = useMemo(() => {
    if (!data) return []
    let result = data.companies.map(c => ({
      ...c,
      profileCount: data.profiles.filter(p => {
        if (p.company === 'Needs verification') return false
        const pCanon = normalizeCompanyName(p.company, data)
        return pCanon === c.name
      }).length,
    }))
    if (query) {
      const q = query.toLowerCase()
      result = result.filter(c => c.name.toLowerCase().includes(q))
    }
    if (priorityFilter) {
      result = result.filter(c => c.priority === priorityFilter)
    }
    if (segmentFilter) {
      result = result.filter(c => c.segment === segmentFilter)
    }
    result.sort((a, b) => a.name.localeCompare(b.name))
    return result
  }, [data, query, priorityFilter, segmentFilter])

  const totalPages = Math.max(1, Math.ceil(companies.length / pageSize))
  const paginated = companies.slice((page - 1) * pageSize, page * pageSize)

  if (loading) return <LoadingSpinner size="lg" />
  if (!data) return null

  return (
    <ErrorBoundary>
      <div className="page">
        <div className="container">
          <Breadcrumb crumbs={[{ label: 'Home', to: '/' }, { label: 'Companies' }]} />

          <div className="flex items-center justify-between mb-2">
            <h1>Companies ({companies.length})</h1>
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
              placeholder="Search companies..."
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
              style={{ padding: '0.375rem 0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}
            >
              <option value="">All Priorities</option>
              <option value="P1">P1</option>
              <option value="P2">P2</option>
              <option value="P3">P3</option>
            </select>
            <select
              value={segmentFilter}
              onChange={e => {
                setSearchParams(prev => {
                  const next = new URLSearchParams(prev)
                  if (e.target.value) next.set('segment', e.target.value); else next.delete('segment')
                  next.delete('page')
                  return next
                })
              }}
              aria-label="Filter by segment"
              style={{ padding: '0.375rem 0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}
            >
              <option value="">All Segments</option>
              {[...new Set(data.companies.map(c => c.segment))].sort().map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {paginated.length === 0 ? (
            <EmptyState
              title="No companies found"
              description={query ? `No companies matching "${query}"` : 'No companies match your filters'}
              action={query ? { label: 'Clear search', to: '/companies' } : undefined}
            />
          ) : (
            <>
              <div className="grid grid-3">
                {paginated.map(c => {
                  const slug = slugSets ? [...slugSets.companySlugs.entries()].find(([, id]) => id === c.id)?.[0] : undefined
                  return <CompanyCard key={c.id} company={c} profileCount={c.profileCount} slug={slug} />
                })}
              </div>
              <Pagination page={page} totalPages={totalPages} total={companies.length} onChange={p => {
                setSearchParams(prev => { const n = new URLSearchParams(prev); n.set('page', String(p)); return n })
              }} />
            </>
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}

// normalizeCompanyName imported from data layer
