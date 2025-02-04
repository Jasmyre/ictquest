"use client"

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
      className={`bg-gray-100 hover:bg-indigo-500 hover:text-gray-200 text-gray-700 dark:text-gray-200 dark:border-gray-200 dark:bg-gray-700 dark:hover:border-gray-700 dark:hover:bg-indigo-500`}
      onClick={() => handleMultipleChoiceClick(label)}
      disabled={disabledButtons.includes(label)}
    >
      {label}
    </Button>
  );
};
