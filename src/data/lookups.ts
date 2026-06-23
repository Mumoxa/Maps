import type { DataBundle, Profile, Company, Segment } from './types'

let profileByIdMap: Map<string, Profile> | null = null
let companyByIdMap: Map<string, Company> | null = null
let segmentByIdMap: Map<string, Segment> | null = null
let companyByNameMap: Map<string, Company> | null = null
let segmentByNameMap: Map<string, Segment> | null = null

function ensureMaps(data: DataBundle) {
  if (!profileByIdMap) {
    profileByIdMap = new Map(data.profiles.map(p => [p.id, p]))
  }
  if (!companyByIdMap) {
    companyByIdMap = new Map(data.companies.map(c => [c.id, c]))
  }
  if (!segmentByIdMap) {
    segmentByIdMap = new Map(data.segments.map(s => [s.id, s]))
  }
  if (!companyByNameMap) {
    companyByNameMap = new Map(data.companies.map(c => [c.name, c]))
  }
  if (!segmentByNameMap) {
    segmentByNameMap = new Map(data.segments.map(s => [s.name, s]))
  }
}

export function getProfileById(data: DataBundle, id: string): Profile | undefined {
  ensureMaps(data)
  return profileByIdMap!.get(id)
}

export function getCompanyById(data: DataBundle, id: string): Company | undefined {
  ensureMaps(data)
  return companyByIdMap!.get(id)
}

export function getSegmentById(data: DataBundle, id: string): Segment | undefined {
  ensureMaps(data)
  return segmentByIdMap!.get(id)
}

export function getCompanyByName(data: DataBundle, name: string): Company | undefined {
  ensureMaps(data)
  return companyByNameMap!.get(name)
}

export function getSegmentByName(data: DataBundle, name: string): Segment | undefined {
  ensureMaps(data)
  return segmentByNameMap!.get(name)
}

export function getProfilesByName(data: DataBundle, name: string): Profile[] {
  return data.profiles.filter(p => p.name === name)
}

export function getProfileBySlug(data: DataBundle, profileSlugs: Map<string, string>, slug: string): Profile | undefined {
  const id = profileSlugs.get(slug)
  if (!id) return undefined
  return getProfileById(data, id)
}

export function getCompanyBySlug(data: DataBundle, companySlugs: Map<string, string>, slug: string): Company | undefined {
  const id = companySlugs.get(slug)
  if (!id) return undefined
  return getCompanyById(data, id)
}

export function getSegmentBySlug(data: DataBundle, segmentSlugs: Map<string, string>, slug: string): Segment | undefined {
  const id = segmentSlugs.get(slug)
  if (!id) return undefined
  return getSegmentById(data, id)
}
