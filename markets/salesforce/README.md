# South Africa Salesforce Ecosystem Map

This folder documents the Salesforce market-map layer added from `sa_salesforce_people_full_1047.csv`.

## Scope

- Total profiles analysed: 1,047
- Total companies: 59
- Ecosystem segments: Vendor, Partner, Customer
- Primary geography: South Africa
- Website route: `/markets/salesforce`

## Website Layer Added

The React page exposes:

- ecosystem summary KPIs
- Vendor / Partner / Customer segmentation
- cloud expertise heat map
- seniority distribution
- geographic concentration
- top Salesforce ecosystem companies
- data-quality and privacy guardrails

## Data Quality Notes

- Duplicate names are retained in the generated data pack and flagged rather than deleted.
- `Email_Pattern_Inferred` was present in the uploaded CSV but is intentionally excluded from the public website layer.
- Scores and ranking signals are market-map prioritisation indicators, not verified hiring recommendations.

## Next Data Expansion

The generated local data pack contains profile-level JSON, company hierarchy, cloud-expertise files, shortlist files and full org-chart structures. These files are large and should be committed via local git/CLI or a batch upload path rather than pasted through the GitHub connector.
