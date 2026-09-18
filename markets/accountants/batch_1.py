#!/usr/bin/env python3
"""
Batch 1 loader for the SA Qualified Accountant & Finance Skills Intelligence Map.

Appends records to markets/accountants/{people,companies,sources}.jsonl (idempotent by id)
and regenerates interim.csv.

Evidence standard: every record carries source_urls and a primary_source. Designation,
articles route and skills are only recorded where the cited source supports them.
"""
import json
import csv
import os
from collections import Counter, OrderedDict

BASE = os.path.dirname(os.path.abspath(__file__))
PEOPLE_PATH = os.path.join(BASE, "people.jsonl")
COMPANIES_PATH = os.path.join(BASE, "companies.jsonl")
SOURCES_PATH = os.path.join(BASE, "sources.jsonl")
INTERIM_PATH = os.path.join(BASE, "interim.csv")

TODAY = "2026-09-18"

SOURCE_INDEX_URL = "https://www.saica.org.za/members/member-info/meet-our-members/"

DESIGNATION_BOOLS = {
    "CA(SA)": "ca_sa", "PA(SA)": "pa_sa", "AGA(SA)": "aga_sa", "ACCA": "acca",
    "FCCA": "fcca", "ACMA": "acma", "FCMA": "fcma", "CGMA": "cgma",
}

QUAL_NOT_EST = "QUALIFIED_BUT_ARTICLES_NOT_ESTABLISHED"
NOT_EST = "NOT_ESTABLISHED"


