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

Lessons-index placement 2026-09-20: the index stays in the authed `(app)`
shell on purpose (whole `/lessons` tree needs a session); rule rewritten
in `routes.ts`/`proxy.ts`, guard tests, e2e spec, and docs;
`test:all` 177/177, e2e 15/15, build green.

Code-review follow-up done 2026-09-20 (uncommitted on `wip/ictquest-2.0`):
prior Standards findings fixed (shared pagination/prisma-error/logger
helpers, `requireUserId` narrowing, zero `as Promise`/`as string` casts in
the layered tier, `token` repository owning PAT persistence) and the Spec
gap closed (tRPC-only `token` router: owner-scoped list/create/
idempotent-revoke, hash never exposed, no OpenAPI annotations so it stays
off the REST mount). Gates: typecheck + typecheck:test + ultracite clean,
unit 158/158 green including new `tests/unit/token-lifecycle.test.ts` (7).

Slice 7 (#64) done 2026-09-20: docs + system patterns match code truth, ADR
0001/0002 supersede notes recorded, docs-truth spec gate green (check +
typecheck + 151 unit).

Slice 8 (#65) done 2026-09-20: final green gate — check + typecheck clean,
`test:all` 32 files / 168 tests green (unit + integration), Playwright 15/15
green with `webServer` (`npm run start`) auto-boot, prod `build` green.
Root causes fixed: missing Playwright `webServer` (all server specs
`ERR_CONNECTION_REFUSED`) and REST `endpoint: "/api/v1"` stripping the
`/v1` prefix trpc-to-openapi matches on (all `/api/v1/*` → 404 NOT_FOUND).

Current focus: #23 execution spec; latest completed: #26.
Next: #27.

#70 closed 2026-09-22: `permissionProcedure("Admin", *)` re-reads
`getUserRoleNames` per request with session fallback (proxy stays coarse,
non-privileged paths do no extra lookup); gate:
`tests/unit/instant-admin-revocation.test.ts` (4 tests); suite 34 files /
183 tests green, typecheck + typecheck:test clean, ultracite clean on touched
files (pre-existing `scripts/backfill-auth-roles.mjs` findings untouched).

#71 done 2026-09-22: Default role floor hardening — `revokeRole` rejects
revoking USER with BAD_REQUEST even for multi-role holders (irrevocable
floor; last-role guard kept), `/admin/users` gains `AdminRoleToggles`
(USER toggle always disabled, sole-membership toggle disabled, optimistic
update with revert), creation/heal convergence unchanged (register
transaction, `createUser` event, JWT heal); gates:
`tests/unit/default-role-floor.test.ts` (3 tests) +
`tests/unit/admin-role-toggles.test.tsx` (4 tests) fail-closed denial
pinned; suite 36 files / 190 tests green, typecheck + typecheck:test +
ultracite clean.

#72 done 2026-09-22: Suspended capability with preserved roles —
`User.suspendedAt DateTime?` (migration `20260922000000_user_suspended_at`),
stamped/cleared only via admin-gated `suspendUser`/`unsuspendUser`
(idempotent, self-suspend refused FORBIDDEN, roles never touched so
unsuspend restores exactly); enforcement: Credentials `authorize` returns
null, `jwt` stamps `token.suspended` (default-role heal skipped while
suspended), privileged gates (`permissionProcedure("Admin", *)`,
`adminProcedure`, `moderatorProcedure`) deny FORBIDDEN "Account is
suspended." on a fresh per-request read with session fallback, `(admin)`
guard + `proxy.ts` redirect suspended sessions away from admin paths,
suspended bearer REST owners resolve to null; `/admin/users` gains
`AdminSuspendToggle` (optimistic flip with revert); `Suspended user`
glossary term added to `CONTEXT.md`; gates: `tests/unit/suspension.test.ts`
(5 tests), suite 37 files / 195 tests green, typecheck + typecheck:test
clean, ultracite clean.

#73 done 2026-09-22 (docs only, no behavior change): `Session-freshness
rule` glossary term in `CONTEXT.md`; ADR 0007
(`0007-suspended-capability-and-admin-only-fresh-reads.md`) records the
suspend-vs-strip decision and the admin-only fresh-read tradeoff as
shipped in #70–#72; `docs/adr/README.md` index updated; typecheck clean,
`test:all` 37 files / 195 tests green.
Wayfinding map #44: research ticket #46 resolved 2026-09-19
(`docs/research/layer-violations.md`); decision tickets #45–#52 all resolved
2026-09-19 (glossary, both inventories, permissions matrix, three b1 specs,
docs-correction spec); map Decisions-so-far updated, no open tickets remain.

## Known issues / constraints

- Memory-bank API/UI usage notes (`.clinerules/api-patterns.md`,
  `.clinerules/ui-usage.md`) are intentionally kept until ADR equivalents land.
- DB split landed 2026-09-21 (uncommitted): `DATABASE_URL` = prod only,
  `DATABASE_URL_DEV` / `DATABASE_URL_TEST` optional with fallback;
  `scripts/db-with-url.mjs` + target-scoped `db:*` scripts; `.github/workflows/
  database.yml` (PR validate on ephemeral Postgres, prod deploy on merge to
  main); ADR 0006; `CONTEXT.md` DB glossary; `docs/database.md` secrets table.
  Gates: typecheck + ultracite clean, unit 162/162. Still to do: set the
  `DATABASE_URL` secret + `production` environment in GitHub before merging.
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
