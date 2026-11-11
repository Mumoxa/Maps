import type {
  BodyDirectoryLead, CompanyBodyLink, IndustryBody, IndustryBodyResearchCoverage,
} from './industryBodies'

export interface IndustryBodyQualityInput {
  bodies: IndustryBody[]
  links: CompanyBodyLink[]
  leads: BodyDirectoryLead[]
  coverage: IndustryBodyResearchCoverage[]
  organizationIds: ReadonlySet<string>
  industryIds: ReadonlySet<string>
  taxonomyNodeIds: ReadonlySet<string>
  trackSlugs: ReadonlySet<string>
}

function validUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}
function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const parsed = new Date(value)
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value
}
function uniqueIds(rows: { id: string }[], label: string, errors: string[]): void {
  const seen = new Set<string>()
  for (const row of rows) {
    if (!row.id.trim() || seen.has(row.id)) errors.push(`${label}: missing or repeated ID "${row.id}"`)
    seen.add(row.id)
  }
}

/** Fail-closed on invalid claims; pending research is visible, never invented as completed. */
export function validateIndustryBodyIntelligence(input: IndustryBodyQualityInput): string[] {
  const errors: string[] = []
  uniqueIds(input.bodies, 'body', errors)
  uniqueIds(input.links, 'company-body link', errors)
  uniqueIds(input.leads, 'directory lead', errors)

  const bodyIds = new Set(input.bodies.map((body) => body.id))
  for (const body of input.bodies) {
    if (!body.name.trim() || !validUrl(body.website) || !validUrl(body.evidenceUrl) || !validDate(body.checkedOn)) {
      errors.push(`body ${body.id}: name, website, evidence URL and checkedOn are required`)
    }
    if (body.membershipDirectoryUrl && !validUrl(body.membershipDirectoryUrl)) errors.push(`body ${body.id}: invalid directory URL`)
    for (const nodeId of body.taxonomyNodeIds) {
      if (!input.taxonomyNodeIds.has(nodeId)) errors.push(`body ${body.id}: unknown national taxonomy node ${nodeId}`)
    }
    for (const industryId of body.industryIds) {
      if (!input.industryIds.has(industryId)) errors.push(`body ${body.id}: unknown sourcing industry ${industryId}`)
    }
  }
  for (const link of input.links) {
    if (!bodyIds.has(link.bodyId)) errors.push(`link ${link.id}: unknown body ${link.bodyId}`)
    if (!input.organizationIds.has(link.organizationId)) errors.push(`link ${link.id}: unknown canonical company ${link.organizationId}`)
    if (!validUrl(link.evidenceUrl) || !validDate(link.checkedOn) || !link.evidence.trim() || !link.entityScope.trim()) {
      errors.push(`link ${link.id}: source, date, evidence and entity scope are mandatory even when unverified`)
    }
    if (link.relationship !== 'member' && link.memberCategory.trim() && link.memberCategory !== 'not-applicable') {
      errors.push(`link ${link.id}: member category must be not-applicable for non-membership relationships`)
    }
  }
  const leadKeys = new Set<string>()
  for (const lead of input.leads) {
    if (!bodyIds.has(lead.bodyId)) errors.push(`lead ${lead.id}: unknown body ${lead.bodyId}`)
    if (lead.organizationId && !input.organizationIds.has(lead.organizationId)) errors.push(`lead ${lead.id}: unknown canonical company ${lead.organizationId}`)
    if (!lead.publishedCompanyName.trim() || !validUrl(lead.sourceUrl) || !validDate(lead.checkedOn)) {
      errors.push(`lead ${lead.id}: published name, source URL and date are required`)
    }
    const key = `${lead.bodyId}:${lead.publishedCompanyName.trim().toLowerCase()}`
    if (leadKeys.has(key)) errors.push(`lead ${lead.id}: duplicate directory name for body`)
    leadKeys.add(key)
  }
  const coverageKeys = new Set<string>()
  for (const record of input.coverage) {
    const key = `${record.scopeType}:${record.scopeId}`
    if (coverageKeys.has(key)) errors.push(`coverage: repeated scope ${key}`)
    coverageKeys.add(key)
    if (!record.notes.trim()) errors.push(`coverage ${key}: notes are required to document gaps`)
    if (record.status !== 'not-started' &&
        (!validDate(record.checkedOn) || record.sourceUrls.length === 0)) {
      errors.push(`coverage ${key}: research requires checked date and supporting sources`)
    }
    for (const url of record.sourceUrls) {
      if (!validUrl(url)) errors.push(`coverage ${key}: invalid source URL`)
    }
  }
  for (const slug of input.trackSlugs) {
    if (!coverageKeys.has(`market-track:${slug}`)) {
      errors.push(`market-track ${slug}: missing mandatory industry-body research coverage record`)
    }
  }
  return errors
}
