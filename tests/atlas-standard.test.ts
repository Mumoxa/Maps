// The atlas standard: placeholder employers and the verification gate.
//
// Two failures are being prevented here, and both are the kind that look fine
// in the UI:
//
//   1. A source's uncertainty note ("Employer verify") becoming a company. It
//      then appears in the atlas as an employer with people attached, which is
//      an invented company that nobody can ever research.
//   2. A company being marked verified while carrying none of the evidence that
//      makes the word mean anything. The gate exists so a batch cannot promote
//      itself, and so the refusal names what is still missing.

import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { isEmployerPlaceholder } from '../src/data/companyNormalization'
import { partitionPlaceholderEmployers } from '../src/data/organizations/universe'
import {
  STALE_AFTER_DAYS,
  STANDARD_FIELDS,
  missingStandardFields,
  standardChecks,
  verificationGate,
} from '../src/data/organizations/verification'
import type { Organization } from '../src/data/organizations/types'

const TODAY = '2026-11-04'

function organization(overrides: Partial<Organization> = {}): Organization {
  return {
    id: 'org-example',
    name: 'Example Holdings',
    legalName: '',
    aliases: [],
    website: '',
    status: 'needs-verification',
    industries: [],
    capabilities: [],
    locations: [],
    scale: [],
    parentId: null,
    sources: [],
    datasets: ['import'],
    lastVerified: '',
    notes: '',
    ...overrides,
  }
}

describe('employer placeholder notes', () => {
  it('recognises the note-style values the sources actually contain', () => {
    const notes = [
      'Employer verify',
      'Employer to verify',
      'Employer unconfirmed',
      'Employer and title unconfirmed',
      'Current employer unconfirmed',
      'Current employer verify',
      'Current company unconfirmed',
      'Employer current unconfirmed',
      'Finance executive – employer verify',
      'Current renewable energy employer — verify',
      'Growth-stage business – employer verify',
      'Project-based employer unconfirmed',
      'Unconfirmed',
      'Unknown',
      'N/A',
    ]
    for (const note of notes) {
      assert.equal(isEmployerPlaceholder(note), true, `expected "${note}" to be treated as a note`)
    }
  })

  it('never excludes a real company whose name merely contains a note word', () => {
    for (const name of ['Unconfirmed Logistics', 'Verify Media', 'Unknown Productions', 'Naspers']) {
      assert.equal(isEmployerPlaceholder(name), false, `expected "${name}" to stay a company`)
    }
  })

  it('treats an empty employer as unestablished rather than a blank company', () => {
    assert.equal(isEmployerPlaceholder(''), true)
    assert.equal(isEmployerPlaceholder(null), true)
  })

  it('splits dataset employers into companies and unestablished notes', () => {
    const { resolved, placeholders } = partitionPlaceholderEmployers([
      { name: 'Capitec', dataset: 'contacts', professionals: 4, classification: '' },
      { name: 'Employer verify', dataset: 'accounting-finance', professionals: 7, classification: '' },
      { name: 'Current employer unconfirmed', dataset: 'accounting-finance', professionals: 3, classification: '' },
    ])
    assert.deepEqual(resolved.map((entry) => entry.name), ['Capitec'])
    assert.deepEqual(placeholders.map((entry) => entry.name), ['Employer verify', 'Current employer unconfirmed'])
  })
})

