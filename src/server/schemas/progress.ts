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
