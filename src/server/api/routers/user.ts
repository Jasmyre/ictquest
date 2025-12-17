import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  getUser: privateProcedure.query(({ ctx }) => {
    const { user } = ctx;

    if (!user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Authorization is unavailable or may have been removed.",
      });
    }

    return { success: true, data: user };
  }),

  getUserProgress: privateProcedure
    .input(
      z.object({
        skip: z.number().min(0).optional(),
        take: z.number().min(1).max(100).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { user } = ctx;
      const { skip = 0, take = 20 } = input;

      try {
        const progress = await db.progressData.findMany({
          where: { userId: user.id },
          skip,
          take,
        });

        return { success: true, data: progress };
      } catch (error) {
        console.error("getUserProgress error:", error);

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Unable to load your progress right now. Please try again later.",
        });
      }
    }),

  getUserAchievements: privateProcedure
    .input(
      z.object({
        skip: z.number().min(0).optional(),
        take: z.number().min(1).max(100).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { user } = ctx;
      const { skip = 0, take = 20 } = input;

      try {
        const achievements = await db.userAchievement.findMany({
          where: { userId: user.id },
          include: { achievement: true },
          skip,
          take,
        });

        return { success: true, data: achievements };
      } catch (error) {
        console.error("getUserAchievements error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Unable to load your achievements right now. Please try again later.",
        });
      }
    }),

  deleteAllUserProgress: privateProcedure.mutation(async ({ ctx }) => {
    const { user } = ctx;

    try {
      await db.progressData.deleteMany({
        where: { userId: user.id },
      });

      return { success: true };
    } catch (error) {
      console.error("deleteAllUserProgress error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "Unable to delete all your progress right now. Please try again later.",
      });
    }
  }),

  deleteAllUserAchievements: privateProcedure.mutation(async ({ ctx }) => {
    const { user } = ctx;

    try {
      await db.userAchievement.deleteMany({
        where: { userId: user.id },
      });

      return { success: true };
    } catch (error) {
      console.error("deleteAllUserAchievement error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "Unable to delete all your achievements right now. Please try again later.",
      });
    }
  }),
});
