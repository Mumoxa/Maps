# SA Talent Map Agent Team

## Orchestration Pattern

Hub-and-spoke with release gate.

- The Product Owner / Chief of Staff is the hub and owns prioritization.
- Specialist agents run in parallel on disjoint concerns: engineering, UX, QA, and trust.
- The Release Manager is the final gate and converts findings into a go-live decision.

This pattern fits the repo because the app has one shared user journey, multiple specialist risk areas, and a need to avoid random feature drift while still moving fast.

## Team

- `product-owner-chief-of-staff.md`
- `senior-full-stack-engineer.md`
- `ui-ux-lead.md`
- `qa-playwright-tester.md`
- `data-privacy-trust-reviewer.md`
- `release-manager.md`

## Operating Rules

- Read `AGENTS.md` before proposing or applying changes.
- Treat the product as `SA Talent Map`, with Credit Risk as one track.
- Protect live routes and existing working data views while expanding the platform.
- Prefer derived data and indexed lookups over repeated scans in render paths.
- Never expose or imply private candidate data beyond what the product explicitly supports.
- Record findings as `P0`, `P1`, `P2`, or `P3`.
- Safe, obvious `P0` and `P1` fixes should be applied immediately after review.

## Mandatory market-mapping preflight (all agents)

Before researching any company market, specialist sourcing assignment, new
market track or candidate shortlist, read `docs/industry-body-intelligence.md`.
Start at the specialist niche, discover relevant governing/trade/professional
bodies and reverse-map their member directories; reconcile companies before
role-specific tiering or people research. Record source and unknowns.
The Product Owner, research agent, data reviewer, QA agent and release gate
must check the `npm run validate:industry-bodies` result.
