import "server-only";
import type { PrismaClient } from "@prisma/client";

export type AchievementDb = Pick<
  PrismaClient,
  "achievement" | "userAchievement"
>;

/**
 * Achievement repository (Slice 6, #63).
 *
 * Owns all Achievement-catalog plus per-learner grant persistence.
 * Services must call these helpers instead of touching `db.achievement` /
 * `db.userAchievement` directly. Every grant read/write is owner-scoped
 * by `userId` at this tier.
 */

export type CatalogAchievement = {
  id: number;
  name: string;
  description: string | null;
};

export type GrantRow = {
  id: number;
  userId: string;
  achievementId: number;
  achievementName: string;
  achievementDescription: string;
};

export type AchievementRepository = {
  findCatalogByName(name: string): Promise<CatalogAchievement | null>;
  findGrant(userId: string, achievementId: number): Promise<GrantRow | null>;
  createGrant(
    userId: string,
    achievementId: number,
    achievementName: string,
    achievementDescription: string
  ): Promise<GrantRow>;
  listGrants(userId: string, skip: number, take: number): Promise<GrantRow[]>;
  deleteGrantsByUser(userId: string): Promise<{ count: number }>;
  findCatalog(skip: number, take: number): Promise<CatalogAchievement[]>;
  createCatalogEntry(
    name: string,
    description: string | null
  ): Promise<CatalogAchievement>;
  updateCatalogEntry(
    id: number,
    data: { name?: string; description?: string | null }
  ): Promise<CatalogAchievement>;
  deleteCatalogEntry(id: number): Promise<{ id: number }>;
  deleteGrant(id: number): Promise<void>;
};

export function createAchievementRepository(
  db: AchievementDb
): AchievementRepository {
  return {
    findCatalogByName(name: string): Promise<CatalogAchievement | null> {
      return db.achievement.findUnique({
        where: { name },
      });
    },
    findGrant(userId: string, achievementId: number): Promise<GrantRow | null> {
      return db.userAchievement.findUnique({
        where: { userId_achievementId: { userId, achievementId } },
      });
    },
    createGrant(
      userId: string,
      achievementId: number,
      achievementName: string,
      achievementDescription: string
    ): Promise<GrantRow> {
      return db.userAchievement.create({
        data: {
          userId,
          achievementId,
          achievementName,
          achievementDescription,
        },
      });
    },
    listGrants(
      userId: string,
      skip: number,
      take: number
    ): Promise<GrantRow[]> {
      return db.userAchievement.findMany({
        where: { userId },
        include: { achievement: true },
        skip,
        take,
      });
    },
    deleteGrantsByUser(userId: string): Promise<{ count: number }> {
      return db.userAchievement.deleteMany({ where: { userId } });
    },
    findCatalog(skip: number, take: number): Promise<CatalogAchievement[]> {
      return db.achievement.findMany({
        skip,
        take,
        orderBy: { id: "asc" },
      });
    },
    createCatalogEntry(
      name: string,
      description: string | null
    ): Promise<CatalogAchievement> {
      return db.achievement.create({
        data: { name, description },
      });
    },
    updateCatalogEntry(
      id: number,
      data: { name?: string; description?: string | null }
    ): Promise<CatalogAchievement> {
      return db.achievement.update({
        where: { id },
        data,
      });
    },
    deleteCatalogEntry(id: number): Promise<{ id: number }> {
      return db.achievement.delete({ where: { id } });
    },
    async deleteGrant(id: number): Promise<void> {
      await db.userAchievement.delete({ where: { id } });
    },
  };
}
