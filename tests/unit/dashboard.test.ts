import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({ auth: vi.fn(async () => null) }));
vi.mock("@/lib/db", () => ({ db: {} }));
vi.mock("@/lib/redis", () => ({
  redis: { incr: vi.fn(async () => 1), expire: vi.fn(async () => 1) },
}));
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

describe("Slice 5 — Dashboard rename (derived view over progress) (#62)", () => {
  it("enforces strict output contracts with no biography leak", async () => {
    const { dashboardOutputSchema } = await import(
      "@/server/schemas/dashboard"
    );

    const valid = {
      success: true,
      data: {
        userName: "learner-a",
        id: "learner-a",
        image: null,
        totalAchievements: 0,
        totalSubtopicsCompleted: 1,
        level: "Beginner",
        totalProgress: 12.5,
        progressData: [{ topic: "t", subtopics: ["s"] }],
      },
    };
    expect(dashboardOutputSchema.safeParse(valid).success).toBe(true);

    // Unknown keys fail loudly — a biography payload never validates.
    const withBio = {
      ...valid,
      data: { ...valid.data, biography: "hello", isPrivate: false },
    };
    expect(dashboardOutputSchema.safeParse(withBio).success).toBe(false);
  });

  it("keeps the dashboard shape field-identical to the legacy stats shape", async () => {
    const db = createFakeDb();
    const caller = await callerFor(db, learnerA);
    await caller.progress.create({
      topic: "introduction-to-html",
      subtopic: "html_introduction",
    });

    const { getStatsById } = await import("@/server/services/progress");
    const { getDashboardById } = await import("@/server/services/dashboard");

    const legacy = await getStatsById(db as never, learnerA.id);
    const next = await getDashboardById(db as never, learnerA.id);
    expect(next).toEqual(legacy);
    expect(Object.keys(next.data).sort()).toEqual(
      Object.keys(legacy.data).sort()
    );
    expect(next.data).not.toHaveProperty("biography");
  });

  it("serves the owner read round-trip plus by-id parity", async () => {
    const db = createFakeDb();
    const caller = await callerFor(db, learnerA);
    await caller.progress.create({
      topic: "introduction-to-html",
      subtopic: "html_introduction",
    });

    const mine = await caller.dashboard.getMyDashboard();
    expect(mine.success).toBe(true);
    expect(mine.data.totalSubtopicsCompleted).toBe(1);
    expect(mine.data.level).toBe("Beginner");
    expect(mine.data).not.toHaveProperty("biography");

    const pub = await callerFor(db, null);
    const byId = await pub.dashboard.getDashboardById({ id: learnerA.id });
    expect(byId).toEqual(mine);

    await expect(
      pub.dashboard.getDashboardById({ id: "missing" })
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
    await expect(pub.dashboard.getMyDashboard()).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });

  it("unmounts the legacy stats path and serves the versioned dashboard path", async () => {
    const { appRouter } = await import("@/server/api/root");
    const router = appRouter as unknown as Record<
      string,
      Record<string, unknown>
    >;
    expect(router.dashboard).toBeDefined();
    expect(router.dashboard?.getMyDashboard).toBeDefined();
    expect(router.dashboard?.getDashboardById).toBeDefined();

    // Legacy procedures are gone with no shim.
    expect(router.progress?.getMyStats).toBeUndefined();
    expect(router.progress?.getStatsById).toBeUndefined();
    expect(router.user?.getUserStatsById).toBeUndefined();

    // Progress router keeps list/create/delete-only.
    expect(router.progress?.list).toBeDefined();
    expect(router.progress?.create).toBeDefined();
    expect(router.progress?.deleteAll).toBeDefined();

    const userSrc = read("src/server/api/routers/user.ts");
    expect(userSrc).not.toContain("/v1/users/{id}/stats");
    expect(userSrc).not.toContain("getUserStatsById");
    const progressSrc = read("src/server/api/routers/progress.ts");
    expect(progressSrc).not.toContain("getMyStats");
    expect(progressSrc).not.toContain("getStatsById");

    const { buildOpenApiDocument } = await import("@/server/api/openapi");
    const document = buildOpenApiDocument(
      "http://localhost:3000"
    ) as unknown as { paths?: Record<string, unknown> };
    const flat = JSON.stringify(document.paths ?? {});
    expect(flat).toContain("/v1/dashboard/{id}");
    expect(flat).not.toContain("/v1/users/{id}/stats");
  });

  it("feeds the owner page plus the public share link from the dashboard router with fresh reads", async () => {
    const owner = read("src/app/(app)/progress/page.tsx");
    expect(owner).toContain("api.dashboard.getMyDashboard");
    expect(owner).not.toContain("getMyStats");
    expect(owner).not.toContain('"use cache"');

    const shareRel = "src/app/(marketing)/dashboard/[id]/page.tsx";
    const share = read(shareRel);
    expect(share).toContain("api.dashboard.getDashboardById");
    expect(share).toContain('data-testid="dashboard-share"');
    expect(share).not.toContain('"use cache"');

    const routes = await import("@/routes");
    expect(routes.isPublicDashboardShare("/dashboard/learner-a")).toBe(true);
    expect(routes.isPublicDashboardShare("/progress")).toBe(false);

    const proxySrc = read("src/proxy.ts");
    expect(proxySrc).toContain("isPublicDashboardShare");

    // Dashboard reads stay network-only: the versioned mount is deny-listed
    // in the worker policy and the static precache holds public files only.
    const policy = read("src/sw-policy.ts");
    expect(policy).toContain("/api/v1");
    expect(policy).not.toContain("/api/v1/dashboard");
    for (const url of ["/dashboard", "/dashboard/learner-a"]) {
      expect(policy).not.toContain(`"${url}"`);
    }
    const rest = read("src/app/api/v1/[...rest]/route.ts");
    expect(rest).toMatch(/no-store|private/);
  });
});
