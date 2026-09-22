import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import type * as z from "zod";
import { getUserByEmail } from "@/data/user";
import type { RoleName } from "@/lib/roles";
import { LogInSchema } from "@/schemas";
import { env } from "./env";

export const runtime = "nodejs";

export default {
  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    GitHub({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        // Any unexpected fault (DB, bcrypt) must answer `null`
        // (CredentialsSignin → "Invalid credentials!"), never throw:
        // a throw surfaces as `error=Configuration` on the error page.
        try {
          const validatedFields = LogInSchema.safeParse(credentials);

          if (validatedFields.success) {
            const { email, password } = validatedFields.data as z.infer<
              typeof LogInSchema
            >;

            const user = await getUserByEmail(email);

            if (!user?.password) {
              return null;
            }

            // Suspended users are blocked at sign-in (#72): roles underneath
            // are preserved, so unsuspend restores access with no re-grant.
            if (user.suspendedAt !== null) {
              return null;
            }

            const passwordsMatch = await bcrypt.compare(
              password,
              user.password
            );

            if (passwordsMatch) {
              return user;
            }
          }

          return null;
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // Edge-safe propagation: the proxy (`src/proxy.ts`) builds its own
    // NextAuth instance from this config, so its session must carry the
    // Role list or the ADMIN guard denies every admin path. The Role list
    // itself is stamped onto the token by the node `jwt` callback in
    // `src/auth.ts`; this only copies token payload into the session shape
    // (no database read, safe at the edge). `src/auth.ts` overrides
    // `callbacks` for node use, so server behavior stays unchanged.
    session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (session.user) {
        const roles = (token as { roles?: unknown }).roles;
        session.user.roles = Array.isArray(roles) ? (roles as RoleName[]) : [];
        session.user.suspended =
          (token as { suspended?: unknown }).suspended === true;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
