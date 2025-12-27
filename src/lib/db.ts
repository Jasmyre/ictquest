import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import type { DefaultArgs } from "@prisma/client/runtime/client";
import { env } from "@/env";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const createPrismaClient = (): PrismaClient<
  {
    log: ("error" | "query" | "warn")[];
  },
  "error" | "query" | "warn",
  DefaultArgs
> =>
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    adapter,
  });

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}
