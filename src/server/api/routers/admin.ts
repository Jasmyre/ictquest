import {
  adminProcedure,
  createTRPCRouter,
  moderatorProcedure,
} from "@/server/api/trpc";
import {
  grantAchievementSchema,
  grantRoleSchema,
  listUsersSchema,
  resetProgressSchema,
  revokeAchievementSchema,
  revokeRoleSchema,
} from "@/server/schemas/admin";
import {
  grantAchievementForUser,
  grantRole,
  listUsersWithRoles,
  resetUserProgress,
  revokeAchievementForUser,
  revokeRole,
} from "@/server/services/admin";

/**
 * Privileged procedures (Migration 08, extended in Migration 14, #37).
 *
 * `pingAdmin` / `pingModerator` remain the minimal enforcement seam.
 * User plus role management (`listUsers`, `grantRole`, `revokeRole`) and
 * progress support ops (`grantAchievement`, `revokeAchievement`,
 * `resetProgress`) all sit behind `adminProcedure`: callers need an
 * authenticated session whose `roles` include ADMIN, otherwise FORBIDDEN
 * (or UNAUTHORIZED when anonymous). Lesson plus achievement-definition
 * content lands in #38.
 */
export const adminRouter = createTRPCRouter({
  pingAdmin: adminProcedure.query(() => ({
    success: true,
    data: { scope: "admin" },
  })),

  pingModerator: moderatorProcedure.query(() => ({
    success: true,
    data: { scope: "moderator" },
  })),

  listUsers: adminProcedure
    .input(listUsersSchema)
    .query(({ ctx, input }) => listUsersWithRoles(ctx.db, input)),

  grantRole: adminProcedure
    .input(grantRoleSchema)
    .mutation(({ ctx, input }) =>
      grantRole(ctx.db, input, ctx.user.id as string)
    ),

  revokeRole: adminProcedure
    .input(revokeRoleSchema)
    .mutation(({ ctx, input }) => revokeRole(ctx.db, input)),

  grantAchievement: adminProcedure
    .input(grantAchievementSchema)
    .mutation(({ ctx, input }) => grantAchievementForUser(ctx.db, input)),

  revokeAchievement: adminProcedure
    .input(revokeAchievementSchema)
    .mutation(({ ctx, input }) => revokeAchievementForUser(ctx.db, input)),

  resetProgress: adminProcedure
    .input(resetProgressSchema)
    .mutation(({ ctx, input }) => resetUserProgress(ctx.db, input)),
});
