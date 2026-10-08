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
import type {
  Capability,
  CompanyAssociation,
  Industry,
  Organization,
  OrganizationCapabilityLink,
  OrganizationIndustryLink,
  OrganizationRelationship,
  RecruiterIntelligence,
} from '../src/data/organizations/types'

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
}

const FIELD_ALIASES: Record<string, string[]> = {
  name: ['name', 'company', 'company_name', 'organisation', 'organization'],
  legalName: ['legal_name', 'legalname', 'legal_entity', 'registered_name'],
  aliases: ['aliases', 'alias', 'trading_names', 'trading_names'],
  website: ['website', 'url', 'domain', 'homepage'],
  industry: ['industry', 'sector', 'industry_id', 'main_industry'],
  subIndustry: ['sub_industry', 'subindustry', 'secondary_industry'],
  primary: ['primary', 'is_primary'],
  province: ['province', 'region'],
  city: ['city', 'town'],
  employees: ['employees', 'employee_count', 'headcount', 'staff'],
  parent: ['parent', 'parent_company', 'parent_group'],
  sourceUrl: ['source_url', 'source', 'sourceurl', 'evidence_url'],
  evidence: ['evidence', 'evidence_summary', 'supports', 'note_evidence'],
  checkedOn: ['checked_on', 'date_verified', 'verified_on', 'observation_date'],
  confidence: ['confidence', 'confidence_level'],
  notes: ['notes', 'note', 'comments'],
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
    || organization.name.toLowerCase() === key
    || (organization.legalName && organization.legalName.toLowerCase() === key)
    || organization.aliases.some((alias) => alias.toLowerCase() === key)
  ))
  return { organization: found ?? null, canonicalName: canonical }
}

const TODAY = () => new Date().toISOString().slice(0, 10)

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
      const { organization, canonicalName } = resolveOrganization(dataset, name)
      const sourceUrl = row.sourceUrl ?? ''
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
          legalName: row.legalName || organization.legalName,
          website: row.website || organization.website,
          aliases: [...new Set([...organization.aliases, ...splitList(row.aliases)])],
          industries: mergeIndustryLinks(organization.industries, industries),
          locations: mergeLocations(organization, row, sourceUrl, checkedOn),
          scale: mergeScale(organization, row, sourceUrl, checkedOn),
          notes: row.notes || organization.notes,
          lastVerified: checkedOn > organization.lastVerified ? checkedOn : organization.lastVerified,
          sources: mergeSource(organization, sourceUrl, row.evidence, checkedOn),
        }
        if (row.parent) {
          const parent = resolveOrganization(dataset, row.parent).organization
          if (parent) {
            if (organization.parentId && organization.parentId !== parent.id) {
              plan.conflicts.push(`row ${rowNumber}: parent for ${canonicalName} changes from ${organization.parentId} to ${parent.id}`)
            }
            updated.parentId = parent.id
          } else {
            plan.unmatchedNames.push(row.parent)
          }
        }
        plan.matched.push({ rowNumber, organizationId: organization.id, canonicalName })
        plan.updatedOrganizations.push(updated)
      } else {
        const id = `org-${slugify(canonicalName)}`
        if (dataset.organizations.some((entry) => entry.id === id)
          || plan.newOrganizations.some((entry) => entry.id === id)) {
          plan.duplicates.push(`row ${rowNumber}: "${canonicalName}" already appears in this drop or dataset`)
          return
        }
        plan.newOrganizations.push({
          id,
          name: canonicalName,
          legalName: row.legalName ?? '',
          aliases: splitList(row.aliases),
          website: row.website ?? '',
          status: 'needs-verification',
          industries,
          capabilities: [],
          locations: row.province ? [{ city: row.city ?? '', province: row.province, sourceUrl, checkedOn }] : [],
          scale: row.employees ? [{
            metric: 'employees',
            value: row.employees,
            basis: 'source-reported',
            asOf: checkedOn,
            sourceUrl,
            checkedOn,
          }] : [],
          parentId: null,
          sources: sourceUrl ? [{
            url: sourceUrl,
            type: 'recruiter-supplied',
            evidence: row.evidence ?? 'Supplied through a structured import.',
            checkedOn,
            reviewer: row.reviewer ?? '',
            confidence: (row.confidence as Organization['sources'][number]['confidence']) || 'probable',
          }] : [],
          datasets: ['import'],
          lastVerified: checkedOn,
          notes: row.notes ?? '',
        })
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
    const { organization, canonicalName } = resolveOrganization(dataset, name)
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
        sources: mergeSource(organization, row.sourceUrl ?? '', row.evidence, checkedOn),
      }
      plan.updatedOrganizations.push(updated)
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
        sources: mergeSource(organization, row.sourceUrl ?? '', row.evidence, checkedOn),
      }
      plan.updatedOrganizations.push(updated)
      return
    }

    if (type === 'associations') {
      const focal = organization
      const associated = resolveOrganization(dataset, row.to ?? row.associated ?? '').organization
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

function mergeIndustryLinks(existing: OrganizationIndustryLink[], incoming: OrganizationIndustryLink[]): OrganizationIndustryLink[] {
  const merged = [...existing]
  for (const link of incoming) {
    const index = merged.findIndex((entry) => entry.industryId === link.industryId)
    if (index >= 0) merged[index] = { ...merged[index], ...link }
    else merged.push(link)
  }
  return merged
}

function mergeLocations(organization: Organization, row: ImportRow, sourceUrl: string, checkedOn: string) {
  if (!row.province) return organization.locations
  const exists = organization.locations.some((location) => (
    location.province === row.province && (location.city ?? '') === (row.city ?? '')
  ))
  if (exists) return organization.locations
  return [...organization.locations, { city: row.city ?? '', province: row.province, sourceUrl, checkedOn }]
}

function mergeScale(organization: Organization, row: ImportRow, sourceUrl: string, checkedOn: string) {
  if (!row.employees) return organization.scale
  const exists = organization.scale.some((entry) => entry.metric === 'employees' && entry.value === row.employees)
  if (exists) return organization.scale
  return [...organization.scale, {
    metric: 'employees' as const,
    value: row.employees,
    basis: 'source-reported' as const,
    asOf: checkedOn,
    sourceUrl,
    checkedOn,
  }]
}

function mergeSource(organization: Organization, url: string, evidence: string | undefined, checkedOn: string) {
  if (!url) return organization.sources
  if (organization.sources.some((source) => source.url === url)) return organization.sources
  return [...organization.sources, {
    url,
    type: 'recruiter-supplied' as const,
    evidence: evidence ?? 'Added through a structured import.',
    checkedOn,
    reviewer: '',
    confidence: 'probable' as const,
  }]
}

/** Apply a plan onto a dataset copy. Deterministic, so re-applying is a no-op. */
export function applyPlan(dataset: Dataset, plan: ImportPlan): Dataset {
  const organizationsById = new Map(dataset.organizations.map((organization) => [organization.id, organization]))
  for (const organization of plan.newOrganizations) organizationsById.set(organization.id, organization)
  for (const organization of plan.updatedOrganizations) organizationsById.set(organization.id, organization)
  return {
    industries: dataset.industries,
    capabilities: dataset.capabilities,
    organizations: [...organizationsById.values()].sort((left, right) => left.id.localeCompare(right.id)),
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
  }
}
