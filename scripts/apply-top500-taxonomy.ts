// Apply the reviewed Top 500 taxonomy additions to the canonical data files.
//
//   node --import tsx scripts/apply-top500-taxonomy.ts [--check]
//
// The additions live in `markets/organizations/imports/top500-companies-2026-10-15/
// taxonomy-additions.json` so they can be reviewed as data before they touch the
// national tree. This script is the only writer: it inserts new nodes next to
// their parent, appends new pockets and industries, and binds every new entry in
// the crosswalk. It is idempotent — running it twice changes nothing — and it
// refuses to overwrite an existing id with different content, because a silent
// redefinition of a national taxonomy node is exactly the kind of drift the
// taxonomy was built to prevent.

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

interface TaxonomyNode {
  id: string
  level: 1 | 2 | 3 | 4
  name: string
  parentId: string | null
  statutorySector?: string
  sics?: string
  valueChainStage?: string
  saContext?: string
  synonyms?: string[]
  informalRelevant?: boolean
}

interface Pocket {
  id: string
  name: string
  valueChainStage: string
  description: string
}

interface Industry {
  id: string
  name: string
  parentId: string | null
  pocket: string
  description: string
  synonyms: string[]
}

interface Crosswalk {
  schemaVersion: string
  purpose: string
  direction: string
  pocketMappings: { pocketId: string; taxonomyNodes: string[]; note: string }[]
  industryMappings: { industryId: string; taxonomyNode: string; note?: string }[]
}

interface Additions {
  schemaVersion: number
  date: string
  source: string
  purpose: string
  nodes: { id: string; level: 2 | 3 | 4; name: string; parentId: string; saContext?: string }[]
  pockets: Pocket[]
  industries: Industry[]
  crosswalk: {
    pocketMappings: { pocketId: string; taxonomyNodes: string[]; note: string }[]
    industryMappings: { industryId: string; taxonomyNode: string; note?: string }[]
  }
}

const TAXONOMY_DIR = resolve('markets/organizations/taxonomy')
const ORG_DIR = resolve('markets/organizations')
const IMPORT_DIR = resolve(ORG_DIR, 'imports/top500-companies-2026-10-15')

const files = {
  tree: resolve(TAXONOMY_DIR, 'sector-tree.json'),
  crosswalk: resolve(TAXONOMY_DIR, 'industry-crosswalk.json'),
  pockets: resolve(ORG_DIR, 'pockets.json'),
  industries: resolve(ORG_DIR, 'industries.json'),
}

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, 'utf8')) as T
}

/**
 * The sector tree is stored one node per line, with `", "` / `": "` separators at
 * every level (the format the existing 731 lines already use). Rendering a node
 * from its own entries keeps that exact shape and key order, so adding a node
 * produces a one-line diff instead of rewriting the whole tree.
 */
function render(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(render).join(', ')}]`
  if (value !== null && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
    return `{${entries.map(([key, entry]) => `${JSON.stringify(key)}: ${render(entry)}`).join(', ')}}`
  }
  return JSON.stringify(value)
}

function writeTree(nodes: TaxonomyNode[]): string {
  return `[\n${nodes.map((node) => `  ${render(node)}`).join(',\n')}\n]\n`
}

function serialise(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`
}

function sameShape(existing: unknown, wanted: unknown): boolean {
  return JSON.stringify(existing) === JSON.stringify(wanted)
}

