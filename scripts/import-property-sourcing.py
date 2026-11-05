#!/usr/bin/env python3
"""
Import property/construction CA(SA) sourcing data into the maps repo.

Reads from the 8 uploaded CSV files, deduplicates against existing
markets/accountants/people.json, and produces updated data files.

Run from repo root:
    python3 -I scripts/import-property-sourcing.py
"""

import csv
import json
import re
import sys
import os
from collections import OrderedDict
from datetime import date

# ---------- paths ----------
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PEOPLE_PATH = os.path.join(REPO, "markets", "accountants", "people.json")
ORGS_PATH = os.path.join(REPO, "markets", "organizations", "organizations.json")

UPLOADS = "/mnt/user-data/uploads"
PROD02_CANDIDATES = os.path.join(UPLOADS, "a73a3768-production-02-candidates.csv")
PROD02_VERIFICATION = os.path.join(UPLOADS, "0bb581f3-production-02-verification-queue.csv")
PROD01_COMPANIES = os.path.join(UPLOADS, "d638114d-production-01-companies.csv")
PROD01_CANDIDATES = os.path.join(UPLOADS, "8966a3bf-production-01-candidates.csv")
PROD01_CONTACTS = os.path.join(UPLOADS, "e8a9c835-production-01-contact-priority.csv")

TODAY = date.today().isoformat()


# ---------- helpers ----------

def norm_name(n):
    return re.sub(r"\s+", " ", n.strip().lower())


def norm_linkedin(url):
    if not url:
        return ""
    url = url.strip().lower().rstrip("/")
    url = url.split("?")[0]
    return url


def read_csv(path):
    with open(path, "r", encoding="utf-8-sig") as f:
        return list(csv.DictReader(f))


# ---------- load existing data ----------

with open(PEOPLE_PATH, "r") as f:
    existing_people = json.load(f)

with open(ORGS_PATH, "r") as f:
    existing_orgs = json.load(f)

# Build lookup indexes
name_to_people = {}
linkedin_to_person = {}
existing_ids = set()
max_id_num = 0

for p in existing_people:
    nn = norm_name(p["fullName"])
    name_to_people.setdefault(nn, []).append(p)
    lu = norm_linkedin(p.get("linkedinUrl", ""))
    if lu:
        linkedin_to_person[lu] = p
    existing_ids.add(p["id"])
    m = re.match(r"acc-(\d+)", p["id"])
    if m:
        max_id_num = max(max_id_num, int(m.group(1)))

org_name_to_org = {}
for o in existing_orgs:
    org_name_to_org[o["name"].lower()] = o
    for alias in o.get("aliases", []):
        org_name_to_org[alias.lower()] = o

next_id = max_id_num + 1


def new_acc_id():
    global next_id
    result = f"acc-{next_id:04d}"
    next_id += 1
    return result


# ---------- read CLOSED exclusions ----------

closed_names = set()
closed_reasons = {}
verification_rows = read_csv(PROD02_VERIFICATION)
for row in verification_rows:
    priority = row.get("priority", "")
    if "CLOSED" in priority.upper():
        name = row.get("name", "").strip()
        # Only exclude "not CA(SA)" and "outside Western Cape" — not "added to roster"
        reason_lower = priority.lower()
        if "not ca(sa)" in reason_lower or "outside western cape" in reason_lower or "not finance" in reason_lower:
            closed_names.add(norm_name(name))
            closed_reasons[norm_name(name)] = priority

print(f"CLOSED exclusions (not CA(SA) / outside WC): {len(closed_names)}")
for nn, reason in closed_reasons.items():
    print(f"  {nn}: {reason}")


# ---------- read production-02 candidates (main roster) ----------

prod02 = read_csv(PROD02_CANDIDATES)
print(f"\nProduction-02 candidates loaded: {len(prod02)}")


# ---------- seniority mapping ----------

