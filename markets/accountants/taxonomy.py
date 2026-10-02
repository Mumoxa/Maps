#!/usr/bin/env python3
"""Taxonomy engine for the SA CA(SA) talent map.

Loads `industry_taxonomy.json` and turns raw research-DB records into the
normalised classification layer required by the CA(SA) master research
instruction: seniority band (S1-S8), normalised job title, grouped industry
(Section 16), associated industry groups (Section 17), employer normalisation
(Section 23) and employer scale/ownership where evidenced.

Rules honoured here:

* Classification only. Nothing in this module creates a fact about a person.
  A seniority band or grouped industry is a *derived label* on top of an
  evidenced title / employer.
* Business-model tags and finance-environment tags are never inferred from a
  job title or a company's sector. They are carried through only when a record
  already provides them (evidence-backed), plus factual employer attributes
  such as a JSE listing.
* Missing values stay `Unknown` (Section 30).
"""
import json
import os
import re

BASE = os.path.dirname(os.path.abspath(__file__))
TAXONOMY_PATH = os.path.join(BASE, "industry_taxonomy.json")

UNKNOWN = "Unknown"


def load_taxonomy():
    with open(TAXONOMY_PATH, encoding="utf-8") as handle:
        return json.load(handle)


TAXONOMY = load_taxonomy()
SENIORITY_BANDS = TAXONOMY["seniority_bands"]
SENIORITY_PRECEDENCE = TAXONOMY["seniority_precedence"]
GROUPED_INDUSTRIES = TAXONOMY["grouped_industries"]
ADJACENCY = TAXONOMY["industry_adjacency"]
EMPLOYER_NORMALIZATION = TAXONOMY["employer_normalization"]
METRO_MAP = TAXONOMY.get("metro_map", {})


def metro_region(city):
    """Metro / region label for an evidenced city; Unknown when not mapped."""
    key = clean(city).lower()
    if not key:
        return UNKNOWN
    return METRO_MAP.get(key, UNKNOWN)

# primary industry -> grouped industry (exact, case-insensitive)
PRIMARY_TO_GROUP = {}
for group, spec in GROUPED_INDUSTRIES.items():
    PRIMARY_TO_GROUP[group.lower()] = group
    for primary in spec["primary_industries"]:
        PRIMARY_TO_GROUP.setdefault(primary.lower(), group)

# Longest keyword first so "group financial manager" wins over "financial manager".
BAND_KEYWORDS = []
for band in SENIORITY_PRECEDENCE:
    for keyword in SENIORITY_BANDS[band]["title_keywords"]:
        BAND_KEYWORDS.append((keyword.lower(), band))
BAND_KEYWORDS.sort(key=lambda item: len(item[0]), reverse=True)

TITLE_PREFIXES = (
    "chief ", "group ", "senior ", "divisional ", "regional ", "national ",
    "executive ", "assistant ", "deputy ", "interim ", "acting ",
)


def clean(value):
    return (value or "").strip()


def normalize_title(title):
    """Canonical title: trimmed, collapsed whitespace, lower-case handled upstream."""
    title = re.sub(r"\s+", " ", clean(title))
    return title if title else UNKNOWN


def seniority_band(*titles):
    """Derive an S1-S8 band from one or more evidenced titles; Unknown when unclear."""
    for title in titles:
        text = clean(title).lower()
        if not text:
            continue
        for keyword, band in BAND_KEYWORDS:
            if keyword in text:
                return band
    return UNKNOWN


def grouped_industry(primary_industry, explicit_group=None):
    if clean(explicit_group):
        return clean(explicit_group)
    key = clean(primary_industry).lower()
    if not key:
        return UNKNOWN
    if key in PRIMARY_TO_GROUP:
        return PRIMARY_TO_GROUP[key]
    return UNKNOWN


def industry_subsector(record):
    return clean(record.get("current_sub_industry")) or UNKNOWN


def _fallback_grouped(primary_industry):
    """Grouped-industry name that a bare industry string should fall back to."""
    group = grouped_industry(primary_industry)
    return group


def associated_industry_groups(primary_industry, grouped=None, limit=4):
    """Strong adjacencies first, then moderate ones - capped, never padded."""
    groups = []
    group = grouped if grouped and grouped != UNKNOWN else _fallback_grouped(primary_industry)
    if group and group != UNKNOWN:
        groups.append(group)

    key = clean(primary_industry)
    entry = ADJACENCY.get(key)
    if entry is None:
        # Case-insensitive lookup over adjacency keys.
        for candidate in ADJACENCY:
            if candidate.lower() == key.lower():
                entry = ADJACENCY[candidate]
                break
    if entry:
        for group_name in entry.get("strong", []) + entry.get("moderate", []):
            if group_name not in groups:
                groups.append(group_name)
            if len(groups) >= limit:
                break
    return groups[:limit]


def employer_fields(record):
    """Canonical employer name + employer group from the normalisation map."""
    raw = clean(record.get("current_employer")) or UNKNOWN
    spec = EMPLOYER_NORMALIZATION.get(raw)
    if spec is None:
        for candidate, candidate_spec in EMPLOYER_NORMALIZATION.items():
            if candidate.lower() == raw.lower():
                spec = candidate_spec
                break
    if spec:
        return spec["canonical"], spec["group"], raw
    return raw, raw, raw


def career_industry_path(record):
    """`Professional Services > Retail > FMCG` from evidenced career history + current employer."""
    industries = []
    for role in record.get("career_history") or []:
        if not isinstance(role, dict):
            continue
        industry = clean(role.get("industry"))
        if industry and industry not in industries:
            industries.append(industry)
    modules = []
    for module in record.get("work_history") or []:
        if not isinstance(module, dict):
            continue
        industry = clean(module.get("industry") or module.get("primary_industry"))
        if industry and industry not in industries:
            industries.append(industry)
    current = clean(record.get("current_industry"))
    if not industries:
        return current if current else UNKNOWN
    label = industries[0]
    if current and current != industries[-1]:
        industries.append(current)
    path = [label]
    for industry in industries:
        if industry != path[-1]:
            path.append(industry)
    return " > ".join(path)


def classify(record):
    """Return the derived classification layer for one person record."""
    title = record.get("normalized_job_title") or record.get("current_title")
    band = clean(record.get("seniority_band")) or seniority_band(title, record.get("current_title"))
    primary = clean(record.get("current_industry")) or UNKNOWN
    grouped = grouped_industry(primary, record.get("grouped_industry"))
    canonical, group, raw = employer_fields(record)
    return {
        "normalized_job_title": normalize_title(record.get("normalized_job_title") or record.get("current_title")),
        "seniority_band": band if band != UNKNOWN else UNKNOWN,
        "seniority_label": SENIORITY_BANDS.get(band, {}).get("label", UNKNOWN) if band != UNKNOWN else UNKNOWN,
        "primary_industry": primary,
        "industry_subsector": industry_subsector(record),
        "grouped_industry": grouped,
        "associated_industry_groups": associated_industry_groups(primary, grouped),
        "career_industry_path": career_industry_path(record),
        "employer_canonical": canonical,
        "employer_group": group,
        "employer_raw": raw,
    }


def evidence_backed_tags(record, field, allowed):
    """Filter a record's tag list against the controlled vocabulary (no invention)."""
    values = record.get(field) or []
    if isinstance(values, str):
        values = [values]
    allowed_lower = {item.lower(): item for item in allowed}
    out = []
    for value in values:
        canonical = allowed_lower.get(clean(value).lower())
        if canonical and canonical not in out:
            out.append(canonical)
    return out
