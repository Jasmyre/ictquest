"use client";

import { CustomProgress } from "@/components/CustomProgress";
import LessonCard from "@/components/LessonCard";
import { Button } from "@/components/ui/button";
import { lessons } from "@/db/lessons";
import { toast } from "@/hooks/use-toast";
import { getLocalStorageItem, toastDescription, toastStyle } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Prism from "prismjs";
import { useEffect, useState } from "react";
import Loading from "./Loading";

export default function Lesson({
  topic,
  subtopic,
  isBackEnabled = true,
}: Readonly<{ topic: string; subtopic: string; isBackEnabled?: boolean }>) {
  console.log("is back enabled: ", isBackEnabled)
  const { data: session, status } = useSession();

  const [achievementUnlocked, setAchievementUnlocked] = useState(false);
  const [numberOfCorrect, setNumberOfCorrect] = useState<number>(0);
  const [numberOfInCorrect, setNumberOfInCorrect] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(true);
  const [index, setIndex] = useState<number>(0);
  const [url, setUrl] = useState<string>("");

  const lesson = lessons.find((item) => item.slug === topic)!;
  const lessonTopic = lesson.content[subtopic].contents;
  const router = useRouter();

  const numberOfContent = lessonTopic.length;

  useEffect(() => {
    if (
      status === "authenticated" &&
      session?.user?.id &&
      !achievementUnlocked
    ) {
      unlockAchievement();
    }

    Prism.highlightAll();

    const autoSkip = getLocalStorageItem("skip");

    if (autoSkip) {
      const finish = () => {
        setIndex(numberOfContent - 1);
      };

      finish();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" && isFinished) {
        handleNextButton();
      } else if (event.key === "ArrowLeft") {
        handleBackButton();
      }
    };

    console.log("corrects: ",numberOfCorrect);
    console.log("incorrects: ",numberOfInCorrect);
    console.log("total: ", numberOfCorrect + numberOfInCorrect);
    setUrl(`/compliments?topic=${topic}&subtopic=${subtopic}&correct=${numberOfCorrect}&incorrect=${numberOfInCorrect}`)

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, isFinished]);

  async function unlockAchievement() {
    try {
      const response = await fetch("/api/achievements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ achievementName: "Newbie" }),
      });
      const result = await response.json();
      if (response.ok && result.status === "new") {
        toast({
          title: "NEW ACHIEVEMENT UNLOCKED!",
          description: toastDescription(
            result.achievement.achievementName,
            result.achievement.achievementDescription,
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

  if (status === "loading") {
    return (
      <main>
        <div className="py-10">
          <header>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <Loading className="h-[16px] rounded-md sm:w-[325px]" />
              <br />
              <CustomProgress initialValue={0} finalValue={0} delay={0} />
            </div>
          </header>
          <main className="mt-10">
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
              <LessonCard>
                <div className="flex min-h-[65vh] flex-col justify-between">
                  <div className="prose dark:prose-invert max-w-none">
                    <Loading className="h-[16px] rounded-md bg-gray-300 dark:bg-gray-700 sm:w-[100%]" />
                    <br />
                    <Loading className="h-[16px] rounded-md bg-gray-300 dark:bg-gray-700 sm:w-[100%]" />
                    <br />
                    <Loading className="h-[16px] rounded-md bg-gray-300 dark:bg-gray-700 sm:w-[98%]" />
                    <br />
                    <Loading className="h-[16px] rounded-md bg-gray-300 dark:bg-gray-700 sm:w-[95%]" />
                    <br />
                    <Loading className="h-[16px] rounded-md bg-gray-300 dark:bg-gray-700 sm:w-[66%]" />
                    <br />
                    <Loading className="h-[25vh] rounded-md bg-gray-300 dark:bg-gray-700 sm:w-[100%]" />
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

  if (!lessonTopic) {
    return <div>Topic not found</div>;
  }

  const handleBackButton = () => {
    setIsFinished(true);
    if (index > 0) {
      setIndex((prev) => prev - 1);
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
    }
  };

  async function handleNextButton() {
    if (topic === "test") {
      setIsFinished(false);
    }

    if (index < numberOfContent - 1) {
      setIndex((prev) => prev + 1);
    } else if (index === numberOfContent - 1 && isFinished) {
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

      router.push(url);
    }
    console.log(numberOfCorrect);
    console.log(numberOfInCorrect);
    // setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 10);
  }

  const contents = lessonTopic[index];
  const singleProgress = 100 / numberOfContent;

  return (
    <div className="py-10">
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-white">
            {lesson?.content[subtopic].title}
          </h1>
          <CustomProgress
            classname="mt-4"
            initialValue={singleProgress * index - singleProgress}
            finalValue={singleProgress * index}
            delay={0}
          />
        </div>
      </header>
      <main className="mt-10">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <LessonCard>
            <div className="flex min-h-[65vh] flex-col justify-between">
              <div className="prose dark:prose-invert max-w-none">
                {contents.content.map((item) => (
                  <div key={item.id}>
                    {item.type === "text" && <div>{item.label as string}</div>}
                    {item.type === "element" && (
                      <div>
                        {typeof item.label === "function"
                          ? item.label({ setIsFinished, setNumberOfCorrect, setNumberOfInCorrect })
                          : item.label}
                      </div>
                    )}
                    <br />
                  </div>
                ))}
              </div>
              <br />
              <div
                className={`${isBackEnabled === true ? "justify-between" : "justify-end"} mt-6 flex`}
              >
                <Button
                  className={`hover:text-900 border border-gray-200 bg-white text-gray-600 shadow-sm ${isBackEnabled === true ? "opacity-100" : "hidden opacity-0"} hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200`}
                  variant="outline"
                  onClick={handleBackButton}
                  disabled={index === 0}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={handleNextButton}
                  className={`bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600`}
                  disabled={!isFinished}
                >
                  {contents.submit.label}
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
