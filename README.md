# Mumoxa Maps

A React/Vite market-intelligence map site for South African talent ecosystems.

## Current Market Areas

| Market | Website Route | Status | Data Scope |
|---|---|---|---|
| SA Credit Risk Market Map | `/` | Live existing map | Credit risk profiles, companies, segments, org chart and shortlist |
| SA Salesforce Ecosystem Map | `/markets/salesforce` | Live | 88 legacy source-retained profiles plus append-only source-verified batches, vendor/partner/customer segmentation, customer technographics, partner tiers and market intelligence summary |
| SA SAP ERP Market | `/sap-erp` | Added | Verified South African SAP ERP market track, aligned to the shared specialist-talent structure |
| SA Hackathon Contestants Talent Pool | `/hackathons` | Live | 342 evidence-linked candidates (segment: Hackathon contestants) from the SA Hackathon Census — 115 event editions, 2012–2026 |
| SA Accounting & Finance Talent Pool | `/accounting-finance` | Live | Evidence-backed South African finance professionals from bookkeeper-equivalent level through CFO / Finance Director, with qualifications, professional bodies and articles / practical routes recorded where verified |

Future markets must be registered in `src/data/tracks.ts` with a South African geography, supported product category, and explicit evidence status. Routes and navigation should consume that registry so additions remain within the SA Talent Map product scope.

**Adding to the map — start here:** [`docs/adding-to-the-talent-map.md`](docs/adding-to-the-talent-map.md) is the master guide for adding people to an existing track or registering a brand-new track, covering both supported ingestion patterns (verified-batch pipeline and research-DB pool) and the guardrails that keep additions from breaking the build.

Production deploys run automatically after the `CI` workflow succeeds on `main`. Before pushing, `npm test`,
`npm run build`, `npm run smoke:routes` (renders every route, including `/search-bank`, in jsdom) and
`npm run audit:ui` (one `h1` per route, heading order, control names, duplicate ids, image alt text and stray
inline styles) are the local gate. The interface itself is specified in
[`docs/design-system.md`](docs/design-system.md): tokens, type, page anatomy, interaction rules.

The Cloudflare Pages workflow can also be started manually with `workflow_dispatch` when an authorised
redeploy is required.

### Known non-blocking check: `Workers Builds: maps`

The live site is **https://maps-4xq.pages.dev**, deployed to **Cloudflare Pages** by
`.github/workflows/deploy-cloudflare.yml` (`npx wrangler pages deploy dist --project-name maps`).
GitHub Pages is not enabled for this repository, so the old `mumoxa.github.io/Maps/` origin is gone;
`public/robots.txt`, `public/sitemap.xml` and the social tags in `index.html` all point at the
Pages origin and must be updated together if a custom domain is attached. A separate **Cloudflare "Workers Builds"** integration, configured in the Cloudflare dashboard (not in this repo), also runs on every push and reports the failing `Workers Builds: maps` commit check. It is a leftover Workers build for a project that ships as Pages, is **not a required check**, and does **not** affect CI, the Pages deploy, or the live site.

No repository change fixes it — the stray `wrangler.jsonc` Workers config was already removed and the failure persists, because the integration is defined server-side in Cloudflare. To clear the red check, an account owner must **disconnect (or delete) the Git-connected "Workers Builds" integration for the `maps` Workers service in the Cloudflare dashboard** (under that Workers service's build settings; Cloudflare's exact menu labels change over time). Until then the check can be safely ignored, or made non-required in the branch protection rules.

## Candidate Search Bank

`/search-bank` is the recruiter workspace: a private bank where every candidate dropped in during a dedicated
client search is normalised onto one uniform record and filed under that search, so the bank stays retrievable
instead of turning into a mess.

- **Drop candidates in** — the panel at the top of `/search-bank` accepts pasted CSV / JSON / `Key: value`
  text or a dropped file, normalises it, and previews exactly what will be stored (new vs update).
- **Store them** — `npm run bank:import -- <file>` files every candidate under its search (creating the search
  if the bank does not have it), updates rather than duplicates anyone already stored, and writes an audit of
  the drop. Template: `templates/search-bank-drop.csv`.
