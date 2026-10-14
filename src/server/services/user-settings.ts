import "server-only";
import type { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { createUserRepository } from "@/server/repositories/user";
import { normalizeBiography } from "@/server/services/user-profile";

type Db = Pick<PrismaClient, "user" | "role">;

export type SettingsData = import("@/server/repositories/user").SettingsRow;

export type UpdateSettingsInput = {
  name?: string;
  biography?: string | null;
  isPrivate?: boolean;
};

function normalizeName(value: string | undefined): string | undefined {
  if (value === undefined) {
    return;
  }
  return value.trim();
}

export async function getSettings(
  db: Db,
  userId: string
): Promise<{ success: true; data: SettingsData }> {
  const repository = createUserRepository(db);
  try {
    const row = await repository.findSettings(userId);
    if (!row) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found." });
    }
    return { success: true as const, data: row };
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message:
        "Unable to load your settings right now. Please try again later.",
    });
  }
}

export async function updateSettings(
  db: Db,
  userId: string,
  input: UpdateSettingsInput
): Promise<{ success: true; data: SettingsData }> {
  const data: {
    name?: string;
    biography?: string | null;
    isPrivate?: boolean;
  } = {};
  const name = normalizeName(input.name);
  if (name !== undefined) {
    data.name = name;
  }
  const biography = normalizeBiography(input.biography);
  if (biography !== undefined) {
    data.biography = biography;
  }
  if (input.isPrivate !== undefined) {
    data.isPrivate = input.isPrivate;
  }
  const repository = createUserRepository(db);
  try {
    const row = await repository.updateSettings(userId, data);
    return { success: true as const, data: row };
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message:
        "Unable to save your settings right now. Please try again later.",
    });
  }
}

export async function updateEmail(
  db: Db,
  userId: string,
  email: string
): Promise<{ success: true; data: SettingsData }> {
  const normalized = email.trim().toLowerCase();
  const repository = createUserRepository(db);
  try {
    const credentials = await repository.findPasswordHash(userId);
    if (!credentials) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found." });
    }
    if (credentials.password === null) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message:
          "Add a password before changing your email — provider sign-ins keep the original address.",
      });
    }
    const taken = await repository.findByEmail(normalized);
    if (taken && taken.id !== userId) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Email is already taken.",
      });
    }
    const row = await repository.updateEmail(userId, normalized);
    return { success: true as const, data: row };
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Unable to change your email right now. Please try again later.",
    });
  }
}

export async function updatePassword(
  db: Db,
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<{ success: true }> {
  const repository = createUserRepository(db);
  try {
    const credentials = await repository.findPasswordHash(userId);
    if (!credentials) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found." });
    }
    if (credentials.password === null) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No password set yet — set one instead of changing it.",
      });
    }
    const matches = await bcrypt.compare(currentPassword, credentials.password);
    if (!matches) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Current password is incorrect.",
      });
    }
    const hash = await bcrypt.hash(newPassword, 10);
    await repository.updatePasswordHash(userId, hash);
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

export async function setPassword(
  db: Db,
  userId: string,
  newPassword: string
): Promise<{ success: true }> {
  const repository = createUserRepository(db);
  try {
    const credentials = await repository.findPasswordHash(userId);
    if (!credentials) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found." });
    }
    if (credentials.password !== null) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Password already set — change it instead.",
      });
    }
    const hash = await bcrypt.hash(newPassword, 10);
    await repository.updatePasswordHash(userId, hash);
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
