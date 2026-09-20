import {
  createTRPCRouter,
  permissionProcedure,
  requireUserId,
} from "@/server/api/trpc";
import {
  createProgressOutputSchema,
  createProgressSchema,
  deleteAllProgressOutputSchema,
  listProgressOutputSchema,
  listProgressSchema,
} from "@/server/schemas/progress";
import {
  createProgress,
  deleteAllProgress,
  listProgress,
} from "@/server/services/progress";

/**
 * Progress router (Migration 12, #35; versioned REST in Migration 18, #41;
 * stats moved to the dashboard router in Slice 5, #62).
 *
 * Canonical per-user progress writes: list/create/delete-only. The derived
 * dashboard view lives in `dashboard.*` (`getMyDashboard` private tRPC-only,
 * `getDashboardById` public rate-limited over `GET /v1/dashboard/{id}`).
 *
 * Versioned REST (ADR 0005): `list` / `create` / `deleteAll` carry OpenAPI
 * method/path/protection annotations plus explicit output schemas and are
 * served through the force-dynamic `/api/v1` catch-all with bearer-PAT-or-
 * cookie auth. Dashboard reads stay `private, no-store` (Migration 19, #42;
 * Slice 5, #62).
 */
export const progressRouter = createTRPCRouter({
  list: permissionProcedure("Progress", "view")
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
      listProgress(ctx.db, requireUserId(ctx.user), input)
    ),

  create: permissionProcedure("Progress", "create")
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
      createProgress(ctx.db, requireUserId(ctx.user), input)
    ),

  deleteAll: permissionProcedure("Progress", "delete")
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
    .mutation(({ ctx }) => deleteAllProgress(ctx.db, requireUserId(ctx.user))),
});
