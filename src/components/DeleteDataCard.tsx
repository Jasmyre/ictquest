"use client";

import { signOut } from "next-auth/react";
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
import { toastStyle } from "@/lib/utils";

interface DeleteDataCardProps {
  onResetAction: () => void;
}

export function DeleteDataCard({ onResetAction }: DeleteDataCardProps) {
  const handleReset = async () => {
    try {
      const endpoints = ["/api/public/progress/", "/api/user-achievements/"];

      const responses = await Promise.all(
        endpoints.map((endpoint) => fetch(endpoint, { method: "DELETE" }))
      );

      const results = await Promise.all(
        responses.map(async (res) => {
          if (!res.ok) {
            const errorBody = await res.json();
            throw new Error(
              `Failed to delete from ${res.url}: ${res.status} - ${JSON.stringify(errorBody)}`
            );
          }
          return res.json();
        })
      );

      console.log("Results:", results);

      toast({
        description: "Data has been removed successfully",
        className: toastStyle,
      });
      onResetAction();
    } catch (error) {
      console.error("Error deleting progress and achievements:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <AlertDialog>
        <AlertDialogTrigger className="h-9 w-full rounded bg-gray-200 px-4 py-2 text-gray-400 hover:bg-gray-300 hover:text-gray-400 dark:bg-gray-800 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-400">
          Log out
        </AlertDialogTrigger>
        <AlertDialogContent className="border-gray-200 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
          <AlertDialogHeader>
            <AlertDialogTitle>Log Out</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to log out?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border border-gray-300 bg-white text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-indigo-600 text-white transition-colors duration-200 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              onClick={async () => await signOut()}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog>
        <AlertDialogTrigger className="h-9 rounded bg-gray-200 px-4 py-2 text-gray-400 hover:bg-red-500 hover:text-red-200 dark:bg-gray-800 dark:text-gray-500 dark:hover:bg-red-500 dark:hover:text-red-200">
          Reset Data
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
    </div>
  );
}
