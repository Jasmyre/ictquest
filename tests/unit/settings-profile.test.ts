import { describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({ auth: vi.fn(async () => null) }));
vi.mock("@/lib/db", () => ({ db: {} }));
vi.mock("@/lib/redis", () => ({ redis: {} }));
vi.mock("@/env", () => ({ env: { NODE_ENV: "test" } }));

function fakeProfileDb(
  row: {
    id: string;
    name: string;
    userName: string | null;
    biography: string | null;
    isPrivate: boolean;
  } | null
) {
  const state = row ? { ...row } : null;
  return {
    db: {
      user: {
        findUnique: vi.fn(() => Promise.resolve(state ? { ...state } : null)),
        update: vi.fn(
          ({
            data,
            where,
          }: {
            data: Record<string, unknown>;
            where: { id: string };
          }) => {
            if (!state || state.id !== where.id) {
              throw new Error("not found");
            }
            Object.assign(state, data);
            return Promise.resolve({ ...state });
          }
        ),
      },
    },
  };
}

async function callerFor(
  db: ReturnType<typeof fakeProfileDb>["db"],
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

const seedRow = {
  id: "learner-a",
  name: "Learner A",
  userName: "learner-a",
  biography: null as string | null,
  isPrivate: false,
};

describe("Settings profile procedures (#82)", () => {
  it("reads the owner profile round-trip", async () => {
    const { db } = fakeProfileDb(seedRow);
    const caller = await callerFor(db, learner);
    const result = await caller.user.getProfile();
    expect(result).toEqual({
      success: true,
      data: { ...seedRow },
    });
  });

  it("sets and clears biography while toggling privacy", async () => {
    const { db } = fakeProfileDb(seedRow);
    const caller = await callerFor(db, learner);

    const set = await caller.user.updateProfile({
      biography: "  I love ICT  ",
      isPrivate: true,
    });
    expect(set.data).toMatchObject({
      id: "learner-a",
      biography: "I love ICT",
      isPrivate: true,
    });

    const cleared = await caller.user.updateProfile({
      biography: "",
      isPrivate: false,
    });
    expect(cleared.data).toMatchObject({
      biography: null,
      isPrivate: false,
    });
  });

  it("updates display name and handle", async () => {
    const { db } = fakeProfileDb(seedRow);
    const caller = await callerFor(db, learner);
    const result = await caller.user.updateProfile({
      name: "  New Name  ",
      userName: "new-handle",
    });
    expect(result.data).toMatchObject({
      name: "New Name",
      userName: "new-handle",
    });
  });

  it("rejects over-long biography with inline validation", async () => {
    const { db } = fakeProfileDb(seedRow);
    const caller = await callerFor(db, learner);
    await expect(
      caller.user.updateProfile({ biography: "a".repeat(501) })
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("denies signed-out callers without leaking state", async () => {
    const { db } = fakeProfileDb(seedRow);
    const anon = await callerFor(db, null);
    await expect(anon.user.getProfile()).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
    await expect(
      anon.user.updateProfile({ biography: "hi" })
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("answers FORBIDDEN when the owner row is missing (no probing)", async () => {
    const { db } = fakeProfileDb(null);
    const caller = await callerFor(db, learner);
    await expect(caller.user.getProfile()).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
    await expect(
      caller.user.updateProfile({ biography: "hi" })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
