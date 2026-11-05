# Batch 20 review — employer spelling variants — 2026-11-05

Batch: `batch-20-alias-variants-2026-11-05.jsonl`
Scope: curated companies whose people were also counted under a second, unclaimed spelling.

## Outcome

- 6 rows, **6 organisations updated**, no new organisations, no conflicts, no issues.
- No verifications requested. This is identity work: nothing new was claimed about any company.
- Contact manifest regenerated: **1689 organizations** (was 1699), zero unmapped contacts.
- Universe: **2,379 → 2,370** organizations; dataset-only **1,750 → 1,741**.

| Company | Aliases added | People moved |
| --- | --- | ---: |
| Shoprite Holdings | Shoprite, Shoprite Checkers, Shoprite Group, The Shoprite Group of Companies, Shoprite Checkers Group | 64 |
| PwC South Africa | PwC, PricewaterhouseCoopers | 25 |
| KPMG South Africa | KPMG, KPMG (South Africa) | 4 |
| NTT DATA | NTT, NTT Data, NTT DATA Middle East and Africa | 4 |
| Tronox Namakwa Sands | Tronox, Tronox Holdings | 2 |
| Mulilo Energy | Mulilo, Mulilo Renewable Energy | 1 |

## Why this batch exists

Batch 17 fixed the loader so a curated alias could beat a frozen dataset id. This batch is what that
fix makes possible to *see*: once aliases resolve correctly, it becomes obvious that several curated
companies had a second life as a dataset employer. "Shoprite" (64 people) and "Shoprite Holdings" (0
people, curated, verified) are one company. So are "PwC" (25) and "PwC South Africa" (84), and "KPMG"
(4) and "KPMG South Africa" (23).

Left alone, each pair is a phantom: the register shows one firm twice, one copy carrying all the
evidence and none of the people, the other carrying the people and no evidence.

**The manifest is the second half of the fix.** An alias resolves correctly and moves nobody until
`npm run contacts:reconcile` regenerates the manifest that stores the resolved ids. Batch 17's
lesson, applied before it could bite again.

## Two corrections made in passing

- **Mulilo's website was a LinkedIn company page.** `company-website` is the source type that
  verification rests on, and a LinkedIn profile is not the company's own domain. It now points at
  `mulilo.com`. Its own page also states that Copenhagen Infrastructure Partners took a majority
  shareholding in 2023 — recorded as an ownership fact in the note, not as a corporate relationship
  claim.
- **Shoprite, PwC and KPMG have no `legalName` recorded**, which is a real gap in the register and
  was not invented to fill the table. PwC's registered name `PricewaterhouseCoopers Inc` is present;
  Shoprite's and KPMG's are not, and the records say so by omission rather than by guess.

## The one judgement call, which can be reversed on evidence

**The bare "Tronox" spelling was assigned to Tronox Namakwa Sands.** That is the only South African
Tronox operation in the register, so 2 people on a bare "Tronox" string are most likely at Namakwa
Sands. But "Tronox" could equally be a head office or a second plant, and the alias asserts more
than the evidence shows.

It is recorded in the record's note with the condition for reversing it: if a second South African
Tronox operation is ever added, the bare spelling must be split and the alias removed. This is the
one place in the batch where a decision was made on judgement rather than on a source, and it says
so where a reviewer will find it.

## The gate this batch added

A test now fails when **any employer points at a dataset id for which a curated record exists** —
that is the mechanical signature of one company counted twice, and it no longer depends on someone
noticing. A second test pins the specific spellings above so a future refactor cannot quietly
re-strand them.

Dataset-only employers with no matching curated record are legitimate and are not flagged: those are
genuinely unmapped names waiting for research, not duplicates.
