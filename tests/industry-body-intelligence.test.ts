import test from 'node:test'
import assert from 'node:assert/strict'
import { industryBodies, companyBodyLinks, bodyDirectoryLeads, bodyResearchCoverage } from '../src/data/organizations/industryBodies'
import { validateIndustryBodyIntelligence } from '../src/data/organizations/industryBodiesQuality'
import { organizations, industries } from '../src/data/organizations/load'
import { talentTracks } from '../src/data/tracks'
import { getTaxonomyNodeIds } from '../src/data/taxonomy/load'
import { readFileSync } from 'node:fs'

const fixture = () => ({
  bodies: industryBodies,
  links: companyBodyLinks,
  leads: bodyDirectoryLeads,
  coverage: bodyResearchCoverage,
  organizationIds: new Set(organizations.map((org) => org.id)),
  industryIds: new Set(industries.map((industry) => industry.id)),
  taxonomyNodeIds: new Set(getTaxonomyNodeIds()),
  trackSlugs: new Set(talentTracks.map((track) => track.slug)),
})

test('industry-body records are evidence-backed with explicit research gaps', () => {
  assert.deepEqual(validateIndustryBodyIntelligence(fixture()), [])
  assert.equal(industryBodies.some((body) => body.id === 'body-aspasa'), true)
  assert.equal(bodyDirectoryLeads.every((lead) => lead.status !== 'confirmed'), true)
})

test('adding a new market without association-first coverage fails the gate', () => {
  const input = fixture()
  input.trackSlugs.add('new-specialist-track')
  assert.match(validateIndustryBodyIntelligence(input).join(' '), /new-specialist-track.*missing mandatory/)
})

test('unverified association names cannot be promoted to canonical membership without evidence', () => {
  const input = fixture()
  input.links = [{
    id: 'link-false', bodyId: 'body-aspasa', organizationId: 'org-unknown',
    relationship: 'member', memberCategory: 'producer', status: 'confirmed',
    evidenceUrl: '', evidence: '', checkedOn: '', entityScope: '',
  }]
  assert.ok(validateIndustryBodyIntelligence(input).length >= 2)
})

test('duplicate directory names are rejected within one body', () => {
  const input = fixture()
  input.leads = [...input.leads, { ...input.leads[0], id: 'lead-duplicate' }]
  assert.match(validateIndustryBodyIntelligence(input).join(' '), /duplicate directory name/)
})

test('national taxonomy anchors are validated before association links are accepted', () => {
  const input = fixture()
  input.bodies = [{ ...input.bodies[0], taxonomyNodeIds: ['MIN-NONEXISTENT'] }]
  assert.match(validateIndustryBodyIntelligence(input).join(' '), /unknown national taxonomy node/)
})

test('agent entry points include the mandatory association-first preflight', () => {
  const entries = [
    'AGENTS.md', 'CLAUDE.md', '.github/copilot-instructions.md',
    '.claude/agents/TEAM.md', '.claude/skills/repo-guardrails/SKILL.md',
    'docs/adding-to-the-talent-map.md',
  ]
  for (const path of entries) {
    assert.match(readFileSync(path, 'utf8'), /industry-body-intelligence\.md/, path)
  }
})
