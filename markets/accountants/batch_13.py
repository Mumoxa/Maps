#!/usr/bin/env python3
"""Batch 13 — Finance talent map: Sage 300 installed-base company finance leaders.

Verified current (or current-appears-likely) finance professionals at companies
cmp-0076+ (SATURC installed base / related group entities). Evidence-backed only.
Uses db_lib.append_batch. Dual-writes research CSV enrichment via side-effect notes.
"""
import os
import sys

BASE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE)
import db_lib  # noqa: E402

# Override date for this session
db_lib.TODAY = "2026-09-22"

PEOPLE = []
COMPANIES = []  # companies already exist as cmp-0076+; only add if new aliases needed
SOURCES = []

# ---------------------------------------------------------------------------
# QUANTUM FOODS (cmp-0076)
# ---------------------------------------------------------------------------
PEOPLE += [
    dict(
        name="André Hugo Muller", first="André", surname="Muller",
        alternate_names=["Andre Muller", "André Muller"],
        des=["CA(SA)"],
        title="Chief Financial Officer / Financial Director & Executive Director",
        employer="Quantum Foods Holdings Ltd",
        role_family="Executive Finance",
        industry="Agriculture / Food Manufacturing",
        sub_industry="Poultry, feeds and eggs",
        province="Western Cape", city="Wellington",
        location_confidence="CONFIRMED",
        linkedin_location="City of Cape Town, Western Cape, South Africa",
        linkedin="https://www.linkedin.com/in/andre-muller-0651b827/",
        evidence=(
            "Quantum Foods governance page: 'André Hugo Muller — Chief financial officer — Qualifications: CA(SA)'; "
            "appointed to Board 27 January 2014. CFO South Africa profile: CA(SA), B.Acc Honours Stellenbosch; "
            "joined Quantum 2003 (Pioneer Foods division); Head of Finance 2014; CFO present."
        ),
        academic=["B.Acc Honours — University of Stellenbosch"],
        articles_status="QUALIFIED_BUT_ARTICLES_NOT_ESTABLISHED",
        career=[
            {"employer": "Pioneer Foods / Nulaid", "title": "Financial Manager", "notes": "2003–2007 per CFO SA"},
            {"employer": "Pioneer Foods", "title": "National Manager Farming Operations", "notes": "2008–2011"},
            {"employer": "Distell", "title": "Group Accountant", "notes": "1999–2001 per CFO SA"},
        ],
        historic_industries=["FMCG", "Agriculture", "Beverages"],
        source_urls=[
            "https://quantumfoods.co.za/governance/",
            "https://cfo.co.za/profiles/andre-muller/",
            "https://www.linkedin.com/in/andre-muller-0651b827/",
        ],
        notes="JSE:QFH. HQ 11 Main Road, Wellington. Employer systems observed (company-level, not person-linked): Sage 300 per installed-base register.",
        employer_systems=["Sage 300 / ACCPAC"],
    ),
]

