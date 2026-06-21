import { useMemo, useEffect, useRef } from 'react'

import { useSearchParams } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { buildSlugSets, searchProfiles, createSearchIndex, filterProfiles } from '../data'
import type { Profile, FilterOptions } from '../data'
import { ProfileCard } from '../components/ui/ProfileCard'
import { SearchBar } from '../components/ui/SearchBar'
import { Pagination } from '../components/ui/Pagination'
import { Breadcrumb } from '../components/ui/Breadcrumb'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorBoundary } from '../components/ui/ErrorBoundary'

export function ProfileDirectory() {
  const { data, loading } = useData()
  const [searchParams, setSearchParams] = useSearchParams()
  const fuseRef = useRef<ReturnType<typeof createSearchIndex> | null>(null)

  useEffect(() => { document.title = 'All Profiles'; }, [])

  const slugSets = useMemo(() => {
    if (!data) return null
    return buildSlugSets(data)
  }, [data])

  const query = searchParams.get('q') || ''
  const segmentFilter = searchParams.get('segment') || ''
  const companyFilter = searchParams.get('company') || ''
  const confidenceFilter = searchParams.get('confidence') || ''
  const seniorityFilter = searchParams.get('seniority') || ''
  const needsVerification = searchParams.get('needs_verification') === 'true'
  const sort = searchParams.get('sort') || 'fit_score'
  const order = searchParams.get('order') || 'desc'
  const page = parseInt(searchParams.get('page') || '1', 10)
  const pageSize = 20

  useEffect(() => {
    if (data && !fuseRef.current) {
      fuseRef.current = createSearchIndex(data.profiles)
    }
  }, [data])

  const filters: FilterOptions = useMemo(() => ({
    query: query || undefined,
    segment: segmentFilter || undefined,
    company: companyFilter || undefined,
    confidence: (confidenceFilter as any) || undefined,
    seniority: seniorityFilter || undefined,
    needsVerification: needsVerification || undefined,
  }), [query, segmentFilter, companyFilter, confidenceFilter, seniorityFilter, needsVerification])

  const filteredProfiles = useMemo(() => {
    if (!data) return []

    let results: Profile[]
    if (fuseRef.current && query) {
      results = searchProfiles(fuseRef.current, query, filters)
    } else {
      results = filterProfiles(data.profiles, filters)
    }

    if (!query && !segmentFilter && !companyFilter && !confidenceFilter && !seniorityFilter && !needsVerification) {
      results = [...data.profiles]
    }

    results.sort((a, b) => {
      let cmp = 0
      if (sort === 'fit_score') cmp = a.fit_score - b.fit_score
      else if (sort === 'name') cmp = a.name.localeCompare(b.name)
      else if (sort === 'company') cmp = a.company.localeCompare(b.company)
      return order === 'desc' ? -cmp : cmp
    })

    return results
  }, [data, query, filters, sort, order, segmentFilter, companyFilter, confidenceFilter, seniorityFilter, needsVerification])

  const totalPages = Math.max(1, Math.ceil(filteredProfiles.length / pageSize))
  const paginated = filteredProfiles.slice((page - 1) * pageSize, page * pageSize)

  const segmentOptions = useMemo(() => {
    if (!data) return []
    return [...new Set(data.profiles.map(p => p.segment))].sort().map(s => ({ value: s, label: s }))
  }, [data])

  const companyOptions = useMemo(() => {
    if (!data) return []
    return [...new Set(data.profiles.map(p => p.company))].sort().map(s => ({ value: s, label: s }))
  }, [data])

  if (loading) return <LoadingSpinner size="lg" />
  if (!data) return null

  return (
    <ErrorBoundary>
      <div className="page">
        <div className="container">
          <Breadcrumb crumbs={[{ label: 'Home', to: '/' }, { label: 'Profiles' }]} />

          <div className="flex items-center justify-between mb-2">
            <h1>Profiles ({filteredProfiles.length})</h1>
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
              placeholder="Search profiles..."
            />
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
              {segmentOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <select
              value={confidenceFilter}
              onChange={e => {
                setSearchParams(prev => {
                  const next = new URLSearchParams(prev)
                  if (e.target.value) next.set('confidence', e.target.value); else next.delete('confidence')
                  next.delete('page')
                  return next
                })
              }}
              aria-label="Filter by confidence"
              style={{ padding: '0.375rem 0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}
            >
              <option value="">All Confidence</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
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
              style={{ padding: '0.375rem 0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}
            >
              <option value="">All Seniority</option>
              {[...new Set(data.profiles.map(p => p.seniority))].sort().map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select
              value={`${sort}-${order}`}
              onChange={e => {
                const [s, o] = e.target.value.split('-')
                setSearchParams(prev => { const n = new URLSearchParams(prev); n.set('sort', s); n.set('order', o); return n })
              }}
              aria-label="Sort"
              style={{ padding: '0.375rem 0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}
            >
              <option value="fit_score-desc">Fit Score (high)</option>
              <option value="fit_score-asc">Fit Score (low)</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="company-asc">Company A-Z</option>
            </select>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={needsVerification}
                onChange={e => {
                  setSearchParams(prev => {
                    const next = new URLSearchParams(prev)
                    if (e.target.checked) next.set('needs_verification', 'true'); else next.delete('needs_verification')
                    next.delete('page')
                    return next
                  })
                }}
              />
              Needs verification
            </label>
          </div>

          {paginated.length === 0 ? (
            <EmptyState
              title="No profiles found"
              description={query ? `No profiles matching "${query}"` : 'No profiles match your filters'}
              action={query ? { label: 'Clear search', to: '/profiles' } : undefined}
            />
          ) : (
            <>
              <div className="grid grid-2">
                {paginated.map(p => {
                  const pSlug = slugSets ? [...slugSets.profileSlugs.entries()].find(([, id]) => id === p.id)?.[0] : undefined
                  return <ProfileCard key={p.id} profile={p} profileSlug={pSlug} />
                })}
              </div>
              <Pagination
                page={page}
                totalPages={totalPages}
                total={filteredProfiles.length}
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
