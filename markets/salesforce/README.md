# South Africa Salesforce Ecosystem Map

This folder documents the Salesforce market-map layer for `Mumoxa/Maps`.

## Scope

- Imported Salesforce-related professional records and their source links
- Dataset labels for employers, ecosystem types, locations and cloud associations
- Primary intended geography: South Africa
- Website route: `/markets/salesforce`

## Public Website Scope

The React page exposes:

- imported records in `people.json`, plus verification-pending corrections through the shared talent registry
- Salesforce people in the global `/talent-search` experience with skill, location, company, seniority and sector facets
- dataset-derived record, employer-label, employer-type, province and cloud-label counts
- an explicit evidence boundary distinguishing imported claims from verified facts
- data-quality and privacy guardrails

## V2 Enrichment Source

The second uploaded HTML map supplied people records and additional market claims. Only aggregates derived from the committed people records are displayed publicly. Customer, partner, product, event and surrounding-stack claims are excluded unless claim-level sources can be reviewed.

The source people table is imported from `SA_Salesforce_Market_Map_v2_FULL.html` by running:

```bash
npm run import:salesforce -- "C:\Users\craff\Downloads\SA_Salesforce_Market_Map_v2_FULL.html"
```

## Data Quality Notes

- `Email_Pattern_Inferred` was present in the uploaded CSV but is intentionally excluded from the public website layer.
- The v2 HTML is treated as enrichment / inspiration data. Customer cloud use, licence estimates, AI status, revenue and implementation-partner attribution must be verified before client-facing submission.
- Manual corrections are displayed separately until the role, employer and Salesforce evidence have been validated.
- Scores and ranking signals are market-map prioritisation indicators, not verified hiring recommendations.
- Duplicate names are retained in generated data packs and should be flagged rather than deleted.

## Next Data Expansion

The Salesforce people table is committed as structured JSON and included in global search. Additional company hierarchy, cloud expertise, shortlist, org-chart or customer-technographic data may be added only when each public claim meets the source policy.

Before adding any of that information, follow [`SOURCE_POLICY.md`](SOURCE_POLICY.md). An unavailable local source filename or a disclaimer does not make a claim source-verified.
