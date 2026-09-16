import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { achievementRouter } from "./routers/achievement";
import { adminRouter } from "./routers/admin";
import { progressRouter } from "./routers/progress";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 *
 * Migration 12 (#35): `progress` is the canonical per-user progress plus
 * stats router. `user` keeps backward-compatible progress aliases fed by
 * the same service helpers. There is intentionally no `dashboard` router.
 *
 * Migration 13 (#36): `achievement` is the canonical per-user achievement
 * list/unlock/delete router. `user` keeps backward-compatible achievement
 * aliases fed by the same service helpers. The example `post` router is
 * deleted as a verified unused stub.
 */
export const appRouter = createTRPCRouter({
  achievement: achievementRouter,
  admin: adminRouter,
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
