# Register identity correction — 4 November 2026

## Why

The identity review queue only compared *dataset* names against curated ones, so it could not see the
worse case: the register itself holding the same company twice. A scan of curated names that nest
found three genuine duplicates, and a survey of one source added a fourth problem.

## Merges applied

Decisions live in `markets/organizations/identity-merges.json`, each with a reason, a source and a
review date. Applied by `npm run atlas:merge -- --commit`.

| Duplicate | Survives as | Evidence |
| --- | --- | --- |
| `org-pwc-south-africa` (PwC South Africa, 84 people) | `org-pwc` renamed **PwC South Africa** | PwC's own office directory names the firm PricewaterhouseCoopers Inc |
| `org-spar-group` (SPAR Group) | `org-the-spar-group` (The SPAR Group) | thespargroup.com about page |
| `org-shoprite-holdings` (Shoprite Holdings) | `org-shoprite` renamed **Shoprite Holdings**, gaining 168,000 headcount, Cape Town location and the grocery-retail industry link | shopriteholdings.co.za group page |

Nothing was lost: aliases, legal name, website, industries, taxonomy, capabilities, locations, scale,
directory entries, sources and datasets moved onto the survivor where the survivor had nothing of its
own, the duplicate's name became an alias so the old spelling still resolves, one corporate
relationship and one contact-manifest row were repointed, and the merge records itself as evidence
with its source on the surviving record.

Register: **632 → 629 curated organisations.**

## Deliberately not merged

- **`Old Mutual` / `Old Mutual Finance`.** The lender is a licensed operating company inside the group.
  Merging would move 8 real people onto the group record and tell a recruiter the wrong employer.
- **`WBHO Construction` / `WBHO Construction - Cape Division`.** A division, not a spelling. It needs a
  corporate relationship.
- **18 `Talisman Hire - <suburb>` records.** These are the same franchise written per branch. They are
  a data-shape question (one company with many branches, or many franchisees), not an identity
  question, so they are left alone until that is established. Merging them would assert a corporate
  structure nobody has evidenced.

## One decision reversed on evidence

The classifier first reported `Shoprite` vs `Shoprite Holdings` as `parent-subsidiary`, because
"holdings" was listed as a subsidiary qualifier. Reviewing the records showed both describe the
JSE-listed group, so "holdings" does not belong in that list. The qualifier table is data, so it was
corrected there rather than special-cased.

## Redirects

`markets/organizations/identity-redirects.json` keeps every merged-away id, and the company page
resolves through it. An old link, a saved dossier or an exported CSV still opens the surviving
company instead of dead-ending.

## Verification

- `npm run atlas:merge` dry run, then commit: 3 merges, 1 relationship, 1 contact row repointed.
- `npm run contacts:reconcile`: manifest rebuilt, 1,699 rows.
- `npm run validate:organizations`: **0 errors, 0 warnings**.
- `npm run validate:contact-employers`: 1,743 employer names → 1,699 records, zero unmapped.
- `npm test`: **370/370**. `npx tsc -b` clean. `npm run build` passes.
- One existing test referenced the merged-away `org-shoprite-holdings` id and was updated to the
  surviving id; the redirect test now covers that resolution path permanently.
