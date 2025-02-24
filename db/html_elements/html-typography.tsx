import Browser from "@/components/Browser";
import CodeBlock from "@/components/Code";
import CodeHighlight from "@/components/CodeHighlight";
import { DifficultyParagraph } from "@/components/DifficultyParagraph";
import { MultipleChoice } from "@/components/MultipleChoice";
import { Practice } from "@/components/Practice";
import { shuffle } from "@/lib/utils";
import { LessonContent } from "../lessons";

export const htmlTypography: LessonContent = {
  title: "HTML Typography",
  contents: [
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 0,
          type: "element",
          label: (
            <div>
              Welcome to the HTML Typography lesson! <br /> <br /> In this
              lesson, we&apos;ll cover various text formatting tags including{" "}
              <CodeHighlight>&lt;h1&gt;</CodeHighlight> to{" "}
              <CodeHighlight>&lt;h6&gt;</CodeHighlight>,{" "}
              <CodeHighlight>&lt;p&gt;</CodeHighlight>,{" "}
              <CodeHighlight>&lt;strong&gt;</CodeHighlight>,{" "}
              <CodeHighlight>&lt;em&gt;</CodeHighlight>,{" "}
              <CodeHighlight>&lt;mark&gt;</CodeHighlight>,{" "}
              <CodeHighlight>&lt;code&gt;</CodeHighlight>,{" "}
              <CodeHighlight>&lt;small&gt;</CodeHighlight>,{" "}
              <CodeHighlight>&lt;abbr&gt;</CodeHighlight>,{" "}
              <CodeHighlight>&lt;cite&gt;</CodeHighlight>,{" "}
              <CodeHighlight>&lt;address&gt;</CodeHighlight>, and more.
              Let&apos;s get started!,
            </div>
          ),
        },
      ],
    },
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 1,
          type: "element",
          label: (
            <div>
              Lets start with headings. Headings help structure your document.
              Use <CodeHighlight>&lt;h1&gt;</CodeHighlight> for the main title,
              and <CodeHighlight>&lt;h2&gt;</CodeHighlight> to{" "}
              <CodeHighlight>&lt;h6&gt;</CodeHighlight> for subheadings.
            </div>
          ),
        },
        {
          id: 2,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<h1>Main Title</h1>
<h2>Subheading</h2>
<h3>Section Title</h3>`}
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
          id: 1,
          type: "element",
          label: (
            <div>
              Lets start with headings. Headings help structure your document.
              Use <CodeHighlight>&lt;h1&gt;</CodeHighlight> for the main title,
              and <CodeHighlight>&lt;h2&gt;</CodeHighlight> to{" "}
              <CodeHighlight>&lt;h6&gt;</CodeHighlight> for subheadings.
            </div>
          ),
        },
        {
          id: 2,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<h1>Main Title</h1>
<h2>Subheading</h2>
<h3>Section Title</h3>`}
              initialCode={["", ""]}
            />
          ),
        },
        {
          id: 3,
          type: "element",
          label: (
            <Browser
              content={`<h1>Main Title</h1>
<h2>Subheading</h2>
<h3>Section Title</h3>`}
              title="Preview Headings"
            />
          ),
        },
        {
          id: 4,
          type: "element",
          label: (
            <div>
              <p>
                Notice how <CodeHighlight>&lt;h1&gt;</CodeHighlight> is used for
                the main title while lower heading tags represent sublevels.
              </p>
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
            <DifficultyParagraph difficulty="easy" color="green">
              Quick test.
            </DifficultyParagraph>
          ),
        },
        {
          id: 6,
          type: "element",
          label: ({ setIsFinished }) => {
            const choices = {
              options: [
                { label: "<h1>Main Title</h1>\n", priority: 0 },
                { label: "<h2>Subheading</h2>\n", priority: 1 },
                { label: "<h3>Section Title</h3>", priority: 2 },
              ],
              answer: `<h1>Main Title</h1>\n<h2>Subheading</h2>\n<h3>Section Title</h3>`,
              initialCode: ["", ""],
            };
            const shuffledData = shuffle(choices.options);
            return (
              <Practice
                setIsFinishedAction={setIsFinished}
                choices={choices}
                shuffledData={shuffledData}
                title={["Arrange the heading elements in the correct order"]}
                initialCode={choices.initialCode}
                response={{
                  positive: "Great job!",
                  negative: "That's not quite right. Try again!",
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
          id: 7,
          type: "element",
          label: (
            <div>
              Paragraphs are used to contain blocks of text. The{" "}
              <CodeHighlight>&lt;p&gt;</CodeHighlight> tag defines a paragraph.
            </div>
          ),
        },
        {
          id: 8,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<p>This is a sample paragraph of text.</p>`}
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
          id: 7,
          type: "text",
          label: (
            <div>
              Paragraphs are used to contain blocks of text. The{" "}
              <CodeHighlight>&lt;p&gt;</CodeHighlight> tag defines a paragraph.
            </div>
          ),
        },
        {
          id: 8,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<p>This is a sample paragraph of text.</p>`}
              initialCode={["", ""]}
            />
          ),
        },
        {
          id: 9,
          type: "element",
          label: (
            <Browser
              content={`<p>This is a sample paragraph of text.</p>`}
              title="Preview Paragraph"
            />
          ),
        },
      ],
    },
    {
      submit: { label: "Practice" },
      content: [
        {
          id: 10,
          type: "element",
          label: (
            <DifficultyParagraph difficulty="easy" color="green">
              Another quick test.
            </DifficultyParagraph>
          ),
        },
        {
          id: 11,
          type: "element",
          label: ({ setIsFinished }) => {
            const choices = {
              options: [
                { label: "<p>", priority: 0 },
                {
                  label: "This is a sample paragraph of text.",
                  priority: 1,
                },
                { label: "</p>", priority: 2 },
              ],
              answer: `<p>This is a sample paragraph of text.</p>`,
              initialCode: ["", ""],
            };
            const shuffledData = shuffle(choices.options);
            return (
              <Practice
                setIsFinishedAction={setIsFinished}
                choices={choices}
                shuffledData={shuffledData}
                title={["Arrange the paragraph element in the correct order"]}
                initialCode={choices.initialCode}
                response={{
                  positive: "Well done!",
                  negative: "That's not correct, try again!",
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
          id: 12,
          type: "element",
          label: (
            <div>
              Blockquotes are used to denote quoted text. They are defined with
              the <CodeHighlight>&lt;blockquote&gt;</CodeHighlight> tag.
            </div>
          ),
        },
        {
          id: 13,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<blockquote>"To be or not to be, that is the question."</blockquote>`}
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
          id: 12,
          type: "element",
          label: (
            <div>
              Blockquotes are used to denote quoted text. They are defined with
              the <CodeHighlight>&lt;blockquote&gt;</CodeHighlight> tag.
            </div>
          ),
        },
        {
          id: 13,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<blockquote>"To be or not to be, that is the question."</blockquote>`}
              initialCode={["", ""]}
            />
          ),
        },
        {
          id: 14,
          type: "element",
          label: (
            <Browser
              content={`<blockquote>
  "To be or not to be, that is the question."
</blockquote>`}
              title="Preview Blockquote"
            />
          ),
        },
      ],
    },
    {
      submit: { label: "Practice" },
      content: [
        {
          id: 15,
          type: "element",
          label: (
            <DifficultyParagraph difficulty="easy" color="green">
              Can you arrange the code bellow?
            </DifficultyParagraph>
          ),
        },
        {
          id: 16,
          type: "element",
          label: ({ setIsFinished }) => {
            const choices = {
              options: [
                { label: "<blockquote>", priority: 0 },
                {
                  label: '"To be or not to be, that is the question."',
                  priority: 1,
                },
                { label: "</blockquote>", priority: 2 },
              ],
              answer: `<blockquote>"To be or not to be, that is the question."</blockquote>`,
              initialCode: ["", ""],
            };
            const shuffledData = shuffle(choices.options);
            return (
              <Practice
                setIsFinishedAction={setIsFinished}
                choices={choices}
                shuffledData={shuffledData}
                title={["Arrange the blockquote element in the correct order"]}
                initialCode={choices.initialCode}
                response={{
                  positive: "Correct!",
                  negative: "That's not quite right, try again!",
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
          id: 17,
          type: "element",
          label: (
            <div>
              The <CodeHighlight>&lt;strong&gt;</CodeHighlight> tag is used to
              indicate strong importance, typically rendered in bold.
            </div>
          ),
        },
        {
          id: 18,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<p>This is <strong>important</strong> text.</p>`}
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
          id: 17,
          type: "element",
          label: (
            <div>
              The <CodeHighlight>&lt;strong&gt;</CodeHighlight> tag is used to
              indicate strong importance, typically rendered in bold.
            </div>
          ),
        },
        {
          id: 18,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<p>This is <strong>important</strong> text.</p>`}
              initialCode={["", ""]}
            />
          ),
        },
        {
          id: 19,
          type: "element",
          label: (
            <Browser
              content={`<p>This is <strong>important</strong> text.</p>`}
              title="Preview <strong>"
            />
          ),
        },
      ],
    },
    {
      submit: { label: "Practice" },
      content: [
        {
          id: 20,
          type: "element",
          label: (
            <DifficultyParagraph difficulty="easy" color="green">
              Quick test: Arrange the &lt;strong&gt; element in the correct
              order.
            </DifficultyParagraph>
          ),
        },
        {
          id: 21,
          type: "element",
          label: ({ setIsFinished }) => {
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
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 22,
          type: "element",
          label: (
            <div>
              The <CodeHighlight>&lt;em&gt;</CodeHighlight> tag is used to
              emphasize text, typically rendered in italics.
            </div>
          ),
        },
        {
          id: 23,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<p>This is <em>emphasized</em> text.</p>`}
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
          id: 22,
          type: "element",
          label: (
            <div>
              The <CodeHighlight>&lt;em&gt;</CodeHighlight> tag is used to
              emphasize text, typically rendered in italics.
            </div>
          ),
        },
        {
          id: 23,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<p>This is <em>emphasized</em> text.</p>`}
              initialCode={["", ""]}
            />
          ),
        },
        {
          id: 24,
          type: "element",
          label: (
            <Browser
              content={`<p>This is <em>emphasized</em> text.</p>`}
              title="Preview <em>"
            />
          ),
        },
      ],
    },
    {
      submit: { label: "Practice" },
      content: [
        {
          id: 25,
          type: "element",
          label: (
            <DifficultyParagraph difficulty="easy" color="green">
              Quick test: Arrange the &lt;em&gt; element in the correct order.
            </DifficultyParagraph>
          ),
        },
        {
          id: 26,
          type: "element",
          label: ({ setIsFinished }) => {
            const choices = {
              options: [
                { label: "<em>", priority: 0 },
                { label: "emphasized", priority: 1 },
                { label: "</em>", priority: 2 },
              ],
              answer: `<em>emphasized</em>`,
              initialCode: ["", ""],
            };
            const shuffledData = shuffle(choices.options);
            return (
              <Practice
                setIsFinishedAction={setIsFinished}
                choices={choices}
                shuffledData={shuffledData}
                title={["Arrange the <em> element in the correct order"]}
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
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 27,
          type: "element",
          label: (
            <div>
              The <CodeHighlight>&lt;mark&gt;</CodeHighlight> tag is used to
              highlight text.
            </div>
          ),
        },
        {
          id: 28,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<p>This is <mark>highlighted</mark> text.</p>`}
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
          id: 27,
          type: "element",
          label: (
            <div>
              The <CodeHighlight>&lt;mark&gt;</CodeHighlight> tag is used to
              highlight text.
            </div>
          ),
        },
        {
          id: 28,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<p>This is <mark>highlighted</mark> text.</p>`}
              initialCode={["", ""]}
            />
          ),
        },
        {
          id: 29,
          type: "element",
          label: (
            <Browser
              content={`<p>This is <mark>highlighted</mark> text.</p>`}
              title="Preview <mark>"
            />
          ),
        },
      ],
    },
    {
      submit: { label: "Practice" },
      content: [
        {
          id: 30,
          type: "element",
          label: (
            <DifficultyParagraph difficulty="easy" color="green">
              Quick test: Arrange the &lt;mark&gt; element in the correct order.
            </DifficultyParagraph>
          ),
        },
        {
          id: 31,
          type: "element",
          label: ({ setIsFinished }) => {
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
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 32,
          type: "element",
          label: (
            <div>
              The <CodeHighlight>&lt;code&gt;</CodeHighlight> tag is used to
              denote inline code snippets.
            </div>
          ),
        },
        {
          id: 33,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<p>Use <code>const x = 10;</code> to declare a variable.</p>`}
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
          id: 32,
          type: "element",
          label: (
            <div>
              The <CodeHighlight>&lt;code&gt;</CodeHighlight> tag is used to
              denote inline code snippets.
            </div>
          ),
        },
        {
          id: 33,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<p>Use <code>const x = 10;</code> to declare a variable.</p>`}
              initialCode={["", ""]}
            />
          ),
        },
        {
          id: 34,
          type: "element",
          label: (
            <Browser
              content={`<p>Use <code>const x = 10;</code> to declare a variable.</p>`}
              title="Preview <code>"
            />
          ),
        },
      ],
    },
    {
      submit: { label: "Practice" },
      content: [
        {
          id: 35,
          type: "element",
          label: (
            <DifficultyParagraph difficulty="easy" color="green">
              Quick test: Arrange the &lt;code&gt; element in the correct order.
            </DifficultyParagraph>
          ),
        },
        {
          id: 36,
          type: "element",
          label: ({ setIsFinished }) => {
            const choices = {
              options: [
                { label: "<code>", priority: 0 },
                { label: "const x = 10;", priority: 1 },
                { label: "</code>", priority: 2 },
              ],
              answer: `<code>const x = 10;</code>`,
              initialCode: ["", ""],
            };
            const shuffledData = shuffle(choices.options);
            return (
              <Practice
                setIsFinishedAction={setIsFinished}
                choices={choices}
                shuffledData={shuffledData}
                title={["Arrange the <code> element in the correct order"]}
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
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 37,
          type: "element",
          label: (
            <div>
              The <CodeHighlight>&lt;small&gt;</CodeHighlight> tag is used to
              display text in a smaller size.
            </div>
          ),
        },
        {
          id: 38,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<p>This is <small>small text</small>.</p>`}
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
          id: 37,
          type: "element",
          label: (
            <div>
              The <CodeHighlight>&lt;small&gt;</CodeHighlight> tag is used to
              display text in a smaller size.
            </div>
          ),
        },
        {
          id: 38,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<p>This is <small>small text</small>.</p>`}
              initialCode={["", ""]}
            />
          ),
        },
        {
          id: 39,
          type: "element",
          label: (
            <Browser
              content={`<p>This is <small>small text</small>.</p>`}
              title="Preview <small>"
            />
          ),
        },
      ],
    },
    {
      submit: { label: "Practice" },
      content: [
        {
          id: 40,
          type: "element",
          label: (
            <DifficultyParagraph difficulty="easy" color="green">
              Quick test: Arrange the &lt;small&gt; element in the correct
              order.
            </DifficultyParagraph>
          ),
        },
        {
          id: 41,
          type: "element",
          label: ({ setIsFinished }) => {
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
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 42,
          type: "element",
          label: (
            <div>
              The <CodeHighlight>&lt;abbr&gt;</CodeHighlight> tag is used to
              provide an abbreviation with its hoverable expanded form.
            </div>
          ),
        },
        {
          id: 43,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<p>An <abbr title="World Health Organization">WHO</abbr> member.</p>`}
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
          id: 42,
          type: "element",
          label: (
            <div>
              The <CodeHighlight>&lt;abbr&gt;</CodeHighlight> tag is used to
              provide an abbreviation with its hoverable expanded form.
            </div>
          ),
        },
        {
          id: 43,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<p>An <abbr title="World Health Organization">WHO</abbr> member.</p>`}
              initialCode={["", ""]}
            />
          ),
        },
        {
          id: 44,
          type: "element",
          label: (
            <Browser
              content={`<p>An <abbr title="World Health Organization">WHO</abbr> member.</p>`}
              title="Preview <abbr>"
            />
          ),
        },
      ],
    },
    {
      submit: { label: "Practice" },
      content: [
        {
          id: 45,
          type: "element",
          label: (
            <DifficultyParagraph difficulty="easy" color="green">
              Quick test: Arrange the &lt;abbr&gt; element in the correct order.
            </DifficultyParagraph>
          ),
        },
        {
          id: 46,
          type: "element",
          label: ({ setIsFinished }) => {
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
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 47,
          type: "element",
          label: (
            <div>
              The <CodeHighlight>&lt;cite&gt;</CodeHighlight> tag is used to
              represent the title of a work, such as a book, report, or article.
            </div>
          ),
        },
        {
          id: 48,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<p><cite>Reference Title</cite></p>`}
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
          id: 47,
          type: "element",
          label: (
            <div>
              The <CodeHighlight>&lt;cite&gt;</CodeHighlight> tag is used to
              represent the title of a work, such as a book, report, or article.
            </div>
          ),
        },
        {
          id: 48,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<p><cite>Reference Title</cite></p>`}
              initialCode={["", ""]}
            />
          ),
        },
        {
          id: 49,
          type: "element",
          label: (
            <Browser
              content={`<p><cite>Reference Title</cite></p>`}
              title="Preview <cite>"
            />
          ),
        },
      ],
    },
    {
      submit: { label: "Practice" },
      content: [
        {
          id: 50,
          type: "element",
          label: (
            <DifficultyParagraph difficulty="easy" color="green">
              Quick test: Arrange the &lt;cite&gt; element in the correct order.
            </DifficultyParagraph>
          ),
        },
        {
          id: 51,
          type: "element",
          label: ({ setIsFinished }) => {
            const choices = {
              options: [
                { label: "<cite>", priority: 0 },
                { label: "Reference Title", priority: 1 },
                { label: "</cite>", priority: 2 },
              ],
              answer: `<cite>Reference Title</cite>`,
              initialCode: ["", ""],
            };
            const shuffledData = shuffle(choices.options);
            return (
              <Practice
                setIsFinishedAction={setIsFinished}
                choices={choices}
                shuffledData={shuffledData}
                title={["Arrange the <cite> element in the correct order"]}
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
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 27,
          type: "element",
          label: (
            <div>
              The <CodeHighlight>{"<address>"}</CodeHighlight> tag is used for
              contact information.
            </div>
          ),
        },
        {
          id: 28,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<address>
  Written by Jane Doe.<br>
  Email: <a href="mailto:jane@example.com">jane@example.com</a>
</address>`}
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
          id: 27,
          type: "text",
          label: (
            <div>
              The <CodeHighlight>{"<address>"}</CodeHighlight> tag is used for
              contact information.
            </div>
          ),
        },
        {
          id: 28,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<address>
  Written by Jane Doe.<br>
  Email: <a href="mailto:jane@example.com">jane@example.com</a>
</address>`}
              initialCode={["", ""]}
            />
          ),
        },
        {
          id: 29,
          type: "element",
          label: (
            <Browser
              content={`<address>
  Written by Jane Doe.<br>
  Email: <a href="mailto:jane@example.com">jane@example.com</a>
</address>`}
              title="Preview Address"
            />
          ),
        },
      ],
    },
    {
      submit: { label: "Practice" },
      content: [
        {
          id: 30,
          type: "element",
          label: (
            <DifficultyParagraph difficulty="intermediate" color="orange">
              Did you read the last page?
            </DifficultyParagraph>
          ),
        },
        {
          id: 31,
          type: "element",
          label: ({ setIsFinished }) => {
            const choices = {
              options: [
                { label: "<address>\n", priority: 0 },
                { label: "  Written by Jane Doe.<br>\n", priority: 1 },
                {
                  label:
                    '  Email: <a href="mailto:jane@example.com">jane@example.com</a>\n',
                  priority: 2,
                },
                { label: "</address>", priority: 3 },
              ],
              answer: `<address>\n  Written by Jane Doe.<br>\n  Email: <a href="mailto:jane@example.com">jane@example.com</a>\n</address>`,
              initialCode: ["", ""],
            };
            const shuffledData = shuffle(choices.options);
            return (
              <Practice
                setIsFinishedAction={setIsFinished}
                choices={choices}
                shuffledData={shuffledData}
                title={["Arrange the address element in the correct order"]}
                initialCode={choices.initialCode}
                response={{
                  positive: "Great job!",
                  negative: "That's not correct, try again!",
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
          id: 32,
          type: "text",
          label: "Final Quiz: Let's test your knowledge on HTML Typography!",
        },
        {
          id: 33,
          type: "element",
          label: (
            <MultipleChoice
              setIsFinishedAction={() => {}}
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
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 32,
          type: "text",
          label: "Final Quiz: Let's test your knowledge on HTML Typography!",
        },
        {
          id: 53,
          type: "element",
          label: (
            <MultipleChoice
              setIsFinishedAction={() => {}}
              title={["Which tag is used to indicate strong importance?"]}
              choices={{
                options: ["<strong>", "<em>", "<mark>", "<code>"],
                answer: "<strong>",
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
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 32,
          type: "text",
          label: "Final Quiz: Let's test your knowledge on HTML Typography!",
        },
        {
          id: 54,
          type: "element",
          label: (
            <MultipleChoice
              setIsFinishedAction={() => {}}
              title={["Which tag is used for inline code snippets?"]}
              choices={{
                options: ["<code>", "<small>", "<abbr>", "<cite>"],
                answer: "<code>",
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
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 32,
          type: "text",
          label: "Final Quiz: Let's test your knowledge on HTML Typography!",
        },
        {
          id: 55,
          type: "element",
          label: (
            <MultipleChoice
              setIsFinishedAction={() => {}}
              title={["Which tag is used for abbreviations with a tooltip?"]}
              choices={{
                options: ["<abbr>", "<mark>", "<small>", "<cite>"],
                answer: "<abbr>",
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
  ],
};