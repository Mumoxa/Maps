import { useSearchParams } from 'react-router-dom'
import { useCallback, useMemo } from 'react'
import type { FilterOptions } from '../data'

export function useSearchFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters: FilterOptions = useMemo(() => ({
    query: searchParams.get('q') || undefined,
    segment: searchParams.get('segment') || undefined,
    company: searchParams.get('company') || undefined,
    confidence: (searchParams.get('confidence') as any) || undefined,
    seniority: searchParams.get('seniority') || undefined,
    priority: (searchParams.get('priority') as any) || undefined,
    needsVerification: searchParams.get('needs_verification') === 'true' || undefined,
  }), [searchParams])

  const page = parseInt(searchParams.get('page') || '1', 10)
  const sort = searchParams.get('sort') || undefined
  const order = (searchParams.get('order') || 'desc') as 'asc' | 'desc'

  const setFilter = useCallback((key: string, value: string | null) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (value === null || value === '') {
        next.delete(key)
      } else {
        next.set(key, value)
      }
      if (key !== 'page') next.delete('page')
      return next
    })
  }, [setSearchParams])

  const clearFilters = useCallback(() => {
    setSearchParams({})
  }, [setSearchParams])

  return { filters, page, sort, order, setFilter, clearFilters, searchParams }
}
