import type { DataBundle, Profile, Company, Segment, OrgChartEntry, ShortlistEntry, Summary } from './types'

import profilesRaw from '../../profiles.json'
import companiesRaw from '../../companies.json'
import segmentsRaw from '../../segments.json'
import orgChartRaw from '../../org_chart.json'
import shortlistRaw from '../../priority_shortlist.json'
import summaryRaw from '../../summary.json'

function assertData<T>(data: unknown, name: string): T {
  if (!data || !Array.isArray(data) && typeof data !== 'object') {
    console.warn(`[loadData] ${name} is empty or invalid, using fallback`)
    return (Array.isArray(data) ? [] : {}) as T
  }
  return data as T
}

let cached: DataBundle | null = null

export function loadData(): DataBundle {
  if (cached) return cached

  const profiles = assertData<Profile[]>(profilesRaw, 'profiles')
  const companies = assertData<Company[]>(companiesRaw, 'companies')
  const segments = assertData<Segment[]>(segmentsRaw, 'segments')
  const orgChart = assertData<OrgChartEntry[]>(orgChartRaw, 'orgChart')
  const shortlist = assertData<ShortlistEntry[]>(shortlistRaw, 'shortlist')
  const summary = assertData<Summary>(summaryRaw, 'summary')

  cached = { profiles, companies, segments, orgChart, shortlist, summary }
  return cached
}
