# Mumoxa Maps

A React/Vite market-intelligence map site for South African talent ecosystems.

## Current Market Areas

| Market | Website Route | Status | Data Scope |
|---|---|---|---|
| SA Credit Risk Market Map | `/` | Live existing map | Credit risk profiles, companies, segments, org chart and shortlist |
| SA Salesforce Ecosystem Map | `/markets/salesforce` | Live | 88 legacy source-retained profiles plus append-only source-verified batches, vendor/partner/customer segmentation, customer technographics, partner tiers and market intelligence summary |
| SA SAP ERP Market | `/sap-erp` | Added | Verified South African SAP ERP market track, aligned to the shared specialist-talent structure |

Future markets must be registered in `src/data/tracks.ts` with a South African geography, supported product category, and explicit evidence status. Routes and navigation should consume that registry so additions remain within the SA Talent Map product scope.

Production deploys run automatically after the `CI` workflow succeeds on `main`. The Cloudflare Pages workflow can also be started manually with `workflow_dispatch` when an authorised redeploy is required.

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
