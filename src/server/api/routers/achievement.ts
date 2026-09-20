import { createTRPCRouter, permissionProcedure } from "@/server/api/trpc";
import {
  deleteAllAchievementsOutputSchema,
  listAchievementsOutputSchema,
  listAchievementsSchema,
  unlockAchievementOutputSchema,
  unlockAchievementSchema,
} from "@/server/schemas/achievement";
import {
  deleteAllAchievements,
  listAchievements,
  unlockAchievement,
} from "@/server/services/achievement";

/**
 * Achievement router (Migration 13, #36; versioned REST in Migration 18, #41).
 *
 * Canonical per-user achievement list/unlock/delete. Fed by the same service
 * helpers as the legacy `user` achievement procedures so the
 * unlock-to-inventory journey (lesson/compliments unlock, profile inventory)
 * persists per user and survives re-login.
 *
 * Versioned REST (ADR 0005): all three procedures carry OpenAPI
 * method/path/protection annotations plus explicit output schemas and are
 * served through the force-dynamic `/api/v1` catch-all with bearer-PAT-or-
 * cookie auth.
 */
export const achievementRouter = createTRPCRouter({
  list: permissionProcedure("Achievement", "view")
    .meta({
      openapi: {
        method: "GET",
        path: "/v1/me/achievements",
        protect: true,
        tags: ["me"],
        summary: "List my achievements",
      },
    })
    .input(listAchievementsSchema)
    .output(listAchievementsOutputSchema)
    .query(({ ctx, input }) =>
      listAchievements(ctx.db, ctx.user.id as string, input)
    ),

  unlock: permissionProcedure("Achievement", "create")
    .meta({
      openapi: {
        method: "POST",
        path: "/v1/me/achievements/unlock",
        protect: true,
        tags: ["me"],
        summary: "Unlock an achievement",
      },
    })
    .input(unlockAchievementSchema)
    .output(unlockAchievementOutputSchema)
    .mutation(({ ctx, input }) =>
      unlockAchievement(ctx.db, ctx.user.id as string, input)
    ),

  deleteAll: permissionProcedure("Achievement", "delete")
    .meta({
      openapi: {
        method: "DELETE",
        path: "/v1/me/achievements",
        protect: true,
        tags: ["me"],
        summary: "Delete all my achievements",
      },
    })
    .output(deleteAllAchievementsOutputSchema)
    .mutation(({ ctx }) =>
      deleteAllAchievements(ctx.db, ctx.user.id as string)
    ),
});
