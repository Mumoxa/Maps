#!/usr/bin/env python3
"""
Batch 3 loader — ACCA/FCCA and CIMA designation records (named individuals).
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
        "articles_completion_status": p.get("articles_status", "NOT_ESTABLISHED"),
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


# ---- FCCA (ACCA fellows) ----
PEOPLE.append(make_person(dict(
    name="Manenzhe Manenzhe", first="Manenzhe", surname="Manenzhe",
    status="CONFIRMED", qualified="true",
    designations=["FCCA"], bodies=["ACCA"],
    designation_status="CONFIRMED", confidence="CONFIRMED",
    title="ACCA South Africa council member (role/employer inferred)", employer="ACCA (South Africa)",
    role_family="Professional body", function="Other", industry="Professional Services",
    province="Gauteng", linkedin_location="Gauteng, South Africa", location_confidence="HIGH",
    qualification_evidence='LinkedIn: "Manenzhe Manenzhe FCCA" — license "Fellow ACCA, Credential ID 0661296"; described in activity as "Africa CFO of the Year" and ACCA South Africa council member.',
    per_framework="ACCA_PER", articles_status="NOT_APPLICABLE",
    qualification_route="ACCA (Fellow) — full ACCA membership with 5+ years standing",
    linkedin="https://www.linkedin.com/in/manenzhe-manenzhe-fcca-a80079150/",
    sources=["https://www.linkedin.com/in/manenzhe-manenzhe-fcca-a80079150/"],
    primary_source="https://www.linkedin.com/in/manenzhe-manenzhe-fcca-a80079150/",
    notes='FCCA credential (ID 0661296). Activity text indicates leadership of ACCA accreditation in SA and IRBA/ACCA engagement; current employer recorded as ACCA (South Africa) — INFERRED from LinkedIn activity, flag for verification. ACCA_PER assumed per full FCCA membership.',
)))
PEOPLE.append(make_person(dict(
    name="Vijedharsan Vijendranath", first="Vijedharsan", surname="Vijendranath",
    status="CONFIRMED", qualified="true",
    designations=["FCCA"], bodies=["ACCA"],
    designation_status="CONFIRMED", confidence="CONFIRMED",
    title="SOX Internal Auditor (Manager level)", employer=None,
    role_family="Internal Audit", function="Internal Audit", industry="Financial Services",
    province="Gauteng", city="Johannesburg", location_confidence="HIGH",
    qualification_evidence='Public CV (postjobfree.com): "ACCA Membership in UK (2015)" / FCCA; LinkedIn headline includes "FCCA UK".',
    per_framework="ACCA_PER", articles_status="NOT_APPLICABLE",
    qualification_route="ACCA (now Fellow) — ACCA membership (UK) since 2015; CPA Australia (2024)",
    academic=["BCompt Hons Accounting Sciences — UNISA (2011)",
              "BCom (Accounting) — University of Pretoria (2006)"],
    linkedin="https://www.linkedin.com/in/vijedharsan-vijendranath-fcca-uk-6118b1103/",
    sources=["https://www.postjobfree.com/resume/aeheo9/experienced-internal-with-johannesburg"],
    primary_source="https://www.postjobfree.com/resume/aeheo9/experienced-internal-with-johannesburg",
    career=[{"employer": "Calculus Chartered Accountants and Registered Auditors", "title": "Consulting Manager", "years": "Jan–Jun 2014"},
            {"employer": "Lonrho Africa Holdings", "title": "Internal Audit", "years": "≈2015–2017"},
            {"employer": "Car Track / Hudaco (divisions)", "title": "Senior Internal Auditor", "years": "≈2017–2024"},
            {"employer": "Audit Jet (Pty) Ltd", "title": "Manager: SOX Internal Audit (contract)", "years": "Oct–Dec 2024"},
            {"employer": "Not named in CV", "title": "SOX Internal Auditor", "years": "Appointed April 2025"}],
    historic_industries=["Automotive", "Transport", "Professional Services"],
    yoe="10+", yoe_basis="CV headline: internal auditor with 10+ years; BCom 2006, ACCA membership 2015.",
    notes='10+ years internal audit. FCCA (UK) per LinkedIn slug; ACCA membership (UK) 2015 per CV. Studying CIA challenge exam (2025/26). Current employer not named for the April 2025 appointment.',
)))
# ---- CIMA / CGMA ----
PEOPLE.append(make_person(dict(
    name="Tariro Mutizwa", first="Tariro", surname="Mutizwa",
    status="CONFIRMED", qualified="true",
    designations=["ACMA", "CGMA"], bodies=["CIMA"],
    designation_status="CONFIRMED", confidence="CONFIRMED",
    title="Vice President – Africa", employer="AICPA & CIMA (CIMA Africa)",
    role_family="Executive Finance", function="Professional body", industry="Professional Services",
    qualification_evidence='AICPA & CIMA: "Tariro Mutizwa, ACMA, CGMA, Vice President – Africa at The Chartered Institute of Management Accountants".',
    per_framework="CIMA_PER", articles_status="NOT_APPLICABLE",
    qualification_route="CIMA professional qualification (ACMA, CGMA)",
    sources=["https://www.aicpa-cima.com/news/article/new-generation-of-south-african-accounting-and-finance-professionals-receive",
             "https://pressportal.co.za/business-and-economy/story/sxcx4y2oot3gbjnyvj1a-20250624.html"],
    primary_source="https://www.aicpa-cima.com/news/article/new-generation-of-south-african-accounting-and-finance-professionals-receive",
    notes="CIMA VP Africa; spoke at the Johannesburg CGMA convocation (June 2025). Explicit ACMA, CGMA.",
)))

COMPANY_RECS = [
    dict(id="cmp-0038", company_name="ACCA (South Africa)", company_aliases=["ACCA"],
         website="https://www.accaglobal.com/africa/", industry="Professional Services",
         sub_industry="Professional accountancy body",
         source_urls=["https://www.linkedin.com/in/manenzhe-manenzhe-fcca-a80079150/"], date_verified=TODAY),
    dict(id="cmp-0039", company_name="CIMA Africa", company_aliases=["AICPA & CIMA (Africa)"],
         website="https://www.cimaglobal.com/", industry="Professional Services",
         sub_industry="Professional accountancy body",
         source_urls=["https://www.aicpa-cima.com/news/article/new-generation-of-south-african-accounting-and-finance-professionals-receive"],
         date_verified=TODAY),
]


def person_src(i, url, type_, summary, name, reliability, q=True, emp=False, skill=False):
    return dict(id="src-%04d" % i, url=url, source_type=type_, person_id=None, company_id=None,
                evidence_type="GENERAL", evidence_summary=summary,
                qualification_supported=q, skill_supported=skill, system_supported=None,
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
    person_src(next_src_id + 0, "https://www.linkedin.com/in/manenzhe-manenzhe-fcca-a80079150/", "LinkedIn",
               "Manenzhe Manenzhe FCCA (credential 0661296): ACCA SA council member; led IRBA/ACCA accreditation.",
               "Manenzhe Manenzhe", "STRONG", q=True),
    person_src(next_src_id + 1, "https://www.postjobfree.com/resume/aeheo9/experienced-internal-with-johannesburg", "CV",
               "Vijedharsan Vijendranath FCCA (UK): internal audit career (Lonrho, Car Track/Hudaco, Audit Jet); BCompt Hons UNISA; BCom UP.",
               "Vijedharsan Vijendranath", "STRONG", q=True, emp=True),
    person_src(next_src_id + 2, "https://www.aicpa-cima.com/news/article/new-generation-of-south-african-accounting-and-finance-professionals-receive",
               "Professional Body",
               "Tariro Mutizwa ACMA, CGMA — VP Africa (CIMA); CGMA convocation Johannesburg (Jun 2025).",
               "Tariro Mutizwa", "PRIMARY", q=True),
]
for s in SOURCE_RECS:
    s["id"] = "src-%04d" % (next_src_id + SOURCE_RECS.index(s))

n_p = append_records(PEOPLE_PATH, PEOPLE, existing_people)
n_c = append_records(COMPANIES_PATH, COMPANY_RECS, load_existing_ids(COMPANIES_PATH))
n_s = append_records(SOURCES_PATH, SOURCE_RECS, load_existing_ids(SOURCES_PATH))

regen_csv.main()
print(f"Batch 3 — people added: {n_p}, companies added: {n_c}, sources added: {n_s}")
