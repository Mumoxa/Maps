# SA Credit Risk Market Map

## Data Files

| File | Description |
|------|-------------|
| `profiles.json` | All profiles with full fields (name, company, title, LinkedIn, fit score, confidence, etc.) |
| `profiles.csv` | Same data in CSV format |
| `companies.json` | Company universe with segment, relevance, risk teams |
| `segments.json` | Industry segments with profile counts and company lists |
| `summary.json` | Summary statistics (totals, averages, distributions) |
| `org_chart.json` | Org chart structure: segment → company → profiles (nested) |
| `priority_shortlist.json` | Top 50 priority recruitment shortlist |
| `company_map_full.json` | Raw company map with full details |

## Data Fields (profiles)

| Field | Description |
|-------|-------------|
| `id` | Unique profile ID |
| `name` | Full name |
| `linkedin_url` | LinkedIn profile URL |
| `location` | City / Country |
| `company` | Current employer |
| `title` | Current job title |
| `seniority` | Seniority level |
| `function` | Functional area |
| `segment` | Industry segment |
| `specialism` | Credit risk specialism |
| `fit_score` | Fit score 1-10 |
| `confidence` | Confidence level (High, Medium, Low) |
| `evidence` | Evidence of credit risk relevance |
| `source_url` | Source verification URL |

## Summary

- **Total profiles:** 344
- **Total companies:** 79
- **Total segments:** 67
- **Confidence split:** High: 272, Medium: 70, Low: 2

## Suggested Frontend Features

1. **Org chart view** - segment → company → profiles hierarchy
2. **Search & filter** - by name, company, title, segment, seniority, confidence, fit score
3. **Profile cards** - clickable cards with full profile details and LinkedIn links
4. **Company view** - hover/click to show all credit risk people at a company
5. **Segment breakdown** - charts by segment, seniority, confidence
6. **Priority shortlist** - top candidates ranked by fit score

## Source

Data compiled from public LinkedIn profiles and web search. Workbook: SA_Credit_Risk_Market_Map_1200_Target_Buildout_Addendum_v6_2026-06-19.xlsx
