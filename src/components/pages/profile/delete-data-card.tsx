"use client";

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useTransition } from "react";
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
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { toastStyle } from "@/lib/utils";
import { api } from "@/trpc/react";

export const DeleteDataCard = () => {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const deleteAllUserProgressMutation =
    api.user.deleteAllUserProgress.useMutation();
  const deleteAllUserAchievementsMutation =
    api.user.deleteAllUserAchievements.useMutation();

  const handleReset = () => {
    startTransition(async () => {
      try {
        await deleteAllUserAchievementsMutation.mutateAsync();
        await deleteAllUserProgressMutation.mutateAsync();

        router.refresh();

        toast({
          description: "Data reset successfully",
          className: toastStyle,
        });
      } catch (error: unknown) {
        console.error("Reset data error:", error);
        toast({
          description:
            error instanceof Error
              ? error?.message
              : "Failed to reset data. Please try again later.",
          className: toastStyle,
        });
      }
    });
  };

  const handleSignOut = () => {
    startTransition(async () => {
      await signOut();
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            className="h-9 w-full cursor-pointer rounded bg-gray-200 px-4 py-2 text-gray-400 hover:bg-gray-300 hover:text-gray-400 dark:bg-gray-800 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-400"
            disabled={isPending}
          >
            Log out
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="cursor-pointer border-gray-200 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
          <AlertDialogHeader>
            <AlertDialogTitle>Log Out</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to log out?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="cursor-pointer border border-gray-300 bg-white text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              disabled={isPending}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="cursor-pointer bg-indigo-600 text-white transition-colors duration-200 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              disabled={isPending}
              onClick={handleSignOut}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            className="h-9 w-full cursor-pointer rounded bg-gray-200 px-4 py-2 text-gray-400 hover:bg-gray-300 hover:text-gray-400 dark:bg-gray-800 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-400"
            disabled={isPending}
          >
            Reset Data
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="border-gray-200 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently reset your
              data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="cursor-pointer border border-gray-300 bg-white text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              disabled={isPending}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction asChild onClick={handleReset}>
              <Button
                className="cursor-pointer bg-destructive text-gray-100 shadow-sm hover:bg-destructive/90 dark:text-gray-100"
                disabled={isPending}
                variant={"destructive"}
              >
                Reset Data
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
