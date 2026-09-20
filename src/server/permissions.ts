import "server-only";
import { TRPCError } from "@trpc/server";
import type { RoleName } from "@/lib/roles";

/**
 * Behavior-identical permissions seam (Slice 4, #61).
 *
 * Codifies the current role-check + procedure-guard grants with zero silent
 * widening: public lesson reads, owner-only progress/grant/profile writes,
 * admin-only catalog/manage, owner-scoped tokens.
 *
 * Controller pattern:
 * 1. `permissionProcedure("Resource", "action")` coarse-gates the procedure
 *    (UNAUTHORIZED when signed out, FORBIDDEN when no held role grants it).
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
export type PermissionResource = (typeof PERMISSION_RESOURCES)[number];

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

export type ResourceData<R extends PermissionResource> = R extends "Admin"
  ? never
  : R extends "Lesson" | "Topic" | "Quiz"
    ? { slug?: string } | undefined
    : RowWithOwner | undefined;

type GrantRule =
  | { kind: "grant"; roles: readonly RoleName[] }
  | { kind: "public" }
  | { kind: "owner"; roles: readonly RoleName[] };

function ownerMatch(user: PermissionUser, data: RowWithOwner): boolean {
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
}

const ALL_AUTHENTICATED: readonly RoleName[] = ["ADMIN", "MODERATOR", "USER"];
const ADMIN_ONLY: readonly RoleName[] = ["ADMIN"];

/**
 * Locked matrix. Every entry mirrors a currently enforced grant:
 * - Lesson/Topic/Quiz view: public (no sign-in required).
 * - Progress/Achievement/User/Token owner actions: any signed-in role, but
 *   only on the caller's own rows (predicate).
 * - Admin manage + Achievement catalog manage: ADMIN only.
 * - Progress manage (admin reset/grant support ops): ADMIN only.
 */
const MATRIX: Record<
  PermissionResource,
  Partial<Record<PermissionAction, GrantRule>>
> = {
  Lesson: { view: { kind: "public" } },
  Topic: { view: { kind: "public" } },
  Quiz: { view: { kind: "public" } },
  Progress: {
    view: { kind: "owner", roles: ALL_AUTHENTICATED },
    create: { kind: "owner", roles: ALL_AUTHENTICATED },
    delete: { kind: "owner", roles: ALL_AUTHENTICATED },
    manage: { kind: "grant", roles: ADMIN_ONLY },
  },
  Achievement: {
    view: { kind: "owner", roles: ALL_AUTHENTICATED },
    create: { kind: "owner", roles: ALL_AUTHENTICATED },
    delete: { kind: "owner", roles: ALL_AUTHENTICATED },
    manage: { kind: "grant", roles: ADMIN_ONLY },
  },
  User: {
    view: { kind: "owner", roles: ALL_AUTHENTICATED },
    update: { kind: "owner", roles: ALL_AUTHENTICATED },
  },
  Admin: { manage: { kind: "grant", roles: ADMIN_ONLY } },
  Token: {
    view: { kind: "owner", roles: ALL_AUTHENTICATED },
    create: { kind: "owner", roles: ALL_AUTHENTICATED },
    delete: { kind: "owner", roles: ALL_AUTHENTICATED },
  },
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
export function hasPermission<R extends PermissionResource>(
  user: PermissionUser | null | undefined,
  resource: R,
  action: PermissionAction,
  data?: ResourceData<R>
): boolean {
  const rule = MATRIX[resource]?.[action];
  if (!rule) {
    return false;
  }
  if (rule.kind === "public") {
    return true;
  }
  if (!user) {
    return false;
  }
  const held = heldRoles(user);
  const grantsAction = held.some((r) =>
    (rule.roles as readonly RoleName[]).includes(r)
  );
  if (!grantsAction) {
    return false;
  }
  if (rule.kind === "grant") {
    return true;
  }
  // Owner predicate: deny without a record to test.
  if (!data || typeof data !== "object") {
    return false;
  }
  return ownerMatch(user, data as RowWithOwner);
}

/**
 * Coarse precheck for the controller guard. Predicate (owner) rules count
 * as grants because the row check happens later in the resolver; the guard
 * only rejects callers whose roles could never satisfy the action
 * (plus anonymous callers on non-public actions).
 */
export function hasActionGrant(
  user: PermissionUser | null | undefined,
  resource: PermissionResource,
  action: PermissionAction
): boolean {
  const rule = MATRIX[resource]?.[action];
  if (!rule) {
    return false;
  }
  if (rule.kind === "public") {
    return true;
  }
  if (!user) {
    return false;
  }
  return heldRoles(user).some((r) =>
    (rule.roles as readonly RoleName[]).includes(r)
  );
}

/**
 * Row re-check for resolvers. Throws FORBIDDEN when the record is missing
 * (anti-probing) or the row check fails; returns void on pass.
 */
export function requirePermission<R extends PermissionResource>(
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
