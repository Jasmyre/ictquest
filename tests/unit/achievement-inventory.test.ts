import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({ auth: vi.fn(async () => null) }));
vi.mock("@/lib/db", () => ({ db: {} }));
vi.mock("@/lib/redis", () => ({ redis: {} }));
vi.mock("@/env", () => ({ env: { NODE_ENV: "test" } }));

const ROOT = join(__dirname, "..", "..");

const POST_MODEL_RE = /model Post\b/;

function read(rel: string): string {
  return readFileSync(join(ROOT, rel), "utf8");
}

type AchievementRow = {
  id: number;
  name: string;
  description: string | null;
};

type UnlockRow = {
  id: number;
  userId: string;
  achievementId: number;
  achievementName: string;
  achievementDescription: string;
};

function createFakeDb() {
  const definitions: AchievementRow[] = [
    { id: 1, name: "Newbie", description: "Complete your first lesson" },
    { id: 2, name: "Beginner", description: "Reach beginner progress" },
  ];
  const unlocks: UnlockRow[] = [];
  let seq = 0;

  const achievement = {
    findUnique(args: {
      where: { name: string };
    }): Promise<AchievementRow | null> {
      return Promise.resolve(
        definitions.find((d) => d.name === args.where.name) ?? null
      );
    },
  };

  const userAchievement = {
    findMany(args: {
      where: { userId: string };
      include?: unknown;
      skip?: number;
      take?: number;
    }): Promise<Array<UnlockRow & { achievement: AchievementRow }>> {
      const owned = unlocks.filter((u) => u.userId === args.where.userId);
      const skip = args.skip ?? 0;
      const take = args.take ?? owned.length;
      return Promise.resolve(
        owned.slice(skip, skip + take).map((u) => ({
          ...u,
          achievement: definitions.find((d) => d.id === u.achievementId) ?? {
            id: u.achievementId,
            name: u.achievementName,
            description: u.achievementDescription,
          },
        }))
      );
    },
    findUnique(args: {
      where: {
        userId_achievementId: { userId: string; achievementId: number };
      };
    }): Promise<UnlockRow | null> {
      const { userId, achievementId } = args.where.userId_achievementId;
      return Promise.resolve(
        unlocks.find(
          (u) => u.userId === userId && u.achievementId === achievementId
        ) ?? null
      );
    },
    create(args: {
      data: {
        userId: string;
        achievementId: number;
        achievementName: string;
        achievementDescription: string;
      };
    }): Promise<UnlockRow> {
      const dupe = unlocks.find(
        (u) =>
          u.userId === args.data.userId &&
          u.achievementId === args.data.achievementId
      );
      if (dupe) {
        // Mirror Prisma unique-constraint race so the service P2002 path runs.
        const err = Object.assign(new Error("Unique constraint failed"), {
          code: "P2002",
          name: "PrismaClientKnownRequestError",
        });
        throw err;
      }
      seq += 1;
      const row: UnlockRow = { id: seq, ...args.data };
      unlocks.push(row);
      return Promise.resolve(row);
    },
    deleteMany(args: {
      where: { userId: string };
    }): Promise<{ count: number }> {
      const before = unlocks.length;
      for (let i = unlocks.length - 1; i >= 0; i -= 1) {
        if (unlocks[i]?.userId === args.where.userId) {
          unlocks.splice(i, 1);
        }
      }
      return Promise.resolve({ count: before - unlocks.length });
    },
  };

  return { achievement, userAchievement };
}

async function callerFor(
  db: ReturnType<typeof createFakeDb>,
  user: { id: string; roles?: string[] } | null
) {
  const { appRouter } = await import("@/server/api/root");
  return appRouter.createCaller({
    db: db as never,
    headers: new Headers(),
    user: user as never,
  });
}

const learnerA = { id: "learner-a", roles: ["USER"] };
const learnerB = { id: "learner-b", roles: ["USER"] };

