// Machine-readable query interface over the public company-intelligence graph.
// Same contract as the explorer UI (src/data/intelligence/api.ts, schemaVersion 1).
//
//   npm run intel:query -- --focal "Commercial Cold Holdings" --context fm-temperature-controlled
//   npm run intel:query -- --focal org-bester-feed-grain --context hof-agri-commodity --format csv
//   npm run intel:query -- --focal "SLM Developments" --context finance-property-development --tiers tier-1,tier-2
//   npm run intel:query -- --dossier org-overberg-agri
//   npm run intel:query -- --coverage
//   npm run intel:query -- --contexts
//
// Options:
//   --focal <id|name>        focal organization (optional)
//   --context <id>           role context id (omit for no role)
//   --scope associated|all   default associated
//   --industries a,b  --capabilities a,b  --tiers a,b  --associations a,b
//   --confidence a,b  --provinces a,b  --q text   filters (AND across, OR within)
//   --mandatory a,b  --preferred a,b  --preferred-industries a,b   requirement overrides
//   --page N --page-size N   pagination (page size capped at 500; no hidden top-N)
//   --format json|csv        default json
//
// Only public, non-confidential data is queried. Private workspace data lives
// in the recruiter's browser and is never available to this CLI.

import { companyDossier, discoverTargets, resolveRequirement, rowsToCsv } from '../src/data/intelligence/api'
import { applyFilters, discover, EMPTY_FILTERS, type ExplorerFilters } from '../src/data/intelligence/discovery'
import { publicGraph, roleContextById, roleContexts } from '../src/data/intelligence/index'
import { coverageSummary } from '../src/data/intelligence/quality'
import { findOrganization } from '../src/data/intelligence/graph'
import type { SearchRequirement } from '../src/data/intelligence/types'

function parseArgs(argv: string[]): Map<string, string> {
  const args = new Map<string, string>()
  for (let index = 0; index < argv.length; index++) {
    const token = argv[index]
    if (!token.startsWith('--')) continue
    const key = token.slice(2)
    const next = argv[index + 1]
    if (next === undefined || next.startsWith('--')) args.set(key, 'true')
    else {
      args.set(key, next)
      index++
    }
  }
  return args
}

const list = (value: string | undefined): string[] => (value ? value.split(',').map((part) => part.trim()).filter(Boolean) : [])

function write(value: unknown) {
  process.stdout.write(`${typeof value === 'string' ? value : JSON.stringify(value, null, 2)}\n`)
}

const args = parseArgs(process.argv.slice(2))
const graph = publicGraph()

if (args.has('contexts')) {
  write({ schemaVersion: 1, roleContexts })
} else if (args.has('coverage')) {
  write({ schemaVersion: 1, asOf: graph.asOf, coverage: coverageSummary(graph) })
} else if (args.has('dossier')) {
  const raw = args.get('dossier') ?? ''
  const id = graph.organizationById.has(raw) ? raw : findOrganization(graph, raw)
  const dossier = id ? companyDossier(graph, id) : null
  if (!dossier) {
    process.stderr.write(`No organization matches "${raw}"\n`)
    process.exit(1)
  }
  write(dossier)
} else {
  const contextId = args.get('context') ?? null
  if (contextId && !roleContextById.has(contextId)) {
    process.stderr.write(`Unknown role context "${contextId}". Run with --contexts to list them.\n`)
    process.exit(1)
  }
  const patch: Partial<SearchRequirement> = {}
  if (args.has('mandatory')) patch.mandatoryCapabilities = list(args.get('mandatory'))
  if (args.has('preferred')) patch.preferredCapabilities = list(args.get('preferred'))
  if (args.has('preferred-industries')) patch.preferredIndustries = list(args.get('preferred-industries'))
  const filters: Partial<ExplorerFilters> = {
    industries: list(args.get('industries')),
    capabilities: list(args.get('capabilities')),
    tiers: list(args.get('tiers')) as ExplorerFilters['tiers'],
    associations: list(args.get('associations')) as ExplorerFilters['associations'],
    confidence: list(args.get('confidence')) as ExplorerFilters['confidence'],
    provinces: list(args.get('provinces')),
    q: args.get('q') ?? '',
  }
  const scope = args.get('scope') === 'all' ? 'all' : 'associated'
  const focal = args.get('focal') ?? null
  if (args.get('format') === 'csv') {
    const focalId = focal ? (graph.organizationById.has(focal) ? focal : findOrganization(graph, focal)) : null
    const requirement = resolveRequirement(roleContextById, contextId, patch)
    const rows = applyFilters(graph, discover(graph, { focalId, requirement, scope }).rows, { ...EMPTY_FILTERS, ...filters })
    write(rowsToCsv(graph, rows).trimEnd())
  } else {
    const result = discoverTargets(graph, roleContextById, {
      focal,
      roleContextId: contextId,
      requirement: patch,
      filters,
      scope,
      page: Number(args.get('page') ?? 1),
      pageSize: Number(args.get('page-size') ?? 100),
    })
    if (focal && !result.focalResolved) process.stderr.write(`Warning: focal "${focal}" did not match any organization; results ignore it.\n`)
    write(result)
  }
}
