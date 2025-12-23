import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { calculateAverageProgress } from "@/lib/progress";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "@/server/api/trpc";

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
    .mutation(async ({ ctx, input }) => {
      const { db, user } = ctx;
      if (!user?.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authenticated",
        });
      }

      const { topic, subtopic } = input;

      try {
        const existing = await db.progressData.findFirst({
          where: { userId: user.id, topic },
        });

        if (existing) {
          // if subtopic already recorded, return existing record
          if (existing.subtopics?.includes(subtopic)) {
            return { success: true, data: existing };
          }

          // append new subtopic to array
          const updated = await db.progressData.update({
            where: { id: existing.id },
            data: {
              // Prisma supports push for Postgres array fields
              subtopics: { push: subtopic },
            },
          });

          return { success: true, data: updated };
        }

        // create a new progress row
        const created = await db.progressData.create({
          data: {
            userId: user.id,
            topic,
            subtopics: [subtopic],
          },
        });

        return { success: true, data: created };
      } catch (error) {
        console.error("addProgress error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to record progress right now. Try again later.",
        });
      }
    }),

  getUserProgress: privateProcedure
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

  deleteAllUserProgress: privateProcedure.mutation(async ({ ctx }) => {
    const { user, db } = ctx;

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

          console.log("Achievement Unlocked - test");

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

            console.log("Achievement already unlocked - test");

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
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const { id } = input;

      try {
        const user = await db.user.findUnique({
          where: {
            id,
          },
          select: {
            id: true,
            userName: true,
            image: true,
            userAchievements: { select: { id: true } },
            progressData: { select: { subtopics: true, topic: true } },
          },
        });

        if (!user) {
          // if no user found, throw error
          console.error("User not found with id: ", id);

          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found.",
          });
        }

        const totalSubtopicsCount = user.progressData.reduce(
          (total, progressItem) => total + progressItem.subtopics.length,
          0
        );

        const averageProgress = calculateAverageProgress({ user });

        let level = "";

        if (averageProgress < 33.33) {
          level = "Beginner";
        } else if (averageProgress < 66.67) {
          level = "Intermediate";
        } else {
          level = "Expert";
        }

        return {
          success: true,
          data: {
            userName: user.userName,
            id: user.id,
            image: user.image,
            totalAchievements: user.userAchievements.length,
            totalSubtopicsCompleted: totalSubtopicsCount,
            level,
            totalProgress: Number(averageProgress.toFixed(2)),
            progressData: user.progressData,
          },
        };
      } catch (error) {
        console.error("getUserStatsById error: ", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Unable to fetch user stats right now. Please try again later.",
        });
      }
    }),
});
