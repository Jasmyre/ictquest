import { createHash, randomBytes } from "node:crypto";
import type { PrismaClient } from "@prisma/client";

type PatDb = Pick<PrismaClient, "personalAccessToken">;

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
  const record = await db.personalAccessToken.create({
    data: {
      userId,
      name: options.name,
      tokenHash,
      scopes: options.scopes ?? [],
      expiresAt: options.expiresAt ?? null,
    },
  });
  return { record, plainToken };
}

export async function verifyPersonalAccessToken(db: PatDb, plainToken: string) {
  if (!plainToken || typeof plainToken !== "string") {
    return null;
  }
  const tokenHash = hashPersonalAccessToken(plainToken);
  const record = await db.personalAccessToken.findUnique({
    where: { tokenHash },
  });
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
    await db.personalAccessToken.update({
      where: { id: record.id },
      data: { lastUsedAt: new Date() },
    });
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
