import { Suspense } from "react";
import { AdminLessonsManager } from "@/components/admin-lessons-manager";
import { api } from "@/trpc/server";

/**
 * Admin lessons (`/admin/lessons`, Migration 15, #38).
 *
 * Read-only MDX-backed store listing via `api.admin.listLessonContent`
 * (ADMIN-only). Curriculum stays dev-authored MDX in git; there is
 * intentionally no runtime lesson editing, no headless CMS, and no
 * non-developer dashboard authoring surface. Requires ADMIN via the
 * `(admin)` layout plus the `proxy.ts` guard.
 *
 * Render seam: `data-testid="admin-lessons"` on this shell and
 * `data-testid="admin-lesson-row"` rows inside AdminLessonsManager.
 *
 * Cache Components: static shell prerenders; the per-request listing
 * streams in via Suspense.
 */
export default function AdminLessonsPage() {
  return (
    <div data-testid="admin-lessons">
      <Suspense fallback={<p className="p-4">Loading lesson content…</p>}>
        <AdminLessonContentList />
      </Suspense>
    </div>
  );
}

async function AdminLessonContentList() {
  const lessons = await api.admin.listLessonContent();
  if (!lessons.success) {
    return <p className="p-4">Unable to load lesson content.</p>;
  }
  return <AdminLessonsManager entries={lessons.data} />;
}
