import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { achievementRouter } from "./routers/achievement";
import { adminRouter } from "./routers/admin";
import { dashboardRouter } from "./routers/dashboard";
import { lessonRouter } from "./routers/lesson";
import { progressRouter } from "./routers/progress";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 *
 * Migration 12 (#35): `progress` is the canonical per-user progress
 * list/create/delete router. Slice 5 (#62): `dashboard` is the derived
 * summary view over progress (`getMyDashboard` private tRPC-only,
 * `getDashboardById` public rate-limited over `GET /v1/dashboard/{id}`);
 * legacy `GET /v1/users/{id}/stats` is deleted with no shim.
 *
 * Migration 13 (#36): `achievement` is the canonical per-user achievement
 * list/unlock/delete router. `user` keeps backward-compatible achievement
 * aliases fed by the same service helpers. The example `post` router is
 * deleted as a verified unused stub.
 * Migration 19 (#42): `lesson` is the public MDX-backed read router
 * (`GET /v1/lessons`, `GET /v1/lessons/{lesson}/{subtopic}`).
 */
export const appRouter = createTRPCRouter({
  achievement: achievementRouter,
  admin: adminRouter,
  dashboard: dashboardRouter,
  lesson: lessonRouter,
  progress: progressRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.achievement.list({});
 */
export const createCaller = createCallerFactory(appRouter);
