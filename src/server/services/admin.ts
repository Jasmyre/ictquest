import type { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import type { RoleName } from "@/lib/roles";
import type {
  GrantAchievementInput,
  ListUsersInput,
  ResetProgressInput,
  RevokeAchievementInput,
} from "@/server/schemas/admin";
import { unlockAchievement } from "@/server/services/achievement";

/**
 * Admin user plus progress-op service (Migration 14, #37).
 *
 * Backs the ADMIN-gated `admin` router procedures: user/role assignment
 * management and per-user progress support ops (grant/revoke achievements,
 * reset progress). All procedures sit behind `adminProcedure`, so learners
 * are denied with FORBIDDEN and anonymous callers with UNAUTHORIZED before
 * these helpers ever run.
 */

type Db = Pick<
  PrismaClient,
  | "user"
  | "role"
  | "userRoleAssignment"
  | "progressData"
  | "achievement"
  | "userAchievement"
>;

type RoleInput = { userId: string; role: RoleName };

function pickPagination(input: ListUsersInput): {
  skip: number;
  take: number;
} {
  return { skip: input.skip ?? 0, take: input.take ?? 20 };
}

async function assertUserExists(db: Db, userId: string): Promise<void> {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new TRPCError({ code: "NOT_FOUND", message: "User not found." });
  }
}

async function currentRoles(db: Db, userId: string): Promise<string[]> {
  const assignments = await db.userRoleAssignment.findMany({
    where: { userId },
    include: { role: true },
  });
  return assignments.map((a) => a.role.name);
}

export async function listUsersWithRoles(db: Db, input: ListUsersInput) {
  const { skip, take } = pickPagination(input);
  try {
    const users = await db.user.findMany({
      skip,
      take,
      select: {
        id: true,
        email: true,
        userName: true,
        roleAssignments: { include: { role: true } },
      },
    });
    return {
      success: true as const,
      data: users.map((u) => ({
        id: u.id,
        email: u.email,
        userName: u.userName,
        roles: u.roleAssignments.map((a) => a.role.name),
      })),
    };
  } catch (error) {
    console.error("listUsersWithRoles error:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Unable to load users right now. Please try again later.",
    });
  }
}

export async function grantRole(db: Db, input: RoleInput, assignedBy?: string) {
  try {
    await assertUserExists(db, input.userId);
    const role = await db.role.upsert({
      where: { name: input.role },
      update: {},
      create: { name: input.role },
    });
    await db.userRoleAssignment.upsert({
      where: { userId_roleId: { userId: input.userId, roleId: role.id } },
      update: {},
      create: {
        userId: input.userId,
        roleId: role.id,
        assignedBy: assignedBy ?? "admin",
      },
    });
    return {
      success: true as const,
      data: {
        userId: input.userId,
        roles: await currentRoles(db, input.userId),
      },
    };
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }
    console.error("grantRole error:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Unable to grant the role right now. Please try again later.",
    });
  }
}

export async function revokeRole(db: Db, input: RoleInput) {
  try {
    await assertUserExists(db, input.userId);
    const role = await db.role.findUnique({ where: { name: input.role } });
    if (!role) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Role not found." });
    }
    const roles = await currentRoles(db, input.userId);
    if (!roles.includes(input.role)) {
      return {
        success: true as const,
        data: {
          userId: input.userId,
          roles,
          status: "already-removed" as const,
        },
      };
    }
    if (roles.length <= 1) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Cannot revoke the user's only role.",
      });
    }
    try {
      await db.userRoleAssignment.delete({
        where: { userId_roleId: { userId: input.userId, roleId: role.id } },
      });
    } catch (deleteErr) {
      if (
        typeof deleteErr === "object" &&
        deleteErr !== null &&
        (deleteErr as { code?: unknown }).code === "P2025"
      ) {
        return {
          success: true as const,
          data: {
            userId: input.userId,
            roles: await currentRoles(db, input.userId),
            status: "already-removed" as const,
          },
        };
      }
      throw deleteErr;
    }
    return {
      success: true as const,
      data: {
        userId: input.userId,
        roles: await currentRoles(db, input.userId),
        status: "removed" as const,
      },
    };
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }
    console.error("revokeRole error:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Unable to revoke the role right now. Please try again later.",
    });
  }
}

export async function grantAchievementForUser(
  db: Db,
  input: GrantAchievementInput
) {
  try {
    await assertUserExists(db, input.userId);
    return await unlockAchievement(db, input.userId, {
      achievementName: input.achievementName,
    });
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }
    console.error("grantAchievementForUser error:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Unable to grant the achievement right now. Try again later.",
    });
  }
}

export async function revokeAchievementForUser(
  db: Db,
  input: RevokeAchievementInput
) {
  try {
    await assertUserExists(db, input.userId);
    const achievement = await db.achievement.findUnique({
      where: { name: input.achievementName },
    });
    if (!achievement) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "The achievement is unavailable or may have been removed.",
      });
    }
    const existing = await db.userAchievement.findUnique({
      where: {
        userId_achievementId: {
          userId: input.userId,
          achievementId: achievement.id,
        },
      },
    });
    if (!existing) {
      return {
        success: true as const,
        data: { userId: input.userId, status: "already-removed" as const },
      };
    }
    await db.userAchievement.delete({ where: { id: existing.id } });
    return {
      success: true as const,
      data: { userId: input.userId, status: "removed" as const },
    };
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }
    console.error("revokeAchievementForUser error:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Unable to revoke the achievement right now. Try again later.",
    });
  }
}

export async function resetUserProgress(db: Db, input: ResetProgressInput) {
  try {
    await assertUserExists(db, input.userId);
    const result = await db.progressData.deleteMany({
      where: { userId: input.userId },
    });
    return {
      success: true as const,
      data: { userId: input.userId, deleted: result.count },
    };
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }
    console.error("resetUserProgress error:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Unable to reset progress right now. Please try again later.",
    });
  }
}
