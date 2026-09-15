"use client";

import ImageImpl from "next/image";
import type { JSX, ReactNode } from "react";
import { useState } from "react";
import BrowserImpl from "@/components/browser";
import CodeBlockImpl from "@/components/code";
import CodeHighlightImpl from "@/components/code-highlight";
import { MultipleChoice } from "@/components/multiple-choice";
import { Practice } from "@/components/practice";
import { shuffle } from "@/lib/utils";

/**
 * Central MDX component map (migration 06, #29 / ADR-0001).
 *
 * MDX lesson files under `content/lessons/<lesson>/<subtopic>.mdx` may only
 * use the tags exposed here. Quiz tags take hoisted *data* props; stepper
 * callbacks are injected by the renderer (the stepper owns
 * `setIsFinished` / `setNumberOfCorrect` / `setNumberOfInCorrect`) and
 * shuffling lives inside the quiz wrappers — never in content.
 */

export type StepperCallbacks = {
  setIsFinishedAction: (value: boolean) => void;
  setNumberOfCorrectAction: (value: (count: number) => number) => void;
  setNumberOfInCorrectAction: (value: (count: number) => number) => void;
};

export type QuizResponse = {
  positive?: string;
  negative?: string;
};

/** Per-step wrapper carrying submit metadata (frontmatter-delimited steps). */
export const Step = ({
  submit = "Continue",
  children,
}: {
  submit?: string;
  children: ReactNode;
}): JSX.Element => <div data-submit={submit}>{children}</div>;

export type PracticeOption = {
  label: string;
  priority: number;
};

/**
 * Ordering quiz. Accepts unsorted options as data; shuffles once, inside the
 * component, so MDX authors never call `shuffle()` in content and the button
 * order stays stable for the life of the quiz.
 */
export const PracticeQuiz = ({
  options,
  answer,
  initialCode = ["", ""],
  title,
  response,
  isResetEnabled = true,
  setIsFinishedAction,
  setNumberOfCorrectAction,
  setNumberOfInCorrectAction,
}: {
  options: PracticeOption[];
  answer: string;
  initialCode?: string[];
  title?: string[];
  response?: QuizResponse;
  isResetEnabled?: boolean;
} & StepperCallbacks): JSX.Element => {
  const [shuffledData] = useState(() => shuffle([...options]));
  return (
    <Practice
      choices={{ options, answer }}
      initialCode={initialCode}
      isResetEnabled={isResetEnabled}
      response={response}
      setIsFinishedAction={setIsFinishedAction}
      setNumberOfCorrectAction={setNumberOfCorrectAction}
      setNumberOfInCorrectAction={setNumberOfInCorrectAction}
      shuffledData={shuffledData}
      title={title}
    />
  );
};

/** Single-answer quiz. Stepper callbacks are injected by the renderer. Options
 * render in authored order, matching the legacy `MultipleChoice` behaviour
 * (only the ordering quiz shuffles). */
export const MultipleChoiceQuiz = ({
  options,
  answer,
  title,
  response,
  isResetEnabled = true,
  setIsFinishedAction,
  setNumberOfCorrectAction,
  setNumberOfInCorrectAction,
}: {
  options: string[];
  answer: string;
  title: string[];
  response?: QuizResponse;
  isResetEnabled?: boolean;
} & StepperCallbacks): JSX.Element => (
  <MultipleChoice
    choices={{ options, answer }}
    isResetEnabled={isResetEnabled}
    response={response}
    setIsFinishedAction={setIsFinishedAction}
    setNumberOfCorrectAction={setNumberOfCorrectAction}
    setNumberOfInCorrectAction={setNumberOfInCorrectAction}
    title={title}
  />
);

// biome-ignore lint/performance/noBarrelFile: central MDX component map required by ADR-0001; MDX tags must resolve through this module
export { default as Image } from "next/image";
export { default as Browser } from "@/components/browser";
export { default as CodeBlock } from "@/components/code";
export { default as CodeHighlight } from "@/components/code-highlight";

export const lessonComponents = {
  CodeBlock: CodeBlockImpl,
  CodeHighlight: CodeHighlightImpl,
  Browser: BrowserImpl,
  Image: ImageImpl,
  PracticeQuiz,
  MultipleChoiceQuiz,
  Step,
};
