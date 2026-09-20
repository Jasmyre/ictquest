import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, permissionProcedure } from "@/server/api/trpc";
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

      if (!user || typeof (user as { id?: unknown }).id !== "string") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User is not authenticated.",
        });
      }

      requirePermission(user, "User", "view", {
        data: { id: (user as { id: string }).id },
      });

      const u = user as unknown as Record<string, unknown> & {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
        userName?: string | null;
        roles?: string[];
      };
      return {
        success: true as const,
        data: {
          id: u.id,
          name: u.name ?? null,
          email: u.email ?? null,
          image: u.image ?? null,
          userName: u.userName ?? null,
          roles: Array.isArray(u.roles) ? u.roles : undefined,
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

  getUserProgress: permissionProcedure("Progress", "view")
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

  getUserAchievements: permissionProcedure("Achievement", "view")
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

  deleteAllUserProgress: permissionProcedure("Progress", "delete").mutation(
    ({ ctx }) =>
      // Backward-compatible alias fed by the canonical progress service (#35).
      deleteAllProgress(ctx.db, ctx.user.id as string)
  ),

  deleteAllUserAchievements: permissionProcedure(
    "Achievement",
    "delete"
  ).mutation(({ ctx }) =>
    // Backward-compatible alias fed by the canonical achievement service (#36).
    deleteAllAchievements(ctx.db, ctx.user.id as string)
  ),

  unlockUserAchievement: permissionProcedure("Achievement", "create")
    .input(
      z.object({
        achievementName: z.string(),
      })
    )
    .mutation(({ ctx, input }) =>
      // Backward-compatible alias fed by the canonical achievement service (#36).
      unlockAchievement(ctx.db, ctx.user.id as string, input)
    ),
});
