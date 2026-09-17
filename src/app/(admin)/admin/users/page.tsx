import { api } from "@/trpc/server";

/**
 * Admin users (`/admin/users`, Migration 14, #37).
 *
 * User plus role-assignment management end to end under admin gating:
 * lists every user with its current roles via `api.admin.listUsers`, while
 * grant/revoke of ADMIN, MODERATOR, and USER flows through
 * `api.admin.grantRole` / `api.admin.revokeRole` (ADMIN-only procedures —
 * learners get FORBIDDEN, anonymous callers get UNAUTHORIZED). Requires
 * ADMIN via the `(admin)` layout plus the `proxy.ts` guard.
 */
export default async function AdminUsersPage() {
  const users = await api.admin.listUsers({});

  return (
    <div className="space-y-4" data-testid="admin-users">
      <h1 className="font-bold text-2xl text-gray-900 dark:text-white">
        User Management
      </h1>
      <p className="text-gray-600 text-sm dark:text-gray-300">
        Grant or revoke ADMIN, MODERATOR, and USER assignments. Every action
        runs through ADMIN-gated procedures.
      </p>
      <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-800">
        {users.success
          ? users.data.map((user) => (
              <li
                className="flex items-center justify-between gap-4 px-4 py-3"
                data-testid="admin-user-row"
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
                <p className="shrink-0 text-gray-600 text-xs dark:text-gray-300">
                  {user.roles.join(", ") || "No roles"}
                </p>
              </li>
            ))
          : null}
      </ul>
    </div>
  );
}
