import { describe, expect, it, vi } from "vitest";

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

const learner = { id: "learner-1", roles: ["USER"] };
const admin = { id: "admin-1", roles: ["ADMIN", "USER"] };

describe("permissions seam matrix (#61)", () => {
  it("grants public lesson reads without sign-in", async () => {
    const { hasPermission, hasActionGrant } = await import(
      "@/server/permissions"
    );
    expect(hasPermission(null, "Lesson", "view")).toBe(true);
    expect(hasPermission(null, "Topic", "view")).toBe(true);
    expect(hasPermission(null, "Quiz", "view")).toBe(true);
    expect(hasActionGrant(null, "Lesson", "view")).toBe(true);
  });

  it("rejects anonymous callers with UNAUTHORIZED on gated writes", async () => {
    await expect(
      (await callerFor(null)).progress.create({
        topic: "t",
        subtopic: "s",
      })
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect((await callerFor(null)).user.getUser()).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });

  it("rejects wrong-role callers with FORBIDDEN on admin manage", async () => {
    await expect(
      (await callerFor(learner)).admin.pingAdmin()
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(
      (await callerFor(admin)).admin.pingAdmin()
    ).resolves.toMatchObject({ success: true });
  });

  it("passes owner reads and denies cross-owner rows", async () => {
    const { hasPermission } = await import("@/server/permissions");
    expect(
      hasPermission(learner, "Progress", "view", { userId: "learner-1" })
    ).toBe(true);
    expect(
      hasPermission(learner, "Progress", "view", { userId: "someone-else" })
    ).toBe(false);
    expect(hasPermission(learner, "User", "view", { id: "learner-1" })).toBe(
      true
    );
    expect(
      hasPermission(learner, "Token", "view", { userId: "learner-1" })
    ).toBe(true);
    // Owner predicate denies without a record to test.
    expect(hasPermission(learner, "Progress", "view")).toBe(false);
    // Caller-level owner pass (row re-check on own session record).
    await expect(
      (await callerFor(learner)).user.getUser()
    ).resolves.toMatchObject({ success: true });
  });

  it("answers FORBIDDEN on missing records (anti-probing)", async () => {
    const { requirePermission } = await import("@/server/permissions");
    const { TRPCError } = await import("@trpc/server");
    for (const args of [
      { resource: "User", action: "view", data: null },
      { resource: "Progress", action: "view", data: undefined },
    ] as const) {
      try {
        requirePermission(learner, args.resource, args.action, {
          data: args.data,
        });
        expect.unreachable();
      } catch (error) {
        expect(error).toBeInstanceOf(TRPCError);
        expect((error as { code: string }).code).toBe("FORBIDDEN");
      }
    }
  });

  it("keeps admin catalog manage admin-only at the engine level", async () => {
    const { hasPermission, hasActionGrant } = await import(
      "@/server/permissions"
    );
    expect(hasActionGrant(learner, "Admin", "manage")).toBe(false);
    expect(hasActionGrant(admin, "Admin", "manage")).toBe(true);
    expect(hasPermission(learner, "Achievement", "manage")).toBe(false);
    expect(hasPermission(admin, "Achievement", "manage")).toBe(true);
  });

  it("grants multi-role sessions regardless of role-name casing", async () => {
    const { hasPermission, hasActionGrant } = await import(
      "@/server/permissions"
    );
    const { hasRole } = await import("@/lib/roles");
    const lowerAdmin = { id: "admin-1", roles: ["user", "admin"] };
    expect(hasActionGrant(lowerAdmin, "Admin", "manage")).toBe(true);
    expect(hasPermission(lowerAdmin, "Achievement", "manage")).toBe(true);
    expect(
      hasPermission(lowerAdmin, "Progress", "view", { userId: "admin-1" })
    ).toBe(true);
    expect(hasRole(["user", "admin"], "ADMIN")).toBe(true);
    expect(hasRole(["admin", "user"], "USER")).toBe(true);
    await expect(
      (await callerFor(lowerAdmin)).admin.pingAdmin()
    ).resolves.toMatchObject({ success: true });
  });
});
