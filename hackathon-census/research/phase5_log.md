# Research Log — Phase 5 (2026-08-26)

Trigger: user request to scan **zindi.world** + Phase-5 confirmation pass (Devpost pages, Wayback targets,
series winners). ~9 structured queries + 5 page fetches.

## Zindi platform scan (user-requested)
| Target | Result |
|---|---|
| zindi.world (landing) | Live platform confirmed: 100,000+ AI builders, 185+ countries, 590+ challenges, $1M+ prizes; partners Microsoft/Google/AWS/DeepMind/ITU. Recorded as source S128 + sources-searched row SS14 |
| zindi.world/competitions | Index is JavaScript-loaded — static enumeration impossible; extraction done per competition page |
| zindi.africa competition pages | Render fully — winners extracted per page |

## Zindi extraction results
| Item | Outcome |
|---|---|
| **UmojaHack Africa 2020** (#3, first pan-African) | **Geoffrey Frost (South Africa; final-year EE student, Stellenbosch University) — 1st place, Hotspots Challenge** — first fully-named SA UmojaHack winner (self-stated nationality on Zindi winner page). Date discrepancy 21 vs 22 Mar 2020 logged. "#3" numbering implies earlier UmojaHack #1/#2 events, unidentified → G033 |
| **UmojaHack Africa 2023** (18–19 Mar 2023) | Three track winners by username (Koleshjr; Team TheSun/Nebu/Azzo; Team DSTune etc.) + country-winners list: **"South Africa: Olayile"** — platform username, not deanonymised (U107) |
| **UmojaHack Africa 2022** | Winner identified via Zindi interview: **Victor Olufemi** (aka "Professor"); SA-connection not stated → U108, inclusion pending evidence |
| **ZindiWeekendz series** | Two scanned editions (Urban Air Pollution Apr 2020: 254 participants; Vaccination sentiment 2020: 222) — top-3 all non-SA; consolidated series row E115 |
| UmojaHack Morocco 2020 | Not SA — excluded |

## Other Pass-7 checks
| Item | Outcome |
|---|---|
| **Fetch** devpost.com/software/deephealth | DeepHealth creator = **Mabu Manaileng** ("started this project"); page "likes" deliberately NOT treated as team membership; no winner badge → E103 note, U106 partial |
| GirlCodeHack 2024 finishing order (G030) | Second source (ngopulse) still omits the overall winner — stands |
| Entelect 2019 | Comic Con Africa 2019 coverage confirms Worms game; winner still unnamed (KeenGamer added as contextual source) |
| hackjozi.com archive check | Availability API: **no snapshots exist** — G011 updated (domain unarchived) |

## Saturation ledger (Pass 8 = Phase 5)
New editions: 2 (UmojaHack 2023; ZindiWeekendz consolidated) · New people: 2 (Frost, Manaileng) · New unresolved: 3 (all platform-username or unverified-connection records, deliberately not guessed).
**Yield is now marginal on the queried surfaces. The remaining material gaps are structural (JS-only platform enumeration, unarchived domains, privacy-bound username resolution) rather than searchable — the census is at the practical saturation boundary of public-source research without owner-side data. A final confirmation sweep of series winners (GirlCode 2024 order, SS pre-2022, Entelect pre-2017) is the only outstanding discovery work.**
