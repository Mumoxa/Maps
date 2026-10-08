// Integrity of the committed public intelligence bundle, the reconciliation
// pipeline, the SQL target schema and the public-bundle guard.

import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { publicBatches, publicGraph, roleContexts, taxonomy } from '../src/data/intelligence/index'
import { validateTaxonomy } from '../src/data/intelligence/taxonomy'
import { validateResearchBatch } from '../src/data/workspace/importer'
import { runQualityChecks, coverageSummary } from '../src/data/intelligence/quality'
import { organizationKey } from '../src/data/intelligence/identity'
import { buildReconciliation } from '../scripts/reconcile-organizations'

const ROOT = join(import.meta.dirname, '..')
const graph = publicGraph()

test('taxonomy and role contexts are internally consistent', () => {
  assert.deepEqual(validateTaxonomy(taxonomy, roleContexts), [])
  assert.ok(roleContexts.some((context) => context.id === 'no-role' || context.mandatoryCapabilities.length === 0))
})

test('every public research batch passes evidence and reference integrity', () => {
  for (const batch of publicBatches) assert.deepEqual(validateResearchBatch(graph, batch), [], batch.batchId)
})

test('every committed research file is registered as a public batch', () => {
  const registered = new Set(publicBatches.map((batch) => batch.batchId))
  const dir = join(ROOT, 'markets', 'intelligence', 'research')
  for (const name of readdirSync(dir).filter((file) => file.endsWith('.json'))) {
    const batch = JSON.parse(readFileSync(join(dir, name), 'utf8')) as { batchId: string }
    assert.ok(registered.has(batch.batchId), name)
  }
})

test('reconciliation is deterministic and committed outputs are current', () => {
  const first = buildReconciliation()
  const second = buildReconciliation()
  for (let index = 0; index < first.files.length; index++) {
    assert.equal(first.files[index].body, second.files[index].body, 'same input gives byte-identical output')
    assert.equal(readFileSync(first.files[index].path, 'utf8'), first.files[index].body, `${first.files[index].path} is up to date`)
  }
  assert.equal(first.report.missingLineage.length, 0)
})

test('organization ids are unique and every legacy record maps to exactly one organization', () => {
  const ids = new Set<string>()
  const refs = new Map<string, string>()
  for (const org of graph.organizations) {
    assert.ok(!ids.has(org.id), `duplicate id ${org.id}`)
    ids.add(org.id)
    for (const lineage of org.lineage) {
      assert.ok(!refs.has(lineage.ref), `${lineage.ref} mapped to ${refs.get(lineage.ref)} and ${org.id}`)
      refs.set(lineage.ref, org.id)
    }
  }
})

test('organization keys normalise legal suffixes without merging distinct names', () => {
  assert.equal(organizationKey('Oceana Group Limited'), organizationKey('Oceana Group Ltd'))
  assert.notEqual(organizationKey('Absa Group'), organizationKey('Absa Consultants and Actuaries'))
})

test('quality checks surface gaps without blocking errors', () => {
  const issues = runQualityChecks(graph)
  assert.equal(issues.filter((issue) => issue.severity === 'error').length, 0)
  const checks = new Set(issues.map((issue) => issue.check))
  for (const check of ['unclassified-organization', 'unresolved-identity', 'stale-evidence', 'conflicting-scale'] as const) assert.ok(checks.has(check), check)
  const coverage = coverageSummary(graph)
  assert.equal(coverage.classified + coverage.unclassified, coverage.organizations)
})

test('public bundle guard: no personal contact details in committed intelligence or search bank files', () => {
  const email = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
  const phone = /(?:\+27|\b0)[\s-]?\d{2}[\s-]?\d{3}[\s-]?\d{4}\b/
  const files: string[] = []
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name)
      if (entry.isDirectory()) walk(path)
      else if (entry.name.endsWith('.json') && !entry.name.startsWith('organizations') && !entry.name.startsWith('reconciliation')) files.push(path)
    }
  }
  walk(join(ROOT, 'markets', 'intelligence'))
  for (const path of files) {
    const text = readFileSync(path, 'utf8')
    assert.ok(!email.test(text), `${path} contains an email`)
    assert.ok(!phone.test(text), `${path} contains a phone number`)
  }
  const bank = JSON.parse(readFileSync(join(ROOT, 'markets', 'search-bank', 'bank.json'), 'utf8')) as { candidates: { email?: string; phone?: string }[] }
  for (const candidate of bank.candidates) assert.ok(!candidate.email && !candidate.phone)
})

test('private routes are disallowed for crawlers', () => {
  const robots = readFileSync(join(ROOT, 'public', 'robots.txt'), 'utf8')
  for (const path of ['/search-bank', '/target-pools', '/intelligence']) assert.ok(robots.includes(`Disallow: ${path}`), path)
})

