import { expect, test as setup } from "@playwright/test";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  DATABASE_URL_TEST,
  e2eSeeded,
  PRIVATE_ACCOUNT,
  PROFILE_PASSWORD,
  PROGRESS_SUBTOPICS,
  PROGRESS_TOPIC,
  PUBLIC_WITH_BIO,
  PUBLIC_WITHOUT_BIO,
  SEEDED_ACHIEVEMENTS,
  STORAGE_STATE,
  VISITOR,
} from "../fixtures/profile-accounts";

/**
 * Profile sign-off setup (#95).
 *
 * Writes the three public/private learner rows plus the visitor into the test
 * database with a direct Prisma client on `DATABASE_URL_TEST` (the pattern the
 * integration suite uses), then signs the visitor in through the real
 * credentials form and saves `storageState` for the authed profile project.
 * Skips cleanly when no test database is configured.
 */

setup.skip(
  !e2eSeeded,
  "DATABASE_URL_TEST is not set; point the e2e server and this setup at a test database to run the /user/[id] sign-off."
);

function createSeedClient(): PrismaClient {
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: DATABASE_URL_TEST }),
  });
}

async function seedLearner(
  db: PrismaClient,
  input: {
    id: string;
    email: string;
    name: string;
    userName: string;
    biography?: string;
    isPrivate?: boolean;
  },
  passwordHash: string
): Promise<void> {
  await db.user.upsert({
    where: { id: input.id },
    update: {
      name: input.name,
      email: input.email,
      userName: input.userName,
      biography: input.biography ?? null,
      isPrivate: input.isPrivate ?? false,
      password: passwordHash,
      emailVerified: new Date(),
      suspendedAt: null,
    },
    create: {
      id: input.id,
      name: input.name,
      email: input.email,
      userName: input.userName,
      biography: input.biography ?? null,
      isPrivate: input.isPrivate ?? false,
      password: passwordHash,
      emailVerified: new Date(),
    },
  });
}

async function seedData(db: PrismaClient): Promise<void> {
  const passwordHash = await bcrypt.hash(PROFILE_PASSWORD, 10);

  await seedLearner(db, VISITOR, passwordHash);
  await seedLearner(db, PUBLIC_WITH_BIO, passwordHash);
  await seedLearner(db, PUBLIC_WITHOUT_BIO, passwordHash);
  await seedLearner(db, { ...PRIVATE_ACCOUNT, isPrivate: true }, passwordHash);

  for (const achievement of SEEDED_ACHIEVEMENTS) {
    await db.achievement.upsert({
      where: { name: achievement.name },
      update: { description: achievement.description },
      create: { name: achievement.name, description: achievement.description },
    });
  }

  await db.progressData.deleteMany({ where: { userId: PUBLIC_WITH_BIO.id } });
  await db.progressData.create({
    data: {
      userId: PUBLIC_WITH_BIO.id,
      topic: PROGRESS_TOPIC,
      subtopics: [...PROGRESS_SUBTOPICS],
    },
  });

  await db.userAchievement.deleteMany({
    where: { userId: PUBLIC_WITH_BIO.id },
  });
  for (const achievement of SEEDED_ACHIEVEMENTS) {
    const stored = await db.achievement.findUnique({
      where: { name: achievement.name },
    });
    if (stored) {
      await db.userAchievement.create({
        data: {
          userId: PUBLIC_WITH_BIO.id,
          achievementId: stored.id,
          achievementName: achievement.name,
          achievementDescription: achievement.description,
          unlockedAt: achievement.unlockedAt,
        },
      });
    }
  }

  await db.progressData.deleteMany({
    where: { userId: PUBLIC_WITHOUT_BIO.id },
  });
  await db.userAchievement.deleteMany({
    where: { userId: PUBLIC_WITHOUT_BIO.id },
  });
}

setup("seed profiles and sign in the visitor", async ({ page }) => {
  const db = createSeedClient();
  try {
    await seedData(db);
  } finally {
    await db.$disconnect();
  }

  await page.goto("/auth");
  await page.getByPlaceholder("johndoe@example.com").last().fill(VISITOR.email);
  await page.getByPlaceholder("******").last().fill(PROFILE_PASSWORD);
  await page.getByRole("button", { name: "Sign In" }).click();

  await page.waitForURL("/");
  await expect(page).toHaveURL("/");

  await page.context().storageState({ path: STORAGE_STATE });
});
