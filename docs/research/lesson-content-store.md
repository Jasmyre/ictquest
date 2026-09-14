# Research: Lesson content store

- Canonical path: `docs/research/lesson-content-store.md` (this file).
- Source: throwaway branch `research/lesson-content-store`, scratch file
  `.scratch/ictquest-structure-migration/research-lesson-content-store.md` (not merged; do not read scratch paths at runtime).
- Wayfinder: #16 map, ticket #18 (lesson content store). Spec: #23.
- Date: 2026-09-14.
- Question: most convenient non-static replacement for `src/db/lessons.tsx` + `src/db/html_*` TSX files which embed JSX in data.
- Decision (frozen in ADR 0001): local MDX content collection (`content/lessons/**/*.mdx` + `mdx-components.tsx`); Prisma/Postgres kept for progress metadata only.

## 1. Current state (from source)

- `src/db/lessons.tsx:19-36` — `LessonContent.contents[].content[].label` is typed as
  `string | JSX.Element | ((props: { setIsFinished; setNumberOfCorrect; setNumberOfInCorrect }) => JSX.Element)`.
  Content is code, not data: every lesson step bundles prose plus live component closures.
- `src/db/introduction_to_html/html-introduction.tsx:9-210` — representative file. `text`
  blocks are plain strings; `element` blocks embed `<Image>`, `<CodeBlock code language
  initialCode>`, `<CodeHighlight>`, `<Browser content title>`, and function-labels returning
  `<Practice choices shuffledData ... />` (commented-out blocks show the same pattern for
  `<MultipleChoice>`). Interactive blocks close over quiz state setters.
- Consumers import statically: `src/app/lessons/page.tsx:6` (`import { lessons } from "@/db/lessons"`),
  `src/app/lessons/[topic]/page.tsx:9`, and client stepper
  `src/components/pages/lessons/subtopic/lesson.tsx:10,34-38` (`lessons.find(...)`,
  `lesson?.content?.[subtopic]`, index-stepper gated by `isFinished`). No fetching, no DB read for content.
- Component inventory (`src/components/`): `code-highlight.tsx` (pure presentational `<code>`),
  `code.tsx` (Prism + DOMPurify, props `{ language, initialCode, code }` — serializable),
  `browser.tsx` (`{ title, content: string }` — serializable, renders via iframe `doc.write`),
  `multiple-choice.tsx` / `practice.tsx` (stateful: `setNumberOfCorrectAction` /
  `setNumberOfInCorrectAction` / `setIsFinishedAction` callbacks + `choices/shuffledData/title/response` props).
- Stack (`package.json`): `next ^16.0.7`, `react ^19.2.1`, `prisma ^7.2.0` + `@prisma/client ^7.2.0` +
  `@prisma/adapter-pg ^7.2.0`, `pg`, Postgres datasource (`prisma/schema.prisma:5-7`). No MDX packages
  installed. `next.config.ts:10` has `cacheComponents: true`.
- Schema (`prisma/schema.prisma`): `User / ProgressData / Account / Achievement / UserAchievement / Post`
  only. No `Lesson / Topic / Step` models. `ProgressData { topic: String, subtopics: String[] }` keys off
  lesson/topic slugs as opaque strings, so a content-store migration does not break progress as long as
  slugs are preserved.

Implication: any replacement must handle (a) long prose, (b) serializable demo props
(`Browser.content`, `CodeBlock.code`), and (c) stateful quiz islands that currently receive
stepper callbacks via function-labels.

## 2. Options surveyed (primary sources)

### Option A — Prisma-backed lessons (Postgres tables + JSON/MDX payload)

- Shape: new models e.g. `Lesson { slug, title, description, order }`,
  `Subtopic { slug, lessonId, title, order }`,
  `Step { subtopicId, order, submitLabel, blocks: Json }` where `blocks` is a typed discriminated union
  (`{ type: "text", md } | { type: "code", language, code, initialCode } | { type: "browser", title, content } |
   { type: "quiz", kind, choices, answer, response }`), or `Step { mdx: String }` storing MDX source.
  Rendered by a server component fetching via Prisma + a block renderer mapping union to existing components.
- Sources: `prisma/schema.prisma` (current models, Postgres datasource); `@prisma/adapter-pg` in `package.json`;
  Prisma Postgres + Json support in Prisma docs (Json type, paginated reads). Fits existing tRPC pattern
  (`api.user.getUserProgress` in `[topic]/page.tsx:28`).
