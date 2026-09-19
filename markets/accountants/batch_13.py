#!/usr/bin/env python3
"""Batch 13 — Western Cape industrial/manufacturing company sweep (171 companies) + first
verified candidates from that list.

Company source of truth for this batch:
    markets/accountants/inputs/2026-09-19-wc-industrial-companies.tsv

That TSV is a verbatim transcription of the user-supplied `Companies.csv`
("Company / Group | Sector | Subsector | Western Cape footprint | Operational overlap |
Why relevant | Evidence | Source URL"). It is the exhaustive company scope for the sweep:
**not one company may be omitted.** Coverage per company is tracked in `sweep_coverage.md`.

This batch:
  1. Registers every company from the TSV into companies.jsonl (skipping names that already
     exist in the store, so no duplicate company records are created).
  2. Adds the three verified candidate profiles researched so far, including Andisa Zinja
     (TCTA), who closes the first zero-coverage gap in the pre-existing company registry.

Evidence rules applied (markets/accountants/qualification_rules.md):
  - A designation never auto-populates an articles route.
  - Articles are recorded CONFIRMED_EXPLICIT only where a source explicitly states them.
  - Source conflicts are recorded as CONFLICTING, not silently resolved.
"""
import json
import os
import sys

BASE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE)
import db_lib  # noqa: E402

TODAY = "2026-09-19"
TSV = os.path.join(BASE, "inputs", "2026-09-19-wc-industrial-companies.tsv")
PROVENANCE = (
    "Western Cape industrial/manufacturing company sweep list supplied 2026-09-19 "
    "(Companies.csv), transcribed to inputs/2026-09-19-wc-industrial-companies.tsv."
)


# ---------------------------------------------------------------- companies
def read_companies():
    rows = []
    with open(TSV, "r", encoding="utf-8") as f:
        header = f.readline().rstrip("\n").split("\t")
        for line in f:
            line = line.rstrip("\n")
            if not line.strip():
                continue
            parts = line.split("\t")
            rec = dict(zip(header, parts))
            rows.append(rec)
    return rows


def norm(name):
    n = (name or "").lower()
    for junk in (" (pty) ltd", " pty ltd", " ltd", " limited", " group", " holdings",
                 " (south africa)", " south africa", " inc", " inc.", " the"):
        n = n.replace(junk, " ")
    return " ".join(n.split())


