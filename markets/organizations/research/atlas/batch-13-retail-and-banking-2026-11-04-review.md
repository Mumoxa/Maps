# Batch 13 review — retail and banking — 2026-11-04

Batch: `batch-13-retail-and-banking-2026-11-04.jsonl`
Scope: Massmart Holdings and Investec, both carrying large mapped populations while unverified.

## Outcome

- 8 rows, **2 organisations updated**, no new organisations, no conflicts, no issues.
- Verification requested 2, **granted 2**, refused 0.
- Quality gate after commit: zero errors, zero warnings.

| Company | What changed | Source basis |
| --- | --- | --- |
| Massmart Holdings | Legal name, aliases, head office, website correction, store footprint, industry links, verification | massmart.co.za contact, about and home pages |
| Investec | Legal name, aliases, head office, group headcount, city footprint, verification | investec.com contact and about pages |

## Evidence decisions

- **The Massmart website was pointing at one of its own brands.** The record used `builders.co.za`,
  which is a Massmart retail banner, not the group. It is corrected to `massmart.co.za`. A recruiter
  reading that record was being sent to a hardware store.
- **293 stores in 8 sub-Saharan countries** is the group's own wording on its home page, scoped
  `consolidated-group`. It is a store count, not a headcount, and the record does not convert it.
- **Massmart's industry links were added from the group's own description** of its formats holding
  leading shares in general merchandise, liquor, home improvement and wholesale food, and of Jumbo as
  a food, liquor and general merchandise wholesaler and Shield as a voluntary buying association. The
  links follow the company's own words rather than a guessed sector.
- **Investec's "7,400+ staff internationally"** is scoped `consolidated-group` and is explicitly *not* a
  South African figure — the page says the business is staffed across its core geographies of the UK
  and South Africa.
- **Investec Limited versus Investec Bank Limited.** The bank, registration 1969/004763/06, is a
  licensed entity; the South African group entity named in Investec's own disclaimer is Investec
  Limited, which is what the record carries. `Investec Bank Limited` and `Investec plc` are kept as
  aliases, not as separate records, because the roster uses the names interchangeably for the same
  people.

## A note on the honesty of the numbers

Neither company's headcount answers the question a South African recruiter actually has — how many
people work here, in this country. Both records say which entity and which geography each figure
covers, and neither invents a local number to fill the gap.
