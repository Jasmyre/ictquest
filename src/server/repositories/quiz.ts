import "server-only";
import {
  createLessonRepository,
  type LessonRepository,
} from "@/server/repositories/lesson";

export type QuizEntry = {
  /** Stable quiz id: `<lesson>/<subtopic>`. */
  id: string;
  lesson: string;
  subtopic: string;
  title: string;
};

export type QuizAttempt = {
  quizId: string;
  userId: string;
  score: number;
};

/**
 * Quiz repository (Slice 6, #63).
 *
 * Owns the standalone-quiz catalog plus the attempt record. Quizzes are
 * standalone and attempt-required: every Subtopic-Step ships exactly one
 * quiz derived from the versioned lesson files. Attempts gate lesson
 * completion client-side (any score counts) — persistence of the gate
 * input lives with the caller, this repository only catalogs quizzes and
 * shapes attempt rows for the service seam.
 */

export type QuizRepository = {
  listQuizzes(lesson?: string): QuizEntry[];
  getQuiz(id: string): QuizEntry | null;
  buildAttempt(userId: string, quizId: string, score: number): QuizAttempt;
};

export function createQuizRepository(
  lessonRepository: LessonRepository = createLessonRepository()
): QuizRepository {
  const toQuiz = (
    lesson: string,
    subtopic: string,
    title: string
  ): QuizEntry => ({
    id: `${lesson}/${subtopic}`,
    lesson,
    subtopic,
    title,
  });

  return {
    listQuizzes(lesson?: string): QuizEntry[] {
      return lessonRepository
        .listEntries()
        .filter((entry) => lesson === undefined || entry.lesson === lesson)
        .map((entry) => toQuiz(entry.lesson, entry.subtopic, entry.title));
    },
    getQuiz(id: string): QuizEntry | null {
      const [lesson, subtopic] = id.split("/");
      if (!(lesson && subtopic)) {
        return null;
      }
      const entry = lessonRepository.getEntry(lesson, subtopic);
      if (!entry) {
        return null;
      }
      return toQuiz(entry.lesson, entry.subtopic, entry.title);
    },
    buildAttempt(userId: string, quizId: string, score: number): QuizAttempt {
      return { quizId, userId, score };
    },
  };
}
