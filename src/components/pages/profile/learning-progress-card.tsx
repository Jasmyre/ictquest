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
  userProgress,
}: {
  userProgress: Awaited<ReturnType<typeof api.user.getUserProgress>>;
}) => {
  /**
   * The progress data array returned from the API.
   * Each item corresponds to a lesson/topic and may include `subtopics`.
   */
  const progressData = userProgress.data;

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
      const progress = progressData?.find((p) => p.topic === lesson.slug);
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
  }, [progressData]);

  /**
   * Beginner threshold (~33%) and Intermediate threshold (~66%).
   */
  const beginnerLimit = 100 / 3;
  const intermediateLimit = (100 / 3) * 2;

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

  if (!userProgress.success) {
    /**
     * If the API failed, show the server message and don't render progress UI.
     */
    return (
      <Card className="w-full border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center justify-between gap-4 font-semibold text-2xl text-gray-900 max-sm:flex-col max-sm:items-start max-sm:gap-4 dark:text-gray-100">
            <div className="flex min-w-min flex-wrap items-center justify-start">
              <Book className="mr-2 h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              Learning Progress
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>{userProgress.message}</CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center justify-between gap-4 font-semibold text-2xl text-gray-900 dark:text-gray-100">
          <div className="flex items-center">
            <Book className="mr-2 h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Learning Progress
          </div>
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
              <span className="font-medium text-gray-700 text-sm dark:text-gray-300">
                Overall HTML Mastery
              </span>
              <span className="font-medium text-gray-700 text-sm dark:text-gray-300">
                {overall}%
              </span>
            </div>
            <CustomProgress finalValue={overall} initialValue={0} />
          </div>
          {lessonsToShow.map((lesson) => {
            const progress = progressData?.find(
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
                  <span className="font-medium text-gray-700 text-sm dark:text-gray-300">
                    {lesson.title}
                  </span>
                  <span className="font-medium text-gray-700 text-sm dark:text-gray-300">
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
                className="border border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 max-sm:w-full dark:border-gray-800 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                <Link href={"/progress"}>View All</Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
