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
| People (total records) | 363 |
| CONFIRMED qualified | 254 |
| HIGH_CONFIDENCE | 31 |
| ARTICLES_CONFIRMED_DESIGNATION_UNVERIFIED | 4 |
| CONFLICTING | 1 |
| RESEARCH_HOLD | 73 |
| Companies | 113 |
| Sources | 308 |

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
| 1 | **Natasha Abrahams** | Abrahams / Natasha | RESEARCH_HOLD | — | — | Cancercare SA | Western Cape | https://za.linkedin.com/in/natasha-abrahams-3146aa45 |
| 2 | **Prudence Adams** | Adams / Prudence | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/prudence-adams-6ba5b939 |
| 3 | **Rynauw Adriaan** | Adriaan / Rynauw | CONFIRMED | PA(SA) | SAIPA | DigiOutsource | Western Cape/Cape Town | https://za.linkedin.com/in/rynauw-adriaan-04607011a |
| 4 | **Byron Adriaanse** | Adriaanse / Byron | CONFIRMED | ACCA | ACCA | Red Badger | Western Cape/Cape Town | https://za.linkedin.com/in/byron-adriaanse-acca-842545155 |
| 5 | **Charl Andre Arndt** | Andre Arndt / Charl | CONFIRMED | AGA(SA) | SAICA | EMS Tax | Western Cape/Stellenbosch | https://za.linkedin.com/in/charl-andre-arndt |
| 6 | **Pieter Andre Schumyn** | Andre Schumyn / Pieter | RESEARCH_HOLD | — | — | — | Western Cape/Western Cape candidate pool | https://za.linkedin.com/in/pieter-andre-schumyn-5b8008126 |
| 7 | **Charneé Arendse** | Arendse / Charneé | HIGH_CONFIDENCE | AGA(SA) | SAICA | Capitec | Western Cape/Stellenbosch | — |
| 8 | **Jessica Arendse** | Arendse / Jessica | RESEARCH_HOLD | — | — | Food Lover's Market Holdings | Western Cape | — |
| 9 | **Naeem Asvat** | Asvat / Naeem | CONFIRMED | CA(SA) | SAICA | SAICA | KwaZulu-Natal/Durban | — |
| 10 | **Mark Augustine** | Augustine / Mark | HIGH_CONFIDENCE | PA(SA) | SAIPA | Pinnacle Accounting | Western Cape | — |
| 11 | **Lynette Badenhorst** | Badenhorst / Lynette | CONFIRMED | CA(SA) | SAICA | Probeta Training (Pty) Ltd | — | — |
| 12 | **Fatima Bapukee** | Bapukee / Fatima | CONFIRMED | CA(SA) | SAICA | Streets Chartered Accountants (Cape Town) | Western Cape/Cape Town | — |
| 13 | **Wico Basson** | Basson / Wico | CONFIRMED | AGA(SA), ACMA, CGMA | SAICA, CIMA | FUL Foods | Western Cape/Somerset West | https://za.linkedin.com/in/wicobasson |
| 14 | **Jody Baumgarten** | Baumgarten / Jody | HIGH_CONFIDENCE | CA(SA) | SAICA | Wonga (South Africa) | — | — |
| 15 | **Chulumanco Beja** | Beja / Chulumanco | CONFIRMED | PA(SA) | SAIPA | Galbraith Rushby | Western Cape | https://za.linkedin.com/in/chulumanco-beja-25bb421bb |
| 16 | **Anel Bekker** | Bekker / Anel | HIGH_CONFIDENCE | ACMA, CGMA | CIMA | Freshworld (Pty) Ltd | Western Cape/Stellenbosch | — |
| 17 | **Etienne Bekker** | Bekker / Etienne | CONFIRMED | AGA(SA) | SAICA | ACCIONA Energía | Western Cape/Cape Town | https://za.linkedin.com/in/etienne-bekker-aga-sa-92929013 |
| 18 | **Marco Bekker** | Bekker / Marco | CONFIRMED | AGA(SA) | SAICA | N1 Restaurant Suppliers | Western Cape/Cape Town | https://za.linkedin.com/in/marco-bekker-aga-sa-mba-sbs-3230a8b |
| 19 | **Vimbai Benza** | Benza / Vimbai | CONFIRMED | ACMA, CGMA | CIMA | Akacia Medical and Healthcare Group | Western Cape/Cape Town | https://za.linkedin.com/in/vimbai-benza-acma-cgma-880a8630 |
| 20 | **Rachelle Best** | Best / Rachelle | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 21 | **Frederick Bester** | Bester / Frederick | RESEARCH_HOLD | — | — | — | Western Cape/Western Cape candidate pool | https://za.linkedin.com/in/bester-chris-frederick |
| 22 | **Elana Beukes** | Beukes / Elana | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/elana-beukes-cima-adv-dip-ma-b7764461 |
| 23 | **J A 'Driaan' Beyers** | Beyers / Driaan | HIGH_CONFIDENCE | PA(SA) | SAIPA | Finkor Accounting | Gauteng/Rayton | — |
| 24 | **Wynand Bezuidenhout** | Bezuidenhout / Wynand | CONFIRMED | AGA(SA) | SAICA | SDK | CA Group | Western Cape/Durbanville | https://za.linkedin.com/in/wynandbez99 |
| 25 | **Uwe Birkenstock** | Birkenstock / Uwe | CONFIRMED | CA(SA) | SAICA | McA Durbanville Inc. | Western Cape/Durbanville | — |
| 26 | **Franciscus Blignault** | Blignault / Franciscus | CONFIRMED | AGA(SA) | SAICA | Cape Five Export SA | Western Cape/Stellenbosch | https://za.linkedin.com/in/franciscus-blignault |
| 27 | **CLAVER BONDA** | BONDA / CLAVER | RESEARCH_HOLD | — | — | — | Western Cape/Western Cape candidate pool | https://za.linkedin.com/in/claver-bonda-72421535 |
| 28 | **Pieter Booyens** | Booyens / Pieter | CONFIRMED | PA(SA) | SAIPA | Wilson Partners | Western Cape/Stellenbosch | https://za.linkedin.com/in/pabooyens |
| 29 | **Kobus Boshoff** | Boshoff / Kobus | CONFIRMED | CA(SA) | SAICA | Boshoff Knoetze Chartered Accountants | Western Cape/Somerset West | https://www.linkedin.com/in/kobus-boshoff-0a510888/ |
| 30 | **Christo Botha** | Botha / Christo | CONFIRMED | PA(SA) | SAIPA | — | Western Cape/Western Cape candidate pool | https://za.linkedin.com/in/christo-botha-5877666a |
| 31 | **Jaco Botha** | Botha / Jaco | CONFIRMED | ACMA, CGMA | CIMA | Ares Holdings | Western Cape/Cape Town | https://za.linkedin.com/in/jaco-botha-cgma |
| 32 | **Maricia Botha** | Botha / Maricia | CONFIRMED | AGA(SA) | SAICA | A van der Lingen Group | Western Cape/Cape Town | https://za.linkedin.com/in/maricia-botha-aga-sa-4209a415 |
| 33 | **Anje Bothma** | Bothma / Anje | CONFIRMED | PA(SA) | SAIPA | Eezibooks Consulting | Western Cape/Cape Town | https://za.linkedin.com/in/anje-bothma-professional-accountant-sa-53b693168 |
| 34 | **Catherine Brennan** | Brennan / Catherine | CONFIRMED | PA(SA) | SAIPA | G7 Renewable Energies | Western Cape/Cape Town | https://za.linkedin.com/in/catherine-brennan-b2b6156a |
| 35 | **Lesley Brown** | Brown / Lesley | CONFIRMED | AGA(SA) | SAICA | Pangolin Photo Safaris | Western Cape | https://za.linkedin.com/in/lesley-brown-1a93aa68 |
| 36 | **Ralph Buddle** | Buddle / Ralph | CONFIRMED | CA(SA) | SAICA | TFG Limited (The Foschini Group) | Western Cape/Cape Town | — |
| 37 | **Hein Burger** | Burger / Hein | CONFIRMED | AGA(SA) | SAICA | Public sector / Western Cape context | Western Cape/Cape Town | https://za.linkedin.com/in/hein-burger-aga-sa-b56163135 |
| 38 | **Khanya Butshingi** | Butshingi / Khanya | RESEARCH_HOLD | — | — | Collinson Group | Western Cape | https://za.linkedin.com/in/khanya-butshingi-2284b922a |
| 39 | **Bruce Canham ACMA, CGMA** | Canham ACMA, CGMA / Bruce | CONFIRMED | ACMA, CGMA | CIMA | — | Western Cape/Western Cape candidate pool | https://za.linkedin.com/in/bruce-canham-acma-cgma-0a218a220 |
| 40 | **Samantha Carr** | Carr / Samantha | RESEARCH_HOLD | — | — | University of the Western Cape | Western Cape | https://za.linkedin.com/in/samantha-carr-2644466a |
| 41 | **Kerry Cassel** | Cassel / Kerry | CONFIRMED | CA(SA) | SAICA | Motus Mobility Solutions | — | — |
| 42 | **Jason Cloete** | Cloete / Jason | RESEARCH_HOLD | PA(SA), CIA | SAIPA | Western Cape Government | Western Cape/Cape Town | — |
| 43 | **Malcolm Cecil Coates** | Coates / Malcolm | HIGH_CONFIDENCE | PA(SA) | SAIPA | Alma Casa | Western Cape/Muizenberg (Cape Town) | — |
| 44 | **Carlynn-Jade Coetzee** | Coetzee / Carlynn-Jade | CONFIRMED | PA(SA) | SAIPA | Ubuntu Quantum | Western Cape/Cape Town | https://za.linkedin.com/in/carlynn-jadecoetzee |
| 45 | **Denovan Coetzee** | Coetzee / Denovan | CONFIRMED | ACMA, CGMA | CIMA | Lactalis South Africa | Western Cape/Cape Town | https://za.linkedin.com/in/denovan-coetzee-acma-cgma-652581197 |
| 46 | **Johan Coetzee** | Coetzee / Johan | HIGH_CONFIDENCE | CA(SA) | SAICA | Callidus Accountants | Western Cape/Somerset West | — |
| 47 | **Tammy Coetzee** | Coetzee / Tammy | RESEARCH_HOLD | — | — | Aqunion | Western Cape | https://za.linkedin.com/in/tammy-coetzee-a992952b |
| 48 | **Alrich Coetzee ACMA, CGMA** | Coetzee ACMA, CGMA / Alrich | CONFIRMED | ACMA, CGMA | CIMA | — | Western Cape | https://za.linkedin.com/in/alrich-coetzee |
| 49 | **Grant Crighton** | Crighton / Grant | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/grant-crighton-60348598 |
| 50 | **Louwrens da Silva** | da Silva / Louwrens | HIGH_CONFIDENCE | PA(SA) | SAIPA | Petrichor Consulting | Western Cape/Somerset West | — |
| 51 | **Maritza Dalton** | Dalton / Maritza | CONFIRMED | PA(SA) | SAIPA | Cecil Kilpin & Co. | Western Cape | https://za.linkedin.com/in/maritza-dalton-professional-accountant-sa-91128611a |
| 52 | **Saadiqa Dangor** | Dangor / Saadiqa | RESEARCH_HOLD | — | — | Atlantis Special Economic Zone | Western Cape | https://www.linkedin.com/in/saadiqa-dangor/ |
| 53 | **Adre Daniel** | Daniel / Adre | HIGH_CONFIDENCE | PA(SA) | SAIPA | Accu-fin Accounting | Western Cape/Milnerton (Cape Town) | — |
| 54 | **Karen Dannhauser (Prinsloo)** | Dannhauser (Prinsloo) / Karen | RESEARCH_HOLD | — | — | — | Western Cape/Western Cape candidate pool | https://za.linkedin.com/in/karen-dannhauser-prinsloo-a96740aa |
| 55 | **Kyle Danster** | Danster / Kyle | CONFIRMED | ACMA, CGMA | CIMA | Curro Holdings Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/kyle-danster/ |
| 56 | **Ameena Davids** | Davids / Ameena | CONFIRMED | PA(SA) | SAIPA | The SOLA Group | Western Cape/Cape Town | https://za.linkedin.com/in/ameena-davids-professional-accountant-sa-78735763 |
| 57 | **Andre Davids** | Davids / Andre | RESEARCH_HOLD | AGA(SA) | SAICA | Exceed Group | Western Cape/Cape Town | — |
| 58 | **Jaques Davids** | Davids / Jaques | CONFIRMED | ACMA, CGMA | CIMA | Stellenbosch University | Western Cape/Stellenbosch | https://za.linkedin.com/in/jaques-davids-acma-cgma-a4179b129 |
| 59 | **Graham Davin** | Davin / Graham | CONFIRMED | CA(SA) | SAICA | TFG Limited (The Foschini Group) | — | — |
| 60 | **Cormé de Bruyn** | de Bruyn / Cormé | CONFIRMED | ACMA, CGMA | CIMA | Trueprop | Western Cape/Cape Town | https://za.linkedin.com/in/corm%C3%A9-de-bruyn-acma-cgma-6b98a015b |
| 61 | **Deon de Jongh** | de Jongh / Deon | CONFIRMED | AGA(SA) | SAICA | Luno | Western Cape/Cape Town | https://za.linkedin.com/in/deondejongh |
| 62 | **Adriaan de Lange** | de Lange / Adriaan | CONFIRMED | CA(SA) | SAICA | Adriaan de Lange Advisory (Private Capacity) | Western Cape/Cape Town | https://www.linkedin.com/in/a3aandl/ |
| 63 | **Sandi De Souza** | De Souza / Sandi | CONFIRMED | CA(SA) | SAICA | SAP Africa | — | — |
| 64 | **Emile de Villiers** | de Villiers / Emile | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 65 | **Louis de Wet** | de Wet / Louis | CONFIRMED | CA(SA) | SAICA | TradeOn SA | Western Cape/Stellenbosch | https://www.linkedin.com/in/louisdewetza/ |
| 66 | **Marzanne de Wet** | de Wet / Marzanne | CONFIRMED | ACMA, CGMA | CIMA | Rainmaker Media | Western Cape/Cape Town | https://za.linkedin.com/in/marzanne-de-wet-acma-cgma-50b83531 |
| 67 | **Christo de Witt** | de Witt / Christo | HIGH_CONFIDENCE | PA(SA) | SAIPA | Origin Financial Group of Companies | Western Cape/Cape Town | — |
| 68 | **Melanie Dennis-Jacobs** | Dennis-Jacobs / Melanie | CONFIRMED | AGA(SA) | SAICA | Red Carnation Hotel Collection | Western Cape/Cape Town | https://za.linkedin.com/in/melanie-dennis-jacobs-aga-sa-7034aa66 |
| 69 | **Peet Diedericks** | Diedericks / Peet | RESEARCH_HOLD | — | — | — | Western Cape | — |
| 70 | **Lézanne Dirkse van Schalkwyk** | Dirkse van Schalkwyk / Lézanne | CONFIRMED | AGA(SA) | SAICA | McA Inc. | Western Cape/Durbanville | — |
| 71 | **Wallace Disi** | Disi / Wallace | CONFIRMED | PA(SA) | SAIPA | — | Western Cape | https://za.linkedin.com/in/wallace-disi-74a3921a |
| 72 | **Nkosana Dlamini** | Dlamini / Nkosana | CONFIRMED | ACMA, CGMA | CIMA | Absa Group | Gauteng/Johannesburg | — |
| 73 | **Ettienne du Preez** | du Preez / Ettienne | CONFIRMED | PA(SA) | SAIPA | — | Western Cape | https://za.linkedin.com/in/ettiennedupreez |
| 74 | **Firdows Du Toit** | Du Toit / Firdows | CONFIRMED | PA(SA) | SAIPA | MRI Software (recent/current profile employer) | Western Cape/Cape Town | https://za.linkedin.com/in/firdows-du-toit-472882150 |
| 75 | **André Du Plessis** | Du Plessis / André | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 76 | **Ashley Du Plessis** | Du Plessis / Ashley | CONFIRMED | AGA(SA) | SAICA | — | Western Cape/Paarl | https://www.linkedin.com/in/ashley-du-plessis-ba99a716b/ |
| 77 | **Lian du Plessis** | du Plessis / Lian | CONFIRMED | AGA(SA) | SAICA | Cape Chamber of Commerce & Industry | Western Cape/Cape Town | https://www.linkedin.com/in/lian-du-plessis-aga-sa-177375149/ |
| 78 | **Harry Durrell** | Durrell / Harry | CONFIRMED | AGA(SA) | SAICA | Herold Gie Attorneys | Western Cape/Cape Town | https://za.linkedin.com/in/harrydurrell |
| 79 | **Valentine Dzvova** | Dzvova / Valentine | CONFIRMED | CA(SA), ACMA, CGMA | SAICA, CIMA | AYO Technology Solutions Limited | Western Cape/Cape Town | https://za.linkedin.com/in/valentine-dzvova |
| 80 | **Brent Edward Williams** | Edward Williams / Brent | RESEARCH_HOLD | PA(SA) | SAIPA | The Free Range Chicken Company | Western Cape/Cape Town | — |
| 81 | **Zahid Fakey** | Fakey / Zahid | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 82 | **Zahida Fakey** | Fakey / Zahida | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 83 | **Chantelle Fenwick** | Fenwick / Chantelle | CONFIRMED | AGA(SA) | SAICA | DigiOutsource | Western Cape/Cape Town | https://za.linkedin.com/in/chantelle-fenwick-bb789493 |
| 84 | **Ruan Ferreira** | Ferreira / Ruan | CONFIRMED | AGA(SA) | SAICA | LiebenGroup | Western Cape/Cape Town | https://za.linkedin.com/in/ruan-ferreira-aga-sa-37157a196 |
| 85 | **Byron Fortuin** | Fortuin / Byron | CONFIRMED | AGA(SA) | SAICA | Boschendal Farm | Western Cape/Pniel | https://za.linkedin.com/in/byron-fortuin-aga-sa-637905192 |
| 86 | **Neil Fourie** | Fourie / Neil | CONFIRMED | AGA(SA) | SAICA | Brenn-O-Kem | Western Cape/Stellenbosch | https://www.linkedin.com/in/neil-fourie-aga-sa-2a125b204/ |
| 87 | **Petrus Frick** | Frick / Petrus | CONFIRMED | AGA(SA), CFA | SAICA | Frick & Co Advisory | Western Cape/Cape Town | https://za.linkedin.com/in/petrus-frick-223543262 |
| 88 | **Vukosi Fungeni** | Fungeni / Vukosi | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 89 | **Zine Gengana** | Gengana / Zine | CONFIRMED | PA(SA) | SAIPA | HIGHVERN | Western Cape/Cape Town | https://za.linkedin.com/in/zine-gengana-professional-accountant-sa-319526a1 |
| 90 | **Marta Gerbach** | Gerbach / Marta | CONFIRMED | CA(SA) | SAICA | Fourways Airconditioning | — | — |
| 91 | **Zandrea Gerber** | Gerber / Zandrea | CONFIRMED | CA(SA) | SAICA | Pay@ | Western Cape/Paarl | https://www.linkedin.com/in/zandrea-gerber-ca-sa-99a5a475/ |
| 92 | **Nombulelo Geya** | Geya / Nombulelo | RESEARCH_HOLD | — | — | Simeka Consultants & Actuaries | Western Cape | https://za.linkedin.com/in/nombulelo-geya-36a2a12b |
| 93 | **Robert Gillman** | Gillman / Robert | RESEARCH_HOLD | — | — | — | Western Cape | https://uk.linkedin.com/in/robert-gillman-9281b59a |
| 94 | **Nonkululeko Gobodo** | Gobodo / Nonkululeko | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 95 | **Jana Goosen** | Goosen / Jana | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 96 | **Zhané Gorridon** | Gorridon / Zhané | HIGH_CONFIDENCE | AGA(SA) | SAICA | Fraxion | Western Cape | — |
| 97 | **Grant Greeff** | Greeff / Grant | CONFIRMED | CA(SA) | SAICA | Drone Ops Group | — | — |
| 98 | **Lerenzo Greeff** | Greeff / Lerenzo | CONFIRMED | PA(SA) | SAIPA | African Unity Life | Western Cape | https://za.linkedin.com/in/lerenzo-greeff-pa-sa-339064146 |
| 99 | **Morgan Gregory** | Gregory / Morgan | CONFIRMED | CA(SA) | SAICA | MK Aerospace SA | Western Cape/Cape Town | https://www.linkedin.com/in/morgan-gregory-ca-sa-64046117b/ |
| 100 | **Christanet Grewar** | Grewar / Christanet | CONFIRMED | ACCA | ACCA | PKF Cape Town | Western Cape/Cape Town | https://za.linkedin.com/in/christanet-grewar-acca-saipa-27a9195a |
| 101 | **Carmen Gribble** | Gribble / Carmen | RESEARCH_HOLD | ACMA, CGMA | CIMA | Super Group / SGHC | Western Cape/Cape Town | — |
| 102 | **Barry Griffin** | Griffin / Barry | RESEARCH_HOLD | — | — | — | Western Cape | https://uk.linkedin.com/in/barry-griffin-5b4b691ab |
| 103 | **Danie Grobbelaar** | Grobbelaar / Danie | RESEARCH_HOLD | — | — | 123CONSULTING | Western Cape | https://za.linkedin.com/in/danie-grobbelaar-a1318b118 |
| 104 | **Breyton Groenewald** | Groenewald / Breyton | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/breyton-groenewald-50803258 |
| 105 | **Lyle Haas** | Haas / Lyle | CONFIRMED | AGA(SA) | SAICA | — | Western Cape | https://za.linkedin.com/in/lyle-haas-439118136 |
| 106 | **Alicia Haasbroek** | Haasbroek / Alicia | CONFLICTING | — | — | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 107 | **Andrea Haasbroek** | Haasbroek / Andrea | CONFIRMED | PA(SA) | SAIPA | — | Western Cape | https://za.linkedin.com/in/andrea-haasbroek-83b44985 |
| 108 | **Christine Haasbroek** | Haasbroek / Christine | CONFIRMED | PA(SA) | SAIPA | Bryce Monitoring (Pty) Ltd | Western Cape/Paarl | https://za.linkedin.com/in/christine-haasbroek-professional-accountant-sa-911057b2 |
| 109 | **Taryn Hamid** | Hamid / Taryn | CONFIRMED | PA(SA) | SAIPA | Bateleur Capital | Western Cape | https://za.linkedin.com/in/taryn-hamid-professional-accountant-s-a-616a5751 |
| 110 | **Ashley Hanekom** | Hanekom / Ashley | CONFIRMED | CA(SA) | SAICA | Superside | Western Cape/Cape Town | https://www.linkedin.com/in/ashleyhanekom/ |
| 111 | **Cornelius Hanekom** | Hanekom / Cornelius | CONFIRMED | ACMA, CGMA | CIMA | amplify5 | Western Cape/Cape Town | https://za.linkedin.com/in/cornelius-hanekom |
| 112 | **Yvette Hanekom** | Hanekom / Yvette | RESEARCH_HOLD | — | — | Products, Supply Chain & Functional Finance, Ecowize | Western Cape | — |
| 113 | **Romona Harisunker** | Harisunker / Romona | CONFIRMED | AGA(SA) | SAICA | Turn Capital - Single Family Office | Western Cape/Cape Town | https://za.linkedin.com/in/romona-harisunker-aga-sa-7a495a108 |
| 114 | **Monique Harrison** | Harrison / Monique | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/monique-harrison-50409aa7 |
| 115 | **Imtiaaz Hashim** | Hashim / Imtiaaz | CONFIRMED | CA(SA) | SAICA | BDO South Africa | Western Cape/Cape Town | — |
| 116 | **Ashlin Healy** | Healy / Ashlin | CONFIRMED | CA(SA) | SAICA | Deloitte (South Africa) | Western Cape/Cape Town | https://www.linkedin.com/in/ashlin-healy-ca-sa-130238103/ |
| 117 | **Illana Helman** | Helman / Illana | CONFIRMED | CA(SA) | SAICA | Massmart | Gauteng/Johannesburg | https://www.linkedin.com/in/illana-helman-ca-sa-1279b117/ |
| 118 | **Fahdwa Hendricks** | Hendricks / Fahdwa | CONFIRMED | AGA(SA) | SAICA | Global Load Control | Western Cape/Cape Town | https://za.linkedin.com/in/fahdwa-hendricks-aga-sa-b0a37238 |
| 119 | **Joshua Hendricks** | Hendricks / Joshua | CONFIRMED | AGA(SA) | SAICA | Anthem | Western Cape/Cape Town | https://za.linkedin.com/in/joshua-hendricks-aga-sa-60790192 |
| 120 | **Kieran Herbert** | Herbert / Kieran | ARTICLES_CONFIRMED_DESIGNATION_UNVERIFIED | — | — | BGC | Western Cape | https://za.linkedin.com/in/kieran-herbert-671b64149 |
| 121 | **Jeroen Herweijer** | Herweijer / Jeroen | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/jeroen-herweijer-73b70316 |
| 122 | **Bronvin Heuvel** | Heuvel / Bronvin | CONFIRMED | CA(SA) | SAICA | KPMG (South Africa) | Western Cape/Cape Town | https://www.linkedin.com/in/bronvin-heuvel-ca-sa-ra-7b2475a9/ |
| 123 | **Lerato Hillman** | Hillman / Lerato | CONFIRMED | ACCA | ACCA | Not publicly confirmed | Western Cape/Cape Town | https://za.linkedin.com/in/lerato-hillman-acca-4b482663 |
| 124 | **Mieke Hoffman** | Hoffman / Mieke | CONFIRMED | ACMA, CGMA | CIMA | The Fieldbar Co. | Western Cape/Cape Town | https://za.linkedin.com/in/mieke-hoffman |
| 125 | **Servaas Hofmeyr ACMA, CGMA, MBA** | Hofmeyr ACMA, CGMA, MBA / Servaas | CONFIRMED | ACMA, CGMA | CIMA | Cape Mohair | Western Cape | https://za.linkedin.com/in/servaas-hofmeyr-021b071b |
| 126 | **Anntoinique Holtzhauzen** | Holtzhauzen / Anntoinique | CONFIRMED | PA(SA) | SAIPA | — | Western Cape | https://za.linkedin.com/in/anntoinique-holtzhauzen-b1830052 |
| 127 | **Tim Horak** | Horak / Tim | CONFIRMED | ACMA, CGMA | CIMA | Parmalat South Africa / Africa | Western Cape/Cape Town | https://za.linkedin.com/in/tim-horak-acma-cgma-54272ab0 |
| 128 | **Rensche-Mari Hurter (Jansen)** | Hurter (Jansen) / Rensche-Mari | CONFIRMED | CGMA | CIMA | Corpag | Western Cape/Cape Town | https://za.linkedin.com/in/rensche-mari-hurter-jansen-cgma%C2%AE-2aab466b |
| 129 | **André Huysamer** | Huysamer / André | HIGH_CONFIDENCE | AGA(SA) | SAICA | Kula | Western Cape/Worcester | — |
| 130 | **Darren Isaacs** | Isaacs / Darren | CONFIRMED | CA(SA) | SAICA | Makosi | — | — |
| 131 | **Kim Isaacs** | Isaacs / Kim | CONFIRMED | PA(SA) | SAIPA | Providence Hotels | Western Cape/South Africa | https://za.linkedin.com/in/kimnikitaisaacs |
| 132 | **Tony Isaacs** | Isaacs / Tony | RESEARCH_HOLD | — | — | Educor | Western Cape | https://za.linkedin.com/in/tony-isaacs-ab079a36 |
| 133 | **Stuart Izatt** | Izatt / Stuart | CONFIRMED | ACMA, CGMA | CIMA | Commercial Cold Holdings | Western Cape/Cape Town | https://za.linkedin.com/in/stuart-izatt-cgma-acma-47535815 |
| 134 | **Caryn Jacobs** | Jacobs / Caryn | CONFIRMED | AGA(SA) | SAICA | Betway SA20 | Western Cape/Cape Town | https://za.linkedin.com/in/caryn-jacobs-cfm-aga-sa-a9223383 |
| 135 | **Alicia Jamneck** | Jamneck / Alicia | CONFIRMED | AGA(SA) | SAICA | Hero Holdings | Western Cape/Paarl | https://za.linkedin.com/in/alicia-jamneck-aga-sa-73b03a128 |
| 136 | **Bea Jansen van Rensburg** | Jansen van Rensburg / Bea | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/bea-jansen-van-rensburg-a9697432 |
| 137 | **Roelof Jansen van Vuuren** | Jansen van Vuuren / Roelof | HIGH_CONFIDENCE | PA(SA) | SAIPA | The Tax Shop Pretoria North East | Gauteng/Pretoria | — |
| 138 | **Alana Johns** | Johns / Alana | HIGH_CONFIDENCE | PA(SA) | SAIPA | — | Western Cape | — |
| 139 | **Melanie Jordaan** | Jordaan / Melanie | CONFIRMED | PA(SA) | SAIPA | Macrel Petroleum / Cale group | Western Cape/Kuils River | https://za.linkedin.com/in/melanie-jordaan-11b2a21a0 |
| 140 | **Francois Joubert** | Joubert / Francois | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 141 | **Anathi Kamkam** | Kamkam / Anathi | HIGH_CONFIDENCE | AGA(SA) | SAICA | Old Mutual Investment Group | Western Cape/Cape Town | — |
| 142 | **Adrian Kandan** | Kandan / Adrian | CONFIRMED | AGA(SA), ACMA, CGMA | SAICA, CIMA | ooba Home Loans | Western Cape/Cape Town | https://za.linkedin.com/in/adrian-kandan-aga-sa-acma-cgma-92749591 |
| 143 | **Nethin Karamchand** | Karamchand / Nethin | CONFIRMED | CA(SA) | SAICA | Deloitte (South Africa) | Western Cape/Cape Town | https://www.linkedin.com/in/nethin/ |
| 144 | **Lindsay Karools** | Karools / Lindsay | CONFIRMED | PA(SA) | SAIPA | The Building Company | Western Cape | https://za.linkedin.com/in/lindsay-karools-48581816b |
| 145 | **Willem Kasselman** | Kasselman / Willem | CONFIRMED | ACMA, CGMA | CIMA | Biosylx | Western Cape/Paarl | https://za.linkedin.com/in/willem-kasselman |
| 146 | **Zaiba Khan** | Khan / Zaiba | CONFIRMED | PA(SA) | SAIPA | PSG Konsult | Western Cape | https://za.linkedin.com/in/zaiba-khan-2396a865 |
| 147 | **Koko Khumalo** | Khumalo / Koko | CONFIRMED | CA(SA) | SAICA | Motlanalo Chartered Accountants and Auditors Inc | — | — |
| 148 | **Carla Kilian** | Kilian / Carla | HIGH_CONFIDENCE | PA(SA) | SAIPA | AETOS Financial Services | Gauteng/Roodepoort | — |
| 149 | **Matthew Kiln** | Kiln / Matthew | CONFIRMED | ACMA, CGMA | CIMA | Tripco | Western Cape/Stellenbosch | https://za.linkedin.com/in/matthew-kiln-a19746253 |
| 150 | **Jason King** | King / Jason | CONFIRMED | PA(SA) | SAIPA | Tintswalo Collection | Western Cape/Cape Town | https://za.linkedin.com/in/jason-king-48871b12 |
| 151 | **Cheslin Klaasen** | Klaasen / Cheslin | CONFIRMED | PA(SA) | SAIPA | Advania UK | Western Cape/Cape Town | https://za.linkedin.com/in/cheslin-klaasen-professional-accountant-sa-45840451 |
| 152 | **Cheslin Klaasen** | Klaasen / Cheslin | HIGH_CONFIDENCE | PA(SA) | SAIPA | Advania UK | Western Cape | — |
| 153 | **Enrico Kleinbooi** | Kleinbooi / Enrico | CONFIRMED | CA(SA) | SAICA | Kannaland Municipality | Western Cape/Ladismith | — |
| 154 | **Michelle Kleynhans** | Kleynhans / Michelle | RESEARCH_HOLD | — | — | — | Western Cape/Western Cape candidate pool | https://za.linkedin.com/in/michelle-kleynhans-9ab9a12aa |
| 155 | **Tracey Klopper** | Klopper / Tracey | CONFIRMED | AGA(SA) | SAICA | JTC Group | Western Cape/Cape Town | https://za.linkedin.com/in/tracey-klopper-aga-sa-663471144 |
| 156 | **Francois Knoetze** | Knoetze / Francois | CONFIRMED | ACMA, CGMA | CIMA | iBanqSA | Western Cape/Stellenbosch | https://za.linkedin.com/in/francois-knoetze |
| 157 | **Anela Kumnandi Dumalisile** | Kumnandi Dumalisile / Anela | CONFIRMED | ACMA, CGMA | CIMA | Blue Seas Products (Pty) Ltd | Western Cape/Cape Town | https://za.linkedin.com/in/anela-kumnandi-dumalisile-acma-cgma-1a483910b |
| 158 | **Dylin Kuni** | Kuni / Dylin | CONFIRMED | ACMA, CGMA | CIMA | M+C Saatchi Group | Western Cape/Cape Town | https://www.linkedin.com/in/dylinkuni/ |
| 159 | **Lesetja Kwetepane** | Kwetepane / Lesetja | HIGH_CONFIDENCE | PA(SA) | SAIPA | LA Financial Services (Pty) Ltd | Limpopo/Polokwane | — |
| 160 | **Div Lamprecht** | Lamprecht / Div | CONFIRMED | CA(SA) | SAICA | SAICA | Free State/Bloemfontein | — |
| 161 | **Malvin Lancelot Makanda** | Lancelot Makanda / Malvin | CONFIRMED | AGA(SA) | SAICA | Cecil Kilpin & Co | Western Cape/Cape Town | https://za.linkedin.com/in/malvin-lancelot-makanda-aga-sa-69517716a |
| 162 | **Magdel Le Grange** | Le Grange / Magdel | RESEARCH_HOLD | CGMA | CIMA | Rolls-Royce Power Systems AG | Western Cape/Cape Town | — |
| 163 | **Ina Leroux** | Leroux / Ina | RESEARCH_HOLD | — | — | ABS Genetics South Africa | Western Cape | https://za.linkedin.com/in/ina-leroux-31864170 |
| 164 | **Johan le Roux** | le Roux / Johan | CONFIRMED | CA(SA) | SAICA | Johan le Roux CA(SA) | Western Cape/Milnerton (Cape Town) | — |
| 165 | **Thinus Le Roux** | Le Roux / Thinus | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 166 | **Elizabeth Lindeque** | Lindeque / Elizabeth | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/elizabeth-lindeque-bb1ba11b |
| 167 | **Naledi Liphapang** | Liphapang / Naledi | HIGH_CONFIDENCE | CA(SA) | SAICA | — | — | — |
| 168 | **Stephanus Lombard** | Lombard / Stephanus | CONFIRMED | ACMA, CGMA | CIMA | George Whitefield College | Western Cape/Cape Town | https://za.linkedin.com/in/stephanus-lombard-acma-cgma-b74b4096 |
| 169 | **Constant Loubser** | Loubser / Constant | CONFIRMED | ACMA, CGMA | CIMA | Freshworld (Pty) Ltd | Western Cape/Stellenbosch | https://za.linkedin.com/in/constant-loubser-acma-cgma-39960176 |
| 170 | **Lavinia Louw** | Louw / Lavinia | CONFIRMED | AGA(SA) | SAICA | Standish Management | Western Cape/Cape Town | https://za.linkedin.com/in/lavinia-louw-aga-sa-9a2a2915b |
| 171 | **Bulelani M.** | M. / Bulelani | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/bulelani-m-94b4513a |
| 172 | **Cornel Maartens** | Maartens / Cornel | RESEARCH_HOLD | — | — | — | Western Cape/Western Cape candidate pool | https://za.linkedin.com/in/cornel-maartens-a7a83655 |
| 173 | **Mbali Precious Mabaso** | Mabaso / Mbali | CONFIRMED | CA(SA) | SAICA | Nedbank Group Limited | — | — |
| 174 | **Zanele Maduna** | Maduna / Zanele | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 175 | **Ntsikelelo Maduneni** | Maduneni / Ntsikelelo | CONFIRMED | ACMA, CGMA | CIMA | takealot.com | Western Cape/Cape Town | https://za.linkedin.com/in/ntsikelelo |
| 176 | **Sintu Maguga** | Maguga / Sintu | RESEARCH_HOLD | — | — | — | Western Cape/Western Cape candidate pool | https://za.linkedin.com/in/sintu-maguga-3392b53a |
| 177 | **Kgabiso Mahlangu** | Mahlangu / Kgabiso | CONFIRMED | AGA(SA) | SAICA | South African State Theatre | Gauteng/Pretoria | https://www.linkedin.com/in/kgabiso-mahlangu-aga-sa-b53a951a |
| 178 | **Nkhensani Mahlangu** | Mahlangu / Nkhensani | RESEARCH_HOLD | — | — | — | Western Cape/Western Cape candidate pool | https://za.linkedin.com/in/nkhensani-mahlangu-716576119 |
| 179 | **Mathabo Makhaya** | Makhaya / Mathabo | CONFIRMED | CA(SA) | SAICA | Harmony Gold Mining | — | — |
| 180 | **Mpho Makoko-Hottie** | Makoko-Hottie / Mpho | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 181 | **Patricia Malahlela** | Malahlela / Patricia | CONFIRMED | CA(SA) | SAICA | Mckenzie & Associates | — | — |
| 182 | **David Malan** | Malan / David | RESEARCH_HOLD | — | — | Watcher Surveillance Solutions | Western Cape/Western Cape candidate pool | https://za.linkedin.com/in/david-malan-32aa861b |
| 183 | **Manenzhe Manenzhe** | Manenzhe / Manenzhe | CONFIRMED | FCCA | ACCA | ACCA (South Africa) | Gauteng | https://www.linkedin.com/in/manenzhe-manenzhe-fcca-a80079150/ |
| 184 | **Zaid Manjra** | Manjra / Zaid | CONFIRMED | CA(SA) | SAICA | Woolworths Holdings Ltd | Western Cape/Cape Town | — |
| 185 | **Brandon Manuel** | Manuel / Brandon | CONFIRMED | PA(SA) | SAIPA | MUA Insurance | Western Cape | https://za.linkedin.com/in/brandon-manuel-a7261919 |
| 186 | **Moses Manyeruke** | Manyeruke / Moses | CONFIRMED | ACMA, CGMA | CIMA | Enernet Global | Western Cape/Cape Town | https://za.linkedin.com/in/moses-manyeruke-acma-cgma-ab216521 |
| 187 | **Siseko Mapongwana** | Mapongwana / Siseko | CONFIRMED | PA(SA) | SAIPA | G4S | Western Cape | https://za.linkedin.com/in/siseko-mapongwana-192818145 |
| 188 | **Romy Maree** | Maree / Romy | CONFIRMED | CA(SA) | SAICA | Burstone (Real Estate partners) | — | — |
| 189 | **Magda Marin Jonck** | Marin Jonck / Magda | RESEARCH_HOLD | — | — | — | Western Cape | — |
| 190 | **Iaan Marx** | Marx / Iaan | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 191 | **Katlego Matshego** | Matshego / Katlego | HIGH_CONFIDENCE | CA(SA) | SAICA | Independent Institute of Education (IIE) Varsity College / MSA | — | — |
| 192 | **Tiisetso Matsobane** | Matsobane / Tiisetso | CONFIRMED | ACMA, CGMA | CIMA | Libstar | Western Cape/Cape Town | https://za.linkedin.com/in/tiisetso-matsobane-acma-cgma-54b16890 |
| 193 | **Abigail Matuku** | Matuku / Abigail | RESEARCH_HOLD | ACMA, CGMA | CIMA | Pegasys Consulting | Western Cape/Cape Town | — |
| 194 | **Linda Mazibuko** | Mazibuko / Linda | RESEARCH_HOLD | — | — | — | Western Cape/Western Cape candidate pool | https://za.linkedin.com/in/linda-mazibuko-44346227 |
| 195 | **Phumelela Mbande** | Mbande / Phumelela | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 196 | **Hlayisani Terrent Mboweni** | Mboweni / Hlayisani | HIGH_CONFIDENCE | PA(SA) | SAIPA | Mboweni Accountants | — | — |
| 197 | **Trevor McLachlan** | McLachlan / Trevor | HIGH_CONFIDENCE | PA(SA) | SAIPA | McA Inc. | Western Cape/Cape Town | — |
| 198 | **Sean Meredith** | Meredith / Sean | CONFIRMED | ACMA, CGMA | CIMA | City of Cape Town | Western Cape/Cape Town | https://za.linkedin.com/in/sean-meredith-acma-cgma-029ab46 |
| 199 | **Francois Meyer** | Meyer / Francois | CONFIRMED | PA(SA) | SAIPA | The Tax Shop Stellenbosch | Western Cape/Stellenbosch | https://za.linkedin.com/in/francois-meyer-75919a261 |
| 200 | **Mangaliso Mithi** | Mithi / Mangaliso | CONFIRMED | FCMA, CGMA | CIMA | — | Gauteng/Johannesburg | https://www.linkedin.com/in/mangalisomithi/ |
| 201 | **Xolile Mkuhlana** | Mkuhlana / Xolile | CONFIRMED | ACMA, CGMA | CIMA | SASSA | Western Cape/Cape Town | https://za.linkedin.com/in/xolile-mkuhlana-acma-cgma-9306a334 |
| 202 | **Siphesihle Mlangeni** | Mlangeni / Siphesihle | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 203 | **Mpolaheng Mohlopi** | Mohlopi / Mpolaheng | CONFIRMED | CA(SA) | SAICA | Lanseria International Airport | Gauteng/Lanseria | — |
| 204 | **Kgomotso Moipolai** | Moipolai / Kgomotso | CONFIRMED | PA(SA) | SAIPA | — | Western Cape | https://za.linkedin.com/in/kgomotso-moipolai-014726207 |
| 205 | **Tumi Mokgoko** | Mokgoko / Tumi | CONFIRMED | CA(SA) | SAICA | KPMG | — | — |
| 206 | **Bonga Mokoena** | Mokoena / Bonga | CONFIRMED | CA(SA) | SAICA | BDO South Africa | Gauteng/Johannesburg | — |
| 207 | **Pumla Molope** | Molope / Pumla | CONFIRMED | CA(SA) | SAICA | African Women Chartered Accountants (AWCA) | — | — |
| 208 | **Kgaogelo Montjane** | Montjane / Kgaogelo | RESEARCH_HOLD | — | — | — | Western Cape/Western Cape candidate pool | https://za.linkedin.com/in/kgaogelo-montjane-373050186 |
| 209 | **Mpho Mookapele** | Mookapele / Mpho | CONFIRMED | CA(SA) | SAICA | Energy and Water Sector Education and Training Authority (EWSETA) | — | — |
| 210 | **Vernon Morgan** | Morgan / Vernon | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/vernon-morgan-financial-coach |
| 211 | **Mieshka Morris** | Morris / Mieshka | RESEARCH_HOLD | — | — | Momentum Corporate | Western Cape | https://za.linkedin.com/in/mieshka-morris-55527055 |
| 212 | **Carla Mostert** | Mostert / Carla | CONFIRMED | ACMA, CGMA | CIMA | Atlantis Foods Group | Western Cape/Cape Town | https://za.linkedin.com/in/carla-mostert-acma-cgma-8695a9156 |
| 213 | **Vincent Motholo** | Motholo / Vincent | CONFIRMED | CA(SA) | SAICA | University of Cape Town | Western Cape/Cape Town | https://www.linkedin.com/in/vincent-motholo-ca-sa-842b7613/ |
| 214 | **Thokozani Motloung** | Motloung / Thokozani | CONFIRMED | PA(SA) | SAIPA | Unitrans | Western Cape/Cape Town | https://za.linkedin.com/in/thokozani-motloung-64147923 |
| 215 | **Vusi Mpofu** | Mpofu / Vusi | CONFIRMED | AGA(SA) | SAICA | Nedbank | — | — |
| 216 | **Mimosa Mputa** | Mputa / Mimosa | CONFIRMED | AGA(SA) | SAICA | Mukuru | Western Cape/Cape Town | https://za.linkedin.com/in/mimosa-mputa-aga-sa-50489a211 |
| 217 | **Zine Mshengu** | Mshengu / Zine | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 218 | **Zandile Mtandeki** | Mtandeki / Zandile | CONFIRMED | PA(SA), CAIA | SAIPA | RealFin Fund Services | Western Cape/Cape Town | https://za.linkedin.com/in/zandilemtandeki |
| 219 | **Chwayita Mtebele** | Mtebele / Chwayita | CONFIRMED | CA(SA) | SAICA | Financial Sector Conduct Authority (FSCA) | — | — |
| 220 | **Liso Mtshambela** | Mtshambela / Liso | RESEARCH_HOLD | — | — | Novus Holdings | Western Cape | https://za.linkedin.com/in/liso-mtshambela-80446b121 |
| 221 | **Marilize Muller** | Muller / Marilize | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/marilize-muller-59b0a66a |
| 222 | **Tariro Mutizwa** | Mutizwa / Tariro | CONFIRMED | ACMA, CGMA | CIMA | AICPA & CIMA (CIMA Africa) | — | — |
| 223 | **Nothando Muziki** | Muziki / Nothando | CONFIRMED | AGA(SA) | SAICA | Integral Accountants | Western Cape/Cape Town | https://za.linkedin.com/in/nothando-muziki-aga-sa-b85538153 |
| 224 | **Lubabalo Mxhasa** | Mxhasa / Lubabalo | CONFIRMED | PA(SA) | SAIPA | Apex/Maitland background | Western Cape | https://za.linkedin.com/in/lubabalo-mxhasa-39694163 |
| 225 | **Shaun Mzuvukile Gxekwa** | Mzuvukile Gxekwa / Shaun | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/shaun-mzuvukile-gxekwa-538bb213a |
| 226 | **Charmaine Nago** | Nago / Charmaine | RESEARCH_HOLD | — | — | — | Western Cape/Cape Town candidate pool | https://za.linkedin.com/in/charmaine-nago-b077113b |
| 227 | **Aneshree Naidoo** | Naidoo / Aneshree | CONFIRMED | CA(SA) | SAICA | Webber Wentzel | — | — |
| 228 | **Thenashree Naidoo** | Naidoo / Thenashree | HIGH_CONFIDENCE | CA(SA) | SAICA | Durban ICC | KwaZulu-Natal/Durban | — |
| 229 | **Jabavu Nare** | Nare / Jabavu | CONFIRMED | ACMA, CGMA | CIMA | Pie in the Sky / Coimbra Bakery | Western Cape/Cape Town | https://za.linkedin.com/in/jabavu-nare-acma-cgma-52544850 |
| 230 | **Theo Naude** | Naude / Theo | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/theo-naude-b36b847a |
| 231 | **Anika Nel** | Nel / Anika | CONFIRMED | PA(SA) | SAIPA | Kallos Global | Western Cape | https://za.linkedin.com/in/anika-nel-20b364134 |
| 232 | **Kristen Nel** | Nel / Kristen | CONFIRMED | PA(SA) | SAIPA | Fynbos Accounting | Western Cape/Cape Town | https://za.linkedin.com/in/kristen-nel-professional-accountant-saipa-407058118 |
| 233 | **Nastassja Nel** | Nel / Nastassja | CONFIRMED | AGA(SA) | SAICA | Schoemans Registered Auditors and Chartered Accountants | Western Cape/Cape Town | https://www.linkedin.com/in/nastassja-nel-71a15364/ |
| 234 | **Wynand Nel** | Nel / Wynand | HIGH_CONFIDENCE | PA(SA) | SAIPA | JTC Group | Western Cape | — |
| 235 | **Vhugala Nelwamondo** | Nelwamondo / Vhugala | CONFIRMED | ACMA, CGMA | CIMA | Auditor-General of South Africa | Western Cape/Cape Town | https://za.linkedin.com/in/vhugala-nelwamondo-acma-cgma-2b2bb7ba |
| 236 | **Michele Nieuwoudt** | Nieuwoudt / Michele | RESEARCH_HOLD | — | — | PNA / former Management Accountant | Western Cape | https://za.linkedin.com/in/michele-nieuwoudt-96074259 |
| 237 | **Sampras Noel Kaweesi** | Noel Kaweesi / Sampras | CONFIRMED | FCCA | ACCA | Sexual & Reproductive Justice Coalition | Western Cape/Cape Town | https://za.linkedin.com/in/sampras-noel-kaweesi-msci-fcca-a13a6b35 |
| 238 | **Bukeka Nohashe** | Nohashe / Bukeka | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/bukeka-nohashe-5950866b |
| 239 | **Buhle Hanise Nomabunga** | Nomabunga / Buhle | CONFIRMED | CA(SA) | SAICA | BAIC (South Africa) | — | — |
| 240 | **Hannes Nortman** | Nortman / Hannes | CONFIRMED | AGA(SA) | SAICA | Golden Hour Experiences | Western Cape/Cape Town | https://za.linkedin.com/in/hannes-nortman-aga-sa-683b202b |
| 241 | **Nontsingiselo Notununu** | Notununu / Nontsingiselo | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/nontsingiselo-notununu-cima-dip-ma-b74528b9 |
| 242 | **Zizipho Nyanga** | Nyanga / Zizipho | CONFIRMED | CA(SA) | SAICA | Masisizane Fund (Old Mutual) | — | — |
| 243 | **Jabulile Nyathi** | Nyathi / Jabulile | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 244 | **Danielle O'Brien** | O'Brien / Danielle | CONFIRMED | PA(SA) | SAIPA | SS&C Technologies | Western Cape/Cape Town | https://za.linkedin.com/in/danielle-o-brien-pa-sa-897227123 |
| 245 | **Lara Odendaal** | Odendaal / Lara | CONFIRMED | PA(SA) | SAIPA | Creatori Health | Western Cape/Stellenbosch | https://za.linkedin.com/in/lara-odendaal-4053b21a4 |
| 246 | **André Olivier** | Olivier / André | CONFIRMED | AGA(SA) | SAICA | Lekkewaan | Western Cape/Wellington | https://za.linkedin.com/in/andr%C3%A9-olivier-aga-sa-b5a573131 |
| 247 | **Eugene Olivier** | Olivier / Eugene | CONFIRMED | AGA(SA) | SAICA | Icon Oncology | Western Cape/Durbanville | https://za.linkedin.com/in/eugene-olivier-21a42b276 |
| 248 | **Jochelle Oosthuizen** | Oosthuizen / Jochelle | CONFIRMED | PA(SA), TP(SA) | SAIPA | LPH Chartered Accountants | Western Cape/Stellenbosch | https://za.linkedin.com/in/jochelle-oosthuizen-a408a59a |
| 249 | **Rayhaan Osman** | Osman / Rayhaan | CONFIRMED | FCCA | ACCA | Old Mutual Wealth | Western Cape/Cape Town | https://za.linkedin.com/in/rayhaan-osman-172a07101 |
| 250 | **Misheck P Jena** | P Jena / Misheck | CONFIRMED | PA(SA) | SAIPA | Not publicly confirmed | Western Cape/Cape Town | https://za.linkedin.com/in/misheck-p-jena-pa-sa-47278a150 |
| 251 | **Emma Pardoe** | Pardoe / Emma | CONFIRMED | CA(SA) | SAICA | Emma Pardoe Chartered Accountants (SA) | Western Cape/Somerset West | https://www.linkedin.com/in/emmapardoe/ |
| 252 | **Ridwana Parker** | Parker / Ridwana | CONFIRMED | AGA(SA) | SAICA | Raft Consulting | Western Cape/Cape Town | https://za.linkedin.com/in/ridwana-parker-aga-sa |
| 253 | **Anisah Patel** | Patel / Anisah | CONFIRMED | CA(SA) | SAICA | Own practice (Vereeniging) | Gauteng/Vereeniging | — |
| 254 | **Mulalo Peaceman Mashamba** | Peaceman Mashamba / Mulalo | CONFIRMED | ACCA | ACCA | Infra Impact Investment Managers | Western Cape/Cape Town | https://za.linkedin.com/in/mulalo-peaceman-mashamba-acca-17015142 |
| 255 | **Crystelle Peense** | Peense / Crystelle | RESEARCH_HOLD | — | — | Commissions | Western Cape | https://za.linkedin.com/in/crystelle-peense |
| 256 | **Ross Pennell** | Pennell / Ross | CONFIRMED | FCCA | ACCA | Advent Wealth | Western Cape/Cape Town | https://za.linkedin.com/in/rosspennell |
| 257 | **Bulali Pepeteka** | Pepeteka / Bulali | CONFIRMED | PA(SA) | SAIPA | Klearium | Western Cape/Cape Town | https://za.linkedin.com/in/bulalipepeteka |
| 258 | **Jaco Pieters** | Pieters / Jaco | ARTICLES_CONFIRMED_DESIGNATION_UNVERIFIED | — | — | Footgear | Western Cape | — |
| 259 | **Esther Pieterse** | Pieterse / Esther | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 260 | **Miguel Pieterse** | Pieterse / Miguel | CONFIRMED | PA(SA) | SAIPA | Infinity Power | Western Cape/Cape Town | https://za.linkedin.com/in/miguelpieterse |
| 261 | **Ashton Pillay** | Pillay / Ashton | CONFIRMED | AGA(SA) | SAICA | Integrity360 South Africa | Western Cape/Cape Town | https://za.linkedin.com/in/ashton-pillay-aga-sa-aa777332 |
| 262 | **Jan Potgieter** | Potgieter / Jan | HIGH_CONFIDENCE | CA(SA) | SAICA | TFG Limited (The Foschini Group) | — | — |
| 263 | **Maresa Pretorius** | Pretorius / Maresa | RESEARCH_HOLD | — | — | Hotel Verde Cape Town | Western Cape | https://za.linkedin.com/in/maresa-pretorius-0a139918 |
| 264 | **Taryn Raju** | Raju / Taryn | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 265 | **Tharien Rambalie** | Rambalie / Tharien | CONFIRMED | PA(SA) | SAIPA | Xcede Group | Western Cape/Cape Town | https://za.linkedin.com/in/tharien-rambalie-a46a7666 |
| 266 | **Sandhya Ramjee (Chavda)** | Ramjee (Chavda) / Sandhya | RESEARCH_HOLD | — | — | Nimble Group (public directory); LinkedIn also shows Payment24 | Western Cape | — |
| 267 | **Ciara Reintjes** | Reintjes / Ciara | CONFIRMED | CA(SA) | SAICA | SAICA | — | — |
| 268 | **Anthony Renda** | Renda / Anthony | CONFIRMED | AGA(SA) | SAICA | North Star Guidance (Pty) Ltd | Western Cape/Durbanville | https://za.linkedin.com/in/anthony-renda-030ab9151 |
| 269 | **Vanessa Rheeder** | Rheeder / Vanessa | CONFIRMED | CA(SA) | SAICA | The Modern CFO | Western Cape/Cape Town | https://www.linkedin.com/in/vanessa-rheeder-ca-sa/ |
| 270 | **Dave Rich** | Rich / Dave | CONFIRMED | CA(SA) | SAICA | Streets Chartered Accountants (Cape Town) | Western Cape/Cape Town | — |
| 271 | **Alan Robbins** | Robbins / Alan | ARTICLES_CONFIRMED_DESIGNATION_UNVERIFIED | — | — | Sable International | Western Cape/Cape Town | — |
| 272 | **Antonio Roberts** | Roberts / Antonio | RESEARCH_HOLD | — | — | KWV | Western Cape | https://za.linkedin.com/in/antonio-roberts |
| 273 | **Lynette Roeloffze** | Roeloffze / Lynette | CONFIRMED | CA(SA) | SAICA | Forvis Mazars Group | Gauteng/Johannesburg | https://www.linkedin.com/in/lynette-roeloffze-ca-sa-ra-0637aa13/ |
| 274 | **Lizel Roelofse** | Roelofse / Lizel | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/lizel-roelofse-29ab3553 |
| 275 | **Bianca Roos** | Roos / Bianca | CONFIRMED | CA(SA) | SAICA | PKF Octagon | — | — |
| 276 | **Jay Rosser** | Rosser / Jay | RESEARCH_HOLD | ACMA, CGMA | CIMA | Empire Finance Partners | Western Cape/Cape Town | — |
| 277 | **Robert Rossouw** | Rossouw / Robert | RESEARCH_HOLD | AGA(SA) | SAICA | AMC Cookware South Africa | Western Cape/Cape Town | — |
| 278 | **Alexis Sacks** | Sacks / Alexis | CONFIRMED | CA(SA) | SAICA | Streets Chartered Accountants (Cape Town) | Western Cape/Cape Town | — |
| 279 | **Craig Samuel** | Samuel / Craig | CONFIRMED | PA(SA) | SAIPA | — | Western Cape | https://za.linkedin.com/in/craig-samuel-070500a3 |
| 280 | **Beverley Samuels** | Samuels / Beverley | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/beverley-samuels-19041230 |
| 281 | **Rabia Samuels** | Samuels / Rabia | CONFIRMED | PA(SA) | SAIPA | CADO Chartered Accountants Inc. | Western Cape | https://za.linkedin.com/in/rabia-samuels-3527a823b |
| 282 | **Giancarlo Sassoli** | Sassoli / Giancarlo | CONFIRMED | AGA(SA) | SAICA | 3C Metal | Western Cape/Cape Town | https://za.linkedin.com/in/giancarlo-sassoli-aga-sa-a051b9254 |
| 283 | **Fanie Schoeman** | Schoeman / Fanie | CONFIRMED | AGA(SA) | SAICA | Houst | Western Cape/Stellenbosch | https://za.linkedin.com/in/fanie-schoeman-aga-sa-758938a2 |
| 284 | **Leandre Schoeman** | Schoeman / Leandre | CONFIRMED | ACMA, CGMA | CIMA | IBCO | Western Cape/Cape Town | https://za.linkedin.com/in/leandre-schoeman-acma-cgma-bb451b23 |
| 285 | **Mabatho Sedikela** | Sedikela / Mabatho | HIGH_CONFIDENCE | CA(SA) | SAICA | Auditor-General of South Africa (AGSA) | — | — |
| 286 | **Ethan September** | September / Ethan | CONFIRMED | ACMA, CGMA | CIMA | RFG Foods | Western Cape/Cape Town | https://za.linkedin.com/in/ethan-september-acma-cgma-2363a0143 |
| 287 | **Masechaba Sesing** | Sesing / Masechaba | CONFIRMED | CA(SA) | SAICA | Free State Provincial Treasury | Free State/Bloemfontein | — |
| 288 | **Tawanda Sigauke** | Sigauke / Tawanda | CONFIRMED | ACCA | ACCA | Red Rocket South Africa (Pty) Ltd | Western Cape/Cape Town | https://za.linkedin.com/in/tawanda-sigauke-acca-369a7060 |
| 289 | **Zinhle Simamane** | Simamane / Zinhle | CONFIRMED | CA(SA) | SAICA | Traxtion | — | — |
| 290 | **Charl Smit** | Smit / Charl | CONFIRMED | AGA(SA) | SAICA | Thornlands Group | Western Cape/Cape Town | https://za.linkedin.com/in/charl-smit-aga-sa |
| 291 | **Adrian Smith** | Smith / Adrian | CONFIRMED | ACMA, CGMA | CIMA | Bounty Apparel | Western Cape/Cape Town | https://www.linkedin.com/in/adrian-smith-acma-cgma-30942b59/ |
| 292 | **Lizelle Smith** | Smith / Lizelle | RESEARCH_HOLD | — | — | Inventory, Insurance & Fixed Assets | Western Cape | https://za.linkedin.com/in/lizelle-smith-6b3a7a65 |
| 293 | **Polani Sokombela** | Sokombela / Polani | CONFIRMED | CA(SA) | SAICA | Auditor-General of South Africa (AGSA) | — | — |
| 294 | **Juan Spies** | Spies / Juan | CONFIRMED | CA(SA) | SAICA | McA Durbanville Inc. | Western Cape/Durbanville | — |
| 295 | **Christopher Stanley** | Stanley / Christopher | CONFIRMED | FCCA | ACCA | AIML Score | Western Cape/Cape Town | https://za.linkedin.com/in/christopher-stanley-fcca |
| 296 | **Elizabeth Steyn** | Steyn / Elizabeth | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/elizabeth-steyn-54b3911ba |
| 297 | **Patricia Stock** | Stock / Patricia | CONFIRMED | CA(SA) | SAICA | SAICA | — | — |
| 298 | **Justin Stohr** | Stohr / Justin | HIGH_CONFIDENCE | PA(SA) | SAIPA | McA Accounting & Tax Services Inc. | Western Cape/Cape Town | — |
| 299 | **Edburg Strauss** | Strauss / Edburg | CONFIRMED | CA(SA) | SAICA | netCFO | Gauteng/Pretoria | https://www.linkedin.com/in/edburg-strauss/ |
| 300 | **Ian Strydom** | Strydom / Ian | CONFIRMED | AGA(SA) | SAICA | IW Tax Advisory | Western Cape/Cape Town | https://za.linkedin.com/in/ian-strydom |
| 301 | **Elmarie Swanepoel** | Swanepoel / Elmarie | HIGH_CONFIDENCE | CA(SA) | SAICA | Stellenbosch University | Western Cape/Stellenbosch | — |
| 302 | **Charles Swart** | Swart / Charles | CONFIRMED | AGA(SA) | SAICA | Phelan Green Group | Western Cape/Cape Town | https://za.linkedin.com/in/charles-swart-aga-sa-6a2266280 |
| 303 | **Lindi Swart** | Swart / Lindi | CONFIRMED | AGA(SA) | SAICA | Thornlands Group | Western Cape/Cape Town | https://za.linkedin.com/in/lindi-swart-aga-sa-a19b05166 |
| 304 | **Cecelia Swartz** | Swartz / Cecelia | CONFIRMED | CA(SA) | SAICA | — | — | — |
| 305 | **Hiten Taylor** | Taylor / Hiten | CONFIRMED | ACMA, CGMA | CIMA | Stellenbosch Vineyards | Western Cape/Cape Town | https://za.linkedin.com/in/hiten-taylor-acma-cgma-a3b3b2206 |
| 306 | **Johanna Taylor** | Taylor / Johanna | CONFIRMED | ACMA, CGMA | CIMA | TFG (The Foschini Group) | Western Cape/Cape Town | https://za.linkedin.com/in/johanna-taylor-acma-cgma-b1219198 |
| 307 | **Dennis Tembo** | Tembo / Dennis | RESEARCH_HOLD | — | — | — | Western Cape/Western Cape candidate pool | https://za.linkedin.com/in/dennis-tembo-3554016 |
| 308 | **Willem Theron** | Theron / Willem | CONFIRMED | CA(SA) | SAICA | PSG Konsult Ltd (PSG Financial Services) | — | — |
| 309 | **Ranchell Thomas** | Thomas / Ranchell | RESEARCH_HOLD | — | — | Tapestry Home Brands | Western Cape | https://za.linkedin.com/in/ranchell-thomas-0a4080149 |
| 310 | **Ross Thomson** | Thomson / Ross | HIGH_CONFIDENCE | PA(SA) | SAIPA | Collective Accounting | KwaZulu-Natal/Winston Park | — |
| 311 | **Deon Titus** | Titus / Deon | RESEARCH_HOLD | — | — | USB Executive Development | Western Cape | https://za.linkedin.com/in/deon-titus-065660a5 |
| 312 | **Maurice Trichardt** | Trichardt / Maurice | CONFIRMED | AGA(SA) | SAICA | Panorama Consulting | Western Cape/Cape Town | https://za.linkedin.com/in/supremeaccountant |
| 313 | **Martli Truter** | Truter / Martli | CONFIRMED | PA(SA) | SAIPA | Mohr Foods | Western Cape/Durbanville | https://za.linkedin.com/in/martli-truter-pa-sa-4830352ab |
| 314 | **An-ri Truter Roodt** | Truter Roodt / An-ri | CONFIRMED | AGA(SA) | SAICA | CTBA Tax and Business Advisory | Western Cape/Tygervalley | https://za.linkedin.com/in/an-ri-truter-roodt |
| 315 | **Mikateko Tshetshe** | Tshetshe / Mikateko | CONFIRMED | FCMA, CGMA | CIMA | Unilever | — | — |
| 316 | **Sipumeze Tyali** | Tyali / Sipumeze | CONFIRMED | PA(SA) | SAIPA | DigiOutsource | Western Cape/Cape Town | https://za.linkedin.com/in/sipumeze-tyali-professional-accountant-sa-saipa-295a14140 |
| 317 | **Ben Van Der Linde** | Van Der Linde / Ben | CONFIRMED | PA(SA) | SAIPA | — | Western Cape | https://za.linkedin.com/in/ben-van-der-linde |
| 318 | **Arjan Van der Lugt** | Van der Lugt / Arjan | RESEARCH_HOLD | — | — | The Fruit Farm Group South Africa | Western Cape | https://za.linkedin.com/in/arjan-van-der-lugt-2b991384 |
| 319 | **DeWalt Van Der Merwe** | Van Der Merwe / DeWalt | RESEARCH_HOLD | PA(SA) | SAIPA | CASADOBE PROPS 60 / MNK Projects Group | Western Cape/Cape Town | — |
| 320 | **Peet van der Merwe** | van der Merwe / Peet | CONFIRMED | CA(SA) | SAICA | Forvis Mazars in South Africa | Free State/Bloemfontein | https://www.linkedin.com/in/peet-van-der-merwe-ca-sa-ra-8320b7a6/ |
| 321 | **Annette van der Vyver** | van der Vyver / Annette | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/annette-van-der-vyver-85711734 |
| 322 | **Jo-Anne van der Walt** | van der Walt / Jo-Anne | CONFIRMED | PA(SA) | SAIPA | Wauko | Western Cape/Cape Town | https://za.linkedin.com/in/jo-anne-van-der-walt-0016b7128 |
| 323 | **Nadia Van Der Westhuizen** | Van Der Westhuizen / Nadia | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 324 | **Cornell van Eeden** | van Eeden / Cornell | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 325 | **Zahn-Mari van Eeden** | van Eeden / Zahn-Mari | CONFIRMED | PA(SA) | SAIPA | KEE Property Investments | Western Cape/Stellenbosch | https://za.linkedin.com/in/zahn-mari-van-eeden-a10414127 |
| 326 | **Christel van Greunen** | van Greunen / Christel | CONFIRMED | ACMA, CGMA | CIMA | fibertime | Western Cape/Cape Town | https://za.linkedin.com/in/christelvangreunen |
| 327 | **Anton van Niekerk** | van Niekerk / Anton | CONFIRMED | ACMA, CGMA | CIMA | Snapplify | Western Cape/Cape Town | https://www.linkedin.com/in/anton-van-niekerk-acma-b7503b87/ |
| 328 | **Monique van Niekerk** | van Niekerk / Monique | CONFIRMED | AGA(SA) | SAICA | Creative CFO | Western Cape/Cape Town | https://za.linkedin.com/in/monique-van-niekerk-aga-sa-497898125 |
| 329 | **Johann van Rensburg** | van Rensburg / Johann | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 330 | **Owen van Tonder** | van Tonder / Owen | CONFIRMED | CA(SA) | SAICA | Woolworths Holdings Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/owen-van-tonder-ca-sa-a8482131/ |
| 331 | **Carlo Van Zyl** | Van Zyl / Carlo | RESEARCH_HOLD | — | — | Shoprite Group | Western Cape | https://za.linkedin.com/in/carlo-van-zyl-7805baa2 |
| 332 | **Jana van Zyl** | van Zyl / Jana | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 333 | **Niel Van Zyl** | Van Zyl / Niel | CONFIRMED | ACMA, CGMA | CIMA | Pepkor Payments and Lending | Western Cape/Cape Town | https://za.linkedin.com/in/niel-van-zyl-02462a182 |
| 334 | **Sonja Van Zyl** | Van Zyl / Sonja | CONFIRMED | AGA(SA) | SAICA | Acredo Accounting | Western Cape/Durbanville | https://za.linkedin.com/in/sonja-van-zyl-saica-associate-general-accountant-96a9362a |
| 335 | **Willene van Zyl** | van Zyl / Willene | CONFIRMED | CA(SA) | SAICA | LDP Chartered Accountants and Auditors Inc. | Western Cape/Stellenbosch | — |
| 336 | **Brendan Venter** | Venter / Brendan | CONFIRMED | AGA(SA) | SAICA | EVOLABS | Western Cape/Cape Town | https://za.linkedin.com/in/brendan-venter-aga-sa-7864827a |
| 337 | **Frikkie Venter** | Venter / Frikkie | CONFIRMED | PA(SA) | SAIPA | Southern African Fruit Terminals | Western Cape/Cape Town | https://za.linkedin.com/in/frikkie-venter-professional-accountant-sa-8891b510a |
| 338 | **Inga Venter** | Venter / Inga | CONFIRMED | PA(SA) | SAIPA | FTTx And Energy Warehouse | Western Cape/Cape Town | https://za.linkedin.com/in/inga-venter-professional-accountant-sa-5aa62ba6 |
| 339 | **Joani Venter** | Venter / Joani | CONFIRMED | AGA(SA) | SAICA | Fingri Chartered Accountants | Western Cape/Stellenbosch | https://za.linkedin.com/in/joani-venter-aga-sa-763703236 |
| 340 | **Quintin Venter** | Venter / Quintin | HIGH_CONFIDENCE | PA(SA) | SAIPA | Sempre Financial Group | Western Cape/Bellville (Cape Town) | — |
| 341 | **Monique Venter ACMA, CGMA** | Venter ACMA, CGMA / Monique | CONFIRMED | ACMA, CGMA | CIMA | — | Western Cape | https://za.linkedin.com/in/monique-venter-742057b3 |
| 342 | **Barnus Vermeulen** | Vermeulen / Barnus | CONFIRMED | PA(SA) | SAIPA | PSG Konsult / PSG Financial Services | Western Cape/PSG Cape Town ecosystem | https://za.linkedin.com/in/barnus-vermeulen-865a2589 |
| 343 | **John Vertue** | Vertue / John | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/john-vertue-99721264 |
| 344 | **Vijedharsan Vijendranath** | Vijendranath / Vijedharsan | CONFIRMED | FCCA | ACCA | — | Gauteng/Johannesburg | https://www.linkedin.com/in/vijedharsan-vijendranath-fcca-uk-6118b1103/ |
| 345 | **Berenice Vilander** | Vilander / Berenice | RESEARCH_HOLD | PA(SA) | SAIPA | Western Cape Government / Sanlam background | Western Cape/Cape Town | — |
| 346 | **Chantal Viljoen** | Viljoen / Chantal | RESEARCH_HOLD | — | — | TEKCOPAC | Western Cape | https://za.linkedin.com/in/chantal-viljoen-5552aa99 |
| 347 | **Willie Viljoen** | Viljoen / Willie | CONFIRMED | AGA(SA) | SAICA | IJ Smith & Co Inc | Western Cape/Somerset West | https://za.linkedin.com/in/willie-viljoen-aga-sa-475733218 |
| 348 | **Chrizelda Visser** | Visser / Chrizelda | CONFIRMED | ACMA, CGMA | CIMA | Curated Beverages Ltd | Western Cape/Cape Town | https://www.linkedin.com/in/chrizelda-visser-acma-cgma-3671b454/ |
| 349 | **Bronwyn Von Maltitz** | Von Maltitz / Bronwyn | CONFIRMED | AGA(SA) | SAICA | CrossBoundary Energy | Western Cape/Cape Town | https://za.linkedin.com/in/bronwyn-von-maltitz-aga-sa-78b17910b |
| 350 | **Christiaan Vorster** | Vorster / Christiaan | CONFIRMED | CA(SA) | SAICA | SAICA | Western Cape/Cape Town | — |
| 351 | **Marco Wagener** | Wagener / Marco | HIGH_CONFIDENCE | PA(SA) | SAIPA | Excellentia Accounting and Tax Solutions | — | — |
| 352 | **Ashleigh Waite** | Waite / Ashleigh | CONFIRMED | AGA(SA) | SAICA | JTC Group | Western Cape/Cape Town | https://za.linkedin.com/in/ashleigh-waite-aga-sa-bb1b8a169 |
| 353 | **Philip Wapenaar** | Wapenaar / Philip | RESEARCH_HOLD | — | — | — | Western Cape | https://za.linkedin.com/in/philipwapenaar |
| 354 | **Cecil Wehmeyer ACMA, CGMA** | Wehmeyer ACMA, CGMA / Cecil | CONFIRMED | ACMA, CGMA | CIMA | DataEQ | Western Cape | https://za.linkedin.com/in/cecilwehmeyer |
| 355 | **Craig West** | West / Craig | CONFIRMED | AGA(SA) | SAICA | WCB Property Development | Western Cape/Cape Town | https://za.linkedin.com/in/craig-west-aga-sa-562a81a2 |
| 356 | **Shandré Whittles** | Whittles / Shandré | CONFIRMED | AGA(SA) | SAICA | RPF Africa | Western Cape | https://za.linkedin.com/in/shandr%C3%A9-whittles-aga-sa-9a14a4143 |
| 357 | **Jeanie Wiese** | Wiese / Jeanie | ARTICLES_CONFIRMED_DESIGNATION_UNVERIFIED | — | — | Le Roux Fruit Exporters | Western Cape | https://za.linkedin.com/in/jeanie-wiese-3907343a |
| 358 | **Justin Williams** | Williams / Justin | CONFIRMED | AGA(SA), ACMA, CGMA | SAICA, CIMA | Ares Holdings | Western Cape/Cape Town | https://za.linkedin.com/in/justin-williams-acma-cgma-06ab1a1a0 |
| 359 | **Mark Willimott** | Willimott / Mark | CONFIRMED | CA(SA) | SAICA | BDO South Africa | Eastern Cape/Gqeberha (Port Elizabeth) | — |
| 360 | **Cindy-Lee Wilson** | Wilson / Cindy-Lee | RESEARCH_HOLD | — | — | PSG Financial Services | Western Cape | — |
| 361 | **Taryn Woodbridge** | Woodbridge / Taryn | CONFIRMED | CA(SA) | SAICA | Mercedes-Benz South Africa Ltd | — | — |
| 362 | **Luke Woodhouse** | Woodhouse / Luke | CONFIRMED | CA(SA) | SAICA | GUUD GLOBAL | Gauteng/Johannesburg | https://www.linkedin.com/in/luke-woodhouse-ca-sa-b31a0149/ |
| 363 | **Dumisani Zulu** | Zulu / Dumisani | CONFIRMED | AGA(SA) | SAICA | Bonakude Consulting (Pty) Ltd | KwaZulu-Natal/Port Shepstone | https://www.linkedin.com/in/dumisani-zulu-aga-sa-aimfo-a5a62622 |

## 3b. Secondary-population notes (do not re-add)

- `ARTICLES_CONFIRMED_DESIGNATION_UNVERIFIED`: captured; excluded from the main qualified count.
- `CONFLICTING`: captured; designation wording conflicts within the source — verify, don't re-add.
- `RESEARCH_HOLD`: retained for follow-up where qualification, exact identity or role evidence is not yet strong enough for the confirmed population.

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
| **Malvin Lancelot Makanda** | Western Cape V2 and SATURC Top 100 records reconciled by the same public profile URL; retained as one person. |
| **Zine Gengana** | Western Cape V2 and SATURC Top 100 records reconciled by the same public profile URL; retained as one person. |
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
| cmp-0113 | M-KOPA Solar | Pay-as-you-go solar / consumer fintech | — |
| cmp-0075 | M+C Saatchi Group | Professional Services | Cape Town |
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

308 unique source records in `sources.jsonl`. Before adding a source,
check the URL is absent from that file; reuse an existing `src-####` record instead of
duplicating the URL.