describe('verification gate', () => {
  it('refuses a company with no website, source, classification or location', () => {
    const gate = verificationGate({ organization: organization(), hasPlacement: false })
    assert.equal(gate.eligible, false)
    assert.deepEqual(gate.missing, ['website', 'sourced', 'classified', 'located'])
    assert.equal(gate.reasons.length, gate.missing.length)
  })

  it('refuses a source that has a URL but no statement of what it supports', () => {
    const gate = verificationGate({
      organization: organization({
        website: 'https://example.co.za/',
        sources: [{ url: 'https://example.co.za/', type: 'company-website', evidence: '', checkedOn: TODAY }],
        locations: [{ city: 'Cape Town', province: 'Western Cape', sourceUrl: 'https://example.co.za/', checkedOn: TODAY }],
      }),
      hasPlacement: true,
    })
    assert.equal(gate.eligible, false)
    assert.deepEqual(gate.missing, ['sourced'])
  })

  it('refuses a location with no province', () => {
    const gate = verificationGate({
      organization: organization({
        website: 'https://example.co.za/',
        sources: [{ url: 'https://example.co.za/', type: 'company-website', evidence: 'Describes its own operations.', checkedOn: TODAY }],
        locations: [{ city: 'Cape Town', province: '', sourceUrl: 'https://example.co.za/', checkedOn: TODAY }],
      }),
      hasPlacement: true,
    })
    assert.deepEqual(gate.missing, ['located'])
  })

  it('admits a company that carries every required piece of evidence', () => {
    const gate = verificationGate({
      organization: organization({
        website: 'https://example.co.za/',
        status: 'verified',
        sources: [{
          url: 'https://example.co.za/',
          type: 'company-website',
          evidence: 'Company describes its own operations and head office location.',
          checkedOn: TODAY,
        }],
        locations: [{ city: 'Cape Town', province: 'Western Cape', sourceUrl: 'https://example.co.za/', checkedOn: TODAY }],
      }),
      hasPlacement: true,
    })
    assert.equal(gate.eligible, true)
    assert.deepEqual(gate.missing, [])
  })

  it('does not require scale or capabilities: verified is not the same as complete', () => {
    const gate = verificationGate({
      organization: organization({
        website: 'https://example.co.za/',
        sources: [{ url: 'https://example.co.za/', type: 'company-website', evidence: 'Own operations.', checkedOn: TODAY }],
        locations: [{ city: 'Durban', province: 'KwaZulu-Natal', sourceUrl: 'https://example.co.za/', checkedOn: TODAY }],
      }),
      hasPlacement: true,
    })
    assert.equal(gate.eligible, true)
  })
})

describe('the 13-field standard', () => {
  it('reports every field as missing for an empty dataset-only record', () => {
    const checks = standardChecks({
      organization: organization({ name: 'Known Employer' }),
      hasPlacement: false,
      footprintEstablished: false,
      hasRelationship: false,
      today: TODAY,
    })
    assert.deepEqual(missingStandardFields(checks).map((field) => field.key), [
      'website', 'legalName', 'aliases', 'classified', 'taxonomyPlacement', 'sourced',
      'fresh', 'located', 'scale', 'footprint', 'capabilities', 'relationships',
    ])
  })

  it('treats verification older than the stale window as not fresh', () => {
    const staleDate = new Date(new Date(TODAY).getTime() - (STALE_AFTER_DAYS + 1) * 86_400_000)
      .toISOString()
      .slice(0, 10)
    const checks = standardChecks({
      organization: organization({ lastVerified: staleDate }),
      hasPlacement: false,
      footprintEstablished: false,
      hasRelationship: false,
      today: TODAY,
    })
    assert.equal(checks.fresh, false)
  })

  it('passes every field when the dossier is complete', () => {
    const checks = standardChecks({
      organization: organization({
        legalName: 'Example Holdings (Pty) Ltd',
        aliases: ['Example'],
        website: 'https://example.co.za/',
        industries: [{
          industryId: 'commercial-banking',
          primary: true,
          confidence: 'confirmed',
          evidence: 'Registered bank.',
          sourceUrl: 'https://example.co.za/',
          checkedOn: TODAY,
        }],
        sources: [{ url: 'https://example.co.za/', type: 'company-website', evidence: 'Own operations.', checkedOn: TODAY }],
        locations: [{ city: 'Cape Town', province: 'Western Cape', sourceUrl: 'https://example.co.za/', checkedOn: TODAY }],
        scale: [{
          metric: 'employees',
          value: '1,200 employees',
          basis: 'source-reported',
          asOf: TODAY,
          sourceUrl: 'https://example.co.za/',
          checkedOn: TODAY,
        }],
        capabilities: [{
          capabilityId: 'retail-banking',
          status: 'observed',
          confidence: 'confirmed',
          evidence: 'Describes retail banking.',
          sourceUrl: 'https://example.co.za/',
          checkedOn: TODAY,
        }],
        lastVerified: TODAY,
      }),
      hasPlacement: true,
      footprintEstablished: true,
      hasRelationship: true,
      today: TODAY,
    })
    assert.deepEqual(missingStandardFields(checks), [])
  })

  it('keeps a single field list, so the ledger and the gate cannot drift', () => {
    assert.equal(STANDARD_FIELDS.length, 13)
    assert.equal(new Set(STANDARD_FIELDS.map((field) => field.key)).size, 13)
    for (const field of STANDARD_FIELDS) {
      assert.ok(field.label.trim(), `${field.key} needs a label`)
      assert.ok(field.rationale.trim(), `${field.key} needs a rationale`)
    }
  })
})

