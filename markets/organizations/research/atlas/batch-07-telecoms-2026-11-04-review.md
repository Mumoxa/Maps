# Batch 07 review — telecoms — 2026-11-04

Batch: `batch-07-telecoms-2026-11-04.jsonl`
Scope: the two mobile network operators carrying the most mapped people (MTN 91, Vodacom 121).

## Outcome

- 6 rows, 6 matched, **2 organisations updated**, zero new organisations, zero conflicts.
- Verification requested for 2 and **granted for 2**; zero refusals.
- Commit quality gate: **zero errors, zero warnings**.

| Company | What changed | Source basis |
| --- | --- | --- |
| MTN | Legal name, HQ location, group service revenue, verification | MTN Group contact page, MTN home page |
| Vodacom | Legal name, HQ location, group revenue, verification | Vodacom Group contact page, FY26 fact sheet |

## Evidence decisions

- **Both addresses are first-party registered-office statements.** MTN gives "registered office: 216
  14th Avenue, Fairland, Gauteng, 2195" on its investor contact page; Vodacom gives "Vodacom Corporate
  Park, 082 Vodacom Boulevard, Midrand" as its corporate office.
- **Vodacom's revenue is the strongest measure in this batch**: R167 652 million for the year ended
  31 March 2026, from its own audited-basis fact sheet, with the prior year's R152 227 million
  alongside it. Entity scope is `consolidated-group`.
- **MTN's R115.3 billion is explicitly H1 2026 service revenue**, not annual revenue and not a
  like-for-like comparison with Vodacom's annual figure. The note says so, so nobody sums them.
- **Neither company's headcount was recorded.** Vodacom's FY26 fact sheet reports customers,
  population coverage, ARPU and revenue but no employee number; MTN's site reports subscribers and
  service revenue but no employee number. Subscriber counts were not converted into any measure.

## Deliberately not done

- 317.7 million MTN subscribers and 237.3 million Vodacom customers were not treated as scale
  measures: they describe the market served, not the operating organisation.
- No "employees" figure was taken from a third-party directory for either company. Aggregators give
  group headcounts that cannot be reconciled to a dated disclosure here.
- No corporate relationship was invented between Vodacom and Vodafone, or MTN Group and MTN South
  Africa, because neither end of those relationships exists as a separate curated record yet.

## Verification

- `npm run organizations:import` dry run, then commit: zero issues, zero conflicts.
- Coverage ledger: verified 134 → 136; legal name 380 → 382.
