import { generateOpenApiDocument } from "trpc-to-openapi";
import { appRouter } from "@/server/api/root";

/**
 * Public OpenAPI document (Migration 18, #41 / ADR 0005; lessons + stats in
 * Migration 19, #42).
 *
 * Served at `/api/v1/openapi.json` with no auth. Interactive Scalar/Redoc UI
 * stays dev-or-admin-only and is never part of the default bundle.
 * Per-user operation responses are `private, no-store` at the catch-all
 * handler; lesson reads are cacheable and this static contract document may
 * be cached briefly.
 */
export function getV1BaseUrl(req?: Request): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (fromEnv) {
    return fromEnv;
  }
  if (req) {
    try {
      const url = new URL(req.url);
      return `${url.protocol}//${url.host}`;
    } catch {
      // fall through to localhost default
    }
  }
  return "http://localhost:3000";
}

export function buildOpenApiDocument(baseUrl: string) {
  return generateOpenApiDocument(appRouter, {
    title: "ICTQuest API",
    description:
      "Versioned REST for me, progress, achievements, lessons, and public user stats. Bearer PAT or cookie auth; batch tRPC stays cookie-only.",
    version: "v1",
    baseUrl,
    tags: ["me", "lessons", "users"],
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "authjs.session-token",
      },
    },
  });
}
