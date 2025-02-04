"use client";

import { setSessionStorageItem } from "@/lib/utils";
import { RotateCcw } from "lucide-react";
import React, { useState } from "react";
import { MultipleChoiceButton } from "./MultipleChoiceButton";
import { Button } from "./ui/button";

export const MultipleChoice = ({
  choices,
  setIsFinished,
}: {
  setIsFinished: (value: boolean) => void;
  choices: {
    options: string[];
    answer: string;
  };
}) => {
  const [choice, setChoice] = useState("");
  const [disabledButtons, setDisabledButtons] = useState<string[]>([]);

  React.useEffect(() => {
    if (choice === choices.answer) {
      setIsFinished(true);
    } else {
      setIsFinished(false);
    }
  }, [choice, choices.answer, setIsFinished]);

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
};
