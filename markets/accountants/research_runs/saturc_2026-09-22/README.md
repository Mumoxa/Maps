# SATURC Senior Accountant research run — 2026-09-22

## Purpose
Structured preservation of the uploaded SATURC Western Cape finance-talent research for the Accounting & Finance market.

## Evidence handling
- `candidates.jsonl` contains all 100 workbook rows and preserves the 26 source fields in structured form.
- `verification_status` is deliberately `RESEARCH_EVIDENCE_ONLY`: the workbook mixes confirmed facts, source-derived statements, explicit inferences and screening questions.
- Inferred claims are **not** promoted to verified master facts merely because they appear in a scored candidate row.
- Raw source URLs are preserved exactly and a normalized HTTPS form is included where the input omitted the scheme.
- The research report's three `report_part*.md` files were byte-for-byte identical when concatenated to `full_report.md`; they are omitted as exact duplicates.
- `build_xlsx.py` is generation code, not market evidence, and is not copied into the data run.

## Files
- `candidates.jsonl` — 100 ranked candidate research records.
- `employer_universe.md` — employer targeting universe and source URLs.
- `candidate_log.md` — raw candidate discovery log, including active and excluded names.
- `search_queries.md` — full query audit trail.
- `scoring_notes.md` — scoring method and exclusion audit.
- `full_report.md` — complete narrative report and appendices.

## Counts
- Final candidate rows: 100
- Workbook columns preserved per candidate: 26
- Research date: 2026-09-22
- Target role: Senior Accountant, SATURC, Durbanville / Northern Suburbs, Western Cape

## Canonical promotion rule
This folder is the auditable research layer. Canonical `people.jsonl`, `companies.jsonl` and `sources.jsonl` should only receive field-level facts that meet the Accounting & Finance qualification/evidence rules and after duplicate resolution against the master name index.
