import type { PrismaClient } from "@prisma/client";
import {
  listPersonalAccessTokens,
  mintPersonalAccessToken,
  type PublicPat,
  revokePersonalAccessToken,
  toPublicPat,
} from "@/server/auth/personal-access-tokens";
import type { CreateTokenInput, TokenIdInput } from "@/server/schemas/token";

/**
 * Token service (spec #57: owner-scoped PAT lifecycle, tRPC-only).
 *
 * Thin domain tier over the hash-only PAT store in
 * `src/server/auth/personal-access-tokens.ts`: the tRPC `token` router
 * calls these helpers with the session user id, so every operation stays
 * scoped to the caller's own tokens. No procedure here accepts a foreign
 * user id, and no output ever carries the hash or a listable plain token.
 */

type Db = Pick<PrismaClient, "personalAccessToken">;

export async function listTokens(
  db: Db,
  userId: string
): Promise<{ success: true; data: PublicPat[] }> {
  const tokens = await listPersonalAccessTokens(db, userId);
  return { success: true as const, data: tokens };
}

export async function createToken(
  db: Db,
  userId: string,
  input: CreateTokenInput
): Promise<{
  success: true;
  data: { token: PublicPat; plainToken: string };
}> {
  const { record, plainToken } = await mintPersonalAccessToken(db, userId, {
    name: input.name,
    scopes: input.scopes,
    expiresAt: input.expiresAt,
  });
  return {
    success: true as const,
    data: { token: toPublicPat(record), plainToken },
  };
}

export async function revokeToken(
  db: Db,
  userId: string,
  input: TokenIdInput
): Promise<{ success: true; data: PublicPat }> {
  const token = await revokePersonalAccessToken(db, userId, input.id);
  return { success: true as const, data: token };
}
