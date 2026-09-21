#!/usr/bin/env python3
"""Generate people_index.md — the master name registry every batch must consult FIRST.

Regenerates the index from people.jsonl / companies.jsonl so it always mirrors the DB.
Run: python3 gen_people_index.py
"""
import json
import os

BASE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(BASE, "people_index.md")


def load(path):
    if not os.path.exists(path):
        return []
    return [json.loads(l) for l in open(path) if l.strip()]


def build():
    people = load(os.path.join(BASE, "people.jsonl"))
    companies = load(os.path.join(BASE, "companies.jsonl"))
    sources = load(os.path.join(BASE, "sources.jsonl"))

    # ---- stats ----
    n_conf = sum(1 for p in people if p["status"] == "CONFIRMED")
    n_high = sum(1 for p in people if p["status"] == "HIGH_CONFIDENCE")
    from collections import Counter
    st = Counter(p["status"] for p in people)

    # ---- sort alphabetically (surname, then given) ----
    people_sorted = sorted(
        people,
        key=lambda p: (p["surname"].lower().replace("du plessis", "duplessis")
                       .replace("van ", "van").replace("le roux", "leroux"),
                       p["first_name"].lower()),
    )

    L = []
    L.append("# People Index — Master Name Registry (dedup source of truth)\n")
    L.append("> **CHECK THIS FILE FIRST** before adding any person, company or source.\n")
    L.append("This is the authoritative list of every name already captured in the")
    L.append("SA Qualified Accountant & Finance Skills database. Future batches must")
    L.append("consult it **before** writing records so nothing is duplicated — a new")
    L.append("source for an existing person only *enriches* that record; it never adds a second one.\n")
    L.append("**Regenerate after every batch:** `python3 gen_people_index.py`\n")

    L.append("")
    L.append("## 1. Totals (auto-computed)\n")
    L.append("| Metric | Count |")
    L.append("|---|---|")
    L.append(f"| People (total records) | {len(people)} |")
    L.append(f"| CONFIRMED qualified | {n_conf} |")
    L.append(f"| HIGH_CONFIDENCE | {n_high} |")
    for k, v in sorted(st.items()):
        if k not in ("CONFIRMED", "HIGH_CONFIDENCE"):
            L.append(f"| {k} | {v} |")
    L.append(f"| Companies | {len(companies)} |")
    L.append(f"| Sources | {len(sources)} |")
    L.append("")

    L.append("## 2. How to use this index (dedup workflow)\n")
    L.append("1. Normalise the candidate name (lowercase; strip titles, accents, initials —")
    L.append("   compare surname + given name).")
    L.append("2. Search the **People** table below (sorted by surname). Also try name variants")
    L.append("   (`du Plessis`/`Du Plessis`, `van der Merwe`/`van der Merwe`, accented é→e).")
    L.append("3. If the person is already listed → **do not add**. Enrich the existing record")
    L.append("   (new designation evidence, articles, employer, system, or source URL) instead.")
    L.append("4. If the person appears under **3c. Investigated but excluded** → do not re-capture")
    L.append("   unless new evidence contradicts the exclusion reason.")
    L.append("5. Check the **Companies** table before adding an employer record; extend existing")
    L.append("   `company_aliases` rather than duplicating a firm.")
    L.append("")
    L.append("> IDs are renumbered after merges — **dedup by name/LinkedIn, never by id alone.**\n")

    L.append("## 3a. All people (sorted by surname)\n")
    L.append("| # | Full name | Surname / Given | Status | Designation(s) | Body | Employer | Province / City | LinkedIn |")
    L.append("|---|---|---|---|---|---|---|---|---|")
    for i, p in enumerate(people_sorted, 1):
        des = ", ".join(p.get("professional_designations") or ["—"])
        body = ", ".join(p.get("professional_bodies") or ["—"])
        emp = p.get("current_employer") or "—"
        loc = "/".join(x for x in [p.get("province"), p.get("city")] if x) or "—"
        li = p.get("linkedin_url") or "—"
        full = p.get("full_name") or f"{p['first_name']} {p['surname']}"
        L.append(f"| {i} | **{full}** | {p['surname']} / {p['first_name']} | {p['status']} | {des} | {body} | {emp} | {loc} | {li} |")
    L.append("")

    L.append("## 3b. Secondary-population notes (do not re-add)\n")
    L.append("- `ARTICLES_CONFIRMED_DESIGNATION_UNVERIFIED`: captured; excluded from the main qualified count.")
    L.append("- `CONFLICTING`: captured; designation wording conflicts within the source — verify, don't re-add.")
    L.append("")

    L.append("## 3c. Investigated but EXCLUDED (do not capture unless evidence changes)\n")
    excluded = [
        ("Brandon Christie CA(SA)", "Deloitte — Amsterdam, Netherlands. Out of SA scope."),
        ("Lungelwa Ndlebe CPA, CA(SA)", "Deloitte — New York area, USA. Out of SA scope."),
        ("Makhotso Moope CA(SA)", "PwC UK — United Kingdom. Out of SA scope."),
        ("Siliziwe Tukani CA(SA), CPA", "Deloitte — Hamilton (offshore). Out of SA scope."),
        ("Lyle Weber CA(SA), MCom", "FXF — Greater Monroe / Texas, USA. Out of SA scope."),
        ("Nguquko Nyathi FCCA, ACMA, CGMA, MBA", "Skipton International — Guernsey. Out of SA scope."),
        ("Kimberly Mitton", "Atlantic Accounting (Table View) — ACCA 'in progress' (not a member). Not qualified yet."),
        ("Marco Barbera", "emagine (Denmark) — surfaced via similar-profiles; not an SA CA(SA)."),
        ("Juanita Roman", "Streets Cape Town director — 'PG DIP (Tax)' only; NO designation on page → correctly NOT captured."),
        ("Reeza Isaacs", "Woolworths ex-FD (resigned 2023) — lead only; no designation wording captured."),
        ("Francois Gouws / Mike Smith", "PSG Konsult CEO/CFO — surfaced in annual report; no designation wording captured."),
        ("PKF WC partner/director names", "Bellville/Stellenbosch (~13), Constantia Valley (~5), George (5) — names in snippets only, designations unverified; verify per person before capture."),
        ("Crowe CT/Winelands team", "Gorgulho, Karro, Jonkers, Hamman, Bestbier, Marais et al — roster names without per-person designation wording; verify before capture."),
        ("Fenns Mossel Bay team", "Jaco Vollgraaff pictured; Greg/San-Marie/Wilma/Jenna/Rochelle/Zinzan named in reviews without designations — verify before capture."),
        # --- session 3 (2026-09-21), Western Cape non-CA sweep ---
        ("Candice Galant", "Cape Town — LinkedIn card 'Senior Financial Accountant / Eligible to register as AGA(SA)' — PIPELINE (eligible, not registered). Re-check for AGA(SA) registration."),
        ("Anelisiwe Mdoyi", "Cape Town — LinkedIn card 'Eligible to register as a AGA(SA) — Senior Auditor' — PIPELINE (eligible, not registered)."),
        ("Chamu Makaranga", "Maersk, Cape Town — CIMA appears only under Education; no ACMA/CGMA wording → RESEARCH_HOLD."),
        ("Deon Poolman", "Deon Poolman Professional Accountants (Durbanville) — bio lists degrees only, no SAIPA designation wording → RESEARCH_HOLD (verify SAIPA membership)."),
        ("Wynand Le Roux", "findanaccountant.co.za listing (Durbanville) — 'SAIPA' only, no personal designation wording → RESEARCH_HOLD."),
        ("Kobus Muller", "Somerset West — LinkedIn card 'Tax specialist and accountant' — no designation wording."),
        ("Maike Reiner ACMA, CGMA / Rachel Cowan FCCA", "Tagged/author in Ozow LinkedIn posts — designation in name field but LOCATION and profile URL unverified → watchlist (likely Ozow Cape Town team)."),
        ("Mohamed Banderker / Enid Strydom", "SAIPA 'Professional Accountant' magazine (Dec 2019) lists both under 'Western Cape' — context (award/new member) unverified → watchlist."),
        ("Travis Wessels ACMA, CGMA", "PepsiCo — Zaventem, Belgium (career history Tygervalley/Paarl; announced CFO Southern Africa role) — out of SA location today; inbound watchlist."),
        ("Kelsey Good AGA(SA)", "Corbion — Gorinchem, Netherlands (ex East London). Out of SA scope."),
        ("Nkateko Maloox AGA(SA)", "Sci-Bono Discovery Centre — Gauteng. Outside this session's Western Cape scope; candidate for Gauteng expansion."),
        ("Derick Wesson CA(SA), RA (PKF CT); Johan Loubser & Selna de Jongh (APBCO Paarl, CA + RA)", "CA(SA)/RA — outside the non-CA designation scope of the WC sweep; not captured (CA-track candidates)."),
        ("Moore South Africa partner directory (people pages 1–4)", "Names/titles/locations only — no designation wording on the directory; verify per person on bio pages before capture."),
    ]
    L.append("| Name(s) | Reason excluded |")
    L.append("|---|---|")
    for name, reason in excluded:
        L.append(f"| {name} | {reason} |")
    L.append("")

    L.append("## 4. Disambiguation watchlist (near-duplicate risk)\n")
    L.append("| Names | Status |")
    L.append("|---|---|")
    L.append("| **André Huysamer AGA(SA)** (Kula, Worcester) vs **Andre Huysamer** (Principal Accountant, City of Cape Town) | Possibly distinct individuals — NOT merged; verify employer before treating as one person. |")
    L.append("| **Ashley Du Plessis AGA(SA)** (Paarl) vs **Lian du Plessis AGA(SA)** (Cape Chamber) vs **Lézanne Dirkse van Schalkwyk AGA(SA)** (McA) | Three distinct people — do not conflate by surname 'du Plessis'. |")
    L.append("| **Bonga Mokoena** | Duplicate `acc-0126` merged into `acc-0051` (single record since session 2). |")
    L.append("| **BDO South Africa** | Duplicate `cmp-0031` merged into `cmp-0071` (single record). |")
    L.append("| **Streets Chartered Accountants** vs **Streets (UK)** | One MD Streets Cape Town record (`cmp-0040`); UK parent not a separate SA employer. |")
    L.append("| **Louwtjie van Zyl PA(SA)** (APBCO Somerset West) vs **Louwtjie Venter ACMA CGMA** (Six33 Group, CT) vs **Rudi van Zyl** (Technical Systems) vs **Jana van Zyl CA(SA)** (LDP) | Four distinct people — do not merge on first name or surname. |")
    L.append("| **Nicol Smit ACMA, CGMA** (Capitec) vs **Magdalena Smit PA(SA)** (SAIPA board 2019) | Distinct people. |")
    L.append("| **Lukas Swart ACMA, CGMA** (Astral Foods) vs **Tanya Swart AGA(SA)** (Stellenbosch) | Distinct people. |")
    L.append("| **Fatima Bapukee** | Single record `acc-0075` now carries BOTH PA(SA) (2012) and CA(SA) (2024) per MD Streets Honour's Roll — do not create a second record. |")
    L.append("| **MD Streets Honour's Roll PA(SA)s** (Lotters, Musindo, Saunders, Adams, Jacobs, Daniels, Haumann, Nyamutumbu, van Reenen, Harris, Petersen, Abrahamse) | Designation + year verified; CURRENT employer NOT verified — enrich these records rather than re-adding when a LinkedIn profile is found. |")
    L.append("")

    L.append("## 5. Companies already mapped (do not duplicate)\n")
    L.append("| ID | Company | Industry | SA locations |")
    L.append("|---|---|---|---|")
    for c in sorted(companies, key=lambda c: c["company_name"].lower()):
        locs = ", ".join(c.get("south_africa_locations") or [])
        if not locs:
            locs = "—"
        L.append(f"| {c['id']} | {c['company_name']} | {c.get('industry') or '—'} | {locs} |")
    L.append("")

    L.append("## 6. Sources (dedup by URL)\n")
    L.append(f"{len(sources)} unique source records in `sources.jsonl`. Before adding a source,")
    L.append("check the URL is absent from that file; reuse an existing `src-####` record instead of")
    L.append("duplicating the URL.\n")

    with open(OUT, "w") as f:
        f.write("\n".join(L))
    print(f"Wrote {OUT} — {len(people)} people, {len(companies)} companies, {len(sources)} sources.")
    print(f"CONFIRMED={n_conf}, HIGH={n_high}, other={dict((k, v) for k, v in st.items() if k not in ('CONFIRMED','HIGH_CONFIDENCE'))}")


if __name__ == "__main__":
    build()
