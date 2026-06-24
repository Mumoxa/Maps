import salesforcePeopleRaw from '../../markets/salesforce/people.json'
import type { TalentProfile } from './types'

interface SalesforcePerson {
  id: string
  fullName: string
  jobTitle: string
  employer: string
  employerType: string
  city: string
  province: string
  country: string
  certifications: string[]
  clouds: string[]
  trailheadRank: string
  yearsSalesforceExperience: number | null
  linkedinUrl: string
}

const salesforcePeople = salesforcePeopleRaw as SalesforcePerson[]

function unique(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))]
}

function inferSalesforceSeniority(person: SalesforcePerson) {
  const role = `${person.jobTitle} ${person.certifications.join(' ')}`.toLowerCase()

  if (role.includes('chief') || role.includes(' cto') || role.includes(' cio') || role.includes(' ceo')) return 'C-Suite'
  if (role.includes('vice president') || role.includes('director') || role.includes('head of')) return 'Executive'
  if (role.includes('architect') || role.includes('principal')) return 'Principal / Architect'
  if (role.includes('lead') || role.includes('manager') || role.includes('owner')) return 'Lead / Manager'
  if (role.includes('senior') || role.includes('sr.')) return 'Senior'
  if (role.includes('consultant') || role.includes('specialist') || role.includes('developer') || role.includes('administrator')) {
    return 'Consultant / Specialist'
  }

  return 'Professional'
}

function buildLocation(person: SalesforcePerson) {
  const parts = unique([person.city, person.province, person.country])
  return parts.join(', ')
}

function buildSummary(person: SalesforcePerson) {
  const evidence = [
    person.jobTitle && person.employer ? `${person.jobTitle} at ${person.employer}` : person.jobTitle || person.employer,
    person.employerType ? `${person.employerType} ecosystem segment` : '',
    person.clouds.length ? `Cloud focus: ${person.clouds.slice(0, 3).join(', ')}` : '',
    person.certifications.length ? `Certifications/signals: ${person.certifications.slice(0, 3).join(', ')}` : '',
    person.trailheadRank ? `Trailhead rank: ${person.trailheadRank}` : '',
    person.yearsSalesforceExperience ? `${person.yearsSalesforceExperience} years Salesforce experience estimate` : '',
  ].filter(Boolean)

  return evidence.join('. ')
}

export function getSalesforceTalentProfiles(): TalentProfile[] {
  return salesforcePeople.map((person) => {
    const skills = unique([
      'Salesforce',
      ...person.clouds,
      ...person.certifications,
      person.trailheadRank ? `Trailhead ${person.trailheadRank}` : '',
    ])

    return {
      id: `salesforce-${person.id}`,
      track: 'Salesforce',
      trackSlug: 'salesforce',
      name: person.fullName,
      company: person.employer || 'Needs verification',
      title: person.jobTitle || 'Salesforce Professional',
      location: buildLocation(person),
      seniority: inferSalesforceSeniority(person),
      skills,
      sectors: unique(['Salesforce', person.employerType, ...person.clouds]),
      summary: buildSummary(person),
      linkedinUrl: person.linkedinUrl,
      sourceType: 'imported',
    }
  })
}
