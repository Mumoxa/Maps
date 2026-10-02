# Progress — SA Qualified Accountant & Finance Skills Intelligence Map

Live research log. Updated after every ~2–5 verified people or completed research path.

> **Before any new batch: check `people_index.md` (the master name registry) first.** It lists
> every person already captured plus a watchlist of excluded/investigated names, so nothing
> is duplicated. Regenerate it after each batch with `python3 gen_people_index.py`.

## Session log

### 2026-09-18 (session 1) — infrastructure + 4 batches (72 people)

- Created research DB stores and governance docs under `markets/accountants/`.
- Batch 1 (42 people): SAICA "Meet our members" index + member features; CFO South Africa
  (CIMA); fmjfinancial.co.za SAIPA directory; public LinkedIn (AGA(SA)); personal CA(SA) account.
- Batch 2 (+23): Accountancy SA "CA(SA) Profiles" index; SAP Africa leadership (Sandi De Souza);
  Massmart LinkedIn (Illana Helman, SAP-linked); charteredaccountantsworldwide page.
- Batch 3 (+3): ACCA/FCCA (Manenzhe Manenzhe, Vijedharsan Vijendranath) + CIMA (Tariro Mutizwa).
- Batch 4 (+4): SAICA regional executives (Vorster, Asvat, Lamprecht) + Limpopo PA(SA)
  (Lesetja Kwetepane); enriched Ciara Reintjes (KPMG Windhoek articles).
- Duplicate control: merged duplicate AGSA company record; dedupe by id on all stores.

### 2026-09-18 (session 2) — WC focus + db_lib loader, 8 batches (63 more people)

- Created shared loader `db_lib.py` (`build()`, `append_batch()`, `infer_bodies()`, `next_id()`)
  so later batches stay compact and CSV regeneration is automatic.
- Batch 5 (+18): Streets (Sacks, Rich, Bapukee — CAs(SA)) + McA (Birkenstock, Spies CA(SA);
  Dirkse van Schalkwyk AGA(SA); Stohr, McLachlan SAIPA→PA(SA) HIGH); AGA(SA) trio (Fourie, L du
  Plessis, Nel — Nel explicit articles 2017); Forvis Mazars (P/S van der Merwe). Companies 42–50.
- Batch 6 (+13): WC CFOs — Motholo (UCT CFO + SAICA chair), de Wet (TradeOn, PwC articles),
  de Lange, Rheeder (fractional CFO), Karamchand (Deloitte), Heuvel (KPMG RA), Gregory (MK
  Aerospace, ASL articles); CIMA ACMA/CGMA — Visser (Curated), Danster (Curro), van Niekerk
  (Snapplify), A. Smith (Bounty). Companies 51–62.
- Batch 7 (+6): retail CFOs — Buddle (TFG), van Tonder & Manjra (Woolworths), Davin (TFG,
  Arthur Andersen articles), Potgieter (TFG, CA HIGH), Strauss (netCFO). Companies 63–65.
- Batch 8 (+4): WC practitioners — Boshoff (CA(SA) 1982), Pardoe (CA(SA)+RA), Coetzee (Callidus,
  RA HIGH), W. Theron (PSG chair, CA(SA)). Companies 66–69.
- Batch 9 (+12): LDP Chartered Accountants (Stellenbosch) full team — 11 CA(SA)+RA directors /
  associate directors (4 with explicit articles: de Villiers, J van Zyl, N Van Der Westhuizen,
  Le Roux) + 1 CONFLICTING (Alicia Haasbroek: heading CA(SA) vs bio "eligible"). Company 70.
- Batch 10 (+4): BDO — Mokoena (CEO, CA(SA)), Hashim (CT Managing Partner), Willimott (Gqeberha);
  Johan le Roux CA(SA) (Milnerton; Sage 50cloud Pastel, Draftworx). Companies 71–72.
- Batch 11 (+3): Zandrea Gerber CA(SA) (Pay@), Ashlin Healy CA(SA) (Deloitte CT), Huysamer
  AGA(SA) (HIGH). Companies 73–74.
