"use client";

import CodeBlock from "@/components/Code";
import { CustomProgress } from "@/components/CustomProgress";
import LessonCard from "@/components/LessonCard";
import { Button } from "@/components/ui/button";
import { shuffle } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import CodeHighlight from "./CodeHighlight";
import { MultipleChoice } from "./MultipleChoice";
import { Practice } from "./Practice";
import Browser from "./Browser";
import Image from "next/image";

export type Choices = {
  options: {
    label: string;
    priority: number;
  }[];
  answer: string;
};

export type ShuffledData = {
  label: string;
  priority: number;
}[];

interface LessonContentProps {
  [topic: string]: {
    [subtopic: string]: {
      title: string;
      contents: {
        submit: {
          label: string;
        };
        content: {
          type: string;
          label:
            | React.ReactNode
            | (({
                setIsFinished,
              }: {
                setIsFinished: (value: boolean) => void;
              }) => React.ReactNode);
          id: number;
        }[];
      }[];
    };
  };
}

const lessonContent: LessonContentProps = {
  "html-basics": {
    "intro-to-html": {
      title: "Introduction to HTML",
      contents: [
        {
          submit: {
            label: "Continue",
          },
          content: [
            {
              id: 0,
              type: "text",
              label:
                "Welcome to the Introduction to HTML! Let's start with the basics.",
            },
            {
              id: 1,
              type: "element",
              label: (
                <div>
                  <p>
                    HTML stands for HyperText Markup Language. It&apos;s the
                    standard markup language for creating web pages.
                  </p>
                  <Image
                    src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f916/512.gif"
                    alt="HTML Structure"
                    width={400}
                    height={300}
                    className="mt-4 rounded-lg shadow-md"
                  />
                </div>
              ),
            },
          ],
        },
        {
          submit: {
            label: "Continue",
          },
          content: [
            {
              id: 2,
              type: "text",
              label:
                "HTML uses tags to define elements. Let's look at a simple example:",
            },
            {
              id: 3,
              type: "element",
              label: (
                <CodeBlock language="html">
                  {"<p>This is a paragraph.</p>"}
                </CodeBlock>
              ),
            },
            {
              id: 4,
              type: "element",
              label: (
                <p>
                  In this example, <CodeHighlight>&lt;p&gt;</CodeHighlight> is
                  the opening tag, and <CodeHighlight>&lt;/p&gt;</CodeHighlight>{" "}
                  is the closing tag. The content is between these tags.
                </p>
              ),
            },
          ],
        },
        {
          submit: {
            label: "Continue",
          },
          content: [
            {
              id: 2,
              type: "text",
              label:
                "HTML uses tags to define elements. Let's look at a simple example:",
            },
            {
              id: 3,
              type: "element",
              label: (
                <CodeBlock language="HTML">
                  {"<p>This is a paragraph.</p>"}
                </CodeBlock>
              ),
            },
            {
              id: 4,
              type: "element",
              label: (
                <p>
                  In this example, <CodeHighlight>&lt;p&gt;</CodeHighlight> is
                  the opening tag, and <CodeHighlight>&lt;/p&gt;</CodeHighlight>{" "}
                  is the closing tag. The content is between these tags.
                </p>
              ),
            },
            {
              id: 5,
              type: "element",
              label: (
                <Browser
                  content={"<p>This is a paragraph.</p>"}
                  title={"Browser"}
                />
              ),
            },
          ],
        },
        {
          submit: {
            label: "Continue",
          },
          content: [
            {
              id: 5,
              type: "text",
              label:
                "Now, let's try creating a button using HTML. Can you put the pieces in the correct order?",
            },
            {
              id: 6,
              type: "element",
              label: ({ setIsFinished }) => {
                const choices = {
                  options: [
                    { label: "<button>", priority: 1 },
                    { label: "Click me!", priority: 2 },
                    { label: "</button>", priority: 3 },
                  ],
                  answer: "<button>Click me!</button>",
                };

                const shuffledData = shuffle(choices.options);

                return (
                  <Practice
                    setIsFinished={setIsFinished}
                    choices={choices}
                    shuffledData={shuffledData}
                  />
                );
              },
            },
          ],
        },

        {
          submit: {
            label: "Continue",
          },
          content: [
            {
              id: 7,
              type: "element",
              label: ({ setIsFinished }) => {
                const choices = {
                  options: ["p", "html", "h1", "element"],
                  answer: "h1",
                };

                return (
                  <MultipleChoice
                    setIsFinished={setIsFinished}
                    choices={choices}
                  />
                );
              },
            },
          ],
        },
      ],
    },
    "html-document-structure": {
      title: "HTML Document Structure",
      contents: [
        {
          submit: { label: "Continue" },
          content: [
            {
              id: 0,
              type: "text",
              label:
                "Welcome to the Introduction to HTML! Let's get started with the basics.",
            },
            {
              id: 1,
              type: "element",
              label: (
                <div>
                  <p>
                    HTML is the backbone of any website. In this lesson,
                    you&apos;ll learn what HTML is and why it&apos;s important.
                  </p>
                </div>
              ),
            },
          ],
        },
        {
          submit: { label: "Continue" },
          content: [
            {
              id: 2,
              type: "text",
              label:
                "HTML stands for HyperText Markup Language. It’s used to structure webpages.",
            },
            {
              id: 3,
              type: "element",
              label: (
                <CodeBlock language="HTML">{`<p>This is a paragraph.</p>`}</CodeBlock>
              ),
            },
          ],
        },
        {
          submit: { label: "Continue" },
          content: [
            {
              id: 4,
              type: "text",
              label:
                "Let's take a quick look at the history of HTML and how it got so popular.",
            },
            {
              id: 5,
              type: "element",
              label: (
                <div>
                  <p>
                    HTML was first created in the early 1990s by Tim
                    Berners-Lee.
                  </p>
                </div>
              ),
            },
          ],
        },
        {
          submit: { label: "Continue" },
          content: [
            {
              id: 6,
              type: "text",
              label: "Every HTML document starts with a doctype declaration.",
            },
            {
              id: 7,
              type: "element",
              label: (
                <div>
                  <div>
                    The doctype declaration tells the browser which version of
                    HTML you&apos;re using.
                  </div>
                  <CodeBlock language="HTML">{`<!DOCTYPE html>`}</CodeBlock>
                </div>
              ),
            },
          ],
        },
        {
          submit: { label: "Continue" },
          content: [
            {
              id: 8,
              type: "text",
              label:
                "The <html> tag is the container for the whole HTML document.",
            },
            {
              id: 9,
              type: "element",
              label: (
                <div>
                  <div>
                    Everything in your HTML page goes inside the{" "}
                    <CodeHighlight>{"<html>"}</CodeHighlight> tag.
                  </div>
                </div>
              ),
            },
          ],
        },
        {
          submit: { label: "Continue" },
          content: [
            {
              id: 10,
              type: "text",
              label:
                "Inside the <html> tag, you got two main parts: the head and the body.",
            },
            {
              id: 11,
              type: "element",
              label: (
                <div>
                  <div>
                    The <CodeHighlight>{"<head>"}</CodeHighlight> holds meta
                    data and the <CodeHighlight>{"<body>"}</CodeHighlight> holds
                    the visible content.
                  </div>
                </div>
              ),
            },
          ],
        },
        {
          submit: { label: "Continue" },
          content: [
            {
              id: 12,
              type: "text",
              label:
                "The <head> section is where you include meta tags, links to stylesheets, and the title.",
            },
            {
              id: 13,
              type: "element",
              label: (
                <div>
                  <div>
                    Note: The content inside the{" "}
                    <CodeHighlight>{"<head>"}</CodeHighlight> tag is not
                    displayed on the webpage.
                  </div>
                </div>
              ),
            },
          ],
        },
        {
          submit: { label: "Continue" },
          content: [
            {
              id: 14,
              type: "text",
              label:
                "The <title> tag sets the title of your webpage, which appears in the browser tab.",
            },
            {
              id: 15,
              type: "element",
              label: (
                <div>
                  <div>
                    Example:{" "}
                    <CodeBlock language="HTML">{`<title>My Website</title>`}</CodeBlock>
                  </div>
                </div>
              ),
            },
          ],
        },
        {
          submit: { label: "Continue" },
          content: [
            {
              id: 16,
              type: "text",
              label:
                "Now, the <body> tag is where all the content that shows on your webpage lives.",
            },
            {
              id: 17,
              type: "element",
              label: (
                <div>
                  <div>
                    Everything like text, images, and links go inside the{" "}
                    <CodeHighlight>{"<body>"}</CodeHighlight> tag.
                  </div>
                </div>
              ),
            },
          ],
        },
        {
          submit: { label: "Continue" },
          content: [
            {
              id: 18,
              type: "text",
              label:
                "HTML provides 6 levels of headings from <h1> to <h6>. <h1> is the most important.",
            },
            {
              id: 19,
              type: "element",
              label: ({ setIsFinished }) => (
                <MultipleChoice
                  setIsFinished={setIsFinished}
                  choices={{
                    options: ["<h1>", "<h2>", "<h3>", "<h4>"],
                    answer: "<h1>",
                  }}
                />
              ),
            },
          ],
        },
        {
          submit: { label: "Continue" },
          content: [
            {
              id: 20,
              type: "text",
              label: "Paragraphs in HTML are defined using the <p> tag.",
            },
            {
              id: 21,
              type: "element",
              label: (
                <div>
                  <div>
                    Example:{" "}
                    <CodeBlock language="HTML">{`<p>This is a paragraph.</p>`}</CodeBlock>
                  </div>
                </div>
              ),
            },
          ],
        },
        {
          submit: { label: "Continue" },
          content: [
            {
              id: 22,
              type: "text",
              label:
                "The <a> tag is used to create hyperlinks. It uses the href attribute to specify the link.",
            },
            {
              id: 23,
              type: "element",
              label: ({ setIsFinished }) => (
                <div>
                  <p>
                    Try answering: Which attribute tells the browser where a
                    link goes?
                  </p>
                  <MultipleChoice
                    setIsFinished={setIsFinished}
                    choices={{
                      options: ["href", "src", "alt", "title"],
                      answer: "href",
                    }}
                  />
                </div>
              ),
            },
          ],
        },
        {
          submit: { label: "Continue" },
          content: [
            {
              id: 24,
              type: "text",
              label:
                "Images are embedded using the <img> tag. It needs a src for the image path and an alt for description.",
            },
            {
              id: 25,
              type: "element",
              label: (
                <div>
                  <div>
                    Example:{" "}
                    <CodeBlock language="HTML">{`<img src="path/to/image.jpg" alt="A description" />`}</CodeBlock>
                  </div>
                </div>
              ),
            },
          ],
        },
        {
          submit: { label: "Continue" },
          content: [
            {
              id: 26,
              type: "text",
              label:
                "HTML supports ordered and unordered lists using <ol> and <ul> tags respectively.",
            },
            {
              id: 27,
              type: "element",
              label: ({ setIsFinished }) => {
                const choices = {
                  options: [
                    { label: "<ul>", priority: 1 },
                    { label: "<li>Item 1</li>", priority: 2 },
                    { label: "<li>Item 2</li>", priority: 3 },
                    { label: "</ul>", priority: 4 },
                  ],
                  answer: "<ul><li>Item 1</li><li>Item 2</li></ul>",
                };

                const shuffledData = shuffle(choices.options);

                return (
                  <div>
                    <div>
                      <p>Arrange the tags to form an unordered list.</p>
                    </div>
                    <br />
                    <Practice
                      setIsFinished={setIsFinished}
                      choices={choices}
                      shuffledData={shuffledData}
                    />
                  </div>
                );
              },
            },
          ],
        },
        {
          submit: { label: "Continue" },
          content: [
            {
              id: 28,
              type: "text",
              label:
                "The <div> and <span> tags are generic containers. <div> is block-level and <span> is inline.",
            },
            {
              id: 29,
              type: "element",
              label: ({ setIsFinished }) => (
                <MultipleChoice
                  setIsFinished={setIsFinished}
                  choices={{
                    options: ["div", "span", "p", "header"],
                    answer: "div",
                  }}
                />
              ),
            },
          ],
        },
        {
          submit: { label: "Continue" },
          content: [
            {
              id: 32,
              type: "text",
              label:
                "Meta tags are placed in the <head> to provide metadata like description and keywords for SEO.",
            },
            {
              id: 33,
              type: "element",
              label: ({ setIsFinished }) => (
                <div>
                  <p>Where do meta tags belong? Choose the correct answer.</p>
                  <MultipleChoice
                    setIsFinished={setIsFinished}
                    choices={{
                      options: ["body", "head", "footer", "section"],
                      answer: "head",
                    }}
                  />
                </div>
              ),
            },
          ],
        },
        {
          submit: { label: "Continue" },
          content: [
            {
              id: 34,
              type: "text",
              label:
                "HTML entities let you display reserved characters. For instance, use &amp;lt; to show a less-than sign.",
            },
            {
              id: 35,
              type: "element",
              label: (
                <div>
                  <p>
                    What entity is used for a greater-than sign? (Answer:
                    &amp;gt;)
                  </p>
                </div>
              ),
            },
          ],
        },
        {
          submit: { label: "Continue" },
          content: [
            {
              id: 36,
              type: "text",
              label:
                "Comments in HTML are written between <!-- and --> and help explain your code.",
            },
            {
              id: 37,
              type: "element",
              label: ({ setIsFinished }) => (
                <div>
                  <p>
                    True or False: HTML comments are displayed on the webpage.
                  </p>
                  <MultipleChoice
                    setIsFinished={setIsFinished}
                    choices={{
                      options: ["True", "False"],
                      answer: "False",
                    }}
                  />
                </div>
              ),
            },
          ],
        },
        {
          submit: { label: "Continue" },
          content: [
            {
              id: 38,
              type: "text",
              label:
                "Lastly, always follow best practices: write clean, semantic, and accessible HTML.",
            },
          ],
        },
      ],
    },
  },
};

