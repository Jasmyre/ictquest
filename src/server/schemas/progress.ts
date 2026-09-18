import { z } from "zod";

export const listProgressSchema = z.object({
  skip: z.number().min(0).optional(),
  take: z.number().min(1).max(100).optional(),
});

export const createProgressSchema = z.object({
  topic: z.string().min(1),
  subtopic: z.string().min(1),
});

export const statsByIdSchema = z.object({
  id: z.string().min(1),
});

export type ListProgressInput = z.infer<typeof listProgressSchema>;
export type CreateProgressInput = z.infer<typeof createProgressSchema>;
export type StatsByIdInput = z.infer<typeof statsByIdSchema>;

/**
 * REST output schemas (Migration 18, #41 / ADR 0005).
 *
 * Every versioned procedure needs an explicit `.output()` schema so
 * `trpc-to-openapi` can generate the public OpenAPI document. Shapes mirror
 * the service return values (`{ success: true, data }`).
 */
export const progressRowSchema = z.object({
  id: z.string(),
  userId: z.string(),
  topic: z.string(),
  subtopics: z.array(z.string()),
});

export const listProgressOutputSchema = z.object({
  success: z.literal(true),
  data: z.array(progressRowSchema),
});

export const createProgressOutputSchema = z.object({
  success: z.literal(true),
  data: progressRowSchema,
});

export const deleteAllProgressOutputSchema = z.object({
  success: z.literal(true),
});
