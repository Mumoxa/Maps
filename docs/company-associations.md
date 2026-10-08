# Company Association Explorer — handoff

Date: 8 October 2026. Branch: `arena/e728a500-maps`. Everything below was run in this
repository; command output is quoted rather than summarised.

## 1. Verified As-Is (re-checked, not assumed)

| Question | Answer |
| --- | --- |
| `/company-associations` route | Did not exist. No general association or capability model; only `relationships.ts` (credit-risk corporate links) and `companyNormalization.ts`. |
| Search Bank state | `markets/search-bank/bank.json` was `schemaVersion 1`, `generatedOn 2026-10-07`, zero searches, zero candidates. The importer (`scripts/import-search-bank.ts`) handled candidates only. |
| Data architecture | Static JSON/JSONL bundled by Vite. No backend, no database, no authenticated endpoint. |
| Graph library | `@xyflow/react` already a dependency, used by `/map`. |
| Test baseline | `npm test` → 82 pass / 0 fail (5471 ms) before any new code. |
| Existing verification gates | `npm run build` (runs `validate:contacts`), `npm run smoke:routes` (17 routes), `npm run audit:ui` (0 findings, private routes `/contacts` + `/search-bank`). |
| `tsconfig` coverage | `tsconfig.app.json` included `src` only; `tsconfig.node.json` only `vite.config.ts`. **`scripts/` and `tests/` were never type-checked.** Now fixed (see §7). |

## 2. Implemented To-Be

The explorer lives inside the existing app at `/company-associations`, reached from the header nav
and the mobile nav. No second application, no standalone demo page.

- **Three synchronized views** over one filtered result set: Network (xyflow, progressive
  disclosure), Industry Pockets (every matched company, no top-10 cap), Company Table (13 sortable
  columns, multi-select, CSV export). The single `filterMatches(...)` result feeds all three, and
  `tests/company-association-discovery.test.ts` asserts they cannot disagree.
- **Left filter rail**: 9 checkbox dimensions + a mapped-professionals radio group, AND across
  dimensions, OR within one. Counts are computed from the same match list the views render.
- **Right Company Intelligence Inspector**: verified identity and aliases, factual record,
  capabilities split into observed / unknown (never checked) / not-observed, role-specific rules
  with evidence, missing evidence, mapped professionals, sources, research gaps, and a reviewer
  override form (tier + reason + reviewer).
- **Role-conditional targeting**: 15 rules (R1–R15), transparent tiers 1–5, every hit carrying a
  label, detail and evidence string. No percentage is computed or displayed anywhere.
- **Comparison**: shared / distinct / unknown / implications, with one-sided evidence treated as a
  difference and two-sided silence as unknown.
- **Target pools**: snapshot or dynamic, browser-local, with a machine-readable Search Bank drop.
- **Structured import** with match → review → commit → audit, idempotent by canonical identity.
- **Machine-readable export**: `discoverTargets()` (schemaVersion 1) and `knowledgeBaseSummary()`.

## 3. Architecture

```
markets/organizations/           canonical data (generated from seed/build_seed_1.py)
  industries.json  pockets.json  capabilities.json  organizations.json
  corporate-relationships.json  associations.json  recruiter-intelligence.json
  batches/                       one audit record per committed import batch
src/data/organizations/
  types.ts        contracts: Organization, Industry, OrganizationIndustry, Capability,
                  OrganizationCapability, OrganizationRelationship, CompanyAssociation,
                  RoleContext, AssociationMatch, TargetPool, SearchTargetCompany,
                  EvidenceRecord, ImportBatch, QualityIssue
  load.ts         index builder + employer resolution
  roleContexts.ts 6 role families, 3 assignment contexts, bank-derived contexts, factual context
  discovery.ts    on-demand candidate generation, R1–R15, tiering, filterMatches
  analysis.ts     universe stats, coverage by industry, comparison
  quality.ts      14 data-quality codes
  query.ts        companyDossier, discoverTargets, export contract, CSV
  workspace.ts    browser-local pools, selection, overrides, Search Bank drop payload
  universe.ts     composition root: curated register + dataset employers
src/data/searchBank/targets.ts   target-company ingest (parse, normalise, merge, idempotent)
scripts/
  organizations-import.ts        planImport / applyPlan / planSummary library
  import-organizations.ts        CLI: npm run organizations:import
  validate-organizations.ts      build gate
  scenario-report.ts             npm run scenarios (reproducible A/B/C demonstration)
  import-search-bank.ts          now also --targets
```

