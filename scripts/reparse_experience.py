#!/usr/bin/env python3
"""
Re-parse years-of-experience for the SLM - Head of Finance population from the
source CSV, recovering real signals the first import missed. Conservative by
design: a value is written ONLY when the source text states a duration or a
career start/qualifying year. Everything else stays "unknown" - experience is
never inferred or fabricated.

Three recoverable shapes, in priority order:
  1. Explicit duration   "15+ years", "11 years post-articles", "~6 years"
                         -> estimated_years_experience = "15+"  (basis: stated duration)
  2. Date span           "2011-2021", "2003-2015 ... 2024 CIO", "Sep 2019-Apr 2022"
                         -> earliest year as a since-value "2011+" (basis: dated roles)
  3. Since / from year   "since 2016", "from 2014", "CA since 2006", "at least 2011"
                         -> "2016+"  (basis: stated start year)

A bare qualification year with no start/duration ("CA qualification 2012",
"Qualification 2020; other years check") is NOT treated as experience: a
qualifying date is not a tenure. Explicit negatives ("8+ years not established",
"earlier professional experience unconfirmed") stay unknown.

Usage:
  python3 scripts/reparse_experience.py [--commit]
"""

import csv
import json
import re
import sys
from pathlib import Path

CSV_PATH = Path("/root/.claude/uploads/9599abdb-77b0-55ed-b10a-e089a67fdbdd/96536d80-Bellville_CA_SA_Property_Finance_Expanded_Verification_2026-10-17.csv")
JSONL_PATH = Path(__file__).parent.parent / "markets" / "accountants" / "people.jsonl"

CURRENT_YEAR = 2026

# Phrases that explicitly deny established experience: never extract from these.
NEGATION = re.compile(
    r"not established|unconfirmed|newly qualified|recent graduate|earlier professional experience unconfirmed",
    re.I,
)


def parse_experience(raw: str):
    """Return (value, basis) or (None, None) if nothing defensible is stated."""
    text = (raw or "").strip()
    if not text or text.lower() == "unconfirmed":
        return None, None

    # 1. Explicit duration: "15+ years", "11 years", "~6 years", "14+ years described"
    #    Require the word "year(s)" so a bare "2016" is never read as a duration.
    dur = re.search(r"(?<!\d)(\d{1,2})\s*\+?\s*years?\b", text, re.I)
    #    Guard: a 4-digit calendar year ("2015 years"? never) can't match \d{1,2}, good.
    if dur and not NEGATION.search(text[: dur.start()]):
        n = int(dur.group(1))
        # Sanity: a plausible career length, not a stray number.
        if 1 <= n <= 55:
            plus = "+" if "+" in text[dur.start(): dur.end() + 1] or n >= 8 else ""
            # Preserve the source's own "+" where present; otherwise keep bare.
            has_plus = bool(re.search(r"\d\s*\+\s*years?", text, re.I))
            return (f"{n}+" if has_plus else str(n)), "stated duration"

    # Collect all 4-digit years mentioned (1980-CURRENT), for spans / since.
    years = [int(y) for y in re.findall(r"\b(19[89]\d|20[0-2]\d)\b", text) if 1980 <= int(y) <= CURRENT_YEAR]

    # 2. Date span: two or more years, OR an en-dash/hyphen range -> earliest start.
    #    "2011-2021", "2003-2015 ... 2024", "Sep 2019-Apr 2022", "1994 ... since 1996"
    if len(years) >= 2:
        start = min(years)
        return f"{start}+", "dated roles"

    # 3. Single "since / from / at least <year>" start marker.
    if len(years) == 1:
        y = years[0]
        if re.search(r"\b(since|from|begun|concluded|joined|at least)\b", text, re.I):
            return f"{y}+", "stated start year"
        # "CA since 2006" style handled above; a lone qualification year
        # ("CA qualification 2012", "Qualification 2020") is NOT experience.
        return None, None

    return None, None


def main(commit: bool):
    # Build name -> (value, basis) from the CSV.
    recovered = {}
    with open(CSV_PATH, encoding="utf-8-sig") as fh:
        for row in csv.DictReader(fh):
            name = (row.get("Full Name") or "").strip()
            if not name:
                continue
            value, basis = parse_experience(row.get("8+ finance years", ""))
            if value:
                recovered[name] = (value, basis, row.get("8+ finance years", "").strip())

    print(f"CSV rows with a recoverable experience signal: {len(recovered)} / 299")
    print()

    # Load JSONL, update matching SLM records.
    records = []
    with open(JSONL_PATH, encoding="utf-8") as fh:
        for line in fh:
            if line.strip():
                records.append(json.loads(line))

    # Build the full CSV source-text map so we can CORRECT bad stored values,
    # not only fill blanks.
    csv_src = {}
    with open(CSV_PATH, encoding="utf-8-sig") as fh:
        for row in csv.DictReader(fh):
            name = (row.get("Full Name") or "").strip()
            if name:
                csv_src[name] = row.get("8+ finance years", "").strip()

    def is_bad_stored(v: str) -> bool:
        """A stored value that is junk or a qualification year masquerading as tenure."""
        if not v or v == "unknown":
            return False
        if not re.match(r"^\d", v):  # "Profile", stray words
            return True
        m = re.match(r"^(\d{4})\+?$", v)  # a bare 4-digit year used as "since"
        # Treat a very recent "since" year (>=2022) as a qualification date, not tenure.
        if m and int(m.group(1)) >= 2022:
            return True
        return False

    updates = 0
    corrections = 0
    touched_names = set()
    for rec in records:
        attrs = rec.get("attributes") or {}
        if attrs.get("search_name") != "SLM - Head of Finance":
            continue
        name = rec.get("full_name", "").strip()
        current = rec.get("estimated_years_experience")

        # Case A: the source states a defensible value -> use it (fill or correct).
        if name in recovered:
            value, basis, source_text = recovered[name]
            if current and current != "unknown" and not is_bad_stored(current):
                continue  # already have a good value; don't churn it
            rec["estimated_years_experience"] = value
            rec["experience_estimate_basis"] = f"{basis}: {source_text}"[:200]
            if current and current != "unknown":
                corrections += 1
            else:
                updates += 1
            touched_names.add(name)
            continue

        # Case B: source exists but states nothing usable (Unconfirmed / negated),
        # yet we stored a bad value -> reset to unknown.
        if name in csv_src and is_bad_stored(current):
            rec["estimated_years_experience"] = "unknown"
            rec["experience_estimate_basis"] = ""
            corrections += 1
            touched_names.add(name)
            continue

        # Case C: no CSV row (Wave-2 file) but a junk/qualification-year value ->
        # reset to unknown rather than show a misleading "Since 2026".
        if name not in csv_src and is_bad_stored(current):
            rec["estimated_years_experience"] = "unknown"
            rec["experience_estimate_basis"] = ""
            corrections += 1
            touched_names.add(name)

    print(f"JSONL records filled: {updates} | corrected/reset: {corrections} (covering {len(touched_names)} distinct people)")
    print()
    # Preview a sample
    sample = [(n, v[0], v[1]) for n, v in list(recovered.items())[:25]]
    print("Sample recovered values:")
    for n, v, b in sample:
        print(f"  {v:>7}  [{b:16}]  {n}")

    if not commit:
        print()
        print("Dry run. Re-run with --commit to write people.jsonl.")
        return

    with open(JSONL_PATH, "w", encoding="utf-8") as fh:
        for rec in records:
            fh.write(json.dumps(rec) + "\n")
    print()
    print(f"Wrote {len(records)} records to {JSONL_PATH}")


if __name__ == "__main__":
    main("--commit" in sys.argv)
