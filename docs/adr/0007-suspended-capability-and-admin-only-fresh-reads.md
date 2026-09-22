# Suspended capability with preserved roles, and admin-only fresh reads

Role grants and revokes only took effect after re-signin because session
roles are JWT-stamped at sign-in/refresh, so a demoted ADMIN kept ADMIN
access until the token refreshed. Separately, stripping every role was
not a valid suspension mechanism: it produced the invalid Role-less
state and destroyed the memberships unsuspend would need to restore. We
added `User.suspendedAt` (`DateTime?`, migration
`20260922000000_user_suspended_at`), stamped or cleared only by
admin-gated idempotent `suspendUser`/`unsuspendUser` (self-suspend
refused, roles never touched), and made privileged gates re-read
memberships plus the suspension flag per request while every other path
stays on the session copy.

## Considered Options

- **Suspend by stripping all roles**: reuse the existing role editor to
  remove every membership as the disable mechanism. Rejected — it
  creates the invalid Role-less state ADR-0001 forbids, and unsuspend
  cannot restore what was deleted. It also collides with the irrevocable
  USER floor (#71), which rejects removing the last membership.
- **Fresh per-request reads on every path**: re-read memberships for all
  procedures and the edge proxy so every caller always sees current
  roles. Rejected — a database read per learner request taxes the hot
  path for no safety gain. Freshness applies only where stale roles can
  do harm: privileged procedures and the admin shell guard.
- **Shorten the session/refresh lifetime globally instead of fresh
  reads**: force all tokens to expire fast so revocation propagates.
  Rejected — it re-signs every learner to fix an admin-only problem and
  still leaves a window where a demoted admin keeps access.

## Consequences

- Suspend-vs-strip: suspension never creates a Role-less user and never
  drops the Default role floor. Enforcement blocks Credentials
  `authorize`, denies stamped suspended sessions at `jwt`/`session`
  resolution and in `privateProcedure` (flag-only, no extra lookup), and
  denies on a fresh per-request read with session fallback in privileged
  gates (`permissionProcedure("Admin", *)`, `adminProcedure`,
  `moderatorProcedure`), the `(admin)` layout guard, `proxy.ts`, and
  bearer REST (suspended owners resolve to null). `/admin/users` gains
  `AdminSuspendToggle`; OAuth `signIn` callback blocks suspended users.
- Admin-only fresh-read tradeoff: non-privileged paths issue no extra
  membership lookup per request (fast, JWT-stamped). Privileged paths
  pay one `getUserRoleNames` + suspension read per request so a grant,
  revoke, suspend, or unsuspend takes effect on the next admin request
  with no re-signin. The edge proxy stays a coarse redirect (no database
  read at the edge); the authoritative check lives in the server-side
  admin shell guard and the privileged procedures. On lookup failure the
  gates fall back to the session copy rather than locking everyone out;
  the permission engine still fails closed for truly Role-less callers.
  A demoted admin's non-privileged display may show the old role until
  token refresh, but no privileged check trusts it.
- Glossary: `Suspended user` and the session-freshness rule live in
  `CONTEXT.md`. No behavior or schema change lands in this record — it
  documents what #70 (instant revocation), #71 (USER floor), and #72
  (Suspended capability) shipped.
