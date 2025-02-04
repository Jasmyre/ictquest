"use client";

import { setSessionStorageItem } from "@/lib/utils";
import { RotateCcw } from "lucide-react";
import React, { useState } from "react";
import Browser from "./Browser";
import ButtonChoice from "./ButtonChoice";
import CodeBlock from "./Code";
import { Button } from "./ui/button";

export const Practice = ({
  choices,
  setIsFinished,
  shuffledData,
}: {
  setIsFinished: (value: boolean) => void;
  shuffledData?: {
    label: string;
    priority: number;
  }[];
  choices?: {
    options: {
      label: string;
      priority: number;
    }[];
    answer: string;
  };
}) => {
  const [code, setCode] = useState<string>("");
  const [disabledButtons, setDisabledButtons] = useState<string[]>([]);
  const correctCode = choices?.answer;

  React.useEffect(() => {
    setIsFinished(false);

    if (code === correctCode) {
      setIsFinished(true);
    } else {
      setIsFinished(false);
    }
  }, [code, correctCode, setIsFinished]);

  const handleClick = (label: string) => {
    setCode((prevCode) => {
      const newCode = prevCode + label;
      if (newCode === correctCode) {
        setSessionStorageItem("finish", true);
      }
      return newCode;
    });
    setDisabledButtons((prevDisabled) => [...prevDisabled, label]);
  };

  const handleReset = () => {
    setCode("");
    setDisabledButtons([]);
    setIsFinished(false);
  };

  return (
    <div>
      <CodeBlock language="HTML">{code}</CodeBlock>
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
            key={option.label}
            onClick={() => handleClick(option.label)}
            disabled={disabledButtons.includes(option.label)}
          >
            {option.label}
          </ButtonChoice>
        ))}
      </div>
      <br />
      {code === correctCode && (
        <Browser
          title="Great job! You've created a button in HTML."
          content={correctCode}
        />
      )}
      <br />
      <br />
    </div>
  );
};