Four ideas stay separate by construction: company facts (`Organization` +
`OrganizationCapability`), company relationships (`OrganizationRelationship`), sourcing
suggestions (`CompanyAssociation`), role-specific targeting (`RoleContext` + `AssociationMatch`).
Nothing is precomputed for every company pair: the 80-company register has 6,320 possible ordered
pairs and stores exactly 4 curated associations; discovery generates the rest per request.

## 3a. National taxonomy wiring

`docs/sa-corporate-taxonomy.md` defines a national four-tier sector taxonomy
(`markets/organizations/taxonomy/`, 731 nodes). The explorer now reads it, without a second
classification and without a new per-company data file:

```
src/data/organizations/taxonomyPlacement.ts
  taxonomyNodesForIndustry(id)   Maps industry -> national nodes (from industry-crosswalk.json)
  organizationTaxonomy(org)      placement, cached per organization; stubs stay empty
  sharedTaxonomyBranch(a, b)     deepest shared branch, or null
```

Everything is **derived** at load from `industries.json` + `industry-crosswalk.json` +
`sector-tree.json`. The Maps industry list stays flat and authoritative for what a company does;
the hierarchy lives in the taxonomy and is reached through the crosswalk, so there is one source of
truth per fact.

What this adds to the explorer:

| Surface | Change |
| --- | --- |
| Rule `R16-shared-taxonomy-branch` | Two companies in *different* Maps industries that resolve to the same branch of the national taxonomy. Level 1 (macro-sector) overlap alone does not fire — that is weaker evidence and is left to R3/R4. |
| Facet "National macro-sector" | Counts derived in the same pass as the industry and province facets, from the same match list. |
| `CompanyDossier.taxonomy` / `.macroSectors` | Full `Macro-Sector > … > Niche` path per industry, shown in the inspector as "National taxonomy placement". |
| `TargetCompanyPayload.macroSectors` + CSV column | "National macro-sector" in the export. |
| `knowledgeBaseSummary().nationalTaxonomy` | Macro-sector counts plus placement coverage: `placed`, `unplaced`, `unplacedIndustries`. |
| Search | Taxonomy path labels join the haystack, so "Cold Chain Storage" finds companies the industry names alone would not. |

**Not duplicated, deliberately:** no scale-band facet (the existing sourced-scale buckets are
untouched — the taxonomy's statutory bands are a per-record attribute of a company profile, not a
filter over this register), no parallel industry tree, no new route, and no copy of the taxonomy
into `industries.json`.

**R16 never repeats R1.** If two companies share an exact industry id, R1 owns that pair and R16
returns null; a test asserts no match in the universe reports both. R16 does not feed `tierFor`, so
it adds explainable relationship evidence without silently re-ranking anything.

### Crosswalk corrections made while wiring

Auditing all 30 industry mappings against the industry descriptions and the companies that hold them
found three that were wrong or over-claimed:

| Industry | Was | Now | Why |
| --- | --- | --- | --- |
| `fresh-produce-export` | `AGR-HORT-EXPORT` | `WHL-COLD-BOND-PERISH` *(new L4)* | The industry is dockside handling, pre-cooling and export preparation, held by cold chain operators (CCS Logistics, Port Elizabeth Cold Storage) — not horticultural export marketing. |
| `renewable-development` | `ENR-GEN-IPP` | `ENR-GEN-IPP-DEV` *(new L4)* | Development, financing and construction management is a different business model from owning and operating the asset. Both industries mapped to one node, which collapsed the distinction and hid the developer-to-owner relationship. |
| `construction-contracting` | `CON-CONTR-BUILD` | `CON-CONTR` | The industry covers building *and* civils; mapping it to "Building Contractors" asserted building work for civils-led contractors. |

Two level-4 nodes were added to the taxonomy for the first two rows, then the outline and JSON Schema
were regenerated (`npm run taxonomy:outline`, `npm run taxonomy:schema`).

### Measured effect on the current 96-company register

