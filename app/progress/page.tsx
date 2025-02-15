"use client";

import { UserData } from "@/components/ContinueLearningButton";
import { CustomProgress } from "@/components/CustomProgress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import lessons from "@/db/lessons";
import { getLocalStorageItem } from "@/lib/utils";
import { Book } from "lucide-react";
import { useEffect, useState } from "react";
import BackButton from "@/components/BackButton";
import { CustomTooltip } from "@/components/CustomTooltip";
import { CustomBadge } from "@/components/CustomBadge";

export default function Progress() {
  const [overallProgress, setOverallProgress] = useState(0);

  const data = getLocalStorageItem<UserData>("userData");

  useEffect(() => {
    if (data) {
      let totalPercentage = 0;
      let count = 0;

      lessons.forEach((lesson) => {
        const progress = data?.progressData.find(
          (item) => item.topic === lesson.slug,
        );

        const completedSubtopics = progress?.subtopics?.length ?? 0;
        const totalSubtopics = lesson.topics.length;

        if (totalSubtopics > 0) {
          totalPercentage += (completedSubtopics / totalSubtopics) * 100;
          count++;
        }
      });

      const averageProgress = count > 0 ? totalPercentage / count : 0;
      setOverallProgress(Number(averageProgress.toFixed(2)));

      if (averageProgress < 33.33) {
        console.log("Beginner: " + overallProgress);
      } else if (averageProgress < 66.67) {
        console.log("Intermediate: " + overallProgress);
      } else if (averageProgress < 100) {
        console.log("Expert: " + overallProgress);
      }
    }
  }, [data, overallProgress]);

  return (
    <main className="min-h-[80vh]">
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-gray-100">
              Your Progress
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <Card className="w-full border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="flex flex-wrap items-center justify-between gap-4 text-2xl font-semibold text-gray-900 dark:text-gray-100 max-sm:flex-col max-sm:items-start max-sm:gap-4">
                    <div className="flex min-w-min flex-wrap items-center justify-start">
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
                      <CustomProgress
                        initialValue={0}
                        finalValue={overallProgress}
                      />
                    </div>

                    {lessons.map((lesson) => {
                      const progress = data?.progressData.find(
                        (item) => item.topic === lesson.slug,
                      );

                      const completedSubtopics =
                        progress?.subtopics?.length ?? 0;
                      const totalSubtopics = lesson.topics.length;

                      const percentage =
                        totalSubtopics === 0
                          ? 0
                          : Math.round(
                              (completedSubtopics / totalSubtopics) * 100,
                            );

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
                          <CustomProgress
                            initialValue={0}
                            finalValue={percentage}
                          />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
              <br />
              <div>
                <BackButton>Go Back</BackButton>
              </div>
            </div>
          </div>
        </main>
      </div>
    </main>
  );
}
