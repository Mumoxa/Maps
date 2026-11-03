# Construction footprint enrichment review — 2026-11-03

## Import result

Batch: `batch-04-construction-footprint-2026-11-03.jsonl`

- 30 research rows reviewed and matched.
- 16 existing organisations updated; no organisations, relationships or associations created.
- 10 organisations now carry 24 sourced scale measures in the visible `CON-CONTR` branch.
- Six further records received source/status or entity-scope research notes without a scale claim: Murray & Roberts, ASLA Construction Group, WBHO Cape Division, Raubex Building, GVK-Siya Zama Cape and Power Construction.
- Dry-run: 30 matched rows, zero unmatched names, duplicates, conflicts, missing values or issues.
- Commit quality gate: zero errors and zero warnings.
- Immediate second commit: `unchanged`; no file rewrite and no second audit record.
- Final register diff check: only the 16 reviewed records changed; register order and every other record remained unchanged.

## Verification

- Focused importer and footprint regressions: 39/39 passed.
- Canonical company-model tests: 11/11 passed after updating the old five-metric/one-record-per-metric assertions for dated, entity-scoped measures.
- Full `npm test`: 328/328 passed. The route-mount helper now reuses one Vite server per test-file process and releases each React root; this removed the repeatable esbuild `EPIPE` resource failure without changing route assertions.
- `npx tsc -b --pretty false`: passed.
- `npm run build`: passed, including market, contact, employer, organisation and taxonomy validation. Organisation validation reported zero errors and zero warnings.

## Visible-branch coverage

The Atlas builder reports the following for `CON-CONTR` after import:

| Measure | Before | After |
| --- | ---: | ---: |
| Companies | 184 | 184 |
| With sourced scale | 1 | 10 |
| With an established indicative footprint | 1 | 8 |
| Footprint not established | 183 | 176 |

Established bands after import: three major-national, two large/multi-site and three regional-specialist. The remaining 176 are missing comparable evidence, not inferred to be small.

## Measures imported

- **WBHO Group:** FY2026 employees, revenue and order book; consolidated-group scope.
- **Raubex Group:** FY2026 employees, total workforce including indirect employees, revenue and order book. Employees and total workforce remain separate.
- **Stefanutti Stocks:** FY2026 group workforce, South African employees, contract revenue and current order book. The order-book row uses the specific R17.2 billion “current order book” disclosure in the 2026 Shareholders’ Information; the differently worded R15.6 billion “group order book” text in the Integrated Report was not merged into it.
- **Aveng:** FY2025 employees, plus separately dated FY2026 revenue and work in hand. The later financial metrics do not make the headcount a FY2026 figure.
- **Concor:** 1,600+ employees and 2,000+ completed projects from official pages; both counters are explicitly undated. The 3,046 homepage counter is LTI days and was not imported as projects.
- **Isipani Construction:** 472+ employees and 1,116+ completed projects from its official Our People page; both counters are explicitly undated.
- **Esor:** official group staff complement in excess of 400; no revenue inferred from contract values.
- **Motheo Construction Group:** 90,000 homes and counting from the 2025 profile, and cumulative completed-project value exceeding R7.5 billion. These are delivered-output measures, not current headcount or annual revenue.
- **Enza Construction:** probable 501–1,000 LinkedIn company-size band. Linked-profile counts were not treated as workforce totals and historical project values were not treated as current revenue.
- **Power Group:** historical 50,000 houses reported in the Power Developments section of the 2019 group brochure, explicitly scoped to that operating division and not attributed to Power Construction.

## Status and entity-scope decisions

- WBHO, Raubex and other consolidated measures were not copied to WBHO Cape Division, Raubex Building or any other operating entity.
- GVK-Siya Zama’s group profile does not establish a current workforce figure for the Cape legal entity; its Cape record remains unclassified.
- Power Group’s own site distinguishes Power Construction and Power Developments. Group/development output was not used as Power Construction headcount.
- ASLA’s official site supports Strand and George offices and construction/development/plant operations, but not a current company-wide headcount or revenue figure.
- Murray & Roberts received no current operating-scale claim. The 28 October 2025 SENS announcement says the final winding-up order pertains solely to Murray & Roberts Holdings and that downstream Murray & Roberts Limited was separately under business rescue. The official SENS index separately lists JSE listing removal on 23 December 2025. FY2024 figures remain historical and were not imported as current scale.

## Leads deliberately not imported

- **Motheo headcount:** third-party pages variously report 422, 415, 343 and 309/visible-profile figures, with stale executive information in places. The conflict is unresolved; official delivered-output evidence is used instead.
- **Grinaker-LTA:** current third-party estimates and LinkedIn bands conflict materially with one another and with the older 2019 disclosure of approximately 4,000 employees. The official homepage returned 403 during review. No current headcount was selected.
- **Power Construction:** LinkedIn’s company-size lead sits in broader Power Group context and does not establish the operating entity’s current workforce.
- **ASLA, GVK-Siya Zama Cape and other private companies:** no suitably scoped current workforce/revenue disclosure was established. Unknown remains unknown.
- **Project-site labour and LinkedIn profile counts:** never substituted for company-wide employment.
- **Order books, work in hand, completed-project values and housing output:** never substituted for annual revenue or used alone to assign a cross-industry footprint band.

This is an evidence coverage improvement, not a claim that all 184 private-company footprints have been researched. The reviewed source batch and canonical evidence records are the handoff for the next research pass.
