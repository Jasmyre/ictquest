import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";
import {
  hashPersonalAccessToken,
  mintPersonalAccessToken,
  verifyPersonalAccessToken,
} from "@/server/auth/personal-access-tokens";

const ROOT = join(__dirname, "..", "..");
const DIR = "20260920000000_role_membership_expand";
const PROFILE_DIR = "20260919000000_user_profile_fields";

function migrationSql(): string {
  return readFileSync(
    join(ROOT, "prisma", "migrations", DIR, "migration.sql"),
    "utf8"
  );
}

type PatRecord = {
  id: string;
  userId: string;
  name: string;
  tokenHash: string;
  scopes: string[];
  expiresAt: Date | null;
  lastUsedAt: Date | null;
  revokedAt: Date | null;
};

/** In-memory PAT store behind the mocked `personalAccessToken` delegate. */
function fakePatDb() {
  const byHash = new Map<string, PatRecord>();
  const db = {
    personalAccessToken: {
      create: vi.fn(
        ({ data }: { data: Omit<PatRecord, "id" | "lastUsedAt"> }) => {
          const record: PatRecord = {
            ...data,
            id: `pat-${byHash.size + 1}`,
            lastUsedAt: null,
            revokedAt: null,
          };
          byHash.set(record.tokenHash, record);
          return Promise.resolve(record);
        }
      ),
      findUnique: vi.fn(({ where }: { where: { tokenHash: string } }) =>
        Promise.resolve(byHash.get(where.tokenHash) ?? null)
      ),
      update: vi.fn(
        ({
          where,
          data,
        }: {
          where: { id: string };
          data: Partial<PatRecord>;
        }) => {
          const record = [...byHash.values()].find((r) => r.id === where.id);
          if (!record) {
            return Promise.reject({ code: "P2025" });
          }
          Object.assign(record, data);
          return Promise.resolve(record);
        }
      ),
    },
  };
  return { db, byHash };
}

describe("role membership expand migration (#59)", () => {
  it("ships an additive migration ordered after the profile-fields migration", () => {
    const entries = readdirSync(join(ROOT, "prisma", "migrations"), {
      withFileTypes: true,
    })
      .filter((e) => e.isDirectory())
      .map((e) => e.name);
    expect(entries).toContain(DIR);
    expect(entries).toContain(PROFILE_DIR);
    expect(entries.indexOf(DIR) > entries.indexOf(PROFILE_DIR)).toBe(true);

    const schema = readFileSync(join(ROOT, "prisma", "schema.prisma"), "utf8");
    // Implicit join beside the explicit assignment table (both present).
    expect(schema).toMatch(/model User[\s\S]*?roles\s+Role\[\]/);
    expect(schema).toMatch(/model Role[\s\S]*?users\s+User\[\]/);
    expect(schema).toContain("UserRoleAssignment");
  });

  it("copies every existing assignment pair one-to-one; zero-pair users stay zero until heal", () => {
    const sql = migrationSql();
    expect(sql).toContain('"_RoleToUser"');
    expect(sql).toMatch(/CREATE TABLE.*"_RoleToUser"/i);
    // Pair copy reads the explicit table - nothing else seeds memberships.
    expect(sql).toMatch(
      /INSERT INTO "_RoleToUser"[\s\S]*FROM "UserRoleAssignment"/i
    );
    expect(sql).not.toMatch(/DROP (TABLE|COLUMN)/i);
    expect(sql).not.toMatch(/DROP CONSTRAINT/i);
    // No blanket per-user insert: only assignment rows become join rows, so
    // zero-pair users yield zero rows until heal.
    expect(sql).not.toMatch(/FROM "User"(?!Role)/i);
    expect(sql).toMatch(/ON CONFLICT DO NOTHING/i);
    // Expand leaves the old assignment table and token tables untouched.
    expect(sql).not.toMatch(/UserRoleAssignment.*(ALTER|DROP)/i);
    expect(sql).not.toMatch(/ALTER TABLE "UserRoleAssignment"/i);
    expect(sql).not.toContain("PersonalAccessToken");
  });
});

describe("token mint/verify/revoke stays owner-scoped after the expand (#59)", () => {
  it("mints for the owner, verifies as the owner, and rejects after revoke", async () => {
    const { db } = fakePatDb();
    const typed = db as unknown as Parameters<
      typeof mintPersonalAccessToken
    >[0];

    const { record, plainToken } = await mintPersonalAccessToken(
      typed,
      "owner-1",
      { name: "scripts" }
    );
    expect(record.userId).toBe("owner-1");
    expect(record.tokenHash).toBe(hashPersonalAccessToken(plainToken));

    // Verify resolves the same owner-scoped record and touches lastUsedAt.
    const verified = await verifyPersonalAccessToken(typed, plainToken);
    expect(verified?.userId).toBe("owner-1");
    expect(verified?.lastUsedAt).toBeInstanceOf(Date);

    // A foreign token hash never resolves to this owner.
    const stranger = await verifyPersonalAccessToken(typed, "ictq_nope");
    expect(stranger).toBeNull();

    // Idempotent revoke: mark revoked, then verify fails closed.
    await db.personalAccessToken.update({
      where: { id: record.id },
      data: { revokedAt: new Date() },
    });
    const afterRevoke = await verifyPersonalAccessToken(typed, plainToken);
    expect(afterRevoke).toBeNull();
  });
});
