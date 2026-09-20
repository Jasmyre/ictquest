import type { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import {
  createProgressRepository,
  type ProgressRow,
} from "@/server/repositories/progress";
import type {
  CreateProgressInput,
  ListProgressInput,
} from "@/server/schemas/progress";
import { deriveDashboard } from "@/server/services/dashboard";

/**
 * Shared progress service (Migration 12, #35; repository tier in Slice 6, #63).
 *
 * Canonical per-user progress plus stats logic. Both the new `progress`
 * router and the legacy `user` progress procedures are fed by these
 * helpers so the learner journey stays consistent across seams.
 *
 * Persistence lives in `src/server/repositories/progress.ts` — this
 * module owns domain rules only (idempotent completion, owner visibility
 * scoping, stats derivation) and never touches Prisma directly.
 */

type Db = Pick<PrismaClient, "progressData" | "user">;

function pickPagination(input: ListProgressInput): {
  skip: number;
  take: number;
} {
  return { skip: input.skip ?? 0, take: input.take ?? 20 };
}

/**
 * Progress visibility scoping (domain rule).
 *
 * Repository reads are already owner-scoped by `userId`, but every row
 * leaving this service is re-checked here so a widened repository query
 * can never leak another learner's completion state. Rows owned by
 * someone else are dropped, never error-mapped (no existence-probe
 * delta for other users' rows).
 */
export function scopeProgressToOwner(
  rows: ProgressRow[],
  userId: string
): ProgressRow[] {
  return rows.filter((row) => row.userId === userId);
}

export async function listProgress(
  db: Db,
  userId: string,
  input: ListProgressInput
): Promise<{ success: true; data: ProgressRow[] }> {
  const { skip, take } = pickPagination(input);
  const repository = createProgressRepository(db);
  try {
    const progress = await repository.findByUser(userId, skip, take);
    return {
      success: true as const,
      data: scopeProgressToOwner(progress, userId),
    };
  } catch (error) {
    console.error("listProgress error:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message:
        "Unable to load your progress right now. Please try again later.",
    });
  }
}

export async function createProgress(
  db: Db,
  userId: string,
  input: CreateProgressInput
): Promise<{ success: true; data: ProgressRow }> {
  const { topic, subtopic } = input;
  const repository = createProgressRepository(db);
  try {
    const existing = await repository.findByUserTopic(userId, topic);

    if (existing) {
      if (existing.subtopics?.includes(subtopic)) {
        return { success: true as const, data: existing };
      }
      const updated = await repository.appendSubtopic(existing.id, subtopic);
      return { success: true as const, data: updated };
    }

    const created = await repository.createRow(userId, topic, [subtopic]);
    return { success: true as const, data: created };
  } catch (error) {
    console.error("createProgress error:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Unable to record progress right now. Try again later.",
    });
  }
}

export async function deleteAllProgress(db: Db, userId: string) {
  const repository = createProgressRepository(db);
  try {
    await repository.deleteByUser(userId);
    return { success: true as const };
  } catch (error) {
    console.error("deleteAllProgress error:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message:
        "Unable to delete all your progress right now. Please try again later.",
    });
  }
}

export async function getStatsById(db: Db, id: string) {
  const repository = createProgressRepository(db);
  try {
    const user = await repository.findStatsUser(id);

    if (!user) {
      console.error("User not found with id: ", id);
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found." });
    }

    // Single derivation source: the dashboard rename (#62) is a
    // vocabulary move, so this reference shape delegates to it.
    return deriveDashboard(user);
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }
    console.error("getStatsById error: ", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Unable to fetch user stats right now. Please try again later.",
    });
  }
}
