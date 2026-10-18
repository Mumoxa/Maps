# -*- coding: utf-8 -*-
"""SA Hackathon Census — Phase 4 additions (researched 2026-08-26).
Focus: Wayback breakthrough on Hack4Water (C07/G025 resolved), GirlCodeHack 2024,
UmojaHack 2020, IgniteHack gallery extraction, profile mini-pass."""

U = "Unknown"

SOURCES4 = {
 "S124": ("{code}bridge — Hack4Water hackathons (Wayback Machine snapshot, identity render)", "{code}bridge via web.archive.org",
          "http://web.archive.org/web/20190907072855id_/http://www.codebridge.co.za:80/allevents/hack4water-hackathons.html",
          "2016 (snapshot 2019-09-07)", "Organiser page (archived)", "Primary", "Strong",
          "FULL PARTICIPANT RECOVERY (resolves C07/G025): hackathons held 1-2 April 2016 in Cape Town ({code}bridge), Durban (The Green Door) and Pretoria (The Innovation Hub); challenge deadline 20 April; focus areas listed. Teams: Cape Town — Water Impacters (Yolanda, Chelsea Lewis, Adi Eyal, Raymond Joseph); The Source (Lindokuhle Sixabayi, Malyke, Charney Essack, Ashton Maherry, Rosalind Skelton, Shabier Jacobs, Wendy Samsodien); Water Apocalypse (Liesl Pretorius, Bobby Dean, Safiyyah Jacobs, Azraa Vally, Tracy-Anne Sikenjana); Wataware (Charles Rerhman, Bernelle Verster, Gordon, Laban Bagui, JD Bothma, Hendrik Schalekamp). Durban — Water Wardens (Heiko Heilgendorff, Bruce Page, Thuthukani Nxumalo, Johanna Singh, James Smith); Fix It (Justus Caspers, Sandile Nkomonde, Max Grau, Wiseman Mkhwanazi, Avanti Maharaj, James Smith); Power Shower (Sibusiso Mhlongo, Matthew Adendorff, Tricia Govindasamy); other participants (8 named). Pretoria — 21 names incl. Mpfumeri Baloyi, Jonathan Mayunga, Wishes"),
 "S125": ("GirlCode's first pan-African Hackathon tackles global pressing issues", "ITWeb",
          "https://www.itweb.co.za/article/girlcodes-first-pan-african-hackathon-tackles-global-pressing-issues/rW1xL75nYzPMRk6m",
          "2024-09-05", "News article", "Secondary", "Strong",
          "GirlCodeHack 2024 (10th annual, first pan-African): 31 Aug-1 Sep 2024 at MTN Group Headquarters; 10+ African cities; SDG theme; top-3 teams named as teams — PrincessCare (menstrual health buy-one-give-one), Binary Brains 1 (farm-produce web app), Hackers Squad (SDG 4 education); overall winner (trip to America) not stated in article; supporter Vuma; founder-CEO Zandile Mkwanazi (organiser, excluded from contestant records)"),
 "S126": ("Looking back at UmojaHack 2020", "Zindi (umojahack.africa)",
          "https://umojahack.africa/2021/03/01/umojahack-2020-one-thousand-data-scientists-join-hands-across-closed-borders/",
          "2021-03-01", "Organiser publication", "Primary", "Moderate",
          "UmojaHack Africa #1: Saturday 22 March 2020; 1000 students from 56 universities in 15 African countries; ~$20k prizes (Microsoft, African Bank, Google AI, GIZ, Liquid Telecom, InstaDeep et al.); winners from Stellenbosch University and University of Cape Town (SA) and SUPCOM (Tunisia) — individual names not published"),
 "S127": ("GALLERY: Meet the Hack Jozi Winners", "Citizen (Northcliff Melville Times)",
          "https://www.citizen.co.za/northcliff-melville-times/202513/meet-the-hack-jozi-winners/",
          "2015-07-09", "News article", "Secondary", "Moderate",
          "Desmond Mongwe: Java developer of 12 years; photo caption confirms MoWallet winner, Pieters runner-up; awards at Wits University 8 July 2015"),
}

E4 = []
def ev4(**kw):
    kw.setdefault("alt", U); kw.setdefault("edition", U); kw.setdefault("start", U); kw.setdefault("end", U)
    kw.setdefault("city", U); kw.setdefault("province", U); kw.setdefault("venue", U); kw.setdefault("mode", "Physical")
    kw.setdefault("host", U); kw.setdefault("org", U); kw.setdefault("sponsors", U); kw.setdefault("theme", U)
    kw.setdefault("est", U); kw.setdefault("ver", U); kw.setdefault("fin", U); kw.setdefault("winners", U)
    kw.setdefault("web", U); kw.setdefault("results", U); kw.setdefault("partlist", U); kw.setdefault("archive", U)
    kw.setdefault("other", U); kw.setdefault("compl", "E"); kw.setdefault("notes", "")
    E4.append(kw)