SENIORITY_MAP = {
    "C-SUITE": "C-Suite",
    "OWNER/EXEC": "C-Suite",
    "HEAD": "Executive",
    "SENIOR MANAGER": "Lead / Manager",
    "MANAGER": "Lead / Manager",
    "ANALYST/ACCOUNTANT": "Professional / Specialist",
    "BOARD/NED": "Board / NED",
    "UNKNOWN": "",
}


def map_seniority(raw):
    return SENIORITY_MAP.get(raw.strip().upper(), raw.strip())


# ---------- role family inference ----------

def infer_role_family(title):
    t = title.lower()
    if "cfo" in t or "chief financial" in t:
        return "CFO / Group Finance Executive"
    if "financial director" in t or "finance director" in t:
        return "Financial Director"
    if "head of finance" in t or "head: finance" in t:
        return "Head of Finance"
    if "financial manager" in t or "finance manager" in t or "group financial manager" in t:
        return "Financial Manager"
    if "financial controller" in t or "group controller" in t:
        return "Financial Controller"
    if "accountant" in t or "reporting" in t:
        return "Operational Finance"
    if "asset manage" in t:
        return "Asset Management"
    if "portfolio manage" in t:
        return "Investment / Portfolio"
    if "director" in t:
        return "Executive / Director"
    if "chairman" in t or "chairperson" in t:
        return "Board / Governance"
    return "Finance"


# ---------- industry from sector_tier ----------

TIER_INDUSTRY_MAP = {
    "A": "Property Development",
    "B": "Construction",
    "C": "Building Materials / Construction Supplies",
    "D": "Property Investment / REIT",
    "E": "Residential Estate / Body Corporate",
    "F": "Development Finance / Property Finance",
    "X": "Property-experienced (outside sector)",
}


def extract_tier(sector_tier):
    if not sector_tier:
        return "", ""
    m = re.match(r"([A-Z])\s*[-–—]\s*(.*)", sector_tier.strip())
    if m:
        tier_letter = m.group(1)
        detail = m.group(2).strip()
        industry = TIER_INDUSTRY_MAP.get(tier_letter, detail)
        return industry, detail
    # Try D/A style
    m2 = re.match(r"([A-Z])/([A-Z])\s*[-–—]\s*(.*)", sector_tier.strip())
    if m2:
        tier_letter = m2.group(1)
        detail = m2.group(3).strip()
        industry = TIER_INDUSTRY_MAP.get(tier_letter, detail)
        return industry, detail
    return sector_tier.strip(), ""


# ---------- build new candidates ----------

new_candidates = []
updated_count = 0
skipped_closed = 0
skipped_duplicate = 0
enriched_existing = []

