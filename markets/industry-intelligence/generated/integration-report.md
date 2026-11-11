# Industry Intelligence Integration Report

Generated on 2026-11-11.

## Implemented

- Separate external-body model in `src/data/industryIntelligence/types.ts`; existing company-to-company sourcing associations and canonical organization records are not rewritten.
- Reproducible expanded inventory with 2,475 application organizations and 256 additional exact source-name-only identities.
- 24 body records, 657 directory rows, 662 external relationships, 10 dated public leadership rows, 6 recruitment briefs and 592 brief-specific classifications.
- 438 proposed-company records remain quarantined from the canonical organization register.
- Lazy-loaded `/industry-bodies` Explorer with body directory, company map, member directory, recruitment networks, leadership, coverage, search/filter, official evidence links and filtered CSV export.
- Shared generated JSON feeds the application and machine-readable deliverables; eight CSV exports are independently row-count checked.

## Data-quality controls

- Exact or explicitly reviewed identity matches only; ambiguous names are quarantined.
- Parent membership is not inherited by subsidiaries. Legal entities and source-reported business units retain their directory names.
- Producer/operators, suppliers, contractors, associations, institutions and professional-services participants are separate.
- BASA voluntary membership, CODI compulsory participation and Prudential Authority regulation are separate relationships.
- ASPASA 2025 artwork and MANCOM roles are Historical. SATURC ASPASA membership is Unknown. No historical Afrimat membership is transferred to SATURC.
- IQSA represents individuals. MHSC is statutory and tripartite. FSCA/DMPR regulation is not association membership.
- Tier 1 is never assigned automatically to a supplier, association, professional-services firm, educational institution or unresolved/proposed identity.

## Refresh and verification

1. Review the official source and record its publication/effective date and retrieval date.
2. Update the appropriate file under `markets/industry-intelligence/source/`. Do not import personal contact fields.
3. Run `npm run intelligence:build`.
4. Run `npm run intelligence:validate`, `npm test`, `npm run build`, `npm run smoke:routes` and `npm run audit:ui`.
5. Review `progress-manifest.json` and `generated/coverage-report.md`; incomplete batches must remain explicitly incomplete.
6. Use the active-branch reviewed pull-request workflow. Generation and validation do not deploy.

## Known source discrepancies

- SAIA narrative: 55 members; retrieved linked rows: 53. Only 53 rows are saved.
- CODI narrative: 34 institutions and 5 co-operative banks; retrieved table: 33 rows and 4 co-operative-bank rows. No fifth institution is invented.
- PA locally controlled register prints FIRSTHAND BANK LIMITED. The source spelling is preserved and identity is unresolved.
- MBAWC exposes a 25-company new portal, a separate 346-result legacy search and a 120-page 2025 PDF. Only the 25 new-portal rows are marked Confirmed in this batch.
