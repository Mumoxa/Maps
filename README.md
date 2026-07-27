# Mumoxa Maps

A React/Vite market-intelligence map site for South African talent ecosystems.

## Current Market Areas

| Market | Website Route | Status | Data Scope |
|---|---|---|---|
| SA Credit Risk Market Map | `/` | Live existing map | Credit risk profiles, companies, segments, org chart and shortlist |
| SA Salesforce Dataset Overview | `/markets/salesforce` | Added | Imported professional records and dataset-derived employer, location and cloud-label summaries |

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

The website page at `/markets/salesforce` exposes only summaries derived from the committed people dataset and explains the evidence boundary. Claim-level market intelligence requires reviewable sources under [`markets/salesforce/SOURCE_POLICY.md`](markets/salesforce/SOURCE_POLICY.md).

## Salesforce Data Quality Note

The uploaded Salesforce CSV contained `Email_Pattern_Inferred`. That field is intentionally excluded from the public website layer because it is inferred rather than verified. Profile URLs retain the stated provenance of imported records but do not by themselves verify that fields are current. Duplicate names are kept as separate records rather than assumed to be the same person.

## Build

```bash
npm install
npm run build
```

The build script runs TypeScript and Vite, then copies `dist/index.html` to `dist/404.html` for SPA routing.