for row in prod02:
    name = row.get("name", "").strip()
    if not name:
        continue

    nn = norm_name(name)

    # Skip CLOSED exclusions
    if nn in closed_names:
        skipped_closed += 1
        continue

    linkedin = row.get("linkedin_url", "").strip()
    nl = norm_linkedin(linkedin)

    # Check for existing match
    match = None
    if nl and nl in linkedin_to_person:
        match = linkedin_to_person[nl]
    elif nn in name_to_people:
        match = name_to_people[nn][0]

    if match:
        # Enrich existing entry with property-sourcing data
        skipped_duplicate += 1
        # Add source_batch attribute to mark property sourcing enrichment
        attrs = match.get("attributes", {}) or {}
        existing_batches = attrs.get("source_batch", "")
        if "bellville-property-sourcing" not in (existing_batches or ""):
            if existing_batches:
                attrs["source_batch"] = existing_batches + ", bellville-property-sourcing-2026-11"
            else:
                attrs["source_batch"] = "bellville-property-sourcing-2026-11"
            match["attributes"] = attrs

            # Enrich industry if empty
            if not match.get("industry"):
                industry, sub = extract_tier(row.get("sector_tier", ""))
                if industry:
                    match["industry"] = industry
                    if sub:
                        match["subIndustry"] = sub

            # Enrich notes with property context
            employer_basis = row.get("employer_basis", "").strip()
            if employer_basis and employer_basis not in (match.get("notes", "") or ""):
                existing_notes = match.get("notes", "") or ""
                match["notes"] = (existing_notes + " " + f"[Property sourcing] {employer_basis}").strip()

            enriched_existing.append(match["id"])
        continue

    # New candidate - build AccountantCandidate record
    employer = row.get("employer", "").strip()
    title = row.get("title", "").strip()
    location = row.get("location", "").strip()
    ca_sa_status = row.get("ca_sa_status", "").strip()
    ca_sa_evidence = row.get("ca_sa_evidence", "").strip()
    sector_tier = row.get("sector_tier", "").strip()
    employer_basis = row.get("employer_basis", "").strip()
    role_evidence = row.get("role_evidence", "").strip()
    seniority_raw = row.get("seniority_band", "").strip()
    priority_band = row.get("priority_band", "").strip()
    priority_reason = row.get("priority_reason", "").strip()
    mobility = row.get("mobility_signal", "").strip()
    reports_to = row.get("reports_to", "").strip()
    tenure_current = row.get("tenure_current_role", "").strip()
    priority_score = row.get("priority_score", "").strip()

    # Parse location
    city = ""
    province = "Western Cape"
    country = "South Africa"
    if location:
        parts = [p.strip() for p in location.split(",")]
        if len(parts) >= 2:
            city = parts[0]
            province = parts[1] if len(parts) >= 2 else "Western Cape"
            if len(parts) >= 3:
                country = parts[2]

    # Determine status
    if ca_sa_status.upper() == "CONFIRMED":
        status = "FINANCE_ROLE_CONFIRMED"
        confidence = "CONFIRMED"
        designation_status = "CONFIRMED"
        qualification_confidence = "HIGH"
    elif ca_sa_status.upper() == "PROBABLE":
        status = "FINANCE_ROLE_CONFIRMED"
        confidence = "PROBABLE"
        designation_status = "PROBABLE"
        qualification_confidence = "MEDIUM"
    else:
        status = "PENDING_VERIFICATION"
        confidence = "UNVERIFIED"
        designation_status = "PENDING_VERIFICATION"
        qualification_confidence = "LOW"

    industry, sub_industry = extract_tier(sector_tier)

    # Location confidence
    loc_conf = "CONFIRMED"
    if "(to verify)" in location.lower() or "to verify" in location.lower():
        loc_conf = "UNVERIFIED"

    # Build career history from role_evidence
    career = []
    if role_evidence:
        # Parse role evidence entries separated by semicolons
        for entry in role_evidence.split(";"):
            entry = entry.strip()
            if entry:
                career.append({
                    "employer": employer,
                    "title": entry.split("(")[0].strip() if "(" in entry else entry,
                    "notes": entry
                })

    # Source URLs
    source_urls = []
    if linkedin:
        source_urls.append(linkedin)
    search_query = row.get("search_query_used", "").strip()

    # Build notes
    notes_parts = []
    if employer_basis:
        notes_parts.append(f"Employer: {employer_basis}")
    if priority_band:
        notes_parts.append(f"Priority: {priority_band}")
    if priority_reason:
        notes_parts.append(f"Scoring: {priority_reason}")
    if mobility:
        notes_parts.append(f"Mobility: {mobility}")
    if reports_to:
        notes_parts.append(f"Reports to: {reports_to}")
    notes = "; ".join(notes_parts)

    candidate = OrderedDict([
        ("id", new_acc_id()),
        ("fullName", name),
        ("alternateNames", []),
        ("status", status),
        ("confidence", confidence),
        ("roleScopeStatus", "IN_SCOPE"),
        ("professionallyQualified", "CA(SA)" if ca_sa_status.upper() == "CONFIRMED" else "unknown"),
        ("designationStatus", designation_status),
        ("qualificationConfidence", qualification_confidence),
        ("academicQualifications", []),
        ("designations", ["CA(SA)"] if ca_sa_status.upper() in ("CONFIRMED", "PROBABLE") else []),
        ("professionalRoutes", ["SAICA Articles"] if ca_sa_status.upper() == "CONFIRMED" else []),
        ("bodies", ["SAICA"] if ca_sa_status.upper() == "CONFIRMED" else []),
        ("title", title),
        ("employer", employer),
        ("currentCompanyAffiliations", [{
            "company": employer,
            "relationship": "current employer",
            "evidence_url": linkedin or ""
        }] if employer else []),
        ("seniority", map_seniority(seniority_raw)),
        ("roleFamily", infer_role_family(title)),
        ("function", infer_role_family(title)),
        ("industry", industry),
        ("subIndustry", sub_industry),
        ("province", province),
        ("city", city),
        ("country", country),
        ("locationConfidence", loc_conf),
        ("skills", []),
        ("accountingSystems", []),
        ("erpSystems", []),
        ("analyticsTools", []),
        ("yearsExperience", tenure_current if tenure_current else "unknown"),
        ("qualificationEvidence", ca_sa_evidence),
        ("articlesStatus", "PENDING_ENRICHMENT"),
        ("articlesEmployer", ""),
        ("articlesBody", ""),
        ("articlesPeriod", ""),
        ("articlesLocation", ""),
        ("practicalExperienceFramework", ""),
        ("qualificationRoute", ""),
        ("careerHistory", career),
        ("linkedinUrl", linkedin),
        ("primarySource", linkedin or ""),
        ("sourceUrls", source_urls),
        ("dateLastVerified", TODAY),
        ("notes", notes),
        ("attributes", {
            "source_batch": "bellville-property-sourcing-2026-11",
            "source_reported": True,
            "sector_tier": sector_tier,
            "priority_band": priority_band,
            "priority_score": priority_score,
        }),
    ])

    new_candidates.append(candidate)