- **Retrieve them** — the bank renders as one group per search, and every candidate is labelled with its
  search, pipeline status, title, seniority, employer, location, experience, availability, skills,
  qualifications, rating, tags and the date it entered the bank. Filter by free text or by the Search, Status,
  Seniority, Title, Skill, Qualification, Employer, Province, Availability, Rating and Tag facets; export the
  filtered set as CSV.
- **Data** — `markets/search-bank/bank.json` (searches + candidates) with one audit file per drop under
  `markets/search-bank/drops/`. The bank holds personal contact details and recruiter notes and must stay
  behind the project's private access boundary.

Start here: [`docs/search-bank-guide.md`](docs/search-bank-guide.md) (drop → import → retrieve, plus what the
normaliser canonicalises) and [`markets/search-bank/README.md`](markets/search-bank/README.md) (record
contract, accepted drop formats, merge rules).

## Private Contact Directory

The `/contacts` route loads the generated `src/data/contact-parts/` dataset, a source-retained private directory generated from the supplied lead-generation workbooks and contact export. Blank company cells inherit only the nearest preceding company value in the same sheet; person fields are never forward-filled. Every retained row keeps its source file, sheet and row number in `sourceRecords`.

Install the pinned importer dependency and regenerate the directory by passing the output files followed by every source file:

```bash
python -m pip install -r requirements-contact-import.txt
npm run contacts:import -- src/data/contact-parts contacts.audit.json SOURCE_1.xlsx SOURCE_2.xlsx SOURCE_3.xlsx SOURCE_4.csv
npm run validate:contacts
```

The checked-in validator reconciles each generated source audit and rejects shifted spreadsheet values such as email addresses in person names or dates in telephone fields. The directory contains personal contact details and relationship notes and must remain behind the project's private access boundary.

## SA Corporate Taxonomy Framework

`markets/organizations/taxonomy/` holds a national reference taxonomy for classifying any South African
registered company: a 731-node four-tier sector tree (Macro-Sector → Industry Sector → Sub-Industry →
Operational/Product Niche), the National Small Enterprise Act scale bands plus corporate-banking bands,
the statutory Schedule 1 sector thresholds, and controlled vocabularies for entity type, CIPC status,
SARS tax compliance, COIDA, B-BBEE, provinces, metros, district municipalities and regional economic hubs.

| File | Description |
|------|-------------|
| `sector-tree.json` | The four-tier tree (16 / 129 / 490 / 96 nodes per tier) |
| `sector-tree-outline.md` | Generated Markdown outline of the tree |
| `scale-bands.json` | Scale bands, turnover ceilings and the higher-of-both-proxies precedence rule |
| `statutory-schedule-1.json` | Schedule 1 sector thresholds; the 2026 replacement schedule is present but deliberately unpopulated until the gazette table is loaded |
| `controlled-vocabularies.json` | Entity types, regulatory statuses, B-BBEE, geography, hubs |
| `sa-company-profile.schema.json` | Generated JSON Schema (draft 2020-12) for one company record |
| `industry-crosswalk.json` | Binds all 30 industries and 12 sourcing pockets onto the national tree |
| `examples/` | Validated worked records at both ends of the scale |

The classification and validation logic lives in `src/data/taxonomy/`. Regenerate and check:

```bash
npm run taxonomy:schema     # regenerate the JSON Schema from the data files
npm run taxonomy:outline    # regenerate the Markdown outline from the sector tree
npm run validate:taxonomy   # integrity, crosswalk coverage and example validation (in the build gate)
```

