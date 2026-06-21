import { useMemo } from 'react'

export function usePagination(total: number, pageSize = 20) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return useMemo(() => ({
    totalPages,
    pageSize,
  }), [totalPages, pageSize])
}
