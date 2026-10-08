import type { Capability, Industry, RoleContextTemplate } from './types'

export interface Taxonomy {
  industries: Industry[]
  capabilities: Capability[]
  industryById: Map<string, Industry>
  capabilityById: Map<string, Capability>
  /** Sector id for every industry id (a sector maps to itself). */
  sectorOf: Map<string, string>
  industryChildren: Map<string, string[]>
  /** Capability id -> itself plus every ancestor. */
  capabilityLineage: Map<string, string[]>
  /** Capability id -> itself plus every descendant. */
  capabilityDescendants: Map<string, Set<string>>
  /** Undirected value-chain adjacency between industries. */
  valueChain: Map<string, Set<string>>
}

function lineage<T extends { id: string; parentId: string | null }>(byId: Map<string, T>, id: string): string[] {
  const chain: string[] = []
  const seen = new Set<string>()
  let cursor: string | null = id
  while (cursor && !seen.has(cursor)) {
    seen.add(cursor)
    chain.push(cursor)
    cursor = byId.get(cursor)?.parentId ?? null
  }
  return chain
}

export function buildTaxonomy(industries: Industry[], capabilities: Capability[]): Taxonomy {
  const industryById = new Map(industries.map((industry) => [industry.id, industry]))
  const capabilityById = new Map(capabilities.map((capability) => [capability.id, capability]))

  const sectorOf = new Map<string, string>()
  const industryChildren = new Map<string, string[]>()
  for (const industry of industries) {
    const chain = lineage(industryById, industry.id)
    sectorOf.set(industry.id, chain[chain.length - 1])
    if (industry.parentId) {
      const list = industryChildren.get(industry.parentId) ?? []
      list.push(industry.id)
      industryChildren.set(industry.parentId, list)
    }
  }

  const capabilityLineage = new Map<string, string[]>()
  const capabilityDescendants = new Map<string, Set<string>>()
  for (const capability of capabilities) {
    const chain = lineage(capabilityById, capability.id)
    capabilityLineage.set(capability.id, chain)
    for (const ancestor of chain) {
      const set = capabilityDescendants.get(ancestor) ?? new Set<string>()
      set.add(capability.id)
      capabilityDescendants.set(ancestor, set)
    }
  }

  const valueChain = new Map<string, Set<string>>()
  const link = (a: string, b: string) => {
    const set = valueChain.get(a) ?? new Set<string>()
    set.add(b)
    valueChain.set(a, set)
  }
  for (const industry of industries) {
    for (const other of industry.valueChain) {
      if (!industryById.has(other)) continue
      link(industry.id, other)
      link(other, industry.id)
    }
  }

  return {
    industries,
    capabilities,
    industryById,
    capabilityById,
    sectorOf,
    industryChildren,
    capabilityLineage,
    capabilityDescendants,
    valueChain,
  }
}

/** Taxonomy-integrity problems (unknown parents, cycles, dangling references). Empty when valid. */
export function validateTaxonomy(taxonomy: Taxonomy, roleContexts: RoleContextTemplate[] = []): string[] {
  const problems: string[] = []
  const seenIndustry = new Set<string>()
  for (const industry of taxonomy.industries) {
    if (seenIndustry.has(industry.id)) problems.push(`duplicate industry id ${industry.id}`)
    seenIndustry.add(industry.id)
    if (industry.parentId && !taxonomy.industryById.has(industry.parentId)) problems.push(`industry ${industry.id} has unknown parent ${industry.parentId}`)
    for (const other of industry.valueChain) if (!taxonomy.industryById.has(other)) problems.push(`industry ${industry.id} value chain references unknown ${other}`)
    for (const capability of industry.typicalCapabilities) if (!taxonomy.capabilityById.has(capability)) problems.push(`industry ${industry.id} typical capability unknown ${capability}`)
  }
  const seenCapability = new Set<string>()
  for (const capability of taxonomy.capabilities) {
    if (seenCapability.has(capability.id)) problems.push(`duplicate capability id ${capability.id}`)
    seenCapability.add(capability.id)
    if (capability.parentId && !taxonomy.capabilityById.has(capability.parentId)) problems.push(`capability ${capability.id} has unknown parent ${capability.parentId}`)
    const chain = taxonomy.capabilityLineage.get(capability.id) ?? []
    const last = chain[chain.length - 1]
    if (last && taxonomy.capabilityById.get(last)?.parentId) problems.push(`capability ${capability.id} has a cyclic parent chain`)
  }
  for (const context of roleContexts) {
    const caps = [...context.mandatoryCapabilities, ...context.preferredCapabilities]
    for (const id of caps) if (!taxonomy.capabilityById.has(id)) problems.push(`role context ${context.id} references unknown capability ${id}`)
    const industries = [...context.preferredIndustries, ...context.adjacentIndustries, ...context.deprioritisedIndustries]
    for (const id of industries) if (!taxonomy.industryById.has(id)) problems.push(`role context ${context.id} references unknown industry ${id}`)
  }
  return problems
}

/** Expand a set of industry ids to include descendants (selecting a sector selects its subindustries). */
export function expandIndustries(taxonomy: Taxonomy, ids: string[]): Set<string> {
  const out = new Set<string>()
  const stack = [...ids]
  while (stack.length) {
    const id = stack.pop() as string
    if (out.has(id)) continue
    out.add(id)
    for (const child of taxonomy.industryChildren.get(id) ?? []) stack.push(child)
  }
  return out
}

export interface TermIndex {
  industry: Map<string, string>
  capability: Map<string, string>
}

/** Lowercased id, name and synonym -> taxonomy id, for resolving imported or typed vocabulary. */
export function buildTermIndex(taxonomy: Taxonomy): TermIndex {
  const industry = new Map<string, string>()
  const capability = new Map<string, string>()
  for (const row of taxonomy.industries) for (const term of [row.id, row.name, ...row.synonyms]) if (!industry.has(term.toLowerCase())) industry.set(term.toLowerCase(), row.id)
  for (const row of taxonomy.capabilities) for (const term of [row.id, row.name, ...row.synonyms]) if (!capability.has(term.toLowerCase())) capability.set(term.toLowerCase(), row.id)
  return { industry, capability }
}
