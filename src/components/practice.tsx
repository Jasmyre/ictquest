"use client";

import { CircleAlert, RotateCcw } from "lucide-react";
import Prism from "prismjs";
import type { JSX } from "react";
import { useCallback, useEffect, useState } from "react";
import { setSessionStorageItem } from "@/lib/utils";
import Browser from "./browser";
import ButtonChoice from "./button-choice";
import CodeBlock from "./code";
import { Button } from "./ui/button";

type PracticeProps = {
  setNumberOfCorrectAction: (value: (count: number) => number) => void;
  setNumberOfInCorrectAction: (value: (count: number) => number) => void;
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
  isResetEnabled?: boolean;
};

export const Practice = ({
  choices,
  setNumberOfCorrectAction,
  setNumberOfInCorrectAction,
  isResetEnabled = true,
  setIsFinishedAction,
  shuffledData,
  title,
  initialCode = ["", ""],
  response = { negative: "Incorrect, Please try again!" },
}: PracticeProps): JSX.Element => {
  const hint = true;
  const [code, setCode] = useState<string>("");
  const [disabledButtons, setDisabledButtons] = useState<string[]>([]);
  const [_isCorrect, setIsCorrect] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const correctCode = choices?.answer;
  const correctCodeFormatted = choices?.answer
    .toString()
    .replaceAll(" ", "")
    .replaceAll("\n", "");

  const handleReset = useCallback(() => {
    setCode("");
    setDisabledButtons([]);
    setIsFinishedAction(false);
    setIsCorrect(false);
    setHasSubmitted(false);
  }, [setIsFinishedAction]);

  useEffect(() => {
    Prism.highlightAll();
    if (!hasSubmitted) {
      setIsFinishedAction(false);
    }

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Backspace") {
        handleReset();
      }
    };

    if (
      shuffledData &&
      disabledButtons.length === shuffledData.length &&
      !hasSubmitted
    ) {
      if (code.replace(/\s/g, "") === correctCodeFormatted) {
        setIsFinishedAction(true);
        setIsCorrect(true);
        setNumberOfCorrectAction((prev) => prev + 1);
      } else {
        setNumberOfInCorrectAction((prev) => prev + 1);
        if (isResetEnabled) {
          setIsFinishedAction(false);
          setIsCorrect(false);
        } else {
          setIsFinishedAction(true);
          setIsCorrect(true);
        }
      }
      setHasSubmitted(true);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    code,
    correctCodeFormatted,
    handleReset,
    setIsFinishedAction,
    disabledButtons,
    shuffledData,
    hasSubmitted,
    isResetEnabled,
    setNumberOfCorrectAction,
    setNumberOfInCorrectAction,
  ]);

  const handleClick = (label: string, priority: number): void => {
    setCode((prevCode) => {
      const newCode = prevCode + label;
      if (newCode === choices?.answer) {
        setSessionStorageItem("finish", true);
      }
      return newCode;
    });

    setDisabledButtons((prevDisabled) => [...prevDisabled, label + priority]);
  };

  const renderMessage = (): JSX.Element | null => {
    if (disabledButtons.length !== shuffledData?.length || !code) {
      return null;
    }

    if (
      code.replaceAll(" ", "").replaceAll("\n", "") === correctCodeFormatted
    ) {
      if (!response?.positive) {
        return null;
      }
      return (
        <div className="rounded bg-green-600 p-2 shadow">
          <p className="flex gap-2 text-green-200">
            <CircleAlert />
            {response?.positive}
          </p>
        </div>
      );
    }
    if (!response?.negative) {
      return null;
    }

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
      <CodeBlock code={code} initialCode={initialCode} language="HTML" />
      <div className="mt-2 flex flex-wrap justify-start gap-4">
        {isResetEnabled ? (
          <Button
            className="border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-200 hover:text-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
            onClick={handleReset}
            size="sm"
            variant="outline"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        ) : null}

        {hint && (
          <div className="flex items-center justify-center text-gray-500 text-sm">
            <p>Please think carefully before you choose your answer!</p>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-4">
        {shuffledData?.map((option) => (
          <ButtonChoice
            disabled={disabledButtons.includes(option.label + option.priority)}
            key={option.label.trim() + option.priority}
            onClick={() => handleClick(option.label, option.priority)}
          >
            {option.label.trim()}
          </ButtonChoice>
        ))}
      </div>
      <br />
      {code.replaceAll(" ", "").replaceAll("\n", "") ===
        correctCodeFormatted && (
        <Browser
          content={
            initialCode
              ? initialCode.toLocaleString() + correctCode
              : correctCode?.toString()
          }
          title="Document"
        />
      )}
      <br />
      {renderMessage()}
      <br />
      <br />
    </div>
  );
};
