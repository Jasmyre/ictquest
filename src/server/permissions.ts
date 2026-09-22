import "server-only";
import { TRPCError } from "@trpc/server";
import type { RoleName } from "@/lib/role-names";

/**
 * ABAC permission matrix (predicate-per-role pattern).
 *
 * True source of truth for authorization: each resource maps every role to
 * a per-action rule that is either an unconditional boolean grant or an
 * ownership predicate `(user, data) => boolean`. A user's effective
 * permission is the union of their roles' grants.
 *
 * Locked semantics (mirrors currently enforced grants, zero silent widening):
 * - Lesson/Topic/Quiz view: public (no sign-in required).
 * - Progress/Achievement/Token owner actions + User view/update: any
 *   signed-in role, but only on the caller's own rows (predicate).
 * - Admin manage + Achievement/Progress catalog manage: ADMIN only.
 *
 * Controller pattern:
 * 1. `permissionProcedure("Resource", "action")` coarse-gates the procedure
 *    via `hasActionGrant` (UNAUTHORIZED when signed out, FORBIDDEN when no
 *    held role grants it; predicate rules count as grants, public grants
 *    pass for anonymous callers).
 * 2. Where a record exists, the resolver re-checks
 *    `hasPermission(user, "Resource", "action", record)` and throws
 *    FORBIDDEN on failure; a missing record also answers FORBIDDEN
 *    (anti-probing). Use `requirePermission(...)` for that step.
 */

export type PermissionUser = {
  id?: string;
  roles?: readonly string[] | null;
};

export const PERMISSION_RESOURCES = [
  "Lesson",
  "Topic",
  "Quiz",
  "Progress",
  "Achievement",
  "User",
  "Admin",
  "Token",
] as const;
export type ResourceName = (typeof PERMISSION_RESOURCES)[number];
/** Backwards-compatible alias for `ResourceName`. */
export type PermissionResource = ResourceName;

export const PERMISSION_ACTIONS = [
  "view",
  "create",
  "update",
  "delete",
  "manage",
] as const;
export type PermissionAction = (typeof PERMISSION_ACTIONS)[number];

export type RowWithOwner =
  | { userId: string }
  | { id: string }
  | { ownerId: string };

export type ResourceData<R extends ResourceName> = R extends "Admin"
  ? never
  : R extends "Lesson" | "Topic" | "Quiz"
    ? { slug?: string } | undefined
    : RowWithOwner | undefined;

export type PermissionRule<R extends ResourceName> =
  | boolean
  | ((user: PermissionUser, data: ResourceData<R>) => boolean);

export type PermissionDefinition<R extends ResourceName> = Partial<
  Record<PermissionAction, PermissionRule<R>>
>;

type OwnerRow = RowWithOwner;

const isOwner = (user: PermissionUser, data: OwnerRow): boolean => {
  if (!user.id) {
    return false;
  }
  if ("userId" in data && typeof data.userId === "string") {
    return data.userId === user.id;
  }
  if ("ownerId" in data && typeof data.ownerId === "string") {
    return data.ownerId === user.id;
  }
  if ("id" in data && typeof data.id === "string") {
    return data.id === user.id;
  }
  return false;
};

const ownerRule = (
  user: PermissionUser,
  data: ResourceData<PermissionResource>
): boolean => {
  if (!data || typeof data !== "object") {
    return false;
  }
  return isOwner(user, data as OwnerRow);
};

const LESSON_PERMISSIONS: Record<RoleName, PermissionDefinition<"Lesson">> = {
  ADMIN: { view: true },
  MODERATOR: { view: true },
  USER: { view: true },
};

const TOPIC_PERMISSIONS: Record<RoleName, PermissionDefinition<"Topic">> = {
  ADMIN: { view: true },
  MODERATOR: { view: true },
  USER: { view: true },
};

const QUIZ_PERMISSIONS: Record<RoleName, PermissionDefinition<"Quiz">> = {
  ADMIN: { view: true },
  MODERATOR: { view: true },
  USER: { view: true },
};

const PROGRESS_PERMISSIONS: Record<
  RoleName,
  PermissionDefinition<"Progress">
> = {
  ADMIN: {
    view: ownerRule,
    create: ownerRule,
    delete: ownerRule,
    manage: true,
  },
  MODERATOR: { view: ownerRule, create: ownerRule, delete: ownerRule },
  USER: { view: ownerRule, create: ownerRule, delete: ownerRule },
};

const ACHIEVEMENT_PERMISSIONS: Record<
  RoleName,
  PermissionDefinition<"Achievement">
