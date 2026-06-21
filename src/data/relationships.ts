import type { DataBundle, Profile, Company, Segment } from './types'
import { normalizeCompanyName } from './normalization'

export function getProfilesBySegment(data: DataBundle, segmentName: string): Profile[] {
  return data.profiles.filter(p => p.segment === segmentName)
}

export function getProfilesByCompany(data: DataBundle, companyName: string): Profile[] {
  return data.profiles.filter(p => {
    if (p.company === 'Needs verification') return false
    return normalizeCompanyName(p.company, data) === companyName
  })
}

export function getUnverifiedProfilesByCompany(data: DataBundle, companyName: string): Profile[] {
  const company = data.companies.find(c => c.name === companyName)
  if (!company) return []
  return data.profiles.filter(p => {
    if (p.company !== 'Needs verification') return false
    return p.segment === company.segment || true
  })
}

export function getCompanyByProfile(data: DataBundle, profile: Profile): Company | undefined {
  if (profile.company === 'Needs verification') return undefined
  const canonical = normalizeCompanyName(profile.company, data)
  return data.companies.find(c => c.name === canonical)
}

export function getSegmentByProfile(data: DataBundle, profile: Profile): Segment | undefined {
  return data.segments.find(s => s.name === profile.segment)
}

export function getSegmentsByCompany(data: DataBundle, company: Company): Segment[] {
  const matching: Segment[] = []
  const seen = new Set<string>()
  for (const s of data.segments) {
    if (s.companies.some(c => c === company.name || c.includes(company.name.replace(/ \/.*$/, '')))) {
      matching.push(s)
      seen.add(s.name)
    }
  }
  if (matching.length === 0) {
    const normSegment = data.segments.find(s => s.name === company.segment)
    if (normSegment) matching.push(normSegment)
  }
  return matching
}

export function getActiveSegments(data: DataBundle): { segment: Segment; count: number }[] {
  const counts = new Map<string, number>()
  for (const p of data.profiles) {
    counts.set(p.segment, (counts.get(p.segment) || 0) + 1)
  }
  return data.segments
    .map(s => ({ segment: s, count: counts.get(s.name) || 0 }))
    .filter(x => x.count > 0)
    .sort((a, b) => b.count - a.count)
}
