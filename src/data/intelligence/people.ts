// Person and Employment records built from the public professional-profile
// datasets. A person is never merged across datasets on name similarity, and
// nothing here infers what a person did from what their employer does.

import type { EmploymentRecord, PersonRecord } from './types'

export interface AccountantPersonInput {
  id: string
  fullName: string
  title: string
  employer: string
  careerHistory: { employer: string; title: string }[]
  designations: string[]
  academicQualifications: string[]
  province: string
  linkedinUrl: string
  sourceUrls: string[]
  dateLastVerified: string
  status: string
}

export interface CreditRiskPersonInput {
  id: string
  name: string
  title: string
  company: string
  location: string
  linkedin_url: string
  source_url: string
  confidence: string
}

export type EmployerResolver = (name: string) => { organizationId: string | null; match: EmploymentRecord['match'] }

const UNKNOWN_EMPLOYER = /^(not publicly confirmed|needs verification|unknown|n\/a|none|self[- ]employed)?$/i

export function isKnownEmployer(name: string | null | undefined): name is string {
  return Boolean(name && !UNKNOWN_EMPLOYER.test(name.trim()))
}

export function buildPeople(
  accountants: AccountantPersonInput[],
  creditRisk: CreditRiskPersonInput[],
  resolve: EmployerResolver,
): { persons: PersonRecord[]; employments: EmploymentRecord[] } {
  const persons: PersonRecord[] = []
  const employments: EmploymentRecord[] = []

  for (const row of accountants) {
    const id = `person:accountants:${row.id}`
    persons.push({
      id,
      name: row.fullName,
      dataset: 'accountants',
      title: row.title ?? '',
      qualifications: [...new Set([...(row.designations ?? []), ...(row.academicQualifications ?? [])])],
      province: row.province ?? '',
      href: `/accounting-finance?q=${encodeURIComponent(row.fullName)}`,
      profileUrl: row.linkedinUrl ?? '',
      sourceUrls: row.sourceUrls ?? [],
      lastVerified: row.dateLastVerified || null,
      recordStatus: row.status ?? '',
    })
    const seen = new Set<string>()
    if (isKnownEmployer(row.employer)) {
      const resolved = resolve(row.employer)
      seen.add(resolved.organizationId ?? row.employer.toLowerCase())
      employments.push({
        personId: id,
        organizationId: resolved.organizationId,
        employerName: row.employer,
        current: true,
        title: row.title ?? '',
        match: resolved.match,
        verifiedOn: row.dateLastVerified || null,
      })
    }
    for (const role of row.careerHistory ?? []) {
      if (!isKnownEmployer(role.employer)) continue
      const resolved = resolve(role.employer)
      const key = resolved.organizationId ?? role.employer.toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)
      employments.push({
        personId: id,
        organizationId: resolved.organizationId,
        employerName: role.employer,
        current: false,
        title: role.title ?? '',
        match: resolved.match,
        verifiedOn: row.dateLastVerified || null,
      })
    }
  }

  for (const row of creditRisk) {
    const id = `person:credit-risk:${row.id}`
    const province = (row.location ?? '').split(',').map((part) => part.trim()).filter(Boolean).slice(-2, -1)[0] ?? ''
    persons.push({
      id,
      name: row.name,
      dataset: 'credit-risk',
      title: row.title ?? '',
      qualifications: [],
      province,
      href: `/profiles?q=${encodeURIComponent(row.name)}`,
      profileUrl: row.linkedin_url ?? '',
      sourceUrls: row.source_url ? [row.source_url] : [],
      lastVerified: null,
      recordStatus: row.confidence ?? '',
    })
    if (isKnownEmployer(row.company)) {
      const resolved = resolve(row.company)
      employments.push({
        personId: id,
        organizationId: resolved.organizationId,
        employerName: row.company,
        current: true,
        title: row.title ?? '',
        match: resolved.match,
        verifiedOn: null,
      })
    }
  }

  return { persons, employments }
}
