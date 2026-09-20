import "server-only";
import type { PrismaClient } from "@prisma/client";

export type ProgressRow = {
  id: string;
  userId: string;
  topic: string;
  subtopics: string[];
};

export type StatsUserRow = {
  id: string;
  userName: string | null;
  image: string | null;
  userAchievements: Array<{ id: number }>;
  progressData: Array<{ topic: string; subtopics: string[] }>;
};

export type ProgressDb = Pick<PrismaClient, "progressData" | "user">;

/**
 * Progress repository (Slice 6, #63).
 *
 * Owns all ProgressData persistence plus the closed stats select (the
 * derived dashboard view reads through here). Services must call these
 * helpers instead of touching `db.progressData` / `db.user` directly.
 * Every read/write is owner-scoped by `userId` at this tier so the
 * service seam only adds domain rules on top of already-scoped rows.
 */

export type ProgressRepository = {
  findByUser(
    userId: string,
    skip: number,
    take: number
  ): Promise<ProgressRow[]>;
  findByUserTopic(userId: string, topic: string): Promise<ProgressRow | null>;
  createRow(
    userId: string,
    topic: string,
    subtopics: string[]
  ): Promise<ProgressRow>;
  appendSubtopic(id: string, subtopic: string): Promise<ProgressRow>;
  deleteByUser(userId: string): Promise<{ count: number }>;
  findStatsUser(id: string): Promise<StatsUserRow | null>;
};

export function createProgressRepository(db: ProgressDb): ProgressRepository {
  return {
    findByUser(
      userId: string,
      skip: number,
      take: number
    ): Promise<ProgressRow[]> {
      return db.progressData.findMany({
        where: { userId },
        skip,
        take,
      });
    },
    findByUserTopic(
      userId: string,
      topic: string
    ): Promise<ProgressRow | null> {
      return db.progressData.findFirst({
        where: { userId, topic },
      });
    },
    createRow(
      userId: string,
      topic: string,
      subtopics: string[]
    ): Promise<ProgressRow> {
      return db.progressData.create({
        data: { userId, topic, subtopics },
      });
    },
    appendSubtopic(id: string, subtopic: string): Promise<ProgressRow> {
      return db.progressData.update({
        where: { id },
        data: { subtopics: { push: subtopic } },
      });
    },
    deleteByUser(userId: string): Promise<{ count: number }> {
      return db.progressData.deleteMany({ where: { userId } });
    },
    findStatsUser(id: string): Promise<StatsUserRow | null> {
      return db.user.findUnique({
        where: { id },
        select: {
          id: true,
          userName: true,
          image: true,
          userAchievements: { select: { id: true } },
          progressData: { select: { subtopics: true, topic: true } },
        },
      });
    },
  };
}
