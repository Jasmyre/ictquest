# Research: Inventory cache, REST, and PPR shells (#47, child of #44)

AFK fact-finding only — no decisions. All claims pinned to source files read 2026-09-19 on branch `research/cache-rest-ppr`.

## 1. Cache: wrappers, tags, invalidation

**Truth: there is no `unstable_cache`/`cached()` layer and no tag namespace.**

- `src/lib/db-cache.ts` — **does not exist** (`Test-Path` → False).
- `src/lib/cache-tags.ts` — **does not exist** (`Test-Path` → False).
- The only cache-policy module is `src/lib/lessons/cache.ts`: three exported constants only, no wrappers —
  `LESSON_LIST_REVALIDATE = 3600` (`src/lib/lessons/cache.ts:23`),
  `LESSON_READ_STATIC = true` (`:26`), `PROGRESS_WRITE_FRESH = true` (`:29`),
  `LESSON_LIST_TAG = "lesson-list"` (`:32`). Its header comment states progress reads/writes run uncached (`:12-15`).
- `"use cache"` call sites (Cache Components, `cacheComponents: true` in `next.config.ts:11`):
  - `src/app/(marketing)/lessons/page.tsx:15-16` — `"use cache"` + `cacheLife("hours")`, reads static `lessons` registry only.
  - `src/app/layout.tsx:111` — `"use cache"` root layout (fonts/providers only).
  - `src/app/(app)/lessons/[topic]/page.tsx:147` — `"use cache"` in `StaticLessonHeader` (title/description strings only); uncached `Renderer` reads `api.user.getUserProgress` fresh (`:28`, `:65-75`).
  - `src/app/(app)/lessons/subtopic/[subtopic]/page.tsx:32` — `"use cache"`.
  - `src/app/(app)/social/new/page.tsx:27-28` — `"use cache"` + `cacheLife("minutes")`.
- Invalidation call sites in `src/`: **zero** `revalidateTag` / `revalidateCacheTag` / `updateTag` calls (grep over `src/` returns only a comment in `src/auth-events.ts:10-11` explicitly saying ictquest has *no* cache-tag namespace and *no* repository layer). The single real invalidation is `revalidatePath("/profile")` in `src/actions/update-user-name.ts:3,23`. Test seam `tests/next-cache-stub.ts:1-21` stubs `revalidatePath/revalidateTag/cacheLife/cacheTag/updateTag/unstable_cache`.
- `src/auth-events.ts:6-26` confirms the adaptation: template's `revalidateCacheTag(ADMIN_USERS_TAG / DASHBOARD_STATS_TAG)` deliberately dropped; `linkAccount` verifies email, `createUser` converges on default `USER`.

**Docs-claimed (Post contamination, all false against current tree):** `docs/architecture.md:42-43`, `docs/operations.md:13-22`, `docs/database.md:26`, `memory-bank/systemPatterns.md:179-190,225-227` describe `cached()` over `unstable_cache(fn, keyParts, { tags, revalidate: 10 })`, coarse tags `posts:list, posts:item, dashboard:stats, admin:users, users:by-id`, and `revalidateCacheTag(tag)` wrapping `revalidateTag(tag, "max")`. None of the named files, tags, or call sites exist.

## 2. REST Operations inventory (`/api/v1`)

Catch-all `src/app/api/v1/[...rest]/route.ts:54-83` serves `appRouter` via `createOpenApiFetchHandler` with `createV1Context`, endpoint `/api/v1`. Cache split at `:24-35`: lesson paths → `public, s-maxage=3600, stale-while-revalidate=86400`; everything else → `private, no-store`.

10 annotated Operations (OpenAPI meta present; admin has none by construction):

| # | Method + path | Procedure | Tags | Protect | Source |
|---|---|---|---|---|---|
| 1 | `GET /v1/lessons` | `lesson.list` | `lessons` | public | `src/server/api/routers/lesson.ts:23-34` |
| 2 | `GET /v1/lessons/{lesson}/{subtopic}` | `lesson.get` | `lessons` | public | `lesson.ts:36-47` |
| 3 | `GET /v1/me/progress` | `progress.list` | `me` | true | `progress.ts:42-56` |
| 4 | `POST /v1/me/progress` | `progress.create` | `me` | true | `progress.ts:58-72` |
| 5 | `DELETE /v1/me/progress` | `progress.deleteAll` | `me` | true | `progress.ts:74-85` |
| 6 | `GET /v1/me/achievements` | `achievement.list` | `me` | true | `achievement.ts:29-43` |
| 7 | `POST /v1/me/achievements/unlock` | `achievement.unlock` | `me` | true | `achievement.ts:45-59` |
| 8 | `DELETE /v1/me/achievements` | `achievement.deleteAll` | `me` | true | `achievement.ts:61-74` |
| 9 | `GET /v1/me` | `user.getUser` | `me` | true | `user.ts:23-32` |
| 10 | `GET /v1/users/{id}/stats` | `user.getUserStatsById` | `users` | public + rate-limited | `user.ts:128-144` |

