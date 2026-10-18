// The structured import pipeline: match → review → commit → audit.
//
// The importer is the only write path into the canonical model, so the review
// stage has to be trustworthy: nothing may be created silently, a taxonomy id
// that does not exist must be rejected rather than invented, and importing the
// same batch twice must produce the same dataset. These tests exercise the pure
// planning functions; the CLI's file writing is covered by running
// `npm run organizations:import` against a scratch copy of the data directory.

import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  applyPlan,
  detectType,
  mapFields,
  planImport,
  planSummary,
  readDrop,
  type Dataset,
} from '../scripts/organizations-import'
import {
  TODAY,
  association,
  capability,
  capabilityLink,
  industry,
  industryLink,
  intelligence,
  organization,
  relationship,
} from './helpers/organizations'

const INDUSTRIES = [
  industry({ id: 'cold-storage-operations', name: 'Commercial cold storage', synonyms: ['cold storage'] }),
  industry({ id: 'refrigerated-transport', name: 'Temperature-controlled distribution' }),
]
const CAPABILITIES = [
  capability({ id: 'cold-storage-operations', name: 'Cold storage operations' }),
  capability({ id: 'wms', name: 'Warehouse management system' }),
]

function dataset(overrides: Partial<Dataset> = {}): Dataset {
  return {
    industries: INDUSTRIES,
    capabilities: CAPABILITIES,
    organizations: [
      organization({
        id: 'org-ccs',
        name: 'CCS Logistics',
        legalName: 'Commercial Cold Storage (Pty) Ltd',
        aliases: ['Commercial Cold Storage'],
        industries: [industryLink({ industryId: 'cold-storage-operations' })],
        capabilities: [
          capabilityLink({ capabilityId: 'cold-storage-operations' }),
          capabilityLink({ capabilityId: 'wms', status: 'unknown', evidence: '', confidence: 'unknown', sourceUrl: '' }),
        ],
      }),
      organization({ id: 'org-cch', name: 'Commercial Cold Holdings' }),
    ],
    relationships: [],
    associations: [],
    intelligence: [],
    ...overrides,
  }
}

const COMPANIES_CSV = [
  'Company,Legal Name,Aliases,Website,Industry,Sub industry,Primary,Province,City,Employees,Parent,Source URL,Evidence,Checked on,Confidence',
  'CCS Logistics,Commercial Cold Storage (Pty) Ltd,CCS,https://ccslogistics.co.za,cold-storage-operations,refrigerated-transport,primary,Western Cape,Paarden Eiland,120,Commercial Cold Holdings,https://ccslogistics.co.za/home,Operates commercial cold storage,2026-10-08,confirmed',
].join('\n')

describe('import field mapping and type detection', () => {
  it('maps spreadsheet header spellings onto canonical fields', () => {
    const mapped = mapFields({
      'Company Name': 'CCS Logistics',
      'Registered Name': 'Commercial Cold Storage (Pty) Ltd',
      'Headcount': '120',
      'Evidence URL': 'https://ccslogistics.co.za/home',
      'Date Verified': '2026-10-08',
      'Unknown Column': 'kept under its normalised name',
    })

    assert.equal(mapped.name, 'CCS Logistics')
    assert.equal(mapped.legalName, 'Commercial Cold Storage (Pty) Ltd')
    assert.equal(mapped.employees, '120')
    assert.equal(mapped.sourceUrl, 'https://ccslogistics.co.za/home')
    assert.equal(mapped.checkedOn, '2026-10-08')
    assert.equal(mapped.unknown_column, 'kept under its normalised name')
  })

  it('reads csv, json and jsonl drops', () => {
    assert.equal(readDrop(COMPANIES_CSV).format, 'csv')
    assert.equal(readDrop('[{"company":"CCS Logistics"}]').format, 'json')
    assert.equal(readDrop('{"company":"CCS Logistics"}\n{"company":"Other"}').format, 'jsonl')
    assert.equal(readDrop('{"company":"CCS Logistics"}\n{"company":"Other"}').rows.length, 2)
  })

  it('detects the target table, and never mistakes a relationship file for associations', () => {
    const headers = (keys: string[]) => [{ ...Object.fromEntries(keys.map((key) => [key, 'x'])) }]

    assert.equal(detectType(headers(['company', 'website', 'employees'])), 'companies')
    assert.equal(detectType(headers(['From Company', 'To Company', 'Relationship Type'])), 'relationships')
    assert.equal(detectType(headers(['company', 'to', 'relationship_type', 'narrative'])), 'associations')
    assert.equal(detectType(headers(['company', 'capability', 'status'])), 'capabilities')
    assert.equal(detectType(headers(['company', 'observation', 'reviewer'])), 'intelligence')
    assert.equal(detectType(headers(['industry', 'sub_industry'])), 'industries')
  })
})

