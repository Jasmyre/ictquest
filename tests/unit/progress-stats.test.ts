import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({ auth: vi.fn(async () => null) }));
vi.mock("@/lib/db", () => ({ db: {} }));
vi.mock("@/lib/redis", () => ({ redis: {} }));
vi.mock("@/env", () => ({ env: { NODE_ENV: "test" } }));

const ROOT = join(__dirname, "..", "..");

function read(rel: string): string {
  return readFileSync(join(ROOT, rel), "utf8");
}

type ProgressRow = {
  id: string;
  userId: string;
  topic: string;
  subtopics: string[];
};

function createFakeDb() {
  const rows: ProgressRow[] = [];
  let seq = 0;

  const progressData = {
    findFirst(args: {
      where: { userId: string; topic: string };
    }): Promise<ProgressRow | null> {
      return Promise.resolve(
        rows.find(
          (r) => r.userId === args.where.userId && r.topic === args.where.topic
        ) ?? null
      );
    },
    findMany(args: {
      where: { userId: string };
      skip?: number;
      take?: number;
    }): Promise<ProgressRow[]> {
      const owned = rows.filter((r) => r.userId === args.where.userId);
      const skip = args.skip ?? 0;
      const take = args.take ?? owned.length;
      return Promise.resolve(owned.slice(skip, skip + take));
    },
    create(args: {
      data: { userId: string; topic: string; subtopics: string[] };
    }): Promise<ProgressRow> {
      seq += 1;
      const row: ProgressRow = {
        id: `progress-${seq}`,
        userId: args.data.userId,
        topic: args.data.topic,
        subtopics: [...args.data.subtopics],
      };
      rows.push(row);
      return Promise.resolve(row);
    },
    update(args: {
      where: { id: string };
      data: { subtopics: { push: string } };
    }): Promise<ProgressRow> {
      const row = rows.find((r) => r.id === args.where.id);
      if (!row) {
        throw new Error("not found");
      }
      row.subtopics.push(args.data.subtopics.push);
      return Promise.resolve(row);
    },
    deleteMany(args: {
      where: { userId: string };
    }): Promise<{ count: number }> {
      const before = rows.length;
      for (let i = rows.length - 1; i >= 0; i -= 1) {
        if (rows[i]?.userId === args.where.userId) {
          rows.splice(i, 1);
        }
      }
      return Promise.resolve({ count: before - rows.length });
    },
  };

  const user = {
    findUnique(_args: { where: { id: string } }) {
      const id = _args.where.id;
      if (id === "missing") {
        return Promise.resolve(null);
      }
      const owned = rows.filter((r) => r.userId === id);
      return Promise.resolve({
        id,
        userName: `learner-${id}`,
        image: null,
        userAchievements: [],
        progressData: owned.map((r) => ({
          topic: r.topic,
          subtopics: [...r.subtopics],
        })),
      });
    },
  };

  return { progressData, user };
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

describe("Migration 12 — Progress writes plus stats router", () => {
  it("exposes list/create/delete-only progress plus the dashboard router", async () => {
    const { appRouter } = await import("@/server/api/root");
    const router = appRouter as unknown as Record<string, unknown>;
    expect(router.progress).toBeDefined();
    // Slice 5 (#62): stats moved to the dashboard derived view.
    expect(router.dashboard).toBeDefined();

    const src = read("src/server/api/root.ts");
    expect(src).toContain("progressRouter");
    expect(src).toContain("dashboardRouter");
  });

  it("persists list/create/delete per user and survives re-login", async () => {
    const db = createFakeDb();

    // Fresh login: empty list.
    const firstLogin = await callerFor(db, learnerA);
    await expect(firstLogin.progress.list({})).resolves.toMatchObject({
      success: true,
      data: [],
    });

    // Complete a Subtopic-Step.
    const created = await firstLogin.progress.create({
      topic: "introduction-to-html",
      subtopic: "html_introduction",
    });
    expect(created.success).toBe(true);

    // Simulate re-login with a new caller for the same user: data survives.
    const secondLogin = await callerFor(db, learnerA);
    const listed = await secondLogin.progress.list({});
    expect(listed.success).toBe(true);
    expect(listed.data).toHaveLength(1);
    expect(listed.data[0]).toMatchObject({
      userId: learnerA.id,
      topic: "introduction-to-html",
      subtopics: ["html_introduction"],
    });

    // Delete flow clears only this user's rows.
    await secondLogin.progress.deleteAll();
    const thirdLogin = await callerFor(db, learnerA);
    await expect(thirdLogin.progress.list({})).resolves.toMatchObject({
      success: true,
      data: [],
    });
  });

  it("isolates progress per user", async () => {
    const db = createFakeDb();
    const callerA = await callerFor(db, learnerA);
    const callerB = await callerFor(db, learnerB);

    await callerA.progress.create({
      topic: "html-elements",
      subtopic: "html_typography",
    });

    await expect(callerB.progress.list({})).resolves.toMatchObject({
      success: true,
      data: [],
    });
    const listedA = await callerA.progress.list({});
    expect(listedA.data).toHaveLength(1);

    // B deleting must not touch A.
    await callerB.progress.deleteAll();
    const listedAAfter = await callerA.progress.list({});
    expect(listedAAfter.data).toHaveLength(1);
  });

  it("treats repeat completion of the same Subtopic-Step as idempotent", async () => {
    const db = createFakeDb();
    const caller = await callerFor(db, learnerA);

    await caller.progress.create({
      topic: "introduction-to-html",
      subtopic: "html_introduction",
    });
    await caller.progress.create({
      topic: "introduction-to-html",
      subtopic: "html_introduction",
    });
    const listed = await caller.progress.list({});
    expect(listed.data).toHaveLength(1);
    expect(listed.data[0]?.subtopics).toEqual(["html_introduction"]);

    // A second distinct subtopic appends to the same topic row.
    await caller.progress.create({
      topic: "introduction-to-html",
      subtopic: "html_brief_examples",
    });
    const listed2 = await caller.progress.list({});
    expect(listed2.data).toHaveLength(1);
    expect(listed2.data[0]?.subtopics).toEqual([
      "html_introduction",
      "html_brief_examples",
    ]);
  });

  it("serves accurate stats plus completion counts end to end", async () => {
    const db = createFakeDb();
    const caller = await callerFor(db, learnerA);

    await caller.progress.create({
      topic: "introduction-to-html",
      subtopic: "html_introduction",
    });

    const stats = await caller.dashboard.getMyDashboard();
    expect(stats.success).toBe(true);
    expect(stats.data.totalSubtopicsCompleted).toBe(1);
    expect(stats.data.totalAchievements).toBe(0);
    expect(stats.data.level).toBe("Beginner");
    expect(stats.data.totalProgress).toBeGreaterThan(0);
    expect(stats.data.progressData).toHaveLength(1);

    // Public stats by id mirror the same computed shape.
    const pub = await import("@/server/api/root").then((m) =>
      m.appRouter.createCaller({
        db: db as never,
        headers: new Headers(),
        user: null as never,
      })
    );
    const byId = await pub.dashboard.getDashboardById({ id: learnerA.id });
    expect(byId.success).toBe(true);
    expect(byId.data.totalSubtopicsCompleted).toBe(1);
    expect(byId.data.level).toBe("Beginner");

    await expect(
      pub.dashboard.getDashboardById({ id: "missing" })
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  it("denies anonymous callers on private progress flows", async () => {
    const db = createFakeDb();
    const anon = await callerFor(db, null);

    await expect(anon.progress.list({})).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
    await expect(
      anon.progress.create({ topic: "t", subtopic: "s" })
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(anon.progress.deleteAll()).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
    await expect(anon.dashboard.getMyDashboard()).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });

  it("keeps legacy user progress aliases fed by the same service", async () => {
    const db = createFakeDb();
    const caller = await callerFor(db, learnerA);

    await caller.progress.create({
      topic: "html-elements",
      subtopic: "html_containers",
    });

    const viaUser = await caller.user.getUserProgress({});
    const viaProgress = await caller.progress.list({});
    expect(viaUser).toEqual(viaProgress);

    const statsViaDashboard = await caller.dashboard.getDashboardById({
      id: learnerA.id,
    });
    const statsViaOwner = await caller.dashboard.getMyDashboard();
    expect(statsViaDashboard).toEqual(statsViaOwner);

    const userSrc = read("src/server/api/routers/user.ts");
    expect(userSrc).toContain("listProgress");
    expect(userSrc).toContain("createProgress");
    expect(userSrc).toContain("deleteAllProgress");
    // Slice 5 (#62): legacy stats alias deleted with the rename.
    expect(userSrc).not.toContain("getStatsById");
    expect(userSrc).not.toContain("getUserStatsById");
  });

  it("feeds the progress dashboard from the dashboard router with fresh reads", () => {
    const page = read("src/app/(app)/progress/page.tsx");
    expect(page).toContain("api.progress.list");
    expect(page).toContain("api.dashboard.getMyDashboard");
    expect(page).toContain('data-testid="progress-stats"');
    expect(page).toContain('data-testid="stat-subtopics"');
    expect(page).toContain('data-testid="stat-total-progress"');
    // Per-user stats must stay fresh (ADR 0005): no long cache on the page.
    expect(page).not.toContain('"use cache"');
  });
});
