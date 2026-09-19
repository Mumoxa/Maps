import peopleRaw from '../../markets/accountants/people.json'
import { canonicalCompanyName } from './companyNormalization'
import type { FacetDef, TextMatcher } from './facets'

export interface AccountantCareerRole {
  employer: string
  title: string
  notes: string
}

export interface AccountantCandidate {
  id: string
  fullName: string
  status: string
  confidence: string
  roleScopeStatus: string
  professionallyQualified: string
  designationStatus: string
  qualificationConfidence: string
  academicQualifications: string[]
  designations: string[]
  professionalRoutes: string[]
  bodies: string[]
  title: string
  employer: string
  seniority: string
  roleFamily: string
  function: string
  industry: string
  subIndustry: string
  province: string
  city: string
  country: string
  locationConfidence: string
  skills: string[]
  accountingSystems: string[]
  erpSystems: string[]
  analyticsTools: string[]
  yearsExperience: string
  qualificationEvidence: string
  articlesStatus: string
  articlesEmployer: string
  articlesBody: string
  articlesPeriod: string
  articlesLocation: string
  practicalExperienceFramework: string
  qualificationRoute: string
  careerHistory: AccountantCareerRole[]
  linkedinUrl: string
  primarySource: string
  sourceUrls: string[]
  dateLastVerified: string
  notes: string
}

export const accountantCandidates = peopleRaw as AccountantCandidate[]

// Most-recognised chartered designations lead the facet list.
export const ACCOUNTANT_DESIGNATION_ORDER = [
  'CA(SA)',
  'AGA(SA)',
  'PA(SA)',
  'ACMA',
  'FCMA',
  'CGMA',
  'ACCA',
  'FCCA',
]

const ACCOUNTANT_ROUTE_ORDER = ['SAICA Articles', 'SAIPA Articles', 'CIMA PER', 'ACCA PER']

export const ACCOUNTANT_UNKNOWN_PROVINCE = 'Location not evidenced'

function candidateSystems(candidate: AccountantCandidate): string[] {
  return [...candidate.accountingSystems, ...candidate.erpSystems, ...candidate.analyticsTools]
}

function professionalStatus(candidate: AccountantCandidate): string {
  if (candidate.professionallyQualified === 'true') return 'Professionally qualified'
  if (candidate.professionalRoutes.length > 0) return 'Professional route confirmed'
  return 'Finance professional — designation not confirmed'
}

/**
 * The track's filterable dimensions, derived from the actual data. Designation
 * and professional route are deliberately separate facets: holding CA(SA) is
 * not the same as having completed SAICA articles.
 */
export const accountantFacetDefs: FacetDef<AccountantCandidate>[] = [
  {
    key: 'professionalStatus',
    label: 'Professional status',
    accessor: (candidate) => [professionalStatus(candidate)],
    order: ['Professionally qualified', 'Professional route confirmed', 'Finance professional — designation not confirmed'],
  },
  {
    key: 'qualification',
    label: 'Qualification (designation)',
    accessor: (candidate) => candidate.designations,
    order: ACCOUNTANT_DESIGNATION_ORDER,
  },
  {
    key: 'route',
    label: 'Professional route (articles / PER)',
    accessor: (candidate) => candidate.professionalRoutes,
    order: ACCOUNTANT_ROUTE_ORDER,
  },
  {
    key: 'body',
    label: 'Professional body',
    accessor: (candidate) => candidate.bodies,
  },
  {
    key: 'roleFamily',
    label: 'Role family',
    accessor: (candidate) => (candidate.roleFamily ? [candidate.roleFamily] : []),
  },
  {
    key: 'industry',
    label: 'Industry',
    accessor: (candidate) => (candidate.industry ? [candidate.industry] : []),
    searchThreshold: 12,
  },
  {
    key: 'province',
    label: 'Province',
    accessor: (candidate) => [candidate.province || ACCOUNTANT_UNKNOWN_PROVINCE],
  },
  {
    key: 'system',
    label: 'Accounting / ERP system',
    accessor: candidateSystems,
  },
  {
    key: 'employer',
    label: 'Employer',
    accessor: (candidate) => (candidate.employer ? [canonicalCompanyName(candidate.employer)] : []),
    searchThreshold: 8,
  },
]

/** Free-text search across every meaningful string on a candidate record. */
export const accountantTextMatcher: TextMatcher<AccountantCandidate> = (candidate, needle) => {
  const haystack = [
    candidate.fullName,
    candidate.title,
    candidate.employer,
    candidate.roleFamily,
    candidate.function,
    candidate.industry,
    candidate.subIndustry,
    candidate.province,
    candidate.city,
    candidate.qualificationEvidence,
    candidate.qualificationRoute,
    candidate.articlesStatus,
    candidate.articlesEmployer,
    candidate.articlesBody,
    candidate.articlesPeriod,
    candidate.articlesLocation,
    candidate.seniority,
    candidate.notes,
    ...candidate.academicQualifications,
    ...candidate.designations,
    ...candidate.professionalRoutes,
    ...candidate.bodies,
    ...candidate.skills,
    ...candidateSystems(candidate),
    ...candidate.careerHistory.flatMap((role) => [role.employer, role.title, role.notes]),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return haystack.includes(needle)
}

/** Stable sort: strongest designation first, then name. Applied after filtering. */
export function compareAccountants(a: AccountantCandidate, b: AccountantCandidate): number {
  const delta = designationRank(a) - designationRank(b)
  if (delta !== 0) return delta
  return a.fullName.localeCompare(b.fullName)
}

function designationRank(candidate: AccountantCandidate): number {
  let best = ACCOUNTANT_DESIGNATION_ORDER.length
  for (const designation of candidate.designations) {
    const index = ACCOUNTANT_DESIGNATION_ORDER.indexOf(designation)
    if (index !== -1 && index < best) best = index
  }
  return best
}

export function accountantUniverse() {
  const employers = new Set<string>()
  for (const candidate of accountantCandidates) {
    if (candidate.employer) employers.add(canonicalCompanyName(candidate.employer))
  }
  return {
    candidates: accountantCandidates.length,
    confirmed: accountantCandidates.filter((candidate) => candidate.status === 'CONFIRMED' || candidate.status === 'FINANCE_ROLE_CONFIRMED').length,
    professionallyQualified: accountantCandidates.filter((candidate) => candidate.professionallyQualified === 'true').length,
    caSa: accountantCandidates.filter((candidate) => candidate.designations.includes('CA(SA)')).length,
    employers: employers.size,
    provinces: new Set(accountantCandidates.map((candidate) => candidate.province).filter(Boolean)).size,
  }
}
