// Client-safe role vocabulary (no server imports).
//
// `src/lib/roles.ts` owns the DB-backed helpers and re-exports everything
// here, so server code keeps importing `@/lib/roles`. Client components must
// import from this leaf instead — importing `@/lib/roles` drags `@/lib/db`
// (via a dynamic `await import`) plus `pg`'s node builtins (`dns`, `net`,
// `tls`, `fs`) into the browser bundle and breaks `next build`.

export const ROLE_NAMES = ["ADMIN", "MODERATOR", "USER"] as const;
export type RoleName = (typeof ROLE_NAMES)[number];

export const DEFAULT_ROLE_NAME: RoleName = "USER";

export function hasRole(
  roles: readonly string[] | undefined | null,
  role: RoleName
): boolean {
  if (!roles) {
    return false;
  }
  const wanted = role.toUpperCase();
  return roles.some((r) => typeof r === "string" && r.toUpperCase() === wanted);
}
