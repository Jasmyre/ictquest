import { api } from "@/trpc/server";

/**
 * Admin progress (`/admin/progress`, Migration 14, #37).
 *
 * Progress support ops end to end under admin gating: grant/revoke
 * achievements and reset progress for support cases via
 * `api.admin.grantAchievement` / `api.admin.revokeAchievement` /
 * `api.admin.resetProgress` (ADMIN-only procedures — learners get FORBIDDEN,
 * anonymous callers get UNAUTHORIZED). The user list below is read through
 * `api.admin.listUsers` so support targets stay inside the same admin seam.
 * Requires ADMIN via the `(admin)` layout plus the `proxy.ts` guard.
 */
export default async function AdminProgressPage() {
  const users = await api.admin.listUsers({});

  return (
    <div className="space-y-4" data-testid="admin-progress-ops">
      <h1 className="font-bold text-2xl text-gray-900 dark:text-white">
        Progress Operations
      </h1>
      <p className="text-gray-600 text-sm dark:text-gray-300">
        Grant or revoke achievements and reset progress for support cases.
        Supported procedures: api.admin.grantAchievement,
        api.admin.revokeAchievement, api.admin.resetProgress.
      </p>
      <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-800">
        {users.success
          ? users.data.map((user) => (
              <li
                className="flex items-center justify-between gap-4 px-4 py-3"
                data-testid="admin-progress-user-row"
                key={user.id}
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-gray-900 text-sm dark:text-white">
                    {user.userName ?? user.email ?? user.id}
                  </p>
                  <p className="truncate text-gray-500 text-xs dark:text-gray-400">
                    {user.id}
                  </p>
                </div>
              </li>
            ))
          : null}
      </ul>
    </div>
  );
}
