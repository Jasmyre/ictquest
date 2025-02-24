import Browser from "@/components/Browser";
import CodeBlock from "@/components/Code";
import CodeHighlight from "@/components/CodeHighlight";
import { MultipleChoice } from "@/components/MultipleChoice";
import { LessonContent } from "./lessons";

export const inputsAndAttributes: LessonContent = {
  title: "Inputs and Attributes",
  contents: [
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 0,
          type: "element",
          label: (
            <div>
              Welcome to the Inputs and Attributes lesson! In this lesson
              we&apos;ll explore the <CodeHighlight>{"<input>"}</CodeHighlight>{" "}
              element and the many attributes that help control its behavior.
              We&apos;ll take it slow, see live previews, and even answer some
              questions along the way.
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
              The <CodeHighlight>{"<input>"}</CodeHighlight> element creates
              interactive controls in forms. For example, a simple text input
              looks like this:
            </div>
          ),
        },
        {
          id: 2,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<input />`}
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
              The <CodeHighlight>{"<input>"}</CodeHighlight> element creates
              interactive controls in forms. For example, a simple text input
              looks like this:
            </div>
          ),
        },
        {
          id: 2,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<input />`}
              initialCode={["", ""]}
            />
          ),
        },
        {
          id: 3,
          type: "element",
          label: (
            <Browser
              content={`<input type="text" />`}
              title="Preview: Simple Text Input"
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
              Lets proceed in attributes. Attributes are like a settings where
              you control how an elements works or displayed.
              <br />
              <br />
              Although not all, attributes are usually followed by{" "}
              <CodeHighlight>{`=""`}</CodeHighlight>. Inside the quotes are the
              values you put in an attribute.
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
              <p>
                The <CodeHighlight>{"placeholder"}</CodeHighlight> attribute
                gives a hint on what the input is.
              </p>
            </div>
          ),
        },
        {
          id: 2,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<input placeholder="This is a placeholder" />`}
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
              <p>
                The <CodeHighlight>{"placeholder"}</CodeHighlight> attribute
                give a hint on what the input is.
              </p>
            </div>
          ),
        },
        {
          id: 2,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<input placeholder="This is a placeholder" />`}
              initialCode={["", ""]}
            />
          ),
        },
        {
          id: 3,
          type: "element",
          label: (
            <Browser
              content={`<input placeholder="This is a placeholder" />`}
              title="Preview: Simple Text Input"
            />
          ),
        },
        {
          id: 4,
          type: "element",
          label: (
            <div>
              <p>
                In this example the{" "}
                <CodeHighlight>{"placeholder"}</CodeHighlight> attribute has the
                value of{" "}
                <CodeHighlight>{"This is a placeholder"}</CodeHighlight>.
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
          id: 4,
          type: "element",
          label: ({ setIsFinished }) => (
            <MultipleChoice
              setIsFinishedAction={setIsFinished}
              title={[
                "Which HTML element is used to create interactive controls in forms?",
              ]}
              choices={{
                options: ["<form>", "<input>", "<button>", "<select>"],
                answer: "<input>",
              }}
              response={{
                positive: "Correct! It's the <input> element.",
                negative: "Not quite, try again!",
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
          id: 5,
          type: "element",
          label: (
            <div>
              The <CodeHighlight>{"type"}</CodeHighlight> attribute defines the
              kind of input control. Options include{" "}
              <CodeHighlight>{`"text"`}</CodeHighlight>,{" "}
              <CodeHighlight>{`"email"`}</CodeHighlight>,{" "}
              <CodeHighlight>{`"password"`}</CodeHighlight>, etc.
              <br /> <br />
              The type <CodeHighlight>{"text"}</CodeHighlight> is the default
              type of an <CodeHighlight>{"<input>"}</CodeHighlight>.
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
          type: "element",
          label: (
            <div>
              Here&apos;s an example of a <CodeHighlight>text</CodeHighlight>{" "}
              input using the <CodeHighlight>type</CodeHighlight> attribute:
            </div>
          ),
        },
        {
          id: 7,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<input placeholder="Type something here" type="text" />`}
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
              Here&apos;s an example of a <CodeHighlight>text</CodeHighlight>{" "}
              input using the <CodeHighlight>type</CodeHighlight> attribute:
            </div>
          ),
        },
        {
          id: 7,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<input placeholder="Type something here" type="text" />`}
              initialCode={["", ""]}
            />
          ),
        },
        {
          id: 8,
          type: "element",
          label: (
            <Browser
              content={`<input placeholder="Type Something here." type="text" />`}
              title="Preview: Text Input with type='text'"
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
              Next, The type <CodeHighlight>{"password"}</CodeHighlight> works
              similar to text input, but it hides what you type.
              <br />
              <br />
              This is useful when entering sensitive info like passwords.
            </div>
          ),
        },
        {
          id: 7,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<input placeholder="Type something here" type="password" />`}
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
              Next, The type <CodeHighlight>{"password"}</CodeHighlight> works
              similar to text input, but it hides what you type.
              <br />
              <br />
              This is useful when entering sensitive info like passwords.
            </div>
          ),
        },
        {
          id: 7,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<input placeholder="Type something here" type="password" />`}
              initialCode={["", ""]}
            />
          ),
        },
        {
          id: 8,
          type: "element",
          label: (
            <Browser
              content={`<input placeholder="Type Something here." type="password" />`}
              title="Preview: Text Input with type='password'"
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
          label: ({ setIsFinished }) => (
            <MultipleChoice
              setIsFinishedAction={setIsFinished}
              title={["What will be the effect of setting type='password'?"]}
              choices={{
                options: [
                  "It shows text normally",
                  "It hides the text with dots",
                  "It accepts only numbers",
                  "It displays a calendar",
                ],
                answer: "It hides the text with dots",
              }}
              response={{
                positive: "Exactly! Password inputs mask the text.",
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
          id: 6,
          type: "element",
          label: (
            <div>
              <CodeHighlight>radio</CodeHighlight> type inputs let a user choose
              only one option from a set.
              <br /> <br />
              For example, picking your gender in a form. All radio buttons in
              the same group should have the same name.
            </div>
          ),
        },
        {
          id: 7,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<input type="radio" name="gender"/> <label>Male</label>\n<input type="radio" name="gender"/> <label>Female</label>`}
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
              <CodeHighlight>radio</CodeHighlight> type inputs let a user choose
              only one option from a set.
              <br /> <br />
              For example, picking your gender in a form. All radio buttons in
              the same group should have the same name.
            </div>
          ),
        },
        {
          id: 7,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<input type="radio" name="gender"/> <label>Male</label>\n<input type="radio" name="gender"/> <label>Female</label>`}
              initialCode={["", ""]}
            />
          ),
        },
        {
          id: 8,
          type: "element",
          label: (
            <Browser
              content={`<input type="radio" name="gender"/> <label>Male</label>\n<input type="radio" name="gender"/> <label>Female</label>`}
              title="Preview: Input with type='radio'"
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
              <CodeHighlight>checkbox</CodeHighlight> type let users select one
              or more options. They are handy for questions where more than one
              answer may apply, like picking your hobbies.
            </div>
          ),
        },
        {
          id: 7,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<input type="checkbox"/> <label>Drawing</label>\n<input type="checkbox"/> <label>Dancing</label>\n<input type="checkbox"/> <label>Singing</label>`}
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
              <CodeHighlight>checkbox</CodeHighlight> type let users select one
              or more options. They are handy for questions where more than one
              answer may apply, like picking your hobbies.
            </div>
          ),
        },
        {
          id: 7,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<input type="checkbox"/> <label>Drawing</label>\n<input type="checkbox"/> <label>Dancing</label>\n<input type="checkbox"/> <label>Singing</label>`}
              initialCode={["", ""]}
            />
          ),
        },
        {
          id: 8,
          type: "element",
          label: (
            <Browser
              content={`<input type="checkbox"/> <label>Drawing</label>\n<input type="checkbox"/> <label>Dancing</label>\n<input type="checkbox"/> <label>Singing</label>`}
              title="Preview: Input with type='checkbox'"
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
              <CodeHighlight>disabled</CodeHighlight> attribute. The{" "}
              <CodeHighlight>disabled</CodeHighlight> attribute is a boolean
              attribute that stops users from clicking, typing, or changing the
              input. Plus, when an input is disabled, it usually shows up as
              greyed out on the page, and its value won&apos;t be sent when you
              submit the form.
            </div>
          ),
        },
        {
          id: 7,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<input placeholder="Email:" type="text" disabled="true"/>\n<br/>\n<input placeholder="Password:" type="password"/>`}
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
              <CodeHighlight>disabled</CodeHighlight> attribute. The{" "}
              <CodeHighlight>disabled</CodeHighlight> attribute is a boolean
              attribute that stops users from clicking, typing, or changing the
              input. Plus, when an input is disabled, it usually shows up as
              greyed out on the page, and its value won&apos;t be sent when you
              submit the form.
            </div>
          ),
        },
        {
          id: 7,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<input placeholder="Email:" type="text" disabled="true"/>\n<br/>\n<input placeholder="Password:" type="password"/>`}
              initialCode={["", ""]}
            />
          ),
        },
        {
          id: 8,
          type: "element",
          label: (
            <Browser
              content={`<input placeholder="Email:" type="text" disabled="true"/>\n<br/>\n<input placeholder="Password:" type="password"/>`}
              title="Preview: input with disabled attribute."
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
            <div>
              The <CodeHighlight>{"value"}</CodeHighlight> attribute sets a
              default value for the input.
            </div>
          ),
        },
        {
          id: 15,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<input type="text" value="John Doe" />`}
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
            <div>
              The <CodeHighlight>{"value"}</CodeHighlight> attribute sets a
              default value for the input.
            </div>
          ),
        },
        {
          id: 15,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<input type="text" value="John Doe" />`}
              initialCode={["", ""]}
            />
          ),
        },
        {
          id: 16,
          type: "element",
          label: (
            <Browser
              content={`<input type="text" value="John Doe" />`}
              title="Preview: Input with Value"
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
          label: ({ setIsFinished }) => (
            <MultipleChoice
              setIsFinishedAction={setIsFinished}
              title={["What is the purpose of the 'value' attribute?"]}
              choices={{
                options: [
                  "To set a hint",
                  "To prefill the input with data",
                  "To identify the element",
                  "To disable the input",
                ],
                answer: "To prefill the input with data",
              }}
              response={{
                positive: "Exactly!",
                negative: "No, try again.",
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
          id: 18,
          type: "element",
          label: (
            <div>
              The <CodeHighlight>{"name"}</CodeHighlight> attribute identifies
              the input and the form data when submitted.
            </div>
          ),
        },
        {
          id: 19,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<input placeholder="Username:" type="text" name="username" />`}
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
              The <CodeHighlight>{"name"}</CodeHighlight> attribute identifies
              the input and the form data when submitted.
            </div>
          ),
        },
        {
          id: 19,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<input placeholder="Username:" type="text" name="username" />`}
              initialCode={["", ""]}
            />
          ),
        },
        {
          id: 20,
          type: "element",
          label: (
            <Browser
              content={`<input placeholder="Username:" type="text" name="username" />`}
              title="Preview: Input with Name"
            />
          ),
        },
        {
          id: 21,
          type: "element",
          label: (
            <div>
              This attribute does not do anything visually but it does help in
              naming inputs.
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
          type: "element",
          label: ({ setIsFinished }) => (
            <MultipleChoice
              setIsFinishedAction={setIsFinished}
              title={[
                "Which attribute is used to identify form data on submission?",
              ]}
              choices={{
                options: ["id", "name", "value", "placeholder"],
                answer: "name",
              }}
              response={{
                positive: "Correct!",
                negative: "That's not it, try again.",
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
          id: 22,
          type: "element",
          label: (
            <div>
              The <CodeHighlight>{"id"}</CodeHighlight> attribute uniquely
              identifies an element.
            </div>
          ),
        },
        {
          id: 23,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<input placeholder="Password:" type="password" id="userPassword" />`}
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
              The <CodeHighlight>{"id"}</CodeHighlight> attribute uniquely
              identifies an element.
            </div>
          ),
        },
        {
          id: 23,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<input placeholder="Password:" type="password" id="userPassword" />`}
              initialCode={["", ""]}
            />
          ),
        },
        {
          id: 24,
          type: "element",
          label: (
            <Browser
              content={`<input placeholder="Password:" type="password" id="userPassword" />`}
              title="Preview: ID attribute"
            />
          ),
        },
        {
          id: 25,
          type: "element",
          label: (
            <div>
              This attribute also does not appear visually but it is helpful in
              identifying <CodeHighlight>elements</CodeHighlight> uniquely.
            </div>
          ),
        },
      ],
    },
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 25,
          type: "element",
          label: ({ setIsFinished }) => (
            <MultipleChoice
              setIsFinishedAction={setIsFinished}
              title={["What is the purpose of the 'id' attribute?"]}
              choices={{
                options: [
                  "To style the element",
                  "To uniquely identify the element",
                  "To provide a placeholder",
                  "To set the input value",
                ],
                answer: "To uniquely identify the element",
              }}
              response={{
                positive: "Exactly right!",
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
          id: 26,
          type: "element",
          label: (
            <div>
              The <CodeHighlight>{"required"}</CodeHighlight> attribute forces
              the user to fill in the input.
            </div>
          ),
        },
        {
          id: 27,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<input placeholder="Email:" type="email" required />`}
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
            <div>
              The <CodeHighlight>{"required"}</CodeHighlight> attribute forces
              the user to fill in the input.
            </div>
          ),
        },
        {
          id: 27,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<input placeholder="Email:" type="email" required />`}
              initialCode={["", ""]}
            />
          ),
        },
        {
          id: 28,
          type: "element",
          label: (
            <Browser
              content={`<input placeholder="Email:" type="email" required />`}
              title="Preview: Required Attribute"
            />
          ),
        },
      ],
    },
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 29,
          type: "element",
          label: (
            <MultipleChoice
              setIsFinishedAction={() => {}}
              title={["What happens when an input is marked as 'required'?"]}
              choices={{
                options: [
                  "It is disabled",
                  "It must be filled before submitting",
                  "It has a default value",
                  "It auto-focuses",
                ],
                answer: "It must be filled before submitting",
              }}
              response={{
                positive: "Correct!",
                negative: "Not quite, try again.",
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
          id: 44,
          type: "element",
          label: (
            <div>
              The <CodeHighlight>{"maxlength"}</CodeHighlight> attribute limits
              the number of characters.
            </div>
          ),
        },
        {
          id: 45,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<input placeholder="Limited input:" type="text" maxlength="10" />`}
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
          id: 44,
          type: "element",
          label: (
            <div>
              The <CodeHighlight>{"maxlength"}</CodeHighlight> attribute limits
              the number of characters.
            </div>
          ),
        },
        {
          id: 45,
          type: "element",
          label: (
            <CodeBlock
              language="HTML"
              code={`<input placeholder="Limited input:" type="text" maxlength="10" />`}
              initialCode={["", ""]}
            />
          ),
        },
        {
          id: 46,
          type: "element",
          label: (
            <Browser
              content={`<input placeholder="Limited input:" type="text" maxlength="10" />`}
              title="Preview: Maxlength Attribute"
            />
          ),
        },
        {
          id: 47,
          type: "element",
          label: <div>Try typing 11 characters in the input. :)</div>,
        },
      ],
    },
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 47,
          type: "element",
          label: ({ setIsFinished }) => (
            <MultipleChoice
              setIsFinishedAction={setIsFinished}
              title={["Which attribute limits the number of characters?"]}
              choices={{
                options: ["pattern", "maxlength", "placeholder", "autofocus"],
                answer: "maxlength",
              }}
              response={{
                positive: "Correct!",
                negative: "That's not it, try again.",
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
          id: 64,
          type: "element",
          label: (
            <div>
              Great work! <br /> <br /> Now let&apos;s see if you can still
              remember input types and attributes we&apos;ve learned.
            </div>
          ),
        },
      ],
    },
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 63,
          type: "element",
          label: ({ setIsFinished }) => (
            <MultipleChoice
              setIsFinishedAction={setIsFinished}
              title={[
                "Which attribute would you use to ensure an input is filled before submitting?",
              ]}
              choices={{
                options: ["required", "disabled", "readonly", "placeholder"],
                answer: "required",
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
    {
      submit: { label: "Continue" },
      content: [
        {
          id: 65,
          type: "element",
          label: ({ setIsFinished }) => (
            <MultipleChoice
              setIsFinishedAction={setIsFinished}
              title={[
                "Which HTML element is used to create interactive controls in forms?",
              ]}
              choices={{
                options: ["<form>", "<input>", "<button>", "<select>"],
                answer: "<input>",
              }}
              response={{
                positive: "Correct! It's the <input> element.",
                negative: "Not quite, try again!",
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
          id: 66,
          type: "element",
          label: ({ setIsFinished }) => (
            <MultipleChoice
              setIsFinishedAction={setIsFinished}
              title={[
                "Which input type is used for entering a single line of text?",
              ]}
              choices={{
                options: ["text", "textarea", "password", "radio"],
                answer: "text",
              }}
              response={{
                positive: "Correct! It's the text type.",
                negative: "Not quite, try again!",
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
          id: 67,
          type: "element",
          label: ({ setIsFinished }) => (
            <MultipleChoice
              setIsFinishedAction={setIsFinished}
              title={["Which input type hides the characters as you type?"]}
              choices={{
                options: ["text", "password", "email", "number"],
                answer: "password",
              }}
              response={{
                positive: "Yup! It's the password type.",
                negative: "Not quite, try again!",
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
          id: 68,
          type: "element",
          label: ({ setIsFinished }) => (
            <MultipleChoice
              setIsFinishedAction={setIsFinished}
              title={[
                "Which input type allows users to select only one option from a group?",
              ]}
              choices={{
                options: ["checkbox", "radio", "file", "submit"],
                answer: "radio",
              }}
              response={{
                positive: "Yes! It's the radio type.",
                negative: "Not quite, try again!",
              }}
            />
          ),
        },
      ],
    },
    {
      submit: { label: "Finish" },
      content: [
        {
          id: 69,
          type: "element",
          label: (
            <div>
              Excellent! We’ve covered important concepts that will help you
              build a strong foundation. As you continue learning, keep
              experimenting and applying what you’ve learned. The more you
              practice, the more confident you’ll become.
              <br />
              <br />
              Keep going, stay curious, and see you next lesson!
            </div>
          ),
        },
      ],
    },
  ],
};