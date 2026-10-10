import { AchievementsCard } from "@/components/pages/profile/achievements-card";
import { DeleteDataCard } from "@/components/pages/profile/delete-data-card";
import { LearningProgressCard } from "@/components/pages/profile/learning-progress-card";
import { ProfileInfoCard } from "@/components/pages/profile/profile-info-card";
import { api } from "@/trpc/server";

async function page() {
  // Canonical achievement slice (#36): inventory list from the achievement
  // router, fed by the same service as the legacy user aliases.
  const [getUser, userProgress, getUserAchievements] = await Promise.all([
    api.user.getUser(),
    api.user.getUserProgress({}),
    api.achievement.list({}),
  ]);

  const displayName = getUser.data?.name?.trim() || "learner";

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <h1 className="sr-only">{displayName}’s profile</h1>
      <div className="stagger-enter grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
        <ProfileInfoCard getUser={getUser} />
        <LearningProgressCard getUserProgress={userProgress} />
        <AchievementsCard getUserAchievements={getUserAchievements} />
        <DeleteDataCard />
      </div>
    </div>
  );
}

export default page;
