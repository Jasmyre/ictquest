import { db } from "@/lib/db";
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  getUserProgress: privateProcedure.query(async (opts) => {
    const { user } = opts.ctx;

    try {
      const progress = await db.progressData.findMany({
        where: { userId: user.id },
      });

      return {
        success: true,
        data: progress,
      };
    } catch (error) {
      console.error("getUserProgress error:", error);

      return {
        success: false,
        status: 500,
        message:
          "Unable to load your progress right now. Please try again later.",
      };
    }
  }),

  getUser: privateProcedure.query((opts) => {
    const { user } = opts.ctx;

    return user;
  }),

  getUserAchievements: privateProcedure.query(async (opts) => {
    const { user } = opts.ctx;

    try {
      const achievements = await db.userAchievement.findMany({
        where: { userId: user.id },
        include: { achievement: true },
      });

      return {
        success: true,
        data: achievements,
      };
    } catch (error) {
      console.error("getUserAchievements error:", error);

      return {
        success: false,
        status: 500,
        message:
          "Unable to load your achievements right now. Please try again later.",
      };
    }
  }),
});
