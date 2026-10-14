# Western Cape CA(SA) Talent Atlas — Coverage, QA & Audit Report

**Research date:** 2026-10-14 · **Geography:** Western Cape, South Africa · **Designation:** CA(SA) only (AGA/AT/ACCA/CIMA never substituted)
**Status:** Pass 1–4 baseline + targeted Pass 2/3/5 additions. **This is NOT a complete census and must never be described as one.** No authorised SAICA roster exists in this repo (see `markets/accountants/README.md`), and SAICA's member-verification service was not used for bulk data (brief §2.13). LinkedIn was used only via public Google-indexed snippets — no scraping, bypass, or CAPTCHA evasion.

## Headline metrics (reproducible: `python3 build_atlas.py`)
| Metric | Count |
|---|---|
| Existing Maps finance professionals reused | 1,024 (`people.jsonl`) |
| CA(SA)-tagged, non-rejected, in that DB | 159 |
| Western Cape province records among them | 58 (19 location-CONFIRMED, 37 location-HIGH→PROBABLE, 2 designation HIGH_CONFIDENCE) |
| CA(SA) with no location evidence → queue for WC investigation | 66 |
| New individuals verified in this pass (2026-10-14 web research) | 6 (4 primary, 2 queue) |
| **Primary verified CSV (`VERIFIED_*`)** | **23 people, 17 with verified LinkedIn URLs** |
| **Verification queue** | **107 people** |
| Evidence-ledger rows | 424 |
| Distinct employers (primary+queue) | 85 |
| Source-register rows | 15 |

Channel yield (new this pass): A SAICA Top 35 → Louw Barnardt (primary), Duval van Zijl (queue); F Pepkor board → Riaan Hanekom (queue); G firm pages → Iain Duthie, Heidi Smith, Smith (primary). All other primary/queue rows derive from the pre-existing, source-linked Maps research DB (channels A–I as logged in `sources.jsonl`, 993 sources).

## Verification rules applied (stricter than a name search)
- **Primary** requires designation_status=CONFIRMED **and** individual location_confidence=CONFIRMED (`CONFIRMED_WESTERN_CAPE`). Employer-HQ location alone (e.g. Pepkor, Parow) → PROBABLE → queue. This is why only 23 of 64 WC-linked records are primary: 39 WC records sit in the queue solely pending individual location confirmation, not because their CA(SA) is doubted.
- LinkedIn URLs are taken only from pre-verified repo records or a directly indexed personal profile matching name+employer+title+location (Louw Barnardt, score 100/100 per §7 rubric). Absent that: blank + `NOT_FOUND`. No URL was fabricated; no duplicate LinkedIn URL exists across primary+queue (asserted in code).
- Historical titles/awards stay in `award_or_recognition`/notes, never in current-title fields.

## QA performed
Programmatic asserts in `build_atlas.py`: unique candidate IDs; unique non-blank LinkedIn URLs; primary ⇒ confirmed designation + confirmed WC location; non-empty names. CSVs UTF-8, exact §11 headers, ISO dates, province `Western Cape`. Known residual issues (disclosed, not hidden): 10 primary rows have blank `industry_primary` where neither person record nor exact-match employer catalogue states an industry — left blank per §11 rather than guessed; `City of Cape Town / Paarl` (1 record) has an unresolved municipality; LinkedIn-sourced repo rows are self-reported for designation unless the repo notes show corroboration — flagged in `confidence_notes`.

## Coverage gaps — honest assessment
- **Geography:** Primary is Cape Town-metro heavy (19/23). Garden Route, West Coast, Overberg, Karoo have almost no confirmed individuals — only firm-level listings were found, which do not name CA(SA)s. This is a discovery gap, not evidence of absence.
- **Seniority:** Primary skews Manager→CFO; newly-qualified and Financial Accountant levels are under-represented (they are rarely published). Pass 5 LinkedIn-matrix discovery is the fix and is **not exhausted**.
- **Channels not exhausted:** Accountancy SA full archive, CFO Awards historical nominees, ABASA/AWCA lists, Big-Four/network partner pages (PwC/Deloitte/EY/KPMG/Mazars/Moore/PKF/RSM), UWC/CPUT alumni, JSE SENS beyond repo coverage, and the §5 Google matrix (town × title × industry) beyond seed queries.
- **Diminishing returns observed:** Firm-page and award searches repeatedly surfaced already-captured names (LDP, BDO Cape Town, Woolworths/TFG executives), suggesting visible-executive coverage is saturating while mid-level commercial finance is not.

## Refresh plan (§18)
Quarterly: re-run §5 matrix per town, re-scan SAICA Top 35 (new year), CFO appointments/SENS, firm partner pages; promote queue records only on new individual location/designation/LinkedIn evidence; preserve career history; re-run `build_atlas.py` + repo `gen_people_json.py`/`accountants:casa-export` after any curator import (see `import-package/MAPS_IMPORT_MAPPING.md`).

## Files
`western_cape_ca_sa_verified_candidates_2026-10-14.csv` (23) · `western_cape_ca_sa_verification_queue.csv` (107) · `western_cape_ca_sa_candidate_evidence.csv` (424) · `western_cape_ca_sa_employers.csv` (85) · `western_cape_ca_sa_sources.csv` (15) · `import-package/` (copies + search-bank drop + mapping). Evergreen Search Bank record prepared (not imported): *Western Cape | Chartered Accountants CA(SA) | Full Market Atlas | October 2026*.
