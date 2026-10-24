# MBAWC workbook import implementation plan

**Goal:** Preserve the complete supplied workbook and integrate its companies, general contacts and finance professionals into the existing Maps datasets, with evidence, deduplication and cross-view links.

**Architecture:** Use the canonical organization store and Accounting & Finance research store. Preserve the original workbook and a cell-level extract; use a reviewed identity map rather than fuzzy person merges. Keep personal contact details in the private Contacts dataset. Existing taxonomy discovery supplies company associations and recruitment targeting without fabricated corporate relationships.

**Constraints:** No invented qualifications, identity URLs, company scale or employee skills. Workbook claims remain labelled source-reported. General member contacts are not automatically accountants. Company postal locations are not person residences. Preserve existing IDs, source records and stronger evidence; retain merged records as rejected redirects so external references remain recoverable. No deployment or push is included.

## Implementation and verification

- [x] Add a failing acceptance check for all 346 member rows and 24 finance rows, source preservation, private contact mapping and canonical company/person links.
- [x] Preserve the workbook and extract every populated cell, hyperlink, sheet and row with the workbook SHA-256. Archive README content as source material, not instructions.
- [x] Add a repeatable dry-run/commit importer with explicit category-to-taxonomy mappings and reviewed identity resolutions. Enrich established duplicates without losing evidence; keep unresolved identity and employment conflicts visible.
- [x] Add sourced company-directory details to dossiers and company search. Keep contact PII in Contacts and expose the existing company-contact link.
- [x] Propagate the source cohort into Accounting & Finance filtering/global search and current company affiliations into the shared company universe without double counting.
- [x] Regenerate contact-employer reconciliation, accounting UI export and dedup index. Reconcile finance inventory outputs using its supported generator; report unrelated existing failures separately.
- [x] Run focused ingestion/merge tests, idempotence checks, full tests, build, route smoke and UI audit. Check actual browser search/filter results and company links. Review the final diff for lost fields, unsupported claims and unintended generated changes.

## Review focus

- Same-name people and parent/division companies must not be conflated without corroborating identifiers.
- NED, former employer and group affiliations must not become direct current employee claims.
- The two unconfirmed CA designations must not appear in the CA(SA) designation facet.
- Postal-code inferences and national reach flags must remain distinct from sourced addresses and measured company scale.
- Re-importing the same source must preserve IDs and produce no new records or audit churn.

## Completion evidence

The source import, identity reconciliation, directory/search seams and generated outputs are implemented. The complete test suite passes 312 tests with none skipped; the build and 21-route smoke check pass. Source hashes, all workbook cells, duplicate snapshots and re-import idempotence were independently reviewed. Browser checks exercise source-cohort/CA filters, imported aliases and company/contact navigation. The import guide records source-confidence and access-boundary limitations.
