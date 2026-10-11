import bcrypt from "bcryptjs";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({ auth: vi.fn(async () => null) }));
vi.mock("@/lib/db", () => ({ db: {} }));
vi.mock("@/lib/redis", () => ({ redis: {} }));
vi.mock("@/env", () => ({ env: { NODE_ENV: "test" } }));

type AccountRow = {
  id: string;
  email: string | null;
  password: string | null;
  emailVerified: Date | null;
};

function fakeAccountDb(rows: AccountRow[]) {
  const state = new Map(rows.map((row) => [row.id, { ...row }]));
  const db = {
    user: {
      findUnique: vi.fn(
        ({ where }: { where: { id?: string; email?: string } }) => {
          if (where.id !== undefined) {
            const row = state.get(where.id);
            return Promise.resolve(row ? { ...row } : null);
          }
          if (where.email !== undefined) {
            const row = [...state.values()].find(
              (candidate) => candidate.email === where.email
            );
            return Promise.resolve(row ? { ...row } : null);
          }
          return Promise.resolve(null);
        }
      ),
      update: vi.fn(
        ({
          data,
          where,
        }: {
          data: Record<string, unknown>;
          where: { id: string };
        }) => {
          const row = state.get(where.id);
          if (!row) {
            throw new Error("not found");
          }
          Object.assign(row, data);
          return Promise.resolve({ ...row });
        }
      ),
    },
  };
  return { db, state };
}

async function callerFor(
  db: ReturnType<typeof fakeAccountDb>["db"],
  user: { id: string; roles?: string[] } | null
) {
  const { appRouter } = await import("@/server/api/root");
  return appRouter.createCaller({
    db: db as never,
    headers: new Headers(),
    user: user as never,
  });
}

const learner = { id: "learner-a", roles: ["USER"] };

async function seedRows() {
  return [
    {
      id: "learner-a",
      email: "learner@example.com",
      password: await bcrypt.hash("Oldpass1", 10),
      emailVerified: new Date("2026-01-01T00:00:00.000Z"),
    },
    {
      id: "learner-b",
      email: "taken@example.com",
      password: await bcrypt.hash("Otherpass1", 10),
      emailVerified: new Date("2026-01-01T00:00:00.000Z"),
    },
    {
      id: "oauth-only",
      email: "oauth@example.com",
      password: null,
      emailVerified: new Date("2026-01-01T00:00:00.000Z"),
    },
  ];
}

