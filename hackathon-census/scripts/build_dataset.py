# -*- coding: utf-8 -*-
"""Builds the 7 census CSVs from census_data_sources.py + census_data_people.py and prints QA stats.
Phase 1 build date: 2026-08-26. U = Unknown / Not publicly verified."""
import csv, os, re, sys
sys.path.insert(0, os.path.dirname(__file__))
from census_data_sources import SOURCES, E, U
from census_data_people import P

OUT = os.path.join(os.path.dirname(__file__), "..", "data")
os.makedirs(OUT, exist_ok=True)
TODAY = "2026-08-26"

def extra_parse(extra):
    d = {}
    if extra:
        for part in extra.split("|"):
            if "=" in part:
                k, v = part.split("=", 1)
                d[k.strip()] = v.strip()
    return d

def src_urls(ids):
    return " ; ".join(SOURCES[s][2] for s in ids if s in SOURCES) if ids else U

def placement_flags(pl):
    p = pl.strip()
    top3 = top10 = win = "No"
    if p == "1": win = top3 = top10 = "Yes"
    elif p in ("2", "3", "Top3"): top3 = top10 = "Yes"
    elif p == "Winner(special)": win = "Yes"  # special-prize/category winner; no ranked placement
    elif p in ("4", "5", "6", "7", "8", "9", "10", "Top10"): top10 = "Yes"
    # "Qualified", "Participant", "Finalist" -> no ranked placement flags
    return top3, top10, win

def placement_label(pl):
    p = pl.strip()
    if p.isdigit():
        suffix = {1:"st",2:"nd",3:"rd"}.get(int(p), "th")
        return p + suffix
    return p

# ---------- People master + participation ----------
_CONF_RANK = {"Low": 0, "Medium": 1, "High": 2}
people = {}   # key -> person dict
part_rows = []
pid_counter = 0
pid_for_key = {}
for (eid, full, first, middle, surname, pl, team, project, extra) in P:
    x = extra_parse(extra)
    key = re.sub(r"\s+", " ", full.strip().lower())
    if key not in pid_for_key:
        pid_counter += 1
        pid_for_key[key] = f"P{pid_counter:04d}"
        people[key] = dict(person_id=pid_for_key[key], full=full, first=first, middle=middle or U,
                           surname=surname or U, org=x.get("org", U), uni=x.get("uni", U),
                           note=[], count=0, srcs=set(), min_conf="High")
    person = people[key]
    person["count"] += 1
    row_conf = x.get("cid", "High")
    if _CONF_RANK.get(row_conf, 2) < _CONF_RANK.get(person["min_conf"], 2):
        person["min_conf"] = row_conf
    if x.get("org") and x["org"] != U: person["org"] = x["org"]
    if x.get("uni") and x["uni"] != U: person["uni"] = x["uni"]
    if x.get("note"): person["note"].append(x["note"])
    if x.get("alias"): person["note"].append("Name variant/alias: " + x["alias"])
    ev = next(e for e in E if e["id"] == eid)
    srcs = [ev["src"][0]] + [s.strip() for s in x.get("src", "").split(",") if s.strip()]
    person["srcs"].update(srcs)
    top3, top10, win = placement_flags(pl)
    part_rows.append({
        "Person_ID": person["person_id"], "First_Name": first or U, "Middle_Name": middle or U,
        "Surname": surname or U, "Full_Name_As_Published": full,
        "Alternative_Name_Spelling": x.get("alias", U),
        "Hackathon_Name": ev["name"], "Hackathon_Edition": ev["edition"], "Event_Year": ev["year"],
        "Event_Date": ev["start"] if ev["start"] != U else ev["year"],
        "City": ev["city"], "Province": ev["province"], "Venue_or_Online": (ev["venue"] + " [" + ev["mode"] + "]") if ev["venue"] != U else ev["mode"],
        "Team_Name": team or U, "Project_Name": project or U,
        "Participation_Status": "Competitor (result documented)" if pl not in ("Participant",) else "Participant",
        "Placement": placement_label(pl), "Award_or_Category": x.get("award", U),
        "Top_3": top3, "Top_10": top10, "Winner": win,
        "Organisation_At_Time": x.get("org", U), "University_At_Time": x.get("uni", U),
        "LinkedIn_URL": U, "GitHub_URL": U, "Devpost_URL": U, "HackerEarth_URL": U, "Kaggle_URL": U,
        "Personal_Website": U, "X_Twitter_URL": U, "Other_Public_Profile_URLs": U,
        "Primary_Evidence_URL": SOURCES[ev["src"][0]][2],
        "Secondary_Evidence_URL": src_urls(x.get("src", "").split(",")) if x.get("src") else U,
        "Additional_Evidence_URLs": U,
        "Identity_Confidence": x.get("cid", "High"),
        "Placement_Confidence": x.get("cpl", "High"),
        "Profile_Match_Confidence": "Not assessed — profile discovery pass pending",
        "Research_Notes": x.get("note", ""),
        "Date_Verified": TODAY,
    })

