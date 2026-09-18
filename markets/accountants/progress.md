# Progress — SA Qualified Accountant & Finance Skills Intelligence Map

Live research log. Updated after every ~2–5 verified people or completed research path.

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
