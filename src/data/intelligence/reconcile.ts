// Legacy reconciliation: folds the per-track company lists into one canonical
// Organization registry plus a ResearchBatch of legacy-derived facts.
// Pure and deterministic so the generated files are reproducible and a rerun
// keeps every organization id stable.

import { parseLocation } from '../searchBank/normalise'
import { slugify } from '../slug'
import { domainOf, normaliseWebsite, organizationKey } from './identity'
import type {
  CoverageRecord,
  EvidenceRecord,
  LineageRef,
  Organization,
  OrganizationCapability,
  OrganizationIndustry,
  OrganizationLocation,
  OrganizationRelationship,
  ResearchBatch,
  ResearchIdentity,
} from './types'

export interface LegacyAccountantCompany {
  id: string
  company_name: string
  company_aliases?: string[]
  website?: string | null
  industry?: string | null
  sub_industry?: string | null
  source_urls?: string[]
  date_verified?: string | null
  south_africa_locations?: string[]
  parent_company?: string | null
  province?: string | null
  city?: string | null
  sage300_confidence?: string | null
  sage300_evidence?: string | null
  finance_team_research_status?: string | null
  finance_people_verified_count?: number | null
}

export interface LegacyCreditRiskCompany {
  id: string
  name: string
  segment?: string | null
  relevance?: string | null
  website?: string | null
}

export interface LegacyFinanceTarget {
  target_id: string
  company_name: string
  research_status: string
  verified_people_count?: number | null
  search_scope?: string | null
  date_last_checked?: string | null
}

export interface LegacyIndustryMap {
  accountants: Record<string, string | null>
  creditRiskSegments: Record<string, string | null>
}

export interface ReconcileInput {
  accountants: LegacyAccountantCompany[]
  creditRisk: LegacyCreditRiskCompany[]
  financeTargets: LegacyFinanceTarget[]
  identities: ResearchIdentity[]
  industryMap: LegacyIndustryMap
  /** Date stamped on the legacy batch (the reconciliation run date). */
  runDate: string
}

export interface ReconcileReport {
  runDate: string
  counts: {
    legacyRecords: number
    organizations: number
    mergedRecords: number
    researchCurated: number
    industryMapped: number
    industryUnmapped: number
    noLegacyIndustry: number
    coverageRecords: number
  }
  merges: { organizationId: string; name: string; refs: string[]; reason: string }[]
  duplicatesWithinSource: { dataset: string; name: string; refs: string[] }[]
  unmappedIndustryLabels: { label: string; refs: string[] }[]
  unclassifiedOrganizations: { organizationId: string; name: string }[]
  unmatchedCoverageTargets: { targetId: string; name: string }[]
  unresolvedParents: { ref: string; parent: string }[]
  missingLineage: { identityId: string; ref: string }[]
}

export interface ReconcileOutput {
  organizations: Organization[]
  legacyBatch: ResearchBatch
  report: ReconcileReport
}

interface Draft {
  org: Organization
  keys: Set<string>
}

const COVERAGE_STATUS: Record<string, CoverageRecord['status']> = {
  RESEARCHED_WITH_PEOPLE: 'researched-with-people',
  RESEARCHED_ZERO_PUBLIC_RESULTS: 'researched-zero-results',
  NEEDS_RESEARCH: 'needs-research',
}

function laterDate(a: string | null, b: string | null | undefined): string | null {
  if (!b) return a
  if (!a) return b
  return b > a ? b : a
}

function legacyIndustryFor(map: LegacyIndustryMap, industry: string, sub: string): string | null | undefined {
  const table = map.accountants
  const full = `${industry.toLowerCase()}|${sub.toLowerCase()}`
  if (full in table) return table[full]
  if (industry.toLowerCase() in table) return table[industry.toLowerCase()]
  if (sub && sub.toLowerCase() in table) return table[sub.toLowerCase()]
  return undefined
}

