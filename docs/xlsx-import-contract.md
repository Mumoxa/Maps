# XLS/XLSX import contract

Incoming spreadsheets should be normalized before they are promoted into a live data pack.

## Canonical entities

- MarketArea
- Company
- SkillPocket
- CompanySkillPocket
- Profile
- EvidenceRecord
- ShortlistEntry
- SourceFile
- ImportBatch

## Minimum profile columns

| Column | Purpose |
| --- | --- |
| `id` | Stable profile identifier. |
| `name` | Person name. |
| `linkedin_url` | Public LinkedIn URL or blank when unavailable. |
| `company` | Current company name normalized to the company universe. |
| `title` | Current role title. |
| `location` | City, province or country label. |
| `market_area` | Speciality map such as `credit-risk-analytics`. |
| `skill_pocket` | Company-level pocket such as Credit Risk, MLOps or SAP. |
| `segment` | Market segment used by the speciality map. |
| `seniority` | Seniority band. |
| `function` | Functional category. |
| `evidence` | Human-readable evidence for the mapping. |
| `source_url` | Public source URL supporting the record. |
| `verification_basis` | How the record was verified. |
| `fit_score` | Numeric fit score for shortlist and search ranking. |
| `confidence` | High, Medium or Low. |
| `notes` | Research notes and gaps. |

No planned speciality map should be shown as live until its data pack has been populated and validated.
