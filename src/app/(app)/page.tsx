import {
  ArrowRight,
  Award,
  BookOpenCheck,
  CircleCheck,
  CircleDashed,
  Gauge,
  Lock,
  Map as MapIcon,
  Play,
  TrendingUp,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { lessons } from "@/db/lessons";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/server";

type DashboardData = Awaited<
  ReturnType<typeof api.dashboard.getMyDashboard>
>["data"];

type ProgressRow = DashboardData["progressData"][number];

const WHITESPACE_PATTERN = /\s+/;

function initialsOf(name: string): string {
  const parts = name.trim().split(WHITESPACE_PATTERN).filter(Boolean);
  if (parts.length === 0) {
    return "L";
  }
  const first = parts[0]?.charAt(0) ?? "L";
  const last = parts.length > 1 ? (parts.at(-1)?.charAt(0) ?? "") : "";
  return `${first}${last}`.toUpperCase();
}

function lessonProgress(
  lessonSlug: string,
  topicSlugs: string[],
  progressData: ProgressRow[]
): { done: number; total: number; pct: number } {
  const row = progressData.find((p) => p.topic === lessonSlug);
  const doneSet = new Set(row?.subtopics ?? []);
  const done = topicSlugs.filter((slug) => doneSet.has(slug)).length;
  const total = topicSlugs.length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return { done, total, pct };
}

function nextPendingTopic(progressData: ProgressRow[]): {
  lessonSlug: string;
  lessonTitle: string;
  topicName: string;
  topicSlug: string;
} | null {
  for (const lesson of lessons) {
    if (lesson.slug === "test") {
      continue;
    }
    const row = progressData.find((p) => p.topic === lesson.slug);
    const done = new Set(row?.subtopics ?? []);
    const pending = lesson.topics.find((t) => !done.has(t.slug));
    if (pending) {
      return {
        lessonSlug: lesson.slug,
        lessonTitle: lesson.title,
        topicName: pending.name,
        topicSlug: pending.slug,
      };
    }
  }
  return null;
}

const STAT_META = [
  {
    key: "subtopics",
    label: "Subtopics completed",
    hint: "Steps finished across lessons",
    icon: BookOpenCheck,
    testId: "stat-subtopics",
  },
  {
    key: "achievements",
    label: "Achievements",
    hint: "Milestones unlocked",
    icon: Trophy,
    testId: "stat-achievements",
  },
  {
    key: "level",
    label: "Level",
    hint: "Based on average progress",
    icon: Gauge,
    testId: "stat-level",
  },
  {
    key: "progress",
    label: "Total progress",
    hint: "Average completion",
    icon: TrendingUp,
    testId: "stat-progress",
  },
] as const;

function statValue(
  key: (typeof STAT_META)[number]["key"],
  stats: DashboardData
): string {
  switch (key) {
    case "subtopics":
      return String(stats.totalSubtopicsCompleted);
    case "achievements":
      return String(stats.totalAchievements);
    case "level":
      return stats.level;
    case "progress":
      return `${stats.totalProgress}%`;
    default:
      return `${stats.totalProgress}%`;
  }
}

async function DashboardFetcher() {
  const result = await api.dashboard.getMyDashboard();
  const stats = result.success ? result.data : null;
  return <DashboardView stats={stats} />;
}

function DashboardView({ stats }: { stats: DashboardData | null }) {
  const name = stats?.userName?.trim() ? stats.userName : "learner";
  const upcoming = stats ? nextPendingTopic(stats.progressData) : null;
  const totalProgress = stats?.totalProgress ?? 0;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      {/* Header */}
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 max-w-2xl">
          <p className="text-muted-foreground text-sm">
            Your learning at a glance
          </p>
          <h1 className="mt-1 truncate font-bold text-2xl text-foreground leading-tight tracking-tight sm:text-3xl">
            Welcome back, {name}
          </h1>
          <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
            {upcoming
              ? `Up next: ${upcoming.lessonTitle} — ${upcoming.topicName}. Keep the streak going.`
              : "You're all caught up. Review a lesson or take the final assessment."}
          </p>
        </div>
        {stats ? (
          <div className="flex shrink-0 items-center gap-3">
            <Avatar className="h-11 w-11 border">
              {stats.image ? (
                <AvatarImage alt={name} src={stats.image} />
              ) : null}
              <AvatarFallback aria-hidden="true">
                {initialsOf(name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <Badge
                className="w-fit"
                data-testid="stat-level"
                variant="secondary"
              >
                <Award aria-hidden="true" className="mr-1 h-3.5 w-3.5" />
                {stats.level}
              </Badge>
              <div className="mt-1.5 w-40 sm:w-48">
                <Progress
                  aria-label={`Total progress ${totalProgress} percent`}
                  value={totalProgress}
                />
              </div>
            </div>
          </div>
        ) : null}
      </header>

      {stats ? (
        <>
          {/* Stats */}
          <section
            aria-label="Learning statistics"
            className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
            data-testid="dashboard-stats"
          >
            {STAT_META.map((meta, index) => {
              const Icon = meta.icon;
              const testId =
                meta.key === "progress" ? "stat-total-progress" : meta.testId;
              return (
                <Card
                  className="motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 motion-safe:hover:-translate-y-0.5 transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-safe:animate-in motion-safe:hover:shadow-md"
                  key={meta.key}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: "both",
                  }}
                >
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center gap-1.5">
                      <Icon
                        aria-hidden="true"
                        className="h-3.5 w-3.5 text-muted-foreground"
                      />
                      {meta.label}
                    </CardDescription>
                    <CardTitle
                      className="text-2xl tabular-nums sm:text-3xl"
                      data-testid={testId}
                    >
                      {statValue(meta.key, stats)}
                    </CardTitle>
                    <p className="text-muted-foreground text-xs">{meta.hint}</p>
                  </CardHeader>
                </Card>
              );
            })}
          </section>

          <div className="sm:[&>*]:motion-safe:fade-in-0 sm:[&>*]:motion-safe:slide-in-from-bottom-2 mt-3 grid grid-cols-1 gap-3 sm:mt-4 sm:gap-4 lg:grid-cols-3 sm:[&>*]:motion-safe:animate-in">
            {/* Continue learning */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play aria-hidden="true" className="h-4 w-4 text-primary" />
                  Continue learning
                </CardTitle>
                <CardDescription>Pick up where you left off.</CardDescription>
              </CardHeader>
              <CardContent>
                {upcoming ? (
                  <div className="rounded-lg border bg-muted/40 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="font-medium text-sm">
                          {upcoming.lessonTitle} — {upcoming.topicName}
                        </p>
                        <p className="mt-1 text-muted-foreground text-xs">
                          Next subtopic in your path
                        </p>
                      </div>
                      <Button
                        asChild
                        className="w-full transition-transform duration-150 ease-out active:scale-[0.97] sm:w-fit"
                      >
                        <Link
                          href={`/lessons/subtopic/${upcoming.topicSlug}?topic=${upcoming.lessonSlug}&isBackEnabled=true`}
                        >
                          Resume lesson
                          <ArrowRight
                            aria-hidden="true"
                            className="ml-1.5 h-4 w-4"
                          />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 rounded-lg border bg-muted/40 p-4">
                    <p className="text-muted-foreground text-sm">
                      All lessons complete — try the final assessment.
                    </p>
                    <Button asChild className="w-fit">
                      <Link href="/lessons">Browse lessons</Link>
                    </Button>
                  </div>
                )}

                {/* Lesson path */}
                <ol className="mt-4 divide-y divide-border rounded-lg border">
                  {lessons
                    .filter((lesson) => lesson.slug !== "test")
                    .map((lesson, index) => {
                      const { done, total, pct } = lessonProgress(
                        lesson.slug,
                        lesson.topics.map((t) => t.slug),
                        stats.progressData
                      );
                      const isComplete = total > 0 && done === total;
                      const isCurrent = upcoming?.lessonSlug === lesson.slug;
                      return (
                        <li key={lesson.slug}>
                          <Link
                            className={cn(
                              "flex items-center gap-3 p-3 transition-colors duration-150 ease-out sm:p-4",
                              "hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none"
                            )}
                            href={`/lessons/${lesson.slug}`}
                          >
                            <span
                              aria-hidden="true"
                              className={cn(
                                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm",
                                isComplete
                                  ? "border-transparent bg-primary text-primary-foreground"
                                  : "",
                                !isComplete && isCurrent
                                  ? "border-primary text-primary"
                                  : "",
                                isComplete || isCurrent
                                  ? ""
                                  : "text-muted-foreground"
                              )}
                            >
                              {isComplete ? (
                                <CircleCheck className="h-4 w-4" />
                              ) : isCurrent ? (
                                <Play className="h-4 w-4" />
                              ) : (
                                <span className="tabular-nums">
                                  {index + 1}
                                </span>
                              )}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="flex items-center gap-2">
                                <span className="truncate font-medium text-sm">
                                  {lesson.title}
                                </span>
                                {isComplete ? (
                                  <Badge
                                    className="hidden shrink-0 sm:inline-flex"
                                    variant="secondary"
                                  >
                                    Done
                                  </Badge>
                                ) : isCurrent ? (
                                  <Badge className="shrink-0">Up next</Badge>
                                ) : (
                                  <Lock
                                    aria-label="Locked"
                                    className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
                                  />
                                )}
                              </span>
                              <span className="mt-1.5 flex items-center gap-2">
                                <Progress
                                  aria-label={`${lesson.title} ${pct} percent complete`}
                                  className="h-1.5"
                                  value={pct}
                                />
                                <span className="shrink-0 text-muted-foreground text-xs tabular-nums">
                                  {done}/{total}
                                </span>
                              </span>
                            </span>
                            <CircleDashed
                              aria-hidden="true"
                              className="h-4 w-4 shrink-0 text-muted-foreground sm:hidden"
                            />
                          </Link>
                        </li>
                      );
                    })}
                </ol>
              </CardContent>
            </Card>

            {/* Side column */}
            <div className="flex flex-col gap-3 sm:gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <MapIcon
                      aria-hidden="true"
                      className="h-4 w-4 text-primary"
                    />
                    Quick links
                  </CardTitle>
                  <CardDescription>
                    Jump to the pages you use most.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-2">
                  <Button
                    asChild
                    className="w-full justify-between transition-transform duration-150 ease-out active:scale-[0.98]"
                    variant="outline"
                  >
                    <Link href="/lessons">
                      Lessons
                      <ArrowRight aria-hidden="true" className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="w-full justify-between transition-transform duration-150 ease-out active:scale-[0.98]"
                    variant="outline"
                  >
                    <Link href="/progress">
                      Progress
                      <ArrowRight aria-hidden="true" className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="w-full justify-between transition-transform duration-150 ease-out active:scale-[0.98]"
                    variant="outline"
                  >
                    <Link href="/profile">
                      Profile
                      <ArrowRight aria-hidden="true" className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Final check</CardTitle>
                  <CardDescription>
                    Prove what you learned when ready.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full" variant="secondary">
                    <Link href="/lessons/test/quiz">Take the assessment</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      ) : (
        <Card className="mt-6">
          <CardContent className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-sm">
                Unable to load your dashboard right now.
              </p>
              <p className="mt-1 text-muted-foreground text-sm">
                Your progress is safe. Try again later, or start with the first
                lesson.
              </p>
            </div>
            <Button asChild className="w-full sm:w-fit">
              <Link href="/lessons">Browse lessons</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </main>
  );
}

function DashboardSkeleton() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading dashboard"
      className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8"
    >
      <div className="max-w-2xl">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-3 h-9 w-64 sm:w-80" />
        <Skeleton className="mt-2 h-4 w-52" />
      </div>
      <div
        className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
        data-testid="dashboard-skeleton"
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <div className="rounded-xl border bg-card p-5" key={i}>
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="mt-3 h-8 w-16" />
            <Skeleton className="mt-2 h-3 w-32" />
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-6 lg:col-span-2">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="mt-2 h-4 w-56" />
          <Skeleton className="mt-5 h-2.5 w-full" />
          <div className="mt-5 space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="mt-2 h-4 w-40" />
          <div className="mt-5 space-y-2.5">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </main>
  );
}

export default async function DashboardHomePage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardFetcher />
    </Suspense>
  );
}
