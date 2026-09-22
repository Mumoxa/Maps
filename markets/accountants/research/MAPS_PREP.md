# Maps Prep — Sage 300 IB Finance Talent Mapping (cmp-0076–0113)

**Date:** 2026-09-22  
**Branch:** `arena/01a0c946-maps` @ `b44df68`  
**SoT:** `people.jsonl` 169 (128 CONFIRMED, 39 HIGH, 1 ARTICLES_CONFIRMED, 1 CONFLICTING), `people.json` 400 (169 verified camelCase + 231 SATURC RECORDED), `sources.jsonl` 131, `companies.jsonl` 113 (38 IB)

## 1. Discovery

**Company universe:** 38 Sage 300 installed-base companies (Quantum Foods → M-KOPA) from `companies.jsonl` cmp-0076–0113. Sources: ITWeb, AWCape, Lorge, Tydeco, Realisable, tender docs.

**Method:** Pattern B — people.jsonl SoT, research CSVs intermediate, batch loaders `db_lib.py`. Dedupe via `people_index.md` first.

**Batches:**
- 13-15: 26 people (Quantum, Novus 3, FLM 3, Ecowize, RMS, Geiger, Atlantis SEZ 2, REFSOLS, Radisson placeholder, Samsonite, Workforce, Inala, SAQA, TCTA 2, WRC, CompTrib, NAMC, Hisense, Premier, CTICC, Tshikululu, Retail Capital placeholder) → 20/38
- 16: +3 (Anene Engelbrecht FC Radisson Blu Waterfront eTurboNews 15 Aug 2018 + CFO.co.za first deaf FC global, Carel Smit GM Finance Fidelity ADT RocketReach + LinkedIn Senior FM, Alex Appleby Head Treasury Retail Capital RocketReach) → 24/38 incl FVC group-covered
- 17: +6 (Sabelo Mavundla CFO BCMDA current Aug 2025– LinkedIn KPMG articles, Vicky Ntsodo prior ZoomInfo, Busisiwe Lubelwana former resigned Nov 2024 News24, Mokete Mokono Acting CFO DALRRD nationalgovernment + PMG 39961, Talifhani Khubana CFO SAHRC nationalgovernment + SAHRC APP + PMG 39653, Faraimose Kutadzaushe CFO & ED M-KOPA CA(SA) 2008 CA(Zimbabwe) CFA MBA Stanford BAcc Hons UNISA m-kopa.com + theorg.com) → **28/38 (73.7%)**

**IB-matched distinct people:** 35 (32 + 3 BCMDA timeline) → 38 entries incl FVC group expansion (Yolanda Louw + JP du Toit + MC Stoman counted for both FLM cmp-0078 and FVC cmp-0081).

## 2. Verification

**Evidence standard:** Every material claim carries source URL in `sources.jsonl` (131). Primary sources: employer website, annual report, board bio, nationalgovernment.co.za, PMG committee reports, LinkedIn (when explicit), News24, ZoomInfo/RocketReach/TheOrg as strong directory (not sole for CA).

**Designation confidence:**
- CONFIRMED: explicit "CA(SA)" string on primary/board/profile
- HIGH: "Ca" display name + CTA/Big Four path but no explicit string
- UNCONFIRMED: KPMG articles but no CA string (Sabelo), or "Alex Ca" treasury (Alex Appleby)
- Faraimose Kutadzaushe: CONFIRMED CA(SA) 2008 + CA(Zimbabwe) + CFA via TheOrg bio (Stanford MBA, UNISA BAcc Hons)

**Sources breakdown (10 new batch 17):**
- src-0122 LinkedIn Sabelo Mavundla
- src-0123 ZoomInfo BCMDA CFO Vicky Ntsodo / CEO Ayanda Gqoboka
- src-0124 News24 Busisiwe Lubelwana resignation
- src-0125 nationalgovernment DALRRD Acting CFO Mokete Mokono
- src-0126 PMG 39961 DALRRD Q2 2024/25
- src-0127 nationalgovernment SAHRC CFO Talifhani Khubana
- src-0128 PMG 39653 SAHRC annual
- src-0129 SAHRC APP 2024/25 PDF
- src-0130 m-kopa.com/about leadership
- src-0131 theorg.com M-KOPA CFO bio

## 3. Gap Analysis

**Mapped 28:** Quantum, Novus (3), FLM (3), Ecowize, FVC group-covered (3), RMS, Geiger, Atlantis SEZ (2), REFSOLS, Radisson Blu Waterfront, Fidelity ADT, Samsonite, Workforce, Inala, SAQA, TCTA (2), WRC, CompTrib, NAMC, Hisense, Premier, CTICC, Swift excluded, BCMDA (3), DALRRD, SAHRC, Tshikululu, Retail Capital, M-KOPA

**Remaining 10 hard gaps — no public finance leader evidence (private SME):**
- cmp-0080 Anchor Industries — Sage 300cloud, anchors.co.za, supplier directory contact Peter Minnaar only, no finance title public, ZoomInfo/RocketReach no finance
- cmp-0085 Mason's Clothing — e-commerce integration to Sage 300 case study only (ITWeb), no finance team public
- cmp-0086 Helderberg Village — retirement village, AWCape client list only, no finance public
- cmp-0087 Isilumko ATT — recruitment/HR tech, AWCape client list only, no finance public
- cmp-0091 Kentz Group (SNC-Lavalin) — Lorge Sage 300cloud, Midrand SA HQ, global EPC, no SA FM public beyond expired Financial Controller job ad Sandton/Midrand (SNC-Lavalin careers)
- cmp-0092 Roymec Technologies — Lorge, Woodmead mining equipment, no finance public
- cmp-0093 Electron Technologies — Lorge, Wynberg electrical, no finance public
- cmp-0095 Educor Group — 70+ users, current FM vacancy 2020 Durban only (PNet job ad), historic FD Robert Katz CA(SA) now Peregrine CEO (CFO.co.za profile) not current
- cmp-0096 ENRC Africa — Realisable UK Accpac multi-company, global CFO Miguel Perry resigned 2009 AccountancyAge, no Africa FM public
- cmp-0107 Swift Holdings — Level 4 Possible (must not count) — Sage 300 People only + unnamed accounting system (ITWeb), no finance public

