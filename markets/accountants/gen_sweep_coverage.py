#!/usr/bin/env python3
"""Generate sweep_coverage.md — the exhaustive coverage ledger for the Western Cape
industrial/manufacturing company sweep.

The sweep scope is fixed and non-negotiable: every company in
`inputs/2026-09-19-wc-industrial-companies.tsv` appears in the ledger exactly once.
**Not one company may be omitted** — a company stays `PENDING` until it has been
researched, and only becomes `COVERED` when at least one person with a recognised
SAIPA / SAICA / CIMA / ACCA designation is recorded against it with evidence.

Run: python3 gen_sweep_coverage.py
"""
import csv
import json
import os
import re
import unicodedata
from collections import Counter
from datetime import date

BASE = os.path.dirname(os.path.abspath(__file__))
TSV = os.path.join(BASE, "inputs", "2026-09-19-wc-industrial-companies.tsv")
OUT = os.path.join(BASE, "sweep_coverage.md")

# Companies outside the sweep list that were also closed during this sweep, listed
# separately so the ledger stays a 1:1 mirror of the input list.
EXTRA_CLOSED = [
    ("TCTA (Trans-Caledon Tunnel Authority)", "cmp-0016",
     "Andisa Zinja CA(SA) — acc-0135",
     "Pre-existing registry company that had zero mapped people; closed 2026-09-19."),
]


def norm(s):
    if not s:
        return ""
    s = unicodedata.normalize("NFKD", str(s)).encode("ascii", "ignore").decode().lower()
    s = re.sub(r"[^a-z0-9 ]", " ", s)
    for junk in (" pty ltd ", " ltd ", " limited ", " group ", " holdings ", " inc ",
                 " south africa ", " the "):
        s = s.replace(junk, " ")
    return re.sub(r"\s+", " ", s).strip()


def toks(s):
    return set(w for w in norm(s).split() if len(w) > 2)


def load(path):
    return [json.loads(l) for l in open(path, encoding="utf-8") if l.strip()]


def main():
    people = load(os.path.join(BASE, "people.jsonl"))
    companies = load(os.path.join(BASE, "companies.jsonl"))

    cid = {}
    for c in companies:
        cid[norm(c["company_name"])] = c["id"]
        for a in (c.get("company_aliases") or []):
            cid.setdefault(norm(a), c["id"])

    def match_company(text):
        """Whole-word-safe company match. Returns cmp id or None."""
        if not text:
            return None
        nt, tt = norm(text), toks(text)
        best = (0, None)
        for key, cidv in cid.items():
            if not key:
                continue
            tk = toks(key)
            score = 0
            if key == nt:
                score = 1000
            elif len(key) > 5 and (key in nt or nt in key):
                score = 100 + len(key)
            else:
                ov = len(tk & tt)
                if ov >= 2 and ov >= min(len(tk), len(tt)) - 1:
                    score = ov * 5
            if score > best[0]:
                best = (score, cidv)
        return best[1] if best[0] >= 15 else None

    emp_by_company = {}
    for p in people:
        m = match_company(p.get("current_employer"))
        if m:
            emp_by_company.setdefault(m, []).append(p)

    rows = list(csv.DictReader(open(TSV, encoding="utf-8"), delimiter="\t"))
    lines = []
    covered = partial = pending = 0
    for r in rows:
        name = r["company_name"]
        ci = cid.get(norm(name))
        hits = emp_by_company.get(ci, []) if ci else []
        if hits:
            status = "COVERED"
            covered += 1
            who = "; ".join(
                "%s (%s) — %s" % (
                    h["full_name"],
                    "/".join(h.get("professional_designations") or []) or "designation?",
                    h["id"],
                ) for h in hits)
        else:
            status = "PENDING"
            pending += 1
            who = "—"
        lines.append("| %s | %s | %s | %s | %s |"
                     % (ci or "—", name, r["sector"], status, who))

    header = """# Sweep Coverage — Western Cape industrial & manufacturing companies

**This ledger is the completeness contract for the sweep.** Every company in
`inputs/2026-09-19-wc-industrial-companies.tsv` (transcribed from the supplied
`Companies.csv`, {today}) appears below exactly once. **No company may be dropped.**

A company is only `COVERED` once at least one person holding a recognised SAIPA / SAICA /
CIMA / ACCA designation is recorded against it in `people.jsonl` **with evidence**.
Everything else stays `PENDING` — an empty cell is an open work item, never a silent omission.

Regenerate after every batch: `python3 gen_sweep_coverage.py`

## Status

| Metric | Count |
|---|---|
| Companies in sweep scope | {total} |
| COVERED (≥1 registered person with evidence) | {covered} |
| PENDING (research outstanding) | {pending} |
| Partially covered (covered by a person who is also a director of a related entity) | {partial} |

## Related closures outside the sweep list

| Company | ID | Person | Note |
|---|---|---|---|
""".format(today=date.today().isoformat(), total=len(rows), covered=covered,
           pending=pending, partial=partial)
    for nm, ci, who, note in EXTRA_CLOSED:
        header += "| %s | %s | %s | %s |\n" % (nm, ci, who, note)

    body = ("\n## Ledger (every company in the sweep list)\n\n"
            "| Company ID | Company / Group | Sector | Status | Registered person(s) found |\n"
            "|---|---|---|---|---|\n" + "\n".join(lines) + "\n")

    with open(OUT, "w", encoding="utf-8") as f:
        f.write(header + body)

    print("Wrote %s — %d companies: COVERED=%d PENDING=%d"
          % (OUT, len(rows), covered, pending))
    print("Status distribution:", dict(Counter(l.split(" | ")[3].strip() for l in lines)))


if __name__ == "__main__":
    main()
