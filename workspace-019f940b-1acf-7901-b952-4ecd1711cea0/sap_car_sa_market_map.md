# South Africa SAP CAR / POSDTA Public-Evidence Market Map

**Prepared:** 2026-07-24  
**Scope:** South African companies with public evidence of interaction with SAP Customer Activity Repository (SAP CAR), especially POS Data Transfer & Audit (POSDTA).  
**Important constraint:** This map uses only public sources. It does **not** infer usage from general SAP adoption, generic technographic databases, or unsourced/unstable people-data. Where module-level evidence is missing, the cell is marked "not publicly confirmed" rather than inferred.

## Evidence rules used

### Accepted as evidence
- SAP, customer, or implementation partner case studies/press releases.
- Company job adverts where the named company explicitly states SAP CAR is part of its landscape.
- Official SAP-retail partner service pages, for ecosystem/provider mapping.
- Stable customer stories from vendors used in the same landscape.

### Rejected / not used for confirmed end-user status
- Technographic list databases that do not show the underlying source.
- ZoomInfo/ContactOut-style contact pages, even when they mention a person's SAP CAR title.
- LinkedIn snippets or job-search snippets where the underlying job page could not be fetched or tied to an official company source.
- Generic SAP CAR explainer articles.

## Executive finding

### Strict POSDTA threshold
Only **Pick n Pay Group** has high-confidence public confirmation of SAP CAR **and** POSDTA use/implementation in South Africa.

### Broader SAP CAR threshold
Two South African end-user organisations have acceptable public confirmation of SAP CAR interaction:

1. **Pick n Pay Group** — SAP CAR + POSDTA, confirmed by SAP and implementation partner Beyond Technologies.
2. **Shoprite Group** — SAP CAR is publicly described as part of its SAP Retail system landscape in a Shoprite-posted job advert; GK Software also describes Shoprite SAP integration activity using SAP retail data streams that include CAR. No acceptable public source found confirming Shoprite POSDTA, DDF, UDF, or OAA specifically.

No accepted public evidence was found for South African end-user deployments of **DDF**, **UDF**, or **OAA**. Several South African service providers publicly market or implement those components, but that is provider capability rather than South African customer deployment.

## Confirmed end-user market map

| Company | Sector / role | Evidence tier | Publicly confirmed SAP CAR interaction | POSDTA | DDF | UDF | OAA | Public business context | Sources |
|---|---|---:|---|---|---|---|---|---|---|
| Pick n Pay Group | FMCG grocery and general merchandise retailer; brands include Pick n Pay, Boxer, TM | Tier A — direct SAP and implementation-partner confirmation | Implemented SAP Customer Activity Repository to eliminate processing/reconciliation delays; selected SAP CAR as replacement for previous SAP POSDM; implementation focused on POSDTA and required master data | **Confirmed** | Not publicly confirmed. Source says "required master data", not DDF specifically | Not publicly confirmed | Not publicly confirmed | Transaction/reconciliation acceleration; real-time data and analytics; e-commerce inventory/stock visibility; one-click administrative and financial reporting | SAP Africa, Beyond Technologies, OpenText |
| Shoprite Group | Grocery and omnichannel retail group; brands include Shoprite, Checkers, Usave | Tier B — company job advert confirms CAR in SAP Retail system; partner blog supports SAP integration context | A Shoprite-posted job advert states its SAP Retail system consists of Retail, GTS, Finance, Gateway and **CAR**. GK Software blog quotes Shoprite CIO on GK integration into SAP merchandise management and describes GK Model Company data streams between GK OmniPOS and SAP CPI/CAR/S/4HANA, proven at companies including Shoprite | Not publicly confirmed by accepted source | Not publicly confirmed | Not publicly confirmed | Not publicly confirmed | SAP Retail/Fiori support landscape; SAP/GK retail integration. The public evidence does **not** prove POSDTA module use | CareerJunction/Shoprite job advert, GK Software blog |

## South African SAP CAR ecosystem / service providers

