import { describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({ auth: vi.fn(async () => null) }));
vi.mock("@/lib/db", () => ({ db: {} }));
vi.mock("@/lib/redis", () => ({ redis: {} }));
vi.mock("@/env", () => ({ env: { NODE_ENV: "test" } }));

type Membership = { userId: string; roleId: string };

function createFloorFakeDb(memberships: Membership[]) {
  const roles = [
    { id: "role-admin", name: "ADMIN" },
    { id: "role-mod", name: "MODERATOR" },
    { id: "role-user", name: "USER" },
  ];
  const users = [{ id: "admin-1" }, { id: "learner-a" }, { id: "role-less" }];
  const roleNameById = (id: string) =>
    roles.find((r) => r.id === id)?.name ?? "UNKNOWN";
  const rolesFor = (userId: string) =>
    memberships
      .filter((m) => m.userId === userId)
      .map((m) => ({ name: roleNameById(m.roleId) }));

  return {
    user: {
      findUnique(args: { where: { id: string } }) {
        const found = users.find((u) => u.id === args.where.id) ?? null;
        if (!found) {
          return Promise.resolve(null);
        }
        return Promise.resolve({ ...found, roles: rolesFor(found.id) });
      },
      update(args: {
        where: { id: string };
        data: { roles?: { disconnect?: { id: string } } };
      }) {
        const disconnectId = args.data.roles?.disconnect?.id;
        if (disconnectId) {
          const idx = memberships.findIndex(
            (m) => m.userId === args.where.id && m.roleId === disconnectId
          );
          if (idx !== -1) {
            memberships.splice(idx, 1);
          }
        }
        return Promise.resolve({
          id: args.where.id,
          roles: rolesFor(args.where.id),
        });
      },
    },
    role: {
      findUnique(args: { where: { name: string } }) {
        return Promise.resolve(
          roles.find((r) => r.name === args.where.name) ?? null
        );
      },
    },
  };
}

describe("Default role floor hardening (#71)", () => {
  it("rejects revoking the USER floor with BAD_REQUEST even when other roles remain", async () => {
    const { revokeRole } = await import("@/server/services/admin");
    const db = createFloorFakeDb([
      { userId: "admin-1", roleId: "role-admin" },
      { userId: "admin-1", roleId: "role-user" },
    ]);
    await expect(
      revokeRole(db as never, { userId: "admin-1", role: "USER" })
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("rejects removal of the last remaining membership with BAD_REQUEST", async () => {
    const { revokeRole } = await import("@/server/services/admin");
    const db = createFloorFakeDb([
      { userId: "learner-a", roleId: "role-user" },
    ]);
    await expect(
      revokeRole(db as never, { userId: "learner-a", role: "USER" })
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("denies a Role-less caller fail-closed across guarded actions", async () => {
    const { hasPermission, hasActionGrant } = await import(
      "@/server/permissions"
    );
    const roleLess = { id: "role-less", roles: [] as string[] };
    expect(hasPermission(roleLess, "Admin", "manage")).toBe(false);
    expect(hasPermission(roleLess, "Progress", "create")).toBe(false);
    expect(
      hasPermission(roleLess, "Progress", "view", { userId: "role-less" })
    ).toBe(false);
    expect(hasPermission(roleLess, "Achievement", "manage")).toBe(false);
    expect(hasActionGrant(roleLess, "Admin", "manage")).toBe(false);
    expect(hasActionGrant(roleLess, "Progress", "create")).toBe(false);
  });
});
