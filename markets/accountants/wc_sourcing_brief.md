# Western Cape non-CA designation search — sourcing brief, gap review and search kit

_As at 2026-09-21. Companion to `exports/wc_non_ca_shortlist_2026-09-21.csv` / `.md` and the research
stores (`people.jsonl`, `people_index.md`, `search_queries.md`, `progress.md`)._

## 1. What the brief asked for, and how it was interpreted

| Brief item | Interpretation applied |
|---|---|
| Designations: PA(SA) · AGA(SA) · ACCA/FCCA · ACMA/FCMA/CGMA | Exactly these. CA(SA) is **not** a target (existing CA(SA) records are kept but not counted toward the pool). Dual holders (e.g. CIMA + SAIPA, PA(SA) → CA(SA)) are included because they hold a target designation. |
| Geography: SA, start Western Cape; exclude Garden Route, Langebaan, Saldanha, Worcester | "WC core" = City of Cape Town metro (all suburbs), Stellenbosch, Paarl, Franschhoek, Wellington, Somerset West/Strand/Gordon's Bay, Durbanville/Bellville/Kraaifontein/Brackenfell/Kuils River. Overberg (Hermanus) and Swartland (Malmesbury) were **not** excluded by the brief; they are captured but flagged (`location_confidence` / notes). |
| Sources: LinkedIn, Google X-ray, forums, SAIPA & SAICA sites, organogram-style structures | LinkedIn X-ray via web search (public/indexed pages only), professional-body publications, firm team pages/honour rolls, directories. TheOrg (org charts) is reCAPTCHA-gated for automation — manual use only (see §5). |
| Output: name, surname, company, title, relevance, LinkedIn URL | Delivered in the export. **LinkedIn URLs are only recorded when actually seen in a public result.** Where a person was found via a LinkedIn people-card without a retrievable URL, the export gives a clearly-labelled LinkedIn *people-search link*, never a guessed slug. |
| Sage 300 / "Actpac" (ACCPAC) = bonus | Mapped as a person-linked boolean; **no** person-linked Sage 300/ACCPAC evidence found in the WC non-CA pool yet (employer usage ≠ personal skill). |

## 2. Gap review of the supplied Boolean string (and fixes)

The supplied string was designation-only. As written it cannot be pasted into LinkedIn Recruiter or
Google without heavy noise. Gaps and fixes:

1. **No location clause.** Add LinkedIn's canonical WC location tokens: `"City of Cape Town"`,
   `"Cape Town Metropolitan Area"`, `"Cape Town"`, `"Western Cape"`, plus suburb/town tokens
   (Stellenbosch, Paarl, Franschhoek, Wellington, "Somerset West", Strand, "Gordon's Bay", Bellville,
   Durbanville, "Tyger Valley"/Tygervalley, Brackenfell, Kraaifontein, "Kuils River", "Century City",
   Milnerton, "Table View", Blouberg, Claremont, Kenilworth, Rondebosch, Pinelands, Tokai). Tier-2 (not
   excluded by the brief, flag on output): Malmesbury/Swartland, Hermanus/Overberg, Ceres/Tulbagh.
   Explicit NOT list per brief: George, Knysna, "Mossel Bay", "Plettenberg Bay", Oudtshoorn, Langebaan,
   Saldanha, Vredenburg, Worcester.
2. **No title clause.** Add: "Financial Accountant" OR "Senior Accountant" OR "Group Accountant" OR
   "Management Accountant" OR "Cost Accountant" OR "Project Accountant" OR "Fund Accountant" OR
   "Reporting Accountant" OR "Financial Manager" OR "Finance Manager" OR "Financial Controller" OR
   "Accounting Manager" OR "Finance Business Partner" OR "FP&A" OR "Head of Finance" OR "Finance
   Director" OR CFO OR Bookkeeper (PA(SA) practice roles) OR "Tax Practitioner".
3. **No NOT clause.** Exclude: student, trainee, "article clerk", "SAIPA trainee", "training contract",
   candidate, affiliate, "studying towards", "in progress", "part-qualified", "passed finalist",
   "CIMA Adv Dip", "Advanced Diploma", recruiter, recruitment, "talent acquisition", vacancy, hiring,
   "job opportunity". (Pipeline note: "Eligible to register as AGA(SA)" appears in headlines — those
   are *not* registered members; two were found and parked as PIPELINE.)
4. **Missing designation variants.** `"Professional Accountant (S.A)"`, `"Professional Accountant
   (S.A.)"`, `"Prof Acc (SA)"`, `"Professional Accountant(SA)"`, `"SAIPA member"`, `"registered with
   SAIPA"`, `"Associate General Accountant (South Africa)"`, `"AGA SA"`, `"AGA (SA)"`,
   `"ACMA(CGMA)"`, `"ACMA CGMA"` (no comma), `"Chartered Management Accountant"`, `"Chartered Global
   Management Accountant"`, `"CIMA member"`, `"ACCA affiliate"` (→ NOT — affiliates are not members).
