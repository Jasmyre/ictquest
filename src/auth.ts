import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { authEvents } from "@/auth-events";
import { getUserWithRoles } from "@/data/user";
import { db } from "@/lib/db";
import type { RoleName } from "@/lib/roles";
import { ensureDefaultRole } from "@/lib/roles";

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
    session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (session.user) {
        session.user.roles = (token.roles as RoleName[] | undefined) ?? [];
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

      // Every sign-in converges on the backfill invariant (zero users without
      // the default "USER" role): empty memberships are healed and ADMIN-only
      // memberships gain USER, so nobody is ever locked out.
      const roleNames = await ensureDefaultRole(token.sub);
      token.roles = [...roleNames];

      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...baseAuthConfig,
});
