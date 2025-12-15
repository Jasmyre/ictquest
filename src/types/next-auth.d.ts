// src/types/next-auth.d.ts

import type { Prisma, UserRole } from "@prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  // biome-ignore lint/style/useConsistentTypeDefinitions: interface appropriate to extent Session type
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
  // biome-ignore lint/style/useConsistentTypeDefinitions: interface appropriate to extent Session type
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
