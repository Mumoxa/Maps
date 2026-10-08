// Role contexts: the layer that makes company targeting conditional.
//
// The same company record is reused unchanged; only its relevance to a
// particular assignment moves. Contexts come from three places:
//   - role families (the vocabulary a recruiter picks when there is no assignment yet)
//   - Search Bank assignments (bankSearches), so the bank's own roles drive the vocabulary
//   - custom contexts the recruiter defines in the explorer
//
// Nothing in here is hardcoded to a company: mandatory capabilities, preferred
// industries and exclusions are stated requirements that the discovery engine
// evaluates against evidenced company data.

import { bankSearches } from '../searchBank/bank'
import type { RoleContext } from './types'

export const NO_ROLE_CONTEXT = 'none'

/**
 * No role context: factual relationship exploration only. Nothing is mandatory,
 * so the engine reports similarity without promoting any company to a sourcing tier.
 */
export const FACTUAL_CONTEXT: RoleContext = {
  id: 'role-factual',
  role: 'No role context',
  origin: 'role-family',
  clientId: null,
  clientName: 'No client selected',
  searchId: null,
  mandatoryCapabilities: [],
  preferredIndustries: [],
  acceptableIndustries: [],
  excludedIndustries: [],
  adjacentValueChainStages: [],
  requiredQualifications: [],
  requiredSystems: [],
  provinces: [],
  seniority: '',
  exclusions: [],
  priorities: [],
  brief: 'Factual relationship exploration: which companies share industries, processes, technology or geography, with no recruitment ranking applied.',
}

const ROLE_FAMILIES: Omit<RoleContext, 'clientId' | 'clientName' | 'searchId'>[] = [
  {
    id: 'family-financial-manager',
    role: 'Financial Manager',
    origin: 'role-family',
    mandatoryCapabilities: ['cost-accounting', 'inventory-accounting', 'multi-site-finance'],
    preferredIndustries: [],
    acceptableIndustries: [],
    excludedIndustries: [],
    adjacentValueChainStages: ['Distribution', 'Manufacturing'],
    requiredQualifications: [],
    requiredSystems: [],
    provinces: [],
    seniority: 'Lead / Manager',
    exclusions: [],
    priorities: ['Operational accounting exposure over sector label'],
    brief: 'Hands-on operational finance: cost accounting, stock accounting and finance control across multiple sites.',
  },
  {
    id: 'family-head-of-finance',
    role: 'Head of Finance',
    origin: 'role-family',
    mandatoryCapabilities: ['statutory-audit', 'multi-entity-consolidation', 'tax-compliance'],
    preferredIndustries: [],
    acceptableIndustries: [],
    excludedIndustries: [],
    adjacentValueChainStages: ['Commodity trading', 'Manufacturing', 'Distribution'],
    requiredQualifications: [],
    requiredSystems: [],
    provinces: [],
    seniority: 'Head',
    exclusions: [],
    priorities: ['Group reporting and statutory control'],
    brief: 'Overall financial control, statutory reporting, tax compliance and oversight of a finance function.',
  },
  {
    id: 'family-group-financial-manager',
    role: 'Group Financial Manager',
    origin: 'role-family',
    mandatoryCapabilities: ['multi-entity-consolidation', 'operational-management-reporting'],
    preferredIndustries: [],
    acceptableIndustries: [],
    excludedIndustries: [],
    adjacentValueChainStages: ['Development', 'Investment'],
    requiredQualifications: [],
    requiredSystems: [],
    provinces: [],
    seniority: 'Lead / Manager',
    exclusions: [],
    priorities: ['Consolidation across entities or funds'],
    brief: 'Consolidated reporting across multiple entities, funds or projects.',
  },
  {
    id: 'family-company-secretary',
    role: 'Company Secretary',
    origin: 'role-family',
    mandatoryCapabilities: ['regulatory-reporting'],
    preferredIndustries: [],
    acceptableIndustries: [],
    excludedIndustries: [],
    adjacentValueChainStages: [],
    requiredQualifications: [],
    requiredSystems: [],
    provinces: [],
    seniority: 'Senior',
    exclusions: [],
    priorities: ['Governance and statutory compliance exposure'],
    brief: 'Governance, board support and statutory compliance.',
  },
  {
    id: 'family-project-finance',
    role: 'Project Finance',
    origin: 'role-family',
    mandatoryCapabilities: ['project-finance'],
    preferredIndustries: [],
    acceptableIndustries: [],
    excludedIndustries: [],
    adjacentValueChainStages: ['Development', 'Project delivery'],
    requiredQualifications: [],
    requiredSystems: [],
    provinces: [],
    seniority: 'Senior',
    exclusions: [],
    priorities: ['Lender reporting and financial close experience'],
    brief: 'Project financing, financial close and lender reporting on capital projects.',
  },
  {
    id: 'family-operations-executive',
    role: 'Operations Executive',
    origin: 'role-family',
    mandatoryCapabilities: ['multi-site-operations'],
    preferredIndustries: [],
    acceptableIndustries: [],
    excludedIndustries: [],
    adjacentValueChainStages: ['Distribution', 'Manufacturing', 'Project delivery'],
    requiredQualifications: [],
    requiredSystems: [],
    provinces: [],
    seniority: 'Director',
    exclusions: [],
    priorities: ['Multi-site operating responsibility'],
    brief: 'Operating leadership across sites, plants or a distribution network.',
  },
]