test('SQL target schema applies on SQLite and accepts the public bundle with referential integrity', () => {
  const db = new DatabaseSync(':memory:')
  db.exec(readFileSync(join(ROOT, 'db', 'migrations', '0001_canonical_intelligence.sql'), 'utf8'))
  db.exec('BEGIN')
  const insertIndustry = db.prepare('INSERT INTO industry (id, name, parent_id) VALUES (?, ?, ?)')
  // Parents first so self-references resolve.
  const pendingIndustries = [...taxonomy.industries]
  const placed = new Set<string>()
  while (pendingIndustries.length) {
    const next = pendingIndustries.findIndex((row) => !row.parentId || placed.has(row.parentId))
    assert.ok(next >= 0, 'industry hierarchy is acyclic')
    const [row] = pendingIndustries.splice(next, 1)
    insertIndustry.run(row.id, row.name, row.parentId)
    placed.add(row.id)
  }
  const insertCapability = db.prepare('INSERT INTO operational_capability (id, name, parent_id, kind) VALUES (?, ?, ?, ?)')
  const pendingCaps = [...taxonomy.capabilities]
  const placedCaps = new Set<string>()
  while (pendingCaps.length) {
    const next = pendingCaps.findIndex((row) => !row.parentId || placedCaps.has(row.parentId))
    assert.ok(next >= 0, 'capability hierarchy is acyclic')
    const [row] = pendingCaps.splice(next, 1)
    insertCapability.run(row.id, row.name, row.parentId, row.kind)
    placedCaps.add(row.id)
  }
  const insertOrg = db.prepare('INSERT INTO organization (id, name, legal_name, website, domain, identity_status, south_african, last_verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
  for (const org of graph.organizations) insertOrg.run(org.id, org.name, org.legalName, org.website, org.domain, org.identityStatus, org.southAfrican ? 1 : 0, org.lastVerified)
  const insertRun = db.prepare('INSERT INTO research_run (id, researched_on, researcher, scope) VALUES (?, ?, ?, ?)')
  const insertEvidence = db.prepare('INSERT OR IGNORE INTO evidence_record (id, research_run_id, url, source_name, source_type, published_on, observed_on, supports) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
  const insertOrgIndustry = db.prepare('INSERT OR IGNORE INTO organization_industry (organization_id, industry_id, role, confidence, origin, research_run_id) VALUES (?, ?, ?, ?, ?, ?)')
  const insertOrgCap = db.prepare('INSERT OR IGNORE INTO organization_capability (organization_id, capability_id, status, confidence, origin, summary, research_run_id) VALUES (?, ?, ?, ?, ?, ?, ?)')
  const insertRel = db.prepare('INSERT OR IGNORE INTO organization_relationship (from_id, to_id, type, confidence, summary, research_run_id) VALUES (?, ?, ?, ?, ?, ?)')
  const insertFact = db.prepare('INSERT OR IGNORE INTO fact_evidence (fact_table, fact_key, evidence_id) VALUES (?, ?, ?)')
  for (const batch of publicBatches) {
    insertRun.run(batch.batchId, batch.researchedOn, batch.researcher, batch.scope)
    for (const row of batch.evidence) insertEvidence.run(row.id, batch.batchId, row.url, row.sourceName, row.sourceType, row.publishedOn, batch.researchedOn, row.supports)
    for (const row of batch.organizationIndustries) {
      insertOrgIndustry.run(row.organizationId, row.industryId, row.role, row.confidence, row.origin, batch.batchId)
      for (const id of row.evidenceIds) insertFact.run('organization_industry', `${row.organizationId}|${row.industryId}|${batch.batchId}`, id)
    }
    for (const row of batch.organizationCapabilities) insertOrgCap.run(row.organizationId, row.capabilityId, row.status, row.confidence, row.origin, row.summary, batch.batchId)
    for (const row of batch.organizationRelationships) insertRel.run(row.fromId, row.toId, row.type, row.confidence, row.summary, batch.batchId)
  }
  db.exec('COMMIT')
  assert.equal((db.prepare('PRAGMA foreign_key_check').all() as unknown[]).length, 0)
  const count = db.prepare('SELECT COUNT(*) AS n FROM organization').get() as { n: number }
  assert.equal(count.n, graph.organizations.length)

  // Confidential-table guards.
  db.exec("INSERT INTO recruitment_search (id, owner, name, status, created_at, updated_at) VALUES ('s1', 'tester', 'Synthetic search', 'open', 'now', 'now')")
  assert.throws(() => db.exec("INSERT INTO tier_override (context_key, organization_id, tier, reason, by_user, at) VALUES ('search:s1', 'org-snolink', 'tier-2', '  ', 'tester', 'now')"))
  assert.throws(() => db.exec("INSERT INTO search_target_company (id, search_id, organization_id, status, added_from, added_at) VALUES ('t1', 's1', 'org-does-not-exist', 'proposed', 'manual', 'now')"))
  db.exec("INSERT INTO person (id, name, dataset) VALUES ('p:a', 'Synthetic Person', 'test'), ('p:b', 'Synthetic Person', 'test')")
  assert.throws(() => db.exec("INSERT INTO person_link (person_id, same_as_id, reviewed_by, reviewed_at, evidence) VALUES ('p:a', 'p:b', 'tester', 'now', '')"), 'people are only linked with reviewed evidence, never by name')
  db.close()
})
