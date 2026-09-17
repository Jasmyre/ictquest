import { api } from "@/trpc/server";

/**
 * Admin lessons (`/admin/lessons`, Migration 15, #38).
 *
 * Lesson content management operates against the MDX-backed store pattern:
 * this view lists the same `content/lessons/<lesson>/<subtopic>.mdx`
 * entries the learner routes render (via `api.admin.listLessonContent`,
 * ADMIN-only — learners get FORBIDDEN, anonymous callers get UNAUTHORIZED).
 * Curriculum entries stay dev-authored MDX in git; there is intentionally no
 * runtime lesson editing, no headless CMS, and no non-developer dashboard
 * authoring surface. Requires ADMIN via the `(admin)` layout plus the
 * `proxy.ts` guard.
 */
export default async function AdminLessonsPage() {
  const lessons = await api.admin.listLessonContent();

  return (
    <div className="space-y-4" data-testid="admin-lessons">
      <h1 className="font-bold text-2xl text-gray-900 dark:text-white">
        Lesson Content
      </h1>
      <p className="text-gray-600 text-sm dark:text-gray-300">
        Curriculum entries stay dev-authored MDX in git. This listing reads the
        MDX-backed store via api.admin.listLessonContent; runtime lesson editing
        is intentionally unavailable here.
      </p>
      <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-800">
        {lessons.success
          ? lessons.data.map((entry) => (
              <li
                className="flex items-center justify-between gap-4 px-4 py-3"
                data-testid="admin-lesson-row"
                key={`${entry.lesson}/${entry.subtopic}`}
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-gray-900 text-sm dark:text-white">
                    {entry.title}
                  </p>
                  <p className="truncate text-gray-500 text-xs dark:text-gray-400">
                    {entry.lesson} / {entry.subtopic} · order {entry.order} ·{" "}
                    {entry.file}
                  </p>
                </div>
              </li>
            ))
          : null}
      </ul>
    </div>
  );
}
