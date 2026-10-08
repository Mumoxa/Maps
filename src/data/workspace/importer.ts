// Structured research import: CSV or JSON -> normalised statements -> matched
// against existing organizations -> reviewable preview -> committed as a
// private ResearchBatch. Re-importing the same file is detected by content
// hash; statements already known are reported as duplicates, not re-added.
// Rows asserting a fact without evidence are rejected.

import { clean, hashId, parseCsvRows } from '../searchBank/normalise'
import { slugify } from '../slug'
import { findOrganization, type IntelligenceGraph } from '../intelligence/graph'
import { buildTermIndex } from '../intelligence/taxonomy'
import type {
  CapabilityStatus,
  Confidence,
  CorporateRelationshipType,
  EvidenceRecord,
  OrganizationCapability,
  OrganizationIndustry,
  OrganizationLocation,
  OrganizationRelationship,
  ResearchBatch,
  ResearchIdentity,
  SourceType,
} from '../intelligence/types'

export const IMPORT_COLUMNS = [
  'company',
  'website',
  'industry',
  'industry_role',
  'capability',
  'capability_status',
  'confidence',
  'evidence_url',
  'source_name',
  'source_type',
  'published_on',
  'supports',
  'province',
  'city',
  'related_company',
  'relationship_type',
] as const

type ImportRow = Partial<Record<(typeof IMPORT_COLUMNS)[number], string>>

export type PreviewStatus = 'new' | 'duplicate' | 'conflict' | 'rejected'

export interface PreviewRow {
  line: number
  company: string
  organizationId: string | null
  match: 'existing' | 'new-organization' | 'unresolved'
  status: PreviewStatus
  statements: string[]
  issues: string[]
}

export interface ImportPreview {
  contentHash: string
  format: 'csv' | 'json'
  fileName: string
  alreadyImported: boolean
  fatal: string | null
  rows: PreviewRow[]
  batch: ResearchBatch
  summary: { rows: number; accepted: number; duplicates: number; conflicts: number; rejected: number; newOrganizations: number }
}

const CONFIDENCE_VALUES = new Set<Confidence>(['confirmed', 'probable', 'hypothesis', 'unknown'])
const STATUS_VALUES = new Set<CapabilityStatus>(['observed', 'not-observed', 'unknown'])
const RELATIONSHIP_VALUES = new Set<CorporateRelationshipType>(['subsidiary-of', 'division-of', 'acquired-by', 'joint-venture', 'partnership'])
const SOURCE_TYPES = new Set<SourceType>([
  'company-website',
  'company-social',
  'company-recruitment',
  'company-presentation',
  'trade-press',
  'news',
  'academic',
  'third-party-directory',
  'internal-dataset',
  'recruiter-note',
])

function headerKey(value: string): string {
  return clean(value).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
}

function parseRows(text: string): { format: 'csv' | 'json'; rows: ImportRow[]; batch: ResearchBatch | null; fatal: string | null } {
  const trimmed = text.trim()
  if (!trimmed) return { format: 'csv', rows: [], batch: null, fatal: 'The file is empty' }
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed) as unknown
      if (Array.isArray(parsed)) return { format: 'json', rows: parsed.map((row) => normaliseKeys(row)), batch: null, fatal: null }
      const record = parsed as Record<string, unknown>
      if (record.schemaVersion === 1 && typeof record.batchId === 'string') return { format: 'json', rows: [], batch: record as unknown as ResearchBatch, fatal: null }
      if (Array.isArray(record.rows)) return { format: 'json', rows: record.rows.map((row) => normaliseKeys(row)), batch: null, fatal: null }
      return { format: 'json', rows: [], batch: null, fatal: 'JSON must be an array of rows, an object with "rows", or a research batch (schemaVersion 1)' }
    } catch (error) {
      return { format: 'json', rows: [], batch: null, fatal: `Invalid JSON: ${(error as Error).message}` }
    }
  }
  const table = parseCsvRows(trimmed)
  if (table.length < 2) return { format: 'csv', rows: [], batch: null, fatal: 'CSV needs a header row and at least one data row' }
  const header = table[0].map(headerKey)
  if (!header.includes('company')) return { format: 'csv', rows: [], batch: null, fatal: 'CSV must have a "company" column' }
  const rows = table.slice(1).map((cells) => {
    const row: ImportRow = {}
    header.forEach((key, index) => {
      if ((IMPORT_COLUMNS as readonly string[]).includes(key)) row[key as keyof ImportRow] = clean(cells[index] ?? '')
    })
    return row
  })
  return { format: 'csv', rows, batch: null, fatal: null }
}

