import { readdirSync, readFileSync } from "node:fs";
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

type AchievementDef = {
  id: number;
  name: string;
  description: string | null;
};

function createFakeDb() {
  const definitions: AchievementDef[] = [
    { id: 1, name: "Newbie", description: "First steps" },
  ];
  let seq = 1;

  const achievement = {
    findMany(args: { skip?: number; take?: number } = {}) {
      const skip = args.skip ?? 0;
      const take = args.take ?? definitions.length;
      return Promise.resolve(
        [...definitions].sort((a, b) => a.id - b.id).slice(skip, skip + take)
      );
    },
    findUnique(args: { where: { id?: number; name?: string } }) {
      if (typeof args.where.id === "number") {
        return Promise.resolve(
          definitions.find((d) => d.id === args.where.id) ?? null
        );
      }
      if (typeof args.where.name === "string") {
        return Promise.resolve(
          definitions.find((d) => d.name === args.where.name) ?? null
        );
      }
      return Promise.resolve(null);
    },
    create(args: { data: { name: string; description?: string | null } }) {
      if (definitions.some((d) => d.name === args.data.name)) {
        throw Object.assign(new Error("Unique constraint failed"), {
          code: "P2002",
        });
      }
      seq += 1;
      const row: AchievementDef = {
        id: seq,
        name: args.data.name,
        description: args.data.description ?? null,
      };
      definitions.push(row);
      return Promise.resolve(row);
    },
    update(args: {
      where: { id: number };
      data: { name?: string; description?: string | null };
    }) {
      const row = definitions.find((d) => d.id === args.where.id);
      if (!row) {
        throw Object.assign(new Error("Not found"), { code: "P2025" });
      }
      if (
        typeof args.data.name === "string" &&
        definitions.some((d) => d.id !== row.id && d.name === args.data.name)
      ) {
        throw Object.assign(new Error("Unique constraint failed"), {
          code: "P2002",
        });
      }
      if (typeof args.data.name === "string") {
        row.name = args.data.name;
      }
      if ("description" in args.data) {
        row.description = args.data.description ?? null;
      }
      return Promise.resolve({ ...row });
    },
    delete(args: { where: { id: number } }) {
      const idx = definitions.findIndex((d) => d.id === args.where.id);
      if (idx === -1) {
        throw Object.assign(new Error("Not found"), { code: "P2025" });
      }
      const [removed] = definitions.splice(idx, 1);
      return Promise.resolve(removed);
    },
  };

  // Minimal stubs so the shared admin service module loads; lesson content
  // reads the real MDX store and never touches these.
  const stub = {
    findMany: () => Promise.resolve([]),
    findUnique: () => Promise.resolve(null),
  };

  return {
    user: stub,
    role: stub,
    userRoleAssignment: stub,
    progressData: stub,
    achievement,
    userAchievement: stub,
    __debug: { definitions },
  };
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

const adminUser = { id: "admin-1", roles: ["ADMIN", "USER"] };
const learnerUser = { id: "learner-a", roles: ["USER"] };

function countMdxFiles(): number {
  const contentDir = join(ROOT, "content", "lessons");
  let count = 0;
  for (const lesson of readdirSync(contentDir, { withFileTypes: true })) {
    if (!lesson.isDirectory()) {
      continue;
    }
    for (const file of readdirSync(join(contentDir, lesson.name))) {
      if (file.endsWith(".mdx")) {
        count += 1;
      }
    }
  }
  return count;
}

describe("Migration 15 — Admin lessons plus achievements content", () => {
  it("exposes admin-gated lesson plus achievement-definition procedures", async () => {
    const { appRouter } = await import("@/server/api/root");
    const admin = (appRouter as unknown as { admin: Record<string, unknown> })
      .admin;
    for (const proc of [
      "listLessonContent",
      "listAchievementDefinitions",
      "createAchievementDefinition",
      "updateAchievementDefinition",
      "deleteAchievementDefinition",
    ]) {
      expect(admin[proc], proc).toBeDefined();
    }

    const src = read("src/server/api/routers/admin.ts");
    expect(src).toContain("adminProcedure");
    expect(src).toContain("listLessonContent");
    expect(src).toContain("listAchievementDefinitions");
    expect(src).toContain("createAchievementDefinition");
    expect(src).toContain("updateAchievementDefinition");
    expect(src).toContain("deleteAchievementDefinition");
    // Lesson content stays read-only: curriculum is dev-authored MDX in git,
    // so the admin seam must not grow runtime lesson-write mutations.
    expect(src).not.toContain("createLesson");
    expect(src).not.toContain("updateLesson");
    expect(src).not.toContain("deleteLesson");
  });

  it("denies non-admins at the procedure seam and anon at auth seam", async () => {
    const db = createFakeDb();
    const admin = await callerFor(db, adminUser);
    const learner = await callerFor(db, learnerUser);
    const anon = await callerFor(db, null);

    await expect(admin.admin.listLessonContent()).resolves.toMatchObject({
      success: true,
    });
    await expect(
      admin.admin.listAchievementDefinitions({})
    ).resolves.toMatchObject({ success: true });

    for (const call of [
      () => learner.admin.listLessonContent(),
      () => learner.admin.listAchievementDefinitions({}),
      () =>
        learner.admin.createAchievementDefinition({
          name: "Nope",
          description: "denied",
        }),
      () =>
        learner.admin.updateAchievementDefinition({
          id: 1,
          description: "denied",
        }),
      () => learner.admin.deleteAchievementDefinition({ id: 1 }),
    ]) {
      await expect(call()).rejects.toMatchObject({ code: "FORBIDDEN" });
    }

    for (const call of [
      () => anon.admin.listLessonContent(),
      () => anon.admin.listAchievementDefinitions({}),
      () =>
        anon.admin.createAchievementDefinition({
          name: "Nope",
          description: "denied",
        }),
    ]) {
      await expect(call()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    }
  });

  it("lists lesson content from the MDX-backed store with stable slugs", async () => {
    const db = createFakeDb();
    const admin = await callerFor(db, adminUser);

    const result = await admin.admin.listLessonContent();
    expect(result.success).toBe(true);
    const entries = result.data as {
      lesson: string;
      subtopic: string;
      slug: string;
      title: string;
      order: number;
      file: string;
    }[];

    // One entry per MDX file on disk — the admin view reads the same store
    // the learner routes render, so progress keys keep matching.
    expect(entries.length).toBe(countMdxFiles());
    expect(entries.length).toBeGreaterThan(0);

    const byLesson = new Map<string, number[]>();
    for (const entry of entries) {
      expect(entry.title.trim().length).toBeGreaterThan(0);
      expect(entry.file.endsWith(".mdx")).toBe(true);
      // Slugs stay stable so existing ProgressData keys are unaffected.
      expect(entry.slug).toBe(entry.subtopic);
      const arr = byLesson.get(entry.lesson) ?? [];
      arr.push(entry.order);
      byLesson.set(entry.lesson, arr);
    }
    for (const [lesson, orders] of byLesson) {
      const sorted = [...orders].sort((a, b) => a - b);
      expect(sorted, lesson).toEqual(
        Array.from({ length: sorted.length }, (_, i) => i + 1)
      );
    }
  });

  it("manages achievement definitions end to end under admin gating", async () => {
    const db = createFakeDb();
    const admin = await callerFor(db, adminUser);

    const initial = await admin.admin.listAchievementDefinitions({});
    expect(initial.success).toBe(true);
    expect(initial.data.map((d: { name: string }) => d.name)).toContain(
      "Newbie"
    );

    const created = await admin.admin.createAchievementDefinition({
      name: "Streak-7",
      description: "Seven-day streak",
    });
    expect(created.success).toBe(true);
    expect(created.data.name).toBe("Streak-7");

    await expect(
      admin.admin.createAchievementDefinition({ name: "Streak-7" })
    ).rejects.toMatchObject({ code: "CONFLICT" });

    const relisted = await admin.admin.listAchievementDefinitions({});
    expect(relisted.data.map((d: { name: string }) => d.name)).toEqual(
      expect.arrayContaining(["Newbie", "Streak-7"])
    );

    const updated = await admin.admin.updateAchievementDefinition({
      id: created.data.id,
      description: "Updated description",
    });
    expect(updated.success).toBe(true);
    expect(updated.data.description).toBe("Updated description");

    await expect(
      admin.admin.updateAchievementDefinition({
        id: 999_999,
        description: "ghost",
      })
    ).rejects.toMatchObject({ code: "NOT_FOUND" });

    await expect(
      admin.admin.deleteAchievementDefinition({ id: created.data.id })
    ).resolves.toMatchObject({ success: true });
    await expect(
      admin.admin.deleteAchievementDefinition({ id: created.data.id })
    ).rejects.toMatchObject({ code: "NOT_FOUND" });

    const afterDelete = await admin.admin.listAchievementDefinitions({});
    expect(afterDelete.data.map((d: { name: string }) => d.name)).not.toContain(
      "Streak-7"
    );
  });

  it("keeps admin lessons and achievements pages on the MDX/admin seams with stable testids", async () => {
    const routes = await import("@/routes");
    expect(routes.isAdminRoute("/admin/lessons")).toBe(true);
    expect(routes.isAdminRoute("/admin/achievements")).toBe(true);

    const lessonsPage = read("src/app/(admin)/admin/lessons/page.tsx");
    expect(lessonsPage).toContain("api.admin.listLessonContent");
    expect(lessonsPage).toContain('data-testid="admin-lessons"');
    expect(lessonsPage).toContain('data-testid="admin-lesson-row"');
    // Curriculum stays dev-authored MDX in git: the page must say so and
    // must not promise runtime lesson editing or a non-developer dashboard.
    expect(lessonsPage.toLowerCase()).toContain("dev-authored");
    expect(lessonsPage).not.toContain("createLesson");
    expect(lessonsPage).not.toContain("updateLesson");
    expect(lessonsPage).not.toContain("deleteLesson");
    // The page explicitly disclaims (rather than promises) runtime editing
    // and non-developer authoring surfaces.
    expect(lessonsPage.toLowerCase()).toContain("intentionally no");

    const achievementsPage = read(
      "src/app/(admin)/admin/achievements/page.tsx"
    );
    expect(achievementsPage).toContain("api.admin.listAchievementDefinitions");
    expect(achievementsPage).toContain('data-testid="admin-achievements"');
    expect(achievementsPage).toContain('data-testid="admin-achievement-row"');

    const service = read("src/server/services/lesson-content.ts");
    expect(service).toContain("parseLessonFrontmatter");
    expect(service).toContain("content/lessons");
  });
});
