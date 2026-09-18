import type { NextAuthConfig } from "next-auth";

import { db } from "@/lib/db";
import { ensureDefaultRole } from "@/lib/roles";

/**
 * Auth lifecycle events (adapted from the 3-tier template reference).
 *
 * The template calls `assignDefaultRole` / `updateEmailVerification` on a
 * `user-repository` plus `revalidateCacheTag(ADMIN_USERS_TAG /
 * DASHBOARD_STATS_TAG)`. ictquest has no repository layer and no cache-tag
 * namespace for admin users — the data seam is `src/data/user.ts` +
 * `src/lib/roles.ts` over `src/lib/db.ts`, and user/admin reads run uncached
 * against Postgres (see `src/lib/lessons/cache.ts`). So the same two
 * invariants live here directly:
 *
 * - `linkAccount`: OAuth linking verifies the email.
 * - `createUser`: every new row converges on the default "USER" membership
 *   (same guarantee as the registration transaction in
 *   `src/actions/register.ts` and the jwt `ensureDefaultRole` heal in
 *   `src/auth.ts`).
 *
 * Consumed by `src/auth.ts`. Pure re-exports (`updateEmailVerification`,
 * `assignDefaultRole`) exist so unit tests can pin the helpers without
 * booting NextAuth.
 */

export async function updateEmailVerification(userId: string): Promise<void> {
  await db.user.update({
    where: { id: userId },
    data: { emailVerified: new Date() },
  });
}

export async function assignDefaultRole(userId: string): Promise<void> {
  await ensureDefaultRole(userId);
}

type AuthUserParam = { user: { id?: string | null } };

export const authEvents = {
  async linkAccount({ user }: AuthUserParam) {
    if (!user.id) {
      return;
    }

    await updateEmailVerification(user.id);
  },
  async createUser({ user }: AuthUserParam) {
    if (!user.id) {
      return;
    }

    await assignDefaultRole(user.id);
  },
} satisfies NonNullable<NextAuthConfig["events"]>;
