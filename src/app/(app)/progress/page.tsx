import { Suspense } from "react";
import BackButton from "@/components/back-button";
import { ProgressCard } from "@/components/pages/progress/progress-card";
import { api } from "@/trpc/server";

async function page() {
  return (
    <Suspense>
      <Fetcher />
    </Suspense>
  );
}

const Fetcher = async () => {
  // Slice 5 (#62): owner dashboard is the derived view over progress —
  // list plus self dashboard from the dashboard router.
  const [userProgress, userStats] = await Promise.all([
    api.progress.list({}),
    api.dashboard.getMyDashboard(),
  ]);
  return <Renderer userProgress={userProgress} userStats={userStats} />;
};

const Renderer = async ({
  userProgress,
  userStats,
}: {
  userProgress: Awaited<ReturnType<typeof api.progress.list>>;
  userStats: Awaited<ReturnType<typeof api.dashboard.getMyDashboard>>;
}) => {
  // Per-user progress plus stats must always read fresh (ADR 0005): no cache
  // directive here. Static lesson metadata stays cached separately.
  const stats = userStats.success ? userStats.data : null;

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
              {stats ? (
                <div
                  className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4"
                  data-testid="progress-stats"
                >
                  <div data-testid="stat-subtopics">
                    <p className="text-gray-500 text-sm">Subtopics completed</p>
                    <p className="font-bold text-2xl">
                      {stats.totalSubtopicsCompleted}
                    </p>
                  </div>
                  <div data-testid="stat-achievements">
                    <p className="text-gray-500 text-sm">Achievements</p>
                    <p className="font-bold text-2xl">
                      {stats.totalAchievements}
                    </p>
                  </div>
                  <div data-testid="stat-level">
                    <p className="text-gray-500 text-sm">Level</p>
                    <p className="font-bold text-2xl">{stats.level}</p>
                  </div>
                  <div data-testid="stat-total-progress">
                    <p className="text-gray-500 text-sm">Total progress</p>
                    <p className="font-bold text-2xl">{stats.totalProgress}%</p>
                  </div>
                </div>
              ) : null}
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
};

export default page;
