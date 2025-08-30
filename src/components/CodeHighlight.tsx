import React, { ReactNode } from "react";

const CodeHighlight = ({ children }: { children: ReactNode }) => {
  return (
    <code className=" cursor-pointer border border-gray-200 dark:border-gray-700 px-1 bg-gray-200 dark:bg-gray-700 rounded font-semibold text-gray-900 dark:text-gray-200 max-md:text-white text-accent-foreground">
      {children}
    </code>
  );
};

export default CodeHighlight;