# ---------- Hackathon master ----------
ev_rows = []
for e in E:
    ev_rows.append({
        "Event_ID": e["id"], "Official_Event_Name": e["name"], "Alternative_Event_Names": e["alt"],
        "Edition": e["edition"], "Year": e["year"], "Start_Date": e["start"], "End_Date": e["end"],
        "City": e["city"], "Province": e["province"], "Venue": e["venue"], "Online_Hybrid_Physical": e["mode"],
        "Host": e["host"], "Organisers": e["org"], "Sponsors": e["sponsors"], "Industry_or_Theme": e["theme"],
        "Estimated_Participant_Count": e["est"], "Verified_Participant_Count": e["ver"],
        "Number_of_Finalists": e["fin"], "Number_of_Winners": e["winners"],
        "Official_Website": e["web"], "Results_URL": e["results"] if e["results"] != U else src_urls(e["src"]),
        "Participant_List_URL": e["partlist"] if e["partlist"] != U else (src_urls(e["src"]) if e["id"] in ("E012",) else U),
        "Archive_URL": e["archive"], "Other_Sources": src_urls(e["src"]),
        "Completeness_Status": e["compl"], "Research_Notes": e["notes"], "Date_Verified": TODAY,
    })

# ---------- Evidence register ----------
ev_by_src = {}
for e in E:
    for s in e["src"]:
        ev_by_src.setdefault(s, []).append(e["id"])
person_by_src = {}
for k, v in people.items():
    for s in v["srcs"]:
        person_by_src.setdefault(s, []).append(v["person_id"])
evid_rows = []
for i, (sid, (title, pub, url, date, stype, pors, strength, excerpt)) in enumerate(sorted(SOURCES.items()), 1):
    evid_rows.append({
        "Evidence_ID": f"EV{i:04d}", "Person_ID": " ; ".join(sorted(set(person_by_src.get(sid, [])))[:12]) or U,
        "Event_ID": " ; ".join(sorted(set(ev_by_src.get(sid, [])))) or U,
        "Claim_Supported": excerpt[:180], "Source_Title": title, "Source_Publisher": pub, "Source_URL": url,
        "Publication_Date": date, "Source_Type": stype, "Primary_or_Secondary": pors,
        "Archived_URL": U, "Date_Accessed": TODAY,
        "Relevant_Excerpt_or_Summary": excerpt, "Evidence_Strength": strength,
    })

