import { PrismaAdapter } from "@auth/prisma-adapter";
import type { UserRole } from "@prisma/client";
import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { getUserById } from "@/data/user";
import { db } from "@/lib/db";
import type { RoleName } from "@/lib/roles";
import { ensureDefaultRole } from "@/lib/roles";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/auth",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    redirect({ baseUrl }) {
      return baseUrl;
    },
    session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
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

      const existingUser = await getUserById(token.sub);

      if (!existingUser) {
        return token;
      }

      token.role = existingUser?.role;
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
  ...authConfig,
});
