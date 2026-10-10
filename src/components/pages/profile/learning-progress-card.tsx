"use client";

import { Book } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { CustomBadge } from "@/components/custom-badge";
import { CustomProgress } from "@/components/custom-progress";
import { CustomTooltip } from "@/components/custom-tooltip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import lessons from "@/db/lessons";
import type { api } from "@/trpc/server";

export const LearningProgressCard = ({
  getUserProgress,
}: {
  getUserProgress: Awaited<ReturnType<typeof api.user.getUserProgress>>;
}) => {
  /**
   * The progress data array returned from the API.
   * Each item corresponds to a lesson/topic and may include `subtopics`.
   */
  const userProgress = getUserProgress.data;

  /**
   * Compute all derived progress values from `lessons` + `progressData`.
   * This uses `useMemo` so the heavy calculation runs only when `progressData` changes.
   *
   * Returned object:
   * - items: per-lesson details including `percentage` (0-100, rounded)
   * - overall: average progress across lessons that have > 0 subtopics (0-100, 2 decimal places)
   */
  const { _items, overall } = useMemo(() => {
    const mapped = lessons.map((lesson) => {
      const progress = userProgress?.find((p) => p.topic === lesson.slug);
      const completed = progress?.subtopics?.length ?? 0;
      const total = lesson.topics.length;
      const percentage =
        total === 0 ? 0 : Math.round((completed / total) * 100);
      return {
        slug: lesson.slug,
        title: lesson.title,
        completed,
        total,
        percentage,
      };
    });

    const withSubtopics = mapped.filter((m) => m.total > 0);
    const overallRatio =
      withSubtopics.length === 0
        ? 0
        : withSubtopics.reduce((sum, m) => sum + m.completed / m.total, 0) /
          withSubtopics.length;

    const overallPercent = Number((overallRatio * 100).toFixed(2));

    return { _items: mapped, overall: overallPercent };
  }, [userProgress]);

  /**
   * Beginner threshold (~33%) and Intermediate threshold (~66%).
   */
  const beginnerLimit = 33.33;
  const intermediateLimit = 66.66;

  /**
   * Helper to pick badge color and label based on overall percentage.
   */
  const getBadge = (percent: number) => {
    if (percent < beginnerLimit) {
      return { label: "Beginner", color: "green" as const };
    }
    if (percent < intermediateLimit) {
      return { label: "Intermediate", color: "orange" as const };
    }
    return { label: "Expert", color: "red" as const };
  };

  const badge = getBadge(overall);
  const lessonsToShow = lessons.slice(0, 3);

  if (!getUserProgress.success) {
    /**
     * If the API failed, show the server message and don't render progress UI.
     */
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Book className="h-5 w-5 text-primary" />
            Learning progress
          </CardTitle>
        </CardHeader>

        <CardContent>
          Unable to load your progress right now. Please try again later.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center justify-between gap-3 text-lg">
          <span className="flex items-center gap-2">
            <Book className="h-5 w-5 text-primary" />
            Learning progress
          </span>
          <CustomTooltip
            content={() =>
              overall < 33.33
                ? "You are a beginner in HTML."
                : overall < 66.66
                  ? "You are now in intermediate HTML."
                  : "You are an Expert in HTML."
            }
          >
            <CustomBadge color={badge.color}>{badge.label}</CustomBadge>
          </CustomTooltip>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="mb-1 flex justify-between">
              <span className="font-medium text-sm">Overall HTML mastery</span>
              <span className="font-medium text-sm tabular-nums">
                {overall}%
              </span>
            </div>
            <CustomProgress finalValue={overall} initialValue={0} />
          </div>
          {lessonsToShow.map((lesson) => {
            const progress = userProgress?.find(
              (entry) => entry.topic === lesson.slug
            );
            const completedSubtopics = progress?.subtopics.length ?? 0;
            const totalSubtopics = lesson.topics.length;
            const percentage =
              totalSubtopics === 0
                ? 0
                : Math.round((completedSubtopics / totalSubtopics) * 100);

            return (
              <div key={lesson.slug}>
                <div className="mb-1 flex justify-between">
                  <span className="font-medium text-sm">{lesson.title}</span>
                  <span className="font-medium text-sm tabular-nums">
                    {percentage}%
                  </span>
                </div>
                <CustomProgress finalValue={percentage} initialValue={0} />
              </div>
            );
          })}
          {lessons.length > 2 && (
            <div className="mt-4">
              <Button
                asChild
                className="w-full transition-transform duration-150 ease-out active:scale-[0.98] sm:w-fit"
                variant="outline"
              >
                <Link href={"/progress"}>View all</Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
