import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Book } from "lucide-react";
import Link from "next/link";
import BackButton from "../../../components/BackButton";

const topics = {
  "html-basics": {
    title: "HTML Basics",
    description: "Learn the fundamentals of HTML",
    subtopics: [
      { name: "Introduction to HTML", slug: "intro-to-html" },
      { name: "HTML Document Structure", slug: "html-structure" },
      { name: "Text Formatting", slug: "text-formatting" },
    ],
  },
  "html-elements": {
    title: "HTML Elements",
    description: "Explore common HTML elements",
    subtopics: [
      { name: "Links and Anchors", slug: "links-and-anchors" },
      { name: "Images and Multimedia", slug: "images-and-multimedia" },
      { name: "Lists and Tables", slug: "lists-and-tables" },
    ],
  },
  "html-forms": {
    title: "HTML Forms",
    description: "Master creating interactive forms",
    subtopics: [
      { name: "Form Basics", slug: "form-basics" },
      { name: "Input Types", slug: "input-types" },
      { name: "Form Validation", slug: "form-validation" },
    ],
  },
  "html5-features": {
    title: "HTML5 Features",
    description: "Discover new HTML5 elements and APIs",
    subtopics: [
      { name: "Semantic Elements", slug: "semantic-elements" },
      { name: "Audio and Video", slug: "audio-and-video" },
      { name: "Canvas and SVG", slug: "canvas-and-svg" },
    ],
  },
};

export default async function TopicPage({
  params,
}: Readonly<{ params: Promise<{ topic: string }> }>) {
  const paramsTopic = (await params).topic;
  const topic = topics[(await params).topic as keyof typeof topics];

  if (!topic) {
    return <div>Topic not found</div>;
  }

  return (
    <main>
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-gray-100">
              {topic.title}
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
              {topic.description}
            </p>
          </div>
        </header>
        <main className="min-h-[65vh]">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    Subtopics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {topic.subtopics.map((subtopic, index) => (
                      <li
                        key={index++}
                        className="py-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <Book className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                              {subtopic.name}
                            </p>
                          </div>
                          <div>
                            <Link
                              href={`/lessons/${paramsTopic}/${subtopic.slug}`}
                            >
                              <Button
                                size="sm"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-700 dark:hover:bg-indigo-600"
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
