#!/usr/bin/env python3
"""
Batch 4 loader — SAICA regional executives (CA(SA)) with explicit articles/training evidence,
plus a Limpopo PA(SA) practitioner (Lesetja Kwetepane).
Appends to JSONL stores (idempotent by id), regenerates interim.csv.
"""
import json
import os
import sys

BASE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE)
import regen_csv  # noqa: E402

PEOPLE_PATH = os.path.join(BASE, "people.jsonl")
COMPANIES_PATH = os.path.join(BASE, "companies.jsonl")
SOURCES_PATH = os.path.join(BASE, "sources.jsonl")
TODAY = "2026-09-18"

REGEXEC_URL = "https://www.saica.org.za/members/member-networks/regional-representation/regional-executives/"

DESIGNATION_BOOLS = {
    "CA(SA)": "ca_sa", "PA(SA)": "pa_sa", "AGA(SA)": "aga_sa", "ACCA": "acca",
    "FCCA": "fcca", "ACMA": "acma", "FCMA": "fcma", "CGMA": "cgma",
}
PEOPLE = []


def make_person(p):
    rec = {
        "date_first_found": TODAY, "date_last_verified": TODAY,
        "status": p.get("status", "CONFIRMED"),
        "first_name": p["first"], "surname": p["surname"], "full_name": p["name"],
        "alternate_names": p.get("alternate_names", []),
        "professionally_qualified": p.get("qualified", "true"),
        "professional_designations": p.get("designations", []),
        "professional_bodies": p.get("bodies", []),
        "designation_status": p.get("designation_status", "CONFIRMED"),
        "qualification_confidence": p.get("confidence", "CONFIRMED"),
        "qualification_evidence": p.get("qualification_evidence", ""),
        "academic_qualifications": p.get("academic", []),
        "articles_completion_status": p.get("articles_status", "QUALIFIED_BUT_ARTICLES_NOT_ESTABLISHED"),
        "articles_body": p.get("articles_body"),
        "articles_employer": p.get("articles_employer"),
        "articles_period": p.get("articles_period"),
        "articles_location": p.get("articles_location"),
        "practical_experience_framework": p.get("per_framework"),
        "qualification_route": p.get("route"),
        "current_title": p.get("title"),
        "current_employer": p.get("employer"),
        "current_role_family": p.get("role_family"),
        "current_function": p.get("function"),
        "current_role_start_date": p.get("role_start"),
        "country": p.get("country", "South Africa"),
        "province": p.get("province"),
        "city": p.get("city"),
        "suburb": p.get("suburb"),
        "linkedin_location": p.get("linkedin_location"),
        "location_confidence": p.get("location_confidence", "UNCONFIRMED"),
        "current_industry": p.get("industry"),
        "current_sub_industry": p.get("sub_industry"),
        "historic_industry_exposure": p.get("historic_industries", []),
        "skills_confirmed": p.get("skills", []),
        "accounting_systems_confirmed": p.get("acct_systems", []),
        "erp_systems_confirmed": p.get("erp_systems", []),
        "analytics_tools_confirmed": p.get("analytics_tools", []),
        "employer_systems_observed": p.get("employer_systems", []),
        "career_history": p.get("career", []),
        "estimated_years_experience": p.get("yoe", "unknown"),
        "experience_estimate_basis": p.get("yoe_basis", ""),
        "linkedin_url": p.get("linkedin"),
        "other_profile_urls": p.get("other_urls", []),
        "primary_source": p.get("primary_source"),
        "source_urls": p.get("sources", []),
        "confidence": p.get("confidence", p.get("status", "CONFIRMED")),
        "notes": p.get("notes", ""),
        "booleans": {},
    }
    des = rec["professional_designations"]
    confirmed = rec["status"] == "CONFIRMED"
    for key, boolkey in DESIGNATION_BOOLS.items():
        rec["booleans"][boolkey] = "true" if key in des else ("false" if confirmed else "unknown")
    rec["booleans"]["saica_articles_confirmed"] = "true" if (
        rec["articles_completion_status"] in ("CONFIRMED_EXPLICIT", "TRAINING_CONTRACT_CONFIRMED")
        and rec["articles_body"] == "SAICA") else ("false" if confirmed else "unknown")
    rec["booleans"]["saipa_articles_confirmed"] = "true" if (
        rec["articles_completion_status"] in ("CONFIRMED_EXPLICIT", "TRAINING_CONTRACT_CONFIRMED")
        and rec["articles_body"] == "SAIPA") else ("false" if confirmed else "unknown")
    rec["booleans"]["acca_per_confirmed"] = "true" if rec["practical_experience_framework"] == "ACCA_PER" else (
        "false" if confirmed else "unknown")
    rec["booleans"]["cima_per_confirmed"] = "true" if rec["practical_experience_framework"] == "CIMA_PER" else (
        "false" if confirmed else "unknown")
    return rec


