# -*- coding: utf-8 -*-
"""SA Hackathon Census — Phase 2 additions (researched 2026-08-26).
New sources, events, participation records, unresolved identities and gap updates from the
Phase-2 passes (Wayback, series-gap, province, adversarial, person-backwards, re-verification)."""

U = "Unknown"

SOURCES2 = {
 "S84": ("#GirlCodeHack: The largest female hackathon", "Geeky Reality",
         "https://www.geekyreality.com/blog/girlcodehack-the-largest-female-hackathon",
         "2018-08-23", "Sector blog", "Secondary", "Strong",
         "GirlCodeHack 2018 (5th annual, 3-5 Aug 2018): 1st 'Lightbulbs' (Johannesburg; trip to Women in Tech Conference Amsterdam, Cisco); 2nd 'Scatterlings of Africa' (Cape Town; Amazon Echo); 3rd Durban team ('Self-Educate' app); R350k prize pool (BoxFusion, AWS, Cisco, LGIT Smart Solutions)"),
 "S85": ("GirlCode Hackathon 2018 report back", "DVT",
         "https://www.dvtsoftware.com/news-insights/insights/item/324-girlcode-hackathon-2018-report-back",
         "2018-11-29", "Corporate blog", "Participant-generated", "Moderate",
         "Participation detail: 24h hackathon, four judging panels, top nine re-pitched; DVT team Greenly reached top nine"),
 "S86": ("IS team wins 2022 Discovery GradHack", "UCT School of IT",
         "https://sit.uct.ac.za/articles/2021-06-17-team-wins-2022-discovery-gradhack",
         "2022-08-18", "University news", "Primary", "Strong",
         "2022 GradHack winner: UJ? no — UCT IS Honours team (Athir Fayker, Furqaan Ajmoodien, Goosain Allie, Kyle Poggenpoel), solution D-Tex (IoT/emerging tech for Discovery insurance division)"),
 "S87": ("The Hackstreet Boys win the 2023 Discovery Gradhack", "UCT School of IT",
         "https://sit.uct.ac.za/articles/2023-06-13-hackstreet-boys-win-2023-discovery-gradhack",
         "2023-06-13", "University news", "Primary", "Strong",
         "2023 virtual Gradhack from 21 Apr 2023, 15 teams, 72h; winner Hackstreet Boys (James Clark, Max Coleman, Jack Scott-King, UCT 4th-year IS; Self-Sovereign Identity KYC); top three all Cape Town: BroCode (UCT), QWERTY (Stellenbosch)"),
 "S88": ("Thabang Mabula — LinkedIn profile (Honors & Awards)", "LinkedIn (self-reported)",
         "https://www.linkedin.com/in/thabang-mabula/",
         "2026 (profile)", "Public profile", "Participant-generated", "Weak-Moderate",
         "'Gradhack Winning Team Discovery Ltd. Jul 2019' and '3rd Place Winners of FinChatBot Hackathon FinChatBot Nov 2019' — self-reported; the FinChatBot 3rd-place claim is corroborated by S98 (The Edge took third place)"),
 "S89": ("Team Doria wins #SSHACK26", "ITWeb",
         "https://www.itweb.co.za/article/team-doria-wins-sshack26/4r1ly7R95KPvpmda",
         "2026-06-05", "News article", "Secondary", "Strong",
         "ITWeb Security Summit 2026 Hackathon: 1st Team Doria R20k; 2nd Juveni Q R10k (AI cyber immune system); 3rd Siyabona R5k (mobile anti-phishing); CTF Blue Teaming: Lesoko Monyepao (UNISA Business Informatics); CTF Red Teaming: Katlego Tsebe (UNISA BSc Informatics); Subverted Academy licences; partners incl. Geekulcha, Snode"),
 "S90": ("NCape developers shine at Security Summit 2024 Hackathon", "ITWeb",
         "https://www.itweb.co.za/article/ncape-developers-shine-at-security-summit-2024-hackathon/VgZey7JlkeyqdjX9",
         "2024-06-07", "News article", "Secondary", "Strong",
         "SS24Hack: 500+ registrations, 57 participants/14 teams; 1st Art-VeriAI (4 SPU data science students; R20k by Snode; anti-deepfake API); 2nd Team Sudo SPU; Sudo SPU also won CTF ($250 + Snode internships); 'Ethical Exploiters' won first place in CTF (Telspace internships + R40k laptop); Future Hackers Award: Alex Dodd and Jivesh Ramnath"),
 "S91": ("Young geeks rise to defend SA from ID fraud", "ITWeb",
         "https://www.itweb.co.za/article/young-geeks-rise-to-defend-sa-from-id-fraud/WnpNgq21GZYMVrGd",
         "2022-06-08", "News article", "Secondary", "Strong",
         "#SS22Hack (Sandton Convention Centre): overall winner 'Hacker Agents' — students from Sol Plaatje University, Kimberley (R20k; digital signatures for DoH vaccination SMSes; Snode internships); 2nd SecureIT (two UJ students; R10k; Best Female Hackers); 3rd Cyber Smart Team (Mpumalanga; R5k); CTF winner Jabu Mahlangu (Mpumalanga; Telspace internship); Tiyani Nghonyama chairperson"),
 "S92": ("Hackathon — ITWeb Security Summit 2023 (event page)", "ITWeb",
         "https://www.itweb.co.za/event/itweb-security-summit-2023/hackathon/index.html",
         "2023", "Organiser event page", "Primary", "Moderate",
         "#SS23Hack at Sandton Convention Centre 6-7 June 2023; '2023 Geekulcha/ITWeb Security Summit Hackathon'; sponsors Snode and Startup Business Campus; 1st prize R20k + 12-month Snode internship; judges listed (Naidoo, Nasiorowska, Ntombela, Regasek) — winners' names not on page snapshot"),
 "S93": ("Security hackathon heads to Kimberley", "ITWeb",
         "https://www.itweb.co.za/article/security-hackathon-heads-to-kimberley/mQwkoM6Y6aE73r9A",
         "2025-05-30", "News article", "Secondary", "Moderate",
         "Northern Cape edition of ITWeb SS Hackathon (#SS25HACK) hosted by NC Dept of Economic Development & Tourism, Sol Plaatje University, Geekulcha, CompTIA, Telspace Africa, Snode; up to 50 participants in 15 teams; AI-for-cyber-resilience theme"),
 "S94": ("Virtual Hackathon Challenge winners announced", "Ventureburn",
         "https://ventureburn.com/2020/12/virtual-hackathon-challenge-winners-announced/",
         "2020-11-30", "Tech media", "Secondary", "Strong",
         "PAICTA + UJ Technopreneurship Centre virtual hackathon (agri challenge, 13 groups): winner Young Innovators Tech; specials: Charity Ruvurashe Chichichi (best female hacker), Tinashe Makamure (Rising Star), Yoosuf Haffejee (GeekHack Star); sponsors Software AG, Siyafunda CTC, Mecer, Huawei, Deviare; CISCO training for all"),
 "S95": ("MPUMALANGA AI HACKATHON: UNIS JOIN FOR STUDENT EVENT", "Visive.ai",
         "https://www.visive.ai/news/mpumalanga-ai-hackathon-unis-join-for-student-event",
         U, "News article", "Secondary", "Moderate",
         "Mpumalanga Artificial Intelligence Student Hackathon (Maish) launched by University of Mpumalanga + TUT; theme 'Utilising digital solutions to solve Africa's problems'; 2023 edition executed successfully (per Prof Ndiko Ludidi, UMP dean); winners not stated"),
 "S96": ("TUT and Telkom drive innovation with 36-hour Hackathon to empower youth", "Tshwane University of Technology",
         "https://www.tut.ac.za/latest-news/819-tut-and-telkom-drive-innovation-with-36-hour-hackathon-to-empower-youth",
         "2025-10-02", "University news", "Primary", "Strong",
         "Telkom 10x Hackathon at TUT eMalahleni Campus (with Nkangala TVET College, Amdocs, Geekulcha; students + high-school learners): winner Technobytes (TUT) — 'Gig Kasi' marketplace app, R20k + national entry (Best Newcomer / Best Hackathon Solution categories); team member Matsobane Sethosa (final-year CS); runner-up R15k"),
 "S97": ("CUT Students' Life-Saving Fire Alert System Takes 1st Place at Telkom 10X Hackathon", "Central University of Technology",
         "https://www.cut.ac.za/news/cut-students-life-saving-fire-alert-system-takes-first-place-at-telkom-hackathon",
         "2025-10-17", "University news", "Primary", "Strong",
         "Confirms FS leg date 7 Sep 2025 at Botshabelo Digital Hub; Chetter (2nd-year IT) & Makhetha (4th-year Advanced Diploma Studio Art), R15k; advanced to national finals Johannesburg; also 3rd at Geekulcha Annual Hackathon"),
 "S98": ("FinChatBot — first hackathon at IBM Johannesburg", "Skills Summit (article syndication)",
         "http://www.skillssummit.co.za/index.php/article/finchatbot-30163.html",
         "2020-01-21", "Sector publication", "Secondary", "Strong",
         "FinChatBot's first hackathon, at IBM Johannesburg; 11 teams; R10k + Budget Insurance implementation. Winner 'Aurora': Ramashita Ramutloa (EY RPA), Joanne Moonsamy (Nedbank DSI), Moses Shaba Jnr (Nedbank DSI), Rob Fairon (EDSA intern), Ebrahim Noormahomed (EDSA student); 2nd Midnight Stack Overflow; 3rd The Edge; Qubit Mafia also recognised"),
 "S99": ("Krilona Pillay LinkedIn post — 4th Annual Tshwane Varsity Hackathon", "LinkedIn (public post)",
         "https://www.linkedin.com/posts/krilona-pillay-4135016_aws-e2w-southafrica-activity-6992040915729018880-A0os",
         "2022-10-29", "Organiser-adjacent social post", "Participant-generated", "Moderate",
         "TVH 2022 (4th annual): hosted by TUT Faculty of ICT with AWS, City of Tshwane, AB4IR; 110 hackers; health/unemployment/service-delivery challenges"),
 "S100": ("One thousand data scientists join hands across closed borders for UmojaHack Africa", "Zindi (Medium)",
         "https://zindi.medium.com/one-thousand-data-scientists-join-hands-across-closed-borders-for-umojahack-africa-6edfe56b0452",
         "2021-12-16", "Organiser publication", "Primary", "Moderate",
         "UmojaHack Africa (Zindi inter-university virtual data hackathon; ~$20k prizes): winners included teams from Stellenbosch University and University of Cape Town (SA) and SUPCOM (Tunisia); challenges incl. SAEON marine classification (SA waters); 164 first-time submitters"),
 "S101": ("Africa's largest inter-university hackathon brings students together on Zindi", "APO Group (press release, Johannesburg dateline)",
         "https://www.africa-newsroom.com/press/africas-largest-interuniversity-hackathon-brings-students-together-on-zindi-for-data-science-for-good?lang=en",
         "2021-04-08", "Organiser press release", "Primary", "Moderate",
         "UmojaHack Africa 2021 (27-28 Mar 2021): 1000+ students from 126 universities, 9 countries; challenges: financial resilience, Sendy logistics, InstaDeep DeepChain biology; $10k+ prizes; winners from 9 African countries"),
 "S102": ("SA Game Jam 2018", "Make Games South Africa (forum)",
         "https://makegamessa.com/discussion/5375/sa-game-jam-2018",
         "2018-08-15", "Community forum", "Participant-generated", "Moderate",
         "SA GAME JAM — annual national competition sponsored by Free Lives; 2018 edition: R30k prize pool across Student/Hobbyist/Diversity categories + Best Art/Audio/Technical/Narrative + Overall R5k; winners announced by 8 October 2018"),
 "S103": ("HackCorruption — South Africa Anti-Corruption Hackathon 2022", "Accountability Lab (hackcorruption.org)",
         "https://hackcorruption.org/south-africa-hackathon/",
         "2022", "Organiser page", "Primary", "Strong",
         "HackCorruption (Accountability Lab + CIPE + US State Dept INL), July 2022 hybrid event, 100 participants from 6 Southern/East African countries; winning teams to Johannesburg boot camp (Oct 2022): Team 3 (Amon Peter, Baptista Joao, Farida Junior Kyababa, Linda McLeod, Saudai Sapi); Team 7 (Kunda Sakala, Nathan Chisanga, Nkina Ramonyai, Samuel Wakumelo); Team 14 (Eliud Luutsa, Maria Kauhondamwa, Matilda Mwendwa Gitonga, Wilbard Kangwiya, Baptiste Nardone); Team 22 (Angelic Mokoena, Lerato Tlhako, Lethabo Makopo — 'Digital Citizenship to Constrain Corruption')"),
 "S104": ("Tech4Africa Johannesburg 2015 — schedule & directory", "Tech4Africa (sched.com)",
         "https://t4a2015.sched.com/2015-10-08/list/descriptions/",
         "2015-10-08", "Event directory", "Primary", "Moderate",
         "Tech4Africa Johannesburg 2015: '12 tracks, 4 event days including a Hackathon and a Startup Day' (8-11 Oct 2015 window); hackathon winners not identified in directory"),
 "S105": ("UJ students scoop top two places in G20 tourism challenge using AI", "TimesLIVE",
         "https://www.timeslive.co.za/news/south-africa/2025-10-08-uj-students-scoop-top-two-places-in-g20-tourism-challenge-using-ai/",
         "2025-10-08", "News article", "Secondary", "Strong",
         "G20 Tourism Hackathon: UJ students Teagon Spykerman (The Catalysts, 1st, Hologram Hub, R175k) and Inganathi Zimela (Map My Biz, 2nd, R140k); 46 young people from 21 universities; AI for job creation/sustainable tourism"),
 "S106": ("South African youth enthral at the Inaugural G20 Tourism Hackathon challenge", "Department of Tourism (gov.za)",
         "https://www.tourism.gov.za/AboutNDT/Branches1/domestic/News/Pages/South_African_youth_enthral_at_the_Inaugural_G20_Tourism_Hackathon_challenge.aspx",
         "2025", "Government news", "Primary", "Strong",
         "Inaugural G20 Tourism Hackathon launched June 2025 by Minister Patricia de Lille at University of the Western Cape; 46-48 youth, 21 institutions. 1st The Catalysts — R175k — members + institutions: Teagon Spykerman (UJ), Zinhle Methula (DUT), Innocentia Bongiwe Nkosi (University of Mpumalanga), Matshidiso Ralekholela (Independent Institute of Education), Morongwa Manamela (University of Pretoria), Tebogo Selepe (Vaal University of Technology), Khanyisa Mokgolobotho (Sefako Makgatho); 2nd Map My Biz R140k; 3rd Ubuntu Unlimited R105k; 4th-7th R35k per group"),
 "S107": ("Hackathon Challenge Success!", "University of Johannesburg",
         "https://news.uj.ac.za/news/hackathon-challenge-success-2/",
         "2020-11/12 (repost 2023-05-30)", "University news", "Primary", "Strong",
         "PAICTA × UJ Technopreneurship Centre virtual Hackathon Challenge: 1st Young Innovator's Tech — Daun Ramulongo, Saad Rahman, Lesego Legodi, Tshegofatso Motshwane, Peter Maphalla (R85k value); 2nd Green Hacklethes led by Yoosef Haffejee (R66k); 3rd Easy_Just led by Tinashe Makamure (R45k); Best Female Hacker Charity Ruvurashe Chichichi; Rising Star Makamure; GeekHack Star Haffejee (UJ students)"),
 "S108": ("Hackathon showcases innovators of the future", "ITWeb",
         "https://www.itweb.co.za/article/hackathon-showcases-innovators-of-the-future/KWEBbvyZGVb7mRjO",
         "2020-12-02", "News article", "Secondary", "Strong",
         "Corroborates PAICTA/UJ virtual hackathon: Young Innovators Tech win (agri app), R85k, UJ Technopreneurship development pipeline; mentors from CISCO, FNB, BMW, HERE Technologies, CSIR, Geekulcha, NMU etc."),
 "S109": ("Water and Sanitation on Hack4Water exhibition", "SA Government (gov.za)",
         "https://www.gov.za/speeches/dwss-hack4water-exhibition-brings-out-best-sas-hackers-22-apr-2016-0000",
         "2016-04-22", "Government news", "Primary", "Moderate",
         "DWS Hack4Water exhibition (two-day, 21-22 Apr 2016): ICT app challenge winners to be announced 22 April 2016; app winner names not stated in release"),
}