- Batch 12 (+3): WC CIMA — Dzvova (CA(SA)+ACMA+CGMA), Hoffman & Kuni (ACMA/CGMA). Companies 75–77.

### 2026-10-01 (session 3) — CA(SA) master-mapping layer + 20 new employers (29 people)

- **Schema upgrade.** Added the CA(SA) master-instruction mapping layer: seniority bands S1–S8,
  normalised job titles, employer canonical name + employer group, employer ownership/scale,
  grouped industry (22-value taxonomy), associated industry groups, business-model tags,
  finance-environment tags, career industry path, previous roles 1–2, employer/profile
  confidence and primary/secondary evidence URLs. Config lives in `industry_taxonomy.json`;
  logic in `taxonomy.py`; `db_lib.build()` derives the classification fields automatically.
- **Batch 13 (+29 CA(SA) people, +20 companies, +37 sources):** Tiger Brands x4 (Kruger,
  Govender, Mfini, Pereira), RCL Foods (Field), Premier (Gertenbach, Grobbelaar), Astral
  (Schoeman, Geel, Enslin), Exxaro (Koppeschaar), Thungela (D. Smith), Kumba (Mbambo),
  Grindrod (Ally), Super Group (Mountford, Brown), DP World (Akoojee), Crookes Brothers
  (De Castro), Oceana (Mahomed), AfroCentric (Moloele), Mr Price (Nundkumar), Clicks (Traill),
  MTN (Molefe), Sanlam (Mukhuba), Sephaku (Crafford-Lazarus), PPC (Berlin), Nala Renewables
  (Moyo), Unilever SA (Nkosi), Sanlam Investments (Ismail, HIGH_CONFIDENCE).
- **New artefacts:** `master_ca_sa.jsonl` / `master_ca_sa.csv` (Section 32 master schema, 164
  CA(SA) records) and `coverage_matrix.json` (Section 39 coverage), both derived by
  `gen_master_export.py`; `industry_taxonomy.md` documents the taxonomy.
- **Website layer:** the Accounting & Finance track now exposes derived **Grouped industry** and
  **Seniority band (S1–S8)** facets, plus employer group, career path and tag fields in search.
- **QC:** the loader was accidentally executed twice before a company-id defect was fixed; the
  duplicate block (acc-1031–1059) was removed by `fix_batch13_dupes.py`. One pre-existing
  duplicate pair (Terri Ladbrooke acc-0963/acc-1001) is flagged for a merge pass.

### 2026-10-02 (session 4) — batch 14: sector gap-closing sweeps (28 people, +24 companies)

- **Sweep design.** Batch 13 left Property & Real Estate, Hospitality, Media, Banking, Agri-co-operatives,
  Cold-Chain Logistics and the S1–S3 pipeline thin or empty, so batch 14 went employer-first into those
  sectors plus the SAICA 2024 Top 35 Under 35 list.
- **Batch 14 (+28 CA(SA) people, +24 companies, +36 sources):** REITs (Raj Nana/Attacq, Leon Kok/Redefine,
  Laila Razack/Equites, Henry Kuhn/Attacq), Hospitality (Laurelle McDonald, Marcel von Aulock/Southern Sun),
  Media (Tim Jacobs/MultiChoice), Banking (Deon Raju/Absa, Mike Davis/Nedbank, Lindie Scholtz/FNB,
  Pamela Mainama/Absa), Mining & Energy (Meroonisha Kerber/Implats, Sayurie Naidoo/Anglo American Platinum,
  Walt Bruns/Sasol), Agri (Debbie Bester, Wayne Edwards/Senwes), Cold chain (Xoliswa Kula/CCS Logistics),
  plus 13 SAICA 2024 Top 35 finalists across insurance, industrial, professional services, government,
  technology and non-profit employers.
- **Enrichment pass (`enrich_batch14.py`):** Brendon Lucke upgraded FINANCE_ROLE_CONFIRMED → CONFIRMED
  (CCH governance page states CA(SA); ex-I&J Group FD); Romy Maree gained Dipula Income Fund / SA REIT
  treasurer / SAICA Top 35 detail; Zinhle Simamane's Traxtion CFO role confirmed on SAICA's own list.
