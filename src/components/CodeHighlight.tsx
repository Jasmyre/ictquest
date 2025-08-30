import React, { ReactNode } from "react";

const CodeHighlight = ({ children }: { children: ReactNode }) => {
  return (
    <code className="text-accent-foreground cursor-pointer rounded border border-gray-200 bg-gray-200 px-1 font-semibold text-gray-900 max-md:text-white dark:border-gray-700 dark:bg-gray-700 dark:text-gray-200">
      {children}
    </code>
  );
};

export default CodeHighlight;
