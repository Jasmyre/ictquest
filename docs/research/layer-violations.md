# Layer violations + route-schema-permissions seams inventory (issue #46, child of #44)

AFK fact-finding only. No decisions, no code moves. All claims cite primary sources at the surveyed revision (branch `ref/system-pattern` base, inventoried 2026-09-19).

## Scope

`ctx.db` exposures, dual Prisma singletons, direct Prisma calls in `src/server/services/*`, schema split, permissions seam, `server-only` coverage, route inventory (actual pages vs `/posts` docs claims), per-router service mapping, with target-path mapping to `src/services`, `src/data`, `src/schemas`, single `src/server/db.ts`.

## Gist (5 lines)

- `ctx.db` is injected in 2 context factories and forwarded at 26 router call sites across 4 routers (`lesson` is the clean exception).
- 2 Prisma singletons exist (`src/lib/db.ts` with `PrismaPg` adapter vs `src/server/db.ts` without); all runtime imports use `src/lib/db.ts`, zero use `src/server/db.ts`.
- No repository layer: 4 service modules call Prisma directly via injected `Db` params; only `src/data/user.ts` exists; `src/services/**` and `src/server/permissions.ts` do not exist.
- Schemas are split (`src/schemas/index.ts` auth-forms only vs `src/server/schemas/*` ×5) plus inline Zod in `user` router; `server-only` appears in exactly 1 file (`src/trpc/server.ts:1`).
- Docs claim a `posts`/`dashboard` API and `src/server/permissions.ts` + `permissionProcedure` world that does not exist; actual routes are lessons/progress/social/compliments/profile/admin.

## 1. `ctx.db` exposures

| File:line | Fact |
|---|---|
| `src/server/api/trpc.ts:17` | `import { db } from "@/lib/db"` — context tier binds the concrete singleton. |
| `src/server/api/trpc.ts:33-43` | `createTRPCContext` returns `{ db: typeof db, user, headers }`; `db` at line 40. |
| `src/server/api/v1-context.ts:3` | `import { db } from "@/lib/db"`. |
| `src/server/api/v1-context.ts:51-60` | `createV1Context` returns `{ db, user, headers }`; `db` at line 60. `resolveV1UserFromRequest` (lines 22-49) also queries `db` directly (lines 27-33). |
| `src/server/api/routers/progress.ts:55` | `listProgress(ctx.db, ctx.user.id, input)` |
| `src/server/api/routers/progress.ts:71` | `createProgress(ctx.db, ctx.user.id, input)` |
| `src/server/api/routers/progress.ts:85` | `deleteAllProgress(ctx.db, ctx.user.id)` |
| `src/server/api/routers/progress.ts:89` | `getStatsById(ctx.db, ctx.user.id)` |
| `src/server/api/routers/progress.ts:94` | `getStatsById(ctx.db, input.id)` (public rate-limited) |
| `src/server/api/routers/achievement.ts:42` | `listAchievements(ctx.db, ctx.user.id, input)` |
| `src/server/api/routers/achievement.ts:58` | `unlockAchievement(ctx.db, ctx.user.id, input)` |
| `src/server/api/routers/achievement.ts:73` | `deleteAllAchievements(ctx.db, ctx.user.id)` |
| `src/server/api/routers/admin.ts:59` | `listUsersWithRoles(ctx.db, input)` |
| `src/server/api/routers/admin.ts:64` | `grantRole(ctx.db, input, ctx.user.id)` |
| `src/server/api/routers/admin.ts:69` | `revokeRole(ctx.db, input)` |
| `src/server/api/routers/admin.ts:73` | `grantAchievementForUser(ctx.db, input)` |
| `src/server/api/routers/admin.ts:77` | `revokeAchievementForUser(ctx.db, input)` |
| `src/server/api/routers/admin.ts:81` | `resetUserProgress(ctx.db, input)` |
| `src/server/api/routers/admin.ts:83` | `listLessonContent()` — no `ctx.db` (clean seam). |
| `src/server/api/routers/admin.ts:87` | `listAchievementDefinitions(ctx.db, input)` |
| `src/server/api/routers/admin.ts:91` | `createAchievementDefinition(ctx.db, input)` |
| `src/server/api/routers/admin.ts:95` | `updateAchievementDefinition(ctx.db, input)` |
| `src/server/api/routers/admin.ts:99` | `deleteAchievementDefinition(ctx.db, input)` |
| `src/server/api/routers/user.ts:80` | `createProgress(ctx.db, ctx.user.id, input)` (`addProgress` alias) |
| `src/server/api/routers/user.ts:92` | `listProgress(ctx.db, ctx.user.id, input)` (`getUserProgress` alias) |
| `src/server/api/routers/user.ts:104` | `listAchievements(ctx.db, ctx.user.id, input)` (`getUserAchievements` alias) |
| `src/server/api/routers/user.ts:109` | `deleteAllProgress(ctx.db, ctx.user.id)` |
| `src/server/api/routers/user.ts:114` | `deleteAllAchievements(ctx.db, ctx.user.id)` |
| `src/server/api/routers/user.ts:125` | `unlockAchievement(ctx.db, ctx.user.id, input)` |
| `src/server/api/routers/user.ts:143` | `getStatsById(ctx.db, input.id)` (`getUserStatsById` alias) |
| `src/server/api/routers/user.ts:34-63` | `getUser` reads `ctx.user` only — no `ctx.db` (clean seam). |
| `src/server/api/routers/lesson.ts:34,47` | `listLessonContent()` / `getLessonContentEntry(...)` — no `ctx.db` anywhere in this router (clean seam). |

