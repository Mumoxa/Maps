import { X } from 'lucide-react'

interface FilterOption {
  key: string
  label: string
  options: { value: string; label: string }[]
}

interface FilterBarProps {
  filters: FilterOption[]
  activeFilters: Record<string, string | undefined>
  onChange: (key: string, value: string | null) => void
  onClear: () => void
}

export function FilterBar({ filters, activeFilters, onChange, onClear }: FilterBarProps) {
  const hasActive = Object.values(activeFilters).some(v => v !== undefined)

  return (
    <div className="filter-bar">
      {filters.map(f => (
        <select
          key={f.key}
          value={activeFilters[f.key] || ''}
          onChange={e => onChange(f.key, e.target.value || null)}
          aria-label={f.label}
        >
          <option value="">{f.label}</option>
          {f.options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      ))}
      {Object.entries(activeFilters).map(([key, val]) =>
        val ? (
          <span key={key} className="filter-chip" onClick={() => onChange(key, null)}>
            {key}: {val}
            <X size={12} />
          </span>
        ) : null
      )}
      {hasActive && (
        <button className="btn btn-ghost btn-sm" onClick={onClear}>
          Clear all
        </button>
      )}
    </div>
  )
}