E2 = []
def ev2(**kw):
    kw.setdefault("alt", U); kw.setdefault("edition", U); kw.setdefault("start", U); kw.setdefault("end", U)
    kw.setdefault("city", U); kw.setdefault("province", U); kw.setdefault("venue", U); kw.setdefault("mode", "Physical")
    kw.setdefault("host", U); kw.setdefault("org", U); kw.setdefault("sponsors", U); kw.setdefault("theme", U)
    kw.setdefault("est", U); kw.setdefault("ver", U); kw.setdefault("fin", U); kw.setdefault("winners", U)
    kw.setdefault("web", U); kw.setdefault("results", U); kw.setdefault("partlist", U); kw.setdefault("archive", U)
    kw.setdefault("other", U); kw.setdefault("compl", "E"); kw.setdefault("notes", "")
    E2.append(kw)

ev2(id="E083", name="ITWeb Security Summit Hackathon (#SS22Hack)", edition="2022", year="2022", start="2022-06 (summit window)", city="Johannesburg",
    province="Gauteng", venue="Sandton Convention Centre", host="ITWeb Security Summit", org="Geekulcha (chairperson: Tiyani Nghonyama) + ITWeb",
    sponsors="Snode Technologies, Telspace, Custodiet Advisory Services", theme="Cybersecurity", winners="3 teams + CTF winner", compl="B",
    notes="Series naming: #SS<year>Hack = Security Summit Hackathon (confirmed via organiser posts and #SS24HACK coverage). 2022 champion team from Sol Plaatje University (Northern Cape residents; event in JHB).", src=["S91"])
