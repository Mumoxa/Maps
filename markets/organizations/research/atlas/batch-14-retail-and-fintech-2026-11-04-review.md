# Batch 14 review — retail and fintech — 2026-11-04

Batch: `batch-14-retail-and-fintech-2026-11-04.jsonl`
Scope: TFG and M-KOPA.

## Outcome

- 7 rows, 7 matched, **2 organisations updated**, no new organisations, no conflicts, no issues.
- Verification requested 2, **granted 2**, refused 0.
- Quality gate after commit: zero errors, zero warnings.

| Company | What changed | Source basis |
| --- | --- | --- |
| TFG (The Foschini Group) | Legal name, aliases, head office, employee count, outlet count, verification | tfglimited.co.za contact, about and TFG Facts pages |
| M-KOPA | Legal name, aliases, South African office, verification | m-kopa.com contact and home pages |

## Evidence decisions

### TFG carries a real, unresolved discrepancy

TFG's own TFG Facts page reports **50 800+ employees as at March 2026**. A separate figure on the same
estate reports **38 329 employees for TFG Africa**. These are not the same measure — one is the group
across 24 countries on five continents, the other a regional segment — but the page does not state
that relationship explicitly enough to compute one from the other.

Both figures are recorded and the record states the discrepancy. **Neither was picked.** Averaging
them, or quietly choosing the larger because it flatters the record, would put a number in a scale
field that no source supports.

- The 50 800+ figure is scoped `consolidated-group` with `as at March 2026` as its date, because the
  page dates it — this is one of the few batch figures with a real as-of date.
- 4 900+ outlets and 40 brands are from the same dated page, also `consolidated-group`.

### M-KOPA changed what it is

M-KOPA now describes itself as a **smartphone and digital-finance business across five markets**, not
a solar home-system company. The record's aliases keep `M-KOPA Solar` so the roster's older spelling
resolves, but the description follows the company's current words.

- The South African office is **The Campus, Twickenham Block C, corner Main and Sloane Street,
  Bryanston, Johannesburg, 2021**, from its own contact page.
- 10 million customers across five markets and 35 000+ sales agents are recorded in the note as
  context. A customer count is not a headcount and was not put in a scale field.

## What this batch got wrong first, and how it was caught

M-KOPA was very nearly filed under `independent-power-production`, which resolves to the IPP niche. It
is not an IPP — it sells phones and credit. The taxonomy test caught the placement rather than a
reviewer, and the industry link that placement created was deleted from the record rather than the
test being adjusted to accept it.
