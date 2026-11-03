# Construction footprint enrichment — 3 November 2026

## Acceptance criteria

- Enrich the established `CON-CONTR` organisation branch with sourced staff, financial, order-book and delivered-project measures; do not invent values for the remaining long tail.
- Keep every measure attached to the organisation and entity scope it actually describes. Group results must not flow into divisions or subsidiaries.
- Preserve source URL, publisher, source type, evidence basis, confidence, checked date and metric date. Historical operating figures and current legal-status notices must remain distinguishable.
- Leave unsupported headcount/revenue unknown. Conflicting third-party estimates are research leads, not confirmed facts.
- Reuse the canonical organisation register, evidence model, footprint derivation, reviewed importer and existing Atlas/dossier surfaces. Add general metric support only where construction intelligence requires it.
- Validate dry-run and committed imports, idempotence, schema/type checks, focused regressions and the production build before handoff.

## Implementation slices

1. **Evidence and scale model**
   - Extend scale metrics with explicitly labelled workforce, order-book and delivered-output measures (including total workforce, completed projects and homes).
   - Keep metric-level source/evidence metadata and entity scope; avoid encoding order books as revenue or completed projects as operating sites.
   - Add safe numeric parsing for currency multipliers, ranges and lower-bound wording. Do not derive a headcount band from mixed workforce measures or unrelated numbers in notes.

2. **Footprint derivation and presentation**
   - Derive workforce/revenue bands from supported measures only, with confidence sensitive to evidence basis.
   - Surface dated operating scale in the existing footprint card, Atlas inspector and organisation dossier; show unknown honestly where evidence is absent or conflicts.
   - Add concise intelligence notes for current/historical context and legal-status caveats without turning notices into verified operating facts.

3. **Reviewed import path**
   - Extend the existing organisation importer to merge all supported scale metrics, source-specific dates/evidence and research notes idempotently.
   - Preserve supplied source metadata instead of forcing every enrichment source to `recruiter-supplied`.
   - Add regression fixtures for multi-metric rows, repeated imports, metric dates, entity scope and source preservation.

4. **Reviewed construction batch**
   - Start with primary/current disclosures for WBHO, Raubex, Stefanutti Stocks, Aveng, Concor, Isipani and Esor.
   - Add delivered-project/development measures for Motheo, Isipani, Enza, GVK-Siya Zama and Power only where the entity scope is supportable.
   - Use clearly labelled third-party estimates only when a current, exact-entity source is usable; retain conflicts in research notes rather than manufacturing precision.
   - Represent Murray & Roberts' FY2024 figures as historical and its 2025 winding-up/delisting notices as status evidence, not as a current operating footprint.
   - Do not copy group measures to WBHO Cape, Raubex Building, GVK-Siya Zama Cape or other operating entities.

5. **Verification and audit**
   - Dry-run the batch, inspect every proposed change, commit through the importer, then repeat to verify idempotence.
   - Audit branch totals: sourced scale coverage, unclassified records, group/entity scopes, source types and metric dates.
   - Run focused tests, full relevant validation/typecheck and production build; inspect the Atlas route in a live preview if the workspace supports it.

## Explicit non-goals

- No unsourced completion of all 183 blank footprints.
- No automatic inference of employees from project-site labour, LinkedIn profile counts, order books, project values or CIDB grades.
- No new parallel company register or project database in this slice.
- No claim that historical FY2024 Murray & Roberts operating metrics describe a current continuing group.
