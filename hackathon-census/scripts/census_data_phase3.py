# -*- coding: utf-8 -*-
"""SA Hackathon Census — Phase 3 additions (researched 2026-08-26).
Focus: Devpost/platform extraction, SS-series archaeology, G20 full rosters, game jams,
VacWork series, person-backward corroboration, §27 winner second-pass sampling."""

U = "Unknown"

SOURCES3 = {
 "S110": ("South African youth enthral at the Inaugural G20 Tourism Hackathon challenge (full page)", "Department of Tourism (gov.za)",
          "https://www.tourism.gov.za/AboutNDT/Branches1/domestic/News/Pages/South_African_youth_enthral_at_the_Inaugural_G20_Tourism_Hackathon_challenge.aspx",
          "2025-09-12", "Government news", "Primary", "Strong",
          "Full page fetch: finals at Sabi River Sun Resort, Sabie River valley, Mpumalanga, 10-11 Sep 2025; youth from 9 provinces; launched Jun 2025 at UWC with Future Leaders Challenge; in collaboration with Centre for Public Service Innovation and Geekulcha; top-3 presented at G20 Ministers' Meeting, Skukuza. FULL ROSTERS: The Catalysts (7); Map My Biz — Tshepiso Lebyane (UniVen), Inga Zamela (UJ), Janet De Graaf (International Hotel School), Lindelani Buhlenkosi Khunou (CPUT), Moses Mosuenyane (NWU), Kabelo Selopyane (TUT); Ubuntu Unlimited — Hishaam Langson (NMU), Thelma Makoma Rasekele (UNISA), Skhanyiso Dlamini (UNIZULU), Roos Moors (Eduvos), Mathapelo Ngubeni (CUT), Keotshepile Modise (SPU), Vusi Matlou (Eduvos)"),
 "S111": ("Virtual ITWeb Security Summit: seven keynotes / 'Hacking the virus'", "ITWeb",
          "https://itweb.africa/article/hacking-the-virus-at-itwebs-security-summit/rxP3jMBmNoR7A2ye",
          "2020-08-18", "News article", "Secondary", "Strong",
          "#SS20Hack: 'fourth annual instalment' of ITWeb Security Summit hackathon with Geekulcha; online 24-27 Aug 2020; theme: solutions for a post-COVID world ('hack the virus'); prizes R20k/R10k/R5k; Snode learnerships x4; Northern Cape leg led by NC Provincial Government (DEDAT) and Sol Plaatje University"),
 "S112": ("A Weekend of Code at Tshwane University of Technology Campus", "Nunn Innovation",
          "https://www.nunnovation.com/2015/07/29/a-weekend-of-code-at-tshwane-university-of-technology-campus/",
          "2015-07-29", "Community media", "Secondary", "Moderate",
          "36-hour hackathon at TUT campus (July 2015): 15 Geekulcha VacWork high-school learners participated (YSEN vouchers); Best Presenter among learners; winning campus-improvement solutions selected; prizes from Geekulcha, Microsoft and Intel; winner names not published"),
 "S113": ("The Work of Geekulcha (portfolio)", "Geekulcha (geekulcha.dev / gklink.co)",
          "https://www.geekulcha.dev/the-work?category=VacWork",
          "2026 (portfolio)", "Organiser portfolio", "Primary", "Moderate",
          "Geekulcha VacWork editions: Tshwane Jul 2014 (first, mLab at Innovation Hub); Tshwane Mar 2015; Siyabuswa (Mpumalanga) Jul 2015 (60 learners); Tshwane Oct 2015 (mixed with Tech4Africa); Johannesburg Mar 2016 (nanosatellites/healthcare); Giyani (Limpopo) May 2016; Tshwane Jul 2016; Soweto Dec 2016 ('Kasi App Lovers' voted best team at the second annual VacWork, Empowerment Zone). Programme-embedded competitive build challenges"),
 "S114": ("Service Delivery Ignite Hackathon (#IgniteHack) — Devpost", "Devpost",
          "https://ignitehack.devpost.com/",
          "2018", "Competition platform", "Primary", "Strong",
          "28-30 Sep 2018, UJ Kingsway Campus, Auckland Park, Johannesburg; DPSA + CPSI; with UJ, Geekulcha, Open Data SA; NDP-linked; 420 participants (200 cap); R306,000 prizes; two-round judging (Top 10 -> Top 3); prizes incl. Most Secure Solution, Best Female Star, Ultimate GeekStar, Best Presenter, post-hack support (5 teams); build-up events: Medical Hackathon Limpopo 17-18 Aug 2018; Northern Cape Provincial Hackathon in De Aar; OpenCampus at SPU/TUT Soshanguve/Pearson/TUT eMalahleni/UMP; winners on project-gallery page (extraction pending)"),
 "S115": ("Digital ID Hackathon — Southern Africa — Devpost", "Devpost",
          "https://hackid-southernafrica.devpost.com/",
          "2024-2025", "Competition platform", "Primary", "Moderate",
          "22 Nov 2024 - 9 Feb 2025; Johannesburg, South Africa (virtual+in-person per origin); Upanzi Network (CMU-Africa) + MicroSave Consulting; $10,000 prizes; Grand Prize + 1st Runner-up (laptops, CMU-Africa Industry Innovation Lab pre-incubation, ID4Africa 2025 Addis Ababa, paid Upanzi internships); 101 participants; regional winners not listed on landing page"),
 "S116": ("Forging the pan-African future of digital identity", "CMU-Africa (Carnegie Mellon)",
          "https://www.africa.engineering.cmu.edu/news/2025/06/13-digital-id.html",
          "2025-06-13", "University news", "Primary", "Moderate",
          "Digital ID Hackathon Africa: four regional hackathons (Southern Africa regional hosted with Johannesburg listing); top two teams per region won prizes; overall grand prize at ID4Africa AGM: Team Retro (Senegal); runner-up SmartTRAIS (CMU-Africa students, Rwanda); Southern Africa regional winning team names not stated in article"),
 "S117": ("UmojaHack Africa 2022 — challenge winner leaderboards", "Zindi",
          "https://zindi.africa/competitions/umojahack-africa-2022-advanced-challenge",
          "2022-03-20", "Competition platform", "Primary", "Moderate",
          "UmojaHack Africa 2022 (Sun 20 Mar 2022, virtual) winners by Zindi username — Advanced (snake antivenom): 1 ASSAZZIN, 2 mo5mami, 3 DanielBruintjies; Intermediate (insurance claims): 1 Lawrence_Moruye, 2 Team Solo, 3 Enemy of Syntax; Beginner (air-quality sensors): 1 Mdda, 2 Pynux, + HACK-DATA (Côte d'Ivoire), heritianadanielina (Madagascar). Platform usernames — real identities not published on page (pseudonym rule applies)"),
 "S118": ("ETHCapeTown Hackathon Recap (dTok)", "Stake Capital (Medium)",
          "https://medium.com/stakecapital/ethcapetown-hackathon-winners-168520fdefec",
          "2019-06-05", "Participant-generated", "Participant-generated", "Moderate",
          "ETHCapeTown (Cape Town; ETHGlobal-affiliated community hackathon): author's team built 'dTok', selected as a hackathon winner by ETHGlobal plus sponsor prizes (Raiden, MakerDAO, NuCypher); ~30 beds for hackers; author's name not stated in excerpt"),
 "S119": ("SA Game Jam set to return in November", "Games Industry Africa",
          "https://gamesindustryafrica.com/2022/10/23/sa-game-jam-set-to-return-in-november/",
          "2022-10-23", "Industry media", "Secondary", "Moderate",
          "SA Game Jam 2022 (November): Overall Winner R20,000; Student R10k; Hobbyist R10k; Diversity R10k; Best Art/Audio/Technical Excellence/Narrative/Physics R5k each"),
 "S120": ("The Winners of the 2023 Entelect Challenge Walk Away with R200 000 at Comic Con Africa", "MyBroadband",
          "https://mybroadband.co.za/news/industrynews/511140-the-winners-of-the-2023-entelect-challenge-walk-away-with-r200-000-at-comic-con-africa.html",
          "2023-10-11", "News article", "Secondary", "Strong",
          "2023 finals full order: 1 Purpose Katakwa R70k; 2 Kobus van Schoor R35k; 3 Anesu Jairosi R25k; 4 Willie Theron R25k (extends Phase-1 record which listed only top 3)"),
 "S121": ("Kobus van Schoor — CV (personal site)", "kobusvs.co.za (self-published CV)",
          "https://kobusvs.co.za/files/Kobus%20van%20Schoor%20-%20Resume.pdf",
          "2026 (CV)", "Public professional profile", "Participant-generated", "Moderate (corroborating)",
          "CV states 'Entelect Challenge 2022: 1st Place' and 'Winning AI Bot (Entelect Challenge)' — independent participant-side corroboration of the organiser-recorded 2022 championship; establishes personal professional website"),
 "S122": ("E-health startup wins $64k at #Hack.Jozi Challenge", "Bizcommunity",
          "https://www.bizcommunity.com/Article/196/708/145132.html",
          "2016-05-23", "News article", "Secondary", "Moderate",
          "Independent corroboration of Hack.Jozi 2016 results (Hutiri/Technovera top spot; 10 finalists) — §27 winner re-verification pass"),
 "S123": ("IDEMIA North America LinkedIn post (Security Summit hackathon)", "IDEMIA (LinkedIn)",
          "https://www.linkedin.com/posts/idemia-north-america_employeespotlight-weareidemia-lovewhereyouwork-activity-7087891472527605761-YG4B",
          "2023-07-20", "Partner social post", "Secondary", "Weak (contextual)",
          "Security Summit hackathon 'now in its seventh year' (2023), curated by ITWeb in partnership with Geekulcha, 6-7 June 2023 Sandton Convention Centre — consistent with #SS20Hack 'fourth annual' (2020): series began 2017 with editions through 2023 incl. 2021"),
}

