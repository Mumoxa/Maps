# South Africa Salesforce Ecosystem Map

This folder documents the Salesforce market-map layer for `Mumoxa/Maps`.

> **Provenance audit, July 2026:** 959 of the original 1,047 imported practitioner records were removed
> after they were found to be machine-generated rather than real people. See "Provenance Audit" below.
> Counts in this document reflect the post-audit dataset.

## Scope

- Public searchable Salesforce practitioners: 88 source-retained records
- Excluded source history: 1 incomplete manual correction
- South Africa-based public practitioners: 88
- Salesforce customer technographic records in the supplied v2 map: 295
- BuiltWith live `.za` domain signal records in the supplied v2 map: 266
- Implementation / ISV partners in the supplied v2 map: 23
- Ecosystem segments: Vendor, Partner, Customer
- Primary geography: South Africa
- Website route: `/markets/salesforce`

## Website Layer Added

The React page exposes:

- 88 source-retained people in `people.json`, loaded through the shared legacy adapter
- future verified additions loaded from immutable `markets/salesforce/batches/*.json` files
- Salesforce people in the global `/talent-search` experience with skill, location, company, seniority and sector facets
- ecosystem summary KPIs
- data-derived Vendor / Partner / Customer segmentation
- leadership and 2026 market signals
- customer cloud footprint heat map
- customer industry distribution
- seniority and geography distribution
- top Salesforce ecosystem company clusters
- top 24 Salesforce users from the supplied v2 market map
- 23 implementation partners with tier, Salesforce headcount estimate, certification estimate and focus context
- surrounding technology stack patterns
- data-quality and privacy guardrails

## V2 Enrichment Source

The second uploaded HTML map added customer, partner, Agentforce and surrounding-stack context on top of the original people CSV. The page now uses that information as a compact market intelligence layer rather than only a people-cluster layer.

The original source people table was imported from `SA_Salesforce_Market_Map_v2_FULL.html` by running:

```bash
npm run import:salesforce -- "C:\Users\craff\Downloads\SA_Salesforce_Market_Map_v2_FULL.html"
```

This is retained only as a historical importer. Do not use it for new additions. All new verified
profiles use the shared CSV batch workflow in `docs/market-data-import-guide.md`.

## Provenance Audit — July 2026

The originally imported people table did not survive verification. 959 of 1,047 records
(91.6%) were machine-generated. Evidence:

| Signal | Finding |
|---|---|
| LinkedIn slugs | 959 ended in a sequential counter tracking array position (`candice-merwe-200`, `lwandile-kruger-201`, ...) |
| Name construction | 149 first names x 116 surnames recombined, yielding 70 duplicate full names |
| Job titles | 972 bulk rows drawn from only 13 titles, in round counts (120/120/100/82/81/76/75/74/73/67/66) |
| Experience | `yearsSalesforceExperience` uniformly distributed 1-5 |
| Geography | every record hardcoded to `South Africa` |

**Retained:** `sf-0001` to `sf-0088` — records with bespoke job titles, natural LinkedIn slugs
(including genuine numeric LinkedIn hashes such as `colin-samson-b4360918`) and real named employers.

**Removed:** `sf-0089` to `sf-1047`, itemised in `removed_records_manifest.json`.

The prior figures on the ecosystem page (1,048 practitioners; CloudSmiths 179; Accenture 137;
Deloitte Digital 109) were inflated by these records. Real retained counts are CloudSmiths 16,
Accenture 3, PwC 2, Deloitte Digital 1. Per-company practitioner counts have been withdrawn
from the page rather than restated, since the surviving sample is not a reliable headcount.

Re-running `npm run import:salesforce` against the original HTML **will reintroduce the removed
records**. Validate any new export against the signals above before committing.

## Excluded Source History

- Katlego Magnificent Seapi - Pretoria, Gauteng - LinkedIn: `https://www.linkedin.com/in/seapi-katlego-96a955165/`
- Status: preserved in `manual_corrections.json`, excluded from public search and all practitioner totals because role and employer evidence is incomplete.

## Data Quality Notes

- `Email_Pattern_Inferred` was present in the uploaded CSV but is intentionally excluded from the public website layer.
- The v2 HTML is treated as enrichment / inspiration data. Customer cloud use, licence estimates, AI status, revenue and implementation-partner attribution must be verified before client-facing submission.
- The incomplete manual correction is displayed only as excluded source history and is not part of the shared registry.
- Scores and ranking signals are market-map prioritisation indicators, not verified hiring recommendations.
- Duplicate names in a source export are a synthetic-data warning sign; investigate provenance before import.

## Next Data Expansion

The people layer now needs rebuilding from a verifiable source. Requirements for the next dataset:

1. Every record must carry a resolvable evidence URL that has been checked, not pattern-generated.
2. Reject any export where LinkedIn slugs are sequential, names repeat across a small pool, or job titles cluster into round counts.
3. Supply `suppliedAsVerified: true`, an evidence note and an ISO evidence-check date for every imported row.
4. The 295-customer technographic and partner data are unaffected by the audit and can still be expanded.
