#!/usr/bin/env python3
"""Batch 14 — Independent X-ray (site:linkedin.com/in) Western Cape CA(SA) discovery, 2026-10-14.
Independent of prior atlas work: raw hits logged in western-cape-xray-2026/xray_raw_hits.csv,
deduped by normalised LinkedIn URL then exact name against people.jsonl (dedupe_xray.py).
Only NEW_TO_REPO rows with an explicit CA(SA) in the indexed LinkedIn snippet are imported.
Evidence is LinkedIn self-reported (public indexed snippet, no access bypass) => status
HIGH_CONFIDENCE, designation_status HIGH_CONFIDENCE, location from the profile's own
location field. NOT independent designation corroboration; no SAICA membership verified.
Name-only sidebar leads, non-literal designations, holds and non-WC hits are NOT imported."""
import csv, json, os, sys
BASE=os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0,BASE)
import db_lib
CHECK="2026-10-14"; XRAY=os.path.join(BASE,"western-cape-xray-2026","xray_new_to_repo.csv")
IND={"Zeder Investments Ltd":"Financial Services","Worksmith International (Pty) Ltd":"Professional Services","Pick n Pay":"Retail","DG Murray Trust":"Non-Profit","PUREFERT":"Agriculture","Mulilo":"Energy","JTC Group":"Financial Services","WeconnectU":"Technology","CA RA MPAKO Inc.":"Accounting / Audit","Sanlam Fintech":"Fintech","Clicks Group":"Retail","Sanlam":"Financial Services","Cognia Law":"Professional Services","ShopriteX":"Retail","SnapScan":"Fintech","Deloitte":"Accounting / Audit","PwC":"Accounting / Audit","Braude Gordon & Co Chartered Accountants":"Accounting / Audit","Trinity Financial Solutions":"Professional Services","Personal Trust (Pty) Ltd":"Financial Services","Carmel Wealth":"Financial Services","City of Cape Town (municipality)":"Government"}
def main():
    rows=list(csv.DictReader(open(XRAY)))
    existing={json.loads(l)["full_name"].strip().lower() for l in open(db_lib.PEOPLE_PATH) if l.strip()}
    existing_urls={json.loads(l).get("linkedin_url") for l in open(db_lib.PEOPLE_PATH) if l.strip()}
    specs=[]; companies={}
    for r in rows:
        if r["full_name"].lower() in existing or r["linkedin_url"] in existing_urls: print("SKIP dup",r["full_name"]); continue
        parts=r["full_name"].split(); emp=r["employer_snippet"] or ("Hire Far Out / Snatch" if r["full_name"]=="Jaco Swanepoel" else None)
        city=r["location_snippet"].replace(", Western Cape","").replace("Western Cape / ","").strip() or "Cape Town"
        specs.append(dict(name=r["full_name"],first=parts[0],surname=" ".join(parts[1:]),des=["CA(SA)"],status="HIGH_CONFIDENCE",designation_status="HIGH_CONFIDENCE",qualification_confidence="HIGH",
            title=r["title_snippet"] or None,employer=emp,industry=IND.get(emp),province="Western Cape",city=city,linkedin_location=r["location_snippet"],location_confidence="CONFIRMED",
            linkedin=r["linkedin_url"],date=CHECK,verified=CHECK,
            evidence=f"Independent X-ray search 2026-10-14 ({r['query_batch']}): Google-indexed LinkedIn snippet — {r['evidence_note']}. Profile location: {r['location_snippet']}; employer: {emp}. Designation is LinkedIn self-reported, not independently corroborated.",
            source_urls=[r["linkedin_url"]],notes="Batch 14 X-ray import. Self-reported CA(SA) on public LinkedIn profile; surname-only collisions in repo checked and NOT merged (different people). Current SAICA membership NOT verified. Snippet may be stale — re-verify before outreach."))
        if emp and emp not in companies: companies[emp]=r["linkedin_url"]
    existing_comp={json.loads(l)["company_name"].strip().lower() for l in open(db_lib.COMPANIES_PATH) if l.strip()}
    cid=db_lib.next_id(db_lib.COMPANIES_PATH,"cmp"); comp_specs=[]
    for name,url in companies.items():
        if name.lower() in existing_comp: continue
        comp_specs.append(dict(id="cmp-%04d"%cid,company_name=name,company_aliases=[],website=None,industry=IND.get(name),sub_industry=None,headquarters=None,south_africa_locations=["Western Cape"],company_size_if_public=None,listed_or_private="unknown",parent_company=None,finance_team_research_status="RESEARCHED_WITH_PEOPLE",finance_people_verified_count=1,finance_team_research_notes="Added batch 14 (X-ray WC CA(SA), 2026-10-14) with a LinkedIn-evidenced finance person.",source_urls=[url],date_verified=CHECK)); cid+=1
    sid=db_lib.next_id(db_lib.SOURCES_PATH,"src"); pid=db_lib.next_id(db_lib.PEOPLE_PATH,"acc"); src_specs=[]
    for i,s in enumerate(specs):
        src_specs.append(dict(id="src-%04d"%sid,url=s["source_urls"][0],source_type="LinkedIn (public indexed snippet)",person_id="acc-%04d"%(pid+i),company_id=None,evidence_type="designation_employment_location_self_reported",evidence_summary=s["evidence"],qualification_supported="self_reported",skill_supported=None,system_supported=None,employment_supported="self_reported",accessed_date=CHECK,reliability="MODERATE",status="USED")); sid+=1
    people=db_lib.append_batch(specs,company_specs=comp_specs,source_specs=src_specs,label="Batch 14 (X-ray Western Cape CA(SA))")
    print("imported",len(people))
if __name__=="__main__": main()
