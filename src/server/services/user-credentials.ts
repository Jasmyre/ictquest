import "server-only";
import type { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { createUserRepository } from "@/server/repositories/user";

/**
 * User credentials service (spec #81, ticket #84).
 *
 * Owns email/password domain rules; persistence lives in
 * `src/server/repositories/user.ts`. Never evaluates permissions —
 * the User router guards with `permissionProcedure("User", "update")`
 * plus a row-level re-check before delegating here.
 */

type Db = Pick<PrismaClient, "user" | "role">;

export const PASSWORD_MIN_LENGTH = 8;
const BCRYPT_COST = 10;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HAS_LETTER_PATTERN = /[A-Za-z]/;
const HAS_DIGIT_PATTERN = /[0-9]/;

/**
 * Normalize a raw email: trim, lowercase, reject bad shapes.
 */
export function normalizeEmail(value: string): string {
  const normalized = value.trim().toLowerCase();
  if (normalized.length === 0 || !EMAIL_PATTERN.test(normalized)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Enter a valid email address.",
    });
  }
  return normalized;
}

/**
 * Grade a candidate password: at least 8 characters with at least one
 * letter and one number. Returns the password unchanged when strong.
 */
export function assertStrongPassword(value: string): string {
  if (value.length < PASSWORD_MIN_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `New password must be at least ${PASSWORD_MIN_LENGTH} characters.`,
    });
  }
  if (!(HAS_LETTER_PATTERN.test(value) && HAS_DIGIT_PATTERN.test(value))) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "New password must contain both a letter and a number.",
    });
  }
  return value;
}

export type AccountStatus = {
  id: string;
  email: string | null;
  emailVerified: Date | null;
  hasPassword: boolean;
};

export async function getOwnAccount(
  db: Db,
  userId: string
): Promise<{ success: true; data: AccountStatus }> {
  const repository = createUserRepository(db);
  try {
    const row = await repository.findCredentials(userId);
    if (!row) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found." });
    }
    return {
      success: true as const,
      data: {
        id: row.id,
        email: row.email,
        emailVerified: row.emailVerified,
        hasPassword: row.password !== null,
      },
    };
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Unable to load your account right now. Please try again later.",
    });
  }
}

export type EmailChangeResult = {
  id: string;
  email: string | null;
  emailVerified: Date | null;
  verificationRequired: boolean;
};

export async function updateOwnEmail(
  db: Db,
  userId: string,
  rawEmail: string
): Promise<{ success: true; data: EmailChangeResult }> {
  const email = normalizeEmail(rawEmail);
  const repository = createUserRepository(db);
  try {
    const current = await repository.findCredentials(userId);
    if (!current) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found." });
    }
    if (current.email === email) {
      return {
        success: true as const,
        data: {
          id: current.id,
          email: current.email,
          emailVerified: current.emailVerified,
          verificationRequired: false,
        },
      };
    }
    const taken = await repository.findByEmail(email);
    if (taken && taken.id !== userId) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "That email is already in use.",
      });
    }
    const row = await repository.updateEmail(userId, email);
    return {
      success: true as const,
      data: {
        id: row.id,
        email: row.email,
        emailVerified: row.emailVerified,
        verificationRequired: true,
      },
    };
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Unable to save your email right now. Please try again later.",
    });
  }
}

export async function changeOwnPassword(
  db: Db,
  userId: string,
  input: { currentPassword: string; newPassword: string }
): Promise<{ success: true }> {
  assertStrongPassword(input.newPassword);
  const repository = createUserRepository(db);
  try {
    const row = await repository.findCredentials(userId);
    if (!row) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found." });
    }
    if (!row.password) {
      throw new TRPCError({
        code: "CONFLICT",
        message:
          "No password is set on this account yet — set one instead of changing it.",
      });
    }
    const proof = await bcrypt.compare(input.currentPassword, row.password);
    if (!proof) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Your current password is incorrect.",
      });
    }
    await repository.updatePassword(
      userId,
      await bcrypt.hash(input.newPassword, BCRYPT_COST)
    );
    return { success: true as const };
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message:
        "Unable to change your password right now. Please try again later.",
    });
  }
}

export async function setOwnPassword(
  db: Db,
  userId: string,
  input: { newPassword: string }
): Promise<{ success: true }> {
  assertStrongPassword(input.newPassword);
  const repository = createUserRepository(db);
  try {
    const row = await repository.findCredentials(userId);
    if (!row) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found." });
    }
    if (row.password) {
      throw new TRPCError({
        code: "CONFLICT",
        message:
          "A password is already set — change it with your current password instead.",
      });
    }
    await repository.updatePassword(
      userId,
      await bcrypt.hash(input.newPassword, BCRYPT_COST)
    );
    return { success: true as const };
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Unable to set your password right now. Please try again later.",
    });
  }
}
