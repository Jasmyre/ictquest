import { describe, expect, it, vi } from "vitest";
import { createAchievementRepository } from "@/server/repositories/achievement";
import { createDashboardRepository } from "@/server/repositories/dashboard";
import { createLessonRepository } from "@/server/repositories/lesson";
import { createProgressRepository } from "@/server/repositories/progress";
import { createQuizRepository } from "@/server/repositories/quiz";
import { createTopicRepository } from "@/server/repositories/topic";
import { createUserRepository } from "@/server/repositories/user";

/**
 * Slice 6 — Per-entity repository round-trips (#63).
 *
 * Integration seam: every CRUD round-trip hits persistence through the
 * repository tier only — controllers and services never appear on this
 * path. Delegates are DB-shaped in-memory fakes behind the Prisma
 * call signatures (no live `DATABASE_URL_TEST` in this environment; a
 * live-DB variant of the same round-trips is reserved for the final
 * green gate, #65), so these tests pin repository request/response
 * fidelity: owner-scoped reads, idempotent grants, closed selects.
 */

type ProgressRow = {
  id: string;
  userId: string;
  topic: string;
  subtopics: string[];
};

function progressDb() {
  const rows: ProgressRow[] = [];
  let seq = 0;
  return {
    progressData: {
      findMany: vi.fn(
        (args: { where: { userId: string }; skip?: number; take?: number }) => {
          const owned = rows.filter((r) => r.userId === args.where.userId);
          return Promise.resolve(
            owned.slice(args.skip ?? 0, (args.skip ?? 0) + (args.take ?? 20))
          );
        }
      ),
      findFirst: vi.fn((args: { where: { userId: string; topic: string } }) =>
        Promise.resolve(
          rows.find(
            (r) =>
              r.userId === args.where.userId && r.topic === args.where.topic
          ) ?? null
        )
      ),
      create: vi.fn(
        (args: {
          data: { userId: string; topic: string; subtopics: string[] };
        }) => {
          seq += 1;
          const row = { id: `p-${seq}`, ...args.data };
          rows.push(row);
          return Promise.resolve(row);
        }
      ),
      update: vi.fn(
        (args: {
          where: { id: string };
          data: { subtopics: { push: string } };
        }) => {
          const row = rows.find((r) => r.id === args.where.id);
          if (!row) {
            return Promise.reject({ code: "P2025" });
          }
          row.subtopics.push(args.data.subtopics.push);
          return Promise.resolve(row);
        }
      ),
      deleteMany: vi.fn((args: { where: { userId: string } }) => {
        const before = rows.length;
        const kept = rows.filter((row) => row.userId !== args.where.userId);
        rows.length = 0;
        rows.push(...kept);
        return Promise.resolve({ count: before - rows.length });
      }),
    },
    user: {
      findUnique: vi.fn((args: { where: { id: string } }) =>
        Promise.resolve({
          id: args.where.id,
          userName: `learner-${args.where.id}`,
          image: null,
          userAchievements: [],
          progressData: rows
            .filter((r) => r.userId === args.where.id)
            .map((r) => ({ topic: r.topic, subtopics: [...r.subtopics] })),
        })
      ),
    },
  };
}

