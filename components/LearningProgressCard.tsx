"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomProgress } from "@/components/CustomProgress";
import { CustomTooltip } from "@/components/CustomTooltip";
import { CustomBadge } from "@/components/CustomBadge";
import { Button } from "@/components/ui/button";
import { Book } from "lucide-react";
import { getLocalStorageItem } from "@/lib/utils";
import lessons from "@/db/lessons";
import { UserData } from "./Lesson";

export function LearningProgressCard() {
  const [overallProgress, setOverallProgress] = useState<number>(0);
  const [data, setData] = useState<UserData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = getLocalStorageItem<UserData>("userData");
    setData(userData);

    if (userData) {
      let totalPercentage = 0;
      let count = 0;

      lessons.forEach((lesson) => {
        const progress = userData.progressData.find(
          (item) => item.topic === lesson.slug,
        );
        const completedSubtopics = progress?.subtopics.length ?? 0;
        const totalSubtopics = lesson.topics.length;

        if (totalSubtopics > 0) {
          totalPercentage += (completedSubtopics / totalSubtopics) * 100;
          count++;
        }
      });

      const averageProgress = count > 0 ? totalPercentage / count : 0;
      setOverallProgress(Number(averageProgress.toFixed(2)));
    }
  }, []);

  const lessonsToShow = lessons.slice(0, 2);

  return (
    <Card className="border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center justify-between gap-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
          <div className="flex items-center">
            <Book className="mr-2 h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Learning Progress
          </div>
          <CustomTooltip
            content={() =>
              overallProgress < 33.33
                ? "You are a beginner in HTML."
                : overallProgress < 66.66
                  ? "You are now in intermediate HTML."
                  : "You are an Expert in HTML."
            }
          >
            <CustomBadge
              color={
                overallProgress < 33.33
                  ? "green"
                  : overallProgress < 66.66
                    ? "orange"
                    : "red"
              }
            >
              {overallProgress < 33.33
                ? "Beginner"
                : overallProgress < 66.66
                  ? "Intermediate"
                  : "Expert"}
            </CustomBadge>
          </CustomTooltip>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="mb-1 flex justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Overall HTML Mastery
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {overallProgress}%
              </span>
            </div>
            <CustomProgress initialValue={0} finalValue={overallProgress} />
          </div>
          {lessonsToShow.map((lesson) => {
            const progress = data?.progressData.find(
              (item) => item.topic === lesson.slug,
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
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {lesson.title}
                  </span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {percentage}%
                  </span>
                </div>
                <CustomProgress initialValue={0} finalValue={percentage} />
              </div>
            );
          })}
          {lessons.length > 2 && (
            <div className="mt-4">
              <Button
                className="border border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:border-gray-800 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                onClick={() => router.push("/progress")}
              >
                View All
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
