import { z } from "zod";

export const listAchievementsSchema = z.object({
  skip: z.number().min(0).optional(),
  take: z.number().min(1).max(100).optional(),
});

export const unlockAchievementSchema = z.object({
  achievementName: z.string().min(1),
});

export type ListAchievementsInput = z.infer<typeof listAchievementsSchema>;
export type UnlockAchievementInput = z.infer<typeof unlockAchievementSchema>;

/**
 * REST output schemas (Migration 18, #41 / ADR 0005).
 *
 * Explicit `.output()` schemas for the versioned achievement procedures.
 * Rows use passthrough so service-side includes (e.g. `achievement`
 * relation) never break OpenAPI validation.
 */
export const achievementRowSchema = z
  .object({
    id: z.number(),
    userId: z.string(),
    achievementId: z.number(),
    achievementName: z.string(),
    achievementDescription: z.string(),
    unlockedAt: z.coerce.date().optional(),
  })
  .passthrough();

export const listAchievementsOutputSchema = z.object({
  success: z.literal(true),
  data: z.array(achievementRowSchema),
});

export const unlockAchievementOutputSchema = z.object({
  success: z.literal(true),
  data: z
    .object({
      message: z.string(),
      status: z.enum(["new", "unlocked"]),
      achievement: achievementRowSchema.nullable(),
    })
    .passthrough(),
});

export const deleteAllAchievementsOutputSchema = z.object({
  success: z.literal(true),
});
