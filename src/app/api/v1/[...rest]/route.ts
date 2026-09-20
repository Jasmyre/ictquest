import type { NextRequest } from "next/server";
import { createOpenApiFetchHandler } from "trpc-to-openapi";
import { appRouter } from "@/server/api/root";
import { createV1Context } from "@/server/api/v1-context";

/**
 * Versioned REST catch-all (Migration 18, #41 / ADR 0005; lessons + stats in
 * Migration 19, #42).
 *
 * Serves annotated `user.getUser` (`GET /v1/me`), `progress` list/create/
 * delete (`/v1/me/progress`), `achievement` list/unlock/delete
 * (`/v1/me/achievements`, `POST /v1/me/achievements/unlock`), public
 * rate-limited `dashboard.getDashboardById` (`GET /v1/dashboard/{id}`), and
 * public MDX-backed `lesson` list/get (`GET /v1/lessons`,
 * `GET /v1/lessons/{lesson}/{subtopic}`) with bearer-PAT-or-cookie auth.
 * Legacy `GET /v1/users/{id}/stats` is deleted with no shim (Slice 5, #62).
 * Dynamic by default under Cache Components (reads `req.headers`/`req.url`
 * per request), so per-user responses are never statically cached.
 *
 * Cache split (#42): lesson reads are public content and get a cacheable
 * window (`public, s-maxage=3600`); every per-user operation keeps
 * `private, no-store` so stats and personal data stay fresh.
 */

const NO_STORE = "private, no-store";
const LESSON_LIST_CACHE = "public, s-maxage=3600, stale-while-revalidate=86400";

function cacheControlForPath(pathname: string): string {
  if (
    pathname === "/api/v1/lessons" ||
    pathname.startsWith("/api/v1/lessons/")
  ) {
    return LESSON_LIST_CACHE;
  }
  return NO_STORE;
}

function withCacheControl(req: NextRequest, res: Response): Response {
  const headers = new Headers(res.headers);
  try {
    headers.set(
      "Cache-Control",
      cacheControlForPath(new URL(req.url).pathname)
    );
  } catch {
    headers.set("Cache-Control", NO_STORE);
  }
  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers,
  });
}

async function handle(req: NextRequest): Promise<Response> {
  const res = await createOpenApiFetchHandler({
    router: appRouter,
    createContext: () =>
      createV1Context({ headers: req.headers, req: req as unknown as Request }),
    req: req as unknown as Request,
    // Strip only `/api` so the remaining path keeps the `/v1/*` prefix
    // that the OpenAPI annotations use (`/v1/me`, `/v1/me/progress`, ...).
    // Served through the force-dynamic `/api/v1` catch-all.
    endpoint: "/api",
  });
  return withCacheControl(req, res);
}

export function GET(req: NextRequest): Promise<Response> {
  return handle(req);
}

export function POST(req: NextRequest): Promise<Response> {
  return handle(req);
}

export function PUT(req: NextRequest): Promise<Response> {
  return handle(req);
}

export function PATCH(req: NextRequest): Promise<Response> {
  return handle(req);
}

export function DELETE(req: NextRequest): Promise<Response> {
  return handle(req);
}
