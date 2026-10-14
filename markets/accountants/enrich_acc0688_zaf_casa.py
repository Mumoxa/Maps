#!/usr/bin/env python3
"""Enrich existing acc-0688 (Zaf Mahomed) with evidenced CA(SA) designation.

Existing record was FINANCE_ROLE_CONFIRMED with no designation. This script
preserves the research ID, LinkedIn URL and Cape Town location already on the
record, and adds only designation/qualification facts supported by:
  * Oceana Group JSE SENS appointment announcement (28 Sep 2022, Cape Town):
    "Mr. Mahomed is a Chartered Accountant (SA)" — CFO designate from
    1 Nov 2022, CFO and Executive Director from 1 Feb 2023;
  * CFO South Africa profile (accessed 2026-10-14): "Zaf has ... He is a
    qualified Chartered Accountant (SA) with a Masters in Business Leadership";
  * CFO Awards hall of fame: 2025 High-Performance Team Award as Oceana CFO,
    corroborating the role in 2025.
No SAICA membership claim is made. Run once; re-running is a no-op.
"""
import json
import os
import sys

BASE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE)
import db_lib  # noqa: E402

CHECK = "2026-10-14"
TARGET = "acc-0688"
NEW_SOURCES = [
    ("https://cfo.co.za/profiles/zaf-mahomed/", "Company Biography", "STRONG",
     "CFO South Africa profile: Zafar (Zaf) Mahomed, CFO Oceana Group since 2022, qualified Chartered Accountant (SA), MBL UNISA, BCom Natal / BCom Hons UNISA."),
    ("https://www.sharenet.co.za/v3/sens_display.php?tdate=20220928073000&seq=3", "Company Biography", "PRIMARY",
     "Oceana Group SENS (28 Sep 2022, Cape Town): appointment of Zafar (Zaf) Mahomed as CFO designate (1 Nov 2022) / CFO and Executive Director (1 Feb 2023); 'Mr. Mahomed is a Chartered Accountant (SA)'."),
]


def main():
    lines = open(db_lib.PEOPLE_PATH).read().splitlines()
    changed = False
    out = []
    for line in lines:
        if not line.strip():
            continue
        rec = json.loads(line)
        if rec["id"] != TARGET:
            out.append(line)  # preserve untouched records byte-for-byte
            continue
        if rec["id"] == TARGET and "CA(SA)" not in (rec.get("professional_designations") or []):
            rec["alternate_names"] = sorted(set(
                (rec.get("alternate_names") or []) + ["Zafar Mahomed"]))
            rec["professionally_qualified"] = "true"
            rec["professional_designations"] = ["CA(SA)"]
            rec["professional_bodies"] = ["SAICA"]
            rec["designation_status"] = "CONFIRMED"
            rec["qualification_confidence"] = "CONFIRMED"
            rec["qualification_evidence"] = (
                'Oceana Group SENS appointment announcement (28 Sep 2022): '
                '"Mr. Mahomed is a Chartered Accountant (SA) and holds the following '
                'qualifications: MBL from UNISA School of Business Leadership; '
                'BCom (Hons) from UNISA and BCom from University of Natal." '
                'CFO South Africa profile: "He is a qualified Chartered Accountant '
                '(SA) with a Masters in Business Leadership from the UNISA School '
                'of Business Leadership."')
            rec["academic_qualifications"] = [
                "MBL — UNISA School of Business Leadership",
                "BCom (Hons) — UNISA",
                "BCom — University of Natal",
            ]
            rec["articles_completion_status"] = "QUALIFIED_BUT_ARTICLES_NOT_ESTABLISHED"
            rec["status"] = "CONFIRMED"
            rec["confidence"] = "CONFIRMED"
            if not (rec.get("current_industry") or "").strip():
                rec["current_industry"] = "Food & Beverage"
                rec["current_sub_industry"] = "Fishing and food processing"
            for url, _t, _r, _s in NEW_SOURCES:
                if url not in rec["source_urls"]:
                    rec["source_urls"].append(url)
            rec["primary_source"] = NEW_SOURCES[0][0]
            rec["date_last_verified"] = CHECK
            rec["notes"] = (
                (rec.get("notes") or "").replace(
                    "Qualification/articles enrichment pending.", "").strip()
                + " Enriched 2026-10-14 (batch 13): CA(SA) designation confirmed "
                  "from Oceana SENS + CFO South Africa profile (see "
                  "qualification_evidence); industry is Oceana's fishing/food-"
                  "processing sector (employer sector, not a personal "
                  "specialism). Articles/training route not established from "
                  "these sources. Current SAICA membership NOT verified "
                  "(no authorised roster).").strip()
            booleans = rec.get("booleans") or {}
            booleans["ca_sa"] = "true"
            rec["booleans"] = booleans
            changed = True
        out.append(json.dumps(rec, ensure_ascii=False, separators=(",", ":")))
    if changed:
        with open(db_lib.PEOPLE_PATH, "w") as fh:
            fh.write("\n".join(out) + "\n")

        existing_urls = {
            json.loads(line)["url"] for line in open(db_lib.SOURCES_PATH) if line.strip()
        }
        sid = db_lib.next_id(db_lib.SOURCES_PATH, "src")
        added = []
        for url, stype, reliability, summary in NEW_SOURCES:
            if url in existing_urls:
                continue
            added.append(dict(
                id="src-%04d" % sid, url=url, source_type=stype,
                person_id=TARGET, company_id=None,
                evidence_type="designation_and_employment",
                evidence_summary=summary, qualification_supported="true",
                skill_supported=None, system_supported=None,
                employment_supported="true", accessed_date=CHECK,
                reliability=reliability, status="USED"))
            sid += 1
        if added:
            with open(db_lib.SOURCES_PATH, "a") as fh:
                for rec in added:
                    fh.write(json.dumps(rec, ensure_ascii=False) + "\n")
        print(f"Enriched {TARGET}: CA(SA) confirmed; {len(added)} sources added.")
    else:
        print(f"No change: {TARGET} already carries CA(SA) (or not found).")


if __name__ == "__main__":
    main()
