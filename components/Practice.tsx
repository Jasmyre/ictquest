"use client";

import { setSessionStorageItem } from "@/lib/utils";
import { CircleAlert, RotateCcw } from "lucide-react";
import React, { JSX, useState } from "react";
import Browser from "./Browser";
import ButtonChoice from "./ButtonChoice";
import CodeBlock from "./Code";
import { Button } from "./ui/button";

export const Practice = ({
  choices,
  setIsFinished,
  shuffledData,
  title,
  response = { negative: "Incorrect, Please try again!"}
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
    answer: string | JSX.Element;
  };
  title?: string[]
  response?: {
    negative: string;
    positive?: string;
  }
}) => {
  const [code, setCode] = useState<string>("");
  const [disabledButtons, setDisabledButtons] = useState<string[]>([]);
  const correctCode = choices?.answer;
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  React.useEffect(() => {
    setIsFinished(false);

    if (code === correctCode) {
      setIsFinished(true);
      setIsCorrect(true)
    } else {
      setIsFinished(false);
      setIsCorrect(false)
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
    setIsCorrect(false)
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
          <p className="text-red-200 flex gap-2"><CircleAlert />{response?.negative}</p>
        </div>
      );
    }
  };

  return (
    <div>
      <div>
        {title?.map(item => {
          return (
            <div key={item}>
              <p >{item}</p>
              <br />
            </div>
          )
        })}
      </div>
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
            key={option.label.trim()}
            onClick={() => handleClick(option.label)}
            disabled={disabledButtons.includes(option.label)}
          >
            {option.label.trim()}
          </ButtonChoice>
        ))}
      </div>
      <br />
      {renderMessage()}
      {code === correctCode && (
        <Browser
          title="Document"
          content={correctCode}
        />
      )}
      <br />
      <br />
    </div>
  );
};
