"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Prism from "prismjs";
import { type JSX, useEffect, useState } from "react";
import { CustomProgress } from "@/components/custom-progress";
import LessonCard from "@/components/lesson-card";
import { Button } from "@/components/ui/button";
import { lessons } from "@/db/lessons";
import { toast } from "@/hooks/use-toast";
import { getLocalStorageItem, toastDescription, toastStyle } from "@/lib/utils";
import Loading from "./loading";

export default function Lesson({
  topic,
  subtopic,
  isBackEnabled = true,
}: Readonly<{
  topic: string;
  subtopic: string;
  isBackEnabled?: boolean;
}>): JSX.Element {
  // --- HOOKS: must be called unconditionally at the top ---
  const { data: session, status } = useSession();
  const router = useRouter();

  const [achievementUnlocked, setAchievementUnlocked] = useState(false);
  const [numberOfCorrect, setNumberOfCorrect] = useState<number>(0);
  const [numberOfInCorrect, setNumberOfInCorrect] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(true);
  const [index, setIndex] = useState<number>(0);

  // --- Derived data (safe to compute after hooks) ---
  const lesson = lessons.find((item) => item.slug === topic);
  const lessonSub = lesson?.content?.[subtopic];
  const lessonTopic = lessonSub?.contents;
  const numberOfContent = lessonTopic?.length ?? 0;
  const contents = lessonTopic?.[index];
  const singleProgress = numberOfContent > 0 ? 100 / numberOfContent : 0;

  // --- helper functions (declare before useEffect so they exist when effect runs) ---
  async function unlockAchievement(): Promise<void> {
    try {
      const response = await fetch("/api/achievements", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify({ achievementName: "Newbie" }),
      });
      const result = await response.json();
      if (response.ok && result.status === "new") {
        toast({
          title: "NEW ACHIEVEMENT UNLOCKED!",
          description: toastDescription(
            result.achievement.achievementName,
            result.achievement.achievementDescription
          ),
          className: toastStyle,
        });
        setAchievementUnlocked(true);
      } else {
        console.log(result.message || result.error);
      }
    } catch (error) {
      console.error("Error unlocking achievement:", error);
    }
  }

  function handleBackButton() {
    setIsFinished(true);
    if (index > 0) {
      setIndex((prev) => prev - 1);
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
    }
  }

  async function handleNextButton() {
    if (topic === "test") {
      setIsFinished(false);
    }

    if (index < numberOfContent - 1) {
      setIndex((prev) => prev + 1);
      return;
    }

    if (index === numberOfContent - 1 && isFinished) {
      try {
        const res = await fetch("/api/public/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic, subtopic }),
        });

        if (!res.ok) {
          console.error("Failed to update progress in the DB");
        }
      } catch (error) {
        console.error("Error updating progress:", error);
      }

      // build redirect at time of navigation (avoid stale state)
      const redirectUrl = `/compliments?topic=${encodeURIComponent(
        topic
      )}&subtopic=${encodeURIComponent(
        subtopic
      )}&correct=${numberOfCorrect}&incorrect=${numberOfInCorrect}`;
      router.push(redirectUrl);
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: handleBackButton changes on every re-render and should not be used as a hook dependency.
  useEffect(() => {
    if (
      status === "authenticated" &&
      session?.user?.id &&
      !achievementUnlocked
    ) {
      unlockAchievement();
    }

    // highlight code blocks when content/index changes
    Prism.highlightAll();

    const autoSkip = getLocalStorageItem("skip");
    if (autoSkip && numberOfContent > 0) {
      setIndex(numberOfContent - 1);
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" && isFinished) {
        handleNextButton();
      } else if (event.key === "ArrowLeft") {
        handleBackButton();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isFinished,
    achievementUnlocked,
    numberOfContent,
    numberOfCorrect,
    numberOfInCorrect,
    session?.user?.id,
    status,
    subtopic,
    topic,
    index,
  ]);

  // --- Early returns (hooks are already called above, so this is safe) ---
  if (status === "loading") {
    return (
      <main>
        <div className="py-10">
          <header>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <Loading className="h-[16px] rounded-md sm:w-[325px]" />
              <br />
              <CustomProgress delay={0} finalValue={0} initialValue={0} />
            </div>
          </header>
          <main className="mt-10">
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
              <LessonCard>
                <div className="flex min-h-[65vh] flex-col justify-between">
                  <div className="prose dark:prose-invert max-w-none">
                    <Loading className="h-[16px] rounded-md bg-gray-300 sm:w-[100%] dark:bg-gray-700" />
                    <br />
                    <Loading className="h-[16px] rounded-md bg-gray-300 sm:w-[100%] dark:bg-gray-700" />
                    <br />
                    <Loading className="h-[16px] rounded-md bg-gray-300 sm:w-[98%] dark:bg-gray-700" />
                    <br />
                    <Loading className="h-[16px] rounded-md bg-gray-300 sm:w-[95%] dark:bg-gray-700" />
                    <br />
                    <Loading className="h-[16px] rounded-md bg-gray-300 sm:w-[66%] dark:bg-gray-700" />
                    <br />
                    <Loading className="h-[25vh] rounded-md bg-gray-300 sm:w-[100%] dark:bg-gray-700" />
                    <br />
                  </div>
                  <br />
                </div>
              </LessonCard>
            </div>
          </main>
        </div>
      </main>
    );
  }

  if (!lesson) {
    return <div>Lesson not found</div>;
  }
  if (!lessonSub) {
    return <div>Topic not found</div>;
  }

  // --- Render ---
  return (
    <div className="py-10">
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-bold text-3xl text-gray-900 leading-tight dark:text-white">
            {lessonSub.title}
          </h1>
          <CustomProgress
            className="mt-4"
            delay={0}
            finalValue={singleProgress * index}
            initialValue={singleProgress * index - singleProgress}
          />
        </div>
      </header>
      <main className="mt-10">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <LessonCard>
            <div className="flex min-h-[65vh] flex-col justify-between">
              <div className="prose dark:prose-invert max-w-none">
                {contents?.content.map((item) => (
                  <div key={item.id}>
                    {item.type === "text" && <div>{item.label as string}</div>}
                    {item.type === "element" && (
                      <div>
                        {typeof item.label === "function"
                          ? item.label({
                              setIsFinished,
                              setNumberOfCorrect,
                              setNumberOfInCorrect,
                            })
                          : item.label}
                      </div>
                    )}
                    <br />
                  </div>
                ))}
              </div>
              <br />
              <div
                className={`${
                  isBackEnabled === true ? "justify-between" : "justify-end"
                } mt-6 flex`}
              >
                {isBackEnabled ? (
                  <Button
                    className="border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-200 hover:text-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                    disabled={index === 0}
                    onClick={handleBackButton}
                    variant="outline"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                ) : null}
                <Button
                  className="bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"
                  disabled={!isFinished}
                  onClick={handleNextButton}
                >
                  {contents?.submit.label}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </LessonCard>
        </div>
      </main>
    </div>
  );
}