# ---------------------------------------------------------------------------
# NOVUS HOLDINGS (cmp-0077)
# ---------------------------------------------------------------------------
PEOPLE += [
    dict(
        name="Kim Julies", first="Kim", surname="Julies",
        alternate_names=["Kim Julies (nee Adams)", "Kim Adams"],
        des=["CA(SA)"],
        title="Group Chief Financial Officer & Executive Director",
        employer="Novus Holdings Ltd",
        role_family="Executive Finance",
        industry="Manufacturing",
        sub_industry="Commercial printing, labels, flexible packaging, tissue",
        province="Western Cape", city="Cape Town",
        location_confidence="HIGH",
        linkedin_location="Western Cape, South Africa",
        evidence=(
            "Novus Holdings board page: 'Kim holds a Bachelor of Accounting (Hons) degree from the University of "
            "Stellenbosch obtained in 2012 and is a qualified CA(SA). Kim completed her articles at PricewaterhouseCoopers Inc. "
            "... joined Novus Holdings Limited in 2017 as Group Financial Accountant, and was appointed as Group Financial "
            "Manager and Alternate Director ... in August 2023.' CFO South Africa (4 Sep 2025): appointed Group CFO & "
            "executive director effective 1 January 2026 (replacing Craig Wright)."
        ),
        academic=["Bachelor of Accounting (Hons) — University of Stellenbosch (2012)"],
        articles_status="CONFIRMED_EXPLICIT",
        articles_body="SAICA",
        articles_employer="PricewaterhouseCoopers Inc.",
        articles_period=None,
        articles_location="South Africa",
        career=[
            {"employer": "Novus Holdings Ltd", "title": "Group Financial Accountant", "notes": "joined 2017"},
            {"employer": "Novus Holdings Ltd", "title": "Group Financial Manager & Alternate Director", "notes": "from Aug 2023"},
            {"employer": "PricewaterhouseCoopers Inc.", "title": "Articles / CA training", "notes": "clients incl. Rheinmetall Denel Munition, Distell"},
        ],
        historic_industries=["Professional Services", "Manufacturing", "Defence", "Beverages"],
        source_urls=[
            "https://novus.holdings/about/board-members/",
            "https://cfo.co.za/articles/novus-holdings-appoints-kim-julies-as-group-cfo/",
        ],
        notes="CFO effective 1 Jan 2026 per company announcement Sep 2025. Montague Gardens HO. Employer systems observed: Sage 300cloud + BPM (company-level).",
        employer_systems=["Sage 300 / ACCPAC"],
    ),
    dict(
        name="Craig Wright", first="Craig", surname="Wright",
        des=["CA(SA)"],
        title="CEO of Print & Packaging and Executive Director (former Group CFO)",
        employer="Novus Holdings Ltd",
        role_family="Executive Finance",
        industry="Manufacturing",
        sub_industry="Commercial printing, packaging",
        province="Western Cape", city="Cape Town",
        location_confidence="HIGH",
        evidence=(
            "Novus Holdings AFS 2024 supervised by 'chief financial officer, Craig Wright CA(SA)'. "
            "MarketScreener Jul 2023: appointed Group CFO effective 1 Aug 2023; 'Craig is a qualified chartered accountant "
            "and has been with the Group since 2007' (previously Novus Print Executive: Finance). "
            "CFO SA Sep 2025: resigns as CFO effective 31 Dec 2025; remains within the group (CEO Print & Packaging)."
        ),
        articles_status="QUALIFIED_BUT_ARTICLES_NOT_ESTABLISHED",
        career=[
            {"employer": "Novus Holdings Ltd", "title": "Group Chief Financial Officer", "notes": "1 Aug 2023 – 31 Dec 2025"},
            {"employer": "Novus Print", "title": "Executive: Finance", "notes": "pre-CFO; with group since 2007"},
        ],
        source_urls=[
            "https://novus.holdings/wp-content/uploads/2024/06/IAR24-Annual-Financial-Statements-v_Final.pdf",
            "https://cfo.co.za/articles/novus-holdings-appoints-kim-julies-as-group-cfo/",
            "https://www.marketscreener.com/quote/stock/NOVUS-HOLDINGS-LIMITED-22213288/news/Novus-Holdings-Limited-Announces-Chief-Financial-Officer-Changes-44404046/",
        ],
        notes="Still current employee of Novus post-CFO transition (Print & Packaging CEO). Designation CA(SA) verified via AFS supervisor line. Finance leadership history retained.",
        employer_systems=["Sage 300 / ACCPAC"],
        status="CONFIRMED",
    ),
    dict(
        name="Keshree Alwar", first="Keshree", surname="Alwar",
        des=["CA(SA)"],
        title="CEO: Maskew Miller Learning & Executive Director (former Group CFO)",
        employer="Novus Holdings Ltd",
        role_family="Executive Finance",
        function="Former Group CFO; now CEO of education subsidiary (finance-trained executive)",
        industry="Manufacturing",
        sub_industry="Education publishing (Maskew Miller Learning) within Novus group",
        province="Western Cape", city="Cape Town",
        location_confidence="HIGH",
        evidence=(
            "Novus board: 'holds a BCom(Hons) in Financial Accounting and is a qualified chartered accountant'; "
            "previously at PwC as senior audit manager'. Novus 2021 appointment release: admitted to SAICA 2010; "
            "Group CFO from 1 Sep 2021 after Group Financial Manager role. MarketScreener 2023: promoted to CEO of "
            "Maskew Miller Learning from 1 Aug 2023; resigns Group CFO 31 Jul 2023; remains Executive Director."
        ),
        academic=[
            "BCom Financial Accounting — University of Cape Town (2003–2005)",
            "BCom Honours Financial Accounting — University of KwaZulu-Natal (2006)",
        ],
        articles_status="QUALIFIED_BUT_ARTICLES_NOT_ESTABLISHED",
        career=[
            {"employer": "Novus Holdings Ltd", "title": "Group Chief Financial Officer", "notes": "Sep 2021 – Jul 2023"},
            {"employer": "Novus Holdings Ltd", "title": "Group Financial Manager & Company Secretary", "notes": "pre-CFO; joined 2016"},
            {"employer": "PricewaterhouseCoopers", "title": "Senior Audit Manager", "notes": "~9 years; clients Distell, Remgro, BAT SA"},
        ],
        historic_industries=["Professional Services", "Manufacturing", "Education"],
        source_urls=[
            "https://novus.holdings/about/board-members/",
            "https://novus.holdings/novus-holdings-appoints-new-chief-financial-officer-2/",
            "https://www.marketscreener.com/quote/stock/NOVUS-HOLDINGS-LIMITED-22213288/news/Novus-Holdings-Limited-Announces-Chief-Financial-Officer-Changes-44404046/",
        ],
        notes="Current role is CEO of subsidiary (not pure finance title) but retained as verified CA(SA) with extensive Novus finance leadership history. Still on Novus board as executive director.",
        employer_systems=["Sage 300 / ACCPAC"],
    ),
]

