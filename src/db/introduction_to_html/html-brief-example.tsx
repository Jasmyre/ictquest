import Browser from "@/components/Browser";
import CodeHighlight from "@/components/CodeHighlight";
import { Practice } from "@/components/Practice";
import { shuffle } from "@/lib/utils";
import { LessonContent } from "../lessons";

export const htmlBriefExample: LessonContent = {
  title: "HTML Brief Examples",
  contents: [
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 0,
          type: "text",
          label:
            "Hey there! Welcome to HTML Brief Examples. In this lesson we're gonna build a simple static webpage step by step using basic HTML elements. We'll add each element one by one so you can see how everything connects.",
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
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 3,
          type: "text",
          label: (
            <div>
              Let&apos;s start by adding a main heading. We will use the{" "}
              <CodeHighlight>{"<h1>"}</CodeHighlight> tag to display the title.
              Later, you&apos;ll see your heading appear at the top.
            </div>
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
          label: (
            <div>
              Arrange the following code to form your heading. The full snippet
              you’ll arrange is:{" "}
              <CodeHighlight>{"<h1>Welcome to My Website</h1>"}</CodeHighlight>
            </div>
          ),
        },
        {
          id: 5,
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
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 6,
          type: "text",
          label: (
            <div>
              Now, add a paragraph below your heading using the{" "}
              <CodeHighlight>{"<p>"}</CodeHighlight> tag. This paragraph will
              give a brief introduction.
            </div>
          ),
        },
      ],
    },
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
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => {
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
              <CodeHighlight>src</CodeHighlight> attribute holds the image path
              and the <CodeHighlight>alt</CodeHighlight> attribute gives a
              description.
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
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 12,
          type: "text",
          label: (
            <div>
              Now, add a link using the <CodeHighlight>{"<a>"}</CodeHighlight>{" "}
              tag. Use the <CodeHighlight>href</CodeHighlight> attribute to
              specify the URL and have the link text say{" "}
              <CodeHighlight>{"Visit Example"}</CodeHighlight>.
            </div>
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
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 15,
          type: "text",
          label: (
            <div>
              Finally, add a navigation menu using an unordered list. You will
              use the <CodeHighlight>{"<ul>"}</CodeHighlight> tag to wrap list
              items, each in a <CodeHighlight>{"<li>"}</CodeHighlight> tag.
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
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => {
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
                  Arrange the code blocks to form the unordered list (look at{" "}
                  <CodeHighlight>{"<ul>...</ul>"}</CodeHighlight> for guidance):
                </p>
                <br />
                <Practice
                  setNumberOfCorrectAction={setNumberOfCorrect}
                  setNumberOfInCorrectAction={setNumberOfInCorrect}
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
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 20,
          type: "text",
          label: (
            <div>
              Now, let&apos;s add a horizontal rule using the{" "}
              <CodeHighlight>&lt;hr&gt;</CodeHighlight> tag. This tag draws a
              horizontal line to separate sections.
            </div>
          ),
        },
      ],
    },
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
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => {
            const choices = {
              options: [{ label: "<hr>", priority: 1 }],
              answer: "<hr>",
              initialCode: ["<body>\n  ...\n  ", "\n</body>"],
            };
            const shuffledData = shuffle(choices.options);
            return (
              <Practice
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
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 23,
          type: "text",
          label: (
            <div>
              Next, we can add a line break using the{" "}
              <CodeHighlight>{"<br>"}</CodeHighlight> tag to start a new line
              within the same block.
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
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => {
            const choices = {
              options: [{ label: "<br>", priority: 1 }],
              answer: "<br>",
              initialCode: ["<p>First line.</p>\n  ", "\n<p>Second line.</p>"],
            };
            const shuffledData = shuffle(choices.options);
            return (
              <Practice
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
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 26,
          type: "text",
          label: (
            <div>
              Now, let&apos;s add another paragraph to give more info. Use the{" "}
              <CodeHighlight>{"<p>"}</CodeHighlight> tag again.
            </div>
          ),
        },
      ],
    },
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 27,
          type: "text",
          label: (
            <div>
              Arrange this snippet:{" "}
              <CodeHighlight>{"<p>This is additional info.</p>"}</CodeHighlight>
            </div>
          ),
        },
        {
          id: 28,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => {
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
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 29,
          type: "text",
          label: (
            <div>
              Let&apos;s now add a subheading to introduce a new section using
              the <CodeHighlight>{"<h2>"}</CodeHighlight> tag.
            </div>
          ),
        },
      ],
    },
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
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => {
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
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 32,
          type: "text",
          label: (
            <div>
              Sometimes you want to emphasize text. Use the{" "}
              <CodeHighlight>{"<strong>"}</CodeHighlight> tag to make text bold.
            </div>
          ),
        },
      ],
    },
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 33,
          type: "text",
          label: (
            <div>
              Arrange this snippet:{" "}
              <CodeHighlight>{"<strong>Important</strong>"}</CodeHighlight>
            </div>
          ),
        },
        {
          id: 34,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => {
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
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 35,
          type: "text",
          label: (
            <div>
              To italicize text, use the <CodeHighlight>{"<em>"}</CodeHighlight>{" "}
              tag.
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
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => {
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
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 38,
          type: "text",
          label: (
            <div>
              For quotes or excerpts, use the{" "}
              <CodeHighlight>{"<blockquote>"}</CodeHighlight> tag to indent the
              text.
            </div>
          ),
        },
      ],
    },
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
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => {
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
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 41,
          type: "text",
          label: (
            <div>
              When you want to show a snippet of code inline, use the{" "}
              <CodeHighlight>{"<code>"}</CodeHighlight> tag.
            </div>
          ),
        },
      ],
    },
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
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 44,
          type: "text",
          label: (
            <div>
              For blocks of code or preformatted text, use the{" "}
              <CodeHighlight>{"<pre>"}</CodeHighlight> tag.
            </div>
          ),
        },
      ],
    },
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 45,
          type: "text",
          label: (
            <div>
              Arrange this snippet:{" "}
              <CodeHighlight>{"<pre>\n  Code here\n</pre>"}</CodeHighlight>
            </div>
          ),
        },
        {
          id: 46,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => {
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
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => {
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
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 50,
          type: "text",
          label: (
            <div>
              For styling or grouping inline elements, use the{" "}
              <CodeHighlight>{"<span>"}</CodeHighlight> tag.
            </div>
          ),
        },
      ],
    },
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
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => {
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
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 53,
          type: "text",
          label: (
            <div>
              Finally, add a footer at the bottom of your page using the{" "}
              <CodeHighlight>{"<footer>"}</CodeHighlight> tag.
            </div>
          ),
        },
      ],
    },
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
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => {
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
    // {
    //   submit: { label: "Continue" },
    //   content: [
    //     {
    //       id: 58,
    //       type: "text",
    //       label: "Quiz Time! Which tag creates a horizontal line on a webpage?",
    //     },
    //     {
    //       id: 59,
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
    //           title={["Choose the correct tag:"]}
    //           choices={{
    //             options: ["<hr>", "<br>", "<div>", "<footer>"],
    //             answer: "<hr>",
    //           }}
    //           response={{
    //             positive: "Correct! <hr> draws a horizontal line.",
    //             negative: "Oops, try again!",
    //           }}
    //         />
    //       ),
    //     },
    //   ],
    // },
    // {
    //   submit: { label: "Continue" },
    //   content: [
    //     {
    //       id: 60,
    //       type: "text",
    //       label: "Quick Quiz: Which tag is used to insert a line break?",
    //     },
    //     {
    //       id: 61,
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
    //           title={["Select the correct tag:"]}
    //           choices={{
    //             options: ["<br>", "<hr>", "<p>", "<span>"],
    //             answer: "<br>",
    //           }}
    //           response={{
    //             positive: "That's right! <br> adds a line break.",
    //             negative: "Not quite, try again.",
    //           }}
    //         />
    //       ),
    //     },
    //   ],
    // },
    // {
    //   submit: { label: "Continue" },
    //   content: [
    //     {
    //       id: 62,
    //       type: "text",
    //       label: "One more quick quiz: Which tag makes text bold?",
    //     },
    //     {
    //       id: 63,
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
    //           title={["Choose the correct tag:"]}
    //           choices={{
    //             options: ["<strong>", "<em>", "<h1>", "<p>"],
    //             answer: "<strong>",
    //           }}
    //           response={{
    //             positive: "Correct! <strong> bolds the text.",
    //             negative: "Nope, that's not it.",
    //           }}
    //         />
    //       ),
    //     },
    //   ],
    // },
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
};