describe('importer verification gate', () => {
  it('promotes only a company that carries the required evidence', async () => {
    const { planImport } = await import('../scripts/organizations-import')
    const { organization: fixture } = await import('./helpers/organizations')
    const dataset = {
      industries: [],
      capabilities: [],
      organizations: [
        fixture({
          id: 'org-thin',
          name: 'Thin Record',
          status: 'needs-verification',
          website: '',
          sources: [],
          locations: [],
        }),
        fixture({
          id: 'org-ready',
          name: 'Ready Record',
          status: 'needs-verification',
          website: 'https://ready.test/',
          sources: [{
            url: 'https://ready.test/',
            type: 'company-website',
            evidence: 'Company describes its own operations.',
            checkedOn: TODAY,
          }],
          locations: [{ city: 'Cape Town', province: 'Western Cape', sourceUrl: 'https://ready.test/', checkedOn: TODAY }],
          taxonomy: {
            primaryNode: '',
            secondaryNodes: [],
            confidence: 'probable',
            evidence: '',
            sourceUrl: 'https://ready.test/',
            checkedOn: TODAY,
          },
        }),
      ],
      relationships: [],
      associations: [],
      intelligence: [],
    }

    const plan = planImport(
      [
        { name: 'Thin Record', verification_status: 'verified' },
        { name: 'Ready Record', verification_status: 'verified' },
      ],
      'companies',
      dataset,
    )

    assert.equal(plan.verification.length, 2)
    assert.equal(plan.verification.filter((decision) => decision.eligible).length, 1)

    const thin = plan.updatedOrganizations.find((entry) => entry.id === 'org-thin')
    const ready = plan.updatedOrganizations.find((entry) => entry.id === 'org-ready')
    assert.equal(thin?.status, 'needs-verification', 'a thin record must not be promoted by the file')
    assert.equal(ready?.status, 'verified')

    const refusal = plan.issues.find((issue) => issue.field === 'verification_status')
    assert.ok(refusal, 'a refused promotion must be reported, not silently dropped')
    assert.match(refusal.reason, /cannot be verified yet/)
  })

  it('rejects an unrecognised status value instead of guessing', async () => {
    const { planImport } = await import('../scripts/organizations-import')
    const { organization: fixture } = await import('./helpers/organizations')
    const plan = planImport(
      [{ name: 'Any Record', verification_status: 'maybe' }],
      'companies',
      {
        industries: [],
        capabilities: [],
        organizations: [fixture({ id: 'org-any', name: 'Any Record' })],
        relationships: [],
        associations: [],
        intelligence: [],
      },
    )
    assert.equal(plan.verification.length, 0)
    assert.ok(plan.issues.some((issue) => issue.field === 'verification_status' && /unsupported verification status/.test(issue.reason)))
  })

  it('reports granted and refused promotions in the CLI summary', async () => {
    const { planImport, planSummary } = await import('../scripts/organizations-import')
    const { organization: fixture } = await import('./helpers/organizations')
    const plan = planImport(
      [{ name: 'Thin Record', verification_status: 'verified' }],
      'companies',
      {
        industries: [],
        capabilities: [],
        organizations: [fixture({ id: 'org-thin', name: 'Thin Record', status: 'needs-verification', website: '', sources: [], locations: [] })],
        relationships: [],
        associations: [],
        intelligence: [],
      },
    )
    const summary = planSummary(plan)
    assert.equal(summary.verification.requested, 1)
    assert.equal(summary.verification.granted, 0)
    assert.equal(summary.verification.refused, 1)
    assert.equal(summary.verification.refusals[0].company, 'Thin Record')
  })
})

