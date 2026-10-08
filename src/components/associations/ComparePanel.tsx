import { useMemo } from 'react'
import { compareOrganizations, type CellState } from '../../data/intelligence/comparison'
import type { IntelligenceGraph } from '../../data/intelligence/graph'
import type { SearchRequirement } from '../../data/intelligence/types'

const CELL_TEXT: Record<CellState, string> = {
  observed: 'Observed',
  hypothesis: 'Hypothesis',
  'not-observed': 'Not carried out',
  unknown: 'Unknown',
}

const CLASS_TEXT = { shared: 'Shared', distinct: 'Distinct', 'partly-unknown': 'Partly unknown' } as const

interface ComparePanelProps {
  graph: IntelligenceGraph
  organizationIds: string[]
  requirement: SearchRequirement | null
  onRemove: (id: string) => void
  onClose: () => void
}

export function ComparePanel({ graph, organizationIds, requirement, onRemove, onClose }: ComparePanelProps) {
  const comparison = useMemo(() => compareOrganizations(graph, organizationIds, requirement), [graph, organizationIds, requirement])
  const ids = comparison.organizationIds
  const name = (id: string) => graph.organizationById.get(id)?.name ?? id
  return (
    <section className="ca-compare" aria-labelledby="ca-compare-title">
      <header className="ca-compare-head">
        <h2 id="ca-compare-title" className="ca-panel-title">
          Compare {ids.length} companies
        </h2>
        <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
          Close compare
        </button>
      </header>
      {comparison.implications.length > 0 && (
        <div className="ca-compare-implications">
          <h3>What this means for the role</h3>
          <ul>{comparison.implications.map((line) => <li key={line}>{line}</li>)}</ul>
        </div>
      )}
      <div className="data-table-wrap">
        <table className="data-table ca-compare-table">
          <caption className="sr-only">Side-by-side comparison of industries and capabilities</caption>
          <thead>
            <tr>
              <th scope="col">Dimension</th>
              <th scope="col">Result</th>
              {ids.map((id) => (
                <th key={id} scope="col">
                  {name(id)}{' '}
                  <button type="button" className="ca-chip-remove" onClick={() => onRemove(id)} aria-label={`Remove ${name(id)} from compare`}>
                    ×
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparison.lines.map((line) => (
              <tr key={`${line.kind}-${line.id}`}>
                <th scope="row">
                  {line.label}
                  <span className="intel-muted">
                    {' '}
                    {line.kind}
                    {line.requirement ? `, ${line.requirement}` : ''}
                  </span>
                </th>
                <td>{CLASS_TEXT[line.classification]}</td>
                {ids.map((id) => (
                  <td key={id} className={`ca-cell ca-cell-${line.cells[id].state}`}>
                    {CELL_TEXT[line.cells[id].state]}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <th scope="row">Provinces</th>
              <td>Locations</td>
              {ids.map((id) => (
                <td key={id}>{comparison.provinces[id].length ? comparison.provinces[id].join(', ') : 'Unknown'}</td>
              ))}
            </tr>
            <tr>
              <th scope="row">Scale</th>
              <td>As sourced</td>
              {ids.map((id) => (
                <td key={id}>{comparison.metrics[id].length ? comparison.metrics[id].map((metric) => `${metric.metric}: ${metric.valueText}`).join('; ') : 'Not sourced'}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  )
}
