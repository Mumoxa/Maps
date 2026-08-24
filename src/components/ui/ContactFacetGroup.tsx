import { useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import type { ContactFacetOption } from '../../data/contactDirectory'

interface ContactFacetGroupProps {
  label: string
  options: ContactFacetOption[]
  selected: string[]
  onToggle: (value: string) => void
  defaultOpen?: boolean
}

const COLLAPSED_OPTION_COUNT = 12

export function ContactFacetGroup({
  label,
  options,
  selected,
  onToggle,
  defaultOpen = false,
}: ContactFacetGroupProps) {
  const [query, setQuery] = useState('')
  const [showAll, setShowAll] = useState(false)
  const [open, setOpen] = useState(defaultOpen)
  const selectedValues = useMemo(() => new Set(selected), [selected])
  const matching = useMemo(() => {
    const normalisedQuery = query.trim().toLocaleLowerCase()
    const filtered = normalisedQuery
      ? options.filter(option => option.label.toLocaleLowerCase().includes(normalisedQuery))
      : options
    return [...filtered].sort((left, right) => {
      const selectedDifference = Number(selectedValues.has(right.value)) - Number(selectedValues.has(left.value))
      return selectedDifference || left.label.localeCompare(right.label)
    })
  }, [options, query, selectedValues])
  const visible = showAll || query ? matching : matching.slice(0, COLLAPSED_OPTION_COUNT)

  return (
    <details className="contact-facet" open={open} onToggle={event => setOpen(event.currentTarget.open)}>
      <summary>
        <span>{label}</span>
        <span className="contact-facet-summary-count">{selected.length || options.length}</span>
      </summary>
      <div className="contact-facet-body">
        {options.length > COLLAPSED_OPTION_COUNT && (
          <label className="contact-facet-search">
            <Search size={14} aria-hidden="true" />
            <span className="sr-only">Search {label.toLocaleLowerCase()}</span>
            <input
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder={`Find ${label.toLocaleLowerCase()}`}
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} aria-label={`Clear ${label.toLocaleLowerCase()} search`}>
                <X size={13} />
              </button>
            )}
          </label>
        )}
        <div className="contact-facet-options">
          {visible.map(option => (
            <label key={option.value} className="contact-facet-option">
              <input
                type="checkbox"
                checked={selectedValues.has(option.value)}
                onChange={() => onToggle(option.value)}
              />
              <span>{option.label}</span>
              <em>{option.count}</em>
            </label>
          ))}
          {!visible.length && <p className="contact-facet-empty">No matching options</p>}
        </div>
        {!query && matching.length > COLLAPSED_OPTION_COUNT && (
          <button type="button" className="contact-facet-more" onClick={() => setShowAll(value => !value)}>
            {showAll ? 'Show fewer' : `Show all ${matching.length.toLocaleString()}`}
          </button>
        )}
      </div>
    </details>
  )
}
