#!/usr/bin/env python3
"""Batch 10 — BDO South Africa leadership + Johan le Roux CA(SA) (Milnerton).
Verification: BDO "our people" pages give per-person "Chartered Accountant South Africa"
qualifications; Johan le Roux profile lists CA(SA), Graduate Diploma (UCT), SAICA no.
Uses db_lib.append_batch."""
import os
import sys

BASE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE)
import db_lib  # noqa: E402

PEOPLE = []
COMPANIES = []
SOURCES = []

PEOPLE += [
    dict(name="Bonga Mokoena", first="Bonga", surname="Mokoena", des=["CA(SA)"],
         title="Chief Executive Officer", employer="BDO South Africa",
         role_family="Executive Finance", industry="Accounting / Audit", sub_industry="Audit, tax & advisory network",
         province="Gauteng", city="Johannesburg", location_confidence="HIGH",
         evidence='BDO "our people" page qualifications: "CA(SA) (Chartered Accountant South Africa)"; BCom Wits; Hons BCompt/CTA UNISA; MBL Unisa SBL; LLB UNISA. Appointed CEO May 2022 (first Black CEO of BDO SA).',
         academic=["BCom — University of the Witwatersrand", "Hons BCompt / CTA — UNISA",
                   "Master's of Business Leadership — UNISA SBL", "LLB — UNISA"],
         source_urls=["https://www.bdo.co.za/en-za/our-people/bonga-mokoena",
                      "https://corporatenetwork.glueup.com/event/60747/"],
         route="CA(SA); internal audit (Nedcor, Metrorail, Transnet) → Old Mutual → BDO CEO",
         career=[{"employer": "Nedcor Bank Limited", "title": "Internal auditor", "years": "—"},
                 {"employer": "Metrorail / Transnet", "title": "Internal auditor", "years": "—"},
                 {"employer": "Old Mutual (Corporate Division)", "title": "Industry leader / senior roles", "years": "from 2005"},
                 {"employer": "BDO South Africa", "title": "Chief Executive Officer", "years": "May 2022 – present"}],
         yoe="20+", yoe_basis="More than two decades of executive leadership per BDO profile.",
         notes="Deputy Chair of SAICA Senior Partners' Forum; non-executive member of SAICA National Council; BLSA board member."),
    dict(name="Imtiaaz Hashim", first="Imtiaaz", surname="Hashim", des=["CA(SA)"],
         title="Cape Town Managing Partner", employer="BDO South Africa",
         role_family="External Audit", industry="Accounting / Audit", sub_industry="Audit, tax & advisory network",
         province="Western Cape", city="Cape Town", location_confidence="HIGH",
         evidence='BDO "our people" page: "Imtiaaz Hashim — Cape Town Managing Partner" with qualification "Chartered Accountant South Africa"; member SAICA, IRBA; JSE Registered Auditor.',
         academic=[],
         source_urls=["https://www.bdo.co.za/en-za/our-people/imtiaaz-hashim"],
         route="CA; audited trainee at BDO from 1997 → partner 2005 → Cape Town Managing Partner",
         career=[{"employer": "BDO (South Africa)", "title": "Audit trainee → manager → partner", "years": "1997–present"},
                 {"employer": "BDO (Cayman Islands)", "title": "Hedge-fund audits (under 2 years)", "years": "—"}],
         yoe="15+", yoe_basis="Over 15 years audit & advisory experience per BDO profile.",
         notes="Member of SAICA large/medium practices committee (WC); ABASA Western Cape board member."),
    dict(name="Mark Willimott", first="Mark", surname="Willimott", des=["CA(SA)"],
         title="Head of International Offshore Solutions", employer="BDO South Africa",
         role_family="External Audit", industry="Accounting / Audit", sub_industry="Audit, tax & advisory network",
         province="Eastern Cape", city="Gqeberha (Port Elizabeth)", location_confidence="HIGH",
         evidence='BDO "our people" page: "Mark Willimott — Founding Partner, Head of International Offshore Solutions" with qualification "Chartered Accountant South Africa"; BAcc (Hons) University of Port Elizabeth.',
         academic=["BAcc + Honours — University of Port Elizabeth"],
         source_urls=["https://www.bdo.co.za/en-za/our-people/mark-willimott"],
         notes="Lead assurance & corporate finance assignments; renewable energy, hospitality, sports sectors. Based Eastern Cape (Gqeberha)."),
    dict(name="Johan le Roux", first="Johan", surname="le Roux", des=["CA(SA)"],
         title="Sole Practitioner / Self-employed Accountant", employer="Johan le Roux CA(SA)",
         role_family="Financial Accounting", industry="Accounting / Audit", sub_industry="Sole practice (independent reviews, tax)",
         province="Western Cape", city="Milnerton (Cape Town)", location_confidence="HIGH",
         evidence='Find an Accountant profile: "Johan le Roux CA(SA)" — Qualifications: "Chartered Accountant SA (CA(SA)); Graduate Diploma in Accounting (UCT); Graduate Diploma in Company Direction (Institute of Directors)"; SAICA membership no. 00182803. Former MD/owner of BFL Carriers (2007–2019).',
         academic=["Graduate Diploma in Accounting — UCT", "Graduate Diploma in Company Direction — Institute of Directors (Inst. of Management & Technology)"],
         source_urls=["https://jleroux03.findanaccountant.co.za/", "https://www.findanaccountant.co.za/content_interview-johan-le-roux"],
         route="CA(SA); SAICA-registered; former MD of BFL Carriers; self-employed public accountant from 2019",
         skills_confirmed=["Independent reviews", "Company secretarial", "Tax administration"],
         accounting_systems_confirmed=["Sage 50cloud Pastel", "Draftworx"],
         analytics_tools_confirmed=["Microsoft Office 365", "Excel"],
         career=[{"employer": "BFL Carriers group of companies", "title": "Managing Director / owner", "years": "2007–2019"},
                 {"employer": "Self-employed", "title": "Registered Public Accountant / sole practitioner", "years": "2019–present"}],
         notes="Past Chairman of the Road Freight Association (Western Cape). Registered tax practitioner (SARS); CIPC registered."),
]

