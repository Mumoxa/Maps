// Structured company-intelligence import library.
//
// The pipeline is: detect data type -> map fields -> normalise -> match existing
// entities -> review -> resolve -> commit -> audit. Nothing is committed unless
// the caller asks for it, and re-importing the same file is a no-op: entities and
// relationships are matched on canonical identity, so idempotency is structural
// rather than a special case.
//
// Used by scripts/import-organizations.ts (CLI) and by the test suite.

import { parse } from 'csv-parse/sync'
import { canonicalCompanyName } from '../src/data/companyNormalization'
import { ORGANIZATION_SCALE_METRICS } from '../src/data/organizations/types'
import type {
  Capability,
  CompanyAssociation,
  Industry,
  Organization,
  OrganizationCapabilityLink,
  OrganizationIndustryLink,
  OrganizationRelationship,
  OrganizationScale,
  OrganizationTaxonomyPlacement,
  RecruiterIntelligence,
  ScaleEntityScope,
} from '../src/data/organizations/types'
import { getTaxonomyNode } from '../src/data/taxonomy/load'
import { listingGate, verificationGate } from '../src/data/organizations/verification'
import { PROVINCES } from '../src/data/organizations/quality'

export type ImportType =
  | 'companies'
  | 'industries'
  | 'capabilities'
  | 'relationships'
  | 'associations'
  | 'intelligence'

export interface ImportRow {
  [key: string]: string
}

export interface ImportIssue {
  rowNumber: number
  field: string
  reason: string
}

export interface Dataset {
  industries: Industry[]
  capabilities: Capability[]
  organizations: Organization[]
  relationships: OrganizationRelationship[]
  associations: CompanyAssociation[]
  intelligence: RecruiterIntelligence[]
}

export interface ImportPlan {
  type: ImportType
  read: number
  newOrganizations: Organization[]
  updatedOrganizations: Organization[]
  newRelationships: OrganizationRelationship[]
  existingRelationships: number
  newAssociations: CompanyAssociation[]
  newIntelligence: RecruiterIntelligence[]
  matched: { rowNumber: number; organizationId: string; canonicalName: string }[]
  unmatchedNames: string[]
  duplicates: string[]
  conflicts: string[]
  missingRequired: ImportIssue[]
  issues: ImportIssue[]
  /** Companies the batch asked to verify, with the gate's decision. */
  verification: VerificationDecision[]
}

/** One batch's attempt to promote a company, and why it was refused if it was. */
export interface VerificationDecision {
  rowNumber: number
  organizationId: string
  canonicalName: string
  eligible: boolean
  reasons: string[]
}

const FIELD_ALIASES: Record<string, string[]> = {
  name: ['name', 'company', 'company_name', 'organisation', 'organization'],
  legalName: ['legal_name', 'legalname', 'legal_entity', 'registered_name'],
  aliases: ['aliases', 'alias', 'trading_names', 'trading_names'],
  website: ['website', 'url', 'domain', 'homepage'],
  industry: ['industry', 'sector', 'industry_id', 'main_industry'],
  subIndustry: ['sub_industry', 'subindustry', 'secondary_industry'],
  taxonomyNode: ['taxonomy_node', 'primary_node', 'taxonomy_primary', 'node'],
  secondaryNodes: ['secondary_nodes', 'taxonomy_nodes', 'additional_nodes'],
  primary: ['primary', 'is_primary'],
  province: ['province', 'region'],
  city: ['city', 'town'],
  employees: ['employees', 'employee_count', 'headcount', 'staff'],
  scaleMetric: ['scale_metric', 'metric'],
  scaleValue: ['scale_value', 'metric_value'],
  scaleBasis: ['scale_basis', 'metric_basis'],
  scaleAsOf: ['scale_as_of', 'as_of', 'metric_date'],
  entityScope: ['entity_scope', 'scale_entity_scope'],
  parent: ['parent', 'parent_company', 'parent_group'],
  sourceUrl: ['source_url', 'source', 'sourceurl', 'evidence_url'],
  sourceType: ['source_type', 'evidence_source_type'],
  evidence: ['evidence', 'evidence_summary', 'supports', 'note_evidence'],
  checkedOn: ['checked_on', 'date_verified', 'verified_on', 'observation_date'],
  confidence: ['confidence', 'confidence_level'],
  notes: ['notes', 'note', 'comments'],
  // A verification decision made by a reviewer, gated below before it is written.
  verificationStatus: ['verification_status', 'reviewed_status', 'promote_status'],
  noteAppend: ['note_append', 'append_note', 'research_note_append'],
  capability: ['capability', 'process', 'operational_capability', 'capability_id'],
  status: ['status', 'capability_status'],
  businessUnit: ['business_unit', 'unit', 'division'],
  type: ['type', 'relationship_type', 'kind'],
  from: ['from', 'from_company', 'parent_company', 'focal'],
  to: ['to', 'to_company', 'child_company', 'associated'],
  sharedProcesses: ['shared_processes', 'shared_capabilities'],
  narrative: ['narrative', 'explanation', 'reason', 'why'],
  relationshipType: ['relationship_type', 'relationship'],
  scope: ['scope', 'role_context', 'role'],
  observation: ['observation', 'observation_text', 'detail'],
  reviewer: ['reviewer', 'reviewed_by'],
}

