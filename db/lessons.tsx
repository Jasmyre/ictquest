"use client";

import { MultipleChoice } from "@/components/MultipleChoice";
import { Practice } from "@/components/Practice";
import { shuffle } from "@/lib/utils";
import { JSX } from "react";

import Image from "next/image";
import CodeBlock from "@/components/Code";
import CodeHighlight from "@/components/CodeHighlight";
import Browser from "@/components/Browser";

interface Topic {
  name: string;
  slug: string;
}

interface LessonContent {
  title: string;
  contents: Array<{
    submit: { label: string };
    content: Array<{
      id: number;
      type: string;
      label:
        | string
        | JSX.Element
        | ((props: { setIsFinished: (value: boolean) => void }) => JSX.Element);
    }>;
  }>;
}

interface Lesson {
  title: string;
  description: string;
  slug: string;
  topics: Topic[];
  content: Record<string, LessonContent>;
}

export const lessons: Lesson[] = [
  {
    title: "Introduction to HTML",
    description:
      "Introduction to HTML, its History, and HTML Document structure",
    slug: "introduction-to-html",
    topics: [{ name: "What is HTML?", slug: "what-is-html" }],
    content: {
      "what-is-html": {
        title: "What is HTML and Its History",
        contents: [
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 0,
                type: "text",
                label:
                  "Welcome to the world of HTML! Let's start with understanding what HTML is and where it came from.",
              },
              {
                id: 1,
                type: "element",
                label: (
                  <div>
                    <p>
                      HTML stands for <strong>HyperText Markup Language</strong>
                      . It is the standard language used to create web pages.
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
                  "HTML is not a programming language, but a markup language used to structure content on the web.",
              },
              {
                id: 3,
                type: "element",
                label: (
                  <CodeBlock language="HTML">{`<p>This is a paragraph in HTML.</p>`}</CodeBlock>
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
                  "HTML consists of elements wrapped inside tags, defining the structure of a webpage.",
              },
              {
                id: 5,
                type: "element",
                label: (
                  <CodeBlock language="HTML">{`<h1>Welcome to My Website</h1>`}</CodeBlock>
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
                label:
                  "The history of HTML starts in the early 1990s when Tim Berners-Lee created it to share documents via the internet.",
              },
              {
                id: 7,
                type: "element",
                label: (
                  <div>
                    <p>
                      Tim Berners-Lee developed the first version of HTML while
                      working at CERN in 1991.
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
                id: 8,
                type: "text",
                label:
                  "The first official version, HTML 2.0, was released in 1995 with more structured elements.",
              },
              {
                id: 9,
                type: "element",
                label: (
                  <div>
                    <p>
                      Since then, HTML has evolved with new versions like HTML4,
                      XHTML, and now HTML5.
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
                id: 10,
                type: "text",
                label:
                  "HTML5, introduced in 2014, brought new features like semantic elements, multimedia support, and more.",
              },
              {
                id: 11,
                type: "element",
                label: ({ setIsFinished }) => (
                  <MultipleChoice
                    setIsFinishedAction={setIsFinished}
                    
                    choices={{
                      options: ["1991", "1995", "1999", "2014"],
                      answer: "2014",
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
                id: 12,
                type: "text",
                label:
                  "The latest version, HTML5, makes it easier to build modern, interactive websites with better performance.",
              },
              {
                id: 13,
                type: "element",
                label: (
                  <div>
                    <p>Example of an HTML5 feature:</p>
                    <CodeBlock language="HTML">{`<video src="video.mp4" controls></video>`}</CodeBlock>
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
                  "Let's test your knowledge! Arrange the evolution of HTML versions in order.",
              },
              {
                id: 15,
                type: "element",
                label: ({ setIsFinished }) => {
                  const choices = {
                    options: [
                      { label: "HTML 1.0", priority: 1 },
                      { label: "HTML 2.0", priority: 2 },
                      { label: "HTML 4.01", priority: 3 },
                      { label: "XHTML", priority: 4 },
                      { label: "HTML5", priority: 5 },
                    ],
                    answer: "HTML 1.0 → HTML 2.0 → HTML 4.01 → XHTML → HTML5",
                  };

                  const shuffledData = shuffle(choices.options);

                  return (
                    <div>
                      <p>Arrange the HTML versions in chronological order.</p>
                      <Practice
                        setIsFinishedAction={setIsFinished}
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
                id: 16,
                type: "text",
                label:
                  "Now that you know what HTML is and its history, you are ready to explore its core structure!",
              },
            ],
          },
        ],
      },
    },
  },
  {
    title: "ABCD",
    description: "XY and Z",
    slug: "abcd",
    topics: [
      { name: "Introduction To Html", slug: "intro-to-html" },
      { name: "HTML Document Structure", slug: "html-document-structure" },
    ],
    content: {
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
                    the opening tag, and{" "}
                    <CodeHighlight>&lt;/p&gt;</CodeHighlight> is the closing
                    tag. The content is between these tags.
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
                    the opening tag, and{" "}
                    <CodeHighlight>&lt;/p&gt;</CodeHighlight> is the closing
                    tag. The content is between these tags.
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
                      setIsFinishedAction={setIsFinished}
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
                      setIsFinishedAction={setIsFinished}
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
                      you&apos;ll learn what HTML is and why it&apos;s
                      important.
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
                      data and the <CodeHighlight>{"<body>"}</CodeHighlight>{" "}
                      holds the visible content.
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
                    setIsFinishedAction={setIsFinished}
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
                      setIsFinishedAction={setIsFinished}
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
                        setIsFinishedAction={setIsFinished}
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
                    setIsFinishedAction={setIsFinished}
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
                      setIsFinishedAction={setIsFinished}
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
                      setIsFinishedAction={setIsFinished}
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
  },
  {
    title: "HTML Introduction",
    description:
      "Introduction to HTML, its History, and HTML Document Structure.",
    slug: "html-introduction",
    topics: [
      { name: "What is HTML?", slug: "what-is-html" },
      { name: "HTML Document Structure", slug: "html-document-structure" },
      { name: "Text Formatting", slug: "intro-to-html" },
    ],
    content: {
      "what-is-html2": {
        title: "What is HTML?",
        contents: [
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
          // Additional pages for "What is HTML?"...
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
                label: "Every HTML document starts with a doctype declaration.",
              },
            ],
          },
          // Additional pages for "HTML Document Structure"...
        ],
      },
      // Additional content for other topics...
    },
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
    content: {
      "links-and-anchors": {
        title: "Links and Anchors",
        contents: [
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 0,
                type: "text",
                label: "Learn how to create links using the <a> tag.",
              },
            ],
          },
          // Additional pages for "Links and Anchors"...
        ],
      },
      // Additional content for other topics...
    },
  },
  // Additional lessons...
];

export default lessons;
