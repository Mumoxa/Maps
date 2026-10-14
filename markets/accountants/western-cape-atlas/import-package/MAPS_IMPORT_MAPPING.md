# Maps Import Package — Western Cape CA(SA) Atlas (prepared, NOT imported)

No production upload, bank import, or destructive migration was performed (brief §14).

## Inspected Maps schema (actual, not assumed)
- Research DB: `markets/accountants/people.jsonl` (`acc-NNNN`, see `markets/accountants/schema.md`), `companies.jsonl` (`cmp-NNNN`), `sources.jsonl` (`src-NNNN`). Append-only; dedup source of truth `people_index.md`.
- Existing CA(SA) export: `npm run accountants:casa-export` → `ca_sa_inventory.csv` (script `scripts/export-casa-inventory.ts`).
- UI: `people.jsonl → gen_people_json.py → people.json → src/data/accountantsPeople.ts → /accounting-finance`.
- Search Bank: `markets/search-bank/bank.json` via `npm run bank:import -- <file>` (template `templates/search-bank-drop.csv`); evergreen search name: **Western Cape | Chartered Accountants CA(SA) | Full Market Atlas | October 2026**.

## Field mapping (atlas CSV → Maps)
| Atlas column | Maps target |
|---|---|
| maps_candidate_id | `people.jsonl:id` (reuse; blank = new `acc-NNNN` on curator import) |
| first/last/full_name | `first_name`/`surname`/`full_name` |
| designation/designation_status | `professional_designations:["CA(SA)"]`, `designation_status`, `professional_bodies:["SAICA"]` |
| current_title/current_employer | `current_title`/`current_employer`; employer_canonical + maps_company_id → `companies.jsonl:id` |
| industry_primary/secondary | `current_industry`/`current_sub_industry` (repo taxonomy in `skills_taxonomy.md`; atlas industry families map: Accounting/Audit→Professional Services, Government→Public Sector — review on import) |
| function_primary/seniority_level | `current_role_family` / derived UI seniority (preserve original title) |
| city/province/location_status | `city`/`province` + `location_confidence` (CONFIRMED_WESTERN_CAPE→CONFIRMED; PROBABLE→HIGH; UNKNOWN→UNCONFIRMED) |
| linkedin_* | `linkedin_url` only when VERIFIED; score/status stay in atlas evidence |
| *_evidence_url, primary/additional_source_urls | `sources.jsonl` rows (`src-NNNN`, evidence_type per claim) + `primary_source`/`source_urls` |
| award_or_recognition/year | `notes` + source row (historical, never as current employment) |

## Import steps for a curator (when authorised)
1. Dedup new rows (WC26-*) against `people_index.md` by name+employer+LinkedIn.
2. Append to `people.jsonl`/`companies.jsonl`/`sources.jsonl` via a `batch_N.py`-style script using `db_lib.py`; never overwrite.
3. `python3 gen_people_index.py && python3 gen_people_json.py && npm run accountants:casa-export`
4. Optionally file primary CSV via prepared `search-bank-drop_western-cape-ca-sa-atlas.csv`: `npm run bank:import -- <file>` — creates the evergreen search above.
5. Gate: `npm test && npm run build && npm run smoke:routes && npm run audit:ui`.

## Validation done here
`build_atlas.py` asserts: unique candidate_id, unique non-blank LinkedIn URLs across primary+queue, primary ⇒ designation CONFIRMED + location CONFIRMED_WESTERN_CAPE, non-empty names. CSVs are UTF-8, header-exact per brief §11.
