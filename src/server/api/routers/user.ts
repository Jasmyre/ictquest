import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicRateLimitedProcedure,
} from "@/server/api/trpc";
import { meOutputSchema } from "@/server/schemas/user";
import {
  deleteAllAchievements,
  listAchievements,
  unlockAchievement,
} from "@/server/services/achievement";
import {
  createProgressOutputSchema,
  createProgressSchema,
  deleteAllProgressOutputSchema,
  listProgressOutputSchema,
  listProgressSchema,
  statsByIdSchema,
  statsOutputSchema,
} from "@/server/schemas/progress";
import {
  createProgress,
  deleteAllProgress,
  getStatsById,
  listProgress,
} from "@/server/services/progress";

export const userRouter = createTRPCRouter({
  getUser: privateProcedure
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

      const u = user as unknown as Record<string, unknown> & {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
        userName?: string | null;
        role?: string;
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
          role: typeof u.role === "string" ? u.role : undefined,
          roles: Array.isArray(u.roles) ? u.roles : undefined,
        },
      };
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

  getUserStatsById: publicRateLimitedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/v1/users/{id}/stats",
        tags: ["users"],
        summary: "Get public user stats",
      },
    })
    .input(statsByIdSchema)
    .output(statsOutputSchema)
    .query(async ({ ctx, input }) =>
      // Backward-compatible alias fed by the canonical progress service (#35).
      // Public and rate-limited (Redis in production); per-user responses stay
      // `private, no-store` at the `/api/v1` catch-all (#42).
      getStatsById(ctx.db, input.id)
    ),
});
