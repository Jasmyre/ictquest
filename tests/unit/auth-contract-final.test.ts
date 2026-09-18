import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = join(__dirname, "..", "..");
const SCHEMA_PATH = join(ROOT, "prisma", "schema.prisma");
const MIGRATIONS_DIR = join(ROOT, "prisma", "migrations");

function read(rel: string): string {
  return readFileSync(join(ROOT, rel), "utf8");
}

function readMigrationSql(dirName: string): string {
  return readFileSync(join(MIGRATIONS_DIR, dirName, "migration.sql"), "utf8");
}

function findBreakingMigration(): { dir: string; sql: string } {
  const entries = readdirSync(MIGRATIONS_DIR, { withFileTypes: true });
  for (const e of entries) {
    if (!e.isDirectory()) {
      continue;
    }
    const sql = readMigrationSql(e.name);
    if (
      /DROP COLUMN.*"role"/.test(sql) &&
      sql.includes("DROP TYPE") &&
      sql.includes("UserRole")
    ) {
      return { dir: e.name, sql };
    }
  }
  throw new Error("breaking auth-contract migration.sql not found");
}

describe("Migration 20 — Auth contract plus final green gate (#43)", () => {
  it("drops the legacy role column and enum from the schema", () => {
    const schema = readFileSync(SCHEMA_PATH, "utf8");
    expect(schema).not.toContain("enum UserRole {");
    expect(schema).not.toMatch(/role\s+UserRole/);
    expect(schema).not.toContain("$Enums.UserRole");
    // New contract survives the cutover.
    expect(schema).toContain("model Role {");
    expect(schema).toContain("model UserRoleAssignment {");
    expect(schema).toContain("model PersonalAccessToken {");
  });

  it("ships a breaking migration that drops legacy artefacts and adds missing indexes", () => {
    const { sql } = findBreakingMigration();
    expect(sql).toMatch(/DROP COLUMN.*"role"/);
    expect(sql).toMatch(/DROP TYPE.*UserRole/);
    // Missing indexes land after every caller migrated.
    expect(sql).toContain("CREATE INDEX");
    expect(sql).toMatch(/"ProgressData"/);
    expect(sql).toMatch(/"Account"/);
    expect(sql).toMatch(/"UserAchievement"/);
    // Unrelated tables are indexed, never dropped.
    expect(sql).not.toContain('DROP TABLE "ProgressData"');
    expect(sql).not.toContain('DROP TABLE "UserAchievement"');
    expect(sql).not.toContain('DROP TABLE "Account"');
    expect(sql).not.toContain('DROP TABLE "User"');
  });

  it("leaves unrelated legacy migrations replayable", () => {
    const entries = readdirSync(MIGRATIONS_DIR, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name);
    // Legacy history plus additive plus breaking must all still exist.
    expect(entries.length).toBeGreaterThan(3);
    expect(entries.some((n) => n.includes("migration_for_google_error"))).toBe(
      true
    );
    expect(entries.some((n) => n.includes("achievement"))).toBe(true);
    const { dir } = findBreakingMigration();
    expect(entries).toContain(dir);
  });

  it("serves sessions with roles[] and no legacy single-role field", () => {
    const authSrc = read("src/auth.ts");
    expect(authSrc).toContain("token.roles");
    expect(authSrc).toContain("session.user.roles");
    expect(authSrc).not.toContain("token.role =");
    expect(authSrc).not.toContain("session.user.role =");
    expect(authSrc).not.toMatch(/from "@prisma\/client"/);

    const types = read("src/types/next-auth.d.ts");
    expect(types).toContain("roles");
    expect(types).toContain("RoleName");
    expect(types).not.toContain("UserRole");
    expect(types).not.toMatch(/role:\s*UserRole/);

    const dataUser = read("src/data/user.ts");
    expect(dataUser).toContain("getUserWithRoles");
    expect(dataUser).not.toContain("$Enums");
    expect(dataUser).not.toContain("@prisma/client");
  });

  it("exposes the versioned me contract with roles[] and no legacy role", () => {
    const schema = read("src/server/schemas/user.ts");
    expect(schema).toContain("roles");
    expect(schema).not.toMatch(/^\s*role:\s*z\./m);

    const router = read("src/server/api/routers/user.ts");
    expect(router).toContain("roles");
    expect(router).not.toMatch(/u\.role(?!s)/);
  });

  it("keeps the post-cutover backfill safe with row-count guards", () => {
    const script = read("scripts/backfill-auth-roles.mjs");
    expect(script).toContain("$transaction");
    expect(script).toContain("ProgressData");
    expect(script).toContain("UserAchievement");
    expect(script).toContain("Account");
    // Post-cutover the script must not read the dropped column.
    expect(script).not.toMatch(/select:\s*\{\s*id:\s*true,\s*role:\s*true/);
  });
});
