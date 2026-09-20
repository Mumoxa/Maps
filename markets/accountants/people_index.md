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
| People (total records) | 157 |
| CONFIRMED qualified | 128 |
| HIGH_CONFIDENCE | 27 |
| ARTICLES_CONFIRMED_DESIGNATION_UNVERIFIED | 1 |
| CONFLICTING | 1 |
| Companies | 256 |
| Sources | 88 |

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
| 1 | **Naeem Asvat** | Asvat / Naeem | CONFIRMED | CA(SA) | SAICA | SAICA | KwaZulu-Natal/Durban | — |
| 2 | **Mark Augustine** | Augustine / Mark | HIGH_CONFIDENCE | PA(SA) | SAIPA | Pinnacle Accounting | Western Cape | — |
| 3 | **Lynette Badenhorst** | Badenhorst / Lynette | CONFIRMED | CA(SA) | SAICA | Probeta Training (Pty) Ltd | — | — |
| 4 | **Fatima Bapukee** | Bapukee / Fatima | CONFIRMED | CA(SA) | SAICA | Streets Chartered Accountants (Cape Town) | Western Cape/Cape Town | — |
| 5 | **Jody Baumgarten** | Baumgarten / Jody | HIGH_CONFIDENCE | CA(SA) | SAICA | Wonga (South Africa) | — | — |
| 6 | **Rachelle Best** | Best / Rachelle | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 7 | **J A 'Driaan' Beyers** | Beyers / Driaan | HIGH_CONFIDENCE | PA(SA) | SAIPA | Finkor Accounting | Gauteng/Rayton | — |
| 8 | **Uwe Birkenstock** | Birkenstock / Uwe | CONFIRMED | CA(SA) | SAICA | McA Durbanville Inc. | Western Cape/Durbanville | — |
| 9 | **Kobus Boshoff** | Boshoff / Kobus | CONFIRMED | CA(SA) | SAICA | Boshoff Knoetze Chartered Accountants | Western Cape/Somerset West | https://www.linkedin.com/in/kobus-boshoff-0a510888/ |
| 10 | **Trudie Botha** | Botha / Trudie | CONFIRMED | CA(SA) | SAICA | Zeelie Auditors | — | — |
| 11 | **Muhammad Brey** | Brey / Muhammad | CONFIRMED | CA(SA) | SAICA | Sea Harvest Group | Western Cape/Cape Town | https://www.linkedin.com/in/mobrey |
| 12 | **Suzel Breytenbach** | Breytenbach / Suzel | CONFIRMED | CA(SA) | SAICA | Zeelie Auditors | — | — |
| 13 | **Ralph Buddle** | Buddle / Ralph | CONFIRMED | CA(SA) | SAICA | TFG Limited (The Foschini Group) | Western Cape/Cape Town | — |
| 14 | **Kerry Cassel** | Cassel / Kerry | CONFIRMED | CA(SA) | SAICA | Motus Mobility Solutions | — | — |
| 15 | **Malcolm Cecil Coates** | Coates / Malcolm | HIGH_CONFIDENCE | PA(SA) | SAIPA | Alma Casa | Western Cape/Muizenberg (Cape Town) | — |
| 16 | **Carmen Coetzee** | Coetzee / Carmen | CONFIRMED | CA(SA) | SAICA | Van Wyk Auditors | — | — |
| 17 | **Johan Coetzee** | Coetzee / Johan | HIGH_CONFIDENCE | CA(SA) | SAICA | Callidus Accountants | Western Cape/Somerset West | — |
| 18 | **Simone Coetzee** | Coetzee / Simone | CONFIRMED | CA(SA) | SAICA | SC Audit (Schoeman Coetzee Audit) | — | — |
| 19 | **André Conradie** | Conradie / André | CONFIRMED | CA(SA) | SAICA | TC inc. | — | — |
| 20 | **Louwrens da Silva** | da Silva / Louwrens | HIGH_CONFIDENCE | PA(SA) | SAIPA | Petrichor Consulting | Western Cape/Somerset West | — |
| 21 | **Adre Daniel** | Daniel / Adre | HIGH_CONFIDENCE | PA(SA) | SAIPA | Accu-fin Accounting | Western Cape/Milnerton (Cape Town) | — |
| 22 | **Kyle Danster** | Danster / Kyle | CONFIRMED | ACMA, CGMA | CIMA | Curro Holdings Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/kyle-danster/ |
| 23 | **Graham Davin** | Davin / Graham | CONFIRMED | CA(SA) | SAICA | TFG Limited (The Foschini Group) | — | — |
| 24 | **Adriaan de Lange** | de Lange / Adriaan | CONFIRMED | CA(SA) | SAICA | Adriaan de Lange Advisory (Private Capacity) | Western Cape/Cape Town | https://www.linkedin.com/in/a3aandl/ |
| 25 | **Sandi De Souza** | De Souza / Sandi | CONFIRMED | CA(SA) | SAICA | SAP Africa | — | — |
| 26 | **Emile de Villiers** | de Villiers / Emile | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 27 | **Louis de Wet** | de Wet / Louis | CONFIRMED | CA(SA) | SAICA | TradeOn SA | Western Cape/Stellenbosch | https://www.linkedin.com/in/louisdewetza/ |
| 28 | **Pieter de Wit** | de Wit / Pieter | CONFIRMED | CA(SA) | SAICA | Afrimat | Western Cape/Cape Town | — |
| 29 | **Lézanne Dirkse van Schalkwyk** | Dirkse van Schalkwyk / Lézanne | CONFIRMED | AGA(SA) | SAICA | McA Inc. | Western Cape/Durbanville | — |
| 30 | **Nkosana Dlamini** | Dlamini / Nkosana | CONFIRMED | ACMA, CGMA | CIMA | Absa Group | Gauteng/Johannesburg | — |
| 31 | **André Du Plessis** | Du Plessis / André | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 32 | **Ashley Du Plessis** | Du Plessis / Ashley | CONFIRMED | AGA(SA) | SAICA | — | Western Cape/Paarl | https://www.linkedin.com/in/ashley-du-plessis-ba99a716b/ |
| 33 | **Lian du Plessis** | du Plessis / Lian | CONFIRMED | AGA(SA) | SAICA | Cape Chamber of Commerce & Industry | Western Cape/Cape Town | https://www.linkedin.com/in/lian-du-plessis-aga-sa-177375149/ |
| 34 | **Valentine Dzvova** | Dzvova / Valentine | CONFIRMED | CA(SA), ACMA, CGMA | SAICA, CIMA | AYO Technology Solutions Limited | Western Cape/Cape Town | https://za.linkedin.com/in/valentine-dzvova |
| 35 | **Zahid Fakey** | Fakey / Zahid | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 36 | **Zahida Fakey** | Fakey / Zahida | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 37 | **Neil Fourie** | Fourie / Neil | CONFIRMED | AGA(SA) | SAICA | Brenn-O-Kem | Western Cape/Stellenbosch | https://www.linkedin.com/in/neil-fourie-aga-sa-2a125b204/ |
| 38 | **Vukosi Fungeni** | Fungeni / Vukosi | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 39 | **Francois Geldenhuys** | Geldenhuys / Francois | CONFIRMED | CA(SA) | SAICA | Ratio Group | — | — |
| 40 | **Marta Gerbach** | Gerbach / Marta | CONFIRMED | CA(SA) | SAICA | Fourways Airconditioning | — | — |
| 41 | **Zandrea Gerber** | Gerber / Zandrea | CONFIRMED | CA(SA) | SAICA | Pay@ | Western Cape/Paarl | https://www.linkedin.com/in/zandrea-gerber-ca-sa-99a5a475/ |
| 42 | **Nonkululeko Gobodo** | Gobodo / Nonkululeko | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 43 | **Jana Goosen** | Goosen / Jana | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 44 | **Grant Greeff** | Greeff / Grant | CONFIRMED | CA(SA) | SAICA | Drone Ops Group | — | — |
| 45 | **Morgan Gregory** | Gregory / Morgan | CONFIRMED | CA(SA) | SAICA | MK Aerospace SA | Western Cape/Cape Town | https://www.linkedin.com/in/morgan-gregory-ca-sa-64046117b/ |
| 46 | **Alicia Haasbroek** | Haasbroek / Alicia | CONFLICTING | — | — | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 47 | **Ashley Hanekom** | Hanekom / Ashley | CONFIRMED | CA(SA) | SAICA | Superside | Western Cape/Cape Town | https://www.linkedin.com/in/ashleyhanekom/ |
| 48 | **Imtiaaz Hashim** | Hashim / Imtiaaz | CONFIRMED | CA(SA) | SAICA | BDO South Africa | Western Cape/Cape Town | — |
| 49 | **Ashlin Healy** | Healy / Ashlin | CONFIRMED | CA(SA) | SAICA | Deloitte (South Africa) | Western Cape/Cape Town | https://www.linkedin.com/in/ashlin-healy-ca-sa-130238103/ |
| 50 | **Illana Helman** | Helman / Illana | CONFIRMED | CA(SA) | SAICA | Massmart | Gauteng/Johannesburg | https://www.linkedin.com/in/illana-helman-ca-sa-1279b117/ |
| 51 | **Bronvin Heuvel** | Heuvel / Bronvin | CONFIRMED | CA(SA) | SAICA | KPMG (South Africa) | Western Cape/Cape Town | https://www.linkedin.com/in/bronvin-heuvel-ca-sa-ra-7b2475a9/ |
| 52 | **Mieke Hoffman** | Hoffman / Mieke | CONFIRMED | ACMA, CGMA | CIMA | The Fieldbar Co. | Western Cape/Cape Town | https://za.linkedin.com/in/mieke-hoffman |
| 53 | **André Huysamer** | Huysamer / André | HIGH_CONFIDENCE | AGA(SA) | SAICA | Kula | Western Cape/Worcester | — |
| 54 | **Darren Isaacs** | Isaacs / Darren | CONFIRMED | CA(SA) | SAICA | Makosi | — | — |
| 55 | **Roelof Jansen van Vuuren** | Jansen van Vuuren / Roelof | HIGH_CONFIDENCE | PA(SA) | SAIPA | The Tax Shop Pretoria North East | Gauteng/Pretoria | — |
| 56 | **Alana Johns** | Johns / Alana | HIGH_CONFIDENCE | PA(SA) | SAIPA | — | Western Cape | — |
| 57 | **Francois Joubert** | Joubert / Francois | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 58 | **Nethin Karamchand** | Karamchand / Nethin | CONFIRMED | CA(SA) | SAICA | Deloitte (South Africa) | Western Cape/Cape Town | https://www.linkedin.com/in/nethin/ |
| 59 | **Koko Khumalo** | Khumalo / Koko | CONFIRMED | CA(SA) | SAICA | Motlanalo Chartered Accountants and Auditors Inc | — | — |
| 60 | **Carla Kilian** | Kilian / Carla | HIGH_CONFIDENCE | PA(SA) | SAIPA | AETOS Financial Services | Gauteng/Roodepoort | — |
| 61 | **Enrico Kleinbooi** | Kleinbooi / Enrico | CONFIRMED | CA(SA) | SAICA | Kannaland Municipality | Western Cape/Ladismith | — |
| 62 | **Dylin Kuni** | Kuni / Dylin | CONFIRMED | ACMA, CGMA | CIMA | M+C Saatchi Group | Western Cape/Cape Town | https://www.linkedin.com/in/dylinkuni/ |
| 63 | **Lesetja Kwetepane** | Kwetepane / Lesetja | HIGH_CONFIDENCE | PA(SA) | SAIPA | LA Financial Services (Pty) Ltd | Limpopo/Polokwane | — |
| 64 | **Div Lamprecht** | Lamprecht / Div | CONFIRMED | CA(SA) | SAICA | SAICA | Free State/Bloemfontein | — |
| 65 | **Christiaan Laubscher** | Laubscher / Christiaan | CONFIRMED | CA(SA) | SAICA | Ratio Group | — | — |
| 66 | **Alice le Roux** | le Roux / Alice | CONFIRMED | CA(SA) | SAICA | Ratio Group | — | — |
| 67 | **Johan le Roux** | le Roux / Johan | CONFIRMED | CA(SA) | SAICA | Johan le Roux CA(SA) | Western Cape/Milnerton (Cape Town) | — |
| 68 | **Thinus Le Roux** | Le Roux / Thinus | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 69 | **Naledi Liphapang** | Liphapang / Naledi | HIGH_CONFIDENCE | CA(SA) | SAICA | — | — | — |
| 70 | **Mbali Precious Mabaso** | Mabaso / Mbali | CONFIRMED | CA(SA) | SAICA | Nedbank Group Limited | — | — |
| 71 | **Zanele Maduna** | Maduna / Zanele | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 72 | **Kgabiso Mahlangu** | Mahlangu / Kgabiso | CONFIRMED | AGA(SA) | SAICA | South African State Theatre | Gauteng/Pretoria | https://www.linkedin.com/in/kgabiso-mahlangu-aga-sa-b53a951a |
| 73 | **Mathabo Makhaya** | Makhaya / Mathabo | CONFIRMED | CA(SA) | SAICA | Harmony Gold Mining | — | — |
| 74 | **Mpho Makoko-Hottie** | Makoko-Hottie / Mpho | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 75 | **Patricia Malahlela** | Malahlela / Patricia | CONFIRMED | CA(SA) | SAICA | Mckenzie & Associates | — | — |
| 76 | **Annebelle Malan** | Malan / Annebelle | CONFIRMED | CA(SA) | SAICA | Ratio Group | — | — |
| 77 | **Manenzhe Manenzhe** | Manenzhe / Manenzhe | CONFIRMED | FCCA | ACCA | ACCA (South Africa) | Gauteng | https://www.linkedin.com/in/manenzhe-manenzhe-fcca-a80079150/ |
| 78 | **Zaid Manjra** | Manjra / Zaid | CONFIRMED | CA(SA) | SAICA | Woolworths Holdings Ltd | Western Cape/Cape Town | — |
| 79 | **Romy Maree** | Maree / Romy | CONFIRMED | CA(SA) | SAICA | Burstone (Real Estate partners) | — | — |
| 80 | **Iaan Marx** | Marx / Iaan | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 81 | **Katlego Matshego** | Matshego / Katlego | HIGH_CONFIDENCE | CA(SA) | SAICA | Independent Institute of Education (IIE) Varsity College / MSA | — | — |
| 82 | **Phumelela Mbande** | Mbande / Phumelela | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 83 | **Hlayisani Terrent Mboweni** | Mboweni / Hlayisani | HIGH_CONFIDENCE | PA(SA) | SAIPA | Mboweni Accountants | — | — |
| 84 | **Trevor McLachlan** | McLachlan / Trevor | HIGH_CONFIDENCE | PA(SA) | SAIPA | McA Inc. | Western Cape/Cape Town | — |
| 85 | **Hennie Meyer** | Meyer / Hennie | CONFIRMED | CA(SA) | SAICA | SC Audit (Schoeman Coetzee Audit) | — | — |
| 86 | **Mangaliso Mithi** | Mithi / Mangaliso | CONFIRMED | FCMA, CGMA | CIMA | — | Gauteng/Johannesburg | https://www.linkedin.com/in/mangalisomithi/ |
| 87 | **Siphesihle Mlangeni** | Mlangeni / Siphesihle | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 88 | **Mpolaheng Mohlopi** | Mohlopi / Mpolaheng | CONFIRMED | CA(SA) | SAICA | Lanseria International Airport | Gauteng/Lanseria | — |
| 89 | **Tumi Mokgoko** | Mokgoko / Tumi | CONFIRMED | CA(SA) | SAICA | KPMG | — | — |
| 90 | **Bonga Mokoena** | Mokoena / Bonga | CONFIRMED | CA(SA) | SAICA | BDO South Africa | Gauteng/Johannesburg | — |
| 91 | **Pumla Molope** | Molope / Pumla | CONFIRMED | CA(SA) | SAICA | African Women Chartered Accountants (AWCA) | — | — |
| 92 | **Mpho Mookapele** | Mookapele / Mpho | CONFIRMED | CA(SA) | SAICA | Energy and Water Sector Education and Training Authority (EWSETA) | — | — |
| 93 | **Vincent Motholo** | Motholo / Vincent | CONFIRMED | CA(SA) | SAICA | University of Cape Town | Western Cape/Cape Town | https://www.linkedin.com/in/vincent-motholo-ca-sa-842b7613/ |
| 94 | **Vusi Mpofu** | Mpofu / Vusi | CONFIRMED | AGA(SA) | SAICA | Nedbank | — | — |
| 95 | **Zine Mshengu** | Mshengu / Zine | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 96 | **Chwayita Mtebele** | Mtebele / Chwayita | CONFIRMED | CA(SA) | SAICA | Financial Sector Conduct Authority (FSCA) | — | — |
| 97 | **Tariro Mutizwa** | Mutizwa / Tariro | CONFIRMED | ACMA, CGMA | CIMA | AICPA & CIMA (CIMA Africa) | — | — |
| 98 | **Aneshree Naidoo** | Naidoo / Aneshree | CONFIRMED | CA(SA) | SAICA | Webber Wentzel | — | — |
| 99 | **Thenashree Naidoo** | Naidoo / Thenashree | HIGH_CONFIDENCE | CA(SA) | SAICA | Durban ICC | KwaZulu-Natal/Durban | — |
| 100 | **Nastassja Nel** | Nel / Nastassja | CONFIRMED | AGA(SA) | SAICA | Schoemans Registered Auditors and Chartered Accountants | Western Cape/Cape Town | https://www.linkedin.com/in/nastassja-nel-71a15364/ |
| 101 | **Buhle Hanise Nomabunga** | Nomabunga / Buhle | CONFIRMED | CA(SA) | SAICA | BAIC (South Africa) | — | — |
| 102 | **Zizipho Nyanga** | Nyanga / Zizipho | CONFIRMED | CA(SA) | SAICA | Masisizane Fund (Old Mutual) | — | — |
| 103 | **Jabulile Nyathi** | Nyathi / Jabulile | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 104 | **Tanya Oberholzer** | Oberholzer / Tanya | CONFIRMED | CA(SA) | SAICA | Van Wyk Auditors | — | — |
| 105 | **Emma Pardoe** | Pardoe / Emma | CONFIRMED | CA(SA) | SAICA | Emma Pardoe Chartered Accountants (SA) | Western Cape/Somerset West | https://www.linkedin.com/in/emmapardoe/ |
| 106 | **Anisah Patel** | Patel / Anisah | CONFIRMED | CA(SA) | SAICA | Own practice (Vereeniging) | Gauteng/Vereeniging | — |
| 107 | **Esther Pieterse** | Pieterse / Esther | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 108 | **Jan Potgieter** | Potgieter / Jan | HIGH_CONFIDENCE | CA(SA) | SAICA | TFG Limited (The Foschini Group) | — | — |
| 109 | **Taryn Raju** | Raju / Taryn | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 110 | **Ciara Reintjes** | Reintjes / Ciara | CONFIRMED | CA(SA) | SAICA | SAICA | — | — |
| 111 | **Vanessa Rheeder** | Rheeder / Vanessa | CONFIRMED | CA(SA) | SAICA | The Modern CFO | Western Cape/Cape Town | https://www.linkedin.com/in/vanessa-rheeder-ca-sa/ |
| 112 | **Dave Rich** | Rich / Dave | CONFIRMED | CA(SA) | SAICA | Streets Chartered Accountants (Cape Town) | Western Cape/Cape Town | — |
| 113 | **Alan Robbins** | Robbins / Alan | ARTICLES_CONFIRMED_DESIGNATION_UNVERIFIED | — | — | Sable International | Western Cape/Cape Town | — |
| 114 | **Lynette Roeloffze** | Roeloffze / Lynette | CONFIRMED | CA(SA) | SAICA | Forvis Mazars Group | Gauteng/Johannesburg | https://www.linkedin.com/in/lynette-roeloffze-ca-sa-ra-0637aa13/ |
| 115 | **Bianca Roos** | Roos / Bianca | CONFIRMED | CA(SA) | SAICA | PKF Octagon | — | — |
| 116 | **Alexis Sacks** | Sacks / Alexis | CONFIRMED | CA(SA) | SAICA | Streets Chartered Accountants (Cape Town) | Western Cape/Cape Town | — |
| 117 | **Niel Schoeman** | Schoeman / Niel | CONFIRMED | CA(SA) | SAICA | SC Audit (Schoeman Coetzee Audit) | — | — |
| 118 | **Willem Schoeman** | Schoeman / Willem | CONFIRMED | CA(SA) | SAICA | Van Wyk Auditors | — | — |
| 119 | **Mabatho Sedikela** | Sedikela / Mabatho | HIGH_CONFIDENCE | CA(SA) | SAICA | Auditor-General of South Africa (AGSA) | — | — |
| 120 | **Masechaba Sesing** | Sesing / Masechaba | CONFIRMED | CA(SA) | SAICA | Free State Provincial Treasury | Free State/Bloemfontein | — |
| 121 | **Zinhle Simamane** | Simamane / Zinhle | CONFIRMED | CA(SA) | SAICA | Traxtion | — | — |
| 122 | **Adrian Smith** | Smith / Adrian | CONFIRMED | ACMA, CGMA | CIMA | Bounty Apparel | Western Cape/Cape Town | https://www.linkedin.com/in/adrian-smith-acma-cgma-30942b59/ |
| 123 | **Severus Smith** | Smith / Severus | HIGH_CONFIDENCE | CA(SA) | SAICA | Schoemans Registered Auditors and Chartered Accountants | — | — |
| 124 | **Polani Sokombela** | Sokombela / Polani | CONFIRMED | CA(SA) | SAICA | Auditor-General of South Africa (AGSA) | — | — |
| 125 | **Juan Spies** | Spies / Juan | CONFIRMED | CA(SA) | SAICA | McA Durbanville Inc. | Western Cape/Durbanville | — |
| 126 | **Patricia Stock** | Stock / Patricia | CONFIRMED | CA(SA) | SAICA | SAICA | — | — |
| 127 | **Justin Stohr** | Stohr / Justin | HIGH_CONFIDENCE | PA(SA) | SAIPA | McA Accounting & Tax Services Inc. | Western Cape/Cape Town | — |
| 128 | **Edburg Strauss** | Strauss / Edburg | CONFIRMED | CA(SA) | SAICA | netCFO | Gauteng/Pretoria | https://www.linkedin.com/in/edburg-strauss/ |
| 129 | **Elmarie Swanepoel** | Swanepoel / Elmarie | HIGH_CONFIDENCE | CA(SA) | SAICA | Stellenbosch University | Western Cape/Stellenbosch | — |
| 130 | **Cecelia Swartz** | Swartz / Cecelia | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 131 | **Willem Theron** | Theron / Willem | CONFIRMED | CA(SA) | SAICA | PSG Konsult Ltd (PSG Financial Services) | — | — |
| 132 | **Ross Thomson** | Thomson / Ross | HIGH_CONFIDENCE | PA(SA) | SAIPA | Collective Accounting | KwaZulu-Natal/Winston Park | — |
| 133 | **Mikateko Tshetshe** | Tshetshe / Mikateko | CONFIRMED | FCMA, CGMA | CIMA | Unilever | — | — |
| 134 | **Eddie Turner** | Turner / Eddie | CONFIRMED | CA(SA) | SAICA | TC inc. | — | — |
| 135 | **Peet van der Merwe** | van der Merwe / Peet | CONFIRMED | CA(SA) | SAICA | Forvis Mazars in South Africa | Free State/Bloemfontein | https://www.linkedin.com/in/peet-van-der-merwe-ca-sa-ra-8320b7a6/ |
| 136 | **Tian van der Merwe** | van der Merwe / Tian | CONFIRMED | CA(SA) | SAICA | Ratio Group | — | — |
| 137 | **Nadia Van Der Westhuizen** | Van Der Westhuizen / Nadia | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 138 | **Cornell van Eeden** | van Eeden / Cornell | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 139 | **Anton van Niekerk** | van Niekerk / Anton | CONFIRMED | ACMA, CGMA | CIMA | Snapplify | Western Cape/Cape Town | https://www.linkedin.com/in/anton-van-niekerk-acma-b7503b87/ |
| 140 | **Johann van Rensburg** | van Rensburg / Johann | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 141 | **Owen van Tonder** | van Tonder / Owen | CONFIRMED | CA(SA) | SAICA | Woolworths Holdings Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/owen-van-tonder-ca-sa-a8482131/ |
| 142 | **Abré van Wyk** | van Wyk / Abré | CONFIRMED | CA(SA) | SAICA | TC inc. | — | — |
| 143 | **Justus van Wyk** | van Wyk / Justus | CONFIRMED | CA(SA) | SAICA | Van Wyk Auditors | — | — |
| 144 | **Jana van Zyl** | van Zyl / Jana | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 145 | **Willene van Zyl** | van Zyl / Willene | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 146 | **Quintin Venter** | Venter / Quintin | HIGH_CONFIDENCE | PA(SA) | SAIPA | Sempre Financial Group | Western Cape/Bellville (Cape Town) | — |
| 147 | **Vijedharsan Vijendranath** | Vijendranath / Vijedharsan | CONFIRMED | FCCA | ACCA | — | Gauteng/Johannesburg | https://www.linkedin.com/in/vijedharsan-vijendranath-fcca-uk-6118b1103/ |
| 148 | **Chrizelda Visser** | Visser / Chrizelda | CONFIRMED | ACMA, CGMA | CIMA | Curated Beverages Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/chrizelda-visser-acma-cgma-3671b454/ |
| 149 | **Dirk Visser** | Visser / Dirk | HIGH_CONFIDENCE | CA(SA) | SAICA | Schoemans Registered Auditors and Chartered Accountants | — | — |
| 150 | **Christiaan Vorster** | Vorster / Christiaan | CONFIRMED | CA(SA) | SAICA | SAICA | Western Cape/Cape Town | — |
| 151 | **Marco Wagener** | Wagener / Marco | HIGH_CONFIDENCE | PA(SA) | SAIPA | Excellentia Accounting and Tax Solutions | — | — |
| 152 | **Mark Willimott** | Willimott / Mark | CONFIRMED | CA(SA) | SAICA | BDO South Africa | Eastern Cape/Gqeberha (Port Elizabeth) | — |
| 153 | **Taryn Woodbridge** | Woodbridge / Taryn | CONFIRMED | CA(SA) | SAICA | Mercedes-Benz South Africa Ltd | — | — |
| 154 | **Luke Woodhouse** | Woodhouse / Luke | CONFIRMED | CA(SA) | SAICA | GUUD GLOBAL | Gauteng/Johannesburg | https://www.linkedin.com/in/luke-woodhouse-ca-sa-b31a0149/ |
| 155 | **Pieter Zeelie** | Zeelie / Pieter | CONFIRMED | CA(SA) | SAICA | Zeelie Auditors | — | — |
| 156 | **Andisa Zinja** | Zinja / Andisa | HIGH_CONFIDENCE | CA(SA) | SAICA | TCTA (Trans-Caledon Tunnel Authority) | Gauteng/Centurion | — |
| 157 | **Dumisani Zulu** | Zulu / Dumisani | CONFIRMED | AGA(SA) | SAICA | Bonakude Consulting (Pty) Ltd | KwaZulu-Natal/Port Shepstone | https://www.linkedin.com/in/dumisani-zulu-aga-sa-aimfo-a5a62622 |

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