/** Normalise header names onto the canonical field names. */
export function mapFields(row: ImportRow): ImportRow {
  const mapped: ImportRow = {}
  for (const [key, rawValue] of Object.entries(row)) {
    const header = key.trim().toLowerCase().replace(/[\s-]+/g, '_')
    const canonical = Object.entries(FIELD_ALIASES).find(([, aliases]) => aliases.includes(header))
    mapped[canonical ? canonical[0] : header] = (rawValue ?? '').trim()
  }
  return mapped
}

function parseJsonLike(content: string): ImportRow[] {
  const trimmed = content.trim()
  if (trimmed.startsWith('[')) {
    const parsed = JSON.parse(trimmed) as Record<string, unknown>[]
    return parsed.map((entry) => Object.fromEntries(
      Object.entries(entry).map(([key, value]) => [key, Array.isArray(value) ? value.join('; ') : String(value ?? '')]),
    ))
  }
  const rows: ImportRow[] = []
  for (const line of trimmed.split('\n')) {
    if (!line.trim()) continue
    const parsed = JSON.parse(line) as Record<string, unknown>
    rows.push(Object.fromEntries(
      Object.entries(parsed).map(([key, value]) => [key, Array.isArray(value) ? value.join('; ') : String(value ?? '')]),
    ))
  }
  return rows
}

/** Read a drop file. CSV, JSON array or JSONL are all accepted. */
export function readDrop(content: string): { rows: ImportRow[]; format: 'csv' | 'json' | 'jsonl' } {
  const trimmed = content.trim()
  if (trimmed.startsWith('[')) return { rows: parseJsonLike(trimmed), format: 'json' }
  if (trimmed.startsWith('{')) return { rows: parseJsonLike(trimmed), format: 'jsonl' }
  const rows = parse(trimmed, { columns: true, skip_empty_lines: true, relax_column_count: true }) as ImportRow[]
  return { rows, format: 'csv' }
}

/** Guess the record type from the headers, so the recruiter is not asked twice. */
/** The same header normalisation `mapFields` uses, so detection matches mapping. */
function headerKey(key: string): string {
  return key.trim().toLowerCase().replace(/[\s-]+/g, '_')
}

/**
 * Work out which canonical table a drop belongs to.
 *
 * Precedence is deliberate: an association carries a narrative or a shared-process
 * list (that is what it *is*), whereas a corporate relationship is just two known
 * companies and a type. Testing `relationship_type` first would silently route
 * every relationship file with a "Relationship Type" column into the associations
 * table, so the two-company test runs before it. `--type=` always overrides this.
 */
