// scripts/db-with-url.mjs
// Run a prisma (or other) command against one named database target.
// Usage: node scripts/db-with-url.mjs <prod|dev|test> -- <command...>
// Example: node scripts/db-with-url.mjs dev -- npx prisma migrate dev
//
// Resolution: prod -> DATABASE_URL (only), dev -> DATABASE_URL_DEV ??
// DATABASE_URL, test -> DATABASE_URL_TEST ?? DATABASE_URL. Exits non-zero
// when the resolved URL is empty so CI fails fast instead of touching the
// wrong database.
import { spawnSync } from "node:child_process";
import { config as loadDotenv } from "dotenv";

loadDotenv();
loadDotenv({ path: ".env.local", override: false });

const [, , target, ...rest] = process.argv;
const sepIndex = rest.indexOf("--");
const command = (sepIndex === -1 ? rest : rest.slice(sepIndex + 1)).filter(
  Boolean
);

if (!["prod", "dev", "test"].includes(target ?? "") || command.length === 0) {
  console.error(
    "Usage: node scripts/db-with-url.mjs <prod|dev|test> -- <command...>"
  );
  process.exit(2);
}

const resolved =
  target === "prod"
    ? process.env.DATABASE_URL
    : target === "dev"
      ? (process.env.DATABASE_URL_DEV ?? process.env.DATABASE_URL)
      : (process.env.DATABASE_URL_TEST ?? process.env.DATABASE_URL);

if (!resolved) {
  console.error(
    target === "prod"
      ? "DATABASE_URL is empty — refusing to run against prod."
      : target === "dev"
        ? "DATABASE_URL_DEV (fallback DATABASE_URL) is empty — refusing to run."
        : "DATABASE_URL_TEST (fallback DATABASE_URL) is empty — refusing to run."
  );
  process.exit(1);
}

const [cmd, ...args] = command;
const result = spawnSync(cmd, args, {
  stdio: "inherit",
  shell: process.platform === "win32",
  env: { ...process.env, DATABASE_URL: resolved },
});
process.exit(result.status ?? 1);