export function reconcileOrganizations(input: ReconcileInput): ReconcileOutput {
  const drafts = new Map<string, Draft>()
  const keyIndex = new Map<string, string>()
  const claimedRefs = new Map<string, string>()
  const usedIds = new Set<string>()
  const merges: ReconcileReport['merges'] = []
  const missingLineage: ReconcileReport['missingLineage'] = []

  const indexKey = (key: string, orgId: string) => {
    if (key && !keyIndex.has(key)) keyIndex.set(key, orgId)
  }

  const addName = (draft: Draft, name: string) => {
    const key = organizationKey(name)
    if (!key) return
    if (name !== draft.org.name && !draft.org.aliases.includes(name)) draft.org.aliases.push(name)
    draft.keys.add(key)
    indexKey(key, draft.org.id)
  }

  // 1. Curated research identities first: they own their lineage refs and ids.
  for (const identity of input.identities) {
    const org: Organization = {
      id: identity.id,
      name: identity.name,
      aliases: [],
      formerNames: [...(identity.formerNames ?? [])],
      legalName: identity.legalName,
      website: normaliseWebsite(identity.website),
      domain: domainOf(identity.website),
      identityStatus: identity.identityStatus,
      southAfrican: identity.southAfrican ?? true,
      lineage: [],
      lastVerified: null,
    }
    const draft: Draft = { org, keys: new Set() }
    drafts.set(org.id, draft)
    usedIds.add(org.id)
    addName(draft, identity.name)
    for (const alias of identity.aliases) addName(draft, alias)
    for (const former of org.formerNames) addName(draft, former)
    if (identity.legalName) addName(draft, identity.legalName)
    for (const ref of identity.lineage) claimedRefs.set(ref, org.id)
  }

  const newOrgId = (name: string): string => {
    const base = `org-${slugify(name) || 'unnamed'}`
    let id = base
    let n = 2
    while (usedIds.has(id)) id = `${base}-${n++}`
    usedIds.add(id)
    return id
  }

  const attach = (ref: LineageRef, names: string[], website: string | null | undefined, verified: string | null | undefined): string => {
    let orgId = claimedRefs.get(ref.ref)
    let reason = 'curated research identity'
    if (!orgId) {
      for (const name of names) {
        const hit = keyIndex.get(organizationKey(name))
        if (hit) {
          orgId = hit
          reason = 'name or alias key match'
          break
        }
      }
    }
    if (!orgId) {
      orgId = newOrgId(names[0])
      reason = ''
      drafts.set(orgId, {
        org: {
          id: orgId,
          name: names[0],
          aliases: [],
          formerNames: [],
          legalName: null,
          website: null,
          domain: null,
          identityStatus: 'unresolved',
          southAfrican: true,
          lineage: [],
          lastVerified: null,
        },
        keys: new Set(),
      })
    }
    const draft = drafts.get(orgId) as Draft
    if (reason && draft.org.lineage.length > 0) {
      merges.push({ organizationId: orgId, name: draft.org.name, refs: [...draft.org.lineage.map((l) => l.ref), ref.ref], reason })
    }
    draft.org.lineage.push(ref)
    for (const name of names) addName(draft, name)
    if (!draft.org.website && website) {
      draft.org.website = normaliseWebsite(website)
      draft.org.domain = domainOf(website)
    }
    draft.org.lastVerified = laterDate(draft.org.lastVerified, verified)
    return orgId
  }

  const evidence: EvidenceRecord[] = []
  const industries: OrganizationIndustry[] = []
  const capabilities: OrganizationCapability[] = []
  const locations: OrganizationLocation[] = []
  const relationships: OrganizationRelationship[] = []
  const coverage: CoverageRecord[] = []
  const unmapped = new Map<string, string[]>()
  const pendingParents: { orgId: string; ref: string; parent: string; evidenceId: string }[] = []
  const industryKeys = new Set<string>()
  const orgsWithPrimary = new Set<string>()
  let industryMapped = 0
  let noLegacyIndustry = 0
  const sourceNames = new Map<string, string[]>()

  const addIndustry = (orgId: string, industryId: string, evidenceId: string) => {
    const key = `${orgId}|${industryId}`
    if (industryKeys.has(key)) return
    industryKeys.add(key)
    const hasPrimary = orgsWithPrimary.has(orgId)
    orgsWithPrimary.add(orgId)
    industries.push({
      organizationId: orgId,
      industryId,
      role: hasPrimary ? 'secondary' : 'primary',
      evidenceIds: [evidenceId],
      confidence: 'probable',
      origin: 'source-reported',
    })
  }

  // 2. Accounting & Finance research database.
  for (const row of input.accountants) {
    const ref: LineageRef = { ref: `accountants:${row.id}`, dataset: 'accountants', recordId: row.id, sourceName: row.company_name }
    const dupKey = `accountants|${organizationKey(row.company_name)}`
    sourceNames.set(dupKey, [...(sourceNames.get(dupKey) ?? []), ref.ref])
    const orgId = attach(ref, [row.company_name, ...(row.company_aliases ?? [])], row.website, row.date_verified)
    const evidenceId = `ev-legacy-accountants-${row.id}`
    const industry = (row.industry ?? '').trim()
    const sub = (row.sub_industry ?? '').trim()
    const supports = [
      industry ? `Legacy classification "${industry}${sub ? ` / ${sub}` : ''}"` : 'Company listed in the finance research database (no industry recorded)',
      row.sage300_evidence ? `Sage 300 note: ${row.sage300_evidence}` : '',
    ]
      .filter(Boolean)
      .join('. ')
    evidence.push({
      id: evidenceId,
      url: row.source_urls?.[0] ?? normaliseWebsite(row.website),
      sourceName: 'Accounting & Finance research database (markets/accountants/companies.jsonl)',
      sourceType: 'internal-dataset',
      publishedOn: row.date_verified ?? null,
      supports,
    })

    if (industry) {
      const mapped = legacyIndustryFor(input.industryMap, industry, sub)
      if (mapped) {
        addIndustry(orgId, mapped, evidenceId)
        industryMapped++
      } else if (mapped === undefined) {
        const label = `${industry}${sub ? ` / ${sub}` : ''}`
        unmapped.set(label, [...(unmapped.get(label) ?? []), ref.ref])
      }
    } else {
      noLegacyIndustry++
    }

    const sage = (row.sage300_confidence ?? '').toLowerCase()
    if (sage.startsWith('level 1') || sage.startsWith('level 2')) {
      capabilities.push({
        organizationId: orgId,
        capabilityId: 'erp-sage-300',
        status: 'observed',
        evidenceIds: [evidenceId],
        confidence: sage.startsWith('level 1') ? 'probable' : 'hypothesis',
        origin: 'source-reported',
        summary: row.sage300_evidence ?? row.sage300_confidence ?? 'Sage 300 usage recorded in legacy research',
      })
    } else if (sage.startsWith('excluded')) {
      capabilities.push({
        organizationId: orgId,
        capabilityId: 'erp-sage-300',
        status: 'not-observed',
        evidenceIds: [evidenceId],
        confidence: 'probable',
        origin: 'source-reported',
        summary: row.sage300_evidence ?? 'Legacy research excluded this company from the Sage 300 ERP list',
      })
    }

    const places = new Map<string, OrganizationLocation>()
    const addPlace = (province: string, city: string) => {
      if (!province) return
      const key = `${province}|${city}`
      if (places.has(key)) return
      places.set(key, { organizationId: orgId, province, city, evidenceIds: [evidenceId], confidence: 'probable' })
    }
    if (row.province) addPlace(row.province, row.city ?? '')
    for (const raw of row.south_africa_locations ?? []) {
      const parsed = parseLocation(raw.replace(/\(.*?\)/g, ' '))
      addPlace(parsed.province, parsed.city)
    }
    locations.push(...places.values())

    if (row.parent_company) pendingParents.push({ orgId, ref: ref.ref, parent: row.parent_company, evidenceId })
  }

  // 3. Credit Risk company list.
  for (const row of input.creditRisk) {
    const ref: LineageRef = { ref: `credit-risk:${row.id}`, dataset: 'credit-risk', recordId: row.id, sourceName: row.name }
    const dupKey = `credit-risk|${organizationKey(row.name)}`
    sourceNames.set(dupKey, [...(sourceNames.get(dupKey) ?? []), ref.ref])
    const orgId = attach(ref, [row.name], row.website, null)
    const evidenceId = `ev-legacy-credit-risk-${row.id}`
    evidence.push({
      id: evidenceId,
      url: normaliseWebsite(row.website),
      sourceName: 'Credit Risk company list (companies.json)',
      sourceType: 'internal-dataset',
      publishedOn: null,
      supports: `Segment "${row.segment ?? 'unspecified'}"${row.relevance ? `; credit-risk relevance: ${row.relevance}` : ''}`,
    })
    const segment = (row.segment ?? '').trim()
    if (segment) {
      const mapped = input.industryMap.creditRiskSegments[segment.toLowerCase()]
      if (mapped) {
        addIndustry(orgId, mapped, evidenceId)
        industryMapped++
      } else if (mapped === undefined) {
        unmapped.set(segment, [...(unmapped.get(segment) ?? []), ref.ref])
      }
    } else {
      noLegacyIndustry++
    }
  }

  // 4. Parent companies named in legacy rows become factual relationships only when the parent resolves.
  const unresolvedParents: ReconcileReport['unresolvedParents'] = []
  for (const pending of pendingParents) {
    const parentId = keyIndex.get(organizationKey(pending.parent))
    if (!parentId || parentId === pending.orgId) {
      unresolvedParents.push({ ref: pending.ref, parent: pending.parent })
      continue
    }
    relationships.push({
      fromId: pending.orgId,
      toId: parentId,
      type: 'subsidiary-of',
      evidenceIds: [pending.evidenceId],
      confidence: 'probable',
      summary: `Legacy record names ${pending.parent} as parent company`,
    })
  }

  // 5. Recruiting-research coverage from the finance-team target sweep.
  const unmatchedCoverageTargets: ReconcileReport['unmatchedCoverageTargets'] = []
  for (const target of input.financeTargets) {
    const orgId = keyIndex.get(organizationKey(target.company_name))
    const status = COVERAGE_STATUS[target.research_status]
    if (!orgId || !status) {
      unmatchedCoverageTargets.push({ targetId: target.target_id, name: target.company_name })
      continue
    }
    coverage.push({
      organizationId: orgId,
      dataset: 'accountants-finance-team-targets',
      status,
      verifiedPeopleCount: target.verified_people_count ?? null,
      lastChecked: target.date_last_checked ?? null,
      scope: target.search_scope ?? 'Finance team public-profile sweep',
    })
  }

  for (const identity of input.identities) {
    for (const ref of identity.lineage) {
      const draft = drafts.get(identity.id)
      if (!draft?.org.lineage.some((entry) => entry.ref === ref)) missingLineage.push({ identityId: identity.id, ref })
    }
  }

  const organizations = [...drafts.values()]
    .map((draft) => ({ ...draft.org, aliases: [...draft.org.aliases].sort((a, b) => a.localeCompare(b)) }))
    .sort((a, b) => a.id.localeCompare(b.id))

  const classified = new Set(industries.map((row) => row.organizationId))
  const duplicatesWithinSource = [...sourceNames.entries()]
    .filter(([, refs]) => refs.length > 1)
    .map(([key, refs]) => ({ dataset: key.split('|')[0], name: key.split('|')[1], refs }))

  const legacyBatch: ResearchBatch = {
    schemaVersion: 1,
    batchId: 'rb-legacy-reconciliation',
    researchedOn: input.runDate,
    researcher: 'scripts/reconcile-organizations.ts',
    scope: 'Facts carried over from legacy track datasets (classification labels, Sage 300 notes, locations, parent names, research coverage). Generated file: do not edit by hand.',
    method: 'Deterministic mapping via markets/intelligence/taxonomy/legacy-industry-map.json',
    identities: [],
    evidence,
    organizationIndustries: industries,
    organizationCapabilities: capabilities,
    organizationRelationships: relationships,
    locations,
    scaleMetrics: [],
    openQuestions: [],
    coverage,
  }

  return {
    organizations,
    legacyBatch,
    report: {
      runDate: input.runDate,
      counts: {
        legacyRecords: input.accountants.length + input.creditRisk.length,
        organizations: organizations.length,
        mergedRecords: merges.length,
        researchCurated: input.identities.length,
        industryMapped,
        industryUnmapped: [...unmapped.values()].reduce((sum, refs) => sum + refs.length, 0),
        noLegacyIndustry,
        coverageRecords: coverage.length,
      },
      merges,
      duplicatesWithinSource,
      unmappedIndustryLabels: [...unmapped.entries()].map(([label, refs]) => ({ label, refs })).sort((a, b) => a.label.localeCompare(b.label)),
      unclassifiedOrganizations: organizations
        .filter((org) => !classified.has(org.id))
        .map((org) => ({ organizationId: org.id, name: org.name })),
      unmatchedCoverageTargets,
      unresolvedParents,
      missingLineage,
    },
  }
}
