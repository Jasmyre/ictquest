import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import {
  deleteAllAchievements,
  listAchievements,
  unlockAchievement,
} from "@/server/services/achievement";
import {
  createProgress,
  deleteAllProgress,
  getStatsById,
  listProgress,
} from "@/server/services/progress";

export const userRouter = createTRPCRouter({
  getUser: privateProcedure.query(({ ctx }) => {
    const { user } = ctx;

    if (!user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User is not authenticated.",
      });
    }

    return { success: true, data: user };
  }),

  addProgress: privateProcedure
    .input(
      z.object({
        topic: z.string().min(1),
        subtopic: z.string().min(1),
      })
    )
    .mutation(({ ctx, input }) => {
      if (!ctx.user?.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authenticated",
        });
      }
      // Backward-compatible alias fed by the canonical progress service (#35).
      return createProgress(ctx.db, ctx.user.id as string, input);
    }),

  getUserProgress: privateProcedure
    .input(
      z.object({
        skip: z.number().min(0).optional(),
        take: z.number().min(1).max(100).optional(),
      })
    )
    .query(({ ctx, input }) =>
      // Backward-compatible alias fed by the canonical progress service (#35).
      listProgress(ctx.db, ctx.user.id as string, input)
    ),

  getUserAchievements: privateProcedure
    .input(
      z.object({
        skip: z.number().min(0).optional(),
        take: z.number().min(1).max(100).optional(),
      })
    )
    .query(({ ctx, input }) =>
      // Backward-compatible alias fed by the canonical achievement service (#36).
      listAchievements(ctx.db, ctx.user.id as string, input)
    ),

  deleteAllUserProgress: privateProcedure.mutation(({ ctx }) =>
    // Backward-compatible alias fed by the canonical progress service (#35).
    deleteAllProgress(ctx.db, ctx.user.id as string)
  ),

  deleteAllUserAchievements: privateProcedure.mutation(({ ctx }) =>
    // Backward-compatible alias fed by the canonical achievement service (#36).
    deleteAllAchievements(ctx.db, ctx.user.id as string)
  ),

  unlockUserAchievement: privateProcedure
    .input(
      z.object({
        achievementName: z.string(),
      })
    )
    .mutation(({ ctx, input }) =>
      // Backward-compatible alias fed by the canonical achievement service (#36).
      unlockAchievement(ctx.db, ctx.user.id as string, input)
    ),

  getUserStatsById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) =>
      // Backward-compatible alias fed by the canonical progress service (#35).
      getStatsById(ctx.db, input.id)
    ),
});
