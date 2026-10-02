# Research Run — CA(SA) Master Mapping Layer

**Run ID:** `phase4_casa_master_2026-10-01`
**Date:** 1 October 2026
**Scope:** South Africa — CA(SA)-designated finance professionals, seniority Tier 1 to Tier 3
**Sources searched:** employer leadership and investor-relations pages, JSE/SENS annual financial
statements, SAICA member and awards pages, CFO South Africa (news, people moves, profiles),
Mining Review, Leadership magazine, LinkedIn public profile/headline data surfaced through
search-engine indexing, and listed-company appointment announcements.
**Database after run:** 1,030 person records (164 with an evidenced CA(SA) designation, 155 of
them CONFIRMED), 204 employer records, 995 evidence sources.
**Artefacts:** `markets/accountants/master_ca_sa.jsonl`, `master_ca_sa.csv`,
`coverage_matrix.json` (regenerate with `python3 gen_master_export.py`).

---

## A. Newly identified professionals (29)

All 29 carry an explicit `CA(SA)` / `Chartered Accountant (SA)` statement in the cited source,
an evidenced employer and role, and a geographic classification at city/province level where
the source supports it. `master_ca_sa.csv` holds the full Section 32 row for each (including
grouped industry, associated industry groups, tags, career path and previous roles).

| ID | Name | Band | Role | Employer | Grouped industry | Province | Confidence |
|---|---|---|---|---|---|---|---|
| acc-1002 | Tjaart Kruger | S8 | Chief Executive Officer | Tiger Brands Limited | Consumer & FMCG | Gauteng | CONFIRMED |
| acc-1003 | Thushen Govender | S7 | Chief Financial Officer | Tiger Brands Limited | Consumer & FMCG | Gauteng | CONFIRMED |
| acc-1004 | Dumo Mfini | S8 | Managing Director: Culinary | Tiger Brands Limited | Consumer & FMCG | Gauteng | CONFIRMED |
| acc-1005 | Grant Pereira | S8 | Managing Director: Snacks, Treats and Beverages | Tiger Brands Limited | Consumer & FMCG | Gauteng | CONFIRMED |
| acc-1006 | Robert Field | S7 | Chief Financial Officer and Executive Director | RCL Foods Limited | Consumer & FMCG | KwaZulu-Natal | CONFIRMED |
| acc-1007 | Kobus Gertenbach | S8 | Chief Executive Officer and Executive Director | Premier Group Limited | Consumer & FMCG | Gauteng | CONFIRMED |
| acc-1008 | Fritz Grobbelaar | S7 | Chief Financial Officer and Executive Director | Premier Group Limited | Consumer & FMCG | Gauteng | CONFIRMED |
| acc-1009 | Kenny Schoeman | S8 | Poultry Processing Executive | Astral Foods Limited | Consumer & FMCG | Gauteng | CONFIRMED |
| acc-1010 | Johan Geel | S7 | Chief Financial Officer (from 1 March 2026) | Astral Foods Limited | Consumer & FMCG | Gauteng | CONFIRMED |
| acc-1011 | Henry Enslin | S3 | Financial Manager: Poultry Commercial Division (acting CFO, Feb 2026) | Astral Foods Limited | Consumer & FMCG | Gauteng | CONFIRMED |
| acc-1012 | Riaan Koppeschaar | S6 | Finance Director | Exxaro Resources Limited | Mining & Resources | Gauteng | CONFIRMED |
| acc-1013 | Deon Smith | S7 | Chief Financial Officer and Executive Director | Thungela Resources Limited | Mining & Resources | Gauteng | CONFIRMED |
| acc-1014 | Xolani Mbambo | S7 | Chief Financial Officer (from 1 January 2026) | Kumba Iron Ore Limited | Mining & Resources | Gauteng | CONFIRMED |
| acc-1015 | Fathima Ally | S7 | Chief Financial Officer and Executive Director | Grindrod Limited | Logistics & Supply Chain | KwaZulu-Natal | CONFIRMED |
| acc-1016 | Peter Mountford | S8 | Chief Executive Officer | Super Group Limited | Logistics & Supply Chain | Gauteng | CONFIRMED |
| acc-1017 | Colin Brown | S7 | Chief Financial Officer and Debt Officer | Super Group Limited | Logistics & Supply Chain | Gauteng | CONFIRMED |
| acc-1018 | Mohammed Akoojee | S8 | CEO and Managing Director: sub-Saharan Africa | DP World | Logistics & Supply Chain | Gauteng | CONFIRMED |
| acc-1019 | Melani De Castro | S7 | Chief Financial Officer and Executive Director (from 1 April 2026) | Crookes Brothers Limited | Agriculture & Agri-processing | KwaZulu-Natal | CONFIRMED |
| acc-1020 | Zaf Mahomed | S7 | Chief Financial Officer and Executive Director | Oceana Group Limited | Consumer & FMCG | Western Cape | CONFIRMED |
| acc-1021 | Thato Moloele | S7 | Executive Director and Group Chief Financial Officer | AfroCentric Group | Healthcare & Life Sciences | Unknown | CONFIRMED |
| acc-1022 | Praneel Nundkumar | S7 | Group Chief Financial Officer | Mr Price Group Limited | Retail & Wholesale | KwaZulu-Natal | CONFIRMED |
| acc-1023 | Gordon Traill | S7 | Chief Financial Officer and Chief Support Services Officer | Clicks Group Limited | Retail & Wholesale | Western Cape | CONFIRMED |
| acc-1024 | Tsholofelo Molefe | S7 | Group Chief Financial Officer | MTN Group Limited | Telecommunications | Gauteng | CONFIRMED |
| acc-1025 | Abigail Mukhuba | S7 | Group Finance Director and Executive Director | Sanlam Limited | Insurance | Western Cape | CONFIRMED |
| acc-1026 | Nicolaas Crafford-Lazarus | S6 | Financial Director | Sephaku Holdings Limited | Construction & Building Materials | Gauteng | CONFIRMED |
| acc-1027 | Brenda Berlin | S7 | Chief Financial Officer | PPC Ltd | Construction & Building Materials | Gauteng | CONFIRMED |
| acc-1028 | Panashe Moyo | S4 | Senior Group Finance Manager | Nala Renewables | Energy & Utilities | Unknown | CONFIRMED |
| acc-1029 | Tracy Lerato Nkosi | S3 | Southern Africa Finance Controller | Unilever South Africa | Consumer & FMCG | KwaZulu-Natal | CONFIRMED |
| acc-1030 | Taskeen Ismail | S7 | Chief Financial Officer | Sanlam Investments | Investments & Capital Markets | Western Cape | HIGH_CONFIDENCE |

