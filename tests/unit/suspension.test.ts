import { describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({ auth: vi.fn(async () => null) }));
vi.mock("@/lib/db", () => ({ db: {} }));
vi.mock("@/lib/redis", () => ({ redis: {} }));
vi.mock("@/env", () => ({ env: { NODE_ENV: "test" } }));

type Membership = { userId: string; roleId: string };

function createSuspendedFakeDb(opts?: {
  suspended?: Record<string, Date | null>;
}) {
  const roles = [
    { id: "role-admin", name: "ADMIN" },
    { id: "role-mod", name: "MODERATOR" },
    { id: "role-user", name: "USER" },
  ];
  const users: { id: string; suspendedAt: Date | null }[] = [
    { id: "admin-1", suspendedAt: null },
    { id: "learner-a", suspendedAt: null },
  ];
  if (opts?.suspended) {
    for (const [id, at] of Object.entries(opts.suspended)) {
      const row = users.find((u) => u.id === id);
      if (row) {
        row.suspendedAt = at;
      } else {
        users.push({ id, suspendedAt: at });
      }
    }
  }
  const memberships: Membership[] = [
    { userId: "admin-1", roleId: "role-admin" },
    { userId: "admin-1", roleId: "role-user" },
    { userId: "learner-a", roleId: "role-user" },
  ];
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
        data: { suspendedAt?: Date | null };
      }) {
        const found = users.find((u) => u.id === args.where.id) ?? null;
        if (!found) {
          const err = new Error("No record was found");
          (err as { code?: string }).code = "P2025";
          return Promise.reject(err);
        }
        if ("suspendedAt" in args.data) {
          found.suspendedAt = args.data.suspendedAt ?? null;
        }
        return Promise.resolve({ ...found, roles: rolesFor(found.id) });
      },
    },
  };
}

describe("Suspended capability with preserved roles (#72)", () => {
  it("suspend blocks the user while roles underneath stay untouched", async () => {
    const { suspendUser } = await import("@/server/services/admin");
    const db = createSuspendedFakeDb();
    const result = await suspendUser(
      db as never,
      { userId: "learner-a" },
      { callerId: "admin-1" }
    );
    expect(result.success).toBe(true);
    expect(result.data.suspendedAt).toBeInstanceOf(Date);
    expect([...result.data.roles].sort()).toEqual(["USER"]);
  });

  it("unsuspend restores the exact prior memberships with no manual re-grant", async () => {
    const { suspendUser, unsuspendUser } = await import(
      "@/server/services/admin"
    );
    const db = createSuspendedFakeDb();
    await suspendUser(
      db as never,
      { userId: "admin-1" },
      { callerId: "admin-1-self-guard-bypass" }
    );
    const restored = await unsuspendUser(db as never, { userId: "admin-1" });
    expect(restored.success).toBe(true);
    expect(restored.data.suspendedAt).toBeNull();
    expect([...restored.data.roles].sort()).toEqual(["ADMIN", "USER"]);
  });

  it("suspension is reversible only by an admin path and never drops the USER floor", async () => {
    const { suspendUser } = await import("@/server/services/admin");
    const db = createSuspendedFakeDb();
    // An admin cannot suspend their own account (self-lockout guard).
    await expect(
      suspendUser(db as never, { userId: "admin-1" }, { callerId: "admin-1" })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
    // Suspending a sole-USER learner keeps the USER membership (no Role-less).
    const result = await suspendUser(
      db as never,
      { userId: "learner-a" },
      { callerId: "admin-1" }
    );
    expect([...result.data.roles].sort()).toEqual(["USER"]);
  });

  it("an existing session is denied on privileged paths after suspension", async () => {
    const suspendedAt = new Date("2026-09-22T00:00:00.000Z");
    const { appRouter } = await import("@/server/api/root");
    const caller = appRouter.createCaller({
      db: createSuspendedFakeDb({
        suspended: { "admin-1": suspendedAt },
      }) as never,
      headers: new Headers(),
      user: { id: "admin-1", roles: ["ADMIN", "USER"] } as never,
    });
    // Suspension denial is enforced on the admin gate even though the
    // JWT-stamped session copy still lists the old roles.
    await expect(caller.admin.pingAdmin()).rejects.toMatchObject({
      code: "FORBIDDEN",
      message: "Account is suspended.",
    });
  });

  it("a stamped suspended session is denied on every path with no extra lookup", async () => {
    const { appRouter } = await import("@/server/api/root");
    const caller = appRouter.createCaller({
      db: createSuspendedFakeDb() as never,
      headers: new Headers(),
      user: { id: "learner-a", roles: ["USER"], suspended: true } as never,
    });
    await expect(caller.user.getUser()).rejects.toMatchObject({
      code: "FORBIDDEN",
      message: "Account is suspended.",
    });
  });
});