// --- The three live assignments that drive the explorer's default behaviour --

const COLD_STORAGE_CONTEXT: RoleContext = {
  id: 'role-cold-storage-financial-manager',
  role: 'Financial Manager',
  origin: 'search-bank',
  clientId: 'org-ccs-logistics',
  clientName: 'Commercial Cold Storage (Pty) Ltd (CCS Logistics)',
  searchId: 'search-cold-storage-financial-manager',
  mandatoryCapabilities: ['inventory-accounting', 'cost-accounting'],
  preferredIndustries: ['cold-chain', 'refrigerated-distribution', 'food-manufacturing', 'transport-logistics', 'fisheries'],
  acceptableIndustries: ['fmcg-distribution', 'milling-feed', 'construction'],
  excludedIndustries: [],
  adjacentValueChainStages: ['Storage & handling', 'Distribution', 'Manufacturing', 'Retail'],
  requiredQualifications: [],
  requiredSystems: [],
  provinces: [],
  seniority: 'Lead / Manager',
  exclusions: ['Banking and financial services are not excluded, but their operational similarity to a cold store is weak.'],
  priorities: [
    'High-volume operational transactions and stock controls',
    'Multi-site finance and operational management reporting',
    'Working capital and complex supplier/customer transactions',
  ],
  brief: 'Financial Manager for a commercial cold-storage operator: warehousing, inventory, temperature-controlled logistics, cost accounting and multi-site finance.',
}

const PROPERTY_CONTEXT: RoleContext = {
  id: 'role-slm-property-development',
  role: 'Group Financial Manager',
  origin: 'search-bank',
  clientId: 'org-slm-developments',
  clientName: 'SLM Developments (Pty) Ltd',
  searchId: 'search-slm-property-development',
  mandatoryCapabilities: ['development-cost-accounting', 'project-accounting'],
  preferredIndustries: ['property-development', 'property-investment', 'construction', 'renewable-energy'],
  acceptableIndustries: ['transport-logistics', 'agri-commodities'],
  excludedIndustries: [],
  adjacentValueChainStages: ['Development', 'Investment', 'Project delivery'],
  requiredQualifications: [],
  requiredSystems: [],
  provinces: [],
  seniority: 'Lead / Manager',
  exclusions: [],
  priorities: [
    'Development project financing and property holding structures',
    'Project profitability and contractor payment structures',
    'Development pipeline reporting and capital expenditure',
  ],
  brief: 'Group Financial Manager for a property development and project management group with residential fund structures.',
}

