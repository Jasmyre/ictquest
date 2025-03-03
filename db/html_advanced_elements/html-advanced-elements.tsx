import Browser from "@/components/Browser";
import CodeBlock from "@/components/Code";
import CodeHighlight from "@/components/CodeHighlight";
import { DifficultyParagraph } from "@/components/DifficultyParagraph";
import { Practice } from "@/components/Practice";
import { shuffle } from "@/lib/utils";
import { LessonContent } from "../lessons";

export const htmlAdvancedElements: LessonContent = {
  title: "HTML Advanced Elements",
  contents: [
    {
      submit: { label: "Continue" },
      content: [
        {
          id: -1,
          type: "element",
          label: (
            <div>
              <p>Welcome to our lesson on HTML Advanced Elements!</p>
              <br />
              <p>
                In this lesson, we&apos;ll explore a set of interactive elements
                that can enhance your forms and user interfaces. We&apos;ll
                cover dropdown menus with{" "}
                <CodeHighlight>&lt;select&gt;</CodeHighlight> and{" "}
                <CodeHighlight>&lt;option&gt;</CodeHighlight>, collapsible
                sections with <CodeHighlight>&lt;details&gt;</CodeHighlight> and{" "}
                <CodeHighlight>&lt;summary&gt;</CodeHighlight>, modal dialogs
                with <CodeHighlight>&lt;dialog&gt;</CodeHighlight>, grouping
                form controls with{" "}
                <CodeHighlight>&lt;fieldset&gt;</CodeHighlight> and{" "}
                <CodeHighlight>&lt;legend&gt;</CodeHighlight>, and improving
                form accessibility with{" "}
                <CodeHighlight>&lt;label&gt;</CodeHighlight>.
              </p>
            </div>
          ),
        },
      ],
    },
    // Select & Option
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 0,
          type: "element",
          label: (
            <div>
              Let&apos;s start with the{" "}
              <CodeHighlight>&lt;select&gt;</CodeHighlight> element. This
              element creates a dropdown menu. Each option inside is defined
              with the <CodeHighlight>&lt;option&gt;</CodeHighlight> tag.
            </div>
          ),
        },
        {
          id: 1,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<select>
  <option value="apple">Apple</option>
  <option value="banana">Banana</option>
  <option value="cherry">Cherry</option>
</select>`}
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
          id: 2,
          type: "element",
          label: (
            <Browser
              content={`<select>
  <option value="apple">Apple</option>
  <option value="banana">Banana</option>
  <option value="cherry">Cherry</option>
</select>`}
              title="Dropdown Menu Preview"
            />
          ),
        },
        {
          id: 3,
          type: "element",
          label: (
            <div>
              In this example, the <code>value</code> attributes define each
              option&apos;s value while the displayed text is what the user
              sees.
            </div>
          ),
        },
      ],
    },
    {
      submit: { label: "Practice" },
      content: [
        {
          id: 4,
          type: "element",
          label: (
            <DifficultyParagraph difficulty="easy" color="green">
              Quick test: Arrange the{" "}
              <CodeHighlight>{"<select>"}</CodeHighlight> element code
              correctly.
            </DifficultyParagraph>
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
                { label: `<select>\n`, priority: 0 },
                {
                  label: `  <option value="apple">Apple</option>\n`,
                  priority: 1,
                },
                {
                  label: `  <option value="banana">Banana</option>\n`,
                  priority: 1,
                },
                {
                  label: `  <option value="cherry">Cherry</option>\n`,
                  priority: 1,
                },
                { label: `</select>`, priority: 2 },
              ],
              answer: `<select>\n  <option value="apple">Apple</option>\n  <option value="banana">Banana</option>\n  <option value="cherry">Cherry</option>\n</select>`,
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
                title={["Arrange the dropdown menu code correctly"]}
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
    // Details & Summary
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 6,
          type: "element",
          label: (
            <div>
              Next, we explore the{" "}
              <CodeHighlight>&lt;details&gt;</CodeHighlight> and{" "}
              <CodeHighlight>&lt;summary&gt;</CodeHighlight> elements. These
              elements allow you to create collapsible sections on your webpage.
              The <CodeHighlight>&lt;summary&gt;</CodeHighlight> tag defines the
              visible heading.
            </div>
          ),
        },
        {
          id: 7,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<details>
  <summary>More Info</summary>
  <p>This is the hidden content.</p>
</details>`}
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
          id: 8,
          type: "element",
          label: (
            <Browser
              content={`<details>
  <summary>More Info</summary>
  <p>This is the hidden content.</p>
</details>`}
              title="Collapsible Section Preview"
            />
          ),
        },
        {
          id: 9,
          type: "element",
          label: <div>Click the summary to toggle the hidden content.</div>,
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
              Quick test: Arrange the collapsible section code correctly.
            </DifficultyParagraph>
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
                { label: `<details>\n`, priority: 0 },
                { label: `  <summary>More Info</summary>\n`, priority: 1 },
                {
                  label: `  <p>This is the hidden content.</p>\n`,
                  priority: 2,
                },
                { label: `</details>`, priority: 3 },
              ],
              answer: `<details>\n  <summary>More Info</summary>\n  <p>This is the hidden content.</p>\n</details>`,
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
                title={["Arrange the collapsible section code correctly"]}
                initialCode={choices.initialCode}
                response={{
                  positive: "Great job!",
                  negative: "Try again!",
                }}
              />
            );
          },
        },
      ],
    },
    // Dialog
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 12,
          type: "element",
          label: (
            <div>
              Now, let&apos;s introduce the{" "}
              <CodeHighlight>&lt;dialog&gt;</CodeHighlight> element. This
              element is used to create modal dialogs or popups.
            </div>
          ),
        },
        {
          id: 13,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<dialog id="myDialog">
  <p>This is a modal dialog.</p>
  <button onclick="document.getElementById('myDialog').close()">Close</button>
</dialog>
<button onclick="document.getElementById('myDialog').showModal()">Open Dialog</button>`}
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
          id: 14,
          type: "element",
          label: (
            <Browser
              content={`<dialog id="myDialog">
  <p>This is a modal dialog.</p>
  <button onclick="document.getElementById('myDialog').close()">Close</button>
</dialog>
<button onclick="document.getElementById('myDialog').showModal()">Open Dialog</button>`}
              title="Dialog Preview"
            />
          ),
        },
        {
          id: 15,
          type: "element",
          label: (
            <div>
              Note: The dialog element requires JavaScript to function properly.
            </div>
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
            <DifficultyParagraph difficulty="medium" color="orange">
              Quick test: Arrange the dialog element code correctly.
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
                { label: `<dialog id="myDialog">\n`, priority: 0 },
                { label: `  <p>This is a modal dialog.</p>\n`, priority: 1 },
                {
                  label: `  <button onclick="document.getElementById('myDialog').close()">Close</button>\n`,
                  priority: 2,
                },
                { label: `</dialog>\n`, priority: 3 },
                {
                  label: `<button onclick="document.getElementById('myDialog').showModal()">Open Dialog</button>`,
                  priority: 4,
                },
              ],
              answer: `<dialog id="myDialog">\n  <p>This is a modal dialog.</p>\n  <button onclick="document.getElementById('myDialog').close()">Close</button>\n</dialog>\n<button onclick="document.getElementById('myDialog').showModal()">Open Dialog</button>`,
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
                title={["Arrange the dialog element code correctly"]}
                initialCode={choices.initialCode}
                response={{
                  positive: "Great job!",
                  negative: "Try again!",
                }}
              />
            );
          },
        },
      ],
    },
    // Fieldset & Legend
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 18,
          type: "element",
          label: (
            <div>
              Next, we learn about the{" "}
              <CodeHighlight>&lt;fieldset&gt;</CodeHighlight> and{" "}
              <CodeHighlight>&lt;legend&gt;</CodeHighlight> elements. They group
              related form controls together, with{" "}
              <CodeHighlight>&lt;legend&gt;</CodeHighlight> providing a caption.
            </div>
          ),
        },
        {
          id: 19,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<fieldset>
  <legend>Personal Information</legend>
  <label for="name">Name:</label>
  <input type="text" id="name" name="name" />
</fieldset>`}
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
          id: 20,
          type: "element",
          label: (
            <Browser
              content={`<fieldset>
  <legend>Personal Information</legend>
  <label for="name">Name:</label>
  <input type="text" id="name" name="name" />
</fieldset>`}
              title="Fieldset & Legend Preview"
            />
          ),
        },
        {
          id: 21,
          type: "element",
          label: (
            <div>
              Notice that the <CodeHighlight>&lt;legend&gt;</CodeHighlight>{" "}
              element provides a title for the grouped form controls.
            </div>
          ),
        },
      ],
    },
    {
      submit: { label: "Practice" },
      content: [
        {
          id: 22,
          type: "element",
          label: (
            <DifficultyParagraph difficulty="easy" color="green">
              Quick test: Arrange the fieldset and legend code correctly.
            </DifficultyParagraph>
          ),
        },
        {
          id: 23,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => {
            const choices = {
              options: [
                { label: `<fieldset>\n`, priority: 0 },
                {
                  label: `  <legend>Personal Information</legend>\n`,
                  priority: 1,
                },
                { label: `  <label for="name">Name:</label>\n`, priority: 2 },
                {
                  label: `  <input type="text" id="name" name="name" />\n`,
                  priority: 3,
                },
                { label: `</fieldset>`, priority: 4 },
              ],
              answer: `<fieldset>\n  <legend>Personal Information</legend>\n  <label for="name">Name:</label>\n  <input type="text" id="name" name="name" />\n</fieldset>`,
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
                title={["Arrange the fieldset and legend code correctly"]}
                initialCode={choices.initialCode}
                response={{
                  positive: "Great job!",
                  negative: "Try again!",
                }}
              />
            );
          },
        },
      ],
    },
    // Label
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 24,
          type: "element",
          label: (
            <div>
              Finally, let&apos;s explore the{" "}
              <CodeHighlight>&lt;label&gt;</CodeHighlight> element. This element
              associates text with form controls to improve accessibility.
            </div>
          ),
        },
        {
          id: 25,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<label for="email">Email:</label>
<input type="email" id="email" name="email" />`}
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
          id: 26,
          type: "element",
          label: (
            <Browser
              content={`<label for="email">Email:</label>
<input type="email" id="email" name="email" />`}
              title="Label Element Preview"
            />
          ),
        },
        {
          id: 27,
          type: "element",
          label: (
            <div>
              <p>Press the label.</p>
              <br />
              <p>
                Notice how the <CodeHighlight>&lt;label&gt;</CodeHighlight>{" "}
                element links to the input via the &quot;for&quot; attribute,
                enhancing form accessibility.
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
          id: 28,
          type: "element",
          label: (
            <DifficultyParagraph difficulty="easy" color="green">
              Quick test: Arrange the label element code correctly.
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
                { label: `<label for="email">`, priority: 0 },
                { label: `Email:`, priority: 1 },
                { label: `</label>\n`, priority: 2 },
                {
                  label: `<input type="email" id="email" name="email" />`,
                  priority: 3,
                },
              ],
              answer: `<label for="email">Email:</label>\n<input type="email" id="email" name="email" />`,
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
                title={["Arrange the label element code correctly"]}
                initialCode={choices.initialCode}
                response={{
                  positive: "Great job!",
                  negative: "Try again!",
                }}
              />
            );
          },
        },
      ],
    },
    // Conclusion
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 30,
          type: "element",
          label: (
            <div>
              <p>
                Great work! We have learned several advanced HTML interactive
                elements that enhance forms and content interactivity.
              </p>
              <br />
              <p>
                Using these elements effectively can significantly improve your
                website&apos;s usability and accessibility.
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
          id: 31,
          type: "element",
          label: (
            <div>
              Congratulations! You have completed the lesson on HTML Advanced
              Elements.
            </div>
          ),
        },
      ],
    },
  ],
};
