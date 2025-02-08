"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Book } from "lucide-react";
import { lessons } from "@/db/lessons";

import Link from "next/link";

export default function RenderTopics() {
  return (
    <main>
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-gray-100">
              HTML Lessons
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
                {lessons.map((lesson, index) => (
                  <Card
                    key={index++}
                    className="border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg font-semibold text-gray-900 dark:text-gray-100">
                        <Book className="mr-2 h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        {lesson.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        {lesson.description}
                      </p>
                      <ul className="mt-4 space-y-2">
                        {lesson.topics.map((topic, topicIndex) => (
                          <li key={topicIndex++}>
                            <Link
                              href={`/lessons/subtopic/${topic.slug}?topic=${lesson.slug}`}
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
            </div>
          </div>
        </main>
      </div>
    </main>
  );
}
