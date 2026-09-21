#!/usr/bin/env python3
"""Batch 13 — Western Cape (core: Cape Town metro + Winelands + Helderberg) NON-CA designations,
LinkedIn-evidenced. Session 3 (2026-09-21) sourcing sweep for PA(SA) / AGA(SA) / ACCA / CIMA.

Evidence tiers used here:
- CONFIRMED  = designation wording appears on the person's own indexed public LinkedIn page
               (name field, headline, About, or Licences & Certifications) with a retrieved URL.
- HIGH_CONFIDENCE = designation wording appears in the person's own LinkedIn name/headline as a
               LinkedIn "people card" rendered on another public profile page (URL of the
               person's own profile NOT retrieved — never fabricated; see notes).
- ARTICLES_CONFIRMED_DESIGNATION_UNVERIFIED = explicit "completed SAIPA articles", no designation.

Geography rule for this sweep: Western Cape core only (metro, Stellenbosch, Paarl, Somerset West,
Kraaifontein, Durbanville …). Garden Route, West Coast (Langebaan/Saldanha) and Breede Valley
(Worcester) are out of scope per the brief.

Uses db_lib.append_batch.
"""
import os
import sys

BASE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE)
import db_lib  # noqa: E402

TODAY = "2026-09-21"
CARD_NOTE = ("Profile URL not retrieved (seen as the person's own LinkedIn people-card on another public "
             "profile page — see source_urls). Do not fabricate a URL; resolve via LinkedIn people search.")

PEOPLE = []
COMPANIES = []
SOURCES = []