# ---------- Unresolved identities (named teams/people pending member-level resolution) ----------
UNRESOLVED = [
 ("U001","Diepkloof Kasi Hive","Hack.Jozi Challenge 2015","Top-10 finalist team; members never published in located coverage","Search team name, JCSE/Tshimologong archives, LinkedIn","S02"),
 ("U002","i-Tea","Hack.Jozi Challenge 2015","Top-10 finalist team; members never published","Search team name, archived coverage","S02"),
 ("U003","Atinov","Hack.Jozi Challenge 2015","Top-10 finalist team; members never published","Search team name","S02"),
 ("U004","Ghost (team)","Hack.Jozi Challenge 2015","Top-10 finalist team; members never published","Search team name","S02"),
 ("U005","Tirisan Tech Solutions","Hack.Jozi Challenge 2015","Top-10 finalist team; members never published","Search team name","S02"),
 ("U006","South African Trade Solutions","Hack.Jozi Challenge 2015","Top-10 finalist team; members never published","Search team name","S02"),
 ("U007","How2Get2","Hack.Jozi Challenge 2015","Top-10 finalist team; members never published","Search team name","S02"),
 ("U008","Hack.Jozi 2016 top-10 non-winning finalists (9 teams)","Hack.Jozi Challenge 2016","Top-10 finalist team names not published in located coverage","Obtain finalist list (CoJ/JCSE archives, Wayback)","S04"),
 ("U009","Grapes (team)","GirlCodeHack 2017","2nd place team; members not published","Search '#GirlCodeHack 2017 Grapes', organiser socials","S07"),
 ("U010","Techtress (team)","GirlCodeHack 2017","3rd place team (Kgosigadi app); members not published","Search team + app name","S07"),
 ("U011","NTV (team)","GirlCodeHack 2022","Winning team; members not published","GirlCode socials, Takealot announcements","S09"),
 ("U012","Hack-Gen (team)","GirlCodeHack 2022","2nd place team; members not published","As above","S09"),
 ("U013","Hack Invasion Girls (team)","GirlCodeHack 2022","3rd place team; members not published","As above","S09"),
 ("U014","TechGurlies / Tech Gullies (team)","GirlCodeHack 2025","JHB city winner + continental 2nd; member names not published; two spellings across sources (contradiction logged)","Search team name across ITWeb/Absa/GirlCode posts","S10,S11"),
 ("U015","Ndlela (team)","GirlCodeHack 2025","Cape Town city winner (AI Career Coach); members not published","Search team name","S10"),
 ("U016","CyberShield Africa (team)","GirlCodeHack 2025","Durban city winner (Rural Cyber App); members not published","Search team name","S10"),
 ("U017","Khululeka team — full roster","#SS19Hack 2019","Winning team; photo caption lists names but may include sponsor/judge representatives; Ivan Regasek affiliation ambiguous","Original ITWeb photo; organiser records","S45"),
 ("U018","Dumela (Kimberley team)","#SS19Hack 2019","2nd place; members not published","Northern Cape media, organiser socials","S45"),
 ("U019","True Author (team)","#SS19Hack 2019","3rd place (Watchr); members not published","Search team name","S45"),
 ("U020","Red team / Blue team (JHB CTF)","#SS19Hack 2019","CTF 1st/2nd; members not published","As above","S45"),
 ("U021","Zaka (developers)","MTN MoMo API Hackathon 2023","1st place; developer names not published in located coverage","MTN MoMo press, LinkedIn dev community posts","S44"),
 ("U022","Tataimali / Tata Imali (developers)","MTN MoMo API Hackathon 2023","2nd place; developer names not published","As above","S44"),
 ("U023","MoLo (developers)","MTN MoMo API Hackathon 2023","3rd place; developer names not published","As above","S44"),
 ("U024","The Blue Marble (Space Decode)","NASA Space Apps SA 2013","Local award project; members not published","2013 Space Apps project pages, GitHub","S22"),
 ("U025","Solar system simulator team","NASA Space Apps SA 2013","Local award project (Database of Near Earth Objects); members not published","As above","S22"),
 ("U026","Augmented Solar System team","NASA Space Apps SA 2013","Local award project (Reach for the Stars); members not published","As above","S22"),
 ("U027","SmartT Resources team","NASA Space Apps SA 2013","Local award project (Smart Cities & Smart Climate); members not published","As above","S22"),
 ("U028","Geekulcha electronics-app team (RHoK PTA)","RHoK Pretoria 2014","1st place solution; member names not published","mLab/Geekulcha archives","S19"),
 ("U029","UNISA MyCampus Buildings team","RHoK Pretoria 2014","2nd place; members not published","As above","S19"),
 ("U030","P-STEM portal team","RHoK Pretoria 2014","3rd place; members not published","As above","S19"),
 ("U031","ECTracker team members (beyond Farah Jawitz)","Hacking Health Cape Town 2014","Winner 'team led by' Jawitz; other members not published","UCT IHI archives, team members' profiles","S23"),
 ("U032","Pulse runner-up team(s)","#GovHackSA 2014","Runner-up(s) unnamed (Lean Startup voucher prize)","mLab blog archives","S24"),
 ("U033","UJ ACSSE GradHack 2015 winning team","Discovery GradHack 2015","Winners confirmed at institution level only; names not published","UJ ACSSE news archive","S26"),
 ("U034","UCT IS GradHack 2017 winning team","Discovery GradHack 2017","Winners confirmed at institution level only; names not published","UCT news archive, LinkedIn alumni","S28"),
 ("U035","Health Guardians (team)","Standard Bank UniHack 2024","2nd place; members not published","ITWeb/Standard Bank follow-ups","S38"),
 ("U036","EduDev (team)","Standard Bank UniHack 2024","3rd place; members not published","As above","S38"),
 ("U037","My EduVault (team)","Standard Bank UniHack 2025","2nd place; members not published","Standard Bank newsroom","S39"),
 ("U038","AI Mental Health Solution (team)","Standard Bank UniHack 2025","3rd place; members not published","As above","S39"),
 ("U039","Hackernauts (SA+Prague)","Absa Technology Hackathon 2024","1st place (internal); members not published","Absa internal comms / LinkedIn employee posts","S46"),
 ("U040","Teamo Supremo (SA)","Absa Technology Hackathon 2024","3rd place (internal); members not published","As above","S46"),
 ("U041","Mighty Pythons (SA)","Absa Technology Hackathon 2025","AI for Impact winners (internal); members not published","As above","S48"),
 ("U042","Hustle Hub (SA)","Absa Technology Hackathon 2025","Blue Sky co-winner (internal); members not published","As above","S48"),
 ("U043","Two unnamed SA winners","Kuunda Disrupt Hackathon 2025","Two SA-based winners described by solution only","Standard Bank internal comms","S42"),
 ("U044","The Recycling Rangers (12 pupils)","Kuunda Disrupt schools 2024","Winning team from Effingham Heights Primary; pupil names not published","School communications","S43"),
 ("U045","Gig Guide / I'm Interested / Wits Locate teams","Wits Student App Challenge 2015","Top-3 teams; members not published","Wits DIZ archives","S50"),
 ("U046","Wits Meal App / IQMates / Bus Control teams","Wits Student App Challenge 2015","Category award winners; members not published","As above","S50"),
 ("U047","Need A Book / Wits Happening / 24 developers","Wits Student App Challenge 2015","Best-presentation developers; names not published","As above","S50"),
 ("U048","greenhouse project team","NWU Hackday 2016","Winning team; members not captured from PDF","NWU IT News 2016 PDF (full read-through pending)","S37"),
 ("U049","virtual museum team","NWU Hackday 2016","Winning team; members not captured from PDF","As above","S37"),
 ("U050","Ubuntu Hackers / Cybergeeks / Bit by Bit","Tshwane Varsity Hackathon 2025","Top-3 teams; member names not published","TUT newsroom, partner posts","S58"),
 ("U051","Master Hackers / Ctrl Alt & Defeat / Byte Bandits","Limpopo Varsity Hackathon 2025","Top-3 teams; member names not published","TUT/UL newsroom","S57"),
 ("U052","Mzansi Shield full roster (beyond confirmed pair)","CyberSecureTech Hackathon 2025","Caption ambiguity: possible members Titelo Maleka (TUT) & Sigidane Khumbudzo — recorded as Low-confidence probable members","UNIVEN original captions/photos","S59,S60"),
 ("U053","Data Defence Solutions / Zero Trust teams","CyberSecureTech Hackathon 2025","Joint 3rd place; members not published","UNIVEN news","S59"),
 ("U054","Team Direla members","UCT FIH x Interledger Hackathon 2025","1st place; member names not published in located coverage","Interledger/UCT FIH posts","S62"),
 ("U055","Team FlowFi members","UCT FIH x Interledger Hackathon 2025","3rd place; members not published","As above","S62"),
 ("U056","Two unnamed teammates of Kerry-Lynne White","UCT FIH x Interledger Hackathon 2026","Winning trio; only one member named","EWN/UCT FIH follow-ups","S63"),
 ("U057","SmartWare team","Hackathons for SA #GBV — Cape Town 2020","Winning team; members not published","Silicon Cape/organiser archives","S66"),
 ("U058","Basket (team)","Township Tech Hackathon 2021","Theme winner; members not published","CiTi","S67"),
 ("U059","Cyberspace (team)","Township Tech Hackathon 2021","Theme winner; members not published","CiTi","S67"),
 ("U060","Ubunifu (team)","AB4IR Hackathon 2021","2nd place; members not published","AB4IR socials","S68"),
 ("U061","My Universe (team)","AB4IR Hackathon 2021","3rd place; members not published","As above","S68"),
 ("U062","Recursive Redemption full roster (beyond Molvi & Botes)","DIRISA Datathon 2022","1st place team; only poster awardees named","DIRISA/UJ","S70"),
 ("U063","Eagles (NWU) / DataTude (SPU) / Mighty Ridge (Saulridge) rosters","DIRISA Datathon 2022","2nd/3rd/best-team rosters not published","DIRISA","S70"),
 ("U064","The Domain'ators (SPU) roster","DIRISA Datathon 2023","Technical + poster winner; members not published","DIRISA/SPU","S71,S72"),
 ("U065","Wits & UNIZULU technical-challenge teams","DIRISA Datathon 2023","2nd/3rd technical; members not published","DIRISA","S71"),
 ("U066","Fix8t roster (beyond Slinda)","DIRISA Datathon 2023","Best team; only bursary winner named","DIRISA/University of Mpumalanga","S72"),
 ("U067","8 IEB-TechWays winning school teams (learners)","IEB-TechWays National AI Hackathon 2026","School teams recognised; learner names not published","IEB/TechWays","S73"),
 ("U068","Gridwise 10X / Chromomark / Civic Eye / SIRRS / Aqua Guard AI (learners)","Gauteng e-Government Youth Tech Challenge 2026","District teams of 10 learners each; names not published","Gauteng Provincial Government","S76"),
 ("U069","VUT Hackathon 2026 winning team(s)","VUT Hackathon 2026","Winners referenced but names not captured in accessed excerpt","VUT newsroom article full text","S80"),
 ("U070","japeyjapes (pseudonymous Entelect 2019 bronze)","Entelect Challenge 2019","Pseudonym; real identity not publicly linked on the blog page","Blog authorship signals, GitHub bot repo","S16"),
 ("U071","2019 Entelect Challenge winner + remaining top-8","Entelect Challenge 2019","Full 2019 rankings not located this pass","Entelect archives, community wikis","S16"),
 ("U072","Water Wardens / Wataware team members","Hack4Water weekend 2016","Team headers present on organiser page; member names not captured in snapshot","Re-fetch codebridge page (fetch failed this pass)","S17"),
]

