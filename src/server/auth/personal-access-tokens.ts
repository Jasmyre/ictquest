import { createHash, randomBytes } from "node:crypto";
import type { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import {
  createTokenRepository,
  type TokenRow,
} from "@/server/repositories/token";

type PatDb = Pick<PrismaClient, "personalAccessToken">;

type PatRecord = TokenRow;

export type PublicPat = Omit<PatRecord, "tokenHash">;

export type MintPatOptions = {
  name: string;
  scopes?: string[];
  expiresAt?: Date;
};

const TOKEN_PREFIX = "ictq_";
const TOKEN_BYTES = 32;
const BEARER_TOKEN_PATTERN = /^Bearer\s+(.+)$/i;

/**
 * Hash-only PAT storage (Migration 18, #41 / ADR 0002).
 *
 * The plain token is returned once at mint time and never persisted.
 * Only its SHA-256 hex digest is stored in `PersonalAccessToken.tokenHash`.
 */
export function hashPersonalAccessToken(plainToken: string): string {
  return createHash("sha256").update(plainToken, "utf8").digest("hex");
}

function newPlainToken(): string {
  return `${TOKEN_PREFIX}${randomBytes(TOKEN_BYTES).toString("base64url")}`;
}

export async function mintPersonalAccessToken(
  db: PatDb,
  userId: string,
  options: MintPatOptions
) {
  const plainToken = newPlainToken();
  const tokenHash = hashPersonalAccessToken(plainToken);
  const record = await createTokenRepository(db).create({
    userId,
    name: options.name,
    tokenHash,
    scopes: options.scopes ?? [],
    expiresAt: options.expiresAt ?? null,
  });
  return { record, plainToken };
}

export async function verifyPersonalAccessToken(db: PatDb, plainToken: string) {
  if (!plainToken || typeof plainToken !== "string") {
    return null;
  }
  const tokenHash = hashPersonalAccessToken(plainToken);
  const record = await createTokenRepository(db).findByHash(tokenHash);
  if (!record) {
    return null;
  }
  if (record.revokedAt) {
    return null;
  }
  if (record.expiresAt && record.expiresAt.getTime() <= Date.now()) {
    return null;
  }
  try {
    await createTokenRepository(db).stampUsed(record.id);
  } catch {
    // lastUsedAt is best-effort; verification already succeeded.
  }
  return record;
}

export function extractBearerToken(
  authorizationHeader: string | null | undefined
): string | null {
  if (!authorizationHeader) {
    return null;
  }
  const match = authorizationHeader.match(BEARER_TOKEN_PATTERN);
  if (!match?.[1]) {
    return null;
  }
  const token = match[1].trim();
  return token.length > 0 ? token : null;
}

export function toPublicPat(record: PatRecord): PublicPat {
  return {
    id: record.id,
    userId: record.userId,
    name: record.name,
    scopes: record.scopes,
    expiresAt: record.expiresAt,
    lastUsedAt: record.lastUsedAt,
    createdAt: record.createdAt,
    revokedAt: record.revokedAt,
  };
}

/**
 * Owner-scoped PAT listing (spec #57).
 *
 * Returns only the caller's tokens in creation order, with the hash
 * stripped — hashes never leave the server. The plain token is not
 * stored anywhere, so it cannot be listed either. Persistence lives in
 * `src/server/repositories/token.ts`; this module owns the rule only.
 */
export async function listPersonalAccessTokens(
  db: PatDb,
  userId: string
): Promise<PublicPat[]> {
  const rows = await createTokenRepository(db).listByUser(userId);
  return rows.map(toPublicPat);
}

/**
 * Idempotent owner-scoped PAT revoke (spec #57).
 *
 * Sets `revokedAt` once; revoking an already-revoked token succeeds with
 * the same row (revoking twice is safe). A missing id — or one owned by
 * someone else — answers FORBIDDEN, never NOT_FOUND, so callers cannot
 * probe other users' token ids (anti-probing, per `permissions.ts`).
 * Persistence lives in `src/server/repositories/token.ts`.
 */
export async function revokePersonalAccessToken(
  db: PatDb,
  userId: string,
  tokenId: string
): Promise<PublicPat> {
  const repository = createTokenRepository(db);
  const record = await repository.findOwned(userId, tokenId);
  if (!record) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You do not have permission to perform this action.",
    });
  }
  if (record.revokedAt) {
    return toPublicPat(record);
  }
  const revoked = await repository.markRevoked(record.id);
  return toPublicPat(revoked);
}
