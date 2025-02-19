"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { removeLocalStorageItem } from "@/lib/utils";

interface DeleteDataCardProps {
  onResetAction: () => void;
}

export function DeleteDataCard({ onResetAction }: DeleteDataCardProps) {
  const handleReset = () => {
    removeLocalStorageItem("userData");
    toast({
      description: "Data has been removed successfully",
      className:
        "bg-gray-100 dark:bg-gray-900 border border-gray-400 dark:border-gray-700 text-gray-500 dark:text-gray-200",
    });
    onResetAction();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger className="h-9 rounded bg-gray-200 px-4 py-2 text-gray-400 hover:bg-red-500 hover:text-red-200 dark:bg-gray-800 dark:text-gray-500 dark:hover:bg-red-500 dark:hover:text-red-200">
        Delete Data
      </AlertDialogTrigger>
      <AlertDialogContent className="border-gray-200 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border border-gray-300 bg-white text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-indigo-600 text-white transition-colors duration-200 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            onClick={handleReset}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
