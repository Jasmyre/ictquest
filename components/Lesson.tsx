"use client";

import { CustomProgress } from "@/components/CustomProgress";
import LessonCard from "@/components/LessonCard";
import { Button } from "@/components/ui/button";
import { lessons } from "@/db/lessons";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import Prism from "prismjs";
import { getLocalStorageItem } from "@/lib/utils";

export default function Lesson({
  topic,
  subtopic,
}: Readonly<{ topic: string; subtopic: string }>) {
  const lesson = lessons.find((item) => item.slug === topic);
  const lessonTopic = lesson?.content[subtopic]?.contents;
  const [index, setIndex] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(true);
  // const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
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

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, isFinished]);

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

  const numberOfContent = lessonTopic.length;

  const handleBackButton = () => {
    setIsFinished(true);
    if (index > 0) {
      setIndex((prev) => prev - 1);
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
    }
  };

  const handleNextButton = async () => {
    if (index < numberOfContent - 1) {
      setIndex((prev) => prev + 1);
    } else if (index === numberOfContent - 1 && isFinished) {
      try {
        const res = await fetch("/api/progress", {
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
      router.push(`/compliments?topic=${topic}&subtopic=${subtopic}`);
    }
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 10);
  };

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
                          ? item.label({ setIsFinished })
                          : item.label}
                      </div>
                    )}
                    <br />
                  </div>
                ))}
              </div>
              <br />
              <div className="mt-6 flex justify-between">
                <Button
                  className="hover:text-900 border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                  variant="outline"
                  onClick={handleBackButton}
                  disabled={index === 0}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={handleNextButton}
                  className="bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"
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