COMPANIES += [
    dict(id="cmp-0071", company_name="BDO South Africa", company_aliases=["BDO", "BDO SA"],
         website="https://www.bdo.co.za/", industry="Accounting / Audit", sub_industry="Audit, tax & advisory network",
         south_africa_locations=["Johannesburg (Parktown)", "Cape Town", "Stellenbosch", "Gqeberha (Port Elizabeth)", "Durban", "Pretoria"],
         source_urls=["https://www.bdo.co.za/en-za/our-people/bonga-mokoena"], date_verified=db_lib.TODAY),
    dict(id="cmp-0072", company_name="Johan le Roux CA(SA)", company_aliases=["Johan le Roux"],
         website=None, industry="Accounting / Audit", sub_industry="Sole practice (independent reviews, tax)",
         south_africa_locations=["Milnerton, Cape Town"],
         source_urls=["https://jleroux03.findanaccountant.co.za/"], date_verified=db_lib.TODAY),
]

src_urls = [
    ("https://www.bdo.co.za/en-za/our-people/bonga-mokoena", "Employer Website", "Bonga Mokoena CA(SA) — CEO BDO South Africa (BCom Wits, CTA UNISA, MBL, LLB)."),
    ("https://corporatenetwork.glueup.com/event/60747/", "Event listing", "Bonga Mokoena — 'As a qualified CA(SA), Mokoena spent much of his career as an internal auditor at Nedcor, Metrorail and Transnet before Old Mutual'."),
    ("https://www.bdo.co.za/en-za/our-people/imtiaaz-hashim", "Employer Website", "Imtiaaz Hashim — Cape Town Managing Partner, BDO; Chartered Accountant South Africa; SAICA/IRBA/JSE RA."),
    ("https://www.bdo.co.za/en-za/our-people/mark-willimott", "Employer Website", "Mark Willimott — Founding Partner, BDO; Chartered Accountant South Africa; BAcc Hons UPE."),
    ("https://jleroux03.findanaccountant.co.za/", "Directory", "Johan le Roux CA(SA) profile — SAICA no. 00182803; Graduate Diploma Accounting UCT; systems: Sage 50cloud Pastel, Draftworx."),
    ("https://www.findanaccountant.co.za/content_interview-johan-le-roux", "Directory/Interview", "Johan le Roux interview — CA(SA), Milnerton; software: Sage 50cloud Pastel, Office 365, Draftworx."),
]
sid = db_lib.next_id(db_lib.SOURCES_PATH, "src")
for url, typ, summ in src_urls:
    SOURCES.append(dict(id="src-%04d" % sid, url=url, source_type=typ, person_id=None, company_id=None,
                        evidence_type="GENERAL", evidence_summary=summ,
                        qualification_supported=True, skill_supported=None, system_supported=None,
                        employment_supported=True, accessed_date=db_lib.TODAY,
                        reliability="STRONG", status="USED"))
    sid += 1

people = db_lib.append_batch(PEOPLE, company_specs=COMPANIES, source_specs=SOURCES, label="Batch 10 (BDO + le Roux)")
