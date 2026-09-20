import { join } from "node:path";
import { TRPCError } from "@trpc/server";
import { createLessonRepository } from "@/server/repositories/lesson";

export type LessonEntry = import("@/server/repositories/lesson").LessonEntry;

/**
 * Lesson-content read service (Migration 15, #38; repository tier in
 * Slice 6, #63).
 *
 * The admin lessons view reads the same MDX-backed store the learner routes
 * render (`content/lessons/<lesson>/<subtopic>.mdx` with frontmatter
 * carrying lesson, subtopic, slug, title, and order). Curriculum stays
 * dev-authored in git: this seam is intentionally read-only — there are no
 * runtime lesson-write mutations, no headless CMS, and no non-developer
 * dashboard editing promises.
 *
 * Catalog persistence lives in `src/server/repositories/lesson.ts` —
 * this module owns the read rules (ordering is repository-owned;
 * NOT_FOUND mapping lives here) and never touches `fs` directly.
 */
export function listLessonContentEntries(
  contentDir = join(process.cwd(), "content", "lessons")
): LessonEntry[] {
  return createLessonRepository(contentDir).listEntries();
}

export function listLessonContent(
  contentDir = join(process.cwd(), "content", "lessons")
) {
  try {
    return {
      success: true as const,
      data: listLessonContentEntries(contentDir),
    };
  } catch (error) {
    console.error("listLessonContent error:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Unable to load lesson content right now. Try again later.",
    });
  }
}

/**
 * Single lesson read (Migration 19, #42).
 *
 * Looks up one MDX entry by its stable `(lesson, subtopic)` key — the same
 * pair stored in ProgressData rows. Throws NOT_FOUND when the pair does not
 * exist so the v1 REST seam returns 404 with a shaped error.
 */
export function getLessonContentEntry(
  lesson: string,
  subtopic: string,
  contentDir = join(process.cwd(), "content", "lessons")
) {
  const found = createLessonRepository(contentDir).getEntry(lesson, subtopic);
  if (!found) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Lesson not found.",
    });
  }
  return { success: true as const, data: found };
}