describe("Migration 13 — Achievements plus Post deletion", () => {
  it("exposes an achievement router and no post router or model", async () => {
    const { appRouter } = await import("@/server/api/root");
    const router = appRouter as unknown as Record<string, unknown>;
    expect(router.achievement).toBeDefined();
    expect(router.post).toBeUndefined();

    const rootSrc = read("src/server/api/root.ts");
    expect(rootSrc).toContain("achievementRouter");
    expect(rootSrc).not.toContain("postRouter");
    expect(rootSrc).not.toContain("post:");

    const schema = read("prisma/schema.prisma");
    expect(schema).not.toMatch(POST_MODEL_RE);

    let postRouterExists = true;
    try {
      read("src/server/api/routers/post.ts");
    } catch {
      postRouterExists = false;
    }
    expect(postRouterExists).toBe(false);
  });

  it("unlocks then lists per user and survives re-login (unlock-to-inventory)", async () => {
    const db = createFakeDb();

    const firstLogin = await callerFor(db, learnerA);
    await expect(firstLogin.achievement.list({})).resolves.toMatchObject({
      success: true,
      data: [],
    });

    const unlocked = await firstLogin.achievement.unlock({
      achievementName: "Newbie",
    });
    expect(unlocked.success).toBe(true);
    expect(unlocked.data.status).toBe("new");

    // Simulate re-login with a new caller: the inventory survives.
    const secondLogin = await callerFor(db, learnerA);
    const listed = await secondLogin.achievement.list({});
    expect(listed.success).toBe(true);
    expect(listed.data).toHaveLength(1);
    expect(listed.data[0]).toMatchObject({
      userId: learnerA.id,
      achievementName: "Newbie",
    });

    // Delete flow clears only this user's inventory.
    await secondLogin.achievement.deleteAll();
    const thirdLogin = await callerFor(db, learnerA);
    await expect(thirdLogin.achievement.list({})).resolves.toMatchObject({
      success: true,
      data: [],
    });
  });

  it("isolates achievement inventory per user", async () => {
    const db = createFakeDb();
    const callerA = await callerFor(db, learnerA);
    const callerB = await callerFor(db, learnerB);

    await callerA.achievement.unlock({ achievementName: "Newbie" });

    await expect(callerB.achievement.list({})).resolves.toMatchObject({
      success: true,
      data: [],
    });
    const listedA = await callerA.achievement.list({});
    expect(listedA.data).toHaveLength(1);

    await callerB.achievement.deleteAll();
    const listedAAfter = await callerA.achievement.list({});
    expect(listedAAfter.data).toHaveLength(1);
  });

  it("treats repeat unlocks as idempotent", async () => {
    const db = createFakeDb();
    const caller = await callerFor(db, learnerA);

    await caller.achievement.unlock({ achievementName: "Newbie" });
    const second = await caller.achievement.unlock({
      achievementName: "Newbie",
    });
    expect(second.success).toBe(true);
    expect(second.data.status).toBe("unlocked");

    const listed = await caller.achievement.list({});
    expect(listed.data).toHaveLength(1);
  });

  it("returns NOT_FOUND for unknown achievement names", async () => {
    const db = createFakeDb();
    const caller = await callerFor(db, learnerA);

    await expect(
      caller.achievement.unlock({ achievementName: "DoesNotExist" })
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  it("denies anonymous callers on private achievement flows", async () => {
    const db = createFakeDb();
    const anon = await callerFor(db, null);

    await expect(anon.achievement.list({})).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
    await expect(
      anon.achievement.unlock({ achievementName: "Newbie" })
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(anon.achievement.deleteAll()).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });

  it("keeps legacy user achievement aliases fed by the same service", async () => {
    const db = createFakeDb();
    const caller = await callerFor(db, learnerA);

    await caller.achievement.unlock({ achievementName: "Newbie" });

    const viaUser = await caller.user.getUserAchievements({});
    const viaAchievement = await caller.achievement.list({});
    expect(viaUser).toEqual(viaAchievement);

    const userSrc = read("src/server/api/routers/user.ts");
    expect(userSrc).toContain("listAchievements");
    expect(userSrc).toContain("unlockAchievement");
    expect(userSrc).toContain("deleteAllAchievements");
  });

  it("renders the profile inventory from the achievement router with a stable testid", () => {
    const page = read("src/app/(app)/profile/page.tsx");
    expect(page).toContain("api.achievement.list");
    expect(page).toContain("AchievementsCard");

    // Single testid owner (card, both branches): exactly one node per branch.
    const card = read("src/components/pages/profile/achievements-card.tsx");
    expect(card).toContain('data-testid="achievement-inventory"');
    expect(page).not.toContain('data-testid="achievement-inventory"');
  });
});
