import { existsSync, readFileSync } from "node:fs";
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

function exists(rel: string): boolean {
  return existsSync(join(ROOT, rel));
}

describe("Migration 19 — REST lesson reads plus stats plus retire legacy (#42)", () => {
  it("serves lesson reads from the MDX store with list cacheable", async () => {
    expect(exists("src/server/api/routers/lesson.ts")).toBe(true);
    const src = read("src/server/api/routers/lesson.ts");
    expect(src).toContain("/v1/lessons");
    expect(src).toContain("listLessonContent");
    expect(src).toContain(".output(");

    const { appRouter } = await import("@/server/api/root");
    const router = appRouter as unknown as Record<string, unknown>;
    expect(router.lesson).toBeDefined();

    const caller = appRouter.createCaller({
      db: {} as never,
      headers: new Headers(),
      user: null as never,
    });
    const listed = await (
      caller.lesson as {
        list: (input: Record<string, never>) => Promise<{
          success: true;
          data: Array<{
            lesson: string;
            subtopic: string;
            slug: string;
            title: string;
            order: number;
          }>;
        }>;
      }
    ).list({});
    expect(listed.success).toBe(true);
    expect(listed.data.length).toBeGreaterThan(0);
    for (const entry of listed.data) {
      expect(entry.slug).toBe(entry.subtopic);
      expect(entry.title.trim().length).toBeGreaterThan(0);
    }

    const first = listed.data[0];
    if (!first) {
      throw new Error("expected at least one lesson entry");
    }
    const single = await (
      caller.lesson as {
        get: (input: { lesson: string; subtopic: string }) => Promise<{
          success: true;
          data: { lesson: string; subtopic: string; slug: string };
        }>;
      }
    ).get({ lesson: first.lesson, subtopic: first.subtopic });
    expect(single.success).toBe(true);
    expect(single.data.slug).toBe(first.subtopic);

    await expect(
      (
        caller.lesson as {
          get: (input: {
            lesson: string;
            subtopic: string;
          }) => Promise<unknown>;
        }
      ).get({ lesson: "nope", subtopic: "missing" })
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  it("serves public rate-limited user stats with fresh per-user responses", async () => {
    const userSrc = read("src/server/api/routers/user.ts");
    expect(userSrc).toContain("publicRateLimitedProcedure");
    expect(userSrc).toContain("/v1/users/{id}/stats");
    expect(userSrc).toContain(".output(");

    const trpcSrc = read("src/server/api/trpc.ts");
    expect(trpcSrc).toContain("publicRateLimitedProcedure");

    const progressSrc = read("src/server/api/routers/progress.ts");
    expect(progressSrc).toContain("publicRateLimitedProcedure");

    const { appRouter } = await import("@/server/api/root");
    const anon = appRouter.createCaller({
      db: {
        user: {
          findUnique: async () => ({
            id: "learner-a",
            userName: "learner-a",
            image: null,
            userAchievements: [],
            progressData: [],
          }),
        },
      } as never,
      headers: new Headers(),
      user: null as never,
    });
    const stats = await anon.user.getUserStatsById({ id: "learner-a" });
    expect(stats.success).toBe(true);
    expect(stats.data.id).toBe("learner-a");

    const missingDb = appRouter.createCaller({
      db: { user: { findUnique: async () => null } } as never,
      headers: new Headers(),
      user: null as never,
    });
    await expect(
      missingDb.user.getUserStatsById({ id: "missing" })
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  it("keeps per-user stats fresh while the lesson list is cacheable", () => {
    const rest = read("src/app/api/v1/[...rest]/route.ts");
    expect(rest).toContain("/api/v1");
    // Per-user operations stay fresh.
    expect(rest).toMatch(/no-store|private/);
    // Lesson reads get a public cacheable window.
    expect(rest).toMatch(/public.*s-maxage|s-maxage.*public/);
    expect(rest).toContain("lessons");
  });

  it("exposes every v1 operation in the public OpenAPI document", async () => {
    const { buildOpenApiDocument } = await import("@/server/api/openapi");
    const document = buildOpenApiDocument(
      "http://localhost:3000"
    ) as unknown as { paths?: Record<string, unknown> };
    const flat = JSON.stringify(document.paths ?? {});
    for (const path of [
      "/v1/me",
      "/v1/me/progress",
      "/v1/me/achievements",
      "/v1/lessons",
      "/v1/lessons/{lesson}/{subtopic}",
      "/v1/users/{id}/stats",
    ]) {
      expect(flat, path).toContain(path);
    }
  });

  it("retires legacy unversioned API routes after the v1 cutover", () => {
    for (const rel of [
      "src/app/api/achievements/route.ts",
      "src/app/api/get-user-id/route.ts",
      "src/app/api/get-users-stats/route.ts",
      "src/app/api/progress/route.ts",
      "src/app/api/progress/[id]/route.ts",
      "src/app/api/public/get-user-stats/route.ts",
      "src/app/api/public/get-users-stats/route.ts",
      "src/app/api/public/progress/route.ts",
      "src/app/api/public/progress/[id]/route.ts",
      "src/app/api/user-achievements/route.ts",
    ]) {
      expect(exists(rel), `legacy route should be retired: ${rel}`).toBe(false);
    }
    // Versioned entry points survive the cutover.
    expect(exists("src/app/api/v1/[...rest]/route.ts")).toBe(true);
    expect(exists("src/app/api/v1/openapi.json/route.ts")).toBe(true);
    expect(exists("src/app/api/trpc/[trpc]/route.ts")).toBe(true);
  });
});
