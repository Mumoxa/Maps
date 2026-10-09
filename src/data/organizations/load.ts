// Canonical organization universe: the rich curated records plus every company
// name the existing Maps datasets already reference, resolved onto one identity
// so a business is never recreated per search or per track.
//
// Nothing here invents a company. Where a dataset mentions an employer that has
// no curated record yet, it becomes an organization with status
// `needs-verification`, no asserted capabilities and a `datasets` provenance
// list, so the UI can say "not yet researched" instead of showing a zero.

import organizationsRaw from '../../../markets/organizations/organizations.json'
import industriesRaw from '../../../markets/organizations/industries.json'
import pocketsRaw from '../../../markets/organizations/pockets.json'
import capabilitiesRaw from '../../../markets/organizations/capabilities.json'
import relationshipsRaw from '../../../markets/organizations/corporate-relationships.json'
import associationsRaw from '../../../markets/organizations/associations.json'
import intelligenceRaw from '../../../markets/organizations/recruiter-intelligence.json'
import { canonicalCompanyName } from '../companyNormalization'
import type {
  AssociationMatch,
  Capability,
  CompanyAssociation,
  Industry,
  IndustryPocket,
  Organization,
  OrganizationRelationship,
  RecruiterIntelligence,
} from './types'

export const organizations = organizationsRaw as Organization[]
export const industries = industriesRaw as Industry[]
export const pockets = pocketsRaw as IndustryPocket[]
export const capabilities = capabilitiesRaw as Capability[]
export const corporateRelationships = relationshipsRaw as OrganizationRelationship[]
export const curatedAssociations = associationsRaw as CompanyAssociation[]
export const recruiterIntelligence = intelligenceRaw as RecruiterIntelligence[]

/** A company name seen in a Maps dataset, before identity is established. */
export interface DatasetEmployer {
  name: string
  dataset: string
  /** People mapped at this employer inside that dataset. */
  professionals: number
  /** Extra classification the source dataset carried, kept as market-specific context. */
  classification: string
  /** Original position company values in the contacts source. */
  sourceNames?: string[]
  /** Unique contact ids, for accurate deduplication across company aliases. */
  personIds?: string[]
}

/** What one employer name resolves to across every dataset Maps holds. */
export interface ResolvedEmployer {
  organizationId: string
  canonicalName: string
  datasets: string[]
  professionals: number
  professionalSources: { dataset: string; count: number }[]
  classifications: { dataset: string; value: string }[]
  /** Source employer spellings, not independently verified legal aliases. */
  contactEmployerNames: string[]
}

export interface OrganizationIndex {
  organizations: Organization[]
  byId: Map<string, Organization>
  /** Lowercase canonical name -> organization id. Built once, never searched in a loop. */
  idByCanonical: Map<string, string>
  /** Lowercase alias (including dataset spellings) -> organization id. */
  idByAlias: Map<string, string>
  industryById: Map<string, Industry>
  pocketById: Map<string, IndustryPocket>
  capabilityById: Map<string, Capability>
  /** Pocket -> organization ids. */
  orgsByPocket: Map<string, string[]>
  industryOrgs: Map<string, string[]>
  capabilityOrgs: Map<string, string[]>
  provinceOrgs: Map<string, string[]>
  employersByOrg: Map<string, ResolvedEmployer>
  childrenByParent: Map<string, string[]>
  relationshipsByOrg: Map<string, OrganizationRelationship[]>
  associationsByFocal: Map<string, CompanyAssociation[]>
  intelligenceByOrg: Map<string, RecruiterIntelligence[]>
  /** Curated associations are also indexed by their associated company. */
  associationsByAssociated: Map<string, CompanyAssociation[]>
}

export const TODAY_CHECKED = organizations.reduce(
  (latest, organization) => (organization.lastVerified > latest ? organization.lastVerified : latest),
  '',
)

function push(map: Map<string, string[]>, key: string, value: string): void {
  const list = map.get(key)
  if (list) {
    if (!list.includes(value)) list.push(value)
  } else {
    map.set(key, [value])
  }
}

function normalizeKey(name: string): string {
  return canonicalCompanyName(name).toLowerCase()
}

