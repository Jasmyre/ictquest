import {
  createTRPCRouter,
  moderatorProcedure,
  permissionProcedure,
  requireUserId,
} from "@/server/api/trpc";
import {
  createAchievementDefinitionSchema,
  deleteAchievementDefinitionSchema,
  grantAchievementSchema,
  grantRoleSchema,
  listAchievementDefinitionsSchema,
  listUsersSchema,
  resetProgressSchema,
  revokeAchievementSchema,
  revokeRoleSchema,
  suspendUserSchema,
  unsuspendUserSchema,
  updateAchievementDefinitionSchema,
} from "@/server/schemas/admin";
import {
  createAchievementDefinition,
  deleteAchievementDefinition,
  grantAchievementForUser,
  grantRole,
  listAchievementDefinitions,
  listUsersWithRoles,
  resetUserProgress,
  revokeAchievementForUser,
  revokeRole,
  suspendUser,
  unsuspendUser,
  updateAchievementDefinition,
} from "@/server/services/admin";
import { listLessonContent } from "@/server/services/lesson-content";

/**
 * Privileged procedures (Migration 08, extended in Migration 14, #37, and
 * Migration 15, #38).
 *
 * `pingAdmin` / `pingModerator` remain the minimal enforcement seam
 * (`permissionProcedure("Admin", "manage")` / `moderatorProcedure`).
 * User plus role management (`listUsers`, `grantRole`, `revokeRole`) and
 * progress support ops (`grantAchievement`, `revokeAchievement`,
 * `resetProgress`) all sit behind `permissionProcedure("Admin", "manage")`: callers need an
 * authenticated session whose current DB memberships include ADMIN (fresh
 * per-request read, #70), otherwise FORBIDDEN
 * (or UNAUTHORIZED when anonymous). Suspended callers are denied with
 * FORBIDDEN even when their stamped copy still lists ADMIN (#72).
 * `suspendUser` / `unsuspendUser` stamp or clear `suspendedAt` without
 * touching roles, so unsuspend restores exactly what the user had.
 * Migration 15 adds `listLessonContent`
 * (read-only MDX store listing — curriculum stays dev-authored in git, no
 * runtime lesson writes) plus Achievement-definition CRUD
 * (`list/create/update/deleteAchievementDefinition`).
 */
export const adminRouter = createTRPCRouter({
  pingAdmin: permissionProcedure("Admin", "manage").query(() => ({
    success: true,
    data: { scope: "admin" },
  })),

  pingModerator: moderatorProcedure.query(() => ({
    success: true,
    data: { scope: "moderator" },
  })),

  listUsers: permissionProcedure("Admin", "manage")
    .input(listUsersSchema)
    .query(({ ctx, input }) => listUsersWithRoles(ctx.db, input)),

  grantRole: permissionProcedure("Admin", "manage")
    .input(grantRoleSchema)
    .mutation(({ ctx, input }) => grantRole(ctx.db, input)),

  revokeRole: permissionProcedure("Admin", "manage")
    .input(revokeRoleSchema)
    .mutation(({ ctx, input }) =>
      revokeRole(ctx.db, input, {
        callerId: requireUserId(ctx.user),
        callerRoles: ctx.user?.roles ?? [],
      })
    ),

  grantAchievement: permissionProcedure("Admin", "manage")
    .input(grantAchievementSchema)
    .mutation(({ ctx, input }) => grantAchievementForUser(ctx.db, input)),

  revokeAchievement: permissionProcedure("Admin", "manage")
    .input(revokeAchievementSchema)
    .mutation(({ ctx, input }) => revokeAchievementForUser(ctx.db, input)),

  resetProgress: permissionProcedure("Admin", "manage")
    .input(resetProgressSchema)
    .mutation(({ ctx, input }) => resetUserProgress(ctx.db, input)),

  suspendUser: permissionProcedure("Admin", "manage")
    .input(suspendUserSchema)
    .mutation(({ ctx, input }) =>
      suspendUser(ctx.db, input, { callerId: requireUserId(ctx.user) })
    ),

  unsuspendUser: permissionProcedure("Admin", "manage")
    .input(unsuspendUserSchema)
    .mutation(({ ctx, input }) => unsuspendUser(ctx.db, input)),

  listLessonContent: permissionProcedure("Admin", "manage").query(() =>
    listLessonContent()
  ),

  listAchievementDefinitions: permissionProcedure("Admin", "manage")
    .input(listAchievementDefinitionsSchema)
    .query(({ ctx, input }) => listAchievementDefinitions(ctx.db, input)),

  createAchievementDefinition: permissionProcedure("Admin", "manage")
    .input(createAchievementDefinitionSchema)
    .mutation(({ ctx, input }) => createAchievementDefinition(ctx.db, input)),

  updateAchievementDefinition: permissionProcedure("Admin", "manage")
    .input(updateAchievementDefinitionSchema)
    .mutation(({ ctx, input }) => updateAchievementDefinition(ctx.db, input)),

  deleteAchievementDefinition: permissionProcedure("Admin", "manage")
    .input(deleteAchievementDefinitionSchema)
    .mutation(({ ctx, input }) => deleteAchievementDefinition(ctx.db, input)),
});
