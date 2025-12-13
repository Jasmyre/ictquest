import Browser from "@/components/browser";
import CodeBlock from "@/components/code";
import type { LessonContent } from "../lessons";

export const beyondHTML: LessonContent = {
  title: "Beyond HTML",
  contents: [
    {
      submit: { label: "Continue" },
      content: [
        {
          id: -1,
          type: "element",
          label: (
            <div>
              <p>Welcome to our &quot;Beyond HTML&quot; lesson!</p>
              <br />
              <p>
                In this lesson, we&apos;ll explore how HTML teams up with CSS
                and JavaScript to create visually appealing and interactive web
                pages. Remember, we won&apos;t deep dive into these topics—this
                is just a quick exploration beyond HTML.
              </p>
            </div>
          ),
        },
      ],
    },
    // HTML + CSS example
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 0,
          type: "element",
          label: (
            <div>
              <p>
                Let&apos;s start with HTML and CSS integration. CSS adds style
                to your HTML, controlling things like colors, fonts, and layout.
              </p>
              <br />
              <p>
                Below is a simple example where CSS is embedded within an HTML
                document.
              </p>
            </div>
          ),
        },
        {
          id: 1,
          type: "element",
          label: (
            <CodeBlock
              code={`<html>
  <head>
    <style>
      body {
        background-color: #f0f0f0;
        font-family: Arial, sans-serif;
      }
      h1 {
        color: blue;
      }
    </style>
  </head>
  <body>
    <h1>Styled Heading</h1>
    <p>This is a paragraph styled with CSS.</p>
  </body>
</html>`}
              initialCode={["", ""]}
              language="HTML"
            />
          ),
        },
        {
          id: 2,
          type: "element",
          label: (
            <Browser
              content={`<html>
  <head>
    <style>
      body {
        background-color: #f0f0f0;
        font-family: Arial, sans-serif;
      }
      h1 {
        color: blue;
      }
    </style>
  </head>
  <body>
    <h1>Styled Heading</h1>
    <p>This is a paragraph styled with CSS.</p>
  </body>
</html>`}
              title="CSS Integration Preview"
            />
          ),
        },
      ],
    },
    // HTML + JavaScript example
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 3,
          type: "element",
          label: (
            <div>
              <p>
                Next, let&apos;s explore HTML with JavaScript. JavaScript makes
                your page interactive.
              </p>
              <br />
              <p>
                Below is an example where a button click changes the text of a
                heading.
              </p>
            </div>
          ),
        },
        {
          id: 4,
          type: "element",
          label: (
            <CodeBlock
              code={`<html>
  <body>
    <h1 id="title">Hello, world!</h1>
    <button onclick="changeText()">Click Me!</button>
    <script>
      function changeText() {
        document.getElementById("title").innerText = "You clicked the button!";
      }
    </script>
  </body>
</html>`}
              initialCode={["", ""]}
              language="HTML"
            />
          ),
        },
        {
          id: 5,
          type: "element",
          label: (
            <Browser
              content={`<html>
  <body>
    <h1 id="title">Hello, world!</h1>
    <button onclick="changeText()">Click Me!</button>
    <script>
      function changeText() {
        document.getElementById("title").innerText = "You clicked the button!";
      }
    </script>
  </body>
</html>`}
              title="JavaScript Integration Preview"
            />
          ),
        },
      ],
    },
    // Note that we're not deep diving
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 6,
          type: "element",
          label: (
            <div>
              <p>
                These examples show how CSS and JavaScript work alongside HTML
                to enhance your web pages. Remember, we are not deep diving into
                these topics here—it’s just an exploration beyond HTML.
              </p>
            </div>
          ),
        },
      ],
    },
    // Practice: CSS
    // {
    //   submit: { label: "Practice" },
    //   content: [
    //     {
    //       id: 7,
    //       type: "element",
    //       label: (
    //         <DifficultyParagraph difficulty="medium" color="orange">
    //           Test: Arrange the HTML+CSS code correctly.
    //         </DifficultyParagraph>
    //       ),
    //     },
    //     {
    //       id: 8,
    //       type: "element",
    //       label: ({
    //         setIsFinished,
    //         setNumberOfCorrect,
    //         setNumberOfInCorrect,
    //       }) => {
    //         const choices = {
    //           options: [
    //             { label: `<html>\n`, priority: 0 },
    //             { label: `  <head>\n`, priority: 1 },
    //             { label: `    <style>\n`, priority: 2 },
    //             {
    //               label: `      body { background-color: #f0f0f0; }\n`,
    //               priority: 3,
    //             },
    //             { label: `    </style>\n`, priority: 4 },
    //             { label: `  </head>\n`, priority: 5 },
    //             { label: `  <body>\n`, priority: 6 },
    //             { label: `    <h1>Styled Heading</h1>\n`, priority: 7 },
    //             {
    //               label: `    <p>This is a paragraph styled with CSS.</p>\n`,
    //               priority: 8,
    //             },
    //             { label: `  </body>\n`, priority: 9 },
    //             { label: `</html>`, priority: 10 },
    //           ],
    //           answer: `<html>\n  <head>\n    <style>\n      body { background-color: #f0f0f0; }\n    </style>\n  </head>\n  <body>\n    <h1>Styled Heading</h1>\n    <p>This is a paragraph styled with CSS.</p>\n  </body>\n</html>`,
    //           initialCode: ["", ""],
    //         };
    //         const shuffledData = shuffle(choices.options);
    //         return (
    //           <Practice
    //             setNumberOfCorrectAction={setNumberOfCorrect}
    //             setNumberOfInCorrectAction={setNumberOfInCorrect}
    //             setIsFinishedAction={setIsFinished}
    //             choices={choices}
    //             shuffledData={shuffledData}
    //             title={["Arrange the HTML+CSS code correctly"]}
    //             initialCode={choices.initialCode}
    //             response={{
    //               positive: "Great job!",
    //               negative: "That’s not quite right. Try again!",
    //             }}
    //           />
    //         );
    //       },
    //     },
    //   ],
    // },
    // Practice: JavaScript
    // {
    //   submit: { label: "Practice" },
    //   content: [
    //     {
    //       id: 9,
    //       type: "element",
    //       label: (
    //         <DifficultyParagraph difficulty="medium" color="orange">
    //           Test: Arrange the HTML+JavaScript code correctly.
    //         </DifficultyParagraph>
    //       ),
    //     },
    //     {
    //       id: 10,
    //       type: "element",
    //       label: ({
    //         setIsFinished,
    //         setNumberOfCorrect,
    //         setNumberOfInCorrect,
    //       }) => {
    //         const choices = {
    //           options: [
    //             { label: `<html>\n`, priority: 0 },
    //             { label: `  <body>\n`, priority: 1 },
    //             {
    //               label: `    <h1 id="title">Hello, world!</h1>\n`,
    //               priority: 2,
    //             },
    //             {
    //               label: `    <button onclick="changeText()">Click Me!</button>\n`,
    //               priority: 3,
    //             },
    //             { label: `    <script>\n`, priority: 4 },
    //             { label: `      function changeText() {\n`, priority: 5 },
    //             {
    //               label: `        document.getElementById("title").innerText = "You clicked the button!";\n`,
    //               priority: 6,
    //             },
    //             { label: `      }\n`, priority: 7 },
    //             { label: `    </script>\n`, priority: 8 },
    //             { label: `  </body>\n`, priority: 9 },
    //             { label: `</html>`, priority: 10 },
    //           ],
    //           answer: `<html>\n  <body>\n    <h1 id="title">Hello, world!</h1>\n    <button onclick="changeText()">Click Me!</button>\n    <script>\n      function changeText() {\n        document.getElementById("title").innerText = "You clicked the button!";\n      }\n    </script>\n  </body>\n</html>`,
    //           initialCode: ["", ""],
    //         };
    //         const shuffledData = shuffle(choices.options);
    //         return (
    //           <Practice
    //             setNumberOfCorrectAction={setNumberOfCorrect}
    //             setNumberOfInCorrectAction={setNumberOfInCorrect}
    //             setIsFinishedAction={setIsFinished}
    //             choices={choices}
    //             shuffledData={shuffledData}
    //             title={["Arrange the HTML+JavaScript code correctly"]}
    //             initialCode={choices.initialCode}
    //             response={{
    //               positive: "Great job!",
    //               negative: "That’s not quite right. Try again!",
    //             }}
    //           />
    //         );
    //       },
    //     },
    //   ],
    // },
    // Conclusion
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 11,
          type: "element",
          label: (
            <div>
              <p>Congratulations!</p>
              <br />
              <p>
                You&apos;ve explored how HTML can be enhanced with both CSS and
                JavaScript. Remember, this lesson was just a brief look at what
                lies beyond HTML. Continue practicing and exploring to build
                even more dynamic and styled web pages!
              </p>
            </div>
          ),
        },
      ],
    },
  ],
};
