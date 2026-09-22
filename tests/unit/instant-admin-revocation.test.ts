import { describe, expect, it, vi } from "vitest";

const getUserRoleNames = vi.fn();
vi.mock("@/lib/roles", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/roles")>();
  return { ...actual, getUserRoleNames };
});
vi.mock("@/auth", () => ({ auth: vi.fn(async () => null) }));
vi.mock("@/lib/db", () => ({ db: {} }));
vi.mock("@/lib/redis", () => ({ redis: {} }));
vi.mock("@/env", () => ({ env: { NODE_ENV: "test" } }));

async function callerFor(user: unknown) {
  const { appRouter } = await import("@/server/api/root");
  return appRouter.createCaller({
    db: {} as never,
    headers: new Headers(),
    user: user as never,
  });
}

describe("Instant admin revocation (#70)", () => {
  it("grants admin access on next request without re-signin", async () => {
    getUserRoleNames.mockResolvedValueOnce(["ADMIN", "USER"]);
    const caller = await callerFor({ id: "new-admin", roles: ["USER"] });
    await expect(caller.admin.pingAdmin()).resolves.toMatchObject({
      success: true,
    });
  });

  it("revokes admin access on next request without re-signin", async () => {
    getUserRoleNames.mockResolvedValueOnce(["USER"]);
    const caller = await callerFor({
      id: "demoted-admin",
      roles: ["ADMIN", "USER"],
    });
    await expect(caller.admin.pingAdmin()).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
  });

  it("still sends anonymous callers to UNAUTHORIZED", async () => {
    await expect(
      (await callerFor(null)).admin.pingAdmin()
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("issues no extra membership lookup on non-privileged paths", async () => {
    getUserRoleNames.mockClear();
    const caller = await callerFor({ id: "learner-1", roles: ["USER"] });
    await expect(caller.user.getUser()).resolves.toMatchObject({
      success: true,
    });
    expect(getUserRoleNames).not.toHaveBeenCalled();
  });
});
