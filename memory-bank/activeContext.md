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
- DropDrawer visual bugs fixed + committed: desktop item label cell is now
  `flex min-w-0 flex-1` (was plain `div`, 19.6px icon drift + 3-line wrap);
  mobile non-group rows `w-[calc(100%-1rem)]` (was `w-full` + `mx-2`, 8px
  x-overflow) + `overflow-x-hidden` scroll guards. `/social` adopts DropDrawer
  (new `src/components/dropdrawer.tsx`, `src/components/ui/drawer.tsx`;
  `dropdown-menu.tsx` rewritten on `radix-ui`/`cn`; deps `cn`, `radix-ui`,
  `vaul`). Playwright-verified at 390px + desktop. Gates: typecheck clean,
  ultracite clean, test:all 221/221.
- Page-header cull + guideline pass (uncommitted): visual page-header blocks
  removed on dashboard, lessons, profile, progress, social, admin home —
  each keeps an `sr-only` h1; landmark ownership moved to group layouts
  (`(app)`/`(marketing)` `<main id="main-content">`, new admin-shell `<main>`),
  fixing nested-`<main>` on every touched page. Guideline fixes: skip link,
  `focus-visible` ring in `desktopNavLink`, explicit transitions, `aria-hidden`
  decorative icons, curly quotes, `tabular-nums` progress stats, `text-balance`
  headings, reduced-motion gate on float loops, touch `manipulation` +
  tap-highlight + overscroll + `color-scheme` + heading `scroll-margin` in
  globals. Admin `AdminPageHeader` kept (operational rules, not redundant
  labels). Gates: ultracite clean, typecheck clean, unit 204/204.

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
