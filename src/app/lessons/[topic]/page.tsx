import { ArrowRight, Book, Check } from "lucide-react";
import Link from "next/link";
import { CustomTooltip } from "@/components/custom-tooltip";
import MagicBackButton from "@/components/custom-ui/magic-back-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import lessons from "@/db/lessons";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/server";

async function page({
  params,
}: Readonly<{ params: Promise<{ topic: string }> }>) {
  const topicParam = (await params).topic;
  const lesson = lessons.find((item) => item.slug === topicParam);
  const topic = lesson?.topics;

  const userProgress = await api.user.getUserProgress({});
  const data = userProgress.data;

  const foundItem = data?.find((item) => item.topic === topicParam);
  const completedLessons = (foundItem?.subtopics as string[]) ?? [];

  if (!lesson) {
    return (
      <main className="min-h-screen">
        <div className="py-10">
          <header>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h1 className="font-bold text-3xl text-gray-900 leading-tight dark:text-gray-100">
                Unknown lesson
              </h1>
              <p className="mt-2 text-gray-600 text-lg dark:text-gray-300">
                This lesson is no longer available or may have been removed.
              </p>
            </div>
          </header>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="font-bold text-3xl text-gray-900 leading-tight dark:text-gray-100">
              {lesson.title}
            </h1>
            <p className="mt-2 text-gray-600 text-lg dark:text-gray-300">
              {lesson.description}
            </p>
          </div>
        </header>
        <section className="min-h-[65vh]">
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <Card className="border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="font-semibold text-2xl text-gray-900 dark:text-gray-100">
                    Subtopics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {topic?.map((subtopic, index) =>
                      completedLessons?.includes(subtopic.slug) ? (
                        <li
                          className="border-gray-200 border-b py-4 last:border-b-0 dark:border-gray-700"
                          key={index}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="flex-1">
                              <CustomTooltip
                                className=""
                                content={() =>
                                  "You have already finished ths lesson!"
                                }
                              >
                                <div className="flex space-x-4">
                                  <div className="flex-shrink-0">
                                    {completedLessons?.includes(
                                      subtopic.slug
                                    ) ? (
                                      <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                                    ) : (
                                      <Book className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                    )}
                                  </div>
                                  <div className="">
                                    <p
                                      className={cn(
                                        "truncate font-medium text-gray-900 text-sm dark:text-gray-100",
                                        completedLessons?.includes(
                                          subtopic.slug
                                        )
                                          ? "truncate text-wrap text-gray-400 line-through dark:text-gray-500"
                                          : ""
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
                                  className="cursor-pointer bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"
                                  size="sm"
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
                          className="border-gray-200 border-b py-4 last:border-b-0 dark:border-gray-700"
                          key={index}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              {completedLessons?.includes(subtopic.slug) ? (
                                <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                              ) : (
                                <Book className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p
                                className={cn(
                                  "truncate font-medium text-gray-900 text-sm dark:text-gray-100",
                                  completedLessons?.includes(subtopic.slug)
                                    ? "text-gray-400 line-through dark:text-gray-500"
                                    : ""
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
                                  className="cursor-pointer bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"
                                  size="sm"
                                >
                                  Start Lesson
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </li>
                      )
                    )}
                  </ul>
                </CardContent>
              </Card>
              <div className="mt-6">
                <MagicBackButton
                  backLink="/lessons"
                  className="cursor-pointer"
                  variant={"outline"}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default page;
