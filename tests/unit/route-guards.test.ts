import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = join(__dirname, "..", "..");

function read(rel: string): string {
  return readFileSync(join(ROOT, rel), "utf8");
}

function exists(rel: string): boolean {
  return existsSync(join(ROOT, rel));
}

describe("Migration 10 — Public and app shells plus guards", () => {
  it("places public pages under the minimal (marketing) shell", () => {
    for (const rel of [
      "src/app/(marketing)/layout.tsx",
      "src/app/(marketing)/page.tsx",
      "src/app/(marketing)/terms/page.tsx",
      "src/app/(marketing)/privacy/page.tsx",
    ]) {
      expect(exists(rel), rel).toBe(true);
    }

    const shell = read("src/app/(marketing)/layout.tsx");
    expect(shell).toContain("SiteHeader");
    expect(shell).not.toContain("<header");
  });

  it("places learner pages under the full (app) shell, including moved settings", () => {
    for (const rel of [
      "src/app/(app)/layout.tsx",
      "src/app/(app)/lessons/page.tsx",
      "src/app/(app)/lessons/[topic]/page.tsx",
      "src/app/(app)/lessons/subtopic/[subtopic]/page.tsx",
      "src/app/(app)/progress/page.tsx",
      "src/app/(app)/profile/page.tsx",
      "src/app/(app)/user/[id]/page.tsx",
      "src/app/(app)/social/page.tsx",
      "src/app/(app)/social/new/page.tsx",
      "src/app/(app)/compliments/page.tsx",
      "src/app/(app)/settings/page.tsx",
    ]) {
      expect(exists(rel), rel).toBe(true);
    }

    const shell = read("src/app/(app)/layout.tsx");
    expect(shell).toContain("SiteHeader");
    expect(shell).toContain("Footer");
  });

  it("keeps auth and maintenance as shell-less surfaces on a thin root layout", () => {
    expect(exists("src/app/auth/page.tsx")).toBe(true);
    expect(exists("src/app/auth/error/page.tsx")).toBe(true);
    expect(exists("src/app/maintenance/page.tsx")).toBe(true);
    expect(exists("src/app/auth/layout.tsx")).toBe(false);
    expect(exists("src/app/maintenance/layout.tsx")).toBe(false);

    const root = read("src/app/layout.tsx");
    expect(root).not.toContain("NavigationBar");
    expect(root).not.toContain("Footer");
  });

  it("retires dead demo routes and the dropped group", () => {
    expect(exists("src/app/(protected)")).toBe(false);
    expect(exists("src/app/achivement/page.tsx")).toBe(false);
    expect(exists("src/app/access/page.tsx")).toBe(false);
    expect(exists("src/app/components/layout.tsx")).toBe(false);

    const routesSrc = read("src/routes.ts");
    expect(routesSrc).not.toContain("/access");
    expect(routesSrc).not.toContain("/achivement");
    expect(routesSrc).not.toContain('"/components"');
    expect(routesSrc).not.toContain('"/settings"');

    const proxySrc = read("src/proxy.ts");
    expect(proxySrc).not.toContain("/access");
    expect(proxySrc).not.toContain("/achivement");
  });

  it("guards with exact match; the whole lessons tree is authed", async () => {
    const routes = await import("@/routes");

    expect(typeof routes.isPublicRoute).toBe("function");
    expect(typeof routes.isAuthRoute).toBe("function");
    expect(typeof routes.isAdminRoute).toBe("function");

    // Exact-public: root, terms, privacy. The lessons index lives in the
    // (app) group on purpose, so it needs a session like the rest.
    for (const path of ["/", "/terms", "/privacy"]) {
      expect(routes.isPublicRoute(path), path).toBe(true);
    }

    // The whole lessons tree is authed, index included.
    for (const path of [
      "/lessons",
      "/lessons/html-basics",
      "/lessons/subtopic/html-structure",
      "/lessons/",
    ]) {
      expect(routes.isPublicRoute(path), path).toBe(false);
    }

    // App routes require auth (not public, not auth, not admin).
    for (const path of [
      "/lessons",
      "/progress",
      "/profile",
      "/user/abc",
      "/social",
      "/social/new",
      "/compliments",
      "/settings",
    ]) {
      expect(routes.isPublicRoute(path), path).toBe(false);
      expect(routes.isAuthRoute(path), path).toBe(false);
    }

    // Auth surfaces redirect-if-logged-in via prefix.
    expect(routes.isAuthRoute("/auth")).toBe(true);
    expect(routes.isAuthRoute("/auth/error")).toBe(true);

    // Admin prefix reserved (separate shell lands in #34).
    expect(routes.isAdminRoute("/admin")).toBe(true);
    expect(routes.isAdminRoute("/admin/users")).toBe(true);
    expect(routes.isAdminRoute("/admin/lessons")).toBe(true);
  });

  it("bypasses maintenance and the public API prefix", async () => {
    const routes = await import("@/routes");
    expect(typeof routes.isMaintenanceBypass).toBe("function");
    expect(typeof routes.isPublicApiRoute).toBe("function");

    expect(routes.isMaintenanceBypass("/maintenance")).toBe(true);
    expect(routes.isMaintenanceBypass("/progress")).toBe(false);

    expect(routes.isPublicApiRoute("/api/public/get-user-stats")).toBe(true);
    expect(routes.isPublicApiRoute("/api/auth/session")).toBe(false);
  });

  it("wires the proxy to session, admin roles, and the bypasses", () => {
    const proxySrc = read("src/proxy.ts");
    expect(proxySrc).toContain("isPublicRoute");
    expect(proxySrc).toContain("isAuthRoute");
    expect(proxySrc).toContain("isAdminRoute");
    expect(proxySrc).toContain("isMaintenanceBypass");
    expect(proxySrc).toContain("isPublicApiRoute");
    expect(proxySrc).toContain("NEXT_PUBLIC_IS_IN_MAINTENANCE");
    expect(proxySrc).toContain("/maintenance");
    expect(proxySrc).toContain("ADMIN");
  });
});
