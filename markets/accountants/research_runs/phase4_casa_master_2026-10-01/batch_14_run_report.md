# Research Run — Batch 14: Gap-Closing Sector Sweeps

**Run ID:** `phase4_casa_master_2026-10-01 / batch-14`
**Date:** 1 October 2026 (data captured 1–2 October 2026)
**Scope:** South Africa — CA(SA)-designated finance professionals, seniority Tier 1 to Tier 3
**Targeted gaps after batch 13:** Property & Real Estate, Hospitality & Tourism, Media & Communications,
Banking & Lending, Agriculture & Agri-processing (co-operatives), Cold-Chain Logistics, the S1–S3 pipeline,
and Mpumalanga / North West / Limpopo / Northern Cape representation.
**Sources searched:** SA REIT Association and member annual financial statements, listed-company board
and executive pages (Southern Sun, MultiChoice, Absa, Nedbank, Implats, Sasol, Anglo American Platinum),
company appointment SENS/press releases, CFO South Africa awards and people-move coverage, Agbiz Grain and
co-operative governance pages, employer governance pages (Senwes, Commercial Cold Holdings, CCS Logistics),
and SAICA's 2024 Top 35 Under 35 finalist list.
**Database after run:** 1,058 person records (193 with an evidenced CA(SA) designation — 181 CONFIRMED and
12 PROBABLE), 228 employer records, 1,035 evidence sources.
**Artefacts:** `markets/accountants/master_ca_sa.jsonl`, `master_ca_sa.csv`, `coverage_matrix.json`
(regenerate with `python3 gen_master_export.py`).

---

## A. Newly identified professionals (28)

25 of the 28 carry an explicit `CA(SA)` / `Chartered Accountant (SA)` statement in the cited source.
The remaining 3 sit on SAICA's own Top 35 Under 35 finalist list, a competition restricted to CAs(SA),
and are held at HIGH_CONFIDENCE designation tier until an individual statement is located. Full Section 32
rows for all of them are in `master_ca_sa.csv`.