ev2(id="E084", name="ITWeb Security Summit Hackathon (#SS23Hack)", edition="2023", year="2023", start="2023-06-06", end="2023-06-07", city="Johannesburg",
    province="Gauteng", venue="Sandton Convention Centre", host="ITWeb Security Summit", org="Geekulcha + ITWeb", sponsors="Snode, Startup Business Campus",
    theme="Cybersecurity", compl="D", notes="Winner identity not located this pass; 2024 coverage states Northern Cape participants triumphed 'for a second consecutive year' (implies NC win in 2023 — see unresolved).", src=["S92","S90"])
ev2(id="E085", name="ITWeb Security Summit Hackathon (#SS24Hack)", edition="2024", year="2024", city="Johannesburg", province="Gauteng", venue=U,
    host="ITWeb Security Summit", org="Geekulcha + ITWeb", sponsors="Snode, Telspace", theme="Generation Hacker: GenZ vs GenAI",
    est="500+ registrations", ver="57 participants (14 teams)", winners="2 named teams + CTF + special", compl="B",
    notes="Two conflicting CTF winner claims recorded (see contradiction log C08).", src=["S90"])
ev2(id="E086", name="ITWeb Security Summit Hackathon (#SSHACK26)", edition="2026", year="2026", city="Johannesburg", province="Gauteng", venue=U,
    host="ITWeb Security Summit", org="Geekulcha + ITWeb", sponsors="Snode, Subverted Academy", theme="Cybersecurity", compl="B", src=["S89"])
