import { Suspense } from "react";
import { AdminAchievementsManager } from "@/components/admin-achievements-manager";
import { api } from "@/trpc/server";

/**
 * Admin achievements (`/admin/achievements`, Migration 15, #38).
 *
 * Full definition CRUD under admin gating: listed via
 * `api.admin.listAchievementDefinitions`, created/updated/deleted through
 * `api.admin.createAchievementDefinition` /
 * `api.admin.updateAchievementDefinition` /
 * `api.admin.deleteAchievementDefinition` (ADMIN-only — learners get
 * FORBIDDEN, anonymous callers get UNAUTHORIZED). Requires ADMIN via the
 * `(admin)` layout plus the `proxy.ts` guard.
 *
 * Render seam: `data-testid="admin-achievements"` on this shell and
 * `data-testid="admin-achievement-row"` rows inside AdminAchievementsManager.
 *
 * Cache Components: static shell prerenders; the per-request list streams
 * in via Suspense so navigation stays instant.
 */
export default function AdminAchievementsPage() {
  return (
    <div data-testid="admin-achievements">
      <Suspense
        fallback={<p className="p-4">Loading achievement definitions…</p>}
      >
        <AchievementDefinitionList />
      </Suspense>
    </div>
  );
}

async function AchievementDefinitionList() {
  const definitions = await api.admin.listAchievementDefinitions({});
  if (!definitions.success) {
    return <p className="p-4">Unable to load achievements.</p>;
  }
  return <AdminAchievementsManager initial={definitions.data} />;
}
