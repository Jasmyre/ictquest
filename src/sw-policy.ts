/**
 * Service-worker routing policy (adapted from the template `swc-policy.ts`
 * reference): the pure assets-only offline decision.
 *
 * Every live trial call — document navigations, authenticated HTML and RSC
 * payloads, session holes, role gates, router prefetches, Server Actions,
 * the tRPC typed transport, and every versioned REST mount Operation over
 * either auth scheme — stays network-only, with unknown future routes
 * network-only by default. Only the public deployment-versioned set serves
 * from precache; offline document navigations receive the generic fallback
 * only. The worker resolves no identity and grants nothing.
 *
 * Pure by construction: no service-worker globals, no `server-only`, no
 * framework imports — so the unit suite pins it and the worker source plus
 * the build config consume it without bundler aliases.
 *
 * ictquest adaptations (the template names do not exist here):
 * - Fallback is `/~offline` (the shell-less route in `src/app/~offline/`),
 *   not `/offline`.
 * - No `/reference` route exists (the Scalar UI lives admin-gated at
 *   `/admin/api-docs`), so it is excluded from precache.
 * - The static contract is served at `/api/v1/openapi.json`, not
 *   `/api/openapi.json`.
 * - `/landing` does not exist; the redirect-sensitive exclusion is
 *   documented on `/` instead (see below).
 */

export const SW_URL = "/serwist/sw.js";

export const SW_SCOPE = "/";

export const OFFLINE_FALLBACK_URL = "/~offline";

/**
 * Public deployment-versioned inventory for `additionalPrecacheEntries` in
 * the Serwist route handler (`src/app/serwist/[path]/route.ts`, kept in sync
 * by `tests/unit/sw-policy.test.ts`): the
 * generic fallback, the redirect-free maintenance page, the served manifest,
 * and the static contract document.
 *
 * `/` is excluded on purpose even though it is public: the marketing landing
 * renders session-aware chrome, so its bytes are not deployment-constant and
 * precaching it would store a signed-in response under a public key.
 */
export const SW_PRECACHED_URLS: readonly string[] = [
  OFFLINE_FALLBACK_URL,
  "/maintenance",
  "/manifest.webmanifest",
  "/api/v1/openapi.json",
];

/** Network-only URL prefixes: NextAuth, typed transports, versioned REST. */
const NETWORK_ONLY_PREFIXES: readonly string[] = [
  "/api/auth",
  "/api/trpc",
  "/api/v1",
  "/api/public",
];

/** Request headers marking RSC payloads, prefetches, and Server Actions. */
const NETWORK_ONLY_HEADERS: readonly string[] = [
  "rsc",
  "next-router-prefetch",
  "next-router-state-tree",
  "next-action",
];

export type SwRequestDecision = "network-only" | "precached";

export type SwRequestSnapshot = {
  destination: string;
  getHeader: (name: string) => string | null;
  method: string;
  mode: string;
  origin: string;
  url: string;
};

const hasPrefix = (pathname: string, prefix: string): boolean =>
  pathname === prefix || pathname.startsWith(`${prefix}/`);

const hasNetworkOnlyHeader = (snapshot: SwRequestSnapshot): boolean => {
  for (const header of NETWORK_ONLY_HEADERS) {
    if (snapshot.getHeader(header) !== null) {
      return true;
    }
  }
  return false;
};

const pathnameOf = (snapshot: SwRequestSnapshot): string | null => {
  let parsed: URL;
  try {
    parsed = new URL(snapshot.url);
  } catch {
    return null;
  }
  if (parsed.origin !== snapshot.origin) {
    return null;
  }
  return parsed.pathname;
};

export function decideSwRequest(
  snapshot: SwRequestSnapshot
): SwRequestDecision {
  // Mutations never serve stale (mirrors the `method !== "GET"` NetworkOnly
  // rule in `src/app/sw.ts`).
  if (snapshot.method !== "GET") {
    return "network-only";
  }
  const pathname = pathnameOf(snapshot);
  if (pathname === null) {
    return "network-only";
  }
  if (hasNetworkOnlyHeader(snapshot)) {
    return "network-only";
  }
  if (hasNetworkOnlyHeader(snapshot)) {
    return "network-only";
  }
  // Exact public allowlist wins over the prefix deny below: the static
  // contract at `/api/v1/openapi.json` lives under the `/api/v1` mount but
  // is deployment-versioned and auth-free, so a plain GET may serve from
  // precache while every per-user Operation stays live.
  if ((SW_PRECACHED_URLS as readonly string[]).includes(pathname)) {
    return "precached";
  }
  for (const prefix of NETWORK_ONLY_PREFIXES) {
    if (hasPrefix(pathname, prefix)) {
      return "network-only";
    }
  }
  return "network-only";
}

export function shouldServeOfflineFallback(request: {
  destination: string;
}): boolean {
  return request.destination === "document";
}