5. **Operator behaviour.** Google/Bing ignore punctuation: `"PA(SA)"` = `"PA (SA)"` = `PA SA` → hopeless
   noise in X-ray; use the long forms in X-ray and keep the abbreviations for LinkedIn native search
   (which does honour them). Prefer `site:linkedin.com/in` (add `site:za.linkedin.com/in`), and the
   LinkedIn location token `"City of Cape Town"` — it was the most selective token this session.
6. **CGMA ambiguity.** CGMA is also awarded via AICPA to US CPAs; bare `CGMA` without CIMA/ACMA/FCMA
   needs a CIMA reference before counting as a CIMA member.
7. **ACCA non-fellows are under-indexed.** Members rarely put "ACCA" in the name field; they write
   "ACCA qualified", "Chartered Certified Accountant" or "ACCA member" in About. Use LinkedIn native
   search with the Licences & Certifications filter (issuer ACCA) rather than X-ray.
8. **Sage 300 string.** `("Sage 300" OR Sage300 OR "Sage 300cloud" OR "Sage 300 ERP" OR Accpac OR
   "Sage Accpac" OR ACCPAC)` NOT `"Sage 300 People"` (that is the payroll/HR product).
9. **Seniority / years / salary band not defined.** Pool spans owner-practitioners (SAIPA) to
   corporate CIMA finance leads; the export carries `estimated_years_experience` where evidenced.
10. **Adjacent designations the brief omits** (flag for decision, not captured): CIBA — BAP(SA) /
    CBA(SA) / CBAP(SA); IAC — FIAC; AT(SA) (SAIPA technician); SAIT tax practitioner-only.
11. **Compliance posture.** Public professional information only; no scraping behind login; record
    an "as at" date; URLs only when actually seen; POPIA — processing for recruitment on a legitimate
    interest basis, with the data subject's public professional profile as source.

## 3. Ready-to-paste search strings

### 3a. LinkedIn native (Recruiter / Sales Navigator / linkedin.com people search)
Keywords box (location set via the Location filter = Cape Town, Western Cape, South Africa + towns):

```
("Professional Accountant (SA)" OR "PA(SA)" OR "PA (SA)" OR "Professional Accountant (S.A)" OR "SAIPA member" OR "registered with SAIPA"
 OR "AGA(SA)" OR "AGA (SA)" OR "Associate General Accountant"
 OR ACCA OR FCCA OR "Chartered Certified Accountant" OR "ACCA qualified" OR "ACCA member"
 OR ACMA OR FCMA OR CGMA OR "CIMA qualified" OR "CIMA member" OR "Chartered Management Accountant")
NOT (student OR trainee OR "article clerk" OR "training contract" OR candidate OR affiliate OR "studying towards" OR "in progress"
     OR "part-qualified" OR "passed finalist" OR "Advanced Diploma" OR recruiter OR recruitment OR "talent acquisition" OR vacancy OR hiring)
```
Run once per designation family (the OR-all string dilutes relevance ranking). Add the title clause
from §2.2 as a second run for commerce-and-industry candidates, and use the **Licences &
Certifications** filter (issuer = SAIPA / SAICA / ACCA / CIMA) — it catches people who never put
letters in their name field.

### 3b. Google / Bing X-ray (public pages only)
```
site:linkedin.com/in "Professional Accountant (SA)" "City of Cape Town"
site:linkedin.com/in "Professional Accountant (SA)" (Stellenbosch OR Paarl OR "Somerset West" OR Durbanville OR Bellville)
site:linkedin.com/in "Associate General Accountant" ("Cape Town" OR "Western Cape")
site:linkedin.com/in ("AGA(SA)" OR "AGA (SA)") "City of Cape Town"
site:linkedin.com/in ("ACMA, CGMA" OR "ACMA CGMA" OR "FCMA, CGMA") "City of Cape Town"
site:linkedin.com/in ("ACMA, CGMA" OR "Chartered Management Accountant") (Stellenbosch OR Paarl OR "Somerset West" OR "Western Cape")
site:linkedin.com/in ("FCCA" OR "Chartered Certified Accountant" OR "ACCA member" OR "ACCA qualified") ("City of Cape Town" OR "Western Cape")
site:linkedin.com/in "completed SAIPA articles" OR "SAIPA articles" "Cape Town"          ← pipeline + PA(SA) neighbours
site:linkedin.com/in ("Sage 300" OR Accpac) ("Professional Accountant (SA)" OR "AGA(SA)" OR ACMA OR CGMA OR ACCA) "Cape Town"
```
Each hit page exposes "Other similar profiles" people-cards (name field + employer + location) —
harvest them; they were the richest discovery surface this session.

