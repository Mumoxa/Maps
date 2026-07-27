# South Africa SAP CAR / POSDTA Market Map — Final Sweep

**Prepared:** 2026-07-24  
**Scope:** South African companies with public confirmation of interaction with SAP Customer Activity Repository (SAP CAR), especially **POS Data Transfer & Audit (POSDTA)**, plus the SAP CAR modules **Demand Data Foundation (DDF)**, **Unified Demand Forecast (UDF)**, and **Omni-Channel Article Availability (OAA)**.  
**Evidence standard:** no invention, no unverified technographic lists, and no inference from generic SAP adoption.

---

## 1. Final sweep outcome

### Strict POSDTA-confirmed end users
Only **Pick n Pay Group** has high-confidence public confirmation of SAP CAR **and POSDTA** in South Africa.

### Broad SAP CAR-confirmed end users
Two South African end-user organisations have acceptable public confirmation of SAP CAR interaction:

1. **Pick n Pay Group** — SAP CAR + POSDTA confirmed by SAP and implementation partner Beyond Technologies.
2. **Shoprite Group** — SAP CAR is publicly confirmed as part of Shoprite’s SAP Retail landscape via a Shoprite-posted job advert; additional SAP/GK sources support SAP Retail integration context. POSDTA is **not** publicly confirmed for Shoprite.

### DDF / UDF / OAA in South African end users
No accepted public source found confirming DDF, UDF, or OAA deployment at a named South African end-user. Provider pages and AFSUG/SAP materials describe these modules, but they do not identify a South African customer using them.

---

## 2. Evidence rules used

### Accepted
- SAP, customer, or implementation-partner case studies / press releases.
- Official or clearly company-posted job adverts that name SAP CAR as part of the company landscape.
- Official partner/provider pages for ecosystem mapping.
- Vendor customer stories that identify a relevant SAP solution in the customer landscape.

### Not accepted for strict end-user confirmation
- Generic technographic/customer-list databases without underlying source evidence.
- ZoomInfo/ContactOut/person-data pages.
- LinkedIn profile snippets where the claim is not backed by a company or implementation source.
- Job-search aggregator snippets if the original job page could not be validated.
- Generic SAP CAR explainer articles.

---

## 3. Confirmed end-user market map

| Company | Sector / role | Evidence tier | Publicly confirmed SAP CAR interaction | POSDTA | DDF | UDF | OAA | Business context | Key sources |
|---|---|---:|---|---|---|---|---|---|---|
| **Pick n Pay Group** | FMCG grocery and general merchandise retailer; brands include Pick n Pay, Boxer and TM | **Tier A — direct SAP + implementation-partner confirmation** | SAP Africa says Pick n Pay chose and implemented SAP Customer Activity Repository to eliminate processing/reconciliation delays. Beyond Technologies says Pick n Pay selected SAP CAR as replacement platform for its previous SAP POSDM application. | **Confirmed**. SAP Africa explicitly references POSDTA operations; Beyond says implementation focused on POSDTA and master data as POSDM replacement. | Not explicitly confirmed. Beyond says “required master data,” but does not name DDF. | Not explicitly confirmed. Pick n Pay IR mentions forecast-driven replenishment enabled by integrated SAP platform, but not UDF. | Not explicitly confirmed. | >30bn transaction-volume context; transaction/reconciliation acceleration; real-time data and analytics; e-commerce stock/inventory visibility; one-click administrative and financial reporting. | SAP Africa; Beyond Technologies; OpenText; Pick n Pay Investor Relations |
| **Shoprite Group** | Grocery and omnichannel retail group; brands include Shoprite, Checkers, Usave, LiquorShop, etc. | **Tier B — company job advert confirms CAR landscape; partner/SAP sources support SAP Retail context** | A Shoprite-posted CareerJunction job advert states the SAP Retail system consists of Retail, GTS, Finance, Gateway and **CAR**. GK Software also quotes Shoprite CIO on SAP merchandise-management integration and describes GK OmniPOS data streams with SAP CPI, CAR and S/4HANA, proven at Shoprite. | Not publicly confirmed. | Not publicly confirmed. | Not publicly confirmed. | Not publicly confirmed. | SAP News says Shoprite is the largest SAP retail customer by number of transactions. SAP News also says SAP Retail is the stock ledger and real-time-sales source for Sixty60 fulfilment and supplies promotional information, prices and article data. This supports SAP Retail maturity, not module-level CAR proof. | CareerJunction/Shoprite job advert; GK Software; SAP Africa; Shoprite B2B EDI guide |

---

## 4. Module evidence matrix