E3 = []
def ev3(**kw):
    kw.setdefault("alt", U); kw.setdefault("edition", U); kw.setdefault("start", U); kw.setdefault("end", U)
    kw.setdefault("city", U); kw.setdefault("province", U); kw.setdefault("venue", U); kw.setdefault("mode", "Physical")
    kw.setdefault("host", U); kw.setdefault("org", U); kw.setdefault("sponsors", U); kw.setdefault("theme", U)
    kw.setdefault("est", U); kw.setdefault("ver", U); kw.setdefault("fin", U); kw.setdefault("winners", U)
    kw.setdefault("web", U); kw.setdefault("results", U); kw.setdefault("partlist", U); kw.setdefault("archive", U)
    kw.setdefault("other", U); kw.setdefault("compl", "E"); kw.setdefault("notes", "")
    E3.append(kw)

ev3(id="E101", name="ITWeb Security Summit Hackathon (#SS20Hack)", edition="2020 (4th annual)", year="2020", start="2020-08-24", end="2020-08-27", mode="Online",
    host="ITWeb Security Summit", org="Geekulcha", sponsors="Snode Technologies (learnerships)", theme="Post-COVID solutions ('hack the virus')",
    compl="D", notes="Northern Cape leg led by NC Provincial Government (DEDAT) + Sol Plaatje University. Winners not located.", src=["S111"])
