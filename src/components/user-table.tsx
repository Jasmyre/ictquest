"use client";

import { Settings2 } from "lucide-react";
import { useState } from "react";
import { ManageRolesDialog } from "@/components/manage-roles-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { RoleName } from "@/lib/role-names";
import { api } from "@/trpc/react";
import type { AdminUser } from "@/types/admin";

const roleBadgeVariant: Record<RoleName, "default" | "secondary" | "outline"> =
  {
    ADMIN: "default",
    MODERATOR: "secondary",
    USER: "outline",
  };

export type UserTableInitialUser = {
  id: string;
  name: string | null;
  email: string | null;
  userName: string | null;
  suspendedAt: Date | null;
  roles: string[];
};

export function UserTable({ initial }: { initial: UserTableInitialUser[] }) {
  // Server seeds `initial` (no client suspense fetch during prerender —
  // useSuspenseQuery here would fetch /api/trpc over HTTP while
  // prerendering and parse the guard's HTML redirect as JSON).
  // This query only refreshes on the client after mutations.
  const { data } = api.admin.listUsers.useQuery(
    {},
    {
      initialData: { success: true as const, data: initial },
      refetchOnMount: false,
    }
  );
  const users = (data?.success === true
    ? data.data
    : initial) as unknown as AdminUser[];
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  const utils = api.useUtils();
  const updateRoles = api.admin.updateRoles.useMutation({
    onSuccess: async () => {
      await utils.admin.listUsers.invalidate();
    },
  });

  const handleSave = async (userId: string, roleNames: RoleName[]) => {
    await updateRoles.mutateAsync({ userId, roleNames });
  };

  return (
    <Card data-testid="admin-content">
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>
          Manage user accounts and roles. USER is always held; toggle ADMIN or
          MODERATOR through the button-style role dialog.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-muted border-b bg-muted/50 text-left text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium" scope="col">
                  Name
                </th>
                <th className="px-4 py-3 font-medium" scope="col">
                  Email
                </th>
                <th className="px-4 py-3 font-medium" scope="col">
                  Roles
                </th>
                <th className="px-4 py-3 font-medium" scope="col">
                  Status
                </th>
                <th className="px-4 py-3 text-right font-medium" scope="col">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted">
              {users.map((user) => (
                <tr
                  className="hover:bg-muted/40"
                  data-testid="admin-user-row"
                  key={user.id}
                >
                  <td className="px-4 py-3 font-medium">
                    {user.userName ?? user.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {user.email ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {(user.roles as RoleName[]).map((role) => (
                        <Badge
                          key={role}
                          variant={roleBadgeVariant[role] ?? "outline"}
                        >
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {user.suspendedAt ? "Suspended" : "Active"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      aria-label={`Manage roles for ${user.userName ?? user.name ?? user.email}`}
                      className="cursor-pointer"
                      onClick={() => setEditingUser(user)}
                      size="icon-sm"
                      variant="ghost"
                    >
                      <Settings2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>

      {editingUser !== null ? (
        <ManageRolesDialog
          key={editingUser.id}
          onOpenChangeAction={(open) => {
            if (!open) {
              setEditingUser(null);
            }
          }}
          onSaveAction={handleSave}
          open={Boolean(editingUser)}
          user={editingUser}
        />
      ) : null}
    </Card>
  );
}
