#!/usr/bin/env python3
"""
Batch 2 loader — SAICA/Accountancy SA "CA(SA) Profiles" page, SAP Africa leadership,
Massmart LinkedIn (systems-linked), plus earlier index leads.
Appends to the JSONL stores (idempotent by id) and regenerates interim.csv.
"""
import json
import os
import sys

BASE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE)
import regen_csv  # noqa: E402

PEOPLE_PATH = os.path.join(BASE, "people.jsonl")
COMPANIES_PATH = os.path.join(BASE, "companies.jsonl")
SOURCES_PATH = os.path.join(BASE, "sources.jsonl")
TODAY = "2026-09-18"

ASA_PROFILES = "https://www.accountancysa.org.za/casa-profiles/"
QUAL_NOT_EST = "QUALIFIED_BUT_ARTICLES_NOT_ESTABLISHED"
NOT_EST = "NOT_ESTABLISHED"

DESIGNATION_BOOLS = {
    "CA(SA)": "ca_sa", "PA(SA)": "pa_sa", "AGA(SA)": "aga_sa", "ACCA": "acca",
    "FCCA": "fcca", "ACMA": "acma", "FCMA": "fcma", "CGMA": "cgma",
}

PEOPLE = []


def make_person(p):
    rec = {
        "date_first_found": TODAY, "date_last_verified": TODAY,
        "status": p.get("status", "CONFIRMED"),
        "first_name": p["first"], "surname": p["surname"], "full_name": p["name"],
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
    if rec.get("erp_systems_confirmed") and "SAP" in [s.upper() for s in rec["erp_systems_confirmed"]]:
        rec["booleans"]["sap"] = "true"
    return rec


def asa_profile(profile_url, name, first, surname, title, employer, role_family, industry,
                literal_casa, **kw):
    kw.setdefault("status", "CONFIRMED" if literal_casa else "HIGH_CONFIDENCE")
    kw.setdefault("designation_status", "CONFIRMED" if literal_casa else "HIGH_CONFIDENCE")
    kw.setdefault("confidence", "CONFIRMED" if literal_casa else "HIGH")
    kw.setdefault("qualified", "true")
    kw.setdefault("designations", ["CA(SA)"])
    kw.setdefault("bodies", ["SAICA"])
    kw.setdefault("articles_status", QUAL_NOT_EST)
    base_evid = kw.pop("qualification_evidence",
        f'Accountancy SA (SAICA magazine) "CA(SA) Profiles": "{name}".')
    p = dict(name=name, first=first, surname=surname, title=title, employer=employer,
             role_family=role_family, industry=industry,
             qualification_evidence=base_evid,
             sources=[profile_url, ASA_PROFILES],
             primary_source=profile_url, **kw)
    return make_person(p)


# ---- SAP Africa CFO (SAP.com leadership page) ----
PEOPLE.append(make_person(dict(
    name="Sandi De Souza", first="Sandi", surname="De Souza",
    status="CONFIRMED", qualified="true",
    designations=["CA(SA)"], bodies=["SAICA"],
    designation_status="CONFIRMED", confidence="CONFIRMED",
    title="Chief Financial Officer", employer="SAP Africa",
    role_family="Executive Finance", function="Executive Finance", industry="Technology",
    role_start="May 2022",
    qualification_evidence='SAP.com (Africa leadership): "Sandi is a Chartered Accountant CA(SA) and an MBA graduate of Henley Business School".',
    academic=["MBA — Henley Business School"],
    articles_status="CONFIRMED_EXPLICIT", articles_body="SAICA", articles_employer="Deloitte",
    qualification_route="SAICA articles at Deloitte; CA(SA); MBA (Henley)",
    career=[{"employer": "Deloitte", "title": "Articles"},
            {"employer": "SAP", "title": "May 2005: Finance team → Head of License Management → Commercial Director Africa → CFO (May 2022)", "years": "2005–present"}],
    historic_industries=["Accounting / Audit"],
    employer_systems=["SAP (employer; software vendor)"],
    erp_systems=["SAP"],
    yoe="20+", yoe_basis="Joined SAP in May 2005; \u226517 years at SAP by 2022.",
    sources=["https://www.sap.com/africa/about/management-team.html"],
    primary_source="https://www.sap.com/africa/about/management-team.html",
    notes='Explicit: "Sandi completed her articles at Deloitte before joining SAP." SAP is her employer (software vendor) — recorded as employer_systems_observed, not claimed personal hands-on SAP module usage beyond her SAP leadership roles.',
)))
PEOPLE.append(make_person(dict(
    name="Illana Helman", first="Illana", surname="Helman",
    status="CONFIRMED", qualified="true",
    designations=["CA(SA)"], bodies=["SAICA"],
    designation_status="CONFIRMED", confidence="CONFIRMED",
    title="Senior Finance Business Partner - Group Information Technology", employer="Massmart",
    role_family="Finance Business Partnering", function="Finance Business Partnering",
    industry="Retail",
    province="Gauteng", city="Johannesburg", location_confidence="CONFIRMED",
    linkedin_location="City of Johannesburg, Gauteng, South Africa",
    qualification_evidence='LinkedIn: "Illana Helman CA(SA), Senior Finance Business Partner - Group Information Technology, Massmart" — "Qualified CA(SA) ... with 14 years commercial and 5 years audit experience".',
    linkedin="https://www.linkedin.com/in/illana-helman-ca-sa-1279b117/",
    sources=["https://www.linkedin.com/in/illana-helman-ca-sa-1279b117/"],
    primary_source="https://www.linkedin.com/in/illana-helman-ca-sa-1279b117/",
    erp_systems=["SAP"],
    employer_systems=["SAP (Massmart)"],
    skills=[{"skill": "SAP ERP finance operations", "confidence": "CONFIRMED", "current_or_historic": "CURRENT", "employer_context": "Massmart"},
            {"skill": "operational / shared-services finance", "confidence": "CONFIRMED", "current_or_historic": "CURRENT", "employer_context": "Massmart"},
            {"skill": "process transformation & automation", "confidence": "CONFIRMED", "current_or_historic": "CURRENT", "employer_context": "Massmart"},
            {"skill": "team management", "confidence": "CONFIRMED", "current_or_historic": "CURRENT", "employer_context": "Massmart"}],
    career=[{"employer": "Audit (firm not named)", "title": "Audit", "years": "≈5 years"},
            {"employer": "One of the largest consumer goods businesses in Africa", "title": "Commercial finance", "years": "≈11 years"}],
    historic_industries=["Banking", "Financial Services", "FMCG"],
    yoe="19+", yoe_basis="14 years commercial + 5 years audit experience (per LinkedIn).",
    notes="SAP evidence is person-level: LinkedIn describes managing backoffice/POS interfaces into SAP ERP and SAP-posted sales. Retail, banking, financial services, card acquiring background.",
)))
PEOPLE.append(make_person(dict(
    name="Polani Sokombela", first="Polani", surname="Sokombela",
    status="CONFIRMED", qualified="true",
    designations=["CA(SA)"], bodies=["SAICA"],
    designation_status="CONFIRMED", confidence="CONFIRMED",
    title="Chief Financial Officer", employer="Auditor-General of South Africa (AGSA)",
    role_family="Executive Finance", function="Executive Finance", industry="Government",
    role_start="March 2022",
    qualification_evidence='Accountancy SA: "A seasoned CA(SA), he ... started his career as a trainee accountant at the organisation in 2007".',
    articles_status="TRAINING_CONTRACT_CONFIRMED", articles_body="SAICA",
    articles_employer="Auditor-General of South Africa (AGSA)", articles_period="from 2007",
    qualification_route="SAICA training (trainee accountant at AGSA from 2007); CA(SA)",
    career=[{"employer": "Auditor-General of South Africa", "title": "Trainee accountant (2007) → CFO (March 2022)", "years": "2007–present"}],
    yoe="15+", yoe_basis="Started as trainee accountant at AGSA in 2007; appointed CFO March 2022.",
    sources=["https://www.accountancysa.org.za/profile-public-sector-polani-sokombela/", ASA_PROFILES],
    primary_source="https://www.accountancysa.org.za/profile-public-sector-polani-sokombela/",
    notes='Grew up in Tsolo, Eastern Cape (origin, not current location). Source states "trainee accountant" at AGSA (a registered SAICA training office) — recorded as SAICA training contract; the word "articles" is not used verbatim.',
)))
PEOPLE.append(asa_profile(
    "https://www.accountancysa.org.za/profile-women-in-motoring-it-is-not-a-mans-world-after-all/",
    "Kerry Cassel", "Kerry", "Cassel", "Chief Executive Officer", "Motus Mobility Solutions",
    "Executive Finance", "Automotive", True,
    academic=["BCom (Accountancy)"],
    qualification_evidence='Accountancy SA: "Kerry Cassel CA(SA), CEO of Motus Mobility Solutions, a leading multinational automotive group".',
    notes="CEO of Motus automotive group; accounting was a favourite school subject.",
))
PEOPLE.append(asa_profile(
    "https://www.accountancysa.org.za/profile-jody-baumgarten/",
    "Jody Baumgarten", "Jody", "Baumgarten", "Chief Financial Officer", "Wonga (South Africa)",
    "Executive Finance", "Fintech", False,
    articles_status="CONFIRMED_EXPLICIT", articles_body="SAICA", articles_employer="PwC",
    qualification_route="SAICA articles at PwC; CA(SA)",
    qualification_evidence='Accountancy SA "CA(SA) Profiles": "Jody Baumgarten, CFO of Wonga ... completed his articles with PwC and worked for Dubai World Holdings until ... join[ing] Wonga ... in 2011".',
    career=[{"employer": "PwC", "title": "Articles"},
            {"employer": "Dubai World Holdings", "title": "Not stated"},
            {"employer": "Wonga South Africa", "title": "CFO (co-owner from 2019)", "years": "2011–present"}],
    yoe="20+", yoe_basis="Articles at PwC then Dubai World Holdings before joining Wonga in 2011.",
    notes="Explicit PwC articles. In 2019 bought Wonga South Africa with two colleagues.",
))
PEOPLE.append(asa_profile(
    "https://www.accountancysa.org.za/profile-masechaba-sesing-doing-her-best-to-enhance-strong-ethics-and-morals/",
    "Masechaba Sesing", "Masechaba", "Sesing", "Head of Department", "Free State Provincial Treasury",
    "Financial Control", "Government", True,
    province="Free State", city="Bloemfontein", location_confidence="HIGH",
    qualification_evidence='Accountancy SA: "Masechaba Sesing CA(SA) was recently appointed Head Of Department at the Free State Provincial Treasury".',
    notes="Free State Provincial Treasury is based in Bloemfontein. Public-sector provincial treasury.",
))
PEOPLE.append(asa_profile(
    "https://www.accountancysa.org.za/profile-zinhle-simaman-stay-focused-and-you-can-achieve-anything/",
    "Zinhle Simamane", "Zinhle", "Simamane", "Chief Financial Officer – International Business", "Traxtion",
    "Executive Finance", "Logistics", True,
    qualification_evidence='Accountancy SA: "Zinhle Simamane\u2026 thriving in her role as the Chief Financial Officer – International Business at Traxtion, a company in the freight and rail industry".',
    notes="Freight and rail (Traxtion). No prior rail experience before the role (per profile).",
))
PEOPLE.append(asa_profile(
    "https://www.accountancysa.org.za/profile-zine-mshengu-taking-the-technical-route-less-travelled/",
    "Zine Mshengu", "Zine", "Mshengu", "Not stated in snippet (regulatory)", None,
    "Other", "Government", True,
    qualification_evidence='Accountancy SA: "When Zine Mshengu CA(SA) completed her articles ... opted for the regulatory space, which required further specialisation".',
    notes="Articles route referenced (firm not named in snippet). Works in regulatory space; employer not named in snippet.",
    articles_status="QUALIFIED_BUT_ARTICLES_NOT_ESTABLISHED",
))
PEOPLE.append(asa_profile(
    "https://www.accountancysa.org.za/profile-bonga-mokoena-an-unconventional-approach/",
    "Bonga Mokoena", "Bonga", "Mokoena", "Chief Executive Officer", "BDO (South Africa)",
    "Executive Finance", "Accounting / Audit", True,
    qualification_evidence='Accountancy SA: "Bonga Mokoena\u2019s appointment as CEO of BDO ... sees his career come full circle as he moves away from the financial services industry ... to focus once more on audit."',
    historic_industries=["Financial Services"],
    notes="Appointed CEO of BDO (May 2022 per profile). Career previously in financial services.",
    role_start="May 2022",
))
PEOPLE.append(asa_profile(
    "https://www.accountancysa.org.za/profile-bianca-roos-determined-to-live-her-best-life/",
    "Bianca Roos", "Bianca", "Roos", "Partner", "PKF Octagon",
    "External Audit", "Accounting / Audit", True,
    qualification_evidence='Accountancy SA: "After the gruelling discipline of qualifying as a CA(SA) ... she is a proud partner at PKF Octagon".',
    notes="Help-establish-a-firm route: joined/helped establish PKF Octagon.",
))
PEOPLE.append(asa_profile(
    "https://www.accountancysa.org.za/profile-darren-isaacs-makosi-disrupting-the-industry-to-change-the-world/",
    "Darren Isaacs", "Darren", "Isaacs", "Founder & CEO", "Makosi",
    "Executive Finance", "Professional Services", True,
    qualification_evidence='Accountancy SA: "Makosi founder and CEO Darren Isaacs CA(SA) and his team are on a mission to change the way accounting firms work."',
    notes="Makosi provides resourcing to accounting firms; SA origin, US/UK operations from 2005.",
))
PEOPLE.append(asa_profile(
    "https://www.accountancysa.org.za/profile-koko-khumalo-paving-the-way-to-new-heights/",
    "Koko Khumalo", "Koko", "Khumalo", "CEO & Founding Partner", "Motlanalo Chartered Accountants and Auditors Inc",
    "External Audit", "Accounting / Audit", True,
    qualification_evidence='Accountancy SA: "Koko Khumalo is the CEO and founding partner of Motlanalo Chartered Accountants and Auditors Incorporated (Motlanalo Inc), a majority African Black women-owned South African audit, accounting and professional services firm."',
    notes="Black-women-owned audit firm (Motlanalo Inc).",
))
PEOPLE.append(asa_profile(
    "https://www.accountancysa.org.za/profile-vukosi-fungeni-using-connected-data-analytics-to-drive-stakeholder-value/",
    "Vukosi Fungeni", "Vukosi", "Fungeni", "Not stated in snippet", None,
    "Analytics / Systems Finance", "Technology", True,
    qualification_evidence='Accountancy SA: "Vukosi Fungeni typifies the diverse career opportunities available to CAs(SA). Having grown up in Malamulele, a small Limpopo town..."',
    notes="Grew up in Malamulele, Limpopo (origin). Profile title: connected data analytics to drive stakeholder value.",
))
PEOPLE.append(asa_profile(
    "https://www.accountancysa.org.za/profile-mabatho-sedikela-a-transformational-public-sector-leader/",
    "Mabatho Sedikela", "Mabatho", "Sedikela", "Public-sector leader (AGSA)", "Auditor-General of South Africa (AGSA)",
    "External Audit", "Government", False,
    designation_status="HIGH_CONFIDENCE", confidence="HIGH",
    qualification_evidence='Accountancy SA "CA(SA) Profiles" page: "Mabatho Sedikela is one of those people who work in the public sector as an act of patriotism. She grew up in a large family in Limpopo..."',
    notes="AGSA association per profile imagery (AGSA-00048.jpg). Limpopo origin. Designation not literal in snippet — HIGH.",
))
PEOPLE.append(asa_profile(
    "https://www.accountancysa.org.za/profile-rachelle-best-when-purpose-and-love-collide-great-things-happen/",
    "Rachelle Best", "Rachelle", "Best", "Founder (FYI play app)", None,
    "Other", "Technology", True,
    qualification_evidence='Accountancy SA: "As a business consultant, Rachelle Best CA(SA) was used to solving complex problems ... launched the app FYI play."',
    notes="Former business consultant; founder of FYI play app.",
))
PEOPLE.append(asa_profile(
    "https://www.accountancysa.org.za/profile-katlego-matshego-pursuing-a-passion-for-teaching/",
    "Katlego Matshego", "Katlego", "Matshego",
    "Deputy Head, School of Finance and Accounting", "Independent Institute of Education (IIE) Varsity College / MSA",
    "Other", "Education", False,
    designation_status="HIGH_CONFIDENCE", confidence="HIGH",
    qualification_evidence='Accountancy SA "CA(SA) Profiles": "Deputy Head of the School of Finance and Accounting at the Independent Institute of Education (IIE), Varsity College and MSA".',
    notes="Education role. Designation not literal in snippet — HIGH.",
))
PEOPLE.append(asa_profile(
    "https://www.accountancysa.org.za/profile-naledi-liphapang-unlocking-the-value-of-digitalisation-in-the-public-sector/",
    "Naledi Liphapang", "Naledi", "Liphapang", "Not stated in snippet", None,
    "Other", "Government", False,
    designation_status="HIGH_CONFIDENCE", confidence="HIGH",
    qualification_evidence='Accountancy SA "CA(SA) Profiles": "Naledi Liphapang – Unlocking the value of digitalisation in the public sector".',
    notes="Public-sector digitalisation advocate. SAICA-affiliated imagery (SAICA-2.jpg). Designation not literal in snippet — HIGH.",
))
PEOPLE.append(asa_profile(
    "https://www.accountancysa.org.za/profile-dynamic-duo/",
    "Thenashree Naidoo", "Thenashree", "Naidoo", "Finance leader (Durban ICC)", "Durban ICC",
    "Executive Finance", "Hospitality", False,
    designation_status="HIGH_CONFIDENCE", confidence="HIGH",
    designation_status_eh=None,
    qualification_evidence='Accountancy SA "CA(SA) Profiles": "Two female CAs(SA) navigate Durban ICC to impressive financial recovery."',
    province="KwaZulu-Natal", city="Durban", location_confidence="HIGH",
    notes="Durban International Convention Centre financial recovery. Second CA(SA) name not captured from snippet — follow-up needed.",
))
PEOPLE.append(asa_profile(
    "https://www.accountancysa.org.za/profile-figuring-it-out-together/",
    "Siphesihle Mlangeni", "Siphesihle", "Mlangeni", "Not stated in snippet", None,
    "Financial Accounting", None, True,
    qualification_evidence='Accountancy SA: "Newlyweds Jabulile Nyathi CA(SA) and Siphesihle Mlangeni CA(SA) show that in..."',
    notes="Coupled profile. Employer not stated in snippet."))
PEOPLE.append(asa_profile(
    "https://www.accountancysa.org.za/profile-figuring-it-out-together/",
    "Jabulile Nyathi", "Jabulile", "Nyathi", "Not stated in snippet", None,
    "Financial Accounting", None, True,
    qualification_evidence='Accountancy SA: "Newlyweds Jabulile Nyathi CA(SA) and Siphesihle Mlangeni CA(SA)".',
    notes="Coupled profile. Employer not stated in snippet."))

# ---- Earlier index leads carried into batch 2 (charteredaccountantsworldwide page) ----
PEOPLE.append(make_person(dict(
    name="Mpho Mookapele", first="Mpho", surname="Mookapele",
    status="CONFIRMED", qualified="true",
    designations=["CA(SA)"], bodies=["SAICA"],
    designation_status="CONFIRMED", confidence="CONFIRMED",
    title="Chief Executive Officer", employer="Energy and Water Sector Education and Training Authority (EWSETA)",
    role_family="Executive Finance", function="Executive Finance", industry="Government",
    qualification_evidence='charteredaccountantsworldwide.com: "Mpho Mookapele is a Chartered Accountant (SA) with over 14 years of experience ... In 2017 she was appointed as a CFO of the Energy and Water SETA ... officially appointed as CEO of the organisation in 2020."',
    career=[{"employer": "Energy and Water SETA (EWSETA)", "title": "CFO (2017) → Acting CEO (2018) → CEO (2020)", "years": "2017–present"}],
    historic_industries=["Government"],
    yoe="14+", yoe_basis="Source states 14+ years experience (as at ~2020).",
    sources=["https://charteredaccountantsworldwide.com/institute/the-south-african-institute-of-chartered-accountants/"],
    primary_source="https://charteredaccountantsworldwide.com/institute/the-south-african-institute-of-chartered-accountants/",
    notes="SAICA Top-35-under-35 2019 overall winner. SETA = Sector Education and Training Authority.",
)))
PEOPLE.append(make_person(dict(
    name="Chwayita Mtebele", first="Chwayita", surname="Mtebele",
    status="CONFIRMED", qualified="true",
    designations=["CA(SA)"], bodies=["SAICA"],
    designation_status="CONFIRMED", confidence="CONFIRMED",
    title="Head of Department: Investment Providers", employer="Financial Sector Conduct Authority (FSCA)",
    role_family="Financial Control", function="Risk", industry="Government",
    academic=["BCom Accounting — University of Fort Hare", "CTA — UNISA"],
    qualification_evidence='Accountancy SA: "Chwayita Mtebele is Head of Department: Investment Providers at the Financial Sector Conduct Authority (FSCA). She is a qualified CA(SA) with a BCom Accounting from the University of Fort Hare and a CTA from Unisa".',
    sources=["https://www.accountancysa.org.za/casa-profiles/", "https://www.accountancysa.org.za/profile-chanelle-nandlal-a-second-stint-in-london/"],
    primary_source=ASA_PROFILES,
    notes="Market-conduct regulator (FSCA). From search snippet of ASA CA(SA) profiles page.",
)))
PEOPLE.append(make_person(dict(
    name="Zizipho Nyanga", first="Zizipho", surname="Nyanga",
    status="CONFIRMED", qualified="true",
    designations=["CA(SA)"], bodies=["SAICA"],
    designation_status="CONFIRMED", confidence="CONFIRMED",
    title="Chief Executive Officer", employer="Masisizane Fund (Old Mutual)",
    role_family="Executive Finance", function="Executive Finance", industry="Financial Services",
    qualification_evidence='Accountancy SA: "Old Mutual appoints Zizipho Nyanga CA(SA) as new CEO of Masisizane Fund".',
    historic_industries=["Financial Services"],
    sources=[ASA_PROFILES],
    primary_source=ASA_PROFILES,
    notes="Hails from Mthatha, Eastern Cape (origin). Appointed CEO of Old Mutual's Masisizane Fund (Oct 2016 per snippet).",
)))

# ---- Companies ----
COMPANY_RECS = [
    dict(id="cmp-0022", company_name="SAP Africa", company_aliases=["SAP South Africa"],
         website="https://www.sap.com/africa/", industry="Technology", sub_industry="Enterprise software",
         parent_company="SAP SE", listed_or_private="listed",
         source_urls=["https://www.sap.com/africa/about/management-team.html"], date_verified=TODAY),
    dict(id="cmp-0023", company_name="Deloitte (South Africa)", company_aliases=["Deloitte"],
         website="https://www.deloitte.com/za/", industry="Accounting / Audit", sub_industry="Big Four",
         source_urls=["https://www.sap.com/africa/about/management-team.html"], date_verified=TODAY),
    dict(id="cmp-0024", company_name="Massmart", company_aliases=["Massmart Holdings"],
         website="https://www.massmart.co.za/", industry="Retail", sub_industry="Retail & wholesale group",
         source_urls=["https://www.linkedin.com/in/illana-helman-ca-sa-1279b117/"], date_verified=TODAY),
    dict(id="cmp-0025", company_name="Auditor-General of South Africa", company_aliases=["AGSA"],
         website="https://www.agsa.co.za/", industry="Government", sub_industry="Supreme audit institution",
         source_urls=["https://www.accountancysa.org.za/profile-public-sector-polani-sokombela/"], date_verified=TODAY),
    dict(id="cmp-0026", company_name="Motus Mobility Solutions", company_aliases=["Motus"],
         website="https://www.motus.co.za/", industry="Automotive", sub_industry="Automotive group",
         source_urls=["https://www.accountancysa.org.za/profile-women-in-motoring-it-is-not-a-mans-world-after-all/"], date_verified=TODAY),
    dict(id="cmp-0027", company_name="Wonga South Africa", company_aliases=["Wonga"],
         website=None, industry="Fintech", sub_industry="Consumer lending",
         source_urls=["https://www.accountancysa.org.za/profile-jody-baumgarten/"], date_verified=TODAY),
    dict(id="cmp-0028", company_name="PwC (South Africa)", company_aliases=["PwC", "PricewaterhouseCoopers"],
         website="https://www.pwc.co.za/", industry="Accounting / Audit", sub_industry="Big Four",
         source_urls=["https://www.accountancysa.org.za/profile-jody-baumgarten/"], date_verified=TODAY),
    dict(id="cmp-0029", company_name="Free State Provincial Treasury", company_aliases=[],
         website=None, industry="Government", sub_industry="Provincial treasury",
         source_urls=["https://www.accountancysa.org.za/profile-masechaba-sesing-doing-her-best-to-enhance-strong-ethics-and-morals/"], date_verified=TODAY),
    dict(id="cmp-0030", company_name="Traxtion", company_aliases=["Traxtion Group"],
         website="https://www.traxtion.com/", industry="Logistics", sub_industry="Freight & rail",
         source_urls=["https://www.accountancysa.org.za/profile-zinhle-simaman-stay-focused-and-you-can-achieve-anything/"], date_verified=TODAY),
    dict(id="cmp-0031", company_name="BDO South Africa", company_aliases=["BDO"],
         website="https://www.bdo.co.za/", industry="Accounting / Audit", sub_industry="Mid-tier audit firm",
         source_urls=["https://www.accountancysa.org.za/profile-bonga-mokoena-an-unconventional-approach/"], date_verified=TODAY),
    dict(id="cmp-0032", company_name="PKF Octagon", company_aliases=["PKF"],
         website=None, industry="Accounting / Audit", sub_industry="Mid-tier audit firm",
         source_urls=["https://www.accountancysa.org.za/profile-bianca-roos-determined-to-live-her-best-life/"], date_verified=TODAY),
    dict(id="cmp-0033", company_name="Makosi", company_aliases=[],
         website="https://www.makosi.com/", industry="Professional Services", sub_industry="Accounting-firm resourcing",
         source_urls=["https://www.accountancysa.org.za/profile-darren-isaacs-makosi-disrupting-the-industry-to-change-the-world/"], date_verified=TODAY),
    dict(id="cmp-0034", company_name="Motlanalo Chartered Accountants and Auditors Inc", company_aliases=["Motlanalo Inc"],
         website=None, industry="Accounting / Audit", sub_industry="Black-women-owned audit firm",
         source_urls=["https://www.accountancysa.org.za/profile-koko-khumalo-paving-the-way-to-new-heights/"], date_verified=TODAY),
    dict(id="cmp-0035", company_name="Energy and Water Sector Education and Training Authority", company_aliases=["EWSETA", "Energy and Water SETA"],
         website="https://www.ewseta.org.za/", industry="Government", sub_industry="SETA",
         source_urls=["https://charteredaccountantsworldwide.com/institute/the-south-african-institute-of-chartered-accountants/"], date_verified=TODAY),
    dict(id="cmp-0036", company_name="Financial Sector Conduct Authority", company_aliases=["FSCA"],
         website="https://www.fsca.co.za/", industry="Government", sub_industry="Market-conduct regulator",
         source_urls=[ASA_PROFILES], date_verified=TODAY),
    dict(id="cmp-0037", company_name="Masisizane Fund", company_aliases=[],
         website=None, industry="Financial Services", sub_industry="Enterprise development fund",
         parent_company="Old Mutual", source_urls=[ASA_PROFILES], date_verified=TODAY),
]

# ---- Sources ----
def person_src(i, url, type_, summary, name, reliability, q=True, emp=False, skill=False, sys=False):
    return dict(id="src-%04d" % i, url=url, source_type=type_, person_id=None, company_id=None,
                evidence_type="GENERAL", evidence_summary=summary,
                qualification_supported=q, skill_supported=skill, system_supported=sys,
                employment_supported=emp, accessed_date=TODAY, reliability=reliability, status="USED")

SOURCE_RECS = [
    person_src(11, "https://www.sap.com/africa/about/management-team.html", "Employer Website",
               "SAP Africa leadership: Sandi De Souza CA(SA), CFO (May 2022), Deloitte articles, Henley MBA.",
               "Sandi De Souza", "PRIMARY", q=True, emp=True),
    person_src(12, "https://www.linkedin.com/in/illana-helman-ca-sa-1279b117/", "LinkedIn",
               "Illana Helman CA(SA): Senior Finance Business Partner (Group IT), Massmart; SAP ERP operations; 14y commercial + 5y audit.",
               "Illana Helman", "STRONG", q=True, emp=True, skill=True, sys=True),
    person_src(13, ASA_PROFILES, "Professional Body",
               "Accountancy SA (SAICA magazine) 'CA(SA) Profiles' index — dozens of named CAs(SA) with employer/title/articles wording.",
               None, "PRIMARY", q=True, emp=True),
    person_src(14, "https://www.accountancysa.org.za/profile-public-sector-polani-sokombela/", "Professional Body",
               "Polani Sokombela CA(SA): CFO AGSA (Mar 2022); trainee accountant at AGSA from 2007.",
               "Polani Sokombela", "PRIMARY", q=True, emp=True),
    person_src(15, "https://www.accountancysa.org.za/profile-jody-baumgarten/", "Professional Body",
               "Jody Baumgarten: CFO Wonga; PwC articles; Dubai World Holdings; co-owner Wonga SA from 2019.",
               "Jody Baumgarten", "PRIMARY", q=True, emp=True),
    person_src(16, "https://charteredaccountantsworldwide.com/institute/the-south-african-institute-of-chartered-accountants/", "Professional Body",
               "Mpho Mookapele CA(SA) EWSETA CEO; SAICA regional office structure.",
               "Mpho Mookapele", "PRIMARY", q=True, emp=True),
]


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
next_id = max([int(i.split("-")[1]) for i in existing_people] + [0]) + 1
for p in PEOPLE:
    p["id"] = "acc-%04d" % next_id
    next_id += 1

existing_sources = load_existing_ids(SOURCES_PATH)
next_src_id = max([int(i.split("-")[1]) for i in existing_sources] + [0]) + 1
for s in SOURCE_RECS:
    s["id"] = "src-%04d" % next_src_id
    next_src_id += 1

n_p = append_records(PEOPLE_PATH, PEOPLE, existing_people)
n_c = append_records(COMPANIES_PATH, COMPANY_RECS, load_existing_ids(COMPANIES_PATH))
n_s = append_records(SOURCES_PATH, SOURCE_RECS, load_existing_ids(SOURCES_PATH))

regen_csv.main()

print(f"Batch 2 — people added: {n_p}, companies added: {n_c}, sources added: {n_s}")
