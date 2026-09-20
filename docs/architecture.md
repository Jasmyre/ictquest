# Architecture

Three-tier + MVC. Upper tiers never skip past the next one (routers must not touch Prisma).

```text
App Router → proxy.ts → NextAuth / tRPC → services → repositories → Postgres
```

| MVC | Tier | Location | Responsibility |
|---|---|---|---|
| View | Presentation | `src/app/**`, `src/components/**`, `src/hooks/**` | Rendering, interaction, client state |
| Controller | Request boundary | `src/server/api/routers/**`, `src/actions/**`, NextAuth callbacks | Validate input, enforce auth/ownership, call services |
| Model (business) | Business logic | `src/server/services/**` (`server-only`) | Domain rules, hashing, result codes |
| Model (persistence) | Data access | `src/server/repositories/**`, `src/lib/db.ts` | Prisma queries only |

`src/server/schemas/**` (Zod) is the shared controller↔service contract — one
schema module per canonical entity (lesson, topic, quiz, progress, achievement,
user, dashboard, admin). The tRPC context exposes `headers` + `user` + `db`
(single shared client from `src/lib/db.ts`); routers reach persistence only by
passing `db` into service calls, never by inline Prisma queries.

Canonical entities: Lesson, Topic, Quiz (standalone), Progress, Achievement,
User. Compliments is a page only. Lesson content lives in versioned MDX files
in git, not in Prisma — the lesson/topic/quiz triples read files, while
progress/achievement/user triples read Postgres. The example resource from the
template era is deleted everywhere with no replacement (see "Deleted-example
reference list" below).

## Authorization (ABAC)

- Module: `src/server/permissions.ts` (`server-only`). Roles `ADMIN` /
  `MODERATOR` / `USER` (implicit many-to-many `_RoleToUser`, union of grants).
- Engine: `hasPermission(user, resource, action, data?)` (row-level; ownership
  predicates deny when `data` absent) + `hasActionGrant` (coarse precheck for
  the guard).
- Controller pattern: `permissionProcedure("Resource", "action")` → fetch
  record → `hasPermission(..., record)` → delegate to service. Missing records
  answer `FORBIDDEN` (anti-probing).
- ICTQuest matrix: Lesson/Topic/Quiz reads public; Progress writes
  owner-scoped; Achievement catalog `manage` is `ADMIN`-only while per-learner
  grants are owner-scoped; User profile reads/writes owner-scoped with
  biography redaction for private profiles; `dashboard.getMyDashboard` is a
  private owner read (tRPC-only) and `dashboard.getDashboardById` is a public
  rate-limited by-id read that never leaks biography; `Admin.manage` granted to
  `ADMIN` only; token lifecycle is owner-scoped and idempotent on revoke.
- Session threading: user reads include `roles` via the implicit join; JWT
  callback stamps `token.roles`; session exposes `session.user.roles`.
  Biography and privacy flags never enter tokens.
- Exceptions (documented, keep): dashboard visibility scoping lives in the
  progress/dashboard service (owner-private vs public-by-id share-safe shape);
  admin self-demotion (`ADMIN` removing its own `ADMIN` role) is a service
  `FORBIDDEN` in the role-revocation path.

## Routing boundary (`src/proxy.ts`, `src/routes.ts`)

- `proxy.ts` (not `middleware.ts`) runs first: maintenance gate → Auth.js
  routes → versioned-REST bypass (`/api/v1/*` answers its own 401/403/404 via
  `createV1Context`) → public marketing/auth/admin rules → everything else
  requires login.
- Vocabulary in `src/routes.ts`: `publicRoutes` (`/`, `/terms`,
  `/privacy`, `/~offline`), `authRoutes`, `apiAuthPrefix`,
  `publicDashboardPrefix` (`/dashboard` share links bypass the session guard),
  `adminRoutes`, `DEFAULT_LOGIN_REDIRECT=/`.
- `config.matcher` stays an inline static string (Next parses it at build
  time). The OpenAPI Document lives at `/api/v1/openapi.json`; admin-only API
  docs render at `/admin/api-docs` (never a public bundle).

## Route groups & PPR

- `(marketing)/`: `/`, `/terms`, `/privacy`.
  `(app)/`: authed shell (lessons index, lesson details, lesson subtopic,
  progress, achievements, profile, settings, social).
  `(admin)/`: `/admin/*` guarded shell. Shell-less: `/auth/*`, `/maintenance`,
  `/~offline` fallback, `/dashboard/[id]` public share page.
- `cacheComponents: true` + PPR: static shells prerender; session-aware
  subtrees sit in `<Suspense>` after `await connection()` + `await auth()`.
  Never call `auth()` in a layout directly.
- Fallbacks are real shells (never `null` — blank-frame on soft-nav), and
  dashboard share links always read from the network, never from cache.

## Caching

- Lesson content is file-backed and versioned in git; per-user reads
  (progress, dashboard, grants, profile) are always fresh — dashboard reads are
  network-only and never precached by the service worker.
- `Cache-Control`: the static Document (`/api/v1/openapi.json`) is
  `public, max-age=3600, s-maxage=3600`; per-user Operation responses are
  `private, no-store` at the `/api/v1` catch-all.
- Client `staleTime: 30s` for lesson reads; dashboard queries never go stale —
  they refetch on every share-link visit.

## tRPC + REST

- `src/server/api/trpc.ts`: `publicProcedure` / `publicRateLimitedProcedure`
  (10 req/40s/IP, production-only, dev-skipped) / `privateProcedure` /
  `permissionProcedure(resource, action)` plus `adminProcedure` /
  `moderatorProcedure` role gates.
- Routers delegate to `src/server/services/**`, validate with Zod from
  `src/server/schemas/**`, export `AppRouter`. Server caller via
  `createCaller`; client via `httpBatchStreamLink` +
  `useSuspenseQuery`/`useMutation`.
- REST mount (`src/server/api/openapi.ts`, `src/app/api/v1/[...rest]/route.ts`):
  10 Operations with `z.strictObject` outputs, ISO datetimes, `/api/v1`
  prefix, tags `me` / `lessons` / `dashboard` (3 achievement + 3 progress + 1
  user + 2 lesson + 1 dashboard-by-id over `GET /api/v1/dashboard/{id}`). `dashboard.getMyDashboard` stays
  tRPC-only; admin and token lifecycle stay tRPC-only. Dual auth in
  `src/server/api/v1-context.ts` (Bearer-first, fail-closed). Document at
  `/api/v1/openapi.json`, admin-only UI at `/admin/api-docs`.

Full living detail: `memory-bank/systemPatterns.md`. Domain terms: `CONTEXT.md`.

## Per-file before/after entity map (Slice 7, #64)

| Area | Before (template-contaminated) | After (ICTQuest truth) |
|---|---|---|
| Authorization | Example-resource matrix + list-visibility exception | ICTQuest matrix above + dashboard visibility-scoping exception |
| Routing | Old doc/reference paths, landing redirects | `/api/v1/openapi.json`, admin-only `/admin/api-docs`, `/auth` + `/` redirects, `/~offline` fallback |
| Route groups | Old marketing/app catalog | Marketing catalog above + `/dashboard/[id]` share page |
| Caching | Coarse-tag cache lib, 10s window, write fan-out invalidation | File-backed lessons, fresh per-user reads, dashboard network-only |
| tRPC+REST | 8 example-resource Operations, old dual-auth module, latest-before-byId ordering | 10 Operations, `v1-context.ts`, no ordering gotcha |

## Deleted-example reference list

This rewrite removes every example-resource entity claim from this file: the
ABAC matrix row, the list-visibility exception, the old app-catalog route, the
list/latest/item cache claims, the write-invalidation sites, and the
8-Operation dual-auth + ordering notes. The resource is deleted in code with
no replacement; nothing here reintroduces it.
