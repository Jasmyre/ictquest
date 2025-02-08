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
          // Page 1
          {
            submit: { label: "Continue" },
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
                  <Image
                    src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f916/512.gif"
                    alt="HTML Structure"
                    width={400}
                    height={300}
                    className="mt-4 rounded-lg shadow-md"
                  />
                ),
              },
            ],
          },
          // Page 2
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 1,
                type: "text",
                label:
                  "HTML stands for HyperText Markup Language. Sounds fancy, but it’s really just the language that gives structure to web pages.",
              },
              {
                id: 2,
                type: "element",
                label: ({ setIsFinished }) => (
                  <MultipleChoice
                    setIsFinishedAction={setIsFinished}
                    title={["What does HTML stand for?"]}
                    choices={{
                      options: [
                        "HyperText Markup Language",
                        "Home Tool Markup Language",
                        "Hyperlink Text Markup Language",
                        "How To Make Lasagna",
                      ],
                      answer: "HyperText Markup Language",
                    }}
                    response={{
                      positive: "Yup, you got it!",
                      negative: "Nope, give it another shot!",
                    }}
                  />
                ),
              },
            ],
          },
          // Page 3
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 3,
                type: "text",
                label:
                  "HTML is like the skeleton of a webpage. It tells the browser what goes where.",
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
                      response={{ negative: "Incorrect, Please try again!", positive: "Correct, you are a fast learner!" }}
                    />
                  );
                },
              },
            ],
          },
          // Page 4
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 4,
                type: "text",
                label:
                  "Now, let’s jump to the history part. HTML was invented in 1991 by a clever guy named Tim Berners-Lee while he was at CERN.",
              },
              {
                id: 5,
                type: "element",
                label: ({ setIsFinished }) => (
                  <MultipleChoice
                    setIsFinishedAction={setIsFinished}
                    title={["Who invented HTML?"]}
                    choices={{
                      options: [
                        "Bill Gates",
                        "Tim Berners-Lee",
                        "Steve Jobs",
                        "Mark Zuckerberg",
                      ],
                      answer: "Tim Berners-Lee",
                    }}
                    response={{
                      positive: "Exactly right!",
                      negative: "Nah, try again!",
                    }}
                  />
                ),
              },
            ],
          },
          // Page 5
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 6,
                type: "text",
                label:
                  "Back in the early 90s, the internet was just a small, new thing. HTML was created to share documents easily across computers.",
              },
            ],
          },
          // Page 6
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 7,
                type: "text",
                label:
                  "In those days, HTML was very simple – just a few tags to mark up text and links.",
              },
            ],
          },
          // Page 7
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 8,
                type: "text",
                label: "True or False: HTML was invented in the 1980s.",
              },
              {
                id: 9,
                type: "element",
                label: ({ setIsFinished }) => (
                  <MultipleChoice
                    setIsFinishedAction={setIsFinished}
                    title={["Is this statement true or false?"]}
                    choices={{ options: ["True", "False"], answer: "False" }}
                    response={{
                      positive: "Right! It was invented in 1991.",
                      negative: "Not quite. It came out in 1991.",
                    }}
                  />
                ),
              },
            ],
          },
          // Page 8
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 10,
                type: "text",
                label:
                  "Soon after its creation, HTML started to get standardized. The first official version came out in 1991 itself.",
              },
            ],
          },
          // Page 9
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 11,
                type: "text",
                label:
                  "In 1995, HTML 2.0 was standardized. This was a big step in making web pages more consistent across browsers.",
              },
              {
                id: 12,
                type: "element",
                label: ({ setIsFinished }) => (
                  <MultipleChoice
                    setIsFinishedAction={setIsFinished}
                    title={["When was HTML 2.0 standardized?"]}
                    choices={{
                      options: ["1991", "1995", "2000", "2010"],
                      answer: "1995",
                    }}
                    response={{
                      positive: "Correct!",
                      negative: "Oops, that ain't it. Try again!",
                    }}
                  />
                ),
              },
            ],
          },
          // Page 10
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 13,
                type: "text",
                label:
                  "HTML didn’t stop there. Versions like HTML 3.2 and HTML 4.01 followed, each making the language a bit more powerful.",
              },
            ],
          },
          // Page 11
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 14,
                type: "text",
                label:
                  "The mid-90s were an exciting time on the web. Browsers were emerging and HTML became the go-to language for building pages.",
              },
            ],
          },
          // Page 12
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 15,
                type: "text",
                label:
                  "True or False: In the 90s, there were only a few web pages because HTML was super basic.",
              },
              {
                id: 16,
                type: "element",
                label: ({ setIsFinished }) => (
                  <MultipleChoice
                    setIsFinishedAction={setIsFinished}
                    title={["True or False?"]}
                    choices={{ options: ["True", "False"], answer: "True" }}
                    response={{
                      positive: "Yep, it was a simpler time!",
                      negative: "Nope, think again!",
                    }}
                  />
                ),
              },
            ],
          },
          // Page 13
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 17,
                type: "text",
                label:
                  "Then came the browser wars. Companies like Netscape and Internet Explorer pushed each other to support better web standards.",
              },
            ],
          },
          // Page 14
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 18,
                type: "text",
                label:
                  "Organizations like the W3C were formed to help standardize HTML, so all browsers could understand it the same way.",
              },
            ],
          },
          // Page 15
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 19,
                type: "text",
                label:
                  "In the early 2000s, XHTML was introduced – basically HTML with stricter rules. But eventually, HTML made a strong comeback.",
              },
            ],
          },
          // Page 16
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 20,
                type: "text",
                label:
                  "Then, in 2014, HTML5 was born. This version brought a lot of cool new features and made web pages even more interactive.",
              },
            ],
          },
          // Page 17
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 21,
                type: "text",
                label:
                  "HTML5 was a game changer. It allowed browsers to play videos, audio, and do a lot more without extra plugins.",
              },
            ],
          },
          // Page 18
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 22,
                type: "text",
                label:
                  "Let’s check your memory: Which version of HTML brought in modern, semantic elements?",
              },
              {
                id: 23,
                type: "element",
                label: ({ setIsFinished }) => (
                  <MultipleChoice
                    setIsFinishedAction={setIsFinished}
                    title={["Choose the correct version:"]}
                    choices={{
                      options: ["HTML 2.0", "HTML 4.01", "HTML5", "XHTML"],
                      answer: "HTML5",
                    }}
                    response={{
                      positive: "That's it!",
                      negative: "Nope, not that one.",
                    }}
                  />
                ),
              },
            ],
          },
          // Page 19
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 24,
                type: "text",
                label:
                  "HTML has come a long way from being a simple way to mark up text to a full-blown web technology.",
              },
            ],
          },
          // Page 20
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 25,
                type: "text",
                label:
                  "Did you know? HTML’s simplicity helped it spread like wildfire, letting almost anyone create web pages.",
              },
            ],
          },
          // Page 21
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 26,
                type: "text",
                label:
                  "HTML wasn’t just about structure – it paved the way for other web technologies like CSS and JavaScript.",
              },
            ],
          },
          // Page 22
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 27,
                type: "text",
                label: "True or False: HTML is a programming language.",
              },
              {
                id: 28,
                type: "element",
                label: ({ setIsFinished }) => (
                  <MultipleChoice
                    setIsFinishedAction={setIsFinished}
                    title={["Is HTML a programming language?"]}
                    choices={{ options: ["True", "False"], answer: "False" }}
                    response={{
                      positive: "Exactly, it's just a markup language!",
                      negative: "Nope, it's not a programming language.",
                    }}
                  />
                ),
              },
            ],
          },
          // Page 23
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 29,
                type: "text",
                label:
                  "HTML helped democratize the web – suddenly, anyone with a computer could put their ideas online.",
              },
            ],
          },
          // Page 24
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 30,
                type: "text",
                label:
                  "Before HTML, sharing documents over networks was really hard. HTML made it easy-peasy.",
              },
            ],
          },
          // Page 25
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 31,
                type: "text",
                label:
                  "The early web was simple – mostly text and links. HTML gave it a structure that everyone could understand.",
              },
            ],
          },
          // Page 26
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 32,
                type: "text",
                label:
                  "Browsers played a huge role in making HTML popular. They turned plain text into interactive pages.",
              },
            ],
          },
          // Page 27
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 33,
                type: "text",
                label:
                  "The standardization of HTML by groups like the W3C kept it on the right track.",
              },
            ],
          },
          // Page 28
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 34,
                type: "text",
                label:
                  "HTML's evolution is also a story about collaboration – developers all over the world working together to improve the web.",
              },
            ],
          },
          // Page 29
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 35,
                type: "text",
                label:
                  "Quick quiz time: Who is often called the 'father of the World Wide Web'?",
              },
              {
                id: 36,
                type: "element",
                label: ({ setIsFinished }) => (
                  <MultipleChoice
                    setIsFinishedAction={setIsFinished}
                    title={["Who is known as the father of the Web?"]}
                    choices={{
                      options: [
                        "Tim Berners-Lee",
                        "Vint Cerf",
                        "Bill Gates",
                        "Linus Torvalds",
                      ],
                      answer: "Tim Berners-Lee",
                    }}
                    response={{
                      positive: "Right on!",
                      negative: "Nope, that's not it.",
                    }}
                  />
                ),
              },
            ],
          },
          // Page 30
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 37,
                type: "text",
                label:
                  "From simple beginnings to a global standard, HTML has shaped the way we use the internet.",
              },
            ],
          },
          // Page 31
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 38,
                type: "text",
                label:
                  "Every new version of HTML brought improvements that made websites faster and easier to use.",
              },
            ],
          },
          // Page 32
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 39,
                type: "text",
                label:
                  "HTML’s journey is like a timeline – from a simple tool in 1991 to the advanced language we use today.",
              },
            ],
          },
          // Page 33
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 40,
                type: "text",
                label:
                  "It’s amazing how far HTML has come, and it still keeps evolving as the web grows.",
              },
            ],
          },
          // Page 34
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 41,
                type: "text",
                label:
                  "Interactive question: Which organization has been key in standardizing HTML?",
              },
              {
                id: 42,
                type: "element",
                label: ({ setIsFinished }) => (
                  <MultipleChoice
                    setIsFinishedAction={setIsFinished}
                    title={["Pick the right organization:"]}
                    choices={{
                      options: ["W3C", "IEEE", "ISO", "ANSI"],
                      answer: "W3C",
                    }}
                    response={{
                      positive: "That's it!",
                      negative: "Nope, think about web standards.",
                    }}
                  />
                ),
              },
            ],
          },
          // Page 35
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 43,
                type: "text",
                label:
                  "HTML not only shaped the web but also set the stage for future technologies like CSS and JavaScript.",
              },
            ],
          },
          // Page 36
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 44,
                type: "text",
                label: "True or False: HTML is still evolving today.",
              },
              {
                id: 45,
                type: "element",
                label: ({ setIsFinished }) => (
                  <MultipleChoice
                    setIsFinishedAction={setIsFinished}
                    title={["Is HTML still evolving?"]}
                    choices={{ options: ["True", "False"], answer: "True" }}
                    response={{
                      positive: "Absolutely! It's always getting better.",
                      negative: "Not really, HTML keeps improving.",
                    }}
                  />
                ),
              },
            ],
          },
          // Page 37
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 46,
                type: "text",
                label:
                  "The HTML we use today is the result of many years of improvements and collaboration.",
              },
            ],
          },
          // Page 38
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 47,
                type: "text",
                label:
                  "Interactive quiz: What was the main purpose of creating HTML back in the early 90s?",
              },
              {
                id: 48,
                type: "element",
                label: ({ setIsFinished }) => (
                  <MultipleChoice
                    setIsFinishedAction={setIsFinished}
                    title={["What was HTML mainly for?"]}
                    choices={{
                      options: [
                        "To design fancy websites",
                        "To share documents",
                        "To create animations",
                        "To build apps",
                      ],
                      answer: "To share documents",
                    }}
                    response={{
                      positive: "Correct! It was all about sharing info.",
                      negative: "Not quite, try again!",
                    }}
                  />
                ),
              },
            ],
          },
          // Page 39
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 49,
                type: "text",
                label:
                  "HTML changed the world by making it so easy for anyone to publish their ideas online.",
              },
            ],
          },
          // Page 40
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 50,
                type: "text",
                label:
                  "Alright, that's a wrap on our journey through HTML and its history! Hope you had fun and learned a thing or two. Now you're all set to explore more about web development!",
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
                      title={[
                        "Which of the following elements creates the largest heading?",
                      ]}
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
                    title={[
                      "Which of the following elements create the largest heading?`",
                    ]}
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
                  <MultipleChoice
                    title={[
                      "Try answering: Which attribute tells the browser where a link goes?",
                    ]}
                    setIsFinishedAction={setIsFinished}
                    choices={{
                      options: ["href", "src", "alt", "title"],
                      answer: "href",
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
                id: 29,
                type: "element",
                label: ({ setIsFinished }) => (
                  <MultipleChoice
                    title={[
                      "The <div> and <span> tags are generic containers. <div> is block-level and <span> is inline.",
                    ]}
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
                  <MultipleChoice
                    title={[
                      "Where do meta tags belong? Choose the correct answer.",
                    ]}
                    setIsFinishedAction={setIsFinished}
                    choices={{
                      options: ["body", "head", "footer", "section"],
                      answer: "head",
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
                  <MultipleChoice
                    title={[
                      "True or False: HTML comments are displayed on the webpage.",
                    ]}
                    setIsFinishedAction={setIsFinished}
                    choices={{
                      options: ["True", "False"],
                      answer: "False",
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