const COMMODITY_CONTEXT: RoleContext = {
  id: 'role-bester-head-of-finance',
  role: 'Head of Finance',
  origin: 'search-bank',
  clientId: 'org-bester-feed-grain',
  clientName: 'Bester Feed and Grain (Pty) Ltd',
  searchId: 'search-bester-head-of-finance',
  mandatoryCapabilities: ['commodity-trading'],
  preferredIndustries: ['agri-commodities', 'milling-feed'],
  acceptableIndustries: ['food-manufacturing', 'transport-logistics', 'refrigerated-distribution'],
  excludedIndustries: [],
  adjacentValueChainStages: ['Commodity trading', 'Manufacturing', 'Distribution'],
  requiredQualifications: [],
  requiredSystems: ['trading-platform'],
  provinces: [],
  seniority: 'Head',
  exclusions: ['Employing finance professionals is not sufficient: commodity contract exposure is the differentiator.'],
  priorities: [
    'Grain and agricultural commodity trading exposure',
    'Commodity purchase and sales contracts, price risk and settlement',
    'Stock and inventory valuation across an agricultural supply chain',
  ],
  brief: 'Head of Finance for an agricultural commodity trading business: grain and oilseed trading, contract complexity, tax compliance and financial oversight.',
}

const ASSIGNMENT_CONTEXTS: RoleContext[] = [COLD_STORAGE_CONTEXT, PROPERTY_CONTEXT, COMMODITY_CONTEXT]

/**
 * Contexts offered in the explorer. Assignment contexts come first because they
 * carry a real client and stated priorities; role families follow; Search Bank
 * assignments without a curated context are appended from the bank itself, so
 * the vocabulary is never permanently hardcoded.
 */
export function roleContexts(): RoleContext[] {
  const fromBank: RoleContext[] = bankSearches
    .filter((search) => !ASSIGNMENT_CONTEXTS.some((context) => context.searchId === search.id))
    .map((search) => ({
      id: `search-bank:${search.id}`,
      role: search.role || 'Unspecified role',
      origin: 'search-bank' as const,
      clientId: null,
      clientName: search.client,
      searchId: search.id,
      mandatoryCapabilities: [],
      preferredIndustries: [],
      acceptableIndustries: [],
      excludedIndustries: [],
      adjacentValueChainStages: [],
      requiredQualifications: [],
      requiredSystems: [],
      provinces: [],
      seniority: '',
      exclusions: [],
      priorities: [],
      brief: search.notes,
    }))
  const families: RoleContext[] = ROLE_FAMILIES.map((family) => ({
    ...family,
    clientId: null,
    clientName: 'No client selected',
    searchId: null,
  }))
  return [...ASSIGNMENT_CONTEXTS, ...families, ...fromBank]
}

const CONTEXTS_BY_ID = new Map(roleContexts().map((context) => [context.id, context]))

export function roleContextById(id: string): RoleContext | undefined {
  if (id === FACTUAL_CONTEXT.id || id === NO_ROLE_CONTEXT) return FACTUAL_CONTEXT
  return CONTEXTS_BY_ID.get(id)
}

export function assignmentContexts(): RoleContext[] {
  return ASSIGNMENT_CONTEXTS
}

/** A recruiter-defined context built in the explorer (never persisted as fact). */
export function customRoleContext(input: {
  role: string
  mandatoryCapabilities: string[]
  preferredIndustries: string[]
  acceptableIndustries: string[]
  provinces: string[]
  seniority: string
  exclusions: string[]
  priorities: string[]
}): RoleContext {
  return {
    id: 'role-custom',
    role: input.role || 'Custom role',
    origin: 'custom',
    clientId: null,
    clientName: 'No client selected',
    searchId: null,
    mandatoryCapabilities: input.mandatoryCapabilities,
    preferredIndustries: input.preferredIndustries,
    acceptableIndustries: input.acceptableIndustries,
    excludedIndustries: [],
    adjacentValueChainStages: [],
    requiredQualifications: [],
    requiredSystems: [],
    provinces: input.provinces,
    seniority: input.seniority,
    exclusions: input.exclusions,
    priorities: input.priorities,
    brief: 'Custom recruiter-defined role context.',
  }
}