# ---------- Research gaps ----------
GAPS = [
 ("G001","Era","Pre-2013 hackathon activity not yet located","RHoK Johannesburg (Nov 2013) is earliest verified with venue+date; RHoK Cape Town 2012 existence-only; 2009-2011 candidates (Tech4Africa hackday, early AngelHack Johannesburg, RHoK 2010-2011 SA sites) unverified","Wayback Machine for tech4africa.org, angelhack archives, developer community mailing lists","High"),
 ("G002","Series","Discovery GradHack 2019/2020/2022/2023 editions unverified","Series is annual since 2014; interim years unverified","Discovery media room archive","High"),
 ("G003","Series","GirlCodeHack editions 2014/2015/2016/2018/2019/2021/2023/2024 winners unknown","Edition numbering is documented (4th=2017, 8th=2022, 11th=2025) so intervening years almost certainly ran; per-year results not yet located","GirlCode website archive, ITWeb archive, Wayback","High"),
 ("G004","Series","Entelect Challenge 2012/13-2016, 2018, 2020, 2021, 2025 results unknown","Winner names exist in community/historical pages; start-year sources conflict (11th year in 2023 vs 13th in 2024)","challenge.entelect.co.za archives, GitHub community repos","High"),
 ("G005","Series","Tshwane Varsity Hackathon 2019-2024 editions unverified","7th annual in 2025 implies editions since 2019","TUT newsroom archive","Medium"),
 ("G006","Series","Limpopo Varsity Hackathon 2022/2023 editions + 2026 winners unverified","4th annual in 2025 implies editions since 2022","TUT newsroom","Medium"),
 ("G007","Series","Kuunda Disrupt editions 2015-2023 (internal Standard Bank hackathons) undocumented","Employee hackathon; public winner disclosure rare","Standard Bank newsroom archive","Low (internal by design)"),
 ("G008","Series","Absa Technology Hackathon 2023 (1st annual) unverified","Inferred from 'second annual' phrasing","Absa media statements","Low"),
 ("G009","Event","MICT SETA National Finals 2026 winners unknown","Finals held 30-31 Mar 2026 Gauteng; results not located","MICT SETA communications, provincial winners' institutions","High"),
 ("G010","Event","Telkom 10X national finals results unknown","FS winners advanced to Johannesburg finals","Telkom/Bloemfontein Courant follow-ups","Medium"),
 ("G011","Event","Hack.Jozi 2017+ editions unverified","2015 and 2016 documented; later editions (if any) not located; CoJ strategy may have shifted","CoJ economic development archives, JCSE","Medium"),
 ("G012","Event","Hack4Water national challenge winners unknown","DWS/OGP national competition winners not located","DWS archives, Wayback of hack4water site","Medium"),
 ("G013","Province","Mpumalanga: no hackathon events verified as hosted in-province this pass","DIRISA awards ceremony held in Skukuza (Mpumalanga) but competition itself provincial-neutral; expect university (UMP) and TVET events to exist","UMP newsroom, Mbombela community media","High"),
 ("G014","Province","Northern Cape: no events verified as hosted in-province this pass","Kimberley-based team participated in #SS19Hack (JHB); Sol Plaatje University events expected","SPU newsroom, Northern Cape media","High"),
 ("G015","Profile","Public professional profile discovery (LinkedIn/GitHub/Devpost etc.) not yet performed at scale","All profile columns currently 'Unknown'; requires per-person verification searches per §8 identity rules (2+ corroborating signals)","LinkedIn (public), GitHub, Devpost, personal sites","High"),
 ("G16","Platform","Devpost/HackerEarth/ChallengeRocket platform extraction not performed","No SA-platform pages harvested this pass","site-scoped platform searches","High"),
 ("G017","Platform","Global Game Jam SA participant extraction not performed","GGJ sites per year (multiple SA cities, multiple years) have public participant lists; series row only added for 2020","globalgamejam.org site pages per year","Medium"),
 ("G018","Archive","Wayback Machine passes not yet executed","Several key organiser sites (hack4water, tshimologong, Geekulcha galleries) likely have archived winner pages","web.archive.org","High"),
 ("G019","Sector","Corporate internal hackathons under-covered by design (employee-only events)","Vodacom Hack-alympics, Kuunda Disrupt, Absa Technology Hackathons documented at event level only","Corporate newsrooms","Low"),
 ("G020","Dedup","Cross-event person deduplication limited to evidence-based matches this pass","Name-variant pairs (Anesu/Aneso Jairosi; TechGurlies/Tech Gullies) deliberately NOT merged without corroboration","Person-backwards reverse searches (§18)","Medium"),
]

