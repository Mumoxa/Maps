// Side-by-side company comparison: shared, distinct and unknown, plus what
// the differences mean for the current role requirement.

import { capabilityState, CONFIDENCE_RANK, type IntelligenceGraph } from './graph'
import type { CapabilityStatus, Confidence, ScaleMetric, SearchRequirement } from './types'

export type CellState = 'observed' | 'hypothesis' | 'not-observed' | 'unknown'

export interface ComparisonCell {
  state: CellState
  confidence: Confidence
  evidenceIds: string[]
}

export interface ComparisonLine {
  id: string
  label: string
  kind: 'industry' | 'capability'
  cells: Record<string, ComparisonCell>
  classification: 'shared' | 'distinct' | 'partly-unknown'
  requirement: 'mandatory' | 'preferred' | null
}

export interface OrganizationComparison {
  organizationIds: string[]
  lines: ComparisonLine[]
  metrics: Record<string, ScaleMetric[]>
  provinces: Record<string, string[]>
  implications: string[]
}

function cellFromStatus(status: CapabilityStatus, confidence: Confidence): CellState {
  if (status === 'observed') return CONFIDENCE_RANK[confidence] >= 2 ? 'observed' : 'hypothesis'
  if (status === 'not-observed') return 'not-observed'
  return confidence === 'hypothesis' ? 'hypothesis' : 'unknown'
}

function classify(cells: ComparisonCell[]): ComparisonLine['classification'] {
  if (cells.every((cell) => cell.state === 'observed')) return 'shared'
  if (cells.some((cell) => cell.state === 'unknown' || cell.state === 'hypothesis')) return 'partly-unknown'
  return 'distinct'
}

export function compareOrganizations(graph: IntelligenceGraph, organizationIds: string[], requirement: SearchRequirement | null): OrganizationComparison {
  const ids = organizationIds.filter((id) => graph.organizationById.has(id))
  const lines: ComparisonLine[] = []
  const mandatory = new Set(requirement?.mandatoryCapabilities ?? [])
  const preferred = new Set(requirement?.preferredCapabilities ?? [])

  const industryIds = new Set<string>()
  for (const id of ids) for (const row of graph.industriesByOrg.get(id) ?? []) industryIds.add(row.industryId)
  for (const industryId of industryIds) {
    const cells: Record<string, ComparisonCell> = {}
    for (const id of ids) {
      const row = (graph.industriesByOrg.get(id) ?? []).find((ind) => ind.industryId === industryId)
      const classified = (graph.industriesByOrg.get(id) ?? []).length > 0
      cells[id] = row
        ? { state: 'observed', confidence: row.confidence, evidenceIds: row.evidenceIds }
        : { state: classified ? 'not-observed' : 'unknown', confidence: 'unknown', evidenceIds: [] }
    }
    lines.push({
      id: industryId,
      label: graph.taxonomy.industryById.get(industryId)?.name ?? industryId,
      kind: 'industry',
      cells,
      classification: classify(Object.values(cells)),
      requirement: null,
    })
  }

  const capabilityIds = new Set<string>([...mandatory, ...preferred])
  for (const id of ids) {
    for (const row of graph.capabilitiesByOrg.get(id)?.values() ?? []) if (!row.inferredFromIndustry) capabilityIds.add(row.capabilityId)
  }
  for (const capabilityId of capabilityIds) {
    const cells: Record<string, ComparisonCell> = {}
    for (const id of ids) {
      const { row } = capabilityState(graph, id, capabilityId)
      cells[id] = row ? { state: cellFromStatus(row.status, row.confidence), confidence: row.confidence, evidenceIds: row.evidenceIds } : { state: 'unknown', confidence: 'unknown', evidenceIds: [] }
    }
    lines.push({
      id: capabilityId,
      label: graph.taxonomy.capabilityById.get(capabilityId)?.name ?? capabilityId,
      kind: 'capability',
      cells,
      classification: classify(Object.values(cells)),
      requirement: mandatory.has(capabilityId) ? 'mandatory' : preferred.has(capabilityId) ? 'preferred' : null,
    })
  }
  lines.sort((a, b) => {
    const rank = (line: ComparisonLine) => (line.requirement === 'mandatory' ? 0 : line.requirement === 'preferred' ? 1 : line.kind === 'industry' ? 2 : 3)
    return rank(a) - rank(b) || a.label.localeCompare(b.label)
  })

  const metrics: Record<string, ScaleMetric[]> = {}
  const provinces: Record<string, string[]> = {}
  for (const id of ids) {
    metrics[id] = graph.metricsByOrg.get(id) ?? []
    provinces[id] = [...new Set((graph.locationsByOrg.get(id) ?? []).map((loc) => loc.province))].sort()
  }

  const name = (id: string) => graph.organizationById.get(id)?.name ?? id
  const implications: string[] = []
  for (const line of lines) {
    if (!line.requirement) continue
    const observed = ids.filter((id) => line.cells[id].state === 'observed')
    const missing = ids.filter((id) => line.cells[id].state === 'not-observed')
    const unknown = ids.filter((id) => line.cells[id].state === 'unknown' || line.cells[id].state === 'hypothesis')
    const parts: string[] = []
    if (observed.length) parts.push(`observed at ${observed.map(name).join(', ')}`)
    if (missing.length) parts.push(`not carried out at ${missing.map(name).join(', ')}`)
    if (unknown.length) parts.push(`unverified at ${unknown.map(name).join(', ')}`)
    implications.push(`${line.requirement === 'mandatory' ? 'Mandatory' : 'Preferred'} ${line.label}: ${parts.join('; ')}.`)
  }
  const metricKinds = new Set<string>()
  for (const id of ids) for (const metric of metrics[id]) metricKinds.add(metric.metric)
  for (const kind of metricKinds) {
    const holders = ids.filter((id) => metrics[id].some((metric) => metric.metric === kind))
    if (holders.length < ids.length) implications.push(`Scale (${kind}) is only sourced for ${holders.map(name).join(', ')}; do not compare scale across the others.`)
  }
  return { organizationIds: ids, lines, metrics, provinces, implications }
}
