// Adapter for an AUTHORIZED Adzuna Intelligence "Get companies hiring" report.
// A historical employer report consists of period-wide provider aggregates, NOT
// individual job advertisements. Never add these numbers to per-job observations.
import { createHash } from 'node:crypto'
import { canonicalCompanyName } from '../src/data/companyNormalization'
import type { Organization } from '../src/data/organizations/types'
import { lookupOrganizations } from './hiring-observations'

export interface EmployerReportMeta {
  provider: 'adzuna-intelligence'
  reportId: string
  sourceReference: string
  countryCode: string
  windowStart: string
  windowEnd: string
  receivedOn: string
  /** A procurement or licence document must explicitly authorise ingestion. */
  licensed: boolean
}

export interface HistoricalEmployerRow {
  id: string
  reportId: string
  provider: 'adzuna-intelligence'
  providerEmployerId: string
  reportedEmployerName: string
  organizationId: string | null
  identityStatus: 'matched-to-registry' | 'unresolved'
  postingCount: number
  periodStart: string
  periodEnd: string
  sourceIndustryLabel: string
  sourceIndustryId: string
  sourceReference: string
  countryCode: string
  receivedOn: string
  /** Provider-assigned employer names are not automatically legal employer identities. */
  attribution: 'provider-reported'
}

export interface HistoricalEmployerReportPlan {
  accepted: HistoricalEmployerRow[]
  rejected: { row: number; reason: string }[]
  review: { row: number; reason: string; employer: string }[]
  unchanged: number
  reportedSampleSize: number | null
  /** Never use this as a statement that all SA vacancies were covered. */
  window: { start: string; end: string }
  source: string
}

function isObject(input: unknown): input is Record<string, unknown> {
  return !!input && typeof input === 'object' && !Array.isArray(input)
}

function isoDay(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const timestamp = new Date(value + 'T00:00:00.000Z')
  return !Number.isNaN(timestamp.getTime()) && timestamp.toISOString().slice(0, 10) === value
}

function stableId(reportId: string, providerEmployerId: string, reportedEmployerName: string): string {
  return createHash('sha256').update(
    'adzuna-intelligence' + '\n' + reportId + '\n' + (providerEmployerId || reportedEmployerName.toLowerCase()),
  ).digest('hex').slice(0, 32)
}