describe('promoting gate-eligible companies', () => {
  it('derives the verification date from the newest source the record cites', async () => {
    const { latestSourceDate } = await import('../scripts/promote-verified')
    const record = organization({
      sources: [
        { url: 'https://a.test/', type: 'company-website', evidence: 'A.', checkedOn: '2026-01-05' },
        { url: 'https://b.test/', type: 'corporate-disclosure', evidence: 'B.', checkedOn: '2026-09-30' },
      ],
      locations: [{ city: 'Cape Town', province: 'Western Cape', sourceUrl: 'https://b.test/', checkedOn: '2026-03-01' }],
      lastVerified: '',
    })
    assert.equal(latestSourceDate(record), '2026-09-30')
  })

  it('leaves the date empty when nothing in the record is dated', async () => {
    const { latestSourceDate } = await import('../scripts/promote-verified')
    assert.equal(latestSourceDate(organization({ sources: [] })), '')
  })

  it('promotes only what the gate accepts, and never bypasses it', async () => {
    const { planPromotions } = await import('../scripts/promote-verified')
    const ready = organization({
      id: 'org-ready',
      name: 'Ready Co',
      status: 'needs-verification',
      website: 'https://ready.test/',
      sources: [{ url: 'https://ready.test/', type: 'company-website', evidence: 'Own operations.', checkedOn: TODAY }],
      locations: [{ city: 'Durban', province: 'KwaZulu-Natal', sourceUrl: 'https://ready.test/', checkedOn: TODAY }],
      industries: [{
        industryId: 'commercial-banking',
        primary: true,
        confidence: 'confirmed',
        evidence: 'Registered bank.',
        sourceUrl: 'https://ready.test/',
        checkedOn: TODAY,
      }],
      lastVerified: '',
    })
    const thin = organization({
      id: 'org-thin',
      name: 'Thin Co',
      status: 'needs-verification',
      website: '',
      sources: [],
      locations: [],
      lastVerified: '',
    })

    const plan = planPromotions([ready, thin])
    assert.deepEqual(plan.promoted.map((entry) => entry.id), ['org-ready'])
    assert.deepEqual(plan.refused.map((entry) => entry.organization.id), ['org-thin'])
    assert.deepEqual(plan.dated.map((entry) => entry.organization.id), ['org-ready'])
  })

  it('does not disturb a company that is already verified', async () => {
    const { planPromotions } = await import('../scripts/promote-verified')
    const done = organization({
      id: 'org-done',
      name: 'Done Co',
      status: 'verified',
      website: 'https://done.test/',
      sources: [{ url: 'https://done.test/', type: 'company-website', evidence: 'Own operations.', checkedOn: TODAY }],
      locations: [{ city: 'Cape Town', province: 'Western Cape', sourceUrl: 'https://done.test/', checkedOn: TODAY }],
      lastVerified: TODAY,
    })
    const plan = planPromotions([done])
    assert.deepEqual(plan.promoted, [])
    assert.deepEqual(plan.dated, [])
    assert.deepEqual(plan.refused, [])
  })
})

describe('restated scale measures', () => {
  it('collapses two spellings of one headcount instead of stacking them', async () => {
    const { scaleFingerprint } = await import('../scripts/organizations-import')
    const base = { metric: 'employees' as const, entityScope: 'consolidated-group' as const }
    assert.equal(
      scaleFingerprint({ ...base, value: 'more than 27 000 employees' }),
      scaleFingerprint({ ...base, value: 'over 27000 people' }),
      'the same headcount worded two ways is one measure',
    )
    assert.notEqual(
      scaleFingerprint({ ...base, value: 'over 27000 people' }),
      scaleFingerprint({ ...base, value: 'under 27000 people' }),
      'a qualifier that changes the claim must change the fingerprint',
    )
    assert.notEqual(
      scaleFingerprint({ ...base, value: 'over 27000 people' }),
      scaleFingerprint({ ...base, entityScope: 'south-african-operation', value: 'over 27000 people' }),
      'the same number for a different entity is a different measure',
    )
    assert.notEqual(
      scaleFingerprint({ ...base, value: 'over 27000 people' }),
      scaleFingerprint({ ...base, metric: 'sites', value: 'over 27000 people' }),
      'a different metric is a different measure',
    )
  })

  it('keeps the existing measure and reports the restatement on import', async () => {
    const { planImport } = await import('../scripts/organizations-import')
    const { organization: fixture } = await import('./helpers/organizations')
    const organization = fixture({
      id: 'org-mutual',
      name: 'Mutual Group',
      scale: [{
        metric: 'employees',
        value: 'more than 27 000 employees',
        basis: 'source-reported',
        asOf: 'not stated (page checked 2026-11-04)',
        sourceUrl: 'https://mutual.test/about',
        checkedOn: TODAY,
        entityScope: 'consolidated-group',
      }],
    })

    const plan = planImport(
      [{
        name: 'Mutual Group',
        scale_metric: 'employees',
        scale_value: 'over 27000 people',
        scale_basis: 'source-reported',
        scale_as_of: 'not stated (page checked 2026-11-04)',
        scale_entity_scope: 'consolidated-group',
        source_url: 'https://mutual.test/about',
        evidence: 'The company states it employs over 27000 people.',
        checked_on: TODAY,
      }],
      'companies',
      { industries: [], capabilities: [], organizations: [organization], relationships: [], associations: [], intelligence: [] },
    )

    const updated = plan.updatedOrganizations.find((entry) => entry.id === 'org-mutual')
    assert.equal(updated?.scale.length, 1, 'a restatement must not add a second measure')
    assert.equal(updated?.scale[0].value, 'more than 27 000 employees')
    assert.ok(
      plan.issues.some((issue) => issue.field === 'scale_value' && /restates it/.test(issue.reason)),
      'the restatement must be visible in the import report',
    )
  })
})

