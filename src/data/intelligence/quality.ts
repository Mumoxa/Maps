// Data-quality checks over the intelligence graph. Each issue names the
// records involved so a researcher can act on it.

import { CONFIDENCE_RANK, daysBetween, evidenceAge, STALE_AFTER_DAYS, type IntelligenceGraph } from './graph'
import { organizationKey } from './identity'

export type QualityCheck =
  | 'duplicate-organization'
  | 'ambiguous-alias'
  | 'conflicting-parent'
  | 'circular-group'
  | 'unsupported-fact'
  | 'missing-evidence-record'
  | 'activity-assumed-from-industry'
  | 'conflicting-capability'
  | 'conflicting-scale'
  | 'stale-evidence'
  | 'unresolved-identity'
  | 'open-question'
  | 'unclassified-organization'
  | 'unresolved-employer'
  | 'stale-current-employment'
  | 'same-name-people'

export interface QualityIssue {
  check: QualityCheck
  severity: 'error' | 'warning' | 'info'
  organizationIds: string[]
  message: string
}

export const QUALITY_LABELS: Record<QualityCheck, string> = {
  'duplicate-organization': 'Possible duplicate organization',
  'ambiguous-alias': 'Alias shared by several organizations',
  'conflicting-parent': 'More than one parent company',
  'circular-group': 'Circular group structure',
  'unsupported-fact': 'Fact without evidence',
  'missing-evidence-record': 'Fact cites unknown evidence',
  'activity-assumed-from-industry': 'Activity assumed from industry only',
  'conflicting-capability': 'Conflicting capability evidence',
  'conflicting-scale': 'Conflicting scale figures',
  'stale-evidence': 'Stale evidence',
  'unresolved-identity': 'Identity not verified',
  'open-question': 'Open research question',
  'unclassified-organization': 'No industry recorded',
  'unresolved-employer': 'Employer not linked to an organization',
  'stale-current-employment': 'Current employment not re-verified recently',
  'same-name-people': 'Same name in several datasets (not merged)',
}

