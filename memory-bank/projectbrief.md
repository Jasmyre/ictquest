# Project Brief — ICTQuest

Source of truth for project scope. Execution spec: #23. Decisions frozen in `docs/adr/` (#24 baseline).

## What ICTQuest is

A learner app for ICT study: browse lessons, step through subtopics, run interactive
content-blocks (code, browser demos, quizzes), persist per-user progress, unlock
achievements, plus social/profile/compliments pages. Auth is credentials + OAuth with
role-based admin.

## Domain (canonical vocabulary)

Six entities only: **Lesson, Topic, Quiz, Progress, Achievement, User**.

- **Lesson / Topic / Subtopic-Step / Content-block** per ADR 0001: lessons are a local
  MDX content collection (`content/lessons/<lesson>/<subtopic>.mdx`, frontmatter
  `{ lesson, subtopic, slug, title, order }`); **Quiz** is a standalone entity, not a
  Topic kind; **Compliments** is a page only, not an entity.
- **Post dropped**: the example `Post` model and `post` router are deleted as verified
  unused stubs (spec #23).
- **Dashboard reshaped to progress-stats**: no `dashboard` router; progress stats come
  from a `progress-stats` router fed by existing user procedures (spec #23, ADR 0005).
- **route group** = URL-invisible layout bucket; **shell** = per-group layout chrome;
  **guard** = `proxy.ts` + `routes.ts` rule. Do not conflate (ADR 0003).

## Admin scope

ICTQuest admin replaces the posts example (spec #23, ADR 0002/0003):

- Manage users and role assignments (grant/revoke `ADMIN` / `MODERATOR` / `USER`).
- Manage lesson content entries (curriculum stays dev-authored in git; MDX format).
- Manage Achievement definitions.
- Run progress operations (grant/revoke achievements, reset progress).
- Separate `(admin)` sidebar shell with no public nav leakage. `MODERATOR` is seeded
  with zero routes, reserved for future user-generated-content work.

## Load-bearing decisions (cite, do not re-decide)

- ADR 0001 — MDX content collection over persistence-backed lessons (JSX-in-data ban
  satisfied structurally; slugs stay stable; slug-parity check).
- ADR 0002 — ABAC many-to-many roles (`Role` + `UserRole` join with provenance) plus
  personal access tokens; two-migration cutover; default-role guarantee.
- ADR 0003 — Route-group shells plus exact guards (`(marketing)` / `(app)` /
  `(admin)` plus standalone auth/maintenance surfaces; the whole `/lessons`
  tree is authed in `(app)` on purpose, no public exception).
- ADR 0004 — Vitest plus Playwright over Jest (strict cutover order; green gate).
- ADR 0005 — Interactive API docs dev/admin-only; OpenAPI JSON public; per-user stats
  network-only/short-lived, lessons list cacheable.

Research: `docs/research/lesson-content-store.md`, `docs/research/pwa-rest-surface.md`,
`docs/research/tooling-cutover.md`.

## Out of scope (per #23)

Lesson content rewrite (storage may change, functionality preserved); keeping posts;
UGC semantics; lesson writes and lesson-body precaching at cutover; long-cache on
per-user stats; public interactive docs bundle; legacy unversioned API survival;
headless CMS.
