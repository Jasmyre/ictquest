import Browser from "@/components/Browser";
import CodeBlock from "@/components/Code";
import CodeHighlight from "@/components/CodeHighlight";
import { MultipleChoice } from "@/components/MultipleChoice";
import { Practice } from "@/components/Practice";
import { shuffle } from "@/lib/utils";
import { LessonContent } from "../lessons";

import Image from "next/image";


export const htmlIntroduction: LessonContent = {
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
              In this example, <CodeHighlight>&lt;p&gt;</CodeHighlight> is the
              opening tag, and <CodeHighlight>&lt;/p&gt;</CodeHighlight> is the
              closing tag. The content is between these tags.
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
              In this example, <CodeHighlight>&lt;p&gt;</CodeHighlight> is the
              opening tag, and <CodeHighlight>&lt;/p&gt;</CodeHighlight> is the
              closing tag. The content is between these tags.
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
};