ev3(id="E102", name="ITWeb Security Summit Hackathon — early/inferred editions", edition="2017, 2018, 2021 (consolidated probable)", year="2017-2021",
    host="ITWeb Security Summit", org="Geekulcha", compl="E",
    notes="Series arithmetic: 'fourth annual' in 2020 → began 2017; 'seventh year' in 2023 → 2021 edition existed (virtual-era). #SS19Hack (2019) recorded separately; #SS21Hack winner not located.", src=["S111","S123"])
ev3(id="E103", name="Service Delivery Ignite Hackathon (#IgniteHack)", edition="2018", year="2018", start="2018-09-28", end="2018-09-30",
    city="Johannesburg (Auckland Park)", province="Gauteng", venue="University of Johannesburg, Kingsway Campus",
    host="Department of Public Service and Administration (DPSA) + Centre for Public Service Innovation (CPSI)",
    org="University of Johannesburg; Geekulcha; Open Data South Africa", sponsors="NDP-linked",
    est="420 registered (200 cap)", theme="Youth Spark: service delivery", fin="Top 10 -> Top 3", compl="C",
    notes="Devpost-hosted; prizes R306k incl. Most Secure Solution, Best Female Star, Ultimate GeekStar, Best Presenter; winners listed on Devpost project gallery (extraction pending).", src=["S114"])
ev3(id="E104", name="IgniteHack build-up: Medical Hackathon Limpopo", edition="2018", year="2018", start="2018-08-17", end="2018-08-18", city=U,
    province="Limpopo", host="CPSI/DPSA (IgniteHack programme)", theme="Health / service delivery", compl="E", notes="Build-up event to #IgniteHack; winners not located.", src=["S114"])
