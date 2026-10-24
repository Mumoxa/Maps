// Composition root for the company-intelligence layer.
//
// Builds one index over the curated organization records plus every employer the
// existing Maps datasets already reference, so the explorer, the company
// directory, Search Bank targets and the research export all read the same
// universe. Both the app and the tests call this, so the tests exercise the code
// the recruiter actually uses.

import { accountantCandidates, currentAccountantAffiliations, type AccountantCandidate } from '../accountantsPeople'
import { bankCandidates } from '../searchBank/bank'
import contactEmployerManifest from '../../../markets/organizations/contact-employers.json'
import { canonicalCompanyName } from '../companyNormalization'
import { buildOrganizationIndex, resolveEmployerOrganizationId, visibleOrganizations } from './load'
import type { DatasetEmployer, OrganizationIndex } from './load'
import type { Organization } from './types'

export interface CompanyDatasetCompany {
  name: string
  segment?: string
  profileCount?: number
}

export interface DatasetSources {
  /** Credit Risk companies from the bundled dataset (optional, supplied by the page). */
  creditRiskCompanies?: CompanyDatasetCompany[]
  /** Accounting records may come from the bundled pool or an import preview. */
  accountingFinanceCandidates?: AccountantCandidate[]
}

/** Count current mapped people once at each resolved company, including board/group affiliations. */
function accountantDatasetEmployers(candidates: AccountantCandidate[]): DatasetEmployer[] {
  const index = buildOrganizationIndex()
  const byOrganization = new Map<string, { name: string; people: Set<string>; relationships: Set<string> }>()
  for (const candidate of candidates) {
    if (candidate.status === 'REJECTED') continue
    const affiliations = [
      { company: candidate.employer, relationship: '' },
      ...currentAccountantAffiliations(candidate),
    ]
    for (const affiliation of affiliations) {
      const canonical = canonicalCompanyName(affiliation.company)
      if (!canonical) continue
      const id = resolveEmployerOrganizationId(index, canonical) ?? `org-dataset:${canonical.toLowerCase()}`
      let row = byOrganization.get(id)
      if (!row) {
        row = { name: index.byId.get(id)?.name ?? canonical, people: new Set(), relationships: new Set() }
        byOrganization.set(id, row)
      }
      row.people.add(candidate.id)
      if (affiliation.relationship) row.relationships.add(affiliation.relationship)
    }
  }
  return [...byOrganization.entries()].map(([organizationId, row]) => ({
    organizationId,
    name: row.name,
    dataset: 'accounting-finance',
    professionals: row.people.size,
    classification: [...row.relationships].join('; '),
  }))
}

function countByEmployer(
  entries: { employer: string }[],
  dataset: string,
  classificationFor: (entry: { employer: string }) => string,
): DatasetEmployer[] {
  const counts = new Map<string, { professionals: number; classification: string }>()
  for (const entry of entries) {
    const canonical = canonicalCompanyName(entry.employer)
    if (!canonical) continue
    const existing = counts.get(canonical)
    const classification = classificationFor(entry)
    if (existing) {
      existing.professionals += 1
      if (!existing.classification && classification) existing.classification = classification
    } else {
      counts.set(canonical, { professionals: 1, classification })
    }
  }
  return [...counts.entries()].map(([name, value]) => ({
    name,
    dataset,
    professionals: value.professionals,
    classification: value.classification,
  }))
}

/**
 * Generated from all 13 contact files. Ships only employer names, source
 * spellings and unique-person counts, not any contact PII. The build gate fails
 * if a contact is added, removed or changes employers without reconciliation.
 */
export function contactDatasetEmployers(): DatasetEmployer[] {
  return contactEmployerManifest.employers.map((row) => ({
    name: row.name,
    organizationId: row.organizationId,
    dataset: 'contacts',
    professionals: row.contactCount,
    classification: '',
    sourceNames: row.sourceNames,
  }))
}

/** Every employer name Maps already holds, with the people counted against it. */
export function datasetEmployers(sources: DatasetSources = {}): DatasetEmployer[] {
  const employers: DatasetEmployer[] = [
    ...contactDatasetEmployers(),
    ...accountantDatasetEmployers(sources.accountingFinanceCandidates ?? accountantCandidates),
    ...countByEmployer(
      bankCandidates.map((candidate) => ({ employer: candidate.employer })),
      'search-bank',
      () => '',
    ),
    ...(sources.creditRiskCompanies ?? []).map((company) => ({
      name: company.name,
      dataset: 'credit-risk',
      professionals: company.profileCount ?? 0,
      classification: company.segment ?? '',
    })),
  ]
  return employers
}

export interface CompanyIntelligence {
  index: OrganizationIndex
  /** Dataset-only employers rendered as organizations, for scan and listing. */
  extraOrganizations: Organization[]
  /** Every organization the explorer can show. */
  all: Organization[]
}

export function buildCompanyIntelligence(sources: DatasetSources = {}): CompanyIntelligence {
  const index = buildOrganizationIndex({ datasetEmployers: datasetEmployers(sources) })
  const all = visibleOrganizations(index)
  const extra = all.filter((organization) => !index.byId.has(organization.id))
  return { index, extraOrganizations: extra, all }
}