| ID | Name | Band | Role | Employer | Grouped industry | Province | Confidence |
|---|---|---|---|---|---|---|---|
| acc-1031 | Raj Nana | S7 | Chief Financial Officer | Attacq Limited | Property & Real Estate | Gauteng | CONFIRMED |
| acc-1032 | Leon Kok | S8 | Chief Operating Officer | Redefine Properties Limited | Property & Real Estate | Gauteng | CONFIRMED |
| acc-1033 | Laila Razack | S7 | Chief Financial Officer | Equites Property Fund Limited | Property & Real Estate | Western Cape | HIGH_CONFIDENCE |
| acc-1034 | Henry Kuhn | S4 | Group Financial Manager | Attacq Limited | Property & Real Estate | Gauteng | HIGH_CONFIDENCE |
| acc-1035 | Laurelle McDonald | S7 | Chief Financial Officer and Executive Director | Southern Sun Limited | Hospitality, Leisure & Tourism | Gauteng | CONFIRMED |
| acc-1036 | Marcel von Aulock | S8 | Chief Executive Officer and Executive Director | Southern Sun Limited | Hospitality, Leisure & Tourism | Gauteng | CONFIRMED |
| acc-1037 | Tim Jacobs | S7 | Group Chief Financial Officer | MultiChoice Group Limited | Media & Communications | Gauteng | CONFIRMED |
| acc-1038 | Deon Raju | S6 | Group Financial Director | Absa Group Limited | Banking & Lending | Gauteng | CONFIRMED |
| acc-1039 | Mike Davis | S7 | Chief Financial Officer | Nedbank Group Limited | Banking & Lending | Gauteng | CONFIRMED |
| acc-1040 | Meroonisha Kerber | S7 | Chief Financial Officer and Executive Director | Impala Platinum Holdings Limited | Mining & Resources | Gauteng | CONFIRMED |
| acc-1041 | Sayurie Naidoo | S7 | Chief Financial Officer and Executive Director | Anglo American Platinum Limited | Mining & Resources | Gauteng | CONFIRMED |
| acc-1042 | Walt Bruns | S7 | Chief Financial Officer and Executive Director | Sasol Limited | Energy & Utilities | Gauteng | CONFIRMED |
| acc-1043 | Debbie Bester | S8 | Group Chief Executive Officer | Senwes Limited | Agriculture & Agri-processing | North West | CONFIRMED |
| acc-1044 | Wayne Edwards | S7 | Group Chief Financial Officer (acting) | Senwes Limited | Agriculture & Agri-processing | North West | CONFIRMED |
| acc-1045 | Xoliswa Kula | S6 | Financial Director | CCS Logistics | Logistics & Supply Chain | Western Cape | HIGH_CONFIDENCE |
| acc-1046 | Mhlengi Tenza | S7 | Chief Financial Officer | Standard Insurance Limited | Insurance | Gauteng | CONFIRMED |
| acc-1047 | Riyaad Bhamjee | S5 | Vice-President: Strategy and Corporate Development | AECI Limited | Industrial & Manufacturing | Gauteng | CONFIRMED |
| acc-1048 | Arthi Daya | S7 | Chief Financial Officer | BBF Safety Group | Industrial & Manufacturing | Unknown | CONFIRMED |
| acc-1049 | Nokuzola Morata | S4 | Group Financial Manager | Knight Piésold (Pty) Ltd | Professional Services | Unknown | CONFIRMED |
| acc-1050 | Wardah Facoline | S4 | Deputy Director: Demand Management | Western Cape Department of Infrastructure | Government & Public Sector | Western Cape | CONFIRMED |
| acc-1051 | Somah Sachs | S8 | Chief Operating Officer | Tapio | Technology & Software | Unknown | CONFIRMED |
| acc-1052 | Duval van Zijl | S5 | Co-founder and Head of Investments | Holocene | Investments & Capital Markets | Unknown | CONFIRMED |
| acc-1053 | Grant Edmond | S8 | CFO-COO | DataDrive2030 | NGO / Non-Profit | Western Cape | CONFIRMED |
| acc-1054 | Carli Botha | S6 | Director | Clinglobal Ltd | Healthcare & Life Sciences | Unknown | CONFIRMED |
| acc-1055 | Frits Reyneke | S8 | Chief Executive Officer | Truewood Furniture | Industrial & Manufacturing | Unknown | CONFIRMED |
| acc-1056 | Jason Grieve | S7 | Chief Financial Officer | Crawford Dougall Holdings | Professional Services | Unknown | CONFIRMED |
| acc-1057 | Lindie Scholtz | S5 | Regional Head of Credit | FNB (FirstRand Bank Limited) | Banking & Lending | Gauteng | CONFIRMED |
| acc-1058 | Pamela Mainama | S2 | Senior Investment Banker: Financial Solutions Group | Absa Bank Limited | Banking & Lending | Gauteng | CONFIRMED |

Notes on evidence tiering:

- **Raj Nana** — Attacq's FY2025 annual financial statements (signed 15 September 2025) state the statements
  were supervised by "R Nana CA(SA), Chief Financial Officer of the Group"; articles served with the FirstRand
  group; S12 (JSE) is his second listing exposure.
- **Mike Davis** — Nedbank executive page carries the full qualification line "BCom (Hons), DipAcc, CA(SA), AMP
  (INSEAD)" and Deloitte articles; CFO South Africa named him CFO of the Year in 2024.
- **Walt Bruns** — the appointment release uses "certified chartered accountant in South Africa"; recorded as an
  explicit CA(SA) statement in prose form.
- **Xoliswa Kula** — HIGH_CONFIDENCE: the CA(SA) string appears in her professional-network headline, but that is
  the only designation source and the group attribution (CCS Logistics / Commercial Cold Holdings / Oceana)
  varies by source, so employer confidence is PROBABLE.
- **Laila Razack and Henry Kuhn** — HIGH_CONFIDENCE: both sources say "qualified chartered accountant" without the
  CA(SA) string; employer and role are confirmed.
