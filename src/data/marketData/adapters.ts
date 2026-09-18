import type { DataBundle, Profile } from '../types'
import type { HackathonCandidate } from '../hackathonPeople'
import type { AccountantCandidate } from '../accountantsPeople'
import type { MarketLocation, MarketProfile, MarketSource } from './types'

export interface SalesforcePerson {
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
  source?: string
}

function unique(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))]
}

function splitValues(...values: string[]) {
  return unique(values.flatMap((value) => value.split(/[;,]/)))
}

function parseLegacyLocation(value: string): MarketLocation {
  const parts = value.split(',').map((part) => part.trim()).filter(Boolean)
  if (parts.length >= 3) {
    return {
      city: parts.slice(0, -2).join(', '),
      province: parts[parts.length - 2] ?? '',
      country: parts[parts.length - 1] ?? '',
    }
  }
  if (parts.length === 2) {
    return { city: parts[0], province: parts[1], country: '' }
  }
  return { city: parts[0] ?? '', province: '', country: '' }
}

function source(url: string, evidence: string, type: string): MarketSource[] {
  if (!url.trim()) return []
  return [{ url, type, evidence, checkedOn: null }]
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

function salesforceSummary(person: SalesforcePerson) {
  return [
    person.jobTitle && person.employer ? `${person.jobTitle} at ${person.employer}` : person.jobTitle || person.employer,
    person.employerType ? `${person.employerType} ecosystem segment` : '',
    person.clouds.length ? `Cloud focus: ${person.clouds.slice(0, 3).join(', ')}` : '',
    person.certifications.length ? `Certifications/signals: ${person.certifications.slice(0, 3).join(', ')}` : '',
    person.trailheadRank ? `Trailhead rank: ${person.trailheadRank}` : '',
    person.yearsSalesforceExperience ? `${person.yearsSalesforceExperience} years Salesforce experience estimate` : '',
  ].filter(Boolean).join('. ')
}

function adaptCreditRiskProfile(profile: Profile): MarketProfile {
  const location = parseLegacyLocation(profile.location)
  const evidence = profile.evidence || profile.notes

  return {
    id: `credit-risk-${profile.id}`,
    track: 'Credit Risk',
    trackSlug: 'credit-risk',
    name: profile.name,
    title: profile.title,
    company: profile.company,
    location,
    locationLabel: profile.location,
    seniority: profile.seniority,
    skills: splitValues(profile.specialism, profile.function, profile.segment),
    sectors: splitValues(profile.segment, profile.category),
    specialisms: splitValues(profile.specialism, profile.function),
    summary: evidence || `${profile.title} at ${profile.company}`,
    linkedinUrl: profile.linkedin_url,
    sources: source(profile.source_url || profile.linkedin_url, evidence, 'public-profile'),
    suppliedAsVerified: true,
    supersedesId: null,
    attributes: {
      category: profile.category,
      confidence: profile.confidence,
      fitScore: profile.fit_score,
      function: profile.function,
      notes: profile.notes,
      segment: profile.segment,
    },
    provenance: {
      kind: 'legacy',
      batchId: null,
      sourceProfileId: profile.id,
    },
  }
}

export function adaptCreditRiskProfiles(data: DataBundle): MarketProfile[] {
  return data.profiles.map(adaptCreditRiskProfile)
}

export function adaptSalesforceProfiles(rows: SalesforcePerson[]): MarketProfile[] {
  return rows.map((person) => {
    const location = {
      city: person.city,
      province: person.province,
      country: person.country,
    }
    const summary = salesforceSummary(person)

    return {
      id: `salesforce-${person.id}`,
      track: 'Salesforce',
      trackSlug: 'salesforce',
      name: person.fullName,
      title: person.jobTitle,
      company: person.employer,
      location,
      locationLabel: [person.city, person.province, person.country].filter(Boolean).join(', '),
      seniority: inferSalesforceSeniority(person),
      skills: unique(['Salesforce', ...person.clouds, ...person.certifications]),
      sectors: unique(['Salesforce', person.employerType, ...person.clouds]),
      specialisms: unique([...person.clouds, ...person.certifications]),
      summary,
      linkedinUrl: person.linkedinUrl,
      sources: source(
        person.linkedinUrl,
        summary || `Included in ${person.source || 'the retained Salesforce source dataset'}.`,
        'linkedin',
      ),
      suppliedAsVerified: true,
      supersedesId: null,
      attributes: {
        certifications: person.certifications,
        clouds: person.clouds,
        employerType: person.employerType,
        sourceFile: person.source ?? null,
        trailheadRank: person.trailheadRank,
        yearsSalesforceExperience: person.yearsSalesforceExperience,
      },
      provenance: {
        kind: 'legacy',
        batchId: null,
        sourceProfileId: person.id,
      },
    }
  })
}

export function adaptHackathonCandidate(candidate: HackathonCandidate): MarketProfile {
  const best = candidate.events[0]
  const city = best?.city ?? ''
  const province = candidate.province ?? best?.province ?? ''
  const summaryParts = [
    candidate.bestResultLabel,
    candidate.universityAtTime ? `University at the time: ${candidate.universityAtTime}` : '',
    candidate.organisationAtTime ? `Organisation at the time: ${candidate.organisationAtTime}` : '',
    `${candidate.eventCount} census-verified participation record${candidate.eventCount === 1 ? '' : 's'}`,
  ].filter(Boolean)
  const skills = unique([
    ...candidate.events.map((event) => event.event),
    ...candidate.events.map((event) => event.team ?? ''),
    ...candidate.events.map((event) => event.project ?? ''),
    'Hackathon contestants',
  ])
  const sources = [] as MarketSource[]
  for (const event of candidate.events.slice(0, 4)) {
    if (event.evidenceUrl && !sources.some((existing) => existing.url === event.evidenceUrl)) {
      sources.push({ url: event.evidenceUrl, type: 'census', evidence: `${event.placement} — ${event.event}`, checkedOn: null })
    }
  }
  if (!sources.length && candidate.evidenceUrl) {
    sources.push({ url: candidate.evidenceUrl, type: 'census', evidence: candidate.bestResultLabel, checkedOn: null })
  }

  return {
    id: `hackathons-${candidate.id}`,
    track: 'Hackathon Talent',
    trackSlug: 'hackathons',
    name: candidate.fullName,
    title: candidate.bestResultLabel,
    company: candidate.organisationAtTime ?? '',
    location: { city, province, country: 'South Africa' },
    locationLabel: [city, province, 'South Africa'].filter(Boolean).join(', '),
    seniority: '',
    skills,
    sectors: ['Hackathon contestants', ...(candidate.province ? [`${candidate.province} events`] : [])],
    specialisms: skills.slice(0, 6),
    summary: summaryParts.join('. '),
    linkedinUrl: '',
    sources,
    suppliedAsVerified: true,
    supersedesId: null,
    attributes: {
      segment: candidate.segment,
      confidence: candidate.confidence,
      universityAtTime: candidate.universityAtTime,
      organisationAtTime: candidate.organisationAtTime,
      censusPersonId: candidate.censusPersonId,
      eventCount: candidate.eventCount,
      events: candidate.events.map((event) => ({ event: event.event, year: event.year, placement: event.placement, team: event.team, project: event.project })),
    },
    provenance: {
      kind: 'legacy',
      batchId: null,
      sourceProfileId: candidate.censusPersonId,
    },
  }
}

export function adaptHackathonCandidates(candidates: HackathonCandidate[]): MarketProfile[] {
  return candidates.map(adaptHackathonCandidate)
}

function inferAccountantSeniority(candidate: AccountantCandidate) {
  const role = `${candidate.title} ${candidate.roleFamily}`.toLowerCase()
  if (role.includes('chief') || role.includes('cfo') || role.includes(' ceo') || role.includes('executive finance')) return 'C-Suite'
  if (role.includes('director') || role.includes('head of') || role.includes('partner') || role.includes('vice president')) return 'Executive'
  if (role.includes('principal') || role.includes('associate director')) return 'Principal / Director'
  if (role.includes('manager') || role.includes('lead') || role.includes('financial controller') || role.includes('group')) return 'Lead / Manager'
  if (role.includes('senior')) return 'Senior'
  if (role.includes('accountant') || role.includes('analyst') || role.includes('consultant') || role.includes('specialist')) {
    return 'Professional / Specialist'
  }
  return 'Professional'
}

export function adaptAccountantCandidate(candidate: AccountantCandidate): MarketProfile {
  const location: MarketLocation = {
    city: candidate.city,
    province: candidate.province,
    country: candidate.country || 'South Africa',
  }
  const summary = [
    candidate.title && candidate.employer ? `${candidate.title} at ${candidate.employer}` : candidate.title || candidate.employer,
    candidate.designations.length ? candidate.designations.join(', ') : '',
    candidate.industry ? `${candidate.industry} sector` : '',
    candidate.qualificationEvidence,
  ].filter(Boolean).join('. ')

  const sources: MarketSource[] = []
  for (const url of candidate.sourceUrls.slice(0, 4)) {
    if (!sources.some((existing) => existing.url === url)) {
      sources.push({ url, type: 'public-source', evidence: candidate.qualificationEvidence || summary, checkedOn: null })
    }
  }
  if (!sources.length && candidate.primarySource) {
    sources.push({ url: candidate.primarySource, type: 'public-source', evidence: candidate.qualificationEvidence || summary, checkedOn: null })
  }

  return {
    id: `accounting-finance-${candidate.id}`,
    track: 'Accounting & Finance',
    trackSlug: 'accounting-finance',
    name: candidate.fullName,
    title: candidate.title,
    company: candidate.employer,
    location,
    locationLabel: [candidate.city, candidate.province, candidate.country || 'South Africa'].filter(Boolean).join(', '),
    seniority: inferAccountantSeniority(candidate),
    skills: unique([
      ...candidate.designations,
      ...candidate.professionalRoutes,
      ...candidate.skills,
      ...candidate.accountingSystems,
      ...candidate.erpSystems,
      ...candidate.analyticsTools,
      candidate.roleFamily,
      'Accounting & Finance',
    ]),
    sectors: unique([candidate.industry, candidate.subIndustry, 'Accounting & Finance']),
    specialisms: unique([...candidate.designations, candidate.roleFamily, candidate.function]),
    summary,
    linkedinUrl: candidate.linkedinUrl,
    sources,
    suppliedAsVerified: true,
    supersedesId: null,
    attributes: {
      status: candidate.status,
      confidence: candidate.confidence,
      designations: candidate.designations,
      bodies: candidate.bodies,
      roleFamily: candidate.roleFamily,
      function: candidate.function,
      industry: candidate.industry,
      subIndustry: candidate.subIndustry,
      articlesStatus: candidate.articlesStatus,
      yearsExperience: candidate.yearsExperience,
      accountingSystems: candidate.accountingSystems,
      erpSystems: candidate.erpSystems,
    },
    provenance: {
      kind: 'legacy',
      batchId: null,
      sourceProfileId: candidate.id,
    },
  }
}

export function adaptAccountantCandidates(candidates: AccountantCandidate[]): MarketProfile[] {
  return candidates.map(adaptAccountantCandidate)
}
