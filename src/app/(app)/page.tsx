import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { lessons } from "@/db/lessons";
import { api } from "@/trpc/server";

type DashboardData = Awaited<
  ReturnType<typeof api.dashboard.getMyDashboard>
>["data"];

function nextLesson(progressData: DashboardData["progressData"]) {
  for (const lesson of lessons) {
    if (lesson.slug === "test") {
      continue;
    }
    const row = progressData.find((p) => p.topic === lesson.slug);
    const done = new Set(row?.subtopics ?? []);
    const pending = lesson.topics.find((t) => !done.has(t.slug));
    if (pending) {
      return { lesson, pending };
    }
  }
  return null;
}

async function DashboardFetcher() {
  // Per-user dashboard reads stay fresh (no cache directive): the service
  // worker sends dashboard reads to the network and the REST catch-all
  // answers per-user Operations with `private, no-store`.
  const result = await api.dashboard.getMyDashboard();
  const stats = result.success ? result.data : null;
  return <DashboardView stats={stats} />;
}

function DashboardView({ stats }: { stats: DashboardData | null }) {
  const name = stats?.userName?.trim() ? stats.userName : "learner";
  const upcoming = stats ? nextLesson(stats.progressData) : null;

  return (
    <div className="min-h-[80vh] py-10">
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-gray-500 text-sm dark:text-gray-400">
            Your learning at a glance
          </p>
          <h1 className="font-bold text-3xl text-gray-900 leading-tight dark:text-gray-100">
            Welcome back, {name}
          </h1>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {stats ? (
          <div
            className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4"
            data-testid="dashboard-stats"
          >
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Subtopics completed</CardDescription>
                <CardTitle data-testid="stat-subtopics">
                  {stats.totalSubtopicsCompleted}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Achievements</CardDescription>
                <CardTitle data-testid="stat-achievements">
                  {stats.totalAchievements}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Level</CardDescription>
                <CardTitle data-testid="stat-level">{stats.level}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total progress</CardDescription>
                <CardTitle data-testid="stat-total-progress">
                  {stats.totalProgress}%
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        ) : (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <p className="text-muted-foreground">
                Unable to load your dashboard right now. Please try again later.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Continue learning</CardTitle>
              <CardDescription>Pick up where you left off.</CardDescription>
            </CardHeader>
            <CardContent>
              {upcoming ? (
                <div className="flex flex-col gap-3">
                  <p className="font-medium text-sm">
                    {upcoming.lesson.title} — {upcoming.pending.name}
                  </p>
                  <Button asChild className="w-fit">
                    <Link
                      href={`/lessons/subtopic/${upcoming.pending.slug}?topic=${upcoming.lesson.slug}&isBackEnabled=true`}
                    >
                      Resume lesson
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <p className="text-muted-foreground text-sm">
                    {stats
                      ? "All lessons complete — try the final assessment."
                      : "Start with the first lesson."}
                  </p>
                  <Button asChild className="w-fit">
                    <Link href="/lessons">Browse lessons</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick links</CardTitle>
              <CardDescription>Jump to the pages you use most.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button asChild variant="outline">
                <Link href="/lessons">Lessons</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/progress">Progress</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/profile">Profile</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default async function DashboardHomePage() {
  return (
    <Suspense>
      <DashboardFetcher />
    </Suspense>
  );
}