# Ciara Reintjes — already in DB (batch 1) as CA(SA). This batch enriches via a NEW record? No —
# we avoid duplicates. Ciara already present (acc-0008). Skip re-add; her articles evidence is
# now known (KPMG Windhoek). We'll note enrichment in progress instead of duplicating.

def regional_exec(name, first, surname, region, province, city, articles_employer, articles_note,
                  prior, academic, joined_saica):
    return make_person(dict(
        name=name, first=first, surname=surname,
        status="CONFIRMED", qualified="true",
        designations=["CA(SA)"], bodies=["SAICA"],
        designation_status="CONFIRMED", confidence="CONFIRMED",
        title=f"SAICA Regional Executive: {region}",
        employer="SAICA", role_family="Other", function="Professional body",
        industry="Professional Services",
        province=province, city=city, location_confidence="HIGH",
        qualification_evidence=f'SAICA regional-executives page: "{name}, CA(SA)".',
        academic=academic,
        articles_status="CONFIRMED_EXPLICIT" if articles_employer else "QUALIFIED_BUT_ARTICLES_NOT_ESTABLISHED",
        articles_body="SAICA" if articles_employer else None,
        articles_employer=articles_employer or None,
        articles_location=articles_note or None,
        qualification_route=("SAICA articles" if articles_employer else "CA(SA) (route not detailed in this source)"),
        career=prior,
        role_start=joined_saica,
        yoe="20+", yoe_basis="SAICA regional executives are seasoned CAs(SA); Div Lamprecht noted as 20-year business leader.",
        sources=[REGEXEC_URL], primary_source=REGEXEC_URL,
        notes=articles_note,
    ))


PEOPLE.append(regional_exec(
    "Christiaan Vorster", "Christiaan", "Vorster", "Southern Region (Western Cape & Eastern Cape)",
    "Western Cape", "Cape Town", "Deloitte (Pretoria)",
    "Explicit: \"did his articles at Deloitte Pretoria.\" Stellenbosch (undergraduate), UJ (CTA). Joined SAICA 2014.",
    [{"employer": "Business Growth Africa / Galileo Capital / SCMB", "title": "Corporate financial management (valuations, advisory)"},
     {"employer": "UCT / UP", "title": "Lecturer (strategy, planning, investment appraisal)"},
     {"employer": "Deloitte (Pretoria)", "title": "Articles"}],
    ["Stellenbosch University (undergraduate)", "UJ (CTA)"], "2014"))
PEOPLE.append(regional_exec(
    "Naeem Asvat", "Naeem", "Asvat", "Eastern Region (KwaZulu-Natal)",
    "KwaZulu-Natal", "Durban", None,
    "Prior roles: senior manager, KPMG Accounting Advisory Services (Durban); KPMG Manchester secondment. No explicit articles statement on page.",
    [{"employer": "KPMG", "title": "Senior Manager: Accounting Advisory Services (Durban) + Manchester secondment"},
     {"employer": "listed cellular associate", "title": "CFO (appointed)"}],
    [], "2007"))
PEOPLE.append(regional_exec(
    "Div Lamprecht", "Div", "Lamprecht", "Central Region (Free State, Northern Cape & North West)",
    "Free State", "Bloemfontein", "PwC Bloemfontein",
    "Explicit: \"he completed his articles at PwC Bloemfontein\" (agricultural, financial services, retail clients). Signed: region office based in Bloemfontein. Joined SAICA 2005; prior Absa Consultants & Actuaries (4 years).",
    [{"employer": "PwC Bloemfontein", "title": "Articles"},
     {"employer": "Absa Consultants & Actuaries", "title": "Manager of the Year 2002", "years": "≈1998–2002"}],
    [], "2005"))

# Lesetja Kwetepane — PA(SA) Limpopo
PEOPLE.append(make_person(dict(
    name="Lesetja Kwetepane", first="Lesetja", surname="Kwetepane",
    status="HIGH_CONFIDENCE", qualified="true",
    designations=["PA(SA)"], bodies=["SAIPA"],
    designation_status="HIGH_CONFIDENCE", confidence="HIGH",
    title="Professional Accountant (SA)", employer="LA Financial Services (Pty) Ltd",
    role_family="Financial Accounting", function="Other", industry="Accounting / Audit",
    province="Limpopo", city="Polokwane", location_confidence="HIGH",
    qualification_evidence='Directory (findanaccountant.co.za): "Professional Accountant (SA) - SAIPA 35510"; "Professional Tax Practitioner (SA) - COTE SAIPA 35510"; "Independent Reviewer (SA) Certificate – SAIPA"; SARS registered tax practitioner PR-0091357.',
    academic=["National Diploma: Accounting", "B Tech: Corporate Administration", "MBA",
              "Chartered Company Secretary – ACIS (CSSA)"],
    articles_status="NOT_ESTABLISHED",
    sources=["https://lkwetepane.findanaccountant.co.za/"],
    primary_source="https://lkwetepane.findanaccountant.co.za/",
    notes="SAIPA 35510. Polokwane (Limpopo). Third-party directory listing (findanaccountant.co.za). RPL/learnership route not stated.",
)))

