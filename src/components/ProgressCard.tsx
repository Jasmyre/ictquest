"use client";

import { Book } from "lucide-react";
import type { JSX } from "react";
import { useEffect, useState } from "react";
import { CustomBadge } from "@/components/CustomBadge";
import { CustomProgress } from "@/components/CustomProgress";
import { CustomTooltip } from "@/components/CustomTooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import lessons from "@/db/lessons";

interface ProgressData {
  id: string;
  userId: string;
  topic: string;
  subtopics: string[];
}

export function ProgressCard(): JSX.Element {
  const [overallProgress, setOverallProgress] = useState(0);
  const [data, setData] = useState<ProgressData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const fetchData = async (): Promise<void> => {
        setIsLoading(true);
        try {
          const res = await fetch("/api/public/progress");
          if (!res.ok) {
            console.error("Failed to fetch progress from DB");
            return;
          }
          const fetchedData: ProgressData[] = await res.json();
          setData(fetchedData);
        } catch (error) {
          console.error("Error fetching progress:", error);
        } finally {
          setIsLoading(false);
        }
      };

      await fetchData();
    })().catch((error) => {
      console.error("useEffect failed", error);
    });
  }, []);

  useEffect(() => {
    if (data) {
      let totalPercentage = 0;
      let count = 0;

      lessons.forEach((lesson) => {
        const progress = data.find((item) => item.topic === lesson.slug);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="w-full border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center justify-between gap-4 font-semibold text-2xl text-gray-900 max-sm:flex-col max-sm:items-start max-sm:gap-4 dark:text-gray-100">
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
              <span className="font-medium text-gray-700 text-sm dark:text-gray-300">
                Overall HTML Mastery
              </span>
              <span className="font-medium text-gray-700 text-sm dark:text-gray-300">
                {overallProgress}%
              </span>
            </div>
            <CustomProgress finalValue={overallProgress} initialValue={0} />
          </div>

          {lessons.map((lesson) => {
            const progress = data?.find((item) => item.topic === lesson.slug);

            const completedSubtopics = progress?.subtopics?.length ?? 0;
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
        </div>
      </CardContent>
    </Card>
  );
}
