import type { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { calculateAverageProgress } from "@/lib/progress";
import type {
  CreateProgressInput,
  ListProgressInput,
} from "@/server/schemas/progress";

/**
 * Shared progress service (Migration 12, #35).
 *
 * Canonical per-user progress plus stats logic. Both the new `progress`
 * router and the legacy `user` progress procedures are fed by these
 * helpers so the learner journey stays consistent across seams.
 */

type ProgressRow = {
  id: string;
  userId: string;
  topic: string;
  subtopics: string[];
};

type Db = Pick<PrismaClient, "progressData" | "user">;

function pickPagination(input: ListProgressInput): {
  skip: number;
  take: number;
} {
  return { skip: input.skip ?? 0, take: input.take ?? 20 };
}

export async function listProgress(
  db: Db,
  userId: string,
  input: ListProgressInput
): Promise<{ success: true; data: ProgressRow[] }> {
  const { skip, take } = pickPagination(input);
  try {
    const progress: ProgressRow[] = await db.progressData.findMany({
      where: { userId },
      skip,
      take,
    });
    return { success: true as const, data: progress };
  } catch (error) {
    console.error("listProgress error:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message:
        "Unable to load your progress right now. Please try again later.",
    });
  }
}

export async function createProgress(
  db: Db,
  userId: string,
  input: CreateProgressInput
): Promise<{ success: true; data: ProgressRow }> {
  const { topic, subtopic } = input;
  try {
    const existing: ProgressRow | null = await db.progressData.findFirst({
      where: { userId, topic },
    });

    if (existing) {
      if (existing.subtopics?.includes(subtopic)) {
        return { success: true as const, data: existing };
      }
      const updated: ProgressRow = await db.progressData.update({
        where: { id: existing.id },
        data: { subtopics: { push: subtopic } },
      });
      return { success: true as const, data: updated };
    }

    const created: ProgressRow = await db.progressData.create({
      data: { userId, topic, subtopics: [subtopic] },
    });
    return { success: true as const, data: created };
  } catch (error) {
    console.error("createProgress error:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Unable to record progress right now. Try again later.",
    });
  }
}

export async function deleteAllProgress(db: Db, userId: string) {
  try {
    await db.progressData.deleteMany({ where: { userId } });
    return { success: true as const };
  } catch (error) {
    console.error("deleteAllProgress error:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message:
        "Unable to delete all your progress right now. Please try again later.",
    });
  }
}

type StatsUser = {
  id: string;
  userName: string | null;
  image: string | null;
  userAchievements: Array<{ id: number }>;
  progressData: Array<{ topic: string; subtopics: string[] }>;
};

export async function getStatsById(db: Db, id: string) {
  try {
    const user: StatsUser | null = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        userName: true,
        image: true,
        userAchievements: { select: { id: true } },
        progressData: { select: { subtopics: true, topic: true } },
      },
    });

    if (!user) {
      console.error("User not found with id: ", id);
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found." });
    }

    const totalSubtopicsCount = user.progressData.reduce(
      (total: number, item: { subtopics: string[] }) =>
        total + item.subtopics.length,
      0
    );
    const averageProgress = calculateAverageProgress({ user });
    let level = "Expert";
    if (averageProgress < 33.33) {
      level = "Beginner";
    } else if (averageProgress < 66.67) {
      level = "Intermediate";
    }

    return {
      success: true as const,
      data: {
        userName: user.userName,
        id: user.id,
        image: user.image,
        totalAchievements: user.userAchievements.length,
        totalSubtopicsCompleted: totalSubtopicsCount,
        level,
        totalProgress: Number(averageProgress.toFixed(2)),
        progressData: user.progressData,
      },
    };
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }
    console.error("getStatsById error: ", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Unable to fetch user stats right now. Please try again later.",
    });
  }
}
