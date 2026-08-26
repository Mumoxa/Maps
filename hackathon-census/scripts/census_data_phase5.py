# -*- coding: utf-8 -*-
"""SA Hackathon Census — Phase 5 additions (researched 2026-08-26).
Focus: zindi.world platform scan (user request), UmojaHack/ZindiWeekendz extraction,
IgniteHack per-project pages, confirmation-pass checks."""

U = "Unknown"

SOURCES5 = {
 "S128": ("Zindi platform scan — landing + competitions index", "Zindi (zindi.world)",
          "https://zindi.world/",
          "2026-08-26 (scan)", "Competition platform", "Primary", "Contextual",
          "zindi.world is the live Zindi platform: 100,000+ AI builders from 185+ countries, 590+ AI challenges, $1M+ prizes awarded; partners incl. Microsoft, Google, AWS, Google DeepMind, ITU. The /competitions index is JavaScript-loaded (no static enumeration); extraction done per competition page. Zindi runs hackathon formats: UmojaHack series and #ZindiWeekendz weekend sprints"),
 "S129": ("Meet the winners of the #ZindiWeekendz Urban Air Pollution Challenge", "Zindi",
          "https://zindi.africa/learn/meet-the-winners-of-the-zindiweekendz-the-urban-air-pollution-challenge",
          "2020-06-25", "Organiser publication", "Primary", "Moderate",
          "#ZindiWeekendz Urban Air Pollution (60-hour virtual hackathon, Apr 2020): 254 data scientists; winners 1st devnikhilmishra (India), 2nd Team Covidata (Tunisia), 3rd Klai (Tunisia) — no SA winners in top 3; re-opened as knowledge competition"),
 "S130": ("Meet the winners of the #ZindiWeekendz To Vaccinate or Not to Vaccinate challenge", "Zindi",
          "https://zindi.africa/learn/meet-the-winners-of-the-zindiweekendz-to-vaccinate-or-not-to-vaccinate-its-not-a-question-challenge",
          "2020", "Organiser publication", "Primary", "Moderate",
          "#ZindiWeekendz vaccination-sentiment challenge (60-hour virtual hackathon, 2020): 222 data scientists; winners 1st devnikhilmishra (India), 2nd Muhamed_Tuo (Côte d'Ivoire), 3rd Rajat_Ranjan (India) — no SA winners in top 3"),
 "S131": ("UmojaHack Africa 2023: CO2 Prediction (BEGINNER) — winners", "Zindi",
          "https://zindi.africa/competitions/umojahack-africa-2023-beginner-challenge",
          "2023-03-19", "Competition platform", "Primary", "Moderate",
          "UmojaHack Africa 2023 (18-19 Mar 2023): BEGINNER winners 1 Koleshjr, 2 Team Chocolatine, 3 Jamali_Adam (platform usernames); one-prize-per-university rule; teams up to 4 from same institution"),
 "S132": ("UmojaHack Africa 2023: Rubik's Cube RL (ADVANCED) — winners + country list", "Zindi",
          "https://zindi.africa/competitions/umojahack-africa-2023-advanced-challenge",
          "2023-03-19", "Competition platform", "Primary", "Moderate",
          "ADVANCED winners 1 Team TheSun/Nebu/Azzo, 2 Team PAYASS.io, 3 Team Pro Crusty Nation; INTERMEDIATE winners 1 Team DSTune, 2 Team Solo, 3 Team Chat_PPT. Country winners list includes 'South Africa: Olayile' (platform username — real identity not published; pseudonym rule applies)"),
 "S133": ("'Collaboration and networking at Zindi events is more powerful than prize money' — 2022 winner Victor Olufemi", "Zindi (Medium)",
          "https://zindi.medium.com/collaboration-and-networking-at-zindi-events-is-more-powerful-than-prize-money-c2028d19572c",
          "2023-03-16", "Organiser publication", "Primary", "Moderate",
          "UmojaHack Africa 2022 winner identified as Victor Olufemi (handle 'Professor'); interned with AirQo (UHA22 data sponsor) post-win. Nationality/SA-connection not stated — not inferred"),
 "S134": ("Meet the winners of UmojaHack #3: Hotspots Challenge", "Zindi",
          "https://zindi.africa/learn/meet-the-winners-of-umojahack-3-hotspots-challenge",
          "2020", "Organiser publication", "Primary", "Strong",
          "UmojaHack #3 (UmojaHack Africa, 21 March 2020 per this page): Hotspots Challenge — 624 entrants; 1st GFrost = Geoffrey Frost, FROM SOUTH AFRICA, final-year Electrical & Electronic Engineering student at Stellenbosch University (self-stated on Zindi profile context); 2nd Lawrence Moruye (Kenya); 3rd Brainiac (Kenya). NOTE: this page dates the event 21 March; the UmojaHack 2020 recap says 22 March (minor discrepancy logged)"),
 "S135": ("DeepHealth — Devpost project page (#IgniteHack 2018 submission)", "Devpost",
          "https://devpost.com/software/deephealth",
          "2018", "Competition platform", "Primary", "Moderate",
          "DeepHealth (end-to-end health management system; Django/Kotlin/TensorFlow/POPI-aware) started by Devpost user Mabu Manaileng ('started this project'). Page shows 4 likes — likes are NOT treated as team membership per census rules. No winner badge on page"),
 "S136": ("Comic Con Africa 2019 — Entelect Challenge finals coverage", "KeenGamer",
          "https://www.keengamer.com/articles/features/reportages/comic-con-africa-2019/",
          "2019-12-10 (published)", "Sector media", "Secondary", "Weak (contextual)",
          "Confirms 2019 Entelect Challenge game was 'Worms (or a strange mutation thereof)' and finals hosted at Comic Con Africa 2019; no finalist names in article"),
}