print(f"\nResults:")
print(f"  New candidates to add: {len(new_candidates)}")
print(f"  Existing enriched: {len(enriched_existing)}")
print(f"  Skipped (CLOSED): {skipped_closed}")
print(f"  Skipped (duplicate): {skipped_duplicate}")


# ---------- build new organizations ----------

# Read company data from production-01-companies.csv
prod01_companies = read_csv(PROD01_COMPANIES)
print(f"\nProduction-01 companies: {len(prod01_companies)}")

new_orgs = []
for co in prod01_companies:
    company_name = co.get("Company", "").strip()
    if not company_name:
        continue

    # Check if already exists
    if company_name.lower() in org_name_to_org:
        continue

    industry = co.get("Industry", "").strip()
    location = co.get("Location", "").strip()
    evidence_urls = co.get("Evidence_URLs", "").strip()
    fully_researched = co.get("Fully_Researched", "").strip()
    research_status = co.get("Finance-Function_Research_Status", "").strip()

    # Parse location
    loc_parts = [p.strip() for p in location.split(",")]
    city = loc_parts[0] if loc_parts else ""
    province = loc_parts[1] if len(loc_parts) > 1 else ""

    # Generate org ID
    slug = re.sub(r"[^a-z0-9]+", "-", company_name.lower()).strip("-")
    org_id = f"org-{slug}"

    # Parse evidence URLs
    sources = []
    if evidence_urls:
        for url in evidence_urls.split(";"):
            url = url.strip()
            if url:
                sources.append({
                    "url": url,
                    "type": "recruiter-supplied",
                    "evidence": f"Company research for {company_name}",
                    "checkedOn": TODAY,
                })

    # Map industry to taxonomy
    ind_lower = industry.lower()
    primary_node = "PROP-DEV"
    if "construction" in ind_lower:
        primary_node = "CON-GEN"
    elif "reit" in ind_lower or "investment" in ind_lower:
        primary_node = "PROP-INV"
    elif "material" in ind_lower or "building" in ind_lower:
        primary_node = "CON-MAT"
    elif "finance" in ind_lower or "lending" in ind_lower:
        primary_node = "FIN-PROP"
    elif "estate" in ind_lower or "body corporate" in ind_lower:
        primary_node = "PROP-MGMT"

    org = OrderedDict([
        ("id", org_id),
        ("name", company_name),
        ("legalName", ""),
        ("aliases", []),
        ("website", ""),
        ("status", "active" if fully_researched.upper() == "YES" else "needs-verification"),
        ("industries", [industry] if industry else []),
        ("taxonomy", {
            "primaryNode": primary_node,
            "secondaryNodes": [],
            "confidence": "probable",
            "evidence": research_status or f"Property sector company in {location}",
            "sourceUrl": sources[0]["url"] if sources else "",
            "checkedOn": TODAY,
        }),
        ("capabilities", []),
        ("locations", [{
            "city": city,
            "province": province,
            "country": "South Africa",
            "type": "head-office",
        }] if city else []),
        ("scale", []),
        ("parentId", None),
        ("sources", sources),
        ("datasets", ["bellville-property-sourcing-2026-11"]),
        ("lastVerified", TODAY),
        ("notes", research_status or ""),
    ])

    new_orgs.append(org)
    org_name_to_org[company_name.lower()] = org

