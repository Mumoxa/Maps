// Data-quality checks for the company-intelligence model.
//
// These checks exist so problems surface instead of being resolved by guessing.
// They run in `npm run validate:organizations` (build gate) and in the test
// suite, and the explorer shows the outstanding warnings next to the record.

import type {
  Capability,
  CompanyAssociation,
  Industry,
  Organization,
  OrganizationRelationship,
  QualityIssue,
  RecruiterIntelligence,
} from './types'
import { canonicalCompanyName } from '../companyNormalization'

export interface QualityInput {
  organizations: Organization[]
  industries: Industry[]
  capabilities: Capability[]
  relationships: OrganizationRelationship[]
  associations: CompanyAssociation[]
  intelligence: RecruiterIntelligence[]
  /** Verification older than this many days is flagged as stale. */
  staleAfterDays?: number
  /** Reference date, so tests stay deterministic. */
  today?: string
}

function daysBetween(from: string, to: string): number {
  const start = new Date(from).getTime()
  const end = new Date(to).getTime()
  if (Number.isNaN(start) || Number.isNaN(end)) return 0
  return Math.round((end - start) / 86_400_000)
}

export function runQualityChecks(input: QualityInput): QualityIssue[] {
  const issues: QualityIssue[] = []
  const staleAfterDays = input.staleAfterDays ?? 180
  const today = input.today ?? new Date().toISOString().slice(0, 10)
  const industryIds = new Set(input.industries.map((industry) => industry.id))
  const capabilityIds = new Set(input.capabilities.map((capability) => capability.id))
  const organizationIds = new Set(input.organizations.map((organization) => organization.id))

  // --- Identity -------------------------------------------------------------
  const byCanonicalName = new Map<string, string[]>()
  const byAlias = new Map<string, Set<string>>()
  for (const organization of input.organizations) {
    const canonical = canonicalCompanyName(organization.name).toLowerCase()
    const list = byCanonicalName.get(canonical)
    if (list) list.push(organization.id)
    else byCanonicalName.set(canonical, [organization.id])

    for (const alias of [organization.name, organization.legalName, ...organization.aliases]) {
      if (!alias) continue
      const key = canonicalCompanyName(alias).toLowerCase()
      const owners = byAlias.get(key)
      if (owners) owners.add(organization.id)
      else byAlias.set(key, new Set([organization.id]))
    }
  }
  for (const [name, ids] of byCanonicalName) {
    if (ids.length > 1) {
      issues.push({
        code: 'duplicate-organization',
        severity: 'error',
        organizationId: ids[0],
        detail: `Duplicate canonical company "${name}": ${ids.join(', ')}.`,
      })
    }
  }
  for (const [alias, owners] of byAlias) {
    if (owners.size > 1) {
      issues.push({
        code: 'ambiguous-alias',
        severity: 'error',
        organizationId: [...owners][0],
        detail: `Alias "${alias}" resolves to multiple organizations: ${[...owners].join(', ')}.`,
      })
    }
  }

  // --- Classification -------------------------------------------------------
  for (const organization of input.organizations) {
    for (const link of organization.industries) {
      if (!industryIds.has(link.industryId)) {
        issues.push({
          code: 'unsupported-industry',
          severity: 'error',
          organizationId: organization.id,
          detail: `${organization.name} references unknown industry "${link.industryId}".`,
        })
      }
      if (link.confidence === 'confirmed' && !link.evidence.trim()) {
        issues.push({
          code: 'activity-assumed-from-industry',
          severity: 'warning',
          organizationId: organization.id,
          detail: `${organization.name} industry "${link.industryId}" is confirmed without an evidence statement.`,
        })
      }
    }

    const statuses = new Map<string, string>()
    for (const link of organization.capabilities) {
      if (!capabilityIds.has(link.capabilityId)) {
        issues.push({
          code: 'unsupported-industry',
          severity: 'error',
          organizationId: organization.id,
          detail: `${organization.name} references unknown capability "${link.capabilityId}".`,
        })
      }
      const previous = statuses.get(link.capabilityId)
      if (previous && previous !== link.status) {
        issues.push({
          code: 'conflicting-capability',
          severity: 'error',
          organizationId: organization.id,
          detail: `${organization.name} records capability "${link.capabilityId}" as both ${previous} and ${link.status}.`,
        })
      }
      statuses.set(link.capabilityId, link.status)

      if (link.status === 'observed' && !link.evidence.trim()) {
        issues.push({
          code: 'relevance-without-evidence',
          severity: 'warning',
          organizationId: organization.id,
          detail: `${organization.name} capability "${link.capabilityId}" is observed without an evidence statement.`,
        })
      }
      if (link.status === 'observed' && !link.sourceUrl.trim() && link.confidence === 'confirmed') {
        issues.push({
          code: 'relevance-without-evidence',
          severity: 'warning',
          organizationId: organization.id,
          detail: `${organization.name} capability "${link.capabilityId}" is confirmed without a source URL.`,
        })
      }
      if (link.status === 'not-observed' && !link.evidence.trim()) {
        issues.push({
          code: 'unknown-rendered-as-absent',
          severity: 'error',
          organizationId: organization.id,
          detail: `${organization.name} records "${link.capabilityId}" as not observed without stating what was checked.`,
        })
      }
    }

    for (const entry of organization.scale) {
      if (!entry.sourceUrl.trim()) {
        issues.push({
          code: 'scale-without-source',
          severity: 'error',
          organizationId: organization.id,
          detail: `${organization.name} scale "${entry.metric}: ${entry.value}" has no source URL.`,
        })
      }
    }
    for (const location of organization.locations) {
      if (!location.sourceUrl.trim()) {
        issues.push({
          code: 'unsourced-location',
          severity: 'warning',
          organizationId: organization.id,
          detail: `${organization.name} location "${location.city}, ${location.province}" has no source URL.`,
        })
      }
    }
    if (organization.status === 'verified' && organization.sources.length === 0) {
      issues.push({
        code: 'relevance-without-evidence',
        severity: 'warning',
        organizationId: organization.id,
        detail: `${organization.name} is marked verified with no recorded sources.`,
      })
    }
    if (organization.lastVerified && daysBetween(organization.lastVerified, today) > staleAfterDays) {
      issues.push({
        code: 'stale-verification',
        severity: 'warning',
        organizationId: organization.id,
        detail: `${organization.name} was last verified ${organization.lastVerified} (more than ${staleAfterDays} days ago).`,
      })
    }
  }

  // --- Relationships --------------------------------------------------------
  for (const relationship of input.relationships) {
    if (relationship.fromId === relationship.toId) {
      issues.push({
        code: 'mistaken-corporate-affiliation',
        severity: 'error',
        organizationId: relationship.fromId,
        detail: `Relationship ${relationship.id} links an organization to itself.`,
      })
    }
    for (const orgId of [relationship.fromId, relationship.toId]) {
      if (!organizationIds.has(orgId)) {
        issues.push({
          code: 'mistaken-corporate-affiliation',
          severity: 'error',
          organizationId: orgId,
          detail: `Relationship ${relationship.id} references unknown organization "${orgId}".`,
        })
      }
    }
    if (!relationship.evidence.trim() || !relationship.sourceUrl.trim()) {
      issues.push({
        code: 'unsupported-association',
        severity: 'error',
        organizationId: relationship.fromId,
        detail: `Relationship ${relationship.id} (${relationship.type}) has no evidence or source.`,
      })
    }
    // A parent link must agree with the child's parentId field.
    if (relationship.type === 'parent-of') {
      const child = input.organizations.find((organization) => organization.id === relationship.toId)
      if (child && child.parentId && child.parentId !== relationship.fromId) {
        issues.push({
          code: 'conflicting-parent',
          severity: 'error',
          organizationId: child.id,
          detail: `${child.name} records parent ${child.parentId} but relationship ${relationship.id} says ${relationship.fromId}.`,
        })
      }
    }
  }

  // --- Associations and recruiter judgment ---------------------------------
  for (const association of input.associations) {
    for (const orgId of [association.focalId, association.associatedId]) {
      if (!organizationIds.has(orgId)) {
        issues.push({
          code: 'unsupported-association',
          severity: 'error',
          organizationId: orgId,
          detail: `Association ${association.id} references unknown organization "${orgId}".`,
        })
      }
    }
    if (!association.narrative.trim()) {
      issues.push({
        code: 'relevance-without-evidence',
        severity: 'warning',
        organizationId: association.focalId,
        detail: `Association ${association.id} has no explanation of why the companies are associated.`,
      })
    }
    for (const capabilityId of association.sharedProcesses) {
      if (!capabilityIds.has(capabilityId)) {
        issues.push({
          code: 'unsupported-association',
          severity: 'error',
          organizationId: association.focalId,
          detail: `Association ${association.id} references unknown capability "${capabilityId}".`,
        })
      }
    }
  }

  for (const record of input.intelligence) {
    if (!record.reviewer.trim()) {
      issues.push({
        code: 'similarity-as-person-suitability',
        severity: 'error',
        organizationId: record.organizationId,
        detail: `Recruiter observation ${record.id} has no reviewer, so judgment cannot be attributed or corrected.`,
      })
    }
    if (!organizationIds.has(record.organizationId)) {
      issues.push({
        code: 'unsupported-association',
        severity: 'error',
        organizationId: record.organizationId,
        detail: `Recruiter observation ${record.id} references unknown organization "${record.organizationId}".`,
      })
    }
  }

  return issues
}

/** Issues for one organization, for the inspector's "data quality" section. */
export function issuesForOrganization(issues: QualityIssue[], organizationId: string): QualityIssue[] {
  return issues.filter((issue) => issue.organizationId === organizationId)
}
