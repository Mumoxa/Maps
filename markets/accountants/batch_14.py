#!/usr/bin/env python3
"""Batch 14 — Western Cape core NON-CA designations evidenced on FIRM WEBSITES / PROFESSIONAL-BODY
publications (employer-biography tier), session 3 (2026-09-21).

Sources:
- APBCO Auditors & Accountants — https://apbcoauditors.com/our-team/ (Paarl / Somerset West / Hermanus).
- MD Streets Accountants (Kenilworth, Cape Town) — "SAICA and SAIPA Honour's Roll"
  https://www.mdacc.co.za/about-us/honours-roll/ — column "Professional Accountants." with year of
  qualification. Establishes designation + firm at qualification; CURRENT employer NOT established.
- SAIPA Annual Integrated Report 2019 — board member biography (western region representative).

Also ENRICHES existing acc-0075 (Fatima Bapukee, Streets Director): the Honour's Roll lists her as
"Professional Accountants — 2012 (Director)" in addition to CA(SA) 2024 → add PA(SA)/SAIPA.
"""
import json
import os
import sys

BASE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE)
import db_lib  # noqa: E402

TODAY = "2026-09-21"
APBCO = "https://apbcoauditors.com/our-team/"
MDACC = "https://www.mdacc.co.za/about-us/honours-roll/"
SAIPA_AIR_2019 = "https://www.saipa.co.za/wp-content/uploads/2020/06/SAIPA-Annual-Integrated-Report-2019.pdf"

PEOPLE = []

# --------------------------------------------------------------------------- APBCO (firm team page)
APBCO_COMMON = dict(date=TODAY, verified=TODAY, industry="Accounting / Audit", sub_industry="Audit & accounting practice (SAIPA/SAICA)",
                    province="Western Cape", source_urls=[APBCO])
PEOPLE += [
    dict(name="Maggie Clark", first="Maggie", surname="Clark", des=["PA(SA)"], **APBCO_COMMON,
         title="Audit & Accounting Manager", employer="APBCO Auditors & Accountants (Paarl)", role_family="External Audit",
         city="Paarl", location_confidence="HIGH",
         evidence='Firm team page heading "MAGGIE CLARK — Professional Accountant (SA)"; bio: "qualified as a professional accountant during 2011"; Audit/Accounting Manager.',
         route="SAIPA → PA(SA) (2011)", yoe="15+", yoe_basis="qualified 2011",
         notes="Bio highlights accounting-systems / IT aptitude (system not named — NOT Sage 300 evidence)."),
    dict(name="Ovelia Engelbrecht", first="Ovelia", surname="Engelbrecht", des=["AGA(SA)"], **APBCO_COMMON,
         title="Assurance engagement lead / quality management", employer="APBCO Auditors & Accountants (Paarl)", role_family="External Audit",
         city="Paarl", location_confidence="HIGH",
         evidence='Firm team page heading "Associate General Accountant (SA)"; bio: "registered as an Associate General Accountant (SA) during 2023 … bachelor\'s degree in accounting from Stellenbosch University … 5+ years audit".',
         academic=["BAcc, Stellenbosch University"], route="SAICA → AGA(SA) (2023)", yoe="5-7", yoe_basis="bio: 5+ years audit"),
    dict(name="Louwtjie van Zyl", first="Louwtjie", surname="van Zyl", des=["PA(SA)"], status="HIGH_CONFIDENCE", qualification_confidence="HIGH", **APBCO_COMMON,
         title="Professional Accountant", employer="APBCO Accountants (Somerset West)", role_family="Financial Accounting",
         city="Somerset West", location_confidence="HIGH",
         evidence='Firm team page heading "Professional Accountant"; bio: "qualified as a professional accountant during 2009" — "(SA)" suffix NOT printed, hence HIGH not CONFIRMED.',
         route="SAIPA → PA(SA) (2009, inferred from firm wording)", yoe="15+", yoe_basis="qualified 2009",
         notes="Payroll, accounting, AFS, tax per bio. Do not confuse with Louwtjie Venter ACMA CGMA (Six33) — different person."),
    dict(name="Micaela Davids", first="Micaela", surname="Davids", des=["PA(SA)"], status="HIGH_CONFIDENCE", qualification_confidence="HIGH", **APBCO_COMMON,
         title="Accounting Manager", employer="APBCO Accountants (Somerset West)", role_family="Financial Accounting",
         city="Somerset West", location_confidence="HIGH",
         evidence='Firm team page: "Accounting Manager & Professional Accountant" — "(SA)" suffix NOT printed, hence HIGH not CONFIRMED.',
         route="SAIPA → PA(SA) (inferred from firm wording)"),
    dict(name="Vaughn Smal", first="Vaughn", surname="Smal", des=["PA(SA)"], **APBCO_COMMON,
         title="Director", employer="APBCO Auditors & Accountants", role_family="Executive Finance",
         city="Somerset West (2025 page) / Hermanus (2026 grouping)", location_confidence="PROBABLE",
         evidence='Firm team page: "Director … Honours degree in Management Accounting … certification in Independent Reviews. He qualified as a Professional Accountant (SA) in 2010 and is also a registered Professional Tax Practitioner (SA). 10+ years".',
         academic=["BCom Hons (Management Accounting)"], route="SAIPA → PA(SA) (2010); Professional Tax Practitioner (SA); Independent Reviews", yoe="15+", yoe_basis="qualified 2010",
         notes="Branch ambiguous between Somerset West (core scope) and Hermanus (Overberg — not excluded by brief but outside metro)."),
    dict(name="Stephen Hansen", first="Stephen", surname="Hansen", des=["PA(SA)"], **APBCO_COMMON,
         title="Professional Accountant", employer="APBCO Auditors & Accountants", role_family="Financial Accounting",
         city="Somerset West (2025 page) / Hermanus (2026 grouping)", location_confidence="PROBABLE",
         evidence='Firm team page: "Honours degrees in Accounting and Agricultural Economics … registered Professional Accountant (SA) and registered Professional Tax Practitioner (SA). 30+ years".',
         academic=["BCom Hons (Accounting)", "Hons (Agricultural Economics)"], route="SAIPA → PA(SA); Professional Tax Practitioner (SA)", yoe="30+", yoe_basis="bio: 30+ years",
         notes="Agri-economics background — relevant to Winelands/agri clients. Branch ambiguous (see Vaughn Smal)."),
]