ev4(id="E112", name="GirlCodeHack", edition="2024 (10th annual — first pan-African)", year="2024", start="2024-08-31", end="2024-09-01",
    city="Johannesburg (MTN Group HQ; 10+ African cities)", province="Gauteng", venue="MTN Group Headquarters", mode="Hybrid",
    host="GirlCode", sponsors="Vuma (supporter); MTN (venue)", theme="Harnessing technology for the SDGs", fin="3 named teams", compl="C",
    notes="First pan-African edition. Top-3 teams named as teams; overall winner (US trip) not stated in located coverage.", src=["S125"])
ev4(id="E113", name="UmojaHack Africa (Zindi)", edition="2020 (first edition)", year="2020", start="2020-03-22", mode="Online",
    host="Zindi", sponsors="Microsoft, African Bank, Google AI, GIZ, Liquid Telecom, InstaDeep", theme="Machine learning (inter-university)",
    est="1000 students from 56 universities (15 countries)", compl="D",
    notes="SA relevance: organiser platform and sponsors; winning universities incl. Stellenbosch University and UCT (SA). Individual names unpublished.", src=["S126"])

UPD4 = {
 "E012": {"start": "2016-04-01", "end": "2016-04-02", "compl": "A", "archive": "http://web.archive.org/web/20190907072855id_/http://www.codebridge.co.za:80/allevents/hack4water-hackathons.html",
          "ver": "68 named participants (4 CT teams, 3 DBN teams, 8 others, 21 PTA)",
          "notes": "FULLY RESOLVED via Wayback identity render (Phase 4): hackathons 1-2 April 2016 at {code}bridge CT / The Green Door DBN / Innovation Hub PTA; four Cape Town teams fully rostered (Water Impacters, The Source, Water Apocalypse, Wataware); three Durban teams (Water Wardens, Fix It, Power Shower); 8 other participants; 21 Pretoria names. Challenge deadline 20 Apr 2016; local hackathons produced challenge submissions (no local winners declared on organiser page).",
          "src": ["S124","S17","S18"]},
 "E103": {"notes": "Devpost-hosted; prizes R306k incl. Most Secure Solution, Best Female Star, Ultimate GeekStar, Best Presenter; winners not labelled on gallery. Public project gallery lists 4 submissions: DeepHealth, KEAPHELA, Algebrax, Khuluma App (teams unnamed on gallery). Build-up events recorded separately (E104, E105)."},
}

# New participation records (Phase 4) — Hack4Water roster recovery
P4 = [
# Cape Town — Team The Source
("E012","Lindokuhle Sixabayi","Lindokuhle","","Sixabayi","Participant","Team The Source","Where does your water come from?","src=S124"),
("E012","Malyke (single name published)","Malyke","","Unknown","Participant","Team The Source","Where does your water come from?","cid=Low|src=S124|note=Single-name listing on organiser roster"),
("E012","Charney Essack","Charney","","Essack","Participant","Team The Source","Where does your water come from?","src=S124"),
("E012","Ashton Maherry","Ashton","","Maherry","Participant","Team The Source","Where does your water come from?","src=S124"),
("E012","Rosalind Skelton","Rosalind","","Skelton","Participant","Team The Source","Where does your water come from?","src=S124"),
("E012","Shabier Jacobs","Shabier","","Jacobs","Participant","Team The Source","Where does your water come from?","src=S124"),
("E012","Wendy Samsodien","Wendy","","Samsodien","Participant","Team The Source","Where does your water come from?","src=S124"),
# Cape Town — Team Water Apocalypse
("E012","Liesl Pretorius","Liesl","","Pretorius","Participant","Team Water Apocalypse","What happens when the water runs out?","src=S124"),
("E012","Bobby Dean","Bobby","","Dean","Participant","Team Water Apocalypse","What happens when the water runs out?","src=S124"),
("E012","Safiyyah Jacobs","Safiyyah","","Jacobs","Participant","Team Water Apocalypse","What happens when the water runs out?","src=S124"),
("E012","Azraa Vally","Azraa","","Vally","Participant","Team Water Apocalypse","What happens when the water runs out?","src=S124"),
("E012","Tracy-Anne Sikenjana","Tracy-Anne","","Sikenjana","Participant","Team Water Apocalypse","What happens when the water runs out?","src=S124"),
# Cape Town — Team Wataware
("E012","Charles Rerhman","Charles","","Rerhman","Participant","Team Wataware","Comparing your water usage with your neighbourhood's","src=S124"),
("E012","Bernelle Verster","Bernelle","","Verster","Participant","Team Wataware","Comparing your water usage with your neighbourhood's","src=S124"),
("E012","Gordon (single name published)","Gordon","","Unknown","Participant","Team Wataware","Comparing your water usage with your neighbourhood's","cid=Low|src=S124|note=Single-name listing on organiser roster"),
("E012","Laban Bagui","Laban","","Bagui","Participant","Team Wataware","Comparing your water usage with your neighbourhood's","src=S124"),
("E012","JD Bothma","JD","","Bothma","Participant","Team Wataware","Comparing your water usage with your neighbourhood's","src=S124"),
("E012","Hendrik Schalekamp","Hendrik","","Schalekamp","Participant","Team Wataware","Comparing your water usage with your neighbourhood's","src=S124"),
# Durban — Team Power Shower
("E012","Sibusiso Mhlongo","Sibusiso","","Mhlongo","Participant","Team Power Shower","Save the water wasted while you wait for your shower to warm up","src=S124"),
("E012","Matthew Adendorff","Matthew","","Adendorff","Participant","Team Power Shower","Save the water wasted while you wait for your shower to warm up","src=S124"),
("E012","Tricia Govindasamy","Tricia","","Govindasamy","Participant","Team Power Shower","Save the water wasted while you wait for your shower to warm up","src=S124"),
# Pretoria additions from full table
("E012","Mpfumeri Baloyi","Mpfumeri","","Baloyi","Participant","","","src=S124"),
("E012","Wishes (single name published)","Wishes","","Unknown","Participant","","","cid=Low|src=S124|note=Single-name listing; organiser table lists 'Wishes' separately from 'Jonathan Mayunga'"),
]