describe("Settings account procedures (#84)", () => {
  it("reads the owner account status with the password flag", async () => {
    const { db } = fakeAccountDb(await seedRows());
    const caller = await callerFor(db, learner);
    const result = await caller.user.getAccount();
    expect(result).toEqual({
      success: true,
      data: {
        id: "learner-a",
        email: "learner@example.com",
        emailVerified: new Date("2026-01-01T00:00:00.000Z"),
        hasPassword: true,
      },
    });
  });

  it("normalizes email and resets verification on change", async () => {
    const { db } = fakeAccountDb(await seedRows());
    const caller = await callerFor(db, learner);
    const result = await caller.user.updateEmail({
      email: "  NEW@Example.COM  ",
    });
    expect(result).toEqual({
      success: true,
      data: {
        id: "learner-a",
        email: "new@example.com",
        emailVerified: null,
      },
    });
  });

  it("rejects a taken address with an inline conflict", async () => {
    const { db } = fakeAccountDb(await seedRows());
    const caller = await callerFor(db, learner);
    await expect(
      caller.user.updateEmail({ email: "TAKEN@example.com" })
    ).rejects.toMatchObject({ code: "CONFLICT" });
  });

  it("changes the password with current-password proof", async () => {
    const { db, state } = fakeAccountDb(await seedRows());
    const caller = await callerFor(db, learner);
    const result = await caller.user.updatePassword({
      currentPassword: "Oldpass1",
      newPassword: "Newpass99",
    });
    expect(result).toEqual({ success: true });
    await expect(
      bcrypt.compare("Newpass99", state.get("learner-a")?.password ?? "")
    ).resolves.toBe(true);
  });

  it("denies a wrong current password without touching the hash", async () => {
    const { db, state } = fakeAccountDb(await seedRows());
    const before = state.get("learner-a")?.password;
    const caller = await callerFor(db, learner);
    await expect(
      caller.user.updatePassword({
        currentPassword: "Wrongpass1",
        newPassword: "Newpass99",
      })
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    expect(state.get("learner-a")?.password).toBe(before);
  });

  it("rejects a weak new password with guidance", async () => {
    const { db } = fakeAccountDb(await seedRows());
    const caller = await callerFor(db, learner);
    await expect(
      caller.user.updatePassword({
        currentPassword: "Oldpass1",
        newPassword: "short",
      })
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(
      caller.user.setPassword({ newPassword: "allletters" })
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("lets an OAuth-only learner set a first password with no current field", async () => {
    const { db, state } = fakeAccountDb(await seedRows());
    const caller = await callerFor(db, {
      id: "oauth-only",
      roles: ["USER"],
    });
    const status = await caller.user.getAccount();
    expect(status.data.hasPassword).toBe(false);
    const result = await caller.user.setPassword({
      newPassword: "Firstpass1",
    });
    expect(result).toEqual({ success: true });
    await expect(
      bcrypt.compare("Firstpass1", state.get("oauth-only")?.password ?? "")
    ).resolves.toBe(true);
  });

  it("refuses set-password once a password already exists", async () => {
    const { db } = fakeAccountDb(await seedRows());
    const caller = await callerFor(db, learner);
    await expect(
      caller.user.setPassword({ newPassword: "Another11" })
    ).rejects.toMatchObject({ code: "CONFLICT" });
  });

  it("denies signed-out callers without leaking state", async () => {
    const { db } = fakeAccountDb(await seedRows());
    const anon = await callerFor(db, null);
    await expect(anon.user.getAccount()).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
    await expect(
      anon.user.updateEmail({ email: "x@example.com" })
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(
      anon.user.updatePassword({
        currentPassword: "Oldpass1",
        newPassword: "Newpass99",
      })
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(
      anon.user.setPassword({ newPassword: "Newpass99" })
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("answers FORBIDDEN when the owner row is missing (no probing)", async () => {
    const { db } = fakeAccountDb([]);
    const caller = await callerFor(db, learner);
    await expect(caller.user.getAccount()).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
    await expect(
      caller.user.updateEmail({ email: "x@example.com" })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});

describe("credential domain rules (#84)", () => {
  it("normalizes email case and whitespace, rejects bad shapes", async () => {
    const { normalizeEmail } = await import(
      "@/server/services/user-credentials"
    );
    expect(normalizeEmail("  NEW@Example.COM  ")).toBe("new@example.com");
    expect(() => normalizeEmail("not-an-email")).toThrowError(/valid email/i);
    expect(() => normalizeEmail("   ")).toThrowError(/valid email/i);
  });

  it("grades password strength with actionable guidance", async () => {
    const { assertStrongPassword } = await import(
      "@/server/services/user-credentials"
    );
    expect(() => assertStrongPassword("short")).toThrowError(
      /at least 8 characters/i
    );
    expect(() => assertStrongPassword("allletters")).toThrowError(
      /letter and a number/i
    );
    expect(() => assertStrongPassword("12345678")).toThrowError(
      /letter and a number/i
    );
    expect(assertStrongPassword("Goodpass1")).toBe("Goodpass1");
  });

  it("treats same-address resubmission as a no-op success", async () => {
    const { db } = fakeAccountDb(await seedRows());
    const caller = await callerFor(db, learner);
    const result = await caller.user.updateEmail({
      email: "learner@example.com",
    });
    expect(result.data.emailVerified).toEqual(
      new Date("2026-01-01T00:00:00.000Z")
    );
    expect(result.data).not.toHaveProperty("verificationRequired");
  });
});
