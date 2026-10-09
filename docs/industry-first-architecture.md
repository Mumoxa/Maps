# Industry-first company intelligence — architecture

Date: 9 October 2026. Branch: `arena/378e45e7-maps`.

This document records two things: the audit that found Maps was a company-centric recruitment
mind map, and the architecture that replaced it. Every claim below was checked against the source
at the time of writing; where a number is quoted it came from running the command named beside it.

---

## Part A — Architecture audit

Ten findings, all confirmed true in the source before any code was written.

| # | Finding | Severity | Where it lived |
| --- | --- | --- | --- |
| 1 | `/company-associations` with no parameters defaulted `focalId` to `'org-ccs-logistics'` | Critical | `src/pages/CompanyAssociationsPage.tsx` |
| 2 | The role context defaulted to `'role-cold-storage-financial-manager'`, whose `clientId` is `org-ccs-logistics` | Critical | `src/data/organizations/roleContexts.ts`, `CompanyAssociationsPage.tsx` |
| 3 | `view` defaulted to `'network'`, so the first thing rendered was a radial graph around one company | Critical | `CompanyAssociationsPage.tsx` |
| 4 | The graph is focal-rooted by construction (`NODE_BUDGET_DEFAULT = 60`) | High | `src/components/associations/AssociationGraph.tsx` |
| 5 | `discoverAssociations()` requires `focalId`; every rule is a comparison against it | High | `src/data/organizations/discovery.ts` |
| 6 | `/companies` and `/companies/:slug` rendered the credit-risk dataset only, not the company universe | High | `CompanyDirectory.tsx`, `CompanyPage.tsx` |
| 7 | Recruitment relevance tiers appeared in factual company summaries and as a filter dimension | Medium | `CompanyInspector.tsx`, `ExplorerFilters.tsx` |
| 8 | `FILTER_KEYS` omitted `macroSectors`, so a macro-sector selection vanished on a URL round trip | Medium | `src/data/organizations/types.ts` |
| 9 | `TargetPool.definition` required a `focalId`, so no pool could be defined by industry alone | Medium | `types.ts`, `workspace.ts` |
| 10 | An employer present only in a dataset resolved to `unclassified`, with no route to the canonical record | Medium | `src/data/organizations/load.ts` |

Three structural consequences followed from (1)–(5):

- **A global focal company existed.** Every visitor, including one with no interest in cold
  storage, was shown the universe as seen from CCS Logistics.
- **A client assignment controlled the initial universe.** The app opened in a recruitment state
  it had not been asked to open in.
- **The industry taxonomy was subordinate to one company.** Industry structure was only ever
  visible as "industries adjacent to CCS".

Finding (10) had a second effect: dataset-only employers — the majority of the register — were
reachable but unclassified, with no explicit place for them in the product.

### What was deliberately not changed

The association engine itself. R1–R16, `tierFor()`, `filterMatches()`, the inspector, the compare
panel, the pocket view and the target-pool machinery all still exist and are still used. The
industry hierarchy was built **above** them; company-specific associations and recruitment
targeting became optional workflows **beneath** it. Discarding the engine was never necessary to
remove the focal company — only the defaults were.

---

## Part B — The four separated experiences

### B1. Industry Atlas — `/industry-atlas`, and now `/`

The default landing. Four-level national taxonomy (16 macro-sectors → sector → sub-sector →
operational niche; 731 nodes, `npm run validate:taxonomy` → 0 errors / 0 warnings).

- Left rail: taxonomy tree plus the shared filter panel.
- Main: branch context → sub-industry sections → the company landscape.
- Right: inspector for whatever is selected; nothing is selected on load.
- Top: search, breadcrumbs, coverage, view controls.

Empty branches report zero. A zero is a gap in the map, not a claim that no company operates
there — the page says so. Companies not yet placed in the taxonomy live in their own
"Not yet classified" branch, which is a research backlog, not an overflow bucket.

### B2. Company Intelligence — `/companies`, `/organizations/:organizationId`

A universal directory over one organisation universe. Credit risk is now a **dataset filter**
(`?dataset=credit-risk`), not the definition of the register.

