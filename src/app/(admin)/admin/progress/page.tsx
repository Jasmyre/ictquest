import { Suspense } from "react";
import { AdminProgressManager } from "@/components/admin-progress-manager";
import { api } from "@/trpc/server";

/**
 * Admin progress (`/admin/progress`, Migration 14, #37).
 *
 * Progress support ops end to end under admin gating: grant/revoke
 * achievements and reset progress for support cases via
 * `api.admin.grantAchievement` / `api.admin.revokeAchievement` /
 * `api.admin.resetProgress` (ADMIN-only — learners get FORBIDDEN,
 * anonymous callers get UNAUTHORIZED). Targets come from
 * `api.admin.listUsers`. Requires ADMIN via the `(admin)` layout plus the
 * `proxy.ts` guard.
 *
 * Cache Components: static shell prerenders; the per-request user list
 * streams in via Suspense.
 */
export default function AdminProgressPage() {
  return (
    <div data-testid="admin-progress-ops">
      <Suspense fallback={<p className="p-4">Loading users…</p>}>
        <AdminProgressUserList />
      </Suspense>
    </div>
  );
}

async function AdminProgressUserList() {
  const users = await api.admin.listUsers({});
  if (!users.success) {
    return <p className="p-4">Unable to load users.</p>;
  }
  return <AdminProgressManager users={users.data} />;
}
