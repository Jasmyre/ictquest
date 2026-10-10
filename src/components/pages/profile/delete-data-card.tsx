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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Session & data</CardTitle>
        <CardDescription>Sign out or reset your learning data.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className="w-full justify-between transition-transform duration-150 ease-out active:scale-[0.98]"
              disabled={isPending}
              variant="outline"
            >
              Log out
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Log out</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to log out?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
              <AlertDialogAction disabled={isPending} onClick={handleSignOut}>
                Continue
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
};