- **New artefacts:** `research_runs/phase4_casa_master_2026-10-01/batch_14_run_report.md` (sections A–H).
- **Watch-outs:** Xoliswa Kula retained at HIGH_CONFIDENCE (network-listing designation, PROBABLE employer);
  Laila Razack and Henry Kuhn retained at HIGH_CONFIDENCE ("qualified chartered accountant", no CA(SA)
  string); 20 further SAICA 2024 finalists are designation-evidenced but not yet loaded.

## Running totals (session 2 close)

| Metric | Count |
|---|---|
| Confirmed qualified people | **108** |
| High-confidence people | 24 |
| Articles-confirmed / designation-unverified | 1 (Alan Robbins, Sable Intl) |
| Conflicting-designation records | 1 (Alicia Haasbroek, LDP) |
| Total people records | 134 |
| Companies mapped | 75 (cmp-0001–0075; cmp-0025 intentionally absent) |
| Unique sources | 69 |
| Searches executed (cumulative) | 108 |
| Provinces covered | 7 (Western Cape, Gauteng, KwaZulu-Natal, Free State, Limpopo, Mpumalanga-origin, Eastern Cape) |
| Cities covered | ~33 |

## Running totals (2026-10-01 — CA(SA) master-mapping run)

| Metric | Count |
|---|---|
| People records | 1030 |
| CONFIRMED | 331 |
| HIGH_CONFIDENCE | 32 |
| FINANCE_ROLE_CONFIRMED (no designation claim) | 588 |
| RESEARCH_HOLD | 74 |
| CA(SA) records (any status, per master export) | 164 (155 CONFIRMED, 9 PROBABLE) |
| Employers mapped | 204 |
| Evidence sources | 995 |
| Searches logged | 129 |

Coverage snapshot (164 CA(SA) records): Western Cape 59 · Unknown 51 · Gauteng 38 ·
KwaZulu-Natal 8 · Free State 6 · Eastern Cape 2 · Mpumalanga/North West/Northern Cape/Limpopo 0.
Seniority: S7 37 · S8 24 · S6 6 · S5 5 · S4 7 · S3 11 · S2 6 · S1 8 · Unknown 60.
Grouped industry leaders: Professional Services 44 · Unknown 44 · Consumer & FMCG 13 ·
Retail & Wholesale 9 · Government 8 · Technology 8 · Logistics 6 · Industrial 5 · Mining 4.

## Running totals (2026-10-02 — batch 14 close)

| Metric | Count |
|---|---|
| People records | 1058 |
| CONFIRMED | 358 |
| HIGH_CONFIDENCE | 34 |
| FINANCE_ROLE_CONFIRMED (no designation claim) | 587 |
| RESEARCH_HOLD | 74 |
| ARTICLES_CONFIRMED_DESIGNATION_UNVERIFIED | 4 |
| CONFLICTING | 1 |
| CA(SA) records (any status, per master export) | 193 (181 CONFIRMED, 12 PROBABLE) |
| Employers mapped | 228 |
| Evidence sources | 1035 |
| Searches logged | 139 |

Coverage snapshot (193 CA(SA) records): Western Cape 64 · Unknown 58 · Gauteng 53 ·
KwaZulu-Natal 8 · Free State 6 · Eastern Cape 2 · North West 2 · Mpumalanga/Northern Cape/Limpopo 0.
Seniority: S7 50 · S8 30 · S3 11 · S4 10 · S6 9 · S5 8 · S1 8 · S2 7 · Unknown 60.
Grouped industry leaders: Professional Services 46 · Unknown 44 · Consumer & FMCG 13 ·
Government 9 · Technology 9 · Retail & Wholesale 9 · Industrial 8 · Logistics 8 · Mining 6 ·
Banking & Lending 5 · NGO 5 · Property & Real Estate 5.

## Qualification breakdown (CONFIRMED unless noted)