Count: 26 `ctx.db` forwarding call sites across `progress` (5), `achievement` (3), `admin` (9 + 1 clean), `user` (7 legacy aliases + `getUser` clean). `docs/architecture.md:16` and `memory-bank/systemPatterns.md:51` claim "context exposes `headers` + `user` only — no `db`" — contradicted by `trpc.ts:33-43` and `v1-context.ts:51-60` above.

## 2. Dual Prisma singletons

| File:line | Fact |
|---|---|
| `src/lib/db.ts:1-8` | `PrismaPg` adapter with `process.env.DATABASE_URL`; `createPrismaClient` logs `query` in development. |
| `src/lib/db.ts:27-31` | Singleton via `globalThis.prisma`. |
| `src/server/db.ts:1-15` | Plain `new PrismaClient({...})` with **no adapter**; same log switch. |
| `src/server/db.ts:17-24` | Singleton via `globalForPrisma.prisma`. |
| repo-wide grep `server/db` | Zero imports of `@/server/db` anywhere in `src/**`. `src/server/db.ts` is dead code at this revision. |
| `@/lib/db` importers | `src/server/api/trpc.ts:17`, `src/server/api/v1-context.ts:3`, `src/auth.ts:6`, `src/auth-events.ts:3`, `src/data/user.ts:2`, `src/lib/achievement.ts:1`, `src/lib/progress.ts:3`, `src/actions/register.ts:8`, `src/actions/update-user-name.ts:5`, `src/components/signin-button.tsx:4`, dynamic `await import("@/lib/db")` in `src/lib/roles.ts:13`. |
| `memory-bank/systemPatterns.md:8` | Claims "Prisma access is centralized in `src/server/db.ts`" — contradicted by the importer list (everything uses `src/lib/db.ts`). |
| `docs/architecture.md:14` | Claims data-access = `src/data/**` + `src/server/db.ts` — half-true: `src/data/**` is one file (`src/data/user.ts`), and `src/server/db.ts` has zero consumers. |

## 3. Direct Prisma calls in `src/server/services/*` (no repository)

Services accept an injected `Db` (`Pick<PrismaClient, ...>`) but call Prisma methods inline — there is no repository tier. `src/services/**` does not exist; `src/data/**` contains exactly one file (`src/data/user.ts`).

