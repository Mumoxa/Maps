# South African Employer Intelligence — evidence-first build contract

Status: architecture and phase-one ingest contract (not a claim of nationwide coverage). 
Initial historical window: 2025-10-08 through 2026-10-08 inclusive. Thereafter use a rolling 12-calendar-month window, retaining older evidence separately if licensed.

## Product goal

Build a reusable South African employer universe across every sector for recruiter market mapping. Job advertisements are an important discovery and activity source, not a census of South African registered or trading companies. The correct headline is "companies discovered" or "employers with observed postings", never "every company in South Africa".

Extend the existing markets/organizations canonical universe, industry pockets, company association graph, company dossiers and Search Bank targets. Do not create an unrelated second company directory.

## Four separate layers

1. Organization identity: trading name, legal name if independently verified, aliases, group/parent relationships, web domain, registration identifier when verified.
2. Industry taxonomy: South African SIC classification (version identified), existing Maps industry/subindustry nodes and sourcing pockets; multiple industries with evidence and one evidenced primary. The existing 30 niche industries are not a comprehensive national industry taxonomy. Industry candidates from job-board labels remain proposed until checked.
3. Hiring observations: time-stamped, source-linked individual advertisements, including title/function/seniority, job location, observed employer name, advertising agency, original posting date, salary when explicit, direct-versus-agency and attribution status.
4. Recruitment intelligence: observed hiring functions, geographic patterns, recency, apparent growth signals (hypothesis only), advertising sources, agency usage, hiring stakeholder identity only when separately lawfully evidenced, and sources. Never synthesize contact names, addresses or email formats as confirmed facts.

Sector describes what the company does. Occupation describes what the employee does. A finance vacancy at a mining company does not classify that company as financial services. A technical vacancy cannot establish the underlying systems operated by the company unless the advert expressly supports that narrower claim; link any claim to its source.

## Source plan and backfill priority

- Tier A: licensed historical recruitment data or contractual data feeds covering the window. Check South African coverage, collection methodology, legal re-use rights, timestamp quality and archive access before relying on a 12-month backfill. Adzuna Intelligence advertises an employer-hiring report by date range; availability and licence for South Africa must be independently confirmed.
- Tier B: official company careers websites, sitemaps, JobPosting structured data and authorised ATS feeds: Greenhouse, Lever, Ashby, SmartRecruiters and other employer ATS services. Public ATS APIs generally give current postings; do not pretend they reconstruct expired postings from 12 months ago.
- Tier C: local aggregators and boards (PNet, CareerJunction, Job Mail, Indeed, Careers24, LinkedIn and similar) through explicit permission, licensed partner API, approved exports or appropriately authorised searches. Do not automate prohibited site scraping or bypass logins, CAPTCHAs or rate limits.
- Tier D: employer announcements, company registries, industry associations and recruiter research to discover companies with no public vacancies and verify what those companies actually do.

Coverage is source-specific. Keep board/source id, capability (search/current/historical), licensed coverage dates, last attempted scan, last successful scan, records inspected, records retained, failures, pagination exhaustion and incomplete coverage. Missing activity means "not observed in searched sources", NOT "no hiring".

## Workflow

1. Register each authorised source and its licence/usage boundaries.
2. Discover results without fixed top-ten caps; partition broad search by month, region, occupation and industry where the source supports reliable pagination.
3. Extract the minimum source-permitted job metadata, with a source URL, source-specific ID or stable URL, original publication date and retrieval timestamp.
4. Quarantine unknown/invalid dates, untraceable sources, ambiguous employment identities and conflicting attribution; do not count rejected records as observed hires.
5. Normalize spelling using the existing companyNormalization utility, but don't automatically merge same-looking subsidiaries, franchise businesses or similarly named unrelated employers. Store the raw spelling.
6. Resolve against the canonical organization register using reviewed aliases, stable identifiers, official domain or corroborated company evidence. A job listing alone does not prove an employing legal entity.
7. Record a direct advertisement as evidence of that advertiser's *posting*, not proof of a hire, future growth, an open vacancy now or a fully verified business capability.
8. For agency listings, preserve the agency as advertiser. Attribute the end employer only when named and sourced; otherwise the end employer stays unknown, with hypotheses separate from confirmed matches.
9. Keep all source observations; de-duplicate exact source+job IDs/URLs. Flag suspected cross-board reposts for review rather than deleting them by a fuzzy match.
10. Derive per-company aggregates from retained observations: posts by month, functions, seniority, province, source and employer-attribution state. Report unique postings separately from observed hiring and never call counts "positions filled".
11. Send new/provisional entities, absent industry nodes, suspect joins and possible duplicate postings to reviewer queues. Only approved changes are promoted through the existing organizations:import pathway.
12. QA after each batch: row validation, uniqueness, dates, provenance, rights, employer-versus-agency, industry/occupation distinction, classification review, reconciled counts, incremental refresh and regression checks.
13. Expose reviewed employer aggregates inside company dossier, association discovery and Search Bank, with evidence links and coverage limitations. Retain a searchable source ledger outside the Vite static bundle once the volume exceeds practical repo storage.

