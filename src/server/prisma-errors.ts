/**
 * Shared Prisma error predicates (code-review Standards fix).
 *
 * The `P2002` unique-constraint race check was duplicated between
 * `src/lib/roles.ts` (`ensureDefaultRole`) and
 * `src/server/services/achievement.ts` (concurrent unlock), and the
 * `P2025` missing-row check lived inline in `src/server/services/admin.ts`.
 * All call sites now share these narrowing helpers instead of repeating
 * the shape or asserting on `error`.
 */

function errorCode(error: unknown): string | undefined {
  if (typeof error !== "object" || error === null) {
    return;
  }
  if (!("code" in error)) {
    return;
  }
  const code: unknown = error.code;
  return typeof code === "string" ? code : undefined;
}

export function isUniqueConstraintRace(error: unknown): boolean {
  return errorCode(error) === "P2002";
}

export function isMissingRecord(error: unknown): boolean {
  return errorCode(error) === "P2025";
}
