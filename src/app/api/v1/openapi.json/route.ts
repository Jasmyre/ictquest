import type { NextRequest } from "next/server";
import { buildOpenApiDocument, getV1BaseUrl } from "@/server/api/openapi";

/**
 * Public OpenAPI JSON (Migration 18, #41 / ADR 0005).
 *
 * No auth: API consumers discover `/v1/me`, `/v1/me/progress`, and
 * `/v1/me/achievements` without screen-scraping. The interactive
 * Scalar/Redoc UI stays dev-or-admin-only and never ships in the default
 * bundle. The contract document itself is static and may be cached briefly;
 * per-user operation responses stay `private, no-store` at the catch-all.
 *
 * Dynamic by default under Cache Components (reads the request for base URL).
 */

export function GET(req: NextRequest): Response {
  const baseUrl = getV1BaseUrl(req as unknown as Request);
  const document = buildOpenApiDocument(baseUrl);
  return Response.json(document, {
    headers: {
      // Static contract: short public cache is safe.
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
