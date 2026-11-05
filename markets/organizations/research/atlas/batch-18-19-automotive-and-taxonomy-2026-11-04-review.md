# Batch 18–19 review — automotive and taxonomy — 2026-11-04/05

Batches: `batch-18-automotive-2026-11-04.jsonl` (3 rows),
`batch-19-nampak-taxonomy-2026-11-05.jsonl` (1 row)
Scope: BMW Group South Africa, and the taxonomy correction Nampak's record had been waiting for.

## Outcome

- Batch 18: 3 rows, **1 organisation updated**, verification requested 1, **granted 1**.
- Batch 19: 1 row, **1 organisation updated**, no verification requested.
- Quality gate after both: zero errors, zero warnings.

| Company | What changed | Source basis |
| --- | --- | --- |
| BMW Group | Legal name, aliases, head office, website correction, plant headcount, verification | bmw.co.za customer-support page, bmwgroup-werke.com Rosslyn plant page |
| Nampak | Taxonomy moved to the new `MFG-METAL-PACK` node | nampak.com/about/overview |

## BMW: four different things called "BMW", and only one is this record

The record is **`BMW Group South Africa (Pty) Ltd`**, whose own plant page dates the local company to
1973, when BMW AG took full shareholding. Three scope decisions are written into the record so its
figures cannot be misused:

1. **Global BMW Group figures never apply to it.** The group's numbers describe a German manufacturer
   with a South African plant; the record describes the South African operation.
2. **The ~2 800 employee figure is the Rosslyn plant workforce**, scoped `operating-division` — not the
   South African total, and not the group.
3. **The plant page's "over 49 000 livelihoods directly tied to our operations" is not a headcount.**
   It is an impact estimate. Recording it as scale would have made BMW the largest employer in the
   register overnight, on the strength of a sentence that does not claim to be an employee count.

The head office is **1 Bavaria Avenue, Ext. 17, Randjespark, Midrand, 1685**, from BMW South Africa's
own customer support page. The website was corrected from a plant microsite to `bmw.co.za`, the
corporate site.

**BMW Financial Services (South Africa) (Pty) Ltd** — FSP 4623, NCRCP2341 — is a separate registered
entity and is **not** merged into this record.

Verification rests on the plant page's own statements: Rosslyn was the group's first manufacturing
facility outside Germany, is the only plant in the global network building the BMW X3 as a plug-in
hybrid, and exported more than 96% of third-generation X3 output to over 40 markets.

## Nampak: adding a node rather than bending a record

Nampak sat under `MFG-PLAS` (Plastics, Rubber & Packaging). Its own evidence admitted why: **no
metals-packaging node existed** when the placement was made, and the company has since repositioned
onto metals, describing itself as a focused metals packaging business and the largest beverage-can
maker in South Africa and Angola.

The choice was between leaving a can maker filed under plastics, or adding the node the taxonomy was
missing. `MFG-METAL-PACK` (Metal Packaging & Cans) now exists under Metals, Steel & Fabrication.

Adding a node touches three generated artefacts, all regenerated: the committed outline, the JSON
Schema's node-id enum, and the schema's rule count.

## The defect inside this batch, which was mine

The first attempt at the taxonomy change used the header **`taxonomy_primary_node`**. That is not a
recognised alias — the importer's field is `taxonomy_node`. The importer **silently ignored it**, and
reported "1 organisation updated" while the taxonomy never changed.

A batch that says it succeeded and did nothing is worse than one that fails, because nobody goes back
to check. The importer now reports any field it does not recognise, naming the fields it does:

```
unrecognised field "taxonomy_primary_node"; it was not applied. Known fields: name, legalName, ...
```

Two tests hold it: a misspelled header is reported, and a correctly named one still applies cleanly.

## A location I invented, and removed

My first Nampak row also created a **"Cape Town"** location sourced to the overview page, which
describes the business and names no city. It was a guess placed in a sourced field, which is precisely
what the location rules forbid.

It has been removed. The head office stays as Nampak's contact page states it — Century City, Western
Cape — and the record notes the removal, because a fact should not be deleted any more quietly than it
was invented.
