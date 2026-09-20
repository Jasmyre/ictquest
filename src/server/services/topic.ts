import "server-only";
import { TRPCError } from "@trpc/server";
import {
  createTopicRepository,
  type TopicRepository,
} from "@/server/repositories/topic";

/**
 * Topic service (Slice 6, #63).
 *
 * Owns the Lesson → Topic → Subtopic-Step hierarchy rules plus content
 * blocks. Hierarchy persistence lives in
 * `src/server/repositories/topic.ts` (derived from the versioned lesson
 * files) — this module owns the ownership rule and never reads the
 * catalog directly except through the injected repository.
 */

export type TopicNode = import("@/server/repositories/topic").TopicNode;

/**
 * Hierarchy ownership rule: a subtopic belongs to exactly one lesson.
 * Throws NOT_FOUND when the `(lesson, subtopic)` pair does not exist so
 * cross-lesson writes resolve to "no such step" instead of attaching to
 * the wrong lesson.
 */
export function assertSubtopicOwnership(
  repository: TopicRepository,
  lesson: string,
  subtopic: string
): void {
  if (!repository.subtopicBelongsToLesson(lesson, subtopic)) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Subtopic "${subtopic}" does not belong to lesson "${lesson}".`,
    });
  }
}

export function listTopicsForLesson(
  repository: TopicRepository,
  lesson: string
): { success: true; data: TopicNode[] } {
  const topics = repository.listTopics(lesson);
  if (topics.length === 0) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Lesson "${lesson}" has no topics.`,
    });
  }
  return { success: true as const, data: topics };
}

export function listTopicHierarchy(repository: TopicRepository): {
  success: true;
  data: Array<{ lesson: string; topics: TopicNode[] }>;
} {
  return { success: true as const, data: repository.listHierarchy() };
}

/** Default-repository conveniences for thin controllers. */
export function getTopicsForLesson(lesson: string) {
  return listTopicsForLesson(createTopicRepository(), lesson);
}

export function getTopicHierarchy() {
  return listTopicHierarchy(createTopicRepository());
}

export function checkSubtopicOwnership(lesson: string, subtopic: string): void {
  assertSubtopicOwnership(createTopicRepository(), lesson, subtopic);
}
