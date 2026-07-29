# Mumoxa Maps

A React/Vite market-intelligence map site for South African talent ecosystems.

## Current Market Areas

| Market | Website Route | Status | Data Scope |
|---|---|---|---|
| SA Credit Risk Market Map | `/` | Live existing map | Credit risk profiles, companies, segments, org chart and shortlist |
| SA Salesforce Ecosystem Map | `/markets/salesforce` | Added | 1,047 Salesforce professionals, 59 companies, vendor/partner/customer segmentation, cloud expertise, top companies and market intelligence summary |
| SA SAP ERP Market | `/sap-erp` | Added | Verified South African SAP ERP market track, aligned to the shared specialist-talent structure |

Future markets must be registered in `src/data/tracks.ts` with a South African geography, supported product category, and explicit evidence status. Routes and navigation should consume that registry so additions remain within the SA Talent Map product scope.

Production deploys run automatically after the `CI` workflow succeeds on `main`. The Cloudflare Pages workflow can also be started manually with `workflow_dispatch` when an authorised redeploy is required.

The production build verifies its generated entry point, bundled assets, GitHub-compatible `404.html`, and Cloudflare Pages `_redirects` fallback before it can pass CI or deploy. Registered single-segment market routes resolve through the shared track registry, so future tracks do not require a one-off page wrapper.

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

The website page at `/markets/salesforce` currently exposes the Salesforce ecosystem summary, cloud expertise map, seniority distribution, geographic concentration, data-quality guardrails and top company clusters.

## Salesforce Data Quality Note

The uploaded Salesforce CSV contained `Email_Pattern_Inferred`. That field is intentionally excluded from the public website layer because it is inferred rather than verified. LinkedIn URLs are the retained evidence source in the generated data pack. Duplicate names are kept as separate records and flagged in the profile data pack.

## Build

```bash
npm install
npm run build
```

The build script runs TypeScript and Vite, then copies `dist/index.html` to `dist/404.html` for SPA routing.
