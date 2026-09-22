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
| People (total records) | 1036 |
| CONFIRMED qualified | 324 |
| HIGH_CONFIDENCE | 45 |
| ARTICLES_CONFIRMED_DESIGNATION_UNVERIFIED | 4 |
| CONFLICTING | 1 |
| FINANCE_ROLE_CONFIRMED | 588 |
| RESEARCH_HOLD | 74 |
| Companies | 113 |
| Sources | 1024 |

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
| 1 | **Dorman-Kade (D)** | (D) / Dorman-Kade | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/dorman-kade-d-87a070aa/ |
| 2 | **More (Ml)** | (Ml) / More | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/more-ml-69583774/ |
| 3 | **Syed (Rb)** | (Rb) / Syed | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/syed-rb-86842677/ |
| 4 | **Maganathan (Vincin) Naidu** | (Vincin) Naidu / Maganathan | FINANCE_ROLE_CONFIRMED | — | — | AfriSam | — | https://www.linkedin.com/in/maganathan-vincin-naidu-851537123/ |
| 5 | **Kelly (Weidemann) Estment** | (Weidemann) Estment / Kelly | FINANCE_ROLE_CONFIRMED | — | — | Libstar | Western Cape/Stellenbosch | https://www.linkedin.com/in/kelly-estment-ca-sa-32484598/ |
| 6 | **Mohammed A. Mahomeddi** | A. Mahomeddi / Mohammed | FINANCE_ROLE_CONFIRMED | — | — | Concor | Gauteng/Bedfordview | https://www.linkedin.com/in/mohammed-a-mahomeddi-52a05b6a/ |
| 7 | **Ebrahiem Abrahams** | Abrahams / Ebrahiem | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/City of Cape Town | https://www.linkedin.com/in/ebrahiem-abrahams-69b831164/ |
| 8 | **Natasha Abrahams** | Abrahams / Natasha | RESEARCH_HOLD | — | — | Cancercare SA | Western Cape | https://za.linkedin.com/in/natasha-abrahams-3146aa45 |
| 9 | **Saadiqa Abrahams** | Abrahams / Saadiqa | FINANCE_ROLE_CONFIRMED | — | — | Cape Herb & Spice | Western Cape/Cape Town | https://www.linkedin.com/in/saadiqa-abrahams-3bb7ba34/ |
| 10 | **Yolandi Adam** | Adam / Yolandi | FINANCE_ROLE_CONFIRMED | — | — | Peninsula Beverages | Western Cape/City of Cape Town | https://www.linkedin.com/in/yolandi-adam-87074a1a/ |
| 11 | **Adeelah Adams** | Adams / Adeelah | FINANCE_ROLE_CONFIRMED | — | — | Commercial Cold Holdings | Western Cape/Cape Town | https://www.linkedin.com/in/adeelah-adams-a8285157/ |
| 12 | **Prudence Adams** | Adams / Prudence | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/prudence-adams-6ba5b939 |
| 13 | **Lex Adendorff** | Adendorff / Lex | FINANCE_ROLE_CONFIRMED | — | — | Ladismith Cheese / Woodlands Dairy Group | Eastern Cape/Port Elizabeth | https://www.linkedin.com/in/lex-adendorff-0230a459/ |
| 14 | **Rynauw Adriaan** | Adriaan / Rynauw | CONFIRMED | PA(SA) | SAIPA | DigiOutsource | Western Cape/Cape Town | https://za.linkedin.com/in/rynauw-adriaan-04607011a |
| 15 | **Byron Adriaanse** | Adriaanse / Byron | CONFIRMED | ACCA | ACCA | Red Badger | Western Cape/Cape Town | https://za.linkedin.com/in/byron-adriaanse-acca-842545155 |
| 16 | **Claudia Adriaanse** | Adriaanse / Claudia | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/claudia-adriaanse-091928100/ |
| 17 | **Hayley Africa** | Africa / Hayley | FINANCE_ROLE_CONFIRMED | — | — | Excellent Meat Group | Western Cape/Cape Town | https://www.linkedin.com/in/hayley-africa-869112117/ |
| 18 | **Chantell Ajam** | Ajam / Chantell | CONFIRMED | CA(SA) | SAICA | Polyoak Packaging | Eastern Cape/Port Elizabeth | https://www.linkedin.com/in/chantellajam/ |
| 19 | **Angeline Aldridge** | Aldridge / Angeline | CONFIRMED | CA(SA) | SAICA | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/angeline-aldridge-86b929184/ |
| 20 | **Juliet Alexander (Neethling)** | Alexander (Neethling) / Juliet | FINANCE_ROLE_CONFIRMED | MAT(SA) | SAICA | Klay | Western Cape/Cape Town | https://www.linkedin.com/in/juliet-alexander-neethling-96639945/ |
| 21 | **Maruping Alina** | Alina / Maruping | FINANCE_ROLE_CONFIRMED | — | — | DSV | South Africa | https://www.linkedin.com/in/maruping-alina-37268971/ |
| 22 | **Richard Allen** | Allen / Richard | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Eastern Cape/Port Elizabeth | https://www.linkedin.com/in/richard-allen-4527b9144/ |
| 23 | **Ebrahim Ally** | Ally / Ebrahim | CONFIRMED | CA(SA) | SAICA | Mpact | Gauteng/City of Johannesburg | https://www.linkedin.com/in/ebrahim-ally8505/ |
| 24 | **Keshree Alwar** | Alwar / Keshree | CONFIRMED | CA(SA) | SAICA | Novus Holdings Ltd | Western Cape/Cape Town | — |
| 25 | **nasrin amin** | amin / nasrin | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Gauteng/City of Johannesburg | https://www.linkedin.com/in/nasrin-amin-00953379/ |
| 26 | **Charl Andre Arndt** | Andre Arndt / Charl | CONFIRMED | AGA(SA) | SAICA | EMS Tax | Western Cape/Stellenbosch | https://za.linkedin.com/in/charl-andre-arndt |
| 27 | **Pieter Andre Schumyn** | Andre Schumyn / Pieter | RESEARCH_HOLD | — | — | — | Western Cape/Western Cape candidate pool | https://za.linkedin.com/in/pieter-andre-schumyn-5b8008126 |
| 28 | **Michael Ansermino** | Ansermino / Michael | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | KwaZulu-Natal/Durban | https://www.linkedin.com/in/michael-ansermino-ab9666242/ |
| 29 | **Lorraine Anwar** | Anwar / Lorraine | FINANCE_ROLE_CONFIRMED | — | — | Corobrik Lansdowne | KwaZulu-Natal/Durban | https://www.linkedin.com/in/lorraine-anwar-9b8016bb/ |
| 30 | **Alex Appleby** | Appleby / Alex | HIGH_CONFIDENCE | — | — | Retail Capital (Pty) Ltd | Western Cape/Cape Town | — |
| 31 | **Bevill Arendse** | Arendse / Bevill | FINANCE_ROLE_CONFIRMED | — | — | Averda South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/bevill-arendse-7268539b/ |
| 32 | **Charneé Arendse** | Arendse / Charneé | HIGH_CONFIDENCE | AGA(SA) | SAICA | Capitec | Western Cape/Stellenbosch | — |
| 33 | **Jessica Arendse** | Arendse / Jessica | RESEARCH_HOLD | — | — | Food Lover's Market Holdings | Western Cape | — |
| 34 | **Thyron Arumugam** | Arumugam / Thyron | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | KwaZulu-Natal/Durban | https://www.linkedin.com/in/thyron-arumugam-52b729100/ |
| 35 | **Naeem Asvat** | Asvat / Naeem | CONFIRMED | CA(SA) | SAICA | SAICA | KwaZulu-Natal/Durban | — |
| 36 | **Leticia August** | August / Leticia | FINANCE_ROLE_CONFIRMED | — | — | Fruitways | Western Cape/City of Cape Town | https://www.linkedin.com/in/leticia-august-4667baa5/ |
| 37 | **Mark Augustine** | Augustine / Mark | HIGH_CONFIDENCE | PA(SA) | SAIPA | Pinnacle Accounting | Western Cape | — |
| 38 | **Lynette Badenhorst** | Badenhorst / Lynette | CONFIRMED | CA(SA) | SAICA | Probeta Training (Pty) Ltd | — | — |
| 39 | **wilhelmina badenhorst** | badenhorst / wilhelmina | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/City of Johannesburg | https://www.linkedin.com/in/wilhelmina-badenhorst-b0762972/ |
| 40 | **Nerasha Bahaw-Louw** | Bahaw-Louw / Nerasha | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/nerasha-bahaw-louw-92888376/ |
| 41 | **Margot Baird** | Baird / Margot | FINANCE_ROLE_CONFIRMED | — | — | EnviroServ | KwaZulu-Natal/Durban | https://www.linkedin.com/in/margot-baird-1bb72596/ |
| 42 | **Sandra Baisch** | Baisch / Sandra | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/sandra-baisch-530a7436/ |
| 43 | **Andisiwe Baliso** | Baliso / Andisiwe | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/andisiwe-baliso-78624631/ |
| 44 | **Imran Bapoo** | Bapoo / Imran | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/imran-bapoo-ca-sa-518a365b/ |
| 45 | **Fatima Bapukee** | Bapukee / Fatima | CONFIRMED | CA(SA) | SAICA | Streets Chartered Accountants (Cape Town) | Western Cape/Cape Town | — |
| 46 | **Eben Barnard** | Barnard / Eben | FINANCE_ROLE_CONFIRMED | — | — | Power Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/eben-barnard-9959b813/ |
| 47 | **Liezl Barnard** | Barnard / Liezl | CONFIRMED | CA(SA) | SAICA | AfriSam | — | https://www.linkedin.com/in/liezl-barnard-ca-sa-62448157/ |
| 48 | **Robyn Bartlett** | Bartlett / Robyn | FINANCE_ROLE_CONFIRMED | — | — | RFG Foods | Western Cape/City of Cape Town | https://www.linkedin.com/in/robyn-bartlett-65831a120/ |
| 49 | **Calvin Bassa** | Bassa / Calvin | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/City of Johannesburg | https://www.linkedin.com/in/calvin-bassa-46345b36/ |
| 50 | **Wico Basson** | Basson / Wico | CONFIRMED | AGA(SA), ACMA, CGMA | SAICA, CIMA | FUL Foods | Western Cape/Somerset West | https://za.linkedin.com/in/wicobasson |
| 51 | **Suzaan Batista** | Batista / Suzaan | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group | Western Cape/Cape Town | https://www.linkedin.com/in/suzaan-batista-ca-sa-865238339/ |
| 52 | **Jody Baumgarten** | Baumgarten / Jody | HIGH_CONFIDENCE | CA(SA) | SAICA | Wonga (South Africa) | — | — |
| 53 | **Melissa Beck** | Beck / Melissa | FINANCE_ROLE_CONFIRMED | — | — | Southern Oil (SOILL) | Western Cape/City of Cape Town | https://www.linkedin.com/in/melissa-beck-aa8812a4/ |
| 54 | **Patricia Becker** | Becker / Patricia | FINANCE_ROLE_CONFIRMED | — | — | Métier Mixed Concrete | KwaZulu-Natal/KwaZulu-Natal | https://www.linkedin.com/in/patricia-becker-8552241b1/ |
| 55 | **Bronwyn Behm** | Behm / Bronwyn | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/City of Cape Town | https://www.linkedin.com/in/bronwyn-behm-058a4666/ |
| 56 | **Chulumanco Beja** | Beja / Chulumanco | CONFIRMED | PA(SA) | SAIPA | Galbraith Rushby | Western Cape | https://za.linkedin.com/in/chulumanco-beja-25bb421bb |
| 57 | **Anel Bekker** | Bekker / Anel | HIGH_CONFIDENCE | ACMA, CGMA | CIMA | Freshworld (Pty) Ltd | Western Cape/Stellenbosch | — |
| 58 | **Etienne Bekker** | Bekker / Etienne | CONFIRMED | AGA(SA) | SAICA | ACCIONA Energía | Western Cape/Cape Town | https://za.linkedin.com/in/etienne-bekker-aga-sa-92929013 |
| 59 | **Marco Bekker** | Bekker / Marco | CONFIRMED | AGA(SA) | SAICA | N1 Restaurant Suppliers | Western Cape/Cape Town | https://za.linkedin.com/in/marco-bekker-aga-sa-mba-sbs-3230a8b |
| 60 | **Gwuineth Benting** | Benting / Gwuineth | FINANCE_ROLE_CONFIRMED | — | — | Peninsula Beverages | Western Cape/Cape Town | https://www.linkedin.com/in/gwuineth-benting-5ab483a2/ |
| 61 | **Vimbai Benza** | Benza / Vimbai | CONFIRMED | ACMA, CGMA | CIMA | Akacia Medical and Healthcare Group | Western Cape/Cape Town | https://za.linkedin.com/in/vimbai-benza-acma-cgma-880a8630 |
| 62 | **Michelle Bernice Du Preez** | Bernice Du Preez / Michelle | FINANCE_ROLE_CONFIRMED | — | — | Macsteel | Gauteng/Gauteng | https://www.linkedin.com/in/michelle-du-preez-89481975/ |
| 63 | **Michael Besson** | Besson / Michael | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/City of Johannesburg | https://www.linkedin.com/in/michael-besson-088b39b2/ |
| 64 | **Rachelle Best** | Best / Rachelle | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 65 | **Cala Bester** | Bester / Cala | FINANCE_ROLE_CONFIRMED | — | — | R+N Master Builders | Western Cape/City of Cape Town | https://za.linkedin.com/in/cala-bester-b5768b12b |
| 66 | **Elza Bester** | Bester / Elza | FINANCE_ROLE_CONFIRMED | — | — | Tronox Namakwa Sands | Western Cape/Saldanha Bay Local Municipality | https://www.linkedin.com/in/elza-bester-4566ba58/ |
| 67 | **Frederick Bester** | Bester / Frederick | RESEARCH_HOLD | — | — | — | Western Cape/Western Cape candidate pool | https://za.linkedin.com/in/bester-chris-frederick |
| 68 | **Cindy Beukes** | Beukes / Cindy | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/cindy-beukes-66534483/ |
| 69 | **Elana Beukes** | Beukes / Elana | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/elana-beukes-cima-adv-dip-ma-b7764461 |
| 70 | **Elané Beukes (Botha)** | Beukes (Botha) / Elané | FINANCE_ROLE_CONFIRMED | — | — | Overberg Agri | Western Cape/Caledon | https://www.linkedin.com/in/elané-beukes-botha-28a628155/ |
| 71 | **J A 'Driaan' Beyers** | Beyers / Driaan | HIGH_CONFIDENCE | PA(SA) | SAIPA | Finkor Accounting | Gauteng/Rayton | — |
| 72 | **Angelic Bezuidenhoudt** | Bezuidenhoudt / Angelic | FINANCE_ROLE_CONFIRMED | — | — | Peninsula Beverages | Western Cape/Cape Town | https://www.linkedin.com/in/angelic-bezuidenhoudt-906780334/ |
| 73 | **Alwyn Bezuidenhout** | Bezuidenhout / Alwyn | FINANCE_ROLE_CONFIRMED | — | — | Macsteel | Gauteng/City of Johannesburg | https://www.linkedin.com/in/alwyn-bezuidenhout-8308805a/ |
| 74 | **Wynand Bezuidenhout** | Bezuidenhout / Wynand | CONFIRMED | AGA(SA) | SAICA | SDK | CA Group | Western Cape/Durbanville | https://za.linkedin.com/in/wynandbez99 |
| 75 | **Uwe Birkenstock** | Birkenstock / Uwe | CONFIRMED | CA(SA) | SAICA | McA Durbanville Inc. | Western Cape/Durbanville | — |
| 76 | **Niel Bisschoff** | Bisschoff / Niel | CONFIRMED | CA(SA) | SAICA | Raubex / Roadmac Surfacing Cape | Gauteng/City of Johannesburg | https://www.linkedin.com/in/niel-bisschoff-ca-sa-b3a1a253/ |
| 77 | **Franciscus Blignault** | Blignault / Franciscus | CONFIRMED | AGA(SA) | SAICA | Cape Five Export SA | Western Cape/Stellenbosch | https://za.linkedin.com/in/franciscus-blignault |
| 78 | **Sias Blignaut** | Blignaut / Sias | FINANCE_ROLE_CONFIRMED | — | — | Apollo Brick (Atlantis) | Gauteng/Johannesburg | https://www.linkedin.com/in/sias-blignaut-a231b024/ |
| 79 | **CLAVER BONDA** | BONDA / CLAVER | RESEARCH_HOLD | — | — | — | Western Cape/Western Cape candidate pool | https://za.linkedin.com/in/claver-bonda-72421535 |
| 80 | **Maria Bookkeeper** | Bookkeeper / Maria | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/City of Cape Town | https://www.linkedin.com/in/maria-bookkeeper-863b79115/ |
| 81 | **Pieter Booyens** | Booyens / Pieter | CONFIRMED | PA(SA) | SAIPA | Wilson Partners | Western Cape/Stellenbosch | https://za.linkedin.com/in/pabooyens |
| 82 | **Annelize Boshoff** | Boshoff / Annelize | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/City of Johannesburg | https://www.linkedin.com/in/annelize-boshoff-8b12b089/ |
| 83 | **Garron Boshoff** | Boshoff / Garron | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Western Cape/City of Cape Town | https://www.linkedin.com/in/garron-boshoff-b1726a20/ |
| 84 | **Johan Boshoff** | Boshoff / Johan | FINANCE_ROLE_CONFIRMED | — | — | Meshco | Western Cape/City of Cape Town | https://www.linkedin.com/in/johan-boshoff-929ba3117/ |
| 85 | **Kobus Boshoff** | Boshoff / Kobus | CONFIRMED | CA(SA) | SAICA | Boshoff Knoetze Chartered Accountants | Western Cape/Somerset West | https://www.linkedin.com/in/kobus-boshoff-0a510888/ |
| 86 | **Sunette Botes** | Botes / Sunette | FINANCE_ROLE_CONFIRMED | — | — | Kaap Agri / Agrimark | South Africa | https://www.linkedin.com/in/sunette-botes-6405a399/ |
| 87 | **Christo Botha** | Botha / Christo | CONFIRMED | PA(SA) | SAIPA | — | Western Cape/Western Cape candidate pool | https://za.linkedin.com/in/christo-botha-5877666a |
| 88 | **Heleen Botha** | Botha / Heleen | FINANCE_ROLE_CONFIRMED | — | — | Fair Cape Dairies | Western Cape/City of Cape Town | https://www.linkedin.com/in/heleen-botha-93942711/ |
| 89 | **Jaco Botha** | Botha / Jaco | CONFIRMED | ACMA, CGMA | CIMA | Ares Holdings | Western Cape/Cape Town | https://za.linkedin.com/in/jaco-botha-cgma |
| 90 | **Maricia Botha** | Botha / Maricia | CONFIRMED | AGA(SA) | SAICA | A van der Lingen Group | Western Cape/Cape Town | https://za.linkedin.com/in/maricia-botha-aga-sa-4209a415 |
| 91 | **Philip Botha** | Botha / Philip | FINANCE_ROLE_CONFIRMED | — | — | RFG Foods | Western Cape/Stellenbosch | https://www.linkedin.com/in/philip-botha/ |
| 92 | **Pieter Botha** | Botha / Pieter | CONFIRMED | CA(SA) | SAICA | AfriSam | — | https://www.linkedin.com/in/pieter-botha-43351637/ |
| 93 | **Ronel Botha** | Botha / Ronel | FINANCE_ROLE_CONFIRMED | — | — | Fruitways | Western Cape/City of Cape Town | https://www.linkedin.com/in/ronel-botha-6507a865/ |
| 94 | **Wardah Botha** | Botha / Wardah | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/wardah-botha-aga-sa-116b4361/ |
| 95 | **Anje Bothma** | Bothma / Anje | CONFIRMED | PA(SA) | SAIPA | Eezibooks Consulting | Western Cape/Cape Town | https://za.linkedin.com/in/anje-bothma-professional-accountant-sa-53b693168 |
| 96 | **Sandi Bothma** | Bothma / Sandi | FINANCE_ROLE_CONFIRMED | — | — | Concor | Gauteng/City of Johannesburg | https://www.linkedin.com/in/sandi-bothma-b0507517a/ |
| 97 | **Chantelle Boucher** | Boucher / Chantelle | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/Johannesburg | https://www.linkedin.com/in/chantelle-boucher-0148a7128/ |
| 98 | **Grant Bowler** | Bowler / Grant | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Western Cape/City of Cape Town | https://www.linkedin.com/in/grant-bowler-9059b598/ |
| 99 | **Nikita Braaf** | Braaf / Nikita | FINANCE_ROLE_CONFIRMED | — | — | I&J | Western Cape/City of Cape Town | https://www.linkedin.com/in/nikita-braaf-613b3763/ |
| 100 | **Catherine Brennan** | Brennan / Catherine | CONFIRMED | PA(SA) | SAIPA | G7 Renewable Energies | Western Cape/Cape Town | https://za.linkedin.com/in/catherine-brennan-b2b6156a |
| 101 | **Muhammad Brey** | Brey / Muhammad | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/mobrey/ |
| 102 | **Madhuri Brijlal** | Brijlal / Madhuri | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Gauteng/City of Johannesburg | https://www.linkedin.com/in/madhuri-brijlal-38634943/ |
| 103 | **Jennifer Brisley** | Brisley / Jennifer | FINANCE_ROLE_CONFIRMED | — | — | Concor | Gauteng/Gauteng | https://www.linkedin.com/in/jennifer-brisley-51a65721/ |
| 104 | **Michelle Brook** | Brook / Michelle | FINANCE_ROLE_CONFIRMED | — | — | Fabrinox | Western Cape/Paarl | https://www.linkedin.com/in/michelle-brook-2725b986/ |
| 105 | **Lesley Brown** | Brown / Lesley | CONFIRMED | AGA(SA) | SAICA | Pangolin Photo Safaris | Western Cape | https://za.linkedin.com/in/lesley-brown-1a93aa68 |
| 106 | **Justyna Bruwer** | Bruwer / Justyna | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/Gauteng | https://www.linkedin.com/in/justyna-bruwer-42a092b3/ |
| 107 | **Ralph Buddle** | Buddle / Ralph | CONFIRMED | CA(SA) | SAICA | TFG Limited (The Foschini Group) | Western Cape/Cape Town | — |
| 108 | **Thomas Bufton** | Bufton / Thomas | FINANCE_ROLE_CONFIRMED | — | — | Ardagh Glass Packaging SA | Gauteng/City of Johannesburg | https://www.linkedin.com/in/thomas-bufton-351030116/ |
| 109 | **Lizanne Buitendag** | Buitendag / Lizanne | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Gauteng/Gauteng | https://www.linkedin.com/in/lizanne-buitendag-a60564213/ |
| 110 | **Catharine Burger** | Burger / Catharine | CONFIRMED | CA(SA) | SAICA | Afrimat | Western Cape/City of Cape Town | https://www.linkedin.com/in/catharine-burger-4a597a81/ |
| 111 | **Hein Burger** | Burger / Hein | CONFIRMED | AGA(SA) | SAICA | Public sector / Western Cape context | Western Cape/Cape Town | https://za.linkedin.com/in/hein-burger-aga-sa-b56163135 |
| 112 | **Nicolene Burger** | Burger / Nicolene | FINANCE_ROLE_CONFIRMED | — | — | WastePlan | Gauteng/Johannesburg | https://www.linkedin.com/in/nicolene-burger-83381827/ |
| 113 | **Yolandi Burger** | Burger / Yolandi | FINANCE_ROLE_CONFIRMED | — | — | Southern Oil (SOILL) | South Africa | https://www.linkedin.com/in/yolandi-burger-384a0865/ |
| 114 | **Khanya Butshingi** | Butshingi / Khanya | RESEARCH_HOLD | — | — | Collinson Group | Western Cape | https://za.linkedin.com/in/khanya-butshingi-2284b922a |
| 115 | **Werner Buys** | Buys / Werner | FINANCE_ROLE_CONFIRMED | — | — | Concor | Gauteng/Bedfordview | https://www.linkedin.com/in/wernerbuys101/ |
| 116 | **Andre C.** | C. / Andre | FINANCE_ROLE_CONFIRMED | — | — | Fabrinox | Western Cape/City of Cape Town | https://www.linkedin.com/in/andre-c-ba703193/ |
| 117 | **Ampie Calitz** | Calitz / Ampie | FINANCE_ROLE_CONFIRMED | — | — | RFG Foods | Western Cape/City of Cape Town | https://www.linkedin.com/in/ampie-calitz-ca-sa-b51a084b/ |
| 118 | **Kevin Cammay** | Cammay / Kevin | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Western Cape/City of Cape Town | https://www.linkedin.com/in/kevin-cammay-38011325/ |
| 119 | **Nikita Candy Engelbrecht** | Candy Engelbrecht / Nikita | FINANCE_ROLE_CONFIRMED | — | — | Cape Herb & Spice | Western Cape/Cape Town | https://www.linkedin.com/in/nikita-candy-engelbrecht-2a2300235/ |
| 120 | **Bruce Canham ACMA, CGMA** | Canham ACMA, CGMA / Bruce | CONFIRMED | ACMA, CGMA | CIMA | — | Western Cape/Western Cape candidate pool | https://za.linkedin.com/in/bruce-canham-acma-cgma-0a218a220 |
| 121 | **Samantha Carr** | Carr / Samantha | RESEARCH_HOLD | — | — | University of the Western Cape | Western Cape | https://za.linkedin.com/in/samantha-carr-2644466a |
| 122 | **Michelle Carstens** | Carstens / Michelle | FINANCE_ROLE_CONFIRMED | — | — | Spier | Western Cape/Cape Town | https://www.linkedin.com/in/michelle-carstens-ca-sa-71b62475/ |
| 123 | **Kerry Cassel** | Cassel / Kerry | CONFIRMED | CA(SA) | SAICA | Motus Mobility Solutions | — | — |
| 124 | **Jacqui Celliers** | Celliers / Jacqui | CONFIRMED | CA(SA) | SAICA | Nampak | Gauteng/Johannesburg | https://www.linkedin.com/in/jacqui-celliers-241a47209/ |
| 125 | **Kamohelo Chauke** | Chauke / Kamohelo | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/Cape Town | https://www.linkedin.com/in/kamohelo-chauke-ca-sa-10bb0b221/ |
| 126 | **Ronnie Chetty** | Chetty / Ronnie | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/ronnie-chetty-42400656/ |
| 127 | **Walter Chigwada** | Chigwada / Walter | FINANCE_ROLE_CONFIRMED | — | — | Safintra South Africa | Gauteng/Boksburg | https://www.linkedin.com/in/walter-chigwada-8b4b7520/ |
| 128 | **Taku Chimedza** | Chimedza / Taku | FINANCE_ROLE_CONFIRMED | — | — | Averda South Africa | Johannesburg Metropolitan Area | https://www.linkedin.com/in/taku-chimedza-ca-sa-578b6a153/ |
| 129 | **Bianca Christian** | Christian / Bianca | CONFIRMED | CA(SA) | SAICA | WBHO Construction - Cape Division | Gauteng/Gauteng | https://www.linkedin.com/in/bianca-christian-1690a9b0/ |
| 130 | **Kruger Christie** | Christie / Kruger | FINANCE_ROLE_CONFIRMED | — | — | Spier | Western Cape/Cape Town | https://www.linkedin.com/in/kruger-christie-08b5a75a/ |
| 131 | **Tanya Churchill** | Churchill / Tanya | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/tanya-churchill-03589714a/ |
| 132 | **Iliscke Cilliers** | Cilliers / Iliscke | FINANCE_ROLE_CONFIRMED | — | — | Boland Cellar | Western Cape/Paarl | — |
| 133 | **Jason Cloete** | Cloete / Jason | RESEARCH_HOLD | PA(SA), CIA | SAIPA | Western Cape Government | Western Cape/Cape Town | — |
| 134 | **Malcolm Cecil Coates** | Coates / Malcolm | HIGH_CONFIDENCE | PA(SA) | SAIPA | Alma Casa | Western Cape/Muizenberg (Cape Town) | — |
| 135 | **Carlynn-Jade Coetzee** | Coetzee / Carlynn-Jade | CONFIRMED | PA(SA) | SAIPA | Ubuntu Quantum | Western Cape/Cape Town | https://za.linkedin.com/in/carlynn-jadecoetzee |
| 136 | **Denovan Coetzee** | Coetzee / Denovan | CONFIRMED | ACMA, CGMA | CIMA | Lactalis South Africa | Western Cape/Cape Town | https://za.linkedin.com/in/denovan-coetzee-acma-cgma-652581197 |
| 137 | **Johan Coetzee** | Coetzee / Johan | HIGH_CONFIDENCE | CA(SA) | SAICA | Callidus Accountants | Western Cape/Somerset West | — |
| 138 | **Tammy Coetzee** | Coetzee / Tammy | RESEARCH_HOLD | — | — | Aqunion | Western Cape | https://za.linkedin.com/in/tammy-coetzee-a992952b |
| 139 | **Werner Coetzee** | Coetzee / Werner | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/City of Johannesburg | https://www.linkedin.com/in/werner-coetzee-428687138/ |
| 140 | **Alrich Coetzee ACMA, CGMA** | Coetzee ACMA, CGMA / Alrich | CONFIRMED | ACMA, CGMA | CIMA | — | Western Cape | https://za.linkedin.com/in/alrich-coetzee |
| 141 | **Alisha Coetzer** | Coetzer / Alisha | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/alisha-coetzer-059b1a63/ |
| 142 | **Neil Coetzer** | Coetzer / Neil | RESEARCH_HOLD | — | — | SPH Kundalila | North West/Rustenburg | https://www.linkedin.com/in/neil-coetzer-0b533228a/ |
| 143 | **Pieter-Christiaan Coetzer** | Coetzer / Pieter-Christiaan | FINANCE_ROLE_CONFIRMED | — | — | Southern Oil (SOILL) | Potchefstroom | https://www.linkedin.com/in/pieter-christiaan-coetzer-224587244/ |
| 144 | **Ryan Coldman** | Coldman / Ryan | HIGH_CONFIDENCE | — | — | REFSOLS - Refrigeration Solutions & Fridgetec Services | Western Cape/Cape Town | — |
| 145 | **Themba Collen** | Collen / Themba | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Gauteng/Benoni | https://www.linkedin.com/in/themba-collen-410500248/ |
| 146 | **Saleh Coovadia** | Coovadia / Saleh | CONFIRMED | CA(SA) | SAICA | Tshikululu Social Investments (Pty) Ltd | Gauteng/Johannesburg | — |
| 147 | **Angus Cornelius** | Cornelius / Angus | FINANCE_ROLE_CONFIRMED | — | — | Peninsula Beverages | Western Cape/City of Cape Town | https://www.linkedin.com/in/angus-cornelius-ca-sa-4603361a/ |
| 148 | **Tracey Cosgrove** | Cosgrove / Tracey | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/City of Cape Town | https://www.linkedin.com/in/tracey-cosgrove-79454024/ |
| 149 | **Grant Crighton** | Crighton / Grant | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/grant-crighton-60348598 |
| 150 | **Melese Cronje** | Cronje / Melese | FINANCE_ROLE_CONFIRMED | — | — | Much Asphalt | South Africa | https://www.linkedin.com/in/melese-cronje-a8437a94/ |
| 151 | **Jeanette Croukamp** | Croukamp / Jeanette | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/jeanette-croukamp-237469a6/ |
| 152 | **Lameez Cupido** | Cupido / Lameez | FINANCE_ROLE_CONFIRMED | — | — | Capespan South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/lameez-cupido-b39a0141/ |
| 153 | **Minnie D.** | D. / Minnie | FINANCE_ROLE_CONFIRMED | — | — | Métier Mixed Concrete | KwaZulu-Natal/Durban | https://www.linkedin.com/in/minnie-de-wit-0a85425b/ |
| 154 | **Louwrens da Silva** | da Silva / Louwrens | HIGH_CONFIDENCE | PA(SA) | SAIPA | Petrichor Consulting | Western Cape/Somerset West | — |
| 155 | **Maritza Dalton** | Dalton / Maritza | CONFIRMED | PA(SA) | SAIPA | Cecil Kilpin & Co. | Western Cape | https://za.linkedin.com/in/maritza-dalton-professional-accountant-sa-91128611a |
| 156 | **Ahmed Dalvie** | Dalvie / Ahmed | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/Cape Town | https://www.linkedin.com/in/ahmeddalvie/ |
| 157 | **Saadiqa Dangor** | Dangor / Saadiqa | RESEARCH_HOLD | — | — | Atlantis Special Economic Zone | Western Cape | https://www.linkedin.com/in/saadiqa-dangor/ |
| 158 | **Adre Daniel** | Daniel / Adre | HIGH_CONFIDENCE | PA(SA) | SAIPA | Accu-fin Accounting | Western Cape/Milnerton (Cape Town) | — |
| 159 | **Ebrahim Daniels** | Daniels / Ebrahim | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/Cape Town | https://www.linkedin.com/in/ebrahim-daniels/ |
| 160 | **Karen Dannhauser (Prinsloo)** | Dannhauser (Prinsloo) / Karen | RESEARCH_HOLD | — | — | — | Western Cape/Western Cape candidate pool | https://za.linkedin.com/in/karen-dannhauser-prinsloo-a96740aa |
| 161 | **Kyle Danster** | Danster / Kyle | CONFIRMED | ACMA, CGMA | CIMA | Curro Holdings Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/kyle-danster/ |
| 162 | **Belinda David** | David / Belinda | FINANCE_ROLE_CONFIRMED | — | — | I&J | Western Cape/City of Cape Town | https://www.linkedin.com/in/belinda-david-a7965651/ |
| 163 | **Ameena Davids** | Davids / Ameena | CONFIRMED | PA(SA) | SAIPA | The SOLA Group | Western Cape/Cape Town | https://za.linkedin.com/in/ameena-davids-professional-accountant-sa-78735763 |
| 164 | **Andre Davids** | Davids / Andre | RESEARCH_HOLD | AGA(SA) | SAICA | Exceed Group | Western Cape/Cape Town | — |
| 165 | **Jaques Davids** | Davids / Jaques | CONFIRMED | ACMA, CGMA | CIMA | Stellenbosch University | Western Cape/Stellenbosch | https://za.linkedin.com/in/jaques-davids-acma-cgma-a4179b129 |
| 166 | **Zaakirah Davids** | Davids / Zaakirah | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/zaakirah-davids-ca-sa-b42445267/ |
| 167 | **Graham Davin** | Davin / Graham | CONFIRMED | CA(SA) | SAICA | TFG Limited (The Foschini Group) | — | — |
| 168 | **Ferose dawood** | dawood / Ferose | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/City of Cape Town | https://www.linkedin.com/in/dawood-ferose-9829347a/ |
| 169 | **Cormé de Bruyn** | de Bruyn / Cormé | CONFIRMED | ACMA, CGMA | CIMA | Trueprop | Western Cape/Cape Town | https://za.linkedin.com/in/corm%C3%A9-de-bruyn-acma-cgma-6b98a015b |
| 170 | **Angelina de Gouveia** | de Gouveia / Angelina | FINANCE_ROLE_CONFIRMED | — | — | Concor | Gauteng/City of Johannesburg | https://www.linkedin.com/in/angelina-de-gouveia-4639681ba/ |
| 171 | **Yolandi de Jonge** | de Jonge / Yolandi | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/City of Johannesburg | https://www.linkedin.com/in/yolandi-de-jonge-40917b74/ |
| 172 | **Deon de Jongh** | de Jongh / Deon | CONFIRMED | AGA(SA) | SAICA | Luno | Western Cape/Cape Town | https://za.linkedin.com/in/deondejongh |
| 173 | **Lizelle De Klerk** | De Klerk / Lizelle | FINANCE_ROLE_CONFIRMED | — | — | EnviroServ | Gauteng/Johannesburg | https://www.linkedin.com/in/lizelle-de-klerk-82b35574/ |
| 174 | **Nicolene De Klerk** | De Klerk / Nicolene | FINANCE_ROLE_CONFIRMED | — | — | DSV | Pretoria Metropolitan Area | https://www.linkedin.com/in/nicolene-de-klerk-223181246/ |
| 175 | **Marinelle de Klerk Kilian** | de Klerk Kilian / Marinelle | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group | Western Cape/Saldanha | https://www.linkedin.com/in/marinelle-de-klerk-kilian-57792929/ |
| 176 | **Callum de la Hunt** | de la Hunt / Callum | FINANCE_ROLE_CONFIRMED | — | — | Klay | Western Cape/Cape Town | https://www.linkedin.com/in/callum-de-la-hunt-01a590203/ |
| 177 | **Zené de Laan** | de Laan / Zené | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Western Cape/Stellenbosch | https://www.linkedin.com/in/zené-de-laan-ca-sa-a25aa485/ |
| 178 | **Adriaan de Lange** | de Lange / Adriaan | CONFIRMED | CA(SA) | SAICA | Adriaan de Lange Advisory (Private Capacity) | Western Cape/Cape Town | https://www.linkedin.com/in/a3aandl/ |
| 179 | **John De Sousa** | De Sousa / John | CONFIRMED | PA(SA) | SAIPA | GVK-Siya Zama | Western Cape/City of Cape Town | https://za.linkedin.com/in/john-de-sousa-98a52247 |
| 180 | **Sandi De Souza** | De Souza / Sandi | CONFIRMED | CA(SA) | SAICA | SAP Africa | — | — |
| 181 | **Emile de Villiers** | de Villiers / Emile | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 182 | **Franselle de Villiers** | de Villiers / Franselle | FINANCE_ROLE_CONFIRMED | — | — | Raubex / Roadmac Surfacing Cape | Free State/Bloemfontein | https://www.linkedin.com/in/franselle-de-villiers-413b4b82/ |
| 183 | **Aulene De Vries** | De Vries / Aulene | CONFIRMED | PA(SA) | SAIPA | Portland Group | Western Cape/Wellington | https://www.linkedin.com/in/aulene-de-vries-pa-sa-79050616a/ |
| 184 | **Louis de Wet** | de Wet / Louis | CONFIRMED | CA(SA) | SAICA | TradeOn SA | Western Cape/Stellenbosch | https://www.linkedin.com/in/louisdewetza/ |
| 185 | **Marzanne de Wet** | de Wet / Marzanne | CONFIRMED | ACMA, CGMA | CIMA | Rainmaker Media | Western Cape/Cape Town | https://za.linkedin.com/in/marzanne-de-wet-acma-cgma-50b83531 |
| 186 | **Wayne de Wet** | de Wet / Wayne | CONFIRMED | CA(SA) | SAICA | Cape Town International Convention Centre (CTICC) | Western Cape/Cape Town | — |
| 187 | **Pieter De Wit** | De Wit / Pieter | CONFIRMED | CA(SA) | SAICA | Afrimat | Western Cape/City of Cape Town | https://www.linkedin.com/in/pieter-de-wit-4619b210/ |
| 188 | **Christo de Witt** | de Witt / Christo | HIGH_CONFIDENCE | PA(SA) | SAIPA | Origin Financial Group of Companies | Western Cape/Cape Town | — |
| 189 | **Lindi Dempers** | Dempers / Lindi | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/Saldanha Bay Local Municipality | https://www.linkedin.com/in/lindi-dempers-9b872350/ |
| 190 | **Melanie Dennis-Jacobs** | Dennis-Jacobs / Melanie | CONFIRMED | AGA(SA) | SAICA | Red Carnation Hotel Collection | Western Cape/Cape Town | https://za.linkedin.com/in/melanie-dennis-jacobs-aga-sa-7034aa66 |
| 191 | **Manoj Desai** | Desai / Manoj | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/manoj-desai-61790754/ |
| 192 | **Elisha Dhenanath** | Dhenanath / Elisha | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | Gauteng/City of Johannesburg | https://www.linkedin.com/in/elisha-dhenanath-11b85b5/ |
| 193 | **Peet Diedericks** | Diedericks / Peet | RESEARCH_HOLD | — | — | — | Western Cape | — |
| 194 | **Zama-o-kuhle Dingaan** | Dingaan / Zama-o-kuhle | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Gauteng/Gauteng | https://www.linkedin.com/in/zama-o-kuhle-dingaan-acma-cgma-a11080134/ |
| 195 | **Monique Dippenaar** | Dippenaar / Monique | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/monique-dippenaar-54b61114b/ |
| 196 | **Lebogang Dire** | Dire / Lebogang | HIGH_CONFIDENCE | CA(SA) | SAICA | National Agricultural Marketing Council (NAMC) | Gauteng/Pretoria | — |
| 197 | **Lézanne Dirkse van Schalkwyk** | Dirkse van Schalkwyk / Lézanne | CONFIRMED | AGA(SA) | SAICA | McA Inc. | Western Cape/Durbanville | — |
| 198 | **Wallace Disi** | Disi / Wallace | CONFIRMED | PA(SA) | SAIPA | — | Western Cape | https://za.linkedin.com/in/wallace-disi-74a3921a |
| 199 | **Nkosana Dlamini** | Dlamini / Nkosana | CONFIRMED | ACMA, CGMA | CIMA | Absa Group | Gauteng/Johannesburg | — |
| 200 | **Lizaan Draper** | Draper / Lizaan | FINANCE_ROLE_CONFIRMED | — | — | Sentraal-Suid Co-operative (SSK) | Western Cape/Western Cape | https://www.linkedin.com/in/lizaan-draper-ca-sa-286955193/ |
| 201 | **Corne Du Plooy** | Du Plooy / Corne | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/corne-du-plooy-4625b7136/ |
| 202 | **Ettienne du Preez** | du Preez / Ettienne | CONFIRMED | PA(SA) | SAIPA | — | Western Cape | https://za.linkedin.com/in/ettiennedupreez |
| 203 | **Firdows Du Toit** | Du Toit / Firdows | CONFIRMED | PA(SA) | SAIPA | MRI Software (recent/current profile employer) | Western Cape/Cape Town | https://za.linkedin.com/in/firdows-du-toit-472882150 |
| 204 | **JP du Toit** | du Toit / JP | CONFIRMED | CA(SA) | SAICA | Food Lover's Market Holdings | Western Cape/Cape Town | https://za.linkedin.com/in/jp-du-toit-ca-sa-012989a4/ |
| 205 | **André Du Plessis** | Du Plessis / André | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 206 | **Ashley Du Plessis** | Du Plessis / Ashley | CONFIRMED | AGA(SA) | SAICA | — | Western Cape/Paarl | https://www.linkedin.com/in/ashley-du-plessis-ba99a716b/ |
| 207 | **Flavian Du Plessis** | Du Plessis / Flavian | FINANCE_ROLE_CONFIRMED | — | — | Libstar | Western Cape/Cape Town | https://www.linkedin.com/in/flavian-du-plessis-4a5829247/ |
| 208 | **Francois Du Plessis** | Du Plessis / Francois | FINANCE_ROLE_CONFIRMED | — | — | EnviroServ | Western Cape/Cape Town | https://www.linkedin.com/in/francois-du-plessis-75798597/ |
| 209 | **Ilke du Plessis** | du Plessis / Ilke | FINANCE_ROLE_CONFIRMED | — | — | Kropz Elandsfontein | Western Cape/City of Cape Town | https://www.linkedin.com/in/ilke-du-plessis-5478a7207/ |
| 210 | **Lian du Plessis** | du Plessis / Lian | CONFIRMED | AGA(SA) | SAICA | Cape Chamber of Commerce & Industry | Western Cape/Cape Town | https://www.linkedin.com/in/lian-du-plessis-aga-sa-177375149/ |
| 211 | **Harry Durrell** | Durrell / Harry | CONFIRMED | AGA(SA) | SAICA | Herold Gie Attorneys | Western Cape/Cape Town | https://za.linkedin.com/in/harrydurrell |
| 212 | **Valentine Dzvova** | Dzvova / Valentine | CONFIRMED | CA(SA), ACMA, CGMA | SAICA, CIMA | AYO Technology Solutions Limited | Western Cape/Cape Town | https://za.linkedin.com/in/valentine-dzvova |
| 213 | **Brent Edward Williams** | Edward Williams / Brent | RESEARCH_HOLD | PA(SA) | SAIPA | The Free Range Chicken Company | Western Cape/Cape Town | — |
| 214 | **Monique Ellis** | Ellis / Monique | FINANCE_ROLE_CONFIRMED | — | — | Namaqua Wines | Gauteng/Pretoria | https://www.linkedin.com/in/monique-ellis-8a58b9145/ |
| 215 | **Anene Engelbrecht** | Engelbrecht / Anene | CONFIRMED | — | — | Radisson Blu Hotel Waterfront, Cape Town (Radisson Hotel Group) | Western Cape/Cape Town | — |
| 216 | **Wilbur Engelbrecht** | Engelbrecht / Wilbur | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/Vredenburg | https://www.linkedin.com/in/wilbur-engelbrecht-4232b8172/ |
| 217 | **Siddiqa Enous** | Enous / Siddiqa | FINANCE_ROLE_CONFIRMED | — | — | AfriSam | — | https://www.linkedin.com/in/siddiqa-enous-b2500b12/ |
| 218 | **Rafeeq Erasmus** | Erasmus / Rafeeq | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/City of Cape Town | https://www.linkedin.com/in/rafeeq-erasmus-5b113b54/ |
| 219 | **Fanie Esterhuizen** | Esterhuizen / Fanie | FINANCE_ROLE_CONFIRMED | — | — | SPH Kundalila | Western Cape/Cape Town | https://www.linkedin.com/in/fanie-esterhuizen-1a325811b/ |
| 220 | **Anthea F.** | F. / Anthea | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/City of Cape Town | https://www.linkedin.com/in/anthea-f-01a87264/ |
| 221 | **Amanda Fairley** | Fairley / Amanda | FINANCE_ROLE_CONFIRMED | — | — | Interwaste | Gauteng/Johannesburg | https://www.linkedin.com/in/amanda-fairley-28b74b52/ |
| 222 | **Zahid Fakey** | Fakey / Zahid | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 223 | **Zahida Fakey** | Fakey / Zahida | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 224 | **Brumilda Farmer** | Farmer / Brumilda | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/brumilda-farmer-a04b11176/ |
| 225 | **Craig Felaar** | Felaar / Craig | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/City of Cape Town | https://www.linkedin.com/in/craig-felaar-42982931/ |
| 226 | **Erica Felix** | Felix / Erica | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Western Cape/City of Cape Town | https://www.linkedin.com/in/erica-felix-737839138/ |
| 227 | **Siphamandla Fennie** | Fennie / Siphamandla | FINANCE_ROLE_CONFIRMED | — | — | I&J | Western Cape/City of Cape Town | https://www.linkedin.com/in/siphamandla-fennie/ |
| 228 | **Chantelle Fenwick** | Fenwick / Chantelle | CONFIRMED | AGA(SA) | SAICA | DigiOutsource | Western Cape/Cape Town | https://za.linkedin.com/in/chantelle-fenwick-bb789493 |
| 229 | **Brent Ferreira** | Ferreira / Brent | CONFIRMED | PA(SA) | SAIPA | Afrimat | Western Cape/City of Cape Town | https://www.linkedin.com/in/brent-ferreira-883553172/ |
| 230 | **Ruan Ferreira** | Ferreira / Ruan | CONFIRMED | AGA(SA) | SAICA | LiebenGroup | Western Cape/Cape Town | https://za.linkedin.com/in/ruan-ferreira-aga-sa-37157a196 |
| 231 | **Sophy Finger** | Finger / Sophy | FINANCE_ROLE_CONFIRMED | — | — | AfriSam | — | https://www.linkedin.com/in/sophy-finger-0ab686101/ |
| 232 | **Byron Fortuin** | Fortuin / Byron | CONFIRMED | AGA(SA) | SAICA | Boschendal Farm | Western Cape/Pniel | https://za.linkedin.com/in/byron-fortuin-aga-sa-637905192 |
| 233 | **Abdulmu-izz Fortune** | Fortune / Abdulmu-izz | FINANCE_ROLE_CONFIRMED | — | — | Premier Fishing & Brands | Western Cape/City of Cape Town | https://www.linkedin.com/in/abdulmu-izz-fortune-808057197/ |
| 234 | **Dawn Fortune** | Fortune / Dawn | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/dawn-fortune-064a8222/ |
| 235 | **Delwen Fortune** | Fortune / Delwen | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/delwen-fortune-b98bb437/ |
| 236 | **Jeanne Fourie** | Fourie / Jeanne | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/jeanne-fourie-2741987a/ |
| 237 | **Neil Fourie** | Fourie / Neil | CONFIRMED | AGA(SA) | SAICA | Brenn-O-Kem | Western Cape/Stellenbosch | https://www.linkedin.com/in/neil-fourie-aga-sa-2a125b204/ |
| 238 | **Suzanne Fourie** | Fourie / Suzanne | FINANCE_ROLE_CONFIRMED | — | — | LANCEWOOD | Western Cape/City of Cape Town | https://www.linkedin.com/in/suzanne-fourie-568541135/ |
| 239 | **Melissa Frantz** | Frantz / Melissa | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/City of Cape Town | https://www.linkedin.com/in/melissa-frantz-4856429a/ |
| 240 | **Petrus Frick** | Frick / Petrus | CONFIRMED | AGA(SA), CFA | SAICA | Frick & Co Advisory | Western Cape/Cape Town | https://za.linkedin.com/in/petrus-frick-223543262 |
| 241 | **Victoria Fryer** | Fryer / Victoria | FINANCE_ROLE_CONFIRMED | — | — | NJR Steel | Gauteng/Benoni | https://www.linkedin.com/in/victoria-fryer-201359222/ |
| 242 | **Vukosi Fungeni** | Fungeni / Vukosi | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 243 | **Akani Fungheni (BCOMPT)** | Fungheni (BCOMPT) / Akani | FINANCE_ROLE_CONFIRMED | — | — | DSV | Western Cape/City of Cape Town | https://www.linkedin.com/in/akani-fungheni-bcompt-654416190/ |
| 244 | **Jackie Furter** | Furter / Jackie | FINANCE_ROLE_CONFIRMED | — | — | Power Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/jackie-furter-47908888/ |
| 245 | **Frikkie G.** | G. / Frikkie | FINANCE_ROLE_CONFIRMED | — | — | WastePlan | Gauteng/Pretoria | https://www.linkedin.com/in/frikkie-g-9036b735/ |
| 246 | **Rameck Gadziso** | Gadziso / Rameck | FINANCE_ROLE_CONFIRMED | — | — | Spier | Western Cape/Somerset West | https://www.linkedin.com/in/rameck-gadziso-cgma-cima-adv-dip-ma-tax-consultant-4a012228/ |
| 247 | **Shaheeda Gafieldien** | Gafieldien / Shaheeda | FINANCE_ROLE_CONFIRMED | — | — | Fruitways | Western Cape/Somerset West | https://www.linkedin.com/in/shaheeda-gafieldien-233599277/ |
| 248 | **Ipfi Gavhi** | Gavhi / Ipfi | FINANCE_ROLE_CONFIRMED | — | — | I&J | Western Cape/Western Cape | https://www.linkedin.com/in/ipfi-gavhi-20426a207/ |
| 249 | **Chelsea Geldenhuys** | Geldenhuys / Chelsea | CONFIRMED | CA(SA) | SAICA | Raubex / Roadmac Surfacing Cape | Free State/Bloemfontein | https://www.linkedin.com/in/chelsea-geldenhuys-ca-sa-0139847b/ |
| 250 | **Nicole Genade** | Genade / Nicole | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/nicole-genade-6186b2149/ |
| 251 | **Rene Geneve Boros** | Geneve Boros / Rene | FINANCE_ROLE_CONFIRMED | — | — | DSV | Germiston Metropolitan Area | https://www.linkedin.com/in/rene-geneve-boros-067048202/ |
| 252 | **Zine Gengana** | Gengana / Zine | CONFIRMED | PA(SA) | SAIPA | HIGHVERN | Western Cape/Cape Town | https://za.linkedin.com/in/zine-gengana-professional-accountant-sa-319526a1 |
| 253 | **Marta Gerbach** | Gerbach / Marta | CONFIRMED | CA(SA) | SAICA | Fourways Airconditioning | — | — |
| 254 | **Zandrea Gerber** | Gerber / Zandrea | CONFIRMED | CA(SA) | SAICA | Pay@ | Western Cape/Paarl | https://www.linkedin.com/in/zandrea-gerber-ca-sa-99a5a475/ |
| 255 | **Christelle Germishuys** | Germishuys / Christelle | FINANCE_ROLE_CONFIRMED | — | — | KWV | Western Cape/City of Cape Town | https://www.linkedin.com/in/christelle-germishuys-438baa4/ |
| 256 | **Emmie Germishuys** | Germishuys / Emmie | FINANCE_ROLE_CONFIRMED | — | — | Sentraal-Suid Co-operative (SSK) | Western Cape/Western Cape | https://www.linkedin.com/in/emmie-germishuys-13ba26262/ |
| 257 | **Nombulelo Geya** | Geya / Nombulelo | RESEARCH_HOLD | — | — | Simeka Consultants & Actuaries | Western Cape | https://za.linkedin.com/in/nombulelo-geya-36a2a12b |
| 258 | **Ayanda Geza** | Geza / Ayanda | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Gauteng/City of Johannesburg | https://www.linkedin.com/in/ayanda-geza-3a336648/ |
| 259 | **Robert Gillman** | Gillman / Robert | RESEARCH_HOLD | — | — | — | Western Cape | https://uk.linkedin.com/in/robert-gillman-9281b59a |
| 260 | **Nonkululeko Gobodo** | Gobodo / Nonkululeko | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 261 | **Shailen Gokaldass** | Gokaldass / Shailen | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/shailen-gokaldass-15980b49/ |
| 262 | **Kyrlene Goliath** | Goliath / Kyrlene | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Western Cape/City of Cape Town | https://www.linkedin.com/in/kyrlene-goliath-acma-cgma-a858b046/ |
| 263 | **Tikeyah Goodman** | Goodman / Tikeyah | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Gauteng/City of Johannesburg | https://www.linkedin.com/in/tikeyah-goodman-158876249/ |
| 264 | **Albert Goosen** | Goosen / Albert | FINANCE_ROLE_CONFIRMED | — | — | Ceres Fruit Growers | South Africa | https://www.linkedin.com/in/albert-goosen-97223b6/ |
| 265 | **Chantelle Goosen** | Goosen / Chantelle | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/City of Cape Town | https://www.linkedin.com/in/chantellegoosen/ |
| 266 | **Jana Goosen** | Goosen / Jana | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 267 | **Lené Goosen** | Goosen / Lené | FINANCE_ROLE_CONFIRMED | — | — | Libstar | Western Cape/Cape Town | https://www.linkedin.com/in/len/ |
| 268 | **Reece Gordon** | Gordon / Reece | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Western Cape/Somerset West | https://www.linkedin.com/in/reece-gordon-ca-sa-415263223/ |
| 269 | **Zhané Gorridon** | Gorridon / Zhané | HIGH_CONFIDENCE | AGA(SA) | SAICA | Fraxion | Western Cape | — |
| 270 | **Kathleen Gouws** | Gouws / Kathleen | FINANCE_ROLE_CONFIRMED | — | — | Macsteel | South Africa | https://www.linkedin.com/in/kathleen-gouws-95b08989/ |
| 271 | **Louise Gouws Du Toit** | Gouws Du Toit / Louise | FINANCE_ROLE_CONFIRMED | — | — | Kaap Agri / Agrimark | South Africa | https://www.linkedin.com/in/louise-gouws-du-toit-18178a14b/ |
| 272 | **Anneline Govender** | Govender / Anneline | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/ethan-horovitz-b4853277/ |
| 273 | **Chernel Govender** | Govender / Chernel | FINANCE_ROLE_CONFIRMED | — | — | Ardagh Glass Packaging SA | Gauteng/City of Johannesburg | https://www.linkedin.com/in/chernel-govender-75935028/ |
| 274 | **Deshnee Govender** | Govender / Deshnee | FINANCE_ROLE_CONFIRMED | — | — | Mpact | KwaZulu-Natal/Ballito | https://www.linkedin.com/in/deshnee-govender-01a433186/ |
| 275 | **Ellendhren Govender** | Govender / Ellendhren | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Gauteng/Randburg | https://www.linkedin.com/in/ellendhren-govender-152b55207/ |
| 276 | **Emanuel Govender** | Govender / Emanuel | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/emanuel-govender-507293138/ |
| 277 | **Lavanya Govender** | Govender / Lavanya | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | Johannesburg Metropolitan Area | https://www.linkedin.com/in/lavanya-govender-302577196/ |
| 278 | **Michelle Govender** | Govender / Michelle | FINANCE_ROLE_CONFIRMED | — | — | Capespan South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/michelle-govender-93bb20124/ |
| 279 | **Tanya Govender** | Govender / Tanya | FINANCE_ROLE_CONFIRMED | — | — | RFG Foods | KwaZulu-Natal/KwaZulu-Natal | https://www.linkedin.com/in/tanya-govender-0356441b9/ |
| 280 | **Louis Grant** | Grant / Louis | FINANCE_ROLE_CONFIRMED | — | — | EnviroServ | Gauteng/Johannesburg | https://www.linkedin.com/in/louis-grant-55390735/ |
| 281 | **Grant Greeff** | Greeff / Grant | CONFIRMED | CA(SA) | SAICA | Drone Ops Group | — | — |
| 282 | **Lerenzo Greeff** | Greeff / Lerenzo | CONFIRMED | PA(SA) | SAIPA | African Unity Life | Western Cape | https://za.linkedin.com/in/lerenzo-greeff-pa-sa-339064146 |
| 283 | **Rene Greeff** | Greeff / Rene | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Mpumalanga/Mkhondo Local Municipality | https://www.linkedin.com/in/rene-greeff-088701a8/ |
| 284 | **Willem Greeff** | Greeff / Willem | FINANCE_ROLE_CONFIRMED | — | — | Much Asphalt | Western Cape/Cape Town | https://www.linkedin.com/in/willem-greeff-23836635/ |
| 285 | **Morgan Gregory** | Gregory / Morgan | CONFIRMED | CA(SA) | SAICA | MK Aerospace SA | Western Cape/Cape Town | https://www.linkedin.com/in/morgan-gregory-ca-sa-64046117b/ |
| 286 | **Nicole Grendeling** | Grendeling / Nicole | CONFIRMED | CA(SA) | SAICA | Astron Energy | Western Cape/City of Cape Town | https://www.linkedin.com/in/nicole-grendeling-ca-sa-bb99a7150/ |
| 287 | **Christanet Grewar** | Grewar / Christanet | CONFIRMED | ACCA | ACCA | PKF Cape Town | Western Cape/Cape Town | https://za.linkedin.com/in/christanet-grewar-acca-saipa-27a9195a |
| 288 | **Bianca Greyling** | Greyling / Bianca | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Gauteng/Gauteng | https://www.linkedin.com/in/bianca-greyling-6307819a/ |
| 289 | **Carmen Gribble** | Gribble / Carmen | RESEARCH_HOLD | ACMA, CGMA | CIMA | Super Group / SGHC | Western Cape/Cape Town | — |
| 290 | **Mer-Lynn Griego** | Griego / Mer-Lynn | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Western Cape/City of Cape Town | https://www.linkedin.com/in/mer-lynn-griego-4969128b/ |
| 291 | **Barry Griffin** | Griffin / Barry | RESEARCH_HOLD | — | — | — | Western Cape | https://uk.linkedin.com/in/barry-griffin-5b4b691ab |
| 292 | **Shahied Griffin** | Griffin / Shahied | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/shahied-griffin-0b6203128/ |
| 293 | **Danie Grobbelaar** | Grobbelaar / Danie | RESEARCH_HOLD | — | — | 123CONSULTING | Western Cape | https://za.linkedin.com/in/danie-grobbelaar-a1318b118 |
| 294 | **Fritz Grobbelaar** | Grobbelaar / Fritz | CONFIRMED | CA(SA) | SAICA | Premier FMCG (Pty) Ltd | Gauteng/Johannesburg | https://za.linkedin.com/in/fritzgrobbelaar/ |
| 295 | **Andre Grobler** | Grobler / Andre | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/andregrobler/ |
| 296 | **Amanda Groenewald** | Groenewald / Amanda | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/amanda-groenewald-a63a93110/ |
| 297 | **Breyton Groenewald** | Groenewald / Breyton | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/breyton-groenewald-50803258 |
| 298 | **Innocent Gumbochuma** | Gumbochuma / Innocent | CONFIRMED | — | — | South African Qualifications Authority (SAQA) | Gauteng/Pretoria | — |
| 299 | **Owen Gush** | Gush / Owen | FINANCE_ROLE_CONFIRMED | — | — | Ladismith Cheese / Woodlands Dairy Group | Eastern Cape/Port Elizabeth | https://www.linkedin.com/in/owen-gush-29051371/ |
| 300 | **Asanda Gwiliza** | Gwiliza / Asanda | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/asanda-gwiliza-4954901b5/ |
| 301 | **Lyle Haas** | Haas / Lyle | CONFIRMED | AGA(SA) | SAICA | — | Western Cape | https://za.linkedin.com/in/lyle-haas-439118136 |
| 302 | **Alicia Haasbroek** | Haasbroek / Alicia | CONFLICTING | — | — | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 303 | **Andrea Haasbroek** | Haasbroek / Andrea | CONFIRMED | PA(SA) | SAIPA | — | Western Cape | https://za.linkedin.com/in/andrea-haasbroek-83b44985 |
| 304 | **Christine Haasbroek** | Haasbroek / Christine | CONFIRMED | PA(SA) | SAIPA | Bryce Monitoring (Pty) Ltd | Western Cape/Paarl | https://za.linkedin.com/in/christine-haasbroek-professional-accountant-sa-911057b2 |
| 305 | **Matthew Hall** | Hall / Matthew | FINANCE_ROLE_CONFIRMED | — | — | Raubex / Roadmac Surfacing Cape | South Africa | https://www.linkedin.com/in/matthew-hall-1b045bba/ |
| 306 | **Taryn Hamid** | Hamid / Taryn | CONFIRMED | PA(SA) | SAIPA | Bateleur Capital | Western Cape | https://za.linkedin.com/in/taryn-hamid-professional-accountant-s-a-616a5751 |
| 307 | **Desray Hamilton** | Hamilton / Desray | FINANCE_ROLE_CONFIRMED | — | — | Ardagh Glass Packaging SA | South Africa | https://www.linkedin.com/in/desray-hamilton-25a1a726/ |
| 308 | **Ashley Hanekom** | Hanekom / Ashley | CONFIRMED | CA(SA) | SAICA | Superside | Western Cape/Cape Town | https://www.linkedin.com/in/ashleyhanekom/ |
| 309 | **Cornelius Hanekom** | Hanekom / Cornelius | CONFIRMED | ACMA, CGMA | CIMA | amplify5 | Western Cape/Cape Town | https://za.linkedin.com/in/cornelius-hanekom |
| 310 | **Yvette Hanekom** | Hanekom / Yvette | RESEARCH_HOLD | — | — | Products, Supply Chain & Functional Finance, Ecowize | Western Cape | — |
| 311 | **Samantha Hanke** | Hanke / Samantha | CONFIRMED | CA(SA) | SAICA | Afrimat | Western Cape/Cape Town | https://www.linkedin.com/in/samantha-hanke-ca-sa-b923b1166/ |
| 312 | **Romona Harisunker** | Harisunker / Romona | CONFIRMED | AGA(SA) | SAICA | Turn Capital - Single Family Office | Western Cape/Cape Town | https://za.linkedin.com/in/romona-harisunker-aga-sa-7a495a108 |
| 313 | **Magda Harmse** | Harmse / Magda | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/magda-harmse-5940a540/ |
| 314 | **Linda Harris** | Harris / Linda | FINANCE_ROLE_CONFIRMED | — | — | Tronox Namakwa Sands | Western Cape/Hermanus | https://www.linkedin.com/in/linda-harris-13293129/ |
| 315 | **Nicole Harris** | Harris / Nicole | CONFIRMED | CA(SA) | SAICA | WBHO Construction - Cape Division | Johannesburg Metropolitan Area | https://www.linkedin.com/in/nicole-harris-ca-sa-8b6171150/ |
| 316 | **Monique Harrison** | Harrison / Monique | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/monique-harrison-50409aa7 |
| 317 | **Portia Harrison** | Harrison / Portia | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Western Cape/Cape Town | https://www.linkedin.com/in/portia-harrison-589184121/ |
| 318 | **Shereen Hartnick** | Hartnick / Shereen | FINANCE_ROLE_CONFIRMED | — | — | Peninsula Beverages | Western Cape/City of Cape Town | https://www.linkedin.com/in/shereen-hartnick-25a6101a/ |
| 319 | **Warnick Hartzenberg** | Hartzenberg / Warnick | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Western Cape/City of Cape Town | https://www.linkedin.com/in/warnick-hartzenberg/ |
| 320 | **Imtiaaz Hashim** | Hashim / Imtiaaz | CONFIRMED | CA(SA) | SAICA | BDO South Africa | Western Cape/Cape Town | — |
| 321 | **Gail Hatting** | Hatting / Gail | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | — | https://www.linkedin.com/in/gail-hatting-5ba77176/ |
| 322 | **Ashlin Healy** | Healy / Ashlin | CONFIRMED | CA(SA) | SAICA | Deloitte (South Africa) | Western Cape/Cape Town | https://www.linkedin.com/in/ashlin-healy-ca-sa-130238103/ |
| 323 | **Illana Helman** | Helman / Illana | CONFIRMED | CA(SA) | SAICA | Massmart | Gauteng/Johannesburg | https://www.linkedin.com/in/illana-helman-ca-sa-1279b117/ |
| 324 | **Fahdwa Hendricks** | Hendricks / Fahdwa | CONFIRMED | AGA(SA) | SAICA | Global Load Control | Western Cape/Cape Town | https://za.linkedin.com/in/fahdwa-hendricks-aga-sa-b0a37238 |
| 325 | **Geyrieya Hendricks** | Hendricks / Geyrieya | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | South Africa | https://www.linkedin.com/in/geyrieya-hendricks-407454194/ |
| 326 | **Jacobie Hendricks** | Hendricks / Jacobie | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/jacobie-hendricks-2273a620a/ |
| 327 | **Joshua Hendricks** | Hendricks / Joshua | CONFIRMED | AGA(SA) | SAICA | Anthem | Western Cape/Cape Town | https://za.linkedin.com/in/joshua-hendricks-aga-sa-60790192 |
| 328 | **Kieran Herbert** | Herbert / Kieran | ARTICLES_CONFIRMED_DESIGNATION_UNVERIFIED | — | — | BGC | Western Cape | https://za.linkedin.com/in/kieran-herbert-671b64149 |
| 329 | **Jeroen Herweijer** | Herweijer / Jeroen | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/jeroen-herweijer-73b70316 |
| 330 | **Bronvin Heuvel** | Heuvel / Bronvin | CONFIRMED | CA(SA) | SAICA | KPMG (South Africa) | Western Cape/Cape Town | https://www.linkedin.com/in/bronvin-heuvel-ca-sa-ra-7b2475a9/ |
| 331 | **Barry Heyns** | Heyns / Barry | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Stellenbosch | https://www.linkedin.com/in/bernhardheyns/ |
| 332 | **Lerato Hillman** | Hillman / Lerato | CONFIRMED | ACCA | ACCA | Not publicly confirmed | Western Cape/Cape Town | https://za.linkedin.com/in/lerato-hillman-acca-4b482663 |
| 333 | **Patience Hlongwane** | Hlongwane / Patience | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Gauteng/Pretoria | https://www.linkedin.com/in/patience-hlongwane-743b48235/ |
| 334 | **Debra Hlophe, nèe Modiba** | Hlophe, nèe Modiba / Debra | FINANCE_ROLE_CONFIRMED | — | — | Concor | Gauteng/City of Johannesburg | https://www.linkedin.com/in/debra-hlophe-nèe-modiba-27451337/ |
| 335 | **Mduduzi Hlubi** | Hlubi / Mduduzi | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/mduduzi-hlubi-a21b1262/ |
| 336 | **susan hodgkinson** | hodgkinson / susan | FINANCE_ROLE_CONFIRMED | — | — | Concor | Gauteng/Johannesburg | https://www.linkedin.com/in/susan-hodgkinson-b31905248/ |
| 337 | **Mieke Hoffman** | Hoffman / Mieke | CONFIRMED | ACMA, CGMA | CIMA | The Fieldbar Co. | Western Cape/Cape Town | https://za.linkedin.com/in/mieke-hoffman |
| 338 | **Servaas Hofmeyr ACMA, CGMA, MBA** | Hofmeyr ACMA, CGMA, MBA / Servaas | CONFIRMED | ACMA, CGMA | CIMA | Cape Mohair | Western Cape | https://za.linkedin.com/in/servaas-hofmeyr-021b071b |
| 339 | **Caron Hol** | Hol / Caron | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Western Cape/City of Cape Town | https://www.linkedin.com/in/caron-hol-65299a71/ |
| 340 | **Steven Holmes** | Holmes / Steven | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Gauteng/City of Johannesburg | https://www.linkedin.com/in/steven-holmes-04461511/ |
| 341 | **Anntoinique Holtzhauzen** | Holtzhauzen / Anntoinique | CONFIRMED | PA(SA) | SAIPA | — | Western Cape | https://za.linkedin.com/in/anntoinique-holtzhauzen-b1830052 |
| 342 | **Susan Homann** | Homann / Susan | FINANCE_ROLE_CONFIRMED | — | — | Tronox Namakwa Sands | KwaZulu-Natal/KwaZulu-Natal | https://www.linkedin.com/in/susan-homann-407a2389/ |
| 343 | **Tim Horak** | Horak / Tim | CONFIRMED | ACMA, CGMA | CIMA | Parmalat South Africa / Africa | Western Cape/Cape Town | https://za.linkedin.com/in/tim-horak-acma-cgma-54272ab0 |
| 344 | **Armand Horst** | Horst / Armand | FINANCE_ROLE_CONFIRMED | — | — | WastePlan | Gauteng/Johannesburg | https://www.linkedin.com/in/armandhorst/ |
| 345 | **Donovan Humphreys** | Humphreys / Donovan | CONFIRMED | CA(SA) | SAICA | Samsonite Southern Africa | KwaZulu-Natal/Durban | https://za.linkedin.com/in/donovan-humphreys-a13b52a9/ |
| 346 | **Sunell Humphris** | Humphris / Sunell | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Port Elizabeth Metropolitan Area | https://www.linkedin.com/in/sunell-humphris-71771b170/ |
| 347 | **Rensche-Mari Hurter (Jansen)** | Hurter (Jansen) / Rensche-Mari | CONFIRMED | CGMA | CIMA | Corpag | Western Cape/Cape Town | https://za.linkedin.com/in/rensche-mari-hurter-jansen-cgma%C2%AE-2aab466b |
| 348 | **André Huysamer** | Huysamer / André | HIGH_CONFIDENCE | AGA(SA) | SAICA | Kula | Western Cape/Worcester | — |
| 349 | **Darren Isaacs** | Isaacs / Darren | CONFIRMED | CA(SA) | SAICA | Makosi | — | — |
| 350 | **Juanita Isaacs** | Isaacs / Juanita | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Western Cape/City of Cape Town | https://www.linkedin.com/in/juanita-isaacs-88006724a/ |
| 351 | **Kim Isaacs** | Isaacs / Kim | CONFIRMED | PA(SA) | SAIPA | Providence Hotels | Western Cape/South Africa | https://za.linkedin.com/in/kimnikitaisaacs |
| 352 | **Tony Isaacs** | Isaacs / Tony | RESEARCH_HOLD | — | — | Educor | Western Cape | https://za.linkedin.com/in/tony-isaacs-ab079a36 |
| 353 | **Craig Isler** | Isler / Craig | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/City of Cape Town | https://www.linkedin.com/in/craig-isler-b3a43497/ |
| 354 | **Fazel Ismail** | Ismail / Fazel | HIGH_CONFIDENCE | — | — | Water Research Commission (WRC) | Gauteng/Pretoria | — |
| 355 | **Parveen Ismail** | Ismail / Parveen | FINANCE_ROLE_CONFIRMED | — | — | I&J | Western Cape/Cape Town | https://www.linkedin.com/in/parveen-ismail-001001273/ |
| 356 | **Stuart Izatt** | Izatt / Stuart | CONFIRMED | ACMA, CGMA | CIMA | Commercial Cold Holdings | Western Cape/Cape Town | https://za.linkedin.com/in/stuart-izatt-cgma-acma-47535815 |
| 357 | **Aldrin Jacobs** | Jacobs / Aldrin | FINANCE_ROLE_CONFIRMED | — | — | Bowler Metcalf / Bowler Plastics | Western Cape/Cape Town | https://za.linkedin.com/in/aldrin-jacobs-56b72a9b |
| 358 | **Anilynne Jacobs** | Jacobs / Anilynne | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Western Cape/City of Cape Town | https://www.linkedin.com/in/anilynne-jacobs-265963165/ |
| 359 | **Anthea Jacobs** | Jacobs / Anthea | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/Cape Town | https://www.linkedin.com/in/anthea-jacobs/ |
| 360 | **Caryn Jacobs** | Jacobs / Caryn | CONFIRMED | AGA(SA) | SAICA | Betway SA20 | Western Cape/Cape Town | https://za.linkedin.com/in/caryn-jacobs-cfm-aga-sa-a9223383 |
| 361 | **Kyle Jacobs** | Jacobs / Kyle | FINANCE_ROLE_CONFIRMED | — | — | Kropz Elandsfontein | Western Cape/City of Cape Town | https://www.linkedin.com/in/kyle-jacobs-17aa7816b/ |
| 362 | **Anthea Jacobs (Hendricks)** | Jacobs (Hendricks) / Anthea | FINANCE_ROLE_CONFIRMED | — | — | KWV | Western Cape/Paarl | https://www.linkedin.com/in/anthea-hendricks-ca-sa-02501453/ |
| 363 | **Lisa Jainundh** | Jainundh / Lisa | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group | South Africa | https://www.linkedin.com/in/lisa-jainundh-96b67199/ |
| 364 | **Alicia Jamneck** | Jamneck / Alicia | CONFIRMED | AGA(SA) | SAICA | Hero Holdings | Western Cape/Paarl | https://za.linkedin.com/in/alicia-jamneck-aga-sa-73b03a128 |
| 365 | **Mamogoto Jan Mokoala** | Jan Mokoala / Mamogoto | FINANCE_ROLE_CONFIRMED | — | — | Sunrise Energy | Gauteng/City of Johannesburg | https://www.linkedin.com/in/mamogoto-jan-mokoala-09a527b/ |
| 366 | **Bea Jansen van Rensburg** | Jansen van Rensburg / Bea | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/bea-jansen-van-rensburg-a9697432 |
| 367 | **Roelof Jansen van Vuuren** | Jansen van Vuuren / Roelof | HIGH_CONFIDENCE | PA(SA) | SAIPA | The Tax Shop Pretoria North East | Gauteng/Pretoria | — |
| 368 | **SP Jansen van Vuuren** | Jansen van Vuuren / SP | FINANCE_ROLE_CONFIRMED | — | — | WastePlan | Johannesburg Metropolitan Area | https://www.linkedin.com/in/sp-jansen-van-vuuren-aga-sa-71540025a/ |
| 369 | **Alana Johns** | Johns / Alana | HIGH_CONFIDENCE | PA(SA) | SAIPA | — | Western Cape | — |
| 370 | **Charne Johnston** | Johnston / Charne | FINANCE_ROLE_CONFIRMED | — | — | Capespan South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/charnejohnston1/ |
| 371 | **Mark Jolliffe** | Jolliffe / Mark | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/mark-jolliffe-537803171/ |
| 372 | **Jeanette Jonker** | Jonker / Jeanette | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Western Cape/City of Cape Town | https://www.linkedin.com/in/jeanette-jonker-47878678/ |
| 373 | **Gaylin Jonkers** | Jonkers / Gaylin | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/gaylin-jonkers-37662457/ |
| 374 | **Samoray Jooste** | Jooste / Samoray | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/samoray-jooste-383191b7/ |
| 375 | **Anja Jordaan** | Jordaan / Anja | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/anja-jordaan-946bbb81/ |
| 376 | **Dean Jordaan** | Jordaan / Dean | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/dean-jordaan-7b331a1b3/ |
| 377 | **Melanie Jordaan** | Jordaan / Melanie | CONFIRMED | PA(SA) | SAIPA | Macrel Petroleum / Cale group | Western Cape/Kuils River | https://za.linkedin.com/in/melanie-jordaan-11b2a21a0 |
| 378 | **Francois Joubert** | Joubert / Francois | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 379 | **AJ Julies** | Julies / AJ | FINANCE_ROLE_CONFIRMED | — | — | RFG Foods | Western Cape/Paarl | https://www.linkedin.com/in/aj-julies-ca-sa-b7628699/ |
| 380 | **Kim Julies** | Julies / Kim | CONFIRMED | CA(SA) | SAICA | Novus Holdings Ltd | Western Cape/Cape Town | — |
| 381 | **Ashley Julius** | Julius / Ashley | FINANCE_ROLE_CONFIRMED | — | — | KWV | Western Cape/City of Cape Town | https://www.linkedin.com/in/ashley-julius-a9192631/ |
| 382 | **Thapelo K. Matlawe** | K. Matlawe / Thapelo | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/thapelo-k-matlawe-ab34a5178/ |
| 383 | **Sumaya Kader** | Kader / Sumaya | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/sumaya-kader-ca-sa-b5b32a1a3/ |
| 384 | **Anathi Kamkam** | Kamkam / Anathi | HIGH_CONFIDENCE | AGA(SA) | SAICA | Old Mutual Investment Group | Western Cape/Cape Town | — |
| 385 | **Adrian Kandan** | Kandan / Adrian | CONFIRMED | AGA(SA), ACMA, CGMA | SAICA, CIMA | ooba Home Loans | Western Cape/Cape Town | https://za.linkedin.com/in/adrian-kandan-aga-sa-acma-cgma-92749591 |
| 386 | **Nethin Karamchand** | Karamchand / Nethin | CONFIRMED | CA(SA) | SAICA | Deloitte (South Africa) | Western Cape/Cape Town | https://www.linkedin.com/in/nethin/ |
| 387 | **Lindsay Karools** | Karools / Lindsay | CONFIRMED | PA(SA) | SAIPA | The Building Company | Western Cape | https://za.linkedin.com/in/lindsay-karools-48581816b |
| 388 | **Carmen Karsten** | Karsten / Carmen | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/carmen-karsten-acma-cgma-464a46120/ |
| 389 | **Fia Karstens** | Karstens / Fia | FINANCE_ROLE_CONFIRMED | — | — | Capespan South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/fia-karstens-995225155/ |
| 390 | **Willem Kasselman** | Kasselman / Willem | CONFIRMED | ACMA, CGMA | CIMA | Biosylx | Western Cape/Paarl | https://za.linkedin.com/in/willem-kasselman |
| 391 | **Jo-Lee Keefe** | Keefe / Jo-Lee | FINANCE_ROLE_CONFIRMED | — | — | SA Metal Group | Gauteng/City of Johannesburg | https://www.linkedin.com/in/jo-lee-keefe-46b695100/ |
| 392 | **Bradley Kent** | Kent / Bradley | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | Gauteng/City of Johannesburg | https://www.linkedin.com/in/bradley-kent-240798171/ |
| 393 | **khomotso kgapane** | kgapane / khomotso | FINANCE_ROLE_CONFIRMED | — | — | EnviroServ | Gauteng/Johannesburg | https://www.linkedin.com/in/khomotso-kgapane-7b137773/ |
| 394 | **Bridgete Kgopane** | Kgopane / Bridgete | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/Pretoria | https://www.linkedin.com/in/bridgete-kgopane-ab8485258/ |
| 395 | **Zaiba Khan** | Khan / Zaiba | CONFIRMED | PA(SA) | SAIPA | PSG Konsult | Western Cape | https://za.linkedin.com/in/zaiba-khan-2396a865 |
| 396 | **Keneuwe Khati** | Khati / Keneuwe | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/Cape Town | https://www.linkedin.com/in/keneuwe-khati-584b7951/ |
| 397 | **Talifhani Khubana** | Khubana / Talifhani | CONFIRMED | — | — | South African Human Rights Commission (SAHRC) | Gauteng/Johannesburg | — |
| 398 | **Koko Khumalo** | Khumalo / Koko | CONFIRMED | CA(SA) | SAICA | Motlanalo Chartered Accountants and Auditors Inc | — | — |
| 399 | **Sithembiso Khumalo** | Khumalo / Sithembiso | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Gauteng/City of Johannesburg | https://www.linkedin.com/in/sithembiso-khumalo-725914117/ |
| 400 | **Carla Kilian** | Kilian / Carla | HIGH_CONFIDENCE | PA(SA) | SAIPA | AETOS Financial Services | Gauteng/Roodepoort | — |
| 401 | **Roland Killian** | Killian / Roland | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Gauteng/City of Johannesburg | https://www.linkedin.com/in/roland-killian-ca-sa-471a42a2/ |
| 402 | **Matthew Kiln** | Kiln / Matthew | CONFIRMED | ACMA, CGMA | CIMA | Tripco | Western Cape/Stellenbosch | https://za.linkedin.com/in/matthew-kiln-a19746253 |
| 403 | **Jason King** | King / Jason | CONFIRMED | PA(SA) | SAIPA | Tintswalo Collection | Western Cape/Cape Town | https://za.linkedin.com/in/jason-king-48871b12 |
| 404 | **Sharon King** | King / Sharon | FINANCE_ROLE_CONFIRMED | — | — | AfriSam | — | https://www.linkedin.com/in/sharon-king-king-53321053/ |
| 405 | **Cheslin Klaasen** | Klaasen / Cheslin | CONFIRMED | PA(SA) | SAIPA | Advania UK | Western Cape/Cape Town | https://za.linkedin.com/in/cheslin-klaasen-professional-accountant-sa-45840451 |
| 406 | **Cheslin Klaasen** | Klaasen / Cheslin | HIGH_CONFIDENCE | PA(SA) | SAIPA | Advania UK | Western Cape | — |
| 407 | **Enrico Kleinbooi** | Kleinbooi / Enrico | CONFIRMED | CA(SA) | SAICA | Kannaland Municipality | Western Cape/Ladismith | — |
| 408 | **Henko Kleynhans** | Kleynhans / Henko | FINANCE_ROLE_CONFIRMED | — | — | Libstar | Western Cape/Cape Town | https://www.linkedin.com/in/henko-kleynhans/ |
| 409 | **Michelle Kleynhans** | Kleynhans / Michelle | RESEARCH_HOLD | — | — | — | Western Cape/Western Cape candidate pool | https://za.linkedin.com/in/michelle-kleynhans-9ab9a12aa |
| 410 | **Melissa Klopper** | Klopper / Melissa | FINANCE_ROLE_CONFIRMED | — | — | DGB | Gauteng/City of Johannesburg | https://www.linkedin.com/in/melissa-klopper-4286421a5/ |
| 411 | **Tracey Klopper** | Klopper / Tracey | CONFIRMED | AGA(SA) | SAICA | JTC Group | Western Cape/Cape Town | https://za.linkedin.com/in/tracey-klopper-aga-sa-663471144 |
| 412 | **Francois Knoetze** | Knoetze / Francois | CONFIRMED | ACMA, CGMA | CIMA | iBanqSA | Western Cape/Stellenbosch | https://za.linkedin.com/in/francois-knoetze |
| 413 | **Karmen Koch** | Koch / Karmen | FINANCE_ROLE_CONFIRMED | — | — | Chryso Southern Africa | Gauteng/City of Johannesburg | https://www.linkedin.com/in/karmen-koch-03b9b0106/ |
| 414 | **Daniel Koegelenberg** | Koegelenberg / Daniel | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Western Cape/City of Cape Town | https://www.linkedin.com/in/daniel-koegelenberg-72546291/ |
| 415 | **Rutger Koeman** | Koeman / Rutger | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Johannesburg Metropolitan Area | https://www.linkedin.com/in/rutgerkoeman/ |
| 416 | **Nkalipho Koenane** | Koenane / Nkalipho | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | KwaZulu-Natal/Empangeni | https://www.linkedin.com/in/nkalipho-koenane-625689248/ |
| 417 | **Tommie Koeries** | Koeries / Tommie | CONFIRMED | CA(SA), ACMA, CGMA | SAICA, CIMA | Much Asphalt | Western Cape/Cape Town | https://www.linkedin.com/in/tommie-koeries-366bb433/ |
| 418 | **Rescha Kok** | Kok / Rescha | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/rescha-kok-07971471/ |
| 419 | **Mihlali Kosi** | Kosi / Mihlali | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Eastern Cape/Port Elizabeth | https://www.linkedin.com/in/mihali-kosi-1923ab91/ |
| 420 | **Dirk Kotze** | Kotze / Dirk | CONFIRMED | CA(SA) | SAICA | Afrimat | Western Cape/City of Cape Town | https://www.linkedin.com/in/dirk-kotze-09818018/ |
| 421 | **Magda Kotze** | Kotze / Magda | FINANCE_ROLE_CONFIRMED | — | — | Power Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/magda-kotze-a479a3116/ |
| 422 | **Nils Kotze** | Kotze / Nils | FINANCE_ROLE_CONFIRMED | — | — | Raubex / Roadmac Surfacing Cape | Free State/Bloemfontein | https://www.linkedin.com/in/nils-kotze-07344180/ |
| 423 | **Bianca Krishna** | Krishna / Bianca | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | KwaZulu-Natal/Durban | https://www.linkedin.com/in/bianca-krishna-ca-sa-a365a5263/ |
| 424 | **Christie Kruger** | Kruger / Christie | FINANCE_ROLE_CONFIRMED | — | — | Spier | Western Cape/Paarl | https://www.linkedin.com/in/christie-kruger-41a922307/ |
| 425 | **Elna Kruger** | Kruger / Elna | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/elna-kruger-37804a160/ |
| 426 | **Kabelo Kuduntwane** | Kuduntwane / Kabelo | CONFIRMED | CA(SA) | SAICA | WBHO Construction - Cape Division | Gauteng/Pretoria | https://www.linkedin.com/in/kabelo-kuduntwane-ca-sa-0a52431a6/ |
| 427 | **Anela Kumnandi Dumalisile** | Kumnandi Dumalisile / Anela | CONFIRMED | ACMA, CGMA | CIMA | Blue Seas Products (Pty) Ltd | Western Cape/Cape Town | https://za.linkedin.com/in/anela-kumnandi-dumalisile-acma-cgma-1a483910b |
| 428 | **Dylin Kuni** | Kuni / Dylin | CONFIRMED | ACMA, CGMA | CIMA | M+C Saatchi Group | Western Cape/Cape Town | https://www.linkedin.com/in/dylinkuni/ |
| 429 | **Faraimose Kutadzaushe** | Kutadzaushe / Faraimose | CONFIRMED | CA(SA), CA(Zimbabwe), CFA | SAICA | M-KOPA | Outside South Africa (Kenya; Sage Africa & Middle East channel)/Nairobi | https://www.linkedin.com/in/faraimose-kutadzaushe-cfa-40a628a |
| 430 | **Ben Kutlwano Motsweni** | Kutlwano Motsweni / Ben | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Stellenbosch | https://www.linkedin.com/in/ben-kutlwano-motsweni-341974258/ |
| 431 | **Lesetja Kwetepane** | Kwetepane / Lesetja | HIGH_CONFIDENCE | PA(SA) | SAIPA | LA Financial Services (Pty) Ltd | Limpopo/Polokwane | — |
| 432 | **Terri Ladbrooke** | Ladbrooke / Terri | FINANCE_ROLE_CONFIRMED | — | — | Libstar | Western Cape/Cape Town | — |
| 433 | **Terri Ladbrooke** | Ladbrooke / Terri | CONFIRMED | CA(SA) | SAICA | Libstar | Western Cape/Cape Town | — |
| 434 | **Garthan Lakay** | Lakay / Garthan | FINANCE_ROLE_CONFIRMED | — | — | Kaap Agri / Agrimark | Western Cape/City of Cape Town | https://www.linkedin.com/in/garthan-lakay-bb980214b/ |
| 435 | **Div Lamprecht** | Lamprecht / Div | CONFIRMED | CA(SA) | SAICA | SAICA | Free State/Bloemfontein | — |
| 436 | **Malvin Lancelot Makanda** | Lancelot Makanda / Malvin | CONFIRMED | AGA(SA) | SAICA | Cecil Kilpin & Co | Western Cape/Cape Town | https://za.linkedin.com/in/malvin-lancelot-makanda-aga-sa-69517716a |
| 437 | **Anel Laubscher** | Laubscher / Anel | FINANCE_ROLE_CONFIRMED | — | — | Commercial Cold Holdings | Western Cape/Cape Town | https://www.linkedin.com/in/anel-laubscher-27933270/ |
| 438 | **Elize Laubscher** | Laubscher / Elize | FINANCE_ROLE_CONFIRMED | — | — | Tronox Namakwa Sands | Western Cape/Saldanha Bay Local Municipality | https://www.linkedin.com/in/elize-laubscher-8999336b/ |
| 439 | **Ell-Mae Lawrence** | Lawrence / Ell-Mae | FINANCE_ROLE_CONFIRMED | — | — | Kaap Agri / Agrimark | Western Cape/Paarl | https://www.linkedin.com/in/ell-mae-lawrence-ca-sa-54928927b/ |
| 440 | **Magdel Le Grange** | Le Grange / Magdel | RESEARCH_HOLD | CGMA | CIMA | Rolls-Royce Power Systems AG | Western Cape/Cape Town | — |
| 441 | **Rose Leduma** | Leduma / Rose | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | Gauteng/Johannesburg | https://www.linkedin.com/in/rose-leduma-488895214/ |
| 442 | **Dineo Ledwaba** | Ledwaba / Dineo | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Johannesburg Metropolitan Area | https://www.linkedin.com/in/dineo-ledwaba-0b57885a/ |
| 443 | **Mr Lee Xaba** | Lee Xaba / Mr | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/Gauteng | https://www.linkedin.com/in/mr-lee-xaba-1b88142a/ |
| 444 | **Eric le Roux** | le Roux / Eric | FINANCE_ROLE_CONFIRMED | — | — | Kaap Agri / Agrimark | South Africa | https://www.linkedin.com/in/eric-le-roux-896ab518a/ |
| 445 | **Ina Leroux** | Leroux / Ina | RESEARCH_HOLD | — | — | ABS Genetics South Africa | Western Cape | https://za.linkedin.com/in/ina-leroux-31864170 |
| 446 | **Johan le Roux** | le Roux / Johan | CONFIRMED | CA(SA) | SAICA | Johan le Roux CA(SA) | Western Cape/Milnerton (Cape Town) | — |
| 447 | **Lindi le Roux** | le Roux / Lindi | FINANCE_ROLE_CONFIRMED | — | — | Blaauwberg Cold Storage | South Africa | https://za.linkedin.com/in/lindi-le-roux-0b2360164 |
| 448 | **Thinus Le Roux** | Le Roux / Thinus | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 449 | **Tabisa Liborie Singenile Nkomo** | Liborie Singenile Nkomo / Tabisa | CONFIRMED | ACMA, CGMA | CIMA | WBHO Construction - Cape Division | Johannesburg Metropolitan Area | https://www.linkedin.com/in/tabisa-liborie-singenile-nkomo-cgma®-acma-3932b299/ |
| 450 | **Justin Liebenberg** | Liebenberg / Justin | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | Gauteng/City of Johannesburg | https://www.linkedin.com/in/justin-liebenberg-9154b9108/ |
| 451 | **Elizabeth Lindeque** | Lindeque / Elizabeth | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/elizabeth-lindeque-bb1ba11b |
| 452 | **Naledi Liphapang** | Liphapang / Naledi | HIGH_CONFIDENCE | CA(SA) | SAICA | — | — | — |
| 453 | **James Liston** | Liston / James | CONFIRMED | CA(SA) | SAICA | Mpact | Gauteng/City of Johannesburg | https://www.linkedin.com/in/james-liston-7516b2170/ |
| 454 | **Puleng Litsibane** | Litsibane / Puleng | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Gauteng/Germiston | https://www.linkedin.com/in/puleng-litsibane-a2440955/ |
| 455 | **Francisca Lloyd** | Lloyd / Francisca | FINANCE_ROLE_CONFIRMED | — | — | Macsteel | Gauteng/Benoni | https://www.linkedin.com/in/francisca-lloyd-11434792/ |
| 456 | **Anne-Lize Lochner** | Lochner / Anne-Lize | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/anne-lize-lochner-b3083421/ |
| 457 | **Claire Lofthouse** | Lofthouse / Claire | FINANCE_ROLE_CONFIRMED | — | — | Cape Herb & Spice | Western Cape/Cape Town | https://www.linkedin.com/in/claire-lofthouse/ |
| 458 | **Andrew Logan** | Logan / Andrew | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/City of Johannesburg | https://www.linkedin.com/in/andrew-logan-77011634/ |
| 459 | **Stephanus Lombard** | Lombard / Stephanus | CONFIRMED | ACMA, CGMA | CIMA | George Whitefield College | Western Cape/Cape Town | https://za.linkedin.com/in/stephanus-lombard-acma-cgma-b74b4096 |
| 460 | **Constant Loubser** | Loubser / Constant | CONFIRMED | ACMA, CGMA | CIMA | Freshworld (Pty) Ltd | Western Cape/Stellenbosch | https://za.linkedin.com/in/constant-loubser-acma-cgma-39960176 |
| 461 | **Eduard Loubser** | Loubser / Eduard | FINANCE_ROLE_CONFIRMED | — | — | Fair Cape Dairies | Western Cape/City of Cape Town | https://www.linkedin.com/in/eduard-loubser-ca-sa-932778175/ |
| 462 | **Anwer Louw** | Louw / Anwer | FINANCE_ROLE_CONFIRMED | — | — | KWV | Western Cape/Cape Town | https://www.linkedin.com/in/anwer-louw-343009292/ |
| 463 | **Eugene Louw** | Louw / Eugene | FINANCE_ROLE_CONFIRMED | — | — | Kromco | Western Cape/City of Cape Town | https://www.linkedin.com/in/eugene-louw-6ab089b9/ |
| 464 | **Johanita Louw** | Louw / Johanita | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/Cape Town | https://www.linkedin.com/in/johanita-louw-a5538060/ |
| 465 | **Lavinia Louw** | Louw / Lavinia | CONFIRMED | AGA(SA) | SAICA | Standish Management | Western Cape/Cape Town | https://za.linkedin.com/in/lavinia-louw-aga-sa-9a2a2915b |
| 466 | **Leandré Louw** | Louw / Leandré | FINANCE_ROLE_CONFIRMED | — | — | Kaap Agri / Agrimark | Western Cape/Malmesbury | https://www.linkedin.com/in/leandré-louw-a46350146/ |
| 467 | **Lindi Louw** | Louw / Lindi | FINANCE_ROLE_CONFIRMED | — | — | Stellenbosch Vineyards / Advini South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/lindi-louw-22b42a11a/ |
| 468 | **Suzaan Louw** | Louw / Suzaan | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group | South Africa | https://www.linkedin.com/in/suzaan-louw-49207339/ |
| 469 | **Yolanda Louw** | Louw / Yolanda | CONFIRMED | CA(SA) | SAICA | Food Lover's Market Holdings | Western Cape/Cape Town | https://www.linkedin.com/in/yolanda-louw-875193a0/ |
| 470 | **Lizane Lubbe** | Lubbe / Lizane | FINANCE_ROLE_CONFIRMED | — | — | Sentraal-Suid Co-operative (SSK) | Western Cape/Swellendam | https://www.linkedin.com/in/lizane-lubbe-42218b121/ |
| 471 | **Busisiwe Lubelwana** | Lubelwana / Busisiwe | HIGH_CONFIDENCE | — | — | Buffalo City Metropolitan Development Agency (BCMDA) | Eastern Cape/East London | — |
| 472 | **Brendon Lucke** | Lucke / Brendon | FINANCE_ROLE_CONFIRMED | — | — | Commercial Cold Holdings | Western Cape/City of Cape Town | https://www.linkedin.com/in/brendon-lucke-01494065/ |
| 473 | **Arline Luiters** | Luiters / Arline | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/arline-luiters-1626bb252/ |
| 474 | **Ewaldi Luus** | Luus / Ewaldi | FINANCE_ROLE_CONFIRMED | — | — | Fair Cape Dairies | Western Cape/Cape Town | https://www.linkedin.com/in/ewaldi-luus-4a06a5212/ |
| 475 | **Bulelani M.** | M. / Bulelani | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/bulelani-m-94b4513a |
| 476 | **Jesca M.** | M. / Jesca | FINANCE_ROLE_CONFIRMED | — | — | Premier Fishing & Brands | Western Cape/City of Cape Town | https://www.linkedin.com/in/jescameki/ |
| 477 | **Cornel Maartens** | Maartens / Cornel | RESEARCH_HOLD | — | — | — | Western Cape/Western Cape candidate pool | https://za.linkedin.com/in/cornel-maartens-a7a83655 |
| 478 | **Heinrich Maartens** | Maartens / Heinrich | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Gauteng/City of Johannesburg | https://www.linkedin.com/in/heinrich-maartens-9bb082b9/ |
| 479 | **Mbali Precious Mabaso** | Mabaso / Mbali | CONFIRMED | CA(SA) | SAICA | Nedbank Group Limited | — | — |
| 480 | **Zuko Maboma** | Maboma / Zuko | FINANCE_ROLE_CONFIRMED | — | — | Premier Fishing & Brands | Western Cape/City of Cape Town | https://www.linkedin.com/in/zukomaboma/ |
| 481 | **Rixongile Mabunda** | Mabunda / Rixongile | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Limpopo/Ba-Phalaborwa Local Municipality | https://www.linkedin.com/in/rixongile-mabunda-4a868797/ |
| 482 | **Nthabeleng Machesa** | Machesa / Nthabeleng | FINANCE_ROLE_CONFIRMED | — | — | Ardagh Glass Packaging SA | Johannesburg Metropolitan Area | https://www.linkedin.com/in/nthabeleng-machesa-ca-sa-19999152/ |
| 483 | **Celeste Maclons** | Maclons / Celeste | FINANCE_ROLE_CONFIRMED | — | — | SA Metal Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/celeste-maclons-15a76156/ |
| 484 | **Sinawo Madlingozi** | Madlingozi / Sinawo | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Eastern Cape/Port Elizabeth | https://www.linkedin.com/in/sinawo-madlingozi-03476b150/ |
| 485 | **Zanele Maduna** | Maduna / Zanele | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 486 | **Ntsikelelo Maduneni** | Maduneni / Ntsikelelo | CONFIRMED | ACMA, CGMA | CIMA | takealot.com | Western Cape/Cape Town | https://za.linkedin.com/in/ntsikelelo |
| 487 | **Victor Madziwa** | Madziwa / Victor | FINANCE_ROLE_CONFIRMED | — | — | Tronox Namakwa Sands | Western Cape/Lutzville | https://www.linkedin.com/in/victor-madziwa-384398144/ |
| 488 | **Thembela Mafu** | Mafu / Thembela | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/Pretoria | https://www.linkedin.com/in/thembela-mafu-6a8b4817a/ |
| 489 | **Gillian Magolie** | Magolie / Gillian | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Western Cape/City of Cape Town | https://www.linkedin.com/in/gillian-magolie-05427865/ |
| 490 | **Sintu Maguga** | Maguga / Sintu | RESEARCH_HOLD | — | — | — | Western Cape/Western Cape candidate pool | https://za.linkedin.com/in/sintu-maguga-3392b53a |
| 491 | **Unathi Magwentshu** | Magwentshu / Unathi | FINANCE_ROLE_CONFIRMED | — | — | Concor | Gauteng/City of Johannesburg | https://www.linkedin.com/in/unathi-magwentshu-aa662834/ |
| 492 | **navin mahabeer** | mahabeer / navin | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/navin-mahabeer-a8b00a26/ |
| 493 | **Nickeel maharaj** | maharaj / Nickeel | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/City of Cape Town | https://www.linkedin.com/in/nickeel-maharaj-a29b12241/ |
| 494 | **Samantha Maharaj** | Maharaj / Samantha | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/samantha-maharaj-6b4730167/ |
| 495 | **Noloyiso Mahlakahlaka-Mhlubulwana** | Mahlakahlaka-Mhlubulwana / Noloyiso | FINANCE_ROLE_CONFIRMED | — | — | Macsteel | Gauteng/City of Johannesburg | https://www.linkedin.com/in/noloyiso-mahlakahlaka-a758128b/ |
| 496 | **Andrew Mahlaku** | Mahlaku / Andrew | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/andrew-mahlaku-a7503336/ |
| 497 | **Kgabiso Mahlangu** | Mahlangu / Kgabiso | CONFIRMED | AGA(SA) | SAICA | South African State Theatre | Gauteng/Pretoria | https://www.linkedin.com/in/kgabiso-mahlangu-aga-sa-b53a951a |
| 498 | **Nkhensani Mahlangu** | Mahlangu / Nkhensani | RESEARCH_HOLD | — | — | — | Western Cape/Western Cape candidate pool | https://za.linkedin.com/in/nkhensani-mahlangu-716576119 |
| 499 | **Sindisiwe Mahlangu** | Mahlangu / Sindisiwe | FINANCE_ROLE_CONFIRMED | — | — | DSV | Johannesburg Metropolitan Area | https://www.linkedin.com/in/sindisiwe-mahlangu-72911b13b/ |
| 500 | **willie mahlangu** | mahlangu / willie | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | South Africa | https://www.linkedin.com/in/willie-mahlangu-ab96771b/ |
| 501 | **Zaf Mahomed** | Mahomed / Zaf | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/Cape Town | https://www.linkedin.com/in/zmahomed/ |
| 502 | **Bonga Majozi** | Majozi / Bonga | FINANCE_ROLE_CONFIRMED | — | — | Peninsula Beverages | Western Cape/City of Cape Town | https://www.linkedin.com/in/bonga-majozi-5892b284/ |
| 503 | **Chanelle Makhanya** | Makhanya / Chanelle | FINANCE_ROLE_CONFIRMED | — | — | HEINEKEN Beverages | Gauteng/City of Johannesburg | https://www.linkedin.com/in/chanelle-makhanya-a3652317/ |
| 504 | **Mathabo Makhaya** | Makhaya / Mathabo | CONFIRMED | CA(SA) | SAICA | Harmony Gold Mining | — | — |
| 505 | **Sonwabile Makhesethi** | Makhesethi / Sonwabile | FINANCE_ROLE_CONFIRMED | — | — | Concor | Gauteng/Gauteng | https://www.linkedin.com/in/sonwabile-makhesethi-00b608204/ |
| 506 | **Mpho Makoko-Hottie** | Makoko-Hottie / Mpho | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 507 | **Patricia Malahlela** | Malahlela / Patricia | CONFIRMED | CA(SA) | SAICA | Mckenzie & Associates | — | — |
| 508 | **David Malan** | Malan / David | RESEARCH_HOLD | — | — | Watcher Surveillance Solutions | Western Cape/Western Cape candidate pool | https://za.linkedin.com/in/david-malan-32aa861b |
| 509 | **Fortunate Malaza** | Malaza / Fortunate | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/Gauteng | https://www.linkedin.com/in/fortunate-malaza-759917b1/ |
| 510 | **Nicky Mametja** | Mametja / Nicky | FINANCE_ROLE_CONFIRMED | — | — | Much Asphalt | Western Cape/Cape Town | https://www.linkedin.com/in/nicky-mametja-23b99b191/ |
| 511 | **Tsireledzo Manabela** | Manabela / Tsireledzo | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Stellenbosch | https://www.linkedin.com/in/tsireledzo-manabela-0b4705233/ |
| 512 | **Phineas Manana** | Manana / Phineas | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/Pretoria | https://www.linkedin.com/in/phineas-manana-7bbb5a22b/ |
| 513 | **Manenzhe Manenzhe** | Manenzhe / Manenzhe | CONFIRMED | FCCA | ACCA | ACCA (South Africa) | Gauteng | https://www.linkedin.com/in/manenzhe-manenzhe-fcca-a80079150/ |
| 514 | **Siseko Maninjwa** | Maninjwa / Siseko | FINANCE_ROLE_CONFIRMED | — | — | Ladismith Cheese / Woodlands Dairy Group | Eastern Cape/Port Elizabeth | https://www.linkedin.com/in/siseko-maninjwa-ca-sa-28615b150/ |
| 515 | **Zaid Manjra** | Manjra / Zaid | CONFIRMED | CA(SA) | SAICA | Woolworths Holdings Ltd | Western Cape/Cape Town | — |
| 516 | **Brandon Manuel** | Manuel / Brandon | CONFIRMED | PA(SA) | SAIPA | MUA Insurance | Western Cape | https://za.linkedin.com/in/brandon-manuel-a7261919 |
| 517 | **Lizo Manyana** | Manyana / Lizo | FINANCE_ROLE_CONFIRMED | — | — | Peninsula Beverages | Western Cape/Cape Town | https://www.linkedin.com/in/lizo-manyana-89b64878/ |
| 518 | **Moses Manyeruke** | Manyeruke / Moses | CONFIRMED | ACMA, CGMA | CIMA | Enernet Global | Western Cape/Cape Town | https://za.linkedin.com/in/moses-manyeruke-acma-cgma-ab216521 |
| 519 | **Andisiwe Manzana** | Manzana / Andisiwe | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Gauteng/City of Johannesburg | https://www.linkedin.com/in/andisiwe-manzana-50265627/ |
| 520 | **Sazile Manzini** | Manzini / Sazile | FINANCE_ROLE_CONFIRMED | — | — | Averda South Africa | Gauteng/Johannesburg | https://www.linkedin.com/in/sazile-manzini-24b187127/ |
| 521 | **Siseko Mapongwana** | Mapongwana / Siseko | CONFIRMED | PA(SA) | SAIPA | G4S | Western Cape | https://za.linkedin.com/in/siseko-mapongwana-192818145 |
| 522 | **Orapeleng Maragelo** | Maragelo / Orapeleng | FINANCE_ROLE_CONFIRMED | — | — | AfriSam | Gauteng/City of Johannesburg | https://www.linkedin.com/in/orapeleng-maragelo-8026b191/ |
| 523 | **Veronique MARCOUX** | MARCOUX / Veronique | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Gauteng/Johannesburg | https://www.linkedin.com/in/veronique-marcoux-55599614a/ |
| 524 | **Romy Maree** | Maree / Romy | CONFIRMED | CA(SA) | SAICA | Burstone (Real Estate partners) | — | — |
| 525 | **Magda Marin Jonck** | Marin Jonck / Magda | RESEARCH_HOLD | — | — | — | Western Cape | — |
| 526 | **Wayne Marriday** | Marriday / Wayne | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/City of Cape Town | https://www.linkedin.com/in/wayne-marriday-0300b943/ |
| 527 | **Jody Marthinus** | Marthinus / Jody | FINANCE_ROLE_CONFIRMED | — | — | LANCEWOOD | Western Cape/Mossel Bay | https://www.linkedin.com/in/jody-marthinus-1326ba39/ |
| 528 | **Richard Martin** | Martin / Richard | FINANCE_ROLE_CONFIRMED | — | — | SA Metal Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/richard-martin-475185122/ |
| 529 | **Iaan Marx** | Marx / Iaan | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 530 | **Liziwe Maseloane** | Maseloane / Liziwe | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/Vanderbijlpark | https://www.linkedin.com/in/liziwe-maseloane-10270530a/ |
| 531 | **nomsa mashabela** | mashabela / nomsa | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/Pretoria | https://www.linkedin.com/in/nomsa-mashabela-853195122/ |
| 532 | **Mahosi Mashao** | Mashao / Mahosi | FINANCE_ROLE_CONFIRMED | — | — | AfriSam | — | https://www.linkedin.com/in/mahosi-mashao-77850b33/ |
| 533 | **Phillip Mashao** | Mashao / Phillip | FINANCE_ROLE_CONFIRMED | — | — | AfriSam | Limpopo/Polokwane Local Municipality | https://www.linkedin.com/in/phillip-mashao-72745831a/ |
| 534 | **Thapelo Mashashane** | Mashashane / Thapelo | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/City of Johannesburg | https://www.linkedin.com/in/thapelo-mashashane-493215170/ |
| 535 | **Trevineth Masindi** | Masindi / Trevineth | FINANCE_ROLE_CONFIRMED | — | — | Macsteel | Gauteng/City of Johannesburg | https://www.linkedin.com/in/trevineth-masindi-95605011a/ |
| 536 | **Mfundo Maso** | Maso / Mfundo | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Gauteng/Johannesburg | https://www.linkedin.com/in/mfundo-maso-3559a4234/ |
| 537 | **Glacia Matadin** | Matadin / Glacia | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/glacia-matadin-256aa2b6/ |
| 538 | **Portia Mathebula** | Mathebula / Portia | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | Gauteng/Johannesburg | https://www.linkedin.com/in/portia-mathebula-b6b8281a5/ |
| 539 | **Ofentse Matloha** | Matloha / Ofentse | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/City of Cape Town | https://www.linkedin.com/in/ofentse-matloha-2a3338204/ |
| 540 | **Katlego Matshego** | Matshego / Katlego | HIGH_CONFIDENCE | CA(SA) | SAICA | Independent Institute of Education (IIE) Varsity College / MSA | — | — |
| 541 | **Tiisetso Matsobane** | Matsobane / Tiisetso | CONFIRMED | ACMA, CGMA | CIMA | Libstar | Western Cape/Cape Town | https://za.linkedin.com/in/tiisetso-matsobane-acma-cgma-54b16890 |
| 542 | **Abigail Matuku** | Matuku / Abigail | RESEARCH_HOLD | ACMA, CGMA | CIMA | Pegasys Consulting | Western Cape/Cape Town | — |
| 543 | **Tshepiso Mavimbela** | Mavimbela / Tshepiso | FINANCE_ROLE_CONFIRMED | — | — | Macsteel | Gauteng/City of Johannesburg | https://www.linkedin.com/in/tshepiso-mavimbela-49a99613a/ |
| 544 | **Sabelo Mavundla** | Mavundla / Sabelo | CONFIRMED | — | — | Buffalo City Metropolitan Development Agency (BCMDA) | Eastern Cape/East London | https://www.linkedin.com/in/sabelo-mavundla-369a01105/ |
| 545 | **charlotte Mawela** | Mawela / charlotte | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Gauteng/Boksburg | https://www.linkedin.com/in/charlotte-mawela-0866ba91/ |
| 546 | **Linda Mazibuko** | Mazibuko / Linda | RESEARCH_HOLD | — | — | — | Western Cape/Western Cape candidate pool | https://za.linkedin.com/in/linda-mazibuko-44346227 |
| 547 | **Phumelela Mbande** | Mbande / Phumelela | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 548 | **Thobile Mbangeni** | Mbangeni / Thobile | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | Johannesburg Metropolitan Area | https://www.linkedin.com/in/thobile-mbangeni-6baa51141/ |
| 549 | **Athenkosi Mboniswa** | Mboniswa / Athenkosi | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Eastern Cape/Port Elizabeth | https://www.linkedin.com/in/athenkosi-mboniswa-73050b38/ |
| 550 | **Hlayisani Terrent Mboweni** | Mboweni / Hlayisani | HIGH_CONFIDENCE | PA(SA) | SAIPA | Mboweni Accountants | — | — |
| 551 | **Noxolo Mbutho** | Mbutho / Noxolo | FINANCE_ROLE_CONFIRMED | — | — | Mpact | KwaZulu-Natal/Umhlanga | https://www.linkedin.com/in/noxolo-mbutho-16b841115/ |
| 552 | **Michael McAllister (CIMA Adv Dip MA)** | McAllister (CIMA Adv Dip MA) / Michael | FINANCE_ROLE_CONFIRMED | — | — | Interwaste | Gauteng/Johannesburg | https://www.linkedin.com/in/michael-mcallister-cima-adv-dip-ma-33b64484/ |
| 553 | **Trevor McLachlan** | McLachlan / Trevor | HIGH_CONFIDENCE | PA(SA) | SAIPA | McA Inc. | Western Cape/Cape Town | — |
| 554 | **Celeste McLeroth** | McLeroth / Celeste | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/City of Johannesburg | https://www.linkedin.com/in/celeste-mcleroth-4b22541a/ |
| 555 | **Phindile Mcunu** | Mcunu / Phindile | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/phindile-mcunu-036431128/ |
| 556 | **Rendani Mdluli** | Mdluli / Rendani | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/City of Johannesburg | https://www.linkedin.com/in/rendani-mdluli-86898494/ |
| 557 | **Nontobeko Mehlomakhulu** | Mehlomakhulu / Nontobeko | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/City of Cape Town | https://www.linkedin.com/in/nontobeko-mehlomakhulu-7006108/ |
| 558 | **Kaylene Meintjies** | Meintjies / Kaylene | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/kaylene-meintjies-5a04a7123/ |
| 559 | **Zinathi Melamane** | Melamane / Zinathi | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Johannesburg Metropolitan Area | https://www.linkedin.com/in/zinathi-melamane-757a7941/ |
| 560 | **Rieduwaan Meniers** | Meniers / Rieduwaan | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Gauteng/Midrand | https://www.linkedin.com/in/rieduwaan-meniers-90446312a/ |
| 561 | **Kosie Menzangani** | Menzangani / Kosie | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/kosie-menzangani-877a6a7a/ |
| 562 | **Phumulani Menzi Mabena** | Menzi Mabena / Phumulani | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | Gauteng/City of Johannesburg | https://www.linkedin.com/in/phumulani-menzi-mabena-0b696158/ |
| 563 | **Sean Meredith** | Meredith / Sean | CONFIRMED | ACMA, CGMA | CIMA | City of Cape Town | Western Cape/Cape Town | https://za.linkedin.com/in/sean-meredith-acma-cgma-029ab46 |
| 564 | **Francois Meyer** | Meyer / Francois | CONFIRMED | PA(SA) | SAIPA | The Tax Shop Stellenbosch | Western Cape/Stellenbosch | https://za.linkedin.com/in/francois-meyer-75919a261 |
| 565 | **Maurice Meyer** | Meyer / Maurice | FINANCE_ROLE_CONFIRMED | — | — | KWV | Western Cape/Cape Town | https://www.linkedin.com/in/maurice-meyer-08545a262/ |
| 566 | **Edgar Meyers** | Meyers / Edgar | FINANCE_ROLE_CONFIRMED | — | — | SA Metal Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/edgar-meyers-12b98864/ |
| 567 | **Aphiwe Mgaleli** | Mgaleli / Aphiwe | FINANCE_ROLE_CONFIRMED | — | — | Cape Herb & Spice | Western Cape/Cape Town | https://www.linkedin.com/in/aphiwemgaleli/ |
| 568 | **Thobile Mgenge Otobor** | Mgenge Otobor / Thobile | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/thobile-mgenge-otobor-acma-cgma-mip-4593818a/ |
| 569 | **Phakama Mgole** | Mgole / Phakama | HIGH_CONFIDENCE | — | — | Hisense South Africa | Gauteng/Johannesburg | — |
| 570 | **Lee-Roy Middleton** | Middleton / Lee-Roy | FINANCE_ROLE_CONFIRMED | — | — | Kaap Agri / Agrimark | Western Cape/Cape Town | https://www.linkedin.com/in/lee-roy-middleton-19346446/ |
| 571 | **Carli Mills** | Mills / Carli | FINANCE_ROLE_CONFIRMED | — | — | Fruitways | South Africa | https://www.linkedin.com/in/carli-mills-b8b3a5115/ |
| 572 | **Mangaliso Mithi** | Mithi / Mangaliso | CONFIRMED | FCMA, CGMA | CIMA | — | Gauteng/Johannesburg | https://www.linkedin.com/in/mangalisomithi/ |
| 573 | **thobile mkhabela** | mkhabela / thobile | FINANCE_ROLE_CONFIRMED | — | — | Raubex / Roadmac Surfacing Cape | Mpumalanga/Nelspruit | https://www.linkedin.com/in/thobile-mkhabela-a575a790/ |
| 574 | **Xolile Mkuhlana** | Mkuhlana / Xolile | CONFIRMED | ACMA, CGMA | CIMA | SASSA | Western Cape/Cape Town | https://za.linkedin.com/in/xolile-mkuhlana-acma-cgma-9306a334 |
| 575 | **Sikelela Mkungeki** | Mkungeki / Sikelela | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/Cape Town | https://www.linkedin.com/in/sikelela-mkungeki-25a37372/ |
| 576 | **Gcina Mlambo** | Mlambo / Gcina | FINANCE_ROLE_CONFIRMED | — | — | PPC | Gauteng/City of Johannesburg | https://www.linkedin.com/in/gcina-mlambo-582643120/ |
| 577 | **Siphesihle Mlangeni** | Mlangeni / Siphesihle | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 578 | **Pitsi Mnisi** | Mnisi / Pitsi | CONFIRMED | CA(SA) | SAICA | Novus Holdings Ltd | Western Cape/Cape Town | — |
| 579 | **Precious Moagi** | Moagi / Precious | FINANCE_ROLE_CONFIRMED | — | — | AfriSam | Gauteng/Meredale | https://www.linkedin.com/in/precious-moagi-a3b41b278/ |
| 580 | **Seragi Mogano,** | Mogano, / Seragi | FINANCE_ROLE_CONFIRMED | — | — | Tronox Namakwa Sands | Western Cape/Cape Town | https://www.linkedin.com/in/seragi-mogano-cima-cert-ba-452826a3/ |
| 581 | **Mpolaheng Mohlopi** | Mohlopi / Mpolaheng | CONFIRMED | CA(SA) | SAICA | Lanseria International Airport | Gauteng/Lanseria | — |
| 582 | **Kgomotso Moipolai** | Moipolai / Kgomotso | CONFIRMED | PA(SA) | SAIPA | — | Western Cape | https://za.linkedin.com/in/kgomotso-moipolai-014726207 |
| 583 | **Goitsemang Mokaila** | Mokaila / Goitsemang | FINANCE_ROLE_CONFIRMED | — | — | HEINEKEN Beverages | Johannesburg Metropolitan Area | https://www.linkedin.com/in/goitsemang-mokaila-4a417362/ |
| 584 | **Tumi Mokgoko** | Mokgoko / Tumi | CONFIRMED | CA(SA) | SAICA | KPMG | — | — |
| 585 | **Kelebogile Mokhine** | Mokhine / Kelebogile | FINANCE_ROLE_CONFIRMED | — | — | Averda South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/kelebogile-mokhine-407b2b137/ |
| 586 | **Bonga Mokoena** | Mokoena / Bonga | CONFIRMED | CA(SA) | SAICA | BDO South Africa | Gauteng/Johannesburg | — |
| 587 | **Palesa Mokoena** | Mokoena / Palesa | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Gauteng/Pretoria | https://www.linkedin.com/in/palesa-mokoena-b74573127/ |
| 588 | **Phuti Mokoka** | Mokoka / Phuti | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | South Africa | https://www.linkedin.com/in/phuti-mokoka-81b22a9b/ |
| 589 | **Mokete Mokono** | Mokono / Mokete | HIGH_CONFIDENCE | — | — | Department of Agriculture, Land Reform and Rural Development (DALRRD) | Gauteng/Pretoria | — |
| 590 | **Pumla Molope** | Molope / Pumla | CONFIRMED | CA(SA) | SAICA | African Women Chartered Accountants (AWCA) | — | — |
| 591 | **Katlego Molopyane** | Molopyane / Katlego | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Gauteng/City of Johannesburg | https://www.linkedin.com/in/katlego-molopyane-ca-sa-b6a87b59/ |
| 592 | **Chrissie Moloseni** | Moloseni / Chrissie | CONFIRMED | CGMA | CIMA | PPC | Gauteng/Johannesburg | https://www.linkedin.com/in/chrissie-moloseni-bacc-mba-cgma-35787746/ |
| 593 | **Kgaogelo Montjane** | Montjane / Kgaogelo | RESEARCH_HOLD | — | — | — | Western Cape/Western Cape candidate pool | https://za.linkedin.com/in/kgaogelo-montjane-373050186 |
| 594 | **Louise Moodley** | Moodley / Louise | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Gauteng/Roodepoort | https://www.linkedin.com/in/louise-moodley-0014283b1/ |
| 595 | **Mpho Mookapele** | Mookapele / Mpho | CONFIRMED | CA(SA) | SAICA | Energy and Water Sector Education and Training Authority (EWSETA) | — | — |
| 596 | **Sherylee Moonsamy** | Moonsamy / Sherylee | CONFIRMED | — | — | Competition Tribunal | Gauteng/Johannesburg | — |
| 597 | **Duane Moore** | Moore / Duane | HIGH_CONFIDENCE | — | — | Ecowize Group | Western Cape/Cape Town | https://www.linkedin.com/in/duanemoore/ |
| 598 | **Karli Moore** | Moore / Karli | CONFIRMED | CA(SA) | SAICA | Afrimat | Western Cape/Cape Town | https://www.linkedin.com/in/karli-moore-ca-sa-24349b204/ |
| 599 | **Mmakgotso Mopeli** | Mopeli / Mmakgotso | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Stellenbosch | https://www.linkedin.com/in/mmakgotso-mopeli-140137223/ |
| 600 | **Nompi Morajane** | Morajane / Nompi | CONFIRMED | CA(SA) | SAICA | PPC | Gauteng/Johannesburg | https://www.linkedin.com/in/nompi-morajane-ca-sa-778a34b5/ |
| 601 | **Vernon Morgan** | Morgan / Vernon | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/vernon-morgan-financial-coach |
| 602 | **Mieshka Morris** | Morris / Mieshka | RESEARCH_HOLD | — | — | Momentum Corporate | Western Cape | https://za.linkedin.com/in/mieshka-morris-55527055 |
| 603 | **Carla Mostert** | Mostert / Carla | CONFIRMED | ACMA, CGMA | CIMA | Atlantis Foods Group | Western Cape/Cape Town | https://za.linkedin.com/in/carla-mostert-acma-cgma-8695a9156 |
| 604 | **Matselane Motaung** | Motaung / Matselane | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/matselane-motaung-7780a215/ |
| 605 | **Vincent Motholo** | Motholo / Vincent | CONFIRMED | CA(SA) | SAICA | University of Cape Town | Western Cape/Cape Town | https://www.linkedin.com/in/vincent-motholo-ca-sa-842b7613/ |
| 606 | **Thabang Mothuki** | Mothuki / Thabang | FINANCE_ROLE_CONFIRMED | — | — | Ardagh Glass Packaging SA | Gauteng/City of Johannesburg | https://www.linkedin.com/in/thabang-mothuki-8ab4a1a4/ |
| 607 | **Thokozani Motloung** | Motloung / Thokozani | CONFIRMED | PA(SA) | SAIPA | Unitrans | Western Cape/Cape Town | https://za.linkedin.com/in/thokozani-motloung-64147923 |
| 608 | **Victor Motsamai Madziwa** | Motsamai Madziwa / Victor | FINANCE_ROLE_CONFIRMED | — | — | Tronox Namakwa Sands | South Africa | https://www.linkedin.com/in/victor-madziwa-98152a1b/ |
| 609 | **Nathaly Mouton** | Mouton / Nathaly | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/nathaly-mouton-424a5952/ |
| 610 | **virginia mouton** | mouton / virginia | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Western Cape/City of Cape Town | https://www.linkedin.com/in/virginia-mouton-33097271/ |
| 611 | **Leevas Moyana** | Moyana / Leevas | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/City of Cape Town | https://www.linkedin.com/in/leevas-moyana-49343059/ |
| 612 | **Sinazo Mpama** | Mpama / Sinazo | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Gauteng/City of Johannesburg | https://www.linkedin.com/in/sinazo-mpama-42bb4b109/ |
| 613 | **Vusi Mpofu** | Mpofu / Vusi | CONFIRMED | AGA(SA) | SAICA | Nedbank | — | — |
| 614 | **Mimosa Mputa** | Mputa / Mimosa | CONFIRMED | AGA(SA) | SAICA | Mukuru | Western Cape/Cape Town | https://za.linkedin.com/in/mimosa-mputa-aga-sa-50489a211 |
| 615 | **Owethu Msabane** | Msabane / Owethu | FINANCE_ROLE_CONFIRMED | — | — | Ardagh Glass Packaging SA | Germiston Metropolitan Area | https://www.linkedin.com/in/owethu-msabane-b903a184/ |
| 616 | **Zine Mshengu** | Mshengu / Zine | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 617 | **Ayanda Msomi** | Msomi / Ayanda | CONFIRMED | CA(SA) | SAICA | Concor | Gauteng/City of Johannesburg | https://www.linkedin.com/in/ayanda-msomi-2446b615a/ |
| 618 | **Zandile Mtandeki** | Mtandeki / Zandile | CONFIRMED | PA(SA), CAIA | SAIPA | RealFin Fund Services | Western Cape/Cape Town | https://za.linkedin.com/in/zandilemtandeki |
| 619 | **Chwayita Mtebele** | Mtebele / Chwayita | CONFIRMED | CA(SA) | SAICA | Financial Sector Conduct Authority (FSCA) | — | — |
| 620 | **Sifiso Mthethwa** | Mthethwa / Sifiso | FINANCE_ROLE_CONFIRMED | — | — | PPC | Gauteng/City of Johannesburg | https://www.linkedin.com/in/sifiso-mthethwa-005024b4/ |
| 621 | **Siyabonga Mthethwa** | Mthethwa / Siyabonga | CONFIRMED | AGA(SA) | SAICA | Tronox Namakwa Sands | KwaZulu-Natal/KwaZulu-Natal | https://www.linkedin.com/in/siyabonga-mthethwa-aga-sa-152923194/ |
| 622 | **Sivuyisiwe Mtshaka** | Mtshaka / Sivuyisiwe | FINANCE_ROLE_CONFIRMED | — | — | I&J | Western Cape/City of Cape Town | https://www.linkedin.com/in/sivuyisiwe-mtshaka-361ba817b/ |
| 623 | **Liso Mtshambela** | Mtshambela / Liso | RESEARCH_HOLD | — | — | Novus Holdings | Western Cape | https://za.linkedin.com/in/liso-mtshambela-80446b121 |
| 624 | **precious mulaudzi** | mulaudzi / precious | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/precious-mulaudzi-a5b9a5129/ |
| 625 | **André Hugo Muller** | Muller / André | CONFIRMED | CA(SA) | SAICA | Quantum Foods Holdings Ltd | Western Cape/Wellington | https://www.linkedin.com/in/andre-muller-0651b827/ |
| 626 | **Marilize Muller** | Muller / Marilize | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/marilize-muller-59b0a66a |
| 627 | **Khanyisile Mumakwe** | Mumakwe / Khanyisile | FINANCE_ROLE_CONFIRMED | — | — | Macsteel | Gauteng/City of Johannesburg | https://www.linkedin.com/in/khanyisile-mumakwe-680b95120/ |
| 628 | **Ellaine Mundie - Michael** | Mundie - Michael / Ellaine | FINANCE_ROLE_CONFIRMED | — | — | DSV | South Africa | https://www.linkedin.com/in/ellaine-mundie-michael-b205b343/ |
| 629 | **Jody Munnik** | Munnik / Jody | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/Cape Town | https://www.linkedin.com/in/jody-munnik-9b5215219/ |
| 630 | **Tariro Mutizwa** | Mutizwa / Tariro | CONFIRMED | ACMA, CGMA | CIMA | AICPA & CIMA (CIMA Africa) | — | — |
| 631 | **shudufhadzo mutshutshu** | mutshutshu / shudufhadzo | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | Gauteng/City of Johannesburg | https://www.linkedin.com/in/shudufhadzo-mutshutshu-58566a46/ |
| 632 | **Nothando Muziki** | Muziki / Nothando | CONFIRMED | AGA(SA) | SAICA | Integral Accountants | Western Cape/Cape Town | https://za.linkedin.com/in/nothando-muziki-aga-sa-b85538153 |
| 633 | **Lubabalo Mxhasa** | Mxhasa / Lubabalo | CONFIRMED | PA(SA) | SAIPA | Apex/Maitland background | Western Cape | https://za.linkedin.com/in/lubabalo-mxhasa-39694163 |
| 634 | **Sandisiwe Myekwa nee Booi** | Myekwa nee Booi / Sandisiwe | FINANCE_ROLE_CONFIRMED | — | — | Premier Fishing & Brands | Western Cape/Cape Town | https://www.linkedin.com/in/sandisiwe-myekwa-nee-booi-aga-sa-034740211/ |
| 635 | **Pilot Mzimba** | Mzimba / Pilot | FINANCE_ROLE_CONFIRMED | — | — | Interwaste | Gauteng/Johannesburg | https://www.linkedin.com/in/pilot-mzimba-91a7051b/ |
| 636 | **Sokhuthu Mziwoluntu** | Mziwoluntu / Sokhuthu | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/Mossel Bay | https://www.linkedin.com/in/sokhuthu-mziwoluntu-01468453/ |
| 637 | **Shaun Mzuvukile Gxekwa** | Mzuvukile Gxekwa / Shaun | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/shaun-mzuvukile-gxekwa-538bb213a |
| 638 | **Megan N.** | N. / Megan | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | Gauteng/City of Johannesburg | https://www.linkedin.com/in/megan-n-83b663138/ |
| 639 | **Ritesh Nagar** | Nagar / Ritesh | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/City of Johannesburg | https://www.linkedin.com/in/ritesh-nagar-22866b45/ |
| 640 | **Charmaine Nago** | Nago / Charmaine | RESEARCH_HOLD | — | — | — | Western Cape/Cape Town candidate pool | https://za.linkedin.com/in/charmaine-nago-b077113b |
| 641 | **Thiru Naicker** | Naicker / Thiru | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Western Cape/Western Cape | https://www.linkedin.com/in/thiru-naicker-ca-sa-16574024/ |
| 642 | **Aneshree Naidoo** | Naidoo / Aneshree | CONFIRMED | CA(SA) | SAICA | Webber Wentzel | — | — |
| 643 | **Kalnisha Naidoo** | Naidoo / Kalnisha | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Stellenbosch | https://www.linkedin.com/in/kalnisha-naidoo-965523101/ |
| 644 | **Kathie Naidoo** | Naidoo / Kathie | FINANCE_ROLE_CONFIRMED | — | — | Chryso Southern Africa | Gauteng/City of Johannesburg | https://www.linkedin.com/in/kathie-naidoo-30701997/ |
| 645 | **Talisa Naidoo** | Naidoo / Talisa | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/talisa-naidoo-ca-sa-328533342/ |
| 646 | **Thenashree Naidoo** | Naidoo / Thenashree | HIGH_CONFIDENCE | CA(SA) | SAICA | Durban ICC | KwaZulu-Natal/Durban | — |
| 647 | **Ziyaad Nakidien** | Nakidien / Ziyaad | FINANCE_ROLE_CONFIRMED | — | — | Capespan South Africa | Western Cape/Western Cape | https://www.linkedin.com/in/ziyaad-nakidien-166b86170/ |
| 648 | **Jabavu Nare** | Nare / Jabavu | CONFIRMED | ACMA, CGMA | CIMA | Pie in the Sky / Coimbra Bakery | Western Cape/Cape Town | https://za.linkedin.com/in/jabavu-nare-acma-cgma-52544850 |
| 649 | **Caroline Narrainsamy(Pillay)** | Narrainsamy(Pillay) / Caroline | FINANCE_ROLE_CONFIRMED | — | — | Tronox Namakwa Sands | KwaZulu-Natal/KwaZulu-Natal | https://www.linkedin.com/in/caroline-narrainsamy-pillay-448271174/ |
| 650 | **Pranesh Narshi** | Narshi / Pranesh | FINANCE_ROLE_CONFIRMED | — | — | Interwaste | Western Cape/Cape Town | https://www.linkedin.com/in/pranesh-narshi-433b16365/ |
| 651 | **Horstmann Natasha** | Natasha / Horstmann | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/horstmann-natasha-aa92a090/ |
| 652 | **Theo Naude** | Naude / Theo | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/theo-naude-b36b847a |
| 653 | **Gugu Ncala** | Ncala / Gugu | FINANCE_ROLE_CONFIRMED | — | — | Concor | Gauteng/City of Johannesburg | https://www.linkedin.com/in/gugu-ncala-8955b374/ |
| 654 | **Amahle Ndindi** | Ndindi / Amahle | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/amahle-ndindi-855541215/ |
| 655 | **Busi Ndlovu** | Ndlovu / Busi | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/City of Cape Town | https://www.linkedin.com/in/busi-ndlovu-6b21b263/ |
| 656 | **Netshia Nduvho** | Nduvho / Netshia | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Gauteng/Kempton Park | https://www.linkedin.com/in/netshia-nduvho-02547b293/ |
| 657 | **Andiswa Ndwalane** | Ndwalane / Andiswa | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | South Africa | https://www.linkedin.com/in/andiswa-ndwalane-66492821a/ |
| 658 | **Anika Nel** | Nel / Anika | CONFIRMED | PA(SA) | SAIPA | Kallos Global | Western Cape | https://za.linkedin.com/in/anika-nel-20b364134 |
| 659 | **Déhan Nel** | Nel / Déhan | FINANCE_ROLE_CONFIRMED | — | — | LANCEWOOD | Western Cape/George | https://www.linkedin.com/in/déhan-nel-ca-sa-b4b49920a/ |
| 660 | **Kristen Nel** | Nel / Kristen | CONFIRMED | PA(SA) | SAIPA | Fynbos Accounting | Western Cape/Cape Town | https://za.linkedin.com/in/kristen-nel-professional-accountant-saipa-407058118 |
| 661 | **Louis Nel** | Nel / Louis | FINANCE_ROLE_CONFIRMED | — | — | Tru-Cape Fruit Marketing | South Africa | https://www.linkedin.com/in/louis-nel-204935a6/ |
| 662 | **Melisa Nel** | Nel / Melisa | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Western Cape/Cape Town | https://www.linkedin.com/in/melisa-nel-b73751239/ |
| 663 | **Nastassja Nel** | Nel / Nastassja | CONFIRMED | AGA(SA) | SAICA | Schoemans Registered Auditors and Chartered Accountants | Western Cape/Cape Town | https://www.linkedin.com/in/nastassja-nel-71a15364/ |
| 664 | **Wynand Nel** | Nel / Wynand | HIGH_CONFIDENCE | PA(SA) | SAIPA | JTC Group | Western Cape | — |
| 665 | **Leonie Nell** | Nell / Leonie | FINANCE_ROLE_CONFIRMED | — | — | LANCEWOOD | Western Cape/George | https://www.linkedin.com/in/leonie-nell-412a12284/ |
| 666 | **Wilhelm Nell** | Nell / Wilhelm | FINANCE_ROLE_CONFIRMED | — | — | Fair Cape Dairies | Western Cape/Durbanville | https://www.linkedin.com/in/wilhelm-nell-867aa0104/ |
| 667 | **Karabo Neluheni** | Neluheni / Karabo | FINANCE_ROLE_CONFIRMED | — | — | EnviroServ | Gauteng/Johannesburg | https://www.linkedin.com/in/karabo-neluheni-ca-sa-26285529/ |
| 668 | **Vhugala Nelwamondo** | Nelwamondo / Vhugala | CONFIRMED | ACMA, CGMA | CIMA | Auditor-General of South Africa | Western Cape/Cape Town | https://za.linkedin.com/in/vhugala-nelwamondo-acma-cgma-2b2bb7ba |
| 669 | **Linda Nene (FIIASA,CRMA,CCSA,CPrac(SA))** | Nene (FIIASA,CRMA,CCSA,CPrac(SA)) / Linda | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | South Africa | https://www.linkedin.com/in/linda-nene-fiiasa-crma-ccsa-cprac-sa-91911827/ |
| 670 | **Aviwe Ngcawuzele** | Ngcawuzele / Aviwe | FINANCE_ROLE_CONFIRMED | — | — | I&J | Western Cape/City of Cape Town | https://www.linkedin.com/in/aviwe-ngcawuzele-1a25aa133/ |
| 671 | **Qaqamba Ngcawuzele** | Ngcawuzele / Qaqamba | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/City of Cape Town | https://www.linkedin.com/in/qaqamba-ngcawuzele-151569146/ |
| 672 | **Njabulo Ngcobo** | Ngcobo / Njabulo | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | Gauteng/City of Johannesburg | https://www.linkedin.com/in/njabulo-ngcobo/ |
| 673 | **Kulani Ngobeni** | Ngobeni / Kulani | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Johannesburg Metropolitan Area | https://www.linkedin.com/in/kulani-ngobeni-503b7790/ |
| 674 | **Mitterand Ngoy** | Ngoy / Mitterand | FINANCE_ROLE_CONFIRMED | — | — | Averda South Africa | Gauteng/Johannesburg | https://www.linkedin.com/in/mitterand-ngoy-66ba2828b/ |
| 675 | **Lindokuhle Ngqobane** | Ngqobane / Lindokuhle | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/Western Cape | https://www.linkedin.com/in/lindokuhle-ngqobane-221782159/ |
| 676 | **Thabang Ngwenya** | Ngwenya / Thabang | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | Gauteng/City of Johannesburg | https://www.linkedin.com/in/thabang-ngwenya-b80172101/ |
| 677 | **Nkosinathi Nicholus Mabuza** | Nicholus Mabuza / Nkosinathi | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/City of Johannesburg | https://www.linkedin.com/in/nkosinathi-nicholus-mabuza-a6095266/ |
| 678 | **Michele Nieuwoudt** | Nieuwoudt / Michele | RESEARCH_HOLD | — | — | PNA / former Management Accountant | Western Cape | https://za.linkedin.com/in/michele-nieuwoudt-96074259 |
| 679 | **Markus NIEUWOUDT CMILT, MCTP(SA), Compliance Practitioner** | NIEUWOUDT CMILT, MCTP(SA), Compliance Practitioner / Markus | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/Johannesburg | https://www.linkedin.com/in/markus-nieuwoudt-cmilt-mctp-sa-compliance-practitioner-625798321/ |
| 680 | **Wendy Nkambule** | Nkambule / Wendy | HIGH_CONFIDENCE | — | — | Trans-Caledon Tunnel Authority (TCTA) | Gauteng/Midrand | — |
| 681 | **Relebohile Nkojoana** | Nkojoana / Relebohile | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Johannesburg Metropolitan Area | https://www.linkedin.com/in/relebohile/ |
| 682 | **Ande Nkontso** | Nkontso / Ande | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/ande-nkontso-606504196/ |
| 683 | **Luyanda Nkonyane** | Nkonyane / Luyanda | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Gauteng/Gauteng | https://www.linkedin.com/in/luyanda-nkonyane-ba648185/ |
| 684 | **Absay Nkosi** | Nkosi / Absay | FINANCE_ROLE_CONFIRMED | — | — | Concor | Gauteng/City of Johannesburg | https://www.linkedin.com/in/absay-nkosi-b47b3511a/ |
| 685 | **Delani Nkosi** | Nkosi / Delani | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/delani-nkosi-ab502676/ |
| 686 | **Dianne Noake** | Noake / Dianne | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/Benoni | https://www.linkedin.com/in/dianne-noake-b153669a/ |
| 687 | **Sanele Nodume** | Nodume / Sanele | CONFIRMED | CA(SA) | SAICA | Astron Energy | Western Cape/Cape Town | https://www.linkedin.com/in/sanele-nodume-ca-sa-36034622b/ |
| 688 | **Sampras Noel Kaweesi** | Noel Kaweesi / Sampras | CONFIRMED | FCCA | ACCA | Sexual & Reproductive Justice Coalition | Western Cape/Cape Town | https://za.linkedin.com/in/sampras-noel-kaweesi-msci-fcca-a13a6b35 |
| 689 | **Bukeka Nohashe** | Nohashe / Bukeka | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/bukeka-nohashe-5950866b |
| 690 | **Nolwazi Nokuthula Nkabinde** | Nokuthula Nkabinde / Nolwazi | FINANCE_ROLE_CONFIRMED | — | — | DGB | Gauteng/City of Johannesburg | https://www.linkedin.com/in/nolwazi-nokuthula-nkabinde-9035251a3/ |
| 691 | **Msutwana NOLUVO** | NOLUVO / Msutwana | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | South Africa | https://www.linkedin.com/in/msutwana-noluvo-0750a263/ |
| 692 | **Buhle Hanise Nomabunga** | Nomabunga / Buhle | CONFIRMED | CA(SA) | SAICA | BAIC (South Africa) | — | — |
| 693 | **Sithole Nonsikelelo** | Nonsikelelo / Sithole | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/City of Cape Town | https://www.linkedin.com/in/sithole-nonsikelelo-1b881a54/ |
| 694 | **Hannes Nortman** | Nortman / Hannes | CONFIRMED | AGA(SA) | SAICA | Golden Hour Experiences | Western Cape/Cape Town | https://za.linkedin.com/in/hannes-nortman-aga-sa-683b202b |
| 695 | **Nontsingiselo Notununu** | Notununu / Nontsingiselo | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/nontsingiselo-notununu-cima-dip-ma-b74528b9 |
| 696 | **Busisiwe Ntombifikile Mkhize** | Ntombifikile Mkhize / Busisiwe | FINANCE_ROLE_CONFIRMED | — | — | Macsteel | KwaZulu-Natal/Durban | https://www.linkedin.com/in/busisiwe-ntombifikile-mkhize-92106646/ |
| 697 | **faith ntshingila** | ntshingila / faith | FINANCE_ROLE_CONFIRMED | — | — | DGB | Gauteng/City of Johannesburg | https://www.linkedin.com/in/faith-ntshingila-642900125/ |
| 698 | **Anele Ntsinde** | Ntsinde / Anele | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/City of Johannesburg | https://www.linkedin.com/in/anele-ntsinde-9b6a51a3/ |
| 699 | **Vicky Ntsodo** | Ntsodo / Vicky | HIGH_CONFIDENCE | — | — | Buffalo City Metropolitan Development Agency (BCMDA) | Eastern Cape/East London | — |
| 700 | **Zizipho Nyanga** | Nyanga / Zizipho | CONFIRMED | CA(SA) | SAICA | Masisizane Fund (Old Mutual) | — | — |
| 701 | **Jabulile Nyathi** | Nyathi / Jabulile | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 702 | **Linda Nyirenda (ACMA** | Nyirenda (ACMA / Linda | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | Gauteng/City of Johannesburg | https://www.linkedin.com/in/linda-nyirenda-acma-cgma-5ab7ba15a/ |
| 703 | **Phila Nyoka** | Nyoka / Phila | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Gauteng/Gauteng | https://www.linkedin.com/in/phila-nyoka-88a416213/ |
| 704 | **Danielle O'Brien** | O'Brien / Danielle | CONFIRMED | PA(SA) | SAIPA | SS&C Technologies | Western Cape/Cape Town | https://za.linkedin.com/in/danielle-o-brien-pa-sa-897227123 |
| 705 | **Desire October** | October / Desire | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/desire-october-517967181/ |
| 706 | **Henk Odendaal** | Odendaal / Henk | FINANCE_ROLE_CONFIRMED | — | — | Fruitways | Western Cape/City of Cape Town | https://www.linkedin.com/in/henk-odendaal-ca-sa-92b86887/ |
| 707 | **Lara Odendaal** | Odendaal / Lara | CONFIRMED | PA(SA) | SAIPA | Creatori Health | Western Cape/Stellenbosch | https://za.linkedin.com/in/lara-odendaal-4053b21a4 |
| 708 | **Liezel Odendaal** | Odendaal / Liezel | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/Boksburg | https://www.linkedin.com/in/liezel-odendaal-571314225/ |
| 709 | **Crystal Okkers** | Okkers / Crystal | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/crystal-okkers-71482174/ |
| 710 | **Samantha Olifant** | Olifant / Samantha | FINANCE_ROLE_CONFIRMED | — | — | Interwaste | South Africa | https://www.linkedin.com/in/samantha-olifant-5b2a34b5/ |
| 711 | **André Olivier** | Olivier / André | CONFIRMED | AGA(SA) | SAICA | Lekkewaan | Western Cape/Wellington | https://za.linkedin.com/in/andr%C3%A9-olivier-aga-sa-b5a573131 |
| 712 | **Eugene Olivier** | Olivier / Eugene | CONFIRMED | AGA(SA) | SAICA | Icon Oncology | Western Cape/Durbanville | https://za.linkedin.com/in/eugene-olivier-21a42b276 |
| 713 | **Jochelle Oosthuizen** | Oosthuizen / Jochelle | CONFIRMED | PA(SA), TP(SA) | SAIPA | LPH Chartered Accountants | Western Cape/Stellenbosch | https://za.linkedin.com/in/jochelle-oosthuizen-a408a59a |
| 714 | **Nelia Oosthuizen** | Oosthuizen / Nelia | FINANCE_ROLE_CONFIRMED | — | — | Mpact | KwaZulu-Natal/KwaZulu-Natal | https://www.linkedin.com/in/nelia-oosthuizen-6a532841/ |
| 715 | **Quintin Oosthuizen** | Oosthuizen / Quintin | CONFIRMED | CA(SA) | SAICA | Haw & Inglis | Western Cape/City of Cape Town | — |
| 716 | **Rayhaan Osman** | Osman / Rayhaan | CONFIRMED | FCCA | ACCA | Old Mutual Wealth | Western Cape/Cape Town | https://za.linkedin.com/in/rayhaan-osman-172a07101 |
| 717 | **Beryl Ownhouse** | Ownhouse / Beryl | FINANCE_ROLE_CONFIRMED | — | — | PPC | Eastern Cape/Port Elizabeth | https://www.linkedin.com/in/beryl-ownhouse-944436341/ |
| 718 | **Misheck P Jena** | P Jena / Misheck | CONFIRMED | PA(SA) | SAIPA | Not publicly confirmed | Western Cape/Cape Town | https://za.linkedin.com/in/misheck-p-jena-pa-sa-47278a150 |
| 719 | **Shalin P.** | P. / Shalin | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Johannesburg Metropolitan Area | https://www.linkedin.com/in/shalinpatel-/ |
| 720 | **Velashnie Padayachee** | Padayachee / Velashnie | FINANCE_ROLE_CONFIRMED | — | — | Chryso Southern Africa | South Africa | https://www.linkedin.com/in/velashnie-padayachee-aa569b86/ |
| 721 | **Ramon Padayachi** | Padayachi / Ramon | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/Cape Town | https://www.linkedin.com/in/ramon-padayachi-64b07a10/ |
| 722 | **Karlien Panter** | Panter / Karlien | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Mpumalanga/Nelspruit | https://www.linkedin.com/in/karlien-panter-55bb46117/ |
| 723 | **Emma Pardoe** | Pardoe / Emma | CONFIRMED | CA(SA) | SAICA | Emma Pardoe Chartered Accountants (SA) | Western Cape/Somerset West | https://www.linkedin.com/in/emmapardoe/ |
| 724 | **Junaid Parker** | Parker / Junaid | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/junaid-parker-b67032135/ |
| 725 | **Ridwana Parker** | Parker / Ridwana | CONFIRMED | AGA(SA) | SAICA | Raft Consulting | Western Cape/Cape Town | https://za.linkedin.com/in/ridwana-parker-aga-sa |
| 726 | **Sylwia Parzuchowski** | Parzuchowski / Sylwia | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/sylwia-parzuchowski-24b69b80/ |
| 727 | **Anisah Patel** | Patel / Anisah | CONFIRMED | CA(SA) | SAICA | Own practice (Vereeniging) | Gauteng/Vereeniging | — |
| 728 | **Safiyah Patel** | Patel / Safiyah | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Port Elizabeth Metropolitan Area | https://www.linkedin.com/in/safiyah-patel-575910193/ |
| 729 | **Tierney Paul** | Paul / Tierney | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/tierney-paul-3974b1152/ |
| 730 | **Mulalo Peaceman Mashamba** | Peaceman Mashamba / Mulalo | CONFIRMED | ACCA | ACCA | Infra Impact Investment Managers | Western Cape/Cape Town | https://za.linkedin.com/in/mulalo-peaceman-mashamba-acca-17015142 |
| 731 | **Mellissa Pearce (née Ryder)** | Pearce (née Ryder) / Mellissa | FINANCE_ROLE_CONFIRMED | — | — | Cape Herb & Spice | Western Cape/Cape Town | https://www.linkedin.com/in/mellissa-pearce-nèe-ryder-88123b68/ |
| 732 | **Crystelle Peense** | Peense / Crystelle | RESEARCH_HOLD | — | — | Commissions | Western Cape | https://za.linkedin.com/in/crystelle-peense |
| 733 | **Ross Pennell** | Pennell / Ross | CONFIRMED | FCCA | ACCA | Advent Wealth | Western Cape/Cape Town | https://za.linkedin.com/in/rosspennell |
| 734 | **Brett Penney** | Penney / Brett | CONFIRMED | CA(SA) | SAICA | Sika South Africa | KwaZulu-Natal/eThekwini | https://za.linkedin.com/in/brett-penney-7821aa10a |
| 735 | **Bulali Pepeteka** | Pepeteka / Bulali | CONFIRMED | PA(SA) | SAIPA | Klearium | Western Cape/Cape Town | https://za.linkedin.com/in/bulalipepeteka |
| 736 | **Jonathan Petley** | Petley / Jonathan | FINANCE_ROLE_CONFIRMED | — | — | Betko Fresh Produce | Western Cape/Somerset West | https://www.linkedin.com/in/jonathan-petley-671363a3/ |
| 737 | **Kefiloe Petunia Mashinini** | Petunia Mashinini / Kefiloe | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Gauteng/City of Johannesburg | https://www.linkedin.com/in/kefie-mashinini-b8336023/ |
| 738 | **Shaun Peypers** | Peypers / Shaun | FINANCE_ROLE_CONFIRMED | — | — | Cape Herb & Spice | Western Cape/Cape Town | https://www.linkedin.com/in/shaun-peypers-0200a564/ |
| 739 | **BRENDA PHASHA** | PHASHA / BRENDA | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Johannesburg Metropolitan Area | https://www.linkedin.com/in/brenda-phasha-44bba61a1/ |
| 740 | **Lunga Phewa** | Phewa / Lunga | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Gauteng/City of Johannesburg | https://www.linkedin.com/in/lunga-phewa-36a6839a/ |
| 741 | **JD Pienaar** | Pienaar / JD | FINANCE_ROLE_CONFIRMED | — | — | Kaap Agri / Agrimark | Western Cape/City of Cape Town | https://www.linkedin.com/in/jd-pienaar-9a5943b8/ |
| 742 | **Monique Pienaar (neé du Toit)** | Pienaar (neé du Toit) / Monique | FINANCE_ROLE_CONFIRMED | — | — | Overberg Agri | Western Cape/Hermanus | https://www.linkedin.com/in/monique-pienaar-neé-du-toit-90875b110/ |
| 743 | **Juan Pierre van der Westhuizen** | Pierre van der Westhuizen / Juan | FINANCE_ROLE_CONFIRMED | — | — | Excellent Meat Group | Western Cape/Western Cape | https://za.linkedin.com/in/juan-pierre-van-der-westhuizen-784834215 |
| 744 | **Jaco Pieters** | Pieters / Jaco | ARTICLES_CONFIRMED_DESIGNATION_UNVERIFIED | — | — | Footgear | Western Cape | — |
| 745 | **Esther Pieterse** | Pieterse / Esther | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 746 | **Miguel Pieterse** | Pieterse / Miguel | CONFIRMED | PA(SA) | SAIPA | Infinity Power | Western Cape/Cape Town | https://za.linkedin.com/in/miguelpieterse |
| 747 | **Ashton Pillay** | Pillay / Ashton | CONFIRMED | AGA(SA) | SAICA | Integrity360 South Africa | Western Cape/Cape Town | https://za.linkedin.com/in/ashton-pillay-aga-sa-aa777332 |
| 748 | **steven pillay** | pillay / steven | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/steven-pillay-0a584230/ |
| 749 | **Youlanda Pillay** | Pillay / Youlanda | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/youlanda-pillay-3888a644/ |
| 750 | **Kershnee Pillay Reddy** | Pillay Reddy / Kershnee | CONFIRMED | CA(SA) | SAICA | PPC | Gauteng/City of Johannesburg | https://www.linkedin.com/in/kershnee-reddy-ca-sa-b532004b/ |
| 751 | **Rethabile Pindani** | Pindani / Rethabile | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/rethabile-pindani-722913170/ |
| 752 | **Liantie Pitchers** | Pitchers / Liantie | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Mpumalanga/Nelspruit | https://www.linkedin.com/in/liantie-pitchers-55427a113/ |
| 753 | **Alice Polinyane** | Polinyane / Alice | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Gauteng/City of Johannesburg | https://www.linkedin.com/in/alice-polinyane-617580167/ |
| 754 | **Jan Potgieter** | Potgieter / Jan | HIGH_CONFIDENCE | CA(SA) | SAICA | TFG Limited (The Foschini Group) | — | — |
| 755 | **Reosha Premduth** | Premduth / Reosha | CONFIRMED | AGA(SA) | SAICA | Afrimat | Western Cape/Cape Town | https://www.linkedin.com/in/reosha-premduth-aga-sa-3a0b4b193/ |
| 756 | **Karonien Pretorius** | Pretorius / Karonien | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | — | https://www.linkedin.com/in/karonien-pretorius-8543ab143/ |
| 757 | **Maresa Pretorius** | Pretorius / Maresa | RESEARCH_HOLD | — | — | Hotel Verde Cape Town | Western Cape | https://za.linkedin.com/in/maresa-pretorius-0a139918 |
| 758 | **Susan Prinsloo** | Prinsloo / Susan | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/susan-prinsloo-74978243/ |
| 759 | **Amith Prithipaul** | Prithipaul / Amith | FINANCE_ROLE_CONFIRMED | — | — | Corobrik Lansdowne | KwaZulu-Natal/Durban | https://www.linkedin.com/in/amith-prithipaul-70a49766/ |
| 760 | **Amanda Punt** | Punt / Amanda | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/City of Johannesburg | https://www.linkedin.com/in/amanda-punt-472b54100/ |
| 761 | **fani puthini** | puthini / fani | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/Alberton | https://www.linkedin.com/in/fani-puthini-987a2b25b/ |
| 762 | **Charne Putter** | Putter / Charne | FINANCE_ROLE_CONFIRMED | — | — | Libstar | Western Cape/Cape Town | https://www.linkedin.com/in/charne-putter-ca-sa-0aa85aa5/ |
| 763 | **Siziphiwe Qayiso** | Qayiso / Siziphiwe | FINANCE_ROLE_CONFIRMED | — | — | Southern Oil (SOILL) | Western Cape/Cape Town | https://www.linkedin.com/in/siziphiwe-qayiso-80a4ab1a2/ |
| 764 | **Ayaduma Qonono** | Qonono / Ayaduma | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/City of Cape Town | https://www.linkedin.com/in/ayaduma-qonono-1a6387340/ |
| 765 | **Diana Quintero Ruiz    (MBA)** | Quintero Ruiz (MBA) / Diana | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/diana-quintero-ruiz-mba-b1b30811/ |
| 766 | **Lynn Radcliffe** | Radcliffe / Lynn | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/lynn-radcliffe-32271959/ |
| 767 | **Prudence Radebe** | Radebe / Prudence | FINANCE_ROLE_CONFIRMED | — | — | AfriSam | — | https://www.linkedin.com/in/prudence-radebe-906410116/ |
| 768 | **Tlhologelo Radebe** | Radebe / Tlhologelo | FINANCE_ROLE_CONFIRMED | — | — | Concor | Gauteng/Springs | https://www.linkedin.com/in/tlhologeloradebe/ |
| 769 | **Vincent Radebe GTP(SA)** | Radebe GTP(SA) / Vincent | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Johannesburg Metropolitan Area | https://www.linkedin.com/in/vincent-radebe-gtp-sa-04016624/ |
| 770 | **Firaz Rahman** | Rahman / Firaz | FINANCE_ROLE_CONFIRMED | — | — | RFG Foods | Western Cape/City of Cape Town | https://www.linkedin.com/in/firaz-rahman-ca-sa-b4117a8a/ |
| 771 | **Aishwarya Rajkoomar** | Rajkoomar / Aishwarya | FINANCE_ROLE_CONFIRMED | — | — | Ardagh Glass Packaging SA | Gauteng/City of Johannesburg | https://www.linkedin.com/in/aishwarya-rajkoomar-3737a0128/ |
| 772 | **Taryn Raju** | Raju / Taryn | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 773 | **Florence Ramabina** | Ramabina / Florence | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/Clayville | https://www.linkedin.com/in/florence-ramabina-241785203/ |
| 774 | **Tharien Rambalie** | Rambalie / Tharien | CONFIRMED | PA(SA) | SAIPA | Xcede Group | Western Cape/Cape Town | https://za.linkedin.com/in/tharien-rambalie-a46a7666 |
| 775 | **Sandhya Ramjee (Chavda)** | Ramjee (Chavda) / Sandhya | RESEARCH_HOLD | — | — | Nimble Group (public directory); LinkedIn also shows Payment24 | Western Cape | — |
| 776 | **Raymond Ramokgaba** | Ramokgaba / Raymond | FINANCE_ROLE_CONFIRMED | — | — | NJR Steel | Gauteng/City of Johannesburg | https://www.linkedin.com/in/raymond-ramokgaba-19b14019/ |
| 777 | **Shamima Ranchod** | Ranchod / Shamima | FINANCE_ROLE_CONFIRMED | — | — | AfriSam | Gauteng/City of Johannesburg | https://www.linkedin.com/in/shamima-ranchod-861274114/ |
| 778 | **Shikhaar Ravidas** | Ravidas / Shikhaar | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/shikhaar-ravidas-ca-sa-688b02141/ |
| 779 | **Siyanda Rayi Nameka** | Rayi Nameka / Siyanda | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Western Cape/City of Cape Town | https://www.linkedin.com/in/siyanda-rayi-nameka-393a1999/ |
| 780 | **Lenica Reddy** | Reddy / Lenica | FINANCE_ROLE_CONFIRMED | — | — | Chryso Southern Africa | Gauteng/City of Johannesburg | https://www.linkedin.com/in/lenica-reddy-13253a9b/ |
| 781 | **Ciara Reintjes** | Reintjes / Ciara | CONFIRMED | CA(SA) | SAICA | SAICA | — | — |
| 782 | **Anthony Renda** | Renda / Anthony | CONFIRMED | AGA(SA) | SAICA | North Star Guidance (Pty) Ltd | Western Cape/Durbanville | https://za.linkedin.com/in/anthony-renda-030ab9151 |
| 783 | **Chantelle Reyerse** | Reyerse / Chantelle | FINANCE_ROLE_CONFIRMED | — | — | Dutoit Agri | Gauteng/Roodepoort | https://www.linkedin.com/in/chantelle-reyerse-2124ba59/ |
| 784 | **Vanessa Rheeder** | Rheeder / Vanessa | CONFIRMED | CA(SA) | SAICA | The Modern CFO | Western Cape/Cape Town | https://www.linkedin.com/in/vanessa-rheeder-ca-sa/ |
| 785 | **Dave Rich** | Rich / Dave | CONFIRMED | CA(SA) | SAICA | Streets Chartered Accountants (Cape Town) | Western Cape/Cape Town | — |
| 786 | **GJ Richter** | Richter / GJ | FINANCE_ROLE_CONFIRMED | — | — | Namaqua Wines | Gauteng/Pretoria | https://www.linkedin.com/in/gj-richter-8856a9125/ |
| 787 | **Kyle Ringquest** | Ringquest / Kyle | FINANCE_ROLE_CONFIRMED | — | — | De Hoop Steenwerwe | Western Cape/Cape Town | https://www.linkedin.com/in/kyle-ringquest-9109501a3/ |
| 788 | **Willie Robbertse** | Robbertse / Willie | HIGH_CONFIDENCE | — | — | Geiger & Klotzbucher (Pty) Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/willie-robbertse-34747a38 |
| 789 | **Alan Robbins** | Robbins / Alan | ARTICLES_CONFIRMED_DESIGNATION_UNVERIFIED | — | — | Sable International | Western Cape/Cape Town | — |
| 790 | **Antonio Roberts** | Roberts / Antonio | RESEARCH_HOLD | — | — | KWV | Western Cape/City of Cape Town | https://za.linkedin.com/in/antonio-roberts |
| 791 | **Hanna Robertson** | Robertson / Hanna | FINANCE_ROLE_CONFIRMED | — | — | DGB | Western Cape/City of Cape Town | https://www.linkedin.com/in/hanna-robertson-66993592/ |
| 792 | **Nadine Robus Littleford** | Robus Littleford / Nadine | FINANCE_ROLE_CONFIRMED | — | — | Mpact | South Africa | https://www.linkedin.com/in/nadine-robus-hill-8a162877/ |
| 793 | **Lynette Roeloffze** | Roeloffze / Lynette | CONFIRMED | CA(SA) | SAICA | Forvis Mazars Group | Gauteng/Johannesburg | https://www.linkedin.com/in/lynette-roeloffze-ca-sa-ra-0637aa13/ |
| 794 | **Lizel Roelofse** | Roelofse / Lizel | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/lizel-roelofse-29ab3553 |
| 795 | **Freeman-Garnatt Ronell** | Ronell / Freeman-Garnatt | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/City of Cape Town | https://www.linkedin.com/in/freeman-garnatt-ronell-530a9396/ |
| 796 | **Bianca Roos** | Roos / Bianca | CONFIRMED | CA(SA) | SAICA | PKF Octagon | — | — |
| 797 | **Marnus Roothman** | Roothman / Marnus | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/Pretoria | https://www.linkedin.com/in/marnus-roothman-31a59aa0/ |
| 798 | **Roz Roseline** | Roseline / Roz | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/Rand West City | https://www.linkedin.com/in/roz-roseline-a5353427/ |
| 799 | **Jay Rosser** | Rosser / Jay | RESEARCH_HOLD | ACMA, CGMA | CIMA | Empire Finance Partners | Western Cape/Cape Town | — |
| 800 | **Robert Rossouw** | Rossouw / Robert | RESEARCH_HOLD | AGA(SA) | SAICA | AMC Cookware South Africa | Western Cape/Cape Town | — |
| 801 | **Sydney Rudzani** | Rudzani / Sydney | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group | South Africa | https://www.linkedin.com/in/sydney-rudzani-ca-sa-mba-cum-laude-acma-cgma-19658a96/ |
| 802 | **Alexis Sacks** | Sacks / Alexis | CONFIRMED | CA(SA) | SAICA | Streets Chartered Accountants (Cape Town) | Western Cape/Cape Town | — |
| 803 | **Waheeda Saib** | Saib / Waheeda | CONFIRMED | CA(SA) | SAICA | Atlantis Special Economic Zone Company (ASEZCo) | Western Cape/Cape Town | — |
| 804 | **Hishaam Salie** | Salie / Hishaam | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/hishaam-salie-44726b3a/ |
| 805 | **Gadija Samaai** | Samaai / Gadija | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group | Western Cape/Paarl | https://www.linkedin.com/in/gadija-samaai-ab427a98/ |
| 806 | **Junaid Samad** | Samad / Junaid | FINANCE_ROLE_CONFIRMED | — | — | Ardagh Glass Packaging SA | Gauteng/City of Johannesburg | https://www.linkedin.com/in/junaid-samad-1b788540/ |
| 807 | **Craig Samuel** | Samuel / Craig | CONFIRMED | PA(SA) | SAIPA | — | Western Cape | https://za.linkedin.com/in/craig-samuel-070500a3 |
| 808 | **Beverley Samuels** | Samuels / Beverley | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/beverley-samuels-19041230 |
| 809 | **Rabia Samuels** | Samuels / Rabia | CONFIRMED | PA(SA) | SAIPA | CADO Chartered Accountants Inc. | Western Cape | https://za.linkedin.com/in/rabia-samuels-3527a823b |
| 810 | **Giancarlo Sassoli** | Sassoli / Giancarlo | CONFIRMED | AGA(SA) | SAICA | 3C Metal | Western Cape/Cape Town | https://za.linkedin.com/in/giancarlo-sassoli-aga-sa-a051b9254 |
| 811 | **Graham Saunders** | Saunders / Graham | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/graham-saunders-70488453/ |
| 812 | **Naazeneen Sayed** | Sayed / Naazeneen | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/naazeneen-sayed-8b54b0b3/ |
| 813 | **Fanie Schoeman** | Schoeman / Fanie | CONFIRMED | AGA(SA) | SAICA | Houst | Western Cape/Stellenbosch | https://za.linkedin.com/in/fanie-schoeman-aga-sa-758938a2 |
| 814 | **Leandre Schoeman** | Schoeman / Leandre | CONFIRMED | ACMA, CGMA | CIMA | IBCO | Western Cape/Cape Town | https://za.linkedin.com/in/leandre-schoeman-acma-cgma-bb451b23 |
| 815 | **Tarryn Scholtz** | Scholtz / Tarryn | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Western Cape/City of Cape Town | https://www.linkedin.com/in/tarryn-scholtz-a2435a1ab/ |
| 816 | **Matheus Schreuder** | Schreuder / Matheus | FINANCE_ROLE_CONFIRMED | — | — | Fair Cape Dairies | Western Cape/Durbanville | https://www.linkedin.com/in/matheus-schreuder-1157b6264/ |
| 817 | **Phillip Schreuder** | Schreuder / Phillip | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/City of Cape Town | https://www.linkedin.com/in/phillip-schreuder-650971124/ |
| 818 | **Andrew Scrase** | Scrase / Andrew | FINANCE_ROLE_CONFIRMED | — | — | EnviroServ | Gauteng/Johannesburg | https://www.linkedin.com/in/andrew-scrase-67614b49/ |
| 819 | **Itumeleng Sealetsa** | Sealetsa / Itumeleng | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | Gauteng/City of Johannesburg | https://www.linkedin.com/in/itumeleng-sealetsa-26a81bab/ |
| 820 | **Mabatho Sedikela** | Sedikela / Mabatho | HIGH_CONFIDENCE | CA(SA) | SAICA | Auditor-General of South Africa (AGSA) | — | — |
| 821 | **Danzil September** | September / Danzil | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Stellenbosch | https://www.linkedin.com/in/danzil-september-888a93230/ |
| 822 | **Ethan September** | September / Ethan | CONFIRMED | ACMA, CGMA | CIMA | RFG Foods | Western Cape/Cape Town | https://za.linkedin.com/in/ethan-september-acma-cgma-2363a0143 |
| 823 | **Lyle September** | September / Lyle | FINANCE_ROLE_CONFIRMED | — | — | KWV | Western Cape/Kuils River | https://www.linkedin.com/in/lyleseptember0798/ |
| 824 | **Sergio September** | September / Sergio | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Western Cape/City of Cape Town | https://www.linkedin.com/in/sergio-september-21276b90/ |
| 825 | **Leon Serfontein** | Serfontein / Leon | FINANCE_ROLE_CONFIRMED | — | — | AfriSam | Gauteng/City of Johannesburg | https://www.linkedin.com/in/leon-serfontein-6559b168/ |
| 826 | **Masechaba Sesing** | Sesing / Masechaba | CONFIRMED | CA(SA) | SAICA | Free State Provincial Treasury | Free State/Bloemfontein | — |
| 827 | **Nqobile Shabane (CA)SA** | Shabane (CA)SA / Nqobile | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Durban Metropolitan Area | https://www.linkedin.com/in/nqobile-shabane-ca-sa-722518152/ |
| 828 | **Thandolwenkosi Shabangu** | Shabangu / Thandolwenkosi | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Mpumalanga/Piet Retief | https://www.linkedin.com/in/thandolwenkosi-shabangu-62b4b4192/ |
| 829 | **Aadila Shaikh** | Shaikh / Aadila | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Gauteng/Gauteng | https://www.linkedin.com/in/aadila-shaikh-93452824b/ |
| 830 | **Temoso Shazi** | Shazi / Temoso | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Gauteng/Gauteng | https://www.linkedin.com/in/temoso-shazi-034ba76/ |
| 831 | **Emmaculate Shezi** | Shezi / Emmaculate | FINANCE_ROLE_CONFIRMED | — | — | GVK-Siya Zama | South Africa | https://uk.linkedin.com/in/emmaculate-shezi-85010abb |
| 832 | **Sibongile Sibongile.Kubeka** | Sibongile.Kubeka / Sibongile | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/sibongile-sibongile-kubeka-9a548125/ |
| 833 | **Tawanda Sigauke** | Sigauke / Tawanda | CONFIRMED | ACCA | ACCA | Red Rocket South Africa (Pty) Ltd | Western Cape/Cape Town | https://za.linkedin.com/in/tawanda-sigauke-acca-369a7060 |
| 834 | **Portia Sihlahla** | Sihlahla / Portia | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/portia-sihlahla-2a08221a9/ |
| 835 | **Graeme Sim** | Sim / Graeme | FINANCE_ROLE_CONFIRMED | — | — | Kaap Agri / Agrimark | Western Cape/City of Cape Town | https://www.linkedin.com/in/graeme-sim-2a7a1068/ |
| 836 | **Zinhle Simamane** | Simamane / Zinhle | CONFIRMED | CA(SA) | SAICA | Traxtion | — | — |
| 837 | **Charlton Simpson** | Simpson / Charlton | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Western Cape/City of Cape Town | https://www.linkedin.com/in/charlton-simpson-9164651b/ |
| 838 | **Tabisa Singenile** | Singenile / Tabisa | CONFIRMED | ACMA, CGMA | CIMA | WBHO Construction - Cape Division | Johannesburg Metropolitan Area | https://www.linkedin.com/in/tabisa-singenile-cgma®-acma-3932b299/ |
| 839 | **Alka Singh** | Singh / Alka | CONFIRMED | CA(SA) | SAICA | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/alka-singh-ca-sa-12642173/ |
| 840 | **Bhaviska Singh** | Singh / Bhaviska | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Gauteng/City of Johannesburg | https://www.linkedin.com/in/bhaviska-singh-9a9831116/ |
| 841 | **Devani Singh** | Singh / Devani | FINANCE_ROLE_CONFIRMED | — | — | Raubex / Roadmac Surfacing Cape | Johannesburg Metropolitan Area | https://www.linkedin.com/in/devani-singh-909318159/ |
| 842 | **Qayiya Siphosethu Kobese** | Siphosethu Kobese / Qayiya | FINANCE_ROLE_CONFIRMED | — | — | Peninsula Beverages | Western Cape/City of Cape Town | https://www.linkedin.com/in/qayiya-siphosethu-kobese/ |
| 843 | **Augustine Sithole** | Sithole / Augustine | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/Johannesburg | https://www.linkedin.com/in/augustine-sithole-630451211/ |
| 844 | **Bantu Skaap** | Skaap / Bantu | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/City of Johannesburg | https://www.linkedin.com/in/bantu-skaap-a1b03552/ |
| 845 | **Philip Slabber** | Slabber / Philip | FINANCE_ROLE_CONFIRMED | — | — | Overberg Agri | Western Cape/City of Cape Town | https://www.linkedin.com/in/philip-slabber-ca-sa-14aa4013a/ |
| 846 | **Chantel Sliep-Viljoen** | Sliep-Viljoen / Chantel | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/chantel-sliep-viljoen-6a180774/ |
| 847 | **Karin Smidt** | Smidt / Karin | FINANCE_ROLE_CONFIRMED | — | — | Spier | Western Cape/Cape Town | https://www.linkedin.com/in/karin-smidt-86332726/ |
| 848 | **Lucinda Smidt** | Smidt / Lucinda | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/City of Cape Town | https://www.linkedin.com/in/lucinda-smidt-57043a5a/ |
| 849 | **Anneline Smit** | Smit / Anneline | HIGH_CONFIDENCE | — | — | Inala Broadcast (Pty) Ltd | Gauteng/Midrand | — |
| 850 | **Carel Smit** | Smit / Carel | HIGH_CONFIDENCE | — | — | Fidelity ADT (Pty) Ltd / ADT Security Services (Pty) Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/carel-smit-1b278820b/ |
| 851 | **Charl Smit** | Smit / Charl | CONFIRMED | AGA(SA) | SAICA | Thornlands Group | Western Cape/Cape Town | https://za.linkedin.com/in/charl-smit-aga-sa |
| 852 | **Daniël Smit** | Smit / Daniël | FINANCE_ROLE_CONFIRMED | — | — | KWV | South Africa | https://www.linkedin.com/in/daniël-smit-56390565/ |
| 853 | **Heinrich Smit** | Smit / Heinrich | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/City of Cape Town | https://www.linkedin.com/in/heinrich-smit-9b03284a/ |
| 854 | **Adrian Smith** | Smith / Adrian | CONFIRMED | ACMA, CGMA | CIMA | Bounty Apparel | Western Cape/Cape Town | https://www.linkedin.com/in/adrian-smith-acma-cgma-30942b59/ |
| 855 | **Andre Smith** | Smith / Andre | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Western Cape/Western Cape | https://www.linkedin.com/in/andre-smith-09990a18/ |
| 856 | **Lizelle Smith** | Smith / Lizelle | RESEARCH_HOLD | — | — | Inventory, Insurance & Fixed Assets | Western Cape | https://za.linkedin.com/in/lizelle-smith-6b3a7a65 |
| 857 | **Hannes Snyman** | Snyman / Hannes | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Gauteng/City of Johannesburg | https://www.linkedin.com/in/hannes-snyman/ |
| 858 | **Johan Snyman** | Snyman / Johan | FINANCE_ROLE_CONFIRMED | — | — | Fruitways | Western Cape/Somerset West | https://www.linkedin.com/in/johan-snyman-1731b215a/ |
| 859 | **Lungelwa Sogiba** | Sogiba / Lungelwa | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/lungelwa-sogiba-01a80965/ |
| 860 | **Polani Sokombela** | Sokombela / Polani | CONFIRMED | CA(SA) | SAICA | Auditor-General of South Africa (AGSA) | — | — |
| 861 | **Brendelene Solomons** | Solomons / Brendelene | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Gauteng/City of Johannesburg | https://www.linkedin.com/in/brendelene-solomons-92229b35/ |
| 862 | **Cheryl Somers Vine** | Somers Vine / Cheryl | FINANCE_ROLE_CONFIRMED | — | — | EnviroServ | Gauteng/Johannesburg | https://www.linkedin.com/in/cheryl-somers-vine-285a8410/ |
| 863 | **Shamila Soobramoney** | Soobramoney / Shamila | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/shamila-soobramoney-0699068b/ |
| 864 | **Sharmila Soobramoney** | Soobramoney / Sharmila | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/sharmila-soobramoney-369301285/ |
| 865 | **Kyle Sparg** | Sparg / Kyle | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | East London | https://www.linkedin.com/in/kyle-sparg-67188615a/ |
| 866 | **Juan Spies** | Spies / Juan | CONFIRMED | CA(SA) | SAICA | McA Durbanville Inc. | Western Cape/Durbanville | — |
| 867 | **Lois Spies** | Spies / Lois | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/lois-spies-43350460/ |
| 868 | **Justine Spreeth** | Spreeth / Justine | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | KwaZulu-Natal/eThekwini | https://www.linkedin.com/in/justine-spreeth-988aa465/ |
| 869 | **Christopher Stanley** | Stanley / Christopher | CONFIRMED | FCCA | ACCA | AIML Score | Western Cape/Cape Town | https://za.linkedin.com/in/christopher-stanley-fcca |
| 870 | **Shelton Stanley** | Stanley / Shelton | FINANCE_ROLE_CONFIRMED | — | — | Much Asphalt | Western Cape/Western Cape | https://www.linkedin.com/in/shelton-stanley-9586ab25/ |
| 871 | **Veronica Steenveld** | Steenveld / Veronica | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/veronica-steenveld-560694168/ |
| 872 | **Vedet Stevens** | Stevens / Vedet | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Western Cape/City of Cape Town | https://www.linkedin.com/in/vedetstevens/ |
| 873 | **Albert Steyn** | Steyn / Albert | FINANCE_ROLE_CONFIRMED | — | — | Capespan South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/albert-steyn-40701b69/ |
| 874 | **Elizabeth Steyn** | Steyn / Elizabeth | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/elizabeth-steyn-54b3911ba |
| 875 | **Pia Steyn** | Steyn / Pia | FINANCE_ROLE_CONFIRMED | — | — | KWV | Western Cape/City of Cape Town | https://www.linkedin.com/in/pia-steyn-ca-sa-2a0051147/ |
| 876 | **Craig Stipp** | Stipp / Craig | FINANCE_ROLE_CONFIRMED | — | — | Brito's Group | Western Cape/Western Cape | https://www.linkedin.com/in/craig-stipp-58aa5811a/ |
| 877 | **Patricia Stock** | Stock / Patricia | CONFIRMED | CA(SA) | SAICA | SAICA | — | — |
| 878 | **Mindre Stofberg** | Stofberg / Mindre | CONFIRMED | CA(SA) | SAICA | Tronox Namakwa Sands | Western Cape/Saldanha Bay Local Municipality | https://www.linkedin.com/in/mindre-stofberg-ca-sa-6416a638/ |
| 879 | **Justin Stohr** | Stohr / Justin | HIGH_CONFIDENCE | PA(SA) | SAIPA | McA Accounting & Tax Services Inc. | Western Cape/Cape Town | — |
| 880 | **MC Stoman** | Stoman / MC | HIGH_CONFIDENCE | CA(SA) | SAICA | Food Lover's Market Holdings | Western Cape/Cape Town | — |
| 881 | **Eugene Stoumann** | Stoumann / Eugene | FINANCE_ROLE_CONFIRMED | — | — | Brito's Group | Western Cape/Cape Town | https://www.linkedin.com/in/eugene-stoumann-b62127137/ |
| 882 | **Edburg Strauss** | Strauss / Edburg | CONFIRMED | CA(SA) | SAICA | netCFO | Gauteng/Pretoria | https://www.linkedin.com/in/edburg-strauss/ |
| 883 | **Neil Struthers** | Struthers / Neil | FINANCE_ROLE_CONFIRMED | — | — | Power Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/neil-struthers-019a8b70/ |
| 884 | **Ian Strydom** | Strydom / Ian | CONFIRMED | AGA(SA) | SAICA | IW Tax Advisory | Western Cape/Cape Town | https://za.linkedin.com/in/ian-strydom |
| 885 | **Elmarie Swanepoel** | Swanepoel / Elmarie | HIGH_CONFIDENCE | CA(SA) | SAICA | Stellenbosch University | Western Cape/Stellenbosch | — |
| 886 | **Victoria Swanson** | Swanson / Victoria | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/victoria-swanson-ca-sa/ |
| 887 | **Charles Swart** | Swart / Charles | CONFIRMED | AGA(SA) | SAICA | Phelan Green Group | Western Cape/Cape Town | https://za.linkedin.com/in/charles-swart-aga-sa-6a2266280 |
| 888 | **Lindi Swart** | Swart / Lindi | CONFIRMED | AGA(SA) | SAICA | Thornlands Group | Western Cape/Cape Town | https://za.linkedin.com/in/lindi-swart-aga-sa-a19b05166 |
| 889 | **Mariette Swart** | Swart / Mariette | CONFIRMED | CA(SA) | SAICA | Afrimat | Western Cape/City of Cape Town | https://www.linkedin.com/in/mariette-swart-23595541/ |
| 890 | **Cecelia Swartz** | Swartz / Cecelia | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 891 | **Andre Tancred** | Tancred / Andre | CONFIRMED | ACMA, CGMA | CIMA | RMS Shopfitting (Pty) Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/andre-tancred-b339486/ |
| 892 | **Kotze Tania** | Tania / Kotze | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/City of Cape Town | https://www.linkedin.com/in/kotze-tania-316a7030/ |
| 893 | **Raeesah Tar** | Tar / Raeesah | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Gauteng/City of Johannesburg | https://www.linkedin.com/in/raeesah-tar-1a8a97116/ |
| 894 | **Hiten Taylor** | Taylor / Hiten | CONFIRMED | ACMA, CGMA | CIMA | Stellenbosch Vineyards | Western Cape/Cape Town | https://za.linkedin.com/in/hiten-taylor-acma-cgma-a3b3b2206 |
| 895 | **Johanna Taylor** | Taylor / Johanna | CONFIRMED | ACMA, CGMA | CIMA | TFG (The Foschini Group) | Western Cape/Cape Town | https://za.linkedin.com/in/johanna-taylor-acma-cgma-b1219198 |
| 896 | **Dennis Tembo** | Tembo / Dennis | RESEARCH_HOLD | — | — | — | Western Cape/Western Cape candidate pool | https://za.linkedin.com/in/dennis-tembo-3554016 |
| 897 | **Dean Teuchert** | Teuchert / Dean | FINANCE_ROLE_CONFIRMED | — | — | Cape Herb & Spice | Western Cape/Cape Town | https://www.linkedin.com/in/dean-teuchert-b2b81b139/ |
| 898 | **Sisandile Thambo** | Thambo / Sisandile | CONFIRMED | CA(SA) | SAICA | Saint-Gobain Gyproc | Johannesburg Metropolitan Area | https://za.linkedin.com/in/sisa-thambo |
| 899 | **Anthea Thaver** | Thaver / Anthea | FINANCE_ROLE_CONFIRMED | — | — | Corobrik Lansdowne | Gauteng/Germiston | https://www.linkedin.com/in/anthea-thaver-792128160/ |
| 900 | **Willem Theron** | Theron / Willem | CONFIRMED | CA(SA) | SAICA | PSG Konsult Ltd (PSG Financial Services) | — | — |
| 901 | **Joshua Thessal** | Thessal / Joshua | FINANCE_ROLE_CONFIRMED | — | — | Corobrik Lansdowne | KwaZulu-Natal/Durban | https://www.linkedin.com/in/joshua-thessal-86a9195/ |
| 902 | **Ranchell Thomas** | Thomas / Ranchell | RESEARCH_HOLD | — | — | Tapestry Home Brands | Western Cape | https://za.linkedin.com/in/ranchell-thomas-0a4080149 |
| 903 | **Rodrique Thomas** | Thomas / Rodrique | CONFIRMED | CA(SA) | SAICA | Astron Energy | Western Cape/City of Cape Town | https://www.linkedin.com/in/rodrique-thomas/ |
| 904 | **Ndivhuwo Thomoli** | Thomoli / Ndivhuwo | CONFIRMED | CA(SA) | SAICA | AfriSam | Gauteng/City of Johannesburg | https://www.linkedin.com/in/ndivhuwo-thomoli-ca-sa-150766a8/ |
| 905 | **Ross Thomson** | Thomson / Ross | HIGH_CONFIDENCE | PA(SA) | SAIPA | Collective Accounting | KwaZulu-Natal/Winston Park | — |
| 906 | **Nomfundo Thusini** | Thusini / Nomfundo | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | KwaZulu-Natal/Durban | https://www.linkedin.com/in/nomfundo-thusini-a22b5a13b/ |
| 907 | **Thamsanqa Thwala** | Thwala / Thamsanqa | FINANCE_ROLE_CONFIRMED | — | — | Nampak | Johannesburg Metropolitan Area | https://www.linkedin.com/in/thamsanqa-thwala-ca-sa-b70585bb/ |
| 908 | **Joshua Tilney** | Tilney / Joshua | CONFIRMED | ACMA, CGMA | CIMA | Klay | Western Cape/Stellenbosch | https://www.linkedin.com/in/joshua-tilney-acma-cgma-49209b86/ |
| 909 | **Keitumetse Tito** | Tito / Keitumetse | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Northern Cape/Kathu | https://www.linkedin.com/in/keitumetse-tito-b10a62a2/ |
| 910 | **Deon Titus** | Titus / Deon | RESEARCH_HOLD | — | — | USB Executive Development | Western Cape | https://za.linkedin.com/in/deon-titus-065660a5 |
| 911 | **William Tlou. BComm, Bcompt (Hons), Mcomm,** | Tlou. BComm, Bcompt (Hons), Mcomm, / William | CONFIRMED | CA(SA) | SAICA | Tronox Namakwa Sands | Gauteng/City of Johannesburg | https://www.linkedin.com/in/william-tlou-bcomm-bcompt-hons-mcomm-ca-sa-5161b029/ |
| 912 | **Pieter Toerien** | Toerien / Pieter | FINANCE_ROLE_CONFIRMED | — | — | ASLA | Western Cape/City of Cape Town | https://www.linkedin.com/in/pieter-toerien-14727091/ |
| 913 | **Bianca Treiber** | Treiber / Bianca | FINANCE_ROLE_CONFIRMED | — | — | Fruitways | Western Cape/City of Cape Town | https://www.linkedin.com/in/bianca-treiber-66384ab9/ |
| 914 | **Maurice Trichardt** | Trichardt / Maurice | CONFIRMED | AGA(SA) | SAICA | Panorama Consulting | Western Cape/Cape Town | https://za.linkedin.com/in/supremeaccountant |
| 915 | **Martli Truter** | Truter / Martli | CONFIRMED | PA(SA) | SAIPA | Mohr Foods | Western Cape/Durbanville | https://za.linkedin.com/in/martli-truter-pa-sa-4830352ab |
| 916 | **An-ri Truter Roodt** | Truter Roodt / An-ri | CONFIRMED | AGA(SA) | SAICA | CTBA Tax and Business Advisory | Western Cape/Tygervalley | https://za.linkedin.com/in/an-ri-truter-roodt |
| 917 | **Mikateko Tshetshe** | Tshetshe / Mikateko | CONFIRMED | FCMA, CGMA | CIMA | Unilever | — | — |
| 918 | **Lehlohonolo Tsotetsi** | Tsotetsi / Lehlohonolo | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Gauteng/City of Johannesburg | https://www.linkedin.com/in/lehlohonolo-tsotetsi-8a79451ba/ |
| 919 | **Tebogo Tuba** | Tuba / Tebogo | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Western Cape/City of Cape Town | https://www.linkedin.com/in/tebogo-tuba-08b8597b/ |
| 920 | **Kelly Turck** | Turck / Kelly | FINANCE_ROLE_CONFIRMED | — | — | Capespan South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/kelly-turck-310b8a33/ |
| 921 | **Liyema Tweni** | Tweni / Liyema | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/Cape Town | https://www.linkedin.com/in/liyema-tweni-9688b9178/ |
| 922 | **Sipumeze Tyali** | Tyali / Sipumeze | CONFIRMED | PA(SA) | SAIPA | DigiOutsource | Western Cape/Cape Town | https://za.linkedin.com/in/sipumeze-tyali-professional-accountant-sa-saipa-295a14140 |
| 923 | **Lumka Unathi Kappel** | Unathi Kappel / Lumka | CONFIRMED | CA(SA) | SAICA | Astron Energy | Western Cape/City of Cape Town | https://www.linkedin.com/in/lumka-unathi-kappel-ca-sa-2a54b1133/ |
| 924 | **Deon Uys** | Uys / Deon | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | — | https://www.linkedin.com/in/deon-uys-99771523/ |
| 925 | **Bernadette V.** | V. / Bernadette | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/Johannesburg | https://www.linkedin.com/in/bernadette-v-854989212/ |
| 926 | **Amanda Vakalisa** | Vakalisa / Amanda | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Gauteng/City of Johannesburg | https://www.linkedin.com/in/amanda-vakalisa-acma-cgma-mba-a250b866/ |
| 927 | **Nina Valentine (nee. Coetzee)** | Valentine (nee. Coetzee) / Nina | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Western Cape/City of Cape Town | https://www.linkedin.com/in/nina-valentine-nee-coetzee-b1416a139/ |
| 928 | **Welgemoed Valerie** | Valerie / Welgemoed | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/welgemoed-valerie-5923b48a/ |
| 929 | **Linda Van Deemter** | Van Deemter / Linda | FINANCE_ROLE_CONFIRMED | — | — | EnviroServ | Gauteng/Johannesburg | https://www.linkedin.com/in/linda-van-deemter-0611a911/ |
| 930 | **Johan Van den Elst** | Van den Elst / Johan | FINANCE_ROLE_CONFIRMED | — | — | KWV | Western Cape/Paarl | https://www.linkedin.com/in/johan-van-den-elst-559747204/ |
| 931 | **Ben Van Der Linde** | Van Der Linde / Ben | CONFIRMED | PA(SA) | SAIPA | — | Western Cape | https://za.linkedin.com/in/ben-van-der-linde |
| 932 | **Arjan Van der Lugt** | Van der Lugt / Arjan | RESEARCH_HOLD | — | — | The Fruit Farm Group South Africa | Western Cape | https://za.linkedin.com/in/arjan-van-der-lugt-2b991384 |
| 933 | **DeWalt Van Der Merwe** | Van Der Merwe / DeWalt | RESEARCH_HOLD | PA(SA) | SAIPA | CASADOBE PROPS 60 / MNK Projects Group | Western Cape/Cape Town | — |
| 934 | **Geraldine Van Der Merwe** | Van Der Merwe / Geraldine | FINANCE_ROLE_CONFIRMED | — | — | Concor | Gauteng/City of Johannesburg | https://www.linkedin.com/in/geraldine-van-der-merwe-213ba2179/ |
| 935 | **IR Van der Merwe** | Van der Merwe / IR | CONFIRMED | CA(SA) | SAICA | Raubex / Roadmac Surfacing Cape | Free State/Bloemfontein | https://www.linkedin.com/in/ir-van-der-merwe-a3a76955/ |
| 936 | **Leandra van der Merwe** | van der Merwe / Leandra | FINANCE_ROLE_CONFIRMED | — | — | Peninsula Beverages | Western Cape/City of Cape Town | https://www.linkedin.com/in/leandra-van-der-merwe-4aa73511a/ |
| 937 | **Peet van der Merwe** | van der Merwe / Peet | CONFIRMED | CA(SA) | SAICA | Forvis Mazars in South Africa | Free State/Bloemfontein | https://www.linkedin.com/in/peet-van-der-merwe-ca-sa-ra-8320b7a6/ |
| 938 | **Annette van der Vyver** | van der Vyver / Annette | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/annette-van-der-vyver-85711734 |
| 939 | **Jo-Anne van der Walt** | van der Walt / Jo-Anne | CONFIRMED | PA(SA) | SAIPA | Wauko | Western Cape/Cape Town | https://za.linkedin.com/in/jo-anne-van-der-walt-0016b7128 |
| 940 | **Joe van der Walt** | van der Walt / Joe | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Western Cape/City of Cape Town | https://www.linkedin.com/in/joe-van-der-walt-5a268616/ |
| 941 | **Lizaan van der Walt** | van der Walt / Lizaan | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | Western Cape/Paarl | https://www.linkedin.com/in/lizaan-van-der-walt-664293147/ |
| 942 | **Vinita van der Walt** | van der Walt / Vinita | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/vinita-van-der-walt-39507781/ |
| 943 | **Adri Van Der Westhuizen** | Van Der Westhuizen / Adri | FINANCE_ROLE_CONFIRMED | — | — | AfriSam | — | https://www.linkedin.com/in/adri-van-der-westhuizen-02309041/ |
| 944 | **Ansie van der Westhuizen** | van der Westhuizen / Ansie | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/ansie-van-der-westhuizen-a89861146/ |
| 945 | **Marilé Van der Westhuizen** | Van der Westhuizen / Marilé | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Gauteng/City of Johannesburg | https://www.linkedin.com/in/marilé-van-der-westhuizen-098343b0/ |
| 946 | **Nadia Van Der Westhuizen** | Van Der Westhuizen / Nadia | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 947 | **Tinu van der Westhuizen** | van der Westhuizen / Tinu | FINANCE_ROLE_CONFIRMED | — | — | Sea Harvest Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/tinuv/ |
| 948 | **Cornell van Eeden** | van Eeden / Cornell | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 949 | **Zahn-Mari van Eeden** | van Eeden / Zahn-Mari | CONFIRMED | PA(SA) | SAIPA | KEE Property Investments | Western Cape/Stellenbosch | https://za.linkedin.com/in/zahn-mari-van-eeden-a10414127 |
| 950 | **Christel van Greunen** | van Greunen / Christel | CONFIRMED | ACMA, CGMA | CIMA | fibertime | Western Cape/Cape Town | https://za.linkedin.com/in/christelvangreunen |
| 951 | **Madele Van Heerden** | Van Heerden / Madele | FINANCE_ROLE_CONFIRMED | — | — | Brito's Group | Western Cape/Cape Town | https://www.linkedin.com/in/madele-van-heerden-ab60a334/ |
| 952 | **Anton van Niekerk** | van Niekerk / Anton | CONFIRMED | ACMA, CGMA | CIMA | Snapplify | Western Cape/Cape Town | https://www.linkedin.com/in/anton-van-niekerk-acma-b7503b87/ |
| 953 | **Brink van Niekerk** | van Niekerk / Brink | FINANCE_ROLE_CONFIRMED | — | — | Averda South Africa | South Africa | https://www.linkedin.com/in/cbgvanniekerk/ |
| 954 | **Charmaine van Niekerk** | van Niekerk / Charmaine | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/City of Johannesburg | https://www.linkedin.com/in/charmaine-van-niekerk-788a3589/ |
| 955 | **Gerrit van Niekerk** | van Niekerk / Gerrit | CONFIRMED | CA(SA) | SAICA | Isipani Construction | Western Cape/City of Cape Town / Paarl | https://za.linkedin.com/in/gerrit-van-niekerk-8195587 |
| 956 | **Monique van Niekerk** | van Niekerk / Monique | CONFIRMED | AGA(SA) | SAICA | Creative CFO | Western Cape/Cape Town | https://za.linkedin.com/in/monique-van-niekerk-aga-sa-497898125 |
| 957 | **Ger-Mari Van Niekerk (CA)(SA)** | Van Niekerk (CA)(SA) / Ger-Mari | FINANCE_ROLE_CONFIRMED | — | — | Kaap Agri / Agrimark | South Africa | https://www.linkedin.com/in/ger-mari-van-niekerk-ca-sa-5a96a0120/ |
| 958 | **Ralton van Reenen** | van Reenen / Ralton | FINANCE_ROLE_CONFIRMED | — | — | Astron Energy | Western Cape/City of Cape Town | https://www.linkedin.com/in/ralton-van-reenen-633520119/ |
| 959 | **Ewan van Rensburg** | van Rensburg / Ewan | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/ewan-van-rensburg-538732b/ |
| 960 | **Johann van Rensburg** | van Rensburg / Johann | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 961 | **Stephan van Rensburg** | van Rensburg / Stephan | FINANCE_ROLE_CONFIRMED | — | — | Kaap Agri / Agrimark | Western Cape/Paarl | https://www.linkedin.com/in/stephan-van-rensburg-9b62b914a/ |
| 962 | **Egbert Van Romburgh** | Van Romburgh / Egbert | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Western Cape/Durbanville | https://www.linkedin.com/in/egbert-van-romburgh-6014821b9/ |
| 963 | **Charl Van Schalkwyk** | Van Schalkwyk / Charl | FINANCE_ROLE_CONFIRMED | — | — | Raubex / Roadmac Surfacing Cape | Free State/Bloemfontein | https://www.linkedin.com/in/charl-van-schalkwyk-a6229533/ |
| 964 | **Deon van Schalkwyk** | van Schalkwyk / Deon | FINANCE_ROLE_CONFIRMED | — | — | Capespan South Africa | Western Cape/City of Cape Town | https://www.linkedin.com/in/deon-van-schalkwyk-22481044/ |
| 965 | **Anneke van Tonder** | van Tonder / Anneke | FINANCE_ROLE_CONFIRMED | — | — | NJR Steel | Gauteng/Roodepoort | https://www.linkedin.com/in/anneke-van-tonder-8a8171297/ |
| 966 | **Owen van Tonder** | van Tonder / Owen | CONFIRMED | CA(SA) | SAICA | Woolworths Holdings Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/owen-van-tonder-ca-sa-a8482131/ |
| 967 | **Villiers van Veen** | van Veen / Villiers | FINANCE_ROLE_CONFIRMED | — | — | Sentraal-Suid Co-operative (SSK) | Western Cape/Swellendam | https://www.linkedin.com/in/villiers-van-veen-44399b3a/ |
| 968 | **Ernst van Vondel** | van Vondel / Ernst | CONFIRMED | CA(SA) | SAICA | Power Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/vondel/ |
| 969 | **Celecia Van Wyk** | Van Wyk / Celecia | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | — | https://www.linkedin.com/in/celecia-van-wyk-ba5402114/ |
| 970 | **Willie van Wyk** | van Wyk / Willie | CONFIRMED | CA(SA) | SAICA | Workforce Holdings Ltd | Gauteng/Johannesburg | — |
| 971 | **Carlo Van Zyl** | Van Zyl / Carlo | RESEARCH_HOLD | — | — | Shoprite Group | Western Cape | https://za.linkedin.com/in/carlo-van-zyl-7805baa2 |
| 972 | **Jana van Zyl** | van Zyl / Jana | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 973 | **Jani van Zyl** | van Zyl / Jani | FINANCE_ROLE_CONFIRMED | — | — | KWV | South Africa | https://www.linkedin.com/in/jani-van-zyl-ca-sa-b46a0116a/ |
| 974 | **Niel Van Zyl** | Van Zyl / Niel | CONFIRMED | ACMA, CGMA | CIMA | Pepkor Payments and Lending | Western Cape/Cape Town | https://za.linkedin.com/in/niel-van-zyl-02462a182 |
| 975 | **Sonja Van Zyl** | Van Zyl / Sonja | CONFIRMED | AGA(SA) | SAICA | Acredo Accounting | Western Cape/Durbanville | https://za.linkedin.com/in/sonja-van-zyl-saica-associate-general-accountant-96a9362a |
| 976 | **Werner van Zyl** | van Zyl / Werner | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Gauteng/Benoni | https://www.linkedin.com/in/werner-van-zyl-ca-sa-a6347a105/ |
| 977 | **Willene van Zyl** | van Zyl / Willene | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 978 | **Jayvant Vassen** | Vassen / Jayvant | FINANCE_ROLE_CONFIRMED | — | — | Capespan South Africa | Western Cape/Cape Town | https://www.linkedin.com/in/jayvant-vassen-9529a71b8/ |
| 979 | **Xelani Vathiwe** | Vathiwe / Xelani | FINANCE_ROLE_CONFIRMED | — | — | PetroSA | Western Cape/George | https://www.linkedin.com/in/xelani-vathiwe-1371902a/ |
| 980 | **Claudia Vega Barandiarán** | Vega Barandiarán / Claudia | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | Gauteng/City of Johannesburg | https://www.linkedin.com/in/claudiavegabarandiaran/ |
| 981 | **Louis Veldsman** | Veldsman / Louis | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Western Cape/City of Cape Town | https://www.linkedin.com/in/louisveldsmanza/ |
| 982 | **Brendan Venter** | Venter / Brendan | CONFIRMED | AGA(SA) | SAICA | EVOLABS | Western Cape/Cape Town | https://za.linkedin.com/in/brendan-venter-aga-sa-7864827a |
| 983 | **Daniele Venter** | Venter / Daniele | FINANCE_ROLE_CONFIRMED | — | — | SA Metal Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/daniele-venter-778276121/ |
| 984 | **Freda Venter** | Venter / Freda | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/freda-venter-b7a43687/ |
| 985 | **Frikkie Venter** | Venter / Frikkie | CONFIRMED | PA(SA) | SAIPA | Southern African Fruit Terminals | Western Cape/Cape Town | https://za.linkedin.com/in/frikkie-venter-professional-accountant-sa-8891b510a |
| 986 | **Inga Venter** | Venter / Inga | CONFIRMED | PA(SA) | SAIPA | FTTx And Energy Warehouse | Western Cape/Cape Town | https://za.linkedin.com/in/inga-venter-professional-accountant-sa-5aa62ba6 |
| 987 | **Joani Venter** | Venter / Joani | CONFIRMED | AGA(SA) | SAICA | Fingri Chartered Accountants | Western Cape/Stellenbosch | https://za.linkedin.com/in/joani-venter-aga-sa-763703236 |
| 988 | **Quintin Venter** | Venter / Quintin | HIGH_CONFIDENCE | PA(SA) | SAIPA | Sempre Financial Group | Western Cape/Bellville (Cape Town) | — |
| 989 | **Monique Venter ACMA, CGMA** | Venter ACMA, CGMA / Monique | CONFIRMED | ACMA, CGMA | CIMA | — | Western Cape | https://za.linkedin.com/in/monique-venter-742057b3 |
| 990 | **Barnus Vermeulen** | Vermeulen / Barnus | CONFIRMED | PA(SA) | SAIPA | PSG Konsult / PSG Financial Services | Western Cape/PSG Cape Town ecosystem | https://za.linkedin.com/in/barnus-vermeulen-865a2589 |
| 991 | **Herman Vermeulen** | Vermeulen / Herman | FINANCE_ROLE_CONFIRMED | — | — | Southern Oil (SOILL) | Western Cape/Swellendam | https://www.linkedin.com/in/herman-vermeulen-ca-sa-6a322892/ |
| 992 | **Mariska Vermeulen** | Vermeulen / Mariska | FINANCE_ROLE_CONFIRMED | — | — | Southern Oil (SOILL) | Western Cape/Swellendam | https://www.linkedin.com/in/mariska-vermeulen-48b8b6255/ |
| 993 | **John Vertue** | Vertue / John | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/john-vertue-99721264 |
| 994 | **Vijedharsan Vijendranath** | Vijendranath / Vijedharsan | CONFIRMED | FCCA | ACCA | — | Gauteng/Johannesburg | https://www.linkedin.com/in/vijedharsan-vijendranath-fcca-uk-6118b1103/ |
| 995 | **Berenice Vilander** | Vilander / Berenice | RESEARCH_HOLD | PA(SA) | SAIPA | Western Cape Government / Sanlam background | Western Cape/Cape Town | — |
| 996 | **Chantal Viljoen** | Viljoen / Chantal | RESEARCH_HOLD | — | — | TEKCOPAC | Western Cape | https://za.linkedin.com/in/chantal-viljoen-5552aa99 |
| 997 | **Willie Viljoen** | Viljoen / Willie | CONFIRMED | AGA(SA) | SAICA | IJ Smith & Co Inc | Western Cape/Somerset West | https://za.linkedin.com/in/willie-viljoen-aga-sa-475733218 |
| 998 | **Qinisela Vincent Rasmeni** | Vincent Rasmeni / Qinisela | FINANCE_ROLE_CONFIRMED | — | — | DSV | Gauteng/City of Johannesburg | https://www.linkedin.com/in/qinisela-vincent-rasmeni-0805b3ab/ |
| 999 | **Henlie Viola** | Viola / Henlie | FINANCE_ROLE_CONFIRMED | — | — | Kaap Agri / Agrimark | Western Cape/City of Cape Town | https://www.linkedin.com/in/henlie-viola-ca-sa-24545a144/ |
| 1000 | **Mart-Marie Visagie** | Visagie / Mart-Marie | FINANCE_ROLE_CONFIRMED | — | — | Brito's Group | Western Cape/Cape Town | https://www.linkedin.com/in/mart-marie-visagie-34bb99104/ |
| 1001 | **Chrizelda Visser** | Visser / Chrizelda | CONFIRMED | ACMA, CGMA | CIMA | Curated Beverages Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/chrizelda-visser-acma-cgma-3671b454/ |
| 1002 | **Bronwyn Von Maltitz** | Von Maltitz / Bronwyn | CONFIRMED | AGA(SA) | SAICA | CrossBoundary Energy | Western Cape/Cape Town | https://za.linkedin.com/in/bronwyn-von-maltitz-aga-sa-78b17910b |
| 1003 | **Wilhelm Von Westernhagen** | Von Westernhagen / Wilhelm | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/wilhelm-von-westernhagen-a047b684/ |
| 1004 | **Christiaan Vorster** | Vorster / Christiaan | CONFIRMED | CA(SA) | SAICA | SAICA | Western Cape/Cape Town | — |
| 1005 | **Monika Vorster** | Vorster / Monika | FINANCE_ROLE_CONFIRMED | — | — | Raubex / Roadmac Surfacing Cape | Bloemfontein Metropolitan Area | https://www.linkedin.com/in/monika-vorster-5773711a3/ |
| 1006 | **Nhlakanipho Vusi Mpungose (CFE)** | Vusi Mpungose (CFE) / Nhlakanipho | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | Gauteng/Gauteng | https://www.linkedin.com/in/nhlakanipho-mpungose-5b6545282/ |
| 1007 | **Marco Wagener** | Wagener / Marco | HIGH_CONFIDENCE | PA(SA) | SAIPA | Excellentia Accounting and Tax Solutions | — | — |
| 1008 | **Ashleigh Waite** | Waite / Ashleigh | CONFIRMED | AGA(SA) | SAICA | JTC Group | Western Cape/Cape Town | https://za.linkedin.com/in/ashleigh-waite-aga-sa-bb1b8a169 |
| 1009 | **Philip Wapenaar** | Wapenaar / Philip | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/philipwapenaar |
| 1010 | **Saneesa Ward** | Ward / Saneesa | CONFIRMED | CA(SA) | SAICA | Raubex / Roadmac Surfacing Cape | Free State/Bloemfontein | https://www.linkedin.com/in/saneesa-ward-ca-sa-3a3533136/ |
| 1011 | **Cecil Wehmeyer ACMA, CGMA** | Wehmeyer ACMA, CGMA / Cecil | CONFIRMED | ACMA, CGMA | CIMA | DataEQ | Western Cape | https://za.linkedin.com/in/cecilwehmeyer |
| 1012 | **Aadam Wei** | Wei / Aadam | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/aadam-wei-ca-sa-7a0063113/ |
| 1013 | **Kirsten Wentzel** | Wentzel / Kirsten | FINANCE_ROLE_CONFIRMED | — | — | SAB / AB InBev - Newlands Brewery | Johannesburg Metropolitan Area | https://www.linkedin.com/in/kirsten-wentzel-a4a138178/ |
| 1014 | **Shelley Wessels** | Wessels / Shelley | CONFIRMED | CA(SA) | SAICA | PetroSA | Western Cape/City of Cape Town | https://www.linkedin.com/in/shelley-wessels/ |
| 1015 | **Craig West** | West / Craig | CONFIRMED | AGA(SA) | SAICA | WCB Property Development | Western Cape/Cape Town | https://za.linkedin.com/in/craig-west-aga-sa-562a81a2 |
| 1016 | **Russell Weyer** | Weyer / Russell | FINANCE_ROLE_CONFIRMED | — | — | Lactalis South Africa | South Africa | https://www.linkedin.com/in/russell-weyer-3209845b/ |
| 1017 | **Shandré Whittles** | Whittles / Shandré | CONFIRMED | AGA(SA) | SAICA | RPF Africa | Western Cape | https://za.linkedin.com/in/shandr%C3%A9-whittles-aga-sa-9a14a4143 |
| 1018 | **Jeanie Wiese** | Wiese / Jeanie | ARTICLES_CONFIRMED_DESIGNATION_UNVERIFIED | — | — | Le Roux Fruit Exporters | Western Cape | https://za.linkedin.com/in/jeanie-wiese-3907343a |
| 1019 | **Zach Wiid** | Wiid / Zach | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Mpumalanga/Nelspruit | https://www.linkedin.com/in/zach-wiid-854b921b2/ |
| 1020 | **Justin Williams** | Williams / Justin | CONFIRMED | AGA(SA), ACMA, CGMA | SAICA, CIMA | Ares Holdings | Western Cape/Cape Town | https://za.linkedin.com/in/justin-williams-acma-cgma-06ab1a1a0 |
| 1021 | **Mark Willimott** | Willimott / Mark | CONFIRMED | CA(SA) | SAICA | BDO South Africa | Eastern Cape/Gqeberha (Port Elizabeth) | — |
| 1022 | **Cindy-Lee Wilson** | Wilson / Cindy-Lee | RESEARCH_HOLD | — | — | PSG Financial Services | Western Cape | — |
| 1023 | **Emeal Winston (Emeal) van der Westhuizen** | Winston (Emeal) van der Westhuizen / Emeal | FINANCE_ROLE_CONFIRMED | — | — | Afrimat | Gauteng/City of Johannesburg | https://www.linkedin.com/in/emeal-winston-van-der-westhuizen-25925a57/ |
| 1024 | **Keenen Witbooi** | Witbooi / Keenen | FINANCE_ROLE_CONFIRMED | — | — | Peninsula Beverages | South Africa | https://www.linkedin.com/in/keenen-witbooi-2622a5a9/ |
| 1025 | **Taryn Woodbridge** | Woodbridge / Taryn | CONFIRMED | CA(SA) | SAICA | Mercedes-Benz South Africa Ltd | — | — |
| 1026 | **Luke Woodhouse** | Woodhouse / Luke | CONFIRMED | CA(SA) | SAICA | GUUD GLOBAL | Gauteng/Johannesburg | https://www.linkedin.com/in/luke-woodhouse-ca-sa-b31a0149/ |
| 1027 | **Craig Wright** | Wright / Craig | CONFIRMED | CA(SA) | SAICA | Novus Holdings Ltd | Western Cape/Cape Town | — |
| 1028 | **Gretchen Wrigley** | Wrigley / Gretchen | FINANCE_ROLE_CONFIRMED | — | — | PepsiCo South Africa / Pioneer Foods | Western Cape/City of Cape Town | https://www.linkedin.com/in/gretchen-wrigley-3777a443/ |
| 1029 | **Nompumelelo Zama-Ngcongo** | Zama-Ngcongo / Nompumelelo | FINANCE_ROLE_CONFIRMED | — | — | Mpact | Gauteng/City of Johannesburg | https://www.linkedin.com/in/nompumelelo-zama-ngcongo-087a8b65/ |
| 1030 | **Odwa Zamatyala** | Zamatyala / Odwa | FINANCE_ROLE_CONFIRMED | — | — | Oceana Group | Western Cape/City of Cape Town | https://www.linkedin.com/in/odwa-zamatyala-24260b1a2/ |
| 1031 | **Bianka Zietsman** | Zietsman / Bianka | CONFIRMED | PA(SA) | SAIPA | Mpact | Gauteng/City of Johannesburg | https://www.linkedin.com/in/bianka-zietsman-268475111/ |
| 1032 | **Sibusiso Zikalala** | Zikalala / Sibusiso | FINANCE_ROLE_CONFIRMED | — | — | WBHO Construction - Cape Division | Gauteng/City of Johannesburg | https://www.linkedin.com/in/sibusiso-zikalala-46188238/ |
| 1033 | **Andisa Zinja** | Zinja / Andisa | CONFIRMED | CA(SA) | SAICA | Trans-Caledon Tunnel Authority (TCTA) | Gauteng/Midrand | — |
| 1034 | **MOEGAMAT ZUBAIR ABDURAHMAN** | ZUBAIR ABDURAHMAN / MOEGAMAT | FINANCE_ROLE_CONFIRMED | — | — | Polyoak Packaging | Western Cape/Cape Town | https://www.linkedin.com/in/moegamat-zubair-abdurahman/ |
| 1035 | **Dumisani Zulu** | Zulu / Dumisani | CONFIRMED | AGA(SA) | SAICA | Bonakude Consulting (Pty) Ltd | KwaZulu-Natal/Port Shepstone | https://www.linkedin.com/in/dumisani-zulu-aga-sa-aimfo-a5a62622 |
| 1036 | **Sinethemba Zulu** | Zulu / Sinethemba | FINANCE_ROLE_CONFIRMED | — | — | Premier Fishing & Brands | Western Cape/Cape Town | https://www.linkedin.com/in/snethemba-zulu-29b00238/ |

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
| cmp-0057 | Adriaan de Lange Advisory | Professional Services | Cape Town |
| cmp-0090 | ADT South Africa (ADT Security Services (Pty) Ltd) | Private security / armed response / monitoring | — |
| cmp-0080 | Anchor Industries (Pty) Ltd | Lifting, rigging, offshore mooring and marine engineering equipment/services | — |
| cmp-0059 | ASL | Professional Services | Somerset West |
| cmp-0084 | Atlantis Special Economic Zone (Pty) Ltd (ASEZ / ASEZCo) | Special economic zone operator / industrial development | — |
| cmp-0007 | Auditor-General of South Africa | Government | — |
| cmp-0073 | AYO Technology Solutions Limited | Technology | Cape Town |
| cmp-0010 | BAIC South Africa | Automotive | — |
| cmp-0021 | Bayer (South Africa) | Pharmaceuticals | — |
| cmp-0069 | BDO South Africa | Accounting / Audit | Johannesburg (Parktown), Cape Town, Stellenbosch, Gqeberha (Port Elizabeth), Durban, Pretoria |
| cmp-0017 | Bonakude Consulting (Pty) Ltd | Professional Services | — |
| cmp-0064 | Boshoff Knoetze Chartered Accountants | Accounting / Audit | Somerset West (Helderberg) |
| cmp-0054 | Bounty Apparel | Manufacturing | Cape Town |
| cmp-0043 | Brenn-O-Kem | Manufacturing | Stellenbosch / Worcester region (Western Cape) |
| cmp-0108 | Buffalo City Metropolitan Development Agency (BCMDA) | Regional development agency | — |
| cmp-0006 | Burstone | Property | — |
| cmp-0066 | Callidus Accountants | Accounting / Audit | Somerset West |
| cmp-0044 | Cape Chamber of Commerce & Industry | Non-Profit | Cape Town |
| cmp-0106 | Cape Town International Convention Centre (CTICC) / Cape Town Town Conventions | Convention, exhibition and event venue | — |
| cmp-0037 | CIMA Africa | Professional Services | — |
| cmp-0053 | Curated Beverages Ltd | FMCG | Cape Town (Tyger Valley) |
| cmp-0051 | Curro Holdings Ltd | Education | Cape Town (Durbanville) |
| cmp-0023 | Deloitte (South Africa) | Accounting / Audit | — |
| cmp-0014 | Drone Ops Group | Technology | — |
| cmp-0079 | Ecowize (Southern Africa) / Ecowize Group | Hygiene, sanitation and food-safety services | — |
| cmp-0095 | Educor (Pty) Ltd - Educor Group | Private higher education: Damelin, CityVarsity, ICESA, Lyceum College, INTEC College, Damelin Correspondence College, Central Technical College | — |
| cmp-0093 | Electron Technologies (Electron Engineering Supply) | Electrical equipment, switchboards, automation, solar | — |
| cmp-0065 | Emma Pardoe Chartered Accountants (SA) | Accounting / Audit | Somerset West |
| cmp-0033 | Energy and Water Sector Education and Training Authority | Government | — |
| cmp-0096 | ENRC Africa (African operations of ENRC plc) | Diversified natural resources - mining, processing, energy, logistics | — |
| cmp-0034 | Financial Sector Conduct Authority | Government | — |
| cmp-0078 | Food Lover's Market | Food retail / independent supermarket wholesale group | — |
| cmp-0047 | Forvis Mazars in South Africa | Accounting / Audit | Cape Town (Century City), Johannesburg, Bloemfontein, Pretoria |
| cmp-0011 | Fourways Airconditioning | Engineering | — |
| cmp-0028 | Free State Provincial Treasury | Government | — |
| cmp-0081 | Fruit & Veg City / Freshstop | Food retail / convenience retail | — |
| cmp-0083 | Geiger & Klotzbucher (Pty) Ltd | Packaging equipment and materials for perishable food (BRC-certified printing/converting) | — |
| cmp-0020 | Grant Thornton (South Africa) | Accounting / Audit | — |
| cmp-0058 | GUUD GLOBAL | Technology | Cape Town |
| cmp-0002 | Harmony Gold Mining | Mining | — |
| cmp-0086 | Helderberg Village | Retirement village / assisted living | — |
| cmp-0104 | Hisense Operations Africa (Hisense SA) | Consumer electronics and appliances manufacturing/distribution | — |
| cmp-0098 | Inala Broadcast (Pty) Ltd | Broadcast systems provision and integration | — |
| cmp-0087 | Isilumko ATT (Pty) Ltd | IT services and BPO (applicant tracking, payroll outsourcing) | — |
| cmp-0070 | Johan le Roux CA(SA) | Accounting / Audit | Milnerton, Cape Town |
| cmp-0091 | Kentz Group (South African headquarters) | Engineering, procurement and construction | — |
| cmp-0004 | KPMG (South Africa) | Accounting / Audit | — |
| cmp-0072 | Kula | — | Worcester |
| cmp-0038 | LA Financial Services (Pty) Ltd | Accounting / Audit | — |
| cmp-0008 | Lanseria International Airport | Aviation | — |
| cmp-0068 | LDP Chartered Accountants and Auditors Inc. | Accounting / Audit | Stellenbosch (HQ), Pretoria |
| cmp-0075 | M+C Saatchi Group | Professional Services | Cape Town |
| cmp-0113 | M-KOPA Solar | Pay-as-you-go solar / consumer fintech | — |
| cmp-0031 | Makosi | Professional Services | — |
| cmp-0035 | Masisizane Fund | Financial Services | — |
| cmp-0085 | Mason's Clothing (Mason / Mass Clothing) | Value clothing retail and manufacturing | — |
| cmp-0024 | Massmart | Retail | — |
| cmp-0041 | McA Inc. | Accounting / Audit | Durbanville (Cape Town) |
| cmp-0012 | Mckenzie & Associates | Accounting / Audit | — |
| cmp-0001 | Mercedes-Benz South Africa Ltd | Automotive | — |
| cmp-0056 | MK Aerospace SA | Technology | Cape Town (Somerset West area) |
| cmp-0032 | Motlanalo Chartered Accountants and Auditors Inc | Accounting / Audit | — |
| cmp-0025 | Motus Mobility Solutions | Automotive | — |
| cmp-0103 | National Agricultural Marketing Council (NAMC) | Agricultural market development / MLDC framework | — |
| cmp-0109 | National Department of Agriculture, Land Reform and Rural Development (NDA) | Agriculture | — |
| cmp-0003 | Nedbank Group Limited | Banking | — |
| cmp-0063 | netCFO | Accounting / Audit | Pretoria |
| cmp-0077 | Novus Holdings Ltd (formerly Paarl Media Group) | Commercial printing, labels, flexible packaging, tissue | — |
| cmp-0071 | Pay@ | Fintech | Stellenbosch |
| cmp-0048 | Pinnacle Accounting | Accounting / Audit | Western Cape |
| cmp-0030 | PKF Octagon | Accounting / Audit | — |
| cmp-0105 | Premier Foods / Premier FMCG (Kerry Group Africa) | FMCG food manufacturing and distribution | — |
| cmp-0013 | Probeta Training (Pty) Ltd | Education | — |
| cmp-0067 | PSG Konsult Ltd | Financial Services | Stellenbosch (group HQ) |
| cmp-0027 | PwC (South Africa) | Accounting / Audit | — |
| cmp-0076 | Quantum Foods Ltd | Poultry / food manufacturing & agriculture | — |
| cmp-0089 | Radisson Hotel Group - Africa managed portfolio | Hospitality - hotel management | — |
| cmp-0088 | REFSOLS - Refrigeration Solutions & Fridgetec Services | Industrial refrigeration equipment, service and maintenance | — |
| cmp-0112 | Retail Capital | SME funding / alternative lending | — |
| cmp-0082 | RMS Shopfitting (Pty) Ltd | Retail shopfitting / joinery manufacturing | — |
| cmp-0092 | Roymec Technologies (Pty) Ltd | Minerals-processing / process equipment engineering | — |
| cmp-0046 | Sable International | Professional Services | Cape Town |
| cmp-0009 | SAICA | Professional Services | — |
| cmp-0094 | Samsonite South Africa | Luggage and travel goods - South African distribution | — |
| cmp-0022 | SAP Africa | Technology | — |
| cmp-0045 | Schoemans Registered Auditors and Chartered Accountants | Accounting / Audit | Cape Town |
| cmp-0052 | Snapplify | Technology | Cape Town |
| cmp-0110 | South African Human Rights Commission (SAHRC) | Human rights | — |
| cmp-0099 | South African Qualifications Authority (SAQA) | Quality council / NQF custodianship | — |
| cmp-0015 | South African State Theatre | Other | — |
| cmp-0060 | Stellenbosch University | Education | Stellenbosch |
| cmp-0040 | Streets Chartered Accountants | Accounting / Audit | Cape Town (Kenilworth) |
| cmp-0042 | Superside | Technology | Cape Town (SA finance base) |
| cmp-0107 | Swift Holdings Group (Swift Staffing Services) | Outsourced temporary staffing, payroll and skills development | — |
| cmp-0016 | TCTA (Trans-Caledon Tunnel Authority) | Government | — |
| cmp-0061 | TFG Limited | Retail | Cape Town (Parow) |
| cmp-0102 | The Competition Tribunal | Competition-law adjudicative tribunal | — |
| cmp-0074 | The Fieldbar Co. | Manufacturing | Cape Town |
| cmp-0055 | The Modern CFO | Professional Services | Cape Town |
| cmp-0050 | TradeOn SA | Retail | Cape Town |
| cmp-0100 | Trans-Caledon Tunnel Authority (TCTA) | Bulk water transfer and storage infrastructure | — |
| cmp-0029 | Traxtion | Logistics | — |
| cmp-0111 | Tshikululu Social Investments (Pty) Ltd | Social investment fund management and advisory (non-profit intermediary) | — |
| cmp-0019 | Unilever | FMCG | — |
| cmp-0049 | University of Cape Town | Education | Cape Town (Rondebosch Area) |
| cmp-0101 | Water Research Commission (WRC) | Water research | — |
| cmp-0005 | Webber Wentzel | Professional Services | — |
| cmp-0026 | Wonga South Africa | Fintech | — |
| cmp-0062 | Woolworths Holdings Ltd | Retail | Cape Town |
| cmp-0097 | Workforce Holdings Ltd (subsequently People Power Solutions) | Human capital / staffing and HR outsourcing | — |

## 6. Sources (dedup by URL)

1024 unique source records in `sources.jsonl`. Before adding a source,
check the URL is absent from that file; reuse an existing `src-####` record instead of
duplicating the URL.
