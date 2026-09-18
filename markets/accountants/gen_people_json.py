#!/usr/bin/env python3
"""Regenerate the web-UI export (people.json) from the append-only research DB.

people.jsonl is the source of truth. This script derives a lean, camelCased
people.json consumed by the website's Accounting & Finance track
(src/data/accountantsPeople.ts). It never overwrites the JSONL research stores.

Run after every batch:  python3 gen_people_json.py
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "people.jsonl")
OUT = os.path.join(HERE, "people.json")

# Rejected records never reach the website; everything retained in the research
# DB (CONFIRMED / HIGH_CONFIDENCE / ARTICLES_CONFIRMED_DESIGNATION_UNVERIFIED /
# CONFLICTING) is published with its status carried through so the UI can label it.
EXCLUDED_STATUSES = {"REJECTED"}


def clean_list(values):
    """Normalise a research-DB list to a de-duplicated list of display strings.

    Some stores hold plain strings (e.g. erp_systems_confirmed) and some hold
    objects (e.g. skills_confirmed -> {"skill": ..., "confidence": ...}). Both
    collapse to a clean string list for the UI.
    """
    seen = []
    for value in values or []:
        if isinstance(value, dict):
            value = value.get("skill") or value.get("system") or value.get("tool") or value.get("name") or ""
        if isinstance(value, str):
            value = value.strip()
        if value and value not in seen:
            seen.append(value)
    return seen


def career_history(rows):
    history = []
    for row in rows or []:
        history.append(
            {
                "employer": row.get("employer") or "",
                "title": row.get("title") or "",
                "notes": row.get("notes") or "",
            }
        )
    return history


def to_record(row):
    return {
        "id": row["id"],
        "fullName": row["full_name"],
        "status": row.get("status") or "",
        "confidence": row.get("confidence") or "",
        "designations": clean_list(row.get("professional_designations")),
        "bodies": clean_list(row.get("professional_bodies")),
        "title": row.get("current_title") or "",
        "employer": row.get("current_employer") or "",
        "roleFamily": row.get("current_role_family") or "",
        "function": row.get("current_function") or "",
        "industry": row.get("current_industry") or "",
        "subIndustry": row.get("current_sub_industry") or "",
        "province": row.get("province") or "",
        "city": row.get("city") or "",
        "country": row.get("country") or "South Africa",
        "locationConfidence": row.get("location_confidence") or "",
        "skills": clean_list(row.get("skills_confirmed")),
        "accountingSystems": clean_list(row.get("accounting_systems_confirmed")),
        "erpSystems": clean_list(row.get("erp_systems_confirmed")),
        "analyticsTools": clean_list(row.get("analytics_tools_confirmed")),
        "yearsExperience": row.get("estimated_years_experience") or "unknown",
        "qualificationEvidence": row.get("qualification_evidence") or "",
        "articlesStatus": row.get("articles_completion_status") or "",
        "articlesEmployer": row.get("articles_employer") or "",
        "articlesBody": row.get("articles_body") or "",
        "careerHistory": career_history(row.get("career_history")),
        "linkedinUrl": row.get("linkedin_url") or "",
        "primarySource": row.get("primary_source") or "",
        "sourceUrls": clean_list(row.get("source_urls")),
        "notes": row.get("notes") or "",
    }


def main():
    rows = []
    with open(SRC, encoding="utf-8") as handle:
        for line in handle:
            line = line.strip()
            if not line:
                continue
            row = json.loads(line)
            if row.get("status") in EXCLUDED_STATUSES:
                continue
            rows.append(to_record(row))

    rows.sort(key=lambda record: (record["fullName"].lower(), record["id"]))

    with open(OUT, "w", encoding="utf-8") as handle:
        json.dump(rows, handle, ensure_ascii=False, indent=2)
        handle.write("\n")

    print(f"wrote {len(rows)} records to {OUT}")


if __name__ == "__main__":
    main()
