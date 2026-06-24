# South Africa Salesforce Ecosystem Map

This folder documents the Salesforce market-map layer for `Mumoxa/Maps`.

## Scope

- Total named Salesforce practitioners analysed: 1,048 (1,047 source records + 1 manual correction)
- South Africa-based practitioners: 1,019
- Salesforce customer technographic records in the supplied v2 map: 295
- BuiltWith live `.za` domain signal records in the supplied v2 map: 266
- Implementation / ISV partners in the supplied v2 map: 23
- Ecosystem segments: Vendor, Partner, Customer, Manual Correction
- Primary geography: South Africa
- Website route: `/markets/salesforce`

## Website Layer Added

The React page exposes:

- 1,047 imported source people in `people.json`, plus manual corrections through the shared talent registry
- Salesforce people in the global `/talent-search` experience with skill, location, company, seniority and sector facets
- ecosystem summary KPIs
- Vendor / Partner / Customer segmentation plus manual corrections queue
- leadership and 2026 market signals
- practitioner cloud expertise heat map
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

## Manual Corrections

- Katlego Magnificent Seapi - Pretoria, Gauteng - LinkedIn: `https://www.linkedin.com/in/seapi-katlego-96a955165/`
- Status: added as a user-supplied correction; Salesforce role, current employer and profile evidence still need verification before client/candidate use.

## Data Quality Notes

- `Email_Pattern_Inferred` was present in the uploaded CSV but is intentionally excluded from the public website layer.
- The v2 HTML is treated as enrichment / inspiration data. Customer cloud use, licence estimates, AI status, revenue and implementation-partner attribution must be verified before client-facing submission.
- Manual corrections are displayed separately until the role, employer and Salesforce evidence have been validated.
- Scores and ranking signals are market-map prioritisation indicators, not verified hiring recommendations.
- Duplicate names are retained in generated data packs and should be flagged rather than deleted.

## Next Data Expansion

The Salesforce people table is now committed as structured JSON and included in global search. The remaining generated local data pack may still contain company hierarchy, cloud-expertise files, shortlist files, full org-chart structures and a parsed 295-customer technographic JSON. Those should be committed through local git/CLI or a batch upload path if the site needs full-table interactive filtering beyond the current people-search layer.
