/**
 * Admin progress (`/admin/progress`, #34 shell; support ops land in #37).
 * Requires ADMIN via the `(admin)` layout plus the `proxy.ts` guard.
 */
export default function AdminProgressPage() {
  return (
    <div className="space-y-4">
      <h1 className="font-bold text-2xl text-gray-900 dark:text-white">
        Progress Operations
      </h1>
      <p className="text-gray-600 text-sm dark:text-gray-300">
        Grant or revoke achievements and reset progress for support cases. Full
        operations land in a later migration.
      </p>
    </div>
  );
}
