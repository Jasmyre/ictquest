"use client";

import CodeBlock from "@/components/Code";
import LessonCard from "@/components/LessonCard";
import ButtonChoice from "../../../ButtonChoice";
import CodeHighlight from "../../../CodeHighlight";

import { Button } from "@/components/ui/button";
import { shuffle } from "@/lib/utils";
import { RotateCcw } from "lucide-react";
import { useState } from "react";

const data = {
  choices: [
    {
      label: "<button>",
      priority: 1,
    },
    {
      label: "like",
      priority: 2,
    },
    {
      label: "</button>",
      priority: 3,
    },
  ],
};

const shuffledData = shuffle(data.choices);

console.log(data);

const Index3 = () => {
  const [code, setCode] = useState("");
  const [disabledButtons, setDisabledButtons] = useState<string[]>([]);

  const handleClick = (e: React.MouseEvent, label: string) => {
    setCode(() => code + label);
    setDisabledButtons((prevDisabled) => [...prevDisabled, label]);
  };

  const handleReset = () => {
    setCode("");
    setDisabledButtons([]);
  }

  return (
    <LessonCard>
      <p>
        By adding the HTML code{" "}
        <CodeHighlight>&lt;button&gt;Like&lt;/button&gt;</CodeHighlight>, you
        can create a button with the label &quot;Like&quot;.
      </p>
      <br />
      <CodeBlock language="HTML">
        {code}
      </CodeBlock>
      <br />
      <div className="flex justify-start">
        <Button onClick={handleReset} className="border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 hover:text-900 dark:text-gray-400 dark:hover:text-gray-200">
          <RotateCcw />
        </Button>
      </div>
      <br />
      <div className="flex justify-center gap-4 flex-wrap">
        {shuffledData.map((choice) => {
          return (
            <ButtonChoice
              key={choice.label}
              onClick={(e) => handleClick(e, choice.label)}
              disabled={disabledButtons.includes(choice.label)}
            >
              {choice.label}
            </ButtonChoice>
          );
        })}
      </div>
    </LessonCard>
  );
};

export default Index3;