CA(SA): 88 · AGA(SA): 8 · ACMA: 9 · CGMA: 11 · FCMA: 2 · FCCA: 2 ·
PA(SA): 0 CONFIRMED, 15 HIGH_CONFIDENCE · multi-designation (CONFIRMED): 11 —
ACMA+CGMA ×8 (Dlamini, Mutizwa, Visser, Danster, van Niekerk, Smith, Hoffman, Kuni),
FCMA+CGMA ×2 (Tshetshe, Mithi), CA(SA)+ACMA+CGMA ×1 (Dzvova; also holds CIA + Cert.Dir®)


## Practical-training breakdown

explicit SAICA articles: 7 — Vusi Mpofu (KPMG), Taryn Raju (Grant Thornton), Sandi De Souza
(Deloitte), Jody Baumgarten (PwC), Christiaan Vorster (Deloitte Pretoria), Div Lamprecht
(PwC Bloemfontein), Ciara Reintjes (KPMG Windhoek) ·
session 2: Louis de Wet (PwC Cape Town 2011–2013), Morgan Gregory (ASL Somerset West 2016–2018),
Neil Fourie (PwC 2016–2021, AGA(SA) route), Nastassja Nel (2017, AGA(SA) route), Graham Davin
(Arthur Andersen JHB), Emile de Villiers (Cape Town medium firm), Jana van Zyl (LDP), Nadia Van
Der Westhuizen (LDP), Thinus Le Roux (LDP, from 2017), Alicia Haasbroek (LDP 2014–2016) ·
SAICA training contract: 1 — Polani Sokombela (AGSA trainee accountant) ·
explicit SAIPA articles: 0 · SAIPA learnership: 0 · ACCA PER: 2 · CIMA PER: 9 ·
RPL: 0 · reciprocity: 0 · other route: 0 · route unknown: 0

## Geographic coverage by province (confirmed / total records)

| Province | Confirmed | Total records |
|---|---|---|
| Western Cape | 47 | 63 |
| Gauteng | 12 | 16 |
| KwaZulu-Natal | 2 | 3 |
| Eastern Cape | 1 | 1 |
| Free State | 3 | 3 |
| Limpopo | 0 | 1 (HIGH PA(SA)) |
| Mpumalanga | 0 | 0 |
| North West | 0 | 0 |
| Northern Cape | 0 | 0 |
| (no location evidence) | 44 | 47 |

## Industry coverage

Automotive (MBSA, BAIC, Motus), Mining (Harmony), Banking (Nedbank, Absa), Aviation (Lanseria),
Property (Burstone), Technology (SAP Africa, Drone Ops, Massmart IT, Superside, Snapplify, AYO,
MK Aerospace, GUUD, Pay@), Retail (Massmart, TFG, Woolworths, TradeOn), Manufacturing
(Brenn-O-Kem, The Fieldbar Co., Bounty Apparel), Professional Services (SAICA, KPMG, Deloitte,
PwC, BDO, Forvis Mazars, LDP, Crowe, Streets, McA, Sable International, M+C Saatchi, The Modern
CFO, netCFO), Accounting/Audit practices (SAIPA/AGA practitioners, Mckenzie, Motlanalo, Boshoff
Knoetze, Emma Pardoe, Callidus, le Roux, Theron du Plessis), FMCG (Unilever, Curated Beverages),
Logistics (Traxtion), Fintech (Wonga, Pay@), Education (UCT, Stellenbosch, Curro),
Government (AGSA, FSCA, EWSETA, Free State Treasury, Kannaland, TCTA), Non-Profit (AWCA, Cape
Chamber), Financial Services (PSG Konsult, Old Mutual Investment Group), Hospitality (Durban ICC),
Engineering, Pharmaceuticals (Bayer — historic).

## Systems intelligence

- SAP (person-linked evidence): Sandi De Souza (SAP Africa CFO), Illana Helman (Massmart).
- Sage 50cloud Pastel + Draftworx (person-linked): Johan le Roux CA(SA) (Milnerton).
- Xero (employer-platform evidence only): netCFO (Edburg Strauss) — separated from personal use.
- No person-linked Sage 300/ACCPAC, Oracle, Syspro or Microsoft Dynamics evidence yet — GAP.
- Employer-system separations preserved throughout.