function normaliseKeys(value: unknown): ImportRow {
  const row: ImportRow = {}
  if (!value || typeof value !== 'object') return row
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    const normalised = headerKey(key)
    if ((IMPORT_COLUMNS as readonly string[]).includes(normalised)) row[normalised as keyof ImportRow] = clean(raw)
  }
  return row
}

export function previewImport(graph: IntelligenceGraph, text: string, fileName: string, importedOn: string, committedHashes: Set<string>): ImportPreview {
  const contentHash = hashId(text.replace(/\r\n/g, '\n').trim())
  const batchId = `ws-import-${contentHash}`
  const emptyBatch: ResearchBatch = {
    schemaVersion: 1,
    batchId,
    researchedOn: importedOn,
    researcher: 'workspace import',
    scope: `Private import of ${fileName}`,
    identities: [],
    evidence: [],
    organizationIndustries: [],
    organizationCapabilities: [],
    organizationRelationships: [],
    locations: [],
    scaleMetrics: [],
    openQuestions: [],
  }
  const parsed = parseRows(text)
  const base = { contentHash, format: parsed.format, fileName, alreadyImported: committedHashes.has(contentHash) }
  if (parsed.fatal) return { ...base, fatal: parsed.fatal, rows: [], batch: emptyBatch, summary: { rows: 0, accepted: 0, duplicates: 0, conflicts: 0, rejected: 0, newOrganizations: 0 } }
  if (parsed.batch) return previewBatch(graph, parsed.batch, base)

  const terms = buildTermIndex(graph.taxonomy)
  const batch = emptyBatch
  const newOrgs = new Map<string, ResearchIdentity>()
  const rows: PreviewRow[] = []
  const seenStatements = new Set<string>()

  const resolveOrg = (name: string, website: string): { id: string | null; match: PreviewRow['match'] } => {
    const existing = findOrganization(graph, name)
    if (existing) return { id: existing, match: 'existing' }
    const key = name.toLowerCase()
    const pending = newOrgs.get(key)
    if (pending) return { id: pending.id, match: 'new-organization' }
    const id = `org-ws-${slugify(name)}`
    if (!slugify(name)) return { id: null, match: 'unresolved' }
    newOrgs.set(key, { id, lineage: [], name, aliases: [], legalName: null, website: website || null, identityStatus: 'unresolved' })
    return { id, match: 'new-organization' }
  }

  parsed.rows.forEach((row, index) => {
    const line = index + 2
    const company = row.company ?? ''
    const issues: string[] = []
    const statements: string[] = []
    if (!company) {
      rows.push({ line, company: '', organizationId: null, match: 'unresolved', status: 'rejected', statements, issues: ['Missing company name'] })
      return
    }
    const { id: orgId, match } = resolveOrg(company, row.website ?? '')
    if (!orgId) {
      rows.push({ line, company, organizationId: null, match, status: 'rejected', statements, issues: ['Company name could not be normalised'] })
      return
    }
    const confidence = (row.confidence ?? 'probable').toLowerCase() as Confidence
    if (!CONFIDENCE_VALUES.has(confidence)) issues.push(`Unknown confidence "${row.confidence}"`)
    const sourceType = (row.source_type || 'recruiter-note').toLowerCase() as SourceType
    if (!SOURCE_TYPES.has(sourceType)) issues.push(`Unknown source type "${row.source_type}"`)
    const hasEvidence = Boolean(row.evidence_url || row.supports)
    const evidenceId = `ev-${batchId}-${line}`
    const evidenceIds = hasEvidence ? [evidenceId] : []
    let status: PreviewStatus = 'new'
    let duplicates = 0
    let assertions = 0

    if (row.industry) {
      const industryId = terms.industry.get(row.industry.toLowerCase())
      if (!industryId) issues.push(`Industry "${row.industry}" is not in the taxonomy`)
      else if (!hasEvidence) issues.push('Industry membership needs evidence_url or supports')
      else {
        assertions++
        const exists = (graph.industriesByOrg.get(orgId) ?? []).some((ind) => ind.industryId === industryId)
        const key = `ind|${orgId}|${industryId}`
        if (exists || seenStatements.has(key)) duplicates++
        else {
          seenStatements.add(key)
          const statement: OrganizationIndustry = {
            organizationId: orgId,
            industryId,
            role: row.industry_role === 'primary' ? 'primary' : 'secondary',
            evidenceIds,
            confidence,
            origin: 'recruiter-supplied',
          }
          batch.organizationIndustries.push(statement)
          statements.push(`Industry: ${graph.taxonomy.industryById.get(industryId)?.name}`)
        }
      }
    }

    if (row.capability) {
      const capabilityId = terms.capability.get(row.capability.toLowerCase())
      const capStatus = (row.capability_status || 'observed').toLowerCase() as CapabilityStatus
      if (!capabilityId) issues.push(`Capability "${row.capability}" is not in the taxonomy`)
      else if (!STATUS_VALUES.has(capStatus)) issues.push(`Unknown capability status "${row.capability_status}"`)
      else if (capStatus !== 'unknown' && !hasEvidence) issues.push('A capability marked observed or not observed needs evidence_url or supports')
      else {
        assertions++
        const current = graph.capabilitiesByOrg.get(orgId)?.get(capabilityId)
        const key = `cap|${orgId}|${capabilityId}|${capStatus}`
        if ((current && !current.inferredFromIndustry && current.status === capStatus) || seenStatements.has(key)) duplicates++
        else {
          seenStatements.add(key)
          if (current && !current.inferredFromIndustry && current.status !== 'unknown' && capStatus !== 'unknown' && current.status !== capStatus) status = 'conflict'
          const statement: OrganizationCapability = {
            organizationId: orgId,
            capabilityId,
            status: capStatus,
            evidenceIds,
            confidence,
            origin: 'recruiter-supplied',
            summary: row.supports ?? '',
          }
          batch.organizationCapabilities.push(statement)
          statements.push(`Capability: ${graph.taxonomy.capabilityById.get(capabilityId)?.name} (${capStatus})`)
        }
      }
    }

    if (row.related_company || row.relationship_type) {
      const type = (row.relationship_type ?? '').toLowerCase() as CorporateRelationshipType
      const relatedId = row.related_company ? findOrganization(graph, row.related_company) : null
      if (!RELATIONSHIP_VALUES.has(type)) issues.push(`Unknown relationship type "${row.relationship_type}"`)
      else if (!relatedId) issues.push(`Related company "${row.related_company}" is not a known organization`)
      else if (!hasEvidence) issues.push('A corporate relationship needs evidence_url or supports')
      else {
        assertions++
        const exists = (graph.relationshipsByOrg.get(orgId) ?? []).some((rel) => rel.fromId === orgId && rel.toId === relatedId && rel.type === type)
        if (exists) duplicates++
        else {
          const statement: OrganizationRelationship = { fromId: orgId, toId: relatedId, type, evidenceIds, confidence, summary: row.supports ?? '' }
          batch.organizationRelationships.push(statement)
          statements.push(`Relationship: ${type} ${graph.organizationById.get(relatedId)?.name}`)
        }
      }
    }

    if (row.province) {
      assertions++
      const exists = (graph.locationsByOrg.get(orgId) ?? []).some((loc) => loc.province.toLowerCase() === (row.province ?? '').toLowerCase() && loc.city.toLowerCase() === (row.city ?? '').toLowerCase())
      if (exists) duplicates++
      else {
        const location: OrganizationLocation = { organizationId: orgId, province: row.province, city: row.city ?? '', evidenceIds, confidence }
        batch.locations.push(location)
        statements.push(`Location: ${[row.city, row.province].filter(Boolean).join(', ')}`)
      }
    }

    if (assertions === 0 && issues.length === 0) issues.push('Row asserts nothing (needs industry, capability, relationship or province)')
    if (statements.length === 0) status = issues.length ? 'rejected' : duplicates ? 'duplicate' : 'rejected'
    if (statements.length && hasEvidence) {
      const evidence: EvidenceRecord = {
        id: evidenceId,
        url: row.evidence_url || null,
        sourceName: row.source_name || 'Recruiter import',
        sourceType: SOURCE_TYPES.has(sourceType) ? sourceType : 'recruiter-note',
        publishedOn: row.published_on || null,
        supports: row.supports || 'Imported statement',
      }
      batch.evidence.push(evidence)
    }
    rows.push({ line, company, organizationId: orgId, match, status, statements, issues })
  })

  const usedNewOrgs = new Set<string>()
  for (const row of rows) if (row.match === 'new-organization' && row.status !== 'rejected' && row.organizationId) usedNewOrgs.add(row.organizationId)
  batch.identities = [...newOrgs.values()].filter((identity) => usedNewOrgs.has(identity.id))
  for (const identity of batch.identities) {
    batch.openQuestions.push({ organizationId: identity.id, kind: 'identity', issue: `${identity.name} was created by a private import and has not been verified` })
  }
  return { ...base, fatal: null, rows, batch, summary: summarise(rows, batch.identities.length) }
}

