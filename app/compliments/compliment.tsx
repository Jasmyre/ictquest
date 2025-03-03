"use client";

import { CustomProgress } from "@/components/CustomProgress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import lessons from "@/db/lessons";
import { toast } from "@/hooks/use-toast";
import { toastDescription, toastStyle } from "@/lib/utils";
import { ProgressData } from "@prisma/client";
import { motion } from "framer-motion";
import { CheckCircle2, Star, Target, XCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Confetti from "../../components/Confetti";
import ContinueLearningButton from "../../components/ContinueLearningButton";
import { CustomBadge } from '@/components/CustomBadge';

// const achievements = [
//   {
//     name: "HTML Novice",
//     description: "Completed your first HTML lesson",
//     icon: BookOpen,
//   },
//   {
//     name: "Tag Master",
//     description: "Successfully used multiple HTML tags",
//     icon: Code,
//   },
//   {
//     name: "Quick Learner",
//     description: "Finished a lesson in record time",
//     icon: Zap,
//   },
//   {
//     name: "Perfect Score",
//     description: "Answered all questions correctly",
//     icon: Award,
//   },
// ];
export default function Compliment({
  img,
  correct,
  incorrect,
}: {
  img: string;
  correct: number;
  incorrect: number;
  // complimentText: string;
  // ComplimentIcon: JSX.IntrinsicElements;
}) {
  const [achievementUnlocked, setAchievementUnlocked] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const [data, setData] = useState<ProgressData[] | null>(null);

  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/public/progress");
        if (!res.ok) {
          console.error("Failed to fetch progress from DB");
          return;
        }
        const fetchedData: ProgressData[] = await res.json();
        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching progress:", error);
      } finally {
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      let totalPercentage = 0;
      let count = 0;

      lessons.forEach((lesson) => {
        const progress = data.find((item) => item.topic === lesson.slug);

        const completedSubtopics = progress?.subtopics?.length ?? 0;
        const totalSubtopics = lesson.topics.length;

        if (totalSubtopics > 0) {
          totalPercentage += (completedSubtopics / totalSubtopics) * 100;
          count++;
        }
      });

      const averageProgress = count > 0 ? totalPercentage / count : 0;
      setOverallProgress(Number(averageProgress.toFixed(2)));

      if (
        status === "authenticated" &&
        session?.user?.id &&
        !achievementUnlocked
      ) {
        if (averageProgress < 33.33) {
          console.log("Beginner: " + overallProgress);
          unlockAchievement("Beginner");
        } else if (averageProgress < 66.67) {
          console.log("Intermediate: " + overallProgress);
          unlockAchievement("Intermediate");
        } else if (averageProgress < 100) {
          console.log("Expert: " + overallProgress);
          unlockAchievement("Expert");
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  async function unlockAchievement(name: string) {
    try {
      const response = await fetch("/api/achievements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ achievementName: name }),
      });
      const result = await response.json();
      if (response.ok && result.status === "new") {
        toast({
          title: "NEW ACHIEVEMENT UNLOCKED!",
          description: toastDescription(
            result.achievement.achievementName,
            result.achievement.achievementDescription,
          ),
          className: toastStyle,
        });
        setAchievementUnlocked(true);
      } else {
        console.log(result.message || result.error);
      }
    } catch (error) {
      console.error("Error unlocking achievement:", error);
    }
  }

  console.log(data);

  const average = (correct / (correct + incorrect)) * 100;

  return (
    <main>
      <Confetti />
      <div className="py-10">
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <Card className="border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    <motion.div
                      initial={{ rotate: -10, scale: 0.5 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      aria-label={
                        "Incredible effort! You're becoming a true HTML expert!"
                      }
                    >
                      <Star className="mr-2 h-8 w-8 text-yellow-400" />
                    </motion.div>
                    Incredible effort! You&apos;re becoming a true HTML expert!
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-1">
                    {/* Left Column - Score Details */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                          <Target className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                          Your Score
                        </h3>
                        <div className="mb-4">
                          <CustomProgress
                            finalValue={average}
                            initialValue={0}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Correct {correct}
                              </p>
                              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100"></p>
                            </div>
                          </div>
                          <div className="flex items-center justify-end gap-2">
                            <XCircle className="h-5 w-5 text-red-500" />
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Incorrect {incorrect}
                              </p>
                              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100"></p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <CustomBadge
                        color={
                          average < 33.33
                            ? "green"
                            : average < 66.66
                              ? "orange"
                              : "red"
                        }
                      >
                        {average < 33.33
                          ? "Beginner"
                          : average < 66.66
                            ? "Intermediate"
                            : "Expert"}
                      </CustomBadge>
                    </div>

                    {/* Right Column - Achievement Level */}
                  </div>
                  {/* <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
                    <div className="grid gap-8 md:grid-cols-2"> */}
                      {/* Left Column - Score Details */}
                      {/* <div className="space-y-6">
                        <div>
                          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                            <Target className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                            Quiz Performance
                          </h3>
                          <div className="mb-6">
                            <Progress
                              value={percentage}
                              className="h-3 rounded-full"
                            />
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                              {percentage.toFixed(0)}% Complete
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                              <div className="flex items-center gap-3">
                                <CheckCircle2 className="h-5 w-5 text-green-500 dark:text-green-400" />
                                <div>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Correct
                                  </p>
                                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {correctAnswers}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                              <div className="flex items-center gap-3">
                                <XCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
                                <div>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Incorrect
                                  </p>
                                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {incorrectAnswers}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div> */}

                      {/* Right Column - Achievement Level */}
                      {/* <div className="flex flex-col items-center justify-center border-t pt-6 md:border-l md:border-t-0 md:pl-6 md:pt-0">
                        <motion.div
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.2, duration: 0.5 }}
                          className="text-center"
                        >
                          <div
                            className={`mb-4 rounded-full ${achievementLevel.bgColor} p-4`}
                          >
                            <GraduationCap
                              className={`h-12 w-12 ${achievementLevel.color}`}
                            />
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {achievementLevel.level}
                          </h3>
                          <Badge variant="secondary" className="mt-3 text-sm">
                            {percentage.toFixed(1)}% Achievement
                          </Badge>
                        </motion.div>
                      </div> */}
                    {/* </div>
                  </div> */}
                  <br />
                  <br />
                  <br />
                  <div className="flex items-center justify-center">
                    <Image
                      unoptimized
                      priority
                      src={img || "/placeholder.svg"}
                      alt="Celebration"
                      width={400}
                      height={300}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <h2 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-200">
                        Your Progress
                      </h2>
                      <p className="text-lg text-gray-700 dark:text-gray-300">
                        You&apos;ve completed the lesson and demonstrated a
                        great understanding of HTML concepts. Your hard work is
                        paying off!
                      </p>
                    </motion.div>
                    {/* <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <h2 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-200">
                        New Achievements
                      </h2>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {achievements.map((achievement, index) => (
                          <motion.div
                            key={achievement.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              duration: 0.5,
                              delay: 0.6 + index * 0.1,
                            }}
                            className="flex items-center space-x-2 rounded-lg bg-gray-100 p-3 dark:bg-gray-700"
                          >
                            <achievement.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                            <div>
                              <p className="font-semibold text-gray-800 dark:text-gray-200">
                                {achievement.name}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {achievement.description}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div> */}

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                    >
                      <h2 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-200">
                        Next Steps
                      </h2>
                      <p className="text-lg text-gray-700 dark:text-gray-300">
                        Ready to take your HTML skills to the next level?
                        Explore more advanced topics and keep building your web
                        development expertise!
                      </p>
                    </motion.div>
                  </div>
                  <motion.div
                    className="mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1 }}
                  >
                    <ContinueLearningButton
                      disabled={status === "loading" ? true : false}
                    />
                  </motion.div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </main>
  );
}
