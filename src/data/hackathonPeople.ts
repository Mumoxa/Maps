import peopleRaw from '../../markets/hackathons/people.json'
import { canonicalCompanyName } from './companyNormalization'

export interface HackathonEventRecord {
  event: string
  edition: string | null
  year: string
  placement: string
  tier: string
  team: string | null
  project: string | null
  award: string | null
  city: string | null
  province: string | null
  top3: boolean
  top10: boolean
  winner: boolean
  evidenceUrl: string
}

export interface HackathonCandidate {
  id: string
  censusPersonId: string
  fullName: string
  category: 'Candidate'
  segment: 'Hackathon contestants'
  bestTier: string
  bestResultLabel: string
  winner: boolean
  top3: boolean
  top10: boolean
  events: HackathonEventRecord[]
  eventCount: number
  organisationAtTime: string | null
  universityAtTime: string | null
  province: string | null
  confidence: string
  evidenceUrl: string
  notes: string | null
  source: string
}

export const hackathonCandidates = peopleRaw as HackathonCandidate[]

export const HACKATHON_TIER_ORDER = new Map([
  ['Winner', 0],
  ['Top 3', 1],
  ['Top 10', 2],
  ['Special award', 3],
  ['Finalist', 4],
  ['Qualified', 5],
  ['Participant', 6],
])

export interface HackathonFacet {
  value: string
  label: string
  count: number
}

function facet(values: (string | null)[], noneLabel = 'Unknown'): HackathonFacet[] {
  const counts = new Map<string, number>()
  for (const value of values) {
    const key = value || noneLabel
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([value, count]) => ({ value, label: value, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
}

export function hackathonProvinces(): HackathonFacet[] {
  return facet(hackathonCandidates.map((candidate) => candidate.province))
}

export function hackathonYears(): HackathonFacet[] {
  const counts = new Map<string, number>()
  for (const candidate of hackathonCandidates) {
    const years = new Set(candidate.events.map((event) => event.year))
    for (const year of years) counts.set(year, (counts.get(year) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([value, count]) => ({ value, label: value, count }))
    .sort((a, b) => b.value.localeCompare(a.value))
}

export function hackathonEventNames(): string[] {
  const names = new Set<string>()
  for (const candidate of hackathonCandidates) {
    for (const event of candidate.events) names.add(event.event)
  }
  return [...names].sort((a, b) => a.localeCompare(b))
}

export function hackathonUniverse() {
  const editions = new Set<string>()
  for (const candidate of hackathonCandidates) {
    for (const event of candidate.events) editions.add(`${event.event} ${event.edition ?? event.year}`)
  }
  return {
    candidates: hackathonCandidates.length,
    winners: hackathonCandidates.filter((candidate) => candidate.winner).length,
    top3: hackathonCandidates.filter((candidate) => candidate.top3).length,
    top10: hackathonCandidates.filter((candidate) => candidate.top10).length,
    editions: editions.size,
    provinces: new Set(hackathonCandidates.map((candidate) => candidate.province).filter(Boolean)).size,
  }
}

export interface HackathonQuery {
  query: string
  tier: string
  province: string
  year: string
  event: string
  affiliation: string
}

export function filterHackathonCandidates(query: HackathonQuery): HackathonCandidate[] {
  const needle = query.query.trim().toLowerCase()
  return hackathonCandidates
    .filter((candidate) => {
      if (query.tier && candidate.bestTier !== query.tier) return false
      if (query.province && (candidate.province || 'Unknown') !== query.province) return false
      if (query.year && !candidate.events.some((event) => event.year === query.year)) return false
      if (query.event && !candidate.events.some((event) => event.event === query.event)) return false
      if (query.affiliation) {
        const needleCanonical = canonicalCompanyName(query.affiliation).toLowerCase()
        const needleRaw = query.affiliation.trim().toLowerCase()
        const university = canonicalCompanyName(candidate.universityAtTime ?? '').toLowerCase()
        const organisation = canonicalCompanyName(candidate.organisationAtTime ?? '').toLowerCase()
        const rawText = [candidate.universityAtTime, candidate.organisationAtTime]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        const matched = university.includes(needleCanonical)
          || organisation.includes(needleCanonical)
          || rawText.includes(needleRaw)
        if (!matched) return false
      }
      if (needle) {
        const haystack = [
          candidate.fullName,
          candidate.bestResultLabel,
          candidate.universityAtTime,
          candidate.organisationAtTime,
          candidate.province,
          ...candidate.events.flatMap((event) => [event.event, event.team, event.project, event.award, event.year]),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        if (!haystack.includes(needle)) return false
      }
      return true
    })
    .sort((a, b) => {
      const tierDelta =
        (HACKATHON_TIER_ORDER.get(a.bestTier) ?? 9) - (HACKATHON_TIER_ORDER.get(b.bestTier) ?? 9)
      if (tierDelta !== 0) return tierDelta
      return a.fullName.localeCompare(b.fullName)
    })
}
