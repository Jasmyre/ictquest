import { z } from "zod";
import {
  createTRPCRouter,
  permissionProcedure,
  requireUserId,
} from "@/server/api/trpc";
import { requirePermission } from "@/server/permissions";
import { meOutputSchema } from "@/server/schemas/user";
import {
  deleteAllAchievements,
  listAchievements,
  unlockAchievement,
} from "@/server/services/achievement";
import {
  createProgress,
  deleteAllProgress,
  listProgress,
} from "@/server/services/progress";

export const userRouter = createTRPCRouter({
  getUser: permissionProcedure("User", "view")
    .meta({
      openapi: {
        method: "GET",
        path: "/v1/me",
        protect: true,
        tags: ["me"],
        summary: "Get my session summary",
      },
    })
    .output(meOutputSchema)
    .query(({ ctx }) => {
      const { user } = ctx;
      const userId = requireUserId(user);

      requirePermission({ id: userId, roles: user?.roles }, "User", "view", {
        data: { id: userId },
      });

      return {
        success: true as const,
        data: {
          id: userId,
          name: user?.name ?? null,
          email: user?.email ?? null,
          image: user?.image ?? null,
          userName: user?.userName ?? null,
          roles: Array.isArray(user?.roles) ? [...user.roles] : undefined,
        },
      };
    }),

  addProgress: permissionProcedure("Progress", "create")
    .input(
      z.object({
        topic: z.string().min(1),
        subtopic: z.string().min(1),
      })
    )
    .mutation(({ ctx, input }) =>
      // Backward-compatible alias fed by the canonical progress service (#35).
      createProgress(ctx.db, requireUserId(ctx.user), input)
    ),

  getUserProgress: permissionProcedure("Progress", "view")
    .input(
      z.object({
        skip: z.number().min(0).optional(),
        take: z.number().min(1).max(100).optional(),
      })
    )
    .query(({ ctx, input }) =>
      // Backward-compatible alias fed by the canonical progress service (#35).
      listProgress(ctx.db, requireUserId(ctx.user), input)
    ),

  getUserAchievements: permissionProcedure("Achievement", "view")
    .input(
      z.object({
        skip: z.number().min(0).optional(),
        take: z.number().min(1).max(100).optional(),
      })
    )
    .query(({ ctx, input }) =>
      // Backward-compatible alias fed by the canonical achievement service (#36).
      listAchievements(ctx.db, requireUserId(ctx.user), input)
    ),

  deleteAllUserProgress: permissionProcedure("Progress", "delete").mutation(
    ({ ctx }) =>
      // Backward-compatible alias fed by the canonical progress service (#35).
      deleteAllProgress(ctx.db, requireUserId(ctx.user))
  ),

  deleteAllUserAchievements: permissionProcedure(
    "Achievement",
    "delete"
  ).mutation(({ ctx }) =>
    // Backward-compatible alias fed by the canonical achievement service (#36).
    deleteAllAchievements(ctx.db, requireUserId(ctx.user))
  ),

  unlockUserAchievement: permissionProcedure("Achievement", "create")
    .input(
      z.object({
        achievementName: z.string(),
      })
    )
    .mutation(({ ctx, input }) =>
      // Backward-compatible alias fed by the canonical achievement service (#36).
      unlockAchievement(ctx.db, requireUserId(ctx.user), input)
    ),
});