ev2(id="E087", name="ITWeb Security Summit Hackathon — Northern Cape edition (#SS25HACK)", edition="2025", year="2025", city="Kimberley", province="Northern Cape",
    venue="Sol Plaatje University (expected host venue)", host="NC Dept of Economic Development & Tourism + Sol Plaatje University",
    org="Geekulcha, CompTIA, Telspace Africa, Snode Technologies", theme="AI for cyber resilience", est="up to 50 participants (15 teams)", compl="E",
    notes="First verified Northern-Cape-venue hackathon in this census.", src=["S93"])
ev2(id="E088", name="GirlCodeHack", edition="2018 (5th annual)", year="2018", start="2018-08-03", end="2018-08-05", city="Johannesburg", province="Gauteng",
    host="GirlCode", sponsors="Cisco, AWS, BoxFusion, LGIT Smart Solutions", theme="Women in tech", winners="3 named teams", compl="C", src=["S84","S85"])
ev2(id="E089", name="Discovery GradHack", edition="2019", year="2019", host="Discovery", theme="Health", compl="C",
    notes="Winner documented only via participant self-report on public LinkedIn profile (Medium confidence).", src=["S88"])
ev2(id="E090", name="Discovery GradHack", edition="2022", year="2022", host="Discovery", theme="Emerging tech / insurance", compl="B", src=["S86"])
ev2(id="E091", name="Discovery GradHack", edition="2023 (virtual)", year="2023", start="2023-04-21", mode="Online (72h)", host="Discovery",
    theme="Digital identity / KYC", est="15 teams", compl="B", notes="All top-3 teams from Cape Town institutions.", src=["S87"])
ev2(id="E092", name="PAICTA × UJ Technopreneurship Centre Virtual Hackathon Challenge", edition="2020", year="2020", start="2020-11", end="2020-12", mode="Online",
    city="Johannesburg (host institution)", province="Gauteng", host="PAICTA + UJ Technopreneurship Centre",
    sponsors="Software AG, Siyafunda CTC, Mecer, Huawei, Deviare, Cisco Networking Academy, SAP", theme="Agriculture / everyday SA challenges",
    est="13 groups of 5-8 students", fin="13", winners="3 teams + 3 individual awards", compl="B", src=["S94","S107","S108"])
ev2(id="E093", name="Mpumalanga Artificial Intelligence Student Hackathon (Maish)", edition="2023", year="2023", city="Mbombela", province="Mpumalanga",
    host="University of Mpumalanga + Tshwane University of Technology", theme="AI for Africa's problems", compl="E",
    notes="First verified Mpumalanga-venue hackathon in this census; winners not located.", src=["S95"])
ev2(id="E094", name="Telkom 10X Hackathon — TUT eMalahleni leg", edition="2025", year="2025", start="2025 (36 hours)", city="eMalahleni", province="Mpumalanga",
    venue="TUT eMalahleni Campus", host="Telkom (10X) with TUT", org="Nkangala TVET College, Amdocs, Geekulcha",
    theme="Youth digital innovation (students + high-school learners)", winners="1 named team", compl="B",
    notes="Second verified Mpumalanga-venue event; winning team advanced to Telkom national hackathon.", src=["S96"])
ev2(id="E095", name="FinChatBot Hackathon", edition="2019 (first)", year="2019", start="2019-11", city="Johannesburg", province="Gauteng",
    venue="IBM Johannesburg", host="FinChatBot", sponsors="Budget Insurance (implementation)", theme="Insurtech / chatbots",
    est="11 teams", fin="11", winners="4 recognised teams", compl="B", src=["S98","S88"])
