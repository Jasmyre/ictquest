import React from 'react'
import { Button } from "./ui/button";

export const MultipleChoiceButton = ({
  label,
  disabledButtons,
  handleMultipleChoiceClick,
}: {
  label: string;
  disabledButtons: string[];
  handleMultipleChoiceClick: (label: string) => void;
}) => {
  return (
    <Button
      className="dark:border-gray-200 dark:bg-gray-700 dark:hover:border-gray-700 dark:hover:bg-indigo-500"
      onClick={() => handleMultipleChoiceClick(label)}
      disabled={disabledButtons.includes(label)}
    >
      {label}
    </Button>
  );
};
