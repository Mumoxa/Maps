# Repo Guardrails

Use this skill whenever working on SA Talent Map.

## Mandatory Rules

- Read `AGENTS.md` before editing.
- Treat the product brand as `SA Talent Map`.
- Credit Risk is one track, not the platform name.
- Keep all counts derived from runtime data.
- Prefer indexed lookups and precomputed maps over repeated render-time scans.
- Preserve working routes and do not regress live search or drill-down behavior.
- Any valid LinkedIn URL should remain visible wherever the corresponding profile is shown.
- Mark verification-pending data clearly and avoid overclaiming.
- Use semantic interactive elements and keyboard-accessible handlers.

## Before Merge

- Build the app.
- Run any available smoke or validation scripts.
- Summarize `P0`, `P1`, `P2`, and remaining blockers.
