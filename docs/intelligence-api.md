# Company intelligence query and export contract (schemaVersion 1)

One contract serves the explorer UI, its CSV/JSON exports, and the command line. Implementation:
`src/data/intelligence/api.ts`. A future backend endpoint should return the same shapes.

## Command line

```bash
npm run intel:query -- --contexts                              # role context templates
npm run intel:query -- --coverage                              # coverage summary
npm run intel:query -- --dossier "Overberg Agri"               # everything known about one company
npm run intel:query -- --focal "Commercial Cold Holdings" --context fm-temperature-controlled
npm run intel:query -- --focal org-bester-feed-grain --context hof-agri-commodity --format csv
npm run intel:query -- --focal "SLM Developments" --context finance-property-development \
  --tiers tier-1,tier-2 --provinces "Western Cape" --page 1 --page-size 50
npm run intel:query -- --context hof-agri-commodity --scope all --mandatory commodity-trading
```

Filters: `--industries`, `--capabilities`, `--tiers`, `--associations`, `--confidence`,
`--provinces` (comma lists; AND across options, OR within one) and `--q` (name search).
Requirement overrides: `--mandatory`, `--preferred`, `--preferred-industries`.
`--scope associated` (default) returns companies associated with the focal company or role
relevant; `--scope all` returns every South African organization.

The CLI reads only the public bundle. Private workspace data never leaves the browser.

## Discover response

```jsonc
{
  "schemaVersion": 1,
  "asOf": "2026-10-08",
  "focal": { "id": "org-commercial-cold-holdings", "name": "Commercial Cold Holdings" } | null,
  "focalQuery": "Commercial Cold Holdings",
  "focalResolved": true,            // false when a focal name matched nothing (results ignore it)
  "requirement": { ... },           // resolved SearchRequirement (template + overrides)
  "scope": "associated",
  "total": 83,                      // after filters
  "universe": 272,
  "page": 1, "pageSize": 100, "pages": 1,   // pageSize is capped at 500; use pages, never assume
  "pockets": [ { "id", "label", "fit", "organizations", "tierCounts", "currentPeople", "withoutPeople", "unassessed" } ],
  "results": [ DiscoverResult ],
  "coverage": { "organizations", "classified", "unclassified", ... },
  "limitations": [ "Coverage is not exhaustive ...", ... ]
}
```

`DiscoverResult`:

| Field | Meaning |
|---|---|
| `organizationId`, `name`, `website`, `identityStatus` | Identity (`verified`, `probable`, `unresolved`) |
| `role` | `focal` or `target` |
| `pocket` | Industry pocket id (`pocket:unclassified` when no sourced industry) |
| `industries[]` | `industryId`, `name`, `role`, `confidence`, `origin` |
| `tier`, `tierLabel`, `computedTier`, `override` | Override carries `tier`, `reason`, `by`, `at`; computed tier is always kept |
| `industryFit` | `preferred`, `adjacent`, `neutral`, `deprioritised`, `unclassified` |
| `knowledge.facts[]` | Sourced association dimensions with confidence |
| `knowledge.inferences[]` | Industry-prior hypotheses (never counted as observed) |
| `knowledge.suggestions[]` | Recruiter observations and previous recruitment |
| `mandatory[]` | Per mandatory capability: `status` (`met`, `hypothesis`, `unknown`, `gap`), `via`, `confidence`, `evidence[]` (id, url, source, published date, `age`: current, stale, undated) |
| `preferredMatched[]` | Preferred capabilities observed |
| `reasons[]`, `gaps[]`, `missingEvidence[]` | Plain-language explanation of the tier |
| `confidence` | Weakest confidence the tier rests on |
| `geography`, `provinces[]` | Geography is reported, never used to rank on its own |
| `people.current`, `people.former` | Public profile counts. Not evidence of anyone's experience |

## Dossier response

`companyDossier(graph, id)`: `organization`, `parents[]`, `industries[]`,
`capabilities.observed[] / notObserved[] / unknownSourced[] / industryHypotheses[]`,
`relationships[]`, `locations[]`, `scaleMetrics[]`, `openQuestions[]`, `coverage[]`, `people`.
Every sourced row includes its `evidence[]`.

## CSV export columns

`organization_id, name, tier, computed_tier, override_reason, pocket, industries, industry_fit,
associations, mandatory_status, reasons, gaps, missing_evidence, confidence, provinces,
current_people, former_people, website, identity_status`. Lists inside a cell are separated by
`; `. One line per result, no truncation.

## Research import format

CSV or JSON rows with columns: `company, website, industry, industry_role, capability,
capability_status, confidence, evidence_url, source_name, source_type, published_on, supports,
province, city, related_company, relationship_type`. `industry` and `capability` accept taxonomy
ids, names or synonyms. A full research batch (schemaVersion 1, as in
`markets/intelligence/research/`) is also accepted.

## Status of a server API

There is no server API today: the site is static. `db/migrations/0001_canonical_intelligence.sql`
is the tested (SQLite) target schema. Any server implementation must keep confidential tables
behind authentication and must not expose them through the public bundle.