COMPANY_RECS = [
    dict(id="cmp-0040", company_name="LA Financial Services (Pty) Ltd", company_aliases=[],
         website=None, industry="Accounting / Audit", sub_industry="Accounting practice",
         source_urls=["https://lkwetepane.findanaccountant.co.za/"], date_verified=TODAY),
    dict(id="cmp-0041", company_name="Absa Consultants & Actuaries", company_aliases=["Absa C&A"],
         website=None, industry="Financial Services", sub_industry="Consulting & actuarial",
         source_urls=[REGEXEC_URL], date_verified=TODAY),
]


def person_src(i, url, type_, summary, name, reliability, q=True, emp=True):
    return dict(id="src-%04d" % i, url=url, source_type=type_, person_id=None, company_id=None,
                evidence_type="GENERAL", evidence_summary=summary,
                qualification_supported=q, skill_supported=None, system_supported=None,
                employment_supported=emp, accessed_date=TODAY, reliability=reliability, status="USED")


def load_existing_ids(path):
    ids = set()
    if os.path.exists(path):
        with open(path, "r") as f:
            for line in f:
                line = line.strip()
                if line:
                    try:
                        ids.add(json.loads(line)["id"])
                    except Exception:
                        pass
    return ids


def append_records(path, records, existing):
    added = 0
    with open(path, "a") as f:
        for rec in records:
            if rec["id"] in existing:
                continue
            f.write(json.dumps(rec, ensure_ascii=False) + "\n")
            existing.add(rec["id"])
            added += 1
    return added


existing_people = load_existing_ids(PEOPLE_PATH)
next_id = max([int(i.split("-")[1]) for i in existing_people] + [0]) + 1
for p in PEOPLE:
    p["id"] = "acc-%04d" % next_id
    next_id += 1

existing_sources = load_existing_ids(SOURCES_PATH)
next_src_id = max([int(i.split("-")[1]) for i in existing_sources] + [0]) + 1
SOURCE_RECS = [
    person_src(next_src_id + 0, REGEXEC_URL, "Professional Body",
               "SAICA regional executives: Ciara Reintjes / Christiaan Vorster / Naeem Asvat / Div Lamprecht — CAs(SA) with explicit articles (KPMG Windhoek, Deloitte Pretoria, PwC Bloemfontein).",
               None, "PRIMARY", q=True, emp=True),
    person_src(next_src_id + 1, "https://lkwetepane.findanaccountant.co.za/", "Directory",
               "Lesetja Kwetepane: Professional Accountant (SA) SAIPA 35510; Professional Tax Practitioner (SA); Independent Reviewer; Polokwane.",
               "Lesetja Kwetepane", "MODERATE", q=True, emp=True),
]
for s in SOURCE_RECS:
    s["id"] = "src-%04d" % (next_src_id + SOURCE_RECS.index(s))

n_p = append_records(PEOPLE_PATH, PEOPLE, existing_people)
n_c = append_records(COMPANIES_PATH, COMPANY_RECS, load_existing_ids(COMPANIES_PATH))
n_s = append_records(SOURCES_PATH, SOURCE_RECS, load_existing_ids(SOURCES_PATH))

# Enrichment: position Ciara Reintjes already-recorded articles evidence (KPMG Windhoek, Namibia).
enriched = None
rows = []
with open(PEOPLE_PATH) as f:
    for line in f:
        line = line.strip()
        if not line:
            continue
        r = json.loads(line)
        if r.get("full_name") == "Ciara Reintjes":
            r["articles_status"] = "CONFIRMED_EXPLICIT"
            r["articles_body"] = "SAICA"
            r["articles_employer"] = "KPMG (Windhoek, Namibia)"
            r["qualification_route"] = "SAICA articles at KPMG Windhoek (Namibia); CA(SA)"
            r["date_last_verified"] = TODAY
            r["booleans"]["saica_articles_confirmed"] = "true"
            r["notes"] = (r.get("notes", "") + " Articles served at KPMG in Windhoek, Namibia (per SAICA regional-executives page). "
                          "Previously 12 years at IRBA; 4 years at Alexander Forbes (Retirement Funds); joined SAICA 2019, Johannesburg."
                          ).strip()
        rows.append(r)
with open(PEOPLE_PATH, "w") as f:
    for r in rows:
        f.write(json.dumps(r, ensure_ascii=False) + "\n")

regen_csv.main()
print(f"Batch 4 — people added: {n_p}, companies added: {n_c}, sources added: {n_s}, enriched: Ciara Reintjes")