function main() {
  const check = process.argv.includes('--check')
  const additions = readJson<Additions>(resolve(IMPORT_DIR, 'taxonomy-additions.json'))

  const tree = readJson<TaxonomyNode[]>(files.tree)
  const pockets = readJson<Pocket[]>(files.pockets)
  const industries = readJson<Industry[]>(files.industries)
  const crosswalk = readJson<Crosswalk>(files.crosswalk)

  const treeById = new Map(tree.map((node) => [node.id, node]))
  const pocketIds = new Set(pockets.map((pocket) => pocket.id))
  const industryIds = new Set(industries.map((industry) => industry.id))
  const problems: string[] = []
  const notes: string[] = []

  // --- Nodes ----------------------------------------------------------------
  let nextTree = [...tree]
  for (const addition of additions.nodes) {
    const wanted = {
      id: addition.id,
      level: addition.level,
      name: addition.name,
      parentId: addition.parentId,
      ...(addition.saContext ? { saContext: addition.saContext } : {}),
    } as TaxonomyNode

    const parent = treeById.get(addition.parentId)
    if (!parent) {
      problems.push(`node ${addition.id}: parent ${addition.parentId} does not exist`)
      continue
    }
    if (parent.level + 1 !== addition.level) {
      problems.push(`node ${addition.id}: level ${addition.level} is not one below parent level ${parent.level}`)
      continue
    }
    if (addition.level === 2 && !parent.statutorySector) {
      problems.push(`node ${addition.id}: parent macro-sector has no statutorySector to inherit a Schedule 1 class from`)
      continue
    }

    const existing = treeById.get(addition.id)
    if (existing) {
      if (sameShape(existing, wanted)) {
        notes.push(`node ${addition.id}: already present and unchanged`)
        continue
      }
      problems.push(`node ${addition.id}: already exists with different content; refusing to redefine it`)
      continue
    }

    // Insert directly after the parent's whole subtree so parents always precede
    // their children, which the taxonomy validator enforces.
    let insertAt = nextTree.findIndex((node) => node.id === addition.parentId) + 1
    for (let index = insertAt; index < nextTree.length; index += 1) {
      if (nextTree[index].id.startsWith(`${addition.parentId}-`)) insertAt = index + 1
      else break
    }
    nextTree = [...nextTree.slice(0, insertAt), wanted, ...nextTree.slice(insertAt)]
    treeById.set(wanted.id, wanted)
    notes.push(`node ${addition.id}: inserted after ${nextTree[insertAt - 1].id}`)
  }

  // --- Pockets --------------------------------------------------------------
  const nextPockets = [...pockets]
  for (const addition of additions.pockets) {
    const existing = nextPockets.find((pocket) => pocket.id === addition.id)
    if (existing) {
      if (!sameShape(existing, addition)) problems.push(`pocket ${addition.id}: already exists with different content`)
      else notes.push(`pocket ${addition.id}: already present and unchanged`)
      continue
    }
    nextPockets.push(addition)
    pocketIds.add(addition.id)
    notes.push(`pocket ${addition.id}: added`)
  }

  // --- Industries -----------------------------------------------------------
  const nextIndustries = [...industries]
  for (const addition of additions.industries) {
    const existing = nextIndustries.find((industry) => industry.id === addition.id)
    if (existing) {
      if (!sameShape(existing, addition)) problems.push(`industry ${addition.id}: already exists with different content`)
      else notes.push(`industry ${addition.id}: already present and unchanged`)
      continue
    }
    if (!pocketIds.has(addition.pocket)) {
      problems.push(`industry ${addition.id}: pocket ${addition.pocket} does not exist`)
      continue
    }
    nextIndustries.push(addition)
    industryIds.add(addition.id)
    notes.push(`industry ${addition.id}: added`)
  }

  // --- Crosswalk ------------------------------------------------------------
  const nextCrosswalk: Crosswalk = {
    ...crosswalk,
    pocketMappings: [...crosswalk.pocketMappings],
    industryMappings: [...crosswalk.industryMappings],
  }
  const mappedPockets = new Set(nextCrosswalk.pocketMappings.map((mapping) => mapping.pocketId))
  const mappedIndustries = new Set(nextCrosswalk.industryMappings.map((mapping) => mapping.industryId))

  for (const mapping of additions.crosswalk.pocketMappings) {
    if (mappedPockets.has(mapping.pocketId)) continue
    for (const nodeId of mapping.taxonomyNodes) {
      if (!treeById.has(nodeId)) problems.push(`pocket mapping ${mapping.pocketId}: node ${nodeId} does not exist`)
    }
    nextCrosswalk.pocketMappings.push(mapping)
    mappedPockets.add(mapping.pocketId)
    notes.push(`pocket mapping ${mapping.pocketId}: added`)
  }
  for (const mapping of additions.crosswalk.industryMappings) {
    if (mappedIndustries.has(mapping.industryId)) continue
    if (!treeById.has(mapping.taxonomyNode)) {
      problems.push(`industry mapping ${mapping.industryId}: node ${mapping.taxonomyNode} does not exist`)
      continue
    }
    nextCrosswalk.industryMappings.push(mapping)
    mappedIndustries.add(mapping.industryId)
    notes.push(`industry mapping ${mapping.industryId}: added`)
  }

  // Every industry and pocket in the model must be mapped, or the validator fails
  // the build; report it here instead, with the offending ids.
  for (const industry of nextIndustries) {
    if (!mappedIndustries.has(industry.id)) problems.push(`industry ${industry.id} has no crosswalk mapping`)
  }
  for (const pocket of nextPockets) {
    if (!mappedPockets.has(pocket.id)) problems.push(`pocket ${pocket.id} has no crosswalk mapping`)
  }

  const outputs: [string, string][] = [
    [files.tree, writeTree(nextTree)],
    [files.pockets, serialise(nextPockets)],
    [files.industries, serialise(nextIndustries)],
    [files.crosswalk, serialise(nextCrosswalk)],
  ]

  const changed = outputs.filter(([path, text]) => readFileSync(path, 'utf8') !== text)
  process.stdout.write(`${JSON.stringify({
    mode: check ? 'check' : 'apply',
    added: additions.nodes.length + additions.pockets.length + additions.industries.length,
    changedFiles: changed.map(([path]) => path.replace(`${resolve('.')}/`, '')),
    taxonomyNodes: nextTree.length,
    industries: nextIndustries.length,
    pockets: nextPockets.length,
    problems,
    noteCount: notes.length,
  }, null, 2)}\n`)

  if (problems.length > 0) {
    process.stderr.write(`${problems.length} problem(s); nothing written.\n`)
    process.exitCode = 1
    return
  }
  if (check) return
  for (const [path, text] of outputs) writeFileSync(path, text, 'utf8')
}

main()
