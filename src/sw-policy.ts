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
 * - `/landing` is redirect-sensitive (signed-in traffic bounces to `/`),
 *   so the exclusion below covers it alongside the authed dashboard `/`.
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
 * `/landing` and `/` stay network-only on purpose: the landing page
 * renders session-aware chrome and `/` is the per-user dashboard, so
 * neither body is deployment-constant and precaching either would store a
 * signed-in response under a public key.
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

const TRAILING_DOT = /\.$/;
const SW_SECURITY_ERROR_PATTERN = /securityerror/i;
const SW_SSL_CERT_PATTERN = /ssl certificate/i;

/** Hostnames where dev SW registration is safe (localhost-only cert). */
export function isLoopbackHostname(hostname: string): boolean {
  const normalized = hostname.trim().toLowerCase().replace(TRAILING_DOT, "");
  return (
    normalized === "localhost" ||
    normalized === "127.0.0.1" ||
    normalized === "::1" ||
    normalized === "[::1]" ||
    normalized.startsWith("127.")
  );
}

export type SwRegistrationSnapshot = {
  allowLan?: string | undefined;
  hostname: string;
  isSecureContext: boolean;
  nodeEnv: string | undefined;
  swInDev: string | undefined;
};

/**
 * Decides whether SW registration must stay disabled. Production registers
 * only in a secure context; dev registers only with an explicit opt-in
 * (`NEXT_PUBLIC_SW_IN_DEV=1`) on a loopback host — or on a LAN host when
 * the trusted-LAN escape hatch is set (`NEXT_PUBLIC_SW_ALLOW_LAN=1`,
 * meaning a SAN-covering cert like `certificates/lan-cert.pem` is served
 * and trusted by the phone). Without a covering cert, LAN registration
 * throws `SecurityError: An SSL certificate error occurred when fetching
 * the script`.
 */
export function shouldDisableSwRegistration(
  snapshot: SwRegistrationSnapshot
): boolean {
  if (!snapshot.isSecureContext) {
    return true;
  }
  if (snapshot.nodeEnv === "production") {
    return false;
  }
  if (snapshot.swInDev !== "1") {
    return true;
  }
  if (snapshot.allowLan === "1") {
    return false;
  }
  return !isLoopbackHostname(snapshot.hostname);
}

/**
 * Detects the LAN-TLS cert failure thrown when the browser rejects the
 * worker script (`SecurityError: ... SSL certificate error ...`). Pure so
 * the provider can map it to one actionable `console.error` instead of a
 * raw stack. Accepts `Error`/`DOMException` instances (duck-typed via
 * `name`/`message` because `DOMException instanceof Error` is false in
 * browsers), plain strings, and `unhandledrejection`-style `{ reason }` /
 * `ErrorEvent`-style `{ error, message }` wrappers.
 */
export function isSwCertError(value: unknown): boolean {
  const textOf = (candidate: unknown): string | null => {
    if (candidate instanceof Error) {
      return `${candidate.name} ${candidate.message}`;
    }
    if (typeof candidate === "string") {
      return candidate;
    }
    if (typeof candidate === "object" && candidate !== null) {
      const record = candidate as { message?: unknown; name?: unknown };
      const name = typeof record.name === "string" ? record.name : "";
      const message = typeof record.message === "string" ? record.message : "";
      if (name !== "" || message !== "") {
        return `${name} ${message}`;
      }
    }
    return null;
  };
  const matches = (candidate: unknown): boolean => {
    const text = textOf(candidate);
    return (
      text !== null &&
      SW_SECURITY_ERROR_PATTERN.test(text) &&
      SW_SSL_CERT_PATTERN.test(text)
    );
  };
  if (matches(value)) {
    return true;
  }
  if (typeof value === "object" && value !== null) {
    const wrapper = value as { error?: unknown; reason?: unknown };
    return matches(wrapper.reason) || matches(wrapper.error);
  }
  return false;
}

/**
 * Visible remediation for a LAN cert failure. Kept pure (and unit-pinned)
 * so every surface — provider listener, dev-server log — prints identical
 * steps. PC trust is listed first: the same error on the dev machine means
 * Windows itself doesn't trust the local CA yet.
 */
export function buildSwCertErrorMessage(host: string): string {
  return (
    `[serwist] SW registration failed on "${host}": the browser rejected ` +
    "/serwist/sw.js with `SecurityError: SSL certificate error`. " +
    "The LAN cert covers this IP but the device does not trust the local CA. " +
    "1) PC: install certificates/lan-ca.pem into Windows Trusted Root CA " +
    "(certmgr) and restart Chrome. " +
    "2) Phone: install certificates/lan-ca.pem once as trusted " +
    "(Android: Trusted credentials > User; iOS: profile + full trust). " +
    "3) Verify: openssl x509 -in certificates/lan-cert.pem -noout " +
    "-ext subjectAltName must list this IP. " +
    "4) Restart: npm run dev:https:lan:sw -- --ip=<lan-ip>. " +
    "Non-PWA LAN testing needs no cert: npm run dev:lan."
  );
}
