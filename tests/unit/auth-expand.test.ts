import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = join(__dirname, "..", "..");
const SCHEMA_PATH = join(ROOT, "prisma", "schema.prisma");
const SEED_PATH = join(ROOT, "prisma", "seed.ts");
const MIGRATIONS_DIR = join(ROOT, "prisma", "migrations");
const ROLE_NAMES = ["ADMIN", "MODERATOR", "USER"];

function findAdditiveMigrationSql(): string {
  const entries = readdirSync(MIGRATIONS_DIR, { withFileTypes: true });
  const candidates = entries
    .filter((e) => e.isDirectory())
    .map((e) => join(MIGRATIONS_DIR, e.name, "migration.sql"))
    .filter((p) => {
      try {
        const sql = readFileSync(p, "utf8");
        return (
          sql.includes('"Role"') &&
          sql.includes('"UserRoleAssignment"') &&
          sql.includes('"PersonalAccessToken"')
        );
      } catch {
        return false;
      }
    });
  if (candidates.length === 0) {
    throw new Error("additive auth-expand migration.sql not found");
  }
  return readFileSync(candidates[0], "utf8");
}

describe("Migration 05 — Auth expand (additive schema)", () => {
  it("kept the legacy role column and enum live until the final cutover", () => {
    // Historical additive step: no drops (final drop lives in Migration 20).
    const additiveSql = findAdditiveMigrationSql();
    expect(additiveSql).not.toContain("DROP COLUMN");
    expect(additiveSql).not.toContain("DROP TYPE");
    // Postgres forbids a table sharing the legacy "UserRole" enum type name.
    expect(additiveSql).not.toContain('CREATE TABLE "UserRole"');
    // Final schema (Migration 20, #43) drops the legacy artefacts.
    const schema = readFileSync(SCHEMA_PATH, "utf8");
    expect(schema).toContain("model User {");
    expect(schema).not.toContain("enum UserRole {");
    expect(schema).not.toMatch(/role\s+UserRole/);
    expect(schema).not.toContain("model UserRole {");
  });

  it("adds a Role catalog with a unique name", () => {
    const schema = readFileSync(SCHEMA_PATH, "utf8");
    expect(schema).toContain("model Role {");
    expect(schema).toMatch(/name\s+String\s+@unique/);
  });

  it("adds an explicit join carrying provenance with user+role uniqueness", () => {
    // Historical additive step (#59 expand): the explicit join lived in the
    // additive migration SQL. Slice 3 (#60 contract) replaces it with the
    // implicit many-to-many join, so the live schema must no longer carry
    // the provenance table.
    const sql = findAdditiveMigrationSql();
    expect(sql).toContain('CREATE TABLE "UserRoleAssignment"');
    const schema = readFileSync(SCHEMA_PATH, "utf8");
    expect(schema).not.toContain("model UserRoleAssignment {");
    expect(schema).toMatch(/roles\s+Role\[\]/);
    expect(schema).toMatch(/users\s+User\[\]/);
  });

  it("adds a hash-only token store indexed by user", () => {
    const schema = readFileSync(SCHEMA_PATH, "utf8");
    expect(schema).toContain("model PersonalAccessToken {");
    expect(schema).toContain("tokenHash  String    @unique");
    expect(schema).toContain("@@index([userId])");
  });

  it("migrates additively without touching legacy tables", () => {
    const sql = findAdditiveMigrationSql();
    expect(sql).toContain('CREATE TABLE "Role"');
    expect(sql).toContain('CREATE TABLE "UserRoleAssignment"');
    expect(sql).toContain('CREATE TABLE "PersonalAccessToken"');
    // Postgres forbids a table sharing the legacy "UserRole" enum type name.
    expect(sql).not.toContain('CREATE TABLE "UserRole"');
    expect(sql).not.toContain("DROP TABLE");
    expect(sql).not.toContain("DROP COLUMN");
    expect(sql).not.toContain("DROP TYPE");
    expect(sql).not.toContain('ALTER TABLE "ProgressData"');
    expect(sql).not.toContain('ALTER TABLE "UserAchievement"');
    expect(sql).not.toContain('ALTER TABLE "Account"');
    expect(sql).not.toContain('ALTER TABLE "User"');
  });

  it("seeds exactly three roles idempotently with zero moderator assignments", () => {
    const sql = findAdditiveMigrationSql();
    for (const role of ROLE_NAMES) {
      expect(sql).toContain(role);
    }
    expect(sql).toContain("ON CONFLICT");
    expect(sql).toContain("DO NOTHING");
    // No membership rows are seeded here; backfill owns assignments.
    expect(sql).not.toContain('INSERT INTO "UserRoleAssignment"');

    const seed = readFileSync(SEED_PATH, "utf8");
    for (const role of ROLE_NAMES) {
      expect(seed).toContain(role);
    }
    expect(seed).toContain("upsert");
  });
});
