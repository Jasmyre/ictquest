import CodeBlock from "@/components/Code";
import CodeHighlight from "@/components/CodeHighlight";
import { LessonContent } from "../lessons";
import Browser from "@/components/Browser";

export const htmlForm: LessonContent = {
  title: "HTML Forms",
  contents: [
    {
      submit: { label: "Continue" },
      content: [
        {
          id: -1,
          type: "element",
          label: (
            <div>
              <p>Welcome to the HTML Forms lesson!</p>
              <br />
              <p>
                In this lesson, you&apos;ll learn how to build forms in HTML by
                exploring the form container and various interactive input
                elements. We&apos;ll cover text fields, email, password, number
                inputs, checkboxes, radio buttons, textareas, and finally the
                submit button.
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
              <p>
                The <CodeHighlight>&lt;form&gt;</CodeHighlight> element is the
                container that holds all form controls.
              </p>
              <p>
                Key attributes include <CodeHighlight>action</CodeHighlight>{" "}
                (the URL to send data to) and{" "}
                <CodeHighlight>method</CodeHighlight> (usually &quot;get&quot;
                or &quot;post&quot;).
              </p>
            </div>
          ),
        },
        {
          id: 1,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<form action="/submit" method="post">
  <!-- Form elements go here -->
</form>`}
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
          id: 3,
          type: "element",
          label: (
            <div>
              <p>
                Let&apos;s add a text input field for general user input. Use
                the{" "}
                <CodeHighlight>
                  &lt;input type=&quot;text&quot;&gt;
                </CodeHighlight>{" "}
                element along with a{" "}
                <CodeHighlight>&lt;label&gt;</CodeHighlight> for accessibility.
              </p>
            </div>
          ),
        },
        {
          id: 4,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<form action="/submit" method="post">
  <label for="username">Username:</label>
  <input type="text" id="username" name="username" />
</form>`}
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
          id: 6,
          type: "element",
          label: (
            <div>
              <p>
                For capturing email addresses, use the{" "}
                <CodeHighlight>
                  &lt;input type=&quot;email&quot;&gt;
                </CodeHighlight>{" "}
                element. This input type provides basic email format validation.
              </p>
            </div>
          ),
        },
        {
          id: 7,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<form action="/submit" method="post">
  <label for="email">Email:</label>
  <input type="email" id="email" name="email" />
</form>`}
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
          id: 6,
          type: "element",
          label: (
            <div>
              <p>
                For capturing email addresses, use the{" "}
                <CodeHighlight>
                  &lt;input type=&quot;email&quot;&gt;
                </CodeHighlight>{" "}
                element. This input type provides basic email format validation.
              </p>
            </div>
          ),
        },
        {
          id: 7,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<form action="/submit" method="post">
  <label for="email">Email:</label>
  <input type="email" id="email" name="email" />
</form>`}
              initialCode={["", ""]}
            />
          ),
        },
        {
          id: 20,
          type: "element",
          label: (
            <Browser
              content={`<form action="/submit" method="post">
  <label for="email">Email:</label>
  <input type="email" id="email" name="email" />
</form>`}
              title="Browser"
            />
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
              <p>
                Use the{" "}
                <CodeHighlight>
                  &lt;input type=&quot;password&quot;&gt;
                </CodeHighlight>{" "}
                element to create a password field. This masks user input for
                privacy.
              </p>
            </div>
          ),
        },
        {
          id: 10,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<form action="/submit" method="post">
  <label for="pwd">Password:</label>
  <input type="password" id="pwd" name="pwd" />
</form>`}
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
          id: 9,
          type: "element",
          label: (
            <div>
              <p>
                Use the{" "}
                <CodeHighlight>
                  &lt;input type=&quot;password&quot;&gt;
                </CodeHighlight>{" "}
                element to create a password field. This masks user input for
                privacy.
              </p>
            </div>
          ),
        },
        {
          id: 10,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<form action="/submit" method="post">
  <label for="pwd">Password:</label>
  <input type="password" id="pwd" name="pwd" />
</form>`}
              initialCode={["", ""]}
            />
          ),
        },
        {
          id: 20,
          type: "element",
          label: (
            <Browser
              content={`<form action="/submit" method="post">
  <label for="pwd">Password:</label>
  <input type="password" id="pwd" name="pwd" />
</form>`}
              title="Browser"
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
              <p>
                For numeric input, use the{" "}
                <CodeHighlight>
                  &lt;input type=&quot;number&quot;&gt;
                </CodeHighlight>{" "}
                element.
              </p>
            </div>
          ),
        },
        {
          id: 13,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<form action="/submit" method="post">
  <label for="age">Age:</label>
  <input type="number" id="age" name="age" />
</form>`}
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
              <p>
                For numeric input, use the{" "}
                <CodeHighlight>
                  &lt;input type=&quot;number&quot;&gt;
                </CodeHighlight>{" "}
                element.
              </p>
            </div>
          ),
        },
        {
          id: 13,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<form action="/submit" method="post">
  <label for="age">Age:</label>
  <input type="number" id="age" name="age" />
</form>`}
              initialCode={["", ""]}
            />
          ),
        },
        {
          id: 20,
          type: "element",
          label: (
            <Browser
              content={`<form action="/submit" method="post">
  <label for="pwd">Pa<form action="/submit" method="post">
  <label for="age">Age:</label>
  <input type="number" id="age" name="age" />
</form>`}
              title="Browser"
            />
          ),
        },
      ],
    },
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 15,
          type: "element",
          label: (
            <div>
              <p>
                Checkboxes allow users to select multiple options from a list.
              </p>
              <p>
                They are created using{" "}
                <CodeHighlight>
                  &lt;input type=&quot;checkbox&quot;&gt;
                </CodeHighlight>{" "}
                alongside a <CodeHighlight>&lt;label&gt;</CodeHighlight>.
              </p>
            </div>
          ),
        },
        {
          id: 16,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<form action="/submit" method="post">
  <input type="checkbox" id="subscribe" name="subscribe" value="yes">
  <label for="subscribe">Subscribe to newsletter</label>
</form>`}
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
          id: 15,
          type: "element",
          label: (
            <div>
              <p>
                Checkboxes allow users to select multiple options from a list.
              </p>
              <p>
                They are created using{" "}
                <CodeHighlight>
                  &lt;input type=&quot;checkbox&quot;&gt;
                </CodeHighlight>{" "}
                alongside a <CodeHighlight>&lt;label&gt;</CodeHighlight>.
              </p>
            </div>
          ),
        },
        {
          id: 16,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<form action="/submit" method="post">
  <input type="checkbox" id="subscribe" name="subscribe" value="yes">
  <label for="subscribe">Subscribe to newsletter</label>
</form>`}
              initialCode={["", ""]}
            />
          ),
        },
        {
          id: 20,
          type: "element",
          label: (
            <Browser
              content={`<form action="/submit" method="post">
  <input type="checkbox" id="subscribe" name="subscribe" value="yes">
  <label for="subscribe">Subscribe to newsletter</label>
</form>`}
              title="Browser"
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
                Radio buttons allow users to select only one option from a
                group.
              </p>
              <p>
                They are implemented with{" "}
                <CodeHighlight>
                  &lt;input type=&quot;radio&quot;&gt;
                </CodeHighlight>{" "}
                and paired with labels.
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
              code={`<form action="/submit" method="post">
  <input type="radio" id="male" name="gender" value="male">
  <label for="male">Male</label>
  <input type="radio" id="female" name="gender" value="female">
  <label for="female">Female</label>
</form>`}
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
                Radio buttons allow users to select only one option from a
                group.
              </p>
              <p>
                They are implemented with{" "}
                <CodeHighlight>
                  &lt;input type=&quot;radio&quot;&gt;
                </CodeHighlight>{" "}
                and paired with labels.
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
              code={`<form action="/submit" method="post">
  <input type="radio" id="male" name="gender" value="male">
  <label for="male">Male</label>
  <input type="radio" id="female" name="gender" value="female">
  <label for="female">Female</label>
</form>`}
              initialCode={["", ""]}
            />
          ),
        },
        {
          id: 20,
          type: "element",
          label: (
            <Browser
              content={`<form action="/submit" method="post">
  <input type="radio" id="male" name="gender" value="male">
  <label for="male">Male</label>
  <input type="radio" id="female" name="gender" value="female">
  <label for="female">Female</label>
</form>`}
              title="Browser"
            />
          ),
        },
      ],
    },
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 21,
          type: "element",
          label: (
            <div>
              <p>
                For longer, multi-line text input, use the{" "}
                <CodeHighlight>&lt;textarea&gt;</CodeHighlight> element.
              </p>
            </div>
          ),
        },
        {
          id: 22,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<form action="/submit" method="post">
  <label for="message">Message:</label>
  <textarea id="message" name="message" rows="4" cols="50"></textarea>
</form>`}
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
          id: 21,
          type: "element",
          label: (
            <div>
              <p>
                For longer, multi-line text input, use the{" "}
                <CodeHighlight>&lt;textarea&gt;</CodeHighlight> element.
              </p>
            </div>
          ),
        },
        {
          id: 22,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<form action="/submit" method="post">
  <label for="message">Message:</label>
  <textarea id="message" name="message" rows="4" cols="50"></textarea>
</form>`}
              initialCode={["", ""]}
            />
          ),
        },
        {
          id: 20,
          type: "element",
          label: (
            <Browser
              content={`<form action="/submit" method="post">
  <label for="message">Message:</label>
  <textarea id="message" name="message" rows="4" cols="50"></textarea>
</form>`}
              title="Browser"
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
          type: "element",
          label: (
            <div>
              <p>Finally, add a submit button to send the form data.</p>
              <p>
                Use the <CodeHighlight>&lt;button&gt;</CodeHighlight> element
                with <CodeHighlight>type=&quot;submit&quot;</CodeHighlight>.
              </p>
            </div>
          ),
        },
        {
          id: 25,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<form action="/submit" method="post">
  <!-- Other form elements -->
  <button type="submit">Submit</button>
</form>`}
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
          id: 24,
          type: "element",
          label: (
            <div>
              <p>Finally, add a submit button to send the form data.</p>
              <p>
                Use the <CodeHighlight>&lt;button&gt;</CodeHighlight> element
                with <CodeHighlight>type=&quot;submit&quot;</CodeHighlight>.
              </p>
            </div>
          ),
        },
        {
          id: 25,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<form action="/submit" method="post">
  <!-- Other form elements -->
  <button type="submit">Submit</button>
</form>`}
              initialCode={["", ""]}
            />
          ),
        },
        {
          id: 20,
          type: "element",
          label: (
            <Browser
              content={`<form action="/submit" method="post">
  <!-- Other form elements -->
  <button type="submit">Submit</button>
</form>`}
              title="Browser"
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
              <p>
                Great work! Now let&apos;s try if you can answer these next
                questions! ;)
              </p>
            </div>
          ),
        },
      ],
    },

    // {
    //   submit: { label: "Practice" },
    //   content: [
    //     {
    //       id: 2,
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
    //           title={[
    //             "Which attribute of the <form> element specifies where to send form data?",
    //           ]}
    //           choices={{
    //             options: ["action", "method", "enctype", "target"],
    //             answer: "action",
    //           }}
    //           response={{
    //             positive:
    //               "Correct! The 'action' attribute sets the destination.",
    //             negative:
    //               "That's not correct. Remember, 'action' is used to specify the destination URL.",
    //           }}
    //         />
    //       ),
    //     },
    //   ],
    // },
    // {
    //   submit: { label: "Practice" },
    //   content: [
    //     {
    //       id: 26,
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
    //           title={["What should the type attribute be for a submit button?"]}
    //           choices={{
    //             options: ["button", "submit", "reset", "text"],
    //             answer: "submit",
    //           }}
    //           response={{
    //             positive: "Correct!",
    //             negative: "Incorrect. The correct type is 'submit'.",
    //           }}
    //         />
    //       ),
    //     },
    //   ],
    // },
    // {
    //   submit: { label: "Practice" },
    //   content: [
    //     {
    //       id: 5,
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
    //           title={["Which input type is used for a standard text field?"]}
    //           choices={{
    //             options: ["text", "email", "password", "number"],
    //             answer: "text",
    //           }}
    //           response={{
    //             positive: "Correct!",
    //             negative:
    //               "Incorrect. The standard text field uses type 'text'.",
    //           }}
    //         />
    //       ),
    //     },
    //   ],
    // },
    // {
    //   submit: { label: "Practice" },
    //   content: [
    //     {
    //       id: 8,
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
    //           title={["Which input type is ideal for email addresses?"]}
    //           choices={{
    //             options: ["text", "email", "password", "number"],
    //             answer: "email",
    //           }}
    //           response={{
    //             positive: "Correct!",
    //             negative: "Incorrect. The correct type is 'email'.",
    //           }}
    //         />
    //       ),
    //     },
    //   ],
    // },
    // {
    //   submit: { label: "Practice" },
    //   content: [
    //     {
    //       id: 11,
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
    //           title={["Which input type should you use for a password field?"]}
    //           choices={{
    //             options: ["text", "password", "email", "number"],
    //             answer: "password",
    //           }}
    //           response={{
    //             positive: "Correct!",
    //             negative:
    //               "That's not right. The password field uses type 'password'.",
    //           }}
    //         />
    //       ),
    //     },
    //   ],
    // },
    // {
    //   submit: { label: "Practice" },
    //   content: [
    //     {
    //       id: 14,
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
    //           title={["Which input type is used for numeric data?"]}
    //           choices={{
    //             options: ["text", "number", "password", "email"],
    //             answer: "number",
    //           }}
    //           response={{
    //             positive: "Correct!",
    //             negative:
    //               "Incorrect. The type 'number' is used for numeric input.",
    //           }}
    //         />
    //       ),
    //     },
    //   ],
    // },
    // {
    //   submit: { label: "Practice" },
    //   content: [
    //     {
    //       id: 17,
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
    //           title={["Checkboxes allow users to select:"]}
    //           choices={{
    //             options: [
    //               "Only one option",
    //               "Multiple options",
    //               "No options",
    //               "All options",
    //             ],
    //             answer: "Multiple options",
    //           }}
    //           response={{
    //             positive: "Correct!",
    //             negative:
    //               "Incorrect. Checkboxes are designed for multiple selections.",
    //           }}
    //         />
    //       ),
    //     },
    //   ],
    // },
    // {
    //   submit: { label: "Practice" },
    //   content: [
    //     {
    //       id: 20,
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
    //           title={["Radio buttons allow users to select:"]}
    //           choices={{
    //             options: [
    //               "Multiple options",
    //               "A single option",
    //               "All options",
    //               "No option",
    //             ],
    //             answer: "A single option",
    //           }}
    //           response={{
    //             positive: "Correct!",
    //             negative:
    //               "Incorrect. Radio buttons allow only one selection per group.",
    //           }}
    //         />
    //       ),
    //     },
    //   ],
    // },
    // {
    //   submit: { label: "Practice" },
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
    //           title={["Which element is used for multi-line text input?"]}
    //           choices={{
    //             options: ["input", "textarea", "select", "button"],
    //             answer: "textarea",
    //           }}
    //           response={{
    //             positive: "Correct!",
    //             negative:
    //               "Incorrect. The 'textarea' element is used for multi-line input.",
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
    //       id: 27,
    //       type: "element",
    //       label: (
    //         <div>
    //           <p>
    //             Congratulations! You have completed the lesson on HTML Forms.
    //           </p>
    //           <br />
    //           <p>
    //             You learned how to create a form container and add various input
    //             fields, checkboxes, radio buttons, textareas, and a submit
    //             button.
    //           </p>
    //           <p>
    //             Practice these elements to build interactive and accessible web
    //             forms.
    //           </p>
    //         </div>
    //       ),
    //     },
    //   ],
    // },
  ],
};