| File:line | Fact |
|---|---|
| `src/server/services/progress.ts:24` | `type Db = Pick<PrismaClient, "progressData" \| "user">`. |
| `src/server/services/progress.ts:40` | `db.progressData.findMany` (`listProgress`). |
| `src/server/services/progress.ts:63` | `db.progressData.findFirst` (`createProgress`). |
| `src/server/services/progress.ts:71` | `db.progressData.update` with `{ push: subtopic }`. |
| `src/server/services/progress.ts:78` | `db.progressData.create`. |
| `src/server/services/progress.ts:93` | `db.progressData.deleteMany` (`deleteAllProgress`). |
| `src/server/services/progress.ts:115` | `db.user.findUnique` with `userAchievements` + `progressData` selects (`getStatsById`). |
| `src/server/services/achievement.ts:17` | `type Db = Pick<PrismaClient, "achievement" \| "userAchievement">`. |
| `src/server/services/achievement.ts:41` | `db.userAchievement.findMany` + `include: { achievement: true }`. |
| `src/server/services/achievement.ts:60` | `db.userAchievement.deleteMany`. |
| `src/server/services/achievement.ts:79,90,108,128` | `findUnique` / `findUnique` / `create` / re-`findUnique` in `unlockAchievement` (P2002 race handled at lines 125-144). |
| `src/server/services/admin.ts:32-40` | `type Db = Pick<PrismaClient, "user" \| "role" \| "userRoleAssignment" \| "progressData" \| "achievement" \| "userAchievement">`. |
| `src/server/services/admin.ts:52` | `db.user.findUnique` (`assertUserExists`). |
| `src/server/services/admin.ts:59` | `db.userRoleAssignment.findMany` (`currentRoles`). |
| `src/server/services/admin.ts:69` | `db.user.findMany` (`listUsersWithRoles`). |
| `src/server/services/admin.ts:100,105` | `db.role.upsert` + `db.userRoleAssignment.upsert` (`grantRole`). |
| `src/server/services/admin.ts:136,158` | `db.role.findUnique` + `db.userRoleAssignment.delete` (`revokeRole`, P2025-tolerant at 161-177). |
| `src/server/services/admin.ts:204` | `grantAchievementForUser` delegates to `unlockAchievement` (achievement service) — the one service→service seam. |
| `src/server/services/admin.ts:225,234,248` | `db.achievement.findUnique` / `db.userAchievement.findUnique` / `delete` (`revokeAchievementForUser`). |
| `src/server/services/admin.ts:268` | `db.progressData.deleteMany` (`resetUserProgress`). |
| `src/server/services/admin.ts:310,330,357,391` | `db.achievement.findMany/create/update/delete` (definition CRUD). |
| `src/server/services/lesson-content.ts:29,38` | `readdirSync`/`readFileSync` + `parseLessonFrontmatter` — filesystem only, zero Prisma (clean seam by design; header comment lines 15-24). |
| `src/server/auth/personal-access-tokens.ts:4,37,54,67` | Same injected-`Db` pattern (`Pick<PrismaClient, "personalAccessToken">`): `create`/`findUnique`/`update` — auth helper, not under `services/`, listed here because `v1-context.ts:27` calls it with the global `db`. |

Direct-Prisma callers **outside** `src/server/**` (controller/presentation tier touching the client):

