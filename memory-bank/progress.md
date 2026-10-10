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

- ABAC refactor (2026-09-22, uncommitted): `src/server/permissions.ts`
  rewritten to the predicate-per-role pattern (`PermissionRule`
  boolean|predicate, `PermissionDefinition`, per-resource `PERMISSIONS`
  matrix, role-union `hasPermission`/`hasActionGrant` loops) keeping the
  codebase entities (Lesson/Topic/Quiz/Progress/Achievement/User/Admin/
  Token); public lesson reads live in a `PUBLIC_GRANTS` side-table so
  anonymous `view` still passes; `PermissionUser` stays optional-fielded
  for null/role-less callers; import moved to client-safe
  `@/lib/role-names`. Gates: typecheck + typecheck:test + ultracite
  clean, `test:all` 37 files / 195 tests green.

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
- Release-please migration (2026-09-22, uncommitted): `docs/commits.md`,
  `test.yml` / `pr-title.yml` / `release.yml`, configs at `2.1.0`,
  `standard-version` removed, ADR-0008. Still to do: `git tag v2.1.0` +
  `gh release create` baseline, `npm install` to drop lock entry, delete
  obsolete `## [Unreleased]` CHANGELOG section on first release PR.
- Admin sidebar rework (2026-09-23, `ref/admin-sidebar`): `(admin)` layout
  rebuilt on the shadcn sidebar system (`MainSidebar`/`NavMain`/`NavUser`/
  `NavLogoHeader`, `ui/sidebar` + `ui/kbd`, `use-close-on-back`) with
  `AdminGuard` (fresh role/suspension re-read, redirect semantics) +
  `AdminShell`/`AdminShellAsync` PPR dynamic hole; `src/lib/shell.ts`
  (`getSectionTitle`, `mapSessionToNavUser`); `Admin guard`/`Admin shell`
  glossary terms in `CONTEXT.md`. Gates: typecheck + typecheck:test +
  ultracite clean, `test:all` 40 files / 206 tests, prod `build` green.
- Dashboard home redesign (2026-10-03, uncommitted): `(app)/page.tsx` rebuilt
  production-ready — stats grid, continue-learning hero, per-lesson path with
  progress bars, quick-links + assessment cards; `loading.tsx` + Suspense
  `DashboardSkeleton` for streaming; keeps `dashboard-stats` testids.
  Gates: typecheck + ultracite clean, progress-stats unit 8/8.
- LAN dev redirect fix (2026-10-04, uncommitted): `dev-lan.mjs` LAN-points
  `NEXTAUTH_URL`/`BASE_URL` + `AUTH_TRUST_HOST=true` (child env only),
  `auth.ts` redirect honors same-origin callback URLs, `--sw` stripped
  before forwarding to `next dev`, `dev:https:lan*` pass
  `--experimental-https`, `SwProvider` opts in via
  `NEXT_PUBLIC_SW_IN_DEV=1`, `/certificates/` gitignored. Gates:
  typecheck + ultracite clean, `test:all` 40 files / 208 tests.
- SW LAN cert-error hardening (2026-10-06, uncommitted): live SAN verified
  covering `192.168.1.27`, so PC+phone failure is untrusted CA, not a stale
  leaf. `sw-policy.ts` gains pure `isSwCertError` + `buildSwCertErrorMessage`
  (PC certmgr step first, then phone trust, SAN check, `--ip=` restart);
  `SwProvider` logs one visible `console.error` via error/unhandledrejection
  listeners instead of a raw stack; `dev-lan.mjs` re-verifies SAN after
  rebuild and forces   `ALLOW_LAN=0` with `console.error` on failure (fixes
  stale-cert-marked-valid bug) + PC trust wording. Gates: typecheck +
  biome clean, unit 36 files / 204 tests.
