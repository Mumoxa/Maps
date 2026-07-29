# South Africa Salesforce Ecosystem Map

This folder documents the Salesforce market-map layer for `Mumoxa/Maps`.

> **Provenance audit, July 2026:** 959 of the original 1,047 imported practitioner records were removed
> after they were found to be machine-generated rather than real people. See "Provenance Audit" below.
> Counts in this document reflect the post-audit dataset.

## Scope

- Total named Salesforce practitioners retained: 89 (88 source records + 1 manual correction)
- South Africa-based practitioners: 89 (88 source records + 1 manual correction)
- Salesforce customer technographic records in the supplied v2 map: 295
- BuiltWith live `.za` domain signal records in the supplied v2 map: 266
- Implementation / ISV partners in the supplied v2 map: 23
- Ecosystem segments: Vendor, Partner, Customer, Manual Correction
- Primary geography: South Africa
- Website route: `/markets/salesforce`

## Website Layer Added

The React page exposes:

- 88 source-retained people in `people.json`, plus manual corrections through the shared talent registry
- Salesforce people in the global `/talent-search` experience with skill, location, company, seniority and sector facets
- ecosystem summary KPIs
- Vendor / Partner / Customer segmentation plus manual corrections queue
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

The source people table is imported from `SA_Salesforce_Market_Map_v2_FULL.html` by running:

```bash
npm run import:salesforce -- "C:\Users\craff\Downloads\SA_Salesforce_Market_Map_v2_FULL.html"
```

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

## Manual Corrections

- Katlego Magnificent Seapi - Pretoria, Gauteng - LinkedIn: `https://www.linkedin.com/in/seapi-katlego-96a955165/`
- Status: added as a user-supplied correction; Salesforce role, current employer and profile evidence still need verification before client/candidate use.

## Data Quality Notes

- `Email_Pattern_Inferred` was present in the uploaded CSV but is intentionally excluded from the public website layer.
- The v2 HTML is treated as enrichment / inspiration data. Customer cloud use, licence estimates, AI status, revenue and implementation-partner attribution must be verified before client-facing submission.
- Manual corrections are displayed separately until the role, employer and Salesforce evidence have been validated.
- Scores and ranking signals are market-map prioritisation indicators, not verified hiring recommendations.
- Duplicate names in a source export are a synthetic-data warning sign; investigate provenance before import.

## Next Data Expansion

The people layer now needs rebuilding from a verifiable source. Requirements for the next dataset:

1. Every record must carry a resolvable evidence URL that has been checked, not pattern-generated.
2. Reject any export where LinkedIn slugs are sequential, names repeat across a small pool, or job titles cluster into round counts.
3. Add a `verificationStatus` field per record (`verified` / `pending` / `rejected`) before client or candidate use.
4. The 295-customer technographic and partner data are unaffected by the audit and can still be expanded.
