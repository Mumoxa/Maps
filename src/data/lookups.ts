import type { DataBundle, Profile, Company, Segment } from './types'

export function getProfileBySlug(data: DataBundle, profileSlugs: Map<string, string>, slug: string): Profile | undefined {
  const id = profileSlugs.get(slug)
  if (!id) return undefined
  return data.profiles.find(p => p.id === id)
}

export function getCompanyBySlug(data: DataBundle, companySlugs: Map<string, string>, slug: string): Company | undefined {
  const id = companySlugs.get(slug)
  if (!id) return undefined
  return data.companies.find(c => c.id === id)
}

export function getSegmentBySlug(data: DataBundle, segmentSlugs: Map<string, string>, slug: string): Segment | undefined {
  const id = segmentSlugs.get(slug)
  if (!id) return undefined
  return data.segments.find(s => s.id === id)
}

export function getProfileById(data: DataBundle, id: string): Profile | undefined {
  return data.profiles.find(p => p.id === id)
}

export function getCompanyById(data: DataBundle, id: string): Company | undefined {
  return data.companies.find(c => c.id === id)
}

export function getSegmentById(data: DataBundle, id: string): Segment | undefined {
  return data.segments.find(s => s.id === id)
}

export function getCompanyByName(data: DataBundle, name: string): Company | undefined {
  return data.companies.find(c => c.name === name)
}

export function getSegmentByName(data: DataBundle, name: string): Segment | undefined {
  return data.segments.find(s => s.name === name)
}

export function getProfileByName(data: DataBundle, name: string): Profile[] {
  return data.profiles.filter(p => p.name === name)
}
