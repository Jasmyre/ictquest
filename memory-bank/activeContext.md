# Active Context — ICTQuest

Current work focus for agents. Execution spec: #23 (source of truth).
Decisions frozen in `docs/adr/0001–0005` (#24 baseline, closed).

## Current focus

Lessons-index placement (2026-09-20, `main`): the index lives in the
`(app)` group on purpose — the whole `/lessons` tree needs a session.
Correction history: `93b0e0b` made that move; a first fix wrongly moved it
back to `(marketing)` (commit `02661fe`); this change restores `(app)` and
rewrites the rule in `src/routes.ts` + `src/proxy.ts`, the guard tests
(`route-guards`, `mdx-remaining`, e2e `admin-shell`), and the docs
(`architecture.md`, `auth.md`, `productContext.md`, `projectbrief.md`).
Research evidence under `docs/research/` keeps the old wording (frozen).
Gates green: typecheck + typecheck:test + ultracite clean, `test:all`
33 files / 177 tests, Playwright 15/15, prod `build` green.

Code-review follow-up (2026-09-20, uncommitted on `wip/ictquest-2.0`):
Standards fixes — shared `src/server/pagination.ts` (`pickPagination` +
`Pagination`), `src/server/prisma-errors.ts` (`isUniqueConstraintRace` +
`isMissingRecord`), `src/server/logger.ts` (test-silent `logError`/`logInfo`);
`requireUserId` narrowing in `trpc.ts` replacing all `ctx.user.id as string`;
all `as Promise` casts dropped from the four repositories (tsc verifies
shapes); new `src/server/repositories/token.ts` owning PAT persistence.
Spec fix — tRPC-only `token` router (list/create/idempotent-revoke,
owner-scoped, hash never leaves server) mounted in `root.ts`, backed by
`schemas/token.ts` + `services/token.ts`, gated by
`tests/unit/token-lifecycle.test.ts` (7 tests). Full unit green 158/158,
typecheck + typecheck:test + ultracite clean.

## Recent changes

- Slice 7 (#64, 2026-09-20): docs correction landed — `docs/architecture.md`,
  `docs/database.md`, `docs/auth.md`, `docs/api.md` rewritten from the
  template-contaminated world to ICTQuest truth (Lesson/Topic/Quiz/Progress/
  Achievement/User, implicit `_RoleToUser`, biography/`isPrivate`,
  `dashboard` router, 10 REST Operations over `me`/`lessons`/`dashboard`,
  `GET /api/v1/dashboard/{id}`), each with a before/after map and a
  deleted-example reference list; `systemPatterns.md` permissions/layering/
  caching/REST sections corrected plus a provenance section; ADR 0001/0002
  supersede notes (role-join provenance drop, dashboard rename, aspirational
  profile fields); `tests/unit/docs-truth.test.ts` spec gate (check +
  typecheck + 151 unit green). Out-of-scope leftovers per #52 stay untouched
  (operations/deployment/troubleshooting/PWA docs, frozen research evidence,
  ADR bodies).

- #24 closed 2026-09-14: ADR shell + five ADRs (`docs/adr/0001–0005` + `README.md`)
  plus published research (`docs/research/lesson-content-store.md`,
  `pwa-rest-surface.md`, `tooling-cutover.md`).
- #25 (prior ticket): memory-bank rewrite citing those ADRs; legacy ownership doc
  `.clinerules/MemoryBank.md` retired; `.clinerules/api-patterns.md` and
  `.clinerules/ui-usage.md` kept until ADR equivalents land.
- #26 (this ticket): lint/scripts/root baseline — Biome/Ultracite chain locked
  with Vitest globals swap, `scripts/dev-lan.mjs` + provisional
  `scripts/pwa-assets.mjs` adopted, `todo.ts` stub deleted, stale tsconfig
  includes dropped, LF line endings normalized.
- Wayfinder map #44: ticket "Inventory 3-tier/MVC violations and
  route-schema-permissions seams" (#46, research) resolved 2026-09-19 —
  resolution comment + close + Decisions-so-far pointer; asset
  `docs/research/layer-violations.md` (branch `research/layer-violations`).
- Wayfinder map #44: ticket "Specify dashboard rename from progress stats"
  (#50, grilling) resolved 2026-09-19 — resolution comment + close +
  Decisions-so-far pointer; decision: `dashboard.getMyDashboard` (private,
  tRPC-only) + `dashboard.getDashboardById` (public rate-limited,
  `GET /api/v1/dashboard/{id}`), legacy `/v1/users/{id}/stats` deleted,
  ADR 0005 supersede note.
- Wayfinder map #44: ticket "Specify docs correction for architecture,
  database, auth, and system patterns" (#52, grilling) resolved 2026-09-19 —
  resolution comment + close + Decisions-so-far pointer; per-file
  before/after entity maps, deleted-Post reference list, ADR 0001/0002
  supersede notes (ticket-text 0002/0005 numbering corrected), #23 alignment;
  graduated fog: cache-tag vocabulary, REST finalization, admin shell/guard
  detail, b1 test seams. Map has no open tickets remaining.

## Next steps

- #27 Migration 04 — Test harness cutover (Jest → Vitest + Playwright),
  then #29 MDX pilot, #28 auth expand, per the #23 migration order.
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

DB split (2026-09-21): prod/dev/test URLs + target-scoped scripts + CI gates
landed per grilling Q1–Q4 (all confirmed). Open: create the `DATABASE_URL`
secret and `production` environment in GitHub repo settings before the first
merge to `main` triggers `deploy-prod`; decide whether to also set a shared
`DATABASE_URL_DEV` for the team.

Role freshness (2026-09-22, grilling Q1–Q8 confirmed): role-less repair = run
`scripts/backfill-auth-roles.mjs` via `db-with-url.mjs prod` (dry-run count
first), `seed.ts` stays role-rows only; non-admin paths keep JWT-stamped
`roles[]` (re-signin/refresh to pick up changes); admin paths
(`(admin)` layout guard + `adminProcedure`/`moderatorProcedure` +
`permissionProcedure("Admin", *)`) re-read
`getUserRoleNames` per request with session fallback (#70 closed 2026-09-22:
`tests/unit/instant-admin-revocation.test.ts`, 4 tests). USER is an irrevocable
floor. Suspended split to follow-up ticket: `suspendedAt DateTime?` checked
in `jwt` + Credentials `authorize` + proxy, roles preserved for unsuspend.

#72 done 2026-09-22 (this ticket): `User.suspendedAt` + migration
`20260922000000_user_suspended_at`; admin-only `suspendUser`/`unsuspendUser`
(idempotent, self-suspend refused, roles untouched); enforcement in
`authorize`, OAuth `signIn` callback, `jwt`/`session` flag,
`privateProcedure` (flag-only) + privileged gates (fresh read + session
fallback), `(admin)` guard, `proxy.ts`, bearer REST; `AdminSuspendToggle`
on `/admin/users`; `Suspended user` glossary term in `CONTEXT.md`; suite
37 files / 195 tests green, typechecks + ultracite clean.

#73 done 2026-09-22 (docs only, no behavior change): `Session-freshness
rule` glossary term in `CONTEXT.md` (session copy everywhere, fresh
per-request read on privileged paths with session fallback); ADR 0007
records the suspend-vs-strip decision and the admin-only fresh-read
tradeoff as shipped in #70–#72; `docs/adr/README.md` index updated.
Gates: typecheck clean, `test:all` 37 files / 195 tests green.

Release-please migration (2026-09-22, grilling Q1–Q8, uncommitted):
qoomon-strict commits in `docs/commits.md` (`ops:` for pipelines, no `ci:`);
new `test.yml` (typecheck + check + test:all on Postgres 16 + build),
`pr-title.yml`, `release.yml` + configs seeded at `2.1.0`;
`database.yml` trimmed to migration validity; `standard-version` removed;
`docs/versioning.md` corrected to post-1.0 strict semver; ADR-0008.
Build fix (2026-09-22, uncommitted): `pg` node builtins leaked into the
browser bundle via `"use client"` `admin-role-toggles.tsx` → `@/lib/roles`
(dynamic `await import("@/lib/db")`); pure vocabulary split to client-safe
`src/lib/role-names.ts`, server entry re-exports, client imports the leaf.
Typecheck + build + role tests green, ultracite clean.
CI build fix (2026-09-22, uncommitted): prerender crashed on `new URL()`
because CI sets `SKIP_ENV_VALIDATION=1` with no `BASE_URL`, hitting the
`err:...` fallback in `src/app/layout.tsx`; fallback is now
`http://localhost:3000` (matches `docs/env.md`) and `test.yml` exports
`BASE_URL`/`NEXTAUTH_URL`. Upstash warnings in CI are non-fatal.
Biome scope fix (2026-09-22, uncommitted): release-please rewrites
`.release-please-manifest.json` without a trailing newline, failing
`npm run check`; bot-managed `release-please-*.json` now excluded in
`biome.json` (`check` green, 256 files).
