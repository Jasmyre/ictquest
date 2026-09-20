import "server-only";
import {
  createLessonRepository,
  type LessonEntry,
  type LessonRepository,
} from "@/server/repositories/lesson";

export type TopicNode = {
  /** Lesson slug — the `topic` half of ProgressData keys. */
  lesson: string;
  /** Content keys — the `subtopic` half of ProgressData keys. */
  subtopics: string[];
};

export type TopicHierarchy = {
  lesson: string;
  topics: TopicNode[];
};

/**
 * Topic repository (Slice 6, #63).
 *
 * Owns the Lesson → Topic → Subtopic-Step hierarchy. Topics are derived
 * from the versioned lesson files (one file per Subtopic-Step), so this
 * repository delegates catalog reads to the lesson repository and shapes
 * them into hierarchy nodes. Hierarchy ownership lives here: every
 * subtopic belongs to exactly one lesson, and cross-lesson lookups resolve
 * to `null` instead of leaking adjacent content.
 */

export type TopicRepository = {
  listTopics(lesson: string): TopicNode[];
  listHierarchy(): TopicHierarchy[];
  subtopicBelongsToLesson(lesson: string, subtopic: string): boolean;
  findEntry(lesson: string, subtopic: string): LessonEntry | null;
};

export function createTopicRepository(
  lessonRepository: LessonRepository = createLessonRepository()
): TopicRepository {
  return {
    listTopics(lesson: string): TopicNode[] {
      const subtopics = lessonRepository
        .listEntries()
        .filter((entry) => entry.lesson === lesson)
        .map((entry) => entry.subtopic);
      if (subtopics.length === 0) {
        return [];
      }
      return [{ lesson, subtopics }];
    },
    listHierarchy(): TopicHierarchy[] {
      const byLesson = new Map<string, string[]>();
      for (const entry of lessonRepository.listEntries()) {
        const group = byLesson.get(entry.lesson) ?? [];
        group.push(entry.subtopic);
        byLesson.set(entry.lesson, group);
      }
      return [...byLesson.entries()].map(([lesson, subtopics]) => ({
        lesson,
        topics: [{ lesson, subtopics }],
      }));
    },
    subtopicBelongsToLesson(lesson: string, subtopic: string): boolean {
      return lessonRepository.getEntry(lesson, subtopic) !== null;
    },
    findEntry(lesson: string, subtopic: string): LessonEntry | null {
      return lessonRepository.getEntry(lesson, subtopic);
    },
  };
}
