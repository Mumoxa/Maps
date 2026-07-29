import {
  canonicalPersonKey,
  canonicalizeIdentityUrl,
  generateMarketProfileId,
} from './identity'
import type {
  MarketBatch,
  MarketDataIssue,
  MarketProfile,
} from './types'

export interface MarketDataValidationInput {
  legacyProfiles: MarketProfile[]
  batches: MarketBatch[]
  registeredTrackSlugs: string[]
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

function isIsoDate(value: unknown) {
  if (typeof value !== 'string' || !ISO_DATE.test(value)) return false
  const parsed = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isNonEmptyStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.length > 0 && value.every(isNonEmptyString)
}

function issue(
  issues: MarketDataIssue[],
  batchId: string | null,
  rowIndex: number | null,
  field: string,
  reason: string,
  severity: MarketDataIssue['severity'] = 'error',
) {
  issues.push({ severity, batchId, rowIndex, field, reason })
}

function canonicalUrlOrIssue(
  value: unknown,
  issues: MarketDataIssue[],
  batchId: string,
  rowIndex: number,
  field: string,
) {
  if (!isNonEmptyString(value)) {
    issue(issues, batchId, rowIndex, field, 'is required')
    return null
  }

  try {
    return canonicalizeIdentityUrl(value)
  } catch (error) {
    issue(
      issues,
      batchId,
      rowIndex,
      field,
      error instanceof Error ? error.message : 'must be a valid HTTPS URL',
    )
    return null
  }
}

function formatIssues(issues: MarketDataIssue[]) {
  return issues
    .map((entry) => {
      const batch = entry.batchId ? `batch ${entry.batchId}` : 'repository'
      const row = entry.rowIndex === null ? '' : ` row ${entry.rowIndex + 2}`
      return `${batch}${row} ${entry.field}: ${entry.reason}`
    })
    .join('\n')
}

export async function validateMarketBatches({
  legacyProfiles,
  batches,
  registeredTrackSlugs,
}: MarketDataValidationInput): Promise<MarketDataIssue[]> {
  const issues: MarketDataIssue[] = []
  const registeredTracks = new Set(registeredTrackSlugs)
  const batchIds = new Set<string>()
  const profilesById = new Map<string, { id: string; trackSlug: string }>()
  const identities = new Map<string, string>()
  const people = new Map<string, string>()
  const names = new Map<string, string>()
  const supersededIds = new Set<string>()

  for (const profile of legacyProfiles) {
    if (profilesById.has(profile.id)) {
      issue(
        issues,
        null,
        null,
        `legacy.${profile.id}.id`,
        'legacy ID is duplicated',
      )
    }
    profilesById.set(profile.id, profile)
    if (profile.linkedinUrl) {
      try {
        const canonicalIdentity = canonicalizeIdentityUrl(profile.linkedinUrl)
        const existingIdentityId = identities.get(canonicalIdentity)
        if (existingIdentityId) {
          issue(
            issues,
            null,
            null,
            `legacy.${profile.id}.linkedinUrl`,
            `legacy identity already exists as ${existingIdentityId}`,
          )
        }
        identities.set(canonicalIdentity, profile.id)
      } catch {
        issue(
          issues,
          null,
          null,
          `legacy.${profile.id}.linkedinUrl`,
          'must be a valid HTTPS URL',
          'warning',
        )
      }
    }
    const personKey = canonicalPersonKey(profile)
    const existingPersonId = people.get(personKey)
    if (existingPersonId) {
      issue(
        issues,
        null,
        null,
        `legacy.${profile.id}`,
        `legacy person already exists as ${existingPersonId}`,
      )
    }
    people.set(personKey, profile.id)

    const nameKey = profile.name.trim().toLowerCase()
    const existingNameId = names.get(nameKey)
    if (existingNameId && existingNameId !== existingPersonId) {
      issue(
        issues,
        null,
        null,
        `legacy.${profile.id}.name`,
        `matches ${existingNameId}; review possible namesake`,
        'warning',
      )
    }
    names.set(nameKey, profile.id)
  }

  for (const batch of batches) {
    const batchId = isNonEmptyString(batch.batchId) ? batch.batchId : '(missing batch ID)'

    if (batch.schemaVersion !== 1) {
      issue(issues, batchId, null, 'schemaVersion', 'must equal 1')
    }
    if (!isNonEmptyString(batch.batchId)) {
      issue(issues, batchId, null, 'batchId', 'is required')
    } else if (batchIds.has(batch.batchId)) {
      issue(issues, batchId, null, 'batchId', 'is duplicated')
    } else {
      batchIds.add(batch.batchId)
    }
    if (!registeredTracks.has(batch.trackSlug)) {
      issue(issues, batchId, null, 'trackSlug', 'is not a registered track')
    }
    if (!isNonEmptyString(batch.sourceFile)) {
      issue(issues, batchId, null, 'sourceFile', 'is required')
    }
    if (!isIsoDate(batch.suppliedOn)) {
      issue(issues, batchId, null, 'suppliedOn', 'must be an ISO YYYY-MM-DD date')
    }
    if (!Array.isArray(batch.records)) {
      issue(issues, batchId, null, 'records', 'must be an array')
      continue
    }

    for (const [rowIndex, record] of batch.records.entries()) {
      const prefix = `records[${rowIndex}]`
      const requiredStrings: [string, unknown][] = [
        ['id', record.id],
        ['name', record.name],
        ['title', record.title],
        ['company', record.company],
        ['location.city', record.location?.city],
        ['location.province', record.location?.province],
        ['location.country', record.location?.country],
        ['seniority', record.seniority],
        ['summary', record.summary],
      ]

      for (const [field, value] of requiredStrings) {
        if (!isNonEmptyString(value)) {
          issue(issues, batchId, rowIndex, `${prefix}.${field}`, 'is required')
        }
      }

      for (const [field, value] of [
        ['skills', record.skills],
        ['sectors', record.sectors],
        ['specialisms', record.specialisms],
      ] as const) {
        if (!isNonEmptyStringArray(value)) {
          issue(issues, batchId, rowIndex, `${prefix}.${field}`, 'must contain at least one value')
        }
      }

      if (record.suppliedAsVerified !== true) {
        issue(issues, batchId, rowIndex, `${prefix}.suppliedAsVerified`, 'must equal true')
      }
      if (
        typeof record.attributes !== 'object'
        || record.attributes === null
        || Array.isArray(record.attributes)
      ) {
        issue(issues, batchId, rowIndex, `${prefix}.attributes`, 'must be a JSON object')
      }

      const canonicalIdentity = canonicalUrlOrIssue(
        record.linkedinUrl,
        issues,
        batchId,
        rowIndex,
        `${prefix}.linkedinUrl`,
      )

      if (!Array.isArray(record.sources) || record.sources.length === 0) {
        issue(issues, batchId, rowIndex, `${prefix}.sources`, 'must contain at least one source')
      } else {
        for (const [sourceIndex, source] of record.sources.entries()) {
          const sourcePrefix = `${prefix}.sources[${sourceIndex}]`
          canonicalUrlOrIssue(source.url, issues, batchId, rowIndex, `${sourcePrefix}.url`)
          if (!isNonEmptyString(source.type)) {
            issue(issues, batchId, rowIndex, `${sourcePrefix}.type`, 'is required')
          }
          if (!isNonEmptyString(source.evidence)) {
            issue(issues, batchId, rowIndex, `${sourcePrefix}.evidence`, 'is required')
          }
          if (!isIsoDate(source.checkedOn)) {
            issue(
              issues,
              batchId,
              rowIndex,
              `${sourcePrefix}.checkedOn`,
              'must be an ISO YYYY-MM-DD date',
            )
          }
        }
      }

      const superseded = record.supersedesId
        ? profilesById.get(record.supersedesId)
        : undefined
      if (record.supersedesId && !superseded) {
        issue(issues, batchId, rowIndex, `${prefix}.supersedesId`, 'does not exist in prior data')
      } else if (superseded && superseded.trackSlug !== batch.trackSlug) {
        issue(
          issues,
          batchId,
          rowIndex,
          `${prefix}.supersedesId`,
          `belongs to track ${superseded.trackSlug}`,
        )
      } else if (superseded && supersededIds.has(superseded.id)) {
        issue(issues, batchId, rowIndex, `${prefix}.supersedesId`, 'is already superseded')
      }

      if (isNonEmptyString(record.id) && profilesById.has(record.id)) {
        issue(issues, batchId, rowIndex, `${prefix}.id`, 'is duplicated')
      }

      if (canonicalIdentity) {
        const expectedId = await generateMarketProfileId(batch.trackSlug, canonicalIdentity)
        if (record.id !== expectedId) {
          issue(issues, batchId, rowIndex, `${prefix}.id`, `does not match the stable ID ${expectedId}`)
        }

        const existingIdentityId = identities.get(canonicalIdentity)
        if (existingIdentityId && existingIdentityId !== record.supersedesId) {
          issue(
            issues,
            batchId,
            rowIndex,
            `${prefix}.linkedinUrl`,
            `identity already exists as ${existingIdentityId}`,
          )
        }
      }

      if (
        isNonEmptyString(record.name)
        && isNonEmptyString(record.company)
        && isNonEmptyString(record.title)
      ) {
        const personKey = canonicalPersonKey(record)
        const existingPersonId = people.get(personKey)
        if (existingPersonId && existingPersonId !== record.supersedesId) {
          issue(
            issues,
            batchId,
            rowIndex,
            prefix,
            `same name, company and title as ${existingPersonId}`,
          )
        }

        const nameKey = record.name.trim().toLowerCase()
        const existingNameId = names.get(nameKey)
        if (existingNameId && existingNameId !== record.supersedesId) {
          issue(
            issues,
            batchId,
            rowIndex,
            `${prefix}.name`,
            `matches ${existingNameId}; review possible namesake`,
            'warning',
          )
        }
        people.set(personKey, record.id)
        names.set(nameKey, record.id)
      }

      profilesById.set(record.id, { id: record.id, trackSlug: batch.trackSlug })
      if (canonicalIdentity) identities.set(canonicalIdentity, record.id)
      if (superseded) supersededIds.add(superseded.id)
    }
  }

  return issues
}

export async function assertValidMarketData(input: MarketDataValidationInput) {
  const issues = await validateMarketBatches(input)
  const errors = issues.filter(({ severity }) => severity === 'error')

  if (errors.length > 0) {
    throw new Error(formatIssues(errors))
  }

  return issues
}
