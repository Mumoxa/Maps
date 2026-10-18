# Contact directory employer reconciliation — 9 October 2026

## Source and objective

The contact directory currently contains **5,070 unique contacts** across 13 JSON parts. These represent **5,599 employer-position entries** and **1,397 distinct original employer spellings**. Every contact has at least one sourced employer, and **176 contacts** have more than one original employer name in their positions.

Before this change, `datasetEmployers()` imported accounting-and-finance, Search Bank and optional credit-risk employers, but **not** contact-directory employers. Some contact employers were therefore absent from `/companies` unless they occurred in another dataset. That is a source-composition omission, not evidence that the companies do not exist.

## Implemented mapping

The new manifest `markets/organizations/contact-employers.json` is generated from **all 13 contact parts**, their original position company strings and the currently curated `markets/organizations/organizations.json` register.

| Measure | Reconciliation |
| --- | ---: |
| Unique source contacts | 5,070 |
| Position-employer records | 5,599 |
| Distinct original employer names | 1,397 |
| Distinct company entries after canonical and documented alias resolution | 1,358 |
| Matching existing curated company identities | 10 |
| Dataset-only company identities requiring further research | 1,348 |
| Contact records without a mapped company | **0** |

Those figures describe the **contact dataset**, not all the other company sources in Maps. The universal Companies directory adds these contact-linked organizations to its existing market data. Existing curated company IDs are preserved.

Each manifest row contains a canonical organisation ID, display name, **unique contacts at that employer**, and every original employer spelling that resolves there. The manifest contains no individual names, emails, phone numbers or contact IDs. Counts are de-duplicated by contact ID *within* each company. One person with sourced roles at two distinct companies appears once for each company; we do not claim which role was most recent unless separately established.

The UI now supports:

- **Companies:** searchable list and dataset filter `contacts`, with the 1,348 unverified employer names visible in the explicit **unclassified research backlog**.
- **Company dossier:** clear directory-contact count and a link that filters Contacts to all recorded employer spellings of that organisation.
- **Contacts:** a company-profile link on the primary and all other employer positions, including multiple-company contacts.
- **Preserved research rules:** position metadata such as company sector, size or website is NOT promoted into source-verified industrial taxonomy placement, audited business size, legal incorporation, or actual ownership. Dataset-only stubs remain `needs-verification`.

## Completeness and refresh contract

- Run `npm run contacts:reconcile` after importing/updating contacts **or** adding a curated company whose name or aliases resolve previously uncurated contacts.
- `npm run validate:contact-employers` recomputes the entire mapping from the source and fails if its counts, identifiers, or raw employer names differ from the committed manifest.
- This validator is a required part of `npm run build`; future contact imports cannot silently leave an outdated Companies directory.
- `tests/contact-company-reconciliation.test.ts` walks **every** source position and checks for a visible, navigable organization ID, accurate per-company unique-contact count, reverse-links and preservation of unverified status.

## Identity and industry qualifications

This establishes 100% **record-level accounting and navigation**, not 100% independently verified company identities or industrial classifications. Existing documented normalization rules can group a bank, an insurer and divisions under a parent-like name. These are **directory identity candidates, not evidence of an actual ownership relationship**. The original employer spellings remain preserved for follow-up work. Legal subsidiaries and similarly named unrelated businesses must be separated when sourced evidence establishes the distinction.

There is no evidence-based reason to assign the remaining **1,348** contact-only companies to specific national taxonomy branches yet. They should stay findable, labelled unclassified, and progressively researched using official websites, CIPC/company disclosures, sector publications and recruiter review. **Unknown must not become verified solely to make a chart appear complete.**
