import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Book } from "lucide-react";
import Link from "next/link";

const lessons = [
  {
    title: "HTML Basics",
    description: "Learn the fundamentals of HTML",
    slug: "introduction-to-html",
    topics: [
      { name: "What is HTML?", slug: "what-is-html" },
      { name: "HTML Document Structure", slug: "html-document-structure" },
      { name: "Text Formatting", slug: "intro-to-html" },
    ],
  },
  {
    title: "HTML Crap",
    description: "This is nothing",
    slug: "html-craps",
    topics: [
      {name: "Introduction To HTML", slug: "intro-to-html"},
      {name: "HTML Document Structure", slug: "html-document-structure"}
    ]
  },
  {
    title: "HTML Elements",
    description: "Explore common HTML elements",
    slug: "html-basics",
    topics: [
      { name: "Links and Anchors", slug: "intro-to-html" },
      { name: "Images and Multimedia", slug: "intro-to-html" },
      { name: "Lists and Tables", slug: "intro-to-html" },
    ],
  },
  {
    title: "HTML Forms",
    description: "Master creating interactive forms",
    slug: "html-basics",
    topics: [
      { name: "Form Basics", slug: "intro-to-html" },
      { name: "Input Types", slug: "intro-to-html" },
      { name: "Form Validation", slug: "intro-to-html" },
    ],
  },
  {
    title: "HTML5 Features",
    description: "Discover new HTML5 elements and APIs",
    slug: "html-basics",
    topics: [
      { name: "Semantic Elements", slug: "intro-to-html" },
      { name: "Audio and Video", slug: "intro-to-html" },
      { name: "Canvas and SVG", slug: "intro-to-html" },
    ],
  },
];

export default function LessonsPage() {
  return (
    <main>
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-gray-100">
              HTML Lessons
            </h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
                {lessons.map((lesson, index) => (
                  <Card
                    key={index++}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg font-semibold text-gray-900 dark:text-gray-100">
                        <Book className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
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
                          <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-700 dark:hover:bg-indigo-600">
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
