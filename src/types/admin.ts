import type { RoleName } from "@/lib/role-names";

/**
 * Admin user row shared by the user table plus role dialog.
 *
 * Mirrors `listUsersWithRoles` output (id, name, email, userName,
 * suspension stamp, role names). `createdAt` stays absent by design —
 * the User model has no such column, so the table shows Status instead
 * of a Joined date.
 */
export type AdminUser = {
  id: string;
  name: string | null;
  email: string | null;
  userName: string | null;
  suspendedAt: Date | string | null;
  roles: RoleName[];
};
