# Batch 21 review — BMW IT Hub and a self-contradicting source — 2026-11-05

Batch: `batch-21-bmw-it-hub-2026-11-05.jsonl`
Scope: the 68 people the roster records at BMW's IT Hub, and a figure conflict in BMW's own page.

## Outcome

- 2 rows, **1 organisation updated**, no new organisations, no conflicts, no issues.
- No verification requested; BMW Group was verified in batch 18.
- Manifest **1689 → 1687** organizations, zero unmapped contacts.
- Universe **2,370 → 2,368**; dataset-only **1,741 → 1,739**.

## BMW IT Hub is a site, not a company

The roster records 68 people across two spellings: **BMW IT Hub** (55) and **BMW IT Hub South
Africa** (13). Neither resolved to anything, so the largest single stranded employer in the register
was BMW's own IT function.

BMW Group's own careers site settles it. Its graduate programme page lists the places BMW Group South
Africa puts people:

- Plant Rosslyn, Rosslyn
- Vehicle Distribution Centre, Rosslyn
- National Sales Company, Midrand
- BMW Financial Services, Midrand
- **BMW IT Hub, Menlyn**

A site listed beside a plant and a distribution centre is a location, not a legal entity. Both
spellings are aliased to the BMW Group record and Menlyn is recorded as a location of the company.

**What would reverse this:** if the IT Hub is later shown to be a separately registered entity, it
should become its own record with a corporate relationship to BMW Group South Africa, and the aliases
removed. That condition is written into the record's note.

## The source contradicts itself, and the conflict is recorded

Confirming the above meant reading the Plant Rosslyn page again, and it does not agree with itself:

| Where on the page | Figure |
| --- | --- |
| Facts and Figures panel | **~2 800 employees** at the plant |
| Narrative text | a workforce of **more than 2 500 associates** |

Same page, same company, no dates on either, and no statement of how the two differ. They may
measure different things — everyone at the site versus associates in production — but the page does
not say so, and inventing that explanation would be exactly the borrowing this programme forbids.

**Neither figure was averaged, and neither was quietly dropped.** 2 800 stays in the scale field as
the page's own headline measure; 2 500 is recorded in the note so the conflict is visible to whoever
reads the record next. A later reader with a third source can settle it; a reader now can see that it
is unsettled.

Both figures describe the plant, not the South African company and certainly not the global group.

## Standing lesson

Three batches in a row (19, 20, 21) found the same class of defect: an employer string that resolved
to nothing while a curated company with the same name sat in the register. It is worth stating why it
kept appearing. A dataset employer id is not an error — it is what the register uses for a name nobody
has curated yet. It only becomes a defect when the curated record already exists, and nothing used to
check that. It is now a test.
