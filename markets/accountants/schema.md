# JSONL Record Schemas

All stores are newline-delimited JSON (JSONL) — one JSON object per line, UTF-8. Append-only:
new records append; corrections rewrite the line for the same `id`. Ids are sequential within
each store: `acc-0001`, `cmp-0001`, `src-0001`.

## people.jsonl

```json
{
  "id": "acc-0001",
  "date_first_found": "2026-09-18",
  "date_last_verified": "2026-09-18",
  "status": "CONFIRMED | HIGH_CONFIDENCE | PROBABLE | RESEARCH_HOLD | ARTICLES_CONFIRMED_DESIGNATION_UNVERIFIED | REJECTED",
  "first_name": "…",
  "surname": "…",
  "full_name": "…",
  "alternate_names": [],
  "professionally_qualified": "true|false|unknown",
  "professional_designations": ["CA(SA)"],
  "professional_bodies": ["SAICA"],
  "designation_status": "CONFIRMED|HIGH_CONFIDENCE|PROBABLE|UNCONFIRMED|INCOMPLETE|CONFLICTING",
  "qualification_confidence": "CONFIRMED|HIGH|PROBABLE|RESEARCH_HOLD|REJECTED",
  "qualification_evidence": "…",
  "academic_qualifications": [],
  "articles_completion_status": "CONFIRMED_EXPLICIT|TRAINING_CONTRACT_CONFIRMED|PROFESSIONAL_PER_CONFIRMED|QUALIFIED_BUT_ARTICLES_NOT_ESTABLISHED|RPL_ROUTE|RECIPROCITY_ROUTE|IN_PROGRESS|NOT_ESTABLISHED|NOT_APPLICABLE|CONFLICTING",
  "articles_body": null,
  "articles_employer": null,
  "articles_period": null,
  "articles_location": null,
  "practical_experience_framework": "ACCA_PER|CIMA_PER|null",
  "qualification_route": "…",
  "current_title": "…",
  "current_employer": "…",
  "current_role_family": "…",
  "current_function": "…",
  "current_role_start_date": null,
  "country": "South Africa",
  "province": "…",
  "city": "…",
  "suburb": null,
  "linkedin_location": "…",
  "location_confidence": "CONFIRMED|HIGH|PROBABLE|UNCONFIRMED",
  "current_industry": "…",
  "current_sub_industry": null,
  "historic_industry_exposure": [],
  "skills_confirmed": [],
  "accounting_systems_confirmed": [],
  "erp_systems_confirmed": [],
  "analytics_tools_confirmed": [],
  "employer_systems_observed": [],
  "career_history": [],
  "estimated_years_experience": "unknown",
  "experience_estimate_basis": "…",
  "linkedin_url": null,
  "other_profile_urls": [],
  "primary_source": "…",
  "source_urls": [],
  "confidence": "CONFIRMED|HIGH|PROBABLE|RESEARCH_HOLD|REJECTED",
  "notes": "…",
  "booleans": {
    "ca_sa": "true|false|unknown",
    "pa_sa": "…", "aga_sa": "…", "acca": "…", "fcca": "…", "acma": "…",
    "fcma": "…", "cgma": "…", "saica_articles_confirmed": "…",
    "saipa_articles_confirmed": "…", "acca_per_confirmed": "…",
    "cima_per_confirmed": "…", "group_accounting": "…", "consolidations": "…",
    "management_accounting": "…", "cost_accounting": "…", "fpa": "…",
    "commercial_finance": "…", "sage300_accpac": "…", "sap": "…",
    "oracle": "…", "syspro": "…", "dynamics": "…"
  }
}
```

## companies.jsonl

```json
{
  "id": "cmp-0001",
  "company_name": "…",
  "company_aliases": [],
  "website": "…",
  "industry": "…",
  "sub_industry": null,
  "headquarters": "…",
  "south_africa_locations": [],
  "company_size_if_public": null,
  "listed_or_private": "listed|private|unknown",
  "parent_company": null,
  "source_urls": [],
  "date_verified": "2026-09-18"
}
```

## sources.jsonl

```json
{
  "id": "src-0001",
  "url": "…",
  "source_type": "LinkedIn|Professional Body|Employer Website|Company Biography|Annual Report|PDF|CV|Conference Biography|University|Alumni Profile|News|Directory|Search Snippet|Recruitment Profile|Other",
  "person_id": "acc-0001",
  "company_id": null,
  "evidence_type": "…",
  "evidence_summary": "…",
  "qualification_supported": "true|false|null",
  "skill_supported": "…",
  "system_supported": "…",
  "employment_supported": "…",
  "accessed_date": "2026-09-18",
  "reliability": "PRIMARY|STRONG|MODERATE|WEAK|DISCOVERY",
  "status": "USED|REVIEWING|REJECTED"
}
```