## 4. Disambiguation watchlist (near-duplicate risk)

| Names | Status |
|---|---|
| **André Huysamer AGA(SA)** (Kula, Worcester) vs **Andre Huysamer** (Principal Accountant, City of Cape Town) | Possibly distinct individuals — NOT merged; verify employer before treating as one person. |
| **Ashley Du Plessis AGA(SA)** (Paarl) vs **Lian du Plessis AGA(SA)** (Cape Chamber) vs **Lézanne Dirkse van Schalkwyk AGA(SA)** (McA) | Three distinct people — do not conflate by surname 'du Plessis'. |
| **Bonga Mokoena** | Duplicate `acc-0126` merged into `acc-0051` (single record since session 2). |
| **BDO South Africa** | Duplicate `cmp-0031` merged into `cmp-0071` (single record). |
| **Streets Chartered Accountants** vs **Streets (UK)** | One MD Streets Cape Town record (`cmp-0042`); UK parent not a separate SA employer. |

## 5. Companies already mapped (do not duplicate)

| ID | Company | Industry | SA locations |
|---|---|---|---|
| cmp-0039 | Absa Consultants & Actuaries | Financial Services | — |
| cmp-0018 | Absa Group | Banking | — |
| cmp-0036 | ACCA (South Africa) | Professional Services | — |
| cmp-0256 | Acredo | Accounting / Audit | — |
| cmp-0057 | Adriaan de Lange Advisory | Professional Services | Cape Town |
| cmp-0215 | AFGRI Animal Feeds | Animal feed manufacturing | Klipheuwel mill; George depot |
| cmp-0245 | Afresh Brands Cape / Equi-Feeds | Animal feed manufacturing | Fisantekraal, Cape Town |
| cmp-0076 | Afrimat | Construction materials & mining | Multiple WC quarries/sites incl. Durbanville, Cape Town, West Coast, Overberg, Breede Valley |
| cmp-0077 | AfriSam | Construction materials | Peninsula Quarry; Rheebok/Malmesbury |
| cmp-0203 | Air Products South Africa | Industrial gases | Stikland, Cape Town |
| cmp-0193 | Aldera & Martina | Construction materials | Cape Town |
| cmp-0092 | Apollo Brick (Atlantis) | Construction materials | Atlantis |
| cmp-0134 | Ardagh Glass Packaging SA | Packaging manufacturing | Bellville |
| cmp-0059 | ASL | Professional Services | Somerset West |
| cmp-0119 | ASLA | Construction & infrastructure | Western Cape |
| cmp-0111 | Astron Energy | Energy / petrochemicals | Cape Town refinery |
| cmp-0211 | Atlantis Foundries | Heavy manufacturing | Atlantis |
| cmp-0007 | Auditor-General of South Africa | Government | — |
| cmp-0234 | Averda South Africa | Waste / environmental services | Blackheath; Cape Town; George; Mossel Bay onsite operations |
| cmp-0073 | AYO Technology Solutions Limited | Technology | Cape Town |
| cmp-0010 | BAIC South Africa | Automotive | — |
| cmp-0208 | Balance Catamarans Cape Town | Marine manufacturing | Cape Town |
| cmp-0021 | Bayer (South Africa) | Pharmaceuticals | — |
| cmp-0069 | BDO South Africa | Accounting / Audit | Johannesburg (Parktown), Cape Town, Stellenbosch, Gqeberha (Port Elizabeth), Durban, Pretoria |
| cmp-0163 | Betko Fresh Produce | Fresh produce | Overberg / Western Cape |
| cmp-0170 | Bidvest International Logistics | Logistics / warehousing | Paarden Eiland / Century City |
| cmp-0222 | BKB GrainCo / GrainCo Storage | Grain / storage / logistics | Paarl HQ; multiple Western Cape depots |
| cmp-0230 | Blaauwberg Cold Storage | Cold chain / logistics | Montague Gardens, Cape Town |
| cmp-0187 | Blublok Cement Manufacturers | Construction materials | Strand |
| cmp-0243 | Boland Cellar | Beverage / agriculture | Paarl |
| cmp-0017 | Bonakude Consulting (Pty) Ltd | Professional Services | — |
| cmp-0064 | Boshoff Knoetze Chartered Accountants | Accounting / Audit | Somerset West (Helderberg) |
| cmp-0054 | Bounty Apparel | Manufacturing | Cape Town |
| cmp-0131 | Bowler Metcalf / Bowler Plastics | Packaging manufacturing | Ottery / Cape Town + other sites |
| cmp-0093 | Bredasdorp Steenwerke | Construction materials | Bredasdorp |
| cmp-0043 | Brenn-O-Kem | Manufacturing | Stellenbosch / Worcester region (Western Cape) |
| cmp-0176 | Brights Hardware | Building materials distribution | Cape Town / Northern Suburbs / West Coast |
| cmp-0237 | Brito's Group | Food / meat processing | Kaymor Industria, Bellville; Brackengate |
| cmp-0006 | Burstone | Property | — |
| cmp-0094 | Cabrico | Construction materials | Somerset West |
| cmp-0066 | Callidus Accountants | Accounting / Audit | Somerset West |
| cmp-0186 | Cape Cement Products | Construction materials | Atlantis |
| cmp-0044 | Cape Chamber of Commerce & Industry | Non-Profit | Cape Town |
| cmp-0086 | Cape Concrete Works | Construction materials | Cape Town |
| cmp-0168 | Cape Fruit Coolers | Cold chain / logistics | Cape Town |
| cmp-0240 | Cape Herb & Spice | Food manufacturing | Cape Town |
| cmp-0192 | Cape Paving | Construction materials | Epping 2, Cape Town |
| cmp-0091 | CAPECAST | Construction materials | Western Cape |
| cmp-0160 | Capespan South Africa | Fresh produce | Cape-based / Western Cape presence |
| cmp-0177 | Cashbuild | Building materials distribution | Multiple Western Cape stores |
| cmp-0227 | CCS Logistics | Cold chain / logistics | Paarden Eiland, Epping and Duncan Dock, Cape Town |
| cmp-0157 | Ceres Fruit Growers | Fresh produce / packhouse | Ceres |
| cmp-0105 | Chryso Southern Africa | Construction chemicals | Beaconvale, Cape Town |
| cmp-0037 | CIMA Africa | Professional Services | — |
| cmp-0080 | Ciolli Bros | Construction materials | Gran Sasso Quarry, Contermanskloof/Potsdam |
| cmp-0220 | Citrusdal Rollermeule | Grain / milling | Citrusdal |
| cmp-0194 | Civil Pro Precast | Construction materials | Blackheath, Cape Town |
| cmp-0115 | Civils 2000 | Construction & infrastructure | Blackheath / Cape Town |
| cmp-0166 | Commercial Cold Holdings | Cold chain / logistics | Epping, Cape Town |
| cmp-0120 | Concor | Construction & infrastructure | Current Western Cape project activity |
| cmp-0248 | Concretex | Construction materials | Athlone Industria 2, Cape Town |
| cmp-0164 | Core Fruit | Fresh produce | Western Cape contact footprint |
| cmp-0096 | Corobrik Lansdowne | Construction materials | Cape Town |
| cmp-0216 | County Fair | Poultry / food processing | Agter-Paarl; Epping further processing |
| cmp-0197 | CSV Construction | Construction & infrastructure | Western Cape |
| cmp-0053 | Curated Beverages Ltd | FMCG | Cape Town (Tyger Valley) |
| cmp-0051 | Curro Holdings Ltd | Education | Cape Town (Durbanville) |
| cmp-0185 | Damen Shipyards Cape Town | Marine manufacturing | Port of Cape Town |
| cmp-0097 | De Hoop Steenwerwe | Construction materials | Paarl |
| cmp-0023 | Deloitte (South Africa) | Accounting / Audit | — |
| cmp-0149 | DGB | Beverage manufacturing | Wellington, Franschhoek, Boschendal |
| cmp-0210 | Dormac | Marine / heavy engineering | Cape Town and Saldanha |
| cmp-0014 | Drone Ops Group | Technology | — |
| cmp-0169 | DSV | Logistics / warehousing | Cape Town / Western Cape |
| cmp-0202 | Duram Smart Paints | Chemicals / building products | Montague Gardens; Cape Town factory |
| cmp-0159 | Dutoit Agri | Agriculture / fresh produce | Ceres / Western Cape |
| cmp-0065 | Emma Pardoe Chartered Accountants (SA) | Accounting / Audit | Somerset West |
| cmp-0033 | Energy and Water Sector Education and Training Authority | Government | — |
| cmp-0232 | EnviroServ | Waste / environmental services | Bellville; Vissershok; Gansbaai/Saldanha operations |
| cmp-0221 | Eureka Mills | Grain / milling | Heidelberg, Western Cape |
| cmp-0238 | Excellent Meat Group | Food / meat processing | Cape Town / Western Cape |
| cmp-0129 | Fabrinox | Engineering manufacturing | Paarl |
| cmp-0139 | Fair Cape Dairies | Dairy / food manufacturing | Killarney Gardens, farm processing, Malmesbury |
| cmp-0226 | Fechters Sawmill | Timber / manufacturing | Knysna |
| cmp-0089 | Fick Sementwerke | Construction materials | Western Cape |
| cmp-0034 | Financial Sector Conduct Authority | Government | — |
| cmp-0130 | Foct Engineering | Engineering manufacturing | Cape Town |
| cmp-0047 | Forvis Mazars in South Africa | Accounting / Audit | Cape Town (Century City), Johannesburg, Bloemfontein, Pretoria |
| cmp-0011 | Fourways Airconditioning | Engineering | — |
| cmp-0028 | Free State Provincial Treasury | Government | — |
| cmp-0162 | Fruitways | Fresh produce | Western Cape |
| cmp-0225 | Geelhoutvlei Timbers | Timber / manufacturing | Knysna district |
| cmp-0199 | GeoCiv Group | Construction & engineering | Joostenbergvlakte / Kraaifontein |
| cmp-0020 | Grant Thornton (South Africa) | Accounting / Audit | — |
| cmp-0171 | Grindrod / United Container Depots | Logistics / terminals | Salt River, Cape Town |
| cmp-0219 | Group 35 Foods | Grain / milling | Riebeek West / Swartland |
| cmp-0058 | GUUD GLOBAL | Technology | Cape Town |
| cmp-0122 | GVK-Siya Zama | Construction & infrastructure | Cape Town / Western Cape |
| cmp-0002 | Harmony Gold Mining | Mining | — |
| cmp-0117 | Haw & Inglis | Construction & infrastructure | Cape Town / Western Cape |
| cmp-0148 | HEINEKEN Beverages | Beverage manufacturing / distribution | Stellenbosch and Cape Town |
| cmp-0143 | I&J | Fishing / food processing | Cape Town / Paarden Eiland / Western Cape |
| cmp-0190 | Inca Concrete Products | Construction materials | Eerste River, Cape Town |
| cmp-0233 | Interwaste | Waste / recycling | Cape Town depot |
| cmp-0123 | Isipani Construction | Construction & infrastructure | Paarl / Western Cape |
| cmp-0205 | Italtile Group - Western Cape Distribution Centre | Building materials distribution | Western Cape distribution centre |
| cmp-0070 | Johan le Roux CA(SA) | Accounting / Audit | Milnerton, Cape Town |
| cmp-0098 | Johnson's Bricks | Construction materials | Oudtshoorn |
| cmp-0179 | JUWI South Africa | Renewable energy / EPC | Cape Town |
| cmp-0153 | Kaap Agri / Agrimark | Agriculture / distribution | Large WC branch network |
| cmp-0095 | Klay | Construction materials | Cape Town |
| cmp-0004 | KPMG (South Africa) | Accounting / Audit | — |
| cmp-0158 | Kromco | Fresh produce / packhouse | Grabouw / Elgin |
| cmp-0109 | Kropz Elandsfontein | Mining & minerals | West Coast near Saldanha |
| cmp-0072 | Kula | — | Worcester |
| cmp-0099 | Kurlandbrik | Construction materials | Plettenberg Bay |
| cmp-0150 | KWV | Beverage manufacturing | Paarl HQ + WC network |
| cmp-0038 | LA Financial Services (Pty) Ltd | Accounting / Audit | — |
| cmp-0138 | Lactalis South Africa | Dairy manufacturing | Stellenbosch HQ; Bonnievale factory |
| cmp-0146 | Ladismith Cheese / Woodlands Dairy Group | Dairy manufacturing | Ladismith |
| cmp-0145 | LANCEWOOD | Dairy manufacturing | George |
| cmp-0008 | Lanseria International Airport | Aviation | — |
| cmp-0090 | Lategan Sementwerke | Construction materials | Western Cape |
| cmp-0068 | LDP Chartered Accountants and Auditors Inc. | Accounting / Audit | Stellenbosch (HQ), Pretoria |
| cmp-0184 | Lesedi Nuclear Services | Engineering / EPC | Century City, Cape Town |
| cmp-0239 | Libstar | Food manufacturing | Multiple Cape-based business units |
| cmp-0161 | Lona Group | Fresh produce / logistics | Cape Town / Western Cape |
| cmp-0075 | M+C Saatchi Group | Professional Services | Cape Town |
| cmp-0125 | Macsteel | Steel & industrial distribution | Bellville South / Cape Town |
| cmp-0172 | Maersk | Logistics / cold chain | Belcon, Cape Town |
| cmp-0183 | Mainstream Renewable Power | Renewable energy / development | Claremont, Cape Town |
| cmp-0031 | Makosi | Professional Services | — |
| cmp-0118 | Martin & East | Construction & infrastructure | Western Cape |
| cmp-0035 | Masisizane Fund | Financial Services | — |
| cmp-0024 | Massmart | Retail | — |
| cmp-0201 | Mazor Group | Engineering / manufacturing | Killarney Gardens, Cape Town |
| cmp-0041 | McA Inc. | Accounting / Audit | Durbanville (Cape Town) |
| cmp-0012 | Mckenzie & Associates | Accounting / Audit | — |
| cmp-0214 | Meadow Feeds | Animal feed manufacturing | Paarl and Ladismith |
| cmp-0082 | Megamix | Construction materials | Multiple batching plants across Cape Town / Overberg |
| cmp-0001 | Mercedes-Benz South Africa Ltd | Automotive | — |
| cmp-0127 | Meshco | Steel / wire manufacturing | Blackheath, Cape Town |
| cmp-0110 | Mineral Sands Resources / Tormin | Mining & minerals | West Coast, Western Cape |
| cmp-0056 | MK Aerospace SA | Technology | Cape Town (Somerset West area) |
| cmp-0088 | Mobicast | Construction materials | George / Southern Cape |
| cmp-0032 | Motlanalo Chartered Accountants and Auditors Inc | Accounting / Audit | — |
| cmp-0025 | Motus Mobility Solutions | Automotive | — |
| cmp-0189 | Mouton Precast | Construction materials | Retreat, Cape Town |
| cmp-0132 | Mpact | Packaging / recycling | Epping, Kuils River, Atlantis, Paarl, Parow, Stellenbosch |
| cmp-0223 | MTO Group - George Sawmill | Timber / manufacturing | George |
| cmp-0084 | Much Asphalt | Construction materials | Western Cape / Cape Town |
| cmp-0181 | Mulilo | Renewable energy / IPP | Cape Town |
| cmp-0083 | Métier Mixed Concrete | Construction materials | Western Cape / Cape Town expansion footprint |
| cmp-0100 | Namakwa Kleistene | Construction materials | Klawer |
| cmp-0241 | Namaqua Wines | Beverage manufacturing | Vredendal |
| cmp-0135 | Nampak | Packaging / industrial | Epping, Cape Town |
| cmp-0101 | Naude Bakstene | Construction materials | Worcester |
| cmp-0003 | Nedbank Group Limited | Banking | — |
| cmp-0063 | netCFO | Accounting / Audit | Pretoria |
| cmp-0126 | NJR Steel | Steel & industrial distribution | Cape Town and Worcester |
| cmp-0213 | Nova Feeds | Animal feed manufacturing | Malmesbury and George |
| cmp-0142 | Oceana Group | Fishing / food processing | Cape Town-based group |
| cmp-0195 | Omega Concrete | Construction materials | Cape Town; three batch plants |
| cmp-0246 | Osdam Eco Facility | Agri-processing / circular economy | Western Cape |
| cmp-0152 | Overberg Agri | Agriculture / distribution | Western Cape / Overberg / Swartland network |
| cmp-0071 | Pay@ | Fintech | Stellenbosch |
| cmp-0140 | Peninsula Beverages | Beverage manufacturing | Cape Town / Western Cape |
| cmp-0137 | PepsiCo South Africa / Pioneer Foods | Food manufacturing / FMCG | Atlantis, Cape Town, Epping, George, Malmesbury, Paarl, Parow, Worcester |
| cmp-0112 | PetroSA | Energy / petrochemicals | Mossel Bay + Cape Town |
| cmp-0224 | PG Bison / Thesen | Timber / manufacturing | George / Southern Cape |
| cmp-0209 | Phoenix Marine Manufacturing | Marine manufacturing | Cape Town |
| cmp-0174 | Pick n Pay | Retail / distribution | Western Cape / Philippi DC + store network |
| cmp-0048 | Pinnacle Accounting | Accounting / Audit | Western Cape |
| cmp-0030 | PKF Octagon | Accounting / Audit | — |
| cmp-0133 | Polyoak Packaging | Packaging manufacturing | Diep River / Cape Town |
| cmp-0079 | Portland Group | Construction materials | Durbanville / Malmesbury |
| cmp-0114 | Power Group | Construction & infrastructure | Blackheath / Cape Town |
| cmp-0078 | PPC | Construction materials | De Hoek and Riebeeck, Western Cape |
| cmp-0144 | Premier Fishing & Brands | Fishing / processing | Cape Town HQ + WC operations |
| cmp-0013 | Probeta Training (Pty) Ltd | Education | — |
| cmp-0250 | Profile Feeds | Animal feed manufacturing | Klapmuts / Southern Paarl |
| cmp-0067 | PSG Konsult Ltd | Financial Services | Stellenbosch (group HQ) |
| cmp-0027 | PwC (South Africa) | Accounting / Audit | — |
| cmp-0212 | Quantum Foods Holdings | Agri / food production | Wellington HQ; Western Cape operations |
| cmp-0188 | Quickslab | Construction materials | Western Cape |
| cmp-0124 | R+N Master Builders | Construction & infrastructure | Cape Town |
| cmp-0251 | Ratio Group | Accounting / Audit | — |
| cmp-0121 | Raubex / Roadmac Surfacing Cape | Construction & infrastructure | Western Cape |
| cmp-0182 | Red Rocket | Renewable energy / IPP | Cape Town |
| cmp-0247 | Reliance Compost | Waste / agri-processing | Corona Farm, R312, Paarl Farms |
| cmp-0235 | Resource Innovations Africa | Waste / recycling | Cape Town |
| cmp-0136 | RFG Foods | Food manufacturing | Groot Drakenstein, Wellington, Tulbagh |
| cmp-0204 | Rheinmetall Denel Munition | Advanced manufacturing | Somerset West HQ; Wellington site |
| cmp-0206 | Robertson & Caine | Marine manufacturing | Cape Town manufacturing network |
| cmp-0128 | SA Metal Group | Metals / recycling | Multiple Cape Town-area sites |
| cmp-0151 | SAB / AB InBev - Newlands Brewery | Beverage manufacturing | Newlands, Cape Town |
| cmp-0046 | Sable International | Professional Services | Cape Town |
| cmp-0107 | Safintra South Africa | Building products | Brackenfell, Cape Town |
| cmp-0009 | SAICA | Professional Services | — |
| cmp-0106 | Saint-Gobain Gyproc | Building products | Parow Industria, Cape Town |
| cmp-0196 | Sandberg Transport | Construction materials / logistics | Western Cape |
| cmp-0022 | SAP Africa | Technology | — |
| cmp-0252 | SC Audit (Schoeman Coetzee Audit) | Accounting / Audit | — |
| cmp-0180 | Scatec South Africa | Renewable energy / IPP | Cape Town engineering hub |
| cmp-0045 | Schoemans Registered Auditors and Chartered Accountants | Accounting / Audit | Cape Town |
| cmp-0141 | Sea Harvest Group | Fishing / food processing | Cape Town, Saldanha, Mossel Bay and other WC operations |
| cmp-0154 | Sentraal-Suid Co-operative (SSK) | Agriculture / distribution | Swellendam / Overberg |
| cmp-0228 | Sequence Logistics | Cold chain / logistics | Stikland / Cape Town |
| cmp-0173 | Shoprite Holdings | Retail / distribution | Brackenfell / Cilmor |
| cmp-0104 | Sika South Africa | Construction chemicals | Montague Gardens, Cape Town |
| cmp-0191 | SmartStone Cape Town | Construction materials | Wellington |
| cmp-0052 | Snapplify | Technology | Cape Town |
| cmp-0167 | Snolink | Logistics / warehousing | Montague Gardens / Stikland |
| cmp-0178 | SOLA Group | Renewable energy / EPC | Cape Town |
| cmp-0015 | South African State Theatre | Other | — |
| cmp-0165 | Southern African Fruit Terminals (SAFT) | Cold chain / logistics | Paarl, Killarney, Atlantic / WC |
| cmp-0147 | Southern Oil (SOILL) | Agri-processing | Swellendam |
| cmp-0200 | Southey Contracting | Industrial services | Montague Gardens, Cape Town |
| cmp-0081 | SPH Kundalila | Mining / materials | Malmesbury and Saldanha evidence via ASPASA |
| cmp-0244 | Spier | Beverage / agriculture | Stellenbosch |
| cmp-0102 | Spitskop Steenwerke | Construction materials | Riversdale |
| cmp-0085 | SprayPave | Construction materials | Cape Town; Much Asphalt group |
| cmp-0198 | Stabilid Cape Construction | Construction & infrastructure | Brackenfell, Cape Town |
| cmp-0060 | Stellenbosch University | Education | Stellenbosch |
| cmp-0242 | Stellenbosch Vineyards / Advini South Africa | Beverage manufacturing | Stellenbosch |
| cmp-0040 | Streets Chartered Accountants | Accounting / Audit | Cape Town (Kenilworth) |
| cmp-0113 | Sunrise Energy | Energy / terminals | Port of Saldanha |
| cmp-0042 | Superside | Technology | Cape Town (SA finance base) |
| cmp-0229 | Table Bay Cold Storage | Cold chain / logistics | Paarden Eiland, Cape Town |
| cmp-0255 | TC inc. | Accounting / Audit | — |
| cmp-0016 | TCTA (Trans-Caledon Tunnel Authority) | Government | — |
| cmp-0061 | TFG Limited | Retail | Cape Town (Parow) |
| cmp-0175 | The Building Company | Building materials distribution | Large Western Cape store network |
| cmp-0074 | The Fieldbar Co. | Manufacturing | Cape Town |
| cmp-0055 | The Modern CFO | Professional Services | Cape Town |
| cmp-0217 | Tiger Brands | Food manufacturing | Six manufacturing sites in Western Cape |
| cmp-0087 | TopFloor | Construction materials | Western Cape |
| cmp-0050 | TradeOn SA | Retail | Cape Town |
| cmp-0029 | Traxtion | Logistics | — |
| cmp-0108 | Tronox Namakwa Sands | Mining & minerals | Brand-se-Baai / Saldanha |
| cmp-0156 | Tru-Cape Fruit Marketing | Fresh produce | Somerset West / WC grower network |
| cmp-0207 | Two Oceans Marine Manufacturing | Marine manufacturing | Cape Town |
| cmp-0155 | Two-a-Day Group | Fruit / agri-processing | Grabouw / Elgin |
| cmp-0019 | Unilever | FMCG | — |
| cmp-0049 | University of Cape Town | Education | Cape Town (Rondebosch Area) |
| cmp-0254 | Van Wyk Auditors | Accounting / Audit | — |
| cmp-0236 | WasteGo Green | Waste / recycling | Milnerton, Cape Town |
| cmp-0231 | WastePlan | Waste / recycling | Bellville regional office; Western Cape operations |
| cmp-0116 | WBHO Construction - Cape Division | Construction & infrastructure | Cape Town / Philippi |
| cmp-0005 | Webber Wentzel | Professional Services | — |
| cmp-0218 | Western Cape Milling | Grain / milling | Western Cape |
| cmp-0249 | WonderCrete Precast | Construction materials | Ottery, Cape Town |
| cmp-0026 | Wonga South Africa | Fintech | — |
| cmp-0062 | Woolworths Holdings Ltd | Retail | Cape Town |
| cmp-0103 | Worcester Bakstene | Construction materials | Worcester |
| cmp-0253 | Zeelie Auditors | Accounting / Audit | — |

## 6. Sources (dedup by URL)

88 unique source records in `sources.jsonl`. Before adding a source,
check the URL is absent from that file; reuse an existing `src-####` record instead of
duplicating the URL.
