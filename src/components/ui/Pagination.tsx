interface PaginationProps {
  page: number
  totalPages: number
  total: number
  onChange: (page: number) => void
}

export function Pagination({ page, totalPages, total, onChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages: number[] = []
  const start = Math.max(1, page - 2)
  const end = Math.min(totalPages, page + 2)
  for (let i = start; i <= end; i++) pages.push(i)

  return (
    <nav className="pagination" aria-label="Pagination">
      <button type="button" disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Previous page">
        Previous
      </button>
      {start > 1 && <button type="button" onClick={() => onChange(1)}>1</button>}
      {start > 2 && <span aria-hidden="true">…</span>}
      {pages.map(p => (
        <button
          key={p}
          type="button"
          className={p === page ? 'active' : ''}
          aria-current={p === page ? 'page' : undefined}
          aria-label={`Page ${p}`}
          onClick={() => onChange(p)}
        >{p}</button>
      ))}
      {end < totalPages - 1 && <span aria-hidden="true">…</span>}
      {end < totalPages && <button type="button" onClick={() => onChange(totalPages)}>{totalPages}</button>}
      <button type="button" disabled={page >= totalPages} onClick={() => onChange(page + 1)} aria-label="Next page">
        Next
      </button>
      <span className="pagination-total">{total.toLocaleString()} total</span>
    </nav>
  )
}
