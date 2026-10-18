#!/usr/bin/env python3
"""Regenerate interim.csv from people.jsonl (one filterable row per person)."""
import csv
import json
import os
from collections import OrderedDict

BASE = os.path.dirname(os.path.abspath(__file__))
PEOPLE_PATH = os.path.join(BASE, "people.jsonl")
INTERIM_PATH = os.path.join(BASE, "interim.csv")

CSV_COLUMNS = [
    "First Name", "Surname", "Full Name", "Province", "City", "Current Title",
    "Current Employer", "Current Role Family", "Current Industry", "Sub-Industry",
    "Professionally Qualified", "Professional Designation(s)", "Professional Body/Bodies",
    "CA(SA)", "PA(SA)", "AGA(SA)", "ACCA", "FCCA", "ACMA", "FCMA", "CGMA",
    "Articles Status", "Articles Body", "Articles Employer", "Articles Period",
    "Practical Experience Framework", "Qualification Route", "Academic Qualifications",
    "Years Experience", "Group Accounting", "Consolidations", "Management Accounting",
    "Costing", "FP&A", "Commercial Finance", "Financial Control",
    "Finance Business Partnering", "Leadership", "Accounting Systems", "ERP Systems",
    "Analytics Tools", "Sage 300 / ACCPAC", "SAP", "Oracle", "Syspro",
    "Microsoft Dynamics", "Current Skills", "Historic Industries", "Previous Employers",
    "LinkedIn Profile", "Qualification Confidence", "Overall Confidence",
    "Primary Source", "Additional Sources", "Date Verified", "Notes",
]


def read_all(path):
    rows = []
    if os.path.exists(path):
        with open(path, "r") as f:
            for line in f:
                line = line.strip()
                if line:
                    rows.append(json.loads(line))
    return rows


def csv_row(p):
    b = p.get("booleans", {})
    career = p.get("career_history", [])
    skills = [s if isinstance(s, str) else s.get("skill", "") for s in p.get("skills_confirmed", [])]
    prev = "; ".join(f"{c.get('employer','')} ({c.get('title','')})" for c in career) or ""
    add_sources = "; ".join(u for u in p.get("source_urls", []) if u != p.get("primary_source"))
    return OrderedDict([
        ("First Name", p.get("first_name", "")),
        ("Surname", p.get("surname", "")),
        ("Full Name", p.get("full_name", "")),
        ("Province", p.get("province") or ""),
        ("City", p.get("city") or ""),
        ("Current Title", p.get("current_title") or ""),
        ("Current Employer", p.get("current_employer") or ""),
        ("Current Role Family", p.get("current_role_family") or ""),
        ("Current Industry", p.get("current_industry") or ""),
        ("Sub-Industry", p.get("current_sub_industry") or ""),
        ("Professionally Qualified", p.get("professionally_qualified", "unknown")),
        ("Professional Designation(s)", "; ".join(p.get("professional_designations", []))),
        ("Professional Body/Bodies", "; ".join(p.get("professional_bodies", []))),
        ("CA(SA)", b.get("ca_sa", "unknown")),
        ("PA(SA)", b.get("pa_sa", "unknown")),
        ("AGA(SA)", b.get("aga_sa", "unknown")),
        ("ACCA", b.get("acca", "unknown")),
        ("FCCA", b.get("fcca", "unknown")),
        ("ACMA", b.get("acma", "unknown")),
        ("FCMA", b.get("fcma", "unknown")),
        ("CGMA", b.get("cgma", "unknown")),
        ("Articles Status", p.get("articles_completion_status", "")),
        ("Articles Body", p.get("articles_body") or ""),
        ("Articles Employer", p.get("articles_employer") or ""),
        ("Articles Period", p.get("articles_period") or ""),
        ("Practical Experience Framework", p.get("practical_experience_framework") or ""),
        ("Qualification Route", p.get("qualification_route") or ""),
        ("Academic Qualifications", "; ".join(p.get("academic_qualifications", []))),
        ("Years Experience", p.get("estimated_years_experience", "")),
        ("Group Accounting", b.get("group_accounting", "unknown")),
        ("Consolidations", b.get("consolidations", "unknown")),
        ("Management Accounting", b.get("management_accounting", "unknown")),
        ("Costing", b.get("cost_accounting", "unknown")),
        ("FP&A", b.get("fpa", "unknown")),
        ("Commercial Finance", b.get("commercial_finance", "unknown")),
        ("Financial Control", b.get("financial_control", "unknown")),
        ("Finance Business Partnering", b.get("finance_business_partnering", "unknown")),
        ("Leadership", b.get("leadership", "unknown")),
        ("Accounting Systems", "; ".join(p.get("accounting_systems_confirmed", []))),
        ("ERP Systems", "; ".join(p.get("erp_systems_confirmed", []))),
        ("Analytics Tools", "; ".join(p.get("analytics_tools_confirmed", []))),
        ("Sage 300 / ACCPAC", b.get("sage300_accpac", "unknown")),
        ("SAP", b.get("sap", "unknown")),
        ("Oracle", b.get("oracle", "unknown")),
        ("Syspro", b.get("syspro", "unknown")),
        ("Microsoft Dynamics", b.get("dynamics", "unknown")),
        ("Current Skills", "; ".join(skills)),
        ("Historic Industries", "; ".join(p.get("historic_industry_exposure", []))),
        ("Previous Employers", prev),
        ("LinkedIn Profile", p.get("linkedin_url") or ""),
        ("Qualification Confidence", p.get("qualification_confidence", "")),
        ("Overall Confidence", p.get("confidence", "")),
        ("Primary Source", p.get("primary_source") or ""),
        ("Additional Sources", add_sources),
        ("Date Verified", p.get("date_last_verified", "")),
        ("Notes", p.get("notes", "")),
    ])


def main():
    with open(INTERIM_PATH, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_COLUMNS)
        writer.writeheader()
        for p in read_all(PEOPLE_PATH):
            writer.writerow(csv_row(p))
    print(f"interim.csv written with {len(read_all(PEOPLE_PATH))} rows.")


if __name__ == "__main__":
    main()
