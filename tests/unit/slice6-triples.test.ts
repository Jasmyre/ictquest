import { existsSync, readdirSync, readFileSync } from "node:fs";
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

function sourceFiles(dir: string): string[] {
  const full = join(ROOT, dir);
  if (!existsSync(full)) {
    return [];
  }
  return readdirSync(full).filter((f) => f.endsWith(".ts"));
}

/** Prisma-delegate query methods no controller/service may call directly. */
const DIRECT_QUERY_RE =
  /\bdb\.(progressData|userAchievement|achievement|user|role|personalAccessToken)\s*\.\s*(findMany|findFirst|findUnique|create|update|upsert|delete|deleteMany)\s*\(/;

describe("Slice 6 — per-entity service/repository/schema triples (#63)", () => {
  it("ships one service plus one repository plus one schema module per entity", () => {
    const services = sourceFiles("src/server/services");
    const repositories = sourceFiles("src/server/repositories");
    const schemas = sourceFiles("src/server/schemas");

    // Canonical entities: Lesson, Topic, Quiz, Progress, Achievement,
    // User — plus Dashboard as the derived view over progress.
    for (const entity of [
      "lesson",
      "topic",
      "quiz",
      "progress",
      "achievement",
      "user",
      "dashboard",
    ]) {
      expect(
        services.some((f) => f.startsWith(entity)),
        `missing service for ${entity} (have: ${services.join(", ")})`
      ).toBe(true);
      expect(
        repositories,
        `missing repository for ${entity} (have: ${repositories.join(", ")})`
      ).toContain(`${entity}.ts`);
      expect(
        schemas,
        `missing schema for ${entity} (have: ${schemas.join(", ")})`
      ).toContain(`${entity}.ts`);
    }
  });

  it("keeps a single database client", () => {
    expect(existsSync(join(ROOT, "src", "server", "db.ts"))).toBe(false);
    expect(existsSync(join(ROOT, "src", "lib", "db.ts"))).toBe(true);

    const trpc = read("src/server/api/trpc.ts");
    expect(trpc).toContain('from "@/lib/db"');
    expect(trpc).not.toContain("server/db");
  });

  it("keeps controllers thin: routers never query persistence directly", () => {
    const routers = sourceFiles("src/server/api/routers");
    expect(routers.length).toBeGreaterThan(0);
    for (const file of routers) {
      const src = read(`src/server/api/routers/${file}`);
      expect(DIRECT_QUERY_RE.test(src), `${file} queries Prisma directly`).toBe(
        false
      );
      // Routers delegate to services, never to repositories or Prisma
      // value imports (`import type` is a DI-handle annotation only).
      expect(src).not.toMatch(/from "@\/server\/repositories\//);
      expect(src).not.toMatch(/^import \{[^}]*\} from "@prisma\/client"/m);
    }
  });

  it("keeps business logic Prisma-free: services delegate to repositories", () => {
    const services = sourceFiles("src/server/services");
    for (const file of services) {
      const src = read(`src/server/services/${file}`);
      expect(
        DIRECT_QUERY_RE.test(src),
        `${file} queries Prisma directly instead of its repository`
      ).toBe(false);
      // Repositories own Prisma value access; services may only carry
      // `import type` DI-handle annotations (erased at runtime).
      expect(src).not.toMatch(/^import \{[^}]*\} from "@prisma\/client"/m);
    }
  });

  it("enforces topic hierarchy ownership with mocked persistence", async () => {
    const { createTopicRepository } = await import(
      "@/server/repositories/topic"
    );
    const { assertSubtopicOwnership, listTopicsForLesson } = await import(
      "@/server/services/topic"
    );

    const repository = createTopicRepository();
    const hierarchy = repository.listHierarchy();
    expect(hierarchy.length).toBeGreaterThan(0);

    const first = hierarchy[0];
    const lesson = first?.lesson ?? "";
    const subtopic = first?.topics[0]?.subtopics[0] ?? "";
    expect(lesson).not.toBe("");
    expect(subtopic).not.toBe("");

    // Owned pair passes silently.
    expect(() =>
      assertSubtopicOwnership(repository, lesson, subtopic)
    ).not.toThrow();
    expect(listTopicsForLesson(repository, lesson).success).toBe(true);

    // Cross-lesson pair resolves to NOT_FOUND, never adjacent content.
    const other = hierarchy.find((h) => h.lesson !== lesson);
    const foreign = other?.topics[0]?.subtopics[0] ?? "__missing__";
    await expect(
      (async () => assertSubtopicOwnership(repository, lesson, foreign))()
    ).rejects.toMatchObject({ code: "NOT_FOUND" });

    // Unknown lesson has no topics.
    await expect(
      (async () => listTopicsForLesson(repository, "__no_such_lesson__"))()
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  it("gates lesson completion on quiz attempts with mocked persistence", async () => {
    const { createQuizRepository } = await import("@/server/repositories/quiz");
    const {
      canCompleteLesson,
      getQuizById,
      getQuizzes,
      requireQuizAttemptForCompletion,
      submitQuizAttempt,
    } = await import("@/server/services/quiz");

    // Zero attempts: the lesson is not completable, at any score history.
    expect(canCompleteLesson([])).toBe(false);
    await expect(
      (async () => requireQuizAttemptForCompletion([]))()
    ).rejects.toMatchObject({ code: "PRECONDITION_FAILED" });

    // Any score counts — including a zero — once an attempt exists.
    expect(canCompleteLesson([{ quizId: "q", userId: "u", score: 0 }])).toBe(
      true
    );
    expect(canCompleteLesson([{ quizId: "q", userId: "u", score: 100 }])).toBe(
      true
    );
    expect(() =>
      requireQuizAttemptForCompletion([{ quizId: "q", userId: "u", score: 0 }])
    ).not.toThrow();

    // Catalog reads come from the versioned lesson files.
    const quizzes = getQuizzes();
    expect(quizzes.success).toBe(true);
    expect(quizzes.data.length).toBeGreaterThan(0);
    const firstId = quizzes.data[0]?.id ?? "";
    expect(getQuizById(firstId).data.id).toBe(firstId);
    await expect(
      (async () => getQuizById("__no_such_quiz__"))()
    ).rejects.toMatchObject({ code: "NOT_FOUND" });

    // Attempt recording validates catalog membership plus score bounds.
    const recorded = submitQuizAttempt("learner-a", {
      quizId: firstId,
      score: 73,
    });
    expect(recorded).toMatchObject({
      success: true,
      data: { quizId: firstId, userId: "learner-a", score: 73 },
    });
    expect(() =>
      submitQuizAttempt("learner-a", { quizId: firstId, score: 101 })
    ).toThrow();
    await expect(
      (async () =>
        submitQuizAttempt("learner-a", {
          quizId: "__no_such_quiz__",
          score: 50,
        }))()
    ).rejects.toMatchObject({ code: "NOT_FOUND" });

    // Repository seam is mockable: unknown catalogs stay unknown.
    const empty = createQuizRepository({
      listEntries: () => [],
      getEntry: () => null,
    });
    expect(empty.listQuizzes()).toEqual([]);
    expect(empty.getQuiz("a/b")).toBeNull();
  });

  it("scopes progress visibility to the owner with mocked persistence", async () => {
    const { scopeProgressToOwner, listProgress } = await import(
      "@/server/services/progress"
    );

    // Defense in depth: foreign rows are dropped, never error-mapped.
    const mixed = [
      { id: "p1", userId: "learner-a", topic: "t", subtopics: ["s"] },
      { id: "p2", userId: "learner-b", topic: "t", subtopics: ["s"] },
    ];
    expect(scopeProgressToOwner(mixed, "learner-a")).toEqual([mixed[0]]);
    expect(scopeProgressToOwner(mixed, "nobody")).toEqual([]);

    // Repository tier stays owner-scoped: a widened delegate cannot leak
    // through the service seam.
    const leaky = {
      progressData: {
        findMany: vi.fn(async () => mixed),
      },
      user: {},
    };
    const listed = await listProgress(leaky as never, "learner-a", {});
    expect(listed).toEqual({ success: true, data: [mixed[0]] });
  });

  it("keeps dashboard reads share-safe with mocked persistence", async () => {
    const { getDashboardById, getMyDashboard } = await import(
      "@/server/services/dashboard"
    );
    const { dashboardOutputSchema } = await import(
      "@/server/schemas/dashboard"
    );

    const row = {
      id: "learner-a",
      userName: "learner-a",
      image: null,
      userAchievements: [{ id: 1 }],
      progressData: [{ topic: "t", subtopics: ["s"] }],
    };
    const db = {
      user: { findUnique: vi.fn(async () => row) },
      progressData: {},
    };

    const mine = await getMyDashboard(db as never, "learner-a");
    expect(dashboardOutputSchema.safeParse(mine).success).toBe(true);
    expect(mine.data).not.toHaveProperty("biography");
    expect(mine.data).not.toHaveProperty("isPrivate");

    const byId = await getDashboardById(db as never, "learner-a");
    expect(byId).toEqual(mine);

    const missing = {
      user: { findUnique: vi.fn(async () => null) },
      progressData: {},
    };
    await expect(
      getDashboardById(missing as never, "missing")
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
  });
});