## Coverage matrix (qualification × province × role × industry) — highlights

- CA(SA) × Gauteng × Executive Finance × Automotive — Taryn Woodbridge (MBSA)
- CA(SA) × Western Cape × Executive Finance × Education — Vincent Motholo (UCT CFO)
- CA(SA) × Western Cape × Executive Finance × Retail — van Tonder & Manjra (Woolworths), Buddle (TFG)
- CA(SA) × Western Cape × Executive Finance × Fintech — Louis de Wet (TradeOn)
- CA(SA) × Western Cape × Technology × Aerospace — Morgan Gregory (MK Aerospace)
- CA(SA) × Western Cape × Accounting practice × External Audit — LDP directors ×11, McA ×2, BDO CT
- CA(SA) × Gauteng × Accounting network × Executive — Bonga Mokoena (BDO CEO)
- CA(SA) × Western Cape × practice (solo) × Systems — Johan le Roux (Sage Pastel, Draftworx)
- AGA(SA) × Western Cape × Manufacturing × Financial Accounting — Neil Fourie (Brenn-O-Kem)
- AGA(SA) × Western Cape × Non-Profit × Financial Control — Lian du Plessis (Cape Chamber)
- ACMA/CGMA × Western Cape × FMCG/Education/Tech — Visser (Curated), Danster (Curro), van Niekerk
  (Snapplify), Smith (Bounty Apparel)
- CA(SA)+ACMA+CGMA × Western Cape × Technology — Valentine Dzvova (AYO)
- PA(SA) × W.Cape/Gauteng/KZN/Limpopo × practice — 15 practitioners (all HIGH_CONFIDENCE tier)

## Blockers / limitations

- LinkedIn full profiles gated; evidence rests on indexed public snippets + body/directory/news.
- SAICA/SAIPA member registers are interactive search tools (not scrapeable) — designation verified
  via named profiles/directories with explicit designation wording.
- Employment/location recency varies (member features 2021–2025; directory pages vary).
- A professional body can confirm designation but the articles route often stays unstated —
  recorded as QUALIFIED_BUT_ARTICLES_NOT_ESTABLISHED by design.
- Firm team pages (PKF, Crowe, Fenns, Streets→UK) often list names without per-person designation
  wording — only CONFIRMED when a designation appears next to the individual's name.

## Outstanding avenues (next sessions)

### Added 2026-10-01

- **Designation-verification queue (13 leads):** Amy Naick (Mandini Group — entity ambiguity),
  Renee Rautenbach (Momentum Group), Doug Gain (Seriti), Kwazi Mabaso (Grindrod CEO),
  Ulandy Junine Gribble (Frontier), Victor Sekgabu Ngake (Tlou Coal), Juliette Da Silva
  (Flight Centre SA), Luke Woodford (FirstRand Broader Africa), Bongani Ngcongo (Proconics),
  Dries Ferreira (between roles), Re-Ana Joseph (Seriti — directory only), Nina Hind (Clicks),
  Taskeen Ismail (retained at HIGH_CONFIDENCE).
- **Employer-node expansion** on the 20 new employers in batch 13 — sweep each finance team
  (FM / Group FM / Commercial Finance) rather than only the executive layer.
- **Geographic expansion** into Mpumalanga (Emalahleni), North West (Rustenburg), Limpopo
  (Polokwane) and Northern Cape (Kathu/Kimberley) using employer-first queries.
- **Sector expansion** into Property & Real Estate, Hospitality & Tourism, Banking & Lending,
  Fintech & Payments and Media — all thin or empty in the grouped-industry view.
- **Pipeline (Tier 2/3) expansion** via SAICA Top 35 Under 35 2024/2025 finalist lists and
  training-office alumni pages.
- **Merge pass:** Terri Ladbrooke acc-0963 → acc-1001.

