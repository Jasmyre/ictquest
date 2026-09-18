# Tech Context — ICTQuest

Technologies, setup, and constraints. Cutover order and rationale per ADR 0004 and
`docs/research/tooling-cutover.md`.

## Stack (current + target)

- Runtime: Next.js `^16.0.7` (`cacheComponents: true`), React `^19.2.1`, Node 24.
- Data: Prisma `^7.2.0` + `@prisma/client` + `@prisma/adapter-pg`, Postgres
  datasource. Models today: `User` (legacy single `role` column until the
  two-migration cutover), `ProgressData { topic, subtopics }`, `Account`,
  `Achievement`, `UserAchievement`, `Post` (to be deleted per `projectbrief.md`).
- API: tRPC `^11.5.0` (`post` + `user` routers today), Zod `^4.1.5`, superjson;
  versioned REST via the `mcampa/trpc-to-openapi` fork (`trpc-to-openapi@3.3.0`,
  tRPC 11 + Zod 4 compatible) at `/api/v1` (ADR 0005).
- Auth: `next-auth ^5.0.0-beta.30` (Auth.js v5 beta, JWT + Prisma adapter),
  `@auth/prisma-adapter`, `bcryptjs`; target adds `Role` / `UserRole` / PAT tables
  per ADR 0002.
- PWA: Serwist (`@serwist/turbopack`), `swSrc: src/app/sw.ts` served at
  `/serwist/sw.js` via `src/app/serwist/[path]/route.ts`; manifest via `src/app/manifest.ts`; `public/pwa/` icon
  set (192/512/maskable + apple touch). Not installed yet — lands with migrations
  #39–#40 (ADR 0005).
- MDX: `@next/mdx` + `@mdx-js/*` (or `next-mdx-remote-client` for DB-stored MDX)
  plus `mdx-components.tsx`. Not installed yet — lands with migrations #29/#32
  (ADR 0001).
- Styling/UI: Tailwind 4, `components.json`, `postcss.config.mjs` (untouched),
  Radix primitives, `cn` (`clsx` + `tailwind-merge`).

## Development setup

- Scripts today (`package.json`): `dev`, `build`, `check` / `check:write` /
  `check:unsafe` (Biome), `typecheck` (`tsc --noEmit`), `test` / `test:watch` /
  `test:coverage` (Jest-era — replaced at cutover), DB scripts (`db:generate`,
  `db:migrate`, `db:push`, `db:studio`).
- Target scripts (ADR 0004): `test` → `vitest run`, `test:watch` → `vitest`,
  `test:coverage` → `vitest run --coverage`, plus `test:e2e` → `playwright test`.
- Configs: `vitest.config.ts` + `playwright.config.ts` + `tests/{unit,integration,e2e}/`
  layout; `jest.setup.ts` becomes `vitest.setup.ts` (MSW v2 lifecycle on Vitest
  hooks, `next/navigation` via `vi.mock`); `tsconfig.json` includes drop
  `jest.config.ts`, add new configs + `tests/**` + setup.
- Lint: `biome.json` extending `ultracite/core/react/next` is kept verbatim; only
  `javascript.globals` Jest entries swap to Vitest
  (`describe/it/expect/vi/beforeAll/afterAll/afterEach`) at cutover.
- Adopted logic (repath only): `scripts/dev-lan.*` + `scripts/pwa-assets.*`;
  `pwa-assets` icon/SW asset list finalises only after the PWA surface closes.

## Technical constraints

- JSX-in-data ban: lesson content must not embed presentation code in data; MDX
  satisfies this structurally and ADR 0001 still records it.
- Slugs stay stable across the MDX migration; CI enforces slug parity so existing
  `ProgressData` keys keep working.
- Per-user stats are network-only or short-lived keyed cache; lessons list is
  cacheable (ADR 0005).
- Scalar/Redoc reference UI is dev-or-admin-only and never in the default bundle;
  OpenAPI JSON is public (ADR 0005).
- Cutover order is strict: ADRs → memory-bank → lint → scripts → tests →
  root-config cleanup + full green gate (`check` + typecheck + unit + e2e).
- Legacy `User.role` column + enum survive until the code cutover completes;
  `Post` model/router and legacy unversioned `/api/*` retire after their cutovers.
