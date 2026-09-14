# ADR 0002 — ABAC many-to-many roles plus personal access tokens

- Status: Accepted
- Date: 2026-09-14
- Spec: #23 (execution spec); wayfinder #16, tickets #17 (domain), #19 (auth plan), #21 (PWA/REST)

## Context

Auth today is a single unenforced role column: `User.role UserRole @default(USER)`
with `enum UserRole { ADMIN, USER }` (`prisma/schema.prisma`), plumbed through
`src/auth.ts` (`session.user.role` / `token.role`), `src/types/next-auth.d.ts`, and
`src/data/user.ts`, with registration (`src/actions/register.ts`) relying on the DB
default. Audit found zero enforcement: `src/proxy.ts` is auth-only, `src/routes.ts`
has only public/auth lists, `src/server/api/trpc.ts` has only a logged-in
`privateProcedure` (no admin/moderator procedures), routers reference no roles, and
`src/app/access/page.tsx` is a dev localStorage toggle, not a gate. `ProgressData`,
`UserAchievement`, `Account`, and `User` rows must be preserved; no FK points at role
artefacts. Target requires bearer personal-access-token (service/mobile) or cookie
(web) auth for versioned REST, which needs PAT tables that do not exist yet.

## Decision

Adopt the target auth shape wholesale with a two-migration cutover:

- `Role { id, name UNIQUE }` seeded with exactly `ADMIN`, `MODERATOR`, `USER`
  (`MODERATOR` seeded with zero assignments, reserved per #17; no UGC semantics).
- Explicit `UserRole` join `{ userId FK->User Cascade, roleId FK->Role Cascade,
  assignedAt, assignedBy?, @@unique([userId, roleId]) }` carrying assignment
  provenance (not an implicit m-n).
- App-level default-role guarantee: atomic `USER` grant on registration, session heal
  to `USER` on empty membership, backfill assert of zero users without `USER`.
- `PersonalAccessToken { id, userId FK->User Cascade, name, tokenHash UNIQUE,
  scopes, expiresAt?, lastUsedAt?, revokedAt? }` indexed by user; hash-only storage.
  PAT verification unblocks bearer-or-cookie OpenAPI auth.
- Cutover order: Migration A additive (create tables, seed roles, keep legacy column
  live) -> backfill in one transaction (`ADMIN->ADMIN`, `USER->USER`, guarantee pass,
  assert plus per-role counts, untouched `Progress`/`UserAchievement`/`Account` row
  counts) -> code cutover (session `roles[]` plus `hasRole`, JWT handling, role-aware
  fetchers, new privileged procedures, guard matrix, atomic registration grant,
  idempotent role seed, retire-or-gate dev access toggle) -> Migration B breaking
  (drop legacy column plus enum, add missing indexes, verify unrelated legacy
  migrations still replay) -> PAT enablement last (mint/verify helpers,
  bearer-or-cookie OpenAPI security). Session exposes `roles` plus `hasRole`; new
  `adminProcedure` / `moderatorProcedure`; prefix-based route guards with an admin
  route list. Enforcement is added, not moved.

## Alternatives considered

- Keep the single-role column and branch on it: rejected. One column cannot express
  ADMIN/MODERATOR/USER membership, carries no provenance, and cannot back PAT scopes;
  it also preserves the current unenforced posture.
- Implicit many-to-many without a join model: rejected. Loses `assignedBy`/`assignedAt`
  provenance the admin scope (grant/revoke) needs.

## Trade-offs

- For: exact blueprint parity, provenance-carrying memberships, safe additive-then-
  breaking migration with row-count asserts, bearer PATs for REST without breaking
  cookie web flows.
- Against: two-migration plus backfill plus code-cutover sequencing is more work than
  a single breaking migration; every session/JWT/data-fetcher touchpoint must be cut
  over before Migration B; PAT tables land before they are usable (blocked wiring).

## Consequences

- Positive: registration, session heal, privileged procedures, and admin guards share
  one role source; `MODERATOR` exists with zero routes for future UGC work.
- Negative: legacy `User.role` column plus enum must survive until cutover completes;
  display-only mock `role` strings in pages are out of scope and stay untouched.
- Follow-ups: bearer-or-cookie context wiring and `/api/v1` mount (REST tickets),
  admin users/progress-ops UI, legacy unversioned `/api/*` retirement after v1.

## References

- Issues: #17 (roles seeded; MODERATOR reserved), #19 (inventory, target shape,
  migration order), #20 (guard matrix detail), #21 (PAT-blocked REST wiring), #23
  (spec: two-migration cutover, session shape, guard matrix).
