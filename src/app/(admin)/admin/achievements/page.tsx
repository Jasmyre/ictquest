import { api } from "@/trpc/server";

/**
 * Admin achievements (`/admin/achievements`, Migration 15, #38).
 *
 * Achievement definition management end to end under admin gating:
 * definitions are listed here via `api.admin.listAchievementDefinitions`
 * while create/update/delete flow through
 * `api.admin.createAchievementDefinition` /
 * `api.admin.updateAchievementDefinition` /
 * `api.admin.deleteAchievementDefinition` (ADMIN-only procedures — learners
 * get FORBIDDEN, anonymous callers get UNAUTHORIZED). Requires ADMIN via the
 * `(admin)` layout plus the `proxy.ts` guard.
 */
export default async function AdminAchievementsPage() {
  const definitions = await api.admin.listAchievementDefinitions({});

  return (
    <div className="space-y-4" data-testid="admin-achievements">
      <h1 className="font-bold text-2xl text-gray-900 dark:text-white">
        Achievement Definitions
      </h1>
      <p className="text-gray-600 text-sm dark:text-gray-300">
        Introduce new learner goals here. Definitions are managed through
        api.admin.createAchievementDefinition,
        api.admin.updateAchievementDefinition,
        api.admin.deleteAchievementDefinition, and listed via
        api.admin.listAchievementDefinitions.
      </p>
      <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-800">
        {definitions.success
          ? definitions.data.map((definition) => (
              <li
                className="flex items-center justify-between gap-4 px-4 py-3"
                data-testid="admin-achievement-row"
                key={definition.id}
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-gray-900 text-sm dark:text-white">
                    {definition.name}
                  </p>
                  <p className="truncate text-gray-500 text-xs dark:text-gray-400">
                    {definition.description ?? "No description"}
                  </p>
                </div>
              </li>
            ))
          : null}
      </ul>
    </div>
  );
}
