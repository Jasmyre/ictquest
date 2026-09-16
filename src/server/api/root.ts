import { postRouter } from "@/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
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
 */
export const appRouter = createTRPCRouter({
  admin: adminRouter,
  post: postRouter,
  progress: progressRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
