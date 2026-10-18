# National historical hiring source assessment — South Africa

Reviewed: 2026-10-08. This records verified *product/API capabilities* and unresolved South African rights/coverage. It is **not** an executed source scan.

## Decision

Test an authorised historical-employer report first. Contact providers for access/SA coverage *before* spending engineering time on an unsupported integration. The goal is an **uncapped named-employer universe**, not "top 10" or "top 5" companies. Pair historical aggregates with separately dated job-level evidence and independent business/industry verification.

## Evidence and limitations

| Option | Verified capability from official documentation | SA and reuse status | Decision |
|---|---|---|---|
| Adzuna Intelligence | `GET /api/v1.1/{country_code}/reports/hiring-employers/` documents `start_date`, `end_date` and employer names with `posting_count`; the response may include `sample_size` and source industry. | Adzuna runs a South African job site, but this does **not** establish Intelligence API historical SA access, uncapped completeness, pricing or commercial reuse. | **First vendor to qualify.** Request ZA sample with named employers and date range, not aggregate market metrics alone. |
| Lightcast | Officially advertises historical and current postings with employer, occupation, skills and geographic data. | SA granularity, coverage, price, rights and permitted exports not confirmed. | Parallel second vendor request for a representative ZA extract. |
| Adzuna public API | Lists current job ads. Its `history` endpoint is historical **salary trend**, not a complete historical raw job-ad archive. Its `top_companies` endpoint is a top-five leaderboard. | SA search market exists; commercial usage restrictions still require review. | Useful supplementary current search if licensed; **not** a national historical company census. |
| Greenhouse public Job Board API | Public GET lists currently published jobs without GET authentication. Includes an update timestamp, which must **not** be relabelled as initial publication. | Company-specific board token and data rights needed for reuse, no general national historic archive. | Current feed enrichment where permitted. |
| Greenhouse Harvest | Employer-authorised API has scoped company job and job-post records, including historical/closed statuses depending on account permissions. | Not a nationwide public database. | Only where the employer grants proper access. |
| LinkedIn | Official help forbids unauthorised automated third-party scraping and LinkedIn's crawling terms require express permission. | No authorised bulk data licence obtained. | No unapproved crawler. Use only permitted data/access and corroborating company sources. |
| PNet, CareerJunction, Careers24, Job Mail and other boards | Real South African recruiting surfaces (product-specific capability not assessed here). | Licensed historical exports/partner access unknown. | Vendor-by-vendor permission and coverage review before automation. |

## Sources read

- Adzuna Intelligence hiring employers report: https://developer.intelligence.adzuna.com/api-8430038
- Adzuna South Africa: https://www.adzuna.co.za/
- Adzuna public top-five companies: https://developer.adzuna.com/docs/companies
- Adzuna historical API (salary trends): https://developer.adzuna.com/docs/historical
- Lightcast official historical postings overview: https://lightcast.io/our-data/postings
- Greenhouse public Job Board API: https://docs.greenhouse.io/job-board.html
- Greenhouse employer-authorised Harvest API: https://docs.greenhouse.io/harvest.html
- LinkedIn prohibition: https://www.linkedin.com/help/linkedin/answer/a1341387/prohibition-of-scraping-software

## Minimum supplier due-diligence questions

1. Does the provider supply employers **operating or recruiting in South Africa**, covering all nine provinces, for **2025-10-08 through 2026-10-08**? Is ZA coverage available for the specific endpoint being sold?
2. Can the supplier provide **every distinct named employer** observed, rather than a leaderboard? What is the max result limit, and are pagination and complete exports available?
3. What proportion of reports are recruitment agencies or anonymous client advertisements? What rules determine the advertiser, brand and real employing organisation?
4. Is every employer assigned a stable provider ID? Are legal entities, subsidiaries, franchises and group brands distinguished?
5. Are counts unique, deduplicated postings? What is `sample_size`? Can the provider deliver job-level records and the **original publication date**, rather than only last-updated timestamps?
6. What are the source board coverage, history retention, known gaps and bias by geography, industry, date or employer size? How do they handle deleted or expired ads?
7. Can Talent Tree retain employer names, source references, industry proposals, counts and job-level metadata **indefinitely in a private product**, enrich them and create derived company intelligence? Can it display selected derived information to clients? Is redistribution of source records prohibited?
8. What are price, trial size, quotas, contractual expiry and ongoing update cadence?
9. What rights exist to delete, rectify and attribute data when an advertiser disputes a record?
10. Can a test export with at least three sectors and provinces be used to validate the schema, deduplication and identity matching before commitment?

## Go/no-go rules

- **Go** for a licensed provider only after a representative SA sample, verified 12-month coverage, more than leaderboard-only discovery, acceptable employer IDs, and rights to retain derived intelligence.
- **Conditional go** if only employer-level period aggregates are available: useful for company discovery; must not manufacture individual vacancies, precise dates, hiring managers or evidence of hiring completion.
- **No-go** where the source has no ZA coverage, prohibits required retention, offers only a top-5/10 leaderboard, or cannot distinguish advertising intermediaries.
- If no provider qualifies, begin with permitted live official company-career feeds and work backwards only where archival publication dates are independently evidenced. Report the missing historical gap rather than claiming coverage.

## Implementation and commercial gates

The Maps repository has a private-file staging importer for source-level vacancies and a separate adapter for Adzuna-style employer aggregates. **Neither has retrieved live ZA source data**; the adapters accept supplied, rights-cleared exports. Source datasets must stay in an ignored private directory outside the publicly deployed Vite assets.

Next data product increment: reviewed, licence-permitted company-only intelligence snapshots to power the existing Company Association Inspector and Search Bank. Do not expose confidential recruiter notes, source-restricted records, or probable personal contact data in the public frontend. If a private backend is added, specify authentication and row-level security before importing data.