def build_company_records():
    existing = {}
    with open(os.path.join(BASE, "companies.jsonl"), "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            rec = json.loads(line)
            existing[rec["id"]] = rec
            for nm in [rec.get("company_name")] + (rec.get("company_aliases") or []):
                if nm:
                    existing[norm(nm)] = rec

    next_id = db_lib.next_id(os.path.join(BASE, "companies.jsonl"), "cmp")
    records, skipped = [], []
    for row in read_companies():
        name = row["company_name"]
        if norm(name) in existing:
            skipped.append((name, existing[norm(name)]["id"],
                            existing[norm(name)]["company_name"]))
            continue
        rec = {
            "id": "cmp-%04d" % next_id,
            "company_name": name,
            "company_aliases": [],
            "website": row["source_url"],
            "industry": row["sector"],
            "sub_industry": row["subsector"],
            "headquarters": None,
            "south_africa_locations": [row["wc_footprint"]],
            "company_size_if_public": None,
            "listed_or_private": "unknown",
            "parent_company": None,
            "source_urls": [row["source_url"]],
            "date_verified": TODAY,
            "notes": "%s Evidence basis recorded by the list as: %s. "
                     "Operational overlap rating: %s."
                     % (PROVENANCE, row["evidence_basis"], row["operational_overlap"]),
        }
        records.append(rec)
        existing[norm(name)] = rec
        next_id += 1
    return records, skipped


# ---------------------------------------------------------------- people
PEOPLE = [
    # --- closes the zero-coverage gap on cmp-0016 TCTA (Trans-Caledon Tunnel Authority) ---
    dict(
        date=TODAY, verified=TODAY, name="Andisa Zinja", first="Andisa", surname="Zinja",
        status="HIGH_CONFIDENCE", des=["CA(SA)"], designation_status="HIGH_CONFIDENCE",
        title="Chief Financial Officer", employer="TCTA (Trans-Caledon Tunnel Authority)",
        role_family="Executive Finance", function="Public-sector financial management",
        role_start="2025-04",
        industry="Government", sub_industry="State-owned bulk water infrastructure",
        province="Gauteng", city="Centurion", location_confidence="PROBABLE",
        linkedin_location="Works in Centurion, Tshwane (Gauteng); originally from Gqeberha",
        academic=["MPHIL (Strategy)"],
        articles_status="CONFIRMED_EXPLICIT", articles_body="SAICA",
        articles_employer="PwC", articles_period="2007-2010",
        articles_location="South Africa (office not stated in source)",
        evidence='Public Sector Manager (June 2026): "Her professional journey began at PwC, where '
                 'she served as an article clerk between 2007 and 2010"; describes her as being '
                 '"half a decade into her fledgling chartered accountancy career (CA)" in 2012. '
                 'LinkedIn post (July 2025): "Andisa Zinja CA (SA), MPHIL (Strategy) has been named '
                 'the new CFO of the TCTA". CFO South Africa (29 June 2026) calls her a '
                 '"Gqeberha-born chartered accountant".',
        source_urls=[
            "https://www.publicsectormanager.gov.za/june-2026/regulars/profiles-leadership/"
            "prodigies-deserve-leadership-opportunities-tcta-cfo-urges",
            "https://cfo.co.za/articles/trans-caledon-tunnel-authority-cfo-andisa-zinja-is-"
            "tunnelling-a-new-vision/",
            "https://www.linkedin.com/in/shaveera-john-ca-sa-b06430135/",
            "https://www.tcta.co.za/about-tcta/team/",
            "https://nationalgovernment.co.za/units/management/290/trans-caledon-tunnel-authority-tcta",
        ],
        primary_source="https://www.publicsectormanager.gov.za/june-2026/regulars/profiles-leadership/"
                       "prodigies-deserve-leadership-opportunities-tcta-cfo-urges",
        career=[
            {"employer": "PwC", "title": "Article clerk (SAICA articles)", "notes": "Period: " + "2007-2010"},
            {"employer": "Auditor-General of South Africa", "title": "Assistant Audit Manager",
             "notes": "Period: " + "2010-2011"},
            {"employer": "ECSECC", "title": "Finance Manager, then CFO", "notes": "Period: " + "2012-2020"},
            {"employer": "Council for Medical Schemes", "title": "CFO", "notes": "Period: " + "2020-2025"},
            {"employer": "TCTA (Trans-Caledon Tunnel Authority)", "title": "CFO",
             "notes": "Period: " + "2025-present"},
        ],
        yoe="19", yoe_basis="Articles from 2007 to 2026.",
        historic_industries=["Professional Services", "Government", "Regulatory"],
        notes="Named 2025 Public Sector CFO of the Year. CA(SA) designation rests on a public "
              "LinkedIn announcement plus two independent media profiles describing her as a "
              "chartered accountant — strong multi-source but no SAICA register/profile "
              "confirmation, hence HIGH_CONFIDENCE rather than CONFIRMED. Articles route IS "
              "explicit (PwC, 2007-2010). Location: works at the TCTA offices in Centurion, "
              "Tshwane; origin Gqeberha (Eastern Cape) — residence not stated, so recorded as "
              "PROBABLE work location only.",
    ),
    # --- Afrimat (JSE: AFT) ---
    dict(
        date=TODAY, verified=TODAY, name="Pieter de Wit", first="Pieter", surname="de Wit",
        alternate_names=["PGS de Wit", "Pieter Gabriel Stephanus de Wit", "Pieter GS de Wit"],
        status="CONFIRMED", des=["CA(SA)"],
        title="Chief Financial Officer and executive director",
        employer="Afrimat", role_family="Executive Finance",
        function="Group financial management",
        industry="Construction materials & mining",
        sub_industry="Aggregates, readymix, lime, industrial minerals",
        province="Western Cape", city="Cape Town", location_confidence="HIGH",
        linkedin_location="Registered office: Tyger Valley Office Park, Cape Town",
        academic=["BCompt Hons", "ACIS", "PG Cert Tax"],
        evidence='JSE SENS: "The annual financial statements have been prepared under the '
                 'supervision of the Chief Financial Officer, PGS de Wit CA(SA)" — stated in the '
                 'Afrimat audited results for FY2024, FY2025 and FY2026. Yahoo Finance executive '
                 'profile: "Mr. Pieter Gabriel Stephanus de Wit ACIS, BCompt Hons, CA (SA), '
                 'PG Cert Tax — CFO & Director" (born 1973).',
        source_urls=[
            "https://senspdf.jse.co.za/documents/SENS_20260521_S521514.pdf",
            "https://senspdf.jse.co.za/documents/SENS_20250515_S504841.pdf",
            "https://www.listcorp.com/jse/aft/afrimat-limited/news/announcement-of-audited-"
            "consolidated-financial-statements-for-the-year-ended-29-february-2024-3032724.html",
            "https://finance.yahoo.com/quote/AFT.JO/profile/",
            "https://www.globaldata.com/company-profile/afrimat-ltd/executives/",
        ],
        primary_source="https://senspdf.jse.co.za/documents/SENS_20260521_S521514.pdf",
        career=[
            {"employer": "PricewaterhouseCoopers", "title": "16 years (GlobalData executive "
             "biography; articles route not separately evidenced)", "notes": "Period not stated in source"},
            {"employer": "Afrimat", "title": "Company Secretary and Chief Audit Executive",
             "notes": "Period: " + "2008-2013"},
            {"employer": "Afrimat", "title": "Regional Director, KwaZulu-Natal and Free State "
             "operations", "notes": "Period: " + "2013-2016"},
            {"employer": "Afrimat", "title": "CFO and director", "notes": "Period: " + "2016-present"},
        ],
        yoe="19", yoe_basis="Born 1973; CFO since 2016; 16 prior years at PwC (GlobalData).",
        historic_industries=["Professional Services"],
        notes="Articles route NOT recorded as confirmed: no source states the training office "
              "explicitly. GlobalData's biography records 16 years at PricewaterhouseCoopers, "
              "which strongly implies a SAICA training contract there, but per "
              "qualification_rules.md a designation plus employer history is not sufficient to "
              "assert an articles route — needs a primary bio before CONFIRMED_EXPLICIT.",
    ),
    # --- Sea Harvest Group (JSE: SHG); also a director of Ladismith Cheese Co (Pty) Ltd ---
    dict(
        date=TODAY, verified=TODAY, name="Muhammad Brey", first="Muhammad", surname="Brey",
        status="CONFIRMED", des=["CA(SA)"],
        title="Chief Financial Officer", employer="Sea Harvest Group",
        role_family="Executive Finance", function="Group financial management",
        role_start="2020-05",
        industry="Fishing / food processing",
        sub_industry="Fleet, processing, aquaculture",
        province="Western Cape", city="Cape Town", location_confidence="HIGH",
        linkedin_location="Cape Town, Western Cape, South Africa",
        academic=["B Com (Hons), Nelson Mandela University"],
        articles_status="CONFLICTING", articles_body="SAICA",
        articles_employer="KPMG (per Sea Harvest board profile and Wiki Mzansi bio); "
                          "Mazars (per CFO South Africa)",
        articles_location="South Africa (office not stated in source)",
        evidence='Sea Harvest Group board/directors page: "He is a qualified Chartered Accountant '
                 'who, upon completion of his articles at KPMG, joined the Corporate Finance '
                 'division of Nedbank Capital". CFO South Africa (28 Apr 2020): "He is a qualified '
                 'CA(SA) and completed his articles at Mazars." theorg.com profile records a '
                 'Chartered Accountant certification from SAICA.',
        source_urls=[
            "https://seaharvestgroup.co.za/sea-harvest-directors/",
            "https://cfo.co.za/articles/muhammad-brey-appointed-as-sea-harvest-group-cfo/",
            "https://www.wikimzansi.com/muhammad-brey/",
            "https://theorg.com/org/sea-harvest-group-ltd/org-chart/muhammad-brey",
            "https://www.bloomberg.com/profile/person/20076801",
        ],
        primary_source="https://seaharvestgroup.co.za/sea-harvest-directors/",
        linkedin="https://www.linkedin.com/in/mobrey",
        career=[
            {"employer": "KPMG", "title": "Article clerk (SAICA articles; conflicts with the "
             "Mazars statement in CFO South Africa)", "notes": "Period not stated in source"},
            {"employer": "Nedbank Capital", "title": "Corporate Finance division", "notes": "Period not stated in source"},
            {"employer": "Aviva", "title": "Senior roles including Finance Director, RAC (UK)",
             "notes": "Period not stated in source"},
            {"employer": "Brimstone Investment Corporation", "title": "Managing Executive",
             "notes": "Period: " + "2009-2016"},
            {"employer": "Sea Harvest Group", "title": "Chief Investment Officer",
             "notes": "Period: " + "2016-2020"},
            {"employer": "Sea Harvest Group", "title": "CFO", "notes": "Period: " + "2020-present"},
        ],
        yoe="26", yoe_basis="Articles completed pre-2009; BCom(Hons) 1997-2000.",
        historic_industries=["Financial Services", "Insurance", "Investment holding"],
        notes="CONFLICTING articles route: the employer's own board profile and a secondary "
              "biography both say KPMG; CFO South Africa's 2020 appointment article says Mazars. "
              "Recorded as CONFLICTING rather than resolved — the CA(SA) designation itself is "
              "unaffected. Bloomberg lists board memberships at Sea Harvest Group Ltd, Sea Harvest "
              "Holdings Pty Ltd, Ladismith Cheese Co Pty Ltd, Viking Aquaculture Pty Ltd and "
              "Mareterram Ltd, so this record also covers the Ladismith Cheese / Woodlands Dairy "
              "Group entry in the sweep list.",
    ),
]

SOURCES = [
    ("https://www.publicsectormanager.gov.za/june-2026/regulars/profiles-leadership/"
     "prodigies-deserve-leadership-opportunities-tcta-cfo-urges", "News",
     "June 2026 profile interview with TCTA CFO Andisa Zinja: CA career from 2012, articles at "
     "PwC 2007-2010, AGSA 2010-2011, ECSECC, CMS, TCTA from April 2025.", "MODERATE"),
    ("https://cfo.co.za/articles/trans-caledon-tunnel-authority-cfo-andisa-zinja-is-tunnelling-"
     "a-new-vision/", "News",
     "CFO South Africa, 29 June 2026 — Andisa Zinja described as a Gqeberha-born chartered "
     "accountant and CFO of the Trans-Caledon Tunnel Authority.", "MODERATE"),
    ("https://senspdf.jse.co.za/documents/SENS_20260521_S521514.pdf", "Annual Report",
     "Afrimat FY2026 audited consolidated annual financial statements: statements prepared under "
     "the supervision of the Chief Financial Officer, PGS de Wit CA(SA).", "PRIMARY"),
    ("https://senspdf.jse.co.za/documents/SENS_20250515_S504841.pdf", "Annual Report",
     "Afrimat FY2025 audited results: CFO PGS de Wit CA(SA); auditor PricewaterhouseCoopers Inc.",
     "PRIMARY"),
    ("https://finance.yahoo.com/quote/AFT.JO/profile/", "Directory",
     "Afrimat executive profile: Pieter Gabriel Stephanus de Wit ACIS, BCompt Hons, CA (SA), "
     "PG Cert Tax — CFO & Director, born 1973.", "MODERATE"),
    ("https://www.globaldata.com/company-profile/afrimat-ltd/executives/", "Directory",
     "Pieter GS de Wit biography: Director of Finance since 2016; Regional Director KZN/Free "
     "State 2013-2016; Company Secretary and Chief Audit Executive 2008-2013; 16 years at "
     "PricewaterhouseCoopers.", "MODERATE"),
    ("https://seaharvestgroup.co.za/sea-harvest-directors/", "Company Biography",
     "Sea Harvest Group board profile: qualified Chartered Accountant; completed articles at "
     "KPMG; then Nedbank Capital Corporate Finance.", "PRIMARY"),
    ("https://cfo.co.za/articles/muhammad-brey-appointed-as-sea-harvest-group-cfo/", "News",
     "CFO South Africa, 28 April 2020: Muhammad Brey appointed Sea Harvest Group CFO from 1 May "
     "2020; states qualified CA(SA) and articles completed at Mazars (conflicts with the KPMG "
     "statement on the Sea Harvest board page).", "MODERATE"),
    ("https://www.wikimzansi.com/muhammad-brey/", "Company Biography",
     "Muhammad Brey bio: joined Sea Harvest October 2016 as Chief Investment Officer; qualified "
     "Chartered Accountant; articles at KPMG; Nedbank Capital; Brimstone from 2009.", "MODERATE"),
    ("https://theorg.com/org/sea-harvest-group-ltd/org-chart/muhammad-brey", "Directory",
     "Muhammad Brey — CFO, Sea Harvest Group Ltd, Cape Town; BCom(Hons) Nelson Mandela "
     "University; Chartered Accountant certification from SAICA.", "WEAK"),
    ("https://www.bloomberg.com/profile/person/20076801", "Directory",
     "Muhammad Brey — CFO/Chief Investment Officer, Sea Harvest Group Ltd; board memberships "
     "incl. Ladismith Cheese Co Pty Ltd and Viking Aquaculture Pty Ltd.", "MODERATE"),
    ("https://www.linkedin.com/in/shaveera-john-ca-sa-b06430135/", "LinkedIn",
     "Public LinkedIn activity (July 2025): \"Andisa Zinja CA (SA), MPHIL (Strategy) has been "
     "named the new CFO of the TCTA (Trans-Caledon Tunnel Authority) bringing over 15 years of "
     "financial ...\".", "MODERATE"),
    ("https://nationalgovernment.co.za/units/management/290/trans-caledon-tunnel-authority-tcta",
     "Directory",
     "National Government directory: TCTA Chief Financial Officer — Ms Andisa Zinja; Centurion.",
     "MODERATE"),
]


def main():
    companies, skipped = build_company_records()
    src_id = db_lib.next_id(os.path.join(BASE, "sources.jsonl"), "src")
    source_records = []
    for url, stype, summary, reliability in SOURCES:
        source_records.append({
            "id": "src-%04d" % src_id,
            "url": url,
            "source_type": stype,
            "person_id": None,
            "company_id": None,
            "evidence_type": "GENERAL",
            "evidence_summary": summary,
            "qualification_supported": True,
            "skill_supported": None,
            "system_supported": None,
            "employment_supported": True,
            "accessed_date": TODAY,
            "reliability": reliability,
            "status": "USED",
        })
        src_id += 1

    print("Companies registered: %d | skipped (already in store): %d"
          % (len(companies), len(skipped)))
    for name, cid, canon in skipped:
        print("  SKIP %s -> existing %s (%s)" % (name, cid, canon))

    db_lib.append_batch(PEOPLE, companies, source_records, label="Batch 13 (WC industrial sweep)")


if __name__ == "__main__":
    main()
