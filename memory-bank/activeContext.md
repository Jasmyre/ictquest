# Active Context — ICTQuest

Execution spec: #23 (source of truth). Decisions frozen in `docs/adr/0001–0009`.

## Current focus

Standards split + pointers-only `AGENTS.md` (16 lines) landed (`f2f397e`):
mechanical rules → `npm exec -- ultracite check`; judgement → `CODING_STANDARDS.md`.
Pre-commit gate landed (`4aa3c96`): Husky + lint-staged blocks bad staged files.
LAN/PWA agent-opacity fix (uncommitted): `docs/pwa.md` documents the
`dev-lan.mjs` SAN re-verify `console.error` line as the grep contract
(`Rebuilt LAN cert still does not cover`), so a future agent reads
dev-server output instead of re-running openssl.
Next: push the 5-commit stack to `origin/main` (`git push`).

## Open questions

- DB split: create the `DATABASE_URL` secret + `production` environment in
  GitHub repo settings before the first merge to `main` triggers `deploy-prod`;
  decide whether to also set a shared `DATABASE_URL_DEV` for the team.

## Vocabulary delta

- Six entities: Lesson, Topic, Quiz (standalone), Progress, Achievement, User.
  `Post` dropped; Compliments is a page only.
- route group = URL-invisible layout bucket; shell = per-group layout chrome;
  guard = `proxy.ts` + `routes.ts` rule.
- Testing: externally visible behavior at the highest seam possible; never
  implementation details (spec #23).

Resolved history archived to `progress.md` (Evolution of decisions, 2026-10-10).
