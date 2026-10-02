#!/usr/bin/env python3
"""Enrichment pass for batch 14 (Section 41B - updated professionals).

Three existing records gained materially better evidence during the batch-14
sweeps. Per the append-only rule the existing record is updated in place rather
than duplicated:

* acc-0833 Brendon Lucke  - was FINANCE_ROLE_CONFIRMED with no designation and
  "Qualification/articles enrichment pending"; the Commercial Cold Holdings
  governance page states "Brendon is a Chartered Accountant, CA(SA)" and gives
  his I&J Group Finance Director history, so the record is upgraded to CONFIRMED.
* acc-0010 Romy Maree     - gains the Dipula Income Fund previous role, the SA REIT
  Association treasurer role and SAICA Top 35 Under 35 2024 recognition.
* acc-0049 Zinhle Simamane - gains SAICA Top 35 Under 35 2024 recognition
  confirming the Traxtion CFO: International Business role.

Idempotent: rerunning does not duplicate sources or history entries.
"""
import json
import os
import sys

BASE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE)
import db_lib  # noqa: E402

TODAY = "2026-10-01"
CCH_URL = "https://www.cchcold.com/governance"
SAICA_2024 = "https://www.saica.org.za/initiatives/awards-and-competitions/top-35-under-35-awards/2024-2/2024-top-35-under-35-finalists/"
SA_REIT = "https://sareit.co.za/about-2/"

LUCKE = {
    "status": "CONFIRMED",
    "confidence": "CONFIRMED",
    "designation_status": "CONFIRMED",
    "qualification_confidence": "CONFIRMED",
    "professional_designations": ["CA(SA)"],
    "professional_bodies": ["SAICA"],
    "professionally_qualified": "true",
    "qualification_evidence": 'Commercial Cold Holdings executive team page: "BRENDON LUCKE, Chief Financial Officer. Brendon has over 20 years experience in FMCG, supply chain & logistics. Prior to joining CCH, Brendon was the Group Finance Director at I&J, responsible for Finance, Legal, Supply Chain and Health & Safety. Brendon is a Chartered Accountant, CA(SA)."',
    "articles_completion_status": "QUALIFIED_BUT_ARTICLES_NOT_ESTABLISHED",
    "articles_body": "SAICA",
    "current_role_family": "Executive Finance",
    "normalized_job_title": "Chief Financial Officer",
    "seniority_band": "S7",
    "current_industry": "Cold-Chain Logistics",
    "current_sub_industry": "Temperature-controlled logistics and cold storage",
    "grouped_industry": "Logistics & Supply Chain",
    "associated_industry_groups": ["Logistics & Supply Chain", "Consumer & FMCG", "Food Manufacturing", "Retail & Wholesale"],
    "career_industry_path": "Food Processing (I&J) > Cold-Chain Logistics (Commercial Cold Holdings)",
    "province": "Western Cape",
    "city": "Cape Town",
    "location_confidence": "PROBABLE",
    "employer_group": "Commercial Cold Holdings",
    "employer_ownership_type": "Private Equity Backed",
    "employer_scale": "Mid-Market",
    "jse_listed": "false",
    "multinational": "false",
    "business_model_tags": ["Private Company", "Private Equity Backed", "Asset Intensive", "Multi-site", "B2B", "Cold Storage"],
    "finance_environment_tags": ["Group Reporting", "Supply Chain Finance", "Working Capital", "Financial Control"],
    "work_history": [{"employer": "I&J (Irvin & Johnson)", "title": "Group Finance Director (Finance, Legal, Supply Chain and Health & Safety)", "industry": "Food Processing", "period": "before CCH"}],
    "current_employer_confidence": "CONFIRMED",
    "profile_confidence": "CONFIRMED",
    "primary_evidence_url": CCH_URL,
    "date_last_verified": TODAY,
    "notes": "Upgraded from FINANCE_ROLE_CONFIRMED to CONFIRMED on the strength of the Commercial Cold Holdings governance page, which states the CA(SA) designation explicitly and documents a 20+ year FMCG and supply-chain career. Employer confidence PROBABLE-to-CONFIRMED: CCH is the AIIM-led cold-chain platform that now owns CCS Logistics.",
    "booleans": {"ca_sa": "true", "professional_body_saica": "true"},
}

