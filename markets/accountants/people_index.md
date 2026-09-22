# People Index — Master Name Registry (dedup source of truth)

> **CHECK THIS FILE FIRST** before adding any person, company or source.

This is the authoritative list of every name already captured in the
SA Accounting & Finance Skills database. Future batches must
consult it **before** writing records so nothing is duplicated — a new
source for an existing person only *enriches* that record; it never adds a second one.

**Regenerate after every batch:** `python3 gen_people_index.py`


## 1. Totals (auto-computed)

| Metric | Count |
|---|---|
| People (total records) | 0 |
| CONFIRMED | 0 |
| FINANCE_ROLE_CONFIRMED | 0 |
| HIGH_CONFIDENCE | 0 |
| Companies | 146 |
| Sources | 642 |

## 2. How to use this index (dedup workflow)

1. Normalise the candidate name (lowercase; strip titles, accents, initials — compare surname + given name).
2. Search the **People** table below (sorted by surname). Also try name variants.
3. If the person is already listed → **do not add**. Enrich the existing record rather than adding a second person.
4. Check the Companies table before adding an employer; extend aliases rather than duplicating a firm.
5. Professional designation, body registration, articles and practical-experience routes remain separate evidence fields.

> IDs are stable research identifiers — **dedup by name/LinkedIn, never by id alone.**

## 3a. All people (sorted by surname)

| # | Full name | Surname / Given | Status | Designation(s) | Body | Employer | Province / City | LinkedIn |
|---|---|---|---|---|---|---|---|---|

## 3b. Status notes

- `CONFIRMED`: professional designation and current identity/employment evidence are confirmed.
- `FINANCE_ROLE_CONFIRMED`: current in-scope finance role is confirmed; professional designation is absent or not established.
- `HIGH_CONFIDENCE`, `CONFLICTING`, and other research statuses retain their explicit uncertainty.

## 4. Companies already mapped (do not duplicate)

