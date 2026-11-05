# Batch 16–17 review — identity aliases and resolution — 2026-11-04

Batches: `batch-16-identity-aliases-2026-11-04.jsonl` (2 rows),
`batch-17-alias-resolution-2026-11-04.jsonl` (5 rows)
Scope: employer strings the contact roster writes that no register record claimed.

## Outcome

- Batch 16: 2 rows, **2 organisations updated**, no issues.
- Batch 17: 5 rows, **5 organisations updated**, no issues.
- No verifications requested in either batch. This was identity work, not evidence work.

## The problem: people stranded on unclaimed employer strings

The contact roster holds 1 743 distinct employer spellings for 1 694 records. Where the roster writes
a company differently from the register — a division, a trading name, an old name — those people were
attached to a string that matched nothing, so they did not appear under the company at all.

An alias fixes that: the spelling resolves to the record, and the people come with it.

| Company | Aliases added | Why it is one company |
| --- | --- | --- |
| Deloitte | `Deloitte Consulting`, `Deloitte South Africa`, `Deloitte (South Africa)`, `Deloitte & Touche`, `Deloitte Touche Tohmatsu` | Deloitte's own site presents consulting as a **service line**, not a separate company |
| Peninsula Beverages | `Coca-Cola Peninsula Beverages`, `CCPB` | one Western Cape Coca-Cola bottler, written two ways |
| Scatec South Africa | `Scatec`, `Scatec ASA`, `Scatec Solar` | roster uses parent and local spellings for the same people |
| Macsteel | `Macsteel Service Centres SA`, `Macsteel Service Centres` | the trading name of the same steel merchant |
| Pepkor | `Pepkor Holdings`, `Pepkor NexTech`, `Pepkor Lifestyle`, `Pepkor Payments and Lending` | Pepkor reports these as **divisions of one listed group** |
| LexisNexis | `LexisNexis South Africa`, `LexisNexis (Pty) Ltd` | the local operation's own name for itself |

## The alias was written, and nothing happened

This is the most important defect of the whole programme, and it was invisible.

Adding an alias appeared to work — the batch imported cleanly, "5 organisations updated" — while the
people stayed exactly where they were. The cause: `contact-employers.json` freezes the organisation id
each employer string resolved to **at generation time**, storing it as `org-dataset:<name>`. The
directory index preferred that stored id over the alias lookup, so a frozen dataset id could never
lose to a curated alias. The register *looked* as though it had absorbed the spellings.

The rule is now explicit and tested:

- a stored **`org-dataset:`** id is a **snapshot** — it records what happened once, and it yields to a
  curated alias;
- an **explicit curated id** is a **decision** — it is kept.

Thirteen people at "Deloitte Consulting" moved onto the Deloitte record as a result. Because the
manifest stores those ids, it has to be regenerated after any alias change:
`npm run contacts:reconcile`. The reconciliation test fails loudly until it is
(1699 ≠ 1694, duplicate at `org-deloitte`) — that failure is the guard working, not a broken test.

## Decisions deliberately not taken

- **Scatec ASA's ownership of Scatec South Africa is not asserted.** The roster uses both names for the
  same people, so ASA is an alias here; but no source read so far states the ownership structure, so
  no parent relationship was recorded.
- **Pepkor's divisions are aliases, not subsidiaries.** If any is later shown to be a separate legal
  entity it should become its own record with its own relationship, not stay an alias.
- **Deloitte Consulting is not a subsidiary.** Its own site treats consulting as a service line.

## Standing requirement after this work

Every new alias must be checked with `resolveEmployerOrganizationId`, never by eye. An alias existing
in the file proves nothing about whether people moved.
