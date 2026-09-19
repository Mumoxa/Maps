# Qualification Truth Model & Rules

These rules are binding for every record. They prevent qualification, designation and training-route claims from being contaminated by assumptions.

**Important:** professional qualification is no longer the inclusion gate for the wider Accounting & Finance track. A source-verified bookkeeper, accountant, analyst, controller, manager or finance executive may be included without a professional designation. Qualification fields must then say exactly what is known, unknown, in progress or not applicable.

## 1. Finance-role inclusion and qualification are separate questions

Ask independently:

1. Is the current role a source-verified finance role at bookkeeper-equivalent level or above?
2. Is this person professionally qualified?
3. What professional designation(s) do they hold?
4. What professional body awarded / registers the designation?
5. Did they complete articles or a training contract?
6. Which articles / training route?
7. Where and when?
8. Or did they qualify through another recognised route (RPL / reciprocity / PER / other)?
9. What academic qualifications are publicly evidenced?

Never convert “works in finance” into “professionally qualified,” and never convert a designation into a specific articles route.

## 2. Values

`professionally_qualified`: `true` | `false` | `unknown`

`designation_status`: `CONFIRMED` | `HIGH_CONFIDENCE` | `PROBABLE` | `UNCONFIRMED` |
`INCOMPLETE` | `CONFLICTING` | `NOT_APPLICABLE`

`articles_completion_status`: `CONFIRMED_EXPLICIT` | `TRAINING_CONTRACT_CONFIRMED` |
`PROFESSIONAL_PER_CONFIRMED` | `QUALIFIED_BUT_ARTICLES_NOT_ESTABLISHED` | `RPL_ROUTE` |
`RECIPROCITY_ROUTE` | `IN_PROGRESS` | `NOT_ESTABLISHED` | `NOT_APPLICABLE` | `CONFLICTING`

## 3. Safe-assumption matrix

| Designation | Safe to assume | NOT safe to assume |
|---|---|---|
| `CA(SA)` | professionally qualified | SAICA articles completed, articles employer/dates, audit firm, route |
| `PA(SA)` | professionally qualified | SAIPA articles/learnership completed, articles employer |
| `AGA(SA)` | holds a recognised designation | SAICA articles completed |
| `ACCA`/`FCCA` (full member) | qualified + ACCA practical-experience requirement satisfied | that ACCA PER = “articles”; Big Four training contract; where experience was gained |
| `ACMA`/`FCMA` (CIMA member) | qualified management accountant; recognised practical-experience requirement satisfied | calling PER “articles”; experience at current employer; CIMA body implied by bare `CGMA` |

A professional designation does **not** automatically populate an articles employer.

## 4. Articles recording

Only record `articles_completion_status = CONFIRMED_EXPLICIT` / `TRAINING_CONTRACT_CONFIRMED` where a source explicitly states completed SAICA articles / SAIPA articles / a SAICA training contract / a SAIPA training contract or learnership / discharge from a training contract / a named training-office traineeship.

Possible PA(SA) routes remain separate: SAIPA learnership, SAIPA training contract, SAIPA articles, recognition of prior learning, verifiable experience route, recognised training through another professional body.

If the public sources do not establish articles, use `NOT_ESTABLISHED` or `QUALIFIED_BUT_ARTICLES_NOT_ESTABLISHED`; never infer articles from designation.

## 5. ACCA rules

- Confirmed ACCA member → `professionally_qualified = true`, `practical_experience_framework = ACCA_PER`.
- ACCA PER is **not** “articles.”
- ACCA student / candidate / finalist / affiliate / completed exams / part-qualified is **not** a confirmed ACCA member.
- Such a person may still be included in the finance-team population if the current finance role independently meets the role floor. Their designation fields must remain incomplete/unconfirmed.

## 6. CIMA rules

- Verified `ACMA` → professionally qualified.
- `FCMA` is a senior CIMA membership designation.
- `CGMA` is retained as a management-accounting designation; CIMA is only populated as the professional body when evidence says so.
- Verified CIMA-qualified ACMA/FCMA/CGMA → `practical_experience_framework = CIMA_PER`, never “CIMA articles” unless a source explicitly establishes an articles route.
- CIMA student / candidate / Operational / Management / Strategic level / finalist / Cert BA / Diploma / Advanced Diploma alone does not prove professional membership.
- The person may still be included because of an independently verified in-scope finance role.

## 7. Multiple designations

Store arrays. Example: `["CA(SA)","ACMA","CGMA"]` with bodies captured separately. Never force a single category.

## 8. Inclusion / rejection logic

### Retain

- `CONFIRMED` — identity, current in-scope finance role and professional designation are directly evidenced.
- `FINANCE_ROLE_CONFIRMED` — identity and current in-scope finance role are directly evidenced; no professional designation is confirmed or designation is still in progress.
- `HIGH_CONFIDENCE`, `PROBABLE`, `RESEARCH_HOLD`, `ARTICLES_CONFIRMED_DESIGNATION_UNVERIFIED`, `CONFLICTING` where the record is useful and the uncertainty is explicit.

### Reject / hold outside the published population

- role is below the bookkeeper-equivalent floor;
- role is not finance/accounting;
- current employer or identity cannot be tied to the person with evidence;
- profile is attached only on name similarity;
- evidence is contradictory enough that current employment cannot be established.

Do **not** reject a valid finance professional merely because they are not professionally designated.

## 9. Confidence classification

- `CONFIRMED` — credible public evidence directly establishes identity, current finance role and claimed professional designation.
- `FINANCE_ROLE_CONFIRMED` — credible public evidence directly establishes identity and current in-scope finance role; designation absent, incomplete or unverified.
- `HIGH` — strong multi-source evidence, direct verification incomplete.
- `PROBABLE` — strongly suggests the claim, material element uncertain.
- `RESEARCH_HOLD` — potentially valuable, needs verification.
- `REJECTED` — fails role floor, identity/employment evidence or scope.

## 10. Source hierarchy

Professional body → employer biography → direct public LinkedIn → individual professional bio → company announcement → annual report → recognised association → university/alumni → conference/speaker bio → credible published CV → reputable media → recruitment bio → directory → search snippet → other.

A search snippet is discovery evidence, not automatically the underlying primary source.