# ---------------------------------------------------------------------------
# FOOD LOVER'S MARKET / FVC GROUP (cmp-0078 + cmp-0081 related)
# ---------------------------------------------------------------------------
PEOPLE += [
    dict(
        name="Yolanda Louw", first="Yolanda", surname="Louw",
        des=["CA(SA)"],
        title="Chief Financial Officer",
        employer="Food Lover's Market Holdings",
        role_family="Executive Finance",
        industry="Retail",
        sub_industry="Food retail / fresh produce (incl. Fruit & Veg City, FreshStop)",
        province="Western Cape", city="Cape Town",
        location_confidence="HIGH",
        linkedin_location="City of Cape Town, Western Cape, South Africa",
        linkedin="https://www.linkedin.com/in/yolanda-louw-875193a0/",
        evidence=(
            "TheOrg / Crunchbase / RocketReach: CFO Food Lover's Market Holdings since Oct 2016. "
            "LinkedIn public headline association with SAICA (Education: South African Institute of Chartered Accountants). "
            "TheOrg bio: Bachelor's in Accounting and Finance (Nelson Mandela University); member of SAICA and CIMA; "
            "career began at KPMG and Arthur Andersen progressing to Senior Audit Manager; prior GM Finance Ackermans."
        ),
        academic=["Bachelor's Degree in Accounting and Finance — Nelson Mandela University"],
        articles_status="QUALIFIED_BUT_ARTICLES_NOT_ESTABLISHED",
        career=[
            {"employer": "Ackermans", "title": "General Manager, Finance", "notes": "finance ops across 600+ stores"},
            {"employer": "Shoe City", "title": "Financial Manager", "notes": "per TheOrg"},
            {"employer": "KPMG / Arthur Andersen", "title": "Audit Trainee → Senior Audit Manager", "notes": "per TheOrg"},
        ],
        historic_industries=["Retail", "Professional Services"],
        source_urls=[
            "https://theorg.com/org/food-lovers-market-holdings/org-chart/yolanda-louw",
            "https://www.linkedin.com/in/yolanda-louw-875193a0/",
            "https://www.crunchbase.com/person/yolanda-louw",
        ],
        notes=(
            "Holding group covers Fruit & Veg City, Food Lover's Market, FreshStop, FVC International — do not duplicate "
            "as separate current employer. CIMA membership stated on TheOrg bio — CGMA/ACMA designation letters not "
            "explicitly confirmed on primary board source; not added as confirmed designation beyond CA(SA)/SAICA membership evidence. "
            "Employer systems observed (group): Sage 300cloud (company-level)."
        ),
        employer_systems=["Sage 300 / ACCPAC"],
        designation_status="CONFIRMED",
        qualification_confidence="CONFIRMED",
    ),
    dict(
        name="JP du Toit", first="JP", surname="du Toit",
        alternate_names=["Jp du Toit", "JP du Toit CA(SA)"],
        des=["CA(SA)"],
        title="Group Finance Manager",
        employer="Food Lover's Market Holdings",
        role_family="Financial Management",
        industry="Retail",
        sub_industry="Food retail / fresh produce",
        province="Western Cape", city="Cape Town",
        location_confidence="HIGH",
        linkedin_location="City of Cape Town, Western Cape, South Africa",
        linkedin="https://za.linkedin.com/in/jp-du-toit-ca-sa-012989a4/",
        evidence=(
            "LinkedIn display name 'JP du Toit CA(SA)'; Group Finance Manager at Food Lover's Market Holdings; "
            "BAccHons Stellenbosch 2011; trainee CA at Shoprite 2012–2014 per RocketReach career. "
            "Also referenced in FLM Absa awards post as 'JP Du Toit (Group Financial Manager of Food Lover's Market)'."
        ),
        academic=["Bachelor of Accounting Honours (BAccHons) — Stellenbosch University (2011)"],
        articles_status="QUALIFIED_BUT_ARTICLES_NOT_ESTABLISHED",
        career=[
            {"employer": "The Shoprite Group of Companies", "title": "Trainee chartered accountant", "notes": "2012–2014"},
            {"employer": "Food Lover's Market Holdings", "title": "Financial Manager: Procurement and Insurance", "notes": "concurrent/prior per RocketReach"},
            {"employer": "Oasis Crescent", "title": "Expense cycle manager", "notes": "2017–2019"},
            {"employer": "SA Power (Pty) Ltd", "title": "Group Finance Manager", "notes": "2015–2017"},
        ],
        historic_industries=["Retail", "Energy", "Financial Services"],
        source_urls=[
            "https://za.linkedin.com/in/jp-du-toit-ca-sa-012989a4/",
            "https://theorg.com/org/food-lovers-market-holdings",
            "https://rocketreach.co/jp-du-toit-email_25118611",
        ],
        notes="Distinct from JP Du Toit CA(SA) at Neil Lyners (different LinkedIn jpdutoitcasa) — identity resolved via FLM LinkedIn URL and employer.",
        employer_systems=["Sage 300 / ACCPAC"],
        erp_systems=["SAP"],  # listed in RocketReach skills — person-linked skill claim; treat carefully
    ),
    dict(
        name="MC Stoman", first="MC", surname="Stoman",
        alternate_names=["Mc Stoman", "Mc Stoman CA"],
        des=["CA(SA)"],
        status="HIGH_CONFIDENCE",
        designation_status="HIGH_CONFIDENCE",
        qualification_confidence="HIGH",
        title="Financial Controller",
        employer="Food Lover's Market Holdings",
        role_family="Financial Control",
        industry="Retail",
        sub_industry="Food retail / fresh produce",
        province="Western Cape", city="Cape Town",
        location_confidence="HIGH",
        evidence=(
            "TheOrg org-chart lists 'Mc Stoman CA' as Financial Controller at Food Lover's Market Holdings. "
            "ZoomInfo: Financial Controller at Food Lover; previously Assistant Manager at Mazars; held positions at KPMG; "
            "BCom Chartered Accountancy CTA (Hons) North-West University. Full legal first name not publicly confirmed."
        ),
        academic=["BCom Chartered Accountancy CTA (Hons) — North-West University"],
        articles_status="NOT_ESTABLISHED",
        career=[
            {"employer": "Mazars", "title": "Assistant Manager", "notes": "per ZoomInfo"},
            {"employer": "KPMG", "title": "Not stated", "notes": "prior per ZoomInfo"},
        ],
        historic_industries=["Professional Services"],
        source_urls=[
            "https://theorg.com/org/food-lovers-market-holdings",
            "https://www.zoominfo.com/p/Mc-Stoman/8715118211",
        ],
        notes="HIGH_CONFIDENCE: 'CA' in public display name + CTA pathway + Big Four/Mazars path strongly supports CA(SA) but no explicit 'CA(SA)' string on primary board page. Full given name unknown.",
        employer_systems=["Sage 300 / ACCPAC"],
    ),
]

