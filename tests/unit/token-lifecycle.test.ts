import { describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({ auth: vi.fn(async () => null) }));
vi.mock("@/lib/db", () => ({ db: {} }));
vi.mock("@/lib/redis", () => ({ redis: {} }));
vi.mock("@/env", () => ({ env: { NODE_ENV: "test" } }));

type PatRow = {
  id: string;
  userId: string;
  name: string;
  tokenHash: string;
  scopes: string[];
  expiresAt: Date | null;
  lastUsedAt: Date | null;
  createdAt: Date;
  revokedAt: Date | null;
};

function fakePatDb() {
  const rows: PatRow[] = [];
  return {
    rows,
    personalAccessToken: {
      create(args: {
        data: Omit<PatRow, "id" | "createdAt" | "lastUsedAt" | "revokedAt"> &
          Partial<Pick<PatRow, "lastUsedAt" | "revokedAt">>;
      }) {
        const row: PatRow = {
          id: `pat-${rows.length + 1}`,
          createdAt: new Date(),
          lastUsedAt: null,
          revokedAt: null,
          ...args.data,
        };
        rows.push(row);
        return Promise.resolve(row);
      },
      findUnique(args: { where: { tokenHash: string } }) {
        return Promise.resolve(
          rows.find((r) => r.tokenHash === args.where.tokenHash) ?? null
        );
      },
      findFirst(args: { where: { id: string; userId: string } }) {
        return Promise.resolve(
          rows.find(
            (r) => r.id === args.where.id && r.userId === args.where.userId
          ) ?? null
        );
      },
      findMany(args: { where: { userId: string } }) {
        return Promise.resolve(
          rows.filter((r) => r.userId === args.where.userId)
        );
      },
      update(args: { where: { id: string }; data: Partial<PatRow> }) {
        const row = rows.find((r) => r.id === args.where.id);
        if (!row) {
          throw new Error("not found");
        }
        Object.assign(row, args.data);
        return Promise.resolve(row);
      },
    },
  };
}

describe("shared server helpers (code-review standards fixes)", () => {
  it("pickPagination defaults skip/take and honors overrides", async () => {
    const { pickPagination } = await import("@/server/pagination");
    expect(pickPagination({})).toEqual({ skip: 0, take: 20 });
    expect(pickPagination({ skip: 5, take: 7 })).toEqual({ skip: 5, take: 7 });
  });

  it("isUniqueConstraintRace narrows Prisma P2002 without assertions", async () => {
    const { isUniqueConstraintRace } = await import("@/server/prisma-errors");
    expect(isUniqueConstraintRace({ code: "P2002" })).toBe(true);
    expect(isUniqueConstraintRace({ code: "P2025" })).toBe(false);
    expect(isUniqueConstraintRace(null)).toBe(false);
    expect(isUniqueConstraintRace("P2002")).toBe(false);
  });

  it("requireUserId narrows the session user instead of asserting", async () => {
    const { requireUserId } = await import("@/server/api/trpc");
    expect(requireUserId({ id: "u-1" })).toBe("u-1");
    await expect((async () => requireUserId({}))()).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
    await expect((async () => requireUserId(null))()).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });
});

describe("PAT token lifecycle (spec #57: owner-scoped, idempotent revoke)", () => {
  it("lists only the caller's tokens and never exposes the hash", async () => {
    const mod = await import("@/server/auth/personal-access-tokens");
    const db = fakePatDb();
    const a = await mod.mintPersonalAccessToken(db as never, "user-a", {
      name: "a-token",
    });
    await mod.mintPersonalAccessToken(db as never, "user-b", {
      name: "b-token",
    });
    expect(a.plainToken.length).toBeGreaterThan(16);

    const listed = await mod.listPersonalAccessTokens(db as never, "user-a");
    expect(listed).toHaveLength(1);
    expect(listed[0]?.name).toBe("a-token");
    expect(listed[0]).not.toHaveProperty("tokenHash");
    expect(listed[0]).not.toHaveProperty("plainToken");
  });

  it("revoke is idempotent and owner-scoped; verify fails after revoke", async () => {
    const mod = await import("@/server/auth/personal-access-tokens");
    const db = fakePatDb();
    const minted = await mod.mintPersonalAccessToken(db as never, "user-a", {
      name: "a-token",
    });

    const first = await mod.revokePersonalAccessToken(
      db as never,
      "user-a",
      minted.record.id
    );
    expect(first.revokedAt).toBeInstanceOf(Date);

    // Revoking twice is safe: no throw, same revoked row.
    const second = await mod.revokePersonalAccessToken(
      db as never,
      "user-a",
      minted.record.id
    );
    expect(second.revokedAt).toBeInstanceOf(Date);

    await expect(
      mod.verifyPersonalAccessToken(db as never, minted.plainToken)
    ).resolves.toBeNull();

    // Another user's token is not revocable (anti-probing: FORBIDDEN).
    const foreign = await mod.mintPersonalAccessToken(db as never, "user-b", {
      name: "b-token",
    });
    await expect(
      mod.revokePersonalAccessToken(db as never, "user-a", foreign.record.id)
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("verify fails closed on expired tokens", async () => {
    const mod = await import("@/server/auth/personal-access-tokens");
    const db = fakePatDb();
    const minted = await mod.mintPersonalAccessToken(db as never, "user-a", {
      name: "short-lived",
      expiresAt: new Date(Date.now() - 1000),
    });
    await expect(
      mod.verifyPersonalAccessToken(db as never, minted.plainToken)
    ).resolves.toBeNull();
  });

  it("exposes the lifecycle on the tRPC token router mounted in root", async () => {
    const { appRouter } = await import("@/server/api/root");
    expect(appRouter.token).toBeDefined();

    function callerFor(user: unknown, database: unknown) {
      return appRouter.createCaller({
        db: database as never,
        headers: new Headers(),
        user: user as never,
      });
    }

    const db = fakePatDb();
    const learnerA = { id: "user-a", roles: ["USER"] };
    const callerA = callerFor(learnerA, db);

    await expect(callerFor(null, db).token.list()).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });

    // Role-less users hold no grant: denied every check (FORBIDDEN).
    await expect(
      callerFor({ id: "user-a", roles: [] }, db).token.list()
    ).rejects.toMatchObject({ code: "FORBIDDEN" });

    const created = await callerA.token.create({ name: "ci-token" });
    expect(created.data.plainToken.length).toBeGreaterThan(16);

    const listed = await callerA.token.list();
    expect(listed.data.map((t) => t.name)).toContain("ci-token");
    for (const token of listed.data) {
      expect(token).not.toHaveProperty("tokenHash");
    }

    const createdId = listed.data.find((t) => t.name === "ci-token")?.id;
    expect(createdId).toBeDefined();
    await expect(
      callerA.token.revoke({ id: createdId ?? "" })
    ).resolves.toMatchObject({ success: true });
    // Second revoke stays safe through the router too.
    await expect(
      callerA.token.revoke({ id: createdId ?? "" })
    ).resolves.toMatchObject({ success: true });

    // Cross-owner revoke is FORBIDDEN, never NOT_FOUND (anti-probing).
    const callerB = callerFor({ id: "user-b", roles: ["USER"] }, db);
    await expect(
      callerB.token.revoke({ id: createdId ?? "" })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
