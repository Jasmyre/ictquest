import type { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { createUserRepository } from "@/server/repositories/user";

/**
 * User profile service (Slice 1, #58; repository tier in Slice 6, #63).
 *
 * Owns biography/isPrivate domain rules; persistence lives in
 * `src/server/repositories/user.ts` so unit tests can mock the
 * repository seam. Biography and privacy never enter session tokens;
 * public redaction lives in a later slice — this one covers
 * normalization, defaults, and owner round-trip.
 */

export const BIOGRAPHY_MAX_LENGTH = 500;

type Db = Pick<PrismaClient, "user" | "role">;

export type ProfileRow = import("@/server/repositories/user").ProfileRow;

export type UpdateOwnProfileInput = {
  biography?: string | null;
  isPrivate?: boolean;
};

/**
 * Normalize raw biography input: trim, empty-to-null, 500-char limit.
 * Returns `undefined` when the caller did not supply the field so updates
 * can distinguish "not provided" from "clear".
 */
export function normalizeBiography(
  value: string | null | undefined
): string | null | undefined {
  if (value === undefined) {
    return;
  }
  if (value === null) {
    return null;
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return null;
  }
  if (trimmed.length > BIOGRAPHY_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Biography must be at most ${BIOGRAPHY_MAX_LENGTH} characters.`,
    });
  }
  return trimmed;
}

function normalizeIsPrivate(value: boolean | undefined): boolean | undefined {
  if (value === undefined) {
    return;
  }
  return value;
}

export async function getOwnProfile(
  db: Db,
  userId: string
): Promise<{ success: true; data: ProfileRow }> {
  // Profile reads never touch role membership, but the repository seam
  // takes the shared user store handle.
  const repository = createUserRepository(db);
  try {
    const row = await repository.findProfile(userId);
    if (!row) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found." });
    }
    return {
      success: true as const,
      data: {
        id: row.id,
        biography: row.biography ?? null,
        isPrivate: row.isPrivate ?? false,
      },
    };
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Unable to load your profile right now. Please try again later.",
    });
  }
}

export async function updateOwnProfile(
  db: Db,
  userId: string,
  input: UpdateOwnProfileInput
): Promise<{ success: true; data: ProfileRow }> {
  const data: { biography?: string | null; isPrivate?: boolean } = {};
  const biography = normalizeBiography(input.biography);
  if (biography !== undefined) {
    data.biography = biography;
  }
  const isPrivate = normalizeIsPrivate(input.isPrivate);
  if (isPrivate !== undefined) {
    data.isPrivate = isPrivate;
  }
  // Profile writes never touch role membership, but the repository seam
  // takes the shared user store handle.
  const repository = createUserRepository(db);
  try {
    const row = await repository.updateProfile(userId, data);
    return {
      success: true as const,
      data: {
        id: row.id,
        biography: row.biography ?? null,
        isPrivate: row.isPrivate ?? false,
      },
    };
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Unable to save your profile right now. Please try again later.",
    });
  }
}
