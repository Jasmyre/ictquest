import {
  createTRPCRouter,
  permissionProcedure,
  publicRateLimitedProcedure,
  requireUserId,
} from "@/server/api/trpc";
import {
  dashboardByIdSchema,
  dashboardOutputSchema,
} from "@/server/schemas/dashboard";
import { getDashboardById, getMyDashboard } from "@/server/services/dashboard";

/**
 * Dashboard router (Slice 5, #62; ADR 0005 supersede note: stats-under-
 * progress renamed to dashboard derived view over progress).
 *
 * - `getMyDashboard`: private, tRPC-only owner read (never REST-mounted).
 * - `getDashboardById`: public, rate-limited by-id read over the versioned
 *   path `GET /v1/dashboard/{id}`. Responses stay `private, no-store` at the
 *   `/api/v1` catch-all and are network-only in the service worker (never
 *   precached).
 *
 * Output is share-safe: the strict dashboard contract carries no biography
 * key. Progress router keeps list/create/delete-only.
 */
export const dashboardRouter = createTRPCRouter({
  getMyDashboard: permissionProcedure("Progress", "view")
    .output(dashboardOutputSchema)
    .query(({ ctx }) => getMyDashboard(ctx.db, requireUserId(ctx.user))),

  getDashboardById: publicRateLimitedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/v1/dashboard/{id}",
        tags: ["dashboard"],
        summary: "Get public dashboard by id",
      },
    })
    .input(dashboardByIdSchema)
    .output(dashboardOutputSchema)
    .query(({ ctx, input }) => getDashboardById(ctx.db, input.id)),
});
