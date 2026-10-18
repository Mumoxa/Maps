// Search Bank data layer: the typed view over markets/search-bank/bank.json,
// the bank's facet definitions (shared faceted-filtering engine), and the
// retrieval helpers the /search-bank page uses.
//
// The bank file is the only source of truth; every count, group and facet on
// the page is derived from it at runtime (CLAUDE.md rule 4).

import bankRaw from '../../../markets/search-bank/bank.json'
import type { FacetDef, TextMatcher } from '../facets'
import { canonicalCompanyName } from '../companyNormalization'
import { SENIORITY_LEVELS, type BankCandidate, type BankTargetCompany, type SearchBankFile, type SearchBrief } from './types'

const bank = bankRaw as SearchBankFile

export const bankSearches: SearchBrief[] = bank.searches

export const bankCandidates: BankCandidate[] = bank.candidates

/** Companies attached to searches as sourcing targets (may be empty). */
export const bankTargetCompanies: BankTargetCompany[] = bank.targetCompanies ?? []

/** Targets attached to one search, best relevance tier first. */
export function targetCompaniesForSearch(searchId: string): BankTargetCompany[] {
  return bankTargetCompanies
    .filter((target) => target.searchId === searchId)
    .sort((left, right) => (left.tier ?? 9) - (right.tier ?? 9) || left.name.localeCompare(right.name))
}

/** O(1) search-name lookup for any bank (exports, cross-links, tests). */
export function searchNameLookup(searches: SearchBrief[]): (id: string) => string {
  const byId = new Map(searches.map((search) => [search.id, search.name]))
  return (id: string) => byId.get(id) ?? id
}

export const searchName = searchNameLookup(bankSearches)

// ---------------------------------------------------------------------------
// Facets — the dimensions a recruiter retrieves candidates by
// ---------------------------------------------------------------------------

const SENIORITY_ORDER = [...SENIORITY_LEVELS]

const STATUS_LABELS: Record<string, string> = {
  new: 'New',
  screening: 'Screening',
  shortlisted: 'Shortlisted',
  contacted: 'Contacted',
  submitted: 'Submitted',
  interviewing: 'Interviewing',
  placed: 'Placed',
  archived: 'Archived',
}

const PIPELINE_ORDER = ['new', 'screening', 'shortlisted', 'contacted', 'submitted', 'interviewing', 'placed', 'archived']

function facetValues(candidate: BankCandidate, key: keyof BankCandidate): string[] {
  const value = candidate[key]
  if (Array.isArray(value)) return value.filter(Boolean)
  if (typeof value === 'string') return value ? [value] : []
  if (typeof value === 'number') return [String(value)]
  return []
}

function provinceOf(candidate: BankCandidate): string[] {
  return candidate.location.province ? [candidate.location.province] : []
}

export const searchBankFacetDefs: FacetDef<BankCandidate>[] = [
  {
    key: 'search',
    label: 'Search',
    accessor: (candidate) => [candidate.searchId],
    labelFor: (value) => searchName(value),
    searchThreshold: 8,
  },
  {
    key: 'status',
    label: 'Pipeline status',
    accessor: (candidate) => [candidate.status],
    labelFor: (value) => STATUS_LABELS[value] ?? value,
    order: PIPELINE_ORDER,
  },
  {
    key: 'seniority',
    label: 'Seniority',
    accessor: (candidate) => [candidate.seniority],
    order: SENIORITY_ORDER,
  },
  {
    key: 'title',
    label: 'Title',
    accessor: (candidate) => (candidate.title ? [candidate.title] : []),
    searchThreshold: 8,
  },
  {
    key: 'skill',
    label: 'Skill',
    accessor: (candidate) => facetValues(candidate, 'skills'),
    searchThreshold: 8,
  },
  {
    key: 'qualification',
    label: 'Qualification',
    accessor: (candidate) => facetValues(candidate, 'qualifications'),
    searchThreshold: 8,
  },
  {
    key: 'employer',
    label: 'Employer',
    accessor: (candidate) => (candidate.employer ? [canonicalCompanyName(candidate.employer)] : []),
    searchThreshold: 8,
  },
  {
    key: 'province',
    label: 'Province',
    accessor: provinceOf,
  },
  {
    key: 'availability',
    label: 'Availability',
    accessor: (candidate) => (candidate.availability ? [candidate.availability] : []),
  },
  {
    key: 'rating',
    label: 'Rating',
    accessor: (candidate) => (candidate.rating === null ? [] : [String(candidate.rating)]),
    labelFor: (value) => `${value} ★`,
    order: ['5', '4', '3', '2', '1'],
  },
  {
    key: 'tag',
    label: 'Tag',
    accessor: (candidate) => facetValues(candidate, 'tags'),
    searchThreshold: 8,
  },
]

export const searchBankTextMatcher: TextMatcher<BankCandidate> = (candidate, needle) => {
  const haystack = [
    candidate.fullName,
    candidate.title,
    candidate.seniority,
    candidate.employer,
    candidate.locationLabel,
    candidate.qualifications.join(' '),
    candidate.skills.join(' '),
    candidate.tags.join(' '),
    candidate.notes,
    candidate.email,
    candidate.phone,
    candidate.profileUrl,
    searchName(candidate.searchId),
  ].join(' ').toLowerCase()
  return haystack.includes(needle)
}

// ---------------------------------------------------------------------------
// Derived views
// ---------------------------------------------------------------------------

export interface BankUniverse {
  searches: number
  activeSearches: number
  candidates: number
  inPipeline: number
  shortlisted: number
  submitted: number
  placed: number
  provinces: number
  employers: number
  skills: number
  rated: number
}

export function bankUniverse(): BankUniverse {
  const provinces = new Set<string>()
  const employers = new Set<string>()
  const skills = new Set<string>()
  let inPipeline = 0
  let shortlisted = 0
  let submitted = 0
  let placed = 0
  let rated = 0
  for (const candidate of bankCandidates) {
    if (candidate.location.province) provinces.add(candidate.location.province)
    if (candidate.employer) employers.add(canonicalCompanyName(candidate.employer).toLowerCase())
    for (const skill of candidate.skills) skills.add(skill.toLowerCase())
    if (candidate.status !== 'new' && candidate.status !== 'archived') inPipeline += 1
    if (candidate.status === 'shortlisted') shortlisted += 1
    if (candidate.status === 'submitted' || candidate.status === 'interviewing') submitted += 1
    if (candidate.status === 'placed') placed += 1
    if (candidate.rating !== null) rated += 1
  }
  return {
    searches: bankSearches.length,
    activeSearches: bankSearches.filter((search) => search.status === 'active').length,
    candidates: bankCandidates.length,
    inPipeline,
    shortlisted,
    submitted,
    placed,
    provinces: provinces.size,
    employers: employers.size,
    skills: skills.size,
    rated,
  }
}

const SENIORITY_RANK = new Map(SENIORITY_LEVELS.map((level, index) => [level, index]))

/** Search first, then the recruiter's own signal: rating, seniority, name. */
export function compareCandidates(left: BankCandidate, right: BankCandidate): number {
  return searchName(left.searchId).localeCompare(searchName(right.searchId))
    || (right.rating ?? 0) - (left.rating ?? 0)
    || (SENIORITY_RANK.get(right.seniority) ?? 0) - (SENIORITY_RANK.get(left.seniority) ?? 0)
    || left.fullName.localeCompare(right.fullName)
}

export function statusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status
}

