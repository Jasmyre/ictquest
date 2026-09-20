import type { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { logError } from "@/server/logger";
import { pickPagination } from "@/server/pagination";
import { isUniqueConstraintRace } from "@/server/prisma-errors";
import {
  createAchievementRepository,
  type GrantRow,
} from "@/server/repositories/achievement";
import type {
  ListAchievementsInput,
  UnlockAchievementInput,
} from "@/server/schemas/achievement";

/**
 * Shared achievement service (Migration 13, #36; repository tier in
 * Slice 6, #63).
 *
 * Canonical per-user achievement list/unlock/delete logic. Both the new
 * `achievement` router and the legacy `user` achievement procedures are fed
 * by these helpers so the unlock-to-inventory journey stays consistent
 * across seams.
 *
 * Persistence lives in `src/server/repositories/achievement.ts` — this
 * module owns domain rules only (idempotent unlock, unique-race
 * tolerance, grant scoping) and never touches Prisma directly.
 */

type Db = Pick<PrismaClient, "achievement" | "userAchievement">;

export async function listAchievements(
  db: Db,
  userId: string,
  input: ListAchievementsInput
) {
  const { skip, take } = pickPagination(input);
  const repository = createAchievementRepository(db);
  try {
    const achievements = await repository.listGrants(userId, skip, take);
    return { success: true as const, data: achievements };
  } catch (error) {
    logError("listAchievements error:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message:
        "Unable to load your achievements right now. Please try again later.",
    });
  }
}

export async function deleteAllAchievements(db: Db, userId: string) {
  const repository = createAchievementRepository(db);
  try {
    await repository.deleteGrantsByUser(userId);
    return { success: true as const };
  } catch (error) {
    logError("deleteAllAchievements error:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message:
        "Unable to delete all your achievements right now. Please try again later.",
    });
  }
}

export async function unlockAchievement(
  db: Db,
  userId: string,
  input: UnlockAchievementInput
) {
  const { achievementName } = input;
  const repository = createAchievementRepository(db);
  try {
    const achievement = await repository.findCatalogByName(achievementName);

    if (!achievement) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "The achievement is unavailable or may have been removed.",
      });
    }

    const existingUnlock: GrantRow | null = await repository.findGrant(
      userId,
      achievement.id
    );

    if (existingUnlock) {
      return {
        success: true as const,
        data: {
          message: "Achievement already unlocked",
          achievement: existingUnlock,
          status: "unlocked" as const,
        },
      };
    }

    try {
      const newUnlock = await repository.createGrant(
        userId,
        achievement.id,
        achievement.name,
        achievement.description ?? "No description"
      );

      return {
        success: true as const,
        data: {
          message: "Achievement unlocked!",
          achievement: newUnlock,
          status: "new" as const,
        },
      };
    } catch (createErr) {
      // A concurrent request may have won the unique constraint race.
      if (isUniqueConstraintRace(createErr)) {
        const already = await repository.findGrant(userId, achievement.id);

        return {
          success: true as const,
          data: {
            message: "Achievement already unlocked",
            achievement: already,
            status: "unlocked" as const,
          },
        };
      }
      throw createErr;
    }
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }
    logError("unlockAchievement error: ", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message:
        "Unable to unlock achievement right now. Please try again later.",
    });
  }
}
