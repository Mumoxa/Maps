import { useState } from 'react'
import { Search } from 'lucide-react'
import type { FacetDef, FacetSelections, FacetValue } from '../../data/facets'

interface FacetPanelProps<T> {
  defs: FacetDef<T>[]
  selections: FacetSelections
  optionsFor: (def: FacetDef<T>) => FacetValue[]
  onToggle: (key: string, value: string) => void
  /** id prefix so inputs stay unique when the panel is rendered twice (sidebar + drawer). */
  idPrefix: string
}

function FacetGroup<T>({
  def,
  options,
  selected,
  onToggle,
  idPrefix,
}: {
  def: FacetDef<T>
  options: FacetValue[]
  selected: string[]
  onToggle: (key: string, value: string) => void
  idPrefix: string
}) {
  const [search, setSearch] = useState('')
  const searchable = def.searchThreshold !== undefined && options.length > def.searchThreshold
  const needle = search.trim().toLowerCase()
  const visible = needle
    ? options.filter((option) => option.label.toLowerCase().includes(needle))
    : options

  if (options.length === 0) return null

  return (
    <section className="facet-group" aria-labelledby={`${idPrefix}-${def.key}-label`}>
      <h3 className="facet-group-label" id={`${idPrefix}-${def.key}-label`}>{def.label}</h3>
      {searchable && (
        <div className="facet-search">
          <Search size={13} aria-hidden />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={`Search ${def.label.toLowerCase()}…`}
            aria-label={`Search ${def.label} options`}
          />
        </div>
      )}
      <ul className="facet-options">
        {visible.map((option) => {
          const id = `${idPrefix}-${def.key}-${option.value}`
          const isChecked = selected.includes(option.value)
          return (
            <li key={option.value}>
              <label className="facet-option" htmlFor={id}>
                <input
                  id={id}
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggle(def.key, option.value)}
                />
                <span className="facet-option-label">{option.label}</span>
                <span className="facet-option-count">{option.count}</span>
              </label>
            </li>
          )
        })}
        {visible.length === 0 && <li className="facet-empty">No matches</li>}
      </ul>
    </section>
  )
}

export function FacetPanel<T>({ defs, selections, optionsFor, onToggle, idPrefix }: FacetPanelProps<T>) {
  return (
    <div className="facet-panel">
      {defs.map((def) => (
        <FacetGroup
          key={def.key}
          def={def}
          options={optionsFor(def)}
          selected={selections[def.key] ?? []}
          onToggle={onToggle}
          idPrefix={idPrefix}
        />
      ))}
    </div>
  )
}
