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
  email: string | null;
  userName: string | null;
  roles: Array<{ name: string }>;
};

export type UserWithRoles = {
  id: string;
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
};

export type UserRepository = {
  findProfile(userId: string): Promise<ProfileRow | null>;
  updateProfile(
    userId: string,
    data: { biography?: string | null; isPrivate?: boolean }
  ): Promise<ProfileRow>;
  findById(userId: string): Promise<{ id: string } | null>;
  findSessionOwner(userId: string): Promise<SessionOwnerRow | null>;
  findWithRoles(userId: string): Promise<UserWithRoles | null>;
  listUsers(skip: number, take: number): Promise<UserListRow[]>;
  ensureRole(name: string): Promise<{ id: string; name: string }>;
  findRole(name: string): Promise<{ id: string; name: string } | null>;
  connectRole(userId: string, roleId: string): Promise<void>;
  disconnectRole(userId: string, roleId: string): Promise<void>;
  updateUserName(userId: string, userName: string): Promise<void>;
};

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
        select: { id: true, email: true, userName: true, roles: true },
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
  };
}