export default function LessonPage({
  topic,
  subtopic,
}: Readonly<{ topic: string; subtopic: string }>) {
  const lesson =
    lessonContent[topic.toLowerCase().replace(/ /, "-")]?.[subtopic];
  const [index, setIndex] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(true);
  const router = useRouter();

  const numberOfContent = lesson.contents.length;

  const handleBackButton = () => {
    setIsFinished(true);
    if (index > 0) {
      setIndex((prev) => prev - 1);
      setTimeout(
        () =>
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          }),
        0,
      );
    }
  };

  const handleNextButton = () => {
    console.log(isFinished);

    if (index < numberOfContent - 1) {
      setIndex((prev) => prev + 1);
    } else if (index === numberOfContent - 1 && isFinished) {
      router.push(`/compliments?topic=${topic}`);
    }
    setTimeout(
      () =>
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        }),
      10,
    );
  };

  if (!lesson) {
    return <div>Lesson not found</div>;
  }

  if (index >= numberOfContent) {
    setIndex(numberOfContent - 1);
  }

  const content = lesson.contents[index];
  const singleProgress = 100 / numberOfContent;

  return (
    <div className="py-10">
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-white">
            {lesson.title}
          </h1>
          <CustomProgress
            initialValue={singleProgress * index - singleProgress}
            finalValue={singleProgress * index}
            delay={0}
          />
        </div>
      </header>
      <main className="mt-10">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <LessonCard>
            <div className="flex min-h-[65vh] flex-col justify-between">
              <div className="prose dark:prose-invert max-w-none">
                {content.content.map((item) => (
                  <div key={item.id}>
                    {item.type === "text" &&
                      typeof item.label !== "function" && <div>{item.label}</div>}
                    {item.type === "element" && (
                      <div>
                        {typeof item.label === "function"
                          ? item.label({ setIsFinished: setIsFinished })
                          : item.label}
                      </div>
                    )}
                    <br />
                  </div>
                ))}
              </div>
              <br />
              <div className="mt-6 flex justify-between">
                <Button
                  className="hover:text-900 border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                  variant="outline"
                  onClick={handleBackButton}
                  disabled={index === 0}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={handleNextButton}
                  className="bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"
                  disabled={!isFinished}
                >
                  {content.submit.label}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </LessonCard>
        </div>
      </main>
    </div>
  );
}
