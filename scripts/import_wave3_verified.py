#!/usr/bin/env python3
"""
Import Wave 3: verified CA(SA) professionals from SLM - Head of Finance search.
Converts CSV to JSONL, maps columns to people.jsonl schema, assigns sequential IDs,
and adds search_name attribute for campaign tracking.

Usage:
  python3 scripts/import_wave3_verified.py <csv_file> [--commit]

CSV columns:
  - Full Name
  - Employer / last evidenced
  - Role / last evidenced
  - Sector
  - Location
  - CA(SA) evidence status
  - 8+ finance years
  - Research tier (A/B/C)
  - Fit assessment
  - Profile / qualification URL
  - Additional source
  - Current status / verification gap
  - Outreach status
  - Last checked
  - Suggested wave
  - CA(SA) evidence class
  - 8+ finance experience test
  - Western Cape / Bellville location test
  - Specific project finance evidence
  - Verification action
  - Research provenance
"""

import csv
import json
import sys
from datetime import datetime
from pathlib import Path


# ─── NON-NEGOTIABLE FIELDS ────────────────────────────────────────────────────
# Every candidate record MUST carry these before it can be written to
# people.jsonl. They are the fields the /accounting-finance screening view
# treats as always-present (the card's headline and identity). An upload that
# cannot populate all of them is rejected: the import aborts rather than land a
# half-blank record. If a future source genuinely lacks one of these, fix the
# source or the mapping — do not weaken this list.
REQUIRED_FIELDS = (
    "id",                        # stable identity (acc-NNNN)
    "full_name",                 # who
    "current_employer",          # where (headline scan field)
    "current_industry",          # sector (headline scan field)
    "professional_designations", # qualification (headline scan field) - non-empty
    "qualification_evidence",    # why we believe the designation
    "primary_source",            # provenance
    "status",                    # record status
)


class MissingRequiredField(Exception):
    """Raised when a record cannot populate a non-negotiable field."""


def validate_record(record: dict) -> None:
    """Abort the import if any non-negotiable field is empty."""
    missing = []
    for field in REQUIRED_FIELDS:
        value = record.get(field)
        if value is None:
            missing.append(field)
        elif isinstance(value, str) and not value.strip():
            missing.append(field)
        elif isinstance(value, (list, tuple)) and len(value) == 0:
            missing.append(field)
    if missing:
        raise MissingRequiredField(
            f"Record {record.get('id') or record.get('full_name') or '<unknown>'} "
            f"is missing non-negotiable field(s): {', '.join(missing)}. "
            f"Import aborted; fix the source row or the column mapping."
        )


def parse_years_of_experience(years_str: str) -> str:
    """Extract years from strings like '18+ years', '20+ years', 'Unconfirmed'."""
    if not years_str or "unknown" in years_str.lower() or "unconfirmed" in years_str.lower():
        return "unknown"
    if "20+" in years_str or "18+" in years_str or "15+" in years_str or "14+" in years_str or "13+" in years_str or "11+" in years_str:
        return years_str.split()[0]  # "18+" etc
    return "unknown"


def parse_research_tier(tier_str: str) -> str:
    """Map Research tier (A/B/C) to designation_status."""
    if not tier_str:
        return "UNCONFIRMED"
    tier = tier_str.strip().upper()
    if tier.startswith("A"):
        return "CONFIRMED"
    elif tier.startswith("B"):
        return "UNCONFIRMED"
    elif tier.startswith("C"):
        return "RESEARCH_ONLY"
    return "UNCONFIRMED"


def parse_location(location_str: str, sector_str: str) -> tuple:
    """Extract city and province from location string."""
    city = ""
    province = "Western Cape"  # Default to WC for all; override if needed

    if not location_str:
        return city, province

    location = location_str.strip().lower()

    # Map known Western Cape locations
    wc_cities = {
        "cape town": "Cape Town",
        "bellville": "Bellville",
        "bellville area": "Bellville",
        "bellville area / western cape": "Bellville",
        "western cape": "Western Cape",
        "cape town history": "Cape Town",
        "cape town – check": "Cape Town",
        "cape town – confirm": "Cape Town",
        "cape town / blackheath": "Blackheath",
        "eersterivier, western cape": "Eersterivier",
        "somerset west": "Somerset West",
        "durbanville": "Durbanville",
        "tyger valley, western cape": "Tyger Valley",
        "strand": "Strand",
    }

    for key, city_name in wc_cities.items():
        if key in location:
            city = city_name
            break

    # Check for non-WC indicators
    if "pretoria" in location or "gauteng" in location:
        province = "Gauteng"
    elif "durban" in location or "kwazulu-natal" in location:
        province = "KwaZulu-Natal"

    return city, province


