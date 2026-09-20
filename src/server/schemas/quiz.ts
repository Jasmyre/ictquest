import { z } from "zod";

/**
 * Quiz schemas (Slice 6, #63).
 *
 * Shared controller/business contract for standalone quizzes plus the
 * attempt gate. Quizzes are standalone and attempt-required: finishing a
 * lesson always requires an attempt, at any score. Attempt persistence
 * stays with the caller (client-side gate); these schemas pin the
 * catalog shapes and the attempt input contract.
 */

export const quizEntrySchema = z.object({
  id: z.string(),
  lesson: z.string(),
  subtopic: z.string(),
  title: z.string(),
});

export const listQuizzesSchema = z.object({
  lesson: z.string().min(1).optional(),
});

export type ListQuizzesInput = z.infer<typeof listQuizzesSchema>;

export const quizByIdSchema = z.object({
  id: z.string().min(1),
});

export type QuizByIdInput = z.infer<typeof quizByIdSchema>;

export const recordAttemptSchema = z.object({
  quizId: z.string().min(1),
  score: z.number().min(0).max(100),
});

export type RecordAttemptInput = z.infer<typeof recordAttemptSchema>;

export const listQuizzesOutputSchema = z.object({
  success: z.literal(true),
  data: z.array(quizEntrySchema),
});

export const getQuizOutputSchema = z.object({
  success: z.literal(true),
  data: quizEntrySchema,
});

export const attemptSchema = z.object({
  quizId: z.string(),
  userId: z.string(),
  score: z.number().min(0).max(100),
});

export const recordAttemptOutputSchema = z.object({
  success: z.literal(true),
  data: attemptSchema,
});