# ---------------------------------------------------------------------------------------------
# CONFIRMED — own public LinkedIn page indexed, URL retrieved
# ---------------------------------------------------------------------------------------------
PEOPLE += [
    dict(name="TJ Toüa", first="TJ", surname="Toüa", alternate_names=["TJ Toua"], des=["PA(SA)"], date=TODAY, verified=TODAY,
         title="Managing Director", employer="TnT Pro Services (Pty) Ltd",
         role_family="Executive Finance", function="Owner-managed accounting practice", industry="Accounting / Audit",
         sub_industry="SAIPA accounting practice",
         province="Western Cape", city="Kraaifontein (Cape Town)", location_confidence="HIGH",
         linkedin_location="City of Cape Town, Western Cape, South Africa",
         evidence='LinkedIn headline "Professional Accountant (SA)"; Experience: Managing Director, TnT Pro Services (Jan 2025–); '
                  'Financial Accountant Manager, Zeelie Professional Accountants SA (Mar 2022–Mar 2025, Kraaifontein); '
                  '"SAIPA Trainee Accountant — SDK Chartered Accountants (SA), Jan 2018–Dec 2020, Cape Town".',
         academic=["Stellenbosch University"],
         articles_status="TRAINING_CONTRACT_CONFIRMED", articles_body="SAIPA", articles_employer="SDK Chartered Accountants (SA)",
         articles_period="2018-01 to 2020-12", articles_location="Cape Town (Durbanville)",
         route="SAIPA training contract (SDK Chartered Accountants) → PA(SA)",
         acct_systems=["Sage (edition not stated; credential May 2019)"],
         career=[dict(employer="Zeelie Professional Accountants SA", title="Financial Accountant Manager", notes="Mar 2022–Mar 2025, Kraaifontein"),
                 dict(employer="Propinvest | Residential Property Investments Company", title="Property Management Accountant", notes="Jan 2021–Mar 2022, Paarl"),
                 dict(employer="SDK Chartered Accountants (SA)", title="SAIPA Trainee Accountant", notes="Jan 2018–Dec 2020, Cape Town")],
         yoe="7-9", yoe_basis="LinkedIn experience 2018–present",
         linkedin="https://www.linkedin.com/in/tj-to%C3%BCa-a7569b125/",
         source_urls=["https://www.linkedin.com/in/tj-to%C3%BCa-a7569b125/"],
         notes="Sage credential issued May 2019 (product edition not stated — NOT Sage 300 evidence). Own practice since 2025."),
    dict(name="Melissa Lee Williams", first="Melissa Lee", surname="Williams", des=["PA(SA)"], date=TODAY, verified=TODAY,
         title="Accountant (title not visible in public snippet)", employer="Galbraith Rushby (per About) / Go Tourism (per Experience header) — employer CONFLICTING",
         role_family="Financial Accounting", industry="Accounting / Audit",
         province="Western Cape", city="Cape Town", location_confidence="HIGH",
         linkedin_location="City of Cape Town, Western Cape, South Africa",
         evidence='LinkedIn About: "I\'m a qualified Professional Accountant (SA) currently working at Galbraith Rushby…"; '
                  'Experience header lists Go Tourism; Education: Stellenbosch University (2015–2019).',
         academic=["Stellenbosch University (2015–2019)"],
         route="SAIPA → PA(SA)",
         yoe="4-6", yoe_basis="graduated 2019",
         linkedin="https://www.linkedin.com/in/melissa-lee-williams-123663171/",
         source_urls=["https://www.linkedin.com/in/melissa-lee-williams-123663171/"],
         notes="Employer conflict between About text (Galbraith Rushby, Cape Town accounting firm) and Experience header (Go Tourism) — verify which is current."),
    dict(name="Vohan Jamneck", first="Vohan", surname="Jamneck", des=["PA(SA)"], date=TODAY, verified=TODAY,
         title="Owner / Professional Accountant (SA)", employer="VJ Professional Accountants",
         role_family="Executive Finance", function="Owner-managed accounting & tax practice", industry="Accounting / Audit",
         sub_industry="SAIPA accounting practice",
         province="Western Cape", city="Cape Town", location_confidence="HIGH",
         linkedin_location="City of Cape Town, Western Cape, South Africa",
         evidence='LinkedIn Licences & Certifications: "Professional Accountant (S.A) — SAIPA"; "Professional Tax Practitioner (S.A) — SAIPA"; '
                  'activity: "Finally qualified as a Professional Accountant (SA) after 3 years of articles!"; Education: SAIPA.',
         articles_status="CONFIRMED_EXPLICIT", articles_body="SAIPA", articles_period="3 years (employer not stated)",
         route="SAIPA articles (3 years) → PA(SA); also Professional Tax Practitioner (SA)",
         acct_systems=["Sage (edition not stated; credential May 2019)"],
         yoe="7-10", yoe_basis="SAIPA education 2013–2018 + practice",
         linkedin="https://www.linkedin.com/in/vohanjamneck/",
         source_urls=["https://www.linkedin.com/in/vohanjamneck/"],
         notes="Sage credential 2019 (edition not stated — NOT Sage 300 evidence). English/Afrikaans."),
    dict(name="Johan van Schalkwyk", first="Johan", surname="van Schalkwyk", des=["ACMA", "CGMA", "PA(SA)"], date=TODAY, verified=TODAY,
         body=["CIMA", "SAIPA"],
         title="Finance role (title not visible in public snippet)", employer="Green Create (Green Create Africa)",
         role_family="Financial Control", industry="Engineering", sub_industry="Clean-tech / industrial waste-to-value",
         province="Western Cape", city="Cape Town", location_confidence="HIGH",
         linkedin_location="City of Cape Town, Western Cape, South Africa",
         evidence='LinkedIn name "Johan van Schalkwyk ACMA, CGMA"; Licences & Certifications: "ACMA, CGMA — Chartered Institute of Management '
                  'Accountants (CIMA)"; "Professional Accountant (SA) — South African Institute of Professional Accountants (SAIPA)".',
         academic=["Stellenbosch University (2011)"],
         per="CIMA_PER", route="CIMA → ACMA/CGMA; SAIPA → PA(SA) (dual designation)",
         linkedin="https://www.linkedin.com/in/johan-van-schalkwyk-acma-cgma-19068110b/",
         source_urls=["https://www.linkedin.com/in/johan-van-schalkwyk-acma-cgma-19068110b/"],
         notes="DUAL CIMA + SAIPA. Green Create Africa — onsite industrial organic-waste infrastructure (Cape Town)."),
    dict(name="Lorraine Sarah Hand", first="Lorraine Sarah", surname="Hand", des=["ACMA", "CGMA"], date=TODAY, verified=TODAY,
         title="Strategic finance leader (exact title not visible in public snippet)", employer="Ozow",
         role_family="Executive Finance", function="FP&A / financial modelling / due diligence", industry="Fintech", sub_industry="Payments",
         province="Western Cape", city="Cape Town", location_confidence="HIGH",
         linkedin_location="City of Cape Town, Western Cape, South Africa",
         evidence='LinkedIn name "Lorraine Sarah Hand, ACMA CGMA"; CIMA education entry: "Completed CIMA Diploma (2023) → Advanced Diploma (2024); '
                  'Passed Strategic Case Study (Oct 2025); PER approved; Admitted as ACMA, CGMA (2025)"; headline "Strategic finance leader skilled in '
                  'financial modelling and rigorous financial due…".',
         per="CIMA_PER", route="CIMA (2023–2025) → ACMA, CGMA (admitted 2025)",
         skills=[dict(skill="financial modelling", confidence="CONFIRMED", current_or_historic="CURRENT", employer_context="Ozow"),
                 dict(skill="financial due diligence", confidence="CONFIRMED", current_or_historic="CURRENT", employer_context="Ozow")],
         linkedin="https://www.linkedin.com/in/lorraine-sarah-hand-acma-cgma/",
         source_urls=["https://www.linkedin.com/in/lorraine-sarah-hand-acma-cgma/"],
         notes="Newly admitted ACMA, CGMA (2025) with prior long finance career (education history back to 1995). Ozow hosts Payments Club events in Cape Town."),
    dict(name="Richard McQueen", first="Richard", surname="McQueen", des=["ACMA", "CGMA"], date=TODAY, verified=TODAY,
         title="Finance role (title not visible in public snippet)", employer="Linkqage",
         role_family="Management Accounting", industry="Technology",
         province="Western Cape", city="Cape Town", location_confidence="HIGH",
         linkedin_location="City of Cape Town, Western Cape, South Africa",
         evidence='LinkedIn name "Richard McQueen ACMA, CGMA"; About: "A qualified Chartered Management Accountant (CIMA) with diverse experience gained in the…"; Education: CIMA.',
         per="CIMA_PER", route="CIMA → ACMA, CGMA",
         linkedin="https://www.linkedin.com/in/richard-mcqueen-acma-cgma-7b3b7b2a/",
         source_urls=["https://www.linkedin.com/in/richard-mcqueen-acma-cgma-7b3b7b2a/"]),
    dict(name="Lukas Swart", first="Lukas", surname="Swart", des=["ACMA", "CGMA"], date=TODAY, verified=TODAY,
         title="Finance role (title not visible in public snippet)", employer="Astral Foods Ltd",
         role_family="Financial Accounting", industry="FMCG", sub_industry="Poultry / food production",
         province="Western Cape", city="Western Cape (city not stated)", location_confidence="HIGH",
         linkedin_location="Western Cape, South Africa",
         evidence='LinkedIn name "Lukas Swart ACMA, CGMA"; Licences: "ACMA, CGMA — CIMA, Issued May 2021, Credential ID 1-29XPLIX"; "IFRS Certificate — AICPA, May 2021"; '
                  '"Advanced Diploma in Management Accounting — CIMA, Jan 2019"; "Independent Reviewer — SAIPA, Oct 2018"; CIMA Strategic Level 2019–2020.',
         per="CIMA_PER", route="CIMA → ACMA, CGMA (May 2021)",
         linkedin="https://www.linkedin.com/in/lukas-swart-acma-cgma-761180117/",
         source_urls=["https://www.linkedin.com/in/lukas-swart-acma-cgma-761180117/"],
         notes="Holds a SAIPA 'Independent Reviewer' credential (2018) — implies SAIPA membership but PA(SA) NOT explicitly stated; not recorded as PA(SA). "
               "Earlier career Pretoria/Johannesburg; current location Western Cape (Astral has WC poultry operations)."),
    dict(name="Rudi van Zyl", first="Rudi", surname="van Zyl", des=["PA(SA)", "ACMA", "CGMA"], date=TODAY, verified=TODAY,
         body=["SAIPA", "CIMA"],
         title="Finance role (title not visible in public snippet)", employer="Technical Systems",
         role_family="Financial Control", industry="Engineering",
         province="Western Cape", city="Cape Town", location_confidence="HIGH",
         linkedin_location="Cape Town",
         evidence='LinkedIn name "Rudi van Zyl ACMA, CGMA"; About: "I am a Qualified Professional Accountant (S.A.) with 15+ years of experience across…"; '
                  'Licences: "Chartered Global Management Accountant — CIMA, Issued Aug 2025 (402522666)"; "Independent Reviewer (S.A.) — SAIPA, Apr 2021 (34136)"; '
                  '"Commissioner of Oaths — SAIPA, Jan 2015".',
         per="CIMA_PER", route="SAIPA → PA(SA) (member no. 34136 per credential IDs); CIMA → ACMA/CGMA (Aug 2025)",
         yoe="15+", yoe_basis="About: 15+ years",
         linkedin="https://www.linkedin.com/in/rudi-van-zyl-7b5561143/",
         source_urls=["https://www.linkedin.com/in/rudi-van-zyl-7b5561143/"],
         notes="DUAL SAIPA + CIMA; 15+ years; SAIPA Independent Reviewer."),
    dict(name="Irene Rupert", first="Irene", surname="Rupert", alternate_names=["Irene Lovell Rupert", "Irene Lovell"], des=["CGMA", "PA(SA)"], date=TODAY, verified=TODAY,
         body=["CIMA", "SAIPA"],
         title="Co-Founder", employer="AgrigateOne",
         role_family="Executive Finance", function="Founder / finance", industry="Technology", sub_industry="Agri-tech (fresh-produce export platform)",
         province="Western Cape", city="Stellenbosch", location_confidence="HIGH",
         linkedin_location="Stellenbosch",
         evidence='LinkedIn About: "Chartered Global Management Accountant with a CIMA and Professional Accountant (SA)…"; Organizations: "My CIMA membership was approved in March 2017"; '
                  '"South African Institute for Professional Accountants — Trainee Jan 2014… complete our SAIPA articles as well during our 3 year contract at Moore Stephens".',
         articles_status="CONFIRMED_EXPLICIT", articles_body="SAIPA", articles_employer="Moore Stephens (Stellenbosch)", articles_period="2014–2016", articles_location="Stellenbosch",
         per="CIMA_PER", route="CIMA articles + SAIPA articles at Moore Stephens (2014–2016) → CGMA (CIMA, Mar 2017) + PA(SA)",
         linkedin="https://za.linkedin.com/in/irene-lovell-rupert",
         source_urls=["https://za.linkedin.com/in/irene-lovell-rupert"],
         notes="DUAL CIMA (CGMA) + SAIPA (PA(SA)). ACMA not written verbatim in snippet — recorded as CGMA (CIMA body confirmed)."),
    dict(name="Lize Vorster", first="Lize", surname="Vorster", des=["ACMA", "CGMA", "PA(SA)"], date=TODAY, verified=TODAY,
         body=["CIMA", "SAIPA"],
         title="Senior Manager", employer="Moore Management Services (Moore Stellenbosch)",
         role_family="Management Accounting", function="Outsourced accounting / management reporting", industry="Accounting / Audit",
         sub_industry="Outsourced finance & management accounting",
         province="Western Cape", city="Somerset West", location_confidence="HIGH",
         linkedin_location="Somerset West",
         evidence='LinkedIn headline "ACMA, CGMA Professional Accountant (SA) Senior Manager at Moore Management Services"; Experience: Moore Stellenbosch; '
                  'Education: Stellenbosch University BCom Management Accounting 2012–2014, Hons BCom 2015.',
         academic=["BCom Management Accounting, Stellenbosch University (2012–2014)", "Hons BCom, Stellenbosch University (2015)"],
         per="CIMA_PER", route="CIMA → ACMA/CGMA; SAIPA → PA(SA) (Moore Management Services runs CIMA + SAIPA trainee programmes)",
         yoe="9-11", yoe_basis="graduated 2015",
         linkedin="https://www.linkedin.com/in/lize-vorster-0627ba9b/",
         source_urls=["https://www.linkedin.com/in/lize-vorster-0627ba9b/"],
         notes="DUAL CIMA + SAIPA. Moore Stellenbosch Management Services = CIMA-accredited training practice (Techno Park)."),
    dict(name="Matthew Kiln", first="Matthew", surname="Kiln", des=["ACMA", "CGMA"], date=TODAY, verified=TODAY,
         title="Finance role (title not visible in public snippet)", employer="Tripco",
         role_family="Management Accounting", industry="Other",
         province="Western Cape", city="Stellenbosch", location_confidence="HIGH",
         linkedin_location="Stellenbosch",
         evidence='LinkedIn About: "I\'m a qualified Chartered Management Accountant (ACMA, CGMA) with a BCom (Hons) from…"; Education: Stellenbosch University.',
         academic=["BCom (Hons), Stellenbosch University"],
         per="CIMA_PER", route="CIMA → ACMA, CGMA",
         linkedin="https://www.linkedin.com/in/matthew-kiln-a19746253/",
         source_urls=["https://www.linkedin.com/in/matthew-kiln-a19746253/"]),
    dict(name="Andrew Miles", first="Andrew", surname="Miles", des=["AGA(SA)"], date=TODAY, verified=TODAY,
         title="Financial role (headline truncated: 'accomplished Financial…')", employer="Pick n Pay franchise (Rondebosch & Observatory)",
         role_family="Financial Control", industry="Retail", sub_industry="Grocery retail franchise",
         province="Western Cape", city="Cape Town", location_confidence="HIGH",
         linkedin_location="Cape Town",
         evidence='LinkedIn About: "Andrew is a qualified Associate General Accountant (AGA SA) and accomplished Financial…"; Experience: "Pnp Franchise | Rondebosch and Observatory"; Education: University of the Free State.',
         academic=["University of the Free State"],
         route="SAICA → AGA(SA)",
         linkedin="https://www.linkedin.com/in/andrew-miles-595690249/",
         source_urls=["https://www.linkedin.com/in/andrew-miles-595690249/"]),
]

