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

## Industry-body-first gate

All company market mapping, new tracks, recruitment targeting and executive
search research must open `docs/industry-body-intelligence.md` and check
`markets/organizations/industry-body-intelligence/` before selecting target
companies or people. Reverse-map official association membership directories;
separate suppliers, operators, regulations and verified memberships. Update
`coverage.json`, never treat unresearched as absent, and run
`npm run validate:industry-bodies` before merge.