| File:line | Fact |
|---|---|
| `src/data/user.ts:19,38,91,108,139,220` | `db.user.findUnique/findMany`, `db.userAchievement.findMany` (`getUserByEmail`, `getUserById`, `getAllUsers`, `getAllUserAchievements`, `getUsersStats`, `getUserStats`). Only repository-like file in the repo. |
| `src/lib/achievement.ts:24,32,49` | `db.achievement.findUnique`, `db.userAchievement.findUnique/create` (`unlockUserAchievement` — duplicates `src/server/services/achievement.ts:72-124` logic). |
| `src/lib/progress.ts:54` | `db.progressData.findMany` (`getUserProgress` — duplicates `src/server/services/progress.ts:33-54`). |
| `src/actions/register.ts:30-54` | `db.$transaction` with `tx.user.create`, `tx.role.upsert`, `tx.userRoleAssignment.upsert`. |
| `src/actions/update-user-name.ts:16` | `db.user.update`. |
| `src/auth-events.ts:29` | `db.user.update` (`updateEmailVerification`). |
| `src/auth.ts:60` | `PrismaAdapter(db)`. |
| `src/components/signin-button.tsx:4,15` | Client-adjacent async server component imports `@/lib/db` and calls `db.user.update` at line 15 (presentation tier writing the DB). |
| `src/lib/roles.ts:31-58` | `getUserRoleNames`/`ensureDefaultRole` query via injected `RoleStore` or dynamic `@/lib/db` import — role seam shared by `auth.ts:54`, `auth-events.ts:36`, `data/user.ts:74`, `v1-context.ts:35`. |

## 4. Schema split

| File:line | Fact |
|---|---|
| `src/schemas/index.ts:1-12` | `LogInSchema` + `registerSchema` only; consumed by `src/actions/login.ts:7` and `src/actions/register.ts:9`. No lesson/progress/achievement/admin/user-tRPC schemas here. |
| `src/server/schemas/lesson.ts:10-34` | `lessonEntrySchema`, `listLessonsOutputSchema`, `lessonParamsSchema`, `getLessonOutputSchema`. |
| `src/server/schemas/progress.ts:3-19` | Input schemas + types; lines 28-75 output schemas (`progressRowSchema`, `list/create/deleteAll` outputs, `statsDataSchema`, `statsOutputSchema`). |
| `src/server/schemas/achievement.ts:3-13,22-51` | Input schemas + passthrough row/output schemas. |
| `src/server/schemas/admin.ts:1-72` | 10 schemas; line 2 imports `ROLE_NAMES` from `@/lib/roles` (schema→lib role-enum coupling). |
| `src/server/schemas/user.ts:10-24` | `meUserSchema` (passthrough) + `meOutputSchema`. |
| `src/server/api/routers/user.ts:66-71,84-89,96-101,118-122` | Six inline `z.object({...})` inputs (`addProgress`, `getUserProgress`, `getUserAchievements`, `unlockUserAchievement`) bypass `src/server/schemas/*`. |
| `src/server/api/routers/lesson.ts:32` | `.input(z.object({}))` inline empty object. |
| `docs/architecture.md:16` | Claims "`src/schemas/**` (Zod) is the shared controller↔service contract" — actual contract lives in `src/server/schemas/**`; `src/schemas/**` covers auth forms only, and `user` router aliases use inline Zod. |
| `memory-bank/systemPatterns.md:52` | Same claim ("Zod schemas in `src/schemas/**`") — same mismatch. |

## 5. Permissions seam

