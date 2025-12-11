import { db } from "@/lib/db";

interface UnlockUserAchievement {
  message: string;
  achievement: {
    id: number;
    userId: string;
    achievementId: number;
    achievementName: string;
    achievementDescription: string;
    unlockedAt: Date;
  };
  status: string;
}

export async function unlockUserAchievement(
  userId: string | null | undefined,
  achievementName: string
): Promise<UnlockUserAchievement> {
  if (!userId) {
    throw new Error("Invalid user id");
  }

  const achievement = await db.achievement.findUnique({
    where: { name: achievementName },
  });

  if (!achievement) {
    throw new Error("Achievement not found");
  }

  const existingUnlock = await db.userAchievement.findUnique({
    where: {
      userId_achievementId: {
        userId,
        achievementId: achievement.id,
      },
    },
  });

  if (existingUnlock) {
    return {
      message: "Achievement already unlocked",
      achievement: existingUnlock,
      status: "unlocked",
    };
  }

  const newUnlock = await db.userAchievement.create({
    data: {
      userId,
      achievementId: achievement.id,
      achievementName: achievement.name,
      achievementDescription: achievement.description || "No description",
    },
  });

  return {
    message: "Achievement unlocked!",
    achievement: newUnlock,
    status: "new",
  };
}
