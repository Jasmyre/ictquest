"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Prism from "prismjs";
import { useCallback, useEffect, useState, useTransition } from "react";
import { CustomProgress } from "@/components/custom-progress";
import LessonCard from "@/components/lesson-card";
import { Button } from "@/components/ui/button";
import lessons from "@/db/lessons";
import { toast } from "@/hooks/use-toast";
import { getLocalStorageItem, toastDescription } from "@/lib/utils";
import { api } from "@/trpc/react";

const Lesson = ({
  topic,
  subtopic,
  isBackEnabled = true,
}: Readonly<{
  topic: string;
  subtopic: string;
  isBackEnabled?: boolean;
}>) => {
  const router = useRouter();

  const [isLoading, startTransition] = useTransition();

  const [achievementUnlocked, setAchievementUnlocked] = useState(false);
  const [numberOfCorrect, setNumberOfCorrect] = useState<number>(0);
  const [numberOfInCorrect, setNumberOfInCorrect] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(true);
  const [index, setIndex] = useState<number>(0);

  const lesson = lessons.find((item) => item.slug === topic);
  const lessonSub = lesson?.content?.[subtopic];
  const lessonTopic = lessonSub?.contents;
  const numberOfContent = lessonTopic?.length ?? 0;
  const contents = lessonTopic?.[index];
  const singleProgress = numberOfContent > 0 ? 100 / numberOfContent : 0;
  const targetAchievementName = "Newbie";

  // Queries
  const achievementsQuery = api.user.getUserAchievements.useQuery({
    skip: 0,
    take: 100,
  });

  // Mutations
  const addProgressMutation = api.user.addProgress.useMutation({
    onSuccess: () => {
      const redirectUrl = `/compliments?topic=${encodeURIComponent(
        topic
      )}&subtopic=${encodeURIComponent(
        subtopic
      )}&correct=${numberOfCorrect}&incorrect=${numberOfInCorrect}`;

      router.push(redirectUrl);
    },
  });
  const unlockUserAchievementMutation =
    api.user.unlockUserAchievement.useMutation({
      onSuccess: (mutation) => {
        toast({
          title:
            mutation.data.status === "new"
              ? "NEW ACHIEVEMENT UNLOCKED!"
              : "ACHIEVEMENT ALREADY UNLOCKED",
          description: toastDescription(
            mutation.data.achievement?.achievementName ?? "Unknown Name",
            mutation.data.achievement?.achievementDescription ??
              "No Description"
          ),
        });

        setAchievementUnlocked(true);
        achievementsQuery.refetch?.();
      },
    });

  const unlockAchievement = useCallback(
    async (name: string) => {
      if (unlockUserAchievementMutation.isPending) {
        return;
      }

      const already = achievementsQuery.data?.data?.some(
        (a) => a.achievementName === name
      );
      if (already) {
        setAchievementUnlocked(true);
        return;
      }

      await unlockUserAchievementMutation.mutateAsync({
        achievementName: name,
      });
    },
    [unlockUserAchievementMutation, achievementsQuery.data?.data?.some]
  );

  const handleBackButton = useCallback(() => {
    setIsFinished(true);
    if (index > 0) {
      setIndex((prev) => prev - 1);
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
    }
  }, [index]);

  const handleNextButton = useCallback(() => {
    startTransition(async () => {
      if (topic === "test") {
        setIsFinished(false);
      }

      if (index < numberOfContent - 1) {
        setIndex((prev) => prev + 1);
        return;
      }

      if (index === numberOfContent - 1 && isFinished) {
        await addProgressMutation.mutateAsync({ topic, subtopic });
      }
    });
  }, [
    index,
    isFinished,
    numberOfContent,
    topic,
    subtopic,
    addProgressMutation,
  ]);

  useEffect(() => {
    if (
      achievementsQuery.isLoading ||
      achievementsQuery.isFetching ||
      achievementsQuery.isError
    ) {
      return;
    }

    if (achievementUnlocked) {
      return;
    }

    const existing = achievementsQuery.data?.data?.some(
      (unlockedAchievement) =>
        unlockedAchievement.achievementName === targetAchievementName
    );

    if (existing) {
      setAchievementUnlocked(true);
    } else {
      unlockAchievement(targetAchievementName);
    }
  });

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        (e.target as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      if (e.key === "ArrowRight") {
        if (!isFinished) {
          return;
        }
        e.preventDefault();
        handleNextButton();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handleBackButton();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isFinished, handleBackButton, handleNextButton]);

  useEffect(() => {
    Prism.highlightAll();
    const autoSkip = getLocalStorageItem("skip");
    if (autoSkip && numberOfContent > 0) {
      setIndex(numberOfContent - 1);
    }
  }, [numberOfContent]);

  if (!lesson) {
    return <div>Lesson not found</div>;
  }
  if (!lessonSub) {
    return <div>Topic not found</div>;
  }

  return (
    <main className="py-10">
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-bold text-3xl text-gray-900 leading-tight dark:text-white">
            {lessonSub?.title}
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
                    className="cursor-pointer border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-200 hover:text-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                    disabled={index === 0}
                    onClick={handleBackButton}
                    variant="outline"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                ) : null}
                <Button
                  className="cursor-pointer bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"
                  disabled={!isFinished || isLoading}
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
    </main>
  );
};

export default Lesson;