ev2(id="E096", name="UmojaHack Africa (Zindi inter-university hackathon)", edition="2021 (Mar and Dec editions)", year="2021", start="2021-03-27", end="2021-03-28",
    mode="Online", host="Zindi (African data-science competition platform; press release datelined Johannesburg)",
    sponsors="Microsoft, African Bank, Google AI, GIZ, Liquid Telecom, InstaDeep", theme="Data science / machine learning",
    est="1000+ students, 126 universities", winners="challenge-level winners incl. Stellenbosch University & UCT teams (SA)", compl="D",
    notes="Pan-African online event; SA relevance via organiser dateline, sponsors, SAEON challenge data and SA winning universities. Individual member names not published in located coverage.", src=["S100","S101"])
ev2(id="E097", name="SA Game Jam", edition="2018", year="2018", start="2018-08 (jam window)", host="Make Games South Africa", sponsors="Free Lives",
    theme="Game jam (national)", compl="D", notes="Annual national game jam with judged prizes; 2018 winners announced 8 Oct 2018 — winner names not yet extracted.", src=["S102"])
ev2(id="E098", name="HackCorruption South Africa", edition="2022", year="2022", start="2022-07 (hybrid event)", end="2022-10 (Johannesburg boot camp)",
    city="Johannesburg (boot camp)", province="Gauteng", mode="Hybrid", host="Accountability Lab", org="Center for International Private Enterprise; US State Dept INL",
    theme="Anti-corruption / tech4good", est="100 participants from 6 countries", winners="4 named teams (17 individuals)", compl="B",
    notes="Regional hybrid event with SA venue component (Johannesburg winners' boot camp); winners' nationalities not stated in source — not inferred.", src=["S103"])
ev2(id="E099", name="Tech4Africa Hackathon", edition="2015", year="2015", start="2015-10-08", end="2015-10-11", city="Johannesburg", province="Gauteng",
    host="Tech4Africa", theme="Startup / developer", compl="E",
    notes="Hackathon track confirmed within 4-day Tech4Africa 2015; earlier Tech4Africa hack days (2011-2014) still unverified.", src=["S104"])
ev2(id="E100", name="G20 Tourism Hackathon", edition="2025 (inaugural)", year="2025", start="2025-06 (launch at UWC)", end="2025-10 (winners announced)",
    city=U, province="National (multi-province; launch venue in Western Cape)", mode="Hybrid",
    host="Department of Tourism (Minister Patricia de Lille)", theme="AI for tourism (G20 SA presidency)",
    est="46-48 youth from 21 institutions", fin="7+ prize-winning groups", winners="3 named teams", compl="B",
    notes="Full 7-member winning team roster with institutions published by Department of Tourism.", src=["S105","S106"])

# Field overrides to Phase-1 event rows (from re-verification + new evidence)
UPD = {
 "E013": {"notes": "Nationwide challenge incl. video/idea competition + ICT app challenge at DWS exhibition; winners announced 22 Apr 2016 per gov.za — names still not located. hack4water.org.za existed (per code4sa blog).", "src": ["S18","S109"]},
 "E018": {"notes": "Long-form national coding competition (not a single-weekend hackathon) — included under 'coding challenge' scope. Full 2017 top-8 rankings captured (7th Andre Nel, 8th Mark-Anthony Fouche). Anesu Jairosi confirmed competing 'since Pacman' (earlier editions). Participation more than doubled vs prior year; year included internal mini-hackathons.", "compl": "B"},
 "E028": {"notes": "Winner VitaliTeam (SU): Mia Olivier, Kayleigh Koekemoer, Jaime Kruger, David Nicolay; project InsureShield (AI voice/text insurance-fraud detection); ~200 teams entered nationally, top 14 to virtual event; finals at Discovery HQ Sandton; R15k each + R50k to SU.", "est": "~200 teams entered; 14 finalists"},
 "E044": {"notes": "CONFIRMED: #SS19Hack is an edition of the ITWeb Security Summit Hackathon series (Geekulcha co-run; chairperson Tiyani Nghonyama) — series spans at least 2019, 2022, 2023, 2024, 2025 (incl. Northern Cape edition), 2026. IoT security theme; Kimberley-based 2nd-place team.", "host": "ITWeb Security Summit (series)"},
 "E055": {"notes": "Beat the Banker Hackathon — 23-24 May 2026, 36 hours, hosted by UFS IT Student Association (ITSA) with Standard Bank and BBD Software; four banking challenge areas; solo participant Sizwe Nkuna received a special additional prize from the judging panel.", "start": "2026-05-23", "end": "2026-05-24", "host": "UFS IT Student Association (ITSA)"},
 "E056": {"notes": "FS leg held 7 September 2025 at Botshabelo Digital Hub (CUT official); winners advanced to national finals in Johannesburg (results not located).", "start": "2025-09-07"},
 "E060": {"notes": "TVH 2025 (7th annual). Series evidence: 4th annual held 2022 with 110 hackers (TUT Faculty of ICT + AWS + City of Tshwane + AB4IR) → editions since 2019. 2025 partners: City of Tshwane, MTN SA, IQ Business, AWS, Nelekat; universities TUT/UP/UNISA/SMU; top-3 teams named as teams only.", "sponsors": "MTN SA, IQ Business, AWS, Nelekat, RMCERI"},
}