ev3(id="E105", name="IgniteHack build-up: Northern Cape Provincial Hackathon", edition="2018", year="2018", city="De Aar", province="Northern Cape",
    host="CPSI/DPSA (IgniteHack programme)", theme="Service delivery", compl="E",
    notes="Second verified Northern-Cape-venue hackathon in this census; winners not located.", src=["S114"])
ev3(id="E106", name="Digital ID Hackathon — Southern Africa", edition="2024/25", year="2024", start="2024-11-22", end="2025-02-09", mode="Hybrid",
    city="Johannesburg (regional listing)", province="Gauteng", host="Upanzi Network (CMU-Africa) + MicroSave Consulting",
    theme="Digital identity use-cases", est="101 participants", compl="D",
    notes="One of four regional hackathons feeding a pan-African final (overall winner: Team Retro, Senegal; runner-up SmartTRAIS, Rwanda — both non-SA). Southern Africa regional winners not named in located sources.", src=["S115","S116"])
ev3(id="E107", name="ETHCapeTown", edition="2019", year="2019", city="Cape Town", province="Western Cape", host="ETHGlobal-affiliated community organisers",
    theme="Blockchain / Ethereum", compl="D", notes="Winning project 'dTok' (selected by ETHGlobal + sponsor prizes Raiden/MakerDAO/NuCypher); team members not named in located coverage.", src=["S118"])
ev3(id="E108", name="SA Game Jam", edition="2022", year="2022", start="2022-11 (jam window)", host="Make Games South Africa", theme="Game jam (national)", compl="D",
    notes="Prizes: Overall R20k; category prizes R5k-R10k. Winners not extracted yet.", src=["S119"])
ev3(id="E109", name="Geekulcha VacWork build challenges (series)", edition="2014-2016+ (consolidated)", year="2014-2016", mode="Physical (multiple venues)",
    city="Tshwane; Johannesburg; Soweto; Giyani; Siyabuswa", province="Gauteng; Limpopo; Mpumalanga",
    host="Geekulcha", theme="Youth vacation-work innovation challenges", compl="E",
    notes="Programme-embedded competitive builds; e.g. Soweto Dec 2016: 'Kasi App Lovers' voted best team. Edition-level winners largely unpublished; series row pending per-edition split.", src=["S113"])
ev3(id="E110", name="Geekulcha hackathon at TUT campus (weekend of code)", edition="2015", year="2015", start="2015-07 (36 hours)", city=U, province="Gauteng",
    venue="Tshwane University of Technology campus", host="Geekulcha (with TUT)", sponsors="Microsoft, Intel, YSEN", theme="Campus improvement",
    compl="D", notes="Winning solutions selected; Best Presenter among VacWork learners; names not published.", src=["S112"])
ev3(id="E111", name="UmojaHack Africa (Zindi)", edition="2022", year="2022", start="2022-03-20", mode="Online", host="Zindi",
    theme="Machine learning (beginner/intermediate/advanced tracks)", compl="D",
    notes="Winners published as Zindi platform usernames (e.g. ASSAZZIN, Lawrence_Moruye, DanielBruintjies, Mdda, Pynux) — pseudonymous per platform convention; not deanonymised per privacy rules.", src=["S117"])

# Overrides to earlier events
UPD3 = {
 "E010": {"src": ["S04","S05","S122"], "notes": "Mirrored by City of Cape Town per Disrupt Africa (separate edition not yet located). Winner re-verified in Phase 3 against Bizcommunity and TechFinancials (§27 second pass)."},
 "E021": {"notes": "'Now in its 11th year' per organiser (vs '13th year' claimed for 2024 by MyBroadband — see contradiction log). Phase 3: full 2023 order incl. Willie Theron 4th (R25k) captured.", "src": ["S14","S120"]},
 "E100": {"notes": "Finals at Sabi River Sun Resort, Sabie River valley, Mpumalanga, 10-11 Sep 2025; youth from all 9 provinces; launched Jun 2025 at UWC with Future Leaders Challenge; in collaboration with CPSI and Geekulcha; winners presented at G20 Ministers' Meeting, Skukuza. FULL top-3 rosters (20 named individuals with institutions) captured from Department of Tourism page.", "start": "2025-09-10", "end": "2025-09-11", "city": "Hazyview (Sabi River Sun Resort)", "province": "Mpumalanga", "org": "Centre for Public Service Innovation + Geekulcha (with Future Leaders Challenge)", "compl": "A"},
}

