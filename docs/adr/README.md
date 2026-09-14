# Architecture Decision Records (ADRs)

Load-bearing decisions for the ICTQuest structure migration (spec #23).
Later migration tickets cite these ADRs as source of truth.

## Index

| ADR | Title | Status |
|-----|-------|--------|
| [0001](0001-mdx-over-persistence-lessons.md) | MDX content collection over persistence-backed lessons | Accepted |
| [0002](0002-abac-plus-pat-auth.md) | ABAC many-to-many roles plus personal access tokens | Accepted |
| [0003](0003-route-group-guards.md) | Route-group shells plus prefix guards | Accepted |
| [0004](0004-vitest-plus-playwright-over-jest.md) | Vitest plus Playwright over Jest | Accepted |
| [0005](0005-interactive-docs-dev-only.md) | Interactive API docs dev/admin-only, OpenAPI JSON public | Accepted |

## Process

- Number: `NNNN-kebab-case-title.md`, sequential. Never reuse numbers.
- Statuses: `Proposed` -> `Accepted` (or `Superseded` with a pointer to the replacement). These five start at `Accepted` because the wayfinder map (#16, tickets #17-#22) and execution spec (#23) froze them.
- Template per ADR: Context, Decision, Alternatives considered, Trade-offs, Consequences (positive / negative / follow-ups), References.
- Vocabulary: route group = URL-invisible layout bucket; shell = per-group layout chrome; guard = `proxy.ts` + `routes.ts` rule; Lesson / Topic / Subtopic-Step / Content-block per the lesson-store decision. Route groups, shells, and guards are distinct terms; do not conflate them.
- Conflicts: if later work contradicts an ADR, surface it explicitly and supersede the ADR. Do not silently override.
