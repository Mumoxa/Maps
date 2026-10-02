#!/usr/bin/env python3
"""Project the append-only CA(SA) research DB into the master output schema.

Produces, from `people.jsonl` + `industry_taxonomy.json`:

* `master_ca_sa.jsonl` / `master_ca_sa.csv` - one row per CA(SA) person, using the
  Section 32 master output schema of the CA(SA) master research instruction.
* `coverage_matrix.json` - Section 39 coverage indicators (geography, seniority,
  grouped industry) computed from the same records.

Derivation rules (no fabrication):

* Classification fields (normalised title, seniority band, grouped industry,
  associated industry groups, employer group, career industry path) come from
  `taxonomy.py` and are always derived from evidenced fields.
* Enum-like fields (JSE listed, multinational, ownership, scale, tags) are carried
  through only when the record already holds them; otherwise `Unknown`.
* Anything not established stays `Unknown` (Section 30).
"""
import csv
import json
import os

import db_lib
import taxonomy

BASE = os.path.dirname(os.path.abspath(__file__))
MASTER_JSONL = os.path.join(BASE, "master_ca_sa.jsonl")
MASTER_CSV = os.path.join(BASE, "master_ca_sa.csv")
COVERAGE = os.path.join(BASE, "coverage_matrix.json")

UNKNOWN = "Unknown"

COLUMNS = [
    "Person ID", "First Name", "Surname", "Full Name", "CA(SA) Confirmed",
    "Qualification Evidence", "Current Job Title", "Normalized Job Title",
    "Seniority Band", "Current Employer", "Employer Group", "Division / Subsidiary",
    "City", "Metro / Region", "Province", "Country", "LinkedIn URL",
    "Primary Industry", "Industry Subsector", "Grouped Industry",
    "Associated Industry Group 1", "Associated Industry Group 2",
    "Associated Industry Group 3", "Associated Industry Group 4",
    "Employer Ownership Type", "Employer Scale", "JSE Listed", "Multinational",
    "Finance Environment Tags", "Business Model Tags", "Audit / Training Firm",
    "Articles", "Qualification Year", "University", "Career Industry Path",
    "Previous Employer 1", "Previous Title 1", "Previous Industry 1",
    "Previous Employer 2", "Previous Title 2", "Previous Industry 2",
    "Current Employer Confidence", "Profile Confidence",
    "Primary Evidence URL", "Secondary Evidence URL", "Last Verified Date",
    "Research Notes",
]

METRO_MAP = taxonomy.METRO_MAP  # config lives in industry_taxonomy.json


UNIVERSITY_TOKENS = (
    "university", "universiteit", "uct", "wits", "unisa", "stellenbosch", "ukzn",
    "north-west", "north west", "free state", "rhodes", "nelson mandela", "fort hare",
    "johannesburg", "pretoria", "cape peninsula", "university of technology",
    "rau", "rand afrikaans",
)


def bool_string(value):
    """Normalise research-DB booleans ('true'/'false'/'unknown'/real bools)."""
    if isinstance(value, bool):
        return "true" if value else "false"
    text = (value or "").strip().lower()
    if text in ("true", "yes", "y"):
        return "true"
    if text in ("false", "no", "n"):
        return "false"
    return "unknown"


def ca_sa_confirmed(row):
    """CA(SA) status for the master export, in Section 25 confidence language."""
    if "CA(SA)" not in (row.get("professional_designations") or []):
        return "No"
    booleans = row.get("booleans") or {}
    explicit = bool_string(booleans.get("ca_sa"))
    if explicit == "false":
        return "No"
    status = (row.get("designation_status") or row.get("status") or "").upper()
    if status in ("CONFIRMED",):
        return "CONFIRMED"
    if status in ("HIGH_CONFIDENCE", "HIGH"):
        return "PROBABLE"
    if status in ("PROBABLE", "UNCONFIRMED", "UNKNOWN", ""):
        return "HYPOTHESIS"
    return "UNKNOWN"


