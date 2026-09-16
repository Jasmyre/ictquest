/**
 * Admin achievements (`/admin/achievements`, #34 shell; definition ops land
 * in #38). Requires ADMIN via the `(admin)` layout plus the `proxy.ts` guard.
 */
export default function AdminAchievementsPage() {
  return (
    <div className="space-y-4">
      <h1 className="font-bold text-2xl text-gray-900 dark:text-white">
        Achievement Definitions
      </h1>
      <p className="text-gray-600 text-sm dark:text-gray-300">
        Introduce new learner goals here. Full definition management lands in a
        later migration.
      </p>
    </div>
  );
}
