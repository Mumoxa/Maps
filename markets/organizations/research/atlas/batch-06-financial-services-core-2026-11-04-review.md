# Batch 06 review — financial services core — 2026-11-04

Batch: `batch-06-financial-services-core-2026-11-04.jsonl`
Scope: the five financial-services companies carrying the most mapped people that the
coverage ledger ranked highest after the website backfill.

## Outcome

- 10 rows, 10 matched, **5 organisations updated**, zero new organisations, zero conflicts.
- Verification requested for 3 and **granted for 3** by the gate; zero refusals.
- Commit quality gate: **zero errors, zero warnings**.

| Company | What changed | Source basis |
| --- | --- | --- |
| Absa | HQ location, verification | Absa Group contact page (registered address), who-we-are page |
| Capitec | HQ location, employees, branches, verification | Capitec own about page, FY2025 key facts |
| Standard Bank | HQ location, verification | Standard Bank Group contact and our-group pages |
| Old Mutual | Legal name, group headcount | Old Mutual about page, registration footer |
| Investec | Group headcount | Investec about page |

## Evidence decisions

- **Only first-party sources were used.** Third-party aggregators disagreed with each other on
  Standard Bank's headcount by more than 13,000 people (51,200 / 50,316 / 64,919), so none of them
  was treated as a measure. Aggregator pages were used only to locate the official pages.
- **Capitec is the strongest record in the batch**: headcount and branch count are both footnoted to
  its financial results for the year ended 28 February 2025, dated and entity-scoped.
- **Old Mutual's 27,000-plus and Investec's 7,400-plus are group figures** (`consolidated-group`),
  not South African headcounts, and each says so in its note. Neither is attributed to a subsidiary.
- **Absa and Standard Bank have no headcount from an official source yet.** Their investor-results
  PDFs are the correct source and were not machine-readable here, so the field stays empty rather
  than being filled from an estimate. Both are recorded as verified on their identity, classification
  and location, which is what the gate tests; headcount is a coverage gap, not a verification gap.
- Standard Bank's own "our group" page states 21 in-country African operations, over 19.5 million
  active clients and R3.8 trillion total assets. Those are operating facts, not a workforce measure,
  and were not converted into one.

## Deliberately not done

- No headcount was derived from client counts, total assets or country counts.
- No South African-only headcount was inferred by splitting a group figure.
- Nedbank and FNB were left out of this batch: their official about pages returned no readable
  content to this tooling, and their directories-only figures were not accepted.

## Verification

- `npm run organizations:import` dry run, then commit: zero issues, zero conflicts.
- `npm run validate:organizations`: zero errors, zero warnings.
- Coverage ledger: verified 131 → 134; location 207 → 209; scale 139 → 142; footprint 130 → 133.