# --------------------------------------------------------------------------- MD Streets Honour's Roll
HR_NOTE = ("Source is the firm's SAIPA Honour's Roll (designation + year qualified at MD Streets, Kenilworth). "
           "CURRENT employer/title NOT established — treat as 'qualified at MD Streets'; verify current role on LinkedIn.")
HR_COMMON = dict(date=TODAY, verified=TODAY, industry="Accounting / Audit", sub_industry="Accounting & audit practice (SAIPA/SAICA training office)",
                 province="Western Cape", city="Cape Town", suburb="Kenilworth (at qualification)", location_confidence="PROBABLE",
                 source_urls=[MDACC], role_family="Financial Accounting", articles_status="CONFIRMED_EXPLICIT", articles_body="SAIPA",
                 articles_employer="MD Streets Accountants (Kenilworth, Cape Town)", articles_location="Cape Town (Kenilworth)")


def hr(name, first, surname, year, **kw):
    yr = f" ({year})" if year else " (year not printed)"
    spec = dict(name=name, first=first, surname=surname, des=["PA(SA)"], **HR_COMMON,
                title="(current title not established)", employer=None,
                evidence=f'MD Streets "SAICA and SAIPA Honour\'s Roll" — column "Professional Accountants." lists "{name}"{yr}.',
                route=f"SAIPA training contract at MD Streets → PA(SA){yr}", articles_period=str(year) if year else None,
                career=[dict(employer="MD Streets Accountants (Kenilworth, Cape Town)", title="SAIPA trainee → Professional Accountant (SA)", notes=f"qualified{yr}")],
                notes=HR_NOTE)
    spec.update(kw)
    return spec


PEOPLE += [
    hr("Chadwin Lotters", "Chadwin", "Lotters", 2025),
    hr("Ivy Musindo", "Ivy", "Musindo", 2025),
    hr("Celine Saunders", "Celine", "Saunders", 2024),
    hr("Nicole Adams", "Nicole", "Adams", 2023),
    hr("Kelly Jacobs", "Kelly", "Jacobs", 2023),
    hr("Lauren Daniels", "Lauren", "Daniels", 2022),
    hr("Danie Haumann", "Danie", "Haumann", 2019,
       title="Accounting Associate (at MD Streets, per roll) — left MD Streets 2026",
       notes=HR_NOTE + " Roll annotates '(Accounting Associate)'. MD Streets LinkedIn 'final farewell after 23 years' post (2026) → no longer at the firm; may be retired."),
    hr("Emmanuel Nyamutumbu", "Emmanuel", "Nyamutumbu", 2019),
    hr("Malikah van Reenen", "Malikah", "van Reenen", 2019),
    hr("Jenine Harris", "Jenine", "Harris", 2019),
    hr("Zulpha Petersen", "Zulpha", "Petersen", 2017),
    hr("Lee-Ann Abrahamse", "Lee-Ann", "Abrahamse", None),
]