tRPC-only (no OpenAPI meta, excluded from Document): all of `adminRouter` (`src/server/api/routers/admin.ts:46-100` — `pingAdmin/pingModerator/listUsers/grantRole/revokeRole/grantAchievement/revokeAchievement/resetProgress/listLessonContent/list-create-update-deleteAchievementDefinition`), `progress.getMyStats/getStatsById` (`progress.ts:87-94`, note `getStatsById` is the service behind the public `user.getUserStatsById` alias), and `user.*` aliases (`addProgress/getUserProgress/getUserAchievements/deleteAllUserProgress/deleteAllUserAchievements/unlockUserAchievement`, `user.ts:65-126`). `src/server/api/root.ts:24-30` confirms the five routers and documents: no `dashboard` router, no `post` router (deleted stub). Prisma has no `Post`/`Lesson` models — `model User/ProgressData/Account/Achievement/UserAchievement/Role/UserRoleAssignment/PersonalAccessToken` (`prisma/schema.prisma`).

Auth (`src/server/api/v1-context.ts:22-61`): Bearer-first, fail-closed. Presented `Authorization: Bearer` → `verifyPersonalAccessToken` (SHA-256 hash-only store, expiry + `revokedAt` enforced, `lastUsedAt` best-effort — `src/server/auth/personal-access-tokens.ts:49-89`, token format `ictq_` + 32 random bytes `:12,26-28`); invalid Bearer returns `{ user: null }` **without** consulting cookies (`v1-context.ts:44`). No Bearer → cookie/JWT session via `auth()` (`:47-48`). Same `roles[]` resolve on both paths (`:35-41`). Batch tRPC stays cookie-only (`:20-21`, `src/server/api/trpc.ts:33-43`). Rate limit is 10 req / 40 s / IP, production-only (`src/server/api/trpc.ts:127-162`) — `docs/api.md:41` claims 5 req / 40 s (drift).

## 3. Document generation + serving

- Builder `src/server/api/openapi.ts:35-55`: `generateOpenApiDocument(appRouter, { title "ICTQuest API", version "v1", tags ["me","lessons","users"], securitySchemes { bearerAuth http/bearer, cookieAuth apiKey/authjs.session-token } })`. **Generated per request**, not once at module load: `GET` handler resolves base URL from the request then calls `buildOpenApiDocument` (`src/app/api/v1/openapi.json/route.ts:16-24`).
- Served at **`GET /api/v1/openapi.json`** (no auth, `Cache-Control: public, max-age=3600, s-maxage=3600`). There is **no** `src/app/api/openapi.json/route.ts` and **no** `src/app/reference/route.ts` (`Test-Path` → False both).
- Reference UI is admin-gated at **`/admin/api-docs`** (`src/app/(admin)/admin/api-docs/page.tsx:1-32`): `"use client"` `ScalarDocs` lazy-imports `@scalar/api-reference` in `useEffect`, inside `<Suspense fallback="Loading API reference…">`. `src/sw-policy.ts:17-23` confirms: no `/reference` route; static contract is `/api/v1/openapi.json`, precached (`:45-50`); every other `/api/v1` Operation is network-only (`:52-58,122-133`, exact-allowlist wins for the JSON).

**Docs-claimed (Post contamination):** `docs/api.md:7-10` (`GET /api/openapi.json`, `GET /reference` Scalar public, tags `posts, dashboard`, 8 Operations `post.*×7 + dashboard.getStats`), `docs/architecture.md:29-30,50` (`/api/openapi.json`, `/reference`, `LANDING_PATH`, 8 post/dashboard Operations, `post.getLatest`-before-`getById` ordering, dual auth in `rest-auth.ts` — file does not exist), `docs/operations.md:28`, `docs/deployment.md:29-32`, `docs/pwa.md:24`, `memory-bank/systemPatterns.md:250-257` (`z.strictObject` outputs, one tag per router `posts/dashboard`, `src/app/api/openapi.json/route.ts`, `src/app/reference/route.ts`, `rest-auth.ts`). All paths/tags/counts are stale; current tags are `me/lessons/users`, current paths are the 10 in §2.