# ---------------------------------------------------------------------------------------------
# ARTICLES CONFIRMED, DESIGNATION UNVERIFIED
# ---------------------------------------------------------------------------------------------
PEOPLE += [
    dict(name="Sifiso Fakude", first="Sifiso", surname="Fakude", des=[], status="ARTICLES_CONFIRMED_DESIGNATION_UNVERIFIED",
         qualified="unknown", designation_status="UNCONFIRMED", qualification_confidence="RESEARCH_HOLD", date=TODAY, verified=TODAY,
         title="Senior Fund Accountant", employer="JTC Group", role_start="2024-03",
         role_family="Financial Accounting", function="Fund accounting", industry="Financial Services", sub_industry="Fund administration",
         province="Western Cape", city="Cape Town", location_confidence="HIGH",
         linkedin_location="City of Cape Town, Western Cape, South Africa",
         evidence='LinkedIn headline/About: "Accountant · Completed SAIPA articles and ready to make a career move."; "Accountant (with completed SAIPA Articles)"; '
                  'no PA(SA) designation stated → designation unverified.',
         articles_status="CONFIRMED_EXPLICIT", articles_body="SAIPA",
         acct_systems=["Pastel Payroll"],
         career=[dict(employer="JTC Group", title="Fund Accountant → Senior Fund Accountant", notes="Oct 2022–present, Cape Town"),
                 dict(employer="Fives Futbol", title="Accounts Manager", notes="Feb 2021–Sep 2022, Cape Town"),
                 dict(employer="The Confiance Group", title="(accounting)", notes="Jan–Feb 2021, Tygervalley")],
         academic=["University of the Western Cape", "UNISA"],
         linkedin="https://www.linkedin.com/in/sifiso-fakude-66475a86/",
         source_urls=["https://www.linkedin.com/in/sifiso-fakude-66475a86/"],
         notes="Completed SAIPA articles; PA(SA) membership not stated. IFRS for SMEs AFS, VAT/EMP returns, provisional tax, management accounts. "
               "Signals openness to a move ('ready to make a career move')."),
]

