# ADR 0004 — Vitest plus Playwright over Jest

- Status: Accepted
- Date: 2026-09-14
- Spec: #23 (execution spec); wayfinder #16, ticket #22 (tooling cutover)

## Context

Tooling/tests sit on a Jest-era harness: `jest ^30.1.3`, `jest-environment-jsdom`,
`ts-jest`, `@types/jest`, `whatwg-fetch` polyfill, `jest.config.ts` (next/jest plus
jsdom) plus `jest.setup.ts` (MSW lifecycle on Jest hooks, `next/navigation` via
`jest.mock`), scripts `test` / `test:watch` / `test:coverage` jest-only. The only test
in the repo is the placeholder pair `src/lib/sum.ts` plus `src/__tests__/sum.test.ts`
(no other importers); `src/mocks/handlers.ts` is a single stub, `trpc-msw.ts` an
unused stub. `biome ^2.3.8` plus `ultracite ^6.3.10` are already present with
`biome.json` extending `ultracite/core/react/next`. The blueprint mandates
vitest-plus-playwright; the migration needs unit/integration/e2e seams (route-plus-
guard, procedure, REST, MDX render, PWA offline) that Jest cannot cleanly serve.

## Decision

Cut over Jest to Vitest plus Playwright in strict order (docs -> memory-bank -> lint
-> scripts -> tests -> root-config cleanup): keep `biome.json` plus the ultracite
preset chain and `check` scripts verbatim, swapping only `javascript.globals` Jest
entries for Vitest (`describe/it/expect/vi/beforeAll/afterAll/afterEach`); adopt
`vitest.config.ts` plus `playwright.config.ts` plus `tests/{unit,integration,e2e}/`
layout and `scripts/dev-lan` plus `scripts/pwa-assets` logic (repath only);
`jest.setup.ts` becomes `vitest.setup.ts` (MSW v2 lifecycle on Vitest hooks,
`next/navigation` via `vi.mock`); `src/mocks/*` rewired to Vitest (handlers ported,
dev browser mock kept, unused tRPC-MSW stub wired or deleted); `package.json`
scripts become `vitest run` / `vitest` watch / `vitest run --coverage` plus
`playwright test`; `tsconfig.json` includes drop `jest.config.ts` and add the new
configs plus `tests/**` plus setup. Delete the Jest harness and deps, the
placeholder `sum` module plus sample test (replaced by a Vitest sample), the fetch
polyfill (Node 24 plus `undici` cover fetch), and the dead `todo.ts` stub.
Test-porting risk is trivial (one placeholder sample, one stub handler); new lesson,
progress, guard, and offline coverage is greenfield, split as unit (schemas,
procedures), integration (routers, guards, MDX reads), e2e (learner journeys,
offline). Close with a full green gate (`check` plus typecheck plus unit plus e2e).

## Alternatives considered

- Keep Jest and add Playwright alongside: rejected. Preserves two unit harnesses,
  keeps the `ts-jest`/jsdom/fetch-polyfill weight, and diverges from the blueprint.
- Adopt Vitest without Playwright: rejected. Loses the e2e seam (learner journeys,
  guard redirects, offline fallback) the migration explicitly tests at the highest
  seam possible.

## Trade-offs

- For: blueprint parity, faster unit runs, first-class ESM/RSC-era mocking, real e2e
  for routes/guards/offline, trivial port (one sample, one stub).
- Against: one-time churn across configs, setup, mocks, scripts, deps, and includes;
  MSW plus navigation mocks must be re-verified under Vitest semantics.

## Consequences

- Positive: externally visible behavior tested at the highest seam (route renders,
  guard redirects, procedure allow/deny, REST status plus shape, offline fallback),
  never implementation details; `pwa-assets` asset list waits on the PWA surface
  closing so icons/SW entries are final.
- Negative: Jest files/deps disappear; placeholder test history is replaced, not
  preserved.
- Follow-ups: per-ticket coverage (guards, auth cutover, MDX parity, progress and
  achievement flows, v1 contract, offline fallback) owned by later migration tickets.

## References

- Research (published): `docs/research/tooling-cutover.md` (from #22).
- Issues: #22 (inventory, adopt/rewrite/delete lists, cutover order), #23 (spec:
  tooling order, seams, green gate), #24 (this baseline: ADRs first).
