"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { type JSX, useState } from "react";
import { CustomProgress } from "@/components/custom-progress";
import LessonCard from "@/components/lesson-card";
import { Button } from "@/components/ui/button";
import {
  Browser,
  CodeBlock,
  CodeHighlight,
  Image,
  MultipleChoiceQuiz,
  type PracticeOption,
  PracticeQuiz,
  type StepperCallbacks,
} from "./mdx-components";

/**
 * Pilot lesson stepper (migration 06, #29).
 *
 * Renders the pilot MDX slice
 * (`content/lessons/introduction-to-html/html_introduction.mdx`) through the
 * central component map: quiz data is hoisted below as plain data, stepper
 * callbacks flow from this component into the quiz wrappers, and shuffling
 * happens inside `PracticeQuiz`. Mirrors the legacy stepper contract
 * (`src/components/pages/lessons/subtopic/lesson.tsx`) on a pilot-only path
 * so legacy routes are untouched.
 */

const PRACTICE_OPTIONS: PracticeOption[] = [
  { label: "<button>", priority: 1 },
  { label: "Click me!", priority: 2 },
  { label: "</button>", priority: 3 },
];

const PRACTICE = {
  answer: "<button>Click me!</button>",
  initialCode: ["<body>\n  ", "\n</body>"],
  title: [
    "Now, let's try creating a button using HTML. Can you put the pieces in the correct order?",
  ],
  response: {
    positive: "Correct, you are a fast learner!",
    negative: "Incorrect, Please try again!",
  },
} as const;

const MCQ = {
  options: [
    "HyperText Markup Language",
    "Home Tool Markup Language",
    "Hyperlink Text Markup Language",
    "How To Make Lasagna",
  ],
  answer: "HyperText Markup Language",
  title: ["What does HTML stand for?"],
  response: {
    positive: "Yup, you got it!",
    negative: "Nope, give it another shot!",
  },
} as const;

type PilotStep = {
  submit: string;
  render: (callbacks: StepperCallbacks) => JSX.Element;
};

const STEPS: PilotStep[] = [
  {
    submit: "Continue",
    render: () => (
      <div>
        <div>
          Welcome to the Introduction to HTML! Let&apos;s start with the basics.
        </div>
        <Image
          alt="HTML Structure"
          height={300}
          src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f916/512.gif"
          width={400}
        />
      </div>
    ),
  },
  {
    submit: "Continue",
    render: () => (
      <div>
        HTML is like the skeleton of a webpage. It tells the browser what goes
        where.
      </div>
    ),
  },
  {
    submit: "Continue",
    render: () => (
      <div>
        <div>
          HTML uses tags to define elements. Let&apos;s look at a simple
          example:
        </div>
        <CodeBlock
          code="<p>This is a paragraph.</p>"
          initialCode={["", ""]}
          language="HTML"
        />
        <p>
          In this example, <CodeHighlight>&lt;p&gt;</CodeHighlight> is the
          opening tag, and <CodeHighlight>&lt;/p&gt;</CodeHighlight> is the
          closing tag. The content is between these tags.
        </p>
      </div>
    ),
  },
  {
    submit: "Continue",
    render: () => (
      <div>
        <div>The same snippet live in the browser:</div>
        <Browser content="<p>This is a paragraph.</p>" title="Browser" />
      </div>
    ),
  },
  {
    submit: "Continue",
    render: (callbacks) => (
      <PracticeQuiz
        answer={PRACTICE.answer}
        initialCode={[...PRACTICE.initialCode]}
        options={PRACTICE_OPTIONS}
        response={{ ...PRACTICE.response }}
        title={[...PRACTICE.title]}
        {...callbacks}
      />
    ),
  },
  {
    submit: "Continue",
    render: (callbacks) => (
      <MultipleChoiceQuiz
        answer={MCQ.answer}
        options={[...MCQ.options]}
        response={{ ...MCQ.response }}
        title={[...MCQ.title]}
        {...callbacks}
      />
    ),
  },
  {
    submit: "Finish",
    render: () => (
      <div>
        HTML has come a long way from being a simple way to mark up text to a
        full-blown web technology. Alright, that&apos;s a wrap on our journey
        through HTML and its history!
      </div>
    ),
  },
];

export const PilotLesson = (): JSX.Element => {
  const [index, setIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(true);
  const [numberOfCorrect, setNumberOfCorrect] = useState(0);
  const [numberOfInCorrect, setNumberOfInCorrect] = useState(0);

  const step = STEPS[index];
  const singleProgress = 100 / STEPS.length;

  const callbacks: StepperCallbacks = {
    setIsFinishedAction: setIsFinished,
    setNumberOfCorrectAction: setNumberOfCorrect,
    setNumberOfInCorrectAction: setNumberOfInCorrect,
  };

  return (
    <main className="py-10">
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-bold text-3xl text-gray-900 leading-tight dark:text-white">
            What is HTML and Its History
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
                {step.render(callbacks)}
              </div>
              <div className="mt-6 flex justify-between">
                <Button
                  className="cursor-pointer border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                  disabled={index === 0}
                  onClick={() => {
                    setIsFinished(true);
                    setIndex((i) => Math.max(0, i - 1));
                  }}
                  variant="outline"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  className="cursor-pointer bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"
                  disabled={!isFinished}
                  onClick={() => {
                    setIsFinished(true);
                    setIndex((i) => Math.min(STEPS.length - 1, i + 1));
                  }}
                >
                  {step.submit}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="sr-only" data-testid="pilot-counts">
                {`correct:${numberOfCorrect},incorrect:${numberOfInCorrect}`}
              </div>
            </div>
          </LessonCard>
        </div>
      </main>
    </main>
  );
};
