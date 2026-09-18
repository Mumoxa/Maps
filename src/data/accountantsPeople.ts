import peopleRaw from '../../markets/accountants/people.json'
import { canonicalCompanyName } from './companyNormalization'

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
  designations: string[]
  bodies: string[]
  title: string
  employer: string
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
  careerHistory: AccountantCareerRole[]
  linkedinUrl: string
  primarySource: string
  sourceUrls: string[]
  notes: string
}

export const accountantCandidates = peopleRaw as AccountantCandidate[]

// Ordered so the most-recognised chartered designations lead the facet list.
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

export interface AccountantFacet {
  value: string
  label: string
  count: number
}

function facetFromArrays(values: string[][], order?: string[]): AccountantFacet[] {
  const counts = new Map<string, number>()
  for (const group of values) {
    for (const value of new Set(group)) {
      if (!value) continue
      counts.set(value, (counts.get(value) ?? 0) + 1)
    }
  }
  const facets = [...counts.entries()].map(([value, count]) => ({ value, label: value, count }))
  if (order) {
    return facets.sort((a, b) => {
      const ai = order.indexOf(a.value)
      const bi = order.indexOf(b.value)
      if (ai !== -1 || bi !== -1) {
        if (ai === -1) return 1
        if (bi === -1) return -1
        return ai - bi
      }
      return b.count - a.count || a.label.localeCompare(b.label)
    })
  }
  return facets.sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
}

function facetFromValues(values: string[], noneLabel: string): AccountantFacet[] {
  const counts = new Map<string, number>()
  for (const value of values) {
    const key = value || noneLabel
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([value, count]) => ({ value, label: value, count }))
    .sort((a, b) => {
      if (a.value === noneLabel) return 1
      if (b.value === noneLabel) return -1
      return b.count - a.count || a.label.localeCompare(b.label)
    })
}

const UNKNOWN_PROVINCE = 'Location not evidenced'

export function accountantDesignations(): AccountantFacet[] {
  return facetFromArrays(accountantCandidates.map((candidate) => candidate.designations), ACCOUNTANT_DESIGNATION_ORDER)
}

export function accountantProvinces(): AccountantFacet[] {
  return facetFromValues(accountantCandidates.map((candidate) => candidate.province), UNKNOWN_PROVINCE)
}

export function accountantIndustries(): AccountantFacet[] {
  return facetFromValues(
    accountantCandidates.map((candidate) => candidate.industry).filter(Boolean),
    UNKNOWN_PROVINCE,
  ).filter((facet) => facet.value !== UNKNOWN_PROVINCE)
}

export function accountantRoleFamilies(): AccountantFacet[] {
  return facetFromValues(
    accountantCandidates.map((candidate) => candidate.roleFamily).filter(Boolean),
    UNKNOWN_PROVINCE,
  ).filter((facet) => facet.value !== UNKNOWN_PROVINCE)
}

export function accountantUniverse() {
  const designations = new Set<string>()
  const employers = new Set<string>()
  for (const candidate of accountantCandidates) {
    for (const designation of candidate.designations) designations.add(designation)
    if (candidate.employer) employers.add(canonicalCompanyName(candidate.employer))
  }
  return {
    candidates: accountantCandidates.length,
    confirmed: accountantCandidates.filter((candidate) => candidate.status === 'CONFIRMED').length,
    caSa: accountantCandidates.filter((candidate) => candidate.designations.includes('CA(SA)')).length,
    designations: designations.size,
    employers: employers.size,
    provinces: new Set(accountantCandidates.map((candidate) => candidate.province).filter(Boolean)).size,
  }
}

export interface AccountantQuery {
  query: string
  designation: string
  province: string
  industry: string
  roleFamily: string
  employer: string
}

export function filterAccountantCandidates(query: AccountantQuery): AccountantCandidate[] {
  const needle = query.query.trim().toLowerCase()
  return accountantCandidates
    .filter((candidate) => {
      if (query.designation && !candidate.designations.includes(query.designation)) return false
      if (query.province && (candidate.province || UNKNOWN_PROVINCE) !== query.province) return false
      if (query.industry && candidate.industry !== query.industry) return false
      if (query.roleFamily && candidate.roleFamily !== query.roleFamily) return false
      if (query.employer) {
        const needleCanonical = canonicalCompanyName(query.employer).toLowerCase()
        const employer = canonicalCompanyName(candidate.employer).toLowerCase()
        const raw = candidate.employer.toLowerCase()
        if (!employer.includes(needleCanonical) && !raw.includes(query.employer.trim().toLowerCase())) {
          return false
        }
      }
      if (needle) {
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
          candidate.notes,
          ...candidate.designations,
          ...candidate.bodies,
          ...candidate.skills,
          ...candidate.accountingSystems,
          ...candidate.erpSystems,
          ...candidate.analyticsTools,
          ...candidate.careerHistory.flatMap((role) => [role.employer, role.title, role.notes]),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        if (!haystack.includes(needle)) return false
      }
      return true
    })
    .sort((a, b) => {
      const designationDelta = designationRank(a) - designationRank(b)
      if (designationDelta !== 0) return designationDelta
      return a.fullName.localeCompare(b.fullName)
    })
}

function designationRank(candidate: AccountantCandidate): number {
  let best = ACCOUNTANT_DESIGNATION_ORDER.length
  for (const designation of candidate.designations) {
    const index = ACCOUNTANT_DESIGNATION_ORDER.indexOf(designation)
    if (index !== -1 && index < best) best = index
  }
  return best
}
