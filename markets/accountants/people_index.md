# People Index — Master Name Registry (dedup source of truth)

> **CHECK THIS FILE FIRST** before adding any person, company or source.

This is the authoritative list of every name already captured in the SA Accounting & Finance Skills database.
New evidence for an existing person enriches the existing record; it does not create a duplicate.

**Regenerate after every batch:** `python3 gen_people_index.py`

## 1. Totals (auto-computed)

| Metric | Count |
|---|---:|
| People (total records) | 776 |
| ARTICLES_CONFIRMED_DESIGNATION_UNVERIFIED | 1 |
| CONFIRMED | 157 |
| CONFLICTING | 1 |
| FINANCE_ROLE_CONFIRMED | 592 |
| HIGH_CONFIDENCE | 24 |
| RESEARCH_HOLD | 1 |
| Companies | 146 |
| Sources | 843 |

## 2. Dedup workflow

1. Normalise name and check LinkedIn/profile URL.
2. Match current employer and company affiliations.
3. If already present, enrich the existing record; never add a second person.
4. Qualification, professional body and articles/PER are independent evidence fields; never infer one from another.

## 3. All people (sorted by surname)

| # | Full name | Surname / Given | Status | Designation(s) | Body | Employer | Province / City | LinkedIn |
|---:|---|---|---|---|---|---|---|---|
| 1 | **Dorman-Kade (D)** | (D) / Dorman-Kade | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/dorman-kade-d-87a070aa/ |
| 2 | **More (Ml)** | (Ml) / More | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/more-ml-69583774/ |
| 3 | **Syed (Rb)** | (Rb) / Syed | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/syed-rb-86842677/ |
| 4 | **Maganathan (Vincin) Naidu** | (Vincin) Naidu / Maganathan | FINANCE_ROLE_CONFIRMED | — | — | AfriSam | — | https://www.linkedin.com/in/maganathan-vincin-naidu-851537123/ |
| 5 | **Kelly (Weidemann) Estment** | (Weidemann) Estment / Kelly | FINANCE_ROLE_CONFIRMED | — | — | Libstar | Western Cape/Stellenbosch | https://www.linkedin.com/in/kelly-estment-ca-sa-32484598/ |
| 6 | **Mohammed A. Mahomeddi** | A. Mahomeddi / Mohammed | FINANCE_ROLE_CONFIRMED | — | — | Concor | Gauteng/Bedfordview | https://www.linkedin.com/in/mohammed-a-mahomeddi-52a05b6a/ |
| 7 | **Ebrahiem Abrahams** | Abrahams / Ebrahiem | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/City of Cape Town | https://www.linkedin.com/in/ebrahiem-abrahams-69b831164/ |
| 8 | **Saadiqa Abrahams** | Abrahams / Saadiqa | FINANCE_ROLE_CONFIRMED | — | — | Cape Herb & Spice | Western Cape/Cape Town | https://www.linkedin.com/in/saadiqa-abrahams-3bb7ba34/ |
| 9 | **Yolandi Adam** | Adam / Yolandi | FINANCE_ROLE_CONFIRMED | — | — | Peninsula Beverages | Western Cape/City of Cape Town | https://www.linkedin.com/in/yolandi-adam-87074a1a/ |
| 10 | **Adeelah Adams** | Adams / Adeelah | FINANCE_ROLE_CONFIRMED | — | — | Commercial Cold Holdings | Western Cape/Cape Town | https://www.linkedin.com/in/adeelah-adams-a8285157/ |
| 11 | **Lex Adendorff** | Adendorff / Lex | FINANCE_ROLE_CONFIRMED | — | — | Ladismith Cheese / Woodlands Dairy Group | Eastern Cape/Port Elizabeth | https://www.linkedin.com/in/lex-adendorff-0230a459/ |
| 12 | **Claudia Adriaanse** | Adriaanse / Claudia | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/claudia-adriaanse-091928100/ |
| 13 | **Hayley Africa** | Africa / Hayley | FINANCE_ROLE_CONFIRMED | — | — | Excellent Meat Group | Western Cape/Cape Town | https://www.linkedin.com/in/hayley-africa-869112117/ |
| 14 | **Chantell Ajam** | Ajam / Chantell | CONFIRMED | CA(SA) | SAICA | Polyoak Packaging | Eastern Cape/Port Elizabeth | https://www.linkedin.com/in/chantellajam/ |
| 15 | **Angeline Aldridge** | Aldridge / Angeline | CONFIRMED | CA(SA) | SAICA | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/angeline-aldridge-86b929184/ |
| 16 | **Juliet Alexander (Neethling)** | Alexander (Neethling) / Juliet | FINANCE_ROLE_CONFIRMED | MAT(SA) | SAICA | Klay | Western Cape/Cape Town | https://www.linkedin.com/in/juliet-alexander-neethling-96639945/ |
| 17 | **Maruping Alina** | Alina / Maruping | FINANCE_ROLE_CONFIRMED | — | — | DSV | South Africa | https://www.linkedin.com/in/maruping-alina-37268971/ |
| 18 | **Richard Allen** | Allen / Richard | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Eastern Cape/Port Elizabeth | https://www.linkedin.com/in/richard-allen-4527b9144/ |
| 19 | **Ebrahim Ally** | Ally / Ebrahim | CONFIRMED | CA(SA) | SAICA | Mpact | Gauteng/City of Johannesburg | https://www.linkedin.com/in/ebrahim-ally8505/ |
| 20 | **nasrin amin** | amin / nasrin | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Gauteng/City of Johannesburg | https://www.linkedin.com/in/nasrin-amin-00953379/ |
| 21 | **Michael Ansermino** | Ansermino / Michael | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | KwaZulu-Natal/Durban | https://www.linkedin.com/in/michael-ansermino-ab9666242/ |
| 22 | **Lorraine Anwar** | Anwar / Lorraine | FINANCE_ROLE_CONFIRMED | — | — | Corobrik Lansdowne | KwaZulu-Natal/Durban | https://www.linkedin.com/in/lorraine-anwar-9b8016bb/ |
| 23 | **Bevill Arendse** | Arendse / Bevill | FINANCE_ROLE_CONFIRMED | — | — | Averda South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/bevill-arendse-7268539b/ |
| 24 | **Thyron Arumugam** | Arumugam / Thyron | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | KwaZulu-Natal/Durban | https://www.linkedin.com/in/thyron-arumugam-52b729100/ |
| 25 | **Naeem Asvat** | Asvat / Naeem | CONFIRMED | CA(SA) | SAICA | SAICA | KwaZulu-Natal/Durban | — |
| 26 | **Leticia August** | August / Leticia | FINANCE_ROLE_CONFIRMED | — | — | Fruitways | Western Cape/City of Cape Town | https://www.linkedin.com/in/leticia-august-4667baa5/ |
| 27 | **Mark Augustine** | Augustine / Mark | HIGH_CONFIDENCE | PA(SA) | SAIPA | Pinnacle Accounting | Western Cape | — |
| 28 | **Lynette Badenhorst** | Badenhorst / Lynette | CONFIRMED | CA(SA) | SAICA | Probeta Training (Pty) Ltd | — | — |
| 29 | **wilhelmina badenhorst** | badenhorst / wilhelmina | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/City of Johannesburg | https://www.linkedin.com/in/wilhelmina-badenhorst-b0762972/ |
| 30 | **Nerasha Bahaw-Louw** | Bahaw-Louw / Nerasha | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/nerasha-bahaw-louw-92888376/ |
| 31 | **Margot Baird** | Baird / Margot | FINANCE_ROLE_CONFIRMED | — | — | EnviroServ | KwaZulu-Natal/Durban | https://www.linkedin.com/in/margot-baird-1bb72596/ |
| 32 | **Sandra Baisch** | Baisch / Sandra | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/sandra-baisch-530a7436/ |
| 33 | **Andisiwe Baliso** | Baliso / Andisiwe | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/andisiwe-baliso-78624631/ |
| 34 | **Imran Bapoo** | Bapoo / Imran | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/imran-bapoo-ca-sa-518a365b/ |
| 35 | **Fatima Bapukee** | Bapukee / Fatima | CONFIRMED | CA(SA) | SAICA | Streets Chartered Accountants (Cape Town) | Western Cape/Cape Town | — |
| 36 | **Eben Barnard** | Barnard / Eben | FINANCE_ROLE_CONFIRMED | — | — | Power Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/eben-barnard-9959b813/ |
| 37 | **Liezl Barnard** | Barnard / Liezl | CONFIRMED | CA(SA) | SAICA | AfriSam | — | https://www.linkedin.com/in/liezl-barnard-ca-sa-62448157/ |
| 38 | **Robyn Bartlett** | Bartlett / Robyn | FINANCE_ROLE_CONFIRMED | — | — | RFG Foods | Western Cape/City of Cape Town | https://www.linkedin.com/in/robyn-bartlett-65831a120/ |
| 39 | **Calvin Bassa** | Bassa / Calvin | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/City of Johannesburg | https://www.linkedin.com/in/calvin-bassa-46345b36/ |
| 40 | **Suzaan Batista** | Batista / Suzaan | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group | Western Cape/Cape Town | https://www.linkedin.com/in/suzaan-batista-ca-sa-865238339/ |
| 41 | **Jody Baumgarten** | Baumgarten / Jody | HIGH_CONFIDENCE | CA(SA) | SAICA | Wonga (South Africa) | — | — |
| 42 | **Melissa Beck** | Beck / Melissa | FINANCE_ROLE_CONFIRMED | — | — | Southern Oil (SOILL) | Western Cape/City of Cape Town | https://www.linkedin.com/in/melissa-beck-aa8812a4/ |
| 43 | **Patricia Becker** | Becker / Patricia | FINANCE_ROLE_CONFIRMED | — | — | Métier Mixed Concrete | KwaZulu-Natal/KwaZulu-Natal | https://www.linkedin.com/in/patricia-becker-8552241b1/ |
| 44 | **Bronwyn Behm** | Behm / Bronwyn | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/City of Cape Town | https://www.linkedin.com/in/bronwyn-behm-058a4666/ |
| 45 | **Gwuineth Benting** | Benting / Gwuineth | FINANCE_ROLE_CONFIRMED | — | — | Peninsula Beverages | Western Cape/Cape Town | https://www.linkedin.com/in/gwuineth-benting-5ab483a2/ |
| 46 | **Michelle Bernice Du Preez** | Bernice Du Preez / Michelle | FINANCE_ROLE_CONFIRMED | — | — | Macsteel | Gauteng/Gauteng | https://www.linkedin.com/in/michelle-du-preez-89481975/ |
| 47 | **Michael Besson** | Besson / Michael | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/City of Johannesburg | https://www.linkedin.com/in/michael-besson-088b39b2/ |
| 48 | **Rachelle Best** | Best / Rachelle | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 49 | **Cala Bester** | Bester / Cala | FINANCE_ROLE_CONFIRMED | — | — | R+N Master Builders | Western Cape/City of Cape Town | https://za.linkedin.com/in/cala-bester-b5768b12b |
| 50 | **Elza Bester** | Bester / Elza | FINANCE_ROLE_CONFIRMED | — | — | Tronox Namakwa Sands | Western Cape/Saldanha Bay Local Municipality | https://www.linkedin.com/in/elza-bester-4566ba58/ |
| 51 | **Elané Beukes (Botha)** | Beukes (Botha) / Elané | FINANCE_ROLE_CONFIRMED | — | — | Overberg Agri | Western Cape/Caledon | https://www.linkedin.com/in/elané-beukes-botha-28a628155/ |
| 52 | **Cindy Beukes** | Beukes / Cindy | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/cindy-beukes-66534483/ |
| 53 | **J A 'Driaan' Beyers** | Beyers / Driaan | HIGH_CONFIDENCE | PA(SA) | SAIPA | Finkor Accounting | Gauteng/Rayton | — |
| 54 | **Angelic Bezuidenhoudt** | Bezuidenhoudt / Angelic | FINANCE_ROLE_CONFIRMED | — | — | Peninsula Beverages | Western Cape/Cape Town | https://www.linkedin.com/in/angelic-bezuidenhoudt-906780334/ |
| 55 | **Alwyn Bezuidenhout** | Bezuidenhout / Alwyn | FINANCE_ROLE_CONFIRMED | — | — | Macsteel | Gauteng/City of Johannesburg | https://www.linkedin.com/in/alwyn-bezuidenhout-8308805a/ |
| 56 | **Uwe Birkenstock** | Birkenstock / Uwe | CONFIRMED | CA(SA) | SAICA | McA Durbanville Inc. | Western Cape/Durbanville | — |
| 57 | **Niel Bisschoff** | Bisschoff / Niel | CONFIRMED | CA(SA) | SAICA | Raubex / Roadmac Surfacing Cape | Gauteng/City of Johannesburg | https://www.linkedin.com/in/niel-bisschoff-ca-sa-b3a1a253/ |
| 58 | **Sias Blignaut** | Blignaut / Sias | FINANCE_ROLE_CONFIRMED | — | — | Apollo Brick (Atlantis) | Gauteng/Johannesburg | https://www.linkedin.com/in/sias-blignaut-a231b024/ |
| 59 | **Maria Bookkeeper** | Bookkeeper / Maria | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/City of Cape Town | https://www.linkedin.com/in/maria-bookkeeper-863b79115/ |
| 60 | **Annelize Boshoff** | Boshoff / Annelize | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/City of Johannesburg | https://www.linkedin.com/in/annelize-boshoff-8b12b089/ |
| 61 | **Garron Boshoff** | Boshoff / Garron | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Western Cape/City of Cape Town | https://www.linkedin.com/in/garron-boshoff-b1726a20/ |
| 62 | **Johan Boshoff** | Boshoff / Johan | FINANCE_ROLE_CONFIRMED | — | — | Meshco | Western Cape/City of Cape Town | https://www.linkedin.com/in/johan-boshoff-929ba3117/ |
| 63 | **Kobus Boshoff** | Boshoff / Kobus | CONFIRMED | CA(SA) | SAICA | Boshoff Knoetze Chartered Accountants | Western Cape/Somerset West | https://www.linkedin.com/in/kobus-boshoff-0a510888/ |
| 64 | **Sunette Botes** | Botes / Sunette | FINANCE_ROLE_CONFIRMED | — | — | Kaap Agri / Agrimark | South Africa | https://www.linkedin.com/in/sunette-botes-6405a399/ |
| 65 | **Heleen Botha** | Botha / Heleen | FINANCE_ROLE_CONFIRMED | — | — | Fair Cape Dairies | Western Cape/City of Cape Town | https://www.linkedin.com/in/heleen-botha-93942711/ |
| 66 | **Philip Botha** | Botha / Philip | FINANCE_ROLE_CONFIRMED | — | — | RFG Foods | Western Cape/Stellenbosch | https://www.linkedin.com/in/philip-botha/ |
| 67 | **Pieter Botha** | Botha / Pieter | CONFIRMED | CA(SA) | SAICA | AfriSam | — | https://www.linkedin.com/in/pieter-botha-43351637/ |
| 68 | **Ronel Botha** | Botha / Ronel | FINANCE_ROLE_CONFIRMED | — | — | Fruitways | Western Cape/City of Cape Town | https://www.linkedin.com/in/ronel-botha-6507a865/ |
| 69 | **Wardah Botha** | Botha / Wardah | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/wardah-botha-aga-sa-116b4361/ |
| 70 | **Sandi Bothma** | Bothma / Sandi | FINANCE_ROLE_CONFIRMED | — | — | Concor | Gauteng/City of Johannesburg | https://www.linkedin.com/in/sandi-bothma-b0507517a/ |
| 71 | **Chantelle Boucher** | Boucher / Chantelle | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/Johannesburg | https://www.linkedin.com/in/chantelle-boucher-0148a7128/ |
| 72 | **Grant Bowler** | Bowler / Grant | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Western Cape/City of Cape Town | https://www.linkedin.com/in/grant-bowler-9059b598/ |
| 73 | **Nikita Braaf** | Braaf / Nikita | FINANCE_ROLE_CONFIRMED | — | — | I&J | Western Cape/City of Cape Town | https://www.linkedin.com/in/nikita-braaf-613b3763/ |
| 74 | **Muhammad Brey** | Brey / Muhammad | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/mobrey/ |
| 75 | **Madhuri Brijlal** | Brijlal / Madhuri | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Gauteng/City of Johannesburg | https://www.linkedin.com/in/madhuri-brijlal-38634943/ |
| 76 | **Jennifer Brisley** | Brisley / Jennifer | FINANCE_ROLE_CONFIRMED | — | — | Concor | Gauteng/Gauteng | https://www.linkedin.com/in/jennifer-brisley-51a65721/ |
| 77 | **Michelle Brook** | Brook / Michelle | FINANCE_ROLE_CONFIRMED | — | — | Fabrinox | Western Cape/Paarl | https://www.linkedin.com/in/michelle-brook-2725b986/ |
| 78 | **Justyna Bruwer** | Bruwer / Justyna | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/Gauteng | https://www.linkedin.com/in/justyna-bruwer-42a092b3/ |
| 79 | **Ralph Buddle** | Buddle / Ralph | CONFIRMED | CA(SA) | SAICA | TFG Limited (The Foschini Group) | Western Cape/Cape Town | — |
| 80 | **Thomas Bufton** | Bufton / Thomas | FINANCE_ROLE_CONFIRMED | — | — | Ardagh Glass Packaging SA | Gauteng/City of Johannesburg | https://www.linkedin.com/in/thomas-bufton-351030116/ |
| 81 | **Lizanne Buitendag** | Buitendag / Lizanne | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Gauteng/Gauteng | https://www.linkedin.com/in/lizanne-buitendag-a60564213/ |
| 82 | **Catharine Burger** | Burger / Catharine | CONFIRMED | CA(SA) | SAICA | Afrimat | Western Cape/City of Cape Town | https://www.linkedin.com/in/catharine-burger-4a597a81/ |
| 83 | **Nicolene Burger** | Burger / Nicolene | FINANCE_ROLE_CONFIRMED | — | — | WastePlan | Gauteng/Johannesburg | https://www.linkedin.com/in/nicolene-burger-83381827/ |
| 84 | **Yolandi Burger** | Burger / Yolandi | FINANCE_ROLE_CONFIRMED | — | — | Southern Oil (SOILL) | South Africa | https://www.linkedin.com/in/yolandi-burger-384a0865/ |
| 85 | **Werner Buys** | Buys / Werner | FINANCE_ROLE_CONFIRMED | — | — | Concor | Gauteng/Bedfordview | https://www.linkedin.com/in/wernerbuys101/ |
| 86 | **Andre C.** | C. / Andre | FINANCE_ROLE_CONFIRMED | — | — | Fabrinox | Western Cape/City of Cape Town | https://www.linkedin.com/in/andre-c-ba703193/ |
| 87 | **Ampie Calitz** | Calitz / Ampie | FINANCE_ROLE_CONFIRMED | — | — | RFG Foods | Western Cape/City of Cape Town | https://www.linkedin.com/in/ampie-calitz-ca-sa-b51a084b/ |
| 88 | **Kevin Cammay** | Cammay / Kevin | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Western Cape/City of Cape Town | https://www.linkedin.com/in/kevin-cammay-38011325/ |
| 89 | **Nikita Candy Engelbrecht** | Candy Engelbrecht / Nikita | FINANCE_ROLE_CONFIRMED | — | — | Cape Herb & Spice | Western Cape/Cape Town | https://www.linkedin.com/in/nikita-candy-engelbrecht-2a2300235/ |
| 90 | **Michelle Carstens** | Carstens / Michelle | FINANCE_ROLE_CONFIRMED | — | — | Spier | Western Cape/Cape Town | https://www.linkedin.com/in/michelle-carstens-ca-sa-71b62475/ |
| 91 | **Kerry Cassel** | Cassel / Kerry | CONFIRMED | CA(SA) | SAICA | Motus Mobility Solutions | — | — |
| 92 | **Jacqui Celliers** | Celliers / Jacqui | CONFIRMED | CA(SA) | SAICA | Nampak | Gauteng/Johannesburg | https://www.linkedin.com/in/jacqui-celliers-241a47209/ |
| 93 | **Kamohelo Chauke** | Chauke / Kamohelo | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/Cape Town | https://www.linkedin.com/in/kamohelo-chauke-ca-sa-10bb0b221/ |
| 94 | **Ronnie Chetty** | Chetty / Ronnie | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/ronnie-chetty-42400656/ |
| 95 | **Walter Chigwada** | Chigwada / Walter | FINANCE_ROLE_CONFIRMED | — | — | Safintra South Africa | Gauteng/Boksburg | https://www.linkedin.com/in/walter-chigwada-8b4b7520/ |
| 96 | **Taku Chimedza** | Chimedza / Taku | FINANCE_ROLE_CONFIRMED | — | — | Averda South Africa | Johannesburg Metropolitan Area | https://www.linkedin.com/in/taku-chimedza-ca-sa-578b6a153/ |
| 97 | **Bianca Christian** | Christian / Bianca | CONFIRMED | CA(SA) | SAICA | WBHO Construction - Cape Division | Gauteng/Gauteng | https://www.linkedin.com/in/bianca-christian-1690a9b0/ |
| 98 | **Kruger Christie** | Christie / Kruger | FINANCE_ROLE_CONFIRMED | — | — | Spier | Western Cape/Cape Town | https://www.linkedin.com/in/kruger-christie-08b5a75a/ |
| 99 | **Tanya Churchill** | Churchill / Tanya | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/tanya-churchill-03589714a/ |
| 100 | **Iliscke Cilliers** | Cilliers / Iliscke | FINANCE_ROLE_CONFIRMED | — | — | Boland Cellar | Western Cape/Paarl | — |
| 101 | **Malcolm Cecil Coates** | Coates / Malcolm | HIGH_CONFIDENCE | PA(SA) | SAIPA | Alma Casa | Western Cape/Muizenberg (Cape Town) | — |
| 102 | **Denovan Coetzee** | Coetzee / Denovan | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/denovan-coetzee-acma-cgma-652581197/ |
| 103 | **Johan Coetzee** | Coetzee / Johan | HIGH_CONFIDENCE | CA(SA) | SAICA | Callidus Accountants | Western Cape/Somerset West | — |
| 104 | **Werner Coetzee** | Coetzee / Werner | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/City of Johannesburg | https://www.linkedin.com/in/werner-coetzee-428687138/ |
| 105 | **Alisha Coetzer** | Coetzer / Alisha | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/alisha-coetzer-059b1a63/ |
| 106 | **Neil Coetzer** | Coetzer / Neil | RESEARCH_HOLD | — | — | SPH Kundalila | North West/Rustenburg | https://www.linkedin.com/in/neil-coetzer-0b533228a/ |
| 107 | **Pieter-Christiaan Coetzer** | Coetzer / Pieter-Christiaan | FINANCE_ROLE_CONFIRMED | — | — | Southern Oil (SOILL) | Potchefstroom | https://www.linkedin.com/in/pieter-christiaan-coetzer-224587244/ |
| 108 | **Themba Collen** | Collen / Themba | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Gauteng/Benoni | https://www.linkedin.com/in/themba-collen-410500248/ |
| 109 | **Angus Cornelius** | Cornelius / Angus | FINANCE_ROLE_CONFIRMED | — | — | Peninsula Beverages | Western Cape/City of Cape Town | https://www.linkedin.com/in/angus-cornelius-ca-sa-4603361a/ |
| 110 | **Tracey Cosgrove** | Cosgrove / Tracey | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/City of Cape Town | https://www.linkedin.com/in/tracey-cosgrove-79454024/ |
| 111 | **Melese Cronje** | Cronje / Melese | FINANCE_ROLE_CONFIRMED | — | — | Much Asphalt | South Africa | https://www.linkedin.com/in/melese-cronje-a8437a94/ |
| 112 | **Jeanette Croukamp** | Croukamp / Jeanette | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/jeanette-croukamp-237469a6/ |
| 113 | **Lameez Cupido** | Cupido / Lameez | FINANCE_ROLE_CONFIRMED | — | — | Capespan South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/lameez-cupido-b39a0141/ |
| 114 | **Minnie D.** | D. / Minnie | FINANCE_ROLE_CONFIRMED | — | — | Métier Mixed Concrete | KwaZulu-Natal/Durban | https://www.linkedin.com/in/minnie-de-wit-0a85425b/ |
| 115 | **Louwrens da Silva** | da Silva / Louwrens | HIGH_CONFIDENCE | PA(SA) | SAIPA | Petrichor Consulting | Western Cape/Somerset West | — |
| 116 | **Ahmed Dalvie** | Dalvie / Ahmed | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/Cape Town | https://www.linkedin.com/in/ahmeddalvie/ |
| 117 | **Adre Daniel** | Daniel / Adre | HIGH_CONFIDENCE | PA(SA) | SAIPA | Accu-fin Accounting | Western Cape/Milnerton (Cape Town) | — |
| 118 | **Ebrahim Daniels** | Daniels / Ebrahim | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/Cape Town | https://www.linkedin.com/in/ebrahim-daniels/ |
| 119 | **Kyle Danster** | Danster / Kyle | CONFIRMED | ACMA, CGMA | CIMA | Curro Holdings Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/kyle-danster/ |
| 120 | **Belinda David** | David / Belinda | FINANCE_ROLE_CONFIRMED | — | — | I&J | Western Cape/City of Cape Town | https://www.linkedin.com/in/belinda-david-a7965651/ |
| 121 | **Zaakirah Davids** | Davids / Zaakirah | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/zaakirah-davids-ca-sa-b42445267/ |
| 122 | **Graham Davin** | Davin / Graham | CONFIRMED | CA(SA) | SAICA | TFG Limited (The Foschini Group) | — | — |
| 123 | **Ferose dawood** | dawood / Ferose | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/City of Cape Town | https://www.linkedin.com/in/dawood-ferose-9829347a/ |
| 124 | **Angelina de Gouveia** | de Gouveia / Angelina | FINANCE_ROLE_CONFIRMED | — | — | Concor | Gauteng/City of Johannesburg | https://www.linkedin.com/in/angelina-de-gouveia-4639681ba/ |
| 125 | **Yolandi de Jonge** | de Jonge / Yolandi | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/City of Johannesburg | https://www.linkedin.com/in/yolandi-de-jonge-40917b74/ |
| 126 | **Marinelle de Klerk Kilian** | de Klerk Kilian / Marinelle | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group | Western Cape/Saldanha | https://www.linkedin.com/in/marinelle-de-klerk-kilian-57792929/ |
| 127 | **Lizelle De Klerk** | De Klerk / Lizelle | FINANCE_ROLE_CONFIRMED | — | — | EnviroServ | Gauteng/Johannesburg | https://www.linkedin.com/in/lizelle-de-klerk-82b35574/ |
| 128 | **Nicolene De Klerk** | De Klerk / Nicolene | FINANCE_ROLE_CONFIRMED | — | — | DSV | Pretoria Metropolitan Area | https://www.linkedin.com/in/nicolene-de-klerk-223181246/ |
| 129 | **Callum de la Hunt** | de la Hunt / Callum | FINANCE_ROLE_CONFIRMED | — | — | Klay | Western Cape/Cape Town | https://www.linkedin.com/in/callum-de-la-hunt-01a590203/ |
| 130 | **Zené de Laan** | de Laan / Zené | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Western Cape/Stellenbosch | https://www.linkedin.com/in/zené-de-laan-ca-sa-a25aa485/ |
| 131 | **Adriaan de Lange** | de Lange / Adriaan | CONFIRMED | CA(SA) | SAICA | Adriaan de Lange Advisory (Private Capacity) | Western Cape/Cape Town | https://www.linkedin.com/in/a3aandl/ |
| 132 | **John De Sousa** | De Sousa / John | CONFIRMED | PA(SA) | SAIPA | GVK-Siya Zama | Western Cape/City of Cape Town | https://za.linkedin.com/in/john-de-sousa-98a52247 |
| 133 | **Sandi De Souza** | De Souza / Sandi | CONFIRMED | CA(SA) | SAICA | SAP Africa | — | — |
| 134 | **Emile de Villiers** | de Villiers / Emile | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 135 | **Franselle de Villiers** | de Villiers / Franselle | FINANCE_ROLE_CONFIRMED | — | — | Raubex / Roadmac Surfacing Cape | Free State/Bloemfontein | https://www.linkedin.com/in/franselle-de-villiers-413b4b82/ |
| 136 | **Aulene De Vries** | De Vries / Aulene | CONFIRMED | PA(SA) | SAIPA | Portland Group | Western Cape/Wellington | https://www.linkedin.com/in/aulene-de-vries-pa-sa-79050616a/ |
| 137 | **Louis de Wet** | de Wet / Louis | CONFIRMED | CA(SA) | SAICA | TradeOn SA | Western Cape/Stellenbosch | https://www.linkedin.com/in/louisdewetza/ |
| 138 | **Pieter De Wit** | De Wit / Pieter | CONFIRMED | CA(SA) | SAICA | Afrimat | Western Cape/City of Cape Town | https://www.linkedin.com/in/pieter-de-wit-4619b210/ |
| 139 | **Lindi Dempers** | Dempers / Lindi | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/Saldanha Bay Local Municipality | https://www.linkedin.com/in/lindi-dempers-9b872350/ |
| 140 | **Manoj Desai** | Desai / Manoj | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/manoj-desai-61790754/ |
| 141 | **Elisha Dhenanath** | Dhenanath / Elisha | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | Gauteng/City of Johannesburg | https://www.linkedin.com/in/elisha-dhenanath-11b85b5/ |
| 142 | **Zama-o-kuhle Dingaan** | Dingaan / Zama-o-kuhle | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Gauteng/Gauteng | https://www.linkedin.com/in/zama-o-kuhle-dingaan-acma-cgma-a11080134/ |
| 143 | **Monique Dippenaar** | Dippenaar / Monique | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/monique-dippenaar-54b61114b/ |
| 144 | **Lézanne Dirkse van Schalkwyk** | Dirkse van Schalkwyk / Lézanne | CONFIRMED | AGA(SA) | SAICA | McA Inc. | Western Cape/Durbanville | — |
| 145 | **Nkosana Dlamini** | Dlamini / Nkosana | CONFIRMED | ACMA, CGMA | CIMA | Absa Group | Gauteng/Johannesburg | — |
| 146 | **Lizaan Draper** | Draper / Lizaan | FINANCE_ROLE_CONFIRMED | — | — | Sentraal-Suid Co-operative (SSK) | Western Cape/Western Cape | https://www.linkedin.com/in/lizaan-draper-ca-sa-286955193/ |
| 147 | **André Du Plessis** | Du Plessis / André | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 148 | **Ashley Du Plessis** | Du Plessis / Ashley | CONFIRMED | AGA(SA) | SAICA | — | Western Cape/Paarl | https://www.linkedin.com/in/ashley-du-plessis-ba99a716b/ |
| 149 | **Flavian Du Plessis** | Du Plessis / Flavian | FINANCE_ROLE_CONFIRMED | — | — | Libstar | Western Cape/Cape Town | https://www.linkedin.com/in/flavian-du-plessis-4a5829247/ |
| 150 | **Francois Du Plessis** | Du Plessis / Francois | FINANCE_ROLE_CONFIRMED | — | — | EnviroServ | Western Cape/Cape Town | https://www.linkedin.com/in/francois-du-plessis-75798597/ |
| 151 | **Ilke du Plessis** | du Plessis / Ilke | FINANCE_ROLE_CONFIRMED | — | — | Kropz Elandsfontein | Western Cape/City of Cape Town | https://www.linkedin.com/in/ilke-du-plessis-5478a7207/ |
| 152 | **Lian du Plessis** | du Plessis / Lian | CONFIRMED | AGA(SA) | SAICA | Cape Chamber of Commerce & Industry | Western Cape/Cape Town | https://www.linkedin.com/in/lian-du-plessis-aga-sa-177375149/ |
| 153 | **Corne Du Plooy** | Du Plooy / Corne | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/corne-du-plooy-4625b7136/ |
| 154 | **Valentine Dzvova** | Dzvova / Valentine | CONFIRMED | CA(SA), ACMA, CGMA | SAICA, CIMA | AYO Technology Solutions Limited | Western Cape/Cape Town | https://za.linkedin.com/in/valentine-dzvova |
| 155 | **Monique Ellis** | Ellis / Monique | FINANCE_ROLE_CONFIRMED | — | — | Namaqua Wines | Gauteng/Pretoria | https://www.linkedin.com/in/monique-ellis-8a58b9145/ |
| 156 | **Wilbur Engelbrecht** | Engelbrecht / Wilbur | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/Vredenburg | https://www.linkedin.com/in/wilbur-engelbrecht-4232b8172/ |
| 157 | **Siddiqa Enous** | Enous / Siddiqa | FINANCE_ROLE_CONFIRMED | — | — | AfriSam | — | https://www.linkedin.com/in/siddiqa-enous-b2500b12/ |
| 158 | **Rafeeq Erasmus** | Erasmus / Rafeeq | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/City of Cape Town | https://www.linkedin.com/in/rafeeq-erasmus-5b113b54/ |
| 159 | **Fanie Esterhuizen** | Esterhuizen / Fanie | FINANCE_ROLE_CONFIRMED | — | — | SPH Kundalila | Western Cape/Cape Town | https://www.linkedin.com/in/fanie-esterhuizen-1a325811b/ |
| 160 | **Anthea F.** | F. / Anthea | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/City of Cape Town | https://www.linkedin.com/in/anthea-f-01a87264/ |
| 161 | **Amanda Fairley** | Fairley / Amanda | FINANCE_ROLE_CONFIRMED | — | — | Interwaste | Gauteng/Johannesburg | https://www.linkedin.com/in/amanda-fairley-28b74b52/ |
| 162 | **Zahid Fakey** | Fakey / Zahid | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 163 | **Zahida Fakey** | Fakey / Zahida | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 164 | **Brumilda Farmer** | Farmer / Brumilda | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/brumilda-farmer-a04b11176/ |
| 165 | **Craig Felaar** | Felaar / Craig | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/City of Cape Town | https://www.linkedin.com/in/craig-felaar-42982931/ |
| 166 | **Erica Felix** | Felix / Erica | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Western Cape/City of Cape Town | https://www.linkedin.com/in/erica-felix-737839138/ |
| 167 | **Siphamandla Fennie** | Fennie / Siphamandla | FINANCE_ROLE_CONFIRMED | — | — | I&J | Western Cape/City of Cape Town | https://www.linkedin.com/in/siphamandla-fennie/ |
| 168 | **Brent Ferreira** | Ferreira / Brent | CONFIRMED | PA(SA) | SAIPA | Afrimat | Western Cape/City of Cape Town | https://www.linkedin.com/in/brent-ferreira-883553172/ |
| 169 | **Sophy Finger** | Finger / Sophy | FINANCE_ROLE_CONFIRMED | — | — | AfriSam | — | https://www.linkedin.com/in/sophy-finger-0ab686101/ |
| 170 | **Abdulmu-izz Fortune** | Fortune / Abdulmu-izz | FINANCE_ROLE_CONFIRMED | — | — | Premier Fishing & Brands | Western Cape/City of Cape Town | https://www.linkedin.com/in/abdulmu-izz-fortune-808057197/ |
| 171 | **Dawn Fortune** | Fortune / Dawn | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/dawn-fortune-064a8222/ |
| 172 | **Delwen Fortune** | Fortune / Delwen | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/delwen-fortune-b98bb437/ |
| 173 | **Jeanne Fourie** | Fourie / Jeanne | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/jeanne-fourie-2741987a/ |
| 174 | **Neil Fourie** | Fourie / Neil | CONFIRMED | AGA(SA) | SAICA | Brenn-O-Kem | Western Cape/Stellenbosch | https://www.linkedin.com/in/neil-fourie-aga-sa-2a125b204/ |
| 175 | **Suzanne Fourie** | Fourie / Suzanne | FINANCE_ROLE_CONFIRMED | — | — | LANCEWOOD | Western Cape/City of Cape Town | https://www.linkedin.com/in/suzanne-fourie-568541135/ |
| 176 | **Melissa Frantz** | Frantz / Melissa | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/City of Cape Town | https://www.linkedin.com/in/melissa-frantz-4856429a/ |
| 177 | **Victoria Fryer** | Fryer / Victoria | FINANCE_ROLE_CONFIRMED | — | — | NJR Steel | Gauteng/Benoni | https://www.linkedin.com/in/victoria-fryer-201359222/ |
| 178 | **Vukosi Fungeni** | Fungeni / Vukosi | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 179 | **Akani Fungheni (BCOMPT)** | Fungheni (BCOMPT) / Akani | FINANCE_ROLE_CONFIRMED | — | — | DSV | Western Cape/City of Cape Town | https://www.linkedin.com/in/akani-fungheni-bcompt-654416190/ |
| 180 | **Jackie Furter** | Furter / Jackie | FINANCE_ROLE_CONFIRMED | — | — | Power Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/jackie-furter-47908888/ |
| 181 | **Frikkie G.** | G. / Frikkie | FINANCE_ROLE_CONFIRMED | — | — | WastePlan | Gauteng/Pretoria | https://www.linkedin.com/in/frikkie-g-9036b735/ |
| 182 | **Rameck Gadziso** | Gadziso / Rameck | FINANCE_ROLE_CONFIRMED | — | — | Spier | Western Cape/Somerset West | https://www.linkedin.com/in/rameck-gadziso-cgma-cima-adv-dip-ma-tax-consultant-4a012228/ |
| 183 | **Shaheeda Gafieldien** | Gafieldien / Shaheeda | FINANCE_ROLE_CONFIRMED | — | — | Fruitways | Western Cape/Somerset West | https://www.linkedin.com/in/shaheeda-gafieldien-233599277/ |
| 184 | **Ipfi Gavhi** | Gavhi / Ipfi | FINANCE_ROLE_CONFIRMED | — | — | I&J | Western Cape/Western Cape | https://www.linkedin.com/in/ipfi-gavhi-20426a207/ |
| 185 | **Chelsea Geldenhuys** | Geldenhuys / Chelsea | CONFIRMED | CA(SA) | SAICA | Raubex / Roadmac Surfacing Cape | Free State/Bloemfontein | https://www.linkedin.com/in/chelsea-geldenhuys-ca-sa-0139847b/ |
| 186 | **Nicole Genade** | Genade / Nicole | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/nicole-genade-6186b2149/ |
| 187 | **Rene Geneve Boros** | Geneve Boros / Rene | FINANCE_ROLE_CONFIRMED | — | — | DSV | Germiston Metropolitan Area | https://www.linkedin.com/in/rene-geneve-boros-067048202/ |
| 188 | **Marta Gerbach** | Gerbach / Marta | CONFIRMED | CA(SA) | SAICA | Fourways Airconditioning | — | — |
| 189 | **Zandrea Gerber** | Gerber / Zandrea | CONFIRMED | CA(SA) | SAICA | Pay@ | Western Cape/Paarl | https://www.linkedin.com/in/zandrea-gerber-ca-sa-99a5a475/ |
| 190 | **Christelle Germishuys** | Germishuys / Christelle | FINANCE_ROLE_CONFIRMED | — | — | KWV | Western Cape/City of Cape Town | https://www.linkedin.com/in/christelle-germishuys-438baa4/ |
| 191 | **Emmie Germishuys** | Germishuys / Emmie | FINANCE_ROLE_CONFIRMED | — | — | Sentraal-Suid Co-operative (SSK) | Western Cape/Western Cape | https://www.linkedin.com/in/emmie-germishuys-13ba26262/ |
| 192 | **Ayanda Geza** | Geza / Ayanda | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Gauteng/City of Johannesburg | https://www.linkedin.com/in/ayanda-geza-3a336648/ |
| 193 | **Nonkululeko Gobodo** | Gobodo / Nonkululeko | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 194 | **Shailen Gokaldass** | Gokaldass / Shailen | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/shailen-gokaldass-15980b49/ |
| 195 | **Kyrlene Goliath** | Goliath / Kyrlene | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Western Cape/City of Cape Town | https://www.linkedin.com/in/kyrlene-goliath-acma-cgma-a858b046/ |
| 196 | **Tikeyah Goodman** | Goodman / Tikeyah | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Gauteng/City of Johannesburg | https://www.linkedin.com/in/tikeyah-goodman-158876249/ |
| 197 | **Albert Goosen** | Goosen / Albert | FINANCE_ROLE_CONFIRMED | — | — | Ceres Fruit Growers | South Africa | https://www.linkedin.com/in/albert-goosen-97223b6/ |
| 198 | **Chantelle Goosen** | Goosen / Chantelle | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/City of Cape Town | https://www.linkedin.com/in/chantellegoosen/ |
| 199 | **Jana Goosen** | Goosen / Jana | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 200 | **Lené Goosen** | Goosen / Lené | FINANCE_ROLE_CONFIRMED | — | — | Libstar | Western Cape/Cape Town | https://www.linkedin.com/in/len/ |
| 201 | **Reece Gordon** | Gordon / Reece | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Western Cape/Somerset West | https://www.linkedin.com/in/reece-gordon-ca-sa-415263223/ |
| 202 | **Louise Gouws Du Toit** | Gouws Du Toit / Louise | FINANCE_ROLE_CONFIRMED | — | — | Kaap Agri / Agrimark | South Africa | https://www.linkedin.com/in/louise-gouws-du-toit-18178a14b/ |
| 203 | **Kathleen Gouws** | Gouws / Kathleen | FINANCE_ROLE_CONFIRMED | — | — | Macsteel | South Africa | https://www.linkedin.com/in/kathleen-gouws-95b08989/ |
| 204 | **Anneline Govender** | Govender / Anneline | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/ethan-horovitz-b4853277/ |
| 205 | **Chernel Govender** | Govender / Chernel | FINANCE_ROLE_CONFIRMED | — | — | Ardagh Glass Packaging SA | Gauteng/City of Johannesburg | https://www.linkedin.com/in/chernel-govender-75935028/ |
| 206 | **Deshnee Govender** | Govender / Deshnee | FINANCE_ROLE_CONFIRMED | — | — | Mpact | KwaZulu-Natal/Ballito | https://www.linkedin.com/in/deshnee-govender-01a433186/ |
| 207 | **Ellendhren Govender** | Govender / Ellendhren | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Gauteng/Randburg | https://www.linkedin.com/in/ellendhren-govender-152b55207/ |
| 208 | **Emanuel Govender** | Govender / Emanuel | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/emanuel-govender-507293138/ |
| 209 | **Lavanya Govender** | Govender / Lavanya | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | Johannesburg Metropolitan Area | https://www.linkedin.com/in/lavanya-govender-302577196/ |
| 210 | **Michelle Govender** | Govender / Michelle | FINANCE_ROLE_CONFIRMED | — | — | Capespan South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/michelle-govender-93bb20124/ |
| 211 | **Tanya Govender** | Govender / Tanya | FINANCE_ROLE_CONFIRMED | — | — | RFG Foods | KwaZulu-Natal/KwaZulu-Natal | https://www.linkedin.com/in/tanya-govender-0356441b9/ |
| 212 | **Louis Grant** | Grant / Louis | FINANCE_ROLE_CONFIRMED | — | — | EnviroServ | Gauteng/Johannesburg | https://www.linkedin.com/in/louis-grant-55390735/ |
| 213 | **Grant Greeff** | Greeff / Grant | CONFIRMED | CA(SA) | SAICA | Drone Ops Group | — | — |
| 214 | **Rene Greeff** | Greeff / Rene | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Mpumalanga/Mkhondo Local Municipality | https://www.linkedin.com/in/rene-greeff-088701a8/ |
| 215 | **Willem Greeff** | Greeff / Willem | FINANCE_ROLE_CONFIRMED | — | — | Much Asphalt | Western Cape/Cape Town | https://www.linkedin.com/in/willem-greeff-23836635/ |
| 216 | **Morgan Gregory** | Gregory / Morgan | CONFIRMED | CA(SA) | SAICA | MK Aerospace SA | Western Cape/Cape Town | https://www.linkedin.com/in/morgan-gregory-ca-sa-64046117b/ |
| 217 | **Nicole Grendeling** | Grendeling / Nicole | CONFIRMED | CA(SA) | SAICA | Astron Energy | Western Cape/City of Cape Town | https://www.linkedin.com/in/nicole-grendeling-ca-sa-bb99a7150/ |
| 218 | **Bianca Greyling** | Greyling / Bianca | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Gauteng/Gauteng | https://www.linkedin.com/in/bianca-greyling-6307819a/ |
| 219 | **Mer-Lynn Griego** | Griego / Mer-Lynn | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Western Cape/City of Cape Town | https://www.linkedin.com/in/mer-lynn-griego-4969128b/ |
| 220 | **Shahied Griffin** | Griffin / Shahied | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/shahied-griffin-0b6203128/ |
| 221 | **Andre Grobler** | Grobler / Andre | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/andregrobler/ |
| 222 | **Amanda Groenewald** | Groenewald / Amanda | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/amanda-groenewald-a63a93110/ |
| 223 | **Owen Gush** | Gush / Owen | FINANCE_ROLE_CONFIRMED | — | — | Ladismith Cheese / Woodlands Dairy Group | Eastern Cape/Port Elizabeth | https://www.linkedin.com/in/owen-gush-29051371/ |
| 224 | **Asanda Gwiliza** | Gwiliza / Asanda | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/asanda-gwiliza-4954901b5/ |
| 225 | **Alicia Haasbroek** | Haasbroek / Alicia | CONFLICTING | — | — | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 226 | **Matthew Hall** | Hall / Matthew | FINANCE_ROLE_CONFIRMED | — | — | Raubex / Roadmac Surfacing Cape | South Africa | https://www.linkedin.com/in/matthew-hall-1b045bba/ |
| 227 | **Desray Hamilton** | Hamilton / Desray | FINANCE_ROLE_CONFIRMED | — | — | Ardagh Glass Packaging SA | South Africa | https://www.linkedin.com/in/desray-hamilton-25a1a726/ |
| 228 | **Ashley Hanekom** | Hanekom / Ashley | CONFIRMED | CA(SA) | SAICA | Superside | Western Cape/Cape Town | https://www.linkedin.com/in/ashleyhanekom/ |
| 229 | **Samantha Hanke** | Hanke / Samantha | CONFIRMED | CA(SA) | SAICA | Afrimat | Western Cape/Cape Town | https://www.linkedin.com/in/samantha-hanke-ca-sa-b923b1166/ |
| 230 | **Magda Harmse** | Harmse / Magda | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/magda-harmse-5940a540/ |
| 231 | **Linda Harris** | Harris / Linda | FINANCE_ROLE_CONFIRMED | — | — | Tronox Namakwa Sands | Western Cape/Hermanus | https://www.linkedin.com/in/linda-harris-13293129/ |
| 232 | **Nicole Harris** | Harris / Nicole | CONFIRMED | CA(SA) | SAICA | WBHO Construction - Cape Division | Johannesburg Metropolitan Area | https://www.linkedin.com/in/nicole-harris-ca-sa-8b6171150/ |
| 233 | **Portia Harrison** | Harrison / Portia | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Western Cape/Cape Town | https://www.linkedin.com/in/portia-harrison-589184121/ |
| 234 | **Shereen Hartnick** | Hartnick / Shereen | FINANCE_ROLE_CONFIRMED | — | — | Peninsula Beverages | Western Cape/City of Cape Town | https://www.linkedin.com/in/shereen-hartnick-25a6101a/ |
| 235 | **Warnick Hartzenberg** | Hartzenberg / Warnick | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Western Cape/City of Cape Town | https://www.linkedin.com/in/warnick-hartzenberg/ |
| 236 | **Imtiaaz Hashim** | Hashim / Imtiaaz | CONFIRMED | CA(SA) | SAICA | BDO South Africa | Western Cape/Cape Town | — |
| 237 | **Gail Hatting** | Hatting / Gail | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | — | https://www.linkedin.com/in/gail-hatting-5ba77176/ |
| 238 | **Ashlin Healy** | Healy / Ashlin | CONFIRMED | CA(SA) | SAICA | Deloitte (South Africa) | Western Cape/Cape Town | https://www.linkedin.com/in/ashlin-healy-ca-sa-130238103/ |
| 239 | **Illana Helman** | Helman / Illana | CONFIRMED | CA(SA) | SAICA | Massmart | Gauteng/Johannesburg | https://www.linkedin.com/in/illana-helman-ca-sa-1279b117/ |
| 240 | **Geyrieya Hendricks** | Hendricks / Geyrieya | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | South Africa | https://www.linkedin.com/in/geyrieya-hendricks-407454194/ |
| 241 | **Jacobie Hendricks** | Hendricks / Jacobie | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/jacobie-hendricks-2273a620a/ |
| 242 | **Bronvin Heuvel** | Heuvel / Bronvin | CONFIRMED | CA(SA) | SAICA | KPMG (South Africa) | Western Cape/Cape Town | https://www.linkedin.com/in/bronvin-heuvel-ca-sa-ra-7b2475a9/ |
| 243 | **Barry Heyns** | Heyns / Barry | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Stellenbosch | https://www.linkedin.com/in/bernhardheyns/ |
| 244 | **Patience Hlongwane** | Hlongwane / Patience | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Gauteng/Pretoria | https://www.linkedin.com/in/patience-hlongwane-743b48235/ |
| 245 | **Debra Hlophe, nèe Modiba** | Hlophe, nèe Modiba / Debra | FINANCE_ROLE_CONFIRMED | — | — | Concor | Gauteng/City of Johannesburg | https://www.linkedin.com/in/debra-hlophe-nèe-modiba-27451337/ |
| 246 | **Mduduzi Hlubi** | Hlubi / Mduduzi | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/mduduzi-hlubi-a21b1262/ |
| 247 | **susan hodgkinson** | hodgkinson / susan | FINANCE_ROLE_CONFIRMED | — | — | Concor | Gauteng/Johannesburg | https://www.linkedin.com/in/susan-hodgkinson-b31905248/ |
| 248 | **Mieke Hoffman** | Hoffman / Mieke | CONFIRMED | ACMA, CGMA | CIMA | The Fieldbar Co. | Western Cape/Cape Town | https://za.linkedin.com/in/mieke-hoffman |
| 249 | **Caron Hol** | Hol / Caron | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Western Cape/City of Cape Town | https://www.linkedin.com/in/caron-hol-65299a71/ |
| 250 | **Steven Holmes** | Holmes / Steven | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Gauteng/City of Johannesburg | https://www.linkedin.com/in/steven-holmes-04461511/ |
| 251 | **Susan Homann** | Homann / Susan | FINANCE_ROLE_CONFIRMED | — | — | Tronox Namakwa Sands | KwaZulu-Natal/KwaZulu-Natal | https://www.linkedin.com/in/susan-homann-407a2389/ |
| 252 | **Armand Horst** | Horst / Armand | FINANCE_ROLE_CONFIRMED | — | — | WastePlan | Gauteng/Johannesburg | https://www.linkedin.com/in/armandhorst/ |
| 253 | **Sunell Humphris** | Humphris / Sunell | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Port Elizabeth Metropolitan Area | https://www.linkedin.com/in/sunell-humphris-71771b170/ |
| 254 | **André Huysamer** | Huysamer / André | HIGH_CONFIDENCE | AGA(SA) | SAICA | Kula | Western Cape/Worcester | — |
| 255 | **Darren Isaacs** | Isaacs / Darren | CONFIRMED | CA(SA) | SAICA | Makosi | — | — |
| 256 | **Juanita Isaacs** | Isaacs / Juanita | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Western Cape/City of Cape Town | https://www.linkedin.com/in/juanita-isaacs-88006724a/ |
| 257 | **Craig Isler** | Isler / Craig | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/City of Cape Town | https://www.linkedin.com/in/craig-isler-b3a43497/ |
| 258 | **Parveen Ismail** | Ismail / Parveen | FINANCE_ROLE_CONFIRMED | — | — | I&J | Western Cape/Cape Town | https://www.linkedin.com/in/parveen-ismail-001001273/ |
| 259 | **Anthea Jacobs (Hendricks)** | Jacobs (Hendricks) / Anthea | FINANCE_ROLE_CONFIRMED | — | — | KWV | Western Cape/Paarl | https://www.linkedin.com/in/anthea-hendricks-ca-sa-02501453/ |
| 260 | **Aldrin Jacobs** | Jacobs / Aldrin | FINANCE_ROLE_CONFIRMED | — | — | Bowler Metcalf / Bowler Plastics | Western Cape/Cape Town | https://za.linkedin.com/in/aldrin-jacobs-56b72a9b |
| 261 | **Anilynne Jacobs** | Jacobs / Anilynne | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Western Cape/City of Cape Town | https://www.linkedin.com/in/anilynne-jacobs-265963165/ |
| 262 | **Anthea Jacobs** | Jacobs / Anthea | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/Cape Town | https://www.linkedin.com/in/anthea-jacobs/ |
| 263 | **Kyle Jacobs** | Jacobs / Kyle | FINANCE_ROLE_CONFIRMED | — | — | Kropz Elandsfontein | Western Cape/City of Cape Town | https://www.linkedin.com/in/kyle-jacobs-17aa7816b/ |
| 264 | **Lisa Jainundh** | Jainundh / Lisa | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group | South Africa | https://www.linkedin.com/in/lisa-jainundh-96b67199/ |
| 265 | **Mamogoto Jan Mokoala** | Jan Mokoala / Mamogoto | FINANCE_ROLE_CONFIRMED | — | — | Sunrise Energy | Gauteng/City of Johannesburg | https://www.linkedin.com/in/mamogoto-jan-mokoala-09a527b/ |
| 266 | **Roelof Jansen van Vuuren** | Jansen van Vuuren / Roelof | HIGH_CONFIDENCE | PA(SA) | SAIPA | The Tax Shop Pretoria North East | Gauteng/Pretoria | — |
| 267 | **SP Jansen van Vuuren** | Jansen van Vuuren / SP | FINANCE_ROLE_CONFIRMED | — | — | WastePlan | Johannesburg Metropolitan Area | https://www.linkedin.com/in/sp-jansen-van-vuuren-aga-sa-71540025a/ |
| 268 | **Alana Johns** | Johns / Alana | HIGH_CONFIDENCE | PA(SA) | SAIPA | — | Western Cape | — |
| 269 | **Charne Johnston** | Johnston / Charne | FINANCE_ROLE_CONFIRMED | — | — | Capespan South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/charnejohnston1/ |
| 270 | **Mark Jolliffe** | Jolliffe / Mark | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/mark-jolliffe-537803171/ |
| 271 | **Jeanette Jonker** | Jonker / Jeanette | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Western Cape/City of Cape Town | https://www.linkedin.com/in/jeanette-jonker-47878678/ |
| 272 | **Gaylin Jonkers** | Jonkers / Gaylin | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/gaylin-jonkers-37662457/ |
| 273 | **Samoray Jooste** | Jooste / Samoray | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/samoray-jooste-383191b7/ |
| 274 | **Anja Jordaan** | Jordaan / Anja | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/anja-jordaan-946bbb81/ |
| 275 | **Dean Jordaan** | Jordaan / Dean | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/dean-jordaan-7b331a1b3/ |
| 276 | **Francois Joubert** | Joubert / Francois | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 277 | **AJ Julies** | Julies / AJ | FINANCE_ROLE_CONFIRMED | — | — | RFG Foods | Western Cape/Paarl | https://www.linkedin.com/in/aj-julies-ca-sa-b7628699/ |
| 278 | **Ashley Julius** | Julius / Ashley | FINANCE_ROLE_CONFIRMED | — | — | KWV | Western Cape/City of Cape Town | https://www.linkedin.com/in/ashley-julius-a9192631/ |
| 279 | **Thapelo K. Matlawe** | K. Matlawe / Thapelo | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/thapelo-k-matlawe-ab34a5178/ |
| 280 | **Sumaya Kader** | Kader / Sumaya | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/sumaya-kader-ca-sa-b5b32a1a3/ |
| 281 | **Nethin Karamchand** | Karamchand / Nethin | CONFIRMED | CA(SA) | SAICA | Deloitte (South Africa) | Western Cape/Cape Town | https://www.linkedin.com/in/nethin/ |
| 282 | **Carmen Karsten** | Karsten / Carmen | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/carmen-karsten-acma-cgma-464a46120/ |
| 283 | **Fia Karstens** | Karstens / Fia | FINANCE_ROLE_CONFIRMED | — | — | Capespan South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/fia-karstens-995225155/ |
| 284 | **Jo-Lee Keefe** | Keefe / Jo-Lee | FINANCE_ROLE_CONFIRMED | — | — | SA Metal Group | Gauteng/City of Johannesburg | https://www.linkedin.com/in/jo-lee-keefe-46b695100/ |
| 285 | **Bradley Kent** | Kent / Bradley | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | Gauteng/City of Johannesburg | https://www.linkedin.com/in/bradley-kent-240798171/ |
| 286 | **khomotso kgapane** | kgapane / khomotso | FINANCE_ROLE_CONFIRMED | — | — | EnviroServ | Gauteng/Johannesburg | https://www.linkedin.com/in/khomotso-kgapane-7b137773/ |
| 287 | **Bridgete Kgopane** | Kgopane / Bridgete | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/Pretoria | https://www.linkedin.com/in/bridgete-kgopane-ab8485258/ |
| 288 | **Keneuwe Khati** | Khati / Keneuwe | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/Cape Town | https://www.linkedin.com/in/keneuwe-khati-584b7951/ |
| 289 | **Koko Khumalo** | Khumalo / Koko | CONFIRMED | CA(SA) | SAICA | Motlanalo Chartered Accountants and Auditors Inc | — | — |
| 290 | **Sithembiso Khumalo** | Khumalo / Sithembiso | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Gauteng/City of Johannesburg | https://www.linkedin.com/in/sithembiso-khumalo-725914117/ |
| 291 | **Carla Kilian** | Kilian / Carla | HIGH_CONFIDENCE | PA(SA) | SAIPA | AETOS Financial Services | Gauteng/Roodepoort | — |
| 292 | **Roland Killian** | Killian / Roland | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Gauteng/City of Johannesburg | https://www.linkedin.com/in/roland-killian-ca-sa-471a42a2/ |
| 293 | **Sharon King** | King / Sharon | FINANCE_ROLE_CONFIRMED | — | — | AfriSam | — | https://www.linkedin.com/in/sharon-king-king-53321053/ |
| 294 | **Enrico Kleinbooi** | Kleinbooi / Enrico | CONFIRMED | CA(SA) | SAICA | Kannaland Municipality | Western Cape/Ladismith | — |
| 295 | **Henko Kleynhans** | Kleynhans / Henko | FINANCE_ROLE_CONFIRMED | — | — | Libstar | Western Cape/Cape Town | https://www.linkedin.com/in/henko-kleynhans/ |
| 296 | **Melissa Klopper** | Klopper / Melissa | FINANCE_ROLE_CONFIRMED | — | — | DGB | Gauteng/City of Johannesburg | https://www.linkedin.com/in/melissa-klopper-4286421a5/ |
| 297 | **Karmen Koch** | Koch / Karmen | FINANCE_ROLE_CONFIRMED | — | — | Chryso Southern Africa | Gauteng/City of Johannesburg | https://www.linkedin.com/in/karmen-koch-03b9b0106/ |
| 298 | **Daniel Koegelenberg** | Koegelenberg / Daniel | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Western Cape/City of Cape Town | https://www.linkedin.com/in/daniel-koegelenberg-72546291/ |
| 299 | **Rutger Koeman** | Koeman / Rutger | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Johannesburg Metropolitan Area | https://www.linkedin.com/in/rutgerkoeman/ |
| 300 | **Nkalipho Koenane** | Koenane / Nkalipho | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | KwaZulu-Natal/Empangeni | https://www.linkedin.com/in/nkalipho-koenane-625689248/ |
| 301 | **Tommie Koeries** | Koeries / Tommie | CONFIRMED | CA(SA), ACMA, CGMA | SAICA, CIMA | Much Asphalt | Western Cape/Cape Town | https://www.linkedin.com/in/tommie-koeries-366bb433/ |
| 302 | **Rescha Kok** | Kok / Rescha | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/rescha-kok-07971471/ |
| 303 | **Mihlali Kosi** | Kosi / Mihlali | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Eastern Cape/Port Elizabeth | https://www.linkedin.com/in/mihali-kosi-1923ab91/ |
| 304 | **Dirk Kotze** | Kotze / Dirk | CONFIRMED | CA(SA) | SAICA | Afrimat | Western Cape/City of Cape Town | https://www.linkedin.com/in/dirk-kotze-09818018/ |
| 305 | **Magda Kotze** | Kotze / Magda | FINANCE_ROLE_CONFIRMED | — | — | Power Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/magda-kotze-a479a3116/ |
| 306 | **Nils Kotze** | Kotze / Nils | FINANCE_ROLE_CONFIRMED | — | — | Raubex / Roadmac Surfacing Cape | Free State/Bloemfontein | https://www.linkedin.com/in/nils-kotze-07344180/ |
| 307 | **Bianca Krishna** | Krishna / Bianca | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | KwaZulu-Natal/Durban | https://www.linkedin.com/in/bianca-krishna-ca-sa-a365a5263/ |
| 308 | **Christie Kruger** | Kruger / Christie | FINANCE_ROLE_CONFIRMED | — | — | Spier | Western Cape/Paarl | https://www.linkedin.com/in/christie-kruger-41a922307/ |
| 309 | **Elna Kruger** | Kruger / Elna | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/elna-kruger-37804a160/ |
| 310 | **Kabelo Kuduntwane** | Kuduntwane / Kabelo | CONFIRMED | CA(SA) | SAICA | WBHO Construction - Cape Division | Gauteng/Pretoria | https://www.linkedin.com/in/kabelo-kuduntwane-ca-sa-0a52431a6/ |
| 311 | **Dylin Kuni** | Kuni / Dylin | CONFIRMED | ACMA, CGMA | CIMA | M+C Saatchi Group | Western Cape/Cape Town | https://www.linkedin.com/in/dylinkuni/ |
| 312 | **Ben Kutlwano Motsweni** | Kutlwano Motsweni / Ben | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Stellenbosch | https://www.linkedin.com/in/ben-kutlwano-motsweni-341974258/ |
| 313 | **Lesetja Kwetepane** | Kwetepane / Lesetja | HIGH_CONFIDENCE | PA(SA) | SAIPA | LA Financial Services (Pty) Ltd | Limpopo/Polokwane | — |
| 314 | **Terri Ladbrooke** | Ladbrooke / Terri | FINANCE_ROLE_CONFIRMED | — | — | Libstar | Western Cape/Cape Town | — |
| 315 | **Terri Ladbrooke** | Ladbrooke / Terri | CONFIRMED | CA(SA) | SAICA | Libstar | Western Cape/Cape Town | — |
| 316 | **Garthan Lakay** | Lakay / Garthan | FINANCE_ROLE_CONFIRMED | — | — | Kaap Agri / Agrimark | Western Cape/City of Cape Town | https://www.linkedin.com/in/garthan-lakay-bb980214b/ |
| 317 | **Div Lamprecht** | Lamprecht / Div | CONFIRMED | CA(SA) | SAICA | SAICA | Free State/Bloemfontein | — |
| 318 | **Anel Laubscher** | Laubscher / Anel | FINANCE_ROLE_CONFIRMED | — | — | Commercial Cold Holdings | Western Cape/Cape Town | https://www.linkedin.com/in/anel-laubscher-27933270/ |
| 319 | **Elize Laubscher** | Laubscher / Elize | FINANCE_ROLE_CONFIRMED | — | — | Tronox Namakwa Sands | Western Cape/Saldanha Bay Local Municipality | https://www.linkedin.com/in/elize-laubscher-8999336b/ |
| 320 | **Ell-Mae Lawrence** | Lawrence / Ell-Mae | FINANCE_ROLE_CONFIRMED | — | — | Kaap Agri / Agrimark | Western Cape/Paarl | https://www.linkedin.com/in/ell-mae-lawrence-ca-sa-54928927b/ |
| 321 | **Eric le Roux** | le Roux / Eric | FINANCE_ROLE_CONFIRMED | — | — | Kaap Agri / Agrimark | South Africa | https://www.linkedin.com/in/eric-le-roux-896ab518a/ |
| 322 | **Johan le Roux** | le Roux / Johan | CONFIRMED | CA(SA) | SAICA | Johan le Roux CA(SA) | Western Cape/Milnerton (Cape Town) | — |
| 323 | **Lindi le Roux** | le Roux / Lindi | FINANCE_ROLE_CONFIRMED | — | — | Blaauwberg Cold Storage | South Africa | https://za.linkedin.com/in/lindi-le-roux-0b2360164 |
| 324 | **Thinus Le Roux** | Le Roux / Thinus | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 325 | **Rose Leduma** | Leduma / Rose | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | Gauteng/Johannesburg | https://www.linkedin.com/in/rose-leduma-488895214/ |
| 326 | **Dineo Ledwaba** | Ledwaba / Dineo | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Johannesburg Metropolitan Area | https://www.linkedin.com/in/dineo-ledwaba-0b57885a/ |
| 327 | **Mr Lee Xaba** | Lee Xaba / Mr | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/Gauteng | https://www.linkedin.com/in/mr-lee-xaba-1b88142a/ |
| 328 | **Tabisa Liborie Singenile Nkomo** | Liborie Singenile Nkomo / Tabisa | CONFIRMED | ACMA, CGMA | CIMA | WBHO Construction - Cape Division | Johannesburg Metropolitan Area | https://www.linkedin.com/in/tabisa-liborie-singenile-nkomo-cgma®-acma-3932b299/ |
| 329 | **Justin Liebenberg** | Liebenberg / Justin | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | Gauteng/City of Johannesburg | https://www.linkedin.com/in/justin-liebenberg-9154b9108/ |
| 330 | **Naledi Liphapang** | Liphapang / Naledi | HIGH_CONFIDENCE | CA(SA) | SAICA | — | — | — |
| 331 | **James Liston** | Liston / James | CONFIRMED | CA(SA) | SAICA | Mpact | Gauteng/City of Johannesburg | https://www.linkedin.com/in/james-liston-7516b2170/ |
| 332 | **Puleng Litsibane** | Litsibane / Puleng | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Gauteng/Germiston | https://www.linkedin.com/in/puleng-litsibane-a2440955/ |
| 333 | **Francisca Lloyd** | Lloyd / Francisca | FINANCE_ROLE_CONFIRMED | — | — | Macsteel | Gauteng/Benoni | https://www.linkedin.com/in/francisca-lloyd-11434792/ |
| 334 | **Anne-Lize Lochner** | Lochner / Anne-Lize | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/anne-lize-lochner-b3083421/ |
| 335 | **Claire Lofthouse** | Lofthouse / Claire | FINANCE_ROLE_CONFIRMED | — | — | Cape Herb & Spice | Western Cape/Cape Town | https://www.linkedin.com/in/claire-lofthouse/ |
| 336 | **Andrew Logan** | Logan / Andrew | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/City of Johannesburg | https://www.linkedin.com/in/andrew-logan-77011634/ |
| 337 | **Eduard Loubser** | Loubser / Eduard | FINANCE_ROLE_CONFIRMED | — | — | Fair Cape Dairies | Western Cape/City of Cape Town | https://www.linkedin.com/in/eduard-loubser-ca-sa-932778175/ |
| 338 | **Anwer Louw** | Louw / Anwer | FINANCE_ROLE_CONFIRMED | — | — | KWV | Western Cape/Cape Town | https://www.linkedin.com/in/anwer-louw-343009292/ |
| 339 | **Eugene Louw** | Louw / Eugene | FINANCE_ROLE_CONFIRMED | — | — | Kromco | Western Cape/City of Cape Town | https://www.linkedin.com/in/eugene-louw-6ab089b9/ |
| 340 | **Johanita Louw** | Louw / Johanita | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/Cape Town | https://www.linkedin.com/in/johanita-louw-a5538060/ |
| 341 | **Leandré Louw** | Louw / Leandré | FINANCE_ROLE_CONFIRMED | — | — | Kaap Agri / Agrimark | Western Cape/Malmesbury | https://www.linkedin.com/in/leandré-louw-a46350146/ |
| 342 | **Lindi Louw** | Louw / Lindi | FINANCE_ROLE_CONFIRMED | — | — | Stellenbosch Vineyards / Advini South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/lindi-louw-22b42a11a/ |
| 343 | **Suzaan Louw** | Louw / Suzaan | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group | South Africa | https://www.linkedin.com/in/suzaan-louw-49207339/ |
| 344 | **Lizane Lubbe** | Lubbe / Lizane | FINANCE_ROLE_CONFIRMED | — | — | Sentraal-Suid Co-operative (SSK) | Western Cape/Swellendam | https://www.linkedin.com/in/lizane-lubbe-42218b121/ |
| 345 | **Brendon Lucke** | Lucke / Brendon | FINANCE_ROLE_CONFIRMED | — | — | Commercial Cold Holdings | Western Cape/City of Cape Town | https://www.linkedin.com/in/brendon-lucke-01494065/ |
| 346 | **Arline Luiters** | Luiters / Arline | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/arline-luiters-1626bb252/ |
| 347 | **Ewaldi Luus** | Luus / Ewaldi | FINANCE_ROLE_CONFIRMED | — | — | Fair Cape Dairies | Western Cape/Cape Town | https://www.linkedin.com/in/ewaldi-luus-4a06a5212/ |
| 348 | **Jesca M.** | M. / Jesca | FINANCE_ROLE_CONFIRMED | — | — | Premier Fishing & Brands | Western Cape/City of Cape Town | https://www.linkedin.com/in/jescameki/ |
| 349 | **Heinrich Maartens** | Maartens / Heinrich | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Gauteng/City of Johannesburg | https://www.linkedin.com/in/heinrich-maartens-9bb082b9/ |
| 350 | **Mbali Precious Mabaso** | Mabaso / Mbali | CONFIRMED | CA(SA) | SAICA | Nedbank Group Limited | — | — |
| 351 | **Zuko Maboma** | Maboma / Zuko | FINANCE_ROLE_CONFIRMED | — | — | Premier Fishing & Brands | Western Cape/City of Cape Town | https://www.linkedin.com/in/zukomaboma/ |
| 352 | **Rixongile Mabunda** | Mabunda / Rixongile | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Limpopo/Ba-Phalaborwa Local Municipality | https://www.linkedin.com/in/rixongile-mabunda-4a868797/ |
| 353 | **Nthabeleng Machesa** | Machesa / Nthabeleng | FINANCE_ROLE_CONFIRMED | — | — | Ardagh Glass Packaging SA | Johannesburg Metropolitan Area | https://www.linkedin.com/in/nthabeleng-machesa-ca-sa-19999152/ |
| 354 | **Celeste Maclons** | Maclons / Celeste | FINANCE_ROLE_CONFIRMED | — | — | SA Metal Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/celeste-maclons-15a76156/ |
| 355 | **Sinawo Madlingozi** | Madlingozi / Sinawo | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Eastern Cape/Port Elizabeth | https://www.linkedin.com/in/sinawo-madlingozi-03476b150/ |
| 356 | **Zanele Maduna** | Maduna / Zanele | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 357 | **Victor Madziwa** | Madziwa / Victor | FINANCE_ROLE_CONFIRMED | — | — | Tronox Namakwa Sands | Western Cape/Lutzville | https://www.linkedin.com/in/victor-madziwa-384398144/ |
| 358 | **Thembela Mafu** | Mafu / Thembela | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/Pretoria | https://www.linkedin.com/in/thembela-mafu-6a8b4817a/ |
| 359 | **Gillian Magolie** | Magolie / Gillian | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Western Cape/City of Cape Town | https://www.linkedin.com/in/gillian-magolie-05427865/ |
| 360 | **Unathi Magwentshu** | Magwentshu / Unathi | FINANCE_ROLE_CONFIRMED | — | — | Concor | Gauteng/City of Johannesburg | https://www.linkedin.com/in/unathi-magwentshu-aa662834/ |
| 361 | **navin mahabeer** | mahabeer / navin | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/navin-mahabeer-a8b00a26/ |
| 362 | **Nickeel maharaj** | maharaj / Nickeel | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/City of Cape Town | https://www.linkedin.com/in/nickeel-maharaj-a29b12241/ |
| 363 | **Samantha Maharaj** | Maharaj / Samantha | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/samantha-maharaj-6b4730167/ |
| 364 | **Noloyiso Mahlakahlaka-Mhlubulwana** | Mahlakahlaka-Mhlubulwana / Noloyiso | FINANCE_ROLE_CONFIRMED | — | — | Macsteel | Gauteng/City of Johannesburg | https://www.linkedin.com/in/noloyiso-mahlakahlaka-a758128b/ |
| 365 | **Andrew Mahlaku** | Mahlaku / Andrew | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/andrew-mahlaku-a7503336/ |
| 366 | **Kgabiso Mahlangu** | Mahlangu / Kgabiso | CONFIRMED | AGA(SA) | SAICA | South African State Theatre | Gauteng/Pretoria | https://www.linkedin.com/in/kgabiso-mahlangu-aga-sa-b53a951a |
| 367 | **Sindisiwe Mahlangu** | Mahlangu / Sindisiwe | FINANCE_ROLE_CONFIRMED | — | — | DSV | Johannesburg Metropolitan Area | https://www.linkedin.com/in/sindisiwe-mahlangu-72911b13b/ |
| 368 | **willie mahlangu** | mahlangu / willie | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | South Africa | https://www.linkedin.com/in/willie-mahlangu-ab96771b/ |
| 369 | **Zaf Mahomed** | Mahomed / Zaf | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/Cape Town | https://www.linkedin.com/in/zmahomed/ |
| 370 | **Bonga Majozi** | Majozi / Bonga | FINANCE_ROLE_CONFIRMED | — | — | Peninsula Beverages | Western Cape/City of Cape Town | https://www.linkedin.com/in/bonga-majozi-5892b284/ |
| 371 | **Chanelle Makhanya** | Makhanya / Chanelle | FINANCE_ROLE_CONFIRMED | — | — | HEINEKEN Beverages | Gauteng/City of Johannesburg | https://www.linkedin.com/in/chanelle-makhanya-a3652317/ |
| 372 | **Mathabo Makhaya** | Makhaya / Mathabo | CONFIRMED | CA(SA) | SAICA | Harmony Gold Mining | — | — |
| 373 | **Sonwabile Makhesethi** | Makhesethi / Sonwabile | FINANCE_ROLE_CONFIRMED | — | — | Concor | Gauteng/Gauteng | https://www.linkedin.com/in/sonwabile-makhesethi-00b608204/ |
| 374 | **Mpho Makoko-Hottie** | Makoko-Hottie / Mpho | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 375 | **Patricia Malahlela** | Malahlela / Patricia | CONFIRMED | CA(SA) | SAICA | Mckenzie & Associates | — | — |
| 376 | **Fortunate Malaza** | Malaza / Fortunate | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/Gauteng | https://www.linkedin.com/in/fortunate-malaza-759917b1/ |
| 377 | **Nicky Mametja** | Mametja / Nicky | FINANCE_ROLE_CONFIRMED | — | — | Much Asphalt | Western Cape/Cape Town | https://www.linkedin.com/in/nicky-mametja-23b99b191/ |
| 378 | **Tsireledzo Manabela** | Manabela / Tsireledzo | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Stellenbosch | https://www.linkedin.com/in/tsireledzo-manabela-0b4705233/ |
| 379 | **Phineas Manana** | Manana / Phineas | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/Pretoria | https://www.linkedin.com/in/phineas-manana-7bbb5a22b/ |
| 380 | **Manenzhe Manenzhe** | Manenzhe / Manenzhe | CONFIRMED | FCCA | ACCA | ACCA (South Africa) | Gauteng | https://www.linkedin.com/in/manenzhe-manenzhe-fcca-a80079150/ |
| 381 | **Siseko Maninjwa** | Maninjwa / Siseko | FINANCE_ROLE_CONFIRMED | — | — | Ladismith Cheese / Woodlands Dairy Group | Eastern Cape/Port Elizabeth | https://www.linkedin.com/in/siseko-maninjwa-ca-sa-28615b150/ |
| 382 | **Zaid Manjra** | Manjra / Zaid | CONFIRMED | CA(SA) | SAICA | Woolworths Holdings Ltd | Western Cape/Cape Town | — |
| 383 | **Lizo Manyana** | Manyana / Lizo | FINANCE_ROLE_CONFIRMED | — | — | Peninsula Beverages | Western Cape/Cape Town | https://www.linkedin.com/in/lizo-manyana-89b64878/ |
| 384 | **Andisiwe Manzana** | Manzana / Andisiwe | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Gauteng/City of Johannesburg | https://www.linkedin.com/in/andisiwe-manzana-50265627/ |
| 385 | **Sazile Manzini** | Manzini / Sazile | FINANCE_ROLE_CONFIRMED | — | — | Averda South Africa | Gauteng/Johannesburg | https://www.linkedin.com/in/sazile-manzini-24b187127/ |
| 386 | **Orapeleng Maragelo** | Maragelo / Orapeleng | FINANCE_ROLE_CONFIRMED | — | — | AfriSam | Gauteng/City of Johannesburg | https://www.linkedin.com/in/orapeleng-maragelo-8026b191/ |
| 387 | **Veronique MARCOUX** | MARCOUX / Veronique | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Gauteng/Johannesburg | https://www.linkedin.com/in/veronique-marcoux-55599614a/ |
| 388 | **Romy Maree** | Maree / Romy | CONFIRMED | CA(SA) | SAICA | Burstone (Real Estate partners) | — | — |
| 389 | **Wayne Marriday** | Marriday / Wayne | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/City of Cape Town | https://www.linkedin.com/in/wayne-marriday-0300b943/ |
| 390 | **Jody Marthinus** | Marthinus / Jody | FINANCE_ROLE_CONFIRMED | — | — | LANCEWOOD | Western Cape/Mossel Bay | https://www.linkedin.com/in/jody-marthinus-1326ba39/ |
| 391 | **Richard Martin** | Martin / Richard | FINANCE_ROLE_CONFIRMED | — | — | SA Metal Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/richard-martin-475185122/ |
| 392 | **Iaan Marx** | Marx / Iaan | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 393 | **Liziwe Maseloane** | Maseloane / Liziwe | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/Vanderbijlpark | https://www.linkedin.com/in/liziwe-maseloane-10270530a/ |
| 394 | **nomsa mashabela** | mashabela / nomsa | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/Pretoria | https://www.linkedin.com/in/nomsa-mashabela-853195122/ |
| 395 | **Mahosi Mashao** | Mashao / Mahosi | FINANCE_ROLE_CONFIRMED | — | — | AfriSam | — | https://www.linkedin.com/in/mahosi-mashao-77850b33/ |
| 396 | **Phillip Mashao** | Mashao / Phillip | FINANCE_ROLE_CONFIRMED | — | — | AfriSam | Limpopo/Polokwane Local Municipality | https://www.linkedin.com/in/phillip-mashao-72745831a/ |
| 397 | **Thapelo Mashashane** | Mashashane / Thapelo | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/City of Johannesburg | https://www.linkedin.com/in/thapelo-mashashane-493215170/ |
| 398 | **Trevineth Masindi** | Masindi / Trevineth | FINANCE_ROLE_CONFIRMED | — | — | Macsteel | Gauteng/City of Johannesburg | https://www.linkedin.com/in/trevineth-masindi-95605011a/ |
| 399 | **Mfundo Maso** | Maso / Mfundo | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Gauteng/Johannesburg | https://www.linkedin.com/in/mfundo-maso-3559a4234/ |
| 400 | **Glacia Matadin** | Matadin / Glacia | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/glacia-matadin-256aa2b6/ |
| 401 | **Portia Mathebula** | Mathebula / Portia | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | Gauteng/Johannesburg | https://www.linkedin.com/in/portia-mathebula-b6b8281a5/ |
| 402 | **Ofentse Matloha** | Matloha / Ofentse | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/City of Cape Town | https://www.linkedin.com/in/ofentse-matloha-2a3338204/ |
| 403 | **Katlego Matshego** | Matshego / Katlego | HIGH_CONFIDENCE | CA(SA) | SAICA | Independent Institute of Education (IIE) Varsity College / MSA | — | — |
| 404 | **Tiisetso Matsobane** | Matsobane / Tiisetso | FINANCE_ROLE_CONFIRMED | — | — | Libstar | Western Cape/Cape Town | https://www.linkedin.com/in/tiisetso-matsobane-acma-cgma-54b16890/ |
| 405 | **Tshepiso Mavimbela** | Mavimbela / Tshepiso | FINANCE_ROLE_CONFIRMED | — | — | Macsteel | Gauteng/City of Johannesburg | https://www.linkedin.com/in/tshepiso-mavimbela-49a99613a/ |
| 406 | **charlotte Mawela** | Mawela / charlotte | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Gauteng/Boksburg | https://www.linkedin.com/in/charlotte-mawela-0866ba91/ |
| 407 | **Phumelela Mbande** | Mbande / Phumelela | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 408 | **Thobile Mbangeni** | Mbangeni / Thobile | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | Johannesburg Metropolitan Area | https://www.linkedin.com/in/thobile-mbangeni-6baa51141/ |
| 409 | **Athenkosi Mboniswa** | Mboniswa / Athenkosi | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Eastern Cape/Port Elizabeth | https://www.linkedin.com/in/athenkosi-mboniswa-73050b38/ |
| 410 | **Hlayisani Terrent Mboweni** | Mboweni / Hlayisani | HIGH_CONFIDENCE | PA(SA) | SAIPA | Mboweni Accountants | — | — |
| 411 | **Noxolo Mbutho** | Mbutho / Noxolo | FINANCE_ROLE_CONFIRMED | — | — | Mpact | KwaZulu-Natal/Umhlanga | https://www.linkedin.com/in/noxolo-mbutho-16b841115/ |
| 412 | **Michael McAllister (CIMA Adv Dip MA)** | McAllister (CIMA Adv Dip MA) / Michael | FINANCE_ROLE_CONFIRMED | — | — | Interwaste | Gauteng/Johannesburg | https://www.linkedin.com/in/michael-mcallister-cima-adv-dip-ma-33b64484/ |
| 413 | **Trevor McLachlan** | McLachlan / Trevor | HIGH_CONFIDENCE | PA(SA) | SAIPA | McA Inc. | Western Cape/Cape Town | — |
| 414 | **Celeste McLeroth** | McLeroth / Celeste | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/City of Johannesburg | https://www.linkedin.com/in/celeste-mcleroth-4b22541a/ |
| 415 | **Phindile Mcunu** | Mcunu / Phindile | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/phindile-mcunu-036431128/ |
| 416 | **Rendani Mdluli** | Mdluli / Rendani | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/City of Johannesburg | https://www.linkedin.com/in/rendani-mdluli-86898494/ |
| 417 | **Nontobeko Mehlomakhulu** | Mehlomakhulu / Nontobeko | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/City of Cape Town | https://www.linkedin.com/in/nontobeko-mehlomakhulu-7006108/ |
| 418 | **Kaylene Meintjies** | Meintjies / Kaylene | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/kaylene-meintjies-5a04a7123/ |
| 419 | **Zinathi Melamane** | Melamane / Zinathi | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Johannesburg Metropolitan Area | https://www.linkedin.com/in/zinathi-melamane-757a7941/ |
| 420 | **Rieduwaan Meniers** | Meniers / Rieduwaan | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Gauteng/Midrand | https://www.linkedin.com/in/rieduwaan-meniers-90446312a/ |
| 421 | **Kosie Menzangani** | Menzangani / Kosie | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/kosie-menzangani-877a6a7a/ |
| 422 | **Phumulani Menzi Mabena** | Menzi Mabena / Phumulani | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | Gauteng/City of Johannesburg | https://www.linkedin.com/in/phumulani-menzi-mabena-0b696158/ |
| 423 | **Maurice Meyer** | Meyer / Maurice | FINANCE_ROLE_CONFIRMED | — | — | KWV | Western Cape/Cape Town | https://www.linkedin.com/in/maurice-meyer-08545a262/ |
| 424 | **Edgar Meyers** | Meyers / Edgar | FINANCE_ROLE_CONFIRMED | — | — | SA Metal Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/edgar-meyers-12b98864/ |
| 425 | **Aphiwe Mgaleli** | Mgaleli / Aphiwe | FINANCE_ROLE_CONFIRMED | — | — | Cape Herb & Spice | Western Cape/Cape Town | https://www.linkedin.com/in/aphiwemgaleli/ |
| 426 | **Thobile Mgenge Otobor** | Mgenge Otobor / Thobile | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/thobile-mgenge-otobor-acma-cgma-mip-4593818a/ |
| 427 | **Lee-Roy Middleton** | Middleton / Lee-Roy | FINANCE_ROLE_CONFIRMED | — | — | Kaap Agri / Agrimark | Western Cape/Cape Town | https://www.linkedin.com/in/lee-roy-middleton-19346446/ |
| 428 | **Carli Mills** | Mills / Carli | FINANCE_ROLE_CONFIRMED | — | — | Fruitways | South Africa | https://www.linkedin.com/in/carli-mills-b8b3a5115/ |
| 429 | **Mangaliso Mithi** | Mithi / Mangaliso | CONFIRMED | FCMA, CGMA | CIMA | — | Gauteng/Johannesburg | https://www.linkedin.com/in/mangalisomithi/ |
| 430 | **thobile mkhabela** | mkhabela / thobile | FINANCE_ROLE_CONFIRMED | — | — | Raubex / Roadmac Surfacing Cape | Mpumalanga/Nelspruit | https://www.linkedin.com/in/thobile-mkhabela-a575a790/ |
| 431 | **Sikelela Mkungeki** | Mkungeki / Sikelela | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/Cape Town | https://www.linkedin.com/in/sikelela-mkungeki-25a37372/ |
| 432 | **Gcina Mlambo** | Mlambo / Gcina | FINANCE_ROLE_CONFIRMED | — | — | PPC | Gauteng/City of Johannesburg | https://www.linkedin.com/in/gcina-mlambo-582643120/ |
| 433 | **Siphesihle Mlangeni** | Mlangeni / Siphesihle | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 434 | **Precious Moagi** | Moagi / Precious | FINANCE_ROLE_CONFIRMED | — | — | AfriSam | Gauteng/Meredale | https://www.linkedin.com/in/precious-moagi-a3b41b278/ |
| 435 | **Seragi Mogano,** | Mogano, / Seragi | FINANCE_ROLE_CONFIRMED | — | — | Tronox Namakwa Sands | Western Cape/Cape Town | https://www.linkedin.com/in/seragi-mogano-cima-cert-ba-452826a3/ |
| 436 | **Mpolaheng Mohlopi** | Mohlopi / Mpolaheng | CONFIRMED | CA(SA) | SAICA | Lanseria International Airport | Gauteng/Lanseria | — |
| 437 | **Goitsemang Mokaila** | Mokaila / Goitsemang | FINANCE_ROLE_CONFIRMED | — | — | HEINEKEN Beverages | Johannesburg Metropolitan Area | https://www.linkedin.com/in/goitsemang-mokaila-4a417362/ |
| 438 | **Tumi Mokgoko** | Mokgoko / Tumi | CONFIRMED | CA(SA) | SAICA | KPMG | — | — |
| 439 | **Kelebogile Mokhine** | Mokhine / Kelebogile | FINANCE_ROLE_CONFIRMED | — | — | Averda South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/kelebogile-mokhine-407b2b137/ |
| 440 | **Bonga Mokoena** | Mokoena / Bonga | CONFIRMED | CA(SA) | SAICA | BDO South Africa | Gauteng/Johannesburg | — |
| 441 | **Palesa Mokoena** | Mokoena / Palesa | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Gauteng/Pretoria | https://www.linkedin.com/in/palesa-mokoena-b74573127/ |
| 442 | **Phuti Mokoka** | Mokoka / Phuti | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | South Africa | https://www.linkedin.com/in/phuti-mokoka-81b22a9b/ |
| 443 | **Pumla Molope** | Molope / Pumla | CONFIRMED | CA(SA) | SAICA | African Women Chartered Accountants (AWCA) | — | — |
| 444 | **Katlego Molopyane** | Molopyane / Katlego | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Gauteng/City of Johannesburg | https://www.linkedin.com/in/katlego-molopyane-ca-sa-b6a87b59/ |
| 445 | **Chrissie Moloseni** | Moloseni / Chrissie | CONFIRMED | CGMA | CIMA | PPC | Gauteng/Johannesburg | https://www.linkedin.com/in/chrissie-moloseni-bacc-mba-cgma-35787746/ |
| 446 | **Louise Moodley** | Moodley / Louise | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Gauteng/Roodepoort | https://www.linkedin.com/in/louise-moodley-0014283b1/ |
| 447 | **Mpho Mookapele** | Mookapele / Mpho | CONFIRMED | CA(SA) | SAICA | Energy and Water Sector Education and Training Authority (EWSETA) | — | — |
| 448 | **Karli Moore** | Moore / Karli | CONFIRMED | CA(SA) | SAICA | Afrimat | Western Cape/Cape Town | https://www.linkedin.com/in/karli-moore-ca-sa-24349b204/ |
| 449 | **Mmakgotso Mopeli** | Mopeli / Mmakgotso | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Stellenbosch | https://www.linkedin.com/in/mmakgotso-mopeli-140137223/ |
| 450 | **Nompi Morajane** | Morajane / Nompi | CONFIRMED | CA(SA) | SAICA | PPC | Gauteng/Johannesburg | https://www.linkedin.com/in/nompi-morajane-ca-sa-778a34b5/ |
| 451 | **Matselane Motaung** | Motaung / Matselane | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/matselane-motaung-7780a215/ |
| 452 | **Vincent Motholo** | Motholo / Vincent | CONFIRMED | CA(SA) | SAICA | University of Cape Town | Western Cape/Cape Town | https://www.linkedin.com/in/vincent-motholo-ca-sa-842b7613/ |
| 453 | **Thabang Mothuki** | Mothuki / Thabang | FINANCE_ROLE_CONFIRMED | — | — | Ardagh Glass Packaging SA | Gauteng/City of Johannesburg | https://www.linkedin.com/in/thabang-mothuki-8ab4a1a4/ |
| 454 | **Victor Motsamai Madziwa** | Motsamai Madziwa / Victor | FINANCE_ROLE_CONFIRMED | — | — | Tronox Namakwa Sands | South Africa | https://www.linkedin.com/in/victor-madziwa-98152a1b/ |
| 455 | **Nathaly Mouton** | Mouton / Nathaly | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/nathaly-mouton-424a5952/ |
| 456 | **virginia mouton** | mouton / virginia | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Western Cape/City of Cape Town | https://www.linkedin.com/in/virginia-mouton-33097271/ |
| 457 | **Leevas Moyana** | Moyana / Leevas | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/City of Cape Town | https://www.linkedin.com/in/leevas-moyana-49343059/ |
| 458 | **Sinazo Mpama** | Mpama / Sinazo | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Gauteng/City of Johannesburg | https://www.linkedin.com/in/sinazo-mpama-42bb4b109/ |
| 459 | **Vusi Mpofu** | Mpofu / Vusi | CONFIRMED | AGA(SA) | SAICA | Nedbank | — | — |
| 460 | **Owethu Msabane** | Msabane / Owethu | FINANCE_ROLE_CONFIRMED | — | — | Ardagh Glass Packaging SA | Germiston Metropolitan Area | https://www.linkedin.com/in/owethu-msabane-b903a184/ |
| 461 | **Zine Mshengu** | Mshengu / Zine | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 462 | **Ayanda Msomi** | Msomi / Ayanda | CONFIRMED | CA(SA) | SAICA | Concor | Gauteng/City of Johannesburg | https://www.linkedin.com/in/ayanda-msomi-2446b615a/ |
| 463 | **Chwayita Mtebele** | Mtebele / Chwayita | CONFIRMED | CA(SA) | SAICA | Financial Sector Conduct Authority (FSCA) | — | — |
| 464 | **Sifiso Mthethwa** | Mthethwa / Sifiso | FINANCE_ROLE_CONFIRMED | — | — | PPC | Gauteng/City of Johannesburg | https://www.linkedin.com/in/sifiso-mthethwa-005024b4/ |
| 465 | **Siyabonga Mthethwa** | Mthethwa / Siyabonga | CONFIRMED | AGA(SA) | SAICA | Tronox Namakwa Sands | KwaZulu-Natal/KwaZulu-Natal | https://www.linkedin.com/in/siyabonga-mthethwa-aga-sa-152923194/ |
| 466 | **Sivuyisiwe Mtshaka** | Mtshaka / Sivuyisiwe | FINANCE_ROLE_CONFIRMED | — | — | I&J | Western Cape/City of Cape Town | https://www.linkedin.com/in/sivuyisiwe-mtshaka-361ba817b/ |
| 467 | **precious mulaudzi** | mulaudzi / precious | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/precious-mulaudzi-a5b9a5129/ |
| 468 | **Khanyisile Mumakwe** | Mumakwe / Khanyisile | FINANCE_ROLE_CONFIRMED | — | — | Macsteel | Gauteng/City of Johannesburg | https://www.linkedin.com/in/khanyisile-mumakwe-680b95120/ |
| 469 | **Ellaine Mundie - Michael** | Mundie - Michael / Ellaine | FINANCE_ROLE_CONFIRMED | — | — | DSV | South Africa | https://www.linkedin.com/in/ellaine-mundie-michael-b205b343/ |
| 470 | **Jody Munnik** | Munnik / Jody | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/Cape Town | https://www.linkedin.com/in/jody-munnik-9b5215219/ |
| 471 | **Tariro Mutizwa** | Mutizwa / Tariro | CONFIRMED | ACMA, CGMA | CIMA | AICPA & CIMA (CIMA Africa) | — | — |
| 472 | **shudufhadzo mutshutshu** | mutshutshu / shudufhadzo | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | Gauteng/City of Johannesburg | https://www.linkedin.com/in/shudufhadzo-mutshutshu-58566a46/ |
| 473 | **Sandisiwe Myekwa nee Booi** | Myekwa nee Booi / Sandisiwe | FINANCE_ROLE_CONFIRMED | — | — | Premier Fishing & Brands | Western Cape/Cape Town | https://www.linkedin.com/in/sandisiwe-myekwa-nee-booi-aga-sa-034740211/ |
| 474 | **Pilot Mzimba** | Mzimba / Pilot | FINANCE_ROLE_CONFIRMED | — | — | Interwaste | Gauteng/Johannesburg | https://www.linkedin.com/in/pilot-mzimba-91a7051b/ |
| 475 | **Sokhuthu Mziwoluntu** | Mziwoluntu / Sokhuthu | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/Mossel Bay | https://www.linkedin.com/in/sokhuthu-mziwoluntu-01468453/ |
| 476 | **Megan N.** | N. / Megan | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | Gauteng/City of Johannesburg | https://www.linkedin.com/in/megan-n-83b663138/ |
| 477 | **Ritesh Nagar** | Nagar / Ritesh | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/City of Johannesburg | https://www.linkedin.com/in/ritesh-nagar-22866b45/ |
| 478 | **Thiru Naicker** | Naicker / Thiru | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Western Cape/Western Cape | https://www.linkedin.com/in/thiru-naicker-ca-sa-16574024/ |
| 479 | **Aneshree Naidoo** | Naidoo / Aneshree | CONFIRMED | CA(SA) | SAICA | Webber Wentzel | — | — |
| 480 | **Kalnisha Naidoo** | Naidoo / Kalnisha | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Stellenbosch | https://www.linkedin.com/in/kalnisha-naidoo-965523101/ |
| 481 | **Kathie Naidoo** | Naidoo / Kathie | FINANCE_ROLE_CONFIRMED | — | — | Chryso Southern Africa | Gauteng/City of Johannesburg | https://www.linkedin.com/in/kathie-naidoo-30701997/ |
| 482 | **Talisa Naidoo** | Naidoo / Talisa | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/talisa-naidoo-ca-sa-328533342/ |
| 483 | **Thenashree Naidoo** | Naidoo / Thenashree | HIGH_CONFIDENCE | CA(SA) | SAICA | Durban ICC | KwaZulu-Natal/Durban | — |
| 484 | **Ziyaad Nakidien** | Nakidien / Ziyaad | FINANCE_ROLE_CONFIRMED | — | — | Capespan South Africa | Western Cape/Western Cape | https://www.linkedin.com/in/ziyaad-nakidien-166b86170/ |
| 485 | **Caroline Narrainsamy(Pillay)** | Narrainsamy(Pillay) / Caroline | FINANCE_ROLE_CONFIRMED | — | — | Tronox Namakwa Sands | KwaZulu-Natal/KwaZulu-Natal | https://www.linkedin.com/in/caroline-narrainsamy-pillay-448271174/ |
| 486 | **Pranesh Narshi** | Narshi / Pranesh | FINANCE_ROLE_CONFIRMED | — | — | Interwaste | Western Cape/Cape Town | https://www.linkedin.com/in/pranesh-narshi-433b16365/ |
| 487 | **Horstmann Natasha** | Natasha / Horstmann | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/horstmann-natasha-aa92a090/ |
| 488 | **Gugu Ncala** | Ncala / Gugu | FINANCE_ROLE_CONFIRMED | — | — | Concor | Gauteng/City of Johannesburg | https://www.linkedin.com/in/gugu-ncala-8955b374/ |
| 489 | **Amahle Ndindi** | Ndindi / Amahle | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/amahle-ndindi-855541215/ |
| 490 | **Busi Ndlovu** | Ndlovu / Busi | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/City of Cape Town | https://www.linkedin.com/in/busi-ndlovu-6b21b263/ |
| 491 | **Netshia Nduvho** | Nduvho / Netshia | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Gauteng/Kempton Park | https://www.linkedin.com/in/netshia-nduvho-02547b293/ |
| 492 | **Andiswa Ndwalane** | Ndwalane / Andiswa | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | South Africa | https://www.linkedin.com/in/andiswa-ndwalane-66492821a/ |
| 493 | **Déhan Nel** | Nel / Déhan | FINANCE_ROLE_CONFIRMED | — | — | LANCEWOOD | Western Cape/George | https://www.linkedin.com/in/déhan-nel-ca-sa-b4b49920a/ |
| 494 | **Louis Nel** | Nel / Louis | FINANCE_ROLE_CONFIRMED | — | — | Tru-Cape Fruit Marketing | South Africa | https://www.linkedin.com/in/louis-nel-204935a6/ |
| 495 | **Melisa Nel** | Nel / Melisa | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Western Cape/Cape Town | https://www.linkedin.com/in/melisa-nel-b73751239/ |
| 496 | **Nastassja Nel** | Nel / Nastassja | CONFIRMED | AGA(SA) | SAICA | Schoemans Registered Auditors and Chartered Accountants | Western Cape/Cape Town | https://www.linkedin.com/in/nastassja-nel-71a15364/ |
| 497 | **Leonie Nell** | Nell / Leonie | FINANCE_ROLE_CONFIRMED | — | — | LANCEWOOD | Western Cape/George | https://www.linkedin.com/in/leonie-nell-412a12284/ |
| 498 | **Wilhelm Nell** | Nell / Wilhelm | FINANCE_ROLE_CONFIRMED | — | — | Fair Cape Dairies | Western Cape/Durbanville | https://www.linkedin.com/in/wilhelm-nell-867aa0104/ |
| 499 | **Karabo Neluheni** | Neluheni / Karabo | FINANCE_ROLE_CONFIRMED | — | — | EnviroServ | Gauteng/Johannesburg | https://www.linkedin.com/in/karabo-neluheni-ca-sa-26285529/ |
| 500 | **Linda Nene (FIIASA,CRMA,CCSA,CPrac(SA))** | Nene (FIIASA,CRMA,CCSA,CPrac(SA)) / Linda | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | South Africa | https://www.linkedin.com/in/linda-nene-fiiasa-crma-ccsa-cprac-sa-91911827/ |
| 501 | **Aviwe Ngcawuzele** | Ngcawuzele / Aviwe | FINANCE_ROLE_CONFIRMED | — | — | I&J | Western Cape/City of Cape Town | https://www.linkedin.com/in/aviwe-ngcawuzele-1a25aa133/ |
| 502 | **Qaqamba Ngcawuzele** | Ngcawuzele / Qaqamba | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/City of Cape Town | https://www.linkedin.com/in/qaqamba-ngcawuzele-151569146/ |
| 503 | **Njabulo Ngcobo** | Ngcobo / Njabulo | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | Gauteng/City of Johannesburg | https://www.linkedin.com/in/njabulo-ngcobo/ |
| 504 | **Kulani Ngobeni** | Ngobeni / Kulani | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Johannesburg Metropolitan Area | https://www.linkedin.com/in/kulani-ngobeni-503b7790/ |
| 505 | **Mitterand Ngoy** | Ngoy / Mitterand | FINANCE_ROLE_CONFIRMED | — | — | Averda South Africa | Gauteng/Johannesburg | https://www.linkedin.com/in/mitterand-ngoy-66ba2828b/ |
| 506 | **Lindokuhle Ngqobane** | Ngqobane / Lindokuhle | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/Western Cape | https://www.linkedin.com/in/lindokuhle-ngqobane-221782159/ |
| 507 | **Thabang Ngwenya** | Ngwenya / Thabang | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | Gauteng/City of Johannesburg | https://www.linkedin.com/in/thabang-ngwenya-b80172101/ |
| 508 | **Nkosinathi Nicholus Mabuza** | Nicholus Mabuza / Nkosinathi | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/City of Johannesburg | https://www.linkedin.com/in/nkosinathi-nicholus-mabuza-a6095266/ |
| 509 | **Markus NIEUWOUDT CMILT, MCTP(SA), Compliance Practitioner** | NIEUWOUDT CMILT, MCTP(SA), Compliance Practitioner / Markus | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/Johannesburg | https://www.linkedin.com/in/markus-nieuwoudt-cmilt-mctp-sa-compliance-practitioner-625798321/ |
| 510 | **Relebohile Nkojoana** | Nkojoana / Relebohile | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Johannesburg Metropolitan Area | https://www.linkedin.com/in/relebohile/ |
| 511 | **Ande Nkontso** | Nkontso / Ande | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/ande-nkontso-606504196/ |
| 512 | **Luyanda Nkonyane** | Nkonyane / Luyanda | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Gauteng/Gauteng | https://www.linkedin.com/in/luyanda-nkonyane-ba648185/ |
| 513 | **Absay Nkosi** | Nkosi / Absay | FINANCE_ROLE_CONFIRMED | — | — | Concor | Gauteng/City of Johannesburg | https://www.linkedin.com/in/absay-nkosi-b47b3511a/ |
| 514 | **Delani Nkosi** | Nkosi / Delani | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/delani-nkosi-ab502676/ |
| 515 | **Dianne Noake** | Noake / Dianne | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/Benoni | https://www.linkedin.com/in/dianne-noake-b153669a/ |
| 516 | **Sanele Nodume** | Nodume / Sanele | CONFIRMED | CA(SA) | SAICA | Astron Energy | Western Cape/Cape Town | https://www.linkedin.com/in/sanele-nodume-ca-sa-36034622b/ |
| 517 | **Nolwazi Nokuthula Nkabinde** | Nokuthula Nkabinde / Nolwazi | FINANCE_ROLE_CONFIRMED | — | — | DGB | Gauteng/City of Johannesburg | https://www.linkedin.com/in/nolwazi-nokuthula-nkabinde-9035251a3/ |
| 518 | **Msutwana NOLUVO** | NOLUVO / Msutwana | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | South Africa | https://www.linkedin.com/in/msutwana-noluvo-0750a263/ |
| 519 | **Buhle Hanise Nomabunga** | Nomabunga / Buhle | CONFIRMED | CA(SA) | SAICA | BAIC (South Africa) | — | — |
| 520 | **Sithole Nonsikelelo** | Nonsikelelo / Sithole | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/City of Cape Town | https://www.linkedin.com/in/sithole-nonsikelelo-1b881a54/ |
| 521 | **Busisiwe Ntombifikile Mkhize** | Ntombifikile Mkhize / Busisiwe | FINANCE_ROLE_CONFIRMED | — | — | Macsteel | KwaZulu-Natal/Durban | https://www.linkedin.com/in/busisiwe-ntombifikile-mkhize-92106646/ |
| 522 | **faith ntshingila** | ntshingila / faith | FINANCE_ROLE_CONFIRMED | — | — | DGB | Gauteng/City of Johannesburg | https://www.linkedin.com/in/faith-ntshingila-642900125/ |
| 523 | **Anele Ntsinde** | Ntsinde / Anele | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/City of Johannesburg | https://www.linkedin.com/in/anele-ntsinde-9b6a51a3/ |
| 524 | **Zizipho Nyanga** | Nyanga / Zizipho | CONFIRMED | CA(SA) | SAICA | Masisizane Fund (Old Mutual) | — | — |
| 525 | **Jabulile Nyathi** | Nyathi / Jabulile | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 526 | **Linda Nyirenda (ACMA** | Nyirenda (ACMA / Linda | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | Gauteng/City of Johannesburg | https://www.linkedin.com/in/linda-nyirenda-acma-cgma-5ab7ba15a/ |
| 527 | **Phila Nyoka** | Nyoka / Phila | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Gauteng/Gauteng | https://www.linkedin.com/in/phila-nyoka-88a416213/ |
| 528 | **Desire October** | October / Desire | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/desire-october-517967181/ |
| 529 | **Henk Odendaal** | Odendaal / Henk | FINANCE_ROLE_CONFIRMED | — | — | Fruitways | Western Cape/City of Cape Town | https://www.linkedin.com/in/henk-odendaal-ca-sa-92b86887/ |
| 530 | **Liezel Odendaal** | Odendaal / Liezel | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/Boksburg | https://www.linkedin.com/in/liezel-odendaal-571314225/ |
| 531 | **Crystal Okkers** | Okkers / Crystal | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/crystal-okkers-71482174/ |
| 532 | **Samantha Olifant** | Olifant / Samantha | FINANCE_ROLE_CONFIRMED | — | — | Interwaste | South Africa | https://www.linkedin.com/in/samantha-olifant-5b2a34b5/ |
| 533 | **Nelia Oosthuizen** | Oosthuizen / Nelia | FINANCE_ROLE_CONFIRMED | — | — | Mpact | KwaZulu-Natal/KwaZulu-Natal | https://www.linkedin.com/in/nelia-oosthuizen-6a532841/ |
| 534 | **Quintin Oosthuizen** | Oosthuizen / Quintin | CONFIRMED | CA(SA) | SAICA | Haw & Inglis | Western Cape/City of Cape Town | — |
| 535 | **Beryl Ownhouse** | Ownhouse / Beryl | FINANCE_ROLE_CONFIRMED | — | — | PPC | Eastern Cape/Port Elizabeth | https://www.linkedin.com/in/beryl-ownhouse-944436341/ |
| 536 | **Shalin P.** | P. / Shalin | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Johannesburg Metropolitan Area | https://www.linkedin.com/in/shalinpatel-/ |
| 537 | **Velashnie Padayachee** | Padayachee / Velashnie | FINANCE_ROLE_CONFIRMED | — | — | Chryso Southern Africa | South Africa | https://www.linkedin.com/in/velashnie-padayachee-aa569b86/ |
| 538 | **Ramon Padayachi** | Padayachi / Ramon | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/Cape Town | https://www.linkedin.com/in/ramon-padayachi-64b07a10/ |
| 539 | **Karlien Panter** | Panter / Karlien | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Mpumalanga/Nelspruit | https://www.linkedin.com/in/karlien-panter-55bb46117/ |
| 540 | **Emma Pardoe** | Pardoe / Emma | CONFIRMED | CA(SA) | SAICA | Emma Pardoe Chartered Accountants (SA) | Western Cape/Somerset West | https://www.linkedin.com/in/emmapardoe/ |
| 541 | **Junaid Parker** | Parker / Junaid | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/junaid-parker-b67032135/ |
| 542 | **Sylwia Parzuchowski** | Parzuchowski / Sylwia | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/sylwia-parzuchowski-24b69b80/ |
| 543 | **Anisah Patel** | Patel / Anisah | CONFIRMED | CA(SA) | SAICA | Own practice (Vereeniging) | Gauteng/Vereeniging | — |
| 544 | **Safiyah Patel** | Patel / Safiyah | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Port Elizabeth Metropolitan Area | https://www.linkedin.com/in/safiyah-patel-575910193/ |
| 545 | **Tierney Paul** | Paul / Tierney | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/tierney-paul-3974b1152/ |
| 546 | **Mellissa Pearce (née Ryder)** | Pearce (née Ryder) / Mellissa | FINANCE_ROLE_CONFIRMED | — | — | Cape Herb & Spice | Western Cape/Cape Town | https://www.linkedin.com/in/mellissa-pearce-nèe-ryder-88123b68/ |
| 547 | **Brett Penney** | Penney / Brett | CONFIRMED | CA(SA) | SAICA | Sika South Africa | KwaZulu-Natal/eThekwini | https://za.linkedin.com/in/brett-penney-7821aa10a |
| 548 | **Jonathan Petley** | Petley / Jonathan | FINANCE_ROLE_CONFIRMED | — | — | Betko Fresh Produce | Western Cape/Somerset West | https://www.linkedin.com/in/jonathan-petley-671363a3/ |
| 549 | **Kefiloe Petunia Mashinini** | Petunia Mashinini / Kefiloe | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Gauteng/City of Johannesburg | https://www.linkedin.com/in/kefie-mashinini-b8336023/ |
| 550 | **Shaun Peypers** | Peypers / Shaun | FINANCE_ROLE_CONFIRMED | — | — | Cape Herb & Spice | Western Cape/Cape Town | https://www.linkedin.com/in/shaun-peypers-0200a564/ |
| 551 | **BRENDA PHASHA** | PHASHA / BRENDA | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Johannesburg Metropolitan Area | https://www.linkedin.com/in/brenda-phasha-44bba61a1/ |
| 552 | **Lunga Phewa** | Phewa / Lunga | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Gauteng/City of Johannesburg | https://www.linkedin.com/in/lunga-phewa-36a6839a/ |
| 553 | **Monique Pienaar (neé du Toit)** | Pienaar (neé du Toit) / Monique | FINANCE_ROLE_CONFIRMED | — | — | Overberg Agri | Western Cape/Hermanus | https://www.linkedin.com/in/monique-pienaar-neé-du-toit-90875b110/ |
| 554 | **JD Pienaar** | Pienaar / JD | FINANCE_ROLE_CONFIRMED | — | — | Kaap Agri / Agrimark | Western Cape/City of Cape Town | https://www.linkedin.com/in/jd-pienaar-9a5943b8/ |
| 555 | **Juan Pierre van der Westhuizen** | Pierre van der Westhuizen / Juan | FINANCE_ROLE_CONFIRMED | — | — | Excellent Meat Group | Western Cape/Western Cape | https://za.linkedin.com/in/juan-pierre-van-der-westhuizen-784834215 |
| 556 | **Esther Pieterse** | Pieterse / Esther | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 557 | **Kershnee Pillay Reddy** | Pillay Reddy / Kershnee | CONFIRMED | CA(SA) | SAICA | PPC | Gauteng/City of Johannesburg | https://www.linkedin.com/in/kershnee-reddy-ca-sa-b532004b/ |
| 558 | **steven pillay** | pillay / steven | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/steven-pillay-0a584230/ |
| 559 | **Youlanda Pillay** | Pillay / Youlanda | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/youlanda-pillay-3888a644/ |
| 560 | **Rethabile Pindani** | Pindani / Rethabile | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/rethabile-pindani-722913170/ |
| 561 | **Liantie Pitchers** | Pitchers / Liantie | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Mpumalanga/Nelspruit | https://www.linkedin.com/in/liantie-pitchers-55427a113/ |
| 562 | **Alice Polinyane** | Polinyane / Alice | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Gauteng/City of Johannesburg | https://www.linkedin.com/in/alice-polinyane-617580167/ |
| 563 | **Jan Potgieter** | Potgieter / Jan | HIGH_CONFIDENCE | CA(SA) | SAICA | TFG Limited (The Foschini Group) | — | — |
| 564 | **Reosha Premduth** | Premduth / Reosha | CONFIRMED | AGA(SA) | SAICA | Afrimat | Western Cape/Cape Town | https://www.linkedin.com/in/reosha-premduth-aga-sa-3a0b4b193/ |
| 565 | **Karonien Pretorius** | Pretorius / Karonien | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | — | https://www.linkedin.com/in/karonien-pretorius-8543ab143/ |
| 566 | **Susan Prinsloo** | Prinsloo / Susan | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/susan-prinsloo-74978243/ |
| 567 | **Amith Prithipaul** | Prithipaul / Amith | FINANCE_ROLE_CONFIRMED | — | — | Corobrik Lansdowne | KwaZulu-Natal/Durban | https://www.linkedin.com/in/amith-prithipaul-70a49766/ |
| 568 | **Amanda Punt** | Punt / Amanda | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/City of Johannesburg | https://www.linkedin.com/in/amanda-punt-472b54100/ |
| 569 | **fani puthini** | puthini / fani | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/Alberton | https://www.linkedin.com/in/fani-puthini-987a2b25b/ |
| 570 | **Charne Putter** | Putter / Charne | FINANCE_ROLE_CONFIRMED | — | — | Libstar | Western Cape/Cape Town | https://www.linkedin.com/in/charne-putter-ca-sa-0aa85aa5/ |
| 571 | **Siziphiwe Qayiso** | Qayiso / Siziphiwe | FINANCE_ROLE_CONFIRMED | — | — | Southern Oil (SOILL) | Western Cape/Cape Town | https://www.linkedin.com/in/siziphiwe-qayiso-80a4ab1a2/ |
| 572 | **Ayaduma Qonono** | Qonono / Ayaduma | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/City of Cape Town | https://www.linkedin.com/in/ayaduma-qonono-1a6387340/ |
| 573 | **Diana Quintero Ruiz    (MBA)** | Quintero Ruiz (MBA) / Diana | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/diana-quintero-ruiz-mba-b1b30811/ |
| 574 | **Lynn Radcliffe** | Radcliffe / Lynn | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/lynn-radcliffe-32271959/ |
| 575 | **Vincent Radebe GTP(SA)** | Radebe GTP(SA) / Vincent | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Johannesburg Metropolitan Area | https://www.linkedin.com/in/vincent-radebe-gtp-sa-04016624/ |
| 576 | **Prudence Radebe** | Radebe / Prudence | FINANCE_ROLE_CONFIRMED | — | — | AfriSam | — | https://www.linkedin.com/in/prudence-radebe-906410116/ |
| 577 | **Tlhologelo Radebe** | Radebe / Tlhologelo | FINANCE_ROLE_CONFIRMED | — | — | Concor | Gauteng/Springs | https://www.linkedin.com/in/tlhologeloradebe/ |
| 578 | **Firaz Rahman** | Rahman / Firaz | FINANCE_ROLE_CONFIRMED | — | — | RFG Foods | Western Cape/City of Cape Town | https://www.linkedin.com/in/firaz-rahman-ca-sa-b4117a8a/ |
| 579 | **Aishwarya Rajkoomar** | Rajkoomar / Aishwarya | FINANCE_ROLE_CONFIRMED | — | — | Ardagh Glass Packaging SA | Gauteng/City of Johannesburg | https://www.linkedin.com/in/aishwarya-rajkoomar-3737a0128/ |
| 580 | **Taryn Raju** | Raju / Taryn | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 581 | **Florence Ramabina** | Ramabina / Florence | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/Clayville | https://www.linkedin.com/in/florence-ramabina-241785203/ |
| 582 | **Raymond Ramokgaba** | Ramokgaba / Raymond | FINANCE_ROLE_CONFIRMED | — | — | NJR Steel | Gauteng/City of Johannesburg | https://www.linkedin.com/in/raymond-ramokgaba-19b14019/ |
| 583 | **Shamima Ranchod** | Ranchod / Shamima | FINANCE_ROLE_CONFIRMED | — | — | AfriSam | Gauteng/City of Johannesburg | https://www.linkedin.com/in/shamima-ranchod-861274114/ |
| 584 | **Shikhaar Ravidas** | Ravidas / Shikhaar | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/shikhaar-ravidas-ca-sa-688b02141/ |
| 585 | **Siyanda Rayi Nameka** | Rayi Nameka / Siyanda | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Western Cape/City of Cape Town | https://www.linkedin.com/in/siyanda-rayi-nameka-393a1999/ |
| 586 | **Lenica Reddy** | Reddy / Lenica | FINANCE_ROLE_CONFIRMED | — | — | Chryso Southern Africa | Gauteng/City of Johannesburg | https://www.linkedin.com/in/lenica-reddy-13253a9b/ |
| 587 | **Ciara Reintjes** | Reintjes / Ciara | CONFIRMED | CA(SA) | SAICA | SAICA | — | — |
| 588 | **Chantelle Reyerse** | Reyerse / Chantelle | FINANCE_ROLE_CONFIRMED | — | — | Dutoit Agri | Gauteng/Roodepoort | https://www.linkedin.com/in/chantelle-reyerse-2124ba59/ |
| 589 | **Vanessa Rheeder** | Rheeder / Vanessa | CONFIRMED | CA(SA) | SAICA | The Modern CFO | Western Cape/Cape Town | https://www.linkedin.com/in/vanessa-rheeder-ca-sa/ |
| 590 | **Dave Rich** | Rich / Dave | CONFIRMED | CA(SA) | SAICA | Streets Chartered Accountants (Cape Town) | Western Cape/Cape Town | — |
| 591 | **GJ Richter** | Richter / GJ | FINANCE_ROLE_CONFIRMED | — | — | Namaqua Wines | Gauteng/Pretoria | https://www.linkedin.com/in/gj-richter-8856a9125/ |
| 592 | **Kyle Ringquest** | Ringquest / Kyle | FINANCE_ROLE_CONFIRMED | — | — | De Hoop Steenwerwe | Western Cape/Cape Town | https://www.linkedin.com/in/kyle-ringquest-9109501a3/ |
| 593 | **Alan Robbins** | Robbins / Alan | ARTICLES_CONFIRMED_DESIGNATION_UNVERIFIED | — | — | Sable International | Western Cape/Cape Town | — |
| 594 | **Antonio Roberts** | Roberts / Antonio | FINANCE_ROLE_CONFIRMED | — | — | KWV | Western Cape/City of Cape Town | https://www.linkedin.com/in/antonio-roberts/ |
| 595 | **Hanna Robertson** | Robertson / Hanna | FINANCE_ROLE_CONFIRMED | — | — | DGB | Western Cape/City of Cape Town | https://www.linkedin.com/in/hanna-robertson-66993592/ |
| 596 | **Nadine Robus Littleford** | Robus Littleford / Nadine | FINANCE_ROLE_CONFIRMED | — | — | Mpact | South Africa | https://www.linkedin.com/in/nadine-robus-hill-8a162877/ |
| 597 | **Lynette Roeloffze** | Roeloffze / Lynette | CONFIRMED | CA(SA) | SAICA | Forvis Mazars Group | Gauteng/Johannesburg | https://www.linkedin.com/in/lynette-roeloffze-ca-sa-ra-0637aa13/ |
| 598 | **Freeman-Garnatt Ronell** | Ronell / Freeman-Garnatt | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/City of Cape Town | https://www.linkedin.com/in/freeman-garnatt-ronell-530a9396/ |
| 599 | **Bianca Roos** | Roos / Bianca | CONFIRMED | CA(SA) | SAICA | PKF Octagon | — | — |
| 600 | **Marnus Roothman** | Roothman / Marnus | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/Pretoria | https://www.linkedin.com/in/marnus-roothman-31a59aa0/ |
| 601 | **Roz Roseline** | Roseline / Roz | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/Rand West City | https://www.linkedin.com/in/roz-roseline-a5353427/ |
| 602 | **Sydney Rudzani** | Rudzani / Sydney | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group | South Africa | https://www.linkedin.com/in/sydney-rudzani-ca-sa-mba-cum-laude-acma-cgma-19658a96/ |
| 603 | **Alexis Sacks** | Sacks / Alexis | CONFIRMED | CA(SA) | SAICA | Streets Chartered Accountants (Cape Town) | Western Cape/Cape Town | — |
| 604 | **Hishaam Salie** | Salie / Hishaam | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/hishaam-salie-44726b3a/ |
| 605 | **Gadija Samaai** | Samaai / Gadija | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group | Western Cape/Paarl | https://www.linkedin.com/in/gadija-samaai-ab427a98/ |
| 606 | **Junaid Samad** | Samad / Junaid | FINANCE_ROLE_CONFIRMED | — | — | Ardagh Glass Packaging SA | Gauteng/City of Johannesburg | https://www.linkedin.com/in/junaid-samad-1b788540/ |
| 607 | **Graham Saunders** | Saunders / Graham | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/graham-saunders-70488453/ |
| 608 | **Naazeneen Sayed** | Sayed / Naazeneen | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/naazeneen-sayed-8b54b0b3/ |
| 609 | **Tarryn Scholtz** | Scholtz / Tarryn | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Western Cape/City of Cape Town | https://www.linkedin.com/in/tarryn-scholtz-a2435a1ab/ |
| 610 | **Matheus Schreuder** | Schreuder / Matheus | FINANCE_ROLE_CONFIRMED | — | — | Fair Cape Dairies | Western Cape/Durbanville | https://www.linkedin.com/in/matheus-schreuder-1157b6264/ |
| 611 | **Phillip Schreuder** | Schreuder / Phillip | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/City of Cape Town | https://www.linkedin.com/in/phillip-schreuder-650971124/ |
| 612 | **Andrew Scrase** | Scrase / Andrew | FINANCE_ROLE_CONFIRMED | — | — | EnviroServ | Gauteng/Johannesburg | https://www.linkedin.com/in/andrew-scrase-67614b49/ |
| 613 | **Itumeleng Sealetsa** | Sealetsa / Itumeleng | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | Gauteng/City of Johannesburg | https://www.linkedin.com/in/itumeleng-sealetsa-26a81bab/ |
| 614 | **Mabatho Sedikela** | Sedikela / Mabatho | HIGH_CONFIDENCE | CA(SA) | SAICA | Auditor-General of South Africa (AGSA) | — | — |
| 615 | **Danzil September** | September / Danzil | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Stellenbosch | https://www.linkedin.com/in/danzil-september-888a93230/ |
| 616 | **Lyle September** | September / Lyle | FINANCE_ROLE_CONFIRMED | — | — | KWV | Western Cape/Kuils River | https://www.linkedin.com/in/lyleseptember0798/ |
| 617 | **Sergio September** | September / Sergio | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Western Cape/City of Cape Town | https://www.linkedin.com/in/sergio-september-21276b90/ |
| 618 | **Leon Serfontein** | Serfontein / Leon | FINANCE_ROLE_CONFIRMED | — | — | AfriSam | Gauteng/City of Johannesburg | https://www.linkedin.com/in/leon-serfontein-6559b168/ |
| 619 | **Masechaba Sesing** | Sesing / Masechaba | CONFIRMED | CA(SA) | SAICA | Free State Provincial Treasury | Free State/Bloemfontein | — |
| 620 | **Nqobile Shabane (CA)SA** | Shabane (CA)SA / Nqobile | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Durban Metropolitan Area | https://www.linkedin.com/in/nqobile-shabane-ca-sa-722518152/ |
| 621 | **Thandolwenkosi Shabangu** | Shabangu / Thandolwenkosi | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Mpumalanga/Piet Retief | https://www.linkedin.com/in/thandolwenkosi-shabangu-62b4b4192/ |
| 622 | **Aadila Shaikh** | Shaikh / Aadila | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Gauteng/Gauteng | https://www.linkedin.com/in/aadila-shaikh-93452824b/ |
| 623 | **Temoso Shazi** | Shazi / Temoso | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Gauteng/Gauteng | https://www.linkedin.com/in/temoso-shazi-034ba76/ |
| 624 | **Emmaculate Shezi** | Shezi / Emmaculate | FINANCE_ROLE_CONFIRMED | — | — | GVK-Siya Zama | South Africa | https://uk.linkedin.com/in/emmaculate-shezi-85010abb |
| 625 | **Sibongile Sibongile.Kubeka** | Sibongile.Kubeka / Sibongile | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/sibongile-sibongile-kubeka-9a548125/ |
| 626 | **Portia Sihlahla** | Sihlahla / Portia | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/portia-sihlahla-2a08221a9/ |
| 627 | **Graeme Sim** | Sim / Graeme | FINANCE_ROLE_CONFIRMED | — | — | Kaap Agri / Agrimark | Western Cape/City of Cape Town | https://www.linkedin.com/in/graeme-sim-2a7a1068/ |
| 628 | **Zinhle Simamane** | Simamane / Zinhle | CONFIRMED | CA(SA) | SAICA | Traxtion | — | — |
| 629 | **Charlton Simpson** | Simpson / Charlton | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Western Cape/City of Cape Town | https://www.linkedin.com/in/charlton-simpson-9164651b/ |
| 630 | **Tabisa Singenile** | Singenile / Tabisa | CONFIRMED | ACMA, CGMA | CIMA | WBHO Construction - Cape Division | Johannesburg Metropolitan Area | https://www.linkedin.com/in/tabisa-singenile-cgma®-acma-3932b299/ |
| 631 | **Alka Singh** | Singh / Alka | CONFIRMED | CA(SA) | SAICA | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/alka-singh-ca-sa-12642173/ |
| 632 | **Bhaviska Singh** | Singh / Bhaviska | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Gauteng/City of Johannesburg | https://www.linkedin.com/in/bhaviska-singh-9a9831116/ |
| 633 | **Devani Singh** | Singh / Devani | FINANCE_ROLE_CONFIRMED | — | — | Raubex / Roadmac Surfacing Cape | Johannesburg Metropolitan Area | https://www.linkedin.com/in/devani-singh-909318159/ |
| 634 | **Qayiya Siphosethu Kobese** | Siphosethu Kobese / Qayiya | FINANCE_ROLE_CONFIRMED | — | — | Peninsula Beverages | Western Cape/City of Cape Town | https://www.linkedin.com/in/qayiya-siphosethu-kobese/ |
| 635 | **Augustine Sithole** | Sithole / Augustine | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/Johannesburg | https://www.linkedin.com/in/augustine-sithole-630451211/ |
| 636 | **Bantu Skaap** | Skaap / Bantu | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/City of Johannesburg | https://www.linkedin.com/in/bantu-skaap-a1b03552/ |
| 637 | **Philip Slabber** | Slabber / Philip | FINANCE_ROLE_CONFIRMED | — | — | Overberg Agri | Western Cape/City of Cape Town | https://www.linkedin.com/in/philip-slabber-ca-sa-14aa4013a/ |
| 638 | **Chantel Sliep-Viljoen** | Sliep-Viljoen / Chantel | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/chantel-sliep-viljoen-6a180774/ |
| 639 | **Karin Smidt** | Smidt / Karin | FINANCE_ROLE_CONFIRMED | — | — | Spier | Western Cape/Cape Town | https://www.linkedin.com/in/karin-smidt-86332726/ |
| 640 | **Lucinda Smidt** | Smidt / Lucinda | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/City of Cape Town | https://www.linkedin.com/in/lucinda-smidt-57043a5a/ |
| 641 | **Daniël Smit** | Smit / Daniël | FINANCE_ROLE_CONFIRMED | — | — | KWV | South Africa | https://www.linkedin.com/in/daniël-smit-56390565/ |
| 642 | **Heinrich Smit** | Smit / Heinrich | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/City of Cape Town | https://www.linkedin.com/in/heinrich-smit-9b03284a/ |
| 643 | **Adrian Smith** | Smith / Adrian | CONFIRMED | ACMA, CGMA | CIMA | Bounty Apparel | Western Cape/Cape Town | https://www.linkedin.com/in/adrian-smith-acma-cgma-30942b59/ |
| 644 | **Andre Smith** | Smith / Andre | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Western Cape/Western Cape | https://www.linkedin.com/in/andre-smith-09990a18/ |
| 645 | **Hannes Snyman** | Snyman / Hannes | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Gauteng/City of Johannesburg | https://www.linkedin.com/in/hannes-snyman/ |
| 646 | **Johan Snyman** | Snyman / Johan | FINANCE_ROLE_CONFIRMED | — | — | Fruitways | Western Cape/Somerset West | https://www.linkedin.com/in/johan-snyman-1731b215a/ |
| 647 | **Lungelwa Sogiba** | Sogiba / Lungelwa | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/lungelwa-sogiba-01a80965/ |
| 648 | **Polani Sokombela** | Sokombela / Polani | CONFIRMED | CA(SA) | SAICA | Auditor-General of South Africa (AGSA) | — | — |
| 649 | **Brendelene Solomons** | Solomons / Brendelene | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Gauteng/City of Johannesburg | https://www.linkedin.com/in/brendelene-solomons-92229b35/ |
| 650 | **Cheryl Somers Vine** | Somers Vine / Cheryl | FINANCE_ROLE_CONFIRMED | — | — | EnviroServ | Gauteng/Johannesburg | https://www.linkedin.com/in/cheryl-somers-vine-285a8410/ |
| 651 | **Shamila Soobramoney** | Soobramoney / Shamila | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/shamila-soobramoney-0699068b/ |
| 652 | **Sharmila Soobramoney** | Soobramoney / Sharmila | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/sharmila-soobramoney-369301285/ |
| 653 | **Kyle Sparg** | Sparg / Kyle | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | East London | https://www.linkedin.com/in/kyle-sparg-67188615a/ |
| 654 | **Juan Spies** | Spies / Juan | CONFIRMED | CA(SA) | SAICA | McA Durbanville Inc. | Western Cape/Durbanville | — |
| 655 | **Lois Spies** | Spies / Lois | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/lois-spies-43350460/ |
| 656 | **Justine Spreeth** | Spreeth / Justine | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | KwaZulu-Natal/eThekwini | https://www.linkedin.com/in/justine-spreeth-988aa465/ |
| 657 | **Shelton Stanley** | Stanley / Shelton | FINANCE_ROLE_CONFIRMED | — | — | Much Asphalt | Western Cape/Western Cape | https://www.linkedin.com/in/shelton-stanley-9586ab25/ |
| 658 | **Veronica Steenveld** | Steenveld / Veronica | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/veronica-steenveld-560694168/ |
| 659 | **Vedet Stevens** | Stevens / Vedet | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Western Cape/City of Cape Town | https://www.linkedin.com/in/vedetstevens/ |
| 660 | **Albert Steyn** | Steyn / Albert | FINANCE_ROLE_CONFIRMED | — | — | Capespan South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/albert-steyn-40701b69/ |
| 661 | **Pia Steyn** | Steyn / Pia | FINANCE_ROLE_CONFIRMED | — | — | KWV | Western Cape/City of Cape Town | https://www.linkedin.com/in/pia-steyn-ca-sa-2a0051147/ |
| 662 | **Craig Stipp** | Stipp / Craig | FINANCE_ROLE_CONFIRMED | — | — | Brito's Group | Western Cape/Western Cape | https://www.linkedin.com/in/craig-stipp-58aa5811a/ |
| 663 | **Patricia Stock** | Stock / Patricia | CONFIRMED | CA(SA) | SAICA | SAICA | — | — |
| 664 | **Mindre Stofberg** | Stofberg / Mindre | CONFIRMED | CA(SA) | SAICA | Tronox Namakwa Sands | Western Cape/Saldanha Bay Local Municipality | https://www.linkedin.com/in/mindre-stofberg-ca-sa-6416a638/ |
| 665 | **Justin Stohr** | Stohr / Justin | HIGH_CONFIDENCE | PA(SA) | SAIPA | McA Accounting & Tax Services Inc. | Western Cape/Cape Town | — |
| 666 | **Eugene Stoumann** | Stoumann / Eugene | FINANCE_ROLE_CONFIRMED | — | — | Brito's Group | Western Cape/Cape Town | https://www.linkedin.com/in/eugene-stoumann-b62127137/ |
| 667 | **Edburg Strauss** | Strauss / Edburg | CONFIRMED | CA(SA) | SAICA | netCFO | Gauteng/Pretoria | https://www.linkedin.com/in/edburg-strauss/ |
| 668 | **Neil Struthers** | Struthers / Neil | FINANCE_ROLE_CONFIRMED | — | — | Power Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/neil-struthers-019a8b70/ |
| 669 | **Elmarie Swanepoel** | Swanepoel / Elmarie | HIGH_CONFIDENCE | CA(SA) | SAICA | Stellenbosch University | Western Cape/Stellenbosch | — |
| 670 | **Victoria Swanson** | Swanson / Victoria | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/victoria-swanson-ca-sa/ |
| 671 | **Mariette Swart** | Swart / Mariette | CONFIRMED | CA(SA) | SAICA | Afrimat | Western Cape/City of Cape Town | https://www.linkedin.com/in/mariette-swart-23595541/ |
| 672 | **Cecelia Swartz** | Swartz / Cecelia | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 673 | **Kotze Tania** | Tania / Kotze | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/City of Cape Town | https://www.linkedin.com/in/kotze-tania-316a7030/ |
| 674 | **Raeesah Tar** | Tar / Raeesah | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/raeesah-tar-1a8a97116/ |
| 675 | **Hiten Taylor** | Taylor / Hiten | FINANCE_ROLE_CONFIRMED | — | — | Stellenbosch Vineyards / Advini South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/hiten-taylor-acma-cgma-a3b3b2206/ |
| 676 | **Dean Teuchert** | Teuchert / Dean | FINANCE_ROLE_CONFIRMED | — | — | Cape Herb & Spice | Western Cape/Cape Town | https://www.linkedin.com/in/dean-teuchert-b2b81b139/ |
| 677 | **Sisandile Thambo** | Thambo / Sisandile | CONFIRMED | CA(SA) | SAICA | Saint-Gobain Gyproc | Johannesburg Metropolitan Area | https://za.linkedin.com/in/sisa-thambo |
| 678 | **Anthea Thaver** | Thaver / Anthea | FINANCE_ROLE_CONFIRMED | — | — | Corobrik Lansdowne | Gauteng/Germiston | https://www.linkedin.com/in/anthea-thaver-792128160/ |
| 679 | **Willem Theron** | Theron / Willem | CONFIRMED | CA(SA) | SAICA | PSG Konsult Ltd (PSG Financial Services) | — | — |
| 680 | **Joshua Thessal** | Thessal / Joshua | FINANCE_ROLE_CONFIRMED | — | — | Corobrik Lansdowne | KwaZulu-Natal/Durban | https://www.linkedin.com/in/joshua-thessal-86a9195/ |
| 681 | **Rodrique Thomas** | Thomas / Rodrique | CONFIRMED | CA(SA) | SAICA | Astron Energy | Western Cape/City of Cape Town | https://www.linkedin.com/in/rodrique-thomas/ |
| 682 | **Ndivhuwo Thomoli** | Thomoli / Ndivhuwo | CONFIRMED | CA(SA) | SAICA | AfriSam | Gauteng/City of Johannesburg | https://www.linkedin.com/in/ndivhuwo-thomoli-ca-sa-150766a8/ |
| 683 | **Ross Thomson** | Thomson / Ross | HIGH_CONFIDENCE | PA(SA) | SAIPA | Collective Accounting | KwaZulu-Natal/Winston Park | — |
| 684 | **Nomfundo Thusini** | Thusini / Nomfundo | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | KwaZulu-Natal/Durban | https://www.linkedin.com/in/nomfundo-thusini-a22b5a13b/ |
| 685 | **Thamsanqa Thwala** | Thwala / Thamsanqa | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Johannesburg Metropolitan Area | https://www.linkedin.com/in/thamsanqa-thwala-ca-sa-b70585bb/ |
| 686 | **Joshua Tilney** | Tilney / Joshua | CONFIRMED | ACMA, CGMA | CIMA | Klay | Western Cape/Stellenbosch | https://www.linkedin.com/in/joshua-tilney-acma-cgma-49209b86/ |
| 687 | **Keitumetse Tito** | Tito / Keitumetse | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Northern Cape/Kathu | https://www.linkedin.com/in/keitumetse-tito-b10a62a2/ |
| 688 | **William Tlou. BComm, Bcompt (Hons), Mcomm,** | Tlou. BComm, Bcompt (Hons), Mcomm, / William | CONFIRMED | CA(SA) | SAICA | Tronox Namakwa Sands | Gauteng/City of Johannesburg | https://www.linkedin.com/in/william-tlou-bcomm-bcompt-hons-mcomm-ca-sa-5161b029/ |
| 689 | **Pieter Toerien** | Toerien / Pieter | FINANCE_ROLE_CONFIRMED | — | — | ASLA | Western Cape/City of Cape Town | https://www.linkedin.com/in/pieter-toerien-14727091/ |
| 690 | **Bianca Treiber** | Treiber / Bianca | FINANCE_ROLE_CONFIRMED | — | — | Fruitways | Western Cape/City of Cape Town | https://www.linkedin.com/in/bianca-treiber-66384ab9/ |
| 691 | **Mikateko Tshetshe** | Tshetshe / Mikateko | CONFIRMED | FCMA, CGMA | CIMA | Unilever | — | — |
| 692 | **Lehlohonolo Tsotetsi** | Tsotetsi / Lehlohonolo | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Gauteng/City of Johannesburg | https://www.linkedin.com/in/lehlohonolo-tsotetsi-8a79451ba/ |
| 693 | **Tebogo Tuba** | Tuba / Tebogo | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Western Cape/City of Cape Town | https://www.linkedin.com/in/tebogo-tuba-08b8597b/ |
| 694 | **Kelly Turck** | Turck / Kelly | FINANCE_ROLE_CONFIRMED | — | — | Capespan South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/kelly-turck-310b8a33/ |
| 695 | **Liyema Tweni** | Tweni / Liyema | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/Cape Town | https://www.linkedin.com/in/liyema-tweni-9688b9178/ |
| 696 | **Lumka Unathi Kappel** | Unathi Kappel / Lumka | CONFIRMED | CA(SA) | SAICA | Astron Energy | Western Cape/City of Cape Town | https://www.linkedin.com/in/lumka-unathi-kappel-ca-sa-2a54b1133/ |
| 697 | **Deon Uys** | Uys / Deon | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | — | https://www.linkedin.com/in/deon-uys-99771523/ |
| 698 | **Bernadette V.** | V. / Bernadette | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/Johannesburg | https://www.linkedin.com/in/bernadette-v-854989212/ |
| 699 | **Amanda Vakalisa** | Vakalisa / Amanda | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Gauteng/City of Johannesburg | https://www.linkedin.com/in/amanda-vakalisa-acma-cgma-mba-a250b866/ |
| 700 | **Nina Valentine (nee. Coetzee)** | Valentine (nee. Coetzee) / Nina | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Western Cape/City of Cape Town | https://www.linkedin.com/in/nina-valentine-nee-coetzee-b1416a139/ |
| 701 | **Welgemoed Valerie** | Valerie / Welgemoed | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/welgemoed-valerie-5923b48a/ |
| 702 | **Linda Van Deemter** | Van Deemter / Linda | FINANCE_ROLE_CONFIRMED | — | — | EnviroServ | Gauteng/Johannesburg | https://www.linkedin.com/in/linda-van-deemter-0611a911/ |
| 703 | **Johan Van den Elst** | Van den Elst / Johan | FINANCE_ROLE_CONFIRMED | — | — | KWV | Western Cape/Paarl | https://www.linkedin.com/in/johan-van-den-elst-559747204/ |
| 704 | **Geraldine Van Der Merwe** | Van Der Merwe / Geraldine | FINANCE_ROLE_CONFIRMED | — | — | Concor | Gauteng/City of Johannesburg | https://www.linkedin.com/in/geraldine-van-der-merwe-213ba2179/ |
| 705 | **IR Van der Merwe** | Van der Merwe / IR | CONFIRMED | CA(SA) | SAICA | Raubex / Roadmac Surfacing Cape | Free State/Bloemfontein | https://www.linkedin.com/in/ir-van-der-merwe-a3a76955/ |
| 706 | **Leandra van der Merwe** | van der Merwe / Leandra | FINANCE_ROLE_CONFIRMED | — | — | Peninsula Beverages | Western Cape/City of Cape Town | https://www.linkedin.com/in/leandra-van-der-merwe-4aa73511a/ |
| 707 | **Peet van der Merwe** | van der Merwe / Peet | CONFIRMED | CA(SA) | SAICA | Forvis Mazars in South Africa | Free State/Bloemfontein | https://www.linkedin.com/in/peet-van-der-merwe-ca-sa-ra-8320b7a6/ |
| 708 | **Joe van der Walt** | van der Walt / Joe | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Western Cape/City of Cape Town | https://www.linkedin.com/in/joe-van-der-walt-5a268616/ |
| 709 | **Lizaan van der Walt** | van der Walt / Lizaan | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Paarl | https://www.linkedin.com/in/lizaan-van-der-walt-664293147/ |
| 710 | **Vinita van der Walt** | van der Walt / Vinita | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/vinita-van-der-walt-39507781/ |
| 711 | **Adri Van Der Westhuizen** | Van Der Westhuizen / Adri | FINANCE_ROLE_CONFIRMED | — | — | AfriSam | — | https://www.linkedin.com/in/adri-van-der-westhuizen-02309041/ |
| 712 | **Ansie van der Westhuizen** | van der Westhuizen / Ansie | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/ansie-van-der-westhuizen-a89861146/ |
| 713 | **Marilé Van der Westhuizen** | Van der Westhuizen / Marilé | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Gauteng/City of Johannesburg | https://www.linkedin.com/in/marilé-van-der-westhuizen-098343b0/ |
| 714 | **Nadia Van Der Westhuizen** | Van Der Westhuizen / Nadia | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 715 | **Tinu van der Westhuizen** | van der Westhuizen / Tinu | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/tinuv/ |
| 716 | **Cornell van Eeden** | van Eeden / Cornell | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 717 | **Madele Van Heerden** | Van Heerden / Madele | FINANCE_ROLE_CONFIRMED | — | — | Brito's Group | Western Cape/Cape Town | https://www.linkedin.com/in/madele-van-heerden-ab60a334/ |
| 718 | **Ger-Mari Van Niekerk (CA)(SA)** | Van Niekerk (CA)(SA) / Ger-Mari | FINANCE_ROLE_CONFIRMED | — | — | Kaap Agri / Agrimark | South Africa | https://www.linkedin.com/in/ger-mari-van-niekerk-ca-sa-5a96a0120/ |
| 719 | **Anton van Niekerk** | van Niekerk / Anton | CONFIRMED | ACMA, CGMA | CIMA | Snapplify | Western Cape/Cape Town | https://www.linkedin.com/in/anton-van-niekerk-acma-b7503b87/ |
| 720 | **Brink van Niekerk** | van Niekerk / Brink | FINANCE_ROLE_CONFIRMED | — | — | Averda South Africa | South Africa | https://www.linkedin.com/in/cbgvanniekerk/ |
| 721 | **Charmaine van Niekerk** | van Niekerk / Charmaine | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/City of Johannesburg | https://www.linkedin.com/in/charmaine-van-niekerk-788a3589/ |
| 722 | **Gerrit van Niekerk** | van Niekerk / Gerrit | CONFIRMED | CA(SA) | SAICA | Isipani Construction | Western Cape/City of Cape Town / Paarl | https://za.linkedin.com/in/gerrit-van-niekerk-8195587 |
| 723 | **Ralton van Reenen** | van Reenen / Ralton | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/City of Cape Town | https://www.linkedin.com/in/ralton-van-reenen-633520119/ |
| 724 | **Ewan van Rensburg** | van Rensburg / Ewan | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/ewan-van-rensburg-538732b/ |
| 725 | **Johann van Rensburg** | van Rensburg / Johann | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 726 | **Stephan van Rensburg** | van Rensburg / Stephan | FINANCE_ROLE_CONFIRMED | — | — | Kaap Agri / Agrimark | Western Cape/Paarl | https://www.linkedin.com/in/stephan-van-rensburg-9b62b914a/ |
| 727 | **Egbert Van Romburgh** | Van Romburgh / Egbert | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Western Cape/Durbanville | https://www.linkedin.com/in/egbert-van-romburgh-6014821b9/ |
| 728 | **Charl Van Schalkwyk** | Van Schalkwyk / Charl | FINANCE_ROLE_CONFIRMED | — | — | Raubex / Roadmac Surfacing Cape | Free State/Bloemfontein | https://www.linkedin.com/in/charl-van-schalkwyk-a6229533/ |
| 729 | **Deon van Schalkwyk** | van Schalkwyk / Deon | FINANCE_ROLE_CONFIRMED | — | — | Capespan South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/deon-van-schalkwyk-22481044/ |
| 730 | **Anneke van Tonder** | van Tonder / Anneke | FINANCE_ROLE_CONFIRMED | — | — | NJR Steel | Gauteng/Roodepoort | https://www.linkedin.com/in/anneke-van-tonder-8a8171297/ |
| 731 | **Owen van Tonder** | van Tonder / Owen | CONFIRMED | CA(SA) | SAICA | Woolworths Holdings Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/owen-van-tonder-ca-sa-a8482131/ |
| 732 | **Villiers van Veen** | van Veen / Villiers | FINANCE_ROLE_CONFIRMED | — | — | Sentraal-Suid Co-operative (SSK) | Western Cape/Swellendam | https://www.linkedin.com/in/villiers-van-veen-44399b3a/ |
| 733 | **Ernst van Vondel** | van Vondel / Ernst | CONFIRMED | CA(SA) | SAICA | Power Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/vondel/ |
| 734 | **Celecia Van Wyk** | Van Wyk / Celecia | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | — | https://www.linkedin.com/in/celecia-van-wyk-ba5402114/ |
| 735 | **Jana van Zyl** | van Zyl / Jana | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 736 | **Jani van Zyl** | van Zyl / Jani | FINANCE_ROLE_CONFIRMED | — | — | KWV | South Africa | https://www.linkedin.com/in/jani-van-zyl-ca-sa-b46a0116a/ |
| 737 | **Werner van Zyl** | van Zyl / Werner | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Gauteng/Benoni | https://www.linkedin.com/in/werner-van-zyl-ca-sa-a6347a105/ |
| 738 | **Willene van Zyl** | van Zyl / Willene | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 739 | **Jayvant Vassen** | Vassen / Jayvant | FINANCE_ROLE_CONFIRMED | — | — | Capespan South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/jayvant-vassen-9529a71b8/ |
| 740 | **Xelani Vathiwe** | Vathiwe / Xelani | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/George | https://www.linkedin.com/in/xelani-vathiwe-1371902a/ |
| 741 | **Claudia Vega Barandiarán** | Vega Barandiarán / Claudia | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | Gauteng/City of Johannesburg | https://www.linkedin.com/in/claudiavegabarandiaran/ |
| 742 | **Louis Veldsman** | Veldsman / Louis | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Western Cape/City of Cape Town | https://www.linkedin.com/in/louisveldsmanza/ |
| 743 | **Daniele Venter** | Venter / Daniele | FINANCE_ROLE_CONFIRMED | — | — | SA Metal Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/daniele-venter-778276121/ |
| 744 | **Freda Venter** | Venter / Freda | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/freda-venter-b7a43687/ |
| 745 | **Quintin Venter** | Venter / Quintin | HIGH_CONFIDENCE | PA(SA) | SAIPA | Sempre Financial Group | Western Cape/Bellville (Cape Town) | — |
| 746 | **Herman Vermeulen** | Vermeulen / Herman | FINANCE_ROLE_CONFIRMED | — | — | Southern Oil (SOILL) | Western Cape/Swellendam | https://www.linkedin.com/in/herman-vermeulen-ca-sa-6a322892/ |
| 747 | **Mariska Vermeulen** | Vermeulen / Mariska | FINANCE_ROLE_CONFIRMED | — | — | Southern Oil (SOILL) | Western Cape/Swellendam | https://www.linkedin.com/in/mariska-vermeulen-48b8b6255/ |
| 748 | **Vijedharsan Vijendranath** | Vijendranath / Vijedharsan | CONFIRMED | FCCA | ACCA | — | Gauteng/Johannesburg | https://www.linkedin.com/in/vijedharsan-vijendranath-fcca-uk-6118b1103/ |
| 749 | **Qinisela Vincent Rasmeni** | Vincent Rasmeni / Qinisela | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/qinisela-vincent-rasmeni-0805b3ab/ |
| 750 | **Henlie Viola** | Viola / Henlie | FINANCE_ROLE_CONFIRMED | — | — | Kaap Agri / Agrimark | Western Cape/City of Cape Town | https://www.linkedin.com/in/henlie-viola-ca-sa-24545a144/ |
| 751 | **Mart-Marie Visagie** | Visagie / Mart-Marie | FINANCE_ROLE_CONFIRMED | — | — | Brito's Group | Western Cape/Cape Town | https://www.linkedin.com/in/mart-marie-visagie-34bb99104/ |
| 752 | **Chrizelda Visser** | Visser / Chrizelda | CONFIRMED | ACMA, CGMA | CIMA | Curated Beverages Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/chrizelda-visser-acma-cgma-3671b454/ |
| 753 | **Wilhelm Von Westernhagen** | Von Westernhagen / Wilhelm | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/wilhelm-von-westernhagen-a047b684/ |
| 754 | **Christiaan Vorster** | Vorster / Christiaan | CONFIRMED | CA(SA) | SAICA | SAICA | Western Cape/Cape Town | — |
| 755 | **Monika Vorster** | Vorster / Monika | FINANCE_ROLE_CONFIRMED | — | — | Raubex / Roadmac Surfacing Cape | Bloemfontein Metropolitan Area | https://www.linkedin.com/in/monika-vorster-5773711a3/ |
| 756 | **Nhlakanipho Vusi Mpungose (CFE)** | Vusi Mpungose (CFE) / Nhlakanipho | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | Gauteng/Gauteng | https://www.linkedin.com/in/nhlakanipho-mpungose-5b6545282/ |
| 757 | **Marco Wagener** | Wagener / Marco | HIGH_CONFIDENCE | PA(SA) | SAIPA | Excellentia Accounting and Tax Solutions | — | — |
| 758 | **Saneesa Ward** | Ward / Saneesa | CONFIRMED | CA(SA) | SAICA | Raubex / Roadmac Surfacing Cape | Free State/Bloemfontein | https://www.linkedin.com/in/saneesa-ward-ca-sa-3a3533136/ |
| 759 | **Aadam Wei** | Wei / Aadam | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/aadam-wei-ca-sa-7a0063113/ |
| 760 | **Kirsten Wentzel** | Wentzel / Kirsten | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | Johannesburg Metropolitan Area | https://www.linkedin.com/in/kirsten-wentzel-a4a138178/ |
| 761 | **Shelley Wessels** | Wessels / Shelley | CONFIRMED | CA(SA) | SAICA | PetroSA | Western Cape/City of Cape Town | https://www.linkedin.com/in/shelley-wessels/ |
| 762 | **Russell Weyer** | Weyer / Russell | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | South Africa | https://www.linkedin.com/in/russell-weyer-3209845b/ |
| 763 | **Zach Wiid** | Wiid / Zach | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Mpumalanga/Nelspruit | https://www.linkedin.com/in/zach-wiid-854b921b2/ |
| 764 | **Mark Willimott** | Willimott / Mark | CONFIRMED | CA(SA) | SAICA | BDO South Africa | Eastern Cape/Gqeberha (Port Elizabeth) | — |
| 765 | **Emeal Winston (Emeal) van der Westhuizen** | Winston (Emeal) van der Westhuizen / Emeal | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Gauteng/City of Johannesburg | https://www.linkedin.com/in/emeal-winston-van-der-westhuizen-25925a57/ |
| 766 | **Keenen Witbooi** | Witbooi / Keenen | FINANCE_ROLE_CONFIRMED | — | — | Peninsula Beverages | South Africa | https://www.linkedin.com/in/keenen-witbooi-2622a5a9/ |
| 767 | **Taryn Woodbridge** | Woodbridge / Taryn | CONFIRMED | CA(SA) | SAICA | Mercedes-Benz South Africa Ltd | — | — |
| 768 | **Luke Woodhouse** | Woodhouse / Luke | CONFIRMED | CA(SA) | SAICA | GUUD GLOBAL | Gauteng/Johannesburg | https://www.linkedin.com/in/luke-woodhouse-ca-sa-b31a0149/ |
| 769 | **Gretchen Wrigley** | Wrigley / Gretchen | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Western Cape/City of Cape Town | https://www.linkedin.com/in/gretchen-wrigley-3777a443/ |
| 770 | **Nompumelelo Zama-Ngcongo** | Zama-Ngcongo / Nompumelelo | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Gauteng/City of Johannesburg | https://www.linkedin.com/in/nompumelelo-zama-ngcongo-087a8b65/ |
| 771 | **Odwa Zamatyala** | Zamatyala / Odwa | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/odwa-zamatyala-24260b1a2/ |
| 772 | **Bianka Zietsman** | Zietsman / Bianka | CONFIRMED | PA(SA) | SAIPA | Mpact | Gauteng/City of Johannesburg | https://www.linkedin.com/in/bianka-zietsman-268475111/ |
| 773 | **Sibusiso Zikalala** | Zikalala / Sibusiso | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/City of Johannesburg | https://www.linkedin.com/in/sibusiso-zikalala-46188238/ |
| 774 | **MOEGAMAT ZUBAIR ABDURAHMAN** | ZUBAIR ABDURAHMAN / MOEGAMAT | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Western Cape/Cape Town | https://www.linkedin.com/in/moegamat-zubair-abdurahman/ |
| 775 | **Dumisani Zulu** | Zulu / Dumisani | CONFIRMED | AGA(SA) | SAICA | Bonakude Consulting (Pty) Ltd | KwaZulu-Natal/Port Shepstone | https://www.linkedin.com/in/dumisani-zulu-aga-sa-aimfo-a5a62622 |
| 776 | **Sinethemba Zulu** | Zulu / Sinethemba | FINANCE_ROLE_CONFIRMED | — | — | Premier Fishing & Brands | Western Cape/Cape Town | https://www.linkedin.com/in/snethemba-zulu-29b00238/ |
