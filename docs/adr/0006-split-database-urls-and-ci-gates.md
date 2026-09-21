# Split database URLs with target-scoped deploy scripts and CI gates

`DATABASE_URL` alone meant every command — local migration authoring, deploys,
tests — could touch the same database, and nothing forced prod to apply what a
PR merged. We split the topology into three named databases: production
(`DATABASE_URL`, live user data, `migrate deploy` only), development
(`DATABASE_URL_DEV`, `migrate dev` authoring), and test (`DATABASE_URL_TEST`,
ephemeral CI). All `db:*` npm scripts route through
`scripts/db-with-url.mjs <prod|dev|test>`, which resolves the URL, re-exports
it as `DATABASE_URL` for prisma, and refuses to run on an empty value. Runtime
selection (`resolveDatabaseUrl` in `src/lib/db.ts`) mirrors it: test → TEST,
production → prod only, else DEV with fallback to `DATABASE_URL` so
single-URL checkouts keep working.

## Considered Options

- **One URL per environment via hosting-only config (no repo scripts)**:
  rely on `.env` per machine and bare `prisma` commands. Rejected — nothing
  stops `migrate dev` or `db push` against prod, and CI has no drift gate.
- **Full `packages/db` workspace extraction**: separate deployable DB package
  with its own migrations pipeline. Rejected for now — the repo is a single
  Next.js app with one `prisma/` tree; target-scoped scripts give the safety
  without a monorepo refactor. Revisit if a second app needs the same schema.

## Consequences

- Prod applies the exact migrations the PR validated: PR workflow runs
  `db:validate` → `db:migrate:test` → `migrate status` → integration + unit
  tests on ephemeral Postgres; merge to `main` runs `db:migrate:prod` with the
  `DATABASE_URL` secret (`environment: production`).
- Secrets: `DATABASE_URL` lives only in hosting env + the GitHub `production`
  environment secret — never in `.env.example`, never in CI logs.
  `DATABASE_URL_DEV`/`DATABASE_URL_TEST` are optional and gitignored; CI
  constructs TEST from its postgres service.
- `db:generate` (dev) is the only command that creates migration files;
  `db:push` is dev/test only and blocked from prod by the helper's target map.
