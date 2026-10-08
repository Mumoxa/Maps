// Source-retained job observations for the national employer-intelligence backfill.
// This is an offline, reviewable ingest layer, NOT an autonomous job-board scraper.
// It never mutates the canonical organization registry or treats a job post as a hire.

import { createHash } from 'node:crypto'
import { canonicalCompanyName } from '../src/data/companyNormalization'
import type { Organization } from '../src/data/organizations/types'

export type AdvertiserType = 'direct' | 'agency' | 'unknown'
export type Attribution = 'confirmed' | 'probable' | 'hypothesis' | 'unknown'
export type RawJob = Record<string, string>

export interface HiringObservation {
  id: string
  source: string
  sourceJobId: string
  sourceUrl: string
  title: string
  postedOn: string
  observedOn: string
  advertiserName: string
  advertiserType: AdvertiserType
  employerName: string
  employerRaw: string
  attribution: Attribution
  companyKey: string | null
  companyStatus: 'known' | 'provisional' | 'unattributed'
  city: string
  province: string
  function: string
  seniority: string
  employmentType: string
  salaryAsAdvertised: string
  proposedIndustry: string
  sourceEmployerEvidence: string
}

export interface ImportIssue {
  row: number
  reason: string
  status: 'reject' | 'review'
  sourceUrl: string
}

export interface HiringEmployer {
  companyKey: string
  name: string
  status: 'known' | 'provisional'
  postingCount: number
  firstPostedOn: string
  lastPostedOn: string
  sourceNames: string[]
  advertisedTitles: string[]
  provinces: string[]
  functions: string[]
  seniorities: string[]
  proposedIndustries: string[]
  postingIds: string[]
}

export interface HiringImportPlan {
  accepted: HiringObservation[]
  rejected: ImportIssue[]
  review: ImportIssue[]
  duplicateCount: number
  outsideWindow: number
  possibleReposts: number
}

function get(row: RawJob, ...keys: string[]): string {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null && String(row[key]).trim()) return String(row[key]).trim()
  }
  return ''
}

export function normalizeHeaders(row: RawJob): RawJob {
  return Object.fromEntries(Object.entries(row).map(([key, value]) => [
    key.toLowerCase().trim().replace(/[\s-]+/g, '_'),
    String(value ?? '').trim(),
  ]))
}

function parseDate(value: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(value)) return null
  const day = value.slice(0, 10)
  const date = new Date(day + 'T00:00:00.000Z')
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === day ? day : null
}

function validUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function identityKey(label: string): string {
  return canonicalCompanyName(label).toLocaleLowerCase('en-ZA').replace(/\s+/g, ' ').trim()
}

function lookupOrganizations(organizations: Organization[]): Map<string, string | null> {
  const map = new Map<string, string | null>()
  for (const organization of organizations) {
    for (const label of [organization.name, organization.legalName, ...organization.aliases]) {
      const key = label.trim().toLocaleLowerCase('en-ZA')
      if (!key) continue
      const prior = map.get(key)
      if (prior && prior !== organization.id) map.set(key, null)
      else if (!map.has(key)) map.set(key, organization.id)
    }
  }
  return map
}

function signature(row: HiringObservation): string {
  return [identityKey(row.employerName), row.title.toLowerCase(), row.city.toLowerCase(), row.province.toLowerCase(), row.postedOn].join('|')
}

function isRepeat(existing: HiringObservation, incoming: HiringObservation): boolean {
  return existing.id === incoming.id
    && existing.sourceUrl === incoming.sourceUrl
    && existing.title === incoming.title
    && existing.postedOn === incoming.postedOn
    && existing.advertiserName === incoming.advertiserName
    && existing.employerRaw === incoming.employerRaw
}