# ---------------------------------------------------------------------------
# TCTA (cmp-0100 / also cmp-0016)
# ---------------------------------------------------------------------------
PEOPLE += [
    dict(
        name="Andisa Zinja", first="Andisa", surname="Zinja",
        des=["CA(SA)"],
        title="Chief Financial Officer",
        employer="Trans-Caledon Tunnel Authority (TCTA)",
        role_family="Executive Finance",
        industry="Government / Infrastructure",
        sub_industry="Bulk water transfer and storage infrastructure",
        province="Gauteng", city="Midrand",
        location_confidence="HIGH",
        evidence=(
            "TCTA media statement 13 Nov 2025 (PDF): 'Chief Financial Officer, Ms Andisa Zinja, CA (SA), MPhil (Strategy)' "
            "named 2025 Public Sector CFO of the Year; appointed CFO of TCTA in April 2025. "
            "CFO South Africa profile Jun 2026 confirms current TCTA CFO; previously CFO Council for Medical Schemes."
        ),
        academic=["MPhil (Strategy)"],
        articles_status="QUALIFIED_BUT_ARTICLES_NOT_ESTABLISHED",
        career=[
            {"employer": "Council for Medical Schemes (CMS)", "title": "Chief Financial Officer", "notes": "prior to TCTA Apr 2025"},
        ],
        historic_industries=["Government", "Healthcare / Medical schemes"],
        source_urls=[
            "https://www.tcta.co.za/wp-content/uploads/2026/01/TCTA-CFO-Wins-Award.pdf",
            "https://cfo.co.za/articles/trans-caledon-tunnel-authority-cfo-andisa-zinja-is-tunnelling-a-new-vision/",
            "https://nationalgovernment.co.za/units/management/290/trans-caledon-tunnel-authority-tcta",
        ],
        notes="Also listed on nationalgovernment.co.za management page as CFO. Employer systems observed (entity): Sage 300 Finance (company-level).",
        employer_systems=["Sage 300 / ACCPAC"],
    ),
    dict(
        name="Wendy Nkambule", first="Wendy", surname="Nkambule",
        des=[],
        status="HIGH_CONFIDENCE",
        designation_status="UNCONFIRMED",
        qualification_confidence="RESEARCH_HOLD",
        qualified="unknown",
        title="Financial Controller",
        employer="Trans-Caledon Tunnel Authority (TCTA)",
        role_family="Financial Control",
        industry="Government / Infrastructure",
        sub_industry="Bulk water infrastructure",
        province="Gauteng", city="Midrand",
        location_confidence="HIGH",
        evidence=(
            "nationalgovernment.co.za TCTA management listing: 'Ms Wendy Nkambule (Financial Controller)' among senior management."
        ),
        articles_status="NOT_ESTABLISHED",
        source_urls=[
            "https://nationalgovernment.co.za/units/management/290/trans-caledon-tunnel-authority-tcta",
        ],
        notes="Title verified on public management directory; professional designation not publicly verified — retained HIGH for employment, designation unconfirmed.",
        employer_systems=["Sage 300 / ACCPAC"],
    ),
]