**Acceptable for Discovery:** Private SMEs with no public finance leader, documented.

## 4. Second Pass

**Title families:** 13 families defined. IB coverage after batch 17: 5/13 families (Executive Finance 22, Financial Control 6, Financial Management 5, Head of Finance 1, Treasury/Tax 1). Remaining 8 families (Finance Business Partner, FP&A, Group Accounting, Financial Accounting, Management/Cost Accounting, Commercial Finance, Project/Asset Finance, Systems/Transformation) not yet evidenced for IB — would require deeper LinkedIn/company team page access (gated) or direct enquiry.

**Second pass attempts:**
- Quantum Foods Senior Financial Manager Robin Ca (RocketReach) — display name suggests CA but no explicit confirmation
- Novus Financial Manager KZN CMA essential job ad (MyJobMag Sep 2025) — role exists, no named person
- Ecowize Group Financial Accountant vacancy (MyJobMag Feb 2026) — Sage 300 GL structure mentioned, no named person
- TCTA Senior Manager Finance + Financial Controller RSA Delegation CA(SA) 10 years (MyJobMag) — role exists, no named person
- No additional named persons found for Mason's, Helderberg, Isilumko, Kentz, Roymec, Electron, Educor current, ENRC Africa, Swift

**SATURC pool:** 231 RECORDED candidates in people.json only (Master Pool + Top 100), camelCase, e.g., Robert Rossouw AGA(SA) Finance Manager AMC Cookware, Frikkie Venter PA(SA) SAFT, Francois Meyer PA(SA) Tax Shop Stellenbosch. Many lack employer/title/designation rigor. Conversion to people.jsonl only after per-person verification per binding rule. Not in scope for IB 28/38 but available as secondary lead list.

## 5. QA

**Checks performed:**
- Dedupe: people_index.md first, no duplicate full_name + employer
- ID collision protection: SATURC 0161-0163 → 0392-0394 (batch 16), 0164-0169 → 0395-0400 (batch 17), final people.json 400 no dup, people.jsonl 169 no dup
- Sources: 0 orphaned person_id, 131 sources, 121 → 131 growth
- people.jsonl missing employer: 19 (baseline solo practitioners, e.g., acc-0013 etc.) — acceptable, practitioners
- people.json UI: 400 all camelCase (169 verified via gen_people_json logic + 231 SATURC), 0 missing fullName, status counts CONFIRMED 128 HIGH 39 RECORDED 231
- companies.jsonl: 113 total, 38 IB present
- Coverage: 28/38 mapped, 10 gaps documented
- Build: `npm test` 50/50 pass, `npm run build` success (dist 2.7MB + 6MB ContactDirectory), validate:data perTrack accounting-finance 0 expected (Pattern B not counted in legacy loader — adapter still wired in talentSearch.ts)
- people_index.md: 169 people, 113 companies, 131 sources regenerated via gen_people_index.py
- Research datasets: companies_master.csv 28 MAPPED, coverage_matrix.csv updated Executive Finance for BCMDA/DALRRD/SAHRC/M-KOPA, people_master.csv 38 IB entries incl group expansion, title_variants_discovered.csv 23, people_qualifications.csv 165, people_professional_routes.csv 184, people_sources.csv 131, unverified_people_queue.csv 6, rejected_or_excluded_people.csv 3

**Designation × route separation preserved:** e.g., Faraimose Kutadzaushe CA(SA) 2008 + CA(Zimbabwe) + CFA + BAcc Hons UNISA + MBA Stanford — articles not established (QUALIFIED_BUT_ARTICLES_NOT_ESTABLISHED) per rule.

## 6. Maps Prep

**Ready for UI:**
- `people.json` 400 camelCase (169 verified + 231 SATURC) consumed by `src/data/accountantsPeople.ts` → `adaptAccountantCandidates` → `talentSearch.ts` → `/accounting-finance` + `/talent-search`
- Facets: qualification, route, body, roleFamily, industry, province, system, employer — all derived at runtime, no hardcoded counts
- No build artifacts committed, no fabricated URLs, public professional info only

**Next steps for Maps:**
- Optional: deep-dive second pass for IB title families (Group Accountant, Management Accountant, FP&A) via direct company team pages or LinkedIn Sales Navigator (gated) — not blocking 28/38 Discovery completion
- Optional: SATURC conversion — verify 10-20 high-value SATURC (e.g., fruit/logistics PA(SA) Frikkie Venter) and promote to people.jsonl with primary source
- Optional: gap-fill cmp-0001–0075 for 13 families (currently 75 companies mapped but mostly 1 family) — would lift national pool beyond IB
- For production: run `python3 markets/accountants/gen_people_json.py` + custom merge to preserve SATURC, then `python3 gen_people_index.py`, commit, `npm test && npm run build`

**Definition of Done for this session:** 28/38 IB mapped, 10 hard gaps documented with evidence URLs, QA passed, people.json 400 camelCase, datasets refreshed, progress.md updated, branch pushed.