describe('import review stage', () => {
  it('matches an existing company by legal name instead of creating a second record', () => {
    const { rows } = readDrop(COMPANIES_CSV)
    const plan = planImport(rows, 'companies', dataset())
    const summary = planSummary(plan)

    assert.equal(summary.newOrganizations, 0, 'no duplicate company is created')
    assert.equal(summary.updatedOrganizations, 1)
    assert.equal(summary.matchedRows, 1)
    assert.deepEqual(summary.unmatchedNames, [])
    assert.equal(plan.updatedOrganizations[0].id, 'org-ccs')
    assert.ok(plan.updatedOrganizations[0].aliases.includes('CCS'))
  })

  it('reports an unknown company name rather than inventing a record for it', () => {
    const plan = planImport([{ company: 'Company Nobody Has Heard Of' }], 'capabilities', dataset())
    const summary = planSummary(plan)

    assert.deepEqual(summary.unmatchedNames, ['Company Nobody Has Heard Of'])
    assert.equal(summary.newOrganizations, 0)
    assert.equal(summary.updatedOrganizations, 0)
  })

  it('rejects a capability or industry id that the taxonomy does not contain', () => {
    const plan = planImport([
      { company: 'CCS Logistics', capability: 'Telepathic Inventory', status: 'observed' },
      { company: 'CCS Logistics', industry: 'Underwater Basket Weaving' },
    ], 'capabilities', dataset())

    assert.equal(plan.issues.length, 1)
    assert.match(plan.issues[0].reason, /unknown capability/)
    assert.equal(plan.updatedOrganizations.length, 0, 'nothing is written for a rejected row')
  })

  it('surfaces a status change as a conflict for the reviewer', () => {
    const plan = planImport([
      { company: 'CCS Logistics', capability: 'wms', status: 'observed', evidence: 'WMS in use', source_url: 'https://ccslogistics.co.za/home' },
    ], 'capabilities', dataset())

    assert.equal(plan.conflicts.length, 1)
    assert.match(plan.conflicts[0], /changes from unknown to observed/)
    assert.equal(plan.updatedOrganizations.length, 1, 'the reviewer decides; the plan still carries the row')
  })

  it('counts an existing relationship instead of duplicating it', () => {
    const withRelationship = dataset({
      relationships: [relationship({ id: 'rel-1', type: 'parent-of', fromId: 'org-cch', toId: 'org-ccs' })],
    })
    const rows = [{ from: 'Commercial Cold Holdings', to: 'CCS Logistics', type: 'parent-of' }]

    assert.equal(planSummary(planImport(rows, 'relationships', withRelationship)).existingRelationships, 1)
    assert.equal(planSummary(planImport(rows, 'relationships', dataset())).newRelationships, 1)
  })

  it('flags a row with no company name as missing a required value', () => {
    const plan = planImport([{ capability: 'wms', status: 'observed' }], 'capabilities', dataset())
    assert.equal(plan.missingRequired.length, 1)
    assert.equal(plan.missingRequired[0].field, 'name')
  })

  it('creates a new company as needs-verification, never as verified', () => {
    const plan = planImport([{
      company: 'Hestony Transport',
      province: 'Free State',
      city: 'Bloemfontein',
      source_url: 'https://example.test/hestony',
      evidence: 'Reefer fleet operator.',
      checked_on: TODAY,
    }], 'companies', dataset())

    assert.equal(plan.newOrganizations.length, 1)
    assert.equal(plan.newOrganizations[0].status, 'needs-verification')
    assert.equal(plan.newOrganizations[0].name, 'Hestony Transport')
  })
})

describe('import commit stage', () => {
  it('is idempotent: applying the same plan twice yields the same dataset', () => {
    const base = dataset()
    const { rows } = readDrop(COMPANIES_CSV)
    const plan = planImport(rows, 'companies', base)

    const once = applyPlan(base, plan)
    const twice = applyPlan(once, planImport(rows, 'companies', once))

    assert.deepEqual(JSON.stringify(twice.organizations), JSON.stringify(once.organizations))
    assert.equal(twice.organizations.length, once.organizations.length)
    assert.deepEqual(twice.relationships, once.relationships)
  })

  it('keeps existing records that the batch does not mention', () => {
    const base = dataset()
    const { rows } = readDrop(COMPANIES_CSV)
    const next = applyPlan(base, planImport(rows, 'companies', base))

    assert.equal(next.organizations.length, 2, 'the untouched company is still there')
    assert.ok(next.organizations.some((entry) => entry.id === 'org-cch'))
  })

  it('appends associations and intelligence without touching companies', () => {
    const base = dataset()
    const next = applyPlan(base, planImport([{
      company: 'CCS Logistics',
      to: 'Commercial Cold Holdings',
      relationship_type: 'corporate-affiliation',
      narrative: 'Same group, shared finance processes.',
      shared_processes: 'cold-storage-operations',
      reviewer: 'Test reviewer',
    }], 'associations', base))

    assert.equal(next.associations.length, 1)
    assert.equal(next.associations[0].status, 'curated')
    assert.equal(next.organizations.length, base.organizations.length)

    const withIntelligence = applyPlan(base, planImport([{
      company: 'CCS Logistics',
      kind: 'strong-source',
      observation: 'Finance team is a strong source for cold-chain roles.',
      reviewer: 'Test reviewer',
    }], 'intelligence', base))
    assert.equal(withIntelligence.intelligence.length, 1)
    assert.equal(withIntelligence.intelligence[0].reviewer, 'Test reviewer')
  })

  it('summarises a plan in the shape the audit record stores', () => {
    const { rows } = readDrop(COMPANIES_CSV)
    const summary = planSummary(planImport(rows, 'companies', dataset()))

    for (const key of ['type', 'read', 'newOrganizations', 'updatedOrganizations', 'newRelationships',
      'newAssociations', 'newIntelligence', 'existingRelationships', 'matchedRows', 'unmatchedNames',
      'duplicates', 'conflicts', 'missingRequired', 'issues']) {
      assert.ok(key in summary, `audit summary is missing "${key}"`)
    }
  })

  it('keeps a curated association and a recruiter observation separate tables', () => {
    const base = dataset({
      associations: [association({ id: 'assoc-1', focalId: 'org-ccs', associatedId: 'org-cch' })],
      intelligence: [intelligence({ id: 'ri-1', organizationId: 'org-ccs' })],
    })
    const next = applyPlan(base, planImport(readDrop(COMPANIES_CSV).rows, 'companies', base))

    assert.equal(next.associations.length, 1)
    assert.equal(next.intelligence.length, 1)
    assert.notEqual(next.associations[0].id, next.intelligence[0].id)
  })
})
