import { Suspense } from "react";
import { AdminRoleToggles } from "@/components/admin-role-toggles";
import { AdminSuspendToggle } from "@/components/admin-suspend-toggle";
import { api } from "@/trpc/server";

/**
 * Admin users (`/admin/users`, Migration 14, #37; floor hardening #71).
 *
 * User plus role-assignment management end to end under admin gating:
 * lists every user with its current roles via `api.admin.listUsers`, while
 * grant/revoke of ADMIN and MODERATOR flows through
 * `api.admin.grantRole` / `api.admin.revokeRole` (ADMIN-only procedures —
 * learners get FORBIDDEN, anonymous callers get UNAUTHORIZED). The USER
 * membership is an irrevocable floor: its toggle is always disabled, and a
 * toggle that would remove the user's last membership is disabled too, so
 * the Role-less state cannot be recreated from this UI (the service rejects
 * both cases with BAD_REQUEST as defense in depth). Suspension (#72) sits
 * beside the toggles: suspending stamps `suspendedAt` without touching
 * roles, so unsuspend restores exactly what the user had. Requires
 * ADMIN via the `(admin)` layout plus the `proxy.ts` guard.
 *
 * Cache Components: static shell prerenders; the per-request user list
 * streams in via Suspense.
 */
export default function AdminUsersPage() {
  return (
    <div
      className="w-full min-w-0 flex-1 p-4 lg:px-8"
      data-testid="admin-users"
    >
      <h1 className="font-bold text-2xl text-gray-900 dark:text-white">
        User Management
      </h1>
      <p className="text-gray-600 text-sm dark:text-gray-300">
        Grant or revoke ADMIN and MODERATOR assignments. Every user always holds
        USER — it cannot be revoked.
      </p>
      <Suspense fallback={<p>Loading users…</p>}>
        <AdminUserList />
      </Suspense>
    </div>
  );
}

async function AdminUserList() {
  const users = await api.admin.listUsers({});

  return (
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
                {user.suspendedAt !== null ? " (suspended)" : ""}
              </p>
              <AdminRoleToggles initialRoles={user.roles} userId={user.id} />
              <AdminSuspendToggle
                initialSuspendedAt={
                  user.suspendedAt === null
                    ? null
                    : new Date(user.suspendedAt).toISOString()
                }
                userId={user.id}
              />
            </li>
          ))
        : null}
    </ul>
  );
}
