import type { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import type {
  ListAchievementsInput,
  UnlockAchievementInput,
} from "@/server/schemas/achievement";

/**
 * Shared achievement service (Migration 13, #36).
 *
 * Canonical per-user achievement list/unlock/delete logic. Both the new
 * `achievement` router and the legacy `user` achievement procedures are fed
 * by these helpers so the unlock-to-inventory journey stays consistent
 * across seams.
 */

type Db = Pick<PrismaClient, "achievement" | "userAchievement">;

function pickPagination(input: ListAchievementsInput): {
  skip: number;
  take: number;
} {
  return { skip: input.skip ?? 0, take: input.take ?? 20 };
}

function isUniqueConstraintRace(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    (error as { code?: unknown }).code === "P2002"
  );
}

export async function listAchievements(
  db: Db,
  userId: string,
  input: ListAchievementsInput
) {
  const { skip, take } = pickPagination(input);
  try {
    const achievements = await db.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
      skip,
      take,
    });
    return { success: true as const, data: achievements };
  } catch (error) {
    console.error("listAchievements error:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message:
        "Unable to load your achievements right now. Please try again later.",
    });
  }
}

export async function deleteAllAchievements(db: Db, userId: string) {
  try {
    await db.userAchievement.deleteMany({ where: { userId } });
    return { success: true as const };
  } catch (error) {
    console.error("deleteAllAchievements error:", error);
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
  try {
    const achievement = await db.achievement.findUnique({
      where: { name: achievementName },
    });

    if (!achievement) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "The achievement is unavailable or may have been removed.",
      });
    }

    const existingUnlock = await db.userAchievement.findUnique({
      where: {
        userId_achievementId: { userId, achievementId: achievement.id },
      },
    });

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
      const newUnlock = await db.userAchievement.create({
        data: {
          userId,
          achievementId: achievement.id,
          achievementName: achievement.name,
          achievementDescription: achievement.description ?? "No description",
        },
      });

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
        const already = await db.userAchievement.findUnique({
          where: {
            userId_achievementId: { userId, achievementId: achievement.id },
          },
        });

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
    console.error("unlockAchievement error: ", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message:
        "Unable to unlock achievement right now. Please try again later.",
    });
  }
}
