import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({ auth: vi.fn(async () => null) }));
vi.mock("@/lib/db", () => ({ db: {} }));
vi.mock("@/lib/redis", () => ({ redis: {} }));
vi.mock("@/env", () => ({ env: { NODE_ENV: "test" } }));

const ROOT = join(__dirname, "..", "..");

const ROLE_AWARE_RE = /roleAssignment|getUserRole|roles/i;

function read(rel: string): string {
  return readFileSync(join(ROOT, rel), "utf8");
}

async function callerFor(user: unknown) {
  const { appRouter } = await import("@/server/api/root");
  return appRouter.createCaller({
    db: {} as never,
    headers: new Headers(),
    user: user as never,
  });
}

const adminUser = {
  id: "admin-1",
  roles: ["ADMIN", "USER"],
};

const moderatorUser = {
  id: "mod-1",
  roles: ["MODERATOR", "USER"],
};

const learnerUser = {
  id: "learner-1",
  roles: ["USER"],
};

describe("Migration 08 — Privileged procedures", () => {
  it("exposes admin and moderator procedures that deny without the matching role", async () => {
    const trpc = await import("@/server/api/trpc");
    expect(trpc.adminProcedure).toBeDefined();
    expect(trpc.moderatorProcedure).toBeDefined();

    // Admin-only path: learner denied, admin allowed.
    await expect(
      (await callerFor(learnerUser)).admin.pingAdmin()
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(
      (await callerFor(adminUser)).admin.pingAdmin()
    ).resolves.toMatchObject({ success: true });

    // Moderator path: learner denied, moderator and admin allowed.
    await expect(
      (await callerFor(learnerUser)).admin.pingModerator()
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(
      (await callerFor(moderatorUser)).admin.pingModerator()
    ).resolves.toMatchObject({ success: true });
    await expect(
      (await callerFor(adminUser)).admin.pingModerator()
    ).resolves.toMatchObject({ success: true });
  });

  it("denies unauthenticated callers on privileged procedures", async () => {
    await expect(
      (await callerFor(null)).admin.pingAdmin()
    ).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
    await expect(
      (await callerFor(null)).admin.pingModerator()
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("leaves ordinary procedures on private/public procedures, not role gates", async () => {
    const src = read("src/server/api/routers/user.ts");
    expect(src).toContain("privateProcedure");
    // Ordinary public surface includes the rate-limited variant:
    // `publicRateLimitedProcedure` is `publicProcedure` plus a Redis guard
    // (public stats, #42) — still no role gate.
    expect(src).toMatch(/public(RateLimited)?Procedure/);
    expect(src).not.toContain("adminProcedure");
    expect(src).not.toContain("moderatorProcedure");

    // Behavioural: an ordinary private procedure still serves any
    // authenticated learner and still rejects anonymous callers.
    await expect(
      (await callerFor(learnerUser)).user.getUser()
    ).resolves.toMatchObject({ success: true });
    await expect((await callerFor(null)).user.getUser()).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });

  it("backs role checks with role-aware data fetching", async () => {
    const roles = await import("@/lib/roles");
    expect(typeof roles.getUserRoleNames).toBe("function");
    expect(typeof roles.hasRole).toBe("function");

    const dataSrc = read("src/data/user.ts");
    expect(dataSrc).toMatch(ROLE_AWARE_RE);

    const trpcSrc = read("src/server/api/trpc.ts");
    expect(trpcSrc).toContain("hasRole");
    expect(trpcSrc).toContain("roles");
  });

  it("retires the dev access toggle instead of migrating it as a gate", () => {
    expect(existsSync(join(ROOT, "src", "app", "access", "page.tsx"))).toBe(
      false
    );

    const commandSearch = read("src/components/command-search.tsx");
    expect(commandSearch).not.toContain('"/access"');
    expect(commandSearch).not.toContain("Access roles");

    // The toggle must not resurface as an auth gate.
    const routesSrc = read("src/routes.ts");
    expect(routesSrc).not.toContain("/access");
    const proxySrc = read("src/proxy.ts");
    expect(proxySrc).not.toContain("/access");
    const trpcSrc = read("src/server/api/trpc.ts");
    expect(trpcSrc).not.toContain("skip");
  });
});
