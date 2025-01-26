"use client";

import Browser from "@/components/Browser";
import ButtonChoice from "@/components/ButtonChoice";
import CodeBlock from "@/components/Code";
import { CustomProgress } from "@/components/CustomProgress";
import LessonCard from "@/components/LessonCard";
import { Button } from "@/components/ui/button";
import { shuffle } from "@/lib/utils";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
          label: string | React.ReactNode;
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
            label: "Next",
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
            label: "Try It!",
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
              label: <InteractiveCodeExample />,
            },
          ],
        },
      ],
    },
  },
};

const data = {
  choices: [
    { label: "<button>", priority: 1 },
    { label: "Click me!", priority: 2 },
    { label: "</button>", priority: 3 },
  ],
};

const shuffledData = shuffle(data.choices);

function InteractiveCodeExample() {
  const [code, setCode] = useState("");
  const [disabledButtons, setDisabledButtons] = useState<string[]>([]);

  const handleClick = (label: string) => {
    setCode((prevCode) => prevCode + label);
    setDisabledButtons((prevDisabled) => [...prevDisabled, label]);
  };

  const handleReset = () => {
    setCode("");
    setDisabledButtons([]);
  };

  return (
    <div>
      <CodeBlock language="HTML">{code}</CodeBlock>
      <div className="flex justify-start mt-2">
        <Button
          className="border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 hover:text-900 dark:text-gray-400 dark:hover:text-gray-200"
          onClick={handleReset}
          variant="outline"
          size="sm"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>
      <div className="flex justify-center gap-4 flex-wrap mt-4">
        {shuffledData.map((choice) => (
          <ButtonChoice
            key={choice.label}
            onClick={() => handleClick(choice.label)}
            disabled={disabledButtons.includes(choice.label)}
          >
            {choice.label}
          </ButtonChoice>
        ))}
      </div>
      <br />
      {code === "<button>Click me!</button>" && (
        <Browser
          title="Great job! You've created a button in HTML."
          content={`
        <button>Click me!</button>
        `}
        ></Browser>
      )}
      <br />
      <br />
    </div>
  );
}

export default function LessonPage({topic, subtopic}: Readonly<{topic: string, subtopic: string}>) {
  const lesson = lessonContent[topic]?.[subtopic];
  const [index, setIndex] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (index < numberOfContent - 1) {
      setIndex((prev) => ++prev);
      console.log(index);
      
    } else {
      router.push(`/compliments?topic=${topic}`);
    }
  };

  if (!lesson) {
    return <div>Lesson not found</div>;
  }

  const numberOfContent = lesson.contents.length;
  

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
              delay={100}
            />
          </div>
        </header>
        <main className="mt-10">
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <LessonCard>
              <div className="flex flex-col justify-between min-h-[65vh]">
                <div className="prose dark:prose-invert max-w-none">
                  {content.content.map((item) => (
                    <div key={item.id}>
                      {item.type === "text" && <p>{item.label}</p>}
                      {item.type === "element" && <div>{item.label}</div>}
                      <br />
                    </div>
                  ))}
                </div>
                <br />
                <div className="mt-6 flex justify-between">
                  <Button
                    className="border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 hover:text-900 dark:text-gray-400 dark:hover:text-gray-200"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={index === 0}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-700 dark:hover:bg-indigo-600"
                  >
                    {index === numberOfContent - 1
                      ? "Finish"
                      : content.submit.label}
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