/**
 * Resolve an arbitrary employer string to a canonical organization.
 * Falls back to the canonical display name so unknown employers still resolve
 * deterministically instead of being dropped.
 */
export function resolveEmployerKey(name: string): string {
  return normalizeKey(name)
}

interface BuildIndexInput {
  /** Employer names referenced by each existing Maps dataset. */
  datasetEmployers?: DatasetEmployer[]
}

export function buildOrganizationIndex(input: BuildIndexInput = {}): OrganizationIndex {
  const industryById = new Map(industries.map((industry) => [industry.id, industry]))
  const pocketById = new Map(pockets.map((pocket) => [pocket.id, pocket]))
  const capabilityById = new Map(capabilities.map((capability) => [capability.id, capability]))

  const byId = new Map<string, Organization>()
  const idByCanonical = new Map<string, string>()
  const idByAlias = new Map<string, string>()

  for (const organization of organizations) {
    byId.set(organization.id, organization)
    idByCanonical.set(normalizeKey(organization.name), organization.id)
    idByAlias.set(normalizeKey(organization.name), organization.id)
    if (organization.legalName) idByAlias.set(normalizeKey(organization.legalName), organization.id)
    for (const alias of organization.aliases) idByAlias.set(normalizeKey(alias), organization.id)
  }

  const orgsByPocket = new Map<string, string[]>()
  const industryOrgs = new Map<string, string[]>()
  const capabilityOrgs = new Map<string, string[]>()
  const provinceOrgs = new Map<string, string[]>()
  const childrenByParent = new Map<string, string[]>()

  for (const organization of organizations) {
    const pocketIds = new Set<string>()
    for (const link of organization.industries) {
      push(industryOrgs, link.industryId, organization.id)
      const industry = industryById.get(link.industryId)
      if (industry) pocketIds.add(industry.pocket)
    }
    for (const pocketId of pocketIds) push(orgsByPocket, pocketId, organization.id)
    for (const link of organization.capabilities) {
      if (link.status === 'observed') push(capabilityOrgs, link.capabilityId, organization.id)
    }
    for (const location of organization.locations) {
      if (location.province) push(provinceOrgs, location.province, organization.id)
    }
    if (organization.parentId) push(childrenByParent, organization.parentId, organization.id)
  }

  // Dataset employers resolve onto curated records where identity is established.
  const employersByOrg = new Map<string, ResolvedEmployer>()
  const seenContactsByOrg = new Map<string, Set<string>>()
  for (const employer of input.datasetEmployers ?? []) {
    const canonical = canonicalCompanyName(employer.name)
    if (!canonical) continue
    const key = canonical.toLowerCase()
    const organizationId = idByAlias.get(key) ?? idByCanonical.get(key) ?? `org-dataset:${key}`
    // Two distinct employer strings can resolve to one curated organization.
    // Count a source contact once at that organization, not once per alias.
    let professionals = employer.professionals
    if (employer.dataset === 'contacts' && employer.personIds) {
      const seen = seenContactsByOrg.get(organizationId) ?? new Set<string>()
      professionals = 0
      for (const personId of employer.personIds) {
        if (!seen.has(personId)) { seen.add(personId); professionals += 1 }
      }
      seenContactsByOrg.set(organizationId, seen)
    }
    const contactNames = employer.dataset === 'contacts'
      ? (employer.sourceNames?.length ? employer.sourceNames : [employer.name])
      : []
    const existing = employersByOrg.get(organizationId)
    if (existing) {
      if (!existing.datasets.includes(employer.dataset)) existing.datasets.push(employer.dataset)
      existing.professionals += professionals
      const source = existing.professionalSources.find((row) => row.dataset === employer.dataset)
      if (source) source.count += professionals
      else existing.professionalSources.push({ dataset: employer.dataset, count: professionals })
      for (const name of contactNames) {
        if (!existing.contactEmployerNames.includes(name)) existing.contactEmployerNames.push(name)
      }
      if (employer.classification) {
        existing.classifications.push({ dataset: employer.dataset, value: employer.classification })
      }
    } else {
      employersByOrg.set(organizationId, {
        organizationId,
        canonicalName: canonical,
        datasets: [employer.dataset],
        professionals,
        professionalSources: [{ dataset: employer.dataset, count: professionals }],
        classifications: employer.classification ? [{ dataset: employer.dataset, value: employer.classification }] : [],
        contactEmployerNames: [...contactNames],
      })
    }
  }

  const relationshipsByOrg = new Map<string, OrganizationRelationship[]>()
  for (const relationship of corporateRelationships) {
    for (const orgId of [relationship.fromId, relationship.toId]) {
      const list = relationshipsByOrg.get(orgId)
      if (list) list.push(relationship)
      else relationshipsByOrg.set(orgId, [relationship])
    }
  }

  const associationsByFocal = new Map<string, CompanyAssociation[]>()
  const associationsByAssociated = new Map<string, CompanyAssociation[]>()
  for (const association of curatedAssociations) {
    const focalList = associationsByFocal.get(association.focalId)
    if (focalList) focalList.push(association)
    else associationsByFocal.set(association.focalId, [association])
    const associatedList = associationsByAssociated.get(association.associatedId)
    if (associatedList) associatedList.push(association)
    else associationsByAssociated.set(association.associatedId, [association])
  }

  const intelligenceByOrg = new Map<string, RecruiterIntelligence[]>()
  for (const record of recruiterIntelligence) {
    const list = intelligenceByOrg.get(record.organizationId)
    if (list) list.push(record)
    else intelligenceByOrg.set(record.organizationId, [record])
  }

  return {
    organizations,
    byId,
    idByCanonical,
    idByAlias,
    industryById,
    pocketById,
    capabilityById,
    orgsByPocket,
    industryOrgs,
    capabilityOrgs,
    provinceOrgs,
    employersByOrg,
    childrenByParent,
    relationshipsByOrg,
    associationsByFocal,
    associationsByAssociated,
    intelligenceByOrg,
  }
}

