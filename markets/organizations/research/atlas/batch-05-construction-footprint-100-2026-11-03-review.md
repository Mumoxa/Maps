# Construction footprint 100-company correction review — 2026-11-03

## Outcome

Batch: `batch-05-construction-footprint-100-2026-11-03.jsonl`

The expanded coverage requirement is met in the canonical register, not merely in the research batch.

- **94 reviewed rows updated 94 existing organisations.** No organisations, relationships, associations or intelligence records were created.
- Dry-run and commit both reported 94 matches, zero unmatched names, duplicates, conflicts, missing values or issues.
- Commit quality gate: **zero errors and zero warnings**.
- The written `CON-CONTR` branch contains **184 companies, 102 with sourced scale and 102 with an established indicative footprint**.
- **101 established companies have a known entity scope**. ASLA is additionally classified with its scope explicitly `not-stated`; it is not needed to meet the stricter 100-known-scope check.
- Exactly the 94 planned records changed. Register ID order and membership are unchanged.
- Reimport returned `unchanged`, rewrote no file and created no second import-audit record.

The independent machine-readable acceptance audit is `markets/organizations/import-audits/2026-11-03-batch-05-construction-footprint-coverage-audit.json`.

## Atlas acceptance counts

| Measure | After batch 04 | After batch 05 |
| --- | ---: | ---: |
| Companies in `CON-CONTR` | 184 | 184 |
| With sourced scale | 10 | **102** |
| With an established indicative footprint | 8 | **102** |
| Established with known entity scope | not separately audited | **101** |
| Footprint not established | 176 | **82** |

Final bands: three major-national, two large/multi-site, 27 regional-specialist, 70 smaller/emerging and 82 not established. The 82 unknown records remain unknown; they are not inferred to be small.

The branch now carries 118 sourced scale measures. The measures supporting the 102 classifications are 90 employee-driven companies, nine turnover-driven companies and three operating-site-driven companies. Context-only order books, work in hand and delivered output remain visible but do not create a band.

## Batch composition and evidence controls

- 82 employee rows, nine Rand-turnover rows and three operating-site rows.
- 28 source-reported and 66 third-party-estimate rows.
- Five confirmed and 89 probable rows. A self-reported directory band can remain probable when its date or reporting perimeter is not independently confirmed.
- 89 standalone-entity, four consolidated-group and one explicitly not-stated scope.
- Official disclosures were preferred where available. Directory estimates remain labelled as estimates, with exact source URLs, checked dates, metric dates or explicit undated status, scope and confidence in every row.

Historical disclosures retain their actual periods, including Farquharson (July 2017), Intertherm (September 2016), Ross Demolition (February 2020) and the Power construction footprint (July 2019). None is presented as a current 2026 headcount.

## Upper-bound turnover correction

Four exact-entity registry profiles report estimated annual turnover of **less than R1 million**: DKB Projects, N1 Construction Group's legal entity N1 Waterproofers & Decorators, SS Rhode, and Paragon Master Builders. The previous parser would have displayed the upper bound as though it were exact R1 million turnover, so these records were initially excluded.

The classifier now distinguishes a strict upper-only bound from a lower-bounded range:

- an upper bound no greater than R10 million can support only `smaller-emerging`;
- the basis says **“turnover below R…”**, never “turnover of R…”;
- a broader upper-only statement such as “less than R25 million” cannot choose between bands and stays unclassified;
- a range such as “R1 million but less than R10 million” still uses its stated R1 million lower bound.

These are probable third-party estimates, not audited revenue. The new regressions cover the narrow upper bound, broad-bound rejection and lower-bounded-range behaviour.

## Site and entity-scope decisions

- Motheo's September 2025 profile supports three distinct operating premises. Project locations, delivered homes and contract values were not counted as sites or converted into workforce.
- Power's July 2019 official brochure supports South, North and Coastal construction operating bases. Power Group and Power Construction carry explicitly separate scopes; no group employee figure was copied to the subsidiary.
- Two-office records were not used merely to inflate coverage where the resulting small-band reading would have been misleading.
- ASLA's 201–500 directory band is corroborated by a 242-person estimate at the matching Strand operation, but the directories do not establish the legal perimeter. Its scope therefore remains `not-stated`; the acceptance target is still exceeded without counting it toward the known-scope subtotal.
- Grenco's exact legal-entity turnover estimate is used independently. Its conflicting 11–50, 51–200 and 100–200 employee directory bands remain unmerged and do not drive the classification.
- Group figures were not copied to GVK-Siya Zama Cape, Martin & East Building, WBHO Cape Division, Raubex Building or other operating entities.

## Matching, conflicts and exclusions

- PDK initially appeared unmatched because the batch omitted its canonical `CC` suffix. The row was corrected to `PDK Civils & Construction CC`; no new organisation was created.
- Wrong-entity results were rejected, including foreign or unrelated companies for B&D, Cancun, Flanagan, N1's Australian namesake, Renov8, W Voigt Hydraulics and other same-name records.
- Renov8 Construction's workforce band is not attributed to Renov8 IT.
- Linked-profile/member counts, named team lists, project labour, jobs-created counters, contract values, CIDB grades and years of experience were not converted into organisational headcount.
- Unresolved employee conflicts were not silently averaged. Where a separate exact-entity turnover measure was available it stands on its own; otherwise the company remains unclassified.
- Less-than-R1-million claims are admitted only with the tested upper-bound semantics above. Non-Rand revenue and unsupported revenue conversions remain excluded.

The reviewed JSONL is the complete source ledger for the 94 accepted measures, including evidence statements and notes documenting material conflicts.

## Verification

- `node --import tsx --test tests/footprint-classification.test.ts`: **23/23 passed**.
- Full `npm test`: **331/331 passed**.
- `npx tsc -b --pretty false`: **passed**.
- `npm run validate:organizations`: **passed**, 632 organisations, zero errors and zero warnings.
- `npm run build`: **passed**, including market, contact, employer, organisation and taxonomy validation and the production Vite build.
- Final import reapplication: **`unchanged`**, with no rewrite or duplicate audit.
- Final independent Atlas audit: **102 sourced scale / 102 established / 101 known-scope**, exact 94-record changed set, order preserved.

This completes the requested 100-company coverage correction while leaving the remaining 82 unsupported companies explicitly unclassified.
