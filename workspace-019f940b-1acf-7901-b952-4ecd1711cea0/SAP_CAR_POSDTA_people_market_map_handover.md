# Handover Report — SAP CAR / POSDTA / DDF / UDF / OAA People Market Map

**Date:** 2026-07-24  
**Instruction constraint:** Do not invent information. Use only source-verified information.  
**Primary workspace deliverables so far:**

- `South_Africa_SAP_CAR_POSDTA_people_market_map.xlsx`
- `South_Africa_SAP_CAR_POSDTA_people_market_map_v2.xlsx`
- `South_Africa_SAP_CAR_POSDTA_people_market_map.md`
- `South_Africa_SAP_CAR_POSDTA_market_map_final.xlsx`
- `South_Africa_SAP_CAR_POSDTA_market_map_final.md`
- User-attached PDF: `/home/user/uploads/1236171_Arndt_Hoffmann_-_SBN_Conference_2024_smartShift_final.pdf`

---

## 1. Scope and evidence standard

The current people map is intended to identify **consultants, configurators, specialists, product leads, project managers and adjacent SAP/POS specialists** with a public, source-verifiable connection to at least one of:

- SAP CAR
- POSDTA / POS DTA / CAR-DTA
- POSDM where explicitly tied to SAP CAR or CAR migration
- DDF
- UDF
- OAA

Important: broad SAP experience alone — SAP FI, MM, SD, EWM, HCM, BPC, SuccessFactors, S/4HANA, SAP PM, SAP Project Manager — is **not sufficient** for the strict SAP CAR / POSDTA / DDF / UDF / OAA map unless a public source specifically ties the person to one of those target technologies.

### Evidence accepted

- Direct public LinkedIn profile text/snippets.
- Public SAP/customer/implementation-partner articles.
- Public provider pages naming a person and the relevant technology.
- Public interviews or conference PDFs where the person is named and the target technology is described.

### Evidence not accepted as standalone proof

- User-supplied assertions without independent public confirmation.
- People-data/contact databases as the only source for module-level expertise.
- Generic SAP project-management roles without CAR/POSDTA/DDF/UDF/OAA evidence.
- “People also viewed,” liked posts, or comments that do not attribute the skill to the named person.
- Email/phone/contact data from ZoomInfo, RocketReach, ContactOut, etc. These should not be used in the workbook.

---

## 2. Critical distinction: Woolworths Australia vs Woolworths South Africa

Several strong SAP CAR / POSDTA sources relate to **Woolworths Group Australia**, not Woolworths Holdings / Woolworths South Africa.

This distinction must be preserved. Evidence for Woolworths Group Australia does **not** verify SAP CAR or POSDTA at Woolworths Holdings South Africa.

---

## 3. Newly supplied evidence: Magesh Rajamanickam

### User-provided information

The user provided the LinkedIn profile URL:

- `https://au.linkedin.com/in/magesh-rajamanickam`

The user also provided a search snippet stating:

- Magesh Rajamanickam
- Product Lead - SAP CAR (Sales & Forecasting)
- Woolworths Group
- Acacia Gardens, New South Wales, Australia
- SAP Certified Functional Consultant with 18+ years of experience

### Verification status