> = {
  ADMIN: {
    view: ownerRule,
    create: ownerRule,
    delete: ownerRule,
    manage: true,
  },
  MODERATOR: { view: ownerRule, create: ownerRule, delete: ownerRule },
  USER: { view: ownerRule, create: ownerRule, delete: ownerRule },
};

const USER_PERMISSIONS: Record<RoleName, PermissionDefinition<"User">> = {
  ADMIN: { view: ownerRule, update: ownerRule },
  MODERATOR: { view: ownerRule, update: ownerRule },
  USER: { view: ownerRule, update: ownerRule },
};

const ADMIN_PERMISSIONS: Record<RoleName, PermissionDefinition<"Admin">> = {
  ADMIN: { manage: true },
  MODERATOR: {},
  USER: {},
};

const TOKEN_PERMISSIONS: Record<RoleName, PermissionDefinition<"Token">> = {
  ADMIN: { view: ownerRule, create: ownerRule, delete: ownerRule },
  MODERATOR: { view: ownerRule, create: ownerRule, delete: ownerRule },
  USER: { view: ownerRule, create: ownerRule, delete: ownerRule },
};

type PermissionMatrix = {
  [R in ResourceName]: Record<RoleName, PermissionDefinition<R>>;
};

export const PERMISSIONS: PermissionMatrix = {
  Lesson: LESSON_PERMISSIONS,
  Topic: TOPIC_PERMISSIONS,
  Quiz: QUIZ_PERMISSIONS,
  Progress: PROGRESS_PERMISSIONS,
  Achievement: ACHIEVEMENT_PERMISSIONS,
  User: USER_PERMISSIONS,
  Admin: ADMIN_PERMISSIONS,
  Token: TOKEN_PERMISSIONS,
};

/**
 * Public (role-free) grants. Lesson/Topic/Quiz reads stay open to
 * anonymous callers; everything else requires a signed-in role.
 */
const PUBLIC_GRANTS: Partial<
  Record<ResourceName, Partial<Record<PermissionAction, true>>>
> = {
  Lesson: { view: true },
  Topic: { view: true },
  Quiz: { view: true },
};

function heldRoles(user: PermissionUser | null | undefined): RoleName[] {
  if (!user?.roles) {
    return [];
  }
  const normalized = user.roles.map((r) =>
    typeof r === "string" ? r.toUpperCase() : r
  );
  return normalized.filter(
    (r): r is RoleName => r === "ADMIN" || r === "MODERATOR" || r === "USER"
  );
}

/**
 * Row-level check. Ownership predicates deny when `data` is absent (can't
 * prove ownership); public grants pass even for anonymous callers.
 */
export const hasPermission = <R extends ResourceName>(
  user: PermissionUser | null | undefined,
  resource: R,
  action: PermissionAction,
  data?: ResourceData<R>
): boolean => {
  if (PUBLIC_GRANTS[resource]?.[action] === true) {
    return true;
  }
  if (!user) {
    return false;
  }
  const held = heldRoles(user);
  const permissionUser: PermissionUser = { id: user.id, roles: held };
  for (const role of held) {
    const rule = PERMISSIONS[resource][role]?.[action];

    if (rule === undefined) {
      continue;
    }

    if (typeof rule === "boolean") {
      if (rule) {
        return true;
      }

      continue;
    }

    if (data !== undefined && rule(permissionUser, data)) {
      return true;
    }
  }

  return false;
};

/**
 * Coarse precheck: does any held role grant this action at all? Predicate rules
 * count as grants here because row-level authorization happens separately once
 * the record is available. Public grants pass for anonymous callers.
 */
export const hasActionGrant = (
  user: PermissionUser | null | undefined,
  resource: ResourceName,
  action: PermissionAction
): boolean => {
  if (PUBLIC_GRANTS[resource]?.[action] === true) {
    return true;
  }
  if (!user) {
    return false;
  }
  for (const role of heldRoles(user)) {
    const rule = PERMISSIONS[resource][role]?.[action];

    if (rule === undefined) {
      continue;
    }

    if (typeof rule === "boolean") {
      if (rule) {
        return true;
      }

      continue;
    }

    return true;
  }

  return false;
};

/**
 * Row re-check for resolvers. Throws FORBIDDEN when the record is missing
 * (anti-probing) or the row check fails; returns void on pass.
 */
export function requirePermission<R extends ResourceName>(
  user: PermissionUser,
  resource: R,
  action: PermissionAction,
  args: {
    data: ResourceData<R> | null | undefined;
    message?: string;
  }
): void {
  const {
    data,
    message = "You do not have permission to perform this action.",
  } = args;
  if (!(data && hasPermission(user, resource, action, data))) {
    throw new TRPCError({ code: "FORBIDDEN", message });
  }
}
