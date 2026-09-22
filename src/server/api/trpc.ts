/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */

import { initTRPC, TRPCError } from "@trpc/server";
import type { Session } from "next-auth";
import superjson from "superjson";
import type { OpenApiMeta } from "trpc-to-openapi";
import { ZodError } from "zod";
import { auth } from "@/auth";
import { env } from "@/env";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import {
  getUserRoleNames,
  hasRole,
  isUserSuspended,
  type RoleName,
  type SuspensionStore,
} from "@/lib/roles";
import { logInfo } from "@/server/logger";
import {
  hasActionGrant,
  type PermissionAction,
  type PermissionResource,
} from "@/server/permissions";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async (opts: {
  headers: Headers;
}): Promise<{
  headers: Headers;
  db: typeof db;
  user: Session["user"] | null;
}> => ({
  db,
  user: (await auth())?.user ?? null,
  ...opts,
});

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
const t = initTRPC
  .context<typeof createTRPCContext>()
  .meta<OpenApiMeta>()
  .create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
      return {
        ...shape,
        data: {
          ...shape.data,
          zodError:
            error.cause instanceof ZodError ? error.cause.flatten() : null,
        },
      };
    },
  });

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Middleware for timing procedure execution and adding an artificial delay in development.
 *
 * You can remove this if you don't like it, but it can help catch unwanted waterfalls by simulating
 * network latency that would occur in production but not in local development.
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (t._config.isDev) {
    // artificial delay in dev
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();

  const end = Date.now();
  // Keep test output quiet: procedure timing is a dev/prod diagnostic and
  // every caller-based unit test would otherwise spam `[TRPC] ...` lines.
  // Tests mock `@/env` with `NODE_ENV: "test"`, and vitest sets it for real.
  if (env.NODE_ENV !== "test") {
    logInfo(`[TRPC] ${path} took ${end - start}ms to execute`);
  }

  return result;
});

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure.use(timingMiddleware);

const WINDOW_SEC = 40; // 40 seconds
const LIMIT = 10; // max 10 requests per window

const publicRateLimiter = t.middleware(async ({ ctx, next, path }) => {
  // Rate limiting is a production guard (Redis-backed, 10 req / 40s per IP).
  // Dev and test bypass so local runs and contract tests stay deterministic;
  // production enforces TOO_MANY_REQUESTS via the Redis counter below.
  if (env.NODE_ENV !== "production") {
    return next();
  }

  const ip =
    ctx.headers.get("x-forwarded-for") ??
    ctx.headers.get("cf-connecting-ip") ??
    "anon";

  const key = `ratelimit:${ip}:${path}`;

  const requests = await redis.incr(key);

  if (requests === 1) {
    await redis.expire(key, WINDOW_SEC);
  }

  if (requests > LIMIT) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Too many requests from this IP. Please slow down.",
    });
  }

  return next();
});

export const publicRateLimitedProcedure =
  publicProcedure.use(publicRateLimiter);

export const privateProcedure = t.procedure.use(function isAuthed(opts) {
  const { ctx } = opts;

  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User is not authenticated.",
    });
  }

  // Suspension denial (#72) on the JWT-stamped flag: no extra lookup, so
  // non-privileged paths stay fast while a known-suspended session is
  // denied everywhere. Privileged gates add a fresh per-request read on
  // top, so suspension takes effect even before the token refreshes.
  if (ctx.user.suspended === true) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Account is suspended.",
    });
  }

  return opts.next({
    ctx: {
      user: ctx.user,
    },
  });
});

/**
 * Behavior-identical permissions gate (Slice 4, #61; freshness #70).
 *
 * Coarse controller gate over the locked matrix in
 * `src/server/permissions.ts`: UNAUTHORIZED when signed out, FORBIDDEN
 * when no held role grants the action. Owner-predicate rules count as
 * grants here; the resolver re-checks the row with `requirePermission`
 * where a record exists (missing records answer FORBIDDEN, anti-probing).
 *
 * Freshness (#70): the privileged `Admin` gate re-reads memberships from
 * the DB per request so a grant/revoke takes effect without re-signin
 * (fallback to the session copy on lookup failure). Non-privileged paths
 * keep the JWT-stamped `ctx.user.roles` with no extra lookup.
 */
