import type { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { isUniqueConstraintRace } from "@/server/prisma-errors";
import { createUserRepository } from "@/server/repositories/user";

/**
 * Implicit role membership service (Slice 2, #59; repository tier in
 * Slice 6, #63).
 *
 * Thin helpers over the implicit many-to-many join (`User.roles` /
 * `Role.users`, table `_RoleToUser`). Both helpers are idempotent: repeating a
 * connect (or disconnect) resolves to the same success shape instead of
 * throwing a unique-violation error.
 *
 * Join persistence lives in `src/server/repositories/user.ts`
 * (`connectRole` / `disconnectRole`) — this module owns the idempotency
 * rule and never touches Prisma directly.
 */

type Db = Pick<PrismaClient, "user" | "role">;

export async function connectMembership(
  db: Db,
  userId: string,
  roleId: string
) {
  // Join persistence takes the shared user store handle.
  const repository = createUserRepository(db);
  try {
    await repository.connectRole(userId, roleId);
    return {
      success: true as const,
      data: { userId, roleId, status: "connected" as const },
    };
  } catch (error) {
    // Already connected: unique violation on the join primary key.
    // Idempotent by design - resolve to the same success shape.
    if (isUniqueConstraintRace(error)) {
      return {
        success: true as const,
        data: { userId, roleId, status: "connected" as const },
      };
    }
    if (error instanceof TRPCError) {
      throw error;
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Unable to connect the membership right now. Try again later.",
    });
  }
}

export async function disconnectMembership(
  db: Db,
  userId: string,
  roleId: string
) {
  // Prisma `disconnect` on a non-linked implicit join row is a no-op, so
  // repeating a disconnect is inherently idempotent. Join persistence
  // takes the shared user store handle.
  const repository = createUserRepository(db);
  try {
    await repository.disconnectRole(userId, roleId);
    return {
      success: true as const,
      data: { userId, roleId, status: "disconnected" as const },
    };
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message:
        "Unable to disconnect the membership right now. Try again later.",
    });
  }
}
