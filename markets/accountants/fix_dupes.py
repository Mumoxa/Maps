#!/usr/bin/env python3
"""QC fix: merge session-1 BDO CEO (acc-0051) with batch-10 duplicate (acc-0126);
merge company cmp-0031 into cmp-0071. Enrich the original person record with the
batch-10 fields, remove the duplicate rows, and re-verify stores + CSV."""
import json

BASE = "/home/user/Maps/markets/accountants"
PEOPLE = f"{BASE}/people.jsonl"
COMPANY = f"{BASE}/companies.jsonl"


def load(path):
    return [json.loads(l) for l in open(path) if l.strip()]


people = load(PEOPLE)
by_id = {r["id"]: r for r in people}

merge_fields = [
    "academic_qualifications", "qualification_route", "current_employer", "current_sub_industry",
    "province", "city", "location_confidence", "historic_industry_exposure", "career_history",
    "estimated_years_experience", "experience_estimate_basis", "notes",
]
src_merge = by_id["acc-0126"]["source_urls"]
# Keep session-1 primary source first (older provenance) then add BDO page + glueup.
by_id["acc-0051"]["source_urls"] = by_id["acc-0051"]["source_urls"] + [
    u for u in src_merge if u not in by_id["acc-0051"]["source_urls"]
]
for f in merge_fields:
    new = by_id["acc-0126"][f]
    # prefer non-empty batch-10 values; career lists get replaced (richer)
    if new not in (None, "", []):
        by_id["acc-0051"][f] = new
# The batch-10 qualification_evidence is materially better; keep it (it already cites the page).
by_id["acc-0051"]["qualification_evidence"] = by_id["acc-0126"]["qualification_evidence"]
by_id["acc-0051"]["primary_source"] = "https://www.bdo.co.za/en-za/our-people/bonga-mokoena"
by_id["acc-0051"]["notes"] = ("Merged duplicate record. " + by_id["acc-0126"]["notes"] +
                              " Session-1 provenance: Accountancy SA CA(SA) profile."
                              if "Merged" not in by_id["acc-0051"]["notes"] else by_id["acc-0051"]["notes"])

# Drop acc-0126
people = [r for r in people if r["id"] != "acc-0126"]
# Re-number ids 1..N
people.sort(key=lambda r: int(r["id"].split("-")[1]))
for i, r in enumerate(people, 1):
    r["id"] = f"acc-{i:04d}"

with open(PEOPLE, "w") as f:
    for r in people:
        f.write(json.dumps(r, ensure_ascii=False) + "\n")

# ---- companies: merge cmp-0031 into cmp-0071 ----
comps = load(COMPANY)
c31 = next(c for c in comps if c["id"] == "cmp-0031")
c71 = next(c for c in comps if c["id"] == "cmp-0071")
c71["source_urls"] = list(dict.fromkeys(c71.get("source_urls", []) + c31.get("source_urls", [])))
c71["company_aliases"] = list(dict.fromkeys(c71.get("company_aliases", []) + c31.get("company_aliases", [])))
comps = [c for c in comps if c["id"] != "cmp-0031"]
comps.sort(key=lambda c: int(c["id"].split("-")[1]))
for i, c in enumerate(comps, 1):
    c["id"] = f"cmp-{i:04d}"
with open(COMPANY, "w") as f:
    for c in comps:
        f.write(json.dumps(c, ensure_ascii=False) + "\n")

import subprocess
subprocess.run(["python3", f"{BASE}/regen_csv.py"], check=True)

# re-verify
from collections import Counter
people2 = load(PEOPLE)
print("people:", len(people2), "status:", dict(Counter(r['status'] for r in people2)))
print("confirmed:", sum(1 for r in people2 if r['status']=='CONFIRMED'))
print("dupe names:", {k:v for k,v in Counter((r['first_name']+' '+r['surname']).lower() for r in people2).items() if v>1})
comps2 = load(COMPANY)
print("companies:", len(comps2), "dupe:", {k:v for k,v in Counter(c['company_name'].lower() for c in comps2).items() if v>1})
print("max people id:", max(int(r['id'].split('-')[1]) for r in people2))
print("max company id:", max(int(c['id'].split('-')[1]) for c in comps2))
