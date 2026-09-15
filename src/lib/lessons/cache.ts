/**
 * Lesson read-vs-write caching policy (migration 09, #32 / ADR-0001).
 *
 * - Lesson list: cacheable. `src/app/lessons/page.tsx` exports
 *   `revalidate = LESSON_LIST_REVALIDATE` (hourly); the list reads only the
 *   static lesson registry, never per-user rows.
 * - Lesson reads: static. MDX files under `content/lessons/<lesson>/` are
 *   build-time content keyed by `(lesson, subtopic)` params; the subtopic
 *   route renders the static shell from params and must not close over
 *   per-user progress inside a cached component.
 * - Progress writes (and per-user progress reads): always fresh. tRPC
 *   `userRouter` mutations/queries (`addProgress`, `getUserProgress`, …)
 *   run uncached against Postgres — no `"use cache"`, no `revalidate`,
 *   no `unstable_cache` — so stats and completion counts never go stale.
 *
 * Observed by: `src/app/lessons/page.tsx` (revalidate export),
 * `src/app/lessons/[topic]/page.tsx` (progress read outside the cached
 * static shell), `src/server/api/routers/user.ts` (no cache directives).
 */

/** Lesson-list revalidate window in seconds (one hour). */
export const LESSON_LIST_REVALIDATE = 3600;

/** Lesson reads are static build-time content. */
export const LESSON_READ_STATIC = true as const;

/** Progress writes/reads must always hit the database fresh. */
export const PROGRESS_WRITE_FRESH = true as const;

/** Cache tag namespace for the lesson list shell. */
export const LESSON_LIST_TAG = "lesson-list" as const;