The Company Association Explorer reads the crosswalk at runtime:
[`/company-associations`](https://maps-4xq.pages.dev/company-associations) derives each company's
national placement from its existing industry links, filters by national macro-sector, and links two
companies that sit in the same branch of the national taxonomy but in different sourcing industries
(rule `R16`). Nothing is duplicated — placement is derived, never stored per company.

Design specification: [`docs/sa-corporate-taxonomy.md`](docs/sa-corporate-taxonomy.md). It records which
facts were verified against sources on 2026-10-08 and which are deliberately left empty rather than
filled in plausibly — notably the sector turnover table of the schedule gazetted on 27 May 2026.

## Credit Risk Data Files

| File | Description |
|------|-------------|
| `profiles.json` | All credit-risk profiles with full fields |
| `profiles.csv` | Credit-risk CSV export |
| `companies.json` | Credit-risk company universe |
| `segments.json` | Credit-risk segments |
| `summary.json` | Credit-risk summary statistics |
| `org_chart.json` | Credit-risk segment → company → profiles hierarchy |
| `priority_shortlist.json` | Credit-risk priority recruitment shortlist |
| `company_map_full.json` | Credit-risk raw company map |

## Salesforce Data Pack

Salesforce market-map documentation lives under:

```text
markets/salesforce/
```

The website page at `/markets/salesforce` currently exposes the Salesforce ecosystem summary, customer cloud footprint, seniority distribution, geographic concentration, data-quality guardrails and ecosystem company cloud focus.

## Salesforce Data Quality Note

The uploaded Salesforce CSV contained `Email_Pattern_Inferred`. That field is intentionally excluded from the public website layer because it is inferred rather than verified. LinkedIn URLs are the retained evidence source in the generated data pack.

### Provenance audit — July 2026

959 of the original 1,047 imported practitioner records were **removed** after a provenance audit
established they were machine-generated rather than sourced from real people. Detection criteria:

- LinkedIn slugs ending in a sequential counter that tracked array position (`candice-merwe-200`,
  `lwandile-kruger-201`, `precious-van-niekerk-202`, ...) — real LinkedIn identifiers do not behave this way.
- Full names recombined from a closed pool of 149 first names and 116 surnames, producing 70 duplicate identities.
- All bulk records drawn from just 13 job titles in implausibly round counts (120 / 120 / 100 / 82 / 81 / ...).
- `yearsSalesforceExperience` uniformly distributed across 1-5.

88 records with genuine evidence links were retained (`sf-0001` to `sf-0088`). Removed IDs are listed in
`markets/salesforce/removed_records_manifest.json`. **These records must not be re-imported.**

On 29 July 2026, a separately sourced project export was reconciled through the shared batch importer.
It added 851 unique profiles with direct public LinkedIn identities. Its immutable batch and the
230-record exclusion audit are stored under `markets/salesforce/batches/` and
`markets/salesforce/import-audits/`. Public totals are calculated from the registry rather than
maintained in this document.

The HTML importer (`scripts/import-salesforce-html.mjs`) will regenerate the removed rows if it is
re-run against the original `SA_Salesforce_Market_Map_v2_FULL.html`. Validate any new source export
against the criteria above before committing its output.

## Build

```bash
npm install
npm run build
```

The build script runs TypeScript and Vite, then copies `dist/index.html` to `dist/404.html` for SPA routing.

## Hackathon Contestants Talent Pool

Generated from the SA Hackathon Census (`hackathon-census/`) via `python3 scripts/generate_hackathon_candidates.py` → `markets/hackathons/people.json` → `/hackathons`. See `markets/hackathons/README.md` for provenance, exclusions and the privacy boundary.

## Company-name normalisation

Company and organisation strings resolve to canonical entities via `src/data/companyNormalization.ts` (95-entry auditable alias table built from a 2026-08-26 frequency scan of every data source, plus a conservative legal-suffix stripper). Applied in talent search (company facet, filters, cards), the contacts directory (Companies facet + card chips) and the hackathon pool (affiliation filters and chips). Unknown names pass through unchanged — nothing is merged on guesswork.

## National Employer Hiring Intelligence (phase-one ingest)

Recruitment activity is a *discovery source*, not a register of every SA business. The repository now includes an evidence-first offline hiring-data import framework that will connect to the canonical 731-node corporate taxonomy (`markets/organizations/taxonomy/sector-tree.json`) and the existing 30 specialist sourcing industry nodes. No 12-month job-board backfill has been run or represented as complete.

- Design / coverage / permissions: [docs/national-employer-intelligence.md](docs/national-employer-intelligence.md)
- Import instructions: [markets/organizations/hiring/README.md](markets/organizations/hiring/README.md)
- Header template: [templates/hiring-observations.csv](templates/hiring-observations.csv)

Dry-run approved exports using `npm run hiring:import -- file.csv --from=2025-10-08 --to=2026-10-08`. Committing requires `--commit --rights-confirmed`. No API keys or unapproved scrapers are included.

