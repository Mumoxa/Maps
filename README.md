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

Production deploys run automatically after the `CI` workflow succeeds on `main`. The Cloudflare Pages workflow can also be started manually with `workflow_dispatch` when an authorised redeploy is required.

### Known non-blocking check: `Workers Builds: maps`

The live site deploys to **Cloudflare Pages** (`.github/workflows/deploy-cloudflare.yml` → `npx wrangler pages deploy dist --project-name maps`). A separate **Cloudflare "Workers Builds"** integration, configured in the Cloudflare dashboard (not in this repo), also runs on every push and reports the failing `Workers Builds: maps` commit check. It is a leftover Workers build for a project that ships as Pages, is **not a required check**, and does **not** affect CI, the Pages deploy, or the live site.

No repository change fixes it — the stray `wrangler.jsonc` Workers config was already removed and the failure persists, because the integration is defined server-side in Cloudflare. To clear the red check, an account owner must **disconnect (or delete) the Git-connected "Workers Builds" integration for the `maps` Workers service in the Cloudflare dashboard** (under that Workers service's build settings; Cloudflare's exact menu labels change over time). Until then the check can be safely ignored, or made non-required in the branch protection rules.

## Private Contact Directory

The `/contacts` route loads the generated `src/data/contact-parts/` dataset, a source-retained private directory generated from the supplied lead-generation workbooks and contact export. Blank company cells inherit only the nearest preceding company value in the same sheet; person fields are never forward-filled. Every retained row keeps its source file, sheet and row number in `sourceRecords`.

Install the pinned importer dependency and regenerate the directory by passing the output files followed by every source file:

```bash
python -m pip install -r requirements-contact-import.txt
npm run contacts:import -- src/data/contact-parts contacts.audit.json SOURCE_1.xlsx SOURCE_2.xlsx SOURCE_3.xlsx SOURCE_4.csv
npm run validate:contacts
```

The checked-in validator reconciles each generated source audit and rejects shifted spreadsheet values such as email addresses in person names or dates in telephone fields. The directory contains personal contact details and relationship notes and must remain behind the project's private access boundary.

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
