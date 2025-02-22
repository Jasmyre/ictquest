"use client";

import { setSessionStorageItem } from "@/lib/utils";
import { CircleAlert, RotateCcw } from "lucide-react";
import React, { JSX, useState } from "react";
import Browser from "./Browser";
import ButtonChoice from "./ButtonChoice";
import CodeBlock from "./Code";
import { Button } from "./ui/button";

interface PracticeProps {
  setIsFinishedAction: (value: boolean) => void;
  shuffledData?: {
    label: string;
    priority: number;
  }[];
  choices?: {
    options: {
      label: string;
      priority: number;
    }[];
    answer: string | JSX.Element;
  };
  title?: string[];
  initialCode?: string[];
  response?: {
    negative?: string;
    positive?: string;
  };
}

export const Practice = ({
  choices,
  setIsFinishedAction,
  shuffledData,
  title,
  initialCode = ["", ""],
  response = { negative: "Incorrect, Please try again!" },
}: PracticeProps) => {
  const [code, setCode] = useState<string>("");
  const [disabledButtons, setDisabledButtons] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const correctCode = choices?.answer;

  React.useEffect(() => {
    setIsFinishedAction(false);

    if (code === correctCode) {
      setIsFinishedAction(true);
      setIsCorrect(true);
    } else {
      setIsFinishedAction(false);
      setIsCorrect(false);
    }

    console.log(code);
  }, [code, correctCode, setIsFinishedAction]);

  const handleClick = (label: string) => {
    setCode((prevCode) => {
      const newCode = prevCode + label;
      if (newCode === choices?.answer) {
        setSessionStorageItem("finish", true);
      }
      return newCode;
    });

    setDisabledButtons((prevDisabled) => [...prevDisabled, label]);
  };


  const handleReset = () => {
    setCode("");
    setDisabledButtons([]);
    setIsFinishedAction(false);
    setIsCorrect(false);
  };

  const renderMessage = () => {
    if (disabledButtons.length !== shuffledData?.length || !code) return null;

    if (code === correctCode) {
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
    } else {
      if (!response?.negative) return null;

      return (
        <div className="rounded bg-red-600 p-2 shadow">
          <p className="flex gap-2 text-red-200">
            <CircleAlert />
            {response?.negative}
          </p>
        </div>
      );
    }
  };

  return (
    <div>
      <div>
        {title?.map((item) => {
          return (
            <div key={item}>
              <p>{item}</p>
              <br />
            </div>
          );
        })}
      </div>
      <CodeBlock language="HTML" initialCode={initialCode} code={code} />
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
      <div className="mt-4 flex flex-wrap justify-center gap-4">
        {shuffledData?.map((option) => (
          <ButtonChoice
            key={option.label.trim()}
            onClick={() => handleClick(option.label)}
            disabled={disabledButtons.includes(option.label)}
          >
            {option.label.trim()}
          </ButtonChoice>
        ))}
      </div>
      <br />
      {code === correctCode && (
        <Browser title="Document" content={correctCode} />
      )}
      <br />
      {renderMessage()}
      <br />
      <br />
    </div>
  );
};
