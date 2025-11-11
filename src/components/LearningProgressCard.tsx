"use client";

import { CustomBadge } from "@/components/CustomBadge";
import { CustomProgress } from "@/components/CustomProgress";
import { CustomTooltip } from "@/components/CustomTooltip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import lessons from "@/db/lessons";
import { Book } from "lucide-react";
import { useRouter } from "next/navigation";
import { type JSX, useEffect, useState } from "react";

interface ProgressData {
  id: string;
  userId: string;
  topic: string;
  subtopics: string[];
}

export function LearningProgressCard(): JSX.Element {
  const [overallProgress, setOverallProgress] = useState<number>(0);
  const [data, setData] = useState<ProgressData[] | null>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
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
      }
    })();
  }, []);

  useEffect(() => {
    if (data) {
      let totalPercentage = 0;
      let count = 0;

      lessons.forEach((lesson) => {
        const progress = data.find((entry) => entry.topic === lesson.slug);
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
        console.log("Beginner: " + averageProgress);
      } else if (averageProgress < 66.67) {
        console.log("Intermediate: " + averageProgress);
      } else if (averageProgress < 100) {
        console.log("Expert: " + averageProgress);
      }
    }
  }, [data]);

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
                : overallProgress < 66.67
                  ? "You are now in intermediate HTML."
                  : "You are an Expert in HTML."
            }
          >
            <CustomBadge
              color={
                overallProgress < 33.33
                  ? "green"
                  : overallProgress < 66.67
                    ? "orange"
                    : "red"
              }
            >
              {overallProgress < 33.33
                ? "Beginner"
                : overallProgress < 66.67
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
            const progress = data?.find((entry) => entry.topic === lesson.slug);
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
