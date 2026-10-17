import type { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { calculateAverageProgress } from "@/lib/progress";
import { logError } from "@/server/logger";
import {
  createDashboardRepository,
  type DashboardUserRow,
} from "@/server/repositories/dashboard";

/**
 * Dashboard service (Slice 5, #62; repository tier in Slice 6, #63;
 * redacted public profile read in #91).
 *
 * Derived summary view over visible progress state. Thin delegation over
 * the closed dashboard repository select so owner and by-id reads stay
 * field-identical to the prior stats shapes, plus the public profile
 * additions (#91): redacted public biography (`null` when unset),
 * `isPrivate` flag, and the unlocked achievement inventory (name,
 * description, `unlockedAt` as a `Date`, newest-first). The controller
 * tier serializes `unlockedAt` to ISO so the strict output contract holds
 * on the typed transport.
 *
 * Persistence lives in `src/server/repositories/dashboard.ts` — this
 * module owns the derivation rule (level bands, totals) plus the
 * public-axis redaction used by the by-id read, and never touches Prisma
 * directly.
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
      biography: user.biography,
      isPrivate: user.isPrivate,
      totalAchievements: user.userAchievements.length,
      totalSubtopicsCompleted: totalSubtopicsCount,
      level,
      totalProgress: Number(averageProgress.toFixed(2)),
      progressData: user.progressData,
      achievements: user.userAchievements.map((achievement) => ({
        id: achievement.id,
        name: achievement.achievementName,
        description: achievement.achievementDescription,
        unlockedAt: achievement.unlockedAt,
      })),
    },
  };
}

/**
 * Public-axis redaction (domain rule): a private account still resolves
 * with its header fields (`userName`, `id`, `image`, `isPrivate`) but
 * exposes no biography, progress, or achievements. Totals re-derive from
 * the emptied data so zeros are shown rather than leaked real totals.
 */
function derivePublicDashboard(user: DashboardUserRow) {
  if (!user.isPrivate) {
    return deriveDashboard(user);
  }
  return deriveDashboard({
    ...user,
    biography: null,
    progressData: [],
    userAchievements: [],
  });
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
    return derivePublicDashboard(user);
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
