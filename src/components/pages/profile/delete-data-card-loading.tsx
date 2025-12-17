"use client";

import { Button } from "@/components/ui/button";

export const DeleteDataCardLoading = () => (
  <div className="flex flex-col gap-4">
    <Button
      className="h-9 w-full cursor-pointer rounded bg-gray-200 px-4 py-2 text-gray-400 hover:bg-gray-300 hover:text-gray-400 dark:bg-gray-800 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-400"
      disabled
    >
      Log out
    </Button>
    <Button
      className="h-9 w-full cursor-pointer rounded bg-gray-200 px-4 py-2 text-gray-400 hover:bg-gray-300 hover:text-gray-400 dark:bg-gray-800 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-400"
      disabled
    >
      Reset Data
    </Button>
  </div>
);
