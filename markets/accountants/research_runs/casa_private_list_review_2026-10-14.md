# Private candidate-list source review — NOT imported (2026-10-14)

**Outcome: 0 people added, 0 people enriched, counts unchanged**
(1,024 total records · 159 CA(SA)-tagged · 158 SA-labelled ·
150 designation-confirmed SA-labelled — exactly as after batch 13).

## What was supplied

- A file named `candidates.csv` was twice described as attached, but no file
  was present in the workspace on either occasion; a screenshot of the
  spreadsheet was visible in chat instead (rows numbered 1–100).
- The screenshot's columns included, among others: name, ethnicity,
  disability, citizenship, living location, work experience, skills,
  highest qualification, salary/rate bands, availability, preferred email,
  email address, phone number, LinkedIn and notes referencing CVs and ID
  numbers. **No values from those columns have been copied into this
  repository, this log, or any research record.** Transcribing the
  screenshot would itself import private contact/special-category data
  into a public-repo workflow, so it was not done.

## Rights / permission assessment

- Requester's statement (2026-10-14): the list is being built from
  “a tool that I pay a subscription for”, and people from it may be used
  for the wider Accounting & Finance population as well as the CA(SA)
  target.
- **A paid subscription is access, not a publication licence.** It does not
  by itself confirm (a) the tool's terms permit exporting names to build
  public profiles of its candidates, (b) the candidates consented to that
  purpose, or (c) any SAICA membership/designation fact. Under the project
  rules (`README.md` privacy boundary; batch-13 scope decision) this source
  is therefore treated as **rights-unconfirmed private data**, not as an
  authorised roster and not as public-professional evidence.
- Ethnicity and disability are special personal information; email, phone,
  salary expectations, availability and ID references are private contact /
  recruitment data. None may enter `people.jsonl`, `people.json`, the
  website, or Git — and none is needed to verify a CA(SA) designation.

## What would make names from this list usable (leads-only route)

1. Requester confirms, in writing in the batch log, that the named tool's
   terms permit using its candidate **names** as research leads for public
   profiling (tool name + terms clause/date, no credentials or membership
   numbers).
2. Supply a **reduced CSV only**, matching
   `templates/ca-sa-roster-reconciliation.csv`:
   `full_name,public_profile_url` — no email, phone, ID, ethnicity,
   disability, salary, availability or CV columns. It will be held only
   under git-ignored `.local/casa/` and never committed.
3. Each name is then treated as an **unverified lead**: a person is added
   only if public professional sources independently evidence identity,
   CA(SA) designation (for the CA(SA) count) or a current in-scope finance
   role (for the wider population, per the requester's wider-use answer),
   SA-resident/working status separately, current title/employer and
   sourced employer industry. The private list itself will never be cited
   as a source, and no field will be filled from it.
4. People who cannot be publicly verified stay in a private
   unresolved-leads count — they are not added, not counted, and not
   published.

Until steps 1–2 are completed, the verified incremental work from this
source is **zero**, by design. This is a blocker report, not a shortfall
that may be closed by lowering the evidence standard.