# Participation records — Phase 2
P2 = [
# Entelect 2017 additions (from organiser page re-fetch)
("E018","Andre Nel","Andre","","Nel","7","","","award=R10,000|src=S12|note=Distinct from Riaan Nel (2024 2nd) — no evidence they are the same person; kept separate per dedup rules"),
("E018","Mark-Anthony Fouche","Mark-Anthony","","Fouche","8","","","award=R10,000|src=S12"),
# Discovery GradHack 2022
("E090","Athir Fayker","Athir","","Fayker","1","","D-Tex (IoT/emerging-tech insurance solution)","uni=University of Cape Town (IS Honours)|src=S86"),
("E090","Furqaan Ajmoodien","Furqaan","","Ajmoodien","1","","D-Tex","uni=University of Cape Town (IS Honours)|src=S86"),
("E090","Goosain Allie","Goosain","","Allie","1","","D-Tex","uni=University of Cape Town (IS Honours)|src=S86"),
("E090","Kyle Poggenpoel","Kyle","","Poggenpoel","1","","D-Tex","uni=University of Cape Town (IS Honours)|src=S86"),
# Discovery GradHack 2023
("E091","James Clark","James","","Clark","1","Hackstreet Boys","Self-Sovereign Identity KYC solution","uni=University of Cape Town (4th-year IS)|src=S87"),
("E091","Max Coleman","Max","","Coleman","1","Hackstreet Boys","Self-Sovereign Identity KYC solution","uni=University of Cape Town (4th-year IS)|src=S87"),
("E091","Jack Scott-King","Jack","","Scott-King","1","Hackstreet Boys","Self-Sovereign Identity KYC solution","uni=University of Cape Town (4th-year IS)|src=S87"),
# Discovery GradHack 2019 (self-reported)
("E089","Thabang Mabula","Thabang","","Mabula","1","(2019 GradHack winning team)","(solution not described in source)","cid=Medium|cpl=Medium|src=S88|note=Self-reported on public LinkedIn profile ('Part of the winning team of the 2019 Gradhack hosted by Discovery Ltd'); corroborating organiser source not located"),
# #SS22Hack
("E083","Jabu Mahlangu","Jabu","","Mahlangu","Winner(special)","","","org=From Mpumalanga (per coverage)|award=Capture the Flag winner; Telspace Systems internship|src=S91"),
# #SS24Hack
("E085","Alex Dodd","Alex","","Dodd","Winner(special)","","","award=Future Hackers Award (youngest participants)|src=S90"),
("E085","Jivesh Ramnath","Jivesh","","Ramnath","Winner(special)","","","award=Future Hackers Award (youngest participants)|src=S90"),
# #SSHACK26
("E086","Lesoko Monyepao","Lesoko","","Monyepao","Winner(special)","","","uni=UNISA (Business Informatics)|award=Blue Teaming Capture the Flag winner|src=S89"),
("E086","Katlego Tsebe","Katlego","","Tsebe","Winner(special)","","","uni=UNISA (BSc Informatics)|award=Red Teaming Capture the Flag winner|src=S89"),
# Telkom 10X eMalahleni 2025
("E094","Matsobane Sethosa","Matsobane","","Sethosa","1","Technobytes","Gig Kasi (local-services marketplace app)","uni=Tshwane University of Technology (final-year Computer Science)|award=R20,000 + national entry|src=S96"),
# PAICTA × UJ 2020
("E092","Daun Ramulongo","Daun","","Ramulongo","1","Young Innovator's Tech","Interactive agri-sector app","uni=University of Johannesburg (Business Management & Administration)|award=Prize valued R85,000|src=S107,S108"),
("E092","Saad Rahman","Saad","","Rahman","1","Young Innovator's Tech","Interactive agri-sector app","uni=University of Johannesburg (BSc Computer Science)|award=Prize valued R85,000|src=S107,S108"),
("E092","Lesego Legodi","Lesego","","Legodi","1","Young Innovator's Tech","Interactive agri-sector app","uni=University of Johannesburg (BEng Electrical & Electronic Engineering)|award=Prize valued R85,000|src=S107,S108"),
("E092","Tshegofatso Motshwane","Tshegofatso","","Motshwane","1","Young Innovator's Tech","Interactive agri-sector app","uni=University of Johannesburg (Bachelor of Education)|award=Prize valued R85,000|src=S107,S108"),
("E092","Peter Maphalla","Peter","","Maphalla","1","Young Innovator's Tech","Interactive agri-sector app","uni=University of Johannesburg (BEd Senior & FET Teaching)|award=Prize valued R85,000|src=S107,S108"),
("E092","Yoosuf Haffejee","Yoosuf","","Haffejee","2","Green Hacklethes (team leader)","(second-prize solution)","uni=University of Johannesburg (BSc Computer Science & Informatics)|award=2nd prize (R66k value) + Best GeekHack Star|src=S107,S94|alias=Yoosef Haffejee|note=Both spellings appear in the same UJ article — treated as one person"),
("E092","Tinashe Makamure","Tinashe","","Makamure","3","Easy_Just (team leader)","(third-prize solution)","uni=University of Johannesburg (BEng Electrical & Electronic Engineering Science)|award=3rd prize (R45k value) + Rising Star award|src=S107,S94"),
("E092","Charity Ruvurashe Chichichi","Charity","Ruvurashe","Chichichi","Winner(special)","","","uni=University of Johannesburg (BSc IT in CS & Informatics)|award=Best Female Hacker (originality in thinking)|src=S107,S94"),
# FinChatBot Hackathon 2019
("E095","Ramashita Ramutloa","Ramashita","","Ramutloa","1","Aurora","Gamified insurance-education chatbot","org=EY (Senior Associate, Robotic Process Automation)|award=R10,000 + Budget Insurance implementation|src=S98"),
("E095","Joanne Moonsamy","Joanne","","Moonsamy","1","Aurora","Gamified insurance-education chatbot","org=Nedbank (Data Science Intern)|award=R10,000 + implementation|src=S98"),
("E095","Moses Shaba Jnr","Moses","Shaba Jnr","Shaba","1","Aurora","Gamified insurance-education chatbot","org=Nedbank (Data Science Intern)|award=R10,000 + implementation|src=S98"),
("E095","Rob Fairon","Rob","","Fairon","1","Aurora","Gamified insurance-education chatbot","org=Explore Data Science Academy (intern)|award=R10,000 + implementation|src=S98"),
("E095","Ebrahim Noormahomed","Ebrahim","","Noormahomed","1","Aurora","Gamified insurance-education chatbot","uni=Explore Data Science Academy (data science student)|award=R10,000 + implementation|src=S98"),
("E095","Thabang Mabula","Thabang","","Mabula","3","The Edge (per self-report)","Insurance trivia-pursuit chatbot game","cid=Medium|cpl=Medium|src=S88,S98|note=LinkedIn self-report places him in 3rd-place FinChatBot Hackathon team (Nov 2019); coverage names team 'The Edge' but not its members — membership probable, not fully verified"),
# HackCorruption SA 2022 (SA-relevant connection: winners' Johannesburg boot camp)
("E098","Amon Peter","Amon","","Peter","1","Team 3","(anti-corruption solution prototype)","note=Nationality not stated — not inferred; documented connection: winners' Johannesburg boot camp (Oct 2022)|src=S103"),
("E098","Baptista Joao","Baptista","","Joao","1","Team 3","(anti-corruption solution prototype)","note=Nationality not stated|src=S103"),
("E098","Farida Junior Kyababa","Farida","Junior","Kyababa","1","Team 3","(anti-corruption solution prototype)","note=Nationality not stated|src=S103"),
("E098","Linda McLeod","Linda","","McLeod","1","Team 3","(anti-corruption solution prototype)","note=Nationality not stated|src=S103"),
("E098","Saudai Sapi","Saudai","","Sapi","1","Team 3","(anti-corruption solution prototype)","note=Nationality not stated|src=S103"),
("E098","Kunda Sakala","Kunda","","Sakala","1","Team 7","(anti-corruption solution prototype)","note=Nationality not stated|src=S103"),
("E098","Nathan Chisanga","Nathan","","Chisanga","1","Team 7","(anti-corruption solution prototype)","note=Nationality not stated|src=S103"),
("E098","Nkina Ramonyai","Nkina","","Ramonyai","1","Team 7","(anti-corruption solution prototype)","note=Nationality not stated|src=S103"),
("E098","Samuel Wakumelo","Samuel","","Wakumelo","1","Team 7","(anti-corruption solution prototype)","note=Nationality not stated|src=S103"),
("E098","Eliud Luutsa","Eliud","","Luutsa","1","Team 14","(anti-corruption solution prototype)","note=Nationality not stated|src=S103"),
("E098","Maria Kauhondamwa","Maria","","Kauhondamwa","1","Team 14","(anti-corruption solution prototype)","note=Nationality not stated|src=S103"),
("E098","Matilda Mwendwa Gitonga","Matilda","Mwendwa","Gitonga","1","Team 14","(anti-corruption solution prototype)","note=Nationality not stated|src=S103"),
("E098","Wilbard Kangwiya","Wilbard","","Kangwiya","1","Team 14","(anti-corruption solution prototype)","note=Nationality not stated|src=S103"),
("E098","Baptiste Nardone","Baptiste","","Nardone","1","Team 14","(anti-corruption solution prototype)","note=Nationality not stated|src=S103"),
("E098","Angelic Mokoena","Angelic","","Mokoena","1","Team 22","Digital Citizenship to Constrain Corruption","note=Nationality not stated|src=S103"),
("E098","Lerato Tlhako","Lerato","","Tlhako","1","Team 22","Digital Citizenship to Constrain Corruption","note=Nationality not stated|src=S103"),
("E098","Lethabo Makopo","Lethabo","","Makopo","1","Team 22","Digital Citizenship to Constrain Corruption","note=Nationality not stated|src=S103"),
# G20 Tourism Hackathon 2025
("E100","Teagon Spykerman","Teagon","","Spykerman","1","The Catalysts","Hologram Hub (rural cultural-heritage tourism platform)","uni=University of Johannesburg (3rd-year Bachelor of Tourism Management & Development)|award=R175,000 first prize|src=S105,S106|alias=Teagon Sypkerman (TimesLIVE spelling variant)"),
("E100","Zinhle Methula","Zinhle","","Methula","1","The Catalysts","Hologram Hub","uni=Durban University of Technology|award=R175,000 first prize|src=S106"),
("E100","Innocentia Bongiwe Nkosi","Innocentia","Bongiwe","Nkosi","1","The Catalysts","Hologram Hub","uni=University of Mpumalanga|award=R175,000 first prize|src=S106"),
("E100","Matshidiso Ralekholela","Matshidiso","","Ralekholela","1","The Catalysts","Hologram Hub","uni=The Independent Institute of Education|award=R175,000 first prize|src=S106"),
("E100","Morongwa Manamela","Morongwa","","Manamela","1","The Catalysts","Hologram Hub","uni=University of Pretoria|award=R175,000 first prize|src=S106"),
("E100","Tebogo Selepe","Tebogo","","Selepe","1","The Catalysts","Hologram Hub","uni=Vaal University of Technology|award=R175,000 first prize|src=S106"),
("E100","Khanyisa Mokgolobotho","Khanyisa","","Mokgolobotho","1","The Catalysts","Hologram Hub","uni=Sefako Makgatho Health Sciences University|award=R175,000 first prize|src=S106"),
("E100","Inganathi Zimela","Inganathi","","Zimela","2","Map My Biz","Offline accredited learning + AI tools + global smart map for rural businesses","uni=University of Johannesburg (3rd-year Bachelor of Tourism Management & Development)|award=R140,000 second prize|src=S105,S106"),
]

