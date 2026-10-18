#!/usr/bin/env python3
"""Generate the public research export from source JSONL."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "people.jsonl"
OUTPUT = ROOT / "people.json"
REQUIRED = ("id", "fullName", "title", "employer", "locationLabel", "talentPool",
            "profileUrl", "sourceDescription", "sourceCompiledOn", "evidenceStatus")

def main():
    people, ids, urls = [], set(), set()
    for line_no, raw in enumerate(SOURCE.read_text(encoding="utf-8").splitlines(), 1):
        if not raw.strip():
            continue
        item = json.loads(raw)
        for field in REQUIRED:
            if not isinstance(item.get(field), str) or not item[field].strip():
                raise ValueError(f"line {line_no}: missing {field}")
        if item["id"] in ids or item["profileUrl"].lower().rstrip("/") in urls:
            raise ValueError(f"line {line_no}: duplicate identity")
        ids.add(item["id"])
        urls.add(item["profileUrl"].lower().rstrip("/"))
        people.append(item)
    OUTPUT.write_text(json.dumps(people, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Generated {len(people)} Data Science & ML profiles")

if __name__ == "__main__":
    main()