| Company | Role in market | Public SAP CAR/POSDTA interaction | South Africa link | Sources |
|---|---|---|---|---|
| Beyond Technologies South Africa | Implementation partner / SAP consultancy | Implemented Pick n Pay SAP CAR with focus on POSDTA and required master data; offices in Johannesburg and Cape Town | South Africa offices listed by Beyond | Beyond Technologies Pick n Pay case study; SAP Africa Pick n Pay case study |
| SAP Africa / SAP SE | Vendor / publisher | SAP Africa published Pick n Pay SAP CAR deployment; SAP offers SAP CAR applications bundle | SAP Africa site and Southern Africa regional director quoted | SAP Africa Pick n Pay case study; SAP product page |
| retailsolutions AG South Africa | SAP Retail consultancy | Public service pages for SAP CAR, POSDTA, UDF, OAA/omnichannel capability; no named South African end-user case found | Home page lists South Africa among retailsolutions locations | retailsolutions SA CAR/POSDTA/UDF pages |
| Britehouse, a division of Dimension Data / NTT | SAP Retail services practice | Publicly launched SAP Retail practice covering Customer Activity Repository (CAR) for Middle East and Africa including South Africa | Johannesburg-issued release; South Africa included | ITWeb/Britehouse release |
| GK Software Africa | Store/POS solution provider and SAP integration partner | GK describes retail data streams between GK OmniPOS and SAP CPI/CAR/S/4HANA; has South African office; Shoprite quoted in integration context | GK Software Africa office in Sandton | GK Model Company blog; GK About page |
| OpenText / VicIT | Testing / DevOps tooling around Pick n Pay SAP landscape | OpenText customer story says Pick n Pay uses SAP POSDTA solutions and tests mission-critical apps with OpenText tooling | Pick n Pay SA customer story | OpenText Pick n Pay story |

## Excluded / not enough public evidence for confirmed end-user status

| Company | Why not included as confirmed SAP CAR/POSDTA end user |
|---|---|
| Woolworths Holdings / Woolworths South Africa | Searches found strong CAR evidence for **Woolworths Group Australia**, not the South African Woolworths Holdings entity. I did not find acceptable public SAP CAR/POSDTA evidence for Woolworths Holdings South Africa. |
| Massmart | Found employee/contact-directory signals mentioning SAP CAR, but no stable official or partner case source confirming Massmart SAP CAR/POSDTA. |
| SPAR Group South Africa | Public SAP ERP/S/4HANA implementation coverage exists, but no accepted public SAP CAR/POSDTA source found. |
| Pepkor / JD Group / Pepkor Lifestyle | Search snippets/job aggregators suggest SAP CAR/POSDTA hiring, but the stable official job source could not be fetched/verified. Kept out of the confirmed end-user list. |
| TFG / The Foschini Group | No accepted public SAP CAR/POSDTA source found. |
| Clicks Group | No accepted public SAP CAR/POSDTA source found. |
| Dis-Chem | No accepted public SAP CAR/POSDTA source found. |
| Truworths | No accepted public SAP CAR/POSDTA source found. |
| Food Lover's Market | No accepted public SAP CAR/POSDTA source found. |

## Source register

1. SAP Africa News Center — Pick n Pay Sparks Retail Revolution with Powerful SAP Deployment — https://news.sap.com/africa/2023/04/pick-n-pay-sparks-retail-revolution-with-powerful-sap-deployment/
2. Beyond Technologies — Pick n Pay: Building the retail business of the future with SAP CAR POSDTA — https://www.beyondtechnologies.com/news/pick-n-pay-sap-car/
3. OpenText customer story — Pick n Pay — https://www.opentext.com/customers/pick-n-pay
4. CareerJunction / Shoprite job advert — SAP Technical Consultant – Senior Fiori Developer at Shoprite Group — https://www.careerjunction.co.za/sap-technical-consultant-senior-fiori-developer-at-shoprite-group-job-2397944.aspx
5. GK Software — GK Model Company: an efficiency driver in every SAP retail project — https://www.gk-software.com/us/newsroom/blog/en-blog-20240116-gk-model-company
6. GK Software — About GK / South Africa office — https://www.gk-software.com/us/about/about-gk
7. ITWeb / Britehouse — Britehouse launches SAP Retail practice — https://www.itweb.co.za/article/britehouse-launches-sap-retail-practice/G98Yd7Lx2np7X2PD
8. retailsolutions SA — SAP Customer Activity Repository — https://www.retailsolutions-sa.co.za/focus-areas/omnichannel-customer-centricity/sap-customer-activity-repository
9. retailsolutions SA — POSDM to POSDTA — https://www.retailsolutions-sa.co.za/focus-areas/omnichannel-customer-centricity/posdta
10. retailsolutions SA — SAP UDF — https://www.retailsolutions-sa.co.za/focus-areas/forecasting-planning-applications/sap-udf-unified-demand-forecast
11. retailsolutions SA — Home / locations — https://www.retailsolutions-sa.co.za/
12. SAP product page — SAP Customer Activity Repository applications bundle — https://www.sap.com/africa/products/crm/customer-activity-repository.html

## Notes and caveats

- This is a public-evidence market map, not a license-audit database. Private SAP deployments, confidential partner work, or non-indexed tender documents may exist.
- For Pick n Pay, SAP Africa and Beyond Technologies are consistent on SAP ECC / POSDM-to-CAR POSDTA migration. Some syndicated copies describe S/4HANA; this map prioritises SAP/Beyond primary case-study wording.
- For Shoprite, CAR is accepted as public-confirmed because a Shoprite-posted job advert explicitly lists CAR as part of the SAP Retail system. Module-level CAR components are not accepted without explicit public evidence.
