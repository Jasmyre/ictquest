import type { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { calculateAverageProgress } from "@/lib/progress";
import { logError } from "@/server/logger";
import {
  createDashboardRepository,
  type DashboardUserRow,
} from "@/server/repositories/dashboard";

/**
 * Dashboard service (Slice 5, #62; repository tier in Slice 6, #63).
 *
 * Derived summary view over visible progress state. Thin delegation over
 * the closed dashboard repository select so owner and by-id reads stay
 * field-identical to the prior stats shapes. The underlying select stays
 * closed (`id`, `userName`, `image`, achievements, progress) — biography and
 * privacy never enter the dashboard output, so shared links stay safe.
 *
 * Persistence lives in `src/server/repositories/dashboard.ts` — this
 * module owns the derivation rule (level bands, totals) and never
 * touches Prisma directly.
 */

type Db = Pick<PrismaClient, "progressData" | "user">;

const BEGINNER_MAX_AVERAGE = 33.33;
const INTERMEDIATE_MAX_AVERAGE = 66.67;

/**
 * Single derivation source for the dashboard/stats shape. The progress
 * `getStatsById` reference shape delegates here so the rename stays a
 * vocabulary move with zero drift between the two surfaces.
 */
export function deriveDashboard(user: DashboardUserRow) {
  const totalSubtopicsCount = user.progressData.reduce(
    (total: number, item: { subtopics: string[] }) =>
      total + item.subtopics.length,
    0
  );
  const averageProgress = calculateAverageProgress({ user });
  let level = "Expert";
  if (averageProgress < BEGINNER_MAX_AVERAGE) {
    level = "Beginner";
  } else if (averageProgress < INTERMEDIATE_MAX_AVERAGE) {
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
}

export async function getMyDashboard(db: Db, userId: string) {
  const repository = createDashboardRepository(db);
  try {
    const user = await repository.findDashboardUser(userId);
    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found." });
    }
    return deriveDashboard(user);
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }
    logError("getMyDashboard error:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Unable to fetch your dashboard right now. Try again later.",
    });
  }
}

export async function getDashboardById(db: Db, id: string) {
  const repository = createDashboardRepository(db);
  try {
    const user = await repository.findDashboardUser(id);
    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found." });
    }
    return deriveDashboard(user);
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }
    logError("getDashboardById error:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Unable to fetch the dashboard right now. Try again later.",
    });
  }
}
