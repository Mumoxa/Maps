import { useId } from 'react'
import type { IntelligenceGraph } from '../../data/intelligence/graph'
import type { RoleContextTemplate, SearchRequirement } from '../../data/intelligence/types'
import type { RecruitmentSearch } from '../../data/workspace/types'

interface RoleContextPickerProps {
  value: string
  templates: RoleContextTemplate[]
  assignments: RecruitmentSearch[]
  onChange: (value: string) => void
}

export function RoleContextPicker({ value, templates, assignments, onChange }: RoleContextPickerProps) {
  const id = useId()
  return (
    <div className="ca-field">
      <label htmlFor={id} className="ca-label">
        Role context
      </label>
      <select id={id} className="filter-select ca-select" value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="none">No role: company associations only</option>
        <optgroup label="Role templates">
          {templates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.label}
            </option>
          ))}
        </optgroup>
        <option value="custom">Custom requirement</option>
        {assignments.length > 0 && (
          <optgroup label="Search assignments (private, this browser)">
            {assignments.map((search) => (
              <option key={search.id} value={`search:${search.id}`}>
                {search.name}
              </option>
            ))}
          </optgroup>
        )}
      </select>
    </div>
  )
}

type RequirementKey = 'mandatoryCapabilities' | 'preferredCapabilities' | 'preferredIndustries' | 'adjacentIndustries' | 'deprioritisedIndustries'

const FIELDS: { key: RequirementKey; label: string; kind: 'capability' | 'industry' }[] = [
  { key: 'mandatoryCapabilities', label: 'Mandatory capabilities', kind: 'capability' },
  { key: 'preferredCapabilities', label: 'Preferred capabilities', kind: 'capability' },
  { key: 'preferredIndustries', label: 'Preferred industries', kind: 'industry' },
  { key: 'adjacentIndustries', label: 'Adjacent industries', kind: 'industry' },
  { key: 'deprioritisedIndustries', label: 'Deprioritised industries', kind: 'industry' },
]

interface RequirementEditorProps {
  graph: IntelligenceGraph
  requirement: SearchRequirement
  onChange: (key: RequirementKey, values: string[]) => void
  readOnly?: boolean
}

/** Shows (and for custom contexts edits) the requirement driving the tiers. Vocabulary comes from the taxonomy files. */
export function RequirementEditor({ graph, requirement, onChange, readOnly = false }: RequirementEditorProps) {
  const baseId = useId()
  const nameOf = (kind: 'capability' | 'industry', id: string) =>
    kind === 'capability' ? graph.taxonomy.capabilityById.get(id)?.name ?? id : graph.taxonomy.industryById.get(id)?.name ?? id
  return (
    <div className="ca-requirement">
      {FIELDS.map((field) => {
        const values = requirement[field.key]
        const options = field.kind === 'capability' ? graph.taxonomy.capabilities : graph.taxonomy.industries
        const selectId = `${baseId}-${field.key}`
        if (readOnly && values.length === 0) return null
        return (
          <div key={field.key} className="ca-requirement-row">
            <span className="ca-label">{field.label}</span>
            <div className="ca-chip-list">
              {values.length === 0 && <span className="intel-muted">None</span>}
              {values.map((value) => (
                <span key={value} className="chip">
                  {nameOf(field.kind, value)}
                  {!readOnly && (
                    <button
                      type="button"
                      className="ca-chip-remove"
                      aria-label={`Remove ${nameOf(field.kind, value)} from ${field.label}`}
                      onClick={() => onChange(field.key, values.filter((item) => item !== value))}
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>
            {!readOnly && (
              <>
                <label htmlFor={selectId} className="sr-only">
                  Add to {field.label}
                </label>
                <select
                  id={selectId}
                  className="filter-select ca-select-sm"
                  value=""
                  onChange={(event) => {
                    if (event.target.value) onChange(field.key, [...values, event.target.value])
                  }}
                >
                  <option value="">Add…</option>
                  {options
                    .filter((option) => !values.includes(option.id))
                    .map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.parentId ? `  ${option.name}` : option.name}
                      </option>
                    ))}
                </select>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}

export type { RequirementKey }
