import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = join(__dirname, "..", "..");

const HEAL_TO_DEFAULT_RE = /USER|DEFAULT_ROLE/;
const ROLE_WIRING_RE = /roleAssignment|getUserRole|ensureDefaultRole/i;
const ZERO_WITHOUT_DEFAULT_RE = /zero.*without|assert.*USER/i;

function read(rel: string): string {
  return readFileSync(join(ROOT, rel), "utf8");
}

describe("Migration 07 — Auth backfill, session, registration", () => {
  it("exposes a default learner role plus a hasRole helper", async () => {
    const roles = await import("@/lib/roles");
    expect(roles.DEFAULT_ROLE_NAME).toBe("USER");
    expect([...roles.ROLE_NAMES].sort()).toEqual(
      ["ADMIN", "MODERATOR", "USER"].sort()
    );
    expect(roles.hasRole(["ADMIN", "USER"], "ADMIN")).toBe(true);
    expect(roles.hasRole(["USER"], "ADMIN")).toBe(false);
    expect(roles.hasRole([], "USER")).toBe(false);
  });

  it("registration creates the default membership in the same transaction", () => {
    const src = read("src/actions/register.ts");
    expect(src).toContain("$transaction");
    expect(src).not.toContain("userRoleAssignment");
    expect(src).toContain('"USER"');
    // Atomic grant connects the implicit join, provenance dropped (#60).
    expect(src).toMatch(/roles:\s*\{\s*connect/);
  });

  it("sign-in loads roles into session and heals empties to the default", () => {
    const authSrc = read("src/auth.ts");
    expect(authSrc).toContain("token.roles");
    expect(authSrc).toContain("session.user.roles");
    expect(authSrc).toContain("@/lib/roles");
    // Empty memberships heal to the default role so nobody is locked out.
    expect(authSrc).toMatch(HEAL_TO_DEFAULT_RE);
    expect(authSrc).toMatch(ROLE_WIRING_RE);

    const types = read("src/types/next-auth.d.ts");
    expect(types).toContain("roles");
    expect(types).toContain("RoleName");
  });

  it("backfill maps legacy values, guarantees the default, and guards row counts", async () => {
    const roles = await import("@/lib/roles");
    // ADMIN legacy -> ADMIN membership, USER legacy -> USER membership,
    // then the guarantee pass adds USER wherever it is missing.
    const plan = roles.buildBackfillPlan([
      { id: "admin-1", legacyRole: "ADMIN", existing: [] },
      { id: "user-1", legacyRole: "USER", existing: [] },
      { id: "healed-1", legacyRole: "USER", existing: [] },
      { id: "already-1", legacyRole: "ADMIN", existing: ["ADMIN", "USER"] },
    ]);
    const forUser = (id: string) =>
      plan.filter((p) => p.userId === id).map((p) => p.roleName);
    expect(forUser("admin-1").sort()).toEqual(["ADMIN", "USER"]);
    expect(forUser("user-1")).toEqual(["USER"]);
    expect(forUser("already-1")).toEqual([]);

    // Zero users without the default after the guarantee pass.
    const usersWithoutDefault = [
      { id: "a", roles: ["ADMIN", "USER"] },
      { id: "b", roles: ["USER"] },
    ];
    expect(() =>
      roles.assertZeroWithoutDefault(usersWithoutDefault)
    ).not.toThrow();
    expect(() =>
      roles.assertZeroWithoutDefault([{ id: "c", roles: ["ADMIN"] }])
    ).toThrow();

    // The runnable backfill runs in one transaction and leaves
    // progress, grant, and account row counts unchanged.
    const script = read("scripts/backfill-auth-roles.mjs");
    expect(script).toContain("$transaction");
    expect(script).toContain("ProgressData");
    expect(script).toContain("UserAchievement");
    expect(script).toContain("Account");
    expect(script).toMatch(ZERO_WITHOUT_DEFAULT_RE);
  });
});