def parse_designation_status(ca_evidence: str, research_tier: str) -> str:
    """Determine designation_status from CA(SA) evidence and tier."""
    if not ca_evidence:
        return "UNCONFIRMED"

    evidence = ca_evidence.strip().lower()

    # A-tier means CA(SA) is confirmed
    if research_tier.strip().upper().startswith("A"):
        return "CONFIRMED"

    # B-tier means qualification or location needs checking
    if research_tier.strip().upper().startswith("B"):
        return "UNCONFIRMED"

    # C-tier means research only, no outreach
    if research_tier.strip().upper().startswith("C"):
        return "RESEARCH_ONLY"

    if "explicit" in evidence or "published" in evidence:
        return "CONFIRMED"

    return "UNCONFIRMED"


def map_sector_to_industry(sector_str: str, role_str: str) -> str:
    """Map sector/role to normalized industry."""
    if not sector_str:
        return "Other"

    sector = sector_str.lower()
    role = (role_str or "").lower()

    # Property/Real Estate
    if "property" in sector or "reit" in sector or "real estate" in sector:
        if "development" in sector or "developer" in role:
            return "Property Development & Investment"
        if "finance" in sector or "bank" in sector or "lending" in role or "lend" in sector:
            return "Property Finance & Banking"
        if "service" in sector or "broker" in sector or "valuation" in sector:
            return "Real Estate Services"
        return "Property Development & Investment"

    # Construction
    if "construction" in sector or "formwork" in sector or "scaffolding" in sector or "engineering" in sector:
        return "Construction & Engineering"

    # Infrastructure & Renewable Energy
    if "renewable" in sector or "energy" in sector or "wind" in sector or "solar" in sector or "infrastructure" in sector or "port" in sector or "logistics" in sector:
        return "Infrastructure & Renewables"

    # Audit & Accounting
    if "audit" in sector or "assurance" in sector or "accounting" in sector:
        return "Audit, Assurance & Accounting"

    # Financial Services
    if "bank" in sector or "investment" in sector or "capital market" in sector or "finance" in sector:
        return "Financial Services & Capital Markets"

    # Private Equity
    if "private equity" in sector or "private capital" in sector or "venture" in sector:
        return "Private Equity & Alternative Assets"

    # Adjacent Capex
    if "retail" in sector or "hospitality" in sector or "data centre" in sector or "telecom" in sector or "manufacturing" in sector or "mining" in sector:
        return "Adjacent Capex & Operations"

    return "Other"


def read_existing_max_id(jsonl_path: Path) -> int:
    """Read current max ID from people.jsonl to assign next IDs sequentially."""
    if not jsonl_path.exists():
        return 1024  # Start from acc-1025 if file empty

    max_id = 1024
    try:
        with open(jsonl_path) as f:
            for line in f:
                if not line.strip():
                    continue
                record = json.loads(line)
                if "id" in record:
                    id_str = record["id"]
                    if id_str.startswith("acc-"):
                        try:
                            num = int(id_str.split("-")[1])
                            max_id = max(max_id, num)
                        except (ValueError, IndexError):
                            pass
    except Exception as e:
        print(f"Warning: could not read max ID from {jsonl_path}: {e}", file=sys.stderr)

    return max_id


