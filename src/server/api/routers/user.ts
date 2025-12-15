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
});
