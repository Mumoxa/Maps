import type { ShortlistEntry, DataBundle, Profile } from './types'

export function getShortlistEntryByName(shortlist: ShortlistEntry[], name: string): ShortlistEntry | undefined {
  return shortlist.find(s => s['Full Name'].toLowerCase() === name.toLowerCase())
}

export function getShortlistByProfile(data: DataBundle, profile: Profile): ShortlistEntry | undefined {
  return getShortlistEntryByName(data.shortlist, profile.name)
}

export function getShortlistRanked(shortlist: ShortlistEntry[]): ShortlistEntry[] {
  return [...shortlist].sort((a, b) => parseInt(a.Rank) - parseInt(b.Rank))
}
