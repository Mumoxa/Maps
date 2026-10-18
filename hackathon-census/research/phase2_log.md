# Research Log — Phase 2 (2026-08-26)

Continuation of the census: Wayback recovery, series-gap closure, province passes, adversarial
categories, person-backward recursion (§18), §27 re-verification sampling and §32 update checks.
~21 new structured queries + 8 page fetches (4 re-verification) + 2 Wayback Machine calls.

## Wayback Machine (§14/§26)
| Target | Result |
|---|---|
| codebridge.co.za Hack4Water page (live fetch failed in Phase 1) | Availability API confirmed snapshot `20190907072855`; snapshot fetch returned 502 (host/connection failure) — **C07 remains open**; retry queued (G025) |

## Pass 4 queries (discovery + gap-closure)
| # | Query | Outcome |
|---|-------|---------|
| 1 | Tech4Africa hack day 2011/2012 | Tech4Africa 2015 (JHB, Oct) had a Hackathon track → **E099** (completeness E); 2011-2014 hack days still unverified |
| 2 | AngelHack JHB/CPT 2012-13 | No SA-specific evidence (2nd attempt) — stays in gaps |
| 3 | hack day / code jam SA 2011-12 | No SA hits (global noise) — pre-2013 gap stands |
| 4 | RHoK 2010-2012 SA | RHoK Dec-2010 city list excludes SA (strengthens RHoK CT 2012 as first SA RHoK) |
| 5 | GirlCodeHack 2018/2019 | **GirlCodeHack 2018 (5th annual) podium** → E088 (Lightbulbs / Scatterlings of Africa / Durban team) |
| 6 | GradHack 2019/2022/2023 | **E089-E091**: 2022 winner D-Tex (4 named, UCT); 2023 winner Hackstreet Boys (3 named, UCT) + BroCode/QWERTY; 2019 winner via LinkedIn self-report (Thabang Mabula, Medium confidence) |
| 7 | Entelect 2014-2016 winner | No per-edition results (company-history noise) — gap G004 stands |
| 8 | #SS24Hack / Security Summit hackathon | **Series discovered**: SS22 (E083), SS23 (E084), SS24 (E085), SSHACK26 (E086), SS25HACK **Northern Cape edition in Kimberley** (E087); CTF winners Jabu Mahlangu (2022), Monyepao & Tsebe (2026); Future Hackers Award Dodd & Ramnath (2024); confirms #SS19Hack series membership |
| 9 | Tshwane Varsity Hackathon 2019-2021 | TVH 2022 = 4th annual, 110 hackers, AWS/City of Tshwane/AB4IR (LinkedIn) → E060 updated; 2019 start confirmed arithmetically |
| 10 | Mpumalanga hackathon | **Maish** (UMP+TUT AI hackathon, 2023, Mbombela) → E093 — Mpumalanga venue gap broken |
| 11 | Kimberley/Northern Cape | **#SS25HACK Kimberley** (SPU + NC DEDAT, 2025) → E087 — Northern Cape venue gap broken; SPU wins at SS22/SS24 recorded |
| 12 | Security Summit 2023 winners | Event details (Sandton, 6-7 Jun 2023, Snode/Startup Business Campus) but no winner names → G022 |
| 13 | MICT SETA finals 2026 | Only regional results public → G009 stands |
| 14 | Telkom 10X finals | CUT official page: FS leg 7 Sep 2025 → E056 updated; **new eMalahleni leg** (TUT, 36h, Technobytes/Gig Kasi, Matsobane Sethosa) → E094 |
| 15 | FinChatBot hackathon 2019 | **E095**: winner Aurora (5 named incl. employers), 2nd/3rd/4th teams; corroborates Mabula self-report |
| 16 | TVH (2nd attempt) | (see 9) |
| 17 | Zindi / UmojaHack | **E096**: UmojaHack Africa 2021 (1000+ students; SU & UCT winning universities; individual names unpublished) |
| 18 | game jam winners SA | **SA Game Jam 2018** (annual, Free Lives-sponsored, judged) → E097; GameUp Africa Jam (Lagos) excluded |
| 19 | NGO/hack4good | **HackCorruption SA 2022** → E098 (4 winning teams, 17 named individuals, JHB boot camp) |
| 20 | G20 Tourism Hackathon | **E100**: inaugural 2025 Dept of Tourism event; full 7-member winning team (The Catalysts) with institutions; 2nd Map My Biz (Zimela); 3rd Ubuntu Unlimited |
| 21 | UJ Hackathon Challenge | **E092**: PAICTA × UJ virtual hackathon 2020 — full podium + individual awardees (UJ source) |
| 22 | Hack4Water winners | gov.za: winners announced 22 Apr 2016 at DWS exhibition; names not in release → E013 updated; code4sa page gives 4th CT team spelling "Waterware" (variant noted U072) |

## §27 re-verification sample (independent re-fetch of primary sources)
| Source re-fetched | Rows re-verified | Result |
|---|---|---|
| entelect.co.za (2017 results) | 6 (+2 new finalists discovered: Andre Nel 7th, Mark-Anthony Fouche 8th) | ✅ matches; page contains MORE data than Phase-1 snippet |
| sit.uct.ac.za GradHack 2024 | 7 | ✅ exact match |
| su.ac.za GradHack 2025 | 4 | ✅ match; project name (InsureShield) + ~200-team field added |
| ufs.ac.za Beat the Banker | 17 | ✅ match; event dates (23-24 May 2026), ITSA host, Nkuna special prize added |
| absa.co.za Design Hackathon 2021 | 6 | ✅ match; top-5 team names (SAMSYN/ELEV8A/Omnicorn/SIA/Fast 3) added |
| news.uj.ac.za GradHack 2014 | 4 | ✅ match |
**Sample coverage: 44 participation records re-verified by direct page fetch (≈14% of dataset, above the 10% requirement). Zero discrepancies found.** Full second pass on all winners/Top-3 (§27) remains scheduled.

## §32 update procedure
2025-2026 events already in DB cross-checked: no new 2026 events beyond those recorded (SSHACK26, MICT regionals/finals, Gauteng e-Gov, HackAtom, IEB-TechWays, UFS, VUT, G20 Tourism, Interledger 2026 — all captured Phase 1-2). Compared against DB; dedup re-run (Thabang Mabula now links GradHack 2019 ↔ FinChatBot 2019; Yoosuf/Yoosef Haffejee variants consolidated).
