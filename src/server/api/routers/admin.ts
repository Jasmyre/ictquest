import {
  adminProcedure,
  createTRPCRouter,
  moderatorProcedure,
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
  updateAchievementDefinition,
} from "@/server/services/admin";
import { listLessonContent } from "@/server/services/lesson-content";

/**
 * Privileged procedures (Migration 08, extended in Migration 14, #37, and
 * Migration 15, #38).
 *
 * `pingAdmin` / `pingModerator` remain the minimal enforcement seam.
 * User plus role management (`listUsers`, `grantRole`, `revokeRole`) and
 * progress support ops (`grantAchievement`, `revokeAchievement`,
 * `resetProgress`) all sit behind `adminProcedure`: callers need an
 * authenticated session whose `roles` include ADMIN, otherwise FORBIDDEN
 * (or UNAUTHORIZED when anonymous). Migration 15 adds `listLessonContent`
 * (read-only MDX store listing — curriculum stays dev-authored in git, no
 * runtime lesson writes) plus Achievement-definition CRUD
 * (`list/create/update/deleteAchievementDefinition`).
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

  listLessonContent: adminProcedure.query(() => listLessonContent()),

  listAchievementDefinitions: adminProcedure
    .input(listAchievementDefinitionsSchema)
    .query(({ ctx, input }) => listAchievementDefinitions(ctx.db, input)),

  createAchievementDefinition: adminProcedure
    .input(createAchievementDefinitionSchema)
    .mutation(({ ctx, input }) => createAchievementDefinition(ctx.db, input)),

  updateAchievementDefinition: adminProcedure
    .input(updateAchievementDefinitionSchema)
    .mutation(({ ctx, input }) => updateAchievementDefinition(ctx.db, input)),

  deleteAchievementDefinition: adminProcedure
    .input(deleteAchievementDefinitionSchema)
    .mutation(({ ctx, input }) => deleteAchievementDefinition(ctx.db, input)),
});
