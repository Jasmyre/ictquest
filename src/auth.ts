import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { authEvents } from "@/auth-events";
import { getUserWithRoles } from "@/data/user";
import { db } from "@/lib/db";
import type { RoleName } from "@/lib/roles";
import { ensureDefaultRole, isUserSuspended } from "@/lib/roles";

// Edge session propagation lives in `authConfig.callbacks` (used by the
// proxy); the node callbacks below replace it with the full session shape.
const { callbacks: _edgeCallbacks, ...baseAuthConfig } = authConfig;

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/auth",
    error: "/auth/error",
  },
  events: authEvents,
  callbacks: {
    redirect({ baseUrl }) {
      return baseUrl;
    },
    // Suspended users are blocked at sign-in for every provider (#72):
    // Credentials is rejected in `authorize`, OAuth here. Roles underneath
    // stay preserved, so unsuspend restores access with no re-grant.
    async signIn({ user }) {
      if (typeof user.id === "string" && user.id.length > 0) {
        try {
          if (await isUserSuspended(user.id)) {
            return false;
          }
        } catch {
          return true;
        }
      }
      return true;
    },
    session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (session.user) {
        session.user.roles = (token.roles as RoleName[] | undefined) ?? [];
        session.user.suspended = token.suspended === true;
      }

      session.user.emailVerified = token.emailVerified as Date;

      if (token.userName && session.user) {
        session.user.userName = token.userName as string;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) {
        return token;
      }

      const existingUser = await getUserWithRoles(token.sub);

      if (!existingUser) {
        return token;
      }

      token.emailVerified = existingUser?.emailVerified;
      token.userName = existingUser?.userName;

      // Suspended users keep their roles but lose access (#72): stamp the
      // flag so gates and the admin shell deny the existing session without
      // waiting for token expiry. The default-role heal still runs first —
      // suspension never touches memberships, and the USER floor holds even
      // for rows suspended before the #69 backfill converged.
      const roleNames = await ensureDefaultRole(token.sub);
      const suspendedAt = (existingUser as { suspendedAt?: Date | null })
        .suspendedAt;
      const suspended = suspendedAt !== null && suspendedAt !== undefined;
      token.suspended = suspended;
      token.roles = [...roleNames];

      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...baseAuthConfig,
});
