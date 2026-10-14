"use client";

import { TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { toastStyle } from "@/lib/utils";
import { api } from "@/trpc/react";

const ROW =
  "cursor-pointer transition-transform duration-150 ease-out active:scale-[0.98]";

export function DangerSettingsCard() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const deleteProgress = api.user.deleteAllUserProgress.useMutation();
  const deleteAchievements = api.user.deleteAllUserAchievements.useMutation();

  const runReset = (kind: "progress" | "achievements" | "all") => {
    startTransition(async () => {
      try {
        if (kind === "progress" || kind === "all") {
          await deleteProgress.mutateAsync();
        }
        if (kind === "achievements" || kind === "all") {
          await deleteAchievements.mutateAsync();
        }
        router.refresh();
        toast({
          description: "Data reset successfully",
          className: toastStyle,
        });
      } catch (error: unknown) {
        toast({
          description:
            error instanceof Error
              ? error.message
              : "Failed to reset data. Please try again later.",
          className: toastStyle,
        });
      }
    });
  };

  return (
    <Card className="border-destructive/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive text-lg">
          <TriangleAlert aria-hidden="true" className="size-4" />
          Danger zone
        </CardTitle>
        <CardDescription>
          Same resets as your profile — nothing here is new, just closer.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Alert variant="destructive">
          <AlertTitle>Irreversible</AlertTitle>
          <AlertDescription>
            Deleted learning data cannot be recovered. Your account stays.
          </AlertDescription>
        </Alert>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div>
              <p className="font-medium text-sm">Reset learning progress</p>
              <p className="text-muted-foreground text-sm">
                Clears every completed subtopic.
              </p>
            </div>
            <ConfirmButton
              body="This permanently clears all completed subtopics."
              busy={isPending}
              onConfirm={() => runReset("progress")}
              title="Reset progress?"
            />
          </div>
          <Separator />
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div>
              <p className="font-medium text-sm">Reset achievements</p>
              <p className="text-muted-foreground text-sm">
                Locks every unlocked badge again.
              </p>
            </div>
            <ConfirmButton
              body="This permanently locks all unlocked achievements."
              busy={isPending}
              onConfirm={() => runReset("achievements")}
              title="Reset achievements?"
            />
          </div>
          <Separator />
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div>
              <p className="font-medium text-sm">Reset everything</p>
              <p className="text-muted-foreground text-sm">
                Progress plus achievements in one go.
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className={ROW}
                  disabled={isPending}
                  variant="destructive"
                >
                  Reset everything
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset everything?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This permanently clears all progress and achievements.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    className="cursor-pointer"
                    disabled={isPending}
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="cursor-pointer"
                    disabled={isPending}
                    onClick={() => runReset("all")}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ConfirmButton({
  busy,
  onConfirm,
  title,
  body,
}: {
  busy: boolean;
  onConfirm: () => void;
  title: string;
  body: string;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className={ROW} disabled={busy} variant="outline">
          Reset
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{body}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer" disabled={busy}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="cursor-pointer"
            disabled={busy}
            onClick={onConfirm}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
