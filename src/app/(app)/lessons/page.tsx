import { ArrowRight, BookOpenCheck, Trophy } from "lucide-react";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { lessons } from "@/db/lessons";

/**
 * Cache policy (migration 09, #32; Cache Components): the lesson list is cacheable — it reads
 * only the static lesson registry, never per-user rows. See
 * `src/lib/lessons/cache.ts` (LESSON_LIST_REVALIDATE).
 */
export default async function LessonsPage() {
  "use cache";
  cacheLife("hours");

  const courseLessons = lessons.filter((lesson) => lesson.slug !== "test");
  const totalSubtopics = courseLessons.reduce(
    (sum, lesson) => sum + lesson.topics.length,
    0
  );
  const assessmentTopics = courseLessons.flatMap((lesson) =>
    lesson.topics.map((topic) => topic.name)
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="sr-only">HTML Lessons</h1>
        <p className="text-muted-foreground text-sm">
          Structured HTML path · {courseLessons.length} lessons ·{" "}
          {totalSubtopics} subtopics
        </p>
        <Button
          asChild
          className="w-full shrink-0 transition-transform duration-150 ease-out active:scale-[0.97] sm:w-fit"
        >
          <Link href="/lessons/test/quiz">
            Take the assessment
            <ArrowRight aria-hidden="true" className="ml-1.5 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <section
        aria-label="Lessons"
        className="mt-6 grid grid-cols-1 gap-3 sm:mt-4 sm:gap-4 lg:grid-cols-3"
      >
        {courseLessons.map((lesson, index) => (
          <Card
            className="motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 motion-safe:hover:-translate-y-0.5 flex h-full flex-col transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-safe:animate-in motion-safe:hover:shadow-md"
            key={lesson.slug}
            style={{
              animationDelay: `${index * 50}ms`,
              animationFillMode: "both",
            }}
          >
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1.5">
                <BookOpenCheck
                  aria-hidden="true"
                  className="h-3.5 w-3.5 text-muted-foreground"
                />
                Lesson {index + 1} · {lesson.topics.length} subtopics
              </CardDescription>
              <CardTitle className="text-lg leading-snug">
                {lesson.title}
              </CardTitle>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {lesson.description}
              </p>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col pt-2">
              <ol className="divide-y divide-border rounded-lg border bg-muted/40">
                {lesson.topics.slice(0, 4).map((topic) => (
                  <li key={topic.slug}>
                    <Link
                      className="block truncate px-3 py-2 text-muted-foreground text-sm transition-colors duration-150 ease-out hover:bg-muted/60 hover:text-foreground focus-visible:bg-muted/60 focus-visible:outline-none"
                      href={`/lessons/subtopic/${topic.slug}?topic=${lesson.slug}&isBackEnabled=true`}
                    >
                      {topic.name}
                    </Link>
                  </li>
                ))}
              </ol>
              {lesson.topics.length > 4 ? (
                <p className="mt-2 text-muted-foreground text-xs">
                  +{lesson.topics.length - 4} more subtopics inside
                </p>
              ) : null}
              <div className="mt-auto pt-6">
                <Button
                  asChild
                  className="w-full transition-transform duration-150 ease-out active:scale-[0.97]"
                >
                  <Link href={`/lessons/${lesson.slug}`}>
                    Start learning
                    <ArrowRight aria-hidden="true" className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section aria-label="Final assessment" className="mt-3 sm:mt-4">
        <Card className="overflow-hidden lg:col-span-3">
          <CardContent className="p-0">
            <div className="bg-primary p-6 text-primary-foreground sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 max-w-2xl">
                  <Badge variant="secondary">Final check · 50 questions</Badge>
                  <h2 className="mt-3 font-bold text-xl tracking-tight sm:text-2xl">
                    Test your expertise
                  </h2>
                  <p className="mt-1 text-sm opacity-90">
                    A comprehensive assessment covering everything from basics
                    to advanced concepts.
                  </p>
                </div>
                <Trophy
                  aria-hidden="true"
                  className="hidden h-16 w-16 shrink-0 opacity-30 sm:block"
                />
              </div>
            </div>
            <div className="p-6 sm:p-8">
              <Progress
                aria-label={`Assessment covers ${assessmentTopics.length} topic areas`}
                className="h-1.5"
                value={100}
              />
              <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {assessmentTopics.map((topic) => (
                  <li
                    className="rounded-md bg-muted/40 px-3 py-2 text-muted-foreground text-sm"
                    key={topic}
                  >
                    {topic}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-muted-foreground text-sm">
                  Ready when you are. No timer pressure on the way in.
                </p>
                <Button
                  asChild
                  className="w-full transition-transform duration-150 ease-out active:scale-[0.97] sm:w-fit"
                  size="lg"
                >
                  <Link href="/lessons/subtopic/quiz?topic=test">
                    Start test
                    <ArrowRight aria-hidden="true" className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
