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

type RoleRow = { id: string; name: string };
type AssignmentRow = { userId: string; roleId: string };
type UserRow = { id: string; email: string | null; userName: string | null };
type ProgressRow = {
  id: string;
  userId: string;
  topic: string;
  subtopics: string[];
};
type AchievementDef = { id: number; name: string; description: string | null };
type UnlockRow = {
  id: number;
  userId: string;
  achievementId: number;
  achievementName: string;
  achievementDescription: string;
};

function createFakeDb() {
  const roles: RoleRow[] = [
    { id: "role-admin", name: "ADMIN" },
    { id: "role-mod", name: "MODERATOR" },
    { id: "role-user", name: "USER" },
  ];
  const users: UserRow[] = [
    { id: "admin-1", email: "admin@example.com", userName: "admin" },
    { id: "learner-a", email: "a@example.com", userName: "learner-a" },
    { id: "learner-b", email: "b@example.com", userName: "learner-b" },
  ];
  const assignments: AssignmentRow[] = [
    { userId: "admin-1", roleId: "role-admin" },
    { userId: "admin-1", roleId: "role-user" },
    { userId: "learner-a", roleId: "role-user" },
    { userId: "learner-b", roleId: "role-user" },
  ];
  const progressRows: ProgressRow[] = [];
  const definitions: AchievementDef[] = [
    { id: 1, name: "Newbie", description: "First steps" },
  ];
  const unlocks: UnlockRow[] = [];
  let progressSeq = 0;
  let unlockSeq = 0;

  const roleIdByName = (name: string) => roles.find((r) => r.name === name)?.id;
  const roleNameById = (id: string) => roles.find((r) => r.id === id)?.name;

  const role = {
    findUnique(args: { where: { name: string } }) {
      return Promise.resolve(
        roles.find((r) => r.name === args.where.name) ?? null
      );
    },
    upsert(args: {
      where: { name: string };
      update: unknown;
      create: { name: string };
    }) {
      let found = roles.find((r) => r.name === args.where.name);
      if (!found) {
        found = { id: `role-${args.where.name}`, name: args.where.name };
        roles.push(found);
      }
      return Promise.resolve(found);
    },
  };

  const userRoleAssignment = {
    findMany(args: { where?: { userId?: string } }) {
      const owned = args.where?.userId
        ? assignments.filter((a) => a.userId === args.where?.userId)
        : [...assignments];
      return Promise.resolve(
        owned.map((a) => ({
          ...a,
          role: { id: a.roleId, name: roleNameById(a.roleId) },
        }))
      );
    },
    upsert(args: {
      where: { userId_roleId: { userId: string; roleId: string } };
      update: unknown;
      create: { userId: string; roleId: string; assignedBy?: string };
    }) {
      const key = args.where.userId_roleId;
      let found = assignments.find(
        (a) => a.userId === key.userId && a.roleId === key.roleId
      );
      if (!found) {
        found = { userId: key.userId, roleId: key.roleId };
        assignments.push(found);
      }
      return Promise.resolve(found);
    },
    delete(args: {
      where: { userId_roleId: { userId: string; roleId: string } };
    }) {
      const key = args.where.userId_roleId;
      const idx = assignments.findIndex(
        (a) => a.userId === key.userId && a.roleId === key.roleId
      );
      if (idx === -1) {
        const err = Object.assign(new Error("Not found"), { code: "P2025" });
        throw err;
      }
      const [removed] = assignments.splice(idx, 1);
      return Promise.resolve(removed);
    },
    deleteMany(args: { where: { userId: string } }) {
      const before = assignments.length;
      for (let i = assignments.length - 1; i >= 0; i -= 1) {
        if (assignments[i]?.userId === args.where.userId) {
          assignments.splice(i, 1);
        }
      }
      return Promise.resolve({ count: before - assignments.length });
    },
  };

  const rolesFor = (userId: string) =>
    assignments
      .filter((a) => a.userId === userId)
      .map((a) => ({ id: a.roleId, name: roleNameById(a.roleId) }));

  const user = {
    findUnique(args: { where: { id: string } }) {
      const found = users.find((u) => u.id === args.where.id) ?? null;
      if (!found) {
        return Promise.resolve(null);
      }
      return Promise.resolve({ ...found, roles: rolesFor(found.id) });
    },
    findMany(args: { skip?: number; take?: number } = {}) {
      const skip = args.skip ?? 0;
      const take = args.take ?? users.length;
      const slice = users.slice(skip, skip + take);
      return Promise.resolve(
        slice.map((u) => ({
          ...u,
          roles: rolesFor(u.id),
        }))
      );
    },
    update(args: {
      where: { id: string };
      data: {
        roles?: { connect?: { id: string }; disconnect?: { id: string } };
      };
    }) {
      const target = users.find((u) => u.id === args.where.id);
      if (!target) {
        throw Object.assign(new Error("Not found"), { code: "P2025" });
      }
      const connectId = args.data.roles?.connect?.id;
      if (connectId) {
        if (
          !assignments.some(
            (a) => a.userId === target.id && a.roleId === connectId
          )
        ) {
          assignments.push({ userId: target.id, roleId: connectId });
        }
        return Promise.resolve({ ...target, roles: rolesFor(target.id) });
      }
      const disconnectId = args.data.roles?.disconnect?.id;
      if (disconnectId) {
        const idx = assignments.findIndex(
          (a) => a.userId === target.id && a.roleId === disconnectId
        );
        if (idx !== -1) {
          assignments.splice(idx, 1);
        }
        return Promise.resolve({ ...target, roles: rolesFor(target.id) });
      }
      return Promise.resolve({ ...target, roles: rolesFor(target.id) });
    },
  };

  const progressData = {
    findFirst(args: { where: { userId: string; topic: string } }) {
      return Promise.resolve(
        progressRows.find(
          (r) => r.userId === args.where.userId && r.topic === args.where.topic
        ) ?? null
      );
    },
    findMany(args: {
      where: { userId: string };
      skip?: number;
      take?: number;
    }) {
      const owned = progressRows.filter((r) => r.userId === args.where.userId);
      const skip = args.skip ?? 0;
      const take = args.take ?? owned.length;
      return Promise.resolve(owned.slice(skip, skip + take));
    },
    create(args: {
      data: { userId: string; topic: string; subtopics: string[] };
    }) {
      progressSeq += 1;
      const row: ProgressRow = {
        id: `progress-${progressSeq}`,
        userId: args.data.userId,
        topic: args.data.topic,
        subtopics: [...args.data.subtopics],
      };
      progressRows.push(row);
      return Promise.resolve(row);
    },
    update(args: {
      where: { id: string };
      data: { subtopics: { push: string } };
    }) {
      const row = progressRows.find((r) => r.id === args.where.id);
      if (!row) {
        throw new Error("not found");
      }
      row.subtopics.push(args.data.subtopics.push);
      return Promise.resolve(row);
    },
    deleteMany(args: { where: { userId: string } }) {
      const before = progressRows.length;
      for (let i = progressRows.length - 1; i >= 0; i -= 1) {
        if (progressRows[i]?.userId === args.where.userId) {
          progressRows.splice(i, 1);
        }
      }
      return Promise.resolve({ count: before - progressRows.length });
    },
  };

  const achievement = {
    findUnique(args: { where: { name: string } }) {
      return Promise.resolve(
        definitions.find((d) => d.name === args.where.name) ?? null
      );
    },
  };

  const userAchievement = {
    findMany(args: {
      where: { userId: string };
      skip?: number;
      take?: number;
    }) {
      const owned = unlocks.filter((u) => u.userId === args.where.userId);
      const skip = args.skip ?? 0;
      const take = args.take ?? owned.length;
      return Promise.resolve(owned.slice(skip, skip + take));
    },
    findUnique(args: {
      where: {
        userId_achievementId: { userId: string; achievementId: number };
      };
    }) {
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
    }) {
      const dupe = unlocks.find(
        (u) =>
          u.userId === args.data.userId &&
          u.achievementId === args.data.achievementId
      );
      if (dupe) {
        const err = Object.assign(new Error("Unique constraint failed"), {
          code: "P2002",
        });
        throw err;
      }
      unlockSeq += 1;
      const row: UnlockRow = { id: unlockSeq, ...args.data };
      unlocks.push(row);
      return Promise.resolve(row);
    },
    delete(args: { where: { id: number } }) {
      const idx = unlocks.findIndex((u) => u.id === args.where.id);
      if (idx === -1) {
        const err = Object.assign(new Error("Not found"), { code: "P2025" });
        throw err;
      }
      const [removed] = unlocks.splice(idx, 1);
      return Promise.resolve(removed);
    },
    deleteMany(args: { where: { userId: string } }) {
      const before = unlocks.length;
      for (let i = unlocks.length - 1; i >= 0; i -= 1) {
        if (unlocks[i]?.userId === args.where.userId) {
          unlocks.splice(i, 1);
        }
      }
      return Promise.resolve({ count: before - unlocks.length });
    },
  };

  return {
    user,
    role,
    userRoleAssignment,
    progressData,
    achievement,
    userAchievement,
    __debug: { roles, users, assignments, progressRows, unlocks, roleIdByName },
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

describe("Migration 14 — Admin users plus progress ops", () => {
  it("exposes admin-gated user and progress-op procedures", async () => {
    const { appRouter } = await import("@/server/api/root");
    const admin = (appRouter as unknown as { admin: Record<string, unknown> })
      .admin;
    for (const proc of [
      "listUsers",
      "grantRole",
      "revokeRole",
      "grantAchievement",
      "revokeAchievement",
      "resetProgress",
    ]) {
      expect(admin[proc], proc).toBeDefined();
    }

    const src = read("src/server/api/routers/admin.ts");
    expect(src).toContain("adminProcedure");
    expect(src).toContain("listUsers");
    expect(src).toContain("grantRole");
    expect(src).toContain("revokeRole");
    expect(src).toContain("grantAchievement");
    expect(src).toContain("revokeAchievement");
    expect(src).toContain("resetProgress");
  });

  it("denies non-admins at the procedure seam and anon at auth seam", async () => {
    const db = createFakeDb();
    const admin = await callerFor(db, adminUser);
    const learner = await callerFor(db, learnerUser);
    const anon = await callerFor(db, null);

    // Allowed: admin can list.
    await expect(admin.admin.listUsers({})).resolves.toMatchObject({
      success: true,
    });

    // Denied: learner gets FORBIDDEN on every admin op.
    await expect(learner.admin.listUsers({})).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
    await expect(
      learner.admin.grantRole({ userId: "learner-b", role: "MODERATOR" })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(
      learner.admin.revokeRole({ userId: "learner-b", role: "USER" })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(
      learner.admin.grantAchievement({
        userId: "learner-b",
        achievementName: "Newbie",
      })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(
      learner.admin.revokeAchievement({
        userId: "learner-b",
        achievementName: "Newbie",
      })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(
      learner.admin.resetProgress({ userId: "learner-b" })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });

    // Denied: anonymous gets UNAUTHORIZED.
    await expect(anon.admin.listUsers({})).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
    await expect(
      anon.admin.grantRole({ userId: "learner-b", role: "MODERATOR" })
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(
      anon.admin.resetProgress({ userId: "learner-b" })
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("manages user and role assignments end to end under admin gating", async () => {
    const db = createFakeDb();
    const admin = await callerFor(db, adminUser);

    const listed = await admin.admin.listUsers({});
    expect(listed.success).toBe(true);
    const learnerA = listed.data.find(
      (u: { id: string }) => u.id === "learner-a"
    );
    expect(learnerA).toBeDefined();
    expect(learnerA?.roles).toEqual(expect.arrayContaining(["USER"]));
    expect(learnerA?.roles).not.toContain("ADMIN");

    // Grant ADMIN: idempotent and visible on re-list.
    const granted = await admin.admin.grantRole({
      userId: "learner-a",
      role: "ADMIN",
    });
    expect(granted.success).toBe(true);
    const relisted = await admin.admin.listUsers({});
    expect(
      relisted.data.find((u: { id: string }) => u.id === "learner-a")?.roles
    ).toEqual(expect.arrayContaining(["ADMIN", "USER"]));

    // Repeat grant stays idempotent.
    await expect(
      admin.admin.grantRole({ userId: "learner-a", role: "ADMIN" })
    ).resolves.toMatchObject({ success: true });

    // Revoke ADMIN: learner drops back to USER.
    await expect(
      admin.admin.revokeRole({ userId: "learner-a", role: "ADMIN" })
    ).resolves.toMatchObject({ success: true });
    const afterRevoke = await admin.admin.listUsers({});
    expect(
      afterRevoke.data.find((u: { id: string }) => u.id === "learner-a")?.roles
    ).toEqual(["USER"]);

    // Cannot revoke the user's only role.
    await expect(
      admin.admin.revokeRole({ userId: "learner-a", role: "USER" })
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });

    // Unknown users are NOT_FOUND.
    await expect(
      admin.admin.grantRole({ userId: "ghost", role: "MODERATOR" })
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
    await expect(
      admin.admin.revokeRole({ userId: "ghost", role: "USER" })
    ).rejects.toMatchObject({ code: "NOT_FOUND" });

    // Already-removed revoke stays idempotent with unchanged shape.
    await expect(
      admin.admin.revokeRole({ userId: "learner-a", role: "ADMIN" })
    ).resolves.toMatchObject({
      success: true,
      data: { userId: "learner-a", status: "already-removed" },
    });

    // Self-demotion is forbidden even though the caller holds ADMIN.
    await expect(
      admin.admin.revokeRole({ userId: "admin-1", role: "ADMIN" })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("runs progress support ops end to end under admin gating", async () => {
    const db = createFakeDb();
    const admin = await callerFor(db, adminUser);
    const learnerCaller = await callerFor(db, learnerUser);

    // Seed target progress as the learner (canonical progress router).
    await learnerCaller.progress.create({
      topic: "introduction-to-html",
      subtopic: "html_introduction",
    });

    // Grant achievement to the target user.
    const granted = await admin.admin.grantAchievement({
      userId: "learner-a",
      achievementName: "Newbie",
    });
    expect(granted.success).toBe(true);

    // Target inventory shows it (canonical achievement router).
    const inventory = await learnerCaller.achievement.list({});
    expect(inventory.data).toHaveLength(1);

    // Repeat grant is idempotent.
    const reganted = await admin.admin.grantAchievement({
      userId: "learner-a",
      achievementName: "Newbie",
    });
    expect(reganted.success).toBe(true);
    expect((await learnerCaller.achievement.list({})).data).toHaveLength(1);

    // Revoke achievement clears the inventory.
    await expect(
      admin.admin.revokeAchievement({
        userId: "learner-a",
        achievementName: "Newbie",
      })
    ).resolves.toMatchObject({ success: true });
    expect((await learnerCaller.achievement.list({})).data).toHaveLength(0);

    // Unknown achievement names are NOT_FOUND.
    await expect(
      admin.admin.grantAchievement({
        userId: "learner-a",
        achievementName: "DoesNotExist",
      })
    ).rejects.toMatchObject({ code: "NOT_FOUND" });

    // Reset progress clears the target's rows only.
    const other = await callerFor(db, { id: "learner-b", roles: ["USER"] });
    await other.progress.create({ topic: "html-elements", subtopic: "s1" });
    await expect(
      admin.admin.resetProgress({ userId: "learner-a" })
    ).resolves.toMatchObject({ success: true });
    await expect(learnerCaller.progress.list({})).resolves.toMatchObject({
      success: true,
      data: [],
    });
    const otherListed = await other.progress.list({});
    expect(otherListed.data).toHaveLength(1);

    // Unknown users are NOT_FOUND for support ops.
    await expect(
      admin.admin.resetProgress({ userId: "ghost" })
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  it("keeps admin users and progress pages under the admin shell with stable testids", async () => {
    const routes = await import("@/routes");
    expect(routes.isAdminRoute("/admin/users")).toBe(true);
    expect(routes.isAdminRoute("/admin/progress")).toBe(true);

    const usersPage = read("src/app/(admin)/admin/users/page.tsx");
    expect(usersPage).toContain("api.admin.listUsers");
    expect(usersPage).toContain('data-testid="admin-users"');

    const progressPage = read("src/app/(admin)/admin/progress/page.tsx");
    expect(progressPage).toContain("api.admin.");
    expect(progressPage).toContain('data-testid="admin-progress-ops"');
  });
});
