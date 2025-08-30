import Browser from "@/components/Browser";
import CodeBlock from "@/components/Code";
import CodeHighlight from "@/components/CodeHighlight";
import { LessonContent } from "../lessons";

export const htmlDocumentStructure: LessonContent = {
  title: "Understanding HTML Document Structure",
  contents: [
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 0,
          type: "text",
          label:
            "Hey there! In this lesson, we're gonna learn the basic structure of an HTML document. Let's dive in!",
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
            "First things first, every HTML document starts with a doctype declaration. It tells the browser that we're using HTML5.",
        },
        {
          id: 2,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code="<!DOCTYPE html>"
              initialCode={["", ""]}
            />
          ),
        },
        {
          id: 3,
          type: "element",
          label: (
            <div>
              <p>
                In this case we will be using{" "}
                <CodeHighlight>&lt;!DOCTYPE html&gt;</CodeHighlight>, which is
                also the latest version of HTML.
              </p>
              <br />
              <p>
                you can write it in uppercase, lowercase, or a mix of both, and
                the browser will still interpret it correctly.
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
          id: 3,
          type: "text",
          label:
            "Next up, we have the <html> tag. This tag wraps the entire document, kinda like the outer shell.",
        },
        {
          id: 4,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<html>
  ... 
</html>`}
              initialCode={["<!DOCTYPE html>\n", ""]}
            />
          ),
        },
      ],
    },
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 5,
          type: "element",
          label: (
            <div>
              Inside the <CodeHighlight>&lt;html&gt;</CodeHighlight> tag, there
              are two main sections: the{" "}
              <CodeHighlight>&lt;head&gt;</CodeHighlight> and the{" "}
              <CodeHighlight>&lt;body&gt;</CodeHighlight>.
            </div>
          ),
        },
        {
          id: 6,
          type: "element",
          label: (
            <div>
              <CodeBlock
                language="HTML"
                code={`  <head>\n    ...\n  </head>\n\n  <body>\n    ...\n  </body>\n`}
                initialCode={["<!DOCTYPE html>\n<html>\n", "<html>"]}
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
          id: 6,
          type: "text",
          label:
            "The <head> section holds all the meta info, like the title of the page, meta tags, and links to CSS files.",
        },
        {
          id: 7,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`    <title>My Page</title>\n    <!-- Other meta info -->\n`}
              initialCode={[
                "<!DOCTYPE html>\n<html>\n  <head>\n",
                "  </head>\n\n  <body>\n    ...\n  </body>\n<html>",
              ]}
            />
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
            "The <body> section is where all the visible stuff goes – texts, images, links, etc.",
        },
        {
          id: 9,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`    <h1>Hello World</h1>\n    <p>This is my page.</p>\n`}
              initialCode={[
                "<!DOCTYPE html>\n<html>\n  <head>\n    <title>My Page</title>\n    <!-- Other meta info -->\n  </head>\n\n  <body>\n",
                "  </body>\n<html>",
              ]}
            />
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
            "The <body> section is where all the visible stuff goes – texts, images, links, etc.",
        },
        {
          id: 9,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`    <h1>Hello World</h1>\n    <p>This is my page.</p>\n`}
              initialCode={[
                "<!DOCTYPE html>\n<html>\n  <head>\n    <title>My Page</title>\n    <!-- Other meta info -->\n  </head>\n\n  <body>\n",
                "  </body>\n<html>",
              ]}
            />
          ),
        },
        {
          id: 10,
          type: "element",
          label: (
            <Browser
              content="<h1>Hello World</h1><p>This is my page.</p>"
              title="My Page"
            />
          ),
        },
      ],
    },
    // {
    //   submit: { label: "Practice" },
    //   content: [
    //     {
    //       id: 10,
    //       type: "element",
    //       label: (
    //         <DifficultyParagraph difficulty="Hard" color="red">
    //           Now, let&apos;s practice by assembling the basic HTML document
    //           structure. Arrange the elements in the correct order!
    //         </DifficultyParagraph>
    //       ),
    //     },
    //     {
    //       id: 11,
    //       type: "element",
    //       label: ({ setIsFinished, setNumberOfCorrect, setNumberOfInCorrect }) => {
    //         const choices = {
    //           options: [
    //             { label: "<!DOCTYPE html>\n", priority: 0 },
    //             { label: "<html>\n", priority: 1 },
    //             { label: "  <head>\n", priority: 2 },
    //             { label: "    <title>My Page</title>\n", priority: 3 },
    //             { label: "  </head>\n", priority: 4 },
    //             { label: "  <body>\n", priority: 5 },
    //             { label: "    <h1>Hello World</h1>\n", priority: 6 },
    //             { label: "    <p>This is my page.</p>\n", priority: 7 },
    //             { label: "  </body>\n", priority: 8 },
    //             { label: "</html>", priority: 9 },
    //           ],
    //           answer: `<!DOCTYPE html>\n<html>\n  <head>\n    <title>My Page</title>\n  </head>\n  <body>\n    <h1>Hello World</h1>\n    <p>This is my page.</p>\n  </body>\n</html>`,
    //           initialCode: ["", ""],
    //         };

    //         const shuffledData = shuffle(choices.options);

    //         return (
    //           <Practice
    //           setNumberOfCorrectAction={setNumberOfCorrect}
    //           setNumberOfInCorrectAction={setNumberOfInCorrect}
    //             setIsFinishedAction={setIsFinished}
    //             choices={choices}
    //             shuffledData={shuffledData}
    //             title={["Arrange the HTML elements in the correct order"]}
    //             initialCode={choices.initialCode}
    //             response={{
    //               positive: "Awesome! You got it right!",
    //               negative: "Hmm, that's not quite right. Try again!",
    //             }}
    //           />
    //         );
    //       },
    //     },
    //   ],
    // },
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 12,
          type: "text",
          label:
            "Great work! Now you know how to set up a basic HTML document. Keep practicing and you'll be a pro in no time!",
        },
      ],
    },
  ],
};