export function runQualityChecks(graph: IntelligenceGraph): QualityIssue[] {
  const issues: QualityIssue[] = []
  const add = (check: QualityCheck, severity: QualityIssue['severity'], organizationIds: string[], message: string) => issues.push({ check, severity, organizationIds, message })

  // Identity: keys and domains claimed by more than one organization.
  const keyOwners = new Map<string, Set<string>>()
  const domainOwners = new Map<string, Set<string>>()
  for (const org of graph.organizations) {
    for (const name of [org.name, ...org.aliases]) {
      const key = organizationKey(name)
      if (!key) continue
      const owners = keyOwners.get(key) ?? new Set<string>()
      owners.add(org.id)
      keyOwners.set(key, owners)
    }
    if (org.domain) {
      const owners = domainOwners.get(org.domain) ?? new Set<string>()
      owners.add(org.id)
      domainOwners.set(org.domain, owners)
    }
    if (org.identityStatus === 'unresolved' && org.lineage.length === 0) add('unresolved-identity', 'warning', [org.id], `${org.name} has no lineage and no verified identity`)
    else if (org.identityStatus === 'probable') add('unresolved-identity', 'info', [org.id], `${org.name}: identity is probable, not verified`)
  }
  for (const [key, owners] of keyOwners) if (owners.size > 1) add('ambiguous-alias', 'warning', [...owners], `Name or alias "${key}" is used by ${owners.size} organizations`)
  for (const [domain, owners] of domainOwners) {
    if (owners.size < 2) continue
    const ids = [...owners]
    const related = ids.every((id) => (graph.relationshipsByOrg.get(id) ?? []).some((rel) => owners.has(rel.fromId) && owners.has(rel.toId)))
    if (related) continue
    add('duplicate-organization', 'warning', ids, `Website domain ${domain} is shared by ${owners.size} organizations with no recorded corporate relationship (duplicate or group companies?)`)
  }

  // Corporate structure.
  for (const org of graph.organizations) {
    const parents = new Set((graph.relationshipsByOrg.get(org.id) ?? []).filter((rel) => rel.fromId === org.id && (rel.type === 'subsidiary-of' || rel.type === 'division-of')).map((rel) => rel.toId))
    if (parents.size > 1) add('conflicting-parent', 'warning', [org.id, ...parents], `${org.name} has ${parents.size} recorded parents`)
    const seen = new Set<string>([org.id])
    let cursor = org.id
    for (let depth = 0; depth < 50; depth++) {
      const parent = (graph.relationshipsByOrg.get(cursor) ?? []).find((rel) => rel.fromId === cursor && (rel.type === 'subsidiary-of' || rel.type === 'division-of'))
      if (!parent) break
      if (seen.has(parent.toId)) {
        add('circular-group', 'error', [...seen], `Circular parent chain through ${org.name}`)
        break
      }
      seen.add(parent.toId)
      cursor = parent.toId
    }
  }

  // Evidence integrity and conflicts.
  const conflictingSeen = new Set<string>()
  for (const [orgId, rows] of graph.capabilityStatementsByOrg) {
    const states = new Map<string, Set<string>>()
    for (const row of rows) {
      if (row.status !== 'unknown' && row.evidenceIds.length === 0) add('unsupported-fact', 'error', [orgId], `${row.capabilityId} is ${row.status} without evidence`)
      for (const id of row.evidenceIds) if (!graph.evidenceById.has(id)) add('missing-evidence-record', 'error', [orgId], `${row.capabilityId} cites unknown evidence ${id}`)
      const set = states.get(row.capabilityId) ?? new Set<string>()
      set.add(row.status)
      states.set(row.capabilityId, set)
    }
    for (const [capabilityId, set] of states) {
      if (set.has('observed') && set.has('not-observed') && !conflictingSeen.has(`${orgId}|${capabilityId}`)) {
        conflictingSeen.add(`${orgId}|${capabilityId}`)
        add('conflicting-capability', 'warning', [orgId], `${graph.organizationById.get(orgId)?.name}: ${capabilityId} is both observed and not observed across sources`)
      }
    }
  }
  for (const [orgId, rows] of graph.industriesByOrg) {
    for (const row of rows) {
      if (row.evidenceIds.length === 0) add('unsupported-fact', 'error', [orgId], `Industry ${row.industryId} has no evidence`)
      for (const id of row.evidenceIds) if (!graph.evidenceById.has(id)) add('missing-evidence-record', 'error', [orgId], `Industry ${row.industryId} cites unknown evidence ${id}`)
    }
  }
  let inferredOrgs = 0
  for (const [, caps] of graph.capabilitiesByOrg) {
    for (const row of caps.values()) {
      if (row.inferredFromIndustry) {
        inferredOrgs++
        break
      }
    }
  }
  if (inferredOrgs) add('activity-assumed-from-industry', 'info', [], `${inferredOrgs} organizations have capabilities shown only as industry-typical hypotheses; these never count as observed`)

  for (const [orgId, metrics] of graph.metricsByOrg) {
    const byKind = new Map<string, Set<string>>()
    for (const metric of metrics) {
      const set = byKind.get(metric.metric) ?? new Set<string>()
      set.add(metric.value === null ? metric.valueText : String(metric.value))
      byKind.set(metric.metric, set)
    }
    for (const [kind, values] of byKind) if (values.size > 1) add('conflicting-scale', 'warning', [orgId], `${graph.organizationById.get(orgId)?.name}: ${kind} reported as ${[...values].join(' / ')}`)
  }

  const staleByOrg = new Map<string, number>()
  const evidenceOrgs = new Map<string, Set<string>>()
  const note = (orgId: string, ids: string[]) => {
    for (const id of ids) {
      const set = evidenceOrgs.get(id) ?? new Set<string>()
      set.add(orgId)
      evidenceOrgs.set(id, set)
    }
  }
  for (const [orgId, rows] of graph.industriesByOrg) for (const row of rows) note(orgId, row.evidenceIds)
  for (const [orgId, rows] of graph.capabilityStatementsByOrg) for (const row of rows) note(orgId, row.evidenceIds)
  for (const [id, orgs] of evidenceOrgs) {
    const evidence = graph.evidenceById.get(id)
    if (!evidence || evidenceAge(evidence, graph.asOf) !== 'stale') continue
    for (const orgId of orgs) staleByOrg.set(orgId, (staleByOrg.get(orgId) ?? 0) + 1)
  }
  for (const [orgId, count] of staleByOrg) add('stale-evidence', 'info', [orgId], `${graph.organizationById.get(orgId)?.name}: ${count} evidence record(s) older than ${STALE_AFTER_DAYS} days`)

  for (const question of graph.openQuestions) add('open-question', 'info', question.organizationId ? [question.organizationId] : [], `${question.kind}: ${question.issue}${question.legacyRef ? ` (${question.legacyRef})` : ''}`)

  for (const org of graph.organizations) {
    if (org.southAfrican && !(graph.industriesByOrg.get(org.id) ?? []).length) add('unclassified-organization', 'info', [org.id], `${org.name} has no industry classification`)
  }

  // People.
  for (const [employer, count] of [...graph.unresolvedEmployers].sort((a, b) => b[1] - a[1])) {
    add('unresolved-employer', 'info', [], `"${employer}" (${count} current employment record${count === 1 ? '' : 's'}) does not resolve to an organization`)
  }
  let staleCurrent = 0
  for (const [, rows] of graph.employmentsByOrg) {
    for (const row of rows) if (row.current && row.verifiedOn && daysBetween(row.verifiedOn, graph.asOf) > STALE_AFTER_DAYS) staleCurrent++
  }
  if (staleCurrent) add('stale-current-employment', 'info', [], `${staleCurrent} current employment records were last verified more than ${STALE_AFTER_DAYS} days ago`)
  const nameDatasets = new Map<string, Set<string>>()
  for (const person of graph.persons) {
    const key = person.name.trim().toLowerCase()
    const set = nameDatasets.get(key) ?? new Set<string>()
    set.add(person.dataset)
    nameDatasets.set(key, set)
  }
  let sameName = 0
  for (const [, set] of nameDatasets) if (set.size > 1) sameName++
  if (sameName) add('same-name-people', 'info', [], `${sameName} names appear in more than one people dataset; they are kept as separate people until a reviewer links them`)

  return issues
}