```
placement coverage   96 placed / 0 unplaced / 0 unmapped industries
macro-sectors        Construction 28, Manufacturing 19, Transport 15, Agriculture 14,
                     Wholesale 14, Energy 10, Retail 7
R16 associations     223 unique company pairs across 6 distinct shared branches
                     121 Food, Beverage & FMCG Manufacturing (L2)
                      70 Property Development & Investment (L2)
                      14 Contract Logistics & 3PL / 4PL (L2)
                      12 Commodity Marketing, Storage & Co-operatives (L2)
                       4 FMCG Wholesale & Cash and Carry (L2)
                       2 Edible Oils & Fats (L3)
```

These are pairs the flat industry list could not see at all — for example Tiger Brands ↔ Quantum
Foods (food manufacturing ↔ poultry and feed), SLM Developments ↔ Resilient REIT (developer ↔ REIT),
and Willowton Group ↔ Southern Oil (edible oils ↔ oilseed crushing).

Verification for this change: `npm test` **191 pass / 0 fail** (16 new), `npm run validate:taxonomy`
0 errors / 0 warnings across 731 nodes, `npm run build` exit 0, `npm run smoke:routes`
`{"status":"ok","routesChecked":18}`, `npm run audit:ui` `findings: 0`.

## 4. UI

`src/pages/CompanyAssociationsPage.tsx` composes `Breadcrumb` → `page-head` → `.assoc-context`
(focal company, recruitment context, view switch, filter trigger) → `.assoc-brief` (the assignment
the ranking is conditional on) → `.assoc-layout` (filter rail, views, inspector) → `.assoc-poolbar`
→ a plain-language "How relevance is decided" note. URL state (`org`, `role`, `view`, filter keys,
`q`, `people`, `inspect`) means every view is shareable and reload-safe. Below 1180px the inspector
drops below the columns; below 1024px the filter rail becomes the standard `.facet-drawer`.
New classes are documented in `docs/design-system.md`.

## 5. Search Bank integration

- `/search-bank` now shows, per search, the **target companies** attached to it, in a table below
  the candidate grid, with the note: "Sourcing targets are companies, not people."
- A pool exported from the explorer is stored with `npm run bank:import -- <file> --targets`.
  Verified end-to-end against a scratch copy of `markets/search-bank/`:

```
=== DRY RUN ===  dry-run {'format': 'json', 'read': 2, 'added': 2, 'updated': 0, 'skipped': 0,
                          'searchesCreated': ['Financial Manager — Commercial Cold Storage'], 'issues': []}
=== COMMIT ===   imported | added 2 | updated 0 | searchesCreated [...] | drop .../20261008-pool-targets-json.json
=== RE-IMPORT == unchanged | added 0 | updated 2
bank.json now: searches: [('search-financial-manager-commercial-cold-storage', ...)]
               targetCompanies: [('Vector Logistics', 1, 'known-verified', 'proposed', 4),
                                 ('Nukor Feeds', 5, 'unknown', 'proposed', 0)]
```

- The drop carries reasons, tier, evidence state and missing evidence, so a reviewer sees why each
  company is on the list. `tests/search-bank-targets.test.ts` (11 tests) covers idempotency,
  provenance, two-search attachment, CSV tolerance, and that a candidate import never disturbs
  attached companies.

## 6. Data coverage

From `npm run validate:organizations` (also runs inside `npm run build`):

```
organizations 96, canonicalNames 96, industries 30, capabilities 55,
relationships 16, curatedAssociations 4, recruiterObservations 6
coverage: withWebsite 65, withScale 38, withLocations 70,
          withEvidencedCapabilities 75, pendingVerification 38
errors 0, warnings 0
```

The discovery scan adds employers named by existing Maps datasets: 331 distinct accountant employers
resolve to organisations that are merged with the curated register where the name matches, so each
scenario scans 418 companies (96 curated + 322 dataset-only) and returns 417 matches across 13
pockets — the focal company is not a candidate for itself. Coverage reporting always separates verified, pending verification and
never researched; directory membership alone is never treated as capability evidence, which is why
several large agri names sit in tier 3 with "No evidence recorded yet; this is missing research,
not a confirmed absence."

