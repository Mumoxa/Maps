# Search Query Log

One row per meaningful executed search. New queries are generated from gaps below.

> **Check `people_index.md` first** before acting on any new search result — it is the master
> name registry. A hit for a person already listed there is enrichment, not a new record.

Legend — Quality: HIGH / MEDIUM / LOW / NONE (yield). Exhausted?: yes when near-duplicate searches
stop adding new people.

## Executed this session

| # | Query | Engine | Date | Geo | Qual | Role | Quality | People found | Companies found | New queries generated | Exhausted? |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `"CA(SA)" "Financial Manager" South Africa company biography` | web | 2026-09-18 | national | CA(SA) | FM | MEDIUM | (ads) | Seriti, Rand Agri, Anglo American (dir.) | SAICA member index fetch | yes (job-ad dominated) |
| 2 | `"Professional Accountant (SA)" "SAIPA" Financial Manager` | web | 2026-09-18 | national | PA(SA) | any | HIGH | 10 named | 10 practices | PA(SA) commerce search | partial |
| 3 | `"AGA(SA)" "SAICA" accountant South Africa` | web | 2026-09-18 | national | AGA(SA) | accountant | MEDIUM | — | SAICA | AGA(SA)+LinkedIn | partial |
| 4 | `"ACMA, CGMA" South Africa finance manager` | web | 2026-09-18 | national | ACMA/CGMA | FM | HIGH | Nkosana Dlamini | Absa | FCMA sweep | partial |
| 5 | `"FCCA" "South Africa" financial controller CA(SA)` | web | 2026-09-18 | national | FCCA | controller | LOW | none | — | FCCA-alone query | not exhausted |
| 6 | `"completed SAICA articles" accountant South Africa` | web | 2026-09-18 | national | SAICA route | any | MEDIUM | Taryn Raju (via TheFinanceStory) | Grant Thornton | named-route accounts | partial |
| 7 | fetch SAICA meet-our-members | fetch | 2026-09-18 | national | CA(SA)/AGA(SA) | all | HIGH | ~35 named | 13+ | per-member article fetches | no |
| 8 | fetch Vusi Mpofu / Woodbridge / Makhaya SAICA articles | fetch | 2026-09-18 | national | AGA(SA)/CA(SA) | exec | HIGH | Vusi Mpofu (KPMG) | Nedbank, KPMG | KPMG alumni | no |
| 9 | `"Professional Accountant (SA)" director "SAIPA" practice Cape Town accounting firm` | web | 2026-09-18 | W.Cape | PA(SA) | practice | HIGH | 10 named | 10 practices | per-firm checks | partial |
| 10 | `"FCMA" "South Africa" CFO finance` | web | 2026-09-18 | national | FCMA | CFO | HIGH | Mikateko Tshetshe | Unilever, Bayer | — | partial |
| 11 | `"ACCA" "member" "South Africa" "Financial Controller" OR "Finance Manager"` | web | 2026-09-18 | national | ACCA | controller | LOW | none | — | ACCA-directory targeting | not exhausted |
| 12 | `"AGA(SA)" "Financial Manager" South Africa` | web | 2026-09-18 | national | AGA(SA) | FM | HIGH | Kgabiso Mahlangu; Dumisani Zulu | SA State Theatre, TCTA, Bonakude | Blouberg Intl School signal | partial |
| 13 | `"ACCA" "FCCA" South Africa "Group Financial" OR "Financial Controller" LinkedIn` | web | 2026-09-18 | national | ACCA/FCCA | controller | LOW | none SA-based | HOOPP (CA) | re-query | not exhausted |
| 14 | `"CA(SA)" "SAP" Finance Manager Gauteng` | web | 2026-09-18 | Gauteng | CA(SA)+SAP | FM | HIGH | Illana Helman (Massmart); Sandi De Souza | Massmart, SAP Africa | SAP-ecosystem CA(SA) search | partial |
| 15 | `"CA(SA)" accountant "Eastern Cape" OR "Free State" OR "Limpopo" OR "Mpumalanga"` | web | 2026-09-18 | EC/FS/LP/MP | CA(SA) | any | HIGH | Masechaba Sesing; Mpho Mookapele; Vukosi Fungeni; Mabatho Sedikela | EWSETA, FS Treasury | fetch ASA profiles | partial |
| 16 | `"PA(SA)" "Financial Manager" OR "Finance Manager" South Africa manufacturing` | web | 2026-09-18 | national | PA(SA) | FM | LOW | (ads) | — | — | low (ads) |
| 17 | fetch sap.com Africa leadership | fetch | 2026-09-18 | national | CA(SA) | CFO | HIGH | Sandi De Souza (Deloitte articles) | SAP Africa | — | done |
| 18 | fetch accountancysa.org.za/casa-profiles/ (13 chunks) | fetch | 2026-09-18 | national | CA(SA) | all | HIGH | ~40 named | Motus, BDO, PKF Octagon, Makosi, Motlanalo, Wonga, Traxtion, Durban ICC | per-profile detail fetches | no |
| 19 | `"FCCA" accountant South Africa finance director company profile` | web | 2026-09-18 | national | FCCA | director | LOW | — | — | — | yes (generic) |
| 20 | `"ACCA member" OR "FCCA" "South Africa" chartered certified accountant Johannesburg OR Durban OR "Cape Town"` | web | 2026-09-18 | national | ACCA/FCCA | any | HIGH | Vijedharsan Vijendranath | — | FCCA-LinkedIn sweep | partial |
| 21 | `"SAIPA" "Professional Accountant (SA)" "Financial Manager" Johannesburg OR Pretoria OR Durban commerce` | web | 2026-09-18 | national | PA(SA) | FM | LOW | (ads) | — | — | low (ads) |
| 22 | `"AGA(SA)" accountant "KwaZulu-Natal" OR "Eastern Cape" OR "Free State" LinkedIn` | web | 2026-09-18 | KZN/EC/FS | AGA(SA) | accountant | LOW | (Kgabiso repeat) | — | — | partial |
| 23 | `"ACCA" "FCCA" "financial manager" OR "group accountant" Johannesburg LinkedIn South Africa accountant profile` | web | 2026-09-18 | Gauteng | ACCA/FCCA | FM | HIGH | Manenzhe Manenzhe; (dir signals) | ACCA SA | ACCA council angle | partial |
| 24 | `"Chartered Global Management Accountant" OR "ACMA, CGMA" "financial manager" OR "finance manager" South Africa named` | web | 2026-09-18 | national | CGMA | FM | MEDIUM | Tariro Mutizwa | CIMA | CIMA convocation attendee search | partial |
| 25 | `"Associate General Accountant (SA)" OR "AGA(SA)" "SAICA" accountant company` | web | 2026-09-18 | national | AGA(SA) | any | LOW | (pathway pages) | SAICA | AGA(SA) LinkedIn deep search | partial |
| 26 | `"ACCA" "South Africa" "Head of Finance" OR "Finance Manager" accountant company profile -student -jobs` | web | 2026-09-18 | national | ACCA | HoF/FM | LOW | (jobs) | — | ACCA Global careers | no |
| 27 | `"PA(SA)" accountant "Nelspruit" OR "Polokwane" OR "East London" OR "Bloemfontein" practice` | web | 2026-09-18 | MP/LP/EC/FS | PA(SA) | practice | HIGH | Lesetja Kwetepane; Niäl Pienaar; Jaco Kruger | LA Financial, Niäl Pienaar & Assoc | firm-site checks | partial |
| 28 | `"CA(SA)" "Annual Report" director OR CFO "Northern Cape" OR "North West" OR "Mpumalanga" company` | web | 2026-09-18 | NC/NW/MP | CA(SA) | CFO/dir | LOW | Div Lamprecht (via SAICA) | — | fetch SAICA regional execs | partial |
| 29 | fetch SAICA regional-executives page | fetch | 2026-09-18 | all regions | CA(SA) | exec | HIGH | Vorster, Asvat, Lamprecht, Reintjes | SAICA | — | done |