def university(row):
    for entry in row.get("academic_qualifications") or []:
        text = entry if isinstance(entry, str) else json.dumps(entry)
        if any(token in text.lower() for token in UNIVERSITY_TOKENS):
            return text
    return UNKNOWN


def metro(city, province):
    """Metro / region label; Unknown when the city is not evidenced or not mapped."""
    return taxonomy.metro_region(city)


def articles_text(row):
    status = row.get("articles_completion_status") or "NOT_ESTABLISHED"
    body = row.get("articles_body") or ""
    employer = row.get("articles_employer") or ""
    period = row.get("articles_period") or ""
    parts = []
    if body:
        parts.append(f"{body} articles")
    if employer:
        parts.append(f"at {employer}")
    if period:
        parts.append(f"({period})")
    label = " ".join(parts) if parts else ""
    if status in ("CONFIRMED_EXPLICIT", "TRAINING_CONTRACT_CONFIRMED"):
        return label or "Articles confirmed"
    if status == "QUALIFIED_BUT_ARTICLES_NOT_ESTABLISHED":
        return label or "Qualified; articles route not established"
    if status in ("NOT_ESTABLISHED", "", None):
        return "Not established"
    return label or status


def previous_roles(row, count=2):
    """Most recent prior roles from work_history (fallback: career_history)."""
    history = [item for item in (row.get("work_history") or []) if isinstance(item, dict)]
    if not history:
        history = [item for item in (row.get("career_history") or []) if isinstance(item, dict)]
    current = (row.get("current_employer") or "").strip().lower()
    prior = [item for item in history if (item.get("employer") or "").strip().lower() != current]
    prior = list(reversed(prior))
    roles = []
    for item in prior[:count]:
        roles.append((
            item.get("employer") or UNKNOWN,
            item.get("title") or UNKNOWN,
            item.get("industry") or UNKNOWN,
        ))
    while len(roles) < count:
        roles.append((UNKNOWN, UNKNOWN, UNKNOWN))
    return roles


def to_master_row(row):
    derived = taxonomy.classify(row)
    employer = row.get("current_employer") or UNKNOWN
    groups = derived["associated_industry_groups"]
    groups = (groups + [UNKNOWN] * 4)[:4]
    prev = previous_roles(row)
    business_tags = taxonomy.evidence_backed_tags(row, "business_model_tags", taxonomy.TAXONOMY["business_model_tags"])
    finance_tags = taxonomy.evidence_backed_tags(row, "finance_environment_tags", taxonomy.TAXONOMY["finance_environment_tags"])
    return {
        "Person ID": row["id"],
        "First Name": row.get("first_name") or UNKNOWN,
        "Surname": row.get("surname") or UNKNOWN,
        "Full Name": row.get("full_name") or UNKNOWN,
        "CA(SA) Confirmed": ca_sa_confirmed(row),
        "Qualification Evidence": row.get("qualification_evidence") or UNKNOWN,
        "Current Job Title": row.get("current_title") or UNKNOWN,
        "Normalized Job Title": derived["normalized_job_title"],
        "Seniority Band": f'{derived["seniority_band"]} — {derived["seniority_label"]}' if derived["seniority_band"] != UNKNOWN else UNKNOWN,
        "Current Employer": employer,
        "Employer Group": row.get("employer_group") or derived["employer_group"],
        "Division / Subsidiary": row.get("division_subsidiary") or UNKNOWN,
        "City": row.get("city") or UNKNOWN,
        "Metro / Region": metro(row.get("city"), row.get("province")),
        "Province": row.get("province") or UNKNOWN,
        "Country": row.get("country") or "South Africa",
        "LinkedIn URL": row.get("linkedin_url") or "Unknown",
        "Primary Industry": derived["primary_industry"],
        "Industry Subsector": derived["industry_subsector"],
        "Grouped Industry": derived["grouped_industry"],
        "Associated Industry Group 1": groups[0],
        "Associated Industry Group 2": groups[1],
        "Associated Industry Group 3": groups[2],
        "Associated Industry Group 4": groups[3],
        "Employer Ownership Type": row.get("employer_ownership_type") or UNKNOWN,
        "Employer Scale": row.get("employer_scale") or UNKNOWN,
        "JSE Listed": bool_string(row.get("jse_listed")) if row.get("jse_listed") is not None else "unknown",
        "Multinational": bool_string(row.get("multinational")) if row.get("multinational") is not None else "unknown",
        "Finance Environment Tags": "; ".join(finance_tags) if finance_tags else UNKNOWN,
        "Business Model Tags": "; ".join(business_tags) if business_tags else UNKNOWN,
        "Audit / Training Firm": row.get("articles_employer") or UNKNOWN,
        "Articles": articles_text(row),
        "Qualification Year": row.get("qualification_year") or UNKNOWN,
        "University": university(row),
        "Career Industry Path": derived["career_industry_path"],
        "Previous Employer 1": prev[0][0],
        "Previous Title 1": prev[0][1],
        "Previous Industry 1": prev[0][2],
        "Previous Employer 2": prev[1][0],
        "Previous Title 2": prev[1][1],
        "Previous Industry 2": prev[1][2],
        "Current Employer Confidence": row.get("current_employer_confidence") or UNKNOWN,
        "Profile Confidence": row.get("profile_confidence") or row.get("confidence") or UNKNOWN,
        "Primary Evidence URL": row.get("primary_evidence_url") or row.get("primary_source") or UNKNOWN,
        "Secondary Evidence URL": row.get("secondary_evidence_url") or UNKNOWN,
        "Last Verified Date": row.get("date_last_verified") or UNKNOWN,
        "Research Notes": (row.get("notes") or "").strip() or UNKNOWN,
    }