| File:line | Fact |
|---|---|
| `src/server/permissions.ts` | Does not exist (`Test-Path` False). No `hasPermission`, no `permissionProcedure`, no `ResourceData` anywhere in `src/**`. |
| `src/server/api/trpc.ts:188-196` | `requireAnyRole(roles, allowed, message)` — `hasRole`-based gate, throws `FORBIDDEN`. |
| `src/server/api/trpc.ts:205-215` | `adminProcedure` — requires `ADMIN` via `requireAnyRole(ctx.user.roles, ["ADMIN"], ...)`. |
| `src/server/api/trpc.ts:224-240` | `moderatorProcedure` — requires `MODERATOR` or `ADMIN`. Header comment (lines 217-223) notes MODERATOR has zero seed assignments; only consumer is `admin.pingModerator` (`src/server/api/routers/admin.ts:52`). |
| `src/lib/roles.ts:3-6` | `ROLE_NAMES = ["ADMIN","MODERATOR","USER"]`, `RoleName`, `DEFAULT_ROLE_NAME = "USER"`. |
| `src/lib/roles.ts:17-25` | `hasRole(roles, role)` — `roles.includes(role)`, false on nullish. |
| `src/lib/roles.ts:27-59` | `getUserRoleNames`, `ensureDefaultRole` (heal path used by `auth.ts:54`, `auth-events.ts:36`). |
| `src/lib/roles.ts:81-119` | `buildBackfillPlan` + `assertZeroWithoutDefault` (historical backfill planner). |
| `src/server/api/routers/admin.ts:47-55` | `pingAdmin`/`pingModerator` — minimal enforcement seam; all other admin procedures use `adminProcedure`. No row-level `fetch → hasPermission(record)` step anywhere. |
| `src/proxy.ts:18-28,68-76` | Edge gate: `isAdminSession` via `hasRole(roles, "ADMIN")`; `/admin` prefix requires session + ADMIN (redirects to `/auth` / `/`). Proxy holds no other role logic. |
| `src/types/next-auth.d.ts` | Declares session `roles` (session threading for the above gates). |
| `docs/architecture.md:18-25` | Claims `src/server/permissions.ts`, `hasPermission(user, resource, action, data?)`, `hasActionGrant`, `permissionProcedure("Resource","action")`, post matrix, admin `manage` grant — none exist in code. |
| `memory-bank/systemPatterns.md:12,18-33,230-258` | Same ABAC module claims (`src/server/permissions.ts`, `permissionProcedure`, `Post`/`Admin` matrices, `rest-auth.ts`, `cache-tags.ts`, `db-cache.ts`) — none of the named modules exist at this revision. |

## 6. `server-only` coverage

| File:line | Fact |
|---|---|
| `src/trpc/server.ts:1` | `import "server-only"` — the **only** such import in `src/**` (grep `server-only` hits: this line + a comment in `src/sw-policy.ts:13` explicitly noting it does *not* use `server-only`). |
| `src/server/**` (all files) | Zero `server-only` imports — including `src/server/api/trpc.ts`, `src/server/api/v1-context.ts`, all 5 routers, all 4 services, `src/server/db.ts`, `src/server/schemas/*`, `src/server/auth/personal-access-tokens.ts`. |
| `src/data/user.ts`, `src/lib/db.ts`, `src/server/db.ts`, `src/lib/roles.ts` | Zero `server-only` imports. `@/lib/db` is freely imported from a component (`src/components/signin-button.tsx:4`). |
| `memory-bank/systemPatterns.md:48,271-274` | Claims `src/services/**` + `src/data/**` are `server-only` and `src/trpc/server.tsx` is marked `server-only` — actual: no `src/services/**` dir, `src/data/user.ts` unmarked, server helper is `src/trpc/server.ts` (not `.tsx`). Test configs alias `server-only` to `tests/server-only-stub.ts` (per `memory-bank/systemPatterns.md:283`). |
| `docs/architecture.md:14` | Claims business tier is `src/services/**` (`server-only`) — neither the path nor the marker exists. |

## 7. Route inventory — actual pages vs docs `/posts` claims

Actual App Router pages (glob `src/app/**/page.tsx`):

| Group | Actual pages (URL → file) |
|---|---|
| `(marketing)` | `/` → `src/app/(marketing)/page.tsx`; `/lessons` → `src/app/(marketing)/lessons/page.tsx`; `/privacy`, `/terms` |
| `(app)` | `/profile`, `/user/[id]`, `/social`, `/social/new`, `/compliments`, `/progress`, `/settings`, `/lessons/[topic]` (`src/app/(app)/lessons/[topic]/page.tsx`), `/lessons/subtopic/[subtopic]` |
| `(admin)` | `/admin`, `/admin/lessons`, `/admin/users`, `/admin/achievements`, `/admin/progress`, `/admin/api-docs` |
| standalone | `/auth`, `/auth/error`, `/maintenance`, `/~offline` |
| API | `/api/auth/[...nextauth]`, `/api/trpc/[trpc]`, `/api/v1/[...rest]` (`src/app/api/v1/[...rest]/route.ts:1-83`), `/api/v1/openapi.json` |

