# Batch 15 review — fishing and packaging — 2026-11-04

Batch: `batch-15-fishing-and-packaging-2026-11-04.jsonl`
Scope: Oceana Group and Nampak.

## Outcome

- 6 rows, 6 matched, **2 organisations updated**, no new organisations, no conflicts, no issues.
- Verification requested 1 (Oceana), **granted 1**, refused 0.
- Quality gate after commit: zero errors, zero warnings.

| Company | What changed | Source basis |
| --- | --- | --- |
| Oceana Group | Legal name, aliases, head office, employee count, vessel and facility footprint, verification | oceana.co.za contact and about pages |
| Nampak | Legal name, aliases, head office, business description | nampak.com contact and overview pages |

## Two records where the company contradicts the directories

### Oceana's head office is in Observatory, not where aggregators say

Oceana's own contact page gives its head office as **3rd Floor Bridgeside East, Riverlands, 12
Gogosoa Street, Observatory, Cape Town, 7925**, switchboard +27 21 410 1453. Third-party profiles
still carry an older Oceana House address. The company's current statement is what the record holds.

Its scale is from the same estate: **nearly 4 000 employees** across South Africa, Namibia and the
United States (`consolidated-group`), **54 vessels and 8 production facilities across three
countries**, selling into 41 customer countries. Those are the company's own figures, dated to the
page check rather than to a report period, and the record says so.

### Nampak's head office is in Cape Town, and it is deliberately left unverified

Nampak's own contact page puts its head office at **Office G6, 1 Waterhouse Place, Century City,
7441** — while the same page gives a Johannesburg-adjacent postal address and several of its plants
sit in Gauteng. The record holds the head office the company states, not an assumed Johannesburg one,
and a note explains the split.

**Nampak is not verified, and the reason is not laziness.** Its own pages state **neither a legal
entity name nor a headcount**. The verification gate requires the company to describe itself on its
own domain across identity, sector and a located operation; two of those are satisfied, and a legal
entity name is not something to be inferred from a logo. Guessing one to clear the gate would be
exactly the failure the three-status model exists to prevent, so the record stays at
`needs-verification` with the reason written into it.

## Carried forward

- **Nampak's taxonomy was wrong at the time of this batch** — filed under `MFG-PLAS` (Plastics, Rubber
  & Packaging) when the company describes itself as a focused **metals** packaging business. It was
  corrected in batch 19 once a metals-packaging node existed to correct it *to*.
