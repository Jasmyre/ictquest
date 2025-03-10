"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { lessons } from "@/db/lessons";
import { ArrowLeft, ArrowRight, Book, Check } from "lucide-react";
import { CustomTooltip } from "@/components/CustomTooltip";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ProgressData } from "@prisma/client";
import BackButton from "@/components/BackButton";
import Loading from "@/components/Loading";

export default function RenderSubtopics({
  paramsTopic,
}: Readonly<{ paramsTopic: string; }>) {
  const lesson = lessons.find((item) => item.slug === paramsTopic);
  const router = useRouter();

  const [userData, setData] = useState<ProgressData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
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

    fetchData();
  }, []);

  const foundItem = userData?.find((item) => item.topic === paramsTopic);

  const completedLesson: string[] = (foundItem?.subtopics as string[]) ?? [];

  if (!lesson) {
    return <div>Lesson not found</div>;
  }

  const topic = lesson.topics;

  if (!topic) {
    return <div>Topic not found</div>;
  }

  console.log(completedLesson);
  console.log(paramsTopic);
  console.log(lesson);

  if (isLoading) {
    return (
      <main>
        <div className="py-10">
          <header>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <Loading className="h-[32px] sm:w-[325px]" />
              <br />
              <Loading className="h-[16px] sm:w-[500px]" />
            </div>
          </header>
          <main className="min-h-[65vh]">
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
              <div className="px-4 py-8 sm:px-0">
                <Card className="border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      Subtopics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                      {[1, 2, 3].map((_, index) => (
                        <li
                          key={index++}
                          className="border-b border-gray-200 py-4 last:border-b-0 dark:border-gray-700"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <Book className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <Loading className="h-[16px] sm:w-[325px]" />
                            </div>
                            <div>
                              <Button
                                disabled
                                size="sm"
                                className="bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"
                              >
                                Start Lesson
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                <div className="mt-6">
                  <BackButton>Go Back</BackButton>
                </div>
              </div>
            </div>
          </main>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-gray-100">
              {lesson.title}
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
              {lesson.description}
            </p>
          </div>
        </header>
        <main className="min-h-[65vh]">
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <Card className="border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    Subtopics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {topic.map((subtopic, index) =>
                      completedLesson?.includes(subtopic.slug) ? (
                        <li
                          key={index++}
                          className="border-b border-gray-200 py-4 last:border-b-0 dark:border-gray-700"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="flex-1">
                              <CustomTooltip
                                content={() =>
                                  "You have already finished ths lesson!"
                                }
                                className=""
                              >
                                <div className="flex space-x-4">
                                  <div className="flex-shrink-0">
                                    {completedLesson?.includes(
                                      subtopic.slug,
                                    ) ? (
                                      <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                                    ) : (
                                      <Book className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                    )}
                                  </div>
                                  <div className="">
                                    <p
                                      className={cn(
                                        "truncate text-sm font-medium text-gray-900 dark:text-gray-100",
                                        completedLesson?.includes(subtopic.slug)
                                          ? "truncate text-wrap text-gray-400 line-through dark:text-gray-500"
                                          : "",
                                      )}
                                    >
                                      {subtopic.name}
                                    </p>
                                  </div>
                                </div>
                              </CustomTooltip>
                            </div>
                            <div>
                              <Link
                                href={`/lessons/subtopic/${subtopic.slug}?topic=${lesson.slug}&isBackEnabled=true`}
                              >
                                <Button
                                  size="sm"
                                  className="bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"
                                >
                                  Start Lesson
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </li>
                      ) : (
                        <li
                          key={index++}
                          className="border-b border-gray-200 py-4 last:border-b-0 dark:border-gray-700"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              {completedLesson?.includes(subtopic.slug) ? (
                                <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                              ) : (
                                <Book className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p
                                className={cn(
                                  "truncate text-sm font-medium text-gray-900 dark:text-gray-100",
                                  completedLesson?.includes(subtopic.slug)
                                    ? "text-gray-400 line-through dark:text-gray-500"
                                    : "",
                                )}
                              >
                                {subtopic.name}
                              </p>
                            </div>
                            <div>
                              <Link
                                href={`/lessons/subtopic/${subtopic.slug}?topic=${lesson.slug}&isBackEnabled=true`}
                              >
                                <Button
                                  size="sm"
                                  className="bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"
                                >
                                  Start Lesson
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </li>
                      ),
                    )}
                  </ul>
                </CardContent>
              </Card>
              <div className="mt-6">
                <Button
                  onClick={() => router.push("/lessons/")}
                  className="border border-gray-200 bg-white text-gray-900 shadow-sm hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-700"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go Back
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </main>
  );
}
