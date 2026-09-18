#!/usr/bin/env python3
"""Shared loader library for the SA Qualified Accountant research DB.

Provides a compact `build(spec)` that expands a short person spec into the full
people.jsonl schema (inferring professional bodies from designations, computing
boolean fields), plus append + CSV-regen helpers. All batch loaders import this.
"""
import json
import os
import sys
from collections import Counter

BASE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE)
import regen_csv  # noqa: E402

PEOPLE_PATH = os.path.join(BASE, "people.jsonl")
COMPANIES_PATH = os.path.join(BASE, "companies.jsonl")
SOURCES_PATH = os.path.join(BASE, "sources.jsonl")
TODAY = "2026-09-18"

QUAL_NOT_EST = "QUALIFIED_BUT_ARTICLES_NOT_ESTABLISHED"
NOT_EST = "NOT_ESTABLISHED"

DESIGNATION_BOOLS = {
    "CA(SA)": "ca_sa", "PA(SA)": "pa_sa", "AGA(SA)": "aga_sa", "ACCA": "acca",
    "FCCA": "fcca", "ACMA": "acma", "FCMA": "fcma", "CGMA": "cgma",
}

BODY_BY_DESIGNATION = {
    "CA(SA)": "SAICA", "AGA(SA)": "SAICA", "PA(SA)": "SAIPA",
    "ACCA": "ACCA", "FCCA": "ACCA", "ACMA": "CIMA", "FCMA": "CIMA",
}


def infer_bodies(designations):
    bodies = []
    for d in designations:
        b = BODY_BY_DESIGNATION.get(d)
        if b and b not in bodies:
            bodies.append(b)
        elif d == "CGMA" and "CIMA" in designations and "CIMA" not in bodies:
            bodies.append("CIMA")
    if not bodies and designations == ["CGMA"]:
        bodies.append("UNKNOWN_OR_OTHER_RECOGNISED_ROUTE")
    return bodies


def build(spec):
    des = spec["des"]
    status = spec.get("status", "CONFIRMED")
    bodies = spec.get("body", infer_bodies(des))
    srcs = spec.get("source_urls", [])
    primary = spec.get("primary_source") or (srcs[0] if srcs else None)
    rec = {
        "date_first_found": spec.get("date", TODAY),
        "date_last_verified": spec.get("verified", TODAY),
        "status": status,
        "first_name": spec["first"],
        "surname": spec["surname"],
        "full_name": spec["name"],
        "alternate_names": spec.get("alternate_names", []),
        "professionally_qualified": spec.get("qualified", "true"),
        "professional_designations": des,
        "professional_bodies": bodies,
        "designation_status": spec.get("designation_status",
                                       "CONFIRMED" if status == "CONFIRMED" else status),
        "qualification_confidence": spec.get("qualification_confidence",
                                       status if status in ("CONFIRMED", "HIGH", "PROBABLE") else "CONFIRMED"),
        "qualification_evidence": spec.get("evidence", ""),
        "academic_qualifications": spec.get("academic", []),
        "articles_completion_status": spec.get("articles_status",
                                               QUAL_NOT_EST if status == "CONFIRMED" else NOT_EST),
        "articles_body": spec.get("articles_body"),
        "articles_employer": spec.get("articles_employer"),
        "articles_period": spec.get("articles_period"),
        "articles_location": spec.get("articles_location"),
        "practical_experience_framework": spec.get("per"),
        "qualification_route": spec.get("route"),
        "current_title": spec.get("title"),
        "current_employer": spec.get("employer"),
        "current_role_family": spec.get("role_family"),
        "current_function": spec.get("function"),
        "current_role_start_date": spec.get("role_start"),
        "country": spec.get("country", "South Africa"),
        "province": spec.get("province"),
        "city": spec.get("city"),
        "suburb": spec.get("suburb"),
        "linkedin_location": spec.get("linkedin_location"),
        "location_confidence": spec.get("location_confidence", "UNCONFIRMED"),
        "current_industry": spec.get("industry"),
        "current_sub_industry": spec.get("sub_industry"),
        "historic_industry_exposure": spec.get("historic_industries", []),
        "skills_confirmed": spec.get("skills", []),
        "accounting_systems_confirmed": spec.get("acct_systems", []),
        "erp_systems_confirmed": spec.get("erp_systems", []),
        "analytics_tools_confirmed": spec.get("analytics_tools", []),
        "employer_systems_observed": spec.get("employer_systems", []),
        "career_history": spec.get("career", []),
        "estimated_years_experience": spec.get("yoe", "unknown"),
        "experience_estimate_basis": spec.get("yoe_basis", ""),
        "linkedin_url": spec.get("linkedin"),
        "other_profile_urls": spec.get("other_urls", []),
        "primary_source": primary,
        "source_urls": srcs,
        "confidence": status,
        "notes": spec.get("notes", ""),
        "booleans": {},
    }
    confirmed = status == "CONFIRMED"
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


def next_id(path, prefix):
    ids = load_existing_ids(path)
    return max([int(i.split("-")[1]) for i in ids] + [0]) + 1


def append_batch(people_specs, company_specs=None, source_specs=None, label="batch"):
    """people_specs: list of specs for build(); company/source_specs already full records."""
    existing_people = load_existing_ids(PEOPLE_PATH)
    pid = next_id(PEOPLE_PATH, "acc")
    people = []
    for spec in people_specs:
        rec = build(spec)
        rec["id"] = "acc-%04d" % pid
        pid += 1
        people.append(rec)
    n_p = append_records(PEOPLE_PATH, people, existing_people)

    n_c = n_s = 0
    if company_specs:
        n_c = append_records(COMPANIES_PATH, company_specs, load_existing_ids(COMPANIES_PATH))
    if source_specs:
        n_s = append_records(SOURCES_PATH, source_specs, load_existing_ids(SOURCES_PATH))

    regen_csv.main()

    allp = [json.loads(l) for l in open(PEOPLE_PATH) if l.strip()]
    confirmed = [p for p in allp if p["status"] == "CONFIRMED"]
    des_counts = Counter(d for p in confirmed for d in p.get("professional_designations", []))
    prov = Counter(p.get("province") for p in confirmed if p.get("province"))
    print(f"{label} — people added: {n_p} | companies: {n_c} | sources: {n_s}")
    print(f"DB totals: people={len(allp)} confirmed={len(confirmed)} high={sum(1 for p in allp if p['status']=='HIGH_CONFIDENCE')}")
    print(f"Confirmed designations: {dict(des_counts)}")
    print(f"Confirmed by province: {dict(prov)}")
    return people
