import Fuse from 'fuse.js'
import type { Profile, Company, Segment, FilterOptions, DataBundle } from './types'

let fuseInstance: Fuse<Profile> | null = null
let allProfiles: Profile[] = []

export function createSearchIndex(profiles: Profile[]): Fuse<Profile> {
  if (fuseInstance) return fuseInstance

  const options = {
    keys: [
      { name: 'name', weight: 0.4 },
      { name: 'company', weight: 0.2 },
      { name: 'title', weight: 0.2 },
      { name: 'segment', weight: 0.1 },
      { name: 'specialism', weight: 0.1 },
    ],
    threshold: 0.4,
    distance: 100,
    includeScore: true,
  }

  fuseInstance = new Fuse(profiles, options)
  allProfiles = profiles
  return fuseInstance
}

export function searchProfiles(
  fuse: Fuse<Profile>,
  query: string,
  filters: FilterOptions
): Profile[] {
  let results: Profile[]

  if (query.trim()) {
    results = fuse.search(query).map(r => r.item)
  } else {
    results = [...allProfiles]
  }

  return applyFilters(results, filters)
}

function applyFilters(profiles: Profile[], filters: FilterOptions): Profile[] {
  let results = [...profiles]

  if (filters.segment) {
    results = results.filter(p => p.segment === filters.segment)
  }
  if (filters.company) {
    results = results.filter(p => p.company === filters.company)
  }
  if (filters.confidence) {
    results = results.filter(p => p.confidence === filters.confidence)
  }
  if (filters.seniority) {
    results = results.filter(p => p.seniority === filters.seniority)
  }
  if (filters.needsVerification) {
    results = results.filter(p => p.company === 'Needs verification')
  }
  if (filters.hasNotes) {
    results = results.filter(p => p.notes.trim().length > 0)
  }

  return results
}

export function filterProfiles(profiles: Profile[], filters: FilterOptions): Profile[] {
  return applyFilters(profiles, filters)
}

export function globalSearch(
  data: DataBundle,
  query: string
): { profiles: Profile[]; companies: Company[]; segments: Segment[] } {
  const q = query.toLowerCase().trim()
  if (!q) return { profiles: [], companies: [], segments: [] }

  const matchedProfiles = data.profiles.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.company.toLowerCase().includes(q) ||
    p.title.toLowerCase().includes(q) ||
    p.segment.toLowerCase().includes(q) ||
    p.specialism.toLowerCase().includes(q)
  )

  const matchedCompanies = data.companies.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.segment.toLowerCase().includes(q)
  )

  const matchedSegments = data.segments.filter(s =>
    s.name.toLowerCase().includes(q)
  )

  return {
    profiles: matchedProfiles.slice(0, 5),
    companies: matchedCompanies.slice(0, 5),
    segments: matchedSegments.slice(0, 5),
  }
}