# ---------------------------------------------------------------------------------------------
# HIGH_CONFIDENCE — person's own LinkedIn name/headline seen as a people-card on another public
# profile page (own profile URL not retrieved). Source URL = page on which the card was rendered.
# ---------------------------------------------------------------------------------------------
CARD_PAGE_SIFISO = "https://www.linkedin.com/in/sifiso-fakude-66475a86/"
CARD_PAGE_KGABISO = "https://www.linkedin.com/in/kgabiso-mahlangu-aga-sa-b53a951a/"
CARD_PAGE_NONKOSI = "https://www.linkedin.com/in/nonkosi-xaba-467920100/"
CARD_PAGE_CHRISTA = "https://www.linkedin.com/in/christa-pretorius-8632345/"
CARD_PAGE_NASTASSJA = "https://www.linkedin.com/in/nastassja-nel-71a15364/"
CARD_PAGE_ELIZABETH = "https://www.linkedin.com/in/elizabeth-turner-6b15b7a6/"
CARD_PAGE_MITHI = "https://www.linkedin.com/in/mangalisomithi/"
CARD_PAGE_ARISHKA = "https://www.linkedin.com/in/arishka-maharaj-3b819310b/"
CARD_PAGE_MAX = "https://www.linkedin.com/in/maxdeclippel/"
CARD_PAGE_LOVEMORE = "https://www.linkedin.com/in/lovemore-chimbadzwa-bsc-81069745/"

