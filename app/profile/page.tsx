"use client";

import { getLocalStorageItem, removeLocalStorageItem } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { CustomProgress } from "@/components/CustomProgress";
import { CustomTooltip } from "@/components/CustomTooltip";
import { CustomBadge } from "@/components/CustomBadge";
import { Award, Book } from "lucide-react";
import { useRouter } from "next/navigation";
import { UserData } from "@/components/ContinueLearningButton";
import { InfoCard } from '@/components/InfoCard';
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import lessons from "@/db/lessons";

export default function ProfilePage() {
  const [overallProgress, setOverallProgress] = useState(0);

  const router = useRouter();

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

  if (!data) {
    console.log("Data not found!");
  } else {
    console.log(data);
  }

  const handleReset = () => {
    removeLocalStorageItem("userData");
    setOverallProgress(0);
    toast({
      description: "Data has been removed successfully",
      className:
        " bg-gray-100 dark:bg-gray-900 border border-gray-400 dark:border-gray-700 text-gray-500 dark:text-gray-200",
    });
    router.refresh();
  };

  const lessonsToShow = lessons.slice(0, 2);

  return (
    <main>
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-gray-100">
              Your Profile
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <InfoCard />

                <Card className="border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="flex max-sm:flex-col max-sm:items-start flex-wrap gap-4 max-sm:gap-4 items-center justify-between text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      <div className="flex justify-start items-center min-w-min flex-wrap">
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

                      {lessonsToShow.map((lesson) => {
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

                      {lessons.length > 2 && (
                        <div className="mt-4">
                          <Button
                            className={
                              "border border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:border-gray-800 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                            }
                            onClick={() => router.push("/progress")}
                          >
                            View All
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      <Award className="mr-2 h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                      Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                      <li className="flex py-4">
                        <Award className="mr-2 h-6 w-6 text-yellow-400" />
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          HTML Basics Mastery
                        </span>
                      </li>
                      <li className="flex py-4">
                        <Award className="mr-2 h-6 w-6 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Form Builder
                        </span>
                      </li>
                      <li className="flex py-4">
                        <Award className="mr-2 h-6 w-6 text-yellow-600" />
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          HTML5 Pioneer
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <AlertDialog>
                  <AlertDialogTrigger className=":hover:text-red-200 h-9 rounded bg-gray-200 px-4 py-2 text-gray-400 hover:text-red-200 hover:bg-red-500 dark:bg-gray-800 dark:text-gray-500 dark:hover:bg-red-500 dark:hover:text-red-200">
                    Delete Data
                  </AlertDialogTrigger>
                  <AlertDialogContent className="border-gray-200 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="border border-gray-300 bg-white text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-indigo-600 text-white transition-colors duration-200 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                        onClick={handleReset}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </main>
      </div>
    </main>
  );
}
