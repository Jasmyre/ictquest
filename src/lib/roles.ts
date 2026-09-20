import type { PrismaClient } from "@prisma/client";

export const ROLE_NAMES = ["ADMIN", "MODERATOR", "USER"] as const;
export type RoleName = (typeof ROLE_NAMES)[number];

export const DEFAULT_ROLE_NAME: RoleName = "USER";

// Minimal structural surface over PrismaClient so unit tests can import this
// module without pulling in `@/lib/db` (which validates env at import time).
// Slice 3 (#60): roles persist on the implicit many-to-many join
// (`User.roles` / `Role.users`, table `_RoleToUser`); the legacy explicit
// provenance table is deleted.
export type RoleStore = Pick<PrismaClient, "role" | "user">;

async function defaultStore(): Promise<RoleStore> {
  const { db } = await import("@/lib/db");
  return db as RoleStore;
}

export function hasRole(
  roles: readonly string[] | undefined | null,
  role: RoleName
): boolean {
  if (!roles) {
    return false;
  }
  return roles.includes(role);
}

export async function getUserRoleNames(
  userId: string,
  client?: RoleStore
): Promise<RoleName[]> {
  const store = client ?? (await defaultStore());
  const user = await store.user.findUnique({
    where: { id: userId },
    include: { roles: true },
  });
  if (!user) {
    return [];
  }
  return user.roles.map((r) => r.name as RoleName);
}

export async function ensureDefaultRole(
  userId: string,
  client?: RoleStore
): Promise<RoleName[]> {
  const store = client ?? (await defaultStore());
  const existing = await getUserRoleNames(userId, store);
  if (existing.includes(DEFAULT_ROLE_NAME)) {
    return existing;
  }
  const role = await store.role.upsert({
    where: { name: DEFAULT_ROLE_NAME },
    update: {},
    create: { name: DEFAULT_ROLE_NAME },
  });
  try {
    await store.user.update({
      where: { id: userId },
      data: { roles: { connect: { id: role.id } } },
    });
  } catch (error) {
    // Concurrent heal already connected the join row: converge idempotently.
    if (
      typeof error !== "object" ||
      error === null ||
      (error as { code?: unknown }).code !== "P2002"
    ) {
      throw error;
    }
  }
  return [...existing, DEFAULT_ROLE_NAME];
}

export type BackfillUserInput = {
  id: string;
  legacyRole: RoleName;
  existing: readonly string[];
};

export type BackfillAssignment = {
  userId: string;
  roleName: RoleName;
  assignedBy: string;
};

/**
 * Historical backfill planner (pre-Migration 20, #30 / ADR-0002).
 *
 * Maps the retired legacy `User.role` column onto membership rows. Kept for
 * the documented cutover history and its unit coverage; the runnable
 * `scripts/backfill-auth-roles.mjs` no longer reads the dropped column and
 * only guarantees the default role.
 */
export function buildBackfillPlan(
  users: BackfillUserInput[]
): BackfillAssignment[] {
  const plan: BackfillAssignment[] = [];
  for (const user of users) {
    const has = new Set(user.existing);
    const wanted = new Set<RoleName>();
    if (user.legacyRole === "ADMIN") {
      wanted.add("ADMIN");
    } else {
      wanted.add("USER");
    }
    // Guarantee pass: every user must hold the default learner role.
    wanted.add(DEFAULT_ROLE_NAME);
    for (const roleName of wanted) {
      if (!has.has(roleName)) {
        plan.push({
          userId: user.id,
          roleName,
          assignedBy: "backfill",
        });
      }
    }
  }
  return plan;
}

export function assertZeroWithoutDefault(
  users: { id: string; roles: readonly string[] }[]
): void {
  const missing = users
    .filter((u) => !u.roles.includes(DEFAULT_ROLE_NAME))
    .map((u) => u.id);
  if (missing.length > 0) {
    throw new Error(
      `Backfill invariant violated: ${missing.length} user(s) without "${DEFAULT_ROLE_NAME}": ${missing.join(", ")}`
    );
  }
}
