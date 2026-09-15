# Progress — ICTQuest

Status tracker. Execution spec: #23. Decisions: `docs/adr/0001–0005` (#24 baseline).

## What works

- #24 baseline landed: five ADRs + three published research pages; later tickets
  cite them as source of truth.
- #25 memory-bank rewrite landed (this ticket): four canonical files
  (`projectbrief.md`, `productContext.md`, `systemPatterns.md`, `techContext.md`)
  rewritten for ICTQuest vocabulary (Lesson, Topic, Quiz, Progress, Achievement,
  User; route group, shell, guard) with `Post` dropped, dashboard reshaped to
  progress-stats, and admin scope stated; `activeContext.md` and this file repoint
  at #23; legacy `.clinerules/MemoryBank.md` retired.

## What's left to build (migration order per #23)

1. #26 — Lint, scripts, and root baseline.
2. #27 — Test harness cutover (Vitest + Playwright, placeholder port, green gate).
3. #28 — Auth expand (additive schema: `Role`, `UserRole`, PAT tables, role seed).
4. #29 — MDX pilot slice, then #32 remaining lessons + parity + cache.
5. #30/#31 — Auth backfill/session/registration + privileged procedures.
6. #33/#34 — Public/app shells + guards, admin shell + guards.
7. #35/#36/#37/#38 — Progress writes + stats router, achievements + Post deletion,
   admin users + progress ops, admin lessons + achievements content.
8. #39/#40 — PWA manifest + offline page, service worker + cache rules.
9. #41/#42 — Versioned REST core + PAT + OpenAPI, REST lesson reads + stats +
   legacy retire.
10. #43 — Auth contract + final green gate.

## Current status

Current focus: #23 execution spec; latest completed: #26.
Next: #27.

## Known issues / constraints

- Memory-bank API/UI usage notes (`.clinerules/api-patterns.md`,
  `.clinerules/ui-usage.md`) are intentionally kept until ADR equivalents land.
- Remaining fog carried into execution (not new tickets): per-entity
  service/repository/schema mapping (Zod contracts, router split), cache-tags and
  `unstable-cache` policy for MDX reads vs progress writes, MDX migration order
  (pilot first, then per-lesson) plus slug-parity check.
- No implementation or file moves beyond docs in #24/#25; code cutover starts at
  #26.

## Evolution of decisions

- Wayfinder #16 + tickets #17–#22 → execution spec #23 (frozen intent).
- #24: five ADRs accepted (MDX lessons; ABAC+PAT auth; route-group guards;
  Vitest+Playwright; dev-only interactive docs) + research published.
- #25: memory-bank rewritten from closed tickets; ownership doc retired.
- #26: lint/scripts/root baseline landed (Biome/Ultracite lock with Vitest
  globals, `dev-lan` + provisional `pwa-assets` scripts, `todo.ts` stub
  deleted, stale tsconfig includes dropped, LF normalization); Jest harness
  failure is pre-existing and owned by #27.
