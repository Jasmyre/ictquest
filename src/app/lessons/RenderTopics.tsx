"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { lessons } from "@/db/lessons";
import { ArrowRight, Book, CheckCircle, Globe, Trophy } from "lucide-react";
import Link from "next/link";

export default function RenderTopics() {
  return (
    <main>
      <div className="min-h-[80vh] py-10">
        <header>
          <div className="mx-auto max-w-7xl">
            <h1 className="text-3xl leading-tight font-bold text-gray-900 dark:text-gray-100">
              HTML Lessons
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl">
            <div className="py-8">
              <div className="mb-16 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {lessons
                  .filter((lesson) => lesson.slug !== "test")
                  .map((lesson, index) => (
                    <Card
                      key={index++}
                      className={`flex flex-col border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800`}
                    >
                      <CardHeader className="">
                        <CardTitle className="flex items-center text-lg font-semibold text-gray-900 dark:text-gray-100">
                          <Book className="mr-2 h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                          {lesson.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex h-full flex-col justify-between">
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                          {lesson.description}
                        </p>
                        <ul className="mt-4 flex-1 space-y-2">
                          {lesson.topics.map((topic, topicIndex) => (
                            <li key={topicIndex++}>
                              <Link
                                href={`/lessons/subtopic/${topic.slug}?topic=${lesson.slug}&isBackEnabled=true`}
                                className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                              >
                                {topic.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-6">
                          <Link href={`/lessons/${lesson.slug}`}>
                            <Button className="w-full bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600">
                              Start Learning
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>

              <Separator />

              <div className="mt-16">
                <div className="mb-12">
                  <div className="mb-4 flex items-center gap-3">
                    <Globe className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      Test Your Expertise
                    </h2>
                  </div>
                  <p className="max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                    Challenge yourself with our comprehensive assessment
                  </p>
                </div>

                <Card className="border-2 border-indigo-200 bg-white dark:border-indigo-800 dark:bg-gray-800">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg bg-gradient-to-r from-indigo-500 to-blue-600 p-8 dark:from-indigo-900 dark:to-blue-950">
                      <div className="relative z-10">
                        <h3 className="mb-2 text-2xl font-bold text-white">
                          Test
                        </h3>
                        <p className="max-w-2xl text-lg text-indigo-100">
                          Prove your mastery with our comprehensive assessment
                          covering everything from basics to advanced concepts
                        </p>
                      </div>
                      <div className="absolute top-1/2 right-0 -translate-y-1/2 opacity-10">
                        <Trophy className="h-48 w-48" />
                      </div>
                    </div>

                    <div className="p-8">
                      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-1">
                        <div className="flex items-start gap-4 rounded-lg border border-indigo-100 bg-indigo-50 p-4 dark:border-indigo-800 dark:bg-indigo-900/20">
                          <div className="rounded-full bg-indigo-100 p-2 dark:bg-indigo-900">
                            <Trophy className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                              50 Questions
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              Comprehensive assessment
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mb-8">
                        <h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                          Topics Covered
                        </h4>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          {[
                            "What is HTML",
                            "HTML Document Structure",
                            "HTML Typography",
                            "HTML Containers",
                            "HTML Media Elements",
                            "HTML Advanced Elements",
                            "HTML Form",
                            "Beyond HyperText Mark-up Language",
                          ].map((topic, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 rounded-md bg-gray-50 p-2 dark:bg-gray-700/50"
                            >
                              <CheckCircle className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                {topic}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col items-center border-t border-gray-200 pt-6 text-center dark:border-gray-700">
                        <p className="mb-6 max-w-2xl text-gray-600 dark:text-gray-300">
                          Ready to prove your expertise? Take the challenge.
                        </p>
                        <div className="flex gap-4">
                          <Button
                            asChild
                            size="lg"
                            className="bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"
                          >
                            <Link
                              href={`/lessons/subtopic/${"quiz"}?topic=${"test"}`}
                            >
                              Start Test
                              <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </main>
  );
}
