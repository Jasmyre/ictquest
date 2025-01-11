import React, { ReactNode } from "react";
import { Button } from "./ui/button";

const ButtonChoice = ({ children }: { children: ReactNode }) => {
  return (
    <Button
      variant={"outline"}
      className="border px-6 py-2 border-gray-200 dark:border-gray-700 bg-accent bg-white hover:bg-gray-200 dark:hover:bg-gray-800 dark:bg-gray-700  rounded text-gray-200 max-md:text-white text-accent-foreground"
    >
      {children}
    </Button>
  );
};

export default ButtonChoice;
