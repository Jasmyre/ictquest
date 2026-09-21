# Database

PostgreSQL via Prisma 7 (`pg` driver). Single client: `src/lib/db.ts`
(singleton). Schema: `prisma/schema.prisma`.

## Models

- `User` (cuid, `name`, `email?` unique, `password?` hash, `image?`,
  `userName?`, `biography?`, `isPrivate` default false, `roles`,
  `progressData`, `userAchievements`, `accounts`, `personalAccessTokens`).
  Biography is nullable display-safe text (empty normalizes to null);
  `isPrivate` redacts biography for other readers instead of 404ing; neither
  field ever enters session tokens.
- `Account` (OAuth links, `@@unique([provider, providerAccountId])`, cascade).
- `ProgressData` (visible completion-state rows: `userId`, `topic`,
  `subtopics[]`; indexes on `userId` and `[userId, topic]`). Dashboard is the
  derived summary view over these rows — it owns no table.
- `Achievement` (catalog definition: `name` unique, `description?`,
  timestamps) + `UserAchievement` (per-learner grant: `@@unique([userId,
  achievementId])`, denormalized name/description snapshot).
- `Role` (`name` unique: `ADMIN` / `MODERATOR` / `USER`), implicit
  many-to-many users (table `_RoleToUser`). Provenance columns
  (assignedBy/assignedAt) were intentionally dropped in the role-join
  simplification (see ADR 0001 supersede note) — pairs copied one-to-one, no
  audit trail kept.
- `PersonalAccessToken` (`user → User` cascade, `tokenHash` unique,
  `scopes[]`, `expiresAt?`, `lastUsedAt?`, `revokedAt?`, index `userId`).
  Hash-only storage (SHA-256 of an `ictq_` + 32-byte secret); plaintext
  returned once at mint time only.
- Lesson / Topic / Quiz content lives in versioned MDX files in git, not in
  Prisma. There is no lesson/topic/quiz table and no example-resource table.

## Workflows

| Env | Command | Effect |
|---|---|---|
| Local dev | `npm run db:generate` | `migrate dev` against `DATABASE_URL_DEV` (falls back to `DATABASE_URL`) — creates/applies migration + regenerates client |
| Dev deploy | `npm run db:migrate:dev` | `migrate deploy` against the dev DB — applies committed SQL only |
| Prod deploy | `npm run db:migrate:prod` (`db:migrate` alias) | `migrate deploy` against `DATABASE_URL` — applies committed SQL only |
| Test | `npm run db:migrate:test` | `migrate deploy` against `DATABASE_URL_TEST` (falls back to `DATABASE_URL`) |
| Validate | `npm run db:validate` | `prisma validate` — schema sanity, no DB writes |
| Prototype | `npm run db:push` / `db:push:test` | `db push` against dev / test only — never prod, never for deploys |
| Inspect | `npm run db:studio` / `db:studio:dev` / `db:studio:prod` | Prisma Studio against the named target |

All `db:*` scripts route through `scripts/db-with-url.mjs <prod|dev|test>`,
which resolves the URL and re-exports it as `DATABASE_URL` for the child
prisma process, then refuses to run when the resolved value is empty. Prod
accepts ONLY `DATABASE_URL`; `migrate dev` / `db push` never run against prod.

Rules: edit schema → `db:generate` → commit the migration directory. Never
hand-edit applied migrations; write a new one. Seed rows
(`ADMIN`/`MODERATOR`/`USER`) come from migration SQL, not app code. Migration
order: auth-contract-final → `20260919000000_user_profile_fields` (biography
NULL + `isPrivate` false backfill) → `20260920000000_role_membership_expand` /
`20260921000000_role_membership_contract` (implicit-join pair-copy, provenance
dropped).

## Environments & secrets

`DATABASE_URL` is production (live user data). `DATABASE_URL_DEV` is the
development database; `DATABASE_URL_TEST` is the ephemeral test database.
Both are optional locally and fall back to `DATABASE_URL` when unset, so a
single-URL checkout keeps working. Runtime selection lives in
`resolveDatabaseUrl()` (`src/lib/db.ts`): `test` → TEST, `production` →
prod only, everything else → DEV.

GitHub Secrets (repo Settings → Secrets and variables → Actions):

| Secret | Required in | Purpose |
|---|---|---|
| `DATABASE_URL` | `deploy-prod` job + hosting (Vercel/etc.) | Prod Postgres URL. CI deploy uses it; never commit it; never put it in `.env.example` |
| `DATABASE_URL_DEV` | optional, local/shared dev | Set in your own `.env` / `.env.local` (gitignored), never in CI |
| `DATABASE_URL_TEST` | optional | CI builds it from the postgres service automatically; set it only if you use a hosted test DB |

CI/CD (`.github/workflows/database.yml`): PRs run `db:validate` →
`db:migrate:test` → `migrate status` drift check → integration + unit tests
against the ephemeral Postgres service. Merges to `main` run
`db:migrate:prod` with the `DATABASE_URL` secret, so prod applies the exact
migrations the PR validated — prod can never silently lag behind dev.

## Layering

Repositories (`src/server/repositories/**`, one per entity: lesson, topic,
quiz, progress, dashboard, achievement, user) own all Prisma access; services
(`src/server/services/**`) call repositories, never Prisma; routers call
services, never Prisma. Per-user reads stay fresh (no long cache on
progress/dashboard/profile); lesson content reads are file-backed.

## Tests

Integration uses `DATABASE_URL_TEST` with per-test `TRUNCATE ... RESTART
IDENTITY CASCADE`. See `docs/testing.md`.

## Per-file before/after entity map (Slice 7, #64)

| Before | After |
|---|---|
| Example model bullet + relation on `User` | Deleted, no replacement (see list below) |
| `src/server/db.ts` client path | `src/lib/db.ts` singleton |
| "7 page-visit reads cached 10s with coarse tags" | Fresh per-user reads; file-backed lessons |
| Seed-only backfill line | Plus biography/isPrivate backfill and `_RoleToUser` pair-copy with order |

## Deleted-example reference list

This rewrite removes the example model bullet and its relation on
`User`. No other file may reintroduce an example resource.
