import Browser from "@/components/browser";
import CodeBlock from "@/components/code";
import CodeHighlight from "@/components/code-highlight";
import { DifficultyParagraph } from "@/components/difficulty-paragraph";
import { Practice } from "@/components/practice";
import { shuffle } from "@/lib/utils";
import type { LessonContent } from "../lessons";

export const htmlMediaElements: LessonContent = {
  title: "HTML Media Elements",
  contents: [
    {
      submit: { label: "Continue" },
      content: [
        {
          id: -1,
          type: "element",
          label: (
            <div>
              <p>Welcome to our lesson on HTML Media Elements!</p>
              <br />
              <p>
                In this lesson, we will explore each media element introduced in
                HTML5 one by one. We’ll start with the audio element, then move
                on to video, and finally look at how to add multiple sources and
                tracks for better compatibility and accessibility.
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
              Let&apos;s begin with the{" "}
              <CodeHighlight>&lt;audio&gt;</CodeHighlight> element. This element
              is used to embed sound files into your webpage. Common attributes
              include <CodeHighlight>controls</CodeHighlight> (to display
              play/pause buttons), <CodeHighlight>autoplay</CodeHighlight>, and{" "}
              <CodeHighlight>loop</CodeHighlight>.
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
              Here is a basic example of an{" "}
              <CodeHighlight>&lt;audio&gt;</CodeHighlight> element with controls
              enabled. Notice how the{" "}
              <CodeHighlight>&lt;source&gt;</CodeHighlight> tag inside it
              specifies the audio file and its type.
            </div>
          ),
        },
        {
          id: 2,
          type: "element",
          label: (
            <CodeBlock
              code={`<audio controls>
  <source src="/audio.mp3" type="audio/mpeg">
  Your browser does not support the audio element.
</audio>`}
              initialCode={["", ""]}
              language="HTML"
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
              Here is a basic example of an{" "}
              <CodeHighlight>&lt;audio&gt;</CodeHighlight> element with controls
              enabled. Notice how the{" "}
              <CodeHighlight>&lt;source&gt;</CodeHighlight> tag inside it
              specifies the audio file and its type.
            </div>
          ),
        },
        {
          id: 2,
          type: "element",
          label: (
            <CodeBlock
              code={`<audio controls>
  <source src="/audio.mp3" type="audio/mp3">
  Your browser does not support the audio element.
</audio>`}
              initialCode={["", ""]}
              language="HTML"
            />
          ),
        },
        {
          id: 3,
          type: "element",
          label: (
            <Browser
              content={`<audio controls>
  <source src="/audio.mp3" type="audio/mp3">
  Your browser does not support the audio element.
</audio>`}
              title="Audio Element Preview"
            />
          ),
        },
        {
          id: 4,
          type: "element",
          label: (
            <div>
              In this example, the <CodeHighlight>&lt;source&gt;</CodeHighlight>{" "}
              tag’s <CodeHighlight>src</CodeHighlight> attribute points to the
              audio file, and the <CodeHighlight>type</CodeHighlight> attribute
              informs the browser about the file format.
            </div>
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
              Now, let&apos;s jump in to the{" "}
              <CodeHighlight>&lt;video&gt;</CodeHighlight> element. This element
              embeds video content into your page and supports attributes like{" "}
              <CodeHighlight>controls</CodeHighlight>,{" "}
              <CodeHighlight>width</CodeHighlight>, and{" "}
              <CodeHighlight>height</CodeHighlight> for defining its size.
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
              Below is a basic example of a{" "}
              <CodeHighlight>&lt;video&gt;</CodeHighlight> element with
              controls. Notice how it also includes a{" "}
              <CodeHighlight>&lt;source&gt;</CodeHighlight> tag to specify the
              video file.
            </div>
          ),
        },
        {
          id: 7,
          type: "element",
          label: (
            <CodeBlock
              code={`<video controls width="320" height="240">
  <source src="/video.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>`}
              initialCode={["", ""]}
              language="HTML"
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
              Below is a basic example of a{" "}
              <CodeHighlight>&lt;video&gt;</CodeHighlight> element with
              controls. Notice how it also includes a{" "}
              <CodeHighlight>&lt;source&gt;</CodeHighlight> tag to specify the
              video file.
            </div>
          ),
        },
        {
          id: 7,
          type: "element",
          label: (
            <CodeBlock
              code={`<video controls width="320" height="240">
  <source src="/video.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>`}
              initialCode={["", ""]}
              language="HTML"
            />
          ),
        },
        {
          id: 8,
          type: "element",
          label: (
            <Browser
              content={`<video controls width="320" height="240">
  <source src="/video.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>`}
              title="Video Element Preview"
            />
          ),
        },
        {
          id: 9,
          type: "element",
          label: (
            <div>
              Notice that the <CodeHighlight>width</CodeHighlight> and{" "}
              <CodeHighlight>height</CodeHighlight> attributes set the
              dimensions of the video player.
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
          type: "element",
          label: (
            <div>
              <p>
                Now let’s learn about the{" "}
                <CodeHighlight>&lt;source&gt;</CodeHighlight> tag within media
                elements.
              </p>
              <br />
              <p>
                <CodeHighlight>{"<source>"}</CodeHighlight> tag allows you to
                specify multiple media sources, so the browser can choose the
                best one it supports.
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
          id: 11,
          type: "element",
          label: (
            <div>
              Here’s an example of an{" "}
              <CodeHighlight>&lt;audio&gt;</CodeHighlight> element using
              multiple <CodeHighlight>&lt;source&gt;</CodeHighlight> tags:
            </div>
          ),
        },
        {
          id: 12,
          type: "element",
          label: (
            <CodeBlock
              code={`<audio controls>
  <source src="/audio.mp3" type="audio/mpeg">
  <source src="/audio.ogg" type="audio/ogg">
  Your browser does not support the audio element.
</audio>`}
              initialCode={["", ""]}
              language="HTML"
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
              Here’s an example of an{" "}
              <CodeHighlight>&lt;audio&gt;</CodeHighlight> element using
              multiple <CodeHighlight>&lt;source&gt;</CodeHighlight> tags:
            </div>
          ),
        },
        {
          id: 15,
          type: "element",
          label: (
            <CodeBlock
              code={`<audio controls>
  <source src="/audio.mp3" type="audio/mpeg">
  <source src="/audio.ogg" type="audio/ogg">
  Your browser does not support the audio element.
</audio>`}
              initialCode={["", ""]}
              language="HTML"
            />
          ),
        },
        {
          id: 13,
          type: "element",
          label: (
            <Browser
              content={`<audio controls>
  <source src="/audio.mp3" type="audio/mpeg">
  <source src="/audio.ogg" type="audio/ogg">
  Your browser does not support the audio element.
</audio>`}
              title="Audio with Multiple Sources Preview"
            />
          ),
        },
        {
          id: 16,
          type: "element",
          label: (
            <div>
              <p>
                Notice that in this example, we used 2{" "}
                <CodeHighlight>{"<source>"}</CodeHighlight> tags.
              </p>
              <br />
              <p>
                This is 100% valid since the browser will only choose 1
                depending on which source it supports.
              </p>
              <br />
              <p>
                Furthermore, if both sources are not supported the &quot;
                <CodeHighlight>
                  Your browser does not support the audio element
                </CodeHighlight>
                &quot; text will be displayed instead.
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
          id: 14,
          type: "element",
          label: (
            <div>
              Next, we introduce the{" "}
              <CodeHighlight>&lt;track&gt;</CodeHighlight> tag, which is used
              with the <CodeHighlight>&lt;video&gt;</CodeHighlight> element to
              provide text tracks like subtitles or captions. Its key attributes
              include <CodeHighlight>src</CodeHighlight>,{" "}
              <CodeHighlight>kind</CodeHighlight> (e.g., &quot;subtitles&quot;),{" "}
              <CodeHighlight>srclang</CodeHighlight> (specifying the language),
              and <CodeHighlight>label</CodeHighlight> (a user-friendly title).
            </div>
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
              Here’s an example of a{" "}
              <CodeHighlight>&lt;video&gt;</CodeHighlight> element that includes
              a <CodeHighlight>&lt;track&gt;</CodeHighlight> tag for subtitles:
            </div>
          ),
        },
        {
          id: 16,
          type: "element",
          label: (
            <CodeBlock
              code={`<video controls width="320" height="240">
  <source src="videofile.mp4" type="video/mp4">
  <track src="subtitles_en.vtt" kind="subtitles" srclang="en" label="English">
  Your browser does not support the video tag.
</video>`}
              initialCode={["", ""]}
              language="HTML"
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
              Here’s an example of a{" "}
              <CodeHighlight>&lt;video&gt;</CodeHighlight> element that includes
              a <CodeHighlight>&lt;track&gt;</CodeHighlight> tag for subtitles:
            </div>
          ),
        },
        {
          id: 16,
          type: "element",
          label: (
            <CodeBlock
              code={`<video controls width="320" height="240">
  <source src="videofile.mp4" type="video/mp4">
  <track src="subtitles_en.vtt" kind="subtitles" srclang="en" label="English">
  Your browser does not support the video tag.
</video>`}
              initialCode={["", ""]}
              language="HTML"
            />
          ),
        },
        {
          id: 17,
          type: "element",
          label: (
            <Browser
              content={`<video controls width="320" height="240">
  <source src="videofile.mp4" type="video/mp4">
  <track src="subtitles_en.vtt" kind="subtitles" srclang="en" label="English">
  Your browser does not support the video tag.
</video>`}
              title="Video with Subtitles Preview"
            />
          ),
        },
        {
          id: 18,
          type: "element",
          label: (
            <div>
              In this example, the <CodeHighlight>&lt;track&gt;</CodeHighlight>{" "}
              tag specifies the subtitle file via its{" "}
              <CodeHighlight>src</CodeHighlight> attribute. The{" "}
              <CodeHighlight>kind</CodeHighlight> attribute indicates that this
              track is for subtitles, while{" "}
              <CodeHighlight>srclang</CodeHighlight> defines the language and{" "}
              <CodeHighlight>label</CodeHighlight> gives it a name.
            </div>
          ),
        },
      ],
    },
    {
      submit: { label: "Practice" },
      content: [
        {
          id: 19,
          type: "element",
          label: (
            <DifficultyParagraph color="orange" difficulty="medium">
              Test: Arrange the <CodeHighlight>&lt;audio&gt;</CodeHighlight>{" "}
              element code correctly.
            </DifficultyParagraph>
          ),
        },
        {
          id: 20,
          type: "element",
          label: ({
            setIsFinished,
            setNumberOfCorrect,
            setNumberOfInCorrect,
          }) => {
            const choices = {
              options: [
                { label: "<audio controls>\n", priority: 0 },
                {
                  label: `  <source src="/audio.mp3" type="audio/mpeg">\n`,
                  priority: 1,
                },
                {
                  label: `  <source src="/audio.ogg" type="audio/ogg">\n`,
                  priority: 1,
                },
                {
                  label: "  Your browser does not support the audio element.\n",
                  priority: 2,
                },
                { label: "</audio>", priority: 3 },
              ],
              answer: `<audio controls>\n  <source src="/audio.mp3" type="audio/mpeg">\n  <source src="/audio.ogg" type="audio/ogg">\n  Your browser does not support the audio element.\n</audio>`,
              initialCode: ["", ""],
            };
            const shuffledData = shuffle(choices.options);
            return (
              <Practice
                choices={choices}
                initialCode={choices.initialCode}
                response={{
                  positive: "Great job!",
                  negative: "That’s not quite right. Try again!",
                }}
                setIsFinishedAction={setIsFinished}
                setNumberOfCorrectAction={setNumberOfCorrect}
                setNumberOfInCorrectAction={setNumberOfInCorrect}
                shuffledData={shuffledData}
                title={["Arrange the <audio> element code correctly"]}
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
          id: 21,
          type: "element",
          label: (
            <DifficultyParagraph color="orange" difficulty="medium">
              Test: Arrange the <CodeHighlight>&lt;video&gt;</CodeHighlight>{" "}
              element code correctly.
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
                {
                  label: `<video controls width="320" height="240">\n`,
                  priority: 0,
                },
                {
                  label: `  <source src="/video.mp4" type="video/mp4">\n`,
                  priority: 1,
                },
                {
                  label: "  Your browser does not support the video tag.\n",
                  priority: 2,
                },
                { label: "</video>", priority: 3 },
              ],
              answer: `<video controls width="320" height="240">\n  <source src="/video.mp4" type="video/mp4">\n  Your browser does not support the video tag.\n</video>`,
              initialCode: ["", ""],
            };
            const shuffledData = shuffle(choices.options);
            return (
              <Practice
                choices={choices}
                initialCode={choices.initialCode}
                response={{
                  positive: "Great job!",
                  negative: "That’s not quite right. Try again!",
                }}
                setIsFinishedAction={setIsFinished}
                setNumberOfCorrectAction={setNumberOfCorrect}
                setNumberOfInCorrectAction={setNumberOfInCorrect}
                shuffledData={shuffledData}
                title={["Arrange the <video> element code correctly"]}
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
          type: "element",
          label: (
            <div>
              <p>We have learned the key HTML media elements:</p>

              <br />
              <ul className="list-disc">
                <li className="list-disc">
                  The <CodeHighlight>&lt;audio&gt;</CodeHighlight> element
                  embeds sound files.
                </li>
                <li className="list-disc">
                  The <CodeHighlight>&lt;video&gt;</CodeHighlight> element
                  embeds video files.
                </li>
                <li className="list-disc">
                  The <CodeHighlight>&lt;source&gt;</CodeHighlight> tag is used
                  to specify multiple media sources.
                </li>
                <li className="list-disc">
                  The <CodeHighlight>&lt;track&gt;</CodeHighlight> tag provides
                  text tracks for subtitles or captions.
                </li>
              </ul>
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
          type: "element",
          label: (
            <div>
              Congratulations! You have completed the lesson on HTML Media
              Elements.
            </div>
          ),
        },
      ],
    },
  ],
};
