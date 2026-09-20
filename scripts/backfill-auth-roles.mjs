/**
 * Auth backfill (migration 07, #30 / ADR-0002; finalized in #43).
 *
 * Post-cutover guarantee pass: ensures every user holds the default learner
 * role via the implicit `_RoleToUser` many-to-many join.
 *
 * Historical note: before Migration 20 this script mapped the legacy
 * `User.role` column (ADMIN -> ADMIN membership, USER -> USER membership).
 * The legacy column plus enum were dropped in
 * `20260918000000_auth_contract_final`, so this script no longer reads them;
 * it only guarantees USER membership wherever it is still missing.
 *
 * Runs in one transaction, asserts zero users without "USER", logs per-role
 * counts, and leaves ProgressData, UserAchievement, and Account row counts
 * unchanged.
 *
 * Run: `node scripts/backfill-auth-roles.mjs` (also `npm run db:backfill:auth`).
 * Requires DATABASE_URL. Safe to re-run (upserts + skip-duplicates).
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

    const [roles, usersWithRoles] = await Promise.all([
      tx.role.findMany(),
      tx.user.findMany({
        select: { id: true, roles: { select: { name: true } } },
      }),
    ]);

    const roleIdByName = new Map(roles.map((r) => [r.name, r.id]));
    const existingByUser = new Map();
    for (const u of usersWithRoles) {
      existingByUser.set(u.id, new Set(u.roles.map((r) => r.name)));
    }

    let created = 0;
    for (const user of usersWithRoles) {
      const existing = existingByUser.get(user.id) ?? new Set();
      // Guarantee pass: every user must hold the default learner role.
      // (Legacy ADMIN->ADMIN / USER->USER mapping retired with the column
      // drop in Migration 20; existing memberships are left untouched.)
      if (!existing.has(DEFAULT_ROLE)) {
        await tx.user.update({
          where: { id: user.id },
          data: { roles: { connect: { id: roleIdByName.get(DEFAULT_ROLE) } } },
        });
        existing.add(DEFAULT_ROLE);
        created += 1;
      }
    }

    const memberships = await tx.user.findMany({
      select: { id: true, roles: { select: { name: true } } },
    });
    const rolesByUser = new Map();
    for (const m of memberships) {
      rolesByUser.set(
        m.id,
        m.roles.map((r) => r.name)
      );
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
    for (const [, names] of rolesByUser) {
      for (const name of names) {
        perRole[name] = (perRole[name] ?? 0) + 1;
      }
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
