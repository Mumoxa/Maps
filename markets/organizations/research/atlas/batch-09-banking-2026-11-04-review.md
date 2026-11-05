# Batch 09 review — banking — 2026-11-04

Batch: `batch-09-banking-2026-11-04.jsonl`
Scope: FNB, which the coverage ledger still ranked unverified while carrying a mapped population.

## Outcome

- 2 rows, 2 matched, **1 organisation updated**, no new organisations, no conflicts, no issues.
- Verification requested 1, **granted 1**, refused 0.
- Quality gate after commit: zero errors, zero warnings.

| Company | What changed | Source basis |
| --- | --- | --- |
| FNB | Legal name, head office location, verification | fnb.co.za about-us page and site footer |

## Evidence decisions

- **FNB is not a legal entity and the record now says so.** The bank's own footer states that First
  National Bank is a **division of FirstRand Bank Limited**, registration 1929/001225/06, NCRCP20.
  The record carries that relationship rather than presenting FNB as a company in its own right,
  because a recruiter naming FNB as an employer is naming a division, and the register would
  otherwise imply a corporate structure that does not exist.
- **The address is the division's own published address** — 4 Merchant Place, corner Fredman Drive
  and Rivonia Road, Sandton, 2196 — not an address inferred from FirstRand's group filings.
- **Verification used one first-party page** for the three things the gate asks about: identity,
  the line of work, and a located South African operation. Nothing was taken from an aggregator.

## Carried forward

- FirstRand, as the listed group, is a separate record from FNB. No relationship between them has
  been asserted beyond what FNB's own footer states.