# ---------- Sources searched ----------
SOURCES_SEARCHED = [
 ("SS01","Web search engine (Arena web_search)","Search platform","Discovery passes 1-3 (~40 structured queries: event-first, year, province, city, university, organiser, project, person-backwards)","High — nearly all records"),
 ("SS02","itweb.co.za","SA tech news","Winner announcements (GirlCode, SS19Hack, UniHack, Absa, Kuunda, township hackathons)","High"),
 ("SS03","University domains (uj.ac.za, news.uct.ac.za, sit.uct.ac.za, su.ac.za, news.nwu.ac.za, wsu.ac.za, news.mandela.ac.za, tut.ac.za, ufs.ac.za, univen.ac.za, science.unizulu.ac.za, vut.ac.za, wits.ac.za)","Tier-1 institutional","GradHack series, SU/NWU/UFS/UNIVEN/UNIZULU/WSU/NMU/TUT/VUT events","High"),
 ("SS04","Corporate newsrooms (standardbank.co.za, absa.africa, absa.co.za, miway.co.za, vodacom.co.za)","Tier-1 corporate","UniHack, Absa hackathons, MiWay actuarial hackathon","High (for covered events)"),
 ("SS05","Organiser/community sites (mlab.co.za, codebridge.co.za, code4sa.org, dirisa.ac.za, sdc.dirisa.ac.za, csir.co.za, geekulcha (via coverage), makegamessa.com, frenchinstitute.org.za, tshimologong.wordpress.com)","Tier-1 organisers","RHoK, GovHackSA, Hack4Water, DIRISA datathons, GGJ, Girls Game Jam","High"),
 ("SS06","Competition platforms/archives (2013.spaceappschallenge.org, entelect.co.za, culture.entelect.co.za, challenge.entelect.co.za [not fetched])","Tier-1 platforms","Space Apps 2013 SA; Entelect Challenge results","High"),
 ("SS07","News media (mybroadband.co.za, htxt.co.za, disrupt-africa.com, techcabal.com, engineeringnews.co.za, iol.co.za, citizen.co.za, mercury/star syndication, ewn.co.za, dailymaverick.co.za, bloemfonteincourant.co.za, krugersdorpnews/citizen, businessstech/africa, techfinancials, techpoint.africa, iafrica.com, innovation-village.com, brandsouthafrica.com, iafrikan.com, matiemedia.org, smfnews.org, mediaupdate.co.za, techreviewafrica, africabusiness.com, pctechmag, briefly.co.za, northcliffmelvilletimes)","Tier-2 media","Event results and named winners","High"),
 ("SS08","Encyclopedia / reference (en.wikipedia.org — RHoK, Space Apps)","Context/verification","Series city lists and dates","Medium"),
 ("SS09","Event platforms (quicket.co.za)","Event listings","GBV hackathon 2020","Medium"),
 ("SS10","LinkedIn / X / Facebook platform search","NOT systematically used this pass","Public posts are a required source class (§16); organiser social accounts only surfaced indirectly via search results","Pending"),
 ("SS11","Devpost / HackerEarth / Kaggle / ChallengeRocket","NOT used this pass","No platform pages harvested","Pending"),
 ("SS12","Wayback Machine / web.archive.org","NOT used this pass","Broken-link recovery (§26) and historical passes (§14) pending","Pending"),
 ("SS13","PDF repositories (services.nwu.ac.za IT News 2016)","Institutional PDFs","NWU hackday 2016 winners (snippet-level; full document read pending)","Medium"),
]