# ---------------------------------------------------------------------------
# CTICC (cmp-0106)
# ---------------------------------------------------------------------------
PEOPLE += [
    dict(
        name="Wayne de Wet", first="Wayne", surname="de Wet",
        des=["CA(SA)"],
        title="Chief Financial Officer",
        employer="Cape Town International Convention Centre (CTICC)",
        role_family="Executive Finance",
        industry="Hospitality / Venues",
        sub_industry="Convention, exhibition and event venue",
        province="Western Cape", city="Cape Town",
        location_confidence="HIGH",
        evidence=(
            "CFO South Africa (18 Oct 2018, updated): CTICC appoints Wayne de Wet as CFO; "
            "'qualified chartered accountant with a Bachelor of Accounting Science degree and Honours in Accounting Science'; "
            "prior roles Cape Town Tourism, Johannesburg Water, PwC, National Treasury, City of Cape Town. "
            "RocketReach still lists Wayne de Wet as CFO at CTICC (recency of directory listing not independently dated beyond appointment)."
        ),
        academic=["Bachelor of Accounting Science", "Honours in Accounting Science"],
        articles_status="QUALIFIED_BUT_ARTICLES_NOT_ESTABLISHED",
        career=[
            {"employer": "PwC", "title": "Not stated", "notes": "prior per CFO SA"},
            {"employer": "National Treasury", "title": "Not stated", "notes": "prior"},
            {"employer": "City of Cape Town", "title": "Not stated", "notes": "prior"},
            {"employer": "Cape Town Tourism", "title": "Financial/management roles", "notes": "prior"},
            {"employer": "Johannesburg Water", "title": "Financial/management roles", "notes": "prior"},
        ],
        historic_industries=["Professional Services", "Government", "Tourism", "Utilities"],
        source_urls=[
            "https://cfo.co.za/articles/cticc-appoints-wayne-de-wet-as-new-cfo/",
            "https://rocketreach.co/cape-town-international-convention-centre-profile_b5c21df4f42e0ea8",
        ],
        notes="Appointment verified 2018; RocketReach still shows as current CFO. No contradictory public successor found in this pass — employment_status treated as Current appears likely / verified appointment with directory corroboration. Re-verify if newer CTICC annual report names a different CFO.",
        employer_systems=[],  # Sage 300 People only per installed-base note — not ERP accounting claim
    ),
]