/**
 * Resolve a position employer string onto the same company id used by the
 * Companies directory and company dossier. Unverified companies remain
 * dataset-only organisations, never guessed to be a registered entity.
 */
export function resolveEmployerOrganizationId(index: OrganizationIndex, rawName: string): string | null {
  const key = normalizeKey(rawName)
  if (!key) return null
  const curated = index.idByAlias.get(key) ?? index.idByCanonical.get(key)
  if (curated) return curated
  const datasetId = `org-dataset:${key}`
  return index.employersByOrg.has(datasetId) ? datasetId : null
}

/**
 * Link to every contact whose sourced position names this employer, including
 * alternate spellings that map to the same curated company. The contact-directory
 * filter performs OR matching across repeated "companies" parameters.
 */
export function contactDirectoryUrlForEmployer(employer: ResolvedEmployer): string | null {
  if (!employer.contactEmployerNames.length) return null
  const names = [...new Set(employer.contactEmployerNames.map(canonicalCompanyName).filter(Boolean))]
  const params = new URLSearchParams()
  for (const name of names) params.append('companies', name)
  return `/contacts?${params.toString()}`
}

/** Every organization the explorer can display, including dataset-only employers. */
export function visibleOrganizations(index: OrganizationIndex): Organization[] {
  const extra: Organization[] = []
  for (const employer of index.employersByOrg.values()) {
    if (index.byId.has(employer.organizationId)) continue
    extra.push(datasetOrganization(employer))
  }
  return [...index.organizations, ...extra].sort((left, right) => left.name.localeCompare(right.name))
}

/** A dataset-only employer rendered as an organization with nothing asserted. */
export function datasetOrganization(employer: ResolvedEmployer): Organization {
  return {
    id: employer.organizationId,
    name: employer.canonicalName,
    legalName: '',
    aliases: [],
    website: '',
    status: 'needs-verification',
    industries: [],
    capabilities: [],
    locations: [],
    scale: [],
    parentId: null,
    sources: [],
    datasets: employer.datasets,
    lastVerified: '',
    notes: 'Referenced by existing Maps datasets; no curated company record yet.',
  }
}

/** Professionals already known to Maps at one organization, by dataset. */
export function mappedProfessionalsFor(index: OrganizationIndex, organizationId: string): ResolvedEmployer | undefined {
  return index.employersByOrg.get(organizationId)
}

export type { AssociationMatch }