- Authoring: poor-to-medium without an admin UI — authors edit JSON/MDX strings in Studio/seed scripts.
  Good once an admin editor exists (ordering, drafts, publishing straightforward in SQL).
- JSX needs: solvable but requires a renderer contract. Serializable blocks (`code`, `browser`) map 1:1.
  Quiz islands need refactor: function-labels become data (`choices/answer`) + the stepper injects
  `setIsFinished/...` at render time (same as `lesson.tsx:223-231` today, but driven by block type
  instead of `typeof label === "function"`).
- Migration cost: medium-high. Mechanical extraction of strings is easy; every `element` block needs
  reclassification into the union; need new Prisma models, migration, seed script from current TSX,
  tRPC read procedures, and cache handling for DB reads.

### Option B — MDX content collection (local `.mdx` files, optional DB mirror) — CHOSEN

- Shape: `content/lessons/<lesson>/<subtopic>.mdx` with frontmatter (`title, slug, order, submitLabels`) +
  body mixing markdown prose and JSX tags (`<CodeBlock/>`, `<Browser/>`, `<Practice/>`, `<MultipleChoice/>`).
  Global map in `mdx-components.tsx`. Local build via `@next/mdx` (`pageExtensions`, `createMDX`), or DB-stored
  MDX strings rendered on demand via `<MDXRemote source={...} components={...} />` from `next-mdx-remote/rsc`.
- Sources: Next.js docs "How to use markdown and MDX in Next.js" (`https://nextjs.org/docs/app/guides/mdx`,
  v16.3.4, updated 2026-08-25): `@next/mdx` + `@mdx-js/loader` + `@mdx-js/react` + `@types/mdx`, `createMDX()`,
  `mdx-components.tsx` required for App Router, remote-MDX pattern with `next-mdx-remote/rsc`;
  `next-mdx-remote` npm v6.0.0 (RSC `source` prop); maintained fork `next-mdx-remote-client` v2.x for
  React 19 / Next 15+16 (primary alternative since `hashicorp/next-mdx-remote` is archived). Note: with
  Turbopack, `transpilePackages: ['next-mdx-remote']` is currently required.
- Authoring: best of the three for this repo. Prose becomes markdown (diffable, no TSX boilerplate); demos
  stay as JSX tags with string props; no admin UI needed — edits are git PRs. Frontmatter gives ordering/metadata.
- JSX needs: native fit. MDX is "a superset of markdown that lets you write JSX directly in your markdown
  files... embed React components" (Next.js guide). `CodeHighlight/Browser/CodeBlock` work unchanged via the
  component map. Stateful quizzes work if the stepper's `isFinished` gating moves out of content closures:
  MDX declares `<PracticeQuiz id ... />` / `<MultipleChoiceQuiz ... />` as data-props, and a client wrapper
  injects the callbacks (same injection point as today). Step-gating (`contents[].submit.label`, `lesson.tsx`
  index stepper) needs a convention: one MDX file per step, or `<Step submit="Continue">` wrappers, or
  frontmatter-delimited steps.
- Migration cost: low-medium. Mostly mechanical: `text` labels to markdown paragraphs; static `element` JSX
  to inline JSX tags; function-label quizzes to tagged components with hoisted `choices` data. `shuffle()` calls
  inside content (e.g. `html-introduction.tsx:190`) move into the component or a remark/rehype step. Slugs
  preserved so `ProgressData` is unaffected. New deps + `next.config` + `mdx-components.tsx` required;
  `cacheComponents: true` composes well with static MDX imports.

### Option C — Lightweight headless CMS (git-based or hosted)

- Shape: e.g. Keystatic/Outstatic (git-backed MDX, no extra infra), or hosted Sanity/Contentful/Payload with
  rich-text/JSON fields + webhook revalidation. Content edited in a dashboard; Next.js fetches at build/request time.
- Sources: vendor docs (Sanity/Contentful/Keystatic/Outstatic/Payload) + this repo's lack of any CMS wiring
  (no CMS deps in `package.json`, no webhook/revalidation routes). General Next.js CMS pattern: fetch-on-server +
  `revalidateTag`/webhook; MDX-field variants still render through the Option B pipeline.
- Authoring: best for non-technical editors (dashboard, previews, roles). Overkill here: curriculum is HTML
  lessons authored by developers; team already edits TSX in git.