## 4. Proxy + routes vocabulary

- `src/proxy.ts:30-89`: maintenance-bypass → maintenance-redirect → `apiAuthPrefix` bypass → `isPublicApiRoute` bypass → **`isV1ApiRoute` bypass** (`:54-58`, REST answers its own 401/403/404) → auth-route redirect-if-logged-in → admin (logged-in check → `/auth`, ADMIN-role check → `/`, else pass) → exact-public → require-login → `/auth`. Matcher `src/proxy.ts:91-95` is the inline static string excluding `_next`/asset extensions.
- `src/routes.ts:19-86` truth: `publicRoutes = ["/", "/lessons", "/terms", "/privacy", "/~offline"]` (exact match; `/lessons` exact-public, `/lessons/*` authed — `:78-80` in proxy comment); `authRoutes = ["/auth", "/auth/error", "/api/auth/callback/google"]`; `adminRoutes = ["/admin"]`; `apiAuthPrefix = "/api/auth"`; `publicApiPrefix = "/api/public"`; `v1ApiPrefix = "/api/v1"`; `maintenanceRoute = "/maintenance"`; `DEFAULT_LOGIN_REDIRECT = "/"`. Helpers `isPublicRoute/isAuthRoute/isAdminRoute/isMaintenanceBypass/isPublicApiRoute/isV1ApiRoute`. **No** `LANDING_PATH`, **no** `homePathFor`, **no** `/landing`, `/offline`, `/reference` in code.

**Docs-claimed:** `docs/architecture.md:29-30`, `docs/auth.md:26`, `memory-bank/systemPatterns.md:133` cite `LANDING_PATH`, `homePathFor`, public set (`/landing`, `/maintenance`, `/offline`, `/reference`), `→ /landing` redirects. Code redirects to `/auth` and `/`, fallback is `/~offline`.

## 5. PPR dynamic holes

- `cacheComponents: true` (`next.config.ts:11`). Real holes (all `<Suspense>`, verified by grep):
  - `(admin)/layout.tsx:80-101` — static sidebar shell prerenders; `AdminGuard` (`await auth()`, role check, `redirect("/auth"|"/")`) streams inside `<Suspense fallback="Checking admin access…">`.
  - `(app)/layout.tsx:19-26` — `<Suspense>` around static `NavigationBar` (no `auth()` read; nav items are constants).
  - `(app)/lessons/[topic]/page.tsx:16-20` — `<Suspense fallback={<PageSkeleton/>}>` around `Fetcher`, which awaits per-user progress fresh.
  - `(app)/lessons/subtopic/[subtopic]/page.tsx:13-15` — `<Suspense fallback={<Skeleton/>}>`.
  - Admin pages (`admin/achievements|users|lessons|progress`, `admin/api-docs`) each wrap content in `<Suspense>` with text fallbacks; also `(app)/settings`, `(app)/progress`, `(app)/user/[id]`, `(app)/compliments`, landing hero.
  - `HydrateClient` exists (`src/trpc/server.ts:27-30`, `createHydrationHelpers(caller, getQueryClient)` over `createTRPCContext` reading `headers()` — `:15-24`) and is the streaming-compatible hydration seam.
- **Do not exist**: `src/components/app-shell-async.tsx`, `admin-shell-async.tsx`, `session-home-link.tsx`, `admin-gate.tsx`, `MainSidebar`, `AppShell/AdminShell` (`Test-Path`/`glob` → none; only references are prose in `memory-bank/systemPatterns.md:117-144,273` and `docs/architecture.md:37-38`).
- Root layout `SwProvider` comment confirms the pattern rationale (`src/components/pwa/sw-provider.tsx:9`, `src/app/layout.tsx:96-105`).

## 6. Client staleTime / SuperJSON dehydration

- `src/trpc/query-client.ts:7-25`: `staleTime: 30_000` (30 s), `dehydrate.serializeData = SuperJSON.serialize`, `shouldDehydrateQuery = defaultShouldDehydrateQuery || status === "pending"`, `hydrate.deserializeData = SuperJSON.deserialize`. `src/trpc/react.tsx:56` sets `transformer: SuperJSON`; `src/server/api/trpc.ts:56` matches server-side.
- **Docs-claimed:** `docs/architecture.md:44`, `docs/operations.md:13`, `memory-bank/systemPatterns.md:221` claim client `staleTime: 10s` matching a 10 s server window. Truth is 30 s client vs hourly lesson cache / no-store per-user split — no 10 s window anywhere in code.