| ID | Company | Industry | SA locations |
|---|---|---|---|
| cmp-0039 | Absa Consultants & Actuaries | Financial Services | — |
| cmp-0018 | Absa Group | Banking | — |
| cmp-0036 | ACCA (South Africa) | Professional Services | — |
| cmp-0057 | Adriaan de Lange Advisory | Professional Services | Cape Town |
| cmp-0076 | Afrimat | Building Materials | Western Cape, South Africa |
| cmp-0077 | AfriSam | Building Materials | Western Cape, South Africa |
| cmp-0111 | Ardagh Glass Packaging SA | — | — |
| cmp-0059 | ASL | Professional Services | Somerset West |
| cmp-0096 | ASLA | — | — |
| cmp-0088 | Astron Energy | — | — |
| cmp-0007 | Auditor-General of South Africa | Government | — |
| cmp-0073 | AYO Technology Solutions Limited | Technology | Cape Town |
| cmp-0010 | BAIC South Africa | Automotive | — |
| cmp-0021 | Bayer (South Africa) | Pharmaceuticals | — |
| cmp-0069 | BDO South Africa | Accounting / Audit | Johannesburg (Parktown), Cape Town, Stellenbosch, Gqeberha (Port Elizabeth), Durban, Pretoria |
| cmp-0140 | Betko Fresh Produce | — | — |
| cmp-0017 | Bonakude Consulting (Pty) Ltd | Professional Services | — |
| cmp-0064 | Boshoff Knoetze Chartered Accountants | Accounting / Audit | Somerset West (Helderberg) |
| cmp-0054 | Bounty Apparel | Manufacturing | Cape Town |
| cmp-0108 | Bowler Metcalf / Bowler Plastics | — | — |
| cmp-0043 | Brenn-O-Kem | Manufacturing | Stellenbosch / Worcester region (Western Cape) |
| cmp-0006 | Burstone | Property | — |
| cmp-0066 | Callidus Accountants | Accounting / Audit | Somerset West |
| cmp-0044 | Cape Chamber of Commerce & Industry | Non-Profit | Cape Town |
| cmp-0145 | Cape Fruit Coolers | — | — |
| cmp-0137 | Capespan South Africa | — | — |
| cmp-0134 | Ceres Fruit Growers | — | — |
| cmp-0082 | Chryso Southern Africa | — | — |
| cmp-0037 | CIMA Africa | Professional Services | — |
| cmp-0080 | Ciolli Bros | Quarrying / Aggregates | Durbanville, Cape Town, Western Cape |
| cmp-0092 | Civils 2000 | — | — |
| cmp-0143 | Commercial Cold Holdings | — | — |
| cmp-0097 | Concor | — | — |
| cmp-0141 | Core Fruit | — | — |
| cmp-0053 | Curated Beverages Ltd | FMCG | Cape Town (Tyger Valley) |
| cmp-0051 | Curro Holdings Ltd | Education | Cape Town (Durbanville) |
| cmp-0023 | Deloitte (South Africa) | Accounting / Audit | — |
| cmp-0126 | DGB | — | — |
| cmp-0014 | Drone Ops Group | Technology | — |
| cmp-0146 | DSV | — | — |
| cmp-0136 | Dutoit Agri | — | — |
| cmp-0065 | Emma Pardoe Chartered Accountants (SA) | Accounting / Audit | Somerset West |
| cmp-0033 | Energy and Water Sector Education and Training Authority | Government | — |
| cmp-0106 | Fabrinox | — | — |
| cmp-0116 | Fair Cape Dairies | — | — |
| cmp-0034 | Financial Sector Conduct Authority | Government | — |
| cmp-0107 | Foct Engineering | — | — |
| cmp-0047 | Forvis Mazars in South Africa | Accounting / Audit | Cape Town (Century City), Johannesburg, Bloemfontein, Pretoria |
| cmp-0011 | Fourways Airconditioning | Engineering | — |
| cmp-0028 | Free State Provincial Treasury | Government | — |
| cmp-0139 | Fruitways | — | — |
| cmp-0020 | Grant Thornton (South Africa) | Accounting / Audit | — |
| cmp-0058 | GUUD GLOBAL | Technology | Cape Town |
| cmp-0099 | GVK-Siya Zama | — | — |
| cmp-0002 | Harmony Gold Mining | Mining | — |
| cmp-0094 | Haw & Inglis | — | — |
| cmp-0125 | HEINEKEN Beverages | — | — |
| cmp-0120 | I&J | — | — |
| cmp-0100 | Isipani Construction | — | — |
| cmp-0070 | Johan le Roux CA(SA) | Accounting / Audit | Milnerton, Cape Town |
| cmp-0130 | Kaap Agri / Agrimark | — | — |
| cmp-0004 | KPMG (South Africa) | Accounting / Audit | — |
| cmp-0135 | Kromco | — | — |
| cmp-0086 | Kropz Elandsfontein | — | — |
| cmp-0072 | Kula | — | Worcester |
| cmp-0127 | KWV | — | — |
| cmp-0038 | LA Financial Services (Pty) Ltd | Accounting / Audit | — |
| cmp-0115 | Lactalis South Africa | — | — |
| cmp-0123 | Ladismith Cheese / Woodlands Dairy Group | — | — |
| cmp-0122 | LANCEWOOD | — | — |
| cmp-0008 | Lanseria International Airport | Aviation | — |
| cmp-0068 | LDP Chartered Accountants and Auditors Inc. | Accounting / Audit | Stellenbosch (HQ), Pretoria |
| cmp-0138 | Lona Group | — | — |
| cmp-0075 | M+C Saatchi Group | Professional Services | Cape Town |
| cmp-0102 | Macsteel | — | — |
| cmp-0031 | Makosi | Professional Services | — |
| cmp-0095 | Martin & East | — | — |
| cmp-0035 | Masisizane Fund | Financial Services | — |
| cmp-0024 | Massmart | Retail | — |
| cmp-0041 | McA Inc. | Accounting / Audit | Durbanville (Cape Town) |
| cmp-0012 | Mckenzie & Associates | Accounting / Audit | — |
| cmp-0001 | Mercedes-Benz South Africa Ltd | Automotive | — |
| cmp-0104 | Meshco | — | — |
| cmp-0087 | Mineral Sands Resources / Tormin | — | — |
| cmp-0056 | MK Aerospace SA | Technology | Cape Town (Somerset West area) |
| cmp-0032 | Motlanalo Chartered Accountants and Auditors Inc | Accounting / Audit | — |
| cmp-0025 | Motus Mobility Solutions | Automotive | — |
| cmp-0109 | Mpact | — | — |
| cmp-0112 | Nampak | — | — |
| cmp-0003 | Nedbank Group Limited | Banking | — |
| cmp-0063 | netCFO | Accounting / Audit | Pretoria |
| cmp-0103 | NJR Steel | — | — |
| cmp-0119 | Oceana Group | — | — |
| cmp-0129 | Overberg Agri | — | — |
| cmp-0071 | Pay@ | Fintech | Stellenbosch |
| cmp-0117 | Peninsula Beverages | — | — |
| cmp-0114 | PepsiCo South Africa / Pioneer Foods | — | — |
| cmp-0089 | PetroSA | — | — |
| cmp-0048 | Pinnacle Accounting | Accounting / Audit | Western Cape |
| cmp-0030 | PKF Octagon | Accounting / Audit | — |
| cmp-0110 | Polyoak Packaging | — | — |
| cmp-0079 | Portland Group | Building Materials | Durbanville, Malmesbury, Western Cape |
| cmp-0091 | Power Group | — | — |
| cmp-0078 | PPC | Building Materials | Western Cape, South Africa |
| cmp-0121 | Premier Fishing & Brands | — | — |
| cmp-0013 | Probeta Training (Pty) Ltd | Education | — |
| cmp-0067 | PSG Konsult Ltd | Financial Services | Stellenbosch (group HQ) |
| cmp-0027 | PwC (South Africa) | Accounting / Audit | — |
| cmp-0101 | R+N Master Builders | — | — |
| cmp-0098 | Raubex / Roadmac Surfacing Cape | — | — |
| cmp-0113 | RFG Foods | — | — |
| cmp-0105 | SA Metal Group | — | — |
| cmp-0128 | SAB / AB InBev - Newlands Brewery | — | — |
| cmp-0046 | Sable International | Professional Services | Cape Town |
| cmp-0084 | Safintra South Africa | — | — |
| cmp-0009 | SAICA | Professional Services | — |
| cmp-0083 | Saint-Gobain Gyproc | — | — |
| cmp-0022 | SAP Africa | Technology | — |
| cmp-0045 | Schoemans Registered Auditors and Chartered Accountants | Accounting / Audit | Cape Town |
| cmp-0118 | Sea Harvest Group | — | — |
| cmp-0131 | Sentraal-Suid Co-operative (SSK) | — | — |
| cmp-0081 | Sika South Africa | — | — |
| cmp-0052 | Snapplify | Technology | Cape Town |
| cmp-0144 | Snolink | — | — |
| cmp-0015 | South African State Theatre | Other | — |
| cmp-0142 | Southern African Fruit Terminals (SAFT) | — | — |
| cmp-0124 | Southern Oil (SOILL) | — | — |
| cmp-0060 | Stellenbosch University | Education | Stellenbosch |
| cmp-0040 | Streets Chartered Accountants | Accounting / Audit | Cape Town (Kenilworth) |
| cmp-0090 | Sunrise Energy | — | — |
| cmp-0042 | Superside | Technology | Cape Town (SA finance base) |
| cmp-0016 | TCTA (Trans-Caledon Tunnel Authority) | Government | — |
| cmp-0061 | TFG Limited | Retail | Cape Town (Parow) |
| cmp-0074 | The Fieldbar Co. | Manufacturing | Cape Town |
| cmp-0055 | The Modern CFO | Professional Services | Cape Town |
| cmp-0050 | TradeOn SA | Retail | Cape Town |
| cmp-0029 | Traxtion | Logistics | — |
| cmp-0085 | Tronox Namakwa Sands | — | — |
| cmp-0133 | Tru-Cape Fruit Marketing | — | — |
| cmp-0132 | Two-a-Day Group | — | — |
| cmp-0019 | Unilever | FMCG | — |
| cmp-0049 | University of Cape Town | Education | Cape Town (Rondebosch Area) |
| cmp-0093 | WBHO Construction - Cape Division | — | — |
| cmp-0005 | Webber Wentzel | Professional Services | — |
| cmp-0026 | Wonga South Africa | Fintech | — |
| cmp-0062 | Woolworths Holdings Ltd | Retail | Cape Town |

## 5. Sources

642 person/company source records are stored in `sources.jsonl`. Reuse an existing URL/person evidence relationship where appropriate instead of creating duplicate evidence rows.
