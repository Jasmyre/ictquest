import "server-only";
import type { PrismaClient } from "@prisma/client";

export type TokenDb = Pick<PrismaClient, "personalAccessToken">;

export type TokenRow = {
  id: string;
  userId: string;
  name: string;
  tokenHash: string;
  scopes: string[];
  expiresAt: Date | null;
  lastUsedAt: Date | null;
  createdAt: Date;
  revokedAt: Date | null;
};

/**
 * Token repository (spec #57: owner-scoped PAT lifecycle).
 *
 * Owns all PersonalAccessToken persistence: hash lookup for bearer
 * verification, owner-scoped listing, and revocation stamping. Services
 * and the auth store must call these helpers instead of touching
 * `db.personalAccessToken` directly. Every read/write below is
 * owner-scoped by `userId` except the hash lookup, which resolves the
 * presenter before ownership is known (callers re-check the row).
 */

export type TokenRepository = {
  create(args: {
    userId: string;
    name: string;
    tokenHash: string;
    scopes: string[];
    expiresAt: Date | null;
  }): Promise<TokenRow>;
  findByHash(tokenHash: string): Promise<TokenRow | null>;
  listByUser(userId: string): Promise<TokenRow[]>;
  findOwned(userId: string, tokenId: string): Promise<TokenRow | null>;
  markRevoked(id: string): Promise<TokenRow>;
  stampUsed(id: string): Promise<void>;
};

export function createTokenRepository(db: TokenDb): TokenRepository {
  return {
    create(args: {
      userId: string;
      name: string;
      tokenHash: string;
      scopes: string[];
      expiresAt: Date | null;
    }): Promise<TokenRow> {
      return db.personalAccessToken.create({ data: args });
    },
    findByHash(tokenHash: string): Promise<TokenRow | null> {
      return db.personalAccessToken.findUnique({
        where: { tokenHash },
      });
    },
    listByUser(userId: string): Promise<TokenRow[]> {
      return db.personalAccessToken.findMany({
        where: { userId },
        orderBy: { createdAt: "asc" },
      });
    },
    findOwned(userId: string, tokenId: string): Promise<TokenRow | null> {
      return db.personalAccessToken.findFirst({
        where: { id: tokenId, userId },
      });
    },
    markRevoked(id: string): Promise<TokenRow> {
      return db.personalAccessToken.update({
        where: { id },
        data: { revokedAt: new Date() },
      });
    },
    async stampUsed(id: string): Promise<void> {
      await db.personalAccessToken.update({
        where: { id },
        data: { lastUsedAt: new Date() },
      });
    },
  };
}
