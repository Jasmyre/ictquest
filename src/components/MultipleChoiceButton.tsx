"use client";

import React, { type JSX } from "react";
import { Button } from "./ui/button";

export const MultipleChoiceButton = ({
  label,
  disabledButtons,
  handleMultipleChoiceClickAction,
}: {
  label: string;
  disabledButtons: string[];
  handleMultipleChoiceClickAction: (label: string) => void;
}): JSX.Element => {
  return (
    <Button
      className={`bg-gray-100 text-gray-700 hover:bg-indigo-500 hover:text-gray-200 dark:border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:border-gray-700 dark:hover:bg-indigo-500`}
      onClick={() => handleMultipleChoiceClickAction(label)}
      disabled={disabledButtons.includes(label)}
      tabIndex={0}
    >
      {label}
    </Button>
  );
};