export function planHiringImport(
  rows: RawJob[],
  organizations: Organization[],
  existing: HiringObservation[],
  start: string,
  end: string,
  observedOn: string,
): HiringImportPlan {
  if (!parseDate(start) || !parseDate(end) || start > end || !parseDate(observedOn)) {
    throw new Error('start, end and observedOn must be real ISO dates; start must not exceed end')
  }

  const plan: HiringImportPlan = {
    accepted: [], rejected: [], review: [], duplicateCount: 0, outsideWindow: 0, possibleReposts: 0,
  }
  const existingById = new Map(existing.map((entry) => [entry.id, entry]))
  const seenById = new Map<string, HiringObservation>()
  const knownOrganizations = lookupOrganizations(organizations)
  const repostSignatures = new Map<string, string>()
  for (const observation of existing) {
    if (observation.companyKey) repostSignatures.set(signature(observation), observation.source)
  }

  rows.forEach((rawRow, index) => {
    const row = normalizeHeaders(rawRow)
    const issue = (status: ImportIssue['status'], reason: string, url = ''): void => {
      plan[status === 'reject' ? 'rejected' : 'review'].push({ row: index + 1, reason, status, sourceUrl: url })
    }

    const source = get(row, 'source', 'job_board', 'board')
    const sourceUrl = get(row, 'source_url', 'job_url', 'posting_url', 'url')
    const sourceJobId = get(row, 'source_job_id', 'external_id', 'job_id')
    const title = get(row, 'job_title', 'title', 'position')
    const postedOn = parseDate(get(row, 'posted_on', 'date_posted', 'published_on', 'published_at', 'posted_at'))
    const advertiserName = get(row, 'advertiser_name', 'advertiser', 'posting_company')
    const advertiserType = get(row, 'advertiser_type').toLowerCase()
    const observedDate = parseDate(get(row, 'checked_on', 'observed_on')) ?? observedOn

    if (!source || !validUrl(sourceUrl) || !title || !advertiserName || !postedOn
      || !['direct', 'agency', 'unknown'].includes(advertiserType)) {
      issue('reject', 'source, valid source_url, job_title, real posted_on, advertiser_name and advertiser_type (direct/agency/unknown) are required', sourceUrl)
      return
    }
    if (postedOn < start || postedOn > end) {
      plan.outsideWindow += 1
      return
    }
    const rawEmployer = get(row, 'end_employer_name', 'employer_name', 'hiring_organization')
    const requestedAttribution = get(row, 'attribution_confidence').toLowerCase()
    const attribution: Attribution = ['confirmed', 'probable', 'hypothesis', 'unknown'].includes(requestedAttribution)
      ? requestedAttribution as Attribution
      : advertiserType === 'direct' ? 'confirmed' : 'unknown'

    // An advertising agency is not the end employer. Only explicit, sourced,
    // confirmed attribution may attach its advertisement to a target company.
    const employerName = advertiserType === 'direct'
      ? (rawEmployer || advertiserName)
      : advertiserType === 'agency' && attribution === 'confirmed' && rawEmployer
        ? rawEmployer
        : ''
    const exact = employerName ? knownOrganizations.get(employerName.trim().toLocaleLowerCase('en-ZA')) : undefined
    const companyKey = employerName
      ? exact ? exact : 'prospect:' + identityKey(employerName)
      : null
    const companyStatus: HiringObservation['companyStatus'] = companyKey
      ? exact ? 'known' : 'provisional'
      : 'unattributed'
    const id = createHash('sha256').update(source.toLowerCase() + '\n' + (sourceJobId || sourceUrl)).digest('hex').slice(0, 24)
    const observation: HiringObservation = {
      id, source, sourceJobId, sourceUrl, title, postedOn, observedOn: observedDate,
      advertiserName, advertiserType: advertiserType as AdvertiserType,
      employerName: employerName ? canonicalCompanyName(employerName) : '',
      employerRaw: rawEmployer || (advertiserType === 'direct' ? advertiserName : ''),
      attribution, companyKey, companyStatus,
      city: get(row, 'city', 'town'),
      province: get(row, 'province', 'region'),
      function: get(row, 'job_function', 'function', 'department'),
      seniority: get(row, 'seniority', 'seniority_level'),
      employmentType: get(row, 'employment_type', 'contract_type'),
      salaryAsAdvertised: get(row, 'salary_as_advertised', 'salary'),
      proposedIndustry: get(row, 'proposed_industry_id', 'industry_id', 'industry'),
      sourceEmployerEvidence: get(row, 'source_employer_evidence', 'attribution_evidence'),
    }

    const previous = seenById.get(id) ?? existingById.get(id)
    if (previous) {
      if (isRepeat(previous, observation)) plan.duplicateCount += 1
      else issue('review', 'conflicting observation for same source/job id; retain existing evidence until reviewed', sourceUrl)
      return
    }
    seenById.set(id, observation)
    plan.accepted.push(observation)
    if (companyStatus === 'provisional') issue('review', 'new or unverified employer identity; verify before organization promotion', sourceUrl)
    if (companyStatus === 'unattributed') issue('review', 'end employer unknown; do not credit the advertising agency as employer', sourceUrl)
    if (advertiserType === 'agency' && attribution === 'confirmed' && rawEmployer && !observation.sourceEmployerEvidence) {
      issue('review', 'agency end-employer attribution requires an explicit evidence statement and independent review', sourceUrl)
    }
    if (observation.proposedIndustry) issue('review', 'industry from advert is a proposal, not a verified company classification', sourceUrl)
    if (observation.companyKey) {
      const key = signature(observation)
      const otherSource = repostSignatures.get(key)
      if (otherSource && otherSource !== observation.source) {
        plan.possibleReposts += 1
        issue('review', 'possible cross-board repost; separately retained pending review', sourceUrl)
      }
      repostSignatures.set(key, observation.source)
    }
  })
  return plan
}

export function summarizeHiringEmployers(observations: HiringObservation[]): HiringEmployer[] {
  const grouped = new Map<string, HiringObservation[]>()
  for (const entry of observations) {
    if (!entry.companyKey) continue
    const group = grouped.get(entry.companyKey)
    if (group) group.push(entry)
    else grouped.set(entry.companyKey, [entry])
  }
  const unique = (items: string[]): string[] => [...new Set(items.filter(Boolean))].sort()
  return [...grouped.entries()].map(([companyKey, posts]) => {
    const chronological = [...posts].sort((a, b) => a.postedOn.localeCompare(b.postedOn))
    return {
      companyKey,
      name: chronological[0].employerName,
      status: chronological[0].companyStatus === 'known' ? 'known' as const : 'provisional' as const,
      postingCount: posts.length,
      firstPostedOn: chronological[0].postedOn,
      lastPostedOn: chronological[chronological.length - 1].postedOn,
      sourceNames: unique(posts.map((post) => post.source)),
      advertisedTitles: unique(posts.map((post) => post.title)),
      provinces: unique(posts.map((post) => post.province)),
      functions: unique(posts.map((post) => post.function)),
      seniorities: unique(posts.map((post) => post.seniority)),
      proposedIndustries: unique(posts.map((post) => post.proposedIndustry)),
      postingIds: unique(posts.map((post) => post.id)),
    }
  }).sort((a, b) => b.postingCount - a.postingCount || a.name.localeCompare(b.name))
}
