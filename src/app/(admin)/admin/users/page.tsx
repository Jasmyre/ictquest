import { Suspense } from "react";
import { UserTable } from "@/components/user-table";
import { api } from "@/trpc/server";

/**
 * Admin users (`/admin/users`, Migration 14, #37; floor hardening #71).
 *
 * User plus role-assignment management end to end under admin gating.
 * Data flows through `api.admin.listUsers` (ADMIN-only — learners get
 * FORBIDDEN, anonymous callers get UNAUTHORIZED), server-fetched here so
 * the client table never suspense-fetches `/api/trpc` over HTTP during
 * prerender (that fetch resolves to the guard's HTML redirect, which
 * SuperJSON cannot parse — the "<!DOCTYPE is not valid JSON" crash).
 * Role edits save through `api.admin.updateRoles` in the button-style
 * `ManageRolesDialog` (USER floor irrevocable, last membership locked,
 * self-demotion refused). Requires ADMIN via the `(admin)` layout plus
 * the `proxy.ts` guard.
 *
 * Render seam: `data-testid="admin-users"` on this shell,
 * `data-testid="admin-content"` on the card, and
 * `data-testid="admin-user-row"` per table row.
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
      <Suspense fallback={<p>Loading users…</p>}>
        <AdminUsersLoader />
      </Suspense>
    </div>
  );
}

async function AdminUsersLoader() {
  const users = await api.admin.listUsers({});
  return <UserTable initial={users.success ? users.data : []} />;
}
