# Independent X-Ray Search — Western Cape CA(SA) — 2026-10-14

Independent of the prior Western Cape atlas (which was left untouched). Method: 16 X-ray
queries (`site:linkedin.com/in` / `site:za.linkedin.com/in` × CA(SA)/Chartered Accountant ×
Cape Town, Stellenbosch, Somerset West, Paarl, Bellville, Durbanville, George, Hermanus,
Franschhoek, Worcester + title/employer/industry variants), run through public web search.
Public indexed snippets only — no LinkedIn login, scraping, or access-control bypass.

## Funnel (all rows recorded, nothing silently dropped)
| Stage | Count |
|---|---|
| Raw hits recorded (`xray_raw_hits.csv`) | 56 |
| Already in repo (URL or exact-name match) | 2 — Vanessa Rheeder, Zaakirah Davids |
| Excluded (outside WC / not CA(SA)) | 7 — Amsterdam×2, Johannesburg×2, UK, Bermuda, ACCA-only |
| Held (CA(SA) explicit, no WC location in hit) | 2 — Tshepo Phaka, Tshepo Khoza |
| Designation not literal in snippet (needs verification) | 2 — Craig Price, Ashley Francis |
| Name-only sidebar leads (no URL captured, never fabricated) | 19 — in `xray_deduped_candidates.csv` as NEW_NAME_ONLY_LEAD_NO_URL |
| **New to repo, imported** | **26 (acc-1025 → acc-1050)** |

## Import (deduplicated into the repo)
`markets/accountants/batch_14_xray_wc.py` (repo `db_lib` conventions, idempotent name+URL
guard) appended: 26 people, 24 net-new companies (Deloitte/PwC duplicates found in QA were
removed and employer strings canonicalised to `Deloitte (South Africa)` / `PwC (South Africa)`),
26 sources (`src-0994+`). Regenerated: `interim.csv`, `people_index.md`, `people.json`.
Whole-DB check: zero duplicate LinkedIn URLs.

**Evidence grade:** every import is `HIGH_CONFIDENCE` — CA(SA), employer and Western Cape
location are LinkedIn *self-reported* in the indexed snippet, not independently corroborated,
and current SAICA membership is not verified. Surname-only collisions (Smith, Swanepoel,
Coetzer, Dalvie, Gregory, Swart) were checked and not merged — different people.

## Honest gaps
George/Hermanus/Franschhoek/Worcester and several industry queries returned no usable
CA(SA) profile hits (only job ads/recruiters). Search engines cap snippet depth, so this is
a discovery floor, not a census: "every CA(SA) findable" means every one these X-ray
surfaces returned and passed the evidence screen. Name-only leads (19) are the next
verification queue — each needs its own profile URL found before it can enter the repo.

Files: `xray_search_log.csv` · `xray_raw_hits.csv` · `xray_deduped_candidates.csv` ·
`xray_new_to_repo.csv` · `raw_hits.py` (source data) · `dedupe_xray.py` (rerunnable)

Note: `npm run accountants:casa-export` could not be re-run in this sandbox
(node dependencies not installed, ERR_MODULE_NOT_FOUND) — `ca_sa_inventory.csv` should be
regenerated after `npm install` on a dev machine.