### 3c. Employer / structure sweeps (LinkedIn native: Current company = X, keywords = designation)
WC-headquartered or WC-heavy finance teams: Shoprite, Woolworths, TFG, Pepkor, Truworths, Clicks,
Pick n Pay, Cape Union Mart, Mr Price (CT), Sanlam, Old Mutual, Santam, Allan Gray, Coronation,
Ninety One, PSG, Capitec, Investec CT, Media24/Naspers/Takealot, Mediclinic, Sun International
GrandWest, Nampak, Kaap Agri, PepsiCo SA (Pioneer Foods), Oceana, Sea Harvest, I&J, Astral (County
Fair), Heineken Beverages/Distell, Curro, City of Cape Town, WC Provincial Treasury, UCT/SU/UWC/CPUT,
JTC Group, Maitland/Apex, Sanne, IQ-EQ (fund admin — strong PA(SA)/ACCA pool), Ozow, Yoco, Rain.

## 4. Source map — what worked, what didn't (session 3 evidence)

| Source | Yield for non-CA WC | Notes |
|---|---|---|
| LinkedIn X-ray with exact designation string + `"City of Cape Town"` | **High** | Own pages with Licences/About wording (CONFIRMED) + people-cards (HIGH). |
| Firm team pages with per-person designation (APBCO) | **High (CONFIRMED)** | Designation and year printed per person. |
| Firm honour rolls (MD Streets "SAICA and SAIPA Honour's Roll") | **High (CONFIRMED designation)** | 12 PA(SA) + 1 enrichment; current employer must be resolved separately. |
| SAIPA site (annual report, magazine) | Medium | Board/regional bios name PA(SA)s; dated (2019). SAIPA member-verification tool is interactive (name-by-name) — use for confirmation, not discovery. |
| SAICA "Find a member"/AGA(SA) register | Confirmation only | Interactive; not indexable. |
| ACCA / CIMA member directories | Confirmation only | ACCA "Find an accountant" lists practising-certificate holders only; CIMA has no public register. |
| Moore SA partner directory | Low | Names/titles only; bios needed. |
| TheOrg.com org charts | Blocked (reCAPTCHA) | Manual browsing only; titles without designations. |
| Job boards (PNet/Careers24/BizCommunity) | None for people | Useful only to identify SAIPA/CIMA-hiring employers (e.g. IGrow Wealth Durbanville hires PA(SA)). |
| Public forums (MyBroadband, Reddit r/southafrica, TaxTim) | None | Anonymous handles; no identity value. |
| ZoomInfo / RocketReach snippets | Low-medium | Provide employer + a LinkedIn `sameAs` URL — treat as third-party; verify. |

## 5. Practical notes for the resourcer

- **Tiering on the export.** CONFIRMED rows can go straight to outreach. HIGH_CONFIDENCE people-card
  rows need one click on the search link to open the profile and confirm the headline. MD Streets
  honour-roll rows are verified PA(SA)s whose *current* employer must be checked on LinkedIn.
- **Dual-qualified stand-outs:** Johan van Schalkwyk, Rudi van Zyl (15+ yrs), Irene Rupert, Lize
  Vorster (CIMA + SAIPA); Fatima Bapukee (PA(SA) 2012 → CA(SA) 2024).
- **Fund-administration cluster (Cape Town):** JTC Group (Wynand Nel PA(SA), Sifiso Fakude SAIPA
  articles), Nobungcwele Gaxela PA(SA) (Senior Fund Accountant) — fund admin firms (JTC, Apex/Maitland,
  IQ-EQ, Sanne) are a dense PA(SA)/ACCA seam worth a dedicated sweep.
- **Openness signals:** Sifiso Fakude's headline says "ready to make a career move".
- **Sage 300 / ACCPAC:** no person-linked evidence yet. Best next route: Sage 300 reseller case
  studies in the WC (client lists → finance teams), then LinkedIn native search with the §2.8 string.
- **Do not contact via scraped e-mails**; use LinkedIn InMail / firm switchboards.

## 6. Recommended next sweeps (priority order)

1. Resolve the 13 people-card URLs and the 12 MD Streets alumni's current employers (LinkedIn native).
2. ACCA members (zero non-fellow records): LinkedIn native with Licences filter issuer = ACCA, location
   Cape Town; plus SDK Chartered Accountants (ACCA-accredited trainer, Durbanville) alumni.
3. Fund-admin employer sweep (JTC, Apex, IQ-EQ, Sanne, Maitland) for PA(SA)/ACCA/CIMA.
4. Moore Stellenbosch Management Services CIMA alumni; Curro/Mediclinic/Capitec/Shoprite CIMA teams.
5. SAIPA practice team pages: Schoemans, Exceed, Zuydam Konsult, C2M, Theron du Plessis Helderberg,
   Lintvelt & Co, IGrow Wealth, Zeelie (LinkedIn company page — website is empty), SDK, Deon Poolman
   (verify), Galbraith Rushby.
6. Expand geography (Gauteng next) once WC core is saturated; Nkateko Maloox AGA(SA) already parked.