- PWA setup doc (2026-10-06, user-confirmed working): `docs/pwa.md` full
LAN install flow (CA, PC certmgr + phone trust, per-run `--ip=`, env
table, command matrix, cleanup); `setup.md` trimmed to summary + link.
- ADR 0009 (2026-10-06, code-review follow-up): mock `social/new` retired
deliberately (dead compose, no UGC entity per #23 out-of-scope); `/social`
is the server-rendered People list; Follow/Report/Block disabled TODOs;
LAN CA/SAN-leaf phone flow + SW-skip-on-untrusted-LAN accepted as
post-#23 follow-ups.
- Pre-commit gate (2026-10-10, uncommitted): Husky + lint-staged,
`.husky/pre-commit` runs `npx lint-staged`, staged
`*.{js,jsx,ts,tsx,json,jsonc,css}` blocked by `ultracite check`
(block-and-report, no auto-fix; typecheck stays in CI + `validate`);
`prepare: husky` installs on `npm install`. Verified: staged `var`
probe fails lint-staged (exit 1) and blocks `git commit`; clean tree
passes. Also removes stray `hook-probe.ts` (`6134fcf`) carrying that
same `var` violation. Gates: `check` 291 files clean, typecheck clean.
- Standards split (2026-10-10, uncommitted): `AGENTS.md` pointers-only + `CODING_STANDARDS.md` created + `CONTEXT.md` Standards language; no ADR.
- LAN/PWA agent-opacity fix (2026-10-10, uncommitted, docs only): `docs/pwa.md`
  "When it fails" documents the `dev-lan.mjs` SAN re-verify `console.error`
  (`Rebuilt LAN cert still does not cover <lan-ip> ...`) as the grep contract
  plus the `--sw`-without-cert guard line as the separate no-cert case; no
  code change, no new tooling.
- No-op cache purge (2026-10-10, uncommitted): systemPatterns Pattern Documentation Policy + Known patterns deleted (mechanical, ultracite-covered); production-readiness judgement moved to CODING_STANDARDS.md; AGENTS.md pointers-only (16 lines). Gate: check 291 files clean.
- Code-review fixes (2026-10-10, uncommitted, grill-with-docs: grilling +
  domain-modeling, no ADR — reversible, unsurprising): stale `stash@{0}`
  ("migrate to trpc for subtopic page") dropped — targeted deleted route
  tree, inline Prisma, missing `"use client"`, dead code; `/lessons`
  assessment chips + `aria-label` count derived from the lesson registry
  (kills 8-name fixture drift); new `PageHeaderSkeleton`
  (`src/components/page-header-skeleton.tsx`, per-site width props)
  adopted by the three loading headers. Gates: ultracite clean, typecheck
  clean, test:all 41 files / 221 tests green.
- DropDrawer rollout + visual-bug fixes (2026-10-10, committed):
  responsive dropdown/drawer primitive (`src/components/dropdrawer.tsx`,
  `src/components/ui/drawer.tsx`, deps `cn`/`radix-ui`/`vaul`,
  `dropdown-menu.tsx` rewritten on new primitives, `/social` migrated);
  desktop icon drift fixed (flex label cell), mobile x-scrollbar fixed
  (`w-[calc(100%-1rem)]`, `overflow-x-hidden` guards). Playwright-verified
  (390px + desktop). Gates: typecheck + ultracite clean, test:all 221/221.
- Active-context archive (2026-10-10): resolved items moved out of
  `activeContext.md`, condensed here (no new ADRs — all reversible, unsurprising):
  - LAN stack (2026-10-04 → 10-06): SW LAN guard (`src/sw-policy.ts`
    `shouldDisableSwRegistration`/`isLoopbackHostname`); phone SW testing
    (`scripts/gen-lan-cert.mjs`, `pwa:lan-cert`); fresh-clone `docs/setup.md`;
    `--ip=`/`--lan-ip=` override; one local CA (`scripts/gen-lan-ca.mjs`,
    `pwa:lan-ca`, phone trusts once); LAN auto-detect fix (real Wi-Fi beats
    WSL/Hyper-V virtual adapters); shared `scripts/lan-address.mjs`
    (`getLanEntries`/`getLanHost`/`getAllowedDevOrigins`,
    `tests/unit/lan-address.test.ts`); single-LAN-host `resolveLanHost()`
    (`--ip=` flag > `LAN_IP` env > auto-detect); SW cert-error visibility
    (`isSwCertError`/`buildSwCertErrorMessage`).
  - Header/nav (2026-09-23 → 10-03): server-first header rework (server
    `HeaderShell` + narrow client islands, 903-line client `NavigationBar`
    deleted); shared session-aware `SiteHeader`; ABAC Admin header entry
    (`hasPermission(user, "Admin", "manage")`); admin sidebar visual-state
    fix (exclusive deepest-prefix active matching).
  - Release-please hardening (2026-09-22): `pg` browser-bundle leak fix
    (client-safe `src/lib/role-names.ts` split); CI build fix
    (`http://localhost:3000` fallback + `BASE_URL`/`NEXTAUTH_URL` exports);
    Biome scope fix (bot-managed `release-please-*.json` excluded).
