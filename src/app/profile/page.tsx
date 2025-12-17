import { AchievementsCard } from "@/components/pages/profile/achievements-card";
import { DeleteDataCard } from "@/components/pages/profile/delete-data-card";
import { LearningProgressCard } from "@/components/pages/profile/learning-progress-card";
import { ProfileInfoCard } from "@/components/pages/profile/profile-info-card";
import { api } from "@/trpc/server";

export default async function ProfilePage() {
  try {
    const [getUser, userProgress, getUserAchievements] = await Promise.all([
      api.user.getUser(),
      api.user.getUserProgress({}),
      api.user.getUserAchievements({}),
    ]);

    return (
      <main>
        <div className="min-h-[80vh] py-10">
          <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="font-bold text-3xl text-gray-900 leading-tight dark:text-gray-100">
              Your Profile
            </h1>
          </header>
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <ProfileInfoCard getUser={getUser} />
              <LearningProgressCard getUserProgress={userProgress} />
              <AchievementsCard getUserAchievements={getUserAchievements} />
              <DeleteDataCard />
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error("TRPC Error:", error);

    return (
      <main>
        <div className="py-10">
          <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="font-bold text-3xl text-gray-900 leading-tight dark:text-gray-100">
              Your Profile
            </h1>
          </header>
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              Unable to load your profile right now. Please try again later.
            </div>
          </div>
        </div>
      </main>
    );
  }
}
