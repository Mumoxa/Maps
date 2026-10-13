# Data Science & Machine Learning — source-reported research pool

This is a **public professional market-mapping stream**, not the recruiter's private assignment or Search Bank.

- Original scope: a South African Production-ML Senior Data Scientist market search assembled 13 October 2026.
- This baseline has 211 source-reported public professional identities.
- Every person has a user-supplied LinkedIn URL, reported role, employer, location string, and sourcing talent-pool category. **Profiles were not individually authenticated or opened during this import.**
- All records have `evidenceStatus: SOURCE_REPORTED_UNVERIFIED`. Do not infer Python, SQL, Azure, MLflow, model deployment or drift monitoring from a title or employer.
- Source-reported career details may be stale. The location string is preserved without geographical inference in the research record.
- Inferred talent pools are sourcing categories, **not verified skills, suitability or experience**.
- No fit scores, recruitment judgements, availability, private contact details, client notes, screening decisions or confidential search assignments are published here.
- `people.jsonl` is the append-only research source, `people.json` is the generated UI dataset. Regenerate with `python3 markets/data-science-ml/gen_people_json.py`.
- The **private** client Search Bank must not be committed to `markets/search-bank/bank.json` while this repository and static site expose it publicly.

Before treating records as confirmed: open each source profile, resolve role/employer discrepancies, and corroborate with dated evidence.
