# System Patterns — ICTQuest

Architecture, key decisions, and patterns in use. ADRs in `docs/adr/` are the source
of truth; this file points at them. Vocabulary: **route group / shell / guard** and
**Lesson / Topic / Subtopic-Step / Content-block** per `projectbrief.md`.

## Architecture

- Next.js 16 App Router (`cacheComponents: true`), React 19, tRPC 11 + Zod 4,
  Auth.js v5 (JWT + Prisma adapter), Prisma 7 + Postgres for progress/identity
  metadata only (no lesson tables — ADR 0001).
- Lesson content: local MDX collection, one file per Subtopic (or per step with a
  `<Step submit="...">` wrapper); central `mdx-components.tsx` map exposes
  `CodeBlock, CodeHighlight, Browser, PracticeQuiz, MultipleChoiceQuiz` as thin
  wrappers injecting stepper callbacks (`setIsFinished`, `setNumberOfCorrect`,
  `setNumberOfInCorrect`); shuffle logic lives inside the component; slugs stable so
  existing `ProgressData` keys are unaffected, plus a seed/CI slug-parity check
  (ADR 0001).
- Auth: `Role` catalog (`ADMIN`, `MODERATOR`, `USER`; `MODERATOR` reserved with zero
  routes) + explicit `UserRole` join with provenance + `PersonalAccessToken`
  store (hash-only). Session exposes `roles[]` plus `hasRole`; `adminProcedure` /
  `moderatorProcedure`; atomic `USER` grant on registration; session heal on empty
  membership (ADR 0002).
- Route groups + guards (ADR 0003): `(marketing)` public minimal shell; `(app)`
  authed full shell; `(admin)` ADMIN-only sidebar shell; standalone auth/maintenance
  surfaces. `routes.ts` gains `adminRoutes`; prefix matching with one intentional
  exact-exception (`/lessons` exact-public vs `/lessons/*` authed). `proxy.ts`
  checks session for `(app)`, session plus `hasRole` for `(admin)`, bypass for
  maintenance and the public API prefix.
- Versioned REST at `/api/v1` sourced from user-domain procedures
  (`GET /v1/me`, progress CRUD, achievements unlock/list/delete, public
  rate-limited `GET /v1/users/{id}/stats`; lesson reads only after the MDX store
  lands). `OpenApiMeta` + `.output()` schemas per procedure; fetch handler at the
  versioned catch-all (`force-dynamic`); OpenAPI document at the versioned
  `openapi.json` route; bearer-PAT-or-cookie auth; tRPC batch stays cookie-only
  (ADR 0005).
- PWA via Serwist: wrapper emitting the service worker from app source, precache of
  shell + offline page (`/~offline`) keyed by source revision, prod-only, no
  reload-on-online; `NetworkOnly` for mutations/POSTs and heavy lesson media;
  document-match fallback to the offline page. Lesson-body precaching deferred and
  per-user, never public (ADR 0005).

## API design patterns

Kept in `.clinerules/api-patterns.md` until ADR equivalents land (not deleted in
this ticket): tRPC for endpoints, `publicProcedure` wrapper, `ApiResponse<T>`
envelope, Zod input validation (`[Entity]Schema` naming), centralized error logging
in `src/lib/error.ts`.

## UI component patterns

Kept in `.clinerules/ui-usage.md` until ADR equivalents land (not deleted in this
ticket): consistent `variant` / `size` / `disabled` props, always `className`, TypeScript
prop interfaces, pass-through of unhandled props, `cn` utility composition.

## Testing patterns (target)

Per ADR 0004 and spec #23: assert externally visible behavior at the highest seam
possible, never implementation details. Seams highest-first: (1) HTTP route + guard
(public vs authed vs ADMIN-only, exact-public lessons index vs authed subtree);
(2) tRPC procedure (progress-stats reads, progress writes, achievement unlock,
role-denied paths); (3) versioned REST v1 status + shape with bearer/cookie;
(4) MDX render (frontmatter + component-map rendering, slug parity); (5) PWA
(precached shell + offline fallback). New seams only where none exists (OpenAPI
handler, MDX component map).

## Critical implementation paths

- Complete step → persist progress → unlock/display achievement (end-to-end).
- Registration grant → session roles → heal-to-default → privileged procedures →
  admin guards.
- MDX pilot file → per-lesson parity → cache policy (per-user, never public).
- v1 contract → OpenAPI JSON public → Scalar/Redoc dev/admin-only.
