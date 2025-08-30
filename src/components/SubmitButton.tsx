import React from "react";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

interface SubmitButtonProps {
  label: string;
}

const SubmitButton = ({ label = "continue" }: SubmitButtonProps) => {
  return (
    <Button className="w-max border-none bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-600">
      {label}
      <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  );
};

export default SubmitButton;
