import "server-only";
import type { PrismaClient } from "@prisma/client";

export type DashboardDb = Pick<PrismaClient, "progressData" | "user">;

export type DashboardAchievementRow = {
  id: number;
  achievementName: string;
  achievementDescription: string;
  unlockedAt: Date;
};

export type DashboardUserRow = {
  id: string;
  userName: string | null;
  image: string | null;
  biography: string | null;
  isPrivate: boolean;
  userAchievements: DashboardAchievementRow[];
  progressData: Array<{ topic: string; subtopics: string[] }>;
};

/**
 * Dashboard repository (Slice 6, #63; public profile read in #91).
 *
 * Owns the derived-view reads over visible progress state. The dashboard
 * is not a table — it is a summary over the progress store — so this
 * repository exposes exactly one closed select (`id`, `userName`,
 * `image`, `biography`, `isPrivate`, achievements, progress). The public
 * inventory rides the same closed select, newest-first, with no join
 * needed because `UserAchievement` denormalizes name/description.
 */

export type DashboardRepository = {
  findDashboardUser(id: string): Promise<DashboardUserRow | null>;
};

export function createDashboardRepository(
  db: DashboardDb
): DashboardRepository {
  return {
    findDashboardUser(id: string): Promise<DashboardUserRow | null> {
      return db.user.findUnique({
        where: { id },
        select: {
          id: true,
          userName: true,
          image: true,
          biography: true,
          isPrivate: true,
          userAchievements: {
            select: {
              id: true,
              achievementName: true,
              achievementDescription: true,
              unlockedAt: true,
            },
            orderBy: { unlockedAt: "desc" },
          },
          progressData: { select: { subtopics: true, topic: true } },
        },
      });
    },
  };
}
