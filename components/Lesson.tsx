"use client";

import CodeBlock from "@/components/Code";
import { CustomProgress } from "@/components/CustomProgress";
import LessonCard from "@/components/LessonCard";
import { Button } from "@/components/ui/button";
import { setSessionStorageItem, shuffle } from "@/lib/utils";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { MultipleChoiceButton } from "./MultipleChoiceButton";
import { Practice } from "./Practice";

export type Choices = {
  options: {
    label: string;
    priority: number;
  }[];
  answer: string;
};

export type ShuffledData = {
  label: string;
  priority: number;
}[];

interface LessonContentProps {
  [topic: string]: {
    [subtopic: string]: {
      title: string;
      contents: {
        submit: {
          label: string;
        };
        content: {
          type: string;
          label:
            | React.ReactNode
            | (({
                setIsFinished,
              }: {
                setIsFinished: (value: boolean) => void;
              }) => React.ReactNode);
          id: number;
        }[];
      }[];
    };
  };
}

const lessonContent: LessonContentProps = {
  "html-basics": {
    "intro-to-html": {
      title: "Introduction to HTML",
      contents: [
        {
          submit: {
            label: "Continue",
          },
          content: [
            {
              id: 0,
              type: "text",
              label:
                "Welcome to the Introduction to HTML! Let's start with the basics.",
            },
            {
              id: 1,
              type: "element",
              label: (
                <div>
                  <p>
                    HTML stands for HyperText Markup Language. It&apos;s the
                    standard markup language for creating web pages.
                  </p>
                  <Image
                    src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f916/512.gif"
                    alt="HTML Structure"
                    width={400}
                    height={300}
                    className="mt-4 rounded-lg shadow-md"
                  />
                </div>
              ),
            },
          ],
        },
        {
          submit: {
            label: "Continue",
          },
          content: [
            {
              id: 2,
              type: "text",
              label:
                "HTML uses tags to define elements. Let's look at a simple example:",
            },
            {
              id: 3,
              type: "element",
              label: (
                <CodeBlock language="HTML">{`<p>This is a paragraph.</p>`}</CodeBlock>
              ),
            },
            {
              id: 4,
              type: "text",
              label:
                "In this example, <p> is the opening tag, and </p> is the closing tag. The content is between these tags.",
            },
          ],
        },
        {
          submit: {
            label: "Continue",
          },
          content: [
            {
              id: 5,
              type: "text",
              label:
                "Now, let's try creating a button using HTML. Can you put the pieces in the correct order?",
            },
            {
              id: 6,
              type: "element",
              label: ({ setIsFinished}) => {
                const choices = {
                  options: [
                    { label: "<button>", priority: 1 },
                    { label: "Click me!", priority: 2 },
                    { label: "</button>", priority: 3 },
                  ],
                  answer: "<button>Click me!</button>",
                };

                const shuffledData = shuffle(choices.options);

                return (
                <Practice
                  setIsFinished={setIsFinished}
                  choices={choices}
                  shuffledData={shuffledData}
                />
              )},
            },
          ],
        },

        {
          submit: {
            label: "Continue",
          },
          content: [
            {
              id: 7,
              type: "element",
              label: ({setIsFinished}) => (
                <MultipleChoice setIsFinished={setIsFinished} />
              ),
            },
          ],
        },
      ],
    },
  },
};

function MultipleChoice({
  setIsFinished,
}: Readonly<{
  setIsFinished: (value: boolean) => void;
}>) {
  const [choice, setChoice] = useState("");
  const [disabledButtons, setDisabledButtons] = useState<string[]>([]);

  const choices = {
    options: ["p", "html", "h1", "element"],
    answer: "h1",
  };

  console.log(choice);

  React.useEffect(() => {
    if (choice === choices.answer) {
      setIsFinished(true);
    } else {
      setIsFinished(false);
    }
  }, [choice, choices.answer, setIsFinished]);

  const renderMessage = () => {
    if (!choice) return null;

    if (choice === choices.answer) {
      return (
        <div className="rounded bg-green-600 p-2">
          <p className="text-green-200">
            Correct! h1 creates the largest heading.
          </p>
        </div>
      );
    } else {
      return (
        <div className="rounded bg-red-600 p-2">
          <p className="text-red-200">Incorrect! Try again.</p>
        </div>
      );
    }
  };

  const handleMultipleChoiceClick = (label: string) => {
    setChoice((prevChoice) => {
      const newChoice =
        prevChoice !== choices.answer ? prevChoice + label : prevChoice;
      if (newChoice === choices.answer) {
        setSessionStorageItem("finish", true);
      }
      return newChoice;
    });

    setDisabledButtons(choices.options.filter((option) => option !== label));
  };

  const handleReset = () => {
    setChoice("");
    setDisabledButtons([]);
    setIsFinished(false);
  };

  return (
    <div>
      <div>Which of the following elements create the larges heading?</div>
      <br />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {choices.options.map((option) => {
          return (
            <MultipleChoiceButton
              key={option}
              disabledButtons={disabledButtons}
              handleMultipleChoiceClick={handleMultipleChoiceClick}
              label={option}
            />
          );
        })}
      </div>
      <div className="mt-2 flex justify-start">
        <Button
          className="hover:text-900 border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
          onClick={handleReset}
          variant="outline"
          size="sm"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>
      <br />
      <div className="hidden rounded bg-green-600 p-2">
        <p className="text-green-200">
          Correct! h1 creates the largest heading.
        </p>
      </div>
      {renderMessage()}
    </div>
  );
}

export default function LessonPage({
  topic,
  subtopic,
}: Readonly<{ topic: string; subtopic: string }>) {
  const lesson =
    lessonContent[topic.toLowerCase().replace(/ /, "-")]?.[subtopic];
  const [index, setIndex] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(true);
  const router = useRouter();

  const numberOfContent = lesson.contents.length;

  const handleBackButton = () => {
    setIsFinished(true);
    if (index > 0) {
      setIndex((prev) => prev - 1);
      setTimeout(
        () =>
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          }),
        0,
      );
    }
  };

  const handleNextButton = () => {
    console.log(isFinished);

    if (index < numberOfContent - 1) {
      setIndex((prev) => prev + 1);
    } else if (index === numberOfContent - 1 && isFinished) {
      router.push(`/compliments?topic=${topic}`);
    }
    setTimeout(
      () =>
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        }),
      10,
    );
  };

  if (!lesson) {
    return <div>Lesson not found</div>;
  }

  if (index >= numberOfContent) {
    setIndex(numberOfContent - 1);
  }

  const content = lesson.contents[index];
  const singleProgress = 100 / numberOfContent;

  return (
    <div className="py-10">
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-white">
            {lesson.title}
          </h1>
          <CustomProgress
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
                {content.content.map((item) => (
                  <div key={item.id}>
                    {item.type === "text" &&
                      typeof item.label !== "function" && <p>{item.label}</p>}
                    {item.type === "element" && (
                      <div>
                        {typeof item.label === "function"
                          ? item.label({ setIsFinished: setIsFinished})
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
                  {content.submit.label}
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
