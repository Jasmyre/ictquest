# Auth & roles

Providers: Credentials, GitHub, Google (NextAuth v5, JWT sessions). Config:
`src/auth.ts`, `src/auth.config.ts`; handler:
`src/app/api/auth/[...nextauth]/route.ts`; pages: `/auth`, `/auth/error`.

## Sessions

JWT strategy. The JWT callback stamps `token.roles` from the implicit
many-to-many join; the session callback exposes `session.user.roles:
RoleName[]` (+ `id`). Types in `src/types/next-auth.d.ts` keep
`Session["user"]` compatible with `PermissionUser`. Biography and `isPrivate`
never enter tokens; stats selects stay closed.

Promote **before** sign-in: role changes after login don't appear until the
next JWT issuance. Tests promote before sign-in for the same reason.

## Roles matrix

| Action | ADMIN | MODERATOR | USER |
|---|---|---|---|
| Lesson / Topic / Quiz reads | ✅ (public — no grant needed) | ✅ (public) | ✅ (public) |
| Progress writes (list/create/delete) | own only | own only | own only |
| Quiz attempts | client-side gate on lesson read, no server grant | same | same |
| Achievement catalog (`manage`) | ✅ | ❌ | ❌ |
| Achievement grants (unlock/list) | own only | own only | own only |
| User profile (read/update, biography/`isPrivate`) | own (+ redacted public view of others) | same | same |
| Dashboard (`getMyDashboard` / `getDashboardById`) | own private + public by-id | same | same |
| Admin manage (`Admin.manage`) | ✅ | ❌ | ❌ |
| Token lifecycle | own tokens | own tokens | own tokens |

Effective permissions are the union of held roles. Every user holds ≥1 role
(`USER` default: equivalent idempotent connect in the registration
transaction, `ensureDefaultRole` at social sign-up and token heal); role-less
is invalid (schema `.min(1)` + service `BAD_REQUEST` + dialog guard + backfill
migration; engine denies anyway).

Two documented exceptions: dashboard visibility scoping (progress/dashboard
service) and the admin self-demotion guard (role-revocation service refuses an
`ADMIN` removing its own `ADMIN` role) — see `docs/architecture.md`.

## Route protection

`src/proxy.ts` + `src/routes.ts`: exact-public `/`, `/lessons`, `/terms`,
`/privacy`, `/~offline`; public share prefix `/dashboard` (by-id links bypass
the session guard, rate-limited); `/admin/*` via layout gate (`forbidden()` →
root `forbidden.tsx`); `/auth/*` redirect-if-logged-in; everything else
requires login. Maintenance flag redirects everything to `/maintenance`.

## Personal access tokens (Bearer)

- Format `ictq_` + 32 random bytes (base64url), SHA-256 hash-only at rest
  (`PersonalAccessToken.tokenHash` unique). The 24-byte-plus secret keeps the
  credential safely under bcrypt-era length limits by avoiding bcrypt
  entirely.
- `token.create` returns plaintext **once** (hash only at rest); `token.list`
  shows name/prefix/expiry/revocation only; `token.revoke` is owner-scoped +
  idempotent.
- tRPC-only: the token router carries no OpenAPI meta, so it never appears in
  the Document.
- Usage: `Authorization: Bearer ictq_...`. Presented-but-invalid fails closed
  (401), never falls back to cookies. Revoked/expired fail immediately.
  Resolved tokens run the same permission checks as sessions.

## OAuth setup

1. Create GitHub (`Settings → Developer settings`) and Google (`Console →
   Auth → Clients`) OAuth apps with callback
   `<origin>/api/auth/callback/<github|google>`.
2. Set `GITHUB_CLIENT_ID/SECRET`, `GOOGLE_CLIENT_ID/SECRET`, plus exact
   `NEXTAUTH_URL`/`BASE_URL`.
3. Credentials sign-up connects `USER` in the registration transaction;
   OAuth sign-up via the `createUser`/`linkAccount` auth events plus JWT-heal
   path — the latter two through `ensureDefaultRole`.

## Per-file before/after entity map (Slice 7, #64)

| Before | After |
|---|---|
| Example-resource view/create + update-any/delete-any rows | ICTQuest rows above (public lessons, owner progress/grants/profile/dashboard, admin catalog) |
| Example-resource list-visibility exception | Dashboard visibility-scoping exception |
| Public set `/landing,/maintenance,/offline,/reference` → `/landing` | Exact-public set + `/dashboard` share prefix above |
| `pat_<8-hex>_<48-hex>` + bcrypt rationale | `ictq_` + SHA-256 truth (code wins) |
| `assignDefaultRole` | `ensureDefaultRole` (3 call sites) |

## Deleted-example reference list

This rewrite removes the example-resource matrix rows and the
example list-visibility exception line. No example resource survives in this file.
