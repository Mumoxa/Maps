# People Index — Master Name Registry (dedup source of truth)

> **CHECK THIS FILE FIRST** before adding any person, company or source.

This is the authoritative list of every name already captured in the
SA Qualified Accountant & Finance Skills database. Future batches must
consult it **before** writing records so nothing is duplicated — a new
source for an existing person only *enriches* that record; it never adds a second one.

**Regenerate after every batch:** `python3 gen_people_index.py`


## 1. Totals (auto-computed)

| Metric | Count |
|---|---|
| People (total records) | 179 |
| CONFIRMED qualified | 137 |
| HIGH_CONFIDENCE | 39 |
| ARTICLES_CONFIRMED_DESIGNATION_UNVERIFIED | 2 |
| CONFLICTING | 1 |
| Companies | 94 |
| Sources | 95 |

## 2. How to use this index (dedup workflow)

1. Normalise the candidate name (lowercase; strip titles, accents, initials —
   compare surname + given name).
2. Search the **People** table below (sorted by surname). Also try name variants
   (`du Plessis`/`Du Plessis`, `van der Merwe`/`van der Merwe`, accented é→e).
3. If the person is already listed → **do not add**. Enrich the existing record
   (new designation evidence, articles, employer, system, or source URL) instead.
4. If the person appears under **3c. Investigated but excluded** → do not re-capture
   unless new evidence contradicts the exclusion reason.
5. Check the **Companies** table before adding an employer record; extend existing
   `company_aliases` rather than duplicating a firm.

> IDs are renumbered after merges — **dedup by name/LinkedIn, never by id alone.**

## 3a. All people (sorted by surname)

