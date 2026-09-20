# API reference

Two transports share the same Procedures: typed tRPC (web app) and versioned
REST (external callers). Terms: Procedure (code) vs Operation (HTTP) — see
`CONTEXT.md`.

## REST mount (`/api/v1`)

- Document (machine contract): `GET /api/v1/openapi.json` (per-request build,
  `Cache-Control: public, max-age=3600, s-maxage=3600`).
- Reference UI (human): admin-only `/admin/api-docs` (client-lazy Scalar in
  `<Suspense>`; no public bundle).
- Wire shape: plain JSON, ISO datetimes, no SuperJSON envelope. Outputs are
  `z.strictObject` (unknown fields fail).
- Tags: `me`, `lessons`, `dashboard`. 10 Operations: `achievement.*` ×3
  (`/v1/me/achievements`, `/v1/me/achievements/unlock`), `progress.*` ×3
  (`/v1/me/progress`), `user.getUser` ×1 (`/v1/me`), `lesson.*` ×2
  (`/v1/lessons`, `/v1/lessons/{lesson}/{subtopic}`),
  `dashboard.getDashboardById` ×1 (`GET /api/v1/dashboard/{id}`). `dashboard.getMyDashboard`,
  admin, and token lifecycle stay tRPC-only (unmounted by construction).
  Legacy `GET /v1/users/{id}/stats` is deleted with no shim.
- Versioning: `/api/v1` prefix. Future breaking changes get `/api/v2`; v1
  stays until clients migrate.

## Auth

Schemes: `bearer` (PAT) + `cookie` (session); protected Operations accept either.

```bash
curl -H "Authorization: Bearer ictq_<secret>" \
  https://<host>/api/v1/lessons
curl https://<host>/api/v1/openapi.json
```

Bearer-first, fail-closed: presented-but-invalid Bearer → 401 without
consulting cookies. Session fallback applies only when no Bearer is sent.
Permission checks are identical on both. Dual auth lives in
`src/server/api/v1-context.ts`.

## Errors

| Code | Meaning |
|---|---|
| 401 | Missing/invalid Bearer on a protected Operation, or signed-out session |
| 403 | Authenticated but no grant (also used for missing rows — anti-probing) |
| 404 | Unknown REST path / unmounted surface (e.g. admin on REST) |

Zod failures surface flattened validation errors (see `formatZodError`).

## tRPC (`/api/trpc`)

Batched + SuperJSON + cookie-only. Use generated hooks in-app
(`useSuspenseQuery`, `useMutation`, `api.useUtils()` for invalidation). Server
components call directly via `createCaller` / hydration helpers
(`HydrateClient`). Dashboard outputs use strict schemas (`dashboardByIdSchema`
strict, `dashboardDataSchema` field-identical to the prior stats shape,
share-safe with no biography key).

## Rate limits

Public procedures: 10 req / 40s / IP (production-only, dev-skipped).
Authenticated procedures are unthrottled at this layer — add limits per-router
as needed.

## Per-file before/after entity map (Slice 7, #64)

| Before | After |
|---|---|
| `GET /api/openapi.json` (static, once at load) + public `GET /reference` | `GET /api/v1/openapi.json` (per-request, cached 1h) + admin-only `/admin/api-docs` |
| Old example tags, 8 ops | Tags `me`/`lessons`/`dashboard`, 10 ops above |
| Old catalog + `/api/openapi.json` curl | `/api/v1/lessons` + `/api/v1/openapi.json` curl, `ictq_` prefix |
| 5 req/40s/IP | 10 req/40s/IP, production-only (code wins) |
| Latest-before-byId ordering gotcha | Deleted — no such router exists |

## Deleted-example reference list

This rewrite removes the old tag claim with its 8-op count,
the old catalog example, and the latest-before-byId gotcha.
