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
 * Serialize the domain `Date` on the achievement inventory to the REST wire
 * shape (ISO datetime) at the controller tier, so the strict output contract
 * already holds on the typed transport.
 */
function serializeDashboard(
  result: Awaited<ReturnType<typeof getMyDashboard>>
) {
  return {
    ...result,
    data: {
      ...result.data,
      achievements: result.data.achievements.map((achievement) => ({
        ...achievement,
        unlockedAt: achievement.unlockedAt.toISOString(),
      })),
    },
  };
}

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
 * Output is share-safe: biography is redacted (`null`) and progress and
 * achievements resolve empty for private accounts, while email, roles, and
 * session data never enter the contract. Progress router keeps
 * list/create/delete-only.
 */
export const dashboardRouter = createTRPCRouter({
  getMyDashboard: permissionProcedure("Progress", "view")
    .output(dashboardOutputSchema)
    .query(async ({ ctx }) =>
      serializeDashboard(await getMyDashboard(ctx.db, requireUserId(ctx.user)))
    ),

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
    .query(async ({ ctx, input }) =>
      serializeDashboard(await getDashboardById(ctx.db, input.id))
    ),
});
