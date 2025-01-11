import { ReactNode } from "react";
import SubmitButton from "@/components/SubmitButton";
import BackButton from "../../../../../components/BackButton";
import Layout from "../../../../components/layout";
import Index3 from "@/components/lessons/html_basics/intro_to_html/Index3";
import Index2 from "@/components/lessons/html_basics/intro_to_html/Index2";
import Index1 from "@/components/lessons/html_basics/intro_to_html/Index1";
import Link from "next/link";

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
              type: "element",
              label: <Index1 />,
            },
          ],
        },
        {
          submit: {
            label: "continue",
          },
          content: [
            {
              id: 1,
              type: "element",
              label: <Index2 />,
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
              label: <Index3 />,
            },
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
              <div className="prose max-w-none ">
                {content.content.map((text) => {
                  return (
                    <div key={text.id}>
                      {text.type == "text" ? <p>{text.label}</p> : null}
                      {text.type == "element" ? <div>{text.label}</div> : null}
                      <br />
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 flex justify-between">
                <BackButton>Go Back</BackButton>
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
