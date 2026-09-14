# Research: PWA + versioned REST/OpenAPI surface (ICTQuest)

- Canonical path: `docs/research/pwa-rest-surface.md` (this file).
- Source: throwaway branch `research/pwa-rest-surface`, scratch file
  `.scratch/ictquest-structure-migration/research-pwa-rest-surface.md` (not merged; do not read scratch paths at runtime).
- Wayfinder: #16 map, ticket #21 (PWA REST surface). Spec: #23.
- Date: 2026-09-14. Repo state: Next.js 16.0.7 (`cacheComponents: true`), React 19,
  tRPC 11.5.0, Zod 4.1.5, Auth.js v5 beta (JWT strategy + PrismaAdapter), Prisma 7 + Postgres.
  No `serwist`, `trpc-to-openapi`, `@scalar/*`, or `manifest.*` in the tree today.
- Primary sources: Serwist Next.js docs (`serwist.pages.dev/docs/next/`), Next.js PWA guide
  (`nextjs.org/docs/app/guides/progressive-web-apps`), `mcampa/trpc-to-openapi` README + npm
  `trpc-to-openapi@3.3.0`, tRPC OpenAPI (alpha) docs (`trpc.io/docs/openapi`).

## 1. Current-state inventory (what exists today)

- `package.json`: no PWA or OpenAPI deps. Relevant pins: `next ^16.0.7`, `@trpc/server ^11.5.0`,
  `zod ^4.1.5`, `next-auth ^5.0.0-beta.30`.
- `next.config.ts`: plain `NextConfig`, no `withSerwist` wrapper; `cacheComponents: true`, no SW build output.
- `src/app/layout.tsx`: `metadata` has SEO/OpenGraph only — no `manifest`, `appleWebApp`, `icons`, or
  `viewport.themeColor`; no `SerwistProvider`. It is an async cached root layout, so any per-request PWA
  head tags must live in a non-cached segment, not here.
- `src/app/maintenance/page.tsx`: static downtime card. Reusable visual language for an offline page, but it
  is a server-down message, not an offline fallback — keep both, do not conflate.
- tRPC (`src/server/api/root.ts`): exactly two routers — `post` (3 procedures: `hello`, `create`, `getLatest`)
  and `user` (8 procedures: `getUser`, `addProgress`, `getUserProgress`, `getUserAchievements`,
  `deleteAllUserProgress`, `deleteAllUserAchievements`, `unlockUserAchievement`, `getUserStatsById`).
  HTTP entry is batch-only at `src/app/api/trpc/[trpc]/route.ts` (`fetchRequestHandler`, GET+POST).
- Context (`src/server/api/trpc.ts`): `createTRPCContext({ headers })` resolves `user` via `auth()`
  (cookie/JWT session) only. No bearer/PAT path exists. Rate limiting is Redis-backed for public procedures.
- Legacy REST (`src/app/api/**/route.ts`, ~12 files): unversioned duplicates — `/api/progress` (GET/POST/DELETE),
  `/api/progress/[id]` (PATCH), `/api/achievements` (POST unlock), `/api/user-achievements`, `/api/get-user-id`,
  `/api/get-users-stats`, plus `public/`-prefixed variants. Cookie-session only, no versioning, no OpenAPI.