**Batch 2 research (completed 2026-10-08)**: Hyprop Investments, Vukile Property Fund, DSV South
Africa, Kuehne+Nagel South Africa, DHL Supply Chain South Africa, Pick n Pay Group, Boxer
Superstores and Food Lover's Market were added with per-fact source URLs, plus a `parent-of`
relationship for Pick n Pay → Boxer (65.6% retained after the November 2024 IPO). The Red Rocket
record was upgraded from a single directory mention to four sources. Where sources conflicted
(Pick n Pay store counts, Food Lover's store counts, a London registered address for Hyprop) the
conflict is recorded in the record's notes rather than averaged away.

**Batch 3 research (completed 2026-10-08)**: Heriot REIT, Accelerate Property Fund, Dipula Income
Fund, Scatec South Africa, Cennergi, Pele Green Energy, Mainstream Renewable Power South Africa and
SOLA Group were added, plus a `verified-partnership` relationship for SOLA ↔ WBHO (the Naos 1 EPC
contractor is a SOLA Build and WBHO joint venture). Three discipline decisions are worth recording:

- **Exxaro Resources was deliberately not added.** Cennergi is its wholly owned subsidiary, but
  Exxaro is a mining group and the industry taxonomy has no mining node, so recording it would have
  meant inventing a classification. The affiliation lives in Cennergi's notes instead, and Exxaro
  stays a gap.
- **Mainstream is recorded as the developer, not the owner.** The sources state that on completion
  the assets are acquired by Lekela Power and managed by MAMSA; attributing ownership to Mainstream
  would have been a mistaken corporate affiliation. Its capacity for Loeriesfontein 2 is reported as
  both 140 MW and 138 MW by two sources, and both figures are recorded rather than averaged.
- **Three records carry no legal name** (Scatec South Africa, Mainstream, SOLA Group) and are
  `needs-verification`, because the South African legal entity was not established by the sources
  read. Pele Green Energy's legal name was withdrawn during QA: the wording sourced was
  descriptive, and the only registered names found were the project SPVs, which are recorded in the
  notes.

**Batch 4 research (completed 2026-10-08)**: Emira Property Fund, Balwin Properties, Resilient REIT,
BexGroup, FPG Investments, Cambridge Food, Opti Feeds and Epko Oil Refinery were added, plus five
`parent-of` relationships — BexGroup → Bester Feed & Grain, FPG Investments → FPG Property Fund,
Massmart → Cambridge Food, and NWK → Opti Feeds and NWK → Epko. Two names were researched and
deliberately left out: Blue Turtle Energy, because no source describing such a company was found at
all, and Metier Sustainable Capital, because it is a real infrastructure fund manager but the
taxonomy has no fund-management node. Recording it under `renewable-development` would have
misstated what it does, so the wind-farm ownership history it belongs to is carried in Mainstream's
notes instead.

Batch 3 also added a `capacity` metric to `OrganizationScale`. Cold storage is measured in pallet
positions and property funds in sites; forcing an MW figure into a headcount field would have
misstated what the source said. The scale filter already labels a non-headcount record as "Scale
reported but unverified", so no interface change was needed.

**A name that was researched and rejected**: `nukor.co.za` is Nukor Sawmilling, Woodworking &
Agricultural Equipment — CPM's South African representative. It supplies pelleting and grinding
machinery; it is not a feed manufacturer, so "Nukor Feeds" was never added. The reason is recorded
in a comment in `markets/organizations/seed/build_seed_1.py`.

**Deliberate research gaps** (not fabricated, not silently zeroed): Opti Feeds/EPKO, Blue Turtle
Energy, Scatec SA, Mainstream SA, Cennergi/Exxaro, Pele Green, Heriot REIT, Accelerate, Dipula,
Emira, Balwin, Resilient, SOLA Group, Metier, Cambridge, BexGroup parent, FPG Investments parent.

## 7. Verification (commands and actual results)

| Command | Result |
| --- | --- |
| `npm test` | **151 pass / 0 fail** — 82 baseline + 16 discovery + 11 model + 16 quality + 15 import + 11 Search Bank targets |
| `npx tsc -b --force` | **clean**, now across `src`, `scripts` and `tests` (new `tsconfig.scripts.json`) |
| `npm run build` | exit 0; `validate:organizations` 0 errors / 0 warnings; bundle built in 10.19 s |
| `npm run smoke:routes` | `{"status":"ok","routesChecked":18}` |
| `npm run audit:ui` | `{"status":"ok","routesChecked":18,"findings":0}`, `/company-associations` present in `filterDrawersAudited`, title `SA Talent Map \| Company Associations` |
| `npm run validate:organizations` | 0 errors, 0 warnings |
| `npm run qa` | **5 reviewers, 90 assertions, 0 failures** — see §7a |
| `npm run scenarios` | prints the A/B/C demonstrations (see §8) |

Five pre-existing test fixtures had type holes that only surfaced once `scripts/` and `tests/`
entered the build; they were fixed rather than excluded.

Import pipeline, run against a scratch copy of `markets/organizations/` (the repository data was
not modified by the exercise):

```
dry-run companies:     read 2, updatedOrganizations 2, issues []        (unknown industry ids are rejected, not invented)
commit #1:             committed | quality {'errors': 0, 'warnings': 0} | batches/…-companies.csv.audit.json written
commit #2 same batch:  unchanged | "every row in this batch is already recorded; no file was rewritten"
                       md5 identical: 2822cd0c27108c73b4176aea522b960e before and after
capabilities drop:     conflict surfaced -> "CCS Logistics capability "Warehouse management system" changes from unknown to observed"
                       unknown capability id -> issue, row not written
relationships drop:    existingRelationships 1 (no duplicate)
```

Two importer bugs were found and fixed while exercising it: header detection ignored spaces (so a
`From Company` / `To Company` file was read as companies), and the shared `name` requirement ran for
relationship rows that legitimately have no name column.

## 7a. Independent QA reviewers (`npm run qa`)

The unit tests were written alongside the implementation, so they can share its blind spots. The
five reviewers under `scripts/qa/` were written against the brief instead, and each reads its
subject from a different angle than the code under test:

| Reviewer | What it reads | Assertions |
| --- | --- | --- |
| `reviewer-data` | `markets/organizations/*.json` straight off disk, bypassing the app's loaders | 23 |
| `reviewer-explainability` | source text of the explorer + a live discovery run | 11 |
| `reviewer-ui` | the rendered page in jsdom | 30 |
| `reviewer-privacy` | shipped datasets, source tree, bank records | 10 |
| `reviewer-acceptance` | the directive's acceptance conditions, run live | 16 |

`npm run qa` prints a per-reviewer verdict and exits non-zero on any failure, so it can gate CI
alongside `npm test`. Latest run: **5 reviewers, 90 assertions, 0 failures**.

The reviewers found real defects on their first run, all of which were fixed in the code or data
rather than in the reviewer — see `docs/qa-report.md` for the full list. Two were product bugs, not
test artefacts:

- Clicking a company that came from an existing Maps dataset opened an empty inspector, because
  `companyDossier` only resolved curated ids. It now builds a dossier from what is actually known,
  so an un-researched company shows its gaps instead of dead-ending.
- The network view started with every pocket collapsed, so a recruiter who landed on the graph had
  no company to click. The strongest pocket now opens by default.

They also found 15 capability records that encoded a *proxy* as an observation — a directory
classification, a portfolio's breadth, a reported cost ratio, an external audit — which had
promoted Boxer Superstores to tier 1 for a cold-storage finance brief on the strength of "3,000
SKUs". Those rows are now `unknown`/`probable` with the proxy named in the evidence, and
`build_seed_1.py` refuses to build if a proxy or an inference is recorded as `observed`.

### Three defect classes, and the one that survived both guards

Encoding evidence honestly turned out to need three separate checks, because the same mistake
presents three different ways:

1. **Inferential wording** — evidence that says "suggests", "implies" or "not stated" while the row
   claims `observed`. Caught by the `INFERENTIAL` guard.
2. **Proxy evidence** — a real, correctly-worded fact that is not the capability: a sector
   classification, a portfolio's breadth, a reported ratio, an audit, a preferred-bidder status.
   Caught by the `PROXY_EVIDENCE` guard. This is what promoted Boxer to tier 1.
3. **Borrowed operations** — a correctly-worded, correctly-sourced fact about the *wrong legal
   entity*: a holding company recording what its subsidiary does. Nothing in the wording is
   inferential and nothing in it is a proxy, so neither guard above can see it.

Class 3 was found in batch 4, not by a reviewer but by reading the scenario output: adding BexGroup
moved scenario C's tier 1 from one company to two, because BexGroup satisfied the mandatory
`commodity-trading` requirement on evidence describing Bester Feed & Grain — its own subsidiary. A
holding company that trades nothing reached tier 1 for a commodity-trading brief.

Seven rows were downgraded across BexGroup (4) and FPG Investments (3), and `build_seed_1.py` now
runs `assert_no_borrowed_operations` alongside the other two guards. The check is deliberately
narrow: it only applies to companies listed in `HOLDING_COMPANIES`, because an operating group such
as Pick n Pay legitimately runs a franchise network that names Boxer. A blanket "evidence must not
name a subsidiary" rule would have produced false positives on records that were already correct.

The guard was verified by reintroducing the original defect and confirming the build fails on it —
a guard that has never been seen to fire proves nothing.

## 8. The three scenarios (`npm run scenarios`)

All three scenarios now scan 418 companies (96 curated + 322 dataset-only) and return 417 matches —
the focal company is not a candidate for itself.

- **A — Financial Manager, commercial cold storage** (Commercial Cold Storage (Pty) Ltd, Paarden
  Eiland; group Commercial Cold Holdings). Tier 1 = 17, tier 2 = 12, tier 3 = 21, tier 4 = 25,
  tier 5 = 342. Tier 1 is Vector Logistics, Commercial Cold Holdings, DHL Supply Chain South
  Africa, DSV South Africa, Sequence Logistics, Chilleweni, Imperial Logistics, Kuehne+Nagel South
  Africa, Laser Logistics, Table Bay Cold Storage, iDube, Port Elizabeth Cold Storage, Reefer,
  Super Group, Value Logistics, eThekwini Cold Stores and Etlin International.
- **B — Finance lead, property development** (SLM Developments (Pty) Ltd, reg K2019081416,
  Bellville). Tier 1 = 9: Rabie Property Group, Attacq, FPG Property Fund, Growthpoint Properties,
  Hyprop Investments, Rebosis Property Fund, Devmark Property Group, and — added by batch 4 —
  Balwin Properties and Resilient REIT. Tier 2 = 23, tier 3 = 12, tier 4 = 15, tier 5 = 358. The
  companies that led scenario A now sit in tier 5 while their facts stay byte-identical (asserted in
  tests).

  Both batch 4 additions earn tier 1 on development evidence rather than on scale or sector
  adjacency: Balwin reaches it on R1+R3+R5 (a residential developer with 20 active developments and
  development costs carried at R6,9 billion), and Resilient on R3+R4+R5 (a REIT whose stated core
  competency is developing and reconfiguring shopping centres, with the Mahikeng Mall extension
  opened in May 2024).

  The batch 3 additions land in tier 2 rather than tier 1: Heriot REIT, Accelerate and Dipula are
  property *investment* funds, so they share a financial profile and operating processes with a
  developer (R4/R5/R6) but not the development pocket itself. The five renewable developers
  (Scatec South Africa, Cennergi, Pele Green, Mainstream, SOLA) also sit at tier 2 on R5+R6, which
  matches the four renewable developers already in the register — ACED, Mulilo, Red Rocket and
  Reatile reach the same tier on the same two rules. That control comparison is the check that
  batch 3 followed established engine behaviour instead of inflating relevance.
- **C — Head of Finance, agri commodity trading** (Bester Feed & Grain (Pty) Ltd, Stellenbosch,
  LEI 3789BFDYDZGX0SH5BH08). Tier 1 = **1**: NWK Ltd, the only company with commodity trading
  evidenced (R2). Tier 2 = 3 (BexGroup, Southern Oil, Unitrans Supply Chain Solutions), tier 3 = 14,
  tier 4 = 35, tier 5 = 364. Astral Foods, Quantum Foods, DSV and DHL Supply Chain are tier 3, each
  listing "Commodity trading — no evidence recorded yet" as missing research. Scale does not
  substitute for the mandatory exposure, and adding 24 researched companies across batches 3 and 4
  did not move the mandatory-exposure result: tier 1 was 1 before batch 3 and is 1 after.

  BexGroup sits at tier 2 rather than tier 1 on R1+R3+R9+R10, and the R10 hit is the point: it is
  Bester's own parent, so the corporate affiliation is what makes it relevant, not a trading
  capability. It briefly reached tier 1 during batch 4 on borrowed evidence before the correction
  described in §7a.

**Why scenario A has 17 tier-1 companies and none of them evidences the mandatory exposure.** Tier 1
is reached either by evidencing a mandatory requirement (R2) or by sharing the industry/pocket *and*
an operating process (R1|R3 + R5). Every tier-1 company in scenario A lists "Inventory accounting;
Cost accounting" as missing research, because public sources almost never describe a company's
accounting processes. The engine deliberately does **not** demote a company for that gap: missing
research is not a verified absence, and demoting on it would treat an unverified field as a negative
signal. The gap is displayed on the company instead, which is the actionable output — it tells the
recruiter which exposure to verify first.

D&B misclassifies SLM Developments as "Furniture and Home Furnishings Retailers"; that conflicting
source is retained in the record rather than silently dropped.

## 9. Security and privacy

- **No confidential data was added.** The private boundary was checked before any write: no real
  candidate PII, client contracts or sourcing notes were introduced. Recruiter observations in the
  seed are labelled recruiter-intelligence records with reviewer attribution, not personal data.
- Target pools, selection and reviewer overrides live in `localStorage` under
  `maps:company-intelligence:v1`, and the UI says so in the pool bar ("stored in this browser only,
  not on a shared server"). There is no server store in this repository, so no multi-user
  persistence was provisioned and none is claimed.
- `/search-bank` and `/contacts` keep their `noindex` contract; `audit:ui` re-checks it
  (`privateRoutesNoIndexed: ["/search-bank","/contacts"]`).
- No security control was disabled, bypassed or relaxed to make anything work.
- Nothing in the model infers an individual's experience from their employer: a target record
  carries no person, and `tests/search-bank-targets.test.ts` asserts that.

## 10. Deployment

Unchanged and still correct for what this is: a static Vite build for Cloudflare Pages
(`base: '/'`, `public/_redirects` for SPA deep links). `npm run build` is the whole deployment
artefact; the new route needs no server, no environment variable and no migration. Because there is
no backend, the write paths are: the audited CLI importers (committed to the repository by a human)
and browser-local storage. A shared multi-user write path would need a service and an auth boundary
that this repository does not have; that is reported plainly rather than faked.

## 11. Remaining work

1. The gap list in §6 is now closed. Batches 2, 3 and 4 added 24 companies to the 72-record
   foundational register, taking it to 96, and each record survived the three guards in the seed
   (`assert_capability_discipline`, `assert_no_borrowed_operations`, and the proxy/inference
   patterns inside the first).

   Three researched names remain deliberately absent, and each is a taxonomy limitation rather than
   unfinished research:

   - **Exxaro Resources** — Cennergi's parent, but a mining group; the taxonomy has no mining node.
   - **Metier Sustainable Capital** — a real infrastructure fund manager and former investor in the
     Loeriesfontein, Khobab and Noupoort wind farms; the taxonomy has no fund-management node.
   - **Blue Turtle Energy** — no source describing such a company was found at all, so there is
     nothing to record without inventing an entity.

   Adding any of the first two means adding an industry node and a pocket, which is a modelling
   decision about what this register is for, not a research task. That decision is still open.
   The national taxonomy has since removed half the obstacle: `MIN-*` (mining, including PGM, coal,
   iron ore and junior miners) and `FIN-DFI-IMPACT` (infrastructure and impact fund management)
   already exist as targets, so either company now needs one new Maps industry plus a crosswalk
   line, not a new branch of the national tree.
2. Decide whether target pools should leave the browser. That needs a backend and an auth decision;
   until then the drop file + `bank:import --targets` is the shareable path.
3. Attach real Searches to Search Bank briefs so role contexts derive from live assignments instead
   of the three seeded ones (the plumbing exists: `roleContexts()` reads bank searches when present).
4. Add facility-level records (per-site pallet counts, provinces) as a child entity of
   `Organization` if site-level sourcing becomes a requirement; today they are recorded as scale
   records and locations on the company.
5. Bundle size: `ContactDirectory` is a 6 MB chunk (pre-existing). Splitting it is unrelated to this
   work but worth doing.
6. `npm run qa` is not yet wired into `npm run build`. It mounts pages in jsdom and takes about
   eight seconds, so it belongs in CI rather than in every build.
