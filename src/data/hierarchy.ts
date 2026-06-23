import type { DataBundle, OrgChartEntry, OrgChartCompany, TreeNode, Profile, Company } from './types'
import { normalizeCompanyName } from './normalization'
import { slugify } from './slug'

export function buildCompleteOrgChart(data: DataBundle): OrgChartEntry[] {
  const profileMap = new Map<string, Profile[]>()
  const unverifiedMap = new Map<string, Profile[]>()
  for (const p of data.profiles) {
    if (p.company === 'Needs verification') {
      const arr = unverifiedMap.get(p.segment) || []
      arr.push(p)
      unverifiedMap.set(p.segment, arr)
    } else {
      const arr = profileMap.get(p.segment) || []
      arr.push(p)
      profileMap.set(p.segment, arr)
    }
  }

  const companyMap = new Map<string, Company>()
  for (const c of data.companies) {
    companyMap.set(c.name, c)
  }

  const entries: OrgChartEntry[] = data.segments.map(seg => {
    const segmentProfiles = profileMap.get(seg.name) || []
    const companyGroups = new Map<string, Profile[]>()
    for (const p of segmentProfiles) {
      const canonical = normalizeCompanyName(p.company, data)
      const arr = companyGroups.get(canonical) || []
      arr.push(p)
      companyGroups.set(canonical, arr)
    }

    const unverified = unverifiedMap.get(seg.name) || []

    const companies: OrgChartCompany[] = []
    for (const [canonicalName, profiles] of companyGroups) {
      const company = companyMap.get(canonicalName)
      companies.push({
        id: company?.id || `com-${slugify(canonicalName)}`,
        name: canonicalName,
        segment: seg.name,
        relevance: company?.relevance || '',
        risk_teams: company?.risk_teams || '',
        website: company?.website || '',
        priority: company?.priority || 'P3',
        profile_count: profiles.length,
        profiles: profiles,
      })
    }

    if (unverified.length > 0) {
      companies.push({
        id: `${seg.id}-unverified`,
        name: 'Unverified',
        segment: seg.name,
        relevance: '',
        risk_teams: '',
        website: '',
        priority: 'P3',
        profile_count: unverified.length,
        profiles: unverified,
      })
    }

    return {
      segment: seg.name,
      segment_id: seg.id,
      profile_count: segmentProfiles.length + unverified.length,
      companies,
    }
  })

  return entries
}


export function buildTree(orgChart: OrgChartEntry[]): TreeNode[] {
  return orgChart.map(entry => {
    const companyNodes: TreeNode[] = entry.companies.map(comp => {
      const profileNodes: TreeNode[] = comp.profiles.map(p => ({
        id: p.id,
        type: 'profile' as const,
        label: p.name,
        data: p,
        children: [],
        collapsed: true,
      }))

      return {
        id: comp.id || `com-${slugify(comp.name)}`,
        type: 'company' as const,
        label: comp.name,
        data: null,
        children: profileNodes,
        collapsed: true,
      }
    })

    return {
      id: entry.segment_id,
      type: 'segment' as const,
      label: entry.segment,
      data: null,
      children: companyNodes,
      collapsed: false,
    }
  })
}