# New participation records (Phase 3)
P3 = [
# Entelect 2023 4th place (Phase-3 capture)
("E021","Willie Theron","Willie","","Theron","4","","","award=R25,000|src=S120"),
# G20 Tourism Hackathon — Map My Biz (2nd)
("E100","Tshepiso Lebyane","Tshepiso","","Lebyane","2","Map My Biz","Offline accredited learning + AI support + global smart map","uni=University of Venda|award=R140,000 second prize|src=S110"),
("E100","Inga Zamela","Inga","","Zamela","2","Map My Biz","Offline accredited learning + AI support + global smart map","uni=University of Johannesburg|award=R140,000 second prize|src=S110|alias=Inganathi Zimela|note=gov.za lists 'Inga Zamela'; TimesLIVE/UJ report 'Inganathi Zimela' for the same 2nd-place team — probable same person, conflicting renderings (contradiction log C12)"),
("E100","Janet De Graaf","Janet","","De Graaf","2","Map My Biz","Offline accredited learning + AI support + global smart map","uni=International Hotel School|award=R140,000 second prize|src=S110"),
("E100","Lindelani Buhlenkosi Khunou","Lindelani","Buhlenkosi","Khunou","2","Map My Biz","Offline accredited learning + AI support + global smart map","uni=Cape Peninsula University of Technology|award=R140,000 second prize|src=S110"),
("E100","Moses Mosuenyane","Moses","","Mosuenyane","2","Map My Biz","Offline accredited learning + AI support + global smart map","uni=North-West University|award=R140,000 second prize|src=S110"),
("E100","Kabelo Selopyane","Kabelo","","Selopyane","2","Map My Biz","Offline accredited learning + AI support + global smart map","uni=Tshwane University of Technology|award=R140,000 second prize|src=S110"),
# G20 Tourism Hackathon — Ubuntu Unlimited (3rd)
("E100","Hishaam Langson","Hishaam","","Langson","3","Ubuntu Unlimited","VR/AI/Web3 rural-tourism platform","uni=Nelson Mandela University|award=R105,000 third prize|src=S110"),
("E100","Thelma Makoma Rasekele","Thelma","Makoma","Rasekele","3","Ubuntu Unlimited","VR/AI/Web3 rural-tourism platform","uni=University of South Africa (UNISA)|award=R105,000 third prize|src=S110"),
("E100","Skhanyiso Dlamini","Skhanyiso","","Dlamini","3","Ubuntu Unlimited","VR/AI/Web3 rural-tourism platform","uni=University of Zululand|award=R105,000 third prize|src=S110"),
("E100","Roos Moors","Roos","","Moors","3","Ubuntu Unlimited","VR/AI/Web3 rural-tourism platform","uni=Eduvos|award=R105,000 third prize|src=S110"),
("E100","Mathapelo Ngubeni","Mathapelo","","Ngubeni","3","Ubuntu Unlimited","VR/AI/Web3 rural-tourism platform","uni=Central University of Technology|award=R105,000 third prize|src=S110"),
("E100","Keotshepile Modise","Keotshepile","","Modise","3","Ubuntu Unlimited","VR/AI/Web3 rural-tourism platform","uni=Sol Plaatje University|award=R105,000 third prize|src=S110"),
("E100","Vusi Matlou","Vusi","","Matlou","3","Ubuntu Unlimited","VR/AI/Web3 rural-tourism platform","uni=Eduvos|award=R105,000 third prize|src=S110"),
]

# Person-level overrides (applied to participation + people master): §8 profile corroboration
PERSON_UPD = {
 "kobus van schoor": {
   "Personal_Website": "https://kobusvs.co.za",
   "Profile_Match_Confidence": "High — personal CV states 'Entelect Challenge 2022: 1st Place' (two matching signals: name + competition result)",
   "Other_Profile_Note": "Personal professional website corroborates organiser-recorded 2022 championship (S121)",
 },
 "inganathi zimela": {
   "Alternative_Name_Spelling": "Inga Zamela (per gov.za roster)",
 },
}

