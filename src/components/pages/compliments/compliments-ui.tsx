"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Star, XCircle } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
  console.log(`average: ${averageProgress}`);

  // visible state for rendering
  const [_unlockedNames, setUnlockedNames] = useState<Set<string>>(new Set());
  // synchronous ref for immediate checks (avoids races with setState)
  const unlockedNamesRef = useRef<Set<string>>(new Set());
  const inFlightRef = useRef<string | null>(null);

  const achievementsQuery = api.user.getUserAchievements.useQuery(
    { skip: 0, take: 100 },
    { refetchOnWindowFocus: false }
  );

  const unlockUserAchievementMutation =
    api.user.unlockUserAchievement.useMutation({
      onSuccess: (res) => {
        const name = res?.data?.achievement?.achievementName;
        if (name) {
          // update both ref and state
          unlockedNamesRef.current.add(name);
          setUnlockedNames((prev) => {
            const next = new Set(prev);
            next.add(name);
            return next;
          });
        }

        toast({
          title:
            res?.success && res.data.status === "new"
              ? "NEW ACHIEVEMENT UNLOCKED!"
              : "Achievement already unlocked",
          description: toastDescription(
            res?.data?.achievement?.achievementName ?? "No title",
            res?.data?.achievement?.achievementDescription ?? "No description"
          ),
          className: toastStyle,
        });

        // refresh server list to keep in sync
        achievementsQuery.refetch();

        // clear in-flight (safety)
        if (inFlightRef.current) {
          inFlightRef.current = null;
        }
      },
      onError: (err) => {
        console.error("Failed to unlock achievement", err);
        toast({
          title: "Failed to unlock achievement",
          className: toastStyle,
        });
        if (inFlightRef.current) {
          inFlightRef.current = null;
        }
      },
    });

  // helper: merge server known names into our ref + state
  function mergeServerNamesToLocal() {
    const serverList = achievementsQuery.data?.data ?? [];
    let added = false;
    for (const a of serverList) {
      if (!unlockedNamesRef.current.has(a.achievementName)) {
        unlockedNamesRef.current.add(a.achievementName);
        added = true;
      }
    }
    if (added) {
      setUnlockedNames(new Set(unlockedNamesRef.current));
    }
  }

  // perform unlock: only uses inFlightRef & unlockedNamesRef (no mutation flags)
  async function unlockAchievement(name: string) {
    if (!name) {
      return;
    }
    // already known unlocked (server or local)
    if (unlockedNamesRef.current.has(name)) {
      return;
    }
    // already sending this exact name
    if (inFlightRef.current === name) {
      return;
    }

    inFlightRef.current = name;
    try {
      await unlockUserAchievementMutation.mutateAsync({
        achievementName: name,
      });
      // onSuccess will update local sets and clear inFlightRef
    } catch {
      // onError will clear inFlightRef
    } finally {
      // as extra safety: clear if still the same name
      if (inFlightRef.current === name) {
        inFlightRef.current = null;
      }
    }
  }

  const targetAchievementName = getAchievementNameFromProgress(averageProgress);

  // sync server names when query finishes/changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: explanation
  useEffect(() => {
    if (achievementsQuery.isLoading || achievementsQuery.isFetching) {
      return;
    }
    if (achievementsQuery.isError) {
      return;
    }
    mergeServerNamesToLocal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    achievementsQuery.isLoading,
    achievementsQuery.isFetching,
    achievementsQuery.isError,
  ]);

  // try unlocking whenever target changes and it's not yet known locally
  // biome-ignore lint/correctness/useExhaustiveDependencies: explanation
  useEffect(() => {
    if (!targetAchievementName) {
      return;
    }
    if (achievementsQuery.isLoading || achievementsQuery.isFetching) {
      return;
    }
    if (achievementsQuery.isError) {
      return;
    }

    // make sure server-known names are merged first
    mergeServerNamesToLocal();

    if (unlockedNamesRef.current.has(targetAchievementName)) {
      // already unlocked
      return;
    }

    // attempt unlock
    unlockAchievement(targetAchievementName);
    // intentionally do not include unlockedNames state in deps (we use the ref)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    targetAchievementName,
    achievementsQuery.isLoading,
    achievementsQuery.isFetching,
    achievementsQuery.isError,
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
