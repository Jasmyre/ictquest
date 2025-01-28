import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Book } from "lucide-react";
import Link from "next/link";

const lessons = [
  {
    title: "HTML Basics",
    description: "Learn the fundamentals of HTML",
    slug: "html-basics",
    topics: [
      { name: "Introduction to HTML", slug: "intro-to-html" },
      { name: "HTML Document Structure", slug: "html-structure" },
      { name: "Text Formatting", slug: "text-formatting" },
    ],
  },
  {
    title: "HTML Elements",
    description: "Explore common HTML elements",
    slug: "html-elements",
    topics: [
      { name: "Links and Anchors", slug: "links-and-anchors" },
      { name: "Images and Multimedia", slug: "images-and-multimedia" },
      { name: "Lists and Tables", slug: "lists-and-tables" },
    ],
  },
  {
    title: "HTML Forms",
    description: "Master creating interactive forms",
    slug: "html-forms",
    topics: [
      { name: "Form Basics", slug: "form-basics" },
      { name: "Input Types", slug: "input-types" },
      { name: "Form Validation", slug: "form-validation" },
    ],
  },
  {
    title: "HTML5 Features",
    description: "Discover new HTML5 elements and APIs",
    slug: "html5-features",
    topics: [
      { name: "Semantic Elements", slug: "semantic-elements" },
      { name: "Audio and Video", slug: "audio-and-video" },
      { name: "Canvas and SVG", slug: "canvas-and-svg" },
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
                              href={`/lessons/subtopic/${topic.slug}?topic=${lesson.title.toLowerCase().replace(/ /, "-")}`}
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
