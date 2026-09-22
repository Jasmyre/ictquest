"use client";

import { useState } from "react";
import { DEFAULT_ROLE_NAME, type RoleName } from "@/lib/roles";
import { api } from "@/trpc/react";

const TOGGLABLE_ROLES: readonly RoleName[] = ["ADMIN", "MODERATOR", "USER"];

function holds(roles: readonly string[], role: RoleName): boolean {
  return roles.some(
    (r) => typeof r === "string" && r.toUpperCase() === role.toUpperCase()
  );
}

export function isRoleToggleDisabled(
  roles: readonly string[],
  role: RoleName
): boolean {
  // The default-role floor (#71): USER is irrevocable, so its toggle never
  // submits. Any other held role is locked while it is the user's only
  // membership, so the UI cannot submit removal of the last membership.
  if (role.toUpperCase() === DEFAULT_ROLE_NAME) {
    return true;
  }
  return holds(roles, role) && roles.length <= 1;
}

export function AdminRoleToggles({
  userId,
  initialRoles,
}: {
  userId: string;
  initialRoles: string[];
}) {
  const [roles, setRoles] = useState<string[]>(initialRoles);
  const [pendingRole, setPendingRole] = useState<RoleName | null>(null);
  const utils = api.useUtils();
  const grantRole = api.admin.grantRole.useMutation();
  const revokeRole = api.admin.revokeRole.useMutation();

  const toggle = (role: RoleName) => async () => {
    if (isRoleToggleDisabled(roles, role) || pendingRole !== null) {
      return;
    }
    const held = holds(roles, role);
    const previous = roles;
    setPendingRole(role);
    setRoles(
      held ? roles.filter((r) => r.toUpperCase() !== role) : [...roles, role]
    );
    try {
      if (held) {
        await revokeRole.mutateAsync({ userId, role });
      } else {
        await grantRole.mutateAsync({ userId, role });
      }
      await utils.admin.listUsers.invalidate();
    } catch {
      setRoles(previous);
    } finally {
      setPendingRole(null);
    }
  };

  return (
    <div className="flex shrink-0 items-center gap-3">
      {TOGGLABLE_ROLES.map((role) => {
        const checked = holds(roles, role);
        const disabled =
          isRoleToggleDisabled(roles, role) || pendingRole !== null;
        let label: string = role;
        const isLastMembership: boolean = checked ? roles.length <= 1 : false;
        if (role.toUpperCase() === DEFAULT_ROLE_NAME) {
          label = `${role} (always held)`;
        } else if (isLastMembership) {
          label = `${role} (last membership)`;
        }
        return (
          <label
            className="flex cursor-pointer items-center gap-1 text-gray-600 text-xs dark:text-gray-300"
            key={role}
            title={label}
          >
            <input
              aria-label={`${role} role for user ${userId}`}
              checked={checked}
              disabled={disabled}
              onChange={toggle(role)}
              type="checkbox"
            />
            {role}
          </label>
        );
      })}
    </div>
  );
}
