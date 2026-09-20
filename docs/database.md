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
| Local | `npm run db:generate` | `prisma migrate dev` — creates/applies migration + regenerates client |
| Deploy | `npm run db:migrate` | `prisma migrate deploy` — applies committed SQL only |
| Prototype | `npm run db:push` | `prisma db push` — sync without migration files (never for deploys) |
| Inspect | `npm run db:studio` | Prisma Studio |

Rules: edit schema → `db:generate` → commit the migration directory. Never
hand-edit applied migrations; write a new one. Seed rows
(`ADMIN`/`MODERATOR`/`USER`) come from migration SQL, not app code. Migration
order: auth-contract-final → `20260919000000_user_profile_fields` (biography
NULL + `isPrivate` false backfill) → `20260920000000_role_membership_expand` /
`20260921000000_role_membership_contract` (implicit-join pair-copy, provenance
dropped).

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
