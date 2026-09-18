# Qualification Truth Model & Rules

These rules are binding for every record. They prevent the contamination of a designation claim
with an unproven training route.

## 1. Qualified vs articles — separate questions (never collapsed)

1. Is this person professionally qualified?
2. What professional designation do they hold?
3. What professional body awarded it?
4. Did they complete articles?
5. Which articles?
6. Where?
7. Or an alternative recognised route (RPL / reciprocity / PER / other)?

## 2. Values

`professionally_qualified`: `true` | `false` | `unknown`

`professional_designation_status`: `CONFIRMED` | `HIGH_CONFIDENCE` | `PROBABLE` | `UNCONFIRMED`
| `INCOMPLETE` | `CONFLICTING`

`articles_completion_status`: `CONFIRMED_EXPLICIT` | `TRAINING_CONTRACT_CONFIRMED` |
`PROFESSIONAL_PER_CONFIRMED` | `QUALIFIED_BUT_ARTICLES_NOT_ESTABLISHED` | `RPL_ROUTE` |
`RECIPROCITY_ROUTE` | `IN_PROGRESS` | `NOT_ESTABLISHED` | `NOT_APPLICABLE` | `CONFLICTING`

## 3. Safe-assumption matrix

| Designation | Safe to assume | NOT safe to assume |
|---|---|---|
| `CA(SA)` | professionally qualified | SAICA articles completed, articles employer/dates, audit firm, route |
| `PA(SA)` | professionally qualified | SAIPA articles/learnership completed, articles employer |
| `AGA(SA)` | holds a recognised designation | SAICA articles completed |
| `ACCA`/`FCCA` (full member) | qualified + practical-experience requirement satisfied (`ACCA_PER`) | that ACCA PER = "articles"; Big Four training contract; where experience was gained |
| `ACMA`/`FCMA` (CIMA member) | qualified management accountant; recognised practical-experience requirement satisfied (`CIMA_PER`) | calling PER "articles"; experience at current employer; CIMA body implied by bare `CGMA` |

`person is professionally qualified` from a designation does **not** automatically populate an
articles employer.

## 4. Articles recording

Only record `articles_completion_status = CONFIRMED_EXPLICIT` / `TRAINING_CONTRACT_CONFIRMED`
where a source explicitly states: completed SAICA articles / SAIPA articles / a SAICA training
contract / a SAIPA training contract or learnership / discharge from a training contract / a
named training office traineeship.

Possible PA(SA) routes captured separately when discovered: SAIPA learnership, SAIPA training
contract, SAIPA articles, recognition of prior learning, verifiable experience route, recognised
training through another professional body.

## 5. ACCA rules

- Confirmed ACCA member → `professionally_qualified = true`, `practical_experience_framework = ACCA_PER`.
- ACCA PER is **not** "articles" (use `NOT_APPLICABLE_OR_NOT_ESTABLISHED` unless separate evidence).
- **Excluded** from qualified population on these descriptions alone: ACCA student / studying /
  candidate / finalist / affiliate / completed exams / part-qualified / papers completed.
  Retain as `REJECTED` or `RESEARCH_HOLD`.

## 6. CIMA rules

- Verified `ACMA` → `professionally_qualified = true`, `professional_designation = ACMA`.
- `FCMA` is a senior CIMA membership designation (do not exclude by searching only ACMA).
- `CGMA` retained as a management-accounting designation; professional body is CIMA only when
  evidence says so, else `UNKNOWN_OR_OTHER_RECOGNISED_ROUTE`.
- Verified CIMA-qualified ACMA/FCMA/CGMA → `practical_experience_framework = CIMA_PER`, never
  "CIMA articles" unless a source explicitly establishes an articles route.
- **Excluded** on these alone: CIMA student / candidate / studying / Operational/Management/
  Strategic level / finalist / Cert BA / Diploma / Advanced Diploma / passed exams.

## 7. Multiple designations

Store arrays. Example: `["CA(SA)","ACMA","CGMA"]` with bodies captured separately. Never force a
single category.

## 8. Rejection list (retain, do not delete)

CA(SA) candidate; SAICA/SAIPA trainee or student; AGA candidate; ACCA student/candidate/finalist/
affiliate (no membership evidence); CIMA student/candidate/finalist/diploma-only; incomplete
articles; article clerk with no completion evidence; accounting degree / honours / CTA only;
audit-firm employment without qualification evidence.

## 9. Confidence classification

- `CONFIRMED` — credible public evidence directly establishes identity AND designation (body
  confirmation, employer bio states CA(SA), public LinkedIn states PA(SA), bio states ACCA member
  / ACMA, CGMA).
- `HIGH` — strong multi-source evidence, direct verification incomplete.
- `PROBABLE` — strongly suggests qualification, material element uncertain. **Not** in the main
  confirmed count.
- `RESEARCH_HOLD` — potentially valuable, needs verification.
- `REJECTED` — fails inclusion criteria.

## 10. Source hierarchy (preference order)

Professional body → employer biography → direct public LinkedIn → individual professional bio →
company announcement → annual report → recognised association → university/alumni → conference/
speaker bio → credible published CV → reputable media → recruitment bio → search snippet → other.

A search snippet is *discovery* evidence, not automatically the underlying primary source.