## Executed — session 2 (Western Cape focus)

| # | Query | Engine | Date | Geo | Qual | Role | Quality | People found | Companies found | New queries generated | Exhausted? |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 30 | PKF / MD Streets / McA / Sable team sweeps | web | 2026-09-18 | W.Cape | all | partner/dir | HIGH | Sacks, Rich, Bapukee, Birkenstock, Spies, Fourie, Nel, du Plessis | Streets, McA, Sable, PKF | firm-site fetches | partial |
| 31 | `"PA(SA)" accountant "Winelands"` | web | 2026-09-18 | W.Cape | PA(SA) | practice | MEDIUM | (job ad) | — | — | low |
| 32 | `"AGA(SA)" SAICA South Africa accountant` | web | 2026-09-18 | national | AGA(SA) | accountant | MEDIUM | — | SAICA | AGA(SA)+LinkedIn | partial |
| 33 | `"ACMA"/"CGMA" "Cape Town"` | web | 2026-09-18 | W.Cape | CIMA | any | LOW | (explainers/ads) | — | — | yes |
| 34 | Garden Route firms — Fenns, Blu Solutions, SA Accounting Network | web | 2026-09-18 | Garden Route | all | any | LOW | (firm pages, no designations) | Fenns, Blu | — | partial |
| 35 | fetch PKF Cape Town (Bellville & Stellenbosch) | fetch | 2026-09-18 | W.Cape | CA(SA) | partner | LOW | names only in snippet | PKF CT | per-person verify | no |
| 36 | fetch PKF Constantia Valley | fetch | 2026-09-18 | W.Cape | CA(SA) | director | LOW | names only in snippet | PKF CV | per-person verify | no |
| 37 | findanaccountant Winelands | web | 2026-09-18 | W.Cape | all | practice | MEDIUM | 8 named (designations unverified) | 8 practices | profile fetches | partial |
| 38 | Sage One adviser directories (Vox/MTN) | web | 2026-09-18 | W.Cape | PA(SA) | practice | HIGH | Augustine, Johns (PA(SA)); du Plessis/Schneider/Adams (CA(SA)) | practices | — | no |
| 39 | AGA(SA) WC LinkedIn sweep | web | 2026-09-18 | W.Cape | AGA(SA) | accountant | HIGH | Fourie, L du Plessis, Nel | Brenn-O-Kem, Cape Chamber, Schoemans | — | no |
| 40 | audit-firm CT team sweep | web | 2026-09-18 | W.Cape | CA(SA) RA | auditor | HIGH | P van der Merwe (FS), Roeloffze (GP) | Forvis Mazars | — | partial |
| 41 | `linkedin.com/in "CA(SA)" "Cape Town" financial manager OR accountant` | web | 2026-09-18 | W.Cape | CA(SA) | FM | HIGH | Ashley Hanekom (Superside) | Superside | — | partial |
| 42 | `linkedin.com/in "AGA(SA)" accountant South Africa` | web | 2026-09-18 | national | AGA(SA) | accountant | HIGH | Ashley Du Plessis (Paarl) | — | — | partial |
| 43 | `linkedin.com/in "CA(SA)" "Stellenbosch" OR "Paarl" OR "Durbanville" OR "Bellville"` | web | 2026-09-18 | W.Cape | CA(SA) | any | LOW | (noise/jobs) | — | — | low |
| 44 | `"CA(SA)" "Financial Director" OR "CFO" "Cape Town" company leadership` | web | 2026-09-18 | W.Cape | CA(SA) | CFO | LOW | (job ads) | — | — | low |
| 45 | `"ACMA"/"CGMA"/"CIMA" qualified "Western Cape" finance` | web | 2026-09-18 | W.Cape | CIMA | any | LOW | (explainers) | — | — | yes |
| 46 | `"ACCA" OR "FCCA" accountant "Cape Town" OR "Western Cape" LinkedIn` | web | 2026-09-18 | W.Cape | ACCA | any | LOW | (jobs) | — | — | partial |
| 47 | fetch streets.uk/cape-town-south-africa | fetch | 2026-09-18 | W.Cape | CA(SA) | dir | HIGH | Sacks, Rich (B.Comm CA(SA)); Bapukee (CA(SA)); Roman (no desig) | Streets | — | done |
| 48 | fetch mca-acc.co.za | fetch | 2026-09-18 | W.Cape | CA/PA/AGA | dir | HIGH | Birkenstock, Spies CA(SA); Dirkse van Schalkwyk AGA(SA); Stohr, McLachlan SAIPA | McA | — | done |
| 49 | `"PA(SA)" ... "Cape Town" LinkedIn` | web | 2026-09-18 | W.Cape | PA(SA) | any | LOW | (ads) | — | — | low |
| 50 | `"CA(SA)" "Deloitte/PwC/KPMG Cape Town" LinkedIn manager` | web | 2026-09-18 | W.Cape | CA(SA) | manager | HIGH | Karamchand (CT), Christie (NL), Heuvel (CT) | BDO/Deloitte/KPMG | Heuvel verify | partial |
| 51 | `"CA(SA)" accountant "George"/"Mossel Bay"/"Knysna"/"Oudtshoorn" LinkedIn` | web | 2026-09-18 | Garden Rte | CA(SA) | accountant | LOW | (firm pages) | Steyl & Cloete, PKF George | — | partial |
| 52 | `"PA(SA)"/"AGA(SA)" accountant "George"/…` | web | 2026-09-18 | Garden Rte | PA/AGA | accountant | NONE | — | — | — | yes |
| 53 | SAIPA "Professional Accountant (SA)" "Western Cape" member directory | web | 2026-09-18 | W.Cape | PA(SA) | practice | LOW | (institute page) | SAIPA | — | partial |
| 54 | `linkedin "CA(SA)" "Cape Town" audit OR finance OR accountant -jobs` | web | 2026-09-18 | W.Cape | CA(SA) | any | MEDIUM | (recruiter, non-SA) | — | — | partial |
| 55 | `linkedin "CA(SA)" "Western Cape" OR "Stellenbosch" OR "Somerset West"` | web | 2026-09-18 | W.Cape | CA(SA) | any | LOW | (jobs/towns) | — | — | low |
| 56 | `linkedin "AGA(SA)"/"PA(SA)" accountant "Western Cape"` | web | 2026-09-18 | W.Cape | AGA/PA | accountant | LOW | (job ad) | — | — | low |
| 57 | `linkedin "CA(SA)" "Durbanville"/"Bellville"/"Tyger Valley"/"Century City"` | web | 2026-09-18 | W.Cape | CA(SA) | any | LOW | (noise) | — | — | low |
| 58 | fetch findanaccountant.co.za/accountant-cape-town | fetch | 2026-09-18 | W.Cape | all | practice | MEDIUM | (names, designations sparse) | many practices | per-profile fetches | no |
| 59 | `"CFO"/"Financial Director" "CA(SA)" "Cape Town" site:linkedin.com/in` | web | 2026-09-18 | W.Cape | CA(SA) | CFO | HIGH | Motholo (UCT), de Lange, de Wet (TradeOn), Rheeder | UCT, TradeOn, The Modern CFO | — | partial |
| 60 | `"CGMA"/"ACMA"/"FCMA" "Cape Town"/"Western Cape" LinkedIn finance` | web | 2026-09-18 | W.Cape | CIMA | FM | HIGH | Visser, Danster, van Niekerk (Snapplify) | Curated, Curro, Snapplify | — | partial |
| 61 | `linkedin "Adrian Smith" ACMA CGMA Bounty Apparel` | web | 2026-09-18 | W.Cape | ACMA/CGMA | HoF | HIGH | Adrian Smith | Bounty Apparel | — | done |
| 62 | `linkedin "Marco Barbera" CA(SA) CFO Cape Town` | web | 2026-09-18 | — | CA(SA) | CFO | LOW | (Denmark profile — skip) | — | — | done |
| 63 | `linkedin "Morgan Gregory" CA(SA) CFO Cape Town` | web | 2026-09-18 | W.Cape | CA(SA) | CFO | HIGH | Morgan Gregory (ASL articles) | MK Aerospace, ASL | — | done |
| 64 | `linkedin "Elmarie Swanepoel" CA(SA) accountant` | web | 2026-09-18 | W.Cape | CA(SA) | academia | MEDIUM | Swanepoel (Stellenbosch) | Stellenbosch U | — | done |
| 65 | `"CA(SA)" "Shoprite"/"Woolworths"/"Pick n Pay"/"Truworths" CFO finance LinkedIn` | web | 2026-09-18 | W.Cape | CA(SA) | CFO | HIGH | Owen van Tonder, Ralph Buddle (TFG), Zaid Manjra | Woolworths, TFG | verify pages | partial |
| 66 | `"PA(SA)" ... "Cape Town"/"Western Cape" LinkedIn SAIPA` | web | 2026-09-18 | W.Cape | PA(SA) | any | LOW | (ads) | — | — | low |
| 67 | `"ACCA" "member" accountant "South Africa" LinkedIn -jobs -student` | web | 2026-09-18 | national | ACCA | any | LOW | (FAQs, 730-member stat) | — | — | partial |
| 68 | fetch tfglimited.co.za/our-brands | fetch | 2026-09-18 | W.Cape | CA(SA) | board | HIGH | Buddle (CFO CA(SA)), Davin (CA(SA) Arthur Andersen), Potgieter (CA) | TFG | — | done |
| 69 | `"Zaid Manjra" Woolworths CFO CA(SA)` | web | 2026-09-18 | W.Cape | CA(SA) | CFO | HIGH | Zaid Manjra (30+ yrs) | Woolworths | — | done |
| 70 | `"Owen van Tonder" Woolworths CFO` | web | 2026-09-18 | W.Cape | CA(SA) | CFO | HIGH | van Tonder (CFO F,B&H) | Woolworths | — | done |
| 71 | `linkedin "CA(SA)" FD/CFO "Paarl"/"Worcester"/"Stellenbosch"` | web | 2026-09-18 | W.Cape | CA(SA) | CFO | MEDIUM | Strauss (netCFO, GP) | netCFO | — | partial |
| 72 | `linkedin "Lyle Weber" CA(SA) location` | web | 2026-09-18 | — | CA(SA) | exec | LOW | (US-based — skip) | — | — | done |
| 73 | `"Edburg Strauss" CA(SA) netCFO` | web | 2026-09-18 | Gauteng | CA(SA) | MD | HIGH | Strauss (UP; Xero) | netCFO | — | done |
| 74 | `"AGA(SA)"/"Associate General Accountant" LinkedIn WC` | web | 2026-09-18 | W.Cape | AGA(SA) | accountant | LOW | (job ad) | — | — | low |
| 75 | `"CA(SA)" "Somerset West"/"Strand"/"Gordon's Bay" LinkedIn accountant` | web | 2026-09-18 | W.Cape | CA(SA) | practice | HIGH | Emma Pardoe, Johan Coetzee (Callidus), Theron du Plessis | practices | verify | partial |
| 76 | Boshoff Knoetze chartered accountants CA(SA) | web | 2026-09-18 | W.Cape | CA(SA) | MD | HIGH | Kobus Boshoff (CA(SA) 1982) | Boshoff Knoetze | — | done |
| 77 | `"Emma Pardoe" Chartered Accountant Somerset West CA(SA)` | web | 2026-09-18 | W.Cape | CA(SA) | practice | HIGH | Emma Pardoe (CA(SA)+RA) | Emma Pardoe CA | — | done |
| 78 | `"Johan Coetzee" Callidus Accountants CA` | web | 2026-09-18 | W.Cape | CA(SA)+RA | practice | HIGH | Johan Coetzee (RAU 1988) | Callidus | — | done |
| 79 | `linkedin "PA(SA)"/"AGA(SA)" "Cape Town" FM/accountant -jobs` | web | 2026-09-18 | W.Cape | PA/AGA | FM | LOW | (ads) | — | — | low |
| 80 | fetch calidus.co.za | fetch | 2026-09-18 | — | — | — | NONE | (domain now unrelated — APTi) | — | — | dead end |
| 81 | `"Willem Theron" PSG Konsult chairman CA(SA)` | web | 2026-09-18 | W.Cape | CA(SA) | chairman | HIGH | Willem Theron (BCompt Hons CA(SA)) | PSG Konsult, Theron du Plessis | — | done |
| 82 | `"Kobus Boshoff" Boshoff Knoetze CA(SA)` | web | 2026-09-18 | W.Cape | CA(SA) | MD | HIGH | (confirm) | Boshoff Knoetze | — | done |
| 83 | `"AGA(SA)"/"PA(SA)" LinkedIn "Cape Town" accountant -jobs` | web | 2026-09-18 | W.Cape | AGA/PA | accountant | LOW | (ads) | — | — | low |
| 84 | `"CA(SA)" FD "Helderberg"/"Somerset West"/"Stellenbosch" LinkedIn` | web | 2026-09-18 | W.Cape | CA(SA) | FD | HIGH | LDP lead | LDP, Theron du Plessis | LDP team fetch | partial |
| 85 | LDP Chartered Accountants Stellenbosch partners CA(SA) | web | 2026-09-18 | W.Cape | CA(SA)+RA | director | HIGH | 12 directors | LDP | team fetch | partial |
| 86 | `site:ldp.co.za directors OR partners CA` | web | 2026-09-18 | W.Cape | CA(SA) | director | MEDIUM | (about page) | LDP | — | done |
| 87–88 | fetch ldp.co.za/our-team (2 chunks) | fetch | 2026-09-18 | W.Cape | CA(SA)+RA | director | HIGH | Du Plessis, Marx, Joubert, van Rensburg, Goosen, van Zyl, de Villiers, van Eeden, J van Zyl, N Van Der Westhuizen, Le Roux, Haasbroek (CONFLICTING) | LDP | — | done |
| 89 | `"PA(SA)" LinkedIn "Western Cape"/"Cape Town"/"Paarl"/"Worcester"` | web | 2026-09-18 | W.Cape | PA(SA) | practice | LOW | (ATC list) | SAIPA ATCs | — | partial |
| 90 | `"AGA(SA)" LinkedIn accountant "South Africa" -jobs -student` | web | 2026-09-18 | national | AGA(SA) | accountant | LOW | (repeats) | — | — | partial |
| 91 | `"Moore"/"BDO"/"Mazars"/"Nexia" "Cape Town" team CA(SA) partners` | web | 2026-09-18 | W.Cape | CA(SA) | partner | HIGH | Mokoena (CEO), Hashim (CT MP), Willimott | BDO | verify pages | partial |
| 92 | findanaccountant.co.za "CA(SA)" WC | web | 2026-09-18 | W.Cape | CA(SA) | practice | HIGH | Johan le Roux | le Roux CA(SA) | — | partial |
| 93 | `"Chartered Accountants" "our team" George/Knysna/Mossel Bay/Oudtshoorn` | web | 2026-09-18 | Garden Rte | CA(SA) | dir | LOW | (PKF George history) | PKF George | — | partial |
| 94 | `"Bonga Mokoena" CA(SA) BDO CEO` | web | 2026-09-18 | Gauteng | CA(SA) | CEO | HIGH | Bonga Mokoena | BDO | — | done |
| 95 | `"Imtiaaz Hashim" BDO Cape Town CA(SA)` | web | 2026-09-18 | W.Cape | CA(SA)+RA | MP | HIGH | Imtiaaz Hashim | BDO | — | done |
| 96 | `"Mark Willimott" CA(SA) BDO` | web | 2026-09-18 | E.Cape | CA(SA) | partner | HIGH | Mark Willimott | BDO | — | done |
| 97 | `"Johan le Roux" CA(SA) Milnerton` | web | 2026-09-18 | W.Cape | CA(SA) | practice | HIGH | le Roux (Sage 50cloud Pastel, Draftworx) | le Roux CA(SA) | — | done |
| 98 | `"SNG GT"/"Baker Tilly"/"Crowe"/"RSM"/"HLB" CT partners CA(SA)` | web | 2026-09-18 | W.Cape | CA(SA) | partner | LOW | (Crowe roster, names no designations) | Crowe | per-person verify | partial |
| 99 | `"AGA(SA)" LinkedIn "Stellenbosch"/"Paarl"/"Worcester"/"George"` | web | 2026-09-18 | W.Cape | AGA(SA) | accountant | HIGH | Huysamer (Worcester), Gerber lead | Kula, Pay@ | — | partial |
| 100 | `"FCCA"/"ACCA" "accountant" "Cape Town"/"Western Cape" LinkedIn -jobs` | web | 2026-09-18 | W.Cape | ACCA | any | LOW | (Mitton in-progress — excluded) | Atlantic Accounting | — | partial |
| 101 | `"André Huysamer" AGA(SA) Worcester` | web | 2026-09-18 | W.Cape | AGA(SA) | accountant | MEDIUM | Huysamer (Kula) | Kula | — | done |
| 102 | `"Zandrea Gerber" CA(SA) Pay@ Stellenbosch` | web | 2026-09-18 | W.Cape | CA(SA) | FM | HIGH | Zandrea Gerber (SAICA) | Pay@ | — | done |
| 103 | `linkedin "CA(SA)" "Sanlam"/"Old Mutual"/"Investec"/"Discovery"` | web | 2026-09-18 | W.Cape | CA(SA) | finance | LOW | (company pages) | Sanlam, Old Mutual | — | low |
| 104 | `"AGA(SA)"/"AT(SA)"/"PA(SA)" "Table View"/"Milnerton"/… LinkedIn` | web | 2026-09-18 | W.Cape | non-CA | any | LOW | (ads) | — | — | low |
| 105 | `"FCCA" LinkedIn "South Africa" accountant finance -jobs` | web | 2026-09-18 | national | FCCA | any | LOW | (Nigeria profile) | — | — | low |
| 106 | `linkedin.com/in "CA(SA)" "Western Cape" FA/FM -jobs -vacancies` | web | 2026-09-18 | W.Cape | CA(SA) | FA/FM | LOW | (ads) | — | — | low |
| 107 | `linkedin.com/in "AGA(SA)" "Cape Town"/"Paarl"/"Stellenbosch" finance` | web | 2026-09-18 | W.Cape | AGA(SA) | finance | LOW | (job ads) | — | — | low |
| 108 | `linkedin.com/in "ACMA"/"CGMA" "Cape Town" finance manager group` | web | 2026-09-18 | W.Cape | CIMA | FM | HIGH | Dzvova (CA+CIMA), Hoffman, Kuni | AYO, The Fieldbar Co., M+C Saatchi | — | partial |

## Format reference

- **Engine**: web (Arena web search) / fetch (page extraction).
- **Quality**: HIGH / MEDIUM / LOW / NONE.
- **Exhausted?**: yes when further near-duplicate searches stop adding new people.