function summarise(rows: PreviewRow[], newOrganizations: number): ImportPreview['summary'] {
  let accepted = 0
  let duplicates = 0
  let conflicts = 0
  let rejected = 0
  for (const row of rows) {
    if (row.status === 'new') accepted++
    else if (row.status === 'duplicate') duplicates++
    else if (row.status === 'conflict') conflicts++
    else rejected++
  }
  return { rows: rows.length, accepted, duplicates, conflicts, rejected, newOrganizations }
}

/** A full research batch file: validate references and evidence instead of row mapping. */
function previewBatch(graph: IntelligenceGraph, batch: ResearchBatch, base: Pick<ImportPreview, 'contentHash' | 'format' | 'fileName' | 'alreadyImported'>): ImportPreview {
  const issues = validateResearchBatch(graph, batch)
  const rows: PreviewRow[] = [
    {
      line: 1,
      company: `Research batch ${batch.batchId}`,
      organizationId: null,
      match: 'existing',
      status: issues.length ? 'rejected' : 'new',
      statements: [
        `${batch.identities.length} identities`,
        `${batch.organizationIndustries.length} industry links`,
        `${batch.organizationCapabilities.length} capability statements`,
        `${batch.organizationRelationships.length} relationships`,
        `${batch.evidence.length} evidence records`,
      ],
      issues,
    },
  ]
  const normalised: ResearchBatch = { ...batch, batchId: `ws-${batch.batchId}`, coverage: batch.coverage ?? [] }
  return { ...base, fatal: null, rows, batch: normalised, summary: summarise(rows, batch.identities.length) }
}