# Also add orgs from new candidates that aren't in the org registry
for c in new_candidates:
    employer = c["employer"]
    if not employer:
        continue
    if employer.lower() in org_name_to_org:
        continue

    slug = re.sub(r"[^a-z0-9]+", "-", employer.lower()).strip("-")
    org_id = f"org-{slug}"

    sector_tier = c.get("attributes", {}).get("sector_tier", "")
    industry, sub = extract_tier(sector_tier)

    org = OrderedDict([
        ("id", org_id),
        ("name", employer),
        ("legalName", ""),
        ("aliases", []),
        ("website", ""),
        ("status", "needs-verification"),
        ("industries", [industry] if industry else []),
        ("taxonomy", {
            "primaryNode": "PROP-DEV",
            "secondaryNodes": [],
            "confidence": "inferred",
            "evidence": f"Employer of {c['fullName']} in property sourcing",
            "sourceUrl": "",
            "checkedOn": TODAY,
        }),
        ("capabilities", []),
        ("locations", [{
            "city": c.get("city", ""),
            "province": c.get("province", "Western Cape"),
            "country": "South Africa",
            "type": "head-office",
        }] if c.get("city") else []),
        ("scale", []),
        ("parentId", None),
        ("sources", []),
        ("datasets", ["bellville-property-sourcing-2026-11"]),
        ("lastVerified", TODAY),
        ("notes", ""),
    ])

    new_orgs.append(org)
    org_name_to_org[employer.lower()] = org


print(f"New organizations to add: {len(new_orgs)}")
for o in new_orgs[:10]:
    print(f"  {o['name']}")
if len(new_orgs) > 10:
    print(f"  ... and {len(new_orgs) - 10} more")


# ---------- write updated files ----------

# Merge new candidates into existing
all_people = existing_people + new_candidates

# Sort by ID
all_people.sort(key=lambda p: p["id"])

with open(PEOPLE_PATH, "w") as f:
    json.dump(all_people, f, indent=2, ensure_ascii=False)
    f.write("\n")

print(f"\nWrote {len(all_people)} people to {PEOPLE_PATH}")

# Merge new orgs
all_orgs = existing_orgs + new_orgs
all_orgs.sort(key=lambda o: o["id"])

with open(ORGS_PATH, "w") as f:
    json.dump(all_orgs, f, indent=2, ensure_ascii=False)
    f.write("\n")

print(f"Wrote {len(all_orgs)} organizations to {ORGS_PATH}")

# Summary
print(f"\n{'='*60}")
print(f"IMPORT SUMMARY")
print(f"{'='*60}")
print(f"Source: Bellville CA(SA) property/construction sourcing")
print(f"Date: {TODAY}")
print(f"Production-02 candidates processed: {len(prod02)}")
print(f"New candidates added: {len(new_candidates)}")
print(f"Existing entries enriched: {len(enriched_existing)}")
print(f"Closed/excluded: {skipped_closed}")
print(f"Duplicate (already existed): {skipped_duplicate - len(enriched_existing)}")
print(f"New organizations added: {len(new_orgs)}")
print(f"Total people now: {len(all_people)}")
print(f"Total organizations now: {len(all_orgs)}")
