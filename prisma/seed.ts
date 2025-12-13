import { db } from "@/lib/db";

type AchievementsProps = {
  name: string;
  description: string;
};

async function main(): Promise<void> {
  const achievementsData: AchievementsProps[] = [
    // { name: "Clicktastic", description: "Click 1000 times." },
    // { name: "First Steps", description: "Complete your first task." },
    // { name: "Marathon", description: "Play the game for 10 hours." },
    { name: "Newbie", description: "Start your first lesson." },
    { name: "Beginner", description: "Level up as a beginner." },
    { name: "Intermediate", description: "Level up as an intermediate." },
    { name: "Expert", description: "Level up as an expert." },
  ];

  for (const achievement of achievementsData) {
    const existingAchievement = await db.achievement.findUnique({
      where: { name: achievement.name },
    });

    if (existingAchievement) {
      console.log(`Achievement already exists: ${achievement.name}`);
    } else {
      await db.achievement.create({
        data: achievement,
      });
      console.log(`Seeded achievement: ${achievement.name}`);
    }
  }
}

main()
  .then(() => {
    console.log("Seeding finished.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error during seeding:", error);
    process.exit(1);
  });
