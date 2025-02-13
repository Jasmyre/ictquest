"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Book } from "lucide-react";
import { lessons } from "@/db/lessons";

import Link from "next/link";
import BackButton from "../../../components/BackButton";

export default function RenderSubtopics({
  paramsTopic,
  
}: Readonly<{ paramsTopic: string }>) {
  const lesson = lessons.find((item) => item.slug === paramsTopic);

  if (!lesson) {
    return <div>Lesson not found</div>;
  }

  const topic = lesson.topics;

  if (!topic) {
    return <div>Topic not found</div>;
  }

  return (
    <main>
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-gray-100">
              {lesson.title}
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
              {lesson.description}
            </p>
          </div>
        </header>
        <main className="min-h-[65vh]">
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <Card className="border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    Subtopics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {topic.map((subtopic, index) => (
                      <li
                        key={index++}
                        className="border-b border-gray-200 py-4 last:border-b-0 dark:border-gray-700"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <Book className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                              {subtopic.name}
                            </p>
                          </div>
                          <div>
                            <Link
                              href={`/lessons/subtopic/${subtopic.slug}?topic=${lesson.slug}`}
                            >
                              <Button
                                size="sm"
                                className="bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"
                              >
                                Start Lesson
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <div className="mt-6">
                <BackButton>Go Back</BackButton>
              </div>
            </div>
          </div>
        </main>
      </div>
    </main>
  );
}
