import { z } from "zod";

/**
 * Topic schemas (Slice 6, #63).
 *
 * Shared controller/business contract for the Lesson → Topic →
 * Subtopic-Step hierarchy. Topics are derived from the versioned lesson
 * files, never tables — these schemas pin the hierarchy shapes so
 * controllers and services agree on ownership lookups.
 */

export const topicNodeSchema = z.object({
  lesson: z.string(),
  subtopics: z.array(z.string()),
});

export const topicParamsSchema = z.object({
  lesson: z.string().min(1),
});

export type TopicParamsInput = z.infer<typeof topicParamsSchema>;

export const topicOwnershipSchema = z.object({
  lesson: z.string().min(1),
  subtopic: z.string().min(1),
});

export type TopicOwnershipInput = z.infer<typeof topicOwnershipSchema>;

export const listTopicsOutputSchema = z.object({
  success: z.literal(true),
  data: z.array(topicNodeSchema),
});

export const topicHierarchySchema = z.object({
  lesson: z.string(),
  topics: z.array(topicNodeSchema),
});

export const listHierarchyOutputSchema = z.object({
  success: z.literal(true),
  data: z.array(topicHierarchySchema),
});