E5 = []
def ev5(**kw):
    kw.setdefault("alt", U); kw.setdefault("edition", U); kw.setdefault("start", U); kw.setdefault("end", U)
    kw.setdefault("city", U); kw.setdefault("province", U); kw.setdefault("venue", U); kw.setdefault("mode", "Physical")
    kw.setdefault("host", U); kw.setdefault("org", U); kw.setdefault("sponsors", U); kw.setdefault("theme", U)
    kw.setdefault("est", U); kw.setdefault("ver", U); kw.setdefault("fin", U); kw.setdefault("winners", U)
    kw.setdefault("web", U); kw.setdefault("results", U); kw.setdefault("partlist", U); kw.setdefault("archive", U)
    kw.setdefault("other", U); kw.setdefault("compl", "E"); kw.setdefault("notes", "")
    E5.append(kw)

ev5(id="E114", name="UmojaHack Africa (Zindi)", edition="2023", year="2023", start="2023-03-18", end="2023-03-19", mode="Online",
    host="Zindi", theme="Machine learning (beginner/intermediate/advanced tracks)", compl="D",
    notes="Challenge winners by platform username; country-winners list includes 'South Africa: Olayile' (username). One prize per university rule.", src=["S131","S132"])
ev5(id="E115", name="ZindiWeekendz virtual hackathons (series)", edition="2020- (consolidated sample)", year="2020", mode="Online",
    host="Zindi", theme="Weekend data-science sprints (48-60 hours)", compl="D",
    notes="Consolidated series row: two scanned editions (Urban Air Pollution, Apr 2020, 254 participants; Vaccination sentiment, 2020, 222 participants) had non-SA top-3 winners; full edition list and SA participant extraction pending (platform is JS-loaded; per-competition pages only).", src=["S129","S130","S128"])

UPD5 = {
 "E113": {"notes": "UmojaHack Africa 2020 (first pan-African edition; internally numbered UmojaHack #3, implying earlier #1/#2 events not yet identified — see gaps). Hotspots Challenge winner: Geoffrey Frost (South Africa; Stellenbosch University) — first fully-named SA UmojaHack winner. Date reported as 21 March (winners page) vs 22 March (recap) — minor discrepancy logged in evidence register.",
          "winners": "Hotspots Challenge: 1st Geoffrey Frost (SA)", "src": ["S126","S134"]},
 "E019": {"notes": "3rd place documented via participant blog (pseudonymous); 2019 game was 'Worms (or a strange mutation thereof)' per Comic Con Africa 2019 coverage; full rankings not located this pass.", "src": ["S16","S136"]},
 "E103": {"notes": "Devpost-hosted; prizes R306k incl. Most Secure Solution, Best Female Star, Ultimate GeekStar, Best Presenter; winners not labelled on gallery. Public gallery lists 4 submissions; DeepHealth creator identified as Mabu Manaileng (Phase 5). Build-up events recorded separately (E104, E105).", "src": ["S114","S135"]},
}

P5 = [
("E113","Geoffrey Frost","Geoffrey","","Frost","1","","Hotspots Challenge (burned-area prediction, DRC)","uni=Stellenbosch University (final-year Electrical & Electronic Engineering)|note='From South Africa' self-stated on Zindi winner page; Zindi handle GFrost|award=1st place, UmojaHack #3 Hotspots Challenge|src=S134"),
("E103","Mabu Manaileng","Mabu","","Manaileng","Participant","DeepHealth (project creator)","End-to-end health management system","src=S135|note='Started this project' on Devpost submission — project-creator evidence; other users shown on page (likes) deliberately NOT recorded as team members"),
]

UNRESOLVED5 = [
 ("U107","Olayile (platform username)","UmojaHack Africa 2023","South Africa country-winner per Zindi's country list; real identity not published","Zindi profile only if self-identified","S132"),
 ("U108","Victor Olufemi (aka 'Professor')","UmojaHack Africa 2022","Overall winner per Zindi interview; nationality/SA-connection not stated — inclusion as SA-connected pending evidence","Zindi interview follow-ups; AirQo posts","S133"),
 ("U109","UmojaHack Africa 2023 challenge winners (usernames)","UmojaHack Africa 2023","Koleshjr; Team Chocolatine; Jamali_Adam; Team TheSun/Nebu/Azzo; Team PAYASS.io; Team Pro Crusty Nation; Team DSTune; Team Solo; Team Chat_PPT — pseudonymous handles, not deanonymised","Zindi profiles only if self-identified","S131,S132"),
]

GAP_UPD5 = {
 "G016": {"description": "Devpost extraction: IgniteHack gallery scanned; DeepHealth creator identified (Mabu Manaileng); winner labels absent from gallery; per-project pages partially fetched", "status": "Partially resolved"},
 "G011": {"description": "Hack.Jozi 2017+: hackjozi.com confirmed NOT archived (Wayback availability API returned no snapshots); later-edition evidence still absent", "status": "Open — domain unarchived"},
}
GAPS5 = [
 ("G033","Platform","Zindi platform full enumeration not statically possible (JS app); SA-connected extraction limited to UmojaHack 2020-2023 + ZindiWeekendz sample; UmojaHack #1/#2 (pre-Mar 2020) unidentified","Earlier UmojaHack events and remaining UmojaHack editions (2024/2025) and SA participant leaderboards","zindi.world per-competition fetches; umojahack.africa archive","High"),
 ("G034","Person","SA-connected Zindi winners by username (e.g. 'Olayile', UHA23) require self-identification to resolve","Username-to-person linkage only with owner consent/public self-ID","Zindi profiles/interviews","Low — privacy-bound"),
]
