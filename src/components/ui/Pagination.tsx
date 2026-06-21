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
    <div className="pagination">
      <button disabled={page <= 1} onClick={() => onChange(page - 1)}>Previous</button>
      {start > 1 && <button onClick={() => onChange(1)}>1</button>}
      {start > 2 && <span>...</span>}
      {pages.map(p => (
        <button key={p} className={p === page ? 'active' : ''} onClick={() => onChange(p)}>{p}</button>
      ))}
      {end < totalPages - 1 && <span>...</span>}
      {end < totalPages && <button onClick={() => onChange(totalPages)}>{totalPages}</button>}
      <button disabled={page >= totalPages} onClick={() => onChange(page + 1)}>Next</button>
      <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>Total: {total}</span>
    </div>
  )
}
