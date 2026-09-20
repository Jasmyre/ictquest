import "server-only";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parseLessonFrontmatter } from "@/lib/lessons/mdx";

export type LessonEntry = {
  lesson: string;
  subtopic: string;
  slug: string;
  title: string;
  order: number;
  file: string;
};

/**
 * Lesson repository (Slice 6, #63).
 *
 * Owns all Lesson persistence. Lessons are versioned files in git
 * (`content/lessons/<lesson>/<subtopic>.mdx`), never tables — so this
 * repository reads the filesystem instead of Prisma. Services must call
 * these helpers instead of touching `fs` or frontmatter parsing directly.
 */

function listEntries(contentDir: string): LessonEntry[] {
  const entries: LessonEntry[] = [];
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
      entries.push({ ...frontmatter, file: `${lesson.name}/${file}` });
    }
  }
  entries.sort((a, b) =>
    a.lesson === b.lesson ? a.order - b.order : a.lesson.localeCompare(b.lesson)
  );
  return entries;
}

export type LessonRepository = {
  listEntries(): LessonEntry[];
  getEntry(lesson: string, subtopic: string): LessonEntry | null;
};

export function createLessonRepository(
  contentDir = join(process.cwd(), "content", "lessons")
): LessonRepository {
  return {
    listEntries(): LessonEntry[] {
      return listEntries(contentDir);
    },
    getEntry(lesson: string, subtopic: string): LessonEntry | null {
      return (
        listEntries(contentDir).find(
          (entry) => entry.lesson === lesson && entry.subtopic === subtopic
        ) ?? null
      );
    },
  };
}
