// scripts/reset-password.mjs — set a user's password to a known value.
// Usage: node scripts/reset-password.mjs --user "<email|userName>"
//        --password "<new-password>" [--db dev|prod]
// Safety: defaults to the Development database. Production requires an
// explicit --confirm-prod flag. New password must be 6+ characters (matches
// the registration contract). Prints no secrets on failure paths.
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { config as loadDotenv } from "dotenv";

loadDotenv();
loadDotenv({ path: ".env.local", override: false });

const args = process.argv.slice(2);
const get = (flag) => args[args.indexOf(flag) + 1];
const userId = get("--user");
const password = get("--password");
const target = get("--db") ?? "dev";
const confirmProd = args.includes("--confirm-prod");

if (!(userId && password && ["dev", "prod"].includes(target))) {
  console.error(
    'Usage: node scripts/reset-password.mjs --user "<email|userName>" --password "<new-password>" [--db dev|prod]'
  );
  process.exit(2);
}
if (password.length < 6) {
  console.error("Refusing: new password must be 6+ characters.");
  process.exit(2);
}
if (target === "prod" && !confirmProd) {
  console.error(
    "Refusing: add --confirm-prod to write to the Production database."
  );
  process.exit(2);
}

const connectionString =
  target === "prod"
    ? process.env.DATABASE_URL
    : (process.env.DATABASE_URL_DEV ?? process.env.DATABASE_URL);
if (!connectionString) {
  console.error("Refusing: resolved database URL is empty.");
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString });
const db = new PrismaClient({ adapter });
try {
  const user = await db.user.findFirst({
    where: { OR: [{ email: userId }, { userName: userId }] },
    select: { id: true, email: true },
  });
  if (!user) {
    console.error("No user found for that identifier.");
    process.exit(1);
  }
  await db.user.update({
    where: { id: user.id },
    data: { password: await bcrypt.hash(password, 10) },
  });
  console.log(`Password reset for ${user.email ?? user.id} on ${target}.`);
} finally {
  await db.$disconnect();
}
