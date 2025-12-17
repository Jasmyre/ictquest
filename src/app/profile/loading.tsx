import { LearningProgressCardLoading } from "@/components/pages/profile/learning-progress-card-loading";
import { ProfileInfoCardLoading } from "@/components/pages/profile/profile-info-card-loading";
import { AchievementsCardLoading } from "../../components/pages/profile/achievements-card-loading";

export default function LoadingProfile() {
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
            <ProfileInfoCardLoading />
            <LearningProgressCardLoading />
            <AchievementsCardLoading />
          </div>
        </div>
      </div>
    </main>
  );
}
