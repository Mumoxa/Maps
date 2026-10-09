// Composition root for the company-intelligence layer.
//
// Builds one index over the curated organization records plus every employer the
// existing Maps datasets already reference, so the explorer, the company
// directory, Search Bank targets and the research export all read the same
// universe. Both the app and the tests call this, so the tests exercise the code
// the recruiter actually uses.

import { accountantCandidates } from '../accountantsPeople'
import { bankCandidates } from '../searchBank/bank'
import { contacts } from '../contacts'
import { canonicalCompanyName } from '../companyNormalization'
import { buildOrganizationIndex, visibleOrganizations } from './load'
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
 * The contact directory stores several positions for some people. A person
 * counts once per normalized employer name even when source sheets repeat it.
 * Original employer spellings are retained to support a full reverse-link from
 * a company dossier to all of its contact records. Neither sector nor size
 * metadata in contacts is promoted to a verified company fact.
 */
export function contactDatasetEmployers(): DatasetEmployer[] {
  const groups = new Map<string, { names: Set<string>; people: Set<string> }>()
  for (const contact of contacts) {
    for (const position of contact.positions) {
      const raw = position.company.trim()
      const canonical = canonicalCompanyName(raw)
      if (!canonical) continue
      const group = groups.get(canonical) ?? { names: new Set<string>(), people: new Set<string>() }
      group.names.add(raw)
      group.people.add(contact.id)
      groups.set(canonical, group)
    }
  }
  return [...groups.entries()].map(([name, group]) => ({
    name,
    dataset: 'contacts',
    professionals: group.people.size,
    classification: '',
    sourceNames: [...group.names],
    personIds: [...group.people],
  }))
}

/** Every employer name Maps already holds, with the people counted against it. */
export function datasetEmployers(sources: DatasetSources = {}): DatasetEmployer[] {
  const employers: DatasetEmployer[] = [
    ...contactDatasetEmployers(),
    ...countByEmployer(
      accountantCandidates.map((candidate) => ({ employer: candidate.employer })),
      'accounting-finance',
      () => '',
    ),
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