export const permissionProcedure = (
  resource: PermissionResource,
  action: PermissionAction
) =>
  privateProcedure.use(async function isPermitted(opts) {
    const { ctx } = opts;

    let user = ctx.user;
    if (resource === "Admin") {
      const id = ctx.user.id;
      if (typeof id === "string" && id.length > 0) {
        try {
          const roles = await getUserRoleNames(id);
          user = { ...ctx.user, roles };
        } catch {
          user = ctx.user;
        }
      }
      assertNotSuspended(await isSuspendedCaller(ctx.db, ctx.user));
    }

    if (!hasActionGrant(user, resource, action)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You do not have permission to perform this action.",
      });
    }

    return opts.next({
      ctx: {
        user: ctx.user,
      },
    });
  });

/**
 * Suspension denial (#72).
 *
 * Reads the nullable `suspendedAt` timestamp per request from the
 * procedure database handle (the same fresh-read seam as the #70 role
 * lookup). Falls back to the JWT-stamped session flag when the lookup
 * fails, so a degraded database still denies a known-suspended session.
 * Throws FORBIDDEN when the caller is suspended; otherwise resolves false.
 */
async function isSuspendedCaller(
  store: SuspensionStore,
  user: { id?: string | null; suspended?: boolean | null }
): Promise<boolean> {
  const id = user.id;
  if (typeof id === "string" && id.length > 0) {
    try {
      return await isUserSuspended(id, store);
    } catch {
      // Fall through to the session flag below.
    }
  }
  return user.suspended === true;
}

function assertNotSuspended(suspended: boolean): void {
  if (suspended) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Account is suspended.",
    });
  }
}

/**
 * Narrow the session user to its id (code-review Standards fix).
 *
 * `Session["user"].id` is optional (`DefaultSession`), so resolvers
 * previously wrote `ctx.user.id as string` after the auth gate. This
 * helper narrows instead of asserting: a missing id answers UNAUTHORIZED,
 * exactly as if the caller were signed out.
 */
export function requireUserId(user: { id?: string | null } | null): string {
  if (!user || typeof user.id !== "string" || user.id.length === 0) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User is not authenticated.",
    });
  }
  return user.id;
}

/**
 * Shared privileged-role gate.
 *
 * Throws FORBIDDEN unless the caller's session `roles` include at least one
 * of the allowed roles. Unauthenticated callers never reach here — the
 * underlying privateProcedure rejects them with UNAUTHORIZED first.
 */
function requireAnyRole(
  roles: readonly string[] | undefined | null,
  allowed: readonly RoleName[],
  message: string
): void {
  if (!allowed.some((role) => hasRole(roles, role))) {
    throw new TRPCError({ code: "FORBIDDEN", message });
  }
}

/**
 * Admin-only procedure.
 *
 * Authoritative per-request check: re-reads role memberships from the DB
 * so a grant/revoke takes effect without re-signin. Non-privileged
 * procedures keep the JWT-stamped `ctx.user.roles` to avoid a DB read.
 * Falls back to the session copy if the lookup fails.
 * Non-admin callers receive FORBIDDEN; unauthenticated callers receive
 * UNAUTHORIZED via the underlying privateProcedure.
 */
export const adminProcedure = privateProcedure.use(
  async function isAdmin(opts) {
    const { ctx } = opts;

    assertNotSuspended(await isSuspendedCaller(ctx.db, ctx.user));
    let roles: readonly string[] | undefined | null = ctx.user.roles;
    if (typeof ctx.user.id === "string" && ctx.user.id.length > 0) {
      try {
        roles = await getUserRoleNames(ctx.user.id);
      } catch {
        roles = ctx.user.roles;
      }
    }

    requireAnyRole(roles, ["ADMIN"], "Admin role is required.");

    return opts.next({
      ctx: {
        user: ctx.user,
      },
    });
  }
);

/**
 * Moderator-or-admin procedure.
 *
 * MODERATOR is seeded with zero assignments (reserved for future UGC work),
 * so this seam exists ahead of its first consumer. ADMIN inherits moderator
 * access; callers holding neither role receive FORBIDDEN.
 */
export const moderatorProcedure = privateProcedure.use(
  async function isModerator(opts) {
    const { ctx } = opts;

    assertNotSuspended(await isSuspendedCaller(ctx.db, ctx.user));
    let roles: readonly string[] | undefined | null = ctx.user.roles;
    if (typeof ctx.user.id === "string" && ctx.user.id.length > 0) {
      try {
        roles = await getUserRoleNames(ctx.user.id);
      } catch {
        roles = ctx.user.roles;
      }
    }

    requireAnyRole(
      roles,
      ["MODERATOR", "ADMIN"],
      "Moderator role is required."
    );

    return opts.next({
      ctx: {
        user: ctx.user,
      },
    });
  }
);
