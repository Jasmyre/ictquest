import NextAuth from "next-auth";
import authConfig from "./auth.config";

import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "./routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;

  const isInMaintenance = process.env.NEXT_PUBLIC_IS_IN_MAINTENANCE === "true";

  if (isInMaintenance) {
    if (!nextUrl.pathname.startsWith("/maintenance")) {
      return Response.redirect(new URL("/maintenance", nextUrl));
    }
  }

  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return undefined;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return undefined;
  }

  if (nextUrl.pathname.startsWith("/api/public")) {
    return undefined;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/auth", nextUrl));
  }

  return undefined;
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
