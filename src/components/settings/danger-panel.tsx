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
 * sequential `deleteAllUserAchievements` then `deleteAllUserProgress`
 * against the SAME Procedures. The profile buttons stay untouched.
 */
export function DangerPanel() {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Danger zone</CardTitle>
        <CardDescription>Reset your learning data.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className="w-full justify-between transition-transform duration-150 ease-out active:scale-[0.98]"
              disabled={isPending}
              variant="outline"
            >
              Reset data
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently reset your
                data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
              <AlertDialogAction asChild onClick={handleReset}>
                <Button disabled={isPending} variant="destructive">
                  Reset data
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
