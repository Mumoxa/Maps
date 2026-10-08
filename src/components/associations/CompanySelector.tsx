import { useId, useMemo, useState, type KeyboardEvent } from 'react'
import type { IntelligenceGraph } from '../../data/intelligence/graph'

interface CompanySelectorProps {
  graph: IntelligenceGraph
  value: string | null
  onSelect: (organizationId: string | null) => void
  label?: string
}

/** Accessible combobox over every organization (names and aliases). */
export function CompanySelector({ graph, value, onSelect, label = 'Focus company' }: CompanySelectorProps) {
  const id = useId()
  const listId = `${id}-list`
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const current = value ? graph.organizationById.get(value) : null

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return graph.organizations.filter((org) => org.southAfrican)
    return graph.organizations.filter((org) => [org.name, ...org.aliases].some((name) => name.toLowerCase().includes(needle)))
  }, [graph, query])

  const choose = (orgId: string | null) => {
    onSelect(orgId)
    setQuery('')
    setOpen(false)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setOpen(true)
      setActive((index) => Math.min(index + 1, matches.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActive((index) => Math.max(index - 1, 0))
    } else if (event.key === 'Enter' && open && matches[active]) {
      event.preventDefault()
      choose(matches[active].id)
    } else if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className="ca-selector">
      <label htmlFor={id} className="ca-label">
        {label}
      </label>
      <div className="ca-selector-row">
        <input
          id={id}
          type="search"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open && matches[active] ? `${listId}-${matches[active].id}` : undefined}
          className="ca-input"
          placeholder={current ? current.name : 'Type a company name or alias'}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setActive(0)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 150)}
          onKeyDown={onKeyDown}
        />
        {current && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => choose(null)} aria-label={`Clear focus company ${current.name}`}>
            Clear
          </button>
        )}
      </div>
      {current && <p className="ca-selector-current">Focused on <b>{current.name}</b></p>}
      {open && (
        <ul id={listId} role="listbox" className="ca-selector-list" aria-label="Matching companies">
          {matches.length === 0 && <li className="ca-selector-empty">No organization matches “{query}”</li>}
          {matches.map((org, index) => (
            <li
              key={org.id}
              id={`${listId}-${org.id}`}
              role="option"
              aria-selected={index === active}
              className={index === active ? 'ca-selector-option is-active' : 'ca-selector-option'}
              onMouseDown={(event) => {
                event.preventDefault()
                choose(org.id)
              }}
            >
              {org.name}
              {org.identityStatus !== 'verified' && <span className="intel-muted"> · identity {org.identityStatus}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
