import type { NextRequest } from "next/server";
import { createOpenApiFetchHandler } from "trpc-to-openapi";
import { appRouter } from "@/server/api/root";
import { createV1Context } from "@/server/api/v1-context";

/**
 * Versioned REST catch-all (Migration 18, #41 / ADR 0005).
 *
 * Serves annotated `user.getUser` (`GET /v1/me`), `progress` list/create/
 * delete (`/v1/me/progress`), and `achievement` list/unlock/delete
 * (`/v1/me/achievements`, `POST /v1/me/achievements/unlock`) with
 * bearer-PAT-or-cookie auth. Force-dynamic so per-user responses are never
 * statically cached; every response carries `private, no-store`.
 */
export const dynamic = "force-dynamic";

const NO_STORE = "private, no-store";

function withNoStore(res: Response): Response {
  const headers = new Headers(res.headers);
  headers.set("Cache-Control", NO_STORE);
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
    endpoint: "/api/v1",
  });
  return withNoStore(res);
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
