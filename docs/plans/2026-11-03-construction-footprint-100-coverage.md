# Construction footprint coverage correction — 3 November 2026

## User correction and acceptance bar

The first construction enrichment was too small. The delivery target is now **at least 100 organisations in the visible `CON-CONTR` branch with sourced, entity-scoped, comparable scale evidence**. Research notes, source-only rows, test counts, order books and delivered-output context do not count toward this target. Employees, Rand-denominated revenue and evidenced site counts may support an indicative footprint under the existing classifier; every estimate remains labelled and reviewable.

## Research and implementation sequence

1. Audit the 184-company branch and exclude the ten records that already carry scale from the remaining-coverage queue.
2. Research exact-entity official disclosures first. Where those are unavailable, use a clearly labelled third-party company-size estimate only when the source identifies the organisation and the measure is a workforce/company-size band rather than a linked-profile count.
3. Record source URL, publisher/source type, evidence statement, metric date or explicit undated status, checked date, confidence and entity scope for every measure. Keep conflicting figures out unless reconciled.
4. Build reviewed JSONL batches through the existing importer. No group-to-subsidiary copying, project-labour inference, unsupported current-status claims or register reordering.
5. Dry-run and inspect the full plan, commit only clean batches, verify idempotence and audit the Atlas totals. Stop only when at least 100 companies have comparable sourced scale and an established indicative footprint, or report a concrete evidenced shortfall rather than padding the number.
6. Run focused regressions, the complete test suite, TypeScript, organisation validation and the production build. Document accepted sources, exclusions and remaining gaps in a batch review.

## Quality guardrails

- Quantity does not override evidence quality: no invented values and no silent use of stale or wrongly scoped estimates.
- LinkedIn company-size bands and linked-profile/member counts are different measures; only the former may be imported as an estimated workforce band.
- Undated website counters remain explicitly undated and are not presented as current-period disclosures.
- Historical figures retain their actual period. Revenue in a non-Rand currency is not compared against Rand thresholds without a sourced conversion.
- A probable third-party estimate remains probable in both the scale record and derived classification.