describe('a website only counts when a source confirms it', () => {
  const base = {
    id: 'org-site',
    name: 'Site Record',
    website: 'https://company.test/',
    locations: [{ city: 'Cape Town', province: 'Western Cape', sourceUrl: 'https://company.test/', checkedOn: TODAY }],
  }

  it('accepts a website carried by the company\'s own page on that domain', async () => {
    const { verificationGate } = await import('../src/data/organizations/verification')
    const { organization: fixture } = await import('./helpers/organizations')
    const organization = fixture({
      ...base,
      sources: [{
        url: 'https://www.company.test/about',
        type: 'company-website',
        evidence: 'The company describes its own operations.',
        checkedOn: TODAY,
      }],
    })
    const gate = verificationGate({ organization, hasPlacement: true })
    assert.equal(gate.eligible, true, gate.reasons.join('; '))
  })

  it('rejects a website whose only source is a news article elsewhere', async () => {
    const { verificationGate } = await import('../src/data/organizations/verification')
    const { organization: fixture } = await import('./helpers/organizations')
    const organization = fixture({
      ...base,
      website: 'https://news.example/',
      sources: [{
        url: 'https://news.example/company-expands',
        type: 'news',
        evidence: 'A news report describes the company.',
        checkedOn: TODAY,
      }],
    })
    const gate = verificationGate({ organization, hasPlacement: true })
    assert.equal(gate.eligible, false, 'a news article must not verify a company')
    assert.deepEqual(gate.missing, ['website'])
    assert.match(gate.reasons[0], /not backed by a company-website/)
  })

  it('rejects a website nobody has checked, even if it looks official', async () => {
    const { verificationGate } = await import('../src/data/organizations/verification')
    const { organization: fixture } = await import('./helpers/organizations')
    const organization = fixture({
      ...base,
      sources: [{
        url: 'https://company.test/',
        type: 'recruiter-supplied',
        evidence: 'Recruiter gave the URL.',
        checkedOn: TODAY,
      }],
    })
    const gate = verificationGate({ organization, hasPlacement: true })
    assert.equal(gate.eligible, false, 'an unverified URL is a claim, not evidence')
    assert.deepEqual(gate.missing, ['website'])
  })

  it('compares registrable domains, so prefixes do not defeat the check', async () => {
    const { registrableDomain } = await import('../src/data/organizations/verification')
    assert.equal(registrableDomain('https://group.nedbank.co.za/'), registrableDomain('https://www.nedbank.co.za/about'))
    assert.equal(registrableDomain('https://assets.kpmg.com/x'), registrableDomain('https://kpmg.com/za'))
    assert.notEqual(registrableDomain('https://company.co.za'), registrableDomain('https://company.com'))
    assert.equal(registrableDomain('not a url'), '')
  })
})