export function detectType(rows: ImportRow[]): ImportType {
  const headers = new Set(Object.keys(rows[0] ?? {}).map(headerKey))
  if (headers.has('shared_processes') || headers.has('narrative')) return 'associations'
  if (headers.has('observation') || (headers.has('kind') && !headers.has('from'))) return 'intelligence'
  if ((headers.has('from') || headers.has('from_company')) && (headers.has('to') || headers.has('to_company'))) return 'relationships'
  if (headers.has('relationship_type')) return 'associations'
  if (headers.has('capability') || headers.has('operational_capability')) return 'capabilities'
  if (headers.has('sub_industry') && !headers.has('website') && !headers.has('employees')) return 'industries'
  return 'companies'
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

function splitList(value: string | undefined): string[] {
  if (!value) return []
  return value.split(/[;|]/).map((entry) => entry.trim()).filter(Boolean)
}

function truthy(value: string | undefined): boolean {
  return ['true', 'yes', 'y', '1', 'primary'].includes((value ?? '').toLowerCase())
}

function resolveOrganization(
  dataset: Dataset,
  name: string,
): { organization: Organization | null; canonicalName: string } {
  const canonical = canonicalCompanyName(name)
  const key = canonical.toLowerCase()
  const found = dataset.organizations.find((organization) => (
    organization.id === name
    || canonicalCompanyName(organization.name).toLowerCase() === key
    || (organization.legalName && canonicalCompanyName(organization.legalName).toLowerCase() === key)
    || organization.aliases.some((alias) => canonicalCompanyName(alias).toLowerCase() === key)
  ))
  return { organization: found ?? null, canonicalName: canonical }
}

const TODAY = () => new Date().toISOString().slice(0, 10)

/**
 * Apply a batch's verification request to the record that would be written.
 *
 * `status` is never taken from the file. A row may only say that it is asking
 * for verification; whether the company becomes verified is decided here by the
 * shared gate, and a refusal is recorded with its reasons instead of being
 * silently ignored. Without this, a batch could mark a company verified while
 * writing none of the evidence that makes the word mean anything.
 */
function applyVerificationDecision(
  organization: Organization,
  row: ImportRow,
  plan: ImportPlan,
  rowNumber: number,
  canonicalName: string,
): void {
  const requested = (row.verificationStatus ?? row.status ?? '').trim().toLowerCase()
  if (!requested) return
  if (!VERIFICATION_REQUESTS.has(requested)) {
    plan.issues.push({
      rowNumber,
      field: 'verification_status',
      reason: `unsupported verification status "${requested}"; expected verified, listed-only or needs-verification`,
    })
    return
  }
  if (requested === 'needs-verification') {
    organization.status = 'needs-verification'
    return
  }
  const gate = verificationGate({
    organization,
    hasPlacement: organization.industries.length > 0 || Boolean(organization.taxonomy),
  })
  if (requested === 'listed-only') {
    // A listing claim only needs the listing. It is checked against the evidence
    // bar for what it actually asserts, not against the verified gate, so a
    // company can never be upgraded to verified by being asked for the weaker state.
    const listing = listingGate(organization)
    plan.verification.push({
      rowNumber,
      organizationId: organization.id,
      canonicalName,
      eligible: listing.eligible,
      reasons: listing.reasons,
    })
    if (listing.eligible) {
      if (organization.status !== 'verified') organization.status = 'listed-only'
      return
    }
    plan.issues.push({
      rowNumber,
      field: 'verification_status',
      reason: `${canonicalName} cannot be marked listed-only: ${listing.reasons.join('; ')}`,
    })
    return
  }
  plan.verification.push({
    rowNumber,
    organizationId: organization.id,
    canonicalName,
    eligible: gate.eligible,
    reasons: gate.reasons,
  })
  if (gate.eligible) {
    organization.status = 'verified'
    return
  }
  // Not an error: an incomplete company is the normal state of the register.
  // It is reported so the reviewer sees exactly what is still missing.
  plan.issues.push({
    rowNumber,
    field: 'verification_status',
    reason: `${canonicalName} cannot be verified yet: ${gate.reasons.join('; ')}`,
  })
}

/** Row-level status values the importer understands. */
const VERIFICATION_REQUESTS = new Set(['verified', 'listed-only', 'needs-verification'])

/** Build the change plan. Pure: it never writes. */
export function planImport(rows: ImportRow[], type: ImportType, dataset: Dataset): ImportPlan {
  const plan: ImportPlan = {
    type,
    read: rows.length,
    newOrganizations: [],
    updatedOrganizations: [],
    newRelationships: [],
    existingRelationships: 0,
    newAssociations: [],
    newIntelligence: [],
    matched: [],
    unmatchedNames: [],
    duplicates: [],
    conflicts: [],
    missingRequired: [],
    issues: [],
    verification: [],
  }

  // Multiple rows may enrich different measures for one company. Always merge
  // onto the latest planned version and replace that company's planned update,
  // rather than letting the last row overwrite all earlier rows in the batch.
  const workingOrganizations = new Map(dataset.organizations.map((entry) => [entry.id, entry]))
  const resolveCurrent = (name: string) => {
    const resolved = resolveOrganization(dataset, name)
    return {
      canonicalName: resolved.canonicalName,
      organization: resolved.organization
        ? workingOrganizations.get(resolved.organization.id) ?? resolved.organization
        : null,
    }
  }
  const upsertUpdatedOrganization = (updated: Organization) => {
    workingOrganizations.set(updated.id, updated)
    const index = plan.updatedOrganizations.findIndex((entry) => entry.id === updated.id)
    if (index >= 0) plan.updatedOrganizations[index] = updated
    else plan.updatedOrganizations.push(updated)
  }

  const requireField = (row: ImportRow, rowNumber: number, field: string): string => {
    const value = row[field] ?? ''
    if (!value) plan.missingRequired.push({ rowNumber, field, reason: 'required value missing' })
    return value
  }

  rows.forEach((rawRow, index) => {
    const row = mapFields(rawRow)
    const rowNumber = index + 1
    const checkedOn = row.checkedOn || TODAY()

    if (type === 'companies') {
      const name = requireField(row, rowNumber, 'name')
      if (!name) return
      const { organization, canonicalName } = resolveCurrent(name)
      const sourceUrl = row.sourceUrl ?? ''
      const taxonomy = buildTaxonomyPlacement(row, plan, rowNumber, checkedOn, sourceUrl)
      const industries: OrganizationIndustryLink[] = []
      for (const industryName of [row.industry, row.subIndustry].filter(Boolean) as string[]) {
        const industry = dataset.industries.find((entry) => (
          entry.id === slugify(industryName)
          || entry.name.toLowerCase() === industryName.toLowerCase()
          || entry.synonyms.some((synonym) => synonym.toLowerCase() === industryName.toLowerCase())
        ))
        if (!industry) {
          plan.issues.push({ rowNumber, field: 'industry', reason: `unknown industry "${industryName}"; add it to the taxonomy or leave the field empty` })
          continue
        }
        industries.push({
          industryId: industry.id,
          primary: industryName === row.industry,
          confidence: (row.confidence as OrganizationIndustryLink['confidence']) || 'probable',
          evidence: row.evidence ?? '',
          sourceUrl,
          checkedOn,
        })
      }
      if (organization) {
        const updated: Organization = {
          ...organization,
          ...(taxonomy ? { taxonomy } : {}),
          legalName: row.legalName || organization.legalName,
          website: row.website || organization.website,
          aliases: [...new Set([...organization.aliases, ...splitList(row.aliases)])],
          industries: mergeIndustryLinks(organization.industries, industries),
          locations: mergeLocations(organization, row, sourceUrl, checkedOn),
          scale: mergeScale(organization, row, sourceUrl, checkedOn, plan, rowNumber),
          notes: mergeNotes(organization.notes, row.notes, row.noteAppend),
          lastVerified: checkedOn > organization.lastVerified ? checkedOn : organization.lastVerified,
          sources: mergeSource(organization, sourceUrl, row.evidence, checkedOn, row),
        }
        if (row.parent) {
          const parent = resolveCurrent(row.parent).organization
          if (parent) {
            if (organization.parentId && organization.parentId !== parent.id) {
              plan.conflicts.push(`row ${rowNumber}: parent for ${canonicalName} changes from ${organization.parentId} to ${parent.id}`)
            }
            updated.parentId = parent.id
          } else {
            plan.unmatchedNames.push(row.parent)
          }
        }
        applyVerificationDecision(updated, row, plan, rowNumber, canonicalName)
        plan.matched.push({ rowNumber, organizationId: organization.id, canonicalName })
        upsertUpdatedOrganization(updated)
      } else {
        const id = `org-${slugify(canonicalName)}`
        if (dataset.organizations.some((entry) => entry.id === id)
          || plan.newOrganizations.some((entry) => entry.id === id)) {
          plan.duplicates.push(`row ${rowNumber}: "${canonicalName}" already appears in this drop or dataset`)
          return
        }
        const scaleEntry = buildScaleEntry(row, sourceUrl, checkedOn, plan, rowNumber)
        const created: Organization = {
          id,
          name: canonicalName,
          legalName: row.legalName ?? '',
          aliases: splitList(row.aliases),
          website: row.website ?? '',
          status: 'needs-verification',
          industries,
          taxonomy,
          capabilities: [],
          locations: (row.province || row.city)
            ? [{ city: (row.city ?? '').trim(), province: (row.province ?? '').trim(), sourceUrl, checkedOn }]
            : [],
          scale: scaleEntry ? [scaleEntry] : [],
          parentId: null,
          sources: sourceUrl ? [{
            url: sourceUrl,
            type: sourceTypeFromRow(row),
            evidence: row.evidence ?? 'Supplied through a structured import.',
            checkedOn,
            reviewer: row.reviewer ?? '',
            confidence: confidenceFromRow(row),
          }] : [],
          datasets: ['import'],
          lastVerified: checkedOn,
          notes: mergeNotes('', row.notes, row.noteAppend),
        }
        applyVerificationDecision(created, row, plan, rowNumber, canonicalName)
        plan.newOrganizations.push(created)
        workingOrganizations.set(created.id, created)
        if (row.parent) plan.unmatchedNames.push(row.parent)
      }
      return
    }

    // A corporate relationship names both of its ends, so it is resolved before
    // the shared focal-company step, which needs a `name` column.
    if (type === 'relationships') {
      const fromName = requireField(row, rowNumber, 'from')
      const toName = requireField(row, rowNumber, 'to')
      const relationshipType = (row.type || 'parent-of') as OrganizationRelationship['type']
      if (!fromName || !toName) return
      const from = resolveOrganization(dataset, fromName).organization
      const to = resolveOrganization(dataset, toName).organization
      if (!from || !to) {
        plan.unmatchedNames.push(from ? toName : fromName)
        return
      }
      const exists = dataset.relationships.some((entry) => (
        entry.type === relationshipType && entry.fromId === from.id && entry.toId === to.id
      ))
      if (exists) {
        plan.existingRelationships += 1
        return
      }
      plan.newRelationships.push({
        id: `rel-${slugify(`${from.name}-${relationshipType}-${to.name}`)}`,
        type: relationshipType,
        fromId: from.id,
        toId: to.id,
        evidence: row.evidence ?? '',
        sourceUrl: row.sourceUrl ?? '',
        confidence: (row.confidence as OrganizationRelationship['confidence']) || 'probable',
        checkedOn,
        note: row.notes ?? '',
      })
      return
    }

    // Every remaining table hangs off one focal company.
    const name = requireField(row, rowNumber, 'name')
    if (!name) return
    const { organization, canonicalName } = resolveCurrent(name)
    if (!organization) {
      plan.unmatchedNames.push(name)
      return
    }
    plan.matched.push({ rowNumber, organizationId: organization.id, canonicalName })

    if (type === 'capabilities') {
      const capabilityName = requireField(row, rowNumber, 'capability')
      if (!capabilityName) return
      const capability = dataset.capabilities.find((entry) => (
        entry.id === capabilityName
        || entry.id === slugify(capabilityName)
        || entry.name.toLowerCase() === capabilityName.toLowerCase()
        || entry.synonyms.some((synonym) => synonym.toLowerCase() === capabilityName.toLowerCase())
      ))
      if (!capability) {
        plan.issues.push({ rowNumber, field: 'capability', reason: `unknown capability "${capabilityName}"; add it to the taxonomy first` })
        return
      }
      const status = (row.status || 'observed') as OrganizationCapabilityLink['status']
      const link: OrganizationCapabilityLink = {
        capabilityId: capability.id,
        status,
        confidence: (row.confidence as OrganizationCapabilityLink['confidence']) || 'probable',
        evidence: row.evidence ?? '',
        sourceUrl: row.sourceUrl ?? '',
        checkedOn,
      }
      if (row.businessUnit) link.businessUnit = row.businessUnit
      const existing = organization.capabilities.find((entry) => entry.capabilityId === capability.id)
      if (existing && existing.status !== status) {
        plan.conflicts.push(`row ${rowNumber}: ${canonicalName} capability "${capability.name}" changes from ${existing.status} to ${status}`)
      }
      const updated = {
        ...organization,
        capabilities: existing
          ? organization.capabilities.map((entry) => (entry.capabilityId === capability.id ? link : entry))
          : [...organization.capabilities, link],
        lastVerified: checkedOn > organization.lastVerified ? checkedOn : organization.lastVerified,
        sources: mergeSource(organization, row.sourceUrl ?? '', row.evidence, checkedOn, row),
      }
      upsertUpdatedOrganization(updated)
      return
    }

    if (type === 'industries') {
      const industryName = requireField(row, rowNumber, 'industry')
      if (!industryName) return
      const industry = dataset.industries.find((entry) => (
        entry.id === industryName
        || entry.id === slugify(industryName)
        || entry.name.toLowerCase() === industryName.toLowerCase()
      ))
      if (!industry) {
        plan.issues.push({ rowNumber, field: 'industry', reason: `unknown industry "${industryName}"` })
        return
      }
      const link: OrganizationIndustryLink = {
        industryId: industry.id,
        primary: truthy(row.primary),
        confidence: (row.confidence as OrganizationIndustryLink['confidence']) || 'probable',
        evidence: row.evidence ?? '',
        sourceUrl: row.sourceUrl ?? '',
        checkedOn,
      }
      const updated = {
        ...organization,
        industries: mergeIndustryLinks(organization.industries, [link]),
        lastVerified: checkedOn > organization.lastVerified ? checkedOn : organization.lastVerified,
        sources: mergeSource(organization, row.sourceUrl ?? '', row.evidence, checkedOn, row),
      }
      upsertUpdatedOrganization(updated)
      return
    }

    if (type === 'associations') {
      const focal = organization
      const associated = resolveCurrent(row.to ?? row.associated ?? '').organization
      if (!associated) {
        plan.unmatchedNames.push(row.to ?? row.associated ?? '')
        return
      }
      const relationshipType = (row.relationshipType || 'shared-operating-process') as CompanyAssociation['relationshipType']
      const exists = dataset.associations.some((entry) => (
        entry.focalId === focal.id && entry.associatedId === associated.id && entry.relationshipType === relationshipType
      ))
      if (exists) {
        plan.existingRelationships += 1
        return
      }
      plan.newAssociations.push({
        id: `assoc-${slugify(`${focal.name}-${associated.name}`)}`,
        focalId: focal.id,
        associatedId: associated.id,
        relationshipType,
        sharedProcesses: splitList(row.sharedProcesses).map((entry) => slugify(entry)),
        sharedIndustries: [],
        valueChainOverlap: row.scope ?? '',
        narrative: row.narrative ?? '',
        evidence: row.evidence ?? '',
        sourceUrl: row.sourceUrl ?? '',
        confidence: (row.confidence as CompanyAssociation['confidence']) || 'hypothesis',
        status: 'curated',
        reviewer: row.reviewer ?? '',
        checkedOn,
      })
      return
    }

    // intelligence
    const record: RecruiterIntelligence = {
      id: `ri-${slugify(`${canonicalName}-${row.kind ?? 'note'}-${row.scope ?? 'general'}`)}`,
      organizationId: organization.id,
      kind: (row.kind || 'strong-source') as RecruiterIntelligence['kind'],
      scope: row.scope ?? '',
      observation: row.observation ?? row.notes ?? '',
      confidence: (row.confidence as RecruiterIntelligence['confidence']) || 'probable',
      source: row.sourceUrl ?? row.evidence ?? '',
      reviewer: row.reviewer ?? '',
      recordedOn: checkedOn,
    }
    const exists = dataset.intelligence.some((entry) => (
      entry.organizationId === record.organizationId
      && entry.kind === record.kind
      && entry.scope === record.scope
    ))
    if (exists) {
      plan.existingRelationships += 1
      return
    }
    plan.newIntelligence.push(record)
  })

  return plan
}

/**
 * Build a direct national-taxonomy placement from a row, resolving node ids
 * against the real sector tree so an invented node never enters the dataset.
 */
function buildTaxonomyPlacement(
  row: ImportRow,
  plan: ImportPlan,
  rowNumber: number,
  checkedOn: string,
  sourceUrl: string,
): OrganizationTaxonomyPlacement | null {
  const primary = (row.taxonomyNode ?? '').trim()
  if (!primary) return null
  if (!getTaxonomyNode(primary)) {
    plan.issues.push({ rowNumber, field: 'taxonomy_node', reason: `unknown taxonomy node "${primary}"` })
    return null
  }
  const secondaryNodes: string[] = []
  for (const nodeId of splitList(row.secondaryNodes)) {
    if (nodeId === primary) continue
    if (!getTaxonomyNode(nodeId)) {
      plan.issues.push({ rowNumber, field: 'secondary_nodes', reason: `unknown taxonomy node "${nodeId}"` })
      continue
    }
    if (!secondaryNodes.includes(nodeId)) secondaryNodes.push(nodeId)
  }
  return {
    primaryNode: primary,
    secondaryNodes,
    confidence: (row.confidence as OrganizationTaxonomyPlacement['confidence']) || 'probable',
    evidence: row.evidence ?? '',
    sourceUrl,
    checkedOn,
  }
}

function mergeIndustryLinks(existing: OrganizationIndustryLink[], incoming: OrganizationIndustryLink[]): OrganizationIndustryLink[] {
  const merged = [...existing]
  for (const link of incoming) {
    const index = merged.findIndex((entry) => entry.industryId === link.industryId)
    if (index >= 0) merged[index] = { ...merged[index], ...link }
    else merged.push(link)
  }
  return merged
}

/**
 * Record a sourced place, at whatever precision the source actually gave.
 *
 * A province on its own is a complete answer and the normal case. A city on its
 * own is also recorded, with the province left empty: the province then shows up
 * as a research gap, which is honest, whereas inferring it from the city name
 * would put a guess where every geographic filter reads. Neither field is ever
 * derived from the other, and a row with neither adds nothing.
 */
function mergeLocations(organization: Organization, row: ImportRow, sourceUrl: string, checkedOn: string) {
  let province = (row.province ?? '').trim()
  let city = (row.city ?? '').trim()
  // Sources routinely put a city in their province column. Store what the source
  // actually said - the city - and leave the province empty, rather than copying a
  // city into a field every geographic filter reads as a province.
  if (province && !PROVINCES.includes(province)) {
    if (!city) city = province
    province = ''
  }
  if (!province && !city) return organization.locations
  const exists = organization.locations.some((location) => (
    location.province.trim() === province && (location.city ?? '').trim() === city
  ))
  if (exists) return organization.locations
  return [...organization.locations, { city, province, sourceUrl, checkedOn }]
}

const SOURCE_TYPES = new Set([
  'company-website', 'corporate-disclosure', 'business-directory', 'industry-directory',
  'industry-report', 'news', 'recruiter-supplied', 'system-inferred', 'internal-dataset',
])
const CONFIDENCES = new Set(['confirmed', 'probable', 'hypothesis', 'unknown'])
const SCALE_BASES = new Set(['source-reported', 'third-party-estimate'])
const ENTITY_SCOPES = new Set([
  'consolidated-group', 'south-african-operation', 'operating-division', 'standalone-entity', 'not-stated',
])

function sourceTypeFromRow(row: ImportRow): Organization['sources'][number]['type'] {
  return SOURCE_TYPES.has(row.sourceType ?? '')
    ? row.sourceType as Organization['sources'][number]['type']
    : 'recruiter-supplied'
}

function confidenceFromRow(row: ImportRow): NonNullable<OrganizationScale['confidence']> {
  return CONFIDENCES.has(row.confidence ?? '')
    ? row.confidence as NonNullable<OrganizationScale['confidence']>
    : 'probable'
}

function buildScaleEntry(
  row: ImportRow,
  sourceUrl: string,
  checkedOn: string,
  plan: ImportPlan,
  rowNumber: number,
): OrganizationScale | null {
  const value = row.scaleValue || row.employees || ''
  const metric = row.scaleMetric || (row.employees ? 'employees' : '')
  if (!value && !metric) return null
  if (!value || !metric) {
    plan.issues.push({ rowNumber, field: 'scale_value', reason: 'scale_metric and scale_value must be supplied together' })
    return null
  }
  if (!ORGANIZATION_SCALE_METRICS.includes(metric as OrganizationScale['metric'])) {
    plan.issues.push({ rowNumber, field: 'scale_metric', reason: `unsupported scale metric "${metric}"` })
    return null
  }
  if (!sourceUrl) {
    plan.issues.push({ rowNumber, field: 'source_url', reason: 'a scale measure requires a source URL' })
    return null
  }
  const basis = row.scaleBasis || 'source-reported'
  if (!SCALE_BASES.has(basis)) {
    plan.issues.push({ rowNumber, field: 'scale_basis', reason: `unsupported scale basis "${basis}"` })
    return null
  }
  if (row.entityScope && !ENTITY_SCOPES.has(row.entityScope)) {
    plan.issues.push({ rowNumber, field: 'entity_scope', reason: `unsupported entity scope "${row.entityScope}"` })
    return null
  }
  if (row.confidence && !CONFIDENCES.has(row.confidence)) {
    plan.issues.push({ rowNumber, field: 'confidence', reason: `unsupported confidence "${row.confidence}"` })
    return null
  }
  return {
    metric: metric as OrganizationScale['metric'],
    value,
    basis: basis as OrganizationScale['basis'],
    ...(row.confidence ? { confidence: confidenceFromRow(row) } : {}),
    asOf: row.scaleAsOf || checkedOn,
    sourceUrl,
    checkedOn,
    ...(row.entityScope ? { entityScope: row.entityScope as ScaleEntityScope } : {}),
  }
}

/**
 * Reduce a scale figure to what it actually asserts, so two spellings of the same
 * fact collapse instead of stacking.
 *
 * "over 27000 people" and "more than 27 000 employees" are one headcount, not
 * two, and a dossier that showed both would look better researched than it is.
 * The comparison keeps the qualifier (over/under/about) and the first number,
 * because those change what the figure means; it discards the wording around them.
 */
export function scaleFingerprint(entry: Pick<OrganizationScale, 'metric' | 'value' | 'entityScope'>): string {
  const value = entry.value.toLowerCase()
  const qualifier = /(under|below|fewer)/.test(value) ? 'under'
    : /(over|more than|above|exceed)/.test(value) ? 'over'
      : /(about|approximately|circa|around)/.test(value) ? 'about'
        : ''
  const numbers = value.match(/\d[\d\s.,]*/g) ?? []
  const magnitude = numbers
    .map((raw) => raw.replace(/[\s,]/g, '').replace(/\.$/, ''))
    .filter((raw) => raw !== '')
    .join('-')
  return [entry.metric, qualifier, magnitude, entry.entityScope ?? 'not-stated'].join('|')
}

function mergeScale(
  organization: Organization,
  row: ImportRow,
  sourceUrl: string,
  checkedOn: string,
  plan: ImportPlan,
  rowNumber: number,
): OrganizationScale[] {
  const incoming = buildScaleEntry(row, sourceUrl, checkedOn, plan, rowNumber)
  if (!incoming) return organization.scale
  const exact = organization.scale.findIndex((entry) => (
    entry.metric === incoming.metric
    && entry.value === incoming.value
    && entry.asOf === incoming.asOf
    && entry.sourceUrl === incoming.sourceUrl
    && (entry.entityScope ?? '') === (incoming.entityScope ?? '')
  ))
  const index = exact >= 0
    ? exact
    : organization.scale.findIndex((entry) => scaleFingerprint(entry) === scaleFingerprint(incoming))
  if (exact < 0 && index >= 0) {
    // Same fact, different wording: say so rather than silently picking one.
    plan.issues.push({
      rowNumber,
      field: 'scale_value',
      reason: `${organization.name} already records ${organization.scale[index].metric} as "${organization.scale[index].value}" from the same scope; "${incoming.value}" restates it, so the existing measure was kept`,
    })
  }
  if (index < 0) return [...organization.scale, incoming]
  const merged = [...organization.scale]
  const existing = merged[index]
  const checkedOnLatest = incoming.checkedOn > existing.checkedOn ? incoming.checkedOn : existing.checkedOn
  // A restatement confirms the fact again; it does not get to rewrite the figure
  // already on record to a different wording of the same number.
  merged[index] = exact >= 0
    ? { ...existing, ...incoming, checkedOn: checkedOnLatest }
    : { ...existing, checkedOn: checkedOnLatest }
  return merged
}

function mergeNotes(existing: string, replacement: string | undefined, append: string | undefined): string {
  let notes = replacement?.trim() || existing
  const addition = append?.trim()
  if (addition && !notes.includes(addition)) notes = [notes, addition].filter(Boolean).join('\n')
  return notes
}

function mergeSource(
  organization: Organization,
  url: string,
  evidence: string | undefined,
  checkedOn: string,
  row: ImportRow = {},
) {
  if (!url) return organization.sources
  const index = organization.sources.findIndex((source) => source.url === url)
  if (index < 0) {
    return [...organization.sources, {
      url,
      type: sourceTypeFromRow(row),
      evidence: evidence ?? 'Added through a structured import.',
      checkedOn,
      reviewer: row.reviewer ?? '',
      confidence: confidenceFromRow(row),
    }]
  }
  const existing = organization.sources[index]
  const addition = evidence?.trim()
  const mergedEvidence = addition && !existing.evidence.includes(addition)
    ? [existing.evidence, addition].filter(Boolean).join(' | ')
    : existing.evidence
  const confidenceRank = { unknown: 0, hypothesis: 1, probable: 2, confirmed: 3 }
  const existingConfidence = existing.confidence ?? 'probable'
  const confidence = confidenceRank[confidenceFromRow(row)] > confidenceRank[existingConfidence]
    ? confidenceFromRow(row)
    : existingConfidence
  const updated = {
    ...existing,
    ...(row.sourceType && SOURCE_TYPES.has(row.sourceType) ? { type: sourceTypeFromRow(row) } : {}),
    evidence: mergedEvidence || 'Added through a structured import.',
    checkedOn: checkedOn > existing.checkedOn ? checkedOn : existing.checkedOn,
    reviewer: existing.reviewer || row.reviewer || '',
    confidence,
  }
  if (JSON.stringify(updated) === JSON.stringify(existing)) return organization.sources
  const sources = [...organization.sources]
  sources[index] = updated
  return sources
}

/** Apply a plan onto a dataset copy. Deterministic, so re-applying is a no-op. */
export function applyPlan(dataset: Dataset, plan: ImportPlan): Dataset {
  const updatesById = new Map(plan.updatedOrganizations.map((organization) => [organization.id, organization]))
  // Preserve canonical register order. Sorting the entire universe on every
  // import creates thousands of unrelated diff lines and obscures review.
  const organizations = dataset.organizations.map((organization) => updatesById.get(organization.id) ?? organization)
  const existingIds = new Set(organizations.map((organization) => organization.id))
  for (const organization of plan.newOrganizations) {
    if (!existingIds.has(organization.id)) organizations.push(organization)
  }
  return {
    industries: dataset.industries,
    capabilities: dataset.capabilities,
    organizations,
    relationships: [...dataset.relationships, ...plan.newRelationships],
    associations: [...dataset.associations, ...plan.newAssociations],
    intelligence: [...dataset.intelligence, ...plan.newIntelligence],
  }
}

export function planSummary(plan: ImportPlan) {
  return {
    type: plan.type,
    read: plan.read,
    newOrganizations: plan.newOrganizations.length,
    updatedOrganizations: plan.updatedOrganizations.length,
    newRelationships: plan.newRelationships.length,
    newAssociations: plan.newAssociations.length,
    newIntelligence: plan.newIntelligence.length,
    existingRelationships: plan.existingRelationships,
    matchedRows: plan.matched.length,
    unmatchedNames: [...new Set(plan.unmatchedNames)],
    duplicates: plan.duplicates,
    conflicts: plan.conflicts,
    missingRequired: plan.missingRequired,
    issues: plan.issues,
    verification: {
      requested: plan.verification.length,
      granted: plan.verification.filter((decision) => decision.eligible).length,
      refused: plan.verification.filter((decision) => !decision.eligible).length,
      refusals: plan.verification
        .filter((decision) => !decision.eligible)
        .map((decision) => ({ company: decision.canonicalName, reasons: decision.reasons })),
    },
  }
}
