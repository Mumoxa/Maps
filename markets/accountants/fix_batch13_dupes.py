#!/usr/bin/env python3
"""QC fix for batch 13: the loader was executed twice before the company-id bug was
fixed, writing every new person twice (acc-1002..acc-1030 and the duplicate block
acc-1031..acc-1059). Keep the first (lower-id) copy of each identity, drop the
duplicate block, and report the result. Reruns are idempotent.
"""
import json
import os

BASE = os.path.dirname(os.path.abspath(__file__))
PEOPLE = os.path.join(BASE, "people.jsonl")


def load(path):
    return [json.loads(line) for line in open(path, encoding="utf-8") if line.strip()]


def main():
    rows = load(PEOPLE)
    new = [row for row in rows if int(row["id"].split("-")[1]) > 1001]
    seen = {}
    keep, drop = [], []
    for row in new:
        key = row["full_name"].strip().lower()
        if key in seen:
            drop.append(row["id"])
            continue
        seen[key] = row["id"]
        keep.append(row)

    if not drop:
        print("no duplicate batch-13 rows found; nothing to do")
        return

    dropped = set(drop)
    retained = [row for row in rows if row["id"] not in dropped]
    with open(PEOPLE, "w", encoding="utf-8") as handle:
        for row in retained:
            handle.write(json.dumps(row, ensure_ascii=False) + "\n")

    print(f"batch-13 rows: {len(new)} kept: {len(keep)} dropped: {len(drop)}")
    print("dropped ids:", ", ".join(drop))
    print(f"people.jsonl now holds {len(retained)} records")


if __name__ == "__main__":
    main()
