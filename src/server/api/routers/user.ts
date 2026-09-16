import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "@/server/api/trpc";
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
    .query(async ({ ctx, input }) => {
      const { user, db } = ctx;
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

  deleteAllUserProgress: privateProcedure.mutation(({ ctx }) =>
    // Backward-compatible alias fed by the canonical progress service (#35).
    deleteAllProgress(ctx.db, ctx.user.id as string)
  ),

  deleteAllUserAchievements: privateProcedure.mutation(async ({ ctx }) => {
    const { user, db } = ctx;

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

  unlockUserAchievement: privateProcedure
    .input(
      z.object({
        achievementName: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user, db } = ctx;
      const { achievementName } = input;

      if (!user?.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User is not authenticated.",
        });
      }

      try {
        const achievement = await db.achievement.findUnique({
          where: { name: achievementName },
        });

        if (!achievement) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "The achievement is unavailable or may have been removed.",
          });
        }

        const existingUnlock = await db.userAchievement.findUnique({
          where: {
            userId_achievementId: {
              userId: user.id,
              achievementId: achievement.id,
            },
          },
        });

        if (existingUnlock) {
          return {
            success: true,
            data: {
              message: "Achievement already unlocked",
              achievement: existingUnlock,
              status: "unlocked",
            },
          };
        }

        // try creating; handle possible unique-constraint race (P2002)
        try {
          const newUnlock = await db.userAchievement.create({
            data: {
              userId: user.id,
              achievementId: achievement.id,
              achievementName: achievement.name,
              achievementDescription:
                achievement.description ?? "No description",
            },
          });

          return {
            success: true,
            data: {
              message: "Achievement unlocked!",
              achievement: newUnlock,
              status: "new",
            },
          };
        } catch (createErr) {
          // If another concurrent request created the record, return the existing one
          if (
            createErr instanceof Prisma.PrismaClientKnownRequestError &&
            createErr.code === "P2002"
          ) {
            const already = await db.userAchievement.findUnique({
              where: {
                userId_achievementId: {
                  userId: user.id,
                  achievementId: achievement.id,
                },
              },
            });

            return {
              success: true,
              data: {
                message: "Achievement already unlocked",
                achievement: already,
                status: "unlocked",
              },
            };
          }

          // rethrow other create errors
          throw createErr;
        }
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        console.error("unlockUserAchievement error: ", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Unable to unlock achievement right now. Please try again later.",
        });
      }
    }),

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