| # | Full name | Surname / Given | Status | Designation(s) | Body | Employer | Province / City | LinkedIn |
|---|---|---|---|---|---|---|---|---|
| 1 | **Lee-Ann Abrahamse** | Abrahamse / Lee-Ann | CONFIRMED | PA(SA) | SAIPA | — | Western Cape/Cape Town | — |
| 2 | **Nicole Adams** | Adams / Nicole | CONFIRMED | PA(SA) | SAIPA | — | Western Cape/Cape Town | — |
| 3 | **Naeem Asvat** | Asvat / Naeem | CONFIRMED | CA(SA) | SAICA | SAICA | KwaZulu-Natal/Durban | — |
| 4 | **Mark Augustine** | Augustine / Mark | HIGH_CONFIDENCE | PA(SA) | SAIPA | Pinnacle Accounting | Western Cape | — |
| 5 | **Lynette Badenhorst** | Badenhorst / Lynette | CONFIRMED | CA(SA) | SAICA | Probeta Training (Pty) Ltd | — | — |
| 6 | **Fatima Bapukee** | Bapukee / Fatima | CONFIRMED | CA(SA), PA(SA) | SAICA, SAIPA | Streets Chartered Accountants (Cape Town) | Western Cape/Cape Town | — |
| 7 | **Jody Baumgarten** | Baumgarten / Jody | HIGH_CONFIDENCE | CA(SA) | SAICA | Wonga (South Africa) | — | — |
| 8 | **Rachelle Best** | Best / Rachelle | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 9 | **J A 'Driaan' Beyers** | Beyers / Driaan | HIGH_CONFIDENCE | PA(SA) | SAIPA | Finkor Accounting | Gauteng/Rayton | — |
| 10 | **Uwe Birkenstock** | Birkenstock / Uwe | CONFIRMED | CA(SA) | SAICA | McA Durbanville Inc. | Western Cape/Durbanville | — |
| 11 | **Nomthandazo Biyela** | Biyela / Nomthandazo | HIGH_CONFIDENCE | PA(SA) | SAIPA | Rain | Western Cape/Cape Town | https://www.linkedin.com/in/nomthandazo-biyela-842340146 |
| 12 | **Kobus Boshoff** | Boshoff / Kobus | CONFIRMED | CA(SA) | SAICA | Boshoff Knoetze Chartered Accountants | Western Cape/Somerset West | https://www.linkedin.com/in/kobus-boshoff-0a510888/ |
| 13 | **Ralph Buddle** | Buddle / Ralph | CONFIRMED | CA(SA) | SAICA | TFG Limited (The Foschini Group) | Western Cape/Cape Town | — |
| 14 | **Kerry Cassel** | Cassel / Kerry | CONFIRMED | CA(SA) | SAICA | Motus Mobility Solutions | — | — |
| 15 | **Maggie Clark** | Clark / Maggie | CONFIRMED | PA(SA) | SAIPA | APBCO Auditors & Accountants (Paarl) | Western Cape/Paarl | — |
| 16 | **Malcolm Cecil Coates** | Coates / Malcolm | HIGH_CONFIDENCE | PA(SA) | SAIPA | Alma Casa | Western Cape/Muizenberg (Cape Town) | — |
| 17 | **Johan Coetzee** | Coetzee / Johan | HIGH_CONFIDENCE | CA(SA) | SAICA | Callidus Accountants | Western Cape/Somerset West | — |
| 18 | **Louwrens da Silva** | da Silva / Louwrens | HIGH_CONFIDENCE | PA(SA) | SAIPA | Petrichor Consulting | Western Cape/Somerset West | — |
| 19 | **Adre Daniel** | Daniel / Adre | HIGH_CONFIDENCE | PA(SA) | SAIPA | Accu-fin Accounting | Western Cape/Milnerton (Cape Town) | — |
| 20 | **Lauren Daniels** | Daniels / Lauren | CONFIRMED | PA(SA) | SAIPA | — | Western Cape/Cape Town | — |
| 21 | **Kyle Danster** | Danster / Kyle | CONFIRMED | ACMA, CGMA | CIMA | Curro Holdings Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/kyle-danster/ |
| 22 | **Micaela Davids** | Davids / Micaela | HIGH_CONFIDENCE | PA(SA) | SAIPA | APBCO Accountants (Somerset West) | Western Cape/Somerset West | — |
| 23 | **Graham Davin** | Davin / Graham | CONFIRMED | CA(SA) | SAICA | TFG Limited (The Foschini Group) | — | — |
| 24 | **Adriaan de Lange** | de Lange / Adriaan | CONFIRMED | CA(SA) | SAICA | Adriaan de Lange Advisory (Private Capacity) | Western Cape/Cape Town | https://www.linkedin.com/in/a3aandl/ |
| 25 | **Sandi De Souza** | De Souza / Sandi | CONFIRMED | CA(SA) | SAICA | SAP Africa | — | — |
| 26 | **Emile de Villiers** | de Villiers / Emile | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 27 | **Louis de Wet** | de Wet / Louis | CONFIRMED | CA(SA) | SAICA | TradeOn SA | Western Cape/Stellenbosch | https://www.linkedin.com/in/louisdewetza/ |
| 28 | **Melanie Dennis-Jacobs** | Dennis-Jacobs / Melanie | HIGH_CONFIDENCE | AGA(SA) | SAICA | The Red Carnation Hotel Collection | Western Cape/Cape Town | — |
| 29 | **Lézanne Dirkse van Schalkwyk** | Dirkse van Schalkwyk / Lézanne | CONFIRMED | AGA(SA) | SAICA | McA Inc. | Western Cape/Durbanville | — |
| 30 | **Nkosana Dlamini** | Dlamini / Nkosana | CONFIRMED | ACMA, CGMA | CIMA | Absa Group | Gauteng/Johannesburg | — |
| 31 | **André Du Plessis** | Du Plessis / André | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 32 | **Ashley Du Plessis** | Du Plessis / Ashley | CONFIRMED | AGA(SA) | SAICA | — | Western Cape/Paarl | https://www.linkedin.com/in/ashley-du-plessis-ba99a716b/ |
| 33 | **Lian du Plessis** | du Plessis / Lian | CONFIRMED | AGA(SA) | SAICA | Cape Chamber of Commerce & Industry | Western Cape/Cape Town | https://www.linkedin.com/in/lian-du-plessis-aga-sa-177375149/ |
| 34 | **Valentine Dzvova** | Dzvova / Valentine | CONFIRMED | CA(SA), ACMA, CGMA | SAICA, CIMA | AYO Technology Solutions Limited | Western Cape/Cape Town | https://za.linkedin.com/in/valentine-dzvova |
| 35 | **Ovelia Engelbrecht** | Engelbrecht / Ovelia | CONFIRMED | AGA(SA) | SAICA | APBCO Auditors & Accountants (Paarl) | Western Cape/Paarl | — |
| 36 | **Zahid Fakey** | Fakey / Zahid | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 37 | **Zahida Fakey** | Fakey / Zahida | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 38 | **Sifiso Fakude** | Fakude / Sifiso | ARTICLES_CONFIRMED_DESIGNATION_UNVERIFIED | — | — | JTC Group | Western Cape/Cape Town | https://www.linkedin.com/in/sifiso-fakude-66475a86/ |
| 39 | **Neil Fourie** | Fourie / Neil | CONFIRMED | AGA(SA) | SAICA | Brenn-O-Kem | Western Cape/Stellenbosch | https://www.linkedin.com/in/neil-fourie-aga-sa-2a125b204/ |
| 40 | **Vukosi Fungeni** | Fungeni / Vukosi | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 41 | **Nobungcwele Gaxela** | Gaxela / Nobungcwele | HIGH_CONFIDENCE | PA(SA) | SAIPA | — | Western Cape/Cape Town | — |
| 42 | **Marta Gerbach** | Gerbach / Marta | CONFIRMED | CA(SA) | SAICA | Fourways Airconditioning | — | — |
| 43 | **Zandrea Gerber** | Gerber / Zandrea | CONFIRMED | CA(SA) | SAICA | Pay@ | Western Cape/Paarl | https://www.linkedin.com/in/zandrea-gerber-ca-sa-99a5a475/ |
| 44 | **Nonkululeko Gobodo** | Gobodo / Nonkululeko | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 45 | **Jana Goosen** | Goosen / Jana | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 46 | **Grant Greeff** | Greeff / Grant | CONFIRMED | CA(SA) | SAICA | Drone Ops Group | — | — |
| 47 | **Morgan Gregory** | Gregory / Morgan | CONFIRMED | CA(SA) | SAICA | MK Aerospace SA | Western Cape/Cape Town | https://www.linkedin.com/in/morgan-gregory-ca-sa-64046117b/ |
| 48 | **Alicia Haasbroek** | Haasbroek / Alicia | CONFLICTING | — | — | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 49 | **Lorraine Sarah Hand** | Hand / Lorraine Sarah | CONFIRMED | ACMA, CGMA | CIMA | Ozow | Western Cape/Cape Town | https://www.linkedin.com/in/lorraine-sarah-hand-acma-cgma/ |
| 50 | **Ashley Hanekom** | Hanekom / Ashley | CONFIRMED | CA(SA) | SAICA | Superside | Western Cape/Cape Town | https://www.linkedin.com/in/ashleyhanekom/ |
| 51 | **Stephen Hansen** | Hansen / Stephen | CONFIRMED | PA(SA) | SAIPA | APBCO Auditors & Accountants | Western Cape/Somerset West (2025 page) / Hermanus (2026 grouping) | — |
| 52 | **Jenine Harris** | Harris / Jenine | CONFIRMED | PA(SA) | SAIPA | — | Western Cape/Cape Town | — |
| 53 | **Imtiaaz Hashim** | Hashim / Imtiaaz | CONFIRMED | CA(SA) | SAICA | BDO South Africa | Western Cape/Cape Town | — |
| 54 | **Danie Haumann** | Haumann / Danie | CONFIRMED | PA(SA) | SAIPA | — | Western Cape/Cape Town | — |
| 55 | **Ashlin Healy** | Healy / Ashlin | CONFIRMED | CA(SA) | SAICA | Deloitte (South Africa) | Western Cape/Cape Town | https://www.linkedin.com/in/ashlin-healy-ca-sa-130238103/ |
| 56 | **Illana Helman** | Helman / Illana | CONFIRMED | CA(SA) | SAICA | Massmart | Gauteng/Johannesburg | https://www.linkedin.com/in/illana-helman-ca-sa-1279b117/ |
| 57 | **Bronvin Heuvel** | Heuvel / Bronvin | CONFIRMED | CA(SA) | SAICA | KPMG (South Africa) | Western Cape/Cape Town | https://www.linkedin.com/in/bronvin-heuvel-ca-sa-ra-7b2475a9/ |
| 58 | **Mieke Hoffman** | Hoffman / Mieke | CONFIRMED | ACMA, CGMA | CIMA | The Fieldbar Co. | Western Cape/Cape Town | https://za.linkedin.com/in/mieke-hoffman |
| 59 | **André Huysamer** | Huysamer / André | HIGH_CONFIDENCE | AGA(SA) | SAICA | Kula | Western Cape/Worcester | — |
| 60 | **Darren Isaacs** | Isaacs / Darren | CONFIRMED | CA(SA) | SAICA | Makosi | — | — |
| 61 | **Kelly Jacobs** | Jacobs / Kelly | CONFIRMED | PA(SA) | SAIPA | — | Western Cape/Cape Town | — |
| 62 | **Mzwandile Jama** | Jama / Mzwandile | HIGH_CONFIDENCE | PA(SA) | SAIPA | — | Western Cape/Cape Town | — |
| 63 | **Vohan Jamneck** | Jamneck / Vohan | CONFIRMED | PA(SA) | SAIPA | VJ Professional Accountants | Western Cape/Cape Town | https://www.linkedin.com/in/vohanjamneck/ |
| 64 | **Roelof Jansen van Vuuren** | Jansen van Vuuren / Roelof | HIGH_CONFIDENCE | PA(SA) | SAIPA | The Tax Shop Pretoria North East | Gauteng/Pretoria | — |
| 65 | **Alana Johns** | Johns / Alana | HIGH_CONFIDENCE | PA(SA) | SAIPA | — | Western Cape | — |
| 66 | **Francois Joubert** | Joubert / Francois | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 67 | **Nethin Karamchand** | Karamchand / Nethin | CONFIRMED | CA(SA) | SAICA | Deloitte (South Africa) | Western Cape/Cape Town | https://www.linkedin.com/in/nethin/ |
| 68 | **Koko Khumalo** | Khumalo / Koko | CONFIRMED | CA(SA) | SAICA | Motlanalo Chartered Accountants and Auditors Inc | — | — |
| 69 | **Carla Kilian** | Kilian / Carla | HIGH_CONFIDENCE | PA(SA) | SAIPA | AETOS Financial Services | Gauteng/Roodepoort | — |
| 70 | **Matthew Kiln** | Kiln / Matthew | CONFIRMED | ACMA, CGMA | CIMA | Tripco | Western Cape/Stellenbosch | https://www.linkedin.com/in/matthew-kiln-a19746253/ |
| 71 | **Enrico Kleinbooi** | Kleinbooi / Enrico | CONFIRMED | CA(SA) | SAICA | Kannaland Municipality | Western Cape/Ladismith | — |
| 72 | **Dylin Kuni** | Kuni / Dylin | CONFIRMED | ACMA, CGMA | CIMA | M+C Saatchi Group | Western Cape/Cape Town | https://www.linkedin.com/in/dylinkuni/ |
| 73 | **Lesetja Kwetepane** | Kwetepane / Lesetja | HIGH_CONFIDENCE | PA(SA) | SAIPA | LA Financial Services (Pty) Ltd | Limpopo/Polokwane | — |
| 74 | **Div Lamprecht** | Lamprecht / Div | CONFIRMED | CA(SA) | SAICA | SAICA | Free State/Bloemfontein | — |
| 75 | **Johan le Roux** | le Roux / Johan | CONFIRMED | CA(SA) | SAICA | Johan le Roux CA(SA) | Western Cape/Milnerton (Cape Town) | — |
| 76 | **Thinus Le Roux** | Le Roux / Thinus | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 77 | **Naledi Liphapang** | Liphapang / Naledi | HIGH_CONFIDENCE | CA(SA) | SAICA | — | — | — |
| 78 | **Chadwin Lotters** | Lotters / Chadwin | CONFIRMED | PA(SA) | SAIPA | — | Western Cape/Cape Town | — |
| 79 | **Mbali Precious Mabaso** | Mabaso / Mbali | CONFIRMED | CA(SA) | SAICA | Nedbank Group Limited | — | — |
| 80 | **Zanele Maduna** | Maduna / Zanele | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 81 | **Kgabiso Mahlangu** | Mahlangu / Kgabiso | CONFIRMED | AGA(SA) | SAICA | South African State Theatre | Gauteng/Pretoria | https://www.linkedin.com/in/kgabiso-mahlangu-aga-sa-b53a951a |
| 82 | **Mathabo Makhaya** | Makhaya / Mathabo | CONFIRMED | CA(SA) | SAICA | Harmony Gold Mining | — | — |
| 83 | **Mpho Makoko-Hottie** | Makoko-Hottie / Mpho | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 84 | **Patricia Malahlela** | Malahlela / Patricia | CONFIRMED | CA(SA) | SAICA | Mckenzie & Associates | — | — |
| 85 | **Manenzhe Manenzhe** | Manenzhe / Manenzhe | CONFIRMED | FCCA | ACCA | ACCA (South Africa) | Gauteng | https://www.linkedin.com/in/manenzhe-manenzhe-fcca-a80079150/ |
| 86 | **Zaid Manjra** | Manjra / Zaid | CONFIRMED | CA(SA) | SAICA | Woolworths Holdings Ltd | Western Cape/Cape Town | — |
| 87 | **Romy Maree** | Maree / Romy | CONFIRMED | CA(SA) | SAICA | Burstone (Real Estate partners) | — | — |
| 88 | **Iaan Marx** | Marx / Iaan | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 89 | **Katlego Matshego** | Matshego / Katlego | HIGH_CONFIDENCE | CA(SA) | SAICA | Independent Institute of Education (IIE) Varsity College / MSA | — | — |
| 90 | **Bongiwe Mayekiso** | Mayekiso / Bongiwe | HIGH_CONFIDENCE | PA(SA) | SAIPA | — | Western Cape/Cape Town | — |
| 91 | **Phumelela Mbande** | Mbande / Phumelela | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 92 | **Hlayisani Terrent Mboweni** | Mboweni / Hlayisani | HIGH_CONFIDENCE | PA(SA) | SAIPA | Mboweni Accountants | — | — |
| 93 | **Trevor McLachlan** | McLachlan / Trevor | HIGH_CONFIDENCE | PA(SA) | SAIPA | McA Inc. | Western Cape/Cape Town | — |
| 94 | **Richard McQueen** | McQueen / Richard | CONFIRMED | ACMA, CGMA | CIMA | Linkqage | Western Cape/Cape Town | https://www.linkedin.com/in/richard-mcqueen-acma-cgma-7b3b7b2a/ |
| 95 | **Andrew Miles** | Miles / Andrew | CONFIRMED | AGA(SA) | SAICA | Pick n Pay franchise (Rondebosch & Observatory) | Western Cape/Cape Town | https://www.linkedin.com/in/andrew-miles-595690249/ |
| 96 | **Mangaliso Mithi** | Mithi / Mangaliso | CONFIRMED | FCMA, CGMA | CIMA | — | Gauteng/Johannesburg | https://www.linkedin.com/in/mangalisomithi/ |
| 97 | **Siphesihle Mlangeni** | Mlangeni / Siphesihle | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 98 | **Mpolaheng Mohlopi** | Mohlopi / Mpolaheng | CONFIRMED | CA(SA) | SAICA | Lanseria International Airport | Gauteng/Lanseria | — |
| 99 | **Tumi Mokgoko** | Mokgoko / Tumi | CONFIRMED | CA(SA) | SAICA | KPMG | — | — |
| 100 | **Bonga Mokoena** | Mokoena / Bonga | CONFIRMED | CA(SA) | SAICA | BDO South Africa | Gauteng/Johannesburg | — |
| 101 | **Pumla Molope** | Molope / Pumla | CONFIRMED | CA(SA) | SAICA | African Women Chartered Accountants (AWCA) | — | — |
| 102 | **Mpho Mookapele** | Mookapele / Mpho | CONFIRMED | CA(SA) | SAICA | Energy and Water Sector Education and Training Authority (EWSETA) | — | — |
| 103 | **Vincent Motholo** | Motholo / Vincent | CONFIRMED | CA(SA) | SAICA | University of Cape Town | Western Cape/Cape Town | https://www.linkedin.com/in/vincent-motholo-ca-sa-842b7613/ |
| 104 | **Vusi Mpofu** | Mpofu / Vusi | CONFIRMED | AGA(SA) | SAICA | Nedbank | — | — |
| 105 | **Zine Mshengu** | Mshengu / Zine | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 106 | **Chwayita Mtebele** | Mtebele / Chwayita | CONFIRMED | CA(SA) | SAICA | Financial Sector Conduct Authority (FSCA) | — | — |
| 107 | **Ivy Musindo** | Musindo / Ivy | CONFIRMED | PA(SA) | SAIPA | — | Western Cape/Cape Town | — |
| 108 | **Tariro Mutizwa** | Mutizwa / Tariro | CONFIRMED | ACMA, CGMA | CIMA | AICPA & CIMA (CIMA Africa) | — | — |
| 109 | **Aneshree Naidoo** | Naidoo / Aneshree | CONFIRMED | CA(SA) | SAICA | Webber Wentzel | — | — |
| 110 | **Thenashree Naidoo** | Naidoo / Thenashree | HIGH_CONFIDENCE | CA(SA) | SAICA | Durban ICC | KwaZulu-Natal/Durban | — |
| 111 | **Nastassja Nel** | Nel / Nastassja | CONFIRMED | AGA(SA) | SAICA | Schoemans Registered Auditors and Chartered Accountants | Western Cape/Cape Town | https://www.linkedin.com/in/nastassja-nel-71a15364/ |
| 112 | **Wynand Nel** | Nel / Wynand | HIGH_CONFIDENCE | PA(SA) | SAIPA | JTC Group | Western Cape/Cape Town | — |
| 113 | **Buhle Hanise Nomabunga** | Nomabunga / Buhle | CONFIRMED | CA(SA) | SAICA | BAIC (South Africa) | — | — |
| 114 | **Emmanuel Nyamutumbu** | Nyamutumbu / Emmanuel | CONFIRMED | PA(SA) | SAIPA | — | Western Cape/Cape Town | — |
| 115 | **Zizipho Nyanga** | Nyanga / Zizipho | CONFIRMED | CA(SA) | SAICA | Masisizane Fund (Old Mutual) | — | — |
| 116 | **Jabulile Nyathi** | Nyathi / Jabulile | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 117 | **Emma Pardoe** | Pardoe / Emma | CONFIRMED | CA(SA) | SAICA | Emma Pardoe Chartered Accountants (SA) | Western Cape/Somerset West | https://www.linkedin.com/in/emmapardoe/ |
| 118 | **Anisah Patel** | Patel / Anisah | CONFIRMED | CA(SA) | SAICA | Own practice (Vereeniging) | Gauteng/Vereeniging | — |
| 119 | **Zulpha Petersen** | Petersen / Zulpha | CONFIRMED | PA(SA) | SAIPA | — | Western Cape/Cape Town | — |
| 120 | **Esther Pieterse** | Pieterse / Esther | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 121 | **Jan Potgieter** | Potgieter / Jan | HIGH_CONFIDENCE | CA(SA) | SAICA | TFG Limited (The Foschini Group) | — | — |
| 122 | **Taryn Raju** | Raju / Taryn | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 123 | **Ciara Reintjes** | Reintjes / Ciara | CONFIRMED | CA(SA) | SAICA | SAICA | — | — |
| 124 | **Vanessa Rheeder** | Rheeder / Vanessa | CONFIRMED | CA(SA) | SAICA | The Modern CFO | Western Cape/Cape Town | https://www.linkedin.com/in/vanessa-rheeder-ca-sa/ |
| 125 | **Dave Rich** | Rich / Dave | CONFIRMED | CA(SA) | SAICA | Streets Chartered Accountants (Cape Town) | Western Cape/Cape Town | — |
| 126 | **Alan Robbins** | Robbins / Alan | ARTICLES_CONFIRMED_DESIGNATION_UNVERIFIED | — | — | Sable International | Western Cape/Cape Town | — |
| 127 | **Lynette Roeloffze** | Roeloffze / Lynette | CONFIRMED | CA(SA) | SAICA | Forvis Mazars Group | Gauteng/Johannesburg | https://www.linkedin.com/in/lynette-roeloffze-ca-sa-ra-0637aa13/ |
| 128 | **Bianca Roos** | Roos / Bianca | CONFIRMED | CA(SA) | SAICA | PKF Octagon | — | — |
| 129 | **Irene Rupert** | Rupert / Irene | CONFIRMED | CGMA, PA(SA) | CIMA, SAIPA | AgrigateOne | Western Cape/Stellenbosch | https://za.linkedin.com/in/irene-lovell-rupert |
| 130 | **Alexis Sacks** | Sacks / Alexis | CONFIRMED | CA(SA) | SAICA | Streets Chartered Accountants (Cape Town) | Western Cape/Cape Town | — |
| 131 | **Celine Saunders** | Saunders / Celine | CONFIRMED | PA(SA) | SAIPA | — | Western Cape/Cape Town | — |
| 132 | **Mabatho Sedikela** | Sedikela / Mabatho | HIGH_CONFIDENCE | CA(SA) | SAICA | Auditor-General of South Africa (AGSA) | — | — |
| 133 | **Masechaba Sesing** | Sesing / Masechaba | CONFIRMED | CA(SA) | SAICA | Free State Provincial Treasury | Free State/Bloemfontein | — |
| 134 | **Samkelo Shangase** | Shangase / Samkelo | HIGH_CONFIDENCE | PA(SA) | SAIPA | — | Western Cape/Cape Town | — |
| 135 | **Zinhle Simamane** | Simamane / Zinhle | CONFIRMED | CA(SA) | SAICA | Traxtion | — | — |
| 136 | **Vaughn Smal** | Smal / Vaughn | CONFIRMED | PA(SA) | SAIPA | APBCO Auditors & Accountants | Western Cape/Somerset West (2025 page) / Hermanus (2026 grouping) | — |
| 137 | **Magdalena Smit** | Smit / Magdalena | CONFIRMED | PA(SA) | SAIPA | — | Western Cape/Western Region (city not stated) | — |
| 138 | **Nicol Smit** | Smit / Nicol | HIGH_CONFIDENCE | ACMA, CGMA | CIMA | Capitec Bank | Western Cape/Cape Town | — |
| 139 | **Adrian Smith** | Smith / Adrian | CONFIRMED | ACMA, CGMA | CIMA | Bounty Apparel | Western Cape/Cape Town | https://www.linkedin.com/in/adrian-smith-acma-cgma-30942b59/ |
| 140 | **Polani Sokombela** | Sokombela / Polani | CONFIRMED | CA(SA) | SAICA | Auditor-General of South Africa (AGSA) | — | — |
| 141 | **Juan Spies** | Spies / Juan | CONFIRMED | CA(SA) | SAICA | McA Durbanville Inc. | Western Cape/Durbanville | — |
| 142 | **Timothy Stegen** | Stegen / Timothy | HIGH_CONFIDENCE | PA(SA) | SAIPA | — | Western Cape/Cape Town | — |
| 143 | **Patricia Stock** | Stock / Patricia | CONFIRMED | CA(SA) | SAICA | SAICA | — | — |
| 144 | **Justin Stohr** | Stohr / Justin | HIGH_CONFIDENCE | PA(SA) | SAIPA | McA Accounting & Tax Services Inc. | Western Cape/Cape Town | — |
| 145 | **Edburg Strauss** | Strauss / Edburg | CONFIRMED | CA(SA) | SAICA | netCFO | Gauteng/Pretoria | https://www.linkedin.com/in/edburg-strauss/ |
| 146 | **Elmarie Swanepoel** | Swanepoel / Elmarie | HIGH_CONFIDENCE | CA(SA) | SAICA | Stellenbosch University | Western Cape/Stellenbosch | — |
| 147 | **Lukas Swart** | Swart / Lukas | CONFIRMED | ACMA, CGMA | CIMA | Astral Foods Ltd | Western Cape/Western Cape (city not stated) | https://www.linkedin.com/in/lukas-swart-acma-cgma-761180117/ |
| 148 | **Tanya Swart** | Swart / Tanya | HIGH_CONFIDENCE | AGA(SA) | SAICA | — | Western Cape/Stellenbosch | — |
| 149 | **Cecelia Swartz** | Swartz / Cecelia | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 150 | **Willem Theron** | Theron / Willem | CONFIRMED | CA(SA) | SAICA | PSG Konsult Ltd (PSG Financial Services) | — | — |
| 151 | **Ross Thomson** | Thomson / Ross | HIGH_CONFIDENCE | PA(SA) | SAIPA | Collective Accounting | KwaZulu-Natal/Winston Park | — |
| 152 | **TJ Toüa** | Toüa / TJ | CONFIRMED | PA(SA) | SAIPA | TnT Pro Services (Pty) Ltd | Western Cape/Kraaifontein (Cape Town) | https://www.linkedin.com/in/tj-to%C3%BCa-a7569b125/ |
| 153 | **Mikateko Tshetshe** | Tshetshe / Mikateko | CONFIRMED | FCMA, CGMA | CIMA | Unilever | — | — |
| 154 | **Peet van der Merwe** | van der Merwe / Peet | CONFIRMED | CA(SA) | SAICA | Forvis Mazars in South Africa | Free State/Bloemfontein | https://www.linkedin.com/in/peet-van-der-merwe-ca-sa-ra-8320b7a6/ |
| 155 | **Nadia Van Der Westhuizen** | Van Der Westhuizen / Nadia | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 156 | **Cornell van Eeden** | van Eeden / Cornell | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 157 | **Anton van Niekerk** | van Niekerk / Anton | CONFIRMED | ACMA, CGMA | CIMA | Snapplify | Western Cape/Cape Town | https://www.linkedin.com/in/anton-van-niekerk-acma-b7503b87/ |
| 158 | **Malikah van Reenen** | van Reenen / Malikah | CONFIRMED | PA(SA) | SAIPA | — | Western Cape/Cape Town | — |
| 159 | **Johann van Rensburg** | van Rensburg / Johann | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 160 | **Nora van Rensburg** | van Rensburg / Nora | HIGH_CONFIDENCE | ACMA, CGMA | CIMA | Moore Belgium | Western Cape/Cape Town | — |
| 161 | **Johan van Schalkwyk** | van Schalkwyk / Johan | CONFIRMED | ACMA, CGMA, PA(SA) | CIMA, SAIPA | Green Create (Green Create Africa) | Western Cape/Cape Town | https://www.linkedin.com/in/johan-van-schalkwyk-acma-cgma-19068110b/ |
| 162 | **Owen van Tonder** | van Tonder / Owen | CONFIRMED | CA(SA) | SAICA | Woolworths Holdings Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/owen-van-tonder-ca-sa-a8482131/ |
| 163 | **Jana van Zyl** | van Zyl / Jana | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 164 | **Louwtjie van Zyl** | van Zyl / Louwtjie | HIGH_CONFIDENCE | PA(SA) | SAIPA | APBCO Accountants (Somerset West) | Western Cape/Somerset West | — |
| 165 | **Rudi van Zyl** | van Zyl / Rudi | CONFIRMED | PA(SA), ACMA, CGMA | SAIPA, CIMA | Technical Systems | Western Cape/Cape Town | https://www.linkedin.com/in/rudi-van-zyl-7b5561143/ |
| 166 | **Willene van Zyl** | van Zyl / Willene | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 167 | **Louwtjie Venter** | Venter / Louwtjie | HIGH_CONFIDENCE | ACMA, CGMA | CIMA | Six33 Group | Western Cape/Cape Town | — |
| 168 | **Quintin Venter** | Venter / Quintin | HIGH_CONFIDENCE | PA(SA) | SAIPA | Sempre Financial Group | Western Cape/Bellville (Cape Town) | — |
| 169 | **Vijedharsan Vijendranath** | Vijendranath / Vijedharsan | CONFIRMED | FCCA | ACCA | — | Gauteng/Johannesburg | https://www.linkedin.com/in/vijedharsan-vijendranath-fcca-uk-6118b1103/ |
| 170 | **Chrizelda Visser** | Visser / Chrizelda | CONFIRMED | ACMA, CGMA | CIMA | Curated Beverages Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/chrizelda-visser-acma-cgma-3671b454/ |
| 171 | **Christiaan Vorster** | Vorster / Christiaan | CONFIRMED | CA(SA) | SAICA | SAICA | Western Cape/Cape Town | — |
| 172 | **Lize Vorster** | Vorster / Lize | CONFIRMED | ACMA, CGMA, PA(SA) | CIMA, SAIPA | Moore Management Services (Moore Stellenbosch) | Western Cape/Somerset West | https://www.linkedin.com/in/lize-vorster-0627ba9b/ |
| 173 | **Marco Wagener** | Wagener / Marco | HIGH_CONFIDENCE | PA(SA) | SAIPA | Excellentia Accounting and Tax Solutions | — | — |
| 174 | **Ryan Warren** | Warren / Ryan | HIGH_CONFIDENCE | AGA(SA) | SAICA | — | Western Cape/Cape Town | — |
| 175 | **Melissa Lee Williams** | Williams / Melissa Lee | CONFIRMED | PA(SA) | SAIPA | Galbraith Rushby (per About) / Go Tourism (per Experience header) — employer CONFLICTING | Western Cape/Cape Town | https://www.linkedin.com/in/melissa-lee-williams-123663171/ |
| 176 | **Mark Willimott** | Willimott / Mark | CONFIRMED | CA(SA) | SAICA | BDO South Africa | Eastern Cape/Gqeberha (Port Elizabeth) | — |
| 177 | **Taryn Woodbridge** | Woodbridge / Taryn | CONFIRMED | CA(SA) | SAICA | Mercedes-Benz South Africa Ltd | — | — |
| 178 | **Luke Woodhouse** | Woodhouse / Luke | CONFIRMED | CA(SA) | SAICA | GUUD GLOBAL | Gauteng/Johannesburg | https://www.linkedin.com/in/luke-woodhouse-ca-sa-b31a0149/ |
| 179 | **Dumisani Zulu** | Zulu / Dumisani | CONFIRMED | AGA(SA) | SAICA | Bonakude Consulting (Pty) Ltd | KwaZulu-Natal/Port Shepstone | https://www.linkedin.com/in/dumisani-zulu-aga-sa-aimfo-a5a62622 |

