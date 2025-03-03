import { MultipleChoice
 } from "@/components/MultipleChoice";
import { LessonContent } from "../lessons";
import { shuffle } from "@/lib/utils";
import { Practice } from "@/components/Practice";
import { DifficultyParagraph } from "@/components/DifficultyParagraph";
import CodeHighlight from "@/components/CodeHighlight";

const reset = true

export const quiz: LessonContent = {
  title: "HTML and Its History Quiz",
  contents: [
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 0,
          type: "text",
          label: "Good Luck!!",
        },
      ],
    },

    // 1
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 1,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => (
            <MultipleChoice
            isResetEnabled={reset}
              setNumberOfCorrectAction={setNumberOfCorrect}
              setNumberOfInCorrectAction={setNumberOfInCorrect}
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

    // 2
    {
      submit: {
        label: "Continue",
      },
      content: [
        {
          id: 2,
          type: "element",
          label:  ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => {
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
                isResetEnabled={reset}
                setNumberOfCorrectAction={setNumberOfCorrect}
                setNumberOfInCorrectAction={setNumberOfInCorrect}
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

    // 3
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 3,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => (
            <MultipleChoice
            isResetEnabled={reset}
              setNumberOfCorrectAction={setNumberOfCorrect}
              setNumberOfInCorrectAction={setNumberOfInCorrect}
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

    // 4
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 4,
          type: "text",
          label:
            "Let’s check your memory: Which version of HTML brought in modern, semantic elements?",
        },
        {
          id: 5,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => (
            <MultipleChoice
            isResetEnabled={reset}
              setNumberOfCorrectAction={setNumberOfCorrect}
              setNumberOfInCorrectAction={setNumberOfInCorrect}
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

    // 5
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 6,
          type: "text",
          label: "True or False: HTML is a programming language.",
        },
        {
          id: 7,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => (
            <MultipleChoice
            isResetEnabled={reset}
              setNumberOfCorrectAction={setNumberOfCorrect}
              setNumberOfInCorrectAction={setNumberOfInCorrect}
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

    // 6
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 8,
          type: "text",
          label: <div>Arrange the following code to form your heading.</div>,
        },
        {
          id: 9,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => {
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
                isResetEnabled={reset}
                setNumberOfCorrectAction={setNumberOfCorrect}
                setNumberOfInCorrectAction={setNumberOfInCorrect}
                setIsFinishedAction={setIsFinished}
                choices={choices}
                shuffledData={shuffledData}
              />
            );
          },
        },
      ],
    },

    // 7
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 10,
          type: "text",
          label: <div>Arrange the following code:</div>,
        },
        {
          id: 11,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => {
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
                isResetEnabled={reset}
                setNumberOfCorrectAction={setNumberOfCorrect}
                setNumberOfInCorrectAction={setNumberOfInCorrect}
                setIsFinishedAction={setIsFinished}
                choices={choices}
                shuffledData={shuffledData}
              />
            );
          },
        },
      ],
    },

    // 8
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 12,
          type: "text",
          label: <div>Arrange this snippet:</div>,
        },
        {
          id: 13,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => {
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
                isResetEnabled={reset}
                setNumberOfCorrectAction={setNumberOfCorrect}
                setNumberOfInCorrectAction={setNumberOfInCorrect}
                setIsFinishedAction={setIsFinished}
                choices={choices}
                shuffledData={shuffledData}
              />
            );
          },
        },
      ],
    },

    // 9
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 14,
          type: "text",
          label: <div>Arrange this snippet:</div>,
        },
        {
          id: 15,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => {
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
                isResetEnabled={reset}
                setNumberOfCorrectAction={setNumberOfCorrect}
                setNumberOfInCorrectAction={setNumberOfInCorrect}
                setIsFinishedAction={setIsFinished}
                choices={choices}
                shuffledData={shuffledData}
              />
            );
          },
        },
      ],
    },

    // 10
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 16,
          type: "text",
          label: "Which tag is used to insert a line break?",
        },
        {
          id: 17,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => (
            <MultipleChoice
            isResetEnabled={reset}
              setNumberOfCorrectAction={setNumberOfCorrect}
              setNumberOfInCorrectAction={setNumberOfInCorrect}
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

    // 11
    {
      submit: { label: "Next" },
      content: [
        {
          id: 18,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => (
            <MultipleChoice
            isResetEnabled={reset}
              setNumberOfCorrectAction={setNumberOfCorrect}
              setNumberOfInCorrectAction={setNumberOfInCorrect}
              setIsFinishedAction={setIsFinished}
              title={["Which tag shows the page title on the browser tab?"]}
              choices={{
                options: ["<title>", "<header>", "<h1>", "<meta>"],
                answer: "<title>",
              }}
              response={{
                positive: "Correct! It’s the <title> tag.",
                negative: "Not quite, try again.",
              }}
            />
          ),
        },
      ],
    },

    // 12
    {
      submit: { label: "Next" },
      content: [
        {
          id: 19,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => (
            <MultipleChoice
            isResetEnabled={reset}
              setNumberOfCorrectAction={setNumberOfCorrect}
              setNumberOfInCorrectAction={setNumberOfInCorrect}
              setIsFinishedAction={setIsFinished}
              title={["What is the default language code for most HTML docs?"]}
              choices={{
                options: ["en", "fr", "es", "de"],
                answer: "en",
              }}
              response={{
                positive: "That's it! Usually it's en.",
                negative: "Try again, it's en.",
              }}
            />
          ),
        },
      ],
    },

    // 13
    {
      submit: { label: "Next" },
      content: [
        {
          id: 20,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => (
            <MultipleChoice
            isResetEnabled={reset}
              setNumberOfCorrectAction={setNumberOfCorrect}
              setNumberOfInCorrectAction={setNumberOfInCorrect}
              setIsFinishedAction={setIsFinished}
              title={["What does the <body> tag do?"]}
              choices={{
                options: [
                  "Holds all the visible content",
                  "Stores metadata",
                  "Defines the document type",
                  "Adds interactivity",
                ],
                answer: "Holds all the visible content",
              }}
              response={{
                positive: "Yup, the body shows what you see!",
                negative: "Nah, that's not it.",
              }}
            />
          ),
        },
      ],
    },

    // 14
    {
      submit: { label: "Next" },
      content: [
        {
          id: 21,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => (
            <MultipleChoice
            isResetEnabled={reset}
              setNumberOfCorrectAction={setNumberOfCorrect}
              setNumberOfInCorrectAction={setNumberOfInCorrect}
              setIsFinishedAction={setIsFinished}
              title={["Where should you put the charset meta tag?"]}
              choices={{
                options: [
                  "Inside the <head> tag",
                  "Inside the <body> tag",
                  "At the top of the page",
                  "At the bottom of the page",
                ],
                answer: "Inside the <head> tag",
              }}
              response={{
                positive: "Right on!",
                negative: "Nope, try again.",
              }}
            />
          ),
        },
      ],
    },

    // 15
    {
      submit: { label: "Next" },
      content: [
        {
          id: 22,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => (
            <MultipleChoice
            isResetEnabled={reset}
              setNumberOfCorrectAction={setNumberOfCorrect}
              setNumberOfInCorrectAction={setNumberOfInCorrect}
              setIsFinishedAction={setIsFinished}
              title={["What is the correct order of basic HTML tags?"]}
              choices={{
                options: [
                  "<!DOCTYPE html>, <html>, <head>, <body>",
                  "<html>, <head>, <body>, <!DOCTYPE html>",
                  "<head>, <html>, <body>, <title>",
                  "<!DOCTYPE html>, <head>, <html>, <body>",
                ],
                answer: "<!DOCTYPE html>, <html>, <head>, <body>",
              }}
              response={{
                positive: "That's the right order!",
                negative: "Nope, check the basics again.",
              }}
            />
          ),
        },
      ],
    },

    // 16
    // {
    //   submit: { label: "Next" },
    //   content: [
    //     {
    //       id: 23,
    //       type: "element",
    //       label: ({
    //         setIsFinished,
    //         setNumberOfCorrect,
    //         setNumberOfInCorrect,
    //       }) => (
    //         <MultipleChoice
    //           setNumberOfCorrectAction={setNumberOfCorrect}
    //           setNumberOfInCorrectAction={setNumberOfInCorrect}
    //           setIsFinishedAction={setIsFinished}
    //           title={["What is the function of the <meta> tag?"]}
    //           choices={{
    //             options: [
    //               "Provides metadata about the document",
    //               "Displays the page title",
    //               "Creates a link",
    //               "Inserts an image",
    //             ],
    //             answer: "Provides metadata about the document",
    //           }}
    //           response={{
    //             positive: "Correct! It gives extra info.",
    //             negative: "Oops, that's not it.",
    //           }}
    //         />
    //       ),
    //     },
    //   ],
    // },

    // 16
    {
      submit: { label: "Practice" },
      content: [
        {
          id: 24,
          type: "element",
          label: (
            <DifficultyParagraph difficulty="easy" color="green">
              Arrange the &lt;strong&gt; element in the correct order.
            </DifficultyParagraph>
          ),
        },
        {
          id: 25,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => {
            const choices = {
              options: [
                { label: "<strong>", priority: 0 },
                { label: "important", priority: 1 },
                { label: "</strong>", priority: 2 },
              ],
              answer: `<strong>important</strong>`,
              initialCode: ["", ""],
            };
            const shuffledData = shuffle(choices.options);
            return (
              <Practice
                isResetEnabled={reset}
                setNumberOfCorrectAction={setNumberOfCorrect}
                setNumberOfInCorrectAction={setNumberOfInCorrect}
                setIsFinishedAction={setIsFinished}
                choices={choices}
                shuffledData={shuffledData}
                title={["Arrange the <strong> element in the correct order"]}
                initialCode={choices.initialCode}
                response={{
                  positive: "Correct!",
                  negative: "Try again!",
                }}
              />
            );
          },
        },
      ],
    },

    // 17
    {
      submit: { label: "Practice" },
      content: [
        {
          id: 26,
          type: "element",
          label: (
            <DifficultyParagraph difficulty="easy" color="green">
              Arrange the &lt;mark&gt; element in the correct order.
            </DifficultyParagraph>
          ),
        },
        {
          id: 27,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => {
            const choices = {
              options: [
                { label: "<mark>", priority: 0 },
                { label: "highlighted", priority: 1 },
                { label: "</mark>", priority: 2 },
              ],
              answer: `<mark>highlighted</mark>`,
              initialCode: ["", ""],
            };
            const shuffledData = shuffle(choices.options);
            return (
              <Practice
                isResetEnabled={reset}
                setNumberOfCorrectAction={setNumberOfCorrect}
                setNumberOfInCorrectAction={setNumberOfInCorrect}
                setIsFinishedAction={setIsFinished}
                choices={choices}
                shuffledData={shuffledData}
                title={["Arrange the <mark> element in the correct order"]}
                initialCode={choices.initialCode}
                response={{
                  positive: "Correct!",
                  negative: "Try again!",
                }}
              />
            );
          },
        },
      ],
    },

    // 18
    {
      submit: { label: "Practice" },
      content: [
        {
          id: 28,
          type: "element",
          label: (
            <DifficultyParagraph difficulty="easy" color="green">
              Arrange the &lt;small&gt; element in the correct order.
            </DifficultyParagraph>
          ),
        },
        {
          id: 29,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => {
            const choices = {
              options: [
                { label: "<small>", priority: 0 },
                { label: "small text", priority: 1 },
                { label: "</small>", priority: 2 },
              ],
              answer: `<small>small text</small>`,
              initialCode: ["", ""],
            };
            const shuffledData = shuffle(choices.options);
            return (
              <Practice
                isResetEnabled={reset}
                setNumberOfCorrectAction={setNumberOfCorrect}
                setNumberOfInCorrectAction={setNumberOfInCorrect}
                setIsFinishedAction={setIsFinished}
                choices={choices}
                shuffledData={shuffledData}
                title={["Arrange the <small> element in the correct order"]}
                initialCode={choices.initialCode}
                response={{
                  positive: "Correct!",
                  negative: "Try again!",
                }}
              />
            );
          },
        },
      ],
    },

    // 19
    {
      submit: { label: "Practice" },
      content: [
        {
          id: 30,
          type: "element",
          label: (
            <DifficultyParagraph difficulty="easy" color="green">
              Arrange the &lt;abbr&gt; element in the correct order.
            </DifficultyParagraph>
          ),
        },
        {
          id: 32,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => {
            const choices = {
              options: [
                { label: "<abbr>", priority: 0 },
                { label: "WHO", priority: 1 },
                { label: "</abbr>", priority: 2 },
              ],
              answer: `<abbr>WHO</abbr>`,
              initialCode: ["", ""],
            };
            const shuffledData = shuffle(choices.options);
            return (
              <Practice
                isResetEnabled={reset}
                setNumberOfCorrectAction={setNumberOfCorrect}
                setNumberOfInCorrectAction={setNumberOfInCorrect}
                setIsFinishedAction={setIsFinished}
                choices={choices}
                shuffledData={shuffledData}
                title={["Arrange the <abbr> element in the correct order"]}
                initialCode={choices.initialCode}
                response={{
                  positive: "Correct!",
                  negative: "Try again!",
                }}
              />
            );
          },
        },
      ],
    },

    // 20
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 34,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => (
            <MultipleChoice
            isResetEnabled={reset}
              setNumberOfCorrectAction={setNumberOfCorrect}
              setNumberOfInCorrectAction={setNumberOfInCorrect}
              setIsFinishedAction={setIsFinished}
              title={["Which tag is used to highlight text?"]}
              choices={{
                options: ["<mark>", "<strong>", "<em>", "<code>"],
                answer: "<mark>",
              }}
              response={{
                positive: "Correct!",
                negative: "Try again!",
              }}
            />
          ),
        },
      ],
    },

    // 21
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 1,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => (
            <MultipleChoice
            isResetEnabled={reset}
              setNumberOfCorrectAction={setNumberOfCorrect}
              setNumberOfInCorrectAction={setNumberOfInCorrect}
              setIsFinishedAction={setIsFinished}
              title={["What's the main purpose of a <div> tag?"]}
              choices={{
                options: [
                  "To group related content",
                  "To add styles directly",
                  "To create links",
                  "To embed images",
                ],
                answer: "To group related content",
              }}
              response={{
                positive: "Yup, that's right!",
                negative: "Nope, try again!",
              }}
            />
          ),
        },
      ],
    },

    // 22
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 2,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => (
            <MultipleChoice
            isResetEnabled={reset}
              setNumberOfCorrectAction={setNumberOfCorrect}
              setNumberOfInCorrectAction={setNumberOfInCorrect}
              setIsFinishedAction={setIsFinished}
              title={["Which tag is most commonly used as a container?"]}
              choices={{
                options: ["<div>", "<span>", "<p>", "<header>"],
                answer: "<div>",
              }}
              response={{
                positive: "Correct!",
                negative: "Try again!",
              }}
            />
          ),
        },
      ],
    },

    // 23
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 3,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => (
            <MultipleChoice
            isResetEnabled={reset}
              setNumberOfCorrectAction={setNumberOfCorrect}
              setNumberOfInCorrectAction={setNumberOfInCorrect}
              setIsFinishedAction={setIsFinished}
              title={["Why do we use <div> containers?"]}
              choices={{
                options: [
                  "To organize content",
                  "To add animations",
                  "To make text bigger",
                  "To add links",
                ],
                answer: "To organize content",
              }}
              response={{
                positive: "Right on!",
                negative: "Oops, that's not it.",
              }}
            />
          ),
        },
      ],
    },

    // 24
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 4,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => (
            <MultipleChoice
            isResetEnabled={reset}
              setNumberOfCorrectAction={setNumberOfCorrect}
              setNumberOfInCorrectAction={setNumberOfInCorrect}
              setIsFinishedAction={setIsFinished}
              title={["True or False: <div> tags add meaning to the content."]}
              choices={{
                options: ["True", "False"],
                answer: "False",
              }}
              response={{
                positive: "Correct, it's just for grouping.",
                negative: "Not quite, try again.",
              }}
            />
          ),
        },
      ],
    },

    // 25
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 6,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => (
            <MultipleChoice
            isResetEnabled={reset}
              setNumberOfCorrectAction={setNumberOfCorrect}
              setNumberOfInCorrectAction={setNumberOfInCorrect}
              setIsFinishedAction={setIsFinished}
              title={[
                "Which attribute is most often used with <div> for styling?",
              ]}
              choices={{
                options: ["class", "id", "src", "alt"],
                answer: "class",
              }}
              response={{
                positive: "Correct!",
                negative: "Not really, try again.",
              }}
            />
          ),
        },
      ],
    },

    // 26
    {
      submit: { label: "Practice" },
      content: [
        {
          id: 50,
          type: "element",
          label: (
            <DifficultyParagraph difficulty="medium" color="orange">
              Arrange the <CodeHighlight>&lt;video&gt;</CodeHighlight> element
              code correctly.
            </DifficultyParagraph>
          ),
        },
        {
          id: 51,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => {
            const choices = {
              options: [
                {
                  label: `<video controls width="320" height="240">\n`,
                  priority: 0,
                },
                {
                  label: `  <source src="/video.mp4" type="video/mp4">\n`,
                  priority: 1,
                },
                {
                  label: `  Your browser does not support the video tag.\n`,
                  priority: 2,
                },
                { label: `</video>`, priority: 3 },
              ],
              answer: `<video controls width="320" height="240">\n  <source src="/video.mp4" type="video/mp4">\n  Your browser does not support the video tag.\n</video>`,
              initialCode: ["", ""],
            };
            const shuffledData = shuffle(choices.options);
            return (
              <Practice
                isResetEnabled={reset}
                setNumberOfCorrectAction={setNumberOfCorrect}
                setNumberOfInCorrectAction={setNumberOfInCorrect}
                setIsFinishedAction={setIsFinished}
                choices={choices}
                shuffledData={shuffledData}
                title={["Arrange the <video> element code correctly"]}
                initialCode={choices.initialCode}
                response={{
                  positive: "Great job!",
                  negative: "That’s not quite right. Try again!",
                }}
              />
            );
          },
        },
      ],
    },

    // 27
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 52,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => (
            <MultipleChoice
            isResetEnabled={reset}
              setNumberOfCorrectAction={setNumberOfCorrect}
              setNumberOfInCorrectAction={setNumberOfInCorrect}
              setIsFinishedAction={setIsFinished}
              title={["What does the audio element do?"]}
              choices={{
                options: [
                  "To display texts",
                  "To display images",
                  "To play sounds",
                  "To play videos",
                ],
                answer: "To play sounds",
              }}
              response={{
                positive: "Correct!",
                negative: "Try again!",
              }}
            />
          ),
        },
      ],
    },

    // 28
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 53,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => (
            <MultipleChoice
            isResetEnabled={reset}
              setNumberOfCorrectAction={setNumberOfCorrect}
              setNumberOfInCorrectAction={setNumberOfInCorrect}
              setIsFinishedAction={setIsFinished}
              title={["What does the source element do?"]}
              choices={{
                options: [
                  "To specify multiple media source",
                  "To display images",
                  "To play sounds",
                  "To play videos",
                ],
                answer: "To specify multiple media source",
              }}
              response={{
                positive: "Correct!",
                negative: "Try again!",
              }}
            />
          ),
        },
      ],
    },

    // 29
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 54,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => (
            <MultipleChoice
            isResetEnabled={reset}
              setNumberOfCorrectAction={setNumberOfCorrect}
              setNumberOfInCorrectAction={setNumberOfInCorrect}
              setIsFinishedAction={setIsFinished}
              title={["What does the image element do?"]}
              choices={{
                options: [
                  "To specify multiple media source",
                  "To display images",
                  "To play sounds",
                  "To play videos",
                ],
                answer: "To display images",
              }}
              response={{
                positive: "Correct!",
                negative: "Try again!",
              }}
            />
          ),
        },
      ],
    },

    // 30
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 55,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => (
            <MultipleChoice
            isResetEnabled={reset}
              setNumberOfCorrectAction={setNumberOfCorrect}
              setNumberOfInCorrectAction={setNumberOfInCorrect}
              setIsFinishedAction={setIsFinished}
              title={["What does the image element do?"]}
              choices={{
                options: [
                  "To specify multiple media source",
                  "To display images",
                  "To play sounds",
                  "To play videos",
                ],
                answer: "To play videos",
              }}
              response={{
                positive: "Correct!",
                negative: "Try again!",
              }}
            />
          ),
        },
      ],
    },

    // 31
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 56,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => (
            <MultipleChoice
            isResetEnabled={reset}
              setNumberOfCorrectAction={setNumberOfCorrect}
              setNumberOfInCorrectAction={setNumberOfInCorrect}
              setIsFinishedAction={setIsFinished}
              title={[
                "In an <option> tag, what does the 'value' attribute do?",
              ]}
              choices={{
                options: [
                  "It sets the option's value when selected",
                  "It displays the text to the user",
                  "It styles the option",
                  "It creates a new dropdown",
                ],
                answer: "It sets the option's value when selected",
              }}
              response={{
                positive: "Exactly!",
                negative: "Nope, give it another shot.",
              }}
            />
          ),
        },
      ],
    },

    // 32
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 57,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => (
            <MultipleChoice
            isResetEnabled={reset}
              setNumberOfCorrectAction={setNumberOfCorrect}
              setNumberOfInCorrectAction={setNumberOfInCorrect}
              setIsFinishedAction={setIsFinished}
              title={["Which tag is used inside <select> to list options?"]}
              choices={{
                options: ["<option>", "<item>", "<choice>", "<list>"],
                answer: "<option>",
              }}
              response={{
                positive: "Right on!",
                negative: "Oops, that's not it.",
              }}
            />
          ),
        },
      ],
    },

    // 33
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 58,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => (
            <MultipleChoice
            isResetEnabled={reset}
              setNumberOfCorrectAction={setNumberOfCorrect}
              setNumberOfInCorrectAction={setNumberOfInCorrect}
              setIsFinishedAction={setIsFinished}
              title={["What does the <select> element do?"]}
              choices={{
                options: [
                  "It creates a dropdown menu",
                  "It shows a list of images",
                  "It plays a video",
                  "It opens a modal",
                ],
                answer: "It creates a dropdown menu",
              }}
              response={{
                positive: "Yup, that's right!",
                negative: "Nope, try again!",
              }}
            />
          ),
        },
      ],
    },

    // 34
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 59,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => (
            <MultipleChoice
            isResetEnabled={reset}
              setNumberOfCorrectAction={setNumberOfCorrect}
              setNumberOfInCorrectAction={setNumberOfInCorrect}
              setIsFinishedAction={setIsFinished}
              title={[
                "What do the <details> and <summary> elements let you do?",
              ]}
              choices={{
                options: [
                  "Create collapsible sections",
                  "Display images in a slider",
                  "Show a popup dialog",
                  "Make a dropdown menu",
                ],
                answer: "Create collapsible sections",
              }}
              response={{
                positive: "Yep, that's it!",
                negative: "Not quite, try again!",
              }}
            />
          ),
        },
      ],
    },

    // 35
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 60,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => (
            <MultipleChoice
            isResetEnabled={reset}
              setNumberOfCorrectAction={setNumberOfCorrect}
              setNumberOfInCorrectAction={setNumberOfInCorrect}
              setIsFinishedAction={setIsFinished}
              title={[
                "Which tag defines the visible heading in a collapsible section?",
              ]}
              choices={{
                options: ["<summary>", "<header>", "<caption>", "<title>"],
                answer: "<summary>",
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

    // 36
    {
      submit: { label: "Practice" },
      content: [
        {
          id: 61,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => (
            <MultipleChoice
            isResetEnabled={reset}
              setNumberOfCorrectAction={setNumberOfCorrect}
              setNumberOfInCorrectAction={setNumberOfInCorrect}
              setIsFinishedAction={setIsFinished}
              title={[
                "Which attribute of the <form> element specifies where to send form data?",
              ]}
              choices={{
                options: ["action", "method", "enctype", "target"],
                answer: "action",
              }}
              response={{
                positive:
                  "Correct! The 'action' attribute sets the destination.",
                negative:
                  "That's not correct. Remember, 'action' is used to specify the destination URL.",
              }}
            />
          ),
        },
      ],
    },

    // 37
    {
      submit: { label: "Practice" },
      content: [
        {
          id: 62,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => (
            <MultipleChoice
            isResetEnabled={reset}
              setNumberOfCorrectAction={setNumberOfCorrect}
              setNumberOfInCorrectAction={setNumberOfInCorrect}
              setIsFinishedAction={setIsFinished}
              title={["Which input type should you use for a password field?"]}
              choices={{
                options: ["text", "password", "email", "number"],
                answer: "password",
              }}
              response={{
                positive: "Correct!",
                negative:
                  "That's not right. The password field uses type 'password'.",
              }}
            />
          ),
        },
      ],
    },

    // 38
    {
      submit: { label: "Practice" },
      content: [
        {
          id: 63,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => (
            <MultipleChoice
            isResetEnabled={reset}
              setNumberOfCorrectAction={setNumberOfCorrect}
              setNumberOfInCorrectAction={setNumberOfInCorrect}
              setIsFinishedAction={setIsFinished}
              title={["Which input type is used for numeric data?"]}
              choices={{
                options: ["text", "number", "password", "email"],
                answer: "number",
              }}
              response={{
                positive: "Correct!",
                negative:
                  "Incorrect. The type 'number' is used for numeric input.",
              }}
            />
          ),
        },
      ],
    },

    // 39
    {
      submit: { label: "Practice" },
      content: [
        {
          id: 64,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => (
            <MultipleChoice
            isResetEnabled={reset}
              setNumberOfCorrectAction={setNumberOfCorrect}
              setNumberOfInCorrectAction={setNumberOfInCorrect}
              setIsFinishedAction={setIsFinished}
              title={["Which input type is ideal for email addresses?"]}
              choices={{
                options: ["text", "email", "password", "number"],
                answer: "email",
              }}
              response={{
                positive: "Correct!",
                negative: "Incorrect. The correct type is 'email'.",
              }}
            />
          ),
        },
      ],
    },

    // 40
    {
      submit: { label: "Practice" },
      content: [
        {
          id: 65,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => (
            <MultipleChoice
            isResetEnabled={reset}
              setNumberOfCorrectAction={setNumberOfCorrect}
              setNumberOfInCorrectAction={setNumberOfInCorrect}
              setIsFinishedAction={setIsFinished}
              title={["Radio buttons allow users to select:"]}
              choices={{
                options: [
                  "Multiple options",
                  "A single option",
                  "All options",
                  "No option",
                ],
                answer: "A single option",
              }}
              response={{
                positive: "Correct!",
                negative:
                  "Incorrect. Radio buttons allow only one selection per group.",
              }}
            />
          ),
        },
      ],
    },

    // 41
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 66,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => (
            <MultipleChoice
            isResetEnabled={reset}
              setNumberOfCorrectAction={setNumberOfCorrect}
              setNumberOfInCorrectAction={setNumberOfInCorrect}
              setIsFinishedAction={setIsFinished}
              title={["What does CSS do for an HTML page?"]}
              choices={{
                options: [
                  "It adds style",
                  "It makes the page interactive",
                  "It structures content",
                  "It processes data",
                ],
                answer: "It adds style",
              }}
              response={{
                positive: "Yup, that's right!",
                negative: "Nope, try again!",
              }}
            />
          ),
        },
      ],
    },

    // 42
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 67,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => (
            <MultipleChoice
            isResetEnabled={reset}
              setNumberOfCorrectAction={setNumberOfCorrect}
              setNumberOfInCorrectAction={setNumberOfInCorrect}
              setIsFinishedAction={setIsFinished}
              title={["Where is CSS usually placed in an HTML document?"]}
              choices={{
                options: [
                  "Inside a <style> tag in the <head>",
                  "Inside the <body>",
                  "Inside a <script> tag",
                  "At the bottom of the page",
                ],
                answer: "Inside a <style> tag in the <head>",
              }}
              response={{
                positive: "Correct!",
                negative: "Nope, that's not it.",
              }}
            />
          ),
        },
      ],
    },

    // 43
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 68,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => (
            <MultipleChoice
            isResetEnabled={reset}
              setNumberOfCorrectAction={setNumberOfCorrect}
              setNumberOfInCorrectAction={setNumberOfInCorrect}
              setIsFinishedAction={setIsFinished}
              title={["What does JavaScript add to an HTML page?"]}
              choices={{
                options: [
                  "Interactivity",
                  "Structure",
                  "Style",
                  "None of the above",
                ],
                answer: "Interactivity",
              }}
              response={{
                positive: "Right on!",
                negative: "Oops, not that one.",
              }}
            />
          ),
        },
      ],
    },

    // 44
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 69,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => (
            <MultipleChoice
            isResetEnabled={reset}
              setNumberOfCorrectAction={setNumberOfCorrect}
              setNumberOfInCorrectAction={setNumberOfInCorrect}
              setIsFinishedAction={setIsFinished}
              title={["Which language is used to style the webpage?"]}
              choices={{
                options: ["CSS", "HTML", "JavaScript", "PHP"],
                answer: "CSS",
              }}
              response={{
                positive: "You got it!",
                negative: "Nope, not that one.",
              }}
            />
          ),
        },
      ],
    },

    // 45
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 70,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => (
            <MultipleChoice
            isResetEnabled={reset}
              setNumberOfCorrectAction={setNumberOfCorrect}
              setNumberOfInCorrectAction={setNumberOfInCorrect}
              setIsFinishedAction={setIsFinished}
              title={[
                "What is the typical file extension for a JavaScript file?",
              ]}
              choices={{
                options: [".js", ".css", ".html", ".java"],
                answer: ".js",
              }}
              response={{
                positive: "Correct!",
                negative: "Nope, try again.",
              }}
            />
          ),
        },
      ],
    },
  ],
};