/** Parse the documented response { sample_size, data: [{company, industry, posting_count}] }. */
export function planAdzunaEmployerReport(
  response: unknown,
  meta: EmployerReportMeta,
  organizations: Organization[],
  existing: HistoricalEmployerRow[] = [],
): HistoricalEmployerReportPlan {
  if (!meta.licensed) throw new Error('A valid licensed data source is required before report import.')
  if (!meta.reportId.trim() || !meta.sourceReference.trim()) throw new Error('A report ID and its source reference are required.')
  if (!isoDay(meta.windowStart) || !isoDay(meta.windowEnd) || !isoDay(meta.receivedOn)
    || meta.windowStart > meta.windowEnd || meta.windowEnd > meta.receivedOn) {
    throw new Error('Report window/received dates are invalid or in the future.')
  }
  if (meta.countryCode !== 'za') throw new Error('This Maps ingestion is scoped to South Africa (za).')
  if (!isObject(response) || !Array.isArray(response.data)) {
    throw new Error('Expected a documented Adzuna hiring-employers report with a data array.')
  }
  const sampleSize = response.sample_size
  if (sampleSize !== undefined && (!Number.isSafeInteger(sampleSize) || (sampleSize as number) < 0)) {
    throw new Error('sample_size must be a non-negative integer if supplied.')
  }
  const previous = new Map(existing.map((row) => [row.id, row]))
  const alreadySeen = new Map<string, HistoricalEmployerRow>()
  const orgAliases = lookupOrganizations(organizations)
  const accepted: HistoricalEmployerRow[] = []
  const rejected: HistoricalEmployerReportPlan['rejected'] = []
  const review: HistoricalEmployerReportPlan['review'] = []
  let unchanged = 0

  response.data.forEach((record: unknown, index: number) => {
    const row = index + 1
    if (!isObject(record) || !isObject(record.company)) {
      rejected.push({ row, reason: 'company object is required' })
      return
    }
    const name = typeof record.company.name === 'string' ? record.company.name.trim() : ''
    const employerId = typeof record.company.id === 'string' || typeof record.company.id === 'number'
      ? String(record.company.id).trim() : ''
    const count = record.posting_count
    if (!name || !Number.isSafeInteger(count) || (count as number) < 0) {
      rejected.push({ row, reason: 'company.name and non-negative integer posting_count are required' })
      return
    }
    const industry = isObject(record.industry) ? record.industry : {}
    const industryLabel = typeof industry.label === 'string' ? industry.label.trim() : ''
    const industryId = typeof industry.id === 'string' ? industry.id.trim() : ''
    // Only reviewed literal aliases or names may automatically match. The
    // group-level normalizer is *not* safe for proving individual subsidiaries.
    const match = orgAliases.get(name.toLocaleLowerCase('en-ZA'))
    const id = stableId(meta.reportId, employerId, name)
    const entry: HistoricalEmployerRow = {
      id, provider: meta.provider, reportId: meta.reportId,
      providerEmployerId: employerId,
      reportedEmployerName: name,
      organizationId: match || null,
      identityStatus: match ? 'matched-to-registry' : 'unresolved',
      postingCount: count as number,
      periodStart: meta.windowStart, periodEnd: meta.windowEnd,
      sourceIndustryId: industryId, sourceIndustryLabel: industryLabel,
      sourceReference: meta.sourceReference,
      countryCode: meta.countryCode,
      receivedOn: meta.receivedOn,
      attribution: 'provider-reported',
    }
    const prior = alreadySeen.get(id) ?? previous.get(id)
    if (prior) {
      if (JSON.stringify(prior) === JSON.stringify(entry)) unchanged += 1
      else review.push({ row, reason: 'same report/employer ID has conflicting content; keep previous record', employer: name })
      return
    }
    alreadySeen.set(id, entry)
    accepted.push(entry)
    if (!match) review.push({ row, reason: 'provider employer identity not yet resolved to a canonical Maps entity', employer: name })
    if (!employerId) review.push({ row, reason: 'provider company ID not supplied; name-based key needs additional review', employer: name })
    if (industryId || industryLabel) {
      review.push({ row, reason: 'provider industry is a classification proposal only; verify independently', employer: name })
    }
  })

  return {
    accepted, rejected, review, unchanged,
    reportedSampleSize: typeof sampleSize === 'number' ? sampleSize : null,
    window: { start: meta.windowStart, end: meta.windowEnd },
    source: meta.sourceReference,
  }
}

export interface HistoricalEmployerCandidate {
  key: string
  organizationId: string | null
  names: string[]
  reports: { reportId: string; from: string; through: string; postingCount: number; source: string; industryHint: string }[]
}

/** Group by provider-reported identity without summing overlapping historical windows. */
export function summarizeHistoricalEmployerReports(rows: HistoricalEmployerRow[]): HistoricalEmployerCandidate[] {
  const groups = new Map<string, HistoricalEmployerCandidate>()
  for (const row of rows) {
    const identity = row.organizationId ? 'org:' + row.organizationId
      : row.providerEmployerId ? 'adzuna:' + row.providerEmployerId
        : 'adzuna-name:' + canonicalCompanyName(row.reportedEmployerName).toLowerCase()
    const candidate = groups.get(identity) ?? {
      key: identity, organizationId: row.organizationId, names: [], reports: [],
    }
    if (!candidate.names.includes(row.reportedEmployerName)) candidate.names.push(row.reportedEmployerName)
    candidate.reports.push({
      reportId: row.reportId, from: row.periodStart, through: row.periodEnd,
      postingCount: row.postingCount, source: row.sourceReference, industryHint: row.sourceIndustryLabel,
    })
    groups.set(identity, candidate)
  }
  return [...groups.values()].sort((a, b) => a.names[0].localeCompare(b.names[0]))
}
