/**
 * Admin lessons (`/admin/lessons`, #34 shell; content ops land in #38).
 * Requires ADMIN via the `(admin)` layout plus the `proxy.ts` guard.
 */
export default function AdminLessonsPage() {
  return (
    <div className="space-y-4">
      <h1 className="font-bold text-2xl text-gray-900 dark:text-white">
        Lesson Content
      </h1>
      <p className="text-gray-600 text-sm dark:text-gray-300">
        Curriculum entries stay dev-authored MDX in git. Listing and editing
        surfaces land in a later migration.
      </p>
    </div>
  );
}
