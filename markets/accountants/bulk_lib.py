#!/usr/bin/env python3
"""Compact bulk-add helper for the accountants research DB.

`db_lib.build()` needs a verbose dict per person. When mining a firm team page or a
professional-body index, dozens of people share the same employer, source and evidence
pattern, so this module expands a tuple row into a full spec.

A tuple row is:

    (full_name, designations, title, {optional overrides})

The optional dict may override ANY db_lib spec key (province, city, academic,
articles_status, linkedin, ...). Nothing is invented: fields not supplied by the
source stay empty, and `location_confidence` defaults to UNCONFIRMED so a firm's
address is never written onto a person as their residence.
"""
import os
import sys

BASE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE)
import db_lib  # noqa: E402


def split_name(full_name):
    """'Tian van der Merwe' -> ('Tian', 'van der Merwe').

    Matches the convention already in the store: 'Roelof Jansen van Vuuren' ->
    ('Roelof', 'Jansen van Vuuren'), 'Peet van der Merwe' -> ('Peet', 'van der Merwe'),
    'Lézanne Dirkse van Schalkwyk' -> ('Lézanne', 'Dirkse van Schalkwyk').

    Rule: the surname begins at the first surname particle, if there is one and it is not
    the first token; otherwise the surname is the final token.
    """
    parts = full_name.split()
    if len(parts) == 1:
        return parts[0], ""
    particles = {"van", "von", "der", "den", "de", "du", "le", "la", "del", "da", "dos", "di"}
    cut = len(parts) - 1
    for i in range(1, len(parts)):
        if parts[i].lower() in particles:
            cut = i
            break
    return " ".join(parts[:cut]), " ".join(parts[cut:])


_KNOWN_SPLITS = None


def known_splits():
    """full_name -> (first, surname) for everyone already in the store.

    The store contains compound surnames that the particle rule cannot recover
    ('Roelof Jansen van Vuuren', 'Lézanne Dirkse van Schalkwyk'), so an existing
    record's split always wins over inference.
    """
    global _KNOWN_SPLITS
    if _KNOWN_SPLITS is None:
        _KNOWN_SPLITS = {}
        path = os.path.join(BASE, "people.jsonl")
        if os.path.exists(path):
            import json
            for line in open(path, encoding="utf-8"):
                if line.strip():
                    rec = json.loads(line)
                    _KNOWN_SPLITS[rec.get("full_name", "").lower()] = (
                        rec.get("first_name"), rec.get("surname"))
    return _KNOWN_SPLITS


def resolve_name(full_name):
    """(first, surname) using the store's split when the person is already known."""
    hit = known_splits().get(full_name.lower())
    if hit and all(hit):
        return hit
    return split_name(full_name)


def make_specs(rows, employer, industry, evidence, source_urls, primary_source=None,
               sub_industry=None, role_family="Accounting practice",
               articles_status="QUALIFIED_BUT_ARTICLES_NOT_ESTABLISHED",
               date="2026-09-19"):
    """Expand tuple rows into db_lib specs sharing one employer/source pattern."""
    specs = []
    for row in rows:
        name, des, title = row[0], row[1], row[2]
        over = row[3] if len(row) > 3 else {}
        first, surname = resolve_name(name)
        spec = dict(
            date=date, verified=date,
            name=name, first=first, surname=surname,
            des=list(des), title=title, employer=employer,
            industry=industry, sub_industry=sub_industry,
            role_family=role_family,
            evidence=evidence, source_urls=list(source_urls),
            primary_source=primary_source or source_urls[0],
            articles_status=articles_status,
            location_confidence="UNCONFIRMED",
        )
        spec.update(over)
        specs.append(spec)
    return specs
