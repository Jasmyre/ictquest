import "server-only";
import { TRPCError } from "@trpc/server";
import {
  createQuizRepository,
  type QuizRepository,
} from "@/server/repositories/quiz";
import type { RecordAttemptInput } from "@/server/schemas/quiz";

/**
 * Quiz service (Slice 6, #63).
 *
 * Owns the standalone-quiz plus attempt rules. The quiz catalog lives in
 * `src/server/repositories/quiz.ts` (derived from the versioned lesson
 * files: one standalone quiz per Subtopic-Step) — this module owns the
 * attempt-required gate and never reads the catalog except through the
 * injected repository.
 */

export type QuizAttempt = import("@/server/repositories/quiz").QuizAttempt;
export type QuizEntry = import("@/server/repositories/quiz").QuizEntry;

/**
 * Attempt gating rule: finishing a lesson always requires an attempt, at
 * any score. A learner with zero attempts for the quiz has not finished
 * the step, no matter how they reached the completion call.
 */
export function canCompleteLesson(attempts: QuizAttempt[]): boolean {
  return attempts.length > 0;
}

/**
 * Completion gate: throws PRECONDITION_FAILED when the learner has no
 * recorded attempt, so the client-side completion call fails loudly
 * instead of silently recording an ungated finish.
 */
export function requireQuizAttemptForCompletion(attempts: QuizAttempt[]): void {
  if (!canCompleteLesson(attempts)) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "A quiz attempt is required before completing this lesson.",
    });
  }
}

export function validateAttemptScore(score: number): void {
  if (!Number.isFinite(score) || score < 0 || score > 100) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Score must be between 0 and 100.",
    });
  }
}

export function recordQuizAttempt(
  repository: QuizRepository,
  userId: string,
  input: RecordAttemptInput
): { success: true; data: QuizAttempt } {
  const quiz = repository.getQuiz(input.quizId);
  if (!quiz) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Quiz not found." });
  }
  validateAttemptScore(input.score);
  return {
    success: true as const,
    data: repository.buildAttempt(userId, quiz.id, input.score),
  };
}

export function listQuizzes(
  repository: QuizRepository,
  lesson?: string
): { success: true; data: QuizEntry[] } {
  return { success: true as const, data: repository.listQuizzes(lesson) };
}

export function getQuiz(
  repository: QuizRepository,
  id: string
): { success: true; data: QuizEntry } {
  const quiz = repository.getQuiz(id);
  if (!quiz) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Quiz not found." });
  }
  return { success: true as const, data: quiz };
}

/** Default-repository conveniences for thin controllers. */
export function getQuizzes(lesson?: string) {
  return listQuizzes(createQuizRepository(), lesson);
}

export function getQuizById(id: string) {
  return getQuiz(createQuizRepository(), id);
}

export function submitQuizAttempt(userId: string, input: RecordAttemptInput) {
  return recordQuizAttempt(createQuizRepository(), userId, input);
}
