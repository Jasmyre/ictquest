/**
 * Route-group guard table (ADR 0003).
 *
 * - `(marketing)` public, minimal shell: `/`, `/lessons` (exact only),
 *   `/terms`, `/privacy`.
 * - `(app)` authenticated, full shell: everything else that renders a page
 *   except auth, maintenance, and admin prefixes.
 * - Standalone shell-less: `/auth/*` (redirect-if-logged-in), `/maintenance`
 *   (env-gated bypass of all guards).
 * - `(admin)` ADMIN-only (shell lands in #34): `/admin/*`.
 *
 * Matching is prefix-based with one intentional exact-exception: `/lessons`
 * is exact-public while `/lessons/*` is authed.
 */

export const publicRoutes = ["/", "/lessons", "/terms", "/privacy"];

export const authRoutes = ["/auth", "/auth/error", "/api/auth/callback/google"];

export const adminRoutes = ["/admin"];

export const apiAuthPrefix = "/api/auth";

export const publicApiPrefix = "/api/public";

export const maintenanceRoute = "/maintenance";

export const DEFAULT_LOGIN_REDIRECT = "/";

/** Prefix match: `pathname` equals `base` or lives under its subtree. */
function matchesPrefix(pathname: string, base: string): boolean {
  return pathname === base || pathname.startsWith(`${base}/`);
}
/** Exact match: public shell owns only these paths, never their subtrees. */
export function isPublicRoute(pathname: string): boolean {
  return publicRoutes.includes(pathname);
}

/**
 * Prefix match over the auth table: `/auth` owns its subtree
 * (`/auth/error`, …). API callbacks stay listed for compatibility but are
 * bypassed earlier in `proxy.ts` via `apiAuthPrefix`, so the OAuth
 * handshake never hits the redirect-if-logged-in branch.
 */
export function isAuthRoute(pathname: string): boolean {
  return authRoutes.some((base) => matchesPrefix(pathname, base));
}

/** Prefix match over the admin table: `/admin` plus its entire subtree. */
export function isAdminRoute(pathname: string): boolean {
  return adminRoutes.some((base) => matchesPrefix(pathname, base));
}

/** Maintenance bypasses every guard and shell (env-gated in `proxy.ts`). */
export function isMaintenanceBypass(pathname: string): boolean {
  return matchesPrefix(pathname, maintenanceRoute);
}

/** Public API prefix bypasses session guards (rate-limited REST reads). */
export function isPublicApiRoute(pathname: string): boolean {
  return matchesPrefix(pathname, publicApiPrefix);
}
