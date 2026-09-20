# Active Context — ICTQuest

Current work focus for agents. Execution spec: #23 (source of truth).
Decisions frozen in `docs/adr/0001–0005` (#24 baseline, closed).

## Current focus

Slice 8 (#65, this ticket): final green gate — check + typecheck clean,
unit 168 + integration 17 green via `test:all` (32 files), Playwright 15/15
green (signed-out reads, owner writes fail-closed, admin gates, shared
dashboard links), prod `build` green. Fixes: Playwright `webServer`
(`npm run start`, port 3000) so `test:e2e` boots the app; REST catch-all
`endpoint` `/api/v1` → `/api` so the `/v1/*` OpenAPI paths match
(`trpc-to-openapi` strips only the endpoint prefix).

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

None for this ticket — remaining fog (per-entity service/repository/schema mapping,
cache tags, MDX migration order) is carried into execution per #23, not new
tickets.