The dossier carries: aliases, legal identity, industry placement, activities, products and
services, processes and evidenced capabilities, business model and value-chain role, geography,
sourced scale, indicative footprint, parent/subsidiary, other affiliations, sources with
verification dates, research gaps, and mapped professionals and datasets. Client and sourcing
relevance appears only when a context is selected.

### B3. Company Associations — `/company-associations`

Optional, and no longer a graph-first page. Opens with **no company focused** and **no brief
active**. Grouped by industry, sub-industry, capability, process, technology, geography,
value-chain adjacency, verified ownership or partnership, and transferability — nine kinds, each
labelled with one of five evidence classes:

| Evidence class | Meaning |
| --- | --- |
| `verified-factual-relationship` | A sourced corporate relationship record exists |
| `shared-sourced-attribute` | Two companies share an evidenced attribute (e.g. an industry) |
| `derived-taxonomy-placement` | Proximity inferred from where the taxonomy places them |
| `recruiter-observation` | A recorded recruiter observation |
| `un-evidenced-proximity` | They co-occur, with nothing evidenced between them |

Only the first can ever read as ownership. Vertical position never implies it — ownership is a
separate, explicitly labelled structure (`OwnershipTree`).

A company focus is temporary: set it, clear it (`.assoc-clear-focus`), or arrive with `?org=<id>`
and get the company-centred view back. The network view still exists and still needs a focal
company, because a radial network is a view of one company — it is just no longer the default.

### B4. Recruitment Targeting — `/recruitment-targeting`

Brief-first. With no role selected the page explains that nothing is ranked, and lists what
selecting a brief will do. No tier, no score, no "top N" appears without it.

Tiers are labelled, conditional and explicitly *not* a company-size or industry-importance
measure. Sharing an industry with the client is never automatic tier 1. Changing the brief
re-ranks relevance and changes no company fact.

---

## Part C — Indicative Market Footprint

Five bands: **Major national/multinational**, **Large or multi-site**, **Regional or established
specialist**, **Smaller or emerging**, **Footprint not established**.

Approximate reach, never statutory size. Basis: sourced employees, turnover, site count and
distribution, geographic breadth, capacity or assets, verified group structure, sector
indicators. Revenue, headcount, assets and capacity are never conflated into one number.

**Nothing is invented.** If no comparable sourced figure exists the band is
`not-established` with `classificationKind: 'unclassified'` and `confidence: 'unknown'`. A
derived band is `pending-review` until a human reviews it. Reviewer corrections set
`reviewStatus: 'reviewed'` and keep the derived reading in `note`, so a correction never edits
the underlying source fact.

**Entity scope is always stated**, because attributing a group headcount to a subsidiary would be
a fabricated fact:

| Scope | Applies when |
| --- | --- |
| `consolidated-group` | The figure covers the whole group |
| `south-african-operation` | The figure covers the South African operation only |
| `operating-division` | The figure covers one site, plant or division |
| `standalone-entity` | The entity has no group above it |
| `not-stated` | The source does not say — never defaulted to a guess |

A division-scoped headcount is capped so it cannot establish national reach. A range bands on its
**lower** bound. Sector-specific capacity (pallet positions, megawatts, tonnes) is recorded but
never banded, because it is not comparable across industries. Corrections live in
`markets/organizations/footprint-reviews.json`, keyed by organisation id.

Ordering inside a band is **alphabetical**. There is no numeric ranking and no
largest-to-smallest ordering presented as fact.

Contract (`src/data/organizations/footprint.ts`):

```
organizationId, band, classificationKind, basis, supportingMetricIds,
evidenceReferences, confidence, reviewStatus, reviewedBy, reviewedOn,
entityScope, note
```

---

## Part D — One organisation universe

`buildCompanyIntelligence(sources)` composes the curated register with the credit-risk,
accounting-and-finance, Search Bank, contact and Salesforce employer datasets.

- Exact canonical matches resolve to **one** record.
- Similarly named but distinct entities are **never** auto-merged.
- Dataset-only employers are **never** dropped; they are discoverable and explicitly unplaced.
- The same organisation id is used across all four experiences.
- The UI never claims the universe is complete.
- The composition point is ready for future licensed recruitment-history ingestion; nothing
  implies that data exists today.

