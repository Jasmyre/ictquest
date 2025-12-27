import { ArrowRight, Book, Check } from "lucide-react";
import Link from "next/link";
import { type HtmlHTMLAttributes, Suspense } from "react";
import { CustomTooltip } from "@/components/custom-tooltip";
import MagicBackButton from "@/components/custom-ui/magic-back-button";
import PageSkeleton from "@/components/pages/lessons/[topic]/page-skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import lessons, { type Lesson, type Topic } from "@/db/lessons";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/server";

async function page({
  params,
}: Readonly<{ params: Promise<{ topic: string }> }>) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Fetcher params={params} />
    </Suspense>
  );
}

const Fetcher = async ({ params }: { params: Promise<{ topic: string }> }) => {
  const topicParam = (await params).topic;
  const lesson = lessons.find((item) => item.slug === topicParam);
  const topic = lesson?.topics;

  const userProgress = await api.user.getUserProgress({});

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
    <Renderer
      lesson={lesson}
      topic={topic}
      topicParam={topicParam}
      userProgress={userProgress}
    />
  );
};

const Renderer = async ({
  userProgress,
  topicParam,
  lesson,
  topic,
}: {
  userProgress: Awaited<ReturnType<typeof api.user.getUserProgress>>;
  topicParam: string;
  lesson: Lesson;
  topic: Lesson["topics"] | undefined;
}) => {
  "use cache";

  const data = userProgress.data;

  const foundItem = data?.find((item) => item.topic === topicParam);
  const completedLessons = (foundItem?.subtopics as string[]) ?? [];

  return (
    <div className="min-h-screen">
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
            <div className="py-8">
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
                        <CompletedSubtopicItem
                          completedLessons={completedLessons}
                          key={index}
                          lesson={lesson}
                          subtopic={subtopic}
                        />
                      ) : (
                        <SubtopicItem
                          completedLessons={completedLessons}
                          key={index}
                          lesson={lesson}
                          subtopic={subtopic}
                        />
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
    </div>
  );
};

const SubtopicItem = ({
  subtopic,
  completedLessons,
  lesson,
  ...props
}: HtmlHTMLAttributes<HTMLLIElement> & {
  subtopic: Topic;
  completedLessons: string[];
  lesson: Lesson;
}) => (
  <li
    className="border-gray-200 border-b py-4 last:border-b-0 dark:border-gray-700"
    {...props}
  >
    <div className="flex items-center gap-4 max-sm:w-full max-sm:flex-col max-sm:justify-start">
      <div className="flex flex-1 items-center space-x-4 max-sm:w-full">
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
      </div>
      <div className="max-sm:w-full">
        <Link
          href={`/lessons/subtopic/${subtopic.slug}?topic=${lesson.slug}&isBackEnabled=true`}
        >
          <Button
            className="cursor-pointer max-sm:flex max-sm:w-full max-sm:justify-between max-sm:py-6"
            size="sm"
            variant={"card-button"}
          >
            Start Lesson
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  </li>
);

const CompletedSubtopicItem = ({
  subtopic,
  completedLessons,
  lesson,
  ...props
}: HtmlHTMLAttributes<HTMLLIElement> & {
  subtopic: Topic;
  completedLessons: string[];
  lesson: Lesson;
}) => (
  <li
    className="border-gray-200 border-b py-4 last:border-b-0 dark:border-gray-700"
    {...props}
  >
    <div className="flex items-center gap-4 max-sm:w-full max-sm:flex-col max-sm:justify-start">
      <div className="flex flex-1 items-center space-x-4 max-sm:w-full">
        <CustomTooltip
          className=""
          content={() => "You have already finished ths lesson!"}
        >
          <div className="flex space-x-4">
            <div className="flex-shrink-0">
              {completedLessons?.includes(subtopic.slug) ? (
                <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
              ) : (
                <Book className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              )}
            </div>
            <div className="">
              <p
                className={cn(
                  "truncate font-medium text-gray-900 text-sm dark:text-gray-100",
                  completedLessons?.includes(subtopic.slug)
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
      <div className="max-sm:w-full">
        <Link
          href={`/lessons/subtopic/${subtopic.slug}?topic=${lesson.slug}&isBackEnabled=true`}
        >
          <Button
            className="cursor-pointer max-sm:flex max-sm:w-full max-sm:justify-between max-sm:py-6"
            size="sm"
            variant={"card-button"}
          >
            Start Lesson
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  </li>
);

export default page;