HC = dict(status="HIGH_CONFIDENCE", qualification_confidence="HIGH", date=TODAY, verified=TODAY)

PEOPLE += [
    dict(name="Wynand Nel", first="Wynand", surname="Nel", des=["PA(SA)"], **HC,
         title="Supervisor", employer="JTC Group", role_family="Financial Accounting", function="Fund accounting / administration",
         industry="Financial Services", sub_industry="Fund administration",
         province="Western Cape", city="Cape Town", location_confidence="HIGH", linkedin_location="City of Cape Town",
         evidence='LinkedIn people-card (own name field): "Wynand Nel Professional Accountant (SA) — Supervisor - JTC Group — City of Cape Town" (seen on 3 separate public pages).',
         source_urls=[CARD_PAGE_KGABISO, "https://www.linkedin.com/in/zozo-mdakane-36b6a21b/", "https://www.linkedin.com/in/waynewatsonca/"],
         notes=CARD_NOTE + " 1K followers."),
    dict(name="Nobungcwele Gaxela", first="Nobungcwele", surname="Gaxela", des=["PA(SA)"], **HC,
         title="Senior Fund Accountant", employer=None, role_family="Financial Accounting", function="Fund accounting",
         industry="Financial Services", sub_industry="Fund administration",
         province="Western Cape", city="Cape Town", location_confidence="HIGH", linkedin_location="Cape Town",
         evidence='LinkedIn people-card: "Nobungcwele Gaxela — Professional Accountant (SA) | Senior Fund Accountant | Member of the South African Institute of Professional Accountants (SA) — Cape Town".',
         source_urls=[CARD_PAGE_SIFISO], notes=CARD_NOTE + " Employer not shown on card."),
    dict(name="Mzwandile Jama", first="Mzwandile", surname="Jama", des=["PA(SA)"], **HC,
         title="(not shown on card)", employer=None, role_family="Other",
         province="Western Cape", city="Cape Town", location_confidence="HIGH", linkedin_location="City of Cape Town",
         evidence='LinkedIn people-card: "Mzwandile Jama — Professional Accountant (SA), Tax Practitioner (SA) — City of Cape Town" (seen on 2 pages).',
         source_urls=[CARD_PAGE_SIFISO, "https://www.linkedin.com/in/sanele-masondo-620a66105/"], notes=CARD_NOTE + " Also Tax Practitioner (SA)."),
    dict(name="Samkelo Shangase", first="Samkelo", surname="Shangase", des=["PA(SA)"], **HC,
         title="(not shown on card)", employer=None, role_family="Other",
         province="Western Cape", city="Cape Town", location_confidence="HIGH", linkedin_location="City of Cape Town",
         evidence='LinkedIn people-card: "Samkelo Shangase — Professional Accountant (S.A.); Professional Tax Practitioner (S.A) || Think twice, action once — City of Cape Town".',
         source_urls=[CARD_PAGE_SIFISO], notes=CARD_NOTE + " Also Professional Tax Practitioner (SA)."),
    dict(name="Nomthandazo Biyela", first="Nomthandazo", surname="Biyela", des=["PA(SA)"], **HC,
         title="Senior Financial Accountant", employer="Rain", role_family="Financial Accounting",
         industry="Technology", sub_industry="Telecommunications",
         province="Western Cape", city="Cape Town", location_confidence="PROBABLE", linkedin_location="Cape Town",
         evidence='LinkedIn people-card: "Nomthandazo Biyela — Professional Accountant (SA) I Professional Tax Practitioner (SA) — Cape Town"; '
                  'ZoomInfo: Senior Financial Accountant at Rain (2023–present), ex Mazars (Accountant → Senior Accountant), Wanda Reed Partners.',
         career=[dict(employer="Mazars", title="Accountant → Senior Accountant", notes="per ZoomInfo"),
                 dict(employer="Wanda Reed Partners", title="Year End Accountant", notes="real estate; per ZoomInfo")],
         linkedin="https://www.linkedin.com/in/nomthandazo-biyela-842340146",
         source_urls=[CARD_PAGE_SIFISO, "https://www.zoominfo.com/p/Nomthandazo-Biyela/5454638247"],
         notes="LinkedIn URL taken from ZoomInfo 'sameAs' field (third-party) — verify. Rain HQ is Bryanston; LinkedIn location shows Cape Town."),
    dict(name="Bongiwe Mayekiso", first="Bongiwe", surname="Mayekiso", des=["PA(SA)"], **HC,
         title="Financial Accountant", employer=None, role_family="Financial Accounting",
         province="Western Cape", city="Cape Town", location_confidence="HIGH", linkedin_location="Cape Town",
         evidence='LinkedIn people-card: "Bongiwe Mayekiso — Financial Accountant PA (SA) — Cape Town".',
         source_urls=[CARD_PAGE_NONKOSI], notes=CARD_NOTE),
    dict(name="Timothy Stegen", first="Timothy", surname="Stegen", des=["PA(SA)"], **HC,
         title="(not shown on card)", employer=None, role_family="Other",
         province="Western Cape", city="Cape Town", location_confidence="HIGH", linkedin_location="City of Cape Town",
         evidence='LinkedIn people-card: "Timothy Stegen — Professional Accountant (SA) — City of Cape Town".',
         source_urls=[CARD_PAGE_CHRISTA], notes=CARD_NOTE),
    dict(name="Ryan Warren", first="Ryan", surname="Warren", des=["AGA(SA)"], **HC,
         title="(not shown on card)", employer=None, role_family="Other",
         province="Western Cape", city="Cape Town", location_confidence="HIGH", linkedin_location="Cape Town",
         evidence='LinkedIn people-card: "Ryan Warren AGA (SA) — Cape Town".',
         source_urls=[CARD_PAGE_NASTASSJA], notes=CARD_NOTE),
    dict(name="Nicol Smit", first="Nicol", surname="Smit", des=["ACMA", "CGMA"], **HC,
         title="(not shown on card)", employer="Capitec Bank", role_family="Other",
         industry="Banking",
         province="Western Cape", city="Cape Town", location_confidence="HIGH", linkedin_location="City of Cape Town",
         evidence='LinkedIn people-card (own name field): "Nicol Smit ACMA, CGMA — Capitec Bank — 442 followers — City of Cape Town".',
         per="CIMA_PER", source_urls=[CARD_PAGE_ELIZABETH], notes=CARD_NOTE),
    dict(name="Louwtjie Venter", first="Louwtjie", surname="Venter", des=["ACMA", "CGMA"], **HC,
         title="(not shown on card)", employer="Six33 Group", role_family="Other",
         province="Western Cape", city="Cape Town", location_confidence="HIGH", linkedin_location="City of Cape Town",
         evidence='LinkedIn people-card (own name field): "Louwtjie Venter ACMA CGMA — Six33 Group — 2K followers — City of Cape Town".',
         per="CIMA_PER", source_urls=[CARD_PAGE_MITHI], notes=CARD_NOTE),
    dict(name="Tanya Swart", first="Tanya", surname="Swart", des=["AGA(SA)"], **HC,
         title="(not shown on card)", employer=None, role_family="Other",
         province="Western Cape", city="Stellenbosch", location_confidence="HIGH", linkedin_location="Stellenbosch",
         evidence='LinkedIn people-card: "Tanya Swart - AGA (SA) — Stellenbosch".',
         source_urls=[CARD_PAGE_ARISHKA], notes=CARD_NOTE),
    dict(name="Melanie Dennis-Jacobs", first="Melanie", surname="Dennis-Jacobs", des=["AGA(SA)"], **HC,
         title="(not shown on card)", employer="The Red Carnation Hotel Collection", role_family="Other",
         industry="Hospitality", sub_industry="Luxury hotels",
         province="Western Cape", city="Cape Town", location_confidence="HIGH", linkedin_location="City of Cape Town",
         evidence='LinkedIn people-card (own name field): "Melanie Dennis-Jacobs AGA(SA) — The Red Carnation Hotel Collection (Red Carnation Hotels) — 2K followers — City of Cape Town" (seen on 3 pages).',
         source_urls=[CARD_PAGE_ELIZABETH, CARD_PAGE_LOVEMORE, "https://www.linkedin.com/in/melody-johnson-03995336/"], notes=CARD_NOTE),
    dict(name="Nora van Rensburg", first="Nora", surname="van Rensburg", des=["ACMA", "CGMA"], **HC,
         title="(not shown on card)", employer="Moore Belgium", role_family="Other",
         industry="Accounting / Audit",
         province="Western Cape", city="Cape Town", location_confidence="HIGH", linkedin_location="City of Cape Town",
         evidence='LinkedIn people-card (own name field): "Nora van Rensburg (ACMA, CGMA) — Moore Belgium — 277 followers — City of Cape Town".',
         per="CIMA_PER", source_urls=[CARD_PAGE_MAX], notes=CARD_NOTE + " Appears to work for a Belgian Moore member firm while located in Cape Town (remote) — verify."),
]

