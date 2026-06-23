import type { DataBundle, ValidationWarning } from './types'
import { normalizeCompanyName, normalizeSegmentName } from './normalization'

export function validateData(data: DataBundle): ValidationWarning[] {
  const warnings: ValidationWarning[] = []

  const nameCounts = new Map<string, string[]>()
  for (const p of data.profiles) {
    const arr = nameCounts.get(p.name) || []
    arr.push(p.id)
    nameCounts.set(p.name, arr)
  }
  for (const [name, ids] of nameCounts) {
    if (ids.length > 1) {
      warnings.push({
        type: 'duplicate_profile_name',
        severity: 'warning',
        message: `Profile name "${name}" appears ${ids.length} times (IDs: ${ids.join(', ')})`,
        entityName: name,
      })
    }
  }

  const canonicalNames = new Set(data.companies.map(c => c.name))
  for (const p of data.profiles) {
    if (p.company === 'Needs verification') {
      warnings.push({
        type: 'needs_verification',
        severity: 'info',
        message: `Profile "${p.name}" (${p.id}) has "Needs verification" as company`,
        entityId: p.id,
        entityName: p.name,
      })
      continue
    }
    const canonical = normalizeCompanyName(p.company, data)
    if (!canonicalNames.has(canonical) && canonical !== p.company) {
      warnings.push({
        type: 'company_not_found',
        severity: 'warning',
        message: `Profile "${p.name}" company "${p.company}" (→ "${canonical}") not found in companies.json`,
        entityId: p.id,
        entityName: p.name,
      })
    }
  }

  for (const c of data.companies) {
    const normalized = normalizeSegmentName(c.segment, data)
    if (normalized !== c.segment) {
      const seg = data.segments.find(s => s.name === normalized)
      if (!seg) {
        warnings.push({
          type: 'segment_mismatch',
          severity: 'warning',
          message: `Company "${c.name}" segment "${c.segment}" normalized to "${normalized}" not found in segments.json`,
          entityId: c.id,
          entityName: c.name,
        })
      }
    }
  }

  const nonEmptyOrgCharts = data.orgChart.filter(e => e.companies.length > 0)
  if (nonEmptyOrgCharts.length < data.orgChart.length) {
    warnings.push({
      type: 'org_chart_gap',
      severity: 'info',
      message: `org_chart.json has ${nonEmptyOrgCharts.length}/${data.orgChart.length} entries with non-empty companies — hierarchy builder will fill from primary data`,
    })
  }

  if (warnings.length > 0) {
    console.group('[validateData] Data Validation Results')
    for (const w of warnings) {
      const icon = w.severity === 'error' ? '❌' : w.severity === 'warning' ? '⚠️' : 'ℹ️'
      console.warn(`${icon} [${w.type}] ${w.message}`)
    }
    console.groupEnd()
  }

  return warnings
}