# New unresolved identities (Phase 2)
UNRESOLVED2 = [
 ("U073","Hacker Agents (roster beyond 'SPU students')","ITWeb SS Hackathon #SS22Hack","Winning team described only as Sol Plaatje University students","ITWeb/Geekulcha originals; SPU news","S91"),
 ("U074","SecureIT (two UJ students)","ITWeb SS Hackathon #SS22Hack","2nd place + Best Female Hackers; names not published","ITWeb originals; UJ","S91"),
 ("U075","Cyber Smart Team (Mpumalanga)","ITWeb SS Hackathon #SS22Hack","3rd place; names not published","ITWeb originals","S91"),
 ("U076","Art-VeriAI (four SPU data science students)","ITWeb SS Hackathon #SS24Hack","1st place; member names not published","ITWeb originals; SPU","S90"),
 ("U077","Team Sudo SPU (roster)","ITWeb SS Hackathon #SS24Hack","2nd place + CTF win; names not published","ITWeb originals; SPU","S90"),
 ("U078","The Ethical Exploiters (roster)","ITWeb SS Hackathon #SS24Hack","CTF 1st place (per one claim); names not published","ITWeb originals","S90"),
 ("U079","Team Doria / Juveni Q / Siyabona (rosters)","ITWeb SS Hackathon #SSHACK26","Top-3 teams; member names not published","ITWeb originals","S89"),
 ("U080","Lightbulbs / Scatterlings of Africa / Durban 3rd-place team","GirlCodeHack 2018","Podium teams; member names not published","GirlCode socials; Cisco/AWS posts","S84"),
 ("U081","BroCode (UCT) & QWERTY (SU) rosters","Discovery GradHack 2023","Top-3 (2nd/3rd) teams; member names not published","UCT/SU news","S87"),
 ("U082","Green Hacklethes & Easy_Just full rosters","PAICTA × UJ Hackathon Challenge 2020","Only team leaders named (Haffejee, Makamure)","UJ originals","S107"),
 ("U083","Midnight Stack Overflow / The Edge / Qubit Mafia rosters","FinChatBot Hackathon 2019","2nd/3rd/4th teams; members not published (The Edge membership partially self-reported by T. Mabula)","FinChatBot/Budget posts","S98,S88"),
 ("U084","UmojaHack Africa SA-winning teams (SU, UCT)","UmojaHack Africa 2021","University-level attribution only; member names not published","Zindi leaderboard pages","S100,S101"),
 ("U085","SA Game Jam 2018 winners","SA Game Jam 2018","Judged winners announced Oct 2018; names not yet extracted","MakeGamesSA forum/itch pages","S102"),
 ("U086","Team SAMSYN / Team SIA / Team Fast 3","Absa Design Hackathon 2021","Top-5 teams; members not published","Absa originals","S47"),
 ("U087","Map My Biz & Ubuntu Unlimited (members beyond Zimela)","G20 Tourism Hackathon 2025","2nd/3rd team rosters truncated in coverage; Dept of Tourism page lists full roster — fetch pending","tourism.gov.za full page","S106,S105"),
 ("U088","Maish 2023 winners","Mpumalanga AI Student Hackathon","Winners not located","UMP/TUT newsrooms","S95"),
 ("U089","#SS23Hack winner (Northern Cape team)","ITWeb SS Hackathon #SS23Hack","2024 coverage implies NC won 2023; team/name unknown","ITWeb archive","S92,S90"),
 ("U090","#SS25HACK Kimberley winners","ITWeb SS Hackathon NC edition 2025","Results not located","Geekulcha/NC DEDAT posts","S93"),
 ("U091","Tech4Africa 2015 Hackathon winners","Tech4Africa Hackathon 2015","Hackathon track confirmed; winners not identified","t4a2015.sched directory; Wayback of tech4africa.com","S104"),
 ("U092","Technobytes (members beyond Sethosa)","Telkom 10X eMalahleni 2025","Winning team roster incomplete","TUT originals","S96"),
]