| Company | SAP CAR | POSDTA | DDF | UDF | OAA | Conclusion |
|---|---|---|---|---|---|---|
| Pick n Pay Group | Confirmed | **Confirmed** | Not publicly confirmed | Not publicly confirmed | Not publicly confirmed | Only POSDTA is explicitly confirmed. Do not infer DDF/UDF/OAA from “master data” or “forecast-driven replenishment.” |
| Shoprite Group | Confirmed | Not publicly confirmed | Not publicly confirmed | Not publicly confirmed | Not publicly confirmed | CAR landscape interaction is confirmed, but no accepted public source confirms specific CAR modules. |

---

## 5. Ecosystem / providers active in the South African SAP CAR market

| Company | Role | Public SAP CAR / POSDTA interaction | South Africa link | Use in map |
|---|---|---|---|---|
| **Beyond Technologies South Africa** | SAP implementation partner / consultancy | Implemented Pick n Pay SAP CAR with focus on POSDTA and required master data; helped reconciliation solution. | Offices listed in Bryanston, Johannesburg and Green Point, Cape Town. | Confirmed ecosystem actor and Pick n Pay implementation partner. |
| **SAP Africa / SAP SE** | Vendor / publisher | SAP Africa published Pick n Pay SAP CAR deployment; SAP product materials describe SAP CAR applications bundle. | SAP Africa site; SAP Southern Africa regional director quoted in Pick n Pay article. | Primary vendor source. |
| **retailsolutions AG South Africa** | SAP Retail consultancy | Public service pages for SAP CAR, POSDTA and UDF. Customer references on SA-hosted pages are mostly non-South African examples. | retailsolutions home page lists South Africa as a location. | Provider capability only; no named SA end-user found. |
| **Britehouse / Dimension Data / NTT** | SAP Retail services practice | Launch announcement says Britehouse SAP Retail practice covers core ERP, CAR, BI, customer engagement and commerce. | Johannesburg release; Middle East and Africa including South Africa. | Provider capability only; no named CAR end-user in release. |
| **GK Software Africa** | Store/POS solution provider; SAP integration partner | GK Model Company uses data streams between GK OmniPOS and SAP CPI, CAR and S/4HANA; blog quotes Shoprite CIO. | GK Software Africa office listed in Sandton. | Supports Shoprite SAP integration context; ecosystem actor. |
| **OpenText / VicIT** | Testing / DevOps tooling around SAP landscape | OpenText Pick n Pay story says Pick n Pay uses SAP POSDTA solutions among mission-critical systems. | Pick n Pay SA customer story. | Supporting source for Pick n Pay POSDTA landscape. |

---

## 6. Watchlist / excluded companies

| Company | Observed signal | Why not strict-confirmed |
|---|---|---|
| **Woolworths Holdings / Woolworths South Africa** | Strong CAR/POSDTA evidence exists for Woolworths Group Australia; a weak/ambiguous LinkedIn signal appears for Woolworths SA. | No accepted company, SAP, or partner source tying Woolworths Holdings South Africa to SAP CAR/POSDTA. Do not conflate with Woolworths Group Australia. |
| **Massmart** | Public LinkedIn profile signal says Massmart daily IT operations include SAP CAR, S/4HANA, ECC, GKPOS. Official Massmart pages confirm only broad SAP ERP / applications context. | Employee profile is public but not a company/partner deployment confirmation. Not strict enough. |
| **Pepkor / JD Group / Pepkor Lifestyle** | Aggregator listing for Pepkor Lifestyle SAP SD role mentions POSDM/POSDTA; search snippets show JD Group SAP CAR roles. | Original official job pages could not be validated. Signals imply skills/operations, not confirmed deployment. |
| **SPAR Group South Africa** | Public SAP ERP/S/4HANA implementation coverage exists. | No accepted CAR/POSDTA source found. |
| **TFG / The Foschini Group** | General SAP/HANA/analytics references only. | No accepted CAR/POSDTA source found. |
| **Clicks Group** | SAP interfacing/project references found. | No accepted CAR/POSDTA source found. |
| **Dis-Chem** | No reliable CAR/POSDTA source found. | Excluded. |
| **Truworths** | No reliable CAR/POSDTA source found. | Excluded. |
| **Mr Price Group** | No reliable CAR/POSDTA source found. | Excluded. |
| **Food Lover’s Market** | No reliable CAR/POSDTA source found. | Excluded. |
| **Avolta, Bergendahls, Coop Norge, Axfood, Valora, etc.** | Appear as customer references on South Africa-hosted provider pages. | Not South African companies/end users for this map. Retain only as proof of provider capability. |

---

## 7. Final sweep search coverage

The final sweep covered:

