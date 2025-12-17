import BackButton from "@/components/back-button";
import { ProgressCard } from "@/components/pages/progress/progress-card";
import { api } from "@/trpc/server";

export default async function Progress() {
  const userProgress = await api.user.getUserProgress();

  return (
    <main className="min-h-[80vh]">
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="font-bold text-3xl text-gray-900 leading-tight dark:text-gray-100">
              Your Progress
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <ProgressCard userProgress={userProgress} />
              <br />
              <div>
                <BackButton className="cursor-pointer max-sm:w-full">
                  Go Back
                </BackButton>
              </div>
            </div>
          </div>
        </main>
      </div>
    </main>
  );
}
