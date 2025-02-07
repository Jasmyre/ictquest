"use client";

import CodeBlock from "@/components/Code";
import { CustomProgress } from "@/components/CustomProgress";
import LessonCard from "@/components/LessonCard";
import { Button } from "@/components/ui/button";
import { shuffle } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import CodeHighlight from "./CodeHighlight";
import { MultipleChoice } from "./MultipleChoice";
import { Practice } from "./Practice";
import Browser from "./Browser";
import Image from "next/image";
import Prism from "prismjs";

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
  "introduction-to-html": {
    "what-is-html": {
      title: "What is HTML?",
      contents: [
        // Page 1: Intro text (non-interactive)
        {
          submit: { label: "Continue" },
          content: [
            {
              id: 0,
              type: "text",
              label:
                "Welcome to the 'What is HTML?' lesson. In this lesson, we will explore what HTML is and how it started.",
            },
          ],
        },
        // Page 2: What is HTML? (interactive multiple choice)
        {
          submit: { label: "Continue" },
          content: [
            {
              id: 1,
              type: "text",
              label:
                "HTML stands for HyperText Markup Language. It is used to structure web pages.",
            },
            {
              id: 2,
              type: "element",
              label: ({ setIsFinished }) => (
                <MultipleChoice
                  setIsFinished={setIsFinished}
                  choices={{
                    options: [
                      "HighText Markup Language",
                      "HyperText Markup Language",
                      "Hyperlinks Markup Language",
                      "Home Tool Markup Language",
                    ],
                    answer: "HyperText Markup Language",
                  }}
                />
              ),
            },
          ],
        },
        // Page 3: Basic tag example (interactive multiple choice)
        {
          submit: { label: "Continue" },
          content: [
            {
              id: 3,
              type: "text",
              label:
                "HTML uses tags to create elements. For example, the paragraph tag is <p>.",
            },
            {
              id: 4,
              type: "element",
              label: ({ setIsFinished }) => (
                <MultipleChoice
                  setIsFinished={setIsFinished}
                  choices={{
                    options: ["<p>", "<div>", "<span>", "<header>"],
                    answer: "<p>",
                  }}
                />
              ),
            },
          ],
        },
        // Page 4: Arrange basic HTML structure (interactive practice)
        {
          submit: { label: "Continue" },
          content: [
            {
              id: 5,
              type: "text",
              label:
                "Arrange the basic HTML document structure in the correct order.",
            },
            {
              id: 6,
              type: "element",
              label: ({ setIsFinished }) => {
                const choices = {
                  options: [
                    { label: "<!DOCTYPE html>", priority: 1 },
                    { label: "<html>", priority: 2 },
                    { label: "<head>", priority: 3 },
                    { label: "<body>", priority: 4 },
                    { label: "</body>", priority: 5 },
                    { label: "</html>", priority: 6 },
                  ],
                  answer: "<!DOCTYPE html><html><head><body></body></html>",
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
        // Page 5: History text (non-interactive)
        {
          submit: { label: "Continue" },
          content: [
            {
              id: 7,
              type: "text",
              label:
                "HTML was first developed by Tim Berners-Lee in 1991 as a simple way to share documents over the Internet.",
            },
          ],
        },
        // Page 6: Who created HTML? (interactive multiple choice)
        {
          submit: { label: "Continue" },
          content: [
            {
              id: 8,
              type: "text",
              label: "Let's test your HTML history knowledge.",
            },
            {
              id: 9,
              type: "element",
              label: ({ setIsFinished }) => (
                <MultipleChoice
                  setIsFinished={setIsFinished}
                  choices={{
                    options: [
                      "Bill Gates",
                      "Tim Berners-Lee",
                      "Steve Jobs",
                      "Mark Zuckerberg",
                    ],
                    answer: "Tim Berners-Lee",
                  }}
                />
              ),
            },
          ],
        },
        // Page 7: More history explanation (non-interactive)
        {
          submit: { label: "Continue" },
          content: [
            {
              id: 10,
              type: "text",
              label:
                "HTML started as a tool to share research documents at CERN and quickly evolved as the web grew.",
            },
          ],
        },
        // Page 8: When was HTML introduced? (interactive multiple choice)
        {
          submit: { label: "Continue" },
          content: [
            {
              id: 11,
              type: "text",
              label: "When was HTML first introduced?",
            },
            {
              id: 12,
              type: "element",
              label: ({ setIsFinished }) => (
                <MultipleChoice
                  setIsFinished={setIsFinished}
                  choices={{
                    options: ["1989", "1991", "1995", "2000"],
                    answer: "1991",
                  }}
                />
              ),
            },
          ],
        },
        // Page 9: Arrange timeline events (interactive practice)
        {
          submit: { label: "Continue" },
          content: [
            {
              id: 13,
              type: "text",
              label:
                "Arrange the following timeline events in the correct order:",
            },
          ],
        },
        // Page 10: Evolution explanation (non-interactive)
        {
          submit: { label: "Continue" },
          content: [
            {
              id: 15,
              type: "text",
              label:
                "HTML has evolved through many versions, adapting to modern web needs.",
            },
          ],
        },
        // Page 11: Semantic elements question (interactive multiple choice)
        {
          submit: { label: "Continue" },
          content: [
            {
              id: 16,
              type: "text",
              label: "Which version of HTML introduced many semantic elements?",
            },
            {
              id: 17,
              type: "element",
              label: ({ setIsFinished }) => (
                <MultipleChoice
                  setIsFinished={setIsFinished}
                  choices={{
                    options: ["HTML4", "HTML5", "XHTML", "HTML 2.0"],
                    answer: "HTML5",
                  }}
                />
              ),
            },
          ],
        },
        // Page 12: Reflection on evolution (non-interactive)
        {
          submit: { label: "Continue" },
          content: [
            {
              id: 18,
              type: "text",
              label:
                "The evolution of HTML mirrors the explosive growth of the web over time.",
            },
          ],
        },
        // Page 13: HTML popularity reason (interactive multiple choice)
        {
          submit: { label: "Continue" },
          content: [
            {
              id: 19,
              type: "text",
              label: "What is one key reason HTML became so popular?",
            },
            {
              id: 20,
              type: "element",
              label: ({ setIsFinished }) => (
                <MultipleChoice
                  setIsFinished={setIsFinished}
                  choices={{
                    options: [
                      "Ease of learning",
                      "Complex syntax",
                      "High cost",
                      "Proprietary standards",
                    ],
                    answer: "Ease of learning",
                  }}
                />
              ),
            },
          ],
        },
        // Page 14: HTML evolved from SGML (non-interactive)
        {
          submit: { label: "Continue" },
          content: [
            {
              id: 21,
              type: "text",
              label:
                "HTML evolved from SGML (Standard Generalized Markup Language), which influenced its design.",
            },
          ],
        },
        // Page 15: True HTML history fact (interactive multiple choice)
        {
          submit: { label: "Continue" },
          content: [
            {
              id: 22,
              type: "text",
              label: "Which statement is true about HTML history?",
            },
            {
              id: 23,
              type: "element",
              label: ({ setIsFinished }) => (
                <MultipleChoice
                  setIsFinished={setIsFinished}
                  choices={{
                    options: [
                      "HTML was created in the 1980s",
                      "HTML evolved from SGML",
                      "HTML is a programming language",
                      "HTML has never changed",
                    ],
                    answer: "HTML evolved from SGML",
                  }}
                />
              ),
            },
          ],
        },
        // Page 16: Final true/false check (interactive multiple choice)
        {
          submit: { label: "Continue" },
          content: [
            {
              id: 24,
              type: "text",
              label: "HTML is the foundation of all web pages.",
            },
            {
              id: 25,
              type: "element",
              label: ({ setIsFinished }) => (
                <MultipleChoice
                  setIsFinished={setIsFinished}
                  choices={{
                    options: ["True", "False"],
                    answer: "True",
                  }}
                />
              ),
            },
          ],
        },
      ],
    },
  },
  "html-craps": {
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
                    title={[
                      "Now, let's try creating a button using HTML. Can you put the pieces in the correct order?",
                    ]}
                    response={{ negative: "Incorrect, Please try again!" }}
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
                    {
                      label: `<ul>
  `,
                      priority: 1,
                    },
                    {
                      label: `<li>Item 1</li>
  `,
                      priority: 2,
                    },
                    {
                      label: `<li>Item 2</li>
`,
                      priority: 3,
                    },
                    { label: "</ul>", priority: 4 },
                  ],
                  answer: `<ul>
  <li>Item 1</li>
  <li>Item 2</li>
</ul>`,
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

  useEffect(() => {
    Prism.highlightAll();
  })

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
                      typeof item.label !== "function" && (
                        <div>{item.label}</div>
                      )}
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