describe('third-party hosts never verify a company', () => {
  it('rejects a source on an aggregator or news host even when labelled company-website', async () => {
    const { hasOfficialSource, isThirdPartyHost } = await import('../src/data/organizations/verification')
    const { organization: fixture } = await import('./helpers/organizations')
    const organization = fixture({
      id: 'org-linked',
      name: 'Linked Record',
      website: 'https://linked.test/',
      sources: [{
        url: 'https://za.linkedin.com/company/linked-record',
        type: 'company-website',
        evidence: 'A LinkedIn page describes the company.',
        checkedOn: TODAY,
      }],
    })
    assert.equal(hasOfficialSource(organization), false)
    assert.equal(isThirdPartyHost('https://za.linkedin.com/company/x'), true)
    assert.equal(isThirdPartyHost('https://www.moneyweb.co.za/tools-and-data/x'), true)
    assert.equal(isThirdPartyHost('https://senspdf.jse.co.za/documents/x.pdf'), true)
    assert.equal(isThirdPartyHost('https://www.nedbank.co.za/about'), false)
  })

  it('accepts a company site served from a different TLD than the recorded website', async () => {
    const { hasOfficialSource } = await import('../src/data/organizations/verification')
    const { organization: fixture } = await import('./helpers/organizations')
    const organization = fixture({
      id: 'org-cross-tld',
      name: 'Cross Tld',
      website: 'https://www.example.com/',
      sources: [{
        url: 'https://www.example.co.za/about-us',
        type: 'company-website',
        evidence: 'The South African site describes the company.',
        checkedOn: TODAY,
      }],
    })
    assert.equal(hasOfficialSource(organization), true)
  })
})

describe('listed-only is its own state, not a soft verified', () => {
  const today = '2026-11-04'

  it('accepts a member listing as enough to be listed-only', async () => {
    const { listingGate } = await import('../src/data/organizations/verification')
    const { organization: fixture } = await import('./helpers/organizations')
    const organization = fixture({
      id: 'org-listed',
      name: 'Listed Firm',
      sources: [{
        url: 'https://assoc.test/members/listed-firm.pdf',
        type: 'industry-directory',
        evidence: 'The association lists this firm as a member.',
        checkedOn: today,
      }],
    })
    assert.equal(listingGate(organization).eligible, true)
  })

  it('rejects a commercial people-database profile and a report', async () => {
    const { listingGate } = await import('../src/data/organizations/verification')
    const { organization: fixture } = await import('./helpers/organizations')
    const profile = fixture({
      id: 'org-profile',
      name: 'Profile Firm',
      sources: [{
        url: 'https://pitchbook.test/profiles/company/1',
        type: 'business-directory',
        evidence: 'A profile page.',
        checkedOn: today,
      }],
    })
    assert.equal(listingGate(profile).eligible, false, 'a generated profile is not a register')

    const report = fixture({
      id: 'org-report',
      name: 'Report Firm',
      sources: [{
        url: 'https://report.test/top-100',
        type: 'industry-report',
        evidence: 'A ranking lists the firm.',
        checkedOn: today,
      }],
    })
    assert.equal(listingGate(report).eligible, false, 'a ranking is not a register')
  })

  it('rejects a listing with no evidence sentence or no checked date', async () => {
    const { listingGate } = await import('../src/data/organizations/verification')
    const { organization: fixture } = await import('./helpers/organizations')
    const noEvidence = fixture({
      id: 'org-bare',
      name: 'Bare Firm',
      sources: [{ url: 'https://assoc.test/members/bare.pdf', type: 'industry-directory', evidence: '', checkedOn: today }],
    })
    assert.equal(listingGate(noEvidence).eligible, false)

    const noDate = fixture({
      id: 'org-undated',
      name: 'Undated Firm',
      sources: [{ url: 'https://assoc.test/members/undated.pdf', type: 'industry-directory', evidence: 'Listed as a member.', checkedOn: '' }],
    })
    assert.equal(listingGate(noDate).eligible, false)
  })

  it('never lets a listed-only request promote a record to verified', async () => {
    const { planImport } = await import('../scripts/organizations-import')
    const { organization: fixture } = await import('./helpers/organizations')
    const organization = fixture({
      id: 'org-listed-import',
      name: 'Listed Import',
      status: 'needs-verification',
      website: 'https://listed.test/',
      sources: [{
        url: 'https://assoc.test/members/listed-import.pdf',
        type: 'industry-directory',
        evidence: 'The association lists this firm as a member.',
        checkedOn: today,
      }],
      locations: [{ city: 'Cape Town', province: 'Western Cape', sourceUrl: 'https://assoc.test/', checkedOn: today }],
    })
    const plan = planImport(
      [{ name: 'Listed Import', verification_status: 'listed-only' }],
      'companies',
      { industries: [], capabilities: [], organizations: [organization], relationships: [], associations: [], intelligence: [] },
    )
    const updated = plan.updatedOrganizations.find((entry) => entry.id === 'org-listed-import')
    assert.equal(updated?.status, 'listed-only', 'the weaker request must not upgrade the record')
  })

  it('does not demote a verified record when a listing claims a weaker state', async () => {
    const { planImport } = await import('../scripts/organizations-import')
    const { organization: fixture } = await import('./helpers/organizations')
    const organization = fixture({
      id: 'org-stays-verified',
      name: 'Stays Verified',
      status: 'verified',
      website: 'https://stays.test/',
      sources: [
        { url: 'https://stays.test/about', type: 'company-website', evidence: 'The company describes itself.', checkedOn: today },
        { url: 'https://assoc.test/members/stays.pdf', type: 'industry-directory', evidence: 'The association lists it.', checkedOn: today },
      ],
      locations: [{ city: 'Cape Town', province: 'Western Cape', sourceUrl: 'https://stays.test/', checkedOn: today }],
      taxonomy: { primaryNode: '', secondaryNodes: [], confidence: 'probable', evidence: '', sourceUrl: 'https://stays.test/', checkedOn: today },
    })
    const plan = planImport(
      [{ name: 'Stays Verified', verification_status: 'listed-only' }],
      'companies',
      { industries: [], capabilities: [], organizations: [organization], relationships: [], associations: [], intelligence: [] },
    )
    const updated = plan.updatedOrganizations.find((entry) => entry.id === 'org-stays-verified')
    assert.equal(updated?.status, 'verified', 'verified is stronger than listed-only and must survive')
  })
})

