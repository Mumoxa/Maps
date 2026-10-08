// Public (non-confidential) intelligence bundle: taxonomy, organization
// registry and committed research batches. Private workspace facts are layered
// on top at runtime by the workspace store and never imported here.

import industriesFile from '../../../markets/intelligence/taxonomy/industries.json'
import capabilitiesFile from '../../../markets/intelligence/taxonomy/capabilities.json'
import roleContextsFile from '../../../markets/intelligence/taxonomy/role-contexts.json'
import registryFile from '../../../markets/intelligence/organizations.json'
import legacyBatch from '../../../markets/intelligence/research/legacy-reconciliation.generated.json'
import scenarioBatch from '../../../markets/intelligence/research/2026-10-08-scenario-research.json'
import profilesRaw from '../../../profiles.json'
import { accountantCandidates } from '../accountantsPeople'
import { buildGraph, type IntelligenceGraph } from './graph'
import type { CreditRiskPersonInput } from './people'
import { buildTaxonomy } from './taxonomy'
import type { Capability, Industry, OrganizationRegistryFile, ResearchBatch, RoleContextTemplate } from './types'

/** Date the committed data was last reconciled; used for staleness. */
export const INTELLIGENCE_AS_OF = '2026-10-08'

export const taxonomy = buildTaxonomy(
  (industriesFile as { industries: Industry[] }).industries,
  (capabilitiesFile as { capabilities: Capability[] }).capabilities,
)

export const roleContexts = (roleContextsFile as { roleContexts: RoleContextTemplate[] }).roleContexts
export const roleContextById = new Map(roleContexts.map((context) => [context.id, context]))

export const publicBatches: ResearchBatch[] = [legacyBatch as ResearchBatch, scenarioBatch as ResearchBatch]
export const organizationRegistry = (registryFile as OrganizationRegistryFile).organizations

export function buildIntelligenceGraph(extraBatches: ResearchBatch[] = [], privateBatchIds = new Set<string>()): IntelligenceGraph {
  return buildGraph({
    taxonomy,
    organizations: organizationRegistry,
    batches: [...publicBatches, ...extraBatches],
    privateBatchIds,
    accountantPeople: accountantCandidates,
    creditRiskPeople: profilesRaw as CreditRiskPersonInput[],
    asOf: INTELLIGENCE_AS_OF,
  })
}

let cached: IntelligenceGraph | null = null

/** The public graph, built once. */
export function publicGraph(): IntelligenceGraph {
  if (!cached) cached = buildIntelligenceGraph()
  return cached
}