- Direct terms: “SAP POSDTA South Africa,” “SAP POS DTA South Africa,” “POSDM POSDTA South Africa retail,” “SAP CAR South Africa POSDTA.”
- Module terms: “Demand Data Foundation South Africa,” “Unified Demand Forecast South Africa,” “Omnichannel Article Availability South Africa,” “SAP OAA South Africa.”
- Named retailer searches: Pick n Pay, Shoprite/Checkers, Woolworths SA, Massmart/Makro/Game/Builders, SPAR, Pepkor/JD/Pepkor Lifestyle, TFG, Mr Price, Clicks, Dis-Chem, Truworths, Food Lover’s Market, Cashbuild, Italtile, Takealot.
- Official domains: shopriteholdings.co.za, b2b.shopriteholdings.co.za, picknpayinvestor.co.za, pnp.co.za, massmart.co.za, woolworths.co.za, JD/Pepkor career domains.
- Ecosystem/event sources: AFSUG, Mastering SAP Africa, South African Retail Forum, retailsolutions, Britehouse, GK Software, Beyond Technologies, SAP Africa.

**Outcome:** no additional strict-confirmed South African SAP CAR/POSDTA end users were found beyond Pick n Pay; Shoprite remains broad-CAR-confirmed but module-unconfirmed.

---

## 8. Source register

1. SAP Africa News Center — Pick n Pay Sparks Retail Revolution with Powerful SAP Deployment — https://news.sap.com/africa/2023/04/pick-n-pay-sparks-retail-revolution-with-powerful-sap-deployment/
2. Beyond Technologies — Pick n Pay: Building the retail business of the future with SAP CAR POSDTA — https://www.beyondtechnologies.com/news/pick-n-pay-sap-car/
3. OpenText customer story — Pick n Pay — https://www.opentext.com/customers/pick-n-pay
4. Pick n Pay Investor Relations — PnP at a glance — https://www.picknpayinvestor.co.za/pnp-at-a-glance.php
5. CareerJunction / Shoprite job advert — SAP Technical Consultant – Senior Fiori Developer at Shoprite Group — https://www.careerjunction.co.za/sap-technical-consultant-senior-fiori-developer-at-shoprite-group-job-2397944.aspx
6. GK Software — GK Model Company: an efficiency driver in every SAP retail project — https://www.gk-software.com/us/newsroom/blog/en-blog-20240116-gk-model-company
7. GK Software — About GK / South Africa office — https://www.gk-software.com/us/about/about-gk
8. SAP Africa — Shoprite Holdings Gains Market Share for the Fifth Consecutive Year — https://news.sap.com/africa/2024/10/shoprite-holdings-gains-market-share-for-the-fifth-consecutive-year/
9. SAP Africa — Checkers Online Shopping Bonanza — https://news.sap.com/africa/2024/07/checkers-online-shopping-bonanza/
10. Shoprite B2B Supplier RESTful API technical guide — https://b2b.shopriteholdings.co.za/B2BWebAPISupplierServices/Home/About
11. ITWeb / Britehouse — Britehouse launches SAP Retail practice — https://www.itweb.co.za/article/britehouse-launches-sap-retail-practice/G98Yd7Lx2np7X2PD
12. retailsolutions SA — SAP Customer Activity Repository — https://www.retailsolutions-sa.co.za/focus-areas/omnichannel-customer-centricity/sap-customer-activity-repository
13. retailsolutions SA — POSDM to POSDTA — https://www.retailsolutions-sa.co.za/focus-areas/omnichannel-customer-centricity/posdta
14. retailsolutions SA — SAP UDF — https://www.retailsolutions-sa.co.za/focus-areas/forecasting-planning-applications/sap-udf-unified-demand-forecast
15. retailsolutions SA — Home / locations — https://www.retailsolutions-sa.co.za/
16. AFSUG PDF — SAP Customer Activity Repository overview for African SAP User Group — https://afsug.com/wp-content/uploads/2020/10/SAP-Customer-Activity-Repository-THE-omnichannel-platform.pdf
17. SAP product page — SAP Customer Activity Repository applications bundle — https://www.sap.com/africa/products/crm/customer-activity-repository.html

---

## 9. Key caveats

- This is a **public-evidence** map, not a license audit. Private deployments may exist.
- Do not infer SAP CAR/POSDTA from generic SAP Retail, S/4HANA or SAP ERP usage.
- Do not infer DDF/UDF/OAA from “master data,” “forecast-driven replenishment,” “inventory visibility,” or “real-time sales” unless the source names the module or unambiguously describes that specific CAR component.
- For Shoprite, the public record supports SAP Retail maturity and broad CAR landscape inclusion, but **not** public confirmation of POSDTA, DDF, UDF, or OAA.
