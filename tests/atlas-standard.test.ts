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
