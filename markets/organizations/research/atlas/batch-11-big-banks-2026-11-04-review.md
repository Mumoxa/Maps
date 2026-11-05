# Batch 11 review — big banks — 2026-11-04

Batch: `batch-11-big-banks-2026-11-04.jsonl`
Scope: the large-bank names the coverage ledger ranked highest that were still unverified.

## Outcome

- 9 rows, **3 organisations updated**, no new organisations, no conflicts, no issues.
- Verification requested 1 (Old Mutual), **granted 1**, refused 0.
- Quality gate after commit: zero errors, zero warnings.

| Company | What changed | Source basis |
| --- | --- | --- |
| Standard Bank | Legal name, aliases, head office, group headcount, country footprint | standardbank.com global locations and our-group pages |
| Old Mutual | Legal name, registered address, South African footprint, group headcount, verification | oldmutual.co.za about page |
| Absa | Legal name, aliases, business description | absa.africa contact and about pages |

## The entity question, which is the hard part of this batch

Three records here are **group** records with **licensed operating subsidiaries** underneath, and the
batch keeps them apart deliberately rather than folding everything into one "bank":

- **Standard Bank** is recorded as `Standard Bank Group Limited`. Its own global locations page gives
  the South African contact address as *Standard Bank of South Africa Limited*, 3 Simmonds Street,
  Johannesburg — a different legal entity. Both facts are recorded, neither is merged.
- **Old Mutual** is recorded as `Old Mutual Limited`. The South African site publishes *Old Mutual Life
  Assurance Company (South Africa) Limited*, registration 1999/004643/06, at Mutualpark, Pinelands —
  the licensed assurer. The group's own registered address happens to be the same Mutualpark campus,
  which is why one address serves both without the entities being conflated.
- **Absa** is recorded as `Absa Group Limited`, registration 1986/003934/06, JSE code ABG, issuer code
  ABGE, at Absa Towers West, 15 Troye Street, Johannesburg. Absa Bank Limited is named as a separate
  subsidiary and is **not** merged into the record.

## Scale decisions

- **Standard Bank's "over 54 000 people" is a consolidated-group figure** from its own careers panel,
  and is scoped `consolidated-group`. It is not a South African headcount and is not attributed to the
  South African bank.
- **Old Mutual's "over 27 000 people"** is likewise scoped `consolidated-group`, and its *"over 580
  locations and ATMs in South Africa"* is scoped `south-african-operation` — the only figure in this
  batch that describes the local operation alone.
- **No figure was taken from an aggregator.** Where aggregators disagreed with each other by more than
  13 000 people on Standard Bank, none of them was treated as a measure.

## Carried forward

- **Absa and Standard Bank still have no South African-specific headcount** from an official source.
  The group figures do not stand in for one, and the records say so.
