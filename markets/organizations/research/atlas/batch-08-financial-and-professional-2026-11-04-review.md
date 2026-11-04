# Batch 08 review — financial services and professional services — 2026-11-04

Batch: `batch-08-financial-and-professional-2026-11-04.jsonl`
Scope: the next highest-value companies on the coverage queue (Nedbank 197 people, PwC South Africa 84,
Discovery 56, Sanlam 49).

## Outcome

- 9 rows, 9 matched, **4 organisations updated**, zero new organisations, zero conflicts.
- Verification requested for 4 and **granted for 4**; zero refusals.
- Commit quality gate: **zero errors, zero warnings**.

| Company | What changed | Source basis |
| --- | --- | --- |
| Nedbank | Legal name, Sandton head office, verification | Nedbank personal-banking contact page |
| Discovery | Sandton head office, verification, business structure note | discovery.co.za contact page |
| Sanlam | Bellville head office, verification, context note | sanlamonline.co.za about page |
| PwC South Africa | Legal name, Johannesburg office, 14-office site count, verification | pwc.co.za offices directory |

## Evidence decisions

- **PwC's legal entity is now recorded as PricewaterhouseCoopers Inc**, taken from its own office
  directory rather than inferred from the trading name. Its fourteen South African offices are counted
  from the same page and scoped `south-african-operation`, not firm-wide.
- **Sanlam's R218bn is new business volume, not revenue.** It is recorded in the note as context and is
  deliberately **not** used as a scale measure, because it would be read as turnover by anyone scanning
  the dossier.
- **Discovery's group structure is stated, not inferred.** Its own page lists Discovery Health, Vitality,
  Bank and Insure as distinct businesses. Discovery Health Medical Scheme is a separate scheme that
  Discovery Health administers, so the two are explicitly not merged.
- Every address is a first-party "head office" or "physical address" statement on the company's own
  site, not a directory listing.

## Deliberately not done

- **No headcounts recorded for any of the four.** None of these pages publishes an employee number, and
  the aggregator figures available for them disagree with each other by thousands of people.
- **Sasol, EY, KPMG and Shoprite were attempted and failed.** Their official about/contact pages returned
  either a 404, an empty body or a page without an address. They stay unenriched rather than being
  filled from a secondary source.
- **No corporate relationship recorded** between Old Mutual and Old Mutual Finance or between WBHO and
  its Cape division, because that needs a source describing the relationship, not a name that nests.

## Verification

- `npm run organizations:import` dry run, then commit: zero issues, zero conflicts.
- `npm run validate:organizations`: zero errors, zero warnings.
- Coverage ledger: verified 191 → 195.