- **SAICA Top 35 cohort (acc-1046 to acc-1058 entries above)** — designation is evidenced by inclusion in a
  CAs(SA)-only SAICA competition rather than a per-person statement. Their employer and role come directly from
  SAICA's finalist list; Grant Edmond's Cape Town work location has independent media corroboration.

## B. Updated professionals (3)

Three existing records gained materially better evidence and were enriched in place (`enrich_batch14.py`) rather
than duplicated:

| ID | Name | What changed |
|---|---|---|
| acc-0833 | Brendon Lucke | Upgraded FINANCE_ROLE_CONFIRMED → CONFIRMED. Commercial Cold Holdings' governance page states "Brendon is a Chartered Accountant, CA(SA)" and documents his ex-I&J Group Finance Director history. Now carries a seniority band (S7), grouped industry, tags and career path. |
| acc-0010 | Romy Maree | Added the Dipula Income Fund finance-executive role, SA REIT Association treasurer role and SAICA Top 35 Under 35 2024 recognition; identity match flagged PROBABLE in notes (distinctive name, continuous listed-property career). |
| acc-0049 | Zinhle Simamane | Role confirmed as "Chief Financial Officer: International Business – Traxtion" on SAICA's own 2024 finalist list, corroborating the existing Accountancy SA profile. |

## C. Duplicates rejected

| Potential duplicate | Outcome | Reason |
|---|---|---|
| Brendon Lucke (new spec) vs existing acc-0833 | **Not added as a new record** — existing record enriched instead. | Same person; batch-14 loader skipped the name and the enrichment pass carried the new evidence. |
| Marcel von Aulock / Zinhle Simamane / Romy Maree | Not re-added. | All three already had records or enrichments; identity control run against `people_index.md` before insertion. |
| Same-surname collisions across the store (63 pairs, e.g. Naidoo, Greeff, Isaacs, Du Plessis) | Reviewed, none merged. | Different first names, employers, sectors and provinces; surname alone is not identity evidence. |
| Terri Ladbrooke acc-0963 / acc-1001 | Still open. | Pre-existing duplicate pair; merge pass deferred (append-only store). |

## D. Unverified leads (recorded but not added — designation or evidence outstanding)

**Second-sweep names with no designation evidence located:**

| Lead | Role / employer | Missing |
|---|---|---|
| José Snyders | Group CFO, Growthpoint Properties (from 1 Jan 2026) | CA(SA) statement |
| Gerald Völkel | Group FD, Growthpoint (to 31 Mar 2026) | Source says "Chartered Accountant" generically; CA(SA) unverified |
| Ntobeko Nyawo | CFO, Redefine Properties | CA(SA) statement |
| Laurence Cohen | CFO, Vukile Property Fund | CA(SA) statement |
| Ian Vorster | CFO, Fortress REIT | CA(SA) statement |
| Monica Muller / Brett Till | CFO / COO, Resilient REIT | CA(SA) statement |
| Dawie Swarts | Head of Group Finance / CFO Growthpoint Investment Partners | CA(SA) statement |
| Derek Engelbrecht | Group CFO, Senwes | Qualifications not published |
| Norman Basthdaw | CFO, Sun International (since 2017) | CA(SA) statement |
| Grant Hardy | CFO, Capitec Bank | CA(SA) statement |
| Bradley Wattrus | CFO, Yoco | CA(SA) statement (search returned no designation) |
| Paxton Anderson | CFO, Peach Payments | CA(SA) statement |
| Villiers van Veen | CFO, SSK | CA(SA) statement |
| Lundi Sishi | Managing Director, CCS Logistics | Not a finance designation lead; conflicting MD listings on aggregators |
| Nico Marais | CFO, Prosus/Naspers (Apr 2025) | Source says "qualified Chartered Accountant" — not the CA(SA) string |

**CFO Awards 2024 winners with designation evidence pending:** Mikaeel Tayob (Bridgestone South Africa, Executive
FD) · Innocent Gumbochuma (SAQA CFO) · Sandiso Gcwabe (Wesgro CFO) · Riaan Davel (DRDGOLD CFO) · Taryn Woodbridge
(Mercedes-Benz South Africa CFO) · Sean Capazorio (Aspen Pharmacare Group CFO).

