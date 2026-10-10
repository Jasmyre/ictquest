import { ArrowRight, CircleCheck, Play } from "lucide-react";
import Link from "next/link";
import { type HtmlHTMLAttributes, Suspense } from "react";
import MagicBackButton from "@/components/custom-ui/magic-back-button";
import PageSkeleton from "@/components/pages/lessons/[topic]/page-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <header className="max-w-2xl">
          <p className="text-muted-foreground text-sm">Lesson not found</p>
          <h1 className="mt-1 font-bold text-2xl text-foreground tracking-tight sm:text-3xl">
            Unknown lesson
          </h1>
          <p className="mt-2 text-muted-foreground text-sm">
            This lesson is no longer available or may have been removed.
          </p>
        </header>
        <Card className="mt-6">
          <CardContent className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-muted-foreground text-sm">
              Head back to the lesson list to keep learning.
            </p>
            <Button asChild className="w-full sm:w-fit">
              <Link href="/lessons">Browse lessons</Link>
            </Button>
          </CardContent>
        </Card>
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

/**
 * Cache policy (migration 09, #32 — see `src/lib/lessons/cache.ts`):
 * per-user progress must always read fresh, so this component carries no
 * `"use cache"`. The static lesson metadata below is cached separately in
 * `StaticLessonHeader`, keyed only by serializable lesson strings.
 */
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
  const data = userProgress.data;

  const foundItem = data?.find((item) => item.topic === topicParam);
  const completedLessons = (foundItem?.subtopics as string[]) ?? [];
  const done =
    topic?.filter((t) => completedLessons.includes(t.slug)).length ?? 0;
  const total = topic?.length ?? 0;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  const nextPending = topic?.find((t) => !completedLessons.includes(t.slug));

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <StaticLessonHeader
        description={lesson.description}
        done={done}
        pct={pct}
        title={lesson.title}
        total={total}
      />
      <section aria-label="Subtopics" className="mt-6">
        <Card>
          <CardContent className="p-2 sm:p-3">
            {nextPending ? (
              <div className="m-2 mb-3 rounded-lg border bg-muted/40 p-4 sm:m-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-medium text-sm">
                      Up next: {nextPending.name}
                    </p>
                    <p className="mt-1 text-muted-foreground text-xs">
                      {done} of {total} complete · {pct}%
                    </p>
                  </div>
                  <Button
                    asChild
                    className="w-full transition-transform duration-150 ease-out active:scale-[0.97] sm:w-fit"
                  >
                    <Link
                      href={`/lessons/subtopic/${nextPending.slug}?topic=${lesson.slug}&isBackEnabled=true`}
                    >
                      Continue
                      <ArrowRight
                        aria-hidden="true"
                        className="ml-1.5 h-4 w-4"
                      />
                    </Link>
                  </Button>
                </div>
              </div>
            ) : null}
            <ol className="divide-y divide-border">
              {topic?.map((subtopic, index) => (
                <SubtopicRow
                  completed={completedLessons.includes(subtopic.slug)}
                  index={index}
                  key={subtopic.slug}
                  lesson={lesson}
                  subtopic={subtopic}
                />
              ))}
            </ol>
          </CardContent>
        </Card>
        <div className="mt-4">
          <MagicBackButton backLink="/lessons" variant="outline" />
        </div>
      </section>
    </main>
  );
};

/**
 * Static lesson shell (migration 09, #32): lesson reads are static
 * build-time content, so this header is cached keyed by lesson strings only.
 * It must never receive per-user progress — completion state renders in the
 * uncached `Renderer` above.
 */
const StaticLessonHeader = async ({
  title,
  description,
  done,
  total,
  pct,
}: {
  title: string;
  description: string;
  done: number;
  total: number;
  pct: number;
}) => {
  "use cache";

  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0 max-w-2xl">
        <p className="text-muted-foreground text-sm">
          Lesson · {done} of {total} complete
        </p>
        <h1 className="mt-1 font-bold text-2xl text-foreground leading-tight tracking-tight sm:text-3xl">
          {title}
        </h1>
        <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </div>
      <div className="w-full shrink-0 sm:w-48">
        <Badge className="w-fit" variant="secondary">
          {pct}% complete
        </Badge>
        <Progress
          aria-label={`${title} ${pct} percent complete`}
          className="mt-2 h-1.5"
          value={pct}
        />
      </div>
    </header>
  );
};

const SubtopicRow = ({
  subtopic,
  completed,
  index,
  lesson,
  ...props
}: HtmlHTMLAttributes<HTMLLIElement> & {
  subtopic: Topic;
  completed: boolean;
  index: number;
  lesson: Lesson;
}) => (
  <li
    className="motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 motion-safe:animate-in"
    style={{
      animationDelay: `${Math.min(index, 8) * 40}ms`,
      animationFillMode: "both",
    }}
    {...props}
  >
    <Link
      aria-label={`${subtopic.name}${completed ? " (completed)" : ""}`}
      className={cn(
        "flex items-center gap-3 rounded-lg p-3 transition-colors duration-150 ease-out sm:p-4",
        "hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none"
      )}
      href={`/lessons/subtopic/${subtopic.slug}?topic=${lesson.slug}&isBackEnabled=true`}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm",
          completed
            ? "border-transparent bg-primary text-primary-foreground"
            : "border-primary text-primary"
        )}
      >
        {completed ? (
          <CircleCheck className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "block truncate font-medium text-sm",
            completed ? "text-muted-foreground line-through" : ""
          )}
        >
          {subtopic.name}
        </span>
        <span className="mt-0.5 block text-muted-foreground text-xs">
          {completed
            ? "Completed — review anytime"
            : `Step ${index + 1} · Start lesson`}
        </span>
      </span>
      {completed ? (
        <Badge className="hidden shrink-0 sm:inline-flex" variant="secondary">
          Done
        </Badge>
      ) : null}
      <ArrowRight
        aria-hidden="true"
        className="h-4 w-4 shrink-0 text-muted-foreground"
      />
    </Link>
  </li>
);

export default page;