Guard vocabulary (`src/routes.ts:19-39`): `publicRoutes = ["/", "/lessons", "/terms", "/privacy", "/~offline"]` (exact), `authRoutes = ["/auth", ...]`, `adminRoutes = ["/admin"]`, `apiAuthPrefix`, `publicApiPrefix`, `v1ApiPrefix`, `maintenanceRoute`. Comment block lines 1-17 documents the `/lessons`-exact vs `/lessons/*`-authed exception, enforced in `src/proxy.ts:78-86`.

Docs claims that do not match:

| Doc:line | Claim | Actual |
|---|---|---|
| `docs/api.md:10` | Tags `posts`, `dashboard`; 8 ops (`post.*` ×7 + `dashboard.getStats`); admin tRPC-only unmounted | Real tags (`src/server/api/openapi.ts:42`): `me`, `lessons`, `users`. Real ops: `user.getUser`, `progress` ×3, `achievement` ×3, `lesson` ×2, `user.getUserStatsById`. No `post`/`dashboard` router exists (`src/server/api/routers/*` = achievement, admin, lesson, progress, user). Admin is tRPC-only in practice (no OpenAPI annotations in `admin.ts`) but that is incidental, not "by construction" as docs imply. |
| `docs/api.md:41` | Public rate limit "5 req / 40s / IP" | Code (`src/server/api/trpc.ts:127-128`): `LIMIT = 10`, `WINDOW_SEC = 40`. |
| `docs/api.md:43` | "`post.getLatest` before `post.getById`" ordering gotcha | No `postRouter` exists; nothing to order. |
| `docs/api.md:9` | Outputs are `z.strictObject` | No `strictObject` in `src/server/schemas/*`; achievement/user schemas use `.passthrough()` (`achievement.ts:22-31,38-47`, `user.ts:10-19`). |
| `docs/architecture.md:36` | `(marketing)/`: `/landing`, `/maintenance`; `(app)/`: `/`, `/posts`; `(admin)/`: `/admin` | No `/landing`, no `/posts` in `src/app/**`. `/maintenance` is standalone (`src/app/maintenance/page.tsx`), not under `(marketing)/`. Actual catalog is lessons/progress/social/compliments/profile/settings/admin as tabled above. |
| `docs/architecture.md:42-44` | `cached()`/`src/lib/db-cache.ts`/`src/lib/cache-tags.ts`, post list/latest/item + dashboard stats caching, `revalidateCacheTag` | None of `db-cache.ts`, `cache-tags.ts`, post/dashboard helpers exist. Lesson caching policy actually lives in `src/lib/lessons/cache.ts:22-32` (`LESSON_LIST_REVALIDATE`, `LESSON_LIST_TAG`) + `Cache-Control` split in `src/app/api/v1/[...rest]/route.ts:24-35`. |
| `docs/architecture.md:48-50` | `permissionProcedure`, 8 post/dashboard ops, `rest-auth.ts`, `/api/openapi.json` + `/reference` | Real guards are `adminProcedure`/`moderatorProcedure`; real REST surface per `openapi.ts:35-54` + `route.ts:1-83`; dual auth lives in `v1-context.ts:22-49`; openapi JSON served at `/api/v1/openapi.json` (`src/app/api/v1/openapi.json/route.ts`), no `/reference` route. |
| `memory-bank/systemPatterns.md:112,136-146` | `page.tsx (7)`, `(marketing)` hosts `/landing`, `(app)` hosts `/` + `/posts`, `app-shell-async.tsx`/`admin-shell-async.tsx`, `nav-main.tsx`, `error-page.tsx` | Actual: 24 `page.tsx` files (table above); no `/landing`, no `/posts`; no `app-shell-async`, `admin-shell-async`, `nav-main`, `error-page`, `session-home-link` files in `src/**`. `(app)/layout.tsx` and `(admin)/layout.tsx` exist but the described PPR dynamic-hole components do not. |

