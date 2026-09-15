/**
 * Auth backfill (migration 07, #30 / ADR-0002).
 *
 * Maps the legacy `User.role` column onto the explicit `UserRoleAssignment`
 * join, then guarantees every user holds the default learner role:
 *
 * - legacy ADMIN -> ADMIN membership
 * - legacy USER  -> USER membership
 * - guarantee pass -> USER membership wherever it is still missing
 *   (so admins end up with ADMIN + USER)
 *
 * Runs in one transaction, asserts zero users without "USER", logs per-role
 * counts, and leaves ProgressData, UserAchievement, and Account row counts
 * unchanged.
 *
 * Run: `node scripts/backfill-auth-roles.mjs` (also `npm run db:backfill:auth`).
 * Requires DATABASE_URL. Safe to re-run (upserts + skip-duplicates).
 *
 * NOTE: the legacy->membership mapping below deliberately mirrors
 * `buildBackfillPlan` in `src/lib/roles.ts` (same ADMIN->ADMIN+USER,
 * USER->USER, guarantee-USER shape) so this script stays dependency-free
 * in CI with no `@/` alias resolution. Keep the two in sync.
 */

import { PrismaClient } from "@prisma/client";

const DEFAULT_ROLE = "USER";

const prisma = new PrismaClient();

async function main() {
  const before = {
    ProgressData: await prisma.progressData.count(),
    UserAchievement: await prisma.userAchievement.count(),
    Account: await prisma.account.count(),
  };

  const result = await prisma.$transaction(async (tx) => {
    for (const name of ["ADMIN", "MODERATOR", "USER"]) {
      await tx.role.upsert({ where: { name }, update: {}, create: { name } });
    }

    const [roles, users, assignments] = await Promise.all([
      tx.role.findMany(),
      tx.user.findMany({ select: { id: true, role: true } }),
      tx.userRoleAssignment.findMany({
        include: { role: { select: { name: true } } },
      }),
    ]);

    const roleIdByName = new Map(roles.map((r) => [r.name, r.id]));
    const existingByUser = new Map();
    for (const a of assignments) {
      if (!existingByUser.has(a.userId)) {
        existingByUser.set(a.userId, new Set());
      }
      existingByUser.get(a.userId).add(a.role.name);
    }

    let created = 0;
    for (const user of users) {
      const existing = existingByUser.get(user.id) ?? new Set();
      const wanted = new Set();
      if (user.role === "ADMIN") {
        wanted.add("ADMIN");
      } else {
        wanted.add(DEFAULT_ROLE);
      }
      // Guarantee pass: every user must hold the default learner role.
      wanted.add(DEFAULT_ROLE);
      for (const roleName of wanted) {
        if (!existing.has(roleName)) {
          await tx.userRoleAssignment.upsert({
            where: {
              userId_roleId: {
                userId: user.id,
                roleId: roleIdByName.get(roleName),
              },
            },
            update: {},
            create: {
              userId: user.id,
              roleId: roleIdByName.get(roleName),
              assignedBy: "backfill",
            },
          });
          existing.add(roleName);
          created += 1;
        }
      }
    }

    const memberships = await tx.userRoleAssignment.findMany({
      include: { role: { select: { name: true } } },
    });
    const rolesByUser = new Map();
    for (const m of memberships) {
      if (!rolesByUser.has(m.userId)) {
        rolesByUser.set(m.userId, []);
      }
      rolesByUser.get(m.userId).push(m.role.name);
    }
    const allUsers = await tx.user.findMany({ select: { id: true } });
    const withoutDefault = allUsers
      .filter((u) => !(rolesByUser.get(u.id) ?? []).includes(DEFAULT_ROLE))
      .map((u) => u.id);
    // Assert zero users without the default role.
    if (withoutDefault.length > 0) {
      throw new Error(
        `Backfill invariant violated: ${withoutDefault.length} user(s) without "${DEFAULT_ROLE}": ${withoutDefault.join(", ")}`
      );
    }

    const perRole = {};
    for (const m of memberships) {
      perRole[m.role.name] = (perRole[m.role.name] ?? 0) + 1;
    }

    return { created, perRole };
  });

  const after = {
    ProgressData: await prisma.progressData.count(),
    UserAchievement: await prisma.userAchievement.count(),
    Account: await prisma.account.count(),
  };

  for (const table of ["ProgressData", "UserAchievement", "Account"]) {
    if (before[table] !== after[table]) {
      throw new Error(
        `Backfill guard violated: ${table} row count changed (${before[table]} -> ${after[table]}). Progress, grant, and account rows must stay untouched.`
      );
    }
  }

  console.log(
    `Auth backfill complete: ${result.created} membership(s) created. Per-role counts: ${JSON.stringify(result.perRole)}. ` +
      `Row counts unchanged: ${JSON.stringify(after)}. Zero users without "${DEFAULT_ROLE}".`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
