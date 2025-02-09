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
    topics: [
      { name: "HTML Introduction", slug: "what-is-html" },
      { name: "HTML Brief Examples", slug: "html-brief-examples" },
    ],
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
                  <CodeBlock
                    language="HTML"
                    code={"<p>This is a paragraph.</p>"}
                    initialCode={["", ""]}
                  />
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
                  <CodeBlock
                    language="HTML"
                    code="<p>This is a paragraph.</p>"
                    initialCode={["", ""]}
                  />
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
                    initialCode: [`<body>\n  `, `\n</body>`],
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
                      initialCode={choices.initialCode}
                      response={{
                        negative: "Incorrect, Please try again!",
                        positive: "Correct, you are a fast learner!",
                      }}
                    />
                  );
                },
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

      "html-brief-examples": {
        title: "HTML Brief Examples",
        contents: [
          // Page 1: Introduction
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 0,
                type: "text",
                label:
                  "Hey there! Welcome to HTML Brief Examples. Today, we're gonna build a simple static webpage step by step using basic HTML elements. We'll add each element one by one so you can see how everything connects.",
              },
            ],
          },
          // Page 2: Final Webpage Preview Overview
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 1,
                type: "text",
                label:
                  "Here's a sneak peek of the final webpage we'll be building. Notice the heading, paragraph, image, link, and a navigation list all together.",
              },
              {
                id: 2,
                type: "element",
                label: (
                  <Browser
                    content={`<body>
  <h1>Welcome to My Website</h1>
  <p>This is my first webpage.</p>
  <img src="/img.png" alt="A beautiful scene" />
  <hr />
  <a href="https://example.com">Visit Example</a>
  <ul>
    <li>Home</li>
    <li>About</li>
    <li>Contact</li>
  </ul>
</body>`}
                    title={"Final Webpage Preview"}

                  />
                ),
              },
            ],
          },
          // Page 3: Add a Heading (h1) – Introduction
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 3,
                type: "text",
                label: (
                  <div>
                    Let&apos;s start by adding a main heading. We will use the{" "}
                    <CodeHighlight>{"<h1>"}</CodeHighlight> tag to display the
                    title. Later, you&apos;ll see your heading appear at the
                    top.
                  </div>
                ),
              },
            ],
          },
          // Page 4: Practice Arranging the Heading
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 4,
                type: "text",
                label: (
                  <div>
                    Arrange the following code to form your heading. The full
                    snippet you’ll arrange is:{" "}
                    <CodeHighlight>
                      {"<h1>Welcome to My Website</h1>"}
                    </CodeHighlight>
                  </div>
                ),
              },
              {
                id: 5,
                type: "element",
                label: ({ setIsFinished }) => {
                  const choices = {
                    options: [
                      { label: "<h1>", priority: 1 },
                      { label: "Welcome to My Website", priority: 2 },
                      { label: "</h1>", priority: 3 },
                    ],
                    answer: "<h1>Welcome to My Website</h1>",
                    initialCode: ["<body>\n  ", "\n</body>"],
                  };
                  const shuffledData = shuffle(choices.options);
                  return (
                    <Practice
                      setIsFinishedAction={setIsFinished}
                      choices={choices}
                      shuffledData={shuffledData}
                    />
                  );
                },
              },
            ],
          },
          // Page 5: Add a Paragraph (p) – Introduction
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 6,
                type: "text",
                label: (
                  <div>
                    Now, add a paragraph below your heading using the{" "}
                    <CodeHighlight>{"<p>"}</CodeHighlight> tag. This paragraph
                    will give a brief introduction.
                  </div>
                ),
              },
            ],
          },
          // Page 6: Practice Arranging the Paragraph
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 7,
                type: "text",
                label: (
                  <div>
                    Arrange this snippet:{" "}
                    <CodeHighlight>
                      {"<p>This is my first webpage.</p>"}
                    </CodeHighlight>
                  </div>
                ),
              },
              {
                id: 8,
                type: "element",
                label: ({ setIsFinished }) => {
                  const choices = {
                    options: [
                      { label: "<p>", priority: 1 },
                      { label: "This is my first webpage.", priority: 2 },
                      { label: "</p>", priority: 3 },
                    ],
                    answer: "<p>This is my first webpage.</p>",
                    initialCode: [
                      "<body>\n  <h1>Welcome to My Website</h1>\n  ",
                      "\n</body>",
                    ],
                  };
                  const shuffledData = shuffle(choices.options);
                  return (
                    <Practice
                      setIsFinishedAction={setIsFinished}
                      choices={choices}
                      shuffledData={shuffledData}
                    />
                  );
                },
              },
            ],
          },
          // Page 7: Add an Image (img) – Introduction
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 9,
                type: "text",
                label: (
                  <div>
                    Next, add an image using the{" "}
                    <CodeHighlight>{"<img>"}</CodeHighlight> tag. Remember, the{" "}
                    <CodeHighlight>src</CodeHighlight> attribute holds the image
                    path and the <CodeHighlight>alt</CodeHighlight> attribute
                    gives a description.
                  </div>
                ),
              },
            ],
          },
          // Page 8: Practice Arranging the Image Tag
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 10,
                type: "text",
                label: (
                  <div>
                    Arrange the following code:{" "}
                    <CodeHighlight>
                      {'<img src="/img.png" alt="A beautiful scene" />'}
                    </CodeHighlight>
                  </div>
                ),
              },
              {
                id: 11,
                type: "element",
                label: ({ setIsFinished }) => {
                  const choices = {
                    options: [
                      { label: `<img src="/img.png"`, priority: 1 },
                      { label: ` alt="A beautiful scene"`, priority: 2 },
                      { label: ` />`, priority: 3 },
                    ],
                    answer: `<img src="/img.png" alt="A beautiful scene" />`,
                    initialCode: [
                      "<body>\n  <h1>Welcome to My Website</h1>\n  <p>This is my first webpage.</p>\n  ",
                      "\n</body>",
                    ],
                  };
                  const shuffledData = shuffle(choices.options);
                  return (
                    <Practice
                      setIsFinishedAction={setIsFinished}
                      choices={choices}
                      shuffledData={shuffledData}
                    />
                  );
                },
              },
            ],
          },
          // Page 9: Add a Link (a) – Introduction
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 12,
                type: "text",
                label: (
                  <div>
                    Now, add a link using the{" "}
                    <CodeHighlight>{"<a>"}</CodeHighlight> tag. Use the{" "}
                    <CodeHighlight>href</CodeHighlight> attribute to specify the
                    URL and have the link text say{" "}
                    <CodeHighlight>{"Visit Example"}</CodeHighlight>.
                  </div>
                ),
              },
            ],
          },
          // Page 10: Practice Arranging the Link Tag
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 13,
                type: "text",
                label: (
                  <div>
                    Arrange this snippet:{" "}
                    <CodeHighlight>
                      {'<a href="https://example.com">Visit Example</a>'}
                    </CodeHighlight>
                  </div>
                ),
              },
              {
                id: 14,
                type: "element",
                label: ({ setIsFinished }) => {
                  const choices = {
                    options: [
                      { label: `<a href="https://example.com">`, priority: 1 },
                      { label: "Visit Example", priority: 2 },
                      { label: `</a>`, priority: 3 },
                    ],
                    answer: `<a href="https://example.com">Visit Example</a>`,
                    initialCode: [
                      '<body>\n  <h1>Welcome to My Website</h1>\n  <p>This is my first webpage.</p>\n  <img src="/img.png" alt="A beautiful scene" />\n  ',
                      "\n</body>",
                    ],
                  };
                  const shuffledData = shuffle(choices.options);
                  return (
                    <Practice
                      setIsFinishedAction={setIsFinished}
                      choices={choices}
                      shuffledData={shuffledData}
                    />
                  );
                },
              },
            ],
          },
          // Page 11: Add an Unordered List (ul) – Introduction
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 15,
                type: "text",
                label: (
                  <div>
                    Finally, add a navigation menu using an unordered list. You
                    will use the <CodeHighlight>{"<ul>"}</CodeHighlight> tag to
                    wrap list items, each in a{" "}
                    <CodeHighlight>{"<li>"}</CodeHighlight> tag.
                  </div>
                ),
              },
            ],
          },
          // Page 12: Practice Arranging the Unordered List
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 16,
                type: "text",
                label: (
                  <div>
                    Arrange the following code:{" "}
                    <CodeHighlight>{`<ul>
  <li>Home</li>
  <li>About</li>
  <li>Contact</li>
</ul>`}</CodeHighlight>
                  </div>
                ),
              },
              {
                id: 17,
                type: "element",
                label: ({ setIsFinished }) => {
                  const choices = {
                    options: [
                      { label: `<ul>\n  `, priority: 1 },
                      { label: `<li>Home</li>\n  `, priority: 2 },
                      { label: `<li>About</li>\n  `, priority: 3 },
                      { label: `<li>Contact</li>\n`, priority: 4 },
                      { label: `</ul>`, priority: 5 },
                    ],
                    answer: `<ul>\n  <li>Home</li>\n  <li>About</li>\n  <li>Contact</li>\n</ul>`,
                    initialCode: [
                      '<body>\n  <h1>Welcome to My Website</h1>\n  <p>This is my first webpage.</p>\n  <img src="/img.png" alt="A beautiful scene" />\n  <a href="https://example.com">Visit Example</a>\n  ',
                      "\n</body>",
                    ],
                  };
                  const shuffledData = shuffle(choices.options);
                  return (
                    <div>
                      <p>
                        Arrange the code blocks to form the unordered list (look
                        at <CodeHighlight>{"<ul>...</ul>"}</CodeHighlight> for
                        guidance):
                      </p>
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
          // Page 13: Preview Current Webpage
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 18,
                type: "text",
                label:
                  "Great! So far, your webpage includes a heading, a paragraph, an image, a link, and a navigation list.",
              },
              {
                id: 19,
                type: "element",
                label: (
                  <Browser
                    content={`<body>
  <h1>Welcome to My Website</h1>
  <p>This is my first webpage.</p>
  <img src="/img.png" alt="A beautiful scene" />
  <hr />
  <a href="https://example.com">Visit Example</a>
  <ul>
    <li>Home</li>
    <li>About</li>
    <li>Contact</li>
  </ul>
</body>`}
                    title={"Current Webpage Preview"}
                  />
                ),
              },
            ],
          },
          // Page 14: Introduce Horizontal Rule (<hr>)
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 20,
                type: "text",
                label: (
                  <div>
                    Now, let&apos;s add a horizontal rule using the{" "}
                    <CodeHighlight>&lt;hr&gt;</CodeHighlight> tag. This tag
                    draws a horizontal line to separate sections.
                  </div>
                ),
              },
            ],
          },
          // Page 15: Practice Arranging <hr>
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 21,
                type: "text",
                label: (
                  <div>
                    Arrange the following code to insert a horizontal rule:{" "}
                    <CodeHighlight>&lt;hr&gt;</CodeHighlight>
                  </div>
                ),
              },
              {
                id: 22,
                type: "element",
                label: ({ setIsFinished }) => {
                  const choices = {
                    options: [{ label: "<hr>", priority: 1 }],
                    answer: "<hr>",
                    initialCode: ["<body>\n  ...\n  ", "\n</body>"],
                  };
                  const shuffledData = shuffle(choices.options);
                  return (
                    <Practice
                      setIsFinishedAction={setIsFinished}
                      choices={choices}
                      shuffledData={shuffledData}
                    />
                  );
                },
              },
            ],
          },
          // Page 16: Introduce Line Break (<br>)
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 23,
                type: "text",
                label:
                <div>
                  Next, we can add a line break using the {" "}
                  <CodeHighlight>{"<br>"}</CodeHighlight> {" "}
                  tag to start a new line within the same block.
                </div>
              },
            ],
          },
          // Page 17: Practice Arranging <br>
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 24,
                type: "text",
                label: (
                  <div>
                    Arrange the following to insert a line break:{" "}
                    <CodeHighlight>{"<br>"}</CodeHighlight>
                  </div>
                ),
              },
              {
                id: 25,
                type: "element",
                label: ({ setIsFinished }) => {
                  const choices = {
                    options: [{ label: "<br>", priority: 1 }],
                    answer: "<br>",
                    initialCode: [
                      "<p>First line.</p>\n  ",
                      "\n<p>Second line.</p>",
                    ],
                  };
                  const shuffledData = shuffle(choices.options);
                  return (
                    <Practice
                      setIsFinishedAction={setIsFinished}
                      choices={choices}
                      shuffledData={shuffledData}
                    />
                  );
                },
              },
            ],
          },
          // Page 18: Add a Second Paragraph
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 26,
                type: "text",
                label:
                <div>
                  Now, let&apos;s add another paragraph to give more info. Use the {" "}
                  <CodeHighlight>{"<p>"}</CodeHighlight> {" "}
                  tag again.
                </div>
              },
            ],
          },
          // Page 19: Practice Arranging the Second Paragraph
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 27,
                type: "text",
                label: (
                  <div>
                    Arrange this snippet:{" "}
                    <CodeHighlight>
                      {"<p>This is additional info.</p>"}
                    </CodeHighlight>
                  </div>
                ),
              },
              {
                id: 28,
                type: "element",
                label: ({ setIsFinished }) => {
                  const choices = {
                    options: [
                      { label: "<p>", priority: 1 },
                      { label: "This is additional info.", priority: 2 },
                      { label: "</p>", priority: 3 },
                    ],
                    answer: "<p>This is additional info.</p>",
                    initialCode: ["<body>\n  ...\n  ", "\n</body>"],
                  };
                  const shuffledData = shuffle(choices.options);
                  return (
                    <Practice
                      setIsFinishedAction={setIsFinished}
                      choices={choices}
                      shuffledData={shuffledData}
                    />
                  );
                },
              },
            ],
          },
          // Page 20: Add a Subheading (h2)
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 29,
                type: "text",
                label:
                <div>
                  Let&apos;s now add a subheading to introduce a new section using the {" "}
                  <CodeHighlight>{"<h2>"}</CodeHighlight> {" "} 
                  tag.
                </div>
              },
            ],
          },
          // Page 21: Practice Arranging the Subheading
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 30,
                type: "text",
                label: (
                  <div>
                    Arrange this snippet:{" "}
                    <CodeHighlight>{"<h2>About Us</h2>"}</CodeHighlight>
                  </div>
                ),
              },
              {
                id: 31,
                type: "element",
                label: ({ setIsFinished }) => {
                  const choices = {
                    options: [
                      { label: "<h2>", priority: 1 },
                      { label: "About Us", priority: 2 },
                      { label: "</h2>", priority: 3 },
                    ],
                    answer: "<h2>About Us</h2>",
                    initialCode: ["<body>\n  ...\n  ", "\n</body>"],
                  };
                  const shuffledData = shuffle(choices.options);
                  return (
                    <Practice
                      setIsFinishedAction={setIsFinished}
                      choices={choices}
                      shuffledData={shuffledData}
                    />
                  );
                },
              },
            ],
          },
          // Page 22: Introduce Bold Text (<strong>)
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 32,
                type: "text",
                label:
                <div>
                  Sometimes you want to emphasize text. Use the {" "}
                  <CodeHighlight>{"<strong>"}</CodeHighlight> {" "}
                  tag to make text bold.
                </div>
              },
            ],
          },
          // Page 23: Practice Arranging Bold Text
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 33,
                type: "text",
                label: (
                  <div>
                    Arrange this snippet:{" "}
                    <CodeHighlight>
                      {"<strong>Important</strong>"}
                    </CodeHighlight>
                  </div>
                ),
              },
              {
                id: 34,
                type: "element",
                label: ({ setIsFinished }) => {
                  const choices = {
                    options: [
                      { label: "<strong>", priority: 1 },
                      { label: "Important", priority: 2 },
                      { label: "</strong>", priority: 3 },
                    ],
                    answer: "<strong>Important</strong>",
                    initialCode: ["<body>\n  ...\n  ", "\n</body>"],
                  };
                  const shuffledData = shuffle(choices.options);
                  return (
                    <Practice
                      setIsFinishedAction={setIsFinished}
                      choices={choices}
                      shuffledData={shuffledData}
                    />
                  );
                },
              },
            ],
          },
          // Page 24: Introduce Italic Text (<em>)
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 35,
                type: "text",
                label:
                <div>
                  To italicize text, use the {" "}
                  <CodeHighlight>{"<em>"}</CodeHighlight> {" "}
                  tag.
                </div>
              },
            ],
          },
          // Page 25: Practice Arranging Italic Text
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 36,
                type: "text",
                label: (
                  <div>
                    Arrange this snippet:{" "}
                    <CodeHighlight>{"<em>Note</em>"}</CodeHighlight>
                  </div>
                ),
              },
              {
                id: 37,
                type: "element",
                label: ({ setIsFinished }) => {
                  const choices = {
                    options: [
                      { label: "<em>", priority: 1 },
                      { label: "Note", priority: 2 },
                      { label: "</em>", priority: 3 },
                    ],
                    answer: "<em>Note</em>",
                    initialCode: ["<body>\n  ...\n  ", "\n</body>"],
                  };
                  const shuffledData = shuffle(choices.options);
                  return (
                    <Practice
                      setIsFinishedAction={setIsFinished}
                      choices={choices}
                      shuffledData={shuffledData}
                    />
                  );
                },
              },
            ],
          },
          // Page 26: Introduce a Blockquote (<blockquote>)
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 38,
                type: "text",
                label:
                <div>
                  For quotes or excerpts, use the {" "}
                  <CodeHighlight>{"<blockquote>"}</CodeHighlight> {" "}
                  tag to indent the text.
                </div>
              },
            ],
          },
          // Page 27: Practice Arranging Blockquote
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 39,
                type: "text",
                label: (
                  <div>
                    Arrange this snippet:{" "}
                    <CodeHighlight>
                      {"<blockquote>This is a quote.</blockquote>"}
                    </CodeHighlight>
                  </div>
                ),
              },
              {
                id: 40,
                type: "element",
                label: ({ setIsFinished }) => {
                  const choices = {
                    options: [
                      { label: "<blockquote>", priority: 1 },
                      { label: "This is a quote.", priority: 2 },
                      { label: "</blockquote>", priority: 3 },
                    ],
                    answer: "<blockquote>This is a quote.</blockquote>",
                    initialCode: ["<body>\n  ...\n  ", "\n</body>"],
                  };
                  const shuffledData = shuffle(choices.options);
                  return (
                    <Practice
                      setIsFinishedAction={setIsFinished}
                      choices={choices}
                      shuffledData={shuffledData}
                    />
                  );
                },
              },
            ],
          },
          // Page 28: Introduce Inline Code (<code>)
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 41,
                type: "text",
                label:
                <div>
                  When you want to show a snippet of code inline, use the {" "}
                  <CodeHighlight>{"<code>"}</CodeHighlight> {" "}
                  tag.
                </div>
              },
            ],
          },
          // Page 29: Practice Arranging Inline Code
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 42,
                type: "text",
                label: (
                  <div>
                    Arrange this snippet:{" "}
                    <CodeHighlight>
                      {"<code>console.log('Hello');</code>"}
                    </CodeHighlight>
                  </div>
                ),
              },
              {
                id: 43,
                type: "element",
                label: ({ setIsFinished }) => {
                  const choices = {
                    options: [
                      { label: "<code>", priority: 1 },
                      { label: "console.log('Hello');", priority: 2 },
                      { label: "</code>", priority: 3 },
                    ],
                    answer: "<code>console.log('Hello');</code>",
                    initialCode: ["<body>\n  ...\n  ", "\n</body>"],
                  };
                  const shuffledData = shuffle(choices.options);
                  return (
                    <Practice
                      setIsFinishedAction={setIsFinished}
                      choices={choices}
                      shuffledData={shuffledData}
                    />
                  );
                },
              },
            ],
          },
          // Page 30: Introduce Preformatted Text (<pre>)
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 44,
                type: "text",
                label:
                <div>
                  For blocks of code or preformatted text, use the {" "}
                  <CodeHighlight>{"<pre>"}</CodeHighlight> {" "}
                  tag.
                </div>
              },
            ],
          },
          // Page 31: Practice Arranging Preformatted Text
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 45,
                type: "text",
                label: (
                  <div>
                    Arrange this snippet:{" "}
                    <CodeHighlight>
                      {"<pre>\n  Code here\n</pre>"}
                    </CodeHighlight>
                  </div>
                ),
              },
              {
                id: 46,
                type: "element",
                label: ({ setIsFinished }) => {
                  const choices = {
                    options: [
                      { label: "<pre>\n  ", priority: 1 },
                      { label: "Code here", priority: 2 },
                      { label: "\n</pre>", priority: 3 },
                    ],
                    answer: "<pre>\n  Code here\n</pre>",
                    initialCode: ["<body>\n  ...\n  ", "\n</body>"],
                  };
                  const shuffledData = shuffle(choices.options);
                  return (
                    <Practice
                      setIsFinishedAction={setIsFinished}
                      choices={choices}
                      shuffledData={shuffledData}
                    />
                  );
                },
              },
            ],
          },
          // Page 32: Introduce a Container (<div>)
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 47,
                type: "text",
                label:
                  "To group sections of your webpage, use a <div> element. It acts as a container.",
              },
            ],
          },
          // Page 33: Practice Arranging a <div>
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 48,
                type: "text",
                label: (
                  <div>
                    Arrange this snippet:{" "}
                    <CodeHighlight>{"<div>Content here</div>"}</CodeHighlight>
                  </div>
                ),
              },
              {
                id: 49,
                type: "element",
                label: ({ setIsFinished }) => {
                  const choices = {
                    options: [
                      { label: "<div>", priority: 1 },
                      { label: "Content here", priority: 2 },
                      { label: "</div>", priority: 3 },
                    ],
                    answer: "<div>Content here</div>",
                    initialCode: ["<body>\n  ...\n  ", "\n</body>"],
                  };
                  const shuffledData = shuffle(choices.options);
                  return (
                    <Practice
                      setIsFinishedAction={setIsFinished}
                      choices={choices}
                      shuffledData={shuffledData}
                    />
                  );
                },
              },
            ],
          },
          // Page 34: Introduce Inline Container (<span>)
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 50,
                type: "text",
                label:
                <div>
                  For styling or grouping inline elements, use the {" "}
                  <CodeHighlight>{"<span>"}</CodeHighlight> {" "}
                  tag.
                </div>
              },
            ],
          },
          // Page 35: Practice Arranging a <span>
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 51,
                type: "text",
                label: (
                  <div>
                    Arrange this snippet:{" "}
                    <CodeHighlight>{"<span>Inline text</span>"}</CodeHighlight>
                  </div>
                ),
              },
              {
                id: 52,
                type: "element",
                label: ({ setIsFinished }) => {
                  const choices = {
                    options: [
                      { label: "<span>", priority: 1 },
                      { label: "Inline text", priority: 2 },
                      { label: "</span>", priority: 3 },
                    ],
                    answer: "<span>Inline text</span>",
                    initialCode: ["<body>\n  ...\n  ", "\n</body>"],
                  };
                  const shuffledData = shuffle(choices.options);
                  return (
                    <Practice
                      setIsFinishedAction={setIsFinished}
                      choices={choices}
                      shuffledData={shuffledData}
                    />
                  );
                },
              },
            ],
          },
          // Page 36: Introduce a Footer (<footer>)
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 53,
                type: "text",
                label:
                <div>
                  Finally, add a footer at the bottom of your page using the {" "}
                  <CodeHighlight>{"<footer>"}</CodeHighlight> {" "}
                  tag.
                </div>
              },
            ],
          },
          // Page 37: Practice Arranging a <footer>
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 54,
                type: "text",
                label: (
                  <div>
                    Arrange this snippet:{" "}
                    <CodeHighlight>
                      {"<footer>© 2025 My Website</footer>"}
                    </CodeHighlight>
                  </div>
                ),
              },
              {
                id: 55,
                type: "element",
                label: ({ setIsFinished }) => {
                  const choices = {
                    options: [
                      { label: "<footer>", priority: 1 },
                      { label: "© 2025 My Website", priority: 2 },
                      { label: "</footer>", priority: 3 },
                    ],
                    answer: "<footer>© 2025 My Website</footer>",
                    initialCode: ["<body>\n  ...\n  ", "\n</body>"],
                  };
                  const shuffledData = shuffle(choices.options);
                  return (
                    <Practice
                      setIsFinishedAction={setIsFinished}
                      choices={choices}
                      shuffledData={shuffledData}
                    />
                  );
                },
              },
            ],
          },
          // Page 38: Recap - Show Assembled Webpage So Far
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 56,
                type: "text",
                label:
                  "Awesome! Here is your webpage with all the elements you’ve added so far:",
              },
              {
                id: 57,
                type: "element",
                label: (
                  <Browser
                    content={`<body>
  <h1>Welcome to My Website</h1>
  <p>This is my first webpage.</p>
  <img src="/img.png" alt="A beautiful scene" />
  <hr />
  <a href="https://example.com">Visit Example</a>
  <ul>
    <li>Home</li>
    <li>About</li>
    <li>Contact</li>
  </ul>
  <hr>
  <br>
  <p>This is additional info.</p>
  <h2>About Us</h2>
  <strong>Important</strong>
  <em>Note</em>
  <blockquote>This is a quote.</blockquote>
  <code>console.log('Hello');</code>
  <pre>
    Code here
  </pre>
  <div>Content here</div>
  <span>Inline text</span>
  <footer>© 2025 My Website</footer>
</body>`}
                    title={"Assembled Webpage Preview"}
                  />
                ),
              },
            ],
          },
          // Page 39: Quiz - Horizontal Rule
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 58,
                type: "text",
                label:
                  "Quiz Time! Which tag creates a horizontal line on a webpage?",
              },
              {
                id: 59,
                type: "element",
                label: ({ setIsFinished }) => (
                  <MultipleChoice
                    setIsFinishedAction={setIsFinished}
                    title={["Choose the correct tag:"]}
                    choices={{
                      options: ["<hr>", "<br>", "<div>", "<footer>"],
                      answer: "<hr>",
                    }}
                    response={{
                      positive: "Correct! <hr> draws a horizontal line.",
                      negative: "Oops, try again!",
                    }}
                  />
                ),
              },
            ],
          },
          // Page 40: Quiz - Line Break
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 60,
                type: "text",
                label: "Quick Quiz: Which tag is used to insert a line break?",
              },
              {
                id: 61,
                type: "element",
                label: ({ setIsFinished }) => (
                  <MultipleChoice
                    setIsFinishedAction={setIsFinished}
                    title={["Select the correct tag:"]}
                    choices={{
                      options: ["<br>", "<hr>", "<p>", "<span>"],
                      answer: "<br>",
                    }}
                    response={{
                      positive: "That's right! <br> adds a line break.",
                      negative: "Not quite, try again.",
                    }}
                  />
                ),
              },
            ],
          },
          // Page 41: Quiz - Bold Text
          {
            submit: { label: "Continue" },
            content: [
              {
                id: 62,
                type: "text",
                label: "One more quick quiz: Which tag makes text bold?",
              },
              {
                id: 63,
                type: "element",
                label: ({ setIsFinished }) => (
                  <MultipleChoice
                    setIsFinishedAction={setIsFinished}
                    title={["Choose the correct tag:"]}
                    choices={{
                      options: ["<strong>", "<em>", "<h1>", "<p>"],
                      answer: "<strong>",
                    }}
                    response={{
                      positive: "Correct! <strong> bolds the text.",
                      negative: "Nope, that's not it.",
                    }}
                  />
                ),
              },
            ],
          },
          // Page 42: Final Recap and Encouragement
          {
            submit: { label: "Finish" },
            content: [
              {
                id: 64,
                type: "text",
                label:
                  "Fantastic! You've built a simple static webpage step by step and learned how each basic HTML element works.",
              },
              {
                id: 65,
                type: "text",
                label:
                  "Keep practicing, and soon you'll be able to build more complex websites on your own. Great job and happy coding!",
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
                  <CodeBlock
                    language="HTML"
                    initialCode={["", ""]}
                    code="<p>This is a paragraph.</p>"
                  />
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
                  <CodeBlock
                    language="HTML"
                    initialCode={["", ""]}
                    code="<p>This is a paragraph.</p>"
                  />
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
                  <CodeBlock
                    language="HTML"
                    code="<p>This is a paragraph.</p>"
                    initialCode={["", ""]}
                  />
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
                    <CodeBlock
                      language="HTML"
                      code="<!DOCTYPE html>"
                      initialCode={["", ""]}
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
                      <CodeBlock
                        language="HTML"
                        code="<title>My Website</title>"
                        initialCode={["", ""]}
                      />
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
                      <CodeBlock
                        initialCode={["", ""]}
                        language="HTML"
                        code="<p>This is a paragraph.</p>"
                      />
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
                      <CodeBlock
                        initialCode={["", ""]}
                        language="HTML"
                        code="<img src='/img.png' alt='A description' />"
                      />
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
