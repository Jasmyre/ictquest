import React, { ReactNode } from "react";
import { Button } from "./ui/button";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

const ButtonChoice = ({ children, onClick, disabled, ...props }: { children: ReactNode, disabled: boolean, onClick: (e: React.MouseEvent) => void }) => {
  return (
    <Button
    disabled={disabled}
    onClick={onClick}
      variant={"outline"}
      className="border px-6 py-2 border-gray-200 dark:border-gray-700 bg-accent bg-[#282C34] hover:bg-[#282C34] hover:brightness-200 hover:dark:brightness-125  rounded text-gray-200 max-md:text-white text-accent-foreground"
      {...props}
    >
      <SyntaxHighlighter language="html" style={atomOneDark}>
        {children as string}
      </SyntaxHighlighter>
    </Button>
  );
};

export default ButtonChoice;
