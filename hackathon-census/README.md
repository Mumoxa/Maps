# South African Hackathon Participant & Winner Census

Forensic-quality open-source research database of people who participated in, placed in, or won
hackathons and sprint-format technology competitions connected to South Africa — built strictly from
publicly accessible sources, with every claim traceable to a URL.

**Status: Phase 2 (2026-08-26). NOT saturated — see `research/saturation_assessment.md`.**
Citation form: *"Best achievable public-source coverage as of 2026-08-26 (Phase 2)"* — never "complete".

## Contents

| File | Dataset | Grain |
|------|---------|-------|
| `data/01_people_master.csv` | People Master | 1 row per unique individual |
| `data/02_participation_history.csv` | Participation History | 1 row per person per event (39-column schema) |
| `data/03_hackathon_master.csv` | Hackathon Master | 1 row per event/edition (26-column schema) |
| `data/04_evidence_register.csv` | Evidence Register | 1 row per source-claim relationship |
| `data/05_unresolved_identities.csv` | Unresolved Identities | named teams/people pending member-level resolution |
| `data/06_research_gaps.csv` | Research Gaps | known missing coverage |
| `data/07_sources_searched.csv` | Sources Searched | platforms/domains investigated |
| `REPORT.md` | Final research report | stats, coverage, gaps |
| `research/research_log.md` | Research log | every query + outcome |
| `research/contradiction_log.md` | Contradictions (§25) | unresolved conflicts flagged, never silently resolved |
| `research/scope_decisions.md` | Inclusion/exclusion register | what was included, excluded, and why |
| `research/saturation_assessment.md` | Saturation test (§24) | pass-by-pass yields |
| `scripts/` | Build scripts | reproducible CSV generation + QA stats |

## Method (summary)
SEARCH → VERIFY → CROSS-CHECK → RECORD → SEARCH AGAIN. No value is inferred to fill a gap: every
empty cell reads `Unknown` (= "Not publicly verified"). Profiles are **not** attached on name similarity;
no public-profile discovery pass has been executed yet, so all profile columns are `Unknown` pending a
dedicated §8 pass. Team members are recorded as individuals only where a source names them; otherwise
the team is logged in `05_unresolved_identities.csv`.

## Regenerate
```bash
python3 scripts/build_dataset.py   # writes data/*.csv + prints QA stats
```