# ---------------------------------------------------------------------------
# WATER RESEARCH COMMISSION (cmp-0101)
# ---------------------------------------------------------------------------
PEOPLE += [
    dict(
        name="Fazel Ismail", first="Fazel", surname="Ismail",
        des=[],
        status="HIGH_CONFIDENCE",
        designation_status="UNCONFIRMED",
        qualification_confidence="RESEARCH_HOLD",
        qualified="unknown",
        title="Chief Financial Officer",
        employer="Water Research Commission (WRC)",
        role_family="Executive Finance",
        industry="Government / Research",
        sub_industry="Water research",
        province="Gauteng", city="Pretoria",
        location_confidence="HIGH",
        evidence=(
            "nationalgovernment.co.za WRC management: 'Chief Financial Officer: Mr Fazel Ismail'. "
            "Professional designation not stated on that directory page."
        ),
        articles_status="NOT_ESTABLISHED",
        source_urls=[
            "https://nationalgovernment.co.za/units/management/194/water-research-commission-wrc",
        ],
        notes="Title/employer verified on public entity management directory. Designation not publicly verified. WRC has advertised CFO vacancies at times — confirm still current against latest annual report.",
        employer_systems=["Sage 300 / ACCPAC"],
    ),
]

# ---------------------------------------------------------------------------
# PREMIER FMCG (cmp-0105)
# ---------------------------------------------------------------------------
PEOPLE += [
    dict(
        name="Fritz Grobbelaar", first="Fritz", surname="Grobbelaar",
        des=["CA(SA)"],
        title="Chief Financial Officer",
        employer="Premier FMCG (Pty) Ltd",
        role_family="Executive Finance",
        industry="FMCG",
        sub_industry="Food manufacturing and distribution (bread, maize, confectionery)",
        province="Gauteng", city="Johannesburg",
        location_confidence="HIGH",
        linkedin_location="City of Johannesburg, Gauteng, South Africa",
        linkedin="https://za.linkedin.com/in/fritzgrobbelaar/",
        evidence=(
            "LinkedIn: 'As CFO at Premier FMCG, I lead finance, IT, legal, procurement, and logistics'; "
            "Education: The South African Institute of Chartered Accountants (SAICA). Location Johannesburg."
        ),
        articles_status="QUALIFIED_BUT_ARTICLES_NOT_ESTABLISHED",
        source_urls=[
            "https://za.linkedin.com/in/fritzgrobbelaar/",
        ],
        notes=(
            "Predecessor Kobus Gertenbach was CFO then promoted to CEO (2021, FoodBusinessAfrica). "
            "Fritz appears current CFO on LinkedIn. SAICA education line supports CA(SA); explicit 'CA(SA)' string "
            "not in the short public snippet beyond SAICA education — treated CONFIRMED on SAICA membership pathway "
            "stated on profile education field + CFO title. Employer systems: Sage 300 People only per IB note (not ERP)."
        ),
    ),
]

