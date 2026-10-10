# Design System — App Routes (`/`, `/lessons`, `/social`)

Source of truth for page shell, tokens, and motion across learner routes.
Derived from `/lessons` (`src/app/(app)/lessons/page.tsx`) and
`/social` + `SocialList` (`src/app/(app)/social/page.tsx`,
`src/components/pages/social/social-list.tsx`); canonical implementation is
`/` (`src/app/(app)/page.tsx`).

## 1. Page shell (all routes)

```tsx
<main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
  <header>…</header>
  <section>…</section>
</main>
```

- One `<main>` per page, owned by the page (group layout owns only `min-h-svh bg-background`).
- `max-w-7xl`, `px-4 sm:px-6 lg:px-8`, `py-8 sm:py-10`. Legacy `min-h-[80vh] py-10`
  shells in `/lessons` and `/social` migrate to this on next touch.
- Inner sections use `mt-6` then `mt-3 sm:mt-4` for secondary grids.

## 2. Header pattern

```tsx
<header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
  <div className="min-w-0 max-w-2xl">
    <p className="text-muted-foreground text-sm">Eyebrow — what this page is</p>
    <h1 className="mt-1 font-bold text-2xl text-foreground leading-tight tracking-tight sm:text-3xl">
      Title
    </h1>
    <p className="mt-2 text-muted-foreground text-sm leading-relaxed">Subtitle / next action.</p>
  </div>
  {/* optional trailing identity / actions */}
</header>
```

- Eyebrow (`text-muted-foreground text-sm`) + `h1` (`text-2xl sm:text-3xl`,
  `tracking-tight`) + one-line subtitle. `/social` "Connect with fellow
  learners" and `/` "Your learning at a glance" already follow this; migrate
  `/lessons` "HTML Lessons" to add the eyebrow + subtitle.
- Never hard-code `text-gray-900 dark:text-gray-100` for headers — use
  `text-foreground` / `text-muted-foreground` tokens so dark mode follows the
  theme (see `src/styles/globals.css` `:root` / `.dark`).

## 3. Color tokens (no hard-coded palette in app routes)

| Use              | Token                                        | Never                                    |
| ---------------- | -------------------------------------------- | ---------------------------------------- |
| Page text        | `text-foreground` / `text-muted-foreground`  | `text-gray-900/600`, `dark:text-gray-100/300` |
| Card surface     | `Card` default (`bg-card`, `border`)         | `bg-white dark:bg-gray-800`, `border-gray-200` |
| Brand accent     | `text-primary` / `bg-primary`                | `indigo-600`, `bg-indigo-600 hover:bg-indigo-700` |
| Muted wash       | `bg-muted/40`, `hover:bg-muted/60`           | `bg-gray-50`, `bg-indigo-50`             |
| Focus            | `focus-visible:` + default ring              | removing outline without replacement     |

`SocialList` cards already use tokens; `/lessons` cards + indigo buttons are
the remaining legacy instances to migrate.

## 4. Cards & grids

- Stats: `grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4`, one `Card` per stat
  with `CardHeader pb-2` → `CardDescription` (icon + label) → `CardTitle`
  (`text-2xl tabular-nums sm:text-3xl`) → hint (`text-xs`).
- Content: `grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-3` with primary card
  `lg:col-span-2`.
- Community lists (`SocialList`): `grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3`,
  `Card h-full flex flex-col`, `CardContent flex flex-1 flex-col pt-6`, actions
  pinned with `mt-auto pt-6`.
- Testids live on the section + value, never on decoration:
  `data-testid="dashboard-stats"`, `stat-subtopics`, `stat-total-progress`.

## 5. Motion (Emil framework — `/` is the reference)

- Frequency: dashboard/list hovers are seen tens of times/day → keep subtle
  (`-translate-y-0.5`, shadow only). No open/close animation on
  keyboard-initiated or search-filter changes (`SocialList` filters instantly).
- Easing: `ease-out` for enter/hover, `ease-in-out` only for on-screen movement,
  never `ease-in` on UI. Custom punch curve for hover lifts:
  `ease-[cubic-bezier(0.23,1,0.32,1)]`.
- Duration: press `100–160ms`, hover lift `150–200ms`, panel enter `200–250ms`.
  Nothing UI exceeds `300ms`. `animate-float 6s/8s` (marketing landing only)
  is banned from app routes.
- Properties: `transition-[transform,box-shadow]` or `transition-colors` —
  never `transition-all`. Entry from `scale(0.95) + opacity-0`, never `scale(0)`.
- Press feedback: every `Button`/link-card gets
  `transition-transform duration-150 ease-out active:scale-[0.97]`
  (`0.98` for outline rows).
- Gate motion: `motion-safe:` prefix on translate/shadow/enter animations;
  keep `animate-pulse` skeletons under `motion-safe:`.
- Interruptible: CSS `transition` for hovers/toggles; keyframe `animate-in`
  only for one-shot mount enter (stagger `30–80ms` between siblings), never for
  rapidly retriggered state.
- `prefers-reduced-motion`: opacity-only fallbacks; no translate.

## 6. States

- Loading: route `loading.tsx` or `Suspense` fallback with `Skeleton` blocks
  mirroring the shell (`aria-busy="true"`, `aria-label="Loading …"`).
- Empty: `rounded-xl border border-dashed px-6 py-16 text-center` with
  `font-medium` title + `text-muted-foreground text-sm` hint (`SocialList`
  empty state is the reference).
- Error/unavailable: `Card mt-6` with message + `Button asChild` recovery link
  (`/` stats-null fallback is the reference).

## 7. Migration checklist (lessons / social → this doc)

- [ ] `/lessons` header: add eyebrow + subtitle, switch `text-gray-900` → tokens.
- [ ] `/lessons` cards: drop `border-gray-200 bg-white dark:bg-gray-800`, use default `Card`.
- [ ] `/lessons` buttons/links: `indigo-600` → `primary` variants.
- [ ] `/social` shell: collapse extra `div > div` wrapper, adopt §1 `<main>`.
- [ ] `/social` search icon: `text-gray-400` → `text-muted-foreground`.
- [ ] Both: verify `dark` class has zero `gray-*`/`indigo-*` remnants via
  `rg "gray-|indigo-" src/app/\(app\)/{lessons,social}`.
