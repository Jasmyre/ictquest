import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({ auth: vi.fn(async () => null) }));
vi.mock("@/lib/db", () => ({ db: {} }));
vi.mock("@/lib/redis", () => ({ redis: {} }));
vi.mock("@/env", () => ({ env: { NODE_ENV: "test" } }));

const ROOT = join(__dirname, "..", "..");

function read(rel: string): string {
  return readFileSync(join(ROOT, rel), "utf8");
}

function exists(rel: string): boolean {
  return existsSync(join(ROOT, rel));
}

describe("Migration 11 — Admin shell plus guards", () => {
  it("renders admin paths under a dedicated admin shell", () => {
    for (const rel of [
      "src/app/(admin)/layout.tsx",
      "src/app/(admin)/admin/page.tsx",
      "src/app/(admin)/admin/users/page.tsx",
      "src/app/(admin)/admin/lessons/page.tsx",
      "src/app/(admin)/admin/achievements/page.tsx",
      "src/app/(admin)/admin/progress/page.tsx",
    ]) {
      expect(exists(rel), rel).toBe(true);
    }
  });

  it("keeps the admin shell isolated from public and app nav", () => {
    const shell = read("src/app/(admin)/layout.tsx");
    expect(shell).toContain("/admin/users");
    expect(shell).toContain("/admin/lessons");
    expect(shell).toContain("/admin/achievements");
    expect(shell).toContain("/admin/progress");
    expect(shell).not.toContain("NavigationBar");
    expect(shell).not.toContain("@/components/ui/navigation-bar");
  });

  it("requires the admin role via session plus role check on every admin path", async () => {
    const routes = await import("@/routes");
    for (const path of [
      "/admin",
      "/admin/users",
      "/admin/lessons",
      "/admin/achievements",
      "/admin/progress",
    ]) {
      expect(routes.isAdminRoute(path), path).toBe(true);
      expect(routes.isPublicRoute(path), path).toBe(false);
    }
    expect(routes.isAdminRoute("/progress")).toBe(false);
    expect(routes.isAdminRoute("/lessons")).toBe(false);

    const proxySrc = read("src/proxy.ts");
    expect(proxySrc).toContain("isAdminRoute");
    expect(proxySrc).toContain("ADMIN");
    expect(proxySrc).toContain("hasRole");

    const shell = read("src/app/(admin)/layout.tsx");
    expect(shell).toContain("hasRole");
    expect(shell).toContain("ADMIN");
    expect(shell).toContain("auth()");
  });

  it("propagates the role list into the edge session so the proxy guard sees it", () => {
    // `src/proxy.ts` builds NextAuth from `auth.config` (no node callbacks),
    // so the config itself must copy token.roles into session.user.roles —
    // otherwise the ADMIN guard denies every admin path with a redirect.
    const config = read("src/auth.config.ts");
    expect(config).toContain("callbacks");
    expect(config).toContain("session.user.roles");
  });

  it("seeds moderator with zero routes", async () => {
    const routes = await import("@/routes");
    expect("moderatorRoutes" in routes).toBe(false);
    const src = read("src/routes.ts");
    expect(src).not.toContain("/moderator");
    expect(src).not.toContain("moderatorRoutes");
    expect(routes.isAdminRoute("/moderator")).toBe(false);

    const trpc = await import("@/server/api/trpc");
    expect(trpc.moderatorProcedure).toBeDefined();
  });

  it("leaves the learner app shell unchanged", () => {
    const shell = read("src/app/(app)/layout.tsx");
    expect(shell).toContain("NavigationBar");
    expect(shell).not.toContain("/admin");
  });
});