## 8. Per-router service mapping

| Router | Procedures | Service module + fns | Schemas |
|---|---|---|---|
| `lesson` (`routers/lesson.ts:22-48`) | `list` (GET /v1/lessons), `get` (GET /v1/lessons/{lesson}/{subtopic}); both `publicProcedure`, no `ctx.db` | `services/lesson-content.ts`: `listLessonContent` (:52), `getLessonContentEntry` (:76), `listLessonContentEntries` (:25) — fs/MDX only | `schemas/lesson.ts` (in + out) |
| `progress` (`routers/progress.ts:41-95`) | `list`/`create`/`deleteAll` (private, REST-annotated) + `getMyStats` (private, tRPC-only) + `getStatsById` (public rate-limited, tRPC-only) | `services/progress.ts`: `listProgress` (:33), `createProgress` (:56), `deleteAllProgress` (:91), `getStatsById` (:113) | `schemas/progress.ts` |
| `achievement` (`routers/achievement.ts:28-75`) | `list`/`unlock`/`deleteAll` (all private, REST-annotated) | `services/achievement.ts`: `listAchievements` (:34), `unlockAchievement` (:72), `deleteAllAchievements` (:58) | `schemas/achievement.ts` |
| `admin` (`routers/admin.ts:46-100`) | `pingAdmin` (admin, inline), `pingModerator` (moderator, inline), `listUsers`, `grantRole`, `revokeRole`, `grantAchievement`, `revokeAchievement`, `resetProgress`, `listLessonContent` (read-only MDX, no db), `list/create/update/deleteAchievementDefinition` — all else `adminProcedure`, none REST-annotated | `services/admin.ts`: `listUsersWithRoles` (:66), `grantRole` (:97), `revokeRole` (:133), `grantAchievementForUser` (:198 → delegates to achievement `unlockAchievement`), `revokeAchievementForUser` (:219), `resetUserProgress` (:265), `listAchievementDefinitions` (:303), `createAchievementDefinition` (:325), `updateAchievementDefinition` (:352), `deleteAchievementDefinition` (:386); plus `services/lesson-content.ts:listLessonContent` for `listLessonContent` | `schemas/admin.ts` |
| `user` (`routers/user.ts:22-145`) | `getUser` (GET /v1/me, session-shape inline, no db); legacy aliases `addProgress`, `getUserProgress`, `getUserAchievements`, `deleteAllUserProgress`, `deleteAllUserAchievements`, `unlockUserAchievement` (all private, tRPC-only, inline Zod); `getUserStatsById` (GET /v1/users/{id}/stats, public rate-limited) | Aliases reuse `services/progress.ts` (`createProgress`, `listProgress`, `deleteAllProgress`, `getStatsById`) and `services/achievement.ts` (`listAchievements`, `deleteAllAchievements`, `unlockAchievement`); `getUser` has no service | `schemas/progress.ts:statsByIdSchema/statsOutputSchema` (stats only) + `schemas/user.ts:meOutputSchema` (getUser); alias inputs are inline `z.object` (lines 66-71, 84-89, 96-101, 118-122) |

Wiring root: `src/server/api/root.ts:24-30` mounts all five routers; `createCaller` at line 41; consumed RSC-side by `src/trpc/server.ts:15-30` and REST-side by `src/app/api/v1/[...rest]/route.ts:54-63` via `createV1Context`.

## 9. Target-path mapping (for the future map ticket — no moves made here)

