# Active Context — ICTQuest

Execution spec: #23 (source of truth). Decisions frozen in `docs/adr/0001–0009`.

## Current focus

- Public profile header/shell (#92, `ticket/92-header-shell`, based on
  `feat/user-public-profile`): `(app)/user/[id]` page shell retokened to the
  design-system `div` shell + `sr-only h1`, wired to the real
  `dashboard.getDashboardById` read; `user-header.tsx` rewritten as a
  bannerless token Card (avatar, `userName`, muted meta line
  `Level X · N lessons · M achievements`, biography only when public + set),
  Follow/Report/Block visibly disabled per ADR-0009; `user-stat-summary.tsx`
  retokened; all page mock/`UserData` deleted; `user-stats.tsx` keeps the
  Progress/Achievements boundary (props now `{ user }`, Activity tab + mock
  gone, retokened) for #93. New `tests/unit/user-header.test.tsx`. Gates:
  typecheck clean, ultracite clean, unit 214/214.
- Settings spec #81 + tickets #82–#86 resolved closed (2026-10-14,
  `feat/settings-page` @ f5d4e8d): #82–#85 implemented via unified
  surface; #86 deviated on purpose (Tokens tab removed, not disabled);
  handle editing removed on purpose. Gates at close: typecheck clean,
  ultracite clean, unit 204/204. Next: push `feat/settings-page`, open
  PR to `main`.
- Standards cleanup (2026-10-14, `feat/settings-page`): shared settings
  limits (`DISPLAY_NAME_*`, `BIOGRAPHY_MAX_LENGTH`, `PASSWORD_MIN_LENGTH`
  in client-safe `schemas/user.ts`), shared repo `settingsSelect` +
  `toSettingsRow`, shared `press-feedback.ts` classes, `select` middleman
  cut, `active`/`TRIGGER`/`PRESS`/`ROW` renamed, dead `userName` dropped
  from repo `updateSettings`. Gates: typecheck, ultracite, unit 204/204,
  build green (`/settings` PPR).
- Settings override landed on `feat/settings-page` (2026-10-14,
  uncommitted): the newer `chore/shadcn-mcp-opencode` settings surface
  (unified `getSettings` contract, `user-settings` service,
  `pages/settings/*` cards, `ui/switch`/`textarea`/`toggle`/`toggle-group`,
  Settings nav entry) replaces the tickets #82–#86 implementation
  (`components/settings/*`, `user-credentials` service, per-tab suites
  removed; `user-profile`/`update-user-name`/ADR-0010-adjacent edits
  reverted to base); branch merged with `origin/main` so the shadcn MCP
  server ships on the same branch; ADR-0010 amended to the unified
  contract (OAuth-only email lock, always-reset flag, Email-card prompt).
  Gates: ultracite clean, typecheck clean, test:all 221/221, build
  green (`/settings` PPR). Next: push `feat/settings-page`
  (`--force-with-lease`), retire `chore/shadcn-mcp-opencode`.
- Settings page built (#81, uncommitted): owner-scoped `/settings` with
  sidebar tablist (Profile/Appearance/Account/Tokens-disabled/Danger),
  new `user-settings` service + `User` router procedures
  (`getSettings`/`updateSettings`/`updateEmail`/`updatePassword`/`setPassword`)
  behind `permissionProcedure("User", …)` with service-seam row re-check
  (FORBIDDEN on missing); email locked when `password` is null (OAuth-only),
  password strength reuses the auth credential rule (min 6); shadcn
  `switch`/`textarea`/`toggle-group` added; `cursor-pointer` on all
  clickables. Gates: typecheck clean, ultracite clean, test:all 221/221,
  build green (`/settings` PPR).
- Settings hydration fix + handle removal (2026-10-13, uncommitted):
  `AppearanceSettingsCard` mounted-gate (next-themes resolves client-side;
  SSR skeleton placeholder kills the `data-state`/`aria-checked` mismatch,
  verified 0 console errors in real browser); handle editable removed from
  Settings (display name stays the identity; `userName` column untouched for
  nav/profile/admin); tab hint now `Name, bio, visibility`.
- Settings tabs redesign (2026-10-13, uncommitted): rail rows full-width
  (`w-full` triggers, wrapper divs replaced with Fragments); mobile gets a
  `DropDrawer` section switcher (bottom drawer, active check) instead of
  the long vertical list; top-left identity card removed
  (avatar/name/email/credential badge all duplicated in the cards below).
  Verified in real browser at 390px (drawer open/select) and 1280px
  (rail screenshot) with 0 console errors.
- Tokens tab removed from Settings (2026-10-14, uncommitted): disabled
  `tokens` entry + `TokensPlaceholderCard` deleted (PAT backend in
  `src/server/auth/personal-access-tokens.ts` untouched); `disabled` /
  `In development` badge scaffolding removed from `settings-tabs.tsx`
  (rail + drawer). Tabs now Profile/Appearance/Account/Danger. Gates:
  typecheck clean, ultracite clean, unit 204/204.
- shadcn MCP for opencode (branch `chore/shadcn-mcp-opencode`, merged to
  `main`): `npx shadcn@latest mcp init --client opencode` adds the `shadcn`
  local MCP server (`["npx", "shadcn@latest", "mcp"]`) to `opencode.json`
  plus the `shadcn` CLI dep; formatter pinned to single-line `command`
  arrays. Gates: ultracite clean, typecheck clean, test:all 221/221.
  Restart opencode to load the new server.
- Header Settings link (2026-10-14, uncommitted): `Settings` (`/settings`,
  `settings` icon) added to `AUTHED_NAV` in `site-header.ts` (+ `Settings`
  lucide mapping in `header-icon.tsx`) so desktop nav, mobile sheet, and
  ⌘K palette all list it; dead Settings menu items in `header-actions.tsx`
  (desktop user dropdown) and `mobile-menu.tsx` (quick action + account
  menu) now link to `/settings`. Gates: typecheck clean, ultracite clean,
  unit 204/204.
- Design-system + `/` polish (uncommitted): `docs/design-system.md` created —
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

- Settings spec published as #81 (`ready-for-agent`): new owner-scoped `/settings` page (Profile/Appearance/Account/Danger live; theme local-only; credentials production-ready via tRPC `permissionProcedure` seam; email change resets `emailVerified` per ADR-0010).
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