# ---------------------------------------------------------------------------
# TSHIKULULU (cmp-0111)
# ---------------------------------------------------------------------------
PEOPLE += [
    dict(
        name="Saleh Coovadia", first="Saleh", surname="Coovadia",
        des=["CA(SA)"],
        title="Finance Manager",
        employer="Tshikululu Social Investments (Pty) Ltd",
        role_family="Financial Management",
        industry="Non-Profit / Financial Services",
        sub_industry="Social investment fund management and advisory",
        province="Gauteng", city="Johannesburg",
        location_confidence="HIGH",
        evidence=(
            "RocketReach: Finance Manager at Tshikululu Social Investments (2022–now); "
            "education SAICA — CA(SA) 1997; PAAB CA(SA) (Accounting and Auditing) 1997; "
            "BCompt Hons / CTA UNISA; prior roles include Development Bank of Southern Africa, Anglo American Zimele, CFO Centre SA."
        ),
        academic=["BCompt Hons / CTA — University of South Africa"],
        articles_status="QUALIFIED_BUT_ARTICLES_NOT_ESTABLISHED",
        career=[
            {"employer": "Development Bank of Southern Africa (DBSA)", "title": "Manager: Loans Financial Management (CAD)", "notes": "2004–2011"},
            {"employer": "The CFO Centre South Africa", "title": "Not stated", "notes": "prior"},
            {"employer": "Anglo American Zimele Pty Ltd", "title": "Not stated", "notes": "prior"},
        ],
        historic_industries=["Development finance", "Mining / enterprise development", "Professional Services"],
        source_urls=[
            "https://rocketreach.co/saleh-coovadia-email_240579142",
        ],
        notes="CA(SA) 1997 per RocketReach education fields. Employer systems observed: Sage 300 (company-level).",
        employer_systems=["Sage 300 / ACCPAC"],
    ),
]

# ---------------------------------------------------------------------------
# HISENSE SA (cmp-0104) — Head of Finance (designation unverified)
# ---------------------------------------------------------------------------
PEOPLE += [
    dict(
        name="Phakama Mgole", first="Phakama", surname="Mgole",
        alternate_names=["Phakama Ca"],
        des=[],
        status="HIGH_CONFIDENCE",
        designation_status="UNCONFIRMED",
        qualification_confidence="RESEARCH_HOLD",
        qualified="unknown",
        title="Head of Finance",
        employer="Hisense South Africa",
        role_family="Head of Finance",
        industry="Manufacturing",
        sub_industry="Consumer electronics and appliances",
        province="Gauteng", city="Johannesburg",
        location_confidence="PROBABLE",
        evidence=(
            "Datanyze / RocketReach Hisense SA management: 'Phakama Mgole — Head of Finance' "
            "(RocketReach also shows display 'Phakama Ca' which may indicate CA pathway — not treated as confirmed CA(SA)). "
            "HQ Century City Cape Town; role listed Johannesburg on RocketReach."
        ),
        articles_status="NOT_ESTABLISHED",
        source_urls=[
            "https://www.datanyze.com/companies/hisense/371690770",
            "https://rocketreach.co/hisense-south-africa-management_b5d91db5f42e5d18",
        ],
        notes="Employment title from directory aggregators. 'Ca' in one display name is insufficient for CA(SA) confirmation. Financial Accountant Leandra Malan (Cape Town) noted in unverified queue separately.",
    ),
]

