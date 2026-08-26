#!/usr/bin/env python3
"""Generate the Maps talent-pool candidate dataset from the SA Hackathon Census.

Reads:   hackathon-census/data/01_people_master.csv + 02_participation_history.csv
Writes:  markets/hackathons/people.json (candidates for the Maps talent pool)

Rules honoured from the census (see hackathon-census/README.md):
- Public professional information only; no inferred fields; evidence URLs kept on every record.
- Pseudonymous and single-name-only records are EXCLUDED from the talent pool (they remain in
  the census CSVs) because they cannot be meaningfully matched or contacted.
"""
import csv, json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CENSUS = os.path.join(ROOT, "hackathon-census", "data")
OUT = os.path.join(ROOT, "markets", "hackathons", "people.json")

TIER_ORDER = {"Winner": 0, "Top 3": 1, "Top 10": 2, "Special award": 3, "Finalist": 4, "Qualified": 5, "Participant": 6}

def tier(placement: str) -> str:
    p = (placement or "").strip()
    if p in ("1", "1st"): return "Winner"
    if p in ("2", "2nd", "3", "3rd", "Top3", "2nd/3rd (conflicting)"): return "Top 3"
    if p == "Winner(special)": return "Special award"
    if p in ("4", "4th", "5", "5th", "6", "6th", "7", "7th", "8", "8th", "9", "9th", "10", "10th", "Top10"): return "Top 10"
    if p == "Finalist": return "Finalist"
    if p == "Qualified": return "Qualified"
    return "Participant"

def clean(v): 
    v = (v or "").strip()
    return v if v and v != "Unknown" else None

def first_province(prov: str):
    if not prov or prov == "Unknown": return None
    return prov.split(";")[0].strip() or None

def main():
    people = list(csv.DictReader(open(os.path.join(CENSUS, "01_people_master.csv"), encoding="utf-8-sig")))
    parts = list(csv.DictReader(open(os.path.join(CENSUS, "02_participation_history.csv"), encoding="utf-8-sig")))

    by_pid = {}
    for p in parts:
        by_pid.setdefault(p["Person_ID"], []).append(p)

    excluded, candidates = [], []
    for person in people:
        name = person["Full_Name_As_Published"]
        if "(pseudonym)" in name or "(single name published)" in name:
            excluded.append(name)
            continue
        events = []
        for e in sorted(by_pid.get(person["Person_ID"], []), key=lambda x: x["Event_Year"]):
            events.append({
                "event": e["Hackathon_Name"],
                "edition": clean(e["Hackathon_Edition"]),
                "year": e["Event_Year"],
                "placement": e["Placement"],
                "tier": tier(e["Placement"]),
                "team": clean(e["Team_Name"]),
                "project": clean(e["Project_Name"]),
                "award": clean(e["Award_or_Category"]),
                "city": clean(e["City"]),
                "province": first_province(e["Province"]),
                "top3": e["Top_3"] == "Yes",
                "top10": e["Top_10"] == "Yes",
                "winner": e["Winner"] == "Yes",
                "evidenceUrl": e["Primary_Evidence_URL"],
            })
        if not events:
            continue
        best = min(events, key=lambda e: (TIER_ORDER.get(e["tier"], 9), str(e["year"])))
        label_bits = [best["placement"]]
        if best["team"]: label_bits.append(f"team {best['team']}")
        evs = [best["event"], best["edition"] or best["year"]]
        candidates.append({
            "id": f"hc-{person['Person_ID'].lower().replace('p', '', 1).zfill(3)}" if False else f"hc-{person['Person_ID'][1:].zfill(3)}",
            "censusPersonId": person["Person_ID"],
            "fullName": name,
            "category": "Candidate",
            "segment": "Hackathon contestants",
            "bestTier": best["tier"],
            "bestResultLabel": f"{best['placement']} — {best['event']}{' ' + best['year'] if best['year'] else ''}",
            "winner": any(e["winner"] for e in events),
            "top3": any(e["top3"] for e in events),
            "top10": any(e["top10"] for e in events),
            "events": events,
            "eventCount": len(events),
            "organisationAtTime": clean(person["Organisation_At_Time_Most_Recent_Verified"]),
            "universityAtTime": clean(person["University_At_Time_Most_Recent_Verified"]),
            "province": best["province"],
            "confidence": person["Identity_Confidence"],
            "evidenceUrl": person["Primary_Evidence_URL"].split(" ; ")[0],
            "notes": clean(person["Research_Notes"]),
            "source": "SA Hackathon Census (hackathon-census/) — public-source, evidence-linked",
        })

    candidates.sort(key=lambda c: (TIER_ORDER.get(c["bestTier"], 9), c["fullName"].lower()))
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(candidates, f, ensure_ascii=False, indent=1)
    winners = sum(1 for c in candidates if c["winner"])
    print(f"wrote {OUT}: {len(candidates)} candidates ({winners} winners), excluded {len(excluded)}: {excluded}")

if __name__ == "__main__":
    sys.exit(main())