| Current | Target | Notes |
|---|---|---|
| `src/lib/db.ts` (adapter singleton, all consumers) | single `src/server/db.ts` | Keep the `PrismaPg`-adapter construction; delete the dead plain-client copy now at `src/server/db.ts:1-25`; repoint the 11 importer sites. |
| `src/server/services/progress.ts`, `achievement.ts`, `admin.ts` (Prisma-inline, injected `Db`) | `src/services/*` (business rules, `server-only`, no Prisma import) + `src/data/*` (repositories, all Prisma) | Split each service fn: rule/validation stays in `src/services`, `db.<model>.*` calls move to `src/data` repos. `lesson-content.ts` (fs-only) maps to `src/services` as-is. `personal-access-tokens.ts` maps to `src/data` (PAT store) + thin service. |
| `src/data/user.ts` (only repo-like file) | `src/data/*` (one module per aggregate: user, progress, achievement, admin/roles, PAT) | Already closest to target; needs `server-only` + removal of stats-duplication with `services/progress.ts:113-167`. |
| `src/lib/achievement.ts`, `src/lib/progress.ts` (`db`-direct duplicates) | delete after routing callers to `src/services`/`src/data` | Duplicate `unlockAchievement` / `getUserProgress` logic. |
| `src/actions/register.ts:30-54`, `src/actions/update-user-name.ts:16`, `src/auth-events.ts:29`, `src/components/signin-button.tsx:15` | controllers call `src/services`, never `db` | Same for `src/server/api/v1-context.ts:27-33` (resolve via service/repo, not inline `db.user`). |
| `src/server/api/trpc.ts:33-43` + `v1-context.ts:51-60` (`db` in context) | context exposes `headers` + `user` only | Routers then cannot forward `ctx.db` (26 sites in §1 become service calls). |
| `src/server/schemas/*` (5 files) + `src/schemas/index.ts` (auth forms) + inline Zod in `routers/user.ts` | single `src/schemas/*` contract | Consolidate; `admin.ts:2` role-enum import follows `ROLE_NAMES` to its new home. |
| `src/server/api/trpc.ts:188-240` (`requireAnyRole`/`adminProcedure`/`moderatorProcedure`) + `src/lib/roles.ts` (`hasRole`, role CRUD) | single `src/server/permissions.ts` (`server-only`) | As `docs/architecture.md:18-25` already describes (module does not exist yet). `proxy.ts:18-28` edge check consumes it. |
| `src/trpc/server.ts:1` (lone `server-only`) | `server-only` on all of `src/services/*`, `src/data/*`, `src/server/db.ts`, `src/schemas/*`-adjacent server contract | Closes the `signin-button.tsx:4` presentation→DB import seam. |
| Actual routes (§7 table) | docs + `memory-bank/systemPatterns.md` route/API/caching sections | `/posts`, `/landing`, `/dashboard`, `post.*`, `permissionProcedure`, `rest-auth.ts`, `db-cache.ts` claims have no code counterpart. |

## Sources (primary, repo-local)

- `src/server/api/trpc.ts`, `src/server/api/v1-context.ts`, `src/server/api/root.ts`, `src/server/api/openapi.ts`, `src/server/api/routers/{lesson,progress,achievement,admin,user}.ts`
- `src/server/services/{progress,achievement,admin,lesson-content}.ts`, `src/server/auth/personal-access-tokens.ts`, `src/server/db.ts`, `src/server/schemas/{lesson,progress,achievement,admin,user}.ts`
- `src/lib/db.ts`, `src/lib/roles.ts`, `src/lib/achievement.ts`, `src/lib/progress.ts`, `src/lib/lessons/cache.ts`, `src/data/user.ts`, `src/schemas/index.ts`
- `src/auth.ts`, `src/auth-events.ts`, `src/actions/{register,login,update-user-name}.ts`, `src/components/signin-button.tsx`, `src/proxy.ts`, `src/routes.ts`, `src/trpc/server.ts`, `src/env.js`, `src/app/api/v1/[...rest]/route.ts`
- `src/app/**/page.tsx` glob (24 files), `src/app/**/route.ts`, `src/types/next-auth.d.ts`
- `docs/api.md`, `docs/architecture.md`, `CONTEXT.md`, `memory-bank/systemPatterns.md`, `memory-bank/activeContext.md`
- Issue #46 body (question text); repo `Jasmyre/ictquest` via `gh issue view 46`
