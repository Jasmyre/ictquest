# ADR 0005 — Interactive API docs dev/admin-only, OpenAPI JSON public

- Status: Accepted
- Date: 2026-09-14
- Spec: #23 (execution spec); wayfinder #16, tickets #19 (auth), #21 (PWA/REST)

## Context

Versioned REST (`/api/v1` from user-domain procedures via the `mcampa/trpc-to-openapi`
fork for tRPC 11 plus Zod 4) needs discovery: an OpenAPI document plus an interactive
reference UI (Scalar/Redoc pattern from the blueprint). Serving the interactive UI to
every visitor would ship the full internal schema in the default bundle, while hiding
the JSON entirely would leave API consumers screen-scraping. Per-user stats
(`getUserStatsById` / `/v1/users/{id}/stats`) are computed state keyed by user, not
safe for long caching, unlike the cacheable lessons list.

## Decision

Serve `/api/v1/openapi.json` publicly (generated via `generateOpenApiDocument`,
never in the default bundle) and mount the interactive Scalar/Redoc reference UI
dev-or-admin-only only: in development, or behind the admin guard in other
environments. One procedure accepts bearer PAT (service/mobile) or cookie (web) once
PAT tables land (blocked on #19); tRPC batch stays cookie-only. Cache policy:
lessons list publicly cacheable (long SWR); per-user stats network-only when
authenticated, short SWR keyed by user id plus the existing Redis rate limit on
public reads; progress/achievement mutations network-only, never cached. Legacy
unversioned `/api/*` duplicates and the `post` router retire after the v1 cutover;
lesson writes and lesson-body precaching stay deferred until the MDX store lands.

## Alternatives considered

- Public interactive docs for all visitors: rejected. Ships the internal contract UI
  to everyone and widens the discovery surface beyond the public JSON.
- Fully private OpenAPI (JSON plus UI gated): rejected. Forces integration consumers
  back to screen-scraping; the JSON is safe to publish, only the UI bundle is gated.
- Long-cache per-user stats (blueprint verbatim): rejected. Stale personal progress
  and completion counts; reshaped to short/network-only per above.

## Trade-offs

- For: safe discovery (public JSON, gated UI), fast lists with accurate personal
  data, no video/mutation caching accidents, clean retirement path for legacy routes.
- Against: two serving rules to maintain (public JSON vs gated UI); stats caching
  diverges from any blueprint default and must be documented at each endpoint.

## Consequences

- Positive: consumers discover `/v1/me`, `/v1/me/progress`, `/v1/me/achievements`,
  `/v1/users/{id}/stats`, and later lesson reads without scraping; admin/dev keep
  interactive exploration.
- Negative: Scalar/Redoc must never leak into the prod bundle; every new v1 operation
  needs `OpenApiMeta` plus `.output()` schema plus an auth annotation.
- Follow-ups: `src/app/api/v1/[...rest]/route.ts` (force-dynamic) plus
  `openapi.json` route, bearer-or-cookie context extension, SW `NetworkOnly` rules
  for mutations/media, document-match fallback to `/~offline`.

## References

- Research (published): `docs/research/pwa-rest-surface.md` (source:
  `research/pwa-rest-surface` branch).
- Issues: #19 (PAT tables unblock bearer wiring), #21 (operation table, mechanics,
  drops/reshapes), #23 (spec: v1 mechanics, Scalar dev-only, cache policy).
