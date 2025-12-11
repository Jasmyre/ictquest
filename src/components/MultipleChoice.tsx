"use client";

import { CircleAlert, RotateCcw } from "lucide-react";
import Prism from "prismjs";
import React, { type JSX, useCallback, useState } from "react";
import { MultipleChoiceButton } from "./MultipleChoiceButton";
import { Button } from "./ui/button";

export const MultipleChoice = ({
  setNumberOfCorrectAction,
  setNumberOfInCorrectAction,
  isResetEnabled = true,
  choices,
  setIsFinishedAction,
  title,
  response = { negative: "Incorrect, Please try again!" },
}: {
  setNumberOfCorrectAction: (value: (count: number) => number) => void;
  setNumberOfInCorrectAction: (value: (count: number) => number) => void;
  setIsFinishedAction: (value: boolean) => void;
  isResetEnabled?: boolean;
  choices: {
    options: string[];
    answer: string;
  };
  title: string[];
  response?: {
    negative?: string;
    positive?: string;
  };
}): JSX.Element => {
  const [choice, setChoice] = useState("");
  const [disabledButtons, setDisabledButtons] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const correctChoice = choices?.answer;

  const handleReset = useCallback(() => {
    setChoice("");
    setDisabledButtons([]);
    setIsFinishedAction(false);
    setIsCorrect(false);
  }, [setIsFinishedAction]);

  React.useEffect(() => {
    Prism.highlightAll();

    const handleKeyDown = (event: KeyboardEvent): void => {
      console.log(event.key);
      if (event.key === "Backspace") {
        handleReset();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [choice, choices.answer, handleReset, setIsFinishedAction]);

  React.useEffect(() => {
    if (choice === "") return;

    if (choice === choices.answer) {
      console.log("Correct answer!");
      setIsCorrect(true);
      setNumberOfCorrectAction((prev) => prev + 1);
      setIsFinishedAction(true);
    } else {
      setIsCorrect(false);
      setNumberOfInCorrectAction((prev) => prev + 1);
      if (isResetEnabled) {
        setIsFinishedAction(false);
      } else {
        setIsFinishedAction(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choice, choices.answer, isResetEnabled, setIsFinishedAction]);

  const handleMultipleChoiceClick = (label: string): void => {
    setChoice(label);
    setDisabledButtons(choices.options.filter((option) => option !== label));

    // if (label === choices.answer) {
    //   console.log("Correct answer!");
    //   setNumberOfCorrectAction((prev) => prev + 1);
    //   setIsFinishedAction(true);
    // } else {
    //   setNumberOfInCorrectAction((prev) => prev + 1);
    //   if (!isResetEnabled) {
    //     setIsFinishedAction(true);
    //   } else {
    //     setIsFinishedAction(false);
    //   }
    // }
  };

  const renderMessage = (): JSX.Element | null => {
    if (!choice) return null;

    if (choice === correctChoice) {
      if (!response?.positive) return null;
      console.log(isCorrect);
      return (
        <div className="rounded bg-green-600 p-2 shadow">
          <p className="flex gap-2 text-green-200">
            <CircleAlert />
            {response?.positive}
          </p>
        </div>
      );
    }
    if (!response?.negative) return null;

    return (
      <div className="rounded bg-red-600 p-2 shadow">
        <p className="flex gap-2 text-red-200">
          <CircleAlert />
          {response?.negative}
        </p>
      </div>
    );
  };

  return (
    <div>
      <div>
        {title?.map((item) => (
          <div key={item}>
            <p>{item}</p>
            <br />
          </div>
        ))}
      </div>
      <br />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {choices.options.map((option) => (
          <MultipleChoiceButton
            disabledButtons={disabledButtons}
            handleMultipleChoiceClickAction={handleMultipleChoiceClick}
            key={option}
            label={option}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-start">
        {isResetEnabled && (
          <Button
            className="border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-200 hover:text-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
            onClick={handleReset}
            size="sm"
            variant="outline"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        )}
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
};