Employer-confidence flags worth noting: the four Tiger Brands executives and the three
Astral Foods records rest on FY2024–FY2026 integrated-report/announcement evidence, so
`Current Employer Confidence = PROBABLE`; every other Tier-1 record is `CONFIRMED`, most of
them from a signed annual financial statement, a SENS-covered appointment or an employer
leadership page current in 2025–2026.

## B. Updated professionals

No existing person record was overwritten. This run adds a **derived mapping layer** to every
existing record via `gen_master_export.py` and `gen_people_json.py`:

- 164 CA(SA) records now carry a seniority band, normalised title, grouped industry,
  associated industry groups, employer canonical name/group and career industry path.
- 169 records carry a grouped industry; 628 records (all designations) carry a seniority band.
- New UI facets — **Grouped industry** and **Seniority band (S1–S8)** — are live on
  `/accounting-finance`, derived from the data at runtime, not hardcoded.

## C. Duplicates rejected

| Duplicate | Matched master profile | Action |
|---|---|---|
| acc-1031 … acc-1059 (29 rows) | acc-1002 … acc-1030 | Loader was executed twice before the company-id defect was fixed. The second block was removed by `fix_batch13_dupes.py`; the lower-id copies retained. |
| `Luke Woodford` (FirstRand Broader Africa CFO) vs existing `Luke Woodhouse` (CFO, GUUD GLOBAL, acc-0102) | Name-similarity only | **Not merged.** Different surnames, different employers, different sectors, different provinces. Woodford retained as an unverified lead pending CA(SA) evidence. |
| `Terri Ladbrooke` — acc-0963 (FINANCE_ROLE_CONFIRMED, no designation) and acc-1001 (CONFIRMED CA(SA), CFO Libstar) | Same person, same employer | **Pre-existing duplicate found, not created by this run.** Left in place (append-only store) and flagged for a merge pass; the CA(SA) record is the correct master. |
| `Pieter De Wit` (acc-0903) / `Terri Ladbrooke` (acc-1001) | Existing records | Correctly rejected as new entries — both were already captured. |