describe('a province alone is a complete location', () => {
  const today = '2026-11-04'

  it('satisfies the located requirement without a city', async () => {
    const { verificationGate, standardChecks } = await import('../src/data/organizations/verification')
    const { organization: fixture } = await import('./helpers/organizations')
    const organization = fixture({
      id: 'org-province-only',
      name: 'Province Only',
      website: 'https://province.test/',
      sources: [{
        url: 'https://province.test/about',
        type: 'company-website',
        evidence: 'The company describes itself.',
        checkedOn: today,
      }],
      locations: [{ city: '', province: 'Western Cape', sourceUrl: 'https://province.test/', checkedOn: today }],
    })
    const gate = verificationGate({ organization, hasPlacement: true })
    assert.equal(gate.eligible, true, gate.reasons.join('; '))
    const checks = standardChecks({ organization, hasPlacement: true, footprintEstablished: false, hasRelationship: false, today })
    assert.equal(checks.located, true, 'a sourced province is a located operation')
  })

  it('records a city-only row without inventing the province', async () => {
    const { planImport } = await import('../scripts/organizations-import')
    const { organization: fixture } = await import('./helpers/organizations')
    const organization = fixture({ id: 'org-city-only', name: 'City Only' })
    const plan = planImport(
      [{
        name: 'City Only',
        city: 'Pretoria',
        source_url: 'https://directory.test/members/city-only',
        source_type: 'industry-directory',
        evidence: 'The listing gives Pretoria as the place of business.',
        checked_on: today,
      }],
      'companies',
      { industries: [], capabilities: [], organizations: [organization], relationships: [], associations: [], intelligence: [] },
    )
    const updated = plan.updatedOrganizations.find((entry) => entry.id === 'org-city-only')
    assert.deepEqual(
      updated?.locations.map((location) => ({ city: location.city, province: location.province })),
      [{ city: 'Pretoria', province: '' }],
      'the city is kept and the province stays empty rather than being inferred',
    )
  })

  it('never stores a city as a province on import', async () => {
    const { planImport } = await import('../scripts/organizations-import')
    const { organization: fixture } = await import('./helpers/organizations')
    const organization = fixture({ id: 'org-lcl-like', name: 'LCL Like' })
    const plan = planImport(
      [{
        name: 'LCL Like',
        city: 'Lombardy Estate',
        province: 'Pretoria',
        source_url: 'https://directory.test/members/lcl',
        source_type: 'industry-directory',
        evidence: 'The listing gives Pretoria.',
        checked_on: today,
      }],
      'companies',
      { industries: [], capabilities: [], organizations: [organization], relationships: [], associations: [], intelligence: [] },
    )
    const updated = plan.updatedOrganizations.find((entry) => entry.id === 'org-lcl-like')
    assert.deepEqual(
      updated?.locations.map((location) => ({ city: location.city, province: location.province })),
      [{ city: 'Lombardy Estate', province: '' }],
      'the district stays the city and the province is not filled from it',
    )
  })

  it('rejects a province that is really a city, and warns when a province is missing', async () => {
    const { runQualityChecks, PROVINCES } = await import('../src/data/organizations/quality')
    const { organization: fixture } = await import('./helpers/organizations')
    assert.deepEqual(PROVINCES.length, 9)
    const wrong = fixture({
      id: 'org-pretoria',
      name: 'Pretoria As Province',
      locations: [{ city: 'Lombardy Estate', province: 'Pretoria', sourceUrl: 'https://x.test/', checkedOn: today }],
    })
    const missing = fixture({
      id: 'org-no-province',
      name: 'City Without Province',
      locations: [{ city: 'Cape Town', province: '', sourceUrl: 'https://x.test/', checkedOn: today }],
    })
    const issues = runQualityChecks({
      organizations: [wrong, missing],
      industries: [],
      capabilities: [],
      relationships: [],
      associations: [],
      intelligence: [],
      taxonomyNodeIds: new Set<string>(),
    })
    const wrongIssue = issues.find((issue) => issue.organizationId === 'org-pretoria' && issue.code === 'unsupported-location')
    assert.equal(wrongIssue?.severity, 'warning', 'a city in the province field is reported, not silently accepted')
    const missingIssue = issues.find((issue) => issue.organizationId === 'org-no-province' && issue.code === 'location-province-unknown')
    assert.equal(missingIssue?.severity, 'warning', 'a missing province is a research gap, not a failure')
  })
})