### Added 2026-10-02

- **Finish the SAICA 2024 Top 35 cohort (20 names, designation-evidenced):** Ashton Samuels,
  Avishkar Panday, Christiaan Coetzee, Chrysanthe Georgiou, Dale Russell, Daneel Steinmann,
  Dorcas Nhlapho, Gareth Corbishley, Jared Moodley, Jean Tiaan Erlank, Kabelo Themane,
  Kumukakwashe Matambo, Lornelle Jonas, Mothathe Sewelo, Robert Edwards, Ruramayi Madamombe,
  Sanele Nkosi, Sibabalwe Bebeza, Simphiwe Mahlangu, Zack Fineberg. Roles/employers are recorded
  in the batch-14 run report, Section D.
- **Designation-verification queue (batch-14 additions):** José Snyders (Growthpoint GCFO),
  Gerald Völkel (Growthpoint GFD), Ntobeko Nyawo (Redefine CFO), Laurence Cohen (Vukile CFO),
  Ian Vorster (Fortress CFO), Monica Muller/Brett Till (Resilient), Derek Engelbrecht (Senwes CFO),
  Norman Basthdaw (Sun International CFO), Grant Hardy (Capitec CFO), Bradley Wattrus (Yoco CFO),
  Paxton Anderson (Peach Payments CFO), Villiers van Veen (SSK CFO), Nico Marais (Prosus/Naspers
  CFO — wording is "qualified Chartered Accountant"), plus the six CFO Awards 2024 winners
  (Tayob, Gumbochuma, Gcwabe, Davel, Woodbridge, Capazorio).
- **Property finance depth:** Growthpoint, Vukile, Resilient, Fortress and Equites finance teams
  (FM / Group FM / treasury) beyond the CFO/FD layer captured in batch 14.
- **Zero-coverage provinces:** Mpumalanga (Emalahleni/Secunda), Limpopo (Polokwane) and the
  Northern Cape (Kathu/Kimberley) — Seriti, Thungela, Exxaro, Kumba, Assmang, Samancor.
- **Sector depth where ≤2 records exist:** Insurance (Discovery, Momentum, Sanlam, Netcare,
  Mediclinic) and Healthcare & Life Sciences, plus Media (Primedia, Arena Holdings).

- ACCA (non-fellow) full-member discovery — currently only FCCA records exists in-database.
- PA(SA) in commerce/industry and SAIPA-articles-explicit records — PA(SA) currently all HIGH.
- More ACMA (non-CGMA) and FCMA records.
- Under-covered provinces: Eastern Cape, Mpumalanga, North West, Northern Cape.
- Systems-linked discovery: Sage 300/ACCPAC, Syspro, Oracle, Microsoft Dynamics + designation.
- Big Four / mid-tier alumni sweeps (KPMG, Deloitte, PwC, EY, Mazars/Forvis, BDO, PKF, Moore, SNG,
  Crowe, Baker Tilly SA).
- PKF WC partner/director names captured in snippets (Bellville/Stellenbosch ~13, Constantia
  Valley ~5, George 5) still need per-person designation verification before CONFIRMED capture.
- Garden Route (George/Mossel Bay/Knysna) and West Coast/Overberg remain thin — firm sites
  (Fenns, BGR De Villiers Paarl, Steyl & Cloete) have named teams whose designations need checks.
- Employer finance-team expansion: MBSA, Harmony, Nedbank, Absa, Unilever, Massmart, Webber Wentzel,
  Burstone, Lanseria, SAP Africa, Traxtion, Wonga, Woolworths, TFG, Sanlam/Old Mutual (WC offices).
- Follow-ups: Mangaliso Mithi employer; Taryn Raju current employer; Thenashree Naidoo's second
  Durban ICC CA(SA); "Andre Huysamer (CoCT)" vs "André Huysamer AGA(SA) (Kula)" disambiguation;
  Alicia Haasbroek CA(SA) registration outcome.
- CBAC (Chartered Business Accountant) and SAIBA-designated practitioners are out of the current
  designation scope but noted as adjacent populations.
