# Hiring-observation staging area

This is an offline input ledger for job advertisements. It does NOT contain a completed scan of South African companies.

- source-registry.json tracks potential sources. Every listed source starts unapproved and unscanned; listing it is not proof of access, permission or coverage.
- postings.jsonl is created on the first approved import and retains the minimum job metadata only.
- employers.json is a derived employer-candidate summary. Do not edit it as the source of truth.
- import-audits/ is created on successful commits and records the selected dates, source distribution, rejects and review needs.
- Employers marked provisional and proposed industry labels need human evidence checks before promotion into ../organizations.json using the existing organization importer.
- An advertising agency is not the end employer. If client identity is not sourced, records remain unattributed.
- Company lookup by brand/trading name does not prove legal employing entity.

Example workflow (file must be obtained with rights appropriate to the public repo):

1. Prepare a CSV, JSON array or JSONL source export, using the header template in ../../../../templates/hiring-observations.csv.
2. Run npm run hiring:import -- /path/to/export.csv --from=2025-10-08 --to=2026-10-08
3. Inspect all rejects and review flags, and confirm that both data reuse and this destination are authorised.
4. Only then run the same command with --commit --rights-confirmed.
5. Run npm test and npm run build; review new data and import-audit files before publishing.

Never import applicant names, individual phone numbers, private recruiter notes, complete copyrighted job descriptions or credentials here. Confirm POPIA obligations separately for any personal hiring-stakeholder research. This directory is in a public repository.

The current source registry, importer and SIC sector list are infrastructure only. The 12-month historical backfill requires real approved exports or licensed APIs and an independently verified coverage report; there is no claim of a live scraper.