## 7. Contamination table: current vs docs-claimed

| Area | Current truth (code) | Docs claim (Post-era) | Verdict |
|---|---|---|---|
| Cache wrapper | none; `"use cache"` + `cacheLife` per page | `cached()` over `unstable_cache` in `src/lib/db-cache.ts`, 10 s | **Post contamination** — files absent |
| Cache tags | `LESSON_LIST_TAG = "lesson-list"` only | `posts:list, posts:item, dashboard:stats, admin:users, users:by-id` in `src/lib/cache-tags.ts` | **Post contamination** — file absent, no tag consumers |
| Invalidation | `revalidatePath("/profile")` only | `revalidateCacheTag(tag)` on post/role/sign-up writes | **Post contamination** — zero call sites; `auth-events.ts` documents removal |
| REST Operations | 10: `lesson.*×2, progress.*×3, achievement.*×3, user.getUser, user.getUserStatsById`; tags `me/lessons/users` | 8: `post.*×7 + dashboard.getStats`; tags `posts/dashboard` | **Post contamination** — `post`/`dashboard` routers and Prisma `Post` model gone |
| Document path | `GET /api/v1/openapi.json` (per-request build) | `GET /api/openapi.json` (once at module load) | **Post contamination** — old route absent |
| Reference UI | admin-only `/admin/api-docs` (client-lazy Scalar) | public `GET /reference` (Scalar) | **Post contamination** — route absent, SW policy confirms |
| Auth module | `src/server/api/v1-context.ts`, Bearer-first fail-closed | `rest-auth.ts` dual auth | **Post contamination** — file absent |
| Routes vocab | public `[ sorta /, /lessons, /terms, /privacy, /~offline ]`, no `LANDING_PATH`/`homePathFor` | `LANDING_PATH`, `homePathFor`, `/landing`, `/offline`, `/reference` | **Post contamination** — names absent from `src/routes.ts` |
| PPR shells | `AdminGuard` + per-page `<Suspense>` + `HydrateClient` | `AppShellAsync`, `AdminShellAsync`, `SessionHomeLink`, `AdminGate`, `MainSidebar` | **Post contamination** — components absent |
| Client staleTime | 30 s (`query-client.ts:13`) | 10 s matching server | **Drift** — no 10 s window in code |
| Rate limit | 10 req / 40 s / IP, prod-only (`trpc.ts:127-128`) | 5 req / 40 s (`docs/api.md:41`) | **Drift** |
| SW precache | `/~offline, /maintenance, /manifest.webmanifest, /api/v1/openapi.json` (`sw-policy.ts:45-50`) | `/offline`, `/api/openapi.json`, `/reference` (`docs/pwa.md:24`, `docs/deployment.md:41`) | **Post contamination** |

## Sources (primary, in-tree)

Cache: `src/lib/lessons/cache.ts`, `src/app/(marketing)/lessons/page.tsx:1-16`, `src/app/layout.tsx:106-136`, `src/app/(app)/lessons/[topic]/page.tsx`, `src/app/(app)/lessons/subtopic/[subtopic]/page.tsx`, `src/app/(app)/social/new/page.tsx:10,27-28`, `src/auth-events.ts`, `src/actions/update-user-name.ts`, `tests/next-cache-stub.ts`, `next.config.ts`.
REST/auth: `src/server/api/root.ts`, `src/server/api/routers/{lesson,progress,achievement,user,admin}.ts`, `src/server/api/v1-context.ts`, `src/server/auth/personal-access-tokens.ts`, `src/server/api/trpc.ts`, `src/app/api/v1/[...rest]/route.ts`, `prisma/schema.prisma`.
Document: `src/server/api/openapi.ts`, `src/app/api/v1/openapi.json/route.ts`, `src/app/(admin)/admin/api-docs/page.tsx`, `src/sw-policy.ts`.
Routing/PPR/client: `src/proxy.ts`, `src/routes.ts`, `src/app/(admin)/layout.tsx`, `src/app/(app)/layout.tsx`, `src/trpc/server.ts`, `src/trpc/query-client.ts`, `src/trpc/react.tsx`, `src/components/pwa/sw-provider.tsx`.
Contaminated docs (not truth): `docs/api.md`, `docs/architecture.md`, `docs/operations.md`, `docs/database.md`, `docs/auth.md`, `docs/pwa.md`, `docs/deployment.md`, `memory-bank/systemPatterns.md`.