## Initial structured import

Phase-one CLI inputs are CSV/JSON/JSONL exported from *authorised* sources. It produces:
- append-only source-observation ledger
- per-company employer candidates and hiring summaries
- review queue (ambiguous, missing evidence and industry candidates)
- import audit (window, counts, source attribution, coverage)
- no automatic writes to canonical organizations.json; reviewers use the existing organization importer after verifying company identity/industry.

Required import fields: source, source_url, job_title, posted_on, advertiser_name, advertiser_type (direct, agency, unknown). For direct ads, employer_name can be supplied; otherwise the advertiser is the only proven advertising organization. Extra fields: source_job_id, end_employer_name, attribution_confidence, city, province, function, seniority, employment_type, salary_as_advertised, proposed_industry_id, checked_on, official_domain. Any reported salary must retain units and currency; never infer compensation from occupation.

The implementation must treat only records inside the selected publication window as historical backfill. A fetch date or a current open status cannot substitute for an original publication date. A post created before the window and merely updated in it is not a new posting unless its creation date is evidenced.

## Sector taxonomy expansion

Use Stats SA SIC as a broad national classification anchor, recording the version. Keep existing Maps company-industry links and sourcing pockets as a role-specific layer rather than forcing all South African companies into 30 pre-existing niches. Introduce new narrower nodes only after confirming an existing SIC parent, name, synonyms and representative activity evidence. Finance, healthcare, mining, technology, professional services, education, public services, hospitality, agriculture, utilities and manufacturing must all be representable. Do not label a company "unclassified" as a definitive industry.

## Identity and evidence states

- Confirmed: official careers/source names employer, or independent official evidence supports company, industry or registration assertion.
- Probable: corroborated secondary evidence but unresolved legal/brand boundary.
- Hypothesis: single uncertain lead, agency-description guess, employer pattern or title-based industry possibility.
- Unknown: absent or conflicting evidence.

No black-box percentage of fit or employee count inferred from posting frequency. Stakeholder names/emails require their own dated source; probable email guesses stay explicitly marked and private.

## Storage and privacy

Maps is presently a static Vite/React site, not a durable high-volume backend. Source-observation ingestion is an offline/staging capability; it is not a live autonomous scraper, historical feed or operational national database. Do not bundle raw bulk vacancy history, personal contact data or licensing-restricted material into the public Pages application. Build a separately permissioned database/storage + search index before scaled deployment. Respect POPIA, provider terms, retention and removal requests.

## Completion criteria

- A reproducible authorised-source import with idempotent re-run, original dates, transparent rejects and exact-source duplicate handling.
- Company names resolve into verified, provisional and unattributed states without unsupported merges.
- Broad nationwide source coverage reporting including explicit uncovered source/time/location gaps.
- Reviewed company additions feed the existing canonical registry, association explorer and Search Bank, not a duplicate silo.
- A scalable persistence/search design and operator dashboard for source health and reviews.
- Tests and build checks run and recorded in each PR; no claims of full 12-month coverage before the licensed historical backfill has actually run.

## References consulted 2026-10-08

- Stats SA industry classification: https://www.statssa.gov.za/?page_id=377
- SARS SIC sections/divisions: https://www.sars.gov.za/types-of-tax/pay-as-you-earn/employment-tax-incentive-eti/standard-industrial-classification-codes/
- Greenhouse official Job Board API: https://docs.greenhouse.io/job-board.html
- Adzuna job search API: https://developer.adzuna.com/activedocs
- Adzuna Intelligence employer report: https://developer.intelligence.adzuna.com/api-8430038
- LinkedIn automation restrictions: https://www.linkedin.com/help/linkedin/answer/a1341387/prohibition-of-scraping-software