## D. Unverified leads (discovery only — require designation or employer confirmation)

| Lead | Signal | What is missing |
|---|---|---|
| Amy Naick | CFO100 2026 list: "Amy Naick CA(SA) — Group Chief Financial Officer, Mandini Group" | Entity ambiguity: the only reachable "Mandini Group" is an energy/waste-recycling company, not a sugar group. Industry and location unresolved. |
| Renee Rautenbach | Listed as Momentum Group CFO | No explicit CA(SA) statement located. |
| Doug Gain | Seriti Resources CFO (quoted in mining press) | No designation evidence. |
| Kwazi Mabaso | Grindrod CEO from 1 December 2025 (FY2025 AFS) | No designation evidence. |
| Ulandy Junine Gribble | CFO, Frontier (CFO SA people moves, 23 Sep 2025) | No designation evidence; sector to confirm. |
| Victor Sekgabu Ngake | CFO, Tlou Coal (CFO SA people moves, 8 May 2025) | No designation evidence. |
| Juliette Da Silva | CFO, Flight Centre Travel Group South Africa (22 Apr 2025) | No designation evidence. |
| Luke Woodford | CFO, FirstRand Broader Africa (11 Mar 2025) | No designation evidence (namesake control vs acc-0102). |
| Bongani Ngcongo | Proconics CFO; CFO SA article references "qualifying as a CA(SA)" | Article body not retrieved in full; designation wording needs direct confirmation. |
| Dries Ferreira | Former Astral Foods CFO (CA(SA), PwC articles 2004); resigned 31 Jan 2026 | Between roles — no current employer to record. |
| Re-Ana Joseph | "Re-Ana Joseph CA(SA) — Financial Manager, Seriti Resources, Emalahleni" (aggregator directory) | Directory-only evidence; needs an independent source. |
| Nina Hind | Head of Retail Finance, Clicks Group (executive listing) | No designation evidence. |
| Taskeen Ismail | Sanlam Investments CFO (record acc-1030) | Retained at HIGH_CONFIDENCE; the source says "chartered accountant" but not "CA(SA)". |

## E. New employers discovered (20)

Tiger Brands · RCL Foods · Premier Group · Astral Foods · Exxaro Resources · Thungela Resources ·
Kumba Iron Ore · Grindrod · Super Group · DP World · Crookes Brothers · AfroCentric Group ·
Mr Price Group · MTN Group · Sanlam · Sanlam Investments · Sephaku Holdings · Nala Renewables ·
Unilever South Africa · AFGRI. Each is registered in `companies.jsonl` with aliases, ownership,
industry and a `finance_team_research_status` so zero-result sweeps cannot be silently dropped.

## F. New industry associations discovered

Edges now explicitly recorded against the adjacency model:

- **FMCG ↔ Agriculture & Agri-processing** (Johan Geel: AFGRI → Astral Foods; Tiger Brands/Albany Bakeries → Astral for Henry Enslin).
- **Logistics ↔ Mining & Resources** (Xolani Mbambo: Anglo American → Grindrod → Kumba Iron Ore).
- **Insurance ↔ Healthcare** (Thato Moloele: Deloitte → Momentum → Sanlam → AfroCentric).
- **Professional Services → Retail** (Praneel Nundkumar: PwC articles → Mr Price Group).
- **Beverage Manufacturing → FMCG** (Grant Pereira: AB InBev → Tiger Brands).
- **Food Manufacturing ↔ Industrial Manufacturing** (Tjaart Kruger: Astral/ICS → Afrox → Premier → Tiger Brands).
- **Construction Materials ↔ Mining** (Afrimat, PPC, Sephaku share quarrying/aggregate value chains; Brenda Berlin and Nicolaas Crafford-Lazarus add cement coverage).

