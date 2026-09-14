# Research: Tooling, docs, and tests cutover

- Canonical path: `docs/research/tooling-cutover.md` (this file).
- Source: wayfinder #16 ticket #22 (tooling docs tests cutover), verified against source on `wip/ictquest-2.0`.
  New page for this baseline (no throwaway branch; the two scratch research files it builds on are published as
  `docs/research/lesson-content-store.md` and `docs/research/pwa-rest-surface.md`).
- Spec: #23. Decisions frozen in ADRs 0001-0005.
- Date: 2026-09-14.
- Question: plan the tooling/docs/tests cutover to the exact blueprint without doing the cutover.

## 1. Inventory (verified on `wip/ictquest-2.0`)

- `package.json`: `jest ^30.1.3`, `jest-environment-jsdom`, `ts-jest`, `@types/jest`,
  `@testing-library/{react,jest-dom,user-event}`, `msw ^2.11.1`, `msw-trpc`, `whatwg-fetch`;
  scripts `test`/`test:watch`/`test:coverage` are jest-only. No `vitest`, `@vitest/*`, `@playwright/test`,
  `@serwist/*`, or `trpc-to-openapi` installed. `ultracite ^6.3.10` + `@biomejs/biome ^2.3.8` already present.
- `jest.config.ts` (next/jest + jsdom) + `jest.setup.ts` (MSW `server.listen` + `next/navigation` jest.mock) —
  the whole harness to replace.
- `src/mocks/{server,handlers,browser,trpc-msw}.ts`: `handlers` is a single `api.example.com/user` stub;
  `trpcHandlers` empty; `trpcMsw.createTRPCMsw<AppRouter>({links: []})` unused stub.
- `src/__tests__/sum.test.ts` + `src/lib/sum.ts`: the only test in the repo is a placeholder; `sum` has no
  other importers (verified by grep). Test-porting risk is therefore trivial.
- `biome.json`: already `extends ["ultracite/core","ultracite/react","ultracite/next"]` with scripts
  `check`/`check:write`/`check:unsafe` — verbatim-adoptable.
- `memory-bank/`: 6 files exist but 4 canonicals are stubs (`projectbrief.md`, `productContext.md`,
  `activeContext.md`, `techContext.md` jest-only, `systemPatterns.md` jest-era, `progress.md` stale).
- `docs/`: only `docs/agents/` (skill setup) before this baseline. No `docs/adr/`, no research pages, no `CONTEXT.md`.
  No `scripts/` dir, no `playwright.config.*`, no `vitest.config.*`.

## 2. Adopt verbatim (shape, not content)

- `biome.json` + `ultracite` preset chain and `check` scripts — keep as-is; only swap `javascript.globals`
  jest entries for vitest (`describe/it/expect/vi/beforeAll/afterAll/afterEach`) at cutover time.
- Blueprint `docs/` layout: `docs/adr/NNNN-*.md` template + `docs/research/*.md` pages (this baseline lands that shell);
  `memory-bank/` six-file names/structure; `scripts/dev-lan.*` + `scripts/pwa-assets.*` logic (repath only);
  `vitest.config.ts` + `playwright.config.ts` + `tests/{unit,integration,e2e}/` layout; `components.json`,
  `postcss.config.mjs` untouched.

## 3. Rewrite for ICTQuest (content)

- `memory-bank/{projectbrief,productContext,systemPatterns,techContext}.md` rewritten from closed tickets:
  6 entities + Post dropped + dashboard-to-progress-stats + admin scope (#17), MDX store + slug-parity +
  JSX-in-data ban (#18), ABAC many-to-many + PAT + backfill order (#19), route groups + guards (#20),
  PWA/REST operation table + drops/reshapes (#21). `activeContext.md`/`progress.md` repointed at the migration
  as current focus. (Owned by a later ticket, not this baseline.)
- `docs/research/lesson-content-store.md` + `docs/research/pwa-rest-surface.md` published from scratch findings
  to `docs/research/` paths (landed in this baseline); this `docs/research/tooling-cutover.md` page is the new
  third page.
- ADRs (new, one per load-bearing choice, landed in this baseline): MDX-over-persistence lessons (0001),
  ABAC-plus-PAT auth (0002), route-group guards (0003), vitest-plus-playwright over jest (0004),
  interactive-docs dev-only (0005).
- `jest.setup.ts` becomes `vitest.setup.ts` (MSW v2 `server.listen/resetHandlers/close` on vitest hooks;
  `next/navigation` mock via `vi.mock`); `src/mocks/*` kept but re-wired to vitest (handlers ported,
  `browser.ts` kept for dev, `trpc-msw.ts` either wired with real links or deleted at cutover if still unused).
- `package.json` scripts: `test` to `vitest run`, `test:watch` to `vitest`, `test:coverage` to
  `vitest run --coverage`, plus `test:e2e` to `playwright test`.
- `tsconfig.json` include: drop `jest.config.ts`, add `vitest.config.ts` + `playwright.config.ts` + `tests/**` +
  `vitest.setup.ts`.

## 4. Delete

- `jest.config.ts`, `jest.setup.ts` (replaced), `jest`, `jest-environment-jsdom`, `ts-jest`, `@types/jest`,
  `whatwg-fetch` (Node 24 + `undici` already cover fetch), `src/lib/sum.ts` + `src/__tests__/sum.test.ts`
  placeholder pair (replaced by a vitest sample or dropped — only test in repo, so porting is trivial: port the one
  sample as a vitest unit, port the MSW handler stub, nothing to split into integration vs e2e; new e2e for
  lesson/progress flows is implementation handoff, not a port).
- Legacy `todo.ts` Hello-World stub at cutover time (dead, unrelated to blueprint).
- `.clinerules/MemoryBank.md` ownership retired once the memory-bank rewrite lands (keep `api-patterns.md` /
  `ui-usage.md` until their ADR equivalents land — not deleted in this cutover).

## 5. Order (cutover sequence for the implementation handoff)

1. `docs/adr/` shell + first 5 ADRs — this baseline (unblocks memory-bank wording).
2. `memory-bank/` 4-canonical rewrites + `activeContext`/`progress` repoint (references ADRs).
3. `biome/ultracite` verbatim lock (globals swap only; stabilises lint before file moves).
4. `scripts/dev-lan` + `scripts/pwa-assets` adoption (pwa-assets shape waits on the PWA REST surface — do not
   finalise icons/SW asset list until #21's scope is frozen, which it now is via ADR 0005).
5. `jest` to `vitest + playwright` migration (configs, setup, mocks, scripts, deps, tsconfig) + placeholder port.
6. Root-config cleanup (`package.json`, `tsconfig.json`, deletions above) + `npm run check + typecheck + test + test:e2e` green gate.

## 6. Constraints

- This baseline is docs-only: no file moves/rewrites beyond `docs/` per #24 acceptance.
- JSX-in-data ban: the MDX decision satisfies it structurally, but ADR 0001 still records it.
- Seams for later testing (highest-first, per #23): (1) HTTP route plus guard seam, (2) tRPC procedure seam,
  (3) versioned REST seam, (4) MDX render seam, (5) PWA seam. Assert externally visible behavior at the highest
  seam possible, never implementation details.
