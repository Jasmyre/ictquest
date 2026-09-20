import { execSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = join(__dirname, "..", "..");
const DIR = "20260921000000_role_membership_contract";
const EXPAND_DIR = "20260920000000_role_membership_expand";

function read(rel: string): string {
  return readFileSync(join(ROOT, rel), "utf8");
}

describe("role membership contract migration (#60)", () => {
  it("ships a contract migration ordered after the expand that drops the old table", () => {
    const entries = readdirSync(join(ROOT, "prisma", "migrations"), {
      withFileTypes: true,
    })
      .filter((e) => e.isDirectory())
      .map((e) => e.name);
    expect(entries).toContain(DIR);
    expect(entries).toContain(EXPAND_DIR);
    expect(entries.indexOf(DIR) > entries.indexOf(EXPAND_DIR)).toBe(true);

    const sql = read(`prisma/migrations/${DIR}/migration.sql`);
    expect(sql).toMatch(/DROP TABLE.*UserRoleAssignment/i);
    expect(sql).not.toContain("PersonalAccessToken");
  });

  it("leaves the live schema on the implicit join with no old-form model", () => {
    const schema = read("prisma/schema.prisma");
    expect(schema).toMatch(/roles\s+Role\[\]/);
    expect(schema).toMatch(/users\s+User\[\]/);
    expect(schema).not.toContain("UserRoleAssignment");
    expect(schema).not.toContain("roleAssignments");
    expect(schema).not.toContain("assignedBy");
  });

  it("leaves no caller on the old assignment table", () => {
    let out = "";
    try {
      out = execSync(
        'git grep -n "userRoleAssignment" -- src scripts prisma/schema.prisma prisma/seed.ts',
        { cwd: ROOT, encoding: "utf8" }
      );
    } catch {
      out = "";
    }
    expect(out.trim()).toBe("");
    let legacy = "";
    try {
      legacy = execSync(
        'git grep -n "UserRoleAssignment" -- src scripts prisma/schema.prisma prisma/seed.ts',
        { cwd: ROOT, encoding: "utf8" }
      );
    } catch {
      legacy = "";
    }
    expect(legacy.trim()).toBe("");
  });

  it("converges role-less users to the default role on register, social sign-up, and token heal", () => {
    expect(read("src/actions/register.ts")).toMatch(/roles:\s*\{\s*connect/);
    expect(read("src/auth-events.ts")).toContain("ensureDefaultRole");
    expect(read("src/auth.ts")).toContain("ensureDefaultRole");
    expect(read("src/lib/roles.ts")).toMatch(/roles:\s*\{\s*connect/);
    expect(read("src/lib/roles.ts")).not.toContain("userRoleAssignment");
  });

  it("refuses self-demotion with forbidden while keeping revoke idempotent", () => {
    const src = read("src/server/services/admin.ts");
    expect(src).toContain("FORBIDDEN");
    expect(src).toContain("already-removed");
    expect(src).toContain("Cannot revoke the user's only role.");
    expect(src).not.toContain("userRoleAssignment");
  });
});
