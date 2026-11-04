# Batch 10 review — Western Cape retail, banking and professional services

**Date:** 2026-11-04
**Records touched:** Capitec, Woolworths, Deloitte, Astron Energy, FNB (Batch 09)
**Files:** `batch-09-banking-2026-11-04.jsonl`, `batch-10-western-cape-and-professional-2026-11-04.jsonl`, `batch-10b-scale-supplement-2026-11-04.jsonl`

Verified count over the two batches: **195 → 199**.

## What each company gained, and from which page

| Company | Legal name | Location | Scale | Source page that states it |
|---|---|---|---|---|
| Capitec | Capitec Bank Limited | Stellenbosch, Western Cape | 16 900 employees, 880 branches (FY ended 28 Feb 2025) | `capitecbank.co.za/about-us/` |
| Woolworths | Woolworths Holdings Limited (reg. 1929/001986/06) | Cape Town, Western Cape | R84.5bn turnover and concession sales, consolidated group | `woolworthsholdings.co.za/disclaimer/`, `/` |
| Deloitte | Deloitte (was Deloitte & Touche) | Waterfall City, Gauteng | none sourced | `deloitte.com/za/en.html` |
| Astron Energy | Astron Energy (Pty) Ltd | Cape Town, Western Cape | 850+ service stations; 100 000 bbl/day refinery capacity | `astronenergy.co.za/about-us/` |
| FNB | First National Bank | Sandton, Gauteng | none sourced | `fnb.co.za` site footer |

## Decisions worth defending

**Capitec's address is its registered address, not its head office.** Its About us page labels
"5 Neutron Road, Techno Park, Stellenbosch" as *registered address*. Both are recorded
verbatim rather than upgraded to "head office", which the page does not claim.

**Woolworths' headcount is not group headcount.** The group site reports 35 541 employees
"across Woolworths" — the division, which also carries 300 fashion/beauty/home and 710 food
locations. The group number is **not published** on that page. Recording 35 541 as group
headcount would understate WHL by the whole Country Road Group, so only turnover is recorded
in `scale`, scoped `consolidated-group`, and the employee figure lives in the note with its
scope spelled out. R84.5bn is recorded as *turnover and concession sales*, never as revenue.

**Deloitte's legal name was corrected, not silently replaced.** The record carried
"Deloitte & Touche" as its legal name; Deloitte's own South African site brands the firm
Deloitte and describes the Africa partnership. The name is now **Deloitte** with the old
value retained as an alias, so nothing that pointed at "Deloitte & Touche" breaks. Deloitte's
headcount is not published on any page reached, so `scale` stays empty.

**Deloitte's Gauteng address is the weakest fact in the batch.** It comes from a statutory
third-country auditor register (FRC ZA3003), not from Deloitte's own office listing — every
`deloitte.com/za/.../offices` path tried returned 404. It is recorded as a sourced address
with that limitation in the note, and should be replaced when Deloitte publishes its own
office page. This is the one address in the batch not stated by the company itself.

**Astron Energy carries two scale measures deliberately.** The 850+ station network is a
retail footprint still being converted from Caltex branding; the 100 000 bbl/day figure is
refinery capacity. Neither alone describes the business, and the company states both.

**FNB is a division, not an entity.** Its own footer says "First National Bank — a division
of FirstRand Bank Limited", with registration 1929/001225/06 (NCRCP20). The note records
that so no dossier can present FNB as a separate registered company.

## Corrections found by the importer, not by eye

The first scale supplement was rejected with `unsupported entity scope "group"`. The
controlled vocabulary is `consolidated-group` / `south-african-operation` /
`operating-division` / `standalone-entity`. Resubmitted with the valid scope, 3 records
updated and 0 issues. This is the gate doing its job: a plausible-but-wrong scope never
reached the register.

## Still open on these companies

- Woolworths: group headcount, employee count for Country Road Group, taxonomy secondary
  nodes for financial services.
- Deloitte: own-site office address and headcount in South Africa.
- FNB / Capitec / Astron Energy: no capability links yet; `capabilities` and
  `relationships` remain the two emptiest fields in the standard.
