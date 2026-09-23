import { Suspense } from "react";
import ScalarDocs from "./scalar-docs";

/**
 * Admin API docs (`/admin/api-docs`, Migration 18, #41 / ADR 0005).
 *
 * Interactive Scalar reference UI is dev-or-admin-only: this page lives
 * under the `(admin)` shell plus the `proxy.ts` ADMIN guard, so only ADMIN
 * sessions reach it in production (devs use an admin account). The Scalar
 * bundle is client-only via the `"use client"` `scalar-docs` component,
 * which lazy-imports `@scalar/api-reference` inside `useEffect`, so it never
 * lands in the default server bundle. The public contract stays at
 * `/api/v1/openapi.json` with no auth.
 */

export default function AdminApiDocsPage() {
  return (
    <div
      className="w-full min-w-0 flex-1 p-4 lg:px-8"
      data-testid="admin-api-docs"
    >
      <h1 className="font-bold text-2xl text-gray-900 dark:text-white">
        API Docs
      </h1>
      <p className="text-gray-600 text-sm dark:text-gray-300">
        Interactive reference for the versioned REST contract. Public OpenAPI
        JSON is served at /api/v1/openapi.json; this UI is admin-only and never
        ships in the default bundle.
      </p>
      <Suspense fallback={<p>Loading API reference…</p>}>
        <ScalarDocs />
      </Suspense>
    </div>
  );
}