## 3b. Secondary-population notes (do not re-add)

- `ARTICLES_CONFIRMED_DESIGNATION_UNVERIFIED`: captured; excluded from the main qualified count.
- `CONFLICTING`: captured; designation wording conflicts within the source — verify, don't re-add.

## 3c. Investigated but EXCLUDED (do not capture unless evidence changes)

| Name(s) | Reason excluded |
|---|---|
| Brandon Christie CA(SA) | Deloitte — Amsterdam, Netherlands. Out of SA scope. |
| Lungelwa Ndlebe CPA, CA(SA) | Deloitte — New York area, USA. Out of SA scope. |
| Makhotso Moope CA(SA) | PwC UK — United Kingdom. Out of SA scope. |
| Siliziwe Tukani CA(SA), CPA | Deloitte — Hamilton (offshore). Out of SA scope. |
| Lyle Weber CA(SA), MCom | FXF — Greater Monroe / Texas, USA. Out of SA scope. |
| Nguquko Nyathi FCCA, ACMA, CGMA, MBA | Skipton International — Guernsey. Out of SA scope. |
| Kimberly Mitton | Atlantic Accounting (Table View) — ACCA 'in progress' (not a member). Not qualified yet. |
| Marco Barbera | emagine (Denmark) — surfaced via similar-profiles; not an SA CA(SA). |
| Juanita Roman | Streets Cape Town director — 'PG DIP (Tax)' only; NO designation on page → correctly NOT captured. |
| Reeza Isaacs | Woolworths ex-FD (resigned 2023) — lead only; no designation wording captured. |
| Francois Gouws / Mike Smith | PSG Konsult CEO/CFO — surfaced in annual report; no designation wording captured. |
| PKF WC partner/director names | Bellville/Stellenbosch (~13), Constantia Valley (~5), George (5) — names in snippets only, designations unverified; verify per person before capture. |
| Crowe CT/Winelands team | Gorgulho, Karro, Jonkers, Hamman, Bestbier, Marais et al — roster names without per-person designation wording; verify before capture. |
| Fenns Mossel Bay team | Jaco Vollgraaff pictured; Greg/San-Marie/Wilma/Jenna/Rochelle/Zinzan named in reviews without designations — verify before capture. |
| Candice Galant | Cape Town — LinkedIn card 'Senior Financial Accountant / Eligible to register as AGA(SA)' — PIPELINE (eligible, not registered). Re-check for AGA(SA) registration. |
| Anelisiwe Mdoyi | Cape Town — LinkedIn card 'Eligible to register as a AGA(SA) — Senior Auditor' — PIPELINE (eligible, not registered). |
| Chamu Makaranga | Maersk, Cape Town — CIMA appears only under Education; no ACMA/CGMA wording → RESEARCH_HOLD. |
| Deon Poolman | Deon Poolman Professional Accountants (Durbanville) — bio lists degrees only, no SAIPA designation wording → RESEARCH_HOLD (verify SAIPA membership). |
| Wynand Le Roux | findanaccountant.co.za listing (Durbanville) — 'SAIPA' only, no personal designation wording → RESEARCH_HOLD. |
| Kobus Muller | Somerset West — LinkedIn card 'Tax specialist and accountant' — no designation wording. |
| Maike Reiner ACMA, CGMA / Rachel Cowan FCCA | Tagged/author in Ozow LinkedIn posts — designation in name field but LOCATION and profile URL unverified → watchlist (likely Ozow Cape Town team). |
| Mohamed Banderker / Enid Strydom | SAIPA 'Professional Accountant' magazine (Dec 2019) lists both under 'Western Cape' — context (award/new member) unverified → watchlist. |
| Travis Wessels ACMA, CGMA | PepsiCo — Zaventem, Belgium (career history Tygervalley/Paarl; announced CFO Southern Africa role) — out of SA location today; inbound watchlist. |
| Kelsey Good AGA(SA) | Corbion — Gorinchem, Netherlands (ex East London). Out of SA scope. |
| Nkateko Maloox AGA(SA) | Sci-Bono Discovery Centre — Gauteng. Outside this session's Western Cape scope; candidate for Gauteng expansion. |
| Derick Wesson CA(SA), RA (PKF CT); Johan Loubser & Selna de Jongh (APBCO Paarl, CA + RA) | CA(SA)/RA — outside the non-CA designation scope of the WC sweep; not captured (CA-track candidates). |
| Moore South Africa partner directory (people pages 1–4) | Names/titles/locations only — no designation wording on the directory; verify per person on bio pages before capture. |

