import { config } from "dotenv";

/**
 * Seeded identities for the `/user/[id]` sign-off spec (#95).
 *
 * The setup project seeds these rows with a direct Prisma client against
 * `DATABASE_URL_TEST` (the same direct-write pattern the integration suite
 * uses) and then signs the visitor in through the real credentials form, so
 * the spec runs against a genuine NextAuth JWT session. When no test database
 * is configured every seeded spec skips cleanly, matching the integration
 * suite's `DATABASE_URL_TEST` gate.
 */

config({ path: ".env.test", quiet: true });
config({ path: ".env", quiet: true });

export const DATABASE_URL_TEST = process.env.DATABASE_URL_TEST ?? "";
export const e2eSeeded = DATABASE_URL_TEST.length > 0;

export const PROFILE_PASSWORD = "E2ePassword123!";

export const VISITOR = {
  id: "e2e-visitor",
  email: "e2e-visitor@example.com",
  name: "E2E Visitor",
  userName: "E2E Visitor",
} as const;

export const PUBLIC_WITH_BIO = {
  id: "e2e-public-bio",
  email: "e2e-public-bio@example.com",
  name: "Priya Bio",
  userName: "Priya Bio",
  biography:
    "Front-end learner chasing accessible, fast HTML. Currently deep in semantic markup.",
} as const;

export const PUBLIC_WITHOUT_BIO = {
  id: "e2e-public-empty",
  email: "e2e-public-empty@example.com",
  name: "Noor Empty",
  userName: "Noor Empty",
} as const;

export const PRIVATE_ACCOUNT = {
  id: "e2e-private",
  email: "e2e-private@example.com",
  name: "Casey Private",
  userName: "Casey Private",
  biography: "This biography must never leak to a visitor.",
} as const;

export const SEEDED_ACHIEVEMENTS = [
  {
    id: 1,
    name: "First Steps",
    description: "Complete your first subtopic",
    unlockedAt: new Date("2026-01-01T00:00:00.000Z"),
  },
  {
    id: 2,
    name: "HTML Hero",
    description: "Finish the introduction to HTML",
    unlockedAt: new Date("2026-02-01T00:00:00.000Z"),
  },
] as const;

export const PROGRESS_TOPIC = "introduction-to-html";
export const PROGRESS_SUBTOPICS = ["html_introduction", "html_brief_examples"];

export const STORAGE_STATE = "tests/e2e/.auth/learner.json";

export const MISSING_ID = "e2e-does-not-exist";
