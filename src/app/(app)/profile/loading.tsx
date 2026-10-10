import { AchievementsCardLoading } from "@/components/pages/profile/achievements-card-loading";
import { DeleteDataCardLoading } from "@/components/pages/profile/delete-data-card-loading";
import { LearningProgressCardLoading } from "@/components/pages/profile/learning-progress-card-loading";
import { ProfileInfoCardLoading } from "@/components/pages/profile/profile-info-card-loading";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingProfile() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading profile"
      className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8"
    >
      <header className="max-w-2xl">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="mt-3 h-9 w-56 sm:w-72" />
        <Skeleton className="mt-2 h-4 w-64" />
      </header>
      <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-4 sm:gap-4 lg:grid-cols-2">
        <ProfileInfoCardLoading />
        <LearningProgressCardLoading />
        <AchievementsCardLoading />
        <DeleteDataCardLoading />
      </div>
    </main>
  );
}