## 4. Disambiguation watchlist (near-duplicate risk)

| Names | Status |
|---|---|
| **André Huysamer AGA(SA)** (Kula, Worcester) vs **Andre Huysamer** (Principal Accountant, City of Cape Town) | Possibly distinct individuals — NOT merged; verify employer before treating as one person. |
| **Ashley Du Plessis AGA(SA)** (Paarl) vs **Lian du Plessis AGA(SA)** (Cape Chamber) vs **Lézanne Dirkse van Schalkwyk AGA(SA)** (McA) | Three distinct people — do not conflate by surname 'du Plessis'. |
| **Bonga Mokoena** | Duplicate `acc-0126` merged into `acc-0051` (single record since session 2). |
| **BDO South Africa** | Duplicate `cmp-0031` merged into `cmp-0071` (single record). |
| **Streets Chartered Accountants** vs **Streets (UK)** | One MD Streets Cape Town record (`cmp-0040`); UK parent not a separate SA employer. |
| **Louwtjie van Zyl PA(SA)** (APBCO Somerset West) vs **Louwtjie Venter ACMA CGMA** (Six33 Group, CT) vs **Rudi van Zyl** (Technical Systems) vs **Jana van Zyl CA(SA)** (LDP) | Four distinct people — do not merge on first name or surname. |
| **Nicol Smit ACMA, CGMA** (Capitec) vs **Magdalena Smit PA(SA)** (SAIPA board 2019) | Distinct people. |
| **Lukas Swart ACMA, CGMA** (Astral Foods) vs **Tanya Swart AGA(SA)** (Stellenbosch) | Distinct people. |
| **Fatima Bapukee** | Single record `acc-0075` now carries BOTH PA(SA) (2012) and CA(SA) (2024) per MD Streets Honour's Roll — do not create a second record. |
| **MD Streets Honour's Roll PA(SA)s** (Lotters, Musindo, Saunders, Adams, Jacobs, Daniels, Haumann, Nyamutumbu, van Reenen, Harris, Petersen, Abrahamse) | Designation + year verified; CURRENT employer NOT verified — enrich these records rather than re-adding when a LinkedIn profile is found. |

