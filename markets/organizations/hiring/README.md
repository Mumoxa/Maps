# Hiring intelligence: private staging, source governance, and promotion

**No nationwide hiring scan has been run.** This directory contains a source registry and operating documentation, not a historical company dataset.

## Safety boundary

This is a PUBLIC GitHub repository. Never commit raw vacancy datasets, licence-restricted provider exports, applicant details, contact information, credentials, full job descriptions, or source-specific historical evidence that you are not expressly permitted to redistribute.

All raw data and generated employer-candidate lists now default to **`.local/hiring/`**, which is in `.gitignore`. Use `--data-dir=OUTSIDE_REPOSITORY` for a private volume. A path elsewhere inside this repository is rejected. The `--rights-confirmed` switch records the operator's confirmation; it does *not* magically grant provider permission. Verify licences before using it.

`source-registry.json` is an inventory of possible providers; all sources are **unapproved and unscanned** until evidence proves otherwise. Null counts signify "never measured", not "zero jobs".

## Two different evidence streams

### Stream 1: Individual job-posting metadata

Use only an approved CSV/JSON/JSONL export matching `templates/hiring-observations.csv`:

```sh
npm run hiring:import -- exports/approved-postings.csv --from=2025-10-08 --to=2026-10-08
npm run hiring:import -- exports/approved-postings.csv --from=2025-10-08 --to=2026-10-08 --commit --rights-confirmed
```

The dry run reports rejects, review cases, duplicates and retained postings. On commit it writes `.local/hiring/postings.jsonl`, `.local/hiring/employers.json` and import audits. It does not modify `markets/organizations/organizations.json`.

A direct company posting shows **an advertised vacancy**, not an actual hire. Agency listings require a specifically sourced, identifiable end employer; otherwise the end employer is unknown. An industry inferred from an advertised job category stays a proposal.

### Stream 2: Historical aggregate company reports

An authorised Adzuna Intelligence `hiring-employers` export has documented `data` entries with `company.name`, `posting_count`, optionally a provider `company.id` and industry label, and a possible `sample_size`. It does **not** contain individually dated job records. Its reporting window comes from the actual licensed query.

```sh
npm run hiring:aggregate -- exports/adzuna-hiring-employers.json --from=2025-10-08 --to=2026-10-08 --report-id=licensed-report-123 --source-reference=contract-or-provider-export-id --rights-confirmed
npm run hiring:aggregate -- exports/adzuna-hiring-employers.json --from=2025-10-08 --to=2026-10-08 --report-id=licensed-report-123 --source-reference=contract-or-provider-export-id --rights-confirmed --commit
```

The adapter validates the documented shape and returns a distinct row for every reported employer; it does **not** impose a top-10 cap. Candidate entities are provisional until independently reviewed. The `sourceIndustryLabel` is a vendor-proposed classification, not a verified company sector. It stores each report window separately and **never sums overlapping period-wide counts**.

Do not run this command on an arbitrary Adzuna search response; it requires the specific *historical employer report* JSON schema. **Whether Adzuna Intelligence actually makes a South African report available under a licence to Talent Tree is not yet established.** A working API response and commercial reuse terms must both be verified. No vendor credentials have been configured here.

## Identity and controlled promotion

The existing canonical registry is `markets/organizations/organizations.json`. Importing hiring evidence does not automatically add companies to it. Reviewers must establish identity, country relevance, industry, and the supporting source, then promote approved company facts via `npm run organizations:import -- FILE`, with dry-run/QA before `--commit`.

A bank vacancy is not evidence that the employing bank operates in recruitment services. Source-specific posting occupation, provider-industry label, and company activity belong in three separate fields.

## Coverage and QA

Capture source rights and expiry, country, initial report window, query parameters, number of rows and employers, job-level versus aggregate scope, whether results are capped, pagination completeness, number of unknown employers, refresh cadence, source errors and review backlog.

Zero results from a scan are not proof of no vacancies. A failed scan must not be treated as complete. A backfill for just one source does not justify claiming a national census. See `docs/national-employer-intelligence.md` and `docs/historical-hiring-source-assessment.md`.

Before merge, run `npm test`, `npm run build`, `npm run smoke:routes` and `npm run audit:ui`. Do not publish a source dataset as part of ordinary CI.
