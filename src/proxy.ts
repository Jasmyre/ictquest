import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { hasRole } from "@/lib/roles";

import {
  apiAuthPrefix,
  DEFAULT_LOGIN_REDIRECT,
  isAdminRoute,
  isAuthRoute,
  isMaintenanceBypass,
  isPublicApiRoute,
  isPublicDashboardShare,
  isPublicRoute,
  isV1ApiRoute,
} from "./routes";

const { auth } = NextAuth(authConfig);

function isAdminSession(session: unknown): boolean {
  if (typeof session !== "object" || session === null) {
    return false;
  }
  const user = (session as { user?: unknown }).user;
  if (typeof user !== "object" || user === null) {
    return false;
  }
  const roles = (user as { roles?: unknown }).roles;
  return Array.isArray(roles) && hasRole(roles, "ADMIN");
}

export default auth((req) => {
  const { nextUrl } = req;

  const isInMaintenance = process.env.NEXT_PUBLIC_IS_IN_MAINTENANCE === "true";

  // Maintenance bypasses all guards and shells (env-gated).
  if (isMaintenanceBypass(nextUrl.pathname)) {
    return;
  }
  if (isInMaintenance) {
    return Response.redirect(new URL("/maintenance", nextUrl));
  }

  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  if (isApiAuthRoute) {
    return;
  }

  if (isPublicApiRoute(nextUrl.pathname)) {
    return;
  }

  // Versioned REST handles its own bearer-or-cookie auth; never redirect API
  // consumers to `/auth` (Migration 18, #41).
  if (isV1ApiRoute(nextUrl.pathname)) {
    return;
  }

  if (isAuthRoute(nextUrl.pathname)) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  // Admin prefix requires session plus the ADMIN role (shell lands in #34).
  if (isAdminRoute(nextUrl.pathname)) {
    if (!isLoggedIn) {
      return Response.redirect(new URL("/auth", nextUrl), 302);
    }
    if (!isAdminSession(req.auth)) {
      return Response.redirect(new URL("/", nextUrl), 302);
    }
    return;
  }

  // Exact-public marketing routes (incl. the `/lessons` exact-exception:
  // `/lessons` is public, `/lessons/*` falls through to the auth check).
  if (isPublicRoute(nextUrl.pathname)) {
    return;
  }

  // Public dashboard share links stay anonymous-readable (Slice 5, #62).
  if (isPublicDashboardShare(nextUrl.pathname)) {
    return;
  }

  if (!isLoggedIn) {
    return Response.redirect(new URL("/auth", nextUrl), 302);
  }

  return;
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