# ---------- Write CSVs ----------
def write(name, fieldnames, rows):
    path = os.path.join(OUT, name)
    with open(path, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writeheader()
        for r in rows:
            w.writerow(r)
    return path

people_rows = []
for key in sorted(people, key=lambda k: people[k]["person_id"]):
    p = people[key]
    people_rows.append({
        "Person_ID": p["person_id"], "First_Name": p["first"] or U, "Middle_Name": p["middle"],
        "Surname": p["surname"], "Full_Name_As_Published": p["full"], "Alternative_Name_Spelling": U,
        "Organisation_At_Time_Most_Recent_Verified": p["org"], "University_At_Time_Most_Recent_Verified": p["uni"],
        "LinkedIn_URL": U, "GitHub_URL": U, "Devpost_URL": U, "Other_Public_Profile_URLs": U,
        "Events_Participated_Count": p["count"], "First_Event_Year": U, "Last_Event_Year": U,
        "Identity_Confidence": person["min_conf"] if p["first"] not in ("", "Unknown") else "Low",
        "Primary_Evidence_URL": src_urls(sorted(p["srcs"])), "Research_Notes": " ; ".join(p["note"]),
        "Date_Verified": TODAY,
    })

unres_rows = [{"Unresolved_ID": u[0], "Name_As_Published": u[1], "Hackathon": u[2], "Context_What_Is_Missing": u[3],
               "Suggested_Next_Avenues": u[4], "Evidence_Source_IDs": u[5], "Status": "Unresolved — not publicly verified",
               "Date_Noted": TODAY} for u in UNRESOLVED]
gap_rows = [{"Gap_ID": g[0], "Scope": g[1], "Description": g[2], "Records_Missing": g[3], "Planned_Search_Avenues": g[4],
             "Priority": g[5], "Status": "Open", "Date_Noted": TODAY} for g in GAPS]
ss_rows = [{"Source_ID": s[0], "Platform_or_Domain": s[1], "Type": s[2], "Purpose_Queries": s[3], "Material_Yield": s[4]} for s in SOURCES_SEARCHED]

p1 = write("01_people_master.csv",
      ["Person_ID","First_Name","Middle_Name","Surname","Full_Name_As_Published","Alternative_Name_Spelling",
       "Organisation_At_Time_Most_Recent_Verified","University_At_Time_Most_Recent_Verified","LinkedIn_URL","GitHub_URL",
       "Devpost_URL","Other_Public_Profile_URLs","Events_Participated_Count","First_Event_Year","Last_Event_Year",
       "Identity_Confidence","Primary_Evidence_URL","Research_Notes","Date_Verified"], people_rows)
p2 = write("02_participation_history.csv", list(part_rows[0].keys()), part_rows)
p3 = write("03_hackathon_master.csv", list(ev_rows[0].keys()), ev_rows)
p4 = write("04_evidence_register.csv", list(evid_rows[0].keys()), evid_rows)
p5 = write("05_unresolved_identities.csv", list(unres_rows[0].keys()), unres_rows)
p6 = write("06_research_gaps.csv", list(gap_rows[0].keys()), gap_rows)
p7 = write("07_sources_searched.csv", list(ss_rows[0].keys()), ss_rows)

# ---------- Stats ----------
n_ev = len(ev_rows)
n_pe = len(people_rows)
n_pa = len(part_rows)
winners = [r for r in part_rows if r["Winner"] == "Yes"]
top3 = [r for r in part_rows if r["Top_3"] == "Yes"]
top10 = [r for r in part_rows if r["Top_10"] == "Yes"]
tier1 = {"Primary"}
win_primary = [r for r in winners if any(SOURCES[s][5] in tier1 for s in [])]
# % winners supported by primary evidence: check participation row's primary/secondary URL source tier
src_by_url = {v[2]: (k, v[5]) for k, v in SOURCES.items()}
def row_tier(r):
    ids = set()
    for url in (r["Primary_Evidence_URL"], r["Secondary_Evidence_URL"]):
        if url and url != U:
            for part in url.split(" ; "):
                if part in src_by_url:
                    ids.add(src_by_url[part][1])
    return ids
win_primary = [r for r in winners if "Primary" in row_tier(r)]
years = {}
for r in ev_rows:
    y = str(r["Year"])[:4]
    years[y] = years.get(y, 0) + 1
prov = {}
for r in ev_rows:
    for pr in str(r["Province"]).split(";"):
        pr = pr.strip()
        if pr and pr != U:
            prov[pr] = prov.get(pr, 0) + 1
compl = {}
for r in ev_rows:
    compl[r["Completeness_Status"]] = compl.get(r["Completeness_Status"], 0) + 1
print(f"Files: {p1}\n       {p2}\n       {p3}\n       {p4}\n       {p5}\n       {p6}\n       {p7}")
print(f"\nHackathon editions in master: {n_ev}")
print(f"Unique named individuals: {n_pe}")
print(f"Participation records: {n_pa}")
print(f"Winner placements (1st): {len(winners)} records / {len(set(r['Person_ID'] for r in winners))} unique people")
print(f"Top-3 placements: {len(top3)} records")
print(f"Top-10 placements: {len(top10)} records")
print(f"Winner records supported by Tier-1 primary sources: {len(win_primary)}/{len(winners)} = {round(100*len(win_primary)/max(1,len(winners)))}%")
print(f"Profiles with verified URLs: 0 (profile discovery pass pending)")
print(f"Evidence register rows: {len(evid_rows)}")
print(f"Unresolved identity records: {len(unres_rows)}")
print(f"Gap records: {len(gap_rows)}")
print("Editions per year:", dict(sorted(years.items())))
print("Editions per province:", dict(sorted(prov.items(), key=lambda x: -x[1])))
print("Completeness distribution:", dict(sorted(compl.items())))
multi = [(p["full"], p["count"]) for k, p in people.items() if p["count"] > 1]
print("Multi-event individuals:", multi)
