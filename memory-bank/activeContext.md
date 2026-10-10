# Active Context — ICTQuest

Execution spec: #23 (source of truth). Decisions frozen in `docs/adr/0001–0009`.

## Current focus

Design-system + `/` polish (uncommitted): `docs/design-system.md` created —
page shell, header, tokens, cards/grids, motion, states derived from
`/lessons` + `/social` with `/` as canonical; `/` stats gain stagger
(50ms) + `cubic-bezier(0.23,1,0.32,1)` hover lift. Gates: typecheck clean,
ultracite fix applied, progress-stats 8/8.
Next: push the stack to `origin/main` (`git push`).
- Profile double-loading fixed (uncommitted): deleted generic
  `src/app/(app)/loading.tsx` — it flashed before
  `src/app/(app)/profile/loading.tsx` on `/profile` and duplicated `/`'s
  inline `Suspense` skeleton. Each route now has exactly one loading state.
- Stagger flicker fixed (uncommitted): new `.stagger-enter` in `globals.css`
  (`rise-in`, hidden SSR base, forwards fill, nth-child delays,
  no-preference-gated); `/profile` grid + `/` stats/content grids migrated
  off `animate-in` + fill-mode combos that flashed visible-then-hidden.
- Code-review fixes (uncommitted): stale `stash@{0}` dropped (targeted deleted
  route tree); `/lessons` assessment chips + `aria-label` count derived from
  the lesson registry (`assessmentTopics` flat-map); new shared
  `src/components/page-header-skeleton.tsx` (`PageHeaderSkeleton`, per-site
  widths via props, zero visual change) adopted by `profile/loading.tsx`,
  `page-skeleton.tsx`, `subtopic-loading.tsx`. Gates: ultracite clean,
  typecheck clean, test:all 221/221.

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
