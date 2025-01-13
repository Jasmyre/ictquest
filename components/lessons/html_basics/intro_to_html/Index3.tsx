"use client";

import CodeBlock from "@/components/Code";
import LessonCard from "@/components/LessonCard";
import ButtonChoice from "../../../ButtonChoice";
import CodeHighlight from "../../../CodeHighlight";
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

console.log(data);

const Index3 = () => {
  const [code, setCode] = useState("");
  const [disabledButtons, setDisabledButtons] = useState<string[]>([]);

  const handleClick = (e: React.MouseEvent, label: string) => {
    setCode(() => code + label);
    setDisabledButtons((prevDisabled) => [...prevDisabled, label]);
  };
  return (
    <LessonCard>
      <p>
        By adding the HTML code{" "}
        <CodeHighlight>&lt;button&gt;Like&lt;/button&gt;</CodeHighlight>, you
        can create a button with the label &quot;Like&quot;.
      </p>
      <br />
      <CodeBlock language="HTML">
        {/* &lt;button&gt;Like&lt;/button&gt; */}
        {code}
      </CodeBlock>
      <br />
      <div className="flex justify-center gap-4 flex-wrap">
        {data.choices.map((choice) => {
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