UNRESOLVED3 = [
 ("U093","#IgniteHack 2018 top-3 winners + special-award winners","Service Delivery Ignite Hackathon 2018","Winners exist on Devpost project gallery; names not yet extracted","Fetch ignitehack.devpost.com/project-gallery","S114"),
 ("U094","Medical Hackathon Limpopo 2018 winners","IgniteHack build-up 2018","Winners not located","CPSI archives, Limpopo DOH media","S114"),
 ("U095","Northern Cape Provincial Hackathon (De Aar) winners","IgniteHack build-up 2018","Winners not located","NC provincial communications","S114"),
 ("U096","Digital ID Hackathon Southern Africa — regional winners","Digital ID Hackathon 2024/25","Regional top-2 teams not named in located coverage; global final won by Team Retro (Senegal)","Devpost gallery; CMU-Africa/Upanzi posts","S115,S116"),
 ("U097","ETHCapeTown 2019 winning team(s) (incl. 'dTok')","ETHCapeTown 2019","Project + prize documented; team members not named in excerpt","Full Medium article; Devpost/ETHGlobal archives","S118"),
 ("U098","UmojaHack Africa 2022 winners (Zindi usernames)","UmojaHack Africa 2022","Platform usernames only (ASSAZZIN, mo5mami, DanielBruintjies, Lawrence_Moruye, Team Solo, Enemy of Syntax, Mdda, Pynux) — not deanonymised per pseudonym rule","Zindi profiles only if users self-identify","S117"),
 ("U099","#SS20Hack (2020) winners","#SS20Hack","4th-annual edition; winners not located","ITWeb Aug 2020 archive","S111"),
 ("U100","SS-series 2017/2018/2021 winners","ITWeb SS Hackathon inferred editions","Winners not located","ITWeb archives 2017-2021","S111,S123"),
 ("U101","Kasi App Lovers (VacWork Soweto 2016 best team)","Geekulcha VacWork series","Team name captured; member names not published","Geekulcha galleries","S113"),
 ("U102","Geekulcha TUT weekend-of-code 2015 winning teams","Geekulcha hackathon at TUT 2015","Winning solutions referenced; names not published","Nunn Innovation follow-ups","S112"),
 ("U103","SA Game Jam winners (2018 and 2022 editions)","SA Game Jam","Judged winners announced but not yet extracted","MakeGamesSA forum, itch.io jam pages","S102,S119"),
]

UNRESOLVED_RESOLVED = {
 "U087": "Resolved in Phase 3 — full Map My Biz and Ubuntu Unlimited rosters captured from tourism.gov.za; members added to participation history (see also C12 spelling conflict)",
}

GAP_UPD3 = {
 "G016": {"description": "Devpost extraction started in Phase 3 (#IgniteHack 2018, Digital ID Hackathon, ETHCapeTown surfaced via platform); systematic gallery/leaderboard extraction still pending", "status": "Partially resolved"},
 "G021": {"description": "SS-series history established: began 2017 ('4th annual' 2020; '7th year' 2023); editions 2017/2018/2021 consolidated as probable; winners for pre-2022 editions unknown", "status": "Partially resolved"},
 "G025": {"description": "Wayback snapshot of codebridge Hack4Water page: 3 fetch attempts failed (2x 502, 1x 500) — evidence still snippet-based (C07)", "status": "Open — retry via alternate mirror"},
 "G009": {"description": "MICT SETA National Finals 2026: 3rd search pass — still only regional results public", "status": "Open"},
 "G022": {"description": "#SS23Hack winner: 3rd search pass — Ideathon 13 May 2023 + main event 6-7 June 2023 confirmed; winner name still not located", "status": "Open"},
}
GAPS3 = [
 ("G026","Series","SS-series 2017/2018/2021 winner records","Winners of the three probable early editions + #SS21Hack","ITWeb archive fetches","Medium"),
 ("G027","Platform","Devpost gallery extraction (IgniteHack 2018 project gallery; Digital ID gallery)","Winner team/individual names on platform pages","Direct gallery fetches","High"),
 ("G028","Person","Person-backward recursion (§18) executed for only ~6 of 309 people","Full recursion pass pending","Per-person queries","Medium"),
 ("G029","Profile","§8 public-profile discovery: only 1 of 309 people has an evidence-linked profile (Kobus van Schoor, personal CV)","Profile columns remain Unknown pending per-person verification","LinkedIn/GitHub/personal-site checks with 2+ signals","High"),
]
