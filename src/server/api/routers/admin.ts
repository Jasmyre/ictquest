import {
  adminProcedure,
  createTRPCRouter,
  moderatorProcedure,
} from "@/server/api/trpc";

/**
 * Privileged procedures (Migration 08).
 *
 * Minimal seam proving ADMIN / MODERATOR enforcement. Full admin domains
 * (user + role management, progress ops, lesson/achievement content) land in
 * later migration tickets; they will reuse `adminProcedure` /
 * `moderatorProcedure` from `@/server/api/trpc`.
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
});