def coverage(rows, master_rows):
    from collections import Counter

    by_province = Counter(r["Province"] for r in master_rows)
    by_band = Counter(r["Seniority Band"].split(" — ")[0] for r in master_rows)
    by_group = Counter(r["Grouped Industry"] for r in master_rows)
    by_industry = Counter(r["Primary Industry"] for r in master_rows)
    by_confidence = Counter(r["CA(SA) Confirmed"] for r in master_rows)
    return {
        "generated_from": "markets/accountants/people.jsonl",
        "ca_sa_records": len(master_rows),
        "all_person_records": len(rows),
        "by_ca_sa_confidence": dict(by_confidence),
        "by_province": dict(by_province.most_common()),
        "by_seniority_band": dict(sorted(by_band.items())),
        "by_grouped_industry": dict(by_group.most_common()),
        "by_primary_industry": dict(by_industry.most_common()),
    }


def main():
    rows = []
    with open(db_lib.PEOPLE_PATH, encoding="utf-8") as handle:
        for line in handle:
            line = line.strip()
            if not line:
                continue
            row = json.loads(line)
            if row.get("status") == "REJECTED":
                continue
            rows.append(row)

    master_rows = [to_master_row(row) for row in rows if ca_sa_confirmed(row) in ("CONFIRMED", "PROBABLE", "HYPOTHESIS")]

    with open(MASTER_JSONL, "w", encoding="utf-8") as handle:
        for row in master_rows:
            handle.write(json.dumps(row, ensure_ascii=False) + "\n")
    with open(MASTER_CSV, "w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=COLUMNS)
        writer.writeheader()
        for row in master_rows:
            writer.writerow(row)
    with open(COVERAGE, "w", encoding="utf-8") as handle:
        json.dump(coverage(rows, master_rows), handle, ensure_ascii=False, indent=2)
        handle.write("\n")

    print(f"master_ca_sa: {len(master_rows)} CA(SA) records from {len(rows)} person records")
    print(f"wrote {MASTER_JSONL}, {MASTER_CSV}, {COVERAGE}")


if __name__ == "__main__":
    main()