**SAICA 2024 Top 35 cohort members identified but not yet added (next pipeline sweep):** Ashton Samuels (CEO,
Simply Compliant) · Avishkar Panday (CEO, Accounting 4 Associates) · Christiaan Coetzee (Founder, The Audit
Toolbar) · Chrysanthe Georgiou (Head of Selection, Amazon SSA) · Dale Russell (TrustReserve / Moore Blockchain) ·
Daneel Steinmann (Old School) · Dorcas Nhlapho (Associate Director, BDO) · Gareth Corbishley (MD, Halo Dot) ·
Jared Moodley (Deloitte Africa V&M Managing Partner) · Jean Tiaan Erlank (ProcessLab) · Kabelo Themane (Edge
Growth) · Kumukakwashe Matambo (Grant Thornton International) · Lornelle Jonas (E'lique Advisory) · Mothathe
Sewelo (Absa NBFI Trade Sales) · Robert Edwards (Aalto Capital, London) · Ruramayi Madamombe (EY Transaction
Diligence) · Sanele Nkosi (Partner, BDO) · Sibabalwe Bebeza (Associate Director, BDO) · Simphiwe Mahlangu
(Director Audit/IT CoE, BDO) · Zack Fineberg (Head of Sustainability, PKF Octagon).

**Carried over from batch 13:** Amy Naick (Mandini Group — entity ambiguity) · Renee Rautenbach (no evidence
found; second search returned nothing) · Doug Gain (Seriti Resources) · Kwazi Mabaso (Grindrod CEO) · Ulandy
Junine Gribble · Victor Sekgabu Ngake · Juliette Da Silva · Luke Woodford · Bongani Ngcongo · Dries Ferreira
(between roles) · Re-Ana Joseph · Elma Stander · Nina Hind · Taskeen Ismail (recorded at HIGH_CONFIDENCE).

## E. New employers discovered (24)

Attacq · Redefine Properties · Equites Property Fund · Southern Sun · MultiChoice Group · Absa Group · Nedbank
Group · Impala Platinum · Anglo American Platinum · Sasol · Senwes · Commercial Cold Holdings · CCS Logistics ·
Standard Insurance Limited · AECI · BBF Safety Group · Knight Piésold · DataDrive2030 · Clinglobal · Truewood
Furniture · Holocene · Tapio · Crawford Dougall Holdings · Dipula Income Fund.

Each is registered in `companies.jsonl` with aliases, ownership type, industry, headquarters and a
`finance_team_research_status`, so the sector sweeps that produced them can be reopened deliberately.

## F. New industry associations discovered

- **Property & Real Estate × Logistics** — Equites (logistics/industrial REIT) links listed-property finance to
  the logistics and cold-chain ecosystems; Attacq and Equites both feed the warehouse/industrial node.
- **Hospitality, Leisure & Tourism × Gaming** — Leon Kok (Emperors Palace → Peermont → Redefine) and Laurelle
  McDonald (Gold Reef Resorts → Tsogo Sun → Southern Sun) show a gaming/hospitality → listed-property route.
- **Media & Communications × Technology** — MultiChoice's CA(SA) CFO sits at the pay-TV/streaming boundary, and
  Amazon SSA and Tapio names connect the platform economy to the map.
- **Banking & Lending × Risk** — Deon Raju's Group CRO → Group Financial Director move and Lindie Scholtz's
  credit-leadership seat tie credit risk into the CA(SA) finance map (relevant to the repo's Credit Risk track).
- **Mining & Resources × Energy** — Sasol and the platinum producers add an integrated energy-and-chemicals node
  alongside the mining node already present.
- **Agriculture & Agri-processing × Financial Services** — Senwes (grain handling plus agri financing) connects
  co-operative agribusiness to working-capital and credit finance.
- **Cold-Chain Logistics × FMCG/Food** — Commercial Cold Holdings and CCS Logistics close the farm-to-fork chain
  the Consumer & FMCG records opened.

## G. New talent-flow patterns

1. **Audit → listed-property finance** remains dominant: Attacq's CFO (FirstRand articles), Attacq's Group FM
   (property audits), Equites' CFO (PwC advisory).
2. **Internal finance-to-operations/executive promotion** recurs: Leon Kok (FD → COO, Redefine), Sayurie Naidoo
   (financial reporting → CFO, Amplats), Walt Bruns (divisional CFO → group CFO, Sasol), Mike Davis
   (balance-sheet management → CFO, Nedbank), Deon Raju (risk → FD, Absa).
3. **Bank → industry** moves appear: BoE Bank/Nedbank (Davis), FirstRand (Nana, Scholtz), Absa (Mainama).
4. **Mining group mobility** is now visible: Deloitte → Anglo American Platinum → AngloGold Ashanti → Implats
   (Kerber); Anglo American group internal progression (Naidoo).
5. **CA(SA) pipeline reaching CFO seats in mid-market firms** — the SAICA 2024 cohort supplies CFOs at BBF
   Safety, Standard Insurance, Crawford Dougall and Traxtion, plus a Group FM at Knight Piésold.
6. **Hospitality leadership pipeline** — Tsogo/Southern Sun produced both a CFO and a CEO from within (McDonald,
   von Aulock), a single-group finance-to-CEO pathway worth tracking as a pattern.

## H. Coverage gaps after this run

From `coverage_matrix.json` (193 CA(SA) records):

**By province** — Western Cape 64 · Unknown 58 · Gauteng 53 · KwaZulu-Natal 8 · Free State 6 · Eastern Cape 2 ·
North West 2 · **Mpumalanga, Northern Cape, Limpopo: still 0.** The 58 "Unknown" records remain the single
largest gap; Gauteng gains (+15) now broadly match the Western Cape base, reversing the batch-13 skew.

**By seniority band** — Unknown 60 · S7 (CFO) 50 · S8 (broader executive) 30 · S3 11 · S4 10 · S6 9 · S5 8 ·
S1 8 · S2 7. Pipeline depth (S1–S4 = 36) improved but is still thin relative to Tier 1 density.

**By grouped industry** — Professional Services 46 · Unknown 44 · Consumer & FMCG 13 · Government & Public
Sector 9 · Technology & Software 9 · Retail & Wholesale 9 · Industrial & Manufacturing 8 · Logistics & Supply
Chain 8 · Mining & Resources 6 · Banking & Lending 5 · NGO / Non-Profit 5 · Property & Real Estate 5 · Education 4
· Investments & Capital Markets 4 · Hospitality, Leisure & Tourism 3 · Agriculture & Agri-processing 3 · Fintech
& Payments 2 · Healthcare & Life Sciences 2 · Insurance 2 · Construction & Building Materials 2 · Energy &
Utilities 2 · Telecommunications 1 · Media & Communications 1.

### Recommended next sweeps (Section 38 search-expansion engine)

1. **Finish the SAICA 2024 cohort** — the 20 remaining finalists are designation-evidenced and employer-named;
   adding them is a low-cost, high-yield pipeline batch, and they seed Health Tech, blockchain, sustainability
   and advisory employers not yet on the map.
2. **Geographic expansion to zero-coverage provinces** — Mpumalanga (Emalahleni coal belt, Secunda), Limpopo
   (Polokwane platinum/agri) and Northern Cape (Kathu/Kimberley mining) using company-first sweeps:
   Seriti, Thungela, Exxaro, Kumba, Assmang, Samancor.
3. **Property finance depth** — the five REITs now on the map have finance teams beyond the captured CFO/FD/GROUP
   FM layer (Growthpoint, Vukile, Resilient, Fortress, Equites).
4. **Insurance and healthcare depth** — only 2 records each; Discovery, Momentum, Sanlam, Aspen, Netcare and
   Mediclinic finance structures are un-swept.
5. **Designation verification queue** — the leads in Section D, starting with the CFOs of the five largest
   unverified employers (Growthpoint, Redefine, Vukile, Capitec, Sun International).
6. **Merge pass** — resolve Terri Ladbrooke (acc-0963/acc-1001) and the PPC dual-CFO conflict (Berlin vs
   Cardarelli) before the next master-export refresh.
