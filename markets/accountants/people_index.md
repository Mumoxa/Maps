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
| People (total records) | 1715 |
| CONFIRMED | 896 |
| FINANCE_ROLE_CONFIRMED | 587 |
| HIGH_CONFIDENCE | 43 |
| ARTICLES_CONFIRMED_DESIGNATION_UNVERIFIED | 4 |
| CONFLICTING | 1 |
| NEEDS_VERIFICATION | 93 |
| REJECTED | 7 |
| RESEARCH_HOLD | 84 |
| Companies | 535 |
| Sources | 1363 |

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
| 1 | **Heidi Roux (Buhr)** | (Buhr) / Heidi Roux | NEEDS_VERIFICATION | Chartered Accountant | — | Amdec Group | Western Cape/Cape Town | — |
| 2 | **Dorman-Kade (D)** | (D) / Dorman-Kade | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/dorman-kade-d-87a070aa/ |
| 3 | **Anthea Jacobs (Hendricks)** | (Hendricks) / Anthea Jacobs | CONFIRMED | CA(SA) | SAICA | Employer verify | Western Cape location NOT confirmed — X-ray query association only | — |
| 4 | **Cayla Watson (Long)** | (Long) / Cayla Watson | CONFIRMED | CA(SA) | SAICA | Steyn City Properties | — | — |
| 5 | **Maria (Marietjie) Steinau** | (Marietjie) Steinau / Maria | CONFIRMED | CA(SA) | SAICA | V&A Waterfront | Western Cape/Cape Town | — |
| 6 | **More (Ml)** | (Ml) / More | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/more-ml-69583774/ |
| 7 | **Syed (Rb)** | (Rb) / Syed | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/syed-rb-86842677/ |
| 8 | **Maganathan (Vincin) Naidu** | (Vincin) Naidu / Maganathan | FINANCE_ROLE_CONFIRMED | — | — | AfriSam | — | https://www.linkedin.com/in/maganathan-vincin-naidu-851537123/ |
| 9 | **Kelly (Weidemann) Estment** | (Weidemann) Estment / Kelly | FINANCE_ROLE_CONFIRMED | — | — | Libstar | Western Cape/Stellenbosch | https://www.linkedin.com/in/kelly-estment-ca-sa-32484598/ |
| 10 | **Mohammed A. Mahomeddi** | A. Mahomeddi / Mohammed | FINANCE_ROLE_CONFIRMED | — | — | Concor | Gauteng/Bedfordview | https://www.linkedin.com/in/mohammed-a-mahomeddi-52a05b6a/ |
| 11 | **Naazneen Abdul Karim** | Abdul Karim / Naazneen | CONFIRMED | CA(SA) | SAICA | Renewable energy employer — confirm | Western Cape/Cape Town | — |
| 12 | **Fatgieja Abdullatief** | Abdullatief / Fatgieja | CONFIRMED | CA(SA) | SAICA | Employer unconfirmed | Cape Town – confirm | — |
| 13 | **Fatgieja Abdullatief** | Abdullatief / Fatgieja | CONFIRMED | CA(SA) | SAICA | Employer unconfirmed | Western Cape/Cape Town | — |
| 14 | **Ebrahiem Abrahams** | Abrahams / Ebrahiem | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/City of Cape Town | https://www.linkedin.com/in/ebrahiem-abrahams-69b831164/ |
| 15 | **Natasha Abrahams** | Abrahams / Natasha | RESEARCH_HOLD | — | — | Cancercare SA | Western Cape | https://za.linkedin.com/in/natasha-abrahams-3146aa45 |
| 16 | **Saadiqa Abrahams** | Abrahams / Saadiqa | FINANCE_ROLE_CONFIRMED | — | — | Cape Herb & Spice | Western Cape/Cape Town | https://www.linkedin.com/in/saadiqa-abrahams-3bb7ba34/ |
| 17 | **Yolandi Adam** | Adam / Yolandi | FINANCE_ROLE_CONFIRMED | — | — | Peninsula Beverages | Western Cape/City of Cape Town | https://www.linkedin.com/in/yolandi-adam-87074a1a/ |
| 18 | **Adeelah Adams** | Adams / Adeelah | FINANCE_ROLE_CONFIRMED | — | — | Commercial Cold Holdings | Western Cape/Cape Town | https://www.linkedin.com/in/adeelah-adams-a8285157/ |
| 19 | **Prudence Adams** | Adams / Prudence | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/prudence-adams-6ba5b939 |
| 20 | **Zaida Adams** | Adams / Zaida | NEEDS_VERIFICATION | Chartered Accountant | — | Unconfirmed (CFO Investec Property Fund from Dec 2020 per profile) | — | — |
| 21 | **Juan Addison** | Addison / Juan | NEEDS_VERIFICATION | Chartered Accountant | — | Faircape Group | Western Cape/Cape Town | — |
| 22 | **Lex Adendorff** | Adendorff / Lex | FINANCE_ROLE_CONFIRMED | — | — | Ladismith Cheese / Woodlands Dairy Group | Eastern Cape/Port Elizabeth | https://www.linkedin.com/in/lex-adendorff-0230a459/ |
| 23 | **Rachel Adendorff** | Adendorff / Rachel | CONFIRMED | CA(SA) | SAICA | Renewable energy project entities | Cape Town – confirm | — |
| 24 | **Rachel Adendorff** | Adendorff / Rachel | CONFIRMED | CA(SA) | SAICA | Renewable energy project entities | Western Cape/Cape Town | — |
| 25 | **Rynauw Adriaan** | Adriaan / Rynauw | CONFIRMED | PA(SA) | SAIPA | DigiOutsource | Western Cape/Cape Town | https://za.linkedin.com/in/rynauw-adriaan-04607011a |
| 26 | **Byron Adriaanse** | Adriaanse / Byron | CONFIRMED | ACCA | ACCA | Red Badger | Western Cape/Cape Town | https://za.linkedin.com/in/byron-adriaanse-acca-842545155 |
| 27 | **Claudia Adriaanse** | Adriaanse / Claudia | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/claudia-adriaanse-091928100/ |
| 28 | **John Afordofe** | Afordofe / John | CONFIRMED | CA(SA) | SAICA | Mergence Investment Managers | — | — |
| 29 | **Hayley Africa** | Africa / Hayley | FINANCE_ROLE_CONFIRMED | — | — | Excellent Meat Group | Western Cape/Cape Town | https://www.linkedin.com/in/hayley-africa-869112117/ |
| 30 | **Naseera Ahmed** | Ahmed / Naseera | CONFIRMED | CA(SA) | SAICA | Infra Impact Investment Managers | Western Cape/Cape Town | — |
| 31 | **Chantell Ajam** | Ajam / Chantell | CONFIRMED | CA(SA) | SAICA | Polyoak Packaging | Eastern Cape/Port Elizabeth | https://www.linkedin.com/in/chantellajam/ |
| 32 | **Jacques Aldrich** | Aldrich / Jacques | CONFIRMED | CA(SA) | SAICA | Kallos Global | Western Cape/Cape Town | — |
| 33 | **Jacques Aldrich** | Aldrich / Jacques | CONFIRMED | CA(SA) | SAICA | Kallos Global | Western Cape/Cape Town | — |
| 34 | **Angeline Aldridge** | Aldridge / Angeline | CONFIRMED | CA(SA) | SAICA | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/angeline-aldridge-86b929184/ |
| 35 | **Juliet Alexander (Neethling)** | Alexander (Neethling) / Juliet | FINANCE_ROLE_CONFIRMED | MAT(SA) | SAICA | Klay | Western Cape/Cape Town | https://www.linkedin.com/in/juliet-alexander-neethling-96639945/ |
| 36 | **Ashraf Ali Brey** | Ali Brey / Ashraf | CONFIRMED | CA(SA) | SAICA | Bemcorp | Western Cape/Cape Town | — |
| 37 | **Maruping Alina** | Alina / Maruping | FINANCE_ROLE_CONFIRMED | — | — | DSV | South Africa | https://www.linkedin.com/in/maruping-alina-37268971/ |
| 38 | **Mark Allen** | Allen / Mark | CONFIRMED | CA(SA) | SAICA | Instarc | Western Cape location NOT confirmed — X-ray query association only | — |
| 39 | **Mark Allen** | Allen / Mark | CONFIRMED | CA(SA) | SAICA | Instarc | Western Cape/Western Cape | — |
| 40 | **Richard Allen** | Allen / Richard | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Eastern Cape/Port Elizabeth | https://www.linkedin.com/in/richard-allen-4527b9144/ |
| 41 | **Ammaar Allie** | Allie / Ammaar | CONFIRMED | CA(SA) | SAICA | Unconfirmed | South Africa | — |
| 42 | **Masood Allie** | Allie / Masood | CONFIRMED | CA(SA) | SAICA | FPG Property Fund | Western Cape/Cape Town | — |
| 43 | **Masood Allie** | Allie / Masood | CONFIRMED | CA(SA) | SAICA | FPG Property Fund | Western Cape/Cape Town | — |
| 44 | **Ebrahim Ally** | Ally / Ebrahim | CONFIRMED | CA(SA) | SAICA | Mpact | Gauteng/City of Johannesburg | https://www.linkedin.com/in/ebrahim-ally8505/ |
| 45 | **nasrin amin** | amin / nasrin | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Gauteng/City of Johannesburg | https://www.linkedin.com/in/nasrin-amin-00953379/ |
| 46 | **Charl Andre Arndt** | Andre Arndt / Charl | CONFIRMED | AGA(SA) | SAICA | EMS Tax | Western Cape/Stellenbosch | https://za.linkedin.com/in/charl-andre-arndt |
| 47 | **Pieter Andre Schumyn** | Andre Schumyn / Pieter | RESEARCH_HOLD | — | — | — | Western Cape/Western Cape candidate pool | https://za.linkedin.com/in/pieter-andre-schumyn-5b8008126 |
| 48 | **Michael Ansermino** | Ansermino / Michael | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | KwaZulu-Natal/Durban | https://www.linkedin.com/in/michael-ansermino-ab9666242/ |
| 49 | **Lorraine Anwar** | Anwar / Lorraine | FINANCE_ROLE_CONFIRMED | — | — | Corobrik Lansdowne | KwaZulu-Natal/Durban | https://www.linkedin.com/in/lorraine-anwar-9b8016bb/ |
| 50 | **Bevill Arendse** | Arendse / Bevill | FINANCE_ROLE_CONFIRMED | — | — | Averda South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/bevill-arendse-7268539b/ |
| 51 | **Charneé Arendse** | Arendse / Charneé | HIGH_CONFIDENCE | AGA(SA) | SAICA | Capitec | Western Cape/Stellenbosch | — |
| 52 | **Jessica Arendse** | Arendse / Jessica | RESEARCH_HOLD | — | — | Food Lover's Market Holdings | Western Cape | — |
| 53 | **Justine Arendse** | Arendse / Justine | CONFIRMED | CA(SA) | SAICA | VDMV Property Group | Western Cape/Cape Town | — |
| 54 | **Justine Arendse** | Arendse / Justine | CONFIRMED | CA(SA) | SAICA | VDMV Property Group | Western Cape/Cape Town | — |
| 55 | **Thyron Arumugam** | Arumugam / Thyron | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | KwaZulu-Natal/Durban | https://www.linkedin.com/in/thyron-arumugam-52b729100/ |
| 56 | **Kofi Asiamah** | Asiamah / Kofi | CONFIRMED | CA(SA) | SAICA | Investec | — | — |
| 57 | **Naeem Asvat** | Asvat / Naeem | CONFIRMED | CA(SA) | SAICA | SAICA | KwaZulu-Natal/Durban | — |
| 58 | **Leticia August** | August / Leticia | FINANCE_ROLE_CONFIRMED | — | — | Fruitways | Western Cape/City of Cape Town | https://www.linkedin.com/in/leticia-august-4667baa5/ |
| 59 | **Mark Augustine** | Augustine / Mark | HIGH_CONFIDENCE | PA(SA) | SAIPA | Pinnacle Accounting | Western Cape | — |
| 60 | **Lynette Badenhorst** | Badenhorst / Lynette | CONFIRMED | CA(SA) | SAICA | Probeta Training (Pty) Ltd | — | — |
| 61 | **wilhelmina badenhorst** | badenhorst / wilhelmina | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/City of Johannesburg | https://www.linkedin.com/in/wilhelmina-badenhorst-b0762972/ |
| 62 | **Paul Badrick** | Badrick / Paul | CONFIRMED | CA(SA) | SAICA | BDO South Africa (Johannesburg) | Gauteng/Johannesburg | — |
| 63 | **Nerasha Bahaw-Louw** | Bahaw-Louw / Nerasha | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/nerasha-bahaw-louw-92888376/ |
| 64 | **Alvina Bailey** | Bailey / Alvina | NEEDS_VERIFICATION | Chartered Accountant | — | Stor-Age Property REIT | Western Cape/Cape Town | — |
| 65 | **Margot Baird** | Baird / Margot | FINANCE_ROLE_CONFIRMED | — | — | EnviroServ | KwaZulu-Natal/Durban | https://www.linkedin.com/in/margot-baird-1bb72596/ |
| 66 | **Sandra Baisch** | Baisch / Sandra | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/sandra-baisch-530a7436/ |
| 67 | **Omar Ahmed Baker** | Baker / Omar | HIGH_CONFIDENCE | CA(SA) | SAICA | FNB Islamic Banking | — | — |
| 68 | **Andisiwe Baliso** | Baliso / Andisiwe | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/andisiwe-baliso-78624631/ |
| 69 | **Imran Bapoo** | Bapoo / Imran | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/imran-bapoo-ca-sa-518a365b/ |
| 70 | **Fatima Bapukee** | Bapukee / Fatima | CONFIRMED | CA(SA) | SAICA | Streets Chartered Accountants (Cape Town) | Western Cape/Cape Town | — |
| 71 | **Marco Barbera** | Barbera / Marco | CONFIRMED | CA(SA) | SAICA | The Uitkyk Domain | Western Cape location NOT confirmed — X-ray query association only | — |
| 72 | **Marco Barbera** | Barbera / Marco | CONFIRMED | CA(SA) | SAICA | The Uitkyk Domain | Western Cape/Western Cape | — |
| 73 | **James Barker** | Barker / James | CONFIRMED | CA(SA) | SAICA | Unconfirmed (engaged as interim CFO of SA Corporate Real Estate, Jan-Feb 2022) | — | — |
| 74 | **Christiaan Barnard** | Barnard / Christiaan | CONFIRMED | CA(SA) | SAICA | Spear REIT Limited | Western Cape/Cape Town | — |
| 75 | **Christiaan Barnard** | Barnard / Christiaan | CONFIRMED | CA(SA) | SAICA | Spear REIT | Western Cape/Cape Town | — |
| 76 | **Christiaan Barnard** | Barnard / Christiaan | CONFIRMED | CA(SA) | SAICA | Spear REIT | Western Cape/Cape Town | — |
| 77 | **Eben Barnard** | Barnard / Eben | FINANCE_ROLE_CONFIRMED | — | — | Power Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/eben-barnard-9959b813/ |
| 78 | **Liezl Barnard** | Barnard / Liezl | CONFIRMED | CA(SA) | SAICA | AfriSam | — | https://www.linkedin.com/in/liezl-barnard-ca-sa-62448157/ |
| 79 | **Clifford Barnes** | Barnes / Clifford | CONFIRMED | CA(SA) | SAICA | Raubex Construction | Free State/Bloemfontein | https://www.linkedin.com/in/clifford-barnes-ca-sa-14376b95 |
| 80 | **Clifford Barnes** | Barnes / Clifford | REJECTED | CA(SA) | SAICA | Raubex Construction | Western Cape/Western Cape | — |
| 81 | **Robyn Bartlett** | Bartlett / Robyn | FINANCE_ROLE_CONFIRMED | — | — | RFG Foods | Western Cape/City of Cape Town | https://www.linkedin.com/in/robyn-bartlett-65831a120/ |
| 82 | **Calvin Bassa** | Bassa / Calvin | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/City of Johannesburg | https://www.linkedin.com/in/calvin-bassa-46345b36/ |
| 83 | **Wico Basson** | Basson / Wico | CONFIRMED | AGA(SA), ACMA, CGMA | SAICA, CIMA | FUL Foods | Western Cape/Somerset West | https://za.linkedin.com/in/wicobasson |
| 84 | **Suzaan Batista** | Batista / Suzaan | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group | Western Cape/Cape Town | https://www.linkedin.com/in/suzaan-batista-ca-sa-865238339/ |
| 85 | **Jody Baumgarten** | Baumgarten / Jody | HIGH_CONFIDENCE | CA(SA) | SAICA | Wonga (South Africa) | — | — |
| 86 | **Sibabalwe Bebeza** | Bebeza / Sibabalwe | CONFIRMED | CA(SA) | SAICA | BDO South Africa | Gauteng/Johannesburg | — |
| 87 | **Melissa Beck** | Beck / Melissa | FINANCE_ROLE_CONFIRMED | — | — | Southern Oil (SOILL) | Western Cape/City of Cape Town | https://www.linkedin.com/in/melissa-beck-aa8812a4/ |
| 88 | **Patricia Becker** | Becker / Patricia | FINANCE_ROLE_CONFIRMED | — | — | Métier Mixed Concrete | KwaZulu-Natal/KwaZulu-Natal | https://www.linkedin.com/in/patricia-becker-8552241b1/ |
| 89 | **Warren Beelders** | Beelders / Warren | CONFIRMED | CA(SA) | SAICA | Current employer unclear | Cape Town – confirm | — |
| 90 | **Warren Beelders** | Beelders / Warren | CONFIRMED | CA(SA) | SAICA | Current employer unclear | Western Cape/Cape Town | — |
| 91 | **Thys de Beer** | Beer / Thys de | CONFIRMED | CA(SA) | SAICA | Java Capital | — | — |
| 92 | **Bronwyn Behm** | Behm / Bronwyn | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/City of Cape Town | https://www.linkedin.com/in/bronwyn-behm-058a4666/ |
| 93 | **Chulumanco Beja** | Beja / Chulumanco | CONFIRMED | PA(SA) | SAIPA | Galbraith Rushby | Western Cape | https://za.linkedin.com/in/chulumanco-beja-25bb421bb |
| 94 | **Anel Bekker** | Bekker / Anel | HIGH_CONFIDENCE | ACMA, CGMA | CIMA | Freshworld (Pty) Ltd | Western Cape/Stellenbosch | — |
| 95 | **Etienne Bekker** | Bekker / Etienne | CONFIRMED | AGA(SA) | SAICA | ACCIONA Energía | Western Cape/Cape Town | https://za.linkedin.com/in/etienne-bekker-aga-sa-92929013 |
| 96 | **Marco Bekker** | Bekker / Marco | CONFIRMED | AGA(SA) | SAICA | N1 Restaurant Suppliers | Western Cape/Cape Town | https://za.linkedin.com/in/marco-bekker-aga-sa-mba-sbs-3230a8b |
| 97 | **Nicole Benjamin** | Benjamin / Nicole | NEEDS_VERIFICATION | Chartered Accountant | — | Employer and title unconfirmed | Cape Town – verify | — |
| 98 | **Nicole Benjamin** | Benjamin / Nicole | CONFIRMED | CA(SA) | SAICA | Employer and title unconfirmed | Western Cape/Cape Town | — |
| 99 | **Elizabeth Bennett** | Bennett / Elizabeth | NEEDS_VERIFICATION | Chartered Accountant | — | ENERTRAG South Africa | Western Cape/Cape Town | — |
| 100 | **Gwuineth Benting** | Benting / Gwuineth | FINANCE_ROLE_CONFIRMED | — | — | Peninsula Beverages | Western Cape/Cape Town | https://www.linkedin.com/in/gwuineth-benting-5ab483a2/ |
| 101 | **Vimbai Benza** | Benza / Vimbai | CONFIRMED | ACMA, CGMA | CIMA | Akacia Medical and Healthcare Group | Western Cape/Cape Town | https://za.linkedin.com/in/vimbai-benza-acma-cgma-880a8630 |
| 102 | **Michelle Bernice Du Preez** | Bernice Du Preez / Michelle | FINANCE_ROLE_CONFIRMED | — | — | Macsteel | Gauteng/Gauteng | https://www.linkedin.com/in/michelle-du-preez-89481975/ |
| 103 | **Nieke Berry** | Berry / Nieke | CONFIRMED | CA(SA) | SAICA | Hungry Lion | Cape Town, Western Cape | — |
| 104 | **Nieke Berry** | Berry / Nieke | CONFIRMED | CA(SA) | SAICA | Hungry Lion | Western Cape/Cape Town | — |
| 105 | **Michael Besson** | Besson / Michael | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/City of Johannesburg | https://www.linkedin.com/in/michael-besson-088b39b2/ |
| 106 | **Rachelle Best** | Best / Rachelle | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 107 | **Cala Bester** | Bester / Cala | FINANCE_ROLE_CONFIRMED | — | — | R+N Master Builders | Western Cape/City of Cape Town | https://za.linkedin.com/in/cala-bester-b5768b12b |
| 108 | **Elza Bester** | Bester / Elza | FINANCE_ROLE_CONFIRMED | — | — | Tronox Namakwa Sands | Western Cape/Saldanha Bay Local Municipality | https://www.linkedin.com/in/elza-bester-4566ba58/ |
| 109 | **Frederick Bester** | Bester / Frederick | RESEARCH_HOLD | — | — | — | Western Cape/Western Cape candidate pool | https://za.linkedin.com/in/bester-chris-frederick |
| 110 | **Hannes Bester** | Bester / Hannes | CONFIRMED | CA(SA) | SAICA | Consulting | Western Cape/Cape Town | — |
| 111 | **Hannes Bester** | Bester / Hannes | CONFIRMED | CA(SA) | SAICA | Consulting | Western Cape/Cape Town | — |
| 112 | **Cindy Beukes** | Beukes / Cindy | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/cindy-beukes-66534483/ |
| 113 | **Elana Beukes** | Beukes / Elana | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/elana-beukes-cima-adv-dip-ma-b7764461 |
| 114 | **Elané Beukes (Botha)** | Beukes (Botha) / Elané | FINANCE_ROLE_CONFIRMED | — | — | Overberg Agri | Western Cape/Caledon | https://www.linkedin.com/in/elané-beukes-botha-28a628155/ |
| 115 | **J A 'Driaan' Beyers** | Beyers / Driaan | HIGH_CONFIDENCE | PA(SA) | SAIPA | Finkor Accounting | Gauteng/Rayton | — |
| 116 | **Angelic Bezuidenhoudt** | Bezuidenhoudt / Angelic | FINANCE_ROLE_CONFIRMED | — | — | Peninsula Beverages | Western Cape/Cape Town | https://www.linkedin.com/in/angelic-bezuidenhoudt-906780334/ |
| 117 | **Alwyn Bezuidenhout** | Bezuidenhout / Alwyn | FINANCE_ROLE_CONFIRMED | — | — | Macsteel | Gauteng/City of Johannesburg | https://www.linkedin.com/in/alwyn-bezuidenhout-8308805a/ |
| 118 | **Andre Bezuidenhout** | Bezuidenhout / Andre | CONFIRMED | CA(SA) | SAICA | Climate Fund Managers | Western Cape location NOT confirmed — X-ray query association only | — |
| 119 | **Andre Bezuidenhout** | Bezuidenhout / Andre | CONFIRMED | CA(SA) | SAICA | Climate Fund Managers | Western Cape/Western Cape | — |
| 120 | **Wynand Bezuidenhout** | Bezuidenhout / Wynand | CONFIRMED | AGA(SA) | SAICA | SDK | CA Group | Western Cape/Durbanville | https://za.linkedin.com/in/wynandbez99 |
| 121 | **Uwe Birkenstock** | Birkenstock / Uwe | CONFIRMED | CA(SA) | SAICA | McA Durbanville Inc. | Western Cape/Durbanville | — |
| 122 | **Patrick Birkett** | Birkett / Patrick | NEEDS_VERIFICATION | Chartered Accountant | — | Birkett Stewart McHendrie (founding director); Independent NED Hulisani | — | — |
| 123 | **Zeenat Bismilla** | Bismilla / Zeenat | NEEDS_VERIFICATION | Chartered Accountant | — | Pele Energy Group | Location to verify | — |
| 124 | **Zeenat Bismilla** | Bismilla / Zeenat | CONFIRMED | CA(SA) | SAICA | Pele Energy Group | Western Cape | — |
| 125 | **Niel Bisschoff** | Bisschoff / Niel | CONFIRMED | CA(SA) | SAICA | Raubex Group | Gauteng/City of Johannesburg | https://www.linkedin.com/in/niel-bisschoff-ca-sa-b3a1a253/ |
| 126 | **Brent Blankfield** | Blankfield / Brent | CONFIRMED | CA(SA) | SAICA | Westbrooke Alternative Asset Management | South Africa | — |
| 127 | **Yehoshua Blieden** | Blieden / Yehoshua | CONFIRMED | CA(SA) | SAICA | Unico Property Group | Location unconfirmed | — |
| 128 | **Yehoshua Blieden** | Blieden / Yehoshua | CONFIRMED | CA(SA) | SAICA | Unico Property Group | Western Cape | — |
| 129 | **Franciscus Blignault** | Blignault / Franciscus | CONFIRMED | AGA(SA) | SAICA | Cape Five Export SA | Western Cape/Stellenbosch | https://za.linkedin.com/in/franciscus-blignault |
| 130 | **Sias Blignaut** | Blignaut / Sias | FINANCE_ROLE_CONFIRMED | — | — | Apollo Brick (Atlantis) | Gauteng/Johannesburg | https://www.linkedin.com/in/sias-blignaut-a231b024/ |
| 131 | **CLAVER BONDA** | BONDA / CLAVER | RESEARCH_HOLD | — | — | — | Western Cape/Western Cape candidate pool | https://za.linkedin.com/in/claver-bonda-72421535 |
| 132 | **Maria Bookkeeper** | Bookkeeper / Maria | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/City of Cape Town | https://www.linkedin.com/in/maria-bookkeeper-863b79115/ |
| 133 | **Greg Booyens** | Booyens / Greg | CONFIRMED | CA(SA) | SAICA | Emira Property Fund | — | — |
| 134 | **Pieter Booyens** | Booyens / Pieter | CONFIRMED | PA(SA) | SAIPA | Wilson Partners | Western Cape/Stellenbosch | https://za.linkedin.com/in/pabooyens |
| 135 | **Annelize Boshoff** | Boshoff / Annelize | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/City of Johannesburg | https://www.linkedin.com/in/annelize-boshoff-8b12b089/ |
| 136 | **Garron Boshoff** | Boshoff / Garron | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Western Cape/City of Cape Town | https://www.linkedin.com/in/garron-boshoff-b1726a20/ |
| 137 | **Johan Boshoff** | Boshoff / Johan | FINANCE_ROLE_CONFIRMED | — | — | Meshco | Western Cape/City of Cape Town | https://www.linkedin.com/in/johan-boshoff-929ba3117/ |
| 138 | **Kobus Boshoff** | Boshoff / Kobus | CONFIRMED | CA(SA) | SAICA | Boshoff Knoetze Chartered Accountants | Western Cape/Somerset West | https://www.linkedin.com/in/kobus-boshoff-0a510888/ |
| 139 | **Sunette Botes** | Botes / Sunette | FINANCE_ROLE_CONFIRMED | — | — | Kaap Agri / Agrimark | South Africa | https://www.linkedin.com/in/sunette-botes-6405a399/ |
| 140 | **Christo Botha** | Botha / Christo | CONFIRMED | PA(SA) | SAIPA | — | Western Cape/Western Cape candidate pool | https://za.linkedin.com/in/christo-botha-5877666a |
| 141 | **Conrad Botha** | Botha / Conrad | CONFIRMED | CA(SA) | SAICA | Signal Hill Products | Western Cape location NOT confirmed — X-ray query association only | — |
| 142 | **Conrad Botha** | Botha / Conrad | CONFIRMED | CA(SA) | SAICA | Signal Hill Products | Western Cape/Western Cape | — |
| 143 | **Heleen Botha** | Botha / Heleen | FINANCE_ROLE_CONFIRMED | — | — | Fair Cape Dairies | Western Cape/City of Cape Town | https://www.linkedin.com/in/heleen-botha-93942711/ |
| 144 | **Jaco Botha** | Botha / Jaco | CONFIRMED | ACMA, CGMA | CIMA | Ares Holdings | Western Cape/Cape Town | https://za.linkedin.com/in/jaco-botha-cgma |
| 145 | **Maricia Botha** | Botha / Maricia | CONFIRMED | AGA(SA) | SAICA | A van der Lingen Group | Western Cape/Cape Town | https://za.linkedin.com/in/maricia-botha-aga-sa-4209a415 |
| 146 | **Philip Botha** | Botha / Philip | FINANCE_ROLE_CONFIRMED | — | — | RFG Foods | Western Cape/Stellenbosch | https://www.linkedin.com/in/philip-botha/ |
| 147 | **Pieter Botha** | Botha / Pieter | CONFIRMED | CA(SA) | SAICA | AfriSam | — | https://www.linkedin.com/in/pieter-botha-43351637/ |
| 148 | **Ronel Botha** | Botha / Ronel | FINANCE_ROLE_CONFIRMED | — | — | Fruitways | Western Cape/City of Cape Town | https://www.linkedin.com/in/ronel-botha-6507a865/ |
| 149 | **Stefan Botha** | Botha / Stefan | CONFIRMED | CA(SA) | SAICA | Employer verify | Western Cape location NOT confirmed — X-ray query association only | — |
| 150 | **Stefan Botha** | Botha / Stefan | CONFIRMED | CA(SA) | SAICA | Employer verify | Western Cape/Western Cape | — |
| 151 | **Sunel Botha** | Botha / Sunel | CONFIRMED | CA(SA) | SAICA | Standard Bank Corporate & Investment Banking | Western Cape/Cape Town | — |
| 152 | **Sunel Botha** | Botha / Sunel | CONFIRMED | CA(SA) | SAICA | Standard Bank Corporate & Investment Banking | Western Cape/Cape Town | — |
| 153 | **Wardah Botha** | Botha / Wardah | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/wardah-botha-aga-sa-116b4361/ |
| 154 | **Anje Bothma** | Bothma / Anje | CONFIRMED | PA(SA) | SAIPA | Eezibooks Consulting | Western Cape/Cape Town | https://za.linkedin.com/in/anje-bothma-professional-accountant-sa-53b693168 |
| 155 | **Marais Bothma** | Bothma / Marais | CONFIRMED | CA(SA) | SAICA | GVJ Electrical & Instrumentation | Western Cape location NOT confirmed — X-ray query association only | — |
| 156 | **Marais Bothma** | Bothma / Marais | CONFIRMED | CA(SA) | SAICA | GVJ Electrical & Instrumentation | Western Cape/Western Cape | — |
| 157 | **Sandi Bothma** | Bothma / Sandi | FINANCE_ROLE_CONFIRMED | — | — | Concor | Gauteng/City of Johannesburg | https://www.linkedin.com/in/sandi-bothma-b0507517a/ |
| 158 | **Chantelle Boucher** | Boucher / Chantelle | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/Johannesburg | https://www.linkedin.com/in/chantelle-boucher-0148a7128/ |
| 159 | **Grant Bowler** | Bowler / Grant | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Western Cape/City of Cape Town | https://www.linkedin.com/in/grant-bowler-9059b598/ |
| 160 | **Nikita Braaf** | Braaf / Nikita | FINANCE_ROLE_CONFIRMED | — | — | I&J | Western Cape/City of Cape Town | https://www.linkedin.com/in/nikita-braaf-613b3763/ |
| 161 | **Oliver Braithwaite** | Braithwaite / Oliver | NEEDS_VERIFICATION | Chartered Accountant | — | The SOLA Group | Western Cape/Cape Town | — |
| 162 | **Giacomo Brambilla** | Brambilla / Giacomo | NEEDS_VERIFICATION | Chartered Accountant | — | Red Rocket South Africa | Western Cape/Cape Town | — |
| 163 | **Caron Bramwell** | Bramwell / Caron | CONFIRMED | CA(SA) | SAICA | Alchemy Properties | Western Cape location NOT confirmed — X-ray query association only | — |
| 164 | **Caron Bramwell** | Bramwell / Caron | CONFIRMED | CA(SA) | SAICA | Alchemy Properties | Western Cape/Western Cape | — |
| 165 | **Faraaz Bray** | Bray / Faraaz | CONFIRMED | CA(SA) | SAICA | Pepkor Speciality | — | — |
| 166 | **Catherine Brennan** | Brennan / Catherine | CONFIRMED | PA(SA) | SAIPA | G7 Renewable Energies | Western Cape/Cape Town | https://za.linkedin.com/in/catherine-brennan-b2b6156a |
| 167 | **Catherine Brennan** | Brennan / Catherine | NEEDS_VERIFICATION | Chartered Accountant | — | G7 Renewable Energies | Western Cape/Cape Town | — |
| 168 | **Ashraf Ali Brey** | Brey / Ashraf Ali | CONFIRMED | CA(SA) | SAICA | Bemcorp | Western Cape/Cape Town | — |
| 169 | **Muhammad Brey** | Brey / Muhammad | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/mobrey/ |
| 170 | **Madhuri Brijlal** | Brijlal / Madhuri | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Gauteng/City of Johannesburg | https://www.linkedin.com/in/madhuri-brijlal-38634943/ |
| 171 | **Dawid Brink** | Brink / Dawid | CONFIRMED | CA(SA) | SAICA | Dorpstraat Properties | Western Cape location NOT confirmed — X-ray query association only | — |
| 172 | **Dawid Brink** | Brink / Dawid | CONFIRMED | CA(SA) | SAICA | Dorpstraat Properties | Western Cape/Western Cape | — |
| 173 | **Jaco Brink** | Brink / Jaco | CONFIRMED | CA(SA) | SAICA | ReefRock Asset Management | Bellville area / Western Cape | — |
| 174 | **Jaco Brink** | Brink / Jaco | CONFIRMED | CA(SA) | SAICA | ReefRock Asset Management | Western Cape/Bellville | — |
| 175 | **Jennifer Brisley** | Brisley / Jennifer | FINANCE_ROLE_CONFIRMED | — | — | Concor | Gauteng/Gauteng | https://www.linkedin.com/in/jennifer-brisley-51a65721/ |
| 176 | **Michelle Brook** | Brook / Michelle | FINANCE_ROLE_CONFIRMED | — | — | Fabrinox | Western Cape/Paarl | https://www.linkedin.com/in/michelle-brook-2725b986/ |
| 177 | **Lesley Brown** | Brown / Lesley | CONFIRMED | AGA(SA) | SAICA | Pangolin Photo Safaris | Western Cape | https://za.linkedin.com/in/lesley-brown-1a93aa68 |
| 178 | **Luigi Brown** | Brown / Luigi | CONFIRMED | CA(SA) | SAICA | Rabie Property Group (as at Aug 2018; current Unconfirmed) | — | — |
| 179 | **Justyna Bruwer** | Bruwer / Justyna | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/Gauteng | https://www.linkedin.com/in/justyna-bruwer-42a092b3/ |
| 180 | **Ralph Buddle** | Buddle / Ralph | CONFIRMED | CA(SA) | SAICA | TFG Limited (The Foschini Group) | Western Cape/Cape Town | — |
| 181 | **Thomas Bufton** | Bufton / Thomas | FINANCE_ROLE_CONFIRMED | — | — | Ardagh Glass Packaging SA | Gauteng/City of Johannesburg | https://www.linkedin.com/in/thomas-bufton-351030116/ |
| 182 | **Lizanne Buitendag** | Buitendag / Lizanne | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Gauteng/Gauteng | https://www.linkedin.com/in/lizanne-buitendag-a60564213/ |
| 183 | **Catharine Burger** | Burger / Catharine | CONFIRMED | CA(SA) | SAICA | Afrimat | Western Cape/City of Cape Town | https://www.linkedin.com/in/catharine-burger-4a597a81/ |
| 184 | **Catharine Burger** | Burger / Catharine | NEEDS_VERIFICATION | Chartered Accountant | — | Afrimat | Western Cape/Cape Town | — |
| 185 | **Hein Burger** | Burger / Hein | CONFIRMED | AGA(SA) | SAICA | Public sector / Western Cape context | Western Cape/Cape Town | https://za.linkedin.com/in/hein-burger-aga-sa-b56163135 |
| 186 | **Nicolene Burger** | Burger / Nicolene | FINANCE_ROLE_CONFIRMED | — | — | WastePlan | Gauteng/Johannesburg | https://www.linkedin.com/in/nicolene-burger-83381827/ |
| 187 | **Yolandi Burger** | Burger / Yolandi | FINANCE_ROLE_CONFIRMED | — | — | Southern Oil (SOILL) | South Africa | https://www.linkedin.com/in/yolandi-burger-384a0865/ |
| 188 | **Gareth Burmeister** | Burmeister / Gareth | CONFIRMED | CA(SA) | SAICA | Teraco - A Digital Realty Company | Cape Town – confirm | — |
| 189 | **Gareth Burmeister** | Burmeister / Gareth | CONFIRMED | CA(SA) | SAICA | Teraco - A Digital Realty Company | Western Cape/Cape Town | — |
| 190 | **Khanya Butshingi** | Butshingi / Khanya | RESEARCH_HOLD | — | — | Collinson Group | Western Cape | https://za.linkedin.com/in/khanya-butshingi-2284b922a |
| 191 | **Werner Buys** | Buys / Werner | FINANCE_ROLE_CONFIRMED | — | — | Concor | Gauteng/Bedfordview | https://www.linkedin.com/in/wernerbuys101/ |
| 192 | **Andre C.** | C. / Andre | FINANCE_ROLE_CONFIRMED | — | — | Fabrinox | Western Cape/City of Cape Town | https://www.linkedin.com/in/andre-c-ba703193/ |
| 193 | **Melissa Mc Cabe** | Cabe / Melissa Mc | NEEDS_VERIFICATION | Chartered Accountant | — | Amdec Group | Western Cape/Cape Town | — |
| 194 | **Ampie Calitz** | Calitz / Ampie | FINANCE_ROLE_CONFIRMED | — | — | RFG Foods | Western Cape/City of Cape Town | https://www.linkedin.com/in/ampie-calitz-ca-sa-b51a084b/ |
| 195 | **Kevin Cammay** | Cammay / Kevin | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Western Cape/City of Cape Town | https://www.linkedin.com/in/kevin-cammay-38011325/ |
| 196 | **Alastair Campbell** | Campbell / Alastair | CONFIRMED | CA(SA) | SAICA | Vantage Capital (Vantage GreenX) | Gauteng/Johannesburg | — |
| 197 | **Nikita Candy Engelbrecht** | Candy Engelbrecht / Nikita | FINANCE_ROLE_CONFIRMED | — | — | Cape Herb & Spice | Western Cape/Cape Town | https://www.linkedin.com/in/nikita-candy-engelbrecht-2a2300235/ |
| 198 | **Bruce Canham ACMA, CGMA** | Canham ACMA, CGMA / Bruce | CONFIRMED | ACMA, CGMA | CIMA | — | Western Cape/Western Cape candidate pool | https://za.linkedin.com/in/bruce-canham-acma-cgma-0a218a220 |
| 199 | **Fazila Cariem** | Cariem / Fazila | CONFIRMED | CA(SA) | SAICA | Scatec ASA | Western Cape/Cape Town | — |
| 200 | **Fazila Cariem** | Cariem / Fazila | CONFIRMED | CA(SA) | SAICA | Scatec ASA | Western Cape/Cape Town | — |
| 201 | **Samantha Carr** | Carr / Samantha | RESEARCH_HOLD | — | — | University of the Western Cape | Western Cape | https://za.linkedin.com/in/samantha-carr-2644466a |
| 202 | **Andrea Carstens** | Carstens / Andrea | NEEDS_VERIFICATION | Chartered Accountant | — | SA Corporate Real Estate Fund (former) | Current region unconfirmed | — |
| 203 | **Andrea Carstens** | Carstens / Andrea | CONFIRMED | CA(SA) | SAICA | SA Corporate Real Estate Fund (former) | Western Cape | — |
| 204 | **Lise Carstens** | Carstens / Lise | CONFIRMED | CA(SA) | SAICA | Val de Vie Wine & Polo Estate | Western Cape/Cape Town | — |
| 205 | **Lise Carstens** | Carstens / Lise | CONFIRMED | CA(SA) | SAICA | Val de Vie Wine & Polo Estate | Western Cape/Cape Town | — |
| 206 | **Michelle Carstens** | Carstens / Michelle | FINANCE_ROLE_CONFIRMED | — | — | Spier | Western Cape/Cape Town | https://www.linkedin.com/in/michelle-carstens-ca-sa-71b62475/ |
| 207 | **Kerry Cassel** | Cassel / Kerry | CONFIRMED | CA(SA) | SAICA | Motus Mobility Solutions | — | — |
| 208 | **Jacques Casteling** | Casteling / Jacques | NEEDS_VERIFICATION | Chartered Accountant | — | Amdec Group | Western Cape/Cape Town | — |
| 209 | **Melani De Castro** | Castro / Melani De | CONFIRMED | CA(SA) | SAICA | Crookes Brothers | — | — |
| 210 | **Sandile Cele** | Cele / Sandile | CONFIRMED | CA(SA) | SAICA | Public Investment Corporation (PIC); NED Divercity Urban Property Group | — | — |
| 211 | **Jacqui Celliers** | Celliers / Jacqui | CONFIRMED | CA(SA) | SAICA | Nampak | Gauteng/Johannesburg | https://www.linkedin.com/in/jacqui-celliers-241a47209/ |
| 212 | **Barry Chapman** | Chapman / Barry | CONFIRMED | CA(SA) | SAICA | TUHF Limited | — | — |
| 213 | **Kamohelo Chauke** | Chauke / Kamohelo | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/Cape Town | https://www.linkedin.com/in/kamohelo-chauke-ca-sa-10bb0b221/ |
| 214 | **Simon Chemaly** | Chemaly / Simon | CONFIRMED | CA(SA) | SAICA | Property Partners / Absa (role to verify) | Western Cape/Cape Town | — |
| 215 | **Simon Chemaly** | Chemaly / Simon | CONFIRMED | CA(SA) | SAICA | Property Partners / Absa (role to verify) | Western Cape/Cape Town | — |
| 216 | **Lee-in Chen** | Chen / Lee-in | CONFIRMED | CA(SA) | SAICA | China Construction | Western Cape location NOT confirmed — X-ray query association only | — |
| 217 | **Lee-in Chen** | Chen / Lee-in | CONFIRMED | CA(SA) | SAICA | China Construction | Western Cape/Western Cape | — |
| 218 | **Dhiren Chetty** | Chetty / Dhiren | CONFIRMED | CA(SA) | SAICA | Zutari | — | — |
| 219 | **Ronnie Chetty** | Chetty / Ronnie | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/ronnie-chetty-42400656/ |
| 220 | **Walter Chigwada** | Chigwada / Walter | FINANCE_ROLE_CONFIRMED | — | — | Safintra South Africa | Gauteng/Boksburg | https://www.linkedin.com/in/walter-chigwada-8b4b7520/ |
| 221 | **Taku Chimedza** | Chimedza / Taku | FINANCE_ROLE_CONFIRMED | — | — | Averda South Africa | Johannesburg Metropolitan Area | https://www.linkedin.com/in/taku-chimedza-ca-sa-578b6a153/ |
| 222 | **Bianca Christian** | Christian / Bianca | CONFIRMED | CA(SA) | SAICA | WBHO Construction - Cape Division | Gauteng/Gauteng | https://www.linkedin.com/in/bianca-christian-1690a9b0/ |
| 223 | **Kruger Christie** | Christie / Kruger | FINANCE_ROLE_CONFIRMED | — | — | Spier | Western Cape/Cape Town | https://www.linkedin.com/in/kruger-christie-08b5a75a/ |
| 224 | **Tanya Churchill** | Churchill / Tanya | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/tanya-churchill-03589714a/ |
| 225 | **Iliscke Cilliers** | Cilliers / Iliscke | FINANCE_ROLE_CONFIRMED | — | — | Boland Cellar | Western Cape/Paarl | — |
| 226 | **Sharlene Cilliers** | Cilliers / Sharlene | NEEDS_VERIFICATION | Chartered Accountant | — | Sanlam Investments | Location to verify | — |
| 227 | **Sharlene Cilliers** | Cilliers / Sharlene | CONFIRMED | CA(SA) | SAICA | Sanlam Investments | Western Cape | — |
| 228 | **Johan Claassen** | Claassen / Johan | CONFIRMED | CA(SA) | SAICA | Austen Dundas Property Group (former) | Western Cape/Cape Town | — |
| 229 | **Johan Claassen** | Claassen / Johan | CONFIRMED | CA(SA) | SAICA | Austen Dundas Property Group (former) | Western Cape/Cape Town | — |
| 230 | **Anthony Clacher** | Clacher / Anthony | CONFIRMED | CA(SA) | SAICA | Group Five (per cfo.co.za profile; Group Five later entered business rescue) | — | — |
| 231 | **Altus Cloete** | Cloete / Altus | CONFIRMED | CA(SA) | SAICA | ENGIE Africa | Western Cape location NOT confirmed — X-ray query association only | — |
| 232 | **Altus Cloete** | Cloete / Altus | CONFIRMED | CA(SA) | SAICA | ENGIE Africa | Western Cape/Western Cape | — |
| 233 | **Jason Cloete** | Cloete / Jason | RESEARCH_HOLD | PA(SA), CIA | SAIPA | Western Cape Government | Western Cape/Cape Town | — |
| 234 | **Malcolm Cecil Coates** | Coates / Malcolm | HIGH_CONFIDENCE | PA(SA) | SAIPA | Alma Casa | Western Cape/Muizenberg (Cape Town) | — |
| 235 | **Carlynn-Jade Coetzee** | Coetzee / Carlynn-Jade | CONFIRMED | PA(SA) | SAIPA | Ubuntu Quantum | Western Cape/Cape Town | https://za.linkedin.com/in/carlynn-jadecoetzee |
| 236 | **Denovan Coetzee** | Coetzee / Denovan | CONFIRMED | ACMA, CGMA | CIMA | Lactalis South Africa | Western Cape/Cape Town | https://za.linkedin.com/in/denovan-coetzee-acma-cgma-652581197 |
| 237 | **H.L. Coetzee** | Coetzee / H.L. | CONFIRMED | CA(SA) | SAICA | ooba | Western Cape location NOT confirmed — X-ray query association only | — |
| 238 | **H.L. Coetzee** | Coetzee / H.L. | CONFIRMED | CA(SA) | SAICA | ooba | Western Cape/Western Cape | — |
| 239 | **Heinrich Coetzee** | Coetzee / Heinrich | CONFIRMED | CA(SA) | SAICA | Property House | Western Cape location NOT confirmed — X-ray query association only | — |
| 240 | **Heinrich Coetzee** | Coetzee / Heinrich | CONFIRMED | CA(SA) | SAICA | Property House | Western Cape/Western Cape | — |
| 241 | **Johan Coetzee** | Coetzee / Johan | HIGH_CONFIDENCE | CA(SA) | SAICA | Callidus Accountants | Western Cape/Somerset West | — |
| 242 | **Sumari Coetzee** | Coetzee / Sumari | NEEDS_VERIFICATION | Chartered Accountant | — | Sanlam Retail Affluent | — | — |
| 243 | **Tammy Coetzee** | Coetzee / Tammy | RESEARCH_HOLD | — | — | Aqunion | Western Cape | https://za.linkedin.com/in/tammy-coetzee-a992952b |
| 244 | **Werner Coetzee** | Coetzee / Werner | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/City of Johannesburg | https://www.linkedin.com/in/werner-coetzee-428687138/ |
| 245 | **Alrich Coetzee ACMA, CGMA** | Coetzee ACMA, CGMA / Alrich | CONFIRMED | ACMA, CGMA | CIMA | — | Western Cape | https://za.linkedin.com/in/alrich-coetzee |
| 246 | **Alisha Coetzer** | Coetzer / Alisha | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/alisha-coetzer-059b1a63/ |
| 247 | **Marno Coetzer** | Coetzer / Marno | CONFIRMED | CA(SA) | SAICA | Lead Group of Companies | Western Cape location NOT confirmed — X-ray query association only | — |
| 248 | **Marno Coetzer** | Coetzer / Marno | CONFIRMED | CA(SA) | SAICA | Lead Group of Companies | Western Cape/Western Cape | — |
| 249 | **Neil Coetzer** | Coetzer / Neil | RESEARCH_HOLD | — | — | SPH Kundalila | North West/Rustenburg | https://www.linkedin.com/in/neil-coetzer-0b533228a/ |
| 250 | **Pieter-Christiaan Coetzer** | Coetzer / Pieter-Christiaan | FINANCE_ROLE_CONFIRMED | — | — | Southern Oil (SOILL) | Potchefstroom | https://www.linkedin.com/in/pieter-christiaan-coetzer-224587244/ |
| 251 | **Dean Cohen** | Cohen / Dean | CONFIRMED | CA(SA) | SAICA | Unconfirmed | City of Cape Town, Western Cape | — |
| 252 | **Themba Collen** | Collen / Themba | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Gauteng/Benoni | https://www.linkedin.com/in/themba-collen-410500248/ |
| 253 | **Marc Conradie** | Conradie / Marc | CONFIRMED | CA(SA) | SAICA | City Capital SA Property Holdings | Tyger Valley, Bellville, Cape Town | — |
| 254 | **Jacky Cooper** | Cooper / Jacky | CONFIRMED | CA(SA) | SAICA | Climate Fund Managers | Western Cape/Cape Town | — |
| 255 | **Jacky Cooper** | Cooper / Jacky | CONFIRMED | CA(SA) | SAICA | Climate Fund Managers | Western Cape/Cape Town | — |
| 256 | **Angus Cornelius** | Cornelius / Angus | FINANCE_ROLE_CONFIRMED | — | — | Peninsula Beverages | Western Cape/City of Cape Town | https://www.linkedin.com/in/angus-cornelius-ca-sa-4603361a/ |
| 257 | **Tracey Cosgrove** | Cosgrove / Tracey | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/City of Cape Town | https://www.linkedin.com/in/tracey-cosgrove-79454024/ |
| 258 | **Calvin Craig** | Craig / Calvin | NEEDS_VERIFICATION | Chartered Accountant | — | Current employer unconfirmed | Cape Town – check | — |
| 259 | **Calvin Craig** | Craig / Calvin | CONFIRMED | CA(SA) | SAICA | Current employer unconfirmed | Western Cape/Cape Town | — |
| 260 | **Marylee Creighton** | Creighton / Marylee | CONFIRMED | CA(SA) | SAICA | The SOLA Group | Western Cape/Cape Town | — |
| 261 | **Marylee Creighton** | Creighton / Marylee | CONFIRMED | CA(SA) | SAICA | The SOLA Group | Western Cape/Cape Town | — |
| 262 | **Grant Crighton** | Crighton / Grant | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/grant-crighton-60348598 |
| 263 | **Jacques Cronje** | Cronje / Jacques | NEEDS_VERIFICATION | Chartered Accountant | — | Red Rocket South Africa | Western Cape/Cape Town | — |
| 264 | **Melese Cronje** | Cronje / Melese | FINANCE_ROLE_CONFIRMED | — | — | Much Asphalt | South Africa | https://www.linkedin.com/in/melese-cronje-a8437a94/ |
| 265 | **Jeanette Croukamp** | Croukamp / Jeanette | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/jeanette-croukamp-237469a6/ |
| 266 | **Lameez Cupido** | Cupido / Lameez | FINANCE_ROLE_CONFIRMED | — | — | Capespan South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/lameez-cupido-b39a0141/ |
| 267 | **Minnie D.** | D. / Minnie | FINANCE_ROLE_CONFIRMED | — | — | Métier Mixed Concrete | KwaZulu-Natal/Durban | https://www.linkedin.com/in/minnie-de-wit-0a85425b/ |
| 268 | **Louwrens da Silva** | da Silva / Louwrens | HIGH_CONFIDENCE | PA(SA) | SAIPA | Petrichor Consulting | Western Cape/Somerset West | — |
| 269 | **Maritza Dalton** | Dalton / Maritza | CONFIRMED | PA(SA) | SAIPA | Cecil Kilpin & Co. | Western Cape | https://za.linkedin.com/in/maritza-dalton-professional-accountant-sa-91128611a |
| 270 | **Ahmed Dalvie** | Dalvie / Ahmed | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/Cape Town | https://www.linkedin.com/in/ahmeddalvie/ |
| 271 | **Saadiqa Dangor** | Dangor / Saadiqa | RESEARCH_HOLD | — | — | Atlantis Special Economic Zone | Western Cape | https://www.linkedin.com/in/saadiqa-dangor/ |
| 272 | **Adre Daniel** | Daniel / Adre | HIGH_CONFIDENCE | PA(SA) | SAIPA | Accu-fin Accounting | Western Cape/Milnerton (Cape Town) | — |
| 273 | **Ebrahim Daniels** | Daniels / Ebrahim | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/Cape Town | https://www.linkedin.com/in/ebrahim-daniels/ |
| 274 | **Karen Dannhauser (Prinsloo)** | Dannhauser (Prinsloo) / Karen | RESEARCH_HOLD | — | — | — | Western Cape/Western Cape candidate pool | https://za.linkedin.com/in/karen-dannhauser-prinsloo-a96740aa |
| 275 | **Kyle Danster** | Danster / Kyle | CONFIRMED | ACMA, CGMA | CIMA | Curro Holdings Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/kyle-danster/ |
| 276 | **Riaan Davel** | Davel / Riaan | CONFIRMED | CA(SA) | SAICA | DRDGOLD Limited | — | — |
| 277 | **Belinda David** | David / Belinda | FINANCE_ROLE_CONFIRMED | — | — | I&J | Western Cape/City of Cape Town | https://www.linkedin.com/in/belinda-david-a7965651/ |
| 278 | **Ameena Davids** | Davids / Ameena | CONFIRMED | PA(SA) | SAIPA | The SOLA Group | Western Cape/Cape Town | https://za.linkedin.com/in/ameena-davids-professional-accountant-sa-78735763 |
| 279 | **Andre Davids** | Davids / Andre | RESEARCH_HOLD | AGA(SA) | SAICA | Exceed Group | Western Cape/Cape Town | — |
| 280 | **Jaques Davids** | Davids / Jaques | CONFIRMED | ACMA, CGMA | CIMA | Stellenbosch University | Western Cape/Stellenbosch | https://za.linkedin.com/in/jaques-davids-acma-cgma-a4179b129 |
| 281 | **Zaakirah Davids** | Davids / Zaakirah | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/zaakirah-davids-ca-sa-b42445267/ |
| 282 | **Graham Davin** | Davin / Graham | CONFIRMED | CA(SA) | SAICA | TFG Limited (The Foschini Group) | — | — |
| 283 | **Mike Davis** | Davis / Mike | CONFIRMED | CA(SA) | SAICA | Nedbank Group | — | — |
| 284 | **Ferose dawood** | dawood / Ferose | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/City of Cape Town | https://www.linkedin.com/in/dawood-ferose-9829347a/ |
| 285 | **Arthi Daya** | Daya / Arthi | HIGH_CONFIDENCE | CA(SA) | SAICA | BBF Safety Group | — | — |
| 286 | **Cormé de Bruyn** | de Bruyn / Cormé | CONFIRMED | ACMA, CGMA | CIMA | Trueprop | Western Cape/Cape Town | https://za.linkedin.com/in/corm%C3%A9-de-bruyn-acma-cgma-6b98a015b |
| 287 | **Angelina de Gouveia** | de Gouveia / Angelina | FINANCE_ROLE_CONFIRMED | — | — | Concor | Gauteng/City of Johannesburg | https://www.linkedin.com/in/angelina-de-gouveia-4639681ba/ |
| 288 | **Yolandi de Jonge** | de Jonge / Yolandi | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/City of Johannesburg | https://www.linkedin.com/in/yolandi-de-jonge-40917b74/ |
| 289 | **Deon de Jongh** | de Jongh / Deon | CONFIRMED | AGA(SA) | SAICA | Luno | Western Cape/Cape Town | https://za.linkedin.com/in/deondejongh |
| 290 | **Lizelle De Klerk** | De Klerk / Lizelle | FINANCE_ROLE_CONFIRMED | — | — | EnviroServ | Gauteng/Johannesburg | https://www.linkedin.com/in/lizelle-de-klerk-82b35574/ |
| 291 | **Nicolene De Klerk** | De Klerk / Nicolene | FINANCE_ROLE_CONFIRMED | — | — | DSV | Pretoria Metropolitan Area | https://www.linkedin.com/in/nicolene-de-klerk-223181246/ |
| 292 | **Marinelle de Klerk Kilian** | de Klerk Kilian / Marinelle | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group | Western Cape/Saldanha | https://www.linkedin.com/in/marinelle-de-klerk-kilian-57792929/ |
| 293 | **Callum de la Hunt** | de la Hunt / Callum | FINANCE_ROLE_CONFIRMED | — | — | Klay | Western Cape/Cape Town | https://www.linkedin.com/in/callum-de-la-hunt-01a590203/ |
| 294 | **Zené de Laan** | de Laan / Zené | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Western Cape/Stellenbosch | https://www.linkedin.com/in/zené-de-laan-ca-sa-a25aa485/ |
| 295 | **Adriaan de Lange** | de Lange / Adriaan | CONFIRMED | CA(SA) | SAICA | Adriaan de Lange Advisory (Private Capacity) | Western Cape/Cape Town | https://www.linkedin.com/in/a3aandl/ |
| 296 | **John De Sousa** | De Sousa / John | CONFIRMED | PA(SA) | SAIPA | GVK-Siya Zama | Western Cape/City of Cape Town | https://za.linkedin.com/in/john-de-sousa-98a52247 |
| 297 | **Sandi De Souza** | De Souza / Sandi | CONFIRMED | CA(SA) | SAICA | SAP Africa | — | — |
| 298 | **Carla de Villiers** | de Villiers / Carla | CONFIRMED | CA(SA) | SAICA | Atterbury Property | Western Cape | — |
| 299 | **Emile de Villiers** | de Villiers / Emile | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 300 | **Franselle de Villiers** | de Villiers / Franselle | FINANCE_ROLE_CONFIRMED | — | — | Raubex / Roadmac Surfacing Cape | Free State/Bloemfontein | https://www.linkedin.com/in/franselle-de-villiers-413b4b82/ |
| 301 | **Aulene De Vries** | De Vries / Aulene | CONFIRMED | PA(SA) | SAIPA | Portland Group | Western Cape/Wellington | https://www.linkedin.com/in/aulene-de-vries-pa-sa-79050616a/ |
| 302 | **Cecilia de Wet** | de Wet / Cecilia | CONFIRMED | CA(SA) | SAICA | Growthpoint Properties | Western Cape/Cape Town | — |
| 303 | **Louis de Wet** | de Wet / Louis | CONFIRMED | CA(SA) | SAICA | TradeOn SA | Western Cape/Stellenbosch | https://www.linkedin.com/in/louisdewetza/ |
| 304 | **Marzanne de Wet** | de Wet / Marzanne | CONFIRMED | ACMA, CGMA | CIMA | Rainmaker Media | Western Cape/Cape Town | https://za.linkedin.com/in/marzanne-de-wet-acma-cgma-50b83531 |
| 305 | **Pieter De Wit** | De Wit / Pieter | CONFIRMED | CA(SA), ACIS | SAICA | Afrimat | Western Cape/City of Cape Town | https://www.linkedin.com/in/pieter-de-wit-4619b210/ |
| 306 | **Suzaan de Wit** | de Wit / Suzaan | CONFIRMED | CA(SA) | SAICA | LSP Group | Western Cape | — |
| 307 | **Christo de Witt** | de Witt / Christo | HIGH_CONFIDENCE | PA(SA) | SAIPA | Origin Financial Group of Companies | Western Cape/Cape Town | — |
| 308 | **Roelof Dednam** | Dednam / Roelof | NEEDS_VERIFICATION | Chartered Accountant | — | National Real Estate (as at 2019) | — | — |
| 309 | **Masibulele Dem** | Dem / Masibulele | NEEDS_VERIFICATION | Chartered Accountant | — | Hulisani Limited | Gauteng/Johannesburg | — |
| 310 | **Angus Dempers** | Dempers / Angus | CONFIRMED | CA(SA) | SAICA | Capital Land Asset Management | Cape Town, Western Cape | — |
| 311 | **Angus Dempers** | Dempers / Angus | CONFIRMED | CA(SA) | SAICA | Capital Land Asset Management | Western Cape/Cape Town | — |
| 312 | **Lindi Dempers** | Dempers / Lindi | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/Saldanha Bay Local Municipality | https://www.linkedin.com/in/lindi-dempers-9b872350/ |
| 313 | **Melanie Dennis-Jacobs** | Dennis-Jacobs / Melanie | CONFIRMED | AGA(SA) | SAICA | Red Carnation Hotel Collection | Western Cape/Cape Town | https://za.linkedin.com/in/melanie-dennis-jacobs-aga-sa-7034aa66 |
| 314 | **Manoj Desai** | Desai / Manoj | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/manoj-desai-61790754/ |
| 315 | **Mervin Dhanai** | Dhanai / Mervin | CONFIRMED | CA(SA) | SAICA | Zenprop Property Holdings | Location unconfirmed | — |
| 316 | **Mervin Dhanai** | Dhanai / Mervin | CONFIRMED | CA(SA) | SAICA | Zenprop Property Holdings | Western Cape | — |
| 317 | **Elisha Dhenanath** | Dhenanath / Elisha | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | Gauteng/City of Johannesburg | https://www.linkedin.com/in/elisha-dhenanath-11b85b5/ |
| 318 | **Fayaz Dhorat** | Dhorat / Fayaz | CONFIRMED | CA(SA) | SAICA | Boxwood Property Fund | Western Cape/Cape Town | — |
| 319 | **Fayaz Dhorat** | Dhorat / Fayaz | CONFIRMED | CA(SA) | SAICA | Boxwood Property Fund | Western Cape/Cape Town | — |
| 320 | **Peet Diedericks** | Diedericks / Peet | RESEARCH_HOLD | — | — | — | Western Cape | — |
| 321 | **Zama-o-kuhle Dingaan** | Dingaan / Zama-o-kuhle | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Gauteng/Gauteng | https://www.linkedin.com/in/zama-o-kuhle-dingaan-acma-cgma-a11080134/ |
| 322 | **André Dippenaar** | Dippenaar / André | CONFIRMED | CA(SA) | SAICA | African Rainbow Energy | Western Cape location NOT confirmed — X-ray query association only | — |
| 323 | **André Dippenaar** | Dippenaar / André | CONFIRMED | CA(SA) | SAICA | African Rainbow Energy | Western Cape/Western Cape | — |
| 324 | **Johann Dippenaar** | Dippenaar / Johann | CONFIRMED | CA(SA) | SAICA | Project-based employer unconfirmed | Western Cape/Cape Town | — |
| 325 | **Johann Dippenaar** | Dippenaar / Johann | CONFIRMED | CA(SA) | SAICA | Project-based employer unconfirmed | Western Cape/Cape Town | — |
| 326 | **Lene Dippenaar** | Dippenaar / Lene | CONFIRMED | CA(SA) | SAICA | Rabie Property Developers | Western Cape/Cape Town | — |
| 327 | **Lene Dippenaar** | Dippenaar / Lene | CONFIRMED | CA(SA) | SAICA | Rabie Property Developers | Western Cape/Cape Town | — |
| 328 | **Monique Dippenaar** | Dippenaar / Monique | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/monique-dippenaar-54b61114b/ |
| 329 | **Lézanne Dirkse van Schalkwyk** | Dirkse van Schalkwyk / Lézanne | CONFIRMED | AGA(SA) | SAICA | McA Inc. | Western Cape/Durbanville | — |
| 330 | **Wallace Disi** | Disi / Wallace | CONFIRMED | PA(SA) | SAIPA | — | Western Cape | https://za.linkedin.com/in/wallace-disi-74a3921a |
| 331 | **Jonathan Dixon** | Dixon / Jonathan | CONFIRMED | CA(SA) | SAICA | Copper 360 | Western Cape/Cape Town | — |
| 332 | **Jonathan Dixon** | Dixon / Jonathan | CONFIRMED | CA(SA) | SAICA | Copper 360 | Western Cape/Cape Town | — |
| 333 | **Nkosana Dlamini** | Dlamini / Nkosana | CONFIRMED | ACMA, CGMA | CIMA | Absa Group | Gauteng/Johannesburg | — |
| 334 | **Sakhile Dlamini** | Dlamini / Sakhile | CONFIRMED | CA(SA) | SAICA | Dev34 | Western Cape/Cape Town | — |
| 335 | **Sakhile Dlamini** | Dlamini / Sakhile | CONFIRMED | CA(SA) | SAICA | Dev34 | Western Cape/Cape Town | — |
| 336 | **Lizaan Draper** | Draper / Lizaan | FINANCE_ROLE_CONFIRMED | — | — | Sentraal-Suid Co-operative (SSK) | Western Cape/Western Cape | https://www.linkedin.com/in/lizaan-draper-ca-sa-286955193/ |
| 337 | **John Drury** | Drury / John | CONFIRMED | CA(SA) | SAICA | Alco Exotic Green Building Products | Western Cape/Cape Town | — |
| 338 | **John Drury** | Drury / John | CONFIRMED | CA(SA) | SAICA | Alco Exotic Green Building Products | Western Cape/Cape Town | — |
| 339 | **Corne Du Plooy** | Du Plooy / Corne | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/corne-du-plooy-4625b7136/ |
| 340 | **Ettienne du Preez** | du Preez / Ettienne | CONFIRMED | PA(SA) | SAIPA | — | Western Cape | https://za.linkedin.com/in/ettiennedupreez |
| 341 | **Pierre du Preez** | du Preez / Pierre | CONFIRMED | CA(SA) | SAICA | Current employer unconfirmed; former The Building Company | Western Cape/Cape Town | — |
| 342 | **Abrie du Toit** | du Toit / Abrie | CONFIRMED | CA(SA) | SAICA | Form-Scaff | Gauteng | — |
| 343 | **Firdows Du Toit** | Du Toit / Firdows | CONFIRMED | PA(SA) | SAIPA | MRI Software (recent/current profile employer) | Western Cape/Cape Town | https://za.linkedin.com/in/firdows-du-toit-472882150 |
| 344 | **Lizanne du Toit** | du Toit / Lizanne | CONFIRMED | CA(SA) | SAICA | Bester Feed & Grain | Western Cape/Western Cape | — |
| 345 | **Mitchell du Toit** | du Toit / Mitchell | CONFIRMED | CA(SA) | SAICA | RDC Property Group | Western Cape/Cape Town | — |
| 346 | **Chane Du Venage** | Du Venage / Chane | CONFIRMED | CA(SA) | SAICA | Unitrans | Western Cape/Cape Town | — |
| 347 | **Chané du Venage** | du Venage / Chané | CONFIRMED | CA(SA) | SAICA | Unitrans | Western Cape/Cape Town | — |
| 348 | **André Du Plessis** | Du Plessis / André | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 349 | **Ashley Du Plessis** | Du Plessis / Ashley | CONFIRMED | AGA(SA) | SAICA | — | Western Cape/Paarl | https://www.linkedin.com/in/ashley-du-plessis-ba99a716b/ |
| 350 | **Dréan du Plessis** | du Plessis / Dréan | CONFIRMED | CA(SA) | SAICA | WaterBorne Capital | Western Cape/Cape Town | — |
| 351 | **Flavian Du Plessis** | Du Plessis / Flavian | FINANCE_ROLE_CONFIRMED | — | — | Libstar | Western Cape/Cape Town | https://www.linkedin.com/in/flavian-du-plessis-4a5829247/ |
| 352 | **Francois Du Plessis** | Du Plessis / Francois | FINANCE_ROLE_CONFIRMED | — | — | EnviroServ | Western Cape/Cape Town | https://www.linkedin.com/in/francois-du-plessis-75798597/ |
| 353 | **Ilke du Plessis** | du Plessis / Ilke | FINANCE_ROLE_CONFIRMED | — | — | Kropz Elandsfontein | Western Cape/City of Cape Town | https://www.linkedin.com/in/ilke-du-plessis-5478a7207/ |
| 354 | **Lian du Plessis** | du Plessis / Lian | CONFIRMED | AGA(SA) | SAICA | Cape Chamber of Commerce & Industry | Western Cape/Cape Town | https://www.linkedin.com/in/lian-du-plessis-aga-sa-177375149/ |
| 355 | **Harry Durrell** | Durrell / Harry | CONFIRMED | AGA(SA) | SAICA | Herold Gie Attorneys | Western Cape/Cape Town | https://za.linkedin.com/in/harrydurrell |
| 356 | **Marian Duvenage** | Duvenage / Marian | CONFIRMED | CA(SA) | SAICA | Grapetree Accounting | Western Cape/Cape Town | — |
| 357 | **Marian Duvenage** | Duvenage / Marian | CONFIRMED | CA(SA) | SAICA | Grapetree Accounting | Western Cape/Cape Town | — |
| 358 | **Valentine Dzvova** | Dzvova / Valentine | CONFIRMED | CA(SA), ACMA, CGMA | SAICA, CIMA | AYO Technology Solutions Limited | Western Cape/Cape Town | https://za.linkedin.com/in/valentine-dzvova |
| 359 | **Henry Eales** | Eales / Henry | CONFIRMED | CA(SA) | SAICA | PKF Cape Town (Bellville office) | Bellville, Cape Town | — |
| 360 | **Marc Edelberg** | Edelberg / Marc | CONFIRMED | CA(SA) | SAICA | Forvis Mazars (South Africa) | Western Cape/Cape Town | — |
| 361 | **Brent Edward Williams** | Edward Williams / Brent | RESEARCH_HOLD | PA(SA) | SAIPA | The Free Range Chicken Company | Western Cape/Cape Town | — |
| 362 | **Daiyaan Edwards** | Edwards / Daiyaan | CONFIRMED | CA(SA) | SAICA | Infra Impact Investment Managers | Western Cape/Cape Town | — |
| 363 | **Monique Ellis** | Ellis / Monique | FINANCE_ROLE_CONFIRMED | — | — | Namaqua Wines | Gauteng/Pretoria | https://www.linkedin.com/in/monique-ellis-8a58b9145/ |
| 364 | **Edrich Els** | Els / Edrich | CONFIRMED | CA(SA) | SAICA | Citra – Live Different | Western Cape location NOT confirmed — X-ray query association only | — |
| 365 | **Edrich Els** | Els / Edrich | CONFIRMED | CA(SA) | SAICA | Citra – Live Different | Western Cape/Western Cape | — |
| 366 | **Chantal Emmett** | Emmett / Chantal | CONFIRMED | CA(SA) | SAICA | West Property Fund | Western Cape/Cape Town | — |
| 367 | **Chantal Emmett** | Emmett / Chantal | CONFIRMED | CA(SA) | SAICA | West Property Fund | Western Cape/Cape Town | — |
| 368 | **David Emmett** | Emmett / David | CONFIRMED | CA(SA) | SAICA | RPP Developments (Pty) Ltd | Western Cape location NOT confirmed — X-ray query association only | — |
| 369 | **David Emmett** | Emmett / David | CONFIRMED | CA(SA) | SAICA | RPP Developments (Pty) Ltd | Western Cape/Western Cape | — |
| 370 | **Clarinda Engelbrecht** | Engelbrecht / Clarinda | CONFIRMED | CA(SA) | SAICA | Current employer unconfirmed; former Faircape Group | Cape Town, Western Cape | — |
| 371 | **Clarinda Engelbrecht** | Engelbrecht / Clarinda | CONFIRMED | CA(SA) | SAICA | Current employer unconfirmed; former Faircape Group | Western Cape/Cape Town | — |
| 372 | **Wilbur Engelbrecht** | Engelbrecht / Wilbur | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/Vredenburg | https://www.linkedin.com/in/wilbur-engelbrecht-4232b8172/ |
| 373 | **Siddiqa Enous** | Enous / Siddiqa | FINANCE_ROLE_CONFIRMED | — | — | AfriSam | — | https://www.linkedin.com/in/siddiqa-enous-b2500b12/ |
| 374 | **Ruan Enslin** | Enslin / Ruan | CONFIRMED | CA(SA) | SAICA | Atterbury Property | Pretoria, Gauteng — published | — |
| 375 | **Ruan Enslin** | Enslin / Ruan | CONFIRMED | CA(SA) | SAICA | Atterbury Property | Gauteng | — |
| 376 | **Wahl Enslin** | Enslin / Wahl | CONFIRMED | CA(SA) | SAICA | Scatec ASA | Western Cape/Cape Town | — |
| 377 | **Wahl Enslin** | Enslin / Wahl | CONFIRMED | CA(SA) | SAICA | Scatec ASA | Western Cape/Cape Town | — |
| 378 | **Donné Erasmus** | Erasmus / Donné | CONFIRMED | CA(SA) | SAICA | The Royal Portfolio | Cape Town – confirm | — |
| 379 | **Donné Erasmus** | Erasmus / Donné | CONFIRMED | CA(SA) | SAICA | The Royal Portfolio | Western Cape/Cape Town | — |
| 380 | **Rafeeq Erasmus** | Erasmus / Rafeeq | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/City of Cape Town | https://www.linkedin.com/in/rafeeq-erasmus-5b113b54/ |
| 381 | **Fanie Esterhuizen** | Esterhuizen / Fanie | FINANCE_ROLE_CONFIRMED | — | — | SPH Kundalila | Western Cape/Cape Town | https://www.linkedin.com/in/fanie-esterhuizen-1a325811b/ |
| 382 | **Heidi Eva Roman** | Eva Roman / Heidi | CONFIRMED | CA(SA) | SAICA | Current employer verify | Western Cape/Western Cape | — |
| 383 | **Wayne Evans** | Evans / Wayne | CONFIRMED | CA(SA) | SAICA | Maïzly | Western Cape location NOT confirmed — X-ray query association only | — |
| 384 | **Wayne Evans** | Evans / Wayne | CONFIRMED | CA(SA) | SAICA | Maïzly | Western Cape/Western Cape | — |
| 385 | **Anthea F.** | F. / Anthea | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/City of Cape Town | https://www.linkedin.com/in/anthea-f-01a87264/ |
| 386 | **Krishka Faber** | Faber / Krishka | CONFIRMED | CA(SA) | SAICA | SnapScan | — | — |
| 387 | **Wardah Facoline** | Facoline / Wardah | CONFIRMED | CA(SA) | SAICA | Western Cape Department of Infrastructure | Western Cape | — |
| 388 | **Amanda Fairley** | Fairley / Amanda | FINANCE_ROLE_CONFIRMED | — | — | Interwaste | Gauteng/Johannesburg | https://www.linkedin.com/in/amanda-fairley-28b74b52/ |
| 389 | **Zahid Fakey** | Fakey / Zahid | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 390 | **Zahida Fakey** | Fakey / Zahida | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 391 | **Brumilda Farmer** | Farmer / Brumilda | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/brumilda-farmer-a04b11176/ |
| 392 | **Craig Felaar** | Felaar / Craig | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/City of Cape Town | https://www.linkedin.com/in/craig-felaar-42982931/ |
| 393 | **Erica Felix** | Felix / Erica | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Western Cape/City of Cape Town | https://www.linkedin.com/in/erica-felix-737839138/ |
| 394 | **Siphamandla Fennie** | Fennie / Siphamandla | FINANCE_ROLE_CONFIRMED | — | — | I&J | Western Cape/City of Cape Town | https://www.linkedin.com/in/siphamandla-fennie/ |
| 395 | **Chantelle Fenwick** | Fenwick / Chantelle | CONFIRMED | AGA(SA) | SAICA | DigiOutsource | Western Cape/Cape Town | https://za.linkedin.com/in/chantelle-fenwick-bb789493 |
| 396 | **Brent Ferreira** | Ferreira / Brent | CONFIRMED | PA(SA) | SAIPA | Afrimat | Western Cape/City of Cape Town | https://www.linkedin.com/in/brent-ferreira-883553172/ |
| 397 | **Ruan Ferreira** | Ferreira / Ruan | CONFIRMED | AGA(SA) | SAICA | LiebenGroup | Western Cape/Cape Town | https://za.linkedin.com/in/ruan-ferreira-aga-sa-37157a196 |
| 398 | **Sol Ferreira** | Ferreira / Sol | CONFIRMED | CA(SA) | SAICA | Unconfirmed (latest listed: OpsFi) | Cape Town, Western Cape | — |
| 399 | **Erin Fester** | Fester / Erin | CONFIRMED | CA(SA) | SAICA | Growth-stage business – employer verify | Western Cape location NOT confirmed — X-ray query association only | — |
| 400 | **Erin Fester** | Fester / Erin | CONFIRMED | CA(SA) | SAICA | Growth-stage business – employer verify | Western Cape/Western Cape | — |
| 401 | **Sophy Finger** | Finger / Sophy | FINANCE_ROLE_CONFIRMED | — | — | AfriSam | — | https://www.linkedin.com/in/sophy-finger-0ab686101/ |
| 402 | **Janys Ann Finn** | Finn / Janys Ann | CONFIRMED | CA(SA) | SAICA | Unlisted property (employer unconfirmed); NED SA Corporate Real Estate; Chair Putprop Limited | — | — |
| 403 | **Byron Fortuin** | Fortuin / Byron | CONFIRMED | AGA(SA) | SAICA | Boschendal Farm | Western Cape/Pniel | https://za.linkedin.com/in/byron-fortuin-aga-sa-637905192 |
| 404 | **Abdulmu-izz Fortune** | Fortune / Abdulmu-izz | FINANCE_ROLE_CONFIRMED | — | — | Premier Fishing & Brands | Western Cape/City of Cape Town | https://www.linkedin.com/in/abdulmu-izz-fortune-808057197/ |
| 405 | **Dawn Fortune** | Fortune / Dawn | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/dawn-fortune-064a8222/ |
| 406 | **Delwen Fortune** | Fortune / Delwen | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/delwen-fortune-b98bb437/ |
| 407 | **Cecile Fourie** | Fourie / Cecile | CONFIRMED | CA(SA) | SAICA | Noble Property Fund | Tyger Valley office, Western Cape | — |
| 408 | **Cecile Fourie** | Fourie / Cecile | CONFIRMED | CA(SA) | SAICA | Noble Property Fund | Western Cape/Western Cape | — |
| 409 | **Christelle Fourie** | Fourie / Christelle | NEEDS_VERIFICATION | Chartered Accountant | — | JUWI South Africa | Western Cape/Cape Town | — |
| 410 | **Jeanne Fourie** | Fourie / Jeanne | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/jeanne-fourie-2741987a/ |
| 411 | **Monique Fourie** | Fourie / Monique | CONFIRMED | CA(SA) | SAICA | The Logistics Group | Western Cape/Cape Town | — |
| 412 | **Monique Fourie** | Fourie / Monique | CONFIRMED | CA(SA) | SAICA | The Logistics Group | Western Cape/Cape Town | — |
| 413 | **Neil Fourie** | Fourie / Neil | CONFIRMED | AGA(SA) | SAICA | Brenn-O-Kem | Western Cape/Stellenbosch | https://www.linkedin.com/in/neil-fourie-aga-sa-2a125b204/ |
| 414 | **Nico Fourie** | Fourie / Nico | CONFIRMED | CA(SA) | SAICA | G7 Renewable Energies | Western Cape/Cape Town | — |
| 415 | **Nico Fourie** | Fourie / Nico | CONFIRMED | CA(SA) | SAICA | G7 Renewable Energies | Western Cape/Cape Town | — |
| 416 | **Suzanne Fourie** | Fourie / Suzanne | FINANCE_ROLE_CONFIRMED | — | — | LANCEWOOD | Western Cape/City of Cape Town | https://www.linkedin.com/in/suzanne-fourie-568541135/ |
| 417 | **Neville Fowler** | Fowler / Neville | CONFIRMED | CA(SA) | SAICA | Employer verify | Western Cape location NOT confirmed — X-ray query association only | — |
| 418 | **Neville Fowler** | Fowler / Neville | CONFIRMED | CA(SA) | SAICA | Employer verify | Western Cape/Western Cape | — |
| 419 | **Gareth Fox** | Fox / Gareth | CONFIRMED | CA(SA) | SAICA | Stor-Age Property REIT | Western Cape/Cape Town | — |
| 420 | **Gareth Fox** | Fox / Gareth | CONFIRMED | CA(SA) | SAICA | Stor-Age Property REIT | Western Cape/Cape Town | — |
| 421 | **Ashley Francis** | Francis / Ashley | CONFIRMED | CA(SA) | SAICA | Infra Impact Investment Managers | Western Cape/Cape Town | — |
| 422 | **David Frank** | Frank / David | CONFIRMED | CA(SA) | SAICA | Climate Fund Managers | Cape Town – confirm | — |
| 423 | **David Frank** | Frank / David | CONFIRMED | CA(SA) | SAICA | Climate Fund Managers | Western Cape/Cape Town | — |
| 424 | **Damien Franklin** | Franklin / Damien | CONFIRMED | CA(SA) | SAICA | Employer verify | Western Cape location NOT confirmed — X-ray query association only | — |
| 425 | **Damien Franklin** | Franklin / Damien | CONFIRMED | CA(SA) | SAICA | Employer verify | Western Cape/Western Cape | — |
| 426 | **Melissa Frantz** | Frantz / Melissa | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/City of Cape Town | https://www.linkedin.com/in/melissa-frantz-4856429a/ |
| 427 | **Petrus Frick** | Frick / Petrus | CONFIRMED | AGA(SA), CFA | SAICA | Frick & Co Advisory | Western Cape/Cape Town | https://za.linkedin.com/in/petrus-frick-223543262 |
| 428 | **Emma Friedman** | Friedman / Emma | CONFIRMED | CA(SA) | SAICA | FINERGREEN | Western Cape/Cape Town | — |
| 429 | **Emma Friedman** | Friedman / Emma | CONFIRMED | CA(SA) | SAICA | FINERGREEN | Western Cape/Cape Town | — |
| 430 | **Laura Frittella** | Frittella / Laura | CONFIRMED | CA(SA) | SAICA | Enel Green Power SA | Cape Town – confirm | — |
| 431 | **Laura Frittella** | Frittella / Laura | CONFIRMED | CA(SA) | SAICA | Enel Green Power SA | Western Cape/Cape Town | — |
| 432 | **Victoria Fryer** | Fryer / Victoria | FINANCE_ROLE_CONFIRMED | — | — | NJR Steel | Gauteng/Benoni | https://www.linkedin.com/in/victoria-fryer-201359222/ |
| 433 | **Vukosi Fungeni** | Fungeni / Vukosi | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 434 | **Akani Fungheni (BCOMPT)** | Fungheni (BCOMPT) / Akani | FINANCE_ROLE_CONFIRMED | — | — | DSV | Western Cape/City of Cape Town | https://www.linkedin.com/in/akani-fungheni-bcompt-654416190/ |
| 435 | **Jackie Furter** | Furter / Jackie | FINANCE_ROLE_CONFIRMED | — | — | Power Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/jackie-furter-47908888/ |
| 436 | **Frikkie G.** | G. / Frikkie | FINANCE_ROLE_CONFIRMED | — | — | WastePlan | Gauteng/Pretoria | https://www.linkedin.com/in/frikkie-g-9036b735/ |
| 437 | **Rameck Gadziso** | Gadziso / Rameck | FINANCE_ROLE_CONFIRMED | — | — | Spier | Western Cape/Somerset West | https://www.linkedin.com/in/rameck-gadziso-cgma-cima-adv-dip-ma-tax-consultant-4a012228/ |
| 438 | **Shaheeda Gafieldien** | Gafieldien / Shaheeda | FINANCE_ROLE_CONFIRMED | — | — | Fruitways | Western Cape/Somerset West | https://www.linkedin.com/in/shaheeda-gafieldien-233599277/ |
| 439 | **Tara Gajjar** | Gajjar / Tara | NEEDS_VERIFICATION | Chartered Accountant | — | Growthpoint Properties | Western Cape/Cape Town | — |
| 440 | **Shahmeen Galer** | Galer / Shahmeen | CONFIRMED | CA(SA) | SAICA | Scatec ASA | Cape Town – confirm | — |
| 441 | **Shahmeen Galer** | Galer / Shahmeen | CONFIRMED | CA(SA) | SAICA | Scatec ASA | Western Cape/Cape Town | — |
| 442 | **Ipfi Gavhi** | Gavhi / Ipfi | FINANCE_ROLE_CONFIRMED | — | — | I&J | Western Cape/Western Cape | https://www.linkedin.com/in/ipfi-gavhi-20426a207/ |
| 443 | **Sandiso Gcwabe** | Gcwabe / Sandiso | CONFIRMED | CA(SA) | SAICA | Wesgro | Western Cape/Cape Town | — |
| 444 | **Sandiso Gcwabe** | Gcwabe / Sandiso | CONFIRMED | CA(SA) | SAICA | Wesgro | Cape Town, Western Cape | — |
| 445 | **Jamie-Anne Geary** | Geary / Jamie-Anne | CONFIRMED | CA(SA) | SAICA | Employer unconfirmed | Western Cape/Cape Town | — |
| 446 | **Jamie-Anne Geary** | Geary / Jamie-Anne | CONFIRMED | CA(SA) | SAICA | Employer unconfirmed | Western Cape/Cape Town | — |
| 447 | **Chelsea Geldenhuys** | Geldenhuys / Chelsea | CONFIRMED | CA(SA) | SAICA | Raubex / Roadmac Surfacing Cape | Free State/Bloemfontein | https://www.linkedin.com/in/chelsea-geldenhuys-ca-sa-0139847b/ |
| 448 | **Duné Geldenhuys** | Geldenhuys / Duné | CONFIRMED | CA(SA) | SAICA | impact.com; earlier property REIT | Western Cape/Cape Town | — |
| 449 | **Duné Geldenhuys** | Geldenhuys / Duné | CONFIRMED | CA(SA) | SAICA | impact.com; earlier property REIT | Western Cape/Cape Town | — |
| 450 | **Nicole Genade** | Genade / Nicole | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/nicole-genade-6186b2149/ |
| 451 | **Rene Geneve Boros** | Geneve Boros / Rene | FINANCE_ROLE_CONFIRMED | — | — | DSV | Germiston Metropolitan Area | https://www.linkedin.com/in/rene-geneve-boros-067048202/ |
| 452 | **Zine Gengana** | Gengana / Zine | CONFIRMED | PA(SA) | SAIPA | HIGHVERN | Western Cape/Cape Town | https://za.linkedin.com/in/zine-gengana-professional-accountant-sa-319526a1 |
| 453 | **Marta Gerbach** | Gerbach / Marta | CONFIRMED | CA(SA) | SAICA | Fourways Airconditioning | — | — |
| 454 | **Zandrea Gerber** | Gerber / Zandrea | CONFIRMED | CA(SA) | SAICA | Pay@ | Western Cape/Paarl | https://www.linkedin.com/in/zandrea-gerber-ca-sa-99a5a475/ |
| 455 | **Christelle Germishuys** | Germishuys / Christelle | FINANCE_ROLE_CONFIRMED | — | — | KWV | Western Cape/City of Cape Town | https://www.linkedin.com/in/christelle-germishuys-438baa4/ |
| 456 | **Emmie Germishuys** | Germishuys / Emmie | FINANCE_ROLE_CONFIRMED | — | — | Sentraal-Suid Co-operative (SSK) | Western Cape/Western Cape | https://www.linkedin.com/in/emmie-germishuys-13ba26262/ |
| 457 | **Nombulelo Geya** | Geya / Nombulelo | RESEARCH_HOLD | — | — | Simeka Consultants & Actuaries | Western Cape | https://za.linkedin.com/in/nombulelo-geya-36a2a12b |
| 458 | **Ayanda Geza** | Geza / Ayanda | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Gauteng/City of Johannesburg | https://www.linkedin.com/in/ayanda-geza-3a336648/ |
| 459 | **Gregg Giles** | Giles / Gregg | CONFIRMED | CA(SA) | SAICA | Westbrooke Alternative Asset Management | — | — |
| 460 | **Robert Gillman** | Gillman / Robert | RESEARCH_HOLD | — | — | — | Western Cape | https://uk.linkedin.com/in/robert-gillman-9281b59a |
| 461 | **Nonkululeko Gobodo** | Gobodo / Nonkululeko | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 462 | **Shailen Gokaldass** | Gokaldass / Shailen | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/shailen-gokaldass-15980b49/ |
| 463 | **Kyrlene Goliath** | Goliath / Kyrlene | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Western Cape/City of Cape Town | https://www.linkedin.com/in/kyrlene-goliath-acma-cgma-a858b046/ |
| 464 | **Tikeyah Goodman** | Goodman / Tikeyah | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Gauteng/City of Johannesburg | https://www.linkedin.com/in/tikeyah-goodman-158876249/ |
| 465 | **Martin Goodwin** | Goodwin / Martin | CONFIRMED | CA(SA) | SAICA | Open Box Software (latest public profile); formerly Faircape | Western Cape/Cape Town | — |
| 466 | **Martin Goodwin** | Goodwin / Martin | CONFIRMED | CA(SA) | SAICA | Open Box Software (latest public profile); formerly Faircape | Western Cape/Cape Town | — |
| 467 | **Albert Goosen** | Goosen / Albert | FINANCE_ROLE_CONFIRMED | — | — | Ceres Fruit Growers | South Africa | https://www.linkedin.com/in/albert-goosen-97223b6/ |
| 468 | **Chantelle Goosen** | Goosen / Chantelle | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/City of Cape Town | https://www.linkedin.com/in/chantellegoosen/ |
| 469 | **Jana Goosen** | Goosen / Jana | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 470 | **Lené Goosen** | Goosen / Lené | FINANCE_ROLE_CONFIRMED | — | — | Libstar | Western Cape/Cape Town | https://www.linkedin.com/in/len/ |
| 471 | **Reece Gordon** | Gordon / Reece | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Western Cape/Somerset West | https://www.linkedin.com/in/reece-gordon-ca-sa-415263223/ |
| 472 | **Zhané Gorridon** | Gorridon / Zhané | HIGH_CONFIDENCE | AGA(SA) | SAICA | Fraxion | Western Cape | — |
| 473 | **André Jacques Gouws** | Gouws / André Jacques | CONFIRMED | CA(SA) | SAICA | Intaprop Investments / Equites Investments 1 (Pty) Ltd; NED Equites Property Fund | — | — |
| 474 | **Kathleen Gouws** | Gouws / Kathleen | FINANCE_ROLE_CONFIRMED | — | — | Macsteel | South Africa | https://www.linkedin.com/in/kathleen-gouws-95b08989/ |
| 475 | **Louise Gouws Du Toit** | Gouws Du Toit / Louise | FINANCE_ROLE_CONFIRMED | — | — | Kaap Agri / Agrimark | South Africa | https://www.linkedin.com/in/louise-gouws-du-toit-18178a14b/ |
| 476 | **Anneline Govender** | Govender / Anneline | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/ethan-horovitz-b4853277/ |
| 477 | **Chernel Govender** | Govender / Chernel | FINANCE_ROLE_CONFIRMED | — | — | Ardagh Glass Packaging SA | Gauteng/City of Johannesburg | https://www.linkedin.com/in/chernel-govender-75935028/ |
| 478 | **Deshnee Govender** | Govender / Deshnee | FINANCE_ROLE_CONFIRMED | — | — | Mpact | KwaZulu-Natal/Ballito | https://www.linkedin.com/in/deshnee-govender-01a433186/ |
| 479 | **Ellendhren Govender** | Govender / Ellendhren | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Gauteng/Randburg | https://www.linkedin.com/in/ellendhren-govender-152b55207/ |
| 480 | **Emanuel Govender** | Govender / Emanuel | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/emanuel-govender-507293138/ |
| 481 | **Lavanya Govender** | Govender / Lavanya | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | Johannesburg Metropolitan Area | https://www.linkedin.com/in/lavanya-govender-302577196/ |
| 482 | **Michelle Govender** | Govender / Michelle | FINANCE_ROLE_CONFIRMED | — | — | Capespan South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/michelle-govender-93bb20124/ |
| 483 | **Niven Govender** | Govender / Niven | CONFIRMED | CA(SA) | SAICA | Old Mutual Alternative Investments | Western Cape location NOT confirmed — X-ray query association only | — |
| 484 | **Niven Govender** | Govender / Niven | CONFIRMED | CA(SA) | SAICA | Old Mutual Alternative Investments | Western Cape/Western Cape | — |
| 485 | **Tanya Govender** | Govender / Tanya | FINANCE_ROLE_CONFIRMED | — | — | RFG Foods | KwaZulu-Natal/KwaZulu-Natal | https://www.linkedin.com/in/tanya-govender-0356441b9/ |
| 486 | **Ellen Gower-Mzolo** | Gower-Mzolo / Ellen | CONFIRMED | CA(SA) | SAICA | The Fulcrum Group | — | — |
| 487 | **Louis Grant** | Grant / Louis | FINANCE_ROLE_CONFIRMED | — | — | EnviroServ | Gauteng/Johannesburg | https://www.linkedin.com/in/louis-grant-55390735/ |
| 488 | **Grant Greeff** | Greeff / Grant | CONFIRMED | CA(SA) | SAICA | Drone Ops Group | — | — |
| 489 | **Lerenzo Greeff** | Greeff / Lerenzo | CONFIRMED | PA(SA) | SAIPA | African Unity Life | Western Cape | https://za.linkedin.com/in/lerenzo-greeff-pa-sa-339064146 |
| 490 | **Rene Greeff** | Greeff / Rene | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Mpumalanga/Mkhondo Local Municipality | https://www.linkedin.com/in/rene-greeff-088701a8/ |
| 491 | **Willem Greeff** | Greeff / Willem | FINANCE_ROLE_CONFIRMED | — | — | Much Asphalt | Western Cape/Cape Town | https://www.linkedin.com/in/willem-greeff-23836635/ |
| 492 | **Willem Greeff** | Greeff / Willem | NEEDS_VERIFICATION | Chartered Accountant | — | Much Asphalt | Western Cape/Cape Town | — |
| 493 | **Morgan Gregory** | Gregory / Morgan | CONFIRMED | CA(SA) | SAICA | MK Aerospace SA | Western Cape/Cape Town | https://www.linkedin.com/in/morgan-gregory-ca-sa-64046117b/ |
| 494 | **Nicole Grendeling** | Grendeling / Nicole | CONFIRMED | CA(SA) | SAICA | Astron Energy | Western Cape/City of Cape Town | https://www.linkedin.com/in/nicole-grendeling-ca-sa-bb99a7150/ |
| 495 | **Christanet Grewar** | Grewar / Christanet | CONFIRMED | ACCA | ACCA | PKF Cape Town | Western Cape/Cape Town | https://za.linkedin.com/in/christanet-grewar-acca-saipa-27a9195a |
| 496 | **Bianca Greyling** | Greyling / Bianca | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Gauteng/Gauteng | https://www.linkedin.com/in/bianca-greyling-6307819a/ |
| 497 | **Carmen Gribble** | Gribble / Carmen | RESEARCH_HOLD | ACMA, CGMA | CIMA | Super Group / SGHC | Western Cape/Cape Town | — |
| 498 | **Ulandy Junine Gribble** | Gribble / Ulandy Junine | NEEDS_VERIFICATION | Chartered Accountant | — | Frontier Transport Holdings | — | — |
| 499 | **Mer-Lynn Griego** | Griego / Mer-Lynn | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Western Cape/City of Cape Town | https://www.linkedin.com/in/mer-lynn-griego-4969128b/ |
| 500 | **Anja Griesche** | Griesche / Anja | RESEARCH_HOLD | — | — | Saint-Gobain Africa | — | — |
| 501 | **Jason Grieve** | Grieve / Jason | HIGH_CONFIDENCE | CA(SA) | SAICA | Crawford Dougall Holdings | — | — |
| 502 | **Jason Grieve** | Grieve / Jason | CONFIRMED | CA(SA) | SAICA | Crawford Dougall Holdings | — | — |
| 503 | **Barry Griffin** | Griffin / Barry | RESEARCH_HOLD | — | — | — | Western Cape | https://uk.linkedin.com/in/barry-griffin-5b4b691ab |
| 504 | **Shahied Griffin** | Griffin / Shahied | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/shahied-griffin-0b6203128/ |
| 505 | **Danie Grobbelaar** | Grobbelaar / Danie | RESEARCH_HOLD | — | — | 123CONSULTING | Western Cape | https://za.linkedin.com/in/danie-grobbelaar-a1318b118 |
| 506 | **Andre Grobler** | Grobler / Andre | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/andregrobler/ |
| 507 | **Daniël Grobler** | Grobler / Daniël | CONFIRMED | CA(SA) | SAICA | Unconfirmed (Group Financial Director of Murray & Roberts from 1 April 2017) | — | — |
| 508 | **Amanda Groenewald** | Groenewald / Amanda | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/amanda-groenewald-a63a93110/ |
| 509 | **Breyton Groenewald** | Groenewald / Breyton | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/breyton-groenewald-50803258 |
| 510 | **Owen Gush** | Gush / Owen | FINANCE_ROLE_CONFIRMED | — | — | Ladismith Cheese / Woodlands Dairy Group | Eastern Cape/Port Elizabeth | https://www.linkedin.com/in/owen-gush-29051371/ |
| 511 | **Asanda Gwiliza** | Gwiliza / Asanda | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/asanda-gwiliza-4954901b5/ |
| 512 | **Lyle Haas** | Haas / Lyle | CONFIRMED | AGA(SA) | SAICA | — | Western Cape | https://za.linkedin.com/in/lyle-haas-439118136 |
| 513 | **Alicia Haasbroek** | Haasbroek / Alicia | CONFLICTING | — | — | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 514 | **Andrea Haasbroek** | Haasbroek / Andrea | CONFIRMED | PA(SA) | SAIPA | — | Western Cape | https://za.linkedin.com/in/andrea-haasbroek-83b44985 |
| 515 | **Christine Haasbroek** | Haasbroek / Christine | CONFIRMED | PA(SA) | SAIPA | Bryce Monitoring (Pty) Ltd | Western Cape/Paarl | https://za.linkedin.com/in/christine-haasbroek-professional-accountant-sa-911057b2 |
| 516 | **Pinny Hack** | Hack / Pinny | CONFIRMED | CA(SA) | SAICA | Steyn Group | Western Cape/Cape Town | — |
| 517 | **Pinny Hack** | Hack / Pinny | CONFIRMED | CA(SA) | SAICA | Steyn Group | Western Cape/Cape Town | — |
| 518 | **Matthew Hall** | Hall / Matthew | FINANCE_ROLE_CONFIRMED | — | — | Raubex / Roadmac Surfacing Cape | South Africa | https://www.linkedin.com/in/matthew-hall-1b045bba/ |
| 519 | **Bilquis Hamid** | Hamid / Bilquis | CONFIRMED | CA(SA) | SAICA | Excellerate Real Estate Services | Western Cape location NOT confirmed — X-ray query association only | — |
| 520 | **Bilquis Hamid** | Hamid / Bilquis | CONFIRMED | CA(SA) | SAICA | Excellerate Real Estate Services | Western Cape/Western Cape | — |
| 521 | **Taryn Hamid** | Hamid / Taryn | CONFIRMED | PA(SA) | SAIPA | Bateleur Capital | Western Cape | https://za.linkedin.com/in/taryn-hamid-professional-accountant-s-a-616a5751 |
| 522 | **Desray Hamilton** | Hamilton / Desray | FINANCE_ROLE_CONFIRMED | — | — | Ardagh Glass Packaging SA | South Africa | https://www.linkedin.com/in/desray-hamilton-25a1a726/ |
| 523 | **John Hamman** | Hamman / John | CONFIRMED | CA(SA) | SAICA | ReefRock Asset Management | Bellville area | — |
| 524 | **John Hamman** | Hamman / John | CONFIRMED | CA(SA) | SAICA | ReefRock Asset Management | Western Cape/Bellville | — |
| 525 | **Martjie Hamman** | Hamman / Martjie | CONFIRMED | CA(SA) | SAICA | Oasis Water | Cape Town – check | — |
| 526 | **Martjie Hamman** | Hamman / Martjie | CONFIRMED | CA(SA) | SAICA | Oasis Water | Western Cape/Cape Town | — |
| 527 | **Ashley Hanekom** | Hanekom / Ashley | CONFIRMED | CA(SA) | SAICA | Superside | Western Cape/Cape Town | https://www.linkedin.com/in/ashleyhanekom/ |
| 528 | **Cornelius Hanekom** | Hanekom / Cornelius | CONFIRMED | ACMA, CGMA | CIMA | amplify5 | Western Cape/Cape Town | https://za.linkedin.com/in/cornelius-hanekom |
| 529 | **Hennie Hanekom** | Hanekom / Hennie | NEEDS_VERIFICATION | Chartered Accountant | — | Renewable energy asset management | Western Cape/Cape Town | — |
| 530 | **Marilize Hanekom** | Hanekom / Marilize | NEEDS_VERIFICATION | Chartered Accountant | — | Mother Lode Properties | Western Cape/Cape Town | — |
| 531 | **Yvette Hanekom** | Hanekom / Yvette | RESEARCH_HOLD | — | — | Products, Supply Chain & Functional Finance, Ecowize | Western Cape | — |
| 532 | **Samantha Hanke** | Hanke / Samantha | CONFIRMED | CA(SA) | SAICA | Afrimat | Western Cape/Cape Town | https://www.linkedin.com/in/samantha-hanke-ca-sa-b923b1166/ |
| 533 | **Samantha Hanke** | Hanke / Samantha | CONFIRMED | CA(SA) | SAICA | Afrimat | Western Cape/Cape Town | — |
| 534 | **Samantha Hanke** | Hanke / Samantha | CONFIRMED | CA(SA) | SAICA | Afrimat | Western Cape/Cape Town | — |
| 535 | **John Haresnape** | Haresnape / John | CONFIRMED | CA(SA) | SAICA | Employer verify | Western Cape location NOT confirmed — X-ray query association only | — |
| 536 | **John Haresnape** | Haresnape / John | CONFIRMED | CA(SA) | SAICA | Employer verify | Western Cape/Western Cape | — |
| 537 | **Romona Harisunker** | Harisunker / Romona | CONFIRMED | AGA(SA) | SAICA | Turn Capital - Single Family Office | Western Cape/Cape Town | https://za.linkedin.com/in/romona-harisunker-aga-sa-7a495a108 |
| 538 | **Magda Harmse** | Harmse / Magda | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/magda-harmse-5940a540/ |
| 539 | **Linda Harris** | Harris / Linda | FINANCE_ROLE_CONFIRMED | — | — | Tronox Namakwa Sands | Western Cape/Hermanus | https://www.linkedin.com/in/linda-harris-13293129/ |
| 540 | **Nicole Harris** | Harris / Nicole | CONFIRMED | CA(SA) | SAICA | WBHO Construction - Cape Division | Johannesburg Metropolitan Area | https://www.linkedin.com/in/nicole-harris-ca-sa-8b6171150/ |
| 541 | **Monique Harrison** | Harrison / Monique | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/monique-harrison-50409aa7 |
| 542 | **Portia Harrison** | Harrison / Portia | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Western Cape/Cape Town | https://www.linkedin.com/in/portia-harrison-589184121/ |
| 543 | **Shereen Hartnick** | Hartnick / Shereen | FINANCE_ROLE_CONFIRMED | — | — | Peninsula Beverages | Western Cape/City of Cape Town | https://www.linkedin.com/in/shereen-hartnick-25a6101a/ |
| 544 | **Warnick Hartzenberg** | Hartzenberg / Warnick | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Western Cape/City of Cape Town | https://www.linkedin.com/in/warnick-hartzenberg/ |
| 545 | **Johan Harwood** | Harwood / Johan | CONFIRMED | CA(SA) | SAICA | Employer verify | Western Cape location NOT confirmed — X-ray query association only | — |
| 546 | **Johan Harwood** | Harwood / Johan | CONFIRMED | CA(SA) | SAICA | Employer verify | Western Cape/Western Cape | — |
| 547 | **Imtiaaz Hashim** | Hashim / Imtiaaz | CONFIRMED | CA(SA) | SAICA | BDO South Africa | Western Cape/Cape Town | — |
| 548 | **Gail Hatting** | Hatting / Gail | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | — | https://www.linkedin.com/in/gail-hatting-5ba77176/ |
| 549 | **Helga Hayward** | Hayward / Helga | CONFIRMED | CA(SA) | SAICA | CampusKey Student Living | Western Cape/Cape Town | — |
| 550 | **Helga Hayward** | Hayward / Helga | CONFIRMED | CA(SA) | SAICA | CampusKey Student Living | Western Cape/Cape Town | — |
| 551 | **Ashlin Healy** | Healy / Ashlin | CONFIRMED | CA(SA) | SAICA | Deloitte (South Africa) | Western Cape/Cape Town | https://www.linkedin.com/in/ashlin-healy-ca-sa-130238103/ |
| 552 | **Johan Hefer** | Hefer / Johan | CONFIRMED | CA(SA) | SAICA | Entrepreneurial CFO / employer verify | Western Cape location NOT confirmed — X-ray query association only | — |
| 553 | **Johan Hefer** | Hefer / Johan | CONFIRMED | CA(SA) | SAICA | Entrepreneurial CFO / employer verify | Western Cape/Western Cape | — |
| 554 | **Illana Helman** | Helman / Illana | CONFIRMED | CA(SA) | SAICA | Massmart | Gauteng/Johannesburg | https://www.linkedin.com/in/illana-helman-ca-sa-1279b117/ |
| 555 | **Fahdwa Hendricks** | Hendricks / Fahdwa | CONFIRMED | AGA(SA) | SAICA | Global Load Control | Western Cape/Cape Town | https://za.linkedin.com/in/fahdwa-hendricks-aga-sa-b0a37238 |
| 556 | **Geyrieya Hendricks** | Hendricks / Geyrieya | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | South Africa | https://www.linkedin.com/in/geyrieya-hendricks-407454194/ |
| 557 | **Jacobie Hendricks** | Hendricks / Jacobie | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/jacobie-hendricks-2273a620a/ |
| 558 | **Joshua Hendricks** | Hendricks / Joshua | CONFIRMED | AGA(SA) | SAICA | Anthem | Western Cape/Cape Town | https://za.linkedin.com/in/joshua-hendricks-aga-sa-60790192 |
| 559 | **Charles Victor Henwood** | Henwood / Charles Victor | RESEARCH_HOLD | CA(SA) | SAICA | — | — | — |
| 560 | **Kieran Herbert** | Herbert / Kieran | ARTICLES_CONFIRMED_DESIGNATION_UNVERIFIED | — | — | BGC | Western Cape | https://za.linkedin.com/in/kieran-herbert-671b64149 |
| 561 | **Gregory James Heron** | Heron / Gregory James | CONFIRMED | CA(SA) | SAICA | Infinitus Holdings (Pty) Ltd | — | — |
| 562 | **Jeroen Herweijer** | Herweijer / Jeroen | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/jeroen-herweijer-73b70316 |
| 563 | **Cindy Joy Robertson (née Hess)** | Hess) / Cindy Joy Robertson (née | CONFIRMED | CA(SA) | SAICA | Equites Property Fund (Independent NED from 1 Sep 2025); executive employer Unconfirmed | — | — |
| 564 | **Martin Heunis** | Heunis / Martin | CONFIRMED | CA(SA) | SAICA | Atlas Tower Group | — | — |
| 565 | **Bronvin Heuvel** | Heuvel / Bronvin | CONFIRMED | CA(SA) | SAICA | KPMG (South Africa) | Western Cape/Cape Town | https://www.linkedin.com/in/bronvin-heuvel-ca-sa-ra-7b2475a9/ |
| 566 | **Barry Heyns** | Heyns / Barry | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Stellenbosch | https://www.linkedin.com/in/bernhardheyns/ |
| 567 | **Corné Heyns** | Heyns / Corné | CONFIRMED | CA(SA) | SAICA | Mediclinic Southern Africa | — | — |
| 568 | **Rishka Mustapha Higgs** | Higgs / Rishka Mustapha | CONFIRMED | CA(SA) | SAICA | Anthem | Western Cape/Cape Town | — |
| 569 | **Lerato Hillman** | Hillman / Lerato | CONFIRMED | ACCA | ACCA | Not publicly confirmed | Western Cape/Cape Town | https://za.linkedin.com/in/lerato-hillman-acca-4b482663 |
| 570 | **Patience Hlongwane** | Hlongwane / Patience | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Gauteng/Pretoria | https://www.linkedin.com/in/patience-hlongwane-743b48235/ |
| 571 | **Debra Hlophe, nèe Modiba** | Hlophe, nèe Modiba / Debra | FINANCE_ROLE_CONFIRMED | — | — | Concor | Gauteng/City of Johannesburg | https://www.linkedin.com/in/debra-hlophe-nèe-modiba-27451337/ |
| 572 | **Mduduzi Hlubi** | Hlubi / Mduduzi | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/mduduzi-hlubi-a21b1262/ |
| 573 | **susan hodgkinson** | hodgkinson / susan | FINANCE_ROLE_CONFIRMED | — | — | Concor | Gauteng/Johannesburg | https://www.linkedin.com/in/susan-hodgkinson-b31905248/ |
| 574 | **Mieke Hoffman** | Hoffman / Mieke | CONFIRMED | ACMA, CGMA | CIMA | The Fieldbar Co. | Western Cape/Cape Town | https://za.linkedin.com/in/mieke-hoffman |
| 575 | **Servaas Hofmeyr ACMA, CGMA, MBA** | Hofmeyr ACMA, CGMA, MBA / Servaas | CONFIRMED | ACMA, CGMA | CIMA | Cape Mohair | Western Cape | https://za.linkedin.com/in/servaas-hofmeyr-021b071b |
| 576 | **Caron Hol** | Hol / Caron | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Western Cape/City of Cape Town | https://www.linkedin.com/in/caron-hol-65299a71/ |
| 577 | **Steven Holmes** | Holmes / Steven | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Gauteng/City of Johannesburg | https://www.linkedin.com/in/steven-holmes-04461511/ |
| 578 | **Anntoinique Holtzhauzen** | Holtzhauzen / Anntoinique | CONFIRMED | PA(SA) | SAIPA | — | Western Cape | https://za.linkedin.com/in/anntoinique-holtzhauzen-b1830052 |
| 579 | **Susan Homann** | Homann / Susan | FINANCE_ROLE_CONFIRMED | — | — | Tronox Namakwa Sands | KwaZulu-Natal/KwaZulu-Natal | https://www.linkedin.com/in/susan-homann-407a2389/ |
| 580 | **Tim Horak** | Horak / Tim | CONFIRMED | ACMA, CGMA | CIMA | Parmalat South Africa / Africa | Western Cape/Cape Town | https://za.linkedin.com/in/tim-horak-acma-cgma-54272ab0 |
| 581 | **Juanita Horn** | Horn / Juanita | CONFIRMED | CA(SA) | SAICA | Viva Formwork and Scaffolding | Western Cape/Cape Town | — |
| 582 | **Juanita Horn** | Horn / Juanita | CONFIRMED | CA(SA) | SAICA | Viva Formwork and Scaffolding | Western Cape/Cape Town | — |
| 583 | **Peter Horn** | Horn / Peter | CONFIRMED | CA(SA) | SAICA | The Virtual FD (Pty) Ltd | Cape Town, Western Cape | — |
| 584 | **Peter Horn** | Horn / Peter | CONFIRMED | CA(SA) | SAICA | The Virtual FD (Pty) Ltd | Western Cape/Cape Town | — |
| 585 | **Armand Horst** | Horst / Armand | FINANCE_ROLE_CONFIRMED | — | — | WastePlan | Gauteng/Johannesburg | https://www.linkedin.com/in/armandhorst/ |
| 586 | **Chantilly Howard** | Howard / Chantilly | CONFIRMED | CA(SA) | SAICA | Royal Kaak Africa | Western Cape location NOT confirmed — X-ray query association only | — |
| 587 | **Chantilly Howard** | Howard / Chantilly | CONFIRMED | CA(SA) | SAICA | Royal Kaak Africa | Western Cape/Western Cape | — |
| 588 | **Cheryl Hudson** | Hudson / Cheryl | NEEDS_VERIFICATION | Chartered Accountant | — | Scatec ASA | Western Cape/Cape Town | — |
| 589 | **Jan Hugo van der Merwe** | Hugo van der Merwe / Jan | REJECTED | CA(SA) | SAICA | PERI South Africa | Western Cape/Cape Town | — |
| 590 | **Chante Hulme-Bruwer** | Hulme-Bruwer / Chante | CONFIRMED | CA(SA) | SAICA | Rickety Bridge Winery | Western Cape location NOT confirmed — X-ray query association only | — |
| 591 | **Chante Hulme-Bruwer** | Hulme-Bruwer / Chante | CONFIRMED | CA(SA) | SAICA | Rickety Bridge Winery | Western Cape/Western Cape | — |
| 592 | **Sunell Humphris** | Humphris / Sunell | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Port Elizabeth Metropolitan Area | https://www.linkedin.com/in/sunell-humphris-71771b170/ |
| 593 | **Rensche-Mari Hurter (Jansen)** | Hurter (Jansen) / Rensche-Mari | CONFIRMED | CGMA | CIMA | Corpag | Western Cape/Cape Town | https://za.linkedin.com/in/rensche-mari-hurter-jansen-cgma%C2%AE-2aab466b |
| 594 | **Muzaffer Hussain** | Hussain / Muzaffer | CONFIRMED | CA(SA) | SAICA | Questco (Pty) Ltd | — | — |
| 595 | **André Huysamer** | Huysamer / André | HIGH_CONFIDENCE | AGA(SA) | SAICA | Kula | Western Cape/Worcester | — |
| 596 | **Marcel Ingram** | Ingram / Marcel | CONFIRMED | CA(SA) | SAICA | Employer unconfirmed | Western Cape/Cape Town | — |
| 597 | **Marcel Ingram** | Ingram / Marcel | CONFIRMED | CA(SA) | SAICA | Employer unconfirmed | Western Cape/Cape Town | — |
| 598 | **Zoleka Ingrid Tinto** | Ingrid Tinto / Zoleka | CONFIRMED | CA(SA) | SAICA | Remgro Limited | Western Cape/Cape Town | — |
| 599 | **Darren Isaacs** | Isaacs / Darren | CONFIRMED | CA(SA) | SAICA | Makosi | — | — |
| 600 | **Juanita Isaacs** | Isaacs / Juanita | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Western Cape/City of Cape Town | https://www.linkedin.com/in/juanita-isaacs-88006724a/ |
| 601 | **Kasief Isaacs** | Isaacs / Kasief | NEEDS_VERIFICATION | Chartered Accountant | — | Unconfirmed (Mergence Investment Managers as at 2015) | — | — |
| 602 | **Kim Isaacs** | Isaacs / Kim | CONFIRMED | PA(SA) | SAIPA | Providence Hotels | Western Cape/South Africa | https://za.linkedin.com/in/kimnikitaisaacs |
| 603 | **Tony Isaacs** | Isaacs / Tony | RESEARCH_HOLD | — | — | Educor | Western Cape | https://za.linkedin.com/in/tony-isaacs-ab079a36 |
| 604 | **Craig Isler** | Isler / Craig | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/City of Cape Town | https://www.linkedin.com/in/craig-isler-b3a43497/ |
| 605 | **Parveen Ismail** | Ismail / Parveen | FINANCE_ROLE_CONFIRMED | — | — | I&J | Western Cape/Cape Town | https://www.linkedin.com/in/parveen-ismail-001001273/ |
| 606 | **Stuart Izatt** | Izatt / Stuart | CONFIRMED | ACMA, CGMA | CIMA | Commercial Cold Holdings | Western Cape/Cape Town | https://za.linkedin.com/in/stuart-izatt-cgma-acma-47535815 |
| 607 | **Bradley Jackson** | Jackson / Bradley | CONFIRMED | CA(SA) | SAICA | BDO South Africa (Cape Town office) | Western Cape/Cape Town | — |
| 608 | **Nicole Jackson** | Jackson / Nicole | CONFIRMED | CA(SA) | SAICA | Globeleq | Western Cape/Cape Town | — |
| 609 | **Nicole Jackson** | Jackson / Nicole | CONFIRMED | CA(SA) | SAICA | Globeleq | Western Cape/Cape Town | — |
| 610 | **Aldrin Jacobs** | Jacobs / Aldrin | FINANCE_ROLE_CONFIRMED | — | — | Bowler Metcalf / Bowler Plastics | Western Cape/Cape Town | https://za.linkedin.com/in/aldrin-jacobs-56b72a9b |
| 611 | **Anilynne Jacobs** | Jacobs / Anilynne | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Western Cape/City of Cape Town | https://www.linkedin.com/in/anilynne-jacobs-265963165/ |
| 612 | **Anthea Jacobs** | Jacobs / Anthea | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/Cape Town | https://www.linkedin.com/in/anthea-jacobs/ |
| 613 | **Caryn Jacobs** | Jacobs / Caryn | CONFIRMED | AGA(SA) | SAICA | Betway SA20 | Western Cape/Cape Town | https://za.linkedin.com/in/caryn-jacobs-cfm-aga-sa-a9223383 |
| 614 | **Edrich Jacobs** | Jacobs / Edrich | CONFIRMED | CA(SA) | SAICA | Stor-Age Property REIT Limited | Cape Town, Western Cape | — |
| 615 | **Edrich Jacobs** | Jacobs / Edrich | CONFIRMED | CA(SA) | SAICA | Stor-Age Property REIT Limited | Western Cape/Cape Town | — |
| 616 | **Kyle Jacobs** | Jacobs / Kyle | FINANCE_ROLE_CONFIRMED | — | — | Kropz Elandsfontein | Western Cape/City of Cape Town | https://www.linkedin.com/in/kyle-jacobs-17aa7816b/ |
| 617 | **Lyle Jacobs** | Jacobs / Lyle | CONFIRMED | CA(SA) | SAICA | New Balance | Cape Town, Western Cape | — |
| 618 | **Lyle Jacobs** | Jacobs / Lyle | CONFIRMED | CA(SA) | SAICA | New Balance | Western Cape/Cape Town | — |
| 619 | **Anthea Jacobs (Hendricks)** | Jacobs (Hendricks) / Anthea | FINANCE_ROLE_CONFIRMED | — | — | KWV | Western Cape/Paarl | https://www.linkedin.com/in/anthea-hendricks-ca-sa-02501453/ |
| 620 | **Anthea Jacobs (Hendricks)** | Jacobs (Hendricks) / Anthea | CONFIRMED | CA(SA) | SAICA | Employer verify | Western Cape/Western Cape | — |
| 621 | **Lisa Jainundh** | Jainundh / Lisa | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group | South Africa | https://www.linkedin.com/in/lisa-jainundh-96b67199/ |
| 622 | **Alicia Jamneck** | Jamneck / Alicia | CONFIRMED | AGA(SA) | SAICA | Hero Holdings | Western Cape/Paarl | https://za.linkedin.com/in/alicia-jamneck-aga-sa-73b03a128 |
| 623 | **Mamogoto Jan Mokoala** | Jan Mokoala / Mamogoto | FINANCE_ROLE_CONFIRMED | — | — | Sunrise Energy | Gauteng/City of Johannesburg | https://www.linkedin.com/in/mamogoto-jan-mokoala-09a527b/ |
| 624 | **Bea Jansen van Rensburg** | Jansen van Rensburg / Bea | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/bea-jansen-van-rensburg-a9697432 |
| 625 | **Roelof Jansen van Vuuren** | Jansen van Vuuren / Roelof | HIGH_CONFIDENCE | PA(SA) | SAIPA | The Tax Shop Pretoria North East | Gauteng/Pretoria | — |
| 626 | **SP Jansen van Vuuren** | Jansen van Vuuren / SP | FINANCE_ROLE_CONFIRMED | — | — | WastePlan | Johannesburg Metropolitan Area | https://www.linkedin.com/in/sp-jansen-van-vuuren-aga-sa-71540025a/ |
| 627 | **Alana Johns** | Johns / Alana | HIGH_CONFIDENCE | PA(SA) | SAIPA | — | Western Cape | — |
| 628 | **Julian Johnson** | Johnson / Julian | NEEDS_VERIFICATION | Chartered Accountant | — | BioTherm Energy (as at 2019) | — | — |
| 629 | **Charne Johnston** | Johnston / Charne | FINANCE_ROLE_CONFIRMED | — | — | Capespan South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/charnejohnston1/ |
| 630 | **Mark Jolliffe** | Jolliffe / Mark | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/mark-jolliffe-537803171/ |
| 631 | **Kevin de Jong** | Jong / Kevin de | NEEDS_VERIFICATION | Chartered Accountant | — | Lyra Energy | Western Cape/Cape Town | — |
| 632 | **Jeanette Jonker** | Jonker / Jeanette | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Western Cape/City of Cape Town | https://www.linkedin.com/in/jeanette-jonker-47878678/ |
| 633 | **Gaylin Jonkers** | Jonkers / Gaylin | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/gaylin-jonkers-37662457/ |
| 634 | **Samoray Jooste** | Jooste / Samoray | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/samoray-jooste-383191b7/ |
| 635 | **Anja Jordaan** | Jordaan / Anja | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/anja-jordaan-946bbb81/ |
| 636 | **Dean Jordaan** | Jordaan / Dean | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/dean-jordaan-7b331a1b3/ |
| 637 | **Ernst Jordaan** | Jordaan / Ernst | CONFIRMED | CA(SA) | SAICA | Mulilo | Western Cape location NOT confirmed — X-ray query association only | — |
| 638 | **Ernst Jordaan** | Jordaan / Ernst | CONFIRMED | CA(SA) | SAICA | Mulilo | Western Cape/Western Cape | — |
| 639 | **Melanie Jordaan** | Jordaan / Melanie | CONFIRMED | PA(SA) | SAIPA | Macrel Petroleum / Cale group | Western Cape/Kuils River | https://za.linkedin.com/in/melanie-jordaan-11b2a21a0 |
| 640 | **Francois Joubert** | Joubert / Francois | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 641 | **AJ Julies** | Julies / AJ | FINANCE_ROLE_CONFIRMED | — | — | RFG Foods | Western Cape/Paarl | https://www.linkedin.com/in/aj-julies-ca-sa-b7628699/ |
| 642 | **Ashley Julius** | Julius / Ashley | FINANCE_ROLE_CONFIRMED | — | — | KWV | Western Cape/City of Cape Town | https://www.linkedin.com/in/ashley-julius-a9192631/ |
| 643 | **Thapelo K. Matlawe** | K. Matlawe / Thapelo | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/thapelo-k-matlawe-ab34a5178/ |
| 644 | **Sumaya Kader** | Kader / Sumaya | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/sumaya-kader-ca-sa-b5b32a1a3/ |
| 645 | **Kabir Kalyan** | Kalyan / Kabir | CONFIRMED | CA(SA) | SAICA | Climate Fund Managers | Western Cape location NOT confirmed — X-ray query association only | — |
| 646 | **Kabir Kalyan** | Kalyan / Kabir | CONFIRMED | CA(SA) | SAICA | Climate Fund Managers | Western Cape/Western Cape | — |
| 647 | **Anathi Kamkam** | Kamkam / Anathi | HIGH_CONFIDENCE | AGA(SA) | SAICA | Old Mutual Investment Group | Western Cape/Cape Town | — |
| 648 | **Adrian Kandan** | Kandan / Adrian | CONFIRMED | AGA(SA), ACMA, CGMA | SAICA, CIMA | ooba Home Loans | Western Cape/Cape Town | https://za.linkedin.com/in/adrian-kandan-aga-sa-acma-cgma-92749591 |
| 649 | **Nethin Karamchand** | Karamchand / Nethin | CONFIRMED | CA(SA) | SAICA | Deloitte (South Africa) | Western Cape/Cape Town | https://www.linkedin.com/in/nethin/ |
| 650 | **Naazneen Abdul Karim** | Karim / Naazneen Abdul | CONFIRMED | CA(SA) | SAICA | Renewable energy employer — confirm | Western Cape/Cape Town | — |
| 651 | **Lindsay Karools** | Karools / Lindsay | CONFIRMED | PA(SA) | SAIPA | The Building Company | Western Cape | https://za.linkedin.com/in/lindsay-karools-48581816b |
| 652 | **Carmen Karsten** | Karsten / Carmen | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/carmen-karsten-acma-cgma-464a46120/ |
| 653 | **Fia Karstens** | Karstens / Fia | FINANCE_ROLE_CONFIRMED | — | — | Capespan South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/fia-karstens-995225155/ |
| 654 | **Willem Kasselman** | Kasselman / Willem | CONFIRMED | ACMA, CGMA | CIMA | Biosylx | Western Cape/Paarl | https://za.linkedin.com/in/willem-kasselman |
| 655 | **Jo-Lee Keefe** | Keefe / Jo-Lee | FINANCE_ROLE_CONFIRMED | — | — | SA Metal Group | Gauteng/City of Johannesburg | https://www.linkedin.com/in/jo-lee-keefe-46b695100/ |
| 656 | **Natalie Kelbrick** | Kelbrick / Natalie | CONFIRMED | CA(SA) | SAICA | The Shoprite Group of Companies | — | — |
| 657 | **Yabo Kelembe** | Kelembe / Yabo | NEEDS_VERIFICATION | Chartered Accountant | — | Stor-Age Property REIT | Western Cape/Cape Town | — |
| 658 | **Josh Kennedy** | Kennedy / Josh | CONFIRMED | CA(SA) | SAICA | Alveo Water | Western Cape/Cape Town | — |
| 659 | **Josh Kennedy** | Kennedy / Josh | CONFIRMED | CA(SA) | SAICA | Alveo Water | Western Cape/Cape Town | — |
| 660 | **Nandipha Kenqa** | Kenqa / Nandipha | CONFIRMED | CA(SA) | SAICA | Mergence Investment Managers | — | — |
| 661 | **Bradley Kent** | Kent / Bradley | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | Gauteng/City of Johannesburg | https://www.linkedin.com/in/bradley-kent-240798171/ |
| 662 | **khomotso kgapane** | kgapane / khomotso | FINANCE_ROLE_CONFIRMED | — | — | EnviroServ | Gauteng/Johannesburg | https://www.linkedin.com/in/khomotso-kgapane-7b137773/ |
| 663 | **Bridgete Kgopane** | Kgopane / Bridgete | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/Pretoria | https://www.linkedin.com/in/bridgete-kgopane-ab8485258/ |
| 664 | **Mohsin Khan** | Khan / Mohsin | CONFIRMED | CA(SA) | SAICA | Current employer check | Cape Town – check | — |
| 665 | **Mohsin Khan** | Khan / Mohsin | CONFIRMED | CA(SA) | SAICA | Current employer check | Western Cape/Cape Town | — |
| 666 | **Shaheena Khan** | Khan / Shaheena | CONFIRMED | CA(SA) | SAICA | Oxford University Press | Western Cape location NOT confirmed — X-ray query association only | — |
| 667 | **Shaheena Khan** | Khan / Shaheena | CONFIRMED | CA(SA) | SAICA | Oxford University Press | Western Cape/Western Cape | — |
| 668 | **Zaiba Khan** | Khan / Zaiba | CONFIRMED | PA(SA) | SAIPA | PSG Konsult | Western Cape | https://za.linkedin.com/in/zaiba-khan-2396a865 |
| 669 | **Keneuwe Khati** | Khati / Keneuwe | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/Cape Town | https://www.linkedin.com/in/keneuwe-khati-584b7951/ |
| 670 | **Koko Khumalo** | Khumalo / Koko | CONFIRMED | CA(SA) | SAICA | Motlanalo Chartered Accountants and Auditors Inc | — | — |
| 671 | **Sithembiso Khumalo** | Khumalo / Sithembiso | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Gauteng/City of Johannesburg | https://www.linkedin.com/in/sithembiso-khumalo-725914117/ |
| 672 | **Carla Kilian** | Kilian / Carla | HIGH_CONFIDENCE | PA(SA) | SAIPA | AETOS Financial Services | Gauteng/Roodepoort | — |
| 673 | **Roland Killian** | Killian / Roland | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Gauteng/City of Johannesburg | https://www.linkedin.com/in/roland-killian-ca-sa-471a42a2/ |
| 674 | **Matthew Kiln** | Kiln / Matthew | CONFIRMED | ACMA, CGMA | CIMA | Tripco | Western Cape/Stellenbosch | https://za.linkedin.com/in/matthew-kiln-a19746253 |
| 675 | **Craig Lai King** | King / Craig Lai | CONFIRMED | CA(SA) | SAICA | New Development Bank; SANRAE (co-founder) | — | — |
| 676 | **Jason King** | King / Jason | CONFIRMED | PA(SA) | SAIPA | Tintswalo Collection | Western Cape/Cape Town | https://za.linkedin.com/in/jason-king-48871b12 |
| 677 | **Sharon King** | King / Sharon | FINANCE_ROLE_CONFIRMED | — | — | AfriSam | — | https://www.linkedin.com/in/sharon-king-king-53321053/ |
| 678 | **Luke Kirsten** | Kirsten / Luke | RESEARCH_HOLD | CA(SA) | SAICA | Crowie Holdings | — | https://www.linkedin.com/in/luke-kirsten-6a1b374b |
| 679 | **Cheslin Klaasen** | Klaasen / Cheslin | CONFIRMED | PA(SA) | SAIPA | Advania UK | Western Cape/Cape Town | https://za.linkedin.com/in/cheslin-klaasen-professional-accountant-sa-45840451 |
| 680 | **Cheslin Klaasen** | Klaasen / Cheslin | HIGH_CONFIDENCE | PA(SA) | SAIPA | Advania UK | Western Cape | — |
| 681 | **Enrico Kleinbooi** | Kleinbooi / Enrico | CONFIRMED | CA(SA) | SAICA | Kannaland Municipality | Western Cape/Ladismith | — |
| 682 | **Henko Kleynhans** | Kleynhans / Henko | FINANCE_ROLE_CONFIRMED | — | — | Libstar | Western Cape/Cape Town | https://www.linkedin.com/in/henko-kleynhans/ |
| 683 | **Michelle Kleynhans** | Kleynhans / Michelle | RESEARCH_HOLD | — | — | — | Western Cape/Western Cape candidate pool | https://za.linkedin.com/in/michelle-kleynhans-9ab9a12aa |
| 684 | **Frances Klopper** | Klopper / Frances | CONFIRMED | CA(SA) | SAICA | Spear REIT | Western Cape/Cape Town | — |
| 685 | **Frances Klopper** | Klopper / Frances | CONFIRMED | CA(SA) | SAICA | Spear REIT | Western Cape/Cape Town | — |
| 686 | **Melissa Klopper** | Klopper / Melissa | FINANCE_ROLE_CONFIRMED | — | — | DGB | Gauteng/City of Johannesburg | https://www.linkedin.com/in/melissa-klopper-4286421a5/ |
| 687 | **Tracey Klopper** | Klopper / Tracey | CONFIRMED | AGA(SA) | SAICA | JTC Group | Western Cape/Cape Town | https://za.linkedin.com/in/tracey-klopper-aga-sa-663471144 |
| 688 | **Ciska Kloppers** | Kloppers / Ciska | CONFIRMED | CA(SA) | SAICA | Questco (Pty) Ltd | — | — |
| 689 | **Willem Knoesen** | Knoesen / Willem | CONFIRMED | CA(SA) | SAICA | Activ Real Estate | Western Cape location NOT confirmed — X-ray query association only | — |
| 690 | **Willem Knoesen** | Knoesen / Willem | CONFIRMED | CA(SA) | SAICA | Activ Real Estate | Western Cape/Western Cape | — |
| 691 | **Francois Knoetze** | Knoetze / Francois | CONFIRMED | ACMA, CGMA | CIMA | iBanqSA | Western Cape/Stellenbosch | https://za.linkedin.com/in/francois-knoetze |
| 692 | **Liné Knoetze** | Knoetze / Liné | CONFIRMED | CA(SA) | SAICA | Dorpstraat | Western Cape – confirm | — |
| 693 | **Liné Knoetze** | Knoetze / Liné | CONFIRMED | CA(SA) | SAICA | Dorpstraat | Western Cape/Western Cape | — |
| 694 | **Karmen Koch** | Koch / Karmen | FINANCE_ROLE_CONFIRMED | — | — | Chryso Southern Africa | Gauteng/City of Johannesburg | https://www.linkedin.com/in/karmen-koch-03b9b0106/ |
| 695 | **Frances Kock** | Kock / Frances | CONFIRMED | CA(SA) | SAICA | Current employer unconfirmed | Western Cape/Cape Town | — |
| 696 | **Frances Kock** | Kock / Frances | CONFIRMED | CA(SA) | SAICA | Current employer unconfirmed | Western Cape/Cape Town | — |
| 697 | **Daniel Koegelenberg** | Koegelenberg / Daniel | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Western Cape/City of Cape Town | https://www.linkedin.com/in/daniel-koegelenberg-72546291/ |
| 698 | **Daniel Koegelenberg** | Koegelenberg / Daniel | NEEDS_VERIFICATION | Chartered Accountant | — | Afrimat | Western Cape/Cape Town | — |
| 699 | **Wayne Koekemoer** | Koekemoer / Wayne | CONFIRMED | CA(SA) | SAICA | Employer verify | Western Cape location NOT confirmed — X-ray query association only | — |
| 700 | **Wayne Koekemoer** | Koekemoer / Wayne | CONFIRMED | CA(SA) | SAICA | Employer verify | Western Cape/Western Cape | — |
| 701 | **Rutger Koeman** | Koeman / Rutger | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Johannesburg Metropolitan Area | https://www.linkedin.com/in/rutgerkoeman/ |
| 702 | **Nkalipho Koenane** | Koenane / Nkalipho | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | KwaZulu-Natal/Empangeni | https://www.linkedin.com/in/nkalipho-koenane-625689248/ |
| 703 | **Tommie Koeries** | Koeries / Tommie | CONFIRMED | CA(SA), ACMA, CGMA | SAICA, CIMA | Much Asphalt | Western Cape/Cape Town | https://www.linkedin.com/in/tommie-koeries-366bb433/ |
| 704 | **Tommie Koeries** | Koeries / Tommie | CONFIRMED | CA(SA) | SAICA | Much Asphalt | Eersterivier, Western Cape | — |
| 705 | **Tommie Koeries** | Koeries / Tommie | CONFIRMED | CA(SA) | SAICA | Much Asphalt | Western Cape/Western Cape | — |
| 706 | **Rescha Kok** | Kok / Rescha | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/rescha-kok-07971471/ |
| 707 | **Mihlali Kosi** | Kosi / Mihlali | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Eastern Cape/Port Elizabeth | https://www.linkedin.com/in/mihali-kosi-1923ab91/ |
| 708 | **Dirk Kotze** | Kotze / Dirk | CONFIRMED | CA(SA) | SAICA | Afrimat | Western Cape/City of Cape Town | https://www.linkedin.com/in/dirk-kotze-09818018/ |
| 709 | **Dirk Kotze** | Kotze / Dirk | CONFIRMED | CA(SA) | SAICA | Afrimat | Western Cape/Cape Town | — |
| 710 | **Dirk Kotze** | Kotze / Dirk | CONFIRMED | CA(SA) | SAICA | Afrimat | Western Cape/Cape Town | — |
| 711 | **Louis Kotze** | Kotze / Louis | CONFIRMED | CA(SA) | SAICA | Current company unconfirmed | Western Cape/Cape Town | — |
| 712 | **Louis Kotze** | Kotze / Louis | CONFIRMED | CA(SA) | SAICA | Current company unconfirmed | Western Cape/Cape Town | — |
| 713 | **Magda Kotze** | Kotze / Magda | FINANCE_ROLE_CONFIRMED | — | — | Power Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/magda-kotze-a479a3116/ |
| 714 | **Nils Kotze** | Kotze / Nils | FINANCE_ROLE_CONFIRMED | — | — | Raubex / Roadmac Surfacing Cape | Free State/Bloemfontein | https://www.linkedin.com/in/nils-kotze-07344180/ |
| 715 | **Kim Kotzé** | Kotzé / Kim | CONFIRMED | CA(SA) | SAICA | Asilia Africa | Western Cape/Cape Town | — |
| 716 | **Kim Kotzé** | Kotzé / Kim | CONFIRMED | CA(SA) | SAICA | Asilia Africa | Western Cape/Cape Town | — |
| 717 | **Jacques Kriel** | Kriel / Jacques | CONFIRMED | CA(SA) | SAICA | Fairvest Limited | Western Cape/Cape Town | — |
| 718 | **Jacques Kriel** | Kriel / Jacques | CONFIRMED | CA(SA) | SAICA | Fairvest Limited | Western Cape/Cape Town | — |
| 719 | **Monique Kriel** | Kriel / Monique | NEEDS_VERIFICATION | Chartered Accountant | — | PERI South Africa | Western Cape/Cape Town | — |
| 720 | **Bianca Krishna** | Krishna / Bianca | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | KwaZulu-Natal/Durban | https://www.linkedin.com/in/bianca-krishna-ca-sa-a365a5263/ |
| 721 | **Myles Kritzinger** | Kritzinger / Myles | NEEDS_VERIFICATION | Chartered Accountant | — | Burstone | — | — |
| 722 | **Christie Kruger** | Kruger / Christie | FINANCE_ROLE_CONFIRMED | — | — | Spier | Western Cape/Paarl | https://www.linkedin.com/in/christie-kruger-41a922307/ |
| 723 | **Elke Marie Kruger** | Kruger / Elke Marie | CONFIRMED | CA(SA) | SAICA | Current renewable energy employer — verify | Western Cape/Cape Town | — |
| 724 | **Elna Kruger** | Kruger / Elna | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/elna-kruger-37804a160/ |
| 725 | **Kabelo Kuduntwane** | Kuduntwane / Kabelo | CONFIRMED | CA(SA) | SAICA | WBHO Construction - Cape Division | Gauteng/Pretoria | https://www.linkedin.com/in/kabelo-kuduntwane-ca-sa-0a52431a6/ |
| 726 | **Ishak Kula** | Kula / Ishak | CONFIRMED | CA(SA) | SAICA | STADIO Holdings | — | — |
| 727 | **Anela Kumnandi Dumalisile** | Kumnandi Dumalisile / Anela | CONFIRMED | ACMA, CGMA | CIMA | Blue Seas Products (Pty) Ltd | Western Cape/Cape Town | https://za.linkedin.com/in/anela-kumnandi-dumalisile-acma-cgma-1a483910b |
| 728 | **Dylin Kuni** | Kuni / Dylin | CONFIRMED | ACMA, CGMA | CIMA | M+C Saatchi Group | Western Cape/Cape Town | https://www.linkedin.com/in/dylinkuni/ |
| 729 | **Ben Kutlwano Motsweni** | Kutlwano Motsweni / Ben | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Stellenbosch | https://www.linkedin.com/in/ben-kutlwano-motsweni-341974258/ |
| 730 | **Lesetja Kwetepane** | Kwetepane / Lesetja | HIGH_CONFIDENCE | PA(SA) | SAIPA | LA Financial Services (Pty) Ltd | Limpopo/Polokwane | — |
| 731 | **Morné Labuschagne** | Labuschagne / Morné | CONFIRMED | CA(SA) | SAICA | Employer verify | Western Cape location NOT confirmed — X-ray query association only | — |
| 732 | **Morné Labuschagne** | Labuschagne / Morné | CONFIRMED | CA(SA) | SAICA | Employer verify | Western Cape/Western Cape | — |
| 733 | **Terri Ladbrooke** | Ladbrooke / Terri | FINANCE_ROLE_CONFIRMED | — | — | Libstar | Western Cape/Cape Town | — |
| 734 | **Terri Ladbrooke** | Ladbrooke / Terri | CONFIRMED | CA(SA) | SAICA | Libstar | Western Cape/Cape Town | — |
| 735 | **Garthan Lakay** | Lakay / Garthan | FINANCE_ROLE_CONFIRMED | — | — | Kaap Agri / Agrimark | Western Cape/City of Cape Town | https://www.linkedin.com/in/garthan-lakay-bb980214b/ |
| 736 | **Altus Lambrecht** | Lambrecht / Altus | CONFIRMED | CA(SA) | SAICA | Capfin; previously Redefine Property Fund | Western Cape/Cape Town | — |
| 737 | **Altus Lambrecht** | Lambrecht / Altus | CONFIRMED | CA(SA) | SAICA | Capfin; previously Redefine Property Fund | Western Cape/Cape Town | — |
| 738 | **Div Lamprecht** | Lamprecht / Div | CONFIRMED | CA(SA) | SAICA | SAICA | Free State/Bloemfontein | — |
| 739 | **Malvin Lancelot Makanda** | Lancelot Makanda / Malvin | CONFIRMED | AGA(SA) | SAICA | Cecil Kilpin & Co | Western Cape/Cape Town | https://za.linkedin.com/in/malvin-lancelot-makanda-aga-sa-69517716a |
| 740 | **Winston Latham** | Latham / Winston | CONFIRMED | CA(SA) | SAICA | Great Karoo Renewable Energy | Western Cape/Cape Town | — |
| 741 | **Winston Latham** | Latham / Winston | CONFIRMED | CA(SA) | SAICA | Great Karoo Renewable Energy | Western Cape/Cape Town | — |
| 742 | **Haseena Latif** | Latif / Haseena | CONFIRMED | CA(SA) | SAICA | Grindrod | Western Cape location NOT confirmed — X-ray query association only | — |
| 743 | **Haseena Latif** | Latif / Haseena | CONFIRMED | CA(SA) | SAICA | Grindrod | Western Cape/Western Cape | — |
| 744 | **Anel Laubscher** | Laubscher / Anel | FINANCE_ROLE_CONFIRMED | — | — | Commercial Cold Holdings | Western Cape/Cape Town | https://www.linkedin.com/in/anel-laubscher-27933270/ |
| 745 | **Elize Laubscher** | Laubscher / Elize | FINANCE_ROLE_CONFIRMED | — | — | Tronox Namakwa Sands | Western Cape/Saldanha Bay Local Municipality | https://www.linkedin.com/in/elize-laubscher-8999336b/ |
| 746 | **Niki Laubscher** | Laubscher / Niki | CONFIRMED | CA(SA) | SAICA | PKF Cape Town (Bellville office) | Bellville, Cape Town | — |
| 747 | **Steyn Laubscher** | Laubscher / Steyn | CONFIRMED | CA(SA) | SAICA | Employer unconfirmed | Cape Town – confirm | — |
| 748 | **Steyn Laubscher** | Laubscher / Steyn | CONFIRMED | CA(SA) | SAICA | Employer unconfirmed | Western Cape/Cape Town | — |
| 749 | **Ell-Mae Lawrence** | Lawrence / Ell-Mae | FINANCE_ROLE_CONFIRMED | — | — | Kaap Agri / Agrimark | Western Cape/Paarl | https://www.linkedin.com/in/ell-mae-lawrence-ca-sa-54928927b/ |
| 750 | **Magdel Le Grange** | Le Grange / Magdel | RESEARCH_HOLD | CGMA | CIMA | Rolls-Royce Power Systems AG | Western Cape/Cape Town | — |
| 751 | **Rose Leduma** | Leduma / Rose | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | Gauteng/Johannesburg | https://www.linkedin.com/in/rose-leduma-488895214/ |
| 752 | **Dineo Ledwaba** | Ledwaba / Dineo | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Johannesburg Metropolitan Area | https://www.linkedin.com/in/dineo-ledwaba-0b57885a/ |
| 753 | **Mr Lee Xaba** | Lee Xaba / Mr | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/Gauteng | https://www.linkedin.com/in/mr-lee-xaba-1b88142a/ |
| 754 | **Eric le Roux** | le Roux / Eric | FINANCE_ROLE_CONFIRMED | — | — | Kaap Agri / Agrimark | South Africa | https://www.linkedin.com/in/eric-le-roux-896ab518a/ |
| 755 | **Ina Leroux** | Leroux / Ina | RESEARCH_HOLD | — | — | ABS Genetics South Africa | Western Cape | https://za.linkedin.com/in/ina-leroux-31864170 |
| 756 | **Johan le Roux** | le Roux / Johan | CONFIRMED | CA(SA) | SAICA | Johan le Roux CA(SA) | Western Cape/Milnerton (Cape Town) | — |
| 757 | **Lindi le Roux** | le Roux / Lindi | FINANCE_ROLE_CONFIRMED | — | — | Blaauwberg Cold Storage | South Africa | https://za.linkedin.com/in/lindi-le-roux-0b2360164 |
| 758 | **Martelie Le Roux** | Le Roux / Martelie | CONFIRMED | CA(SA) | SAICA | Noble Property Fund | Western Cape/Western Cape | — |
| 759 | **Thinus Le Roux** | Le Roux / Thinus | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 760 | **Tabisa Liborie Singenile Nkomo** | Liborie Singenile Nkomo / Tabisa | CONFIRMED | ACMA, CGMA | CIMA | WBHO Construction - Cape Division | Johannesburg Metropolitan Area | https://www.linkedin.com/in/tabisa-liborie-singenile-nkomo-cgma®-acma-3932b299/ |
| 761 | **Justin Liebenberg** | Liebenberg / Justin | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | Gauteng/City of Johannesburg | https://www.linkedin.com/in/justin-liebenberg-9154b9108/ |
| 762 | **Bernardt van der Linde** | Linde / Bernardt van der | CONFIRMED | CA(SA) | SAICA | Curro Holdings | — | — |
| 763 | **Stefan van der Linde** | Linde / Stefan van der | NEEDS_VERIFICATION | Chartered Accountant | — | Indawo Group | Location unconfirmed | — |
| 764 | **Elizabeth Lindeque** | Lindeque / Elizabeth | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/elizabeth-lindeque-bb1ba11b |
| 765 | **Naledi Liphapang** | Liphapang / Naledi | HIGH_CONFIDENCE | CA(SA) | SAICA | — | — | — |
| 766 | **James Liston** | Liston / James | CONFIRMED | CA(SA) | SAICA | Mpact | Gauteng/City of Johannesburg | https://www.linkedin.com/in/james-liston-7516b2170/ |
| 767 | **Puleng Litsibane** | Litsibane / Puleng | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Gauteng/Germiston | https://www.linkedin.com/in/puleng-litsibane-a2440955/ |
| 768 | **Ashley Little** | Little / Ashley | CONFIRMED | CA(SA) | SAICA | Employer verify | Western Cape location NOT confirmed — X-ray query association only | — |
| 769 | **Ashley Little** | Little / Ashley | CONFIRMED | CA(SA) | SAICA | Employer verify | Western Cape/Western Cape | — |
| 770 | **Francisca Lloyd** | Lloyd / Francisca | FINANCE_ROLE_CONFIRMED | — | — | Macsteel | Gauteng/Benoni | https://www.linkedin.com/in/francisca-lloyd-11434792/ |
| 771 | **Boitumelo Loate** | Loate / Boitumelo | HIGH_CONFIDENCE | CA(SA) | SAICA | 36ONE Asset Management | — | — |
| 772 | **Anne-Lize Lochner** | Lochner / Anne-Lize | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/anne-lize-lochner-b3083421/ |
| 773 | **Ronél Lochner** | Lochner / Ronél | CONFIRMED | CA(SA) | SAICA | PG Bison | Western Cape location NOT confirmed — X-ray query association only | — |
| 774 | **Ronél Lochner** | Lochner / Ronél | CONFIRMED | CA(SA) | SAICA | PG Bison | Western Cape/Western Cape | — |
| 775 | **Claire Lofthouse** | Lofthouse / Claire | FINANCE_ROLE_CONFIRMED | — | — | Cape Herb & Spice | Western Cape/Cape Town | https://www.linkedin.com/in/claire-lofthouse/ |
| 776 | **Andrew Logan** | Logan / Andrew | FINANCE_ROLE_CONFIRMED | CA(SA) | SAICA | WBHO (Wilson Bayly Holmes-Ovcon) | Gauteng/City of Johannesburg | https://www.linkedin.com/in/andrew-logan-77011634/ |
| 777 | **Andrew Logan** | Logan / Andrew | REJECTED | CA(SA) | SAICA | WBHO (Wilson Bayly Holmes-Ovcon) | — | — |
| 778 | **Chris Lombard** | Lombard / Chris | CONFIRMED | CA(SA) | SAICA | Current employer unconfirmed | Location check | — |
| 779 | **Chris Lombard** | Lombard / Chris | CONFIRMED | CA(SA) | SAICA | Current employer unconfirmed | Western Cape | — |
| 780 | **Stephanus Lombard** | Lombard / Stephanus | CONFIRMED | ACMA, CGMA | CIMA | George Whitefield College | Western Cape/Cape Town | https://za.linkedin.com/in/stephanus-lombard-acma-cgma-b74b4096 |
| 781 | **Constant Loubser** | Loubser / Constant | CONFIRMED | ACMA, CGMA | CIMA | Freshworld (Pty) Ltd | Western Cape/Stellenbosch | https://za.linkedin.com/in/constant-loubser-acma-cgma-39960176 |
| 782 | **Eduard Loubser** | Loubser / Eduard | FINANCE_ROLE_CONFIRMED | — | — | Fair Cape Dairies | Western Cape/City of Cape Town | https://www.linkedin.com/in/eduard-loubser-ca-sa-932778175/ |
| 783 | **Eduard Loubser** | Loubser / Eduard | CONFIRMED | CA(SA) | SAICA | Fair Cape Dairies | Western Cape location NOT confirmed — X-ray query association only | — |
| 784 | **Eduard Loubser** | Loubser / Eduard | CONFIRMED | CA(SA) | SAICA | Fair Cape Dairies | Western Cape/Western Cape | — |
| 785 | **Mabru Lourens** | Lourens / Mabru | CONFIRMED | CA(SA) | SAICA | Fujax Group | Western Cape/Cape Town | — |
| 786 | **Mabru Lourens** | Lourens / Mabru | CONFIRMED | CA(SA) | SAICA | Fujax Group | Western Cape/Cape Town | — |
| 787 | **Anwer Louw** | Louw / Anwer | FINANCE_ROLE_CONFIRMED | — | — | KWV | Western Cape/Cape Town | https://www.linkedin.com/in/anwer-louw-343009292/ |
| 788 | **Edwin Louw** | Louw / Edwin | CONFIRMED | CA(SA) | SAICA | TotalEnergies | Western Cape/Cape Town | — |
| 789 | **Edwin Louw** | Louw / Edwin | CONFIRMED | CA(SA) | SAICA | TotalEnergies | Western Cape/Cape Town | — |
| 790 | **Eugene Louw** | Louw / Eugene | FINANCE_ROLE_CONFIRMED | — | — | Kromco | Western Cape/City of Cape Town | https://www.linkedin.com/in/eugene-louw-6ab089b9/ |
| 791 | **Johanita Louw** | Louw / Johanita | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/Cape Town | https://www.linkedin.com/in/johanita-louw-a5538060/ |
| 792 | **Lavinia Louw** | Louw / Lavinia | CONFIRMED | AGA(SA) | SAICA | Standish Management | Western Cape/Cape Town | https://za.linkedin.com/in/lavinia-louw-aga-sa-9a2a2915b |
| 793 | **Leandré Louw** | Louw / Leandré | FINANCE_ROLE_CONFIRMED | — | — | Kaap Agri / Agrimark | Western Cape/Malmesbury | https://www.linkedin.com/in/leandré-louw-a46350146/ |
| 794 | **Lindi Louw** | Louw / Lindi | FINANCE_ROLE_CONFIRMED | — | — | Stellenbosch Vineyards / Advini South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/lindi-louw-22b42a11a/ |
| 795 | **Minette Louw** | Louw / Minette | CONFIRMED | CA(SA) | SAICA | PKF Cape Town (Bellville office) | Bellville, Cape Town | — |
| 796 | **Suzaan Louw** | Louw / Suzaan | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group | South Africa | https://www.linkedin.com/in/suzaan-louw-49207339/ |
| 797 | **Lizane Lubbe** | Lubbe / Lizane | FINANCE_ROLE_CONFIRMED | — | — | Sentraal-Suid Co-operative (SSK) | Western Cape/Swellendam | https://www.linkedin.com/in/lizane-lubbe-42218b121/ |
| 798 | **Stephen Lucas** | Lucas / Stephen | CONFIRMED | CA(SA) | SAICA | Stor-Age Property REIT | Western Cape/Cape Town | — |
| 799 | **Stephen Lucas** | Lucas / Stephen | CONFIRMED | CA(SA) | SAICA | Stor-Age Property REIT | Western Cape/Cape Town | — |
| 800 | **Brendon Lucke** | Lucke / Brendon | FINANCE_ROLE_CONFIRMED | — | — | Commercial Cold Holdings | Western Cape/City of Cape Town | https://www.linkedin.com/in/brendon-lucke-01494065/ |
| 801 | **Brendon Lucke** | Lucke / Brendon | NEEDS_VERIFICATION | Chartered Accountant | — | Commercial Cold Holdings | — | — |
| 802 | **Arline Luiters** | Luiters / Arline | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/arline-luiters-1626bb252/ |
| 803 | **Ewaldi Luus** | Luus / Ewaldi | FINANCE_ROLE_CONFIRMED | — | — | Fair Cape Dairies | Western Cape/Cape Town | https://www.linkedin.com/in/ewaldi-luus-4a06a5212/ |
| 804 | **Wikus Luyt** | Luyt / Wikus | CONFIRMED | CA(SA) | SAICA | PKF Cape Town (Bellville office) | Bellville, Cape Town | — |
| 805 | **Bulelani M.** | M. / Bulelani | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/bulelani-m-94b4513a |
| 806 | **Jesca M.** | M. / Jesca | FINANCE_ROLE_CONFIRMED | — | — | Premier Fishing & Brands | Western Cape/City of Cape Town | https://www.linkedin.com/in/jescameki/ |
| 807 | **Adriaan Maarschalk** | Maarschalk / Adriaan | CONFIRMED | CA(SA) | SAICA | Creative CFO | Western Cape location NOT confirmed — X-ray query association only | — |
| 808 | **Adriaan Maarschalk** | Maarschalk / Adriaan | CONFIRMED | CA(SA) | SAICA | Creative CFO | Western Cape/Western Cape | — |
| 809 | **Cornel Maartens** | Maartens / Cornel | RESEARCH_HOLD | — | — | — | Western Cape/Western Cape candidate pool | https://za.linkedin.com/in/cornel-maartens-a7a83655 |
| 810 | **Heinrich Maartens** | Maartens / Heinrich | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Gauteng/City of Johannesburg | https://www.linkedin.com/in/heinrich-maartens-9bb082b9/ |
| 811 | **Mbali Precious Mabaso** | Mabaso / Mbali | CONFIRMED | CA(SA) | SAICA | Nedbank Group Limited | — | — |
| 812 | **Joanne Mabin** | Mabin / Joanne | NEEDS_VERIFICATION | Chartered Accountant | — | RDC Properties | — | — |
| 813 | **Zuko Maboma** | Maboma / Zuko | FINANCE_ROLE_CONFIRMED | — | — | Premier Fishing & Brands | Western Cape/City of Cape Town | https://www.linkedin.com/in/zukomaboma/ |
| 814 | **Rixongile Mabunda** | Mabunda / Rixongile | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Limpopo/Ba-Phalaborwa Local Municipality | https://www.linkedin.com/in/rixongile-mabunda-4a868797/ |
| 815 | **Nthabeleng Machesa** | Machesa / Nthabeleng | FINANCE_ROLE_CONFIRMED | — | — | Ardagh Glass Packaging SA | Johannesburg Metropolitan Area | https://www.linkedin.com/in/nthabeleng-machesa-ca-sa-19999152/ |
| 816 | **Clever Machokoto** | Machokoto / Clever | NEEDS_VERIFICATION | Chartered Accountant | — | Eurocape Property Solutions / Madela | Western Cape/Cape Town | — |
| 817 | **Celeste Maclons** | Maclons / Celeste | FINANCE_ROLE_CONFIRMED | — | — | SA Metal Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/celeste-maclons-15a76156/ |
| 818 | **Sinawo Madlingozi** | Madlingozi / Sinawo | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Eastern Cape/Port Elizabeth | https://www.linkedin.com/in/sinawo-madlingozi-03476b150/ |
| 819 | **Zanele Maduna** | Maduna / Zanele | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 820 | **Ntsikelelo Maduneni** | Maduneni / Ntsikelelo | CONFIRMED | ACMA, CGMA | CIMA | takealot.com | Western Cape/Cape Town | https://za.linkedin.com/in/ntsikelelo |
| 821 | **Victor Madziwa** | Madziwa / Victor | FINANCE_ROLE_CONFIRMED | — | — | Tronox Namakwa Sands | Western Cape/Lutzville | https://www.linkedin.com/in/victor-madziwa-384398144/ |
| 822 | **Thembela Mafu** | Mafu / Thembela | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/Pretoria | https://www.linkedin.com/in/thembela-mafu-6a8b4817a/ |
| 823 | **Gillian Magolie** | Magolie / Gillian | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Western Cape/City of Cape Town | https://www.linkedin.com/in/gillian-magolie-05427865/ |
| 824 | **Sintu Maguga** | Maguga / Sintu | RESEARCH_HOLD | — | — | — | Western Cape/Western Cape candidate pool | https://za.linkedin.com/in/sintu-maguga-3392b53a |
| 825 | **Unathi Magwentshu** | Magwentshu / Unathi | FINANCE_ROLE_CONFIRMED | CA(SA) | SAICA | Concor Construction | Gauteng/City of Johannesburg | https://www.linkedin.com/in/unathi-magwentshu-aa662834/ |
| 826 | **navin mahabeer** | mahabeer / navin | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/navin-mahabeer-a8b00a26/ |
| 827 | **Nickeel maharaj** | maharaj / Nickeel | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/City of Cape Town | https://www.linkedin.com/in/nickeel-maharaj-a29b12241/ |
| 828 | **Samantha Maharaj** | Maharaj / Samantha | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/samantha-maharaj-6b4730167/ |
| 829 | **Noloyiso Mahlakahlaka-Mhlubulwana** | Mahlakahlaka-Mhlubulwana / Noloyiso | FINANCE_ROLE_CONFIRMED | — | — | Macsteel | Gauteng/City of Johannesburg | https://www.linkedin.com/in/noloyiso-mahlakahlaka-a758128b/ |
| 830 | **Andrew Mahlaku** | Mahlaku / Andrew | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/andrew-mahlaku-a7503336/ |
| 831 | **Kgabiso Mahlangu** | Mahlangu / Kgabiso | CONFIRMED | AGA(SA) | SAICA | South African State Theatre | Gauteng/Pretoria | https://www.linkedin.com/in/kgabiso-mahlangu-aga-sa-b53a951a |
| 832 | **Nkhensani Mahlangu** | Mahlangu / Nkhensani | RESEARCH_HOLD | — | — | — | Western Cape/Western Cape candidate pool | https://za.linkedin.com/in/nkhensani-mahlangu-716576119 |
| 833 | **Simphiwe Mahlangu** | Mahlangu / Simphiwe | HIGH_CONFIDENCE | CA(SA) | SAICA | BDO South Africa | — | — |
| 834 | **Sindisiwe Mahlangu** | Mahlangu / Sindisiwe | FINANCE_ROLE_CONFIRMED | — | — | DSV | Johannesburg Metropolitan Area | https://www.linkedin.com/in/sindisiwe-mahlangu-72911b13b/ |
| 835 | **willie mahlangu** | mahlangu / willie | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | South Africa | https://www.linkedin.com/in/willie-mahlangu-ab96771b/ |
| 836 | **Jameel Mahomed** | Mahomed / Jameel | NEEDS_VERIFICATION | Chartered Accountant | — | Deloitte (South Africa) | — | — |
| 837 | **Zaf Mahomed** | Mahomed / Zaf | CONFIRMED | CA(SA) | SAICA | Oceana Group | Western Cape/Cape Town | https://www.linkedin.com/in/zmahomed/ |
| 838 | **Mpho Mailane** | Mailane / Mpho | CONFIRMED | CA(SA) | SAICA | Unconfirmed (prior: FNB Commercial Property Finance per 2021 award) | City of Johannesburg, Gauteng | — |
| 839 | **Bonga Majozi** | Majozi / Bonga | FINANCE_ROLE_CONFIRMED | — | — | Peninsula Beverages | Western Cape/City of Cape Town | https://www.linkedin.com/in/bonga-majozi-5892b284/ |
| 840 | **Chanelle Makhanya** | Makhanya / Chanelle | FINANCE_ROLE_CONFIRMED | — | — | HEINEKEN Beverages | Gauteng/City of Johannesburg | https://www.linkedin.com/in/chanelle-makhanya-a3652317/ |
| 841 | **Mathabo Makhaya** | Makhaya / Mathabo | CONFIRMED | CA(SA) | SAICA | Harmony Gold Mining | — | — |
| 842 | **Sonwabile Makhesethi** | Makhesethi / Sonwabile | FINANCE_ROLE_CONFIRMED | — | — | Concor | Gauteng/Gauteng | https://www.linkedin.com/in/sonwabile-makhesethi-00b608204/ |
| 843 | **Mpho Makoko-Hottie** | Makoko-Hottie / Mpho | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 844 | **Lindsey Makrygiannis** | Makrygiannis / Lindsey | CONFIRMED | CA(SA) | SAICA | AVIEW Properties | Western Cape/Cape Town | — |
| 845 | **Patricia Malahlela** | Malahlela / Patricia | CONFIRMED | CA(SA) | SAICA | Mckenzie & Associates | — | — |
| 846 | **Andru Malan** | Malan / Andru | CONFIRMED | CA(SA) | SAICA | Reapit | Western Cape/Cape Town | — |
| 847 | **Andru Malan** | Malan / Andru | CONFIRMED | CA(SA) | SAICA | Reapit | Western Cape/Cape Town | — |
| 848 | **Daniël Malan** | Malan / Daniël | CONFIRMED | CA(SA) | SAICA | Noble Property Fund | Tyger Valley office, Western Cape | — |
| 849 | **Daniël Malan** | Malan / Daniël | CONFIRMED | CA(SA) | SAICA | Noble Property Fund | Western Cape/Western Cape | — |
| 850 | **David Malan** | Malan / David | RESEARCH_HOLD | — | — | Watcher Surveillance Solutions | Western Cape/Western Cape candidate pool | https://za.linkedin.com/in/david-malan-32aa861b |
| 851 | **Gerhard Malan** | Malan / Gerhard | CONFIRMED | CA(SA) | SAICA | Enfin Energy Finance | — | — |
| 852 | **Fortunate Malaza** | Malaza / Fortunate | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/Gauteng | https://www.linkedin.com/in/fortunate-malaza-759917b1/ |
| 853 | **Zola Nwabisa Malinga** | Malinga / Zola Nwabisa | RESEARCH_HOLD | CA(SA) | SAICA | Jade Capital Partners | — | — |
| 854 | **Nicky Mametja** | Mametja / Nicky | FINANCE_ROLE_CONFIRMED | — | — | Much Asphalt | Western Cape/Cape Town | https://www.linkedin.com/in/nicky-mametja-23b99b191/ |
| 855 | **Nicky Mametja** | Mametja / Nicky | NEEDS_VERIFICATION | Chartered Accountant | — | Much Asphalt | Western Cape/Cape Town | — |
| 856 | **Tsireledzo Manabela** | Manabela / Tsireledzo | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Stellenbosch | https://www.linkedin.com/in/tsireledzo-manabela-0b4705233/ |
| 857 | **Phineas Manana** | Manana / Phineas | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/Pretoria | https://www.linkedin.com/in/phineas-manana-7bbb5a22b/ |
| 858 | **Beaulah Manasoe** | Manasoe / Beaulah | NEEDS_VERIFICATION | Chartered Accountant | — | Employer to verify | Location to verify | — |
| 859 | **Beaulah Manasoe** | Manasoe / Beaulah | CONFIRMED | CA(SA) | SAICA | Employer to verify | Western Cape | — |
| 860 | **Esethu Mancotywa** | Mancotywa / Esethu | CONFIRMED | CA(SA) | SAICA | Grinaker-LTA | — | https://www.linkedin.com/in/esethu-dazana-ca-sa-mba-6b868866 |
| 861 | **Louis van Manen** | Manen / Louis van | CONFIRMED | CA(SA) | SAICA | BDO South Africa (Johannesburg) | Gauteng/Johannesburg | — |
| 862 | **Manenzhe Manenzhe** | Manenzhe / Manenzhe | CONFIRMED | FCCA | ACCA | ACCA (South Africa) | Gauteng | https://www.linkedin.com/in/manenzhe-manenzhe-fcca-a80079150/ |
| 863 | **Siseko Maninjwa** | Maninjwa / Siseko | FINANCE_ROLE_CONFIRMED | — | — | Ladismith Cheese / Woodlands Dairy Group | Eastern Cape/Port Elizabeth | https://www.linkedin.com/in/siseko-maninjwa-ca-sa-28615b150/ |
| 864 | **Zaid Manjra** | Manjra / Zaid | CONFIRMED | CA(SA) | SAICA | Woolworths Holdings Ltd | Western Cape/Cape Town | — |
| 865 | **Brandon Manuel** | Manuel / Brandon | CONFIRMED | PA(SA) | SAIPA | MUA Insurance | Western Cape | https://za.linkedin.com/in/brandon-manuel-a7261919 |
| 866 | **Lizo Manyana** | Manyana / Lizo | FINANCE_ROLE_CONFIRMED | — | — | Peninsula Beverages | Western Cape/Cape Town | https://www.linkedin.com/in/lizo-manyana-89b64878/ |
| 867 | **Moses Manyeruke** | Manyeruke / Moses | CONFIRMED | ACMA, CGMA | CIMA | Enernet Global | Western Cape/Cape Town | https://za.linkedin.com/in/moses-manyeruke-acma-cgma-ab216521 |
| 868 | **Andisiwe Manzana** | Manzana / Andisiwe | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Gauteng/City of Johannesburg | https://www.linkedin.com/in/andisiwe-manzana-50265627/ |
| 869 | **Sazile Manzini** | Manzini / Sazile | FINANCE_ROLE_CONFIRMED | — | — | Averda South Africa | Gauteng/Johannesburg | https://www.linkedin.com/in/sazile-manzini-24b187127/ |
| 870 | **Sheunesu Mapani** | Mapani / Sheunesu | CONFIRMED | CA(SA) | SAICA | Employer verify | Western Cape location NOT confirmed — X-ray query association only | — |
| 871 | **Sheunesu Mapani** | Mapani / Sheunesu | CONFIRMED | CA(SA) | SAICA | Employer verify | Western Cape/Western Cape | — |
| 872 | **Kunyalala Maphisa** | Maphisa / Kunyalala | RESEARCH_HOLD | CA(SA) | SAICA | — | — | — |
| 873 | **Siseko Mapongwana** | Mapongwana / Siseko | CONFIRMED | PA(SA) | SAIPA | G4S | Western Cape | https://za.linkedin.com/in/siseko-mapongwana-192818145 |
| 874 | **Onkgopotse Mapulane** | Mapulane / Onkgopotse | CONFIRMED | CA(SA) | SAICA | Mergence Investment Managers | — | — |
| 875 | **Orapeleng Maragelo** | Maragelo / Orapeleng | FINANCE_ROLE_CONFIRMED | — | — | AfriSam | Gauteng/City of Johannesburg | https://www.linkedin.com/in/orapeleng-maragelo-8026b191/ |
| 876 | **Anien Marais** | Marais / Anien | CONFIRMED | CA(SA) | SAICA | Novare Property Development SA | Western Cape/Cape Town | — |
| 877 | **Anien Marais** | Marais / Anien | CONFIRMED | CA(SA) | SAICA | Novare Property Development SA | Western Cape/Cape Town | — |
| 878 | **Johan Marais** | Marais / Johan | CONFIRMED | CA(SA) | SAICA | Forvis Mazars (South Africa) - Corporate Finance | Western Cape/Cape Town | — |
| 879 | **Veronique MARCOUX** | MARCOUX / Veronique | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Gauteng/Johannesburg | https://www.linkedin.com/in/veronique-marcoux-55599614a/ |
| 880 | **Romy Maree** | Maree / Romy | CONFIRMED | CA(SA) | SAICA | Burstone (Real Estate partners) | — | — |
| 881 | **Romy Maree** | Maree / Romy | CONFIRMED | CA(SA) | SAICA | Dipula Income Fund | — | — |
| 882 | **Elke Marie Kruger** | Marie Kruger / Elke | CONFIRMED | CA(SA) | SAICA | Current renewable energy employer — verify | Western Cape/Cape Town | — |
| 883 | **Magda Marin Jonck** | Marin Jonck / Magda | RESEARCH_HOLD | — | — | — | Western Cape | — |
| 884 | **Wayne Marriday** | Marriday / Wayne | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/City of Cape Town | https://www.linkedin.com/in/wayne-marriday-0300b943/ |
| 885 | **Danro Marshall** | Marshall / Danro | CONFIRMED | CA(SA) | SAICA | RPA Property Administrators | Western Cape/Cape Town | — |
| 886 | **Danro Marshall** | Marshall / Danro | CONFIRMED | CA(SA) | SAICA | RPA Property Administrators | Western Cape/Cape Town | — |
| 887 | **Jody Marthinus** | Marthinus / Jody | FINANCE_ROLE_CONFIRMED | — | — | LANCEWOOD | Western Cape/Mossel Bay | https://www.linkedin.com/in/jody-marthinus-1326ba39/ |
| 888 | **Alex Martin** | Martin / Alex | CONFIRMED | CA(SA) | SAICA | Mainstream Renewable Power | Western Cape/Cape Town | — |
| 889 | **Alex Martin** | Martin / Alex | CONFIRMED | CA(SA) | SAICA | Mainstream Renewable Power | Western Cape/Cape Town | — |
| 890 | **Richard Martin** | Martin / Richard | FINANCE_ROLE_CONFIRMED | — | — | SA Metal Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/richard-martin-475185122/ |
| 891 | **Iaan Marx** | Marx / Iaan | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 892 | **Dima Masedi** | Masedi / Dima | HIGH_CONFIDENCE | CA(SA) | SAICA | Standard Bank | — | — |
| 893 | **Liziwe Maseloane** | Maseloane / Liziwe | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/Vanderbijlpark | https://www.linkedin.com/in/liziwe-maseloane-10270530a/ |
| 894 | **Theo Mashabane** | Mashabane / Theo | CONFIRMED | CA(SA) | SAICA | Firstmile Properties | Western Cape location NOT confirmed — X-ray query association only | — |
| 895 | **Theo Mashabane** | Mashabane / Theo | CONFIRMED | CA(SA) | SAICA | Firstmile Properties | Western Cape/Western Cape | — |
| 896 | **nomsa mashabela** | mashabela / nomsa | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/Pretoria | https://www.linkedin.com/in/nomsa-mashabela-853195122/ |
| 897 | **Mahosi Mashao** | Mashao / Mahosi | FINANCE_ROLE_CONFIRMED | — | — | AfriSam | — | https://www.linkedin.com/in/mahosi-mashao-77850b33/ |
| 898 | **Phillip Mashao** | Mashao / Phillip | FINANCE_ROLE_CONFIRMED | — | — | AfriSam | Limpopo/Polokwane Local Municipality | https://www.linkedin.com/in/phillip-mashao-72745831a/ |
| 899 | **Thapelo Mashashane** | Mashashane / Thapelo | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/City of Johannesburg | https://www.linkedin.com/in/thapelo-mashashane-493215170/ |
| 900 | **Trevineth Masindi** | Masindi / Trevineth | FINANCE_ROLE_CONFIRMED | — | — | Macsteel | Gauteng/City of Johannesburg | https://www.linkedin.com/in/trevineth-masindi-95605011a/ |
| 901 | **Mfundo Maso** | Maso / Mfundo | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Gauteng/Johannesburg | https://www.linkedin.com/in/mfundo-maso-3559a4234/ |
| 902 | **Glacia Matadin** | Matadin / Glacia | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/glacia-matadin-256aa2b6/ |
| 903 | **Portia Mathebula** | Mathebula / Portia | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | Gauteng/Johannesburg | https://www.linkedin.com/in/portia-mathebula-b6b8281a5/ |
| 904 | **Similo Mathuthu** | Mathuthu / Similo | CONFIRMED | CA(SA) | SAICA | Employer verify | Western Cape location NOT confirmed — X-ray query association only | — |
| 905 | **Similo Mathuthu** | Mathuthu / Similo | CONFIRMED | CA(SA) | SAICA | Employer verify | Western Cape/Western Cape | — |
| 906 | **Manoka Mathye** | Mathye / Manoka | HIGH_CONFIDENCE | CA(SA) | SAICA | KPMG South Africa | — | — |
| 907 | **Ofentse Matloha** | Matloha / Ofentse | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/City of Cape Town | https://www.linkedin.com/in/ofentse-matloha-2a3338204/ |
| 908 | **Katlego Matshego** | Matshego / Katlego | HIGH_CONFIDENCE | CA(SA) | SAICA | Independent Institute of Education (IIE) Varsity College / MSA | — | — |
| 909 | **Tiisetso Matsobane** | Matsobane / Tiisetso | CONFIRMED | ACMA, CGMA | CIMA | Libstar | Western Cape/Cape Town | https://za.linkedin.com/in/tiisetso-matsobane-acma-cgma-54b16890 |
| 910 | **Carin Matthee** | Matthee / Carin | CONFIRMED | CA(SA) | SAICA | Finleys Outsourced Business Services | Western Cape/Somerset West | — |
| 911 | **Carin Matthee** | Matthee / Carin | CONFIRMED | CA(SA) | SAICA | Finleys Outsourced Business Services | Western Cape/Somerset West | — |
| 912 | **Abigail Matuku** | Matuku / Abigail | RESEARCH_HOLD | ACMA, CGMA | CIMA | Pegasys Consulting | Western Cape/Cape Town | — |
| 913 | **Tshepiso Mavimbela** | Mavimbela / Tshepiso | FINANCE_ROLE_CONFIRMED | — | — | Macsteel | Gauteng/City of Johannesburg | https://www.linkedin.com/in/tshepiso-mavimbela-49a99613a/ |
| 914 | **charlotte Mawela** | Mawela / charlotte | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Gauteng/Boksburg | https://www.linkedin.com/in/charlotte-mawela-0866ba91/ |
| 915 | **Amirah Mayet** | Mayet / Amirah | CONFIRMED | CA(SA) | SAICA | Unconfirmed | Cape Town, Western Cape | — |
| 916 | **Linda Mazibuko** | Mazibuko / Linda | RESEARCH_HOLD | — | — | — | Western Cape/Western Cape candidate pool | https://za.linkedin.com/in/linda-mazibuko-44346227 |
| 917 | **Phumelela Mbande** | Mbande / Phumelela | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 918 | **Thobile Mbangeni** | Mbangeni / Thobile | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | Johannesburg Metropolitan Area | https://www.linkedin.com/in/thobile-mbangeni-6baa51141/ |
| 919 | **Zodwa Mbele** | Mbele / Zodwa | CONFIRMED | CA(SA) | SAICA | Development Bank of Southern Africa (DBSA) | — | — |
| 920 | **Athenkosi Mboniswa** | Mboniswa / Athenkosi | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Eastern Cape/Port Elizabeth | https://www.linkedin.com/in/athenkosi-mboniswa-73050b38/ |
| 921 | **Hlayisani Terrent Mboweni** | Mboweni / Hlayisani | HIGH_CONFIDENCE | PA(SA) | SAIPA | Mboweni Accountants | — | — |
| 922 | **Noxolo Mbutho** | Mbutho / Noxolo | FINANCE_ROLE_CONFIRMED | — | — | Mpact | KwaZulu-Natal/Umhlanga | https://www.linkedin.com/in/noxolo-mbutho-16b841115/ |
| 923 | **Michael McAllister (CIMA Adv Dip MA)** | McAllister (CIMA Adv Dip MA) / Michael | FINANCE_ROLE_CONFIRMED | — | — | Interwaste | Gauteng/Johannesburg | https://www.linkedin.com/in/michael-mcallister-cima-adv-dip-ma-33b64484/ |
| 924 | **Richard McDonald** | McDonald / Richard | NEEDS_VERIFICATION | Chartered Accountant | — | Natural resources / environmental advisory | Cape Town – confirm | — |
| 925 | **Trevor McLachlan** | McLachlan / Trevor | HIGH_CONFIDENCE | PA(SA) | SAIPA | McA Inc. | Western Cape/Cape Town | — |
| 926 | **Celeste McLeroth** | McLeroth / Celeste | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/City of Johannesburg | https://www.linkedin.com/in/celeste-mcleroth-4b22541a/ |
| 927 | **Chris McMaster** | McMaster / Chris | NEEDS_VERIFICATION | Chartered Accountant | — | Rabie Property Developers / Rabie Holdings | Western Cape/Cape Town | — |
| 928 | **Phindile Mcunu** | Mcunu / Phindile | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/phindile-mcunu-036431128/ |
| 929 | **Rendani Mdluli** | Mdluli / Rendani | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/City of Johannesburg | https://www.linkedin.com/in/rendani-mdluli-86898494/ |
| 930 | **Nontobeko Mehlomakhulu** | Mehlomakhulu / Nontobeko | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/City of Cape Town | https://www.linkedin.com/in/nontobeko-mehlomakhulu-7006108/ |
| 931 | **Kaylene Meintjies** | Meintjies / Kaylene | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/kaylene-meintjies-5a04a7123/ |
| 932 | **Zinathi Melamane** | Melamane / Zinathi | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Johannesburg Metropolitan Area | https://www.linkedin.com/in/zinathi-melamane-757a7941/ |
| 933 | **Dries Mellet** | Mellet / Dries | CONFIRMED | CA(SA) | SAICA | Zeder Investments | — | — |
| 934 | **Rieduwaan Meniers** | Meniers / Rieduwaan | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Gauteng/Midrand | https://www.linkedin.com/in/rieduwaan-meniers-90446312a/ |
| 935 | **Ruan Mentz** | Mentz / Ruan | CONFIRMED | CA(SA) | SAICA | Employer current unconfirmed | Cape Town – check | — |
| 936 | **Ruan Mentz** | Mentz / Ruan | CONFIRMED | CA(SA) | SAICA | Employer current unconfirmed | Western Cape/Cape Town | — |
| 937 | **Kosie Menzangani** | Menzangani / Kosie | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/kosie-menzangani-877a6a7a/ |
| 938 | **Phumulani Menzi Mabena** | Menzi Mabena / Phumulani | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | Gauteng/City of Johannesburg | https://www.linkedin.com/in/phumulani-menzi-mabena-0b696158/ |
| 939 | **Sean Meredith** | Meredith / Sean | CONFIRMED | ACMA, CGMA | CIMA | City of Cape Town | Western Cape/Cape Town | https://za.linkedin.com/in/sean-meredith-acma-cgma-029ab46 |
| 940 | **Derick van der Merwe** | Merwe / Derick van der | CONFIRMED | CA(SA) | SAICA | DVDM Properties | Western Cape/Durbanville | — |
| 941 | **Ferdie van der Merwe** | Merwe / Ferdie van der | CONFIRMED | CA(SA) | SAICA | VDMV Property Group | Western Cape/Cape Town | — |
| 942 | **IR van der Merwe** | Merwe / IR van der | REJECTED | CA(SA) | SAICA | Raubex Group | Western Cape location NOT confirmed — X-ray query association only | — |
| 943 | **Jan Hugo van der Merwe** | Merwe / Jan Hugo van der | RESEARCH_HOLD | — | — | PERI South Africa | Western Cape/Cape Town | — |
| 944 | **Nadia van der Merwe** | Merwe / Nadia van der | CONFIRMED | CA(SA) | SAICA | VDMV Property Group | Western Cape/Cape Town | — |
| 945 | **Schalk van der Merwe** | Merwe / Schalk van der | CONFIRMED | CA(SA) | SAICA | PKF Cape Town (Bellville office) | Bellville, Cape Town | — |
| 946 | **Yvette van der Merwe** | Merwe / Yvette van der | NEEDS_VERIFICATION | Chartered Accountant | — | Sasol | Western Cape/Paarl | — |
| 947 | **Cara Meyer** | Meyer / Cara | CONFIRMED | CA(SA) | SAICA | Wilson Partners | Western Cape location NOT confirmed — X-ray query association only | — |
| 948 | **Cara Meyer** | Meyer / Cara | CONFIRMED | CA(SA) | SAICA | Wilson Partners | Western Cape/Western Cape | — |
| 949 | **Francois Meyer** | Meyer / Francois | CONFIRMED | PA(SA) | SAIPA | The Tax Shop Stellenbosch | Western Cape/Stellenbosch | https://za.linkedin.com/in/francois-meyer-75919a261 |
| 950 | **Freddie Meyer** | Meyer / Freddie | CONFIRMED | CA(SA) | SAICA | Mulilo | — | — |
| 951 | **Maurice Meyer** | Meyer / Maurice | FINANCE_ROLE_CONFIRMED | — | — | KWV | Western Cape/Cape Town | https://www.linkedin.com/in/maurice-meyer-08545a262/ |
| 952 | **Edgar Meyers** | Meyers / Edgar | FINANCE_ROLE_CONFIRMED | — | — | SA Metal Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/edgar-meyers-12b98864/ |
| 953 | **Aphiwe Mgaleli** | Mgaleli / Aphiwe | FINANCE_ROLE_CONFIRMED | — | — | Cape Herb & Spice | Western Cape/Cape Town | https://www.linkedin.com/in/aphiwemgaleli/ |
| 954 | **Thobile Mgenge Otobor** | Mgenge Otobor / Thobile | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/thobile-mgenge-otobor-acma-cgma-mip-4593818a/ |
| 955 | **Makhosazana Mhlongo** | Mhlongo / Makhosazana | CONFIRMED | CA(SA) | SAICA | SA Corporate Real Estate (previous); Concor Construction (previous) | Location unconfirmed | — |
| 956 | **Makhosazana Mhlongo** | Mhlongo / Makhosazana | CONFIRMED | CA(SA) | SAICA | SA Corporate Real Estate (previous); Concor Construction (previous) | Western Cape | — |
| 957 | **Lee-Roy Middleton** | Middleton / Lee-Roy | FINANCE_ROLE_CONFIRMED | — | — | Kaap Agri / Agrimark | Western Cape/Cape Town | https://www.linkedin.com/in/lee-roy-middleton-19346446/ |
| 958 | **Carli Mills** | Mills / Carli | FINANCE_ROLE_CONFIRMED | — | — | Fruitways | South Africa | https://www.linkedin.com/in/carli-mills-b8b3a5115/ |
| 959 | **Mangaliso Mithi** | Mithi / Mangaliso | CONFIRMED | FCMA, CGMA | CIMA | — | Gauteng/Johannesburg | https://www.linkedin.com/in/mangalisomithi/ |
| 960 | **thobile mkhabela** | mkhabela / thobile | FINANCE_ROLE_CONFIRMED | — | — | Raubex / Roadmac Surfacing Cape | Mpumalanga/Nelspruit | https://www.linkedin.com/in/thobile-mkhabela-a575a790/ |
| 961 | **Xolile Mkuhlana** | Mkuhlana / Xolile | CONFIRMED | ACMA, CGMA | CIMA | SASSA | Western Cape/Cape Town | https://za.linkedin.com/in/xolile-mkuhlana-acma-cgma-9306a334 |
| 962 | **Sikelela Mkungeki** | Mkungeki / Sikelela | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/Cape Town | https://www.linkedin.com/in/sikelela-mkungeki-25a37372/ |
| 963 | **Nox Mlalazi** | Mlalazi / Nox | CONFIRMED | CA(SA) | SAICA | Westbrooke Alternative Asset Management | South Africa | — |
| 964 | **Gcina Mlambo** | Mlambo / Gcina | FINANCE_ROLE_CONFIRMED | — | — | PPC | Gauteng/City of Johannesburg | https://www.linkedin.com/in/gcina-mlambo-582643120/ |
| 965 | **Siphesihle Mlangeni** | Mlangeni / Siphesihle | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 966 | **Precious Moagi** | Moagi / Precious | FINANCE_ROLE_CONFIRMED | — | — | AfriSam | Gauteng/Meredale | https://www.linkedin.com/in/precious-moagi-a3b41b278/ |
| 967 | **Seragi Mogano,** | Mogano, / Seragi | FINANCE_ROLE_CONFIRMED | — | — | Tronox Namakwa Sands | Western Cape/Cape Town | https://www.linkedin.com/in/seragi-mogano-cima-cert-ba-452826a3/ |
| 968 | **Fayaz Mohamed** | Mohamed / Fayaz | CONFIRMED | CA(SA) | SAICA | BDO South Africa (Cape Town office) | Western Cape/Cape Town | — |
| 969 | **Ismail Mohamed** | Mohamed / Ismail | CONFIRMED | CA(SA) | SAICA | Unconfirmed (title shows 'City of Cape Town, Western Cape') | Cape Town, Western Cape | — |
| 970 | **Mpolaheng Mohlopi** | Mohlopi / Mpolaheng | CONFIRMED | CA(SA) | SAICA | Lanseria International Airport | Gauteng/Lanseria | — |
| 971 | **Brecht Mohonathan** | Mohonathan / Brecht | CONFIRMED | CA(SA) | SAICA | Lions Cricket | Gauteng/Johannesburg | — |
| 972 | **Kgomotso Moipolai** | Moipolai / Kgomotso | CONFIRMED | PA(SA) | SAIPA | — | Western Cape | https://za.linkedin.com/in/kgomotso-moipolai-014726207 |
| 973 | **Samson Joel Mojalefa** | Mojalefa / Samson Joel | CONFIRMED | CA(SA) | SAICA | SA Corporate Real Estate Limited | — | — |
| 974 | **Kgomotso Mokabane** | Mokabane / Kgomotso | CONFIRMED | CA(SA) | SAICA | Unconfirmed (LinkedIn lists Sanlam Private Wealth, Cape Town; current status not dated) | Cape Town, Western Cape | — |
| 975 | **Goitsemang Mokaila** | Mokaila / Goitsemang | FINANCE_ROLE_CONFIRMED | — | — | HEINEKEN Beverages | Johannesburg Metropolitan Area | https://www.linkedin.com/in/goitsemang-mokaila-4a417362/ |
| 976 | **Tumi Mokgoko** | Mokgoko / Tumi | CONFIRMED | CA(SA) | SAICA | KPMG | — | — |
| 977 | **Kelebogile Mokhine** | Mokhine / Kelebogile | FINANCE_ROLE_CONFIRMED | — | — | Averda South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/kelebogile-mokhine-407b2b137/ |
| 978 | **Khati Mokhobo** | Mokhobo / Khati | CONFIRMED | CA(SA) | SAICA | Sun International (as at 2019) | — | — |
| 979 | **Bonga Mokoena** | Mokoena / Bonga | CONFIRMED | CA(SA) | SAICA | BDO South Africa | Gauteng/Johannesburg | — |
| 980 | **Palesa Mokoena** | Mokoena / Palesa | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Gauteng/Pretoria | https://www.linkedin.com/in/palesa-mokoena-b74573127/ |
| 981 | **Phuti Mokoka** | Mokoka / Phuti | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | South Africa | https://www.linkedin.com/in/phuti-mokoka-81b22a9b/ |
| 982 | **Mpho Mokwele** | Mokwele / Mpho | CONFIRMED | CA(SA) | SAICA | Development Bank of Southern Africa (DBSA) | — | — |
| 983 | **Dineo Molefe** | Molefe / Dineo | CONFIRMED | CA(SA) | SAICA | MTN South Africa | — | — |
| 984 | **Tshepi Moleko** | Moleko / Tshepi | NEEDS_VERIFICATION | Chartered Accountant | — | Scatec ASA | Western Cape/Cape Town | — |
| 985 | **Keneilwe Moloko** | Moloko / Keneilwe | NEEDS_VERIFICATION | Chartered Accountant | — | Balwin Properties Limited | — | — |
| 986 | **Pumla Molope** | Molope / Pumla | CONFIRMED | CA(SA) | SAICA | African Women Chartered Accountants (AWCA) | — | — |
| 987 | **Katlego Molopyane** | Molopyane / Katlego | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Gauteng/City of Johannesburg | https://www.linkedin.com/in/katlego-molopyane-ca-sa-b6a87b59/ |
| 988 | **Chrissie Moloseni** | Moloseni / Chrissie | CONFIRMED | CGMA | CIMA | PPC | Gauteng/Johannesburg | https://www.linkedin.com/in/chrissie-moloseni-bacc-mba-cgma-35787746/ |
| 989 | **Lazola Momo** | Momo / Lazola | CONFIRMED | CA(SA) | SAICA | City of Cape Town (per LinkedIn experience; role and dates not shown) | Western Cape/Cape Town | — |
| 990 | **Kgaogelo Montjane** | Montjane / Kgaogelo | RESEARCH_HOLD | — | — | — | Western Cape/Western Cape candidate pool | https://za.linkedin.com/in/kgaogelo-montjane-373050186 |
| 991 | **Jared Moodley** | Moodley / Jared | HIGH_CONFIDENCE | CA(SA) | SAICA | Deloitte | — | — |
| 992 | **Jared Moodley** | Moodley / Jared | CONFIRMED | CA(SA) | SAICA | Deloitte Africa | — | — |
| 993 | **Louise Moodley** | Moodley / Louise | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Gauteng/Roodepoort | https://www.linkedin.com/in/louise-moodley-0014283b1/ |
| 994 | **Sameshan Yanasegran Moodley** | Moodley / Sameshan Yanasegran | CONFIRMED | CA(SA) | SAICA | SA Corporate Real Estate Limited | — | — |
| 995 | **Mpho Mookapele** | Mookapele / Mpho | CONFIRMED | CA(SA) | SAICA | Energy and Water Sector Education and Training Authority (EWSETA) | — | — |
| 996 | **Nicolene Moolman** | Moolman / Nicolene | CONFIRMED | CA(SA) | SAICA | Growthpoint Properties | Western Cape location NOT confirmed — X-ray query association only | — |
| 997 | **Nicolene Moolman** | Moolman / Nicolene | CONFIRMED | CA(SA) | SAICA | Growthpoint Properties | Western Cape/Western Cape | — |
| 998 | **Karli Moore** | Moore / Karli | CONFIRMED | CA(SA) | SAICA | Afrimat | Western Cape/Cape Town | https://www.linkedin.com/in/karli-moore-ca-sa-24349b204/ |
| 999 | **Zaakirah Moosa** | Moosa / Zaakirah | CONFIRMED | CA(SA) | SAICA | Nordex Energy South Africa | Western Cape/Cape Town | — |
| 1000 | **Zaakirah Moosa** | Moosa / Zaakirah | CONFIRMED | CA(SA) | SAICA | Nordex Energy South Africa | Western Cape/Cape Town | — |
| 1001 | **Mmakgotso Mopeli** | Mopeli / Mmakgotso | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Stellenbosch | https://www.linkedin.com/in/mmakgotso-mopeli-140137223/ |
| 1002 | **Nompi Morajane** | Morajane / Nompi | CONFIRMED | CA(SA) | SAICA | PPC | Gauteng/Johannesburg | https://www.linkedin.com/in/nompi-morajane-ca-sa-778a34b5/ |
| 1003 | **Alpesh Morar** | Morar / Alpesh | CONFIRMED | CA(SA) | SAICA | Erakis Investments | Western Cape/Cape Town | — |
| 1004 | **Alpesh Morar** | Morar / Alpesh | CONFIRMED | CA(SA) | SAICA | Erakis Investments | Western Cape/Cape Town | — |
| 1005 | **Nokuzola Morata** | Morata / Nokuzola | HIGH_CONFIDENCE | CA(SA) | SAICA | Knight Piésold (Pty) Ltd | — | — |
| 1006 | **Nokuzola Morata** | Morata / Nokuzola | CONFIRMED | CA(SA) | SAICA | Knight Piésold (Pty) Ltd | — | — |
| 1007 | **Vernon Morgan** | Morgan / Vernon | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/vernon-morgan-financial-coach |
| 1008 | **Mieshka Morris** | Morris / Mieshka | RESEARCH_HOLD | — | — | Momentum Corporate | Western Cape | https://za.linkedin.com/in/mieshka-morris-55527055 |
| 1009 | **Grant Morrison** | Morrison / Grant | CONFIRMED | CA(SA) | SAICA | Climate finance organisation — confirm | Cape Town – confirm | — |
| 1010 | **Grant Morrison** | Morrison / Grant | CONFIRMED | CA(SA) | SAICA | Climate finance organisation — confirm | Western Cape/Cape Town | — |
| 1011 | **Tebogo Moseamedi** | Moseamedi / Tebogo | CONFIRMED | CA(SA) | SAICA | TUHF Limited | — | — |
| 1012 | **Carla Mostert** | Mostert / Carla | CONFIRMED | ACMA, CGMA | CIMA | Atlantis Foods Group | Western Cape/Cape Town | https://za.linkedin.com/in/carla-mostert-acma-cgma-8695a9156 |
| 1013 | **Hanneke Mostert** | Mostert / Hanneke | CONFIRMED | CA(SA) | SAICA | Noble Property Fund | Tyger Valley office, Western Cape | — |
| 1014 | **Hanneke Mostert** | Mostert / Hanneke | CONFIRMED | CA(SA) | SAICA | Noble Property Fund | Western Cape/Western Cape | — |
| 1015 | **Hanno Mostert** | Mostert / Hanno | NEEDS_VERIFICATION | Chartered Accountant | — | Sustainable Power Solutions (former) | Western Cape/Cape Town | — |
| 1016 | **Matselane Motaung** | Motaung / Matselane | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/matselane-motaung-7780a215/ |
| 1017 | **Vincent Motholo** | Motholo / Vincent | CONFIRMED | CA(SA) | SAICA | University of Cape Town | Western Cape/Cape Town | https://www.linkedin.com/in/vincent-motholo-ca-sa-842b7613/ |
| 1018 | **Vincent Motholo** | Motholo / Vincent | CONFIRMED | CA(SA) | SAICA | University of Cape Town | Western Cape/Cape Town | — |
| 1019 | **Thabang Mothuki** | Mothuki / Thabang | FINANCE_ROLE_CONFIRMED | — | — | Ardagh Glass Packaging SA | Gauteng/City of Johannesburg | https://www.linkedin.com/in/thabang-mothuki-8ab4a1a4/ |
| 1020 | **Thokozani Motloung** | Motloung / Thokozani | CONFIRMED | PA(SA) | SAIPA | Unitrans | Western Cape/Cape Town | https://za.linkedin.com/in/thokozani-motloung-64147923 |
| 1021 | **Victor Motsamai Madziwa** | Motsamai Madziwa / Victor | FINANCE_ROLE_CONFIRMED | — | — | Tronox Namakwa Sands | South Africa | https://www.linkedin.com/in/victor-madziwa-98152a1b/ |
| 1022 | **Sinazo Motsema** | Motsema / Sinazo | CONFIRMED | CA(SA) | SAICA | Current employer unconfirmed | Cape Town – confirm | — |
| 1023 | **Sinazo Motsema** | Motsema / Sinazo | CONFIRMED | CA(SA) | SAICA | Current employer unconfirmed | Western Cape/Cape Town | — |
| 1024 | **Nathaly Mouton** | Mouton / Nathaly | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/nathaly-mouton-424a5952/ |
| 1025 | **virginia mouton** | mouton / virginia | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Western Cape/City of Cape Town | https://www.linkedin.com/in/virginia-mouton-33097271/ |
| 1026 | **Leevas Moyana** | Moyana / Leevas | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/City of Cape Town | https://www.linkedin.com/in/leevas-moyana-49343059/ |
| 1027 | **Panashe Moyo** | Moyo / Panashe | CONFIRMED | CA(SA) | SAICA | Nala Renewables | — | — |
| 1028 | **Sinazo Mpama** | Mpama / Sinazo | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Gauteng/City of Johannesburg | https://www.linkedin.com/in/sinazo-mpama-42bb4b109/ |
| 1029 | **Vusi Mpofu** | Mpofu / Vusi | CONFIRMED | AGA(SA) | SAICA | Nedbank | — | — |
| 1030 | **Mimosa Mputa** | Mputa / Mimosa | CONFIRMED | AGA(SA) | SAICA | Mukuru | Western Cape/Cape Town | https://za.linkedin.com/in/mimosa-mputa-aga-sa-50489a211 |
| 1031 | **Owethu Msabane** | Msabane / Owethu | FINANCE_ROLE_CONFIRMED | — | — | Ardagh Glass Packaging SA | Germiston Metropolitan Area | https://www.linkedin.com/in/owethu-msabane-b903a184/ |
| 1032 | **Zine Mshengu** | Mshengu / Zine | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 1033 | **Donna Msiska** | Msiska / Donna | CONFIRMED | CA(SA) | SAICA | WBHO (Wilson Bayly Holmes-Ovcon) | — | — |
| 1034 | **Ayanda Msomi** | Msomi / Ayanda | CONFIRMED | CA(SA) | SAICA | Concor | Gauteng/City of Johannesburg | https://www.linkedin.com/in/ayanda-msomi-2446b615a/ |
| 1035 | **Zandile Mtandeki** | Mtandeki / Zandile | CONFIRMED | PA(SA), CAIA | SAIPA | RealFin Fund Services | Western Cape/Cape Town | https://za.linkedin.com/in/zandilemtandeki |
| 1036 | **Chwayita Mtebele** | Mtebele / Chwayita | CONFIRMED | CA(SA) | SAICA | Financial Sector Conduct Authority (FSCA) | — | — |
| 1037 | **Sifiso Mthethwa** | Mthethwa / Sifiso | FINANCE_ROLE_CONFIRMED | — | — | PPC | Gauteng/City of Johannesburg | https://www.linkedin.com/in/sifiso-mthethwa-005024b4/ |
| 1038 | **Siyabonga Mthethwa** | Mthethwa / Siyabonga | CONFIRMED | AGA(SA) | SAICA | Tronox Namakwa Sands | KwaZulu-Natal/KwaZulu-Natal | https://www.linkedin.com/in/siyabonga-mthethwa-aga-sa-152923194/ |
| 1039 | **Sivuyisiwe Mtshaka** | Mtshaka / Sivuyisiwe | FINANCE_ROLE_CONFIRMED | — | — | I&J | Western Cape/City of Cape Town | https://www.linkedin.com/in/sivuyisiwe-mtshaka-361ba817b/ |
| 1040 | **Noluthando Mtshali** | Mtshali / Noluthando | NEEDS_VERIFICATION | Chartered Accountant | — | Pele Energy Group | Location to verify | — |
| 1041 | **Noluthando Mtshali** | Mtshali / Noluthando | CONFIRMED | CA(SA) | SAICA | Pele Energy Group | Western Cape | — |
| 1042 | **Valentine Mtshali** | Mtshali / Valentine | CONFIRMED | CA(SA) | SAICA | Unconfirmed | — | — |
| 1043 | **Liso Mtshambela** | Mtshambela / Liso | RESEARCH_HOLD | — | — | Novus Holdings | Western Cape | https://za.linkedin.com/in/liso-mtshambela-80446b121 |
| 1044 | **precious mulaudzi** | mulaudzi / precious | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/precious-mulaudzi-a5b9a5129/ |
| 1045 | **Marilize Muller** | Muller / Marilize | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/marilize-muller-59b0a66a |
| 1046 | **Cecil Mulligan** | Mulligan / Cecil | CONFIRMED | CA(SA) | SAICA | Current employer verify | Western Cape location NOT confirmed — X-ray query association only | — |
| 1047 | **Cecil Mulligan** | Mulligan / Cecil | CONFIRMED | CA(SA) | SAICA | Current employer verify | Western Cape/Western Cape | — |
| 1048 | **Michelle Mulligan** | Mulligan / Michelle | NEEDS_VERIFICATION | Chartered Accountant | — | PERI South Africa | Western Cape/Cape Town | — |
| 1049 | **Khanyisile Mumakwe** | Mumakwe / Khanyisile | FINANCE_ROLE_CONFIRMED | — | — | Macsteel | Gauteng/City of Johannesburg | https://www.linkedin.com/in/khanyisile-mumakwe-680b95120/ |
| 1050 | **Ellaine Mundie - Michael** | Mundie - Michael / Ellaine | FINANCE_ROLE_CONFIRMED | — | — | DSV | South Africa | https://www.linkedin.com/in/ellaine-mundie-michael-b205b343/ |
| 1051 | **Jody Munnik** | Munnik / Jody | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/Cape Town | https://www.linkedin.com/in/jody-munnik-9b5215219/ |
| 1052 | **Rishka Mustapha Higgs** | Mustapha Higgs / Rishka | CONFIRMED | CA(SA) | SAICA | Anthem | Western Cape/Cape Town | — |
| 1053 | **Tariro Mutizwa** | Mutizwa / Tariro | CONFIRMED | ACMA, CGMA | CIMA | AICPA & CIMA (CIMA Africa) | — | — |
| 1054 | **shudufhadzo mutshutshu** | mutshutshu / shudufhadzo | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | Gauteng/City of Johannesburg | https://www.linkedin.com/in/shudufhadzo-mutshutshu-58566a46/ |
| 1055 | **Nothando Muziki** | Muziki / Nothando | CONFIRMED | AGA(SA) | SAICA | Integral Accountants | Western Cape/Cape Town | https://za.linkedin.com/in/nothando-muziki-aga-sa-b85538153 |
| 1056 | **Lubabalo Mxhasa** | Mxhasa / Lubabalo | CONFIRMED | PA(SA) | SAIPA | Apex/Maitland background | Western Cape | https://za.linkedin.com/in/lubabalo-mxhasa-39694163 |
| 1057 | **Sandisiwe Myekwa nee Booi** | Myekwa nee Booi / Sandisiwe | FINANCE_ROLE_CONFIRMED | — | — | Premier Fishing & Brands | Western Cape/Cape Town | https://www.linkedin.com/in/sandisiwe-myekwa-nee-booi-aga-sa-034740211/ |
| 1058 | **Pilot Mzimba** | Mzimba / Pilot | FINANCE_ROLE_CONFIRMED | — | — | Interwaste | Gauteng/Johannesburg | https://www.linkedin.com/in/pilot-mzimba-91a7051b/ |
| 1059 | **Sokhuthu Mziwoluntu** | Mziwoluntu / Sokhuthu | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/Mossel Bay | https://www.linkedin.com/in/sokhuthu-mziwoluntu-01468453/ |
| 1060 | **Shaun Mzuvukile Gxekwa** | Mzuvukile Gxekwa / Shaun | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/shaun-mzuvukile-gxekwa-538bb213a |
| 1061 | **Megan N.** | N. / Megan | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | Gauteng/City of Johannesburg | https://www.linkedin.com/in/megan-n-83b663138/ |
| 1062 | **Danielle Nagar** | Nagar / Danielle | CONFIRMED | CA(SA) | SAICA | Current employer unconfirmed | Western Cape/Cape Town | — |
| 1063 | **Danielle Nagar** | Nagar / Danielle | CONFIRMED | CA(SA) | SAICA | Current employer unconfirmed | Western Cape/Cape Town | — |
| 1064 | **Ritesh Nagar** | Nagar / Ritesh | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/City of Johannesburg | https://www.linkedin.com/in/ritesh-nagar-22866b45/ |
| 1065 | **Charmaine Nago** | Nago / Charmaine | RESEARCH_HOLD | — | — | — | Western Cape/Cape Town candidate pool | https://za.linkedin.com/in/charmaine-nago-b077113b |
| 1066 | **Sayuri Naicker** | Naicker / Sayuri | CONFIRMED | CA(SA) | SAICA | Calgro M3 | Location unconfirmed; company leadership nationally based | — |
| 1067 | **Sayuri Naicker** | Naicker / Sayuri | CONFIRMED | CA(SA) | SAICA | Calgro M3 | Western Cape | — |
| 1068 | **Thiru Naicker** | Naicker / Thiru | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Western Cape/Western Cape | https://www.linkedin.com/in/thiru-naicker-ca-sa-16574024/ |
| 1069 | **Aneshree Naidoo** | Naidoo / Aneshree | CONFIRMED | CA(SA) | SAICA | Webber Wentzel | — | — |
| 1070 | **Eveshen Naidoo** | Naidoo / Eveshen | CONFIRMED | CA(SA) | SAICA | FPG Property Fund | Western Cape/Cape Town | — |
| 1071 | **Eveshen Naidoo** | Naidoo / Eveshen | CONFIRMED | CA(SA) | SAICA | FPG Property Fund | Western Cape/Cape Town | — |
| 1072 | **Kalnisha Naidoo** | Naidoo / Kalnisha | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Stellenbosch | https://www.linkedin.com/in/kalnisha-naidoo-965523101/ |
| 1073 | **Karmen Naidoo** | Naidoo / Karmen | NEEDS_VERIFICATION | Chartered Accountant | — | Current employer unconfirmed | Location to verify | — |
| 1074 | **Karmen Naidoo** | Naidoo / Karmen | CONFIRMED | CA(SA) | SAICA | Current employer unconfirmed | Western Cape | — |
| 1075 | **Kathie Naidoo** | Naidoo / Kathie | FINANCE_ROLE_CONFIRMED | — | — | Chryso Southern Africa | Gauteng/City of Johannesburg | https://www.linkedin.com/in/kathie-naidoo-30701997/ |
| 1076 | **Talisa Naidoo** | Naidoo / Talisa | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/talisa-naidoo-ca-sa-328533342/ |
| 1077 | **Thenashree Naidoo** | Naidoo / Thenashree | HIGH_CONFIDENCE | CA(SA) | SAICA | Durban ICC | KwaZulu-Natal/Durban | — |
| 1078 | **Ziyaad Nakidien** | Nakidien / Ziyaad | FINANCE_ROLE_CONFIRMED | — | — | Capespan South Africa | Western Cape/Western Cape | https://www.linkedin.com/in/ziyaad-nakidien-166b86170/ |
| 1079 | **Raj Nana** | Nana / Raj | CONFIRMED | CA(SA) | SAICA | Teraco (data centres) — CFO effective 1 Feb 2026 per CFO South Africa; formerly Attacq | — | — |
| 1080 | **Jabavu Nare** | Nare / Jabavu | CONFIRMED | ACMA, CGMA | CIMA | Pie in the Sky / Coimbra Bakery | Western Cape/Cape Town | https://za.linkedin.com/in/jabavu-nare-acma-cgma-52544850 |
| 1081 | **Caroline Narrainsamy(Pillay)** | Narrainsamy(Pillay) / Caroline | FINANCE_ROLE_CONFIRMED | — | — | Tronox Namakwa Sands | KwaZulu-Natal/KwaZulu-Natal | https://www.linkedin.com/in/caroline-narrainsamy-pillay-448271174/ |
| 1082 | **Amish Narrandes** | Narrandes / Amish | CONFIRMED | CA(SA) | SAICA | Futuregrowth Asset Management; NED Divercity Urban Property Group | — | — |
| 1083 | **Pranesh Narshi** | Narshi / Pranesh | FINANCE_ROLE_CONFIRMED | — | — | Interwaste | Western Cape/Cape Town | https://www.linkedin.com/in/pranesh-narshi-433b16365/ |
| 1084 | **Grant Nash** | Nash / Grant | CONFIRMED | CA(SA) | SAICA | Current employer unconfirmed | Cape Town – confirm | — |
| 1085 | **Grant Nash** | Nash / Grant | CONFIRMED | CA(SA) | SAICA | Current employer unconfirmed | Western Cape/Cape Town | — |
| 1086 | **Cindy Nasser** | Nasser / Cindy | CONFIRMED | CA(SA) | SAICA | Employer unconfirmed | Cape Town – confirm | — |
| 1087 | **Cindy Nasser** | Nasser / Cindy | CONFIRMED | CA(SA) | SAICA | Employer unconfirmed | Western Cape/Cape Town | — |
| 1088 | **Horstmann Natasha** | Natasha / Horstmann | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/horstmann-natasha-aa92a090/ |
| 1089 | **Michael Nathan** | Nathan / Michael | CONFIRMED | CA(SA) | SAICA | Java Capital | — | — |
| 1090 | **Theo Naude** | Naude / Theo | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/theo-naude-b36b847a |
| 1091 | **Wilhelm Nauta** | Nauta / Wilhelm | CONFIRMED | CA(SA) | SAICA | Hyprop Investments | — | — |
| 1092 | **Gugu Ncala** | Ncala / Gugu | FINANCE_ROLE_CONFIRMED | — | — | Concor | Gauteng/City of Johannesburg | https://www.linkedin.com/in/gugu-ncala-8955b374/ |
| 1093 | **Amahle Ndindi** | Ndindi / Amahle | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/amahle-ndindi-855541215/ |
| 1094 | **Busi Ndlovu** | Ndlovu / Busi | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/City of Cape Town | https://www.linkedin.com/in/busi-ndlovu-6b21b263/ |
| 1095 | **Netshia Nduvho** | Nduvho / Netshia | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Gauteng/Kempton Park | https://www.linkedin.com/in/netshia-nduvho-02547b293/ |
| 1096 | **Andiswa Ndwalane** | Ndwalane / Andiswa | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | South Africa | https://www.linkedin.com/in/andiswa-ndwalane-66492821a/ |
| 1097 | **Dean Neethling** | Neethling / Dean | CONFIRMED | CA(SA) | SAICA | Grupo Iberconsa | Western Cape/Cape Town | — |
| 1098 | **Dean Neethling** | Neethling / Dean | CONFIRMED | CA(SA) | SAICA | Grupo Iberconsa | Western Cape/Cape Town | — |
| 1099 | **JD Neill** | Neill / JD | CONFIRMED | CA(SA) | SAICA | Exim International Pty Ltd (first experience entry; title and dates not shown) | City of Cape Town, Western Cape | — |
| 1100 | **Anika Nel** | Nel / Anika | CONFIRMED | PA(SA) | SAIPA | Kallos Global | Western Cape | https://za.linkedin.com/in/anika-nel-20b364134 |
| 1101 | **Déhan Nel** | Nel / Déhan | FINANCE_ROLE_CONFIRMED | — | — | LANCEWOOD | Western Cape/George | https://www.linkedin.com/in/déhan-nel-ca-sa-b4b49920a/ |
| 1102 | **Kristen Nel** | Nel / Kristen | CONFIRMED | PA(SA) | SAIPA | Fynbos Accounting | Western Cape/Cape Town | https://za.linkedin.com/in/kristen-nel-professional-accountant-saipa-407058118 |
| 1103 | **Louis Nel** | Nel / Louis | FINANCE_ROLE_CONFIRMED | — | — | Tru-Cape Fruit Marketing | South Africa | https://www.linkedin.com/in/louis-nel-204935a6/ |
| 1104 | **Melisa Nel** | Nel / Melisa | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Western Cape/Cape Town | https://www.linkedin.com/in/melisa-nel-b73751239/ |
| 1105 | **Nastassja Nel** | Nel / Nastassja | CONFIRMED | AGA(SA) | SAICA | Schoemans Registered Auditors and Chartered Accountants | Western Cape/Cape Town | https://www.linkedin.com/in/nastassja-nel-71a15364/ |
| 1106 | **Wynand Nel** | Nel / Wynand | HIGH_CONFIDENCE | PA(SA) | SAIPA | JTC Group | Western Cape | — |
| 1107 | **Leonie Nell** | Nell / Leonie | FINANCE_ROLE_CONFIRMED | — | — | LANCEWOOD | Western Cape/George | https://www.linkedin.com/in/leonie-nell-412a12284/ |
| 1108 | **Wilhelm Nell** | Nell / Wilhelm | FINANCE_ROLE_CONFIRMED | — | — | Fair Cape Dairies | Western Cape/Durbanville | https://www.linkedin.com/in/wilhelm-nell-867aa0104/ |
| 1109 | **Karabo Neluheni** | Neluheni / Karabo | FINANCE_ROLE_CONFIRMED | — | — | EnviroServ | Gauteng/Johannesburg | https://www.linkedin.com/in/karabo-neluheni-ca-sa-26285529/ |
| 1110 | **Vhugala Nelwamondo** | Nelwamondo / Vhugala | CONFIRMED | ACMA, CGMA | CIMA | Auditor-General of South Africa | Western Cape/Cape Town | https://za.linkedin.com/in/vhugala-nelwamondo-acma-cgma-2b2bb7ba |
| 1111 | **Fulufhelo Stewart Nemaitoni** | Nemaitoni / Fulufhelo Stewart | CONFIRMED | CA(SA) | SAICA | Nedbank CIB | Western Cape/Cape Town | — |
| 1112 | **Linda Nene (FIIASA,CRMA,CCSA,CPrac(SA))** | Nene (FIIASA,CRMA,CCSA,CPrac(SA)) / Linda | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | South Africa | https://www.linkedin.com/in/linda-nene-fiiasa-crma-ccsa-cprac-sa-91911827/ |
| 1113 | **Alison Nesbitt** | Nesbitt / Alison | CONFIRMED | CA(SA) | SAICA | BuffVest | Western Cape/Cape Town | — |
| 1114 | **Alison Nesbitt** | Nesbitt / Alison | CONFIRMED | CA(SA) | SAICA | BuffVest | Western Cape/Cape Town | — |
| 1115 | **Aviwe Ngcawuzele** | Ngcawuzele / Aviwe | FINANCE_ROLE_CONFIRMED | — | — | I&J | Western Cape/City of Cape Town | https://www.linkedin.com/in/aviwe-ngcawuzele-1a25aa133/ |
| 1116 | **Qaqamba Ngcawuzele** | Ngcawuzele / Qaqamba | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/City of Cape Town | https://www.linkedin.com/in/qaqamba-ngcawuzele-151569146/ |
| 1117 | **Njabulo Ngcobo** | Ngcobo / Njabulo | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | Gauteng/City of Johannesburg | https://www.linkedin.com/in/njabulo-ngcobo/ |
| 1118 | **Kulani Ngobeni** | Ngobeni / Kulani | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Johannesburg Metropolitan Area | https://www.linkedin.com/in/kulani-ngobeni-503b7790/ |
| 1119 | **Lungelo Ngobese** | Ngobese / Lungelo | CONFIRMED | CA(SA) | SAICA | Unconfirmed | — | — |
| 1120 | **Mitterand Ngoy** | Ngoy / Mitterand | FINANCE_ROLE_CONFIRMED | — | — | Averda South Africa | Gauteng/Johannesburg | https://www.linkedin.com/in/mitterand-ngoy-66ba2828b/ |
| 1121 | **Lindokuhle Ngqobane** | Ngqobane / Lindokuhle | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/Western Cape | https://www.linkedin.com/in/lindokuhle-ngqobane-221782159/ |
| 1122 | **Thabang Ngwenya** | Ngwenya / Thabang | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | Gauteng/City of Johannesburg | https://www.linkedin.com/in/thabang-ngwenya-b80172101/ |
| 1123 | **Dorcas Nhlapho** | Nhlapho / Dorcas | HIGH_CONFIDENCE | CA(SA) | SAICA | BDO South Africa | Gauteng/Johannesburg | — |
| 1124 | **Nkosinathi Nicholus Mabuza** | Nicholus Mabuza / Nkosinathi | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/City of Johannesburg | https://www.linkedin.com/in/nkosinathi-nicholus-mabuza-a6095266/ |
| 1125 | **Rob Nicolella** | Nicolella / Rob | NEEDS_VERIFICATION | Chartered Accountant | — | Hosken Consolidated Investments (HCI) - current role unconfirmed | Western Cape/Cape Town | — |
| 1126 | **Brendon van Niekerk** | Niekerk / Brendon van | NEEDS_VERIFICATION | Chartered Accountant | — | Red Rocket South Africa | Western Cape/Cape Town | — |
| 1127 | **Francois van Niekerk** | Niekerk / Francois van | CONFIRMED | CA(SA) | SAICA | Origin Property Holdings | Cape Town / Bellville background | — |
| 1128 | **Tanya van Niekerk** | Niekerk / Tanya van | CONFIRMED | CA(SA) | SAICA | Natural Selection Travel | Western Cape/Somerset West | — |
| 1129 | **Michele Nieuwoudt** | Nieuwoudt / Michele | RESEARCH_HOLD | — | — | PNA / former Management Accountant | Western Cape | https://za.linkedin.com/in/michele-nieuwoudt-96074259 |
| 1130 | **Markus NIEUWOUDT CMILT, MCTP(SA), Compliance Practitioner** | NIEUWOUDT CMILT, MCTP(SA), Compliance Practitioner / Markus | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/Johannesburg | https://www.linkedin.com/in/markus-nieuwoudt-cmilt-mctp-sa-compliance-practitioner-625798321/ |
| 1131 | **Relebohile Nkojoana** | Nkojoana / Relebohile | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Johannesburg Metropolitan Area | https://www.linkedin.com/in/relebohile/ |
| 1132 | **Ande Nkontso** | Nkontso / Ande | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/ande-nkontso-606504196/ |
| 1133 | **Luyanda Nkonyane** | Nkonyane / Luyanda | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Gauteng/Gauteng | https://www.linkedin.com/in/luyanda-nkonyane-ba648185/ |
| 1134 | **Absay Nkosi** | Nkosi / Absay | FINANCE_ROLE_CONFIRMED | — | — | Concor | Gauteng/City of Johannesburg | https://www.linkedin.com/in/absay-nkosi-b47b3511a/ |
| 1135 | **Delani Nkosi** | Nkosi / Delani | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/delani-nkosi-ab502676/ |
| 1136 | **Sanele Nkosi** | Nkosi / Sanele | CONFIRMED | CA(SA) | SAICA | BDO South Africa | KwaZulu-Natal/Durban | — |
| 1137 | **Dianne Noake** | Noake / Dianne | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/Benoni | https://www.linkedin.com/in/dianne-noake-b153669a/ |
| 1138 | **Sanele Nodume** | Nodume / Sanele | CONFIRMED | CA(SA) | SAICA | Astron Energy | Western Cape/Cape Town | https://www.linkedin.com/in/sanele-nodume-ca-sa-36034622b/ |
| 1139 | **Sampras Noel Kaweesi** | Noel Kaweesi / Sampras | CONFIRMED | FCCA | ACCA | Sexual & Reproductive Justice Coalition | Western Cape/Cape Town | https://za.linkedin.com/in/sampras-noel-kaweesi-msci-fcca-a13a6b35 |
| 1140 | **Bukeka Nohashe** | Nohashe / Bukeka | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/bukeka-nohashe-5950866b |
| 1141 | **Nolwazi Nokuthula Nkabinde** | Nokuthula Nkabinde / Nolwazi | FINANCE_ROLE_CONFIRMED | — | — | DGB | Gauteng/City of Johannesburg | https://www.linkedin.com/in/nolwazi-nokuthula-nkabinde-9035251a3/ |
| 1142 | **Msutwana NOLUVO** | NOLUVO / Msutwana | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | South Africa | https://www.linkedin.com/in/msutwana-noluvo-0750a263/ |
| 1143 | **Buhle Hanise Nomabunga** | Nomabunga / Buhle | CONFIRMED | CA(SA) | SAICA | BAIC (South Africa) | — | — |
| 1144 | **Sithole Nonsikelelo** | Nonsikelelo / Sithole | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/City of Cape Town | https://www.linkedin.com/in/sithole-nonsikelelo-1b881a54/ |
| 1145 | **Hannes Nortman** | Nortman / Hannes | CONFIRMED | AGA(SA) | SAICA | Golden Hour Experiences | Western Cape/Cape Town | https://za.linkedin.com/in/hannes-nortman-aga-sa-683b202b |
| 1146 | **Nontsingiselo Notununu** | Notununu / Nontsingiselo | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/nontsingiselo-notununu-cima-dip-ma-b74528b9 |
| 1147 | **Busisiwe Ntombifikile Mkhize** | Ntombifikile Mkhize / Busisiwe | FINANCE_ROLE_CONFIRMED | — | — | Macsteel | KwaZulu-Natal/Durban | https://www.linkedin.com/in/busisiwe-ntombifikile-mkhize-92106646/ |
| 1148 | **faith ntshingila** | ntshingila / faith | FINANCE_ROLE_CONFIRMED | — | — | DGB | Gauteng/City of Johannesburg | https://www.linkedin.com/in/faith-ntshingila-642900125/ |
| 1149 | **Anele Ntsinde** | Ntsinde / Anele | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/City of Johannesburg | https://www.linkedin.com/in/anele-ntsinde-9b6a51a3/ |
| 1150 | **Zizipho Nyanga** | Nyanga / Zizipho | CONFIRMED | CA(SA) | SAICA | Masisizane Fund (Old Mutual) | — | — |
| 1151 | **Jabulile Nyathi** | Nyathi / Jabulile | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 1152 | **Linda Nyirenda (ACMA** | Nyirenda (ACMA / Linda | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | Gauteng/City of Johannesburg | https://www.linkedin.com/in/linda-nyirenda-acma-cgma-5ab7ba15a/ |
| 1153 | **Phila Nyoka** | Nyoka / Phila | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Gauteng/Gauteng | https://www.linkedin.com/in/phila-nyoka-88a416213/ |
| 1154 | **Danielle O'Brien** | O'Brien / Danielle | CONFIRMED | PA(SA) | SAIPA | SS&C Technologies | Western Cape/Cape Town | https://za.linkedin.com/in/danielle-o-brien-pa-sa-897227123 |
| 1155 | **Desire October** | October / Desire | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/desire-october-517967181/ |
| 1156 | **Henk Odendaal** | Odendaal / Henk | FINANCE_ROLE_CONFIRMED | — | — | Fruitways | Western Cape/City of Cape Town | https://www.linkedin.com/in/henk-odendaal-ca-sa-92b86887/ |
| 1157 | **Karen Odendaal** | Odendaal / Karen | NEEDS_VERIFICATION | Chartered Accountant | — | Magneto Renewable Energy | Location to verify | — |
| 1158 | **Karen Odendaal** | Odendaal / Karen | CONFIRMED | CA(SA) | SAICA | Magneto Renewable Energy | Western Cape | — |
| 1159 | **Lara Odendaal** | Odendaal / Lara | CONFIRMED | PA(SA) | SAIPA | Creatori Health | Western Cape/Stellenbosch | https://za.linkedin.com/in/lara-odendaal-4053b21a4 |
| 1160 | **Liezel Odendaal** | Odendaal / Liezel | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/Boksburg | https://www.linkedin.com/in/liezel-odendaal-571314225/ |
| 1161 | **Sam Odendaal** | Odendaal / Sam | NEEDS_VERIFICATION | Chartered Accountant, CA(SA) | SAICA | Raubex Group | — | — |
| 1162 | **Crystal Okkers** | Okkers / Crystal | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/crystal-okkers-71482174/ |
| 1163 | **Samantha Olifant** | Olifant / Samantha | FINANCE_ROLE_CONFIRMED | — | — | Interwaste | South Africa | https://www.linkedin.com/in/samantha-olifant-5b2a34b5/ |
| 1164 | **Alma Olivier** | Olivier / Alma | CONFIRMED | CA(SA) | SAICA | Tenthouse Structures | Western Cape/Cape Town | — |
| 1165 | **Alma Olivier** | Olivier / Alma | CONFIRMED | CA(SA) | SAICA | Tenthouse Structures | Western Cape/Cape Town | — |
| 1166 | **André Olivier** | Olivier / André | CONFIRMED | AGA(SA) | SAICA | Lekkewaan | Western Cape/Wellington | https://za.linkedin.com/in/andr%C3%A9-olivier-aga-sa-b5a573131 |
| 1167 | **Eugene Olivier** | Olivier / Eugene | CONFIRMED | AGA(SA) | SAICA | Icon Oncology | Western Cape/Durbanville | https://za.linkedin.com/in/eugene-olivier-21a42b276 |
| 1168 | **Jana Olivier** | Olivier / Jana | NEEDS_VERIFICATION | Chartered Accountant | — | VDMV Property Group | Western Cape/Cape Town | — |
| 1169 | **Llewellyn Olivier** | Olivier / Llewellyn | CONFIRMED | CA(SA) | SAICA | Employer verify | Western Cape location NOT confirmed — X-ray query association only | — |
| 1170 | **Llewellyn Olivier** | Olivier / Llewellyn | CONFIRMED | CA(SA) | SAICA | Employer verify | Western Cape/Western Cape | — |
| 1171 | **Raees Omar** | Omar / Raees | CONFIRMED | CA(SA) | SAICA | Oasis Crescent | Western Cape/Cape Town | — |
| 1172 | **Raees Omar** | Omar / Raees | CONFIRMED | CA(SA) | SAICA | Oasis Crescent | Western Cape/Cape Town | — |
| 1173 | **Jochelle Oosthuizen** | Oosthuizen / Jochelle | CONFIRMED | PA(SA), TP(SA) | SAIPA | LPH Chartered Accountants | Western Cape/Stellenbosch | https://za.linkedin.com/in/jochelle-oosthuizen-a408a59a |
| 1174 | **Nelia Oosthuizen** | Oosthuizen / Nelia | FINANCE_ROLE_CONFIRMED | — | — | Mpact | KwaZulu-Natal/KwaZulu-Natal | https://www.linkedin.com/in/nelia-oosthuizen-6a532841/ |
| 1175 | **Quintin Oosthuizen** | Oosthuizen / Quintin | CONFIRMED | CA(SA) | SAICA | Haw & Inglis | Western Cape/City of Cape Town | — |
| 1176 | **Jonti Osher** | Osher / Jonti | CONFIRMED | CA(SA) | SAICA | Westbrooke Alternative Asset Management | South Africa | — |
| 1177 | **Rayhaan Osman** | Osman / Rayhaan | CONFIRMED | FCCA | ACCA | Old Mutual Wealth | Western Cape/Cape Town | https://za.linkedin.com/in/rayhaan-osman-172a07101 |
| 1178 | **Beryl Ownhouse** | Ownhouse / Beryl | FINANCE_ROLE_CONFIRMED | — | — | PPC | Eastern Cape/Port Elizabeth | https://www.linkedin.com/in/beryl-ownhouse-944436341/ |
| 1179 | **Misheck P Jena** | P Jena / Misheck | CONFIRMED | PA(SA) | SAIPA | Not publicly confirmed | Western Cape/Cape Town | https://za.linkedin.com/in/misheck-p-jena-pa-sa-47278a150 |
| 1180 | **Mpho P.** | P. / Mpho | NEEDS_VERIFICATION | Chartered Accountant | — | Power & Renewables Finance | Cape Town – confirm | — |
| 1181 | **Mpho P.** | P. / Mpho | CONFIRMED | CA(SA) | SAICA | Power & Renewables Finance | Western Cape/Cape Town | — |
| 1182 | **Shalin P.** | P. / Shalin | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Johannesburg Metropolitan Area | https://www.linkedin.com/in/shalinpatel-/ |
| 1183 | **Velashnie Padayachee** | Padayachee / Velashnie | FINANCE_ROLE_CONFIRMED | — | — | Chryso Southern Africa | South Africa | https://www.linkedin.com/in/velashnie-padayachee-aa569b86/ |
| 1184 | **Ramon Padayachi** | Padayachi / Ramon | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/Cape Town | https://www.linkedin.com/in/ramon-padayachi-64b07a10/ |
| 1185 | **Karlien Panter** | Panter / Karlien | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Mpumalanga/Nelspruit | https://www.linkedin.com/in/karlien-panter-55bb46117/ |
| 1186 | **Emma Pardoe** | Pardoe / Emma | CONFIRMED | CA(SA) | SAICA | Emma Pardoe Chartered Accountants (SA) | Western Cape/Somerset West | https://www.linkedin.com/in/emmapardoe/ |
| 1187 | **Junaid Parker** | Parker / Junaid | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/junaid-parker-b67032135/ |
| 1188 | **Rameez Parker** | Parker / Rameez | CONFIRMED | CA(SA) | SAICA | Old Mutual Property | Western Cape/Cape Town | — |
| 1189 | **Rameez Parker** | Parker / Rameez | CONFIRMED | CA(SA) | SAICA | Old Mutual Property | Western Cape/Cape Town | — |
| 1190 | **Ridwana Parker** | Parker / Ridwana | CONFIRMED | AGA(SA) | SAICA | Raft Consulting | Western Cape/Cape Town | https://za.linkedin.com/in/ridwana-parker-aga-sa |
| 1191 | **Tasneem Parker** | Parker / Tasneem | NEEDS_VERIFICATION | Chartered Accountant | — | Scatec ASA | Western Cape/Cape Town | — |
| 1192 | **Sylwia Parzuchowski** | Parzuchowski / Sylwia | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/sylwia-parzuchowski-24b69b80/ |
| 1193 | **Anisah Patel** | Patel / Anisah | CONFIRMED | CA(SA) | SAICA | Own practice (Vereeniging) | Gauteng/Vereeniging | — |
| 1194 | **Safiyah Patel** | Patel / Safiyah | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Port Elizabeth Metropolitan Area | https://www.linkedin.com/in/safiyah-patel-575910193/ |
| 1195 | **Tierney Paul** | Paul / Tierney | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/tierney-paul-3974b1152/ |
| 1196 | **Mulalo Peaceman Mashamba** | Peaceman Mashamba / Mulalo | CONFIRMED | ACCA | ACCA | Infra Impact Investment Managers | Western Cape/Cape Town | https://za.linkedin.com/in/mulalo-peaceman-mashamba-acca-17015142 |
| 1197 | **Mellissa Pearce (née Ryder)** | Pearce (née Ryder) / Mellissa | FINANCE_ROLE_CONFIRMED | — | — | Cape Herb & Spice | Western Cape/Cape Town | https://www.linkedin.com/in/mellissa-pearce-nèe-ryder-88123b68/ |
| 1198 | **Crystelle Peense** | Peense / Crystelle | RESEARCH_HOLD | — | — | Commissions | Western Cape | https://za.linkedin.com/in/crystelle-peense |
| 1199 | **Ross Pennell** | Pennell / Ross | CONFIRMED | FCCA | ACCA | Advent Wealth | Western Cape/Cape Town | https://za.linkedin.com/in/rosspennell |
| 1200 | **Brett Penney** | Penney / Brett | CONFIRMED | CA(SA) | SAICA | Sika South Africa | KwaZulu-Natal/eThekwini | https://za.linkedin.com/in/brett-penney-7821aa10a |
| 1201 | **Bulali Pepeteka** | Pepeteka / Bulali | CONFIRMED | PA(SA) | SAIPA | Klearium | Western Cape/Cape Town | https://za.linkedin.com/in/bulalipepeteka |
| 1202 | **Jaime Perestrelo** | Perestrelo / Jaime | CONFIRMED | CA(SA) | SAICA | SOLA Group | Western Cape location NOT confirmed — X-ray query association only | — |
| 1203 | **Jaime Perestrelo** | Perestrelo / Jaime | CONFIRMED | CA(SA) | SAICA | SOLA Group | Western Cape/Western Cape | — |
| 1204 | **Richard Perks** | Perks / Richard | CONFIRMED | CA(SA) | SAICA | HEMCA / group finance | Western Cape/Cape Town | — |
| 1205 | **Richard Perks** | Perks / Richard | CONFIRMED | CA(SA) | SAICA | HEMCA / group finance | Western Cape/Cape Town | — |
| 1206 | **Matthew Peterson** | Peterson / Matthew | CONFIRMED | CA(SA) | SAICA | Questco (Pty) Ltd | — | — |
| 1207 | **Jonathan Petley** | Petley / Jonathan | FINANCE_ROLE_CONFIRMED | — | — | Betko Fresh Produce | Western Cape/Somerset West | https://www.linkedin.com/in/jonathan-petley-671363a3/ |
| 1208 | **Kefiloe Petunia Mashinini** | Petunia Mashinini / Kefiloe | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Gauteng/City of Johannesburg | https://www.linkedin.com/in/kefie-mashinini-b8336023/ |
| 1209 | **Shaun Peypers** | Peypers / Shaun | FINANCE_ROLE_CONFIRMED | — | — | Cape Herb & Spice | Western Cape/Cape Town | https://www.linkedin.com/in/shaun-peypers-0200a564/ |
| 1210 | **BRENDA PHASHA** | PHASHA / BRENDA | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Johannesburg Metropolitan Area | https://www.linkedin.com/in/brenda-phasha-44bba61a1/ |
| 1211 | **Lunga Phewa** | Phewa / Lunga | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Gauteng/City of Johannesburg | https://www.linkedin.com/in/lunga-phewa-36a6839a/ |
| 1212 | **JD Pienaar** | Pienaar / JD | FINANCE_ROLE_CONFIRMED | — | — | Kaap Agri / Agrimark | Western Cape/City of Cape Town | https://www.linkedin.com/in/jd-pienaar-9a5943b8/ |
| 1213 | **Monique Pienaar (neé du Toit)** | Pienaar (neé du Toit) / Monique | FINANCE_ROLE_CONFIRMED | — | — | Overberg Agri | Western Cape/Hermanus | https://www.linkedin.com/in/monique-pienaar-neé-du-toit-90875b110/ |
| 1214 | **Adrian Pierce** | Pierce / Adrian | CONFIRMED | CA(SA) | SAICA | FPT Group | Western Cape location NOT confirmed — X-ray query association only | — |
| 1215 | **Adrian Pierce** | Pierce / Adrian | CONFIRMED | CA(SA) | SAICA | FPT Group | Western Cape/Western Cape | — |
| 1216 | **Juan Pierre van der Westhuizen** | Pierre van der Westhuizen / Juan | FINANCE_ROLE_CONFIRMED | — | — | Excellent Meat Group | Western Cape/Western Cape | https://za.linkedin.com/in/juan-pierre-van-der-westhuizen-784834215 |
| 1217 | **Jaco Pieters** | Pieters / Jaco | ARTICLES_CONFIRMED_DESIGNATION_UNVERIFIED | — | — | Footgear | Western Cape | — |
| 1218 | **Esther Pieterse** | Pieterse / Esther | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 1219 | **Miguel Pieterse** | Pieterse / Miguel | CONFIRMED | PA(SA) | SAIPA | Infinity Power | Western Cape/Cape Town | https://za.linkedin.com/in/miguelpieterse |
| 1220 | **Andre Pillay** | Pillay / Andre | CONFIRMED | CA(SA) | SAICA | Legaro Property Development | Western Cape location NOT confirmed — X-ray query association only | — |
| 1221 | **Andre Pillay** | Pillay / Andre | CONFIRMED | CA(SA) | SAICA | Legaro Property Development | Western Cape/Western Cape | — |
| 1222 | **Ashton Pillay** | Pillay / Ashton | CONFIRMED | AGA(SA) | SAICA | Integrity360 South Africa | Western Cape/Cape Town | https://za.linkedin.com/in/ashton-pillay-aga-sa-aa777332 |
| 1223 | **Clinton Pillay** | Pillay / Clinton | NEEDS_VERIFICATION | Chartered Accountant | — | Attacq Limited | Location to verify | — |
| 1224 | **Diancha Pillay** | Pillay / Diancha | CONFIRMED | CA(SA) | SAICA | Finance executive – employer verify | Western Cape location NOT confirmed — X-ray query association only | — |
| 1225 | **Diancha Pillay** | Pillay / Diancha | CONFIRMED | CA(SA) | SAICA | Finance executive – employer verify | Western Cape/Western Cape | — |
| 1226 | **Samiran Pillay** | Pillay / Samiran | CONFIRMED | CA(SA) | SAICA | STADIO Holdings | — | — |
| 1227 | **steven pillay** | pillay / steven | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/steven-pillay-0a584230/ |
| 1228 | **Youlanda Pillay** | Pillay / Youlanda | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/youlanda-pillay-3888a644/ |
| 1229 | **Kershnee Pillay Reddy** | Pillay Reddy / Kershnee | CONFIRMED | CA(SA) | SAICA | PPC | Gauteng/City of Johannesburg | https://www.linkedin.com/in/kershnee-reddy-ca-sa-b532004b/ |
| 1230 | **Rethabile Pindani** | Pindani / Rethabile | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/rethabile-pindani-722913170/ |
| 1231 | **Liantie Pitchers** | Pitchers / Liantie | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Mpumalanga/Nelspruit | https://www.linkedin.com/in/liantie-pitchers-55427a113/ |
| 1232 | **Dréan du Plessis** | Plessis / Dréan du | CONFIRMED | CA(SA) | SAICA | WaterBorne Capital | Western Cape/Cape Town | — |
| 1233 | **Marscha (MC) du Plessis** | Plessis / Marscha (MC) du | NEEDS_VERIFICATION | Chartered Accountant | — | Sasol | Mossel Bay | — |
| 1234 | **Alice Polinyane** | Polinyane / Alice | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Gauteng/City of Johannesburg | https://www.linkedin.com/in/alice-polinyane-617580167/ |
| 1235 | **Jan Potgieter** | Potgieter / Jan | HIGH_CONFIDENCE | CA(SA) | SAICA | TFG Limited (The Foschini Group) | — | — |
| 1236 | **Lizelle Pottas** | Pottas / Lizelle | CONFIRMED | CA(SA) | SAICA | Vukile Property Fund | — | — |
| 1237 | **Pierre du Preez** | Preez / Pierre du | CONFIRMED | CA(SA) | SAICA | Current employer unconfirmed; former The Building Company | Cape Town history | — |
| 1238 | **Reosha Premduth** | Premduth / Reosha | CONFIRMED | AGA(SA) | SAICA | Afrimat | Western Cape/Cape Town | https://www.linkedin.com/in/reosha-premduth-aga-sa-3a0b4b193/ |
| 1239 | **Karonien Pretorius** | Pretorius / Karonien | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | — | https://www.linkedin.com/in/karonien-pretorius-8543ab143/ |
| 1240 | **Maresa Pretorius** | Pretorius / Maresa | RESEARCH_HOLD | — | — | Hotel Verde Cape Town | Western Cape | https://za.linkedin.com/in/maresa-pretorius-0a139918 |
| 1241 | **Jochemus Prinsloo** | Prinsloo / Jochemus | NEEDS_VERIFICATION | Chartered Accountant | — | Prinsloo Properties; Find My Leak | — | — |
| 1242 | **Susan Prinsloo** | Prinsloo / Susan | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/susan-prinsloo-74978243/ |
| 1243 | **Amith Prithipaul** | Prithipaul / Amith | FINANCE_ROLE_CONFIRMED | — | — | Corobrik Lansdowne | KwaZulu-Natal/Durban | https://www.linkedin.com/in/amith-prithipaul-70a49766/ |
| 1244 | **Amanda Punt** | Punt / Amanda | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/City of Johannesburg | https://www.linkedin.com/in/amanda-punt-472b54100/ |
| 1245 | **fani puthini** | puthini / fani | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/Alberton | https://www.linkedin.com/in/fani-puthini-987a2b25b/ |
| 1246 | **Charne Putter** | Putter / Charne | FINANCE_ROLE_CONFIRMED | — | — | Libstar | Western Cape/Cape Town | https://www.linkedin.com/in/charne-putter-ca-sa-0aa85aa5/ |
| 1247 | **Donnovan Stephen Pydigadu** | Pydigadu / Donnovan Stephen | CONFIRMED | CA(SA) | SAICA | SA Corporate Real Estate (NED); executive employer Unconfirmed | — | — |
| 1248 | **Siziphiwe Qayiso** | Qayiso / Siziphiwe | FINANCE_ROLE_CONFIRMED | — | — | Southern Oil (SOILL) | Western Cape/Cape Town | https://www.linkedin.com/in/siziphiwe-qayiso-80a4ab1a2/ |
| 1249 | **Ayaduma Qonono** | Qonono / Ayaduma | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/City of Cape Town | https://www.linkedin.com/in/ayaduma-qonono-1a6387340/ |
| 1250 | **Diana Quintero Ruiz    (MBA)** | Quintero Ruiz (MBA) / Diana | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/diana-quintero-ruiz-mba-b1b30811/ |
| 1251 | **Marek Raciborski** | Raciborski / Marek | NEEDS_VERIFICATION | Chartered Accountant | — | SOLA Group | Western Cape/Cape Town | — |
| 1252 | **Lynn Radcliffe** | Radcliffe / Lynn | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/lynn-radcliffe-32271959/ |
| 1253 | **Nomzamo Radebe** | Radebe / Nomzamo | CONFIRMED | CA(SA) | SAICA | SA Corporate Real Estate Limited (appointed COO effective 1 Feb 2023); previously CEO of Excellerate JHI | — | — |
| 1254 | **Prudence Radebe** | Radebe / Prudence | FINANCE_ROLE_CONFIRMED | — | — | AfriSam | — | https://www.linkedin.com/in/prudence-radebe-906410116/ |
| 1255 | **Sibusiso Radebe** | Radebe / Sibusiso | CONFIRMED | CA(SA) | SAICA | Ruwacon (Pty) Ltd | — | — |
| 1256 | **Tlhologelo Radebe** | Radebe / Tlhologelo | FINANCE_ROLE_CONFIRMED | — | — | Concor | Gauteng/Springs | https://www.linkedin.com/in/tlhologeloradebe/ |
| 1257 | **Vincent Radebe GTP(SA)** | Radebe GTP(SA) / Vincent | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Johannesburg Metropolitan Area | https://www.linkedin.com/in/vincent-radebe-gtp-sa-04016624/ |
| 1258 | **Firaz Rahman** | Rahman / Firaz | FINANCE_ROLE_CONFIRMED | — | — | RFG Foods | Western Cape/City of Cape Town | https://www.linkedin.com/in/firaz-rahman-ca-sa-b4117a8a/ |
| 1259 | **Aishwarya Rajkoomar** | Rajkoomar / Aishwarya | FINANCE_ROLE_CONFIRMED | — | — | Ardagh Glass Packaging SA | Gauteng/City of Johannesburg | https://www.linkedin.com/in/aishwarya-rajkoomar-3737a0128/ |
| 1260 | **Taryn Raju** | Raju / Taryn | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 1261 | **Florence Ramabina** | Ramabina / Florence | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/Clayville | https://www.linkedin.com/in/florence-ramabina-241785203/ |
| 1262 | **Tharien Rambalie** | Rambalie / Tharien | CONFIRMED | PA(SA) | SAIPA | Xcede Group | Western Cape/Cape Town | https://za.linkedin.com/in/tharien-rambalie-a46a7666 |
| 1263 | **Sandhya Ramjee (Chavda)** | Ramjee (Chavda) / Sandhya | RESEARCH_HOLD | — | — | Nimble Group (public directory); LinkedIn also shows Payment24 | Western Cape | — |
| 1264 | **Raymond Ramokgaba** | Ramokgaba / Raymond | FINANCE_ROLE_CONFIRMED | — | — | NJR Steel | Gauteng/City of Johannesburg | https://www.linkedin.com/in/raymond-ramokgaba-19b14019/ |
| 1265 | **Mignon Ramsay** | Ramsay / Mignon | CONFIRMED | CA(SA) | SAICA | PayProp South Africa | Western Cape/Cape Town | — |
| 1266 | **Mignon Ramsay** | Ramsay / Mignon | CONFIRMED | CA(SA) | SAICA | PayProp South Africa | Western Cape/Cape Town | — |
| 1267 | **Mandy Ramsden** | Ramsden / Mandy | CONFIRMED | CA(SA) | SAICA | Questco (Pty) Ltd | — | — |
| 1268 | **Rachel Ramsden** | Ramsden / Rachel | NEEDS_VERIFICATION | Chartered Accountant | — | Capitalgro Property Management | Location unconfirmed | — |
| 1269 | **Shamima Ranchod** | Ranchod / Shamima | FINANCE_ROLE_CONFIRMED | — | — | AfriSam | Gauteng/City of Johannesburg | https://www.linkedin.com/in/shamima-ranchod-861274114/ |
| 1270 | **Regan Randelhoff** | Randelhoff / Regan | CONFIRMED | CA(SA) | SAICA | Century City Conference Centre (historical) | Cape Town historical | — |
| 1271 | **Regan Randelhoff** | Randelhoff / Regan | CONFIRMED | CA(SA) | SAICA | Century City Conference Centre (historical) | Western Cape/Cape Town | — |
| 1272 | **Shikhaar Ravidas** | Ravidas / Shikhaar | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/shikhaar-ravidas-ca-sa-688b02141/ |
| 1273 | **Siyanda Rayi Nameka** | Rayi Nameka / Siyanda | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Western Cape/City of Cape Town | https://www.linkedin.com/in/siyanda-rayi-nameka-393a1999/ |
| 1274 | **Laila Razack** | Razack / Laila | CONFIRMED | CA(SA) | SAICA | Equites Property Fund | Western Cape/Cape Town | — |
| 1275 | **Laila Razack** | Razack / Laila | CONFIRMED | CA(SA) | SAICA | Equites Property Fund | Western Cape/Cape Town | — |
| 1276 | **Lenica Reddy** | Reddy / Lenica | FINANCE_ROLE_CONFIRMED | — | — | Chryso Southern Africa | Gauteng/City of Johannesburg | https://www.linkedin.com/in/lenica-reddy-13253a9b/ |
| 1277 | **Ciara Reintjes** | Reintjes / Ciara | CONFIRMED | CA(SA) | SAICA | SAICA | — | — |
| 1278 | **Anthony Renda** | Renda / Anthony | CONFIRMED | AGA(SA) | SAICA | North Star Guidance (Pty) Ltd | Western Cape/Durbanville | https://za.linkedin.com/in/anthony-renda-030ab9151 |
| 1279 | **Chantelle Reyerse** | Reyerse / Chantelle | FINANCE_ROLE_CONFIRMED | — | — | Dutoit Agri | Gauteng/Roodepoort | https://www.linkedin.com/in/chantelle-reyerse-2124ba59/ |
| 1280 | **Michela Reyneke** | Reyneke / Michela | NEEDS_VERIFICATION | Chartered Accountant | — | Abacus Property Services | Western Cape/Cape Town | — |
| 1281 | **Vanessa Rheeder** | Rheeder / Vanessa | CONFIRMED | CA(SA) | SAICA | The Modern CFO | Western Cape/Cape Town | https://www.linkedin.com/in/vanessa-rheeder-ca-sa/ |
| 1282 | **Dave Rich** | Rich / Dave | CONFIRMED | CA(SA) | SAICA | Streets Chartered Accountants (Cape Town) | Western Cape/Cape Town | — |
| 1283 | **Kamielah Richards** | Richards / Kamielah | NEEDS_VERIFICATION | Chartered Accountant | — | Stefanutti Stocks WC | Western Cape/Cape Town | — |
| 1284 | **GJ Richter** | Richter / GJ | FINANCE_ROLE_CONFIRMED | — | — | Namaqua Wines | Gauteng/Pretoria | https://www.linkedin.com/in/gj-richter-8856a9125/ |
| 1285 | **Dylan Riddell** | Riddell / Dylan | CONFIRMED | CA(SA) | SAICA | Employer verify | Western Cape location NOT confirmed — X-ray query association only | — |
| 1286 | **Dylan Riddell** | Riddell / Dylan | CONFIRMED | CA(SA) | SAICA | Employer verify | Western Cape/Western Cape | — |
| 1287 | **Shaun Ridgway** | Ridgway / Shaun | CONFIRMED | CA(SA) | SAICA | Faircape Group | Western Cape/Cape Town | — |
| 1288 | **Shaun Ridgway** | Ridgway / Shaun | CONFIRMED | CA(SA) | SAICA | Faircape Group | Western Cape/Cape Town | — |
| 1289 | **Floyd Rikhotso** | Rikhotso / Floyd | NEEDS_VERIFICATION | Chartered Accountant | — | Johannesburg Social Housing Company | — | — |
| 1290 | **Kyle Ringquest** | Ringquest / Kyle | FINANCE_ROLE_CONFIRMED | — | — | De Hoop Steenwerwe | Western Cape/Cape Town | https://www.linkedin.com/in/kyle-ringquest-9109501a3/ |
| 1291 | **Simone Rist** | Rist / Simone | CONFIRMED | CA(SA) | SAICA | WaterBorne Capital | Western Cape/Cape Town | — |
| 1292 | **Simone Rist** | Rist / Simone | CONFIRMED | CA(SA) | SAICA | WaterBorne Capital | Western Cape/Cape Town | — |
| 1293 | **Alan Robbins** | Robbins / Alan | ARTICLES_CONFIRMED_DESIGNATION_UNVERIFIED | — | — | Sable International | Western Cape/Cape Town | — |
| 1294 | **Antonio Roberts** | Roberts / Antonio | RESEARCH_HOLD | — | — | KWV | Western Cape/City of Cape Town | https://za.linkedin.com/in/antonio-roberts |
| 1295 | **Cemelia Roberts** | Roberts / Cemelia | NEEDS_VERIFICATION | Chartered Accountant | — | Amdec Group | Western Cape/Cape Town | — |
| 1296 | **Hanna Robertson** | Robertson / Hanna | FINANCE_ROLE_CONFIRMED | — | — | DGB | Western Cape/City of Cape Town | https://www.linkedin.com/in/hanna-robertson-66993592/ |
| 1297 | **Nadine Robus Littleford** | Robus Littleford / Nadine | FINANCE_ROLE_CONFIRMED | — | — | Mpact | South Africa | https://www.linkedin.com/in/nadine-robus-hill-8a162877/ |
| 1298 | **Lynette Roeloffze** | Roeloffze / Lynette | CONFIRMED | CA(SA) | SAICA | Forvis Mazars Group | Gauteng/Johannesburg | https://www.linkedin.com/in/lynette-roeloffze-ca-sa-ra-0637aa13/ |
| 1299 | **Lizel Roelofse** | Roelofse / Lizel | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/lizel-roelofse-29ab3553 |
| 1300 | **Heidi Eva Roman** | Roman / Heidi Eva | CONFIRMED | CA(SA) | SAICA | Current employer verify | Western Cape location NOT confirmed — X-ray query association only | — |
| 1301 | **Freeman-Garnatt Ronell** | Ronell / Freeman-Garnatt | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/City of Cape Town | https://www.linkedin.com/in/freeman-garnatt-ronell-530a9396/ |
| 1302 | **Ilona Roodt** | Roodt / Ilona | CONFIRMED | CA(SA) | SAICA | TUHF Limited | — | — |
| 1303 | **Bianca Roos** | Roos / Bianca | CONFIRMED | CA(SA) | SAICA | PKF Octagon | — | — |
| 1304 | **Tielman Roos** | Roos / Tielman | NEEDS_VERIFICATION | Chartered Accountant | — | Stor-Age Property REIT | Western Cape/Cape Town | — |
| 1305 | **Marnus Roothman** | Roothman / Marnus | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/Pretoria | https://www.linkedin.com/in/marnus-roothman-31a59aa0/ |
| 1306 | **Rene Van Rooyen** | Rooyen / Rene Van | CONFIRMED | CA(SA) | SAICA | Fairtree | Western Cape employer base; personal location not independently checked | — |
| 1307 | **Tania van Rooyen** | Rooyen / Tania van | CONFIRMED | CA(SA) | SAICA | Employer verify; former Maitland | Western Cape location NOT confirmed — X-ray query association only | — |
| 1308 | **Roz Roseline** | Roseline / Roz | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/Rand West City | https://www.linkedin.com/in/roz-roseline-a5353427/ |
| 1309 | **Andrew Ross-Innes** | Ross-Innes / Andrew | CONFIRMED | CA(SA) | SAICA | Mainstream (renewables; verify) | — | — |
| 1310 | **Jay Rosser** | Rosser / Jay | RESEARCH_HOLD | ACMA, CGMA | CIMA | Empire Finance Partners | Western Cape/Cape Town | — |
| 1311 | **Robert Rossouw** | Rossouw / Robert | RESEARCH_HOLD | AGA(SA) | SAICA | AMC Cookware South Africa | Western Cape/Cape Town | — |
| 1312 | **Daniel Roupa** | Roupa / Daniel | CONFIRMED | CA(SA) | SAICA | Xeltis (first experience entry; Eindhoven, Netherlands; dates not shown) | City of Cape Town, Western Cape | — |
| 1313 | **Dané le Roux** | Roux / Dané le | NEEDS_VERIFICATION | Chartered Accountant | — | VDMV Property Group | Western Cape/Durbanville | — |
| 1314 | **Jacobus le Roux** | Roux / Jacobus le | NEEDS_VERIFICATION | Chartered Accountant | — | Rabie Property Developers | Western Cape/Cape Town | — |
| 1315 | **Martelie Le Roux** | Roux / Martelie Le | CONFIRMED | CA(SA) | SAICA | Noble Property Fund | Tyger Valley office, Western Cape | — |
| 1316 | **Veliswa Rozani** | Rozani / Veliswa | RESEARCH_HOLD | CA(SA) | SAICA | PPC Ltd | — | — |
| 1317 | **Sydney Rudzani** | Rudzani / Sydney | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group | South Africa | https://www.linkedin.com/in/sydney-rudzani-ca-sa-mba-cum-laude-acma-cgma-19658a96/ |
| 1318 | **Alexis Sacks** | Sacks / Alexis | CONFIRMED | CA(SA) | SAICA | Streets Chartered Accountants (Cape Town) | Western Cape/Cape Town | — |
| 1319 | **Hishaam Salie** | Salie / Hishaam | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/hishaam-salie-44726b3a/ |
| 1320 | **Gadija Samaai** | Samaai / Gadija | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group | Western Cape/Paarl | https://www.linkedin.com/in/gadija-samaai-ab427a98/ |
| 1321 | **Junaid Samad** | Samad / Junaid | FINANCE_ROLE_CONFIRMED | — | — | Ardagh Glass Packaging SA | Gauteng/City of Johannesburg | https://www.linkedin.com/in/junaid-samad-1b788540/ |
| 1322 | **Fatima Samsodien** | Samsodien / Fatima | CONFIRMED | CA(SA) | SAICA | V&A Waterfront | Western Cape/Cape Town | — |
| 1323 | **Fatima Samsodien** | Samsodien / Fatima | CONFIRMED | CA(SA) | SAICA | V&A Waterfront | Western Cape/Cape Town | — |
| 1324 | **Craig Samuel** | Samuel / Craig | CONFIRMED | PA(SA) | SAIPA | — | Western Cape | https://za.linkedin.com/in/craig-samuel-070500a3 |
| 1325 | **Beverley Samuels** | Samuels / Beverley | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/beverley-samuels-19041230 |
| 1326 | **Nawaal Samuels** | Samuels / Nawaal | CONFIRMED | CA(SA) | SAICA | Amdec Group | Western Cape/Cape Town | — |
| 1327 | **Nawaal Samuels** | Samuels / Nawaal | CONFIRMED | CA(SA) | SAICA | Amdec Group | Western Cape/Cape Town | — |
| 1328 | **Rabia Samuels** | Samuels / Rabia | CONFIRMED | PA(SA) | SAIPA | CADO Chartered Accountants Inc. | Western Cape | https://za.linkedin.com/in/rabia-samuels-3527a823b |
| 1329 | **Javid Sarvan** | Sarvan / Javid | NEEDS_VERIFICATION | Chartered Accountant | — | Frogfoot Networks | KwaZulu-Natal/Durban | — |
| 1330 | **Giancarlo Sassoli** | Sassoli / Giancarlo | CONFIRMED | AGA(SA) | SAICA | 3C Metal | Western Cape/Cape Town | https://za.linkedin.com/in/giancarlo-sassoli-aga-sa-a051b9254 |
| 1331 | **Graham Saunders** | Saunders / Graham | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/graham-saunders-70488453/ |
| 1332 | **Naazeneen Sayed** | Sayed / Naazeneen | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/naazeneen-sayed-8b54b0b3/ |
| 1333 | **Dian van Schalkwyk** | Schalkwyk / Dian van | NEEDS_VERIFICATION | Chartered Accountant | — | Current employer unconfirmed | Location to verify | — |
| 1334 | **Zanelle Scheepers** | Scheepers / Zanelle | CONFIRMED | CA(SA) | SAICA | Pepkor Holdings | Western Cape location NOT confirmed — X-ray query association only | — |
| 1335 | **Zanelle Scheepers** | Scheepers / Zanelle | CONFIRMED | CA(SA) | SAICA | Pepkor Holdings | Western Cape/Western Cape | — |
| 1336 | **Danya von Scheliha** | Scheliha / Danya von | CONFIRMED | CA(SA) | SAICA | JOBJACK | — | — |
| 1337 | **Fanie Schoeman** | Schoeman / Fanie | CONFIRMED | AGA(SA) | SAICA | Houst | Western Cape/Stellenbosch | https://za.linkedin.com/in/fanie-schoeman-aga-sa-758938a2 |
| 1338 | **Leandre Schoeman** | Schoeman / Leandre | CONFIRMED | ACMA, CGMA | CIMA | IBCO | Western Cape/Cape Town | https://za.linkedin.com/in/leandre-schoeman-acma-cgma-bb451b23 |
| 1339 | **Lindie Scholtz** | Scholtz / Lindie | HIGH_CONFIDENCE | CA(SA) | SAICA | FNB | — | — |
| 1340 | **Tarryn Scholtz** | Scholtz / Tarryn | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Western Cape/City of Cape Town | https://www.linkedin.com/in/tarryn-scholtz-a2435a1ab/ |
| 1341 | **DJ Schreuder** | Schreuder / DJ | NEEDS_VERIFICATION | Chartered Accountant | — | Amdec Group | — | — |
| 1342 | **Matheus Schreuder** | Schreuder / Matheus | FINANCE_ROLE_CONFIRMED | — | — | Fair Cape Dairies | Western Cape/Durbanville | https://www.linkedin.com/in/matheus-schreuder-1157b6264/ |
| 1343 | **Phillip Schreuder** | Schreuder / Phillip | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/City of Cape Town | https://www.linkedin.com/in/phillip-schreuder-650971124/ |
| 1344 | **Andrew Scrase** | Scrase / Andrew | FINANCE_ROLE_CONFIRMED | — | — | EnviroServ | Gauteng/Johannesburg | https://www.linkedin.com/in/andrew-scrase-67614b49/ |
| 1345 | **Itumeleng Sealetsa** | Sealetsa / Itumeleng | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | Gauteng/City of Johannesburg | https://www.linkedin.com/in/itumeleng-sealetsa-26a81bab/ |
| 1346 | **Mabatho Sedikela** | Sedikela / Mabatho | HIGH_CONFIDENCE | CA(SA) | SAICA | Auditor-General of South Africa (AGSA) | — | — |
| 1347 | **Jon Seeliger** | Seeliger / Jon | NEEDS_VERIFICATION | Chartered Accountant | — | Mulilo | Pretoria on profile; Cape Town previous | — |
| 1348 | **Jon Seeliger** | Seeliger / Jon | CONFIRMED | CA(SA) | SAICA | Mulilo | Gauteng/Cape Town | — |
| 1349 | **Burtie September** | September / Burtie | NEEDS_VERIFICATION | Chartered Accountant | — | Curro Holdings | — | — |
| 1350 | **Danzil September** | September / Danzil | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Stellenbosch | https://www.linkedin.com/in/danzil-september-888a93230/ |
| 1351 | **Ethan September** | September / Ethan | CONFIRMED | ACMA, CGMA | CIMA | RFG Foods | Western Cape/Cape Town | https://za.linkedin.com/in/ethan-september-acma-cgma-2363a0143 |
| 1352 | **Lyle September** | September / Lyle | FINANCE_ROLE_CONFIRMED | — | — | KWV | Western Cape/Kuils River | https://www.linkedin.com/in/lyleseptember0798/ |
| 1353 | **Mandy September** | September / Mandy | CONFIRMED | CA(SA) | SAICA | TM Forum (latest evidence), formerly Terra Firma | Western Cape location NOT confirmed — X-ray query association only | — |
| 1354 | **Mandy September** | September / Mandy | CONFIRMED | CA(SA) | SAICA | TM Forum (latest evidence), formerly Terra Firma | Western Cape/Western Cape | — |
| 1355 | **Sergio September** | September / Sergio | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Western Cape/City of Cape Town | https://www.linkedin.com/in/sergio-september-21276b90/ |
| 1356 | **Leon Serfontein** | Serfontein / Leon | FINANCE_ROLE_CONFIRMED | CA(SA) | SAICA | AfriSam | Gauteng/City of Johannesburg | https://www.linkedin.com/in/leon-serfontein-6559b168/ |
| 1357 | **Masechaba Sesing** | Sesing / Masechaba | CONFIRMED | CA(SA) | SAICA | Free State Provincial Treasury | Free State/Bloemfontein | — |
| 1358 | **Nqobile Shabane (CA)SA** | Shabane (CA)SA / Nqobile | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Durban Metropolitan Area | https://www.linkedin.com/in/nqobile-shabane-ca-sa-722518152/ |
| 1359 | **Thandolwenkosi Shabangu** | Shabangu / Thandolwenkosi | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Mpumalanga/Piet Retief | https://www.linkedin.com/in/thandolwenkosi-shabangu-62b4b4192/ |
| 1360 | **Aadila Shaikh** | Shaikh / Aadila | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Gauteng/Gauteng | https://www.linkedin.com/in/aadila-shaikh-93452824b/ |
| 1361 | **Temoso Shazi** | Shazi / Temoso | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Gauteng/Gauteng | https://www.linkedin.com/in/temoso-shazi-034ba76/ |
| 1362 | **Aminah Sheik** | Sheik / Aminah | CONFIRMED | CA(SA) | SAICA | ellioCX | Western Cape location NOT confirmed — X-ray query association only | — |
| 1363 | **Aminah Sheik** | Sheik / Aminah | CONFIRMED | CA(SA) | SAICA | ellioCX | Western Cape/Western Cape | — |
| 1364 | **Jody Sheldon** | Sheldon / Jody | CONFIRMED | CA(SA) | SAICA | VDMV Property Group | Western Cape/Cape Town | — |
| 1365 | **Jody Sheldon** | Sheldon / Jody | CONFIRMED | CA(SA) | SAICA | VDMV Property Group | Western Cape/Cape Town | — |
| 1366 | **Leonard Sher** | Sher / Leonard | CONFIRMED | CA(SA) | SAICA | Unconfirmed | City of Cape Town, Western Cape | — |
| 1367 | **Emmaculate Shezi** | Shezi / Emmaculate | FINANCE_ROLE_CONFIRMED | — | — | GVK-Siya Zama | South Africa | https://uk.linkedin.com/in/emmaculate-shezi-85010abb |
| 1368 | **Sibongile Sibongile.Kubeka** | Sibongile.Kubeka / Sibongile | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/sibongile-sibongile-kubeka-9a548125/ |
| 1369 | **Tawanda Sigauke** | Sigauke / Tawanda | CONFIRMED | ACCA | ACCA | Red Rocket South Africa (Pty) Ltd | Western Cape/Cape Town | https://za.linkedin.com/in/tawanda-sigauke-acca-369a7060 |
| 1370 | **Portia Sihlahla** | Sihlahla / Portia | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/portia-sihlahla-2a08221a9/ |
| 1371 | **Graeme Sim** | Sim / Graeme | FINANCE_ROLE_CONFIRMED | — | — | Kaap Agri / Agrimark | Western Cape/City of Cape Town | https://www.linkedin.com/in/graeme-sim-2a7a1068/ |
| 1372 | **Zinhle Simamane** | Simamane / Zinhle | CONFIRMED | CA(SA) | SAICA | Traxtion | — | — |
| 1373 | **Panaishe Simango** | Simango / Panaishe | CONFIRMED | CA(SA) | SAICA | GCO Partners | Western Cape location NOT confirmed — X-ray query association only | — |
| 1374 | **Panaishe Simango** | Simango / Panaishe | CONFIRMED | CA(SA) | SAICA | GCO Partners | Western Cape/Western Cape | — |
| 1375 | **Charlton Simpson** | Simpson / Charlton | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Western Cape/City of Cape Town | https://www.linkedin.com/in/charlton-simpson-9164651b/ |
| 1376 | **Tabisa Singenile** | Singenile / Tabisa | CONFIRMED | ACMA, CGMA | CIMA | WBHO Construction - Cape Division | Johannesburg Metropolitan Area | https://www.linkedin.com/in/tabisa-singenile-cgma®-acma-3932b299/ |
| 1377 | **Alka Singh** | Singh / Alka | CONFIRMED | CA(SA) | SAICA | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/alka-singh-ca-sa-12642173/ |
| 1378 | **Avishkaar Singh** | Singh / Avishkaar | NEEDS_VERIFICATION | Chartered Accountant | — | RDC Properties | Cape Town – verify | — |
| 1379 | **Bhaviska Singh** | Singh / Bhaviska | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Gauteng/City of Johannesburg | https://www.linkedin.com/in/bhaviska-singh-9a9831116/ |
| 1380 | **Devani Singh** | Singh / Devani | FINANCE_ROLE_CONFIRMED | — | — | Raubex / Roadmac Surfacing Cape | Johannesburg Metropolitan Area | https://www.linkedin.com/in/devani-singh-909318159/ |
| 1381 | **Tashmika Singh** | Singh / Tashmika | CONFIRMED | CA(SA) | SAICA | Faircape Group | Western Cape; city confirm | — |
| 1382 | **Tashmika Singh** | Singh / Tashmika | CONFIRMED | CA(SA) | SAICA | Faircape Group | Western Cape/Western Cape | — |
| 1383 | **Qayiya Siphosethu Kobese** | Siphosethu Kobese / Qayiya | FINANCE_ROLE_CONFIRMED | — | — | Peninsula Beverages | Western Cape/City of Cape Town | https://www.linkedin.com/in/qayiya-siphosethu-kobese/ |
| 1384 | **Augustine Sithole** | Sithole / Augustine | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/Johannesburg | https://www.linkedin.com/in/augustine-sithole-630451211/ |
| 1385 | **Bantu Skaap** | Skaap / Bantu | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/City of Johannesburg | https://www.linkedin.com/in/bantu-skaap-a1b03552/ |
| 1386 | **Philip Slabber** | Slabber / Philip | FINANCE_ROLE_CONFIRMED | — | — | Overberg Agri | Western Cape/City of Cape Town | https://www.linkedin.com/in/philip-slabber-ca-sa-14aa4013a/ |
| 1387 | **Gavi Slasky** | Slasky / Gavi | CONFIRMED | CA(SA) | SAICA | Born Free Investments 369 | Cape Town? — confirm | — |
| 1388 | **Gavi Slasky** | Slasky / Gavi | CONFIRMED | CA(SA) | SAICA | Born Free Investments 369 | Western Cape/Cape Town | — |
| 1389 | **Chantel Sliep-Viljoen** | Sliep-Viljoen / Chantel | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/chantel-sliep-viljoen-6a180774/ |
| 1390 | **Johan Small** | Small / Johan | CONFIRMED | CA(SA) | SAICA | BetterHome Group | Western Cape location NOT confirmed — X-ray query association only | — |
| 1391 | **Johan Small** | Small / Johan | CONFIRMED | CA(SA) | SAICA | BetterHome Group | Western Cape/Western Cape | — |
| 1392 | **Karin Smidt** | Smidt / Karin | FINANCE_ROLE_CONFIRMED | — | — | Spier | Western Cape/Cape Town | https://www.linkedin.com/in/karin-smidt-86332726/ |
| 1393 | **Lucinda Smidt** | Smidt / Lucinda | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/City of Cape Town | https://www.linkedin.com/in/lucinda-smidt-57043a5a/ |
| 1394 | **Charl Smit** | Smit / Charl | CONFIRMED | AGA(SA) | SAICA | Thornlands Group | Western Cape/Cape Town | https://za.linkedin.com/in/charl-smit-aga-sa |
| 1395 | **Daniël Smit** | Smit / Daniël | FINANCE_ROLE_CONFIRMED | — | — | KWV | South Africa | https://www.linkedin.com/in/daniël-smit-56390565/ |
| 1396 | **Ferdinand Smit** | Smit / Ferdinand | CONFIRMED | CA(SA) | SAICA | Bidvest Group (property-related) | Western Cape/Cape Town | — |
| 1397 | **Ferdinand Smit** | Smit / Ferdinand | CONFIRMED | CA(SA) | SAICA | Bidvest Group (property-related) | Western Cape/Cape Town | — |
| 1398 | **Heinrich Smit** | Smit / Heinrich | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/City of Cape Town | https://www.linkedin.com/in/heinrich-smit-9b03284a/ |
| 1399 | **Jandré Smit** | Smit / Jandré | CONFIRMED | CA(SA) | SAICA | Independent / employer unclear | Western Cape/Cape Town | — |
| 1400 | **Jandré Smit** | Smit / Jandré | CONFIRMED | CA(SA) | SAICA | Independent / employer unclear | Western Cape/Cape Town | — |
| 1401 | **Adrian Smith** | Smith / Adrian | CONFIRMED | ACMA, CGMA | CIMA | Bounty Apparel | Western Cape/Cape Town | https://www.linkedin.com/in/adrian-smith-acma-cgma-30942b59/ |
| 1402 | **Andre Smith** | Smith / Andre | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Western Cape/Western Cape | https://www.linkedin.com/in/andre-smith-09990a18/ |
| 1403 | **Elzet Smith** | Smith / Elzet | NEEDS_VERIFICATION | Chartered Accountant | — | Red Rocket South Africa | Western Cape/Cape Town | — |
| 1404 | **Kelly Smith** | Smith / Kelly | CONFIRMED | CA(SA) | SAICA | Seeff Property Services | Western Cape/Cape Town | — |
| 1405 | **Kelly Smith** | Smith / Kelly | CONFIRMED | CA(SA) | SAICA | Seeff Property Services | Western Cape/Cape Town | — |
| 1406 | **Lize-Mari Smith** | Smith / Lize-Mari | CONFIRMED | CA(SA) | SAICA | Employer verify | Western Cape location NOT confirmed — X-ray query association only | — |
| 1407 | **Lize-Mari Smith** | Smith / Lize-Mari | CONFIRMED | CA(SA) | SAICA | Employer verify | Western Cape/Western Cape | — |
| 1408 | **Lizelle Smith** | Smith / Lizelle | RESEARCH_HOLD | — | — | Inventory, Insurance & Fixed Assets | Western Cape | https://za.linkedin.com/in/lizelle-smith-6b3a7a65 |
| 1409 | **Mari Smith** | Smith / Mari | CONFIRMED | CA(SA) | SAICA | Fairtree | Western Cape employer base; personal location not independently checked | — |
| 1410 | **Mari Smith** | Smith / Mari | CONFIRMED | CA(SA) | SAICA | Fairtree | Western Cape/Western Cape | — |
| 1411 | **Mark Smith** | Smith / Mark | CONFIRMED | CA(SA) | SAICA | Employer unconfirmed | Western Cape/Cape Town | — |
| 1412 | **Mark Smith** | Smith / Mark | CONFIRMED | CA(SA) | SAICA | Employer unconfirmed | Western Cape/Cape Town | — |
| 1413 | **Nadene Smith** | Smith / Nadene | NEEDS_VERIFICATION | Chartered Accountant | — | Fairvest Limited | Western Cape/Cape Town | — |
| 1414 | **Nadene Smith** | Smith / Nadene | CONFIRMED | CA(SA) | SAICA | Fairvest Limited | Western Cape/Cape Town | — |
| 1415 | **Russell Smith** | Smith / Russell | CONFIRMED | CA(SA) | SAICA | Property fund / real estate (current company unclear) | Western Cape/Cape Town | — |
| 1416 | **Russell Smith** | Smith / Russell | CONFIRMED | CA(SA) | SAICA | Property fund / real estate (current company unclear) | Western Cape/Cape Town | — |
| 1417 | **Carel Snyman** | Snyman / Carel | CONFIRMED | CA(SA) | SAICA | Altron | — | https://www.linkedin.com/in/carel-snyman-3573252/ |
| 1418 | **Hannes Snyman** | Snyman / Hannes | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Gauteng/City of Johannesburg | https://www.linkedin.com/in/hannes-snyman/ |
| 1419 | **Johan Snyman** | Snyman / Johan | FINANCE_ROLE_CONFIRMED | — | — | Fruitways | Western Cape/Somerset West | https://www.linkedin.com/in/johan-snyman-1731b215a/ |
| 1420 | **Lungelwa Sogiba** | Sogiba / Lungelwa | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/lungelwa-sogiba-01a80965/ |
| 1421 | **Polani Sokombela** | Sokombela / Polani | CONFIRMED | CA(SA) | SAICA | Auditor-General of South Africa (AGSA) | — | — |
| 1422 | **Joan Solms** | Solms / Joan | CONFIRMED | CA(SA) | SAICA | Spear REIT | Western Cape/Cape Town | — |
| 1423 | **Joan Solms** | Solms / Joan | CONFIRMED | CA(SA) | SAICA | Spear REIT | Western Cape/Cape Town | — |
| 1424 | **Brendelene Solomons** | Solomons / Brendelene | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Gauteng/City of Johannesburg | https://www.linkedin.com/in/brendelene-solomons-92229b35/ |
| 1425 | **Cheryl Somers Vine** | Somers Vine / Cheryl | FINANCE_ROLE_CONFIRMED | — | — | EnviroServ | Gauteng/Johannesburg | https://www.linkedin.com/in/cheryl-somers-vine-285a8410/ |
| 1426 | **Shamila Soobramoney** | Soobramoney / Shamila | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/shamila-soobramoney-0699068b/ |
| 1427 | **Sharmila Soobramoney** | Soobramoney / Sharmila | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/sharmila-soobramoney-369301285/ |
| 1428 | **Claudio de Sousa** | Sousa / Claudio de | NEEDS_VERIFICATION | Chartered Accountant | — | Emira Property Fund / Delta / Grit | Location unconfirmed | — |
| 1429 | **Kyle Sparg** | Sparg / Kyle | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | East London | https://www.linkedin.com/in/kyle-sparg-67188615a/ |
| 1430 | **Juan Spies** | Spies / Juan | CONFIRMED | CA(SA) | SAICA | McA Durbanville Inc. | Western Cape/Durbanville | — |
| 1431 | **Lois Spies** | Spies / Lois | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/lois-spies-43350460/ |
| 1432 | **Justine Spreeth** | Spreeth / Justine | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | KwaZulu-Natal/eThekwini | https://www.linkedin.com/in/justine-spreeth-988aa465/ |
| 1433 | **Judy van Staden** | Staden / Judy van | CONFIRMED | CA(SA) | SAICA | Mulilo | Cape Town – confirm | — |
| 1434 | **Philip Stallkamp** | Stallkamp / Philip | NEEDS_VERIFICATION | Chartered Accountant | — | Red Rocket South Africa | Western Cape/Cape Town | — |
| 1435 | **Christopher Stanley** | Stanley / Christopher | CONFIRMED | FCCA | ACCA | AIML Score | Western Cape/Cape Town | https://za.linkedin.com/in/christopher-stanley-fcca |
| 1436 | **Shelton Stanley** | Stanley / Shelton | FINANCE_ROLE_CONFIRMED | — | — | Much Asphalt | Western Cape/Western Cape | https://www.linkedin.com/in/shelton-stanley-9586ab25/ |
| 1437 | **Shelton Stanley** | Stanley / Shelton | NEEDS_VERIFICATION | Chartered Accountant | — | Much Asphalt | Western Cape/Cape Town | — |
| 1438 | **Hendrik Stavast** | Stavast / Hendrik | CONFIRMED | CA(SA) | SAICA | gosolr | Location check | — |
| 1439 | **Hendrik Stavast** | Stavast / Hendrik | CONFIRMED | CA(SA) | SAICA | gosolr | Western Cape | — |
| 1440 | **Veronica Steenveld** | Steenveld / Veronica | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/veronica-steenveld-560694168/ |
| 1441 | **Maria (Marietjie) Steinau** | Steinau / Maria (Marietjie) | CONFIRMED | CA(SA) | SAICA | V&A Waterfront | Western Cape/Cape Town | — |
| 1442 | **Vedet Stevens** | Stevens / Vedet | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Western Cape/City of Cape Town | https://www.linkedin.com/in/vedetstevens/ |
| 1443 | **Fulufhelo Stewart Nemaitoni** | Stewart Nemaitoni / Fulufhelo | CONFIRMED | CA(SA) | SAICA | Nedbank CIB | Western Cape/Cape Town | — |
| 1444 | **Anton Steyl** | Steyl / Anton | CONFIRMED | CA(SA) | SAICA | Investicore | Cape Town – check | — |
| 1445 | **Anton Steyl** | Steyl / Anton | CONFIRMED | CA(SA) | SAICA | Investicore | Western Cape/Cape Town | — |
| 1446 | **Megan Steyl** | Steyl / Megan | CONFIRMED | CA(SA) | SAICA | Investicore South Africa | — | — |
| 1447 | **Albert Steyn** | Steyn / Albert | FINANCE_ROLE_CONFIRMED | — | — | Capespan South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/albert-steyn-40701b69/ |
| 1448 | **Benita Steyn** | Steyn / Benita | CONFIRMED | CA(SA) | SAICA | Evergreen Lifestyle | Western Cape/Cape Town | — |
| 1449 | **Benita Steyn** | Steyn / Benita | CONFIRMED | CA(SA) | SAICA | Evergreen Lifestyle | Western Cape/Cape Town | — |
| 1450 | **Elizabeth Steyn** | Steyn / Elizabeth | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/elizabeth-steyn-54b3911ba |
| 1451 | **Pia Steyn** | Steyn / Pia | FINANCE_ROLE_CONFIRMED | — | — | KWV | Western Cape/City of Cape Town | https://www.linkedin.com/in/pia-steyn-ca-sa-2a0051147/ |
| 1452 | **Craig Stipp** | Stipp / Craig | FINANCE_ROLE_CONFIRMED | — | — | Brito's Group | Western Cape/Western Cape | https://www.linkedin.com/in/craig-stipp-58aa5811a/ |
| 1453 | **Patricia Stock** | Stock / Patricia | CONFIRMED | CA(SA) | SAICA | SAICA | — | — |
| 1454 | **Mindre Stofberg** | Stofberg / Mindre | CONFIRMED | CA(SA) | SAICA | Tronox Namakwa Sands | Western Cape/Saldanha Bay Local Municipality | https://www.linkedin.com/in/mindre-stofberg-ca-sa-6416a638/ |
| 1455 | **Justin Stohr** | Stohr / Justin | HIGH_CONFIDENCE | PA(SA) | SAIPA | McA Accounting & Tax Services Inc. | Western Cape/Cape Town | — |
| 1456 | **Chase Stone** | Stone / Chase | CONFIRMED | CA(SA) | SAICA | WaterBorne Capital | Western Cape/Cape Town | — |
| 1457 | **Chase Stone** | Stone / Chase | CONFIRMED | CA(SA) | SAICA | WaterBorne Capital | Western Cape/Cape Town | — |
| 1458 | **Eugene Stoumann** | Stoumann / Eugene | FINANCE_ROLE_CONFIRMED | — | — | Brito's Group | Western Cape/Cape Town | https://www.linkedin.com/in/eugene-stoumann-b62127137/ |
| 1459 | **Edburg Strauss** | Strauss / Edburg | CONFIRMED | CA(SA) | SAICA | netCFO | Gauteng/Pretoria | https://www.linkedin.com/in/edburg-strauss/ |
| 1460 | **Reynard Streicher** | Streicher / Reynard | CONFIRMED | CA(SA) | SAICA | Unconfirmed | — | — |
| 1461 | **Neil Struthers** | Struthers / Neil | FINANCE_ROLE_CONFIRMED | — | — | Power Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/neil-struthers-019a8b70/ |
| 1462 | **Gerhard Strydom** | Strydom / Gerhard | CONFIRMED | CA(SA) | SAICA | Amdec Group (former) | Western Cape/Cape Town | — |
| 1463 | **Gerhard Strydom** | Strydom / Gerhard | CONFIRMED | CA(SA) | SAICA | Amdec Group (former) | Western Cape/Cape Town | — |
| 1464 | **Ian Strydom** | Strydom / Ian | CONFIRMED | AGA(SA) | SAICA | IW Tax Advisory | Western Cape/Cape Town | https://za.linkedin.com/in/ian-strydom |
| 1465 | **Lauren Summerton** | Summerton / Lauren | NEEDS_VERIFICATION | Chartered Accountant | — | Amdec Group | Location unconfirmed | — |
| 1466 | **Elmarie Swanepoel** | Swanepoel / Elmarie | HIGH_CONFIDENCE | CA(SA) | SAICA | Stellenbosch University | Western Cape/Stellenbosch | — |
| 1467 | **Victoria Swanson** | Swanson / Victoria | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/victoria-swanson-ca-sa/ |
| 1468 | **Charles Swart** | Swart / Charles | CONFIRMED | AGA(SA) | SAICA | Phelan Green Group | Western Cape/Cape Town | https://za.linkedin.com/in/charles-swart-aga-sa-6a2266280 |
| 1469 | **Connie Swart** | Swart / Connie | CONFIRMED | CA(SA) | SAICA | Irvin & Johnson | Western Cape location NOT confirmed — X-ray query association only | — |
| 1470 | **Connie Swart** | Swart / Connie | CONFIRMED | CA(SA) | SAICA | Irvin & Johnson | Western Cape/Western Cape | — |
| 1471 | **Lindi Swart** | Swart / Lindi | CONFIRMED | AGA(SA) | SAICA | Thornlands Group | Western Cape/Cape Town | https://za.linkedin.com/in/lindi-swart-aga-sa-a19b05166 |
| 1472 | **Mariette Swart** | Swart / Mariette | CONFIRMED | CA(SA) | SAICA | Afrimat | Western Cape/City of Cape Town | https://www.linkedin.com/in/mariette-swart-23595541/ |
| 1473 | **Mariette Swart** | Swart / Mariette | CONFIRMED | CA(SA) | SAICA | Afrimat | Tyger Valley, Western Cape | — |
| 1474 | **Mariette Swart** | Swart / Mariette | CONFIRMED | CA(SA) | SAICA | Afrimat | Western Cape/Western Cape | — |
| 1475 | **Wesley Swart** | Swart / Wesley | CONFIRMED | CA(SA) | SAICA | Private multi-company group — employer verify | Western Cape location NOT confirmed — X-ray query association only | — |
| 1476 | **Wesley Swart** | Swart / Wesley | CONFIRMED | CA(SA) | SAICA | Private multi-company group — employer verify | Western Cape/Western Cape | — |
| 1477 | **Cecelia Swartz** | Swartz / Cecelia | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 1478 | **Emmie Swiegers** | Swiegers / Emmie | CONFIRMED | CA(SA) | SAICA | South Pole | Western Cape/Cape Town | — |
| 1479 | **Emmie Swiegers** | Swiegers / Emmie | CONFIRMED | CA(SA) | SAICA | South Pole | Western Cape/Cape Town | — |
| 1480 | **Nicolene Swingburn** | Swingburn / Nicolene | CONFIRMED | CA(SA) | SAICA | Ares Holdings | Western Cape location NOT confirmed — X-ray query association only | — |
| 1481 | **Nicolene Swingburn** | Swingburn / Nicolene | CONFIRMED | CA(SA) | SAICA | Ares Holdings | Western Cape/Western Cape | — |
| 1482 | **Kotze Tania** | Tania / Kotze | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/City of Cape Town | https://www.linkedin.com/in/kotze-tania-316a7030/ |
| 1483 | **Raeesah Tar** | Tar / Raeesah | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/raeesah-tar-1a8a97116/ |
| 1484 | **Walter Tarr** | Tarr / Walter | CONFIRMED | CA(SA) | SAICA | Property and private-company finance – employer verify | Western Cape location NOT confirmed — X-ray query association only | — |
| 1485 | **Walter Tarr** | Tarr / Walter | CONFIRMED | CA(SA) | SAICA | Property and private-company finance – employer verify | Western Cape/Western Cape | — |
| 1486 | **Hiten Taylor** | Taylor / Hiten | CONFIRMED | ACMA, CGMA | CIMA | Stellenbosch Vineyards | Western Cape/Cape Town | https://za.linkedin.com/in/hiten-taylor-acma-cgma-a3b3b2206 |
| 1487 | **Johanna Taylor** | Taylor / Johanna | CONFIRMED | ACMA, CGMA | CIMA | TFG (The Foschini Group) | Western Cape/Cape Town | https://za.linkedin.com/in/johanna-taylor-acma-cgma-b1219198 |
| 1488 | **Dennis Tembo** | Tembo / Dennis | RESEARCH_HOLD | — | — | — | Western Cape/Western Cape candidate pool | https://za.linkedin.com/in/dennis-tembo-3554016 |
| 1489 | **Mark Templeton** | Templeton / Mark | CONFIRMED | CA(SA) | SAICA | Employer verify | Western Cape location NOT confirmed — X-ray query association only | — |
| 1490 | **Mark Templeton** | Templeton / Mark | CONFIRMED | CA(SA) | SAICA | Employer verify | Western Cape/Western Cape | — |
| 1491 | **Mhlengi Tenza** | Tenza / Mhlengi | HIGH_CONFIDENCE | CA(SA) | SAICA | Standard Insurance Limited | — | — |
| 1492 | **Pieter Terblanche** | Terblanche / Pieter | CONFIRMED | CA(SA) | SAICA | Employer unconfirmed | Western Cape/Cape Town | — |
| 1493 | **Pieter Terblanche** | Terblanche / Pieter | CONFIRMED | CA(SA) | SAICA | Employer unconfirmed | Western Cape/Cape Town | — |
| 1494 | **Dean Teuchert** | Teuchert / Dean | FINANCE_ROLE_CONFIRMED | — | — | Cape Herb & Spice | Western Cape/Cape Town | https://www.linkedin.com/in/dean-teuchert-b2b81b139/ |
| 1495 | **Tim Thackwray** | Thackwray / Tim | CONFIRMED | CA(SA) | SAICA | Questco (Pty) Ltd | — | — |
| 1496 | **Sisandile Thambo** | Thambo / Sisandile | CONFIRMED | CA(SA) | SAICA | Saint-Gobain Gyproc | Johannesburg Metropolitan Area | https://za.linkedin.com/in/sisa-thambo |
| 1497 | **Anthea Thaver** | Thaver / Anthea | FINANCE_ROLE_CONFIRMED | — | — | Corobrik Lansdowne | Gauteng/Germiston | https://www.linkedin.com/in/anthea-thaver-792128160/ |
| 1498 | **Willem Theron** | Theron / Willem | CONFIRMED | CA(SA) | SAICA | PSG Konsult Ltd (PSG Financial Services) | — | — |
| 1499 | **Joshua Thessal** | Thessal / Joshua | FINANCE_ROLE_CONFIRMED | — | — | Corobrik Lansdowne | KwaZulu-Natal/Durban | https://www.linkedin.com/in/joshua-thessal-86a9195/ |
| 1500 | **Ranchell Thomas** | Thomas / Ranchell | RESEARCH_HOLD | — | — | Tapestry Home Brands | Western Cape | https://za.linkedin.com/in/ranchell-thomas-0a4080149 |
| 1501 | **Rodrique Thomas** | Thomas / Rodrique | CONFIRMED | CA(SA) | SAICA | Astron Energy | Western Cape/City of Cape Town | https://www.linkedin.com/in/rodrique-thomas/ |
| 1502 | **Ndivhuwo Thomoli** | Thomoli / Ndivhuwo | CONFIRMED | CA(SA) | SAICA | AfriSam | Gauteng/City of Johannesburg | https://www.linkedin.com/in/ndivhuwo-thomoli-ca-sa-150766a8/ |
| 1503 | **Ross Thomson** | Thomson / Ross | HIGH_CONFIDENCE | PA(SA) | SAIPA | Collective Accounting | KwaZulu-Natal/Winston Park | — |
| 1504 | **Nomfundo Thusini** | Thusini / Nomfundo | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | KwaZulu-Natal/Durban | https://www.linkedin.com/in/nomfundo-thusini-a22b5a13b/ |
| 1505 | **Thamsanqa Thwala** | Thwala / Thamsanqa | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Johannesburg Metropolitan Area | https://www.linkedin.com/in/thamsanqa-thwala-ca-sa-b70585bb/ |
| 1506 | **Brett Till** | Till / Brett | CONFIRMED | CA(SA) | SAICA | Hyprop Investments | — | — |
| 1507 | **Joshua Tilney** | Tilney / Joshua | CONFIRMED | ACMA, CGMA | CIMA | Klay | Western Cape/Stellenbosch | https://www.linkedin.com/in/joshua-tilney-acma-cgma-49209b86/ |
| 1508 | **Zoleka Ingrid Tinto** | Tinto / Zoleka Ingrid | CONFIRMED | CA(SA) | SAICA | Remgro Limited | Cape Town, Western Cape | — |
| 1509 | **Douglas Titley** | Titley / Douglas | NEEDS_VERIFICATION | Chartered Accountant | — | Ingenuity Property Investments | Western Cape/Cape Town | — |
| 1510 | **Keitumetse Tito** | Tito / Keitumetse | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Northern Cape/Kathu | https://www.linkedin.com/in/keitumetse-tito-b10a62a2/ |
| 1511 | **Deon Titus** | Titus / Deon | RESEARCH_HOLD | — | — | USB Executive Development | Western Cape | https://za.linkedin.com/in/deon-titus-065660a5 |
| 1512 | **William Tlou. BComm, Bcompt (Hons), Mcomm,** | Tlou. BComm, Bcompt (Hons), Mcomm, / William | CONFIRMED | CA(SA) | SAICA | Tronox Namakwa Sands | Gauteng/City of Johannesburg | https://www.linkedin.com/in/william-tlou-bcomm-bcompt-hons-mcomm-ca-sa-5161b029/ |
| 1513 | **Pieter Toerien** | Toerien / Pieter | FINANCE_ROLE_CONFIRMED | — | — | ASLA | Western Cape/City of Cape Town | https://www.linkedin.com/in/pieter-toerien-14727091/ |
| 1514 | **Pieter Toerien** | Toerien / Pieter | CONFIRMED | CA(SA) | SAICA | Current employer unconfirmed; formerly Aquacor Property Group | Western Cape – confirm | — |
| 1515 | **Pieter Toerien** | Toerien / Pieter | CONFIRMED | CA(SA) | SAICA | Current employer unconfirmed; formerly Aquacor Property Group | Western Cape/Western Cape | — |
| 1516 | **Abrie du Toit** | Toit / Abrie du | NEEDS_VERIFICATION | Chartered Accountant | — | Form-Scaff | Johannesburg, Gauteng | — |
| 1517 | **JP Du Toit** | Toit / JP Du | CONFIRMED | CA(SA) | SAICA | Unconfirmed (first experience entry on profile: Legacy Environmental Management Consulting; no dates shown) | City of Cape Town, Western Cape | — |
| 1518 | **Lizanne du Toit** | Toit / Lizanne du | CONFIRMED | CA(SA) | SAICA | Bester Feed & Grain | Western Cape location NOT confirmed — X-ray query association only | — |
| 1519 | **Mitchell du Toit** | Toit / Mitchell du | CONFIRMED | CA(SA) | SAICA | RDC Property Group | Western Cape/Cape Town | — |
| 1520 | **Anneke Traut** | Traut / Anneke | NEEDS_VERIFICATION | Chartered Accountant | — | Unconfirmed | City of Cape Town, Western Cape | — |
| 1521 | **Bianca Treiber** | Treiber / Bianca | FINANCE_ROLE_CONFIRMED | — | — | Fruitways | Western Cape/City of Cape Town | https://www.linkedin.com/in/bianca-treiber-66384ab9/ |
| 1522 | **Cheslin Tremble** | Tremble / Cheslin | NEEDS_VERIFICATION | Chartered Accountant | — | Flyt Property Investment | Cape Town – check | — |
| 1523 | **Cheslin Tremble** | Tremble / Cheslin | CONFIRMED | CA(SA) | SAICA | Flyt Property Investment | Western Cape/Cape Town | — |
| 1524 | **Maurice Trichardt** | Trichardt / Maurice | CONFIRMED | AGA(SA) | SAICA | Panorama Consulting | Western Cape/Cape Town | https://za.linkedin.com/in/supremeaccountant |
| 1525 | **Elsabé Tromp** | Tromp / Elsabé | CONFIRMED | CA(SA) | SAICA | Unconfirmed | City of Cape Town, Western Cape | — |
| 1526 | **Martli Truter** | Truter / Martli | CONFIRMED | PA(SA) | SAIPA | Mohr Foods | Western Cape/Durbanville | https://za.linkedin.com/in/martli-truter-pa-sa-4830352ab |
| 1527 | **Susan Truter** | Truter / Susan | CONFIRMED | CA(SA) | SAICA | Forvis Mazars (South Africa) | Gauteng/Johannesburg | — |
| 1528 | **An-ri Truter Roodt** | Truter Roodt / An-ri | CONFIRMED | AGA(SA) | SAICA | CTBA Tax and Business Advisory | Western Cape/Tygervalley | https://za.linkedin.com/in/an-ri-truter-roodt |
| 1529 | **Mikateko Tshetshe** | Tshetshe / Mikateko | CONFIRMED | FCMA, CGMA | CIMA | Unilever | — | — |
| 1530 | **Lehlohonolo Tsotetsi** | Tsotetsi / Lehlohonolo | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Gauteng/City of Johannesburg | https://www.linkedin.com/in/lehlohonolo-tsotetsi-8a79451ba/ |
| 1531 | **Tebogo Tuba** | Tuba / Tebogo | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Western Cape/City of Cape Town | https://www.linkedin.com/in/tebogo-tuba-08b8597b/ |
| 1532 | **Kelly Turck** | Turck / Kelly | FINANCE_ROLE_CONFIRMED | — | — | Capespan South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/kelly-turck-310b8a33/ |
| 1533 | **Liyema Tweni** | Tweni / Liyema | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/Cape Town | https://www.linkedin.com/in/liyema-tweni-9688b9178/ |
| 1534 | **Sipumeze Tyali** | Tyali / Sipumeze | CONFIRMED | PA(SA) | SAIPA | DigiOutsource | Western Cape/Cape Town | https://za.linkedin.com/in/sipumeze-tyali-professional-accountant-sa-saipa-295a14140 |
| 1535 | **Ashtyn Tyler** | Tyler / Ashtyn | CONFIRMED | CA(SA) | SAICA | OVEX | Western Cape location NOT confirmed — X-ray query association only | — |
| 1536 | **Ashtyn Tyler** | Tyler / Ashtyn | CONFIRMED | CA(SA) | SAICA | OVEX | Western Cape/Western Cape | — |
| 1537 | **Lumka Unathi Kappel** | Unathi Kappel / Lumka | CONFIRMED | CA(SA) | SAICA | Astron Energy | Western Cape/City of Cape Town | https://www.linkedin.com/in/lumka-unathi-kappel-ca-sa-2a54b1133/ |
| 1538 | **Deon Uys** | Uys / Deon | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | — | https://www.linkedin.com/in/deon-uys-99771523/ |
| 1539 | **Bernadette V.** | V. / Bernadette | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/Johannesburg | https://www.linkedin.com/in/bernadette-v-854989212/ |
| 1540 | **Amanda Vakalisa** | Vakalisa / Amanda | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Gauteng/City of Johannesburg | https://www.linkedin.com/in/amanda-vakalisa-acma-cgma-mba-a250b866/ |
| 1541 | **Nina Valentine (nee. Coetzee)** | Valentine (nee. Coetzee) / Nina | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Western Cape/City of Cape Town | https://www.linkedin.com/in/nina-valentine-nee-coetzee-b1416a139/ |
| 1542 | **Welgemoed Valerie** | Valerie / Welgemoed | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/welgemoed-valerie-5923b48a/ |
| 1543 | **Linda Van Deemter** | Van Deemter / Linda | FINANCE_ROLE_CONFIRMED | — | — | EnviroServ | Gauteng/Johannesburg | https://www.linkedin.com/in/linda-van-deemter-0611a911/ |
| 1544 | **Johan Van den Elst** | Van den Elst / Johan | FINANCE_ROLE_CONFIRMED | — | — | KWV | Western Cape/Paarl | https://www.linkedin.com/in/johan-van-den-elst-559747204/ |
| 1545 | **Ben Van Der Linde** | Van Der Linde / Ben | CONFIRMED | PA(SA) | SAIPA | — | Western Cape | https://za.linkedin.com/in/ben-van-der-linde |
| 1546 | **Arjan Van der Lugt** | Van der Lugt / Arjan | RESEARCH_HOLD | — | — | The Fruit Farm Group South Africa | Western Cape | https://za.linkedin.com/in/arjan-van-der-lugt-2b991384 |
| 1547 | **Derick van der Merwe** | van der Merwe / Derick | CONFIRMED | CA(SA) | SAICA | DVDM Properties | KwaZulu-Natal/Durbanville | — |
| 1548 | **DeWalt Van Der Merwe** | Van Der Merwe / DeWalt | RESEARCH_HOLD | PA(SA) | SAIPA | CASADOBE PROPS 60 / MNK Projects Group | Western Cape/Cape Town | — |
| 1549 | **Ferdie van der Merwe** | van der Merwe / Ferdie | CONFIRMED | CA(SA) | SAICA | VDMV Property Group | Western Cape/Cape Town | — |
| 1550 | **Geraldine Van Der Merwe** | Van Der Merwe / Geraldine | FINANCE_ROLE_CONFIRMED | — | — | Concor | Gauteng/City of Johannesburg | https://www.linkedin.com/in/geraldine-van-der-merwe-213ba2179/ |
| 1551 | **IR Van der Merwe** | Van der Merwe / IR | CONFIRMED | CA(SA) | SAICA | Raubex Group | Free State/Bloemfontein | https://www.linkedin.com/in/ir-van-der-merwe-a3a76955/ |
| 1552 | **IR van der Merwe** | van der Merwe / IR | REJECTED | CA(SA) | SAICA | Raubex Group | Western Cape/Western Cape | — |
| 1553 | **Leandra van der Merwe** | van der Merwe / Leandra | FINANCE_ROLE_CONFIRMED | — | — | Peninsula Beverages | Western Cape/City of Cape Town | https://www.linkedin.com/in/leandra-van-der-merwe-4aa73511a/ |
| 1554 | **Nadia van der Merwe** | van der Merwe / Nadia | CONFIRMED | CA(SA) | SAICA | VDMV Property Group | Western Cape/Cape Town | — |
| 1555 | **Peet van der Merwe** | van der Merwe / Peet | CONFIRMED | CA(SA) | SAICA | Forvis Mazars in South Africa | Free State/Bloemfontein | https://www.linkedin.com/in/peet-van-der-merwe-ca-sa-ra-8320b7a6/ |
| 1556 | **Annette van der Vyver** | van der Vyver / Annette | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/annette-van-der-vyver-85711734 |
| 1557 | **Jo-Anne van der Walt** | van der Walt / Jo-Anne | CONFIRMED | PA(SA) | SAIPA | Wauko | Western Cape/Cape Town | https://za.linkedin.com/in/jo-anne-van-der-walt-0016b7128 |
| 1558 | **Joe van der Walt** | van der Walt / Joe | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Western Cape/City of Cape Town | https://www.linkedin.com/in/joe-van-der-walt-5a268616/ |
| 1559 | **Lizaan van der Walt** | van der Walt / Lizaan | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Paarl | https://www.linkedin.com/in/lizaan-van-der-walt-664293147/ |
| 1560 | **Vinita van der Walt** | van der Walt / Vinita | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/vinita-van-der-walt-39507781/ |
| 1561 | **Adri Van Der Westhuizen** | Van Der Westhuizen / Adri | FINANCE_ROLE_CONFIRMED | — | — | AfriSam | — | https://www.linkedin.com/in/adri-van-der-westhuizen-02309041/ |
| 1562 | **Ansie van der Westhuizen** | van der Westhuizen / Ansie | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/ansie-van-der-westhuizen-a89861146/ |
| 1563 | **Marilé Van der Westhuizen** | Van der Westhuizen / Marilé | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Gauteng/City of Johannesburg | https://www.linkedin.com/in/marilé-van-der-westhuizen-098343b0/ |
| 1564 | **Nadia Van Der Westhuizen** | Van Der Westhuizen / Nadia | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 1565 | **Tinu van der Westhuizen** | van der Westhuizen / Tinu | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/tinuv/ |
| 1566 | **Cornell van Eeden** | van Eeden / Cornell | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 1567 | **Zahn-Mari van Eeden** | van Eeden / Zahn-Mari | CONFIRMED | PA(SA) | SAIPA | KEE Property Investments | Western Cape/Stellenbosch | https://za.linkedin.com/in/zahn-mari-van-eeden-a10414127 |
| 1568 | **Christel van Greunen** | van Greunen / Christel | CONFIRMED | ACMA, CGMA | CIMA | fibertime | Western Cape/Cape Town | https://za.linkedin.com/in/christelvangreunen |
| 1569 | **Madele Van Heerden** | Van Heerden / Madele | FINANCE_ROLE_CONFIRMED | — | — | Brito's Group | Western Cape/Cape Town | https://www.linkedin.com/in/madele-van-heerden-ab60a334/ |
| 1570 | **Anton van Niekerk** | van Niekerk / Anton | CONFIRMED | ACMA, CGMA | CIMA | Snapplify | Western Cape/Cape Town | https://www.linkedin.com/in/anton-van-niekerk-acma-b7503b87/ |
| 1571 | **Brink van Niekerk** | van Niekerk / Brink | FINANCE_ROLE_CONFIRMED | — | — | Averda South Africa | South Africa | https://www.linkedin.com/in/cbgvanniekerk/ |
| 1572 | **Charmaine van Niekerk** | van Niekerk / Charmaine | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/City of Johannesburg | https://www.linkedin.com/in/charmaine-van-niekerk-788a3589/ |
| 1573 | **Francois van Niekerk** | van Niekerk / Francois | CONFIRMED | CA(SA) | SAICA | Origin Property Holdings | Western Cape/Cape Town | — |
| 1574 | **Gerrit van Niekerk** | van Niekerk / Gerrit | CONFIRMED | CA(SA) | SAICA | Isipani Construction | Western Cape/City of Cape Town / Paarl | https://za.linkedin.com/in/gerrit-van-niekerk-8195587 |
| 1575 | **Monique van Niekerk** | van Niekerk / Monique | CONFIRMED | AGA(SA) | SAICA | Creative CFO | Western Cape/Cape Town | https://za.linkedin.com/in/monique-van-niekerk-aga-sa-497898125 |
| 1576 | **Tanya van Niekerk** | van Niekerk / Tanya | CONFIRMED | CA(SA) | SAICA | Natural Selection Travel | Western Cape/Somerset West | — |
| 1577 | **Ger-Mari Van Niekerk (CA)(SA)** | Van Niekerk (CA)(SA) / Ger-Mari | FINANCE_ROLE_CONFIRMED | — | — | Kaap Agri / Agrimark | South Africa | https://www.linkedin.com/in/ger-mari-van-niekerk-ca-sa-5a96a0120/ |
| 1578 | **Ralton van Reenen** | van Reenen / Ralton | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/City of Cape Town | https://www.linkedin.com/in/ralton-van-reenen-633520119/ |
| 1579 | **Ewan van Rensburg** | van Rensburg / Ewan | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/ewan-van-rensburg-538732b/ |
| 1580 | **Johann van Rensburg** | van Rensburg / Johann | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 1581 | **Stephan van Rensburg** | van Rensburg / Stephan | FINANCE_ROLE_CONFIRMED | — | — | Kaap Agri / Agrimark | Western Cape/Paarl | https://www.linkedin.com/in/stephan-van-rensburg-9b62b914a/ |
| 1582 | **Egbert Van Romburgh** | Van Romburgh / Egbert | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Western Cape/Durbanville | https://www.linkedin.com/in/egbert-van-romburgh-6014821b9/ |
| 1583 | **Rene Van Rooyen** | Van Rooyen / Rene | CONFIRMED | CA(SA) | SAICA | Fairtree | Western Cape/Western Cape | — |
| 1584 | **Tania van Rooyen** | van Rooyen / Tania | CONFIRMED | CA(SA) | SAICA | Employer verify; former Maitland | Western Cape/Western Cape | — |
| 1585 | **Charl Van Schalkwyk** | Van Schalkwyk / Charl | FINANCE_ROLE_CONFIRMED | — | — | Raubex / Roadmac Surfacing Cape | Free State/Bloemfontein | https://www.linkedin.com/in/charl-van-schalkwyk-a6229533/ |
| 1586 | **Deon van Schalkwyk** | van Schalkwyk / Deon | FINANCE_ROLE_CONFIRMED | — | — | Capespan South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/deon-van-schalkwyk-22481044/ |
| 1587 | **Dian van Schalkwyk** | van Schalkwyk / Dian | CONFIRMED | CA(SA) | SAICA | Current employer unconfirmed | Western Cape | — |
| 1588 | **Judy van Staden** | van Staden / Judy | CONFIRMED | CA(SA) | SAICA | Mulilo | Western Cape/Cape Town | — |
| 1589 | **Anneke van Tonder** | van Tonder / Anneke | FINANCE_ROLE_CONFIRMED | — | — | NJR Steel | Gauteng/Roodepoort | https://www.linkedin.com/in/anneke-van-tonder-8a8171297/ |
| 1590 | **Owen van Tonder** | van Tonder / Owen | CONFIRMED | CA(SA) | SAICA | Woolworths Holdings Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/owen-van-tonder-ca-sa-a8482131/ |
| 1591 | **Villiers van Veen** | van Veen / Villiers | FINANCE_ROLE_CONFIRMED | — | — | Sentraal-Suid Co-operative (SSK) | Western Cape/Swellendam | https://www.linkedin.com/in/villiers-van-veen-44399b3a/ |
| 1592 | **Ernst van Vondel** | van Vondel / Ernst | CONFIRMED | CA(SA) | SAICA | Power Construction | Western Cape/City of Cape Town | https://www.linkedin.com/in/vondel/ |
| 1593 | **Ernst van Vondel** | van Vondel / Ernst | REJECTED | CA(SA) | SAICA | Power Construction | Western Cape/Cape Town | — |
| 1594 | **Celecia Van Wyk** | Van Wyk / Celecia | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | — | https://www.linkedin.com/in/celecia-van-wyk-ba5402114/ |
| 1595 | **Kirstin van Wyk** | van Wyk / Kirstin | CONFIRMED | CA(SA) | SAICA | DigicapeSA | Western Cape/Cape Town | — |
| 1596 | **Carlo Van Zyl** | Van Zyl / Carlo | RESEARCH_HOLD | — | — | Shoprite Group | Western Cape | https://za.linkedin.com/in/carlo-van-zyl-7805baa2 |
| 1597 | **Jana van Zyl** | van Zyl / Jana | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 1598 | **Jani van Zyl** | van Zyl / Jani | FINANCE_ROLE_CONFIRMED | — | — | KWV | South Africa | https://www.linkedin.com/in/jani-van-zyl-ca-sa-b46a0116a/ |
| 1599 | **Niel Van Zyl** | Van Zyl / Niel | CONFIRMED | ACMA, CGMA | CIMA | Pepkor Payments and Lending | Western Cape/Cape Town | https://za.linkedin.com/in/niel-van-zyl-02462a182 |
| 1600 | **Sonja Van Zyl** | Van Zyl / Sonja | CONFIRMED | AGA(SA) | SAICA | Acredo Accounting | Western Cape/Durbanville | https://za.linkedin.com/in/sonja-van-zyl-saica-associate-general-accountant-96a9362a |
| 1601 | **Werner van Zyl** | van Zyl / Werner | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Gauteng/Benoni | https://www.linkedin.com/in/werner-van-zyl-ca-sa-a6347a105/ |
| 1602 | **Willene van Zyl** | van Zyl / Willene | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 1603 | **Jayvant Vassen** | Vassen / Jayvant | FINANCE_ROLE_CONFIRMED | — | — | Capespan South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/jayvant-vassen-9529a71b8/ |
| 1604 | **Xelani Vathiwe** | Vathiwe / Xelani | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/George | https://www.linkedin.com/in/xelani-vathiwe-1371902a/ |
| 1605 | **Ross Veenstra** | Veenstra / Ross | CONFIRMED | CA(SA) | SAICA | WaterBorne Capital | Western Cape/Cape Town | — |
| 1606 | **Ross Veenstra** | Veenstra / Ross | CONFIRMED | CA(SA) | SAICA | WaterBorne Capital | Western Cape/Cape Town | — |
| 1607 | **Claudia Vega Barandiarán** | Vega Barandiarán / Claudia | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | Gauteng/City of Johannesburg | https://www.linkedin.com/in/claudiavegabarandiaran/ |
| 1608 | **Lee Veldsman** | Veldsman / Lee | CONFIRMED | CA(SA) | SAICA | Lycopodium | Western Cape/Cape Town | — |
| 1609 | **Lee Veldsman** | Veldsman / Lee | CONFIRMED | CA(SA) | SAICA | Lycopodium | Western Cape/Cape Town | — |
| 1610 | **Louis Veldsman** | Veldsman / Louis | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Western Cape/City of Cape Town | https://www.linkedin.com/in/louisveldsmanza/ |
| 1611 | **Chane Du Venage** | Venage / Chane Du | CONFIRMED | CA(SA) | SAICA | Unitrans | Western Cape/Cape Town | — |
| 1612 | **Chané du Venage** | Venage / Chané du | CONFIRMED | CA(SA) | SAICA | Unitrans | Western Cape/Cape Town | — |
| 1613 | **J (Jay) Venkanna** | Venkanna / J (Jay) | RESEARCH_HOLD | CA(SA) | SAICA | Kansai Plascon Africa | — | — |
| 1614 | **Brendan Venter** | Venter / Brendan | CONFIRMED | AGA(SA) | SAICA | EVOLABS | Western Cape/Cape Town | https://za.linkedin.com/in/brendan-venter-aga-sa-7864827a |
| 1615 | **Daniele Venter** | Venter / Daniele | FINANCE_ROLE_CONFIRMED | — | — | SA Metal Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/daniele-venter-778276121/ |
| 1616 | **Freda Venter** | Venter / Freda | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/freda-venter-b7a43687/ |
| 1617 | **Frikkie Venter** | Venter / Frikkie | CONFIRMED | PA(SA) | SAIPA | Southern African Fruit Terminals | Western Cape/Cape Town | https://za.linkedin.com/in/frikkie-venter-professional-accountant-sa-8891b510a |
| 1618 | **Inga Venter** | Venter / Inga | CONFIRMED | PA(SA) | SAIPA | FTTx And Energy Warehouse | Western Cape/Cape Town | https://za.linkedin.com/in/inga-venter-professional-accountant-sa-5aa62ba6 |
| 1619 | **Joani Venter** | Venter / Joani | CONFIRMED | AGA(SA) | SAICA | Fingri Chartered Accountants | Western Cape/Stellenbosch | https://za.linkedin.com/in/joani-venter-aga-sa-763703236 |
| 1620 | **Quintin Venter** | Venter / Quintin | HIGH_CONFIDENCE | PA(SA) | SAIPA | Sempre Financial Group | Western Cape/Bellville (Cape Town) | — |
| 1621 | **Monique Venter ACMA, CGMA** | Venter ACMA, CGMA / Monique | CONFIRMED | ACMA, CGMA | CIMA | — | Western Cape | https://za.linkedin.com/in/monique-venter-742057b3 |
| 1622 | **Barnus Vermeulen** | Vermeulen / Barnus | CONFIRMED | PA(SA) | SAIPA | PSG Konsult / PSG Financial Services | Western Cape/PSG Cape Town ecosystem | https://za.linkedin.com/in/barnus-vermeulen-865a2589 |
| 1623 | **Herman Vermeulen** | Vermeulen / Herman | FINANCE_ROLE_CONFIRMED | — | — | Southern Oil (SOILL) | Western Cape/Swellendam | https://www.linkedin.com/in/herman-vermeulen-ca-sa-6a322892/ |
| 1624 | **Mariska Vermeulen** | Vermeulen / Mariska | FINANCE_ROLE_CONFIRMED | — | — | Southern Oil (SOILL) | Western Cape/Swellendam | https://www.linkedin.com/in/mariska-vermeulen-48b8b6255/ |
| 1625 | **John Vertue** | Vertue / John | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/john-vertue-99721264 |
| 1626 | **Vijedharsan Vijendranath** | Vijendranath / Vijedharsan | CONFIRMED | FCCA | ACCA | — | Gauteng/Johannesburg | https://www.linkedin.com/in/vijedharsan-vijendranath-fcca-uk-6118b1103/ |
| 1627 | **Berenice Vilander** | Vilander / Berenice | RESEARCH_HOLD | PA(SA) | SAIPA | Western Cape Government / Sanlam background | Western Cape/Cape Town | — |
| 1628 | **Chantal Viljoen** | Viljoen / Chantal | RESEARCH_HOLD | — | — | TEKCOPAC | Western Cape | https://za.linkedin.com/in/chantal-viljoen-5552aa99 |
| 1629 | **Willie Viljoen** | Viljoen / Willie | CONFIRMED | AGA(SA) | SAICA | IJ Smith & Co Inc | Western Cape/Somerset West | https://za.linkedin.com/in/willie-viljoen-aga-sa-475733218 |
| 1630 | **Carla de Villiers** | Villiers / Carla de | NEEDS_VERIFICATION | Chartered Accountant | — | Atterbury Property | Location to verify | — |
| 1631 | **Peter de Villiers** | Villiers / Peter de | NEEDS_VERIFICATION | Chartered Accountant | — | Attacq | — | — |
| 1632 | **Ruan de Villiers** | Villiers / Ruan de | NEEDS_VERIFICATION | Chartered Accountant | — | Stor-Age Property REIT | Western Cape/Cape Town | — |
| 1633 | **Qinisela Vincent Rasmeni** | Vincent Rasmeni / Qinisela | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/qinisela-vincent-rasmeni-0805b3ab/ |
| 1634 | **Henlie Viola** | Viola / Henlie | FINANCE_ROLE_CONFIRMED | — | — | Kaap Agri / Agrimark | Western Cape/City of Cape Town | https://www.linkedin.com/in/henlie-viola-ca-sa-24545a144/ |
| 1635 | **Mart-Marie Visagie** | Visagie / Mart-Marie | FINANCE_ROLE_CONFIRMED | — | — | Brito's Group | Western Cape/Cape Town | https://www.linkedin.com/in/mart-marie-visagie-34bb99104/ |
| 1636 | **Chrizelda Visser** | Visser / Chrizelda | CONFIRMED | ACMA, CGMA | CIMA | Curated Beverages Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/chrizelda-visser-acma-cgma-3671b454/ |
| 1637 | **Paul Visser** | Visser / Paul | RESEARCH_HOLD | CA(SA) | SAICA | Stefanutti Stocks (Civils) | Gauteng/Pretoria | — |
| 1638 | **Werner Vlok** | Vlok / Werner | CONFIRMED | CA(SA) | SAICA | Renewables company – verify | Western Cape location NOT confirmed — X-ray query association only | — |
| 1639 | **Werner Vlok** | Vlok / Werner | CONFIRMED | CA(SA) | SAICA | Renewables company – verify | Western Cape/Western Cape | — |
| 1640 | **Gareth Voke** | Voke / Gareth | CONFIRMED | CA(SA) | SAICA | The Building Company | Western Cape location NOT confirmed — X-ray query association only | — |
| 1641 | **Gareth Voke** | Voke / Gareth | CONFIRMED | CA(SA) | SAICA | The Building Company | Western Cape/Western Cape | — |
| 1642 | **Bronwyn Von Maltitz** | Von Maltitz / Bronwyn | CONFIRMED | AGA(SA) | SAICA | CrossBoundary Energy | Western Cape/Cape Town | https://za.linkedin.com/in/bronwyn-von-maltitz-aga-sa-78b17910b |
| 1643 | **Wilhelm Von Westernhagen** | Von Westernhagen / Wilhelm | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/wilhelm-von-westernhagen-a047b684/ |
| 1644 | **Ernst van Vondel** | Vondel / Ernst van | REJECTED | CA(SA) | SAICA | Power Construction | Cape Town / Blackheath | — |
| 1645 | **Christiaan Vorster** | Vorster / Christiaan | CONFIRMED | CA(SA) | SAICA | SAICA | Western Cape/Cape Town | — |
| 1646 | **Monika Vorster** | Vorster / Monika | FINANCE_ROLE_CONFIRMED | — | — | Raubex / Roadmac Surfacing Cape | Bloemfontein Metropolitan Area | https://www.linkedin.com/in/monika-vorster-5773711a3/ |
| 1647 | **Nhlakanipho Vusi Mpungose (CFE)** | Vusi Mpungose (CFE) / Nhlakanipho | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | Gauteng/Gauteng | https://www.linkedin.com/in/nhlakanipho-mpungose-5b6545282/ |
| 1648 | **Firdoze Wadee** | Wadee / Firdoze | CONFIRMED | CA(SA) | SAICA | Scatec ASA | Western Cape/Cape Town | — |
| 1649 | **Firdoze Wadee** | Wadee / Firdoze | CONFIRMED | CA(SA) | SAICA | Scatec ASA | Western Cape/Cape Town | — |
| 1650 | **Nazeer Wadee** | Wadee / Nazeer | CONFIRMED | CA(SA) | SAICA | Mediclinic Southern Africa | — | — |
| 1651 | **Marco Wagener** | Wagener / Marco | HIGH_CONFIDENCE | PA(SA) | SAIPA | Excellentia Accounting and Tax Solutions | — | — |
| 1652 | **Mark Wagenheim** | Wagenheim / Mark | CONFIRMED | CA(SA) | SAICA | Ingenuity Property Investments | Western Cape – confirm | — |
| 1653 | **Mark Wagenheim** | Wagenheim / Mark | CONFIRMED | CA(SA) | SAICA | Ingenuity Property Investments | Western Cape/Western Cape | — |
| 1654 | **Ashleigh Waite** | Waite / Ashleigh | CONFIRMED | AGA(SA) | SAICA | JTC Group | Western Cape/Cape Town | https://za.linkedin.com/in/ashleigh-waite-aga-sa-bb1b8a169 |
| 1655 | **Fatima Wakeford** | Wakeford / Fatima | CONFIRMED | CA(SA) | SAICA | WBHO Construction | Johannesburg, Gauteng — published | — |
| 1656 | **Fatima Wakeford** | Wakeford / Fatima | CONFIRMED | CA(SA) | SAICA | WBHO Construction | Gauteng | — |
| 1657 | **Robert Walsh** | Walsh / Robert | CONFIRMED | CA(SA) | SAICA | Unconfirmed | Western Cape/Cape Town | — |
| 1658 | **Johan van der Walt** | Walt / Johan van der | CONFIRMED | CA(SA) | SAICA | Deloitte Africa | — | — |
| 1659 | **Philip Wapenaar** | Wapenaar / Philip | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/philipwapenaar |
| 1660 | **Saneesa Ward** | Ward / Saneesa | CONFIRMED | CA(SA) | SAICA | Raubex / Roadmac Surfacing Cape | Free State/Bloemfontein | https://www.linkedin.com/in/saneesa-ward-ca-sa-3a3533136/ |
| 1661 | **Nicola Wasserman** | Wasserman / Nicola | CONFIRMED | CA(SA) | SAICA | Shoprite Group | Brackenfell, Cape Town | — |
| 1662 | **Nicola Wasserman** | Wasserman / Nicola | CONFIRMED | CA(SA) | SAICA | Shoprite Group | Western Cape/Cape Town | — |
| 1663 | **Alexandra Watkins-Baker** | Watkins-Baker / Alexandra | CONFIRMED | CA(SA) | SAICA | Ingenuity Property Investments | Western Cape/Cape Town | — |
| 1664 | **Alexandra Watkins-Baker** | Watkins-Baker / Alexandra | CONFIRMED | CA(SA) | SAICA | Ingenuity Property Investments | Western Cape/Cape Town | — |
| 1665 | **Calum Wedge** | Wedge / Calum | NEEDS_VERIFICATION | Chartered Accountant | — | Rawson Developers | Western Cape/Cape Town | — |
| 1666 | **Calum Wedge** | Wedge / Calum | CONFIRMED | CA(SA) | SAICA | Rawson Developers | Western Cape/Cape Town | — |
| 1667 | **Cecil Wehmeyer ACMA, CGMA** | Wehmeyer ACMA, CGMA / Cecil | CONFIRMED | ACMA, CGMA | CIMA | DataEQ | Western Cape | https://za.linkedin.com/in/cecilwehmeyer |
| 1668 | **Aadam Wei** | Wei / Aadam | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/aadam-wei-ca-sa-7a0063113/ |
| 1669 | **Kirsten Wentzel** | Wentzel / Kirsten | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | Johannesburg Metropolitan Area | https://www.linkedin.com/in/kirsten-wentzel-a4a138178/ |
| 1670 | **Ross Wentzel** | Wentzel / Ross | CONFIRMED | CA(SA) | SAICA | African Infrastructure Investment Managers | Western Cape location NOT confirmed — X-ray query association only | — |
| 1671 | **Ross Wentzel** | Wentzel / Ross | CONFIRMED | CA(SA) | SAICA | African Infrastructure Investment Managers | Western Cape/Western Cape | — |
| 1672 | **Shelley Wessels** | Wessels / Shelley | CONFIRMED | CA(SA) | SAICA | PetroSA | Western Cape/City of Cape Town | https://www.linkedin.com/in/shelley-wessels/ |
| 1673 | **Derick Wesson** | Wesson / Derick | CONFIRMED | CA(SA) | SAICA | PKF Cape Town | Western Cape/Cape Town | — |
| 1674 | **Craig West** | West / Craig | CONFIRMED | AGA(SA) | SAICA | WCB Property Development | Western Cape/Cape Town | https://za.linkedin.com/in/craig-west-aga-sa-562a81a2 |
| 1675 | **Letechia Westhuizen** | Westhuizen / Letechia | NEEDS_VERIFICATION | Chartered Accountant | — | The Building Company | Western Cape/Cape Town | — |
| 1676 | **Cecilia de Wet** | Wet / Cecilia de | CONFIRMED | CA(SA) | SAICA | Growthpoint Properties | Cape Town – confirm | — |
| 1677 | **Russell Weyer** | Weyer / Russell | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | South Africa | https://www.linkedin.com/in/russell-weyer-3209845b/ |
| 1678 | **Johanien White** | White / Johanien | NEEDS_VERIFICATION | Chartered Accountant | — | Faircape Group | Western Cape/Cape Town | — |
| 1679 | **Karly White** | White / Karly | NEEDS_VERIFICATION | Chartered Accountant | — | Rex Trueform Group | — | — |
| 1680 | **Shandré Whittles** | Whittles / Shandré | CONFIRMED | AGA(SA) | SAICA | RPF Africa | Western Cape | https://za.linkedin.com/in/shandr%C3%A9-whittles-aga-sa-9a14a4143 |
| 1681 | **Michelle Wiegman** | Wiegman / Michelle | CONFIRMED | CA(SA) | SAICA | TotalEnergies Renewables SA | Western Cape location NOT confirmed — X-ray query association only | — |
| 1682 | **Michelle Wiegman** | Wiegman / Michelle | CONFIRMED | CA(SA) | SAICA | TotalEnergies Renewables SA | Western Cape/Western Cape | — |
| 1683 | **Adrian Wiese** | Wiese / Adrian | CONFIRMED | CA(SA) | SAICA | Unconfirmed (summary: 'Finance Manager at a fast-growing SaaS company'; experience lists Sedna, Cape Town) | City of Cape Town, Western Cape | — |
| 1684 | **Jeanie Wiese** | Wiese / Jeanie | ARTICLES_CONFIRMED_DESIGNATION_UNVERIFIED | — | — | Le Roux Fruit Exporters | Western Cape | https://za.linkedin.com/in/jeanie-wiese-3907343a |
| 1685 | **Zach Wiid** | Wiid / Zach | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Mpumalanga/Nelspruit | https://www.linkedin.com/in/zach-wiid-854b921b2/ |
| 1686 | **Stephen Willenburg** | Willenburg / Stephen | CONFIRMED | CA(SA) | SAICA | Cape Town Central City Improvement District | Western Cape location NOT confirmed — X-ray query association only | — |
| 1687 | **Stephen Willenburg** | Willenburg / Stephen | CONFIRMED | CA(SA) | SAICA | Cape Town Central City Improvement District | Western Cape/Western Cape | — |
| 1688 | **Justin Williams** | Williams / Justin | CONFIRMED | AGA(SA), ACMA, CGMA | SAICA, CIMA | Ares Holdings | Western Cape/Cape Town | https://za.linkedin.com/in/justin-williams-acma-cgma-06ab1a1a0 |
| 1689 | **Saneesa Williams** | Williams / Saneesa | RESEARCH_HOLD | CA(SA) | SAICA | Raubex | Free State/Bloemfontein | — |
| 1690 | **Mark Willimott** | Willimott / Mark | CONFIRMED | CA(SA) | SAICA | BDO South Africa | Eastern Cape/Gqeberha (Port Elizabeth) | — |
| 1691 | **Cindy-Lee Wilson** | Wilson / Cindy-Lee | RESEARCH_HOLD | — | — | PSG Financial Services | Western Cape | — |
| 1692 | **Gregory Wilson** | Wilson / Gregory | CONFIRMED | CA(SA) | SAICA | Java Capital | — | — |
| 1693 | **Mike Wilson** | Wilson / Mike | CONFIRMED | CA(SA) | SAICA | Sun International (as at 2019) | — | — |
| 1694 | **Emeal Winston (Emeal) van der Westhuizen** | Winston (Emeal) van der Westhuizen / Emeal | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Gauteng/City of Johannesburg | https://www.linkedin.com/in/emeal-winston-van-der-westhuizen-25925a57/ |
| 1695 | **Suzaan de Wit** | Wit / Suzaan de | CONFIRMED | CA(SA) | SAICA | LSP Group | City to verify | — |
| 1696 | **Keenen Witbooi** | Witbooi / Keenen | FINANCE_ROLE_CONFIRMED | — | — | Peninsula Beverages | South Africa | https://www.linkedin.com/in/keenen-witbooi-2622a5a9/ |
| 1697 | **Wilhelm Witte** | Witte / Wilhelm | CONFIRMED | CA(SA) | SAICA | Employer verify | Western Cape location NOT confirmed — X-ray query association only | — |
| 1698 | **Wilhelm Witte** | Witte / Wilhelm | CONFIRMED | CA(SA) | SAICA | Employer verify | Western Cape/Western Cape | — |
| 1699 | **Taryn Woodbridge** | Woodbridge / Taryn | CONFIRMED | CA(SA) | SAICA | Mercedes-Benz South Africa Ltd | — | — |
| 1700 | **Luke Woodhouse** | Woodhouse / Luke | CONFIRMED | CA(SA) | SAICA | GUUD GLOBAL | Gauteng/Johannesburg | https://www.linkedin.com/in/luke-woodhouse-ca-sa-b31a0149/ |
| 1701 | **Gretchen Wrigley** | Wrigley / Gretchen | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Western Cape/City of Cape Town | https://www.linkedin.com/in/gretchen-wrigley-3777a443/ |
| 1702 | **Kirstin van Wyk** | Wyk / Kirstin van | CONFIRMED | CA(SA) | SAICA | DigicapeSA | Cape Town, Western Cape | — |
| 1703 | **Sameera Yusuf** | Yusuf / Sameera | CONFIRMED | CA(SA) | SAICA | Employer verify | Western Cape location NOT confirmed — X-ray query association only | — |
| 1704 | **Sameera Yusuf** | Yusuf / Sameera | CONFIRMED | CA(SA) | SAICA | Employer verify | Western Cape/Western Cape | — |
| 1705 | **Nompumelelo Zama-Ngcongo** | Zama-Ngcongo / Nompumelelo | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Gauteng/City of Johannesburg | https://www.linkedin.com/in/nompumelelo-zama-ngcongo-087a8b65/ |
| 1706 | **Odwa Zamatyala** | Zamatyala / Odwa | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/odwa-zamatyala-24260b1a2/ |
| 1707 | **Bianka Zietsman** | Zietsman / Bianka | CONFIRMED | PA(SA) | SAIPA | Mpact | Gauteng/City of Johannesburg | https://www.linkedin.com/in/bianka-zietsman-268475111/ |
| 1708 | **Duval van Zijl** | Zijl / Duval van | CONFIRMED | CA(SA) | SAICA | Holocene | — | — |
| 1709 | **Sibusiso Zikalala** | Zikalala / Sibusiso | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/City of Johannesburg | https://www.linkedin.com/in/sibusiso-zikalala-46188238/ |
| 1710 | **Andisa Zinja** | Zinja / Andisa | CONFIRMED | CA(SA) | SAICA | Trans-Caledon Tunnel Authority (TCTA) | — | — |
| 1711 | **MOEGAMAT ZUBAIR ABDURAHMAN** | ZUBAIR ABDURAHMAN / MOEGAMAT | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Western Cape/Cape Town | https://www.linkedin.com/in/moegamat-zubair-abdurahman/ |
| 1712 | **Dumisani Zulu** | Zulu / Dumisani | CONFIRMED | AGA(SA) | SAICA | Bonakude Consulting (Pty) Ltd | KwaZulu-Natal/Port Shepstone | https://www.linkedin.com/in/dumisani-zulu-aga-sa-aimfo-a5a62622 |
| 1713 | **Sinethemba Zulu** | Zulu / Sinethemba | FINANCE_ROLE_CONFIRMED | — | — | Premier Fishing & Brands | Western Cape/Cape Town | https://www.linkedin.com/in/snethemba-zulu-29b00238/ |
| 1714 | **Brent Zutphen** | Zutphen / Brent | CONFIRMED | CA(SA) | SAICA | Globeleq | Western Cape/Cape Town | — |
| 1715 | **Brent Zutphen** | Zutphen / Brent | CONFIRMED | CA(SA) | SAICA | Globeleq | Western Cape/Cape Town | — |

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
| cmp-0199 | 1st Line Construction (Pty) Ltd | — | — |
| cmp-0191 | 36ONE Asset Management | Asset Management | — |
| cmp-0200 | A & C Maintenance and Construction | — | — |
| cmp-0201 | Abbeydale Infrastructure (Pty) Ltd | — | — |
| cmp-0202 | ABDA Projects | — | — |
| cmp-0203 | Abil Services and Construction | — | — |
| cmp-0039 | Absa Consultants & Actuaries | Financial Services | — |
| cmp-0018 | Absa Group | Banking | — |
| cmp-0036 | ACCA (South Africa) | Professional Services | — |
| cmp-0204 | Action Steel Doors CC | — | — |
| cmp-0057 | Adriaan de Lange Advisory | Professional Services | Cape Town |
| cmp-0090 | ADT South Africa (ADT Security Services (Pty) Ltd) | Private security / armed response / monitoring | — |
| cmp-0205 | Affordable Ceilings & Partitions | — | — |
| cmp-0114 | Afrimat | Building Materials | Western Cape, South Africa |
| cmp-0115 | AfriSam | Building Materials | Western Cape, South Africa |
| cmp-0206 | Airwise Airconditioning & Ventilation (Pty) Ltd | — | — |
| cmp-0207 | Albocon Construction Consultants | — | — |
| cmp-0208 | Aldera & Martina CC | — | — |
| cmp-0209 | Alpha Occupational Health Services | — | — |
| cmp-0210 | Alpine Scaffolding (PTY) LTD | — | — |
| cmp-0194 | Altron | Technology | — |
| cmp-0211 | Amlec | — | — |
| cmp-0212 | Anchor Builders West Coast | — | — |
| cmp-0080 | Anchor Industries (Pty) Ltd | Lifting, rigging, offshore mooring and marine engineering equipment/services | — |
| cmp-0213 | AR Projects & Developments (Pty) Ltd | — | — |
| cmp-0149 | Ardagh Glass Packaging SA | — | — |
| cmp-0059 | ASL | Professional Services | Somerset West |
| cmp-0134 | ASLA | — | — |
| cmp-0214 | Aspect Waterproofing (Pty) Ltd | — | — |
| cmp-0126 | Astron Energy | — | — |
| cmp-0215 | Atlantic iBuild (Pty) Ltd | — | — |
| cmp-0084 | Atlantis Special Economic Zone (Pty) Ltd (ASEZ / ASEZCo) | Special economic zone operator / industrial development | — |
| cmp-0216 | Atuba Construction Pty (Ltd) | — | — |
| cmp-0007 | Auditor-General of South Africa | Government | — |
| cmp-0073 | AYO Technology Solutions Limited | Technology | Cape Town |
| cmp-0217 | AZ Building and Project Management (Pty) Ltd | — | — |
| cmp-0218 | B and D Homebuilders (Pty) Ltd | — | — |
| cmp-0219 | B L Williams Construction Company (Pty) Ltd | — | — |
| cmp-0220 | B Salie & Sons Carpenters CC | — | — |
| cmp-0221 | Back to Wood cc | — | — |
| cmp-0010 | BAIC South Africa | Automotive | — |
| cmp-0222 | Baltic Group Projects | — | — |
| cmp-0223 | Baltic Timber Company (Pty) Ltd | — | — |
| cmp-0224 | Bambana Management Services (Pty) Ltd | — | — |
| cmp-0225 | Base Projects | — | — |
| cmp-0021 | Bayer (South Africa) | Pharmaceuticals | — |
| cmp-0226 | BB and S Building Services | — | — |
| cmp-0185 | BBF Safety Group | Manufacturing | — |
| cmp-0069 | BDO South Africa | Accounting / Audit | Johannesburg (Parktown), Cape Town, Stellenbosch, Gqeberha (Port Elizabeth), Durban, Pretoria |
| cmp-0227 | Bee Painters & Waterproofing | — | — |
| cmp-0228 | Benchmark Builders (Pty) Ltd | — | — |
| cmp-0229 | Benchmark Carriers TA Benchmark Construct cc | — | — |
| cmp-0178 | Betko Fresh Produce | — | — |
| cmp-0230 | BFH de Jager Project Managers | — | — |
| cmp-0231 | Big Ben Construction (Pty) Ltd | — | — |
| cmp-0232 | Binningtons | — | — |
| cmp-0233 | Blue Sky Construction Solutions | — | — |
| cmp-0017 | Bonakude Consulting (Pty) Ltd | Professional Services | — |
| cmp-0234 | Boshard Construction (Pty) Ltd | — | — |
| cmp-0064 | Boshoff Knoetze Chartered Accountants | Accounting / Audit | Somerset West (Helderberg) |
| cmp-0054 | Bounty Apparel | Manufacturing | Cape Town |
| cmp-0146 | Bowler Metcalf / Bowler Plastics | — | — |
| cmp-0235 | BPT Projects | — | — |
| cmp-0236 | Brand Engineering SA (Pty) Ltd | — | — |
| cmp-0043 | Brenn-O-Kem | Manufacturing | Stellenbosch / Worcester region (Western Cape) |
| cmp-0237 | Brick 'n Board Group (Pty) Ltd | — | — |
| cmp-0238 | BRICS Construction (Pty) Ltd | — | — |
| cmp-0239 | Brite Pools CC | — | — |
| cmp-0240 | Bruce Dundas Master Builders (Pty) Ltd | — | — |
| cmp-0108 | Buffalo City Metropolitan Development Agency (BCMDA) | Regional development agency | — |
| cmp-0241 | Building Enterprises | — | — |
| cmp-0242 | Bulldog Construction | — | — |
| cmp-0006 | Burstone | Property | — |
| cmp-0243 | C2C Construction | — | — |
| cmp-0066 | Callidus Accountants | Accounting / Audit | Somerset West |
| cmp-0244 | Calore Fireplaces and Stoves (Pty) Ltd | — | — |
| cmp-0245 | Cancun Construction | — | — |
| cmp-0246 | Cape Additions | — | — |
| cmp-0044 | Cape Chamber of Commerce & Industry | Non-Profit | Cape Town |
| cmp-0247 | Cape Dutch Construction CC | — | — |
| cmp-0248 | Cape Dutch Group CC | — | — |
| cmp-0249 | Cape Formwork Contractors | — | — |
| cmp-0183 | Cape Fruit Coolers | — | — |
| cmp-0250 | Cape Gate Fence and Wire Works | — | — |
| cmp-0251 | Cape Island Construction (Pty) Ltd | — | — |
| cmp-0252 | Cape Lime (Pty) Ltd | — | — |
| cmp-0253 | Cape Roof Supply & Contracting CC | — | — |
| cmp-0106 | Cape Town International Convention Centre (CTICC) / Cape Town Town Conventions | Convention, exhibition and event venue | — |
| cmp-0175 | Capespan South Africa | — | — |
| cmp-0254 | Capidek (Pty) Ltd | — | — |
| cmp-0255 | CBD Projects CC | — | — |
| cmp-0256 | CBS Group | — | — |
| cmp-0172 | Ceres Fruit Growers | — | — |
| cmp-0120 | Chryso Southern Africa | — | — |
| cmp-0037 | CIMA Africa | Professional Services | — |
| cmp-0257 | Cinamon Building Solutions | — | — |
| cmp-0118 | Ciolli Bros | Quarrying / Aggregates | Durbanville, Cape Town, Western Cape |
| cmp-0130 | Civils 2000 | — | — |
| cmp-0258 | Colortone | — | — |
| cmp-0181 | Commercial Cold Holdings | — | — |
| cmp-0259 | Communicare Roof Cleaning & Home Improvements | — | — |
| cmp-0260 | Compass Fire | — | — |
| cmp-0135 | Concor | — | — |
| cmp-0261 | Concord Access Solutions (Pty) Ltd | — | — |
| cmp-0262 | Construction Solution Services (Pty) Ltd | — | — |
| cmp-0263 | Coral Construction | — | — |
| cmp-0179 | Core Fruit | — | — |
| cmp-0264 | Corobrik (Pty) Ltd | — | — |
| cmp-0265 | Couru Construction (Pty) Ltd | — | — |
| cmp-0266 | Coverland | — | — |
| cmp-0267 | CP Painting & Decorators CC | — | — |
| cmp-0187 | Crawford Dougall Holdings | Insurance | — |
| cmp-0268 | CRS Construction (Pty) Ltd | — | — |
| cmp-0053 | Curated Beverages Ltd | FMCG | Cape Town (Tyger Valley) |
| cmp-0051 | Curro Holdings Ltd | Education | Cape Town (Durbanville) |
| cmp-0269 | Damp Control (Cape) CC | — | — |
| cmp-0270 | Dash Waste | — | — |
| cmp-0271 | David Ramsay & Associates | — | — |
| cmp-0272 | De Nobrega Construction | — | — |
| cmp-0273 | Dekon Projects (Pty) Ltd | — | — |
| cmp-0274 | Dekro Paints (Pty) Ltd | — | — |
| cmp-0023 | Deloitte (South Africa) | Accounting / Audit | — |
| cmp-0275 | DEP Solutions (Pty) Ltd | — | — |
| cmp-0276 | Derbigum Manufacturing | — | — |
| cmp-0277 | Developers Warehouse (Pty) Ltd | — | — |
| cmp-0278 | Developing Construction Solutions | — | — |
| cmp-0164 | DGB | — | — |
| cmp-0279 | DKB Projects CC | — | — |
| cmp-0280 | DNL Construction | — | — |
| cmp-0281 | DPG Construct (Pty) Ltd | — | — |
| cmp-0282 | Dracon National (Pty) Ltd | — | — |
| cmp-0197 | DRDGOLD Limited | Mining | — |
| cmp-0014 | Drone Ops Group | Technology | — |
| cmp-0184 | DSV | — | — |
| cmp-0174 | Dutoit Agri | — | — |
| cmp-0283 | Eagle Roof Tiles | — | — |
| cmp-0284 | Eco-Tide Building Management (Pty) Ltd | — | — |
| cmp-0285 | Econo Walling & Ceilings | — | — |
| cmp-0079 | Ecowize (Southern Africa) / Ecowize Group | Hygiene, sanitation and food-safety services | — |
| cmp-0286 | Eddie Stemmet Bouers (Pty)Ltd | — | — |
| cmp-0287 | Edge Plumbing (Pty) Ltd | — | — |
| cmp-0095 | Educor (Pty) Ltd - Educor Group | Private higher education: Damelin, CityVarsity, ICESA, Lyceum College, INTEC College, Damelin Correspondence College, Central Technical College | — |
| cmp-0288 | EF Davids Construction (Pty) Ltd | — | — |
| cmp-0289 | Elcarbo Industrial Supplies Cape (Pty) Ltd | — | — |
| cmp-0290 | Electrolux SA (Pty) Ltd | — | — |
| cmp-0093 | Electron Technologies (Electron Engineering Supply) | Electrical equipment, switchboards, automation, solar | — |
| cmp-0291 | Elegant Roofing | — | — |
| cmp-0292 | Elite Decorators cc | — | — |
| cmp-0293 | Elliot Shopfitters CC | — | — |
| cmp-0294 | Emcon Western Cape | — | — |
| cmp-0065 | Emma Pardoe Chartered Accountants (SA) | Accounting / Audit | Somerset West |
| cmp-0033 | Energy and Water Sector Education and Training Authority | Government | — |
| cmp-0096 | ENRC Africa (African operations of ENRC plc) | Diversified natural resources - mining, processing, energy, logistics | — |
| cmp-0295 | Enza Construction (Pty) Ltd | — | — |
| cmp-0296 | Exodos Cleaning and Projects | — | — |
| cmp-0144 | Fabrinox | — | — |
| cmp-0154 | Fair Cape Dairies | — | — |
| cmp-0297 | Fairbrother Construction CC | — | — |
| cmp-0298 | Fang Fences and Guards (Pty) Ltd | — | — |
| cmp-0299 | Farquharson Construction (Pty) Ltd | — | — |
| cmp-0034 | Financial Sector Conduct Authority | Government | — |
| cmp-0188 | First National Bank (FNB) | Banking | — |
| cmp-0300 | Flanagan Construction CC | — | — |
| cmp-0145 | Foct Engineering | — | — |
| cmp-0078 | Food Lover's Market | Food retail / independent supermarket wholesale group | — |
| cmp-0301 | Form-Scaff | — | — |
| cmp-0047 | Forvis Mazars in South Africa | Accounting / Audit | Cape Town (Century City), Johannesburg, Bloemfontein, Pretoria |
| cmp-0011 | Fourways Airconditioning | Engineering | — |
| cmp-0302 | FPD - Felix Property Developers | — | — |
| cmp-0303 | Framecore Construction (Pty) Ltd | — | — |
| cmp-0304 | Franki Africa (Pty) Ltd | — | — |
| cmp-0305 | Frazzo Construction (Pty) Ltd | — | — |
| cmp-0028 | Free State Provincial Treasury | Government | — |
| cmp-0306 | Frontline Safety Health & Enviromental Consultancy | — | — |
| cmp-0307 | Frost International | — | — |
| cmp-0081 | Fruit & Veg City / Freshstop | Food retail / convenience retail | — |
| cmp-0177 | Fruitways | — | — |
| cmp-0308 | Fugard Consulting (Pty) Ltd | — | — |
| cmp-0309 | Garden Cities NPC (RF) | — | — |
| cmp-0310 | Gateway Metalworks | — | — |
| cmp-0083 | Geiger & Klotzbucher (Pty) Ltd | Packaging equipment and materials for perishable food (BRC-certified printing/converting) | — |
| cmp-0311 | Geldenhuys Construction CC | — | — |
| cmp-0312 | Genko General Construction cc. | — | — |
| cmp-0313 | GeoCiv Group (Pty) Ltd | — | — |
| cmp-0314 | Glasshopper Wetton | — | — |
| cmp-0315 | Golden Rewards 1981 cc | — | — |
| cmp-0316 | Good Hope Plumbing | — | — |
| cmp-0317 | Gordian Fence SA (Pty) Ltd | — | — |
| cmp-0318 | GP Koning (Pty) Ltd | — | — |
| cmp-0319 | GR Building & Steel | — | — |
| cmp-0320 | Granite Connection CC | — | — |
| cmp-0020 | Grant Thornton (South Africa) | Accounting / Audit | — |
| cmp-0321 | Grassy Knoll Trading 59cc | — | — |
| cmp-0322 | Green Cube Construction | — | — |
| cmp-0323 | Greenfields Plumbing Design (Pty) Ltd | — | — |
| cmp-0324 | Greg Benn Contractors CC | — | — |
| cmp-0325 | Grenco Projects & Construction | — | — |
| cmp-0326 | Grinaker-LTA | — | — |
| cmp-0327 | Grinstead Plumbing CC | — | — |
| cmp-0328 | Gutter Science (Pty) Ltd. | — | — |
| cmp-0058 | GUUD GLOBAL | Technology | Cape Town |
| cmp-0137 | GVK-Siya Zama | — | — |
| cmp-0329 | GVK-Siya Zama Building Contractors (Cape) | — | — |
| cmp-0330 | H P Plum & Co (Pty) Ltd | — | — |
| cmp-0331 | H&I Construction (Pty) Ltd | — | — |
| cmp-0332 | Haefele Waterproofing | — | — |
| cmp-0333 | Handy Hubby | — | — |
| cmp-0002 | Harmony Gold Mining | Mining | — |
| cmp-0132 | Haw & Inglis | — | — |
| cmp-0163 | HEINEKEN Beverages | — | — |
| cmp-0086 | Helderberg Village | Retirement village / assisted living | — |
| cmp-0334 | Henk Meyer Restoration | — | — |
| cmp-0335 | HHL Handles Hinges & Locks | — | — |
| cmp-0336 | Hiload Inyanga Construction (Pty) Ltd | — | — |
| cmp-0104 | Hisense Operations Africa (Hisense SA) | Consumer electronics and appliances manufacturing/distribution | — |
| cmp-0337 | HomeRenu (Pty) Ltd | — | — |
| cmp-0338 | HSPE Construction & Project Management (Pty) Ltd | — | — |
| cmp-0339 | I van Niekerk Architectural Designs & Construction | — | — |
| cmp-0158 | I&J | — | — |
| cmp-0340 | Ian Paul Consulting Services CC | — | — |
| cmp-0341 | ICI Dulux (Pty) Ltd | — | — |
| cmp-0342 | IDP Construction (Pty) Ltd | — | — |
| cmp-0098 | Inala Broadcast (Pty) Ltd | Broadcast systems provision and integration | — |
| cmp-0343 | Indawo Cape (Pty) Ltd | — | — |
| cmp-0344 | Indawo Construction | — | — |
| cmp-0345 | Indusmed | — | — |
| cmp-0346 | Insrep Construction | — | — |
| cmp-0347 | Intertherm | — | — |
| cmp-0348 | Isaacs Construction | — | — |
| cmp-0349 | Ishco Construction (Pty) Ltd | — | — |
| cmp-0087 | Isilumko ATT (Pty) Ltd | IT services and BPO (applicant tracking, payroll outsourcing) | — |
| cmp-0138 | Isipani Construction | — | — |
| cmp-0350 | J Macdonald and Sons CC | — | — |
| cmp-0351 | J3 Construction (Pty) Ltd | — | — |
| cmp-0352 | JA Clift (Pty) Ltd | — | — |
| cmp-0353 | JAG Property Solutions (Pty) Ltd | — | — |
| cmp-0354 | James Jooste Construction CC | — | — |
| cmp-0355 | JD Robertson & Walton | — | — |
| cmp-0356 | JLK Construction (Pty) Ltd | — | — |
| cmp-0357 | JNA Projects (Pty) Ltd | — | — |
| cmp-0070 | Johan le Roux CA(SA) | Accounting / Audit | Milnerton, Cape Town |
| cmp-0358 | Johnson Crane Hire (Pty) Ltd | — | — |
| cmp-0359 | Jonathan Mitchell Independent Building Consultants | — | — |
| cmp-0360 | JT Maritz Electrical CC | — | — |
| cmp-0361 | Just Claire Property Development CC | — | — |
| cmp-0168 | Kaap Agri / Agrimark | — | — |
| cmp-0362 | Kansai Plascon (Pty) Ltd | — | — |
| cmp-0363 | KBAC Flooring (Pty) Ltd | — | — |
| cmp-0091 | Kentz Group (South African headquarters) | Engineering, procurement and construction | — |
| cmp-0364 | KKQS (Pty) Ltd | — | — |
| cmp-0189 | Knight Piésold (Pty) Ltd | Engineering | — |
| cmp-0004 | KPMG (South Africa) | Accounting / Audit | — |
| cmp-0173 | Kromco | — | — |
| cmp-0124 | Kropz Elandsfontein | — | — |
| cmp-0365 | KTW | — | — |
| cmp-0072 | Kula | — | Worcester |
| cmp-0165 | KWV | — | — |
| cmp-0038 | LA Financial Services (Pty) Ltd | Accounting / Audit | — |
| cmp-0366 | LACPM (Pty) Ltd | — | — |
| cmp-0153 | Lactalis South Africa | — | — |
| cmp-0161 | Ladismith Cheese / Woodlands Dairy Group | — | — |
| cmp-0367 | Lamont Dumaresq Projects (Pty) Ltd | — | — |
| cmp-0160 | LANCEWOOD | — | — |
| cmp-0008 | Lanseria International Airport | Aviation | — |
| cmp-0368 | Lascocrete | — | — |
| cmp-0369 | Latreuo Kitchens | — | — |
| cmp-0370 | Lawson Tools Distributors (Pty) Ltd | — | — |
| cmp-0371 | LC Pike Construction (Pty) Ltd | — | — |
| cmp-0372 | LCL Construction (Pty) Ltd | — | — |
| cmp-0068 | LDP Chartered Accountants and Auditors Inc. | Accounting / Audit | Stellenbosch (HQ), Pretoria |
| cmp-0373 | Legend Plumbing & General Building Maintenance | — | — |
| cmp-0374 | Leith Roofing (Pty) Ltd | — | — |
| cmp-0375 | Level Contractors | — | — |
| cmp-0376 | Levenbach Building & Roofing | — | — |
| cmp-0377 | Libra Joiners & Interiors | — | — |
| cmp-0192 | Lions Cricket | Other | Johannesburg |
| cmp-0378 | LMF Construction (Pty) Ltd | — | — |
| cmp-0379 | Lombard Contractors (Pty) Ltd | — | — |
| cmp-0176 | Lona Group | — | — |
| cmp-0380 | Longworth & Faul | — | — |
| cmp-0381 | Lund Projects | — | — |
| cmp-0382 | LVM & Co (Pty) Ltd | — | — |
| cmp-0383 | M & T Maintenance and Asbestos Removal (Pty) Ltd | — | — |
| cmp-0384 | M Judge (Pty) Ltd | — | — |
| cmp-0075 | M+C Saatchi Group | Professional Services | Cape Town |
| cmp-0113 | M-KOPA Solar | Pay-as-you-go solar / consumer fintech | — |
| cmp-0385 | MA & ML Projects | — | — |
| cmp-0140 | Macsteel | — | — |
| cmp-0386 | Magiet Builders | — | — |
| cmp-0031 | Makosi | Professional Services | — |
| cmp-0133 | Martin & East | — | — |
| cmp-0387 | Martin & East Building (Pty) Ltd | — | — |
| cmp-0388 | Masbuild SA (Pty) Ltd | — | — |
| cmp-0035 | Masisizane Fund | Financial Services | — |
| cmp-0085 | Mason's Clothing (Mason / Mass Clothing) | Value clothing retail and manufacturing | — |
| cmp-0024 | Massmart | Retail | — |
| cmp-0389 | Master Craftsman Construction (Pty) Ltd | — | — |
| cmp-0390 | Maurice Phillips Wisenberg Attorneys | — | — |
| cmp-0391 | Mazor Aluminium (Pty) Ltd | — | — |
| cmp-0392 | Mazor Steel (Pty) Ltd | — | — |
| cmp-0041 | McA Inc. | Accounting / Audit | Durbanville (Cape Town) |
| cmp-0012 | Mckenzie & Associates | Accounting / Audit | — |
| cmp-0001 | Mercedes-Benz South Africa Ltd | Automotive | — |
| cmp-0142 | Meshco | — | — |
| cmp-0393 | Metal Windows | — | — |
| cmp-0394 | Midas Earthcote Tygervalley | — | — |
| cmp-0395 | Mijlof Tilers CC | — | — |
| cmp-0396 | Milestone Construction & Civils | — | — |
| cmp-0125 | Mineral Sands Resources / Tormin | — | — |
| cmp-0056 | MK Aerospace SA | Technology | Cape Town (Somerset West area) |
| cmp-0397 | MLP Master Builders (Pty) Ltd | — | — |
| cmp-0398 | MobileMed | — | — |
| cmp-0032 | Motlanalo Chartered Accountants and Auditors Inc | Accounting / Audit | — |
| cmp-0025 | Motus Mobility Solutions | Automotive | — |
| cmp-0147 | Mpact | — | — |
| cmp-0399 | MRGB cc | — | — |
| cmp-0400 | MSA Builders | — | — |
| cmp-0195 | MTN South Africa | Telecommunications | — |
| cmp-0401 | Murphy Projects | — | — |
| cmp-0402 | N1 Construction Group | — | — |
| cmp-0150 | Nampak | — | — |
| cmp-0103 | National Agricultural Marketing Council (NAMC) | Agricultural market development / MLDC framework | — |
| cmp-0109 | National Department of Agriculture, Land Reform and Rural Development (NDA) | Agriculture | — |
| cmp-0403 | NCC Environmental Services (Pty) Ltd | — | — |
| cmp-0003 | Nedbank Group Limited | Banking | — |
| cmp-0404 | Nedsteel (Pty) Ltd | — | — |
| cmp-0063 | netCFO | Accounting / Audit | Pretoria |
| cmp-0405 | Neubau Construction (Pty) Ltd | — | — |
| cmp-0406 | NEXTEC Security and Building Technologies (Pty) Ltd | — | — |
| cmp-0407 | Nexus Scaffolding (Pty) Ltd | — | — |
| cmp-0141 | NJR Steel | — | — |
| cmp-0408 | Nokhanya Services (Pty) Ltd | — | — |
| cmp-0409 | Nokuthula Dube & Associates CC | — | — |
| cmp-0410 | Northpine Plumbing CC | — | — |
| cmp-0077 | Novus Holdings Ltd (formerly Paarl Media Group) | Commercial printing, labels, flexible packaging, tissue | — |
| cmp-0157 | Oceana Group | — | — |
| cmp-0411 | Otro Projects | — | — |
| cmp-0167 | Overberg Agri | — | — |
| cmp-0412 | P & Sons Home Improvements CC | — | — |
| cmp-0413 | PACE CC | — | — |
| cmp-0414 | Paragon Master Builders (Pty) Ltd | — | — |
| cmp-0071 | Pay@ | Fintech | Stellenbosch |
| cmp-0415 | PCS Projects | — | — |
| cmp-0416 | PDK Civils & Construction CC | — | — |
| cmp-0155 | Peninsula Beverages | — | — |
| cmp-0417 | Peninsula Plumbing & Engineering Works (Pty) Ltd | — | — |
| cmp-0152 | PepsiCo South Africa / Pioneer Foods | — | — |
| cmp-0418 | Peri Formwork Scaffolding Engineering (Pty) Ltd | — | — |
| cmp-0127 | PetroSA | — | — |
| cmp-0419 | Phezulu Contracting Group (Pty) Ltd | — | — |
| cmp-0420 | PHP Building Supplies (Pty) Ltd | — | — |
| cmp-0421 | Pinelands Development Company (NPC) | — | — |
| cmp-0048 | Pinnacle Accounting | Accounting / Audit | Western Cape |
| cmp-0422 | Pinnacle Glass & Aluminium (Pty) Ltd | — | — |
| cmp-0030 | PKF Octagon | Accounting / Audit | — |
| cmp-0423 | Plumb Guarantee | — | — |
| cmp-0424 | Plumbing for Africa | — | — |
| cmp-0425 | Plumbing Solutions Western Cape (Pty) Ltd | — | — |
| cmp-0426 | Plumblink SA (Pty) Ltd | — | — |
| cmp-0148 | Polyoak Packaging | — | — |
| cmp-0117 | Portland Group | Building Materials | Durbanville, Malmesbury, Western Cape |
| cmp-0427 | Power Construction (Pty) Ltd | — | — |
| cmp-0129 | Power Group | — | — |
| cmp-0116 | PPC | Building Materials | Western Cape, South Africa |
| cmp-0428 | PQR Consulting | — | — |
| cmp-0429 | PR Wiehahn (Pty) Ltd | — | — |
| cmp-0430 | Prema Raciti Construction CC | — | — |
| cmp-0159 | Premier Fishing & Brands | — | — |
| cmp-0105 | Premier Foods / Premier FMCG (Kerry Group Africa) | FMCG food manufacturing and distribution | — |
| cmp-0431 | Prime Projects | — | — |
| cmp-0432 | Prize Waterproofing & Painting (Southern Suburbs) | — | — |
| cmp-0013 | Probeta Training (Pty) Ltd | Education | — |
| cmp-0433 | Procord | — | — |
| cmp-0434 | Promac Paints (Pty) Ltd | — | — |
| cmp-0435 | PS Projects | — | — |
| cmp-0067 | PSG Konsult Ltd | Financial Services | Stellenbosch (group HQ) |
| cmp-0027 | PwC (South Africa) | Accounting / Audit | — |
| cmp-0436 | PWJ Properties (Pty) Ltd | — | — |
| cmp-0076 | Quantum Foods Ltd | Poultry / food manufacturing & agriculture | — |
| cmp-0437 | R + N Master Builders (Cape) (Pty) Ltd | — | — |
| cmp-0139 | R+N Master Builders | — | — |
| cmp-0089 | Radisson Hotel Group - Africa managed portfolio | Hospitality - hotel management | — |
| cmp-0438 | Raizenberg's Plumbing & Building Services CC | — | — |
| cmp-0439 | Rattle Brothers CC | — | — |
| cmp-0136 | Raubex / Roadmac Surfacing Cape | — | — |
| cmp-0440 | Raubex Building (Pty) Ltd | — | — |
| cmp-0441 | RBS Insuranace Brokers (Pty)Ltd | — | — |
| cmp-0442 | RDA Building (Pty) Ltd | — | — |
| cmp-0443 | Re-Nu Construction and Projects | — | — |
| cmp-0444 | React 24 | — | — |
| cmp-0088 | REFSOLS - Refrigeration Solutions & Fridgetec Services | Industrial refrigeration equipment, service and maintenance | — |
| cmp-0445 | Remey Construction (Pty) Ltd | — | — |
| cmp-0446 | Reno Construction | — | — |
| cmp-0447 | Renov8 IT (Pty) Ltd | — | — |
| cmp-0448 | Renu Painting & Waterproofing | — | — |
| cmp-0112 | Retail Capital | SME funding / alternative lending | — |
| cmp-0449 | Retouch Renovators | — | — |
| cmp-0450 | Revcon Construction CC | — | — |
| cmp-0451 | Revolution Shopfitters CC | — | — |
| cmp-0151 | RFG Foods | — | — |
| cmp-0452 | RIB Software | — | — |
| cmp-0453 | RICTS Holdings (Pty) Ltd | — | — |
| cmp-0454 | RLP (Pty) Ltd | — | — |
| cmp-0455 | RMI Plumbing CC | — | — |
| cmp-0082 | RMS Shopfitting (Pty) Ltd | Retail shopfitting / joinery manufacturing | — |
| cmp-0456 | Rods Construction | — | — |
| cmp-0457 | Rome Roofing | — | — |
| cmp-0458 | Ropace Construction (Pty) Ltd | — | — |
| cmp-0459 | Ross Demolition | — | — |
| cmp-0092 | Roymec Technologies (Pty) Ltd | Minerals-processing / process equipment engineering | — |
| cmp-0460 | Ruger Projects CC | — | — |
| cmp-0461 | Ruvic Construction (Pty) Ltd | — | — |
| cmp-0462 | S A Paving (Cape Town) | — | — |
| cmp-0463 | SA Fire Watch (Pty) Ltd | — | — |
| cmp-0143 | SA Metal Group | — | — |
| cmp-0166 | SAB / AB InBev - Newlands Brewery | — | — |
| cmp-0046 | Sable International | Professional Services | Cape Town |
| cmp-0464 | Sabre Paints (Pty) Ltd | — | — |
| cmp-0465 | Safety Secure (Pty) Ltd | — | — |
| cmp-0122 | Safintra South Africa | — | — |
| cmp-0009 | SAICA | Professional Services | — |
| cmp-0466 | Saint-Gobain Construction Products (Pty) Ltd | — | — |
| cmp-0121 | Saint-Gobain Gyproc | — | — |
| cmp-0467 | Sakhi Khaya Suppliers CC | — | — |
| cmp-0094 | Samsonite South Africa | Luggage and travel goods - South African distribution | — |
| cmp-0468 | Sanmar Decorators CC | — | — |
| cmp-0022 | SAP Africa | Technology | — |
| cmp-0469 | Sasman and Sons Roofing | — | — |
| cmp-0470 | Scheltema & Co (Pty) Ltd | — | — |
| cmp-0045 | Schoemans Registered Auditors and Chartered Accountants | Accounting / Audit | Cape Town |
| cmp-0156 | Sea Harvest Group | — | — |
| cmp-0471 | Semelela Enterprises | — | — |
| cmp-0169 | Sentraal-Suid Co-operative (SSK) | — | — |
| cmp-0472 | Shawkels Builders & Renovators (Pty) Ltd | — | — |
| cmp-0473 | Showerline Shower Doors (Pty) Ltd | — | — |
| cmp-0119 | Sika South Africa | — | — |
| cmp-0474 | Slingsby & Gaidien (Pty) Ltd | — | — |
| cmp-0052 | Snapplify | Technology | Cape Town |
| cmp-0182 | Snolink | — | — |
| cmp-0475 | Solcon Builders | — | — |
| cmp-0110 | South African Human Rights Commission (SAHRC) | Human rights | — |
| cmp-0099 | South African Qualifications Authority (SAQA) | Quality council / NQF custodianship | — |
| cmp-0015 | South African State Theatre | Other | — |
| cmp-0180 | Southern African Fruit Terminals (SAFT) | — | — |
| cmp-0162 | Southern Oil (SOILL) | — | — |
| cmp-0476 | Southey Contracting | — | — |
| cmp-0193 | Spear REIT Limited | Property | Cape Town |
| cmp-0477 | SS Rhode Roofing & Building Contractors | — | — |
| cmp-0478 | Stabilid (Cape) Construction (Pty) Ltd | — | — |
| cmp-0198 | Standard Bank | Banking | — |
| cmp-0186 | Standard Insurance Limited | Insurance | — |
| cmp-0479 | Status Africa Construction CC | — | — |
| cmp-0480 | Stefanutti Stocks | — | — |
| cmp-0060 | Stellenbosch University | Education | Stellenbosch |
| cmp-0481 | Stephen Bursey Thatching | — | — |
| cmp-0482 | Stephen Jones Roofing CC | — | — |
| cmp-0040 | Streets Chartered Accountants | Accounting / Audit | Cape Town (Kenilworth) |
| cmp-0128 | Sunrise Energy | — | — |
| cmp-0042 | Superside | Technology | Cape Town (SA finance base) |
| cmp-0483 | Supreme Formwork & Scaffolding (Pty) Ltd | — | — |
| cmp-0484 | Swartland Investments | — | — |
| cmp-0107 | Swift Holdings Group (Swift Staffing Services) | Outsourced temporary staffing, payroll and skills development | — |
| cmp-0485 | Swift Project Services (Pty) Ltd | — | — |
| cmp-0486 | Tailormade Construction (Pty) Ltd | — | — |
| cmp-0487 | Talisman Hire | — | — |
| cmp-0488 | Talisman Hire - BLACKHEATH | — | — |
| cmp-0489 | Talisman Hire - CAPE TOWN CITY | — | — |
| cmp-0490 | Talisman Hire - CERES | — | — |
| cmp-0491 | Talisman Hire - DURBANVILLE | — | — |
| cmp-0492 | Talisman Hire - HERMANUS | — | — |
| cmp-0493 | Talisman Hire - MAITLAND | — | — |
| cmp-0494 | Talisman Hire - MALMESBURY | — | — |
| cmp-0495 | Talisman Hire - MONTAGUE GARDENS | — | — |
| cmp-0496 | Talisman Hire - PAARL | — | — |
| cmp-0497 | Talisman Hire - PARKLANDS | — | — |
| cmp-0498 | Talisman Hire - SALDANHA | — | — |
| cmp-0499 | Talisman Hire - STELLENBOSCH | — | — |
| cmp-0500 | Talisman Hire - STRAND | — | — |
| cmp-0501 | Talisman Hire - WORCESTER | — | — |
| cmp-0016 | TCTA (Trans-Caledon Tunnel Authority) | Government | — |
| cmp-0502 | Teck Flooring (Pty) Ltd | — | — |
| cmp-0061 | TFG Limited | Retail | Cape Town (Parow) |
| cmp-0102 | The Competition Tribunal | Competition-law adjudicative tribunal | — |
| cmp-0503 | The Construction Co. | — | — |
| cmp-0074 | The Fieldbar Co. | Manufacturing | Cape Town |
| cmp-0190 | The Fulcrum Group | Insurance | — |
| cmp-0055 | The Modern CFO | Professional Services | Cape Town |
| cmp-0504 | The Renuvators | — | — |
| cmp-0505 | The Training Academy | — | — |
| cmp-0506 | Tiefenthaler Legal | — | — |
| cmp-0507 | TJ van Zyl Plant Hire CC | — | — |
| cmp-0508 | Tjeka Training Matters | — | — |
| cmp-0050 | TradeOn SA | Retail | Cape Town |
| cmp-0100 | Trans-Caledon Tunnel Authority (TCTA) | Bulk water transfer and storage infrastructure | — |
| cmp-0029 | Traxtion | Logistics | — |
| cmp-0509 | Tri Partitioning Cc | — | — |
| cmp-0510 | Trio Construction Services | — | — |
| cmp-0123 | Tronox Namakwa Sands | — | — |
| cmp-0171 | Tru-Cape Fruit Marketing | — | — |
| cmp-0111 | Tshikululu Social Investments (Pty) Ltd | Social investment fund management and advisory (non-profit intermediary) | — |
| cmp-0170 | Two-a-Day Group | — | — |
| cmp-0019 | Unilever | FMCG | — |
| cmp-0049 | University of Cape Town | Education | Cape Town (Rondebosch Area) |
| cmp-0511 | Uvuyo Group | — | — |
| cmp-0512 | Valley Electrical Contractor | — | — |
| cmp-0513 | Van Zyl & Associates | — | — |
| cmp-0514 | Village Lane Investments CC | — | — |
| cmp-0515 | Village Timber | — | — |
| cmp-0516 | Vortex Pipe Works (Pty) Ltd | — | — |
| cmp-0517 | VPM Building | — | — |
| cmp-0518 | W Unser Construction CC | — | — |
| cmp-0519 | W Voigt (Cape) (Pty) Ltd | — | — |
| cmp-0520 | Wagters Onderhoudskontrakteurs (Pty) Ltd | — | — |
| cmp-0521 | Washirika 3 Oaks (Pty) Ltd | — | — |
| cmp-0101 | Water Research Commission (WRC) | Water research | — |
| cmp-0522 | Waterloo Plumbing | — | — |
| cmp-0523 | Watermark Plumbers CC | — | — |
| cmp-0524 | Watt’s Plumbing & Leak Location Services | — | — |
| cmp-0131 | WBHO Construction - Cape Division | — | — |
| cmp-0005 | Webber Wentzel | Professional Services | — |
| cmp-0196 | Wesgro | Government | Cape Town |
| cmp-0525 | West Cape Joinery (Pty) Ltd | — | — |
| cmp-0526 | Whiteheads Painting (Pty) Ltd | — | — |
| cmp-0527 | Wilkinson Construction | — | — |
| cmp-0528 | William Dau Civils | — | — |
| cmp-0529 | WJC Projects | — | — |
| cmp-0026 | Wonga South Africa | Fintech | — |
| cmp-0062 | Woolworths Holdings Ltd | Retail | Cape Town |
| cmp-0097 | Workforce Holdings Ltd (subsequently People Power Solutions) | Human capital / staffing and HR outsourcing | — |
| cmp-0530 | Wynberg Plumbing Works (Pty) Ltd | — | — |
| cmp-0531 | YB Ceilings (Pty) Ltd | — | — |
| cmp-0532 | Zanmig Projects (Pty) Ltd | — | — |
| cmp-0533 | Zhac Construction (Pty) Ltd | — | — |
| cmp-0534 | Zizonke Solutions | — | — |
| cmp-0535 | Zwijndrecht Construction (Pty) Ltd | — | — |

## 6. Sources (dedup by URL)

1363 unique source records in `sources.jsonl`. Before adding a source,
check the URL is absent from that file; reuse an existing `src-####` record instead of
duplicating the URL.