# Notes appended to existing Phase-1 rows (roster reconciliation)
P_NOTE_FIXES = {
 "Jonathan Mayunga Wishes": "Organiser table (Wayback) lists 'Jonathan Mayunga' and 'Wishes' as separate rows — possibly two individuals; kept merged here pending verification (see U107)",
 "Yolanda (single name published)": "Team name confirmed as Team Water Impacters via Wayback roster (S124)",
}

UNRESOLVED4 = [
 ("U104","PrincessCare / Binary Brains 1 / Hackers Squad (rosters)","GirlCodeHack 2024","Top-3 teams named; member names and finishing order not published","GirlCode socials; MTN/Vuma posts; follow-up ITWeb winner article","S125"),
 ("U105","UmojaHack Africa 2020 SA-winning teams (SU, UCT)","UmojaHack Africa 2020","University-level attribution only","Zindi leaderboards (usernames only — pseudonym rule)","S126"),
 ("U106","DeepHealth / KEAPHELA / Algebrax / Khuluma App (teams)","#IgniteHack 2018","4 public Devpost submissions; team member names not on gallery","Per-project Devpost pages","S114"),
]

UNRESOLVED_RESOLVED4 = {
 "U072": "Resolved in Phase 4 — Wayback identity render recovered full rosters for Water Wardens and Team Wataware (Cape Town) plus Team Power Shower; all Hack4Water participants now recorded in participation history",
}

GAP_UPD4 = {
 "G025": {"description": "RESOLVED: Wayback identity render (…2855id_/…) returned the full Hack4Water page; archived URL recorded on E012; evidence upgraded from snippet to full-page capture", "status": "Resolved (2026-08-26)"},
 "G003": {"description": "GirlCodeHack editions 2014/2015/2016/2019/2021/2023 winners unknown (2018, 2022, 2024, 2025 now covered)", "status": "Partially resolved"},
 "G027": {"description": "Devpost gallery extraction: IgniteHack gallery lists 4 public submissions without winner labels; per-project pages pending", "status": "Partially resolved"},
}
GAPS4 = [
 ("G030","Event","GirlCodeHack 2024 finishing order (which of the top-3 teams won the US trip)","Overall winner not stated in ITWeb coverage","GirlCode announcements; winner's own posts","Medium"),
 ("G031","Person","Hack4Water roster reconciliation: 'Jonathan Mayunga' vs 'Wishes' vs merged record","Possibly two individuals merged on one row","Wayback roster (already captured) — decide via any secondary mention","Low"),
 ("G032","Era","Pre-2013 hunt (Tech4Africa 2011-2014 hack days; AngelHack JHB/CPT; RHoK 2010-2011)","4 search attempts, no SA evidence yet — may not survive on the public web","Wayback of tech4africa.com; mailing-list archives","Medium"),
]

PERSON_UPD4 = {
 "desmond mongwe": {
   "Other_Profile_Note": "Described as a Java developer of 12 years' experience at time of win (Citizen, 2015) — profession recorded from coverage; no profile URL attached",
 },
}
