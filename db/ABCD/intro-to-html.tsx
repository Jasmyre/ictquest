import Browser from "@/components/Browser";
import CodeBlock from "@/components/Code";
import CodeHighlight from "@/components/CodeHighlight";
import { MultipleChoice } from "@/components/MultipleChoice";
import { Practice } from "@/components/Practice";
import { shuffle } from "@/lib/utils";
import { LessonContent } from "../lessons";
import Image from "next/image";

export const introToHTML: LessonContent = {
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
};