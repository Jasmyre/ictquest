"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Award,
  BookOpen,
  Code,
  Heart,
  Smile,
  Star,
  ThumbsUp,
  Trophy,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Confetti from "../../components/Confetti";
import ContinueLearningButton from "../../components/ContinueLearningButton";

const compliments = [
  { text: "Great job! You've mastered the basics of HTML!", icon: Trophy },
  {
    text: "Fantastic work! Your coding skills are improving rapidly!",
    icon: Star,
  },
  { text: "You're on fire! Keep up the excellent progress!", icon: ThumbsUp },
  {
    text: "Incredible effort! You're becoming a true HTML expert!",
    icon: Heart,
  },
  {
    text: "Outstanding performance! You should be proud of yourself!",
    icon: Smile,
  },
];

const image = "https://fonts.gstatic.com/s/e/notoemoji/latest/1f929/512.gif";

const achievements = [
  {
    name: "HTML Novice",
    description: "Completed your first HTML lesson",
    icon: BookOpen,
  },
  {
    name: "Tag Master",
    description: "Successfully used multiple HTML tags",
    icon: Code,
  },
  {
    name: "Quick Learner",
    description: "Finished a lesson in record time",
    icon: Zap,
  },
  {
    name: "Perfect Score",
    description: "Answered all questions correctly",
    icon: Award,
  },
];
export default function Compliment() {
  const compliment =
    compliments[Math.floor(Math.random() * compliments.length)];

  return (
    <main>
      <Confetti />
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-extrabold leading-tight text-gray-900 dark:text-gray-100"
            >
              Congratulations!
            </motion.h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    <motion.div
                      initial={{ rotate: -10, scale: 0.5 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      aria-label={compliment.text}
                    >
                      <compliment.icon className="h-8 w-8 text-yellow-400 mr-2" />
                    </motion.div>
                    {compliment.text}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center items-center">
                    <Image
                      unoptimized
                      priority
                      src={image || "/placeholder.svg"}
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
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                        Your Progress
                      </h2>
                      <p className="text-lg text-gray-700 dark:text-gray-300">
                        You&apos;ve completed the lesson and demonstrated a
                        great understanding of HTML concepts. Your hard work is
                        paying off!
                      </p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                        New Achievements
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {achievements.map((achievement, index) => (
                          <motion.div
                            key={achievement.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              duration: 0.5,
                              delay: 0.6 + index * 0.1,
                            }}
                            className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg"
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
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                    >
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
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
                    <ContinueLearningButton />
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