/** Coverage summary for the reporting panel. Unknown is reported separately from zero. */
export function coverageSummary(graph: IntelligenceGraph) {
  let southAfrican = 0
  let classified = 0
  let withObservedCapability = 0
  let withLocations = 0
  let withPeople = 0
  let verifiedIdentity = 0
  let withMetrics = 0
  for (const org of graph.organizations) {
    if (!org.southAfrican) continue
    southAfrican++
    if ((graph.industriesByOrg.get(org.id) ?? []).length) classified++
    const caps = graph.capabilitiesByOrg.get(org.id)
    if (caps && [...caps.values()].some((row) => row.status === 'observed' && CONFIDENCE_RANK[row.confidence] >= 2)) withObservedCapability++
    if ((graph.locationsByOrg.get(org.id) ?? []).length) withLocations++
    if ((graph.employmentsByOrg.get(org.id) ?? []).some((row) => row.current)) withPeople++
    if (org.identityStatus === 'verified') verifiedIdentity++
    if ((graph.metricsByOrg.get(org.id) ?? []).length) withMetrics++
  }
  return {
    organizations: southAfrican,
    classified,
    unclassified: southAfrican - classified,
    withObservedCapability,
    capabilityUnknown: southAfrican - withObservedCapability,
    withLocations,
    withPeople,
    verifiedIdentity,
    withMetrics,
    evidenceRecords: graph.evidenceById.size,
    persons: graph.persons.length,
    unresolvedEmployers: graph.unresolvedEmployers.size,
  }
}
