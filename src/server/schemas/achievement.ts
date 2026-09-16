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
