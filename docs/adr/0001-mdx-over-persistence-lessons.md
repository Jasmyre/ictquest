# ADR 0001 — MDX content collection over persistence-backed lessons

- Status: Accepted
- Date: 2026-09-14
- Spec: #23 (execution spec); wayfinder #16, tickets #17 (domain), #18 (lesson store)

## Context

Lesson content lives in `src/db/lessons.tsx` plus `src/db/html_*` TSX files.
`LessonContent.contents[].content[].label` is typed `string | JSX.Element |
((props: { setIsFinished; setNumberOfCorrect; setNumberOfInCorrect }) => JSX.Element)`
(`src/db/lessons.tsx:19-36`): prose plus live component closures. A representative
file (`src/db/introduction_to_html/html-introduction.tsx`) mixes plain-string `text`
blocks with `element` blocks embedding `<Image>`, `<CodeBlock>`, `<CodeHighlight>`,
`<Browser>`, and function-labels returning `<Practice>` / `<MultipleChoice>` that
close over quiz stepper setters. Consumers import statically (`src/app/lessons/page.tsx`,
`src/app/lessons/[topic]/page.tsx`, client stepper
`src/components/pages/lessons/subtopic/lesson.tsx`), so there is no content fetching
today. `prisma/schema.prisma` has no Lesson/Topic models; `ProgressData { topic,
subtopics }` keys off slugs as opaque strings. Stack: Next 16 (`cacheComponents: true`),
React 19, Prisma 7 + Postgres; no MDX packages installed. The map Notes impose a
JSX-in-data ban: lesson-content decisions must not embed presentation code in data.

## Decision

Local MDX content collection: `content/lessons/<lesson>/<subtopic>.mdx` with
frontmatter `{ lesson, subtopic, slug, title, order }`, one file per subtopic (or per
step with a `<Step submit="...">` wrapper / frontmatter-delimited steps). A central
`mdx-components.tsx` map exposes `CodeBlock, CodeHighlight, Browser, PracticeQuiz,
MultipleChoiceQuiz` as thin wrappers that inject stepper callbacks (`setIsFinished`,
`setNumberOfCorrect`, `setNumberOfInCorrect`); shuffle logic lives inside the
component and function-label quizzes become tagged components with hoisted data.
Prisma/Postgres stays for progress metadata only. Slugs stay stable so existing
`ProgressData` keys are unaffected, plus a seed/CI slug-parity check. The JSX-in-data
ban is satisfied structurally (JSX lives in MDX plus the component map, never in row
data) and is still recorded here.

## Alternatives considered

- **A: Prisma-backed lessons** (Lesson/Subtopic/Step tables + JSON/MDX payload with a
  discriminated block-union renderer). Good once an admin editor exists; medium-high
  migration (models, seeds, tRPC reads, renderer contract, cache handling); poor
  authoring until an admin UI exists.
- **C: Lightweight headless CMS** (git-backed Keystatic/Outstatic or hosted
  Sanity/Contentful/Payload). Best for non-technical editors; weakest for interactive
  islands (custom serializers + the same callback-injection refactor + auth/webhooks);
  highest cost and unjustified for dev-authored curriculum already edited in git.

## Trade-offs

- For: lowest migration cost (mostly mechanical TSX-to-MDX), native JSX fit (MDX is
  markdown plus JSX tags), best authoring for dev-written lessons (diffable, git PRs,
  no new UI), zero new infra, composes with `cacheComponents: true` static prerender.
  Leaves the door open to mirror MDX source into Postgres later without changing the
  authoring format.
- Against: no non-dev dashboard (C's strength), no runtime lesson editing (A's
  strength). Both layer later without format churn.

## Consequences

- Positive: `text` labels become markdown; static JSX becomes inline tags;
  function-label quizzes become data-props plus wrapper-injected callbacks;
  `shuffle()` moves out of content into components; `ProgressData` untouched.
- Negative: requires new deps (`@next/mdx`, `@mdx-js/*`, or `next-mdx-remote-client`
  for DB-stored MDX), `createMDX` wiring, and a step-gating convention to be honored
  by the pilot and per-lesson migrations.
- Follow-ups (later tickets, not this one): MDX pilot slice, per-lesson parity plus
  cache policy, per-user (never public) lesson-body caching, lesson-read REST only
  after the store lands.

## References

- Research (published): `docs/research/lesson-content-store.md` (source:
  `research/lesson-content-store` branch, `.scratch/ictquest-structure-migration/research-lesson-content-store.md`).
- Issues: #17 (six entities; Quiz standalone; Post dropped), #18 (store decision),
  #23 (spec: MDX shape, component map, slug parity, JSX-in-data ban).
