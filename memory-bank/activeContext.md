# Active Context — ICTQuest

Execution spec: #23 (source of truth). Decisions frozen in `docs/adr/0001–0009`.

## Current focus

- `npm run validate` green 2026-10-13 (uncommitted): `node_modules` was
  gutted (all real deps UNMET, only extraneous leftovers) — restored via
  `npm ci`. Build then failed on `server-only` leaking into the client
  bundle: `profile-form.tsx` ("use client") imported length limits from
  `@/server/services/user-profile`, which pulls the repository chain.
  Fix keeps tier boundaries: limits now live in client-safe
  `src/server/schemas/user.ts`, service imports them, form + unit test
  import from schemas. Gates: typecheck clean, ultracite clean, test:all
  265/265, build green. Note: a rogue global `node` shim in
  `%AppData%/Roaming/npm` (a different Node build whose `util.styleText`
  rejects arrays) crashes vitest startup — prefix
  `C:\Program Files\nodejs` in PATH when running npm scripts from pwsh.

- Code-review fix for spec #81 (branch `feat/settings-fix`, worktree
  `../ictquest-fix`, based on `feat/settings-page` tip): Tokens tab
  keyboard-reachable but not activatable, legacy action throws when
  signed out, Danger split into two separate delete actions, router +
  service dedup, `verificationRequired` dropped, CONTEXT.md trimmed,
  ADR-0010, logged-out `/settings` e2e spec. Gates: ultracite clean,
  typecheck clean, test:all 265/265.
- Ticket #86 done (branch `feat/settings-86`, worktree `../ictquest-86`,
  pushed to origin, synced with `feat/settings-page` tip — already up to
  date): Settings polish — Tokens tab verified disabled (`In development`
  badge, `aria-disabled`, no activatable panel, pointer + ArrowRight-skip
  keyboard coverage), grouped-card/sidebar/reduced-motion/focus-visible
  class pins, Settings/Profile/Admin-manage glossary in CONTEXT.md. No
  production code change (shell already met spec). Gates: ultracite clean,
  typecheck clean, test:all 258/258. Playwright authed pass skipped: repo
  has no auth-setup/storageState pattern (Playwright has no seeded
  sessions per dashboard.spec.ts), so building it was out of scope.
- Settings integration merged (`feat/settings-page` @ a247f6c): #83
  Appearance + #84 Account + #85 Danger merged in order (d4c1681,
  78fbf73, 37b5d82) plus follow-up a247f6c. All four panels live
  (Profile/Appearance/Account/Danger); Tokens stays disabled. Gates:
  typecheck clean, ultracite clean, test:all 256/256. Pushed to origin.
- Ticket #84 done (branch `feat/settings-84`, worktree `../ictquest-84`,
  pushed to origin, synced with `feat/settings-page` tip — already up to
  date): live Settings Account tab — email change (normalize, uniqueness
  CONFLICT, `emailVerified` reset + `verificationRequired` flag,
  same-address no-op) + password change (bcrypt current-password proof as
  UNAUTHORIZED, 8-char letter+number strength as BAD_REQUEST) + OAuth-only
  set-password form (no current field, CONFLICT once a password exists).
  Thin-controller `user.getAccount`/`updateEmail`/`updatePassword`/
  `setPassword` (tRPC-only, permissionProcedure + row re-check, missing
  row = FORBIDDEN); `user-credentials` service owns rules (bcrypt cost 10);
  repository owns persistence (`findCredentials`/`findByEmail`/
  `updateEmail`/`updatePassword`); legacy `update-user-name` action rerouted
  through `updateOwnProfile`. Gates: ultracite clean, typecheck + test
  typecheck clean, test:all 251/235→251 pass (13 account + 4 new tab tests).
  Next: tickets #83 (Appearance), #85 (Danger), #86 (polish).
- Ticket #83 built (branch `feat/settings-83`, worktree `../ictquest-83`,
  pushed, based on integration `feat/settings-page` tip 758c962): Appearance
  panel live (`AppearanceForm` — `useTheme` + mounted guard, light/dark/system
  radio, applies immediately, persists to `localStorage` via next-themes, never
  hits the server). Gates: ultracite clean, typecheck clean, test:all 238/238
  (3 new appearance component tests). Next: tickets #84+ (Account, Tokens,
  Danger).
- Ticket #82 landed (branch `feat/settings-82`, worktree `../ictquest-82`):
  owner-scoped `/settings` with tab shell (Profile live; Appearance/Account/
  Danger placeholders; Tokens disabled with exact `In development` badge) and
  functional Profile panel (display name, userName, biography 500-char
  empty→null, isPrivate toggle) through thin-controller `user.getProfile` /
  `user.updateProfile` (permissionProcedure + row re-check, missing row =
  FORBIDDEN). Gates: ultracite clean, typecheck clean, test:all 235/235.
  Next: tickets #83+ (Appearance, Account, Tokens, Danger).

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

- Settings spec #81 implemented on `feat/settings-page` (tickets #82–#86
  merged + code-review fixes; ADR-0010 for email re-verification):
  owner-scoped `/settings` (Profile/Appearance/Account/Danger live, Tokens
  disabled `In development`; Danger duplicates profile actions; local-only
  theme; credentials via tRPC `permissionProcedure` seam). PR #87 ready for
  review (closes #81–#86). Gates: ultracite clean, typecheck clean,
  test:all 265/265.
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
