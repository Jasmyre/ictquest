import type { Session } from "next-auth";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getUserRoleNames } from "@/lib/roles";
import {
  extractBearerToken,
  verifyPersonalAccessToken,
} from "@/server/auth/personal-access-tokens";
import { createUserRepository } from "@/server/repositories/user";

/**
 * Versioned REST context (Migration 18, #41 / ADR 0002 + ADR 0005).
 *
 * One procedure accepts bearer PAT (service/mobile) or cookie (web):
 * - `Authorization: Bearer <token>` is verified against the hash-only
 *   `PersonalAccessToken` store (expiry + revocation enforced, `lastUsedAt`
 *   stamped). The token owner plus its current `roles[]` become the user.
 * - Otherwise falls back to the cookie/JWT session via `auth()`.
 *
 * Batch tRPC (`/api/trpc`) stays cookie-only: it keeps using
 * `createTRPCContext` directly and never calls this resolver.
 */
export async function resolveV1UserFromRequest(req: Request): Promise<{
  user: Session["user"] | null;
}> {
  const bearer = extractBearerToken(req.headers.get("authorization"));
  if (bearer) {
    const record = await verifyPersonalAccessToken(db, bearer).catch(
      () => null
    );
    if (record) {
      // Token-owner lookup goes through the user repository, never an
      // inline `db.user` query (Slice 6, #63).
      const owner = await createUserRepository(db)
        .findById(record.userId)
        .catch(() => null);
      if (owner) {
        const roles = await getUserRoleNames(owner.id).catch(() => []);
        return {
          user: {
            ...owner,
            roles,
          } as unknown as Session["user"],
        };
      }
    }
    return { user: null };
  }

  const session = await auth().catch(() => null);
  return { user: session?.user ?? null };
}

export async function createV1Context(opts: {
  headers: Headers;
  req: Request;
}): Promise<{
  headers: Headers;
  db: typeof db;
  user: Session["user"] | null;
}> {
  const { user } = await resolveV1UserFromRequest(opts.req);
  return { db, user, headers: opts.headers };
}
