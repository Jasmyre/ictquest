import Prism from "prismjs";
import type { ReactNode } from "react";
import React, { useEffect } from "react";
import { Button } from "./ui/button";

const ButtonChoice = ({
  children,
  onClick,
  language = "html",
  disabled,
  ...props
}: {
  language?: string;
  children: ReactNode;
  disabled: boolean;
  onClick: (e: React.MouseEvent) => void;
}) => {
  useEffect(() => {
    Prism.highlightAll();
  });

  const escapeHtml = (unsafe: string) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      variant={"outline"}
      className="text-accent-foreground max-w-[100vw] rounded border border-gray-200 bg-gray-700 px-6 py-2 text-wrap text-gray-200 hover:bg-[#282C34] hover:brightness-200 max-md:text-white dark:border-gray-700 hover:dark:brightness-125"
      {...props}
    >
      <pre
        tabIndex={-1}
        style={{
          margin: 0,
          padding: ".5rem 1rem",
          border: "none",
          background: "initial",
        }}
        className="m-0 p-2"
      >
        <code
          tabIndex={-1}
          className={`language-${language} m-0 h-full min-h-[20vh] rounded-[0_0_.75rem_.75rem] border-none bg-[#282C34] text-wrap`}
          dangerouslySetInnerHTML={{
            __html: escapeHtml(children as string).trim(),
          }}
        />
      </pre>
    </Button>
  );
};

export default ButtonChoice;
