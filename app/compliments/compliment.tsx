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

const image = [
  "https://fonts.gstatic.com/s/e/notoemoji/latest/1f929/512.gif",
  "https://fonts.gstatic.com/s/e/notoemoji/latest/1f603/512.gif",
  "https://fonts.gstatic.com/s/e/notoemoji/latest/1f600/512.gif",
  "https://fonts.gstatic.com/s/e/notoemoji/latest/1f604/512.gif",
  "https://fonts.gstatic.com/s/e/notoemoji/latest/1f601/512.gif",
  "https://fonts.gstatic.com/s/e/notoemoji/latest/1f642/512.gif",
  "https://fonts.gstatic.com/s/e/notoemoji/latest/1fae1/512.gif",
  "https://fonts.gstatic.com/s/e/notoemoji/latest/1fae3/512.gif",
  "https://fonts.gstatic.com/s/e/notoemoji/latest/1f62f/512.gif",
  "https://fonts.gstatic.com/s/e/notoemoji/latest/1f607/512.gif",
  "https://fonts.gstatic.com/s/e/notoemoji/latest/1f913/512.gif",
  "https://fonts.gstatic.com/s/e/notoemoji/latest/1f60e/512.gif",
  "https://fonts.gstatic.com/s/e/notoemoji/latest/1f978/512.gif",
  "https://fonts.gstatic.com/s/e/notoemoji/latest/1f996/512.gif",
];

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
                      aria-label={compliment.text}
                    >
                      <compliment.icon className="mr-2 h-8 w-8 text-yellow-400" />
                    </motion.div>
                    {compliment.text}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center">
                    <Image
                      unoptimized
                      priority
                      src={
                        image[Math.floor(Math.random() * image.length)] ||
                        "/placeholder.svg"
                      }
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
                    <motion.div
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
                    </motion.div>

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
