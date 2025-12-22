"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Star, XCircle } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import ContinueLearningButton from "@/components/continue-learning-button";
import { CustomBadge } from "@/components/custom-badge";
import { CustomProgress } from "@/components/custom-progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { toastDescription, toastStyle } from "@/lib/utils";
import { api } from "@/trpc/react";

type Props = {
  correct: number;
  incorrect: number;
  average: number;
  averageProgress: number;
  randomImage: string;
};

function getAchievementNameFromProgress(avg: number) {
  if (avg < 33.33) {
    return "Beginner";
  }
  if (avg < 66.66) {
    return "Intermediate";
  }
  return "Expert";
}

function getBadgeColorFromProgress(avg: number) {
  if (avg < 33.33) {
    return "green";
  }
  if (avg < 66.66) {
    return "orange";
  }
  return "red";
}

export default function ComplimentsUI({
  correct,
  incorrect,
  average,
  averageProgress,
  randomImage,
}: Props) {
  const [achievementUnlocked, setAchievementUnlocked] = useState(false);

  // new: ref to avoid calling unlock more than once
  const unlockAttemptedRef = useRef(false);

  const achievementsQuery = api.user.getUserAchievements.useQuery(
    { skip: 0, take: 100 },
    { refetchOnWindowFocus: false }
  );

  const unlockUserAchievementMutation =
    api.user.unlockUserAchievement.useMutation({
      onSuccess: (res) => {
        if (res?.success) {
          toast({
            title:
              res.data.status === "new"
                ? "NEW ACHIEVEMENT UNLOCKED!"
                : "Achievement already unlocked",
            description: toastDescription(
              res.data.achievement?.achievementName ?? "No title",
              res.data.achievement?.achievementDescription ?? "No description"
            ),
            className: toastStyle,
          });
          setAchievementUnlocked(true);
        }
      },
      onError: (err) => {
        console.error("Failed to unlock achievement", err);
        // allow retry after failure
        unlockAttemptedRef.current = false;
        toast({
          title: "Failed to unlock achievement",
          className: toastStyle,
        });
      },
    });

  const unlockAchievement = useCallback(
    async (name: string) => {
      if (!name) {
        return;
      }
      // avoid double calls
      if (unlockAttemptedRef.current) {
        return;
      }
      // avoid calling while mutation already in flight
      if (unlockUserAchievementMutation.isPending) {
        return;
      }

      try {
        unlockAttemptedRef.current = true; // mark we attempted
        await unlockUserAchievementMutation.mutateAsync({
          achievementName: name,
        });
        // onSuccess will set state and toast
      } catch {
        // onError handles unlockingAttemptRef reset and toast
      }
    },
    [unlockUserAchievementMutation]
  );

  const targetAchievementName = getAchievementNameFromProgress(averageProgress);

  useEffect(() => {
    if (achievementUnlocked) {
      return;
    }

    if (achievementsQuery.isLoading || achievementsQuery.isFetching) {
      return;
    }
    if (achievementsQuery.isError) {
      return;
    }

    const existing = achievementsQuery.data?.data?.some(
      (ua) => ua.achievementName === targetAchievementName
    );

    if (existing) {
      setAchievementUnlocked(true);
      return;
    }

    // Not unlocked yet -> attempt to unlock
    unlockAchievement(targetAchievementName);
  }, [
    achievementUnlocked,
    achievementsQuery.data,
    achievementsQuery.isLoading,
    achievementsQuery.isFetching,
    achievementsQuery.isError,
    unlockAchievement,
    targetAchievementName,
  ]);

  return (
    <main>
      <div className="py-10">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="px-4 py-8 sm:px-0">
            <Card className="border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center font-semibold text-2xl text-gray-900 dark:text-gray-100">
                  <motion.div
                    animate={{ rotate: 0, scale: 1 }}
                    initial={{ rotate: -10, scale: 0.5 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Star className="mr-2 h-8 w-8 text-yellow-400" />
                  </motion.div>
                  Incredible effort! You're becoming a true HTML expert!
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="mb-4">
                  <CustomProgress finalValue={average} initialValue={0} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-gray-600 text-sm dark:text-gray-400">
                        Correct {correct}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <XCircle className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="text-gray-600 text-sm dark:text-gray-400">
                        Incorrect {incorrect}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-center">
                  <CustomBadge
                    color={getBadgeColorFromProgress(averageProgress)}
                  >
                    {getAchievementNameFromProgress(averageProgress)}
                  </CustomBadge>
                </div>

                <div className="mt-6 flex items-center justify-center">
                  <Image
                    alt="Celebration"
                    className="rounded-lg"
                    height={300}
                    priority
                    src={randomImage || "/placeholder.svg"}
                    unoptimized
                    width={400}
                  />
                </div>

                <div className="mt-8">
                  <ContinueLearningButton disabled={false} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
