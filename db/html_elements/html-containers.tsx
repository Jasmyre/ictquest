import Browser from "@/components/Browser";
import CodeBlock from "@/components/Code";
import CodeHighlight from "@/components/CodeHighlight";
import { DifficultyParagraph } from "@/components/DifficultyParagraph";
import { Practice } from "@/components/Practice";
import { shuffle } from "@/lib/utils";
import { LessonContent } from "../lessons";

export const htmlContainers: LessonContent = {
  title: "HTML Containers & Groups",
  contents: [
    {
      submit: { label: "Continue" },
      content: [
        {
          id: -1,
          type: "element",
          label: (
            <div>
              <p>
                Welcome to our lesson on arranging content with{" "}
                <CodeHighlight>&lt;div&gt;</CodeHighlight> containers!
              </p>
              <br />
              <p>
                In this lesson, we&apos;ll take it step by step as we learn how
                to use <CodeHighlight>&lt;div&gt;</CodeHighlight> to group and
                organize your webpage content. Let&apos;s begin our lesson!
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
          id: 0,
          type: "element",
          label: (
            <div>
              Step 1: Here is an example of a basic HTML structure without
              grouping:
            </div>
          ),
        },
        {
          id: 2,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<h1>My First Title</h1>
<h2>My first sub title</h2>
<p>My first paragraph.</p>

<br />

<h1>My Second Title</h1>
<h2>My second sub title</h2>
<p>My second paragraph.</p>`}
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
          id: 0,
          type: "element",
          label: (
            <div>
              Although the above code works, it can get messy. Let&apos;s see a
              browser preview:
            </div>
          ),
        },
        {
          id: 3,
          type: "element",
          label: (
            <Browser
              content={`<h1>My First Title</h1>
<h2>My first sub title</h2>
<p>My first paragraph.</p>

<br />

<h1>My Second Title</h1>
<h2>My second sub title</h2>
<p>My second paragraph.</p>`}
              title="Browser Preview"
            />
          ),
        },
        {
          id: 1,
          type: "element",
          label: (
            <div>
              It&apos;s generally better to group related elements for a more
              organized structure.
            </div>
          ),
        },
      ],
    },
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 0,
          type: "element",
          label: (
            <div>
              Let&apos;s group the related elements. Transform the previous code
              into grouped blocks:
            </div>
          ),
        },
        {
          id: 2,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<h1>My First Title</h1>
<h2>My first sub title</h2>
<p>My first paragraph.</p>

<br />

<h1>My Second Title</h1>
<h2>My second sub title</h2>
<p>My second paragraph.</p>`}
              initialCode={["", ""]}
            />
          ),
        },
        {
          id: 3,
          type: "element",
          label: <div>Now, group them like this:</div>,
        },
        {
          id: 4,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<div>
  <h1>My First Title</h1>
  <h2>My first sub title</h2>
  <p>My first paragraph.</p>
</div>

<br />

<div>
  <h1>My Second Title</h1>
  <h2>My second sub title</h2>
  <p>My second paragraph.</p>
</div>`}
              initialCode={["", ""]}
            />
          ),
        },
        {
          id: 5,
          type: "element",
          label: (
            <div>
              Notice that by wrapping the content in{" "}
              <CodeHighlight>&lt;div&gt;</CodeHighlight> tags, the structure
              becomes more organized.
            </div>
          ),
        },
      ],
    },
    {
      submit: { label: "Practice" },
      content: [
        {
          id: 5,
          type: "element",
          label: (
            <DifficultyParagraph difficulty="hard" color="red">
              Quick test: Arrange the code for the first group correctly.
            </DifficultyParagraph>
          ),
        },
        {
          id: 6,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => {
            const choices = {
              options: [
                { label: `<div>\n`, priority: 0 },
                { label: `  <h1>My First Title</h1>\n`, priority: 1 },
                { label: `  <h2>My first sub title</h2>\n`, priority: 1 },
                { label: `  <p>My first paragraph.</p>\n`, priority: 1 },
                { label: `</div>`, priority: 2 },
              ],
              answer: `<div>\n  <h1>My First Title</h1>\n  <h2>My first sub title</h2>\n  <p>My first paragraph.</p>\n</div>`,
              initialCode: ["", ""],
            };
            const shuffledData = shuffle(choices.options);
            return (
              <Practice
              setNumberOfCorrectAction={setNumberOfCorrect}
              setNumberOfInCorrectAction={setNumberOfInCorrect}
                setIsFinishedAction={setIsFinished}
                choices={choices}
                shuffledData={shuffledData}
                title={["Can you arrange the code for the first group?"]}
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
    {
      submit: { label: "Practice" },
      content: [
        {
          id: 5,
          type: "element",
          label: (
            <DifficultyParagraph difficulty="hard" color="red">
              Another test: Arrange the code for the second group correctly.
            </DifficultyParagraph>
          ),
        },
        {
          id: 7,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => {
            const choices = {
              options: [
                { label: `<div>\n`, priority: 0 },
                { label: `  <h1>My Second Title</h1>\n`, priority: 1 },
                {
                  label: `  <h2>My second sub title</h2>\n`,
                  priority: 2,
                },
                { label: `  <p>My second paragraph.</p>\n`, priority: 3 },
                { label: `</div>`, priority: 4 },
              ],
              answer: `<div>\n  <h1>My Second Title</h1>\n  <h2>My second sub title</h2>\n  <p>My second paragraph.</p>\n</div>`,
              initialCode: [
                `<div>\n  <h1>My First Title</h1>\n  <h2>My first sub title</h2>\n  <p>My first paragraph.</p>\n</div>\n\n<br/>\n\n`,
                "",
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
                title={["Can you arrange the code for the second group?"]}
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
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 8,
          type: "element",
          label: (
            <div>
              Grouping your elements with{" "}
              <CodeHighlight>&lt;div&gt;</CodeHighlight> not only organizes your
              code, but also makes it easier to style with CSS later on.
            </div>
          ),
        },
      ],
    },
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 9,
          type: "element",
          label: (
            <div>
              Here&apos;s another example with multiple groups. Notice the
              separation between different content blocks:
            </div>
          ),
        },
        {
          id: 10,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<div>
  <h1>Group One Title</h1>
  <p>Content for group one.</p>
</div>

<br />

<div>
  <h1>Group Two Title</h1>
  <p>Content for group two.</p>
</div>`}
              initialCode={["", ""]}
            />
          ),
        },
      ],
    },
    {
      submit: { label: "Practice" },
      content: [
        {
          id: 11,
          type: "element",
          label: (
            <DifficultyParagraph difficulty="very hard" color="red">
              Quick test: Arrange the grouped sections correctly.
            </DifficultyParagraph>
          ),
        },
        {
          id: 12,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => {
            const choices = {
              options: [
                { label: `<div>\n`, priority: 0 },
                { label: `  <h1>Group One Title</h1>\n`, priority: 1 },
                {
                  label: `  <p>Content for group one.</p>\n`,
                  priority: 2,
                },
                { label: `</div>\n`, priority: 3 },
                { label: `<div>\n`, priority: 4 },
                { label: `  <h1>Group Two Title</h1>\n`, priority: 5 },
                {
                  label: `  <p>Content for group two.</p>\n`,
                  priority: 6,
                },
                { label: `</div>\n`, priority: 7 },
              ],
              answer: `<div>\n  <h1>Group One Title</h1>\n  <p>Content for group one.</p>\n</div>\n<div>\n  <h1>Group Two Title</h1>\n  <p>Content for group two.</p>\n</div>\n`,
              initialCode: ["", ""],
            };
            const shuffledData = shuffle(choices.options);
            return (
              <Practice
                setNumberOfCorrectAction={setNumberOfCorrect}
                setNumberOfInCorrectAction={setNumberOfInCorrect}
                setIsFinishedAction={setIsFinished}
                choices={choices}
                shuffledData={shuffledData}
                title={["Arrange the grouped sections correctly"]}
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
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 13,
          type: "element",
          label: (
            <div>
              Let&apos;s group an image with its caption using a{" "}
              <CodeHighlight>&lt;div&gt;</CodeHighlight>.
            </div>
          ),
        },
        {
          id: 14,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<div>
  <img src="/img.png" alt="A sample image" />
  <p>Image Caption</p>
</div>`}
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
          id: 13,
          type: "element",
          label: (
            <div>
              Let&apos;s group an image with its caption using a{" "}
              <CodeHighlight>&lt;div&gt;</CodeHighlight>.
            </div>
          ),
        },
        {
          id: 14,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<div>
  <img src="/img.png" alt="A sample image" />
  <p>Image Caption</p>
</div>`}
              initialCode={["", ""]}
            />
          ),
        },
        {
          id: 15,
          type: "element",
          label: (
            <Browser
              content={`<div>
  <img src="/img.png" alt="A sample image" />
  <p>Image Caption</p>
</div>`}
              title="Preview Image Container"
            />
          ),
        },
      ],
    },
    {
      submit: { label: "Practice" },
      content: [
        {
          id: 16,
          type: "element",
          label: (
            <DifficultyParagraph difficulty="super easy" color="green">
              Test: Arrange the image container code correctly.
            </DifficultyParagraph>
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
                { label: `<div>\n`, priority: 0 },
                {
                  label: `  <img src="/img.png" alt="A sample image" />\n`,
                  priority: 1,
                },
                { label: `  <p>Image Caption</p>\n`, priority: 2 },
                { label: `</div>`, priority: 3 },
              ],
              answer: `<div>\n  <img src="/img.png" alt="A sample image" />\n  <p>Image Caption</p>\n</div>`,
              initialCode: ["", ""],
            };
            const shuffledData = shuffle(choices.options);
            return (
              <Practice
                setNumberOfCorrectAction={setNumberOfCorrect}
                setNumberOfInCorrectAction={setNumberOfInCorrect}
                setIsFinishedAction={setIsFinished}
                choices={choices}
                shuffledData={shuffledData}
                title={["Arrange the image container in the correct order"]}
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
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 18,
          type: "element",
          label: (
            <div>
              <p>
                Now, let&apos;s create a basic page layout with nested{" "}
                <CodeHighlight>&lt;div&gt;</CodeHighlight> containers for the
                header, main content, and footer.
              </p>
              <br />
              <p>
                The <CodeHighlight>{"class"}</CodeHighlight> attribute is used
                to name an element (an element could have more than one class).
              </p>
            </div>
          ),
        },
        {
          id: 19,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<div class="page">
  <div class="header">
    <h1>Site Title</h1>
  </div>
  <div class="main">
    <p>Main content goes here.</p>
  </div>
  <div class="footer">
    <p>Footer information.</p>
  </div>
</div>`}
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
          id: 18,
          type: "element",
          label: (
            <div>
              <p>
                Now, let&apos;s create a basic page layout with nested{" "}
                <CodeHighlight>&lt;div&gt;</CodeHighlight> containers for the
                header, main content, and footer.
              </p>
              <br />
              <p>
                The <CodeHighlight>{"class"}</CodeHighlight> attribute is used
                to name an element (an element could have more than one class).
              </p>
            </div>
          ),
        },
        {
          id: 19,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<div class="page">
  <div class="header">
    <h1>Site Title</h1>
  </div>
  <div class="main">
    <p>Main content goes here.</p>
  </div>
  <div class="footer">
    <p>Footer information.</p>
  </div>
</div>`}
              initialCode={["", ""]}
            />
          ),
        },
        {
          id: 20,
          type: "element",
          label: (
            <Browser
              content={`<div class="page">
  <div class="header">
    <h1>Site Title</h1>
  </div>
  <div class="main">
    <p>Main content goes here.</p>
  </div>
  <div class="footer">
    <p>Footer information.</p>
  </div>
</div>`}
              title="Preview Page Layout"
            />
          ),
        },
      ],
    },
    {
      submit: { label: "Practice" },
      content: [
        {
          id: 21,
          type: "element",
          label: (
            <DifficultyParagraph difficulty="very hard" color="red">
              Test: Arrange the nested page layout code correctly.
            </DifficultyParagraph>
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
              options: [
                { label: `<div class="page">\n`, priority: 0 },
                { label: `  <div class="header">\n`, priority: 1 },
                { label: `    <h1>Site Title</h1>\n`, priority: 2 },
                { label: `  </div>\n`, priority: 3 },
                { label: `  <div class="main">\n`, priority: 4 },
                {
                  label: `    <p>Main content goes here.</p>\n`,
                  priority: 5,
                },
                { label: `  </div>\n`, priority: 6 },
                { label: `  <div class="footer">\n`, priority: 7 },
                {
                  label: `    <p>Footer information.</p>\n`,
                  priority: 8,
                },
                { label: `  </div>\n`, priority: 9 },
                { label: `</div>`, priority: 10 },
              ],
              answer: `<div class="page">\n  <div class="header">\n    <h1>Site Title</h1>\n  </div>\n  <div class="main">\n    <p>Main content goes here.</p>\n  </div>\n  <div class="footer">\n    <p>Footer information.</p>\n  </div>\n</div>`,
              initialCode: ["", ""],
            };
            const shuffledData = shuffle(choices.options);
            return (
              <Practice
                setNumberOfCorrectAction={setNumberOfCorrect}
                setNumberOfInCorrectAction={setNumberOfInCorrect}
                setIsFinishedAction={setIsFinished}
                choices={choices}
                shuffledData={shuffledData}
                title={["Arrange the nested page layout code correctly"]}
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
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 28,
          type: "element",
          label: (
            <div>
              Great work! We&apos;ve learned how to use{" "}
              <CodeHighlight>&lt;div&gt;</CodeHighlight> containers to group and
              organize content, arrange images, and build page layouts.
            </div>
          ),
        },
        {
          id: 29,
          type: "element",
          label: (
            <div>
              Remember, grouping your content makes your HTML structure cleaner
              and easier to manage.
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
          type: "element",
          label: (
            <div>
              Congratulations! You have completed the lesson on arranging
              content with <CodeHighlight>&lt;div&gt;</CodeHighlight>{" "}
              containers. In the next lesson, we&apos;ll dive into HTML medias
              such as images, videos, and iframe.
            </div>
          ),
        },
      ],
    },
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 31,
          type: "element",
          label: (
            <div>
              <p>
                Review: Let&apos;s quickly recap what we learned about grouping
                content with <CodeHighlight>&lt;div&gt;</CodeHighlight>{" "}
                containers.
              </p>
              <br />
              <ul>
                <li>Basic structure without grouping can be messy.</li>
                <li>Grouping elements improves organization.</li>
                <li>You can nest containers for more complex layouts.</li>
              </ul>
            </div>
          ),
        },
      ],
    },
    {
      submit: { label: "Practice" },
      content: [
        {
          id: 32,
          type: "element",
          label: (
            <DifficultyParagraph difficulty="very hard" color="red">
              Advanced test: Arrange the complete grouped layout code including
              a header, sidebar, main content, and footer.
            </DifficultyParagraph>
          ),
        },
        {
          id: 33,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => {
            const choices = {
              options: [
                { label: `<div class="page">\n`, priority: 0 },
                { label: `  <div class="header">\n`, priority: 1 },
                { label: `    <h1>Site Title</h1>\n`, priority: 2 },
                { label: `  </div>\n`, priority: 3 },
                { label: `  <div class="sidebar">\n`, priority: 4 },
                { label: `    <p>Sidebar content.</p>\n`, priority: 5 },
                { label: `  </div>\n`, priority: 6 },
                { label: `  <div class="main">\n`, priority: 7 },
                {
                  label: `    <p>Main content goes here.</p>\n`,
                  priority: 8,
                },
                { label: `  </div>\n`, priority: 9 },
                { label: `  <div class="footer">\n`, priority: 10 },
                {
                  label: `    <p>Footer information.</p>\n`,
                  priority: 11,
                },
                { label: `  </div>\n`, priority: 12 },
                { label: `</div>`, priority: 13 },
              ],
              answer: `<div class="page">\n  <div class="header">\n    <h1>Site Title</h1>\n  </div>\n  <div class="sidebar">\n    <p>Sidebar content.</p>\n  </div>\n  <div class="main">\n    <p>Main content goes here.</p>\n  </div>\n  <div class="footer">\n    <p>Footer information.</p>\n  </div>\n</div>`,
              initialCode: ["", ""],
            };
            const shuffledData = shuffle(choices.options);
            return (
              <Practice
                setNumberOfCorrectAction={setNumberOfCorrect}
                setNumberOfInCorrectAction={setNumberOfInCorrect}
                setIsFinishedAction={setIsFinished}
                choices={choices}
                shuffledData={shuffledData}
                title={["Arrange the complete grouped layout code correctly"]}
                initialCode={choices.initialCode}
                response={{
                  positive: "Excellent work!",
                  negative: "That’s not quite right. Try again!",
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
          id: 34,
          type: "element",
          label: (
            <div>
              <p>
                Final Thoughts: You have mastered grouping content with{" "}
                <CodeHighlight>&lt;div&gt;</CodeHighlight> containers.
              </p>
              <br />
              <p>
                Keep practicing to reinforce these concepts, as a well-organized
                HTML structure is key to efficient web development.
              </p>
            </div>
          ),
        },
      ],
    },
  ],
};