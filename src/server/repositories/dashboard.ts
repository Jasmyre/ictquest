import "server-only";
import type { PrismaClient } from "@prisma/client";

export type DashboardDb = Pick<PrismaClient, "progressData" | "user">;

export type DashboardUserRow = {
  id: string;
  userName: string | null;
  image: string | null;
  userAchievements: Array<{ id: number }>;
  progressData: Array<{ topic: string; subtopics: string[] }>;
};

/**
 * Dashboard repository (Slice 6, #63).
 *
 * Owns the derived-view reads over visible progress state. The dashboard
 * is not a table — it is a summary over the progress store — so this
 * repository exposes exactly one closed select (`id`, `userName`,
 * `image`, achievements, progress). Biography and privacy never enter
 * the dashboard output, so shared links stay safe.
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
          userAchievements: { select: { id: true } },
          progressData: { select: { subtopics: true, topic: true } },
        },
      });
    },
  };
}
