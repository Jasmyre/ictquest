import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import {
  listAchievementsSchema,
  unlockAchievementSchema,
} from "@/server/schemas/achievement";
import {
  deleteAllAchievements,
  listAchievements,
  unlockAchievement,
} from "@/server/services/achievement";

/**
 * Achievement router (Migration 13, #36).
 *
 * Canonical per-user achievement list/unlock/delete. Fed by the same service
 * helpers as the legacy `user` achievement procedures so the
 * unlock-to-inventory journey (lesson/compliments unlock, profile inventory)
 * persists per user and survives re-login.
 */
export const achievementRouter = createTRPCRouter({
  list: privateProcedure
    .input(listAchievementsSchema)
    .query(({ ctx, input }) =>
      listAchievements(ctx.db, ctx.user.id as string, input)
    ),

  unlock: privateProcedure
    .input(unlockAchievementSchema)
    .mutation(({ ctx, input }) =>
      unlockAchievement(ctx.db, ctx.user.id as string, input)
    ),

  deleteAll: privateProcedure.mutation(({ ctx }) =>
    deleteAllAchievements(ctx.db, ctx.user.id as string)
  ),
});