# --------------------------------------------------------------------------- SAIPA board (professional-body publication)
PEOPLE += [
    dict(name="Magdalena Smit", first="Magdalena", surname="Smit", alternate_names=["M Smit"], des=["PA(SA)"], date=TODAY, verified=TODAY,
         title="SAIPA Board member — Western Region representative (2019)", employer=None, role_family="Other",
         province="Western Cape", city="Western Region (city not stated)", location_confidence="PROBABLE",
         evidence='SAIPA Annual Integrated Report 2019, board biographies: "Mrs Magdalena Smit — Appointed as a casual vacancy on 12 June 2019 as the western region representative. She is a Professional Accountant (SA) whose understanding of member needs…".',
         route="SAIPA → PA(SA)", source_urls=[SAIPA_AIR_2019],
         notes="Professional-body source (PRIMARY) but dated 2019; SAIPA 'Western Region' spans Cape Town–Springbok–Plettenberg Bay–Ceres, so province is PROBABLE. Current employer/role not established."),
]

# --------------------------------------------------------------------------- Companies
cid = db_lib.next_id(db_lib.COMPANIES_PATH, "cmp")
COMPANIES = [
    dict(id="cmp-%04d" % cid, company_name="APBCO Auditors & Accountants", company_aliases=["APBCO", "APBCO Auditors", "APBCO Accountants"],
         website="https://apbcoauditors.com/", industry="Accounting / Audit", sub_industry="Audit & accounting practice (SAIPA/SAICA)",
         headquarters="Paarl", south_africa_locations=["Paarl", "Somerset West", "Hermanus"], company_size_if_public=None,
         listed_or_private="private", parent_company=None, source_urls=[APBCO], date_verified=TODAY),
]

# --------------------------------------------------------------------------- Sources
sid = db_lib.next_id(db_lib.SOURCES_PATH, "src")
SOURCES = []
for url, typ, summ, rel in [
    (APBCO, "Employer Website", "APBCO 'Our Team' — per-person designation wording: Clark PA(SA) 2011; Engelbrecht AGA(SA) 2023; Smal PA(SA) 2010; Hansen PA(SA); van Zyl & Davids 'Professional Accountant'.", "STRONG"),
    (MDACC, "Employer Website", "MD Streets 'SAICA and SAIPA Honour's Roll' — Professional Accountants column with year: Lotters/Musindo 2025, Saunders 2024, Adams/Jacobs 2023, Daniels 2022, Haumann/Nyamutumbu/van Reenen/Harris 2019, Petersen 2017, Abrahamse (blank), Bapukee 2012 (Director).", "STRONG"),
    (SAIPA_AIR_2019, "Professional Body", "SAIPA Annual Integrated Report 2019 — board bios: Magdalena Smit, western region representative, Professional Accountant (SA).", "STRONG"),
]:
    SOURCES.append(dict(id="src-%04d" % sid, url=url, source_type=typ, person_id=None, company_id=None, evidence_type="GENERAL",
                        evidence_summary=summ, qualification_supported=True, skill_supported=None, system_supported=None,
                        employment_supported=True, accessed_date=TODAY, reliability=rel, status="USED"))
    sid += 1


def enrich_bapukee():
    """Add PA(SA)/SAIPA to acc-0075 in place (evidence: MD Streets Honour's Roll, PA 2012 + CA 2024)."""
    path = db_lib.PEOPLE_PATH
    lines = open(path, encoding="utf-8").read().splitlines()
    out, changed = [], False
    for line in lines:
        if not line.strip():
            continue
        rec = json.loads(line)
        if rec["id"] == "acc-0075" and "PA(SA)" not in rec["professional_designations"]:
            rec["professional_designations"] = ["CA(SA)", "PA(SA)"]
            rec["professional_bodies"] = sorted(set(rec["professional_bodies"] + ["SAIPA"]))
            rec["qualification_evidence"] += (' MD Streets Honour\'s Roll: "Professional Accountants — Fatima Bapukee 2012 (Director)" and '
                                              '"Chartered Accountants — Fatima Bapukee 2024 (Director)".')
            rec["qualification_route"] = "SAIPA → PA(SA) (2012); later SAICA → CA(SA) (2024)"
            rec["booleans"]["pa_sa"] = "true"
            rec["source_urls"] = list(dict.fromkeys(rec["source_urls"] + [MDACC]))
            rec["date_last_verified"] = TODAY
            rec["notes"] = (rec.get("notes") or "") + " DUAL PA(SA) 2012 + CA(SA) 2024 per MD Streets Honour's Roll."
            changed = True
        out.append(json.dumps(rec, ensure_ascii=False))
    if changed:
        open(path, "w", encoding="utf-8").write("\n".join(out) + "\n")
    print("acc-0075 enriched:", changed)


if __name__ == "__main__":
    enrich_bapukee()
    db_lib.append_batch(PEOPLE, company_specs=COMPANIES, source_specs=SOURCES,
                        label="Batch 14 (WC core non-CA — firm/body pages)")