# ---------------------------------------------------------------------------------------------
# Companies (new only — checked against people_index.md §5 first)
# ---------------------------------------------------------------------------------------------
cid = db_lib.next_id(db_lib.COMPANIES_PATH, "cmp")


def company(name, industry, sub=None, locs=(), aliases=(), website=None, src=()):
    global cid
    rec = dict(id="cmp-%04d" % cid, company_name=name, company_aliases=list(aliases), website=website,
               industry=industry, sub_industry=sub, headquarters=None, south_africa_locations=list(locs),
               company_size_if_public=None, listed_or_private="unknown", parent_company=None,
               source_urls=list(src), date_verified=TODAY)
    cid += 1
    return rec


COMPANIES += [
    company("TnT Pro Services (Pty) Ltd", "Accounting / Audit", "SAIPA accounting practice", ["Kraaifontein (Cape Town)"],
            src=["https://www.linkedin.com/in/tj-to%C3%BCa-a7569b125/"]),
    company("Galbraith Rushby", "Accounting / Audit", "Accounting & tax practice", ["Cape Town"],
            src=["https://www.linkedin.com/in/melissa-lee-williams-123663171/"]),
    company("VJ Professional Accountants", "Accounting / Audit", "SAIPA accounting practice", ["Cape Town"],
            src=["https://www.linkedin.com/in/vohanjamneck/"]),
    company("Green Create", "Engineering", "Clean-tech / industrial waste-to-value", ["Cape Town"], aliases=["Green Create Africa"],
            src=["https://www.linkedin.com/in/johan-van-schalkwyk-acma-cgma-19068110b/"]),
    company("Ozow", "Fintech", "Payments", ["Cape Town"], website="https://ozow.com/",
            src=["https://www.linkedin.com/in/lorraine-sarah-hand-acma-cgma/"]),
    company("Linkqage", "Technology", None, ["Cape Town"], src=["https://www.linkedin.com/in/richard-mcqueen-acma-cgma-7b3b7b2a/"]),
    company("Astral Foods Ltd", "FMCG", "Poultry / food production", ["Western Cape (County Fair operations)", "Pretoria (HQ)"],
            aliases=["Astral Foods"], website="https://www.astralfoods.com/", src=["https://www.linkedin.com/in/lukas-swart-acma-cgma-761180117/"]),
    company("Technical Systems", "Engineering", None, ["Cape Town"], src=["https://www.linkedin.com/in/rudi-van-zyl-7b5561143/"]),
    company("AgrigateOne", "Technology", "Agri-tech (fresh-produce export platform)", ["Stellenbosch"], website="https://www.agrigateone.com/",
            src=["https://za.linkedin.com/in/irene-lovell-rupert"]),
    company("Moore Stellenbosch", "Accounting / Audit", "Audit, accounting & CIMA/SAICA training practice (Techno Park)", ["Stellenbosch"],
            aliases=["Moore Management Services", "Moore Stellenbosch Inc", "Moore Stephens Stellenbosch"],
            website="https://www.moore-southafrica.com/locations/stellenbosch/",
            src=["https://www.moore-southafrica.com/locations/stellenbosch/", "https://www.linkedin.com/in/lize-vorster-0627ba9b/"]),
    company("Tripco", "Other", None, ["Stellenbosch"], src=["https://www.linkedin.com/in/matthew-kiln-a19746253/"]),
    company("Pick n Pay franchise (Rondebosch & Observatory)", "Retail", "Grocery retail franchise", ["Cape Town (Rondebosch, Observatory)"],
            aliases=["Pnp Franchise | Rondebosch and Observatory"], src=["https://www.linkedin.com/in/andrew-miles-595690249/"]),
    company("JTC Group", "Financial Services", "Fund administration", ["Cape Town"], website="https://www.jtcgroup.com/",
            src=["https://www.linkedin.com/in/sifiso-fakude-66475a86/"]),
    company("Rain", "Technology", "Telecommunications", ["Bryanston (HQ)", "Cape Town"], website="https://www.rain.co.za/",
            src=["https://www.zoominfo.com/p/Nomthandazo-Biyela/5454638247"]),
    company("Capitec Bank", "Banking", "Retail bank", ["Stellenbosch (HQ)", "Cape Town"], website="https://www.capitecbank.co.za/",
            src=[CARD_PAGE_ELIZABETH]),
    company("Six33 Group", "Other", None, ["Cape Town"], src=[CARD_PAGE_MITHI]),
    company("The Red Carnation Hotel Collection", "Hospitality", "Luxury hotels", ["Cape Town"], aliases=["Red Carnation Hotels"],
            src=[CARD_PAGE_ELIZABETH]),
    company("Moore Belgium", "Accounting / Audit", None, [], src=[CARD_PAGE_MAX]),
]

