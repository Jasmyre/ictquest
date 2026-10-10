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
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 max-w-2xl">
          <p className="text-muted-foreground text-sm">
            Account, progress, and milestones
          </p>
          <h1 className="mt-1 truncate font-bold text-2xl text-foreground leading-tight tracking-tight sm:text-3xl">
            {displayName}&rsquo;s profile
          </h1>
          <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
            Manage your identity, review mastery, and control your data.
          </p>
        </div>
      </header>
      <div className="stagger-enter mt-6 grid grid-cols-1 gap-3 sm:mt-4 sm:gap-4 lg:grid-cols-2">
        <ProfileInfoCard getUser={getUser} />
        <LearningProgressCard getUserProgress={userProgress} />
        <AchievementsCard getUserAchievements={getUserAchievements} />
        <DeleteDataCard />
      </div>
    </main>
  );
}

export default page;
