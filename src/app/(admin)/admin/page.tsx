/**
 * Admin home (`/admin`, ADR 0003, #34).
 *
 * Greenfield shell placeholder: full user/lesson/achievement/progress
 * management lands in #37–#38. Requires ADMIN via the `(admin)` layout plus
 * the `proxy.ts` session-plus-role guard.
 */
export default function AdminHomePage() {
  return (
    <div className="space-y-4">
      <h1 className="font-bold text-2xl text-gray-900 dark:text-white">
        Admin Dashboard
      </h1>
      <p className="text-gray-600 text-sm dark:text-gray-300">
        Focused admin area. Use the sidebar to manage users, lesson content,
        achievement definitions, and progress operations.
      </p>
    </div>
  );
}
