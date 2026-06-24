# South Africa Salesforce Ecosystem Map

This folder contains the Salesforce market-map data added from `sa_salesforce_people_full_1047.csv`.

## Scope

- Total profiles: 1047
- Total companies: 59
- Ecosystem segments: Vendor, Partner, Customer
- Primary geography: South Africa
- Evidence field retained: LinkedIn profile URL
- Inferred email field: intentionally excluded from public website JSON because the source field is inferred, not verified

## Files

| File | Purpose |
|---|---|
| `profiles.json` | Normalised Salesforce professional records |
| `companies.json` | Company-level Salesforce ecosystem mapping |
| `segments.json` | Vendor / Partner / Customer segmentation |
| `org_chart.json` | Segment → company → professional hierarchy |
| `summary.json` | KPI and distribution summary |
| `priority_shortlist.json` | Top 100 ranked Salesforce profiles |
| `ecosystem_map.json` | High-level relationship model and ecosystem metadata |
| `company_map_full.json` | Company relationship and profile-id mapping |
| `cloud_expertise.json` | Cloud specialism distribution and expert profile references |
| `certifications.json` | Certification frequency list |

## Website Route

The React app exposes the dataset at:

```text
/markets/salesforce
```

## Data Quality Notes

- Duplicate names are retained as separate source rows and flagged in `profiles.json`.
- `Email_Pattern_Inferred` was present in the uploaded CSV but is not published in this folder.
- Scores and shortlist ranking are market-map prioritisation signals, not verified employment recommendations.
