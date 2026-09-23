import { redirect } from "next/navigation";
import { connection } from "next/server";
import type { ReactNode } from "react";
import { auth } from "@/auth";
import { getUserRoleNames, hasRole, isUserSuspended } from "@/lib/roles";

/**
 * Admin guard for the `(admin)` group.
 *
 * Session-freshness rule (CONTEXT.md): privileged paths re-read memberships
 * plus the suspension flag per request with session fallback — the stamped
 * `roles[]` copy goes stale after a grant/revoke/suspend.
 */
export async function AdminGuard({
  children,
}: Readonly<{ children: ReactNode }>) {
  await connection();

  const session = await auth();

  if (!session?.user) {
    redirect("/auth");
  }

  if (session.user.id) {
    try {
      if (await isUserSuspended(session.user.id)) {
        redirect("/");
      }
    } catch {
      if (session.user.suspended === true) {
        redirect("/");
      }
    }
  } else if (session.user.suspended === true) {
    redirect("/");
  }

  let roles = session.user.roles;
  if (session.user.id) {
    try {
      roles = await getUserRoleNames(session.user.id);
    } catch {
      roles = session.user.roles;
    }
  }

  if (!hasRole(roles, "ADMIN")) {
    redirect("/");
  }

  return children;
}
