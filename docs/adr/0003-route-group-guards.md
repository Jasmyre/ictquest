# ADR 0003 — Route-group shells plus prefix guards

- Status: Accepted
- Date: 2026-09-14
- Spec: #23 (execution spec); wayfinder #16, tickets #17 (domain), #19 (auth), #20 (routes)

## Context

Legacy routes have no group shells or role guards: `src/proxy.ts` checks
logged-in-vs-public only, `src/routes.ts` holds only `publicRoutes`/`authRoutes`, and
the exact-`includes` match on `/lessons` is accidental rather than intentional. The
spec must place every legacy route (root, lessons index, lesson detail, subtopic,
progress, profile, user detail, social plus mock social-new, compliments, settings,
auth plus auth-error, terms, privacy, maintenance, access toggle, misspelled
achivement click-test, components stub) plus greenfield admin into the target's
`(marketing)` / `(app)` / `(admin)` groups, assign each group a shell, and define the
guard rule that enforces it.

## Decision

- `(marketing)` public, minimal SEO shell: `/` root, `/lessons` index exact-only,
  `/terms`, `/privacy`. Thin root layout (fonts/theme/providers) stays.
- `(app)` authenticated, full nav-plus-footer shell: `/lessons/[topic]`,
  `/lessons/subtopic/[subtopic]`, `/progress`, `/profile`, `/user/[id]`, `/social`,
  `/social/new` (mock, no MODERATOR gate), `/compliments` (page-only per #17),
  `/settings` (moved from the dropped `/(protected)` group; removed from
  `publicRoutes` since it never matched the grouped path).
- Standalone shell-less surfaces: `/auth`, `/auth/error` (redirect-if-logged-in) and
  `/maintenance` (env-gated bypass of all guards and shells).
- `(admin)` ADMIN-only, separate sidebar shell with no public nav leakage (greenfield):
  `/admin`, `/admin/users`, `/admin/lessons`, `/admin/achievements`, `/admin/progress`.
  `MODERATOR` seeded with zero routes, reserved.
- Retired with no placement: `/access` (dev toggle), `/achivement` (misspelled
  click-test; future real route uses correct `/achievements` spelling), `/components`
  (layout only, never a route).
- Guards (`proxy.ts` / `routes.ts`): `routes.ts` gains `adminRoutes`; matching is
  prefix-based with one intentional exact-exception (`/lessons` exact-public versus
  `/lessons/*` authed). `proxy.ts` checks session for `(app)`, session plus `hasRole`
  for `(admin)`, bypass for `/maintenance` and the public API prefix, and
  redirect-if-logged-in for auth routes. `/api/*` versioning/retirement stays with the
  REST surface.

## Alternatives considered

- Per-page guard checks instead of group guards: rejected. Duplicates the rule on
  every page, drifts from the blueprint, and cannot give admin its leak-free shell.
- Exact-match-only routing table: rejected. Breaks subtree coverage (`/lessons/*`,
  `/admin/*`); the one exact-exception is the only exact rule.

## Trade-offs

- For: one rule per group, URL-invisible buckets, per-group shells, admin isolation,
  explicit handling of the lessons index-vs-subtree split.
- Against: prefix matching must be tested against the guard matrix (exact-public
  `/lessons` vs authed subtree is the sharp edge); maintenance bypass is an
  intentional hole that must stay env-gated.

## Consequences

- Positive: public visitors get root/lessons-index/terms/privacy with no login;
  learners get authed full-shell routes; admins get a focused sidebar shell.
- Negative: `/(protected)` group is dropped and `/settings` moves; retired demo routes
  disappear; lesson-detail auth means lesson-body caching must be per-user, never
  public (deferred to PWA/MDX tickets).
- Follow-ups: guard-matrix tests at the HTTP route-plus-guard seam, admin shell build,
  MDX route placement (routes, not DB-admin), offline policy per authed reads.

## References

- Issues: #17 (Compliments page-only; MODERATOR reserved), #19 (role surface added,
  not moved), #20 (placement, shells, guard shape, vocabulary), #23 (spec: group
  ownership, guard matrix, retirements).
