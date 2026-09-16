/**
 * Admin users (`/admin/users`, #34 shell; management ops land in #37).
 * Requires ADMIN via the `(admin)` layout plus the `proxy.ts` guard.
 */
export default function AdminUsersPage() {
  return (
    <div className="space-y-4">
      <h1 className="font-bold text-2xl text-gray-900 dark:text-white">
        User Management
      </h1>
      <p className="text-gray-600 text-sm dark:text-gray-300">
        Grant or revoke ADMIN, MODERATOR, and USER assignments. Full role
        management lands in a later migration.
      </p>
    </div>
  );
}
