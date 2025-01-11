import SubmitButton from "@/components/SubmitButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import BackButton from "../../../../../components/BackButton";
import Layout from "../../../../components/layout";
import { ReactNode } from "react";
import Browser from "../../../../../components/Browser";
import CodeBlock from "@/components/Code";

interface LessonContentProps {
  [topic: string]: {
    [subtopic: string]: {
      title: string;
      contents: {
        submit: {
          label: string;
        };
        content: {
          type: string;
          label: string | ReactNode;
          id: number;
        }[];
      }[];
    };
  };
}

const lessonContent: LessonContentProps = {
  "html-basics": {
    "intro-to-html": {
      title: "Intro To Html",
      contents: [
        {
          submit: {
            label: "Continue",
          },
          content: [
            {
              id: 0,
              type: "text",
              label: "Before you realize it, we'll be creating real-life projects. Let's start with HTML."
            }
          ]
        },
        {
          submit: {
            label: "continue",
          },
          content: [
            {
              id: 1,
              type: "text",
              label:
                "Hypertext Markup Language, or HTML, is the computer language that structures the web pages on the internet.",
            },
            {
              id: 2,
              type: "text",
              label:
                "On top of HTML, you can build stunning web pages with buttons, images, and lots more.",
            },
            {
              id: 3,
              type: "element",
              label: (
                <Browser>
                  <div className="flex flex-col items-center justify-center text-center">
                    <h1 className="text-blue-500">Guess the letter</h1>
                    <br />
                    <h1>C A _</h1>
                    <br />
                    <div className="flex gap-2">
                      <button className="hover:bg-gray-200">H</button>
                      <button className="hover:bg-gray-200">Y</button>
                      <button className="hover:bg-gray-200">T</button>
                    </div>
                  </div>
                </Browser>
              ),
            },
          ],
        },
        {
          submit: {
            label: "submit",
          },
          content: [
            {
              id: 4,
              type: "element",
              label: (
                <p>
                  By adding the HTML code{" "}
                  <code className="border bg-accent  rounded font-bold text-accent-foreground">
                    &lt;button&gt;Like&lt;/button&gt;
                  </code>
                  , you can create a button with the label &quot;Like&quot;.
                </p>
              ),
            },
            {
              id: 5,
              type: "element",
              label: (
                <CodeBlock language="HTML">
                  &lt;button&gt;Like&lt;/button&gt;
                </CodeBlock>
              )
            }
          ],
        },
      ],
    },
  },
};

export default async function LessonPage(
  props: Readonly<{
    params: Promise<{ topic: string; subtopic: string; index: string }>;
  }>,
) {
  const params = await props.params;
  const lesson =
    lessonContent[params.topic as keyof typeof lessonContent]?.[
      params.subtopic
    ];

  if (!lesson) {
    return <div>Lesson not found</div>;
  }

  const content = lesson.contents[Number(params.index)];

  let index = Number(params.index);

  index += 1;

  return (
    <Layout>
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-white">
              {lesson.title}
            </h1>
          </div>
        </header>
        <main className="min-h-[65vh]">
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-gray-900"></CardTitle>
                </CardHeader>
                <CardContent className="min-h-[65vh]">
                  <div className="prose max-w-none ">
                    {content.content.map((text) => {
                      return (
                        <div key={text.id}>
                          {text.type == "text" ? <p>{text.label}</p> : null}
                          {text.type == "element" ? (
                            <div>{text.label}</div>
                          ) : null}
                          <br />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
              <div className="mt-6 flex justify-between">
                <BackButton>
                  Go Back
                </BackButton>
                <Link
                  href={`/lessons/${params.topic}/${params.subtopic}/${index}`}
                >
                  <SubmitButton label={content.submit.label}></SubmitButton>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}
