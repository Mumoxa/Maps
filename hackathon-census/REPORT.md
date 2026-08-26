# Final Research Report — South African Hackathon Participant & Winner Census
**Phase 2 • Research conducted 2026-08-26 • Status: not saturated (see §12 and `research/saturation_assessment.md`)**

---

## 1. Headline statistics (updated in Phase 2)

| Metric | Phase 1 | Phase 2 (current) |
|---|---|---|
| Hackathon editions in master table | 82 | **100** (evidence-backed + labelled consolidated/probable rows) |
| Unique named contestants | 255 | **309** |
| Participation records (person × event) | 267 | **322** |
| Winner placements (1st place / winning-team members) | 146 | **196** |
| Top-3 placements | 166 | **213** |
| Top-10 placements | 190 | **239** |
| Evidence register rows | 83 | **109** |
| Unresolved identities | 72 | **92** |
| Research gaps logged | 20 | **25** (4 earlier gaps partially resolved) |
| Winner records on Tier-1 primary sources | 65% | **68% (134/196)** |
| Records re-verified by direct page fetch (§27 sample) | — | **44 records (≈14%) — zero discrepancies** |
| Multi-event individuals identified | 10 | **11** (incl. Thabang Mabula: GradHack 2019 ↔ FinChatBot 2019 via §18 recursion) |
| Verified LinkedIn/GitHub profiles attached | 0 | **0 — §8 profile-discovery pass still pending (by design, no name-match attachments)** |

## 2. Earliest verifiable activity
Unchanged: **RHoK Johannesburg, 30 Nov–1 Dec 2013** (ThoughtWorks, Braamfontein) is the earliest SA hackathon verified with venue and date. RHoK Cape Town 2012 exists at series level; Phase 2 confirmed RHoK's Dec-2010 global city list did **not** include SA, sharpening the 2012-boundary claim. Tech4Africa's hackathon track is verified for 2015 (2011–2014 hack days still unverified).

## 3. Phase-2 discoveries (highlights)
- **ITWeb Security Summit Hackathon series** (#SS19Hack → #SSHACK26): five editions recorded, incl. a **Northern Cape venue edition (#SS25HACK, Kimberley, 2025)**; named CTF winners Jabu Mahlangu (2022), Lesoko Monyepao & Katlego Tsebe (2026).
- **Province gaps broken:** Mpumalanga venues (Maish @ University of Mpumalanga 2023; Telkom 10X eMalahleni 2025) and Northern Cape venue (#SS25HACK Kimberley). All nine provinces now have venue-level coverage.
- **Series completion:** GirlCodeHack 2018 podium; Discovery GradHack 2019, 2022, 2023 winners (full names for 2022/2023); Tshwane Varsity Hackathon 2022 (4th annual, 110 hackers).
- **New events with full rosters:** G20 Tourism Hackathon 2025 (inaugural, Department of Tourism — complete 7-member winning team across 7 institutions); PAICTA × UJ Virtual Hackathon Challenge 2020 (full podium + 3 individual awardees); FinChatBot Hackathon 2019 (winning team Aurora with employers); HackCorruption SA 2022 (17 named winners); UmojaHack Africa 2021 (Zindi); SA Game Jam 2018; Tech4Africa Hackathon 2015.
- **Re-verification:** 6 primary sources re-fetched in full; every re-checked record matched; bonus data captured (Entelect 2017 extends to 8th place; UFS event dates/host; Absa 2021 top-5 team names; SU project name InsureShield).

## 4. Province distribution (event editions)
Gauteng 41 • Western Cape 15 • KwaZulu-Natal 5 • Limpopo 4 • Mpumalanga 3 • Eastern Cape 2 • Free State 2 • North West 1 • Northern Cape 1 • National/multi-province 1 (+1 awards-ceremony-only Mpumalanga row). Per-year depth still varies by province.

## 5. Yearly edition counts (master table)
2012:1 · 2013:2 · 2014:4 · 2015:5 · 2016:5 · 2017:3 · 2018:6 · 2019:7 · 2020:3 · 2021:6 · 2022:8 · 2023:9 · 2024:9 · 2025:19 · 2026:12 · undated:1.

## 6. Quality status (§25/§27)
- Contradiction log now holds **11 entries**; new in Phase 2: SS24 dual CTF-winner claims (C08), Haffejee spelling consolidation (C09), 46-vs-48 participant count (C10), Mabula self-report confidence handling (C11).
- §27 sample: 44 records re-verified by independent direct fetch — **0 discrepancies** (above the 10% floor). Full winner/Top-3 second pass still scheduled.
- Team-membership discipline maintained: 17 HackCorruption winners and all SS-series teams recorded without nationality/roster inference; 92 unresolved-identity records carried openly.

## 7. What this database does NOT claim
- Not complete and not saturated: Pass 4 still yielded 18 editions + ~54 people, so Pass 5 is mandatory.
- No authoritative national registry exists against which completeness could be proven.
- Profile columns intentionally empty pending a per-person §8 verification pass (two corroborating signals required).
- Wayback Machine: snapshot located for the failed Hack4Water source but fetch failed (C07/G025 open).

## 8. Major remaining gaps (top items; full list in `06_research_gaps.csv`)
1. Devpost/HackerEarth/Kaggle platform extraction (never executed).
2. Systematic LinkedIn/social pass (§16) — organiser pages, winner posts, teammate tags.
3. Full Wayback passes (Hack4Water snapshot retry; hackjozi.com; girlcode archives; Tech4Africa 2011-2014).
4. SS-series pre-2022 editions; GirlCode 2014-16/19/21/23/24; Entelect pre-2017 results; GradHack 2020; TVH 2019-21/23-24; LVH 2022/23.
5. Full winner/Top-3 second verification pass (§27).
6. Person-backward recursion for all 309 people (§18 — only one chain executed).
7. Per-year participant-list extraction (GGJ site pages, DIRISA rosters, Space Apps project pages).

## 9. Citation
> **"Best achievable public-source coverage as of 2026-08-26 (Phase 2 of an ongoing census; not saturated)."**

Accuracy and auditability take priority over filled cells: every empty field reads `Unknown` (= "Not publicly verified"), and every substantive claim traces to a URL in `04_evidence_register.csv`.