## 5. Companies already mapped (do not duplicate)

| ID | Company | Industry | SA locations |
|---|---|---|---|
| cmp-0039 | Absa Consultants & Actuaries | Financial Services | — |
| cmp-0018 | Absa Group | Banking | — |
| cmp-0036 | ACCA (South Africa) | Professional Services | — |
| cmp-0057 | Adriaan de Lange Advisory | Professional Services | Cape Town |
| cmp-0084 | AgrigateOne | Technology | Stellenbosch |
| cmp-0094 | APBCO Auditors & Accountants | Accounting / Audit | Paarl, Somerset West, Hermanus |
| cmp-0059 | ASL | Professional Services | Somerset West |
| cmp-0082 | Astral Foods Ltd | FMCG | Western Cape (County Fair operations), Pretoria (HQ) |
| cmp-0007 | Auditor-General of South Africa | Government | — |
| cmp-0073 | AYO Technology Solutions Limited | Technology | Cape Town |
| cmp-0010 | BAIC South Africa | Automotive | — |
| cmp-0021 | Bayer (South Africa) | Pharmaceuticals | — |
| cmp-0069 | BDO South Africa | Accounting / Audit | Johannesburg (Parktown), Cape Town, Stellenbosch, Gqeberha (Port Elizabeth), Durban, Pretoria |
| cmp-0017 | Bonakude Consulting (Pty) Ltd | Professional Services | — |
| cmp-0064 | Boshoff Knoetze Chartered Accountants | Accounting / Audit | Somerset West (Helderberg) |
| cmp-0054 | Bounty Apparel | Manufacturing | Cape Town |
| cmp-0043 | Brenn-O-Kem | Manufacturing | Stellenbosch / Worcester region (Western Cape) |
| cmp-0006 | Burstone | Property | — |
| cmp-0066 | Callidus Accountants | Accounting / Audit | Somerset West |
| cmp-0044 | Cape Chamber of Commerce & Industry | Non-Profit | Cape Town |
| cmp-0090 | Capitec Bank | Banking | Stellenbosch (HQ), Cape Town |
| cmp-0037 | CIMA Africa | Professional Services | — |
| cmp-0053 | Curated Beverages Ltd | FMCG | Cape Town (Tyger Valley) |
| cmp-0051 | Curro Holdings Ltd | Education | Cape Town (Durbanville) |
| cmp-0023 | Deloitte (South Africa) | Accounting / Audit | — |
| cmp-0014 | Drone Ops Group | Technology | — |
| cmp-0065 | Emma Pardoe Chartered Accountants (SA) | Accounting / Audit | Somerset West |
| cmp-0033 | Energy and Water Sector Education and Training Authority | Government | — |
| cmp-0034 | Financial Sector Conduct Authority | Government | — |
| cmp-0047 | Forvis Mazars in South Africa | Accounting / Audit | Cape Town (Century City), Johannesburg, Bloemfontein, Pretoria |
| cmp-0011 | Fourways Airconditioning | Engineering | — |
| cmp-0028 | Free State Provincial Treasury | Government | — |
| cmp-0077 | Galbraith Rushby | Accounting / Audit | Cape Town |
| cmp-0020 | Grant Thornton (South Africa) | Accounting / Audit | — |
| cmp-0079 | Green Create | Engineering | Cape Town |
| cmp-0058 | GUUD GLOBAL | Technology | Cape Town |
| cmp-0002 | Harmony Gold Mining | Mining | — |
| cmp-0070 | Johan le Roux CA(SA) | Accounting / Audit | Milnerton, Cape Town |
| cmp-0088 | JTC Group | Financial Services | Cape Town |
| cmp-0004 | KPMG (South Africa) | Accounting / Audit | — |
| cmp-0072 | Kula | — | Worcester |
| cmp-0038 | LA Financial Services (Pty) Ltd | Accounting / Audit | — |
| cmp-0008 | Lanseria International Airport | Aviation | — |
| cmp-0068 | LDP Chartered Accountants and Auditors Inc. | Accounting / Audit | Stellenbosch (HQ), Pretoria |
| cmp-0081 | Linkqage | Technology | Cape Town |
| cmp-0075 | M+C Saatchi Group | Professional Services | Cape Town |
| cmp-0031 | Makosi | Professional Services | — |
| cmp-0035 | Masisizane Fund | Financial Services | — |
| cmp-0024 | Massmart | Retail | — |
| cmp-0041 | McA Inc. | Accounting / Audit | Durbanville (Cape Town) |
| cmp-0012 | Mckenzie & Associates | Accounting / Audit | — |
| cmp-0001 | Mercedes-Benz South Africa Ltd | Automotive | — |
| cmp-0056 | MK Aerospace SA | Technology | Cape Town (Somerset West area) |
| cmp-0093 | Moore Belgium | Accounting / Audit | — |
| cmp-0085 | Moore Stellenbosch | Accounting / Audit | Stellenbosch |
| cmp-0032 | Motlanalo Chartered Accountants and Auditors Inc | Accounting / Audit | — |
| cmp-0025 | Motus Mobility Solutions | Automotive | — |
| cmp-0003 | Nedbank Group Limited | Banking | — |
| cmp-0063 | netCFO | Accounting / Audit | Pretoria |
| cmp-0080 | Ozow | Fintech | Cape Town |
| cmp-0071 | Pay@ | Fintech | Stellenbosch |
| cmp-0087 | Pick n Pay franchise (Rondebosch & Observatory) | Retail | Cape Town (Rondebosch, Observatory) |
| cmp-0048 | Pinnacle Accounting | Accounting / Audit | Western Cape |
| cmp-0030 | PKF Octagon | Accounting / Audit | — |
| cmp-0013 | Probeta Training (Pty) Ltd | Education | — |
| cmp-0067 | PSG Konsult Ltd | Financial Services | Stellenbosch (group HQ) |
| cmp-0027 | PwC (South Africa) | Accounting / Audit | — |
| cmp-0089 | Rain | Technology | Bryanston (HQ), Cape Town |
| cmp-0046 | Sable International | Professional Services | Cape Town |
| cmp-0009 | SAICA | Professional Services | — |
| cmp-0022 | SAP Africa | Technology | — |
| cmp-0045 | Schoemans Registered Auditors and Chartered Accountants | Accounting / Audit | Cape Town |
| cmp-0091 | Six33 Group | Other | Cape Town |
| cmp-0052 | Snapplify | Technology | Cape Town |
| cmp-0015 | South African State Theatre | Other | — |
| cmp-0060 | Stellenbosch University | Education | Stellenbosch |
| cmp-0040 | Streets Chartered Accountants | Accounting / Audit | Cape Town (Kenilworth) |
| cmp-0042 | Superside | Technology | Cape Town (SA finance base) |
| cmp-0016 | TCTA (Trans-Caledon Tunnel Authority) | Government | — |
| cmp-0083 | Technical Systems | Engineering | Cape Town |
| cmp-0061 | TFG Limited | Retail | Cape Town (Parow) |
| cmp-0074 | The Fieldbar Co. | Manufacturing | Cape Town |
| cmp-0055 | The Modern CFO | Professional Services | Cape Town |
| cmp-0092 | The Red Carnation Hotel Collection | Hospitality | Cape Town |
| cmp-0076 | TnT Pro Services (Pty) Ltd | Accounting / Audit | Kraaifontein (Cape Town) |
| cmp-0050 | TradeOn SA | Retail | Cape Town |
| cmp-0029 | Traxtion | Logistics | — |
| cmp-0086 | Tripco | Other | Stellenbosch |
| cmp-0019 | Unilever | FMCG | — |
| cmp-0049 | University of Cape Town | Education | Cape Town (Rondebosch Area) |
| cmp-0078 | VJ Professional Accountants | Accounting / Audit | Cape Town |
| cmp-0005 | Webber Wentzel | Professional Services | — |
| cmp-0026 | Wonga South Africa | Fintech | — |
| cmp-0062 | Woolworths Holdings Ltd | Retail | Cape Town |

## 6. Sources (dedup by URL)

95 unique source records in `sources.jsonl`. Before adding a source,
check the URL is absent from that file; reuse an existing `src-####` record instead of
duplicating the URL.
