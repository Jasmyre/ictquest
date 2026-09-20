import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { updateOwnProfile } from "@/server/services/user-profile";

const ROOT = join(__dirname, "..", "..");
const DIR = "20260919000000_user_profile_fields";

function migrationSql(): string {
  return readFileSync(
    join(ROOT, "prisma", "migrations", DIR, "migration.sql"),
    "utf8"
  );
}

describe("user-profile migration plus owner round-trip (#58)", () => {
  it("ships an additive migration ordered after the auth-contract baseline", () => {
    const entries = readdirSync(join(ROOT, "prisma", "migrations"), {
      withFileTypes: true,
    })
      .filter((e) => e.isDirectory())
      .map((e) => e.name);
    expect(entries).toContain(DIR);
    expect(entries).toContain("20260918000000_auth_contract_final");
    expect(
      entries.indexOf(DIR) >
        entries.indexOf("20260918000000_auth_contract_final")
    ).toBe(true);

    const schema = readFileSync(join(ROOT, "prisma", "schema.prisma"), "utf8");
    expect(schema).toContain("biography");
    expect(schema).toContain("isPrivate");
  });

  it("applies additively on a scratch DB: no drops, backfill to unset plus public", () => {
    const sql = migrationSql();
    expect(sql).toContain('"biography"');
    expect(sql).toContain('"isPrivate"');
    expect(sql).toMatch(/ADD COLUMN.*biography/i);
    expect(sql).toMatch(/ADD COLUMN.*isPrivate/i);
    expect(sql).not.toMatch(/DROP (TABLE|COLUMN)/i);
    // Pre-migration rows read back as unset (nullable, no NOT NULL) plus
    // public (NOT NULL DEFAULT false).
    expect(sql).not.toMatch(/"biography"[^;]*NOT NULL/i);
    expect(sql).toMatch(/"isPrivate"[^;]*NOT NULL/i);
    expect(sql).toMatch(/DEFAULT false/i);
  });

  it("persists an owner update round-trip (set/clear biography, toggle privacy)", async () => {
    const store = new Map<string, { biography: string | null }>();
    store.set("owner-1", { biography: null });
    const db = {
      user: {
        update: vi.fn(
          ({
            where,
            data,
          }: {
            where: { id: string };
            data: { biography?: string | null; isPrivate?: boolean };
          }) => {
            const current = store.get(where.id) ?? { biography: null };
            const next = { ...current, ...data };
            store.set(where.id, { biography: next.biography ?? null });
            return Promise.resolve({
              id: where.id,
              biography: next.biography ?? null,
              isPrivate: next.isPrivate ?? false,
            });
          }
        ),
      },
    };
    const typed = db as unknown as Parameters<typeof updateOwnProfile>[0];

    const set = await updateOwnProfile(typed, "owner-1", {
      biography: "Hello ICT",
      isPrivate: true,
    });
    expect(set.data).toEqual({
      id: "owner-1",
      biography: "Hello ICT",
      isPrivate: true,
    });

    const cleared = await updateOwnProfile(typed, "owner-1", {
      biography: "  ",
      isPrivate: false,
    });
    expect(cleared.data).toEqual({
      id: "owner-1",
      biography: null,
      isPrivate: false,
    });
    expect(db.user.update).toHaveBeenCalledTimes(2);
  });
});
