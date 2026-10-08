// QA reviewer 5: the acceptance tests from the implementation directive.
//
// Each check below is one of the acceptance conditions the brief set out, run
// against the real data and the real engine rather than against a fixture built
// to pass. A FAIL here means the product does not do what was asked for,
// regardless of whether the unit tests are green.

import { readData, Reviewer } from './lib'

interface Organization { id: string; name: string; legalName: string; capabilities: { capabilityId: string; status: string }[] }

export async function review(): Promise<Reviewer> {
  const reviewer = new Reviewer('acceptance', 'the directive\'s acceptance conditions, run live')

  const { buildCompanyIntelligence } = await import('../../src/data/organizations/universe.ts')
  const { discoverAssociations, filterMatches } = await import('../../src/data/organizations/discovery.ts')
  const { roleContextById, roleContexts } = await import('../../src/data/organizations/roleContexts.ts')
  const { compareOrganizations, universeStats } = await import('../../src/data/organizations/analysis.ts')
  const { exportTargetsCsv, discoverTargets, emptyFilters } = await import('../../src/data/organizations/query.ts')
  const { runQualityChecks } = await import('../../src/data/organizations/quality.ts')
  const { ingestTargetDrop } = await import('../../src/data/searchBank/targets.ts')
  const { emptyBank } = await import('../../src/data/searchBank/ingest.ts')

  const { index, extraOrganizations } = buildCompanyIntelligence()
  const organizations = readData<Organization[]>('organizations.json')

  const cold = roleContextById('role-cold-storage-financial-manager')!
  const slm = roleContextById('role-slm-property-development')!
  const bester = roleContextById('role-bester-head-of-finance')!

  // A: cold storage Financial Manager ----------------------------------------
  const coldDiscovery = discoverAssociations({ index, focalId: 'org-ccs-logistics', roleContext: cold, extraOrganizations })
  const coldTier1 = coldDiscovery.matches.filter((match) => match.tier === 1)
  const vector = coldDiscovery.matches.find((match) => match.organizationId === 'org-vector-logistics')
  reviewer.check('A-cold-storage-ranks-cold-chain-first',
    coldTier1.length > 0 && !!vector && vector.tier === 1,
    `${coldTier1.length} tier-1 companies; Vector Logistics tier ${vector?.tier ?? 'absent'}`)
  reviewer.check('A-no-discovery-cap', coldDiscovery.matches.length > 20,
    `${coldDiscovery.matches.length} companies returned, none dropped by a limit`)

  const westernCape = filterMatches(coldDiscovery.matches, index, { ...emptyFilters(), provinces: ['Western Cape'] })
  reviewer.check('A-filter-narrows-without-losing-reasons',
    westernCape.length > 0 && westernCape.length < coldDiscovery.matches.length
      && westernCape.every((match) => match.rules.length > 0),
    `${westernCape.length} of ${coldDiscovery.matches.length} in the Western Cape, all still carrying reasons`)

  // B: SLM property development ---------------------------------------------
  const slmEntity = index.byId.get('org-slm-developments')
  reviewer.check('B-slm-legal-identity-verified',
    !!slmEntity && /K2019|Developments \(Pty\) Ltd/.test(`${slmEntity.legalName} ${slmEntity.notes}`),
    slmEntity ? `legal name "${slmEntity.legalName}"` : 'org-slm-developments missing')

  const slmDiscovery = discoverAssociations({ index, focalId: 'org-slm-developments', roleContext: slm, extraOrganizations })
  const rabie = slmDiscovery.matches.find((match) => match.organizationId === 'org-rabie-property-group')
  const fpg = slmDiscovery.matches.find((match) => match.organizationId === 'org-fpg-property-fund')
  reviewer.check('B-rabie-and-fpg-are-comparables',
    !!rabie && !!fpg && rabie.tier <= 2 && fpg.tier <= 2,
    `Rabie tier ${rabie?.tier ?? 'absent'}, FPG Property Fund tier ${fpg?.tier ?? 'absent'}`)

  // Same company, different role: facts identical, targeting different.
  const tiger = index.byId.get('org-tiger-brands')
  const tigerFacts = JSON.stringify(tiger)
  const coldTiger = coldDiscovery.matches.find((match) => match.organizationId === 'org-tiger-brands')
  const propertyFromTiger = discoverAssociations({ index, focalId: 'org-tiger-brands', roleContext: slm, extraOrganizations })
  reviewer.check('B-same-company-different-role',
    !!coldTiger && JSON.stringify(index.byId.get('org-tiger-brands')) === tigerFacts
      && propertyFromTiger.matches.length > 0,
    `Tiger Brands tier ${coldTiger?.tier ?? 'absent'} under the cold-storage brief; facts unchanged: ${JSON.stringify(index.byId.get('org-tiger-brands')) === tigerFacts}`)

  // C: Bester Feed & Grain, mandatory commodity trading ----------------------
  const besterDiscovery = discoverAssociations({ index, focalId: 'org-bester-feed-grain', roleContext: bester, extraOrganizations })
  const nwk = besterDiscovery.matches.find((match) => match.organizationId === 'org-nwk')
  const tier1WithoutMandatory = besterDiscovery.matches.filter((match) => match.tier === 1
    && !match.rules.some((rule) => rule.rule.startsWith('R2')))
  reviewer.check('C-mandatory-exposure-decides-tier-1',
    !!nwk && nwk.tier === 1 && tier1WithoutMandatory.length === 0,
    `NWK tier ${nwk?.tier ?? 'absent'}; ${tier1WithoutMandatory.length} tier-1 companies lack the mandatory rule`)

  const bigNamesNotTier1 = ['org-shoprite', 'org-tiger-brands']
    .map((id) => besterDiscovery.matches.find((match) => match.organizationId === id))
    .filter((match): match is NonNullable<typeof match> => !!match)
  reviewer.check('C-scale-does-not-substitute-for-exposure',
    bigNamesNotTier1.every((match) => match.tier > 1),
    bigNamesNotTier1.map((match) => `${index.byId.get(match.organizationId)?.name} tier ${match.tier}`).join(', ') || 'no large comparables matched')

  // Filtering parity across the three views ----------------------------------
  const grouped = coldDiscovery.pockets.reduce((total, pocket) => total
    + filterMatches(pocket.matches, index, { ...emptyFilters(), provinces: ['Western Cape'] }).length, 0)
  reviewer.check('filter-parity-across-views', grouped === westernCape.length,
    `pocket grouping ${grouped} vs flat list ${westernCape.length}`)

  // Unknowns are never rendered as absent ------------------------------------
  const noSignal = coldDiscovery.matches.filter((match) => match.rules.some((rule) => rule.rule === 'R14-no-operational-signal'))
  const dropped = index.organizations.length + extraOrganizations.length - 1 - coldDiscovery.matches.length
  reviewer.check('unknowns-stay-visible', noSignal.length > 0 && dropped === 0,
    `${noSignal.length} matches carry no operational signal and stay listed at tier 5; ${dropped} candidates dropped entirely`)

  // Comparison tool ----------------------------------------------------------
  const comparison = compareOrganizations(index, 'org-ccs-logistics', 'org-vector-logistics', cold)
  reviewer.check('comparison-reports-shared-distinct-unknown',
    comparison.shared.length > 0 && comparison.distinct.length > 0 && comparison.implications.length > 0,
    `shared ${comparison.shared.length}, distinct ${comparison.distinct.length}, unknown ${comparison.unknown.length}, implications ${comparison.implications.length}`)

  // Export contract ----------------------------------------------------------
  const payload = discoverTargets({ index, focalId: 'org-ccs-logistics', roleContext: cold, page: 1, pageSize: 10, extraOrganizations })
  const csv = exportTargetsCsv(payload)
  reviewer.check('export-is-machine-readable',
    csv.split('\n').length >= 11 && /Missing evidence/i.test(csv.split('\n')[0]),
    `${csv.split('\n').filter(Boolean).length} csv lines; header: ${csv.split('\n')[0].slice(0, 120)}`)

  // Search Bank integration --------------------------------------------------
  const drop = JSON.stringify({
    kind: 'search-targets',
    search: 'Financial Manager — Commercial Cold Storage',
    client: 'Commercial Cold Storage',
    targets: payload.targetCompanies.slice(0, 3).map((row) => ({
      organization_id: row.organizationId,
      company: row.name,
      legal_name: row.legalName,
      pocket: row.pocket,
      tier: row.tier,
      tier_label: row.tierLabel,
      reasons: row.reasons.join('; '),
      mapped_professionals: row.mappedProfessionals,
      evidence_state: row.evidenceState,
      missing_evidence: row.missingEvidence.join('; '),
      recruiter_status: 'proposed',
    })),
  })
  const first = ingestTargetDrop(drop, { bank: emptyBank('2026-10-08'), today: '2026-10-08', source: 'qa.json' })
  const second = ingestTargetDrop(drop, { bank: first.bank, today: '2026-10-08', source: 'qa.json' })
  reviewer.check('search-bank-attach-is-idempotent',
    first.report.added === 3 && second.report.added === 0 && second.report.updated === 3
      && second.bank.targetCompanies.length === 3,
    `first import added ${first.report.added}; re-import added ${second.report.added}, updated ${second.report.updated}, total ${second.bank.targetCompanies.length}`)

  // Scale --------------------------------------------------------------------
  const stats = universeStats(index)
  const scanned = index.organizations.length + extraOrganizations.length
  // The focal company is excluded from its own candidate list, so the scan is
  // the universe minus one; anything less would mean companies were skipped.
  reviewer.check('scans-the-whole-universe',
    scanned >= 300 && coldDiscovery.coverage.organizationsScanned === scanned - 1,
    `${scanned} companies in the universe (${stats.organizations} curated + ${extraOrganizations.length} from existing datasets); ${coldDiscovery.coverage.organizationsScanned} scanned as candidates`)

  // Quality gate -------------------------------------------------------------
  const issues = runQualityChecks({
    organizations: organizations as never,
    industries: readData('industries.json'),
    capabilities: readData('capabilities.json'),
    relationships: readData('corporate-relationships.json'),
    associations: readData('associations.json'),
    intelligence: readData('recruiter-intelligence.json'),
    today: '2026-10-08',
  })
  const errors = issues.filter((issue) => issue.severity === 'error')
  reviewer.check('data-quality-gate-is-clean', errors.length === 0,
    errors.slice(0, 5).map((issue) => `${issue.code}: ${issue.detail}`).join('; ') || `${issues.length} warnings, 0 errors`)

  // Coverage is reported, not claimed ---------------------------------------
  reviewer.check('coverage-separates-verified-from-unknown',
    stats.verified > 0 && stats.pendingVerification > 0 && stats.verified + stats.pendingVerification === stats.organizations,
    `${stats.verified} verified, ${stats.pendingVerification} pending verification of ${stats.organizations}`)

  const contexts = roleContexts()
  reviewer.note('role-contexts', `${contexts.length} contexts available: ${contexts.map((context) => context.id).join(', ')}`)

  return reviewer
}
