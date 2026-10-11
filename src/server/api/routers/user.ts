import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  permissionProcedure,
  requireUserId,
} from "@/server/api/trpc";
import { requirePermission } from "@/server/permissions";
import {
  accountOutputSchema,
  emailChangeOutputSchema,
  meOutputSchema,
  passwordChangeOutputSchema,
  profileOutputSchema,
  setPasswordInputSchema,
  updateEmailInputSchema,
  updatePasswordInputSchema,
  updateProfileInputSchema,
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
  changeOwnPassword,
  getOwnAccount,
  setOwnPassword,
  updateOwnEmail,
} from "@/server/services/user-credentials";
import {
  getOwnProfile,
  updateOwnProfile,
} from "@/server/services/user-profile";

type SessionUser = { id?: string | null; roles?: string[] } | null;

/**
 * Owner-scoped User guard (spec #81): fetch the caller's row, deny a
 * missing record as FORBIDDEN (no existence probing), then re-check the
 * row-level grant before the resolver delegates to the service. Returns
 * the caller id plus the loaded record so reads delegate without a
 * second fetch.
 */
async function requireOwner<T extends { id: string }>(
  user: SessionUser,
  action: "view" | "update",
  load: (userId: string) => Promise<{ success: true; data: T }>
): Promise<{ userId: string; record: T }> {
  const userId = requireUserId(user);

  let record: T;
  try {
    record = (await load(userId)).data;
  } catch (error) {
    if (error instanceof TRPCError && error.code === "NOT_FOUND") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You do not have permission to perform this action.",
      });
    }
    throw error;
  }

  requirePermission({ id: userId, roles: user?.roles }, "User", action, {
    data: { id: record.id },
  });

  return { userId, record };
}

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

  getProfile: permissionProcedure("User", "view")
    .output(profileOutputSchema)
    .query(async ({ ctx }) => {
      // Owner-scoped Settings read (spec #81, ticket #82): tRPC-only,
      // auto-excluded from the versioned Document.
      const { user } = ctx;
      const owned = await requireOwner(user, "view", (userId) =>
        getOwnProfile(ctx.db, userId)
      );

      return { success: true as const, data: owned.record };
    }),

  updateProfile: permissionProcedure("User", "update")
    .input(updateProfileInputSchema)
    .output(profileOutputSchema)
    .mutation(async ({ ctx, input }) => {
      // Owner-scoped Settings write (spec #81, ticket #82): tRPC-only.
      // Thin controller: coarse gate above, row-level re-check on the
      // fetched record below; a missing record denies as FORBIDDEN.
      const { user } = ctx;
      const { userId } = await requireOwner(user, "update", (id) =>
        getOwnProfile(ctx.db, id)
      );

      return updateOwnProfile(ctx.db, userId, input);
    }),

  getAccount: permissionProcedure("User", "view")
    .output(accountOutputSchema)
    .query(async ({ ctx }) => {
      // Owner-scoped Settings read (spec #81, ticket #84): tRPC-only,
      // auto-excluded from the versioned Document. Exposes the sign-in
      // email plus whether a password exists so the panel can pick the
      // change-password or set-password form — never the hash itself.
      const { user } = ctx;
      const owned = await requireOwner(user, "view", (userId) =>
        getOwnAccount(ctx.db, userId)
      );

      return { success: true as const, data: owned.record };
    }),

  updateEmail: permissionProcedure("User", "update")
    .input(updateEmailInputSchema)
    .output(emailChangeOutputSchema)
    .mutation(async ({ ctx, input }) => {
      // Owner-scoped email change (spec #81, ticket #84): tRPC-only.
      // Thin controller: coarse gate above, row-level re-check on the
      // fetched record below; a missing record denies as FORBIDDEN.
      // Uniqueness conflicts surface as CONFLICT for inline display.
      const { user } = ctx;
      const { userId } = await requireOwner(user, "update", (id) =>
        getOwnAccount(ctx.db, id)
      );

      return updateOwnEmail(ctx.db, userId, input.email);
    }),

  updatePassword: permissionProcedure("User", "update")
    .input(updatePasswordInputSchema)
    .output(passwordChangeOutputSchema)
    .mutation(async ({ ctx, input }) => {
      // Credential password change (spec #81, ticket #84): tRPC-only.
      // A wrong current password denies as UNAUTHORIZED; weak replacements
      // reject as BAD_REQUEST with guidance. Same thin-controller shape.
      const { user } = ctx;
      const { userId } = await requireOwner(user, "update", (id) =>
        getOwnAccount(ctx.db, id)
      );

      return changeOwnPassword(ctx.db, userId, input);
    }),

  setPassword: permissionProcedure("User", "update")
    .input(setPasswordInputSchema)
    .output(passwordChangeOutputSchema)
    .mutation(async ({ ctx, input }) => {
      // OAuth-only first password (spec #81, ticket #84): tRPC-only, no
      // current-password field. Refuses with CONFLICT once a password
      // already exists so the proof-bearing path stays mandatory there.
      const { user } = ctx;
      const { userId } = await requireOwner(user, "update", (id) =>
        getOwnAccount(ctx.db, id)
      );

      return setOwnPassword(ctx.db, userId, input);
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