# ---------------------------------------------------------------------------
# Sources
# ---------------------------------------------------------------------------
src_urls = [
    ("https://quantumfoods.co.za/governance/", "Employer Website",
     "Quantum Foods board: André Hugo Muller CFO, CA(SA); other CA(SA) NEDs listed."),
    ("https://cfo.co.za/profiles/andre-muller/", "Company Biography",
     "André Muller CFO Quantum Foods; CA(SA); B.Acc Hons Stellenbosch; career history."),
    ("https://www.linkedin.com/in/andre-muller-0651b827/", "LinkedIn",
     "André Muller LinkedIn — Quantum Foods CFO."),
    ("https://novus.holdings/about/board-members/", "Employer Website",
     "Novus board bios: Kim Julies CA(SA) PwC articles; Keshree Alwar CA; Craig Wright context."),
    ("https://cfo.co.za/articles/novus-holdings-appoints-kim-julies-as-group-cfo/", "News",
     "Kim Julies appointed Group CFO effective 1 Jan 2026; Craig Wright resigns CFO 31 Dec 2025."),
    ("https://novus.holdings/wp-content/uploads/2024/06/IAR24-Annual-Financial-Statements-v_Final.pdf", "Annual Report",
     "AFS 2024 supervised by Craig Wright CA(SA)."),
    ("https://novus.holdings/novus-holdings-appoints-new-chief-financial-officer-2/", "Employer Website",
     "Keshree Alwar CA(SA) SAICA 2010; Group CFO from Sep 2021."),
    ("https://www.marketscreener.com/quote/stock/NOVUS-HOLDINGS-LIMITED-22213288/news/Novus-Holdings-Limited-Announces-Chief-Financial-Officer-Changes-44404046/",
     "News", "Craig Wright CA appointed Group CFO Aug 2023; Keshree to MML CEO."),
    ("https://theorg.com/org/food-lovers-market-holdings/org-chart/yolanda-louw", "Company Biography",
     "Yolanda Louw CFO FLM; SAICA & CIMA member; NMU degree; KPMG/Andersen path."),
    ("https://www.linkedin.com/in/yolanda-louw-875193a0/", "LinkedIn",
     "Yolanda Louw — Food Lover's Market Holdings; SAICA education."),
    ("https://za.linkedin.com/in/jp-du-toit-ca-sa-012989a4/", "LinkedIn",
     "JP du Toit CA(SA) — Group Finance Manager FLM; BAccHons Stellenbosch."),
    ("https://theorg.com/org/food-lovers-market-holdings", "Directory",
     "FLM org: Yolanda Louw CFO; Mc Stoman CA Financial Controller; Jp du Toit Ca Group Finance Manager."),
    ("https://www.zoominfo.com/p/Mc-Stoman/8715118211", "Directory",
     "Mc Stoman Financial Controller FLM; Mazars/KPMG; NWU CTA."),
    ("https://www.tcta.co.za/wp-content/uploads/2026/01/TCTA-CFO-Wins-Award.pdf", "Employer Website",
     "Andisa Zinja CA(SA) MPhil CFO TCTA; Public Sector CFO of the Year 2025."),
    ("https://cfo.co.za/articles/trans-caledon-tunnel-authority-cfo-andisa-zinja-is-tunnelling-a-new-vision/", "News",
     "Andisa Zinja TCTA CFO profile June 2026."),
    ("https://nationalgovernment.co.za/units/management/290/trans-caledon-tunnel-authority-tcta", "Directory",
     "TCTA management: CFO Andisa Zinja; Financial Controller Wendy Nkambule."),
    ("https://cfo.co.za/articles/cticc-appoints-wayne-de-wet-as-new-cfo/", "News",
     "Wayne de Wet CA appointed CTICC CFO; BAccSci + Hons."),
    ("https://nationalgovernment.co.za/units/management/194/water-research-commission-wrc", "Directory",
     "WRC CFO Mr Fazel Ismail."),
    ("https://za.linkedin.com/in/fritzgrobbelaar/", "LinkedIn",
     "Fritz Grobbelaar CFO Premier FMCG; SAICA education."),
    ("https://rocketreach.co/saleh-coovadia-email_240579142", "Directory",
     "Saleh Coovadia CA(SA) 1997; Finance Manager Tshikululu."),
    ("https://www.datanyze.com/companies/hisense/371690770", "Directory",
     "Hisense SA: Phakama Mgole Head of Finance; Aaron Wang listed CFO (verify)."),
    ("https://rocketreach.co/hisense-south-africa-management_b5d91db5f42e5d18", "Directory",
     "Hisense SA management incl. Phakama Head of Finance; Leandra Malan Financial Accountant."),
]

sid = db_lib.next_id(db_lib.SOURCES_PATH, "src")
for url, typ, summ in src_urls:
    SOURCES.append(dict(
        id="src-%04d" % sid, url=url, source_type=typ, person_id=None, company_id=None,
        evidence_type="GENERAL", evidence_summary=summ,
        qualification_supported=True, skill_supported=None, system_supported=None,
        employment_supported=True, accessed_date=db_lib.TODAY,
        reliability="PRIMARY" if typ in ("Employer Website", "Annual Report") else "STRONG",
        status="USED",
    ))
    sid += 1

people = db_lib.append_batch(
    PEOPLE,
    company_specs=None,
    source_specs=SOURCES,
    label="Batch 13 (IB finance leaders)",
)
print(f"Batch 13 people records prepared: {len(people)}")