# ---------------------------------------------------------------------------------------------
# Sources
# ---------------------------------------------------------------------------------------------
src_specs = [
    ("https://www.linkedin.com/in/tj-to%C3%BCa-a7569b125/", "LinkedIn", "TJ Toüa — Professional Accountant (SA); MD TnT Pro Services; SAIPA trainee SDK Chartered Accountants 2018–2020.", "STRONG"),
    ("https://www.linkedin.com/in/melissa-lee-williams-123663171/", "LinkedIn", "Melissa Lee Williams — 'qualified Professional Accountant (SA) currently working at Galbraith Rushby'; Go Tourism header.", "STRONG"),
    ("https://www.linkedin.com/in/vohanjamneck/", "LinkedIn", "Vohan Jamneck — Licences: Professional Accountant (S.A) SAIPA; Professional Tax Practitioner (S.A); 3 years of articles.", "STRONG"),
    ("https://www.linkedin.com/in/johan-van-schalkwyk-acma-cgma-19068110b/", "LinkedIn", "Johan van Schalkwyk ACMA, CGMA — Licences ACMA, CGMA (CIMA) + Professional Accountant (SA) (SAIPA); Green Create; Cape Town.", "STRONG"),
    ("https://www.linkedin.com/in/lorraine-sarah-hand-acma-cgma/", "LinkedIn", "Lorraine Sarah Hand, ACMA CGMA — admitted 2025, PER approved; Ozow; Cape Town.", "STRONG"),
    ("https://www.linkedin.com/in/richard-mcqueen-acma-cgma-7b3b7b2a/", "LinkedIn", "Richard McQueen ACMA, CGMA — qualified CIMA; Linkqage; Cape Town.", "STRONG"),
    ("https://www.linkedin.com/in/lukas-swart-acma-cgma-761180117/", "LinkedIn", "Lukas Swart ACMA, CGMA — CIMA May 2021; SAIPA Independent Reviewer 2018; Astral Foods; Western Cape.", "STRONG"),
    ("https://www.linkedin.com/in/rudi-van-zyl-7b5561143/", "LinkedIn", "Rudi van Zyl ACMA, CGMA — 'Qualified Professional Accountant (S.A.) 15+ years'; CGMA Aug 2025; Technical Systems; Cape Town.", "STRONG"),
    ("https://za.linkedin.com/in/irene-lovell-rupert", "LinkedIn", "Irene Rupert — CGMA (CIMA, Mar 2017) + Professional Accountant (SA); SAIPA articles Moore Stephens 2014–16; Co-Founder AgrigateOne; Stellenbosch.", "STRONG"),
    ("https://www.linkedin.com/in/lize-vorster-0627ba9b/", "LinkedIn", "Lize Vorster — 'ACMA, CGMA Professional Accountant (SA) Senior Manager at Moore Management Services'; Somerset West.", "STRONG"),
    ("https://www.linkedin.com/in/matthew-kiln-a19746253/", "LinkedIn", "Matthew Kiln — 'qualified Chartered Management Accountant (ACMA, CGMA)'; Tripco; Stellenbosch.", "STRONG"),
    ("https://www.linkedin.com/in/andrew-miles-595690249/", "LinkedIn", "Andrew Miles — 'qualified Associate General Accountant (AGA SA)'; Pnp Franchise Rondebosch & Observatory; Cape Town.", "STRONG"),
    ("https://www.linkedin.com/in/sifiso-fakude-66475a86/", "LinkedIn", "Sifiso Fakude — completed SAIPA articles (no designation); Senior Fund Accountant JTC Group; people-cards: Jama, Gaxela, Biyela (PA(SA), Cape Town).", "STRONG"),
    (CARD_PAGE_KGABISO, "LinkedIn", "People-card page: 'Wynand Nel Professional Accountant (SA) — Supervisor - JTC Group — City of Cape Town'.", "MODERATE"),
    (CARD_PAGE_NONKOSI, "LinkedIn", "People-card page: 'Bongiwe Mayekiso Financial Accountant PA (SA) — Cape Town'.", "MODERATE"),
    (CARD_PAGE_CHRISTA, "LinkedIn", "People-card page: 'Timothy Stegen Professional Accountant (SA) — City of Cape Town'.", "MODERATE"),
    (CARD_PAGE_NASTASSJA, "LinkedIn", "People-card page: 'Ryan Warren AGA (SA) — Cape Town'.", "MODERATE"),
    (CARD_PAGE_ELIZABETH, "LinkedIn", "People-card page: 'Nicol Smit ACMA, CGMA — Capitec Bank — City of Cape Town'; 'Melanie Dennis-Jacobs AGA(SA) — Red Carnation Hotel Collection — City of Cape Town'.", "MODERATE"),
    (CARD_PAGE_MITHI, "LinkedIn", "People-card page: 'Louwtjie Venter ACMA CGMA — Six33 Group — City of Cape Town'.", "MODERATE"),
    (CARD_PAGE_ARISHKA, "LinkedIn", "People-card page: 'Tanya Swart - AGA (SA) — Stellenbosch'.", "MODERATE"),
    (CARD_PAGE_MAX, "LinkedIn", "People-card page: 'Nora van Rensburg (ACMA, CGMA) — Moore Belgium — City of Cape Town'.", "MODERATE"),
    ("https://www.zoominfo.com/p/Nomthandazo-Biyela/5454638247", "Directory", "ZoomInfo: Nomthandazo Biyela — Senior Financial Accountant, Rain (2023–); ex Mazars; LinkedIn sameAs URL.", "MODERATE"),
    ("https://www.moore-southafrica.com/locations/stellenbosch/", "Employer Website", "Moore Stellenbosch — ~100 staff; Moore Stellenbosch Inc (SAICA) + Moore Management Services (CIMA trainee contracts); Techno Park.", "STRONG"),
]
sid = db_lib.next_id(db_lib.SOURCES_PATH, "src")
for url, typ, summ, rel in src_specs:
    SOURCES.append(dict(id="src-%04d" % sid, url=url, source_type=typ, person_id=None, company_id=None,
                        evidence_type="GENERAL", evidence_summary=summ,
                        qualification_supported=True, skill_supported=None, system_supported=None,
                        employment_supported=True, accessed_date=TODAY, reliability=rel, status="USED"))
    sid += 1

if __name__ == "__main__":
    db_lib.append_batch(PEOPLE, company_specs=COMPANIES, source_specs=SOURCES,
                        label="Batch 13 (WC core non-CA — LinkedIn evidenced)")
