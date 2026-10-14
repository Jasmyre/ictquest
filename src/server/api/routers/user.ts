import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  permissionProcedure,
  requireUserId,
} from "@/server/api/trpc";
import { requirePermission } from "@/server/permissions";
import {
  meOutputSchema,
  setPasswordSchema,
  settingsOutputSchema,
  settingsProfileSchema,
  updateEmailSchema,
  updatePasswordSchema,
} from "@/server/schemas/user";
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
import {
  getSettings as getOwnSettings,
  setPassword as setOwnPassword,
  updateEmail as updateOwnEmail,
  updatePassword as updateOwnPassword,
  updateSettings as updateOwnSettings,
} from "@/server/services/user-settings";

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

  getSettings: permissionProcedure("User", "view")
    .output(settingsOutputSchema)
    .query(async ({ ctx }) => {
      const userId = requireUserId(ctx.user);
      const current = await getOwnSettings(ctx.db, userId);
      requirePermission(
        { id: userId, roles: ctx.user?.roles },
        "User",
        "view",
        {
          data: { id: current.data.id },
        }
      );
      return current;
    }),

  updateSettings: permissionProcedure("User", "update")
    .input(settingsProfileSchema)
    .output(settingsOutputSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = requireUserId(ctx.user);
      await requireOwnUserRow(ctx, userId, "update");
      return updateOwnSettings(ctx.db, userId, input);
    }),

  updateEmail: permissionProcedure("User", "update")
    .input(updateEmailSchema)
    .output(settingsOutputSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = requireUserId(ctx.user);
      await requireOwnUserRow(ctx, userId, "update");
      return updateOwnEmail(ctx.db, userId, input.email);
    }),

  updatePassword: permissionProcedure("User", "update")
    .input(updatePasswordSchema)
    .output(z.object({ success: z.literal(true) }))
    .mutation(async ({ ctx, input }) => {
      const userId = requireUserId(ctx.user);
      await requireOwnUserRow(ctx, userId, "update");
      return updateOwnPassword(
        ctx.db,
        userId,
        input.currentPassword,
        input.newPassword
      );
    }),

  setPassword: permissionProcedure("User", "update")
    .input(setPasswordSchema)
    .output(z.object({ success: z.literal(true) }))
    .mutation(async ({ ctx, input }) => {
      const userId = requireUserId(ctx.user);
      await requireOwnUserRow(ctx, userId, "update");
      return setOwnPassword(ctx.db, userId, input.newPassword);
    }),
});

/**
 * Row-level re-check for owner-scoped settings writes (#81).
 *
 * Fetches the caller's row through the settings service (controllers never
 * touch Prisma directly) and re-checks `hasPermission` against it. A
 * missing record answers FORBIDDEN so callers cannot probe for existence.
 */
async function requireOwnUserRow(
  ctx: {
    db: Parameters<typeof getOwnSettings>[0];
    user: { id?: string | null; roles?: readonly string[] | null } | null;
  },
  userId: string,
  action: "view" | "update"
): Promise<void> {
  let rowId: string | null = null;
  try {
    const current = await getOwnSettings(ctx.db, userId);
    rowId = current.data.id;
  } catch (error) {
    if (error instanceof TRPCError && error.code === "NOT_FOUND") {
      rowId = null;
    } else {
      throw error;
    }
  }
  requirePermission({ id: userId, roles: ctx.user?.roles }, "User", action, {
    data: rowId ? { id: rowId } : null,
  });
}