- Prisma (`prisma/schema.prisma`): `User`, `ProgressData` (topic + `String[]` subtopics), `Achievement`,
  `UserAchievement` (unique `[userId, achievementId]`), `Account`, `Post`, `UserRole {ADMIN, USER}`.
  No PAT/token tables, no ABAC membership tables — those arrive via the auth plan (ticket #19 / ADR 0002).
- Lessons (`src/db/lessons.tsx`): static TSX content (4 lessons, JSX embedded), also the denominator for
  `calculateAverageProgress` (`src/lib/progress.ts`). Storage decision is the lesson-store research — REST/PWA
  plans must not assume DB-backed lessons yet.
- `public/`: loose assets (`thumbnail.png`, `logo.svg`, media); no `public/pwa/` icon set, no `sw.js`,
  no `manifest.webmanifest`.
- `src/proxy.ts` matcher already excludes `webmanifest` from middleware — no proxy change needed for the manifest route.

## 2. Recommended PWA scope (Serwist, Next.js 16)

Follow the Serwist Next.js integration (primary source: `serwist.pages.dev/docs/next/getting-started`;
Turbopack variant at `/docs/next/turbo`; offline-fallback pattern confirmed in Serwist issue #171 and the 2026
Serwist+App-Router walkthrough; manifest-via-Metadata-Route per the Next.js PWA guide):

1. **Build integration** — wrap `next.config.ts` with `withSerwistInit` (`@serwist/next`; `@serwist/turbopack`
   only if the repo commits to Turbopack builds — note the Next.js PWA guide warns the Serwist plugin currently
   needs webpack config, so verify against Next 16 before choosing the turbopack entrypoint):
   - `swSrc: "src/app/sw.ts"`, `swDest: "public/sw.js"`,
   - `additionalPrecacheEntries: [{ url: "/~offline", revision }]` with `revision` = `git rev-parse HEAD` (UUID fallback),
   - `disable: process.env.NODE_ENV !== "production"` (avoid dev cache hell),
   - `reloadOnOnline: false` (a forced reload wipes in-progress quiz/form state),
   - `globPublicPatterns: ["favicon.ico", "pwa/*.{png,svg}"]`.
2. **Service worker** (`src/app/sw.ts`, typed `sw.ts` per Serwist docs): `precacheEntries: self.__SW_MANIFEST`,
   `skipWaiting: true`, `clientsClaim: true`, `navigationPreload: true`, start from `defaultCache`
   (`@serwist/next/worker`), prepend a `NetworkOnly()` rule for heavy media (`/lessons/video/`, `*.mp4` —
   never blindly cache video), `fallbacks.entries: [{ url: "/~offline", matcher: request.destination === "document" }]`.
   Do not cache POSTs (Serwist/`defaultCache` never caches POST; progress/unlock mutations stay `NetworkOnly`).
3. **Offline page** — new `src/app/~offline/page.tsx` ("You're offline" + retry + home link, reusing the maintenance
   card language), precached via (1)+(2). Reshape `maintenance/page.tsx` visually to match, but keep it a separate
   server-driven route.
4. **Manifest + metadata** — new `src/app/manifest.ts` (`MetadataRoute.Manifest`: `name/short_name/start_url/scope/
   display: "standalone"/orientation/background+theme/icons 192+512 any + 512 maskable`) served by Next at
   `/manifest.webmanifest`; new `public/pwa/` icon set (192/512/maskable + apple-touch-icon); root `metadata` gains
   `manifest`, `appleWebApp`, `icons`; add `viewport.themeColor`; mount the Serwist provider (`SerwistProvider
   swUrl="/sw.js"`) at the layout boundary that is not statically cached.
5. **Offline lesson policy** — deliberately deferred: precache app shell + `/~offline` only. Whether lesson bodies
   are cached (and where) depends on the lesson-store decision; do not precache per-user progress/stats.

## 3. Recommended versioned REST surface (tRPC to OpenAPI)

Library choice (load-bearing): use the **`mcampa/trpc-to-openapi` fork** (`trpc-to-openapi@3.3.0`, supports
`tRPC ^11.1.0` + `zod ^3.25 || ^4`) — it matches this repo (`@trpc/server 11.5.0`, `zod 4.1.5`). The original
`j0shCarter/trpc-openapi` requires tRPC v10 + Zod v3 and is incompatible. The official `@trpc/openapi` (alpha,
`trpc.io/docs/openapi`) is spec generation only (`generateOpenAPIDocument`, GET-to-query/POST-to-mutation mapping,
superjson yes, subscriptions excluded) — it serves no REST traffic, so it complements but does not replace the
handler. Version all REST under `/api/v1`.

Proposed operation table (ICTQuest domain; `post.*` deliberately absent):

| REST operation | Source procedure | Auth | Notes |
|---|---|---|---|
| `GET /v1/me` | `user.getUser` reshaped | bearer PAT or cookie | Rename; session summary only |
| `GET /v1/me/progress?skip&take` | `user.getUserProgress` | bearer or cookie | Already paginated (max 100) |
| `POST /v1/me/progress` `{topic, subtopic}` | `user.addProgress` | bearer or cookie | Idempotent append; `NetworkOnly` in SW |
| `DELETE /v1/me/progress` | `user.deleteAllUserProgress` | bearer or cookie | Destructive; confirm UX stays |
| `GET /v1/me/achievements?skip&take` | `user.getUserAchievements` | bearer or cookie | Paginated |
| `POST /v1/me/achievements/unlock` `{achievementName}` | `user.unlockUserAchievement` | bearer or cookie | P2002 race already handled |
| `DELETE /v1/me/achievements` | `user.deleteAllUserAchievements` | bearer or cookie | Destructive; confirm UX stays |
| `GET /v1/users/{id}/stats` | `user.getUserStatsById` (public) | public, rate-limited | Keep public for social/profile reads |
| `GET /v1/lessons`, `GET /v1/lessons/{slug}` | new read router (after lesson store) | public, cacheable | Only once lesson store is decided |

Mechanics per `trpc-to-openapi` docs: add `OpenApiMeta` to the tRPC instance
(`initTRPC.context<Ctx>().meta<OpenApiMeta>().create()`), annotate each versioned procedure
(`.meta({ openapi: { method, path, protect } })`) with `.output()` schemas, mount
`createOpenApiFetchHandler` at `src/app/api/v1/[...rest]/route.ts` (`export const dynamic = "force-dynamic"`,
export all verbs) plus `generateOpenApiDocument({... version: "v1", baseUrl, securitySchemes })` at
`src/app/api/v1/openapi.json/route.ts`. Auth: keep `protect: true` default (bearer) and extend `createContext` +
`securitySchemes` with the cookie session so one procedure accepts bearer PAT (service/mobile) or cookie (web) —
`trpc-to-openapi` explicitly supports overriding `securitySchemes` beyond the default `Authorization: Bearer`
header for cookie-style auth. PAT verification (RBAC/ABAC lookup) is blocked on the auth plan's PAT tables landing
first. tRPC batch (`/api/trpc`) stays cookie-only; legacy unversioned `/api/*` duplicates retire after the v1
cutover (inventory: `progress`, `progress/[id]`, `achievements`, `user-achievements`, `get-user-id`,
`get-users-stats` + `public/*` variants).

## 4. Drops / reshapes (target blueprint vs ICTQuest)

- **Scalar API reference — DROP from prod, gate to dev/admin** (frozen as ADR 0005). The blueprint's Scalar UI
  would ship the full internal schema to every visitor. Serve `/api/v1/openapi.json` publicly but mount Scalar
  (or Redoc) only in development or behind the admin guard — never in the default bundle.
- **Dashboard-stats caching — RESHAPE, do not adopt verbatim.** Any blueprint pattern that long-caches aggregated
  stats is unsafe here: `getUserStatsById`/`/v1/users/{id}/stats` is per-user computed state whose denominator is
  the static `lessons.tsx` import. Cache the lessons list publicly (long SWR), keep per-user stats `NetworkOnly`
  when authenticated (public reads: short SWR + existing Redis rate limit, keyed by user id).
- **`post` router + posts admin — DROP.** Standing preference replaces the posts example with the ICTQuest domain;
  `post.hello/create/getLatest` and the `Post` model do not become REST operations (admin scope is ICTQuest entities
  per ticket #17).
- **`getUser` envelope — RESHAPE** to `GET /v1/me` returning the session summary (the current `{ success, data }`
  shape is kept for tRPC compat; REST outputs get explicit `.output()` schemas for OpenAPI).
- **Legacy `/api/*` REST — DROP after cutover** (table in section 3); unversioned, undocumented, fully covered by v1.
- **Lesson CMS/DB assumptions — DEFER to the lesson store.** No lesson-write REST and no lesson-body precaching until
  the content-store decision lands; the JSX-in-data shape also needs its ADR first.