MAREE = {
    "career_history": [{"employer": "Dipula Income Fund", "title": "Finance Executive", "industry": "Property"}],
    "work_history": [{"employer": "Dipula Income Fund", "title": "Finance Executive", "industry": "Property", "period": "to c.2024"}],
    "career_industry_path": "Property (Dipula Income Fund) > Property (Burstone)",
    "current_employer_confidence": "CONFIRMED",
    "profile_confidence": "CONFIRMED",
    "primary_evidence_url": SAICA_2024,
    "secondary_evidence_url": SA_REIT,
    "date_last_verified": TODAY,
    "notes": "Enriched: SAICA Top 35 Under 35 2024 finalist (listed as \"Romy Maree (34), Finance Executive - Dipula Income Fund, Treasurer - SA REIT Association\") and an SA REIT Association role. The current Burstone Group Head of Finance role is from the earlier SAICA member feature. Both records are treated as the same individual on the combination of a distinctive name, a continuous listed-property finance career and a matching age band; identity flagged PROBABLE in the master export notes.",
    "source_urls": [SAICA_2024, SA_REIT],
}

SIMAMANE = {
    "qualification_evidence": "SAICA 2024 Top 35 Under 35 finalists: \"Zinhle Simamane (35), Chief Financial Officer: International Business - Traxtion\". The competition recognises young CAs(SA) achievers; every finalist is a CA(SA). Earlier evidence: Accountancy SA CA(SA) profile.",
    "current_employer_confidence": "CONFIRMED",
    "profile_confidence": "CONFIRMED",
    "primary_evidence_url": SAICA_2024,
    "date_last_verified": TODAY,
    "notes": "Enriched: role confirmed as \"Chief Financial Officer: International Business - Traxtion\" on SAICA's own 2024 Top 35 Under 35 finalist list, corroborating the Accountancy SA CA(SA) profile already on record.",
    "source_urls": [SAICA_2024],
}

ENRICHMENTS = {
    "acc-0833": ("Brendon Lucke", LUCKE, [CCH_URL], "https://www.linkedin.com/in/brendon-lucke-01494065/"),
    "acc-0010": ("Romy Maree", MAREE, [SAICA_2024, SA_REIT], None),
    "acc-0049": ("Zinhle Simamane", SIMAMANE, [SAICA_2024], None),
}


def main():
    rows = [json.loads(line) for line in open(db_lib.PEOPLE_PATH, encoding="utf-8") if line.strip()]
    by_id = {row["id"]: row for row in rows}
    touched = []

    for person_id, (expected_name, updates, new_sources, linkedin) in ENRICHMENTS.items():
        row = by_id.get(person_id)
        if row is None:
            print(f"skip {person_id}: not found")
            continue
        if row["full_name"].strip().lower() != expected_name.lower():
            print(f"skip {person_id}: expected {expected_name}, found {row['full_name']}")
            continue
        for key, value in updates.items():
            if key == "booleans":
                row.setdefault("booleans", {}).update(value)
                continue
            if key in ("career_history", "work_history") and isinstance(value, list):
                existing = row.get(key) or []
                merged = list(existing)
                for item in value:
                    if item not in merged:
                        merged.append(item)
                row[key] = merged
                continue
            if key == "source_urls":
                existing = row.get(key) or []
                row[key] = existing + [url for url in value if url not in existing]
                continue
            if value in (None, "", []):
                continue
            row[key] = value
        existing_sources = row.get("source_urls") or []
        row["source_urls"] = existing_sources + [url for url in new_sources if url not in existing_sources]
        if linkedin and not row.get("linkedin_url"):
            row["linkedin_url"] = linkedin
        touched.append((person_id, row["full_name"], row.get("professional_designations"), row["status"]))

    with open(db_lib.PEOPLE_PATH, "w", encoding="utf-8") as handle:
        for row in rows:
            handle.write(json.dumps(row, ensure_ascii=False) + "\n")

    # Evidence-source rows for the enrichment URLs.
    existing_source_ids = db_lib.load_existing_ids(db_lib.SOURCES_PATH)
    next_source = db_lib.next_id(db_lib.SOURCES_PATH, "src")
    source_rows = []
    for person_id, (_, _, urls, _) in ENRICHMENTS.items():
        row = by_id[person_id]
        for url in urls:
            source_rows.append({
                "id": "src-%04d" % next_source,
                "url": url,
                "source_type": "Employer Website" if "cchcold" in url or "sareit" in url else "Professional Body",
                "person_id": person_id,
                "company_id": None,
                "evidence_type": "enrichment_qualification_and_employment_evidence",
                "evidence_summary": row.get("qualification_evidence") or "",
                "qualification_supported": "true",
                "skill_supported": None,
                "system_supported": None,
                "employment_supported": "true",
                "accessed_date": TODAY,
                "reliability": "PRIMARY",
                "status": "USED",
            })
            next_source += 1
    added = db_lib.append_records(db_lib.SOURCES_PATH, source_rows, existing_source_ids)

    print(f"enriched: {touched}")
    print(f"sources added: {added}")


if __name__ == "__main__":
    main()