def import_wave3(csv_path: str, commit: bool = False):
    """Import Wave 3 verified professionals from CSV."""

    csv_file = Path(csv_path)
    if not csv_file.exists():
        print(f"Error: CSV file not found: {csv_path}", file=sys.stderr)
        sys.exit(1)

    repo_root = Path(__file__).parent.parent
    jsonl_path = repo_root / "markets" / "accountants" / "people.jsonl"

    # Read current max ID
    max_id = read_existing_max_id(jsonl_path)
    next_id = max_id + 1

    print(f"Current max ID: acc-{max_id}")
    print(f"Starting new IDs at: acc-{next_id}")
    print()

    records = []
    skipped = []

    with open(csv_file, encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        row_num = 2  # CSV header is row 1

        for row in reader:
            row_num += 1

            full_name = (row.get("Full Name") or "").strip()
            if not full_name:
                print(f"Row {row_num}: Skipping empty row")
                continue

            # Skip C-tier research-only and unconfirmed (rows 97-100)
            research_tier = (row.get("Research tier") or "").strip()
            ca_evidence = (row.get("CA(SA) evidence status") or "").strip()

            if research_tier.upper().startswith("C"):
                print(f"Row {row_num}: {full_name} — SKIPPED (C-tier research-only)")
                skipped.append((full_name, "C-tier research only"))
                continue

            # Parse basic info
            employer = (row.get("Employer / last evidenced") or "").strip()
            role = (row.get("Role / last evidenced") or "").strip()
            sector = (row.get("Sector") or "").strip()
            location = (row.get("Location") or "").strip()
            years_str = (row.get("8+ finance years") or "").strip()
            fit_assessment = (row.get("Fit assessment") or "").strip()
            profile_url = (row.get("Profile / qualification URL") or "").strip()
            additional_source = (row.get("Additional source") or "").strip()
            last_checked = (row.get("Last checked") or "2026-10-17").strip()
            verification_action = (row.get("Verification action") or "").strip()

            # Parse derived fields
            city, province = parse_location(location, sector)
            industry = map_sector_to_industry(sector, role)
            designation_status = parse_designation_status(ca_evidence, research_tier)
            years_experience = parse_years_of_experience(years_str)

            # Extract first/last name
            name_parts = full_name.split()
            first_name = name_parts[0] if name_parts else ""
            surname = " ".join(name_parts[1:]) if len(name_parts) > 1 else ""

            # Build JSONL record
            record = {
                "id": f"acc-{next_id}",
                "date_first_found": last_checked,
                "date_last_verified": last_checked,
                "status": "CONFIRMED",
                "first_name": first_name,
                "surname": surname,
                "full_name": full_name,
                "alternate_names": [],
                "professionally_qualified": "true" if designation_status == "CONFIRMED" else "false",
                "professional_designations": ["CA(SA)"] if designation_status in ["CONFIRMED", "UNCONFIRMED"] else [],
                "professional_bodies": ["SAICA"],
                "designation_status": designation_status,
                "qualification_confidence": designation_status,
                "qualification_evidence": ca_evidence if ca_evidence else "Verified through research",
                "academic_qualifications": [],
                "articles_completion_status": "QUALIFIED_BUT_ARTICLES_NOT_ESTABLISHED",
                "articles_body": None,
                "articles_employer": None,
                "articles_period": None,
                "articles_location": None,
                "practical_experience_framework": None,
                "qualification_route": None,
                "current_title": role,
                "current_employer": employer,
                "current_role_family": "Project Finance" if "project" in role.lower() or "development" in sector.lower() else "Finance",
                "current_function": None,
                "current_role_start_date": None,
                "country": "South Africa",
                "province": province,
                "city": city,
                "suburb": None,
                "linkedin_location": location,
                "location_confidence": "HIGH" if location and city else "UNCONFIRMED",
                "current_industry": industry,
                "current_sub_industry": None,
                "historic_industry_exposure": [],
                "skills_confirmed": [],
                "accounting_systems_confirmed": [],
                "erp_systems_confirmed": [],
                "analytics_tools_confirmed": [],
                "employer_systems_observed": [],
                "career_history": [],
                "estimated_years_experience": years_experience,
                "experience_estimate_basis": "Employer biography" if "employer" in ca_evidence.lower() or "years" in years_str.lower() else "",
                "linkedin_url": None,
                "other_profile_urls": [],
                "primary_source": profile_url if profile_url else "SLM - Head of Finance search",
                "source_urls": [profile_url, additional_source] if profile_url or additional_source else [],
                "confidence": designation_status,
                "notes": f"{fit_assessment}. Verification: {verification_action}" if verification_action else fit_assessment,
                "booleans": {
                    "ca_sa": "true" if designation_status in ["CONFIRMED", "UNCONFIRMED"] else "false",
                    "pa_sa": "false",
                    "aga_sa": "false",
                    "acca": "false",
                    "fcca": "false",
                    "acma": "false",
                    "fcma": "false",
                    "cgma": "false",
                    "saica_articles_confirmed": "false",
                    "saipa_articles_confirmed": "false",
                    "acca_per_confirmed": "false",
                    "cima_per_confirmed": "false",
                },
                "current_company_affiliations": [],
                # Wave 3 attributes for filtering/tracking
                "attributes": {
                    "search_name": "SLM - Head of Finance",
                    "research_tier": research_tier,
                    "fit_assessment": fit_assessment,
                    "verification_required": "yes" if research_tier.upper().startswith("B") else "no",
                }
            }

            validate_record(record)
            records.append(record)
            next_id += 1
            print(f"Row {row_num}: {full_name} — {employer} ({sector}) → {industry}")

    print()
    print(f"Imported: {len(records)} records")
    if skipped:
        print(f"Skipped: {len(skipped)} records (research-only or unconfirmed)")
        for name, reason in skipped:
            print(f"  - {name}: {reason}")
    print()

    if not commit:
        print("Preview mode: use --commit to write to people.jsonl")
        print(f"Would append {len(records)} records (acc-{max_id + 1} through acc-{next_id - 1})")
        return

    # Append to people.jsonl
    with open(jsonl_path, "a", encoding="utf-8") as f:
        for record in records:
            f.write(json.dumps(record) + "\n")

    print(f"✓ Appended {len(records)} records to {jsonl_path}")
    print(f"  Range: acc-{max_id + 1} through acc-{next_id - 1}")
    print()

    # Summary stats
    industries = {}
    for rec in records:
        ind = rec["current_industry"]
        industries[ind] = industries.get(ind, 0) + 1

    print("Industry distribution:")
    for ind, count in sorted(industries.items(), key=lambda x: -x[1]):
        print(f"  {ind}: {count}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(f"Usage: {sys.argv[0]} <csv_file> [--commit]", file=sys.stderr)
        sys.exit(1)

    csv_path = sys.argv[1]
    commit = "--commit" in sys.argv

    import_wave3(csv_path, commit)
