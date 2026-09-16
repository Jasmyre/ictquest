import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import {
  createProgressSchema,
  listProgressSchema,
  statsByIdSchema,
} from "@/server/schemas/progress";
import {
  createProgress,
  deleteAllProgress,
  getStatsById,
  listProgress,
} from "@/server/services/progress";

/**
 * Progress router (Migration 12, #35).
 *
 * Canonical per-user progress writes plus stats. Fed by the same service
 * helpers as the legacy `user` progress procedures so list/create/delete
 * persist per user and survive re-login, and the progress dashboard can
 * render stats plus completion counts end to end.
 *
 * There is intentionally no `dashboard` router: stats live here under
 * `getMyStats` / `getStatsById` per ADR 0005 (per-user stats stay fresh,
 * never long-cached).
 */
export const progressRouter = createTRPCRouter({
  list: privateProcedure
    .input(listProgressSchema)
    .query(({ ctx, input }) =>
      listProgress(ctx.db, ctx.user.id as string, input)
    ),

  create: privateProcedure
    .input(createProgressSchema)
    .mutation(({ ctx, input }) =>
      createProgress(ctx.db, ctx.user.id as string, input)
    ),

  deleteAll: privateProcedure.mutation(({ ctx }) =>
    deleteAllProgress(ctx.db, ctx.user.id as string)
  ),

  getMyStats: privateProcedure.query(({ ctx }) =>
    getStatsById(ctx.db, ctx.user.id as string)
  ),

  getStatsById: publicProcedure
    .input(statsByIdSchema)
    .query(({ ctx, input }) => getStatsById(ctx.db, input.id)),
});