describe('a batch cannot silently request a field that does not exist', () => {
  it('reports an unrecognised header instead of dropping it', async () => {
    const { planImport } = await import('../scripts/organizations-import')
    const { organization: fixture } = await import('./helpers/organizations')
    const organization = fixture({ id: 'org-typo', name: 'Typo Co' })
    const plan = planImport(
      [{
        name: 'Typo Co',
        // what was actually written in a real batch, and silently ignored
        taxonomy_primary_node: 'MFG-METAL-PACK',
        source_url: 'https://typo.test/about',
        source_type: 'company-website',
        evidence: 'The company says what it does.',
        checked_on: '2026-11-04',
      }],
      'companies',
      { industries: [], capabilities: [], organizations: [organization], relationships: [], associations: [], intelligence: [] },
    )
    const issue = plan.issues.find((entry) => entry.field === 'taxonomy_primary_node')
    assert.ok(issue, 'the misspelled field must be reported, not applied and not ignored')
    assert.match(issue!.reason, /unrecognised field/)
    assert.match(issue!.reason, /taxonomyNode/, 'the message names the field that was probably meant')
  })

  it('applies the correctly named field', async () => {
    const { planImport } = await import('../scripts/organizations-import')
    const { organization: fixture } = await import('./helpers/organizations')
    const organization = fixture({ id: 'org-nampak-like', name: 'Nampak Like' })
    const plan = planImport(
      [{
        name: 'Nampak Like',
        taxonomy_node: 'MFG-METAL-PACK',
        source_url: 'https://nampak.test/about',
        source_type: 'company-website',
        evidence: 'It makes metal cans.',
        checked_on: '2026-11-04',
      }],
      'companies',
      { industries: [], capabilities: [], organizations: [organization], relationships: [], associations: [], intelligence: [] },
    )
    assert.deepEqual(plan.issues, [], 'a correct batch produces no issues')
    const updated = plan.updatedOrganizations.find((entry) => entry.id === 'org-nampak-like')
    assert.equal(updated?.taxonomy?.primaryNode, 'MFG-METAL-PACK')
  })
})
