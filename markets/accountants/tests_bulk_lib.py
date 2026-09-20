#!/usr/bin/env python3
"""Regression tests for the accountants bulk-add helpers.

Run: python3 tests_bulk_lib.py
"""
import os
import sys

BASE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE)
from bulk_lib import split_name  # noqa: E402

# (full_name, expected first, expected surname)
CASES = [
    # particle surnames
    ("Tian van der Merwe", "Tian", "van der Merwe"),
    ("Peet van der Merwe", "Peet", "van der Merwe"),
    ("Justus van Wyk", "Justus", "van Wyk"),
    ("Lian du Plessis", "Lian", "du Plessis"),
    ("Louis de Wet", "Louis", "de Wet"),
    ("Thinus Le Roux", "Thinus", "Le Roux"),
    ("Pieter de Wit", "Pieter", "de Wit"),
    ("Adriaan de Lange", "Adriaan", "de Lange"),
    ("Nadia Van Der Westhuizen", "Nadia", "Van Der Westhuizen"),
    ("Sandi De Souza", "Sandi", "De Souza"),
    # plain two-token names
    ("Annebelle Malan", "Annebelle", "Malan"),
    ("Kobus Boshoff", "Kobus", "Boshoff"),
    ("Andisa Zinja", "Andisa", "Zinja"),
    # accented names
    ("André Conradie", "André", "Conradie"),
    ("Abré van Wyk", "Abré", "van Wyk"),
    # single token
    ("Madonna", "Madonna", ""),
]

# Compound surnames the store splits at the first token. These are handled by
# resolve_name() via the store lookup, NOT by split_name() — documented here so
# nobody "fixes" split_name() to match them and breaks the particle cases above.
KNOWN_STORE_COMPOUNDS = [
    ("Roelof Jansen van Vuuren", "Roelof", "Jansen van Vuuren"),
    ("Lézanne Dirkse van Schalkwyk", "Lézanne", "Dirkse van Schalkwyk"),
]


def main():
    failures = []
    for full, first, surname in CASES:
        got = split_name(full)
        if got != (first, surname):
            failures.append((full, got, (first, surname)))

    print("split_name: %d cases, %d failures" % (len(CASES), len(failures)))
    for full, got, want in failures:
        print("  FAIL %-30s got=%s want=%s" % (full, got, want))

    # resolve_name must reproduce the store's split for the compound cases
    from bulk_lib import resolve_name
    for full, first, surname in KNOWN_STORE_COMPOUNDS:
        got = resolve_name(full)
        status = "ok" if got == (first, surname) else "FAIL"
        print("resolve_name %-30s -> %-28s %s" % (full, str(got), status))
        if got != (first, surname):
            failures.append((full, got, (first, surname)))

    if failures:
        print("\n%d FAILURE(S)" % len(failures))
        return 1
    print("\nALL PASS")
    return 0


if __name__ == "__main__":
    sys.exit(main())
