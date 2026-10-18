// Fixtures for the company-intelligence tests.
//
// Every fixture spells out the whole contract: the canonical types have no
// optional fields, so a partial object would be a lie about what the model
// stores. These are deliberately *labelled test companies* — they are not
// claimed to exist, and nothing in the shipped dataset depends on them.

import type {
  Capability,
  EvidenceRecord,
  CompanyAssociation,
  Industry,
  IndustryPocket,
  Organization,
  OrganizationCapabilityLink,
  OrganizationIndustryLink,
  OrganizationRelationship,
  RecruiterIntelligence,
} from '../../src/data/organizations/types'

export const TODAY = '2026-10-08'

export function industry(overrides: Partial<Industry> & Pick<Industry, 'id' | 'name'>): Industry {
  return {
    parentId: null,
    pocket: 'test-pocket',
    description: '',
    synonyms: [],
    ...overrides,
  }
}

export function capability(overrides: Partial<Capability> & Pick<Capability, 'id' | 'name'>): Capability {
  return {
    group: 'operating',
    parentId: null,
    synonyms: [],
    description: '',
    ...overrides,
  }
}

export function industryLink(overrides: Partial<OrganizationIndustryLink> & Pick<OrganizationIndustryLink, 'industryId'>): OrganizationIndustryLink {
  return {
    primary: true,
    confidence: 'confirmed',
    evidence: 'Test fixture evidence.',
    sourceUrl: 'https://example.test/evidence',
    checkedOn: TODAY,
    ...overrides,
  }
}

export function capabilityLink(
  overrides: Partial<OrganizationCapabilityLink> & Pick<OrganizationCapabilityLink, 'capabilityId'>,
): OrganizationCapabilityLink {
  return {
    status: 'observed',
    confidence: 'confirmed',
    evidence: 'Test fixture evidence.',
    sourceUrl: 'https://example.test/evidence',
    checkedOn: TODAY,
    ...overrides,
  }
}

/** A default source record, so a fixture is not "verified" with nothing behind it. */
export function evidence(overrides: Partial<EvidenceRecord> = {}): EvidenceRecord {
  return {
    url: 'https://example.test/evidence',
    type: 'company-website',
    evidence: 'Test fixture evidence.',
    checkedOn: TODAY,
    reviewer: 'Test reviewer',
    confidence: 'confirmed',
    ...overrides,
  }
}

export function organization(overrides: Partial<Organization> & Pick<Organization, 'id' | 'name'>): Organization {
  return {
    legalName: '',
    aliases: [],
    website: '',
    status: 'verified',
    industries: [],
    capabilities: [],
    locations: [],
    scale: [],
    parentId: null,
    sources: [evidence()],
    datasets: ['test'],
    lastVerified: TODAY,
    notes: '',
    ...overrides,
  }
}

export function relationship(overrides: Partial<OrganizationRelationship> & Pick<OrganizationRelationship, 'id' | 'type' | 'fromId' | 'toId'>): OrganizationRelationship {
  return {
    evidence: 'Test fixture evidence.',
    sourceUrl: 'https://example.test/evidence',
    confidence: 'confirmed',
    checkedOn: TODAY,
    note: '',
    ...overrides,
  }
}

export function association(overrides: Partial<CompanyAssociation> & Pick<CompanyAssociation, 'id' | 'focalId' | 'associatedId'>): CompanyAssociation {
  return {
    relationshipType: 'shared-operating-process',
    sharedProcesses: [],
    sharedIndustries: [],
    valueChainOverlap: '',
    narrative: 'Test fixture narrative.',
    evidence: 'Test fixture evidence.',
    sourceUrl: 'https://example.test/evidence',
    confidence: 'probable',
    status: 'curated',
    reviewer: 'Test reviewer',
    checkedOn: TODAY,
    ...overrides,
  }
}

export function intelligence(overrides: Partial<RecruiterIntelligence> & Pick<RecruiterIntelligence, 'id' | 'organizationId'>): RecruiterIntelligence {
  return {
    kind: 'strong-source',
    scope: '',
    observation: 'Test fixture observation.',
    confidence: 'probable',
    source: 'Test reviewer',
    reviewer: 'Test reviewer',
    recordedOn: TODAY,
    ...overrides,
  }
}

export const pocket: IndustryPocket = {
  id: 'test-pocket',
  name: 'Test pocket',
  valueChainStage: 'distribution',
  description: 'Fixture pocket.',
}

/** A two-company fixture with one confirmed shared capability and one unknown. */
export function pairFixture() {
  const industries = [
    industry({ id: 'cold-storage-operations', name: 'Commercial cold storage', pocket: 'test-pocket' }),
    industry({ id: 'refrigerated-transport', name: 'Temperature-controlled distribution', pocket: 'test-pocket' }),
  ]
  const capabilities = [
    capability({ id: 'cold-storage-operations', name: 'Cold storage operations' }),
    capability({ id: 'commodity-trading', name: 'Commodity trading' }),
  ]
  const organizations = [
    organization({
      id: 'org-left',
      name: 'Left Cold Storage',
      legalName: 'Left Cold Storage (Pty) Ltd',
      industries: [industryLink({ industryId: 'cold-storage-operations' })],
      capabilities: [
        capabilityLink({ capabilityId: 'cold-storage-operations' }),
        capabilityLink({ capabilityId: 'commodity-trading', status: 'unknown', evidence: '', confidence: 'unknown', sourceUrl: '' }),
      ],
      locations: [{ city: 'Cape Town', province: 'Western Cape', sourceUrl: 'https://example.test/evidence', checkedOn: TODAY }],
    }),
    organization({
      id: 'org-right',
      name: 'Right Refrigerated',
      industries: [industryLink({ industryId: 'refrigerated-transport' })],
      capabilities: [capabilityLink({ capabilityId: 'cold-storage-operations' })],
      locations: [{ city: 'Durban', province: 'KwaZulu-Natal', sourceUrl: 'https://example.test/evidence', checkedOn: TODAY }],
    }),
  ]
  return {
    industries,
    capabilities,
    organizations,
    relationships: [] as OrganizationRelationship[],
    associations: [] as CompanyAssociation[],
    intelligence: [] as RecruiterIntelligence[],
    pockets: [pocket],
  }
}