/** Reference and evidence integrity for a research batch (used by the importer, validators and tests). */
export function validateResearchBatch(graph: IntelligenceGraph | null, batch: ResearchBatch): string[] {
  const problems: string[] = []
  for (const key of ['identities', 'evidence', 'organizationIndustries', 'organizationCapabilities', 'organizationRelationships', 'locations', 'scaleMetrics', 'openQuestions'] as const) {
    if (!Array.isArray(batch[key])) problems.push(`Missing array "${key}"`)
  }
  if (problems.length) return problems
  const evidenceIds = new Set(batch.evidence.map((row) => row.id))
  const orgIds = new Set(batch.identities.map((row) => row.id))
  const knownOrg = (id: string | null) => !id || orgIds.has(id) || Boolean(graph?.organizationById.has(id))
  const cite = (label: string, ids: string[], required: boolean) => {
    if (required && ids.length === 0) problems.push(`${label} has no evidence`)
    for (const id of ids) if (!evidenceIds.has(id) && !graph?.evidenceById.has(id)) problems.push(`${label} cites unknown evidence ${id}`)
  }
  for (const row of batch.evidence) if (!row.supports) problems.push(`Evidence ${row.id} does not say what it supports`)
  for (const row of batch.organizationIndustries) {
    if (!knownOrg(row.organizationId)) problems.push(`Industry link for unknown organization ${row.organizationId}`)
    if (graph && !graph.taxonomy.industryById.has(row.industryId)) problems.push(`Unknown industry ${row.industryId}`)
    cite(`Industry ${row.organizationId}/${row.industryId}`, row.evidenceIds, true)
  }
  for (const row of batch.organizationCapabilities) {
    if (!knownOrg(row.organizationId)) problems.push(`Capability for unknown organization ${row.organizationId}`)
    if (graph && !graph.taxonomy.capabilityById.has(row.capabilityId)) problems.push(`Unknown capability ${row.capabilityId}`)
    cite(`Capability ${row.organizationId}/${row.capabilityId}`, row.evidenceIds, row.status !== 'unknown')
  }
  for (const row of batch.organizationRelationships) {
    if (!knownOrg(row.fromId) || !knownOrg(row.toId)) problems.push(`Relationship references unknown organization ${row.fromId} -> ${row.toId}`)
    cite(`Relationship ${row.fromId}/${row.toId}`, row.evidenceIds, true)
  }
  for (const row of batch.scaleMetrics) {
    if (!knownOrg(row.organizationId)) problems.push(`Metric for unknown organization ${row.organizationId}`)
    cite(`Metric ${row.organizationId}/${row.metric}`, row.evidenceIds, true)
  }
  for (const row of batch.locations) if (!knownOrg(row.organizationId)) problems.push(`Location for unknown organization ${row.organizationId}`)
  return problems
}
