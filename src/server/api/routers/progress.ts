import {
  createTRPCRouter,
  privateProcedure,
  publicRateLimitedProcedure,
} from "@/server/api/trpc";
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

/**
 * Progress router (Migration 12, #35; versioned REST in Migration 18, #41).
 *
 * Canonical per-user progress writes plus stats. Fed by the same service
 * helpers as the legacy `user` progress procedures so list/create/delete
 * persist per user and survive re-login, and the progress dashboard can
 * render stats plus completion counts end to end.
 *
 * There is intentionally no `dashboard` router: stats live here under
 * `getMyStats` / `getStatsById` per ADR 0005 (per-user stats stay fresh,
 * never long-cached).
 *
 * Versioned REST (ADR 0005): `list` / `create` / `deleteAll` carry OpenAPI
 * method/path/protection annotations plus explicit output schemas and are
 * served through the force-dynamic `/api/v1` catch-all with bearer-PAT-or-
 * cookie auth. Public stats (`getStatsById`, canonical REST path
 * `GET /v1/users/{id}/stats` on `user.getUserStatsById`) are rate-limited in
 * production and stay `private, no-store` (Migration 19, #42).
 */
export const progressRouter = createTRPCRouter({
  list: privateProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/v1/me/progress",
        protect: true,
        tags: ["me"],
        summary: "List my progress",
      },
    })
    .input(listProgressSchema)
    .output(listProgressOutputSchema)
    .query(({ ctx, input }) =>
      listProgress(ctx.db, ctx.user.id as string, input)
    ),

  create: privateProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/v1/me/progress",
        protect: true,
        tags: ["me"],
        summary: "Record progress",
      },
    })
    .input(createProgressSchema)
    .output(createProgressOutputSchema)
    .mutation(({ ctx, input }) =>
      createProgress(ctx.db, ctx.user.id as string, input)
    ),

  deleteAll: privateProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: "/v1/me/progress",
        protect: true,
        tags: ["me"],
        summary: "Delete all my progress",
      },
    })
    .output(deleteAllProgressOutputSchema)
    .mutation(({ ctx }) => deleteAllProgress(ctx.db, ctx.user.id as string)),

  getMyStats: privateProcedure
    .output(statsOutputSchema)
    .query(({ ctx }) => getStatsById(ctx.db, ctx.user.id as string)),

  getStatsById: publicRateLimitedProcedure
    .input(statsByIdSchema)
    .output(statsOutputSchema)
    .query(({ ctx, input }) => getStatsById(ctx.db, input.id)),
});
