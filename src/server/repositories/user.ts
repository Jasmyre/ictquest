import "server-only";
import type { PrismaClient } from "@prisma/client";

export type UserDb = Pick<PrismaClient, "user" | "role">;

export type ProfileRow = {
  id: string;
  biography: string | null;
  isPrivate: boolean;
};

export type UserListRow = {
  id: string;
  name: string | null;
  email: string | null;
  userName: string | null;
  suspendedAt: Date | null;
  roles: Array<{ name: string }>;
};

export type UserWithRoles = {
  id: string;
  roles: Array<{ name: string }>;
};

export type UserSuspensionRow = {
  id: string;
  suspendedAt: Date | null;
  roles: Array<{ name: string }>;
};

/**
 * User repository (Slice 6, #63).
 *
 * Owns all User persistence: profile fields, role membership, and the
 * admin list select. Services must call these helpers instead of
 * touching `db.user` / `db.role` directly.
 */

export type SessionOwnerRow = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  userName: string | null;
  emailVerified: Date | null;
  suspendedAt: Date | null;
};

export type SettingsRow = {
  id: string;
  name: string;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  userName: string | null;
  biography: string | null;
  isPrivate: boolean;
  /** Derived: password hash present. Never exposes the hash itself. */
  hasPassword: boolean;
};

export type UserRepository = {
  findProfile(userId: string): Promise<ProfileRow | null>;
  updateProfile(
    userId: string,
    data: { biography?: string | null; isPrivate?: boolean }
  ): Promise<ProfileRow>;
  findSettings(userId: string): Promise<SettingsRow | null>;
  findById(userId: string): Promise<{ id: string } | null>;
  findSessionOwner(userId: string): Promise<SessionOwnerRow | null>;
  findWithRoles(userId: string): Promise<UserWithRoles | null>;
  listUsers(skip: number, take: number): Promise<UserListRow[]>;
  ensureRole(name: string): Promise<{ id: string; name: string }>;
  findRole(name: string): Promise<{ id: string; name: string } | null>;
  connectRole(userId: string, roleId: string): Promise<void>;
  disconnectRole(userId: string, roleId: string): Promise<void>;
  updateUserName(userId: string, userName: string): Promise<void>;
  findByEmail(email: string): Promise<{ id: string } | null>;
  findPasswordHash(userId: string): Promise<{ password: string | null } | null>;
  updateSettings(
    userId: string,
    data: {
      name?: string;
      biography?: string | null;
      isPrivate?: boolean;
    }
  ): Promise<SettingsRow>;
  updateEmail(userId: string, email: string): Promise<SettingsRow>;
  updatePasswordHash(userId: string, hash: string): Promise<void>;
  findSuspension(userId: string): Promise<UserSuspensionRow | null>;
  setSuspendedAt(userId: string, at: Date): Promise<UserSuspensionRow>;
  clearSuspendedAt(userId: string): Promise<UserSuspensionRow>;
};

/**
 * Shared settings select: every settings read/write returns the same
 * row shape, with the password hash projected only to derive
 * `hasPassword` (never exposed).
 */
const settingsSelect = {
  id: true,
  name: true,
  email: true,
  emailVerified: true,
  image: true,
  userName: true,
  biography: true,
  isPrivate: true,
  password: true,
} as const;

type SettingsSelectRow = {
  id: string;
  name: string;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  userName: string | null;
  biography: string | null;
  isPrivate: boolean;
  password: string | null;
};

function toSettingsRow(row: SettingsSelectRow): SettingsRow {
  const { password, ...rest } = row;
  return { ...rest, hasPassword: password !== null };
}

export function createUserRepository(db: UserDb): UserRepository {
  return {
    findProfile(userId: string): Promise<ProfileRow | null> {
      return db.user.findUnique({
        where: { id: userId },
        select: { id: true, biography: true, isPrivate: true },
      });
    },
    updateProfile(
      userId: string,
      data: { biography?: string | null; isPrivate?: boolean }
    ): Promise<ProfileRow> {
      return db.user.update({
        where: { id: userId },
        data,
        select: { id: true, biography: true, isPrivate: true },
      });
    },
    findById(userId: string): Promise<{ id: string } | null> {
      return db.user.findUnique({
        where: { id: userId },
      });
    },
    findSessionOwner(userId: string): Promise<SessionOwnerRow | null> {
      return db.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          userName: true,
          emailVerified: true,
          suspendedAt: true,
        },
      });
    },
    findWithRoles(userId: string): Promise<UserWithRoles | null> {
      return db.user.findUnique({
        where: { id: userId },
        include: { roles: true },
      });
    },
    listUsers(skip: number, take: number): Promise<UserListRow[]> {
      return db.user.findMany({
        skip,
        take,
        select: {
          id: true,
          name: true,
          email: true,
          userName: true,
          suspendedAt: true,
          roles: true,
        },
      });
    },
    ensureRole(name: string): Promise<{ id: string; name: string }> {
      return db.role.upsert({
        where: { name },
        update: {},
        create: { name },
      });
    },
    findRole(name: string): Promise<{ id: string; name: string } | null> {
      return db.role.findUnique({
        where: { name },
      });
    },
    async connectRole(userId: string, roleId: string): Promise<void> {
      await db.user.update({
        where: { id: userId },
        data: { roles: { connect: { id: roleId } } },
      });
    },
    async disconnectRole(userId: string, roleId: string): Promise<void> {
      await db.user.update({
        where: { id: userId },
        data: { roles: { disconnect: { id: roleId } } },
      });
    },
    async updateUserName(userId: string, userName: string): Promise<void> {
      await db.user.update({ where: { id: userId }, data: { userName } });
    },
    async findSettings(userId: string): Promise<SettingsRow | null> {
      const row = await db.user.findUnique({
        where: { id: userId },
        select: settingsSelect,
      });
      if (!row) {
        return null;
      }
      return toSettingsRow(row);
    },
    findByEmail(email: string): Promise<{ id: string } | null> {
      return db.user.findUnique({
        where: { email },
        select: { id: true },
      });
    },
    findPasswordHash(
      userId: string
    ): Promise<{ password: string | null } | null> {
      return db.user.findUnique({
        where: { id: userId },
        select: { password: true },
      });
    },
    async updateSettings(
      userId: string,
      data: {
        name?: string;
        biography?: string | null;
        isPrivate?: boolean;
      }
    ): Promise<SettingsRow> {
      const row = await db.user.update({
        where: { id: userId },
        data,
        select: settingsSelect,
      });
      return toSettingsRow(row);
    },
    async updateEmail(userId: string, email: string): Promise<SettingsRow> {
      const row = await db.user.update({
        where: { id: userId },
        data: { email, emailVerified: null },
        select: settingsSelect,
      });
      return toSettingsRow(row);
    },
    async updatePasswordHash(userId: string, hash: string): Promise<void> {
      await db.user.update({ where: { id: userId }, data: { password: hash } });
    },
    findSuspension(userId: string): Promise<UserSuspensionRow | null> {
      return db.user.findUnique({
        where: { id: userId },
        select: { id: true, suspendedAt: true, roles: true },
      });
    },
    setSuspendedAt(userId: string, at: Date): Promise<UserSuspensionRow> {
      return db.user.update({
        where: { id: userId },
        data: { suspendedAt: at },
        select: { id: true, suspendedAt: true, roles: true },
      });
    },
    clearSuspendedAt(userId: string): Promise<UserSuspensionRow> {
      return db.user.update({
        where: { id: userId },
        data: { suspendedAt: null },
        select: { id: true, suspendedAt: true, roles: true },
      });
    },
  };
}
