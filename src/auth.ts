import type { DefaultSession } from "next-auth";
import NextAuth from "next-auth";
import authConfig from "@/auth.config";

import type { Prisma, UserRole } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getUserById } from "@/data/user";
import { db } from "@/lib/db";

declare module "next-auth" {
  interface Session {
    user: {
      role: UserRole;
      emailVerified: Date;
      userName: string;
      progressData?: {
        id?: string;
        topic: string;
        subtopics?: Prisma.ProgressDataCreatesubtopicsInput | string[];
        user: Prisma.UserCreateNestedOneWithoutProgressDataInput;
      };
    } & DefaultSession["user"];
  }
}

declare module "@auth/core" {
  interface JWT {
    role?: UserRole;
    emailVerified?: Date;
    userName?: string;
    progressData?: {
      id?: string;
      topic: string;
      subtopics?: Prisma.ProgressDataCreatesubtopicsInput | string[];
      user: Prisma.UserCreateNestedOneWithoutProgressDataInput;
    };
  }
}

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
    async redirect({ baseUrl }) {
      return baseUrl;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      session.user.emailVerified = token.emailVerified as Date;

      if (token.userName && session.user) {
        session.user.userName = token.userName as string;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      token.role = existingUser?.role;
      token.emailVerified = existingUser?.emailVerified;
      token.userName = existingUser?.userName;

      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