# Gap updates (by Gap_ID -> replacement fields) + new gaps
GAP_UPD = {
 "G002": {"description": "Discovery GradHack 2020 edition unverified (2019, 2022, 2023 resolved in Phase 2)", "records_missing": "2020 edition existence/results", "status": "Partially resolved"},
 "G003": {"description": "GirlCodeHack editions 2014/2015/2016/2019/2021/2023/2024 winners unknown (2018 resolved in Phase 2)", "records_missing": "7 editions' results", "status": "Partially resolved"},
 "G005": {"description": "Tshwane Varsity Hackathon: 2022 edition now evidenced (4th annual, 110 hackers); 2019-2021, 2023-2024 still unverified", "status": "Partially resolved"},
 "G013": {"description": "Mpumalanga venue coverage found in Phase 2 (Maish at UMP Mbombela 2023; Telkom 10X eMalahleni 2025; SS22 3rd-place team from Mpumalanga)", "status": "Partially resolved — venue-level coverage established; results still missing"},
 "G014": {"description": "Northern Cape venue coverage found in Phase 2 (#SS25HACK Kimberley 2025 at SPU); SPU teams won SS22/SS24 (JHB events)", "status": "Partially resolved — venue-level coverage established"},
}
GAPS2 = [
 ("G021","Series","ITWeb SS Hackathon editions before 2022 (e.g. #SS20Hack/#SS21Hack) unverified","Series confirmed 2019 (SS19), 2022-2026; interim years unknown","ITWeb Security Summit archives, Geekulcha galleries","Medium"),
 ("G022","Event","#SS23Hack winner identity unknown (Northern Cape team implied)","Winner name/team not located","ITWeb June 2023 archive","Medium"),
 ("G023","Event","G20 Tourism Hackathon 2nd/3rd team full rosters","Dept of Tourism page lists top-3 rosters; fetch incomplete this pass","Fetch tourism.gov.za page fully","High"),
 ("G024","Series","GradHack 2020 (COVID year) existence unknown","No coverage located","Discovery media archive","Low"),
 ("G025","Archive","Wayback snapshot of codebridge Hack4Water page located (20190907072855) but fetch failed (502) — C07 still open","Water Wardens/Wataware member names","Retry archive.org fetch / alternate snapshot","Medium"),
]
