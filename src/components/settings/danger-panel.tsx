"use client";

import { useRouter } from "next/navigation";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { toastStyle } from "@/lib/utils";
import { api } from "@/trpc/react";

/**
 * Settings Danger panel (spec #81, ticket #85).
 *
 * Duplicate (not move) of the profile `DeleteDataCard` reset-data flow:
 * the same two Procedures (`deleteAllUserAchievements`,
 * `deleteAllUserProgress`) exposed as SEPARATE actions, each with its
 * own confirm flow and per-action failure handling. The profile buttons
 * stay untouched.
 */
export function DangerPanel() {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const deleteAllUserProgressMutation =
    api.user.deleteAllUserProgress.useMutation();
  const deleteAllUserAchievementsMutation =
    api.user.deleteAllUserAchievements.useMutation();

  const handleDeleteProgress = () => {
    startTransition(async () => {
      try {
        await deleteAllUserProgressMutation.mutateAsync();

        router.refresh();

        toast({
          description: "Learning progress deleted.",
          className: toastStyle,
        });
      } catch (error: unknown) {
        console.error("Delete progress error:", error);
        toast({
          description:
            error instanceof Error
              ? error?.message
              : "Failed to delete progress. Please try again later.",
          className: toastStyle,
        });
      }
    });
  };

  const handleDeleteAchievements = () => {
    startTransition(async () => {
      try {
        await deleteAllUserAchievementsMutation.mutateAsync();

        router.refresh();

        toast({
          description: "Achievements deleted.",
          className: toastStyle,
        });
      } catch (error: unknown) {
        console.error("Delete achievements error:", error);
        toast({
          description:
            error instanceof Error
              ? error?.message
              : "Failed to delete achievements. Please try again later.",
          className: toastStyle,
        });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Danger zone</CardTitle>
        <CardDescription>
          Delete your learning data. Each action is separate and cannot be
          undone.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className="w-full justify-between transition-transform duration-150 ease-out active:scale-[0.98]"
              disabled={isPending}
              variant="outline"
            >
              Delete learning progress
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete learning progress?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                learning progress.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
              <AlertDialogAction asChild onClick={handleDeleteProgress}>
                <Button disabled={isPending} variant="destructive">
                  Delete progress
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className="w-full justify-between transition-transform duration-150 ease-out active:scale-[0.98]"
              disabled={isPending}
              variant="outline"
            >
              Delete achievements
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete achievements?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                achievements.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
              <AlertDialogAction asChild onClick={handleDeleteAchievements}>
                <Button disabled={isPending} variant="destructive">
                  Delete achievements
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
