import { z } from "zod";

/**
 * REST schemas for MDX-backed lesson reads (Migration 19, #42 / ADR 0001).
 *
 * Lessons are local MDX content (`content/lessons/<lesson>/<subtopic>.mdx`),
 * never tables. Both procedures are public and cacheable; per-user stats stay
 * `private, no-store` at the `/api/v1` catch-all.
 */
export const lessonEntrySchema = z.object({
  lesson: z.string(),
  subtopic: z.string(),
  slug: z.string(),
  title: z.string(),
  order: z.number(),
  file: z.string(),
});

export const listLessonsOutputSchema = z.object({
  success: z.literal(true),
  data: z.array(lessonEntrySchema),
});

export const lessonParamsSchema = z.object({
  lesson: z.string().min(1),
  subtopic: z.string().min(1),
});

export type LessonParamsInput = z.infer<typeof lessonParamsSchema>;

export const getLessonOutputSchema = z.object({
  success: z.literal(true),
  data: lessonEntrySchema,
});
