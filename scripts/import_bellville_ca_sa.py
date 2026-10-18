#!/usr/bin/env python3
"""
Import Bellville CA(SA) recruitment source data into markets/accountants/people.jsonl

Usage:
  python3 scripts/import_bellville_ca_sa.py <csv_file> [--batch-id BATCH_ID] [--commit]

Input CSV schema (21 columns):
  Full Name, Employer / last evidenced, Role / last evidenced, Sector, Location,
  CA(SA) evidence status, 8+ finance years, Research tier, Fit assessment,
  Profile / qualification URL, Additional source, Current status / verification gap,
  Outreach status, Last checked, Suggested wave, CA(SA) evidence class,
  8+ finance experience test, Western Cape / Bellville location test,
  Specific project finance evidence, Verification action, Research provenance

Output: appends to markets/accountants/people.jsonl as JSONL records
(one JSON object per line, matching the existing people.jsonl schema)
"""

import csv
import json
import sys
import argparse
from datetime import datetime
from pathlib import Path
import re

# ─── NON-NEGOTIABLE FIELDS ────────────────────────────────────────────────────
# Every candidate record MUST carry these before it can be written to
# people.jsonl. They are the fields the /accounting-finance screening view
# treats as always-present. An upload that cannot populate all of them is
# rejected: the import aborts rather than land a half-blank record. "id" is
# assigned downstream for this source, so it is validated only when present.
# If a future source genuinely lacks one of these, fix the source or the
# mapping — do not weaken this list.
REQUIRED_FIELDS = (
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


def validate_record(record):
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


# Map CSV columns to people.jsonl fields
def parse_ca_evidence(evidence_status_cell):
    """Extract CA(SA) designation and source type from the evidence status cell.

    Format: "source_type: quoted_evidence_text"
    Example: "Company website team page: As the CFO of AVIEW Properties since May 2023,
             Lindsey Makrygiannis, a qualified CA(SA) with 20+ years' global experience"
    """
    if not evidence_status_cell or ':' not in evidence_status_cell:
        return None, None

    source_type, evidence = evidence_status_cell.split(':', 1)
    return source_type.strip(), evidence.strip()


def extract_years_from_string(text):
    """Extract years of experience from text.

    Looks for patterns like "20+ years", "20 years", "20+" etc.
    Returns integer if found, else None.
    """
    if not text:
        return None

    # Look for "N+ years", "N years", or just "N+"
    match = re.search(r'(\d+)\+?\s*(?:years?|yrs?)?', text, re.IGNORECASE)
    if match:
        try:
            return int(match.group(1))
        except ValueError:
            return None
    return None


def parse_location(location_cell, sector_cell):
    """Extract location components from the location cell.

    Format: "City (Description)" or "City" or "Unconfirmed (hint)"
    Returns: (city, province, country)
    """
    if not location_cell or 'Unconfirmed' in location_cell:
        return None, None, 'South Africa'

    # Extract city from before parentheses
    city = location_cell.split('(')[0].strip()

    # Try to infer province from city
    province_map = {
        'Cape Town': 'Western Cape',
        'Bellville': 'Western Cape',
        'Tyger Valley': 'Western Cape',
        'Durbanville': 'Western Cape',
        'Stellenbosch': 'Western Cape',
        'Paarl': 'Western Cape',
        'Somerset West': 'Western Cape',
        'Johannesburg': 'Gauteng',
        'Sandton': 'Gauteng',
        'Midrand': 'Gauteng',
        'Pretoria': 'Gauteng',
        'Durban': 'KwaZulu-Natal',
    }

    province = province_map.get(city, None)

    return city if city else None, province, 'South Africa'


def parse_designation_evidence_class(evidence_class_cell):
    """Map the evidence class to booleans.

    Possible values: "Explicit CA(SA) — LinkedIn headline/profile",
                     "Explicit CA(SA) — published by employer/regulator/press",
                     "Described as \"chartered accountant\" — no (SA) marker in source",
                     "Implied by SAICA Top 35-under-35 CA(SA) competition listing..."
    """
    if not evidence_class_cell:
        return False, False, False, 'UNCONFIRMED'

    if 'Explicit' in evidence_class_cell or 'Published CA(SA)' in evidence_class_cell:
        return True, False, False, 'CONFIRMED'
    elif 'Described as' in evidence_class_cell or 'CA(SA) published' in evidence_class_cell:
        return False, True, False, 'UNCONFIRMED'
    elif 'Implied' in evidence_class_cell:
        return False, False, True, 'UNCONFIRMED'

    return False, False, False, 'UNCONFIRMED'


def parse_sector(sector_cell):
    """Map the sector to current_industry and sub_industry."""
    if not sector_cell:
        return None, None

    # Map common sectors from Bellville recruitment context
    sector_map = {
        'Residential property development': ('Real Estate & Property Development', 'Residential Development'),
        'Property development': ('Real Estate & Property Development', 'Property Development'),
        'Property investment': ('Real Estate & Property Development', 'Property Investment'),
        'Property finance': ('Financial Services', 'Property Finance'),
        'Infrastructure finance': ('Financial Services', 'Infrastructure Finance'),
        'Construction': ('Construction', 'General Construction'),
        'Capital projects': ('Construction', 'Project Management'),
    }

    industry, sub = sector_map.get(sector_cell, (sector_cell, None))
    return industry, sub


def build_person_record(row, batch_id, source_urls):
    """Build a person record matching people.jsonl schema from a CSV row."""

    full_name = row.get('Full Name', '').strip()
    if not full_name:
        return None

    # Parse name into first and surname
    name_parts = full_name.rsplit(' ', 1)
    first_name = name_parts[0].strip() if name_parts else ''
    surname = name_parts[1].strip() if len(name_parts) > 1 else ''

    # Parse CA evidence
    source_type, evidence_quote = parse_ca_evidence(row.get('CA(SA) evidence status', ''))

    # Parse location
    city, province, country = parse_location(
        row.get('Location', ''),
        row.get('Sector', '')
    )

    # Parse experience
    exp_text = row.get('8+ finance years', '')
    years_exp = extract_years_from_string(exp_text)

    # Parse sector
    industry, sub_industry = parse_sector(row.get('Sector', ''))

    # Parse designation evidence class
    is_explicit, is_described, is_implied, qual_confidence = parse_designation_evidence_class(
        row.get('CA(SA) evidence class', '')
    )

    # Build profile URLs
    profile_url = row.get('Profile / qualification URL', '').strip()
    additional_url = row.get('Additional source', '').strip()
    source_urls_list = [profile_url] if profile_url else []
    if additional_url and additional_url != profile_url:
        # Handle multiple URLs separated by semicolon
        for url in additional_url.split(';'):
            url = url.strip()
            if url and url not in source_urls_list:
                source_urls_list.append(url)

    # Location confidence: based on Western Cape / Bellville location test
    location_test = row.get('Western Cape / Bellville location test', '').lower()
    if 'evidence of western cape' in location_test or 'western cape link indicated' in location_test:
        location_confidence = 'HIGH'
    elif 'unconfirmed' in location_test:
        location_confidence = 'UNCONFIRMED'
    else:
        location_confidence = 'UNCONFIRMED'

    # Research tier maps to designation_status
    research_tier = row.get('Research tier', '')
    if 'A —' in research_tier:
        designation_status = 'CONFIRMED'
    else:
        designation_status = 'UNCONFIRMED'

    # Fit assessment -> summary
    fit_assessment = row.get('Fit assessment', '')

    # Build the record matching people.jsonl schema
    record = {
        'date_first_found': row.get('Last checked', '').strip(),
        'date_last_verified': row.get('Last checked', '').strip(),
        'status': 'CONFIRMED' if is_explicit else 'NEEDS_VERIFICATION',
        'first_name': first_name,
        'surname': surname,
        'full_name': full_name,
        'alternate_names': [],
        'professionally_qualified': 'true' if is_explicit else 'unknown',
        'professional_designations': ['CA(SA)'] if (is_explicit or is_implied) else ['Chartered Accountant'],
        'professional_bodies': ['SAICA'] if is_explicit else [],
        'designation_status': designation_status,
        'qualification_confidence': qual_confidence,
        'qualification_evidence': f"{source_type}: {evidence_quote}" if source_type and evidence_quote else 'See source URLs',
        'academic_qualifications': [],
        'articles_completion_status': 'UNKNOWN',
        'articles_body': None,
        'articles_employer': None,
        'articles_period': None,
        'articles_location': None,
        'practical_experience_framework': None,
        'qualification_route': None,
        'current_title': row.get('Role / last evidenced', '').strip(),
        'current_employer': row.get('Employer / last evidenced', '').strip(),
        'current_role_family': row.get('Sector', '').strip(),  # Use sector as role family
        'current_function': None,
        'current_role_start_date': None,
        'country': country,
        'province': province,
        'city': city,
        'suburb': None,
        'linkedin_location': None,
        'location_confidence': location_confidence,
        'current_industry': industry,
        'current_sub_industry': sub_industry,
        'historic_industry_exposure': [],
        'skills_confirmed': [],
        'accounting_systems_confirmed': [],
        'erp_systems_confirmed': [],
        'analytics_tools_confirmed': [],
        'employer_systems_observed': [],
        'career_history': [],
        'estimated_years_experience': f"{years_exp}+" if years_exp else 'unknown',
        'experience_estimate_basis': row.get('8+ finance experience test', '').strip(),
        'linkedin_url': None,
        'other_profile_urls': [],
        'primary_source': source_urls_list[0] if source_urls_list else None,
        'source_urls': source_urls_list,
        'confidence': 'CONFIRMED' if is_explicit else 'HIGH' if is_described else 'MEDIUM',
        'notes': f"{row.get('Suitability Assessment', '')} | Wave: {row.get('Suggested wave', '')} | {row.get('Current status / verification gap', '')}".replace('|  |', '|').strip('| '),
        'booleans': {
            'ca_sa': 'true' if (is_explicit or is_implied) else 'false',
            'pa_sa': 'false',
            'aga_sa': 'false',
            'acca': 'false',
            'fcca': 'false',
            'acma': 'false',
            'fcma': 'false',
            'cgma': 'false',
            'saica_articles_confirmed': 'false',
            'saipa_articles_confirmed': 'false',
            'acca_per_confirmed': 'false',
            'cima_per_confirmed': 'false',
        },
        'current_company_affiliations': [],
        # Custom attributes for recruitment sourcing
        'attributes': {
            'recruitment_source': 'Wave 2 Bellville Project Finance Search',
            'research_provenance': row.get('Research provenance', '').strip(),
            'fit_assessment': fit_assessment,
            'project_finance_evidence': row.get('Specific project finance evidence', '').strip(),
            'designation_evidence_class': row.get('CA(SA) evidence class', '').strip(),
            'batch_id': batch_id,
        }
    }

    # Generate ID (will be reconciled against existing records)
    # Format: full-name-hash or use the ingest workflow to assign IDs
    record['id'] = None  # Will be assigned during deduplication

    return record


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('csv_file', help='Path to the Bellville CA(SA) CSV file')
    parser.add_argument('--batch-id', default='wave-2-bellville-2026-10-17', help='Batch ID for this import')
    parser.add_argument('--commit', action='store_true', help='Actually append to people.jsonl (default: dry-run)')
    args = parser.parse_args()

    csv_path = Path(args.csv_file)
    if not csv_path.exists():
        print(f'Error: CSV file not found: {csv_path}', file=sys.stderr)
        sys.exit(1)

    jsonl_path = Path('markets/accountants/people.jsonl')
    if not jsonl_path.exists():
        print(f'Error: people.jsonl not found at {jsonl_path}', file=sys.stderr)
        sys.exit(1)

    # Read CSV and convert to records
    records = []
    with open(csv_path, encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for i, row in enumerate(reader, start=2):
            record = build_person_record(row, args.batch_id, [])
            if record:
                validate_record(record)
                records.append(record)
                print(f'✓ {record["full_name"]} ({record["current_employer"]})', file=sys.stderr)
            else:
                print(f'✗ Row {i}: skipped (missing Full Name)', file=sys.stderr)

    print(f'\nConverted {len(records)} records from {csv_path.name}', file=sys.stderr)

    if args.commit:
        # Append to people.jsonl
        with open(jsonl_path, 'a', encoding='utf-8') as f:
            for record in records:
                f.write(json.dumps(record, ensure_ascii=False) + '\n')
        print(f'✓ Appended {len(records)} records to {jsonl_path}', file=sys.stderr)
        print(f'\nNext steps:')
        print(f'  1. python3 markets/accountants/gen_people_json.py  # Regenerate people.json')
        print(f'  2. npm run accountants:casa-export  # Update CA(SA) inventory')
        print(f'  3. npm run build  # Rebuild the search index')
    else:
        # Dry-run: print first record as sample
        print('\nDry-run: first record sample:', file=sys.stderr)
        if records:
            print(json.dumps(records[0], indent=2, ensure_ascii=False))
        print(f'\nRe-run with --commit to actually append to people.jsonl', file=sys.stderr)


if __name__ == '__main__':
    main()
