# Active Context — ICTQuest

Current work focus for agents. Execution spec: #23 (source of truth).
Decisions frozen in `docs/adr/0001–0005` (#24 baseline, closed).

## Current focus

Migration 02 — Memory-bank rewrite (#25, this ticket): the four canonical files
(`projectbrief.md`, `productContext.md`, `systemPatterns.md`, `techContext.md`) now
carry ICTQuest vocabulary with `Post` dropped, dashboard reshaped to progress-stats,
and admin scope stated; this file and `progress.md` point at #23 as the current
focus.

## Recent changes

- #24 closed 2026-09-14: ADR shell + five ADRs (`docs/adr/0001–0005` + `README.md`)
  plus published research (`docs/research/lesson-content-store.md`,
  `pwa-rest-surface.md`, `tooling-cutover.md`).
- #25 (this ticket): memory-bank rewrite citing those ADRs; legacy ownership doc
  `.clinerules/MemoryBank.md` retired; `.clinerules/api-patterns.md` and
  `.clinerules/ui-usage.md` kept until ADR equivalents land.

## Next steps

- #26 Migration 03 — Lint, scripts, and root baseline (Biome/Ultracite lock,
  `dev-lan` + `pwa-assets` scripts).
- Then #27 Migration 04 — Test harness cutover (Jest → Vitest + Playwright),
  #29 MDX pilot, #28 auth expand, per the #23 migration order.
- Later tickets cite the ADRs as source of truth; if work contradicts an ADR,
  surface it explicitly and supersede — never silently override.

## Active decisions and vocabulary

- Six entities: Lesson, Topic, Quiz (standalone), Progress, Achievement, User.
  Compliments is a page only. `Post` is dropped.
- route group = URL-invisible layout bucket; shell = per-group layout chrome;
  guard = `proxy.ts` + `routes.ts` rule.
- Testing: externally visible behavior at the highest seam possible
  (route+guard → procedure → REST → MDX render → PWA); never implementation
  details (spec #23).

## Open questions

None for this ticket — remaining fog (per-entity service/repository/schema mapping,
cache tags, MDX migration order) is carried into execution per #23, not new
tickets.