def make_person(p):
    rec = {
        "date_first_found": TODAY,
        "date_last_verified": TODAY,
        "status": p.get("status", "CONFIRMED"),
        "first_name": p["first"],
        "surname": p["surname"],
        "full_name": p["name"],
        "alternate_names": p.get("alternate_names", []),
        "professionally_qualified": p.get("qualified", "true"),
        "professional_designations": p.get("designations", []),
        "professional_bodies": p.get("bodies", []),
        "designation_status": p.get("designation_status", "CONFIRMED"),
        "qualification_confidence": p.get("confidence", "CONFIRMED"),
        "qualification_evidence": p.get("qualification_evidence", ""),
        "academic_qualifications": p.get("academic", []),
        "articles_completion_status": p.get("articles_status", QUAL_NOT_EST),
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
        if key in des:
            rec["booleans"][boolkey] = "true"
        elif confirmed:
            rec["booleans"][boolkey] = "false"
        else:
            rec["booleans"][boolkey] = "unknown"
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


def ca_saica(name, first, surname, title, employer, role_family, industry, **kw):
    kw.setdefault("designations", ["CA(SA)"])
    kw.setdefault("designation_status", "CONFIRMED")
    kw.setdefault("status", "CONFIRMED")
    kw.setdefault("qualified", "true")
    kw.setdefault("bodies", ["SAICA"])
    kw.setdefault("confidence", "CONFIRMED")
    kw.setdefault("sources", [SOURCE_INDEX_URL] + kw.pop("extra_sources", []))
    kw.setdefault("primary_source", kw["sources"][0])
    kw.setdefault("articles_status", QUAL_NOT_EST)
    p = dict(name=name, first=first, surname=surname, title=title, employer=employer,
             role_family=role_family, industry=industry, **kw)
    return make_person(p)


def aga_linkedin(name, first, surname, title, employer, role_family, industry, slug, **kw):
    kw.setdefault("designations", ["AGA(SA)"])
    kw.setdefault("designation_status", "CONFIRMED")
    kw.setdefault("status", "CONFIRMED")
    kw.setdefault("qualified", "true")
    kw.setdefault("bodies", ["SAICA"])
    kw.setdefault("confidence", "CONFIRMED")
    kw.setdefault("articles_status", NOT_EST)
    p = dict(name=name, first=first, surname=surname, title=title, employer=employer,
             role_family=role_family, industry=industry,
             linkedin="https://www.linkedin.com/in/" + slug,
             primary_source="https://www.linkedin.com/in/" + slug, **kw)
    return make_person(p)


PA_DIR = "https://fmjfinancial.co.za/guides/saipa-tax-practitioners/"

def pa_dir(name, first, surname, firm, area, saipa_no, **kw):
    kw.setdefault("country", "South Africa")
    prov, city = (None, area)
    pairs = {"Rayton": ("Gauteng", "Rayton"), "Muizenberg": ("Western Cape", "Muizenberg (Cape Town)"),
             "Somerset West": ("Western Cape", "Somerset West"), "Milnerton": ("Western Cape", "Milnerton (Cape Town)"),
             "Pretoria": ("Gauteng", "Pretoria"), "Roodepoort": ("Gauteng", "Roodepoort"),
             "Winston Park": ("KwaZulu-Natal", "Winston Park"), "Bellville": ("Western Cape", "Bellville (Cape Town)")}
    if area in pairs:
        prov, city = pairs[area]
    q_evid = kw.pop("q_evidence",
        f"Directory (fmjfinancial.co.za) lists as Professional Accountant (SA){f' with SAIPA membership number {saipa_no}' if saipa_no else ''}.")
    p = dict(
        name=name, first=first, surname=surname,
        status="HIGH_CONFIDENCE", qualified="true",
        designations=["PA(SA)"], bodies=["SAIPA"],
        designation_status="HIGH_CONFIDENCE", confidence="HIGH",
        title="Professional Accountant (SA) / Tax Practitioner",
        employer=firm, role_family="Financial Accounting", function="Other",
        industry="Accounting / Audit",
        province=prov, city=city, location_confidence="HIGH",
        sources=[PA_DIR], primary_source=PA_DIR,
        articles_status=NOT_EST,
        qualification_evidence=q_evid,
        notes=f"Third-party directory listing; designation{' + SAIPA number ' + saipa_no if saipa_no else ''} verifiable against the SAIPA member register. Articles route not stated by source.",
    )
    p.update(kw)
    return make_person(p)


PEOPLE = []

# ---- SAICA professional-body member profiles (CA(SA)) ----
PEOPLE.append(ca_saica(
    "Taryn Woodbridge", "Taryn", "Woodbridge",
    "Chief Financial Officer", "Mercedes-Benz South Africa Ltd",
    "Executive Finance", "Automotive",
    extra_sources=["https://www.saica.org.za/news/meet-the-first-south-african-cfo-of-mercedes-benz-sa-taryn-woodbridge-casa"],
    qualification_evidence='SAICA: "Meet the first South African CFO of Mercedes-Benz SA - Taryn Woodbridge CA(SA)" (1 Oct 2025).',
    notes="First South African CFO of MBSA (role previously held by expatriates from Germany). Appointed ~2022. Location not stated in source."))
PEOPLE.append(ca_saica(
    "Mathabo Makhaya", "Mathabo", "Makhaya",
    "Group Financial Manager (Health)", "Harmony Gold Mining",
    "Group Accounting", "Mining",
    extra_sources=["https://www.saica.org.za/news/top-35-under-35-overall-winner-2022"],
    qualification_evidence='SAICA: "Mathabo Makhaya CA(SA), group financial manager at Harmony Gold Mining (health) and chairperson of the Investment Committee Mineworkers Provident Fund (MWPF)."',
    notes="SAICA Top 35-under-35 overall winner 2022 (aged 32). Also Chairperson of Investment Committee, Mineworkers Provident Fund. Location not explicitly stated (Harmony Gold HQ Randfontein, Gauteng — not asserted as her workplace).",
    career=[{"employer": "Mineworkers Provident Fund (MWPF)", "title": "Chairperson of Investment Committee", "notes": "concurrent non-executive role per SAICA"}]))
PEOPLE.append(ca_saica(
    "Mbali Precious Mabaso", "Mbali", "Mabaso",
    "Audit portfolio manager", "Nedbank Group Limited",
    "Audit", "Banking",
    qualification_evidence='SAICA: "Mbali Precious Mabaso CA(SA) ... an audit portfolio manager at Nedbank Group Limited".',
    notes="Also founder of and mentor at Isikhuthazi (programme for CTA students and ITC/APC candidates). Internal vs external audit not established from source."))
PEOPLE.append(ca_saica(
    "Marta Gerbach", "Marta", "Gerbach",
    "Group Chief Financial Officer", "Fourways Airconditioning",
    "Executive Finance", "Engineering",
    extra_sources=["https://www.saica.org.za/news/from-portugal-with-love-marta-gerbach-casa"],
    qualification_evidence='SAICA: "Marta Gerbach, Group CFO of Fourways Airconditioning" (member feature "From Portugal, with love - Marta Gerbach CA(SA)").',
    notes="SAICA member profile indicates she is based in Porto, Portugal while serving as Group CFO of the SA company Fourways Airconditioning.",
    country="Portugal", location_confidence="HIGH"))
PEOPLE.append(ca_saica(
    "Tumi Mokgoko", "Tumi", "Mokgoko",
    "Not stated in index (current role at KPMG)", "KPMG",
    "Audit", "Professional Services",
    qualification_evidence='SAICA: "Tumi Mokgoko CA(SA)" — "From the public sector to the JSE to her current role at KPMG".',
    notes="Career span includes public sector and the JSE; current role at KPMG (title not specified in index).",
    historic_industries=["Government", "Financial Services"]))
PEOPLE.append(ca_saica(
    "Pumla Molope", "Pumla", "Molope",
    "President", "African Women Chartered Accountants (AWCA)",
    "Executive Finance", "Non-Profit",
    qualification_evidence='SAICA: "Pumla Molope CA(SA)" — "newest president of African Women Chartered Accountants (AWCA)".',
    notes="Her mother Nosipho also studied CA(SA) after a science degree."))
PEOPLE.append(ca_saica(
    "Patricia Malahlela", "Patricia", "Malahlela",
    "Senior Accountant", "Mckenzie & Associates",
    "Financial Accounting", "Accounting / Audit",
    extra_sources=["https://www.saica.org.za/news/the-power-of-starting-over-patricia-malahlela-casa"],
    qualification_evidence='SAICA: "Patricia Malahlela CA(SA), a senior accountant at Mckenzie & Associates".',
    notes="Accounting/audit firm (Mckenzie & Associates). SAICA member feature \"The power of starting over\"."))
PEOPLE.append(ca_saica(
    "Ciara Reintjes", "Ciara", "Reintjes",
    "Regional Lead: Northern Region (Strategic Affairs Division)", "SAICA",
    "Other", "Professional Services",
    extra_sources=["https://www.saica.org.za/news/an-invitation-to-openness-ciara-reintjes-casa"],
    qualification_evidence='SAICA: "Ciara Reintjes CA(SA) ... Regional Lead of SAICA for the Northern Region in the Strategic Affairs Division".',
    notes="Employer is SAICA (professional body). Northern Region covers Gauteng and neighbouring provinces; city not stated."))
PEOPLE.append(ca_saica(
    "Aneshree Naidoo", "Aneshree", "Naidoo",
    "Chief Financial Officer", "Webber Wentzel",
    "Executive Finance", "Professional Services",
    extra_sources=["https://www.saica.org.za/news/you-dont-have-to-be-defined-by-your-circumstances-aneshree-naidoo-casa"],
    qualification_evidence='SAICA: "Aneshree Naidoo CA(SA) ... As CFO of Webber Wentzel".',
    notes="Law firm CFO. Childhood memories near sugar-cane fields (KwaZulu-Natal) — not asserted as current location.",
    location_confidence="UNCONFIRMED"))
PEOPLE.append(ca_saica(
    "Romy Maree", "Romy", "Maree",
    "Group Head of Finance", "Burstone (Real Estate partners)",
    "Group Accounting", "Property",
    extra_sources=["https://www.saica.org.za/news/tribute-to-womens-strength-romy-maree-casa"],
    qualification_evidence='SAICA: "Romy Maree CA(SA), Group Head of Finance at Burstone Real Estate partners".',
    notes="Burstone is a JSE-listed real estate (REIT) group. Group Head of Finance."))
PEOPLE.append(ca_saica(
    "Mpolaheng Mohlopi", "Mpolaheng", "Mohlopi",
    "Chief Financial Officer", "Lanseria International Airport",
    "Executive Finance", "Aviation",
    extra_sources=["https://www.saica.org.za/news/soaring-to-success-mpolaheng-mohlopi-casa"],
    qualification_evidence='SAICA: "Mpolaheng Mohlopi CA(SA), CFO of Lanseria International Airport".',
    notes="Led the airport's financial response to Covid-19; ~5 years into recovery at time of profile (2025). Employer location Lanseria, Gauteng.",
    province="Gauteng", city="Lanseria", location_confidence="HIGH"))
PEOPLE.append(ca_saica(
    "Patricia Stock", "Patricia", "Stock",
    "Chief Executive Officer", "SAICA",
    "Executive Finance", "Professional Services",
    extra_sources=["https://www.saica.org.za/news/the-power-of-choices-patricia-stock-casa"],
    qualification_evidence='SAICA: "Patricia Stock CA(SA) — SAICA’s first female CEO".',
    notes="First female CEO of SAICA."))
PEOPLE.append(ca_saica(
    "Nonkululeko Gobodo", "Nonkululeko", "Gobodo",
    "Not stated in index (founder / public figure)", None,
    "Executive Finance", "Accounting / Audit",
    extra_sources=["https://www.saica.org.za/news/nonkululeko-gobodo-so-awakened-to-her-true-self"],
    qualification_evidence='SAICA: "Nonkululeko Gobodo CA(SA) is an advocate for racial inclusion and gender equality".',
    notes="Historically founder of auditing firm Gobodo Incorporated (first black female CA(SA) in SA); current employer/title not stated in the index snippet. Current employer recorded as null."))
PEOPLE.append(ca_saica(
    "Buhle Hanise Nomabunga", "Buhle", "Nomabunga",
    "Chief Financial Officer", "BAIC (South Africa)",
    "Executive Finance", "Automotive",
    extra_sources=["https://www.saica.org.za/news/living-her-life-authentically"],
    qualification_evidence='SAICA: "Buhle Hanise Nomabunga CA(SA), BAIC CFO".',
    notes="President of African Women Chartered Accountants (AWCA) at time of profile (2022). BAIC CFO."))
PEOPLE.append(ca_saica(
    "Zanele Maduna", "Zanele", "Maduna",
    "Not stated in index", None,
    "Executive Finance", "Non-Profit",
    extra_sources=["https://www.saica.org.za/news/from-profit-to-purpose-zanele-maduna-casa",
                   "https://www.saica.org.za/news/how-thuthuka-changed-my-life-zanele-maduna"],
    qualification_evidence='SAICA: "Zanele Maduna CA(SA)".',
    notes="Profile focuses on B2B social enterprises / purpose-driven business. Beneficiary of SAICA Thuthuka programme. Employer/title not stated in index."))
PEOPLE.append(ca_saica(
    "Zahid Fakey", "Zahid", "Fakey",
    "Not stated in index", None,
    "Other", "Non-Profit",
    extra_sources=["https://www.saica.org.za/news/wefeedsa-zahid-and-zahida-fakey"],
    qualification_evidence='SAICA: "Zahid and Zahida Fakey, are both CAs(SA)".',
    notes="Coupled profile (#weFEEDsa food-security initiative); specific employer/title not given for each individual."))
PEOPLE.append(ca_saica(
    "Zahida Fakey", "Zahida", "Fakey",
    "Not stated in index", None,
    "Other", "Non-Profit",
    extra_sources=["https://www.saica.org.za/news/wefeedsa-zahid-and-zahida-fakey"],
    qualification_evidence='SAICA: "Zahid and Zahida Fakey, are both CAs(SA)".',
    notes="Coupled profile (#weFEEDsa food-security initiative)."))
PEOPLE.append(ca_saica(
    "Esther Pieterse", "Esther", "Pieterse",
    "Not stated in index (technical accounting)", None,
    "Financial Accounting", None,
    extra_sources=["https://www.saica.org.za/news/at-the-sharp-end-of-technical-accounting-esther-pieterse-casa"],
    qualification_evidence='SAICA: "Esther Pieterse CA(SA)" — "At the sharp end of technical accounting".',
    notes="Technical-accounting specialist profile. Employer/title not stated in index snippet."))
PEOPLE.append(ca_saica(
    "Cecelia Swartz", "Cecelia", "Swartz",
    "Not stated in index", None,
    "Other", None,
    extra_sources=["https://www.saica.org.za/news/defining-your-destiny-cecelia-swartz-casa"],
    qualification_evidence='SAICA: "Cecelia Swartz CA(SA)".',
    notes="Profile concerns a handbag/exec-creator venture; accounting employer/title not stated."))
PEOPLE.append(ca_saica(
    "Anisah Patel", "Anisah", "Patel",
    "Owner (practice in Vereeniging)", "Own practice (Vereeniging)",
    "Financial Accounting", "Accounting / Audit",
    extra_sources=["https://www.saica.org.za/news/microlearnings-from-cassa-over-40"],
    qualification_evidence='SAICA: "Anisah Patel, 44-year-old CA(SA) ... owner of her own practice in Vereeniging that offers accounting, taxation and advisory services."',
    notes="Started CA(SA) journey at age 29. Practice located Vereeniging, Gauteng.",
    province="Gauteng", city="Vereeniging", location_confidence="HIGH"))
PEOPLE.append(ca_saica(
    "Enrico Kleinbooi", "Enrico", "Kleinbooi",
    "Head of Internal Audit", "Kannaland Municipality",
    "Internal Audit", "Government",
    extra_sources=["https://www.saica.org.za/news/inspiration-hard-work-and-someone-to-believe-in-him-the-secret-to-his-casas-success"],
    qualification_evidence='SAICA: "chartered accountant (CA(SA)) Enrico Kleinbooi" — head of internal audit, Kannaland Municipality, Ladismith.',
    notes="Thuthuka Bursary beneficiary. Kannaland Municipality is in Ladismith, Western Cape.",
    province="Western Cape", city="Ladismith", location_confidence="HIGH"))
PEOPLE.append(ca_saica(
    "Grant Greeff", "Grant", "Greeff",
    "Chief Financial Officer", "Drone Ops Group",
    "Executive Finance", "Technology",
    extra_sources=["https://www.saica.org.za/news/when-passion-and-talent-collide-grant-greeff"],
    qualification_evidence='SAICA: "Grant Greeff (30), currently the CFO of Drone Ops Group ... unusual CA(SA) story".',
    notes="Aged 30 at time of profile (2021). Drones/technology sector."))
PEOPLE.append(ca_saica(
    "Mpho Makoko-Hottie", "Mpho", "Makoko-Hottie",
    "B-BBEE business analyst", None,
    "Other", "Professional Services",
    extra_sources=["https://www.saica.org.za/news/my-journey-as-a-trainee-mpho-makoko-hottie"],
    qualification_evidence='SAICA: "Mpho Makoko-Hottie is a successful CA(SA) thriving in her role as a B-BBEE business analyst."',
    notes="Employer not named in index snippet."))
PEOPLE.append(ca_saica(
    "Lynette Badenhorst", "Lynette", "Badenhorst",
    "Managing Director", "Probeta Training (Pty) Ltd",
    "Executive Finance", "Education",
    extra_sources=["https://www.saica.org.za/news/a-microlearning-session-with-entrepreneur-lynette-badenhorst"],
    qualification_evidence='SAICA: "A CA(SA) entrepreneur ... Lynette Badenhorst ... currently managing director of Probeta Training (Pty) Ltd".',
    notes="Born 1967. Also the brain behind online learning platform Akhanani Online Training Solutions.",
    career=[{"employer": "Akhanani Online Training Solutions", "title": "Founder"}]))
PEOPLE.append(ca_saica(
    "Phumelela Mbande", "Phumelela", "Mbande",
    "Not stated in index", None,
    "Financial Accounting", None,
    extra_sources=["https://www.saica.org.za/news/south-african-hockey-captain-what-changed-my-game"],
    qualification_evidence='SAICA: "Phumelela Mbande CA(SA), goalkeeper and captain of the South African women’s hockey team".',
    notes="SA women's field-hockey goalkeeper/captain; competed at Tokyo 2020 Olympics. Employer not stated in index."))

# ---- AGA(SA): Vusi Mpofu (explicit articles at KPMG) ----
PEOPLE.append(make_person(dict(
    name="Vusi Mpofu", first="Vusi", surname="Mpofu",
    status="CONFIRMED", qualified="true",
    designations=["AGA(SA)"], bodies=["SAICA"],
    designation_status="CONFIRMED", confidence="CONFIRMED",
    qualification_evidence='SAICA: "Vusi Mpofu AGA(SA) says how his life in financial services for the past 25 years can best be described as a ‘beautiful accident’."',
    title="Sector Lead: Mining and Chemicals (Corporate & Investment Banking)",
    employer="Nedbank", role_family="Financial Control", function="Other",
    industry="Banking", historic_industries=["Financial Services"],
    academic=["BCom — National University of Lesotho (1997)",
              "Diploma in Advanced Banking — University of Johannesburg",
              "MBA — Wits (2010)", "Executive development programmes — Duke University"],
    articles_status="CONFIRMED_EXPLICIT", articles_body="SAICA",
    articles_employer="KPMG", articles_period="1997 (contract signed June 1997)",
    qualification_route="SAICA articles (at KPMG), then AGA(SA) designation",
    notes='Signed "contract of articles" in June 1997 and served articles with KPMG; undergraduate degree from National University of Lesotho. MBA (Wits 2010). Practitioner member of ACTSA. Started at Nedbank in structured finance; now heads the Mining and Chemicals sector banking team.',
    sources=["https://www.saica.org.za/news/in-a-better-shape-than-you-found-it-vusi-mpofu", SOURCE_INDEX_URL],
    primary_source="https://www.saica.org.za/news/in-a-better-shape-than-you-found-it-vusi-mpofu",
    career=[{"employer": "KPMG", "title": "Trainee accountant / articles", "years": "1994 vacation work; 1997–≈2000 articles"},
            {"employer": "Nedbank", "title": "Structured finance, then Sector Lead: Mining & Chemicals"}],
    yoe="25+", yoe_basis="SAICA profile states ~25 years in financial services (as of 2021).",
)))

# ---- AGA(SA) from LinkedIn ----
PEOPLE.append(aga_linkedin(
    "Kgabiso Mahlangu", "Kgabiso", "Mahlangu",
    "Financial Accountant", "South African State Theatre",
    "Financial Accounting", "Other", "kgabiso-mahlangu-aga-sa-b53a951a",
    sources=["https://www.linkedin.com/in/kgabiso-mahlangu-aga-sa-b53a951a/"],
    province="Gauteng", city="Pretoria", linkedin_location="Pretoria, Gauteng, South Africa",
    location_confidence="CONFIRMED",
    sub_industry="Arts & culture (public entity)",
    academic=["BCom Accounting — University of Johannesburg (2006–2009)",
              "Hons BCompt (CTA) — UNISA (2011)"],
    qualification_evidence='LinkedIn headline: "Kgabiso Mahlangu AGA(SA)" — Financial Accountant, South African State Theatre.',
    career=[{"employer": "TCTA (Trans-Caledon Tunnel Authority)", "title": "Financial Reporting Accountant", "years": "Jun 2020 – Dec 2020"},
            {"employer": "South African State Theatre", "title": "Financial Accountant", "years": "Feb 2021 – present"}],
    role_start="Feb 2021",
    notes="Explicit AGA(SA) designation in LinkedIn headline. Financial accountant at the State Theatre, Pretoria."))
PEOPLE.append(aga_linkedin(
    "Dumisani Zulu", "Dumisani", "Zulu",
    "Financial Manager", "Bonakude Consulting (Pty) Ltd",
    "Financial Accounting", "Professional Services", "dumisani-zulu-aga-sa-aimfo-a5a62622",
    sources=["https://www.linkedin.com/in/dumisani-zulu-aga-sa-aimfo-a5a62622/"],
    province="KwaZulu-Natal", city="Port Shepstone",
    linkedin_location="Port Shepstone", location_confidence="CONFIRMED",
    academic=["Stellenbosch University/Universiteit Stellenbosch (education listed)"],
    qualification_evidence='LinkedIn: "Dumisani Zulu AGA(SA) AIMFO" — license "Associate General Accountant of South Africa AGA(SA), SAICA, Issued Sep 2015"; "Associate Member Institute of Municipal Finance Officers".',
    notes='Self-describes as seasoned Financial Manager, CaseWare, GRAP and financial reporting specialist. AGA(SA) issued Sep 2015 (SAICA) per LinkedIn licenses section. AIMFO = Associate Member, Institute of Municipal Finance Officers.',
    skills=[{"skill": "GRAP / public-sector financial reporting", "confidence": "CONFIRMED",
             "current_or_historic": "CURRENT", "employer_context": "Bonakude Consulting"}]))

# ---- PA(SA) practitioners (directory) ----
PEOPLE.append(pa_dir("J A 'Driaan' Beyers", "Driaan", "Beyers", "Finkor Accounting", "Rayton", "32023",
    qualification_evidence='Directory: "Professional Accountant (SA), Professional Tax Practitioner (SA), SAIPA 32023, SARS tax practitioner".',
    notes="Also Professional Tax Practitioner (SA)."))
PEOPLE.append(pa_dir("Malcolm Cecil Coates", "Malcolm", "Coates", "Alma Casa", "Muizenberg", None,
    qualification_evidence='Directory: "Professional Accountant (SA), Professional Tax Practitioner (SA), Certified Independent Reviewer (SAIPA)".',
    notes="Muizenberg, Cape Town. Certified Independent Reviewer (SAIPA)."))
PEOPLE.append(pa_dir("Louwrens da Silva", "Louwrens", "da Silva", "Petrichor Consulting", "Somerset West", None,
    notes="Somerset West; serves clients remotely across South Africa. SARS-registered tax practitioner."))
PEOPLE.append(pa_dir("Adre Daniel", "Adre", "Daniel", "Accu-fin Accounting", "Milnerton", None,
    academic=["BCompt"],
    qualification_evidence='Directory: "BCompt, SAIPA Professional Accountant, CoTE member, SARS-registered tax practitioner"; "Accu-fin Accounting was established in 2005 by Adre Daniel".',
    notes="Milnerton, Cape Town practice founded 2005."))
PEOPLE.append(pa_dir("Roelof Jansen van Vuuren", "Roelof", "Jansen van Vuuren", "The Tax Shop Pretoria North East", "Pretoria", None,
    notes="Pretoria practice; personal/business tax, payroll, statutory submissions. Remote nationwide service."))
PEOPLE.append(pa_dir("Carla Kilian", "Carla", "Kilian", "AETOS Financial Services", "Roodepoort", "22871",
    qualification_evidence='Directory: "Professional Accountant (SA), Professional Tax Practitioner (SA), SAIPA 22871".',
    notes="Roodepoort, Gauteng."))
PEOPLE.append(pa_dir("Ross Thomson", "Ross", "Thomson", "Collective Accounting", "Winston Park", None,
    qualification_evidence='Directory: "SAIPA Professional Accountant, SARS tax practitioner PR0000336".',
    notes="Winston Park, KwaZulu-Natal; country-wide tax compliance/advisory service."))
PEOPLE.append(pa_dir("Quintin Venter", "Quintin", "Venter", "Sempre Financial Group", "Bellville", None,
    qualification_evidence='Directory: "Professional Accountant (SA), Professional Tax Practitioner (SA), Certified Independent Reviewer".',
    notes="Bellville, Cape Town."))
PEOPLE.append(pa_dir("Hlayisani Terrent Mboweni", "Hlayisani", "Mboweni", "Mboweni Accountants", None, "26919",
    qualification_evidence='Directory: SAIPA number 26919, SARS PR-0095521, "Professional Accountant (SA) and Professional Tax Practitioner (SA)".',
    notes="Location not stated in directory summary."))
PEOPLE.append(pa_dir("Marco Wagener", "Marco", "Wagener", "Excellentia Accounting and Tax Solutions", None, "47560",
    qualification_evidence='Directory: "registered with SAIPA as a Professional Accountant (SA) under number 47560 and with SARS as tax practitioner PR-0104311".',
    notes="Founder of Excellentia. Also Professional Tax Practitioner (SA). Serves individuals, businesses, trusts, NPOs (payroll, CIPC)."))

# ---- CIMA / CGMA ----
PEOPLE.append(make_person(dict(
    name="Nkosana Dlamini", first="Nkosana", surname="Dlamini",
    status="CONFIRMED", qualified="true",
    designations=["ACMA", "CGMA"], bodies=["CIMA"],
    designation_status="CONFIRMED", confidence="CONFIRMED",
    title="Head of Risk Reporting & Risk Regulatory Advisory", employer="Absa Group",
    role_family="Risk", function="Risk", industry="Banking",
    province="Gauteng", city="Johannesburg", location_confidence="HIGH",
    qualification_evidence='CFO South Africa: "Johannesburg-based Nkosana Dlamini, ACMA, CGMA is head of risk reporting and risk regulatory advisory at Absa Group".',
    per_framework="CIMA_PER",
    academic=["Undergraduate degree in Accounting", "Postgraduate degree in financial management (2012)"],
    articles_status="NOT_APPLICABLE",
    qualification_route="CIMA professional qualification (ACMA, CGMA) via Absa 3-year CIMA graduate programme",
    career=[{"employer": "Absa Group", "title": "CIMA graduate programme → retail banking → group finance → senior management", "years": "2013–present",
             "notes": "Nine years in group finance; five years in senior management as at 2024"}],
    yoe="11+", yoe_basis="Joined Absa in 2013 (three-year graduate programme); nine years in group finance by 2024.",
    sources=["https://cfo.co.za/articles/absas-nkosana-dlamini-explains-the-value-of-cgma-credentials/"],
    primary_source="https://cfo.co.za/articles/absas-nkosana-dlamini-explains-the-value-of-cgma-credentials/",
    notes="Studied CIMA after a postgraduate financial-management degree (2012). Explicit ACMA, CGMA. CIMA practical experience via Absa graduate programme — recorded as CIMA_PER, not articles.",
)))
PEOPLE.append(make_person(dict(
    name="Mikateko Tshetshe", first="Mikateko", surname="Tshetshe",
    status="CONFIRMED", qualified="true",
    designations=["FCMA", "CGMA"], bodies=["CIMA"],
    designation_status="CONFIRMED", confidence="CONFIRMED",
    title="Vice President: Finance (Africa)", employer="Unilever",
    role_family="Executive Finance", function="Executive Finance", industry="FMCG",
    qualification_evidence='CFO South Africa: "lead her to being a Fellow of the Chartered Institute of Management Accountants (FCMA) and vice president of finance for Africa at Unilever".',
    per_framework="CIMA_PER",
    academic=["BCom Accounting — University of South Africa (UNISA)"],
    articles_status="NOT_APPLICABLE",
    qualification_route="CIMA professional qualification (FCMA, CGMA) — relevant work experience recognised",
    career=[{"employer": "Bayer", "title": "Two-year apprenticeship; then six years in accounting roles", "years": "≈8 years total at Bayer"}],
    historic_industries=["Pharmaceuticals"],
    yoe="20+", yoe_basis="Started working straight from school at Bayer; CFO in her early 30s; FCMA (fellow) level.",
    sources=["https://cfo.co.za/articles/you-need-the-right-combination-of-qualifications-experience-and-ambition-to-become-a-cfo/"],
    primary_source="https://cfo.co.za/articles/you-need-the-right-combination-of-qualifications-experience-and-ambition-to-become-a-cfo/",
    notes="Fellow of CIMA (FCMA). Chose CIMA for recognition of work experience. Location not stated in source.",
)))
PEOPLE.append(make_person(dict(
    name="Mangaliso Mithi", first="Mangaliso", surname="Mithi",
    status="CONFIRMED", qualified="true",
    designations=["FCMA", "CGMA"], bodies=["CIMA"],
    designation_status="CONFIRMED", confidence="CONFIRMED",
    title="Chief Financial Officer (employer not stated in snippet)", employer=None,
    role_family="Executive Finance", function="Executive Finance", industry=None,
    province="Gauteng", city="Johannesburg", linkedin_location="City of Johannesburg, Gauteng, South Africa",
    location_confidence="HIGH",
    qualification_evidence='LinkedIn headline: "I’m an MBA and CIMA-qualified (FCMA, CGMA) finance professional and seasoned CFO".',
    per_framework="CIMA_PER",
    academic=["MBA"],
    articles_status="NOT_APPLICABLE",
    qualification_route="CIMA professional qualification (FCMA, CGMA)",
    linkedin="https://www.linkedin.com/in/mangalisomithi/",
    sources=["https://www.linkedin.com/in/mangalisomithi/"],
    primary_source="https://www.linkedin.com/in/mangalisomithi/",
    notes="Explicit FCMA, CGMA in LinkedIn headline. Current employer not captured from snippet — requires follow-up.",
)))

# ---- Explicit articles route, designation confirmed via personal account ----
PEOPLE.append(make_person(dict(
    name="Taryn Raju", first="Taryn", surname="Raju",
    status="CONFIRMED", qualified="true",
    designations=["CA(SA)"], bodies=["SAICA"],
    designation_status="CONFIRMED", confidence="CONFIRMED",
    title="Not stated (works at \"a very well-known organization\")", employer=None,
    role_family="Unknown", function=None, industry=None,
    qualification_evidence='thefinancestory.com (personal account): "Taryn is a qualified Chartered Accountant from SAICA".',
    academic=["Bachelor of Accounting — University of Fort Hare", "Honours in Accounting (CTA 1, CTA 2)"],
    articles_status="CONFIRMED_EXPLICIT", articles_body="SAICA",
    articles_employer="Grant Thornton", articles_period="≈2009–2013 (5-year part-time contract; signed-off after 4 years)",
    qualification_route="Bachelor of Accounting + CTA/Honours + SAICA articles at Grant Thornton",
    career=[{"employer": "Grant Thornton", "title": "Trainee accountant (articles) → retained as Audit Supervisor", "years": "Jan 2009 – ≈2013/14"}],
    yoe="10+", yoe_basis="Began articles in 2009 (per personal timeline).",
    sources=["https://thefinancestory.com/success-journey-becoming-ca-saica"],
    primary_source="https://thefinancestory.com/success-journey-becoming-ca-saica",
    notes='Explicit articles: "I could get my 4 years of articles signed off" and "I had completed my articles" while retained as Audit Supervisor at Grant Thornton. Studied part-time (articles ran 5 years on paper; signed off after 4). Current employer not named beyond "a very well-known organization".',
)))

COMPANY_RECS = [
    dict(id="cmp-0001", company_name="Mercedes-Benz South Africa Ltd", company_aliases=["MBSA", "Mercedes-Benz SA"],
         website="https://www.mercedes-benz.co.za/", industry="Automotive", sub_industry="Motor manufacturing",
         source_urls=["https://www.saica.org.za/news/meet-the-first-south-african-cfo-of-mercedes-benz-sa-taryn-woodbridge-casa"], date_verified=TODAY),
    dict(id="cmp-0002", company_name="Harmony Gold Mining", company_aliases=["Harmony Gold"],
         website="https://www.harmony.co.za/", industry="Mining", sub_industry="Gold mining",
         source_urls=["https://www.saica.org.za/news/top-35-under-35-overall-winner-2022"], date_verified=TODAY),
    dict(id="cmp-0003", company_name="Nedbank Group Limited", company_aliases=["Nedbank"],
         website="https://www.nedbank.co.za/", industry="Banking",
         source_urls=["https://www.saica.org.za/news/in-a-better-shape-than-you-found-it-vusi-mpofu"], date_verified=TODAY),
    dict(id="cmp-0004", company_name="KPMG (South Africa)", company_aliases=["KPMG"],
         website="https://kpmg.com/za/", industry="Accounting / Audit", sub_industry="Big Four",
         source_urls=["https://www.saica.org.za/news/in-a-better-shape-than-you-found-it-vusi-mpofu"], date_verified=TODAY),
    dict(id="cmp-0005", company_name="Webber Wentzel", company_aliases=[],
         website="https://www.webberwentzel.com/", industry="Professional Services", sub_industry="Law firm",
         source_urls=["https://www.saica.org.za/news/you-dont-have-to-be-defined-by-your-circumstances-aneshree-naidoo-casa"], date_verified=TODAY),
    dict(id="cmp-0006", company_name="Burstone", company_aliases=["Burstone Group"],
         website="https://www.burstone.com/", industry="Property", sub_industry="Real estate (REIT)",
         source_urls=["https://www.saica.org.za/news/tribute-to-womens-strength-romy-maree-casa"], date_verified=TODAY),
    dict(id="cmp-0007", company_name="Auditor-General of South Africa", company_aliases=["AGSA"],
         website="https://www.agsa.co.za/", industry="Government", sub_industry="Supreme audit institution",
         source_urls=[SOURCE_INDEX_URL], date_verified=TODAY),
    dict(id="cmp-0008", company_name="Lanseria International Airport", company_aliases=["Lanseria Airport"],
         website="https://lanseria.co.za/", industry="Aviation", sub_industry="Airport",
         source_urls=["https://www.saica.org.za/news/soaring-to-success-mpolaheng-mohlopi-casa"], date_verified=TODAY),
    dict(id="cmp-0009", company_name="SAICA", company_aliases=["South African Institute of Chartered Accountants"],
         website="https://www.saica.org.za/", industry="Professional Services", sub_industry="Professional accountancy body",
         source_urls=[SOURCE_INDEX_URL], date_verified=TODAY),
    dict(id="cmp-0010", company_name="BAIC South Africa", company_aliases=["BAIC"],
         website=None, industry="Automotive", sub_industry="Motor manufacturing",
         source_urls=["https://www.saica.org.za/news/living-her-life-authentically"], date_verified=TODAY),
    dict(id="cmp-0011", company_name="Fourways Airconditioning", company_aliases=[],
         website=None, industry="Engineering", sub_industry="HVAC / airconditioning",
         source_urls=["https://www.saica.org.za/news/from-portugal-with-love-marta-gerbach-casa"], date_verified=TODAY),
    dict(id="cmp-0012", company_name="Mckenzie & Associates", company_aliases=[],
         website=None, industry="Accounting / Audit", sub_industry="Accounting firm",
         source_urls=["https://www.saica.org.za/news/the-power-of-starting-over-patricia-malahlela-casa"], date_verified=TODAY),
    dict(id="cmp-0013", company_name="Probeta Training (Pty) Ltd", company_aliases=["Probeta Training"],
         website=None, industry="Education",
         source_urls=["https://www.saica.org.za/news/a-microlearning-session-with-entrepreneur-lynette-badenhorst"], date_verified=TODAY),
    dict(id="cmp-0014", company_name="Drone Ops Group", company_aliases=[],
         website=None, industry="Technology", sub_industry="Drones",
         source_urls=["https://www.saica.org.za/news/when-passion-and-talent-collide-grant-greeff"], date_verified=TODAY),
    dict(id="cmp-0015", company_name="South African State Theatre", company_aliases=["SA State Theatre"],
         website="https://www.statetheatre.co.za/", industry="Other", sub_industry="Arts & culture (public entity)",
         source_urls=["https://www.linkedin.com/in/kgabiso-mahlangu-aga-sa-b53a951a/"], date_verified=TODAY),
    dict(id="cmp-0016", company_name="TCTA (Trans-Caledon Tunnel Authority)", company_aliases=["TCTA"],
         website="https://www.tcta.co.za/", industry="Government", sub_industry="State-owned entity (water infrastructure)",
         source_urls=["https://www.linkedin.com/in/kgabiso-mahlangu-aga-sa-b53a951a/"], date_verified=TODAY),
    dict(id="cmp-0017", company_name="Bonakude Consulting (Pty) Ltd", company_aliases=["Bonakude Consulting"],
         website=None, industry="Professional Services", sub_industry="Consulting",
         source_urls=["https://www.linkedin.com/in/dumisani-zulu-aga-sa-aimfo-a5a62622/"], date_verified=TODAY),
    dict(id="cmp-0018", company_name="Absa Group", company_aliases=["Absa"],
         website="https://www.absa.africa/", industry="Banking",
         source_urls=["https://cfo.co.za/articles/absas-nkosana-dlamini-explains-the-value-of-cgma-credentials/"], date_verified=TODAY),
    dict(id="cmp-0019", company_name="Unilever", company_aliases=["Unilever South Africa"],
         website="https://www.unilever.com/", industry="FMCG",
         source_urls=["https://cfo.co.za/articles/you-need-the-right-combination-of-qualifications-experience-and-ambition-to-become-a-cfo/"], date_verified=TODAY),
    dict(id="cmp-0020", company_name="Grant Thornton (South Africa)", company_aliases=["Grant Thornton"],
         website="https://www.grantthornton.co.za/", industry="Accounting / Audit", sub_industry="Mid-tier audit firm",
         source_urls=["https://thefinancestory.com/success-journey-becoming-ca-saica"], date_verified=TODAY),
    dict(id="cmp-0021", company_name="Bayer (South Africa)", company_aliases=["Bayer"],
         website="https://www.bayer.com/en/za/za-home", industry="Pharmaceuticals", sub_industry="Life sciences",
         source_urls=["https://cfo.co.za/articles/you-need-the-right-combination-of-qualifications-experience-and-ambition-to-become-a-cfo/"], date_verified=TODAY),
]

SOURCE_RECS = [
    dict(id="src-0001", url=SOURCE_INDEX_URL, source_type="Professional Body", person_id=None, company_id=None,
         evidence_type="GENERAL",
         evidence_summary="SAICA 'Meet our members' index — CAs(SA), AGA(SA) and member features with employer/title/qualification wording.",
         qualification_supported=True, skill_supported=None, system_supported=None, employment_supported=True,
         accessed_date=TODAY, reliability="PRIMARY", status="USED"),
]

# resolve person ids after assignment
name_to_id = {}
for i, p in enumerate(PEOPLE, 1):
    p["id"] = "acc-%04d" % i
    name_to_id[p["full_name"]] = p["id"]

def person_src(url, type_, summary, name, reliability,
               q=True, emp=False, skill=False, sys=False):
    return dict(id="src-%04d" % (len(SOURCE_RECS) + 1),
                url=url, source_type=type_, person_id=name_to_id.get(name), company_id=None,
                evidence_type="GENERAL", evidence_summary=summary,
                qualification_supported=q, skill_supported=skill, system_supported=sys,
                employment_supported=emp, accessed_date=TODAY, reliability=reliability, status="USED")

SOURCE_RECS.append(person_src(
    "https://www.saica.org.za/news/in-a-better-shape-than-you-found-it-vusi-mpofu", "Professional Body",
    "Vusi Mpofu AGA(SA): KPMG articles (June 1997), BCom NUL, MBA Wits 2010, Nedbank Sector Lead: Mining & Chemicals, ACTSA member.",
    "Vusi Mpofu", "PRIMARY", q=True, emp=True))
SOURCE_RECS.append(person_src(
    "https://cfo.co.za/articles/absas-nkosana-dlamini-explains-the-value-of-cgma-credentials/", "News",
    "Nkosana Dlamini ACMA, CGMA — head of risk reporting & risk regulatory advisory, Absa Group (Johannesburg); CIMA via Absa graduate programme.",
    "Nkosana Dlamini", "STRONG", q=True, emp=True))
SOURCE_RECS.append(person_src(
    "https://cfo.co.za/articles/you-need-the-right-combination-of-qualifications-experience-and-ambition-to-become-a-cfo/", "News",
    "Mikateko Tshetshe FCMA — Unilever VP Finance Africa; BCom Accounting UNISA; Bayer apprenticeship background.",
    "Mikateko Tshetshe", "STRONG", q=True, emp=True))
SOURCE_RECS.append(person_src(
    "https://fmjfinancial.co.za/guides/saipa-tax-practitioners/", "Directory",
    "Ten named SAIPA Professional Accountant (SA) tax practitioners with firm, area and SAIPA/SARS numbers.",
    None, "MODERATE", q=True, emp=True))
SOURCE_RECS.append(person_src(
    "https://thefinancestory.com/success-journey-becoming-ca-saica", "CV",
    "Taryn Raju: qualified CA(SA) via SAICA; BAcc Fort Hare; Honours (CTA); SAICA articles at Grant Thornton (signed off after 4 years).",
    "Taryn Raju", "STRONG", q=True, emp=True))
SOURCE_RECS.append(person_src(
    "https://www.linkedin.com/in/kgabiso-mahlangu-aga-sa-b53a951a/", "LinkedIn",
    "Kgabiso Mahlangu AGA(SA): Financial Accountant, SA State Theatre (Feb 2021–present); BCom UJ; Hons BCompt (CTA) UNISA.",
    "Kgabiso Mahlangu", "STRONG", q=True, emp=True))
SOURCE_RECS.append(person_src(
    "https://www.linkedin.com/in/dumisani-zulu-aga-sa-aimfo-a5a62622/", "LinkedIn",
    "Dumisani Zulu AGA(SA) AIMFO: Bonakude Consulting, Port Shepstone; AGA(SA) issued Sep 2015 (SAICA); GRAP/CaseWare specialist.",
    "Dumisani Zulu", "STRONG", q=True, emp=True, skill=True))
SOURCE_RECS.append(person_src(
    "https://www.linkedin.com/in/mangalisomithi/", "LinkedIn",
    "Mangaliso Mithi: MBA, CIMA-qualified (FCMA, CGMA) seasoned CFO, City of Johannesburg.",
    "Mangaliso Mithi", "STRONG", q=True))
SOURCE_RECS.append(person_src(
    "https://www.aicpa-cima.com/news/article/new-generation-of-south-african-accounting-and-finance-professionals-awarded", "Professional Body",
    "AICPA & CIMA: 260 new CGMA designation holders awarded at a Johannesburg convocation (May 2024). Context for CGMA cohort discovery.",
    None, "PRIMARY", q=True))


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
existing_companies = load_existing_ids(COMPANIES_PATH)
existing_sources = load_existing_ids(SOURCES_PATH)

n_p = append_records(PEOPLE_PATH, PEOPLE, existing_people)
n_c = append_records(COMPANIES_PATH, COMPANY_RECS, existing_companies)
n_s = append_records(SOURCES_PATH, SOURCE_RECS, existing_sources)

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


with open(INTERIM_PATH, "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=CSV_COLUMNS)
    writer.writeheader()
    for p in read_all(PEOPLE_PATH):
        writer.writerow(csv_row(p))

allp = read_all(PEOPLE_PATH)
confirmed = [p for p in allp if p["status"] == "CONFIRMED"]
des_counts = Counter(d for p in confirmed for d in p.get("professional_designations", []))
print(f"People added this run: {n_p}")
print(f"Companies added this run: {n_c}")
print(f"Sources added this run: {n_s}")
print(f"Total people in DB: {len(allp)}")
print(f"Status counts: {dict(Counter(p['status'] for p in allp))}")
print(f"Confirmed designation counts: {dict(des_counts)}")
provinces = Counter(p.get("province") for p in allp if p.get("province"))
print(f"Provinces (where recorded): {dict(provinces)}")
articles_explicit = [p for p in allp if p.get("articles_completion_status") in ("CONFIRMED_EXPLICIT", "TRAINING_CONTRACT_CONFIRMED")]
print(f"Explicit articles: {[(p['full_name'], p.get('articles_employer')) for p in articles_explicit]}")