- Direct fetch of the LinkedIn profile was blocked with HTTP 403.
- Public web search did not surface a full independent LinkedIn snippet in this run.
- A ZoomInfo result for a Woolworths Group colleague lists **Magesh Rajamanickam** as a colleague and shows partial title text: **“SAP Car Product Lead (Sales & Forec...”** at Woolworths Group.

### Handover decision

- Treat as **partially corroborated but not fully direct-verified**.
- Do **not** count as South Africa-linked; this is **Australia-based Woolworths Group**.
- Recommended placement: **Global specialist appendix / Australia Woolworths Group watchlist**, not the South Africa main map.
- Recommended next action: re-run with exact quoted searches and, if possible, capture the public LinkedIn snippet via search result rather than direct fetch.

---

## 4. Newly supplied evidence: Roshan Gupta / Sapture “60 Seconds in SAP” report

### Source-verified facts

Sapture article: `https://www.sapture.com.au/60-seconds-roshan-gupta-sap-project-manager/45453`

The article states:

- Roshan Gupta was interviewed as **SAP Project Manager at Woolworths Ltd**.
- He was **leading and delivering a significant transformation program: SAP CAR (HANA) Retail for Woolworths Ltd**.
- He identified useful modules including:
  - SAP CAR / PSDTA
  - SAP ECC
  - SAP PI
  - SAP SLT
  - SAP PMR
- The article states that store transactions are captured in the **POSDTA/CAR** system through PI integrations.
- Master data flows from ECC to CAR using SAP SLT.
- SAP PMR is used for promotions and tagged to CAR POSDTA for reconciliations.
- Analytics / sales reporting is built in SAP BW.

### LinkedIn corroboration found

A public LinkedIn result for **Roshan Gupta** shows:

- Profile URL: `https://www.linkedin.com/in/roshan-gupta/` / `https://au.linkedin.com/in/roshan-gupta`
- Location: Carlingford, New South Wales, Australia
- Current employer shown in result: QBE Insurance
- Award listed: **“Team of Month - Nov 2017 (SAP CAR Implementation)”**
- Description: Enterprise Platform/Product and Program Manager transforming SAP ERP

### Handover decision

- Add Roshan Gupta to the **Global specialist appendix**, not South Africa main map.
- Evidence grade: **A** for Woolworths Australia SAP CAR/POSDTA project leadership, because the Sapture article is explicit and the LinkedIn result corroborates SAP CAR implementation experience.
- Do not mark as current Woolworths employee; public LinkedIn result shows current QBE Insurance.

---

## 5. Attached smartShift PDF: source-verified content

Attached file:

`/home/user/uploads/1236171_Arndt_Hoffmann_-_SBN_Conference_2024_smartShift_final.pdf`

Extracted with `pypdf`. It is a smartShift conference deck titled:

**“BMW and Woolworths on their Journey to S/4HANA and RISE — Intelligent Automation Approaches”**

### Relevant Woolworths Group facts in the deck

The deck states:

- Woolworths Group is **Australia’s largest retailer**.
- SAP is central to Woolworths Group capabilities and business operations.
- Relevant SAP operational metrics include:
  - 5m sales transactions daily for group reporting.
  - 20m inventory movements per day.
  - 15k prices/promotions per week.
  - 70m article/site combinations forecasted daily for store sales forecasting.
  - 50m stock-on-hand updates sent daily to Woolies X.
- Woolworths SAP Technology Journey slide lists:
  - SAP Retail and Finance
  - EhP8 / CAR 5
  - SAP UDF
  - CAR / PMR
  - S/4HANA
  - BTP
  - Azure migration
- The deck states that Woolworths upgraded SAP ECC from Enhancement Pack 6 to 8 to ease S/4 transition and **support SAP CAR UDF**.
- The deck says Woolworths selected smartShift at the end of 2023 as strategic partner for SAP custom-code automation.

### Handover decision

- This is strong company-level evidence for **Woolworths Group Australia** using SAP CAR 5 and SAP UDF.
- It does not identify South African Woolworths Holdings as a CAR/UDF user.
- It should be added to the company-level evidence base under **Global / Australia Woolworths Group**, not under South Africa end users.

---

## 6. People already added to the SA-linked people map in v2

### Tristan Bell

- LinkedIn: `https://www.linkedin.com/in/ttb16072000/`
- Organisation: The Shoprite Group of Companies
- Role: SAP Functional Analyst
- Source-verified connection:
  - Direct LinkedIn result states he specializes in **SAP CAR POSDM**.
  - It says he configures and integrates systems for the NOVA Point of Sale rollout across multiple countries.
  - It says he enhances sales audit processes and maintains reports from a large enterprise database.
- Decision:
  - Added as direct SAP CAR/POSDM specialist.
  - Caveat: source says POSDM, not POSDTA. Do not rewrite as POSDTA without separate evidence.

### Stasha Battye

- LinkedIn: `https://za.linkedin.com/in/stasha-battye-41bbaa9`
- Organisation: Massmart / Block Markets Africa depending on date of source
- Source-verified connection:
  - Direct LinkedIn result states long experience in retail POS, payments and value-added services.
  - UCS role includes service owner for **SAP POS** and project manager for SAP All-in-One and Active Retail Integration services.
  - Technical project manager for Makro POS replacement and integration.
- Decision:
  - Added as **adjacent SAP POS / SAP Retail programme leader**.
  - Caveat: no SAP CAR/POSDTA/DDF/UDF/OAA evidence found.

### Nolan Reddy

- User supplied Woolworths SAP CAR / SAP EWM claim.
- Public search did not verify the claim.
- Results surfaced other Nolan Reddy profiles unrelated to Woolworths/SAP CAR.
- Decision:
  - Not added.

---

## 7. Existing verified / partially verified SA-linked rows before this handover

These are already represented in `South_Africa_SAP_CAR_POSDTA_people_market_map_v2.xlsx`.

### Karl Bend

- LinkedIn: `https://www.linkedin.com/in/karl-bend-74219bab/`
- Organisation: retailsolutions group
- Verified connection:
  - Direct LinkedIn profile shows UDF/F&R Solution Architect work, including City of Johannesburg, Gauteng assignment.
  - Mentions UDF design/implementation, F&R integration, DDF data cleansing, POS data analysis, POS inbound enhancements, DRFOUT, UDF configuration, rollout and optimisation.
  - retailsolutions SA UDF webinar article quotes him as Partner and Head of Intelligent Replenishment.
- Decision: strong SA-linked UDF/CAR specialist.

### Nizaam Mahomed

- LinkedIn: `https://www.linkedin.com/in/nizaam-mahomed-870056190/`
- Organisation: GK Software Africa
- Verified connection:
  - LinkedIn result shows SAP CAR W26CAR Workshop, SAP POSDTA W26POS Workshop, and project “Integration of Cow Hills POS to SAP CAR.”
- Decision: SAP CAR/POSDTA specialist; evidence grade B due to some title text coming from public directories.

### Waseem Ahmed Dawood

- LinkedIn: `https://www.linkedin.com/in/waseem-ahmed-dawood-230b3a80/`
- Organisation: JD Group
- Verified connection:
  - LinkedIn result shows SAP CAR implementation project: GK POS - CAR solution with OAA & Hybris for Makro.
  - ContactOut / ZoomInfo corroborate SAP OAA Solution Architect / Senior SAP CAR, POSDM, OAA, Retail Consultant title.
- Decision: SAP CAR/OAA specialist; evidence grade B/C because title partly relies on people-data directories.

### Leon Van Niekerk

- LinkedIn: `https://www.linkedin.com/in/leon-van-niekerk-8210b511/`
- Organisation: Pick n Pay
- Verified connection:
  - LinkedIn confirms Head of Testing at Pick n Pay and “SAP Test Integration Manager.”
  - OpenText case says Pick n Pay uses SAP POSDTA solutions and quotes Leon on testing mission-critical applications.
- Decision: connected to POSDTA landscape as testing/QA lead, not a CAR/POSDTA configurator.

### Christian Bowker

- LinkedIn: `https://www.linkedin.com/in/christianbowker/`
- Organisation: Syntax / formerly Beyond Technologies South Africa
- Verified connection:
  - SAP/Beyond Pick n Pay case quotes him as Managing Partner at Beyond Technologies.
  - Beyond case confirms implementation focused on SAP CAR POSDTA.
- Decision: provider-side executive lead; not evidence of personal configuration work.

### Matthew Barker

- LinkedIn: `https://www.linkedin.com/in/matthew-barker-rs/`
- Organisation: retailsolutions group
- Verified connection:
  - retailsolutions UDF webinar article lists him among senior SAP consultant speakers.
  - LinkedIn result includes retailsolutions content around UDF, PMR, POSDTA, OAA and Retail skills.
- Decision: UDF/CAR-linked consultant; not necessarily South Africa-based.

### Quentin Lotriet

- LinkedIn: `https://www.linkedin.com/in/quentin-lotriet-04089222/`
- Organisation: Beyond Technologies
- Verified connection:
  - retailsolutions UDF webinar article lists him among senior SAP consultant speakers.
  - TheOrg lists him as Principal SAP Consultant at Beyond Technologies.
- Decision: UDF/CAR-linked consultant; evidence B/C because TheOrg data is not primary employer confirmation.

### Camdin Govender

- LinkedIn: `https://za.linkedin.com/in/camdin-govender-0960586a`
- Organisation: GK Software Africa
- Verified connection:
  - Direct LinkedIn confirms SAP & Functional Consulting Team Lead at GK Software Africa.
  - GK Africa public profiles list SAP CAR implementation and retail POS-SAP integration capabilities.
- Decision: adjacent SAP/POS functional lead; no person-level CAR/POSDTA module claim found.

---

## 8. Company-level updates discovered after v1 company map

### Pick n Pay

Additional source-verified facts:

- SAP Africa says Pick n Pay moved from SAP POS DM to CAR/DTA.
- CAR/DTA went live in January 2022.
- Pick n Pay was in the process of implementing UDF.

Implication:

- Company map should be updated from POSDTA-only confirmation to include **UDF in process / implementation in progress**, with careful wording.

### Dis-Chem

Additional source-verified facts:

- retailsolutions reference pages state Dis-Chem is moving from manual processes to centralised, data-driven procurement with **SAP F&R and UDF**.

Implication:

- Company map should be updated to include **Dis-Chem as UDF / SAP F&R publicly referenced by retailsolutions**, but not POSDTA unless a separate source is found.

### Woolworths Group Australia

Additional source-verified facts:

- Microsoft / Technology Decisions articles already verify Woolworths Group Australia runs SAP Customer Activity Repository on HANA.
- smartShift attached PDF verifies CAR 5, SAP UDF, CAR/PMR and S/4HANA roadmap.
- Sapture article verifies Roshan Gupta leading Woolworths Ltd SAP CAR (HANA) Retail transformation and POSDTA/CAR operations.
- Magesh Rajamanickam is partially corroborated as SAP CAR Product Lead at Woolworths Group, but direct LinkedIn verification is incomplete.

Implication:

- Add a **Global / Australia Woolworths Group** section.
- Do not use this as evidence for Woolworths Holdings South Africa.

---

## 9. User-supplied long list status

The user supplied a large number of SAP project managers, Scrum Masters, SAP functional analysts and adjacent profiles.

Current status:

- The workbook v2 contains a `User additions triage` sheet listing the supplied names and marking them as not yet added unless independently verified.
- Most user-supplied names appear to be broad SAP / SAP PM / Agile / functional roles rather than CAR/POSDTA/DDF/UDF/OAA specialists.
- They should be handled in a separate **broad South Africa SAP project manager / functional consultant market map** if the user wants market-wide SAP PM coverage.

Do not merge them into the strict CAR/POSDTA people map without one of the target-technology keywords appearing in a public source.

---

## 10. Recommended next steps

### Immediate workbook update recommended

Create v3 workbook with:

1. Add **Roshan Gupta** to Global specialist appendix:
   - LinkedIn: `https://www.linkedin.com/in/roshan-gupta/`
   - Role: current QBE Insurance per LinkedIn result; former Woolworths SAP Project Manager / Program IT Enterprise Lead per Sapture and ZoomInfo.
   - Connection: SAP CAR (HANA) Retail, POSDTA/CAR, SAP PMR, SAP SLT, SAP BW.
   - Geography: Australia.
   - Evidence grade: A for SAP CAR/POSDTA project connection.

2. Add **Magesh Rajamanickam** to Global watchlist / partially verified appendix:
   - LinkedIn: `https://au.linkedin.com/in/magesh-rajamanickam`
   - Role: Product Lead - SAP CAR (Sales & Forecasting) at Woolworths Group per user-provided LinkedIn snippet; partially corroborated by ZoomInfo colleague result.
   - Geography: Australia.
   - Evidence grade: B/C until direct LinkedIn snippet is captured.

3. Add attached smartShift PDF to source register:
   - Company-level evidence for Woolworths Group Australia CAR 5, UDF, CAR/PMR, S/4HANA roadmap.

4. Update company market map:
   - Pick n Pay: add UDF “in process” from SAP Africa POS-modernisation article.
   - Dis-Chem: add UDF/F&R from retailsolutions reference page.
   - Woolworths Group Australia: add as global benchmark, not SA.

### Verification workflow for future names

For each user-supplied profile:

1. Search exact LinkedIn URL and exact full name in quotes.
2. Confirm the profile exists and extract only public result text.
3. Search exact full name + target terms:
   - “SAP CAR”
   - “POSDTA”
   - “POS DTA”
   - “CAR/DTA”
   - “POSDM”
   - “UDF”
   - “DDF”
   - “OAA”
4. If no target term is found, do not add to strict map.
5. If only generic SAP terms are found, place in broad SAP PM / functional consultant backlog.
6. Grade evidence:
   - A: direct LinkedIn or direct SAP/customer/provider source ties person to target tech.
   - B: strong third-party article or interview names person and target tech.
   - C: adjacent ecosystem source, employer capability, or people-directory corroboration.
   - Reject: no source, wrong person, generic SAP only, or source contradicts claim.

---

## 11. Key source register

### Woolworths Group Australia / Roshan / Magesh / attached PDF

- Sapture — Roshan Gupta SAP PM Woolworths: `https://www.sapture.com.au/60-seconds-roshan-gupta-sap-project-manager/45453`
- Roshan Gupta LinkedIn public result: `https://www.linkedin.com/in/roshan-gupta/`
- User-provided Magesh LinkedIn URL: `https://au.linkedin.com/in/magesh-rajamanickam`
- Partial Magesh corroboration via Woolworths Group colleague result: ZoomInfo result for Dimitri Ovchinnikoff mentioning Magesh Rajamanickam as SAP CAR Product Lead.
- smartShift attached PDF: `/home/user/uploads/1236171_Arndt_Hoffmann_-_SBN_Conference_2024_smartShift_final.pdf`
- Microsoft Woolworths Group SAP cloud transformation: `https://news.microsoft.com/en-au/features/woolworths-completes-large-scale-sap-cloud-transformation-improving-efficiency-flexibility-and-speed-to-market/`
- Technology Decisions Woolworths SAP cloud transformation: `https://www.technologydecisions.com.au/content/cloud-and-virtualisation/case-study/woolworths-completes-large-scale-sap-cloud-transformation-530199930`

### South Africa / SAP CAR-POSDTA people and companies

- Tristan Bell LinkedIn: `https://www.linkedin.com/in/ttb16072000/`
- Stasha Battye LinkedIn: `https://za.linkedin.com/in/stasha-battye-41bbaa9`
- Karl Bend LinkedIn: `https://www.linkedin.com/in/karl-bend-74219bab/`
- Nizaam Mahomed LinkedIn: `https://www.linkedin.com/in/nizaam-mahomed-870056190/`
- Waseem Ahmed Dawood LinkedIn: `https://www.linkedin.com/in/waseem-ahmed-dawood-230b3a80/`
- Leon Van Niekerk LinkedIn: `https://www.linkedin.com/in/leon-van-niekerk-8210b511/`
- Christian Bowker LinkedIn: `https://www.linkedin.com/in/christianbowker/`
- Matthew Barker LinkedIn: `https://www.linkedin.com/in/matthew-barker-rs/`
- Quentin Lotriet LinkedIn: `https://www.linkedin.com/in/quentin-lotriet-04089222/`
- Camdin Govender LinkedIn: `https://za.linkedin.com/in/camdin-govender-0960586a`
- Pick n Pay SAP CAR / POSDTA: `https://news.sap.com/africa/2023/04/pick-n-pay-sparks-retail-revolution-with-powerful-sap-deployment/`
- Pick n Pay POS modernisation / CAR-DTA / UDF: `https://news.sap.com/africa/2023/07/pick-n-pay-modernises-its-pos/`
- Beyond Technologies Pick n Pay SAP CAR POSDTA: `https://www.beyondtechnologies.com/news/pick-n-pay-sap-car/`
- OpenText Pick n Pay POSDTA landscape: `https://www.opentext.com/customers/pick-n-pay`
- retailsolutions UDF webinar / speakers: `https://www.retailsolutions-sa.co.za/news/details/accurate-forecasts-for-future-customer-demand`
- retailsolutions references / Dis-Chem UDF: `https://www.retailsolutions.co.uk/references`

---

## 12. Final handover warning

The user supplied many names and asked to continue toward 500 profiles. This is only safe if the work is split into two separate products:

1. **Strict CAR/POSDTA/DDF/UDF/OAA specialist map** — small, evidence-heavy, no generic SAP entries.
2. **Broad SAP South Africa project managers / functional consultants database** — much larger, but must be clearly labelled as broad SAP and not CAR/POSDTA-specific.

Do not dilute the strict CAR/POSDTA map with generic SAP project managers unless a public source names CAR, POSDTA, DDF, UDF or OAA for that person.
