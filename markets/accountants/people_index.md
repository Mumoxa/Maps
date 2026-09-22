# People Index — Master Name Registry (dedup source of truth)

> **CHECK THIS FILE FIRST** before adding any person, company or source.

This is the authoritative list of every name already captured in the SA Accounting & Finance Skills database.
New evidence for an existing person enriches the existing record; it does not create a duplicate.

**Regenerate after every batch:** `python3 gen_people_index.py`

## 1. Totals (auto-computed)

| Metric | Count |
|---|---|
| People (total records) | 702 |
| CONFIRMED | 154 |
| FINANCE_ROLE_CONFIRMED | 522 |
| HIGH_CONFIDENCE | 24 |
| ARTICLES_CONFIRMED_DESIGNATION_UNVERIFIED | 1 |
| CONFLICTING | 1 |
| Companies | 146 |
| Sources | 642 |

## 2. Dedup workflow

1. Normalise name and check LinkedIn/profile URL.
2. Match current employer and company affiliations.
3. If already present, enrich the existing record; never add a second person.
4. Qualification, professional body and articles/PER are independent evidence fields; never infer one from another.

## 3. All people (sorted by surname)

| # | Full name | Surname / Given | Status | Designation(s) | Body | Employer | Province / City | LinkedIn |
|---|---|---|---|---|---|---|---|---|
| 1 | **Dorman-Kade (D)** | (D) / Dorman-Kade | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/Johannesburg | https://www.linkedin.com/in/dorman-kade-d-87a070aa/ |
| 2 | **More (Ml)** | (Ml) / More | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/Johannesburg | https://www.linkedin.com/in/more-ml-69583774/ |
| 3 | **Syed (Rb)** | (Rb) / Syed | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/Johannesburg | https://www.linkedin.com/in/syed-rb-86842677/ |
| 4 | **Maganathan (Vincin) Naidu** | (Vincin) Naidu / Maganathan | FINANCE_ROLE_CONFIRMED | — | — | AfriSam | — | https://www.linkedin.com/in/maganathan-vincin-naidu-851537123/ |
| 5 | **Mohammed A. Mahomeddi** | A. Mahomeddi / Mohammed | FINANCE_ROLE_CONFIRMED | — | — | Concor | Gauteng/Bedfordview | https://www.linkedin.com/in/mohammed-a-mahomeddi-52a05b6a/ |
| 6 | **Ebrahiem Abrahams** | Abrahams / Ebrahiem | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy (Pty) Ltd. | Western Cape/Cape Town | https://www.linkedin.com/in/ebrahiem-abrahams-69b831164/ |
| 7 | **Yolandi Adam** | Adam / Yolandi | FINANCE_ROLE_CONFIRMED | — | — | Coca-Cola Peninsula Beverages (Pty) Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/yolandi-adam-87074a1a/ |
| 8 | **Adeelah Adams** | Adams / Adeelah | FINANCE_ROLE_CONFIRMED | — | — | CCH Commercial Cold Holdings | Western Cape/Cape Town | https://www.linkedin.com/in/adeelah-adams-a8285157/ |
| 9 | **Lex Adendorff** | Adendorff / Lex | FINANCE_ROLE_CONFIRMED | — | — | Woodlands Dairy | Eastern Cape/Port Elizabeth | https://www.linkedin.com/in/lex-adendorff-0230a459/ |
| 10 | **Claudia Adriaanse** | Adriaanse / Claudia | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/claudia-adriaanse-091928100/ |
| 11 | **Chantell Ajam CA(SA) MBA** | Ajam CA(SA) MBA / Chantell | CONFIRMED | CA(SA) | SAICA | Polyoak Packaging | Eastern Cape/Port Elizabeth | https://www.linkedin.com/in/chantellajam/ |
| 12 | **Angeline Aldridge** | Aldridge / Angeline | CONFIRMED | CA(SA) | SAICA | Nampak | Gauteng/Johannesburg | https://www.linkedin.com/in/angeline-aldridge-86b929184/ |
| 13 | **Maruping Alina** | Alina / Maruping | FINANCE_ROLE_CONFIRMED | — | — | DSV - Global Transport and Logistics | — | https://www.linkedin.com/in/maruping-alina-37268971/ |
| 14 | **Richard Allen** | Allen / Richard | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Eastern Cape/Port Elizabeth | https://www.linkedin.com/in/richard-allen-4527b9144/ |
| 15 | **Ebrahim Ally** | Ally / Ebrahim | CONFIRMED | CA(SA) | SAICA | Mpact Limited | Gauteng/Johannesburg | https://www.linkedin.com/in/ebrahim-ally8505/ |
| 16 | **nasrin amin** | amin / nasrin | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Gauteng/Johannesburg | https://www.linkedin.com/in/nasrin-amin-00953379/ |
| 17 | **Michael Ansermino** | Ansermino / Michael | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | KwaZulu-Natal/Durban | https://www.linkedin.com/in/michael-ansermino-ab9666242/ |
| 18 | **Thyron Arumugam** | Arumugam / Thyron | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | KwaZulu-Natal/Durban | https://www.linkedin.com/in/thyron-arumugam-52b729100/ |
| 19 | **Naeem Asvat** | Asvat / Naeem | CONFIRMED | CA(SA) | SAICA | SAICA | KwaZulu-Natal/Durban | — |
| 20 | **Leticia August** | August / Leticia | FINANCE_ROLE_CONFIRMED | — | — | Fruitways | Western Cape/Cape Town | https://www.linkedin.com/in/leticia-august-4667baa5/ |
| 21 | **Mark Augustine** | Augustine / Mark | HIGH_CONFIDENCE | PA(SA) | SAIPA | Pinnacle Accounting | Western Cape | — |
| 22 | **Lynette Badenhorst** | Badenhorst / Lynette | CONFIRMED | CA(SA) | SAICA | Probeta Training (Pty) Ltd | — | — |
| 23 | **wilhelmina badenhorst** | badenhorst / wilhelmina | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction | Gauteng/Johannesburg | https://www.linkedin.com/in/wilhelmina-badenhorst-b0762972/ |
| 24 | **Nerasha Bahaw-Louw** | Bahaw-Louw / Nerasha | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/nerasha-bahaw-louw-92888376/ |
| 25 | **Sandra Baisch** | Baisch / Sandra | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/Johannesburg | https://www.linkedin.com/in/sandra-baisch-530a7436/ |
| 26 | **Andisiwe Baliso** | Baliso / Andisiwe | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group Limited | Western Cape/Cape Town | https://www.linkedin.com/in/andisiwe-baliso-78624631/ |
| 27 | **Imran Bapoo CA(SA)** | Bapoo CA(SA) / Imran | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group Limited | Western Cape/Cape Town | https://www.linkedin.com/in/imran-bapoo-ca-sa-518a365b/ |
| 28 | **Fatima Bapukee** | Bapukee / Fatima | CONFIRMED | CA(SA) | SAICA | Streets Chartered Accountants (Cape Town) | Western Cape/Cape Town | — |
| 29 | **Eben Barnard** | Barnard / Eben | FINANCE_ROLE_CONFIRMED | — | — | Power Construction (Pty) Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/eben-barnard-9959b813/ |
| 30 | **Liezl Barnard** | Barnard / Liezl | CONFIRMED | CA(SA) | SAICA | AfriSam | — | https://www.linkedin.com/in/liezl-barnard-ca-sa-62448157/ |
| 31 | **Robyn Bartlett** | Bartlett / Robyn | FINANCE_ROLE_CONFIRMED | — | — | RFG Foods | Western Cape/Cape Town | https://www.linkedin.com/in/robyn-bartlett-65831a120/ |
| 32 | **Calvin Bassa** | Bassa / Calvin | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction | Gauteng/Johannesburg | https://www.linkedin.com/in/calvin-bassa-46345b36/ |
| 33 | **Suzaan Batista CA(SA)** | Batista CA(SA) / Suzaan | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/suzaan-batista-ca-sa-865238339/ |
| 34 | **Jody Baumgarten** | Baumgarten / Jody | HIGH_CONFIDENCE | CA(SA) | SAICA | Wonga (South Africa) | — | — |
| 35 | **Melissa Beck** | Beck / Melissa | FINANCE_ROLE_CONFIRMED | — | — | Southern Oil (Pty) Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/melissa-beck-aa8812a4/ |
| 36 | **Bronwyn Behm** | Behm / Bronwyn | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/Cape Town | https://www.linkedin.com/in/bronwyn-behm-058a4666/ |
| 37 | **Gwuineth Benting** | Benting / Gwuineth | FINANCE_ROLE_CONFIRMED | — | — | Coca-Cola Peninsula Beverages (Pty) Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/gwuineth-benting-5ab483a2/ |
| 38 | **Michelle Bernice Du Preez** | Bernice Du Preez / Michelle | FINANCE_ROLE_CONFIRMED | — | — | Macsteel Service Centres SA (Pty) Ltd | Gauteng | https://www.linkedin.com/in/michelle-du-preez-89481975/ |
| 39 | **Michael Besson** | Besson / Michael | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction | Gauteng/Johannesburg | https://www.linkedin.com/in/michael-besson-088b39b2/ |
| 40 | **Rachelle Best** | Best / Rachelle | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 41 | **Cala Bester** | Bester / Cala | FINANCE_ROLE_CONFIRMED | — | — | R+N Master Builders | Western Cape/Cape Town | https://za.linkedin.com/in/cala-bester-b5768b12b |
| 42 | **Elza Bester** | Bester / Elza | FINANCE_ROLE_CONFIRMED | — | — | Tronox | Western Cape/Saldanha Bay Local Municipality | https://www.linkedin.com/in/elza-bester-4566ba58/ |
| 43 | **Cindy Beukes** | Beukes / Cindy | FINANCE_ROLE_CONFIRMED | — | — | DSV - Global Transport and Logistics | Gauteng/Johannesburg | https://www.linkedin.com/in/cindy-beukes-66534483/ |
| 44 | **Elané Beukes (Botha)** | Beukes (Botha) / Elané | FINANCE_ROLE_CONFIRMED | — | — | Overberg Agri | Western Cape/Caledon | https://www.linkedin.com/in/elané-beukes-botha-28a628155/ |
| 45 | **J A 'Driaan' Beyers** | Beyers / Driaan | HIGH_CONFIDENCE | PA(SA) | SAIPA | Finkor Accounting | Gauteng/Rayton | — |
| 46 | **Angelic Bezuidenhoudt** | Bezuidenhoudt / Angelic | FINANCE_ROLE_CONFIRMED | — | — | Coca-Cola Peninsula Beverages (Pty) Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/angelic-bezuidenhoudt-906780334/ |
| 47 | **Alwyn Bezuidenhout** | Bezuidenhout / Alwyn | FINANCE_ROLE_CONFIRMED | — | — | Macsteel Service Centres SA (Pty) Ltd | Gauteng/Johannesburg | https://www.linkedin.com/in/alwyn-bezuidenhout-8308805a/ |
| 48 | **Uwe Birkenstock** | Birkenstock / Uwe | CONFIRMED | CA(SA) | SAICA | McA Durbanville Inc. | Western Cape/Durbanville | — |
| 49 | **Niel Bisschoff** | Bisschoff / Niel | CONFIRMED | CA(SA) | SAICA | Raubex Group Ltd | Gauteng/Johannesburg | https://www.linkedin.com/in/niel-bisschoff-ca-sa-b3a1a253/ |
| 50 | **Maria Bookkeeper** | Bookkeeper / Maria | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/Cape Town | https://www.linkedin.com/in/maria-bookkeeper-863b79115/ |
| 51 | **Annelize Boshoff** | Boshoff / Annelize | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction | Gauteng/Johannesburg | https://www.linkedin.com/in/annelize-boshoff-8b12b089/ |
| 52 | **Garron Boshoff** | Boshoff / Garron | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Western Cape/Cape Town | https://www.linkedin.com/in/garron-boshoff-b1726a20/ |
| 53 | **Johan Boshoff** | Boshoff / Johan | FINANCE_ROLE_CONFIRMED | — | — | Meshco | Western Cape/Cape Town | https://www.linkedin.com/in/johan-boshoff-929ba3117/ |
| 54 | **Kobus Boshoff** | Boshoff / Kobus | CONFIRMED | CA(SA) | SAICA | Boshoff Knoetze Chartered Accountants | Western Cape/Somerset West | https://www.linkedin.com/in/kobus-boshoff-0a510888/ |
| 55 | **Sunette Botes** | Botes / Sunette | FINANCE_ROLE_CONFIRMED | — | — | KAL Group Limited | — | https://www.linkedin.com/in/sunette-botes-6405a399/ |
| 56 | **Heleen Botha** | Botha / Heleen | FINANCE_ROLE_CONFIRMED | — | — | FAIR CAPE DAIRIES | Western Cape/Cape Town | https://www.linkedin.com/in/heleen-botha-93942711/ |
| 57 | **Philip Botha** | Botha / Philip | FINANCE_ROLE_CONFIRMED | — | — | RFG Foods | Western Cape/Stellenbosch | https://www.linkedin.com/in/philip-botha/ |
| 58 | **Pieter Botha** | Botha / Pieter | CONFIRMED | CA(SA) | SAICA | AfriSam | — | https://www.linkedin.com/in/pieter-botha-43351637/ |
| 59 | **Ronel Botha** | Botha / Ronel | FINANCE_ROLE_CONFIRMED | — | — | Fruitways | Western Cape/Cape Town | https://www.linkedin.com/in/ronel-botha-6507a865/ |
| 60 | **Wardah Botha AGA (SA)** | Botha AGA (SA) / Wardah | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group Limited | Western Cape/Cape Town | https://www.linkedin.com/in/wardah-botha-aga-sa-116b4361/ |
| 61 | **Sandi Bothma** | Bothma / Sandi | FINANCE_ROLE_CONFIRMED | — | — | Concor | Gauteng/Johannesburg | https://www.linkedin.com/in/sandi-bothma-b0507517a/ |
| 62 | **Chantelle Boucher** | Boucher / Chantelle | FINANCE_ROLE_CONFIRMED | — | — | DSV - Global Transport and Logistics | Gauteng/Johannesburg | https://www.linkedin.com/in/chantelle-boucher-0148a7128/ |
| 63 | **Grant Bowler** | Bowler / Grant | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Western Cape/Cape Town | https://www.linkedin.com/in/grant-bowler-9059b598/ |
| 64 | **Nikita Braaf** | Braaf / Nikita | FINANCE_ROLE_CONFIRMED | — | — | I&J frozen fish | Western Cape/Cape Town | https://www.linkedin.com/in/nikita-braaf-613b3763/ |
| 65 | **Muhammad Brey** | Brey / Muhammad | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/mobrey/ |
| 66 | **Madhuri Brijlal** | Brijlal / Madhuri | FINANCE_ROLE_CONFIRMED | — | — | Mpact Limited | Gauteng/Johannesburg | https://www.linkedin.com/in/madhuri-brijlal-38634943/ |
| 67 | **Jennifer Brisley** | Brisley / Jennifer | FINANCE_ROLE_CONFIRMED | — | — | Concor | Gauteng | https://www.linkedin.com/in/jennifer-brisley-51a65721/ |
| 68 | **Michelle Brook** | Brook / Michelle | FINANCE_ROLE_CONFIRMED | — | — | Fabrinox (Pty) Ltd | Western Cape/Paarl | https://www.linkedin.com/in/michelle-brook-2725b986/ |
| 69 | **Justyna Bruwer** | Bruwer / Justyna | FINANCE_ROLE_CONFIRMED | — | — | DSV Regional Shared Services Africa, Johannesburg | Gauteng | https://www.linkedin.com/in/justyna-bruwer-42a092b3/ |
| 70 | **Ralph Buddle** | Buddle / Ralph | CONFIRMED | CA(SA) | SAICA | TFG Limited (The Foschini Group) | Western Cape/Cape Town | — |
| 71 | **Thomas Bufton** | Bufton / Thomas | FINANCE_ROLE_CONFIRMED | — | — | Ardagh Group | Gauteng/Johannesburg | https://www.linkedin.com/in/thomas-bufton-351030116/ |
| 72 | **Lizanne Buitendag** | Buitendag / Lizanne | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Gauteng | https://www.linkedin.com/in/lizanne-buitendag-a60564213/ |
| 73 | **Catharine Burger** | Burger / Catharine | CONFIRMED | CA(SA) | SAICA | Afrimat | Western Cape/City of Cape Town | https://www.linkedin.com/in/catharine-burger-4a597a81/ |
| 74 | **Yolandi Burger** | Burger / Yolandi | FINANCE_ROLE_CONFIRMED | — | — | Southern Oil (Pty) Ltd | — | https://www.linkedin.com/in/yolandi-burger-384a0865/ |
| 75 | **Werner Buys** | Buys / Werner | FINANCE_ROLE_CONFIRMED | — | — | Concor | Gauteng/Bedfordview | https://www.linkedin.com/in/wernerbuys101/ |
| 76 | **Andre C.** | C. / Andre | FINANCE_ROLE_CONFIRMED | — | — | Fabrinox (Pty) Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/andre-c-ba703193/ |
| 77 | **Ampie Calitz CA(SA)** | Calitz CA(SA) / Ampie | FINANCE_ROLE_CONFIRMED | — | — | RFG Foods | Western Cape/Cape Town | https://www.linkedin.com/in/ampie-calitz-ca-sa-b51a084b/ |
| 78 | **Kevin Cammay** | Cammay / Kevin | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Western Cape/Cape Town | https://www.linkedin.com/in/kevin-cammay-38011325/ |
| 79 | **Kerry Cassel** | Cassel / Kerry | CONFIRMED | CA(SA) | SAICA | Motus Mobility Solutions | — | — |
| 80 | **Jacqui Celliers** | Celliers / Jacqui | CONFIRMED | CA(SA) | SAICA | Nampak | Gauteng/Johannesburg | https://www.linkedin.com/in/jacqui-celliers-241a47209/ |
| 81 | **Kamohelo Chauke** | Chauke / Kamohelo | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy (Pty) Ltd. | Western Cape/Cape Town | https://www.linkedin.com/in/kamohelo-chauke-ca-sa-10bb0b221/ |
| 82 | **Ronnie Chetty** | Chetty / Ronnie | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/Johannesburg | https://www.linkedin.com/in/ronnie-chetty-42400656/ |
| 83 | **Walter Chigwada** | Chigwada / Walter | FINANCE_ROLE_CONFIRMED | — | — | Safintra South Africa | Gauteng/Boksburg | https://www.linkedin.com/in/walter-chigwada-8b4b7520/ |
| 84 | **Bianca Christian** | Christian / Bianca | CONFIRMED | CA(SA) | SAICA | WBHO Construction | Gauteng | https://www.linkedin.com/in/bianca-christian-1690a9b0/ |
| 85 | **Tanya Churchill** | Churchill / Tanya | FINANCE_ROLE_CONFIRMED | — | — | DSV - Global Transport and Logistics | Gauteng/Johannesburg | https://www.linkedin.com/in/tanya-churchill-03589714a/ |
| 86 | **Malcolm Cecil Coates** | Coates / Malcolm | HIGH_CONFIDENCE | PA(SA) | SAIPA | Alma Casa | Western Cape/Muizenberg (Cape Town) | — |
| 87 | **Johan Coetzee** | Coetzee / Johan | HIGH_CONFIDENCE | CA(SA) | SAICA | Callidus Accountants | Western Cape/Somerset West | — |
| 88 | **Werner Coetzee** | Coetzee / Werner | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction | Gauteng/Johannesburg | https://www.linkedin.com/in/werner-coetzee-428687138/ |
| 89 | **Denovan Coetzee ACMA** | Coetzee ACMA / Denovan | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/denovan-coetzee-acma-cgma-652581197/ |
| 90 | **Alisha Coetzer** | Coetzer / Alisha | FINANCE_ROLE_CONFIRMED | — | — | DSV - Global Transport and Logistics | Gauteng/Johannesburg | https://www.linkedin.com/in/alisha-coetzer-059b1a63/ |
| 91 | **Pieter-Christiaan Coetzer** | Coetzer / Pieter-Christiaan | FINANCE_ROLE_CONFIRMED | — | — | Southern Oil (Pty) Ltd | Potchefstroom | https://www.linkedin.com/in/pieter-christiaan-coetzer-224587244/ |
| 92 | **Themba Collen** | Collen / Themba | FINANCE_ROLE_CONFIRMED | — | — | Mpact Limited | Gauteng/Benoni | https://www.linkedin.com/in/themba-collen-410500248/ |
| 93 | **Angus Cornelius CA(SA)** | Cornelius CA(SA) / Angus | FINANCE_ROLE_CONFIRMED | — | — | Coca-Cola Peninsula Beverages (Pty) Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/angus-cornelius-ca-sa-4603361a/ |
| 94 | **Tracey Cosgrove** | Cosgrove / Tracey | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/Cape Town | https://www.linkedin.com/in/tracey-cosgrove-79454024/ |
| 95 | **Jeanette Croukamp** | Croukamp / Jeanette | FINANCE_ROLE_CONFIRMED | — | — | DSV - Global Transport and Logistics | Gauteng/Johannesburg | https://www.linkedin.com/in/jeanette-croukamp-237469a6/ |
| 96 | **Lameez Cupido** | Cupido / Lameez | FINANCE_ROLE_CONFIRMED | — | — | Capespan | Western Cape/Cape Town | https://www.linkedin.com/in/lameez-cupido-b39a0141/ |
| 97 | **Louwrens da Silva** | da Silva / Louwrens | HIGH_CONFIDENCE | PA(SA) | SAIPA | Petrichor Consulting | Western Cape/Somerset West | — |
| 98 | **Ahmed Dalvie** | Dalvie / Ahmed | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group Limited | Western Cape/Cape Town | https://www.linkedin.com/in/ahmeddalvie/ |
| 99 | **Adre Daniel** | Daniel / Adre | HIGH_CONFIDENCE | PA(SA) | SAIPA | Accu-fin Accounting | Western Cape/Milnerton (Cape Town) | — |
| 100 | **Ebrahim Daniels** | Daniels / Ebrahim | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy (Pty) Ltd. | Western Cape/Cape Town | https://www.linkedin.com/in/ebrahim-daniels/ |
| 101 | **Kyle Danster** | Danster / Kyle | CONFIRMED | ACMA, CGMA | CIMA | Curro Holdings Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/kyle-danster/ |
| 102 | **Belinda David** | David / Belinda | FINANCE_ROLE_CONFIRMED | — | — | I&J frozen fish | Western Cape/Cape Town | https://www.linkedin.com/in/belinda-david-a7965651/ |
| 103 | **Zaakirah Davids CA(SA)** | Davids CA(SA) / Zaakirah | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/zaakirah-davids-ca-sa-b42445267/ |
| 104 | **Graham Davin** | Davin / Graham | CONFIRMED | CA(SA) | SAICA | TFG Limited (The Foschini Group) | — | — |
| 105 | **Ferose dawood** | dawood / Ferose | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/Cape Town | https://www.linkedin.com/in/dawood-ferose-9829347a/ |
| 106 | **Angelina de Gouveia** | de Gouveia / Angelina | FINANCE_ROLE_CONFIRMED | — | — | Concor | Gauteng/Johannesburg | https://www.linkedin.com/in/angelina-de-gouveia-4639681ba/ |
| 107 | **Yolandi de Jonge** | de Jonge / Yolandi | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction | Gauteng/Johannesburg | https://www.linkedin.com/in/yolandi-de-jonge-40917b74/ |
| 108 | **Nicolene De Klerk** | De Klerk / Nicolene | FINANCE_ROLE_CONFIRMED | — | — | DSV - Global Transport and Logistics | Pretoria Metropolitan Area | https://www.linkedin.com/in/nicolene-de-klerk-223181246/ |
| 109 | **Marinelle de Klerk Kilian** | de Klerk Kilian / Marinelle | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group Ltd | Western Cape/Saldanha | https://www.linkedin.com/in/marinelle-de-klerk-kilian-57792929/ |
| 110 | **Zené de Laan CA (SA)** | de Laan CA (SA) / Zené | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo | Western Cape/Stellenbosch | https://www.linkedin.com/in/zené-de-laan-ca-sa-a25aa485/ |
| 111 | **Adriaan de Lange** | de Lange / Adriaan | CONFIRMED | CA(SA) | SAICA | Adriaan de Lange Advisory (Private Capacity) | Western Cape/Cape Town | https://www.linkedin.com/in/a3aandl/ |
| 112 | **John De Sousa** | De Sousa / John | CONFIRMED | PA(SA) | SAIPA | GVK-Siya Zama Building Contractors | Western Cape/Cape Town | https://za.linkedin.com/in/john-de-sousa-98a52247 |
| 113 | **Sandi De Souza** | De Souza / Sandi | CONFIRMED | CA(SA) | SAICA | SAP Africa | — | — |
| 114 | **Emile de Villiers** | de Villiers / Emile | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 115 | **Franselle de Villiers** | de Villiers / Franselle | FINANCE_ROLE_CONFIRMED | — | — | Raubex Group Ltd | Free State/Bloemfontein | https://www.linkedin.com/in/franselle-de-villiers-413b4b82/ |
| 116 | **Aulene De Vries** | De Vries / Aulene | CONFIRMED | PA(SA) | SAIPA | Portland Group | Western Cape/Wellington | https://www.linkedin.com/in/aulene-de-vries-pa-sa-79050616a/ |
| 117 | **Louis de Wet** | de Wet / Louis | CONFIRMED | CA(SA) | SAICA | TradeOn SA | Western Cape/Stellenbosch | https://www.linkedin.com/in/louisdewetza/ |
| 118 | **Pieter De Wit** | De Wit / Pieter | CONFIRMED | CA(SA) | SAICA | Afrimat | Western Cape/City of Cape Town | https://www.linkedin.com/in/pieter-de-wit-4619b210/ |
| 119 | **Lindi Dempers** | Dempers / Lindi | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group Limited | Western Cape/Saldanha Bay Local Municipality | https://www.linkedin.com/in/lindi-dempers-9b872350/ |
| 120 | **Manoj Desai** | Desai / Manoj | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/Johannesburg | https://www.linkedin.com/in/manoj-desai-61790754/ |
| 121 | **Elisha Dhenanath** | Dhenanath / Elisha | FINANCE_ROLE_CONFIRMED | — | — | AB InBev | Gauteng/Johannesburg | https://www.linkedin.com/in/elisha-dhenanath-11b85b5/ |
| 122 | **Zama-o-kuhle Dingaan CGMA Adv Dip MA** | Dingaan CGMA Adv Dip MA / Zama-o-kuhle | FINANCE_ROLE_CONFIRMED | — | — | Mpact Limited | Gauteng | https://www.linkedin.com/in/zama-o-kuhle-dingaan-acma-cgma-a11080134/ |
| 123 | **Monique Dippenaar** | Dippenaar / Monique | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group Limited | Western Cape/Cape Town | https://www.linkedin.com/in/monique-dippenaar-54b61114b/ |
| 124 | **Lézanne Dirkse van Schalkwyk** | Dirkse van Schalkwyk / Lézanne | CONFIRMED | AGA(SA) | SAICA | McA Inc. | Western Cape/Durbanville | — |
| 125 | **Nkosana Dlamini** | Dlamini / Nkosana | CONFIRMED | ACMA, CGMA | CIMA | Absa Group | Gauteng/Johannesburg | — |
| 126 | **Lizaan Draper CA (SA)** | Draper CA (SA) / Lizaan | FINANCE_ROLE_CONFIRMED | — | — | Sentraal-Suid Co-operative (SSK) | Western Cape | https://www.linkedin.com/in/lizaan-draper-ca-sa-286955193/ |
| 127 | **André Du Plessis** | Du Plessis / André | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 128 | **Ashley Du Plessis** | Du Plessis / Ashley | CONFIRMED | AGA(SA) | SAICA | — | Western Cape/Paarl | https://www.linkedin.com/in/ashley-du-plessis-ba99a716b/ |
| 129 | **Ilke du Plessis** | du Plessis / Ilke | FINANCE_ROLE_CONFIRMED | — | — | Kropz Elandsfontein | Western Cape/Cape Town | https://www.linkedin.com/in/ilke-du-plessis-5478a7207/ |
| 130 | **Lian du Plessis** | du Plessis / Lian | CONFIRMED | AGA(SA) | SAICA | Cape Chamber of Commerce & Industry | Western Cape/Cape Town | https://www.linkedin.com/in/lian-du-plessis-aga-sa-177375149/ |
| 131 | **Corne Du Plooy** | Du Plooy / Corne | FINANCE_ROLE_CONFIRMED | — | — | DSV - Global Transport and Logistics | Gauteng/Johannesburg | https://www.linkedin.com/in/corne-du-plooy-4625b7136/ |
| 132 | **Valentine Dzvova** | Dzvova / Valentine | CONFIRMED | CA(SA), ACMA, CGMA | SAICA, CIMA | AYO Technology Solutions Limited | Western Cape/Cape Town | https://za.linkedin.com/in/valentine-dzvova |
| 133 | **Wilbur Engelbrecht** | Engelbrecht / Wilbur | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group Limited | Western Cape/Vredenburg | https://www.linkedin.com/in/wilbur-engelbrecht-4232b8172/ |
| 134 | **Siddiqa Enous** | Enous / Siddiqa | FINANCE_ROLE_CONFIRMED | — | — | AfriSam | — | https://www.linkedin.com/in/siddiqa-enous-b2500b12/ |
| 135 | **Rafeeq Erasmus** | Erasmus / Rafeeq | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/Cape Town | https://www.linkedin.com/in/rafeeq-erasmus-5b113b54/ |
| 136 | **Anthea F.** | F. / Anthea | FINANCE_ROLE_CONFIRMED | — | — | South African National Petroleum Company | Western Cape/Cape Town | https://www.linkedin.com/in/anthea-f-01a87264/ |
| 137 | **Zahid Fakey** | Fakey / Zahid | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 138 | **Zahida Fakey** | Fakey / Zahida | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 139 | **Brumilda Farmer** | Farmer / Brumilda | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/brumilda-farmer-a04b11176/ |
| 140 | **Craig Felaar** | Felaar / Craig | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy (Pty) Ltd. | Western Cape/Cape Town | https://www.linkedin.com/in/craig-felaar-42982931/ |
| 141 | **Erica Felix** | Felix / Erica | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Western Cape/Cape Town | https://www.linkedin.com/in/erica-felix-737839138/ |
| 142 | **Siphamandla Fennie** | Fennie / Siphamandla | FINANCE_ROLE_CONFIRMED | — | — | I&J frozen fish | Western Cape/Cape Town | https://www.linkedin.com/in/siphamandla-fennie/ |
| 143 | **Brent Ferreira** | Ferreira / Brent | CONFIRMED | PA(SA) | SAIPA | Afrimat | Western Cape/City of Cape Town | https://www.linkedin.com/in/brent-ferreira-883553172/ |
| 144 | **Sophy Finger** | Finger / Sophy | FINANCE_ROLE_CONFIRMED | — | — | AfriSam | — | https://www.linkedin.com/in/sophy-finger-0ab686101/ |
| 145 | **Abdulmu-izz Fortune** | Fortune / Abdulmu-izz | FINANCE_ROLE_CONFIRMED | — | — | Premier Fishing SA | Western Cape/Cape Town | https://www.linkedin.com/in/abdulmu-izz-fortune-808057197/ |
| 146 | **Dawn Fortune** | Fortune / Dawn | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group Limited | Western Cape/Cape Town | https://www.linkedin.com/in/dawn-fortune-064a8222/ |
| 147 | **Delwen Fortune** | Fortune / Delwen | FINANCE_ROLE_CONFIRMED | — | — | DSV - Global Transport and Logistics | Gauteng/Johannesburg | https://www.linkedin.com/in/delwen-fortune-b98bb437/ |
| 148 | **Jeanne Fourie** | Fourie / Jeanne | FINANCE_ROLE_CONFIRMED | — | — | DSV - Global Transport and Logistics | Gauteng/Johannesburg | https://www.linkedin.com/in/jeanne-fourie-2741987a/ |
| 149 | **Neil Fourie** | Fourie / Neil | CONFIRMED | AGA(SA) | SAICA | Brenn-O-Kem | Western Cape/Stellenbosch | https://www.linkedin.com/in/neil-fourie-aga-sa-2a125b204/ |
| 150 | **Suzanne Fourie** | Fourie / Suzanne | FINANCE_ROLE_CONFIRMED | — | — | Lancewood | Western Cape/Cape Town | https://www.linkedin.com/in/suzanne-fourie-568541135/ |
| 151 | **Melissa Frantz** | Frantz / Melissa | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy (Pty) Ltd. | Western Cape/Cape Town | https://www.linkedin.com/in/melissa-frantz-4856429a/ |
| 152 | **Victoria Fryer** | Fryer / Victoria | FINANCE_ROLE_CONFIRMED | — | — | NJR Steel Holdings (Pty) Ltd | Gauteng/Benoni | https://www.linkedin.com/in/victoria-fryer-201359222/ |
| 153 | **Vukosi Fungeni** | Fungeni / Vukosi | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 154 | **Akani Fungheni (BCOMPT)** | Fungheni (BCOMPT) / Akani | FINANCE_ROLE_CONFIRMED | — | — | DSV - Global Transport and Logistics | Western Cape/Cape Town | https://www.linkedin.com/in/akani-fungheni-bcompt-654416190/ |
| 155 | **Jackie Furter** | Furter / Jackie | FINANCE_ROLE_CONFIRMED | — | — | Power Construction (Pty) Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/jackie-furter-47908888/ |
| 156 | **Shaheeda Gafieldien** | Gafieldien / Shaheeda | FINANCE_ROLE_CONFIRMED | — | — | Fruitways | Western Cape/Somerset West | https://www.linkedin.com/in/shaheeda-gafieldien-233599277/ |
| 157 | **Ipfi Gavhi** | Gavhi / Ipfi | FINANCE_ROLE_CONFIRMED | — | — | I&J frozen fish | Western Cape | https://www.linkedin.com/in/ipfi-gavhi-20426a207/ |
| 158 | **Chelsea Geldenhuys** | Geldenhuys / Chelsea | CONFIRMED | CA(SA) | SAICA | Raubex Group Ltd | Free State/Bloemfontein | https://www.linkedin.com/in/chelsea-geldenhuys-ca-sa-0139847b/ |
| 159 | **Nicole Genade** | Genade / Nicole | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/nicole-genade-6186b2149/ |
| 160 | **Rene Geneve Boros** | Geneve Boros / Rene | FINANCE_ROLE_CONFIRMED | — | — | DSV - Global Transport and Logistics | Germiston Metropolitan Area | https://www.linkedin.com/in/rene-geneve-boros-067048202/ |
| 161 | **Marta Gerbach** | Gerbach / Marta | CONFIRMED | CA(SA) | SAICA | Fourways Airconditioning | — | — |
| 162 | **Zandrea Gerber** | Gerber / Zandrea | CONFIRMED | CA(SA) | SAICA | Pay@ | Western Cape/Paarl | https://www.linkedin.com/in/zandrea-gerber-ca-sa-99a5a475/ |
| 163 | **Christelle Germishuys** | Germishuys / Christelle | FINANCE_ROLE_CONFIRMED | — | — | KWV | Western Cape/Cape Town | https://www.linkedin.com/in/christelle-germishuys-438baa4/ |
| 164 | **Emmie Germishuys** | Germishuys / Emmie | FINANCE_ROLE_CONFIRMED | — | — | Sentraal-Suid Co-operative (SSK) | Western Cape | https://www.linkedin.com/in/emmie-germishuys-13ba26262/ |
| 165 | **Ayanda Geza** | Geza / Ayanda | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo | Gauteng/Johannesburg | https://www.linkedin.com/in/ayanda-geza-3a336648/ |
| 166 | **Nonkululeko Gobodo** | Gobodo / Nonkululeko | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 167 | **Shailen Gokaldass** | Gokaldass / Shailen | FINANCE_ROLE_CONFIRMED | — | — | DSV - Global Transport and Logistics | Gauteng/Johannesburg | https://www.linkedin.com/in/shailen-gokaldass-15980b49/ |
| 168 | **Kyrlene Goliath ACMA** | Goliath ACMA / Kyrlene | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo | Western Cape/Cape Town | https://www.linkedin.com/in/kyrlene-goliath-acma-cgma-a858b046/ |
| 169 | **Tikeyah Goodman** | Goodman / Tikeyah | FINANCE_ROLE_CONFIRMED | — | — | Mpact Limited | Gauteng/Johannesburg | https://www.linkedin.com/in/tikeyah-goodman-158876249/ |
| 170 | **Albert Goosen** | Goosen / Albert | FINANCE_ROLE_CONFIRMED | — | — | Ceres Fruit Growers | — | https://www.linkedin.com/in/albert-goosen-97223b6/ |
| 171 | **Chantelle Goosen** | Goosen / Chantelle | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy (Pty) Ltd. | Western Cape/Cape Town | https://www.linkedin.com/in/chantellegoosen/ |
| 172 | **Jana Goosen** | Goosen / Jana | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 173 | **Reece Gordon CA(SA)** | Gordon CA(SA) / Reece | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Western Cape/Somerset West | https://www.linkedin.com/in/reece-gordon-ca-sa-415263223/ |
| 174 | **Kathleen Gouws** | Gouws / Kathleen | FINANCE_ROLE_CONFIRMED | — | — | Macsteel Service Centres SA (Pty) Ltd | — | https://www.linkedin.com/in/kathleen-gouws-95b08989/ |
| 175 | **Louise Gouws Du Toit** | Gouws Du Toit / Louise | FINANCE_ROLE_CONFIRMED | — | — | KAL Group Limited | — | https://www.linkedin.com/in/louise-gouws-du-toit-18178a14b/ |
| 176 | **Chernel Govender** | Govender / Chernel | FINANCE_ROLE_CONFIRMED | — | — | Ardagh Group | Gauteng/Johannesburg | https://www.linkedin.com/in/chernel-govender-75935028/ |
| 177 | **Deshnee Govender** | Govender / Deshnee | FINANCE_ROLE_CONFIRMED | — | — | Mpact Limited | KwaZulu-Natal/Ballito | https://www.linkedin.com/in/deshnee-govender-01a433186/ |
| 178 | **Ellendhren Govender** | Govender / Ellendhren | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy (Pty) Ltd. | Gauteng/Randburg | https://www.linkedin.com/in/ellendhren-govender-152b55207/ |
| 179 | **Emanuel Govender** | Govender / Emanuel | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/emanuel-govender-507293138/ |
| 180 | **Lavanya Govender** | Govender / Lavanya | FINANCE_ROLE_CONFIRMED | — | — | AB InBev | Johannesburg Metropolitan Area | https://www.linkedin.com/in/lavanya-govender-302577196/ |
| 181 | **Michelle Govender** | Govender / Michelle | FINANCE_ROLE_CONFIRMED | — | — | Capespan | Western Cape/Cape Town | https://www.linkedin.com/in/michelle-govender-93bb20124/ |
| 182 | **Tanya Govender** | Govender / Tanya | FINANCE_ROLE_CONFIRMED | — | — | RFG Foods | KwaZulu-Natal | https://www.linkedin.com/in/tanya-govender-0356441b9/ |
| 183 | **Grant Greeff** | Greeff / Grant | CONFIRMED | CA(SA) | SAICA | Drone Ops Group | — | — |
| 184 | **Rene Greeff** | Greeff / Rene | FINANCE_ROLE_CONFIRMED | — | — | Mpact Limited | Mpumalanga/Mkhondo Local Municipality | https://www.linkedin.com/in/rene-greeff-088701a8/ |
| 185 | **Morgan Gregory** | Gregory / Morgan | CONFIRMED | CA(SA) | SAICA | MK Aerospace SA | Western Cape/Cape Town | https://www.linkedin.com/in/morgan-gregory-ca-sa-64046117b/ |
| 186 | **Nicole Grendeling** | Grendeling / Nicole | CONFIRMED | CA(SA) | SAICA | Astron Energy (Pty) Ltd. | Western Cape/Cape Town | https://www.linkedin.com/in/nicole-grendeling-ca-sa-bb99a7150/ |
| 187 | **Bianca Greyling** | Greyling / Bianca | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Gauteng | https://www.linkedin.com/in/bianca-greyling-6307819a/ |
| 188 | **Mer-Lynn Griego** | Griego / Mer-Lynn | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Western Cape/Cape Town | https://www.linkedin.com/in/mer-lynn-griego-4969128b/ |
| 189 | **Shahied Griffin** | Griffin / Shahied | FINANCE_ROLE_CONFIRMED | — | — | DSV - Global Transport and Logistics | Gauteng/Johannesburg | https://www.linkedin.com/in/shahied-griffin-0b6203128/ |
| 190 | **Andre Grobler** | Grobler / Andre | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/andregrobler/ |
| 191 | **Amanda Groenewald** | Groenewald / Amanda | FINANCE_ROLE_CONFIRMED | — | — | DSV - Global Transport and Logistics | Gauteng/Johannesburg | https://www.linkedin.com/in/amanda-groenewald-a63a93110/ |
| 192 | **Owen Gush** | Gush / Owen | FINANCE_ROLE_CONFIRMED | — | — | Woodlands Dairy | Eastern Cape/Port Elizabeth | https://www.linkedin.com/in/owen-gush-29051371/ |
| 193 | **Asanda Gwiliza** | Gwiliza / Asanda | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/asanda-gwiliza-4954901b5/ |
| 194 | **Alicia Haasbroek** | Haasbroek / Alicia | CONFLICTING | — | — | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 195 | **Matthew Hall** | Hall / Matthew | FINANCE_ROLE_CONFIRMED | — | — | Raubex Group Ltd | — | https://www.linkedin.com/in/matthew-hall-1b045bba/ |
| 196 | **Desray Hamilton** | Hamilton / Desray | FINANCE_ROLE_CONFIRMED | — | — | Ardagh Group | — | https://www.linkedin.com/in/desray-hamilton-25a1a726/ |
| 197 | **Ashley Hanekom** | Hanekom / Ashley | CONFIRMED | CA(SA) | SAICA | Superside | Western Cape/Cape Town | https://www.linkedin.com/in/ashleyhanekom/ |
| 198 | **Samantha Hanke** | Hanke / Samantha | CONFIRMED | CA(SA) | SAICA | Afrimat | Western Cape/Cape Town | https://www.linkedin.com/in/samantha-hanke-ca-sa-b923b1166/ |
| 199 | **Magda Harmse** | Harmse / Magda | FINANCE_ROLE_CONFIRMED | — | — | DSV - Global Transport and Logistics | Gauteng/Johannesburg | https://www.linkedin.com/in/magda-harmse-5940a540/ |
| 200 | **Linda Harris** | Harris / Linda | FINANCE_ROLE_CONFIRMED | — | — | Tronox | Western Cape/Hermanus | https://www.linkedin.com/in/linda-harris-13293129/ |
| 201 | **Nicole Harris** | Harris / Nicole | CONFIRMED | CA(SA) | SAICA | WBHO Construction | Johannesburg Metropolitan Area | https://www.linkedin.com/in/nicole-harris-ca-sa-8b6171150/ |
| 202 | **Portia Harrison** | Harrison / Portia | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo | Western Cape/Cape Town | https://www.linkedin.com/in/portia-harrison-589184121/ |
| 203 | **Shereen Hartnick** | Hartnick / Shereen | FINANCE_ROLE_CONFIRMED | — | — | Coca-Cola Peninsula Beverages (Pty) Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/shereen-hartnick-25a6101a/ |
| 204 | **Warnick Hartzenberg** | Hartzenberg / Warnick | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo | Western Cape/Cape Town | https://www.linkedin.com/in/warnick-hartzenberg/ |
| 205 | **Imtiaaz Hashim** | Hashim / Imtiaaz | CONFIRMED | CA(SA) | SAICA | BDO South Africa | Western Cape/Cape Town | — |
| 206 | **GAIL HATTING** | HATTING / GAIL | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | — | https://www.linkedin.com/in/gail-hatting-5ba77176/ |
| 207 | **Ashlin Healy** | Healy / Ashlin | CONFIRMED | CA(SA) | SAICA | Deloitte (South Africa) | Western Cape/Cape Town | https://www.linkedin.com/in/ashlin-healy-ca-sa-130238103/ |
| 208 | **Illana Helman** | Helman / Illana | CONFIRMED | CA(SA) | SAICA | Massmart | Gauteng/Johannesburg | https://www.linkedin.com/in/illana-helman-ca-sa-1279b117/ |
| 209 | **Geyrieya Hendricks** | Hendricks / Geyrieya | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group Limited | — | https://www.linkedin.com/in/geyrieya-hendricks-407454194/ |
| 210 | **Jacobie Hendricks** | Hendricks / Jacobie | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/jacobie-hendricks-2273a620a/ |
| 211 | **Bronvin Heuvel** | Heuvel / Bronvin | CONFIRMED | CA(SA) | SAICA | KPMG (South Africa) | Western Cape/Cape Town | https://www.linkedin.com/in/bronvin-heuvel-ca-sa-ra-7b2475a9/ |
| 212 | **Barry Heyns** | Heyns / Barry | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Stellenbosch | https://www.linkedin.com/in/bernhardheyns/ |
| 213 | **Patience Hlongwane** | Hlongwane / Patience | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Gauteng/Pretoria | https://www.linkedin.com/in/patience-hlongwane-743b48235/ |
| 214 | **Debra Hlophe, nèe Modiba** | Hlophe, nèe Modiba / Debra | FINANCE_ROLE_CONFIRMED | — | — | Concor | Gauteng/Johannesburg | https://www.linkedin.com/in/debra-hlophe-nèe-modiba-27451337/ |
| 215 | **Mduduzi Hlubi** | Hlubi / Mduduzi | FINANCE_ROLE_CONFIRMED | — | — | DSV - Global Transport and Logistics | Gauteng/Johannesburg | https://www.linkedin.com/in/mduduzi-hlubi-a21b1262/ |
| 216 | **susan hodgkinson** | hodgkinson / susan | FINANCE_ROLE_CONFIRMED | — | — | Concor | Gauteng/Johannesburg | https://www.linkedin.com/in/susan-hodgkinson-b31905248/ |
| 217 | **Mieke Hoffman** | Hoffman / Mieke | CONFIRMED | ACMA, CGMA | CIMA | The Fieldbar Co. | Western Cape/Cape Town | https://za.linkedin.com/in/mieke-hoffman |
| 218 | **Caron Hol** | Hol / Caron | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo | Western Cape/Cape Town | https://www.linkedin.com/in/caron-hol-65299a71/ |
| 219 | **Steven Holmes** | Holmes / Steven | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy (Pty) Ltd. | Gauteng/Johannesburg | https://www.linkedin.com/in/steven-holmes-04461511/ |
| 220 | **Susan Homann** | Homann / Susan | FINANCE_ROLE_CONFIRMED | — | — | Tronox | KwaZulu-Natal | https://www.linkedin.com/in/susan-homann-407a2389/ |
| 221 | **Sunell Humphris** | Humphris / Sunell | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Port Elizabeth Metropolitan Area | https://www.linkedin.com/in/sunell-humphris-71771b170/ |
| 222 | **André Huysamer** | Huysamer / André | HIGH_CONFIDENCE | AGA(SA) | SAICA | Kula | Western Cape/Worcester | — |
| 223 | **Darren Isaacs** | Isaacs / Darren | CONFIRMED | CA(SA) | SAICA | Makosi | — | — |
| 224 | **Juanita Isaacs** | Isaacs / Juanita | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo | Western Cape/Cape Town | https://www.linkedin.com/in/juanita-isaacs-88006724a/ |
| 225 | **Craig Isler** | Isler / Craig | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy (Pty) Ltd. | Western Cape/Cape Town | https://www.linkedin.com/in/craig-isler-b3a43497/ |
| 226 | **Parveen Ismail** | Ismail / Parveen | FINANCE_ROLE_CONFIRMED | — | — | I&J frozen fish | Western Cape/Cape Town | https://www.linkedin.com/in/parveen-ismail-001001273/ |
| 227 | **Aldrin Jacobs** | Jacobs / Aldrin | FINANCE_ROLE_CONFIRMED | — | — | Bowler Metcalf Ltd. | Western Cape/Cape Town | https://za.linkedin.com/in/aldrin-jacobs-56b72a9b |
| 228 | **Anilynne Jacobs** | Jacobs / Anilynne | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Western Cape/Cape Town | https://www.linkedin.com/in/anilynne-jacobs-265963165/ |
| 229 | **Anthea Jacobs** | Jacobs / Anthea | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group Limited | Western Cape/Cape Town | https://www.linkedin.com/in/anthea-jacobs/ |
| 230 | **Kyle Jacobs** | Jacobs / Kyle | FINANCE_ROLE_CONFIRMED | — | — | Kropz Elandsfontein | Western Cape/Cape Town | https://www.linkedin.com/in/kyle-jacobs-17aa7816b/ |
| 231 | **Anthea Jacobs (Hendricks) CA(SA)** | Jacobs (Hendricks) CA(SA) / Anthea | FINANCE_ROLE_CONFIRMED | — | — | KWV | Western Cape/Paarl | https://www.linkedin.com/in/anthea-hendricks-ca-sa-02501453/ |
| 232 | **Lisa Jainundh** | Jainundh / Lisa | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group Ltd | — | https://www.linkedin.com/in/lisa-jainundh-96b67199/ |
| 233 | **Mamogoto Jan Mokoala** | Jan Mokoala / Mamogoto | FINANCE_ROLE_CONFIRMED | — | — | Sunrise Energy | Gauteng/Johannesburg | https://www.linkedin.com/in/mamogoto-jan-mokoala-09a527b/ |
| 234 | **Roelof Jansen van Vuuren** | Jansen van Vuuren / Roelof | HIGH_CONFIDENCE | PA(SA) | SAIPA | The Tax Shop Pretoria North East | Gauteng/Pretoria | — |
| 235 | **Alana Johns** | Johns / Alana | HIGH_CONFIDENCE | PA(SA) | SAIPA | — | Western Cape | — |
| 236 | **Charne Johnston** | Johnston / Charne | FINANCE_ROLE_CONFIRMED | — | — | Capespan | Western Cape/Cape Town | https://www.linkedin.com/in/charnejohnston1/ |
| 237 | **Mark Jolliffe** | Jolliffe / Mark | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/Johannesburg | https://www.linkedin.com/in/mark-jolliffe-537803171/ |
| 238 | **Jeanette Jonker** | Jonker / Jeanette | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Western Cape/Cape Town | https://www.linkedin.com/in/jeanette-jonker-47878678/ |
| 239 | **Gaylin Jonkers** | Jonkers / Gaylin | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/gaylin-jonkers-37662457/ |
| 240 | **Samoray Jooste** | Jooste / Samoray | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/samoray-jooste-383191b7/ |
| 241 | **Anja Jordaan** | Jordaan / Anja | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/Johannesburg | https://www.linkedin.com/in/anja-jordaan-946bbb81/ |
| 242 | **Dean Jordaan** | Jordaan / Dean | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/dean-jordaan-7b331a1b3/ |
| 243 | **Francois Joubert** | Joubert / Francois | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 244 | **AJ Julies CA(SA)** | Julies CA(SA) / AJ | FINANCE_ROLE_CONFIRMED | — | — | RFG Foods | Western Cape/Paarl | https://www.linkedin.com/in/aj-julies-ca-sa-b7628699/ |
| 245 | **Ashley Julius** | Julius / Ashley | FINANCE_ROLE_CONFIRMED | — | — | KWV | Western Cape/Cape Town | https://www.linkedin.com/in/ashley-julius-a9192631/ |
| 246 | **Thapelo K. Matlawe** | K. Matlawe / Thapelo | FINANCE_ROLE_CONFIRMED | — | — | DSV - Global Transport and Logistics | Gauteng/Johannesburg | https://www.linkedin.com/in/thapelo-k-matlawe-ab34a5178/ |
| 247 | **Sumaya Kader CA(SA)** | Kader CA(SA) / Sumaya | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group Limited | Western Cape/Cape Town | https://www.linkedin.com/in/sumaya-kader-ca-sa-b5b32a1a3/ |
| 248 | **Nethin Karamchand** | Karamchand / Nethin | CONFIRMED | CA(SA) | SAICA | Deloitte (South Africa) | Western Cape/Cape Town | https://www.linkedin.com/in/nethin/ |
| 249 | **Carmen Karsten ACMA** | Karsten ACMA / Carmen | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/carmen-karsten-acma-cgma-464a46120/ |
| 250 | **Fia Karstens** | Karstens / Fia | FINANCE_ROLE_CONFIRMED | — | — | Capespan | Western Cape/Cape Town | https://www.linkedin.com/in/fia-karstens-995225155/ |
| 251 | **Jo-Lee Keefe** | Keefe / Jo-Lee | FINANCE_ROLE_CONFIRMED | — | — | SA Metal Group (Pty) Ltd | Gauteng/Johannesburg | https://www.linkedin.com/in/jo-lee-keefe-46b695100/ |
| 252 | **Bradley Kent** | Kent / Bradley | FINANCE_ROLE_CONFIRMED | — | — | AB InBev | Gauteng/Johannesburg | https://www.linkedin.com/in/bradley-kent-240798171/ |
| 253 | **Bridgete Kgopane** | Kgopane / Bridgete | FINANCE_ROLE_CONFIRMED | — | — | DSV - Global Transport and Logistics | Gauteng/Pretoria | https://www.linkedin.com/in/bridgete-kgopane-ab8485258/ |
| 254 | **Keneuwe Khati** | Khati / Keneuwe | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group Limited | Western Cape/Cape Town | https://www.linkedin.com/in/keneuwe-khati-584b7951/ |
| 255 | **Koko Khumalo** | Khumalo / Koko | CONFIRMED | CA(SA) | SAICA | Motlanalo Chartered Accountants and Auditors Inc | — | — |
| 256 | **Sithembiso Khumalo** | Khumalo / Sithembiso | FINANCE_ROLE_CONFIRMED | — | — | Mpact Limited | Gauteng/Johannesburg | https://www.linkedin.com/in/sithembiso-khumalo-725914117/ |
| 257 | **Carla Kilian** | Kilian / Carla | HIGH_CONFIDENCE | PA(SA) | SAIPA | AETOS Financial Services | Gauteng/Roodepoort | — |
| 258 | **Roland Killian CA(SA)** | Killian CA(SA) / Roland | FINANCE_ROLE_CONFIRMED | — | — | Mpact Limited | Gauteng/Johannesburg | https://www.linkedin.com/in/roland-killian-ca-sa-471a42a2/ |
| 259 | **sharon king king** | king king / sharon | FINANCE_ROLE_CONFIRMED | — | — | AfriSam | Gauteng/City of Johannesburg | https://www.linkedin.com/in/sharon-king-king-53321053/ |
| 260 | **Enrico Kleinbooi** | Kleinbooi / Enrico | CONFIRMED | CA(SA) | SAICA | Kannaland Municipality | Western Cape/Ladismith | — |
| 261 | **Melissa Klopper** | Klopper / Melissa | FINANCE_ROLE_CONFIRMED | — | — | DGB (Pty) Ltd | Gauteng/Johannesburg | https://www.linkedin.com/in/melissa-klopper-4286421a5/ |
| 262 | **Karmen Koch** | Koch / Karmen | FINANCE_ROLE_CONFIRMED | — | — | CHRYSO Southern Africa | Gauteng/Johannesburg | https://www.linkedin.com/in/karmen-koch-03b9b0106/ |
| 263 | **Daniel Koegelenberg** | Koegelenberg / Daniel | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Western Cape/City of Cape Town | https://www.linkedin.com/in/daniel-koegelenberg-72546291/ |
| 264 | **Rutger Koeman** | Koeman / Rutger | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo | Johannesburg Metropolitan Area | https://www.linkedin.com/in/rutgerkoeman/ |
| 265 | **Nkalipho Koenane** | Koenane / Nkalipho | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | KwaZulu-Natal/Empangeni | https://www.linkedin.com/in/nkalipho-koenane-625689248/ |
| 266 | **Rescha Kok** | Kok / Rescha | FINANCE_ROLE_CONFIRMED | — | — | DSV - Global Transport and Logistics | Gauteng/Johannesburg | https://www.linkedin.com/in/rescha-kok-07971471/ |
| 267 | **Mihlali Kosi** | Kosi / Mihlali | FINANCE_ROLE_CONFIRMED | — | — | Mpact Limited | Eastern Cape/Port Elizabeth | https://www.linkedin.com/in/mihali-kosi-1923ab91/ |
| 268 | **Dirk Kotze** | Kotze / Dirk | CONFIRMED | CA(SA) | SAICA | Afrimat | Western Cape/City of Cape Town | https://www.linkedin.com/in/dirk-kotze-09818018/ |
| 269 | **Magda Kotze** | Kotze / Magda | FINANCE_ROLE_CONFIRMED | — | — | Power Construction (Pty) Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/magda-kotze-a479a3116/ |
| 270 | **Nils Kotze** | Kotze / Nils | FINANCE_ROLE_CONFIRMED | — | — | Raubex Group Ltd | Free State/Bloemfontein | https://www.linkedin.com/in/nils-kotze-07344180/ |
| 271 | **Bianca Krishna CA(SA)** | Krishna CA(SA) / Bianca | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo | KwaZulu-Natal/Durban | https://www.linkedin.com/in/bianca-krishna-ca-sa-a365a5263/ |
| 272 | **Elna Kruger** | Kruger / Elna | FINANCE_ROLE_CONFIRMED | — | — | DSV - Global Transport and Logistics | Gauteng/Johannesburg | https://www.linkedin.com/in/elna-kruger-37804a160/ |
| 273 | **Kabelo Kuduntwane** | Kuduntwane / Kabelo | CONFIRMED | CA(SA) | SAICA | WBHO Construction | Gauteng/Pretoria | https://www.linkedin.com/in/kabelo-kuduntwane-ca-sa-0a52431a6/ |
| 274 | **Dylin Kuni** | Kuni / Dylin | CONFIRMED | ACMA, CGMA | CIMA | M+C Saatchi Group | Western Cape/Cape Town | https://www.linkedin.com/in/dylinkuni/ |
| 275 | **Ben Kutlwano Motsweni** | Kutlwano Motsweni / Ben | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Stellenbosch | https://www.linkedin.com/in/ben-kutlwano-motsweni-341974258/ |
| 276 | **Lesetja Kwetepane** | Kwetepane / Lesetja | HIGH_CONFIDENCE | PA(SA) | SAIPA | LA Financial Services (Pty) Ltd | Limpopo/Polokwane | — |
| 277 | **Garthan Lakay** | Lakay / Garthan | FINANCE_ROLE_CONFIRMED | — | — | KAL Group Limited | Western Cape/Cape Town | https://www.linkedin.com/in/garthan-lakay-bb980214b/ |
| 278 | **Div Lamprecht** | Lamprecht / Div | CONFIRMED | CA(SA) | SAICA | SAICA | Free State/Bloemfontein | — |
| 279 | **Anel Laubscher** | Laubscher / Anel | FINANCE_ROLE_CONFIRMED | — | — | CCH Commercial Cold Holdings | Western Cape/Cape Town | https://www.linkedin.com/in/anel-laubscher-27933270/ |
| 280 | **Elize Laubscher** | Laubscher / Elize | FINANCE_ROLE_CONFIRMED | — | — | Tronox | Western Cape/Saldanha Bay Local Municipality | https://www.linkedin.com/in/elize-laubscher-8999336b/ |
| 281 | **Ell-Mae Lawrence** | Lawrence / Ell-Mae | FINANCE_ROLE_CONFIRMED | — | — | KAL Group Limited | Western Cape/Paarl | https://www.linkedin.com/in/ell-mae-lawrence-54928927b/ |
| 282 | **Ell-Mae Lawrence CA(SA)** | Lawrence CA(SA) / Ell-Mae | FINANCE_ROLE_CONFIRMED | — | — | KAL Group Limited | Western Cape/Paarl | https://www.linkedin.com/in/ell-mae-lawrence-ca-sa-54928927b/ |
| 283 | **Eric le Roux** | le Roux / Eric | FINANCE_ROLE_CONFIRMED | — | — | KAL Group Limited | — | https://www.linkedin.com/in/eric-le-roux-896ab518a/ |
| 284 | **Johan le Roux** | le Roux / Johan | CONFIRMED | CA(SA) | SAICA | Johan le Roux CA(SA) | Western Cape/Milnerton (Cape Town) | — |
| 285 | **Thinus Le Roux** | Le Roux / Thinus | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 286 | **Rose Leduma** | Leduma / Rose | FINANCE_ROLE_CONFIRMED | — | — | AB InBev | Gauteng/Johannesburg | https://www.linkedin.com/in/rose-leduma-488895214/ |
| 287 | **Dineo Ledwaba** | Ledwaba / Dineo | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Johannesburg Metropolitan Area | https://www.linkedin.com/in/dineo-ledwaba-0b57885a/ |
| 288 | **Mr Lee Xaba** | Lee Xaba / Mr | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction | Gauteng | https://www.linkedin.com/in/mr-lee-xaba-1b88142a/ |
| 289 | **Tabisa Liborie Singenile Nkomo** | Liborie Singenile Nkomo / Tabisa | CONFIRMED | ACMA, CGMA | CIMA | WBHO Construction | Johannesburg Metropolitan Area | https://www.linkedin.com/in/tabisa-liborie-singenile-nkomo-cgma®-acma-3932b299/ |
| 290 | **Justin Liebenberg** | Liebenberg / Justin | FINANCE_ROLE_CONFIRMED | — | — | AB InBev | Gauteng/Johannesburg | https://www.linkedin.com/in/justin-liebenberg-9154b9108/ |
| 291 | **Naledi Liphapang** | Liphapang / Naledi | HIGH_CONFIDENCE | CA(SA) | SAICA | — | — | — |
| 292 | **James Liston** | Liston / James | CONFIRMED | CA(SA) | SAICA | Mpact Limited | Gauteng/Johannesburg | https://www.linkedin.com/in/james-liston-7516b2170/ |
| 293 | **Puleng Litsibane** | Litsibane / Puleng | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Gauteng/Germiston | https://www.linkedin.com/in/puleng-litsibane-a2440955/ |
| 294 | **Francisca Lloyd** | Lloyd / Francisca | FINANCE_ROLE_CONFIRMED | — | — | Macsteel Service Centres SA (Pty) Ltd | Gauteng/Benoni | https://www.linkedin.com/in/francisca-lloyd-11434792/ |
| 295 | **Anne-Lize Lochner** | Lochner / Anne-Lize | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/anne-lize-lochner-b3083421/ |
| 296 | **Andrew Logan** | Logan / Andrew | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction | Gauteng/Johannesburg | https://www.linkedin.com/in/andrew-logan-77011634/ |
| 297 | **Eduard Loubser CA(SA)** | Loubser CA(SA) / Eduard | FINANCE_ROLE_CONFIRMED | — | — | FAIR CAPE DAIRIES | Western Cape/Cape Town | https://www.linkedin.com/in/eduard-loubser-ca-sa-932778175/ |
| 298 | **Anwer Louw** | Louw / Anwer | FINANCE_ROLE_CONFIRMED | — | — | KWV | Western Cape/Cape Town | https://www.linkedin.com/in/anwer-louw-343009292/ |
| 299 | **Eugene Louw** | Louw / Eugene | FINANCE_ROLE_CONFIRMED | — | — | Kromco (Pty) Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/eugene-louw-6ab089b9/ |
| 300 | **Johanita Louw** | Louw / Johanita | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy (Pty) Ltd. | Western Cape/Cape Town | https://www.linkedin.com/in/johanita-louw-a5538060/ |
| 301 | **Leandré Louw** | Louw / Leandré | FINANCE_ROLE_CONFIRMED | — | — | KAL Group Limited | Western Cape/Malmesbury | https://www.linkedin.com/in/leandré-louw-a46350146/ |
| 302 | **Suzaan Louw** | Louw / Suzaan | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group Ltd | — | https://www.linkedin.com/in/suzaan-louw-49207339/ |
| 303 | **Lizane Lubbe** | Lubbe / Lizane | FINANCE_ROLE_CONFIRMED | — | — | Sentraal-Suid Co-operative (SSK) | Western Cape/Swellendam | https://www.linkedin.com/in/lizane-lubbe-42218b121/ |
| 304 | **Brendon Lucke** | Lucke / Brendon | FINANCE_ROLE_CONFIRMED | — | — | CCH Commercial Cold Holdings | Western Cape/Cape Town | https://www.linkedin.com/in/brendon-lucke-01494065/ |
| 305 | **Arline Luiters** | Luiters / Arline | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/arline-luiters-1626bb252/ |
| 306 | **Ewaldi Luus** | Luus / Ewaldi | FINANCE_ROLE_CONFIRMED | — | — | FAIR CAPE DAIRIES | Western Cape/Cape Town | https://www.linkedin.com/in/ewaldi-luus-4a06a5212/ |
| 307 | **Jesca M.** | M. / Jesca | FINANCE_ROLE_CONFIRMED | — | — | Premier Fishing SA | Western Cape/Cape Town | https://www.linkedin.com/in/jescameki/ |
| 308 | **Heinrich Maartens** | Maartens / Heinrich | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Gauteng/City of Johannesburg | https://www.linkedin.com/in/heinrich-maartens-9bb082b9/ |
| 309 | **Mbali Precious Mabaso** | Mabaso / Mbali | CONFIRMED | CA(SA) | SAICA | Nedbank Group Limited | — | — |
| 310 | **Zuko Maboma** | Maboma / Zuko | FINANCE_ROLE_CONFIRMED | — | — | Premier Fishing SA | Western Cape/Cape Town | https://www.linkedin.com/in/zukomaboma/ |
| 311 | **Rixongile Mabunda** | Mabunda / Rixongile | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy (Pty) Ltd. | Limpopo/Ba-Phalaborwa Local Municipality | https://www.linkedin.com/in/rixongile-mabunda-4a868797/ |
| 312 | **Nthabeleng Machesa CA(SA)** | Machesa CA(SA) / Nthabeleng | FINANCE_ROLE_CONFIRMED | — | — | Ardagh Group | Johannesburg Metropolitan Area | https://www.linkedin.com/in/nthabeleng-machesa-ca-sa-19999152/ |
| 313 | **Celeste Maclons** | Maclons / Celeste | FINANCE_ROLE_CONFIRMED | — | — | SA Metal Group (Pty) Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/celeste-maclons-15a76156/ |
| 314 | **Sinawo Madlingozi** | Madlingozi / Sinawo | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo | Eastern Cape/Port Elizabeth | https://www.linkedin.com/in/sinawo-madlingozi-03476b150/ |
| 315 | **Zanele Maduna** | Maduna / Zanele | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 316 | **Victor Madziwa** | Madziwa / Victor | FINANCE_ROLE_CONFIRMED | — | — | Tronox | Western Cape/Lutzville | https://www.linkedin.com/in/victor-madziwa-384398144/ |
| 317 | **Thembela Mafu** | Mafu / Thembela | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/Pretoria | https://www.linkedin.com/in/thembela-mafu-6a8b4817a/ |
| 318 | **Gillian Magolie** | Magolie / Gillian | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Western Cape/Cape Town | https://www.linkedin.com/in/gillian-magolie-05427865/ |
| 319 | **Unathi Magwentshu** | Magwentshu / Unathi | FINANCE_ROLE_CONFIRMED | — | — | Concor | Gauteng/Johannesburg | https://www.linkedin.com/in/unathi-magwentshu-aa662834/ |
| 320 | **navin mahabeer** | mahabeer / navin | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/Johannesburg | https://www.linkedin.com/in/navin-mahabeer-a8b00a26/ |
| 321 | **Nickeel maharaj** | maharaj / Nickeel | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy (Pty) Ltd. | Western Cape/Cape Town | https://www.linkedin.com/in/nickeel-maharaj-a29b12241/ |
| 322 | **Samantha Maharaj** | Maharaj / Samantha | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/Johannesburg | https://www.linkedin.com/in/samantha-maharaj-6b4730167/ |
| 323 | **Noloyiso Mahlakahlaka-Mhlubulwana** | Mahlakahlaka-Mhlubulwana / Noloyiso | FINANCE_ROLE_CONFIRMED | — | — | Macsteel Service Centres SA (Pty) Ltd | Gauteng/Johannesburg | https://www.linkedin.com/in/noloyiso-mahlakahlaka-a758128b/ |
| 324 | **Andrew Mahlaku** | Mahlaku / Andrew | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/Johannesburg | https://www.linkedin.com/in/andrew-mahlaku-a7503336/ |
| 325 | **Kgabiso Mahlangu** | Mahlangu / Kgabiso | CONFIRMED | AGA(SA) | SAICA | South African State Theatre | Gauteng/Pretoria | https://www.linkedin.com/in/kgabiso-mahlangu-aga-sa-b53a951a |
| 326 | **Sindisiwe Mahlangu** | Mahlangu / Sindisiwe | FINANCE_ROLE_CONFIRMED | — | — | DSV - Global Transport and Logistics | Johannesburg Metropolitan Area | https://www.linkedin.com/in/sindisiwe-mahlangu-72911b13b/ |
| 327 | **willie mahlangu** | mahlangu / willie | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | — | https://www.linkedin.com/in/willie-mahlangu-ab96771b/ |
| 328 | **Zaf Mahomed** | Mahomed / Zaf | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group Limited | Western Cape/Cape Town | https://www.linkedin.com/in/zmahomed/ |
| 329 | **Bonga Majozi** | Majozi / Bonga | FINANCE_ROLE_CONFIRMED | — | — | Coca-Cola Peninsula Beverages (Pty) Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/bonga-majozi-5892b284/ |
| 330 | **Chanelle Makhanya** | Makhanya / Chanelle | FINANCE_ROLE_CONFIRMED | — | — | The HEINEKEN Company | Gauteng/Johannesburg | https://www.linkedin.com/in/chanelle-makhanya-a3652317/ |
| 331 | **Mathabo Makhaya** | Makhaya / Mathabo | CONFIRMED | CA(SA) | SAICA | Harmony Gold Mining | — | — |
| 332 | **Sonwabile Makhesethi** | Makhesethi / Sonwabile | FINANCE_ROLE_CONFIRMED | — | — | Concor | Gauteng | https://www.linkedin.com/in/sonwabile-makhesethi-00b608204/ |
| 333 | **Mpho Makoko-Hottie** | Makoko-Hottie / Mpho | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 334 | **Patricia Malahlela** | Malahlela / Patricia | CONFIRMED | CA(SA) | SAICA | Mckenzie & Associates | — | — |
| 335 | **Fortunate Malaza** | Malaza / Fortunate | FINANCE_ROLE_CONFIRMED | — | — | DSV - Global Transport and Logistics | Gauteng | https://www.linkedin.com/in/fortunate-malaza-759917b1/ |
| 336 | **Tsireledzo Manabela** | Manabela / Tsireledzo | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Stellenbosch | https://www.linkedin.com/in/tsireledzo-manabela-0b4705233/ |
| 337 | **Phineas Manana** | Manana / Phineas | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/Pretoria | https://www.linkedin.com/in/phineas-manana-7bbb5a22b/ |
| 338 | **Manenzhe Manenzhe** | Manenzhe / Manenzhe | CONFIRMED | FCCA | ACCA | ACCA (South Africa) | Gauteng | https://www.linkedin.com/in/manenzhe-manenzhe-fcca-a80079150/ |
| 339 | **Siseko Maninjwa CA(SA)** | Maninjwa CA(SA) / Siseko | FINANCE_ROLE_CONFIRMED | — | — | Woodlands Dairy | Eastern Cape/Port Elizabeth | https://www.linkedin.com/in/siseko-maninjwa-ca-sa-28615b150/ |
| 340 | **Zaid Manjra** | Manjra / Zaid | CONFIRMED | CA(SA) | SAICA | Woolworths Holdings Ltd | Western Cape/Cape Town | — |
| 341 | **Lizo Manyana** | Manyana / Lizo | FINANCE_ROLE_CONFIRMED | — | — | Coca-Cola Peninsula Beverages (Pty) Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/lizo-manyana-89b64878/ |
| 342 | **Andisiwe Manzana** | Manzana / Andisiwe | FINANCE_ROLE_CONFIRMED | — | — | Mpact Limited | Gauteng/Johannesburg | https://www.linkedin.com/in/andisiwe-manzana-50265627/ |
| 343 | **Orapeleng Maragelo** | Maragelo / Orapeleng | FINANCE_ROLE_CONFIRMED | — | — | AfriSam | Gauteng/City of Johannesburg | https://www.linkedin.com/in/orapeleng-maragelo-8026b191/ |
| 344 | **Veronique MARCOUX** | MARCOUX / Veronique | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Gauteng/Johannesburg | https://www.linkedin.com/in/veronique-marcoux-55599614a/ |
| 345 | **Romy Maree** | Maree / Romy | CONFIRMED | CA(SA) | SAICA | Burstone (Real Estate partners) | — | — |
| 346 | **Wayne Marriday** | Marriday / Wayne | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/Cape Town | https://www.linkedin.com/in/wayne-marriday-0300b943/ |
| 347 | **Jody Marthinus** | Marthinus / Jody | FINANCE_ROLE_CONFIRMED | — | — | Lancewood | Western Cape/Mossel Bay | https://www.linkedin.com/in/jody-marthinus-1326ba39/ |
| 348 | **Richard Martin** | Martin / Richard | FINANCE_ROLE_CONFIRMED | — | — | SA Metal Group (Pty) Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/richard-martin-475185122/ |
| 349 | **Iaan Marx** | Marx / Iaan | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 350 | **Liziwe Maseloane** | Maseloane / Liziwe | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/Vanderbijlpark | https://www.linkedin.com/in/liziwe-maseloane-10270530a/ |
| 351 | **nomsa mashabela** | mashabela / nomsa | FINANCE_ROLE_CONFIRMED | — | — | DSV - Global Transport and Logistics | Gauteng/Pretoria | https://www.linkedin.com/in/nomsa-mashabela-853195122/ |
| 352 | **Mahosi Mashao** | Mashao / Mahosi | FINANCE_ROLE_CONFIRMED | — | — | AfriSam | — | https://www.linkedin.com/in/mahosi-mashao-77850b33/ |
| 353 | **Phillip Mashao** | Mashao / Phillip | FINANCE_ROLE_CONFIRMED | — | — | AfriSam | Limpopo/Polokwane Local Municipality | https://www.linkedin.com/in/phillip-mashao-72745831a/ |
| 354 | **Thapelo Mashashane** | Mashashane / Thapelo | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction | Gauteng/Johannesburg | https://www.linkedin.com/in/thapelo-mashashane-493215170/ |
| 355 | **Trevineth Masindi** | Masindi / Trevineth | FINANCE_ROLE_CONFIRMED | — | — | Macsteel Service Centres SA (Pty) Ltd | Gauteng/Johannesburg | https://www.linkedin.com/in/trevineth-masindi-95605011a/ |
| 356 | **Mfundo Maso** | Maso / Mfundo | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy (Pty) Ltd. | Gauteng/Johannesburg | https://www.linkedin.com/in/mfundo-maso-3559a4234/ |
| 357 | **Glacia Matadin** | Matadin / Glacia | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/Johannesburg | https://www.linkedin.com/in/glacia-matadin-256aa2b6/ |
| 358 | **Portia Mathebula** | Mathebula / Portia | FINANCE_ROLE_CONFIRMED | — | — | AB InBev | Gauteng/Johannesburg | https://www.linkedin.com/in/portia-mathebula-b6b8281a5/ |
| 359 | **Ofentse Matloha** | Matloha / Ofentse | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy (Pty) Ltd. | Western Cape/Cape Town | https://www.linkedin.com/in/ofentse-matloha-2a3338204/ |
| 360 | **Katlego Matshego** | Matshego / Katlego | HIGH_CONFIDENCE | CA(SA) | SAICA | Independent Institute of Education (IIE) Varsity College / MSA | — | — |
| 361 | **Tshepiso Mavimbela** | Mavimbela / Tshepiso | FINANCE_ROLE_CONFIRMED | — | — | Macsteel Service Centres SA (Pty) Ltd | Gauteng/Johannesburg | https://www.linkedin.com/in/tshepiso-mavimbela-49a99613a/ |
| 362 | **charlotte Mawela** | Mawela / charlotte | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo | Gauteng/Boksburg | https://www.linkedin.com/in/charlotte-mawela-0866ba91/ |
| 363 | **Phumelela Mbande** | Mbande / Phumelela | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 364 | **Thobile Mbangeni** | Mbangeni / Thobile | FINANCE_ROLE_CONFIRMED | — | — | AB InBev | Johannesburg Metropolitan Area | https://www.linkedin.com/in/thobile-mbangeni-6baa51141/ |
| 365 | **Athenkosi Mboniswa** | Mboniswa / Athenkosi | FINANCE_ROLE_CONFIRMED | — | — | Mpact Limited | Eastern Cape/Port Elizabeth | https://www.linkedin.com/in/athenkosi-mboniswa-73050b38/ |
| 366 | **Hlayisani Terrent Mboweni** | Mboweni / Hlayisani | HIGH_CONFIDENCE | PA(SA) | SAIPA | Mboweni Accountants | — | — |
| 367 | **Noxolo Mbutho** | Mbutho / Noxolo | FINANCE_ROLE_CONFIRMED | — | — | Mpact Limited | KwaZulu-Natal/Umhlanga | https://www.linkedin.com/in/noxolo-mbutho-16b841115/ |
| 368 | **Trevor McLachlan** | McLachlan / Trevor | HIGH_CONFIDENCE | PA(SA) | SAIPA | McA Inc. | Western Cape/Cape Town | — |
| 369 | **Celeste McLeroth** | McLeroth / Celeste | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction | Gauteng/Johannesburg | https://www.linkedin.com/in/celeste-mcleroth-4b22541a/ |
| 370 | **Phindile Mcunu** | Mcunu / Phindile | FINANCE_ROLE_CONFIRMED | — | — | DSV - Global Transport and Logistics | Gauteng/Johannesburg | https://www.linkedin.com/in/phindile-mcunu-036431128/ |
| 371 | **Rendani Mdluli** | Mdluli / Rendani | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction | Gauteng/Johannesburg | https://www.linkedin.com/in/rendani-mdluli-86898494/ |
| 372 | **Nontobeko Mehlomakhulu** | Mehlomakhulu / Nontobeko | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/Cape Town | https://www.linkedin.com/in/nontobeko-mehlomakhulu-7006108/ |
| 373 | **Kaylene Meintjies** | Meintjies / Kaylene | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/kaylene-meintjies-5a04a7123/ |
| 374 | **Zinathi Melamane** | Melamane / Zinathi | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Johannesburg Metropolitan Area | https://www.linkedin.com/in/zinathi-melamane-757a7941/ |
| 375 | **Rieduwaan Meniers** | Meniers / Rieduwaan | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Gauteng/Midrand | https://www.linkedin.com/in/rieduwaan-meniers-90446312a/ |
| 376 | **Kosie Menzangani** | Menzangani / Kosie | FINANCE_ROLE_CONFIRMED | — | — | DSV - Global Transport and Logistics | Gauteng/Johannesburg | https://www.linkedin.com/in/kosie-menzangani-877a6a7a/ |
| 377 | **Phumulani Menzi Mabena** | Menzi Mabena / Phumulani | FINANCE_ROLE_CONFIRMED | — | — | AB InBev | Gauteng/Johannesburg | https://www.linkedin.com/in/phumulani-menzi-mabena-0b696158/ |
| 378 | **Maurice Meyer** | Meyer / Maurice | FINANCE_ROLE_CONFIRMED | — | — | KWV | Western Cape/Cape Town | https://www.linkedin.com/in/maurice-meyer-08545a262/ |
| 379 | **Edgar Meyers** | Meyers / Edgar | FINANCE_ROLE_CONFIRMED | — | — | SA Metal Group (Pty) Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/edgar-meyers-12b98864/ |
| 380 | **Thobile Mgenge Otobor ACMA** | Mgenge Otobor ACMA / Thobile | FINANCE_ROLE_CONFIRMED | — | — | DSV - Global Transport and Logistics | Gauteng/Johannesburg | https://www.linkedin.com/in/thobile-mgenge-otobor-acma-cgma-mip-4593818a/ |
| 381 | **Lee-Roy Middleton** | Middleton / Lee-Roy | FINANCE_ROLE_CONFIRMED | — | — | KAL Group Limited | Western Cape/Cape Town | https://www.linkedin.com/in/lee-roy-middleton-19346446/ |
| 382 | **Carli Mills** | Mills / Carli | FINANCE_ROLE_CONFIRMED | — | — | Fruitways | — | https://www.linkedin.com/in/carli-mills-b8b3a5115/ |
| 383 | **Mangaliso Mithi** | Mithi / Mangaliso | CONFIRMED | FCMA, CGMA | CIMA | — | Gauteng/Johannesburg | https://www.linkedin.com/in/mangalisomithi/ |
| 384 | **thobile mkhabela** | mkhabela / thobile | FINANCE_ROLE_CONFIRMED | — | — | Raubex Group Ltd | Mpumalanga/Nelspruit | https://www.linkedin.com/in/thobile-mkhabela-a575a790/ |
| 385 | **Sikelela Mkungeki** | Mkungeki / Sikelela | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy (Pty) Ltd. | Western Cape/Cape Town | https://www.linkedin.com/in/sikelela-mkungeki-25a37372/ |
| 386 | **Gcina Mlambo** | Mlambo / Gcina | FINANCE_ROLE_CONFIRMED | — | — | PPC | Gauteng/City of Johannesburg | https://www.linkedin.com/in/gcina-mlambo-582643120/ |
| 387 | **Siphesihle Mlangeni** | Mlangeni / Siphesihle | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 388 | **Precious Moagi** | Moagi / Precious | FINANCE_ROLE_CONFIRMED | — | — | AfriSam | Gauteng/Meredale | https://www.linkedin.com/in/precious-moagi-a3b41b278/ |
| 389 | **Seragi Mogano,** | Mogano, / Seragi | FINANCE_ROLE_CONFIRMED | — | — | Tronox | Western Cape/Cape Town | https://www.linkedin.com/in/seragi-mogano-cima-cert-ba-452826a3/ |
| 390 | **Mpolaheng Mohlopi** | Mohlopi / Mpolaheng | CONFIRMED | CA(SA) | SAICA | Lanseria International Airport | Gauteng/Lanseria | — |
| 391 | **Goitsemang Mokaila** | Mokaila / Goitsemang | FINANCE_ROLE_CONFIRMED | — | — | The HEINEKEN Company | Johannesburg Metropolitan Area | https://www.linkedin.com/in/goitsemang-mokaila-4a417362/ |
| 392 | **Tumi Mokgoko** | Mokgoko / Tumi | CONFIRMED | CA(SA) | SAICA | KPMG | — | — |
| 393 | **Bonga Mokoena** | Mokoena / Bonga | CONFIRMED | CA(SA) | SAICA | BDO South Africa | Gauteng/Johannesburg | — |
| 394 | **Palesa Mokoena** | Mokoena / Palesa | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy (Pty) Ltd. | Gauteng/Pretoria | https://www.linkedin.com/in/palesa-mokoena-b74573127/ |
| 395 | **Phuti Mokoka** | Mokoka / Phuti | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | — | https://www.linkedin.com/in/phuti-mokoka-81b22a9b/ |
| 396 | **Pumla Molope** | Molope / Pumla | CONFIRMED | CA(SA) | SAICA | African Women Chartered Accountants (AWCA) | — | — |
| 397 | **Katlego Molopyane CA(SA)** | Molopyane CA(SA) / Katlego | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo | Gauteng/Johannesburg | https://www.linkedin.com/in/katlego-molopyane-ca-sa-b6a87b59/ |
| 398 | **Chrissie Moloseni** | Moloseni / Chrissie | CONFIRMED | CGMA | CIMA | PPC | Gauteng/Johannesburg | https://www.linkedin.com/in/chrissie-moloseni-bacc-mba-cgma-35787746/ |
| 399 | **Louise Moodley** | Moodley / Louise | FINANCE_ROLE_CONFIRMED | — | — | Mpact Limited | Gauteng/Roodepoort | https://www.linkedin.com/in/louise-moodley-0014283b1/ |
| 400 | **Mpho Mookapele** | Mookapele / Mpho | CONFIRMED | CA(SA) | SAICA | Energy and Water Sector Education and Training Authority (EWSETA) | — | — |
| 401 | **Karli Moore** | Moore / Karli | CONFIRMED | CA(SA) | SAICA | Afrimat | Western Cape/Cape Town | https://www.linkedin.com/in/karli-moore-ca-sa-24349b204/ |
| 402 | **Mmakgotso Mopeli** | Mopeli / Mmakgotso | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Stellenbosch | https://www.linkedin.com/in/mmakgotso-mopeli-140137223/ |
| 403 | **Nompi Morajane** | Morajane / Nompi | CONFIRMED | CA(SA) | SAICA | PPC | Gauteng/Johannesburg | https://www.linkedin.com/in/nompi-morajane-ca-sa-778a34b5/ |
| 404 | **Matselane Motaung** | Motaung / Matselane | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/Johannesburg | https://www.linkedin.com/in/matselane-motaung-7780a215/ |
| 405 | **Vincent Motholo** | Motholo / Vincent | CONFIRMED | CA(SA) | SAICA | University of Cape Town | Western Cape/Cape Town | https://www.linkedin.com/in/vincent-motholo-ca-sa-842b7613/ |
| 406 | **Thabang Mothuki** | Mothuki / Thabang | FINANCE_ROLE_CONFIRMED | — | — | Ardagh Group | Gauteng/Johannesburg | https://www.linkedin.com/in/thabang-mothuki-8ab4a1a4/ |
| 407 | **Victor Motsamai Madziwa** | Motsamai Madziwa / Victor | FINANCE_ROLE_CONFIRMED | — | — | TRONOX MINERAL SANDS (PTY) LTD | — | https://www.linkedin.com/in/victor-madziwa-98152a1b/ |
| 408 | **Nathaly Mouton** | Mouton / Nathaly | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/nathaly-mouton-424a5952/ |
| 409 | **virginia mouton** | mouton / virginia | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Western Cape/Cape Town | https://www.linkedin.com/in/virginia-mouton-33097271/ |
| 410 | **Leevas Moyana** | Moyana / Leevas | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/Cape Town | https://www.linkedin.com/in/leevas-moyana-49343059/ |
| 411 | **Sinazo Mpama** | Mpama / Sinazo | FINANCE_ROLE_CONFIRMED | — | — | Mpact Limited | Gauteng/Johannesburg | https://www.linkedin.com/in/sinazo-mpama-42bb4b109/ |
| 412 | **Vusi Mpofu** | Mpofu / Vusi | CONFIRMED | AGA(SA) | SAICA | Nedbank | — | — |
| 413 | **Owethu Msabane** | Msabane / Owethu | FINANCE_ROLE_CONFIRMED | — | — | Ardagh Group | Germiston Metropolitan Area | https://www.linkedin.com/in/owethu-msabane-b903a184/ |
| 414 | **Zine Mshengu** | Mshengu / Zine | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 415 | **Ayanda Msomi** | Msomi / Ayanda | CONFIRMED | CA(SA) | SAICA | Concor | Gauteng/Johannesburg | https://www.linkedin.com/in/ayanda-msomi-2446b615a/ |
| 416 | **Chwayita Mtebele** | Mtebele / Chwayita | CONFIRMED | CA(SA) | SAICA | Financial Sector Conduct Authority (FSCA) | — | — |
| 417 | **Sifiso Mthethwa** | Mthethwa / Sifiso | FINANCE_ROLE_CONFIRMED | — | — | PPC | Gauteng/City of Johannesburg | https://www.linkedin.com/in/sifiso-mthethwa-005024b4/ |
| 418 | **Siyabonga Mthethwa** | Mthethwa / Siyabonga | CONFIRMED | AGA(SA) | SAICA | Tronox | KwaZulu-Natal | https://www.linkedin.com/in/siyabonga-mthethwa-aga-sa-152923194/ |
| 419 | **Sivuyisiwe Mtshaka** | Mtshaka / Sivuyisiwe | FINANCE_ROLE_CONFIRMED | — | — | I&J frozen fish | Western Cape/Cape Town | https://www.linkedin.com/in/sivuyisiwe-mtshaka-361ba817b/ |
| 420 | **precious mulaudzi** | mulaudzi / precious | FINANCE_ROLE_CONFIRMED | — | — | DSV - Global Transport and Logistics | Gauteng/Johannesburg | https://www.linkedin.com/in/precious-mulaudzi-a5b9a5129/ |
| 421 | **Khanyisile Mumakwe** | Mumakwe / Khanyisile | FINANCE_ROLE_CONFIRMED | — | — | Macsteel Service Centres SA (Pty) Ltd | Gauteng/Johannesburg | https://www.linkedin.com/in/khanyisile-mumakwe-680b95120/ |
| 422 | **Ellaine Mundie - Michael** | Mundie - Michael / Ellaine | FINANCE_ROLE_CONFIRMED | — | — | DSV - Global Transport and Logistics | — | https://www.linkedin.com/in/ellaine-mundie-michael-b205b343/ |
| 423 | **Jody Munnik** | Munnik / Jody | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group Limited | Western Cape/Cape Town | https://www.linkedin.com/in/jody-munnik-9b5215219/ |
| 424 | **Tariro Mutizwa** | Mutizwa / Tariro | CONFIRMED | ACMA, CGMA | CIMA | AICPA & CIMA (CIMA Africa) | — | — |
| 425 | **shudufhadzo mutshutshu** | mutshutshu / shudufhadzo | FINANCE_ROLE_CONFIRMED | — | — | AB InBev | Gauteng/Johannesburg | https://www.linkedin.com/in/shudufhadzo-mutshutshu-58566a46/ |
| 426 | **Sandisiwe Myekwa nee Booi AGA (SA)** | Myekwa nee Booi AGA (SA) / Sandisiwe | FINANCE_ROLE_CONFIRMED | — | — | Premier Fishing SA | Western Cape/Cape Town | https://www.linkedin.com/in/sandisiwe-myekwa-nee-booi-aga-sa-034740211/ |
| 427 | **Sokhuthu Mziwoluntu** | Mziwoluntu / Sokhuthu | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/Mossel Bay | https://www.linkedin.com/in/sokhuthu-mziwoluntu-01468453/ |
| 428 | **Megan N.** | N. / Megan | FINANCE_ROLE_CONFIRMED | — | — | AB InBev | Gauteng/Johannesburg | https://www.linkedin.com/in/megan-n-83b663138/ |
| 429 | **Ritesh Nagar** | Nagar / Ritesh | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction | Gauteng/Johannesburg | https://www.linkedin.com/in/ritesh-nagar-22866b45/ |
| 430 | **Thiru Naicker CA (SA)** | Naicker CA (SA) / Thiru | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Western Cape | https://www.linkedin.com/in/thiru-naicker-ca-sa-16574024/ |
| 431 | **Aneshree Naidoo** | Naidoo / Aneshree | CONFIRMED | CA(SA) | SAICA | Webber Wentzel | — | — |
| 432 | **Kalnisha Naidoo** | Naidoo / Kalnisha | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Stellenbosch | https://www.linkedin.com/in/kalnisha-naidoo-965523101/ |
| 433 | **Kathie Naidoo** | Naidoo / Kathie | FINANCE_ROLE_CONFIRMED | — | — | CHRYSO Southern Africa | Gauteng/Johannesburg | https://www.linkedin.com/in/kathie-naidoo-30701997/ |
| 434 | **Thenashree Naidoo** | Naidoo / Thenashree | HIGH_CONFIDENCE | CA(SA) | SAICA | Durban ICC | KwaZulu-Natal/Durban | — |
| 435 | **Talisa Naidoo CA(SA)** | Naidoo CA(SA) / Talisa | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/talisa-naidoo-ca-sa-328533342/ |
| 436 | **Ziyaad Nakidien** | Nakidien / Ziyaad | FINANCE_ROLE_CONFIRMED | — | — | Capespan | Western Cape | https://www.linkedin.com/in/ziyaad-nakidien-166b86170/ |
| 437 | **Caroline Narrainsamy(Pillay)** | Narrainsamy(Pillay) / Caroline | FINANCE_ROLE_CONFIRMED | — | — | Tronox | KwaZulu-Natal | https://www.linkedin.com/in/caroline-narrainsamy-pillay-448271174/ |
| 438 | **Horstmann Natasha** | Natasha / Horstmann | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group Limited | Western Cape/Cape Town | https://www.linkedin.com/in/horstmann-natasha-aa92a090/ |
| 439 | **Gugu Ncala** | Ncala / Gugu | FINANCE_ROLE_CONFIRMED | — | — | Concor | Gauteng/Johannesburg | https://www.linkedin.com/in/gugu-ncala-8955b374/ |
| 440 | **Amahle Ndindi** | Ndindi / Amahle | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/amahle-ndindi-855541215/ |
| 441 | **Busi Ndlovu** | Ndlovu / Busi | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/Cape Town | https://www.linkedin.com/in/busi-ndlovu-6b21b263/ |
| 442 | **Netshia Nduvho** | Nduvho / Netshia | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Gauteng/Kempton Park | https://www.linkedin.com/in/netshia-nduvho-02547b293/ |
| 443 | **Andiswa Ndwalane** | Ndwalane / Andiswa | FINANCE_ROLE_CONFIRMED | — | — | AB InBev | — | https://www.linkedin.com/in/andiswa-ndwalane-66492821a/ |
| 444 | **Déhan Nel** | Nel / Déhan | FINANCE_ROLE_CONFIRMED | — | — | Lancewood | Western Cape/George | https://www.linkedin.com/in/déhan-nel-ca-sa-b4b49920a/ |
| 445 | **Louis Nel** | Nel / Louis | FINANCE_ROLE_CONFIRMED | — | — | Tru-Cape Fruit Marketing | — | https://www.linkedin.com/in/louis-nel-204935a6/ |
| 446 | **Melisa Nel** | Nel / Melisa | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Western Cape/Cape Town | https://www.linkedin.com/in/melisa-nel-b73751239/ |
| 447 | **Nastassja Nel** | Nel / Nastassja | CONFIRMED | AGA(SA) | SAICA | Schoemans Registered Auditors and Chartered Accountants | Western Cape/Cape Town | https://www.linkedin.com/in/nastassja-nel-71a15364/ |
| 448 | **Leonie Nell** | Nell / Leonie | FINANCE_ROLE_CONFIRMED | — | — | Lancewood | Western Cape/George | https://www.linkedin.com/in/leonie-nell-412a12284/ |
| 449 | **Wilhelm Nell** | Nell / Wilhelm | FINANCE_ROLE_CONFIRMED | — | — | FAIR CAPE DAIRIES | Western Cape/Durbanville | https://www.linkedin.com/in/wilhelm-nell-867aa0104/ |
| 450 | **Linda Nene (FIIASA,CRMA,CCSA,CPrac(SA))** | Nene (FIIASA,CRMA,CCSA,CPrac(SA)) / Linda | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | — | https://www.linkedin.com/in/linda-nene-fiiasa-crma-ccsa-cprac-sa-91911827/ |
| 451 | **Aviwe Ngcawuzele** | Ngcawuzele / Aviwe | FINANCE_ROLE_CONFIRMED | — | — | I&J frozen fish | Western Cape/Cape Town | https://www.linkedin.com/in/aviwe-ngcawuzele-1a25aa133/ |
| 452 | **Qaqamba Ngcawuzele** | Ngcawuzele / Qaqamba | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy (Pty) Ltd. | Western Cape/Cape Town | https://www.linkedin.com/in/qaqamba-ngcawuzele-151569146/ |
| 453 | **Njabulo Ngcobo** | Ngcobo / Njabulo | FINANCE_ROLE_CONFIRMED | — | — | AB InBev | Gauteng/Johannesburg | https://www.linkedin.com/in/njabulo-ngcobo/ |
| 454 | **Kulani Ngobeni CA (SA)** | Ngobeni CA (SA) / Kulani | FINANCE_ROLE_CONFIRMED | — | — | Mpact Limited | Johannesburg Metropolitan Area | https://www.linkedin.com/in/kulani-ngobeni-503b7790/ |
| 455 | **Lindokuhle Ngqobane** | Ngqobane / Lindokuhle | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy (Pty) Ltd. | Western Cape | https://www.linkedin.com/in/lindokuhle-ngqobane-221782159/ |
| 456 | **Thabang Ngwenya** | Ngwenya / Thabang | FINANCE_ROLE_CONFIRMED | — | — | AB InBev | Gauteng/Johannesburg | https://www.linkedin.com/in/thabang-ngwenya-b80172101/ |
| 457 | **Nkosinathi Nicholus Mabuza** | Nicholus Mabuza / Nkosinathi | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction | Gauteng/Johannesburg | https://www.linkedin.com/in/nkosinathi-nicholus-mabuza-a6095266/ |
| 458 | **Markus NIEUWOUDT CMILT, MCTP(SA), Compliance Practitioner** | NIEUWOUDT CMILT, MCTP(SA), Compliance Practitioner / Markus | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction | Gauteng/Johannesburg | https://www.linkedin.com/in/markus-nieuwoudt-cmilt-mctp-sa-compliance-practitioner-625798321/ |
| 459 | **Relebohile Nkojoana CA(SA)** | Nkojoana CA(SA) / Relebohile | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo | Johannesburg Metropolitan Area | https://www.linkedin.com/in/relebohile/ |
| 460 | **Ande Nkontso** | Nkontso / Ande | FINANCE_ROLE_CONFIRMED | — | — | DSV - Global Transport and Logistics | Gauteng/Johannesburg | https://www.linkedin.com/in/ande-nkontso-606504196/ |
| 461 | **Luyanda Nkonyane CA(SA)** | Nkonyane CA(SA) / Luyanda | FINANCE_ROLE_CONFIRMED | — | — | Mpact Limited | Gauteng | https://www.linkedin.com/in/luyanda-nkonyane-ba648185/ |
| 462 | **Absay Nkosi** | Nkosi / Absay | FINANCE_ROLE_CONFIRMED | — | — | Concor | Gauteng/Johannesburg | https://www.linkedin.com/in/absay-nkosi-b47b3511a/ |
| 463 | **Delani Nkosi** | Nkosi / Delani | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/Johannesburg | https://www.linkedin.com/in/delani-nkosi-ab502676/ |
| 464 | **Dianne Noake** | Noake / Dianne | FINANCE_ROLE_CONFIRMED | — | — | DSV - Global Transport and Logistics | Gauteng/Benoni | https://www.linkedin.com/in/dianne-noake-b153669a/ |
| 465 | **Sanele Nodume** | Nodume / Sanele | CONFIRMED | CA(SA) | SAICA | Astron Energy (Pty) Ltd. | Western Cape/Cape Town | https://www.linkedin.com/in/sanele-nodume-ca-sa-36034622b/ |
| 466 | **Nolwazi Nokuthula Nkabinde** | Nokuthula Nkabinde / Nolwazi | FINANCE_ROLE_CONFIRMED | — | — | DGB (Pty) Ltd | Gauteng/Johannesburg | https://www.linkedin.com/in/nolwazi-nokuthula-nkabinde-9035251a3/ |
| 467 | **Msutwana NOLUVO** | NOLUVO / Msutwana | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy (Pty) Ltd. | — | https://www.linkedin.com/in/msutwana-noluvo-0750a263/ |
| 468 | **Buhle Hanise Nomabunga** | Nomabunga / Buhle | CONFIRMED | CA(SA) | SAICA | BAIC (South Africa) | — | — |
| 469 | **Sithole Nonsikelelo** | Nonsikelelo / Sithole | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/Cape Town | https://www.linkedin.com/in/sithole-nonsikelelo-1b881a54/ |
| 470 | **Busisiwe Ntombifikile Mkhize** | Ntombifikile Mkhize / Busisiwe | FINANCE_ROLE_CONFIRMED | — | — | Macsteel Service Centres SA (Pty) Ltd | KwaZulu-Natal/Durban | https://www.linkedin.com/in/busisiwe-ntombifikile-mkhize-92106646/ |
| 471 | **faith ntshingila** | ntshingila / faith | FINANCE_ROLE_CONFIRMED | — | — | DGB (Pty) Ltd | Gauteng/Johannesburg | https://www.linkedin.com/in/faith-ntshingila-642900125/ |
| 472 | **Anele Ntsinde** | Ntsinde / Anele | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction | Gauteng/Johannesburg | https://www.linkedin.com/in/anele-ntsinde-9b6a51a3/ |
| 473 | **Zizipho Nyanga** | Nyanga / Zizipho | CONFIRMED | CA(SA) | SAICA | Masisizane Fund (Old Mutual) | — | — |
| 474 | **Jabulile Nyathi** | Nyathi / Jabulile | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 475 | **Linda Nyirenda (ACMA** | Nyirenda (ACMA / Linda | FINANCE_ROLE_CONFIRMED | — | — | AB InBev | Gauteng/Johannesburg | https://www.linkedin.com/in/linda-nyirenda-acma-cgma-5ab7ba15a/ |
| 476 | **Phila Nyoka** | Nyoka / Phila | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo | Gauteng | https://www.linkedin.com/in/phila-nyoka-88a416213/ |
| 477 | **Desire October** | October / Desire | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/desire-october-517967181/ |
| 478 | **Liezel Odendaal** | Odendaal / Liezel | FINANCE_ROLE_CONFIRMED | — | — | DSV - Global Transport and Logistics | Gauteng/Boksburg | https://www.linkedin.com/in/liezel-odendaal-571314225/ |
| 479 | **Henk Odendaal CA (SA)** | Odendaal CA (SA) / Henk | FINANCE_ROLE_CONFIRMED | — | — | Fruitways | Western Cape/Cape Town | https://www.linkedin.com/in/henk-odendaal-ca-sa-92b86887/ |
| 480 | **Crystal Okkers** | Okkers / Crystal | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/crystal-okkers-71482174/ |
| 481 | **Nelia Oosthuizen** | Oosthuizen / Nelia | FINANCE_ROLE_CONFIRMED | — | — | Mpact Limited | KwaZulu-Natal | https://www.linkedin.com/in/nelia-oosthuizen-6a532841/ |
| 482 | **Quintin Oosthuizen** | Oosthuizen / Quintin | CONFIRMED | CA(SA) | SAICA | Haw & Inglis / H&I Construction | Western Cape/Cape Town | — |
| 483 | **Beryl Ownhouse** | Ownhouse / Beryl | FINANCE_ROLE_CONFIRMED | — | — | PPC | Eastern Cape/Port Elizabeth | https://www.linkedin.com/in/beryl-ownhouse-944436341/ |
| 484 | **Shalin P.** | P. / Shalin | FINANCE_ROLE_CONFIRMED | — | — | Mpact Limited | Johannesburg Metropolitan Area | https://www.linkedin.com/in/shalinpatel-/ |
| 485 | **Velashnie Padayachee** | Padayachee / Velashnie | FINANCE_ROLE_CONFIRMED | — | — | CHRYSO Southern Africa | — | https://www.linkedin.com/in/velashnie-padayachee-aa569b86/ |
| 486 | **Ramon Padayachi** | Padayachi / Ramon | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/Cape Town | https://www.linkedin.com/in/ramon-padayachi-64b07a10/ |
| 487 | **Karlien Panter** | Panter / Karlien | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Mpumalanga/Nelspruit | https://www.linkedin.com/in/karlien-panter-55bb46117/ |
| 488 | **Emma Pardoe** | Pardoe / Emma | CONFIRMED | CA(SA) | SAICA | Emma Pardoe Chartered Accountants (SA) | Western Cape/Somerset West | https://www.linkedin.com/in/emmapardoe/ |
| 489 | **Junaid Parker** | Parker / Junaid | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group Limited | Western Cape/Cape Town | https://www.linkedin.com/in/junaid-parker-b67032135/ |
| 490 | **Sylwia Parzuchowski** | Parzuchowski / Sylwia | FINANCE_ROLE_CONFIRMED | — | — | DSV - Global Transport and Logistics | Gauteng/Johannesburg | https://www.linkedin.com/in/sylwia-parzuchowski-24b69b80/ |
| 491 | **Anisah Patel** | Patel / Anisah | CONFIRMED | CA(SA) | SAICA | Own practice (Vereeniging) | Gauteng/Vereeniging | — |
| 492 | **Safiyah Patel** | Patel / Safiyah | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Port Elizabeth Metropolitan Area | https://www.linkedin.com/in/safiyah-patel-575910193/ |
| 493 | **Tierney Paul** | Paul / Tierney | FINANCE_ROLE_CONFIRMED | — | — | DSV - Global Transport and Logistics | Gauteng/Johannesburg | https://www.linkedin.com/in/tierney-paul-3974b1152/ |
| 494 | **Brett Penney** | Penney / Brett | CONFIRMED | CA(SA) | SAICA | SIKA South Africa (Pty) Ltd | KwaZulu-Natal/eThekwini | https://za.linkedin.com/in/brett-penney-7821aa10a |
| 495 | **Jonathan Petley** | Petley / Jonathan | FINANCE_ROLE_CONFIRMED | — | — | Betko Fresh Produce (Pty) Ltd. | Western Cape/Somerset West | https://www.linkedin.com/in/jonathan-petley-671363a3/ |
| 496 | **Kefiloe Petunia Mashinini** | Petunia Mashinini / Kefiloe | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo | Gauteng/Johannesburg | https://www.linkedin.com/in/kefie-mashinini-b8336023/ |
| 497 | **BRENDA PHASHA** | PHASHA / BRENDA | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Johannesburg Metropolitan Area | https://www.linkedin.com/in/brenda-phasha-44bba61a1/ |
| 498 | **Lunga Phewa** | Phewa / Lunga | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Gauteng/Johannesburg | https://www.linkedin.com/in/lunga-phewa-36a6839a/ |
| 499 | **JD Pienaar** | Pienaar / JD | FINANCE_ROLE_CONFIRMED | — | — | KAL Group Limited | Western Cape/Cape Town | https://www.linkedin.com/in/jd-pienaar-9a5943b8/ |
| 500 | **Monique Pienaar (neé du Toit)** | Pienaar (neé du Toit) / Monique | FINANCE_ROLE_CONFIRMED | — | — | Overberg Agri | Western Cape/Hermanus | https://www.linkedin.com/in/monique-pienaar-neé-du-toit-90875b110/ |
| 501 | **Esther Pieterse** | Pieterse / Esther | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 502 | **steven pillay** | pillay / steven | FINANCE_ROLE_CONFIRMED | — | — | Nampak Liquid Cartons | Gauteng/Johannesburg | https://www.linkedin.com/in/steven-pillay-0a584230/ |
| 503 | **Youlanda Pillay** | Pillay / Youlanda | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/youlanda-pillay-3888a644/ |
| 504 | **Kershnee Pillay Reddy** | Pillay Reddy / Kershnee | CONFIRMED | CA(SA) | SAICA | PPC | Gauteng/City of Johannesburg | https://www.linkedin.com/in/kershnee-reddy-ca-sa-b532004b/ |
| 505 | **Rethabile Pindani** | Pindani / Rethabile | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/rethabile-pindani-722913170/ |
| 506 | **Liantie Pitchers** | Pitchers / Liantie | FINANCE_ROLE_CONFIRMED | — | — | Mpact Limited | Mpumalanga/Nelspruit | https://www.linkedin.com/in/liantie-pitchers-55427a113/ |
| 507 | **Alice Polinyane** | Polinyane / Alice | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Gauteng/Johannesburg | https://www.linkedin.com/in/alice-polinyane-617580167/ |
| 508 | **Jan Potgieter** | Potgieter / Jan | HIGH_CONFIDENCE | CA(SA) | SAICA | TFG Limited (The Foschini Group) | — | — |
| 509 | **Reosha Premduth** | Premduth / Reosha | CONFIRMED | AGA(SA) | SAICA | Afrimat | Western Cape/Cape Town | https://www.linkedin.com/in/reosha-premduth-aga-sa-3a0b4b193/ |
| 510 | **Karonien Pretorius** | Pretorius / Karonien | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | — | https://www.linkedin.com/in/karonien-pretorius-8543ab143/ |
| 511 | **Susan Prinsloo** | Prinsloo / Susan | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/Johannesburg | https://www.linkedin.com/in/susan-prinsloo-74978243/ |
| 512 | **Amanda Punt** | Punt / Amanda | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction | Gauteng/Johannesburg | https://www.linkedin.com/in/amanda-punt-472b54100/ |
| 513 | **fani puthini** | puthini / fani | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/Alberton | https://www.linkedin.com/in/fani-puthini-987a2b25b/ |
| 514 | **Siziphiwe Qayiso** | Qayiso / Siziphiwe | FINANCE_ROLE_CONFIRMED | — | — | Southern Oil (Pty) Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/siziphiwe-qayiso-80a4ab1a2/ |
| 515 | **Ayaduma Qonono** | Qonono / Ayaduma | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy (Pty) Ltd. | Western Cape/Cape Town | https://www.linkedin.com/in/ayaduma-qonono-1a6387340/ |
| 516 | **Diana Quintero Ruiz    (MBA)** | Quintero Ruiz (MBA) / Diana | FINANCE_ROLE_CONFIRMED | — | — | DSV - Global Transport and Logistics | Gauteng/Johannesburg | https://www.linkedin.com/in/diana-quintero-ruiz-mba-b1b30811/ |
| 517 | **Lynn Radcliffe** | Radcliffe / Lynn | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/lynn-radcliffe-32271959/ |
| 518 | **Prudence Radebe** | Radebe / Prudence | FINANCE_ROLE_CONFIRMED | — | — | AfriSam | — | https://www.linkedin.com/in/prudence-radebe-906410116/ |
| 519 | **Tlhologelo Radebe** | Radebe / Tlhologelo | FINANCE_ROLE_CONFIRMED | — | — | Concor | Gauteng/Springs | https://www.linkedin.com/in/tlhologeloradebe/ |
| 520 | **Vincent Radebe GTP(SA)** | Radebe GTP(SA) / Vincent | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Johannesburg Metropolitan Area | https://www.linkedin.com/in/vincent-radebe-gtp-sa-04016624/ |
| 521 | **Firaz Rahman CA(SA)** | Rahman CA(SA) / Firaz | FINANCE_ROLE_CONFIRMED | — | — | RFG Foods | Western Cape/Cape Town | https://www.linkedin.com/in/firaz-rahman-ca-sa-b4117a8a/ |
| 522 | **Aishwarya Rajkoomar** | Rajkoomar / Aishwarya | FINANCE_ROLE_CONFIRMED | — | — | Ardagh Group | Gauteng/Johannesburg | https://www.linkedin.com/in/aishwarya-rajkoomar-3737a0128/ |
| 523 | **Taryn Raju** | Raju / Taryn | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 524 | **Florence Ramabina** | Ramabina / Florence | FINANCE_ROLE_CONFIRMED | — | — | DSV - Global Transport and Logistics | Gauteng/Clayville | https://www.linkedin.com/in/florence-ramabina-241785203/ |
| 525 | **Raymond Ramokgaba** | Ramokgaba / Raymond | FINANCE_ROLE_CONFIRMED | — | — | NJR Steel Holdings (Pty) Ltd | Gauteng/Johannesburg | https://www.linkedin.com/in/raymond-ramokgaba-19b14019/ |
| 526 | **Shamima Ranchod** | Ranchod / Shamima | FINANCE_ROLE_CONFIRMED | — | — | AfriSam | Gauteng/City of Johannesburg | https://www.linkedin.com/in/shamima-ranchod-861274114/ |
| 527 | **Shikhaar Ravidas CA(SA)** | Ravidas CA(SA) / Shikhaar | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/shikhaar-ravidas-ca-sa-688b02141/ |
| 528 | **Siyanda Rayi Nameka** | Rayi Nameka / Siyanda | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Western Cape/City of Cape Town | https://www.linkedin.com/in/siyanda-rayi-nameka-393a1999/ |
| 529 | **Lenica Reddy** | Reddy / Lenica | FINANCE_ROLE_CONFIRMED | — | — | CHRYSO Southern Africa | Gauteng/Johannesburg | https://www.linkedin.com/in/lenica-reddy-13253a9b/ |
| 530 | **Ciara Reintjes** | Reintjes / Ciara | CONFIRMED | CA(SA) | SAICA | SAICA | — | — |
| 531 | **Chantelle Reyerse** | Reyerse / Chantelle | FINANCE_ROLE_CONFIRMED | — | — | The Dutoit Group | Gauteng/Roodepoort | https://www.linkedin.com/in/chantelle-reyerse-2124ba59/ |
| 532 | **Vanessa Rheeder** | Rheeder / Vanessa | CONFIRMED | CA(SA) | SAICA | The Modern CFO | Western Cape/Cape Town | https://www.linkedin.com/in/vanessa-rheeder-ca-sa/ |
| 533 | **Dave Rich** | Rich / Dave | CONFIRMED | CA(SA) | SAICA | Streets Chartered Accountants (Cape Town) | Western Cape/Cape Town | — |
| 534 | **Alan Robbins** | Robbins / Alan | ARTICLES_CONFIRMED_DESIGNATION_UNVERIFIED | — | — | Sable International | Western Cape/Cape Town | — |
| 535 | **Antonio Roberts** | Roberts / Antonio | FINANCE_ROLE_CONFIRMED | — | — | KWV | Western Cape/Cape Town | https://www.linkedin.com/in/antonio-roberts/ |
| 536 | **Hanna Robertson** | Robertson / Hanna | FINANCE_ROLE_CONFIRMED | — | — | DGB (Pty) Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/hanna-robertson-66993592/ |
| 537 | **Nadine Robus Littleford** | Robus Littleford / Nadine | FINANCE_ROLE_CONFIRMED | — | — | Mpact Limited | — | https://www.linkedin.com/in/nadine-robus-hill-8a162877/ |
| 538 | **Lynette Roeloffze** | Roeloffze / Lynette | CONFIRMED | CA(SA) | SAICA | Forvis Mazars Group | Gauteng/Johannesburg | https://www.linkedin.com/in/lynette-roeloffze-ca-sa-ra-0637aa13/ |
| 539 | **Freeman-Garnatt Ronell** | Ronell / Freeman-Garnatt | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/Cape Town | https://www.linkedin.com/in/freeman-garnatt-ronell-530a9396/ |
| 540 | **Bianca Roos** | Roos / Bianca | CONFIRMED | CA(SA) | SAICA | PKF Octagon | — | — |
| 541 | **Marnus Roothman** | Roothman / Marnus | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction | Gauteng/Pretoria | https://www.linkedin.com/in/marnus-roothman-31a59aa0/ |
| 542 | **Roz Roseline** | Roseline / Roz | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/Rand West City | https://www.linkedin.com/in/roz-roseline-a5353427/ |
| 543 | **Sydney Rudzani CA(SA)** | Rudzani CA(SA) / Sydney | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group Ltd | — | https://www.linkedin.com/in/sydney-rudzani-ca-sa-mba-cum-laude-acma-cgma-19658a96/ |
| 544 | **Alexis Sacks** | Sacks / Alexis | CONFIRMED | CA(SA) | SAICA | Streets Chartered Accountants (Cape Town) | Western Cape/Cape Town | — |
| 545 | **Hishaam Salie** | Salie / Hishaam | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group Limited | Western Cape/Cape Town | https://www.linkedin.com/in/hishaam-salie-44726b3a/ |
| 546 | **Gadija Samaai** | Samaai / Gadija | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group Ltd | Western Cape/Paarl | https://www.linkedin.com/in/gadija-samaai-ab427a98/ |
| 547 | **Junaid Samad** | Samad / Junaid | FINANCE_ROLE_CONFIRMED | — | — | Ardagh Group | Gauteng/Johannesburg | https://www.linkedin.com/in/junaid-samad-1b788540/ |
| 548 | **Graham Saunders** | Saunders / Graham | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/Johannesburg | https://www.linkedin.com/in/graham-saunders-70488453/ |
| 549 | **Naazeneen Sayed** | Sayed / Naazeneen | FINANCE_ROLE_CONFIRMED | — | — | DSV - Global Transport and Logistics | Gauteng/Johannesburg | https://www.linkedin.com/in/naazeneen-sayed-8b54b0b3/ |
| 550 | **Tarryn Scholtz** | Scholtz / Tarryn | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo | Western Cape/Cape Town | https://www.linkedin.com/in/tarryn-scholtz-a2435a1ab/ |
| 551 | **Matheus Schreuder** | Schreuder / Matheus | FINANCE_ROLE_CONFIRMED | — | — | FAIR CAPE DAIRIES | Western Cape/Durbanville | https://www.linkedin.com/in/matheus-schreuder-1157b6264/ |
| 552 | **Phillip Schreuder** | Schreuder / Phillip | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy (Pty) Ltd. | Western Cape/Cape Town | https://www.linkedin.com/in/phillip-schreuder-650971124/ |
| 553 | **Itumeleng Sealetsa** | Sealetsa / Itumeleng | FINANCE_ROLE_CONFIRMED | — | — | AB InBev | Gauteng/Johannesburg | https://www.linkedin.com/in/itumeleng-sealetsa-26a81bab/ |
| 554 | **Mabatho Sedikela** | Sedikela / Mabatho | HIGH_CONFIDENCE | CA(SA) | SAICA | Auditor-General of South Africa (AGSA) | — | — |
| 555 | **Danzil September** | September / Danzil | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Stellenbosch | https://www.linkedin.com/in/danzil-september-888a93230/ |
| 556 | **Lyle September** | September / Lyle | FINANCE_ROLE_CONFIRMED | — | — | KWV | Western Cape/Kuils River | https://www.linkedin.com/in/lyleseptember0798/ |
| 557 | **Sergio September** | September / Sergio | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo | Western Cape/Cape Town | https://www.linkedin.com/in/sergio-september-21276b90/ |
| 558 | **Leon Serfontein** | Serfontein / Leon | FINANCE_ROLE_CONFIRMED | — | — | AfriSam | Gauteng/City of Johannesburg | https://www.linkedin.com/in/leon-serfontein-6559b168/ |
| 559 | **Masechaba Sesing** | Sesing / Masechaba | CONFIRMED | CA(SA) | SAICA | Free State Provincial Treasury | Free State/Bloemfontein | — |
| 560 | **Nqobile Shabane (CA)SA** | Shabane (CA)SA / Nqobile | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Durban Metropolitan Area | https://www.linkedin.com/in/nqobile-shabane-ca-sa-722518152/ |
| 561 | **Thandolwenkosi Shabangu** | Shabangu / Thandolwenkosi | FINANCE_ROLE_CONFIRMED | — | — | Mpact Limited | Mpumalanga/Piet Retief | https://www.linkedin.com/in/thandolwenkosi-shabangu-62b4b4192/ |
| 562 | **Aadila Shaikh** | Shaikh / Aadila | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Gauteng | https://www.linkedin.com/in/aadila-shaikh-93452824b/ |
| 563 | **Temoso Shazi** | Shazi / Temoso | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo | Gauteng | https://www.linkedin.com/in/temoso-shazi-034ba76/ |
| 564 | **Emmaculate Shezi** | Shezi / Emmaculate | FINANCE_ROLE_CONFIRMED | — | — | GVK-Siya Zama Building Contractors | — | https://uk.linkedin.com/in/emmaculate-shezi-85010abb |
| 565 | **Sibongile Sibongile.Kubeka** | Sibongile.Kubeka / Sibongile | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/Johannesburg | https://www.linkedin.com/in/sibongile-sibongile-kubeka-9a548125/ |
| 566 | **Portia Sihlahla** | Sihlahla / Portia | FINANCE_ROLE_CONFIRMED | — | — | DSV - Global Transport and Logistics | Gauteng/Johannesburg | https://www.linkedin.com/in/portia-sihlahla-2a08221a9/ |
| 567 | **Graeme Sim** | Sim / Graeme | FINANCE_ROLE_CONFIRMED | — | — | KAL Group Limited | Western Cape/Cape Town | https://www.linkedin.com/in/graeme-sim-2a7a1068/ |
| 568 | **Zinhle Simamane** | Simamane / Zinhle | CONFIRMED | CA(SA) | SAICA | Traxtion | — | — |
| 569 | **Charlton Simpson** | Simpson / Charlton | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo | Western Cape/Cape Town | https://www.linkedin.com/in/charlton-simpson-9164651b/ |
| 570 | **Tabisa Singenile** | Singenile / Tabisa | CONFIRMED | ACMA, CGMA | CIMA | WBHO Construction | Johannesburg Metropolitan Area | https://www.linkedin.com/in/tabisa-singenile-cgma®-acma-3932b299/ |
| 571 | **Bhaviska Singh** | Singh / Bhaviska | FINANCE_ROLE_CONFIRMED | — | — | Mpact Limited | Gauteng/Johannesburg | https://www.linkedin.com/in/bhaviska-singh-9a9831116/ |
| 572 | **Devani Singh** | Singh / Devani | FINANCE_ROLE_CONFIRMED | — | — | Raubex Group Ltd | Johannesburg Metropolitan Area | https://www.linkedin.com/in/devani-singh-909318159/ |
| 573 | **Alka Singh CA(SA)** | Singh CA(SA) / Alka | CONFIRMED | CA(SA) | SAICA | Nampak | Gauteng/Johannesburg | https://www.linkedin.com/in/alka-singh-ca-sa-12642173/ |
| 574 | **Qayiya Siphosethu Kobese** | Siphosethu Kobese / Qayiya | FINANCE_ROLE_CONFIRMED | — | — | Coca-Cola Peninsula Beverages (Pty) Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/qayiya-siphosethu-kobese/ |
| 575 | **Augustine Sithole** | Sithole / Augustine | FINANCE_ROLE_CONFIRMED | — | — | DSV - Global Transport and Logistics | Gauteng/Johannesburg | https://www.linkedin.com/in/augustine-sithole-630451211/ |
| 576 | **Bantu Skaap** | Skaap / Bantu | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction | Gauteng/Johannesburg | https://www.linkedin.com/in/bantu-skaap-a1b03552/ |
| 577 | **Philip Slabber CA (SA)** | Slabber CA (SA) / Philip | FINANCE_ROLE_CONFIRMED | — | — | Overberg Agri | Western Cape/Cape Town | https://www.linkedin.com/in/philip-slabber-ca-sa-14aa4013a/ |
| 578 | **Chantel Sliep-Viljoen** | Sliep-Viljoen / Chantel | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/Johannesburg | https://www.linkedin.com/in/chantel-sliep-viljoen-6a180774/ |
| 579 | **Lucinda Smidt** | Smidt / Lucinda | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy (Pty) Ltd. | Western Cape/Cape Town | https://www.linkedin.com/in/lucinda-smidt-57043a5a/ |
| 580 | **Daniël Smit** | Smit / Daniël | FINANCE_ROLE_CONFIRMED | — | — | KWV | — | https://www.linkedin.com/in/daniël-smit-56390565/ |
| 581 | **Heinrich Smit** | Smit / Heinrich | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy (Pty) Ltd. | Western Cape/Cape Town | https://www.linkedin.com/in/heinrich-smit-9b03284a/ |
| 582 | **Adrian Smith** | Smith / Adrian | CONFIRMED | ACMA, CGMA | CIMA | Bounty Apparel | Western Cape/Cape Town | https://www.linkedin.com/in/adrian-smith-acma-cgma-30942b59/ |
| 583 | **Andre Smith** | Smith / Andre | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Western Cape | https://www.linkedin.com/in/andre-smith-09990a18/ |
| 584 | **Hannes Snyman** | Snyman / Hannes | FINANCE_ROLE_CONFIRMED | — | — | Mpact Limited | Gauteng/Johannesburg | https://www.linkedin.com/in/hannes-snyman/ |
| 585 | **Johan Snyman** | Snyman / Johan | FINANCE_ROLE_CONFIRMED | — | — | Fruitways | Western Cape/Somerset West | https://www.linkedin.com/in/johan-snyman-1731b215a/ |
| 586 | **Lungelwa Sogiba** | Sogiba / Lungelwa | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/lungelwa-sogiba-01a80965/ |
| 587 | **Polani Sokombela** | Sokombela / Polani | CONFIRMED | CA(SA) | SAICA | Auditor-General of South Africa (AGSA) | — | — |
| 588 | **Brendelene Solomons** | Solomons / Brendelene | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Gauteng/City of Johannesburg | https://www.linkedin.com/in/brendelene-solomons-92229b35/ |
| 589 | **Shamila Soobramoney** | Soobramoney / Shamila | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/Johannesburg | https://www.linkedin.com/in/shamila-soobramoney-0699068b/ |
| 590 | **Sharmila Soobramoney** | Soobramoney / Sharmila | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/Johannesburg | https://www.linkedin.com/in/sharmila-soobramoney-369301285/ |
| 591 | **Kyle Sparg** | Sparg / Kyle | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | East London | https://www.linkedin.com/in/kyle-sparg-67188615a/ |
| 592 | **Juan Spies** | Spies / Juan | CONFIRMED | CA(SA) | SAICA | McA Durbanville Inc. | Western Cape/Durbanville | — |
| 593 | **Lois Spies** | Spies / Lois | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/Johannesburg | https://www.linkedin.com/in/lois-spies-43350460/ |
| 594 | **Justine Spreeth** | Spreeth / Justine | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | KwaZulu-Natal/eThekwini | https://www.linkedin.com/in/justine-spreeth-988aa465/ |
| 595 | **Veronica Steenveld** | Steenveld / Veronica | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/veronica-steenveld-560694168/ |
| 596 | **Vedet Stevens** | Stevens / Vedet | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Western Cape/Cape Town | https://www.linkedin.com/in/vedetstevens/ |
| 597 | **Albert Steyn** | Steyn / Albert | FINANCE_ROLE_CONFIRMED | — | — | Capespan | Western Cape/Cape Town | https://www.linkedin.com/in/albert-steyn-40701b69/ |
| 598 | **Pia Steyn CA(SA)** | Steyn CA(SA) / Pia | FINANCE_ROLE_CONFIRMED | — | — | KWV | Western Cape/Cape Town | https://www.linkedin.com/in/pia-steyn-ca-sa-2a0051147/ |
| 599 | **Patricia Stock** | Stock / Patricia | CONFIRMED | CA(SA) | SAICA | SAICA | — | — |
| 600 | **Mindre Stofberg** | Stofberg / Mindre | CONFIRMED | CA(SA) | SAICA | Tronox | Western Cape/Saldanha Bay Local Municipality | https://www.linkedin.com/in/mindre-stofberg-ca-sa-6416a638/ |
| 601 | **Justin Stohr** | Stohr / Justin | HIGH_CONFIDENCE | PA(SA) | SAIPA | McA Accounting & Tax Services Inc. | Western Cape/Cape Town | — |
| 602 | **Edburg Strauss** | Strauss / Edburg | CONFIRMED | CA(SA) | SAICA | netCFO | Gauteng/Pretoria | https://www.linkedin.com/in/edburg-strauss/ |
| 603 | **Neil Struthers** | Struthers / Neil | FINANCE_ROLE_CONFIRMED | — | — | Power Construction (Pty) Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/neil-struthers-019a8b70/ |
| 604 | **Elmarie Swanepoel** | Swanepoel / Elmarie | HIGH_CONFIDENCE | CA(SA) | SAICA | Stellenbosch University | Western Cape/Stellenbosch | — |
| 605 | **Victoria Swanson CA(SA)** | Swanson CA(SA) / Victoria | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/victoria-swanson-ca-sa/ |
| 606 | **Mariette Swart** | Swart / Mariette | CONFIRMED | CA(SA) | SAICA | Afrimat | Western Cape/City of Cape Town | https://www.linkedin.com/in/mariette-swart-23595541/ |
| 607 | **Cecelia Swartz** | Swartz / Cecelia | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 608 | **Kotze Tania** | Tania / Kotze | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/Cape Town | https://www.linkedin.com/in/kotze-tania-316a7030/ |
| 609 | **Raeesah Tar** | Tar / Raeesah | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/Johannesburg | https://www.linkedin.com/in/raeesah-tar-1a8a97116/ |
| 610 | **Sisandile Thambo** | Thambo / Sisandile | CONFIRMED | CA(SA) | SAICA | Saint-Gobain Africa | Johannesburg Metropolitan Area | https://za.linkedin.com/in/sisa-thambo |
| 611 | **Willem Theron** | Theron / Willem | CONFIRMED | CA(SA) | SAICA | PSG Konsult Ltd (PSG Financial Services) | — | — |
| 612 | **Rodrique Thomas** | Thomas / Rodrique | CONFIRMED | CA(SA) | SAICA | Astron Energy (Pty) Ltd. | Western Cape/Cape Town | https://www.linkedin.com/in/rodrique-thomas/ |
| 613 | **Ndivhuwo Thomoli** | Thomoli / Ndivhuwo | CONFIRMED | CA(SA) | SAICA | AfriSam | Gauteng/City of Johannesburg | https://www.linkedin.com/in/ndivhuwo-thomoli-ca-sa-150766a8/ |
| 614 | **Ross Thomson** | Thomson / Ross | HIGH_CONFIDENCE | PA(SA) | SAIPA | Collective Accounting | KwaZulu-Natal/Winston Park | — |
| 615 | **Nomfundo Thusini** | Thusini / Nomfundo | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo | KwaZulu-Natal/Durban | https://www.linkedin.com/in/nomfundo-thusini-a22b5a13b/ |
| 616 | **Thamsanqa Thwala CA(SA)** | Thwala CA(SA) / Thamsanqa | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Johannesburg Metropolitan Area | https://www.linkedin.com/in/thamsanqa-thwala-ca-sa-b70585bb/ |
| 617 | **Keitumetse Tito** | Tito / Keitumetse | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Northern Cape/Kathu | https://www.linkedin.com/in/keitumetse-tito-b10a62a2/ |
| 618 | **William Tlou. BComm, Bcompt (Hons), Mcomm,** | Tlou. BComm, Bcompt (Hons), Mcomm, / William | CONFIRMED | CA(SA) | SAICA | Tronox | Gauteng/Johannesburg | https://www.linkedin.com/in/william-tlou-bcomm-bcompt-hons-mcomm-ca-sa-5161b029/ |
| 619 | **Pieter Toerien** | Toerien / Pieter | FINANCE_ROLE_CONFIRMED | — | — | ASLA | Western Cape/Cape Town | https://www.linkedin.com/in/pieter-toerien-14727091/ |
| 620 | **Bianca Treiber** | Treiber / Bianca | FINANCE_ROLE_CONFIRMED | — | — | Fruitways | Western Cape/Cape Town | https://www.linkedin.com/in/bianca-treiber-66384ab9/ |
| 621 | **Mikateko Tshetshe** | Tshetshe / Mikateko | CONFIRMED | FCMA, CGMA | CIMA | Unilever | — | — |
| 622 | **Lehlohonolo Tsotetsi** | Tsotetsi / Lehlohonolo | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Gauteng/City of Johannesburg | https://www.linkedin.com/in/lehlohonolo-tsotetsi-8a79451ba/ |
| 623 | **Tebogo Tuba** | Tuba / Tebogo | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo | Western Cape/Cape Town | https://www.linkedin.com/in/tebogo-tuba-08b8597b/ |
| 624 | **Kelly Turck** | Turck / Kelly | FINANCE_ROLE_CONFIRMED | — | — | Capespan | Western Cape/Cape Town | https://www.linkedin.com/in/kelly-turck-310b8a33/ |
| 625 | **Liyema Tweni** | Tweni / Liyema | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy (Pty) Ltd. | Western Cape/Cape Town | https://www.linkedin.com/in/liyema-tweni-9688b9178/ |
| 626 | **Lumka Unathi Kappel** | Unathi Kappel / Lumka | CONFIRMED | CA(SA) | SAICA | Astron Energy (Pty) Ltd. | Western Cape/Cape Town | https://www.linkedin.com/in/lumka-unathi-kappel-ca-sa-2a54b1133/ |
| 627 | **Deon Uys** | Uys / Deon | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | — | https://www.linkedin.com/in/deon-uys-99771523/ |
| 628 | **Bernadette V.** | V. / Bernadette | FINANCE_ROLE_CONFIRMED | — | — | DSV - Global Transport and Logistics | Gauteng/Johannesburg | https://www.linkedin.com/in/bernadette-v-854989212/ |
| 629 | **Amanda Vakalisa ACMA(CGMA)** | Vakalisa ACMA(CGMA) / Amanda | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Gauteng/Johannesburg | https://www.linkedin.com/in/amanda-vakalisa-acma-cgma-mba-a250b866/ |
| 630 | **Nina Valentine (nee. Coetzee)** | Valentine (nee. Coetzee) / Nina | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo | Western Cape/Cape Town | https://www.linkedin.com/in/nina-valentine-nee-coetzee-b1416a139/ |
| 631 | **Welgemoed Valerie** | Valerie / Welgemoed | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group Limited | Western Cape/Cape Town | https://www.linkedin.com/in/welgemoed-valerie-5923b48a/ |
| 632 | **Johan Van den Elst** | Van den Elst / Johan | FINANCE_ROLE_CONFIRMED | — | — | KWV | Western Cape/Paarl | https://www.linkedin.com/in/johan-van-den-elst-559747204/ |
| 633 | **Geraldine Van Der Merwe** | Van Der Merwe / Geraldine | FINANCE_ROLE_CONFIRMED | — | — | Concor | Gauteng/Johannesburg | https://www.linkedin.com/in/geraldine-van-der-merwe-213ba2179/ |
| 634 | **IR Van der Merwe** | Van der Merwe / IR | CONFIRMED | CA(SA) | SAICA | Raubex Group Ltd | Free State/Bloemfontein | https://www.linkedin.com/in/ir-van-der-merwe-a3a76955/ |
| 635 | **Leandra van der Merwe** | van der Merwe / Leandra | FINANCE_ROLE_CONFIRMED | — | — | Coca-Cola Peninsula Beverages (Pty) Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/leandra-van-der-merwe-4aa73511a/ |
| 636 | **Peet van der Merwe** | van der Merwe / Peet | CONFIRMED | CA(SA) | SAICA | Forvis Mazars in South Africa | Free State/Bloemfontein | https://www.linkedin.com/in/peet-van-der-merwe-ca-sa-ra-8320b7a6/ |
| 637 | **Joe van der Walt** | van der Walt / Joe | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo | Western Cape/Cape Town | https://www.linkedin.com/in/joe-van-der-walt-5a268616/ |
| 638 | **Lizaan van der Walt** | van der Walt / Lizaan | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Paarl | https://www.linkedin.com/in/lizaan-van-der-walt-664293147/ |
| 639 | **Vinita van der Walt** | van der Walt / Vinita | FINANCE_ROLE_CONFIRMED | — | — | DSV - Global Transport and Logistics | Gauteng/Johannesburg | https://www.linkedin.com/in/vinita-van-der-walt-39507781/ |
| 640 | **Adri Van Der Westhuizen** | Van Der Westhuizen / Adri | FINANCE_ROLE_CONFIRMED | — | — | AfriSam | — | https://www.linkedin.com/in/adri-van-der-westhuizen-02309041/ |
| 641 | **Ansie van der Westhuizen** | van der Westhuizen / Ansie | FINANCE_ROLE_CONFIRMED | — | — | DSV - Global Transport and Logistics | Gauteng/Johannesburg | https://www.linkedin.com/in/ansie-van-der-westhuizen-a89861146/ |
| 642 | **Marilé Van der Westhuizen** | Van der Westhuizen / Marilé | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Gauteng/Johannesburg | https://www.linkedin.com/in/marilé-van-der-westhuizen-098343b0/ |
| 643 | **Nadia Van Der Westhuizen** | Van Der Westhuizen / Nadia | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 644 | **Tinu van der Westhuizen** | van der Westhuizen / Tinu | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/tinuv/ |
| 645 | **Cornell van Eeden** | van Eeden / Cornell | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 646 | **Anton van Niekerk** | van Niekerk / Anton | CONFIRMED | ACMA, CGMA | CIMA | Snapplify | Western Cape/Cape Town | https://www.linkedin.com/in/anton-van-niekerk-acma-b7503b87/ |
| 647 | **Charmaine van Niekerk** | van Niekerk / Charmaine | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction | Gauteng/Johannesburg | https://www.linkedin.com/in/charmaine-van-niekerk-788a3589/ |
| 648 | **Gerrit van Niekerk** | van Niekerk / Gerrit | CONFIRMED | CA(SA) | SAICA | Isipani Construction (Pty) Ltd | Western Cape/Cape Town / Paarl | https://za.linkedin.com/in/gerrit-van-niekerk-8195587 |
| 649 | **Ger-Mari Van Niekerk (CA)(SA)** | Van Niekerk (CA)(SA) / Ger-Mari | FINANCE_ROLE_CONFIRMED | — | — | KAL Group Limited | — | https://www.linkedin.com/in/ger-mari-van-niekerk-ca-sa-5a96a0120/ |
| 650 | **Ralton van Reenen** | van Reenen / Ralton | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy (Pty) Ltd. | Western Cape/Cape Town | https://www.linkedin.com/in/ralton-van-reenen-633520119/ |
| 651 | **Ewan van Rensburg** | van Rensburg / Ewan | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group Limited | Western Cape/Cape Town | https://www.linkedin.com/in/ewan-van-rensburg-538732b/ |
| 652 | **Johann van Rensburg** | van Rensburg / Johann | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 653 | **Stephan van Rensburg** | van Rensburg / Stephan | FINANCE_ROLE_CONFIRMED | — | — | KAL Group Limited | Western Cape/Paarl | https://www.linkedin.com/in/stephan-van-rensburg-9b62b914a/ |
| 654 | **Egbert Van Romburgh** | Van Romburgh / Egbert | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo | Western Cape/Durbanville | https://www.linkedin.com/in/egbert-van-romburgh-6014821b9/ |
| 655 | **Charl Van Schalkwyk** | Van Schalkwyk / Charl | FINANCE_ROLE_CONFIRMED | — | — | Raubex Group Ltd | Free State/Bloemfontein | https://www.linkedin.com/in/charl-van-schalkwyk-a6229533/ |
| 656 | **Deon van Schalkwyk** | van Schalkwyk / Deon | FINANCE_ROLE_CONFIRMED | — | — | Capespan | Western Cape/Cape Town | https://www.linkedin.com/in/deon-van-schalkwyk-22481044/ |
| 657 | **Anneke van Tonder** | van Tonder / Anneke | FINANCE_ROLE_CONFIRMED | — | — | NJR Steel Holdings (Pty) Ltd | Gauteng/Roodepoort | https://www.linkedin.com/in/anneke-van-tonder-8a8171297/ |
| 658 | **Owen van Tonder** | van Tonder / Owen | CONFIRMED | CA(SA) | SAICA | Woolworths Holdings Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/owen-van-tonder-ca-sa-a8482131/ |
| 659 | **Villiers van Veen** | van Veen / Villiers | FINANCE_ROLE_CONFIRMED | — | — | Sentraal-Suid Co-operative (SSK) | Western Cape/Swellendam | https://www.linkedin.com/in/villiers-van-veen-44399b3a/ |
| 660 | **Ernst van Vondel** | van Vondel / Ernst | CONFIRMED | CA(SA) | SAICA | Power Construction (Pty) Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/vondel/ |
| 661 | **Celecia Van Wyk** | Van Wyk / Celecia | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Gauteng/Germiston | https://www.linkedin.com/in/celecia-van-wyk-ba5402114/ |
| 662 | **Jana van Zyl** | van Zyl / Jana | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 663 | **Willene van Zyl** | van Zyl / Willene | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 664 | **Werner van Zyl CA (SA)** | van Zyl CA (SA) / Werner | FINANCE_ROLE_CONFIRMED | — | — | Mpact Limited | Gauteng/Benoni | https://www.linkedin.com/in/werner-van-zyl-ca-sa-a6347a105/ |
| 665 | **Jani van Zyl CA(SA)** | van Zyl CA(SA) / Jani | FINANCE_ROLE_CONFIRMED | — | — | KWV | — | https://www.linkedin.com/in/jani-van-zyl-ca-sa-b46a0116a/ |
| 666 | **Jayvant Vassen** | Vassen / Jayvant | FINANCE_ROLE_CONFIRMED | — | — | Capespan | Western Cape/Cape Town | https://www.linkedin.com/in/jayvant-vassen-9529a71b8/ |
| 667 | **Xelani Vathiwe** | Vathiwe / Xelani | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/George | https://www.linkedin.com/in/xelani-vathiwe-1371902a/ |
| 668 | **Claudia Vega Barandiarán** | Vega Barandiarán / Claudia | FINANCE_ROLE_CONFIRMED | — | — | AB InBev | Gauteng/Johannesburg | https://www.linkedin.com/in/claudiavegabarandiaran/ |
| 669 | **Louis Veldsman** | Veldsman / Louis | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo | Western Cape/Cape Town | https://www.linkedin.com/in/louisveldsmanza/ |
| 670 | **Daniele Venter** | Venter / Daniele | FINANCE_ROLE_CONFIRMED | — | — | SA Metal Group (Pty) Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/daniele-venter-778276121/ |
| 671 | **Freda Venter** | Venter / Freda | FINANCE_ROLE_CONFIRMED | — | — | DSV - Global Transport and Logistics | Gauteng/Johannesburg | https://www.linkedin.com/in/freda-venter-b7a43687/ |
| 672 | **Quintin Venter** | Venter / Quintin | HIGH_CONFIDENCE | PA(SA) | SAIPA | Sempre Financial Group | Western Cape/Bellville (Cape Town) | — |
| 673 | **Mariska Vermeulen** | Vermeulen / Mariska | FINANCE_ROLE_CONFIRMED | — | — | Southern Oil (Pty) Ltd | Western Cape/Swellendam | https://www.linkedin.com/in/mariska-vermeulen-48b8b6255/ |
| 674 | **Herman Vermeulen CA(SA)** | Vermeulen CA(SA) / Herman | FINANCE_ROLE_CONFIRMED | — | — | Southern Oil (Pty) Ltd | Western Cape/Swellendam | https://www.linkedin.com/in/herman-vermeulen-ca-sa-6a322892/ |
| 675 | **Vijedharsan Vijendranath** | Vijendranath / Vijedharsan | CONFIRMED | FCCA | ACCA | — | Gauteng/Johannesburg | https://www.linkedin.com/in/vijedharsan-vijendranath-fcca-uk-6118b1103/ |
| 676 | **Qinisela Vincent Rasmeni** | Vincent Rasmeni / Qinisela | FINANCE_ROLE_CONFIRMED | — | — | DSV - Global Transport and Logistics | Gauteng/Johannesburg | https://www.linkedin.com/in/qinisela-vincent-rasmeni-0805b3ab/ |
| 677 | **Henlie Viola CA (SA)** | Viola CA (SA) / Henlie | FINANCE_ROLE_CONFIRMED | — | — | KAL Group Limited | Western Cape/Cape Town | https://www.linkedin.com/in/henlie-viola-ca-sa-24545a144/ |
| 678 | **Chrizelda Visser** | Visser / Chrizelda | CONFIRMED | ACMA, CGMA | CIMA | Curated Beverages Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/chrizelda-visser-acma-cgma-3671b454/ |
| 679 | **Wilhelm Von Westernhagen** | Von Westernhagen / Wilhelm | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group Limited | Western Cape/Cape Town | https://www.linkedin.com/in/wilhelm-von-westernhagen-a047b684/ |
| 680 | **Christiaan Vorster** | Vorster / Christiaan | CONFIRMED | CA(SA) | SAICA | SAICA | Western Cape/Cape Town | — |
| 681 | **Monika Vorster** | Vorster / Monika | FINANCE_ROLE_CONFIRMED | — | — | Raubex Group Ltd | Bloemfontein Metropolitan Area | https://www.linkedin.com/in/monika-vorster-5773711a3/ |
| 682 | **Nhlakanipho Vusi Mpungose (CFE)** | Vusi Mpungose (CFE) / Nhlakanipho | FINANCE_ROLE_CONFIRMED | — | — | AB InBev | Gauteng | https://www.linkedin.com/in/nhlakanipho-mpungose-5b6545282/ |
| 683 | **Marco Wagener** | Wagener / Marco | HIGH_CONFIDENCE | PA(SA) | SAIPA | Excellentia Accounting and Tax Solutions | — | — |
| 684 | **Saneesa Ward** | Ward / Saneesa | CONFIRMED | CA(SA) | SAICA | Raubex Group Ltd | Free State/Bloemfontein | https://www.linkedin.com/in/saneesa-ward-ca-sa-3a3533136/ |
| 685 | **Aadam Wei CA(SA)** | Wei CA(SA) / Aadam | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group Limited | Western Cape/Cape Town | https://www.linkedin.com/in/aadam-wei-ca-sa-7a0063113/ |
| 686 | **Kirsten Wentzel** | Wentzel / Kirsten | FINANCE_ROLE_CONFIRMED | — | — | AB InBev | Johannesburg Metropolitan Area | https://www.linkedin.com/in/kirsten-wentzel-a4a138178/ |
| 687 | **Shelley Wessels** | Wessels / Shelley | CONFIRMED | CA(SA) | SAICA | PetroSA | Western Cape/Cape Town | https://www.linkedin.com/in/shelley-wessels/ |
| 688 | **Russell Weyer** | Weyer / Russell | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | — | https://www.linkedin.com/in/russell-weyer-3209845b/ |
| 689 | **Zach Wiid** | Wiid / Zach | FINANCE_ROLE_CONFIRMED | — | — | Mpact Limited | Mpumalanga/Nelspruit | https://www.linkedin.com/in/zach-wiid-854b921b2/ |
| 690 | **Mark Willimott** | Willimott / Mark | CONFIRMED | CA(SA) | SAICA | BDO South Africa | Eastern Cape/Gqeberha (Port Elizabeth) | — |
| 691 | **Emeal Winston (Emeal) van der Westhuizen** | Winston (Emeal) van der Westhuizen / Emeal | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Gauteng/City of Johannesburg | https://www.linkedin.com/in/emeal-winston-van-der-westhuizen-25925a57/ |
| 692 | **Keenen Witbooi** | Witbooi / Keenen | FINANCE_ROLE_CONFIRMED | — | — | Coca-Cola Peninsula Beverages (Pty) Ltd | — | https://www.linkedin.com/in/keenen-witbooi-2622a5a9/ |
| 693 | **Taryn Woodbridge** | Woodbridge / Taryn | CONFIRMED | CA(SA) | SAICA | Mercedes-Benz South Africa Ltd | — | — |
| 694 | **Luke Woodhouse** | Woodhouse / Luke | CONFIRMED | CA(SA) | SAICA | GUUD GLOBAL | Gauteng/Johannesburg | https://www.linkedin.com/in/luke-woodhouse-ca-sa-b31a0149/ |
| 695 | **Gretchen Wrigley** | Wrigley / Gretchen | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo | Western Cape/Cape Town | https://www.linkedin.com/in/gretchen-wrigley-3777a443/ |
| 696 | **Nompumelelo Zama-Ngcongo** | Zama-Ngcongo / Nompumelelo | FINANCE_ROLE_CONFIRMED | — | — | Mpact Limited | Gauteng/Johannesburg | https://www.linkedin.com/in/nompumelelo-zama-ngcongo-087a8b65/ |
| 697 | **Odwa Zamatyala** | Zamatyala / Odwa | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group Limited | Western Cape/Cape Town | https://www.linkedin.com/in/odwa-zamatyala-24260b1a2/ |
| 698 | **Bianka Zietsman** | Zietsman / Bianka | CONFIRMED | PA(SA) | SAIPA | Mpact Limited | Gauteng/Johannesburg | https://www.linkedin.com/in/bianka-zietsman-268475111/ |
| 699 | **Sibusiso Zikalala** | Zikalala / Sibusiso | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction | Gauteng/Johannesburg | https://www.linkedin.com/in/sibusiso-zikalala-46188238/ |
| 700 | **MOEGAMAT ZUBAIR ABDURAHMAN** | ZUBAIR ABDURAHMAN / MOEGAMAT | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Western Cape/Cape Town | https://www.linkedin.com/in/moegamat-zubair-abdurahman/ |
| 701 | **Dumisani Zulu** | Zulu / Dumisani | CONFIRMED | AGA(SA) | SAICA | Bonakude Consulting (Pty) Ltd | KwaZulu-Natal/Port Shepstone | https://www.linkedin.com/in/dumisani-zulu-aga-sa-aimfo-a5a62622 |
| 702 | **Sinethemba Zulu** | Zulu / Sinethemba | FINANCE_ROLE_CONFIRMED | — | — | Premier Fishing SA | Western Cape/Cape Town | https://www.linkedin.com/in/snethemba-zulu-29b00238/ |

## 4. Companies already mapped

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

642 evidence records are stored in `sources.jsonl`.
