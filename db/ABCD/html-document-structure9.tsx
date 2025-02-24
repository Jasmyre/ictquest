import CodeBlock from "@/components/Code";
import CodeHighlight from "@/components/CodeHighlight";
import { MultipleChoice } from "@/components/MultipleChoice";
import { Practice } from "@/components/Practice";
import { shuffle } from "@/lib/utils";
import { LessonContent } from "../lessons";

export const htmlDocumentStructure9: LessonContent = {
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
                HTML is the backbone of any website. In this lesson, you&apos;ll
                learn what HTML is and why it&apos;s important.
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
                HTML was first created in the early 1990s by Tim Berners-Lee.
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
                The doctype declaration tells the browser which version of HTML
                you&apos;re using.
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
          label: "The <html> tag is the container for the whole HTML document.",
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
                The <CodeHighlight>{"<head>"}</CodeHighlight> holds meta data
                and the <CodeHighlight>{"<body>"}</CodeHighlight> holds the
                visible content.
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
                <CodeHighlight>{"<head>"}</CodeHighlight> tag is not displayed
                on the webpage.
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
              title={["Where do meta tags belong? Choose the correct answer."]}
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
                What entity is used for a greater-than sign? (Answer: &amp;gt;)
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
};