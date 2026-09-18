import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
  getLessonOutputSchema,
  lessonParamsSchema,
  listLessonsOutputSchema,
} from "@/server/schemas/lesson";
import {
  getLessonContentEntry,
  listLessonContent,
} from "@/server/services/lesson-content";

/**
 * Lesson read router (Migration 19, #42 / ADR 0001 + ADR 0005).
 *
 * MDX-backed catalog reads served only after the MDX store landed (#29,
 * #32). Both operations are public and cacheable at the `/api/v1` catch-all
 * (`public, s-maxage=3600`); per-user stats stay `private, no-store`.
 * There are intentionally no lesson writes — curriculum stays dev-authored
 * in git.
 */
export const lessonRouter = createTRPCRouter({
  list: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/v1/lessons",
        tags: ["lessons"],
        summary: "List lesson catalog entries",
      },
    })
    .input(z.object({}))
    .output(listLessonsOutputSchema)
    .query(() => listLessonContent()),

  get: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/v1/lessons/{lesson}/{subtopic}",
        tags: ["lessons"],
        summary: "Read one lesson entry",
      },
    })
    .input(lessonParamsSchema)
    .output(getLessonOutputSchema)
    .query(({ input }) => getLessonContentEntry(input.lesson, input.subtopic)),
});
