import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { TRPCError } from "@trpc/server";
import { parseLessonFrontmatter } from "@/lib/lessons/mdx";

export type LessonContentEntry = {
  lesson: string;
  subtopic: string;
  slug: string;
  title: string;
  order: number;
  file: string;
};

/**
 * Lesson-content read service (Migration 15, #38).
 *
 * The admin lessons view reads the same MDX-backed store the learner routes
 * render (`content/lessons/<lesson>/<subtopic>.mdx` with frontmatter
 * carrying lesson, subtopic, slug, title, and order). Curriculum stays
 * dev-authored in git: this seam is intentionally read-only — there are no
 * runtime lesson-write mutations, no headless CMS, and no non-developer
 * dashboard editing promises.
 */
export function listLessonContentEntries(
  contentDir = join(process.cwd(), "content", "lessons")
): LessonContentEntry[] {
  const entries: LessonContentEntry[] = [];
  for (const lesson of readdirSync(contentDir, { withFileTypes: true })) {
    if (!lesson.isDirectory()) {
      continue;
    }
    const lessonDir = join(contentDir, lesson.name);
    for (const file of readdirSync(lessonDir)) {
      if (!file.endsWith(".mdx")) {
        continue;
      }
      const source = readFileSync(join(lessonDir, file), "utf8");
      const frontmatter = parseLessonFrontmatter(source);
      entries.push({
        ...frontmatter,
        file: `${lesson.name}/${file}`,
      });
    }
  }
  entries.sort((a, b) =>
    a.lesson === b.lesson ? a.order - b.order : a.lesson.localeCompare(b.lesson)
  );
  return entries;
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
  const entries = listLessonContentEntries(contentDir);
  const found = entries.find(
    (e) => e.lesson === lesson && e.subtopic === subtopic
  );
  if (!found) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Lesson not found.",
    });
  }
  return { success: true as const, data: found };
}