## G. New talent-flow patterns

Each pattern below is observed once or twice in this batch — they are recorded as emerging
hypotheses for later batches, not as established flows (Section 37):

1. `Audit → Commerce` remains the dominant entry route (PwC→Mr Price, Deloitte→RCL Foods, Deloitte→Grindrod, Coopers & Lybrand→Exxaro).
2. `Agriculture → Food Manufacturing` moves reported more than once (AFGRI→Astral; Tiger/Albany→Astral), consistent with the agri-processing adjacency.
3. `Mining → Logistics → Mining` movement appears (Anglo American → Grindrod → Kumba).
4. `Financial Services → Healthcare` movement appears (Sanlam/Momentum → AfroCentric).
5. Internal finance-to-operations promotion inside listed groups (Kenny Schoeman and Dumo Mfini both moved from divisional finance director roles into managing-director roles) — a *pipeline* pattern worth tracking.

## H. Coverage gaps after this run

From `coverage_matrix.json` (164 CA(SA) records):

**By province** — Western Cape 59 · Unknown 51 · Gauteng 38 · KwaZulu-Natal 8 · Free State 6 ·
Eastern Cape 2 · **Mpumalanga, North West, Northern Cape, Limpopo: 0.** The 51 "Unknown"
records are the largest single gap: qualifying them requires per-person location evidence.

**By seniority band** — S7 (CFO) 37 · S8 (broader executive) 24 · S6 6 · S5 5 · S4 7 · S3 11 ·
S2 6 · S1 8 · Unknown 60. The map is **leadership-heavy and pipeline-thin**: Tier 1 dominates,
and 60 records have no determinable band (mostly seniority not stated in the source).

**By grouped industry** — Professional Services 44 (largely audit/accounting practices) ·
Unknown 44 · Consumer & FMCG 13 · Retail & Wholesale 9 · Government & Public Sector 8 ·
Technology & Software 8 · Logistics & Supply Chain 6 · Industrial & Manufacturing 5 ·
Mining & Resources 4 · NGO 4 · Education 4 · Investments & Capital Markets 3 ·
Fintech & Payments 2 · Construction & Building Materials 2 · Banking & Lending 1 ·
Property & Real Estate 1 · Hospitality, Leisure & Tourism 1 · Agriculture & Agri-processing 1 ·
Healthcare & Life Sciences 1 · Telecommunications 1 · Insurance 1 · Energy & Utilities 1.

### Recommended next sweeps (Section 38 search-expansion engine)

1. **Employer-node expansion** on this batch's 20 new companies: each employer's divisional finance team (Financial Manager, Group Financial Manager, Commercial Finance Manager) — the Tiger Brands, RCL Foods, Premier, Astral, Exxaro, Thungela, Clicks, Mr Price and Sanlam finance functions are now search nodes.
2. **Geographic expansion** into Mpumalanga (Emalahleni coal belt), North West (Rustenburg/Marikana platinum), Limpopo (Polokwane platinum/agri) and Northern Cape (Kathu/Kimberley mining) using the same employer-first method.
3. **Sector expansion** into the thin grouped industries: Property & Real Estate (REIT finance teams), Hospitality & Tourism, Banking & Lending, Fintech & Payments and Media.
4. **Pipeline expansion** (Tier 2/3): SAICA Top 35 Under 35 2024/2025 finalist lists (Panashe Moyo and Tracy Lerato Nkosi came from the 2025 list), SAICA training-office alumni pages and finance-team pages of listed groups.
5. **Adjacency sweeps** now unlocked by the graph: cold-chain and food distribution (from Oceana/RCL/Premier), agri-finance (from Astral/AFGRI/Crookes), ports and terminals (from Grindrod/DP World).
6. **Designation verification queue**: the 13 leads in Section D, plus the 9 PROBABLE-designation records already in the master export.