- JSX needs: weakest link. CMS rich-text/Portable Text does not natively host arbitrary interactive React islands
  (`Practice` with callback props, `Browser` iframe payloads). Requires custom serializers/block schemas
  replicating Option A's union, plus sanitization for raw HTML (`dompurify` precedent in `code.tsx:29`).
  Quiz interactivity needs the same callback-injection refactor plus CMS schema work.
- Migration cost: highest. Content modeling + serializer + preview + auth/webhooks + vendor lock-in/infra, on top
  of the Option A renderer refactor. Justified only if non-dev authoring or multi-channel publishing becomes
  a requirement.

## 3. Comparison

| Axis | A: Prisma/JSON-MDX in Postgres | B: MDX files (+ optional DB mirror) | C: Headless CMS |
|---|---|---|---|
| Authoring convenience | Low now (JSON in Studio/seeds); high after admin UI | High now (markdown + JSX in git, no new UI) | High for non-devs; new dashboard/roles to run |
| Code-highlight / browser demos | Good (serializable props map cleanly) | Excellent (native JSX tags, same components) | Medium (needs custom block serializers) |
| Quizzes (`MultipleChoice`, `Practice` + stepper callbacks) | Needs callback-injection refactor; data-driven | Same refactor but smaller: MDX tags + wrapper injects callbacks | Same refactor + CMS schema/serializer work |
| Migration cost from `src/db/*` | Medium-high (models, seeds, tRPC, renderer) | Low-medium (mostly mechanical TSX to MDX) | High (model + CMS + serializer + infra) |
| Fit: Next 16 `cacheComponents`, Prisma 7, Postgres | Good (DB reads cacheable; reuses tRPC/Prisma) | Excellent (static MDX prerenders; DB stays for progress only) | Good but adds fetch/revalidation surface |

## 4. Recommendation (frozen as ADR 0001)

Local MDX content collection (`content/lessons/**/*.mdx` + `mdx-components.tsx`), with Prisma/Postgres kept
for progress/ordering metadata only. Lowest migration cost, preserves all JSX/component needs natively, best
authoring for dev-written lessons, zero new infra, composes with `cacheComponents: true`, and leaves the door
open to store MDX source strings in Postgres later (rendered via `next-mdx-remote/rsc`) without changing the
authoring format. Concretes: one `.mdx` per subtopic (or per step with `<Step submit="Continue">`); frontmatter
`{ lesson, subtopic, slug, title, order }`; component map exposes `CodeBlock, CodeHighlight, Browser,
PracticeQuiz, MultipleChoiceQuiz` (thin wrappers injecting stepper callbacks); seed/CI slug-parity check.
Trade-off accepted: no non-dev dashboard (C's strength) and no runtime lesson editing (A's strength); both layer
later (mirror MDX source into a `LessonStep.mdx` column if ever requested).

## 5. Migration sketch (for later tickets, not this baseline)

1. Add `@next/mdx @mdx-js/loader @mdx-js/react @types/mdx` (or `next-mdx-remote-client` if DB-stored MDX is
   preferred); wire `createMDX` + `mdx-components.tsx`.
2. Convert one file (`html-introduction.tsx`) to `content/lessons/introduction-to-html/html_introduction.mdx`
   as a pilot; build quiz wrapper components accepting data-props + injected `setIsFinished/...`.
3. Replace `lessons.find()` content lookups with MDX imports (keep `src/db/lessons.tsx` types/slugs as the
   manifest during transition); verify `ProgressData` slugs unchanged.
4. Delete converted `html_*` TSX files one lesson at a time.

## 6. Sources

- Repo: `src/db/lessons.tsx`, `src/db/introduction_to_html/html-introduction.tsx`, `src/app/lessons/page.tsx`,
  `src/app/lessons/[topic]/page.tsx`, `src/components/pages/lessons/subtopic/lesson.tsx`,
  `src/components/{code,code-highlight,browser,multiple-choice,practice}.tsx`, `package.json`,
  `prisma/schema.prisma`, `next.config.ts`.
- Next.js official guide "How to use markdown and MDX in Next.js" — `https://nextjs.org/docs/app/guides/mdx`
  (local `@next/mdx` config, `mdx-components.tsx` requirement, remote-MDX via `next-mdx-remote/rsc`, RCE caution
  for untrusted MDX).
- `next-mdx-remote` npm v6.0.0 + `hashicorp/next-mdx-remote` README (archived; RSC `source`-prop usage;
  Turbopack `transpilePackages` note) + maintained fork `ipikuka/next-mdx-remote-client` v2.x
  (React 19 / Next 15-16 support).
