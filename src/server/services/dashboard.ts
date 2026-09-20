import type { PrismaClient } from "@prisma/client";
import { getStatsById } from "@/server/services/progress";

/**
 * Dashboard service (Slice 5, #62).
 *
 * Derived summary view over visible progress state. Thin delegation over the
 * canonical `getStatsById` progress helper so owner and by-id reads stay
 * field-identical to the prior stats shapes. The underlying select stays
 * closed (`id`, `userName`, `image`, achievements, progress) — biography and
 * privacy never enter the dashboard output, so shared links stay safe.
 */

type Db = Pick<PrismaClient, "progressData" | "user">;

export function getMyDashboard(db: Db, userId: string) {
  return getStatsById(db, userId);
}

export function getDashboardById(db: Db, id: string) {
  return getStatsById(db, id);
}
