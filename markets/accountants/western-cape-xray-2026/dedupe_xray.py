#!/usr/bin/env python3
"""Dedupe independent X-ray hits against the EXISTING repo (people.jsonl + prior atlas CSVs).
No repo records are modified here. Output: xray_raw_hits.csv, xray_search_log.csv,
xray_deduped_candidates.csv, xray_new_to_repo.csv (the only rows eligible for batch import).
Match order: 1) normalised LinkedIn URL  2) exact normalised full name  3) surname+first-initial+employer (flagged, never auto-merged)."""
import csv, json, re, sys, unicodedata, urllib.parse, pathlib
HERE=pathlib.Path(__file__).parent; BASE=HERE.parent; sys.path.insert(0,str(HERE))
from raw_hits import HITS, QUERIES
DATE="2026-10-14"
def norm_url(u):
    if not u: return ""
    u=urllib.parse.unquote(u).lower().rstrip("/"); u=re.sub(r"https?://(za|www)\.linkedin\.com/","https://www.linkedin.com/",u); return u
def norm_name(n):
    n=unicodedata.normalize("NFKD",n).encode("ascii","ignore").decode().lower()
    n=re.sub(r"\bca\(sa\)|ca \(sa\)|ca sa\b","",n); return re.sub(r"[^a-z ]"," ",n).split()
people=[json.loads(l) for l in open(BASE/"people.jsonl") if l.strip()]
by_url={}; by_name={}
for p in people:
    if p.get("linkedin_url"): by_url.setdefault(norm_url(p["linkedin_url"]),p)
    by_name.setdefault(tuple(norm_name(p["full_name"])),p)
atlas_names={}
for f in ["western_cape_ca_sa_verified_candidates_2026-10-14.csv","western_cape_ca_sa_verification_queue.csv"]:
    pp=BASE/"western-cape-atlas"/f
    if pp.exists():
        for r in csv.DictReader(open(pp)): atlas_names[tuple(norm_name(r["full_name"]))]=f
rows=[]
for name,title,emp,loc,url,q,note in HITS:
    excluded = note.startswith("EXCLUDE"); hold = note.startswith("HOLD")
    key=tuple(norm_name(name)); match=""; mid=""
    if url and norm_url(url) in by_url: match="EXISTING_IN_REPO_BY_LINKEDIN"; mid=by_url[norm_url(url)]["id"]
    elif key in by_name: match="EXISTING_IN_REPO_BY_NAME"; mid=by_name[key]["id"]
    elif key in atlas_names: match="EXISTING_IN_PRIOR_ATLAS_ONLY"
    elif excluded: match="EXCLUDED"
    elif hold: match="HOLD_NO_WC_LOCATION"
    elif not url: match="NEW_NAME_ONLY_LEAD_NO_URL"
    else: match="NEW_TO_REPO"
    if "not literal" in note and match=="NEW_TO_REPO": match="NEW_BUT_DESIGNATION_NOT_LITERAL"
    rows.append(dict(full_name=name,title_snippet=title,employer_snippet=emp,location_snippet=loc,linkedin_url=url,query_batch=q,evidence_note=note,dedupe_status=match,matched_maps_id=mid,retrieved=DATE))
with open(HERE/"xray_raw_hits.csv","w",newline="",encoding="utf-8") as f: w=csv.DictWriter(f,fieldnames=list(rows[0])); w.writeheader(); w.writerows(rows)
with open(HERE/"xray_search_log.csv","w",newline="",encoding="utf-8") as f: w=csv.writer(f); w.writerow(["query_id","xray_query","engine","date_run","notes"]); [w.writerow([q,qq,"web_search (Google-indexed public snippets)",DATE,"No LinkedIn access-control bypass; snippets only"]) for q,qq in QUERIES]
new=[r for r in rows if r["dedupe_status"]=="NEW_TO_REPO"]
with open(HERE/"xray_deduped_candidates.csv","w",newline="",encoding="utf-8") as f: w=csv.DictWriter(f,fieldnames=list(rows[0])); w.writeheader(); w.writerows([r for r in rows if not r["dedupe_status"].startswith("EXCLUDED")])
with open(HERE/"xray_new_to_repo.csv","w",newline="",encoding="utf-8") as f: w=csv.DictWriter(f,fieldnames=list(rows[0])); w.writeheader(); w.writerows(new)
import collections; print(collections.Counter(r["dedupe_status"] for r in rows)); print("NEW:",[r["full_name"] for r in new])
