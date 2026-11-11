# Research Coverage Report

Generated from saved output on 2026-11-11. **Status: verified partial coverage.** These figures are recalculated by `npm run intelligence:validate`; they are not manual estimates.

| Measure | Saved count |
| --- | ---: |
| Application organizations (curated + dataset-only) | 2,475 |
| Additional exact source-name-only identities | 256 |
| Expanded reconciled source universe | 2,731 |
| Existing identities with saved external-body research | 113 |
| Existing identities with a confirmed external relationship | 110 |
| Researched existing identities without a confirmed relationship | 3 |
| Pending existing identities | 2,618 |
| Industry-body records | 24 |
| Bodies with accessible lists or search directories | 18 |
| Association-member rows | 657 |
| Distinct directory identities | 614 |
| Additional member-company candidates discovered | 437 |
| Proposed-company records (including independent SATURC research) | 438 |

## Relationships by evidence status

- **Confirmed:** 549
- **Historical:** 68
- **Unverified:** 44
- **Unknown:** 1
- **Not applicable:** 0

## Populated body directories

| Body | Saved rows | Evidence scope |
| --- | ---: | --- |
| ASPASA | 66 | public-list |
| MINCOSA | 66 | public-list |
| GAIN | 1 | public-list |
| MBAWC | 25 | public-searchable |
| SAFCEC | 30 | public-limited |
| BASA | 29 | public-list |
| PA | 12 | public-list |
| CODI | 33 | public-list |
| ASISA | 113 | public-list |
| SAIA | 53 | public-list |
| SAPOA | 94 | public-searchable |
| SAREIT | 21 | public-list |
| Agbiz | 101 | public-list |
| Agbiz Grain | 13 | public-list |

## Scope notes

- Application universe reproduced from visibleOrganizations composition: 688 curated plus 1787 dataset-only organizations.
- The expanded source universe additionally reconciles Salesforce, data-science, hackathon, CA Western Cape, accountant-company and property-workspace source names. It is not asserted to exhaust every future or external organization.
- ASPASA operations and associates are Historical because the official artwork is undated and published under a 2025-03 upload path; no current complete ASPASA register was established.
- MBAWC contains 25 new-portal rows only. The separate 346-row legacy search and 120-page 2025 PDF were not fully re-extracted.
- SAPOA contains directory pages 1–5 only. SAFCEC rows are Unverified homepage-logo leads. CESA, DMPR, MHSC, FSCA, CGCSA and SARMA have no imported company rows in this batch.
- Recruitment tiers are brief-specific navigation aids, not universal rankings, candidate-suitability findings or proof of current employment.

## Identity warnings

- 6 ambiguous additional-source names were not auto-merged.
- Proposed and unresolved directory identities are not canonical Maps organizations and are excluded from application-company coverage numerators.
- Exact normalized source-name matching is not proof of legal identity; parent brands, subsidiaries and trading names require manual review.
- SAIA logo destinations and Minerals Council commodity/business-unit rows can differ from legal names; original directory names are preserved.

## Remaining-work manifest

| Batch | Status | Saved rows | Next action |
| --- | --- | ---: | --- |
| repository-inventory | completed-with-documented-source-limits | 2731 | Review additional-source aliases and any market files not composed by visibleOrganizations before calling the source universe exhaustive. |
| aspasa-proof-of-concept | historical-evidence-complete-current-register-pending | 66 | Obtain and inspect the linked 2026 map or a dated current company register; reconfirm producer, associate and leadership currency. |
| minerals-council | current-page-imported | 66 | Review legal entities for duplicate business units and associations; do not merge commodity units automatically. |
| financial-directories | current-pages-imported | 240 | Resolve bank/insurer legal entities and add specific PA/FSCA registers separately from membership. |
| property-directories | sa-reit-complete-sapoa-partial | 115 | Continue SAPOA at page 6; import SA REIT advisory members as a separate category if required. |
| agribusiness-directories | current-pages-imported | 114 | Import Agbiz Grain associates separately and reconcile GWK/VKB and other related legal entities. |
| construction-directories | partial-and-mixed-evidence | 55 | Resolve MBAWC pagination/API or extract the 2025 directory; obtain a row-level SAFCEC register; query current CESA members firm by firm. |
| regulators-and-professional-bodies | institutional-scope-established-company-links-pending | 0 | Add only company-specific current DMPR, FSCA, PA and certification records. Keep MHSC tripartite representation and IQSA individual membership separate. |
| cgcsa-and-sarma | no-row-level-current-register-established | 0 | Obtain a current member register or company-specific disclosures. Do not turn CGCSA board employers or old SARMA claims into current membership. |

The absence of a row is never treated as evidence of non-membership. Proposed and unresolved identities remain outside `markets/organizations/organizations.json`.