---

## Part E — Filters, search and URL state

One filter contract, one reader, one writer: `FILTER_KEYS` in `types.ts` lists every dimension;
`readFilters()` / `writeFilters()` in `query.ts` are the only serialisers. Finding (8) was caused
by a hand-maintained key list drifting from the panel; there is no longer one to drift.

Dimensions: macro-sector, industry, sub-industry, operational niche, primary/secondary
involvement, province/region, indicative footprint, sourced scale, operating capability, business
model and value-chain stage, corporate group, verification status, with/without mapped
professionals, and — only when a brief is explicit — active assignment.

Search spans names, aliases, industries, taxonomy paths, activities and relationships. Pagination
slices presentation and never restricts the underlying result set.

---

## Part F — Workspace migration

`maps:company-intelligence:v1` → `v2`. Pools, selections, overrides and context assignments are
preserved; no saved pool is ever discarded on migration failure.

```
TargetPoolScope = focal | industry | universe
```

A legacy focal definition migrates to `kind: 'focal'` with its `focalId` and `roleContextId`
intact. A dynamic pool whose definition cannot be derived becomes a **snapshot** — the saved
companies are kept, and the UI does not offer a re-derive it cannot perform. Search Bank import
reads stay backwards compatible. Browser-local work is labelled browser-local; it does not claim
to sync.

---

## Part G — Routing

| Route | Experience |
| --- | --- |
| `/` and `/industry-atlas` | Industry Atlas (default landing) |
| `/companies` | Universal company directory |
| `/organizations/:organizationId` | Company dossier |
| `/company-associations` | Associations with or without a company focus |
| `/recruitment-targeting` | Brief-first targeting |
| `/home` | The former landing page, still reachable |
| `/companies/:slug` | Legacy slug; redirects to the canonical id when one matches |

Old URLs with `org`, `role`, `view`, `inspect` and filters remain interpretable.
`/company-associations` with no `org` selects nothing. The new default initialises no recruitment
assignment.

---

## Part H — Verification

Run on this branch before merge:

```
npm test                  269 tests · 269 pass · 0 fail   (9 suites)
npm run qa                5 reviewers · 97 assertions · 0 failures
npm run validate:organizations   0 errors, 0 warnings
npm run validate:taxonomy        0 errors, 0 warnings across 731 nodes
npm run build             tsc -b clean, vite build succeeded
npm run smoke:routes      20 routes checked, ok
npm run audit:ui          0 findings
```

Route-level acceptance tests in `tests/industry-first-acceptance.test.ts` render the real pages
with the real router and assert the numbered behaviours from the directive. `tests/helpers/mount.ts`
mounts a page through Vite's SSR module graph, so a page that uses `import.meta.glob` or
`useParams()` renders as it does in the app.

**jsdom structural tests are not proof of visual correctness.** They prove what is in the DOM and
what is absent from it; they cannot prove layout. The atlas, footprint bands, inspector,
associations and targeting views were additionally checked in a browser.

---

## Part I — Modules added

```
src/data/organizations/
  footprint.ts          banding, entity scope, review state
  atlas.ts              taxonomy branch rollups, counts, coverage, search
  universeView.ts       CompanyView, filtering, facets, footprint grouping, CSV export
  industryDiscovery.ts  nine association kinds, five evidence classes, corporate hierarchy
  workspace.ts          v2 schema, migration, focal/industry/universe pool scopes
src/hooks/useCompanyUniverse.ts
src/components/atlas/        TaxonomyTree, FootprintBands, CompanyFilters,
                             CompanySummaryPanel, AssociationGroups, reviewLabels
src/components/intelligence/ FootprintCard, OwnershipTree, UniversalCompanyCard
src/pages/                   IndustryAtlasPage, CompanyDirectory, OrganizationPage,
                             CompanyAssociationsPage, RecruitmentTargetingPage
markets/organizations/footprint-reviews.json
tests/footprint-classification.test.ts
tests/industry-atlas.test.ts
tests/workspace-pool-migration.test.ts
tests/industry-first-acceptance.test.ts
tests/helpers/mount.ts
```
