// src/types/next-auth.d.ts

import type { Prisma } from "@prisma/client";
import type { DefaultSession } from "next-auth";
import type { RoleName } from "@/lib/roles";

declare module "next-auth" {
  // biome-ignore lint/style/useConsistentTypeDefinitions: interface appropriate to extent Session type
  interface Session {
    user: {
      roles: RoleName[];
      suspended?: boolean;
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
    roles?: RoleName[];
    suspended?: boolean;
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