describe("Slice 6 — repository CRUD round-trips (#63)", () => {
  it("round-trips progress rows owner-scoped through the repository only", async () => {
    const repository = createProgressRepository(progressDb() as never);

    const created = await repository.createRow("learner-a", "t", ["s1"]);
    expect(created.userId).toBe("learner-a");

    const appended = await repository.appendSubtopic(created.id, "s2");
    expect(appended.subtopics).toEqual(["s1", "s2"]);

    const found = await repository.findByUserTopic("learner-a", "t");
    expect(found?.id).toBe(created.id);

    // Another learner's rows never surface on this owner's reads.
    await repository.createRow("learner-b", "t", ["s1"]);
    const mine = await repository.findByUser("learner-a", 0, 20);
    expect(mine.map((r) => r.userId)).toEqual(["learner-a"]);

    const deleted = await repository.deleteByUser("learner-a");
    expect(deleted.count).toBe(1);
    expect(await repository.findByUser("learner-a", 0, 20)).toEqual([]);
  });

  it("round-trips achievement grants idempotently through the repository only", async () => {
    const store = new Map<string, { id: number; userId: string }>();
    const db = {
      achievement: {
        findUnique: vi.fn((args: { where: { name: string } }) =>
          Promise.resolve(
            args.where.name === "Newbie"
              ? { id: 1, name: "Newbie", description: "First" }
              : null
          )
        ),
        findMany: vi.fn(() =>
          Promise.resolve([{ id: 1, name: "Newbie", description: "First" }])
        ),
      },
      userAchievement: {
        findUnique: vi.fn(
          (args: {
            where: {
              userId_achievementId: { userId: string; achievementId: number };
            };
          }) =>
            Promise.resolve(
              store.get(
                `${args.where.userId_achievementId.userId}:${args.where.userId_achievementId.achievementId}`
              ) ?? null
            )
        ),
        create: vi.fn(
          (args: {
            data: {
              userId: string;
              achievementId: number;
              achievementName: string;
              achievementDescription: string;
            };
          }) => {
            const row = { id: store.size + 1, ...args.data };
            store.set(`${row.userId}:${row.achievementId}`, row);
            return Promise.resolve(row);
          }
        ),
        findMany: vi.fn((args: { where: { userId: string } }) =>
          Promise.resolve(
            [...store.values()].filter((r) => r.userId === args.where.userId)
          )
        ),
        deleteMany: vi.fn((args: { where: { userId: string } }) => {
          let count = 0;
          for (const [key, row] of store) {
            if (row.userId === args.where.userId) {
              store.delete(key);
              count += 1;
            }
          }
          return Promise.resolve({ count });
        }),
      },
    };
    const repository = createAchievementRepository(db as never);

    const catalog = await repository.findCatalogByName("Newbie");
    expect(catalog?.id).toBe(1);
    expect(await repository.findCatalogByName("Nope")).toBeNull();

    const grant = await repository.createGrant(
      "learner-a",
      1,
      "Newbie",
      "First"
    );
    expect(grant.userId).toBe("learner-a");
    expect(await repository.findGrant("learner-a", 1)).toEqual(grant);

    const grants = await repository.listGrants("learner-a", 0, 20);
    expect(grants).toHaveLength(1);
    expect(await repository.listGrants("learner-b", 0, 20)).toEqual([]);
  });

  it("round-trips user profiles plus roles through the repository only", async () => {
    const profiles = new Map<
      string,
      { biography: string | null; isPrivate: boolean }
    >();
    const memberships = new Map<string, Set<string>>();
    const db = {
      user: {
        findUnique: vi.fn((args: { where: { id: string } }) => {
          const profile = profiles.get(args.where.id);
          if (!profile) {
            return Promise.resolve(null);
          }
          return Promise.resolve({
            id: args.where.id,
            ...profile,
            roles: [...(memberships.get(args.where.id) ?? [])].map((name) => ({
              name,
            })),
          });
        }),
        update: vi.fn(
          (args: {
            where: { id: string };
            data: {
              biography?: string | null;
              isPrivate?: boolean;
              userName?: string;
              roles?: { connect?: { id: string }; disconnect?: { id: string } };
            };
          }) => {
            const set = memberships.get(args.where.id) ?? new Set<string>();
            if (args.data.roles?.connect) {
              set.add(args.data.roles.connect.id);
            }
            if (args.data.roles?.disconnect) {
              set.delete(args.data.roles.disconnect.id);
            }
            memberships.set(args.where.id, set);
            const next = {
              biography: null as string | null,
              isPrivate: false,
              ...profiles.get(args.where.id),
              ...(args.data.biography !== undefined
                ? { biography: args.data.biography }
                : {}),
              ...(args.data.isPrivate !== undefined
                ? { isPrivate: args.data.isPrivate }
                : {}),
            };
            profiles.set(args.where.id, next);
            return Promise.resolve({ id: args.where.id, ...next });
          }
        ),
        findMany: vi.fn(() =>
          Promise.resolve(
            [...profiles.keys()].map((id) => ({
              id,
              email: `${id}@test.dev`,
              userName: id,
              roles: [...(memberships.get(id) ?? [])].map((name) => ({
                name,
              })),
            }))
          )
        ),
      },
      role: {
        // Fake keeps id/name identical so the membership set (keyed by
        // id) resolves back to role names in `findUnique` below.
        upsert: vi.fn((args: { where: { name: string } }) =>
          Promise.resolve({ id: args.where.name, name: args.where.name })
        ),
        findUnique: vi.fn((args: { where: { name: string } }) =>
          Promise.resolve({ id: args.where.name, name: args.where.name })
        ),
      },
    };
    const repository = createUserRepository(db as never);

    profiles.set("learner-a", { biography: null, isPrivate: false });
    expect(await repository.findProfile("learner-a")).toMatchObject({
      id: "learner-a",
      isPrivate: false,
    });
    expect(await repository.findProfile("ghost")).toBeNull();

    const updated = await repository.updateProfile("learner-a", {
      biography: "Hello",
      isPrivate: true,
    });
    expect(updated).toMatchObject({ biography: "Hello", isPrivate: true });

    const role = await repository.ensureRole("USER");
    await repository.connectRole("learner-a", role.id);
    const withRoles = await repository.findWithRoles("learner-a");
    expect(withRoles?.roles.map((r) => r.name)).toContain("USER");
    await repository.disconnectRole("learner-a", role.id);

    const listed = await repository.listUsers(0, 20);
    expect(listed.map((u) => u.id)).toContain("learner-a");
  });

  it("serves the dashboard derived view over progress state through the repository only", async () => {
    const db = progressDb();
    const repository = createDashboardRepository(db as never);

    const progress = createProgressRepository(db as never);
    await progress.createRow("learner-a", "t", ["s1"]);

    const view = await repository.findDashboardUser("learner-a");
    expect(view?.id).toBe("learner-a");
    expect(view).not.toHaveProperty("biography");
    expect(view).not.toHaveProperty("isPrivate");
    expect(view?.progressData).toHaveLength(1);
  });

  it("derives lesson/topic/quiz catalogs from versioned files through repositories only", () => {
    const lessons = createLessonRepository();
    const entries = lessons.listEntries();
    expect(entries.length).toBeGreaterThan(0);

    const topics = createTopicRepository();
    const hierarchy = topics.listHierarchy();
    expect(hierarchy.length).toBeGreaterThan(0);
    const lesson = hierarchy[0]?.lesson ?? "";
    expect(topics.listTopics(lesson)).toHaveLength(1);
    expect(topics.listTopics("__no_such_lesson__")).toEqual([]);

    const quizzes = createQuizRepository();
    expect(quizzes.listQuizzes().length).toBe(entries.length);
    expect(quizzes.listQuizzes(lesson).length).toBeGreaterThan(0);
    const first = quizzes.listQuizzes()[0];
    expect(quizzes.getQuiz(first?.id ?? "")?.id).toBe(first?.id);
  });
});
