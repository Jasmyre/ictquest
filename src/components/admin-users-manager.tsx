"use client";

import { useMemo, useState } from "react";
import { AdminPageHeader } from "@/components/admin-page-header";
import { AdminSuspendToggle } from "@/components/admin-suspend-toggle";
import { AdminUserRoleDialog } from "@/components/admin-user-role-dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type AdminUserRow = {
  id: string;
  email: string | null;
  userName: string | null;
  suspendedAt: Date | string | null;
  roles: string[];
};

export function AdminUsersManager({ users }: { users: AdminUserRow[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return users;
    }
    return users.filter((u) =>
      [u.userName ?? "", u.email ?? "", u.id, u.roles.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [query, users]);

  return (
    <div className="w-full min-w-0 flex-1 space-y-4 p-4 lg:px-8">
      <AdminPageHeader
        description="Grant or revoke ADMIN and MODERATOR assignments. Every user always holds USER — it cannot be revoked. Suspension stamps suspendedAt without touching roles."
        title="User Management"
      />
      <div className="max-w-md">
        <Label htmlFor="admin-user-search">Search users</Label>
        <Input
          id="admin-user-search"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, email, id, or role…"
          type="search"
          value={query}
        />
      </div>
      <p
        aria-live="polite"
        className="text-gray-600 text-xs dark:text-gray-400"
      >
        Showing {filtered.length} of {users.length} users
      </p>
      {filtered.length === 0 ? (
        <output className="block rounded-lg border border-gray-300 border-dashed bg-white px-6 py-10 text-center dark:border-gray-700 dark:bg-gray-800">
          <p className="font-medium text-gray-900 text-sm dark:text-white">
            No users match “{query}”
          </p>
          <p className="text-gray-600 text-sm dark:text-gray-300">
            Clear the search to see everyone.
          </p>
        </output>
      ) : (
        <ul
          aria-label="Admin users"
          className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-800"
        >
          {filtered.map((user) => {
            const display = user.userName ?? user.email ?? user.id;
            const suspended = user.suspendedAt !== null;
            return (
              <li
                className="flex flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3"
                data-testid="admin-user-row"
                key={user.id}
              >
                <div className="min-w-0 flex-1 basis-48">
                  <p className="truncate font-medium text-gray-900 text-sm dark:text-white">
                    {display}
                  </p>
                  <p className="truncate text-gray-500 text-xs dark:text-gray-400">
                    {user.email ?? user.id}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {user.roles.map((role) => (
                      <Badge
                        key={role}
                        variant={role === "ADMIN" ? "default" : "secondary"}
                      >
                        {role}
                      </Badge>
                    ))}
                    {suspended ? (
                      <Badge variant="destructive">suspended</Badge>
                    ) : null}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <AdminUserRoleDialog
                    displayName={display}
                    initialRoles={user.roles}
                    userId={user.id}
                  />
                  <AdminSuspendToggle
                    initialSuspendedAt={
                      user.suspendedAt === null
                        ? null
                        : new Date(user.suspendedAt).toISOString()
                    }
                    userId={user.id}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
